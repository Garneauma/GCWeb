/**
 * @title WET-BOEW MapML
 * @overview Integrates MapML into the WET-BOEW framework
 * @license wet-boew.github.io/wet-boew/License-en.html / wet-boew.github.io/wet-boew/Licence-fr.html
 * @author @garneauma
 */
( function( $, doc, wb ) {
"use strict";

var $document = wb.doc,
	componentName = "mapml",
	selector = "mapml-viewer",
	initEvent = "wb-init " + selector,

	/**
	 * @method init
	 * @param {jQuery Event} event Event that triggered the function call
	 */
	init = function( event ) {

		// Start initialization
		// returns DOM object = proceed with init
		// returns undefined = do not proceed with init (e.g., already initialized)
		var elm = wb.init( event, componentName, selector ),
			$elm;

		if ( elm && event.currentTarget === event.target ) {
			$elm = $( elm );

			const mapMLBasePath = "https://cdn.jsdelivr.net/npm/@maps4html/mapml@",
				mapMLVersion = "0.16.0",
				mapMLSuffixJs = "/dist/mapml.js",
				mapMLSRI = "sha384-rJr62+jEH9Z6RcM3CLE8dRN9XH4fVhuspcqlvGWHmYqO1ASkN9n7sZa+FBMuXCI+",
				txtScript = "script";

			let scrMapML = doc.createElement( txtScript );

			scrMapML.type = "module";
			scrMapML.crossOrigin = "";
			scrMapML.integrity = mapMLSRI;
			scrMapML.src = mapMLBasePath + mapMLVersion + mapMLSuffixJs;
			doc.head.appendChild( scrMapML );

			// Identify that initialization has completed
			wb.ready( $elm, componentName );
		}
	};

// Bind the init event of the plugin
$document.on( "timerpoke.wb " + initEvent, selector, init );

// Add the timer poke to initialize the plugin
wb.add( selector );

} )( jQuery, document, wb );
