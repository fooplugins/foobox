<?php

namespace FooPlugins\FooBox\Admin;

use FooPlugins\FooBox\Admin\FooFields\SettingsPage;

/**
 * FooBox Admin Settings Class
 */

if ( ! class_exists( 'FooPlugins\FooBox\Admin\Settings' ) ) {

	class Settings extends SettingsPage {

		public function __construct() {
			parent::__construct(
					array(
							'manager'          => FOOBOX_SLUG,
							'settings_id'      => FOOBOX_SLUG,
							'page_title'       => __( 'FooBox Settings', 'foobox' ),
							'menu_title'       => __( 'Settings', 'foobox' ),
							'menu_parent_slug' => foobox_get_menu_parent_slug(),
							'layout'           => 'foofields-tabs-horizontal'
					)
			);
		}

		function get_tabs() {
			$general_tab = array(
					'id'     => 'general',
					'label'  => __( 'General', 'foobox' ),
					'icon'   => 'dashicons-admin-settings',
					'order'  => 10,
					'fields' => array(
							array(
									'id'    => 'always_enqueue',
									'type'  => 'checkbox',
									'label' => __( 'Always Enqueue Assets', 'foobox' ),
									'desc'  => __( 'By default, FooBox javascript and stylesheet assets are only enqueued in your pages when needed. Some themes always need these assets in order to function.', 'foobox' )
							),
							array(
									'id'    => 'enqueue_polyfills',
									'type'  => 'checkbox',
									'label' => __( 'Enqueue Polyfills', 'foobox' ),
									'desc'  => __( 'FooBox uses modern JavaScript API\'s which may not be supported in older browsers. Enable the enqueueing of polyfills for better backwards compatibility.', 'foobox' )
							),
							array(
									'id'    => 'debug',
									'type'  => 'checkbox',
									'label' => __( 'Enable Debug Mode', 'foobox' ),
									'desc'  => __( 'Helps to debug problems and diagnose issues. Enable debugging if you need support for an issue you are having.', 'foobox' )
							)
					)
			);

			$advanced_tab = array(
					'id'     => 'advanced',
					'label'  => __( 'Advanced', 'foobox' ),
					'icon'   => 'dashicons-admin-generic',
					'order'  => 50,
					'fields' => array(
							array(
									'id'    => 'demo_content',
									'type'  => 'checkbox',
									'label' => __( 'Demo Content Created', 'foobox' ),
									'desc'  => __( 'If the demo content has been created, then this will be checked. You can uncheck this to allow for demo content to be created again.', 'foobox' )
							)
					)
			);

			if ( !foobox_is_pro() ) {
				$advanced_tab['fields'][] = array(
						'id'      => 'force_hide_trial',
						'label'   => __( 'Force Hide Trial Notice', 'foogallery' ),
						'desc'    => __( 'Force the trial notice admin banner to never show. If you find that even after dismissing the trial notice that it shows up again, you can enable this setting to make sure it is never shown again!', 'foogallery' ),
						'type'    => 'checkbox',
						'tab'     => 'advanced'
				);
			}

			$system_info_tab = array(
					'id'     => 'systeminfo',
					'label'  => __( 'System Info', 'foobox' ),
					'icon'   => 'dashicons-info',
					'order'  => 100,
					'fields' => array(
							array(
									'id'    => 'systeminfoheading',
									'label' => __( 'Your System Information', 'foobox' ),
									'desc'  => __( 'The below system info can be used when submitting a support ticket, to help us replicate your environment.', 'foobox' ),
									'type'  => 'heading',
							),
							array(
									'id'     => 'systeminfodetail',
									'layout' => 'inline',
									'type'   => 'system_info',
									'render' => array( $this, 'render_system_info' )
							)
					)
			);

			return apply_filters( 'foobox_admin_settings', array(
				$general_tab,
				$advanced_tab,
				$system_info_tab,
			) );
		}

		/**
		 * Render some system info
		 *
		 * @param $field
		 */
		function render_system_info( $field ) {
			global $wp_version;

			$current_theme = wp_get_theme();

			$settings = foobox_get_settings();

			//get all activated plugins
			$plugins = array();
			foreach ( get_option( 'active_plugins' ) as $plugin_slug => $plugin ) {
				$plugins[] = $plugin;
			}

			$debug_info = array(
					__( 'FooBox version', 'foobox' )    => FOOBOX_VERSION,
					__( 'WordPress version', 'foobox' ) => $wp_version,
					__( 'Activated Theme', 'foobox' )   => $current_theme['Name'],
					__( 'WordPress URL', 'foobox' )     => get_site_url(),
					__( 'PHP version', 'foobox' )       => phpversion(),
					__( 'Settings', 'foobox' )          => $settings,
					__( 'Active Plugins', 'foobox' )    => $plugins
			);
			?>
			<style>
				.foobox-debug {
					width: 100%;
					font-family: "courier new";
					height: 500px;
				}
			</style>
			<textarea class="foobox-debug"><?php foreach ( $debug_info as $key => $value ) {
					echo esc_html( $key ) . ' : ';
					print_r( $value );
					echo "\n";
				} ?></textarea>
			<?php
		}
	}
}
