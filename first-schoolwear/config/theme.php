<?php
/**
 * Config: Theme
 *
 * Contains key value config settings pertaining
 * to the theme file paths.
 *
 * @package titanium_theme
 * @since 1.0.0
 * @version 1.0.0
 */

return [

	/*
	|--------------------------------------------------------------------------
	| Theme Directory
	|--------------------------------------------------------------------------
	|
	| This is the absolute path to your theme directory.
	|
	| Example:
	|   /srv/www/example.com/current/web/app/themes/sage
	|
	*/

	'dir' => get_theme_file_path(),

	/*
	|--------------------------------------------------------------------------
	| Theme Directory URI
	|--------------------------------------------------------------------------
	|
	| This is the web server URI to your theme directory.
	|
	| Example:
	|   https: //example.com/app/themes/sage
	|
	*/

	'uri' => get_theme_file_uri(),
];
