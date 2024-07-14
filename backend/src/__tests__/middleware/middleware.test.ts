import request from 'supertest';
import express from 'express';
import supabase from '../../services/supabaseClient';
import { serverMiddleare, verifyAndGetUser } from '../../middleware/middleware';

jest.mock('../../services/supabaseClient');
jest.mock('../../utils/response');

const app = express();
app.use(express.json());
app.use(serverMiddleare);

app.get('/test', verifyAndGetUser, (req, res) => {
  res.status(200).json({ message: 'success' });
});

describe('Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it('should call next() if no authorization header', async () => {
    const response = await request(app).get('/test');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('success');
    expect(supabase.auth.getUser).not.toHaveBeenCalled();
  });

  it('should call next() if token is valid', async () => {
    const mockData = { user: { id: '123' } };
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({ data: mockData, error: null });

    const response = await request(app)
      .get('/test')
      .set('Authorization', 'Bearer validtoken');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('success');
    expect(supabase.auth.getUser).toHaveBeenCalledWith('validtoken');
  });
});
