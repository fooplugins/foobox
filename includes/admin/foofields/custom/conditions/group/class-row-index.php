<?php
namespace FooPlugins\FooBox\Admin\FooFields\Custom\Conditions\Group;

use FooPlugins\FooBox\Admin\FooFields\Fields\Field;

if ( ! class_exists( __NAMESPACE__ . '\RowIndex' ) ) {

	class RowIndex extends Field {

		protected $format;
		protected $row_index;

		function __construct( $container, $type, $field_config ) {
			parent::__construct( $container, $type, $field_config );

			$this->format = isset( $field_config['format'] ) ? $field_config['format'] : __( '{count}', $container->manager->text_domain );
			$this->row_index = intval( isset( $field_config['row_index'] ) ? $field_config['row_index'] : -1 );
		}

		function data_attributes() {
			$data_attributes =  parent::data_attributes();
			$data_attributes['format'] = $this->format;
			return $data_attributes;
		}

		/**
		 * Render the ajax button field
		 *
		 * @param bool $override_attributes
		 */
		function render_input( $override_attributes = false ) {
			$patterns = array('/{index}/','/{count}/');
			$replacements = array($this->row_index, $this->row_index+1);
			echo preg_replace($patterns, $replacements, $this->format);
		}
	}
}
