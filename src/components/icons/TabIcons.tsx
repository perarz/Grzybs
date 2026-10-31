import type { ColorValue } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

type IconProps = {
  color: ColorValue;
  size: number;
};

const STROKE_WIDTH = 1.8;

export function ForecastIcon({ color, size }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7 14a4 4 0 0 1-.5-7.97A5.5 5.5 0 0 1 17 6.5a3.5 3.5 0 0 1 0 7.5Z"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinejoin="round"
      />
      <Path
        d="M8 17.5l-1 2.5M12 17.5l-1 2.5M16 17.5l-1 2.5"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function AtlasIcon({ color, size }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 11.5A9 7.5 0 0 1 21 11.5Z"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinejoin="round"
      />
      <Path
        d="M9.5 11.5v5.5a2.5 2.5 0 0 0 5 0v-5.5"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinejoin="round"
      />
      <Circle cx={9} cy={8} r={1.1} fill={color} />
      <Circle cx={14.5} cy={7} r={1.1} fill={color} />
    </Svg>
  );
}

export function MapIcon({ color, size }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 21s-6-5.6-6-11a6 6 0 0 1 12 0c0 5.4-6 11-6 11Z"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinejoin="round"
      />
      <Circle cx={12} cy={10} r={2.2} stroke={color} strokeWidth={STROKE_WIDTH} />
    </Svg>
  );
}

export function CollectionIcon({ color, size }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M7 10a5 5 0 0 1 10 0" stroke={color} strokeWidth={STROKE_WIDTH} />
      <Path
        d="M3 10h18l-2 8.4a2 2 0 0 1-2 1.6H7a2 2 0 0 1-2-1.6Z"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinejoin="round"
      />
      <Path
        d="M9 13.5l.4 3.5M12 13.5v3.5M15 13.5l-.4 3.5"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
      />
    </Svg>
  );
}
