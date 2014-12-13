/**
 * Function outside plug-in that makes the rows of two tables draggable.
 * This function is to simplify using the plug-in for our purposes, which
 * requires two calls to the plug-in (one for each table).
 * Optional parameters - pass in null if not used:
 *     table2, dropFunc, dragStartFunc.
 * useRowClone - boolean to enable/disable default ondrag row clone of single row.
 * defaultMoveRows - boolean indicating whether to use default single row move on drop.
*/
var makeTablesDraggable = function (table1, table2, dropFunc, dragStartFunc, useRowClone, defaultMoveRows,
		scrollElementSelector) {
	var tbl1 = $(document.getElementById(table1));
	var tbl2 = (table2 != null || table2 != undefined) ? $(document.getElementById(table2)): null;
	var freezeRowStartIndex = _getFreezeRowStartIndex(document.getElementById(table1));
    tbl1.add(tbl2).removeAttr('onmouseover');
    
	var onDropFunc = function (from,to,rows1,rows2, doNotSave) {
		jQuery.tableDnD.dragging = false;
		if (useRowClone)
		{
			jQuery.tableDnD.helper.remove();
		    //$(document).unbind('mousemove.clone');
			rows1.add(rows2).css('visibility', 'visible');
        }
            
		   	dropFunc(from,to,rows1,rows2, doNotSave);
	};
		
	var createClones = function (rows1, rows2) {
        var clone1 = rows1.clone(false).removeAttr('id')
        .removeAttr('onmouseover')
        .removeAttr('onmouseout');
            
        if (rows2)
	    {
			var clone2 = rows2.clone(false).removeAttr('id')
			.removeAttr('onmouseover')
			.removeAttr('onmouseout');
	    }
	    
			return {
				clone1 : clone1,
				clone2 : clone2
			};
	};

	var createSettings = function (variableSettings) {
		return $.extend({
			afterDragStart : multiRowDragDrop.afterDragStart,
	        onDragClone : useRowClone,
	        defaultMoveRows : defaultMoveRows,
	        scrollElementSelector : scrollElementSelector
		}, variableSettings);
	};

	    
    tbl1.tableDnD( createSettings({
	currentTable2 : tbl2,
	noDrag : freezeRowStartIndex+1,
	onDrop : onDropFunc,
	onDragStart : function (rows1, rows2, e, rowNumWRTTable, startPosition, allRowsHeight) {
        jQuery.tableDnD.dragging = true;
            
        // if enable using single POM code row drag & drop clone
        if (useRowClone)
        {
        	var clones = createClones(rows1, rows2),
        		clone1 = clones.clone1,
        		clone2 = clones.clone2;
    	    
		    rows1.css('visibility', 'hidden');
		    if (rows2)
		    {
		    	rows2.css('visibility', 'hidden');
		    }
		        
		    if (rows2)
		    {
		    	clone2.each(function (i) {
		    		clone1.eq(i).append($(this).html());
		    	});
		    }
		    
		    // Tracker#: 19437 - PLM POM PAGE LOAD SLOW PERFORMANCE
		    clone1.eq(0).height(rows2.eq(0).height());
		    
		    var combinedClone = clone1;
		    var finalClone = $('<table><tbody></tbody></table>');
		
		    jQuery.tableDnD.helper = finalClone;
		        
		    combinedClone.each(function (i) {
		    	finalClone.append(combinedClone.eq(i));
		    });
		
		    var offset = rows1.offset();
		        
		    $('body').append(finalClone);
		    
		    finalClone.css({
		        position : 'absolute',
		        top : offset.top,
		        left: offset.left,
		        backgroundColor : '#006699'
		        })
		    .data({
		        mouseY : e.pageY,
		        mouseX : e.pageX
		        });
		    
		    jQuery.tableDnD.finalClone = finalClone;
	    }
	    else
	    {
	    	multiRowDragDrop.onDragStart(rows1, rows2, e, rowNumWRTTable, startPosition, allRowsHeight);
	    }
        
		}

    }) );
	if (tbl2)
	{
		tbl2.tableDnD( createSettings({
		    currentTable2 : tbl1,
		    noDrag : freezeRowStartIndex+1,
			onDrop : onDropFunc,
			onDragStart : function (rows1, rows2, e, rowNumWRTTable, startPosition, allRowsHeight) {
				jQuery.tableDnD.dragging = true;
		
		        if (useRowClone)
		        {
	            	var clones = createClones(rows1, rows2),
		        		clone1 = clones.clone1,
		        		clone2 = clones.clone2;
		    
	            	rows1.add(rows2).css('visibility', 'hidden');
		        
		
			        clone2.each(function (i) {
			            clone1.eq(i).prepend($(this).html());
			        });
			        var combinedClone = clone1;
			        var finalClone = $('<table><tbody></tbody></table>');
			        jQuery.tableDnD.helper = finalClone;
			        
			        combinedClone.each(function (i) {
			            finalClone.append(combinedClone.eq(i));
			        });
			
			        //var offset = rows2.offset();
			        
			        $('body').append(finalClone);
			        
			        finalClone.css({
			            position : 'absolute',
			            top : rows1.offset().top,
			            left : rows2.offset().left,
			            backgroundColor : '#006699'
			            })
			        .data({
			            mouseY : e.pageY,
			            mouseX : e.pageX
			            });
			        
			        jQuery.tableDnD.finalClone = finalClone;
		        }
	            else
	            {
	            	multiRowDragDrop.onDragStart(rows2, rows1, e, rowNumWRTTable, startPosition, allRowsHeight);
	            }
		            
	        }
		        
		}) );
    }
};
	




