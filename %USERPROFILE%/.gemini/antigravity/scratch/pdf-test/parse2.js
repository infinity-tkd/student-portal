const fs = require('fs');
const pdf = require('pdf-parse');
let dataBuffer = fs.readFileSync('c:/Users/darkm/OneDrive/Desktop/Infinity TKD/00_Tech Develop/infinity-taekwondo-student-portal/media/INFINITY_BrandGuide_v1.pdf');
pdf(dataBuffer).then(function(data) {
  console.log(data.text);
}).catch(e => console.error(e));
