class BuzzPage {
  elements = {
    buzzTab: () => cy.contains('span.oxd-main-menu-item--name', 'Buzz'),
    sharePhotoButton: () => cy.contains('button', 'Share Photo'),
    imageUploadArea: () => cy.get('div.orangehrm-photo-upload-area').contains('Add Photos'),
    fileInput: () => cy.get('input[type="file"]', { timeout: 10000 }),
    shareButton: () => cy.xpath('//div[@role="dialog" and not(contains(@class,"hide"))]//button[@type="submit"]'),
    shareTextArea: () => cy.get('textarea[placeholder*="What\'s on your mind"]'),
    uploadedImage: () => cy.get('img[src*="uploaded"]'),
    uploadSuccessToast: () => cy.contains('.oxd-toast-content-text', 'Successfully Saved'),
    firstPostContainer: () => cy.get('.orangehrm-buzz-post').first(),
    firstLikeButton: () =>
      cy.get('.orangehrm-buzz-post').first().find('svg#heart-svg'),
    firstLikeCountText: () =>
      cy.get('.orangehrm-buzz-post').first().find('div.orangehrm-buzz-stats').find('p').contains('Like'),
    commentIconOnFirstPost: () =>
      cy.get('i.oxd-icon.bi-chat-text-fill', { timeout: 10000 })
        .first()
        .should('exist')
        .parents('button'),
    commentInput: () =>
      cy.get('input[placeholder="Write your comment..."]', { timeout: 10000 }),
    moreOptionsButton: () =>
      cy.get('i.oxd-icon.bi-three-dots').parents('button'),
    editPostOption: () =>
      cy.contains('li.orangehrm-buzz-post-header-config-item p', 'Edit Post'),
    editTextArea: () =>
      cy.get('.oxd-dialog-container-default textarea.oxd-buzz-post-input').first(),
    postButton: () =>
      cy.get('.oxd-dialog-container-default button[type="submit"]').contains('Post').first(),
    buzzTab: () => cy.contains('span.oxd-main-menu-item--name', 'Buzz'),
    moreOptionsButton: () => cy.get('i.oxd-icon.bi-three-dots').parents('button'),
    deletePostOption: () => cy.contains('li.orangehrm-buzz-post-header-config-item p', 'Delete Post'),
    confirmDeleteBtn: () => cy.get('.oxd-button--label-danger').contains('Yes, Delete'),
  }

  // Test Case 2
    /**
   * Uploads a photo post and returns the success message text.
   */
  postImageWithTimestampText(imageName, postMessage) {

    this.elements.buzzTab().should('be.visible').click();
    cy.url().should('include', '/buzz');

    this.elements.sharePhotoButton().should('be.visible').click();
    // this.elements.imageUploadArea().should('be.visible').click();

    // Wait for input[type="file"] to attach
    cy.waitUntil(() => {
      return cy.document().then(doc => {
        const input = doc.querySelector('input[type="file"]');
        return input && Cypress.dom.isAttached(Cypress.$(input));
      });
    }, {
      timeout: 8000,
      interval: 300,
      errorMsg: 'input[type="file"] never stabilized'
    });

    // Upload image dynamically
    cy.document().then(doc => {
      const input = doc.querySelector('input[type="file"]');
      if (!input) throw new Error('input[type="file"] disappeared before selection');

      cy.wrap(input).selectFile(`cypress/fixtures/Data/${imageName}`, {
        action: 'drag-drop',
        force: true
      });
    });

    // Add timestamped post text
    cy.get('textarea[placeholder*="What\'s on your mind"]').should('be.visible').eq(1).type(postMessage);

    // Click Post
    this.elements.shareButton().click({ force: true });
    cy.wait(5000); // Wait for the post to be created
    cy.reload();
    // Store message for later verification
    cy.wrap(postMessage).as('sharedPostMessage');
  }

  // Test Case 3  
  /**
   * Likes the first post and returns the like count before and after the click.
   */
  getFirstPost() {
    return cy.get('div.oxd-sheet.oxd-sheet--rounded.oxd-sheet--white.orangehrm-buzz').first();
  }

