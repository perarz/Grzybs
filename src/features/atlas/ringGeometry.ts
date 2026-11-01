type Point = { x: number; y: number };

/** Angles are in degrees like on a clock face: 0 at the top (12 o'clock), growing clockwise. */
export function pointOnCircle(center: number, radius: number, angle: number): Point {
  const radians = ((angle - 90) * Math.PI) / 180;
  return {
    x: center + radius * Math.cos(radians),
    y: center + radius * Math.sin(radians),
  };
}

/** SVG path of one piece of a ring (a donut slice) between two angles. */
export function ringSegmentPath(
  center: number,
  outerRadius: number,
  innerRadius: number,
  startAngle: number,
  endAngle: number,
): string {
  const outerStart = pointOnCircle(center, outerRadius, startAngle);
  const outerEnd = pointOnCircle(center, outerRadius, endAngle);
  const innerEnd = pointOnCircle(center, innerRadius, endAngle);
  const innerStart = pointOnCircle(center, innerRadius, startAngle);

  // Segments here are shorter than half a circle, so the SVG "large arc" flag is always 0.
  // The outer arc goes clockwise (sweep 1), the inner one back counter-clockwise (sweep 0).
  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerRadius} ${outerRadius} 0 0 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerRadius} ${innerRadius} 0 0 0 ${innerStart.x} ${innerStart.y}`,
    'Z',
  ].join(' ');
}
