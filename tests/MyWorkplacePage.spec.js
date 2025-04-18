import { test, expect } from '@playwright/test';
import { LoginPage } from '../../fixtures/baseClass/loginPage';
import { Filters } from '../../fixtures/baseClass/filters';

test.describe('MyWorkplace Filters', () => {
  let loginPage: LoginPage;
  let filters: Filters;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    filters = new Filters(page);

    await loginPage.visit();
    await loginPage.loginRoles("testtriangulator+109@gmail.com", "Triangulator!11", "Institution Admin");
  });

  test('navigates to myWorkplace', async () => {
    await filters.navigatetomyworkplace();
  });

  test('navigates to IPEDS', async () => {
    await filters.navigatetomyworkplace();
    await filters.navigatetoIPEDS();
  });

  test('filters the ipeds page', async () => {
    await filters.navigatetomyworkplace();
    await filters.navigatetoIPEDS();
    await filters.ipedsFilters();
  });

  test('navigates to district', async () => {
    await filters.navigatetomyworkplace();
    await filters.navigatetodistrict();
  });

  test.skip('filters the district page', async () => {
    await filters.navigatetomyworkplace();
    await filters.navigatetodistrict();
    await filters.ipedsFilters();
  });
});