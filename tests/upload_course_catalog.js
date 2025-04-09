const { test, expect } = require('@playwright/test');
const {loginPage} = require('../base_classes/login.js');
const { Upload } = require('../base_classes/upload.js');
const UploadUtils = require('../base_classes/csvUtils.js');
const creds = require('../test_data/logindata.json');
const fs = require('fs').promises;


// Define file paths
const filePath = 'test_data/uploadRules/182290_FileWithNoError4copy.csv';
const filePath2 = 'test_data/uploadRules/182290_FileWithNoError4.csv';

// Setup test context
let loginPageInstance, uploadInstance;
let Creds, criticalError, preUploadCount, postUploadCount;

// Setup before each test
test.beforeEach(async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  uploadInstance = new Upload(page);
  loginPageInstance = new loginPage(page);
  await page.goto("https://qa.creditmobility.net/");

});

test.describe("Upload Catalog Add, Update and Replace", () => {
  let loginPageInstance, uploadInstance;

  test.beforeEach(async ({ page }) => {
    loginPageInstance = new LoginPage(page);
    uploadInstance = new Upload(page);
    
    // Load fixtures (similar to cy.fixture)
    const credsJson = require('../../fixtures/loginCreds.json');
    const criticalErrorJson = require('../../fixtures/criticalErrorName.json');
    const filesDataJson = require('../../fixtures/criticalErrorsFiles.json');
    
    Creds = credsJson;
    criticalError = criticalErrorJson;
    uploadFiles = filesDataJson;
    
    // Visit page and login
    await loginPageInstance.visit();
    await loginPageInstance.loginRoles(Creds.InstAdminNevada, Creds.Password2, 'Institution Admin');
  });

  test.skip("Upload Catalog file with incorrect format(non CSV file)", async () => {
    await uploadInstance.uploadcatalog('cypress/fixtures/uplaoadFiles/182290_NonCSVFile.xlsx', 1);
    await expect(page.locator("text=Unsupported file. Only csv files are supported.")).toBeVisible();
  });

  test.skip("Upload Catalog file with spaces in the file name", async () => {
    await uploadInstance.uploadcatalog('cypress/fixtures/uplaoadFiles/182290_This File has Spaces.CSV', 1);
    await expect(page.locator("text=Please rename the file without spaces and try again.")).toBeVisible();
  });

  test.skip("Attempt to press on submit without checking the acknowledgement checkbox", async () => {
    await uploadInstance.uploadcatalog(filePath, 1);
    await uploadInstance.uplaodcatalogValid(0);
    await expect(page.locator('text=Submit')).toBeDisabled();
  });

  test.skip("Uploads a catalog file and click cancel on the upload summary page", async () => {
    await uploadInstance.uploadcatalog(filePath, 1);
    await uploadInstance.uplaodcatalogValid(0);
    await page.locator('text=Cancel').click();
    expect(page.url()).toContain('/my-workspace/inst-admin/summary');
  });

  test.skip("Uploads catalog add function with no errors", async () => {
    let fileRulecount = 3;
    
    // Read and modify CSV content
    const fs = require('fs');
    let fileContent = fs.readFileSync("cypress/fixtures/CatalogFiles/DuplicateCourseIdentifier.csv", 'utf-8');
    const modifiedContent = UploadUtils.updateCSVContentCatalog(fileContent);
    fs.writeFileSync("cypress/fixtures/CatalogFiles/DuplicateCourseIdentifier.csv", modifiedContent);
    
    // Pre-upload catalog count
    preUploadCount = await uploadInstance.preUploadCatalog();
    console.log(preUploadCount);
    
    await uploadInstance.uploadcatalog("cypress/fixtures/CatalogFiles/DuplicateCourseIdentifier.csv", 1);
    await uploadInstance.uplaodcatalogValid(0);
    
    // Verify no errors
    await expect(page.locator('text=Errors')).not.toBeVisible();
    await expect(page.locator('text=Download csv file')).not.toBeVisible();
    
    // Verify confirmation page counts
    await uploadInstance.confirmationPageCountCatalog("3", "+ 3 new active courses", "3", "3 rows were successfully transformed", "+ 3 new courses");
    
    // Post upload
    await uploadInstance.postUpload();
    postUploadCount = await uploadInstance.postUploadCountCatalog();
    console.log(postUploadCount);
    expect(parseInt(postUploadCount)).toEqual(parseInt(preUploadCount) + fileRulecount);
  });

  test.skip("Uploads catalog add function with Invalid active course error", async () => {
    let fileRulecount = 2;
    
    // Read and modify CSV content
    const fs = require('fs');
    let fileContent = fs.readFileSync("cypress/fixtures/CatalogFiles/Format-InvalidActiveCourse.csv", 'utf-8');
    const modifiedContent = UploadUtils.updateCSVContentCatalog(fileContent);
    fs.writeFileSync("cypress/fixtures/CatalogFiles/Format-InvalidActiveCourse.csv", modifiedContent);
    
    // Pre-upload catalog count
    preUploadCount = await uploadInstance.preUploadCatalog();
    console.log(preUploadCount);
    
    await uploadInstance.uploadcatalog("cypress/fixtures/CatalogFiles/Format-InvalidActiveCourse.csv", 1);
    await uploadInstance.uplaodcatalogValid(0);
    
    // Verify format error
    await uploadInstance.catalogFormatError();
    
    // Verify confirmation page counts
    await uploadInstance.confirmationPageCountCatalog("0", "+ 0 new active courses", "3" + "1 format errors", "3 rows were successfully transformed", "+ 2 new courses");
    
    // Verify error message in CSV
    await uploadInstance.catalogreadErrorCSVFile("Invalid Active Course Indicator. Should be a boolean  ", 0);
    
    // Post upload
    await uploadInstance.postUpload();
    postUploadCount = await uploadInstance.postUploadCountCatalog();
    console.log(postUploadCount);
    expect(parseInt(postUploadCount)).toEqual(parseInt(preUploadCount) + fileRulecount);
  });

  test.skip("Uploads catalog add function with Invalid Course Department name Error", async () => {
    let fileRulecount = 2;
    
    // Read and modify CSV content
    const fs = require('fs');
    let fileContent = fs.readFileSync("cypress/fixtures/CatalogFiles/Format-InvalidCourceDeparmentname.csv", 'utf-8');
    const modifiedContent = UploadUtils.updateCSVContentCatalog(fileContent);
    fs.writeFileSync("cypress/fixtures/CatalogFiles/Format-InvalidCourceDeparmentname.csv", modifiedContent);
    
    // Pre-upload catalog count
    preUploadCount = await uploadInstance.preUploadCatalog();
    console.log(preUploadCount);
    
    await uploadInstance.uploadcatalog("cypress/fixtures/CatalogFiles/Format-InvalidCourceDeparmentname.csv", 1);
    await uploadInstance.uplaodcatalogValid(0);
    
    // Verify format error
    await uploadInstance.catalogFormatError();
    
    // Verify confirmation page counts
    await uploadInstance.confirmationPageCountCatalog("2", "+ 2 new active courses", "3" + "1 format errors", "3 rows were successfully transformed", "+ 2 new courses");
    
    // Verify error message in CSV
    await uploadInstance.catalogreadErrorCSVFile("Invalid Course Long Department Name. Should not exceed 500 characters ", 0);
    
    // Post upload
    await uploadInstance.postUpload();
    postUploadCount = await uploadInstance.postUploadCountCatalog();
    console.log(postUploadCount);
    expect(parseInt(postUploadCount)).toEqual(parseInt(preUploadCount) + fileRulecount);
  });

  test.skip("Uploads catalog add function with Invalid Course Credit Units Error", async () => {
    let fileRulecount = 2;
    
    // Read and modify CSV content
    const fs = require('fs');
    let fileContent = fs.readFileSync("cypress/fixtures/CatalogFiles/Format-InvalidCourseCreditUnits.csv", 'utf-8');
    const modifiedContent = UploadUtils.updateCSVContentCatalog(fileContent);
    fs.writeFileSync("cypress/fixtures/CatalogFiles/Format-InvalidCourseCreditUnits.csv", modifiedContent);
    
    // Pre-upload catalog count
    preUploadCount = await uploadInstance.preUploadCatalog();
    console.log(preUploadCount);
    
    await uploadInstance.uploadcatalog("cypress/fixtures/CatalogFiles/Format-InvalidCourseCreditUnits.csv", 1);
    await uploadInstance.uplaodcatalogValid(0);
    
    // Verify format error
    await uploadInstance.catalogFormatError();
    
    // Verify confirmation page counts
    await uploadInstance.confirmationPageCountCatalog("2", "+ 2 new active courses", "3" + "1 format errors", "3 rows were successfully transformed", "+ 2 new courses");
    
    // Verify error message in CSV
    await uploadInstance.catalogreadErrorCSVFile("Invalid Course Credit Units. Should be one of enumerated values. ", 0);
    
    // Post upload
    await uploadInstance.postUpload();
    postUploadCount = await uploadInstance.postUploadCountCatalog();
    console.log(postUploadCount);
    expect(parseInt(postUploadCount)).toEqual(parseInt(preUploadCount) + fileRulecount);
  });

  test.skip("Uploads catalog add function with Invalid effective year error", async () => {
    let fileRulecount = 2;
    
    // Read and modify CSV content
    const fs = require('fs');
    let fileContent = fs.readFileSync("cypress/fixtures/CatalogFiles/Format-InvalidEffectiveYear.csv", 'utf-8');
    const modifiedContent = UploadUtils.updateCSVContentCatalog(fileContent);
    fs.writeFileSync("cypress/fixtures/CatalogFiles/Format-InvalidEffectiveYear.csv", modifiedContent);
    
    // Pre-upload catalog count
    preUploadCount = await uploadInstance.preUploadCatalog();
    console.log(preUploadCount);
    
    await uploadInstance.uploadcatalog("cypress/fixtures/CatalogFiles/Format-InvalidEffectiveYear.csv", 1);
    await uploadInstance.uplaodcatalogValid(0);
    
    // Verify format error
    await uploadInstance.catalogFormatError();
    
    // Verify confirmation page counts
    await uploadInstance.confirmationPageCountCatalog("2", "+ 2 new active courses", "3" + "1 format errors", "3 rows were successfully transformed", "+ 2 new courses");
    
    // Verify error message in CSV
    await uploadInstance.catalogreadErrorCSVFile("Invalid Course Effective Year Month. Should be in YYYY-MM format ", 0);
    
    // Post upload
    await uploadInstance.postUpload();
    postUploadCount = await uploadInstance.postUploadCountCatalog();
    console.log(postUploadCount);
    expect(parseInt(postUploadCount)).toEqual(parseInt(preUploadCount) + fileRulecount);
  });

  test.skip("Uploads catalog add function with Invalid expiration year error", async () => {
    let fileRulecount = 2;
    
    // Read and modify CSV content
    const fs = require('fs');
    let fileContent = fs.readFileSync("cypress/fixtures/CatalogFiles/Format-InvalidExpirationYear.csv", 'utf-8');
    const modifiedContent = UploadUtils.updateCSVContentCatalog(fileContent);
    fs.writeFileSync("cypress/fixtures/CatalogFiles/Format-InvalidExpirationYear.csv", modifiedContent);
    
    // Pre-upload catalog count
    preUploadCount = await uploadInstance.preUploadCatalog();
    console.log(preUploadCount);
    
    await uploadInstance.uploadcatalog("cypress/fixtures/CatalogFiles/Format-InvalidExpirationYear.csv", 1);
    await uploadInstance.uplaodcatalogValid(0);
    
    // Verify format error
    await uploadInstance.catalogFormatError();
    
    // Verify confirmation page counts
    await uploadInstance.confirmationPageCountCatalog("2", "+ 2 new active courses", "3" + "1 format errors", "3 rows were successfully transformed", "+ 2 new courses");
    
    // Verify error message in CSV
    await uploadInstance.catalogreadErrorCSVFile("Invalid Course Effective Year Month. Should be in YYYY-MM format ", 0);
    
    // Post upload
    await uploadInstance.postUpload();
    postUploadCount = await uploadInstance.postUploadCountCatalog();
    console.log(postUploadCount);
    expect(parseInt(postUploadCount)).toEqual(parseInt(preUploadCount) + fileRulecount);
  });

  test.skip("Uploads catalog add function with incorrect institution error", async () => {
    let fileRulecount = 2;
    
    // Read and modify CSV content
    const fs = require('fs');
    let fileContent = fs.readFileSync("cypress/fixtures/CatalogFiles/IncorrectInstitution.csv", 'utf-8');
    const modifiedContent = UploadUtils.updateCSVContentCatalog(fileContent);
    fs.writeFileSync("cypress/fixtures/CatalogFiles/IncorrectInstitution.csv", modifiedContent);
    
    // Pre-upload catalog count
    preUploadCount = await uploadInstance.preUploadCatalog();
    console.log(preUploadCount);
    
    await uploadInstance.uploadcatalog("cypress/fixtures/CatalogFiles/IncorrectInstitution.csv", 1);
    await uploadInstance.uplaodcatalogValid(0);
    
    // Verify critical error
    await uploadInstance.catalogCriticalError();
    
    // Verify confirmation page counts
    await uploadInstance.confirmationPageCountCatalog("2", "+ 2 new active courses", "3" + "1 critical errors", "3 rows were successfully transformed", "+ 2 new courses");
    
    // Verify error message in CSV
    await uploadInstance.catalogreadErrorCSVFile("Invalid Course Effective Year Month. Should be in YYYY-MM format ", 0);
    
    // Post upload
    await uploadInstance.postUpload();
    await page.locator('.ring-red-500 > .opacity-0').click();
    postUploadCount = await uploadInstance.postUploadCountCatalog();
    console.log(postUploadCount);
    expect(parseInt(postUploadCount)).toEqual(parseInt(preUploadCount) + fileRulecount);
  });

  test.skip("Uploads catalog add function with missing course credit max value error", async () => {
    let fileRulecount = 2;
    
    // Read and modify CSV content
    const fs = require('fs');
    let fileContent = fs.readFileSync("cypress/fixtures/CatalogFiles/MissingCourseCreditMaxValue.csv", 'utf-8');
    const modifiedContent = UploadUtils.updateCSVContentCatalog(fileContent);
    fs.writeFileSync("cypress/fixtures/CatalogFiles/MissingCourseCreditMaxValue.csv", modifiedContent);
    
    // Pre-upload catalog count
    preUploadCount = await uploadInstance.preUploadCatalog();
    console.log(preUploadCount);
    
    await uploadInstance.uploadcatalog("cypress/fixtures/CatalogFiles/MissingCourseCreditMaxValue.csv", 1);
    await uploadInstance.uplaodcatalogValid(0);
    
    // Verify critical error
    await uploadInstance.catalogCriticalError();
    
    // Verify confirmation page counts
    await uploadInstance.confirmationPageCountCatalog("2", "+ 2 new active courses", "3" + "1 critical errors 1 format errors", "3 rows were successfully transformed", "+ 2 new courses");
    
    // Verify error message in CSV
    await uploadInstance.catalogreadErrorCSVFile("Invalid Course Effective Year Month. Should be in YYYY-MM format ", 0);
  });

  test.skip("Uploads catalog add function with missing course credit min value error", async () => {
    let fileRulecount = 2;
    
    // Read and modify CSV content
    const fs = require('fs');
    let fileContent = fs.readFileSync("cypress/fixtures/CatalogFiles/MissingCourseCreditMinValue.csv", 'utf-8');
    const modifiedContent = UploadUtils.updateCSVContentCatalog(fileContent);
    fs.writeFileSync("cypress/fixtures/CatalogFiles/MissingCourseCreditMinValue.csv", modifiedContent);
    
    // Pre-upload catalog count
    preUploadCount = await uploadInstance.preUploadCatalog();
    console.log(preUploadCount);
    
    await uploadInstance.uploadcatalog("cypress/fixtures/CatalogFiles/MissingCourseCreditMinValue.csv", 1);
    await uploadInstance.uplaodcatalogValid(0);
    
    // Verify critical error
    await uploadInstance.catalogCriticalError();
    
    // Verify confirmation page counts
    await uploadInstance.confirmationPageCountCatalog("2", "+ 2 new active courses", "3" + "1 critical errors 1 format errors", "3 rows were successfully transformed", "+ 2 new courses");
    
    // Verify error message in CSV
    await uploadInstance.catalogreadErrorCSVFile("Invalid Course Effective Year Month. Should be in YYYY-MM format ", 0);
    
    await page.locator('.ring-red-500 > .opacity-0').click();
    postUploadCount = await uploadInstance.postUploadCountCatalog();
    console.log(postUploadCount);
    expect(parseInt(postUploadCount)).toEqual(parseInt(preUploadCount) + fileRulecount);
  });

  test.skip("Uploads catalog add function with missing course long title error", async () => {
    let fileRulecount = 2;
    
    // Read and modify CSV content
    const fs = require('fs');
    let fileContent = fs.readFileSync("cypress/fixtures/CatalogFiles/MissingCourseLongTitle.csv", 'utf-8');
    const modifiedContent = UploadUtils.updateCSVContentCatalog(fileContent);
    fs.writeFileSync("cypress/fixtures/CatalogFiles/MissingCourseLongTitle.csv", modifiedContent);
    
    // Pre-upload catalog count
    preUploadCount = await uploadInstance.preUploadCatalog();
    console.log(preUploadCount);
    
    await uploadInstance.uploadcatalog("cypress/fixtures/CatalogFiles/MissingCourseLongTitle.csv", 1);
    await uploadInstance.uplaodcatalogValid(0);
    
    // Verify critical error
    await uploadInstance.catalogCriticalError();
    
    // Verify confirmation page counts
    await uploadInstance.confirmationPageCountCatalog("2", "+ 2 new active courses", "3" + "1 critical errors", "3 rows were successfully transformed", "+ 2 new courses");
    
    // Verify error message in CSV
    await uploadInstance.catalogreadErrorCSVFile("Invalid Course Effective Year Month. Should be in YYYY-MM format ", 0);
    
    // Post upload
    await uploadInstance.postUpload();
    await page.locator('.ring-red-500 > .opacity-0').click();
    postUploadCount = await uploadInstance.postUploadCountCatalog();
    console.log(postUploadCount);
    expect(parseInt(postUploadCount)).toEqual(parseInt(preUploadCount) + fileRulecount);
  });

  test.skip("Uploads catalog update function new courses without any errors", async () => {
    let fileRulecount = 3;
    
    // Read and modify CSV content
    const fs = require('fs');
    let fileContent = fs.readFileSync("cypress/fixtures/CatalogFiles/DuplicateCourseIdentifier.csv", 'utf-8');
    const modifiedContent = UploadUtils.updateCSVContentCatalog(fileContent);
    fs.writeFileSync("cypress/fixtures/CatalogFiles/DuplicateCourseIdentifier.csv", modifiedContent);
    
    // Pre-upload catalog count
    preUploadCount = await uploadInstance.preUploadCatalog();
    console.log(preUploadCount);
    
    await uploadInstance.uploadcatalog("cypress/fixtures/CatalogFiles/DuplicateCourseIdentifier.csv", 1);
    await uploadInstance.uplaodcatalogValid(1);
    
    // Verify no errors
    await expect(page.locator('text=Errors')).not.toBeVisible();
    await expect(page.locator('text=Download csv file')).not.toBeVisible();
    
    // Verify confirmation page counts
    await uploadInstance.confirmationPageCountCatalog("3", "+ 3 new active courses", "3", "3 rows were successfully transformed", "+ 3 new courses");
    
    // Post upload
    await uploadInstance.postUpload();
    await page.locator('.ring-red-500 > .opacity-0').click();
    postUploadCount = await uploadInstance.postUploadCountCatalog();
    console.log(postUploadCount);
    expect(parseInt(postUploadCount)).toEqual(parseInt(preUploadCount) + fileRulecount);
  });

  test.skip("Uploads catalog replace function new courses without any errors", async () => {
    let fileRulecount = 3;
    
    // Read and modify CSV content
    const fs = require('fs');
    let fileContent = fs.readFileSync("cypress/fixtures/CatalogFiles/DuplicateCourseIdentifier.csv", 'utf-8');
    const modifiedContent = UploadUtils.updateCSVContentCatalog(fileContent);
    fs.writeFileSync("cypress/fixtures/CatalogFiles/DuplicateCourseIdentifier.csv", modifiedContent);
    
    // Pre-upload catalog count
    preUploadCount = await uploadInstance.preUploadCatalog();
    console.log(preUploadCount);
    
    await uploadInstance.uploadcatalog("cypress/fixtures/CatalogFiles/DuplicateCourseIdentifier.csv", 1);
    await uploadInstance.uplaodcatalogValid(2);
    
    // Verify no errors
    await expect(page.locator('text=Errors')).not.toBeVisible();
    await expect(page.locator('text=Download csv file')).not.toBeVisible();
    
    // Verify confirmation page counts
    await uploadInstance.confirmationPageCountCatalog("3", "+ 3 new active courses", "3", "3 rows were successfully transformed", "+ 3 new courses");
    
    // Post upload
    await uploadInstance.postUpload();
    await page.locator('.ring-red-500 > .opacity-0').click();
    postUploadCount = await uploadInstance.postUploadCountCatalog();
    console.log(postUploadCount);
    expect(parseInt(postUploadCount)).toEqual(3);
  });
});