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
			return webpackConfig;
		},
	},
};
