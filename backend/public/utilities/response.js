"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
function sendResponse(res, response) {
    res.status(response.code).json(response);
}
exports.sendResponse = sendResponse;
