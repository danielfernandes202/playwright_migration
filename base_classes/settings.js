const { expect } = require('@playwright/test');
class Settings{
    constructor(page){
        this.page = page;
        this.seeAll = page.locator('.link');
        this.pageSubHeading = page.locator('.font-semibold.mb-2');
        this.dropdown = page.locator('#dropdown-trigger'); /// for adding distructors
        this.addConfigButton = page.locator('.opacity-0.gap-2');
        this.addConfigDropDowns = page.locator(".px-2.text-lg");
    }
async navigateToSettings(){
    await this.page.setDefaultTimeout(120000);
    await this.page.getByRole('link', { name: 'My Workplace' }).click();
    await this.page.getByRole('link', { name: 'Settings' }).click();
    await this.page.waitForTimeout(5000);
}
async stateConnectTextValidation(){
    expect(await this.page.locator(".mb-2").nth(3)).toHaveText("Receive state connect suggestions");
    expect(await this.page.locator(".mb-4").nth(3)).toHaveText("Turning this setting on allows your institution to receive suggestions discovered by patterns in state common course numbering based on existing rules and accepted suggestions. The state align and threshold value will send suggestions when your institution has an absence of a rule or is out of alignment with a rule that is part of a state common course number.");
}
async stateConnectToggle(){
    await this.page.locator('label').filter({ hasText: 'State connect' }).locator('div').click();
    await this.page.getByRole('button', { name: 'Save' }).click();
}
async navigateToInstitutionConfiguration(){
    expect(await this.pageSubHeading.nth(1)).toHaveText("Institution configurations");
    await this.seeAll.first().click();
    expect(await this.page.locator(".text-2xl")).toHaveText("Institution configurations");
}
async addConfigurations(levelValue){
    await this.addConfigButton.click();
    await this.page.getByRole('combobox', { name: 'Configuration' }).click();
    await this.page.getByLabel('Add configurations').getByText(levelValue).click(); // can be changed. 
    if(levelValue == "Graduate"){
        await this.page.getByRole('combobox', { name: 'Minimum value' }).fill('100');
        await this.page.getByRole('combobox', { name: 'Maximum value' }).fill('200');
    }else{
    await this.page.waitForTimeout(2000);
    await this.page.getByRole('combobox', { name: 'Minimum value' }).fill('100');
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('Enter');
    await this.page.getByRole('combobox', { name: 'Maximum value' }).fill('200');
    await this.page.waitForTimeout(2000);
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('Enter');
}
    //await this.page.getByRole('button', { name: 'Submit' }).click();

    await this.page.waitForTimeout(2000);

}
}

module.exports = {Settings}