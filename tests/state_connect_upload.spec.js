import { test } from 'playwright/test';
const { loginPage } =  require('../base_classes/login.js');
const { stateConnect } = require('../base_classes/stateConnect.js');
const creds =  require('../test_data/logindata.json')

let login, context, stateconnect;

test.beforeEach(async ({ browser }) => {
    context = await browser.newContext();
    const page = await context.newPage();
    login = new loginPage(page);
    stateconnect = new stateConnect(page);
    await page.goto("");
    await login.loginuser(creds.triadmin, creds.password);
    stateconnect.navigateToUpload();
});

const testCases = [{
    name: "Upload state connect file add with only source state",
    file: "test_data/stateConnectUpload/sourceassateconnect.csv",
    action: "Add"
  }, {
    name: "Upload state connect file add with both target and source state",
    file: "test_data/stateConnectUpload/bothsourceandtargetstateconnet.csv",
    action: "Add"
  }, {
    name: "Upload state connect file update action with only source state",
    file: "test_data/stateConnectUpload/sourceassateconnect.csv",
    action: "Update"
  }, {
    name: "Upload state connect file update action with both target and source state",
    file: "test_data/stateConnectUpload/bothsourceandtargetstateconnet.csv",
    action: "Update"
  
  }];
  for (const testCase of testCases) {
    test(testCase.name, async () => {
      await stateconnect.stateConnectUpload(testCase.file, testCase.action);
      await stateconnect.stateConnectUploadValidator("1", "8", "+ 1 Institutions in file", "+ 1 Institutions loaded from file", "+ 8 Rules in file", "+ 8 Rules loaded from file");
      await stateconnect.decisionOnUploadSummary();
    });
  }
