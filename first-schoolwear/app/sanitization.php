<?php
/**
 * Sanitization
 *
 * Defines all of the sanitization callbacks
 * available to sanitize field types. Every
 * setting type should have a sanitization
 * callback assigned to it.
 *
 * @package titanium_theme
 * @since 1.0.0
 * @version 1.0.0
 */

namespace App;

/**
 * Sanitize HTML Inputs
 *
 * Sanitizes any text fields where html is
 * allowed to be saved to the database.
 *
 * @param string $input   Value of setting to be saved.
 * @param object $setting \WP_Customize_Manager instance.
 * @return boolean
 *
 * @since 1.0.0
 * @version 1.0.0
 */
function sanitize_html( $input, $setting ) {
	return wp_filter_kses( $input );
}

/**
 * Sanitize Non-HTML Inputs
 *
 * Sanitizes any text fields to the database
 * as plain text (No HTML permitted).
 *
 * @param string $input   Value of setting to be saved.
 * @param object $setting \WP_Customize_Manager instance.
 * @return mixed (boolean|string)
 *
 * @since 1.0.0
 * @version 1.0.0
 */
function sanitize_nohtml( $input, $setting ) {
	return wp_filter_nohtml_kses( $input );
}

/**
 * Sanitize Checkbox
 *
 * Sanitizes the checkbox value before it is
 * saved to the database to return true/false.
 *
 * @param bool|string $input   Value of setting to be saved.
 * @param object      $setting \WP_Customize_Manager instance.
 * @return mixed (boolean|string)
 *
 * @since 1.0.0
 * @version 1.0.0
 */
function sanitize_checkbox( $input, $setting ) {
	return rest_sanitize_boolean( $input ) ? true : false;
}

/**
 * Sanitize Toggle
 *
 * Sanitizes the toggle value before it is
 * saved to the database to return true/false.
 *
 * @param bool|string $input   Value of setting to be saved.
 * @param object      $setting \WP_Customize_Manager instance.
 * @return mixed (boolean|string)
 *
 * @since 1.0.0
 * @version 1.0.0
 */
function sanitize_toggle( $input, $setting ) {
	return rest_sanitize_boolean( $input ) ? true : false;
}

/**
 * Sanitize Choices
 *
 * Sanitizes the checkbox value before it is
 * saved to the database to return true/false.
 *
 * @see \App\get_key_from_setting_id() in /app/helpers.php
 *
 * @param string $input   Value of setting to be saved.
 * @param object $setting \WP_Customize_Manager instance.
 * @return mixed (boolean|string)
 *
 * @since 1.0.0
 * @version 1.0.0
 */
function sanitize_choices( $input, $setting ) {
	// Make sure $input is a slug.
	$input = sanitize_key( $input );

	// Get the theme settings and make sure
	// the $input choice is permitted.
	$setting_id     = get_key_from_setting_id( $setting->id );
	$theme_settings = get_theme_settings_configuration();

	if ( $setting_id
			&& isset( $theme_settings[ $setting_id ] )
			&& array_key_exists( $input, $theme_settings[ $setting_id ]['choices'] ) ) {
		return $input;
	}

	// If the $input is not valid return the default value.
	return $theme_settings[ $setting_id ]['default_value'];
}

/**
 * Sanitize Dropdown Pages
 *
 * Sanitizes the select value as an int before
 * it is saved to the database.
 *
 * @see \App\get_key_from_setting_id() in /app/helpers.php
 *
 * @param string $input   Value of setting to be saved.
 * @param object $setting \WP_Customize_Manager instance.
 * @return mixed (boolean|string)
 *
 * @since 1.0.0
 * @version 1.0.0
 */
function sanitize_dropdown_pages( $input, $setting ) {
	// Make sure $input is a slug.
	$input = sanitize_key( $input );

	// Get the theme settings and make sure
	// the $input choice is permitted.
	$setting_id     = get_key_from_setting_id( $setting->id );
	$theme_settings = get_theme_settings_configuration();

	if ( $setting_id && isset( $theme_settings[ $setting_id ] ) ) {
		return absint( $input );
	}

	// If the $input is not valid return the default value.
	return $theme_settings[ $setting_id ]['default_value'];
}

/**
 * Sanitize HEX Color
 *
 * Returns either ”, a 3 or 6 digit hex color
 * (with #), or nothing.
 *
 * @param string $input   Value of setting to be saved.
 * @param object $setting \WP_Customize_Manager instance.
 * @return mixed (boolean|string)
 *
 * @since 1.0.0
 * @version 1.0.0
 */
function sanitize_color( $input, $setting ) {
	return sanitize_hex_color( $input );
}

