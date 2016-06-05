// thanks to http://gruntjs.com/sample-gruntfile
module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      files: ['src/*/*.js', 'src/*/*/*.js', '*.js', '*.json', 'test/*.js', 'test/*/*.js'],
      options: {
        esversion: 6,
        globals: {
          jQuery: true
        }
      }
    },
    run: { // thanks to https://www.npmjs.com/package/grunt-run
        server: {
            args: [
                'src/server/index.js'
            ]
        }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-run');

  grunt.registerTask('default', ['jshint', 'run']);

};
