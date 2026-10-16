import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import Section from '@components/layout/Section';
import NumberField from '@components/settings/common/NumberField';
import ToggleField from '@components/settings/common/ToggleField';
import TokenField from '@components/settings/common/TokenField';
import {
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalVStack as VStack,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalDivider as Divider,
} from '@wordpress/components';

const CommonPanel = () => {
	const sections = [
		{
			fieldName: 'excerptLength',
			sectionTitle: __('Excerpt length', 'tailbase-theme-settings'),
			sectionDescription: __(
				'Change the excerpt length. By default, WordPress excerpts show the first 55 words of a post.',
				'tailbase-theme-settings'
			),
			component: NumberField,
		},
		{
			fieldName: 'customBodyClasses',
			sectionTitle: __(
				'Custom CSS classes for body tag',
				'tailbase-theme-settings'
			),
			sectionDescription: __(
				'Add one or multiple custom CSS classes for the body tag.',
				'tailbase-theme-settings'
			),
			component: TokenField,
		},
		{
			fieldName: 'disableWordpressVersion',
			sectionTitle: __('WordPress version', 'tailbase-theme-settings'),
			sectionDescription: __(
				'To make it harder for malicious actors to detect which version of WordPress you are using, remove the WordPress version number from appearing anywhere in your site’s frontend code.',
				'tailbase-theme-settings'
			),
			sectionDirection: 'horizontal',
			component: ToggleField,
		},
		{
			fieldName: 'addSvgSupport',
			sectionTitle: __('SVG Support', 'tailbase-theme-settings'),
			sectionDescription: __(
				'Enable SVG file type uploads.',
				'tailbase-theme-settings'
			),
			sectionDirection: 'horizontal',
			component: ToggleField,
		},
		{
			fieldName: 'disableXmlRpc',
			sectionTitle: __('XML-RPC Support', 'tailbase-theme-settings'),
			sectionDescription: __(
				'Disable XML-RPC for security purposes.',
				'tailbase-theme-settings'
			),
			sectionDirection: 'horizontal',
			component: ToggleField,
		},
		{
			fieldName: 'disableAdminBar',
			sectionTitle: __(
				'Admin Bar on Frontend',
				'tailbase-theme-settings'
			),
			sectionDescription: __(
				'Disable the admin bar for all users except site administrators.',
				'tailbase-theme-settings'
			),
			sectionDirection: 'horizontal',
			component: ToggleField,
		},
		{
			fieldName: 'disableFileEdit',
			sectionTitle: __(
				'Plugin and Theme Editor',
				'tailbase-theme-settings'
			),
			sectionDescription: __(
				'Disable the plugin/theme editor.',
				'tailbase-theme-settings'
			),
			sectionDirection: 'horizontal',
			component: ToggleField,
		},
	];
	return (
		<VStack spacing={8}>
			{sections.map(
				(
					{
						fieldName,
						sectionTitle,
						sectionDescription,
						sectionDirection,
						component: Component,
					},
					index
				) => (
					<Fragment key={fieldName}>
						<Section
							sectionTitle={sectionTitle}
							sectionDescription={sectionDescription}
							direction={sectionDirection}
						>
							<Component
								settingsGroup="commonSettings"
								fieldName={fieldName}
							/>
						</Section>
						{index < sections.length - 1 && (
							<Divider style={{ color: '#d7d7d8' }} />
						)}
					</Fragment>
				)
			)}
		</VStack>
	);
};

export default CommonPanel;
