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
const issueController = __importStar(require("@/modules/issues/controllers/issueController"));
const middleware_1 = require("@/middleware/middleware");
const router = (0, express_1.Router)();
router.use(middleware_1.verifyAndGetUser);
router.post("/", issueController.getIssues);
router.post("/single", issueController.getIssueById);
router.post("/create", issueController.createIssue);
router.put("/", issueController.updateIssue);
router.delete("/", issueController.deleteIssue);
router.post("/user", issueController.getUserIssues);
router.post("/user/resolved", issueController.getUserResolvedIssues);
router.post("/self-resolution", issueController.createSelfResolution);
router.post("/external-resolution", issueController.createExternalResolution);
router.post("/respond-resolution", issueController.respondToResolution);
router.post("/user-resolutions", issueController.getUserResolutions);
router.post("/delete-resolution", issueController.deleteResolution);
router.post("/organization-resolutions", issueController.getOrganizationResolutions);
exports.default = router;
