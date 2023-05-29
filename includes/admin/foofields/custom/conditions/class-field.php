<?php

namespace FooPlugins\FooBox\Admin\FooFields\Custom\Conditions;

use FooPlugins\FooBox\Admin\FooFields\Custom\Conditions\Group\Field as ConditionsGroup;
use FooPlugins\FooBox\Admin\FooFields\Container;
use FooPlugins\FooBox\Pro\Visibility\Engine;
use WP_User;

if ( ! class_exists( __NAMESPACE__ . '\Field' ) ) {

	class Field extends \FooPlugins\FooBox\Admin\FooFields\Fields\Field {

		protected $separator;
		protected $add_button_text;
		protected $no_data_message;
		protected $help_message;
		protected $table_class;
		protected $fields;
		protected $show_header;
		protected $show_index;
		protected $callback;

		/**
		 * Field constructor.
		 *
		 * @param $container Container
		 * @param $type string
		 * @param $field_config array
		 */
		function __construct( $container, $type, $field_config ) {
			parent::__construct( $container, $type, $field_config );

			$this->separator = isset( $field_config['separator'] ) ? $field_config['separator'] : __( '— OR —', $container->manager->text_domain );
			$this->add_button_text = isset( $field_config['add_button_text'] ) ? $field_config['add_button_text'] : __( 'Add Group', $container->manager->text_domain );
			$this->no_data_message = isset( $field_config['no_data_message'] ) ? $field_config['no_data_message'] : __( 'Please add at least one group of conditions!', $container->manager->text_domain );
			$this->help_message = isset( $field_config['help_message'] ) ? $field_config['help_message'] : __( 'I want to show the notification when:', $container->manager->text_domain );
			$this->table_class = isset( $field_config['table_class'] ) ? $field_config['table_class'] : false;
			$this->show_header = isset( $field_config['show_header'] ) ? $field_config['show_header'] : false;
			$this->show_index = isset( $field_config['show_index'] ) ? $field_config['show_index'] : false;

			$this->fields = $this->create_conditions_fields();

			//handle ajax selectize fields
			add_action( $this->field_ajax_action_name(), array( $this, 'ajax_handle_conditions' ) );
		}

		static function register_mappings( $mappings ){
			$mappings['conditions'] = __NAMESPACE__ . '\Field';
			$mappings['conditions-index'] = __NAMESPACE__ . '\RowIndex';
			$mappings['conditions-delete'] = __NAMESPACE__ . '\DeleteButton';

			return ConditionsGroup::register_mappings( $mappings );
		}

		function create_conditions_fields(){
			$fields = array();

			if ( $this->show_index ){
				$fields[] = array(
					'id' => '_index',
					'type' => 'conditions-index'
				);
			}

			$group_field = array(
				'id' => 'group',
				'type' => 'conditions-group',
				'groups' => Engine::get_instance()->build_group_array(),
				'operators' => Engine::get_instance()->build_operator_array()
			);
			$fields[] = $group_field;

			return $fields;
		}

		/**
		 * Ajax handler for conditions fields
		 */
		function ajax_handle_conditions() {
			if ( $this->verify_nonce() ) {
				$query = $this->safe_get_from_request( 'q' );
				$type = $this->safe_get_from_request( 'type' );
				$operator = $this->safe_get_from_request( 'operator' );

				$condition = Engine::get_instance()->get_condition( $type );

				if ( $condition !== false ) {
					wp_send_json( array(
						'results' => $condition->values( $query )
					) );
				}

				wp_send_json_error( __( 'Invalid condition!', 'foobox' ), 400 );
			}
		}

		/**
		 * Override the data attributes
		 * @return array
		 */
		function data_attributes() {
			$data_attributes = parent::data_attributes();
			$data_attributes['data-query'] = build_query( array(
				'action'     => $this->field_action_name(),
				'nonce'      => $this->create_nonce()
			) );
			return $data_attributes;
		}

		/**
		 * Add classes to field div
		 */
		function pre_render() {
			parent::pre_render();

			//check if there were any rows
			if ( !$this->has_rows() ) {
				$this->classes[] = 'foofields-empty';
			}
		}

		/**
		 * Returns true if the field has data
		 *
		 * @return bool
		 */
		function has_rows() {
			$value = $this->value();
			return is_array( $value ) && count( $value ) > 0;
		}

		/**
		 * Render the field
		 *
		 * @param bool $override_attributes
		 *
		 * @return mixed|void
		 */
		function render_input( $override_attributes = false ) {
			if ( false === $this->fields ) {
				echo __( 'ERROR No fields for conditions repeater!', $this->container->manager->text_domain );
				return;
			}

			$value = $this->value();

			$has_rows = is_array( $value ) && count( $value ) > 0;

			self::render_html_tag( 'p', array(
				'class' => 'foofields-conditions-no-data-message'
			), $this->no_data_message );

			self::render_html_tag( 'p', array(
				'class' => 'foofields-conditions-help-message'
			), $this->help_message );

			self::render_html_tag('table', array(
				'class' => $this->table_class
			), null, false );

			if ( $this->show_header ) {

				//render the table column headers
				echo '<thead><tr>';
				self::render_html_tag( 'th', array() );
				foreach ( $this->fields as $child_field ) {
					$column_attributes = array();
					if ( isset( $child_field['width'] ) ) {
						$column_attributes['width'] = $child_field['width'];
					}
					self::render_html_tag( 'th', $column_attributes, isset( $child_field['label'] ) ? $child_field['label'] : '' );
				}
				echo '</tr></thead>';
			}

			//render the rows
			echo '<tbody>';
			if ( $has_rows ) {
				$row_index = 0;
				foreach( $value as $row ) {
					echo '<tr>';
					//output the hidden metadata cell for the row
					echo '<td>';
					$this->render_row_metadata_fields( $row, $row_index );
					echo '</td>';
					foreach ( $this->fields as $child_field ) {
						if ( isset( $child_field['type'] ) && $child_field['type'] === 'conditions-group' ){
							echo '<td data-separator="' . $this->separator .  '">';
						} else {
							echo '<td>';
						}
						$this->render_row_field( $child_field, $row, $row_index );
						echo '</td>';
					}
					echo '</tr>';
					$row_index++;
				}
			}
			echo '</tbody>';

			//render the footer for adding
			echo '<tfoot><tr>';

			//output the hidden metadata cell for the row
			echo '<td>';
			$this->render_row_metadata_fields();
			echo '</td>';

			foreach ( $this->fields as $child_field ) {
				if ( isset( $child_field['type'] ) && $child_field['type'] === 'conditions-group' ){
					echo '<td data-separator="' . $this->separator .  '">';
				} else {
					echo '<td>';
				}
				$this->render_row_field( $child_field );
				echo '</td>';
			}

			echo '</tr></tfoot>';
			echo '</table>';

			echo '<div class="foofields-conditions-hr"></div>';

			self::render_html_tag( 'button', array(
				'class' => 'button foofields-conditions-add',
				'type' => 'button'
			), $this->add_button_text );

		}

		/**
		 * Render all row hidden metadata fields
		 *
		 * @param array $row_state
		 * @param int $row_index
		 */
		function render_row_metadata_fields( $row_state = array(), $row_index =-1 ) {
			$this->render_row_metadata_field( '__id', $row_state, $row_index );
			$this->render_row_metadata_field( '__created', $row_state, $row_index );
			$this->render_row_metadata_field( '__created_by', $row_state, $row_index );
			$this->render_row_metadata_field( '__updated', $row_state, $row_index );
			$this->render_row_metadata_field( '__updated_by', $row_state, $row_index );
		}

		/**
		 * Render a row hidden metadata field
		 *
		 * @param $metadata_id
		 * @param array $row_state
		 * @param int $row_index
		 */
		function render_row_metadata_field( $metadata_id, $row_state = array(), $row_index =-1 ) {
			if ( isset( $row_state[$metadata_id] ) ) {
				self::render_html_tag( 'input', array(
					'type' => 'hidden',
					'name' => $this->row_field_name( $metadata_id, $row_index ),
					'value' => $row_state[$metadata_id]
				) );
			}
		}

		/**
		 * Render a conditions row field
		 * @param $field_config
		 * @param array $row_state
		 * @param int $row_index
		 */
		function render_row_field( $field_config, $row_state = array(), $row_index = -1) {
			$in_footer = $row_index === -1;

			if ( is_array( $row_state ) && array_key_exists( $field_config['id'], $row_state ) ) {
				$field_config['value'] = $row_state[ $field_config['id'] ];
			}
			$field_id = $field_config['id'];
			$field_config['id'] = $this->id . '_' . $field_id . '_' . $row_index;
			$field_config['row_index'] = $row_index;
			$field_config['original_id'] = $field_config['data']['original_id'] = $field_id;
			$field_config['override_id_for_action_name'] = $this->container->get_unique_id( array( 'id' => $this->id . '_' . $field_id ) );

			$field_object = $this->container->create_field_instance( $field_config['type'], $field_config );
			if ( !$in_footer ) {
				$field_object->override_value_function = array( $this, 'get_conditions_field_value' );
			}
			$field_object->name = $this->row_field_name( $field_id, $row_index );
			$field_object->pre_render();
			$field_object->render( false, $in_footer ? array( 'disabled' => 'disabled' ) : false );
		}

		function row_field_name( $field_id, $row_index ) {
			return $this->name .'[' . $row_index . '][' . $field_id . ']';
		}

		/**
		 * Override function for the fields within a conditions repeater to ensure the correct value is fetched from the state
		 *
		 * @param $conditions_field_config
		 *
		 * @return mixed|string
		 */
		function get_conditions_field_value( $conditions_field_config ) {
			$state = $this->value();

			$row_index = intval( $conditions_field_config['row_index'] );

			if ( array_key_exists( $row_index, $state ) ) {
				$row_state = $state[ $row_index ];

				if ( array_key_exists( $conditions_field_config['original_id'], $row_state ) ) {
					return $row_state[$conditions_field_config['original_id']];
				}
			}

			return '';
		}

		/**
		 * Gets the data posted for the conditions
		 *
		 * @param $sanitized_data
		 *
		 * @return array
		 */
		function get_posted_value( $sanitized_data ) {
			$results = parent::get_posted_value( $sanitized_data );

			$current_username = 'unknown';
			$current_user = wp_get_current_user();
			if ( $current_user instanceof WP_User ) {
				$current_username = $current_user->user_login;
			}

			if ( is_array( $results ) ) {

				// stored some extra info for each row
				// check if each row has an __id field,
				//   if not then add one, so we can figure out which row to delete later.
				//   Also add a __created_by field and set to currently logged on user.
				//   And also a __created field which is the UTC timestamp of when the field was created
				// if the __id field exists, then we doing an update.
				//   update the __updated_by field and __updated timestamp fields
				foreach ( $results as &$result ) {
					if ( ! isset( $result['__id'] ) ) {
						$result['__id']         = wp_generate_password( 10, false, false );
						$result['__created']    = time();
						$result['__created_by'] = $current_username;
					} else {
						$result['__updated']    = time();
						$result['__updated_by'] = $current_username;
					}
				}
			}

			return $results;
		}
	}
}
