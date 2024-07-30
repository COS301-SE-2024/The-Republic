import express from 'express';
import { PointsController } from '../controllers/pointsController';

const router = express.Router();
const pointsController = new PointsController();

router.post('/leaderboard', pointsController.getLeaderboard);

export default router;