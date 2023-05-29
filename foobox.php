<?php
/**
 * Plugin Name: FooBox V3
 * Description: The best responsive lightbox for WordPress
 * Author: FooPlugins
 * Author URI: https://fooplugins.com
 * Version: 3.0.0
 * License: GPL2+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain: foobox
 * Domain Path: /languages/
 *
 * @package foobox
 *
 * @fs_premium_only /pro/
 *
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
    die;
}

// Define some essentials constants.
if ( ! defined( 'FOOBOX_SLUG' ) ) {
    define( 'FOOBOX_SLUG', 'foobox' );
    define( 'FOOBOX_NAMESPACE', 'FooPlugins\FooBox' );
    define( 'FOOBOX_DIR', __DIR__ );
    define( 'FOOBOX_PATH', plugin_dir_path( __FILE__ ) );
    define( 'FOOBOX_URL', plugin_dir_url( __FILE__ ) );
    define( 'FOOBOX_ASSETS_URL', FOOBOX_URL . 'assets/' );
    define( 'FOOBOX_FILE', __FILE__ );
    define( 'FOOBOX_VERSION', '2.1.30' );
    define( 'FOOBOX_MIN_PHP', '5.6.0' ); // Minimum of PHP 5.4 required for autoloading, namespaces, etc.
    define( 'FOOBOX_MIN_WP', '4.4.0' );  // Minimum of WordPress 4.4 required.
}

// Include other essential constants.
require_once FOOBOX_PATH . 'includes/constants.php';

// Include common global functions.
require_once FOOBOX_PATH . 'includes/functions.php';

// Do a check to see if either free/pro version of the plugin is already running.
if ( function_exists( 'foobox_fs' ) ) {
    foobox_fs()->set_basename( true, __FILE__ );
} else {
    if ( ! function_exists( 'foobox_fs' ) ) {
        require_once FOOBOX_PATH . 'includes/freemius.php';
    }
}

// Check minimum requirements before loading the plugin.
if ( require_once FOOBOX_PATH . 'includes/startup-checks.php' ) {

    // Start autoloader.
    require_once FOOBOX_PATH . 'vendor/autoload.php';

    spl_autoload_register( 'foobox_autoloader' );

    // Hook in activation.
    register_activation_hook( __FILE__, array( 'FooPlugins\FooBox\Activation', 'activate' ) );

    // Start the plugin!
    new FooPlugins\FooBox\Init();
}
