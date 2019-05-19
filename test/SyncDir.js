
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
    , SyncDir = noda.inRequire('SyncDir')
    ;

describe('SyncDir', () => {
    const base = path.join(__dirname, 'resources');
    const P = name => path.join(base, name);
    const TXT = 'Hello CHING!';
    let syncdir;

    after(() => {
        syncdir.rmfr('.');
    });

    it('init', () => {
        syncdir = new SyncDir(base);
    });

    it('exists', () => {
        let pathname = 'exists';
        assert.equal(syncdir.exists(pathname), false);
    });

    it('readFile', () => {
        let filename = 'readFile/README';
        syncdir.writeFile(filename, TXT);
        
        let buf = syncdir.readFile(filename);
        assert.equal(buf.toString(), TXT);

        let txt = syncdir.readFile(filename, 'utf8');
        assert.equal(txt, TXT);
    });    

    it('resolve', () => {
        let pathname = 'resolve/README';
        let realpath = syncdir.resolve(pathname);
        assert.equal(realpath, P(pathname));
    });    

    it('appendFile', () => {
        let filename = 'appendFile/README';
        syncdir.appendFile(filename, TXT);
        assert(fs.existsSync(P(filename)));
    });

    it('copyFile', () => {
        let srcFilename  = 'copyFile/src/README';
        let destFilename = 'copyFile/dest/README';
        syncdir.appendFile(srcFilename, TXT);
        syncdir.copyFile(srcFilename, destFilename);
        assert(fs.existsSync(P(destFilename)));
    });

    it('createWriteStream', () => {
        let filename  = 'createWriteStream/README';
        let s = syncdir.createWriteStream(filename);
        assert(s instanceof stream.Writable);
        s.end();
    });

    it('link', () => {
        let existingPath = 'link/src/README';
        let newPath      = 'link/dest/README';
        syncdir.appendFile(existingPath, TXT);
        syncdir.link(existingPath, newPath);
        assert(fs.existsSync(P(newPath)));
    });

    it('mkd', () => {
        let pathname = 'mkd/a/b/c';
        syncdir.mkd(pathname);
        assert(fs.existsSync(P(pathname)));
    });

    it('mkd_parent', () => {
        let dirname = 'mkd_parent/a/b';
        let pathname = path.join(dirname, 'c');
        syncdir.mkd_parent(pathname);
        assert(fs.existsSync(P(dirname)));
    });

    it('mkd_temp', () => {
        WITH_PREFIX: {
            let dirname = 'mkd_temp/a/b';
            let prefix = 'temp-';
            syncdir.mkd_temp(dirname, prefix);
            
            let names = fs.readdirSync(P(dirname));
            assert(names.length == 1);

            let name = names[0];
            assert(/^temp-\w{6}$/.test(name));
        }

        NO_PREFIX: {
            let dirname = 'mkd_temp/a/c';
            syncdir.mkd_temp(dirname);
            
            let names = fs.readdirSync(P(dirname));
            assert(names.length == 1);

            let name = names[0];
            assert(/^\w{6}$/.test(name));
        }
    });

    it('open', () => {
        let filename = 'open/README';
        let fd = syncdir.open(filename);
        assert(typeof fd == 'number');
        fs.closeSync(fd);
    });

    it('rename', () => {
        let oldPath = 'rename/old';
        let newPath = 'rename/new/a/b/c';

        syncdir.touch(oldPath);
        syncdir.rename(oldPath, newPath);
        assert(fs.existsSync(P(newPath)));
    });

    it('rmfr', () => {
        RM_FILE: {
            let dirname = 'rmfr';
            let filename = path.join(dirname, 'README');

            // Create a file firstly.
            syncdir.appendFile(filename, TXT);

            // Then remove it.
            syncdir.rmfr(filename);

            // The file should have been deleted.
            assert(!fs.existsSync(P(filename)));

            // The parent folder should be alive.
            assert(fs.existsSync(P(dirname)));
        }

        RM_DIR: {
            let dirname = P('rmfr');
            let filename = path.join(dirname, 'README');

            // Create a file firstly.
            syncdir.appendFile(filename, TXT);

            // Then remove the folder.
            syncdir.rmfr(dirname);

            // The folder should have been deleted.
            assert(!fs.existsSync(P(dirname)));
        }
    });

    it('touch', () => {
        let filename = 'touch/README';
        syncdir.touch(filename);
        assert(fs.existsSync(P(filename)));
    });

    it('writeFile', () => {
        let filename = 'writeFile/README';
        syncdir.writeFile(filename, TXT);
        assert(fs.existsSync(P(filename)));
    });

});