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

function applySummaryFilters(sectionTagName, sectionType, rowIndex)
{

   var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
   if( objAjax && objHTMLData)
   {
    objHTMLData.resetChangeFields();        
   }
    var url = "summarizeby&sectionTagName=" + sectionTagName+ "&sectionType=" +  sectionType + "&rowIndex=" + rowIndex;
    loadWorkArea("projectionssummaryoverview.do", url);

}

// The generated Id for the All Check box is different from
function toggleFilterByCheckboxSelect(thisObj, id, rowNo , prefix)
{
    toggelDetailCheckboxSelect(thisObj, id, rowNo, prefix);
}

function filterOnFilterBy()
{
    var objHTMLAjax = new htmlAjax();
    objHTMLAjax.setActionURL("projectionssummaryoverview.do");
    objHTMLAjax.setActionMethod("filterby");
    objHTMLAjax.setProcessHandler(_defaultWorkAreaSave);
    sendFilterByValues(objHTMLAjax);
}

function sendFilterByValues(objHTMLAjax)
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objHtmlData = htmlAreaObj.getHTMLDataObj();
    var docviewid = htmlAreaObj.getDocViewId();
    if (objHtmlData != null && objHtmlData.hasUserModifiedData() == true)
    {
        objHtmlData.performSaveChanges(null, objHTMLAjax);
    }
    else
    {
        var objAjax = new htmlAjax();
        objAjax.error().addError("warningInfo", szMsg_No_change, false);
        _displayProcessMessage(objAjax);
    }
}

function sortProjectionsSummaryColumn(fieldName,sec,type, pageNo)
{
    sec =   _getWorkAreaObj().getDivSaveContainerName();
    sortProjectionsSummaryOverView(fieldName,sec,type, pageNo, "projectionssummaryoverview.do");
}

// reloading the WorkArea
function sortProjectionsSummaryOverView(fieldName,sec,type, pageNo, url)
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
//Tracker#:18085 F11 - MORE ACTIONS PROCESS > CREATE MATERIAL QUOTE FROM MATERIAL PROJECTION SUMMARY 
//To create the Material Quote for the selected projections summaries.
//Tracker#: 19200  UNABLE TO CREATE MATERIAL QUOTE IN MATERIAL LIBRARY ON NAVIGATING FROM PROJECTION SUMMARY
function createMaterialQuoteFromProjection()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();	
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    if(!isValidRecord(true))
    {
        return;
    }

    if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
    {
        var htmlErrors = objAjax.error();
        objAjax.error().addError("warningInfo", "Please select one or more projections summary details.", false);
        messagingDiv(htmlErrors);
        return;
    }
    
    if(objAjax && objHTMLData)
    {

        objAjax.setProcessHandler(_showProjectionSummaryWorkArea);
        objAjax.setActionURL("projectionssummaryoverview.do?method=creatematerialquote");

        // If the user has selected the checkboxes then these
        // should be available as Parameters in the request.
        //if(objHTMLData.checkForChanges())
        //{
            objHTMLData.performSaveChanges(_showProjectionSummaryWorkArea, objAjax);
        //}
        //else
        //{
            //objAjax.sendRequest();
        //}
    }
}

function _showProjectionSummaryWorkArea(objAjax)
{
	var htmlAreaObj  = _getWorkAreaDefaultObj();
	var objHTMLData = htmlAreaObj.getHTMLDataObj()
	if(objHTMLData && !objAjax.error().hasErrorOccured())
	{
		objHTMLData.resetChangeFields();
	}
	_showWorkArea(objAjax);
}

//Tracker #: 18038 HYPERLINK AND NAVIGATION TO MATERIAL QUOTE FROM PROJECTION SUMMARY
//Link to navigate to Material Quote Overview screen.
function _goToMatQuoteOverview()
{
	if(!isValidRecord(true))
    {
        return;
    }
    
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    
    if(objAjax && objHTMLData)
	{
		// isDataModified checks if the data is alone modified or not
    	// Does not consider the Checked Boxes selection as changed fields
    	if(objHTMLData!=null && objHTMLData.isDataModified())
    	{
    		var htmlErrors = objAjax.error();
        	htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
        	// If user confirms to save then call saveWorkArea()
        	// else continue with the _showMatQuote()
        	messagingDiv(htmlErrors, "saveWorkArea()", "_NavToMatQuote()");
        	return;
      	}
      	_NavToMatQuote();
	}
}
    	
