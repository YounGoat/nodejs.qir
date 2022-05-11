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
const SyncDir   = require('qir/SyncDir');
const AsyncDir  = require('qir/AsyncDir');

qir.syncing  === qirSync    // true
qir.asyncing === qirAsync   // true
qir.SyncDir  === SyncDir    // true
qir.AsyncDir === AsyncDir   // true
```

*   class __qir.AsyncDir__( string *basepath* )
*   class __qir.SyncDir__( string *basepath* )
*   Object __qir.syncing__
*   Object __qir.asyncing__

The method collections `syncing` and `asyncing` are parallel, so are the classes `AsyncDir` and `SyncDir`.

Each of the method collections and class instances has following methods:  

*   void | Promise(void)   
    __appendFile__( string *filename*, string | Buffer *data* )

*   void | Promise(void)  
    __clear__()  
    Only available for instances of `AsyncDir` and `SyncDir`.  
    Remove everything in the directory and the directory itself.

*   void | Promise(void)  
    __copy__( string *src*, string *dest*)

*   void | Promise(void)   
    __copyFile__( string *src*, string *dest*, number *flags* )

*   stream.Readable | Promise(stream.Readable)  
    __createReadStream__( string *filename*[, Object *options*] )

*   stream.Writable | Promise(stream.Writable)  
    __createWriteStream__( string *filename*[, Object *options*] )

*   boolean  
    __exists__( string *pathname* )  
    Only available for instances of `AsyncDir` and `SyncDir`.

*   void | Promise(void)  
    __link__( string *existingPath*, string *newPath* )

*   void | Promise(void)  
    __mkd__( string *dirname* )

*   void | Promise(void)  
    __mkd_temp__( string *dirname* [, string *prefix*] )

*   void | Promise(void)  
    __mkd_parent__( string *pathname* )

*   integer | Promise(integer)  
    __open__( string *filename* [, string | number *flags* [, integer *mode* ] ] )

*   string | Buffer | Promis(string) | Promise(Buffer)  
    __readFile__( string *pathname* )  
    Only available for instances of `AsyncDir` and `SyncDir`.

*   JSON | Promise(JSON)  
    __readJSON__( string *filename* )

*   string[] | Promis(string[])  
    __readdir__( string *dirname* )  

*   void | Promise(void)  
    __rename__( string *oldPath*, string *newPath* )

*   string  
    __resolve__( string *pathname* )  
    Only available for instances of `AsyncDir` and `SyncDir`.

*   void | Promise(void)  
    __rmfr__( string *pathname* )

*   fs.Stats | Promise(fs.Stats)  
    __stat__( string *pathname* )  
    ATTENTION： This method is some different from built-in `fs.stats` which will throws an Error if the target is not accessible. It will return `null` in such case.

*   void | Promise(void)  
    __symlink__( string *target*, string *pathname* [, string *type* ] )

*   void | Promise(void)  
    __touch__( string *filename* )

*   void | Promise(void)  
    __writeFile__ ( string *filename*, string | Buffer | TypedArray | DataView *data* )

*   void | Promise(void)  
    __writeJSON__ ( string *filename*, JSON *json* )

ATTENTIONS:
*   In asynchronous mode, the leading type names represent NOT what the function will return on invoked, BUT *data* in `.then(data)`. Actually, each function will return an instance of `Promise` in asynchronous mode.

*   When pathname (dirname or filename) occurs in methods of `new AsyncDir()` and `new SyncDir()`, it will be regarded to be relative to the `basepath`.

*   Some methods accept same arguments with the homonynic methods in `fs`. But not each method has a symmetrical one in `fs`.

*   All methods in `qir.asyncing` and `new AsyncDir()` will return an instance of Promise.

*   All methods will automatically create parent directories if necessary.

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
