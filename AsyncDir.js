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
     * @return {Promise(string | Buffer)}
     */
    readFile(filename, encoding) {
        return readFile(this.resolve(filename), encoding);
    }
}

module.exports = AsyncDir;