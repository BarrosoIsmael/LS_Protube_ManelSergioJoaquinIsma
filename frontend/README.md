sudo apt update
sudo apt install postgresql postgresql-contrib
sudo su - postgres
psql
CREATE USER admin WITH PASSWORD '1234' CREATEROLE CREATEDB;
CREATE DATABASE protube;

intellij config:
ENV_PROTUBE_DB=protube;
ENV_PROTUBE_DB_USER=admin;
ENV_PROTUBE_DB_PWD=1234