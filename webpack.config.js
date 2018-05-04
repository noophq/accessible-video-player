var path = require("path");
var webpack = require("webpack");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

const ExtractTextPlugin = require("extract-text-webpack-plugin");

let assetDirPath = path.join(__dirname, "src", "assets");

// Get node environment
const nodeEnv = process.env.NODE_ENV || "development";

let definePlugin = new webpack.DefinePlugin({
    "process.env.NODE_ENV": JSON.stringify(nodeEnv),
});

let config = {
    entry: "./src/main.tsx",

    externals: {
        "react": "React",
        "react-dom": "ReactDOM",
    },

    module: {
        loaders: [
            // All files with a '.ts' or '.tsx' extension will be handled
            // by 'awesome-typescript-loader' or 'react-hot-loader'.
            {
                loaders: [
                    "react-hot-loader/webpack",
                    "awesome-typescript-loader",
                ],
                test: /\.tsx?$/,
            },
            {
                exclude: /node_modules/,
                loader: "svg-sprite-loader",
                test: /\.svg$/,
            },
        ],
    },

    output: {
        filename: "bundle.js",
        library: "app",
        libraryTarget: "var",
        path: path.join(__dirname, "dist"),
        publicPath: "/dist",
    },

    plugins: [
        new ExtractTextPlugin("[name].bundle.css"),
        definePlugin,
    ],
    resolve: {
        alias: {
            "app": path.resolve(__dirname, "src"),
        },

        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".jsx"],
    },

    target: "web",
};

if (process.env.NODE_ENV === "production") {
    config.plugins.push(new UglifyJsPlugin());
    config.module.loaders.push({
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
            use: [
                {
                    loader: "css-loader",
                    options: {
                        importLoaders: 1,
                        modules: true,
                    },
                },
                "postcss-loader",
            ],
        }),
    });
} else {
    // Enable sourcemaps for debugging webpack's output.
    config.devtool = "source-map";
    config.devServer = {
        contentBase: __dirname,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        historyApiFallback: true,
        hot: true,
        watchContentBase: true,
    };
    config.plugins.push(
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    );
    config.module.loaders.push({
        test: /\.css$/,
        use: ["css-hot-loader"].concat(ExtractTextPlugin.extract({
            use: [
                {
                    loader: "css-loader",
                    options: {
                        importLoaders: 1,
                        modules: true,
                    },
                },
                "postcss-loader",
            ],
        })),
    });
}

module.exports = config;
