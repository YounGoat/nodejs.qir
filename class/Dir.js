'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    , fs = require('fs')
    , path = require('path')
    
    /* NPM */
    
    /* in-package */
    , tmpdir = require('../util/tmpdir')
    ;

class Dir {
    /**
     * @param {string} base 
     */
    constructor(base) {
        if (!base) {
            base = tmpdir()
        }
        this.base = base;
    }

    clear() {
        return this.rmfr('.')
    }

    /**
     * @param {string} pathname 
     */
    resolve(pathname) {
        return path.resolve(this.base, pathname);
    }

    /**
     * @param  {string}  filename
     * @param  {Object} [options]   - see fs.createReadStream() for details about options.
     */
    createReadStream(filename, options) {
        return fs.createReadStream(this.resolve(filename), options);
    }
}

module.exports = Dir;