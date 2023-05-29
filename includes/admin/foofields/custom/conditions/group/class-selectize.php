<?php

namespace FooPlugins\FooBox\Admin\FooFields\Custom\Conditions\Group;

use FooPlugins\FooBox\Admin\FooFields\Fields\Field;

if ( ! class_exists( __NAMESPACE__ . '\Selectize' ) ) {

	class Selectize extends Field {
		/**
		 * Render the conditions group selectize field
		 *
		 * @param $override_attributes
		 */
		function render_input( $override_attributes = false ) {
			$inner = '';

			$values = $this->value();

			$attributes = array(
				'id'          => $this->unique_id,
				'name'        => $this->name . '[]'
			);

			//check if we have values
			if ( is_array( $values ) ) {
				$attributes['data-selectize'] = $this->container->json_encode( array( 'items' => $values ) );
			}

			self::render_html_tag( 'select', $attributes, $inner, true, false );
		}
	}

}
