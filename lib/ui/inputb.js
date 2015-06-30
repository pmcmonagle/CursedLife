/**
 * This Class represents the output window.
 */
'use strict';

var blessed = require('blessed');

/**
 * @constructor
 * @param {ncurses.Window} parent  Pass in the parent window.
 */
function InputWindow(parent) {
    this.x = 0;
    this.y = parent.height - 3;
    this.height = 3;
    this.width  = '100%';

    this.precursor = ' >> ';
    this.cursorStartPosition = {x: 1 + this.precursor.length, y: this.height - 2};
    this.inputString = '';

    this.events = {
        start: function () {},
        stop:  function () {},
        next:  function () {},
        clear: function () {},
        load:  function (filename) {},
        set:   function (param, val) {}
    };

    this.window = blessed.box({
        top:     this.y,
        left:    this.x,
        width:   this.width,
        height:  this.height,

        border:  { type: 'bg' },
        style:   { border: { bg: '#FFFFFF' } }
    });
    parent.append(this.window);
}

InputWindow.prototype.onInputChar = function (char, charCode, isKey) {
    var ncurses = {}; // FIXME
    switch (charCode) {
        case ncurses.keys.NEWLINE:
            this.handleInput(this.inputString);
            this.inputString = '';
            break;
        case 127:
        case ncurses.keys.BACKSPACE:
            this.inputString = this.inputString.substr(0, this.inputString.length - 1);
            break;
        case ncurses.keys.LEFT:
        case ncurses.keys.UP:
        case ncurses.keys.RIGHT:
        case ncurses.keys.DOWN:
            break;
        default:
            this.inputString += char;
    }
};

InputWindow.prototype.draw = function () {
    /*
    this.window.addstr(this.cursorStartPosition.y, 1, this.precursor);
    this.window.addstr(this.cursorStartPosition.y, this.cursorStartPosition.x, this.inputString);

    var col = this.cursorStartPosition.x + this.precursor.length + this.inputString.length;
    while (col < this.window.width - 1) {
        this.window.addstr(' ');
        col++;
    }
    */
    this.window.setLabel({
        text: '( ' +
              'Commands: start, stop, next, clear, load <filename>, ' +
              'set [generation | birthrate | surviverate | interval | posChar | negChar] <value> ' +
              ')',
        side: 'center'
    });
    this.window.setText(this.precursor + this.inputString);
};

/**
 * Used to handle input commands.
 */
InputWindow.prototype.handleInput = function (str) {
    var commands = str.split(' ');
    switch (commands[0]) {
        case 'start':
            this.events.start();
            break;
        case 'stop':
            this.events.stop();
            break;
        case 'next':
            this.events.next();
            break;
        case 'clear':
            this.events.clear();
            break;
        case 'set':
            this.events.set(commands[1], commands[2]);
            break;
        case 'load':
            this.events.load(commands[1]);
            break;
        default:
            return;
    }
};

/**
 * Used to register event handlers. Primitive, I know,
 * but it should be enough for our purposes.
 */
InputWindow.prototype.on = function (event, callback) {
    if (this.events.hasOwnProperty(event) && typeof callback === 'function') {
        this.events[event] = callback;
    }
};

module.exports = InputWindow;