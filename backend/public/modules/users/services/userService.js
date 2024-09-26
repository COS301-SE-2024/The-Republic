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
exports.UserService = void 0;
const userRepository_1 = __importDefault(require("../repositories/userRepository"));
const response_1 = require("../../../types/response");
const supabaseClient_1 = __importDefault(require("../../shared/services/supabaseClient"));
class UserService {
    constructor() {
        this.userRepository = new userRepository_1.default();
    }
    setUserRepository(userRepository) {
        this.userRepository = userRepository;
    }
    getUserById(userId, authenticatedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.getUserById(userId);
            if (!user) {
                throw (0, response_1.APIError)({
                    code: 404,
                    success: false,
                    error: "User not found",
                });
            }
            const isOwner = userId === authenticatedUserId;
            return {
                code: 200,
                success: true,
                data: Object.assign(Object.assign({}, user), { is_owner: isOwner }),
            };
        });
    }
    updateUserProfile(userId, updateData, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.getUserById(userId);
            if (!user) {
                throw (0, response_1.APIError)({
                    code: 404,
                    success: false,
                    error: "User not found",
                });
            }
            if (file) {
                // Delete the old profile picture if it exists and is not the default one
                if (user.image_url && !user.image_url.includes("default.png")) {
                    try {
                        const fileName = user.image_url.split("/").pop();
                        if (!fileName) {
                            throw new Error("Invalid image URL format");
                        }
                        const { error: deleteError } = yield supabaseClient_1.default.storage
                            .from("user")
                            .remove([fileName]);
                        if (deleteError) {
                            console.error("Failed to delete old profile picture:", deleteError);
                            throw (0, response_1.APIError)({
                                code: 500,
                                success: false,
                                error: "Failed to delete old profile picture",
                            });
                        }
                    }
                    catch (error) {
                        console.error("Error deleting old profile picture:", error);
                        throw (0, response_1.APIError)({
                            code: 500,
                            success: false,
                            error: "Failed to delete old profile picture",
                        });
                    }
                }
                // Upload the new profile picture
                const fileName = `profile_pictures/${userId}-${Date.now()}-${file.originalname}`;
                const { error: uploadError } = yield supabaseClient_1.default.storage
                    .from("user")
                    .upload(fileName, file.buffer);
                if (uploadError) {
                    throw (0, response_1.APIError)({
                        code: 500,
                        success: false,
                        error: "Failed to upload new profile picture",
                    });
                }
                // Retrieve the public URL for the new profile picture
                const { data: urlData } = supabaseClient_1.default.storage
                    .from("user")
                    .getPublicUrl(fileName);
                updateData.image_url = urlData.publicUrl;
            }
            if (updateData.location) {
                const locationData = JSON.parse(updateData.location);
                const { data: locationRecord, error: locationError } = yield supabaseClient_1.default
                    .from('location')
                    .upsert({
                    province: locationData.value.province,
                    city: locationData.value.city,
                    suburb: locationData.value.suburb,
                    district: locationData.value.district,
                    place_id: locationData.value.place_id,
                    latitude: locationData.value.lat,
                    longitude: locationData.value.lng,
                })
                    .select()
                    .single();
                if (locationError) {
                    throw (0, response_1.APIError)({
                        code: 500,
                        success: false,
                        error: "Failed to update location",
                    });
                }
                updateData.location_id = locationRecord.location_id;
                delete updateData.location; // Remove the location object from updateData
            }
            const updatedUser = yield this.userRepository.updateUserProfile(userId, updateData);
            if (!updatedUser) {
                throw (0, response_1.APIError)({
                    code: 404,
                    success: false,
                    error: "User does not exist",
                });
            }
            return {
                code: 200,
                success: true,
                data: updatedUser,
            };
        });
    }
    updateUserLocation(userId, locationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedUser = yield this.userRepository.updateUserLocation(userId, locationId);
            if (!updatedUser) {
                throw (0, response_1.APIError)({
                    code: 404,
                    success: false,
                    error: "User not found",
                });
            }
            return {
                code: 200,
                success: true,
                data: updatedUser,
            };
        });
    }
    getUserWithLocation(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.getUserWithLocation(userId);
            if (!user) {
                throw (0, response_1.APIError)({
                    code: 404,
                    success: false,
                    error: "User not found",
                });
            }
            return {
                code: 200,
                success: true,
                data: user,
            };
        });
    }
    updateUsername(userId, newUsername) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedUser = yield this.userRepository.updateUsername(userId, newUsername);
            if (!updatedUser) {
                throw (0, response_1.APIError)({
                    code: 404,
                    success: false,
                    error: "User not found",
                });
            }
            return {
                code: 200,
                success: true,
                data: updatedUser,
            };
        });
    }
    checkUsernameAvailability(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isUsernameTaken = yield this.userRepository.isUsernameTaken(username);
                return {
                    code: 200,
                    success: true,
                    data: !isUsernameTaken
                };
            }
            catch (error) {
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while checking username availability.",
                });
            }
        });
    }
    changePassword(userId, currentPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data: userData, error: userError } = yield supabaseClient_1.default
                    .from('user')
                    .select('email_address')
                    .eq('user_id', userId)
                    .single();
                if (userError) {
                    console.error("Error fetching user data:", userError);
                    throw (0, response_1.APIError)({
                        code: 404,
                        success: false,
                        error: "User not found",
                    });
                }
                if (!userData) {
                    console.error("User data is null for userId:", userId);
                    throw (0, response_1.APIError)({
                        code: 404,
                        success: false,
                        error: "User not found",
                    });
                }
                // Verify the current password
                const { error: signInError } = yield supabaseClient_1.default.auth.signInWithPassword({
                    email: userData.email_address,
                    password: currentPassword,
                });
                if (signInError) {
                    console.error("Sign-in error:", signInError);
                    throw (0, response_1.APIError)({
                        code: 401,
                        success: false,
                        error: "Current password is incorrect",
                    });
                }
                // If sign-in was successful, update the password
                const { error: updateError } = yield supabaseClient_1.default.auth.updateUser({
                    password: newPassword,
                });
                if (updateError) {
                    console.error("Password update error:", updateError);
                    throw (0, response_1.APIError)({
                        code: 500,
                        success: false,
                        error: "Failed to update password",
                    });
                }
                return {
                    code: 200,
                    success: true,
                    data: undefined,
                };
            }
            catch (error) {
                console.error("Caught error in changePassword:", error);
                if (error instanceof response_1.APIError) {
                    throw error;
                }
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred",
                });
            }
        });
    }
}
exports.UserService = UserService;
