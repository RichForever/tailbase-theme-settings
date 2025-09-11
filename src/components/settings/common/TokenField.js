import { Controller, useFormContext } from 'react-hook-form';

import { FormTokenField } from '@wordpress/components';

const TokenField = ({ settingsGroup, fieldName }) => {
	const { control } = useFormContext();
	return (
		<Controller
			name={`${settingsGroup}.${fieldName}`}
			control={control}
			render={({ field }) => (
				<FormTokenField
					{...field}
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				/>
			)}
		/>
	);
};

export default TokenField;
