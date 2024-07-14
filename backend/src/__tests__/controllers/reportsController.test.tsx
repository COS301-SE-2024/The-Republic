import request from 'supertest';
import express from 'express';
import * as reportsController from '../../controllers/reportsController';
import ReportsService from '../../services/reportsService';
import { sendResponse } from '../../utils/response';
import { APIResponse } from '../../types/response';

jest.mock('../../controllers/reportsController');
jest.mock('../../services/reportsService');
jest.mock('../../utils/response');
jest.mock('../../middleware/middleware', () => ({
  verifyAndGetUser: jest.fn((req, res, next) => next()),
}));

const app = express();
app.use(express.json());

app.post('/groupedResolutionStatus', reportsController.getAllIssuesGroupedByResolutionStatus);
app.post('/countResolutionStatus', reportsController.getIssueCountsGroupedByResolutionStatus);
app.post('/groupedResolutionAndCategory', reportsController.getIssueCountsGroupedByResolutionAndCategory);
app.post('/groupedCreatedAt', reportsController.getIssuesGroupedByCreatedAt);
app.post('/groupedCategory', reportsController.getIssuesGroupedByCategory);
app.post('/groupedCategoryAndCreatedAt', reportsController.getIssuesCountGroupedByCategoryAndCreatedAt);

describe('Reports Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it('should get all issues grouped by resolution status', async () => {
    const mockResponse: APIResponse = { code: 200, success: true, data: [] };
    (ReportsService.prototype.getAllIssuesGroupedByResolutionStatus as jest.Mock).mockResolvedValue(mockResponse as never);

    const response = await request(app).post('/groupedResolutionStatus').send({});

    expect(response.status).toBe(200);
    expect(ReportsService.prototype.getAllIssuesGroupedByResolutionStatus).toHaveBeenCalled();
    expect(sendResponse).toHaveBeenCalledWith(expect.anything(), mockResponse as never);
  });

  it('should get issue counts grouped by resolution status', async () => {
    const mockResponse: APIResponse = { code: 200, success: true, data: [] };
    (ReportsService.prototype.getIssueCountsGroupedByResolutionStatus as jest.Mock).mockResolvedValue(mockResponse as never);

    const response = await request(app).post('/countResolutionStatus').send({});

    expect(response.status).toBe(200);
    expect(ReportsService.prototype.getIssueCountsGroupedByResolutionStatus).toHaveBeenCalled();
    expect(sendResponse).toHaveBeenCalledWith(expect.anything(), mockResponse as never);
  });

  it('should get issue counts grouped by resolution and category', async () => {
    const mockResponse: APIResponse = { code: 200, success: true, data: [] };
    (ReportsService.prototype.getIssueCountsGroupedByResolutionAndCategory as jest.Mock).mockResolvedValue(mockResponse as never);

    const response = await request(app).post('/groupedResolutionAndCategory').send({});

    expect(response.status).toBe(200);
    expect(ReportsService.prototype.getIssueCountsGroupedByResolutionAndCategory).toHaveBeenCalled();
    expect(sendResponse).toHaveBeenCalledWith(expect.anything(), mockResponse as never);
  });

  it('should get issues grouped by created at', async () => {
    const mockResponse: APIResponse = { code: 200, success: true, data: [] };
    (ReportsService.prototype.getIssuesGroupedByCreatedAt as jest.Mock).mockResolvedValue(mockResponse as never);

    const response = await request(app).post('/groupedCreatedAt').send({});

    expect(response.status).toBe(200);
    expect(ReportsService.prototype.getIssuesGroupedByCreatedAt).toHaveBeenCalled();
    expect(sendResponse).toHaveBeenCalledWith(expect.anything(), mockResponse as never);
  });

  it('should get issues grouped by category', async () => {
    const mockResponse: APIResponse = { code: 200, success: true, data: [] };
    (ReportsService.prototype.getIssuesGroupedByCategory as jest.Mock).mockResolvedValue(mockResponse as never);

    const response = await request(app).post('/groupedCategory').send({});

    expect(response.status).toBe(200);
    expect(ReportsService.prototype.getIssuesGroupedByCategory).toHaveBeenCalled();
    expect(sendResponse).toHaveBeenCalledWith(expect.anything(), mockResponse as never);
  });

  it('should get issues count grouped by category and created at', async () => {
    const mockResponse: APIResponse = { code: 200, success: true, data: [] };
    (ReportsService.prototype.getIssuesCountGroupedByCategoryAndCreatedAt as jest.Mock).mockResolvedValue(mockResponse as never);

    const response = await request(app).post('/groupedCategoryAndCreatedAt').send({});

    expect(response.status).toBe(200);
    expect(ReportsService.prototype.getIssuesCountGroupedByCategoryAndCreatedAt).toHaveBeenCalled();
    expect(sendResponse).toHaveBeenCalledWith(expect.anything(), mockResponse as never);
  });
});
