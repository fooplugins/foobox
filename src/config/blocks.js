const configure = require("./wp-scripts.helper.js");
const path = require("path");
module.exports = configure({
    "foobox": "./src/blocks/index.js"
}, {
    path: path.resolve(__dirname, "../../assets/blocks"),
    filename: '[name].js'
}, process.env.NODE_ENV);