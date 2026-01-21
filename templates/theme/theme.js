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
	themeContent,
	featuresContainer,
	breadcrumbsSignIn,
	gridContainer,
	focusableElements,
	firstFocusable,
	lastFocusable,
	trapHandler,

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
			themeContent = document.querySelector( "#theme-content" );
			gridContainer = document.querySelector( "#gridContainer" );
			featuresContainer = document.querySelector( "#theme-features" );
			breadcrumbsSignIn = document.querySelector( "#wb-bnr + hr + .container" );

			// Initialize history state for first load
			history.replaceState( { url: location.href }, "", location.href );

			// Set attributes
			themeNavDialog.id = themeNavDialog.id || wb.getId();
			themeMenuBtn.setAttribute( "aria-controls", themeNavDialog.id );
			themeMenuBtn.setAttribute( "aria-expanded", "false" );
			themeMenuBtn.setAttribute( "aria-haspopup", "dialog" );
			themeContent.setAttribute( "aria-live", "polite" );

			// Highlight the current page in the menu
			$( themeNav ).trigger( "navcurr.wb" );
			themeNavUL.querySelector( ".wb-navcurr" )?.setAttribute( "aria-current", "page" );

			// Add dialog role if on smaller screens
			if ( window.matchMedia( "(max-width: 767px)" ).matches ) {
				themeNavDialog.setAttribute( "role", "dialog" );
			}

			// Identify that initialization has completed
			wb.ready( $( elm ), componentName );
		}
	},
	loadThemeContent = function( url ) {
		fetch( url, { credentials: "same-origin" } )
			.then( function( response ) {
				if ( !response.ok ) {
					throw new Error( response.status );
				}
				return response.text();
			} )
			.then( function( html ) {
				var doc = new DOMParser().parseFromString( html, "text/html" ),
					newContent = doc.querySelector( "#theme-content" ),
					newFeatures = doc.querySelector( "#theme-features" ),
					newBreadcrumbsSignIn = doc.querySelector( "#wb-bnr + hr + .container" ),
					newTitle = doc.querySelector( "title" );

				if ( !newContent ) {
					throw new Error( "#theme-content not found in requested page" );
				}

				// Replace content
				$( themeContent ).html( newContent.innerHTML );
				if ( !featuresContainer ) {
					featuresContainer = document.createElement( "div" );
					featuresContainer.id = "theme-features";
					featuresContainer.className = "container";
					gridContainer.after( featuresContainer );
				}

				// Replace features
				$( featuresContainer ).html( newFeatures ? newFeatures.innerHTML : "" );

				// Replace Sign in
				$( breadcrumbsSignIn ).html( newBreadcrumbsSignIn ? newBreadcrumbsSignIn.innerHTML : "" );

				// Replace title
				document.title = newTitle.textContent;
			} )
			.catch( function( err ) {
				console.error( "Content load failed:", err );
			} );
	},
	updateNavState = function( url ) {
		var current = new URL( url, location.origin ).href;

		themeNavUL.querySelectorAll( "a" ).forEach( function( link ) {
			var linkHref = new URL( link.href, location.origin ).href;

			link.classList.remove( "wb-navcurr" );
			link.removeAttribute( "aria-current" );

			if ( linkHref === current ) {
				link.classList.add( "wb-navcurr" );
				link.setAttribute( "aria-current", "page" );
			}
		} );
	},
	showMenu = function() {
		themeMenuBtn.setAttribute( "aria-expanded", "true" );
		themeMenuBtn.classList.add( "expanded" );
		themeNavDialog.setAttribute( "open", "" );
		document.body.style.position = "fixed";
		trapFocus( themeNavDialog ); // Activate focus trap
	},
	hideMenu = function() {
		themeMenuBtn.setAttribute( "aria-expanded", "false" );
		themeMenuBtn.classList.remove( "expanded" );
		themeNavDialog.removeAttribute( "open" );
		document.body.style.position = "";
		document.removeEventListener( "keydown", trapHandler ); // Remove focus trap
	},
	trapFocus = function( container ) {
		focusableElements = container.querySelectorAll( "a[href]:not(.wb-sl), button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex='-1'])" );
		firstFocusable = focusableElements[ 0 ];
		lastFocusable = focusableElements[ focusableElements.length - 1 ];
		trapHandler = function( e ) {
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

		document.addEventListener( "keydown", trapHandler );
	};

// Bind the init event of the plugin
$document.on( "timerpoke.wb " + initEvent, selector, init );

// On click of the menu button
$document.on( "click", "#menu-btn", function() {
	showMenu();
	themeNavDialog.querySelector( "button" ).focus();
} );

// On click of the close button
$document.on( "click", "#theme-nav-dialog > button", function() {
	hideMenu();
	themeMenuBtn.focus();
} );

// Handle nav link clicks
$document.on( "click", "#theme-nav ul li a", function( event ) {
	let target = event.currentTarget,
		url = target.href;

	// If the link is already the current page or a placeholder, do nothing
	if ( target.classList.contains( "wb-navcurr" ) || target.getAttribute( "href" ) === "#" ) {
		event.preventDefault();
		return;
	}

	// If the link is outside Canada.ca, navigate to page as usual
	if ( !url.startsWith( location.origin ) ) {
		return;
	}

	event.preventDefault();

	hideMenu();
	loadThemeContent( url );
	updateNavState( url );

	history.pushState( { url: url }, "", url );
} );

// Handle browser Back / Forward buttons
window.addEventListener( "popstate", function( e ) {
	if ( e.state && e.state.url ) {
		loadThemeContent( e.state.url );
		updateNavState( e.state.url );
	}
} );

// Add the timer poke to initialize the plugin
wb.add( selector );

} )( jQuery, window, wb );
