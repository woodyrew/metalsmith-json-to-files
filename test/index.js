/* eslint-env mocha */

'use strict';

// Remove when 0.12 is no longer needed to be supported
require('harmonize')();

var expect        = require('chai').expect;
var equal         = require('assert-dir-equal');
var Metalsmith    = require('metalsmith');
var templates     = require('metalsmith-templates');
var json_to_files = require('../lib');


describe('metalsmith-json-to-files basic', function () {

    var test_path = 'test/fixtures/basic';

    it('should fail without source_path', function (done) {

        new Metalsmith(test_path)
        .use(json_to_files())
        .build(function (err) {

            expect(err).to.be.an('error');
            done();
        });
    });

    it('should do standard file copying', function (done) {

        new Metalsmith(test_path)
        .use(json_to_files({
            source_path: '../json/'
        }))
        .build(function (err) {
            if (err) { return done(err); }

            equal(test_path + '/expected', test_path + '/build');
            done();
        });
    });

});


describe('metalsmith-json-to-files file generation', function () {

    var test_path = 'test/fixtures/file_generation';

    it('should do basic file generation', function (done) {

        new Metalsmith(test_path)
        .use(json_to_files({
            source_path: '../json/'
        }))
        .build(function (err) {
            if (err) { return done(err); }

            equal(test_path + '/expected', test_path + '/build');
            done();
        });
    });
});


describe('metalsmith-json-to-files file generation with permalinks', function () {

    var test_path = 'test/fixtures/file_generation_permalinks';

    it('should do basic file generation', function (done) {

        new Metalsmith(test_path)
        .use(json_to_files({
            source_path: '../json/'
        }))
        .build(function (err) {
            if (err) { return done(err); }

            equal(test_path + '/expected', test_path + '/build');
            done();
        });
    });
});


describe('metalsmith-json-to-files file generation with templates', function () {

    var test_path = 'test/fixtures/hbs_templates';

    it('should do basic file generation', function (done) {

        new Metalsmith(test_path)
        .use(json_to_files({
            source_path: '../json/'
        }))
        .use(templates({
            engine   : 'handlebars'
          , directory: 'templates'
        }))
        .build(function (err) {
            if (err) { return done(err); }

            equal(test_path + '/expected', test_path + '/build');
            done();
        });
    });
});

describe('metalsmith-json-to-files file generation from metadata', function () {

    var test_path = 'test/fixtures/file_generation_metadata';

    it('should do basic file generation', function (done) {

        new Metalsmith(test_path)
        .metadata({
            test_json: [
                {
                    filename: 'success'
                  , name    : 'Test Success'
                  , contents: 'JSON === Winning'
                }
            ]
        })
        .use(json_to_files({
            use_metadata: true
        }))
        .build(function (err) {
            if (err) { return done(err); }

            equal(test_path + '/expected', test_path + '/build');
            done();
        });
    });
});

describe('metalsmith-json-to-files Tests', function () {
    it('should handle missing json file');
    it('should handle filename not being able to be generated');
    it('should create permalinks');
    it('should work with (handlebars) templates');
});
