import { v4 as uuid } from "uuid";
import { hashPassword } from "./auth.js";
import { initSchema, pool } from "./db.js";


await initSchema();


await pool.query("delete from reports");
await pool.query("delete from session_responses");
await pool.query("delete from participants");
await pool.query("delete from sessions");
await pool.query("delete from class_enrollments");
await pool.query("delete from classes");
await pool.query("delete from users");
await pool.query("delete from plans");
await pool.query("delete from integrations");
await pool.query("delete from organizations");

await pool.query("insert into organizations (id, name) values ($1, $2)", ["ORG-001", "River Valley School"]);

const hash = await hashPassword("Password123!");
await pool.query(
  "insert into users (id, organization_id, name, email, password_hash, role) values ($1,$2,$3,$4,$5,$6),($7,$8,$9,$10,$11,$12),($13,$14,$15,$16,$17,$18)",
  [
    "USR-TEACHER", "ORG-001", "Maya Teacher", "teacher@wayground.local", hash, "TEACHER",
    "USR-STUDENT", "ORG-001", "Ari Student", "student@wayground.local", hash, "STUDENT",
    "USR-ADMIN", "ORG-001", "Nina Admin", "admin@wayground.local", hash, "ADMIN"
  ]
);

await pool.query("insert into classes (id, organization_id, teacher_id, name, grade) values ($1,$2,$3,$4,$5)", [
  "CLS-001", "ORG-001", "USR-TEACHER", "Grade 8 Science", "Grade 8"
]);
await pool.query("insert into class_enrollments (id, class_id, student_id) values ($1,$2,$3)", [
  "ENR-001", "CLS-001", "USR-STUDENT"
]);

for (const name of ["Google Classroom", "Microsoft Teams", "Canvas", "Schoology", "OpenAI API", "Stripe"]) {
  await pool.query("insert into integrations (id, name, status) values ($1,$2,$3)", [`INT-${uuid()}`, name, "CONNECTED"]);
}

await pool.query("insert into plans (id, name, feature_limit) values ($1,$2,$3),($4,$5,$6)", [
  "PLAN-FREE", "Teacher Free", "Live sessions, reports, question bank",
  "PLAN-SCHOOL", "School & District", "Integrations, admin analytics, accommodations"
]);


console.log("Seeded PostgreSQL sample data.");
process.exit(0);
