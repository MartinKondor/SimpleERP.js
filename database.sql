SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

DROP TABLE IF EXISTS `employee`;
DROP TABLE IF EXISTS `group`;
DROP TABLE IF EXISTS `contact`;
DROP TABLE IF EXISTS `company`;
DROP TABLE IF EXISTS `event`;
DROP TABLE IF EXISTS `project`;
DROP TABLE IF EXISTS `forgotten_password`;
DROP TABLE IF EXISTS `worksheet`;
DROP TABLE IF EXISTS `attendance_record`;
DROP TABLE IF EXISTS `offer`;
DROP TABLE IF EXISTS `offer_attachment`;
DROP TABLE IF EXISTS `project_attachment`;
DROP TABLE IF EXISTS `worksheet_services`;
DROP TABLE IF EXISTS `worksheet_workdays`;
DROP TABLE IF EXISTS `worksheet_employee`;
DROP TABLE IF EXISTS `worksheet_document`;
DROP TABLE IF EXISTS `workdays`;
DROP TABLE IF EXISTS `services`;

CREATE TABLE `employee` (
     `id` INTEGER AUTO_INCREMENT PRIMARY KEY,
     `name` VARCHAR(128),
     `email` VARCHAR(128),
     `phone_number` VARCHAR(128),
     `password` VARCHAR(128),
     `group_id` INTEGER
);

CREATE TABLE `group` (
   `id` INTEGER AUTO_INCREMENT PRIMARY KEY,
   `name` VARCHAR(128),
   `company` VARCHAR(128)
);

CREATE TABLE `contact` (
   `id` INT AUTO_INCREMENT PRIMARY KEY,
   `name` VARCHAR(128) NOT NULL,
   `phone_number` VARCHAR(20) NOT NULL,
   `email` VARCHAR(128),
   `notes` TEXT,
   `company_id` INTEGER
);

-- client company
CREATE TABLE `company` (
   `id` INT AUTO_INCREMENT PRIMARY KEY,
   `name` VARCHAR(128) NOT NULL,
   `headquarters` TEXT,
   `contact_person_id` INTEGER
);

CREATE TABLE `event` (
   `id` INT AUTO_INCREMENT PRIMARY KEY,
   `name` VARCHAR(128) NOT NULL,
   `date` DATETIME NOT NULL,
   `description` TEXT,
   `project_id` INTEGER
);

CREATE TABLE `project` (
   `id` INT AUTO_INCREMENT PRIMARY KEY,
   `deadline` VARCHAR(128) NOT NULL,
   `status` VARCHAR(128) NOT NULL,
   `description` TEXT,
   `company_id` INTEGER
);

CREATE TABLE `forgotten_password` (
   `id` INT AUTO_INCREMENT PRIMARY KEY,
   `token` TEXT,
   `employee_id` INTEGER
);

CREATE TABLE `offer` (
   `id` INT AUTO_INCREMENT PRIMARY KEY,
   `creation_date` DATETIME NOT NULL,
   `company_id` INTEGER NOT NULL,
   `project_id` INTEGER
);

-- Attachment tables
CREATE TABLE `offer_attachment` (
   `offer_id` INTEGER NOT NULL,
   `attachment` TEXT NOT NULL  -- Link or data to the attachment
);

CREATE TABLE `project_attachment` (
   `project_id` INTEGER NOT NULL,
   `attachment` TEXT NOT NULL  -- Link or data to the attachment
);

-- Worksheet
CREATE TABLE workdays (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) UNIQUE
);
INSERT INTO workdays (name) VALUES
('Monday'),
('Tuesday'),
('Wednesday'),
('Thursday'),
('Friday'),
('Saturday'),
('Sunday');

CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE
);
INSERT INTO services (name) VALUES 
('Programming'), 
('Survey'), 
('Installation'), 
('Assembly'), 
('Modernization'), 
('Maintenance'), 
('Warranty Repair'), 
('Non-warranty Repair');

CREATE TABLE worksheet_document (
    id SERIAL PRIMARY KEY,
    location TEXT,
    description TEXT,
    entry TEXT,
    client_id INTEGER,
    client_contact_id INTEGER,
    employee_id INTEGER,
    signature TEXT,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    quality_feedback INTEGER,
    creator_employee_id INTEGER
);

CREATE TABLE worksheet_workdays (
    worksheet_id INTEGER,
    workday_id INTEGER
);

CREATE TABLE worksheet_services (
    worksheet_id INTEGER,
    service_id INTEGER
);

CREATE TABLE worksheet_employee (
    worksheet_id INTEGER,
    employee_id INTEGER
);
-- /Worksheet

-- -------------------------------------------------------- --
-- -------------------------------------------------------- --
-- ------------------ NO PRODUCTION ZONE ------------------ --
-- -------------------------------------------------------- --
-- -------------------------------------------------------- --

-- Example data for testing
INSERT INTO `group` (name, company) VALUES ('admin', 'SimpleERP');
INSERT INTO `group` (name, company) VALUES ('guest', 'SimpleERP');
INSERT INTO `group` (name, company) VALUES ('employee', 'SimpleERP');

-- Password is always: simplee
INSERT INTO `employee` (name, email, phone_number, password, group_id)
VALUES ('Admin User', 'admin@example.com', '+36111111111', '$2a$10$mSLRhNImeVbv0/QvKYEPwObVlxkccomi9y5BC8dxaXpImu0BEWG1O', (SELECT id FROM `group` WHERE name = 'admin'));
INSERT INTO `employee` (name, email, phone_number, password, group_id)
VALUES ('Guest User', 'guest@example.com', '06211111111', '$2a$10$mSLRhNImeVbv0/QvKYEPwObVlxkccomi9y5BC8dxaXpImu0BEWG1O', (SELECT id FROM `group` WHERE name = 'guest'));
INSERT INTO `employee` (name, email, phone_number, password, group_id)
VALUES ('Employee User', 'employee@example.com', '06311111111', '$2a$10$mSLRhNImeVbv0/QvKYEPwObVlxkccomi9y5BC8dxaXpImu0BEWG1O', (SELECT id FROM `group` WHERE name = 'employee'));

INSERT INTO `company` (name, headquarters) VALUES ('AAA Company', 'AAA Headquarters');
INSERT INTO `company` (name, headquarters) VALUES ('BBB Company', 'BBB Headquarters');
INSERT INTO `company` (name, headquarters) VALUES ('CCC Company', 'CCC Headquarters');

INSERT INTO `contact` (name, phone_number, email, notes, company_id) VALUES ('AAA Albert', '+36 11 111 1111', 'albert@aaa.com', 'note a', (SELECT id FROM `company` WHERE name = 'AAA Company'));
INSERT INTO `contact` (name, phone_number, email, notes, company_id) VALUES ('AAAA Alberta', '+36 22 222 2222', 'alberta@aaa.com', 'Special note', (SELECT id FROM `company` WHERE name = 'AAA Company'));
INSERT INTO `contact` (name, phone_number, email, notes, company_id) VALUES ('BBB Béla', '06222222222', 'bela@bbb.com', 'note b', (SELECT id FROM `company` WHERE name = 'BBB Company'));
