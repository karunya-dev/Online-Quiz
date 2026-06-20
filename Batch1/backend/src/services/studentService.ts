import { pool, contentDb } from "../db.js";
import { v4 as uuid } from "uuid";

export async function getAssignmentsForStudent(studentId: string) {
  // find classes student is enrolled in
  const { rows: enrollRows } = await pool.query("select class_id from class_enrollments where student_id = $1", [studentId]);
  const classIds = enrollRows.map((r: any) => r.class_id);
  if (!classIds.length) return [];
  const { rows: assignmentRows } = await pool.query(
    `select * from assignments where class_id = any($1::text[]) order by created_at desc`,
    [classIds]
  );

  const db = await contentDb();
  const results = [];
  for (const a of assignmentRows) {
    const resource = await db.collection("activities").findOne({ _id: a.resource_id });
    results.push({ ...a, resource });
  }
  return results;
}

export async function getAssignmentById(assignmentId: string, studentId: string) {
  const { rows } = await pool.query("select * from assignments where id = $1", [assignmentId]);
  const assignment = rows[0];
  if (!assignment) return null;
  // verify student belongs to the class
  const { rows: enroll } = await pool.query("select 1 from class_enrollments where class_id = $1 and student_id = $2", [assignment.class_id, studentId]);
  if (!enroll.length) return null;
  const db = await contentDb();
  const resource = await db.collection("activities").findOne({ _id: assignment.resource_id });
  return { ...assignment, resource };
}

export async function submitResponses(payload: {
  sessionId: string;
  answers: { questionId: string; answer: string; responseTimeMs?: number }[];
  studentId: string;
}) {
  const { sessionId, answers, studentId } = payload;
  // find session
  const { rows: sessionRows } = await pool.query("select * from sessions where id = $1", [sessionId]);
  const session = sessionRows[0];
  if (!session) throw new Error("Session not found");

  // find or create participant
  const { rows: partRows } = await pool.query("select * from participants where session_id = $1 and user_id = $2", [sessionId, studentId]);
  let participant = partRows[0];
  if (!participant) {
    const participantId = `PAR-${uuid()}`;
    await pool.query("insert into participants (id, session_id, user_id, nickname, role) values ($1,$2,$3,$4,$5)", [participantId, sessionId, studentId, 'Student', 'STUDENT']);
    const { rows: newPart } = await pool.query("select * from participants where id = $1", [participantId]);
    participant = newPart[0];
  }

  const db = await contentDb();
  const resource = await db.collection("activities").findOne({ _id: session.resource_id });
  const questions = resource?.questions || [];
  const questionMap: Record<string, any> = {};
  for (const q of questions) questionMap[q.id] = q;

  let totalScore = 0;
  let correctCount = 0;
  for (const ans of answers) {
    const q = questionMap[ans.questionId];
    const correct = q && q.correct === ans.answer;
    if (correct) correctCount++;
    const score = correct ? Math.max(50, 100 - Math.round((ans.responseTimeMs || 0) / 1000)) : 0;
    totalScore += score;
    await pool.query(
      `insert into session_responses (id, session_id, participant_id, question_id, answer, correct, score, response_time_ms)
       values ($1,$2,$3,$4,$5,$6,$7,$8)
       on conflict (participant_id, question_id) do update set answer = excluded.answer, correct = excluded.correct, score = excluded.score, response_time_ms = excluded.response_time_ms`,
      [`RES-${uuid()}`, sessionId, participant.id, ans.questionId, ans.answer, correct, score, ans.responseTimeMs || 0]
    );
    await pool.query("update participants set score = score + $1 where id = $2", [score, participant.id]);
  }

  const totalQuestions = questions.length || answers.length;
  const wrongCount = totalQuestions - correctCount;
  const percentage = Math.round((totalScore / Math.max(totalQuestions * 100, 1)) * 100);

  const resultId = `RSL-${uuid()}`;
  await pool.query(
    `insert into results (id, student_id, session_id, quiz_id, score, correct_count, wrong_count)
     values ($1,$2,$3,$4,$5,$6,$7)`,
    [resultId, studentId, sessionId, session.resource_id, totalScore, correctCount, wrongCount]
  );

  // update leaderboard_entries
  await pool.query(
    `insert into leaderboard_entries (id, session_id, participant_id, student_id, score)
     values ($1,$2,$3,$4,$5)
     on conflict (session_id, participant_id) do update set score = excluded.score, created_at = now()`,
    [`LBE-${uuid()}`, sessionId, participant.id, studentId, totalScore]
  );

  // compute rank
  const { rows: peers } = await pool.query("select participant_id, score from leaderboard_entries where session_id = $1 order by score desc", [sessionId]);
  const rank = peers.findIndex((p: any) => p.participant_id === participant.id) + 1;
  await pool.query("update leaderboard_entries set rank = $1 where session_id = $2 and participant_id = $3", [rank, sessionId, participant.id]);

  return { resultId, participantId: participant.id, totalQuestions, correctCount, wrongCount, totalScore, percentage, rank };
}

export async function getResultsForStudent(studentId: string) {
  const { rows } = await pool.query("select * from results where student_id = $1 order by submitted_at desc", [studentId]);
  return rows;
}

export async function getResultById(resultId: string, studentId: string) {
  const { rows } = await pool.query("select * from results where id = $1 and student_id = $2", [resultId, studentId]);
  return rows[0];
}
