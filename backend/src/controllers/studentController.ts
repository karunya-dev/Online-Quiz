import express from "express";
import { requireAuth, requireRole } from "../auth.js";
import * as service from "../services/studentService.js";

export function registerStudentRoutes(api: express.Router) {
  api.get("/student/assignments", requireAuth, async (req, res, next) => {
    try {
      const list = await service.getAssignmentsForStudent(req.user!.id);
      res.json({ assignments: list });
    } catch (err) {
      next(err);
    }
  });

  api.get("/student/assignments/:id", requireAuth, async (req, res, next) => {
    try {
      const assignment = await service.getAssignmentById(req.params.id, req.user!.id);
      if (!assignment) return res.status(404).json({ message: "Assignment not found" });
      res.json({ assignment });
    } catch (err) {
      next(err);
    }
  });

  api.post("/responses/submit", requireAuth, requireRole("STUDENT"), async (req, res, next) => {
    try {
      const body = req.body;
      if (!body.sessionId || !Array.isArray(body.answers)) return res.status(400).json({ message: "Invalid payload" });
      const result = await service.submitResponses({ sessionId: body.sessionId, answers: body.answers, studentId: req.user!.id });
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  api.get("/student/results", requireAuth, requireRole("STUDENT"), async (req, res, next) => {
    try {
      const rows = await service.getResultsForStudent(req.user!.id);
      res.json({ results: rows });
    } catch (err) {
      next(err);
    }
  });

  api.get("/student/results/:id", requireAuth, requireRole("STUDENT"), async (req, res, next) => {
    try {
      const row = await service.getResultById(req.params.id, req.user!.id);
      if (!row) return res.status(404).json({ message: "Result not found" });
      res.json({ result: row });
    } catch (err) {
      next(err);
    }
  });
}
