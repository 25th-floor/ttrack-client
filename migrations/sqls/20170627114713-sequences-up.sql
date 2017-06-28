/* update sequence for days table */
CREATE SEQUENCE ttrack_days_seq;
ALTER SEQUENCE ttrack_days_seq OWNED BY days.day_id;
SELECT SETVAL('ttrack_days_seq' ::regclass, coalesce(max(day_id), 1)) from days;
ALTER TABLE days ALTER day_id SET DEFAULT NEXTVAL('ttrack_days_seq' ::regclass);

/* update sequence for periods table */
CREATE SEQUENCE ttrack_periods_seq;
ALTER SEQUENCE ttrack_periods_seq OWNED BY periods.per_id;
SELECT SETVAL('ttrack_periods_seq' ::regclass, coalesce(max(per_id), 1)) from periods;
ALTER TABLE periods ALTER per_id SET DEFAULT NEXTVAL('ttrack_periods_seq' ::regclass);

/* remove old generic sequence */
DROP SEQUENCE ttrack_seq;