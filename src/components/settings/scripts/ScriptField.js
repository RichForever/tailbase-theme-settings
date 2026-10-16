import { Controller, useFormContext } from 'react-hook-form';

import { html } from '@codemirror/lang-html';
import CodeMirror from '@uiw/react-codemirror';
import {
	ToggleControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalVStack as VStack,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const ScriptField = ({ settingsGroup, fieldName }) => {
	const { control } = useFormContext();
	return (
		<VStack width="100%" spacing={4}>
			<Controller
				name={`${settingsGroup}.${fieldName}.content`} // name is used as a key name in the data object; the "." means that's the object
				control={control}
				render={({ field }) => (
					<CodeMirror
						{...field}
						placeholder={__(
							'Place your code here',
							'tailbase-theme-settings'
						)}
						height="300px"
						theme="light"
						options={{
							keyMap: 'sublime',
							mode: 'html',
						}}
						extensions={[html()]}
						style={{ border: '1px solid #d7d7d8' }}
					/>
				)}
			/>
			<Controller
				name={`${settingsGroup}.${fieldName}.isActive`} // name is used as a key name in the data object; the "." means that's the object
				control={control}
				render={({ field }) => (
					<ToggleControl
						{...field}
						label={__(
							'Activate scripts',
							'tailbase-theme-settings'
						)}
						checked={field.value}
						__nextHasNoMarginBottom
					/>
				)}
			/>
		</VStack>
	);
};

export default ScriptField;
