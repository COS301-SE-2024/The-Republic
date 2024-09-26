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
exports.OpenAIService = void 0;
const openai_1 = require("openai");
const response_1 = require("@/types/response");
class OpenAIService {
    constructor() {
        this.openai = new openai_1.OpenAI({
            apiKey: process.env.OPENAI_API_KEY || ""
        });
    }
    getEmbedding(text) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.openai.embeddings.create({
                    model: "text-embedding-ada-002",
                    input: text,
                });
                return response.data[0].embedding;
            }
            catch (error) {
                console.error('Error getting embedding:', error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An error occurred while generating the embedding.",
                });
            }
        });
    }
    cosineSimilarity(a, b) {
        const dotProduct = a.reduce((sum, _, i) => sum + a[i] * b[i], 0);
        const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
        const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
        return dotProduct / (magnitudeA * magnitudeB);
    }
}
exports.OpenAIService = OpenAIService;
