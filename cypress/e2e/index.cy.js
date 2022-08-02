describe('Unit tests for index page', () => {
    beforeEach(() => {
        cy.visit("http://localhost:3000/");
    })

    it('should show the header elements correctly when the user is not logged in', () => {
        cy.get('a').contains('P');
        cy.get('input').should('have.attr', 'placeholder', 'Search Products');

        cy.get('a').contains('Home');
        cy.get('a').contains('Trendings');
        cy.get('a').contains('New Product').should('not.exist');
        
        cy.get('a').contains('Log Out').should('not.exist');
        cy.get('a').contains('Log In');
        cy.get('a').contains('Create Account');
    });
});