import type { TextStyle } from 'react-native';

import { fonts } from './fonts';

// Custom fonts have one weight per file, so they don't set fontWeight –
// Android would otherwise fake a bolder version.
export const typography = {
  display: { fontFamily: fonts.display, fontSize: 40, lineHeight: 54, letterSpacing: -0.8 },
  title: { fontFamily: fonts.heading, fontSize: 27, lineHeight: 38, letterSpacing: -0.4 },
  heading: { fontFamily: fonts.heading, fontSize: 21, lineHeight: 30, letterSpacing: -0.2 },
  body: { fontSize: 16, lineHeight: 24, fontFamily: fonts.body },
  bodyStrong: { fontSize: 16, lineHeight: 24, fontFamily: fonts.strong },
  caption: { fontSize: 13, lineHeight: 18, fontFamily: fonts.body },
  label: {
    fontFamily: fonts.mono,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  button: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.strong,
    letterSpacing: 0.2,
  },
  latin: { fontFamily: fonts.serifItalic, fontSize: 16, lineHeight: 21 },
  latinSmall: { fontFamily: fonts.serifItalic, fontSize: 14, lineHeight: 18 },
} satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;
