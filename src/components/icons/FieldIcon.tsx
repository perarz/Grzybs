import Svg, { Path } from 'react-native-svg';
import { ICON_STROKE_WIDTH, type IconProps } from './iconProps';
import { iconPaths } from './iconPaths';

export type FieldIconName = keyof typeof iconPaths;

export function FieldIcon({ name, size, color }: IconProps & { name: FieldIconName }) {
  return (
    <Svg accessible={false} width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d={iconPaths[name]}
        stroke={color}
        strokeWidth={ICON_STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
