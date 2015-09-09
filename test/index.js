//require('harmonize')();

var expect        = require('chai').expect
var equal         = require('assert-dir-equal');
var Metalsmith    = require('metalsmith');
var json_to_files = require('../lib');

describe('metalsmith-json-to-files', function(){

    it('should do basic file generation', function (done){

        new Metalsmith('test/fixtures/basic')
        .use(json_to_files({
            source_path: '../json/'
        }))
        .build(function(err){
            if (err){ return done(err); }
            
            equal('test/fixtures/basic/expected', 'test/fixtures/basic/build');
            done();
        });
    });
    
    it('should fail without source_path', function (done){

        new Metalsmith('test/fixtures/basic')
        .use(json_to_files())
        .build(function(err){
            
            expect(err).to.be.an('error');
            done();
        });
    });
});
