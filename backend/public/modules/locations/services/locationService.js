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
exports.LocationService = void 0;
const locationRepository_1 = require("@/modules/locations/repositories/locationRepository");
const response_1 = require("@/types/response");
class LocationService {
    constructor() {
        this.locationRepository = new locationRepository_1.LocationRepository();
    }
    getAllLocations() {
        return __awaiter(this, void 0, void 0, function* () {
            const locations = yield this.locationRepository.getAllLocations();
            return (0, response_1.APIData)({
                code: 200,
                success: true,
                data: locations,
            });
        });
    }
    getLocationById(locationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const location = yield this.locationRepository.getLocationById(locationId);
            if (!location) {
                throw (0, response_1.APIError)({
                    code: 404,
                    success: false,
                    error: "Location not found",
                });
            }
            return (0, response_1.APIData)({
                code: 200,
                success: true,
                data: location,
            });
        });
    }
    getLocationIds(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.locationRepository.getLocationIds(filter);
        });
    }
}
exports.LocationService = LocationService;
