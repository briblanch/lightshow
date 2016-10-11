let fivetwelve = require('fivetwelve/es5');
let driver     = require('./driver');

let output = new fivetwelve.DmxOutput(driver);

driver.open()
  .then(() => output.start(20)); // output at 20Hz

module.exports = output;
