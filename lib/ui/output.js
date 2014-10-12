/**
 * This Class represents the output window.
 */
'use strict';

var ncurses = require('ncurses');

/**
 * @constructor
 * @param {ncurses.Window} parent  Pass in the parent window.
 */
function OutputWindow(parent) {
    this.x = 0;
    this.y = 0;
    this.height = parent.height - 3;
    this.width  = 0;
    this.cursor = {x: 0, y: 0};

    // Note:
    // I started by trying to extend ncurses.Window, but it
    // turns out that using ncurses.Window.prototype causes
    // a segmentation fault.
    this.window = new ncurses.Window(this.height, this.width, this.y, this.x);
}

OutputWindow.prototype.onInputChar = function (char, charCode, isKey) {
    switch (charCode) {
        case ncurses.keys.UP:
            if (this.cursor.y > 1) {
                this.cursor.y--;
            }
            break;
        case ncurses.keys.LEFT:
            if (this.cursor.x > 1) {
                this.cursor.x--;
            }
            break;
        case ncurses.keys.DOWN:
            if (this.cursor.y < this.window.height - 1) {
                this.cursor.y++;
            }
            break;
        case ncurses.keys.RIGHT:
            if (this.cursor.x < this.window.width - 1) {
                this.cursor.x++;
            }
            break;
        default:
            return;
    }
};

/**
 * This method will draw:
 *  - A bold frame around the edges of the output window.
 *  - The current state of the simulation using supplied characters.
 *  - The current state of all variables controlled by the user.
 * @param {Array} state    Pass in a two-dimensional array of Booleans
 *                         Representing the game state.
 * @param {Object} config  Pass in a configuration object that holds the
 *                         user-controlled variables.
 */
OutputWindow.prototype.draw = function (state, config) {
    var x,
        y,
        char;
    this.window.boldframe(
        '< CursedLife: A Game of Life Simulator by Paul McMonagle >',
        '[ Generation: '  + config.generation +
        ', Birthrate: '   + config.birthrate +
        ', SurviveRate: ' + config.surviverate +
        ', interval: '    + config.interval +
        ', PosChar: "'    + config.posChar + '"' +
        ', NegChar: "'    + config.negChar + '"' +
        ' ]'
    );
    for (y = 1; y < this.window.height - 2; y++) {
        for (x = 1; x < this.window.width - 2; x++) {
            if (state[y] !== undefined) {
                char = state[y][x] ? config.posChar : config.negChar;
            } else {
                char = config.negChar;
            }
            this.window.addstr(y, x, char);
        }
    }
    this.window.cursor(this.cursor.x, this.cursor.y);
    this.window.refresh();
};

module.exports = OutputWindow;
