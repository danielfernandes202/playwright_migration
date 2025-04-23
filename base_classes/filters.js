const { expect } = require('@playwright/test');


class Filters {
    constructor(page) {
        this.page = page;
    }

    async navigatetomyworkplace() {
        await this.page.locator('//span[text()="My Workplace"]').click();
        await expect(this.page).toHaveURL(/\/my-workspace/);
    }

    async navigatetoIPEDS() {
        await this.page.locator('//div[text()=" IPEDS "]').click();
        // await this.page.locator(':nth-child(8) > :nth-child(2) > .w-full > .flex-1').click();
        await expect(this.page).toHaveURL(/\/ipeds/);
    }

    async ipedsFilters() {
        await this.page.locator('.gap-6 > div > .rounded-full').click();
        await this.page.locator('//input[@id="combobox-input"]').nth(0)
            .fill("arizona");
        await this.page.keyboard.press('ArrowDown');
        await this.page.keyboard.press('Enter');

        await this.page.locator('//input[@id="combobox-input"]').nth(1)
            .fill("arizona state university");
        await this.page.waitForTimeout(5000);
        await this.page.keyboard.press('ArrowDown');
        await this.page.keyboard.press('Enter');

        await this.page.locator(':nth-child(2) > .relative > .opacity-0').click();
        await expect(this.page.locator('text=Filters')).toBeVisible();
        await expect(this.page.locator('text=Arizona').nth(0)).toBeVisible();
        await this.page.locator('.underline').click();

        await this.page.locator('.gap-6 > div > .rounded-full').click();
        await this.page.locator('//input[@id="unique-identifiers-input"]')
            .fill("104151");
        await this.page.waitForTimeout(5000);
        await this.page.keyboard.press('ArrowDown');
        await this.page.keyboard.press('Enter');

        await this.page.locator(':nth-child(2) > .relative > .opacity-0').click();
        await expect(this.page.locator('text=Filters')).toBeVisible();
        await expect(this.page.locator('text=Arizona').nth(0)).toBeVisible();
        await this.page.locator('.underline').click();
    }

    async navigatetodistrict() {
        await this.page.locator('.px-4 > .relative > .opacity-0').click();
        await this.page.locator(':nth-child(8) > :nth-child(1) > .w-full > .flex-1').click();
        await expect(this.page).toHaveURL(/\/districts/);
    }

    async districtfilters() {
        await this.page.locator('.gap-6 > div > .rounded-full').click();
        await this.page.locator(':nth-child(1) > #dropdown-trigger > .rounded-md > .relative > .justify-center')
            .fill("arizona");
        await this.page.keyboard.press('ArrowDown');
        await this.page.keyboard.press('Enter');

        await this.page.locator(':nth-child(2) > #dropdown-trigger > .rounded-md > .relative > .justify-center')
            .fill("arizona state university");
        await this.page.waitForTimeout(5000);
        await this.page.keyboard.press('ArrowDown');
        await this.page.keyboard.press('Enter');

        await this.page.locator(':nth-child(2) > .relative > .opacity-0').click();
        await expect(this.page.locator('text=Filters')).toBeVisible();
        await expect(this.page.locator('text=Arizona')).toBeVisible();
        await this.page.locator('.underline').click();
    }
}
module.exports = { Filters };