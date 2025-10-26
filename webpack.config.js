const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
  entry: {
    main: './src/index.ts',
    menu: './src/menu.ts',
    cart: './src/cart.ts',
    login: './src/login.ts',
    register: './src/register.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[contenthash].js',
    clean: true,
    assetModuleFilename: 'assets/[name].[contenthash][ext][query]',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: isProduction 
          ? [MiniCssExtractPlugin.loader, 'css-loader']
          : ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8192 // Файлы меньше 8kb будут инлайниться
          }
        },
        generator: {
          filename: 'assets/images/[name][ext][query]'
        }
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        options: {
          minimize: false
        }
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      inject: 'body',
      chunks: ['main']
    }),
    new HtmlWebpackPlugin({
      template: './src/menu.html',
      filename: 'menu.html',
      inject: 'body',
      chunks: ['menu']
    }),
    new HtmlWebpackPlugin({
      template: './src/cart.html',
      filename: 'cart.html',
      inject: 'body',
      chunks: ['cart']
    }),
    new HtmlWebpackPlugin({
      template: './src/login.html',
      filename: 'login.html',
      inject: 'body',
      chunks: ['login']
    }),
    new HtmlWebpackPlugin({
      template: './src/register.html',
      filename: 'register.html',
      inject: 'body',
      chunks: ['register']
    }),
    ...(isProduction ? [new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css'
    })] : []),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/assets'),
          to: path.resolve(__dirname, 'dist/assets'),
          noErrorOnMissing: true
        }
      ]
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist')
    },
    compress: true,
    port: 9000,
    hot: true,
    open: true,
    watchFiles: ['src/**/*']
  }
  };
};

