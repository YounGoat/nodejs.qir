'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    , fs = require('fs')
    , path = require('path')
    
    /* NPM */
    
    /* in-package */

    /* in-file */
    
    , mkd = dirname => {
        if (!fs.existsSync(dirname)) {    
            let parent = path.resolve(dirname, '..');
            mkd(parent);
            fs.mkdirSync(dirname);
        }
    }

    , mkd_parent = pathname => {
        mkd(path.dirname(pathname));
    }

    , rmfr = pathname => {
        if (fs.existsSync(pathname)) {
            if (fs.statSync(pathname).isDirectory()) {
                // 删除目录内容。
                fs.readdirSync(pathname).forEach(filename => rmfr(path.join(pathname, filename)));
    
                // 删除目录。
                fs.rmdirSync(pathname);
            }
            else {
                // 删除文件。
                fs.unlinkSync(pathname);
            }
        }
    }
    
    , touch = filename => {
        // ATTENTION: It maybe a diretory instead of a file.
        if (fs.existsSync(filename)) {
            return;
        }

        mkd_parent(filename);
        fs.writeFileSync(filename, Buffer.alloc(0));
        return;
    }
    ;

const syncing = {};

/**
 * @param  {string}        filename
 * @param  {string|Buffer} data
 */
syncing.appendFile = function(filename, data) {
    if (this.resolve) {
        filename = this.resolve(filename);
    }

    mkd_parent(filename);
    fs.appendFileSync(filename, data);
    return;
};

/**
 * @param  {string}  srcFilename
 * @param  {string}  destFilename
 * @param  {number} [flags]          - see fs.copyFile() for details about flags.
 */
syncing.copyFile = function(srcFilename, destFilename, flags) {
    if (this.resolve) {
        srcFilename = this.resolve(srcFilename);
        destFilename = this.resolve(destFilename);
    }

    mkd_parent(destFilename);
    fs.copyFileSync(srcFilename, destFilename, flags);
    return;
};

/**
 * @param  {string}  filename
 * @param  {Object} [options]   - see fs.createWriteStream() for details about options.
 */
syncing.createWriteStream = function(filename, options) {
    if (this.resolve) {
        filename = this.resolve(filename);
    }

    mkd_parent(filename);
    return fs.createWriteStream(filename, options);
};

/**
 * @param  {string} existingPath
 * @param  {string} newPath
 */
syncing.link = function(existingPath, newPath) {
    if (this.resolve) {
        existingPath = this.resolve(existingPath);
        newPath = this.resolve(newPath);
    }

    mkd_parent(newPath);
    fs.linkSync(existingPath, newPath);
    return 
};

/**
 * Create target diretory and its parent directroies if they not exist.
 * @param  {string} dirname
 */
syncing.mkd = function(dirname) {
    if (this.resolve) {
        dirname = this.resolve(dirname);
    }

    mkd(dirname);
    return;
};

/**
 * @param  {string}  dirname
 * @param  {string} [prefix]
 */
syncing.mkd_temp = function(dirname, prefix) {
    if (this.resolve) {
        dirname = this.resolve(dirname);
    }

    mkd(dirname);
    if (prefix) {
        prefix = path.join(dirname, prefix);
    }
    else {
        // Append seperator character at the end of dirname if no prefix needed.
        // Otherwise the last part of dirname will be regarded as prefix by fs.mkdtemp().
        prefix = path.join(dirname, path.sep);
    }
    fs.mkdtempSync(prefix);
    return;
};

/**
 * @param  {string} pathname
 */
syncing.mkd_parent = function(pathname) {
    if (this.resolve) {
        pathname = this.resolve(pathname);
    }

    mkd_parent(pathname);
    return;  
};

/**
 * @param  {string}         filename
 * @param  {string|number} [flags='r']
 * @param  {integer}       [mode]
 */
syncing.open = function(filename, flags = 'r', mode) {
    if (this.resolve) {
        filename = this.resolve(filename);
    }

    touch(filename);
    return fs.openSync(filename, flags, mode);
};

/**
 * @param  {string} oldPath
 * @param  {string} newPath
 */
syncing.rename = function(oldPath, newPath) {
    if (this.resolve) {
        oldPath = this.resolve(oldPath);
        newPath = this.resolve(newPath);
    }

    mkd_parent(newPath);
    fs.renameSync(oldPath, newPath);
    return;
};

/**
 * @param  {string} pathname
 */
syncing.rmfr = function(pathname) {
    if (this.resolve) {
        pathname = this.resolve(pathname);
    }

    rmfr(pathname);
    return;
};

/**
 * @param  {string} filename
 */
syncing.touch = function(filename) {
    if (this.resolve) {
        filename = this.resolve(filename);
    }

    touch(filename);
    return;
};

/**
 * @param  {string} filename
 * @param  {string|Buffer|TypedArray|DataView} data - see fs.writeFile() for details about data.
 */
syncing.writeFile = function(filename, data) {
    if (this.resolve) {
        filename = this.resolve(filename);
    }
    
    mkd_parent(filename);
    fs.writeFileSync(filename, data);
    return;
};

module.exports = syncing;