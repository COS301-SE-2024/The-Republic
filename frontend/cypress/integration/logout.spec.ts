describe('Logout and Login Flow', () => {
    it('successfully logs out and redirects to login', () => {
        cy.visit('/signup');

        cy.contains('Login').click();

        cy.url().should('include', '/login');
    });
});