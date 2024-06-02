"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const issueController_1 = __importDefault(
  require("../controllers/issueController"),
);
const router = (0, express_1.Router)();
router.get("/", issueController_1.default.getAllIssues);
router.get("/:id", issueController_1.default.getIssueById);
router.post("/", issueController_1.default.createIssue);
router.put("/:id", issueController_1.default.updateIssue);
router.delete("/:id", issueController_1.default.deleteIssue);
exports.default = router;
