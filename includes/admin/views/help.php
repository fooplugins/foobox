<?php
/**
 * FooBox Admin Help View
 */

$title = __( 'FooBox', 'foobox' );
$tagline = __( 'Thank you for choosing FooBox, the WordPress Notification Plugin that helps your business grow!', 'foobox' );
$made_by = __( 'Made with ❤️ by %s', 'foobox' );
$fooplugins_link = '<a href="https://fooplugins.com/?utm_source=foobox_plugin_help" target="_blank">' . __( 'FooPlugins', 'foobox' ) . '</a>';
$link = '<a href="https://fooplugins.com/foobox/?utm_source=foobox_plugin_help" target="_blank">' . __( 'Visit the FooBox Homepage', 'foobox' ) . '</a>';
$support_url = 'https://fooplugins.link/support?utm_source=foobox_plugin_help_support';

$logo = FOOBOX_URL . 'assets/img/foobox-image-lightbox.jpg';
$loader = FOOBOX_URL . 'assets/admin/img/loader.gif';

$fs_instance = foobox_fs();
$is_free = $fs_instance->is_free_plan();
$is_trial = $fs_instance->is_trial();
$show_trial_message = !$is_trial && $is_free && !$fs_instance->is_trial_utilized();
$show_thanks_for_pro = foobox_is_pro();
$upgrade_tab_text = __( 'PRO Features', 'foobox' );

$demos_created = foobox_get_setting( 'demo_content' ) === 'on';

?>
<script type="text/javascript">
	jQuery(document).ready(function($) {
		$.foobox_help_tabs = {

			init : function() {
				$(".foobox-help nav a").click( function(e) {
					e.preventDefault();

					$this = $(this);

					$this.addClass("foobox-tab-active");

					$(".foobox-tab-active").not($this).removeClass("foobox-tab-active");

					$(".foobox-section:visible").hide();

					var hash = $this.attr("href");

					$(hash+'_section').show();

					window.location.hash = hash;
				} );

				if (window.location.hash) {
					$('.foobox-help nav a[href="' + window.location.hash + '"]').click();
				}

				return false;
			}

		}; //End of foobox_help_tabs

		$.foobox_help_tabs.init();

		$.foobox_import_data = {
			init : function() {
				$(".foobox-import-demos").click( function(e) {
					e.preventDefault();

					var $this = $(this),
						data = {
							'action': 'foobox_admin_import_demos',
							'_wpnonce': $this.data( 'nonce' ),
							'_wp_http_referer': encodeURIComponent( $( 'input[name="_wp_http_referer"]' ).val() )
						};

					$this.addClass("foobox-loading").removeAttr('href');

					$.ajax({
						type: 'POST',
						url: ajaxurl,
						data: data,
						cache: false,
						success: function( html ) {
							alert( html );
						}
					}).always(function(){
						$this.removeClass("foobox-loading").attr('href', '#demo_content');
					});
				} );
			}
		};

		$.foobox_import_data.init();
	});
