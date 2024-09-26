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
const userService_1 = require("@/modules/users/services/userService");
const userRepository_1 = __importDefault(require("@/modules/users/repositories/userRepository"));
const supabaseClient_1 = __importDefault(require("@/modules/shared/services/supabaseClient"));
const mockUser_1 = __importDefault(require("@/data/mockUser"));
const mockFile_1 = __importDefault(require("@/data/mockFile"));
jest.mock("@/modules/users/repositories/userRepository");
jest.mock("@/modules/shared/services/supabaseClient", () => ({
    storage: {
        from: jest.fn(() => ({
            upload: jest.fn(),
            getPublicUrl: jest.fn(),
            remove: jest.fn(),
        })),
    },
}));
describe("UserService", () => {
    let userService;
    let userRepository;
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, "error").mockImplementation(() => { });
        userRepository = new userRepository_1.default();
        userService = new userService_1.UserService();
        userService.setUserRepository(userRepository);
    });
    afterEach(() => {
        console.error.mockRestore();
    });
    describe("getUserById", () => {
        it("should return a user by ID", () => __awaiter(void 0, void 0, void 0, function* () {
            const userId = "1";
            const authenticatedUserId = "1";
            userRepository.getUserById.mockResolvedValue(mockUser_1.default);
            const response = yield userService.getUserById(userId, authenticatedUserId);
            expect(response.data).toEqual(Object.assign(Object.assign({}, mockUser_1.default), { is_owner: true }));
            expect(userRepository.getUserById).toHaveBeenCalledWith(userId);
            expect(userRepository.getUserById).toHaveBeenCalledTimes(1);
        }));
        it("should throw an error when user is not found", () => __awaiter(void 0, void 0, void 0, function* () {
            const userId = "1";
            const authenticatedUserId = "1";
            userRepository.getUserById.mockResolvedValue(null);
            yield expect(userService.getUserById(userId, authenticatedUserId)).rejects.toEqual(expect.objectContaining({
                code: 404,
                success: false,
                error: "User not found",
            }));
            expect(userRepository.getUserById).toHaveBeenCalledWith(userId);
            expect(userRepository.getUserById).toHaveBeenCalledTimes(1);
        }));
        it("should set is_owner to false when authenticated user is different", () => __awaiter(void 0, void 0, void 0, function* () {
            const userId = "1";
            const authenticatedUserId = "2";
            userRepository.getUserById.mockResolvedValue(mockUser_1.default);
            const response = yield userService.getUserById(userId, authenticatedUserId);
            expect(response.data).toEqual(Object.assign(Object.assign({}, mockUser_1.default), { is_owner: false }));
            expect(userRepository.getUserById).toHaveBeenCalledWith(userId);
            expect(userRepository.getUserById).toHaveBeenCalledTimes(1);
        }));
    });
    describe("updateUserProfile", () => {
        const updateData = { fullname: "Updated User" };
        it("should update user profile without file", () => __awaiter(void 0, void 0, void 0, function* () {
            userRepository.getUserById.mockResolvedValue(mockUser_1.default);
            userRepository.updateUserProfile.mockResolvedValue(Object.assign(Object.assign({}, mockUser_1.default), updateData));
            const response = yield userService.updateUserProfile(mockUser_1.default.user_id || "", updateData);
            expect(response.data).toEqual(Object.assign(Object.assign({}, mockUser_1.default), updateData));
            expect(userRepository.getUserById).toHaveBeenCalledWith(mockUser_1.default.user_id);
            expect(userRepository.updateUserProfile).toHaveBeenCalledWith(mockUser_1.default.user_id, updateData);
        }));
        it("should throw an error when user is not found", () => __awaiter(void 0, void 0, void 0, function* () {
            userRepository.getUserById.mockResolvedValue(null);
            yield expect(userService.updateUserProfile(mockUser_1.default.user_id || "", updateData)).rejects.toEqual(expect.objectContaining({
                code: 404,
                success: false,
                error: "User not found",
            }));
            expect(userRepository.getUserById).toHaveBeenCalledWith(mockUser_1.default.user_id);
        }));
        it("should throw an error when file upload fails", () => __awaiter(void 0, void 0, void 0, function* () {
            userRepository.getUserById.mockResolvedValue(mockUser_1.default);
            supabaseClient_1.default.storage.from("user").upload.mockResolvedValue({
                error: new Error("Upload failed"),
            });
            yield expect(userService.updateUserProfile(mockUser_1.default.user_id || "", updateData, mockFile_1.default)).rejects.toEqual(expect.objectContaining({
                code: 500,
                success: false,
                error: "Failed to delete old profile picture",
            }));
            expect(userRepository.getUserById).toHaveBeenCalledWith(mockUser_1.default.user_id);
            expect(supabaseClient_1.default.storage.from("user").upload).not.toBe(null);
        }));
        it("should throw an error when deleting old profile picture fails", () => __awaiter(void 0, void 0, void 0, function* () {
            userRepository.getUserById.mockResolvedValue(mockUser_1.default);
            supabaseClient_1.default.storage.from("user").remove.mockResolvedValue({
                error: new Error("Delete failed"),
            });
            yield expect(userService.updateUserProfile(mockUser_1.default.user_id || "", updateData, mockFile_1.default)).rejects.toEqual(expect.objectContaining({
                code: 500,
                success: false,
                error: "Failed to delete old profile picture",
            }));
            expect(userRepository.getUserById).toHaveBeenCalledWith(mockUser_1.default.user_id);
            expect(supabaseClient_1.default.storage.from("user").remove).not.toBe(null);
        }));
        it('should upload new profile picture', () => __awaiter(void 0, void 0, void 0, function* () {
            userRepository.getUserById.mockResolvedValue(mockUser_1.default);
            userRepository.updateUserProfile.mockResolvedValue(mockUser_1.default);
            supabaseClient_1.default.storage.from.mockReturnValue({
                remove: jest.fn().mockResolvedValue({ error: null }),
                upload: jest.fn().mockResolvedValue({ error: null }),
                getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: 'new_url' } }),
            });
            const file = {
                fieldname: 'fieldname',
                encoding: 'encoding',
                mimetype: 'mimetype',
                size: 0,
                originalname: 'new_picture.png',
                buffer: Buffer.from(''),
                destination: 'destination',
                filename: 'filename',
                path: 'path',
            };
            yield userService.updateUserProfile('1', {}, file);
            expect(supabaseClient_1.default.storage.from('user').upload).toHaveBeenCalledWith(expect.stringContaining('profile_pictures/1-'), file.buffer);
        }));
    });
});
