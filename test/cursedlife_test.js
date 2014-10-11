'use strict';

var CursedLife = require('../lib/cursedlife'),
    ncurses    = require('ncurses'),
    assert     = require('should');

/**
 * The nature of Ncurses means that testing
 * CursedLife as a whole will seriously mess
 * up any kind of meaningful output that Mocha
 * wants to display. This file is mostly just
 * a reminder, and maybe a placeholder in case
 * I get brave.
 * 
 * The real tests are done against engine/life.
 */
describe('cursedlife', function () {
    
    it('should exist', function () {
        assert( typeof CursedLife === 'function' );
    });

});
