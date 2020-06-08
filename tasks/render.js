/*
 * grunt-ejs-render
 * https://github.com/dwightjack/grunt-ejs-render
 *
 * Copyright (c) 2013 Marco Solazzi
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

	var ejs = require('ejs'),
		 path = require('path'),
		   fs = require('fs'),
		    _ = require('lodash');

	//add `underscore.string` for deprecated `grunt.util._` compat
	_.str = require('underscore.string');
	_.mixin(_.str.exports());

	function render(filepath, options) {
		var src = '';
		if (grunt.file.exists(filepath)) {
			src = grunt.file.read(filepath);
			return ejs.render(src, options || null);
		} else {
			grunt.log.warn('File "' + filepath + '" not found.');
			return '';
		}
	}

	function getFile(filepath, paths) {
		var fpath,
			exists = false;

		exists = (paths || []).some(function (p) {
		  fpath = path.join(p, filepath);
      if (grunt.file.isFile(fpath)) return true;

      fpath = path.join(p, path.dirname(filepath) + '/_' + path.basename(filepath));
      if (grunt.file.isFile(fpath)) return true;

      fpath = path.join(p, path.dirname(filepath) + '/_' + path.basename(filepath) + '.ejs');
      if (grunt.file.isFile(fpath)) return true;
		});

		if (exists) {
			return fpath;
		} else {
			grunt.log.warn('Unable to find filepath "' + filepath + '"');
			return false;
		}
	}

	grunt.registerMultiTask('render', 'Renders an EJS template to plain HTML', function() {
		var options = this.options({
				helpers: {},
				partialPaths: [],
				"_": _
			}),
			datapath,
			methods = {};

    methods.renderPartial = function(filepath, data) {
			var fpath = getFile(filepath, options.partialPaths);
			if (fpath !== false) {
				return render(fpath, _.extend({}, options, {filename: fpath}, data || {}));
			}
			return '';
		};

		if ( _.has(options, 'data')) {
			if ( _.isArray(options.data) ) {

				datapath = [].concat(options.data);
				datapath = _(datapath)
							.map(function(filepath) {
								return grunt.file.expand({
									filter: function(src) {
										return grunt.file.isFile(src) && (path.extname(src) === '.yaml');
									}
								}, grunt.config.process(filepath));
							})
							.flatten()
							.uniq()
							.valueOf();

				options.data = {};
				datapath.forEach(function (file) {
					var filename = path.basename(file, '.yaml');
					var keyName = _.camelize( _.slugify(filename) );
					options.data[keyName] = grunt.file.readYAML(file);
				});

			} else if (_.isFunction(options.data)) {
				options.data = options.data();
			}
		}

		options.helpers = _.defaults(options.helpers, methods);

		_.forOwn(options.helpers, function(helperFunc, helperName, helpers) {
			if (_.isFunction(helperFunc)) {
				helpers[helperName] = _.bind(helperFunc, options);
			}
		});

		this.files.forEach(function(file) {
			var contents = file.src.map(function(filepath) {
				options.filename = filepath;
				return render(filepath, options);
			}).join('\n');

			grunt.file.write(file.dest, contents);
			grunt.log.writeln('Rendered HTML file to "' + file.dest + '"');
		});
	});
};
