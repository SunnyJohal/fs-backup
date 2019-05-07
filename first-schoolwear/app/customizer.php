<?php
/**
 * Customizer Manager Functionality
 *
 * Registers any functionality to use within
 * the customizer to improve the theme editing
 * experience. There are four main types of
 * Customizer objects: Panels, Sections,
 * Settings, and Controls. All of the options
 * relating to the theme are managed exclusively
 * in the customizer.
 *
 * This file is responsible for:
 * => Loading js scripts/styles in the customize
 *    controls and previewer screen.
 * => Registering static theme settings with the
 *    customizer dynamically on save.
 * => Defining any custom sanitization callbacks
 *    for the theme settings.
 *
 * @link https://developer.wordpress.org/themes/customize-api/
 *
 * @package titanium_theme
 * @since 1.0.0
 * @version 1.0.0
 */

namespace App;

use Roots\Sage\Assets\JsonManifest;

/**
 * Do the following:
 * - Register any custom control types.
 * - Register the customizer controls.
 */

/**
 * The flow currently
 * 1. Add Panels
 * 2. Add tabs (sections)
 * 3. Add settings to section, increase prioirity then add control for setting
 */

/**
 * Enqueue Theme Assets - Control
 *
 * Enqueue the css and the js for the
 * customizer controls.
 *
 * @since 1.0.0
 * @version 1.0.0
 */
add_action('customize_controls_enqueue_scripts', function () {
	// Enqueue customizer control styles.
	wp_enqueue_style( 'sage/customizer-controls.css', asset_path( 'styles/customizer-controls.css' ), false, null );

	// Load WordPress media lightbox.
	wp_enqueue_media();

	// Enqueue customizer control scripts.
	wp_enqueue_script( 'wp-color-picker' );
	wp_enqueue_script( 'iris' );
	wp_enqueue_script( 'sage/customizer-controls.js', asset_path( 'scripts/customizer-controls.js' ), [ 'jquery' ], null, true );

	// Add any translations to use for customizer controls here.
	wp_localize_script( 'sage/customizer-controls.js', 'ttCustomize', [
		'data'         => [
			'brand_colors' => get_theme_brand_colors(),
			'pages'        => get_pages_data(),
		],
		'permissions'  => [
			'customize'          => current_user_can( 'customize' ),
			'edit_theme_options' => current_user_can( 'edit_theme_options' ),
			'publish_pages'      => current_user_can( 'publish_pages' ),
			'upload_files'       => current_user_can( 'upload_files' ),
		],
		'translations' => [
			'controls' => get_control_translations(),
		],
		'panels'       => get_panels(),
		'sections'     => get_sections(),
		'settings'     => [
			'setting_key' => 'tt_theme_settings',
			'config'      => get_theme_settings_configuration(),
			'saved'       => get_theme_settings(),
		],
	] );
}, 100);

/**
 * Enqueue Theme Assets - Preview
 *
 * Enqueue the css and the js for the
 * customizer live previewer.
 *
 * @since 1.0.0
 * @version 1.0.0
 */
add_action('customize_preview_init', function () {
	wp_enqueue_script( 'sage/customizer-preview.js', asset_path( 'scripts/customizer-preview.js' ), [ 'customize-preview' ], null, true );

	// Add any translations to use for the customizer preview here.
	wp_localize_script( 'sage/customizer-preview.js', 'ttCustomizerPreview', [] );
});

/**
 * Filters a dynamic setting's constructor args.
 *
 * For a dynamic setting to be registered, this filter must be employed
 * to override the default false value with an array of args to pass to
 * the WP_Customize_Setting constructor. This function is here in the
 * event that we decide to register dynamic settings in the client.
 *
 * DEVELOPER NOTE: To change the transport type for each
 * option modify the 'transport' value for the appropriate
 * option in the $settings array.
 *
 * @see \App\get_theme_settings_configuration()
 *
 * @param false|array $setting_args The arguments to the WP_Customize_Setting constructor.
 * @param string      $setting_id   ID for dynamic setting, usually coming from `$_POST['customized']`.
 * @return array|false
 *
 * @since 1.0.0
 * @version 1.0.0
 */
add_filter( 'customize_dynamic_setting_args', function( $setting_args, $setting_id ) {
	// Setting key regex tt_theme_settings[] pattern.
	$id_pattern = '/^tt_theme_settings\[([a-zA-Z0-9_-]+)\]$/';

	if ( preg_match( $id_pattern, $setting_id, $matches ) ) {
		$setting_key     = $matches[1];
		$settings_config = get_theme_settings_configuration();

		// Make sure this setting exists in our config file.
		if ( ! empty( $settings_config[ $setting_key ] ) ) {
			// Get the setting props.
			$setting_props = $settings_config[ $setting_key ];

			// Get the configutation for this setting.
			$transport         = empty( $setting_props['transport'] ) ? 'refresh' : $setting_props['transport'];
			$default           = isset( $setting_props['default_value'] ) ? $setting_props['default_value'] : '';
			$sanitize_callback = empty( $setting_props['sanitize_callback'] ) ? false : $setting_props['sanitize_callback'];

			$setting_args = [
				'default'           => $default,
				'type'              => 'theme_mod',
				'transport'         => $transport,
				'capability'        => 'edit_theme_options',
				'sanitize_callback' => $sanitize_callback,
			];
		}
	}

	return $setting_args;
}, 10, 2 );

/**
 * Filter Dynamic Subsetting Settings
 *
 * Creates settings in the event that a setting with
 * a subsetting is registered within the customizer.
 *
 * @see \App\get_theme_settings_configuration()
 *
 * @param false|array $setting_args The arguments to the WP_Customize_Setting constructor.
 * @param string      $setting_id   ID for dynamic setting, usually coming from `$_POST['customized']`.
 * @return array|false
 *
 * @since 1.0.0
 * @version 1.0.0
 */
