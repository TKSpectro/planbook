module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        uglify: {
            build: {
                files: {
                    'assets/js/index.min.js': 'src/js/index.js',
                    'assets/js/login.min.js': 'src/js/login.js',
                    'assets/js/register.min.js': 'src/js/register.js',
                    'assets/js/helper.min.js': 'src/js/helper.js',
                    'assets/js/dashboard.min.js': 'src/js/dashboard.js',
                    'assets/js/dashboardList.min.js': 'src/js/dashboardList.js',
                    'assets/js/recurringPayment.min.js': 'src/js/recurringPayment.js',
                    'assets/js/payment.min.js': 'src/js/payment.js',
                    'assets/js/member.min.js': 'src/js/member.js',
                    'assets/js/savePayment.min.js': 'src/js/savePayment.js',
                    'assets/js/moneypool.min.js': 'src/js/moneypool.js',
                    'assets/js/moneypoolList.min.js': 'src/js/moneypoolList.js',
                    'assets/js/saveMoneypool.min.js': 'src/js/saveMoneypool.js',
                },
            },
        },
        watch: {
            scripts: {
                files: ['src/js/**', 'assets/css/**'],
                tasks: ['uglify', 'copy'],
            },
            apiDoc: {
                files: ['src/apidoc/**'],
                tasks: ['apidoc'],
            },
        },
        apidoc: {
            planbook: {
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
                        src: ['./node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'],
                        dest: './assets/js',
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['./node_modules/bootstrap/dist/js/bootstrap.bundle.min.js.map'],
                        dest: './assets/js',
                    },

                    // copy chart.js files
                    {
                        expand: true,
                        flatten: true,
                        src: ['./node_modules/chart.js/dist/*.js'],
                        dest: './assets/js',
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['./node_modules/chartjs-plugin-datalabels/dist/*.js'],
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
