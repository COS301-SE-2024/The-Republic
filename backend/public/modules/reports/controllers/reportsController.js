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
exports.groupedByPoliticalAssociation = exports.getIssuesCountGroupedByCategoryAndCreatedAt = exports.getIssuesGroupedByCategory = exports.getIssuesGroupedByCreatedAt = exports.getIssueCountsGroupedByResolutionAndCategory = exports.getIssueCountsGroupedByResolutionStatus = exports.getAllIssuesGroupedByResolutionStatus = void 0;
const response_1 = require("@/utilities/response");
const reportsService_1 = __importDefault(require("@/modules/reports/services/reportsService"));
const cacheMiddleware_1 = require("@/middleware/cacheMiddleware");
const reportsService = new reportsService_1.default();
exports.getAllIssuesGroupedByResolutionStatus = [
    (0, cacheMiddleware_1.cacheMiddleware)(300),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield reportsService.getAllIssuesGroupedByResolutionStatus(req.body);
            (0, response_1.sendResponse)(res, response);
        }
        catch (error) {
            (0, response_1.sendResponse)(res, error);
        }
    })
];
exports.getIssueCountsGroupedByResolutionStatus = [
    (0, cacheMiddleware_1.cacheMiddleware)(300),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield reportsService.getIssueCountsGroupedByResolutionStatus(req.body);
            (0, response_1.sendResponse)(res, response);
        }
        catch (error) {
            (0, response_1.sendResponse)(res, error);
        }
    })
];
exports.getIssueCountsGroupedByResolutionAndCategory = [
    (0, cacheMiddleware_1.cacheMiddleware)(300),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield reportsService.getIssueCountsGroupedByResolutionAndCategory(req.body);
            (0, response_1.sendResponse)(res, response);
        }
        catch (error) {
            (0, response_1.sendResponse)(res, error);
        }
    })
];
exports.getIssuesGroupedByCreatedAt = [
    (0, cacheMiddleware_1.cacheMiddleware)(300),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield reportsService.getIssuesGroupedByCreatedAt(req.body);
            (0, response_1.sendResponse)(res, response);
        }
        catch (error) {
            (0, response_1.sendResponse)(res, error);
        }
    })
];
exports.getIssuesGroupedByCategory = [
    (0, cacheMiddleware_1.cacheMiddleware)(300),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield reportsService.getIssuesGroupedByCategory(req.body);
            (0, response_1.sendResponse)(res, response);
        }
        catch (error) {
            (0, response_1.sendResponse)(res, error);
        }
    })
];
exports.getIssuesCountGroupedByCategoryAndCreatedAt = [
    (0, cacheMiddleware_1.cacheMiddleware)(300),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield reportsService.getIssuesCountGroupedByCategoryAndCreatedAt(req.body);
            (0, response_1.sendResponse)(res, response);
        }
        catch (error) {
            (0, response_1.sendResponse)(res, error);
        }
    })
];
exports.groupedByPoliticalAssociation = [
    (0, cacheMiddleware_1.cacheMiddleware)(300),
    (_, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield reportsService.groupedByPoliticalAssociation();
            (0, response_1.sendResponse)(res, response);
        }
        catch (error) {
            (0, response_1.sendResponse)(res, error);
        }
    })
];
