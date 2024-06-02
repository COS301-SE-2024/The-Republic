import { Router } from "express";
import issueController from "../controllers/issueController";

const router = Router();

router.get("/", issueController.getAllIssues);
router.get("/:id", issueController.getIssueById);
router.post("/", issueController.createIssue);
router.put("/:id", issueController.updateIssue);
router.delete("/:id", issueController.deleteIssue);

export default router;
