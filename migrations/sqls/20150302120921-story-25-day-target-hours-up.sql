ALTER TABLE days DROP COLUMN day_comment;

ALTER TABLE days DROP COLUMN day_target_time;
ALTER TABLE days ADD COLUMN day_target_time interval;
UPDATE days SET day_target_time = interval '7 hours 42 minutes';
UPDATE days SET day_target_time = interval '0 hours' WHERE extract(dow from day_date::timestamp) IN (0,6);
ALTER TABLE days ALTER COLUMN day_target_time SET NOT NULL;
