import { Router } from "express";
import * as reportsController from "@/modules/reports/controllers/reportsController";
import { verifyAndGetUser } from "@/middleware/middleware";

const router = Router();

router.use(verifyAndGetUser);
router.post(
  "/groupedResolutionStatus",
  reportsController.getAllIssuesGroupedByResolutionStatus,
);
router.post(
  "/countResolutionStatus",
  reportsController.getIssueCountsGroupedByResolutionStatus,
);
router.post(
  "/groupedResolutionAndCategory",
  reportsController.getIssueCountsGroupedByResolutionAndCategory,
);
router.post("/groupedCreatedAt", reportsController.getIssuesGroupedByCreatedAt);
router.post("/groupedCategory", reportsController.getIssuesGroupedByCategory);
router.post(
  "/groupedCategoryAndCreatedAt",
  reportsController.getIssuesCountGroupedByCategoryAndCreatedAt,
);
router.post("/groupedPoliticalAssociation", reportsController.groupedByPoliticalAssociation);

export default router;
