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
const issueService_1 = require("../src/services/issueService");
const issueRepository_1 = require("../src/db/issueRepository");
jest.mock('../src/db/issueRepository');
describe('IssueService', () => {
    let issueService;
    let issueRepository;
    beforeEach(() => {
        issueRepository = new issueRepository_1.IssueRepository();
        issueService = new issueService_1.IssueService();
        issueService.issueRepository = issueRepository;
    });
    it('should get all issues', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockIssues = [
            { issue_id: 1, user_id: '1', department_id: 1, location_id: null, category_id: 1, content: 'Test Issue', resolved_at: null, is_anonymous: false, created_at: '2024-06-01', sentiment: 'angry' },
        ];
        issueRepository.getAllIssues.mockResolvedValue(mockIssues);
        const issues = yield issueService.getAllIssues();
        expect(issues).toEqual(mockIssues);
        expect(issueRepository.getAllIssues).toHaveBeenCalledTimes(1);
    }));
    it('should get an issue by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockIssue = { issue_id: 1, user_id: '1', department_id: 1, location_id: null, category_id: 1, content: 'Test Issue', resolved_at: null, is_anonymous: false, created_at: '2022-01-01', sentiment: 'neutral' };
        issueRepository.getIssueById.mockResolvedValue(mockIssue);
        const issue = yield issueService.getIssueById(1);
        expect(issue).toEqual(mockIssue);
        expect(issueRepository.getIssueById).toHaveBeenCalledWith(1);
        expect(issueRepository.getIssueById).toHaveBeenCalledTimes(1);
    }));
    describe('createIssue', () => {
        it('should create a new issue when all required fields are provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const newIssue = { user_id: '1', department_id: 1, location_id: null, category_id: 1, content: 'New Issue', resolved_at: null, is_anonymous: false, sentiment: 'neutral' };
            const createdIssue = Object.assign(Object.assign({}, newIssue), { issue_id: 1, created_at: '2022-01-01' });
            issueRepository.createIssue.mockResolvedValue(createdIssue);
            const issue = yield issueService.createIssue(newIssue);
            expect(issue).toEqual(createdIssue);
            expect(issueRepository.createIssue).toHaveBeenCalledWith(newIssue);
            expect(issueRepository.createIssue).toHaveBeenCalledTimes(1);
        }));
        it('should throw an error when required fields are missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const newIssue = { user_id: '1', content: 'New Issue' };
            yield expect(issueService.createIssue(newIssue)).rejects.toThrowError('Missing required fields for creating an issue');
            expect(issueRepository.createIssue).not.toHaveBeenCalled();
        }));
        it('should throw an error when content exceeds the maximum length', () => __awaiter(void 0, void 0, void 0, function* () {
            const newIssue = { user_id: '1', department_id: 1, location_id: null, category_id: 1, content: 'A'.repeat(501), resolved_at: null, is_anonymous: false, sentiment: 'neutral' };
            yield expect(issueService.createIssue(newIssue)).rejects.toThrowError('Issue content exceeds the maximum length of 500 characters');
            expect(issueRepository.createIssue).not.toHaveBeenCalled();
        }));
    });
    it('should update an existing issue', () => __awaiter(void 0, void 0, void 0, function* () {
        const updateData = { content: 'Updated Issue' };
        const updatedIssue = { issue_id: 1, user_id: '1', department_id: 1, location_id: null, category_id: 1, content: 'Updated Issue', resolved_at: null, is_anonymous: false, created_at: '2022-01-01', sentiment: 'neutral' };
        issueRepository.updateIssue.mockResolvedValue(updatedIssue);
        const issue = yield issueService.updateIssue(1, updateData);
        expect(issue).toEqual(updatedIssue);
        expect(issueRepository.updateIssue).toHaveBeenCalledWith(1, updateData);
        expect(issueRepository.updateIssue).toHaveBeenCalledTimes(1);
    }));
    it('should delete an issue', () => __awaiter(void 0, void 0, void 0, function* () {
        issueRepository.deleteIssue.mockResolvedValue();
        yield issueService.deleteIssue(1);
        expect(issueRepository.deleteIssue).toHaveBeenCalledWith(1);
        expect(issueRepository.deleteIssue).toHaveBeenCalledTimes(1);
    }));
});
