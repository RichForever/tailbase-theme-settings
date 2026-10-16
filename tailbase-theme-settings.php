<?php
/**
 * Plugin Name:       Tailbase Theme Settings
 * Description:       A theme settings page for the Tailbase theme, built with React: common tweaks, header/body/footer scripts and social media links.
 * Version:           1.3.1
 * Requires at least: 6.5
 * Requires PHP:      8.0
 * Author:            MM
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       tailbase-theme-settings
 *
 * @package TailbaseThemeSettings
 */

defined( 'ABSPATH' ) || exit;

define( 'TAILBASE_THEME_SETTINGS_FILE', __FILE__ );

require_once __DIR__ . '/includes/class-tailbase-settings.php';
require_once __DIR__ . '/includes/class-tailbase-admin-page.php';
require_once __DIR__ . '/includes/class-tailbase-assets-loader.php';
require_once __DIR__ . '/includes/class-tailbase-rest-api.php';
require_once __DIR__ . '/includes/class-tailbase-common-settings-handler.php';
require_once __DIR__ . '/includes/class-tailbase-scripts-settings-handler.php';
require_once __DIR__ . '/includes/class-tailbase-theme-settings.php';

add_action( 'plugins_loaded', array( 'Tailbase_Theme_Settings', 'init' ) );
register_activation_hook( __FILE__, array( 'Tailbase_Settings', 'activate' ) );
