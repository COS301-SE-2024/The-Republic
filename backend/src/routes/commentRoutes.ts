import { Router } from "express";
import * as commentController from "../controllers/commentController";

const router = Router();

router.get("/", commentController.getComments);
router.get("/count", commentController.getNumComments);

export default router;
