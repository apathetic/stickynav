/*global module:false*/
module.exports = function(grunt) {
	'use strict';

	var port = grunt.option('port') || 8000;

	// Load all grunt-related tasks
	grunt.loadNpmTasks( 'grunt-contrib-qunit' );
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-contrib-connect' );


	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		meta: {
			banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
					'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
					'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
					'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
					' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
		},

		qunit: {
			files: ['test/**/*.html']
		},

		jshint: {
			options: {
				curly: true,
				// eqeqeq: true,
				// immed: true,
				strict: 0,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				boss: true,
				eqnull: true,
				browser: true,
				globals: {
					'jQuery': true
				}
			},
			files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js']
		},

		uglify: {
			options: {
				banner: '<%= meta.banner %>\n'
			},
			build: {
				src: 'src/<%= pkg.name %>.js',
				dest: 'dist/<%= pkg.name %>.min.js'
			}
		},

		connect: {
			server: {
				options: {
					port: port,
					base: '.'
				}
			}
		},

		watch: {
			main: {
				files: [ 'Gruntfile.js', 'src/<%= pkg.name %>.js', 'src/<%= pkg.name %>.css' ],
				tasks: 'default'
			}
		}

	});


	// Project tasks
	grunt.registerTask( 'default', [
		'jshint',
		'uglify',
		// 'qunit'
	]);

	grunt.registerTask('build', [
		'jshint',
		// 'qunit',
		'uglify'
	]);

	grunt.registerTask('test', [
		'jshint',
		'qunit'
	]);

	grunt.registerTask('serve', [
		'connect',
		'watch'
	]);

};
