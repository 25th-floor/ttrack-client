UPDATE period_types SET
    pty_config = '{"icon":"fa-comment", "bgcolor":"#656D78", "color":"white", "nobadge": true, "types": {"period": true, "fullday": true, "halfday": true}}'
WHERE pty_id = 'Work';

UPDATE period_types SET
    pty_config = '{"icon":"fa-car", "bgcolor":"#A0D468", "color":"white", "types": {"period": false, "fullday": true, "halfday": true}}'
WHERE pty_id = 'Vacation';

UPDATE period_types SET
    pty_config = '{"icon":"fa-bed", "bgcolor":"#ED5565", "color":"white", "types": {"period": false, "fullday": true, "halfday": false}}'
WHERE pty_id = 'Sick';

UPDATE period_types SET
    pty_config = '{"icon":"fa-heartbeat", "bgcolor":"#FC6E51", "color":"white", "types": {"period": false, "fullday": true, "halfday": true}}'
WHERE pty_id = 'Nursing';

UPDATE period_types SET
    pty_config = '{"icon":"fa-calendar", "bgcolor":"#AC92EC", "color":"white", "types": {"period": false, "fullday": true, "halfday": true}}'
WHERE pty_id = 'Holiday';

UPDATE period_types SET
    pty_config = '{"icon":"fa-comment", "bgcolor":"#656D78", "color":"white", "types": {"period": false, "fullday": false, "halfday": false}}'
WHERE pty_id = 'Comment';
