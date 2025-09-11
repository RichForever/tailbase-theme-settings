<?php
/**
 * Plugin Name:       TimberTail Theme Settings
 * Description:       This plugin provides a customizable theme settings page, built with React.
 * Version:           1.1.7
 * Author:            MM
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Autoload classes
spl_autoload_register( function ( $class ) {
	if ( strpos( $class, 'TT_' ) === false ) {
		return;
	}
	$class_name = strtolower( str_replace( '_', '-', $class ) );
	$base_dir = plugin_dir_path( __FILE__ );
	$directories = ['includes', 'includes/handlers', 'includes/settings', 'includes/api'];
	$prefix = 'class-';

	foreach ( $directories as $directory ) {
		$file_path = $base_dir . $directory . '/' . $prefix . $class_name . '.php';
		if ( file_exists( $file_path ) ) {
			include $file_path;
			break;
		}
	}
});

// Initialize the plugin
function tt_theme_settings_init() {
	TT_Theme_Settings::init();
}
add_action( 'plugins_loaded', 'tt_theme_settings_init' );

// Set default settings on plugin activation
function tt_theme_settings_activate() {
    $default_settings = [
        'commonSettings' => [
            'excerptLength' => 55,
            'customBodyClasses' => [],
            'disableWordpressVersion' => true,
            'addSvgSupport' => true,
            'disableXmlRpc' => true,
            'disableAdminBar' => false,
            'disableFileEdit' => true
        ],
        'scriptsSettings' => [
            'head' => [
                'content' => '',
                'isActive' => false
            ],
            'body' => [
                'content' => '',
                'isActive' => false
            ],
            'footer' => [
                'content' => '',
                'isActive' => false
            ]
        ],
        'socialMediaSettings' => []
    ];

    // Only set default settings if they don't exist
    if (!get_option('tt_theme_settings')) {
        update_option('tt_theme_settings', $default_settings);
    }
}
register_activation_hook(__FILE__, 'tt_theme_settings_activate');