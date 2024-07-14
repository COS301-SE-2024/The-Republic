import request from 'supertest';
import express from 'express';
import * as issueController from '../../controllers/issueController';
import IssueService from '../../services/issueService';
import { sendResponse } from '../../utils/response';

jest.mock('../../services/issueService');
jest.mock('../../utils/response');
jest.mock('../../middleware/middleware', () => ({
  verifyAndGetUser: jest.fn((req, res, next) => next()),
}));

jest.mock('multer', () => {
  const originalModule = jest.requireActual('multer');
  return {
    __esModule: true,
    default: () => ({
      single: () => (req: express.Request, res: express.Response, next: express.NextFunction) => {
        next();
      },
    }),
    memoryStorage: jest.fn(() => ({})), 
  };
});

const app = express();
app.use(express.json());

app.post('/issues', issueController.getIssues);
app.post('/issues/single', issueController.getIssueById);
app.post('/issues/create', issueController.createIssue[0], issueController.createIssue[1]);
app.put('/issues', issueController.updateIssue);
app.delete('/issues', issueController.deleteIssue);
app.put('/issues/resolve', issueController.resolveIssue);
app.post('/issues/user', issueController.getUserIssues);
app.post('/issues/user/resolved', issueController.getUserResolvedIssues);

describe('Issue Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it('should get issues', async () => {
    const mockResponse = { code: 200, success: true, data: [] };
    (IssueService.prototype.getIssues as jest.Mock).mockResolvedValue(mockResponse as never);

    const response = await request(app).post('/issues').send({});

    expect(response.status).toBe(200);
    expect(IssueService.prototype.getIssues).toHaveBeenCalled();
    expect(sendResponse).toHaveBeenCalledWith(expect.anything(), mockResponse);
  });

  it('should get issue by ID', async () => {
    const mockResponse = { code: 200, success: true, data: {} };
    (IssueService.prototype.getIssueById as jest.Mock).mockResolvedValue(mockResponse as never);

    const response = await request(app).post('/issues/single').send({});

    expect(response.status).toBe(200);
    expect(IssueService.prototype.getIssueById).toHaveBeenCalled();
    expect(sendResponse).toHaveBeenCalledWith(expect.anything(), mockResponse);
  });

  it('should create an issue', async () => {
    const mockResponse = { code: 201, success: true, data: {} };
    (IssueService.prototype.createIssue as jest.Mock).mockResolvedValue(mockResponse as never);

    const response = await request(app).post('/issues/create').send({});

    expect(response.status).toBe(201);
    expect(IssueService.prototype.createIssue).toHaveBeenCalled();
    expect(sendResponse).toHaveBeenCalledWith(expect.anything(), mockResponse as never);
  });

  it('should update an issue', async () => {
    const mockResponse = { code: 200, success: true, data: {} };
    (IssueService.prototype.updateIssue as jest.Mock).mockResolvedValue(mockResponse as never);

    const response = await request(app).put('/issues').send({});

    expect(response.status).toBe(200);
    expect(IssueService.prototype.updateIssue).toHaveBeenCalled();
    expect(sendResponse).toHaveBeenCalledWith(expect.anything(), mockResponse as never);
  });

  it('should delete an issue', async () => {
    const mockResponse = { code: 200, success: true, data: {} };
    (IssueService.prototype.deleteIssue as jest.Mock).mockResolvedValue(mockResponse as never);

    const response = await request(app).delete('/issues').send({});

    expect(response.status).toBe(200);
    expect(IssueService.prototype.deleteIssue).toHaveBeenCalled();
    expect(sendResponse).toHaveBeenCalledWith(expect.anything(), mockResponse as never);
  });

  it('should resolve an issue', async () => {
    const mockResponse = { code: 200, success: true, data: {} };
    (IssueService.prototype.resolveIssue as jest.Mock).mockResolvedValue(mockResponse as never);

    const response = await request(app).put('/issues/resolve').send({});

    expect(response.status).toBe(200);
    expect(IssueService.prototype.resolveIssue).toHaveBeenCalled();
    expect(sendResponse).toHaveBeenCalledWith(expect.anything(), mockResponse as never);
  });

  it('should get user issues', async () => {
    const mockResponse = { code: 200, success: true, data: [] };
    (IssueService.prototype.getUserIssues as jest.Mock).mockResolvedValue(mockResponse as never);

    const response = await request(app).post('/issues/user').send({});

    expect(response.status).toBe(200);
    expect(IssueService.prototype.getUserIssues).toHaveBeenCalled();
    expect(sendResponse).toHaveBeenCalledWith(expect.anything(), mockResponse as never);
  });

  it('should get user resolved issues', async () => {
    const mockResponse = { code: 200, success: true, data: [] };
    (IssueService.prototype.getUserResolvedIssues as jest.Mock).mockResolvedValue(mockResponse as never);

    const response = await request(app).post('/issues/user/resolved').send({});

    expect(response.status).toBe(200);
    expect(IssueService.prototype.getUserResolvedIssues).toHaveBeenCalled();
    expect(sendResponse).toHaveBeenCalledWith(expect.anything(), mockResponse as never);
  });
});
