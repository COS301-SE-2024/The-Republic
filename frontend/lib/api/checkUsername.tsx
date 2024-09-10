import { Request, Response } from "express";
import { UserService } from "../../../backend/src/modules/users/services/userService";

const userService = new UserService();

export const checkUsername = async (req: Request, res: Response) => {
  if (req.method === 'GET') {
    const { username } = req.query;

    if (typeof username !== 'string') {
      return res.status(400).json({
        code: 400,
        success: false,
        error: 'Username must be a string'
      });
    }

    try {
      const response = await userService.checkUsernameAvailability(username);
      res.status(response.code).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        code: 500,
        success: false,
        error: 'An unexpected error occurred'
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
};

export default checkUsername;
