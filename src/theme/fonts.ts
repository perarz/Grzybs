export const fonts = {
  display: 'Oswald-Bold',
  heading: 'Oswald-Regular',
  body: 'SourceSansPro-Regular',
  strong: 'SourceSansPro-Semibold',
  serifItalic: 'Fraunces-Italic',
  mono: 'PlexMono-Medium',
} as const;

export const FONT_FILES = {
  [fonts.display]: require('../../assets/fonts/Oswald-Bold.ttf'),
  [fonts.heading]: require('../../assets/fonts/Oswald-Regular.ttf'),
  [fonts.body]: require('../../assets/fonts/SourceSansPro-Regular.ttf'),
  [fonts.strong]: require('../../assets/fonts/SourceSansPro-Semibold.ttf'),
  [fonts.serifItalic]: require('../../assets/fonts/Fraunces_400Regular_Italic.ttf'),
  [fonts.mono]: require('../../assets/fonts/IBMPlexMono_500Medium.ttf'),
};
