import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { getDailySpecies } from './learning';

export function useDailySpecies() {
  const [species, setSpecies] = useState(() => getDailySpecies());
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    function scheduleMidnight() {
      clearTimeout(timer);
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      timer = setTimeout(() => {
        setSpecies(getDailySpecies());
        scheduleMidnight();
      }, tomorrow.getTime() - now.getTime());
    }
    scheduleMidnight();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state !== 'active') return;
      setSpecies(getDailySpecies());
      scheduleMidnight();
    });
    return () => {
      clearTimeout(timer);
      subscription.remove();
    };
  }, []);
  return species;
}