function _NavToMatQuote()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    if(objHTMLData!=null)
    {
 		objHTMLData.resetChangeFields();
 	}
	closeMsgBox();
	bShowMsg = true;
	//var url ="navigateToMatQuote&_nColLibRow=" + _nColLibRow ;
	var url ="navigateFromProjSummary&_nColLibRow=" + _nColLibRow ;
    url += "&keyinfo= " +getComponentKeyInfo();
    //alert("url " + url + "\n_nColLibRow:"+ _nColLibRow);
	//var url = "navigateToMatQuote";
    loadWorkArea("materialquoteoverview.do", url);
}

/** Tracker#: 18037 F12 - NAVIGATIONAL LINK TO MATERIAL PROJECTION OVERVIEW FROM SUMMARY SCREEN AND BACK
Link to navigate to Projection Summary, the navigation will be to a single Projection record and not to
the Group which will list all the projections.
*/
function _goToProjectionOverview()
{
	if(!isValidRecord(true))
    {
        return;
    }
    
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    
    if(objAjax && objHTMLData)
	{
		// isDataModified checks if the data is alone modified or not
    	// Does not consider the Checked Boxes selection as changed fields
    	if(objHTMLData!=null && objHTMLData.isDataModified())
    	{
    		var htmlErrors = objAjax.error();
        	htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
        	// If user confirms to save then call saveWorkArea()
        	// else continue with the _showMatQuote()
        	messagingDiv(htmlErrors, "saveWorkArea()", "_navToProjectionsOverview()");
        	return;
      	}
      	_navToProjectionsOverview();
	}
}
    	
function _navToProjectionsOverview()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    if(objHTMLData!=null)
    {	
 		objHTMLData.resetChangeFields();
 	}
	closeMsgBox();
	bShowMsg = true;
	var url ="navigatefromprojsummary&_nColLibRow=" + _nColLibRow ;
    url += "&keyinfo= " +getComponentKeyInfo();
    loadWorkArea("projectionsoverview.do", url);
}
// ---------------------------------------------------

//Tracker #: 18035 F7 -  DETAIL SECTION QUICK SEARCH FILTER ON MATERIAL PROJECTION SUMMARY
//Quick search popup function.
var searchDialog;
function toggleSearchField(event)
{
	//alert($(window).width()*0.9);
	var title = $("#PROJ_QUICK_SEARCH").attr("title");
	var event = (window.event) ? window.event : event;
	$("<div id='qSearch' style='width:200px;height:200px' title='"+title+"'></div>").append($("#PROJ_QUICK_SEARCH").html()).appendTo("body").find("select").css("margin-right", "2");
	searchDialog = $("#qSearch").dialog({width:$(window).width()*0.9,modal:true,
		close:function(event, ui) {
			$("#qSearch").remove();
			searchDialog.dialog("destroy");
		}
	});
	var titleBar = $(".ui-dialog-titlebar a.ui-dialog-titlebar-close");
    titleBar.removeClass("ui-corner-all");
    titleBar.find(".ui-icon").html("<img src='images/close_top.gif' border='0'/>").removeClass();
    searchDialog.css("height", "100%");
	if ($.browser.msie) 
	{
		event.cancelBubble=true;
	} 
	else 
	{
		event.stopPropagation();
	}
	//Tracker#: 18806 UI ISSUE ON QUICK SEARCH OF MATERIAL PROJECTION SUMMARY SCREEN.
	//Added the spacing between two fields.
	$("#qSearch tr").css("padding-right","3px");
	$("#qSearch").focus();
	$("#qSearch input[type=text]").keyup(function(e) {
		if(e.keyCode == 13) {
			$(this).change();
			filterSummaryDetails('quickSearch');
		}
	});
	//Tracker#: 22153 MATERIAL PROJ SUMMARY QUICK SEARCH BUTTONS DISPLAYING DOUBLE IMAGE
	$("#qSearch #search tr").css("padding-right","0px");
	$("#qSearch #reset tr").css("padding-right","0px");
	$("#qSearch #showall tr").css("padding-right","0px");
	 
}

