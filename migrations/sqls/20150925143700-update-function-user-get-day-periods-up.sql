-- return all days between the time interval and look for periods and days for the user
-- if no data can be found, there is still a day there
CREATE OR REPLACE FUNCTION user_get_day_periods (id INTEGER, date_from TIMESTAMP, date_to TIMESTAMP)
  RETURNS TABLE(
  day_id            INTEGER,
  day_date          DATE,
  day_usr_id        INTEGER,
  day_target_time   interval,
  per_id            INTEGER,
  per_break         interval,
  per_comment       TEXT,
  per_pty_id        character varying(10),
  per_duration      interval,
  per_day_id        INTEGER,
  per_start         time,
  per_stop          time,
  pty_name          text
  )
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
        SELECT  "days"."day_id",
                COALESCE("days"."day_date", date_trunc('day', dd)::date) as day_date,
                COALESCE("days"."day_usr_id", id) as day_usr_id,
                COALESCE("days"."day_target_time", (select user_get_target_time(id, date_trunc('day', dd)::date))) as day_target_time,
                "periods"."per_id",
                "periods"."per_break",
                "periods"."per_comment",
                "periods"."per_pty_id",
                "periods"."per_duration",
                "periods"."per_day_id",
                "periods"."per_start",
                "periods"."per_stop",
                "period_types"."pty_name"
        FROM generate_series(date_from, date_to, '1 day'::interval) dd
        LEFT OUTER JOIN "days" ON ("days"."day_date" = dd::date AND "days"."day_usr_id" = id)
        LEFT OUTER JOIN "periods" ON ("periods"."per_day_id" = "days"."day_id")
        LEFT OUTER JOIN "period_types" ON ("periods"."per_pty_id" = "period_types"."pty_id")
        ORDER BY day_date, per_start;
END
$$;

COMMENT ON FUNCTION user_get_day_periods(INTEGER, TIMESTAMP, TIMESTAMP) IS 'Return days between the interval for the user including the periods for that time';
