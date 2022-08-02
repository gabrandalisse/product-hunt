describe("Unit tests for the login page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/login");
  });
  
  it("should display the expected elements", () => {
    cy.get("h1").contains("Log In");

    cy.get("label").contains("Email");
    cy.get("#email").should("have.attr", "placeholder", "Your Email");

    cy.get("label").contains("Password");
    cy.get("#password").should("have.attr", "placeholder", "Your Password");
  });

  it("should redirect to index after successfully login", () => {
    cy.get("#email").type("user@user.com");
    cy.get("#password").type("1234567");

    cy.get("input[type=submit]").click();

    cy.url().should("include", "/");
  });

  it('should show an error when the email is invalid', () => {
    cy.get("#email").type('invalid-email');
    cy.get("input[type=submit]").click();
    cy.get('p').contains('Invalid email.');
  });

  it('should show an error when the email is missing', () => {
    cy.get("input[type=submit]").click();
    cy.get('p').contains('The email is required.');
  });

  it('should show an error when the password is missing', () => {
    cy.get("#email").type('test@test.com');
    cy.get("input[type=submit]").click();
    cy.get('p').contains('The password is required.');
  });

  it('should show an error when the password is invalid', () => {
    cy.get("#email").type('test@test.com');
    cy.get("#password").type("123");
    cy.get("input[type=submit]").click();
    cy.get('p').contains('The password must contain at least 6 characters.');
  });
});
