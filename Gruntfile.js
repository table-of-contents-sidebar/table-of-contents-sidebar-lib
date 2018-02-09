var grunt = require('grunt');

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        cssmin: {
            production: {
                files: {
                    'table-of-contents-sidebar.css': ['src/table-of-contents-sidebar.css']
                }
            }
        },

        uglify: {
            production: {
                files: {
                    'table-of-contents-sidebar.js': [
                        'src/table-of-contents-sidebar.js'
                    ]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['cssmin', 'uglify']);
};