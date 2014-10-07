var Hue = require("node-hue-api");
var hueConfig = require('./hue.json');

var HueApi = new Hue.HueApi(hueConfig.ipaddress, hueConfig.username);
var lightState = Hue.lightState;

module.exports = {
	api: HueApi,
	lightState: lightState
}
