CREATE OR REPLACE FUNCTION set_period_duration_trigger_function() RETURNS TRIGGER
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.per_duration := NEW.per_stop - NEW.per_start;
    RETURN NEW;
END;
$$;

CREATE TRIGGER set_period_duration BEFORE INSERT OR UPDATE ON periods FOR EACH ROW EXECUTE PROCEDURE set_period_duration_trigger_function();
