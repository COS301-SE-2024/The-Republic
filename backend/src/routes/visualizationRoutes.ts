import { Router } from "express";
import * as visualizationController from "../controllers/visualizationController";

const router = Router();

router.post("/", visualizationController.getVizData);

export default router;
