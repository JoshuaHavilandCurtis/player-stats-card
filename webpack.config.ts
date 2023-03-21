import CopyWebpackPlugin from "copy-webpack-plugin";
import dotenv from "dotenv";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import path from "path";
// @ts-ignore
import { Configuration } from "webpack";

dotenv.config();

const env = {
	mode: process.env.MODE ?? "development"
}

const paths = {
	src: path.join(__dirname, "src"),
	src_assets: path.join(__dirname, "src", "assets"),
	dist: path.join(__dirname, "dist")
}

export default (): Configuration => {
	console.clear();
	console.log("Bundling this project...\n");

	return {
		stats: env.mode === "production" ? "summary" : "normal",
		mode: env.mode === "production" ? "production" : "development",
		entry: [path.join(paths.src_assets, "ts", "main.ts"), path.join(paths.src_assets, "scss", "main.scss")],
		output: {
			filename: path.join("js", "[name].min.js"),
			path: paths.dist,
			clean: true
		},
		plugins: [
			new MiniCssExtractPlugin({
				filename: "css/[name].min.css",
				chunkFilename: "css/[id].min.css",
			}),
			new CopyWebpackPlugin({
				patterns: [
					{ from: path.join(paths.src_assets, "img"), to: path.join(paths.dist, "img") },
					{ from: path.join(paths.src_assets, "data"), to: path.join(paths.dist, "data") }
				]
			})
		],
		resolve: {
			extensions: [".tsx", ".ts", ".jsx", ".js"]
		},
		optimization: {
			runtimeChunk: "single",
			splitChunks: {
				cacheGroups: {
					vendor: {
						test: /[\\/]node_modules[\\/]/,
						name: "vendors",
						chunks: "all"
					}
				}
			}
		},
		module: {
			rules: [
				{
					test: /\.(ts|tsx)$/i,
					use: [{ loader: "ts-loader" }]
				},
				{
					test: /\.scss$/,
					use: [
						{
							loader: MiniCssExtractPlugin.loader
						},
						{
							loader: "css-loader",
							options: {
								url: false
							}
						},
						{
							loader: "sass-loader",
							options: {
								sourceMap: true,
							}
						}
					]
				}
			]
		}
	}
}