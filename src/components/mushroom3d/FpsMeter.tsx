import { useFrame } from '@react-three/fiber/native';
import { useRef } from 'react';

type FpsMeterProps = {
  onMeasured: (fps: number) => void;
};

const SAMPLE_SECONDS = 1;
// The canvas renders on demand, so long gaps between frames are idle time, not slow frames.
const IDLE_GAP_SECONDS = 0.25;

/** Reports the average frame rate while the model is moving, once per second. */
export function FpsMeter({ onMeasured }: FpsMeterProps) {
  const sample = useRef({ frames: 0, elapsed: 0 });

  useFrame((_, deltaSeconds) => {
    if (deltaSeconds > IDLE_GAP_SECONDS) return;

    sample.current.frames += 1;
    sample.current.elapsed += deltaSeconds;
    if (sample.current.elapsed >= SAMPLE_SECONDS) {
      onMeasured(Math.round(sample.current.frames / sample.current.elapsed));
      sample.current = { frames: 0, elapsed: 0 };
    }
  });

  return null;
}
