/*
 *  jCollapsible - Makes any nested list collapsible by adding an icon to the left of it
 *  Copyright 2010 Monjurul Dolon, http://mdolon.com/
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://devgrow.com/simple-threaded-comments-with-jcollapsible
 */
$.fn.collapsible = function(options) {
	var defaults = {defaulthide: true, symbolhide: '-', symbolshow: '+', imagehide: null, imageshow: null, xoffset: '-15', yoffset: '0'};
	var opts = $.extend(defaults, options); var o = $.meta ? $.extend({}, opts, $$.data()) : opts; var obj = $(this);
	if(o.imageshow) o.symbolshow = '<img class="jc-show" border="0" src="'+o.imageshow+'" style="display:block;">';
	if(o.imagehide) o.symbolhide = '<img class="jc-hide" border="0" src="'+o.imagehide+'" style="display:block;">';
	var startsymbol = o.symbolshow;
	$('li', obj).each(function(index) {
		if($('>ul, >ol',this).size() > 0){
			if(o.defaulthide) $('>ul, >ol',this).hide(); else startsymbol = o.symbolhide;
			$(this).prepend('<a href="" class="jcollapsible" style="position:absolute;outline:0;left:'+o.xoffset+'px;top:'+o.yoffset+'px;">'+startsymbol+'</a>').css('position','relative');
		}
	});
	$('.jcollapsible', obj).click(function(){
		var parent = $(this).parent();
		$('>ul, >ol',parent).slideToggle('fast');
		$(this).html($(this).children().attr('src').substr($(this).children().attr('src').lastIndexOf('/')) == o.imageshow.substr(o.imageshow.lastIndexOf("/")) ? o.symbolhide : o.symbolshow);
		return false;
	});
};
