import { Router } from "express";
import reactionController from "@/modules/reactions/controllers/reactionController";
import { verifyAndGetUser } from "@/infrastructure/middleware/middleware";

const router = Router();

router.use(verifyAndGetUser);
router.post("/", reactionController.addOrRemoveReaction);

export default router;
