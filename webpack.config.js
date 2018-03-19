"use strict";
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = { entry: "./src/index.js",

    output: {
        filename: "bundle.js",
        sourceMapFilename: "bundle.js.map",
        path: path.resolve(__dirname, "build")
    },

    resolve: {
        extensions: [".js", ".css", "scss"],
        alias: {
            leaflet_css: __dirname + "/node_modules/leaflet/dist/leaflet.css"
        }
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: "sass-loader"
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=100000'
            },
            {
                test: /\.png$/,
                loader: require.resolve("file-loader") + "?name=/img/[name].[ext]"
            }
        ]
    },

    devServer: {
        contentBase: path.join(__dirname, "build"),
        port: 8000,
    },

    devtool: "#source-map",

    plugins: [
        new HtmlWebpackPlugin({
            title: "Application",
            filename: "index.html",
        }),
        new CopyWebpackPlugin([
            { from: "./node_modules/leaflet/dist/images/*", to: "./img/[name].[ext]", type: "template" },
            { from: "data/*", to: "./data/[name].[ext]", type: "template" }
        ])
    ]
};
