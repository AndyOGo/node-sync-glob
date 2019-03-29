# node-sync-glob

[![Build Status](https://travis-ci.org/AndyOGo/node-sync-glob.svg?branch=master)](https://travis-ci.org/AndyOGo/node-sync-glob)

[![Build status](https://ci.appveyor.com/api/projects/status/9i48hbtrfsy5sk1m/branch/master?svg=true)](https://ci.appveyor.com/project/AndyOGo/node-sync-glob/branch/master)

Synchronize files and folders locally by glob patterns, watch option included.

## Install

```sh
npm i sync-glob
```

## Usage

```sh
Usage: bin/sync-glob.js <sources> <target>

Commands:
  sources  One or more globs, files or directories to be mirrored (glob
           exclusions are supported as well - ! prefix)
  target   Destination folder for mirrored files

Options:
  --version            Show version number                             [boolean]
  --help               Show help                                       [boolean]
  -d, --delete         Delete extraneous files from target
                                                       [boolean] [default: true]
  -w, --watch          Watch changes in sources and keep target in sync
                                                      [boolean] [default: false]
  -i, --depth          Maximum depth if you have performance issues (not
                       everywhere yet: only on existing mirrors and watch
                       scenario)                    [number] [default: Infinity]
  -t, --transform      A module name to transform each file. sync-glob lookups
                       the specified name via "require()".              [string]
  -e, --exit-on-error  Exit if an error occurred                 [default: true]
  -v, --verbose        Moar output                    [boolean] [default: false]
  -s, --silent         No output (except errors)                [default: false]

copyright 2016
```

### In your `package.json`

You may have some build script in your package.json involving mirroring folders (let's say, static assets), that's a good use-case for `sync-glob`:

```js
// Before
{
  "scripts": {
    "build": "cp -rf src/images dist/",
    "watch": "???"
  }
}

// After
{
  "devDependencies": {
    "sync-glob": "^1.0.0"
  },
  "scripts": {
    "build": "sync-glob 'src/images/*' dist/images",
    "watch": "sync-glob --watch 'src/images/*' dist/images"
  }
}
```

### Important

Make sure that your globs are not being parsed by your shell by properly escaping them, e.g.: by quoting `'**/*'`.

### Exclude stuff

To exclude stuff from source just use glob exclusion - `!` prefix, like:
```js
{
  "scripts": {
    "sync": "sync-glob 'src/images/*' '!src/images/excluded.jpg' dist/images"
  }
}
```

### Windows

As [`node-glob`](https://www.npmjs.com/package/glob#windows) and [`node-glob-all`](https://www.npmjs.com/package/glob-all) respectively only support unix style path separators `/`, don't use windows style `\`.

> **Please only use forward-slashes in glob expressions.**
>
> Though windows uses either `/` or `\` as its path separator, only `/`
> characters are used by this glob implementation.  You must use
>forward-slashes **only** in glob expressions.  Back-slashes will always
> be interpreted as escape characters, not path separators.
>
> Results from absolute patterns such as `/foo/*` are mounted onto the
> root setting using `path.join`.  On windows, this will by default result
> in `/foo/*` matching `C:\foo\bar.txt`.

## API

Check our [API documentation](./API.md)

## Credit/Inspiration

This package was mainly inspired by [`node-sync-files`](https://github.com/byteclubfr/node-sync-files).
I mainly kept the API as is, but enhanced the file matching by utilizing powerful globs.
Additionally it is a complete rewrite in ES6 and it does not suffer from outdated dependencies.
Some fancy features like `--transform` is inspired by [`cpx`](https://www.npmjs.com/package/cpx)

Proudly brought to you by [`<scale-unlimited>`](http://www.scale-unlimited.com)
