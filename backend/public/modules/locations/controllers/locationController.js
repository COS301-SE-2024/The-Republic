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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocationById = exports.getAllLocations = void 0;
const locationService_1 = require("@/modules/locations/services/locationService");
const response_1 = require("@/utilities/response");
const cacheMiddleware_1 = require("@/middleware/cacheMiddleware");
const locationService = new locationService_1.LocationService();
exports.getAllLocations = [
    (0, cacheMiddleware_1.cacheMiddleware)(300),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield locationService.getAllLocations();
            (0, response_1.sendResponse)(res, response);
        }
        catch (err) {
            (0, response_1.sendResponse)(res, err);
        }
    })
];
exports.getLocationById = [
    (0, cacheMiddleware_1.cacheMiddleware)(300),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const locationId = parseInt(req.params.id);
            const response = yield locationService.getLocationById(locationId);
            (0, response_1.sendResponse)(res, response);
        }
        catch (err) {
            (0, response_1.sendResponse)(res, err);
        }
    })
];
