const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
	webpack: {
		configure: (webpackConfig) => {
			webpackConfig.optimization = {
				minimize: true,
				minimizer: [
					new TerserPlugin({
						terserOptions: {
							compress: {
								drop_console: false,
								drop_debugger: true,
								pure_funcs: ["console.debug", "console.trace", "console.log"],
							},
							format: {
								comments: false,
							},
							mangle: {
								safari10: true,
							},
						},
						extractComments: false,
					}),
				],
			};

			// 添加 markdown 處理規則
			webpackConfig.module.rules.push({
				test: /\.md$/,
				use: [
					{
						loader: "raw-loader",
						options: {
							esModule: false,
						},
					},
				],
			});

			return webpackConfig;
		},
	},
};
