var _____WB$wombat$assign$function_____=function(name){return (globalThis._wb_wombat && globalThis._wb_wombat.local_init && globalThis._wb_wombat.local_init(name))||globalThis[name];};if(!globalThis.__WB_pmw){globalThis.__WB_pmw=function(obj){this.__WB_source=obj;return this;}}{
let window = _____WB$wombat$assign$function_____("window");
let self = _____WB$wombat$assign$function_____("self");
let document = _____WB$wombat$assign$function_____("document");
let location = _____WB$wombat$assign$function_____("location");
let top = _____WB$wombat$assign$function_____("top");
let parent = _____WB$wombat$assign$function_____("parent");
let frames = _____WB$wombat$assign$function_____("frames");
let opener = _____WB$wombat$assign$function_____("opener");
/** jQuery.bsf_appear
 * https://github.com/bas2k/jquery.bsf_appear/
 * http://code.google.com/p/jquery-bsf_appear/
 *
 * Copyright (c) 2009 Michael Hixson
 * Copyright (c) 2012 Alexander Brovikov
 * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)
 */
(function($) {
	$.fn.bsf_appear = function(fn, options) {
		var settings = $.extend({
			//arbitrary data to pass to fn
			data: undefined,
			//call fn only on the first bsf_appear?
			one: true,
			// X & Y accuracy
			accX: 0,
			accY: 0
		}, options);
		return this.each(function() {
			var t = $(this);
			//whether the element is currently visible
			t.bsf_appeared = false;
			if (!fn) {
				//trigger the custom event
				t.trigger('bsf_appear', settings.data);
				return;
			}
			var w = $(window);
			//fires the bsf_appear event when appropriate
			var check = function() {
				//is the element hidden?
				if (!t.is(':visible')) {
					//it became hidden
					t.bsf_appeared = false;
					return;
				}
				//is the element inside the visible window?
				var a = w.scrollLeft();
				var b = w.scrollTop();
				var o = t.offset();
				var x = o.left;
				var y = o.top;
				var ax = settings.accX;
				var ay = settings.accY;
				var th = t.height();
				var wh = w.height();
				var tw = t.width();
				var ww = w.width();
				if (y + th + ay >= b &&
					y <= b + wh + ay &&
					x + tw + ax >= a &&
					x <= a + ww + ax) {
					//trigger the custom event
					if (!t.bsf_appeared) t.trigger('bsf_appear', settings.data);
				} else {
					//it scrolled out of view
					t.bsf_appeared = false;
				}
			};
			//create a modified fn with some additional logic
			var modifiedFn = function() {
				//mark the element as visible
				t.bsf_appeared = true;
				//is this supposed to happen only once?
				if (settings.one) {
					//remove the check
					w.unbind('scroll', check);
					var i = $.inArray(check, $.fn.bsf_appear.checks);
					if (i >= 0) $.fn.bsf_appear.checks.splice(i, 1);
				}
				//trigger the original fn
				fn.apply(this, arguments);
			};
			//bind the modified fn to the element
			if (settings.one) t.one('bsf_appear', settings.data, modifiedFn);
			else t.bind('bsf_appear', settings.data, modifiedFn);
			//check whenever the window scrolls
			w.scroll(check);
			//check whenever the dom changes
			$.fn.bsf_appear.checks.push(check);
			//check now
			(check)();
		});
	};
	//keep a queue of bsf_appearance checks
	$.extend($.fn.bsf_appear, {
		checks: [],
		timeout: null,
		//process the queue
		checkAll: function() {
			var length = $.fn.bsf_appear.checks.length;
			if (length > 0) while (length--) ($.fn.bsf_appear.checks[length])();
		},
		//check the queue asynchronously
		run: function() {
			if ($.fn.bsf_appear.timeout) clearTimeout($.fn.bsf_appear.timeout);
			$.fn.bsf_appear.timeout = setTimeout($.fn.bsf_appear.checkAll, 20);
		}
	});
	//run checks when these methods are called
	$.each(['append', 'prepend', 'after', 'before', 'attr',
		'removeAttr', 'addClass', 'removeClass', 'toggleClass',
		'remove', 'css', 'show', 'hide'], function(i, n) {
		var old = $.fn[n];
		if (old) {
			$.fn[n] = function() {
				var r = old.apply(this, arguments);
				$.fn.bsf_appear.run();
				return r;
			}
		}
	});
})(jQuery);
}

/*
     FILE ARCHIVED ON 12:28:06 Apr 23, 2025 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 20:16:50 Jul 15, 2026.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 0.73
  exclusion.robots: 0.117
  exclusion.robots.policy: 0.102
  esindex: 0.011
  cdx.remote: 20.919
  LoadShardBlock: 68.882 (3)
  PetaboxLoader3.datanode: 155.432 (4)
  PetaboxLoader3.resolve: 541.717 (2)
  load_resource: 637.312
*/