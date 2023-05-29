<?php
namespace FooPlugins\FooBox\PostTypes;

/*
 * Popup Custom Post Type
 */

if ( ! class_exists( 'FooPlugins\FooBox\PostTypes\Popup' ) ) {

	class Popup {

		function __construct() {
			//register the post types
			add_action( 'init', array( $this, 'register' ) );
		}

		function register() {
			//allow others to override the Popup post type register args
			//see all available args : https://developer.wordpress.org/reference/functions/register_post_type/
			$args = apply_filters( 'foobox_posttypes_popup_registerargs',
				array(
					'labels'        => array(
						'name'               => __( 'Popups', 'foobox' ),
						'singular_name'      => __( 'Popup', 'foobox' ),
						'add_new'            => __( 'Add Popup', 'foobox' ),
						'add_new_item'       => __( 'Add New Popup', 'foobox' ),
						'edit_item'          => __( 'Edit Popup', 'foobox' ),
						'new_item'           => __( 'New Popup', 'foobox' ),
						'view_item'          => __( 'View Popups', 'foobox' ),
						'search_items'       => __( 'Search Popups', 'foobox' ),
						'not_found'          => __( 'No Popups found', 'foobox' ),
						'not_found_in_trash' => __( 'No Popups found in Trash', 'foobox' ),
						'menu_name'          => __( 'FooBox', 'foobox' ),
						'all_items'          => __( 'Popups', 'foobox' )
					),
					'hierarchical'  => false,
					'public'        => false,
					'rewrite'       => false,
					'show_ui'       => true,
					'show_in_menu'  => true,
					'menu_icon'     => 'dashicons-grid-view',
					'supports'      => array( 'title' )
				)
			);

			register_post_type( FOOBOX_CPT_POPUP, $args );
		}
	}
}
