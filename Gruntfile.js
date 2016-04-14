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
    run_node: { // thanks to https://github.com/jamesdbloom/grunt-run-node
        start: {
            options: {
                stdio: [null, null, null ],
            },
            files: { src: [ 'index.js'] }
        }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-run-node');

  grunt.registerTask('default', ['jshint', 'run_node']);

};
