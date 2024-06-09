import { Request, Response } from "express";
import UserRepository from "../db/userRepository";

const userRepository = new UserRepository();

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await userRepository.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
