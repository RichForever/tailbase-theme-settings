/* eslint-disable prettier/prettier */
import {
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalVStack as VStack,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalHStack as HStack,
} from '@wordpress/components';

import FormSectionHeading from '@components/common/FormSectionHeading';

const Section = ({ sectionTitle, sectionDescription, children, direction = 'vertical' }) => {

	const StackComponent = direction === 'horizontal' ? HStack : VStack;

	return (
		<StackComponent spacing={4}>
			<FormSectionHeading
				title={sectionTitle}
				description={sectionDescription}
			/>
			{children}
		</StackComponent>
	);
};

export default Section;
