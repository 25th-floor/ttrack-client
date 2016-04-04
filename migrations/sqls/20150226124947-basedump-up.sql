CREATE SEQUENCE ttrack_seq;

CREATE TABLE users (
    usr_id       INTEGER PRIMARY KEY DEFAULT nextval('ttrack_seq'),
    usr_lastname TEXT NOT NULL,
    usr_email    TEXT NOT NULL
);

CREATE TABLE periods (
    per_id      INTEGER PRIMARY KEY      DEFAULT nextval('ttrack_seq'),
    per_start   TIMESTAMP WITH TIME ZONE DEFAULT now(),
    per_stop    TIMESTAMP WITH TIME ZONE,
    per_break   INTERVAL,
    per_usr_id  INTEGER REFERENCES users (usr_id) NOT NULL,
    per_comment TEXT
);
