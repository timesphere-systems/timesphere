-- insert statements

--setting up Status, TimeEntryType and Role Values
--this is stored inorder so the id is consistant with the ENUMs defined
INSERT INTO status (status_type)
VALUES 
  ('WAITING'),
  ('APPROVED'),
  ('DENIED');
INSERT INTO time_entry_type (entry_type)
VALUES
  ('WORK'),
  ('SICK'),
  ('HOLIDAY');
INSERT INTO Role (role_type)
VALUES
  ('CONSULTANT'),
  ('MANAGER'),
  ('FINANCE'),
  ('ADMIN');