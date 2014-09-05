var extend              = require('node.extend');
var StatefulObject      = require('./StatefulObject');
var midi                = require('midi');
var notes               = require('./notes');
var _                   = require('lodash');
var TheScientist        = require('./songs/TheScientist');
var FightForYourRight   = require('./songs/FightForYourRight');
var PianoMan            = require('./songs/PianoMan')
var Clocks              = require('./songs/Clocks');
var Mirrors             = require('./songs/Mirrors');
var log                 = require('./log');

var configNote = notes.c8;
var currentSong;

var songs = [TheScientist, Clocks, Mirrors, FightForYourRight, PianoMan];

var input = new midi.input();

Array.prototype.equals = function(array) {
    if (this.length != array.length) {
        return false;
    } else {
        for (var i = 0; i < this.length; i++) {
            if (this[i] != array[i]) {
                return false
            }
        }

        return true;
    }
};

Array.prototype.contains = function(array) {
    return _.intersection(this, array).equals(array);
};

if (input.getPortCount()) {
    input.openPort(0);
    log.debug("midi port opened");
}

input.on('message', function(deltaTime, message) {
    if (message[0] == 144 && message[2] > 0) {
        var note = message[1];
        if (note == configNote) {
            configMode.init();
        } else if (configMode.state.started) {
            configMode.onNote(note);
        } else if (currentSong) {
            // call song
            currentSong.onNote(note, Date.now());
        }
    }
});

var configMode = function() {
    StatefulObject.call(this);
};

configMode = extend(new StatefulObject, {
    init: function() {
        this.resetState();
        this.state.started = true;
        this.state.noteBuffer = [];
        log.debug("entering config mode");
        return
    },
    onNote: function(note) {
        this.state.noteBuffer.push(note);

        if (this.state.noteBuffer.length == 3) {
            for (var i = 0; i < songs.length; i++) {
                if (songs[i].hook.equals(this.state.noteBuffer)) {
                    currentSong = songs[i];
                    log.debug("current song set to", currentSong.title);
                }
            }

            if (currentSong == null) {
                log.debug("song hook not recognized");
            }

            this.resetState();
        }
    }
});