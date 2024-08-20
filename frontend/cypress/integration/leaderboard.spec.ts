describe("Leaderboard", () => {
  it("should display a message if no leaderboard data is available", () => {
    cy.viewport(1920, 1080);
    cy.visit("/leaderboard");

    cy.contains("Leaderboard data unavailable").should('be.visible');
  });
});
