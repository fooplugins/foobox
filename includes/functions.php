<?php
/**
 * Contains all the Global common functions used throughout FooBox
 */

use FooPlugins\FooBox\Admin\ContainerManager;

/**
 * Custom Autoloader used throughout FooBox
 *
 * @param $class
 */
function foobox_autoloader( $class ) {
	/* Only autoload classes from this namespace */
	if ( false === strpos( $class, FOOBOX_NAMESPACE ) ) {
		return;
	}

	/* Remove namespace from class name */
	$class_file = str_replace( FOOBOX_NAMESPACE . '\\', '', $class );

	/* Convert sub-namespaces into directories */
	$class_path = explode( '\\', $class_file );
	$class_file = array_pop( $class_path );
	$class_path = strtolower( implode( '/', $class_path ) );

	/* Convert class name format to file name format */
	$class_file = foobox_uncamelize( $class_file );
	$class_file = str_replace( '_', '-', $class_file );
	$class_file = str_replace( '--', '-', $class_file );

	/* Load the class */
	require_once FOOBOX_DIR . '/includes/' . $class_path . '/class-' . $class_file . '.php';
}

/**
 * Convert a CamelCase string to camel_case
 *
 * @param $str
 *
 * @return string
 */
function foobox_uncamelize( $str ) {
	$str    = lcfirst( $str );
	$lc     = strtolower( $str );
	$result = '';
	$length = strlen( $str );
	for ( $i = 0; $i < $length; $i ++ ) {
		$result .= ( $str[ $i ] == $lc[ $i ] ? '' : '_' ) . $lc[ $i ];
	}

	return $result;
}

/**
 * Safe way to get value from an array
 *
 * @param $key
 * @param $array
 * @param $default
 *
 * @return mixed
 */
function foobox_safe_get_from_array( $key, $array, $default ) {
	if ( is_array( $array ) && array_key_exists( $key, $array ) ) {
		return $array[ $key ];
	} else if ( is_object( $array ) && property_exists( $array, $key ) ) {
		return $array->{$key};
	}

	return $default;
}

/**
 * Safe way to get value from a multi-dimensional array
 *
 * @param $key
 * @param $array
 * @param $default
 *
 * @return mixed
 */
function foobox_safe_get_from_array_recursive( $key, $array, $default ) {
	$return = $default;

	if ( is_array( $array ) ) {
		if ( array_key_exists( $key, $array ) ){
			return $array[ $key ];
		}
		foreach ( $array as $k => $value ) {
			if ( is_array( $value ) ){
				$return = foobox_safe_get_from_array_recursive( $key, $value, $default );
				if ( $return !== $default ){
					break;
				}
			}
		}
	} else if ( is_object( $array ) ) {
		if ( property_exists( $array, $key ) ){
			return $array->{$key};
		}
		foreach ( $array as $k => $value ) {
			if ( is_object( $value ) ){
				$return = foobox_safe_get_from_array_recursive( $key, $value, $default );
				if ( $return !== $default ){
					break;
				}
			}
		}
	}
	return $return;
}

/**
 * Safe way to get value from the request object
 *
 * @param $key
 *
 * @return mixed
 */
function foobox_safe_get_from_request( $key ) {
	return foobox_safe_get_from_array( $key, $_REQUEST, null );
}

/**
 * Clean variables using sanitize_text_field. Arrays are cleaned recursively.
 * Non-scalar values are ignored.
 *
 * @param string|array $var Data to sanitize.
 *
 * @return string|array
 */
function foobox_clean( $var ) {
	if ( is_array( $var ) ) {
		return array_map( 'foobox_clean', $var );
	} else {
		return is_scalar( $var ) ? sanitize_text_field( $var ) : $var;
	}
}

/**
 * Safe way to get value from the request object
 *
 * @param $key
 * @param null $default
 * @param bool $clean
 *
 * @return mixed
 */
function foobox_safe_get_from_post( $key, $default = null, $clean = true ) {
	if ( isset( $_POST[ $key ] ) ) {
		$value = wp_unslash( $_POST[ $key ] );
		if ( $clean ) {
			return foobox_clean( $value );
		}

		return $value;
	}

	return $default;
}

/**
 * Run foobox_clean over posted textarea but maintain line breaks.
 *
 * @param string $var Data to sanitize.
 *
 * @return string
 */
function foobox_sanitize_textarea( $var ) {
	return implode( "\n", array_map( 'foobox_clean', explode( "\n", $var ) ) );
}

/**
 * Return a sanitized and unslashed key from $_GET
 *
 * @param $key
 *
 * @return string|null
 */
function foobox_sanitize_key( $key ) {
	if ( isset( $_GET[ $key ] ) ) {
		return sanitize_key( wp_unslash( $_GET[ $key ] ) );
	}

	return null;
}

