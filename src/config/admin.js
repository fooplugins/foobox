const configure = require("./webpack.helper.js");
const path = require("path");
module.exports = configure({
    "admin": "./src/admin/index.js",
    "admin.help": "./src/admin/help.js",
    "admin.settings": "./src/admin/settings.js",
}, {
    path: path.resolve(__dirname, "../../assets/admin"),
    filename: '[name].js'
}, process.env.NODE_ENV);