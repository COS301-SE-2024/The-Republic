<div>
    <img src="../images/gifs/ArchitecturalRequirements.gif" alt="Gif" style="width: 1584px; height: 396px;"/>
</div>

# Architectural Specification

## Contents

- Introduction
- Design Strategy
- Quality Requirements
- Data Flow
- Technology Stack
- Performance Considerations
- Scalability Strategies
- Security Measures
- Conclusion

# Introduction

The Republic is a platform aimed at revolutionizing citizen engagement with government services. This document outlines the architectural design of The Republic project, focusing on the system's performance, scalability, reliability, security, maintainability, and usability while facilitating future evolution from a monolithic to a microservice architecture.

# Design Strategy 📃

## Alignment with Business Requirements:

The architectural decisions and identification of quality requirements were made to directly align with the core business requirements of The Republic project. The functional requirements and user stories outline the need for a platform that allows citizens to report governmental service delivery issues and visualize the aggregated data. To meet these business needs effectively, the architectural choices and prioritized quality requirements were carefully selected.

Furthermore, the prioritization of quality requirements such as performance, reliability, scalability, security, and usability directly addresses the business need for a robust, responsive, and user-friendly platform capable of handling a large user base. By ensuring high performance, reliability, and scalability, the system can effectively serve the intended audience of the general public, facilitating seamless reporting of service delivery issues and providing insightful visualizations.
The emphasis on security and usability aligns with the business requirement of fostering trust and encouraging widespread adoption among citizens. A secure platform that protects user data and provides an intuitive user experience will be crucial for the project's success and sustained utilization.

## User-Centric Design:

As the platform targets the general public, including individuals from diverse backgrounds and demographics, addressing their requirements is important. Key considerations include:

- **Intuitive User Experience:** Prioritizing usability ensures that the platform is easy to navigate and interact with, regardless of the user's technical proficiency or ability. This aligns with the quality requirement of delivering a user-friendly experience that encourages widespread adoption.
- **Accurate and Relevant Information:** By emphasizing reliability and performance, the platform can provide citizens with accurate and up-to-date visualizations and insights into governmental service delivery. This transparency and information accuracy foster trust and enable informed decision-making.
- **Consistent Availability:** Aligning with the reliability quality requirement, the system must remain consistently accessible and operational, especially during critical situations when citizens need to report service delivery issues promptly.
- **Responsive Interactions:** Focusing on performance ensures that the platform responds swiftly to user inputs, queries, and interactions, providing a seamless and efficient experience that meets citizens' expectations for responsiveness.

This user-centric approach not only enhances the overall experience but also increases the likelihood of sustained engagement and utilization, aligning with the overarching business objectives of the project.

## Facilitates Long-term Maintenance:

By prioritizing aspects such as modularity, code quality, and comprehensive documentation, the system can be effectively maintained and evolved over time. Specific considerations include:

- **Modular Design:** Structuring the application into independent, self-contained modules or components promotes maintainability. This modular approach simplifies the process of updating, replacing, or extending specific functionalities without compromising the entire system's integrity.
- **Robust Coding Practices:** Adherence to industry-standard coding conventions, rigorous code reviews, and automated testing frameworks contribute to a high-quality, maintainable codebase. This proactive approach minimizes technical debt and facilitates efficient identification and resolution of issues.
- **Comprehensive Documentation:** Maintaining detailed and up-to-date documentation not only aids in knowledge transfer among development teams but also serves as a valuable resource for future maintenance and enhancement efforts. Well-documented code, architecture, and processes ensure smoother transitions and minimize the risk of disruptions.

While strategies like decomposition and test case generation are undoubtedly valuable and will be employed throughout the project lifecycle, the primary architectural design strategy centers on addressing key quality requirements.

# Quality Requirements 📋

The following Quality Requirements have been identified by the team and the client. They are listed in order of importance and discussed in some detail below.

- **1. Performance**
- **2. Reliability**
- **3. Scalability**
- **4. Security**
- **5. Maintainability**
- **6. Usability**

