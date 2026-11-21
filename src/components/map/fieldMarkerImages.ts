// Native marker images avoid snapshotting a React view on each GPS update.
const pinPlacement = {
  anchor: { x: 0.5, y: 1 },
  // Apple Maps positions an image by its center. The 44-point pin ends at its coordinate.
  centerOffset: { x: 0, y: -22 },
  tracksViewChanges: false,
};

export const fieldMarkers = {
  spot: {
    ...pinPlacement,
    image: require('../../../assets/images/map-markers/spot.png'),
    zIndex: 2,
  },
  car: { ...pinPlacement, image: require('../../../assets/images/map-markers/car.png'), zIndex: 3 },
  gps: {
    image: require('../../../assets/images/map-markers/gps.png'),
    anchor: { x: 0.5, y: 0.5 },
    centerOffset: { x: 0, y: 0 },
    tracksViewChanges: false,
    zIndex: 1,
  },
};
