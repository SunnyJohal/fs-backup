<?php
/**
 * Shortcodes
 *
 * Define theme specific shortcodes here.
 *
 * @package titanium_theme
 * @since 1.0.0
 * @version 1.0.0
 */

namespace App;

/**
 * Alert Shortcode
 * 
 * @since 1.0.0
 * @version 1.0.0
 */
add_shortcode( 'alert', function( $atts, $content = null ) {
	return "<div class='alert'>{$content}</div>";
});
