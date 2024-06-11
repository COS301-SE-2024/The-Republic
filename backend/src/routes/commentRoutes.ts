import { Router } from "express";
import * as commentController from "../controllers/commentController";
import { verifyAndGetUser } from "../middleware/middleware";

const router = Router();

router.use(verifyAndGetUser);
router.get("/", commentController.getComments);
router.get("/count", commentController.getNumComments);
router.post("/add", commentController.addComment);
router.delete("/delete", commentController.deleteComment);

export default router;
