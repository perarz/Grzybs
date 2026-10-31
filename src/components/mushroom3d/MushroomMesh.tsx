import { useMemo } from 'react';
import { DoubleSide, Vector2 } from 'three';

import {
  getCapTopProfile,
  getCapUndersideProfile,
  getSpotPositions,
  getStemJoinHeight,
  getStemProfile,
  type MushroomModelParams,
  type ProfilePoint,
} from '@/features/atlas/mushroomModel';

const RADIAL_SEGMENTS = 48;
const SPOT_COUNT = 14;
const SPOT_RADIUS = 0.07;

type MushroomMeshProps = {
  params: MushroomModelParams;
};

export function MushroomMesh({ params }: MushroomMeshProps) {
  // New geometry is uploaded to the GPU, so only rebuild it when the parameters change.
  const shapes = useMemo(
    () => ({
      capTop: toVectors(getCapTopProfile(params)),
      capUnderside: toVectors(getCapUndersideProfile(params)),
      stem: toVectors(getStemProfile(params)),
      spots: params.spotColor ? getSpotPositions(params, SPOT_COUNT) : [],
    }),
    [params],
  );
  const capBaseY = params.stemHeight - getStemJoinHeight(params);

  return (
    <group>
      <mesh>
        <latheGeometry args={[shapes.stem, RADIAL_SEGMENTS]} />
        <meshStandardMaterial color={params.stemColor} roughness={0.9} side={DoubleSide} />
      </mesh>

      <group position={[0, capBaseY, 0]}>
        <mesh>
          <latheGeometry args={[shapes.capTop, RADIAL_SEGMENTS]} />
          <meshStandardMaterial color={params.capColor} roughness={0.55} side={DoubleSide} />
        </mesh>
        <mesh>
          <latheGeometry args={[shapes.capUnderside, RADIAL_SEGMENTS]} />
          <meshStandardMaterial color={params.gillColor} roughness={1} side={DoubleSide} />
        </mesh>
        {shapes.spots.map((spot, index) => (
          <mesh key={index} position={[spot.x, spot.y, spot.z]} scale={[1, 0.45, 1]}>
            <sphereGeometry args={[SPOT_RADIUS, 12, 8]} />
            <meshStandardMaterial color={params.spotColor} roughness={0.9} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function toVectors(points: ProfilePoint[]): Vector2[] {
  return points.map(([x, y]) => new Vector2(x, y));
}
