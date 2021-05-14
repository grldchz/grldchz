/**
    GRLDCHZ - Social network built with jquery+react+bootstrap
	GruntFile.js is part of GRLDCHZ
	
    Copyright (C) 2021 grilledcheeseoftheday.com

    GRLDCHZ is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    GRLDCHZ is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
**/
module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		srcPath: 'src',
		buildPath: 'build',
		copy: {
			build: {
				cwd: 'src',
				src: [ '**', '.*' ],
				dest: '<%= buildPath %>',
				expand: true
			},
		},
		clean: {
			build: {
				src: [ '<%= buildPath %>/**', '<%= buildPath %>/.*' ]
			},
			stylesheets: {
				src: [ 
					'<%= buildPath %>/css/app.css', 
					'!<%= buildPath %>/css/<%= pkg.name %>.min.css'
				]
			},
			scripts: {
				src: [ 
					'<%= buildPath %>/js/require.js', '<%= buildPath %>/js/app/**', 
					'!<%= buildPath %>/js/<%= pkg.name %>.min.js'
				]
			}
		},
		cssmin: {
			build: {
				files: {
					'<%= buildPath %>/css/<%= pkg.name %>.min.css': [ '<%= buildPath %>/css/app.css' ]
				}
			}
		},    
		shell: {
			'build-jsx': {
				command: [
					'jsx -x js <%= srcPath %>/js/app/view <%= buildPath %>/js/app/view',
					].join(' && '),
				stdout: true,
				failOnError: true
			}
		},		
		replace: {
			loginjs: {
				src: ['<%= buildPath %>/js/app/view/Login.js'],
				dest: '<%= buildPath %>/js/app/view/Login.js', 
				replacements: [{
					from: '//username:"guest", password:"changeme",',
					to: function(){
						if(grunt.option('dev')){
							return 'username:"guest", password:"changeme",';
						}
						else{
							return '';
						}
					}
				}]
			},
			view: {
				src: ['<%= buildPath %>/js/app/view/*.js'],
				dest: '<%= buildPath %>/js/app/view/',
				replacements: [{
					from: 'jsx!', 
					to: ''
				}]
			},
			mainjs: {
				src: ['<%= buildPath %>/js/app/main.js'],
				dest: '<%= buildPath %>/js/app/', 
				replacements: [{
					from: 'jsx!',
					to: ''
				}]
			},
			indexhtml: {
				src: ['<%= buildPath %>/index.html'],
				dest: '<%= buildPath %>/index.html',
				replacements: [
					{
						from: 'app/main.js',
						to: '<%= pkg.name %>.min.js'
					},
					{
						from: 'app.css',
						to: '<%= pkg.name %>.min.css'
					},
					{
						from: '<script src="js/require.js"></script>',
						to: ''
					},
					{
						from: 'GRLDCHZ',
						to: function(){
							if(grunt.option('dev')){
								return 'GRLDCHZ DEV';
							}
							else{
								return 'Grilled Cheese of the Day';
							}
						}
					},
					{
						from: '%timestamp%',
						to: new Date().getTime()
					},
					{
						from: '%copyright%',
						to: new Date().getFullYear()
					},
					{
						from: 'grldservice-dev',
						to: function(){
							if(grunt.option('dev')){
								return 'grldservice-dev';
							}
							else{
								return 'grldservice';
							}
						}
					}
				]
			}
		},
		comments: {
			build: {
				// Target-specific file lists and/or options go here.
				options: {
					singleline: true,
					multiline: true,
					keepSpecialComments: false
				},
			src: [ '<%= buildPath %>/*.html', '<%= buildPath %>/css/*.css', '<%= buildPath %>/js/*.js' ] // files to remove comments from
			}
		},
		requirejs: {
			compile: { // <<== nest the options in this.
				options: {
				    baseUrl: '<%= buildPath %>/js/app',
				    mainConfigFile: '<%= buildPath %>/js/require.js',
				    keepBuildDir: true,
					allowSourceOverwrites:true,
					name: "main",
					out: "<%= buildPath %>/js/<%= pkg.name %>.min.js"
				},
			    error: function(done, err) {
					grunt.log.warn(err);
					done();
			    }
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-stripcomments');
	grunt.registerTask(
		'stylesheets', 
		'Compiles the stylesheets.', 
		[ 'cssmin', 'clean:stylesheets' ]
	);
	grunt.registerTask('scripts', [
		'shell:build-jsx', 'replace', 'requirejs', 
		'clean:scripts'
	]);
	grunt.registerTask(
		'default', 
		'Compiles all of the assets and copies the files to the build directory.', 
		[ 'clean', 'copy', 'stylesheets', 'scripts', "comments" ]
	);
};