// External Modules
var extend              = require('node.extend');
var midi                = require('midi');
var _                   = require('lodash');

// Internal Modules
var StatefulObject      = require('./StatefulObject');
var notes               = require('./notes');
var log                 = require('./log');

// Songs
var TheScientist            = require('./songs/TheScientist');
var FightForYourRight       = require('./songs/FightForYourRight');
var PianoMan                = require('./songs/PianoMan')
var Clocks                  = require('./songs/Clocks');
var Mirrors                 = require('./songs/Mirrors');
var Yellow                  = require('./songs/Yellow');
var FixYou                  = require('./songs/FixYou');
var BlankSpace              = require('./songs/BlankSpace');
var CantHelpFallingInLove   = require('./songs/CantHelpFallingInLove');
var ASkyFullOfStars         = require('./songs/ASkyFullOfStars');
var UsAgainstTheWorld       = require('./songs/UsAgainstTheWorld');

// configNotes is the highest note on an 88 keyboard by default
var configNote = notes.c8;
var currentSong;
var currentBackingTrack;

var songs = [TheScientist, Clocks, Mirrors, FightForYourRight, PianoMan, Yellow,
            FixYou, BlankSpace, CantHelpFallingInLove, ASkyFullOfStars, UsAgainstTheWorld];

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

// Opens the first avaliable MIDI port
if (input.getPortCount()) {
    input.openPort(0);
    log.debug("midi port opened");
}

// The entry point of the program
input.on('message', function(deltaTime, message) {
    if (message[0] == 144 && message[2] > 0) {
        var note = message[1];
        if (note == configNote) {
            if (currentSong) {
                currentSong.resetState();

            }
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

        if (currentSong) {
            currentSong.resetState();

            if (currentBackingTrack) {
                currentBackingTrack.kill('SIGINT');
                currentBackingTrack = null;
            }
        }
    },
    onNote: function(note) {
        this.state.noteBuffer.push(note);

        if (this.state.noteBuffer.length == 3) {
            for (var i = 0; i < songs.length; i++) {
                if (songs[i].hook.equals(this.state.noteBuffer)) {
                    currentSong = songs[i];
                    log.debug("current song set to", currentSong.title);

                    // Starting backing track if one exists
                    if (currentSong.backingTrack) {
                        log.debug("Starting backing track for ", currentSong.title);
                        // Returns the process playing the backing track
                        currentBackingTrack = currentSong.backingTrack();
                    }
                }
            }

            if (currentSong == null) {
                log.debug("song hook not recognized");
            }

            this.resetState();
        }
    }
});
