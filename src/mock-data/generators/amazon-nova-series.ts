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

/** Kursat profile: Oct spike → steady band → summer/Oct peaks → Jan bump → collapse */
function kursatBaseline(progress: number): number {
  const t = clamp(progress, 0, 1);

  if (t < 0.08) {
    return 0.04 + 0.06 * (t / 0.08);
  }
  if (t < 0.45) {
    const band = (t - 0.08) / 0.37;
    return 0.22 + 0.1 * Math.sin(band * Math.PI * 8);
  }
  if (t < 0.75) {
    const mid = (t - 0.45) / 0.3;
    return 0.18 + mid * 0.22 + 0.05 * Math.sin(mid * Math.PI * 5);
  }
  if (t < 0.82) {
    const late = (t - 0.75) / 0.07;
    return 0.38 + late * 0.08;
  }
  const collapse = (t - 0.82) / 0.18;
  return 0.42 - collapse * 0.4;
}

const RAW_BASE_UNITS = 115;

export function generateAmazonNovaSeries(
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
    const baseline = kursatBaseline(progress);

    noiseWalk += (rand() - 0.5) * 0.14 * volatility;
    noiseWalk *= 0.8;
    noiseWalk = clamp(noiseWalk, -0.4 * volatility, 0.4 * volatility);

    const jitter = (rand() - 0.5) * 0.38 * volatility;
    const weekly = 1 + 0.07 * Math.sin((i / 7) * Math.PI * 2);
    const noiseFactor = clamp(1 + noiseWalk + jitter, 0.4, 1.65);

    let spikeMultiplier = 1;
    if (progress >= 0.12 && progress < 0.75 && rand() > 0.88) {
      spikeMultiplier = 1.25 + rand() * 0.45;
    }
    if (progress >= 0.45 && progress < 0.75 && rand() > 0.7) {
      spikeMultiplier = 1.5 + rand() * 0.9;
    }

    const collapseDampen = progress > 0.82 ? 0.35 + (1 - progress) * 2.5 : 1;
    const raw =
      RAW_BASE_UNITS * baseline * spikeMultiplier * noiseFactor * weekly * collapseDampen;

    rawUnits.push(Math.max(0, raw));
  }

  const rawSum = rawUnits.reduce((s, u) => s + u, 0);
  const targetUnits = options.targetUnits;
  const targetSales = options.targetSales;

  let scaledUnits: number[];
  if (targetUnits && targetUnits > 0 && rawSum > 0) {
    const scale = targetUnits / rawSum;
    scaledUnits = rawUnits.map((u) => Math.max(0, Math.round(u * scale)));

    const octPool = indicesInProgressRange(dayCount, 0.08, 0.12);
    octPool.sort((a, b) => scaledUnits[b] - scaledUnits[a]);
    const topOctDays = octPool.slice(0, 2);

    const summerPool = indicesInProgressRange(dayCount, 0.48, 0.58);
    summerPool.sort((a, b) => scaledUnits[b] - scaledUnits[a]);
    const topSummerDays = summerPool.slice(0, 4);

    const oct25Pool = indicesInProgressRange(dayCount, 0.63, 0.7);
    oct25Pool.sort((a, b) => scaledUnits[b] - scaledUnits[a]);
    const topOct25Days = oct25Pool.slice(0, 3);

    const janPool = indicesInProgressRange(dayCount, 0.76, 0.8);
    janPool.sort((a, b) => scaledUnits[b] - scaledUnits[a]);
    const topJanDays = janPool.slice(0, 2);

    const midBandPool = indicesInProgressRange(dayCount, 0.15, 0.45);
    midBandPool.sort((a, b) => scaledUnits[b] - scaledUnits[a]);
    const topMidBandDays = midBandPool.slice(0, 10);

    const shapedIndices = new Set([
      ...topOctDays,
      ...topSummerDays,
      ...topOct25Days,
      ...topJanDays,
      ...topMidBandDays,
    ]);

    topOctDays.forEach((idx) => {
      const wobble = Math.round((rand() - 0.5) * 30);
      scaledUnits[idx] = Math.max(0, 200 + wobble);
    });

    topSummerDays.forEach((idx) => {
      const wobble = Math.round((rand() - 0.5) * 25);
      scaledUnits[idx] = Math.max(0, 330 + wobble);
    });

    topOct25Days.forEach((idx) => {
      const wobble = Math.round((rand() - 0.5) * 25);
      scaledUnits[idx] = Math.max(0, 330 + wobble);
    });

    topJanDays.forEach((idx) => {
      const wobble = Math.round((rand() - 0.5) * 30);
      scaledUnits[idx] = Math.max(0, 250 + wobble);
    });

    topMidBandDays.forEach((idx) => {
      const wobble = Math.round((rand() - 0.5) * 40);
      scaledUnits[idx] = Math.max(0, 110 + wobble);
    });

    const collapseStart = Math.floor(dayCount * 0.82);
    const collapseIndices: number[] = [];
    for (let i = collapseStart; i < dayCount; i++) {
      if (!shapedIndices.has(i)) collapseIndices.push(i);
    }

    collapseIndices.forEach((idx, offset) => {
      const progressInCollapse = offset / Math.max(1, collapseIndices.length - 1);
      const target = progressInCollapse > 0.85 ? 4 + Math.floor(rand() * 8) : 12 + Math.floor(rand() * 35);
      scaledUnits[idx] = Math.max(0, target);
    });

    if (dayCount > 0) {
      scaledUnits[dayCount - 1] = 4;
    }

    const shapedBudget = [...shapedIndices].reduce((s, idx) => s + scaledUnits[idx], 0);
    const collapseBudget = collapseIndices.reduce((s, idx) => s + scaledUnits[idx], 0);

    const bodyIndices = scaledUnits
      .map((_, i) => i)
      .filter((i) => !shapedIndices.has(i) && !collapseIndices.includes(i));
    const bodyRawSum = bodyIndices.reduce((s, i) => s + scaledUnits[i], 0);
    const bodyBudget = Math.max(0, targetUnits - shapedBudget - collapseBudget);

    if (bodyIndices.length > 0 && bodyRawSum > 0) {
      const bodyScale = bodyBudget / bodyRawSum;
      bodyIndices.forEach((idx) => {
        scaledUnits[idx] = Math.max(0, Math.round(scaledUnits[idx] * bodyScale));
      });
    }

    let unitDrift = targetUnits - scaledUnits.reduce((s, u) => s + u, 0);
    const driftPool = bodyIndices.length > 0 ? bodyIndices : [...topSummerDays];
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
