# Wayground-Style Online Quiz System

Full-stack implementation based on the uploaded PDF requirements and styled after the public Wayground user journey: plum hero sections, compact navigation, pink CTAs, resource cards, clean auth screens, join-code flow, teacher dashboard, live sessions, leaderboards, reports, and admin monitoring.

## Stack

- Frontend: Nuxt 3, Vue 3, TypeScript
- Backend: Node.js, Express, TypeScript
- Databases: PostgreSQL for structured platform data, MongoDB for quiz/activity content, Redis for session leaderboards
- Infrastructure: Docker Compose for local PostgreSQL, MongoDB, and Redis

## Run Locally

1. Install Node.js 20+ and Docker.
2. Copy environment values:

```bash
cp .env.example .env
cp .env.example backend/.env
cp .env.example frontend/.env
```

3. Start databases:

```bash
docker compose up -d
```

4. Install dependencies:

```bash
npm install
npm run install:all
```

5. Seed sample data:

```bash
npm run seed
```

6. Run the app:

```bash
npm run dev
```

Frontend: `http://localhost:3000`

Backend API: `http://localhost:4000/api/v1`

## Demo Accounts

- Teacher: `teacher@wayground.local` / `Password123!`
- Student: `student@wayground.local` / `Password123!`
- Admin: `admin@wayground.local` / `Password123!`

## Core API

- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `GET /api/v1/resources`
- `POST /api/v1/resources`
- `GET /api/v1/resources/:quizId`
- `PUT /api/v1/resources/:quizId`
- `DELETE /api/v1/resources/:quizId`
- `POST /api/v1/sessions`
- `POST /api/v1/sessions/join`
- `GET /api/v1/sessions/:sessionId`
- `POST /api/v1/sessions/:sessionId/responses`
- `GET /api/v1/sessions/:sessionId/leaderboard`
- `GET /api/v1/results/:participantId`
- `GET /api/v1/reports/:reportId`
- `GET /api/v1/admin/overview`

## PDF Scope Mapping

- User Management: auth, JWT session, role-based route behavior
- Quiz Management: create, list, edit, delete activity resources
- Question Bank: questions and answer options stored in MongoDB
- Live Quiz Management: host sessions, generate PIN, join participants
- Assignment Management: self-paced mode supported through session mode
- Quiz Participation: join code, answer submission, feedback
- Evaluation Engine: correctness and score calculation
- Leaderboard Management: Redis sorted leaderboard
- Result Management: participant result endpoint
- Reporting and Analytics: generated reports with average score and completion rate
- Admin: platform overview for users, resources, sessions, reports, integrations, plans
