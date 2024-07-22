# Plan for Clustering of Issues

Clustering issues means to group issues that are related to each other. This key subsystem/microservice facilitates the process of resolving and archiving issues by grouping similar issues together.

## Objective

To implement a scalable and efficient method for clustering issues (posts) in our application, ensuring that similar issues are grouped together dynamically based on:
- Issue content
- Time of issue creation
- Location (at a suburb level)
- Issue category

## Steps for Clustering

This plan will not delve into the specific implementation of clustering algorithms, as this may evolve based on requirements and advancements.

### 1. Initial Clustering

1. **Retrieve Issues**: Fetch all existing issues from the database.
2. **Group Issues**: Organize issues by suburb, category, and time of creation.
3. **Pre-Process Data**: Clean and prepare data for clustering, including text normalization and feature extraction.
4. **Apply Clustering Algorithm**: Use a clustering algorithm to group issues within each predefined group.
5. **Update Database**: Store the cluster IDs in the database for each issue.

### 2. Assigning Issues to Clusters

1. **Feature Calculation**: When a new issue is created, compute its features based on content, location, and category.
2. **Cluster Assignment**: Assign the new issue to the nearest cluster, if an appropriate cluster exists.

### 3. Periodic Re-Clustering

1. **Trigger Mechanism**: Set up a script to re-cluster issues. This script can be triggered based on:
   - Number of new issues created.
   - Scheduled intervals (e.g., daily, weekly, monthly).
   - Both intervals and the number of new issues.
2. **Re-Cluster Issues**: Re-evaluate and update clusters based on the latest data and any new issues.
3. **Update Database**: Reflect changes in the database, ensuring cluster IDs are up-to-date.

## Algorithms and Tools

### Clustering Algorithms

1. **K-Means Clustering**
   - **Description**: Partitions data into K clusters by minimizing the variance within each cluster.
   - **Pros**: Efficient for large datasets; easy to implement.
   - **Cons**: Requires the number of clusters (K) to be specified; may not handle outliers well. Clusters must be spherical.

2. **DBSCAN (Density-Based Spatial Clustering of Applications with Noise)**
   - **Description**: Groups data based on density; identifies clusters of varying shapes and sizes.
   - **Pros**: No need to specify the number of clusters; can find arbitrarily shaped clusters.
   - **Cons**: Performance can degrade with very large datasets.

### Tools for Clustering

1. **Scikit-Learn (Python)**
   - **Description**: A popular machine learning library that provides various clustering algorithms including K-Means, DBSCAN, and Hierarchical Clustering.
   - **Pros**: Comprehensive, easy-to-use, and well-documented.