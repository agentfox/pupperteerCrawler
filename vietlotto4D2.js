const puppeteer = require('puppeteer');
const fs = require("fs");
const moment = require("moment");

const currentTime = () => {
    return moment().format("HH-mm-ss_DD-MM-YYYY");
}

let scrape = async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    let index = 0;
    let pageNumber = 1;
    let results = [];
    let isEnd = false;

    await page.goto('https://vietlott.vn/vi/trung-thuong/ket-qua-trung-thuong/winning-number-max-4d');

    setTimeout(() => {
        isEnd = true;
    }, 800000);
    while (!isEnd) {
        console.log("loading page " + pageNumber);
        // wait 1 sec for page load
        await page.waitFor(2000);
        let isLastVisiblePage = (index + 1) % 5 == 0;
        const {done, data} = await extractedEvaluateCall(page);
        results = results.concat(data);
        console.log('isdone : ', done);
        if (done) break;
        pageNumber++
        // no next button on last page

        console.log(isLastVisiblePage,"-",index)
        if (isLastVisiblePage) {
            await page.click('#divRightContent > div > div > ul > li:last-child > a');
            await page.waitFor(2000);
            index = 0;
        } else {
            index++;
        }
        try {
            await page.click(`#divRightContent > div > div > ul > li:nth-child(${index + 2}) > a`);
        } catch (error) {
            isEnd = true;
        }
    }

    browser.close();
    return results;
};

async function extractedEvaluateCall(page) {
    // just extracted same exact logic in separate function
    // this function should use async keyword in order to work and take page as argument
    return page.evaluate(() => {
        let data = [];
        let elements = document.querySelectorAll('#divRightContent > div > table > tbody > tr');
        let isDone = false;
        const parseResult = (str, length = 4) => {
            let number = parseInt(str);
            var my_string = '' + number;
            while (my_string.length < length) {
                my_string = '0' + my_string;
            }
            return my_string;
        } 
        for (var element of elements) {
            let kyQuay = element.querySelector("td > div:nth-child(1) > a").textContent;
            let temp = element.querySelector("td > div:nth-child(1)").textContent;
            let ngayQuay = temp.slice(temp.length - 10);
            let temp2 = element.querySelectorAll(
                "td > div.tong_day_so_ket_qua.text-center .day_so_ket_qua_v2"
                );
            let dsgiai = {
                giaiNhat: null,
                giaiNhi: [],
                giaiBa: []
            }
            temp2.forEach((item, index) => {
                if(index == 0) {
                    dsgiai.giaiNhat = parseResult(item.textContent);
                } else if (index == 1 || index == 2) {
                    dsgiai.giaiNhi.push(parseResult(item.textContent));
                } else if (index < 6) {
                    dsgiai.giaiBa.push(parseResult(item.textContent));
                }
            })

            if (kyQuay === "00001") {
                console.log("we are in the last page")
                isDone = true;
            }
            data.push({ kyQuay, ngayQuay, dsgiai });
        }

        return {done: isDone, data};
    });
}

scrape().then((value) => {
    console.log('Collection length: ' + value.length);
    console.log(value[0]);
    console.log(value[value.length - 1]);
    fs.writeFileSync(`./ketquavietlotto-${currentTime()}.json`, JSON.stringify(value));
});