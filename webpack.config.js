const path = require("path")
const HTMLWebpackPlugin =require("html-webpack-plugin")
const {CleanWebpackPlugin} = require("clean-webpack-plugin")
const CopyPlugin = require("copy-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const fs = require('fs');
const webpack = require('webpack');



const isDev = process.env.NODE_ENV === "development"
const isProd = !isDev
console.log(isDev)



const PAGES_DIR = path.resolve(__dirname, 'src/pages');
const PAGES = fs.readdirSync(PAGES_DIR);

const optimization = () => {
    const config = {
        splitChunks:{
            chunks: "all"
        }
    }
    if (isProd){
        config.minimizer = [
            new CssMinimizerPlugin(),
            new TerserPlugin()
        ]
        return config
    }
    return{
        splitChunks:{
            chunks: "all"
        }
    }
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`


module.exports = {
    context: path.resolve(__dirname, "src"),
    mode: "development",
    entry: {
        main:["@babel/polyfill", "./index.js"]
    },
    output: {
        filename: filename("js"),
        path: path.resolve(__dirname, "dist")
    },
    resolve: {
        extensions: [".js",".png",".json"],
        alias: {
            "@": path.resolve(__dirname, "src"),
            blocks: path.resolve(__dirname, 'src/blocks'),
        }
    },
    optimization: optimization(),
    devtool: isProd ? false : "source-map",
    devServer: {
        static: path.join(__dirname, 'dist'),
        compress: true,
        port: 4200, 
        hot: false,
        liveReload: true
    },
    plugins: [
        //new FaviconsWebpackPlugin('assets/img/favicon.svg'),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: filename("css")
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
        }),
        ...PAGES.map((page) => new HTMLWebpackPlugin({
            filename: `${page}.html`,
            template: `${PAGES_DIR}/${page}/${page}.pug`,
            
        }))
    ],
    module: {
        rules: [
            {
                test: /\.pug$/,
                loader: 'pug-loader',
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            },
            {
                test: /\.s[ac]ss$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
            },
            {
                test: /\.(png|jpg|jpeg|svg|gif)$/,
                exclude: path.resolve(__dirname, 'src/fonts'),
                type: 'asset/resource',
                generator: {
                    filename: 'assets/images/[name][ext]'
                },
            },
            {
                test: /\.(ttf|woff2|eot|svg|woff|otf)$/,
                include: path.resolve(__dirname, 'src/fonts'),
                type: 'asset/resource',
                 generator: {
                     filename: 'assets/fonts/[name][ext]'
                 },
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ["@babel/plugin-proposal-class-properties"]
                    }
                }
            }

        ]
    }
}