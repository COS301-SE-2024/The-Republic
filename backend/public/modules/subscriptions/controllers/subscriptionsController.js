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
exports.getNotifications = exports.getSubscriptions = exports.locationSubscriptions = exports.categorySubscriptions = exports.issueSubscriptions = void 0;
const response_1 = require("@/utilities/response");
const subscriptionsService_1 = __importDefault(require("@/modules/subscriptions/services/subscriptionsService"));
const subscriptionsService = new subscriptionsService_1.default();
const issueSubscriptions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield subscriptionsService.issueSubscriptions(req.body);
        (0, response_1.sendResponse)(res, response);
    }
    catch (error) {
        (0, response_1.sendResponse)(res, error);
    }
});
exports.issueSubscriptions = issueSubscriptions;
const categorySubscriptions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield subscriptionsService.categorySubscriptions(req.body);
        (0, response_1.sendResponse)(res, response);
    }
    catch (error) {
        (0, response_1.sendResponse)(res, error);
    }
});
exports.categorySubscriptions = categorySubscriptions;
const locationSubscriptions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield subscriptionsService.locationSubscriptions(req.body);
        (0, response_1.sendResponse)(res, response);
    }
    catch (error) {
        (0, response_1.sendResponse)(res, error);
    }
});
exports.locationSubscriptions = locationSubscriptions;
const getSubscriptions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield subscriptionsService.getSubscriptions(req.body);
        (0, response_1.sendResponse)(res, response);
    }
    catch (error) {
        (0, response_1.sendResponse)(res, error);
    }
});
exports.getSubscriptions = getSubscriptions;
const getNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield subscriptionsService.getNotifications(req.body);
        (0, response_1.sendResponse)(res, response);
    }
    catch (error) {
        (0, response_1.sendResponse)(res, error);
    }
});
exports.getNotifications = getNotifications;
