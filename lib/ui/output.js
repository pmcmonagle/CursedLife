/**
 * This Class represents the output window.
 */
'use strict';

var ncurses = require('ncurses');

/**
 * @constructor
 * @param {ncurses.Window} parent  Pass in the parent window.
 */
function OutputWindow (parent) {
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
            if (this.cursor.y > 1) this.cursor.y--;
            break;
        case ncurses.keys.LEFT:
            if (this.cursor.x > 1) this.cursor.x--;
            break;
        case ncurses.keys.DOWN:
            if (this.cursor.y < this.window.height - 1) this.cursor.y++;
            break;
        case ncurses.keys.RIGHT:
            if (this.cursor.x < this.window.width - 1) this.cursor.x++;
            break;
        default:
            return;
    }
}

OutputWindow.prototype.draw = function (state, negChar, posChar, birthrate, surviverate, generation) {
    var x, y, char;
    this.window.boldframe(
        "< CursedLife: A Game of Life Simulator by Paul McMonagle >",
        "[ Generation: "+generation+", Birthrate: "+birthrate+", SurviveRate: "+surviverate+", PosChar: '"+posChar+"', NegChar: '"+negChar+"' ]");    
    for (y = 1; y < this.window.height - 2; y++) {
        for (x = 1; x < this.window.width - 2; x++) {
            if (state[y] !== undefined) {
                char = state[y][x] ? posChar : negChar;
            } else {
                char = negChar;
            }
            this.window.addstr(y, x, char);
        }
    }
    
    this.window.cursor(this.cursor.x, this.cursor.y);
    this.window.refresh();
};

module.exports = OutputWindow;