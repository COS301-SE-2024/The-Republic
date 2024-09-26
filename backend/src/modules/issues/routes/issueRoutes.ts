import { Router } from "express";
import * as issueController from "@/modules/issues/controllers/issueController";
import { verifyAndGetUser } from "@/middleware/middleware";

const router = Router();

router.use(verifyAndGetUser);
router.post("/", issueController.getIssues);
router.post("/single", issueController.getIssueById);
router.post("/create", issueController.createIssue);
router.put("/", issueController.updateIssue);
router.delete("/", issueController.deleteIssue);
router.post("/user", issueController.getUserIssues);
router.post("/user/resolved", issueController.getUserResolvedIssues);
router.post("/self-resolution", issueController.createSelfResolution);
router.post("/external-resolution", issueController.createExternalResolution);
router.post("/respond-resolution", issueController.respondToResolution);
router.post("/user-resolutions", issueController.getUserResolutions);
router.post("/delete-resolution", issueController.deleteResolution);
router.post(
  "/organization-resolutions",
  issueController.getOrganizationResolutions,
);

export default router;
