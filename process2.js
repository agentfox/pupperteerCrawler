



////// ABANDONED!!!





const data = require("./ketquavietlotto-01_04_11-02_10_2020.json");
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
    ["dsgiai", "giaiNhat"],
    ["dsgiai", "giaiNhi"],
    ["dsgiai", "giaiBa"]
];
// const split = (arrayOfString) => {
//     return arrayOfString.map(str => str.split(""));
// }

// const tranpose = (unTranposedArr) => {
//     return unTranposedArr[0].map((_, colIndex) => unTranposedArr.map(row => row[colIndex]));
// }

// // console.log(extractTarget(path, data.slice(0,5)));

// const reStructureData = (data) => {
//     return tranpose(split(data));
// }
console.time("start process data")
const meomeo = extractTarget(path, data);
console.timeEnd("done process data")
console.time("start write data")
fs.writeFileSync(`./gaugau.json`, JSON.stringify(meomeo))
console.timeEnd("stop write data")
