/*************************************/
/*  Copyright  (C)  2002 - 2008      */
/*           by                      */
/*  TradeStone Software, Inc.        */
/*  Gloucester, MA. 01930            */
/*  All Rights Reserved              */
/*  Printed in U.S.A.                */
/*  Confidential, Unpublished        */
/*  Property of                      */
/*  TradeStone Software, Inc.        */
/*************************************/
(function (window) {

var dragdiff = {}; // Object which hold the number of pixels on left side of the mouse starting from the left most point of the slider
var dragcomp = {}; // name of the div which is being controlled by the slider.
var slidersPresent = []; // All sliders currently on the screen.
//Tracker#: 18625 f8 - ability to create a capacity projections record
//This array will hold the slider ids on the screen
var sldrs=new Array();

var mousex;

window.getAllSliderControlledDivsIds = function ()
{
	return dragcomp;
}


// obj - slider
// companion - div which is controlled by the slider.
function SMD(obj, companion, e) //slider mouse down
{
    try
    {
        dragObj = getElemnt(obj);

        if(IE)
        {
            mousex = event.clientX;
        }
        else
        {
            mousex = e.pageX;
        }

        //offsetleft = mousex - parseInt(dragObj.style.left);
        //offsettop = mousey - parseInt(dragObj.style.top);

        move=true;
        zvalue +=100;

        setZValue(dragObj, zvalue);
        // alert("After ZValue");

        selx = dragObj.offsetLeft;   //0;
        if(dragObj.offsetParent)
        {
            selp=dragObj;
            while(selp.offsetParent)
            {
                selp=selp.offsetParent;
                selx+=selp.offsetLeft;
            }
        }

        dragdiff[dragObj.id] = mousex - selx; //dragObj.offsetLeft;


        //dragdiff = mousex - dragObj.offsetLeft;
        if (document.addEventListener)
        {
            document.onmousemove = function(evt)
            {
                SMM(evt);
                return true;
            }
            document.onmouseup = function(evt)
            {
                SMU();
                return true;
            }
        }
        else
        {
            document.onmousemove = SMM;
            document.onmouseup = SMU;
        }


    }
    catch(e)
    {
        alert(e.description);
    }
}

/**
 * Tracker#:20695 COLUMN HEADERS AND SIZE RANGE WILL ALWAYS BE VISIBLE ON THE POM ASSOCIATION SCREEN AS THE USER SCROLL DOWN THE SCREEN
 * Binding the right floating div to slider move.
 */
var rightContainerDivId;

window.notifySliders = function (notifyEvent)
{
	switch (notifyEvent.eventType)
	{
		case 'fixedHeader.init' :
			rightContainerDivId = '#' + notifyEvent.rightContainerDivId;
			break;
	}
}

function SMM(e) //slider mouse move
{
    try
    {
        //Removing the code for the hiding and showing the dropdowns when the slider is dragged in IE6
        if (move)
        {
            var dragobjID = dragObj.id;
            //Tracker#: 14332 SLIDER TO WORK ON SAFARI BROWSER
            //Setting the opacity for non IE browsers
            if(IE) // non ie10
            {
            	dragObj.style.filter = 'alpha(opacity=80)';   // increase the color of the slider to make it more prominant during the move
            }

			dragObj.style.opacity = .8;
            var dragobjcomp = getElemnt(dragcomp[dragobjID]);  // which div is moving with the slider
            var dragdiffval = dragdiff[dragobjID]     // if the difference between the mouse click on the slider and slider left most point

            // What is the equivalent for document.selection.empty() for Firefox and Safari?
            // Trying to control this from onselectstart event on IE and thro's css property "-moz-user-select: none;" on Firefox.
            /* if(window.getSelection)
            {
                var selectionRanges = window.getSelection();
                selectionRanges.removeAllRanges();
            }*/
            if(document.selection)
            {
                document.selection.empty();
            }

            if(IE)
            {
            	mousex = event.clientX;
            }
            else
            {
            	mousex = e.pageX;
            }

            var selx = 0;
            var parentx = 0;  // parent x position 2 which the slide/div is attached

            // Tracker#: 18221 - ALL BROWSER - SLIDERS - REMAINING ISSUES
            // Positioning off, likely due to margins. Using JQuery for
            // finding offsets.
            /*if(dragObj.offsetParent)
            {
            	parentx = $(dragObj.offsetParent).offset().left;
            }*/
            //Tracker#:22098 - NEW UI:  UNSPECIFIED ERROR ON DELIVERY
            // Because of the statement dragObj.offsetParent this error was happening in the PO Delivery screen.
            // So instead of dragObj.offsetParent used jquery apis for getting the offsetParent which is solving this issue.
            // In the details section of the delivery tab, the slider is shown on top of the qty field which has an onchange event
            // defined. So when the user changes value in the qty field and without tabbing out and try to move the slider then 
            // onchange of the qty field and SMM is getting called simultaneously causing this issue.
            if($('#'+dragobjID).offsetParent() )
            {
                 // Tracker#: 22594
                 // Object not identified thro' id instead use the object itself.
                 parentx = $(dragObj.offsetParent).offset().left;
            }

            selx = $(dragobjcomp).offset().left;

            //alert(mousex + ' - ' + dragdiffval + ' - ' + selx);
            var bReachedLeftSide = mousex-dragdiffval >= selx;
            var bReachedRightSide = mousex+(dragObj.offsetWidth-dragdiffval) <= (selx + dragobjcomp.offsetWidth)
           	

            // reset position for the controlled div based on the mouse position
            if (bReachedLeftSide && bReachedRightSide)
            {
            	dragObj.style.left = parseInt(mousex) - parseInt(selx) - parseInt(dragdiff[dragobjID]) + "px";
            	
            	var dragobjmoved_pct = (((dragObj.offsetLeft + parentx - selx) * 100) / (dragobjcomp.offsetWidth- dragObj.offsetWidth));
            	var newScrollLeft = Math.round(((dragobjcomp.scrollWidth - dragobjcomp.offsetWidth) * dragobjmoved_pct) / 100);
             	dragobjcomp.scrollLeft = newScrollLeft;
                 // if PLM POM screen
             	/* Tracker#:20695 COLUMN HEADERS AND SIZE RANGE WILL ALWAYS BE VISIBLE ON THE POM ASSOCIATION SCREEN AS THE USER SCROLL DOWN THE SCREEN
             	 * setting the scrollLeft of right floating header DIV to synch with right content DIV of screen. 
             	*/
             	//if ( getCustomAttribute(getElemnt('_divWorkArea'), 'docviewid') === '12701' )
             	{
             		var $rightFloatingHeader = $(rightContainerDivId);
             		if ($rightFloatingHeader.length > 0)
             		{
             			$rightFloatingHeader.scrollLeft(newScrollLeft);
             		}
             	}
            }
        }
    }
    catch(e)
    {
        alert(e.description);
    }
}



/** Tracker#: 19807 - LEFT NAVIGATION NEEDS TO BE MADE COLLAPSIBLE
 * Calculates position of slider based on controlled div.
 * This function is called on left nav toggle in order to
 * reposition the slider appropriately.  This is required because
 * the width of controlled div changes on left nav toggle.
 */
window.calcSliderPos = function (dragObjId)
{
	var dragObj = getElemnt(dragObjId);
	var dragobjcomp = getElemnt(dragcomp[dragObjId]);  // which div is moving with the slider
	
	// if there is no slider or slider is not visible, no need to calculate slider position.
	if (!dragObj || dragObj.style.display === 'none')
	{
		/* Tracker#: 19807 - LEFT NAVIGATION NEEDS TO BE MADE COLLAPSIBLE
		 * If there was a slider and now there isn't, user could have scrolled the
		 * controlled div.  Need to reset controlled div's scrollLeft to zero in
		 * order to show the part of controlled div that became hidden due to scrolling.
		 */
		if (dragobjcomp)
		{
			dragobjcomp.scrollLeft = 0;
		}
		
		return;
	}

	
	/*
	 * This two lines are the calculations in SMM function to calculate controlled div scrollLeft.
	 * Algebraically solving these two equations to get slider left position from
	 * controlled div scrollLeft.
	 */
	//var dragobjmoved_pct = (((dragObj.offsetLeft + parentx - selx) * 100) / (dragobjcomp.offsetWidth- dragObj.offsetWidth));
    //dragobjcomp.scrollLeft = Math.round(((dragobjcomp.scrollWidth - dragobjcomp.offsetWidth) * dragobjmoved_pct) / 100);
	
	var movedPercent = dragobjcomp.scrollLeft / (dragobjcomp.scrollWidth - dragobjcomp.offsetWidth);
	
	// if slider new positon too far to the right
	if (movedPercent > 1)
	{
		dragObj.style.left = 1 * (dragobjcomp.offsetWidth - dragObj.offsetWidth)+"px";// put slider at far right.
		dragobjcomp.scrollLeft = dragobjcomp.scrollWidth - dragobjcomp.offsetWidth;
	}
	else
	{
		dragObj.style.left = movedPercent * (dragobjcomp.offsetWidth - dragObj.offsetWidth)+"px";
	}
}

function SMU()  // slider mouse up
{
    try
    {
        drag = false;
        move=false;
        //Tracker#: 14332 SLIDER TO WORK ON SAFARI BROWSER
        //Setting the opacity for non IE browsers
        if(IE) // non ie10
        	dragObj.style.filter = 'alpha(opacity=40)';

        dragObj.style.opacity = .4;
        dragObj='';
        if(window.getSelection)
        {
            var selectionRanges = window.getSelection();
            selectionRanges.removeAllRanges();
        }
        else if(document.selection)
        {
            document.selection.empty();
        }
        document.onmousemove = function (e)
        {
            mouseMove(e);
        }
        document.onmousemove = function (e)
        {
            setxy(e);
        }
    }
	catch (exception)
	{ // do nothing
	}

}

//Tracker#: 17010 - SAFARI : ALIGNMENT OF COLUMNS IN MATERIAL QUOTE SEARCH LIST ARE IMPROPER
// This function aligns the two tables' heights by binding function when each image loads.
// Each image load triggers function to align the image's row and the corresponding row on
// other table.
window.alignTableHeights = function (leftTable, rightTable, sliderControlledDiv, mainDivId)
{
	/* Tracker#: 19437 - PLM POM PAGE LOAD SLOW PERFORMANCE
	 * passed in new parameter mainDivId to determine if it is the PLM POM screen.
	 * Only aligning if it is NOT the POM screen as the POM screen uses different
	 * method of aligning.
	 */
	// Execute for all browsers except IE
	if (!IE && (mainDivId !== '_dtlSection_12701' && mainDivId !== '_dtlSection_12702' && mainDivId!='_dtlSection_30008'))
	{
		// convert id strings to jQuery objects
		var leftTableJObj = $('#' + leftTable);
		var rightTableJObj = $('#' + rightTable);
		var sliderJObj = $('#' + sliderControlledDiv + 'Slider');
		
		// Number the rows
		addRowNumClasses(leftTableJObj, rightTableJObj);
		
		// Get all images in both tables, including header row
		var images = leftTableJObj.find('img').add(rightTableJObj.find('img'));
	
		// Adjust rows without images first
		adjustTableRowHeights(leftTableJObj, rightTableJObj);
		
		// for rows with images, bind function on image load.
		// Execute onImgLoad function regardless of whether the images
		// loaded successfully.  This is to ensure tables are aligned.
		images.load( function () {
			onImgLoad(leftTableJObj, rightTableJObj, $(this), sliderJObj);
		})
		.error( function () {
			onImgLoad(leftTableJObj, rightTableJObj, $(this), sliderJObj);
		});
	}
}

// This function essentially adds row numbers to tables;
// Row numbers are added as classes with format row#
// where # is the row number. i.e. row0, row1, etc.
function addRowNumClasses (leftTableJObj, rightTableJObj)
{
	var tableRows1 = leftTableJObj.find('tr');
	var tableRows2 = rightTableJObj.find('tr');
	tableRows1.each(function (i) {
		$(this).addClass('row' + i);
	});
	tableRows2.each(function (i) {
		$(this).addClass('row' + i);
	});
}

function onImgLoad (leftTableJObj, rightTableJObj, imageJObj, sliderJObj)
{
	// Get row in each table of loaded image
	var t1row = imageJObj.closest('tr');
	var t2row = rightTableJObj.find('tr.' + t1row.attr('class'));
	// Adjust row heights
	adjustToEqualHeights(t1row, t2row);
	// Adjust slider height to equal tables' heights
	adjustToEqualHeights(leftTableJObj, sliderJObj);
}

// Adjusts height of two tables' rows that do not have images
function adjustTableRowHeights(leftTableJObj, rightTableJObj)
{
	// Get All rows without images in left table
	//Tracker#:24353 - THE BOMC APPROVAL SCREEN IS NOT ALIGNED ON SAFARI BROWSER
	//commented not(':has(img)') as in BOM Approval list screen has allignment issue
	var t1rows = leftTableJObj.find('tr');//.not(':has(img)');
	var numRows = t1rows.length;
	for (var i=0; i<numRows; i++)
	{
		var t1row = t1rows.filter(':eq(' + i + ')');
		// Get corresponding row in right table
		var t2row = rightTableJObj.find('tr.' + t1row.attr('class'));
		adjustToEqualHeights(t1row, t2row);
	}
}

// Adjust the two given rows to have same height.
// Both rows will have height equal to taller row's height.
function adjustToEqualHeights (leftRow, rightRow)
{
	var leftRowHeight = leftRow.height();
	var rightRowHeight = rightRow.height();
	if (leftRowHeight > rightRowHeight)
	{
		rightRow.height(leftRowHeight);
	}
	else
	{
		leftRow.height(rightRowHeight);
	}
}



function registerSlider (slider)
{
	slidersPresent.push(slider);
}

/**
 * Gets all sliders currently on the screen.
 */
window.getAllSliders = function ()
{
	return slidersPresent;
}

/**
 * Clears the list of sliders.
 */
window.clearSliderList = function ()
{
	slidersPresent.length = 0;
}

/* Tracker#: 19938 - PLM POM PAGE LOAD PERFORMANCE IMPROVEMENT - SLIDER CODE REFACTORING
 * 1. Removed parameters that are no longer used due to refactoring - isCollapsableDiv, parentRefId
 * 2. Removed calculations that are no longer needed because slider is now appended as sibling of controlled
 *    div for all browsers now (i.e. finding top position of parent div with _getComponentTop()).
 * 3. Appending Slider only after setting its styles.
 */
window.createSlider = function (parentDiv, controlledDiv, bAdjustControlDiv, leftTable,
        rightTable, divWidth, mainDivId)
{
	try
    {
        if (getElemnt(controlledDiv+"Slider"))  // if already on the screen then return
        {
            return;
        }

        var parentDivObj = getElemnt(parentDiv);    // parent obj
        var controlledDivObj = getElemnt(controlledDiv); // controlled div obj

        var sely = 0;
        
        
        // column freeze so adjust the width of the div as well as the height of each row of left/right tables
        if (controlledDivObj && bAdjustControlDiv)
        {
        	
        	sliderAdjustControlledDivWidth(controlledDivObj, divWidth, parentDivObj, mainDivId,
        			bAdjustControlDiv);
            
        	/* Tracker#: 19437 - PLM POM PAGE LOAD SLOW PERFORMANCE
        	 * passed in mainDivId to determine if it is the PLM POM screen.
        	 * Only aligning if it is NOT the POM screen as the POM screen uses different
        	 * method of aligning.
        	 */
            //Tracker#: 17010 - SAFARI : ALIGNMENT OF COLUMNS IN MATERIAL QUOTE SEARCH LIST ARE IMPROPER
            // This was working for IE and will be kept for IE only, as new code does not on IE6.
            if (IE && mainDivId !== '_dtlSection_12701')
            {
                // adjust the height of the rows
                var leftTableObj = getElemnt(leftTable);
                var rightTableObj = getElemnt(rightTable);
            	if (leftTableObj && rightTableObj)
	            {
	
	            // get the lenght of row
	                var nRowCount = leftTableObj.getElementsByTagName("tr").length;
	
	                for (i=0; i < nRowCount; i++)
	                {
	                    tdobj1 = leftTableObj.getElementsByTagName("tr").item(i).getElementsByTagName("td").item(0);
	                    tdobj2 = rightTableObj.getElementsByTagName("tr").item(i).getElementsByTagName("td").item(0);
	
	                    // ---------------------------------------------------------------
	                    // Tracker#: 13512  MOVE FITEVAL INTO PLM FRAMEWORK
	                    // If RowSpan has been provided to the LHS table cell then
	                    // the height needs to be calculated by taking into
	                    // account the RHS tables as many row(s) as the rowspan.
	                    // This takes care of only rowspan that has been provided on the
	                    // LHS table and not RHS table.
	                    // ---------------------------------------------------------------
	                    if(tdobj2 && tdobj1 && tdobj1.rowSpan && tdobj1.rowSpan>1)
	                    {
	                        var ht=parseFloat(tdobj2.offsetHeight);
	
	                        for(var r=1;r<tdobj1.rowSpan;r++)
	                        {
	                            tdobj2 = rightTableObj.getElementsByTagName("tr").item(i+parseFloat(r)).getElementsByTagName("td").item(0);
	                            if(tdobj2)
	                            {
	                                ht += parseFloat(tdobj2.offsetHeight);
	                            }
	                        }
	                       if (tdobj1.offsetHeight < ht)
	                    	   setHeight(tdobj1, ht);
	                       else if (tdobj1.offsetHeight > ht)
	                    	   setHeight(tdobj2, tdobj2.offsetHeight + tdobj1.offsetHeight - ht);
	                    	   
	                        i = i+tdobj1.rowSpan-1;
	                    }
	                    // Do as per normal consideration.
	                    else
	                    {
	                        alignHeight(tdobj1, tdobj2);
	                    }
	                }
	
	            }
            }

            // Tracker#: 20602
            // Flush the existing Slider Ids and create new one only if the Control Div is a valid one
            
            //Tracker#: 18625 f8 - ability to create a capacity projections record
            //Creating the SldrPicker object along with slider. This object can be used to identify the slider id by calling getSliderId function 
    		var sldrPkr = new SldrPicker(controlledDiv+"Slider",controlledDiv);
    		//flusing the slider existing slider ids before storing new ones
    		flushSldrs();
    		//storing thr slider id
    		storeSlider(sldrPkr);
        }


        // Only create the slider if controlled div is wide enough to go off the screen.

        
        
        var sd = actuallyCreateSlider (controlledDivObj, controlledDiv);
        
        dragcomp[controlledDiv + "Slider"] = controlledDiv;
        
        _showWorkArea.toggleNav.register('calcSliderPos',
        		[controlledDiv+"Slider"]);
        		

    }
   
    catch(e)
    {
        alert(e.description);
    }
}

/** Tracker#: 19807 - LEFT NAVIGATION NEEDS TO BE MADE COLLAPSIBLE
 * Extracted the code that actually creates the slider div on the screen
 * into a separate function in order to register it with _showWorkArea.toggleNav
 * module, so the left nav module can call this function on left nav toggle.
 */
window.actuallyCreateSlider = function (controlledDivObj, controlledDiv, isCalledFromToggle)
{
    // Only create the slider if controlled div is wide enough to go off the screen.
	var sd; // slider	

    var sliderPresent = (getElemnt(controlledDiv+"Slider")) ? true : false;
    var shouldCreateSlider = window.shouldCreateSlider(controlledDivObj);
	
	if (!sliderPresent && shouldCreateSlider)
    {
        var $controlledDivObj = $(controlledDivObj);

    	// ------------------CREATE THE SLIDER DIV---------------------
        sd = new newDIV(controlledDiv+"Slider");


    	// Setting closest ancestor table's css so slider overlaps controlled div.
    	$controlledDivObj.closest('table').css({
    		position : 'relative',
    		display: 'block'
    	});

        sd.style.height=controlledDivObj.offsetHeight+"px";// -scrollBarPixels+"px";

    	// Initially 0 since at same position as controlled div
    	sd.style.left = '0px';
    	sd.style.top = '0px';

    	
    	if (sd.addEventListener)
        {
            sd.onmousedown = function(evt)
            {
            	SMD(controlledDiv + "Slider", controlledDiv, evt);
                return true;
            }

            sd.onmouseup= function(evt)
            {
                SMU();
                return true;
            }

        }
        else if (sd.attachEvent) // IE
        {
            sd.attachEvent("onmousedown", function(){SMD(controlledDiv+"Slider",controlledDiv)});
            sd.attachEvent("onmouseup", function(){SMU()});
        }
    	
    	// Attach slider as sibling of controlled div.
        $controlledDivObj.after(sd);
        
        registerSlider(sd);

    }
    else if (isCalledFromToggle)
    {
    	var $slider = $(getElemnt(controlledDiv+"Slider"));
    	
    	if (sliderPresent && shouldCreateSlider)
    	{
    		// enable slider
    		$slider.css('display', 'block');
    	}
    	else if (sliderPresent && !shouldCreateSlider)
    	{
    		// disable slider
    		$slider.css('display', 'none');
    	}
    	else if (!sliderPresent && !shouldCreateSlider)
    	{
    		// No need to do anything to slider.
    	}
    }
    
    // Add to slider id list
    addSliderId(controlledDiv+"Slider");
    
    _showWorkArea.toggleNav.register('actuallyCreateSlider', arguments);
    
    return sd;
}

window.shouldCreateSlider = function (controlledDivObj)
{
	if (controlledDivObj && controlledDivObj.offsetWidth < controlledDivObj.scrollWidth)
	{
		return true;
	}
	else
	{
		return false;
	}
}


var sliderIds = {};

function addSliderId (sliderId)
{
	if (!sliderIds[sliderId])
	{
		sliderIds[sliderId] = sliderId;
	}
}

window.getAllSliderIds = function ()
{
	return sliderIds;
}


// create a new div with slider properties
function newDIV(idn)
{
    var winBody = document.createElement("DIV");
    winBody.id = idn;
    winBody.className="clsnoselection";

    winBody.style.position = "absolute";

	winBody.style.visibility = 'inherit';
	winBody.style.cursor="e-resize";    // shows only left and right arrow on mouseover
	winBody.style.width="8px";
	winBody.style.backgroundColor="#DCC81E";
	//Tracker#: 14332 SLIDER TO WORK ON SAFARI BROWSER
    //Setting the opacity for non IE browsers
	if(IE)  // non ie10
		winBody.style.filter = 'alpha(opacity=40)';

	winBody.style.opacity = .4;
	winBody.style.zindex="100";
	
	if(IEVer != 8) winBody.addEventListener("mousedown", function(e) { e.preventDefault(); }, false);
	
	winBody.onselectstart= function(e)
	{
	    return false;
	}

/*  winBody.style.writingMode="tb-rl";
	winBody.style.unicodeBidi="embed";
	winBody.innerHTML = "Slider";
*/
    return winBody;
}

})(window);


