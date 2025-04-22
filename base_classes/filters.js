const { expect } = require('@playwright/test');

class Filters {
    constructor(page) {
        this.page = page;
    }

    async navigatetomyworkplace(page) {
        await page.locator(':nth-child(3) > .text-grey-600').click();
        await expect(page).toHaveURL(/\/my-workspace/);
    }

    async navigatetoIPEDS(page) {
        await page.locator('.px-4 > .relative > .opacity-0').click();
        await page.locator(':nth-child(8) > :nth-child(2) > .w-full > .flex-1').click();
        await expect(page).toHaveURL(/\/ipeds/);
    }

    async ipedsFilters(page) {
        await page.locator('.gap-6 > div > .rounded-full').click();
        await page.locator(':nth-child(1) > #dropdown-trigger > .rounded-md > .relative > .justify-center')
            .fill("arizona");
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');

        await page.locator(':nth-child(2) > #dropdown-trigger > .rounded-md > .relative > .justify-center')
            .fill("arizona state university");
        await page.waitForTimeout(5000);
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');

        await page.locator(':nth-child(2) > .relative > .opacity-0').click();
        await expect(page.locator('text=Filters')).toBeVisible();
        await expect(page.locator('text=Arizona')).toBeVisible();
        await page.locator('.underline').click();

        await page.locator('.gap-6 > div > .rounded-full').click();
        await page.locator(':nth-child(3) > #dropdown-trigger > .rounded-md > .relative > .justify-center')
            .fill("104151");
        await page.waitForTimeout(5000);
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');

        await page.locator(':nth-child(2) > .relative > .opacity-0').click();
        await expect(page.locator('text=Filters')).toBeVisible();
        await expect(page.locator('text=Arizona')).toBeVisible();
        await page.locator('.underline').click();
    }

    async navigatetodistrict(page) {
        await page.locator('.px-4 > .relative > .opacity-0').click();
        await page.locator(':nth-child(8) > :nth-child(1) > .w-full > .flex-1').click();
        await expect(page).toHaveURL(/\/districts/);
    }

    async districtfilters(page) {
        await page.locator('.gap-6 > div > .rounded-full').click();
        await page.locator(':nth-child(1) > #dropdown-trigger > .rounded-md > .relative > .justify-center')
            .fill("arizona");
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');

        await page.locator(':nth-child(2) > #dropdown-trigger > .rounded-md > .relative > .justify-center')
            .fill("arizona state university");
        await page.waitForTimeout(5000);
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');

        await page.locator(':nth-child(2) > .relative > .opacity-0').click();
        await expect(page.locator('text=Filters')).toBeVisible();
        await expect(page.locator('text=Arizona')).toBeVisible();
        await page.locator('.underline').click();
    }
}

module.exports ={Filters};