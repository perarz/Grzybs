import type { TextStyle } from 'react-native';

import { fonts } from './fonts';

// Custom fonts have one weight per file, so they don't set fontWeight –
// Android would otherwise fake a bolder version.
export const typography = {
  display: { fontFamily: fonts.serif, fontSize: 38, lineHeight: 42, letterSpacing: -0.8 },
  title: { fontFamily: fonts.serif, fontSize: 26, lineHeight: 31, letterSpacing: -0.4 },
  heading: { fontFamily: fonts.serif, fontSize: 19, lineHeight: 24, letterSpacing: -0.2 },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
  bodyStrong: { fontSize: 16, lineHeight: 24, fontWeight: '600' },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
  label: {
    fontFamily: fonts.mono,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  button: {
    fontFamily: fonts.mono,
    fontSize: 13,
    lineHeight: 16,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  latin: { fontFamily: fonts.serifItalic, fontSize: 16, lineHeight: 21 },
  latinSmall: { fontFamily: fonts.serifItalic, fontSize: 14, lineHeight: 18 },
} satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;