</script>
<style>
	body {
		background-color: #484c50;
	}
	#wpcontent {
		padding-right: 20px;
	}
	@media screen and (max-width: 782px){
		.auto-fold #wpcontent {
			padding-right: 10px;
		}
	}

	.foobox-help {
		max-width: 1000px;
		margin: 24px auto;
		clear: both;
		background-color: #23282d;
		border-radius: 20px;
		color: #ffffff;
	}

		.foobox-help h2,
		.foobox-help h3,
		.foobox-help h4 {
			color: inherit;
		}

		.foobox-help a {
			color: #35beff;
			text-decoration: none;
		}
			.foobox-help a:hover {
				color: #0097de;
			}
			.foobox-help a:focus {
				box-shadow: none;
			}

		.foobox-header {
			margin: 0;
			color: #FFFFFF;
			position: relative;
			text-align: center;
			padding: 20px;
		}
		.foobox-header > img {
			max-width: 100%;
			height: auto;
			margin: 3em 0;
			box-sizing: border-box;
		}

		.foobox-tagline {
			margin: 0;
			padding: 10px;
			font-size: 1.5em;
		}

	.foobox-ribbon {
		position: absolute;
		right: -5px;
		top: -5px;
		z-index: 1;
		overflow: hidden;
		width: 75px;
		height: 75px;
		text-align: right;
	}
		.foobox-ribbon span {
			font-size: 10px;
			font-weight: 600;
			color: #2b2400;
			text-transform: uppercase;
			text-align: center;
			line-height: 20px;
			transform: rotate(45deg);
			width: 100px;
			display: block;
			background: #d67935;
			box-shadow: 0 3px 10px -5px rgba(0, 0, 0, 1);
			position: absolute;
			top: 19px; right: -21px;
		}
		.foobox-ribbon span::before {
			content: "";
			position: absolute;
			left: 0;
			top: 100%;
			z-index: -1;
			border-left: 3px solid #d67935;
			border-right: 3px solid transparent;
			border-bottom: 3px solid transparent;
			border-top: 3px solid #d67935;
		}
		.foobox-ribbon span::after {
			content: "";
			position: absolute;
			right: 0;
			top: 100%;
			z-index: -1;
			border-left: 3px solid transparent;
			border-right: 3px solid #d67935;
			border-bottom: 3px solid transparent;
			border-top: 3px solid #d67935;
		}

	.foobox-help nav {
		background: #32373c;
		clear: both;
		padding-top: 0;
		color: #0097de;
		display: flex;
	}

		.foobox-help nav a {
			margin-left: 0;
			padding: 24px 32px 18px 32px;
			font-size: 1.3em;
			line-height: 1;
			border-width: 0 0 6px;
			border-style: solid;
			border-color: transparent;
			background: transparent;
			color: inherit;
			text-decoration: none;
			font-weight: 600;
			box-shadow: none;
		}

			.foobox-help nav a:hover {
				background-color: #0073aa;
				color: #ffffff;
				border-width: 0;
			}

			.foobox-help nav a.foobox-tab-active {
				background-color: #0073aa;
				color: #ffffff;
				border-color: #ffffff;
			}

	.foobox-section {
	}

	.foobox-centered {
		text-align: center;
	}

		.foobox-section .foobox-section-feature {
			margin: 32px;
		}

			.foobox-section .foobox-section-feature h2 {
				text-align: center;
				font-size: 1.6em;
				margin: 0;
				padding: 20px 0;
				font-weight: 600;
			}

			.foobox-section .foobox-section-feature .foobox-2-columns {
				display: -ms-grid;
				display: grid;
				grid-template-columns: 1fr 2fr;
			}

				.foobox-section .foobox-section-feature .foobox-2-columns .foobox-column {
					padding: 32px;
				}

				.foobox-button-cta {
					background: #0073aa;
					color: #ffffff !important;
					padding: 12px 36px;
					font-size: 1.3em;
					border-radius: 10px;
					text-decoration: none;
					font-weight: 600;
					display: inline-block;
					min-width: 250px;
				}
					.foobox-button-cta:hover {
						background: #016b99;
					}

					.foobox-button-cta.foobox-loading {
						position: relative;
						cursor: wait;
					}

						.foobox-button-cta.foobox-loading:before {
							content: '';
							background: url('<?php echo $loader ?>') no-repeat;
							background-size: 20px 20px;
							display: inline-block;
							opacity: 0.7;
							filter: alpha(opacity=70);
							width: 20px;
							height: 20px;
							border: none;
							position: absolute;
							top: 50%;
							right: 8px;
							transform: translateY(-50%);
						}

		.foobox-footer {
			margin: 0;
			color: #ffffff;
			text-align: center;
			padding: 20px;
			font-size: 1.3em;
		}

