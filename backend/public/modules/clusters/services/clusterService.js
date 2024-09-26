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
exports.ClusterService = void 0;
const clusterRepository_1 = require("../repositories/clusterRepository");
const issueRepository_1 = __importDefault(require("@/modules/issues/repositories/issueRepository"));
const openAIService_1 = require("@/modules/shared/services/openAIService");
const response_1 = require("@/types/response");
class ClusterService {
    constructor() {
        this.clusterRepository = new clusterRepository_1.ClusterRepository();
        this.issueRepository = new issueRepository_1.default();
        this.openAIService = new openAIService_1.OpenAIService();
    }
    getClusters(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.clusterRepository.getClusters(params);
        });
    }
    getClusterById(clusterId) {
        return __awaiter(this, void 0, void 0, function* () {
            const cluster = yield this.clusterRepository.getClusterById(clusterId);
            if (!cluster) {
                throw (0, response_1.APIError)({
                    code: 404,
                    success: false,
                    error: "Cluster not found",
                });
            }
            return cluster;
        });
    }
    assignClusterToIssue(issue) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!issue.content_embedding) {
                issue.content_embedding = yield this.openAIService.getEmbedding(issue.content);
                yield this.issueRepository.setIssueEmbedding(issue.issue_id, issue.content_embedding);
            }
            const similarClusters = yield this.clusterRepository.findSimilarClusters(issue, 0.9);
            let assignedCluster;
            if (similarClusters.length > 0) {
                assignedCluster = similarClusters[0];
                const newEmbedding = Array.isArray(issue.content_embedding) ? issue.content_embedding : JSON.parse(issue.content_embedding);
                yield this.updateCluster(assignedCluster, newEmbedding);
            }
            else {
                assignedCluster = yield this.clusterRepository.createCluster(issue);
            }
            yield this.issueRepository.updateIssueCluster(issue.issue_id, assignedCluster.cluster_id);
            return assignedCluster.cluster_id;
        });
    }
    updateCluster(cluster, newEmbedding) {
        return __awaiter(this, void 0, void 0, function* () {
            let centroidEmbedding;
            if (typeof cluster.centroid_embedding === 'string') {
                try {
                    centroidEmbedding = JSON.parse(cluster.centroid_embedding);
                }
                catch (error) {
                    console.error('Error parsing centroid_embedding:', error);
                    throw (0, response_1.APIError)({
                        code: 500,
                        success: false,
                        error: "Invalid centroid_embedding format",
                    });
                }
            }
            else if (Array.isArray(cluster.centroid_embedding)) {
                centroidEmbedding = cluster.centroid_embedding;
            }
            else {
                console.error('Unexpected centroid_embedding type:', typeof cluster.centroid_embedding);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "Invalid centroid_embedding format",
                });
            }
            const newIssueCount = cluster.issue_count + 1;
            const newCentroid = centroidEmbedding.map((val, i) => (val * cluster.issue_count + newEmbedding[i]) / newIssueCount);
            yield this.clusterRepository.updateCluster(cluster.cluster_id, JSON.stringify(newCentroid), newIssueCount);
        });
    }
    removeIssueFromCluster(issueId, clusterId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cluster = yield this.clusterRepository.getClusterById(clusterId);
                if (!cluster) {
                    throw (0, response_1.APIError)({
                        code: 404,
                        success: false,
                        error: "Cluster not found",
                    });
                }
                //console.log('Cluster:', cluster);
                if (cluster.issue_count <= 1) {
                    yield this.clusterRepository.deleteCluster(clusterId);
                }
                else {
                    const updatedIssueCount = cluster.issue_count - 1;
                    const issues = yield this.clusterRepository.getIssueEmbeddingsInCluster(clusterId);
                    const updatedCentroid = this.recalculateCentroid(issues, issueId);
                    const formattedCentroid = this.formatCentroidForDatabase(updatedCentroid);
                    yield this.clusterRepository.updateCluster(clusterId, formattedCentroid, updatedIssueCount);
                }
            }
            catch (error) {
                console.error('Error in removeIssueFromCluster:', error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: `An error occurred while removing issue from cluster: ${error}`,
                });
            }
        });
    }
    recalculateCentroid(issues, excludeIssueId) {
        const relevantIssues = issues.filter(issue => issue.issue_id !== excludeIssueId);
        if (relevantIssues.length === 0) {
            throw new Error("No issues left in cluster after exclusion");
        }
        //console.log('Relevant issues:', relevantIssues);
        let embeddingLength = 0;
        let sumEmbedding = [];
        let validEmbeddingsCount = 0;
        for (const issue of relevantIssues) {
            let embeddingArray = [];
            if (typeof issue.content_embedding === 'string') {
                try {
                    embeddingArray = JSON.parse(issue.content_embedding);
                }
                catch (error) {
                    console.error(`Error parsing embedding for issue ${issue.issue_id}:`, error);
                    continue;
                }
            }
            else if (Array.isArray(issue.content_embedding)) {
                embeddingArray = issue.content_embedding;
            }
            else {
                console.error(`Invalid embedding type for issue ${issue.issue_id}:`, typeof issue.content_embedding);
                continue;
            }
            if (embeddingArray.length > 0) {
                if (embeddingLength === 0) {
                    embeddingLength = embeddingArray.length;
                    sumEmbedding = new Array(embeddingLength).fill(0);
                }
                if (embeddingArray.length === embeddingLength) {
                    for (let i = 0; i < embeddingLength; i++) {
                        const value = embeddingArray[i];
                        if (typeof value === 'number' && !isNaN(value) && isFinite(value)) {
                            sumEmbedding[i] += value;
                        }
                    }
                    validEmbeddingsCount++;
                }
            }
        }
        if (validEmbeddingsCount === 0) {
            console.error('No valid embeddings found in cluster');
            return this.getDefaultEmbedding(relevantIssues);
        }
        return sumEmbedding.map(val => val / validEmbeddingsCount);
    }
    getDefaultEmbedding(issues) {
        for (const issue of issues) {
            if (issue.cluster && typeof issue.cluster.centroid_embedding === 'string') {
                try {
                    return JSON.parse(issue.cluster.centroid_embedding);
                }
                catch (error) {
                    console.error('Error parsing cluster centroid:', error);
                }
            }
        }
        const embeddingLength = 1536;
        return new Array(embeddingLength).fill(0);
    }
    moveAcceptedMembersToNewCluster(issueId, acceptedUserIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const issue = yield this.issueRepository.getIssueById(issueId);
            if (!issue) {
                throw (0, response_1.APIError)({
                    code: 404,
                    success: false,
                    error: "Issue not found",
                });
            }
            if (!issue.cluster_id) {
                throw (0, response_1.APIError)({
                    code: 400,
                    success: false,
                    error: "Issue is not associated with a cluster",
                });
            }
            const oldClusterId = issue.cluster_id;
            const clusterIssues = yield this.clusterRepository.getIssuesInCluster(oldClusterId);
            // Find accepted issues
            const acceptedIssues = clusterIssues.filter(clusterIssue => clusterIssue.issue_id !== issueId && acceptedUserIds.includes(clusterIssue.user_id));
            let newClusterId = '';
            if (acceptedIssues.length > 0) {
                // Check for similar clusters among accepted issues
                const similarClusters = yield this.clusterRepository.findSimilarClustersForIssues(acceptedIssues, 0.9);
                if (similarClusters.length > 0) {
                    // Move accepted issues to the most similar cluster
                    const mostSimilarCluster = similarClusters[0];
                    newClusterId = mostSimilarCluster.cluster_id;
                    for (const acceptedIssue of acceptedIssues) {
                        yield this.clusterRepository.updateIssueCluster(acceptedIssue.issue_id, newClusterId);
                    }
                }
                else {
                    // Create a new cluster with the first accepted issue
                    const newCluster = yield this.clusterRepository.createCluster(acceptedIssues[0]);
                    newClusterId = newCluster.cluster_id;
                    // Move accepted issues to the new cluster
                    for (const acceptedIssue of acceptedIssues) {
                        yield this.clusterRepository.updateIssueCluster(acceptedIssue.issue_id, newClusterId);
                    }
                }
            }
            else {
                // Create a new cluster with the accepted issue
                const issueEmbedding = yield this.issueRepository.getIssueEmbedding(issueId);
                if (!issueEmbedding.content_embedding) {
                    throw (0, response_1.APIError)({
                        code: 500,
                        success: false,
                        error: "Issue embedding not found",
                    });
                }
                // Combine the full issue data with the embedding
                const fullIssueWithEmbedding = Object.assign(Object.assign({}, issue), { content_embedding: issueEmbedding.content_embedding });
                const newCluster = yield this.clusterRepository.createCluster(fullIssueWithEmbedding);
                newClusterId = newCluster.cluster_id;
            }
            // Move the accepted issue to the new cluster
            yield this.clusterRepository.updateIssueCluster(issueId, newClusterId);
            // Recalculate centroids for both old and new clusters
            yield this.recalculateClusterCentroid(oldClusterId);
            yield this.recalculateClusterCentroid(newClusterId);
            // Check if the old cluster is empty and delete if necessary
            const oldClusterSize = yield this.clusterRepository.getClusterSize(oldClusterId);
            if (oldClusterSize === 0) {
                yield this.clusterRepository.deleteCluster(oldClusterId);
            }
            return newClusterId;
        });
    }
    recalculateClusterCentroid(clusterId) {
        return __awaiter(this, void 0, void 0, function* () {
            const issues = yield this.clusterRepository.getIssuesInCluster(clusterId);
            if (issues.length === 0) {
                return; // Cluster is empty, no need to recalculate
            }
            const issuesWithEmbeddings = yield Promise.all(issues.map((issue) => __awaiter(this, void 0, void 0, function* () {
                if (!issue.content_embedding) {
                    const embedding = yield this.issueRepository.getIssueEmbedding(issue.issue_id);
                    return Object.assign(Object.assign({}, issue), { content_embedding: embedding.content_embedding });
                }
                return issue;
            })));
            const newCentroid = this.calculateAverageEmbedding(issuesWithEmbeddings);
            if (newCentroid.length === 0) {
                console.error(`Failed to calculate new centroid for cluster ${clusterId}`);
                return;
            }
            const formattedCentroid = this.formatCentroidForDatabase(newCentroid);
            yield this.clusterRepository.updateCluster(clusterId, formattedCentroid, issues.length);
        });
    }
    calculateAverageEmbedding(issues) {
        let sumEmbedding = [];
        let validEmbeddingsCount = 0;
        for (const issue of issues) {
            if (!issue.content_embedding) {
                console.warn(`Issue ${issue.issue_id} has no content_embedding`);
                continue;
            }
            let embeddingArray = [];
            if (typeof issue.content_embedding === 'string') {
                try {
                    embeddingArray = JSON.parse(issue.content_embedding);
                }
                catch (error) {
                    console.error(`Error parsing embedding for issue ${issue.issue_id}:`, error);
                    continue;
                }
            }
            else if (Array.isArray(issue.content_embedding)) {
                embeddingArray = issue.content_embedding;
            }
            else {
                console.error(`Invalid embedding type for issue ${issue.issue_id}:`, typeof issue.content_embedding);
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
        if (validEmbeddingsCount === 0) {
            console.error('No valid embeddings found in cluster');
            return [];
        }
        return sumEmbedding.map(val => val / validEmbeddingsCount);
    }
    formatCentroidForDatabase(centroid) {
        return `[${centroid.map(val => {
            if (isNaN(val) || !isFinite(val)) {
                return '0';
            }
            return val.toFixed(6);
        }).join(',')}]`;
    }
}
exports.ClusterService = ClusterService;
