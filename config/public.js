const configure = require("./webpack.helper.js");
const path = require("path");
module.exports = configure({
    "foobox": "./src/public/foobox/index.js",
    "foobox.wordpress": {
        import: "./src/public/foobox.wordpress/index.js",
        dependOn: "foobox"
    },
    "foobox.ready": {
        import: "./src/public/foobox.ready/index.js",
        dependOn: "foobox"
    }
}, {
    path: path.resolve(__dirname, "../assets/public"),
    filename: '[name].js'
}, process.env.NODE_ENV);