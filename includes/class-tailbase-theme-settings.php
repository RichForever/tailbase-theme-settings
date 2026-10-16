<?php
/**
 * Plugin bootstrap.
 *
 * @package TailbaseThemeSettings
 */

defined( 'ABSPATH' ) || exit;

final class Tailbase_Theme_Settings {

	public static function init(): void {
		// Must run before any handler reads the settings.
		Tailbase_Settings::maybe_migrate_legacy_option();

		new Tailbase_Settings();
		new Tailbase_Admin_Page();
		new Tailbase_Assets_Loader();
		new Tailbase_Rest_Api();
		new Tailbase_Common_Settings_Handler();
		new Tailbase_Scripts_Settings_Handler();
	}
}
