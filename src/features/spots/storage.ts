import type { SQLiteDatabase } from 'expo-sqlite';

export type Coordinate = { latitude: number; longitude: number };
export type Spot = Coordinate & {
  id: number;
  name: string;
  note: string | null;
  created_at: number;
};
export type CarLocation = Coordinate & { accuracy: number | null; saved_at: number };
export type SpotInput = Coordinate & { id?: number; name: string; note: string };
export type ParkingFix = Coordinate & { accuracy: number | null; timestamp: number };

export function validateCoordinate(point: Coordinate) {
  if (
    !Number.isFinite(point.latitude) ||
    !Number.isFinite(point.longitude) ||
    Math.abs(point.latitude) > 90 ||
    Math.abs(point.longitude) > 180
  ) {
    throw new Error('Nieprawidłowe współrzędne miejsca.');
  }
}

export async function readFieldData(db: SQLiteDatabase) {
  const [spots, car] = await Promise.all([
    db.getAllAsync<Spot>('SELECT * FROM spots ORDER BY created_at DESC, id DESC'),
    db.getFirstAsync<CarLocation>(
      'SELECT latitude, longitude, accuracy, saved_at FROM car_location WHERE id = 1',
    ),
  ]);
  return { spots, car };
}

export async function writeSpot(db: SQLiteDatabase, input: SpotInput) {
  validateCoordinate(input);
  const name = input.name.trim();
  const note = input.note.trim();
  if (!name || name.length > 80 || note.length > 500)
    throw new Error('Podaj nazwę do 80 znaków i notatkę do 500 znaków.');
  if (input.id !== undefined) {
    const result = await db.runAsync(
      'UPDATE spots SET name = ?, note = ?, latitude = ?, longitude = ? WHERE id = ?',
      name,
      note || null,
      input.latitude,
      input.longitude,
      input.id,
    );
    if (!result.changes) throw new Error('To miejsce nie istnieje. Odśwież listę.');
  } else {
    await db.runAsync(
      'INSERT INTO spots (name, note, latitude, longitude, created_at) VALUES (?, ?, ?, ?, ?)',
      name,
      note || null,
      input.latitude,
      input.longitude,
      Date.now(),
    );
  }
}

export async function deleteSpot(db: SQLiteDatabase, id: number) {
  await db.runAsync('DELETE FROM spots WHERE id = ?', id);
}

export async function writeCar(db: SQLiteDatabase, position: ParkingFix) {
  validateCoordinate(position);
  const age = Date.now() - position.timestamp;
  if (
    !Number.isFinite(age) ||
    age < -5000 ||
    age > 60000 ||
    position.accuracy === null ||
    !Number.isFinite(position.accuracy) ||
    position.accuracy < 0 ||
    position.accuracy > 100
  ) {
    throw new Error('Poczekaj na świeżą pozycję GPS z dokładnością do 100 m.');
  }
  const saved_at = Date.now();
  await db.runAsync(
    `INSERT INTO car_location (id, latitude, longitude, accuracy, saved_at)
    VALUES (1, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET
    latitude = excluded.latitude, longitude = excluded.longitude,
    accuracy = excluded.accuracy, saved_at = excluded.saved_at`,
    position.latitude,
    position.longitude,
    position.accuracy,
    saved_at,
  );
  return {
    latitude: position.latitude,
    longitude: position.longitude,
    accuracy: position.accuracy,
    saved_at,
  };
}

export async function deleteCar(db: SQLiteDatabase) {
  await db.runAsync('DELETE FROM car_location WHERE id = 1');
}
