export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

// Printed-card corners: small and crisp. The pill is kept for round controls only.
export const radius = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 14,
  pill: 999,
} as const;

export const layout = {
  contentMaxWidth: 720,
  minimumCardWidth: 148,
  touchTarget: 48,
  speciesPhotoAspect: 1.12,
  homeHeroHeight: 220,
  thumbnail: 88,
  collectionPreviewWidth: 116,
  icon: 24,
  mapControlGap: 12,
  courseNode: 72,
  courseStroke: 3,
  /** A visible but light outline, e.g. around the learning card. */
  accentStroke: 1.5,
} as const;
