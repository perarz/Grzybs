import { FieldIcon } from './FieldIcon';
import type { IconProps } from './iconProps';

// Keep existing call sites on the same geometry and stroke as the rest of the app.
export function SearchIcon(props: IconProps) {
  return <FieldIcon name="search" {...props} />;
}

export function CloseIcon(props: IconProps) {
  return <FieldIcon name="close" {...props} />;
}

export function BackIcon(props: IconProps) {
  return <FieldIcon name="back" {...props} />;
}

export function ChevronRightIcon(props: IconProps) {
  return <FieldIcon name="chevronRight" {...props} />;
}

export function DragHandleIcon(props: IconProps) {
  return <FieldIcon name="dragHandle" {...props} />;
}

export function WarningIcon(props: IconProps) {
  return <FieldIcon name="warning" {...props} />;
}

export function SlidersIcon(props: IconProps) {
  return <FieldIcon name="sliders" {...props} />;
}

export function ChevronDownIcon(props: IconProps) {
  return <FieldIcon name="chevron" {...props} />;
}

export function CheckIcon(props: IconProps) {
  return <FieldIcon name="check" {...props} />;
}

export function IdentifyIcon(props: IconProps) {
  return <FieldIcon name="identify" {...props} />;
}
