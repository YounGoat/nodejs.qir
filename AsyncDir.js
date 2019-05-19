'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    , path = require('path')
    
    /* NPM */
    
    /* in-package */
    , asyncing = require('./asyncing')

    /* in-file */
    ;

class AsyncDir {

    constructor(base) {
        this.base = base;
        Object.assign(this, asyncing);
    }

    resolve(pathname) {
        return path.resolve(this.base, pathname);
    }
}

module.exports = AsyncDir;