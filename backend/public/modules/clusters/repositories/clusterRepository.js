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
exports.ClusterRepository = void 0;
const supabaseClient_1 = __importDefault(require("@/modules/shared/services/supabaseClient"));
const response_1 = require("@/types/response");
class ClusterRepository {
    createCluster(issue) {
        return __awaiter(this, void 0, void 0, function* () {
            let suburb;
            if (!issue.location) {
                const { data: locationData, error: locationError } = yield supabaseClient_1.default
                    .from('location')
                    .select('suburb')
                    .eq('location_id', issue.location_id)
                    .single();
                if (locationError) {
                    console.error('Error fetching location:', locationError);
                    throw (0, response_1.APIError)({
                        code: 500,
                        success: false,
                        error: "An unexpected error occurred while fetching location data.",
                    });
                }
                suburb = locationData.suburb;
            }
            else {
                suburb = issue.location.suburb;
            }
            const { data, error } = yield supabaseClient_1.default
                .from('cluster')
                .insert({
                category_id: issue.category_id,
                suburb: suburb,
                issue_count: 1,
                centroid_embedding: issue.content_embedding
            })
                .select()
                .single();
            if (error) {
                console.error(error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while creating a new cluster.",
                });
            }
            return data;
        });
    }
    updateCluster(clusterId, newCentroid, newIssueCount) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error } = yield supabaseClient_1.default
                .from('cluster')
                .update({
                centroid_embedding: newCentroid,
                issue_count: newIssueCount,
                last_modified: new Date().toISOString()
            })
                .eq('cluster_id', clusterId);
            if (error) {
                console.error('Error updating cluster:', error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while updating cluster.",
                });
            }
        });
    }
    findSimilarClusters(issue_1) {
        return __awaiter(this, arguments, void 0, function* (issue, threshold = 0.7) {
            let suburb;
            if (!issue.location) {
                const { data: locationData, error: locationError } = yield supabaseClient_1.default
                    .from('location')
                    .select('suburb')
                    .eq('location_id', issue.location_id)
                    .single();
                if (locationError) {
                    console.error('Error fetching location:', locationError);
                    throw (0, response_1.APIError)({
                        code: 500,
                        success: false,
                        error: "An unexpected error occurred while fetching location data.",
                    });
                }
                suburb = locationData.suburb;
            }
            else {
                suburb = issue.location.suburb;
            }
            const { data, error } = yield supabaseClient_1.default
                .rpc('find_similar_clusters', {
                query_embedding: issue.content_embedding,
                similarity_threshold: threshold,
                category_id_param: issue.category_id,
                suburb_param: suburb,
                current_time_param: new Date().toISOString()
            });
            if (error) {
                console.error('Error finding similar clusters:', error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while finding similar clusters.",
                });
            }
            return data;
        });
    }
    findSimilarClustersForIssues(issues_1) {
        return __awaiter(this, arguments, void 0, function* (issues, threshold = 0.8) {
            var _a, _b;
            if (issues.length === 0) {
                return [];
            }
            const categoryId = issues[0].category_id;
            const suburb = ((_a = issues[0].location) === null || _a === void 0 ? void 0 : _a.suburb) || ((_b = issues[0].location_data) === null || _b === void 0 ? void 0 : _b.suburb);
            if (!suburb) {
                console.error('No suburb information found for the issue');
                throw (0, response_1.APIError)({
                    code: 400,
                    success: false,
                    error: "Suburb information is missing for the issue.",
                });
            }
            const embeddings = issues.map(issue => issue.content_embedding);
            const averageEmbedding = this.calculateAverageEmbedding(embeddings);
            const { data, error } = yield supabaseClient_1.default
                .rpc('find_similar_clusters', {
                query_embedding: averageEmbedding,
                similarity_threshold: threshold,
                category_id_param: categoryId,
                suburb_param: suburb,
                current_time_param: new Date().toISOString()
            });
            if (error) {
                console.error('Error finding similar clusters:', error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while finding similar clusters.",
                });
            }
            return data;
        });
    }
    calculateAverageEmbedding(embeddings) {
        let sumEmbedding = [];
        let validEmbeddingsCount = 0;
        for (const embedding of embeddings) {
            let embeddingArray = [];
            if (typeof embedding === 'string') {
                try {
                    embeddingArray = JSON.parse(embedding);
                }
                catch (error) {
                    console.error(`Error parsing embedding:`, error);
                    continue;
                }
            }
            else if (Array.isArray(embedding)) {
                embeddingArray = embedding;
            }
            else {
                console.error(`Invalid embedding type:`, typeof embedding);
                continue;
            }
            if (embeddingArray.length > 0) {
                if (sumEmbedding.length === 0) {
                    sumEmbedding = new Array(embeddingArray.length).fill(0);
                }
                for (let i = 0; i < embeddingArray.length; i++) {
                    sumEmbedding[i] += embeddingArray[i];
                }
                validEmbeddingsCount++;
            }
        }
        return sumEmbedding.map(val => val / validEmbeddingsCount);
    }
    getClusters(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = supabaseClient_1.default
                .from('cluster')
                .select('*')
                .eq('category_id', params.categoryId)
                .eq('suburb', params.suburb);
            if (params.fromDate) {
                query = query.gte('created_at', params.fromDate.toISOString());
            }
            if (params.toDate) {
                query = query.lte('created_at', params.toDate.toISOString());
            }
            const { data, error } = yield query;
            if (error) {
                console.error(error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while fetching clusters.",
                });
            }
            return data;
        });
    }
    getClusterById(clusterId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from('cluster')
                .select('*')
                .eq('cluster_id', clusterId)
                .single();
            if (error) {
                console.error(error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while fetching the cluster.",
                });
            }
            return data;
        });
    }
    deleteCluster(clusterId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error } = yield supabaseClient_1.default
                .from('cluster')
                .delete()
                .eq('cluster_id', clusterId);
            if (error) {
                console.error(error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while deleting the cluster.",
                });
            }
        });
    }
    getIssuesInCluster(clusterId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from('issue')
                .select(`
        *,
        issue_embeddings (content_embedding),
        cluster:cluster_id (
          centroid_embedding
        )
      `)
                .eq('cluster_id', clusterId);
            if (error) {
                console.error('Error fetching issues in cluster:', error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while fetching issues in the cluster.",
                });
            }
            if (!data || !Array.isArray(data)) {
                console.warn('No issues found in cluster or invalid data format');
                return [];
            }
            return data.map(issue => {
                var _a, _b;
                return (Object.assign(Object.assign({}, issue), { content_embedding: ((_b = (_a = issue.issue_embeddings) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.content_embedding) || null }));
            });
        });
    }
    getIssueEmbeddingsInCluster(clusterId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from('issue_embeddings')
                .select(`
        issue_id,
        content_embedding,
        ...issue!inner (
          cluster_id
        )
      `)
                .eq("issue.cluster_id", clusterId);
            if (error) {
                console.error(error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while fetching issue embeddings for cluster.",
                });
            }
            return data;
        });
    }
    updateIssueCluster(issueId, newClusterId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error } = yield supabaseClient_1.default
                .from('issue')
                .update({ cluster_id: newClusterId })
                .eq('issue_id', issueId);
            if (error) {
                console.error(error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while updating the issue's cluster.",
                });
            }
        });
    }
    getClusterSize(clusterId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { count, error } = yield supabaseClient_1.default
                .from('issue')
                .select('issue_id', { count: 'exact' })
                .eq('cluster_id', clusterId);
            if (error) {
                console.error(error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while getting the cluster size.",
                });
            }
            return count || 0;
        });
    }
}
exports.ClusterRepository = ClusterRepository;
