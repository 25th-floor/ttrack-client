ALTER TABLE users ADD COLUMN usr_target_time interval;
UPDATE users SET usr_target_time = interval '38 hours 30 minutes';
ALTER TABLE users ALTER COLUMN usr_target_time SET NOT NULL;
