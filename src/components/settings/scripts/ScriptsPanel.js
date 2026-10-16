import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import Section from '@components/layout/Section';
import ScriptField from '@components/settings/scripts/ScriptField';
import {
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalVStack as VStack,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalDivider as Divider,
} from '@wordpress/components';

const ScriptsPanel = () => {
	const sections = [
		{
			fieldName: 'head',
			sectionTitle: __('Scripts in Header', 'tailbase-theme-settings'),
			sectionDescription: __(
				'These scripts will be printed in the <head> section',
				'tailbase-theme-settings'
			),
		},
		{
			fieldName: 'body',
			sectionTitle: __('Scripts in Body', 'tailbase-theme-settings'),
			sectionDescription: __(
				'These scripts will be printed in the <body> section',
				'tailbase-theme-settings'
			),
		},
		{
			fieldName: 'footer',
			sectionTitle: __('Scripts in Footer', 'tailbase-theme-settings'),
			sectionDescription: __(
				'These scripts will be printed in the <footer> section',
				'tailbase-theme-settings'
			),
		},
	];

	return (
		<VStack spacing={8}>
			{sections.map(
				({ fieldName, sectionTitle, sectionDescription }, index) => (
					<Fragment key={fieldName}>
						<Section
							sectionTitle={sectionTitle}
							sectionDescription={sectionDescription}
						>
							<ScriptField
								settingsGroup="scriptsSettings"
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

export default ScriptsPanel;
