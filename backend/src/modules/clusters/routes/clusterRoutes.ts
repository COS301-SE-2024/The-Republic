import express from "express";
import { ClusterController } from "../controllers/clusterController";

const router = express.Router();
const clusterController = new ClusterController();

router.get("/", clusterController.getClusters);
router.get("/:id", clusterController.getClusterById);
router.post("/assign", clusterController.assignCluster);

export default router;
