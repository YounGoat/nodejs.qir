
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
    , AsyncDir = noda.inRequire('AsyncDir')
    ;

describe('AsyncDir', () => {
    const base = path.join(__dirname, 'resources');
    const P = name => path.join(base, name);
    const TXT = 'Hello CHING!';
    let asyncdir;

    after(async () => {
        await asyncdir.rmfr('.');
    });

    it('init', () => {
        asyncdir = new AsyncDir(base);
    });

    it('resolve', () => {
        let pathname = 'resolve/README';
        let realpath = asyncdir.resolve(pathname);
        assert.equal(realpath, P(pathname));
    });

    it('appendFile', async () => {
        let filename = 'appendFile/README';
        await asyncdir.appendFile(filename, TXT);
        assert(fs.existsSync(P(filename)));
    });

    it('copyFile', async () => {
        let srcFilename  = 'copyFile/src/README';
        let destFilename = 'copyFile/dest/README';
        await asyncdir.appendFile(srcFilename, TXT);
        await asyncdir.copyFile(srcFilename, destFilename);
        assert(fs.existsSync(P(destFilename)));
    });

    it('createWriteStream', async () => {
        let filename  = 'createWriteStream/README';
        let s = await asyncdir.createWriteStream(filename);
        assert(s instanceof stream.Writable);
        s.end();
    });

    it('link', async () => {
        let existingPath = 'link/src/README';
        let newPath      = 'link/dest/README';
        await asyncdir.appendFile(existingPath, TXT);
        await asyncdir.link(existingPath, newPath);
        assert(fs.existsSync(P(newPath)));
    });

    it('mkd', async () => {
        let pathname = 'mkd/a/b/c';
        await asyncdir.mkd(pathname);
        assert(fs.existsSync(P(pathname)));
    });

    it('mkd_parent', async () => {
        let dirname = 'mkd_parent/a/b';
        let pathname = path.join(dirname, 'c');
        await asyncdir.mkd_parent(pathname);
        assert(fs.existsSync(P(dirname)));
    });

    it('mkd_temp', async () => {
        WITH_PREFIX: {
            let dirname = 'mkd_temp/a/b';
            let prefix = 'temp-';
            await asyncdir.mkd_temp(dirname, prefix);
            
            let names = fs.readdirSync(P(dirname));
            assert(names.length == 1);

            let name = names[0];
            assert(/^temp-\w{6}$/.test(name));
        }

        NO_PREFIX: {
            let dirname = 'mkd_temp/a/c';
            await asyncdir.mkd_temp(dirname);
            
            let names = fs.readdirSync(P(dirname));
            assert(names.length == 1);

            let name = names[0];
            assert(/^\w{6}$/.test(name));
        }
    });

    it('open', async () => {
        let filename = 'open/README';
        let fd = await asyncdir.open(filename);
        assert(typeof fd == 'number');
        fs.closeSync(fd);
    });

    it('rename', async () => {
        let oldPath = 'rename/old';
        let newPath = 'rename/new/a/b/c';

        await asyncdir.touch(oldPath);
        await asyncdir.rename(oldPath, newPath);
        assert(fs.existsSync(P(newPath)));
    });

    it('rmfr', async () => {
        RM_FILE: {
            let dirname = 'rmfr';
            let filename = path.join(dirname, 'README');

            // Create a file firstly.
            await asyncdir.appendFile(filename, TXT);

            // Then remove it.
            await asyncdir.rmfr(filename);

            // The file should have been deleted.
            assert(!fs.existsSync(P(filename)));

            // The parent folder should be alive.
            assert(fs.existsSync(P(dirname)));
        }

        RM_DIR: {
            let dirname = P('rmfr');
            let filename = path.join(dirname, 'README');

            // Create a file firstly.
            await asyncdir.appendFile(filename, TXT);

            // Then remove the folder.
            await asyncdir.rmfr(dirname);

            // The folder should have been deleted.
            assert(!fs.existsSync(P(dirname)));
        }
    });

    it('touch', async () => {
        let filename = 'touch/README';
        await asyncdir.touch(filename);
        assert(fs.existsSync(P(filename)));
    });

    it('writeFile', async () => {
        let filename = 'writeFile/README';
        await asyncdir.writeFile(filename, TXT);
        assert(fs.existsSync(P(filename)));
    });

});