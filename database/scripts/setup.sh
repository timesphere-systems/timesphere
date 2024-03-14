#!/bin/bash

# Required
# POSTGRES_USER - Default admin user
# POSTGRES_DB - Default database name
# POSTGRES_APP_DB - Application database name
# POSTGRES_APP_USER - Application database user
# POSTGRES_APP_PASSWORD - Application database password

psql -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" -c "CREATE DATABASE ${POSTGRES_APP_DB};"
psql -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" -c "CREATE USER ${POSTGRES_APP_USER} WITH PASSWORD '${POSTGRES_APP_PASSWORD}';"
psql -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" -c "GRANT ALL PRIVILEGES ON DATABASE ${POSTGRES_APP_DB} TO ${POSTGRES_APP_USER};"
psql -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" -c "GRANT ALL ON SCHEMA public TO ${POSTGRES_APP_USER};"
psql -U "${POSTGRES_USER}" -d "${POSTGRES_APP_DB}" -f /docker-entrypoint-initdb.d/schema/create_tables_script.sql
psql -U "${POSTGRES_USER}" -d "${POSTGRES_APP_DB}" -f /docker-entrypoint-initdb.d/schema/insert_table_data_script.sql
psql -U "${POSTGRES_USER}" -d "${POSTGRES_APP_DB}" -c "GRANT ALL ON ALL TABLES IN SCHEMA public TO ${POSTGRES_APP_USER};"
