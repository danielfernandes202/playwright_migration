import { test } from 'playwright/test';
const { loginPage } =  require('../base_classes/login.js');
const { Settings } = require('../base_classes/settings.js');
const creds =  require('../test_data/logindata.json')


let login, context, settings;

test.beforeEach(async ({ browser }) => {
    context = await browser.newContext();
    const page = await context.newPage();
    login = new loginPage(page);
    settings = new Settings(page);
    await page.goto("");
    await login.loginuser(creds.nevadaadmin, creds.password);
});
test('Navigate to settings', async () => {
    await settings.navigateToSettings();
});
test('State connect text validation', async () => {
    await settings.navigateToSettings();
    await settings.stateConnectTextValidation();
});

test('State connect toggle validation', async () => {
    await settings.navigateToSettings();
    await settings.stateConnectTextValidation();
    await settings.stateConnectToggle();
    await settings.page.waitForTimeout(5000);
});
