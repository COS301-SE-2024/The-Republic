"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResolutionService = void 0;
const resolutionRepository_1 = require("../repositories/resolutionRepository");
const response_1 = require("@/types/response");
const pointsService_1 = require("@/modules/points/services/pointsService");
const clusterService_1 = require("@/modules/clusters/services/clusterService");
const issueRepository_1 = __importDefault(require("@/modules/issues/repositories/issueRepository"));
const resolutionResponseRepository_1 = require("../repositories/resolutionResponseRepository");
class ResolutionService {
    constructor() {
        this.resolutionRepository = new resolutionRepository_1.ResolutionRepository();
        this.pointsService = new pointsService_1.PointsService();
        this.clusterService = new clusterService_1.ClusterService();
        this.issueRepository = new issueRepository_1.default();
        this.ResolutionResponseRepository = new resolutionResponseRepository_1.ResolutionResponseRepository();
    }
    createResolution(resolution) {
        return __awaiter(this, void 0, void 0, function* () {
            const isResolved = yield this.issueRepository.isIssueResolved(resolution.issue_id);
            if (isResolved) {
                throw (0, response_1.APIError)({
                    code: 400,
                    success: false,
                    error: "This issue has already been resolved.",
                });
            }
            const pendingResolution = yield this.issueRepository.getPendingResolutionForIssue(resolution.issue_id);
            if (pendingResolution) {
                throw (0, response_1.APIError)({
                    code: 400,
                    success: false,
                    error: "There is already a pending resolution for this issue.",
                });
            }
            const issue = yield this.issueRepository.getIssueById(resolution.issue_id);
            const clusterId = issue.cluster_id;
            let status = 'pending';
            if (resolution.resolution_source === 'self') {
                status = 'accepted';
                yield this.issueRepository.updateIssueResolutionStatus(resolution.issue_id, true);
                yield this.clusterService.moveAcceptedMembersToNewCluster(resolution.issue_id, [resolution.resolver_id]);
                yield this.pointsService.awardPoints(resolution.resolver_id, 70, "self-resolution logged");
                // Award points to the organization if it's a self-resolution
                if (resolution.organization_id) {
                    yield this.pointsService.awardOrganizationPoints(resolution.organization_id, 2, "self-resolution logged");
                }
            }
            const clusterIssues = clusterId ? yield this.issueRepository.getIssuesInCluster(clusterId) : [issue];
            const numClusterMembers = clusterIssues.length;
            const createdResolution = yield this.resolutionRepository.createResolution(Object.assign(Object.assign({}, resolution), { status, num_cluster_members: numClusterMembers, num_cluster_members_accepted: resolution.resolution_source === 'self' ? 1 : 0, num_cluster_members_rejected: 0 }));
            // Create resolutions for other issues in the cluster
            if (clusterId) {
                for (const clusterIssue of clusterIssues) {
                    if (clusterIssue.issue_id !== resolution.issue_id) {
                        yield this.resolutionRepository.createResolution(Object.assign(Object.assign({}, resolution), { issue_id: clusterIssue.issue_id, status: 'pending', num_cluster_members: numClusterMembers, num_cluster_members_accepted: 0, num_cluster_members_rejected: 0 }));
                    }
                }
            }
            // Notify cluster members for both self and external resolutions
            yield this.notifyClusterMembers(createdResolution, clusterIssues);
            return createdResolution;
        });
    }
    notifyClusterMembers(resolution, clusterIssues) {
        return __awaiter(this, void 0, void 0, function* () {
            // Implement logic to notify cluster members about the new resolution
            // For self-resolutions, inform them that the issue has been resolved but ask for their feedback
            // For external resolutions, ask for their acceptance or rejection
            // Only notify users who have issues in the cluster
            for (const issue of clusterIssues) {
                if (issue.user_id !== resolution.resolver_id) {
                    // Implement notification logic here
                }
            }
        });
    }
    updateResolutionStatus(resolutionId, status, userId, satisfactionRating) {
        return __awaiter(this, void 0, void 0, function* () {
            const resolution = yield this.resolutionRepository.getResolutionById(resolutionId);
            if (resolution.status !== 'pending') {
                throw (0, response_1.APIError)({
                    code: 400,
                    success: false,
                    error: "This resolution has already been processed.",
                });
            }
            const issue = yield this.issueRepository.getIssueById(resolution.issue_id);
            if (issue.user_id !== userId) {
                throw (0, response_1.APIError)({
                    code: 403,
                    success: false,
                    error: "You don't have permission to respond to this resolution.",
                });
            }
            yield this.ResolutionResponseRepository.createResponse(resolutionId, userId, status, satisfactionRating);
            const updatedResolution = yield this.resolutionRepository.updateResolution(resolutionId, {
                num_cluster_members_accepted: status === 'accepted' ? resolution.num_cluster_members_accepted + 1 : resolution.num_cluster_members_accepted,
                num_cluster_members_rejected: status === 'declined' ? resolution.num_cluster_members_rejected + 1 : resolution.num_cluster_members_rejected,
            });
            const totalResponses = updatedResolution.num_cluster_members_accepted + updatedResolution.num_cluster_members_rejected;
            // Only process the final decision if all members have responded
            if (totalResponses === updatedResolution.num_cluster_members) {
                if (updatedResolution.num_cluster_members_accepted > updatedResolution.num_cluster_members_rejected) {
                    yield this.finalizeResolution(updatedResolution);
                }
                else if (updatedResolution.num_cluster_members_accepted < updatedResolution.num_cluster_members_rejected) {
                    yield this.rejectResolution(updatedResolution);
                }
                else {
                    // In case of a tie, accept external resolutions and reject self-resolutions
                    if (updatedResolution.resolution_source !== 'self') {
                        yield this.finalizeResolution(updatedResolution);
                    }
                    else {
                        yield this.rejectResolution(updatedResolution);
                    }
                }
            }
            return updatedResolution;
        });
    }
    finalizeResolution(resolution) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.resolutionRepository.updateResolution(resolution.resolution_id, {
                status: 'accepted',
            });
            yield this.issueRepository.updateIssueResolutionStatus(resolution.issue_id, true);
            if (resolution.resolution_source === 'self') {
                yield this.pointsService.awardPoints(resolution.resolver_id, 50, "self-resolution accepted");
            }
            else {
                if (resolution.organization_id) {
                    yield this.pointsService.awardOrganizationPoints(resolution.organization_id, 75, "External resolution accepted for Organization member");
                }
                yield this.pointsService.awardPoints(resolution.resolver_id, 100, "external resolution accepted");
            }
            // Award points to the organization
            yield this.issueRepository.updateIssueResolutionStatus(resolution.issue_id, true);
            const acceptedUsers = yield this.getAcceptedUsers(resolution.resolution_id);
            // Move cluster members who ACCEPTED to a NEW CLUSTER
            yield this.clusterService.moveAcceptedMembersToNewCluster(resolution.issue_id, acceptedUsers);
        });
    }
    rejectResolution(resolution) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.resolutionRepository.updateResolution(resolution.resolution_id, {
                status: 'declined',
            });
            if (resolution.resolution_source !== 'self') {
                // Check if all members have responded or if a majority has rejected
                const totalResponses = resolution.num_cluster_members_accepted + resolution.num_cluster_members_rejected;
                const majority = Math.ceil(resolution.num_cluster_members / 2);
                if (totalResponses === resolution.num_cluster_members || resolution.num_cluster_members_rejected > majority) {
                    yield this.pointsService.penalizeUser(resolution.resolver_id, 50, "external resolution rejected");
                }
            }
            // Get the list of users who accepted the resolution
            const acceptedUsers = yield this.getAcceptedUsers(resolution.resolution_id);
            // Move cluster members who ACCEPTED to a NEW CLUSTER
            yield this.clusterService.moveAcceptedMembersToNewCluster(resolution.issue_id, acceptedUsers);
        });
    }
    getAcceptedUsers(resolutionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const acceptedUsers = yield this.ResolutionResponseRepository.getAcceptedUsers(resolutionId);
            return acceptedUsers.map(user => user.userId);
        });
    }
    getUserResolutions(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.resolutionRepository.getUserResolutions(userId);
        });
    }
    getOrganizationResolutions(organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.resolutionRepository.getOrganizationResolutions(organizationId);
        });
    }
    getResolutionsByIssueId(issueId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.resolutionRepository.getResolutionsByIssueId(issueId);
            }
            catch (error) {
                console.error(`Error fetching resolutions for issue ${issueId}:`, error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while fetching resolutions for the issue.",
                });
            }
        });
    }
    deleteResolution(resolutionId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.resolutionRepository.deleteResolution(resolutionId, userId);
        });
    }
}
exports.ResolutionService = ResolutionService;
