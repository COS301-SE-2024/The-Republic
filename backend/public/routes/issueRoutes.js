"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const issueController_1 = __importDefault(require("../controllers/issueController"));
const router = (0, express_1.Router)();
router.get("/issues", issueController_1.default.getAllIssues);
router.get("/issues/:id", issueController_1.default.getIssueById);
router.post("/issues", issueController_1.default.createIssue);
router.put("/issues/:id", issueController_1.default.updateIssue);
router.delete("/issues/:id", issueController_1.default.deleteIssue);
exports.default = router;
