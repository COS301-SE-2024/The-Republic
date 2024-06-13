import { Router } from "express";
import issueController from "../controllers/issueController";

const router = Router();

router.get("/", issueController.getAllIssues);
router.post("/", issueController.getIssues);
router.get("/:id", issueController.getIssueById);
router.post("/create", issueController.createIssue);
router.put("/:id", issueController.updateIssue);
router.delete("/:id", issueController.deleteIssue);
router.put("/resolve/:id", issueController.resolveIssue);

export default router;
