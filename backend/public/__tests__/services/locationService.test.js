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
const locationService_1 = require("@/modules/locations/services/locationService");
const locationRepository_1 = require("@/modules/locations/repositories/locationRepository");
const response_1 = require("@/types/response");
jest.mock("@/modules/locations/repositories/locationRepository");
describe("LocationService", () => {
    let locationService;
    let locationRepositoryMock;
    beforeEach(() => {
        locationRepositoryMock = new locationRepository_1.LocationRepository();
        locationService = new locationService_1.LocationService();
        locationService["locationRepository"] = locationRepositoryMock;
    });
    it("should return all locations with a 200 status code", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockLocations = [{ id: 1, name: "Location 1" }, { id: 2, name: "Location 2" }];
        locationRepositoryMock.getAllLocations.mockResolvedValue(mockLocations);
        const result = yield locationService.getAllLocations();
        expect(result).toEqual((0, response_1.APIData)({
            code: 200,
            success: true,
            data: mockLocations,
        }));
        expect(locationRepositoryMock.getAllLocations).toHaveBeenCalled();
    }));
    it("should handle empty locations array", () => __awaiter(void 0, void 0, void 0, function* () {
        locationRepositoryMock.getAllLocations.mockResolvedValue([]);
        const result = yield locationService.getAllLocations();
        expect(result).toEqual((0, response_1.APIData)({
            code: 200,
            success: true,
            data: [],
        }));
        expect(locationRepositoryMock.getAllLocations).toHaveBeenCalled();
    }));
});
