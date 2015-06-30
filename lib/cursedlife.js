/*
 * CursedLife
 * https://github.com/pmcmonagle/cursedlife
 *
 * Copyright (c) 2014 Paul McMonagle
 * Licensed under the MIT license.
 */

'use strict';

var fs        = require('fs'),
    blessed   = require('blessed'),
    templates = require('./engine/templates'),
    Life      = require('./engine/life'),
    Output    = require('./ui/outputb'),
    Input     = require('./ui/inputb');

/**
 * Used to expand a small state to the full width and height
 * required by the simulation.
 * @param {Array} state  The original state to expand
 * @param {Int}   width  The desired expanded width
 * @param {Int}   height The desired expanded height
 * @return {Array}
 *  Returns a copy of the array with the full width and height
 */
function normalizeState(state, width, height) {
    var normalized,
        x,
        y;

    if (state.length >= height && state[0].length >= width) {
        return state;
    }

    normalized = Array.apply(null, new Array(height)).map(function () {
        return Array.apply(null, new Array(width)).map(Boolean);
    });

    for (y = 0; y < state.length; y++) {
        for (x = 0; x < state[0].length; x++) {
            normalized[y][x] = state[y][x];
        }
    }

    return normalized;
}

/**
 * @constructor
 */
function CursedLife() {
    this.posChar      = '#';
    this.negChar      = '.';
    this.isPaused     = true;
    this.generation   = 0;
    this.oldState     = templates.ships.glider;
    this.newState     = [];
    this.timer        = null;
    this.$interval    = 50;
    this.$birthrate   = 3;
    this.$surviverate = 23;

    // TODO
    // Here I'm creating a parent ncurses window,
    // and pass it into UI classes which create
    // children. Does this make sense in blessed?
    this.main   = blessed.screen({autoPadding: true, smartCSR: true});
    this.output = new Output(this.main);
    this.input  = new Input(this.main);
    this.life   = new Life(
        this.main.width,
        this.main.height,
        this.$birthrate,
        this.$surviverate
    );

    var mutableProperties = [
        'generation',
        'birthrate',
        'surviverate',
        'interval',
        'posChar',
        'negChar'
    ];

    Object.defineProperty(this, 'birthrate', {
        get: function () {
            return this.$birthrate;
        },
        set: function (value) {
            this.$birthrate = value;
            this.life.birthrate = value;
        }
    });

    Object.defineProperty(this, 'surviverate', {
        get: function () {
            return this.$surviverate;
        },
        set: function (value) {
            this.$surviverate = value;
            this.life.surviverate = value;
        }
    });

    Object.defineProperty(this, 'interval', {
        get: function () {
            return this.$interval;
        },
        set: function (value) {
            this.$interval = value;
            clearInterval(this.timer);
            this.timer = setInterval(this.tick.bind(this), this.$interval);
        }
    });

    // TODO
    // How does blessed handle input??
    // This is a bit of a hack. I can't get any window
    // other than the last one instantiated to receive
    // input events - so we'll have to use input as a
    // delegate to distribute events to itself or output.
    /*
    this.input.window.on('inputChar', (function (char, charCode, isKey) {
        switch (charCode) {
            case ncurses.keys.NEWLINE:
                if (this.input.inputString === '') {
                    var x = this.output.cursor.x,
                        y = this.output.cursor.y;
                    this.oldState = normalizeState(
                        this.oldState,
                        this.output.window.width,
                        this.output.window.height
                    );
                    this.oldState[y][x] = !this.oldState[y][x];
                } else {
                    this.input.onInputChar(char, charCode, isKey);
                }
                break;
            case ncurses.keys.UP:
            case ncurses.keys.DOWN:
            case ncurses.keys.LEFT:
            case ncurses.keys.RIGHT:
                this.output.onInputChar(char, charCode, isKey);
                break;
            default:
                this.input.onInputChar(char, charCode, isKey);
        }
    }).bind(this));
    */

    this.input.on('start', (function () {
        this.isPaused = false;
    }).bind(this));
    this.input.on('stop', (function () {
        this.isPaused = true;
    }).bind(this));
    this.input.on('next', (function () {
        this.tick(true);
    }).bind(this));
    this.input.on('clear', (function () {
        var width  = this.output.window.width,
            height = this.output.window.height;
        this.oldState = Array.apply(null, new Array(height)).map(function () {
            return Array.apply(null, new Array(width)).map(Boolean);
        });
    }).bind(this));
    this.input.on('set', (function (param, value) {
        if (mutableProperties.indexOf(param) !== -1) {
            if (typeof this[param] === 'number') {
                this[param] = parseInt(value);
            } else {
                this[param] = value.charAt(0);
            }
        }
    }).bind(this));
    this.input.on('load', (function (filename) {
        fs.readFile(filename, 'utf8', (function (err, data) {
            var param;
            data = JSON.parse(data);
            if (data.hasOwnProperty('state')) {
                this.oldState   = data.state;
            }
            for (param in data) {
                if (mutableProperties.indexOf(param) !== -1) {
                    this[param] = data[param];
                }
            }
        }).bind(this));
    }).bind(this));

    this.tick();
    this.timer = setInterval(this.tick.bind(this), this.interval);
}

/**
 * Called every <this.interval> milliseconds.
 * @param {Boolean} force  Will force the tick to generate a
 *                         new game-state, even if the game is
 *                         paused.
 */
CursedLife.prototype.tick = function (force) {
    this.input.draw();
    this.output.draw(
        this.oldState, {
            negChar:     this.negChar,
            posChar:     this.posChar,
            birthrate:   this.birthrate,
            surviverate: this.surviverate,
            interval:    this.interval,
            generation:  this.generation
        }
    );

    if (!this.isPaused || force) {
        this.newState = this.life.createNewGeneration(this.oldState);
        this.oldState = this.newState;
        this.generation++;
    }

    this.main.render();
};

module.exports = CursedLife;
