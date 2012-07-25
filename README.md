#LightShow (JavaScript/JQuery Overlay)
============

LightShow is a JavaScript/JQuery plugin that helps you create amazingly simple overlays. Designed to be flexible and easy to use.

## Features

* Overlay the whole window or a specific element.
* No external CSS file needed. But still easy to style.
* Auto adjusts itself on window resize. Possible to manually adjust element (e.g. during animation, see: readapt).
<!--* Position. Automatically center align or align according to directives (e.g. top left) or specified element.-->
* Callbacks. Hook in when events occur.
* Close overlay using escape key.

## Usage

### Instantiation

	var overlay = $.lightShow({options});
	
*Notice: The instance returned is not a JQuery object.*
	
### Identity lookup

	var overlay = $.lightShow("lightshow-id");
	
### Method chaining (fluent interface)

	$.lightShow("lightshow-id").show().setContent("<h1>YUP WE'RE SETTING IT!!!!!</h1>").hide();

<!--
## Methods

### show
	
### hide
	
### setContent
	
### readapt
-->

## Options

### Id

String identity of this instance. E.g. if identity is 'login' then the instance is accessible by using:

	$.lightShow('login').show();

<!--
## Other options..

	{
		id, // default NULL
		parent: null, // default: 'top'
		overlay: "window", // default: "window".. But can be any element
		content: null, // Required: element or text (HTML)
		opacity: 0.85, // Default 0.75
		showOnStartup: false, // Default false
		closeButtonSelector: ".close-button", // Default ".close-button"
		closeOnEscape: true, // Default: true
		styling: {
			backgroundColor: "#000" // Overlay background color. Default "#000" (black)
		},
		callbacks: {
			initialization: {
				before: function(){},
				after: function(){}
			},
			show: {
				before: function(){},
				after: function(){}
			},
			hide: {
				before: function(){},
				after: function(){}
			}
		},
		effects: {
			show: function(element, finished){element.fadeIn(finished);},
			hide: function(element, finished){element.fadeOut(finished);}
		}
	}
-->

## Examples

### Full window overlay with static content
	$.lightShow({
		content: "<div>I CAN HAZ OVERLAY</div>",
		showOnStartup: true
	});
	
### Overlay with close button
	$.lightShow({
		content: "<div>I CAN HAZ OVERLAY DAT EZ CLOSABLE</div><a href='#' class='close-button'>close overlay</a>",
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