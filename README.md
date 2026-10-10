CampusPulse — Campus Management System

CampusPulse is a full-stack campus management application designed to simplify academic and administrative activities through a centralized platform.

Features

User Authentication: Login and registration functionality.

Student Dashboard: A centralized interface for student activities.

Attendance Management: Organize and manage attendance records.

Assignments: Access and manage academic assignments.

Events: View campus events and related information.

Complaints: Submit and manage campus complaints.

Role-Based Access: Separate access for students, faculty, and administrators.

Tech Stack

Frontend

React.js

JavaScript

CSS

Backend

Node.js

Express.js

Database

MySQL

Project Structure

CampusPulse/
├── client/          # React frontend
├── server/          # Node.js backend
├── campuspulse.sql  # Database schema
├── .gitignore
└── README.md

Getting Started

Prerequisites

Install the following before running the application:

Node.js and npm

MySQL Server

Git

Installation

Clone the repository:

git clone https://github.com/bhoomi-34/CampusPulse.git
cd CampusPulse

Install frontend dependencies:

cd client
npm install

Install backend dependencies:

cd ../server
npm install

Configure your local environment variables and MySQL database using the project's database configuration.

Start the backend and frontend in separate terminals using the appropriate npm scripts defined in their respective package.json files.

Database

The campuspulse.sql file contains the database structure required for the application. Configure your local MySQL connection before running the application.

Project Status

This project is under development. Features and documentation may evolve as development progresses.

