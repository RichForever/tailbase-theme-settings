<?php
/**
 * Single source of truth for the plugin's settings: defaults, reading and sanitizing.
 *
 * @package TailbaseThemeSettings
 */

defined( 'ABSPATH' ) || exit;

final class Tailbase_Settings {

	public const OPTION        = 'tailbase_theme_settings';
	public const LEGACY_OPTION = 'tt_theme_settings';

	private const MAX_EXCERPT_LENGTH = 1000;
	private const MAX_SOCIAL_ITEMS   = 50;
	private const SCRIPT_LOCATIONS   = array( 'head', 'body', 'footer' );

	public function __construct() {
		add_action( 'init', array( $this, 'register_setting' ) );
	}

	/**
	 * Registers the option so that every write goes through sanitize().
	 * Not exposed in the core /wp/v2/settings endpoint on purpose.
	 */
	public function register_setting(): void {
		register_setting(
			'tailbase_theme_settings',
			self::OPTION,
			array(
				'type'              => 'object',
				'sanitize_callback' => array( self::class, 'sanitize' ),
				'show_in_rest'      => false,
			)
		);
	}

	/**
	 * Default settings. The React app gets them from the REST API (DELETE resets to them).
	 */
	public static function defaults(): array {
		$script = array(
			'content'  => '',
			'isActive' => false,
		);

		return array(
			'commonSettings'      => array(
				'excerptLength'           => 55,
				'customBodyClasses'       => array(),
				'disableWordpressVersion' => true,
				'addSvgSupport'           => false,
				'disableXmlRpc'           => true,
				'disableAdminBar'         => false,
				'disableFileEdit'         => true,
			),
			'scriptsSettings'     => array(
				'head'   => $script,
				'body'   => $script,
				'footer' => $script,
			),
			'socialMediaSettings' => array(),
		);
	}

	/**
	 * All settings, with defaults filled in for anything that is missing.
	 */
	public static function get_all(): array {
		$stored = get_option( self::OPTION, array() );

		return array_replace_recursive( self::defaults(), is_array( $stored ) ? $stored : array() );
	}

	/**
	 * Reads one setting by a dot path, e.g. get_setting( 'commonSettings.excerptLength', 55 ).
	 * A stored `false`, `0` or empty string is returned as is; the default is only used for missing keys.
	 *
	 * @param string $path    Dot separated path.
	 * @param mixed  $default Returned when the path does not exist.
	 * @return mixed
	 */
	public static function get_setting( string $path, $default = null ) {
		$value = self::get_all();

		foreach ( explode( '.', $path ) as $key ) {
			if ( ! is_array( $value ) || ! array_key_exists( $key, $value ) ) {
				return $default;
			}
			$value = $value[ $key ];
		}

		return $value;
	}

	/**
	 * Runs on activation: carries over settings saved before the plugin was renamed, or stores the defaults.
	 */
	public static function activate(): void {
		self::maybe_migrate_legacy_option();
		add_option( self::OPTION, self::defaults() ); // Does nothing when the option exists.
	}

	/**
	 * The plugin used to be called "TimberTail Theme Settings" and stored its data in `tt_theme_settings`.
	 * Copies it once to the new option. The old option is kept (it is removed on uninstall).
	 */
	public static function maybe_migrate_legacy_option(): void {
		if ( false !== get_option( self::OPTION ) ) {
			return;
		}

		$legacy = get_option( self::LEGACY_OPTION );
		if ( is_array( $legacy ) ) {
			add_option( self::OPTION, $legacy );
		}
	}

	/**
	 * Sanitizes the whole settings object. Unknown keys are dropped, missing keys keep their current value.
	 *
	 * @param mixed $input Raw settings.
	 */
	public static function sanitize( $input ): array {
		$current = self::get_all();
		$input   = is_array( $input ) ? $input : array();

		return array(
			'commonSettings'      => self::sanitize_common( $input['commonSettings'] ?? array(), $current['commonSettings'] ),
			'scriptsSettings'     => self::sanitize_scripts( $input['scriptsSettings'] ?? array(), $current['scriptsSettings'] ),
			'socialMediaSettings' => array_key_exists( 'socialMediaSettings', $input )
				? self::sanitize_social( $input['socialMediaSettings'] )
				: $current['socialMediaSettings'],
		);
	}

