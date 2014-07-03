var Hue = require("node-hue-api");
var HueApi = new Hue.HueApi();

var hueConfig = {
	ipaddress: null,
	username: null,
	userDescription: "lightman"
};

var displayUserResult = function(result) {
    console.log(JSON.stringify(result));
};

var displayError = function(err) {
    console.log(err);
};

var bridgesFound = function(bridges) {
	console.log("Bridges found:", JSON.stringify(bridges));
	hueConfig.ipaddres = bridges[0].ipaddress;
	registerUser();
};

var registerUser = function() {
	HueApi.registerUser(hueConfig.ipaddress, null, hueConfig.username)
};

Hue.locateBridges().then(bridgesFound);

