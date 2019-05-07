<?php
/**
 * Theme Admin Functionality
 *
 * Registers any functionality to use within
 * the admin area.
 *
 * @package titanium_theme
 * @since 1.0.0
 * @version 1.0.0
 */

namespace App;

use Roots\Sage\Assets\JsonManifest;

/**
 * Theme customizer
 */
add_action('customize_register', function ( \WP_Customize_Manager $wp_customize ) {
	// Add postMessage support.
	$wp_customize->get_setting( 'blogname' )->transport = 'postMessage';
	$wp_customize->selective_refresh->add_partial('blogname', [
		'selector'        => '.mdc-toolbar__title',
		'render_callback' => function () {
			bloginfo( 'name' );
		},
	]);
});
