import { Request, Response } from 'express';
import { LocationService } from '../../services/locationService';
import { sendResponse } from '../../utils/response';
import { APIResponse } from '../../types/response';
import { getAllLocations } from '../../controllers/locationController';

jest.mock('../../services/locationService');
jest.mock('../../utils/response');

describe('Location Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockLocationService: jest.Mocked<LocationService>;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
    };
    mockLocationService = {
      getAllLocations: jest.fn(),
    } as unknown as jest.Mocked<LocationService>;
    (LocationService as jest.MockedClass<typeof LocationService>).mockImplementation(() => mockLocationService);
  });

  describe('getAllLocations', () => {
    it('should call sendResponse', async () => {
      const mockAPIResponse: APIResponse<any[]> = { success: true, code: 200, data: [] };
      mockLocationService.getAllLocations.mockResolvedValue(mockAPIResponse);

      await getAllLocations(mockRequest as Request, mockResponse as Response);

      expect(sendResponse).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const mockError = new Error('Test error');
      mockLocationService.getAllLocations.mockRejectedValue(mockError);

      await getAllLocations(mockRequest as Request, mockResponse as Response);

      expect(sendResponse).toHaveBeenCalled();
    });
  });
});