# Metalsmith JSON to files plugin

[![Build Status][travis-badge]][travis-url]

[![npm version][npm-badge]][npm-url]
[![code style: prettier][prettier-badge]][prettier-url]
[![metalsmith: plugin][metalsmith-badge]][metalsmith-url]

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
const json_to_files = require('metalsmith-json-to-files');

metalsmith.use(
  json_to_files({
    source_path: '../path/to/json_files/'
  })
);
```

### Use plugin

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

### Rename `data` object

The `data` object can be renamed by including `rename_data_to` in the front matter:
```md
---
name: My Posts
template: posts.hbs
json_files:
    rename_data_to: itemData
---
```


## Examples

See the [metalsmith-json-to-files CLI example](https://github.com/toddmorey/metalsmith-json-to-files-example)

## License

GPL-2.0

[travis-badge]: https://travis-ci.org/woodyrew/metalsmith-json-to-files.svg
[travis-url]: https://travis-ci.org/woodyrew/metalsmith-json-to-files
[npm-badge]: https://img.shields.io/npm/v/metalsmith-json-to-files.svg
[npm-url]: https://www.npmjs.com/package/metalsmith-json-to-files
[prettier-badge]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg
[prettier-url]: https://github.com/prettier/prettier
[metalsmith-badge]: https://img.shields.io/badge/metalsmith-plugin-green.svg?longCache=true
[metalsmith-url]: http://metalsmith.io
