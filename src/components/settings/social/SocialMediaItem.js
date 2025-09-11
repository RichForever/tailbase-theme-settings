import { useState, useRef, useEffect } from '@wordpress/element';
import { Controller, useFormContext } from 'react-hook-form';

import {
	Button,
	Panel,
	PanelBody,
	PanelRow,
	TextControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalHStack as HStack,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalVStack as VStack,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { GripVertical } from 'lucide-react';

// Import Pragmatic DnD
import {
	draggable,
	dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';

const SocialMediaItem = ({
	index,
	settingsGroup,
	handleRemove,
	isNew,
	onDragStart,
	onDragEnd,
	isDragging,
	moveItem,
}) => {
	const {
		control,
		watch,
		formState: { errors },
	} = useFormContext();
	const platform = watch(`${settingsGroup}.${index}.platform`);
	const title = platform || __('New Social Media', 'tt-theme-settings');

	const dragHandleRef = useRef(null);
	const itemRef = useRef(null);
	const [isDraggedOver, setIsDraggedOver] = useState(false);

	// Set up drag and drop
	useEffect(() => {
		const element = itemRef.current;
		const handleElement = dragHandleRef.current;

		if (!element || !handleElement) {
			return;
		}

		return combine(
			// Make the item draggable via the handle
			draggable({
				element: handleElement,
				getInitialData: () => ({ index }),
				onDragStart: () => {
					onDragStart(index);
					setIsDraggedOver(false);
				},
				onDrop: () => {
					onDragEnd();
					setIsDraggedOver(false);
				},
			}),

			// Make the item a drop target
			dropTargetForElements({
				element,
				getData: () => ({ index }),
				onDragEnter: () => setIsDraggedOver(true),
				onDragLeave: () => setIsDraggedOver(false),
				onDrop: ({ source }) => {
					setIsDraggedOver(false);
					const sourceData = source.data;
					const sourceIndex = sourceData.index;

					if (sourceIndex !== index) {
						moveItem(sourceIndex, index);
					}
				},
			})
		);
	}, [index, onDragStart, onDragEnd, moveItem]);

	const dragHandleStyle = {
		cursor: 'grab',
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
	};

	const itemStyle = {
		opacity: isDragging ? 0.5 : 1,
		backgroundColor: isDraggedOver ? '#e6f7ff' : 'transparent',
		border: isDraggedOver ? '2px dashed var(--wp-admin-theme-color)' : '',
		marginBottom: '8px',
		transition: 'all 0.2s ease-in-out',
	};

	return (
		<div ref={itemRef} style={itemStyle}>
			<Panel ref={dragHandleRef}>
				<PanelBody
					title={
						<HStack justify="flex-start">
							{/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
							<div
								style={dragHandleStyle}
								onMouseDown={(e) => e.stopPropagation()}
							>
								<GripVertical size={16} />
							</div>
							<>{title}</>
						</HStack>
					}
					initialOpen={isNew}
				>
					<VStack spacing={2}>
						<PanelRow style={{ marginBottom: '16px' }}>
							<Controller
								name={`${settingsGroup}.${index}.platform`}
								control={control}
								rules={{
									required: {
										value: true,
										message: 'Field is required',
									},
								}}
								render={({ field }) => (
									<div style={{ flex: 1 }}>
										<TextControl
											{...field}
											label={__(
												'Platform Name',
												'tt-theme-settings'
											)}
											help={
												errors?.[settingsGroup]?.[index]
													?.platform && (
													<span
														style={{
															color: '#f00',
														}}
													>
														{
															errors?.[
																settingsGroup
															]?.[index]?.platform
																.message
														}
													</span>
												)
											}
											__nextHasNoMarginBottom
											__next40pxDefaultSize
										/>
									</div>
								)}
							/>
						</PanelRow>
						<PanelRow>
							<Controller
								name={`${settingsGroup}.${index}.url`}
								control={control}
								rules={{
									required: {
										value: true,
										message: 'Field is required',
									},
								}}
								render={({ field }) => (
									<div style={{ flex: 1 }}>
										<TextControl
											{...field}
											label={__(
												'URL',
												'tt-theme-settings'
											)}
											help={
												errors?.[settingsGroup]?.[index]
													?.url && (
													<span
														style={{
															color: '#f00',
														}}
													>
														{
															errors?.[
																settingsGroup
															]?.[index]?.url
																.message
														}
													</span>
												)
											}
											__nextHasNoMarginBottom
											__next40pxDefaultSize
										/>
									</div>
								)}
							/>
						</PanelRow>
						<PanelRow>
							<Controller
								name={`${settingsGroup}.${index}.icon`}
								control={control}
								rules={{}}
								render={({ field }) => (
									<div style={{ flex: 1 }}>
										<TextControl
											{...field}
											label={__(
												'Icon (URL or SVG file name)',
												'tt-theme-settings'
											)}
											__nextHasNoMarginBottom
											__next40pxDefaultSize
										/>
									</div>
								)}
							/>
						</PanelRow>
						<PanelRow>
							<Button
								variant="primary"
								isDestructive
								onClick={handleRemove}
								style={{ width: 'fit-content' }}
							>
								{__('Remove item', 'tt-theme-settings')}
							</Button>
						</PanelRow>
					</VStack>
				</PanelBody>
			</Panel>
		</div>
	);
};

export default SocialMediaItem;