/**
 * Return a sanitized and unslashed value from $_GET
 *
 * @param $key
 *
 * @return string|null
 */
function foobox_sanitize_text( $key ) {
	if ( isset( $_GET[ $key ] ) ) {
		return sanitize_text_field( wp_unslash( $_GET[ $key ] ) );
	}

	return null;
}

/**
 * Returns the menu parent slug
 *
 * @return string
 */
function foobox_get_menu_parent_slug() {
	return apply_filters( 'foobox_admin_menuparentslug', 'edit.php?post_type=' . FOOBOX_CPT_POPUP );
}

/**
 * Returns the foobox settings from options table
 */
function foobox_get_settings() {
	return get_option( FOOBOX_OPTION_DATA );
}

/**
 * Returns a specific option based on a key
 *
 * @param $key
 * @param $default
 *
 * @return mixed
 */
function foobox_get_setting( $key, $default = false ) {
	$settings = foobox_get_settings();

	return foobox_safe_get_from_array( $key, $settings, $default );
}

/**
 * Sets a specific option based on a key
 *
 * @param $key
 * @param $value
 *
 * @return mixed
 */
function foobox_set_setting( $key, $value ) {
	$settings = foobox_get_settings();
	$settings[$key] = $value;

	update_option( FOOBOX_OPTION_DATA, $settings );
}

/**
 * Returns true if foobox is in debug mode
 * @return bool
 */
function foobox_is_debug() {
	return foobox_get_setting( 'debug', false );
}

/**
 * Enqueue the core FooBox stylesheet
 */
function foobox_enqueue_stylesheet() {
	$suffix = foobox_is_debug() ? '' : '.min';
	$handle = 'foobox-core';
	$src    = apply_filters( 'foobox_stylesheet_src', FOOBOX_ASSETS_URL . 'css/foobox' . $suffix . '.css', $suffix );
	$deps   = apply_filters( 'foobox_stylesheet_deps', array() );

	wp_enqueue_style( $handle, $src, $deps, FOOBOX_VERSION );
	do_action( 'foobox_enqueue_stylesheet', $handle, $src, $deps, FOOBOX_VERSION );
}

/**
 * Enqueue the core FooBox script
 */
function foobox_enqueue_script() {
	$suffix = foobox_is_debug() ? '' : '.min';
	$handle = 'foobox-core';
	$src    = apply_filters( 'foobox_script_src', FOOBOX_ASSETS_URL . 'js/foobox' . $suffix . '.js', $suffix );
	$deps   = apply_filters( 'foobox_script_deps', array( 'jquery' ) );

	if ( foobox_get_setting( 'enqueue_polyfills', false ) ) {
		foobox_enqueue_polyfills();
		$deps[] = 'foobox-polyfills';
	}

	wp_enqueue_script( $handle, $src, $deps, FOOBOX_VERSION );
	do_action( 'foobox_enqueue_script', $handle, $src, $deps, FOOBOX_VERSION );
}

function foobox_enqueue_polyfills() {
	$suffix = foobox_is_debug() ? '' : '.min';
	$handle = 'foobox-polyfills';
	$src    = apply_filters( 'foobox_polyfills_src', FOOBOX_ASSETS_URL . 'js/foobox.polyfills' . $suffix . '.js', $suffix );
	$deps   = apply_filters( 'foobox_polyfills_deps', array() );

	wp_enqueue_script( $handle, $src, $deps, FOOBOX_VERSION );
	do_action( 'foobox_enqueue_polyfills', $handle, $src, $deps, FOOBOX_VERSION );
}

/**
 * Get the foobox admin menu parent slug
 * @return string
 */
function foobox_admin_menu_parent_slug() {
	return apply_filters( 'foobox_admin_menu_parent_slug', FOOBOX_ADMIN_MENU_PARENT_SLUG );
}

/**
 * Returns the foobox settings page Url within the admin
 *
 * @return string The Url to the foobox settings page in admin
 */
function foobox_admin_settings_url() {
	return admin_url( add_query_arg( array( 'page' => FOOBOX_ADMIN_MENU_SETTINGS_SLUG ), foobox_admin_menu_parent_slug() ) );
}

/**
 * Returns the foobox pricing page Url within the admin
 *
 * @return string The Url to the foobox pricing page in admin
 */
function foobox_admin_pricing_url() {
	return admin_url( add_query_arg( array( 'page' => FOOBOX_ADMIN_MENU_PRICING_SLUG ), foobox_admin_menu_parent_slug() ) );
}

/**
 * Returns the foobox free trial pricing page Url within the admin
 *
 * @return string The Url to the foobox free trial page in admin
 */
