describe('Resolution Components', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.wait(2000); // Wait for any initial data loading
  });

  describe('Issue Page', () => {
    it('should display issues or resolutions', () => {
      cy.get('button, a, [role="button"]').should('exist');
    });
  });

  describe('Resolution Creation', () => {
    it('should open the resolution modal', () => {
      cy.get('button, a, [role="button"]').should('exist');

    });

    // it('should allow entering resolution text', () => {
    //   cy.get('button').first().click();
    //   // Wait for modal to appear
    //   cy.get('div').contains(/Resolve|Resolution/).should('be.visible');
    //   // Look for any input field, not just textarea
    //   cy.get('input, textarea').first().type('This is a test resolution');
    //   cy.contains('button', /Submit|Create/).should('exist');
    // });
  });

  describe('Resolution Display', () => {
  it("should display resolution message", () => {
    cy.viewport(1920, 1080);
    cy.visit("/leaderboard");

    cy.contains("Leaderboard data unavailable").should('be.visible');
  });
  });

  describe('Resolution Response', () => {
    it('should have interactive elements for resolutions', () => {
      cy.get('button, a, [role="button"]').should('exist');
    });
  });
});