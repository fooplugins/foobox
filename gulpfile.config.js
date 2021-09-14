module.exports = {
    "blocks": [
        "./src/blocks/js/index.js --output-path=./assets/blocks",
        "./src/blocks/js/index.pro.js --output-path=./assets/pro/blocks"
    ],
    "clean": [
        "./assets/admin/**/*",
        "./assets/public/**/*",
        "./assets/blocks/**/*",
        "./releases/<%= name %>.v<%=version%>.zip"
    ],
    "copy": {
        "options": {
            "match": /FooUtils/g,
            "replacement": "FooBox.utils"
        },
        "files": {
            "./src/public/js/__core/utils.js":"./node_modules/foo-utils/dist/foo-utils.js"
            // "./src/public/js/__core/utils/__utils.js":"./node_modules/foo-utils/src/__utils.js",
            // "./src/public/js/__core/utils/is.js":"./node_modules/foo-utils/src/is.js",
            // "./src/public/js/__core/utils/fn.js":"./node_modules/foo-utils/src/fn.js",
            // "./src/public/js/__core/utils/url.js":"./node_modules/foo-utils/src/url.js",
            // "./src/public/js/__core/utils/str.js":"./node_modules/foo-utils/src/str.js",
            // "./src/public/js/__core/utils/obj.js":"./node_modules/foo-utils/src/obj.js",
            // "./src/public/js/__core/utils/_utils.js":"./node_modules/foo-utils/src/_utils.js",
            // "./src/public/js/__core/utils/Class.js":"./node_modules/foo-utils/src/Class.js",
            // "./src/public/js/__core/utils/ClassRegistry.js":"./node_modules/foo-utils/src/ClassRegistry.js",
            // "./src/public/js/__core/utils/EventClass.js":"./node_modules/foo-utils/src/EventClass.js",
            // "./src/public/js/__core/utils/Timer.js":"./node_modules/foo-utils/src/Timer.js",
            // "./src/public/js/__core/utils/fullscreen.js":"./node_modules/foo-utils/src/fullscreen.js",
            // "./src/public/js/__core/utils/transition.js":"./node_modules/foo-utils/src/transition.js"
        }
    },
    "scss": {
        "./assets/public/css/<%= name %>.css": "./src/public/scss/index.scss",
        "./assets/pro/public/css/<%= name %>.css": "./src/public/scss/index.pro.scss",
        "./assets/admin/css/<%= name %>.css": "./src/admin/scss/index.scss",
        "./assets/pro/admin/css/<%= name %>.css": "./src/admin/scss/index.pro.scss"
    },
    "scripts": {
        "./assets/public/js/<%= name %>.js": [
            "./src/public/js/__core/namespace.js",
            "./src/public/js/__core/config.js",
            "./src/public/js/__core/utils.js",
            "./src/public/js/__core/utils/extensions.js",
            "./src/public/js/__core/utils/Observer.js",
            "./src/public/js/__core/utils/SVGSplitter.js",
            "./src/public/js/__core/utils/SVGRegistry.js",
            "./src/public/js/__core/registries.js",
            "./src/public/js/icons/defaults.js",
            "./src/public/js/Parser.js",
            "./src/public/js/Component.js",
            "./src/public/js/Plugin.js",
            "./src/public/js/Modal.js",
            "./src/public/js/layouts/Modern.js",
            "./src/public/js/layouts/Classic.js",
            "./src/public/js/layouts/Metro.js",
            "./src/public/js/Item.js",
            "./src/public/js/items/Image.js",
            "./src/public/js/items/Iframe.js",
            "./src/public/js/items/Video.js",
            "./src/public/js/__core/init.js"
        ],
        "./assets/pro/public/js/<%= name %>.js": [
            "./src/public/js/__core/namespace.js",
            "./src/public/js/__core/config.js",
            "./src/public/js/__core/utils.js",
            "./src/public/js/__core/utils/extensions.js",
            "./src/public/js/__core/utils/Observer.js",
            "./src/public/js/__core/utils/SVGSplitter.js",
            "./src/public/js/__core/utils/SVGRegistry.js",
            "./src/public/js/__core/registries.js",
            "./src/public/js/icons/defaults.js",
            "./src/public/js/Parser.js",
            "./src/public/js/Component.js",
            "./src/public/js/Plugin.js",
            "./src/public/js/Modal.js",
            "./src/public/js/layouts/Modern.js",
            "./src/public/js/layouts/Classic.js",
            "./src/public/js/layouts/Metro.js",
            "./src/public/js/Item.js",
            "./src/public/js/items/Image.js",
            "./src/public/js/items/Iframe.js",
            "./src/public/js/items/Video.js",
            "./src/public/js/__core/init.js"
        ],
        "./assets/admin/js/<%= name %>.admin.js": [
            "./src/public/js/index.js"
        ],
        "./assets/pro/admin/js/<%= name %>.admin.js": [
            "./src/public/js/index.pro.js"
        ]
    },
    "images": {
        "./assets/public/img/": "./src/public/img/*",
        "./assets/pro/public/img/": "./src/public/img/pro/*"
    },
    "watch": {
        "scss": [
            "./src/public/scss/**/*.scss",
            "./src/admin/scss/**/*.scss"
        ],
        "scripts": [
            "./src/public/js/**/*.js",
            "./src/admin/js/**/*.js"
        ],
        "images": [
            "./src/public/img/**/*",
            "./src/admin/img/**/*"
        ],
        "blocks": [
            "./src/blocks/**/*"
        ]
    },
    "translate": {
        "options": {
            "domain": "<%= name %>",
            "package": "<%= title %>",
            "bugReport": "<%= bugs %>",
            "team": "<%= author %>"
        },
        "files": {
            "./languages/<%= name %>.pot": "./**/*.php"
        }
    },
    "zip": {
        "./releases/<%= name %>.v<%=version%>.zip": [
            "**/*",
            "!package*.json",
            "!./{node_modules,node_modules/**/*}",
            "!./{releases,releases/**/*}",
            "!./{src,src/**/*}",
            "!fs-config.json",
            "!composer.json",
            "!composer.lock",
            "!gulpfile*.js",
            "!./{gulpfile.js,gulpfile.js/**/*}"
        ]
    }
};