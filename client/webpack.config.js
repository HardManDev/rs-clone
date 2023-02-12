const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const sourcePath = path.resolve(__dirname, 'src');
const destinationPath = path.resolve(__dirname, 'dist');

/**
 * Generates a filename string for webpack given the given parameters.
 * @param {boolean} isDevelopment true if needed name for development mode.
 * @param {boolean} isBundled true if needed name with '.bundle' postfix.
 * @param {string} ext target file extension.
 * @returns {string} a string representing the filename for the webpack
 * configuration.
 */
const resolveFilename = (
  isDevelopment,
  isBundled = false,
  ext = 'js',
) => `${isDevelopment ? '[name]' : '[contenthash]'}`
  + `${isBundled ? '.bundle' : ''}.${ext}`;

/**
 * Generate webpack styles loaders chain.
 * @param {any | undefined} extra extra loaders (pushed into start of chain).
 * @returns {Array<any>} a string representing the webpack styles loaders chain.
 */
const resolveStyleLoaders = (
  extra = undefined
) => {
  const result = [
    MiniCssExtractPlugin.loader,
    'css-loader',
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: ['autoprefixer'],
        },
      },
    },
  ];

  if (extra) result.push(extra);

  return result;
};

module.exports = async (env, argv) => {
  const isDevelopment = argv.mode === 'development'
    || process.env.NODE_ENV === 'development';

  return {
    context: sourcePath,
    entry: {
      main: './index.ts',
    },
    output: {
      path: destinationPath,
      filename: resolveFilename(isDevelopment, true, 'js'),
    },
    resolve: {
      extensions: ['.html', '.js', '.ts', '.css', 'sass', '.scss'],
      alias: {
        '@': sourcePath,
        '@types': path.resolve(sourcePath, 'types'),
        '@assets': path.resolve(sourcePath, 'assets'),
        '@styles': path.resolve(sourcePath, 'styles'),
        '@scripts': path.resolve(sourcePath, 'scripts'),
        '@models': path.resolve(sourcePath, 'scripts/models'),
        '@components': path.resolve(sourcePath, 'scripts/components'),
        '@controllers': path.resolve(sourcePath, 'scripts/controllers'),
      },
    },
    devtool: isDevelopment ? 'source-map' : false,
    devServer: {
      hot: true,
      port: 8080,
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: './index.html',
        template: './index.html',
        chunks: ['main'],
        minify: !isDevelopment,
      }),
      new MiniCssExtractPlugin({
        filename: resolveFilename(isDevelopment, true, 'css'),
      }),
      new CleanWebpackPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          'API_URL': JSON.stringify(
            process.env.API_URL || 'http://localhost:3000'
          ),
        }
      }),
    ],
    module: {
      rules: [
        {
          test: /\.(ts)$/i,
          use: [
            {
              loader: "babel-loader",
              options: {
                presets: [
                  "@babel/preset-env",
                  "@babel/preset-typescript",
                ]
              }
            }
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.(css)$/i,
          use: resolveStyleLoaders(),
        },
        {
          test: /\.(s[ac]ss)$/i,
          use: resolveStyleLoaders('sass-loader'),
        },
        {
          test: /\.(png|jpe?g|gif|svg|ttf|woff|woff2|mp3)$/i,
          dependency: {
            not: ['url'],
          },
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 16000,
                name: '[path][name].[ext]',
              },
            },
          ],
        },
      ]
    }
  }
}
