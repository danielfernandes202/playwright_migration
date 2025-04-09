const { expect } = require('@playwright/test');
class loginPage{
    constructor(page){
        this.page = page;
        this.landingLoginButton = page.getByRole('button', { name: 'Login' })
        this.emailTextBox = page.getByRole('textbox', { name: 'Email' })//page.locator("email");
        this.passwordTextBox = page.getByRole('textbox', { name: 'Password' });
        this.submitButton = page.getByRole('button', { name: 'Submit' });
        this.myWorkplaceTab = page.getByRole('link', { name: 'My Workplace' });
        this.settingsTab = page.getByRole('link', { name: 'Settings' });
        this.codingSchema = page.locator(".value-wrapper").nth(2);


    }
    async loginuser(user, password){
        await this.landingLoginButton.click();
        await  this.emailTextBox.fill(user);
        //await this.page.keyboard.press("Tab");
        await this.passwordTextBox.fill(password);
        await this.submitButton.click();
        await this.page.waitForURL("**/app/dashboard");
    }
    async navigateToSettings(schema){
        await this.page.setDefaultTimeout(120000);
        await this.myWorkplaceTab.click();
        await this.settingsTab.click();
        await this.page.evaluate((el) => el.scrollIntoView(), await this.codingSchema.elementHandle());
        await expect(this.codingSchema).toContainText(schema);

    }
    loginRoles(email, password, role){
    this.elements.emailInput().type(email);
        this.elements.passwordInput().type(password);
        this.elements.submitButton().click(); 
        cy.url().should('include', '/app/dashboard');
       this.elements.roleIndicator().should('contain',role)
    }
}
module.exports = {loginPage}