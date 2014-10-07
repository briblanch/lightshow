var extend = require('node.extend');
var colors = require('colors');

var StatefulObject = function() {
	this.state = {};
};

StatefulObject.prototype.resetState = function() {
	this.state = {};
};

module.exports = StatefulObject;
