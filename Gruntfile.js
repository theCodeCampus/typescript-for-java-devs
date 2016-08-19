'use strict';

var grunt = require('grunt');
var fabs = require('fabs');
var path = require('path');
var lodash = require('lodash');
var pkg = grunt.file.readJSON('./package.json');

module.exports = function () {
	var configFolder = path.resolve('./build-config');
	var fabsConfig = fabs.createConfig(configFolder);
	var fabsGruntConfig = fabsConfig.getGruntConfig();

	function getSlidesFromFolder() {
		var slides = grunt.file.expand(
			{nosort: true, cwd: 'src/slides'},
			['**/*.html']
		).map(function (slideFile) {
			return slideFile.substr(0, slideFile.indexOf('.'))
		});

		return JSON.stringify(slides, null, 2);
	}

	// normally fabs executes no js processing on change of templates
	// for auto-slides-configuration to work we have to add these tasks manually
	fabsGruntConfig.watch.templates.tasks = fabsGruntConfig.watch.templates.tasks.concat(['updateConfig:slides'], fabsGruntConfig.watch.js.tasks);


	var additionalConfig = {
		updateConfig: {
			slides: {
				update: {
					'preprocess.options.context.slides': getSlidesFromFolder
				}
			}
		},
		preprocess: {
			options: {
				context: {
					slides: getSlidesFromFolder()
				}
			}
		},
		replace: {
			version: {
				options: {
					prefix: '',
					patterns: [{
						match: '@@pkg.version',
						replacement: pkg.version,
						expression: false
					}]
				},
				files: [
					{
						expand: true,
						cwd: 'build-output/prepared',
						src: ['slides/overview.html'],
						dest: 'build-output/prepared'
					}
				]

			}
		}
	};
	grunt.registerTask('hookPrepareEnd', ['replace:version']);

	var gruntConfig = lodash.merge({}, fabsGruntConfig, additionalConfig);

	grunt.initConfig(gruntConfig);
};
