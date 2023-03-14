<?php
/**
 * Plugin Name: FooBox (DEV)
 * Description: The best responsive lightbox for WordPress
 * Author: FooPlugins
 * Author URI: https://fooplugins.com
 * Version: 1.0.0
 * License: GPL2+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain: foobox
 * Domain Path: /languages/
 *
 * @package foobox
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'FOOBOX_PATH', plugin_dir_path( __FILE__ ), false );
define( 'FOOBOX_URL', plugin_dir_url( __FILE__ ), false );