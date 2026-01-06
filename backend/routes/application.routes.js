import express from "express";
import {
  getApplication,
  getHistory,
  saveApplication,
  updateStatus,
  deleteApplication, 
} from "../controllers/application.controller.js";

const router = express.Router();

router.get("/history", getHistory);
router.post("/save", saveApplication);
router.patch("/:id/status", updateStatus);
router.delete("/:id", deleteApplication);
router.get("/:id", getApplication);

export default router;
