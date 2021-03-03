module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        uglify: {
            build: {
                files: {
                    'assets/js/index.min.js': 'src/js/index.js',
                    'assets/js/signin.min.js': 'src/js/signin.js',
                    'assets/js/signup.min.js': 'src/js/signup.js',
                    'assets/js/helper.min.js': 'src/js/helper.js',
                    'assets/js/dashboard.min.js': 'src/js/dashboard.js',
                    'assets/js/todo.min.js': 'src/js/todo.js',
                    'assets/js/recurringPayment.min.js':
                        'src/js/recurringPayment.js',
                },
            },
        },
        watch: {
            scripts: {
                files: ['src/js/**', 'src/apidoc/**', 'assets/css/**'],
                tasks: ['uglify', 'copy'],
            },
        },
        apidoc: {
            taskboard: {
                src: 'src/apidoc/',
                dest: 'docs/',
            },
        },
        copy: {
            main: {
                files: [
                    // copy bootstrap/jquery files
                    {
                        expand: true,
                        flatten: true,
                        src: ['./node_modules/jquery/dist/jquery.slim.min.js'],
                        dest: './assets/js',
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: [
                            './node_modules/bootstrap/dist/js/bootstrap.min.js',
                        ],
                        dest: './assets/js',
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: [
                            './node_modules/bootstrap/dist/js/bootstrap.min.js.map',
                        ],
                        dest: './assets/js',
                    },
                    // copy chart.js files
                    {
                        expand: true,
                        flatten: true,
                        src: ['./node_modules/chart.js/dist/*.js'],
                        dest: './assets/js',
                    },
                    // copy non minified js for development
                    {
                        expand: true,
                        flatten: true,
                        src: ['./src/js/*'],
                        dest: './assets/js',
                    },
                ],
            },
        },
    });

    //load plugins
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify-es');
    grunt.loadNpmTasks('grunt-apidoc');
    grunt.loadNpmTasks('grunt-contrib-copy');

    //register tasks
    grunt.registerTask('build', ['uglify', 'copy', 'apidoc']);
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('apiDoc', ['apidoc']);
};
