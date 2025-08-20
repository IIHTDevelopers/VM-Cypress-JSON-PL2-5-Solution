import LoginPage from "../PageObjects/Pages/LoginProfilePage";
import HomePage from "../PageObjects/Pages/HomePage";
import AdminPage from "../PageObjects/Pages/AdminPage";
import BuzzPage from "../PageObjects/Pages/BuzzPage";
import PimPage from "../PageObjects/Pages/PimPage";
import MyinfoPage from "../PageObjects/Pages/MyInfoPage";
import * as path from 'path';
const downloads = path.resolve(__dirname, '../../downloads');

describe("Automation Suite for Yaksha Application", () => {
  const loginPage = new LoginPage();
  const homePage = new HomePage();
  const adminPage = new AdminPage();
  const buzzPage = new BuzzPage();
  const pimPage = new PimPage();
  const myinfoPage = new MyinfoPage();

  let testIndex = 1;

  beforeEach(() => {
    // As per the requirment of TS-1 we have to perform login in that so we are skippping beforeEach Block for that TS-1
    loginPage.performLogin();
  });

  /**
* Test Case: 1_Verify admin Search Functionality
*
* Purpose:
* Validates that the Admin search functionality works correctly by searching 
* for an existing username and verifying the search result contains the query.
*
* Steps:
* 1. Navigate to the Admin section.
* 2. Input a valid admin username into the search field.
* 3. Click on the search button.
* 4. Wait for the results to load.
* 5. Verify that the username appears in the search results.
*/
  it("Test Case-1: Verify Admin can search users by role", () => {
    cy.wrap(null)
      .then(() => {
        // Navigate to Admin Page
        adminPage.searchAdminUsersByRole();
      })
      .then(() => {
        // Verify that only Admin users are displayed
        verifyAdminUsersDisplayed();
      });

    // Logging
    cy.log("Admin users displayed successfully");
  });

  /*
  TS-2: Validate photo sharing functionality with confirmation message

  This test validates that a user can successfully share a photo post
  on the Buzz page and that the action is accompanied by a confirmation
  (in this case, the actual posted comment text).

  The test performs the following actions:

  - Navigates to the Buzz page
  - Clicks the "Share Photos" button
  - Enters a unique comment with a timestamp
  - Uploads an image file from local storage
  - Submits the post
  - Reloads the page to reflect the new post
  - Returns and logs the posted comment for validation

  This test ensures that the photo post functionality works correctly
  and that the user's comment is properly associated with the shared photo.
*/
  it("Test Case-2: Verify Image could be dragged and dropped in buzz tab", () => {
    const imageToUpload = "skyimage.jpg";
    const now = new Date();
    const timestamp = `${now.getSeconds()}_${now.getMinutes()}_${now.getHours()}`;
    const postMessage = `TEST_${timestamp}`;

    cy.wrap(null)
      .then(() => {
        buzzPage.postImageWithTimestampText(imageToUpload, postMessage); // Pass image name from here
      })
      .then(() => {
        verifyBuzzPostAppeared(postMessage); // Verifier stays same
      });


    cy.log("Buzz post with custom image and message verified");
  });

  /*
 TS-3: Verify 'Like' button increments like count

 This test ensures the functionality of the 'Like' feature on the Buzz page.
 It validates whether clicking the 'Like' button on a post correctly updates
 the like count shown to the user.

 The test performs the following steps:

 - Navigates to the Buzz section
 - Fetches the current like count on the first visible post
 - Clicks the 'Like' button
 - Retrieves the updated like count
 - Validates that the count has increased after the click

 This test confirms that the like interaction works and reflects immediately in the UI.
*/
  it("Test Case-3: Verify Like button is Functional", () => {
    buzzPage.elements.buzzTab().should("be.visible").click();
    cy.wait(1000); // Wait for the page to load

    buzzPage.getFirstPost().should("be.visible").then(($post) => {
        let initialCount = 0;
        let updatedCount = 0;

        // Get initial like count , you can comment this main fucntion and the Assertion will Failed
        buzzPage.getLikeCount($post).then((count) => {
          initialCount = count;
          cy.log(`Initial Like Count: ${initialCount}`);

          // Click like .. Comment this also for failure
          buzzPage.clickLikeButton($post);

          cy.wait(1000);

          // Verify +1 count
          buzzPage.getFirstLikeCount($post).then((countAfterLike) => {
            updatedCount = countAfterLike;
            verifyLikeCountIncrease(updatedCount, initialCount + 1);

            // Click again to unlike
            buzzPage.clickLikeButton($post);
            cy.wait(1000);

            // Verify Assertion is valid and revert Like Action for Future Verification
            buzzPage.getFirstLikeCount($post).then((finalCount) => {
              verifyLikeCountReverse(finalCount, initialCount);
            });
          });
        });
      });
  });

  /*
  TS-4: Ensure comment can be successfully added to a post

  This test verifies the functionality of adding a comment to a post 
  on the Buzz page. It confirms that the comment is submitted and 
  appears correctly in the comment list.

  The test follows these steps:

  - Navigates to the Buzz section
  - Clicks on the comment button for the first post
  - Fills in a unique comment using a timestamped message
  - Submits the comment by pressing Enter
  - Retrieves the most recent comment text
  - Collects all comment elements on the page
  - Verifies that the posted comment is present in the list
  This ensures the comment submission flow is working correctly and the UI reflects the new comment as expected.

*/
  it("Test Case-4: Verify the Comment could be added to a post", () => {
    cy.wrap(null)
      .then(() => {
        const commentText = `Auto Comment ${Date.now()}`;
        buzzPage.addCommentToFirstPost(commentText);
      })
      .then(() => {
        // Verify the success toast appears
        verifyCommentSuccess();
      });
    cy.log(" Comment was successfully added to the post.");
  });

  /*
   TS-5: Ensure admin can edit user records
 
   This test verifies that an admin user is able to initiate the edit process
   for a user record from the Admin section. It performs the following actions:
 
   - Navigates to the Admin section using the Admin link
   - Clicks on the edit button corresponding to a user entry
 
   The test confirms that the edit user interface becomes accessible, indicating
   that the edit flow is properly triggered.
 */
  it('Test Case-5: Verify "Edit Post" Functionality', () => {
    cy.wrap(null)
      .then(() => {
        const editedText = `Edited post - ${Date.now()}`;
        buzzPage.editFirstPostWithText(editedText);
      })
      .then(() => {
        // Verify the success toast appears
        verifyPostEditSuccess();
      });
    cy.log(" Comment was successfully added to the post.");
  });

  /**
  * Test Case: 6_Verify 'Delete Post' Functionality
  *
  * Objective:
  * Ensure that a user is able to delete a Buzz post successfully and receive a confirmation message.
  *
  * Steps Performed:
  *  1. Navigate to the Buzz page.
  *  2. Click on the delete toggle/menu of the first post.
  *  3. Click the delete button to trigger confirmation.
  *  4. Confirm the deletion in the confirmation dialog.
  *  5. Wait for completion and retrieve the success message.
  *  6. Assert that the confirmation message contains "Successfully Deleted".
  *
  * Expected Result:
  * A success message "Successfully Deleted" should appear after the post is deleted.
  */
  it('Test Case-6: Verify "Delete Post" Functionality', () => {
    cy.wrap(null)
      .then(() => {

        // Delete the first post
        buzzPage.deletePostCheck();

      })
      .then(() => {
        // Verify the success message appears
        verifyBuzzPostDelete();
      });
    cy.log("Post was successfully deleted.");
  });

  /**
  * Test Case: TS-7 Verify 'Get Help' Button is Functional
  *
  * Objective:
  * Validate that clicking the 'Get Help' button opens a new browser tab with the expected help URL.
  *
  * Steps:
  * 1. Clicks the 'Get Help' button on the login page.
  * 2. Waits for a new browser tab to open.
  * 3. Waits for the new page to fully load.
  * 4. Extracts and returns the URL of the newly opened tab.
  * 5. Asserts that the actual URL matches the expected help URL.
  */
  it('Test Case-7: Verify "Get" help button is functional', () => {
    cy.wrap(null)
      .then(() => {
        // Navigate to Leaves Page , Creating holiday
        homePage.getHelpFunctional()
      })
      .then(() => {
        // Verify Tolltip Functioning
        verifyHelpButtonOpensNewTab()
      });

  });

  /**
* Test Case: TS-8 Verify List of Reports
*
* Objective:
* Ensure that the list of employee reports is fetched successfully from the PIM section.
*
* Steps:
* 1. Navigate to the PIM section by clicking the PIM link.
* 2. Click on the "Employee List" button to view reports.
* 3. Wait for the employee list to load.
* 4. Extract all employee IDs as text content.
* 5. Assert that the employee list is not empty.
*/
  it('Test Case-8: Verify List of Reports', () => {
    cy.wrap(null).then(() => {
      // Navigate to PIM Page
      pimPage.employeeListCheck();

    }).then(() => {
      // Verify Employee List Presense
      verifyEmpListPresense();
    });

  });

  /**
  * Test Case: TS-9
  * Objective: Verify that the Employee Search functionality works as expected.
  * 
  * Steps:
  * 1. Navigate to PIM > Employee List.
  * 2. Capture an Employee ID from the list.
  * 3. Enter the same ID into the search field and perform the search.
  * 4. Assert that the result contains the correct Employee ID.
  */
  it('Test Case-9: Verify Employee List Search functionality', () => {
    // Step 1: Extract ID and store
    let foundID = null;

    getFirstNumericEmployeeId().then((id) => {
      foundID = id; // save in test-scope variable

      // Step 2: Use the same ID in the search method / Comment This
      pimPage.searchEmployeeById(foundID);
    });

    // Step 3: Verify result with same ID
    cy.then(() => {
      verifyEmpListSearch(foundID);
    });

  });

  /**
 * Test Case: TS-10 Verify Primary Colour of corporate branding could be changed
 *
 * Objective:
 * Ensure that the primary color under corporate branding can be updated successfully.
 *
 * Steps:
 * 1. Navigate to the Admin section.
 * 2. Click on the "Corporate Branding" tab.
 * 3. Select and modify the primary color input field.
 * 4. Click the "Publish" button to apply the changes.
 * 5. Fetch the inline style attribute to confirm the color has been applied.
 * 6. Assert that the color code matches the expected value using a helper.
 */
  it('Test Case-10: Verify Primary Color of corporate branding could be changed', () => {

    let primaryColour = '#1231df'; // Example colour
    cy.wrap(null).then(() => {

      // Changing Primary Colour
      adminPage.changePrimaryColour(primaryColour);

    }).then(() => {
      // Verify the Change Color functionality works
      verifyColourChanged(primaryColour);
    });
  });

  /**
 * Test Case: TS_11
 * Objective: Verify that the Language Packages can be successfully downloaded.
 *
 * Steps:
 * 1. Navigate to Admin > Configuration > Language section.
 * 2. Initiate the download of a language module.
 * 3. Verify that the file was downloaded to the expected location.
 */
  it("Test Case-11: Verify the Language Packages could be downloaded", () => {
    let fileName = "";

    // Trigger file download and get the file name
    adminPage.downloadLanguageModule().then((downloadedFileName) => {
      fileName = downloadedFileName;
      // Use the custom assertion to check if the file was downloaded
      verifyDownloadedFileExists(fileName);

    });
  });

  /**
   * Test Case: TS-12 Verify the Subtabs CSS class changes on hover
   *
   * Purpose:
   * Validates that hovering over a subtab in the Admin section applies the expected CSS class.
   *
   * Steps:
   * 1. Navigate to the Admin section.
   * 2. Hover over the "Nationalities" subtab.
   * 3. Capture the class attribute of the hovered element.
   * 4. Assert that the class includes the expected hover-related class.
   */
  it("Test Case-12: Verify the Subtabs CSS change after hovering over the element", () => {
    cy.wrap(null)
      .then(() => {
        // Hover and capture class using hoverAdmin method
        return adminPage.hoverAdmin(); // Should return a promise with the class name
      })
      .then((className) => {
        // Log the captured class to the console
        cy.log(className);
        // Validate that the class includes 'oxd-topbar-body-nav-tab --visited'
        expect(className).to.contain('oxd-topbar-body-nav-tab --visited');
      });
  });

  /**
   * Test Case: TS-13 Verify two employees with the same Employee ID cannot be created
   *
   * Purpose:
   * To ensure the system prevents creation of duplicate Employee IDs.
   *
   * Steps:
   * 1. Navigate to the PIM > Employee List page.
   * 2. Capture the Employee ID of an existing employee.
   * 3. Click the Add button to create a new employee.
   * 4. Enter the captured Employee ID in the form.
   * 5. Verify that an appropriate error message is shown.
   */
  it("Test Case-13: Verify two employees with same employee ID can't be created", () => {
    cy.wrap(null)
      .then(() => {
        // Attempt to create employee with duplicate ID and get error message
        return pimPage.getEmpIdError(); // Should return a promise that resolves to the error message
      })
      .then((errorMessage) => {
        cy.log(errorMessage);
        expect(errorMessage).to.contain("Employee Id already exists");
      });
  });

  /**
   * Test Case: TS-14 Verify the 'Maintenance' tab only allows admin to access
   *
   * Purpose:
   * To ensure that access to the Maintenance tab is restricted and only accessible with valid admin credentials.
   *
   * Steps:
   * 1. Click on the Maintenance tab.
   * 2. Enter the admin password to gain access.
   * 3. Confirm the password entry.
   * 4. Verify that the Maintenance page is displayed by checking the page header.
   */
  it("Test Case-14: Verify the Corporate branding reset to default functionality", () => {
    cy.wrap(null)
      .then(() => {
        // Trigger the color reset and get the style string
        return adminPage.resetColor(); // Should return a promise resolving to the style string
      })
      .then((styleString) => {

        cy.wait(2000); // Wait for the reset to take effect
        cy.log(styleString);
        const styleArray = styleString.split(';');
        expect(styleArray).to.include("background-color: rgb(255, 123, 29)");

      });
  });

  /**
   * Test Case: TC-15 Verify attachment can be uploaded in the My Info tab
   *
   * Purpose:
   * To ensure that a file attachment with a custom comment can be successfully uploaded
   * and is visible under the Dependents or Contact section of My Info.
   *
   * Steps:
   * 1. Generate a unique comment.
   * 2. Navigate to My Info > Contact section.
   * 3. Upload a file with the comment.
   * 4. Verify that the comment appears in the list after upload.
   */
  it('Test Case-15: Verify Attachment could get Uploaded to the "My info" tab ', () => {
    // Start
    const fileName = 'sample_upload.pdf'
    cy.wrap(null).then(() => {
      // Navigate to Profile Page & Performing Actions
      myinfoPage.uploadDependentPDF(fileName);

    }).then(() => {
      cy.wait(2000);
      verifyContactPDFUploaded(fileName); // Verify PDF Succesfully Uploaded
    });

  });


});
// ---------------------- Helper Functions ----------------------

