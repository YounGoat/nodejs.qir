'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    , fs = require('fs')
    , util = require('util')
    
    /* NPM */
    
    /* in-package */
    , asyncing = require('./asyncing')
    , Dir = require('./class/Dir')

    /* in-file */
    , readFile = util.promisify(fs.readFile)
    ;

class AsyncDir extends Dir {

    constructor(base) {
        super(base);
        Object.assign(this, asyncing);
    }

    /**
     * Read file content.
     * @param {string}  filename 
     * @param {string} [encoding]
     */
    readFile(filename, encoding) {
        return readFile(this.resolve(filename), encoding);
    }
}

module.exports = AsyncDir;