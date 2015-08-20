module.exports = function(grunt) {

  grunt.initConfig({

    concurrent: {
      target: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },

    // jshint: {
    //   files: ['Gruntfile.js', 'client/js/**/*.js', 'server/**/*.js'],
    //   options: {
    //     globals: {
    //       jQuery: true
    //     }
    //   }
    // },

    // uglify: {
    //   js: {
    //     files: {
    //       'public/build.js': [
    //         'client/js/player.js',
    //         'client/js/preload.js',
    //         'client/js/create.js',
    //         'client/js/update.js',
    //         'client/js/game.js'
    //       ]
    //     }
    //   }
    // },  

    watch: {
      // files: ['Gruntfile.js', 'public/**/*.js', 'server/**/*.js'],
      // tasks: ['build']
      files: ['**/*.sql'],
      tasks: ['shell:sqlInstall']
    },

    nodemon: {
      dev: {
        script: 'server/server.js'
      }
    },

    shell: {
      options: {
        stdout: true,
        stderr: true
      },
      install: {
        command: 'npm install'
      },
      sqlInstall: {
        command: [ 'mysql -u root < server/db/SQL/schema.sql',
                   'mysql --local-infile=1 -u root PoliticalData < server/db/SQL/setup.sql',
                  ].join('&&')
      },
      sqlInstall2: {
        command: [ 'mysql -u root < server/db/SQL/schema2.sql',
                   'mysql --local-infile=1 -u root PoliticalData < server/db/SQL/setup2.sql',
                  ].join('&&')
      },
      getData: {
        command: 'python server/db/dbRaw/ftp.py'
      }
    },

  });

  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('download',
    ['shell:getData']
  );

  grunt.registerTask('sqlTest',
    ['shell:sqlInstall2']
  );

  grunt.registerTask('install',
    ['shell:install',
     'shell:sqlInstall']
  );

  // grunt.registerTask('build',
  //   ['jshint',
  //    'uglify']
  // );

  grunt.registerTask('start',
    // ['build',
    //  'concurrent']
    ['concurrent']
  );
};