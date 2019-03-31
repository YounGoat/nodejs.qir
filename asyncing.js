'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    , fs = require('fs')
    , path = require('path')
    , util = require('util')
    
    /* NPM */
    
    /* in-package */

    /* in-file */
    , appendFile  = util.promisify(fs.appendFile)
    , copyFile    = util.promisify(fs.copyFile)
    , exists      = util.promisify(fs.exists)
    , link        = util.promisify(fs.link)
    , mkdir       = util.promisify(fs.mkdir)
    , mkdtemp     = util.promisify(fs.mkdtemp)
    , open        = util.promisify(fs.open)
    , readdir     = util.promisify(fs.readdir)
    , rename      = util.promisify(fs.rename)
    , rmdir       = util.promisify(fs.rmdir)
    , stat        = util.promisify(fs.stat)
    , unlink      = util.promisify(fs.unlink)
    , writeFile   = util.promisify(fs.writeFile)
    
    , mkd = async dirname => {
        if (! await exists(dirname)) { 
            let parent = path.resolve(dirname, '..');
            await mkd(parent);
            await mkdir(dirname).catch(err => {
                // 异步执行可能存在这样的问题，即在判断的时候，目录确实不存在，
                // 但当创建的时候，它又已经存在了。故此类错误直接忽略。
                if (err.code == 'EEXIST') return null;
                else throw err;
            });
        }
    }

    , mkd_parent = pathname => {
        return mkd(path.dirname(pathname));
    }

    , rmfr = async pathname => {
        if (await exists(pathname)) {
            if ((await stat(pathname)).isDirectory()) {
                // 删除目录内容。
                let names = await readdir(pathname);
                for (let i = 0; i < names.length; i++) {
                    await rmfr(path.join(pathname, names[i]));
                }
    
                // 删除目录。
                await rmdir(pathname);
            }
            else {
                // 删除文件。
                await unlink(pathname);
            }
        }
    }
    
    , touch = async filename => {
        // ATTENTION: It maybe a diretory instead of a file.
        if (await exists(filename)) {
            return;
        }

        await mkd_parent(filename);
        await writeFile(filename, Buffer.alloc(0));
    }
    ;

const asyncing = {};

/**
 * @param  {string}        filename
 * @param  {string|Buffer} data
 */
asyncing.appendFile = async function(filename, data) {
    await mkd_parent(filename);
    await appendFile(filename, data);
};

/**
 * @param  {string}  srcFilename
 * @param  {string}  destFilename
 * @param  {number} [flags]          - see fs.copyFile() for details about flags.
 */
asyncing.copyFile = async function(srcFilename, destFilename, flags) {
    await mkd_parent(destFilename);
    await copyFile(srcFilename, destFilename, flags);
};

/**
 * @param  {string}  filename
 * @param  {Object} [options]   - see fs.createWriteStream() for details about options.
 */
asyncing.createWriteStream = async function(filename, options) {
    await mkd_parent(filename);
    return fs.createWriteStream(filename, options);
};

/**
 * @param  {string} existingPath
 * @param  {string} newPath
 */
asyncing.link = async function(existingPath, newPath) {
    await mkd_parent(newPath);
    await link(existingPath, newPath);
};

/**
 * Create target diretory and its parent directroies if they not exist.
 * @param  {string} dirname
 */
asyncing.mkd = async function(dirname) {
    await mkd(dirname);
};

/**
 * @param  {string}  dirname
 * @param  {string} [prefix]
 */
asyncing.mkd_temp = async function(dirname, prefix) {
    await mkd(dirname);
    if (prefix) {
        prefix = path.join(dirname, prefix);
    }
    else {
        // Append seperator character at the end of dirname if no prefix needed.
        // Otherwise the last part of dirname will be regarded as prefix by fs.mkdtemp().
        prefix = path.join(dirname, path.sep);
    }
    await mkdtemp(prefix);
};

/**
 * @param  {string} pathname
 */
asyncing.mkd_parent = async function(pathname) {
    await mkd_parent(pathname);
};

/**
 * @param  {string}         filename
 * @param  {string|number} [flags='r']
 * @param  {integer}       [mode]
 */
asyncing.open = async function(filename, flags = 'r', mode) {
    await touch(filename);
    return await open(filename, flags, mode);
};

/**
 * @param  {string} oldPath
 * @param  {string} newPath
 */
asyncing.rename = async function(oldPath, newPath) {
    await mkd_parent(newPath);
    await rename(oldPath, newPath);
};

/**
 * @param  {string} pathname
 */
asyncing.rmfr = async function(pathname) {
    await rmfr(pathname);
};

/**
 * @param  {string} filename
 */
asyncing.touch = async function(filename) {
    await touch(filename);
};

/**
 * @param  {string} filename
 * @param  {string|Buffer|TypedArray|DataView} data - see fs.writeFile() for details about data.
 */
asyncing.writeFile = async function(filename, data) {
    await mkd_parent(filename);
    await writeFile(filename, data);
};

module.exports = asyncing;