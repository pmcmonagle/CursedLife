/**
 * A set of static templates used to test common
 * figures in Conway's Game of Life
 */
'use strict';

module.exports = {
    'blank': [
        [false, false, false],
        [false, false, false]
    ],
    'still': {
        'block': [
            [false, false, false, false, false],
            [false, false, true,  true,  false],
            [false, false, true,  true,  false],
            [false, false, false, false, false]
        ]   
    },
    'oscillators': {
        'blinker': [
            [false, false, false, false, false, false],
            [false, false, false, false, false, false],
            [false, false, false, false, false, false],
            [false, false, true,  true,  true,  false],
            [false, false, false, false, false, false],
            [false, false, false, false, false, false],
            [false, false, false, false, false, false],
        ]
    },
    'ships': {
        'glider': [
            [false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false],
            [false, false, false, false, true,  false, false, false],
            [false, false, false, false, false, true,  false, false],
            [false, false, false, true,  true,  true,  false, false],
            [false, false, false, false, false, false, false, false],
        ]
    }
}