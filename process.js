const data = require("./ketquavietlotto-18-02-13_13-03-2021.json");
const moment = require("moment");
const fs = require("fs");

const sampleData = [
    { 
        kyQuay: "00001",
        ngayQuay: "",
        dsgiai : {
            giaiNhat: "3235",
            giaiNhi: ["1246", "4834"],
            giaiBa: ["1345", "8755", "4576"]
        }
    }
];

const accessDeepKey = (arrPath, target) => {
    if(target[arrPath[0]]) {
        let newArr = arrPath.slice(1);
        return newArr.length? accessDeepKey(newArr, target[arrPath[0]]): target[arrPath[0]];
    }
    return null;
}

const extractTarget = (targetArr, data) => {
    let unflattenedArr = data.map(item => {
        let result = [];
        targetArr.forEach(targetPath => {
            let val = accessDeepKey(targetPath, item);
            if(typeof val === "string") {
                result.push(val);
            } else {
                result = result.concat(val);
            }
        });
        return result;
    });
    return [].concat.apply([], unflattenedArr);
}

let path = [
    ["dsgiai", "giaiNhat"]
];
const split = (arrayOfString) => {
    return arrayOfString.map(str => str.split(""));
}

const tranpose = (unTranposedArr) => {
    return unTranposedArr[0].map((_, colIndex) => unTranposedArr.map(row => row[colIndex]));
}

// console.log(extractTarget(path, data.slice(0,5)));

const reStructureData = (data) => {
    return tranpose(split(data));
}
const currentTime = () => {
    return moment().format("HH-mm-ss_DD-MM-YYYY");
}
console.time();
const meomeo = reStructureData(extractTarget(path, data));
console.timeEnd();
console.time();
fs.writeFileSync(`./meomeo-${currentTime()}.json`, JSON.stringify(meomeo));
console.timeEnd();
