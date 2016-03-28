<?php
/**
 * WP_Magic loader
 *
 * Handles checking for and smartly loading the newest version of this library.
 *
 * @category  WordPressLibrary
 * @package   WP_Magic
 * @author    John Doe <john@johndoe.com>
 * @copyright 2016 John Doe <john@johndoe.com>
 * @license   GPL-2.0+
 * @version   0.1.1
 * @link      https://wp-magic.io
 * @since     0.1.0
 */

/**
 * Copyright (c) 2016 John Doe (email : john@johndoe.com)
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License, version 2 or, at
 * your discretion, any later version, as published by the Free
 * Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 */

/**
 * Loader versioning: http://jtsternberg.github.io/wp-lib-loader/
 */

if ( ! class_exists( 'WP_Magic_011', false ) ) {

	/**
	 * Versioned loader class-name
	 *
	 * This ensures each version is loaded/checked.
	 *
	 * @category WordPressLibrary
	 * @package  WP_Magic
	 * @author   John Doe <john@johndoe.com>
	 * @license  GPL-2.0+
	 * @version  0.1.1
	 * @link     https://wp-magic.io
	 * @since    0.1.0
	 */
	class WP_Magic_011 {

		/**
		 * WP_Magic version number
		 * @var   string
		 * @since 0.1.0
		 */
		const VERSION = '0.1.1';

		/**
		 * Current version hook priority.
		 * Will decrement with each release
		 *
		 * @var   int
		 * @since 0.1.0
		 */
		const PRIORITY = 9998;

		/**
		 * Starts the version checking process.
		 * Creates WP_MAGIC_LOADED definition for early detection by
		 * other scripts.
		 *
		 * Hooks WP_Magic inclusion to the wp_magic_load hook
		 * on a high priority which decrements (increasing the priority) with
		 * each version release.
		 *
		 * @since 0.1.0
		 */
		public function __construct() {
			if ( ! defined( 'WP_MAGIC_LOADED' ) ) {
				/**
				 * A constant you can use to check if WP_Magic is loaded
				 * for your plugins/themes with WP_Magic dependency.
				 *
				 * Can also be used to determine the priority of the hook
				 * in use for the currently loaded version.
				 */
				define( 'WP_MAGIC_LOADED', self::PRIORITY );
			}

			// Use the hook system to ensure only the newest version is loaded.
			add_action( 'wp_magic_load', array( $this, 'include_lib' ), self::PRIORITY );

			/*
			 * Hook in to the first hook we have available and
			 * fire our `wp_magic_load' hook.
			 */
			add_action( 'muplugins_loaded', array( __CLASS__, 'fire_hook' ), 9 );
			add_action( 'plugins_loaded', array( __CLASS__, 'fire_hook' ), 9 );
			add_action( 'after_setup_theme', array( __CLASS__, 'fire_hook' ), 9 );
		}

		/**
		 * Fires the wp_magic_load action hook.
		 *
		 * @since 0.1.0
		 */
		public static function fire_hook() {
			if ( ! did_action( 'wp_magic_load' ) ) {
				// Then fire our hook.
				do_action( 'wp_magic_load' );
			}
		}

		/**
		 * A final check if WP_Magic exists before kicking off
		 * our WP_Magic loading.
		 *
		 * WP_MAGIC_VERSION and WP_MAGIC_DIR constants are
		 * set at this point.
		 *
		 * @since  0.1.0
		 */
		public function include_lib() {
			if ( class_exists( 'WP_Magic', false ) ) {
				return;
			}

			if ( ! defined( 'WP_MAGIC_VERSION' ) ) {
				/**
				 * Defines the currently loaded version of WP_Magic.
				 */
				define( 'WP_MAGIC_VERSION', self::VERSION );
			}

			if ( ! defined( 'WP_MAGIC_DIR' ) ) {
				/**
				 * Defines the directory of the currently loaded version of WP_Magic.
				 */
				define( 'WP_MAGIC_DIR', dirname( __FILE__ ) . '/' );
			}

			// Include and initiate WP_Magic.
			require_once WP_MAGIC_DIR . 'lib/init.php';
		}

	}

	// Kick it off.
	new WP_Magic_011;
}
