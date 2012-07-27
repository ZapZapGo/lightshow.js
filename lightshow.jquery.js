/*LightShow v0.7
http://www.github.com/zapzapgo/lightshow.js/
http://raw.github.com/ZapZapGo/lightshow.js/master/license.txt*/
var ZapZapGo = window.ZapZapGo || {};

ZapZapGo.log = ZapZapGo.log || function(message){}

ZapZapGo.LightShow = function(options){
	this.options = $.extend(true, {}, ZapZapGo.LightShow.default_options, options);
	this.initialize();
}

ZapZapGo.LightShow.initialize = function(){
	if(!ZapZapGo.LightShow.is_initialized){
		ZapZapGo.LightShow.is_initialized = true;
		ZapZapGo.LightShow.registerKeyCommands();
	}
}

ZapZapGo.LightShow.registerKeyCommands = function(){
	$(document).keydown(function(e) {
	    if (e.keyCode == 27) { // Escape key
	    	var highest_z_index = 0;
	    	var top_instance = null;

	    	// Currently scans.. Quick fix. Will be replaced by a stack instead.
	    	$.each(ZapZapGo.LightShow.instances, function(key, value){
	    		if(value.isVisible() && value.z_index_base > highest_z_index){
	    			highest_z_index = value.z_index_base;
	    			top_instance = value;
	    		}
	    	});

	    	if(top_instance && top_instance.options.hideOnEscape){
	    		top_instance.hide();
	    	}
	    }
	});
}

// Lookup of registered instances
ZapZapGo.LightShow.instances = {};

// Flag that indicates whether the global initialization has been done
ZapZapGo.LightShow.is_initialized = false;

// Index for instances without explicit id set
ZapZapGo.LightShow.implicit_id_offset = 0;

// Current highest z-index
ZapZapGo.LightShow.current_z_index = -1;