// Test Case 1: Verify admin Search Functionality
function verifyAdminUsersDisplayed() {
  cy.get(".oxd-table-cell:nth-child(3)").each(($el) => {
    cy.wrap($el).invoke("text").should("contain", "Admin");
  });
}

// Test Case 2: Verify Image could be dragged and dropped in buzz tab
function verifyBuzzPostAppeared(postMessage) {
  cy.get("div.oxd-sheet.oxd-sheet--rounded.oxd-sheet--white.orangehrm-buzz")
    .first()
    .contains(postMessage);
}

// Test Case 3: Verify Like button is Functional
function verifyLikeCountIncrease(finalCount, expectedCount) {
  cy.log(`Updated Like Count: ${finalCount}`);
  expect(finalCount).to.equal(expectedCount);
}
function verifyLikeCountReverse(finalCount, initialCount) {
  cy.log(`Final Like Count: ${finalCount}`);
  expect(finalCount).to.equal(initialCount);
}

// Test Case 4: Verify the Comment could be added to a post
function verifyCommentSuccess() {
  cy.get("div.oxd-toast-content--success", { timeout: 10000 })
    .should("contain.text", "Successfully")
    .and("be.visible");
}

// Test Case 5: Verify "Edit Post" Functionality
function verifyPostEditSuccess() {
  cy.contains("Successfully Updated", { timeout: 10000 }).should("be.visible");
}

