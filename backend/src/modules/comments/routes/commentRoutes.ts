import { Router } from "express";
import * as commentController from "@/modules/comments/controllers/commentController";
import { verifyAndGetUser } from "@/infrastructure/middleware/middleware";

const router = Router();

router.use(verifyAndGetUser);
router.post("/", commentController.getComments);
router.post("/count", commentController.getNumComments);
router.post("/add", commentController.addComment);
router.delete("/delete", commentController.deleteComment);

export default router;
