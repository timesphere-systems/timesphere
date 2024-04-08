-- create statements

--CREATE DATABASE Timesphere_DB

CREATE OR REPLACE FUNCTION check_existing_open_time_entry()
RETURNS TRIGGER AS $$
BEGIN
    -- Check for overlap with open-ended time entries
    IF NEW.end_time IS NULL THEN
        IF EXISTS (
            SELECT 1
            FROM time_entries
            WHERE timesheet = NEW.timesheet
              AND id != NEW.id
              AND (
                  NEW.start_time < end_time
                  OR end_time IS NULL  -- Overlap with another open-ended entry
              )
        ) THEN
            RAISE EXCEPTION 'New or updated time entry overlaps with an existing time entry.';
        END IF;
    ELSE
        -- Check for overlap with any time entry, considering both start and end times
        IF EXISTS (
            SELECT 1
            FROM time_entries
            WHERE timesheet = NEW.timesheet
              AND id != NEW.id
              AND (
                  NEW.start_time < COALESCE(end_time, 'infinity'::timestamp)
                  AND NEW.end_time > start_time
              )
        ) THEN
            RAISE EXCEPTION 'New or updated time entry overlaps with an existing time entry.';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--Status for both TimeSheets and HolidayRequests
CREATE TABLE approval_status (
  id  SERIAL PRIMARY KEY,
  status_type TEXT NOT NULL
);

CREATE TABLE time_entry_type (
  id  SERIAL PRIMARY KEY,
  entry_type TEXT NOT NULL
);

--user role will define the type of User stored in db
CREATE TABLE user_role (
  id  SERIAL PRIMARY KEY,
  role_type TEXT NOT NULL
);

CREATE TABLE users (
   id SERIAL PRIMARY KEY,
   auth0_username TEXT UNIQUE NOT NULL,
   firstname TEXT NOT NULL,
   lastname TEXT NOT NULL,
   email TEXT NOT NULL,
   user_role INT NOT NULL,
   FOREIGN KEY (user_role) REFERENCES user_role(id)
);

-- Table storing Consultant Specific Details
CREATE TABLE consultants (
     id SERIAL PRIMARY KEY,
     user_id INT NOT NULL,
     contracted_hours DECIMAL NOT NULL,
     manager_id INT NOT NULL,
     FOREIGN KEY (user_id) REFERENCES users(id),
     FOREIGN KEY (manager_id) REFERENCES users(id)
);

-- Weekly Timesheets
CREATE TABLE timesheets (
  id SERIAL PRIMARY KEY,
  created DATE NOT NULL,
  submitted DATE,
  start DATE NOT NULL,
  consultant INT NOT NULL,
  approval_status INT NOT NULL,
  FOREIGN KEY (consultant) REFERENCES consultants(id),
  FOREIGN KEY (approval_status) REFERENCES approval_status(id)
);

CREATE TABLE time_entries (
  id SERIAL PRIMARY KEY,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP CHECK (end_time > start_time),
  timesheet INT NOT NULL,
  entry_type INT NOT NULL,
  FOREIGN KEY (timesheet) REFERENCES timesheets(id),
  FOREIGN KEY (entry_type) REFERENCES time_entry_type(id)
);

CREATE TABLE holidays(
  id SERIAL PRIMARY KEY,
  created DATE NOT NULL,
  submitted DATE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  consultant INT NOT NULL,
  approval_status INT NOT NULL,
  FOREIGN KEY (consultant) REFERENCES consultants(id),
  FOREIGN KEY (approval_status) REFERENCES approval_status(id)
);

CREATE TABLE issues(
  id SERIAL PRIMARY KEY,
  submitted DATE NOT NULL,
  title VARCHAR(50) NOT NULL,
  description text NOT NULL,
  solved BOOLEAN NOT NULL,
  user_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TRIGGER trg_before_insert_or_update_time_entry
BEFORE INSERT OR UPDATE ON time_entries
FOR EACH ROW EXECUTE FUNCTION check_existing_open_time_entry();
