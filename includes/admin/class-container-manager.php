<?php
namespace FooPlugins\FooBox\Admin;

use FooPlugins\FooBox\Admin\FooFields\Manager;

/**
 * FooBox FooFields Manager Class
 */

if ( !class_exists( 'FooPlugins\FooBox\Admin\ContainerManager' ) ) {

	class ContainerManager extends Manager {

		public function __construct() {
			parent::__construct( array(
				'id'             => FOOBOX_SLUG,
				'text_domain'    => FOOBOX_SLUG,
				'plugin_url'     => FOOBOX_URL,
				'plugin_version' => FOOBOX_VERSION
			) );
		}
	}
}
