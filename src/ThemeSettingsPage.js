import { useEffect } from '@wordpress/element';

import { FormProvider, useForm } from 'react-hook-form';

import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalConfirmDialog as ConfirmDialog,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalHeading as Heading,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalHStack as HStack,
	Notice,
	SnackbarList,
	Spinner,
	TabPanel,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import CommonPanel from '@components/settings/common/CommonPanel';
import ScriptsPanel from '@components/settings/scripts/ScriptsPanel';
import SocialMediaPanel from '@components/settings/social/SocialMediaPanel';
import { defaultSettings } from '@config/defaultSettings';
import { useConfirmDialog } from '@hooks/useConfirmDialog';
import { useSettingsManager } from '@hooks/useSettingsManager';

const ThemeSettingsPage = () => {
	const {
		notice,
		dismissNotice,
		settings,
		submitSettings,
		isFetchingSettings,
		notices,
		showSnackbar,
		onRemove,
	} = useSettingsManager();

	// Initialize React Hook Form
	const formMethods = useForm({
		defaultValues: settings,
	});

	// Reset form values when the settings are loaded
	useEffect(() => {
		if (settings) {
			formMethods.reset(settings); // Update form values dynamically
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [settings]);

	const handleSubmitForm = async (data) => {
		await submitSettings(data);
	};

	const handleResetSettings = () => {
		submitSettings(defaultSettings);
		formMethods.reset(defaultSettings);
		showSnackbar(
			'Settings have been successfully reset to their default values.'
		);
	};

	const { isOpen, handleShowDialog, handleConfirm, handleCancel } =
		useConfirmDialog(handleResetSettings);

	const tabs = [
		{
			name: 'commonSettings',
			title: 'Common',
			className: 'tab',
			component: <CommonPanel />,
		},
		{
			name: 'scriptsSettings',
			title: 'Scripts',
			className: 'tab',
			component: <ScriptsPanel />,
		},
		{
			name: 'socialMediaSettings',
			title: 'Social Media',
			className: 'tab',
			component: <SocialMediaPanel />,
		},
	];

	return (
		<>
			{notice.isVisible && (
				<div style={{ marginBottom: '.75rem', marginTop: '.75rem' }}>
					<Notice status={notice.type} onDismiss={dismissNotice}>
						{notice.message}
					</Notice>
				</div>
			)}

			{notices.length > 0 && (
				<SnackbarList notices={notices} onRemove={onRemove} />
			)}

			<ConfirmDialog
				isOpen={isOpen}
				onConfirm={handleConfirm}
				onCancel={handleCancel}
				cancelButtonText={__(
					'No, keep my settings',
					'tt-theme-settings'
				)}
				confirmButtonText={__('Yes, reset all', 'tt-theme-settings')}
			>
				<Heading level={4}>
					{__('Confirm', 'tt-theme-settings')}
				</Heading>
				<p>
					{__(
						'Are you sure you want to reset all settings to their default values?',
						'tt-theme-settings'
					)}
				</p>
			</ConfirmDialog>

			<FormProvider {...formMethods}>
				<form onSubmit={formMethods.handleSubmit(handleSubmitForm)}>
					<Card isRounded={false}>
						<CardHeader>
							<Heading level={1} style={{ fontWeight: 600 }}>
								{__('Theme Settings', 'tt-theme-settings')}
							</Heading>
							<Button
								style={{ color: '#000' }}
								href={
									'https://github.com/RichForever/tt-theme-settings'
								}
								target={'_blank'}
								icon={
									<svg
										height={32}
										width={32}
										aria-hidden="true"
										viewBox="0 0 24 24"
									>
										<path d="M12.5.75C6.146.75 1 5.896 1 12.25c0 5.089 3.292 9.387 7.863 10.91.575.101.79-.244.79-.546 0-.273-.014-1.178-.014-2.142-2.889.532-3.636-.704-3.866-1.35-.13-.331-.69-1.352-1.18-1.625-.402-.216-.977-.748-.014-.762.906-.014 1.553.834 1.769 1.179 1.035 1.74 2.688 1.25 3.349.948.1-.747.402-1.25.733-1.538-2.559-.287-5.232-1.279-5.232-5.678 0-1.25.445-2.285 1.178-3.09-.115-.288-.517-1.467.115-3.048 0 0 .963-.302 3.163 1.179.92-.259 1.897-.388 2.875-.388.977 0 1.955.13 2.875.388 2.2-1.495 3.162-1.179 3.162-1.179.633 1.581.23 2.76.115 3.048.733.805 1.179 1.825 1.179 3.09 0 4.413-2.688 5.39-5.247 5.678.417.36.776 1.05.776 2.128 0 1.538-.014 2.774-.014 3.162 0 .302.216.662.79.547C20.709 21.637 24 17.324 24 12.25 24 5.896 18.854.75 12.5.75Z" />
									</svg>
								}
								label="Open project on GitHub"
							/>
						</CardHeader>
						<CardBody>
							{isFetchingSettings ? (
								<Spinner />
							) : (
								<TabPanel tabs={tabs}>
									{(tab) => tab.component}
								</TabPanel>
							)}
						</CardBody>
						<CardFooter>
							<HStack spacing={4} justify="flex-start">
								<Button
									type="submit"
									variant="primary"
									isBusy={formMethods.formState.isSubmitting}
									disabled={
										formMethods.formState.isSubmitting
									}
								>
									{formMethods.formState.isSubmitting
										? __('Saving…', 'tt-theme-settings')
										: __(
												'Save settings',
												'tt-theme-settings'
											)}
								</Button>
								<Button
									variant="tertiary"
									isDestructive
									onClick={handleShowDialog}
									disabled={
										formMethods.formState.isSubmitting
									}
								>
									{__('Reset settings', 'tt-theme-settings')}
								</Button>
							</HStack>
						</CardFooter>
					</Card>
				</form>
			</FormProvider>
		</>
	);
};

export default ThemeSettingsPage;