// Test Case 6: Verify Post Deletion
function verifyBuzzPostDelete() {
  // Verify deletion success message
  cy.get('.oxd-toast-content-text').should('contain', 'Successfully Deleted');
};

// Test Case 7: Verify Help Button Functionality
function verifyHelpButtonOpensNewTab() {
  // Assert new tab (window.open) is called
  cy.get('@windowOpen').should('be.called');
}

// Test Case 8: Verify Employee List Presence
function verifyEmpListPresense() {
  cy.get('.oxd-table-body .oxd-table-row')
    .should('exist')
    .and('have.length.greaterThan', 0);
}

// Test Case 9: Verify Employee List Search functionality
function getFirstNumericEmployeeId() {
  // Visiting Pim Tab
  cy.contains('span.oxd-main-menu-item--name', 'PIM').should('be.visible').click();
  cy.contains('Employee List').should('be.visible').click();

  cy.wait(2000);

  // Sort the Employee ID column
  cy.get('i.oxd-icon.bi-arrow-down-up.oxd-icon-button__icon.oxd-table-header-sort-icon')
    .eq(0)
    .should('be.visible')
    .click();

  cy.get('li.oxd-table-header-sort-dropdown-item')
    .eq(0)
    .should('be.visible')
    .click();

  // Get the first numeric Employee ID from the table
  return cy
    .get('div.oxd-table-cell.oxd-padding-cell')
    .eq(1) // Assuming the second column contains the Employee ID
    .invoke('text')
    .then((text) => {
      const foundID = text.trim();

      // Optional: Validate that it’s a numeric ID
      expect(/^\d+$/.test(foundID)).to.be.true;

      return foundID;
    });
}


