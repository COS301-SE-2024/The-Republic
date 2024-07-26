import { Router } from "express";
import * as issueController from "@/modules/issues/controllers/issueController";
import { verifyAndGetUser } from "@/infrastructure/middleware/middleware";

const router = Router();

router.use(verifyAndGetUser);
router.post("/", issueController.getIssues);
router.post("/single", issueController.getIssueById);
router.post("/create", issueController.createIssue);
router.put("/", issueController.updateIssue);
router.delete("/", issueController.deleteIssue);
router.put("/resolve/", issueController.resolveIssue);
router.post("/user", issueController.getUserIssues);
router.post("/user/resolved", issueController.getUserResolvedIssues);

export default router;
