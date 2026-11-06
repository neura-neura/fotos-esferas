import {test,expect} from '@playwright/test';
import path from 'node:path';
const fixture=path.resolve('tests/fixtures/portrait.svg');
test('Photo editing persists and incomplete exports ask for confirmation',async({page})=>{
 await page.goto('/');await expect(page.locator('#export')).toBeEnabled();
 await page.locator('#files').setInputFiles(fixture);await expect(page.locator('#count')).toHaveText('1 / 9');
 await page.locator('.edit-button').first().click();await page.locator('#editor-number').fill('25');await page.locator('#editor-canvas').press('ArrowRight');await page.locator('#done-editor').click();
 await page.reload();await expect(page.locator('#count')).toHaveText('1 / 9');await expect(page.locator('.card-controls output').first()).toHaveText('25%');
 const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('recuerdos-navidad-v1')));expect(stored.photos[0].x).toBeGreaterThan(0);
 await page.locator('#export').click();await expect(page.locator('#confirm-dialog')).toBeVisible();await page.locator('#confirm-no').click();await expect(page.locator('#confirm-dialog')).not.toBeVisible();
 await page.locator('#export').click();const download=page.waitForEvent('download');await page.locator('#confirm-yes').click();expect((await download).suggestedFilename()).toBe('recuerdos-navidad-carta-75mm.pdf');
});
test('All nine photos fit mobile and desktop layouts and export without confirmation',async({page})=>{
 await page.goto('/');await page.locator('#files').setInputFiles(Array(9).fill(fixture));await expect(page.locator('#count')).toHaveText('9 / 9');
 for(const width of [320,375,390,768,1024,1440]){await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);}
 const download=page.waitForEvent('download');await page.locator('#export').click();await download;await expect(page.locator('#confirm-dialog')).not.toBeVisible();
});

test('An empty sheet downloads after confirmation and stays downloadable',async({page},testInfo)=>{
 await page.goto('/');await expect(page.locator('#count')).toHaveText('0 / 9');
 await expect(page.locator('#export')).toBeEnabled();
 await page.locator('#export').click();await expect(page.locator('#confirm-text')).toContainText('0 de 9');
 await page.locator('#confirm-no').click();await expect(page.locator('#confirm-dialog')).not.toBeVisible();
 await page.locator('#export').click();const pending=page.waitForEvent('download');
 await page.locator('#confirm-yes').click();const download=await pending;
 await download.saveAs(testInfo.outputPath('empty-sheet.pdf'));
 await expect(page.locator('#export')).toBeEnabled();await expect(page.locator('#count')).toHaveText('0 / 9');
});
