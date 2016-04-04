ALTER TABLE days
  ADD COLUMN day_usr_id INTEGER REFERENCES users (usr_id) NOT NULL,
  DROP CONSTRAINT days_day_date_key,
  ADD CONSTRAINT days_date_usr_id_key UNIQUE (day_date, day_usr_id);

ALTER TABLE periods
  ADD COLUMN per_day_id INTEGER REFERENCES days (day_id);

INSERT INTO days (day_date, day_usr_id) (SELECT DISTINCT(DATE(per_start)), per_usr_id FROM periods);

UPDATE periods SET per_day_id = (SELECT day_id FROM days WHERE day_date = DATE(per_start));

ALTER TABLE periods RENAME COLUMN per_start TO per_start_ts;
ALTER TABLE periods RENAME COLUMN per_stop TO per_stop_ts;
ALTER TABLE periods
  ADD COLUMN per_start TIME,
  ADD COLUMN per_stop TIME,
  DROP COLUMN per_usr_id;

UPDATE periods SET
  per_start = concat_ws(':', extract(hour from per_start_ts), extract(minute from per_start_ts))::time,
  per_stop = concat_ws(':', extract(hour from per_stop_ts), extract(minute from per_stop_ts))::time;

ALTER TABLE periods
  DROP COLUMN per_start_ts,
  DROP COLUMN per_stop_ts,
  ALTER COLUMN per_start SET NOT NULL,
  ALTER COLUMN per_stop SET NOT NULL,
  ALTER COLUMN per_day_id SET NOT NULL;
