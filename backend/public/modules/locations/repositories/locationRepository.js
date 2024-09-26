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
exports.LocationRepository = void 0;
const supabaseClient_1 = __importDefault(require("@/modules/shared/services/supabaseClient"));
const response_1 = require("@/types/response");
class LocationRepository {
    getAllLocations() {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from("location")
                .select("*")
                .order("province", { ascending: true })
                .order("city", { ascending: true })
                .order("suburb", { ascending: true });
            if (error) {
                console.error("Error fetching locations:", error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while fetching locations.",
                });
            }
            const uniqueLocations = Array.from(new Set(data.map((loc) => JSON.stringify({
                province: loc.province,
                city: loc.city,
                suburb: loc.suburb,
            })))).map((strLoc) => {
                const parsedLoc = JSON.parse(strLoc);
                return data.find((loc) => loc.province === parsedLoc.province &&
                    loc.city === parsedLoc.city &&
                    loc.suburb === parsedLoc.suburb);
            });
            return uniqueLocations;
        });
    }
    getLocationByPlacesId(placesId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from("location")
                .select("*")
                .eq("place_id", placesId);
            if (error) {
                console.error(error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while fetching location.",
                });
            }
            return data;
        });
    }
    createLocation(location) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from("location")
                .insert(Object.assign(Object.assign({}, location), { latitude: location.latitude, longitude: location.longitude }))
                .select()
                .single();
            if (error) {
                console.error(error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred. Please try again later.",
                });
            }
            return data;
        });
    }
    getLocationById(locationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from("location")
                .select("*")
                .eq("location_id", locationId)
                .single();
            if (error) {
                console.error("Error fetching location by ID:", error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while fetching the location.",
                });
            }
            return data;
        });
    }
    getLocationIds(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = supabaseClient_1.default.from("location").select("location_id");
            if (filter.province) {
                query = query.eq("province", filter.province);
            }
            if (filter.city) {
                query = query.eq("city", filter.city);
            }
            if (filter.suburb) {
                query = query.eq("suburb", filter.suburb);
            }
            const { data, error } = yield query;
            if (error) {
                console.error("Error fetching location IDs:", error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while fetching location IDs.",
                });
            }
            return data.map(loc => loc.location_id);
        });
    }
}
exports.LocationRepository = LocationRepository;
