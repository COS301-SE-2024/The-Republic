# Coding Standards

Maintaining high coding standards is crucial for the success of The Republic project. This document provides guidelines and best practices to ensure a clean, readable, and maintainable codebase.

## General Guidelines

### Indentation and Formatting
- Use 4 spaces for indentation to enhance code structure and readability.

### Single Statement per Line
- Each statement should be on a separate line for clarity and readability.

## Naming Conventions

### Variables:
- Use camel case for variable names.
  - Start with a lowercase letter and capitalize subsequent words.
  - Example: `firstName`, `lastName`
- Use snake case for constants.
  - Start with a lowercase letter and use underscores to separate words.
  - Example: `first_name`, `last_name`

```typescript
// Variables
let firstName: string = "John";
const LAST_NAME: string = "Doe";
```

### Functions:
- Use camel case for function names.
  - Start with a lowercase letter and capitalize subsequent words.
  - Example: `getUserName`, `setUserPassword`
- Functions should have descriptive names.

```typescript
// Functions
function getUserName(userId: number): string {
    // Function logic
    return "username";
}

function setUserPassword(userId: number, newPassword: string): void {
    // Function logic
}
```

### Files:
- Use snake case or Pascal case for file names.
  - Snake case: start with a lowercase letter and use underscores.
    - Example: `first_name`, `last_name`
  - Pascal case: start with a capital letter and capitalize all words.
    - Example: `FirstName`, `LastName`

```typescript
// File Names
// Example of a Pascal case file name
import { MyClass } from './MyClass';

// Example of a snake case file name
import { my_utility_function } from './my_utility_function';
```

## Code Structure

### Comments
- Add comments for function descriptions and complex code explanations.
- Use `//` for single-line comments and `/* */` for multi-line comments.

## Error Handling
- Raise errors early in the code.
- Restore state and resources after handling errors.
- Provide meaningful error messages for better understanding.

```typescript
// Example of a function with comments
/**
 * Retrieves the username based on the user ID.
 * @param userId The ID of the user.
 * @returns The username corresponding to the user ID.
 */
function getUserName(userId: number): string {
    // Function logic
    return "username";
}

// Example of error handling
try {
    // Code that might throw an error
    if (condition) {
        throw new Error("Error message");
    }
} catch (error) {
    // Handle the error
    console.error(error.message);
}
```


## Testing Standards

### Types of Tests

**Unit Testing:**
- Test individual components, functions, and utilities in isolation.
- Use Jest for unit testing.
- Each test should have the same name as the component being tested.

**Integration Testing:**
- Test interactions between different components or modules.
- Use Cypress for integration testing.

**End-to-End Testing:**
- Test the entire application from the user's perspective.
- Use Cypress for end-to-end testing.

### Code Coverage
- Aim for 80% or higher code coverage for critical components.
- Measure code coverage using Jest.

```typescript
// Example of a unit test using Jest
describe('getUserName function', () => {
    it('should return the username', () => {
        const username = getUserName(1);
        expect(username).toEqual('username');
    });
});

// Example of a Cypress test
describe('Login Functionality', () => {
    it('should log in successfully', () => {
        cy.visit('/login');
        cy.get('#username').type('username');
        cy.get('#password').type('password');
        cy.get('#login-button').click();
        cy.url().should('include', '/dashboard');
    });
});
```

## Version Control Practices

### Git Flow
- Use the Git Flow branching strategy for parallel development.
  - Branches: Master, Development, Feature, Documentation.

### Git Branch Naming Conventions
- Descriptive, concise, and reflective of the work in the branch.
- Lowercase and hyphen-separated.
- Alphanumeric characters with no continuous hyphens.
- Example Names:
    - `master`
    - `development` or `develop`
    - `feature/testing` or `feature/bugfixes`
    - `hotfix/test` or `hotfix/bugfix`

### Review Process
- Features based on the development branch.
- Automated checks for linting and unit tests.
- Manual review by testers.

### CI/CD
- Use ESLint for code quality and consistency.
  - Custom rules aligned with coding standards.
- Automated checks and manual review for compliance.

These coding standards serve as a roadmap for maintaining consistency and quality throughout the development lifecycle of The Republic project.

[Back to Full Documentation](./../README.md)
