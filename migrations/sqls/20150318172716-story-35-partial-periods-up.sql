ALTER TABLE periods ALTER COLUMN per_stop DROP NOT NULL;
ALTER TABLE periods ALTER COLUMN per_duration SET NOT NULL;
ALTER TABLE periods ALTER COLUMN per_duration SET DEFAULT NULL;

CREATE OR REPLACE FUNCTION set_period_duration_trigger_function() RETURNS TRIGGER
    LANGUAGE plpgsql
    AS $$
BEGIN

    IF NEW.per_start IS NOT NULL AND NEW.per_stop IS NOT NULL AND NEW.per_duration IS NULL THEN
        NEW.per_duration := NEW.per_stop - NEW.per_start;
    ELSIF NEW.per_duration IS NOT NULL AND (NEW.per_start IS NOT NULL OR NEW.per_stop IS NOT NULL) THEN
        RAISE EXCEPTION 'specify either per_start and per_stop or per_duration not both!';
    ELSIF NEW.per_duration IS NULL AND NEW.per_start IS NOT NULL AND NEW.per_stop IS NULL THEN
        NEW.per_duration := interval '0 hours 0 minutes';
    ELSIF NEW.per_duration IS NULL AND (NEW.per_start IS NULL OR NEW.per_stop IS NULL) THEN
        RAISE EXCEPTION 'you have to specify both per_start and per_stop or per_duration';
    END IF;

    RETURN NEW;
END;
$$;
