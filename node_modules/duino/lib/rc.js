/*
 * Main RC constructor
 * Process options
 * Tell the board to set it up
 */
var RC = function (options) {
  	if (!options || !options.board) throw new Error('Must supply required options to LED');
  	this.board = options.board;
  	this.pin = this.board.normalizePin(options.pin || 10);
}

RC.prototype.sendOff = function(channel) {
	var msg = '95' + this.pin + channel;
	this.board.write(msg);
}

RC.prototype.sendOn = function (channel) {
  	var msg = '96' + this.pin + channel;
  	this.board.write(msg);	
}

module.exports = RC;