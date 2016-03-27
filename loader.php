<?php
/**
 * LIBCLASSNAME loader
 *
 * Handles checking for and smartly loading the newest version of this library.
 *
 * @category  WordPressLibrary
 * @package   LIBCLASSNAME
 * @author    AUTHORNAME <AUTHOREMAIL>
 * @copyright 2016 AUTHORNAME <AUTHOREMAIL>
 * @license   GPL-2.0+
 * @version   0.1.0
 * @link      LIBURL
 * @since     0.1.0
 */

/**
 * Copyright (c) 2016 AUTHORNAME (email : AUTHOREMAIL)
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

if ( ! class_exists( 'LIBCLASSNAME_010', false ) ) {

	/**
	 * Versioned loader class-name
	 *
	 * This ensures each version is loaded/checked.
	 *
	 * @category WordPressLibrary
	 * @package  LIBCLASSNAME
	 * @author   AUTHORNAME <AUTHOREMAIL>
	 * @license  GPL-2.0+
	 * @version  0.1.0
	 * @link     LIBURL
	 * @since    0.1.0
	 */
	class LIBCLASSNAME_010 {

		/**
		 * LIBCLASSNAME version number
		 * @var   string
		 * @since 0.1.0
		 */
		const VERSION = '0.1.0';

		/**
		 * Current version hook priority.
		 * Will decrement with each release
		 *
		 * @var   int
		 * @since 0.1.0
		 */
		const PRIORITY = 9999;

		/**
		 * Starts the version checking process.
		 * Creates LIBNAMEUPPER_LOADED definition for early detection by
		 * other scripts.
		 *
		 * Hooks LIBCLASSNAME inclusion to the LIBNAMELOWER_load hook
		 * on a high priority which decrements (increasing the priority) with
		 * each version release.
		 *
		 * @since 0.1.0
		 */
		public function __construct() {
			if ( ! defined( 'LIBNAMEUPPER_LOADED' ) ) {
				/**
				 * A constant you can use to check if LIBCLASSNAME is loaded
				 * for your plugins/themes with LIBCLASSNAME dependency.
				 *
				 * Can also be used to determine the priority of the hook
				 * in use for the currently loaded version.
				 */
				define( 'LIBNAMEUPPER_LOADED', self::PRIORITY );
			}

			// Use the hook system to ensure only the newest version is loaded.
			add_action( 'LIBNAMELOWER_load', array( $this, 'include_lib' ), self::PRIORITY );

			// Then fire our hook.
			do_action( 'LIBNAMELOWER_load' );
		}

		/**
		 * A final check if LIBCLASSNAME exists before kicking off
		 * our LIBCLASSNAME loading.
		 *
		 * LIBNAMEUPPER_VERSION and LIBNAMEUPPER_DIR constants are
		 * set at this point.
		 *
		 * @since  0.1.0
		 */
		public function include_lib() {
			if ( class_exists( 'LIBCLASSNAME', false ) ) {
				return;
			}

			if ( ! defined( 'LIBNAMEUPPER_VERSION' ) ) {
				/**
				 * Defines the currently loaded version of LIBCLASSNAME.
				 */
				define( 'LIBNAMEUPPER_VERSION', self::VERSION );
			}

			if ( ! defined( 'LIBNAMEUPPER_DIR' ) ) {
				/**
				 * Defines the directory of the currently loaded version of LIBCLASSNAME.
				 */
				define( 'LIBNAMEUPPER_DIR', dirname( __FILE__ ) . '/' );
			}

			// Include and initiate LIBCLASSNAME.
			require_once LIBNAMEUPPER_DIR . 'lib/init.php';
		}

	}

	// Kick it off.
	new LIBCLASSNAME_010;
}
