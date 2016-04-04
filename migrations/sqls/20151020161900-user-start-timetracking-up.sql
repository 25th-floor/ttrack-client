-- add new field for starting timetracking
ALTER TABLE users ADD COLUMN usr_start_timetracking DATE NULL;
COMMENT ON COLUMN users.usr_start_timetracking IS 'optional start date for calculating carry time if user started timetracking long after the employment start';
