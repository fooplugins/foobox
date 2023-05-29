const configure = require("./wp-scripts.helper.js");
const path = require("path");
module.exports = configure({
    "blocks": "./src/blocks/pro/index.js"
}, {
    path: path.resolve(__dirname, "../../pro/assets/blocks"),
    filename: '[name].js'
}, process.env.NODE_ENV);