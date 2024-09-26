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
class SubscriptionsRepository {
    issueSubscriptions(_a) {
        return __awaiter(this, arguments, void 0, function* ({ user_id, issue_id, }) {
            if (!user_id || !issue_id) {
                throw (0, response_1.APIError)({
                    code: 400,
                    success: false,
                    error: "Missing required parameters: user_id or issue_id",
                });
            }
            const { data: selectData, error: selectError } = yield supabaseClient_1.default
                .from('subscriptions')
                .select('*')
                .eq('user_id', user_id)
                .single();
            if (selectData && !selectError) {
                if (selectData.issues.includes(issue_id === null || issue_id === void 0 ? void 0 : issue_id.toString())) {
                    const updatedIssues = selectData.issues.filter((issue) => issue !== issue_id);
                    const { data: updateData, error: updateError } = yield supabaseClient_1.default
                        .from('subscriptions')
                        .update({ issues: updatedIssues })
                        .eq('user_id', user_id)
                        .select();
                    if (updateError || !updateData) {
                        console.error(updateError);
                        console.error(updateData);
                        throw (0, response_1.APIError)({
                            code: 500,
                            success: false,
                            error: "An unexpected error occurred while updating the subscription. Please try again later.",
                        });
                    }
                    return "Subscription successfully removed!";
                }
                else {
                    const updatedIssues = [...selectData.issues, issue_id];
                    const { data: updateData, error: updateError } = yield supabaseClient_1.default
                        .from('subscriptions')
                        .update({ issues: updatedIssues })
                        .eq('user_id', user_id)
                        .select();
                    if (updateError || !updateData) {
                        console.error(updateError);
                        console.error(updateData);
                        throw (0, response_1.APIError)({
                            code: 500,
                            success: false,
                            error: "An unexpected error occurred while updating the subscription. Please try again later.",
                        });
                    }
                    return "Subscription successfully created!";
                }
            }
            else {
                const { data: insertData, error: insertError } = yield supabaseClient_1.default
                    .from('subscriptions')
                    .insert({
                    user_id: user_id,
                    issues: [issue_id],
                    categories: [],
                    locations: [],
                })
                    .select()
                    .single();
                if (insertError || !insertData) {
                    console.error(insertError);
                    throw (0, response_1.APIError)({
                        code: 500,
                        success: false,
                        error: "An unexpected error occurred while creating the subscription. Please try again later.",
                    });
                }
                return "Subscription successfully created!";
            }
        });
    }
    categorySubscriptions(_a) {
        return __awaiter(this, arguments, void 0, function* ({ user_id, category_id, }) {
            if (!user_id || !category_id) {
                throw (0, response_1.APIError)({
                    code: 400,
                    success: false,
                    error: "Missing required parameters: user_id or category_id",
                });
            }
            const { data: selectData, error: selectError } = yield supabaseClient_1.default
                .from('subscriptions')
                .select('*')
                .eq('user_id', user_id)
                .single();
            if (selectData && !selectError) {
                if (selectData.categories.includes(category_id === null || category_id === void 0 ? void 0 : category_id.toString())) {
                    const updatedCategories = selectData.categories.filter((category) => category !== category_id);
                    const { data: updateData, error: updateError } = yield supabaseClient_1.default
                        .from('subscriptions')
                        .update({ categories: updatedCategories })
                        .eq('user_id', user_id)
                        .select();
                    if (updateError || !updateData) {
                        console.error(updateError);
                        console.error(updateData);
                        throw (0, response_1.APIError)({
                            code: 500,
                            success: false,
                            error: "An unexpected error occurred while updating the subscription. Please try again later.",
                        });
                    }
                    return "Subscription successfully removed!";
                }
                else {
                    const updatedCategories = [...selectData.categories, category_id];
                    const { data: updateData, error: updateError } = yield supabaseClient_1.default
                        .from('subscriptions')
                        .update({ categories: updatedCategories })
                        .eq('user_id', user_id)
                        .select();
                    if (updateError || !updateData) {
                        console.error(updateError);
                        console.error(updateData);
                        throw (0, response_1.APIError)({
                            code: 500,
                            success: false,
                            error: "An unexpected error occurred while updating the subscription. Please try again later.",
                        });
                    }
                    return "Subscription successfully created!";
                }
            }
            else {
                const { data: insertData, error: insertError } = yield supabaseClient_1.default
                    .from('subscriptions')
                    .insert({
                    user_id: user_id,
                    categories: [category_id],
                    issues: [],
                    locations: [],
                })
                    .select()
                    .single();
                if (insertError || !insertData) {
                    console.error(insertError);
                    throw (0, response_1.APIError)({
                        code: 500,
                        success: false,
                        error: "An unexpected error occurred while creating the subscription. Please try again later.",
                    });
                }
                return "Subscription successfully created!";
            }
        });
    }
    locationSubscriptions(_a) {
        return __awaiter(this, arguments, void 0, function* ({ user_id, location_id, }) {
            const { data: selectData, error: selectError } = yield supabaseClient_1.default
                .from('subscriptions')
                .select('locations')
                .eq('user_id', user_id)
                .single();
            if (selectData && !selectError) {
                if (selectData.locations.includes(location_id === null || location_id === void 0 ? void 0 : location_id.toString())) {
                    const updatedlocations = selectData.locations.filter((location) => location !== location_id);
                    const { data: updateData, error: updateError } = yield supabaseClient_1.default
                        .from('subscriptions')
                        .update({ locations: updatedlocations })
                        .eq('user_id', user_id)
                        .select();
                    if (updateError || !updateData) {
                        console.error(updateError);
                        console.error(updateData);
                        throw (0, response_1.APIError)({
                            code: 500,
                            success: false,
                            error: "An unexpected error occurred while updating the subscription. Please try again later.",
                        });
                    }
                    return "Subscription successfully removed!";
                }
                else {
                    const updatedlocations = [...selectData.locations, location_id];
                    const { data: updateData, error: updateError } = yield supabaseClient_1.default
                        .from('subscriptions')
                        .update({ locations: updatedlocations })
                        .eq('user_id', user_id)
                        .select();
                    if (updateError || !updateData) {
                        console.error(updateError);
                        console.error(updateData);
                        throw (0, response_1.APIError)({
                            code: 500,
                            success: false,
                            error: "An unexpected error occurred while updating the subscription. Please try again later.",
                        });
                    }
                    return "Subscription successfully created!";
                }
            }
            else {
                const { data: insertData, error: insertError } = yield supabaseClient_1.default
                    .from('subscriptions')
                    .insert({
                    user_id: user_id,
                    locations: [location_id],
                    categories: [],
                    issues: [],
                })
                    .select()
                    .single();
                if (insertError || !insertData) {
                    console.error(insertError);
                    throw (0, response_1.APIError)({
                        code: 500,
                        success: false,
                        error: "An unexpected error occurred while creating the subscription. Please try again later.",
                    });
                }
                return "Subscription successfully created!";
            }
        });
    }
    getSubscriptions(_a) {
        return __awaiter(this, arguments, void 0, function* ({ user_id, }) {
            const { data: selectData } = yield supabaseClient_1.default
                .from('subscriptions')
                .select('issues, categories, locations')
                .eq('user_id', user_id)
                .single();
            const result = {
                issues: (selectData === null || selectData === void 0 ? void 0 : selectData.issues) || [],
                categories: (selectData === null || selectData === void 0 ? void 0 : selectData.categories) || [],
                locations: (selectData === null || selectData === void 0 ? void 0 : selectData.locations) || [],
            };
            return result;
        });
    }
    getNotifications(_a) {
        return __awaiter(this, arguments, void 0, function* ({ user_id }) {
            const subscriptions = yield this.getSubscriptions({ user_id });
            if (!subscriptions) {
                console.error('Failed to retrieve subscriptions');
                return [];
            }
            const { issues: subIssues, categories: subCategories, locations: subLocations } = subscriptions;
            const { data: issueData, error: issueError } = yield supabaseClient_1.default
                .from('issue')
                .select(`
        issue_id,
        user_id,
        location_id,
        category_id,
        content,
        is_anonymous,
        created_at,
        sentiment,
        comment (
          user_id,
          content,
          is_anonymous,
          created_at
        ),
        reaction (
          user_id,
          emoji,
          created_at
        ),
        resolution (
          resolver_id,
          resolution_text,
          status,
          created_at
        )
      `);
            if (issueError) {
                console.error('Error fetching issue data:', issueError);
                return [];
            }
            const { data: pointsData, error: pointsError } = yield supabaseClient_1.default
                .from('points_history')
                .select(`
        user_id,
        action,
        points,
        created_at
      `);
            if (pointsError) {
                console.error('Error fetching points history:', pointsError);
                return [];
            }
            const filteredNotifications = [];
            const addedIssues = new Set();
            issueData.forEach(issue => {
                var _a, _b, _c;
                const issueIdStr = (_a = issue.issue_id) === null || _a === void 0 ? void 0 : _a.toString();
                const categoryIdStr = (_b = issue.category_id) === null || _b === void 0 ? void 0 : _b.toString();
                const locationIdStr = (_c = issue.location_id) === null || _c === void 0 ? void 0 : _c.toString();
                if (subIssues.includes(issueIdStr) || subCategories.includes(categoryIdStr) || subLocations.includes(locationIdStr) || issue.user_id === user_id) {
                    if (!addedIssues.has(issueIdStr)) {
                        filteredNotifications.push({
                            type: 'issue',
                            content: issue.content,
                            issue_id: issue.issue_id,
                            category: issue.category_id,
                            location: issue.location_id,
                            created_at: issue.created_at
                        });
                        addedIssues.add(issueIdStr);
                    }
                }
                if (issue.comment) {
                    issue.comment.forEach(comment => {
                        if (subIssues.includes(issueIdStr) || comment.user_id === user_id) {
                            filteredNotifications.push({
                                type: 'comment',
                                content: comment.content,
                                issue_id: issue.issue_id,
                                category: issue.category_id,
                                location: issue.location_id,
                                created_at: comment.created_at
                            });
                        }
                    });
                }
                if (issue.reaction) {
                    issue.reaction.forEach(reaction => {
                        if (subIssues.includes(issueIdStr) || reaction.user_id === user_id) {
                            filteredNotifications.push({
                                type: 'reaction',
                                content: `reacted with ${reaction.emoji}`,
                                issue_id: issue.issue_id,
                                category: issue.category_id,
                                location: issue.location_id,
                                created_at: reaction.created_at
                            });
                        }
                    });
                }
                if (issue.resolution) {
                    issue.resolution.forEach(resolution => {
                        if (subIssues.includes(issueIdStr) || resolution.resolver_id === user_id) {
                            filteredNotifications.push({
                                type: 'resolution',
                                content: `Your ${resolution.resolution_text}`,
                                issue_id: issue.issue_id,
                                category: issue.category_id,
                                location: issue.location_id,
                                created_at: resolution.created_at
                            });
                        }
                    });
                }
            });
            pointsData.forEach(points => {
                if (points.user_id === user_id) {
                    filteredNotifications.push({
                        type: 'points',
                        content: `You earned ${points.points} points, because you ${points.action}.`,
                        created_at: points.created_at
                    });
                }
            });
            return filteredNotifications.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        });
    }
}
exports.default = SubscriptionsRepository;
