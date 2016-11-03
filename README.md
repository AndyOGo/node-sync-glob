# node-sync-glob

Synchronize files and folders locally by glob patterns, watch option included.

## Install

```sh
npm i sync-glob
```

## Usage

```sh
sync-glob bin/sync-glob.js <source> <target>

Options:
  --version      Show version number                                   [boolean]
  --help         Show help                                             [boolean]
  -d, --delete   Delete extraneous files from target   [boolean] [default: true]
  -w, --watch    Watch changes in source and keep target in sync
                                                      [boolean] [default: false]
  -i, --depth    Maximum depth if you have performance issues (not everywhere
                 yet: only on existing mirrors and watch scenario)
                                                    [number] [default: Infinity]
  -v, --verbose  Moar output                          [boolean] [default: false]
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
    "build": "sync-glob src/images dist/images",
    "watch": "sync-glob --watch src/images dist/images"
  }
}
```

## Credit/Inspiration

This package was inspired by [`node-sync-files`](https://github.com/byteclubfr/node-sync-files).
I mainly kept the API as is, but enhanced the file matching by utilizing powerful globs.
Additionally it is a complete rewrite in ES6 and it does not suffer from outdated dependencies.
