"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAndGetUser = exports.serverMiddleare = void 0;
const supabaseClient_1 = __importDefault(require("@/modules/shared/services/supabaseClient"));
const response_1 = require("@/utilities/response");
const response_2 = require("@/types/response");
const serverMiddleare = (req, res, next) => {
    next();
};
exports.serverMiddleare = serverMiddleare;
const verifyAndGetUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    const serviceRoleKey = req.headers["x-service-role-key"];
    if (serviceRoleKey === process.env.SUPABASE_SERVICE_ROLE_KEY) {
        next();
        return;
    }
    req.body.user_id = undefined;
    if (authHeader === undefined) {
        next();
        return;
    }
    const jwt = authHeader.split(" ")[1];
    try {
        const { data: { user }, error, } = yield supabaseClient_1.default.auth.getUser(jwt);
        if (error) {
            (0, response_1.sendResponse)(res, (0, response_2.APIError)({
                code: 403,
                success: false,
                error: "Invalid token",
            }));
            return;
        }
        if (user) {
            req.body.user_id = user.id;
            next();
        }
        else {
            (0, response_1.sendResponse)(res, (0, response_2.APIError)({
                code: 403,
                success: false,
                error: "Invalid token",
            }));
        }
    }
    catch (error) {
        console.error(error);
        (0, response_1.sendResponse)(res, (0, response_2.APIError)({
            code: 500,
            success: false,
            error: "An unexpected error occurred. Please try again later.",
        }));
    }
});
exports.verifyAndGetUser = verifyAndGetUser;
