// Each entry is one schema version (index 0 = version 1).
// Never edit a migration that has shipped – append a new one instead,
// otherwise existing installs would never receive the change.
export const MIGRATIONS: string[] = [
  `
  CREATE TABLE spots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    note TEXT,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE finds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    species_id TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    found_at INTEGER NOT NULL,
    photo_uri TEXT,
    note TEXT,
    spot_id INTEGER REFERENCES spots(id) ON DELETE SET NULL,
    created_at INTEGER NOT NULL
  );

  CREATE INDEX finds_species_id ON finds(species_id);
  CREATE INDEX finds_found_at ON finds(found_at);

  CREATE TABLE car_location (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    accuracy REAL,
    saved_at INTEGER NOT NULL
  );
  `,
];
