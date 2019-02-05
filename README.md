[![Build Status](https://travis-ci.org/woodyrew/metalsmith-json-to-files.svg)](https://travis-ci.org/woodyrew/metalsmith-json-to-files)

# Metalsmith json to files
Creates files from supplied JSON

A [Metalsmith](https://github.com/segmentio/metalsmith) plugin that lets you generate files from `JSON`.

## Features
- Many `JSON` files can be located in one directory for processing
- Filename is configurable and generated from `JSON` source
- Permalink style filenames make for pretty URLs
- `JSON` source can be either from files, or Metalsmith metadata keys

## Installation
```bash
$ npm install metalsmith-json-to-files
```

## Usage

### Initialise plugin

Intialise the plugin to work with either `source_path` or `use_metadata` options.

#### `source_path` option for JSON files

With `source_path`, json-to-files will expect `source_file` to be defined in the YAML front-matter. Its value is a valid filepath where content files can be found.

```js
var json_to_files = require('metalsmith-json-to-files');

metalsmith.use(json_to_files({
    source_path: '../path/to/json_files/'
}));
```

```md
---
name: My Posts
template: posts.hbs
json_files:
    source_file: posts
    filename_pattern: posts/:date-:fields.slug
    as_permalink: true
    template: post.hbs

---

Take a look...
```

#### `use_metadata` option for Metalsmith metadata

With `use_metadata: true`, json-to-files will expect `metadata_key` to be defined in the YAML front-matter. Its value will be the name of a Metalsmith metadata object key defined earlier in the plugin pipeline.

```js
var json_to_files = require('metalsmith-json-to-files');

metalsmith.use(json_to_files({
    use_metadata: true
}));
```

```md
---
name: My Posts
template: posts.hbs
json_files:
    metadata_key: posts
    filename_pattern: posts/:date-:fields.slug
    as_permalink: true
    template: post.hbs

---

Take a look...
```


Any extra metadata within the `json_files` object will be passed through to the files it generates as `data.`

## Examples
See the [metalsmith-json-to-files CLI example](https://github.com/toddmorey/metalsmith-json-to-files-example)


## License
GPL-2.0
