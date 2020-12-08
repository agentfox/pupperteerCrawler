const data = require("./meomeo-23-39-16_06-12-2020.json");

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