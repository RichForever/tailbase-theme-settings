<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class TT_Admin_Page {

	public function __construct() {
		add_action( 'admin_menu', [ $this, 'add_admin_page' ] );
	}

	public function add_admin_page() {
		add_menu_page(
			__( 'Theme Settings', 'tt-theme-settings' ),
			__( 'Theme Settings', 'tt-theme-settings' ),
			'manage_options',
			'tt-theme-settings',
			[ $this, 'render_admin_page' ],
			'dashicons-admin-generic'
		);
	}

	public function render_admin_page() {
		echo '<div class="wrap"><div id="tt-theme-settings"></div></div>';
	}
}
