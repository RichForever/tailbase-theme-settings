<?php
/**
 * Applies the "Common" settings. Every handler only changes WordPress's behavior
 * when its setting is on, and passes the incoming value through otherwise.
 *
 * @package TailbaseThemeSettings
 */

defined( 'ABSPATH' ) || exit;

final class Tailbase_Common_Settings_Handler {

	public function __construct() {
		add_filter( 'excerpt_length', array( $this, 'excerpt_length' ), 999 );
		add_filter( 'the_generator', array( $this, 'generator' ) );
		add_filter( 'upload_mimes', array( $this, 'upload_mimes' ) );
		add_filter( 'wp_check_filetype_and_ext', array( $this, 'check_svg_filetype' ), 10, 3 );
		add_filter( 'wp_handle_upload_prefilter', array( $this, 'reject_unsafe_svg' ) );
		add_filter( 'xmlrpc_enabled', array( $this, 'xmlrpc_enabled' ) );
		add_filter( 'show_admin_bar', array( $this, 'show_admin_bar' ) );
		add_filter( 'body_class', array( $this, 'body_classes' ) );

		$this->maybe_disable_file_edit();
	}

	public function excerpt_length( $length ) {
		return min( absint( Tailbase_Settings::get_setting( 'commonSettings.excerptLength', $length ) ), 1000 );
	}

	public function generator( $generator ) {
		return $this->is_on( 'disableWordpressVersion' ) ? '' : $generator;
	}

	public function xmlrpc_enabled( $enabled ) {
		return $this->is_on( 'disableXmlRpc' ) ? false : $enabled;
	}

	/**
	 * Hides the admin bar for everyone except site administrators.
	 */
	public function show_admin_bar( $show ) {
		if ( $this->is_on( 'disableAdminBar' ) && ! current_user_can( 'manage_options' ) ) {
			return false;
		}

		return $show;
	}

	public function body_classes( $classes ) {
		$custom = Tailbase_Settings::sanitize_class_list( Tailbase_Settings::get_setting( 'commonSettings.customBodyClasses', array() ) );

		return array_merge( $classes, $custom );
	}

	private function maybe_disable_file_edit(): void {
		if ( $this->is_on( 'disableFileEdit' ) && ! defined( 'DISALLOW_FILE_EDIT' ) ) {
			define( 'DISALLOW_FILE_EDIT', true );
		}
	}

	/**
	 * SVG uploads. SVG files can contain scripts, so they are only allowed for users who may post
	 * unfiltered HTML (administrators on a single site), never for authors or editors.
	 */
	private function svg_allowed(): bool {
		return $this->is_on( 'addSvgSupport' ) && current_user_can( 'unfiltered_html' );
	}

	public function upload_mimes( $mimes ) {
		if ( $this->svg_allowed() ) {
			$mimes['svg'] = 'image/svg+xml';
		}

		return $mimes;
	}

	/**
	 * WordPress cannot always detect the type of an SVG from its content, so trust the extension
	 * (only when SVG uploads are allowed for the current user).
	 */
	public function check_svg_filetype( $data, $file, $filename ) {
		if ( ! empty( $data['ext'] ) && ! empty( $data['type'] ) ) {
			return $data;
		}

		if ( $this->svg_allowed() && 'svg' === strtolower( pathinfo( (string) $filename, PATHINFO_EXTENSION ) ) ) {
			$data['ext']  = 'svg';
			$data['type'] = 'image/svg+xml';
		}

		return $data;
	}

	/**
	 * Basic safety net for SVG uploads: rejects files that contain scripts or event handlers.
	 * This is not a full sanitizer; only upload SVG files you trust.
	 */
	public function reject_unsafe_svg( $file ) {
		$name = isset( $file['name'] ) ? (string) $file['name'] : '';

		if ( 'svg' !== strtolower( pathinfo( $name, PATHINFO_EXTENSION ) ) || empty( $file['tmp_name'] ) ) {
			return $file;
		}

		$contents = file_get_contents( $file['tmp_name'], false, null, 0, 2 * MB_IN_BYTES ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- Local temporary upload.

		if ( false === $contents || preg_match( '/<script|<foreignObject|<iframe|<embed|<object|<!ENTITY|javascript:|data:text\/html|\son[a-z]+\s*=/i', $contents ) ) {
			$file['error'] = __( 'This SVG file contains potentially unsafe code and was rejected.', 'tailbase-theme-settings' );
		}

		return $file;
	}

	private function is_on( string $key ): bool {
		return (bool) Tailbase_Settings::get_setting( 'commonSettings.' . $key, false );
	}
}
