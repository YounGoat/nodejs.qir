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
     * @param {*} filename 
     * @return {boolean}
     */
    exists(filename) {
        return fs.existsSync(this.resolve(filename));
    }

    /**
     * Read file content.
     * @param {string}  filename 
     * @param {string} [encoding]
     * @return {string | Buffer}
     */
    readFile(filename, encoding) {
        return fs.readFileSync(this.resolve(filename), encoding);
    }
}

module.exports = SyncDir;