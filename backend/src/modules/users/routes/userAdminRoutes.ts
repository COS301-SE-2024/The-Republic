import { Router } from "express";
import userAdminController, {
  deleteAccountById,
} from "@/modules/users/controllers/userAdminController";
import { verifyAndGetUser } from "@/middleware/middleware";

const router = Router();

router.post("/username/exists", userAdminController.usernameExists);

router.delete("/delete/:id", verifyAndGetUser, deleteAccountById);

export default router;
