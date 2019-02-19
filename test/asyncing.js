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
    , asyncing = noda.inRequire('asyncing')
    ;

describe('asyncing', () => {
    const base = path.join(__dirname, 'resources');
    const P = name => path.join(base, name);
    const TXT = 'Hello CHING!';

    after(async function() {
        await asyncing.rmfr(base);
    });

    it('appendFile', async () => {
        let filename = P('append/README');
        await asyncing.appendFile(filename, TXT);
        assert(fs.existsSync(filename));
    });

    it('copyFile', async () => {
        let srcFilename  = P('copyFile/src/README');
        let destFilename = P('copyFile/dest/README');
        await asyncing.appendFile(srcFilename, TXT);
        await asyncing.copyFile(srcFilename, destFilename);
        assert(fs.existsSync(destFilename));
    });

    it('createWriteStream', async () => {
        let filename  = P('write/README');
        let s = await asyncing.createWriteStream(filename);
        assert(s instanceof stream.Writable);
        s.end();
    });

    it('link', async () => {
        let existingPath = P('link/src/README');
        let newPath      = P('link/dest/README');
        await asyncing.appendFile(existingPath, TXT);
        await asyncing.link(existingPath, newPath);
        assert(fs.existsSync(newPath));
    });

    it('mkd', async () => {
        let pathname = P('mkd/a/b/c');
        await asyncing.mkd(pathname);
        assert(fs.existsSync(pathname));
    });

    it('mkd_parent', async () => {
        let dirname = P('mkd_parent/a/b');
        let pathname = path.join(dirname, 'c');
        await asyncing.mkd_parent(pathname);
        assert(fs.existsSync(dirname));
    });

    it('mkd_temp', async () => {
        WITH_PREFIX: {
            let dirname = P('mkd_temp/a/b');
            let prefix = 'temp-';
            await asyncing.mkd_temp(dirname, prefix);
            
            let names = fs.readdirSync(dirname);
            assert(names.length == 1);

            let name = names[0];
            assert(/^temp-\w{6}$/.test(name));
        }

        NO_PREFIX: {
            let dirname = P('mkd_temp/a/c');
            await asyncing.mkd_temp(dirname);
            
            let names = fs.readdirSync(dirname);
            assert(names.length == 1);

            let name = names[0];
            assert(/^\w{6}$/.test(name));
        }
    });

    it('open', async () => {
        let filename = P('open/README');
        let fd = await asyncing.open(filename);
        assert(typeof fd == 'number');
        fs.closeSync(fd);
    });

    it('rename', async () => {
        let oldPath = P('rename/old');
        let newPath = P('rename/new/a/b/c');

        await asyncing.touch(oldPath);
        await asyncing.rename(oldPath, newPath);
        assert(fs.existsSync(newPath));
    });

    it('rmfr', async () => {
        RM_FILE: {
            let dirname = P('rmfr');
            let filename = path.join(dirname, 'README');

            // Create a file firstly.
            await asyncing.appendFile(filename, TXT);

            // Then remove it.
            await asyncing.rmfr(filename);

            // The file should have been deleted.
            assert(!fs.existsSync(filename));

            // The parent folder should be alive.
            assert(fs.existsSync(dirname));
        }

        RM_DIR: {
            let dirname = P('rmfr');
            let filename = path.join(dirname, 'README');

            // Create a file firstly.
            await asyncing.appendFile(filename, TXT);

            // Then remove the folder.
            await asyncing.rmfr(dirname);

            // The folder should have been deleted.
            assert(!fs.existsSync(dirname));
        }
    });

    it('touch', async () => {
        let filename = P('touch/README');
        await asyncing.touch(filename);
        assert(fs.existsSync(filename));
    });

    it('writeFile', async () => {
        let filename = P('write/README');
        await asyncing.writeFile(filename, TXT);
        assert(fs.existsSync(filename));
    });

});