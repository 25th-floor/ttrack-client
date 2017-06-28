/* add missing foreign key constraint */
ALTER TABLE user_target_times ADD FOREIGN KEY(utt_usr_id) REFERENCES users(usr_id);