/**
 * TableDnD plug-in for JQuery, allows you to drag and drop table rows
 * You can set up various options to control how the system will work
 * Copyright (c) Denis Howlett <denish@isocra.com>
 * Licensed like jQuery, see http://docs.jquery.com/License.
 *
 *
 * Configuration options:
 * 
 * noDrag
 * 	This is the number of rows at the top of the tables that will not be draggable.
 * onRowSwitch
 *	Pass a function that is called when two rows (and their rowspanned rows) switch positions.  The function
 *	takes 4 parameters: dragged rows in 1st table, dragged rows in 2nd table, rows switched with dragged
 *	rows in 1st table, rows switched with dragged rows in 2nd table.  All are jQuery Objects.
 * onDragStyle
 *     This is the style that is assigned to the row during drag. There are limitations to the styles that can be
 *     associated with a row (such as you can't assign a border--well you can, but it won't be
 *     displayed). (So instead consider using onDragClass.) The CSS style to apply is specified as
 *     a map (as used in the jQuery css(...) function).
 * onDropStyle
 *     This is the style that is assigned to the row when it is dropped. As for onDragStyle, there are limitations
 *     to what you can do. Also this replaces the original style, so again consider using onDragClass which
 *     is simply added and then removed on drop.
 * onDragClass
 *     This class is added for the duration of the drag and then removed when the row is dropped. It is more
 *     flexible than using onDragStyle since it can be inherited by the row cells and other content. The default
 *     is class is tDnD_whileDrag. So to use the default, simply customise this CSS class in your
 *     stylesheet.
 * onDrop
 *     Pass a function that will be called when the row is dropped. The function takes 4 parameters: the 2 tables
 *     and the 2 sets of rows that were dropped. You can work out the new order of the rows by using
 *     table.rows.   All are jQuery Objects.
 * onDragStart
 *     Pass a function that will be called when the user starts dragging. The function takes 2 parameters: the
 *     table and the row which the user has started to drag.
 * -Do Not Use- onAllowDrop
 *     Pass a function that will be called as a row is over another row. If the function returns true, allow 
 *     dropping on that row, otherwise not. The function takes 2 parameters: the dragged row and the row under
 *     the cursor. It returns a boolean: true allows the drop, false doesn't allow it.
 * scrollAmount
 *     This is the number of pixels to scroll if the user moves the mouse cursor to the top or bottom of the
 *     window. The page should automatically scroll up or down as appropriate (tested in IE6, IE7, Safari, FF2,
 *     FF3 beta
 * dragHandle
 *     This is the name of a class that you assign to one or more cells in each row that is draggable. If you
 *     specify this class, then you are responsible for setting cursor: move in the CSS and only these cells
 *     will have the drag behaviour. If you do not specify a dragHandle, then you get the old behaviour where
 *     the whole row is draggable.
 * 
 * Other ways to control behaviour:
 *
 * Add class="nodrop" to any rows for which you don't want to allow dropping, and class="nodrag" to any rows
 * that you don't want to be draggable.
 *
 * Inside the onDrop method you can also call $.tableDnD.serialize() this returns a string of the form
 * <tableID>[]=<rowID1>&<tableID>[]=<rowID2> so that you can send this back to the server. The table must have
 * an ID as must all the rows.
 *
 * Other methods:
 *
 * $("...").tableDnDUpdate() 
 * Will update all the matching tables, that is it will reapply the mousedown method to the rows (or handle cells).
 * This is useful if you have updated the table rows using Ajax and you want to make the table draggable again.
 * The table maintains the original configuration (so you don't have to specify it again).
 *
 * $("...").tableDnDSerialize()
 * Will serialize and return the serialized string as above, but for each of the matching tables--so it can be
 * called from anywhere and isn't dependent on the currentTable being set up correctly before calling
 *
 * Known problems:
 * - Auto-scoll has some problems with IE7  (it scrolls even when it shouldn't), work-around: set scrollAmount to 0
 * 
 * Version 0.2: 2008-02-20 First public version
 * Version 0.3: 2008-02-07 Added onDragStart option
 *                         Made the scroll amount configurable (default is 5 as before)
 * Version 0.4: 2008-03-15 Changed the noDrag/noDrop attributes to nodrag/nodrop classes
 *                         Added onAllowDrop to control dropping
 *                         Fixed a bug which meant that you couldn't set the scroll amount in both directions
 *                         Added serialize method
 * Version 0.5: 2008-05-16 Changed so that if you specify a dragHandle class it doesn't make the whole row
 *                         draggable
 *                         Improved the serialize method to use a default (and settable) regular expression.
 *                         Added tableDnDupate() and tableDnDSerialize() to be called when you are outside the table
 */