add_filter( 'customize_dynamic_setting_args', function( $setting_args, $setting_id ) {
	$subsetting_pattern = '/^tt_theme_settings\[([a-zA-Z0-9_-]+)\]\[([a-zA-Z0-9_-]+)\]$/';

	if ( preg_match( $subsetting_pattern, $setting_id, $matches ) ) {
		$setting_key      = $matches[1];
		$setting_prop_key = $matches[2];
		$settings_config  = get_theme_settings_configuration();

		// Bail if this setting doesn't exist.
		if ( empty( $settings_config[ $setting_key ] )
				|| ! array_key_exists( $setting_prop_key, $settings_config[ $setting_key ]['default_value'] ) ) {
			return $setting_args;
		}

		// Get the setting props.
		$setting_props = $settings_config[ $setting_key ];

		/**
		 * Color Palette Subsettings.
		 *
		 * Registers the subsettings for the color palette
		 * control as they are individually registered in
		 * the customizer.
		 */
		if ( 'color-palette' === $setting_props['type'] ) {
			// Get the configutation for this setting.
			$transport         = empty( $setting_props['transport'] ) ? 'refresh' : $setting_props['transport'];
			$default           = $setting_props['default_value'][ $setting_prop_key ];
			$sanitize_callback = false;

			// Determine $sanitize_callback.
			switch ( $setting_prop_key ) {
				case 'base':
				case 'light':
				case 'dark':
				case 'text_color':
					$sanitize_callback = '\App\sanitize_color';
					break;

				case 'theme_assist':
					$sanitize_callback = '\App\sanitize_toggle';
					break;
			}

			$setting_args = [
				'default'           => $default,
				'type'              => 'theme_mod',
				'transport'         => $transport,
				'capability'        => 'edit_theme_options',
				'sanitize_callback' => $sanitize_callback,
			];
		}
	}

	return $setting_args;
}, 20, 2 );

/**
 * Get Control Translations
 *
 * Returns the available translation strings
 * for each control type to use in the customizer.
 * Translations are ordered by field type.
 *
 * @since 1.0.0
 * @version 1.0.0
 */
function get_control_translations() {
	$translations = [
		'common'              => [
			'reset_label'   => __( 'Reset', 'titanium' ),
			'palette_label' => __( 'Color Palette', 'titanium' ),
		],
		'background_position' => [
			'position_labels' => [
				'left_top'      => __( 'Top Left', 'titanium' ),
				'center_top'    => __( 'Top', 'titanium' ),
				'right_top'     => __( 'Top Right', 'titanium' ),
				'left_center'   => __( 'Left', 'titanium' ),
				'center_center' => __( 'Center', 'titanium' ),
				'right_center'  => __( 'Right', 'titanium' ),
				'left_bottom'   => __( 'Bottom Left', 'titanium' ),
				'center_bottom' => __( 'Bottom', 'titanium' ),
				'right_bottom'  => __( 'Bottom Right', 'titanium' ),
			],
		],
		'image'               => [
			'button_labels' => [
				'select'       => __( 'Select image', 'titanium' ),
				'change'       => __( 'Change image', 'titanium' ),
				'default'      => __( 'Default', 'titanium' ),
				'remove'       => __( 'Remove', 'titanium' ),
				'placeholder'  => __( 'No image selected', 'titanium' ),
				'frame_title'  => __( 'Select image', 'titanium' ),
				'frame_button' => __( 'Choose image', 'titanium' ),
			],
		],
		'color'               => [
			'button_labels' => [
				'open_palette'  => __( 'Open Color Palette', 'titanium' ),
				'close_palette' => __( 'Close Color Palette', 'titanium' ),
			],
		],
		'color_swatch'        => [
			'button_labels' => [
				'select_color' => __( 'Select Color', 'titanium' ),
			],
		],
		'toggle'              => [
			'state_labels' => [
				'on'  => __( 'On', 'titanium' ),
				'off' => __( 'Off', 'titanium' ),
			],
		],
		'color_palette'       => [
			'control_labels'      => [
				'light'            => __( 'Light Background Color', 'titanium' ),
				'base'             => __( 'Base Background Color', 'titanium' ),
				'dark'             => __( 'Dark Background Color', 'titanium' ),
				'light_text_color' => __( 'Light Text Color', 'titanium' ),
				'base_text_color'  => __( 'Base Text Color', 'titanium' ),
				'dark_text_color'  => __( 'Dark Text Color', 'titanium' ),
			],
			'swatch_labels'       => [
				'light' => __( 'Light', 'titanium' ),
				'base'  => __( 'Base', 'titanium' ),
				'dark'  => __( 'Dark', 'titanium' ),
			],
			'theme_assist_labels' => [
				'on'  => __( 'Theme Assist On', 'titanium' ),
				'off' => __( 'Manual', 'titanium' ),
			],
		],
	];

	return $translations;
}

/**
 * Get Pages Data
 *
 * Returns an array of page ids and page titles
 * to use as a data source in the customizer for
 * custom controls.
 *
 * @since 1.0.0
 * @version 1.0.0
 */
function get_pages_data() {
	$args = [
		'depth'                 => 0,
		'child_of'              => 0,
		'id'                    => '',
		'class'                 => '',
		'show_option_none'      => '',
		'show_option_no_change' => '',
		'option_none_value'     => '',
		'value_field'           => 'ID',
		'tt_customize_data'     => true,
	];

	$pages = [];

	foreach ( get_pages( $args ) as $page ) {
		$pages[] = [
			'ID'         => $page->ID,
			'post_title' => $page->post_title,
			'guid'       => $page->guid,
		];
	}

	return $pages;
}
