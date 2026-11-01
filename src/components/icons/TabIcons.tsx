import Svg, { Circle, Path } from 'react-native-svg';

import { ICON_STROKE_WIDTH, type IconProps } from './iconProps';

export function MapIcon({ color, size }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 21s-6-5.6-6-11a6 6 0 0 1 12 0c0 5.4-6 11-6 11Z"
        stroke={color}
        strokeWidth={ICON_STROKE_WIDTH}
        strokeLinejoin="round"
      />
      <Circle cx={12} cy={10} r={2.2} stroke={color} strokeWidth={ICON_STROKE_WIDTH} />
    </Svg>
  );
}

export function AtlasIcon({ color, size }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 11.5A9 7.5 0 0 1 21 11.5Z"
        stroke={color}
        strokeWidth={ICON_STROKE_WIDTH}
        strokeLinejoin="round"
      />
      <Path
        d="M9.5 11.5v5.5a2.5 2.5 0 0 0 5 0v-5.5"
        stroke={color}
        strokeWidth={ICON_STROKE_WIDTH}
        strokeLinejoin="round"
      />
      <Circle cx={9} cy={8} r={1.1} fill={color} />
      <Circle cx={14.5} cy={7} r={1.1} fill={color} />
    </Svg>
  );
}

export function LearnIcon({ color, size }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3a6 6 0 0 0-3.5 10.9c.6.4.9 1 .9 1.7V16h5.2v-.4c0-.7.3-1.3.9-1.7A6 6 0 0 0 12 3Z"
        stroke={color}
        strokeWidth={ICON_STROKE_WIDTH}
        strokeLinejoin="round"
      />
      <Path
        d="M9.5 18.5h5M10.5 21h3"
        stroke={color}
        strokeWidth={ICON_STROKE_WIDTH}
        strokeLinecap="round"
      />
    </Svg>
  );
}
