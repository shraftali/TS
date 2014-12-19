/** ********************************** */
/* Copyright (C) 2002 - 2011 */
/* by */
/* TradeStone Software, Inc. */
/* Gloucester, MA. 01930 */
/* All Rights Reserved */
/* Printed in U.S.A. */
/* Confidential, Unpublished */
/* Property of */
/* TradeStone Software, Inc. */
/** ********************************** */

//Tracker#: 19603 CAPACITY (SEARCH SCREEN) AND CAPACITY PROJECTION SUMMARY- SORT ICON DOES NOT WORK.
//Added the missing js functions.
function sortCapacityColumn(fieldName,sec,type, pageNo)
{
    sortColumnForSection(fieldName,sec,type, pageNo, "capacity.do")
}

function sortColumnForSection(fieldName,sec,type, pageNo, url)
{
   Process.sendRequest(sec, url, "SORT&sortColumn="+fieldName+"&sort="+type+"&pageNum="+pageNo, refreshPageAfterSort);
}

function refreshPageAfterSort(objAjax)
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
        // Refresh only the div identified by the sectionName
        // This needs to be set by the caller.
        _reloadArea(objAjax, sectionName);
        bShowMsg= false;
    }
}

//Tracker#: 18915 F4 ADD NEW VENDOR/FACTORY CAPACITY DOCUMENT 
//This function is to navigate to the capacity overview screen
function showCapacityOverview(obj)
{
	Process.showOverview(obj, "capacity.do", "TOOVERVIEW");
}

//This function is to create capacity record
function createCapacity()
{
	Process.execute("createcapacity", "capacityoverview.do");
}
//This function is to refresh capacity record
function capacityRefresh()
{
	var url = "db_refresh";
	
	if(!isValidRecord(true))
	{
		return;
	}
	
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objAjax.getDivSectionId();
    
	if(objAjax && objHTMLData)
	{
      	loadWorkArea("capacityoverview.do", url);
	}
}
//This function is to delete capacity record
function capacityDelete()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
   	if(objAjax)
   	{
   		// Check for valid record to execute process.
	   	if(!isValidRecord(true))
		{
			return;
		}

		// Changes have been done, prompt the User
		// to decide whether the User will Save or
		// continue with the deletion.
		if(objHTMLData!=null && objHTMLData.isDataModified())
        {
            var htmlErrors = objAjax.error();
            htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
	   		messagingDiv(htmlErrors, "saveWorkArea()", "_capDelete()");
	   		return;
        }
        // No changes simply Delete
        else
        {
        	_capDelete();
        }		
   	}
}

function _capDelete()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
   	var objHTMLData = htmlAreaObj.getHTMLDataObj();
   	// Do you want to delete entire record ?
   	var confirmMsg = szMsg_Capacity_Delete_Confirm;
	var htmlErrors = objAjax.error();
	htmlErrors.addError("confirmInfo", confirmMsg,  false);
	messagingDiv(htmlErrors,'deleteCapacityOverview()', 'closeMsgBox()');
}

function deleteCapacityOverview()
{
	var url = "delete";
	var docview;
	closeMsgBox();
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objAjax.getDivSectionId();
    
	if(objAjax && objHTMLData)
	{	
		objAjax.setProcessHandler(_showCapacityWorkArea);

		objAjax.setActionURL("capacityoverview.do?method=delete");
		objAjax.sendRequest();
	}
}

function _showCapacityWorkArea(objAjax)
{
    try
    {
        if(objAjax)
        {
            _displayProcessMessage(objAjax)
            var div=getElemnt(_getWorkAreaDefaultObj().getDivSaveContainerName());
            if(div)
            {
               registerHTML(div,objAjax);
            }

            alignWorkAreaContainer();
            if(nCurScrWidth > MinimumScrWidth)
            {
               resetAllMainDivs();
            }
            // The Left Side Navigation should reflect the deleted quote.
			var refereshNavigator = objAjax.getResponseHeader("refereshNavigator");
			if(refereshNavigator && refereshNavigator == "false")
			{
            	_showWorkArea(objAjax);
			}
			else
			{
	        	refreshNavigationGrid(objAjax);
	        }
        }
    }
    catch(e)
    {
        //alert(e.description);
    }
}
//This function is to calculate blocked_pct_alloc
function calcBlockedPct(changedField)
{
	var fieldName = changedField.getAttribute("NAME");
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    if(objAjax)
    {
        var url = "capacityoverview.do";
        var actionMethod = "CALBLKPCT&changedfield=" + fieldName + "&changedfieldvalue=" + changedField.value;
        objAjax.setActionURL(url);
        objAjax.setActionMethod(actionMethod);
        objAjax.setProcessHandler(resetBlockedPct);
		objHtmlData.addToChangedFields(changedField);
        objAjax.parameter().add("chgflds", objHTMLData.getSaveChangeFields());
        objHTMLData._appendAllContainerDataToRequest(objAjax);
        objAjax.sendRequest();
    }
}

