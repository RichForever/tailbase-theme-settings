import { createRoot } from '@wordpress/element';
import ThemeSettingsPage from './ThemeSettingsPage';

import './app.scss';

const App = () => {
	return <ThemeSettingsPage />;
};

const rootElement = document.getElementById('tailbase-theme-settings');
if (rootElement) {
	createRoot(rootElement).render(<App />);
}
