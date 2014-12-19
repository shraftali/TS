/*************************************/
/*  Copyright  (C)  2002 - 2010      */
/*           by                      */
/*  TradeStone Software, Inc.        */
/*  Gloucester, MA. 01930            */
/*  All Rights Reserved              */
/*  Printed in U.S.A.                */
/*  Confidential, Unpublished        */
/*  Property of                      */
/*  TradeStone Software, Inc.        */
/*************************************/

 /*
  *Javascript functions are related to Techspec Event.
  */

//It will be called when click 'delete' process in Event tab on techspec screen
//Tracker#:20812 Modified the function add the save confirm message
function deleteTechspecEvent()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	 
	if(!isValidRecord(true))
	{
		return;
	}
	
	if(objAjax && objHTMLData)
    {    	
    	if(objHTMLData!=null && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
        {
            var htmlErrors = objAjax.error();
            htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
            messagingDiv(htmlErrors, "saveWorkArea()", "continueDeletion()");
        }
        else
        {
            continueDeletion();
        }
    }	
}

//Tracker#:20812 Added new method to contiue create fiteval after save confirm message
function continueDeletion()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	
	if(objAjax && objHTMLData)
	{
	   
	    var htmlErrors = objAjax.error();	    
	    //delete Event detail
	    if(objHTMLData!=null && objHTMLData._mHasUserModifiedData == true)	     
		{
			htmlErrors.addError("confirmInfo", szMsg_EventDetails_Delete_Confirm,  false);
   			messagingDiv(htmlErrors, 'dltTechspecEventDetail()', 'cancelProcess()');
		}		
		else //delete Header
		{				
		    htmlErrors.addError("confirmInfo", szMsg_Events_Delete_Confirm,  false);
   			messagingDiv(htmlErrors, 'dltTechspecEvent()', 'cancelProcess()');		    
   		}
   	}
}	

//Function dltTechspecEvent() for deleting event record
function dltTechspecEvent()
{
	var url = "delete";
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
	    objAjax.setActionURL("techspecevents.do");
	    objAjax.setActionMethod(url);
	    objAjax.setProcessHandler(_showWorkArea);
	    objAjax.sendRequest();
	    if(objAjax.isProcessComplete())
        {
            objHTMLData.resetChangeFields();
        }
	}
}
	
//Function dltTechspecEventDetail for deleting event detail row.
function dltTechspecEventDetail()
{
	var url = "delete";
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();

	sectionName = objAjax.getDivSectionId();
	//alert("sectionName  " + sectionName);
	if(objAjax && objHTMLData)
	{
	    bShowMsg = true;
	    objAjax.setActionURL("techspecevents.do");
	    objAjax.setActionMethod(url);
	    objAjax.setProcessHandler(_showWorkArea);
	    	
	    objHTMLData.performSaveChanges(_showSaveContainerWorkArea, objAjax);
        if(objAjax.isProcessComplete())
        {
             objHTMLData.resetChangeFields();
        }
	}
}

//Function schedulePlan
//It will be called when clicking 'Schedule Plan' process in event tab on techspec screen.
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
	    Main.loadWorkArea("techspecevents.do", url);	   
	}
}

//Function revisePlan
//It will be called when clicking 'Revised Plan' process in event tab on techspec screen.
function revisePlan()
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
	    Main.loadWorkArea("techspecevents.do", url);	    
	}
}

//Function actualPlan
//It will be called when clicking 'Actual Plan' process in event tab on techspec screen.
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
	    Main.loadWorkArea("techspecevents.do", url);	    
	}
}

//function newTechspecEvent()
//It will be called when clicking 'New' process in event tab on techspec screen.
function newTechspecEvent()
{
	var url = "new";
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
	    Main.loadWorkArea("techspecevents.do", url);
	}
}

//Function pageNavignByDropDown
//This method for pagination purpose.
function pageNavignByDropDown()
{
    var current_page = getElemnt("current_page");
    var nextRecordKey = current_page.value;
    pageNavign(nextRecordKey);
}

//Function pageNavign
function pageNavign(assocID)
{
	var url = "pagnav";
	url += "&associd=" + assocID;
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	
	// Check for valid record to show the screen(tab).
	if(!isValidTecSpec(true))
    {
        return;
    }

	if(objAjax && objHTMLData)
	{
	    bShowMsg = true;
	    Main.loadWorkArea("techspecevents.do", url);
	}
}
