import { useState } from '@wordpress/element';
import { useFieldArray, useFormContext } from 'react-hook-form';

import {
	Button,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalConfirmDialog as ConfirmDialog,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalHeading as Heading,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalHStack as HStack,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalVStack as VStack,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import Section from '@components/layout/Section';
import SocialMediaItem from '@components/settings/social/SocialMediaItem';
import { useConfirmDialog } from '@hooks/useConfirmDialog';

// Import Pragmatic DnD
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';

const SocialMediaPanel = () => {
	const { control } = useFormContext();
	const { fields, append, remove, move } = useFieldArray({
		control,
		name: 'socialMediaSettings',
	});
	const [lastAddedIndex, setLastAddedIndex] = useState(null);
	const [draggedIndex, setDraggedIndex] = useState(null);

	const handleAddNew = () => {
		append({ platform: '', url: '', icon: '' });
		setLastAddedIndex(fields.length);
	};

	const handleRemoveItem = (index) => {
		remove(index);
	};

	const handleRemoveAllItems = () => {
		remove();
		setLastAddedIndex(null);
	};

	// Set up drop target for the list
	const [dropTargetRef] = useState(() => {
		const element = document.createElement('div');

		combine(
			dropTargetForElements({
				element,
				onDragEnter: () => {},
				onDragLeave: () => {},
				onDrop: ({ source }) => {
					const sourceData = source.data;
					const draggedIdx = sourceData.index;
					const dropIdx = Array.from(element.children).findIndex(
						(child) =>
							child.contains(
								document.elementFromPoint(
									sourceData.clientX,
									sourceData.clientY
								)
							)
					);

					if (draggedIdx !== dropIdx && dropIdx !== -1) {
						move(draggedIdx, dropIdx);
					}
				},
			})
		);

		return element;
	});

	const { isOpen, handleShowDialog, handleConfirm, handleCancel } =
		useConfirmDialog(handleRemoveAllItems);

	return (
		<Section
			sectionTitle={__('Social Media', 'tt-theme-settings')}
			sectionDescription={__(
				'Add your social media platforms',
				'tt-theme-settings'
			)}
		>
			<VStack spacing={4}>
				{fields.length === 0 ? (
					<p>
						{__(
							'No social media links added yet. Click the button below to add one.',
							'tt-theme-settings'
						)}
					</p>
				) : (
					<div ref={dropTargetRef} style={{ position: 'relative' }}>
						{fields.map((field, index) => (
							<SocialMediaItem
								key={field.id}
								index={index}
								settingsGroup={'socialMediaSettings'}
								handleRemove={() => handleRemoveItem(index)}
								isNew={index === lastAddedIndex}
								onDragStart={() => setDraggedIndex(index)}
								onDragEnd={() => setDraggedIndex(null)}
								isDragging={draggedIndex === index}
								moveItem={move}
							/>
						))}
					</div>
				)}

				<ConfirmDialog
					isOpen={isOpen}
					onConfirm={handleConfirm}
					onCancel={handleCancel}
					cancelButtonText={__('No, thanks', 'tt-theme-settings')}
					confirmButtonText={__('Yes, please!', 'tt-theme-settings')}
				>
					<Heading level={4}>
						{__('Confirm', 'tt-theme-settings')}
					</Heading>
					<p>
						{__(
							'Are you sure you want to remove all items?',
							'tt-theme-settings'
						)}
					</p>
				</ConfirmDialog>

				<HStack justify="flex-start">
					<Button
						variant="secondary"
						onClick={handleAddNew}
						style={{ width: 'fit-content' }}
					>
						{__('Add item', 'tt-theme-settings')}
					</Button>

					{fields.length > 0 && (
						<Button
							variant="secondary"
							isDestructive
							onClick={handleShowDialog}
							style={{ width: 'fit-content' }}
						>
							{__('Remove all items', 'tt-theme-settings')}
						</Button>
					)}
				</HStack>
			</VStack>
		</Section>
	);
};

export default SocialMediaPanel;
