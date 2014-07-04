var extend = require('node.extend');

var StatefulObject = function() {
	this.state = {};
};

StatefulObject.prototype.resetState = function() {
	this.state = {};
};


module.exports = StatefulObject;