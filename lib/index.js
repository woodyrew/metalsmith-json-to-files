'use strict';

/* eslint no-cond-assign: 1 */

const debug = require('debug');
const log = debug('metalsmith-json-to-files');
const error = debug('metalsmith-json-to-files:error');

const joi = require('joi');
const each = require('async').each;
const path = require('path');
const slug = require('slug-component');
const jsonfile = require('jsonfile');

const resolve = require('lodash.get');
const extend = require('lodash.assign');

/**
 * Builds a filename out of a pattern if provided.
 * e.g.
 *   :collection/:fields.slug
 *   might return: 'pages/about'
 *
 * @param {String} filename_pattern
 * @param  {Object} entry
 * @param {String} extension File extension
 *
 * @return {String}
 */
const build_filename = (filename_pattern, entry, extension) => {
  log('Building Filename from: %s', filename_pattern);

  extension = extension || '.html';
  // Default filename
  let filename = 'not_found' + extension;

  /**
   * Get the params from a `pattern` string.
   *
   * @param {String} pattern
   * @return {Array}
   */
  const get_params = function get_params(pattern) {
    /* eslint no-cond-assign: 0 */
    const matcher = /:([\w]+(\.[\w]+)*)/g;
    const ret = [];
    let m;
    while ((m = matcher.exec(pattern))) {
      ret.push(m[1]);
    }
    return ret;
  };

  if (entry.filename_pattern) {
    let pattern = entry.filename_pattern;
    const params = get_params(pattern);

    params.forEach(function(element) {
      const replacement = resolve(entry, element);
      if (replacement) {
        pattern = pattern.replace(':' + element, slug(replacement.toString()));
      }
    });

    // Check all have been processed
    if (get_params(pattern).join('') === '') {
      filename = entry.as_permalink
        ? pattern + '/index' + extension
        : pattern + extension;
    } else {
      throw new TypeError("Couldn't build filename from: " + pattern);
    }
  }
  return filename;
};

const options_schema = {
  source_path: joi.string().required(),
  properties_to_remove: joi.array()
};

const metadata_schema = {
  source_file: joi.string().required(),
  filename_pattern: joi.string().required(),
  as_permalink: joi.boolean(),
  rename_data_to: joi.string()
};

const metadata_schema_options = {
  allowUnknown: true
};

/**
 * Metalsmith Plugin: Make files from a JSON source
 *
 * @param  {Object} options
 * @param  {String} options.source_path Path for source JSON files - Required
 *
 * @return {Function}         Gets used by Metalsmith with .use
 */
const plugin = options => {
  options = options || {};
  log('Options: %o', options);

  const properties_to_remove =
    options.properties_to_remove || Object.keys(metadata_schema);

  return (files, metalsmith, done) => {
    const keys = Object.keys(files);

    joi.validate(options, options_schema, err => {
      if (err) {
        error(err);
        done(new Error(err));
      }
    });

    /**
     * Uses the config from the source file and retrieves JSON data to produce files
     *
     * @param  {String} file
     *
     * @return {Void} Appends to files var.
     */
    const process_file = file => {
      const file_meta = files[file];

      // json_files object is not present so don"t proceed.
      if (!file_meta.json_files) {
        log('No json_files metadata for %s', file);
        return;
      }

      // Validate metadata params
      joi.validate(
        file_meta.json_files,
        metadata_schema,
        metadata_schema_options,
        function(err) {
          if (err) {
            error(err);
            done(new Error(err));
          }
        }
      );

      const source_filepath = path.resolve(
        metalsmith.directory(),
        options.source_path + file_meta.json_files.source_file + '.json'
      );

      // TODO: Check file exists and provide warning
      const json = jsonfile.readFileSync(source_filepath);

      // log('File json: %o', json);
      for (let key in json) {
        if (json.hasOwnProperty(key)) {
          const element = json[key];
          const defaults = { contents: '' };
          const meta = file_meta.json_files;

          let renamed_element_wrapper = {};
          // use key from `rename_data_to`, or default to "data"
          renamed_element_wrapper[meta.rename_data_to || 'data'] = element;

          const data = extend(defaults, meta, renamed_element_wrapper);

          // Take into account the parent in build filename
          const filename = build_filename(data.filename_pattern, data);

          // Remove properties that are no longer needed.
          properties_to_remove.forEach(property_to_remove => {
            delete data[property_to_remove];
          });

          files[filename] = data;
        }
      }
    };

    // Process through each of the files
    each(keys, process_file);
    done();
  };
};

module.exports = plugin;
