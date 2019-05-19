'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    , path = require('path')
    
    /* NPM */
    
    /* in-package */
    , syncing = require('./syncing')

    /* in-file */
    ;

class SyncDir {

    constructor(base) {
        this.base = base;
        Object.assign(this, syncing);
    }

    resolve(pathname) {
        return path.resolve(this.base, pathname);
    }
}

module.exports = SyncDir;