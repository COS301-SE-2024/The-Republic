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
exports.getRelatedIssues = exports.deleteResolution = exports.getUserResolutions = exports.getUserIssueInCluster = exports.hasUserIssuesInCluster = exports.getResolutionsForIssue = exports.respondToResolution = exports.createExternalResolution = exports.createSelfResolution = exports.getUserResolvedIssues = exports.getUserIssues = exports.resolveIssue = exports.deleteIssue = exports.updateIssue = exports.createIssue = exports.getIssueById = exports.getIssues = void 0;
const issueService_1 = __importDefault(require("@/modules/issues/services/issueService"));
const response_1 = require("@/types/response");
const response_2 = require("@/utilities/response");
const multer_1 = __importDefault(require("multer"));
const cacheMiddleware_1 = require("@/middleware/cacheMiddleware");
const cacheUtils_1 = require("@/utilities/cacheUtils");
const issueService = new issueService_1.default();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
const handleError = (res, err) => {
    console.error(err);
    if (err instanceof Error) {
        (0, response_2.sendResponse)(res, (0, response_1.APIError)({
            code: 500,
            success: false,
            error: err.message || "An unexpected error occurred",
        }));
    }
    else {
        (0, response_2.sendResponse)(res, err);
    }
};
exports.getIssues = [
    (0, cacheMiddleware_1.cacheMiddleware)(300),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield issueService.getIssues(req.body);
            (0, response_2.sendResponse)(res, response);
        }
        catch (err) {
            handleError(res, err);
        }
    })
];
exports.getIssueById = [
    (0, cacheMiddleware_1.cacheMiddleware)(300),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield issueService.getIssueById(req.body);
            (0, response_2.sendResponse)(res, response);
        }
        catch (err) {
            handleError(res, err);
        }
    })
];
exports.createIssue = [
    upload.single("image"),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const file = req.file;
            const response = yield issueService.createIssue(req.body, file);
            (0, cacheUtils_1.clearCachePattern)('__express__/api/issues*');
            (0, response_2.sendResponse)(res, response);
        }
        catch (err) {
            handleError(res, err);
        }
    }),
];
const updateIssue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield issueService.updateIssue(req.body);
        (0, cacheUtils_1.clearCache)('/api/issues/single', { issueId: req.body.issueId });
        (0, cacheUtils_1.clearCachePattern)('__express__/api/issues*');
        (0, response_2.sendResponse)(res, response);
    }
    catch (err) {
        handleError(res, err);
    }
});
exports.updateIssue = updateIssue;
const deleteIssue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield issueService.deleteIssue(req.body);
        (0, cacheUtils_1.clearCachePattern)('__express__/api/issues*');
        (0, response_2.sendResponse)(res, response);
    }
    catch (err) {
        handleError(res, err);
    }
});
exports.deleteIssue = deleteIssue;
const resolveIssue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { issueId, userId } = req.body;
        const response = yield issueService.createSelfResolution(issueId, userId, "Issue resolved by owner");
        (0, cacheUtils_1.clearCachePattern)('__express__/api/issues*');
        (0, response_2.sendResponse)(res, response);
    }
    catch (err) {
        handleError(res, err);
    }
});
exports.resolveIssue = resolveIssue;
exports.getUserIssues = [
    (0, cacheMiddleware_1.cacheMiddleware)(300),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield issueService.getUserIssues(req.body);
            (0, response_2.sendResponse)(res, response);
        }
        catch (err) {
            handleError(res, err);
        }
    })
];
exports.getUserResolvedIssues = [
    (0, cacheMiddleware_1.cacheMiddleware)(300),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield issueService.getUserResolvedIssues(req.body);
            (0, response_2.sendResponse)(res, response);
        }
        catch (err) {
            handleError(res, err);
        }
    })
];
exports.createSelfResolution = [
    upload.single("proofImage"),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { issueId, userId, resolutionText } = req.body;
            const response = yield issueService.createSelfResolution(parseInt(issueId), userId, resolutionText, req.file);
            (0, cacheUtils_1.clearCachePattern)('__express__/api/issues*');
            (0, response_2.sendResponse)(res, response);
        }
        catch (err) {
            handleError(res, err);
        }
    }),
];
exports.createExternalResolution = [
    upload.single("proofImage"),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { issueId, userId, resolutionText, politicalAssociation, stateEntityAssociation, resolvedBy } = req.body;
            const response = yield issueService.createExternalResolution(parseInt(issueId), userId, resolutionText, req.file, politicalAssociation, stateEntityAssociation, resolvedBy);
            (0, cacheUtils_1.clearCachePattern)('__express__/api/issues*');
            (0, response_2.sendResponse)(res, response);
        }
        catch (err) {
            handleError(res, err);
        }
    }),
];
const respondToResolution = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { resolutionId, userId, accept } = req.body;
        const response = yield issueService.respondToResolution(resolutionId, userId, accept);
        (0, cacheUtils_1.clearCachePattern)('__express__/api/issues*');
        (0, response_2.sendResponse)(res, response);
    }
    catch (err) {
        handleError(res, err);
    }
});
exports.respondToResolution = respondToResolution;
exports.getResolutionsForIssue = [
    (0, cacheMiddleware_1.cacheMiddleware)(300),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { issueId } = req.body;
            const response = yield issueService.getResolutionsForIssue(parseInt(issueId));
            (0, response_2.sendResponse)(res, response);
        }
        catch (err) {
            handleError(res, err);
        }
    })
];
exports.hasUserIssuesInCluster = [
    (0, cacheMiddleware_1.cacheMiddleware)(300),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userId, clusterId } = req.body;
            const response = yield issueService.hasUserIssuesInCluster(userId, clusterId);
            (0, response_2.sendResponse)(res, response);
        }
        catch (err) {
            handleError(res, err);
        }
    })
];
exports.getUserIssueInCluster = [
    (0, cacheMiddleware_1.cacheMiddleware)(300),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { clusterId, user_id } = req.body;
            if (!user_id) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            const issue = yield issueService.getUserIssueInCluster(user_id, clusterId);
            if (issue) {
                return res.json({ issue });
            }
            else {
                return res.status(404).json({ error: "User issue not found in the cluster" });
            }
        }
        catch (error) {
            console.error("Error fetching user's issue in cluster:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    })
];
exports.getUserResolutions = [
    (0, cacheMiddleware_1.cacheMiddleware)(300),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userId } = req.body;
            const resolutions = yield issueService.getUserResolutions(userId);
            (0, response_2.sendResponse)(res, (0, response_1.APIData)({
                code: 200,
                success: true,
                data: resolutions,
            }));
        }
        catch (err) {
            handleError(res, err);
        }
    })
];
const deleteResolution = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { resolutionId, userId } = req.body;
        yield issueService.deleteResolution(resolutionId, userId);
        (0, cacheUtils_1.clearCachePattern)('__express__/api/issues*');
        (0, response_2.sendResponse)(res, (0, response_1.APIData)({
            code: 200,
            success: true
        }));
    }
    catch (err) {
        handleError(res, err);
    }
});
exports.deleteResolution = deleteResolution;
exports.getRelatedIssues = [
    (0, cacheMiddleware_1.cacheMiddleware)(300),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const { issueId } = req.body;
            const userId = (_a = req.body) === null || _a === void 0 ? void 0 : _a.user_id;
            if (!userId) {
                return (0, response_2.sendResponse)(res, (0, response_1.APIError)({
                    code: 401,
                    success: false,
                    error: "Unauthorized",
                }));
            }
            const response = yield issueService.getRelatedIssues(parseInt(issueId), userId);
            (0, response_2.sendResponse)(res, response);
        }
        catch (err) {
            handleError(res, err);
        }
    })
];
