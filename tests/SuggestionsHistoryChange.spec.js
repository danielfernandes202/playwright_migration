
import { test, expect } from '@playwright/test';
import loginPage, { loginPage }  from '../base_classes/login.js';
import BoostRequest from '../base_classes/Boostrequest.js';
import Suggestion from '../base_classes/suggestions.js';

const loginPage = new loginPage();
const suggestion = new Suggestion();
//const combobox = new BoostRequest();
const boost = new BoostRequest();

test.describe('Suggestion Page', () => {
  test.beforeEach(async ({ page }) => {
    // Visit login page
    await loginPage.visit(page);
  });

  test.only('Verifies that the user can navigate to Suggestion History tab', async ({ page }) => {
    await loginPage.loginRoles(page, 'testtriangulator+109@gmail.com', 'Triangulator!1', 'Institution Admin');
    await suggestion.navigateToNewSuggestionPage(page);
    await suggestion.navigateToHistoryTab(page);
  });

  test.skip('Verifies actions on the history page for Institution Admin', async ({ page }) => {
    await loginPage.loginRoles(page, 'testtriangulator+109@gmail.com', 'Triangulator!1', 'Institution Admin');
    await suggestion.navigateToNewSuggestionPage(page);
    await suggestion.navigateToHistoryTab(page);
    await suggestion.historyNewActions(page);
  });

  test.skip('Verifies actions on the history page for Reviewer role', async ({ page }) => {
    await loginPage.loginRoles(page, 'testtriangulator+9@gmail.com', 'Triangulator!1', 'Reviewer');
    await suggestion.navigateToNewSuggestionPage(page);
    await suggestion.navigateToHistoryTabReviewer(page);
    await suggestion.historyNewActionsReview(page);
  });

  test.skip('Verifies actions on the history page for Triangulator Admin', async ({ page }) => {
    await loginPage.loginRoles(page, 'creditmobility@asu.edu', 'Triangulator!1', 'Triangulator Admin');
    await suggestion.navigateToNewSuggestionPage(page);
    await suggestion.navigateToHistoryTabReviewer(page);
    await suggestion.historyNewActionsTriadmin(page);
  });
});