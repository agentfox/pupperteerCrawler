const data = require("./meomeo-01-01-34_14-03-2021.json");
const moment = require("moment");
const fs = require("fs");

const currentTime = () => {
    return moment().format("HH-mm-ss_DD-MM-YYYY");
}

const modeFinder = a => 
  Object.values(
    a.reduce((count, e) => {
      if (!(e in count)) {
        count[e] = [0, e];
      }
      
      count[e][0]++;
      return count;
    }, {})
  ).reduce((a, v) => v[0] < a[0] ? a : v, [0, null])[1];
;

const span = 20;
const step = 5;

let res = data.map(arr => {
    let arrOfMode = [];
    for (let index = 0; index < arr.length - span; index+=step) {
        let mode = modeFinder(arr.slice(index, index + span));
        arrOfMode.push(mode);
    }
    return arrOfMode;
})

let result = {
    so1: res[0],
    so2: res[1],
    so3: res[2],
    so4: res[3],
}
fs.writeFileSync(`./mode-span${span}-${currentTime()}.json`, JSON.stringify(result));