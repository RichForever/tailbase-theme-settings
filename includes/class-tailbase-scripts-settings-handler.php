<?php
/**
 * Prints the custom scripts from the "Scripts" settings.
 *
 * The content is raw HTML on purpose (tracking codes, pixels, ...). Only users with the
 * unfiltered_html capability can save it, see Tailbase_Settings::sanitize_scripts().
 *
 * @package TailbaseThemeSettings
 */

defined( 'ABSPATH' ) || exit;

final class Tailbase_Scripts_Settings_Handler {

	public function __construct() {
		add_action( 'wp_head', array( $this, 'output_head_scripts' ) );
		add_action( 'wp_body_open', array( $this, 'output_body_scripts' ) );
		add_action( 'wp_footer', array( $this, 'output_footer_scripts' ) );
	}

	public function output_head_scripts(): void {
		$this->output( 'head' );
	}

	public function output_body_scripts(): void {
		$this->output( 'body' );
	}

	public function output_footer_scripts(): void {
		$this->output( 'footer' );
	}

	private function output( string $location ): void {
		if ( ! Tailbase_Settings::get_setting( "scriptsSettings.$location.isActive", false ) ) {
			return;
		}

		$content = Tailbase_Settings::get_setting( "scriptsSettings.$location.content", '' );

		if ( is_string( $content ) && '' !== $content ) {
			echo $content . "\n"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Raw markup entered by users with the unfiltered_html capability.
		}
	}
}
