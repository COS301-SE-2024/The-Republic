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
const supabaseClient_1 = __importDefault(require("@/modules/shared/services/supabaseClient"));
const response_1 = require("@/types/response");
class ReportsRepository {
    getAllIssuesGroupedByResolutionStatus(_a) {
        return __awaiter(this, arguments, void 0, function* ({ from, amount, }) {
            const { data, error } = yield supabaseClient_1.default
                .from("issue")
                .select(`
        *,
        category: category_id (
          name
        ),
        location: location_id (
          suburb,
          city,
          province
        )
      `)
                .order("created_at", { ascending: false })
                .range(from, from + amount - 1);
            if (error) {
                console.error(error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred. Please try again later.",
                });
            }
            const groupedIssues = data.reduce((acc, issue) => {
                const key = issue.resolved_at ? "resolved" : "unresolved";
                if (!acc[key]) {
                    acc[key] = [];
                }
                acc[key].push(Object.assign(Object.assign({}, issue), { user: undefined }));
                return acc;
            }, { resolved: [], unresolved: [] });
            return groupedIssues;
        });
    }
    getIssueCountsGroupedByResolutionStatus(_a) {
        return __awaiter(this, arguments, void 0, function* ({ from, amount, }) {
            const { data, error } = yield supabaseClient_1.default
                .from("issue")
                .select(`
        resolved_at
      `)
                .order("created_at", { ascending: false })
                .range(from, from + amount - 1);
            if (error) {
                console.error(error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred. Please try again later.",
                });
            }
            const counts = data.reduce((acc, issue) => {
                const key = issue.resolved_at ? "resolved" : "unresolved";
                acc[key] = (acc[key] || 0) + 1;
                return acc;
            }, { resolved: 0, unresolved: 0 });
            return counts;
        });
    }
    getIssueCountsGroupedByResolutionAndCategory(_a) {
        return __awaiter(this, arguments, void 0, function* ({ from, amount, }) {
            const { data, error } = yield supabaseClient_1.default
                .from("issue")
                .select(`
        *,
        category: category_id (
          name
        )
      `)
                .order("created_at", { ascending: false })
                .range(from, from + amount - 1);
            if (error) {
                console.error(error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred. Please try again later.",
                });
            }
            const groupedIssues = data.reduce((acc, issue) => {
                const resolutionKey = issue.resolved_at ? "resolved" : "unresolved";
                const categoryKey = issue.category.name;
                if (!acc[resolutionKey][categoryKey]) {
                    acc[resolutionKey][categoryKey] = 0;
                }
                acc[resolutionKey][categoryKey] += 1;
                return acc;
            }, { resolved: {}, unresolved: {} });
            return groupedIssues;
        });
    }
    getIssuesGroupedByCreatedAt(_a) {
        return __awaiter(this, arguments, void 0, function* ({ from, amount, }) {
            const { data, error } = yield supabaseClient_1.default
                .from("issue")
                .select(`
        *,
        category: category_id (
          name
        )
      `)
                .order("created_at", { ascending: false })
                .range(from, from + amount - 1);
            if (error) {
                console.error(error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred. Please try again later.",
                });
            }
            const groupedByCreatedAt = data.reduce((acc, issue) => {
                const createdAtDate = issue.created_at.split("T")[0];
                if (!acc[createdAtDate]) {
                    acc[createdAtDate] = [];
                }
                acc[createdAtDate].push(issue);
                return acc;
            }, {});
            return groupedByCreatedAt;
        });
    }
    getIssuesGroupedByCategory(_a) {
        return __awaiter(this, arguments, void 0, function* ({ from, amount }) {
            const { data, error } = yield supabaseClient_1.default
                .from("issue")
                .select(`
        *,
        category: category_id (
          name
        )
      `)
                .order("created_at", { ascending: false })
                .range(from, from + amount - 1);
            if (error) {
                console.error(error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred. Please try again later.",
                });
            }
            const groupedByCategory = data.reduce((acc, issue) => {
                const categoryName = issue.category.name;
                if (!acc[categoryName]) {
                    acc[categoryName] = [];
                }
                acc[categoryName].push(issue);
                return acc;
            }, {});
            return groupedByCategory;
        });
    }
    getIssuesCountGroupedByCategoryAndCreatedAt(_a) {
        return __awaiter(this, arguments, void 0, function* ({ from, amount, }) {
            const { data, error } = yield supabaseClient_1.default
                .from("issue")
                .select(`
        *,
        category: category_id (
          name
        ),
        created_at
      `)
                .order("created_at", { ascending: false })
                .range(from, from + amount - 1);
            if (error) {
                console.error(error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred. Please try again later.",
                });
            }
            const groupedByCategory = data.reduce((acc, issue) => {
                const categoryName = issue.category.name;
                if (!acc[categoryName]) {
                    acc[categoryName] = [];
                }
                acc[categoryName].push(issue);
                return acc;
            }, {});
            const groupedAndCounted = Object.keys(groupedByCategory).reduce((acc, categoryName) => {
                const issues = groupedByCategory[categoryName];
                const countsByCreatedAt = issues.reduce((counts, issue) => {
                    const createdAt = issue.created_at.split("T")[0];
                    counts[createdAt] = (counts[createdAt] || 0) + 1;
                    return counts;
                }, {});
                acc[categoryName] = countsByCreatedAt;
                return acc;
            }, {});
            const allDates = new Set();
            Object.values(groupedAndCounted).forEach((countsByCreatedAt) => {
                Object.keys(countsByCreatedAt).forEach((date) => allDates.add(date));
            });
            const normalizedCounts = Object.keys(groupedAndCounted).reduce((acc, categoryName) => {
                const categoryCounts = groupedAndCounted[categoryName];
                const normalizedCategoryCounts = {};
                allDates.forEach((date) => {
                    normalizedCategoryCounts[date] = categoryCounts[date] || 0;
                });
                acc[categoryName] = normalizedCategoryCounts;
                return acc;
            }, {});
            return normalizedCounts;
        });
    }
    groupedByPoliticalAssociation() {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from("resolution")
                .select(`
        name: political_association,
        value: num_cluster_members_accepted.sum()
      `);
            if (error) {
                console.log(error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred. Please try again later."
                });
            }
            return data.reduce((newData, current) => {
                var _a;
                if (["NONE", null].includes(current.name)) {
                    if (((_a = newData[0]) === null || _a === void 0 ? void 0 : _a.name) === "No party") {
                        newData[0].value += current.value;
                    }
                    else {
                        newData.unshift({
                            name: "No party",
                            value: current.value,
                        });
                    }
                }
                else {
                    newData.push(current);
                }
                return newData;
            }, []);
        });
    }
}
exports.default = ReportsRepository;
