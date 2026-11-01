// Fraunces – a soft old-style serif for names and titles, like a printed field guide.
// IBM Plex Mono – typewriter labels, like the tags on herbarium sheets.
// Body text stays in the system font, so long descriptions read natively.
export const fonts = {
  serif: 'Fraunces-SemiBold',
  serifItalic: 'Fraunces-Italic',
  mono: 'PlexMono-Medium',
} as const;

export const FONT_FILES = {
  [fonts.serif]: require('../../assets/fonts/Fraunces_600SemiBold.ttf'),
  [fonts.serifItalic]: require('../../assets/fonts/Fraunces_400Regular_Italic.ttf'),
  [fonts.mono]: require('../../assets/fonts/IBMPlexMono_500Medium.ttf'),
};
