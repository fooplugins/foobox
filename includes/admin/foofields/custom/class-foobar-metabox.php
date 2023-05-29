<?php

namespace FooPlugins\FooBox\Admin\FooFields\Custom;

use FooPlugins\FooBox\Admin\FooFields\Metabox;
use FooPlugins\FooBox\Admin\FooFields\Custom\Conditions\Field as Conditions;

if ( ! class_exists( __NAMESPACE__ . '\FooboxMetabox' ) ) {

	class FooboxMetabox extends Metabox {
		function __construct( $config ) {
			parent::__construct( $config );

			$this->add_filter( 'field_type_mappings', array( $this, 'foobox_field_type_mappings' ) );
		}

		function foobox_field_type_mappings( $mappings ) {
			$mappings['icon-picker'] = __NAMESPACE__ . '\IconPicker';
			$mappings['time-selector'] = __NAMESPACE__ . '\TimeSelector';
			$mappings['numeric'] = __NAMESPACE__ . '\Numeric';
			$mappings['blurb'] = __NAMESPACE__ . '\Blurb';
			$mappings['button'] = __NAMESPACE__ . '\Button';

			$mappings = Conditions::register_mappings( $mappings );

			return $mappings;
		}
	}
}
