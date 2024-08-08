import { Router } from "express";
import * as visualizationController from "@/modules/visualizations/controllers/visualizationController";

const router = Router();

router.post("/", visualizationController.getVizData);

export default router;
