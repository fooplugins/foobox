<?php
/**
 * Runs all the Freemius initialization code
 */

if ( ! function_exists( 'foobox_fs' ) ) {
	// Create a helper function for easy SDK access.
	function foobox_fs() {
		global $foobox_fs;

		if ( ! isset( $foobox_fs ) ) {
			// Activate multisite network integration.
			if ( ! defined( 'WP_FS__PRODUCT_6696_MULTISITE' ) ) {
				define( 'WP_FS__PRODUCT_6696_MULTISITE', true );
			}

			// Include Freemius SDK.
			require_once FOOBOX_PATH . '/freemius/start.php';

			$pro_available = true;
			$has_addons = false;

			if ( defined( 'FOOBOX_PRO_AVAILABLE' ) ) {
				$pro_available = FOOBOX_PRO_AVAILABLE;
			}
			if ( defined( 'FOOBOX_ADDONS_AVAILABLE' ) ) {
				$has_addons = FOOBOX_ADDONS_AVAILABLE;
			}

			$foobox_fs = fs_dynamic_init( array(
				'id'                  => '6696',
				'slug'                => 'foobox-image-lightbox',
				'premium_slug'        => 'foobox-premium',
				'type'                => 'plugin',
				'public_key'          => 'pk_66340abdc312fe16c68bd10b41948',
				'is_premium'          => $pro_available,
				'has_premium_version' => $pro_available,
				'has_addons'          => $has_addons,
				'has_paid_plans'      => $pro_available,
				'trial'               => array(
					'days'               => 7,
					'is_require_payment' => true,
				),
				'menu'           => array(
					'slug'       => FOOBOX_ADMIN_MENU_PARENT_SLUG,
					'first-path' => FOOBOX_ADMIN_MENU_PARENT_SLUG . '&page=' . FOOBOX_ADMIN_MENU_HELP_SLUG,
					'account'    => $pro_available || $has_addons,
					'contact'    => false,
					'support'    => false,
				),
			) );
		}

		return $foobox_fs;
	}

	// Init Freemius.
	foobox_fs();
	// Signal that SDK was initiated.
	do_action( 'foobox_fs_loaded' );

	foobox_fs()->add_filter( 'plugin_icon',	function ( $icon ) {
		return FOOBOX_PATH . 'assets/img/foobox-image-lightbox.jpg';
	}, 10, 1 );
}
