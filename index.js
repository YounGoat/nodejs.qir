'use strict';

const MODULE_REQUIRE = 1
	/* built-in */
	
	/* NPM */
	
	/* in-package */
	, syncing = require('./syncing')
	, asyncing = require('./asyncing')
	;

module.exports = {
	syncing,
	asyncing,
};