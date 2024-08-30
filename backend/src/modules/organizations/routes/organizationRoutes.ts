import { Router } from "express";
import * as organizationController from "../controllers/organizationController";
import { verifyAndGetUser } from "@/middleware/middleware";

const router = Router();

router.use(verifyAndGetUser);

router.post("/create", organizationController.createOrganization);
router.get("/", organizationController.getOrganizations);
router.get("/:id", organizationController.getOrganizationById);
router.put("/:id", organizationController.updateOrganization);
router.delete("/:id", organizationController.deleteOrganization);
router.post("/:id/join", organizationController.joinOrganization);
router.post("/:id/leave", organizationController.leaveOrganization);
router.put("/:id/join-policy", organizationController.setJoinPolicy);
router.get("/:id/join-requests", organizationController.getJoinRequests);
router.post("/:id/join-requests/:requestId", organizationController.handleJoinRequest);
router.delete("/join-requests/:requestId", organizationController.deleteJoinRequest);
router.delete("/:id/members/:userId", organizationController.removeMember);
router.get("/:id/report", organizationController.generateReport);
router.get("/user/organizations", organizationController.getUserOrganizations);

export default router;