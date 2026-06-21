import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import { z } from "zod";
import { v4 as uuid } from "uuid";
import { config } from "./config.js";
import { initSchema, pool } from "./db.js";
import { registerStudentRoutes } from "./controllers/studentController.js";
import { hashPassword, requireAuth, requireRole, signToken, verifyPassword } from "./auth.js";

const app = express();
const api = express.Router();

app.use(helmet());
app.use(cors({ origin: config.frontendOrigin, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use(rateLimit({ windowMs: 60_000, limit: 120 }));

const signupSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Email format is invalid"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["ADMIN", "TEACHER", "STUDENT"], {
    errorMap: () => ({ message: "Role must be ADMIN, TEACHER, or STUDENT" })
  })
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

const quizSchema = z.object({
  title: z.string().min(3),
  subject: z.string().min(2),
  grade: z.string().min(2),

  questionCount: z.number().optional(),

  questions: z.array(z.object({
    id: z.string().optional(),
    text: z.string().min(5),
    options: z.array(z.string().min(1)).min(2),
    correct: z.string().min(1)
  })).min(1)
});

api.post("/auth/signup", async (req, res, next) => {
  try {
    console.log("USER:", req.user);
    const body = signupSchema.parse(req.body);
    const userId = `USR-${uuid()}`;
    const hash = await hashPassword(body.password);
    await pool.query(
      "insert into organizations (id, name) values ($1, $2) on conflict (id) do nothing",
      ["ORG-001", "Default Organization"]
    );
    await pool.query(
      "insert into users (id, organization_id, name, email, password_hash, role) values ($1, $2, $3, $4, $5, $6)",
      [userId, "ORG-001", body.name, body.email, hash, body.role]
    );
    const user = { id: userId, name: body.name, email: body.email, role: body.role };
    res.status(201).json({ accessToken: signToken(user), user });
  } catch (error) {
    next(error);
  }
});

api.post("/auth/login", async (req, res, next) => {
  try {
    const body = loginSchema.parse(req.body);
    const { rows } = await pool.query("select id, name, email, role, password_hash from users where email = $1", [body.email]);
    const user = rows[0];

    if (!user || !(await verifyPassword(body.password, user.password_hash))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const payload = { id: user.id, name: user.name, email: user.email, role: user.role };
    res.json({ accessToken: signToken(payload), user: payload });
  } catch (error) {
    next(error);
  }
});

api.get("/auth/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

api.get("/resources", requireAuth, async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM resources ORDER BY created_at DESC"
    );

    res.json({ resources: rows });
  } catch (error) {
    next(error);
  }
});

api.post("/resources", requireAuth, requireRole("TEACHER"), async (req, res, next) => {
  try {
    const body = quizSchema.parse(req.body);

const resourceId = `QZ-${uuid()}`;
console.log(req.body);
await pool.query(
  `INSERT INTO resources
   (id, title, subject, grade, status, created_by, question_count)
   VALUES ($1,$2,$3,$4,$5,$6,$7)`,
  [
    resourceId,
    body.title,
    body.subject,
    body.grade,
    "Published",
    req.user!.id,
    body.questionCount || 0
  ]
);

res.status(201).json({
  resourceId,
  status: "Created"
});
  } catch (error) {
    next(error);
  }
});

api.get("/resources/:quizId", requireAuth, async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM resources WHERE id = $1",
      [req.params.quizId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json({ resource: rows[0] });
  } catch (error) {
    next(error);
  }
});

api.put("/resources/:quizId", requireAuth, requireRole("TEACHER"), async (req, res, next) => {
  try {
const body = quizSchema.partial().parse(req.body);

const result = await pool.query(
  `UPDATE resources
   SET title = COALESCE($1, title),
       subject = COALESCE($2, subject),
       grade = COALESCE($3, grade)
   WHERE id = $4`,
  [
    body.title,
    body.subject,
    body.grade,
    req.params.quizId
  ]
);

if (!result.rowCount) {
  return res.status(404).json({ message: "Quiz not found" });
}

res.json({ message: "Quiz updated successfully" });
  } catch (error) {
    next(error);
  }
});

