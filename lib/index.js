var debug = require('debug');
var log   = debug('metalsmith-json-to-files');
//var error = debug('metalsmith-json-to-files:error');

var _    = require('lodash');
var each = require('async').each;
var path = require('path');
var slug = require('slug-component');

//var log_obj   = require("./log_object");

/**
 * Ensures paramaters that are required have been provided within object provided.
 * Throws a type error if missing.
 *
 * @param  {Object} object
 * @param  {String} property
 *
 * @return {Void}
 */
var require_param = function (object, property) {
    'use strict';
    if (!(object && object[property])) {
        throw new TypeError('Required Property Missing: ' + property);
    }
};

/**
 * Retrieve value within object/array from string
 * Used the following as the basis:
 * @link http://stackoverflow.com/a/16190716
 *
 * @param {Object|Array} obj
 * @param {String} prop      Dot separated
 * @param {Mixed} def        Default value, if result undefined
 *
 * @returns {Mixed}
 */
var resolve = _.get;



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
var build_filename = function build_filename (filename_pattern, entry, extension) {
    'use strict';

    extension = extension || '.html';
    // Default filename
    var filename = 'not_found' + extension;

    /**
     * Get the params from a `pattern` string.
     *
     * @param {String} pattern
     * @return {Array}
     */
    var get_params = function get_params (pattern) {
        var matcher = /:([\w]+(\.[\w]+)*)/g;
        var ret = [];
        var m;
        while (m = matcher.exec(pattern)){
            ret.push(m[1]);
        }
        return ret;
    };


    if (entry.filename_pattern) {
        var pattern = entry.filename_pattern;
        var params = get_params(pattern);

        params.forEach(function(element){
            var replacement = resolve(entry, element);
            if (replacement) {
                pattern = pattern.replace(':' + element, slug(replacement.toString()));
            }
        });

        // Check all have been processed
        if (get_params(pattern).join('') === '') {
            filename = (entry.as_permalink) ? pattern + '/index' + extension : pattern + extension;
        }
        else {
            throw new TypeError("Couldn't build filename from: " + pattern);
        }
    }
    return filename;
};



/**
 * Metalsmith Plugin: Make files from a JSON source
 *
 * @param  {Object} options
 * @param  {String} options.source_path Path for source JSON files - Required
 *
 * @return {Function}         Gets used by Metalsmith with .use
 */
var plugin = function plugin (options) {
    'use strict';
    options = options || {};
    log('Options: %o', options);
    var properties_to_remove = options.properties_to_remove || [
        'source_file'
      , 'filename_pattern'
      , 'as_permalink'
    ];
    require_param(options, 'source_path');

    return function (files, metalsmith, done) {
        var keys = Object.keys(files);

        /**
         * Uses the config from the source file and retrieves JSON data to produce files
         *
         * @param  {String} file
         * @param  {Function} process_file_callback
         *
         * @return {Void} Appends to files var.
         */
        var process_file = function process_file (file, process_file_callback) {

            var file_meta = files[file];

            // json_files object is not present so don"t proceed.
            if (!file_meta.json_files) {
                process_file_callback();
                return;
            }

            require_param(file_meta.json_files, 'source_file');

            var source_filepath = path.resolve(options.source_path + file_meta.json_files.source_file + '.json');

            // Check file exists
            var json = require(source_filepath);

            // log_obj("File json", json.fields);
            json.forEach(function(element){
                var defaults = {contents: ''};
                var meta     = file_meta.json_files;
                var data     = _.extend(defaults, meta, {data: element});

                // Take into account the parent in build filename
                var filename = build_filename(data.filename_pattern, data);

                // Remove properties that are no longer needed.
                properties_to_remove.forEach(function(property_to_remove){
                    delete data[property_to_remove];
                });

                files[filename] = data;
            });

            process_file_callback();
        };

        // Process through each of the files
        each(keys, process_file, done);
    };
};

module.exports = plugin;
