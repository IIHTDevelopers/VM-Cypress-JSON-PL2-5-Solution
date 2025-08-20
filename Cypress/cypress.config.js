const { defineConfig } = require('cypress');
const CustomReporter = require('./custom-reporter.js'); // Adjust the path as needed

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  viewportWidth: 1400,
  viewportHeight: 800,
  reporterOptions: {
    charts: true,
    reportPageTitle: 'Yaksha Automation Report',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
  },
  e2e: {
    // Defining Base URL's And pattern's
    baseUrl: 'https://opensource-demo.orangehrmlive.com/',
    // baseUrl: 'http://192.168.1.13:8082/orangehrm-5.7/web/index.php',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.js',
    downloadsFolder: 'cypress/downloads',


    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);

      const reporter = new CustomReporter();

      on('after:spec', async (spec, results) => {
        if (results && results.tests) {
          for (const test of results.tests) {
            const status = test.state; // 'passed', 'failed', or 'skipped'
            const error = test.displayError || '';
            await reporter.logTestResult(test, status, error);
          }
        }
      });

      on('after:run', async () => {
        await reporter.onEnd();
      });

      on('task', {
        updateFixture(data) {
          const filePath = path.resolve('cypress/fixtures/AddSkillData.json');
          fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
          return null;
        },
      });

      return config;
    },
    defaultCommandTimeout: 4000,
  },
});