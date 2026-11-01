// Drawing helpers for the forest header. Pure geometry – no React here.

export type TreelineLayer = {
  /** Where the trees stand, measured from the top of the drawing. */
  groundY: number;
  minTreeHeight: number;
  maxTreeHeight: number;
  /** Average distance between trees. */
  spacing: number;
  /** Same seed – same forest. The trees never jump around between renders. */
  seed: number;
};

/** SVG path of one row of spruces standing on the ground, with the ground filled below them. */
export function treelinePath(width: number, height: number, layer: TreelineLayer): string {
  const random = seededRandom(layer.seed);
  const parts = [
    `M0 ${height} L0 ${layer.groundY} L${width} ${layer.groundY} L${width} ${height} Z`,
  ];

  let x = -layer.spacing / 2;
  while (x < width + layer.spacing) {
    const treeHeight = layer.minTreeHeight + random() * (layer.maxTreeHeight - layer.minTreeHeight);
    parts.push(sprucePath(x, layer.groundY, treeHeight));
    // Irregular gaps look like a real forest edge, not a fence.
    x += layer.spacing * (0.6 + random() * 0.8);
  }
  return parts.join(' ');
}

/** A spruce made of three stacked triangles, each tier wider than the one above. */
function sprucePath(x: number, groundY: number, height: number): string {
  const tierHeight = height / 2;
  const maxHalfWidth = height * 0.28;
  return [0, 1, 2]
    .map((tier) => {
      const top = groundY - height + (tier * height) / 4;
      const bottom = top + tierHeight;
      const halfWidth = maxHalfWidth * (0.5 + tier * 0.25);
      return `M${x} ${top} L${x + halfWidth} ${bottom} L${x - halfWidth} ${bottom} Z`;
    })
    .join(' ');
}

/** A tiny predictable random generator (linear congruential), returns numbers in [0, 1). */
function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
}
