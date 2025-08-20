class PimPages {

    elements = {
        pimTab: () => cy.contains('span.oxd-main-menu-item--name', 'PIM'),
        empList: () => cy.get("div[role='row'] > div:nth-child(2)"),
        addBtn: () => cy.contains('button', 'Add'),
        inputId: () => cy.get('input.oxd-input.oxd-input--active'),
        errorMsg: () => cy.get('span.oxd-input-field-error-message'),
        employeeListTab: () => cy.contains('Employee List'),
        sortingButton: () => cy.get('i.oxd-icon.bi-sort-alpha-down.oxd-icon-button__icon.oxd-table-header-sort-icon'),
        assendingBtn: () => cy.get('li.oxd-table-header-sort-dropdown-item').eq(0),
    }

    // Test Case 8
    /**
* Navigates to the PIM section and returns a trimmed list of employee IDs.
*/
    employeeListCheck() {
        // Navigate to PIM Page
        this.elements.pimTab().should('be.visible').click();
        // Click on Employee List Tab   
        this.elements.employeeListTab().should('be.visible').click();
    }

    empListSearch() {
      // Navigate to PIM > Employee List
        this.elements.pimTab().should('be.visible').click();
        this.elements.employeeListTab().should('be.visible').click();

        //Extract a valid numeric employee ID
        return cy.get('.oxd-table-body .oxd-table-row')
            .find('div.oxd-table-cell')
            .then(($cells) => {
            let foundID = null;


            // Loop to find numeric ID
            $cells.each((i, el) => {
                const text = Cypress.$(el).text().trim();
                if (/^\d+$/.test(text)) {
                foundID = text;
                return false; // exit loop
                }
            });

        // Validate we found an ID
        expect(foundID, 'Found numeric Employee ID').to.not.be.null;

        return cy.wrap(null).then(() => {
            // Search using the found ID
            cy.contains('label', 'Employee Id')
            .parents('.oxd-input-group') // use correct wrapper if needed
            .find('input.oxd-input')
            .should('be.visible')
            .clear()
            .type(foundID);

            cy.get('button').contains('Search').click();

            return foundID;
        });
        });
    }


    // Test Case 9
    /**
* Captures an Employee ID from the list, searches for it,
* and returns the ID for validation.
*
* @returns The trimmed Employee ID string.
*/
    searchEmployeeById(empId) {
        // Type in the ID field
        cy.contains('label', 'Employee Id')
            .parents('.oxd-input-group') // adjust if needed
            .find('input.oxd-input')
            .should('be.visible')
            .clear()
            .type(empId);

        // Click Search
        cy.get('button').contains('Search').click();
    }

    // Test Case 13
    /**
 * Attempts to create a new employee using an existing Employee ID
 * and returns the validation error message shown.
 *
 * @returns The error message string shown below the Employee ID input.
 */
    getEmpIdError() {
        // Click the PIM tab
        this.elements.pimTab().should('be.visible').click();
        cy.wait(3500); // Wait for PIM page to load

        // Get the second employee's ID from the list
        return this.elements.empList().eq(1).invoke('text').then((empId) => {
            // Click the "Add" button
            this.elements.addBtn().should('be.visible').click();
            cy.wait(1000); // Wait for form to render

            // Fill the duplicate Employee ID into the second input field
            this.elements.inputId().eq(4).should('be.visible').clear().type(empId);
            cy.wait(1000); // Wait for validation message

            // Return the error message text
            return this.elements.errorMsg().invoke('text');
        });
    }

}

export default PimPages;