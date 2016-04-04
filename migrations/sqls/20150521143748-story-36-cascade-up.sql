alter table periods drop constraint periods_per_day_id_fkey;

alter table periods add constraint periods_per_day_id_fkey foreign key (per_day_id) references days(day_id) on delete cascade;
