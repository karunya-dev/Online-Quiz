
import pg from "pg";

import { config } from "./config.js";


export const pool = new pg.Pool(config.postgres);





export async function initSchema() {
  await pool.query(`
    create table if not exists organizations (
      id text primary key,
      name text not null,
      created_at timestamptz not null default now()
    );

    create table if not exists users (
      id text primary key,
      organization_id text references organizations(id),
      name text not null,
      email text unique not null,
      password_hash text not null,
      role text not null check (role in ('ADMIN','TEACHER','STUDENT')),
      verified boolean not null default true,
      created_at timestamptz not null default now()
    );

    create table if not exists classes (
      id text primary key,
      organization_id text references organizations(id),
      teacher_id text references users(id),
      name text not null,
      grade text not null,
      created_at timestamptz not null default now()
    );

    create table if not exists class_enrollments (
      id text primary key,
      class_id text references classes(id),
      student_id text references users(id),
      joined_at timestamptz not null default now(),
      unique(class_id, student_id)
    );

    create table if not exists sessions (
      id text primary key,
      resource_id text not null,
      teacher_id text references users(id),
      mode text not null check (mode in ('LIVE','SELF_PACED')),
      pin_code text unique not null,
      status text not null default 'OPEN',
      created_at timestamptz not null default now()
    );

    create table if not exists participants (
      id text primary key,
      session_id text references sessions(id),
      user_id text references users(id),
      nickname text not null,
      role text not null,
      score integer not null default 0,
      status text not null default 'JOINED',
      joined_at timestamptz not null default now()
    );

    create table if not exists session_responses (
      id text primary key,
      session_id text references sessions(id),
      participant_id text references participants(id),
      question_id text not null,
      answer text not null,
      correct boolean not null,
      score integer not null,
      response_time_ms integer not null default 0,
      submitted_at timestamptz not null default now(),
      unique(participant_id, question_id)
    );

    create table if not exists reports (
      id text primary key,
      session_id text unique references sessions(id),
      average_score integer not null,
      participant_count integer not null,
      completion_rate integer not null,
      created_at timestamptz not null default now()
    );

    create table if not exists integrations (
      id text primary key,
      name text not null,
      status text not null
    );

    create table if not exists plans (
      id text primary key,
      name text not null,
      feature_limit text not null
    );

    create table if not exists assignments (
      id text primary key,
      class_id text references classes(id),
      resource_id text,
      assigned_by text references users(id),
      due_date timestamptz,
      created_at timestamptz not null default now()
    );

    create table if not exists results (
      id text primary key,
      student_id text references users(id),
      session_id text references sessions(id),
      quiz_id text,
      score integer not null,
      correct_count integer not null,
      wrong_count integer not null,
      submitted_at timestamptz not null default now()
    );

    create table if not exists leaderboard_entries (
      id text primary key,
      session_id text references sessions(id),
      participant_id text references participants(id),
      student_id text references users(id),
      score integer not null,
      rank integer,
      created_at timestamptz not null default now(),
      unique(session_id, participant_id)
    );
  `);
}
