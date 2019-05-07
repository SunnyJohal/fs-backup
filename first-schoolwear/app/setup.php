<?php
/**
 * Theme Setup
 *
 * Enqueues scripts and styles and declares
 * any features that the theme supports.
 *
 * @package titanium_theme
 * @since 1.0.0
 * @version 1.0.0
 */

namespace App;

use Roots\Sage\Container;
use Roots\Sage\Assets\JsonManifest;
use Roots\Sage\Template\Blade;
use Roots\Sage\Template\BladeProvider;

/**
 * Register custom fonts.
 */
function get_fonts_url() {
	$fonts_url = '';

	/*
	 * Translators: If there are characters in your language that are not
	 * supported by Libre Franklin, translate this to 'off'. Do not translate
	 * into your own language.
	 */
	$roboto = _x( 'on', 'Roboto font: on or off', 'titanium' );

	if ( 'off' !== $roboto ) {
		$font_families = [];

		$font_families[] = 'Poppins:400,500,600';
		$font_families[] = 'Source+Sans+Pro:400,400italic,600';

		$query_args = [
			'family' => implode( '|', $font_families ),
			'subset' => rawurlencode( 'latin,latin-ext' ),
		];

		$fonts_url = add_query_arg( $query_args, 'https://fonts.googleapis.com/css' );
	}

	return esc_url_raw( $fonts_url );
}

/**
 * Enqueue Theme Assets
 *
 * Enqueue the css and the js for the
 * theme.
 *
 * @since 1.0.0
 * @version 1.0.0
 */
add_action('wp_enqueue_scripts', function() {
	// Enqueue theme styles.
	wp_enqueue_style( 'theme/fonts.css', get_fonts_url(), false, null );
	wp_enqueue_style( 'theme/icons.css', 'https://fonts.googleapis.com/icon?family=Material+Icons', false, null );
	wp_enqueue_style( 'sage/main.css', asset_path( 'styles/main.css' ), false, null );

	// Enqueue theme scripts.
	wp_enqueue_script( 'sage/main.js', asset_path( 'scripts/main.js' ), [ 'jquery' ], null, true );
}, 5);

/**
 * School Order Form Inline Scripts
 * 
 * @since 1.0.0
 * @version 1.0.0
 */
add_action('wp_enqueue_scripts', function() {
	if ( ! is_singular( 'fs_school' ) ) {
		return;
	}
	?>
	<script type="text/javascript">
		function gform_format_option_label( fullLabel, fieldLabel, priceLabel, selectedPrice, price, formId, fieldId ) {
			return fieldLabel;
		}
	</script>
	<?php
}, 10);

/**
 * Theme setup
 */
add_action('after_setup_theme', function () {
	/**
	 * Enable features from Soil when plugin is activated
	 *
	 * @link https://roots.io/plugins/soil/
	 */
	add_theme_support( 'soil-clean-up' );
	add_theme_support( 'soil-jquery-cdn' );
	add_theme_support( 'soil-nav-walker' );
	add_theme_support( 'soil-nice-search' );
	add_theme_support( 'soil-relative-urls' );

	/**
	 * Enable features from Woocommerce when plugin is activated
	 *
	 * @link https://roots.io/plugins/soil/
	 */
	add_theme_support( 'woocommerce' );

	/**
	 * Enable custom logo support
	 *
	 * @link https://developer.wordpress.org/themes/functionality/custom-logo/
	 */
	add_theme_support( 'custom-logo' );

	/**
	 * Enable custom header support
	 *
	 * @link https://developer.wordpress.org/themes/functionality/custom-headers/#add-custom-header-support-to-your-theme
	 */
	add_theme_support( 'custom-header' );
	add_theme_support( 'custom-background' );

	/**
	 * Enable plugins to manage the document title
	 *
	 * @link https://developer.wordpress.org/reference/functions/add_theme_support/#title-tag
	 */
	add_theme_support( 'title-tag' );

	/**
	 * Register navigation menus
	 *
	 * @link https://developer.wordpress.org/reference/functions/register_nav_menus/
	 */
	register_nav_menus([
		'primary_navigation' => __( 'Primary Navigation', 'titanium' ),
		'footer_navigation'  => __( 'Footer Navigation', 'titanium' ),
	]);

	/**
	 * Enable post thumbnails
	 *
	 * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
	 */
	add_theme_support( 'post-thumbnails' );

	/**
	 * Enable HTML5 markup support
	 *
	 * @link https://developer.wordpress.org/reference/functions/add_theme_support/#html5
	 */
	add_theme_support( 'html5', [ 'caption', 'comment-form', 'comment-list', 'gallery', 'search-form' ] );

	/**
	 * Enable selective refresh for widgets in customizer
	 *
	 * @link https://developer.wordpress.org/themes/advanced-topics/customizer-api/#theme-support-in-sidebars
	 */
	add_theme_support( 'customize-selective-refresh-widgets' );

	/**
	 * Use main stylesheet for visual editor
	 *
	 * @see resources/assets/styles/layouts/_tinymce.scss
	 */
	add_editor_style( asset_path( 'styles/main.css' ) );
}, 20);

/**
 * Register sidebars
 */
add_action('widgets_init', function () {
	$config = [
		'before_widget' => '<section class="widget %1$s %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<h3>',
		'after_title'   => '</h3>',
	];
	register_sidebar([
		'name' => __( 'Primary', 'titanium' ),
		'id'   => 'sidebar-primary',
	] + $config);
});

/**
 * Updates the `$post` variable on each iteration of the loop.
 * Note: updated value is only available for subsequently loaded views, such as partials
 */
add_action( 'the_post', function( $post ) {
	sage( 'blade' )->share( 'post', $post );
});

/**
 * Setup Sage options
 */
add_action( 'after_setup_theme', function () {
	/**
	 * Add JsonManifest to Sage container
	 */
	sage()->singleton('sage.assets', function () {
		return new JsonManifest( config( 'assets.manifest' ), config( 'assets.uri' ) );
	});

	/**
	 * Add Blade to Sage container
	 */
	sage()->singleton('sage.blade', function ( Container $app ) {
		$cache_path = config( 'view.compiled' );

		if ( ! file_exists( $cache_path ) ) {
			wp_mkdir_p( $cache_path );
		}

		(new BladeProvider( $app ))->register();
		return new Blade( $app['view'] );
	});

	/**
	 * Create @asset() Blade directive
	 */
	sage( 'blade' )->compiler()->directive('asset', function ( $asset ) {
		return '<?= ' . __NAMESPACE__ . "\\asset_path({$asset}); ?>";
	});
});