## Performance 🚀

Performance requirements ensure that the system can handle a high volume of users and interactions without significant latency. The system must maintain high speed and responsiveness even under load.

- **Caching:** Implementing caching strategies at multiple levels to reduce load times and improve response speeds. Frequently accessed data is cached to minimize database queries.
- **Load Balancing:** Using load balancers to distribute incoming traffic evenly across multiple servers. This ensures that no single server becomes a bottleneck, maintaining system performance even during peak usage.
- **Optimized Queries:** Database queries are optimized to handle large volumes of data efficiently. Indexing and query optimization techniques are employed to ensure quick data retrieval.

| Stimulus Source                                               | Stimulus                                                                | Response                                                                                                                                            | Response Measure                                                                                                               | Environment                           | Artifact                                   |
| ------------------------------------------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------- | ------------------------------------------ |
| High number of concurrent users / High volume of interactions | User actions like creating posts, uploading media, and filtering posts. | - Implement caching strategies.<br> - Use load balancers to distribute traffic.<br> - Optimize database queries.<br> - Monitor performance metrics. | - Average response time under load (e.g., <200ms).<br> - System handles peak load without significant performance degradation. | High user activity / Peak usage times | User interaction points, database queries. |

## Reliability 🛡️

Reliability ensures that the system is available and functional when users need it. Users should be able to perform critical tasks like creating accounts, posting, or resetting passwords without issues.

- **Redundancy:** Critical components must have redundant systems in place to handle failures gracefully. This includes redundant servers, databases, and network connections.
- **Backups:** Regular backups of all critical data ensure that data can be restored quickly in case of a failure, minimizing downtime and data loss.

| Stimulus Source              | Stimulus                                                     | Response                                                                                                                                                                   | Response Measure                                                                                                                                                                                   | Environment                                    | Artifact                                               |
| ---------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------ |
| System demand/ User Activity | User attempts to create accounts, log in, or reset passwords | - The system should have high uptime and minimal downtime. <br> - Implement redundancy to handle failures gracefully. <br> - Perform regular backups to prevent data loss. | - System uptime percentage (99.9%).<br> - Successful completion of critical user actions (account creation success rate above 99%).<br> - Minimal downtime incidents (less than 1 hour per month). | System operating normally / During maintenance | User authentication and account management components. |

## Scalability 📈

The system is built to scale efficiently to handle growth in users, data, and complexity.

- **Microservices Architecture:** Although currently using a monolithic design, the system is planned to transition to a microservices architecture. This will allow different functionalities to be managed independently and scaled as needed.
- **Horizontal Scaling:** Services are designed to scale horizontally by adding more instances to handle increased load, ensuring that performance remains stable as the user base grows.
- **Database Partitioning:** Employing database partitioning and sharding to manage data growth efficiently. This ensures that large datasets are handled effectively without degrading performance.

| Stimulus Source                          | Stimulus                               | Response                                                                                                                            | Response Measure                                                                                                                  | Environment                                | Artifact                                                      |
| ---------------------------------------- | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ | ------------------------------------------------------------- |
| Increasing number of users / Data growth | Addition of new users, posts, and data | - Design for horizontal scaling.<br> - Plan transition to microservices architecture.<br> - Use database partitioning and sharding. | - Stable performance with growing user base.<br> - Efficient data handling.<br> - Seamless addition of new services and features. | Growing user base / Increasing data volume | Core functionalities like post management and data analytics. |

## Security 🔒

The system addresses the crucial attribute of security with a comprehensive, layered approach to protect sensitive data and ensure secure user interactions.

