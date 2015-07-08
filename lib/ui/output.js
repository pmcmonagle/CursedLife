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
    this.parent = parent;
    this.x = 0;
    this.y = 0;
    this.height = parent.height - 3;
    this.width  = '100%';
    this.cursor = {x: 2, y: 2};

    this.window = blessed.box({
        top:     this.y,
        left:    this.x,
        width:   this.width,
        height:  this.height,

        border:  { type: 'bg' },
        style:   {
            border: { bg: '#FFFFFF' },
            label:  {
                bg: '#FFFFFF',
                fg: '#000000'
            }
        }
    });
    parent.append(this.window);
}

OutputWindow.prototype.onInputChar = function (ch, key) {
    switch (key.name) {
        case 'up':
            if (this.cursor.y > 1) {
                this.cursor.y--;
            }
            break;
        case 'left':
            if (this.cursor.x > 1) {
                this.cursor.x--;
            }
            break;
        case 'down':
            if (this.cursor.y < this.window.height - 1) {
                this.cursor.y++;
            }
            break;
        case 'right':
            if (this.cursor.x < this.window.width - 1) {
                this.cursor.x++;
            }
            break;
        default:
            return;
    }

    // Force an update for snappier rendering
    //this.draw();
    this.parent.render();
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
        line,
        content;

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
        side: 'left'
    });

    // Note: I tried Array.joins here in place of string
    // concatonation, but it didn't produce better performance.
    content = "";
    for (y = 1; y < this.window.height - 2; y++) {
        line = "";
        for (x = 1; x < this.window.width - 2; x++) {
            // Tag the cursor with an SGR code
            if (y === this.cursor.y && x === this.cursor.x) {
                line += '\x1b[41m';
            }

            if (state[y] !== undefined) {
                line += state[y][x] ? config.posChar : config.negChar;
            } else {
                line += config.negChar;
            }

            // and end the tag.
            if (y === this.cursor.y && x === this.cursor.x) {
                line += '\x1b[0m';
            }
        }
        line    += '\n';
        content += line;
    }

    this.window.setContent(content);
};

module.exports = OutputWindow;
