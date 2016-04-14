// thanks to http://gruntjs.com/sample-gruntfile
module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      files: ['*.js'],
      options: {
        esversion: 6,
        globals: {
          jQuery: true
        }
      }
    },

    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jshint']);

};
