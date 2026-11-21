import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './iconProps';

const paths = {
  check: 'm5 12 4 4L19 6',
  lock: 'M6 10h12v11H6ZM8 10V6a4 4 0 0 1 8 0v4',
  trophy: 'M7 3h10v7a5 5 0 0 1-10 0ZM7 5H3v3a4 4 0 0 0 4 4m10-7h4v3a4 4 0 0 1-4 4M12 15v6m-4 0h8',
  flame: 'M13 2c1 6 6 7 6 13a7 7 0 0 1-14 0c0-3 2-6 4-8 0 4 2 5 2 5s3-4 2-10Z',
  search: 'M16 16l5 5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',
  compare: 'M4 6h16m-4-4 4 4-4 4M20 18H4m4-4-4 4 4 4',
  calendar: 'M4 5h16v16H4ZM8 2v6m8-6v6M4 11h16',

  home: 'm3 10 9-7 9 7v11h-6v-7H9v7H3Z',
  arrowRight: 'M4 12h16m-6-6 6 6-6 6',
  book: 'M12 5v16M12 5C9 3 6 3 3 4v15c3-1 6-1 9 2 3-3 6-3 9-2V4c-3-1-6-1-9 1Z',

  settings:
    'm9.5 3-.5 2-2 1.2-2-.6-2.5 4.3L4 11.5v2L2.5 15l2.5 4.3 2-.6L9 20l.5 2h5l.5-2 2-1.3 2 .6 2.5-4.3-1.5-1.5v-2l1.5-1.6L19 5.6l-2 .6L15 5l-.5-2ZM15.5 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z',
  info: 'M12 11v6m0-10h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',

  camera: 'M3 7h4l2-3h6l2 3h4v13H3ZM16 13a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
  mushrooms:
    'M2 12a7 7 0 0 1 14 0H2Zm5 0-1 8h6l-1-8M16 8a5 5 0 0 1 6 5h-6m2 0 1 7h-4M6 8h.01M11 9h.01',
  arrowUp: 'M12 19V5m-6 6 6-6 6 6',
  plus: 'M12 5v14M5 12h14',
  pin: 'M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0ZM14 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z',
  car: 'm4 12 2-6h12l2 6M4 12h16v6H4zM6 18v2m12-2v2M7 15h2m6 0h2',
  places: 'M5 4h14v17l-7-4-7 4z',
  temperature: 'M10 14V5a2.5 2.5 0 0 1 5 0v9a4.5 4.5 0 1 1-5 0ZM12.5 9v8',
  rain: 'M12 3c-2 4-6.5 8.3-6.5 12a6.5 6.5 0 1 0 13 0C18.5 11.3 14 7 12 3Z',
  wind: 'M3 9h11a3 3 0 1 0-3-3M3 13h15a2.5 2.5 0 1 0-2.5-2.5M5 17h7a2.5 2.5 0 1 1-2.5 2.5',
  refresh: 'M20 5v5h-5M4 19v-5h5M19.5 10a8 8 0 0 0-14-3M4.5 14a8 8 0 0 0 14 3',
  chevron: 'm8 10 4 4 4-4',
  locate:
    'M12 2v3m0 14v3M2 12h3m14 0h3M19 12a7 7 0 1 1-14 0 7 7 0 0 1 14 0ZM14 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z',
} as const;
export type FieldIconName = keyof typeof paths;
export function FieldIcon({ name, size, color }: IconProps & { name: FieldIconName }) {
  return (
    <Svg accessible={false} width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d={paths[name]}
        stroke={color}
        strokeWidth={name === 'plus' ? 3.8 : 1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
