import request from 'supertest';
import express from 'express';
import reactionController from '../../controllers/reactionController';

jest.mock('../../middleware/middleware', () => ({
  verifyAndGetUser: jest.fn((req, res, next) => next()),
}));

const app = express();
app.use(express.json());
app.post('/', reactionController.addOrRemoveReaction);

describe('Reaction Controller', () => {
  it('should theow error since we are not signed in', async () => {
    const expectedResponse = {
      code: 401,
      success: false,
      error: "You need to be signed in to react"
    };

    const response = await request(app)
      .post('/')
      .send({});

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual(expectedResponse);
  });
});