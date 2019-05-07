<?php
/**
 * Theme Options
 *
 * Defines all of the theme options/settings,
 * customizer sections and customizer panels.
 * There are four main types of Customizer objects:
 * Panels, Sections, Settings, and Controls.
 *
 * @package titanium_theme
 * @since 1.0.0
 * @version 1.0.0
 */

namespace App;

/**
 * Get Panels
 *
 * Returns an array of panels to be registered
 * in the customizer.
 *
 * @return array $panels Array of panel settings.
 *
 * @since 1.0.0
 * @version 1.0.0
 */
function get_panels() {
	$panels = [];

	// Test Panel.
	$panels['test_panel'] = [
		'name'        => 'test_panel',
		'title'       => __( 'Test Panel', 'titanium' ),
		'priority'    => 10,
		'capability'  => 'edit_theme_options',
		'section'     => '',
		'transport'   => 'postMessage',
		'description' => __( 'This is the panel description. You can add as many panels as you need', 'titanium' ),
	];

	/**
	 * Get Panels.
	 *
	 * Allows developers to hook into the panels
	 * array to add their own panels or modify the
	 * existing panels defined.
	 *
	 * @since 1.0.0
	 *
	 * @param array $panels Panels defined.
	 */
	$panels = apply_filters( 'tt_settings_get_panels', $panels );

	// Parse panels with default to ensure that all
	// $panel_properties are present.
	foreach ( $panels as $panel_id => $panel_properties ) {
		$panels[ $panel_id ] = parse_panel_with_defaults( $panel_properties );
	}

	return $panels;
}

/**
 * Parse Panels With Defaults
 *
 * Parse any panels against a set of defaults using
 * wp_parse_args(). This is to ensure that every
 * panel property is populated in order for the
 * theme customizer to function correctly.
 *
 * @param array $panel_properties Panel to be parsed with the defaults.
 * @return array $panel_with_defaults
 *
 * @since 1.0.0
 * @version 1.0.0
 */
function parse_panel_with_defaults( $panel_properties ) {
	// Fallback defaults values if they haven't been defined.
	$defaults = [
		'name'        => 'tt_settings_panel',
		'title'       => _x( 'Theme Settings', 'Default fallback panel label in the customizer', 'titanium' ),
		'priority'    => 10,
		'capability'  => 'edit_theme_options',
		'description' => _x( 'Adjust the settings for your site below.', 'Default panel description in the customizer', 'titanium' ),
	];

	// Parse the panel passed in the parameter with the defaults.
	return wp_parse_args( $panel_properties, $defaults );
}

/**
 * Get Sections
 *
 * Returns an array of sections to be registered
 * in the customizer. To add a section to the default
 * panel set the 'panel' array value to 'default_value'.
 * wp.customize.previewer.previewUrl.set
 *
 * @return array $sections Array of sections and their settings.
 *
 * @since 1.0.0
 * @version 1.0.0
 */
function get_sections() {
	$sections = [];

	// Get panels to set the customize action heading.
	$panels = get_panels();

	// Add customize action heading to each section.
	foreach ( $sections as $section_id => $section_props ) {
		$customize_action = __( 'Customizing', 'titanium' );
		if ( ! empty( $panels[ $section_props['panel'] ]['title'] ) ) {
			/* translators: &#9656; is the unicode right-pointing triangle, and %s is the panel title in the Customizer */
			$customize_action = sprintf( __( 'Customizing &#9656; %s', 'titanium' ), $panels[ $section_props['panel'] ]['title'] );
		}
		$sections[ $section_id ]['customize_action'] = $customize_action;
	}

	return apply_filters( 'tt_settings_get_sections', $sections );
}

/**
 * Get Theme Settings Configuration
 *
 * All settings that are registered for this theme
 * are contained within this $settings array.
 *
 * Control Types:
 * 'checkbox'
 *
 * @return array $settings All theme settings.
 *
 * @since 1.0.0
 * @version 1.0.0
 */
function get_theme_settings_configuration() {
	$settings = [];

	/**
	 * Get Panels.
	 *
	 * Allows developers to hook into the $settings
	 * to add/remove any settings from the config.
	 *
	 * @since 1.0.0
	 *
	 * @param array $settings Settings defined for the theme.
	 */
	return apply_filters( 'tt_settings_get_theme_settings_configuration', $settings );
}

/**
 * Get Saved Theme Settings
 *
 * Returns the saved values for each setting in
 * the theme. If no value exists for a particular
 * setting then it will use the default value as
 * as fallback.
 *
 * TODO: Add in transients.
 *
 * @return array Saved theme settings.
 *
 * @since 1.0.0
 * @version 1.0.0
 */
function get_theme_settings() {
	$default_settings = get_default_theme_settings();
	$saved_settings   = get_theme_mod( 'tt_theme_settings', [] );

	// Remove any redundant/stale settings.
	foreach ( $saved_settings as $setting_id => $setting ) {
		if ( ! isset( $default_settings[ $setting_id ] ) ) {
			unset( $saved_settings[ $setting_id ] );
		}
	}

	// Combine saved and default settings.
	return wp_parse_args( $saved_settings, $default_settings );
}

/**
 * Get Default Theme Settings
 *
 * Returns all registered settings with their default
 * values in order to parse the currrent settings with
 * the defaults.
 *
 * @return array $default_settings - Associative array containing the setting id
 *                                   and its corresponding default value.
 *
 * @since 1.0.0
 * @version 1.0.0
 */
function get_default_theme_settings() {
	$default_settings = [];
	$theme_settings   = get_theme_settings_configuration();

	foreach ( $theme_settings as $setting_id => $setting_props ) {
		$default_settings[ $setting_id ] = $setting_props['default_value'];
	}

	return $default_settings;
}

/**
 * Get Theme Brand Colors
 *
 * Returns an array of user defined colors
 * that will be used throughout the ui to
 * provide a personalised experience. The
 * user can define up to 6 custom colors.
 *
 * @return array
 *
 * @since 1.0.0
 * @version 1.0.0
 */
function get_theme_brand_colors() {
	$brand_colors = [
		'#f44336',
		'#ff9800',
		'#ffeb3b',
		'#4caf50',
		'#3f51b5',
		'#9c27b0',
	];
	return apply_filters( 'tt_settings_get_theme_brand_colors', $brand_colors );
}
