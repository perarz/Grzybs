import * as ImagePicker from 'expo-image-picker';

import { photoUri } from './photoResult';

export async function pickPhoto(camera: boolean): Promise<string | null> {
  if (camera) {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      throw new Error(
        'Brak dostępu do aparatu. Włącz go w ustawieniach telefonu lub wybierz zdjęcie z galerii.',
      );
    }
  }
  const options: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], quality: 0.8 };
  const result = camera
    ? await ImagePicker.launchCameraAsync(options)
    : await ImagePicker.launchImageLibraryAsync(options);
  return photoUri(result);
}
