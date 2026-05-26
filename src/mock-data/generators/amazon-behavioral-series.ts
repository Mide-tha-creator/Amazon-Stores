/** Seeded PRNG for reproducible mock data */
export function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function toIsoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Piecewise baseline envelope across the seller history timeline */
function phaseBaseline(progress: number): number {
  const t = clamp(progress, 0, 1);

  if (t < 0.4) {
    return 0.9 + 0.1 * (t / 0.4);
  }
  if (t < 0.45) {
    return 0.98;
  }
  if (t < 0.85) {
    const decline = (t - 0.45) / 0.4;
    return 0.98 - decline * 0.76;
  }
  const tail = (t - 0.85) / 0.15;
  return 0.22 - tail * 0.1;
}

export interface GenerateAmazonBehavioralOptions {
  startDate: string;
  endDate: string;
  seed?: number;
  fulfillmentMultiplier?: number;
  targetUnits?: number;
  targetSales?: number;
}

export interface AmazonDailyPoint {
  date: string;
  unitsOrdered: number;
  orderedProductSales: number;
}

/** Pre-scale peak target (~4k units before calibration on enterprise-scale stores) */
const RAW_BASE_UNITS = 1050;

export function generateAmazonBehavioralSeries(
  options: GenerateAmazonBehavioralOptions
): AmazonDailyPoint[] {
  const rand = mulberry32(options.seed ?? 42);
  const volatility = options.fulfillmentMultiplier ?? 1;
  const start = new Date(options.startDate);
  const end = new Date(options.endDate);

  const dates: string[] = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    dates.push(toIsoDate(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  const dayCount = dates.length;
  if (dayCount === 0) return [];

  const spikeStart = Math.floor(dayCount * 0.2);
  const spikeEnd = Math.floor(dayCount * 0.55);
  const spikeCount = 10 + Math.floor(rand() * 9);
  const spikeDays = new Set<number>();

  while (spikeDays.size < spikeCount) {
    const idx = spikeStart + Math.floor(rand() * Math.max(1, spikeEnd - spikeStart));
    spikeDays.add(idx);
  }

  const recoveryDays = new Set<number>();
  const recoveryStart = Math.floor(dayCount * 0.82);
  const recoveryCount = 4 + Math.floor(rand() * 4);
  while (recoveryDays.size < recoveryCount) {
    recoveryDays.add(
      recoveryStart + Math.floor(rand() * Math.max(1, dayCount - recoveryStart))
    );
  }

  const rawUnits: number[] = [];
  let noiseWalk = 0;

  for (let i = 0; i < dayCount; i++) {
    const progress = dayCount > 1 ? i / (dayCount - 1) : 0;
    const baseline = phaseBaseline(progress);

    noiseWalk += (rand() - 0.5) * 0.14 * volatility;
    noiseWalk *= 0.82;
    noiseWalk = clamp(noiseWalk, -0.42 * volatility, 0.42 * volatility);

    const jitter = (rand() - 0.5) * 0.38 * volatility;
    const weekly = 1 + 0.08 * Math.sin((i / 7) * Math.PI * 2);
    const noiseFactor = clamp(1 + noiseWalk + jitter, 0.45, 1.65);

    let spikeMultiplier = 1;
    if (spikeDays.has(i)) {
      spikeMultiplier = 2.5 + rand() * 2 * volatility;
    } else if (recoveryDays.has(i)) {
      spikeMultiplier = 1.2 + rand() * 0.35;
    }

    const tailDampen = progress > 0.8 ? 0.75 + (1 - progress) * 1.25 : 1;
    const raw =
      RAW_BASE_UNITS * baseline * spikeMultiplier * noiseFactor * weekly * tailDampen;

    rawUnits.push(Math.max(0, raw));
  }

  const rawSum = rawUnits.reduce((s, u) => s + u, 0);
  const targetUnits = options.targetUnits;
  const targetSales = options.targetSales;

  let scaledUnits: number[];
  if (targetUnits && targetUnits > 0 && rawSum > 0) {
    const scale = targetUnits / rawSum;
    scaledUnits = rawUnits.map((u) => Math.max(0, Math.round(u * scale)));
    const unitDrift = targetUnits - scaledUnits.reduce((s, u) => s + u, 0);
    if (unitDrift !== 0 && scaledUnits.length > 0) {
      const maxIdx = scaledUnits.indexOf(Math.max(...scaledUnits));
      scaledUnits[maxIdx] = Math.max(0, scaledUnits[maxIdx] + unitDrift);
    }
  } else {
    scaledUnits = rawUnits.map((u) => Math.max(0, Math.round(u)));
  }

  const unitsSum = scaledUnits.reduce((s, u) => s + u, 0);
  const salesTarget =
    targetSales && targetSales > 0 ? targetSales : unitsSum * 21;

  const baseAov = unitsSum > 0 ? salesTarget / unitsSum : 21;
  const aovFactors = scaledUnits.map(() => 0.9 + rand() * 0.2);
  const aovSum = aovFactors.reduce((s, f) => s + f, 0);
  const aovScale = aovSum > 0 ? dayCount / aovSum : 1;

  const points: AmazonDailyPoint[] = [];
  let salesRunning = 0;

  for (let i = 0; i < dayCount; i++) {
    const units = scaledUnits[i];
    const dailyAov = baseAov * aovFactors[i] * aovScale;
    const sales =
      i === dayCount - 1
        ? Math.round((salesTarget - salesRunning) * 100) / 100
        : Math.round(units * dailyAov * 100) / 100;
    salesRunning += sales;

    points.push({
      date: dates[i],
      unitsOrdered: units,
      orderedProductSales: Math.max(0, sales),
    });
  }

  return points;
}
