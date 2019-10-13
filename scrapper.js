// STRATEGY: INFINITE SCROLL/CLICK TO LOAD MORE ITEMS
const puppeteer = require("puppeteer");
const fs = require('fs');
const { PendingXHR } = require('pending-xhr-puppeteer');
(async () => {
    try {
        // Extract partners on the page, recursively check the next page in the URL pattern
        const extractPartners = async () => {
            try {
                let partnersOnPage = [];
                let itemCount;
                while (itemCount !== partnersOnPage.length) {
                    itemCount = partnersOnPage.length;
                    // click loadmore btn
                    await page.click('a#loadMoreButton');
                    await pendingXHR.waitForAllXhrFinished();
                    // recheck the page
                    partnersOnPage = await page.evaluate(() =>
                        Array.from(document.querySelectorAll(".results.dense-row-layout .retail-partner-card")).map(compact => ({
                            title: compact.querySelector("div.description > h3 > a").innerText.trim(),
                            logo: compact.querySelector("div.info > div > div > a > img").src
                        }))
                    );
                }
                return partnersOnPage;
            } catch (error) {
                console.log(error);
            }

        };
        const browser = await puppeteer.launch({headless:false});
        const firstUrl =
            "https://marketingplatform.google.com/about/partners/find-a-partner?page=1";
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0);
        const pendingXHR = new PendingXHR(page);
        await page.goto(firstUrl);
        // console.log(pendingXHR.pendingXhrCount());
        await pendingXHR.waitForAllXhrFinished(); // wait for partners to be loaded
        const partners = await extractPartners();
        // Todo: Update database with partners
        fs.writeFileSync('./partners.txt', partners.map( p => p.title ).join('\n') + '\n');
        await browser.close();
    } catch (error) {
        console.log('err:', error);
    }
})();
