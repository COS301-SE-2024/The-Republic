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
exports.VisualizationService = void 0;
const visualizationRepository_1 = require("@/modules/visualizations/repositories/visualizationRepository");
const response_1 = require("@/types/response");
class VisualizationService {
    constructor() {
        this.visualizationRepository = new visualizationRepository_1.VisualizationRepository();
    }
    getVizData() {
        return __awaiter(this, void 0, void 0, function* () {
            const vizData = yield this.visualizationRepository.getVizData();
            return (0, response_1.APIData)({
                code: 200,
                success: true,
                data: vizData,
            });
        });
    }
}
exports.VisualizationService = VisualizationService;
