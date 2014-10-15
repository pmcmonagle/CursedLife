#! /usr/bin/env node

'use strict';

var CursedLife = require('./lib/cursedlife'),
    userArgs   = process.argv,
    lifeInstance;


if (userArgs.indexOf('-h') !== -1 || userArgs.indexOf('--help') !== -1) {
    return console.log('TODO: Help Docs');
}

if (userArgs.indexOf('-v') !== -1 || userArgs.indexOf('--version') !== -1) {
    return console.log(require('./package').version);
}

lifeInstance = new CursedLife();

/**
 * Close the NCurses window on SIGINT so
 * that the program shuts down nicely.
 * This prevents the terminal from going
 * wonky after you're done.
 */
function cleanQuit (err) {
    lifeInstance.main.close();
    if (err) console.log(err);
    process.exit();
}
process.on('SIGINT', cleanQuit);
process.on('exit', cleanQuit);
process.on('uncaughtException', cleanQuit);
