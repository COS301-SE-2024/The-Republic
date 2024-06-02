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
exports.deleteIssue = exports.updateIssue = exports.createIssue = exports.getIssueById = exports.getAllIssues = void 0;
const issueService_1 = __importDefault(require("../services/issueService"));
const issueService = new issueService_1.default();
const handleError = (res, error) => {
    if (error instanceof Error) {
        res.status(500).json({ error: error.message });
    }
    else {
        res.status(500).json({ error: "An unknown error occurred" });
    }
};
const getAllIssues = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const issues = yield issueService.getAllIssues();
        res.status(200).json(issues);
    }
    catch (error) {
        handleError(res, error);
    }
});
exports.getAllIssues = getAllIssues;
const getIssueById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const issueId = parseInt(req.params.id, 10);
        const issue = yield issueService.getIssueById(issueId);
        if (issue) {
            res.status(200).json(issue);
        }
        else {
            res.status(404).json({ message: "Issue not found" });
        }
    }
    catch (error) {
        handleError(res, error);
    }
});
exports.getIssueById = getIssueById;
const createIssue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const issue = yield issueService.createIssue(req.body);
        res.status(201).json(issue);
    }
    catch (error) {
        handleError(res, error);
    }
});
exports.createIssue = createIssue;
const updateIssue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const issueId = parseInt(req.params.id, 10);
        const issue = yield issueService.updateIssue(issueId, req.body);
        res.status(200).json(issue);
    }
    catch (error) {
        handleError(res, error);
    }
});
exports.updateIssue = updateIssue;
const deleteIssue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const issueId = parseInt(req.params.id, 10);
        yield issueService.deleteIssue(issueId);
        res.status(204).send();
    }
    catch (error) {
        handleError(res, error);
    }
});
exports.deleteIssue = deleteIssue;
exports.default = {
    getAllIssues: exports.getAllIssues,
    getIssueById: exports.getIssueById,
    createIssue: exports.createIssue,
    updateIssue: exports.updateIssue,
    deleteIssue: exports.deleteIssue,
};
