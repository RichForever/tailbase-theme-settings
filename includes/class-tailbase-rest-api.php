<?php
/**
 * REST API used by the React app: /wp-json/tailbase/v1/settings
 *
 * GET    returns all settings
 * POST   saves settings (body: { "settings": { ... } })
 * DELETE resets the settings to their defaults
 *
 * @package TailbaseThemeSettings
 */

defined( 'ABSPATH' ) || exit;

final class Tailbase_Rest_Api {

	public const REST_NAMESPACE = 'tailbase/v1';

	public function __construct() {
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	public function register_routes(): void {
		register_rest_route(
			self::REST_NAMESPACE,
			'/settings',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_settings' ),
					'permission_callback' => array( $this, 'permissions_check' ),
				),
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'update_settings' ),
					'permission_callback' => array( $this, 'permissions_check' ),
					'args'                => array(
						'settings' => array(
							'required'          => true,
							'type'              => 'object',
							'validate_callback' => 'rest_validate_request_arg',
						),
					),
				),
				array(
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => array( $this, 'reset_settings' ),
					'permission_callback' => array( $this, 'permissions_check' ),
				),
			)
		);
	}

	public function get_settings(): WP_REST_Response {
		return rest_ensure_response( Tailbase_Settings::get_all() );
	}

	public function update_settings( WP_REST_Request $request ): WP_REST_Response {
		// Sanitized here and, as a second line of defense, by the option's sanitize callback.
		update_option( Tailbase_Settings::OPTION, Tailbase_Settings::sanitize( $request->get_param( 'settings' ) ) );

		return rest_ensure_response(
			array(
				'success'  => true,
				'message'  => __( 'Settings saved successfully.', 'tailbase-theme-settings' ),
				'settings' => Tailbase_Settings::get_all(),
			)
		);
	}

	public function reset_settings(): WP_REST_Response {
		update_option( Tailbase_Settings::OPTION, Tailbase_Settings::defaults() );

		return rest_ensure_response(
			array(
				'success'  => true,
				'message'  => __( 'Settings have been reset to their default values.', 'tailbase-theme-settings' ),
				'settings' => Tailbase_Settings::get_all(),
			)
		);
	}

	public function permissions_check(): bool {
		return current_user_can( 'manage_options' );
	}
}
