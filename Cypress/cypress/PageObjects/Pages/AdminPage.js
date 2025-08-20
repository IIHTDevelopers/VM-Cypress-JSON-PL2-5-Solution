class AdminPage {
  elements = {
    moreButton: () => cy.get('.oxd-topbar-body-nav-tab-item').contains('More'),
    corporateBrandingLink: () => cy.get('li.oxd-topbar-body-nav-tab').contains('Corporate Branding'),
    primaryColourTab: () => cy.get('label.oxd-label.oxd-input-field-required').should('contain.text', 'Primary Color'),
    publishButton: () => cy.get('button.oxd-button.oxd-button--medium.oxd-button--secondary').contains('Publish'),
    colourPicker: () => cy.get('div.oxd-color-input-preview').eq(0).should('be.visible'),
    configurationLink: () => cy.get('li.oxd-topbar-body-nav-tab').contains('Configuration'),
    languageSaveButton: () => cy.get('button.oxd-button.oxd-button--medium.oxd-button--secondary.orangehrm-left-space').contains('Save'),
    adminTab: () => cy.contains("span.oxd-main-menu-item--name", "Admin"),
    configTab: () => cy.contains("span", "Configuration"),
    colorPreview: () => cy.get("div.oxd-color-input-preview").eq(0),
    crpTab: () => cy.contains('a', 'Corporate Branding'),
    resetBtn: () => cy.contains('button', 'Reset to Default'),
    downloadBtn: () => cy.get("i.oxd-icon.bi-download"),
    languagePackagesLink: () => cy.contains("a", "Language Packages"),
    editButton: () => cy.get("i.bi-pencil-fill").first(),
    editFormContainer: () => cy.get("h6.oxd-text.oxd-text--h6.orangehrm-main-title"),
    sortButton: () => cy.get("div.oxd-table-header-cell").contains("Username"),
    userTable: () => cy.get(".oxd-table"),
    userRows: () => cy.get(".oxd-table-cell:nth-child(2)"),
    helpButton: () => cy.get("i.oxd-icon.bi-question-lg"), // Corrected the locator
    userRoleDropdown: () => cy.get("label").contains("User Role").parents(".oxd-input-group").find(".oxd-select-text"),
    userRoleOption: (role) => cy.get(".oxd-select-dropdown").contains(role),
    adminSubtab: () => cy.contains('a', 'Nationalities'),
    searchButton: () => cy.get("button").contains("Search"),
    userRoleCells: () => cy.get(".oxd-table-cell:nth-child(3)"), // Assuming 3rd column is Role
    addAdminButton: () => cy.get("button.oxd-button.oxd-button--medium.oxd-button--secondary").contains("Add"),
    statusDropdown: () => cy.get('label:contains("Status")').parents(".oxd-input-group").find(".oxd-select-text-input"),
    statusOption: (status) => cy.get(".oxd-select-dropdown").contains(status),
    usernameInput: () => cy.get('label:contains("Username")').parents(".oxd-input-group").find("input"),
    passwordInput: () => cy.get('label:contains("Password")').parents(".oxd-input-group").find('input[type="password"]').first(),
    confirmPasswordInput: () => cy.get('label:contains("Confirm Password")').parents(".oxd-input-group").find('input[type="password"]'),
    saveButton: () => cy.get('button[type="submit"]').contains("Save"),
    userRoleSortIcon: () => cy.contains("div.oxd-table-header-cell", "User Role").find("i.oxd-icon-button__icon.oxd-table-header-sort-icon"),
    deleteIcon: () => cy.get("i.oxd-icon.bi-trash").eq(1),
    confirmDeleteBtn: () => cy.get(".oxd-button--label-danger").contains("Yes, Delete"),
    usernameCell: () => cy.get(".oxd-table-body .oxd-table-row").eq(1).find(".oxd-table-cell").eq(1),
  };

    // Test Case 1
    /**
 * Searches for a given admin username in the Admin section.
 *
 * @param admin - Username to search for.
 * @returns List of usernames from the second column of the result table.
 */
  searchAdminUsersByRole() {
    this.elements.adminTab().click();
    this.elements.userRoleDropdown().click();
    this.elements.userRoleOption("Admin").should("be.visible").click();
    this.elements.searchButton().click();
    cy.wait(1000);
  }

  // Test Case 10
     /**
 * Updates the primary corporate branding color and returns the style attribute for validation.
 */
  changePrimaryColour(primaryColour) {
    this.elements.adminTab().should('be.visible').click();
    cy.get('.oxd-topbar-header-breadcrumb > .oxd-text').should('contain.text', 'Admin');
    cy.wait(1000); // Wait for dropdown to appear
    this.elements.corporateBrandingLink().should('be.visible').click();
    cy.wait(1000)
    this.elements.primaryColourTab().should('be.visible');
    // Click on Primary Colour input
    this.elements.colourPicker().click();

    // Clear the input and type the new colour
    cy.get('input.oxd-input.oxd-input--active')
      .eq(1)
      .should('be.visible')
      .clear()
      .type(primaryColour, { delay: 100, force: true });

    // Click on Publish button
    this.elements.publishButton().should('be.visible').click();
  }

  // Test Case 11
  /**
 * Downloads a language package from the Admin > Configuration > Language section.
 *
 * @returns The name of the downloaded file.
 */
  downloadLanguageModule() {
    // Navigate to the Admin section
    this.elements.adminTab().should("be.visible").click();
    cy.wait(2000);  // Wait for the page to load

    // Open Configuration tab and Language settings
    this.elements.configTab().should("be.visible").click();
    this.elements.languagePackagesLink().should("be.visible").click();
    cy.wait(3000);  // Wait for content to load

    // Trigger the file download
    this.elements.downloadBtn().should("be.visible").eq(1).click();
    //cy.get(this.downloadBtn).eq(1).click(); // Click on the second download button

    // Get the suggested filename (using a stub or interception could help in getting the filename)
    const fileName = "i18n-zh_Hant_TW.xlf";  // Replace with actual dynamic filename retrieval if possible

    return cy.wrap(fileName); // Return the file name for validation
  }


  // passwordMismatchError() {
  //   // Taking Data for Form using JSONFixtures
  //   cy.fixture("Data/AddUserForm").then((data) => {
  //     this.elements.adminTab().should("be.visible").click();
  //     this.elements.addAdminButton().should("be.visible").click();
  //     cy.wait(2000);

  //     //Selection from userdropdown
  //     this.elements.userRoleDropdown().click();
  //     this.elements.userRoleOption(data.role).click();
  //     // Get input Placeholders
  //     cy.get('input[placeholder="Type for hints..."]').type("A", {
  //       force: true,
  //     });

  //     // Using dropdown
  //     cy.get(".oxd-autocomplete-dropdown")
  //       .should("be.visible") // wait for dropdown
  //       .find('div[role="option"] span') // target list items
  //       .first()
  //       .click({ force: true }); // click first result

  //     // Select Status
  //     this.elements.statusDropdown().click({ force: true });

  //     this.elements.statusOption(data.status).click({ force: true });

  //     cy.wait(500);
  //     this.elements.usernameInput().type(`${data.username}_${Date.now()}`);

  //     cy.wait(500);
  //     this.elements.passwordInput().type(data.password);

  //     cy.wait(1000);
  //     // typing Wrong Password For Mismatching
  //     this.elements.confirmPasswordInput().type(data.confirmPasswordWrong);

  //     // this.elements.saveButton().click({ force: true });
  //   });
  // }

  // addAdminUserForm() {
  //   cy.fixture("Data/AddUserForm").then((data) => {
  //     cy.wait(2000);
  //     cy.log("Role:", data.role); // Log value
  //     expect(data.role).to.exist; // Optional safety check
  //     // Navigate to Admin tab and click Add
  //     this.elements.adminTab().should("be.visible").click();
  //     cy.wait(2000);

  //     this.elements.addAdminButton().should("be.visible").click();

  //     this.elements.userRoleDropdown().click();
  //     cy.wait(2000);

  //     this.elements.userRoleOption(data.role).click();

  //     cy.get('input[placeholder="Type for hints..."]').type("A", {
  //       force: true,
  //     });
  //     cy.wait(2000);

  //     cy.get(".oxd-autocomplete-dropdown")
  //       .should("be.visible") // wait for dropdown
  //       .find('div[role="option"] span') // target list items
  //       .first()
  //       .click({ force: true }); // click first result

  //     // Select Status
  //     this.elements.statusDropdown().click({ force: true });
  //     cy.wait(2000);

  //     this.elements.statusOption(data.status).click({ force: true });

  //     this.elements.usernameInput().type(`${data.username}_${Date.now()}`);
  //     cy.wait(2000);

  //     this.elements.passwordInput().type(data.password);
  //     this.elements.confirmPasswordInput().type(data.confirmPassword);

  //     // Submit the form
  //     this.elements.saveButton().should("be.visible").click();
  //   });
  // }

  // deleteUserFromTable() {
  //   this.elements.adminTab().click();
  //   cy.wait(1000);

  //   // Click the sort icon to sort by User Role descending
  //   this.elements.userRoleSortIcon().click({ force: true });
  //   cy.wait(1500); // Allow table to update

  //   cy.get("div.oxd-table-header-sort-dropdown").should("be.visible");

  //   // Step 3: Click the "Descending" option inside it
  //   cy.get("div.oxd-table-header-sort-dropdown")
  //     .contains("span.oxd-text--span", "Descending")
  //     .click({ force: true });

  //   // Capture username of the first row
  //   this.elements
  //     .usernameCell()
  //     .invoke("text")
  //     .then((username) => {
  //       cy.wrap(username.trim()).as("deletedUsername");
  //     });

  //   // Delete the user
  //   this.elements.deleteIcon().click({ force: true });
  //   this.elements.confirmDeleteBtn().click({ force: true });
  // }



  // getHelpCheck() {
  //   // Navigate to Admin Page
  //   this.elements.adminTab().should('be.visible').click();
  //   cy.wait(1000);

  //   // Click on Help Button
  //   this.elements.helpButton().should('be.visible').click();
  // }

  // Test Case 12
  /**
 * Navigates to the Admin section and retrieves the class name
 * of the "Nationalities" subtab after interaction.
 *
 * @returns The value of the class attribute for the subtab element.
 */
  hoverAdmin() {
    // Navigate to Admin Page
    this.elements.adminTab().should('be.visible').click();
    cy.wait(1000);

    this.elements.adminSubtab().should('be.visible').click();
    cy.wait(1000);

    // Hover over the "Nationalities" element and capture the class
    return cy.contains('a', 'Nationalities')  // Find the "Nationalities" link (Adjust the selector if necessary)
      .parent('li')  // Get the parent `li` element of the "Nationalities" link
      .trigger('mouseover')  // Simulate hover over the element
      .should('have.class', 'oxd-topbar-body-nav-tab')  // Validate if the class is as expected after hover
      .then(($el) => {
        // Return the class of the element after hover (use `.prop('class')` to get the class attribute)
        return $el.prop('class');
      });
  }

  // Test Case 14
  /**
 * Navigates to the Corporate Branding tab and resets the theme colors to default.
 *
 * @returns The inline style attribute value of the color preview box.
 */
  resetColor() {
    // Click Admin link (first one)
    this.elements.adminTab().eq(0).should('be.visible').click();
    cy.wait(2000);

    // Click the Corporate Branding tab
    this.elements.crpTab().should('be.visible').click();

    // Click the Reset to Default button
    this.elements.resetBtn().should('be.visible').click();
    cy.wait(3000); // wait for the reset to take effect

    // Return the style attribute of the color preview element
    return this.elements.colorPreview()
      .should('have.attr', 'style')
      .then((style) => style);
  }
}
export default AdminPage;
