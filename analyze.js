const data = require("./meomeo-18-03-31_13-03-2021.json");

const sumUpNumberFrequency = (arrOfNums) => {
    let mapping = [];
    arrOfNums.forEach(num => {
        if(!mapping[num]) {
            mapping[num] = {};
            mapping[num].frequency = 0;
            mapping[num].number = num;
        }
        mapping[num].frequency++;
    });
    return mapping.sort((a, b) => b.frequency - a.frequency);
}

let result = data.map(i => {
    return sumUpNumberFrequency(i);
})

console.log(result);