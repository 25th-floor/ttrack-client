/* create new table for target times */
CREATE TABLE user_target_times AS
  SELECT
    usr_id AS utt_usr_id,
    COALESCE(usr_start_timetracking, usr_employment_start, '2012-01-01') AS utt_start,
    'infinity'::date AS utt_end,
    usr_target_time AS utt_target_time
  FROM users;



/* adjsut constraints */
ALTER TABLE user_target_times
  ADD CONSTRAINT utt_overlapping_times EXCLUDE USING GIST (utt_usr_id WITH =, TSRANGE(utt_start, utt_end) WITH &&),
  ADD CONSTRAINT utt_check_end_bigger_start CHECK(utt_end > utt_start),
  ADD PRIMARY KEY (utt_usr_id, utt_start, utt_end),
  ALTER utt_target_time SET NOT NULL,
  ALTER utt_end SET DEFAULT 'infinity';


ALTER TABLE users
  DROP COLUMN usr_target_time,
  DROP COLUMN usr_start_timetracking;



/* introduce new function to get start date for user since it's used multiple times */
CREATE OR REPLACE FUNCTION user_get_start_date (id INTEGER) RETURNS DATE
LANGUAGE plpgsql
AS $$
DECLARE
  target        DATE;
BEGIN
    BEGIN
    SELECT COALESCE(
        (
          SELECT MIN(utt_start) earliest_start
          FROM user_target_times
          WHERE utt_usr_id = id
        ),
        usr_employment_start,
        '2012-01-01'
    )
    INTO STRICT target
    FROM users WHERE usr_id = id;

    EXCEPTION
    WHEN NO_DATA_FOUND THEN
      RAISE EXCEPTION 'user % not found', id;
  END;

  RETURN target;
END
$$;



/* adjust function to new target times feature */
CREATE OR REPLACE FUNCTION user_get_target_time (id INTEGER, day_date DATE) RETURNS interval
LANGUAGE plpgsql
AS $$
DECLARE
  target        INTERVAL;
  start_date    DATE;
BEGIN

  -- done explicitly to check if user exists, otherwise function doesn't get called due to the optimizer
  SELECT user_get_start_date(id)
  INTO   STRICT start_date;


  SELECT CASE
         WHEN day_date >= start_date  AND EXTRACT(ISODOW FROM day_date) < 6
           THEN utt_target_time/5
         ELSE '00:00:00'::INTERVAL
         END
  INTO   target
  FROM   user_target_times
  WHERE  utt_usr_id = id
  AND    COALESCE(TSRANGE(utt_start, utt_end, '[)') @> day_date::TIMESTAMP, TRUE);


  RETURN COALESCE(target, '00:00:00'::INTERVAL);
END
$$;


/* adjust function to new feature */
CREATE OR REPLACE FUNCTION user_worktime(id INTEGER, due_date DATE)
  RETURNS TABLE(
    uw_date          DATE,
    uw_year          INTEGER,
    uw_week          INTEGER,
    uw_dow           INTEGER,
    uw_diff_per_day  INTERVAL,
    uw_new           INTERVAL,
    uw_sum_per_day   INTERVAL,
    uw_diff_per_week INTERVAL,
    uw_sum_per_week  INTERVAL,
    uw_sum_overall   INTERVAL
  ) LANGUAGE plpgsql STABLE
AS $$
DECLARE
  from_date         DATE;
BEGIN
  -- done explicitly to check if user exists, otherwise function doesn't get called due to the optimizer
  SELECT user_get_start_date(id)
  INTO   STRICT from_date;

  RETURN QUERY WITH days_raw AS (
      SELECT    s::DATE,
        EXTRACT(YEAR FROM s::DATE)::INTEGER yy,
        EXTRACT(WEEK FROM s::DATE)::INTEGER ww,
        EXTRACT(ISODOW FROM s::DATE)::INTEGER dow,
        (SUM(COALESCE(per_duration, '00:00:00') - COALESCE(per_break, '00:00:00')) - SUM(DISTINCT user_get_target_time(id, s::DATE))) sum_total_day,
        SUM(DISTINCT user_get_target_time(id, s::DATE))
      FROM      generate_series(from_date, due_date, '1 day'::interval) s
        LEFT join days ON (day_date = s AND day_usr_id = id)
        LEFT JOIN periods ON (day_id = per_day_id)
      GROUP BY  s
  )
  SELECT   *,
    SUM(sum_total_day) OVER (ORDER BY s) sum_per_day,
    CASE WHEN dow = 7 THEN SUM(sum_total_day) OVER (PARTITION BY yy, ww ORDER BY yy, ww) ELSE NULL END diff_per_week,
    CASE WHEN dow = 7 THEN SUM(sum_total_day) OVER (ORDER BY s) ELSE NULL END sum_per_week,
    SUM(sum_total_day) OVER () sum_overall
  FROM     days_raw
  ORDER BY s;
END;
$$;
