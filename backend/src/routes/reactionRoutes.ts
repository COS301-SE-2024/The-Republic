import { Router } from "express";
import reactionController from "../controllers/reactionController";
import { verifyAndGetUser } from "../middleware/middleware";

const router = Router();

router.use(verifyAndGetUser);
router.post("/", reactionController.addOrRemoveReaction);

export default router;
