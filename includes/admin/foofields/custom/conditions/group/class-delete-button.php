<?php
namespace FooPlugins\FooBox\Admin\FooFields\Custom\Conditions\Group;

use FooPlugins\FooBox\Admin\FooFields\Fields\Field;

if ( ! class_exists( __NAMESPACE__ . '\DeleteButton' ) ) {

	class DeleteButton extends Field {

		protected $delete_confirmation_message;
		protected $delete_title;

		function __construct( $container, $type, $field_config ) {
			parent::__construct( $container, $type, $field_config );

			$this->delete_confirmation_message = isset( $field_config['delete_confirmation_message'] ) ? $field_config['delete_confirmation_message'] : __( 'Are you sure?', $container->manager->text_domain );
			$this->delete_title = isset( $field_config['delete_title'] ) ? $field_config['delete_title'] : __( 'Delete Condition', $container->manager->text_domain );
		}

		/**
		 * Render the delete button field
		 *
		 * @param bool $override_attributes
		 */
		function render_input( $override_attributes = false ) {
			self::render_html_tag( 'a', array(
				'class' => 'foofields-conditions-button foofields-conditions-group-delete',
				'href' => '#delete',
				'data-confirm' => $this->delete_confirmation_message,
				'title' => $this->delete_title
			), null, false );
			self::render_html_tag('span', array( 'class' => 'dashicons dashicons-trash' ) );
			echo '</a>';
		}
	}
}
