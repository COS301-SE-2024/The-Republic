import { Router } from "express";
import reactionController from "../controllers/reactionController";

const router = Router();

router.post("/", reactionController.addOrRemoveReaction);
router.get("/:issueId", reactionController.getReactionsByIssueId);

export default router;
