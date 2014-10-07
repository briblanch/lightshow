var log = function() {};

log.debug = function() {
	var args = [].slice.call(arguments);
    console.log(String(+new Date()).grey + ' lightman '.green + args.shift().magenta + ' ' + args.join(', '));
};

module.exports = log;
