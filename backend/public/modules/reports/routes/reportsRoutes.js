"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reportsController = __importStar(require("@/modules/reports/controllers/reportsController"));
const middleware_1 = require("@/middleware/middleware");
const router = (0, express_1.Router)();
router.use(middleware_1.verifyAndGetUser);
router.post("/groupedResolutionStatus", reportsController.getAllIssuesGroupedByResolutionStatus);
router.post("/countResolutionStatus", reportsController.getIssueCountsGroupedByResolutionStatus);
router.post("/groupedResolutionAndCategory", reportsController.getIssueCountsGroupedByResolutionAndCategory);
router.post("/groupedCreatedAt", reportsController.getIssuesGroupedByCreatedAt);
router.post("/groupedCategory", reportsController.getIssuesGroupedByCategory);
router.post("/groupedCategoryAndCreatedAt", reportsController.getIssuesCountGroupedByCategoryAndCreatedAt);
router.post("/groupedPoliticalAssociation", reportsController.groupedByPoliticalAssociation);
exports.default = router;
