window.WPLibLoader = window.WPLibLoader || {};

( function( window, document, $, app, undefined ) {
	'use strict';

	app.button = '<a href="https://raw.githubusercontent.com/jtsternberg/wp-lib-loader/master/loader.php" class="get-it button" download="loader.php">Generate Loader!</a>';
	app.code = '';

	app.questions = {
		LIBCLASSNAME : ['What is your Library class name (e.g. WP_Magic)', 'WP_Magic'],
		LIBNAMEUPPER : '',
		LIBNAMELOWER : '',
		LIBURL       : ['What is your library\'s URL (e.g. https://wp-magic.io)', 'https://wp-magic.io'],
		AUTHORNAME   : ['Library author name? (e.g. John Doe)', 'John Doe'],
		AUTHOREMAIL  : ['Library author email? (e.g. john@johndoe.com)', 'john@johndoe.com'],
	};

	app.init = function() {
		app.$button = app.addButton();
		app.getCode();

		app.$button.on( 'click', app.generate );
	};

	app.addButton = function() {
		$( 'header .inner' ).append( app.button );
		$( '.generator-button' ).replaceWith( app.button );

		return $( '.get-it' );
	};

	app.getCode = function() {
		$.get( 'https://raw.githubusercontent.com/jtsternberg/wp-lib-loader/master/loader.php', function( data ) {
			app.code = data;
		} );
	};

	app.generate = function( evt ) {
		if ( ! app.code ) {
			alert( 'Sorry, something went wrong! We couldn\'t download the template file.' );
			app.getCode();
			return evt.preventDefault();
		}

		var replacements = {};

		$.each( app.questions, function( replace, question ) {
			if ( question ) {
				if ( ! app.ask( replacements, replace, question ) ) {
					return false;
				}
			}
		} );

		if ( ! replacements.LIBCLASSNAME ) {
			return evt.preventDefault();
		}

		replacements.LIBNAMEUPPER = replacements.LIBCLASSNAME.toUpperCase();
		replacements.LIBNAMELOWER = replacements.LIBCLASSNAME.toLowerCase();

		var loader = app.code;
		var regex;

		$.each( replacements, function( replace, replacement ) {
			regex = new RegExp( replace, 'gm');
			loader = loader.replace( regex, replacement );
		} );

		this.href = 'data:text/plain;charset=UTF-8,' + encodeURIComponent( loader );
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

	$( app.init );

} )( window, document, jQuery, window.WPLibLoader );
