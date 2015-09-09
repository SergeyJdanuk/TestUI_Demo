//just include config
var fs = require('fs');
var vm = require('vm');
vm.runInThisContext(fs.readFileSync('app/config.js'));

module.exports = function(grunt) {

  grunt.initConfig({
    react: {
      jsx: {
        files: {
          'app/jsx/combined.js': config.jsx
        }
      }
    },
    jst: {
      compile: {
        files: {
          "app/template/templates.js": [
            'app/templates/*.htt',
            'app/templates/epg/*.htt',
            'app/templates/movie/*.htt',
            'app/templates/vod/*.htt',
            'app/templates/sources/*.htt',
            'app/templates/settings/*.htt',
            'app/templates/actor/*.htt',
            'app/templates/player/*.htt',
            'app/templates/apps/*.htt'
          ]
        }
      }
    },
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: config.js,
        dest: 'dist/build.js'
      }
    },
    uglify: {
      build: {
        options: {
          sourceMap: true,
          sourceMapName: 'dist/build.map'
        },
        files: {
          'dist/build.min.js': ['dist/build.js']
        }
      }
    },
    watch: {
      scripts: {
        files: ['app/**', 'framework/**/*.js', 'Gruntfile.js'],
        tasks: ['default'],
        options: {
          spawn: false,
          livereload: true
        }
      }
    },
    jsvalidate: {
      options:{
        globals: {},
        esprimaOptions: {},
        verbose: false
      },
      targetName:{
        files:{
          src:['dist/build.js']
        }
      }
    },
    jshint: {
      all: [
      'Gruntfile.js',
      'app/localization/*.js',
      'app/modules/**/*.js',
      'app/config.js',
      'app/main.js',
      'framework/**/*.js']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jst');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jsvalidate');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-react');

  // Default task(s).
  grunt.registerTask('template', ['jst']);
  grunt.registerTask('hint', ['watch']);
  grunt.registerTask('default', ['react', 'jst', 'concat']);
};
