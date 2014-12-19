/** ********************************** */
/* Copyright (C) 2002 - 2012 */
/* by */
/* TradeStone Software, Inc. */
/* Gloucester, MA. 01930 */
/* All Rights Reserved */
/* Printed in U.S.A. */
/* Confidential, Unpublished */
/* Property of */
/* TradeStone Software, Inc. */
/** ********************************** */

//Tracker#: 21350 ADD PARTY RELATION TIERED TAB TO PARTY SCREEN UNDER VENDOR MANAGEMENT.

function showPartyTieredRelation()
{
	var url = "view";
 	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	sectionName = objAjax.getDivSectionId();
    if(objAjax && objHTMLData)
    {
    	bShowMsg = true;
        // Tracker#: 21851
        // Avoid calling just loadWorkArea instead call loadWorkArea available in Main(main.js) object.
        // This shows the confirm message in Yellow instead of the regular window.confirm method.
        Main.loadWorkArea("partyrelationtiered.do", url);
        if(objAjax.isProcessComplete())
        {
            objHTMLData.resetChangeFields();
        }
    }
}

function copyPartyTiered()
{
 	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	sectionName = objAjax.getDivSectionId();
	
	if(objAjax)
   	{
		// Data has been changed but not saved?
		if(objHTMLData!=null && objHTMLData.isDataModified())
      	{
	   		var htmlErrors = objAjax.error();
	   		htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
	   		messagingDiv(htmlErrors, "saveWorkArea()", "continueCopyRecord()");
	   		return;
      	}
		continueCopyRecord();
    }

}

function continueCopyRecord()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    var htmlErrors = objAjax.error();

    if(objHTMLData!=null && !objHTMLData.hasUserModifiedData())
    {
        objAjax.error().addError("warningInfo", "Please select one record.", false);
        messagingDiv(htmlErrors);
        return;
    }
    closeMsgBox();
    if(objAjax && objHTMLData)
    {
        var selectedRows = checkForRowSelection(objHtmlData.getChangeFields());
        if(selectedRows > 1)
        {
        	objAjax.error().addError("warningInfo", "Multiple Records selected, please only select one record to copy from and try again", false);
            messagingDiv(htmlErrors);
            return;
            //objHTMLData.resetChangeFields();
        }
        
        objAjax.setActionURL("partyrelationtiered.do");
 	    objAjax.setActionMethod("copy");
        objAjax.setProcessHandler(_showSubmitWorkArea);
        
        if(objHTMLData.checkForChanges())
       	{
     		objHTMLData.performSaveChanges(_showSubmitWorkArea, objAjax);
    	}
    	else
    	{
    		objAjax.sendRequest();
    	}
        
        if(objAjax.isProcessComplete())
        {
            objHTMLData.resetChangeFields();
        }
    }
}

function checkForRowSelection(chgFields)
{
    var rowNos = 0;

    if(chgFields != null && chgFields.length > 0)
    {
        for(var i = 0 ; i < chgFields.length ; i++)
        {
            var fieldName = chgFields[i];
            if(fieldName.startsWith(_CHK_BOX_DEFAULT_ID))
            {
                var rowNo = _getRepeateCountFromCompName(fieldName);
                rowNos++;
            }
        }
    }
    return rowNos;
}


function creatPartyTieredEvents()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	sectionName = objAjax.getDivSectionId();
	
	if(objAjax)
   	{
		// Data has been changed but not saved?
		if(objHTMLData!=null && objHTMLData.isDataModified())
      	{
	   		var htmlErrors = objAjax.error();
	   		htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
	   		messagingDiv(htmlErrors, "saveWorkArea()", "continueCreateEvents()");
	   		return;
      	}
		continueCreateEvents();
    }
	
}

function continueCreateEvents()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    var htmlErrors = objAjax.error();

    if(objHTMLData!=null && !objHTMLData.hasUserModifiedData())
    {
        objAjax.error().addError("warningInfo", "Please select one or more record.", false);
        messagingDiv(htmlErrors);
        return;
    }
    closeMsgBox();
    if(objAjax && objHTMLData)
    {
		var selectedRows = checkForRowSelection(objHtmlData.getChangeFields());
        if (selectedRows != null && selectedRows != 0) 
		{
			objAjax.setActionURL("partyrelationtiered.do?method=match&assoc_id=10600");
			objAjax.setProcessHandler(_showSubmitWorkArea);
			if (objHTMLData.checkForChanges()) {
				objHTMLData.performSaveChanges(_showSubmitWorkArea, objAjax);
			}
			else 
			{
				objAjax.sendRequest();
			}
			
			if (objAjax.isProcessComplete()) 
			{
				objHTMLData.resetChangeFields();
			}
		}
    }
}
