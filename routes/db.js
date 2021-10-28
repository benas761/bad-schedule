/* for starting the database:
- install mariadb or mysql
- start the database with 'systemctl start mariadb.service'
- secure the database with mysql_secure_installation
- configure schedule user and database with the credentials below
CREATE USER 'schedule'@'localhost' IDENTIFIED BY 'schdlpwd';
CREATE DATABASE schedule;
GRANT ALL PRIVILEGES ON schedule.* TO 'schedule'@'localhost';
- login as the user
mysql -D schedule -u schedule -p
- create tables:
CREATE TABLE User(user_id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL);
CREATE TABLE Schedule(schedule_id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, schedule_name VARCHAR(255) NOT NULL);
ALTER TABLE Schedule ADD CONSTRAINT fk_user_id FOREIGN KEY(user_id) REFERENCES User(user_id) ON DELETE CASCADE ON UPDATE RESTRICT;
CREATE TABLE Event(event_id INT AUTO_INCREMENT PRIMARY KEY, schedule_id INT NOT NULL, event_name VARCHAR(255), start TIME NOT NULL, end TIME NOT NULL, start_day DATE NOT NULL, period INT UNSIGNED);
ALTER TABLE Event ADD CONSTRAINT fk_schedule_id FOREIGN KEY(schedule_id) REFERENCES User(user_id) ON DELETE CASCADE ON UPDATE RESTRICT;
- insert the first rows (events are optional)
INSERT INTO User(username, password) VALUES('default', '');
INSERT INTO Schedule(user_id, schedule_name) VALUES(1, 'default');
INSERT INTO Event(schedule_id, event_name, start, end, start_day, period) VALUES(1, 'test', 180000, 190000, '2021-10-16', 1);
INSERT INTO Event(schedule_id, event_name, start, end, start_day, period) VALUES(1, 'test1', 120000, 140000, '2021-10-19', 2);
*/
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "schedule",
    password: "schdlpwd",
    database: "schedule"
});

con.connect(function(err) {
    if(err) throw err;
    console.log("Connected to the database.");
});

module.exports = con;