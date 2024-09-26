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
const subscriptionsRepository_1 = __importDefault(require("@/modules/subscriptions/repositories/subscriptionsRepository"));
const response_1 = require("@/types/response");
class SubscriptionsService {
    constructor() {
        this.SubscriptionsRepository = new subscriptionsRepository_1.default();
    }
    setSubscriptionsRepository(SubscriptionsRepository) {
        this.SubscriptionsRepository = SubscriptionsRepository;
    }
    issueSubscriptions(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.SubscriptionsRepository.issueSubscriptions(params);
                return { code: 200, success: true, data };
            }
            catch (error) {
                console.error("Error: ", error);
                throw (0, response_1.APIError)({
                    code: 404,
                    success: false,
                    error: "Issue: Something Went wrong",
                });
            }
        });
    }
    categorySubscriptions(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.SubscriptionsRepository.categorySubscriptions(params);
                return { code: 200, success: true, data };
            }
            catch (error) {
                console.error("Error: ", error);
                throw (0, response_1.APIError)({
                    code: 404,
                    success: false,
                    error: "Category: Something Went wrong",
                });
            }
        });
    }
    locationSubscriptions(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.SubscriptionsRepository.locationSubscriptions(params);
                return { code: 200, success: true, data };
            }
            catch (error) {
                console.error("Error: ", error);
                throw (0, response_1.APIError)({
                    code: 404,
                    success: false,
                    error: "Location: Something Went wrong",
                });
            }
        });
    }
    getSubscriptions(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.SubscriptionsRepository.getSubscriptions(params);
                return { code: 200, success: true, data };
            }
            catch (error) {
                console.error("Error: ", error);
                throw (0, response_1.APIError)({
                    code: 404,
                    success: false,
                    error: "Notifications: Something Went wrong",
                });
            }
        });
    }
    getNotifications(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.SubscriptionsRepository.getNotifications(params);
                return { code: 200, success: true, data };
            }
            catch (error) {
                console.error("Error: ", error);
                throw (0, response_1.APIError)({
                    code: 404,
                    success: false,
                    error: "Notifications: Something Went wrong",
                });
            }
        });
    }
}
exports.default = SubscriptionsService;
