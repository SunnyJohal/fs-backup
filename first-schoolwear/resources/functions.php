<?php
/**
 * Functions File
 *
 * Sets up the theme template hierachy to use the
 * resources/views structure.
 *
 * @package titanium_theme
 * @since 1.0.0
 * @version 1.0.0
 */

/**
 * Do not edit anything in this file unless you know what you're doing
 */

use Roots\Sage\Config;
use Roots\Sage\Container;

/**
 * Helper function for prettying up errors
 * TODO: Put in the link to the theme docs if appropriate.
 *
 * @param string $message
 * @param string $subtitle
 * @param string $title
 */
$sage_error = function ( $message, $subtitle = '', $title = '' ) {
	$title   = $title ?: __( 'Theme &rsaquo; Error', 'titanium' );
	$footer  = __( 'Theme &rsaquo; Error', 'titanium' );
	$message = "<h1>{$title}<br><small>{$subtitle}</small></h1><p>{$message}</p><p>{$footer}</p>";
	wp_die( $message, $title );
};

/**
 * Ensure compatible version of PHP is used
 */
if ( version_compare( '7', phpversion(), '>=' ) ) {
	$sage_error( __( 'You must be using PHP 7 or greater.', 'titanium' ), __( 'Invalid PHP version', 'titanium' ) );
}

/**
 * Ensure compatible version of WordPress is used
 */
if ( version_compare( '4.7.0', get_bloginfo( 'version' ), '>=' ) ) {
	$sage_error( __( 'You must be using WordPress 4.7.0 or greater.', 'titanium' ), __( 'Invalid WordPress version', 'titanium' ) );
}

/**
 * Ensure dependencies are loaded
 */
if ( ! class_exists( 'Roots\\Sage\\Container' ) ) {
	$composer = __DIR__ . '/../vendor/autoload.php';
	if ( ! file_exists( $composer ) ) {
		$sage_error(
			__( 'You must run <code>composer install</code> from the theme directory.', 'titanium' ),
			__( 'Autoloader not found.', 'titanium' )
		);
	}
	require_once $composer;
}

/**
 * Sage required files
 *
 * The mapped array determines the code library included in your theme.
 * Add or remove files to the array as needed. Supports child theme overrides.
 */
array_map( function ( $file ) use ( $sage_error ) {
	$file = "../app/{$file}.php";
	if ( ! locate_template( $file, true, true ) ) {
		// translators: error message for when the file is not found.
		$sage_error( sprintf( __( 'Error locating <code>%s</code> for inclusion.', 'titanium' ), $file ), 'File not found' );
	}
}, [ 'helpers', 'setup', 'filters', 'settings', 'sanitization', 'admin', 'customizer', 'shortcodes' ] );

/**
 * Here's what's happening with these hooks:
 * 1. WordPress initially detects theme in themes/sage/resources
 * 2. Upon activation, we tell WordPress that the theme is actually in themes/sage/resources/views
 * 3. When we call get_template_directory() or get_template_directory_uri(), we point it back to themes/sage/resources
 *
 * We do this so that the Template Hierarchy will look in themes/sage/resources/views for core WordPress themes
 * But functions.php, style.css, and index.php are all still located in themes/sage/resources
 *
 * This is not compatible with the WordPress Customizer theme preview prior to theme activation
 *
 * get_template_directory()   -> /srv/www/example.com/current/web/app/themes/sage/resources
 * get_stylesheet_directory() -> /srv/www/example.com/current/web/app/themes/sage/resources
 * locate_template()
 * ├── STYLESHEETPATH         -> /srv/www/example.com/current/web/app/themes/sage/resources/views
 * └── TEMPLATEPATH           -> /srv/www/example.com/current/web/app/themes/sage/resources
 */
array_map(
	'add_filter',
	[ 'theme_file_path', 'theme_file_uri', 'parent_theme_file_path', 'parent_theme_file_uri' ],
	array_fill( 0, 4, 'dirname' )
);

Container::getInstance()
	->bindIf('config', function () {
		return new Config([
			'assets' => require dirname( __DIR__ ) . '/config/assets.php',
			'theme'  => require dirname( __DIR__ ) . '/config/theme.php',
			'view'   => require dirname( __DIR__ ) . '/config/view.php',
		]);
	}, true);

// remove_theme_mod( 'tt_theme_settings' );

/**
* Better Pre-submission Confirmation
* http://gravitywiz.com/2012/08/04/better-pre-submission-confirmation/
*/
class GWPreviewConfirmation {

	private static $lead;

	public static function init() {
			add_filter( 'gform_pre_render', array( __class__, 'replace_merge_tags' ) );
	}