jQuery.tableDnD = {
    startPosition: null,
    endPosition: null,
    table1Higher: null,
    /** Keep hold of the current table being dragged */
    currentTable : null,
    currentTable2 : null,
    /** Keep hold of the current drag object if any */
    dragObject: null,
    dragObject2: null,
    /** The current mouse offset */
    mouseOffset: null,
    /** Remember the old value of Y so that we don't do too much processing */
    oldY: 0,
    
    initialDirection: null,

    EXIT: true, // constant to indicate function should exit.
    
    isScrolling: false, // indicates whether work area div is actually scrolling.

    /** Actually build the structure */
    build: function(options) {
	
	// Set up the defaults if any

        this.each(function() {
        	var $this = $(this);
            // This is bound to each matching table, set up the defaults and override with user options
            this.tableDnDConfig = jQuery.extend({
		        noDrag: null,
				currentTable2: null,
				onRowSwitch: null,
				onDragStyle: null,
		        onDropStyle: null,
				// Add in the default class for whileDragging
				onDragClass: "tDnD_whileDrag",
		        onDrop: null,
		        onDragStart: null,
		        afterDragStart: null,
		        scrollAmount: 5,
		        dragHandle: null, // If you give the name of a class here, then only Cells with this class will be draggable
		        onDragClone: true, // enable/disable default cloning of rows onDragStart
		        defaultMoveRows: true, // move selected single row across both tables (including rowspan rows)
		        scrollElementSelector: null // element to be auto-scrolled while dragging
            }, options || {});
            
		var rows1 = $this.children('tbody').children('tr');
	    var rows2 = $(this.tableDnDConfig.currentTable2).children('tbody').children('tr');
	    
	    // Check for existence of table2
	    this.tableDnDConfig.table2Exists = (options.currentTable2) ? true : false;
	    
	    $this.addClass('tableDnD_table');
	    if (this.tableDnDConfig.table2Exists)
	    {
	    	this.tableDnDConfig.currentTable2.addClass('tableDnD_table');
	    }
		    
	    if (this.tableDnDConfig.noDrag)
	    {
		if (!this.tableDnDConfig.table2Exists)
		{
		    for (var i=0; i<this.tableDnDConfig.noDrag; i++)
		    {
		        rows1.eq(i).addClass('nodrag');
				/* IE8 Quirksmode
				 * Issue - parent cursor style takes precedence if defined via stylesheet.
				 * Fix - Inlined cursor style somehow takes precedence.
				 */
				if (IE)
				{
					rows1.find('input[type="checkbox"]').css('cursor','default');
				}
		    }
		}
		else
		{
		    for (var i=0; i<this.tableDnDConfig.noDrag; i++)
		    {
		        rows1.eq(i).addClass('nodrag');
		        rows2.eq(i).addClass('nodrag');
		        /* IE8 Quirksmode
				 * Issue - parent cursor style takes precedence if defined via stylesheet.
				 * Fix - Inlined cursor style somehow takes precedence.
				 */
		        if (IE)
		        {
		        	rows1.find('input[type="checkbox"]').css('cursor','default');
		        	rows2.find('input[type="checkbox"]').css('cursor','default');
		        }
		    }
		}
	    }
	    
	    // Store info about table and rows to be used later in mousemove function (and other places)
	    this.info= {
		rows1 : rows1.not('tr.nodrag'),
		rows2 : rows2.not('tr.nodrag')
	    };
	    
	    // Now make the rows draggable
	    jQuery.tableDnD.makeDraggable(this);
        });

        // Now we need to capture the mouse up and mouse move event
        // We can use bind so that we don't interfere with other event handlers
        jQuery(document)
            .bind('mousemove', jQuery.tableDnD.mousemove)
            .bind('mouseup', jQuery.tableDnD.mouseup);

        // Don't break the chain
        return this;
    },

    /** This function makes all the rows on the tables draggable apart from those marked as "NoDrag" */
    makeDraggable: function(table) {
        var config = table.tableDnDConfig;
	var info = table.info;
	if (config.table2Exists)
	{
	    var table2 = $(config.currentTable2);
	}
	var tableRows = info.rows1;
	var tableRowSpan = parseInt( tableRows.filter(':first').children('td:first').attr('rowspan') );

	if (config.table2Exists)
	{
	    var table2Rows = info.rows2;
	    var table2RowSpan = parseInt( table2Rows.filter(':first').children('td:first').attr('rowspan') );
	    var higherRowSpan = (tableRowSpan > table2RowSpan) ? tableRowSpan : table2RowSpan;
	    var table1Higher = (tableRowSpan > table2RowSpan) ? true : false;
	    jQuery.tableDnD.table1Higher = table1Higher;
	}
	else
	{
	    var higherRowSpan = tableRowSpan;
	    var table1Higher = true;
	    jQuery.tableDnD.table1Higher = true;
	}
	jQuery.tableDnD.higherRowSpan = higherRowSpan;
		    // For backwards compatibility, we add the event to the whole row
	    tableRows.each(function(i) {
			    // Iterate through each row, the row is bound to "this"
			    var row = jQuery(this);
			    if (config.table2Exists)
			    {
				var row2 = table2Rows.eq(i);
			    }
			if (! row.hasClass("nodrag"))
			{
		    row.mousedown(function(ev) {
			if (ev.target.tagName == "TD") {
			    		var tableDnD = jQuery.tableDnD;
			    		
				/* PLM POM Drag & Drop updating wrong row values
		    	 * In Firefox, the onchange event (thus _notifyChangeFields) does not fire if:
		    	 * type value in row, then drag drop another row on top.
		    	 * Fix:  
		    	 */
		    	var activeElement = document.activeElement; 
				if (activeElement && activeElement.tagName === 'INPUT')
		    	{
		    		$(activeElement).blur();
		    	}
				
			    // Must update stored table rows -- why ?
						var $allRows1 = $(table).children('tbody').children('tr'); 
					    tableRows = $allRows1.not('tr.nodrag');
			    if (config.table2Exists)
			    {
			    	table2Rows = table2.children('tbody').children('tr').not('tr.nodrag');
			    }
			    
			    // Calculations main table as the table with the greater rowspan
			    if (table1Higher || !config.table2Exists)
			    {
			    	var curRow = $(this);
			    	var rowNumWRTTable = tableRows.index(curRow);
			    }
			    else
			    {
			    	var curRow = table2Rows.eq(tableRows.index(this));
			    	var rowNumWRTTable = table2Rows.index(curRow);
			    }
			    var rowNumWRTRowSpan = (rowNumWRTTable % higherRowSpan);

			    while (rowNumWRTRowSpan != 0) // get the first row of rowspan
			    {
			    	curRow = curRow.prev();
			    	rowNumWRTRowSpan --;
			    	rowNumWRTTable --;
			    }
			    // Get all rows of span
					    tableDnD.dragObject = jQuery([]);
			    if (config.table2Exists)
			    {
					    	tableDnD.dragObject2 = jQuery([]);
			    }
			    for (var i=0; i<higherRowSpan; i++)
			    {
					tableDnD.dragObject = tableDnD.dragObject.add(tableRows.eq(rowNumWRTTable+i));
			    	if (config.table2Exists)
			    	{
					    tableDnD.dragObject2 = tableDnD.dragObject2.add(table2Rows.eq(rowNumWRTTable+i));
			    	}
			    }
			    
			    // Store dragObject info for mouseMove function to increase performance
			    info.table1FirstRow = tableDnD.dragObject.eq(0);
				if (tableDnD.dragObject2)
			    {
					info.table2FirstRow = tableDnD.dragObject2.eq(0);
					info.table2LastRow = tableDnD.dragObject2.eq(tableDnD.dragObject.length-1);
			    }
				info.table1LastRow = tableDnD.dragObject.eq(tableDnD.dragObject.length-1);
			    info.firstRowOffsetTop = info.table1FirstRow.offset().top;
			    
			    // Tracker#: 19437 - PLM POM PAGE LOAD SLOW PERFORMANCE
			    // Height of rows in rowspan that are not the first row of the rowspan:
			    // IE ignores their height, other browsers include them.

				info.firstRowOuterHeight = info.table1FirstRow.outerHeight();
					    
				var higherFirstRowHeight;
				if (!config.table2Exists)
			    {
					higherFirstRowHeight = info.firstRowOuterHeight;
			    }
			    else
			    {
					higherFirstRowHeight = (table1Higher) ?
					    			info.firstRowOuterHeight : info.table2FirstRow.outerHeight();
			    }
					    
			    info.allRowsHeight = higherFirstRowHeight;
			    
			    info.scrollOffset = 0;
			    
			    var $scrollElement = $(config.scrollElementSelector),
			    	scrollElementOffsetTop = $scrollElement.offset().top;
			    info.scrollElement = $scrollElement;
			    info.scrollElementTop = scrollElementOffsetTop;
			    info.scrollElementBottom = scrollElementOffsetTop + $scrollElement.outerHeight();
			    info.isBodyElement = ($scrollElement[0] == document.body);
			    
			    info.y = ev.pageY;
		    	if (info.isBodyElement)
		    	{
		    		info.y -= $scrollElement.scrollTop();
		    	}
			    
				info.timer = window.setInterval(tableDnD.checkScroll,1);


				tableDnD.currentTable = table;
			    if (config.table2Exists)
			    {
					 tableDnD.currentTable2 = table2;
			    }
					    
			    // Store initial position to be available for onDrop function
				tableDnD.startPosition = rowNumWRTTable / higherRowSpan;
			    
			    /* Tracker#: 20434 - POM PERFORMANCE CHANGES
			     * Store the end position.  This will change as row is dragged. Used onmouseup.
			     */
			    tableDnD.endPosition = tableDnD.startPosition;
			    tableDnD.currentRowIndex = tableDnD.startPosition;
	    
			    tableDnD.numberPositions = info.rows1.length / higherRowSpan;

			    tableDnD.oldY = ev.pageY;
			    
			    if (config.onDragStart) {
					// Call the onDragStart method if there is one
					config.onDragStart(tableDnD.dragObject,
							tableDnD.dragObject2,
							ev,
							rowNumWRTTable,
							tableDnD.startPosition,
							info.allRowsHeight);
				}
			    
			    
			    /* Tracker#: 20434 - POM PERFORMANCE CHANGES
			     * Issue - IE - mouse events not captured outside of browser window.
			     * 
			     * Fix - Use IE specific trick.
			     */
				if (config.onDragClone && IE)
			    {
					var DOMfinalClone = tableDnD.finalClone[0]; 
					if(DOMfinalClone.setCapture)
					{
						DOMfinalClone.setCapture();
					}
			    }
			    
			    
			    return false;
			}

		    });
		    }
	    });

	},

    mousemove: function(ev) {
        if (jQuery.tableDnD.dragObject == null)
        {
            return;
        }
        
		var tableDnD = jQuery.tableDnD,
        	config = tableDnD.currentTable.tableDnDConfig,
	    	info = tableDnD.currentTable.info,
			dragObj = tableDnD.dragObject;
			
		/*
		if (config.table2Exists)
		{
		    var dragObj2 = tableDnD.dragObject2;
		}
		*/
	
	
		var y = ev.pageY;
    	if (info.isBodyElement)
    	{
    		y -= info.scrollElement.scrollTop();
    	}
		var x = ev.pageX;
		info.y = y;
	
		if (config.onDragClone)
		{
		tableDnD.mouseMoveClone(x, y, tableDnD.finalClone);
		}
	
		if (y != tableDnD.oldY) {
            // work out if we're going up or down...
            var movingDown = y > tableDnD.oldY;
            info.movingDown = movingDown;

            if (tableDnD.initialDirection === null)
            {
            	if (movingDown)
            	{
            		tableDnD.initialDirection = 'down';
            	}
            	else
            	{
            		tableDnD.initialDirection = 'up';
            	}
            }
            
            // update the old value
            tableDnD.oldY = y;
            
	    /*
		    if (config.onDragClass || config.onDragStyle)
		    {
				for (var i=0; i<dragObj.length; i++)
				{
				    // update the style to show we're dragging
				    if (config.onDragClass) {
						dragObj.eq(i).addClass(config.onDragClass);
						if (config.table2Exists)
						{
						    dragObj2.eq(i).addClass(config.onDragClass);
						}
				    }
				    else {
					dragObj.eq(i).css(config.onDragStyle);
						if (config.table2Exists)
						{
						    dragObj2.eq(i).css(config.onDragStyle);
						}
				    }
				}
		    }
		*/

            if ( tableDnD.updatePositionInfo(movingDown, y, info, tableDnD, config) === tableDnD.EXIT )
		    {
            	return;
            }
		    }
		    
		    
        return false;
    },
    
    updatePositionInfo : function (movingDown, y, info, tableDnD, config)
    {
	    if ( tableDnD.checkOverBelowRow(movingDown, y, info, tableDnD) )
		    {
	    	if (tableDnD.shouldExit(tableDnD, config))
		    	{
	    		return tableDnD.EXIT;
		    	}

		    	tableDnD.endPosition ++;
	    	tableDnD.updateOffsetTops(info, true);
	    	
	    	if (config.afterDragStart)
	    	{
	    		var newRowIndex = tableDnD.currentRowIndex + 1;
	    		tableDnD.currentRowIndex = newRowIndex;
		    	
	    		config.afterDragStart(newRowIndex, info.allRowsHeight);
	    	}

	    }
	    else if ( tableDnD.checkOverAboveRow(movingDown, y, info, tableDnD) )
		    {
	    	if (tableDnD.shouldExit(tableDnD, config))
		    	{
	    		return tableDnD.EXIT;
		    	}
		    	
		    	tableDnD.endPosition --;
	    	tableDnD.updateOffsetTops(info, false);
				
	    	if (config.afterDragStart)
	    	{
	    		var newRowIndex = tableDnD.currentRowIndex - 1;
	    		tableDnD.currentRowIndex = newRowIndex;
	    		
	    		config.afterDragStart(newRowIndex, info.allRowsHeight);
		    }

        }
    },
		
    /* Tracker#: 20434 - POM PERFORMANCE CHANGES
     * endPosition is 0-based, numberPositions is 1-based. Thus >= instead of >.
     * need to check if adding one to endPosition is still valid position in
     * the table.
     */
    checkOverBelowRow : function (movingDown, y, info, tableDnD)
    {
    	return ( ((movingDown === undefined) ? true : movingDown)
    			&& y > info.firstRowOffsetTop+info.allRowsHeight+info.scrollOffset
    			&& !(tableDnD.endPosition + 1 >= tableDnD.numberPositions) );
    },

    checkOverAboveRow : function (movingDown, y, info, tableDnD)
    {
    	return ( ((movingDown === undefined) ? true : !movingDown)
	    		&& y < info.firstRowOffsetTop + info.scrollOffset
	    		&& !(tableDnD.endPosition - 1 < 0) );
    },
    
    checkForSaveChanges : function (tableDnD)
    {
    	/* Drag & Drop updating wrong rowset
    	 * Prompting to save previous changes before switching any rows.
    	 */
    	var workArea = _getWorkAreaDefaultObj();
    	var objHtmlData = tableDnD.checkForNavigation(workArea);
    	
    	
    	if (objHtmlData!=null && objHtmlData.hasUserModifiedData()==true)
        {
    		objHtmlData.performSaveChanges(refreshFields);
            return tableDnD.EXIT;
        }
    	else if (tableDnD.clickedCancel)
    	{
    		tableDnD.clickedCancel = false;
    		return tableDnD.EXIT;
    	}
    	return null;
    },
    
    checkForNavigation : function (workArea)
    {
        if(workArea._mHTMLData && workArea._mHTMLData.hasUserModifiedData() && workArea._mHTMLData.isDataModified())
        {
        	jQuery.tableDnD.mouseup(null,true);

        	if (confirm(szMsg_Changes))
            {
        		return workArea._mHTMLData;
            }
        	else // Clicked Cancel button.
        	{
        		// Clear changed fields.
        		workArea.getHTMLDataObj().resetChangeFields();
        		
        		jQuery.tableDnD.clickedCancel = true;
        		return null;
        	}
        }
        return null;
    },

    mouseup: function(e, doNotSave) {

    	if (jQuery.tableDnD.currentTable && jQuery.tableDnD.dragObject.length>0)
        {
        	var config = jQuery.tableDnD.currentTable.tableDnDConfig;
            window.clearInterval(jQuery.tableDnD.currentTable.info.timer);
            var droppedRow = jQuery.tableDnD.dragObject;
            if (config.table2Exists)
            {
            	var droppedRow2 = jQuery.tableDnD.dragObject2;
            }
            
            // If we have a dragObject, then we need to release it,
            // The row will already have been moved to the right place so we just reset stuff
			if (config.onDragClass)
			{
	            jQuery(droppedRow).removeClass(config.onDragClass);
	            if (config.table2Exists)
	            {
	            	jQuery(droppedRow2).removeClass(config.onDragClass);
	            }
		    
			}
			else
			{
	            jQuery(droppedRow).css(config.onDropStyle);
	            if (config.table2Exists)
	            {
	            	jQuery(droppedRow2).css(config.onDropStyle);
	            }
			}
	

		    /* Tracker#: 20434 - POM PERFORMANCE CHANGES
		     * Move rows ondrop only
		     */
			if (config.defaultMoveRows)
			{
			jQuery.tableDnD.moveRows(droppedRow, droppedRow2,
		    		jQuery.tableDnD.endPosition * jQuery.tableDnD.higherRowSpan);
			}
		    
		    
		    if (config.onDrop)
		    {
		    	// Call the onDrop method if there is one
		    	config.onDrop(jQuery.tableDnD.startPosition,
		    		jQuery.tableDnD.endPosition,
		    		jQuery.tableDnD.dragObject, jQuery.tableDnD.dragObject2,
		    		doNotSave);
		    }
		    
		    jQuery.tableDnD.dragObject   = null;
		    jQuery.tableDnD.dragObject2   = null;
		    
		    jQuery.tableDnD.startPosition = null;
		    //jQuery.tableDnD.higherRowSpan = null;
		    
		    jQuery.tableDnD.currentTable = null; // let go of the table too
		    jQuery.tableDnD.currentTable2 = null;
		    
		    jQuery.tableDnD.initialDirection = null;
		    
		    /* Tracker#: 20434 - POM PERFORMANCE CHANGES
		     * Issue - IE - mouse events not captured outside window
		     * Fix - IE specific trick.
		     */
		    if (config.onDragClone && IE)
		    {
			    var DOMfinalClone = jQuery.tableDnD.finalClone[0]; 
				if (DOMfinalClone.releaseCapture)
				{
					DOMfinalClone.releaseCapture();
				}
		    }
		    
        }
    },
    
    moveRows : function ($dragRows1, $dragRows2, toIndex) {
    	var tableDnD = jQuery.tableDnD;
    	
    	if (tableDnD.startPosition === tableDnD.endPosition)
    	{
    		return;
    	}
    	
    	var	info = tableDnD.currentTable.info,
			table1 = tableDnD.currentTable,
			table2 = tableDnD.currentTable2,
			$rows1 = $(table1).children().children().not('tr.nodrag'),
			$rows2 = $(table2).children().children().not('tr.nodrag');

    	/* Tracker#: 20434 - POM PERFORMANCE CHANGES
    	 * if user began moving down, then changes mind and moves up above startPosition,
    	 * need to insert rows ABOVE endPosition, instead of BELOW.
    	 * Vice versa for moving up.
    	 */
    	if (tableDnD.initialDirection === 'down' &&
    		tableDnD.endPosition < tableDnD.startPosition)
    	{
    		tableDnD.initialDirection = 'up';
    	}
    	else if (tableDnD.initialDirection === 'up' &&
    			tableDnD.endPosition > tableDnD.startPosition)
    	{
    		tableDnD.initialDirection = 'down';
    	}

    	
    	if (tableDnD.initialDirection === 'down')
    	{
    		var rows1AfterToIndex = $rows1.eq(toIndex + tableDnD.higherRowSpan); 
    		var hasRowsAfter = (rows1AfterToIndex.length > 0) ? true : false;
    		
    		var toRows = {
    	    		$toRow1 : (hasRowsAfter) ? rows1AfterToIndex : $rows1.eq(toIndex),
    	    		$toRow2 : (hasRowsAfter) ? $rows2.eq(toIndex + tableDnD.higherRowSpan) : $rows2.eq(toIndex)
    	    	};
    		
    		if (hasRowsAfter)
    		{
    			toRows.$toRow1.before($dragRows1);
    		}
    		else
    		{
    			$rows1.last().after($dragRows1); // append drag rows after last row
    		}
    		
    		if ($dragRows2.length > 0)
    		{
    			if (hasRowsAfter)
    			{
    				toRows.$toRow2.before($dragRows2);
    			}
    			else
    			{
    				$rows2.last().after($dragRows2); // append drag rows after last row
    			}
    		}
    	}
    	else // tableDnD.initialDirection === 'up'
    	{
    		var toRows = {
    	    		$toRow1 : $rows1.eq(toIndex),
    	    		$toRow2 : $rows2.eq(toIndex)
    	    	};
    		
    		toRows.$toRow1.before($dragRows1);
    		if ($dragRows2.length > 0)
    		{
    			toRows.$toRow2.before($dragRows2);
    		}
    	}
    	
	},
    
    checkScroll : function () {
    	var tableDnD = jQuery.tableDnD;
    	var currentTable = tableDnD.currentTable;
    	var config = currentTable.tableDnDConfig;
    	var info = currentTable.info;
    	var y = info.y;
    	var scrollElement = info.scrollElement;
    	var scrollElementScrollTop = scrollElement.scrollTop();
    	
    	var topOffset = 60;
    	var bottomOffset = 80;
    	var speed = 50;
    	if (y < info.scrollElementTop+topOffset && scrollElementScrollTop > 0) // go up
    	{
    		scrollElement.scrollTop(scrollElementScrollTop - speed);
    		if (scrollElementScrollTop - speed < 0) // if can't scroll the entire amount; reached top
    		{
    			/* Tracker#: 20434 - POM PERFORMANCE CHANGES
    			 * Issue - used to be info.scrollOffset += speed - scrollElementScrollTop;
    			 * which is not the difference between the top scrollTop (0) and the
    			 * old scrollTop (scrollElementScrollTop).
    			 * 
    			 * Fix - Difference between top and old scrolltop = scrollElementScrollTop.
    			 */
    			info.scrollOffset += scrollElementScrollTop;
    		}
    		else
    		{
    			info.scrollOffset += speed;
    			tableDnD.isScrolling = true;
    		}
    		
    	}
    	else if (y > nCurScrHeight-bottomOffset) // go down
    	{
    		scrollElement.scrollTop(scrollElementScrollTop + speed);
    		var newScrollTop = scrollElement.scrollTop();
    		if (newScrollTop != scrollElementScrollTop)
    		{
	    		if (scrollElementScrollTop + speed > newScrollTop) // if can't scroll the entire amount; reached bottom
	    		{
	    			/* Tracker#: 20434 - POM PERFORMANCE CHANGES
	    			 * Issue - Used to be info.scrollOffset -= scrollElementScrollTop - newScrollTop;
	    			 * The two values are flipped.  Should be subtracting by positive number.
	    			 * 
	    			 * Fix - flip the two values so info.scrollOffset is subtracted by positive #.
	    			 */
	    			info.scrollOffset -= newScrollTop - scrollElementScrollTop;
	    		}
	    		else
	    		{
	    			info.scrollOffset -= speed;
	    			tableDnD.isScrolling = true;
	    		}
    		}

    	}
    	else // in middle of table(s) - don't auto-scroll.
    	{
    		tableDnD.isScrolling = false;
    	}
    	
		// If we're over a row no longer moving the dragged row to there

	    if ( tableDnD.updatePositionInfo(undefined, y, info, tableDnD, config) === tableDnD.EXIT )
	    {
	    	return;
	    }
    },
    

    shouldExit : function (tableDnD, config) {
    	if (tableDnD.checkForSaveChanges(tableDnD) === tableDnD.EXIT)
	    {
    		return true;
    	}
    },

    /* Updates stored offset top of first & last row.
     * positive - positive=true, negative=false
     */
    updateOffsetTops : function (info, positive) {
    	if (positive)
    	{
			var allRowsHeight = info.allRowsHeight;
			info.firstRowOffsetTop += allRowsHeight;
    	}
    	else
	    {
			var allRowsHeight = info.allRowsHeight;
			info.firstRowOffsetTop -= allRowsHeight;
	    }
    },
    
    
    mouseMoveClone : function (x, y, finalClone) {
        var finalCloneOffset = finalClone.offset();
        	finalClone.offset({
        		top: finalCloneOffset.top + y - finalClone.data('mouseY'),
        		left: finalCloneOffset.left + x - finalClone.data('mouseX')
        	});
            finalClone.data({
    		    mouseY : y,
    		    mouseX : x
    	    });
    }

}

jQuery.fn.extend(
	{
		tableDnD : jQuery.tableDnD.build
	}
);
