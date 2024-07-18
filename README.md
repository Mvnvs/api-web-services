API Web Services Project
Description

The Web Services API project is a modern event management application, designed to simplify creating, managing, and participating in events. This application is built with an architecture based on Node.js and Express for the backend, and React for the frontend. It uses MongoDB as a database to store user and event information.
Authentication is managed via Google OAuth, providing a smooth and secure user experience. In addition to CRUD (Create, Read, Update, Delete) operations on events, the application allows users to easily subscribe and unsubscribe from events. A powerful filtering system helps users quickly find the events they are interested in.
The application is also Dockerized, making it easier to deploy and run in consistent development and production environments.

Prerequisites

Node.js (version 14 or higher)
npm (version 6 or higher)
Docker (optional, for deployment with Docker Compose)

Clone the repository

git clone https://github.com/Mvnvs/api-web-services

Install dependencies

-cd backend
-npm install

-cd frontend
-npm install

Configuration
Create an .env file in the backend directory with the following information:

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
SECRET_KEY=your-jwt-secret-key
MONGO_URI=mongodb://mongo:27017/your-database

Startup
Local boot
Backend
cd backend
npm start
Frontend
cd front end
npm start

Getting started with Docker
Make sure Docker and Docker Compose are installed on your machine.

docker-compose up --build

Use

Go to http://localhost:3001 to use the application.
Use http://localhost:3000 to access the backend API.

Project structure

backend/: Backend source code (Node.js/Express)
frontend/: Frontend source code (React)
docker-compose.yml: Configuring Docker Compose
Dockerfile: Docker files for backend and frontend

Features

Authentication via Google OAuth
Complete event management: creation, update, deletion
Registering and unregistering users for events
Effective event filtering
Modern and responsive user interface