function verifyEmpListSearch(empId) {
  cy.get('.oxd-table-body .oxd-table-row').should('have.length', 1);
  cy.get('.oxd-table-body .oxd-table-row')
    .first()
    .find('div.oxd-table-cell')
    .contains(empId)
    .should('be.visible');
}

// Test Case 10: Verify Primary Color of corporate branding could be changed
function verifyColourChanged(expectedHex) {
  cy.get('div.oxd-color-input-preview').eq(0)
    .should('exist');

  cy.wait(300); // Let popup settle

  cy.get('div.oxd-color-input-preview').eq(0)
    .click({ force: true });

  cy.get('input.oxd-input.oxd-input--active')
    .eq(1)
    .invoke('val')
    .then((actualHex) => {
      expect(actualHex.toUpperCase()).to.eq(expectedHex.toUpperCase());
    });

  cy.get('body').type('{esc}');
}

// Test Case 11: Verify the Language Packages could be downloaded
function verifyDownloadedFileExists(filename) {
  // Define the path to your downloads folder
  const downloads = Cypress.config('downloadsFolder');
  const filePath = path.join(downloads, filename);  // Combine folder path with the file name
  cy.wait(4000); 
  // Try reading the file from the download directory
  cy.wrap(null).then(() => {
    // Attempt to read the file to check its existence
    cy.readFile(filePath, 'utf8').should('exist');  // This will fail if the file doesn't exist
  });
}


function verifyContactPDFUploaded(fileName) {
  cy.get('.oxd-toast').should('be.visible').and('contain', 'Successfully Saved');
  cy.contains(fileName).should('be.visible');
}


const generateUniqueComment = () => {
  const timestamp = Date.now(); // current time in milliseconds
  const random = Math.floor(Math.random() * 10000); // random 4-digit number
  return `upload${timestamp}${random}`;
};





