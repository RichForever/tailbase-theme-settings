import { useState, useEffect } from '@wordpress/element';

export const useNotice = () => {
	const [notice, setNotice] = useState({
		isVisible: false,
		type: '',
		message: '',
	});

	const showNotice = (isVisible, type, message) => {
		setNotice({
			isVisible,
			type,
			message,
		});
	};

	const dismissNotice = () => {
		setNotice({
			isVisible: false,
			type: '',
			message: '',
		});
	};

	// Automatically hide the notice after 2 seconds
	useEffect(() => {
		const timer = setTimeout(() => {
			dismissNotice();
		}, 2000);

		return () => clearTimeout(timer);
	}, [notice.isVisible]);

	return { notice, setNotice, showNotice, dismissNotice };
};