</style>
<div class="foobox-help">
	<div class="foobox-header">
		<div class="foobox-ribbon"><span><?php echo FOOBOX_VERSION; ?></span></div>
		<img src="<?php echo $logo; ?>" width="200">
		<p class="foobox-tagline"><?php echo $tagline; ?></p>
		<p class="foobox-tagline"><?php echo $link; ?></p>
	</div>
	<nav>
		<a class="foobox-tab-active" href="#help">
			<?php _e( 'Getting Started', 'foobox' ); ?>
		</a>
		<a href="#pro">
			<?php echo $upgrade_tab_text; ?>
		</a>
		<a href="#demos">
			<?php _e( 'Demos', 'foobox' ); ?>
		</a>
		<a href="#support">
			<?php _e( 'Support', 'foobox' ); ?>
		</a>
	</nav>
	<div class="foobox-content">
		<div id="help_section" class="foobox-section">
			<?php if ( !$demos_created ) { ?>
			<div class="foobox-section-feature foobox-centered">
				<h2><?php _e( 'Create Demo Popups', 'foobox' );?></h2>
				<p><?php _e( 'It\'s always best to see what is possible by looking at the real thing. If you want to get started really quickly without any hassle, then we can import some demo popups for you. This will create a number of pre-defined popups which you can easily edit and make your own.', 'foobox' );?></p>
				<a class="foobox-button-cta foobox-import-demos" data-nonce="<?php echo esc_attr( wp_create_nonce( 'foobox_admin_import_demos' ) ); ?>" href="#demo_content"><?php _e( 'Create Popups', 'foobox' ); ?></a>
			</div>
			<?php } ?>
			<div class="foobox-section-feature">
				<h2><?php _e( 'Getting Started Header 2', 'foobox' );?></h2>
				<div class="foobox-2-columns">
					<div class="foobox-column">
						<h3><?php _e( 'Getting Started Header 3', 'foobox' );?></h3>
						<p>
							<?php _e( 'Getting started info goes here.', 'foobox' );?>
						</p>
					</div>
					<div class="foobox-column">
						<img src="<?php echo esc_url( FOOBOX_URL . 'assets/admin/img/foobox-getting-started.png'); ?>" />
					</div>
				</div>
			</div>
		</div>
		<div id="pro_section" class="foobox-section foobox-centered" style="display: none">
			<?php if ( $show_trial_message ) { ?>
				<div class="foobox-section-feature">
					<h2><?php _e( 'FooBox PRO Free Trial 🤩', 'foobox' );?></h2>
					<p><?php _e( 'Want to test out all the PRO features below? No problem! You can start a 7-day free trial immediately!', 'foobox' );?></p>
					<a class="foobox-button-cta" href="<?php echo esc_url ( foobox_admin_freetrial_url() ); ?>"><?php _e( 'Start Your 7-day Free Trial', 'foobox' ); ?></a>
				</div>
			<?php } else if ( $show_thanks_for_pro ) { ?>
				<div class="foobox-section-feature">
					<h2><?php _e( 'Thanks for your support by purchasing a PRO license 😍', 'foobox' );?></h2>
					<p><?php _e( 'See below for the PRO features you can start using immediately...', 'foobox' );?></p>
				</div>
			<?php } else if ( $is_trial ) { ?>
				<div class="foobox-section-feature">
					<h2><?php _e( 'Thanks for trying out PRO 😍', 'foobox' );?></h2>
					<p><?php _e( 'See below for the PRO features you can try out immediately...', 'foobox' );?></p>
				</div>
			<?php }?>
			<div class="foobox-section-feature">
				<h2><?php _e( 'PRO Feature 1','foobox' ); ?></h2>
				<p><?php _e( 'Feature 1 details.', 'foobox' );?></p>
				<p><img src="<?php echo esc_url( FOOBOX_URL . 'assets/admin/img/foobox-help-pro-feature1.png'); ?>" /></p>
			</div>
		</div>
		<div id="demos_section" class="foobox-section foobox-centered" style="display: none">
			<div class="foobox-section-feature">
				<h2><?php _e( 'FooBox Demos 😎', 'foobox' );?></h2>
				<p><?php _e( 'Try the demos below:', 'foobox' );?></p>
			</div>
		</div>
		<div id="support_section" class="foobox-section" style="display: none">
			<div class="foobox-section-feature">
				<h2><?php _e( '🚑 Need help? We\'re here for you...' , 'foobox' );?></h2>

				<p><span class="dashicons dashicons-editor-help"></span><a href="https://fooplugins.com/documentation/foobox/" target="_blank"><?php _e('FooBox Documentation','foobox'); ?></a> - <?php _e('Our documentation covers everything you need to know from how to install the plugin and use it, to troubleshooting common issues.', 'foobox'); ?></p>

				<p><span class="dashicons dashicons-editor-help"></span><a href="https://wordpress.org/support/plugin/foobox-image-lightbox/" target="_blank"><?php _e('foobox WordPress.org Support','foobox'); ?></a> - <?php _e('We actively monitor and answer all questions posted on WordPress.org for FooBox.', 'foobox'); ?></p>

				<div class="feature-cta">
					<p><?php _e('Still stuck? Please open a support ticket and we will help:', 'foobox'); ?></p>
					<a target="_blank" href="<?php echo esc_url ( $support_url ); ?>"><?php _e('Open a support ticket', 'foobox' ); ?></a>
				</div>
			</div>
		</div>
	</div>
	<div class="foobox-footer">
		<?php echo sprintf( $made_by, $fooplugins_link ); ?>
	</div>
</div>
