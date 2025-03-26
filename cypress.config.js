const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: '8x59p1',
  viewportHeight: 1080,
  viewportWidth: 1920,
  video: true,
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'reporter-config.json',
  },
  e2e: {
    env: {
      username: "hansi@horsti.de",
      password: "Hansi123",
      apiUrl: "https://conduit-api.bondaracademy.com/api"
    },
    baseUrl: "https://conduit.bondaracademy.com",
    setupNodeEvents(on, config) {
      // implement node event listeners here
      console.log("config: ", config);
      const username = process.env.APP_USERNAME || config.rawJson.envFile.username || config.rawJson.env.username;
      const password = process.env.APP_PASSWORD || config.rawJson.envFile.password || config.rawJson.env.password;

      config.env.username = username;
      config.env.password = password;
      return config;
    },
    specPattern: "cypress/e2e/**/*.spec.{js,jsx,ts,tsx}",
    retries: {
      runMode: 1,
      openMode: 0
    }
  },
});
