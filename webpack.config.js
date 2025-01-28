const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const fs = require("fs");
const MarkdownIt = require("markdown-it");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const md = new MarkdownIt();

const loadTemplate = (filePath) => fs.readFileSync(path.resolve(__dirname, filePath), "utf8");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true,
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
    // Dynamically create HTML files for each Markdown file
    ...fs.readdirSync("./src/content").map((file) => {
      const content = fs.readFileSync(`./src/content/${file}`, "utf8");
      const htmlContent = md.render(content);
      return new HtmlWebpackPlugin({
        filename: file.replace(".md", ".html"),
        template: "./src/templates/base.html", // Use the base template
        // inject: false,
        title: file.replace(".md", ""), // Dynamic title based on the file name
        head: loadTemplate("./src/templates/head.html"),
        menu: loadTemplate("./src/templates/menu.html"),
        footer: loadTemplate("./src/templates/footer.html"),
        content: htmlContent, // Rendered Markdown content
      });
    }),
    new MiniCssExtractPlugin()
  ],
  mode: "production",
};