function resetBlockedPct(objAjax)
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
		

    	var blkPct = objAjax.getResponseHeader("blkAlocPctfield");
        if(blkPct != "")
    	{
            var oc = document.getElementsByName(blkPct);
            if(oc) oc = oc[0];
            oc.value = objAjax.getResponseHeader("blkAlocPct");
            //oc.onchange();
            oc.value = replaceval(oc, CommaDelimiter, Blank);
            _notifyChangeFields(oc,3);
        }
		
		var remProdLinealloc = objAjax.getResponseHeader("remProdLineAlocfield");
        if(remProdLinealloc != null && remProdLinealloc != "")
    	{
            var oc = document.getElementsByName(remProdLinealloc);
            if(oc) oc = oc[0];
            oc.value = objAjax.getResponseHeader("remProdLineAloc");
            //oc.onchange();
            oc.value = replaceval(oc, CommaDelimiter, Blank);
            _notifyChangeFields(oc,3);
        }

        updateBlockedAvailUnits(objAjax);

    	bShowMsg= false;
    }
}

function updateBlockedAvailUnits(objAjax)
{
    var blkUnitsAloc = objAjax.getResponseHeader("blkUnitsAlocfield");
    if(blkUnitsAloc != "")
    {
        var oc = document.getElementsByName(blkUnitsAloc);
        if(oc) oc = oc[0];
        oc.value = objAjax.getResponseHeader("blkUnitsAloc");

        //oc.onchange();
        oc.value = replaceval(oc, CommaDelimiter, Blank);
        _notifyChangeFields(oc,3);
        
    }
	
	var remainingAlocUnits = objAjax.getResponseHeader("remainingUnitsAlocfield");
    if(remainingAlocUnits != "")
    {
        var oc = document.getElementsByName(remainingAlocUnits);
        if(oc) oc = oc[0];
        oc.value = objAjax.getResponseHeader("remainingUnitsAloc");

        //oc.onchange();
        oc.value = replaceval(oc, CommaDelimiter, Blank);
        _notifyChangeFields(oc,3);
        
    }
	
	//Tracker#: 19616 CAPACITY SCREEN - VALUES IN BLUE BAR ARE NOT POPULATING
	//To reset the Total and Blocked units on the Capacity's Product Groups blue bar.
	resetTotNBlkedUNits(objAjax);
    
	//Call the onchange event of an element when fill up, fill down, and fill selected link is clicked.
    if(fillupfilldownObjs && fillupfilldownObjs.length > 0) 
	{
		callObjOnchange();
	}
	
}

function calcBlockedPctAloc(changedField)
{
	var fieldName = changedField.getAttribute("NAME");
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    if(objAjax)
    {
        var url = "capacityoverview.do";
        var actionMethod = "CALREMPRODLINEALOC&changedfield=" + fieldName + "&changedfieldvalue=" + changedField.value;
        objAjax.setActionURL(url);
        objAjax.setActionMethod(actionMethod);
        objAjax.setProcessHandler(resetBlockedPct);
		objHtmlData.addToChangedFields(changedField);
        objAjax.parameter().add("chgflds", objHTMLData.getSaveChangeFields());		
        objHTMLData._appendAllContainerDataToRequest(objAjax);
        objAjax.sendRequest();
    }
}



function calcBlockedProdLinesAloc(changedField)
{
	var fieldName = changedField.getAttribute("NAME");
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    if(objAjax)
    {
        var url = "capacityoverview.do";
        var actionMethod = "CALBLKPRODLINESALLOC&changedfield=" + fieldName + "&changedfieldvalue=" + changedField.value;
        objAjax.setActionURL(url);
        objAjax.setActionMethod(actionMethod);
		objHtmlData.addToChangedFields(changedField);
        objAjax.setProcessHandler(resetBlockedProdLinesAlloc);
        objAjax.parameter().add("chgflds", objHTMLData.getSaveChangeFields());
        objHTMLData._appendAllContainerDataToRequest(objAjax);
        objAjax.sendRequest();
    }
}