api.delete("/resources/:quizId", requireAuth, requireRole("TEACHER"), async (req, res, next) => {
  try {
    await pool.query(
  "DELETE FROM resources WHERE id = $1",
  [req.params.quizId]
);

res.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    next(error);
  }
});

api.post("/question-bank", async (req, res, next) => {
  try {
    const questionId = `QB-${uuid()}`;

await pool.query(
  `INSERT INTO question_bank
   (id, subject, grade, difficulty, question,correct_answer, hint, explanation)
   VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
[
  questionId,
  req.body.subject,
  req.body.grade,
  req.body.difficulty,
  req.body.question,
  req.body.correctAnswer,
  req.body.hint,
  req.body.explanation
]
);

res.status(201).json({
  questionId,
  message: "Question saved"
});
  } catch (error) {
    next(error);
  }
});

api.get("/question-bank", async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM question_bank ORDER BY created_at DESC"
    );

    res.json({
      questions: rows
    });
  } catch (error) {
    next(error);
  }
});
api.delete("/question-bank/:id", async (req, res, next) => {
  try {
    await pool.query(
      "DELETE FROM question_bank WHERE id = $1",
      [req.params.id]
    );

    res.json({
      message: "Question deleted"
    });
  } catch (error) {
    next(error);
  }
});
api.post("/sessions", requireAuth, requireRole("TEACHER"), async (req, res, next) => {
  try {
    const body = z.object({ resourceId: z.string(), mode: z.enum(["LIVE", "SELF_PACED"]) }).parse(req.body);
    const sessionId = `SES-${uuid()}`;
    const pinCode = String(Math.floor(100000 + Math.random() * 900000));
    await pool.query(
      "insert into sessions (id, resource_id, teacher_id, mode, pin_code) values ($1, $2, $3, $4, $5)",
      [sessionId, body.resourceId, req.user!.id, body.mode, pinCode]
    );
    res.status(201).json({ sessionId, pinCode });
  } catch (error) {
    next(error);
  }
});

api.post("/sessions/join", async (req, res, next) => {
  try {
    const body = z.object({ pinCode: z.string().min(4), nickname: z.string().min(1), userId: z.string().optional() }).parse(req.body);
    const { rows } = await pool.query("select * from sessions where pin_code = $1 and status = 'OPEN'", [body.pinCode]);
    const session = rows[0];
    if (!session) return res.status(404).json({ message: "Session not found" });
    const participantId = `PAR-${uuid()}`;
    await pool.query(
      "insert into participants (id, session_id, user_id, nickname, role) values ($1, $2, $3, $4, $5)",
      [participantId, session.id, body.userId || null, body.nickname, body.userId ? "STUDENT" : "GUEST"]
    );
    res.status(201).json({ participantId, sessionId: session.id, status: "Joined" });
  } catch (error) {
    next(error);
  }
});

api.get("/sessions/:sessionId", async (req, res, next) => {
  try {
    const { rows } = await pool.query("select * from sessions where id = $1", [req.params.sessionId]);
    const session = rows[0];
    if (!session) return res.status(404).json({ message: "Session not found" });
    const { rows: resourceRows } = await pool.query(
  "SELECT * FROM resources WHERE id = $1",
  [session.resource_id]
);

const resource = resourceRows[0];

res.json({ session, resource });
  } catch (error) {
    next(error);
  }
});

api.post("/sessions/:sessionId/responses", async (req, res, next) => {
  try {
    const body = z.object({
      participantId: z.string(),
      questionId: z.string(),
      answer: z.string(),
      responseTimeMs: z.number().int().min(0).default(0)
    }).parse(req.body);
    const { rows } = await pool.query("select * from sessions where id = $1", [req.params.sessionId]);
    const session = rows[0];
    if (!session) return res.status(404).json({ message: "Session not found" });
const { rows: questionRows } = await pool.query(
  `SELECT correct_answer
   FROM resource_questions
   WHERE id = $1`,
  [body.questionId]
);
const question = questionRows[0];
    if (!question) return res.status(404).json({ message: "Question not found" });
    const correct = question.correct_answer === body.answer;
    const score = correct ? Math.max(50, 100 - Math.round(body.responseTimeMs / 1000)) : 0;
    await pool.query(
      "insert into session_responses (id, session_id, participant_id, question_id, answer, correct, score, response_time_ms) values ($1, $2, $3, $4, $5, $6, $7, $8) on conflict (participant_id, question_id) do nothing",
      [`RES-${uuid()}`, req.params.sessionId, body.participantId, body.questionId, body.answer, correct, score, body.responseTimeMs]
    );
    await pool.query("update participants set score = score + $1, status = 'IN_PROGRESS' where id = $2", [score, body.participantId]);
    
    await generateReport(req.params.sessionId);
    res.json({ correct, score });
  } catch (error) {
    next(error);
  }
});

api.get("/sessions/:sessionId/leaderboard", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      "select id, nickname as participant_name, score from participants where session_id = $1 order by score desc",
      [req.params.sessionId]
    );
    res.json({ leaderboard: rows.map((row, index) => ({ rank: index + 1, ...row })) });
  } catch (error) {
    next(error);
  }
});

api.get("/results/:participantId", async (req, res, next) => {
  try {
    const { rows } = await pool.query("select id as participant_id, session_id, nickname, score from participants where id = $1", [req.params.participantId]);
    if (!rows[0]) return res.status(404).json({ message: "Result not found" });
    const peers = await pool.query("select id, score from participants where session_id = $1 order by score desc", [rows[0].session_id]);
    const rank = peers.rows.findIndex((row) => row.id === req.params.participantId) + 1;
    res.json({ ...rows[0], rank });
  } catch (error) {
    next(error);
  }
});

api.get("/reports/:reportId", requireAuth, requireRole("ADMIN", "TEACHER"), async (req, res, next) => {
  try {
    const { rows } = await pool.query("select * from reports where id = $1", [req.params.reportId]);
    if (!rows[0]) return res.status(404).json({ message: "Report not found" });
    res.json({ report: rows[0] });
  } catch (error) {
    next(error);
  }
});

api.get("/admin/overview", requireAuth, requireRole("ADMIN"), async (_req, res, next) => {
  try {
    const [users, sessions, reports] = await Promise.all([
      pool.query("select role, count(*)::int from users group by role"),
      pool.query("select count(*)::int from sessions"),
      pool.query("select count(*)::int from reports")
    ]);
    const resourcesResult = await pool.query(
  "SELECT COUNT(*)::int AS count FROM resources"
);


const resources = resourcesResult.rows[0].count;
    res.json({
      users: users.rows,
      resources,
      sessions: sessions.rows[0].count,
      reports: reports.rows[0].count,
      integrations: ["Google Classroom", "Microsoft Teams", "Canvas", "Schoology", "OpenAI API", "Stripe"]
    });
  } catch (error) {
    next(error);
  }
});

async function generateReport(sessionId: string) {
  const { rows: participantRows } = await pool.query(
    "select * from participants where session_id = $1",
    [sessionId]
  );

  let questionCount = 10;

  const maxScore = Math.max(questionCount * 100, 1);

  const average = participantRows.length
    ? Math.round(
        participantRows.reduce(
          (sum, item) => sum + Number(item.score),
          0
        ) / participantRows.length / maxScore * 100
      )
    : 0;

  const completed = participantRows.filter(
    (item) => Number(item.score) >= maxScore
  ).length;

  const completion = participantRows.length
    ? Math.round((completed / participantRows.length) * 100)
    : 0;

  await pool.query(
    `insert into reports
     (id, session_id, average_score, participant_count, completion_rate)
     values ($1, $2, $3, $4, $5)
     on conflict (session_id)
     do update set
       average_score = $3,
       participant_count = $4,
       completion_rate = $5`,
    [
      `RPT-${sessionId}`,
      sessionId,
      average,
      participantRows.length,
      completion
    ]
  );
}
api.post("/classes", async (req, res, next) => {
  try {
    const classId = `CLS-${uuid()}`;

    await pool.query(
      `INSERT INTO classes
       (id, teacher_id, name, grade)
       VALUES ($1,$2,$3,$4)`,
      [
        classId,
        null,
        req.body.name,
        req.body.grade
      ]
    );

    res.status(201).json({
      classId,
      status: "Created"
    });
  } catch (error) {
    next(error);
  }
});

api.get("/test-route", (_req, res) => {
  res.json({
    message: "test route works"
  });
});
api.get("/classes", async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM classes ORDER BY created_at DESC"
    );

    res.json({
      classes: rows
    });
  } catch (error) {
    next(error);
  }
});
api.put("/classes/:id", async (req, res, next) => {
  try {
    await pool.query(
      `UPDATE classes
       SET name = $1,
           grade = $2
       WHERE id = $3`,
      [
        req.body.name,
        req.body.grade,
        req.params.id
      ]
    );

    res.json({
      message: "Class updated"
    });
  } catch (error) {
    next(error);
  }
});
api.delete("/classes/:id", async (req, res, next) => {
  try {
    await pool.query(
      "DELETE FROM classes WHERE id = $1",
      [req.params.id]
    );

    res.json({
      message: "Class deleted"
    });
  } catch (error) {
    next(error);
  }
});
api.post("/assignments", async (req, res, next) => {
  try {
    const assignmentId = `ASN-${uuid()}`;

    await pool.query(
      `INSERT INTO assignments
       (id, class_id, resource_id, due_date)
       VALUES ($1,$2,$3,$4)`,
      [
        assignmentId,
        req.body.classId,
        req.body.resourceId,
        req.body.dueDate
      ]
    );

    res.status(201).json({
      assignmentId
    });
  } catch (error) {
    next(error);
  }
});
api.get("/assignments", async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM assignments"
    );

    res.json({
      assignments: rows
    });
  } catch (error) {
    next(error);
  }
});
api.post("/sessions", async (req, res, next) => {
  try {

    const sessionId = `SES-${uuid()}`;

    await pool.query(
      `INSERT INTO sessions
       (id, resource_id, status)
       VALUES ($1,$2,$3)`,
      [
        sessionId,
        req.body.resourceId,
        "OPEN"
      ]
    );

    res.json({
      sessionId,
      pinCode: Math.floor(
        100000 + Math.random() * 900000
      )
    });

  } catch (error) {
    next(error);
  }
});
api.get("/reports", async (_req, res, next) => {

  try {

    const { rows } = await pool.query(
      "SELECT * FROM reports"
    );

    res.json({
      reports: rows
    });

  } catch (error) {
    next(error);
  }

});
// register student-specific routes (auth-protected)
registerStudentRoutes(api);
api.get("/leaderboard/:sessionId", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT *
       FROM leaderboard_entries
       WHERE session_id = $1
       ORDER BY score DESC`,
      [req.params.sessionId]
    );

    res.json({
      leaderboard: rows
    });
  } catch (error) {
    next(error);
  }
});

api.post("/quiz/submit", async (req, res) => {

  const {
    studentId,
    quizId,
    answers
  } = req.body;

  let correctCount = 0;

  for (const answer of answers) {

    const question = await pool.query(
      "SELECT * FROM questions WHERE id = $1",
      [answer.questionId]
    );

    const correctAnswer =
      question.rows[0].correct_answer;

    if (answer.selectedAnswer === correctAnswer) {
      correctCount++;
    }
  }

  const totalQuestions = answers.length;

  const wrongAnswers =
    totalQuestions - correctCount;

  const score =
    Math.round((correctCount / totalQuestions) * 100);

  res.json({
    totalQuestions,
    correctCount,
    wrongAnswers,
    score
  });
});

app.use("/api/v1", api);

app.use((error: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (error instanceof z.ZodError) {
    return res.status(400).json({ message: error.issues[0]?.message || "Invalid input data", issues: error.issues });
  }
  if (error.code === "23505") return res.status(409).json({ message: "Resource already exists" });
  console.error(error);
  res.status(500).json({ message: "Internal server error" });
});

await initSchema();

app.listen(config.port, () => {
  console.log(`API running at http://localhost:${config.port}/api/v1`);
});
