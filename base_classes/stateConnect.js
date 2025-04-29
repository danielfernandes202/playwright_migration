const { test, expect } = require('@playwright/test');

class stateConnect{
    constructor(page){
        this.page = page;
        this.MytriangulatorTab = page.getByRole('link', { name: 'My Triangulator' });
        this.uploadButton = page.getByRole('button', { name: 'Upload' })
        this.stateConnectRadio = page.getByRole('radio', { name: 'State connect data' })
        this.nextButton = page.getByText('Loading... Next');
        this.fileUpload = page.locator(".overflow-y-auto > label > button");
        this.acknowledgeCheckbox = page.getByRole('checkbox', { name: 'Toggle accept changes' });


    }
    async navigateToUpload(){ 
        await this.MytriangulatorTab.click();
        await this.uploadButton.click();
        await this.stateConnectRadio.click();
        await this.nextButton.click();
    }
    async stateConnectUpload(file, action){
        await  this.page.setInputFiles('#file',file)
        await this.page.getByRole('radio', { name: action }).click();
        await this.nextButton.click();
        await this.page.waitForURL("**/app/equivalency/upload/**")
        await this.acknowledgeCheckbox.click();

    }
    async stateConnectUploadValidator(instcount, rulecount, instInFile, instLoaded, ruleInFile, ruleLoaded) {
        const text2xlLocators = this.page.locator(".text-4xl");
        const mt2Locators = this.page.locator(".mt-2");
    
        const expectedTexts = [instcount, rulecount, instInFile, instLoaded, ruleInFile, ruleLoaded];
        const locators = [
            text2xlLocators.nth(0),
            text2xlLocators.nth(1),
            mt2Locators.nth(0),
            mt2Locators.nth(1),
            mt2Locators.nth(2),
            mt2Locators.nth(3)
        ];
        for (let i = 0; i < expectedTexts.length; i++) {
            expect(await locators[i]).toContainText(expectedTexts[i]);
        }
    }
    async decisionOnUploadSummary(){
        await this.page.getByRole('button', { name: 'Cancel' }).click();
        await this.page.waitForURL("https://uat.creditmobility.net/app/dashboard")
    }
}
module.exports = {stateConnect}