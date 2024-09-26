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
exports.searchOrganizations = exports.deleteJoinRequest = exports.leaveOrganization = exports.getUserOrganizations = exports.generateReport = exports.getOrganizationById = exports.getOrganizations = exports.removeMember = exports.handleJoinRequest = exports.getJoinRequests = exports.setJoinPolicy = exports.joinOrganization = exports.deleteOrganization = exports.updateOrganization = exports.createOrganization = void 0;
const organizationService_1 = require("../services/organizationService");
const response_1 = require("@/utilities/response");
const response_2 = require("@/types/response");
const multer_1 = __importDefault(require("multer"));
const cacheMiddleware_1 = require("@/middleware/cacheMiddleware");
const cacheUtils_1 = require("@/utilities/cacheUtils");
const organizationService = new organizationService_1.OrganizationService();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
const createOrganization = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body.user_id;
        if (!userId) {
            return (0, response_1.sendResponse)(res, (0, response_2.APIError)({
                code: 401,
                success: false,
                error: "Unauthorized: User ID is missing",
            }));
        }
        const response = yield organizationService.createOrganization(req.body, userId);
        (0, cacheUtils_1.clearCachePattern)('__express__/api/organizations*');
        (0, response_1.sendResponse)(res, response);
    }
    catch (err) {
        handleError(res, err);
    }
});
exports.createOrganization = createOrganization;
exports.updateOrganization = [
    upload.single("profilePhoto"),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.body.user_id;
            const organizationId = req.params.id;
            if (!userId) {
                return (0, response_1.sendResponse)(res, (0, response_2.APIError)({
                    code: 401,
                    success: false,
                    error: "Unauthorized: User ID is missing",
                }));
            }
            const response = yield organizationService.updateOrganization(organizationId, req.body, userId, req.file);
            (0, cacheUtils_1.clearCachePattern)(`__express__/api/organizations/${organizationId}`);
            (0, response_1.sendResponse)(res, response);
        }
        catch (err) {
            handleError(res, err);
        }
    })
];
const deleteOrganization = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body.user_id;
        const organizationId = req.params.id;
        if (!userId) {
            return (0, response_1.sendResponse)(res, (0, response_2.APIError)({
                code: 401,
                success: false,
                error: "Unauthorized: User ID is missing",
            }));
        }
        const response = yield organizationService.deleteOrganization(organizationId, userId);
        (0, cacheUtils_1.clearCachePattern)(`__express__/api/organizations/${organizationId}`);
        (0, response_1.sendResponse)(res, response);
    }
    catch (err) {
        handleError(res, err);
    }
});
exports.deleteOrganization = deleteOrganization;
const joinOrganization = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body.user_id;
        const organizationId = req.params.id;
        if (!userId) {
            return (0, response_1.sendResponse)(res, (0, response_2.APIError)({
                code: 401,
                success: false,
                error: "Unauthorized: User ID is missing",
            }));
        }
        const response = yield organizationService.joinOrganization(organizationId, userId);
        (0, cacheUtils_1.clearCachePattern)(`__express__/api/organizations/${organizationId}/join-requests`);
        (0, response_1.sendResponse)(res, response);
    }
    catch (err) {
        console.error("Error in joinOrganization controller:", err);
        handleError(res, err);
    }
});
exports.joinOrganization = joinOrganization;
const setJoinPolicy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body.user_id;
        const organizationId = req.params.id;
        const { joinPolicy } = req.body;
        if (!userId) {
            return (0, response_1.sendResponse)(res, (0, response_2.APIError)({
                code: 401,
                success: false,
                error: "Unauthorized: User ID is missing",
            }));
        }
        const response = yield organizationService.setJoinPolicy(organizationId, joinPolicy, userId);
        (0, cacheUtils_1.clearCachePattern)(`__express__/api/organizations/${organizationId}`);
        (0, response_1.sendResponse)(res, response);
    }
    catch (err) {
        handleError(res, err);
    }
});
exports.setJoinPolicy = setJoinPolicy;
exports.getJoinRequests = [
    (0, cacheMiddleware_1.cacheMiddleware)(300),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.body.user_id;
            const organizationId = req.params.id;
            const { offset, limit } = req.query;
            if (!userId) {
                return (0, response_1.sendResponse)(res, (0, response_2.APIError)({
                    code: 401,
                    success: false,
                    error: "Unauthorized: User ID is missing",
                }));
            }
            const paginationParams = {
                offset: Number(offset) || 0,
                limit: Number(limit) || 10
            };
            const response = yield organizationService.getJoinRequests(organizationId, userId, paginationParams);
            (0, response_1.sendResponse)(res, response);
        }
        catch (err) {
            handleError(res, err);
        }
    })
];
const handleJoinRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body.user_id;
        const organizationId = req.params.id;
        const requestId = parseInt(req.params.requestId, 10);
        const { accept } = req.body;
        if (!userId) {
            return (0, response_1.sendResponse)(res, (0, response_2.APIError)({
                code: 401,
                success: false,
                error: "Unauthorized: User ID is missing",
            }));
        }
        if (isNaN(requestId)) {
            return (0, response_1.sendResponse)(res, (0, response_2.APIError)({
                code: 400,
                success: false,
                error: "Invalid request ID",
            }));
        }
        if (typeof accept !== 'boolean') {
            return (0, response_1.sendResponse)(res, (0, response_2.APIError)({
                code: 400,
                success: false,
                error: "Accept must be a boolean value",
            }));
        }
        const response = yield organizationService.handleJoinRequest(organizationId, requestId, accept, userId);
        (0, cacheUtils_1.clearCachePattern)(`__express__/api/organizations/${organizationId}/join-requests`);
        (0, response_1.sendResponse)(res, response);
    }
    catch (err) {
        handleError(res, err);
    }
});
exports.handleJoinRequest = handleJoinRequest;
const removeMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminId = req.body.user_id;
        const organizationId = req.params.id;
        const memberUserId = req.params.userId;
        if (!adminId) {
            return (0, response_1.sendResponse)(res, (0, response_2.APIError)({
                code: 401,
                success: false,
                error: "Unauthorized: User ID is missing",
            }));
        }
        const response = yield organizationService.removeMember(organizationId, memberUserId, adminId);
        (0, cacheUtils_1.clearCachePattern)(`__express__/api/organizations/${organizationId}`);
        (0, response_1.sendResponse)(res, response);
    }
    catch (err) {
        handleError(res, err);
    }
});
exports.removeMember = removeMember;
exports.getOrganizations = [
    (0, cacheMiddleware_1.cacheMiddleware)(300),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { offset, limit } = req.query;
            const paginationParams = {
                offset: Number(offset) || 0,
                limit: Number(limit) || 10
            };
            const response = yield organizationService.getOrganizations(paginationParams);
            (0, response_1.sendResponse)(res, response);
        }
        catch (err) {
            handleError(res, err);
        }
    })
];
exports.getOrganizationById = [
    (0, cacheMiddleware_1.cacheMiddleware)(300),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const organizationId = req.params.id;
            const response = yield organizationService.getOrganizationById(organizationId);
            (0, response_1.sendResponse)(res, response);
        }
        catch (err) {
            handleError(res, err);
        }
    })
];
const generateReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body.user_id;
        const organizationId = req.params.id;
        if (!userId) {
            return (0, response_1.sendResponse)(res, (0, response_2.APIError)({
                code: 401,
                success: false,
                error: "Unauthorized: User ID is missing",
            }));
        }
        const response = yield organizationService.generateReport(organizationId, userId);
        (0, response_1.sendResponse)(res, response);
    }
    catch (err) {
        handleError(res, err);
    }
});
exports.generateReport = generateReport;
exports.getUserOrganizations = [
    (0, cacheMiddleware_1.cacheMiddleware)(300),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.body.user_id;
            if (!userId) {
                return (0, response_1.sendResponse)(res, (0, response_2.APIError)({
                    code: 401,
                    success: false,
                    error: "Unauthorized: User ID is missing",
                }));
            }
            const response = yield organizationService.getUserOrganizations(userId);
            (0, response_1.sendResponse)(res, response);
        }
        catch (err) {
            handleError(res, err);
        }
    })
];
const leaveOrganization = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body.user_id;
        const organizationId = req.params.id;
        if (!userId) {
            return (0, response_1.sendResponse)(res, (0, response_2.APIError)({
                code: 401,
                success: false,
                error: "Unauthorized: User ID is missing",
            }));
        }
        const response = yield organizationService.leaveOrganization(organizationId, userId);
        (0, cacheUtils_1.clearCachePattern)(`__express__/api/organizations/${organizationId}`);
        (0, response_1.sendResponse)(res, response);
    }
    catch (err) {
        handleError(res, err);
    }
});
exports.leaveOrganization = leaveOrganization;
const deleteJoinRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body.user_id;
        const requestId = Number(req.params.requestId);
        if (!userId) {
            return (0, response_1.sendResponse)(res, (0, response_2.APIError)({
                code: 401,
                success: false,
                error: "Unauthorized: User ID is missing",
            }));
        }
        const response = yield organizationService.deleteJoinRequest(requestId, userId);
        (0, cacheUtils_1.clearCachePattern)(`__express__/api/organizations/*/join-requests`);
        (0, response_1.sendResponse)(res, response);
    }
    catch (err) {
        handleError(res, err);
    }
});
exports.deleteJoinRequest = deleteJoinRequest;
const handleError = (res, err) => {
    console.error("Handling error:", err);
    if (err instanceof Error) {
        (0, response_1.sendResponse)(res, (0, response_2.APIData)({
            code: 500,
            success: false,
            error: err.message || "An unexpected error occurred",
        }));
    }
    else {
        (0, response_1.sendResponse)(res, (0, response_2.APIData)({
            code: 500,
            success: false,
            error: "An unexpected error occurred",
        }));
    }
};
exports.searchOrganizations = [
    (0, cacheMiddleware_1.cacheMiddleware)(300),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { searchTerm, offset, limit } = req.query;
            if (typeof searchTerm !== 'string') {
                return (0, response_1.sendResponse)(res, (0, response_2.APIError)({
                    code: 400,
                    success: false,
                    error: "Search term is required and must be a string",
                }));
            }
            const paginationParams = {
                offset: Number(offset) || 0,
                limit: Number(limit) || 10
            };
            const response = yield organizationService.searchOrganizations(searchTerm, paginationParams);
            (0, response_1.sendResponse)(res, response);
        }
        catch (err) {
            handleError(res, err);
        }
    })
];
