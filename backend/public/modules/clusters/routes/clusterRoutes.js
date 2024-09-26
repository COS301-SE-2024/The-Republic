"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const clusterController_1 = require("../controllers/clusterController");
const router = express_1.default.Router();
const clusterController = new clusterController_1.ClusterController();
router.get('/', clusterController.getClusters);
router.get('/:id', clusterController.getClusterById);
router.post('/assign', clusterController.assignCluster);
exports.default = router;
