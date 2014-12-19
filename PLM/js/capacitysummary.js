/*************************************/
/*  Copyright  (C)  2002 - 2011      */
/*           by                      */
/*  TradeStone Software, Inc.        */
/*  Gloucester, MA. 01930            */
/*  All Rights Reserved              */
/*  Printed in U.S.A.                */
/*  Confidential, Unpublished        */
/*  Property of                      */
/*  TradeStone Software, Inc.        */
/*************************************/

// The generated Id for the All Check box is different from
//Tracker#: 19810 CAPACITY SUMMARY - BLANK WHITE SCREEN DISPLAYED ON FILTERING DATA ON FILTER BY SECTION
//Method name is changed from toggleFilterByCheckboxSelect to toggleCapFilterByCheckboxSelect
function toggleCapFilterByCheckboxSelect(thisObj, id, rowNo , prefix)
{
    toggelDetailCheckboxSelect(thisObj, id, rowNo, prefix);
}
//Tracker#: 19810 CAPACITY SUMMARY - BLANK WHITE SCREEN DISPLAYED ON FILTERING DATA ON FILTER BY SECTION
//Method name is changed from filterOnFilterBy to filterCapOnFilterBy

function filterCapOnFilterBy()
{
    var objHTMLAjax = new htmlAjax();
    objHTMLAjax.setActionURL("capacitysummaryoverview.do");
    objHTMLAjax.setActionMethod("filterby");
    objHTMLAjax.setProcessHandler(_defaultWorkAreaSave);
    sendCapFilterByValues(objHTMLAjax);
}
//Tracker#: 19810 CAPACITY SUMMARY - BLANK WHITE SCREEN DISPLAYED ON FILTERING DATA ON FILTER BY SECTION
//Method name is changed from sendFilterByValues to sendCapFilterByValues

function sendCapFilterByValues(objHTMLAjax)
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objHtmlData = htmlAreaObj.getHTMLDataObj();
    var docviewid = htmlAreaObj.getDocViewId();
    objHtmlData._mHasUserModifiedData=true;
    //if (objHtmlData != null && objHtmlData.hasUserModifiedData() == true)
    {
        objHtmlData.performSaveChanges(null, objHTMLAjax);
    }
    /*else
    {
        var objAjax = new htmlAjax();
        objAjax.error().addError("warningInfo", szMsg_No_change, false);
        _displayProcessMessage(objAjax);
    }*/
}

function sortSummaryColumn(fieldName,sec,type, pageNo)
{
    sec =   _getWorkAreaObj().getDivSaveContainerName();
    sortSummaryOverView(fieldName,sec,type, pageNo, "capacitysummaryoverview.do");
}

// reloading the WorkArea
function sortSummaryOverView(fieldName,sec,type, pageNo, url)
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    if(objAjax && objHTMLData)
    {
        var method = "SORT&sortColumn="+fieldName+"&sort="+type+"&pageNum="+pageNo;
        bShowMsg = true;
        sectionName = sec;
        objAjax.setActionURL(url);
        objAjax.setActionMethod(method);
        objAjax.setProcessHandler(refreshPageAfterSort);
        if(objAjax.isProcessComplete())
        {
            objHTMLData.resetChangeFields();
        }
        objAjax.sendRequest();
    }
}

function _showSummaryWorkArea(objAjax)
{
	var htmlAreaObj  = _getWorkAreaDefaultObj();
	var objHTMLData = htmlAreaObj.getHTMLDataObj()
	if(objHTMLData && !objAjax.error().hasErrorOccured())
	{
		objHTMLData.resetChangeFields();
	}
	_showWorkArea(objAjax);
}

//Tracker #: 19302 TASK TO UPDATE  CAPACITY UNITS  FROM MATCHING QUOTE, SELLCHANNEL
//Executes CapacityUpdateUnitsTask
//Tracker#: 19810 CAPACITY SUMMARY - BLANK WHITE SCREEN DISPLAYED ON FILTERING DATA ON FILTER BY SECTION
//Method name is changed from updateUnits to updateCapUnits
function updateCapUnits()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    var url = "capacitysummaryoverview.do";
    if(objAjax && objHTMLData)
    {
        bShowMsg = true;
        objAjax.setActionURL(url);
        objAjax.setActionMethod("updateUnits");
        objAjax.setProcessHandler(_showWorkArea);
        objAjax.sendRequest();
    }
}

function showReservedBooked(rowNo, fieldName)
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var url = "capacitysummaryoverview.do";
    if(objAjax)
    {
        objAjax.setActionURL(url);
        objAjax.setActionMethod("showunits&rowno="+ rowNo +"&fieldname=" + fieldName);
        objAjax.setProcessHandler(showReservedBookedPopUp);
        objAjax.sendRequest();
    }
}

function showReservedBookedPopUp(objAjax)
{
    if(objAjax)
    {
    	if(bShowMsg==true)
    	{
    		msgInfo = objAjax.getAllProcessMessages();

		    if(msgInfo!="")
		    {
		        _displayProcessMessage(objAjax);
		    }
    	}
        var bookedReservedHTML = objAjax.getHTMLResult();

        $("<div id='showUnits' style='width:200px;height:200px' title=''></div>").appendTo("body").find("select").css("margin-right", "2");
        $("#showUnits").html(bookedReservedHTML);
        //Tracker#: 23871 HTML5 CAPACITY SUMMARY: YELLOW SLIDER OVERLAPS THE POP UP FROM THE BALL ICON
        //Increased the zIndex to max.
        showUnitsDialog = $("#showUnits").dialog({width:$(showUnits).width(),modal:true, zIndex:9999,
            close:function(event, ui) {
                $("#showUnits").remove();
	            showUnitsDialog.dialog("destroy");
            }
	    });

        var titleBar = $(".ui-dialog-titlebar a.ui-dialog-titlebar-close");
        titleBar.removeClass("ui-corner-all");
        titleBar.find(".ui-icon").html("<img src='images/close_top.gif' border='0'/>").removeClass();
        showUnitsDialog.css("height", "100%");

        $("#showUnits").parent().width("auto");

        bShowMsg= false;
    }
}

// Tracker#: 19737
// If the checkbox is marked or unmarked just notify the changes to chgflds hidden variable.
function filterAmountGtZero(obj)
{
    _notifyCheckBoxChangeFields(obj, true);
}
// ---------------------------------------------------
