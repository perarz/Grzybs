import { invalidate } from '@react-three/fiber/native';
import { useRef } from 'react';
import { usePanGesture } from 'react-native-gesture-handler';

export type DragRotation = {
  x: number;
  y: number;
  velocityY: number;
  isDragging: boolean;
};

const RADIANS_PER_POINT = 0.01;
const MAX_TILT = 0.6;
const WELCOME_SPIN_SPEED = 4;
const VELOCITY_LEFT_AFTER_ONE_SECOND = 0.1;
const MIN_VELOCITY = 0.02;
// After a pause the first frame reports the whole pause as its delta – cap it so the model doesn't jump.
const MAX_FRAME_SECONDS = 1 / 20;

/**
 * Rotation driven by a finger. The canvas renders on demand: touching it starts the frame loop
 * and advanceRotation keeps it going while the finger is down or the model still spins.
 * Touch moves only update numbers, so a flood of touch events never means extra renders.
 */
export function useDragRotation() {
  const rotation = useRef<DragRotation>({
    x: 0.2,
    y: 0,
    velocityY: WELCOME_SPIN_SPEED,
    isDragging: false,
  });

  const gesture = usePanGesture({
    // Three.js renders on the JS thread, so the gesture callbacks run there too instead of as worklets.
    runOnJS: true,
    onBegin: () => {
      rotation.current.isDragging = true;
      rotation.current.velocityY = 0;
      invalidate();
    },
    onUpdate: (event) => {
      rotation.current.y += event.changeX * RADIANS_PER_POINT;
      rotation.current.x = clamp(
        rotation.current.x + event.changeY * RADIANS_PER_POINT,
        -MAX_TILT,
        MAX_TILT,
      );
    },
    onDeactivate: (event) => {
      rotation.current.velocityY = event.velocityX * RADIANS_PER_POINT;
    },
    onFinalize: () => {
      rotation.current.isDragging = false;
      invalidate();
    },
  });

  function spin() {
    rotation.current.velocityY = WELCOME_SPIN_SPEED;
    invalidate();
  }

  return { rotation, gesture, spin };
}

/** Called every rendered frame. Returns true while another frame is needed. */
export function advanceRotation(rotation: DragRotation, deltaSeconds: number): boolean {
  if (rotation.isDragging) return true;

  const seconds = Math.min(deltaSeconds, MAX_FRAME_SECONDS);
  rotation.y += rotation.velocityY * seconds;
  rotation.velocityY *= Math.pow(VELOCITY_LEFT_AFTER_ONE_SECOND, seconds);

  if (Math.abs(rotation.velocityY) < MIN_VELOCITY) {
    rotation.velocityY = 0;
    return false;
  }
  return true;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
