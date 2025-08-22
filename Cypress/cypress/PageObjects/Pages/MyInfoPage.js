
const filePath = 'sample_upload.pdf'; // relative to cypress/fixtures folder

class MyInfoPage {
    elements = {
        myInfo: () => cy.contains('span.oxd-main-menu-item--name', 'My Info'),
        contactBtn: () => cy.contains('a', 'Contact Details'),
        addFile: () => cy.contains('button', 'Add'),
        textInput: () => cy.get("textarea[placeholder='Type comment here']"),
        fileInput: () => cy.get('input[type="file"]'),
        saveBtn: () => cy.contains('button', 'Save'),
        uploadedComments: (comment) => cy.xpath(`//div[text()='${comment}']`),
        addAttachmentButton: () => cy.contains('h6', 'Attachments').parents('[class*=orangehrm-action-header]').find('button'),
        saveButton: () => cy.get('button.oxd-button.oxd-button--medium.oxd-button--secondary.orangehrm-left-space').eq(1),
        contactDetailsTab: () => cy.contains('a.orangehrm-tabs-item', 'Contact Details'),
        addDependentButton: () => cy.contains('h6', 'Assigned Dependents').parents('[class*=orangehrm-action-header]').find('button'),
        relationDropdown: () => cy.get('label').contains('Relationship').parents('.oxd-grid-item').find('.oxd-select-text'),
    };

    /**
     * Uploads an attachment with a given comment in the My Info > Contact Details section.
     * @param {string} comnt - Unique comment to associate with the uploaded file.
     * @returns {Promise<string[]>} - List of text matching the uploaded comments.
     */
    // Test Case 15
    uploadDependentPDF(fileName) {

        this.elements.myInfo().click();
        cy.wait(2000);

        this.elements.contactDetailsTab().click();
        cy.wait(2000);

        this.elements.addAttachmentButton().click();
        cy.wait(2000);

        cy.get('input[type="file"].oxd-file-input')
            .should('exist')
            .selectFile(`cypress/fixtures/${fileName}`, { force: true });


        // SAve the detail 
        this.elements.saveButton().click();

    }
}

export default MyInfoPage;
