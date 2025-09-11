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
			sectionTitle: __('Scripts in Header', 'tt-theme-settings'),
			sectionDescription: __(
				'These scripts will be printed in the <head> section',
				'tt-theme-settings'
			),
		},
		{
			fieldName: 'body',
			sectionTitle: __('Scripts in Body', 'tt-theme-settings'),
			sectionDescription: __(
				'These scripts will be printed in the <body> section',
				'tt-theme-settings'
			),
		},
		{
			fieldName: 'footer',
			sectionTitle: __('Scripts in Footer', 'tt-theme-settings'),
			sectionDescription: __(
				'These scripts will be printed in the <footer> section',
				'tt-theme-settings'
			),
		},
	];

	return (
		<VStack spacing={8}>
			{sections.map(
				({ fieldName, sectionTitle, sectionDescription }, index) => (
					<>
						<Section
							key={fieldName}
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
					</>
				)
			)}
		</VStack>
	);
};

export default ScriptsPanel;
