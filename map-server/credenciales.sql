CREATE USER admingis WITH ENCRYPTED PASSWORD 'admingis';
GRANT ALL PRIVILEGES ON DATABASE tpigis TO admingis;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admingis;
ALTER USER admingis WITH SUPERUSER;