	public static function replace_merge_tags( $form ) {

			if( ! class_exists( 'GFFormDisplay' ) ) {
				return $form;
			}

			$current_page = isset(GFFormDisplay::$submission[$form['id']]) ? GFFormDisplay::$submission[$form['id']]['page_number'] : 1;
			$fields = array();

			// get all HTML fields on the current page
			foreach($form['fields'] as &$field) {

					// skip all fields on the first page
					if(rgar($field, 'pageNumber') <= 1)
							continue;

					$default_value = rgar($field, 'defaultValue');
					preg_match_all('/{.+}/', $default_value, $matches, PREG_SET_ORDER);
					if(!empty($matches)) {
							// if default value needs to be replaced but is not on current page, wait until on the current page to replace it
							if(rgar($field, 'pageNumber') != $current_page) {
									$field['defaultValue'] = '';
							} else {
									$field['defaultValue'] = self::preview_replace_variables($default_value, $form);
							}
					}

					// only run 'content' filter for fields on the current page
					if(rgar($field, 'pageNumber') != $current_page)
							continue;

					$html_content = rgar($field, 'content');
					preg_match_all('/{.+}/', $html_content, $matches, PREG_SET_ORDER);
					if(!empty($matches)) {
							$field['content'] = self::preview_replace_variables($html_content, $form);
					}

			}

			return $form;
	}

	/**
	* Adds special support for file upload, post image and multi input merge tags.
	*/
	public static function preview_special_merge_tags($value, $input_id, $merge_tag, $field) {
			
			// added to prevent overriding :noadmin filter (and other filters that remove fields)
			if( ! $value )
					return $value;
			
			$input_type = RGFormsModel::get_input_type($field);
			
			$is_upload_field = in_array( $input_type, array('post_image', 'fileupload') );
			$is_multi_input = is_array( rgar($field, 'inputs') );
			$is_input = intval( $input_id ) != $input_id;
			
			if( !$is_upload_field && !$is_multi_input )
					return $value;

			// if is individual input of multi-input field, return just that input value
			if( $is_input )
					return $value;
					
			$form = RGFormsModel::get_form_meta($field['formId']);
			$lead = self::create_lead($form);
			$currency = GFCommon::get_currency();

			if(is_array(rgar($field, 'inputs'))) {
					$value = RGFormsModel::get_lead_field_value($lead, $field);
					return GFCommon::get_lead_field_display($field, $value, $currency);
			}

			switch($input_type) {
			case 'fileupload':
					$value = self::preview_image_value("input_{$field['id']}", $field, $form, $lead);
					$value = self::preview_image_display($field, $form, $value);
					break;
			default:
					$value = self::preview_image_value("input_{$field['id']}", $field, $form, $lead);
					$value = GFCommon::get_lead_field_display($field, $value, $currency);
					break;
			}

			return $value;
	}

	public static function preview_image_value($input_name, $field, $form, $lead) {

			$field_id = $field['id'];
			$file_info = RGFormsModel::get_temp_filename($form['id'], $input_name);
			$source = RGFormsModel::get_upload_url($form['id']) . "/tmp/" . $file_info["temp_filename"];

			if(!$file_info)
					return '';

			switch(RGFormsModel::get_input_type($field)){

					case "post_image":
							list(,$image_title, $image_caption, $image_description) = explode("|:|", $lead[$field['id']]);
							$value = !empty($source) ? $source . "|:|" . $image_title . "|:|" . $image_caption . "|:|" . $image_description : "";
							break;

					case "fileupload" :
							$value = $source;
							break;

			}

			return $value;
	}

	public static function preview_image_display($field, $form, $value) {

			// need to get the tmp $file_info to retrieve real uploaded filename, otherwise will display ugly tmp name
			$input_name = "input_" . str_replace('.', '_', $field['id']);
			$file_info = RGFormsModel::get_temp_filename($form['id'], $input_name);

			$file_path = $value;
			if(!empty($file_path)){
					$file_path = esc_attr(str_replace(" ", "%20", $file_path));
					$value = "<a href='$file_path' target='_blank' title='" . __("Click to view", "gravityforms") . "'>" . $file_info['uploaded_filename'] . "</a>";
			}
			return $value;

	}

	/**
	* Retrieves $lead object from class if it has already been created; otherwise creates a new $lead object.
	*/
	public static function create_lead( $form ) {
			
			if( empty( self::$lead ) ) {
					self::$lead = GFFormsModel::create_lead( $form );
					self::clear_field_value_cache( $form );
			}
			
			return self::$lead;
	}

	public static function preview_replace_variables( $content, $form ) {

			$lead = self::create_lead($form);

			// add filter that will handle getting temporary URLs for file uploads and post image fields (removed below)
			// beware, the RGFormsModel::create_lead() function also triggers the gform_merge_tag_filter at some point and will
			// result in an infinite loop if not called first above
			add_filter('gform_merge_tag_filter', array('GWPreviewConfirmation', 'preview_special_merge_tags'), 10, 4);

			$content = GFCommon::replace_variables($content, $form, $lead, false, false, false);

			// remove filter so this function is not applied after preview functionality is complete
			remove_filter('gform_merge_tag_filter', array('GWPreviewConfirmation', 'preview_special_merge_tags'));

			return $content;
	}
	
	public static function clear_field_value_cache( $form ) {
			
			if( ! class_exists( 'GFCache' ) )
					return;
					
			foreach( $form['fields'] as &$field ) {
					if( GFFormsModel::get_input_type( $field ) == 'total' )
							GFCache::delete( 'GFFormsModel::get_lead_field_value__' . $field['id'] );
			}
			
	}

}

GWPreviewConfirmation::init();
