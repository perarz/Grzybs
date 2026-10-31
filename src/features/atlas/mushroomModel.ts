export type CapShape = 'convex' | 'flat' | 'conical' | 'funnel';

export type MushroomModelParams = {
  capShape: CapShape;
  capRadius: number;
  capHeight: number;
  stemHeight: number;
  stemRadius: number;
  stemBaseRadius: number;
  capColor: string;
  gillColor: string;
  stemColor: string;
  spotColor?: string;
};

/** [x, y] – distance from the vertical axis and height. Lathe geometry spins it into 3D. */
export type ProfilePoint = [number, number];

const PROFILE_STEPS = 24;

// Height of the cap surface as a fraction of capHeight, where t = 0 is the centre and t = 1 the rim.
const capSurface: Record<CapShape, (t: number) => number> = {
  convex: (t) => Math.sqrt(1 - t * t),
  flat: (t) => Math.pow(1 - Math.pow(t, 4), 0.25) * 0.6,
  conical: (t) => 1 - t,
  funnel: (t) => 0.35 + 0.65 * t * t,
};

export function getCapHeightAt(params: MushroomModelParams, t: number): number {
  return capSurface[params.capShape](t) * params.capHeight;
}

export function getCapTopProfile(params: MushroomModelParams): ProfilePoint[] {
  return range(PROFILE_STEPS).map((t) => [t * params.capRadius, getCapHeightAt(params, t)]);
}

/** Height, relative to the cap's base, where the cap underside meets the stem. */
export function getStemJoinHeight(params: MushroomModelParams): number {
  // Funnel-shaped caps (e.g. chanterelle) have ridges running down the stem.
  return params.capShape === 'funnel' ? -params.capHeight * 0.6 : 0;
}

export function getCapUndersideProfile(params: MushroomModelParams): ProfilePoint[] {
  const rimHeight = getCapHeightAt(params, 1);
  const stemJoinHeight = getStemJoinHeight(params);

  return range(PROFILE_STEPS).map((t) => {
    const x = params.capRadius - t * (params.capRadius - params.stemRadius);
    // t² keeps the underside almost level near the rim and bends it steeply into the stem (trumpet shape).
    const y = rimHeight + (stemJoinHeight - rimHeight) * t * t;
    return [x, y];
  });
}

export function getStemProfile(params: MushroomModelParams): ProfilePoint[] {
  const { stemHeight, stemRadius, stemBaseRadius } = params;
  const side = range(PROFILE_STEPS).map((t): ProfilePoint => {
    const bulge = (stemBaseRadius - stemRadius) * Math.pow(1 - t, 2);
    return [stemRadius + bulge, t * stemHeight];
  });
  return [[0, 0], ...side];
}

/** Evenly spread spots on the cap using the golden angle – deterministic, so they never jump. */
export function getSpotPositions(params: MushroomModelParams, count: number) {
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: count }, (_, index) => {
    const t = 0.2 + 0.65 * Math.sqrt((index + 0.5) / count);
    const angle = index * goldenAngle;
    return {
      x: Math.cos(angle) * t * params.capRadius,
      y: getCapHeightAt(params, t),
      z: Math.sin(angle) * t * params.capRadius,
    };
  });
}

function range(steps: number): number[] {
  return Array.from({ length: steps + 1 }, (_, index) => index / steps);
}
