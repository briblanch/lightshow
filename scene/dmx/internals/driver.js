let ftdi    = require('ftdi');
let Promise = require('bluebird');

const settings = {
  'baudrate': 250000,
  'databits': 8,
  'stopbits': 2,
  'parity'  : 'none',
};

let driver = {
  device: null,
  send(buffer) {
    if (this.device) {
      let sendBuffer = [0x00, ...buffer];
      this.device.write(sendBuffer);
    }
  },
  open() {
    return new Promise((resolve, reject) => {
      ftdi.find((err, devices) => {
        if (!err && devices.length > 0) {
          this.device = new ftdi.FtdiDevice(devices[0]);
          this.device.open(settings, resolve);
        } else {
          reject();
        }
      });
    });
  }
};

module.exports = driver;
