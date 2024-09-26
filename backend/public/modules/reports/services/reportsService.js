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
const reportsRepository_1 = __importDefault(require("@/modules/reports/repositories/reportsRepository"));
const response_1 = require("@/types/response");
class ReportsService {
    constructor() {
        this.ReportsRepository = new reportsRepository_1.default();
    }
    setReportsRepository(ReportsRepository) {
        this.ReportsRepository = ReportsRepository;
    }
    getAllIssuesGroupedByResolutionStatus(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.ReportsRepository.getAllIssuesGroupedByResolutionStatus(params);
                return { code: 200, success: true, data };
            }
            catch (error) {
                console.error("Error: ", error);
                throw (0, response_1.APIError)({
                    code: 404,
                    success: false,
                    error: "GroupedByResolutionStatus: Something Went wrong",
                });
            }
        });
    }
    getIssueCountsGroupedByResolutionStatus(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.ReportsRepository.getIssueCountsGroupedByResolutionStatus(params);
                return { code: 200, success: true, data };
            }
            catch (error) {
                console.error("Error: ", error);
                throw (0, response_1.APIError)({
                    code: 404,
                    success: false,
                    error: "CountsGroupedByResolutionStatus: Something Went wrong",
                });
            }
        });
    }
    getIssueCountsGroupedByResolutionAndCategory(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.ReportsRepository.getIssueCountsGroupedByResolutionAndCategory(params);
                return { code: 200, success: true, data };
            }
            catch (error) {
                console.error("Error: ", error);
                throw (0, response_1.APIError)({
                    code: 404,
                    success: false,
                    error: "CountsGroupedByResolutionAndCategory: Something Went wrong",
                });
            }
        });
    }
    getIssuesGroupedByCreatedAt(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.ReportsRepository.getIssuesGroupedByCreatedAt(params);
                return { code: 200, success: true, data };
            }
            catch (error) {
                console.error("Error: ", error);
                throw (0, response_1.APIError)({
                    code: 404,
                    success: false,
                    error: "GroupedByCreatedAt: Something Went wrong",
                });
            }
        });
    }
    getIssuesGroupedByCategory(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.ReportsRepository.getIssuesGroupedByCategory(params);
                return { code: 200, success: true, data };
            }
            catch (error) {
                console.error("Error: ", error);
                throw (0, response_1.APIError)({
                    code: 404,
                    success: false,
                    error: "GroupedByCategory: Something Went wrong",
                });
            }
        });
    }
    getIssuesCountGroupedByCategoryAndCreatedAt(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.ReportsRepository.getIssuesCountGroupedByCategoryAndCreatedAt(params);
                return { code: 200, success: true, data };
            }
            catch (error) {
                console.error("Error: ", error);
                throw (0, response_1.APIError)({
                    code: 404,
                    success: false,
                    error: "CountGroupedByCategoryAndCreatedAt: Something Went wrong",
                });
            }
        });
    }
    groupedByPoliticalAssociation() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.ReportsRepository.groupedByPoliticalAssociation();
            return (0, response_1.APIData)({
                code: 200,
                success: true,
                data
            });
        });
    }
}
exports.default = ReportsService;