//Tracker #: 18035 F7 -  DETAIL SECTION QUICK SEARCH FILTER ON MATERIAL PROJECTION SUMMARY
//Filters the details sections based on the values entered in the quick search popup.
function filterSummaryDetails(method)
{	
	var htmlAreaObj = _getWorkAreaDefaultObj();	
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    var chgfild = getElemnt("chgflds");
    //alert(chgfild.value);
    var url = "projectionssummaryoverview.do";
    if(objAjax && objHTMLData)
    {
    	
    	//alert($("#qSearch").html());
    	bShowMsg = true;
        objAjax.setActionURL(url);
        objAjax.setActionMethod(method);
        objAjax.setProcessHandler(_showWorkArea);
        objAjax.parameter().add("chgflds", chgfild.value);
        //alert(chgfild.value);
        objHTMLData._appendAllContainerDataToRequest(objAjax, 'qSearch');
        
        objAjax.sendRequest();
        searchDialog.dialog('close');
    }
}


//Tracker #: 18035 F7 -  DETAIL SECTION QUICK SEARCH FILTER ON MATERIAL PROJECTION SUMMARY
//Reset the fields in the quick search popup.
var defaultOpsValues;
function resetValues()
{
    var defaultOps = getElemnt("defaultOpValue");
    //Holds the search field operator values and used while resetting the operator select fields.
    defaultOpsValues= defaultOps.value.split(";");
    var objCnt = getElemnt("qSearch");
    var objQuickSearchFields = new Array();
    //Holds the html input type fields.
    objQuickSearchFields = objCnt.getElementsByTagName("INPUT");
    resetFields(objQuickSearchFields);
    //Holds the html select type fields.
    objQuickSearchFields = objCnt.getElementsByTagName("SELECT");
    resetFields(objQuickSearchFields);
    var chgfild = getElemnt("chgflds");
    chgfild.value='';
    
}
//Resets the fields in the quick search popup.
function resetFields(objQuickSearchFields)
{
	for (i = 0; i < objQuickSearchFields.length; i++)
    {
        var formElem = objQuickSearchFields.item(i)
        var name = formElem.name;
        //alert(name);
        if(name.indexOf('F') < 0)
        {
           continue;
        }

        if (formElem.type == 'text' || formElem.type == 'textarea')
        {
            formElem.value = '';
        }
        else if(formElem.type == 'select-one')
        {

          var fieldType = name.substring(eval(name.lastIndexOf('_')) + 1,name.length);

          if(fieldType == 'op')
          {
             var foundField = new Boolean(false);

	          for(j = 0 ;j < defaultOpsValues.length ; j++)
	          {
	             var fieldOperator = defaultOpsValues[j].split(',');

	             if(name == fieldOperator[0])
	             {
	                 formElem.value = fieldOperator[1];
	                 foundField = new Boolean(true);
	                 break;
	             }
	          }

	          //default operator
	          if(foundField == false)
	          {
	             formElem.value = '2';
	          }
          }
          else
          {
             formElem.options[0].selected = true;
          }
        }
    }
}
//Tracker #: 18035 F7 -  DETAIL SECTION QUICK SEARCH FILTER ON MATERIAL PROJECTION SUMMARY
//displays all the details
function showAllSummaryDetails(method)
{
	
	searchDialog.dialog('close');
		
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    var url = "projectionssummaryoverview.do";
    if(objAjax && objHTMLData)
    {
        bShowMsg = true;
        objAjax.setActionURL(url);
        objAjax.setActionMethod(method);
        objAjax.setProcessHandler(_showWorkArea);
        objAjax.sendRequest();
    }
	
}
