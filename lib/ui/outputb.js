/**
 * This Class represents the output window.
 */
'use strict';

var blessed = require('blessed');

/**
 * @constructor
 * @param {ncurses.Window} parent  Pass in the parent window.
 */
function OutputWindow(parent) {
    this.x = 0;
    this.y = 0;
    this.height = parent.height - 3;
    this.width  = '100%';
    this.cursor = {x: 2, y: 2};

    // Note:
    // I started by trying to extend ncurses.Window, but it
    // turns out that using ncurses.Window.prototype causes
    // a segmentation fault.
    this.window =  blessed.box({
        top:     this.y,
        left:    this.x,
        width:   this.width,
        height:  this.height,

        border:  { type: 'bg' },
        style:   { border: { bg: '#FFFFFF' } }
    });
    parent.append(this.window);
}

OutputWindow.prototype.onInputChar = function (char, charCode, isKey) {
    var ncurses = {}; // FIXME
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
        line;

    // TODO
    // The label is pretty ugly. I'm sure I can pretty it up.
    this.window.setLabel({
        text: '< CursedLife: A Game of Life Simulator by Paul McMonagle >' +
              '[ Generation: '  + config.generation +
              ', Birthrate: '   + config.birthrate +
              ', SurviveRate: ' + config.surviverate +
              ', interval: '    + config.interval +
              ', PosChar: "'    + config.posChar + '"' +
              ', NegChar: "'    + config.negChar + '"' +
              ' ]',
        side: 'right'
    });

    // TODO
    // How do I draw the cursor when I can only change lines and not
    // single characters at x,y?
    for (y = 1; y < this.window.height - 2; y++) {
        line = "";
        for (x = 1; x < this.window.width - 2; x++) {
            if (state[y] !== undefined) {
                line += state[y][x] ? config.posChar : config.negChar;
            } else {
                line += config.negChar;
            }
        }
        this.window.setLine(y, line);
    }
};

module.exports = OutputWindow;
