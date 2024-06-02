import { Router } from "express";
import issueController from "../controllers/issueController";

const router = Router();

router.get("/issues", issueController.getAllIssues);
router.get("/issues/:id", issueController.getIssueById);
router.post("/issues", issueController.createIssue);
router.put("/issues/:id", issueController.updateIssue);
router.delete("/issues/:id", issueController.deleteIssue);

export default router;
