-- insert statements

--setting up Approval Status, TimeEntryType and User Role Values
--this is stored inorder so the id is consistant with the ENUMs defined
INSERT INTO approval_status (status_type)
VALUES 
  ('WAITING'),
  ('APPROVED'),
  ('DENIED');

INSERT INTO time_entry_type (entry_type)
VALUES
  ('WORK'),
  ('SICK'),
  ('HOLIDAY');

INSERT INTO user_role (role_type)
VALUES
  ('CONSULTANT'),
  ('MANAGER'),
  ('FINANCE'),
  ('ADMIN');
  