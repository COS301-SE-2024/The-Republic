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
exports.getVizData = void 0;
const visualizationService_1 = require("@/modules/visualizations/services/visualizationService");
const response_1 = require("@/utilities/response");
const visualizationService = new visualizationService_1.VisualizationService();
function getVizData(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield visualizationService.getVizData();
            (0, response_1.sendResponse)(res, response);
        }
        catch (error) {
            (0, response_1.sendResponse)(res, error);
        }
    });
}
exports.getVizData = getVizData;
