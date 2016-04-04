-- get target time of one day for a specific user
-- may change in future on a user basis, therefore it's good to have it encapsulated in this function
CREATE OR REPLACE FUNCTION user_get_target_time (id INTEGER, day_date DATE) RETURNS interval
LANGUAGE plpgsql
AS $$
DECLARE
    target        interval;
BEGIN
    BEGIN
        SELECT CASE
          WHEN EXTRACT(ISODOW FROM day_date) < 6 THEN usr_target_time/5
          ELSE '00:00:00'::INTERVAL
        END
        INTO   STRICT target
        FROM   users
        WHERE  usr_id = id;

        EXCEPTION
            WHEN NO_DATA_FOUND THEN
                RAISE EXCEPTION 'user % not found', id;
    END;

    RETURN target;
END
$$;

COMMENT ON FUNCTION user_get_target_time(INTEGER, DATE) IS 'Return Target Time of a day from a user';


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
        ORDER BY day_date;
END
$$;

COMMENT ON FUNCTION user_get_day_periods(INTEGER, TIMESTAMP, TIMESTAMP) IS 'Return days between the interval for the user including the periods for that time';

-- update indices for performance
ALTER TABLE days DROP CONSTRAINT days_date_usr_id_key;
ALTER TABLE days ADD CONSTRAINT days_date_usr_id_key UNIQUE (day_usr_id, day_date);

-- add index which does not work yet because of to less data, but will in time kick in
CREATE INDEX periods_day_id_key ON periods (per_day_id);
