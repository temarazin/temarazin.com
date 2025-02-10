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
        ...fs.readdirSync("./src/content").map((file) => {
              const mdContent = fs.readFileSync(`./src/content/${file}`, "utf8");
              const { data, content } = matter(mdContent);
              const htmlContent = md.render(content);
              return {
                filename: file.replace(".md", ".html"),
                import: `./src/templates/${data.template || "base"}.html`,
                data: {
                  file: `./src/content/${file}`,
                  title: data.title || file.replace(".md", ""),
                  content: htmlContent,
                },
              };
            }),
        ],
      preprocessor: 'handlebars',
      preprocessorOptions: {
        partials: ['./src/templates/partials'],
      },
      js: {
        // output filename of compiled JavaScript
        filename: 'js/[name].[contenthash:8].js',
      },
      css: {
        // output filename of extracted CSS
        filename: 'css/[name].[contenthash:8].css',
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
