/*
	jQuery floating header plugin v1.4.0
	Licenced under the MIT License	
	Copyright (c) 2009, 2010, 2011 
		Erik Bystrom <erik.bystrom@gmail.com>

	Contributors:
		Elias Bergqvist <elias@basilisk.se>
		Diego Arbelaez <diegoarbelaez@gmail.com>
		Glen Gilbert	
		Vasilianskiy Sergey		
		Stephen J. Fuhry
      Jason Axley
*/ 
(function($){
	/**
	 * Clone the table header floating and binds its to the browser scrolling
	 * so that it will be displayed when the original table header is out of sight.
	 *
	 * The plugin defines two function on the table element.
	 * 	fhRecalculate	Recalculates with column widths of the floater.
	 *	fhInit			Recreates the floater from the source table header.
	 *
	 * @param config
	 *		An optional dictionary with configuration for the plugin.
	 *		
	 *		fadeOut		The length of the fade out animation in ms. Default: 200
	 *		fadeIn		The length of the face in animation in ms. Default: 200
	 *		forceClass	Forces the plugin to use the markerClass instead of thead. Default: false
	 *		markerClass The classname to use when marking which table rows that should be floating. Default: floating
	 *		floatClass	The class of the div that contains the floating header. The style should
	 *					contain an appropriate z-index value. Default: 'floatHeader'
	 *		cbFadeOut	A callback that is called when the floating header should be faded out.
	 *					The method is called with the wrapped header as argument.
	 *		cbFadeIn	A callback that is called when the floating header should be faded in.
	 *					The method is called with the wrapped header as argument.
	 *     containerDivId       A DIV this would be bind to slider move, so that on moving slider floating header also move along
	 *     scrollElement        By default scroll event attached to BODY element, but can pass the argument,
	 *     					    to which scroll event should bind.
	 *     attachEventToInitFloatTable    A callback function to process main screen content on changing values in Floating Table.
	 *     
	 *		recalculate	Recalculate the column width on every scroll event
	 *
	 * @version 1.4.0
    * @see http://blog.slackers.se/2009/07/jquery-floating-table-header-plugin.html
	 */
	$.fn.floatHeader = function(config) {
		config = $.extend({
			enableFade: true,
			hideProperty: 'display',
			fadeOut: 200,
			fadeIn: 200,
			forceClass: true,
			markerClass: 'floating',
			floatClass: 'floatHeader',
			recalculate: false,
			IE6Fix_DetectScrollOnBody: true,
			scrollElement: $('body'),
			containerDivId: null,
			attachEventToInitFloatTable: null,
			scrollNameSpace:null,
			leftNav: true, // Required.  Specify whether screen has leftNav or not.
			appendToElement: null
		}, config);	
		
		var buildfloatBoxString = function () {
			var containerDivId = config.containerDivId;			
			var floatBoxString = '<div ';
         	
         	if (containerDivId)
			{
         		floatBoxString += 'id="'+containerDivId+'" ';
			}
         	if (!config.enableFade)
         	{
         		switch (config.hideProperty)
         		{
         			case 'display' :
         				floatBoxString += 'style="display:none" '; 
         				break;
         				
         			case 'visibility' :
         				floatBoxString += 'style="visibility:hidden" ';
         				break;
         		}
         	}
         	
         	floatBoxString += 'class="'+config.floatClass+'" />';
         	
         	return floatBoxString;
		};

		
		return this.each(function () {	
			var self = $(this);
           
			//alert("config.fadeOut" + config.fadeOut);
			//alert("config.scrollElement" + config.scrollElement.attr("tagName"));
			
         var tableClone = self[0].cloneNode(false);  // only perform a shallow copy
         var table = $(tableClone);
         table.attr("onmouseover", "");
         var cloneId = table.attr("id") + "FloatHeaderClone";
         table.attr("id", cloneId); // change the ID to avoid conflicts
         table.parent().remove();   // remove any existing float box divs for this same grid.  we may be reinitializing and don't want to keep adding these to the DOM

         	self.floatBox = $(buildfloatBoxString());
         	
			self.floatBox.append(table);
			// Fix for the IE resize handling
			self.IEWindowWidth = document.documentElement.clientWidth;
			self.IEWindowHeight = document.documentElement.clientHeight ;
			
         // DO NOT create the floater yet.  
         // Lazy-load and create it only when neccessary to improve page load time

			
			var scrollElement = config.scrollElement; 
			
			if("BODY" == scrollElement.attr("tagName") && !config.IE6Fix_DetectScrollOnBody)
			{
				scrollElement = $(window);
			}
			
			var scrollNS = config.scrollNameSpace;
			if(scrollNS==null)
			{
				scrollNS = 'floatHeader';
			}
		
			var floatBoxHeight = $('.floating').height();
			// bind to the scroll event
			scrollElement.bind('scroll.'+scrollNS, function() {
				if (self.floatBoxVisible) {
					
					if (!showHeader(self, self.floatBox, scrollElement))
					{
						// kill the floatbox
						self.floatBoxVisible = false;
						if (config.enableFade)
						{
							if (config.cbFadeOut) {
								config.cbFadeOut(self.floatBox);
							} else {
								self.floatBox.stop(true, true);
								self.floatBox.fadeOut(config.fadeOut);
							}
						}
						else
						{
							switch (config.hideProperty)
							{
								case 'display' :
									self.floatBox.css('display', 'none');
									break;
									
								case 'visibility' :
									self.floatBox.css('visibility', 'hidden');
									break;
							}
						}
					}
            } else if (showHeader(self, self.floatBox, scrollElement)) {
               // populate the floating header now in case it is needed (lazy load)
               // and only if we haven't yet filled in the header details
               if (table.children().length == 0) {
                  createFloater(table, self, config);
               }
               else
            	   { 
            	   // If table is already exists then create table to synch with changes done in original table. 
            	    self.floatBox.fastempty();
            	   	var tableClone = self[0].cloneNode(false);  // only perform a shallow copy
            	   	table = $(tableClone);
            	   	/* Tracker#: 21018 - SAFARI/FIREFOX: POM CODES DISPLAY IS BROKEN IN FITEVAL AND SIZE SET SCREEN
            	   	 * Issue - Table being cloned had a height set.
            	   	 * Fix - Set height: auto.
            	   	 */
            	   	table.height('auto');
            	   	table.attr("onmouseover", "");
            	   	var cloneId = table.attr("id") + "FloatHeaderClone";
            	   	table.attr("id", cloneId); // change the ID to avoid conflicts
            	   	table.parent().remove();   // remove any existing float box divs for this same grid.  we may be reinitializing and don't want to keep adding these to the DOM
          			self.floatBox.append(table);
          			createFloater(table, self, config);
            	   }
						
					self.floatBoxVisible = true;
					
					self.floatBox.css('position', 'absolute');
					
					if (config.enableFade)
					{
						if (config.cbFadeIn) {
							config.cbFadeIn(self.floatBox);
						} else {
							self.floatBox.stop(true, true);					
							self.floatBox.fadeIn(config.fadeIn);
						}
					}
					else
					{
						switch (config.hideProperty)
						{
							case 'display' :
								self.floatBox.css('display', 'block');
								break;
								
							case 'visibility' :
								self.floatBox.css('visibility', 'visible');
								break;
						}
					}
				}
				
				// if the box is visible update the position
				if (self.floatBoxVisible) {
					
					var parentDiv = self.parent();
					var tableParentDivWidth = parentDiv.outerWidth();
					var dataWorkAreaPosition = $('#_divDataWorkArea').position();
					var offset = parentDiv.offset();
					
					// if there is left nav, take its width into account.
					if (config.leftNav)
						{
							self.floatBox.css({
								top : dataWorkAreaPosition.top,
								left : offset.left - nMenuWidth + 4,
								width : tableParentDivWidth,
								overflow: 'hidden'
							});

						}
					else
						{
							self.floatBox.css({
							top : $(window).scrollTop(),
							left : offset.left,
								width : tableParentDivWidth,
								overflow: 'hidden'
							});
						}
										
					// Set cloned container div's scroll left to be same as original container div's scroll left.
					self.floatBox.scrollLeft( self.parent().scrollLeft() );
					if (config.recalculate) {		
						recalculateColumnWidth(table, self, config);
					}
				}
			});//bind scroll handler closes
			
			/*
			 * Unfortunately IE gets rather stroppy with the non-IE version,
			 * constantly resizing, thus cooking your CPU with 100% usage whilest
			 * the browser crashes. So, test for IE and add additional code.
			 */
			if ($.browser.msie && $.browser.version <= 7) {
				$(scrollElement).resize(function() {					
					// Check if the window size has changed ()
					if ((self.IEWindowWidth != document.documentElement.clientWidth) || (self.IEWindowHeight != document.documentElement.clientHeight)) {
						// Update the client width and height with the Microsoft version.
						self.IEWindowWidth = document.documentElement.clientWidth;
						self.IEWindowHeight = document.documentElement.clientHeight;

                  if (table.children().length > 0) {
                     table.fastempty();
                     createFloater(table, self, config);
                  }
					}
				});
			} else {
				// bind to the resize event
				$(scrollElement).resize(function() {
 	            // Only redo the header cells if we have created them already
               if (table.children().length > 0) {
                  table.fastempty();
                  createFloater(table, self, config);
               }
				});
			};			

			// append the floatBox to the dom
    		var appendToElement = config.appendToElement;
			if (appendToElement)
    		{
    			$(appendToElement).append(self.floatBox)
    		}
			else
			{
    		var $dataWorkArea = $('#_divDataWorkArea'),
    			$dataWorkAreaParent = $dataWorkArea.parent();
    		$dataWorkAreaParent.append(self.floatBox);
			}
    		
        	
        	// connect some convenience callbacks
			this.fhRecalculate = function() {
				recalculateColumnWidth(table, self, config);
			};
			
			this.fhInit = function() {
         	// Only redo the header cells if we have created them already
            if (table.children().length > 0) {
                table.fastempty();
                createFloater(table, self, config);
            }	
			};

         /// Creating an alternative to the jquery empty() API that is optimized for cases where you know that there are not any event handlers left on the nodes in the container you are emptying
         /// Otherwise, you could experience memory leaks.  empty() is very slow because it has to visit every DOM element and delete it individually.
         /// This function will clear out all child elements using DOM APIs. Note:  you CANNOT use innerHTML = '' as a general solution because in IE innerHTML is read-only for many, many container nodes.
         $.fn.fastempty = function() {
           if (this[0]) {        	   
              while (this[0].hasChildNodes()) {
                   this[0].removeChild(this[0].lastChild);
               }
              
              
           }

           return this;
         };
		});
	};
	
	/**
	 * Copies the template and inserts each element into the target.
	 */
	function createFloater(target, template, config) {
		target.width(template.width());
		var attachEventToInitFloatTable = config.attachEventToInitFloatTable;
		var items;
		if (!config.forceClass && template.children('thead').length > 0) {
			// set the template to the children of thead
			items = template.children('thead').eq(0).children();
			var thead = jQuery("<thead/>");
			target.append(thead);
			target = thead;
		} else {
			// set the template to the class marking
			items = template.find('.'+config.markerClass);
		}		
		
		// iterate though each row that should be floating
		items.each(function() {
			var row = $(this);
         // avoid deep clone, then removal the nodes you just cloned
         var rowClone = row[0].cloneNode(false); 
         var floatRow = $(rowClone);

			// adjust the column width for each header cell
			row.children().each(function() {
				var cell = $(this);
				var floatCell = cell.clone();
				
				floatCell.width(cell.width());
				
				if(attachEventToInitFloatTable!=null && typeof(attachEventToInitFloatTable)=="function")
				{
					attachEventToInitFloatTable(floatCell, floatRow);
				}

				floatRow.append(floatCell);
			});

			// append the row to the table
			target.append(floatRow);
		});
	}
	
	/**
	 * Recalculates the column widths of the floater.
	 */
	function recalculateColumnWidth(target, template, config) {
		target.width(template.width());
		var src;
		var dst;
		if (!config.forceClass && template.children('thead').length > 0) {
			src = template.children('thead').eq(0).children().eq(0);
			dst = target.children('thead').eq(0).children().eq(0);
		} else {
			src = template.find('.'+config.markerClass).eq(0);
			dst = target.children().eq(0);
		}
		
		dst = dst.children().eq(0);
		src.children().each(function(index, element) {
			dst.width($(element).width());			
			dst = dst.next();
		});
	}
	
	/**
	 * Determines if the element is visible
	 */
	function showHeader(element, floater, scrollElement) {
		var elem = $(element);
		var top = $(scrollElement).scrollTop();
		var y0 = elem.offset().top;
		var fltbxtop = floater.offset().top;
		// alert("y0 = " + y0 + "\n top " + top  +"\n elem.height()" + elem.height() +"\n floater.height()" + floater.height()+ "\n (y0 <= top) " + (y0 <= top)+"\n floater top=="+fltbxtop);
		if(!scrollElement.attr('tagName'))// If scroll Element is window or body
			{
				return y0 <= top;
			}
		else
			{
				return y0 <= top && y0 <=fltbxtop; // If scroll Element is other than window or body.
			}
	}
})(jQuery);
