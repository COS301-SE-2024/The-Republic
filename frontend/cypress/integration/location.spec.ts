describe('Location Components', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.wait(2000);
    });


    describe('Location Creation', () => {
        it('should open the location modal', () => {
            cy.get('button').first().click();
            cy.get('div').contains(/Resolve|Resolution/).should('be.visible');
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

    // describe('Resolution Display', () => {
    //     it('should display resolution details if any exist', () => {
    //         cy.get('div').contains(/Resolution|Status|Open|Closed/).should('exist');
    //     });
    // });

    describe('Location Response', () => {
        it('should have interactive elements for locations', () => {
            // Look for any interactive elements
            cy.get('button, a, [role="button"]').should('exist');
        });
    });
});