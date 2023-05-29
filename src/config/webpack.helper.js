/**
 * webpack.helper.js
 *
 * This file exports a function that generates a webpack config used to build assets.
 *
 * Example:
 *
 *
 */

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

/**
 * Generates a webpack config using the given entry points and output.
 * @param {object} entry - An object containing a map of entry point name to file.
 * @param {object} output - An object containing the `path` and `filename` to output.
 * @param {string} [mode] - Either `development` or `production` depending on the desired output.
 * @return {object} Returns the generated webpack config.
 */
module.exports = function configure(entry, output, mode){
    const cacheGroups = {};
    Object.keys(entry).forEach((key) => {
        cacheGroups[key] = {
            name: key,
            type: "css/mini-extract",
            chunks: (chunk) => {
                return chunk.name === key;
            },
            enforce: true
        };
    });

    return {
        mode: mode ?? "production",
        devtool: "source-map",
        entry,
        output,
        plugins: [
            new MiniCssExtractPlugin({
                filename: "[name].css",
            }),
        ],
        optimization: {
            splitChunks: {
                cacheGroups
            }
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: ['babel-loader']
                },
                {
                    test: /\.(css|scss|sass)$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        "css-loader",
                        "sass-loader",
                    ],
                },
                {
                    test: /\.(woff|woff2|eot|ttf|svg|png|jpg|jpeg)$/,
                    use: {
                        loader: 'url-loader',
                    },
                }
            ],
        }
    };
};