	private static function sanitize_common( $input, array $current ): array {
		$input = array_merge( $current, is_array( $input ) ? $input : array() );

		return array(
			'excerptLength'           => min( absint( $input['excerptLength'] ), self::MAX_EXCERPT_LENGTH ),
			'customBodyClasses'       => self::sanitize_class_list( $input['customBodyClasses'] ),
			'disableWordpressVersion' => rest_sanitize_boolean( $input['disableWordpressVersion'] ),
			'addSvgSupport'           => rest_sanitize_boolean( $input['addSvgSupport'] ),
			'disableXmlRpc'           => rest_sanitize_boolean( $input['disableXmlRpc'] ),
			'disableAdminBar'         => rest_sanitize_boolean( $input['disableAdminBar'] ),
			'disableFileEdit'         => rest_sanitize_boolean( $input['disableFileEdit'] ),
		);
	}

	/**
	 * The scripts are printed as raw HTML on every page (tracking codes, pixels...), so only users who may
	 * post unfiltered HTML can change them. For everyone else the stored scripts stay untouched.
	 * (On multisite, site administrators do not have this capability, only super admins.)
	 */
	private static function sanitize_scripts( $input, array $current ): array {
		if ( ! current_user_can( 'unfiltered_html' ) ) {
			return $current;
		}

		$input = is_array( $input ) ? $input : array();
		$out   = array();

		foreach ( self::SCRIPT_LOCATIONS as $location ) {
			$item = isset( $input[ $location ] ) && is_array( $input[ $location ] ) ? $input[ $location ] : array();
			$base = $current[ $location ];

			$out[ $location ] = array(
				'content'  => isset( $item['content'] ) && is_string( $item['content'] ) ? $item['content'] : $base['content'],
				'isActive' => array_key_exists( 'isActive', $item ) ? rest_sanitize_boolean( $item['isActive'] ) : $base['isActive'],
			);
		}

		return $out;
	}

	private static function sanitize_social( $items ): array {
		$out = array();

		foreach ( is_array( $items ) ? $items : array() as $item ) {
			if ( ! is_array( $item ) ) {
				continue;
			}

			$platform = sanitize_text_field( (string) ( $item['platform'] ?? '' ) );
			$url      = esc_url_raw( (string) ( $item['url'] ?? '' ) ); // Drops javascript: and other unsafe protocols.

			if ( '' === $platform || '' === $url ) {
				continue;
			}

			$out[] = array(
				'platform' => $platform,
				'url'      => $url,
				'icon'     => self::sanitize_icon( $item['icon'] ?? '' ),
			);

			if ( count( $out ) >= self::MAX_SOCIAL_ITEMS ) {
				break;
			}
		}

		return $out;
	}

	/**
	 * An icon is either a URL or the name of an SVG file.
	 */
	private static function sanitize_icon( $icon ): string {
		$icon = is_scalar( $icon ) ? trim( (string) $icon ) : '';

		if ( '' === $icon ) {
			return '';
		}

		if ( preg_match( '#^(https?:)?//#i', $icon ) || str_starts_with( $icon, '/' ) ) {
			return esc_url_raw( $icon );
		}

		return sanitize_file_name( $icon );
	}

	/**
	 * Splits entries on whitespace and keeps only valid, unique CSS class names.
	 */
	public static function sanitize_class_list( $value ): array {
		$classes = array();

		foreach ( (array) $value as $item ) {
			if ( ! is_scalar( $item ) ) {
				continue;
			}

			foreach ( preg_split( '/\s+/', trim( (string) $item ) ) as $class ) {
				$class = sanitize_html_class( $class );
				if ( '' !== $class ) {
					$classes[] = $class;
				}
			}
		}

		return array_values( array_unique( $classes ) );
	}
}
