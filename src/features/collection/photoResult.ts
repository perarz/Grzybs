import type { ImagePickerErrorResult, ImagePickerResult } from 'expo-image-picker';

export function photoUri(result: ImagePickerResult | ImagePickerErrorResult | null): string | null {
  if (!result || ('canceled' in result && result.canceled)) return null;
  if ('code' in result) throw new Error('Nie udało się odzyskać zdjęcia. Wybierz je ponownie.');
  const uri = result.assets?.[0]?.uri;
  if (!uri) throw new Error('Wybrane zdjęcie jest niedostępne. Wybierz je ponownie.');
  return uri;
}
