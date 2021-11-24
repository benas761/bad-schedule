# bad-schedule
A horrible attempt at making a schedule website.

# Deployment
- Download the source and run `npm install`
- Configure the database:
  - install mariadb or mysql
  - start the database with 'systemctl start mariadb.service'
  - secure the database with mysql_secure_installation
  - login as root and configure schedule user and database
    - `CREATE USER '[user]'@'[ip]' IDENTIFIED BY '[password]';`
    - `CREATE DATABASE [database];`
    - `GRANT ALL PRIVILEGES ON [database].* TO '[user]'@'[ip]';`
  - create a file `.env` in the root folder with credentials that were created in the last step
    - `DB_HOST=[ip]`
    - `DB_USER=[user]`
    - `DB_PASSWORD=[password]`
    - `DB_DATABASE=[database]`
  - login as the user from bash
    - `mysql -D [database] -u [user] -p`
  - create tables:
    - `CREATE TABLE User(user_id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL);`
    - `CREATE TABLE Schedule(schedule_id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, schedule_name VARCHAR(255) NOT NULL);`
    - `ALTER TABLE Schedule ADD CONSTRAINT fk_user_id FOREIGN KEY(user_id) REFERENCES User(user_id) ON DELETE CASCADE ON UPDATE RESTRICT;`
    - `CREATE TABLE Event(event_id INT AUTO_INCREMENT PRIMARY KEY, schedule_id INT NOT NULL, event_name VARCHAR(255), start TIME NOT NULL, end TIME NOT NULL, start_day DATE NOT NULL, period INT UNSIGNED);`
    - `ALTER TABLE Event ADD CONSTRAINT fk_schedule_id FOREIGN KEY(schedule_id) REFERENCES Schedule(schedule_id) ON DELETE CASCADE ON UPDATE RESTRICT;`
  - insert the first rows
    - `INSERT INTO User(username, password) VALUES('default', '');`
    - `INSERT INTO Schedule(user_id, schedule_name) VALUES(1, 'default');`
- Create .env file that describes your database connenction with variables DB_HOST, DB_USER, DB_PASSWORD and DB_DATABASE.