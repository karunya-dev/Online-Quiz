import { v4 as uuid } from "uuid";
import { hashPassword } from "./auth.js";
import { contentDb, initSchema, pool } from "./db.js";


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

const db = await contentDb();
await db.collection("activities").deleteMany({});
await db.collection("activities").insertMany([
  {
    _id: "QZ-SCIENCE-001",
    type: "QUIZ",
    title: "Science Systems Check",
    subject: "Science",
    grade: "Grade 8",
    status: "Published",
    createdBy: "USR-TEACHER",
    standards: ["MS-LS1-6"],
    accommodations: ["Extended time", "Read-aloud"],
    createdAt: new Date(),
    questions: [
      {
        id: "Q-001",
        text: "Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Jupiter", "Venus"],
        correct: "Mars"
      },
      {
        id: "Q-002",
        text: "What gas do plants absorb during photosynthesis?",
        options: ["Oxygen", "Carbon dioxide", "Hydrogen", "Helium"],
        correct: "Carbon dioxide"
      },
      {
        id: "Q-003",
        text: "Which organ pumps blood through the body?",
        options: ["Lungs", "Heart", "Kidney", "Brain"],
        correct: "Heart"
      }
    ]
  },
  {
    _id: "QZ-MATH-001",
    type: "QUIZ",
    title: "Geometry Warmup",
    subject: "Math",
    grade: "Grade 7",
    status: "Published",
    createdBy: "USR-TEACHER",
    standards: ["7.G.B"],
    accommodations: ["Reduced answer choices"],
    createdAt: new Date(),
    questions: [
      {
        id: "Q-004",
        text: "What is the sum of the angles in a triangle?",
        options: ["90 degrees", "120 degrees", "180 degrees", "360 degrees"],
        correct: "180 degrees"
      }
    ]
  }
]);

console.log("Seeded PostgreSQL, MongoDB, and Redis sample data.");
process.exit(0);
