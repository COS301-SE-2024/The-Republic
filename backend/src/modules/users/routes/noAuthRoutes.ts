import { Router } from "express";
import noAuthController from "@/modules/users/controllers/noAuthController";

const router = Router();

router.post(
  "/username/exists",
  noAuthController.usernameExists
);

export default router;
