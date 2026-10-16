import { useEffect, useState } from '@wordpress/element';

import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';

import { useNotice } from '@hooks/useNotice';
import { useSnackbar } from '@hooks/useSnackbar';

const SETTINGS_PATH = 'tailbase/v1/settings';

export const useSettingsManager = () => {
	const [settings, setSettings] = useState({}); // Use a single object to hold all settings
	const [isFetchingSettings, setIsFetchingSettings] = useState(true); // Track loading state

	const { notice, showNotice, dismissNotice } = useNotice();
	const { notices, showSnackbar, onRemove } = useSnackbar();

	useEffect(() => {
		(async () => {
			try {
				setSettings(await apiFetch({ path: SETTINGS_PATH }));
			} catch (error) {
				showNotice(
					true,
					'error',
					__('Error fetching settings.', 'tailbase-theme-settings')
				);
				// eslint-disable-next-line no-console
				console.error('Error fetching settings:', error);
			} finally {
				setIsFetchingSettings(false);
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Saves or resets the settings. The server returns the sanitized settings, which become the new form values.
	const request = async (options) => {
		try {
			const response = await apiFetch({
				path: SETTINGS_PATH,
				...options,
			});

			setSettings(response.settings);
			showNotice(true, 'success', response.message);
			showSnackbar(response.message);
		} catch (error) {
			const message =
				error?.message ||
				__('An unexpected error occurred.', 'tailbase-theme-settings');

			showNotice(true, 'error', message);
			showSnackbar(message);
		}
	};

	const submitSettings = (data) =>
		request({ method: 'POST', data: { settings: data } });

	// Resets to the defaults defined in PHP (Tailbase_Settings::defaults()).
	const resetSettings = () => request({ method: 'DELETE' });

	return {
		notice,
		dismissNotice,
		settings,
		submitSettings,
		resetSettings,
		isFetchingSettings,
		notices,
		showSnackbar,
		onRemove,
	};
};
