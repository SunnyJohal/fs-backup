<?php
/**
 * App Controller
 *
 * @package titanium_theme
 * @since 1.0.0
 * @version 1.0.0
 */

namespace App;

use Sober\Controller\Controller;

/**
 * Class: App
 *
 * Controller class to define variables
 * to make available to the app
 * blade template.
 *
 * @since 1.0.0
 * @version 1.0.0
 */
class App extends Controller {
	/**
	 * Get Site Name
	 *
	 * @return string - Site name
	 */
	public function site_name() {
		return get_bloginfo( 'name' );
	}

	/**
	 * Get the Title
	 *
	 * Returns the appropriate title based
	 * on the current context.
	 *
	 * @return string $title
	 */
	public static function title() {
		if ( is_home() ) {
			$home = get_option( 'page_for_posts', true );

			if ( $home ) {
				return get_the_title( $home );
			}
			return __( 'Latest Posts', 'titanium' );
		}

		if ( is_archive() ) {
			return get_the_archive_title();
		}

		if ( is_search() ) {
			// translators: search results title, prepends the query.
			return sprintf( __( 'Search Results for %s', 'titanium' ), get_search_query() );
		}

		if ( is_404() ) {
			return __( 'Not Found', 'titanium' );
		}
		return get_the_title();
	}
}
