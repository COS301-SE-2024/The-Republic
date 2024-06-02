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
const supabaseClient_1 = __importDefault(require("../services/supabaseClient"));
class IssueRepository {
    getAllIssues() {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default.from('issue').select('*');
            if (error)
                throw new Error(error.message);
            return data;
        });
    }
    getIssueById(issueId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default.from('issue').select('*').eq('issue_id', issueId).single();
            if (error)
                throw new Error(error.message);
            return data;
        });
    }
    createIssue(issue) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default.from('issue').insert([issue]).single();
            if (error)
                throw new Error(error.message);
            return data;
        });
    }
    updateIssue(issueId, issue) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default.from('issue').update(issue).eq('issue_id', issueId).single();
            if (error)
                throw new Error(error.message);
            return data;
        });
    }
    deleteIssue(issueId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error } = yield supabaseClient_1.default.from('issue').delete().eq('issue_id', issueId);
            if (error)
                throw new Error(error.message);
        });
    }
}
exports.default = IssueRepository;
