import { Canvas, useFrame } from '@react-three/fiber/native';
import { useRef, type ReactNode, type RefObject } from 'react';
import { StyleSheet, View } from 'react-native';
import type { Group } from 'three';

import type { MushroomModelParams } from '@/features/atlas/mushroomModel';
import { advanceRotation, type DragRotation } from '@/features/atlas/useDragRotation';
import { sceneColors } from '@/theme';

import { FpsMeter } from './FpsMeter';
import { MushroomMesh } from './MushroomMesh';

type MushroomCanvasProps = {
  params: MushroomModelParams;
  rotation: RefObject<DragRotation>;
  backgroundColor: string;
  onFpsMeasured?: (fps: number) => void;
};

const GROUND_Y = -1;

export function MushroomCanvas({
  params,
  rotation,
  backgroundColor,
  onFpsMeasured,
}: MushroomCanvasProps) {
  return (
    // The canvas has its own touch responder that fights the drag gesture on every touch event
    // and freezes real phones. The model has nothing to tap, so touches never reach it.
    <View style={styles.touchThrough}>
      {/* Continuous rendering starves the system UI on Android emulators, so frames are drawn only on demand. */}
      <Canvas frameloop="demand" camera={{ position: [0, 0.9, 4.6], fov: 40 }}>
        <color attach="background" args={[backgroundColor]} />
        <ambientLight intensity={0.5} />
        <hemisphereLight args={[sceneColors.skyLight, sceneColors.groundLight, 1.2]} />
        <directionalLight position={[3, 5, 4]} intensity={1.6} />

        <RotatingGroup rotation={rotation}>
          <group position={[0, GROUND_Y, 0]}>
            <MushroomMesh params={params} />
          </group>
        </RotatingGroup>

        {/* A soft dark disc reads as a shadow without the cost of real shadow maps. */}
        <mesh position={[0, GROUND_Y - 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.3, 48]} />
          <meshBasicMaterial color={sceneColors.shadow} transparent opacity={0.12} />
        </mesh>

        {onFpsMeasured ? <FpsMeter onMeasured={onFpsMeasured} /> : null}
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  touchThrough: {
    flex: 1,
    pointerEvents: 'none',
  },
});

type RotatingGroupProps = {
  rotation: RefObject<DragRotation>;
  children: ReactNode;
};

function RotatingGroup({ rotation, children }: RotatingGroupProps) {
  const groupRef = useRef<Group>(null);

  useFrame((state, deltaSeconds) => {
    const needsNextFrame = advanceRotation(rotation.current, deltaSeconds);
    groupRef.current?.rotation.set(rotation.current.x, rotation.current.y, 0);
    if (needsNextFrame) state.invalidate();
  });

  return <group ref={groupRef}>{children}</group>;
}
