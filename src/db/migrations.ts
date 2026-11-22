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
  `
  CREATE TABLE learning_sessions (
    id TEXT PRIMARY KEY NOT NULL,
    mode TEXT NOT NULL CHECK (mode IN ('quiz', 'lookalikes')),
    score INTEGER NOT NULL CHECK (score >= 0),
    total INTEGER NOT NULL CHECK (total > 0 AND score <= total),
    completed_at INTEGER NOT NULL
  );
  `,
  `
  CREATE TABLE weather_cache (
    location_key TEXT PRIMARY KEY NOT NULL,
    payload TEXT NOT NULL,
    fetched_at INTEGER NOT NULL
  );
  `,
  `
  CREATE TABLE mushroom_alerts (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    enabled INTEGER NOT NULL DEFAULT 0,
    latitude REAL,
    longitude REAL,
    location_updated_at INTEGER,
    last_sent_at INTEGER
  );
  INSERT INTO mushroom_alerts (id) VALUES (1);
  `,
  `
  CREATE TABLE user_profile (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    experience TEXT NOT NULL CHECK (experience IN ('new', 'regular', 'expert')),
    score INTEGER
  );
  `,
  // Repair development installs whose schema version advanced without the profile table.
  `
  CREATE TABLE IF NOT EXISTS user_profile (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    experience TEXT NOT NULL CHECK (experience IN ('new', 'regular', 'expert')),
    score INTEGER
  );
  `,
  `
  CREATE TABLE course_steps (
    step_id INTEGER PRIMARY KEY CHECK (step_id BETWEEN 0 AND 49),
    completed_at INTEGER NOT NULL
  );
  `,
  `
  CREATE TABLE course_activity (
    day_key TEXT PRIMARY KEY NOT NULL,
    completed_at INTEGER NOT NULL
  );
  `,
  `
  -- The course was rebuilt into 25 lessons: old step numbers now mean other lessons,
  -- so course progress starts over. The daily activity (streak) and profile stay.
  DELETE FROM course_steps;
  ALTER TABLE course_steps ADD COLUMN mistakes INTEGER NOT NULL DEFAULT 0 CHECK (mistakes >= 0);
  CREATE TABLE app_settings (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT NOT NULL
  );
  `,
  `
  -- Optional details of a find: weight in grams and where it was picked (the note column exists).
  ALTER TABLE finds ADD COLUMN weight_grams INTEGER CHECK (weight_grams > 0);
  ALTER TABLE finds ADD COLUMN latitude REAL;
  ALTER TABLE finds ADD COLUMN longitude REAL;
  `,
];
