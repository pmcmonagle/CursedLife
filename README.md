# CursedLife 
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-url]][daviddm-image] [![Coverage Status][coveralls-image]][coveralls-url]

An implementation of Conway's Game of Life using NodeJS and NCurses.

"But Paul, why build yet another Game of Life simulator for NodeJS?"
Haha! The answer is simple, my friends:
- I wanted to.
- Mine is different.
- The others I found were slightly confusing, and didn't allow custom rulesets.


## Install

```bash
$ npm install -g cursedlife
```


## Usage

Simply run the program from command line:

```bash
$ cursedlife
```
Once it's running, the program can accept several commands to control
the simulation:
- start : Will unpause the simulation
- stop  : Will pause the simulation
- next  : Will advance the simulation by one generation
- load  : Will allow you to load a JSON configuration file (not yet implemented)
- set   : Will allow you to set the speed, survivalrate, etc.


## Release History

### v.0.0.2
Implemented the `set` command.

### v0.0.1
First working release. Many things are not implemented, but the following should work:
- start
- stop
- next


## License

Copyright (c) 2014 Paul McMonagle. Licensed under the MIT license.



[npm-url]: https://npmjs.org/package/cursedlife
[npm-image]: https://badge.fury.io/js/cursedlife.svg
[travis-url]: https://travis-ci.org/pmcmonagle/cursedlife
[travis-image]: https://travis-ci.org/pmcmonagle/cursedlife.svg?branch=master
[daviddm-url]: https://david-dm.org/pmcmonagle/cursedlife.svg?theme=shields.io
[daviddm-image]: https://david-dm.org/pmcmonagle/cursedlife
[coveralls-url]: https://coveralls.io/r/pmcmonagle/cursedlife
[coveralls-image]: https://coveralls.io/repos/pmcmonagle/cursedlife/badge.png
