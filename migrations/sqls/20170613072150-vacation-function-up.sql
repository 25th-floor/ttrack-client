/* introduce new function to get vacations for a given user */
CREATE OR REPLACE FUNCTION user_get_periods_for_type (id INTEGER, start_date DATE, period_type CHARACTER VARYING(10) default 'Vacation')
  RETURNS TABLE(
    day_id          INTEGER,
    day_date        DATE,
    day_usr_id      INTEGER,
    day_target_time INTERVAL,
    per_id          INTEGER,
    per_comment     TEXT,
    per_duration    INTERVAL
  ) LANGUAGE plpgsql STABLE
AS $$
BEGIN
  RETURN QUERY SELECT
       days.day_id,
       days.day_date,
       days.day_usr_id,
       days.day_target_time,
       periods.per_id,
       periods.per_comment,
       periods.per_duration
    FROM days
    JOIN periods on (days.day_id = periods.per_day_id)
    WHERE days.day_usr_id = id
    AND periods.per_pty_id = period_type
    AND days.day_date >= start_date
    ORDER BY days.day_date;
END
$$;
COMMENT ON FUNCTION user_get_periods_for_type (INTEGER, DATE, CHARACTER VARYING(10)) IS 'get vacations for given user starting with start_date';
