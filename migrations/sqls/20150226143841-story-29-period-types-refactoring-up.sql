ALTER TABLE periods DROP CONSTRAINT periods_per_pty_id_fkey;

ALTER TABLE period_types ALTER COLUMN pty_id TYPE varchar(10);
ALTER TABLE period_types ALTER COLUMN pty_id DROP DEFAULT;
ALTER TABLE periods ALTER COLUMN per_pty_id TYPE varchar(10);

ALTER TABLE period_types ADD COLUMN pty_config json;

ALTER TABLE periods DISABLE TRIGGER set_period_duration;
UPDATE periods SET per_pty_id = 'Work' WHERE per_pty_id = (SELECT pty_id FROM period_types WHERE pty_name = 'Arbeitszeit');
UPDATE periods SET per_pty_id = 'Vacation' WHERE per_pty_id = (SELECT pty_id FROM period_types WHERE pty_name = 'Urlaub');
UPDATE periods SET per_pty_id = 'Sick' WHERE per_pty_id = (SELECT pty_id FROM period_types WHERE pty_name = 'Krankenstand');
UPDATE periods SET per_pty_id = 'Nursing' WHERE per_pty_id = (SELECT pty_id FROM period_types WHERE pty_name = 'Pflegeurlaub');
UPDATE periods SET per_pty_id = 'Holiday' WHERE per_pty_id = (SELECT pty_id FROM period_types WHERE pty_name = 'Feiertag');
ALTER TABLE periods ENABLE TRIGGER set_period_duration;

UPDATE period_types SET
    pty_id = 'Work',
    pty_config = '{"icon":"fa-comment", "bgcolor":"#656D78", "color":"white", "nobadge": true}'
WHERE pty_name = 'Arbeitszeit';

UPDATE period_types SET
    pty_id = 'Vacation',
    pty_config = '{"icon":"fa-car", "bgcolor":"#A0D468", "color":"white"}'
WHERE pty_name = 'Urlaub';

UPDATE period_types SET
    pty_id = 'Sick',
    pty_config = '{"icon":"fa-bed", "bgcolor":"#ED5565", "color":"white"}'
WHERE pty_name = 'Krankenstand';

UPDATE period_types SET
    pty_id = 'Nursing',
    pty_config = '{"icon":"fa-heartbeat", "bgcolor":"#FC6E51", "color":"white"}'
WHERE pty_name = 'Pflegeurlaub';

UPDATE period_types SET
    pty_id = 'Holiday',
    pty_config = '{"icon":"fa-calendar", "bgcolor":"#AC92EC", "color":"white"}'
WHERE pty_name = 'Feiertag';

INSERT INTO period_types (pty_id, pty_name, pty_config) VALUES ('Comment', 'Kommentar', '{"icon":"fa-comment", "bgcolor":"#656D78", "color":"white"}');

ALTER TABLE period_types ALTER COLUMN pty_config SET NOT NULL;

ALTER TABLE periods ADD CONSTRAINT periods_per_pty_id_fkey FOREIGN KEY (per_pty_id) REFERENCES period_types(pty_id);

