# Online Quiz System

## Overview

The Online Quiz System is a web-based assessment platform inspired by modern educational quiz applications such as Quizizz (Wayground). The system allows teachers to create quizzes, manage classes, assign assessments, track student performance, and generate reports. Students can participate in quizzes, submit responses, and view their results in real time.

## Features

### Administrator

* Dashboard with analytics and statistics
* User management
* Class management
* Quiz management
* System settings
* Reports and performance monitoring

### Teacher

* Create and manage quizzes
* Create and manage classes
* Assign quizzes to students
* Monitor student progress
* View reports and analytics

### Student

* Join assigned quizzes
* Submit quiz responses
* View quiz results
* Track performance history

## Technology Stack

### Frontend

* Vue.js
* Nuxt.js
* TypeScript

### Backend

* Node.js
* Express.js
* TypeScript

### Database

* PostgreSQL

### Authentication

* JWT (JSON Web Token)

### Version Control

* Git
* GitHub

## Project Structure

```text
Online_Quiz/
├── backend/
├── frontend/
├── database/
│   └── schema.sql
├── README.md
├── package.json
├── package-lock.json
└── .gitignore
```

## Prerequisites

Before running the project, install:

* Node.js (v18 or later)
* npm
* PostgreSQL (v16 recommended)
* Git


```

## Backend Setup

Navigate to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Run the backend:

```bash
npm run dev
```

Backend API:

```text
http://localhost:4000
```

## Frontend Setup

Navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Configure frontend environment:

```env
NUXT_PUBLIC_API_BASE=http://localhost:4000/api/v1
```

Run the frontend:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:3000
```


## API Modules

### Authentication

* Login
* Register
* JWT Authentication

### Admin Module

* Dashboard
* User Management
* Analytics
* Reports
* Settings

### Teacher Module

* Quiz Management
* Class Management
* Assignments

### Student Module

* Quiz Participation
* Results
* Performance Tracking

## Future Enhancements

* Live quiz sessions
* Leaderboards
* AI-generated questions
* Advanced analytics
* Email notifications
* Multi-language support

