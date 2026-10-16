<?php
/**
 * The "Theme Settings" admin page. The page itself is rendered by the React app.
 *
 * @package TailbaseThemeSettings
 */

defined( 'ABSPATH' ) || exit;

final class Tailbase_Admin_Page {

	public const SLUG = 'tailbase-theme-settings';

	public function __construct() {
		add_action( 'admin_menu', array( $this, 'add_admin_page' ) );
	}

	public function add_admin_page(): void {
		add_menu_page(
			__( 'Theme Settings', 'tailbase-theme-settings' ),
			__( 'Theme Settings', 'tailbase-theme-settings' ),
			'manage_options',
			self::SLUG,
			array( $this, 'render_admin_page' ),
			'dashicons-admin-generic'
		);
	}

	public function render_admin_page(): void {
		echo '<div class="wrap">';

		if ( Tailbase_Assets_Loader::is_built() ) {
			echo '<div id="' . esc_attr( self::SLUG ) . '"></div>';
		} else {
			echo '<div class="notice notice-error"><p>' . esc_html__( 'The settings app is not built yet. Run "npm install && npm run build" in the plugin folder.', 'tailbase-theme-settings' ) . '</p></div>';
		}

		echo '</div>';
	}
}
