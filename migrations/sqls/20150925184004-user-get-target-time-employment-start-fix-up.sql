/* Replace with your SQL commands */
CREATE OR REPLACE FUNCTION user_get_target_time (id INTEGER, day_date DATE) RETURNS interval
LANGUAGE plpgsql
AS $$
DECLARE
    target        interval;
BEGIN
    BEGIN
        SELECT CASE
          WHEN day_date > usr_employment_start AND EXTRACT(ISODOW FROM day_date) < 6 THEN usr_target_time/5
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
