describe('Login Flow', () => {
    it('should display an error message with invalid credentials', () => {
        cy.viewport(1920, 1080);
        cy.visit('/login');
        cy.get('input[id="email"]').type('invalid@domain.com');
        cy.get('input[id="password"]').type('wrongpassword');
        cy.get('button[type="submit"]').click();
        cy.contains('Failed to sign in, please try again').should('be.visible');
    });
});
  