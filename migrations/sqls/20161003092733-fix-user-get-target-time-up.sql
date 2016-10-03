/* fix start date did not consider usr_start_timetracking */
CREATE OR REPLACE FUNCTION user_get_target_time (id INTEGER, day_date DATE) RETURNS interval
LANGUAGE plpgsql
AS $$
DECLARE
  target        interval;
  from_date     DATE;
BEGIN
  BEGIN
    SELECT COALESCE(usr_start_timetracking, usr_employment_start, '2012-01-01')
    INTO   STRICT from_date
    FROM   users
    WHERE  usr_id = id;

    SELECT CASE
           WHEN day_date >= from_date AND EXTRACT(ISODOW FROM day_date) < 6 THEN usr_target_time/5
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
