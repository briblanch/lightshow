let hue         = require('node-hue-api');

let hueConfig   = require('./hueConfig');

let HueApi      = hue.HueApi;
let lightState  = hue.lightState;

let hostname    = hueConfig.ipaddress,
    username    = hueConfig.username,
    api         = new HueApi(hostname, username);

let lights = {
  left: 1,
  right: 2,
  spotlight: 3,
  desk: 4,
  bed: 5,
  piano: 6
};

lights.allLights = Object.keys(lights).map((key) => {
  return lights[key];
});

lights.strips = [lights.bed, lights.piano];
lights.bulbs = [lights.left, lights.right, lights.desk];
lights.notPiano = [lights.left, lights.right, lights.desk, lights.spotlight, lights.bed];

module.exports = {
  lights,
  api,
  lightState
};
