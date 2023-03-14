const configure = require("./webpack.helper.js");
const path = require("path");
module.exports = configure({
    "foobox": "./src/public/foobox/index.pro.js",
    "foobox.wordpress": {
        import: "./src/public/foobox.wordpress/index.pro.js",
        dependOn: "foobox"
    },
    "foobox.ready": {
        import: "./src/public/foobox.ready/index.pro.js",
        dependOn: "foobox"
    }
}, {
    path: path.resolve(__dirname, "../pro/assets/public"),
    filename: '[name].js'
}, process.env.NODE_ENV);