-- insert statements

--setting up Status, TimeEntryType and Role Values
--this is stored inorder so the id is consistant with the ENUMs defined
INSERT INTO Status (STATUS_TYPE)
VALUES 
  ('WAITING'),
  ('APPROVED'),
  ('DENIED');
INSERT INTO TimeEntryType (ENTRY_TYPE)
VALUES
  ('WORK'),
  ('SICK'),
  ('HOLIDAY');
INSERT INTO Role (ROLE_TYPE)
VALUES
  ('CONSULTANT'),
  ('MANAGER'),
  ('FINANCE'),
  ('ADMIN');