![Lightshow](http://github.com/ZapZapGo/lightshow.js/raw/master/examples/images/logo.png)
============

LightShow is a JavaScript/JQuery plugin that helps you create amazingly simple overlays. Designed to be flexible and easy to use.

## Features

* Overlay the whole window or a specific element.
* No external CSS file needed. But still easy to style.
* Auto adjusts itself on window resize. Possible to manually adjust element (e.g. during animation, see: readapt).
* Callbacks. Hook in when events occur.
* Effects. Use standard JQuery effects (toggle, fade, slide) or use your own.
* Close overlay using escape key.

### Planned

* Positioning. Position the content relative to the overlay according to directions (e.g. top center, middle center, bottom left, a.s.o.).

## Usage

### Instantiation

	var overlay = $.lightShow({options});
	
*Notice: The instance returned is not a JQuery object.*
	
### Identity lookup

	var overlay = $.lightShow("lightshow-id");
	
### Method chaining (fluent interface)

	$.lightShow("lightshow-id").show().setContent("<h1>YUP WE'RE SETTING IT!!!!!</h1>").hide();

## Options

### Id

String identity of this instance.

	id: "login"

 This means that if identity is 'login' then the instance is accessible by using:
 
	$.lightShow('login').show();
	
### Overlay

Default is 'window', but can also be any element, i.e.

	overlay: 'window' // default
===================
	overlay: $("#element-to-overlay")
	
### Content

Content that you want to place inside your overlay. This can be either a string (HTML) or an element, i.e.

	content: "<h1>My amazing content that I want in my overlay!</h1>"
===========================
	content: $("#element-to-use-as-content")

### Show on startup

Whether or not to run show() directly after initialization.

	showOnStartup: true // Default is false

Enabling this option is equal to doing the following:

	$.lightShow({/*options...*/}).show();

### Hide button selector

Selector used to identify buttons that close (hide) the overlay.

	hideButtonSelector: ".hide-button" // Default is '.hide-button'
====
This means that using the above selector you can have content with elements that match the specified selector, i.e.

	content: "<h1>Content!</h1><a href='#' class='hide-button'>Close overlay</a>"

### Hide on escape

Enabling this option means that pressing the escape key (ESC) automatically closes (hides) the overlay.

	hideOnEscape: true // Default is true

### Effect

Effects that run when the overlay is showing/hiding.

	effect: {
		default: {
			type: 'fade', // Default is 'fade', but can also be, 'slide' and 'toggle'
			duration: 500 // Time in milliseconds (ms) that the effect should animate
		}
	}
	
But it is also possible to override the default effects and use your own, i.e.

	effect: {
		show: function(element, complete_callback){
			element.css('display', 'block').zoomIn(500, complete_callback);
		},
		hide: function(element, complete_callback){
			element.zoomOut(500, complete_callback);
		}
	}


### Style

#### Overflow

Decides how content overflow is handled.

	style: {
		overflow: 'hidden', // Default is 'hidden'
	}

#### Opacity

Specifies the overlay opacity. From 0.0 (fully transparent) to 1.0 (fully opaque).

	style: {
		opacity: 0.85, // Default is 0.85
	}

#### Background color

Overlay background color. Note that this color is affected by the overlay opacity.

	style: {
		backgroundColor: "#000" // Default is '#000' (black)
	}
	
## Methods

### show

Shows the overlay and it's content (runs the 'show' animation).

	$.lightShow({/*options...*/}).show();
	
### hide

Hides the overlay and it's content (runs the 'hide' animation).

	$.lightShow({/*options...*/}).hide();
	
### setContent

Sets the content of the overlay. Value is same as the 'content' option, i.e.

	$.lightShow({/*options...*/}).setContent("<h1>My amazing content that I want in my overlay!</h1>");
===========================
	$.lightShow({/*options...*/}).setContent($("#element-to-use-as-content"));
	
### readapt

Repositions/dimensions the overlay and it's content. This can be used when you want to do animations on the content and want the overlay to stick with it.

	$("#element-in-overlay-content").animate({
		height: '50%'
	},{
		step: function(now, fx) {
			$.lightShow("my-overlay-id").readapt();
		}
	});
	
### release

Releases/removes all memory/elements associated with this instance. This can be used to clean up overlays.

	var overlay = $.lightShow({/*options...*/}); // Instantiate..
	overlay.release(); // Tell the instance to release all that it has allocated (variables, elements, etc..)
	overlay = null; // Necessary to fully release the object from memory

## Examples

### Full window overlay with static content
	$.lightShow({
		content: "<div>I CAN HAZ OVERLAY</div>",
		showOnStartup: true
	});
	
### Overlay with hide button
	$.lightShow({
		content: "<div>I CAN HAZ OVERLAY DAT EZ CLOSABLE</div><a href='#' class='hide-button'>close overlay</a>",
		showOnStartup: true
	});
	
### Overlay a specific element

	<div id="element-to-overlay">
		MY AWEZOME ELEMENT. OVERLAYYD.
	</div>

==============

	$.lightShow({
		overlay: $("div#element-to-overlay"),
		content: "<div>I CAN HAZ OVERLAY DAT EZ FOR A SPECEFEK ELEMENT</div>",
		showOnStartup: true
	});
	
## Browser Compatibility

* IE 9.0.8112.16421 - All features supported
* Chrome 20.0.1132.57 m - All features supported
* Firefox 14.0.1 - All features supported

## License (MIT)
	
	Copyright (C) 2012, Robin Orheden
	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
	The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Author

Robin Orheden