/** ********************************** */
/* Copyright (C) 2002 - 2014 */
/* by */
/* TradeStone Software, Inc. */
/* Gloucester, MA. 01930 */
/* All Rights Reserved */
/* Printed in U.S.A. */
/* Confidential, Unpublished */
/* Property of */
/* TradeStone Software, Inc. */
/** ********************************** */
// Adding namespacing
var Competency = {};

Competency.showCompetencyOverview = function showCompetencyOverview(obj)
{
    Competency.navigateToCompetency(obj, "");
}

// This function forwards the user to Competency Overview Screen.
// Called from LS Navigation link.
Competency.showCompetencyFromNavigation = function showCompetencyFromNavigation(obj)
{
    // Just a indicator to say the navigation to overview screen is happening
    // via the link on the left side Navigation.
    var src = "&nav=1";
    Competency.navigateToCompetency(obj, src);
}

// src - indicator to indicate from where the navigation is happening to
//       overview screen.
Competency.navigateToCompetency = function navigateToCompetency(obj, src)
{
	Process.showOverview(obj, "partycompetencyoverview.do", "TOOVERVIEW","");
}
// ------------------------------------------------------------------

Competency.sortCompetencyColumn = function sortCompetencyColumn(fieldName,sec,type, pageNo)
{
    Competency.sortColumnForSection(fieldName,sec,type, pageNo, "partycompetencyoverview.do")
}

function showPCompetency()
{
	var url = "view";
 	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	sectionName = objAjax.getDivSectionId();
		if(partyTypeQualifier.indexOf(partyTypeForCompetencyNav)==-1)
			{
				alert("Competency  is only valid for Party Type of Factory.");
				return;
		
			}

	if(objAjax && objHTMLData)
    {
    	bShowMsg = true;
        // Tracker#: 21851
        // Avoid calling just loadWorkArea instead call loadWorkArea available in Main(main.js) object.
        // This shows the confirm message in Yellow instead of the regular window.confirm method.
        Main.loadWorkArea("partycompetencyoverview.do", url);
        if(objAjax.isProcessComplete())
        {
            objHTMLData.resetChangeFields();
        }
    }
}




Competency.sortColumnForSection = function sortColumnForSection(fieldName,sec,type, pageNo, url)
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    sectionName = sec;
    if(objAjax)
    {
        objAjax.setActionURL(url);
        objAjax.setActionMethod("SORT&sortColumn="+fieldName+"&sort="+type+"&pageNum="+pageNo);
        objAjax.setProcessHandler(Competency.refreshPageAfterSort);
        objAjax.sendRequest();
    }
}

Competency.refreshPageAfterSort = function refreshPageAfterSort(objAjax)
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

Competency.refreshCompetency = function refreshCompetency()
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
      	loadWorkArea("partycompetencyoverview.do", url);
	}
}

 

var deleteEntire = false;

Competency.confirmedDeleteCompetency = function confirmedDeleteCompetency()
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
		objAjax.setProcessHandler(Competency._showCompetencyWorkArea);

	 	if(objHTMLData.checkForChanges())
       	{
     		objAjax.setActionURL("partycompetencyoverview.do?method=delete");
     		objHTMLData.performSaveChanges(Competency._showCompetencyWorkArea, objAjax);
    	}
    	else
    	{
    	    if(!objHTMLData.hasUserModifiedData())
    	    {
    	        deleteEntire = true;
            }
    		objAjax.setActionURL("partycompetencyoverview.do?method=delete");
    		objAjax.sendRequest();
    	}
	}
}

Competency._showCompetencyWorkArea = function _showCompetencyWorkArea(objAjax)
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

            // If the process is failure and the Process is
            // deleting the entire Material Quote record then empty the area
            // and allow the user to Search again.
            if(!objAjax.isProcessComplete() && deleteEntire)
            {
                div.innerHTML = "";
            }
            deleteEntire = false;
            alignWorkAreaContainer();
            if(nCurScrWidth > MinimumScrWidth)
            {
               resetAllMainDivs();
            }

	        refreshNavigationGrid(objAjax);
        }
    }
    catch(e)
    {
        //alert(e.description);
    }
}



//Tracker#: 16302
// Added the Process Handlers for First Approval, Second Approval and Reject Offer processes
function PartyCompetencycomplete()
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
	   		messagingDiv(htmlErrors, "saveWorkArea()", "continueCompetency()");
	   		return;
      	}
        continueCompetency();
    }
}

function deletePartyCompetency()
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    if(objAjax)
   	{
	   	// Tracker#:12630 ISSUES ON COLOR PALETTE BLANK RECORD
		// Check for valid record to execute process.
	   	if(!isValidRecord(true))
		{
			return;
		}
        var htmlErrors = objAjax.error();
        htmlErrors.addError("confirmInfo","Do you want to delete this Competencises record?",  false);
        messagingDiv(htmlErrors,'Competency.confirmedDeleteCompetency()', 'closeMsgBox()');

    }
}

function continueCompetency()
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
       	loadWorkArea("partycompetencyoverview.do", url);
    }
}

function refreshPartyCompetency()
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
      	loadWorkArea("partycompetencyoverview.do", url);
	}
}