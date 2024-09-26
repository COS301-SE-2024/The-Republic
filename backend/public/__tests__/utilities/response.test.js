"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = require("@/utilities/response");
describe("sendResponse", () => {
    let res;
    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
    });
    it("should set the status code and send the response as JSON", () => {
        const response = {
            code: 200,
            success: true,
            data: "Test data",
        };
        (0, response_1.sendResponse)(res, response);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(response);
    });
    it("should handle different status codes", () => {
        const response = {
            code: 404,
            success: false,
            data: null,
        };
        (0, response_1.sendResponse)(res, response);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(response);
    });
});
