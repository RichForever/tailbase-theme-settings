<?php
/**
 * Removes the plugin's data when it is deleted from the Plugins screen.
 *
 * @package TailbaseThemeSettings
 */

defined( 'WP_UNINSTALL_PLUGIN' ) || exit;

delete_option( 'tailbase_theme_settings' );
