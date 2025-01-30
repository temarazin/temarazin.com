const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const fs = require("fs");
const MarkdownIt = require("markdown-it");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const matter = require("gray-matter");

const md = new MarkdownIt();

const loadTemplate = (filePath) => fs.readFileSync(path.resolve(__dirname, filePath), "utf8");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true,
    publicPath: ''
  },
  devServer: {
    static: path.resolve(__dirname, './dist'),
    compress: true,
    hot: true, // Enable Hot Module Replacement
    port: 8080,
    open: true
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Match .js files
        exclude: /node_modules/, // Exclude dependencies
        use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"], // Use the preset-env for modern JS
            },
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, {
          loader: 'css-loader',
          options: { importLoaders: 1 }
        },
        'postcss-loader']
      },

    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    ...fs.readdirSync("./src/content").map((file) => {
      const mdContent = fs.readFileSync(`./src/content/${file}`, "utf8");
      const { data, content } = matter(mdContent); // Extract metadata and content
      const htmlContent = md.render(content);
      return new HtmlWebpackPlugin({
        filename: file.replace(".md", ".html"),
        template: `./src/templates/${data.template || "base"}.html`,
        title: data.title || file.replace(".md", ""), // Dynamic title based on the file name
        content: htmlContent, // Rendered Markdown content
      });
    }),
    new MiniCssExtractPlugin(),
  ],
  mode: "production",
};
