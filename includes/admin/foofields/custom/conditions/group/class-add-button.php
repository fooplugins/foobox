<?php
namespace FooPlugins\FooBox\Admin\FooFields\Custom\Conditions\Group;

use FooPlugins\FooBox\Admin\FooFields\Fields\Field;

if ( ! class_exists( __NAMESPACE__ . '\AddButton' ) ) {

	class AddButton extends Field {

		protected $add_title;

		function __construct( $container, $type, $field_config ) {
			parent::__construct( $container, $type, $field_config );

			$this->add_title = isset( $field_config['add_title'] ) ? $field_config['add_title'] : __( 'Add Condition', $container->manager->text_domain );
		}

		/**
		 * Render the add button field
		 *
		 * @param bool $override_attributes
		 */
		function render_input( $override_attributes = false ) {
			self::render_html_tag( 'a', array(
				'class' => 'foofields-conditions-button foofields-conditions-group-add',
				'href' => '#add',
				'title' => $this->add_title
			), null, false );
			self::render_html_tag('span', array( 'class' => 'dashicons dashicons-plus' ) );
			echo '</a>';
		}
	}
}
