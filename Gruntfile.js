module.exports = function( grunt ) {

	require('load-grunt-tasks')(grunt);

	var pkg = grunt.file.readJSON( 'package.json' );

	// Project configuration
	grunt.initConfig( {

		pkg: pkg,

		copy: {
			magic: {
				src: ['loader.php'],
				dest: 'examples/wp-magic.php'
			},
			magicversion: {
				src: ['examples/wp-magic.php'],
				dest: 'examples/wp-magic-version-011.php'
			}
		},

		replace: {
			makemagic: {
				src: ['examples/wp-magic.php'],
				overwrite: true,
				replacements: [
					{
						from: 'LIBCLASSNAME',
						to: 'WP_Magic'
					},
					{
						from: 'LIBNAMEUPPER',
						to: 'WP_MAGIC'
					},
					{
						from: 'LIBNAMELOWER',
						to: 'wp_magic'
					},
					{
						from: 'LIBURL',
						to: 'https://wp-magic.io'
					},
					{
						from: 'AUTHORNAME',
						to: 'John Doe'
					},
					{
						from: 'AUTHOREMAIL',
						to: 'john@johndoe.com'
					}
				]
			},
			makemagicversion: {
				src: ['examples/wp-magic-version-011.php'],
				overwrite: true,
				replacements: [
					{
						from: '@version   0.1.0',
						to: '@version   0.1.1'
					},
					{
						from: '@version  0.1.0',
						to: '@version  0.1.1'
					},
					{
						from: 'WP_Magic_010',
						to: 'WP_Magic_011'
					},
					{
						from: "const VERSION = '0.1.0';",
						to: "const VERSION = '0.1.1';"
					},
					{
						from: 'const PRIORITY = 9999;',
						to: 'const PRIORITY = 9998;'
					}
				]
			},
		},

		githooks: {
			all: {
				// create zip and deploy changes to ftp
				'pre-push': 'allwpmagic'
			}
		}
	} );

	grunt.registerTask( 'wpmagic', [ 'copy:magic', 'replace:makemagic' ] );
	grunt.registerTask( 'wpmagicversion', [ 'copy:magicversion', 'replace:makemagicversion' ] );
	grunt.registerTask( 'allwpmagic', [ 'wpmagic', 'wpmagicversion' ] );
	grunt.registerTask( 'default', [ 'allwpmagic' ] );

	grunt.util.linefeed = '\n';
};
