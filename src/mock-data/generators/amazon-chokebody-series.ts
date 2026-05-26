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

function indicesInProgressRange(
  dayCount: number,
  startProgress: number,
  endProgress: number
): number[] {
  const start = Math.floor(dayCount * startProgress);
  const end = Math.min(dayCount - 1, Math.floor(dayCount * endProgress));
  const indices: number[] = [];
  for (let i = start; i <= end; i++) indices.push(i);
  return indices;
}

/** Hockey-stick: flat zero → traction → ramp → explosive sawtooth → April peak → May cliff */
function midmarketBaseline(progress: number): number {
  const t = clamp(progress, 0, 1);

  if (t < 0.15) {
    return 0;
  }
  if (t < 0.45) {
    const traction = (t - 0.15) / 0.3;
    return 0.02 + traction * 0.1 + 0.015 * Math.sin(traction * Math.PI * 5);
  }
  if (t < 0.75) {
    const ramp = (t - 0.45) / 0.3;
    return 0.12 + ramp * 0.33;
  }
  if (t < 0.9) {
    const explosive = (t - 0.75) / 0.15;
    return 0.45 + explosive * 0.4 + 0.08 * Math.sin(explosive * Math.PI * 6);
  }
  if (t < 0.93) {
    const apex = (t - 0.9) / 0.03;
    return 0.82 + apex * 0.12;
  }
  const cliff = (t - 0.93) / 0.07;
  return 0.94 - cliff * 0.79;
}

const RAW_BASE_UNITS = 880;

export function generateAmazonChokebodySeries(
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

  const rawUnits: number[] = [];
  let noiseWalk = 0;

  for (let i = 0; i < dayCount; i++) {
    const progress = dayCount > 1 ? i / (dayCount - 1) : 0;

    if (progress < 0.15) {
      rawUnits.push(0);
      continue;
    }

    const baseline = midmarketBaseline(progress);

    noiseWalk += (rand() - 0.5) * 0.16 * volatility;
    noiseWalk *= 0.78;
    noiseWalk = clamp(noiseWalk, -0.48 * volatility, 0.48 * volatility);

    const jitter = (rand() - 0.5) * 0.42 * volatility;
    const weekly = 1 + 0.06 * Math.sin((i / 7) * Math.PI * 2);
    const noiseFactor = clamp(1 + noiseWalk + jitter, 0.35, 1.75);

    let spikeMultiplier = 1;
    if (progress >= 0.15 && progress < 0.45 && rand() > 0.94) {
      spikeMultiplier = 1.5 + rand() * 0.5;
    }
    if (progress >= 0.75 && progress < 0.9 && rand() > 0.55) {
      spikeMultiplier = 1.4 + rand() * 0.8;
    }

    const raw =
      RAW_BASE_UNITS * baseline * spikeMultiplier * noiseFactor * weekly;
    rawUnits.push(Math.max(0, raw));
  }

  const rawSum = rawUnits.reduce((s, u) => s + u, 0);
  const targetUnits = options.targetUnits;
  const targetSales = options.targetSales;

  let scaledUnits: number[];
  if (targetUnits && targetUnits > 0 && rawSum > 0) {
    const scale = targetUnits / rawSum;
    scaledUnits = rawUnits.map((u) => Math.max(0, Math.round(u * scale)));

    const dormantEnd = Math.floor(dayCount * 0.15);
    for (let i = 0; i < dormantEnd; i++) {
      scaledUnits[i] = 0;
    }

    const janPool = indicesInProgressRange(dayCount, 0.76, 0.82);
    janPool.sort((a, b) => scaledUnits[b] - scaledUnits[a]);
    const topJanDays = janPool.slice(0, 3);

    const aprilPool = indicesInProgressRange(dayCount, 0.89, 0.93);
    aprilPool.sort((a, b) => scaledUnits[b] - scaledUnits[a]);
    const topAprilDay = aprilPool.slice(0, 1);

    const sawtoothPool = indicesInProgressRange(dayCount, 0.82, 0.89).filter(
      (i) => !topJanDays.includes(i)
    );
    sawtoothPool.sort((a, b) => scaledUnits[b] - scaledUnits[a]);
    const topSawtoothDays = sawtoothPool.slice(0, 7);

    const shapedIndices = new Set([
      ...topJanDays,
      ...topAprilDay,
      ...topSawtoothDays,
    ]);

    topJanDays.forEach((idx) => {
      const wobble = Math.round((rand() - 0.5) * 40);
      scaledUnits[idx] = Math.max(0, 350 + wobble);
    });

    topAprilDay.forEach((idx) => {
      const wobble = Math.round((rand() - 0.5) * 30);
      scaledUnits[idx] = Math.max(0, 400 + wobble);
    });

    topSawtoothDays.forEach((idx) => {
      const wobble = Math.round((rand() - 0.5) * 50);
      scaledUnits[idx] = Math.max(0, 250 + wobble);
    });

    const endDropIndices: number[] = [];
    const endDropStart = Math.floor(dayCount * 0.93);
    for (let i = endDropStart; i < dayCount; i++) {
      if (!shapedIndices.has(i)) endDropIndices.push(i);
    }

    endDropIndices.forEach((idx) => {
      const wobble = Math.floor(rand() * 40);
      scaledUnits[idx] = Math.max(0, 80 + wobble);
    });

    const shapedBudget = [...shapedIndices].reduce((s, idx) => s + scaledUnits[idx], 0);
    const endDropBudget = endDropIndices.reduce((s, idx) => s + scaledUnits[idx], 0);

    const bodyIndices = scaledUnits
      .map((_, i) => i)
      .filter(
        (i) =>
          i >= dormantEnd &&
          !shapedIndices.has(i) &&
          !endDropIndices.includes(i)
      );
    const bodyRawSum = bodyIndices.reduce((s, i) => s + scaledUnits[i], 0);
    const bodyBudget = Math.max(0, targetUnits - shapedBudget - endDropBudget);

    if (bodyIndices.length > 0 && bodyRawSum > 0) {
      const bodyScale = bodyBudget / bodyRawSum;
      bodyIndices.forEach((idx) => {
        scaledUnits[idx] = Math.max(0, Math.round(scaledUnits[idx] * bodyScale));
      });
    }

    let unitDrift = targetUnits - scaledUnits.reduce((s, u) => s + u, 0);
    const driftPool = bodyIndices.length > 0 ? bodyIndices : [...topJanDays];
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
    targetSales && targetSales > 0 ? targetSales : unitsSum * 33;

  const baseAov = unitsSum > 0 ? salesTarget / unitsSum : 33;
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
