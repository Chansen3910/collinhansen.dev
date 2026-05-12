const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

//JS main modules for each scene.
const entries = {
    brand: './scenes/brand/index.js',
    enter: './scenes/enter/index.js',
    home: './scenes/home/index.js'
};

//HTML for each scene.
const htmlPlugins = [
    new HtmlWebpackPlugin({
        template: './scenes/brand/index.html',
        filename: 'brand/index.html',
        chunks: ['brand']
    }),
    new HtmlWebpackPlugin({
        template: './scenes/enter/index.html',
        filename: 'index.html',
        chunks: ['enter']
    }),
    new HtmlWebpackPlugin({
        template: './scenes/home/index.html',
        filename: 'home/index.html',
        chunks: ['home']
    })
];

//Build output config, static file config.
module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';
    
    return {
        entry: entries,

        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: isProduction ? 'js/[name].[contenthash].js' : 'js/[name].js',
            clean: true
        },

        module: {
            rules: [
                {
                    test: /\.css$/i,
                    use: ['style-loader', 'css-loader']
                },
                {
                    test: /\.(png|svg|jpg|jpeg|gif|mp4|glb)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'assets/[hash][ext][query]'
                    }
                }
            ]
        },
        
        plugins: [
            ...htmlPlugins,
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: 'public',
                        to: 'assets',
                        noErrorOnMissing: true
                    }
                ]
            })
        ],
        
        devServer: {
            static: [
                {
                    directory: path.join(__dirname, 'dist'),
                    publicPath: '/'
                },
                {
                    directory: path.join(__dirname, 'public'),
                    publicPath: '/public'
                }
            ],
            port: 3000,
            hot: true,
            open: true
        },
        
        optimization: {
            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all'
                    }
                }
            }
        }
    };
};
