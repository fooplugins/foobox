const configure = require("./webpack.helper.js");
const path = require("path");
module.exports = configure({
    "admin": "./src/admin/pro/index.js",
    "admin.help": "./src/admin/pro/help.js",
    "admin.settings": "./src/admin/pro/settings.js",
}, {
    path: path.resolve(__dirname, "../pro/assets/admin"),
    filename: '[name].js'
}, process.env.NODE_ENV);