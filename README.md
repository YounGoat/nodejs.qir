#	qir
__another fs__

>	If links in this document not avaiable, please access [README on GitHub](./README.md) directly.

##  Description

`qir` is variant of *dir* which is abbreviation of *directory*. Actually, this package is based on built-in module `fs` and offers easy utilities helping access with file system.

##	ToC

*	[Get Started](#get-started)
*	[API](#api)
* 	[Examples](#examples)
*	[Why qir](#why-qir)

##	Links

*	[CHANGE LOG](./CHANGELOG.md)
*	[Homepage](https://github.com/YounGoat/nodejs.qir)

##	Get Started

```javascript
const qir = require('qir');

// Sync mode.
qir.syncing.mkd('/foo/bar/quz');

// Async mode.
qir.asyncing.rmfr('/foo').then(() => {
    // ...
});
```

##	API

There are two collections of methods in this package. 

```javascript
const qir       = require('qir');
const qirSync   = require('qir/syncing');
const qirAsync  = require('qir/asyncing');

qir.syncing  === qirSync    // true
qir.asyncing === qirAsync   // true
```

The two collections are parallel. Each has following methods:  
__ATTENTION: In asynchronous mode, the leading type names represent NOT what the function will return on invoked, BUT *data* in `.then(data)`. Actually, each function will return an instance of `Promise` in asynchronous mode.__

*   void __appendFile__( string *filename*, string | Buffer *data* )
*   void __copyFile__( string *src*, string *dest*, number *flags* )
*   stream.Writable __createWriteStream__( string *filename*[, Object *options*] )
*   void __link__( string *existingPath*, string *newPath* )
*   void __mkd__( string *dirname* )
*   void __mkd_temp__( string *dirname* [, string *prefix*] )
*   void __mkd_parent__( string *pathname* )
*   integer __open__( string *filename* [, string | number *flags* [, integer *mode* ] ] )
*   void __rename__( string *oldPath*, string *newPath* )
*   void __rmfr__( string *pathname* )
*   void __touch__( string *filename* )
*   void __writeFile__ ( string *filename*, string | Buffer | TypedArray | DataView *data* )

ATTENTIONS:
*   Some methods accept same arguments with the homonynic methods in `fs`. But not each method has a symmetrical one in `fs`.
*   All methods in `qir.asyncing` will return an instance of Promise.
*   All methods in `qir.syncing` or `qir.asyncing` will automatically create parent directories if necessary.

##  Why *qir*

It is tedious to create an embedded directory with built-in module `fs`. E.g.

```javascript
// If you wannt to create a directory /foo/bar/quz while /foo doesnot exist:
fs.mkdirSync('/foo');
fs.mkdirSync('/foo/bar');
fs.mkdirSync('/foo/bar/quz');

// You may complete these operations in one step via `qir`.
qir.syncing.mkd('/foo/bar/quz');
```
