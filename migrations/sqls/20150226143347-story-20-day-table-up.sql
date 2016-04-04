CREATE TABLE days (
  day_id INTEGER PRIMARY KEY DEFAULT nextval('ttrack_seq'),
  day_date DATE NOT NULL UNIQUE,
  day_target_time INTEGER DEFAULT 0,
  day_comment TEXT
);

CREATE TABLE period_types (
  pty_id INTEGER PRIMARY KEY DEFAULT nextval('ttrack_seq'),
  pty_name TEXT NOT NULL
);

INSERT INTO period_types (pty_name) VALUES
  ('Arbeitszeit'),
  ('Urlaub'),
  ('Krankenstand'),
  ('Pflegeurlaub');

ALTER TABLE periods
  ADD COLUMN per_pty_id INTEGER REFERENCES period_types (pty_id),
  ADD COLUMN per_duration INTERVAL DEFAULT '0';

UPDATE periods SET
  per_duration = per_stop - per_start,
  per_pty_id = (SELECT pty_id FROM period_types WHERE pty_name = 'Arbeitszeit');

ALTER TABLE periods
  ALTER COLUMN per_duration SET NOT NULL,
  ALTER COLUMN per_pty_id SET NOT NULL;

