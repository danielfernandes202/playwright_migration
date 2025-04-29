import { test, expect } from '@playwright/test';
const {loginPage} = require('../base_classes/login.js');
const { BoostRequest } = require('../base_classes/Boostrequest.js');
const Creds = require('../test_data/logindata.json');

let loginPageInstance, boost;

// Setup before each test
test.beforeEach(async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  loginPageInstance = new loginPage(page);
  boost = new BoostRequest(page);

  await page.goto("");
    await loginPageInstance.visit();
});

  test('Verifies that user can navigate to partner boost', async () => { 
await loginPageInstance.loginuser( Creds.nevadaadmin, Creds.password, 'Institution Admin');
    
    await boost.navigateToPartnerBoost();
  });

  test('Verifies that user can select dropdowns in the partner boost request', async () => { 
await loginPageInstance.loginuser( Creds.nevadaadmin, Creds.password, 'Institution Admin');
    await boost.navigateToPartnerBoost();
    await boost.boostEmptyRequest();
  });

  test('Verifies that submit button is disabled when mandatory fields are not filled for partner boost', async ({ page }) => {
    await loginPageInstance.loginuser( Creds.nevadaadmin, Creds.password, 'Institution Admin');
    await boost.navigateToPartnerBoost();
    await boost.disabledSubmitButton();
    await boost.boostEmptyRequest();
    await boost.disabledSubmitButton();
    await boost.autoName("testing", 5);
    await expect(boost.page.getByRole('button', { name: 'Submit' })).toBeVisible();
  });

  test('Verifies successful submission of async partner boost request', async () => { 
await loginPageInstance.loginuser( Creds.nevadaadmin, Creds.password, 'Institution Admin');
    await boost.navigateToPartnerBoost();
    await boost.boostEmptyRequest();
    const randomName = boost.generateUniqueAlphaNumeric(5);

    await boost.autoName(randomName, 5);
   await boost.submitAsync();
  });

  test.skip('Verifies successful unassigned partner boost request', async () => { 
await loginPageInstance.loginuser( Creds.nevadaadmin, Creds.password, 'Institution Admin');
    await boost.navigateToPartnerBoost();
    for (let i = 1; i <= 2; i++) {
      await boost.selectRandomItemFromComboBox(
        `:nth-child(${i}) > .pb-8 > .timeline-input > #dropdown-trigger > .rounded-md`,
        '[aria-controls="combobox-item-list"]',
        5
      );
    }
    await boost.selectRandomInstitution(3);
    const randomName = boost.generateUniqueAlphaNumeric(5);
    await boost.autoName(randomName, 4, 5, 3);
    await boost.submitRequestUnassigned(randomName);
  });

  test.skip('Verifies navigation to Improve Rule boost', async () => { 
await loginPageInstance.loginuser( Creds.nevadaadmin, Creds.password, 'Institution Admin');
    await boost.navigateToImproveRule();
  });

  test.skip('Verifies dropdown selection in Improve Rule boost request', async () => { 
await loginPageInstance.loginuser( Creds.nevadaadmin, Creds.password, 'Institution Admin');
    await boost.navigateToImproveRule();
    await boost.selectRandomItemFromComboBox(
      ':nth-child(1) > #dropdown-trigger > .rounded-md',
      '[aria-controls="combobox-item-list"]',
      50
    );
    await boost.selectRandomItemFromComboBox(
      '.gap-4 > :nth-child(2) > #dropdown-trigger > .rounded-md',
      '[aria-controls="combobox-item-list"]',
      3
    );
    for (let i = 2; i <= 3; i++) {
      await boost.selectRandomItemFromComboBox(
        `:nth-child(${i}) > .pb-8 > .timeline-input > #dropdown-trigger > .rounded-md`,
        '[aria-controls="combobox-item-list"]',
        5
      );
    }
    await boost.selectRandomInstitution(4);
  });

  test.skip('Verify disabled submit in Improve Rule boost when fields are empty', async ({ page }) => {
    await boost.navigateToImproveRule();
    await boost.disabledSubmitButton();
    await boost.selectRandomItemFromComboBox(':nth-child(1) > #dropdown-trigger > .rounded-md', '[aria-controls="combobox-item-list"]', 50);
    await boost.disabledSubmitButton();
    await boost.selectRandomItemFromComboBox('.gap-4 > :nth-child(2) > #dropdown-trigger > .rounded-md', '[aria-controls="combobox-item-list"]', 3);
    await boost.disabledSubmitButton();
    for (let i = 2; i <= 3; i++) {
      await boost.selectRandomItemFromComboBox(`:nth-child(${i}) > .pb-8 > .timeline-input > #dropdown-trigger > .rounded-md`, '[aria-controls="combobox-item-list"]', 5);
      await boost.disabledSubmitButton();
    }
    await boost.selectRandomInstitution(4);
    await boost.disabledSubmitButton();
    await boost.autoName("testing", 5, 6, 4);
    await page.locator('.p-0 > .rounded-full > .w-6').click();
    await expect(page.locator(':nth-child(2) > div.w-full > .relative > .opacity-0')).toBeVisible();
  });

  test.skip('Successful assigned Improve Rule boost request', async () => { 
await loginPageInstance.loginuser( Creds.nevadaadmin, Creds.password, 'Institution Admin');
    await boost.navigateToImproveRule();
    await boost.selectRandomItemFromComboBox(':nth-child(1) > #dropdown-trigger > .rounded-md', '[aria-controls="combobox-item-list"]', 50);
    await boost.selectRandomItemFromComboBox('.gap-4 > :nth-child(2) > #dropdown-trigger > .rounded-md', '[aria-controls="combobox-item-list"]', 3);
    for (let i = 2; i <= 3; i++) {
      await boost.selectRandomItemFromComboBox(`:nth-child(${i}) > .pb-8 > .timeline-input > #dropdown-trigger > .rounded-md`, '[aria-controls="combobox-item-list"]', 5);
    }
    await boost.selectRandomInstitution(4);
    const randomName = boost.generateUniqueAlphaNumeric(5);
    await boost.autoName(randomName, 5, 6, 4);
    await boost.selectRandomItemFromComboBox(':nth-child(1) > .relative.max-w-full > #dropdown-trigger > .rounded-md > .flex-1 > .justify-center > .px-2 > .w-full > #combobox-input', '#combobox-item-list', 5);
    await boost.submitRequest(randomName);
  });

  test.skip('Successful unassigned Improve Rule boost request', async () => { 
await loginPageInstance.loginuser( Creds.nevadaadmin, Creds.password, 'Institution Admin');
    await boost.navigateToImproveRule();
    await boost.selectRandomItemFromComboBox(':nth-child(1) > #dropdown-trigger > .rounded-md', '[aria-controls="combobox-item-list"]', 50);
    await boost.selectRandomItemFromComboBox('.gap-4 > :nth-child(2) > #dropdown-trigger > .rounded-md', '[aria-controls="combobox-item-list"]', 3);
    for (let i = 2; i <= 3; i++) {
      await boost.selectRandomItemFromComboBox(`:nth-child(${i}) > .pb-8 > .timeline-input > #dropdown-trigger > .rounded-md`, '[aria-controls="combobox-item-list"]', 5);
    }
    await boost.selectRandomInstitution(4);
    const randomName = boost.generateUniqueAlphaNumeric(5);
    await boost.autoName(randomName, 5, 6, 4);
    await boost.submitRequestUnassigned(randomName);
  });

  test.skip('Navigate to Find Course boost', async () => { 
await loginPageInstance.loginuser( Creds.nevadaadmin, Creds.password, 'Institution Admin');
    await boost.navigateToFindCourse();
  });

  test.skip('Dropdown selection in Find Course boost request', async () => { 
await loginPageInstance.loginuser( Creds.nevadaadmin, Creds.password, 'Institution Admin');
    await boost.navigateToFindCourse();
    await boost.selectRandomItemFromComboBox(':nth-child(1) > #dropdown-trigger > .rounded-md', '[aria-controls="combobox-item-list"]', 50);
    await boost.selectRandomItemFromComboBox('.gap-4 > :nth-child(2) > #dropdown-trigger > .rounded-md', '[aria-controls="combobox-item-list"]', 3);
    for (let i = 2; i <= 3; i++) {
      await boost.selectRandomItemFromComboBox(`:nth-child(${i}) > .pb-8 > .timeline-input > #dropdown-trigger > .rounded-md`, '[aria-controls="combobox-item-list"]', 5);
    }
    await boost.selectRandomInstitution(4);
  });

  test.skip('Disabled submit in Find Course boost when fields are empty', async ({ page }) => {
    await boost.navigateToFindCourse();
    await boost.disabledSubmitButton();
    await boost.selectRandomItemFromComboBox(':nth-child(1) > #dropdown-trigger > .rounded-md', '[aria-controls="combobox-item-list"]', 50);
    await boost.disabledSubmitButton();
    await boost.selectRandomItemFromComboBox('.gap-4 > :nth-child(2) > #dropdown-trigger > .rounded-md', '[aria-controls="combobox-item-list"]', 3);
    await boost.disabledSubmitButton();
    for (let i = 2; i <= 3; i++) {
      await boost.selectRandomItemFromComboBox(`:nth-child(${i}) > .pb-8 > .timeline-input > #dropdown-trigger > .rounded-md`, '[aria-controls="combobox-item-list"]', 5);
      await boost.disabledSubmitButton();
    }
    await boost.selectRandomInstitution(4);
    await boost.disabledSubmitButton();
    await boost.autoName("testing", 5, 6, 3);
    await page.locator('.p-0 > .rounded-full > .w-6').click();
    await expect(page.locator(':nth-child(2) > div.w-full > .relative > .opacity-0')).toBeVisible();
  });

  test.skip('Assigned find course boost request submission', async () => { 
await loginPageInstance.loginuser( Creds.nevadaadmin, Creds.password, 'Institution Admin');
    await boost.navigateToFindCourse();
    await boost.selectRandomItemFromComboBox(':nth-child(1) > #dropdown-trigger > .rounded-md', '[aria-controls="combobox-item-list"]', 50);
    await boost.selectRandomItemFromComboBox('.gap-4 > :nth-child(2) > #dropdown-trigger > .rounded-md', '[aria-controls="combobox-item-list"]', 3);
    for (let i = 2; i <= 3; i++) {
      await boost.selectRandomItemFromComboBox(`:nth-child(${i}) > .pb-8 > .timeline-input > #dropdown-trigger > .rounded-md`, '[aria-controls="combobox-item-list"]', 5);
    }
    await boost.selectRandomInstitution(4);
    const randomName = boost.generateUniqueAlphaNumeric(5);
    await boost.autoName(randomName, 5, 6, 3);
    await boost.selectRandomItemFromComboBox(':nth-child(1) > .relative.max-w-full > #dropdown-trigger > .rounded-md > .flex-1 > .justify-center > .px-2 > .w-full > #combobox-input', '#combobox-item-list', 5);
    await boost.submitRequest(randomName);
  });

  test.skip('Unassigned find course boost request submission', async () => { 
await loginPageInstance.loginuser( Creds.nevadaadmin, Creds.password, 'Institution Admin');
    await boost.navigateToFindCourse();
    await boost.selectRandomItemFromComboBox(':nth-child(1) > #dropdown-trigger > .rounded-md', '[aria-controls="combobox-item-list"]', 50);
    await boost.selectRandomItemFromComboBox('.gap-4 > :nth-child(2) > #dropdown-trigger > .rounded-md', '[aria-controls="combobox-item-list"]', 3);
    for (let i = 2; i <= 3; i++) {
      await boost.selectRandomItemFromComboBox(`:nth-child(${i}) > .pb-8 > .timeline-input > #dropdown-trigger > .rounded-md`, '[aria-controls="combobox-item-list"]', 5);
    }
    await boost.selectRandomInstitution(4);
    const randomName = boost.generateUniqueAlphaNumeric(5);
    await boost.autoName(randomName, 5, 6, 4);
    await boost.submitRequestUnassignedFindCourse(randomName);
  });
