class LoginPage {
  // Define selectors as class properties
  elements = {
    usernameInput: 'input[name="username"]',
    passwordInput: 'input[name="password"]',
    loginButton: 'button[type="submit"]',
    errorMsg: "//div[contains(text(),'Invalid credentials !')]",
    adminMenu: "//li[@class='dropdown dropdown-user']",
    logoutBtn: "//a[text()=' Log Out ']"
  };

  // Method to perform login using fixture
  performLogin() {
   
    cy.wait(2000);
    cy.navigatingToBaseURL();
    cy.fixture('Data/LoginData').then((credentials) => {
      // cy.visit('/auth/login');
      cy.wait(2000);
      cy.get(this.elements.usernameInput).type(credentials.username);
      cy.get(this.elements.passwordInput).type(credentials.password);
      cy.get(this.elements.loginButton).click();
      // print('Login successful');
      cy.url().should('include', '/dashboard');
    });
  }



  /*
  Test Case 1 : Performing Login Functionality
  */
  performLoginSuccesfull() {
   
    cy.wait(2000);
    cy.navigatingToBaseURL();
    cy.fixture('Data/LoginData').then((credentials) => {
      // cy.visit('/auth/login');
      cy.wait(1000);
      cy.get(this.elements.usernameInput).type(credentials.username);
      cy.get(this.elements.passwordInput).type(credentials.password);
      cy.get(this.elements.loginButton).click();
    });
  }
}


export default LoginPage;
