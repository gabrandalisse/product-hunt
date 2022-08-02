describe("Unit tests for create-account page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/create-account");
  });

  it("should display the expected elements", () => {
    cy.get("h1").contains("Create Account");

    cy.get("label").contains("Name");
    cy.get("#name").should("have.attr", "placeholder", "Your Name");

    cy.get("label").contains("Email");
    cy.get("#email").should("have.attr", "placeholder", "Your Email");

    cy.get("label").contains("Password");
    cy.get("#password").should("have.attr", "placeholder", "Your Password");
  });

  it("should redirect into the index page when the account is created successfully", () => {
    cy.get("#name").type("Test Name");
    cy.get("#email").type("test@cypress.com");
    cy.get("#password").type("donothackme");

    cy.get("input[type=submit]").click();

    cy.url().should("include", "/");
  });

  it("should show an error when the user click submit button and all inputs are empty", () => {
    cy.get("input[type=submit]").click();
    cy.get("p").contains("The name is required.");
    cy.get("p").contains("The email is required.");
    cy.get("p").contains("The password is required.");
  });

  it('should show an error when the input email is invalid', () => {
    cy.get("#email").type("invalid-email");
    cy.get("input[type=submit]").click();
    cy.get("p").contains("Invalid email.");
  });

  it('shoud show an error when the password have less than six characters', () => {
    cy.get("#password").type("123");
    cy.get("input[type=submit]").click();
    cy.get("p").contains("The password must contain at least 6 characters.");
  });
});
