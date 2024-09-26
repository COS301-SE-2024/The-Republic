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
exports.deleteComment = exports.addComment = exports.getComments = exports.getNumComments = void 0;
const commentService_1 = require("@/modules/comments/services/commentService");
const response_1 = require("@/utilities/response");
const commentService = new commentService_1.CommentService();
function getNumComments(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { itemId, itemType, parent_id } = req.body;
            const response = yield commentService.getNumComments({ itemId, itemType, parent_id });
            (0, response_1.sendResponse)(res, response);
        }
        catch (error) {
            (0, response_1.sendResponse)(res, error);
        }
    });
}
exports.getNumComments = getNumComments;
function getComments(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield commentService.getComments(req.body);
            (0, response_1.sendResponse)(res, response);
        }
        catch (error) {
            (0, response_1.sendResponse)(res, error);
        }
    });
}
exports.getComments = getComments;
function addComment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield commentService.addComment(req.body);
            (0, response_1.sendResponse)(res, response);
        }
        catch (error) {
            (0, response_1.sendResponse)(res, error);
        }
    });
}
exports.addComment = addComment;
function deleteComment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield commentService.deleteComment(req.body);
            (0, response_1.sendResponse)(res, response);
        }
        catch (error) {
            (0, response_1.sendResponse)(res, error);
        }
    });
}
exports.deleteComment = deleteComment;
