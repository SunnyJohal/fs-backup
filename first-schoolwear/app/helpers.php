<?php
/**
 * Helper Functions
 *
 * Contains helper functions used throughout
 * the theme.
 *
 * @package titanium_theme
 * @since 1.0.0
 * @version 1.0.0
 */

namespace App;

use Roots\Sage\Container;

/**
 * Get Key from Setting ID
 *
 * Used to return the array key from the setting
 * id in the customizer.
 * e.g. 'tt_theme_settings[my_key]' returns 'my_key'
 *
 * @param string $setting_id   Full setting id key.
 * @param string $setting_base Base setting array key.
 * @return string|boolean Key if located or false.
 *
 * @since 1.0.0
 * @version 1.0.0
 */
function get_key_from_setting_id( $setting_id, $setting_base = 'tt_theme_settings' ) {
	$id_pattern = '/^' . $setting_base . '\[([a-zA-Z0-9_-]+)\]$/';

	if ( preg_match( $id_pattern, $setting_id, $matches ) ) {
		return $matches[1];
	}

	return false;
}

/**
 * Get the sage container.
 *
 * @param    string    $abstract The context of the request.
 * @param    array     $parameters Paramaters to use as args.
 * @param    Container $container Exisiting container model, if appropriate.
 * @return   Container|mixed
 */
function sage( $abstract = null, $parameters = [], Container $container = null ) {
	$container = $container ?: Container::getInstance();
	if ( ! $abstract ) {
		return $container;
	}

	return $container->bound( $abstract )
		? $container->makeWith( $abstract, $parameters )
		: $container->makeWith( "sage.{$abstract}", $parameters );
}

/**
 * Get / set the specified configuration value.
 *
 * If an array is passed as the key, we will assume
 * you want to set an array of values.
 *
 * @param array|string $key Setting you want to get/set.
 * @param mixed        $default Defaults to parse with retrieved settings.
 * @return mixed|\Roots\Sage\Config
 * @link https://github.com/laravel/framework/blob/c0970285/src/Illuminate/Foundation/helpers.php#L254-L265
 */
function config( $key = null, $default = null ) {
	if ( is_null( $key ) ) {
		return sage( 'config' );
	}
	if ( is_array( $key ) ) {
		return sage( 'config' )->set( $key );
	}
	return sage( 'config' )->get( $key, $default );
}

/**
 * Template Render Helper
 *
 * Loads the corresponging template view along
 * with the data.
 *
 * @param string $file File path.
 * @param array  $data Data to load from the controller.
 * @return string
 */
function template( $file, $data = [] ) {
	if ( remove_action( 'wp_head', 'wp_enqueue_scripts', 1 ) ) {
		wp_enqueue_scripts();
	}

	return sage( 'blade' )->render( $file, $data );
}

/**
 * Get Compiled Template Path
 *
 * Retrieve compiled path to a blade view.
 *
 * @param string $file File path.
 * @param array  $data Data to load from the controller.
 * @return string
 */
function template_path( $file, $data = [] ) {
	return sage( 'blade' )->compiledPath( $file, $data );
}

/**
 * Get Asset Path
 *
 * @param string $asset Asset to get.
 * @return string
 */
function asset_path( $asset ) {
	return sage( 'assets' )->getUri( $asset );
}

/**
 * Filter Templates
 *
 * @param string|string[] $templates Possible template files.
 * @return array
 */
function filter_templates( $templates ) {
	$paths = apply_filters( 'sage/filter_templates/paths', [
		'views',
		'resources/views',
	] );

	$paths_pattern = '#^(' . implode( '|', $paths ) . ')/#';

	return collect( $templates )
		->map( function ( $template ) use ( $paths_pattern ) {
			/** Remove .blade.php/.blade/.php from template names */
			$template = preg_replace( '#\.(blade\.?)?(php)?$#', '', ltrim( $template ) );

			/** Remove partial $paths from the beginning of template names */
			if ( strpos( $template, '/' ) ) {
				$template = preg_replace( $paths_pattern, '', $template );
			}

			return $template;
		})
		->flatMap( function ( $template ) use ( $paths ) {
			return collect( $paths )
				->flatMap(function ( $path ) use ( $template ) {
					return [
						"{$path}/{$template}.blade.php",
						"{$path}/{$template}.php",
						"{$template}.blade.php",
						"{$template}.php",
					];
				});
		})
		->filter()
		->unique()
		->all();
}

/**
 * Locate Template
 *
 * Locates the template to load depending
 * on the filtered context.
 *
 * @param  string|string[] $templates Relative path to possible template files.
 * @return string Location of the template.
 */
function locate_template( $templates ) {
	return \locate_template( filter_templates( $templates ) );
}

/**
 * Determine whether to show the sidebar
 *
 * @return bool
 */
function display_sidebar() {
	static $display;

	if ( ! isset( $display ) ) {
		$display = apply_filters( 'sage/display_sidebar', false );
	}

	return $display;
}
