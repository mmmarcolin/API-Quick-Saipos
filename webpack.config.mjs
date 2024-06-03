// Imports
import { fileURLToPath } from "url"; // Utility to convert URL to file path
import TerserPlugin from "terser-webpack-plugin"; // Plugin for minifying JavaScript
import CssMinimizerPlugin from "css-minimizer-webpack-plugin"; // Plugin for minifying CSS
import MiniCssExtractPlugin from "mini-css-extract-plugin"; // Plugin to extract CSS into separate files
import path from "path"; // Node.js path module to handle file paths
import webpack from "webpack"; // Core webpack library
import dotenv from "dotenv"; // Library to load environment variables from a .env file
dotenv.config(); // Load the environment variables from the .env file

const __filename = fileURLToPath(import.meta.url); // Convert URL to filename, necessary for ES modules compatibility
const __dirname = path.dirname(__filename); // Get the directory name of the current module

export default {
    mode: "production", // Set the mode to "production" which enables optimizations automatically
    entry: "./frontend/main.js", // Entry point of the application
    output: {
        path: path.resolve(__dirname, "frontend", "min"), // Output directory for all build files
        filename: "script.min.js", // Filename pattern for the output files
    },
    module: {
        rules: [
            {
                test: /\.js$/, // Match files ending in .js
                exclude: /node_modules/, // Exclude the node_modules directory
                use: {
                    loader: "babel-loader", // Use babel-loader to transpile JavaScript files
                    options: {
                        presets: ["@babel/preset-env"] // Preset used for transpiling
                    }
                }
            },
            {
                test: /\.css$/, // Match files ending in .css
                use: [MiniCssExtractPlugin.loader, "css-loader"] // Use MiniCssExtractPlugin and css-loader to process CSS files
            }
        ]
    },
    optimization: {
        minimize: true, // Enable minimization
        minimizer: [
            new TerserPlugin(), // Use TerserPlugin for JavaScript minification
            new CssMinimizerPlugin(), // Use CssMinimizerPlugin for CSS minification
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "style.min.css", // Filename pattern for the output CSS
        }),
        new webpack.DefinePlugin({
            "API_TOKEN": JSON.stringify(process.env.API_TOKEN), // Define process.env.API_TOKEN as a constant at build time
        }),
    ],
};
