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
test('Navigate to instiution configurations page', async () => {
    await settings.navigateToSettings();
    await settings.navigateToInstitutionConfiguration();
    await settings.page.waitForTimeout(5000);
});
test.skip('Add lowwer division configurations', async () => {
    await settings.navigateToSettings();
    await settings.navigateToInstitutionConfiguration();
    await settings.addConfigurations();
    await settings.page.waitForTimeout(5000);
});