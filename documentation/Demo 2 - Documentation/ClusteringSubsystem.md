# Plan for Clustering of Issues

Clustering issues means to group issues that are related to each other. This key subsystem facilitates the process of resolving and archiving issues by grouping similar issues together.

## Objective

To implement a scalable and efficient method for clustering issues (posts) in our application, ensuring that similar issues are grouped together dynamically based on:
- Issue content
- Time of issue creation
- Location (at a suburb level)
- Issue category

## Steps for Clustering

This plan will not delve into the specific implementation of clustering algorithms, as this may evolve based on requirements and advancements.

### 1. Assigning Issues to Clusters

1. **Filtering**: For the fields issue category, location and time, we can simply filter that. And then we will use AI then
to cluster based on issue content. Issue content is the last field we should cluster on.
2. **Cluster Assignment**: Assign the new issue to the nearest cluster, if an appropriate cluster exists.


## Algorithms and Tools

### Clustering Algorithms

1. **DBSCAN (Density-Based Spatial Clustering of Applications with Noise)**
   - **Description**: Groups data based on density; identifies clusters of varying shapes and sizes.
   - **Pros**: No need to specify the number of clusters; can find arbitrarily shaped clusters.
   - **Cons**: Performance can degrade with very large datasets.

### Tools for Clustering

1. **Scikit-Learn (Python)**
   - **Description**: A popular machine learning library that provides various clustering algorithms including K-Means, DBSCAN, and Hierarchical Clustering.
   - **Pros**: Comprehensive, easy-to-use, and well-documented. Can easily create a python script and feed it data.

## Proposed changes to the database schema:

- Introducing a `last_modified` field in the issues table in order to keep track of issues that have been clustered.
- Introducing a `cluster_id` field in the issues table in order to associate an issue to a cluster easily.
- Possibly creating a new clusters table in order to keep track of those cluster_id's and manage them. Number of issues in the cluster could be a field.
