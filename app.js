var extend          = require('node.extend');
var StatefulObject  = require('./StatefulObject');
var midi            = require('midi');
var notes           = require('./notes');
var _               = require('lodash');
var TheScientist    = require('./songs/TheScientist');

var configNote = notes.c8;
var currentSong;

var songs = [TheScientist];

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
    console.log("Midi port opened");
}

input.on('message', function(deltaTime, message) {
    if (message[0] == 144 && message[2] > 0) {
        var note = message[1];
        if (note == configNote) {
            configMode.init();
        } else if (configMode._state.started) {
            configMode.onNote(note);
        } else if (currentSong) {
            // call song
            currentSong.onNote(note, Date.now());
        }
    }
});

var configMode = function(){
};
configMode = extend(new StatefulObject, {
    init: function() {
        this.resetState();
        this._state.started = true;
        this._state.noteBuffer = [];
        console.log("Entering config mode");
        return
    },
    onNote: function(note) {
        this._state.noteBuffer.push(note);

        if (this._state.noteBuffer.length == 3) {
            for (var i = 0; i < songs.length; i++) {
                if (songs[i].hook.equals(this._state.noteBuffer)) {
                    currentSong = songs[i];
                    console.log("Current song set to", currentSong.title);
                }
            }

            if (currentSong == null) {
                console.log("Song hook not recognized");
            }

            this.resetState();
        }
    }
});