module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        less: {
            development: {
                options: {
                    paths: ['src/less'],
                    compress: true,
                    plugins: [
                        new (require('less-plugin-autoprefix'))({
                            browsers: ['last 2 versions', 'ie 9'],
                        }),
                    ],
                    banner:
                        '/*!\n' +
                        ' * Created By Tom Käppler\n' +
                        ' * @version 1.0.0\n' +
                        ' */\n',
                },
                files: {
                    /*
                    'assets/css/layout.css': 'src/less/layout.less',
                    'assets/css/index.css': 'src/less/index.less',
                    'assets/css/signin.css': 'src/less/signin.less',
                    'assets/css/imprint.css': 'src/less/imprint.less',
                    */
                },
            },
        },

        uglify: {
            build: {
                files: {
                    'assets/js/index.min.js': 'src/js/index.js',
                    'assets/js/signin.min.js': 'src/js/signin.js',
                    'assets/js/signup.min.js': 'src/js/signup.js',
                    'assets/js/dashboard.min.js': 'src/js/dashboard.js',
                },
            },
        },
        watch: {
            scripts: {
                files: [
                    'src/less/**',
                    'src/js/**',
                    'src/apidoc/**',
                    'src/css/**',
                ],
                tasks: ['less', 'uglify', 'copy'],
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
                    // includes files within path
                    {},
                ],
            },
        },
    });

    //load plugins
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify-es');
    grunt.loadNpmTasks('grunt-apidoc');
    grunt.loadNpmTasks('grunt-contrib-copy');

    //register tasks
    grunt.registerTask('build', ['less', 'uglify', 'copy', 'apidoc']);
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('apiDoc', ['apidoc']);
};
