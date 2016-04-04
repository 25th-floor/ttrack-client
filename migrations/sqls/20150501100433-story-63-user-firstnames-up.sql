ALTER TABLE users ADD COLUMN usr_firstname text null;
ALTER TABLE users ALTER COLUMN usr_firstname SET NOT NULL;