/**
 * Sanitize HEX Color Palette
 *
 * Returns either ”, a 3 or 6 digit hex color
 * (with #), or nothing.
 *
 * @param string $input   Value of setting to be saved.
 * @param object $setting \WP_Customize_Manager instance.
 * @return array
 *
 * @since 1.0.0
 * @version 1.0.0
 */
function sanitize_color_palette( $input, $setting ) {
	// Get the theme settings and make sure
	// the $input choice is permitted.
	$setting_id     = get_key_from_setting_id( $setting->id );
	$theme_settings = get_theme_settings_configuration();

	// Sanitize each value.
	if ( $setting_id && isset( $theme_settings[ $setting_id ] ) ) {
		$sanitized_input = $theme_settings[ $setting_id ]['default_value'];
		$input_keys      = array_keys( $input );

		foreach ( $input_keys as $key ) {
			switch ( $key ) {
				case 'base':
				case 'light':
				case 'dark':
				case 'base_text_color':
				case 'light_text_color':
				case 'dark_text_color':
					$sanitized_input[ $key ] = sanitize_hex_color( $input[ $key ] );
					break;

				case 'theme_assist':
					$sanitized_input[ $key ] = rest_sanitize_boolean( $input[ $key ] ) ? true : false;
					break;
			}
		}

		return wp_parse_args( $sanitized_input, $theme_settings[ $setting_id ]['default_value'] );
	}

	// If the $input is not valid return the default value.
	return $theme_settings[ $setting_id ]['default_value'];
}

/**
 * Sanitize Slider Input
 *
 * Returns either the saved setting or reverts
 * to the default setting defined if invalid.
 *
 * @param string $input   Value of setting to be saved.
 * @param object $setting \WP_Customize_Manager instance.
 * @return array
 *
 * @since 1.0.0
 * @version 1.0.0
 */
function sanitize_slider( $input, $setting ) {
	// Get the theme settings and make sure
	// the $input choice is permitted.
	$setting_id     = get_key_from_setting_id( $setting->id );
	$theme_settings = get_theme_settings_configuration();

	// Sanitize each value.
	if ( $setting_id && isset( $theme_settings[ $setting_id ] ) ) {
		$sanitized_input = $theme_settings[ $setting_id ]['default_value'];
		$input_keys      = array_keys( $input );

		foreach ( $input_keys as $key ) {
			switch ( $key ) {
				case 'amount':
					$sanitized_input[ $key ] = is_float( $input[ $key ] ) ? floatval( $input[ $key ] ) : intval( $input[ $key ] );
					break;

				case 'unit':
					$sanitized_input[ $key ] = esc_attr( $input[ $key ] );
					break;
			}
		}

		return wp_parse_args( $sanitized_input, $theme_settings[ $setting_id ]['default_value'] );
	}

	// If the $input is not valid return the default value.
	return $theme_settings[ $setting_id ]['default_value'];
}

/**
 * Sanitize Background Position Input
 *
 * Returns either ”, a 3 or 6 digit hex color
 * (with #), or nothing.
 *
 * TODO: Test the background position on save
 *
 * @param string $input   Value of setting to be saved.
 * @param object $setting \WP_Customize_Manager instance.
 * @return array
 *
 * @since 1.0.0
 * @version 1.0.0
 */
function sanitize_background_position( $input, $setting ) {
	// Get the theme settings and make sure
	// the $input choice is permitted.
	$setting_id     = get_key_from_setting_id( $setting->id );
	$theme_settings = get_theme_settings_configuration();

	// Sanitize each value.
	if ( $setting_id && isset( $theme_settings[ $setting_id ] ) ) {
		$sanitized_input = $theme_settings[ $setting_id ]['default_value'];
		$input_keys      = array_keys( $input );

		foreach ( $input_keys as $key ) {
			switch ( $key ) {
				case 'background_position_x':
				case 'background_position_y':
					$sanitized_input[ $key ] = esc_attr( $input[ $key ] );
					break;
			}
		}

		return wp_parse_args( $sanitized_input, $theme_settings[ $setting_id ]['default_value'] );
	}

	// If the $input is not valid return the default value.
	return $theme_settings[ $setting_id ]['default_value'];
}

/**
 * Sanitize URL
 *
 * Returns a sanitized url string.
 *
 * @param string $input   The URL to be cleaned.
 * @param object $setting \WP_Customize_Manager instance.
 * @return mixed (boolean|string)
 *
 * @since 1.0.0
 * @version 1.0.0
 */
function sanitize_url( $input, $setting ) {
	return esc_url( $input );
}

function sanitize_image( $input, $setting ) {
	$o = print_r( $input, 1 );
	error_log( $o );
	return $input;
}
