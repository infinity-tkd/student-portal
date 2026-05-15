const fs = require('fs');
const pdf = require('pdf-parse');

const dataBuffer = fs.readFileSync('c:/Users/darkm/OneDrive/Desktop/Infinity TKD/00_Tech Develop/infinity-taekwondo-student-portal/media/INFINITY_BrandGuide_v1.pdf');

console.log(typeof pdf);
if (typeof pdf === 'function') {
  pdf(dataBuffer).then(function(data) {
    console.log(data.text);
  }).catch(e => console.error(e));
} else if (pdf.default && typeof pdf.default === 'function') {
  pdf.default(dataBuffer).then(function(data) {
    console.log(data.text);
  }).catch(e => console.error(e));
} else {
  console.log("pdf object:", Object.keys(pdf));
}
