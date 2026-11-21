import { FieldIcon } from './FieldIcon';
import type { IconProps } from './iconProps';

// Keep existing call sites on the same geometry and stroke as the rest of the app.
export function MapIcon(props: IconProps) {
  return <FieldIcon name="pin" {...props} />;
}

export function AtlasIcon(props: IconProps) {
  return <FieldIcon name="mushroom" {...props} />;
}

export function LearnIcon(props: IconProps) {
  return <FieldIcon name="bulb" {...props} />;
}
