const puppeteer = require('puppeteer');
const download = require('image-downloader');
/* (async () => {
    try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    page.setViewport({ width: 1280, height:720 });
    await page.goto('http://kenh14.vn', { waitUntil: 'networkidle2' });
    await page.screenshot({path: 'kenh14.png'});

    await browser.close();
    }
    catch(err) {
            throw err
    }
})();
 */
/* (async() => {
    try {   
        // Mở trình duyệt mới và tới trang của kenh14
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto('http://kenh14.vn');

        // Chạy đoạn JavaScript trong hàm này, đưa kết quả vào biến article
        const articles = await page.evaluate(() => {
            let titleLinks = document.querySelectorAll('h3.knswli-title > a');
            titleLinks = [...titleLinks];
            let articles = titleLinks.map(link => ({
                title: link.getAttribute('title'),
                url: link.getAttribute('href')
            }));
            return articles;
        });

        // In ra kết quả và đóng trình duyệt
        console.log(articles);
        await browser.close();
    }
    catch(err) {
            throw err
    }
})(); */

(async() => {
     try {  
        const browser = await puppeteer.launch();
        console.log('Browser openned');
        const page = await browser.newPage();
        const url = 'http://kenh14.vn/ai-roi-cung-khac-cac-hot-girl-nay-cung-khong-ngoai-le-khi-vong-1-cu-ngay-cang-phong-phao-20171207193958533.chn';
        await page.goto(url);
        console.log('Page loaded');

        const imgLinks = await page.evaluate(async () => {
            let imgElements = await document.querySelectorAll('.kbwc-cover > img, .sp-img-zoom > img, .sp-img-lightbox > img, .detail-img-lightbox > img');
            imgElements = [...imgElements];
            let imgLinks = await imgElements.map(i => i.getAttribute('src'));
            return imgLinks;
        });
        console.log(typeof imgLinks);

        // Tải các ảnh này về thư mục hiện tại
       /*  await Promise.all(imgLinks.map(imgUrl => download.image({
            url: imgUrl,
            dest: __dirname
        }))).then(()=> {
            console.log("done");
            
        })
        .catch((err)=> {
            throw err
        }) */

        await browser.close();

     }
    catch(err) {
            throw err
    } 

})();
