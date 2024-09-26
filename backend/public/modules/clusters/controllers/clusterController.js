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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClusterController = void 0;
const clusterService_1 = require("../services/clusterService");
const response_1 = require("@/utilities/response");
const response_2 = require("@/types/response");
const cacheMiddleware_1 = require("@/middleware/cacheMiddleware");
const cacheUtils_1 = require("@/utilities/cacheUtils");
class ClusterController {
    constructor() {
        this.getClusters = [
            (0, cacheMiddleware_1.cacheMiddleware)(300),
            (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { categoryId, suburb, fromDate, toDate } = req.query;
                    if (!categoryId || !suburb) {
                        throw (0, response_2.APIError)({
                            code: 400,
                            success: false,
                            error: "Category ID and Suburb are required",
                        });
                    }
                    const clusters = yield this.clusterService.getClusters({
                        categoryId: Number(categoryId),
                        suburb: String(suburb),
                        fromDate: fromDate ? new Date(fromDate) : undefined,
                        toDate: toDate ? new Date(toDate) : undefined,
                    });
                    const response = {
                        code: 200,
                        success: true,
                        data: clusters,
                    };
                    (0, response_1.sendResponse)(res, response);
                }
                catch (err) {
                    (0, response_1.sendResponse)(res, err);
                }
            })
        ];
        this.getClusterById = [
            (0, cacheMiddleware_1.cacheMiddleware)(300),
            (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { id } = req.params;
                    if (!id) {
                        throw (0, response_2.APIError)({
                            code: 400,
                            success: false,
                            error: "Cluster ID is required",
                        });
                    }
                    const cluster = yield this.clusterService.getClusterById(id);
                    const response = {
                        code: 200,
                        success: true,
                        data: cluster,
                    };
                    (0, response_1.sendResponse)(res, response);
                }
                catch (err) {
                    (0, response_1.sendResponse)(res, err);
                }
            })
        ];
        this.assignCluster = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { issueId } = req.body;
                if (!issueId) {
                    throw (0, response_2.APIError)({
                        code: 400,
                        success: false,
                        error: "Issue ID is required",
                    });
                }
                const clusterId = yield this.clusterService.assignClusterToIssue(issueId);
                (0, cacheUtils_1.clearCachePattern)('__express__/api/clusters*');
                const response = {
                    code: 200,
                    success: true,
                    data: { clusterId },
                };
                (0, response_1.sendResponse)(res, response);
            }
            catch (err) {
                (0, response_1.sendResponse)(res, err);
            }
        });
        this.clusterService = new clusterService_1.ClusterService();
    }
}
exports.ClusterController = ClusterController;
