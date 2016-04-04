/* add employment time */
ALTER TABLE users ADD COLUMN usr_employment_start DATE NULL;
ALTER TABLE users ADD COLUMN usr_employment_end DATE NULL;

COMMENT ON COLUMN users.usr_employment_start IS 'Begin Date of Term of Employment';
COMMENT ON COLUMN users.usr_employment_end IS 'End Date of Term of Employment';
