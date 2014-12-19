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

//Tracker#: 16597 MATERIAL QUOTE OVERVIEW - ATTACHMENT ASSOCIATION

function refreshAttachments()
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
      	loadWorkArea("plmattachments.do", url);
	}
}

function deleteAttachments()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    var checkModifiedData = _getWorkAreaDefaultObj().checkForNavigation();
    if(objAjax && objHTMLData)
	{
		// Check for valid record to execute process.
	    if(!isValidRecord(true))
		{
			return;
		}
	    var htmlErrors = objAjax.error();
	    if(objHTMLData!=null && objHTMLData._mHasUserModifiedData == true && objHTMLData.isDataModified() == true)
	    {
	    	if(checkModifiedData!=null && checkModifiedData.hasUserModifiedData() == true)
			{
			   //perform save operation if user clicks 'OK'
	        	checkModifiedData.performSaveChanges(_defaultWorkAreaSave);       	     	
			}
			else
			{
			    //It will reset the changed fields and close the meossage box.
			    cancelProcess();
	   		}
	   	}
	   	else
	   	{
	   		//To chech wheather the listing screen or pagination screen.
	   		var isRepeatingScreen = document.getElementById("AttachScreenType");
	   		
	   		if(isRepeatingScreen != null && isRepeatingScreen.value == 'true' && objHTMLData.hasUserModifiedData()==false)
	   		{
	   			objAjax.error().addError("warningInfo", "Please select one or more attachments.", false);
                messagingDiv(htmlErrors);
                return;
	   		}
	   		htmlErrors.addError("confirmInfo","Do you want to delete Attachment(s)?",  'closeMsgBox()');
	   		messagingDiv(htmlErrors,'_deletePLMAttachment()', 'closeMsgBox()');
	    }
	}
}

function _deletePLMAttachment()
{
	var url = "delete";
	closeMsgBox();
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objAjax.getDivSectionId();
    var isRepeatingScreen = document.getElementById("AttachScreenType");
    if(objAjax && objHTMLData)
	{
		objAjax.setActionURL("plmattachments.do");
 	    objAjax.setActionMethod(url);
        objAjax.setProcessHandler(_showWorkArea);
        //Chech whether the listing screen or pagination screen.
        if(isRepeatingScreen != null && isRepeatingScreen.value == 'false')
        {
        	objAjax.sendRequest();
        }
        else
        {
        	objHTMLData.performSaveChanges(_showSaveContainerWorkArea, objAjax);
        }
        if(objAjax.isProcessComplete())
        {
            objHTMLData.resetChangeFields();
        }
	}
}

//It will be called when clicking 'New' process in Attachment Association tab screen.
function newAttachementAssoc()
{
	if(!isValidRecord(true))
	{
		return;
	}
	Process.execute("new", "plmattachments.do");
}

//Tracker#: 16597 MATERIAL QUOTE OVERVIEW - ATTACHMENT ASSOCIATION
function showPLMAttachments(parentDocViewID,levelId)
{
	if (parentDocViewID == '155') {
		if (!isValidMaterialQuote(true)) {
			return;
		}
		} 
	else if (parentDocViewID == '160') {
		if (!isValidMaterialOffResp(true)) {
			return;
		}
		} 
	 Process.execute("view&parentDocViewID="+parentDocViewID+"&levelId="+levelId,"plmattachments.do");
}

function showPLMAttachments_Details(parentDocViewID,levelId,obj)
{
   if(parentDocViewID==155)
    {
    	var url = "view";
   		var htmlAreaObj = _getWorkAreaDefaultObj();
		var objAjax = htmlAreaObj.getHTMLAjax();
   	 	var changeFieldRowno=_getActualRowIndexFromObjectId(obj.id);
		url = url + "&parentDocViewID="+parentDocViewID+"&levelId="+levelId+"&rowno="+changeFieldRowno;
		loadWorkArea("plmattachments.do", url);
    }  
}

function _getActualRowIndexFromObjectId(strFldName)
{
    var retVal = null;

    if(strFldName)
    {
        if(strFldName!=null && strFldName.startsWith(_CHK_BOX_DEFAULT_ID))
        {
           strFldName = strFldName.replace(_CHK_BOX_DEFAULT_ID,"");
        }
        var str = strFldName.split(_FIELDS_SEPERATOR);

        if(str && str.length>5)
        {
           retVal = str[4];
        }
    }
    return retVal;
}


