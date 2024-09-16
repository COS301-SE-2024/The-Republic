import { Router } from "express";
import * as organizationController from "@/modules/organizations/controllers/organizationController";
import { verifyAndGetUser } from "@/middleware/middleware";

const router = Router();

router.use(verifyAndGetUser);

router.get("/search", organizationController.searchOrganizations);
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
router.get('/:id/join-requests/user', organizationController.getJoinRequestByUser);
router.delete("/:id/members/:userId", organizationController.removeMember);
router.get("/:id/report", organizationController.generateReport);
router.get("/:id/posts", organizationController.getOrganizationPosts);
router.post("/:id/posts", organizationController.createOrganizationPost);
router.delete("/:id/posts/:postId", organizationController.deleteOrganizationPost);
router.get("/:id/top-members", organizationController.getTopActiveMembers);
router.get('/:id/members', organizationController.getOrganizationMembers);
router.post('/:id/members/:userId/promote', organizationController.promoteToAdmin);
router.get("/:id/posts/:postId", organizationController.getOrganizationPost);
router.get("/:id/members/:userId", organizationController.checkUserMembership);
router.get("/:id/activity-logs", organizationController.getActivityLogs);

export default router;