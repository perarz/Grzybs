import { Text, type TextProps } from 'react-native';

import { typography, useTheme, type ThemeColors, type TypographyVariant } from '@/theme';

type AppTextProps = TextProps & {
  variant?: TypographyVariant;
  color?: keyof ThemeColors;
};

export function AppText({ variant = 'body', color = 'text', style, ...rest }: AppTextProps) {
  const { colors } = useTheme();
  return <Text style={[typography[variant], { color: colors[color] }, style]} {...rest} />;
}
