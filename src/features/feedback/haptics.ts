import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// Haptics are a finishing touch: a phone without a vibration motor (or the emulator)
// must simply stay silent, never throw.
function ignoreFailure() {}

// On Android the system haptic constants feel crisper than the vibrator-based calls.
const isAndroid = Platform.OS === 'android';

// The user's choice from the settings; read once at start by `useHapticsPreference`.
let enabled = true;
export function setHapticsEnabled(value: boolean) {
  enabled = value;
}

/** A light tap – opening a card, pressing a button. */
export function tapHaptic() {
  if (!enabled) return;
  const feedback = isAndroid
    ? Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Context_Click)
    : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  feedback.catch(ignoreFailure);
}

/** A tick – choosing a chip or a tab, a slider clicking into place. */
export function selectionHaptic() {
  if (!enabled) return;
  const feedback = isAndroid
    ? Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Clock_Tick)
    : Haptics.selectionAsync();
  feedback.catch(ignoreFailure);
}

/** A warning buzz – a deadly lookalike is on screen. */
export function warningHaptic() {
  if (!enabled) return;
  const feedback = isAndroid
    ? Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Reject)
    : Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  feedback.catch(ignoreFailure);
}

/** A short confirm – a correct answer. */
export function successHaptic() {
  if (!enabled) return;
  const feedback = isAndroid
    ? Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Confirm)
    : Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  feedback.catch(ignoreFailure);
}
