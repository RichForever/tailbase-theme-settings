const path = require('path');
const wpScriptsConfig = require('@wordpress/scripts/config/eslint.config.cjs');

module.exports = [
	...wpScriptsConfig,
	{
		settings: {
			'import/resolver': {
				webpack: {
					config: {
						resolve: {
							alias: {
								'@components': path.resolve(
									__dirname,
									'src/components'
								),
								'@hooks': path.resolve(__dirname, 'src/hooks'),
							},
						},
					},
				},
			},
		},
		rules: {
			// @wordpress/* packages are provided by WordPress at runtime (webpack
			// externals), so they are not installed in node_modules.
			'import/no-unresolved': ['error', { ignore: ['^@wordpress/'] }],
			'import/no-extraneous-dependencies': 'off',
			'@wordpress/i18n-text-domain': [
				'error',
				{ allowedTextDomain: 'tailbase-theme-settings' },
			],
		},
	},
];
