<?php
namespace FooPlugins\FooBox\Admin;

/**
 * FooBox Admin Init Class
 * Runs all classes that need to run in the admin
 */

if ( !class_exists( 'FooPlugins\FooBox\Admin\Init' ) ) {

	class Init {

		/**
		 * Init constructor.
		 */
		function __construct() {
            new namespace\Help();
            new namespace\ContainerManager();
            new namespace\Settings();
            new namespace\Promotions();

			if ( foobox_admin_is_popup_edit() ) {
                //new up metabox classes
				//new namespace\Popup\Metabox\Types();
				if ( foobox_is_debug() ) {
					//new namespace\Popup\Metabox\Debug();
				}
			}

			if ( foobox_admin_is_popup_list() ) {
				//new namespace\Notification\Columns();
				//new namespace\Notification\Preview();
				//new namespace\Notification\Duplicate();
			}
		}
	}
}
