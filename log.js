var log = function() {};

log.prototype.debug = function() {
	var args = [].slice.call(arguments);
    console.log(String(+new Date()).grey + ' duino '.blue + args.shift().magenta + ' ' + args.join(', '));
};

module.exports = log;