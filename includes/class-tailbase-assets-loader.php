<?php
/**
 * Loads the React app on the settings page only.
 *
 * @package TailbaseThemeSettings
 */

defined( 'ABSPATH' ) || exit;

final class Tailbase_Assets_Loader {

	private const HANDLE = 'tailbase-theme-settings';

	public function __construct() {
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
	}

	/**
	 * Whether `npm run build` has been run.
	 */
	public static function is_built(): bool {
		return is_readable( self::build_path( 'app.asset.php' ) );
	}

	public function enqueue_scripts( string $hook_suffix ): void {
		if ( 'toplevel_page_' . Tailbase_Admin_Page::SLUG !== $hook_suffix || ! self::is_built() ) {
			return;
		}

		$asset = require self::build_path( 'app.asset.php' );

		wp_enqueue_script(
			self::HANDLE,
			plugins_url( 'build/app.js', TAILBASE_THEME_SETTINGS_FILE ),
			$asset['dependencies'],
			$asset['version'],
			true
		);

		wp_enqueue_style(
			self::HANDLE,
			plugins_url( 'build/app.css', TAILBASE_THEME_SETTINGS_FILE ),
			array( 'wp-components' ),
			$asset['version']
		);
		wp_style_add_data( self::HANDLE, 'rtl', 'replace' );
	}

	private static function build_path( string $file ): string {
		return plugin_dir_path( TAILBASE_THEME_SETTINGS_FILE ) . 'build/' . $file;
	}
}
