import { Request, Response } from 'express';
import * as reportsController from '../../controllers/reportsController';
import ReportsService from '../../services/reportsService';
import { sendResponse } from '../../utils/response';

jest.mock('../../services/reportsService');
jest.mock('../../utils/response');

describe('Reports Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockReportsService: jest.Mocked<ReportsService>;

  beforeEach(() => {
    mockRequest = { body: {} };
    mockResponse = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    mockReportsService = new ReportsService() as jest.Mocked<ReportsService>;
    (ReportsService as jest.Mock).mockImplementation(() => mockReportsService);
  });

  const testControllerMethod = async (methodName: keyof typeof reportsController) => {
    const controllerMethod = reportsController[methodName] as (req: Request, res: Response) => Promise<void>;
    await controllerMethod(mockRequest as Request, mockResponse as Response);
    expect(sendResponse).toHaveBeenCalled();
  };

  it('should handle getAllIssuesGroupedByResolutionStatus', () => testControllerMethod('getAllIssuesGroupedByResolutionStatus'));
  it('should handle getIssueCountsGroupedByResolutionStatus', () => testControllerMethod('getIssueCountsGroupedByResolutionStatus'));
  it('should handle getIssueCountsGroupedByResolutionAndCategory', () => testControllerMethod('getIssueCountsGroupedByResolutionAndCategory'));
  it('should handle getIssuesGroupedByCreatedAt', () => testControllerMethod('getIssuesGroupedByCreatedAt'));
  it('should handle getIssuesGroupedByCategory', () => testControllerMethod('getIssuesGroupedByCategory'));
  it('should handle getIssuesCountGroupedByCategoryAndCreatedAt', () => testControllerMethod('getIssuesCountGroupedByCategoryAndCreatedAt'));

  it('should handle errors', async () => {
    mockReportsService.getAllIssuesGroupedByResolutionStatus.mockRejectedValue(new Error('Test error'));
    await reportsController.getAllIssuesGroupedByResolutionStatus(mockRequest as Request, mockResponse as Response);
    expect(sendResponse).toHaveBeenCalled();
  });
});