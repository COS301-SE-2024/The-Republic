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
exports.VisualizationRepository = void 0;
const issueRepository_1 = __importDefault(require("@/modules/issues/repositories/issueRepository"));
const issueRepository = new issueRepository_1.default();
class VisualizationRepository {
    getVizData() {
        return __awaiter(this, void 0, void 0, function* () {
            const issues = yield issueRepository.getIssues({ from: 0, amount: 99 });
            const data = {};
            for (const issue of issues) {
                const location = issue.location;
                this.addIssue(data, location
                    ? [
                        location.province,
                        location.city,
                        location.suburb,
                        location.district,
                    ]
                    : [], issue.category.name);
            }
            return data;
        });
    }
    addIssue(data, place, category) {
        var _a;
        (_a = data["$count"]) !== null && _a !== void 0 ? _a : (data["$count"] = 0);
        data["$count"]++;
        this._addIssue(data, place, category);
    }
    _addIssue(data, place, category) {
        var _a, _b;
        while (place.length && !place[0]) {
            place.shift();
        }
        if (place.length === 0) {
            (_a = data[category]) !== null && _a !== void 0 ? _a : (data[category] = { $count: 0 });
            data[category]["$count"]++;
            return;
        }
        const placeName = place.shift();
        (_b = data[placeName]) !== null && _b !== void 0 ? _b : (data[placeName] = { $count: 0 });
        data[placeName]["$count"]++;
        this._addIssue(data[placeName], place, category);
    }
}
exports.VisualizationRepository = VisualizationRepository;
