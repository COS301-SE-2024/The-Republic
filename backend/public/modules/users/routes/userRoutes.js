"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const userController_1 = require("@/modules/users/controllers/userController");
const middleware_1 = require("@/middleware/middleware");
const router = express_1.default.Router();
const upload = (0, multer_1.default)();
router.post("/:id", middleware_1.verifyAndGetUser, userController_1.getUserById);
router.put("/:id", middleware_1.verifyAndGetUser, upload.single("profile_picture"), userController_1.updateUserProfile);
router.put("/:id/username", middleware_1.verifyAndGetUser, userController_1.updateUsername);
router.put("/:id/password", middleware_1.verifyAndGetUser, userController_1.changePassword);
exports.default = router;
