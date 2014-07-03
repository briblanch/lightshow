var extend = require('node.extend');

var StatefulObject = function(config) {
	extend(this, config);
	this._state = {};
};

StatefulObject.prototype.resetState = function() {
	this._state = {};
};


module.exports = StatefulObject;