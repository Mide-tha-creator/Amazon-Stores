import {
  mulberry32,
  type AmazonDailyPoint,
  type GenerateAmazonBehavioralOptions,
} from "@/mock-data/generators/amazon-behavioral-series";

function toIsoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Twin-peak enterprise profile: plateau → spike → second peak → decline → flat tail */
function twinPeakBaseline(progress: number): number {
  const t = clamp(progress, 0, 1);

  if (t < 0.12) {
    return 0.4 + 0.05 * (t / 0.12);
  }
  if (t < 0.3) {
    const mid = (t - 0.12) / 0.18;
    return 0.42 + 0.06 * Math.sin(mid * Math.PI * 3);
  }
  if (t < 0.38) {
    const bump = (t - 0.3) / 0.08;
    return 0.44 + bump * 0.18;
  }
  if (t < 0.58) {
    const decline = (t - 0.38) / 0.2;
    return 0.62 - decline * 0.5;
  }
  if (t < 0.72) {
    const tailDecline = (t - 0.58) / 0.14;
    return 0.12 - tailDecline * 0.06;
  }
  return 0.05 + 0.03 * Math.sin((t - 0.72) * 40);
}

const RAW_BASE_UNITS = 980;

export function generateAmazonApexSeries(
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

  const primarySpikeDay = Math.floor(dayCount * 0.09);
  const primarySpikeNeighbor =
    primarySpikeDay + 1 < dayCount ? primarySpikeDay + 1 : primarySpikeDay;

  const rawUnits: number[] = [];
  let noiseWalk = 0;

  for (let i = 0; i < dayCount; i++) {
    const progress = dayCount > 1 ? i / (dayCount - 1) : 0;
    let baseline = twinPeakBaseline(progress);

    noiseWalk += (rand() - 0.5) * 0.15 * volatility;
    noiseWalk *= 0.8;
    noiseWalk = clamp(noiseWalk, -0.45 * volatility, 0.45 * volatility);

    const jitter = (rand() - 0.5) * 0.4 * volatility;
    const weekly = 1 + 0.07 * Math.sin((i / 7) * Math.PI * 2);
    const noiseFactor = clamp(1 + noiseWalk + jitter, 0.4, 1.7);

    let spikeMultiplier = 1;
    if (i === primarySpikeDay || i === primarySpikeNeighbor) {
      spikeMultiplier = 3.1 + rand() * 0.25;
      baseline = 0.42;
    } else if (progress >= 0.28 && progress < 0.38 && rand() > 0.55) {
      spikeMultiplier = 2.1 + rand() * 0.55;
    } else if (progress >= 0.12 && progress < 0.28 && rand() > 0.9) {
      spikeMultiplier = 1.35 + rand() * 0.4;
    }

    const tailDampen = progress > 0.58 ? 0.55 + (1 - progress) * 0.9 : 1;
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

    const primaryStart = Math.floor(dayCount * 0.07);
    const primaryEnd = Math.floor(dayCount * 0.11);
    const primaryIndices: number[] = [];
    for (let i = primaryStart; i <= primaryEnd; i++) {
      primaryIndices.push(i);
    }
    primaryIndices.sort((a, b) => scaledUnits[b] - scaledUnits[a]);
    const topPrimaryDays = primaryIndices.slice(0, 2);

    const secondaryStart = Math.floor(dayCount * 0.28);
    const secondaryEnd = Math.floor(dayCount * 0.36);
    const secondaryIndices: number[] = [];
    for (let i = secondaryStart; i <= secondaryEnd; i++) {
      secondaryIndices.push(i);
    }
    secondaryIndices.sort((a, b) => scaledUnits[b] - scaledUnits[a]);
    const topSecondaryDays = secondaryIndices.slice(0, 12);

    const shapedIndices = new Set([...topPrimaryDays, ...topSecondaryDays]);
    const tailStart = Math.floor(dayCount * 0.58);

    topPrimaryDays.forEach((idx) => {
      const wobble = Math.round((rand() - 0.5) * 80);
      scaledUnits[idx] = Math.max(50, 3150 + wobble);
    });

    topSecondaryDays.forEach((idx) => {
      const wobble = Math.round((rand() - 0.5) * 180);
      scaledUnits[idx] = Math.max(50, 2500 + wobble);
    });

    const peakBudget = [...shapedIndices].reduce((s, idx) => s + scaledUnits[idx], 0);
    const tailIndices: number[] = [];
    for (let i = tailStart; i < dayCount; i++) {
      if (!shapedIndices.has(i)) tailIndices.push(i);
    }

    const tailDayTarget = 120;
    tailIndices.forEach((idx) => {
      const wobble = Math.floor(rand() * 80);
      scaledUnits[idx] = Math.max(0, tailDayTarget + wobble);
    });
    const tailBudget = tailIndices.reduce((s, idx) => s + scaledUnits[idx], 0);

    const bodyIndices = scaledUnits
      .map((_, i) => i)
      .filter((i) => !shapedIndices.has(i) && i < tailStart);
    const bodyRawSum = bodyIndices.reduce((s, i) => s + scaledUnits[i], 0);
    const bodyBudget = Math.max(0, targetUnits - peakBudget - tailBudget);

    if (bodyIndices.length > 0 && bodyRawSum > 0) {
      const bodyScale = bodyBudget / bodyRawSum;
      bodyIndices.forEach((idx) => {
        scaledUnits[idx] = Math.max(0, Math.round(scaledUnits[idx] * bodyScale));
      });
    }

    let unitDrift = targetUnits - scaledUnits.reduce((s, u) => s + u, 0);
    const driftPool =
      bodyIndices.length > 0 ? bodyIndices : [...topSecondaryDays, ...topPrimaryDays];
    let driftCursor = 0;
    while (unitDrift !== 0 && driftPool.length > 0) {
      const idx = driftPool[driftCursor % driftPool.length];
      const next = scaledUnits[idx] + unitDrift;
      if (next >= 0) {
        scaledUnits[idx] = next;
        unitDrift = 0;
      } else {
        unitDrift = next;
        scaledUnits[idx] = 0;
      }
      driftCursor += 1;
      if (driftCursor > driftPool.length * 3) break;
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

  const rawSales = scaledUnits.map((units, i) => {
    const dailyAov = baseAov * aovFactors[i] * aovScale;
    return Math.max(0, units * dailyAov);
  });
  const rawSalesSum = rawSales.reduce((s, v) => s + v, 0);
  const salesScale =
    rawSalesSum > 0 && salesTarget > 0 ? salesTarget / rawSalesSum : 1;

  const points: AmazonDailyPoint[] = [];
  let salesRunning = 0;

  for (let i = 0; i < dayCount; i++) {
    const units = scaledUnits[i];
    const sales =
      i === dayCount - 1
        ? Math.round((salesTarget - salesRunning) * 100) / 100
        : Math.round(rawSales[i] * salesScale * 100) / 100;
    salesRunning += sales;

    points.push({
      date: dates[i],
      unitsOrdered: units,
      orderedProductSales: Math.max(0, sales),
    });
  }

  return points;
}