function resetBlockedProdLinesAlloc(objAjax)
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
		

    	var blkProdLineAlc = objAjax.getResponseHeader("blkProdLineAlcfield");
        if(blkProdLineAlc != "")
    	{
            var oc = document.getElementsByName(blkProdLineAlc);
            if(oc) oc = oc[0];
            oc.value = objAjax.getResponseHeader("blkProdLineAlc");
            //oc.onchange();
            oc.value = replaceval(oc, CommaDelimiter, Blank);
            _notifyChangeFields(oc,3);
        }
		
		var remProdLinealloc = objAjax.getResponseHeader("remProdLineAlocfield");
        if(remProdLinealloc != "")
    	{
            var oc = document.getElementsByName(remProdLinealloc);
            if(oc) oc = oc[0];
            oc.value = objAjax.getResponseHeader("remProdLineAloc");
            //oc.onchange();
            oc.value = replaceval(oc, CommaDelimiter, Blank);
            _notifyChangeFields(oc,3);
        }

        updateBlockedAvailUnits(objAjax);

    	bShowMsg= false;
    }
}

function calcBlockedUnitsAloc(changedField)
{
	var fieldName = changedField.getAttribute("NAME");
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    if(objAjax)
    {
        var url = "capacityoverview.do";
        var actionMethod = "CALBLKBLKREMUNITS&changedfield=" + fieldName + "&changedfieldvalue=" + changedField.value;
        objAjax.setActionURL(url);
        objAjax.setActionMethod(actionMethod);
		objHtmlData.addToChangedFields(changedField);
        objAjax.setProcessHandler(resetBlockedRemainUnit);
        objAjax.parameter().add("chgflds", objHTMLData.getSaveChangeFields());
        objHTMLData._appendAllContainerDataToRequest(objAjax);
        objAjax.sendRequest();
    }
}

function resetBlockedRemainUnit(objAjax)
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

        updateBlockedAvailUnits(objAjax);

    	bShowMsg= false;
    }
}

//Tracker#: 18916 F4H ADD NEW PROCESSES COMPLETE, SUBMIT, PENDING AND REVIEW
function capacityComplete()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();

    if(objAjax)
   	{
   		// Check for valid record to execute process.
	   	if(!isValidRecord(true))
		{
			return;
		}

		// Data has been changed but not saved?
		if(objHTMLData!=null && objHTMLData.isDataModified())
      	{
	   		var htmlErrors = objAjax.error();
	   		htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
	   		messagingDiv(htmlErrors, "saveWorkArea()", "continueCompleteProcess()");
	   		return;
      	}
        continueCompleteProcess();
    }
}

function continueCompleteProcess()
{
	var url = "complete";
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();

    if(objAjax && objHTMLData)
    {
        // The loadworkarea function checks for the changed fields again, reset the changed fields to avoid this.
        objHTMLData.resetChangeFields();
        bShowMsg = true;
       	loadWorkArea("capacityoverview.do", url);
    }
}

//Tracker#: 19456 CAPACITY OVERVIEW - BLOCKED UNITS ON BLUE BAR DOES NOT CALCULATE ON FILL DOWN
function resetTotNBlkedUNits(objAjax)
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
		

    	var totUnits = objAjax.getResponseHeader("totalUnitsfield");
	    if(totUnits != "")
	    {
	        var oc = document.getElementsByName(totUnits);
	        if(oc) oc = oc[0];
	        oc.value = objAjax.getResponseHeader("totalUnits");
	
	        //oc.onchange();
	        oc.value = replaceval(oc, CommaDelimiter, Blank);
	        _notifyChangeFields(oc,3);
	        
	    }
		
		var blockedUnits = objAjax.getResponseHeader("blockedUnitsfield");
	    if(blockedUnits != "")
	    {
	        var oc = document.getElementsByName(blockedUnits);
	        if(oc) oc = oc[0];
	        oc.value = objAjax.getResponseHeader("blockedUnits");
	
	        //oc.onchange();
	        oc.value = replaceval(oc, CommaDelimiter, Blank);
	        _notifyChangeFields(oc,3);
	        
	    }
    	bShowMsg= false;
    }
}