function foobox_admin_freetrial_url() {
	return add_query_arg( 'trial', 'true', foobox_admin_pricing_url() );
}

/**
 * Returns true if the PRO version is running
 */
function foobox_is_pro() {
	global $foobox_pro;

	if ( isset( $foobox_pro ) ) {
		return $foobox_pro;
	}

	$foobox_pro = false;

	//Check if the PRO version of foobox is running
	if ( foobox_fs()->is__premium_only() ) {
		if ( foobox_fs()->can_use_premium_code() ) {
			$foobox_pro = true;
		}
	}

	return $foobox_pro;
}


/**
 * Returns the admin post type currently being viewed/edited
 *
 * @return string|null
 */
function foobox_admin_current_post_type() {
    global $post, $typenow, $current_screen, $pagenow;

    $post_type = null;

    if ( $post && ( property_exists( $post, 'post_type' ) || method_exists( $post, 'post_type' ) ) ) {
        $post_type = $post->post_type;
    }

    if ( empty( $post_type ) && ! empty( $current_screen ) && ( property_exists( $current_screen, 'post_type' ) || method_exists( $current_screen, 'post_type' ) ) && ! empty( $current_screen->post_type ) ) {
        $post_type = $current_screen->post_type;
    }

    if ( empty( $post_type ) && ! empty( $typenow ) ) {
        $post_type = $typenow;
    }

    if ( empty( $post_type ) && function_exists( 'get_current_screen' ) ) {
        $get_current_screen = get_current_screen();
        if ( is_object( $get_current_screen ) && property_exists( $get_current_screen, 'post_type' ) && ! empty( $get_current_screen->post_type ) ) {
            $post_type = $get_current_screen->post_type;
        }
    }

    if ( empty( $post_type ) && isset( $_REQUEST['post'] ) && ! empty( $_REQUEST['post'] ) && function_exists( 'get_post_type' ) && $get_post_type = get_post_type( (int) $_REQUEST['post'] ) ) {
        $post_type = $get_post_type;
    }

    if ( empty( $post_type ) && isset( $_REQUEST['post_type'] ) && ! empty( $_REQUEST['post_type'] ) ) {
        $post_type = sanitize_key( $_REQUEST['post_type'] );
    }

    if ( empty( $post_type ) && 'edit.php' == $pagenow ) {
        $post_type = 'post';
    }

    return $post_type;
}

/**
 * Returns true if current admin page is an edit page
 * @return bool
 */
function foobox_admin_is_edit_mode() {
    global $pagenow;

    return in_array( $pagenow, array( 'post.php', 'post-new.php' ) );
}

/**
 * Returns true if current admin page is the listing page
 * @return bool
 */
function foobox_admin_is_list_mode() {
    global $pagenow;

    return $pagenow === 'edit.php';
}

function foobox_admin_is_popup_list() {
    if ( wp_doing_ajax() && isset( $_REQUEST['action'] ) ) {
        return $_REQUEST['action'] === 'foobox_admin_preview' ||
            $_REQUEST['action'] === 'foobox_admin_clone';
    }
    return foobox_admin_current_post_type() === FOOBOX_CPT_POPUP && foobox_admin_is_list_mode();
}

function foobox_admin_is_popup_edit() {
    if ( foobox_admin_current_post_type() === FOOBOX_CPT_POPUP && foobox_admin_is_edit_mode() ) {
        return true;
    } else if ( defined( 'DOING_AJAX' ) && DOING_AJAX ) {

        $action = foobox_safe_get_from_request( 'action' );

        if ( $action === 'heartbeat' ) {
            return false;
        }

        $post_type = foobox_container_manager()->get_post_type_from_ajax_request();

        return FOOBOX_CPT_POPUP === $post_type;
    }
    return false;
}

function foobox_container_manager() {
    return ContainerManager::get_manager( FOOBOX_SLUG );
}

///**
// * Gets the post_type from the ajax request within the admin
// *
// * @return false|string
// */
//function foobox_admin_get_post_type_from_ajax_request() {
//    global $foofields_post_type_from_ajax_request;
//
//    if ( isset( $foofields_post_type_from_ajax_request ) ) {
//        return $foofields_post_type_from_ajax_request;
//    }
//
//    $referrer = wp_get_raw_referer();
//    parse_str( parse_url( $referrer, PHP_URL_QUERY), $query );
//
//    //we know we came from an edit post page
//    if ( isset( $query['post'] ) && isset( $query['action'] ) && $query['action'] === 'edit') {
//        $post_id = intval( $query['post'] );
//
//        if ( $post_id > 0 ) {
//            return $foofields_post_type_from_ajax_request = get_post_type( $post_id );
//        }
//    }
//
//    return false;
//}