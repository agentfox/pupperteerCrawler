
// STRATEGY: VIDEO DOWNLOADER
const request = require('request');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { PendingXHR } = require('pending-xhr-puppeteer');

const resourceUrl = 'https://9gag.com/video';
const downloadPath = path.resolve(__dirname, 'videos/');
//-----

function fileDownloader(link, fileName, ext) {
    if (!fs.existsSync(downloadPath)) {
      fs.mkdir(downloadPath);
    }

    let req = request
      .get(link)
      .on('error', err => {
        return err;
      })
      .on('response', res => {
        if (res.statusCode == 200)
          req.pipe(fs.createWriteStream(path.resolve(downloadPath, `${fileName}.${ext}`)));
      })
  }

function queryAllVideoSrc() {
    const src = [];
    function getSimpleVideoSrc(sourceNode) {
        // Array.from()
        sourceNode.querySelectorAll("video").forEach((item) => {
            const srcInVideo =  item.getAttribute("src");
            if ( srcInVideo ) {
                src.push(srcInVideo);
            } else {
                item.querySelectorAll("source").forEach((source)=>{
                    src.push( source.getAttribute("src") )
                })
            }
        })
    }
    getSimpleVideoSrc( document );
    document.querySelectorAll('iframe').forEach(item => {
        getSimpleVideoSrc( item );
    })

    return src;
}


function classifyVideoExt(arrSrc) {
    const classified = {
        mp4: [],
        webmV8: [],
        webmV9: [],
        others: []
    };
    arrSrc.forEach( src => {
        if( matchExt(src, "mp4") ) {
            classified.mp4.push(src);
        } else if ( matchExt(src, "vvp9.webm") ) {
            classified.webmV9.push(src);
        } else if ( matchExt(src, "svwm.webm") ) {
            classified.webmV8.push(src);
        } else {
            classified.others.push(src);
        }
    })
    return classified;
}
function matchExt(src, ext) {
    const pattern = `.${ext}$`;
    const regx = new RegExp(pattern, "ig");
    return regx.test(src);
}

  (async () => {
      try {
        // Set up browser and page.
        const browser = await puppeteer.launch({
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();
        page.setViewport({
            width: 1280,
            height: 926
        });
        page.setDefaultNavigationTimeout(0);
        const pendingXHR = new PendingXHR(page);
        // Navigate to the demo page.
        await page.goto(resourceUrl);
        await pendingXHR.waitForAllXhrFinished();
        const getAllVidSrc = async () => {
            return await page.evaluate(queryAllVideoSrc)
        };
        const srcList = await getAllVidSrc();
        await browser.close();
        // puppeteer done
        const mp4Src =  classifyVideoExt(srcList).mp4;
        mp4Src.forEach((src, index) => {
            fileDownloader(src, '9gag' + index, "mp4" )
        })
        // Save extracted items to a file.
        // fs.writeFileSync('./videosrc.txt', mp4Src.join('\n') + '\n');
      } catch (error) {
          console.log(error)
      }

  })();