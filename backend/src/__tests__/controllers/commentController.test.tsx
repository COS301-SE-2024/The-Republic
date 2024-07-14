import request from 'supertest';
import express from 'express';
import * as commentController from '../../controllers/commentController';
import { CommentService } from '../../services/commentService';
import { sendResponse } from '../../utils/response';

jest.mock('../../services/commentService');
jest.mock('../../utils/response');
jest.mock('../../middleware/middleware', () => ({
  verifyAndGetUser: jest.fn((req, res, next) => next()),
}));

const app = express();
app.use(express.json());

app.post('/comments', commentController.getComments);
app.post('/comments/count', commentController.getNumComments);
app.post('/comments/add', commentController.addComment);
app.delete('/comments/delete', commentController.deleteComment);

describe('Comment Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it('should get comments', async () => {
    const mockResponse = { code: 200, success: true, data: [] };
    (CommentService.prototype.getComments as jest.Mock).mockResolvedValue(mockResponse as never);

    const response = await request(app).post('/comments').send({});

    expect(response.status).toBe(200);
    expect(CommentService.prototype.getComments).toHaveBeenCalled();
    expect(sendResponse).toHaveBeenCalledWith(expect.anything(), mockResponse as never);
  });

  it('should get number of comments', async () => {
    const mockResponse = { code: 200, success: true, data: 10 };
    (CommentService.prototype.getNumComments as jest.Mock).mockResolvedValue(mockResponse as never);

    const response = await request(app).post('/comments/count').send({});

    expect(response.status).toBe(200);
    expect(CommentService.prototype.getNumComments).toHaveBeenCalled();
    expect(sendResponse).toHaveBeenCalledWith(expect.anything(), mockResponse as never);
  });

  it('should add a comment', async () => {
    const mockResponse = { code: 201, success: true, data: {} };
    (CommentService.prototype.addComment as jest.Mock).mockResolvedValue(mockResponse as never);

    const response = await request(app).post('/comments/add').send({});

    expect(response.status).toBe(201);
    expect(CommentService.prototype.addComment).toHaveBeenCalled();
    expect(sendResponse).toHaveBeenCalledWith(expect.anything(), mockResponse as never);
  });

  it('should delete a comment', async () => {
    const mockResponse = { code: 200, success: true, data: {} };
    (CommentService.prototype.deleteComment as jest.Mock).mockResolvedValue(mockResponse as never);

    const response = await request(app).delete('/comments/delete').send({});

    expect(response.status).toBe(200);
    expect(CommentService.prototype.deleteComment).toHaveBeenCalled();
    expect(sendResponse).toHaveBeenCalledWith(expect.anything(), mockResponse as never);
  });
});
