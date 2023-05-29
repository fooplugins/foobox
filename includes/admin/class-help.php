<?php
namespace FooPlugins\FooBox\Admin;

/**
 * FooBox Help Page Class
 */

if ( !class_exists( 'FooPlugins\FooBox\Admin\Help' ) ) {

	class Help {

		public function __construct() {
			add_action( 'admin_menu', array( $this, 'add_menu' ) );
		}

		/**
		 * Add menu to the tools menu
		 */
		public function add_menu() {
			add_submenu_page(
				foobox_get_menu_parent_slug(),
				__( 'FooBox Help' , 'foobox' ),
				__( 'Help' , 'foobox' ),
				'manage_options',
				'foobox-help',
				array( $this, 'render_page' )
			);
		}

		/**
		 * Renders the contents of the page
		 */
		public function render_page() {
			require_once FOOBOX_PATH . 'includes/admin/views/help.php';
		}

		/**
		 * Create the demos by inserting notifications posts
		 */
		function import_demos() {
			if ( check_admin_referer( 'foobox_admin_import_demos' ) ) {
				//$demo_content = foobox_get_admin_demo_content();

				$count = 0;

//				foreach ( $demo_content as $demo ) {
//					//create the post
//					$error = wp_insert_post( $demo, true );
//
//					if ( !is_wp_error( $error ) ) {
//						$count++;
//					}
//				}

				//foobox_set_setting( 'demo_content', 'on' );

				echo sprintf( __( '%s demos created successfully', 'foobox' ), $count );
			}
			die();
		}
	}
}
