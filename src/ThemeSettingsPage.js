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
import { useConfirmDialog } from '@hooks/useConfirmDialog';
import { useSettingsManager } from '@hooks/useSettingsManager';

const ThemeSettingsPage = () => {
	const {
		notice,
		dismissNotice,
		settings,
		submitSettings,
		resetSettings,
		isFetchingSettings,
		notices,
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

	const handleResetSettings = async () => {
		await resetSettings();
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
					'tailbase-theme-settings'
				)}
				confirmButtonText={__(
					'Yes, reset all',
					'tailbase-theme-settings'
				)}
			>
				<Heading level={4}>
					{__('Confirm', 'tailbase-theme-settings')}
				</Heading>
				<p>
					{__(
						'Are you sure you want to reset all settings to their default values?',
						'tailbase-theme-settings'
					)}
				</p>
			</ConfirmDialog>

			<FormProvider {...formMethods}>
				<form onSubmit={formMethods.handleSubmit(handleSubmitForm)}>
					<Card isRounded={false}>
						<CardHeader>
							<Heading level={1} style={{ fontWeight: 600 }}>
								{__(
									'Theme Settings',
									'tailbase-theme-settings'
								)}
							</Heading>
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
										? __(
												'Saving…',
												'tailbase-theme-settings'
											)
										: __(
												'Save settings',
												'tailbase-theme-settings'
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
									{__(
										'Reset settings',
										'tailbase-theme-settings'
									)}
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
