/*
 * CursedLife
 * https://github.com/pmcmonagle/cursedlife
 *
 * Copyright (c) 2014 Paul McMonagle
 * Licensed under the MIT license.
 */

'use strict';

var fs        = require('fs'),
    ncurses   = require('ncurses'),
    widgets   = require('ncurses/lib/widgets'),
    templates = require('./engine/templates'),
    Life      = require('./engine/life'),
    Output    = require('./ui/output'),
    Input     = require('./ui/input');

function CursedLife() {
    this.posChar      = '#';
    this.negChar      = '.';
    this.birthrate    = 3;
    this.surviverate  = 23;
    this.isPaused     = true;
    this.interval     = 50;
    this.generation   = 0;
    this.oldState     = templates.ships.glider;
    this.newState     = [];
    this.timer        = null;

    this.main   = new ncurses.Window();
    this.output = new Output(this.main);
    this.input  = new Input(this.main);
    this.life   = new Life(
        this.main.width,
        this.main.height,
        this.birthrate,
        this.surviverate
    );

    /**
     * This is a bit of a hack. I can't get any window
     * other than the last one instantiated to receive
     * input events - so we'll have to use input as a
     * delegate to distribute events to itself or output.
     */
    this.input.window.on('inputChar', (function (char, charCode, isKey) {
        switch (charCode) {
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

    this.input.on('start', (function () {
        this.isPaused = false;
    }).bind(this));
    this.input.on('stop', (function () {
        this.isPaused = true;
    }).bind(this));
    this.input.on('next', (function () {
        this.tick(true);
    }).bind(this));
    this.input.on('set', (function (param, value) {
        var validForInt = [
                'generation',
                'birthrate',
                'surviverate',
                'interval'
            ],
            validForString = [
                'negChar',
                'posChar'
            ];

        if (!isNaN(value) && validForInt.indexOf(param) !== -1) {
            this[param] = parseInt(value);
            if (param === 'birthrate' || param === 'surviverate') {
                this.life[param] = value;
            }
            if (param === 'interval') {
                clearInterval(this.timer);
                this.timer = setInterval(this.tick.bind(this), this.interval);
            }
        } else {
            this[param] = value.charAt(0);
        }
    }).bind(this));
    this.input.on('load', (function (filename) {
        fs.readFile(filename, 'utf8', (function (err, data) {
            data = JSON.parse(data);
            if (data.hasOwnProperty('state')) {
                this.oldState = data.state;
            }
        }).bind(this));
    }).bind(this));

    this.tick();
    this.timer = setInterval(this.tick.bind(this), this.interval);
}

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
};

module.exports = CursedLife;
