const json2xls = require('json2xls');
const data = require("./ketquavietlotto-18-02-13_13-03-2021.json");
const fs = require("fs");
const moment = require("moment");

const currentTime = () => {
    return moment().format("HH-mm-ss_DD-MM-YYYY");
}

var xls = json2xls(data);

fs.writeFileSync(`./ketquavietlotto-${currentTime()}.xlsx`, xls, 'binary');