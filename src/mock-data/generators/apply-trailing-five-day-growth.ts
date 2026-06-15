import { mulberry32 } from "@/mock-data/generators/amazon-behavioral-series";

const TAIL_DAYS = 5;
const SEED_OFFSET = 99105;

/** Growth multipliers relative to baseline for each tail day (day 0 = first of last 5). */
const GROWTH_CURVE = [1.04, 1.065, 1.2, 1.12, 1.08];

export type TrailingGrowthProfile =
  | "amazon-apex"
  | "amazon-nova"
  | "amazon-chokebody"
  | "default";

export interface TrailingFiveDayGrowthOptions {
  seed: number;
  profile?: TrailingGrowthProfile;
}

function percentile(values: number[], p: number): number {
  const positive = values.filter((v) => v > 0);
  if (positive.length === 0) return 0;
  const sorted = [...positive].sort((a, b) => a - b);
  const idx = Math.min(
    sorted.length - 1,
    Math.max(0, Math.ceil((p / 100) * sorted.length) - 1)
  );
  return sorted[idx];
}

function avg(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((s, v) => s + v, 0) / values.length;
}

function resolveBaseline(
  values: number[],
  tailStart: number,
  profile: TrailingGrowthProfile
): number {
  const preTail7 = values.slice(Math.max(0, tailStart - 7), tailStart);
  const preTail30 = values.slice(Math.max(0, tailStart - 30), tailStart);
  const sevenDayAvg = avg(preTail7);
  const p25 = percentile(preTail30, 25);

  const useRecoveryFloor = profile === "amazon-nova";

  if (useRecoveryFloor) {
    const floor = Math.max(p25, 18);
    return Math.max(sevenDayAvg, floor);
  }

  return sevenDayAvg > 0 ? sevenDayAvg : p25;
}

function profileNoiseScale(profile: TrailingGrowthProfile): number {
  switch (profile) {
    case "amazon-nova":
      return 0.1;
    default:
      return 0.06;
  }
}

function profileBlend(_profile: TrailingGrowthProfile): number {
  return 0.65;
}

function growthMultiplier(
  dayOffset: number,
  rand: () => number,
  profile: TrailingGrowthProfile
): number {
  const base = GROWTH_CURVE[dayOffset] ?? GROWTH_CURVE[GROWTH_CURVE.length - 1];
  const noise = profileNoiseScale(profile);
  return base * (1 + (rand() - 0.5) * noise);
}

function medianAsp(samples: number[]): number {
  if (samples.length === 0) return 25;
  const sorted = [...samples].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

export interface AmazonTailPoint {
  date: string;
  unitsOrdered: number;
  orderedProductSales: number;
}

export function applyTrailingFiveDayGrowthAmazon(
  points: AmazonTailPoint[],
  options: TrailingFiveDayGrowthOptions
): AmazonTailPoint[] {
  if (points.length < TAIL_DAYS + 1) return points;

  const profile = options.profile ?? "default";
  const rand = mulberry32(options.seed + SEED_OFFSET);
  const result = points.map((p) => ({ ...p }));
  const tailStart = result.length - TAIL_DAYS;

  const unitValues = result.map((p) => p.unitsOrdered);
  const baselineUnits = resolveBaseline(unitValues, tailStart, profile);

  const aspSamples: number[] = [];
  for (let i = 0; i < tailStart; i++) {
    if (result[i].unitsOrdered > 0) {
      aspSamples.push(result[i].orderedProductSales / result[i].unitsOrdered);
    }
  }
  const asp = medianAsp(aspSamples);

  const blend = profileBlend(profile);

  for (let d = 0; d < TAIL_DAYS; d++) {
    const idx = tailStart + d;
    const mult = growthMultiplier(d, rand, profile);
    const shapedUnits = Math.max(1, Math.round(baselineUnits * mult));
    const existing = result[idx];
    const newUnits = Math.round(
      existing.unitsOrdered * (1 - blend) + shapedUnits * blend
    );
    const salesNoise = 0.96 + rand() * 0.08;
    const newSales =
      Math.round(newUnits * asp * salesNoise * 100) / 100;

    result[idx] = {
      date: existing.date,
      unitsOrdered: Math.max(0, newUnits),
      orderedProductSales: Math.max(0, newSales),
    };
  }

  return result;
}

export function amazonProfileToGrowthProfile(
  profile?: string
): TrailingGrowthProfile {
  switch (profile) {
    case "enterprise-twin-peak":
      return "amazon-apex";
    case "midmarket-spike-decline":
      return "amazon-nova";
    case "midmarket-growth":
      return "amazon-chokebody";
    default:
      return "default";
  }
}
