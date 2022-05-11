/**
 * @author Youngoat@163.com
 * @create 2022-05-11
 */

'use strict';

const MODULE_REQUIRE = 1
	/* built-in */
	, os = require('os')
    , path = require('path')

	/* NPM */
	
	/* in-package */
	;

module.exports = function tmpdir() {
	return path.join(os.tmpdir(), Date.now() + Math.random() + '');
};