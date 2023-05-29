<?php
/**
 * Contains the Global constants used throughout FooBox
 */

//options
define( 'FOOBOX_OPTION_DATA', 'foobox-settings' );

//transients
define( 'FOOBOX_TRANSIENT_UPDATED', 'foobox_updated' );
define( 'FOOBOX_TRANSIENT_ACTIVATION_REDIRECT', 'foobox_redirect' );

//custom post types
define( 'FOOBOX_CPT_POPUP', 'foobox_popup' );

//other
define( 'FOOBOX_ADMIN_MENU_PARENT_SLUG', 'edit.php?post_type=' . FOOBOX_CPT_POPUP );
define( 'FOOBOX_ADMIN_MENU_HELP_SLUG', 'foobox-help' );
define( 'FOOBOX_ADMIN_MENU_PRICING_SLUG', 'foobox-image-lightbox-pricing' );
define( 'FOOBOX_ADMIN_MENU_SETTINGS_SLUG', 'foobox-settings' );