/** Tracker#: 19807 - LEFT NAVIGATION NEEDS TO BE MADE COLLAPSIBLE
 * This function is only used inside createSlider function.
 * Extracted this code into a function so (after registering) it can be called
 * by _showWorkArea.toggleNav function when toggling left nav.
 * _showWorkArea.toggleNav.register only works on global scope functions.
 * 
 * @param isCalledFromToggle - Must always be last parameter.  This flag is set only from
 * 	_showWorkArea.toggleNav
 */
function sliderAdjustControlledDivWidth (controlledDivObj, divWidth, parentDivObj, mainDivId,
		bAdjustControlDiv, isCalledFromToggle)
{
    /* Adding same 'if' condition in surrounding this function's call in createSlider.
     * This is because on toggling the left nav, this function is called directly.
     */
	if (controlledDivObj && bAdjustControlDiv)
	{
		if(nCurScrWidth > MinimumScrWidth)
	    {
	        // Take into account the padding too....
	        divWidth = parseInt(nCurScrWidth-nMenuWidth)- 38; // parseInt(nCurScrWidth) - parseInt(divNavObj.offsetWidth) - 25; // parseInt(nCurScrWidth-nMenuWidth) - 25;
	        // check for multi window pom screen and remove nMenuWidth because left navigation is not there in multi window pom
            if (mainDivId == '_dtlSection_12702' || $("#"+mainDivId).attr('docviewid')+""=='2411')
	        {
	        	divWidth = parseInt(nCurScrWidth)- 18;
	        }
	    }
		
	    
    	var $controlledDivObj = $(controlledDivObj);
		
		/* Need to set controlled div's parent table position back to static or
    	 * _getComponentLeft(controlledDivObj) will yield incorrect result due to
    	 * retrieving controlled div's parent's offsetLeft relative to document
    	 * instead of its parent. 
    	 */
		var $closestParentTable = $controlledDivObj.closest('table'),
			positionValueBefore = $closestParentTable.css('position');
		
		$closestParentTable.css('position', 'static');
    	
    	var selx = _getComponentLeft(controlledDivObj);
    	
    	// Setting position property back to original value
    	$closestParentTable.css('position', positionValueBefore);
	    	
	    var parentx = _getComponentLeft(parentDivObj);

	    var controlledDivScrollWidth = controlledDivObj.scrollWidth;
	    
	    // the div has greater width then what is available
	    if (controlledDivScrollWidth > (divWidth - (selx - parentx)))
	    {
	        /* Tracker#: 20485 - SAFARI & FIREFOX: NO SCROLLS AVAILABLE ON ADD POM POP-UP OFF OF TECH
	         * Issue - vertical scrollbar on #PomSizeGrade div on Add POM popup was overlapping content.
	         * Fix - when setting width of div controlled by slider, take into account
	         * that there can be a vertical scrollbar.
	         */
	    	// if Add POM popup
	    	if (mainDivId === '_dtlSection_30008')
	    	{
	    		var $POMSizeGradeDiv = $('#' + mainDivId).closest('#PomSizeGrade');
	    		// If the POMSizeGrade div has vertical scrollbar
	    		if (hasScrollbar($POMSizeGradeDiv[0],'vertical'))
	    		{
	    			// Take scrollbar width into account
	    			setWidth(controlledDivObj, divWidth - (selx - parentx) - nScrlbar);
	    		}
	    	}
	    	else
	    	{
	    		setWidth(controlledDivObj, divWidth - (selx - parentx));
	    	}
	    	
	    }
	    else
	    {
	        setWidth(controlledDivObj, controlledDivScrollWidth);
	    }
	    
	    // Register with toggleNav so this function's calls can be called on toggle.
	    _showWorkArea.toggleNav.register('sliderAdjustControlledDivWidth', arguments);
	}
    
}



