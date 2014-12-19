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
// Tracker#: 14898 IMPLEMENT SEASONAL CALENDAR FUNCTIONALITY
// This function forwards the user to Seasonal Calendar Overview Screen.
function showCalendarOverview(obj)
{
	if(obj	!= null) {
		if(obj.parentNode.id != ""){
			obj = obj.parentNode;
		}
		var navigationDiv = document.getElementById("navigationGridTable").getElementsByTagName("div");
		for(i=0;i<navigationDiv.length;i++){
			if("gridDiv_"+i == obj.id){
				document.getElementById("gridDiv_"+i).className = "colorWallCellSpaceNavigatorSelected";
			} else {
				document.getElementById("gridDiv_"+i).className = "colorWallCellSpaceNavigator";
			}
		}
	}
    var url ="TOOVERVIEW&_nColLibRow=" + _nColLibRow ;
    url += "&keyinfo= " +getComponentKeyInfo();
    loadWorkArea("seasonalcal.do", url);
}


function createCalendar()
{
	var url = "createcalendar";

	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	sectionName = objAjax.getDivSectionId();
    if(objAjax && objHTMLData)
    {
    	bShowMsg = true;
       	loadWorkArea("seasonalcaloverview.do", url);
       	if(objAjax.isProcessComplete())
        {
            objHTMLData.resetChangeFields();
        }
    }
}

function deletecalendar()
{
	
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
   	var docview;
   	if(objAjax)
   	{
   		// Check for valid record to execute process.
	   	if(!isValidRecord(true))
		{
			return;
		}
		
		if(objHTMLData!=null && objHTMLData.isDataModified()==true)
        {
            var htmlErrors = objAjax.error();
            htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
	   		messagingDiv(htmlErrors, "saveWorkArea()", "_sco_deleteCal(1)");
	   		return;
        }
        else
        {
        	_sco_deleteCal();
        }		
   	}
}

function _sco_deleteCal(reset)
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
   	var objHTMLData = htmlAreaObj.getHTMLDataObj();
   	var confirmMsg = szMsg_SeasonalCal_Delete_Confirm;
   	if(1==reset)
   	{
   		objHTMLData.resetChangeFields();
   	}
   	if(objHTMLData.checkForChanges())
   	{
   		confirmMsg = szMsg_SeasonalCal_Events_Delete_Confirm;
   	}
	var htmlErrors = objAjax.error();
	htmlErrors.addError("confirmInfo", confirmMsg,  false);
	messagingDiv(htmlErrors,'deleteCalendarOverview()', 'calendaroverviewcancel()');
}



function deleteCalendarOverview()
{
	
	var url = "deletecalendar";
	var docview;
	closeMsgBox();
	
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objAjax.getDivSectionId();
	if(objAjax && objHTMLData)
	{	
		
        objAjax.setProcessHandler(_showSubmitWorkArea);
        
        if(objHTMLData.checkForChanges())
        {
        	objAjax.setActionURL("seasonalcaloverview.do?method=deletecalendar");
        	objHTMLData.performSaveChanges(_showSubmitWorkArea, objAjax);
       	}
       	else
       	{
       		objAjax.setActionURL("seasonalcaloverview.do?method=deletecalendar&deleteall=1");
       		objAjax.sendRequest();
       	}
	}
}

function calendaroverviewcancel(){
	closeMsgBox();	
}

function refreshCalendarOverview()
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
		  loadWorkArea("seasonalcaloverview.do", url);
	}
}


function calculateDate(obj,secondFieldId, durationFieldId)
{
	//alert("calculate called");
}

function calculateDuration(obj,secondFieldId, durationFieldId)
{
	//alert("calculateDuration called");
}

function showCalSCMain()
{
    var url = "smartcopy";

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
   		
    	bShowMsg = true;
       	loadWorkArea("seasonalcaloverview.do", url);
       	if(objAjax.isProcessComplete())
        {
            objHTMLData.resetChangeFields();
        }
    }
    
}


//Function schedulePlan
function schedulePlan()
{
    var url = "scheduled";
 	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();

    sectionName = objAjax.getDivSectionId();
	//alert("sectionName  " + sectionName);
    if(objAjax && objHTMLData)
    {
	    if(!isValidRecord(true))
		{
			return;
		}
	    bShowMsg = true;
       	loadWorkArea("seasonalcaloverview.do", url);
        if(objAjax.isProcessComplete())
        {
            objHTMLData.resetChangeFields();
        }
    }
}

//Tracker#: 15748 ADD TWO NEW PROCESSES TO SEASONAL CALENDAR - REVISED PLAN AND ACTUAL PLAN
function actualPlan()
{
    var url = "actual";
 	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();

    sectionName = objAjax.getDivSectionId();
	//alert("sectionName  " + sectionName);
    if(objAjax && objHTMLData)
    {
	    if(!isValidRecord(true))
		{
			return;
		}
	    bShowMsg = true;
       	loadWorkArea("seasonalcaloverview.do", url);
        if(objAjax.isProcessComplete())
        {
            objHTMLData.resetChangeFields();
        }
    }
}

function revisedPlan()
{
    var url = "revised";
 	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();

    sectionName = objAjax.getDivSectionId();
	//alert("sectionName  " + sectionName);
    if(objAjax && objHTMLData)
    {
	    if(!isValidRecord(true))
		{
			return;
		}
	    bShowMsg = true;
       	loadWorkArea("seasonalcaloverview.do", url);
        if(objAjax.isProcessComplete())
        {
            objHTMLData.resetChangeFields();
        }
    }
}

