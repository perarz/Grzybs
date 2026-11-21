import { useEffect, useMemo, useState } from 'react';
import { AppState } from 'react-native';

import { createLocationTracker, INITIAL_LOCATION } from './locationTracking';

export type { Coordinate, LocationFix } from './geo';

export function useFieldLocation(active: boolean) {
  const [state, setState] = useState(INITIAL_LOCATION);
  const tracker = useMemo(
    () => createLocationTracker((patch) => setState((previous) => ({ ...previous, ...patch }))),
    [],
  );
  useEffect(() => {
    if (!active) return;
    if (AppState.currentState === 'active') void tracker.start(true);
    const subscription = AppState.addEventListener('change', (next) => {
      if (next === 'active') void tracker.start(true);
      else if (next === 'background') tracker.stop();
      else if (next === 'inactive') tracker.pauseIfTracking();
    });
    return () => {
      subscription.remove();
      tracker.stop();
    };
  }, [active, tracker]);
  async function start() {
    if (active && AppState.currentState === 'active') await tracker.start();
  }
  return { ...state, status: active ? state.status : ('idle' as const), start };
}
