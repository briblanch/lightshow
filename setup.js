'use strict';

let Hue = require("node-hue-api");
let HueApi = new Hue.HueApi();

let hueConfig = {
	ipaddress: null,
	username: null,
	userDescription: "lightman"
};

let displayUserResult = function(result) {
  console.log(JSON.stringify(result));
};

let displayError = function(err) {
  console.log(err);
};

let bridgesFound = function(bridges) {
	console.log("Bridges found:", JSON.stringify(bridges));
	hueConfig.ipaddres = bridges[0].ipaddress;
	registerUser();
};

let registerUser = function() {
	HueApi.registerUser(hueConfig.ipaddress, null, hueConfig.username)
};

Hue.locateBridges().then(bridgesFound);
