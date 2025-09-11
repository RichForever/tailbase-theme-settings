import { Controller, useFormContext } from 'react-hook-form';

import { ToggleControl } from '@wordpress/components';

const ToggleField = ({ settingsGroup, fieldName }) => {
	const { control } = useFormContext();
	return (
		<Controller
			name={`${settingsGroup}.${fieldName}`}
			control={control}
			render={({ field }) => (
				<ToggleControl
					{...field}
					checked={field.value}
					__nextHasNoMarginBottom
				/>
			)}
		/>
	);
};

export default ToggleField;
