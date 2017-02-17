-- calculates carry time for given user
CREATE OR REPLACE FUNCTION user_calculate_carry_time(id INTEGER, due_date DATE)
  RETURNS TABLE(
    uw_date_from  DATE,
    uw_due_date   DATE,
    uw_carry_time INTERVAL
  ) LANGUAGE plpgsql STABLE
AS $$
DECLARE
  from_date  DATE;
BEGIN
  -- start with either start_timetracking, employment start or fallback
  SELECT
    LEAST(due_date, COALESCE(usr_start_timetracking, usr_employment_start, '2012-01-01'))
  INTO STRICT from_date
  FROM users
  WHERE usr_id = id;

  RETURN QUERY SELECT
                 from_date,
                 due_date,
                 SUM(sum_total_day)
               FROM (
                      SELECT
                        (SUM(COALESCE(per_duration, '00:00:00') - COALESCE(per_break, '00:00:00')) - SUM(DISTINCT user_get_target_time(id, s :: DATE))) sum_total_day
                      FROM generate_series(from_date, GREATEST(due_date, from_date), '1 day' :: INTERVAL) s
                        LEFT JOIN days ON (day_date = s AND day_usr_id = id)
                        LEFT JOIN periods ON (day_id = per_day_id)
                      GROUP BY s :: DATE
                    ) foo;
END;
$$;