import { StyleSheet } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { treelinePath, type TreelineLayer as Layer } from './treeline';

type TreelineLayerProps = {
  layer: Layer;
  color: string;
  width: number;
  height: number;
  scrollY: SharedValue<number>;
  /** 0 – moves with the page, 1 – stays in place. Far trees move less, which gives depth. */
  parallax: number;
};

export function TreelineLayer({
  layer,
  color,
  width,
  height,
  scrollY,
  parallax,
}: TreelineLayerProps) {
  const parallaxStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollY.get(),
          [0, height * 4],
          [0, height * 4 * parallax],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  return (
    <Animated.View style={[StyleSheet.absoluteFill, parallaxStyle]}>
      <Svg width={width} height={height}>
        <Path d={treelinePath(width, height, layer)} fill={color} />
      </Svg>
    </Animated.View>
  );
}