- **Entry Point Validation:** At the initial entry point, all incoming requests are validated and sanitized to defend against malformed or malicious data. This serves as the first line of defense, preventing potentially harmful requests from reaching deeper layers of the system.
- **API Gateway:** Acting as the main entry point to the system, the API Gateway further screens and filters incoming requests. It uses token-based middleware to manage sessions securely. This middleware ensures that only authorized users with valid session tokens can access the system, thereby preventing unauthorized access.
- **Service-Level Security:** Within the system, individual services such as User Management enforce strict access controls. Only users with the correct permissions can access or modify sensitive information. For example, the User Management service uses a dedicated PostgreSQL database with role-based access control to ensure that sensitive user data is protected.
- **Data Storage Security:** The system ensures that sensitive information is masked, and access is restricted to read-only where appropriate, thus maintaining data integrity and confidentiality. Additionally, compliance with data protection regulations, such as the POPI Act, is ensured by implementing necessary data masking and encryption protocols.

| Stimulus Source                       | Stimulus                                                          | Response                                                                                                                                                                                  | Response Measure                                                                                                                                               | Environment             | Artifact                                                    |
| ------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | ----------------------------------------------------------- |
| Malicious actors / Unauthorized users | Attempts to access sensitive data or perform unauthorized actions | - Validate and sanitize incoming requests.<br> - Use token-based middleware for session management.<br> - Implement role-based access control.<br> - Encrypt data at rest and in transit. | - Unauthorized access attempts identified and flagged.<br> - Only authorized users access sensitive data.<br> - No unauthorized modifications to the database. | System running normally | API endpoints, data access layers, user management service. |

## Mainatainability 🔧

Maintainability ensures that the system can be easily updated and improved over time.

- **Modular Code:** Writing clean, modular code to simplify updates and enhancements. Each module can be developed, tested, and maintained independently.
- **Documentation:** Comprehensive and up-to-date documentation is maintained for developers and users, ensuring that the system is easy to understand and modify.
- **CI/CD Practices:** Implementing continuous integration and continuous deployment (CI/CD) practices to streamline development and deployment processes. This allows for frequent updates and quick delivery of new features.

| Stimulus Source                         | Stimulus                                                    | Response                                                                                                  | Response Measure                                                                                                                             | Environment                           | Artifact                                          |
| --------------------------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- | ------------------------------------------------- |
| Need for updates / New feature requests | Introduction of new features, bug fixes, and system updates | - Write clean, modular code.<br> - Maintain comprehensive documentation.<br> - Implement CI/CD practices. | - Time taken to implement updates and new features.<br> - Ease of identifying and fixing issues.<br> - Minimal disruption during deployment. | Ongoing development / Regular updates | Codebase, documentation, and deployment pipeline. |

## Usability 🖐️

Usability ensures that the system is easy to use and provides a good user experience for users of all backgrounds.

- **Intuitive UI/UX:** Designing interfaces that are intuitive and easy to navigate. Users can perform necessary actions effortlessly, even without prior training.

| Stimulus Source             | Stimulus                                     | Response                                                                                                | Response Measure                                                                             | Environment  | Artifact                                       |
| --------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------ | ---------------------------------------------- |
| User interaction / Feedback | User attempts to navigate and use the system | - Design intuitive and accessible user interfaces.<br> - Provide clear instructions and help resources. | - Number of usability-related issues reported.<br> - Time taken for users to complete tasks. | Normal usage | User interface and user experience components. |

# Architectural Constraints ⚠️

## Monolithic Architecture Transition

The system is initially designed using a monolithic architecture with plans to transition to a microservices architecture in the future to enhance scalability and maintainability.

## Deployment Model

- The system must not follow a serverless model and should not be cloud-native.
- It must be able to run on one or more Linux virtual machines (VMs).

## Library and Service Restrictions

All libraries and services used within the system must be open source to ensure transparency, security, and cost-efficiency.

## Database Requirement

The system uses PostgreSQL as the primary database due to its robustness, scalability, and support for complex queries and transactions.

## Compliance with POPIA

The system must comply with the Protection of Personal Information Act (POPIA) in South Africa, necessitating secure handling of personal data and stringent access controls.

[Back](./../README.md)<br>
[Back to main](/README.md)

---
