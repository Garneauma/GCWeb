/**
 * @title WET-BOEW Follow us component
 * @overview Plugin used to replace Twitter with "X" - Deprecated
 * @license wet-boew.github.io/wet-boew/License-en.html / wet-boew.github.io/wet-boew/Licence-fr.html
 * @author @garneauma
 */
( function( $, window, wb ) {
"use strict";

var $document = wb.doc,
	componentName = "page-type-theme",
	selector = "." + componentName,
	initEvent = "wb-init " + selector,
	themeMenuBtn,
	themeNav,
	themeNavUL,
	themeNavDialog,
	focusableElements,
	firstFocusable,
	lastFocusable,

	/**
	 * @method init
	 * @param {jQuery Event} event Event that triggered the function call
	 */
	init = function( event ) {

		// Start initialization
		// returns DOM object = proceed with init
		// returns undefined = do not proceed with init (e.g., already initialized)
		var elm = wb.init( event, componentName, selector );

		if ( elm && event.currentTarget === event.target ) {
			themeMenuBtn = document.querySelector( "#menu-btn" );
			themeNav = document.querySelector( "#theme-nav" );
			themeNavUL = themeNav.querySelector( "ul" );
			themeNavDialog = themeNav.querySelector( "#theme-nav-dialog" );
			focusableElements = themeNavDialog.querySelectorAll( "a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex='-1'])" );
			firstFocusable = focusableElements[ 0 ];
			lastFocusable = focusableElements[ focusableElements.length - 1 ];

			// Set attributes
			themeNavDialog.id = themeNavDialog.id || wb.getId();
			themeMenuBtn.setAttribute( "aria-controls", themeNavDialog.id );
			themeMenuBtn.setAttribute( "aria-expanded", "false" );
			themeMenuBtn.setAttribute( "aria-haspopup", "dialog" );

			// Highlight the current page in the menu
			$( themeNav ).trigger( "navcurr.wb" );
			themeNavUL.querySelector( ".wb-navcurr" )?.setAttribute( "aria-current", "page" );

			// Add dialog role if on smaller screens
			if ( window.matchMedia( "(max-width: 991px)" ).matches ) {
				themeNavDialog.setAttribute( "role", "dialog" );
			}

			// Identify that initialization has completed
			wb.ready( $( elm ), componentName );
		}
	},
	showMenu = function() {
		themeMenuBtn.setAttribute( "aria-expanded", "true" );
		themeMenuBtn.classList.add( "expanded" );
		themeNavDialog.setAttribute( "open", "" );
		document.body.style.position = "fixed";
		document.addEventListener( "keydown", trapFocus ); // Activate focus trap
		themeNavDialog.querySelector( "button" ).focus();
	},
	hideMenu = function() {
		themeMenuBtn.setAttribute( "aria-expanded", "false" );
		themeMenuBtn.classList.remove( "expanded" );
		themeNavDialog.removeAttribute( "open" );
		document.body.style.position = "";
		document.removeEventListener( "keydown", trapFocus ); // Remove focus trap
		themeMenuBtn.focus();
	},
	trapFocus = function( e ) {
		if ( e.key === "Escape" ) {
			hideMenu();
			return;
		}

		if ( e.key !== "Tab" ) {
			return;
		}

		// Shift + Tab, else Tab
		if ( e.shiftKey ) {
			if ( document.activeElement === firstFocusable ) {
				e.preventDefault();
				lastFocusable.focus();
			}
		} else {
			if ( document.activeElement === lastFocusable ) {
				e.preventDefault();
				firstFocusable.focus();
			}
		}
	};

// Bind the init event of the plugin
$document.on( "timerpoke.wb " + initEvent, selector, init );

// On click of the menu button
$document.on( "click", "#menu-btn", function() {
	showMenu();
} );

// On click of the close button
$document.on( "click", "#theme-nav-dialog > button", function() {
	hideMenu();
} );

// Add dialog role if on smaller screens, remove if not
window.onresize = function() {
	if ( window.matchMedia( "(max-width: 991px)" ).matches ) {
		themeNavDialog.setAttribute( "role", "dialog" );
	} else {
		themeNavDialog.removeAttribute( "role" );
	}
};

// Add the timer poke to initialize the plugin
wb.add( selector );

} )( jQuery, window, wb );
