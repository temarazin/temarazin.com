const path = require('path');
const fs = require("fs");
const HtmlBundlerPlugin = require('html-bundler-webpack-plugin');
const MarkdownIt = require("markdown-it");
const matter = require("gray-matter");

const md = new MarkdownIt();

module.exports = {
  mode: 'development',

  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },

  plugins: [
    new HtmlBundlerPlugin({
      entry: [
        {
          filename: 'index.html',
          import: './src/templates/base.html',
          data: {
            title: 'Home Page',
            // the Bundler Plugin supports the include a *.md file directly in your template, just provide here the path to MD file
            mdFile: './index.md', // path to the markdown file relative to one of the paths specified in the `preprocessorOptions.views` option
          },
        },
      ],
      preprocessor: 'handlebars',
      preprocessorOptions: {
        views: [
          './src/content',
          './src/templates',
        ],
        partials: ['./src/templates/partials'],
        helpers: {
          arraySize: (array) => array.length,
        },
      },
      js: {
        // output filename of compiled JavaScript
        filename: 'js/[name].[contenthash:8].js',
      },
      css: {
        // output filename of extracted CSS
        filename: 'css/[name].[contenthash:8].css',
      },
      watchFiles: {
        includes: /\.md/, // watch changes in *.md files, needed for live reload
      },
    }),
  ],

  module: {
    rules: [
      {
        test: /\.(css)$/,
        use: ['css-loader'],
      },
      {
        test: /\.(ico|png|jp?g|svg)/,
        type: 'asset/resource',
        generator: {
          filename: 'img/[name].[hash:8][ext]',
        },
      },
    ],
  },

  // enable HMR with live reload
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    watchFiles: {
      paths: ['src/**/*.*'],
      options: {
        usePolling: true,
      },
    },
  },
};
