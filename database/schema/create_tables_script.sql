-- create statements

--CREATE DATABASE Timesphere_DB

--Status for both TimeSheets and HolidayRequests
CREATE TABLE status (
  id  SERIAL PRIMARY KEY,
  status_type TEXT NOT NULL
);

CREATE TABLE time_entry_type (
  id  SERIAL PRIMARY KEY,
  entry_type TEXT NOT NULL
);

--Role will define the type of User stored in db
CREATE TABLE role (
  id  SERIAL PRIMARY KEY,
  role_type TEXT NOT NULL
);

CREATE TABLE users (
   id  SERIAL PRIMARY KEY,
   firstname TEXT NOT NULL,
   lastname TEXT NOT NULL,
   email TEXT NOT NULL,
   role INT NOT NULL,
   FOREIGN KEY (role) REFERENCES role(id)
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
  week_commencing DATE NOT NULL,
  consultant INT NOT NULL,
  status INT NOT NULL,
  FOREIGN KEY (consultant) REFERENCES consultants(id),
  FOREIGN KEY (status) REFERENCES Status(id)
);

CREATE TABLE time_entries (
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  timesheet INT NOT NULL,
  entry_type INT NOT NULL,
  PRIMARY KEY (timesheet, start_time),
  FOREIGN KEY (timesheet) REFERENCES timesheets(id),
  FOREIGN KEY (entry_type) REFERENCES time_entry_type(id)
);

CREATE TABLE holidays(
  id SERIAL PRIMARY KEY,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  consultant INT NOT NULL,
  status INT NOT NULL,
  FOREIGN KEY (consultant) REFERENCES consultants(id),
  FOREIGN KEY (status) REFERENCES status(id)
);
