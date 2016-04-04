-- needed to use tstzrange since per_start and per_stop are timestamps with timezone. if they are not you can use tsrange instead
ALTER TABLE periods ADD CONSTRAINT overlapping_times EXCLUDE USING GIST (per_usr_id WITH =, tstzrange(per_start, per_stop) WITH &&), ADD constraint check_end_bigger_start CHECK(per_stop > per_start);
