window.WPLibLoader = window.WPLibLoader || {};

( function( window, document, $, app, undefined ) {
	'use strict';

	app.codeURL = 'https://raw.githubusercontent.com/jtsternberg/wp-lib-loader/master/loader.php?d=3-27-16';
	app.button = '<a href="'+ app.codeURL +'" class="get-it button" download="loader.php">Generate Loader!</a>';
	app.readmeURL = 'https://raw.githubusercontent.com/jtsternberg/wp-lib-loader/master/README.md?d=3-27-16';
	app.readmeURL = 'http://test.it/Plugins&Scripts/wp-lib-loader/README.md';
	app.code = '';

	app.questions = {
		LIBCLASSNAME : ['What is your Library class name (e.g. WP_Magic)', 'WP_Magic'],
		LIBNAMEUPPER : '',
		LIBNAMELOWER : '',
		LIBURL       : ['What is your library\'s URL (e.g. https://wp-magic.io)', 'https://wp-magic.io'],
		AUTHORNAME   : ['Library author name? (e.g. John Doe)', 'John Doe'],
		AUTHOREMAIL  : ['Library author email? (e.g. john@johndoe.com)', 'john@johndoe.com'],
	};

	app.readmeReplacements = {
		'This is a handy template' : '<a href="https://github.com/jtsternberg/wp-lib-loader/blob/master/loader.php">WP Lib Loader</a> is a handy template',
		'_WP<em>Magic</em>' : '<em>WP_Magic</em>'
	};

	app.init = function() {
		// Get/parse readme contents
		$.get( app.readmeURL, app.parseREADME );

		// Get loader.php contents, and then add the generate-loader buttons
		$.get( app.codeURL, app.addGeneratorButtons );

		// Hook generate button
		$( document.body ).on( 'click', '.get-it', app.clickGenerate );
	};

	app.parseREADME = function( mdContent ) {
		var $mainContent = $( document.getElementById( 'main-content' ) );

		// Process markdown
		var html = marked( mdContent, {
			highlight: function (code, lang, callback) {
				// Use highlight.js to process code blocks
				return hljs.highlightAuto( code, [ lang ] ).value;
			}
		} );

		// Replace a few strings for the github page
		html = app.replace( html, app.readmeReplacements );

		// Generate a new jQuery dom object
		var $html = $( '<div class="content-inner">' ).append( html );

		// Remove title
		$html.find( 'h1' ).first().remove();
		// Remove github.io link
		$html.find( 'h3' ).first().remove();
		// Remove sub-title
		$html.find( 'blockquote' ).first().remove();
		// Remove "Use the generator tool to quickly create a loader for your library!"
		$html.find( 'h4' ).first().remove();

		// Replace link to this page with the generate loader button
		$html.find( '[href="http://jtsternberg.github.io/wp-lib-loader/"]' )
			.attr( 'href', app.codeURL )
			.attr( 'download', 'loader.php' )
			.addClass( 'get-it' )
			.text( 'click the Generate Loader button' );

		// Now replace the placeholder content w/ this markdown -> html content
		$( document.getElementById( 'placeholder' ) ).replaceWith( $html );
	};

	app.addGeneratorButtons = function( data ) {
		app.code = data;
		$( 'header .inner' ).append( app.button );
		$( '.generator-button' ).replaceWith( app.button );
	};

	app.clickGenerate = function( evt ) {
		evt.preventDefault();

		if ( ! app.code ) {
			alert( 'Sorry, something went wrong! We couldn\'t download the template file.' );
			app.getCode();
			return;
		}

		var replacements = {};
		var bail = false;

		$.each( app.questions, function( replace, question ) {
			if ( question ) {
				if ( ! app.ask( replacements, replace, question ) ) {
					bail = true;
					return false;
				}
			}
		} );

		if ( ! replacements.LIBCLASSNAME || bail ) {
			return;
		}

		replacements.LIBNAMEUPPER = replacements.LIBCLASSNAME.toUpperCase();
		replacements.LIBNAMELOWER = replacements.LIBCLASSNAME.toLowerCase();

		var filename = replacements.LIBNAMELOWER.replace( '_', '-' ) + '.php';

		app.download( filename, app.replace( app.code, replacements ) );

		alert( 'Success! Your loader (loader.php) has been downloaded.');
	};

	app.ask = function( replacements, replace, question ) {
		replacements[ replace ] = prompt( question[0], question[1] );

		if ( ! replacements[ replace ] ) {
			if ( confirm( "Hey, this won't work unless you cooperate! Try again?" ) ) {
				app.ask( replacements, replace, question );
			}

			return false;
		}

		return true;
	};

	app.download = function( filename, text ) {
		var element = document.createElement( 'a' );
		element.setAttribute( 'href', 'data:application/octet-stream;charset=UTF-8,' + encodeURIComponent( text ) );
		element.setAttribute( 'download', filename );

		element.style.display = 'none';
		document.body.appendChild( element );

		element.click();

		document.body.removeChild(element);
	};

	app.replace = function( content, replacements ) {
		$.each( replacements, function( replace, replacement ) {
			content = content.replace( new RegExp( replace, 'gm'), replacement );
		} );

		return content;
	};

	$( app.init );

} )( window, document, jQuery, window.WPLibLoader );
