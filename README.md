# metalsmith-json-to-files
Creates files from supplied JSON

A [Metalsmith](https://github.com/segmentio/metalsmith) plugin that lets you generate files from `JSON`.

## Features
- Many `JSON` files can be located in one directory for processing
- Filename is configurable and generated from `JSON` source file
- Permalink style filenames make for pretty URLs

## Installation
```bash
$ npm install metalsmith-json-to-files
```

## Usage

### Initialise plugin
```js
var json_to_files = require('metalsmith-json-to-files');

metalsmith.use(json_to_files({
    source_path: '../path/to/json_files/'
}));
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

## License
GPL-2.0