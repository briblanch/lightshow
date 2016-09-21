'use strict';

let Hue = require("node-hue-api");
let hueConfig = require('./hue.json');

let HueApi = new Hue.HueApi(hueConfig.ipaddress, hueConfig.username);
let lightState = Hue.lightState;

module.exports = {
	api: HueApi,
	lightState: lightState
}
