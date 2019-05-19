'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    , fs = require('fs')
    
    /* NPM */
    
    /* in-package */
    , Dir = require('./class/Dir')
    , syncing = require('./syncing')

    /* in-file */
    ;

class SyncDir extends Dir {

    constructor(base) {
        super(base);
        Object.assign(this, syncing);
    }

    /**
     * Read file content.
     * @param {string}  filename 
     * @param {string} [encoding]
     */
    readFile(filename, encoding) {
        return fs.readFileSync(this.resolve(filename), encoding);
    }
}

module.exports = SyncDir;