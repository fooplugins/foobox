<?php
/**
 * FooBox Init Class
 * Runs at the startup of the plugin
 * Assumes after all checks have been made, and all is good to go!
 *
 * @package FooPlugins\FooBox
 */

namespace FooPlugins\FooBox;

if ( ! class_exists( 'FooPlugins\FooBox\Init' ) ) {

	/**
	 * Class Init
	 *
	 * @package FooPlugins\FooBox
	 */
	class Init {

		/**
		 * Initialize the plugin by setting localization, filters, and administration functions.
		 */
		public function __construct() {
			// Load the plugin text domain.
			add_action( 'init', function() {
				$plugin_rel_path = dirname( plugin_basename( FOOBOX_FILE ) ) . '/languages/';
				load_plugin_textdomain( FOOBOX_SLUG, false, $plugin_rel_path );
			} );

			new namespace\PostTypes\Popup();

			if ( is_admin() ) {
				new namespace\Admin\Init();
			} else {
				//new namespace\Front\Init();
			}

			// Check if the PRO version is running and run the PRO code.
			if ( foobox_is_pro() ) {
				//new namespace\Pro\Init();
			} else {
				if ( is_admin() ) {
					// Include PRO promotions.
					new namespace\Admin\Promotions();
				}
			}
		}
	}
}
