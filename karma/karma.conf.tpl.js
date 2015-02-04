module.exports = function (karma) {
    karma.set({
        /**
         * From where to look for files, starting with the location of this file.
         * After this file is compiled by grunt, it is located under <%= grunt.config('build_debug_dir')%>
         */
        basePath: '../../', // The basePath configuration here means that starting from client folder to search files

        /**
         * This is the list of file patterns to load into the browser during testing.
         */
        files: [
            <% scripts.forEach( function ( file ) { %>'<%= file %>',
                <% }); %>
            'src/**/*.js',
            'src/**/*.coffee',
        ],

         exclude: [
            'src/assets/**/*.js',
            'src/**/*.e2e.js'
        ],

        /**
        * Disable file watching by default.
        */
        autoWatch: false,

        frameworks: [ 'jasmine' ],

        /**
        * The list of browsers to launch to test on. This includes only "Firefox" by
        * default, but other browser names include:
        * Chrome, ChromeCanary, Firefox, Opera, Safari, PhantomJS
        *
        * Note that you can also use the executable name of the browser, like "chromium"
        * or "firefox", but that these vary based on your operating system.
        *
        * You may also leave this blank and manually navigate your browser to
        * http://localhost:9018/ when you're running tests. The window/tab can be left
        * open and the tests will automatically occur there during the build. This has
        * the aesthetic advantage of not launching a browser every time you save.
        */
        browsers: ['Chrome'],

        /**
        * How to report, by default.
        * possible values: 'dots', 'progress'
        * CLI --reporters progress
        */
        reporters: ['dots', 'coverage'],

        coverageReporter: {
            type: 'html',
            dir: '<%= grunt.config('build_reports_dir') %>/unit/coverage/'
        },

        preprocessors: {
            'src/app/**/!(*.spec).js': ['coverage'],
            'src/common/**/!(*.spec).js': ['coverage'],
        },

        /**
        * On which port should the browser connect, on which port is the test runner
        * operating, and what is the URL path for the browser to use.
        */
        port: 9018,

        runnerPort: 9100,

        urlRoot: '/',

        /** enable / disable colors in the output (reporters and logs)
        * CLI --colors --no-colors
        */
        colors: true,

        // If browser does not capture in given timeout [ms], kill it
        // CLI --capture-timeout 5000
        captureTimeout: 20000,

        // Auto run tests on start (when browsers are captured) and exit
        // CLI --single-run --no-single-run
        singleRun: true,

        // report which specs are slower than 500ms
        // CLI --report-slower-than 500
        reportSlowerThan: 500,

        plugins: [
            'karma-junit-reporter',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-ie-launcher',
            'karma-phantomjs-launcher',
            'karma-script-launcher',
            'karma-jasmine',
            'karma-ng-html2js-preprocessor',
            'karma-coffee-preprocessor',
            'karma-coverage'
        ]
    });
};