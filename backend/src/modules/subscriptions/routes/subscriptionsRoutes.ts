import { Router } from "express";
import * as subscriptionsController from "@/modules/subscriptions/controllers/subscriptionsController";
import { verifyAndGetUser } from "@/middleware/middleware";

const router = Router();

router.use(verifyAndGetUser);
router.post("/issue", subscriptionsController.issueSubscriptions);
router.post("/category", subscriptionsController.categorySubscriptions);
router.post("/location", subscriptionsController.locationSubscriptions);
router.post("/subscriptions", subscriptionsController.getSubscriptions);
router.post("/notifications", subscriptionsController.getNotifications);

export default router;