// Default configuration for all instances
ZapZapGo.LightShow.default_options = {
	id: "null",
	overlay: "document",
	content: null,
	showOnStartup: false,
	hideButtonSelector: ".hide-button",
	hideOnEscape: true,
	style: {
		opacity: 0.85,
		overflow: 'hidden',
		background: null,
		backgroundColor: "#000",
	},
	callback: {
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
	effect: {
		type: 'fade',
		duration: 500,
		show: null,
		hide: null
	}
};

ZapZapGo.LightShow.getHighestZIndex = function(selector){
	var highest_z_index = 0;

	$(selector).each(function() {
	    var element_index = ZapZapGo.LightShow.getElementZIndex($(this));
	    if (element_index > highest_z_index){
	        highest_z_index = element_index;
	    }
	});

	return highest_z_index;
}

ZapZapGo.LightShow.getElementZIndex = function(element){
	return parseInt(element.css("zIndex"), 10);
}

ZapZapGo.LightShow.getInternalId = function(id){
	return "ls-" + (id == null ? "unnamed-" + (++ZapZapGo.LightShow.implicit_id_offset) : id);
}

ZapZapGo.LightShow.showAll = function(){
	$.each(ZapZapGo.LightShow.instances, function(key, value){
		value.show();
	});
}

ZapZapGo.LightShow.hideAll = function(){
	$.each(ZapZapGo.LightShow.instances, function(key, value){
		value.hide();
	});
}

// Determines whether this instance is initialized or not
ZapZapGo.LightShow.prototype.is_initialized = false;

// Determines whether this light shadow element is visible or not
ZapZapGo.LightShow.prototype.is_visible = false;

// Source (document/element) in which the overlay will automatically adapt it's dimension to
ZapZapGo.LightShow.prototype.resize_source = null;

// Element that overlays all other content
ZapZapGo.LightShow.prototype.overlay_element = null;

// Element containing all of the light shadow content
ZapZapGo.LightShow.prototype.content_element = null;

// Z-index in which the element base from
ZapZapGo.LightShow.prototype.z_index_base = -1;

// Determines whether or not there are undimensioned elements
// to wait for until we can run any effect (show/hide)
ZapZapGo.LightShow.prototype.effect_wait_for_load = false;

// Callback to effect that was executed before elements was loaded.
ZapZapGo.LightShow.prototype.effect_deferred_callback = null;

ZapZapGo.LightShow.prototype.initialize = function(){
	var outer_scope = this;

	if(!this.options.is_initialized){
		this.options.is_initialized = true;
		this.options.callback.initialization.before(this);

		if(!ZapZapGo.LightShow.is_initialized){
			ZapZapGo.LightShow.initialize();
		}

		if(this.options.overlay){
			outer_scope.effect_wait_for_load = true;
			// Ensure that all elements are loaded and dimensioned..
			// Once they are.. Call any effect (show/hide) if previously called.
			outer_scope.waitUntilDimensioned(
				$("img, iframe, script", this.options.overlay), function(){
					outer_scope.effect_wait_for_load = false;
					outer_scope.effect_deferred_callback && outer_scope.effect_deferred_callback();
					outer_scope.effect_deferred_callback = null;
				}, 50, true
			);
		}

		// Set content and add the overlay
		this.setContent(this.options.content);
		this.initializeOverlay();

		this.setEffect(this.options.effect.type,
			this.options.effect.duration);

		this.readapt(true);

		if(this.options.showOnStartup){
			this.show();
		}

		this.options.callback.initialization.after(this);
	}
}

ZapZapGo.LightShow.prototype.initializeOverlay = function(){
	var outer_scope = this;
	if(!this.overlay_element){
		var element = this.createContainer();

		// Set the source in which the overlay should adjust to
		this.resize_source = outer_scope.isDocumentOverlay() ? $(document) : this.options.overlay;
		var overlay_offset = outer_scope.isDocumentOverlay() ? {top:0,left:0} : this.options.overlay.position();

		element.attr('id', this.options.id + "-overlay").addClass("ls-overlay")
			.css({
				'top': overlay_offset.top,
				'left': overlay_offset.left,
				'background': this.options.style.background ? this.options.style.background : this.options.style.backgroundColor,
				'background-color': this.options.style.backgroundColor,
				'opacity': this.options.style.opacity
			});

		this.overlay_element = element;
		$("body").append(element);
	}
}

ZapZapGo.LightShow.prototype.createContainer = function(){
	return $("<div />")
		.hide()
		.css({
			'position':'absolute',
			'height': 0, 'width': 0,
			'top':'0px', 'left':'0px',
			'padding': '0px', 'margin': '0px',
			'overflow':this.options.style.overflow
		});
}

ZapZapGo.LightShow.prototype.isVisible = function(){
	return this.is_visible;
}

ZapZapGo.LightShow.prototype.isElementOverlay = function(){
	return this.options.overlay && this.options.overlay != "document";
}

ZapZapGo.LightShow.prototype.moveToTop = function(){
	var light_shadow = ZapZapGo.LightShow;

	// Set the z-index starting point (top index of all elements)
	if(light_shadow.current_z_index == -1){
		light_shadow.current_z_index = light_shadow.getHighestZIndex("*") + 1000;
	}

	// Set the z-index base for this instance
	this.z_index_base = this.isElementOverlay() ?
		ZapZapGo.LightShow.getElementZIndex(this.options.overlay) + 1 :
		light_shadow.current_z_index += 100;

	this.overlay_element.css('z-index', this.z_index_base + 5);
	this.content_element.css('z-index', this.z_index_base + 10);

	return this;
}

ZapZapGo.LightShow.prototype.show = function(finished_callback){
	var outer_scope = this;

	if(this.effect_wait_for_load){
		this.effect_deferred_callback = function(){
			outer_scope.readapt();
			outer_scope.show(finished_callback);
		};

		return;
	}

	if(!this.is_visible){
		this.is_visible = true;
		outer_scope.options.callback.show.before(this);

		if(this.z_index_base == -1){
			this.moveToTop();
		}

		outer_scope.options.effect.show(outer_scope.overlay_element, function(){});
		outer_scope.options.effect.show(outer_scope.content_element, function(){
			finished_callback && finished_callback();
			outer_scope.options.callback.show.after(outer_scope);
		});
	}

	return this;
}

ZapZapGo.LightShow.prototype.hide = function(finished_callback){
	var outer_scope = this;

	if(this.effect_wait_for_load){
		this.effect_deferred_callback = function(){
			outer_scope.readapt();
			outer_scope.hide(finished_callback);
		};

		return;
	}

	if(this.is_visible){
		this.is_visible = false;
		this.options.callback.hide.before(this);

		this.options.effect.hide(this.overlay_element, function(){});
		outer_scope.options.effect.hide(outer_scope.content_element, function(){
			finished_callback && finished_callback();
			outer_scope.options.callback.hide.after(outer_scope);
		});

		this.options.callback.hide.after(this);
	}
	
	return this;
}

// Releases/removes all memory/elements that we've associated with this object.
// If any variables are set outside.. These must be released manually.
ZapZapGo.LightShow.prototype.release = function(){
	// Removes elements and attached events from DOM
	this.overlay_element.remove(); this.content_element.remove();
	this.overlay_element = this.content_element = null;

	delete ZapZapGo.LightShow.instances[this.options.id];
}

// Waits (scans) until elements are fully loaded (completed) or has been given visible dimensions.
// This can probably be implemented by just using events (load). But had some troubles using it (not that reliable..) so implemented it like this meanwhile.
// Will have to review this later.... later :)
ZapZapGo.LightShow.prototype.waitUntilDimensioned = function(elements, completed_callback, scan_interval){
	var completion_check_callback;

	completion_check_callback = function(elements){
		var pending_elements = [];

		// Scan for uncompleted elements (pending).
		// If elements are uncompleted, they will be scanned again next round..
		$(elements).each(function(){
			if(!this.complete && this.readyState !== 4){
				if(!($(this).width() > 0 && $(this).height() > 0)){
					pending_elements.push(this);
				}
			}
		});

		if(pending_elements.length == 0){
			completed_callback();
		}else{
			setTimeout(function(){
				completion_check_callback(pending_elements);
			}, scan_interval);
		}
	};

	completion_check_callback(elements);
};

ZapZapGo.LightShow.prototype.isDocumentOverlay = function(){
	return this.options.overlay == 'document';
}

ZapZapGo.LightShow.prototype.readapt = function(add_resize_events){
	var outer_scope = this;

	var resize_callback = function(){
		if(!outer_scope.effect_wait_for_load){
			var overlay_offset = outer_scope.isDocumentOverlay() ? {top:0,left:0} :
				outer_scope.options.overlay.position();

			var element_dimensions = {
				'top': overlay_offset.top,
				'left': overlay_offset.left,
				'width': outer_scope.resize_source.outerWidth(),
				'height': outer_scope.resize_source.outerHeight()
			};

			outer_scope.overlay_element.css(element_dimensions);
			outer_scope.content_element.css(element_dimensions);
		}
	};

	if(add_resize_events){
		$(window).resize(resize_callback);
		var all_elements_loaded = true;

		$("img, iframe, script", outer_scope.options.overlay).load(resize_callback).each(function() {
			if(this.complete || (jQuery.browser.msie && parseInt(jQuery.browser.version) == 6)){
				$(this).trigger("load");
			}
		});

		// Element resize event is unsupported.. Meaning overlay will not automatically adapt to content if it's resized..
		// Will have to add support for polling and checking the element for changes in pos/dimension in order to get it to work.
		// Basically same as: http://benalman.com/projects/jquery-resize-plugin/
		this.resize_source.resize(resize_callback);
	}

	resize_callback();

	return this;
}

ZapZapGo.LightShow.prototype.setEffect = function(type, duration){
	var show, hide = null;

	switch(type){
		case "fade":
			show = function(element, callback){element.fadeIn(duration, callback);};
			hide = function(element, callback){element.fadeOut(duration, callback);};
			break;
		case "slide":
			show = function(element, callback){element.slideDown(duration, callback);};
			hide = function(element, callback){element.slideUp(duration, callback);};
			break;
		case "toggle":
			show = function(element, callback){element.show(duration, callback);};
			hide = function(element, callback){element.hide(duration, callback);};
			break;
		default:
			ZapZapGo.log("Invalid effect type '" + type + "'. Effect does not exist.");
			break;
	}

	if(show && hide){
		if(!this.options.effect.show){
			this.options.effect.show = show;
		}
		if(!this.options.effect.hide){
			this.options.effect.hide = hide;
		}
	}

	return this;
}

ZapZapGo.LightShow.prototype.setContent = function(value){
	var outer_scope = this;

	if(this.content_element){
		this.content_element.remove();
		this.content_element = null;
	}

	var content = ((typeof value).toLowerCase() == 'string') ?
		$(value) : ((value instanceof jQuery) ? value : null);

	if(content){
		var element = this.createContainer()
			.addClass('ls-content')
			.append(content);
		
		if($(this.options.hideButtonSelector, element).length > 0){
			$(this.options.hideButtonSelector, element).click(function(){
				outer_scope.hide();
				return false;
			});
		}

		this.content_element = element;
		$("body").append(element);
	}else{
		ZapZapGo.log("Unable to set content. Content neither JQuery element or string (HTML).");
	}

	return this;
}

// Add JQuery support

var JQuery = JQuery || $ || {};

jQuery.lightShow = function(value){
	var instance;
	var light_show = ZapZapGo.LightShow;

	if((typeof value).toLowerCase() == 'string'){
		var id = light_show.getInternalId(value);
		// Identity.. Look it up and return it.
		if(id in light_show.instances){
			instance = light_show.instances[id];
		}else{
			ZapZapGo.log("Invalid ID '" + id + "'. LightShadow instance not found.");
		}
	}else{
		var id = value.id = light_show.getInternalId(value.id);
		if(id in light_show.instances){
			ZapZapGo.log("LightShadow instance ID '" + id + "' already used. Please select another one");
		}else{
			// Options.. Create a new object and return it.
			instance = light_show.instances[id] = new light_show(value);
		}
	}

	return instance;
}