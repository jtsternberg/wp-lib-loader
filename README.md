# WP Lib Loader
Utility template class for smartly loading WordPress code libraries.

This is a handy template class for generating smart loaders for your WordPress code library which eliminates conflicts and the need for `function_exists` or `class_exists` checks in your plugins/themes when using the library. This loader was inspired by [CMB2](https://github.com/WebDevStudios/CMB2/blob/master/init.php#L51-L184), and is a proven system. This loader allows any plugin or theme to bundle your library, and only one version (the most up-to-date version) will be loaded by WordPress.

It accomplishes this through a semi-magical use of the WordPress hooks system combined with unique loader class-names for each version of the library.

- [Getting Started](#getting-started)
	- [Example File](#the-resulting-file)
- [How to version your library](#how-to-version-your-library)
	- [Example File (version 0.1.1)](#the-resulting-file-after-bumping-the-version)
- [Addtional details](#addtional-details)
- [Super important caveats](#super-important-caveats)

## Getting Started
(Until I get a chance to build an automated tool), to use this template, you will need to copy the contents of the [`loader.php`](https://github.com/jtsternberg/wp-lib-loader/blob/master/loader.php) file to your library and then complete a five-step find and replace on the file. For example, if your lbrary is named **_WP_Magic_**:

1. Search for `LIBCLASSNAME` and replace with your library's class-name: `WP_Magic`.
1. Search for `LIBNAMEUPPER` and replace with your library's class-name, upppercased (for constants): `WP_MAGIC`.
1. Search for `LIBNAMELOWER` and replace with your library's class-name, lowercased (for hook names): `wp_magic`.
1. Search for `LIBURL` and replace with your library's URL: `https://wp_magic.io`.
1. Search for `AUTHORNAME` and replace with your name: `John Doe`.
1. Search for `AUTHOREMAIL` and replace with your email: `john@johndoe.com`.

#### The resulting file:

[examples/wp-magic.php](https://github.com/jtsternberg/wp-lib-loader/blob/master/examples/wp-magic.php)

## How to version your library

Since the real magic of this loader is when you release a new version, let me explain that process. Let's say you're looking to release a bug-fix for **_WP_Magic_**.

1. Increase your version numbers to `0.1.1`.
	* Replace the `0.1.0` for the `@version` docblocks.

		```php
		* @version  0.1.1
		```
	* Replace the `0.1.0` for the `VERSION` constant.

		```php
		const VERSION = '0.1.1';
		```
1. Update the loader class-name from `WP_Magic_010` to `WP_Magic_011`.
1. **MOST IMPORTANT:** Decrement the `PRIORITY` constant.

	```php
	const PRIORITY = 9998;
	```

**That's it!** That's all there is to releasing a new version! You can now be sure that this will be the version used if multiple copies of the library exist.

#### The resulting file after bumping the version:

[examples/wp-magic-version-011.php](https://github.com/jtsternberg/wp-lib-loader/blob/master/examples/wp-magic-version-011.php)

## Addtional details

* The loader assumes your main library class (e.g. `WP_Magic`) exists in the `lib/init.php` file. Obviously, if that is not the case with your library, you will need to updat the `require_once` line.

* The loader provides 3 useful constants:
	* `LIBNAMEUPPER_LOADED` (e.g. `WP_MAGIC_LOADED`) - A constant set right away which dependent plugins/themes can use to determine if your library is loaded (vs `function_exists` or `class_exists` checks). This constant can also be used to determine the priority of the hook in use for the currently loaded version.

	* `LIBNAMEUPPER_VERSION` (e.g. `WP_MAGIC_VERSION`) - Defines the loaded version of your library so dependent plugins/themes have a way to conditionally load features.

	* `LIBNAMEUPPER_DIR` (e.g. `WP_MAGIC_DIR`) - Defines the directory of the loaded version of your library. Can be useful determining the location of the library when debugging and multiple copies of the library exist in the system.

* The loader provides a useful hook, `'LIBNAMELOWER_load'` (e.g. `'wp_magic_load'`), which can be used for hooking in your dependent functionality. In order to ensure your hook loads _after_ the library is loaded, you will need to use the `LIBNAMEUPPER_LOADED` (e.g. `WP_MAGIC_LOADED`) constant when hooking in:
	```php
	if ( defined( 'WP_MAGIC_LOADED' ) ) {
      // Hook in after WP_Magic and add our functionality
      add_action( 'wp_magic_load', 'my_plugin_dependent_functionality', ( WP_MAGIC_LOADED + 1 ) );
	}
	```

## Super important caveats

* This loader only works if you are **100% committed to backwards-compatibility** (like WordPress). This is mandataory because only _one_ instance of the library will be loaded, and will be whichever instance is the most recent (version). If you change a function, hook name, or properties passed into your library hooks, there is a very real chance you will break the plugins/themes which depend on your library. For this reason, you need to take great consideration when developing your public API, i.e. the parts of the library to be exposed for use.

* When releasing a new version, it's extremely important to follow [the versioning instructions](#how-to-version-your-library) or this loader will be useless.
