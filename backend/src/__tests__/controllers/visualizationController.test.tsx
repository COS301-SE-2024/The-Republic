import request from 'supertest';
import express from 'express';
import * as visualizationController from '../../controllers/visualizationController';
import { VisualizationService } from '../../services/visualizationService';
import { sendResponse } from '../../utils/response';
import { APIResponse } from '../../types/response';

jest.mock('../../services/visualizationService');
jest.mock('../../utils/response');
jest.mock('../../middleware/middleware', () => ({
  verifyAndGetUser: jest.fn((req, res, next) => next()),
}));

const app = express();
app.use(express.json());

app.post('/visualization', visualizationController.getVizData);

describe('Visualization Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it('should get visualization data', async () => {
    const mockResponse: APIResponse = { code: 200, success: true, data: [] };
    (VisualizationService.prototype.getVizData as jest.Mock).mockResolvedValue(mockResponse as never);

    const response = await request(app).post('/visualization').send({});

    expect(response.status).toBe(200);
    expect(VisualizationService.prototype.getVizData).toHaveBeenCalled();
    expect(sendResponse).toHaveBeenCalledWith(expect.anything(), mockResponse);
  });
});
