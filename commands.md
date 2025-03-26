### run cypress tests
npx cypress run

### run cypress tests in browser
npx cypress run --browser chrome

### run cypress tests for specified file only
npx cypress run --spec "cypress/e2e/logout.spec.js" --browser chrome

### run cypress tests with env variables
npx cypress run --env username=hansi@horsti.de,password=SagIchNicht

