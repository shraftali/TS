/** ********************************** */
/* Copyright (C) 2002 - 2010 */
/* by */
/* TradeStone Software, Inc. */
/* Gloucester, MA. 01930 */
/* All Rights Reserved */
/* Printed in U.S.A. */
/* Confidential, Unpublished */
/* Property of */
/* TradeStone Software, Inc. */
/** ********************************** */
//

//Tracker#: 23963 FR08 PROVIDE VISIBILITY TO THE ASSIGNMENT FROM VENDOR PURCHASE ORDER. 

//defined name space for the order assignment tab 
//The same object is used and updated all the functions accordingly
var SOAssignmentTab = {};

SOAssignmentTab.sortPOAssignmentColumn=function sortPOAssignmentColumn(fieldName,sec,type, pageNo, alias )
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
	sectionName = sec;
    var objAjax = htmlAreaObj.getHTMLAjax();
    if(objAjax)
    {
        objAjax.setActionURL("soassignment.do");
        objAjax.setActionMethod("SORT&sortColumn="+fieldName+"&sort="+type+"&pageNum="+pageNo+"&alias="+alias);
        objAjax.setProcessHandler(_assignmentShowPage);
        objAjax.sendRequest();
    }
}

//reload page
function _assignmentShowPage(objAjax)
{
    if(objAjax)
    {
    	if(bShowMsg==true)
    	{
    		msgInfo = objAjax.getAllProcessMessages();

		    if(msgInfo!="")
		    {
		       //_displayUserMessage(msgInfo);
		        _displayProcessMessage(objAjax);
		    }
    	}

    	//alert("reload");
        _reloadArea(objAjax, sectionName);
        bShowMsg= false;
    }
}

//-- Tracker#: 24226 FR08 ADD QUICK SEARCH FUNCTIONALITY TO SALES ORDER ASSIGNMENT TAB
//Added the Quick Search functionality to Sales Order Assignment tab.
var QSrchOA = new QSearchChangeFields();
SOAssignmentTab.QuickSearchPopUp = function(obj)
{
	QSrchOA.resetChngFlds();
    SOAssignmentTab.callDetailAction("showQuickSearch&qsrchName=QSrchOA","SOAssignmentTab.QukSrchResponse");
}
//Ajax response of _deliverySplitPopUp handled here
SOAssignmentTab.QukSrchResponse = function(objAjax)
{
    if(objAjax)
	{
		if(objAjax.isProcessComplete())
		{
			//alert(objAjax.getResult());
            var comments = new Popup("OAQsearch","Quick Search", objAjax.getResult(),150,1110);
			comments.show();

            // Tracker#: 23467
            // Add the keyup event to submit the page when enter key is pressed.
            $("#OAQsearch").keyup(function(e) {

                if(e.keyCode == 13) {
                    SOAssignmentTab.oaquickSearch();
		        }
	        });
        }
		objAjax = null;
	}
}

SOAssignmentTab.callDetailAction = function(actionMethod,processHndlr)
{
	//alert("detail");
	objAjax = new htmlAjax();
	objAjax.setActionURL("soassignment.do");
	objAjax.setActionMethod(actionMethod);
	objAjax.setProcessHandler(processHndlr);
	objAjax.sendRequest();
}

SOAssignmentTab.oaquickSearch = function()
{
	//alert("called");
	var val = QSrchOA.qsChngFldsNVal;
	var oprs = QSrchOA.qsChngFldsOpr;
	var chFlds = QSrchOA.qsChngFlds;

	var msg = "Please select search operator(s)."

	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objHtmlData = htmlAreaObj.getHTMLDataObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
	objAjax.setActionURL("soassignment.do");
	objAjax.setActionMethod("quickSearch");
	objAjax.setProcessHandler(showDocumentPage);

	// Adding the changed fields to the request.
	var fls = "";
	for (i=0; i < chFlds.length; i++)
	{
		fls += chFlds[i]+fldDelim;
	}
	objAjax.parameter().add("dChFlds", fls);

	for (i=0; i < val.length; i++)
	{
		var spl = val[i].split("|");
		objAjax.parameter().add(spl[0], spl[1]);
		var op = getElemnt(spl[0]+"_opr");
		//If the user has not selected the operator for the field show message.
		// otherwise add operator field id and value to request
		if (op.value == "-1")
		{
			var objAjax = new htmlAjax();
			var htmlErrors = objAjax.error();
			objAjax.error().addError("warningInfo", msg, false);
			messagingDiv(htmlErrors);
			return;
		}else
		{
			objAjax.parameter().add(spl[0]+"_opr", op.value);
		}
	}
	var hasNullOpr = false;
	for (i=0; i < oprs.length; i++)
	{
		s = oprs[i];
		var spl = s.split("|");
		if (  spl[1] == "13" || spl[1] == "14")
		{
			hasNullOpr = true;
			var op = getElemnt(spl[0]);
			objAjax.parameter().add(spl[0], op.value);
		}
	}
	if (!hasNullOpr && val.length < 1)
	{
		return;
	}
	SOAssignmentTab.oaPopupClose('OAQsearch');
	sectionName = '_divWorkArea';
	bShowMsg = true;
	objHtmlData._mHasUserModifiedData =true;
	objHtmlData.performSaveChanges(showDocumentPage,objAjax);
}

