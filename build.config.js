/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {
    /**
     * The `build_debug_dir` folder is where our projects are build during
     * development (build task for debug target) and the `build_dist_dir` folder is where our app resides once it's
     * completely built (build task for dist target).
     */
    build_dir: 'target/',
    build_debug_dir:  '<%=build_dir%>' + 'debug',
    build_dist_dir: '<%=build_dir%>' + 'dist',
    build_reports_dir:  '<%=build_dir%>' + '.reports',

    /**
     * The `karma_conf_file` file name is where karma testing configuration resides.
     * We use this 'karma.conf.js' as the file to utilize WebStorm Karma features
     */
    karma_conf_file: 'karma.conf.js',

    /**
     * This is a collection of file patterns that refer to our app code (the
     * stuff in `src/`). These file paths are used in the configuration of
     * build tasks. `js` is all project javascript, less tests. `ctpl` contains
     * our reusable components' (`src/common`) template HTML files, while
     * `atpl` contains the same, but for our app's code. `html` is just our
     * main HTML file, `less` is our main stylesheet, and `unit` contains our
     * app's unit tests.
     */
    app_files: {
        js: [ 'src/**/*.js', '!src/**/*.spec.js', '!src/**/*.e2e.js', '!src/assets/**/*.js' ],
        jsunit: [ 'src/**/*.spec.js' ],
        e2e: [ 'src/**/*.e2e.js' ],

        coffee: [ 'src/**/*.coffee', '!src/**/*.spec.coffee' ],
        coffeeunit: [ 'src/**/*.spec.coffee' ],

        atpl: [ 'src/app/**/*.tpl.html', 'src/*.tpl.html' ],
        ctpl: [ 'src/common/**/*.tpl.html' ],

        html: [ 'src/index.html' ],
        less: 'src/less/main.less'
    },

    /**
     * This is a collection of files used during testing only.
     *
     * The order of the files: These files will be put in the html files as the order in the array
     */
    test_files: {
        js: [
            'vendor/angular-mocks/angular-mocks.js'
        ]
    },

    /**
     * This is the same as `app_files`, except it contains patterns that
     * reference vendor code (`vendor/`) that we need to place into the build
     * process somewhere. While the `app_files` property ensures all
     * standardized files are collected for compilation, it is the user's job
     * to ensure non-standardized (i.e. vendor-related) files are handled
     * appropriately in `vendor_files.js`.
     *
     * The `vendor_files.js` property holds files to be automatically
     * concatenated and minified with our project source files.
     *
     * The `vendor_files.css` property holds any CSS files to be automatically
     * included in our app.
     *
     * The `vendor_files.assets` property holds any assets to be copied along
     * with our app's assets. This structure is flattened, so it is not
     * recommended that you use wildcards.
     *
     * The order of the files: These files will be put in the html files as the order in the array
     */
    vendor_files: {
        js: [
            'vendor/jquery/dist/jquery.js',
            'vendor/angular/angular.js',
            'vendor/angular-route/angular-route.js',
            'vendor/angular-resource/angular-resource.js',
            'vendor/angular-sanitize/angular-sanitize.js',
            'vendor/angular-bootstrap/ui-bootstrap.js',
            'vendor/angular-bootstrap/ui-bootstrap-tpls.js',
            'vendor/angular-tree-control/angular-tree-control.js',
            'vendor/d3/d3.js',
            'vendor/nvd3/nv.d3.js',
            'vendor/angularjs-nvd3-directives/dist/angularjs-nvd3-directives.js'
        ],
        css: [
              'vendor/nvd3/nv.d3.css'
        ],
        assets: [
        ]
    }
};