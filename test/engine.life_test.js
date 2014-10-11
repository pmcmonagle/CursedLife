'use strict';

var Life      = require('../lib/engine/life'),
    templates = require('../lib/engine/templates'),
    assert    = require('should');

/**
 * Life has some really nice input/output functions
 * that should be super easy to test using known
 * forms from Conway's standard game of life.
 */
describe('life', function () {
    
    describe('using conway\'s standard ruleset: B3/S23', function () {
        var simulation;
        
        beforeEach(function () {
            simulation = new Life(8, 6, 3, 23);
        });
        
        it('should not modify a blank form across generations', function () {
            assert.deepEqual(
                templates.blank,
                simulation.createNewGeneration(templates.blank)
            );
        });
        
        it('should not modify still-life forms across generations', function () {
            assert.deepEqual(
                templates.still.block,
                simulation.createNewGeneration(templates.still.block)
            );          
        });
        
        it('should predictably blink the blinker', function () {
            var expected = [
                [false, false, false, false, false, false, false, false],
                [false, false, false, false, false, false, false, false],
                [false, false, false, true,  false, false, false, false],
                [false, false, false, true,  false, false, false, false],
                [false, false, false, true,  false, false, false, false],
                [false, false, false, false, false, false, false, false]
            ];
            assert.deepEqual(
                expected,
                simulation.createNewGeneration(templates.oscillators.blinker)
            );
        });
        
    });
    
    describe('using a guaranteed birth/life ruleset: B123456780/S123456780', function () {
        var simulation,
            expected = [
                [true, true, true, true, true, true, true, true],
                [true, true, true, true, true, true, true, true],
                [true, true, true, true, true, true, true, true],
                [true, true, true, true, true, true, true, true],
                [true, true, true, true, true, true, true, true],
                [true, true, true, true, true, true, true, true]
            ];
        
        before(function () {
            simulation = new Life(8, 6, 123456780, 123456780);
        })
        
        it('should fully populate the screen when given a blank form', function () {
            assert.deepEqual(
                expected,
                simulation.createNewGeneration(templates.blank)
            );
        });
        
        it('should fully populate the screen when given any other form', function () {
            assert.deepEqual(
                expected,
                simulation.createNewGeneration(templates.still.block)
            );
            
            assert.deepEqual(
                expected,
                simulation.createNewGeneration(templates.oscillators.blinker)
            );
        });
    });

});
