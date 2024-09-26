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
const issueRepository_1 = __importDefault(require("@/modules/issues/repositories/issueRepository"));
const response_1 = require("@/types/response");
const locationRepository_1 = require("@/modules/locations/repositories/locationRepository");
const supabaseClient_1 = __importDefault(require("@/modules/shared/services/supabaseClient"));
const pointsService_1 = require("@/modules/points/services/pointsService");
const clusterService_1 = require("@/modules/clusters/services/clusterService");
const openAIService_1 = require("@/modules/shared/services/openAIService");
const resolutionService_1 = require("@/modules/resolutions/services/resolutionService");
const reactionRepository_1 = __importDefault(require("@/modules/reactions/repositories/reactionRepository"));
const commentRepository_1 = require("@/modules/comments/repositories/commentRepository");
class IssueService {
    constructor() {
        this.issueRepository = new issueRepository_1.default();
        this.locationRepository = new locationRepository_1.LocationRepository();
        this.pointsService = new pointsService_1.PointsService();
        this.clusterService = new clusterService_1.ClusterService();
        this.openAIService = new openAIService_1.OpenAIService();
        this.resolutionService = new resolutionService_1.ResolutionService();
        this.reactionRepository = new reactionRepository_1.default();
        this.commentRepository = new commentRepository_1.CommentRepository();
    }
    setIssueRepository(issueRepository) {
        this.issueRepository = issueRepository;
    }
    setLocationRepository(locationRepository) {
        this.locationRepository = locationRepository;
    }
    setPointsService(pointsService) {
        this.pointsService = pointsService;
    }
    setClusterService(clusterService) {
        this.clusterService = clusterService;
    }
    setOpenAIService(openAIService) {
        this.openAIService = openAIService;
    }
    setResolutionService(resolutionService) {
        this.resolutionService = resolutionService;
    }
    setReactionRepository(reactionRepository) {
        this.reactionRepository = reactionRepository;
    }
    setCommentRepository(commentRepository) {
        this.commentRepository = commentRepository;
    }
    getIssues(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (params.from === undefined || !params.amount) {
                throw (0, response_1.APIError)({
                    code: 400,
                    success: false,
                    error: "Missing required fields for getting issues",
                });
            }
            const issues = yield this.issueRepository.getIssues(params);
            const issuesWithUserInfo = issues.map((issue) => {
                const isOwner = issue.user_id === params.user_id;
                if (issue.is_anonymous) {
                    issue.user = {
                        user_id: null,
                        email_address: null,
                        username: "Anonymous",
                        fullname: "Anonymous",
                        image_url: null,
                        is_owner: false,
                        total_issues: null,
                        resolved_issues: null,
                        user_score: 0,
                        location_id: null,
                        location: null
                    };
                }
                return Object.assign(Object.assign({}, issue), { is_owner: isOwner });
            });
            return (0, response_1.APIData)({
                code: 200,
                success: true,
                data: issuesWithUserInfo,
            });
        });
    }
    getIssueById(issue) {
        return __awaiter(this, void 0, void 0, function* () {
            const issue_id = issue.issue_id;
            if (!issue_id) {
                throw (0, response_1.APIError)({
                    code: 400,
                    success: false,
                    error: "Missing required fields for getting an issue",
                });
            }
            const resIssue = yield this.issueRepository.getIssueById(issue_id, issue.user_id);
            const isOwner = resIssue.user_id === issue.user_id;
            if (resIssue.cluster_id) {
                const clusterInfo = yield this.clusterService.getClusterById(resIssue.cluster_id);
                resIssue.cluster = clusterInfo;
            }
            if (resIssue.is_anonymous) {
                resIssue.user = {
                    user_id: null,
                    email_address: null,
                    username: "Anonymous",
                    fullname: "Anonymous",
                    image_url: null,
                    is_owner: false,
                    total_issues: null,
                    resolved_issues: null,
                    user_score: 0,
                    location_id: null,
                    location: null
                };
            }
            return (0, response_1.APIData)({
                code: 200,
                success: true,
                data: Object.assign(Object.assign({}, resIssue), { is_owner: isOwner }),
            });
        });
    }
    createIssue(issue, image) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!issue.user_id) {
                throw (0, response_1.APIError)({
                    code: 401,
                    success: false,
                    error: "You need to be signed in to create an issue",
                });
            }
            if (!issue.category_id || !issue.content) {
                throw (0, response_1.APIError)({
                    code: 400,
                    success: false,
                    error: "Missing required fields for creating an issue",
                });
            }
            if (issue.content.length > 500) {
                throw (0, response_1.APIError)({
                    code: 413,
                    success: false,
                    error: "Issue content exceeds the maximum length of 500 characters",
                });
            }
            let imageUrl = null;
            if (image) {
                const fileName = `${issue.user_id}_${Date.now()}-${image.originalname}`;
                const { error } = yield supabaseClient_1.default.storage
                    .from("issues")
                    .upload(fileName, image.buffer);
                if (error) {
                    console.error(error);
                    throw (0, response_1.APIError)({
                        code: 500,
                        success: false,
                        error: "An error occurred while uploading the image. Please try again.",
                    });
                }
                const { data: urlData } = supabaseClient_1.default.storage
                    .from("issues")
                    .getPublicUrl(fileName);
                imageUrl = urlData.publicUrl;
            }
            delete issue.issue_id;
            const createdIssue = yield this.issueRepository.createIssue(Object.assign(Object.assign({}, issue), { image_url: imageUrl }));
            this.processIssueAsync(createdIssue);
            const isFirstIssue = yield this.pointsService.getFirstTimeAction(issue.user_id, "created first issue");
            const points = isFirstIssue ? 50 : 20;
            yield this.pointsService.awardPoints(issue.user_id, points, isFirstIssue ? "created first issue" : "created an issue");
            return (0, response_1.APIData)({
                code: 200,
                success: true,
                data: createdIssue,
            });
        });
    }
    processIssueAsync(issue) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const embedding = yield this.openAIService.getEmbedding(issue.content);
                yield this.issueRepository.setIssueEmbedding(issue.issue_id, embedding);
                issue.content_embedding = embedding;
                yield this.clusterService.assignClusterToIssue(issue);
            }
            catch (error) {
                console.error(`Error processing issue ${issue}:`, error);
            }
        });
    }
    updateIssue(issue) {
        return __awaiter(this, void 0, void 0, function* () {
            const user_id = issue.user_id;
            if (!user_id) {
                throw (0, response_1.APIError)({
                    code: 401,
                    success: false,
                    error: "You need to be signed in to update an issue",
                });
            }
            const issue_id = issue.issue_id;
            if (!issue_id) {
                throw (0, response_1.APIError)({
                    code: 400,
                    success: false,
                    error: "Missing required fields for updating an issue",
                });
            }
            if (issue.created_at || issue.resolved_at) {
                throw (0, response_1.APIError)({
                    code: 400,
                    success: false,
                    error: "Cannot change the time an issue was created or resolved",
                });
            }
            delete issue.user_id;
            delete issue.issue_id;
            const updatedIssue = yield this.issueRepository.updateIssue(issue_id, issue, user_id);
            return (0, response_1.APIData)({
                code: 200,
                success: true,
                data: updatedIssue,
            });
        });
    }
    deleteIssue(issue) {
        return __awaiter(this, void 0, void 0, function* () {
            const user_id = issue.user_id;
            if (!user_id) {
                throw (0, response_1.APIError)({
                    code: 401,
                    success: false,
                    error: "You need to be signed in to delete an issue",
                });
            }
            const issue_id = issue.issue_id;
            if (!issue_id) {
                throw (0, response_1.APIError)({
                    code: 400,
                    success: false,
                    error: "Missing required fields for deleting an issue",
                });
            }
            const issueToDelete = yield this.issueRepository.getIssueById(issue_id, user_id);
            if (issueToDelete.image_url) {
                const imageName = issueToDelete.image_url.split("/").slice(-1)[0];
                const { error } = yield supabaseClient_1.default.storage
                    .from("issues")
                    .remove([imageName]);
                if (error) {
                    console.error("Failed to delete image from storage:", error);
                    throw (0, response_1.APIError)({
                        code: 500,
                        success: false,
                        error: "An error occurred while deleting the image. Please try again.",
                    });
                }
            }
            if (issueToDelete.cluster_id) {
                // No await so it runs without blocking
                this.clusterService.removeIssueFromCluster(issue_id, issueToDelete.cluster_id);
            }
            yield this.issueRepository.deleteIssue(issue_id, user_id);
            return (0, response_1.APIData)({
                code: 204,
                success: true,
            });
        });
    }
    resolveIssue(issue) {
        return __awaiter(this, void 0, void 0, function* () {
            const user_id = issue.user_id;
            const issue_id = issue.issue_id;
            if (!user_id || !issue_id) {
                throw (0, response_1.APIError)({
                    code: 400,
                    success: false,
                    error: "Missing required fields for resolving an issue",
                });
            }
            return this.createSelfResolution(issue_id, user_id, "Issue resolved by owner");
        });
    }
    createSelfResolution(issueId, userId, resolutionText, proofImage, organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //console.log(`Starting createSelfResolution for issue ${issueId} by user ${userId}`);
                const issue = yield this.issueRepository.getIssueById(issueId);
                if (issue.resolved_at) {
                    throw (0, response_1.APIError)({
                        code: 400,
                        success: false,
                        error: "This issue has already been resolved.",
                    });
                }
                if (issue.user_id !== userId) {
                    throw (0, response_1.APIError)({
                        code: 403,
                        success: false,
                        error: "You can only create a self-resolution for your own issues.",
                    });
                }
                let numClusterMembers = 1;
                if (issue.cluster_id) {
                    const cluster = yield this.clusterService.getClusterById(issue.cluster_id);
                    numClusterMembers = cluster.issue_count;
                }
                let imageUrl = null;
                if (proofImage) {
                    const fileName = `${userId}_${Date.now()}-${proofImage.originalname}`;
                    const { error } = yield supabaseClient_1.default.storage
                        .from("resolutions")
                        .upload(fileName, proofImage.buffer);
                    if (error) {
                        console.error("Image upload error:", error);
                        throw (0, response_1.APIError)({
                            code: 500,
                            success: false,
                            error: "An error occurred while uploading the image. Please try again.",
                        });
                    }
                    const { data: urlData } = supabaseClient_1.default.storage
                        .from("resolutions")
                        .getPublicUrl(fileName);
                    imageUrl = urlData.publicUrl;
                }
                const resolution = yield this.resolutionService.createResolution({
                    issue_id: issueId,
                    resolver_id: userId,
                    resolution_text: resolutionText,
                    proof_image: imageUrl,
                    resolution_source: 'self',
                    num_cluster_members: numClusterMembers,
                    political_association: null,
                    state_entity_association: null,
                    resolved_by: null,
                    organization_id: organizationId
                });
                return (0, response_1.APIData)({
                    code: 200,
                    success: true,
                    data: resolution,
                });
            }
            catch (error) {
                console.error("Error in createSelfResolution:", error);
                if (error instanceof response_1.APIError) {
                    throw error;
                }
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while creating a self-resolution.",
                });
            }
        });
    }
    createExternalResolution(issueId, userId, resolutionText, proofImage, politicalAssociation, stateEntityAssociation, resolvedBy, organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const issue = yield this.issueRepository.getIssueById(issueId);
                if (issue.resolved_at) {
                    throw (0, response_1.APIError)({
                        code: 400,
                        success: false,
                        error: "This issue has already been resolved.",
                    });
                }
                let numClusterMembers = 1;
                if (issue.cluster_id) {
                    const cluster = yield this.clusterService.getClusterById(issue.cluster_id);
                    numClusterMembers = cluster.issue_count;
                }
                let imageUrl = null;
                if (proofImage) {
                    const fileName = `${userId}_${Date.now()}-${proofImage.originalname}`;
                    const { error } = yield supabaseClient_1.default.storage
                        .from("resolutions")
                        .upload(fileName, proofImage.buffer);
                    if (error) {
                        console.error(error);
                        throw (0, response_1.APIError)({
                            code: 500,
                            success: false,
                            error: "An error occurred while uploading the image. Please try again.",
                        });
                    }
                    const { data: urlData } = supabaseClient_1.default.storage
                        .from("resolutions")
                        .getPublicUrl(fileName);
                    imageUrl = urlData.publicUrl;
                }
                const resolution = yield this.resolutionService.createResolution({
                    issue_id: issueId,
                    resolver_id: userId,
                    resolution_text: resolutionText,
                    proof_image: imageUrl,
                    resolution_source: resolvedBy ? 'other' : 'unknown',
                    num_cluster_members: numClusterMembers,
                    political_association: politicalAssociation || null,
                    state_entity_association: stateEntityAssociation || null,
                    resolved_by: resolvedBy || null,
                    organization_id: organizationId
                });
                return (0, response_1.APIData)({
                    code: 200,
                    success: true,
                    data: resolution,
                });
            }
            catch (error) {
                if (error instanceof response_1.APIError) {
                    throw error;
                }
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while creating an external resolution.",
                });
            }
        });
    }
    respondToResolution(resolutionId, userId, accept, satisfactionRating) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resolution = yield this.resolutionService.updateResolutionStatus(resolutionId, accept ? 'accepted' : 'declined', userId, satisfactionRating);
                return (0, response_1.APIData)({
                    code: 200,
                    success: true,
                    data: resolution,
                });
            }
            catch (error) {
                if (error instanceof response_1.APIError) {
                    throw error;
                }
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while responding to the resolution.",
                });
            }
        });
    }
    getUserIssues(issue) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = issue.profile_user_id;
            if (!userId) {
                throw (0, response_1.APIError)({
                    code: 401,
                    success: false,
                    error: "Missing profile user ID",
                });
            }
            const issues = yield this.issueRepository.getUserIssues(userId);
            const issuesWithUserInfo = issues.map((issue) => {
                const isOwner = issue.user_id === userId;
                if (issue.is_anonymous) {
                    issue.user = {
                        user_id: null,
                        email_address: null,
                        username: "Anonymous",
                        fullname: "Anonymous",
                        image_url: null,
                        is_owner: false,
                        total_issues: null,
                        resolved_issues: null,
                        user_score: 0,
                        location_id: null,
                        location: null
                    };
                }
                return Object.assign(Object.assign({}, issue), { is_owner: isOwner });
            });
            return (0, response_1.APIData)({
                code: 200,
                success: true,
                data: issuesWithUserInfo,
            });
        });
    }
    getUserResolvedIssues(issue) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = issue.profile_user_id;
            if (!userId) {
                throw (0, response_1.APIError)({
                    code: 401,
                    success: false,
                    error: "Missing profile user ID",
                });
            }
            const resolvedIssues = yield this.issueRepository.getUserResolvedIssues(userId);
            const issuesWithUserInfo = resolvedIssues.map((issue) => {
                const isOwner = issue.user_id === userId;
                if (issue.is_anonymous) {
                    issue.user = {
                        user_id: null,
                        email_address: null,
                        username: "Anonymous",
                        fullname: "Anonymous",
                        image_url: null,
                        is_owner: false,
                        total_issues: null,
                        resolved_issues: null,
                        user_score: 0,
                        location_id: null,
                        location: null
                    };
                }
                return Object.assign(Object.assign({}, issue), { is_owner: isOwner });
            });
            return (0, response_1.APIData)({
                code: 200,
                success: true,
                data: issuesWithUserInfo,
            });
        });
    }
    hasUserIssuesInCluster(userId, clusterId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hasIssues = yield this.issueRepository.hasUserIssuesInCluster(userId, clusterId);
                return (0, response_1.APIData)({
                    code: 200,
                    success: true,
                    data: hasIssues,
                });
            }
            catch (error) {
                if (error instanceof response_1.APIError) {
                    throw error;
                }
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while checking user issues in the cluster.",
                });
            }
        });
    }
    getResolutionsForIssue(issueId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resolutions = yield this.resolutionService.getResolutionsByIssueId(issueId);
                return (0, response_1.APIData)({
                    code: 200,
                    success: true,
                    data: resolutions,
                });
            }
            catch (error) {
                if (error instanceof response_1.APIError) {
                    throw error;
                }
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while fetching resolutions for the issue.",
                });
            }
        });
    }
    getOrganizationResolutions(organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resolutions = yield this.resolutionService.getOrganizationResolutions(organizationId);
                return (0, response_1.APIData)({
                    code: 200,
                    success: true,
                    data: resolutions,
                });
            }
            catch (error) {
                if (error instanceof response_1.APIError) {
                    throw error;
                }
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while fetching resolutions for the organization.",
                });
            }
        });
    }
    getUserIssueInCluster(user_id, clusterId) {
        return __awaiter(this, void 0, void 0, function* () {
            const issue = yield this.issueRepository.getUserIssueInCluster(user_id, clusterId);
            return issue;
        });
    }
    getUserResolutions(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.resolutionService.getUserResolutions(userId);
        });
    }
    deleteResolution(resolutionId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.resolutionService.deleteResolution(resolutionId, userId);
        });
    }
    getRelatedIssues(issueId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const issue = yield this.issueRepository.getIssueById(issueId);
                if (!issue.cluster_id) {
                    return (0, response_1.APIData)({
                        code: 200,
                        success: true,
                        data: [],
                    });
                }
                const relatedIssues = yield this.issueRepository.getIssuesInCluster(issue.cluster_id);
                const processedIssues = yield Promise.all(relatedIssues
                    .filter(relatedIssue => relatedIssue.issue_id !== issueId)
                    .map((relatedIssue) => __awaiter(this, void 0, void 0, function* () {
                    // Use the existing getIssueById method to get full issue details
                    const fullIssue = yield this.issueRepository.getIssueById(relatedIssue.issue_id, userId);
                    // Add any additional properties not included in getIssueById
                    const processedIssue = Object.assign(Object.assign({}, fullIssue), { is_owner: fullIssue.user_id === userId });
                    return processedIssue;
                })));
                return (0, response_1.APIData)({
                    code: 200,
                    success: true,
                    data: processedIssues,
                });
            }
            catch (error) {
                console.error("Error in getRelatedIssues:", error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while fetching related issues.",
                });
            }
        });
    }
}
exports.default = IssueService;