  // Test Case 3
  getLikeCount($post) {
    return cy.wrap($post)
      .find('.orangehrm-buzz-stats p')
      .contains('Like')
      .invoke('text')
      .then((text) => {
        const match = text.match(/(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      });
  }

  getFirstLikeCount() {
    return cy.get('div.oxd-sheet.oxd-sheet--rounded.oxd-sheet--white.orangehrm-buzz')
      .first()
      .find('.orangehrm-buzz-stats p')
      .contains('Like')
      .invoke('text')
      .then((text) => {
        const match = text.match(/(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      });
  }

  clickLikeButton($post) {
    return cy.wrap($post)
      .find('path.orangehrm-heart-icon-path')
      .first()
      .click();
  }

  // Test Case 4
    /**
   * Adds a timestamped comment to the first post and returns the posted comment.
   */
  addCommentToFirstPost(commentText) {
    this.elements.buzzTab().should('be.visible').click();

    this.elements.commentIconOnFirstPost()
      .scrollIntoView()
      .click({ force: true });

    this.elements.commentInput()
      .should('be.visible')
      .type(`${commentText}{enter}`);
  }

  // Test Case 5
    /**
   * Edits an existing user record in the Admin section.
   *
   * Steps:
   * 1. Navigate to the Admin tab.
   * 2. Click the edit button for the second user in the list.
   * 3. Clear the existing username and update it with a new value ("TestUser").
   * 4. Click the save/update button to submit the changes.
   * 5. Wait for the success message to confirm that the update was applied.
   * 6. Return the success message for verification in the test.
   *
   * @returns {Promise<string>} - The trimmed success message confirming the update
   */
  editFirstPostWithText(newText) {
    this.elements.buzzTab().should('be.visible').click();
    this.elements.moreOptionsButton()
      .first()
      .should('be.visible')
      .click({ force: true });

    this.elements.editPostOption()
      .should('be.visible')
      .click({ force: true });

    cy.get('.oxd-dialog-container-default')
      .should('exist')
      .and('be.visible');

    this.elements.editTextArea()
      .should('be.visible')
      .clear({ force: true })
      .type(newText, { force: true });

    // Scroll to the Post button before clicking
    this.elements.postButton()
      .scrollIntoView()
      .should('be.visible')
      .click({ force: true });
  }

  // Test Case 6
    /**
 * Deletes the first post on the Buzz page and returns the confirmation message.
 */
  deletePostCheck() {
    // Navigate to Buzz Page
    this.elements.buzzTab().click();
    cy.wait(2000);
    // Click on MoreOptions of the first post
    this.elements.moreOptionsButton().first().click();
    // Click on the first post's delete button
    this.elements.deletePostOption().click();
    // Confirm deletion
    this.elements.confirmDeleteBtn().click();
    // Verify deletion success message
    cy.get('.oxd-toast-content-text').should('contain', 'Successfully Deleted');
  }



  // deletePost() 
  // {
  //   this.elements.buzzTab().should('be.visible').click();


  //   cy.get('textarea[placeholder*="What\'s on your mind"]')
  //     .should('be.visible')
  //     .type(`Auto Post ${Date.now()}`);

  //   cy.get("//button[@type='submit' and contains(@class, 'oxd-button--main')]")
  //     .contains('Post')
  //     .should('be.visible')
  //     .click({ force: true });
  //   cy.wait(3000); // Wait for the post to be created

  //   this.elements.moreOptionsButton()
  //     .first()
  //     .should('be.visible')
  //     .click({ force: true });

  //   cy.contains('li.orangehrm-buzz-post-header-config-item p', 'Delete Post')
  //     .should('be.visible')
  //     .click({ force: true });

  //   cy.get('.oxd-dialog-container-default')
  //     .should('exist')
  //     .and('be.visible');

  //   cy.get('.oxd-dialog-container-default button[type="submit"]')
  //     .contains('Delete')
  //     .should('be.visible')
  //     .click({ force: true });
  // }
}

export default BuzzPage;