function test(y)
{
    alert(y);
}

// debugging function to print obj data
function printDivInfo(obj)
{
    var sz = "Top = " + obj.offsetTop;
    sz+= "\nLeft = " + obj.offsetLeft;
    sz+= "\nWidth = " + obj.offsetWidth;
    sz+= "\nScrollWidth = " + obj.scrollWidth;
    sz+= "\nHeight = " + obj.offsetHeight;
    sz+= "\nScrollHeight = " + obj.scrollHeight;
    return sz;
}
//Tracker#: 18625 f8 - ability to create a capacity projections record
//New object to store slider ids
function SldrPicker(id,div)
{
	this.id=id;
	this.div=div;
}
//Tracker#: 18625 f8 - ability to create a capacity projections record
// clearing the slider id array
function flushSldrs()
{
	sldrs=null;
	sldrs=new Array();
}
//Tracker#: 18625 f8 - ability to create a capacity projections record
//function to slider id
function getSliderId(div)
{
	var sid;
	for ( var i = 0; i < sldrs.length; i++)
	{
		var pkr=sldrs[i];
		if ( div == pkr.div)
		{
			sid = pkr.id;
			break;
		}
	}	
	return sid;
}
//Tracker#: 18625 f8 - ability to create a capacity projections record
//function to store slider id
function storeSlider(sldrPkr)
{
	sldrs[sldrs.length] = sldrPkr;
}
