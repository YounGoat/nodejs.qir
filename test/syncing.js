
'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    , assert = require('assert')
    , fs = require('fs')
    , path = require('path')
    , stream = require('stream')

    /* NPM */
    , noda = require('noda')
    
    /* in-package */
    , syncing = noda.inRequire('syncing')
    ;

describe('syncing', () => {
    const base = path.join(__dirname, 'resources');
    const P = name => path.join(base, name);
    const TXT = 'Hello CHING!';

    after(() => {
        syncing.rmfr(base);
    });

    it('appendFile', () => {
        let filename = P('appendFile/README');
        syncing.appendFile(filename, TXT);
        assert(fs.existsSync(filename));
    });

    it('copyFile', () => {
        let srcFilename  = P('copyFile/src/README');
        let destFilename = P('copyFile/dest/README');
        syncing.appendFile(srcFilename, TXT);
        syncing.copyFile(srcFilename, destFilename);
        assert(fs.existsSync(destFilename));
    });

    it('createWriteStream', () => {
        let filename  = P('createWriteStream/README');
        let s = syncing.createWriteStream(filename);
        assert(s instanceof stream.Writable);
        s.end();
    });

    it('link', () => {
        let existingPath = P('link/src/README');
        let newPath      = P('link/dest/README');
        syncing.appendFile(existingPath, TXT);
        syncing.link(existingPath, newPath);
        assert(fs.existsSync(newPath));
    });

    it('mkd', () => {
        let pathname = P('mkd/a/b/c');
        syncing.mkd(pathname);
        assert(fs.existsSync(pathname));
    });

    it('mkd_parent', () => {
        let dirname = P('mkd_parent/a/b');
        let pathname = path.join(dirname, 'c');
        syncing.mkd_parent(pathname);
        assert(fs.existsSync(dirname));
    });

    it('mkd_temp', () => {
        WITH_PREFIX: {
            let dirname = P('mkd_temp/a/b');
            let prefix = 'temp-';
            syncing.mkd_temp(dirname, prefix);
            
            let names = fs.readdirSync(dirname);
            assert(names.length == 1);

            let name = names[0];
            assert(/^temp-\w{6}$/.test(name));
        }

        NO_PREFIX: {
            let dirname = P('mkd_temp/a/c');
            syncing.mkd_temp(dirname);
            
            let names = fs.readdirSync(dirname);
            assert(names.length == 1);

            let name = names[0];
            assert(/^\w{6}$/.test(name));
        }
    });

    it('open', () => {
        let filename = P('open/README');
        let fd = syncing.open(filename);
        assert(typeof fd == 'number');
        fs.closeSync(fd);
    });

    it('rename', () => {
        let oldPath = P('rename/old');
        let newPath = P('rename/new/a/b/c');

        syncing.touch(oldPath);
        syncing.rename(oldPath, newPath);
        assert(fs.existsSync(newPath));
    });

    it('rmfr', () => {
        RM_FILE: {
            let dirname = P('rmfr');
            let filename = path.join(dirname, 'README');

            // Create a file firstly.
            syncing.appendFile(filename, TXT);

            // Then remove it.
            syncing.rmfr(filename);

            // The file should have been deleted.
            assert(!fs.existsSync(filename));

            // The parent folder should be alive.
            assert(fs.existsSync(dirname));
        }

        RM_DIR: {
            let dirname = P('rmfr');
            let filename = path.join(dirname, 'README');

            // Create a file firstly.
            syncing.appendFile(filename, TXT);

            // Then remove the folder.
            syncing.rmfr(dirname);

            // The folder should have been deleted.
            assert(!fs.existsSync(dirname));
        }
    });

    it('touch', () => {
        let filename = P('touch/README');
        syncing.touch(filename);
        assert(fs.existsSync(filename));
    });

    it('writeFile', () => {
        let filename = P('writeFile/README');
        syncing.writeFile(filename, TXT);
        assert(fs.existsSync(filename));
    });

});