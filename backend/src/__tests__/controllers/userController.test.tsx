import request from 'supertest';
import express from 'express';
import * as userController from '../../controllers/userController';
import { UserService } from '../../services/userService';
import { sendResponse } from '../../utils/response';
import multer from 'multer';

jest.mock('../../services/userService');
jest.mock('../../utils/response');
jest.mock('../../middleware/middleware', () => ({
  verifyAndGetUser: jest.fn((req, res, next) => next()),
}));

jest.mock('multer', () => {
  return {
    __esModule: true,
    default: () => ({
      single: () => (req: express.Request, res: express.Response, next: express.NextFunction) => {
        next();
      },
    }),
  };
});

const app = express();
const upload = multer();
app.use(express.json());

app.get('/users/:id', userController.getUserById);
app.put('/users/:id', upload.single('profile_picture'), userController.updateUserProfile);

describe('User Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it('should get user by ID', async () => {
    const mockResponse = { code: 200, success: true, data: {} };
    (UserService.prototype.getUserById as jest.Mock).mockResolvedValue(mockResponse as never);

    const response = await request(app).get('/users/1').send({ user_id: '123' });

    expect(response.status).toBe(200);
    expect(UserService.prototype.getUserById).toHaveBeenCalled();
    expect(sendResponse).toHaveBeenCalledWith(expect.anything(), mockResponse as never);
  });

  it('should update user profile', async () => {
    const mockResponse = { code: 200, success: true, data: {} };
    (UserService.prototype.updateUserProfile as jest.Mock).mockResolvedValue(mockResponse as never);

    const response = await request(app)
      .put('/users/1')
      .field('key', 'value')
      .attach('profile_picture', Buffer.from(''), 'profile_picture.png');

    expect(response.status).toBe(200);
    expect(UserService.prototype.updateUserProfile).toHaveBeenCalled();
    expect(sendResponse).toHaveBeenCalledWith(expect.anything(), mockResponse as never);
  });
});
