describe('Logout and Login Flow', () => {
    it('successfully logs out and redirects to login', () => {
        cy.visit('/');
    
        cy.contains('Sign Up').click();

        cy.url().should('include', '/signup');

        cy.contains('Login').click();

        cy.url().should('include', '/login');
    });
});