SOAssignmentTab.oaShowAll = function()
{
	objAjax = new htmlAjax();
	objAjax.setActionURL("soassignment.do");
	objAjax.setActionMethod("showAll");
	objAjax.setProcessHandler("SOAssignmentTab.refreshOAScreen");
	objAjax.sendRequest();
}


SOAssignmentTab.refreshOAScreen = function (objAjax)
{
	_execAjaxScript(objAjax);
    SOAssignmentTab.oaPopupClose('deliPopup');
    SOAssignmentTab.oaPopupClose('OAQsearch');
    executeDocumentProcess('soassignment.do','view&refresh=Y', false, false);
  //For displaying message on screen.
	if(bShowMsg==true)
   	{
   		msgInfo = objAjax.getAllProcessMessages();
	    if(msgInfo!="")
	    {
	        _displayProcessMessage(objAjax);
	    }
   	}
}

//Called when user clicks on Cancel button of Delivery split pop up
SOAssignmentTab.oaPopupClose = function (popName)
{
	//dialog window
	if (commentsDialog)
	{
		commentsDialog.dialog("close");
	}
	$("#"+popName).html('');
	$("#"+popName).dialog('destroy');
	$("#"+popName).remove();
	OrderJsModule.delShown = false;	
}

//Tracker#: 24227 FR08 ADD ADDERSS ASSOCIATION SMART TAG FOR VENDOR ADDRESS, FACTORY ADDRESS AND SHIP TO
SOAssignmentTab.showAddress = function(htmlfldName, keyvaluepair, addressType)
{
	if(keyvaluepair)
	{
	    var actMethod = "showAddress&keyValue="+keyvaluepair+"&addressType="+addressType;
	    var htmlAreaObj = _getWorkAreaDefaultObj();
	    var objAjax = htmlAreaObj.getHTMLAjax();
	    if(objAjax)
	    {
	    	//passing the value for parameter invokeCompOnFocus.
	        _startSmartTagPopup(htmlfldName, false, null, false, false);
	        bShowMsg = true;
	        objAjax.setActionURL("soassignment.do");
	        objAjax.setActionMethod(actMethod);
	        objAjax.attribute().setAttribute("htmlfldName", htmlfldName);
	        objAjax.setProcessHandler(showPopup);
	        objAjax.showProcessingBar(false);
	        objAjax.sendRequest();
	    }
	}

}

function showPopup(objAjax)
{
	if(objAjax)
	{
	    _displayProcessMessage(objAjax);
	    if(!objAjax.isProcessComplete())
	    {
	        _closeSmartTag();
	    }
	    else
	    {
    	  	objAjax.attribute().setAttribute("htmlfldOnFocus", "0");
	        var popUpDiv = _showSmartTagPopup(objAjax);
	        //To dispaly the popup in center of the page and make it draggable if the html element is not loaded.
	        if(!document.getElementById(objAjax.attribute().getAttribute("htmlfldName")))
        	{
        		positionPageCenter(popUpDiv);
        		draggable = $(popUpDiv).draggable();
        	}
	        
	        //Set the Pupup height if it is greater than 450px. and provided the vertical scrool bar.
	        var childDiv = $(popUpDiv).children("div").get(0);
	        if($(childDiv) && $(childDiv).height() > 450)
        	{
	        	var subDiv = $(childDiv).find("DIV").get(0);
	        	var divStyle = $(subDiv).attr('style')+';height: 450px;overflow-y:auto;';
	        	$(subDiv).attr('style',divStyle);
        	}
		        
	    }
	}
}

//Tracker#: 24228 FR08 ADD DATES SMART TAG IN SALES ORDER ASSIGNMENT TAB  
SOAssignmentTab.showDates= function(htmlfldName, keyvaluepair, level)
{
	if(keyvaluepair)
	{
	    var actMethod = "showDate&keyValue="+keyvaluepair+"&level="+level;
	    var htmlAreaObj = _getWorkAreaDefaultObj();
	    var objAjax = htmlAreaObj.getHTMLAjax();
	    if(objAjax)
	    {
	    	//passing the value for parameter invokeCompOnFocus.
	        _startSmartTagPopup(htmlfldName, false, null, false, false);
	        bShowMsg = true;
	        objAjax.setActionURL("soassignment.do");
	        objAjax.setActionMethod(actMethod);
	        objAjax.attribute().setAttribute("htmlfldName", htmlfldName);
	        objAjax.setProcessHandler(showPopup);
	        objAjax.showProcessingBar(false);
	        objAjax.sendRequest();
	    }
	}
	
}
