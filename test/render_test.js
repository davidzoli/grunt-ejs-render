'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.render = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  default_options: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/default_options');
    var expected = grunt.file.read('test/expected/default_options');
    test.equal(actual, expected, 'EJS templating works, relative paths to partials are preserved');

    test.done();
  },
  custom_options: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/custom_options');
    var expected = grunt.file.read('test/expected/custom_options');
    test.equal(actual, expected, 'Task helpers (lo-dash templates, lo-dash) in action');

    test.done();
  },
  read_file_helper: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/read_file_helper');
    var expected = grunt.file.read('test/expected/read_file_helper');
    test.equal(actual, expected, 'Read file helpers imports external files');

    test.done();
  },
  read_file_md_filter: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/read_file_md_filter').trim();
    var expected = grunt.file.read('test/expected/read_file_md_filter').trim();
    test.equal(actual, expected, 'Read file helpers imports external files and markdown filters parses it');

    test.done();
  }
};
