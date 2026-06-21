create table organizations (
  id text primary key,
  name text not null,
  created_at timestamptz not null default now()
);

create table users (
  id text primary key,
  organization_id text references organizations(id),
  name text not null,
  email text unique not null,
  password_hash text not null,
  role text not null check (role in ('ADMIN','TEACHER','STUDENT')),
  verified boolean not null default true,
  created_at timestamptz not null default now()
);

create table classes (
  id text primary key,
  organization_id text references organizations(id),
  teacher_id text references users(id),
  name text not null,
  grade text not null,
  created_at timestamptz not null default now()
);

create table class_enrollments (
  id text primary key,
  class_id text references classes(id),
  student_id text references users(id),
  joined_at timestamptz not null default now(),
  unique(class_id, student_id)
);

create table sessions (
  id text primary key,
  resource_id text not null,
  teacher_id text references users(id),
  mode text not null check (mode in ('LIVE','SELF_PACED')),
  pin_code text unique not null,
  status text not null default 'OPEN',
  created_at timestamptz not null default now()
);

create table participants (
  id text primary key,
  session_id text references sessions(id),
  user_id text references users(id),
  nickname text not null,
  role text not null,
  score integer not null default 0,
  status text not null default 'JOINED',
  joined_at timestamptz not null default now()
);

create table session_responses (
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

create table reports (
  id text primary key,
  session_id text unique references sessions(id),
  average_score integer not null,
  participant_count integer not null,
  completion_rate integer not null,
  created_at timestamptz not null default now()
);

create table integrations (
  id text primary key,
  name text not null,
  status text not null
);

create table plans (
  id text primary key,
  name text not null,
  feature_limit text not null
);

create table question_bank (
  id text primary key,
  teacher_id text references users(id),

  subject text not null,
  grade text not null,
  difficulty text not null,

  question text not null,
  options text[],
  correct_answer text not null,

  hint text,
  explanation text,

  created_at timestamptz not null default now()
);
