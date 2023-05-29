<?php
/**
 * Does some preliminary checks before the plugin is loaded
 */

//check minimum PHP version
if ( version_compare( phpversion(), FOOBOX_MIN_PHP, "<" ) ) {
    // Show an admin notice to administrators when the minimum PHP version could not be reached.

    add_action( 'admin_notices', 	function () {
        //only show the admin message to users who can install plugins
        if ( !current_user_can('install_plugins' ) ) { return; }

        $message = __( '%s could not be initialized because you need to be running at least PHP version %s, and you are running version %s', 'foobox' );
        echo '<div class="notice notice-error">';
        echo '<p>' . sprintf( $message, '<strong>FooBox</strong>', FOOBOX_MIN_PHP, phpversion() );
        echo '</p></div>';
    } );

    return false;
}

//check minimum WordPress version
global $wp_version;
if ( version_compare( $wp_version, FOOBOX_MIN_WP, '<' ) ) {

    // Show an admin notice to administrators when the minimum WP version could not be reached
    add_action( 'admin_notices', function () {
        //only show the admin message to users who can install plugins
        if ( !current_user_can('install_plugins' ) ) { return; }

        global $wp_version;
        $message = __( '%s could not be initialized because you need WordPress to be at least version %s, and you are running version %s', 'foobox' );
        echo '<div class="notice notice-error">';
        echo '<p>' . sprintf( $message, '<strong>FooBox</strong>', FOOBOX_MIN_WP, $wp_version );
        echo '<a href="' . admin_url('update-core.php') . '">' . __( 'Update WordPress now!', 'foobox' ) . '</a>';
        echo '</p></div>';
    } );

    return false;
}

//if we got here, then we passed all startup checks and the plugin can be loaded
return true;
