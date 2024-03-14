-- create statements

--CREATE DATABASE Timesphere_DB

--Status for both TimeSheets and HolidayRequests
CREATE TABLE status (
  status_id  SERIAL PRIMARY KEY,
  status_type TEXT NOT NULL
);

CREATE TABLE time_entry_type (
  time_entry_type_id  SERIAL PRIMARY KEY,
  entry_type TEXT NOT NULL
);

--Role will define the type of User stored in db
CREATE TABLE role (
  role_id  SERIAL PRIMARY KEY,
  role_type TEXT NOT NULL
);

CREATE TABLE users (
   user_id  SERIAL PRIMARY KEY,
   firstname TEXT NOT NULL,
   lastname TEXT NOT NULL,
   email TEXT NOT NULL,
   role INT NOT NULL,
   FOREIGN KEY (role) REFERENCES role(role_id)
);

-- Table storing Consultant Specific Details
CREATE TABLE consultants (
     consultant_id INT PRIMARY KEY,
     contracted_hours DECIMAL NOT NULL,
     manager INT NOT NULL,
     FOREIGN KEY (consultant_id) REFERENCES users(user_id),
     FOREIGN KEY (manager) REFERENCES users(user_id)
);

-- Weekly Timesheets
CREATE TABLE timesheets (
  timesheet_id SERIAL PRIMARY KEY,
  week_commencing DATE NOT NULL,
  consultant INT NOT NULL,
  status INT NOT NULL,
  FOREIGN KEY (consultant) REFERENCES consultants(consultant_id),
  FOREIGN KEY (status) REFERENCES Status(status_id)
);

CREATE TABLE time_entries (
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  timesheet INT NOT NULL,
  entry_type INT NOT NULL,
  PRIMARY KEY (timesheet, start_time),
  FOREIGN KEY (timesheet) REFERENCES timesheets(timesheet_id),
  FOREIGN KEY (entry_type) REFERENCES time_entry_type(time_entry_type_id)
);

CREATE TABLE holidays(
  holiday_id SERIAL PRIMARY KEY,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  consultant INT NOT NULL,
  status INT NOT NULL,
  FOREIGN KEY (consultant) REFERENCES consultants(consultant_id),
  FOREIGN KEY (status) REFERENCES status(status_id)
);
