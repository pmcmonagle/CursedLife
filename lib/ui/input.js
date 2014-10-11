/**
 * This Class represents the output window.
 */
'use strict';

var ncurses = require('ncurses');

/**
 * @constructor
 * @param {ncurses.Window} parent  Pass in the parent window.
 */
function InputWindow(parent) {
    this.x = 0;
    this.y = parent.height - 3;
    this.height = 3;
    this.width  = 0;

    this.precursor = ' >> ';
    this.cursorStartPosition = {x: 1 + this.precursor.length, y: this.height - 2};
    this.inputString = '';

    this.events = {
        start: function () {},
        stop:  function () {},
        next:  function () {},
        load:  function (filename) {},
        set:   function (param, val) {}
    };

    // Note:
    // I started by trying to extend ncurses.Window, but it
    // turns out that using ncurses.Window.prototype causes
    // a segmentation fault.
    this.window = new ncurses.Window(this.height, this.width, this.y, this.x);
}

InputWindow.prototype.onInputChar = function (char, charCode, isKey) {
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
    this.window.boldframe(
        '( ' +
        'Commands: start, stop, next, load <~/filename>, ' +
        'set [birthrate | surviverate | speed | livechar | deadchar] <value> ' +
        ')'
    );
    this.window.addstr(this.cursorStartPosition.y, 1, this.precursor);
    this.window.addstr(this.cursorStartPosition.y, this.cursorStartPosition.x, this.inputString);

    var col = this.cursorStartPosition.x + this.precursor.length + this.inputString.length;
    while (col < this.window.width - 1) {
        this.window.addstr(' ');
        col++;
    }

    this.window.refresh();
};

/**
 * Used to handle input commands.
 */
InputWindow.prototype.handleInput = function (str) {
    switch (str) {
        case 'start':
            this.events.start();
            break;
        case 'stop':
            this.events.stop();
            break;
        case 'next':
            this.events.next();
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
