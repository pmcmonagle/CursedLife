# CursedLife 
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-url]][daviddm-image]

An implementation of Conway's Game of Life using NodeJS and NCurses.

"But Paul, why build yet another Game of Life simulator for NodeJS?"
Haha! The answer is simple, my friends:
- I wanted to.
- Mine is different.
- The others I found were slightly confusing, and didn't allow custom rulesets.

There's a known bug with node-ncurses which causes strange graphic behavior
in the OSX terminal. The program will still run, but will look odd.

## Install

```bash
$ npm install -g cursedlife
```


## Usage

Simply run the program from command line:

```bash
$ cursedlife
```

### Commands

Once it's running, the program can accept several commands to control
the simulation:
- `start` : Will unpause the simulation
- `stop`  : Will pause the simulation
- `next`  : Will advance the simulation by one generation
- `clear` : Will clear the entire screen, turning all cells off.
- `load`  : Will allow you to load a JSON configuration file.
- `set`   : Will allow you to set the speed, survivalrate, etc.

Simply start typing; the text will appear in the input panel along
the bottom of the window. Hit 'ENTER' to submit your command.

### Cursor

Use the arrow keys to move the cursor in the output panel. Hitting
'ENTER' will toggle the currently selected cell.

### Loading Files
`load <filename>`; eg. `load patterns/gospergun.json`

The load command looks for files in the directory that the
program was executed from. For example, if you cd to a directory
full of JSON files before running `$ cursedlife`, all of those
files will be accessible to the program without having to type 
the full path.

The files should be JSON, and should follow the this template:
```json
{
    "posChar": "@",
    "negChar": " ",
    "birthrate": 3,
    "surviverate: 23,
    "state": [
        [false, false, false, false],
        [false, false, true,  true ],
        [false, false, true,  true ]
    ]
}
```
Note that all of the values are optional; you can have a JSON
file that specifies only state, birthrate and surviverate, or
any other combinations.

## Release History

### v1.0.0
Implemented a `clear` command. Also implemented the ability
to move a cursor using the arrow keys, and toggle a specific
cell using the ENTER key.

Bumped the major version number; these are all of the originally
planned features, so I'm calling it the 1.0 release!

### v0.0.4
The `load` command is now able to read other configuration
options. For example, you can specify birthrate, surviverate
and negative/positive characters in the JSON.

### v0.0.3
Partially implemented the `load` command.

Loading JSON files from a patterns directory works. Currently,
only simulation state is read from the JSON. The ability to
read other configuration data from the JSON is planned.

Example:
- `load patterns/gospergun.json`

### v0.0.2
Implemented the `set` command for all variables that can be user defined.

Surviverate and birthrate are sets of integers from 0-8. A surviverate of
23 indicates that a cell will survive if it has either 2 or 3 active
neighbours. Interval is the time, in ms, between each generation.
Examples:
- `set surviverate 246`
- `set birthrate 35`
- `set generation 0`
- `set interval 1000`
- `set posChar @`
- `set negChar .`

### v0.0.1
First working release. Many things are not implemented, but the following should work:
- `start`
- `stop`
- `next`


## License

Copyright (c) 2014 Paul McMonagle. Licensed under the MIT license.



[npm-url]: https://npmjs.org/package/cursedlife
[npm-image]: https://badge.fury.io/js/cursedlife.svg
[travis-url]: https://travis-ci.org/pmcmonagle/CursedLife
[travis-image]: https://travis-ci.org/pmcmonagle/CursedLife.svg?branch=master
[daviddm-url]: https://david-dm.org/pmcmonagle/cursedlife.svg?theme=shields.io
[daviddm-image]: https://david-dm.org/pmcmonagle/cursedlife
[coveralls-url]: https://coveralls.io/r/pmcmonagle/cursedlife
[coveralls-image]: https://coveralls.io/repos/pmcmonagle/cursedlife/badge.png
