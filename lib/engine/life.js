/**
 * This class provides a mechanism for defining and
 * altering the rules of Life-Like Cellular Automata,
 * as well as the ability to run the simulation by way
 * of creating new generations based on those rules.
 */
'use strict';

function Life(width, height, birthrate, surviverate) {
    this.width       = width || 100;
    this.height      = height || 50;
    this.birthrate   = birthrate || 3;
    this.surviverate = surviverate || 23;
}

/**
 * @param {Int} x      Collumn position of the source element.
 * @param {Int} y      Row Position of the source element.
 * @param {Array} arr  Source data set.
 * @return {Array}     An array of true/false values representing
 *                     the neighbours. Missing values assumed to be false.
 */
function getNeighbours(x, y, arr) {
    var neighbours = [];

    if (arr[y - 1] !== undefined) {
        neighbours.push(arr[y - 1][x - 1]);
        neighbours.push(arr[y - 1][x]);
        neighbours.push(arr[y - 1][x + 1]);
    }

    neighbours.push(arr[y][x - 1]);
    neighbours.push(arr[y][x + 1]);

    if (arr[y + 1] !== undefined) {
        neighbours.push(arr[y + 1][x - 1]);
        neighbours.push(arr[y + 1][x]);
        neighbours.push(arr[y + 1][x + 1]);
    }

    return neighbours;
}

/**
 * @param {Boolean} element   Pass in the current state of the element.
 * @param {Array} neighbours  Pass in an array of Booleans representing
 *                            the neighbouring elements. If some elements
 *                            are missing, they are assumed to be false.
 */
function determineStateFromNeighbours(element, neighbours, birthrate, surviverate) {
    var trueCount   = 0;

    birthrate   = birthrate.toString().split('');
    surviverate = surviverate.toString().split('');

    neighbours.forEach(function (value, index) {
        if (value && index < 8) {
            trueCount++;
        }
    });

    if (element && surviverate.indexOf(trueCount.toString()) !== -1) {
        return true;
    } else if (!element && birthrate.indexOf(trueCount.toString()) !== -1) {
        return true;
    } else {
        return false;
    }
}

/**
 * @param {Array} oldGeneration  Pass in a two-dimensional array representing
 *                               the old generation to create from.
 * @return {Array}               Return a two-dimensional array representing
 *                               the new generation!
 */
Life.prototype.createNewGeneration = function (oldGeneration) {
    var width      = Math.min(this.width, oldGeneration[0].length),
        height     = Math.min(this.height, oldGeneration.length),
        fullWidth  = this.width,
        fullHeight = this.height,
        newGeneration,
        x,
        y;

    newGeneration = Array.apply(null, new Array(fullHeight)).map(function () {
        return Array.apply(null, new Array(fullWidth)).map(Boolean);
    });

    if (!oldGeneration) {
        return newGeneration;
    }

    for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {
            newGeneration[y][x] = determineStateFromNeighbours(
                oldGeneration[y][x],
                getNeighbours(x, y, oldGeneration),
                this.birthrate,
                this.surviverate
            );
        }
    }

    return newGeneration;
};

module.exports = Life;
