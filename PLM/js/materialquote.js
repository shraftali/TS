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

//Tracker#: 16026 MATERIAL SOURCING PROCESS
function showMatQuoteOverview(obj)
{
	Process.showOverview(obj, "materialquote.do", "TOOVERVIEW");
}

function sortMaterialQuoteColumn(fieldName,sec,type, pageNo)
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
	sectionName = sec;
    var objAjax = htmlAreaObj.getHTMLAjax();
    if(objAjax)
    {
        objAjax.setActionURL("materialquote.do");
        objAjax.setActionMethod("SORT&sortColumn="+fieldName+"&sort="+type+"&pageNum="+pageNo);
        objAjax.setProcessHandler(_showColorLibPage);
        objAjax.sendRequest();
    }
}

// Tracker#: 16115  EMAIL FUNCTIONALITY ON MATERIAL QUOTE SCREEN
// Check for any Unsaved changes on the screen.
// Option for the user to either continue with the Email process
// or Save the changes first
function sendEmail()
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
	   		messagingDiv(htmlErrors, "saveWorkArea()", "continueSendEmail()");
	   		return;
      	}
        continueSendEmail();
    }
}

function continueSendEmail()
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();

    if(objHTMLData!=null && !objHTMLData.hasUserModifiedData())
    {
        var htmlErrors = objAjax.error();
        objAjax.error().addError("warningInfo", "Please select one or more of the detail lines.", false);
        messagingDiv(htmlErrors);
        return;
    }
    closeMsgBox();
    if(objAjax && objHTMLData)
    {
        var selectedRows = checkForDetailSelection(objHtmlData.getChangeFields());
        if(selectedRows != null  && selectedRows != "")
        {
            // Tracker#: 16346 MATERIAL QUOTE MESSAGING ISSUE - OLDER POPUP: 'DO YOU WANT TO SAVE...' MESSAGE DISPLAYS
            // Once the Email POP up gets closed via Close Message link, the loadworkarea function checks for the
            // changed fields again, reset the changed fields to avoid this.
            objHTMLData.resetChangeFields();
            openWin('email.do?method=view&rows='+selectedRows, 645, 610)
        }

    }
}

// Send just the row numbers delimited by ","  as expected by
// SendRequest action.
function checkForDetailSelection(chgFields)
{
    var rowNos = "";

    if(chgFields != null && chgFields.length > 0)
    {
        for(var i = 0 ; i < chgFields.length ; i++)
        {
            var fieldName = chgFields[i];
            if(fieldName.startsWith(_CHK_BOX_DEFAULT_ID))
            {
                var rowNo = _getRepeateCountFromCompName(fieldName);
                rowNos+= rowNo + ",";
            }
        }

        if(rowNos.length > 0 )
        {
            rowNos = rowNos.substr(0, rowNos.length - 1);
        }
    }
    return rowNos;
}

//Tracker#: 16197 PLACE COMMITMENT FROM MATERIAL QUOTE/OFFER
function placeCommitment()
{
    
 	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	
    if(objAjax && objHTMLData)
    {
	    if(!isValidRecord(true))
		{
			return;
		}
		
		if(objHTMLData!=null && objHTMLData.isDataModified())
        {
            var htmlErrors = objAjax.error();
            htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
	   		messagingDiv(htmlErrors, "saveWorkArea()", "_mq_commitStatus(1)");
	   		return;
        }
        else
        {
        	_mq_commitStatus();
        }
    }
}

function _mq_commitStatus(reset)
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
   	var objHTMLData = htmlAreaObj.getHTMLDataObj();
   	var htmlErrors = objAjax.error();

   	if(!objHTMLData.checkForChanges())
   	{
   		htmlErrors.addError("warningInfo", "Please select one or more of the detail lines",  false);
   		messagingDiv(htmlErrors);
        return;
   	}

	if(objAjax && objHTMLData)
	{	
       	objAjax.setProcessHandler(_showSubmitWorkArea);
       	if(objHTMLData.checkForChanges())
       	{
     		objAjax.setActionURL("materialquoteoverview.do?method=placecommitment");
     		objHTMLData.performSaveChanges(_showSubmitWorkArea, objAjax);
    	}
    	else
    	{
    		objAjax.sendRequest();
    	}
	}
}

function showCommitmentInfo(htmlfldName, rowno)
{
 if(rowno)
    {
        var actMethod = "showCommitments&rowno="+ rowno;
        var htmlAreaObj = _getWorkAreaDefaultObj();
        var objAjax = htmlAreaObj.getHTMLAjax();
        if(objAjax)
        {
        	//Tracker# 18555 REGRESSION ISSUE: JAVA SCRIPT ERROR DISPLAY ON TRYING TO VIEW COMMIT VALUES ON MQ OVERVIEW SCREEN.
        	//passing the value for parameter invokeCompOnFocus.
            _startSmartTagPopup(htmlfldName, false, null, false, false);
            bShowMsg = true;
            objAjax.setActionURL("materialquoteoverview.do");
            objAjax.setActionMethod(actMethod);
            objAjax.attribute().setAttribute("htmlfldName", htmlfldName);
            // Similar Method to method available in colorlib.js, the POP Up was getting aligned to the Top
            // using the regular Smart Tag method. Ex: _showSmartTagPopup, _showSmartTagInteractivePopup
            objAjax.setProcessHandler(showCommitmentsPopup);
            objAjax.showProcessingBar(false);
            objAjax.sendRequest();
        }
    }
}
 
function showCommitmentsPopup(objAjax)
{
    if(objAjax)
    {
        //display the user message when drop downs are not loaded
        _displayProcessMessage(objAjax);
        if(!objAjax.isProcessComplete())
        {
            _closeSmartTag();
        }
        else
        {
        	//Tracker# 18555 REGRESSION ISSUE: JAVA SCRIPT ERROR DISPLAY ON TRYING TO VIEW COMMIT VALUES ON MQ OVERVIEW SCREEN.
            //Tracker# 15585- TSR-509 DRAG COLOR AND ARTWORK TO BOM
            //Setting onFocus identifier -Changed by Vijay
        	//According to the tracker 15585 changes setting the htmlfldOnFocus attribute to HTMLAjax object.
            objAjax.attribute().setAttribute("htmlfldOnFocus", "0");
           var popUpDiv = _showSmartTagPopup(objAjax);
           centerPopUp(popUpDiv);
        }
    }
}
 
// Position the divObj in center of the page.
function centerPopUp(divObj)
{
 if(divObj!=null)
 {
  var top=(screen.height/2)-(divObj.offsetHeight/2);
  var left=(screen.width/2)-(divObj.offsetWidth/2);
  divObj.style.top = top+"px";
  divObj.style.left = left+"px";

 }
}


//Tracker#: 16302
function setStatusToReview()
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
	   		messagingDiv(htmlErrors, "saveWorkArea()", "continueSetStatusReview()");
	   		return;
      	}
        continueSetStatusReview();
    }
}

function continueSetStatusReview()
{
	var url = "review";
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();

    if(objAjax && objHTMLData)
    {
        // Tracker#: 16346 MATERIAL QUOTE MESSAGING ISSUE - OLDER POPUP: 'DO YOU WANT TO SAVE...' MESSAGE DISPLAYS
        // The loadworkarea function checks for the changed fields again, reset the changed fields to avoid this.
        objHTMLData.resetChangeFields();
        bShowMsg = true;
       	loadWorkArea("materialquoteoverview.do", url);
    }
}

//Tracker#: 16302
function rejectOffers()
{

 	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();

    if(objAjax && objHTMLData)
    {
	    if(!isValidRecord(true))
		{
			return;
		}

		if(objHTMLData!=null && objHTMLData.isDataModified())
        {
            var htmlErrors = objAjax.error();
            htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
	   		messagingDiv(htmlErrors, "saveWorkArea()", "continueRejectOffers()");
	   		return;
        }
        else
        {
        	continueRejectOffers();
        }
    }
}

function continueRejectOffers()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
   	var objHTMLData = htmlAreaObj.getHTMLDataObj();

   	if(objHTMLData!=null && !objHTMLData.hasUserModifiedData())
    {
        var htmlErrors = objAjax.error();
   		htmlErrors.addError("warningInfo", "Please select one or more of the detail lines",  false);
   		messagingDiv(htmlErrors);
        return;
   	}
   	closeMsgBox();

    if(objAjax && objHTMLData)
    {
        bShowMsg = true;
        objAjax.setProcessHandler(_showSubmitWorkArea);

        if(objHTMLData.checkForChanges())
        {
        	objAjax.setActionURL("materialquoteoverview.do?method=rejectoffers");
        	objHTMLData.performSaveChanges(_showSubmitWorkArea, objAjax);
       	}
       	else
       	{
       		objAjax.sendRequest();
       	}
    }
}

//Tracker#: 16302
// Added the Process Handlers for First Approval, Second Approval and Reject Offer processes
function firstApproval()
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
	   		messagingDiv(htmlErrors, "saveWorkArea()", "continueFirstApproval()");
	   		return;
      	}
        continueFirstApproval();
    }
}

function continueFirstApproval()
{
	var url = "firstapproval";
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();

    if(objAjax && objHTMLData)
    {
        // Tracker#: 16346 MATERIAL QUOTE MESSAGING ISSUE - OLDER POPUP: 'DO YOU WANT TO SAVE...' MESSAGE DISPLAYS
        // The loadworkarea function checks for the changed fields again, reset the changed fields to avoid this.
        objHTMLData.resetChangeFields();
        bShowMsg = true;
       	loadWorkArea("materialquoteoverview.do", url);
    }
}

//Tracker#: 16302
function secondApproval()
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
	   		messagingDiv(htmlErrors, "saveWorkArea()", "continueSecondApproval()");
	   		return;
      	}
        continueSecondApproval();
    }
}

function continueSecondApproval()
{
	var url = "secondapproval";
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();


    if(objAjax && objHTMLData)
    {
        // Tracker#: 16346 MATERIAL QUOTE MESSAGING ISSUE - OLDER POPUP: 'DO YOU WANT TO SAVE...' MESSAGE DISPLAYS
        // The loadworkarea function checks for the changed fields again, reset the changed fields to avoid this.
        objHTMLData.resetChangeFields();
        bShowMsg = true;
       	loadWorkArea("materialquoteoverview.do", url);
    }
}

// -------------------------------------------------------------------------
// Tracker#: 16344 MATERIAL QUOTE: ADD 2 NEW PROCESSES: REFRESH AND DELETE
// -------------------------------------------------------------------------
function refreshMaterialQuote()
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
      	loadWorkArea("materialquoteoverview.do", url);
	}
}

var deleteEntire = false;

function deleteMaterialQuote()
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
	   		messagingDiv(htmlErrors, "saveWorkArea()", "_mquote_delete()");
	   		return;
        }
        // No changes simply Delete
        else
        {
        	_mquote_delete();
        }		
   	}
}

function _mquote_delete()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
   	var objHTMLData = htmlAreaObj.getHTMLDataObj();
   	// Do you want to delete entire record ?
   	var confirmMsg = szMsg_MaterialQuote_Delete_Confirm;

   	// Different messages if the user wants to delete the entire
   	// quote or wants to delete just the offers
   	if(objHTMLData!=null && objHTMLData.checkForChanges())
    {
        // Do you want to delete selected detail(s)?
    	confirmMsg = szMsg_MaterialQuote_Offer_Delete_Confirm;
   	}

	var htmlErrors = objAjax.error();
	htmlErrors.addError("confirmInfo", confirmMsg,  false);
	messagingDiv(htmlErrors,'deleteMaterialQuoteOverview()', 'closeMsgBox()');
}

function deleteMaterialQuoteOverview()
{
	var url = "delete_m_quote";
	var docview;
	closeMsgBox();
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objAjax.getDivSectionId();
    
	if(objAjax && objHTMLData)
	{	
		objAjax.setProcessHandler(_showMaterialQuoteWorkArea);
		
	 	if(objHTMLData.checkForChanges())
       	{
     		objAjax.setActionURL("materialquoteoverview.do?method=delete_m_quote");
     		objHTMLData.performSaveChanges(_showMaterialQuoteWorkArea, objAjax);
    	}
    	else
    	{
    	    if(!objHTMLData.hasUserModifiedData())
    	    {
    	        deleteEntire = true;
            }
    		objAjax.setActionURL("materialquoteoverview.do?method=delete_m_quote");
    		objAjax.sendRequest();
    	}
	}
}

function _showMaterialQuoteWorkArea(objAjax)
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
            // The Left Side Navigation should reflect the deleted quote.
            //Tracker #: 18366 DELETE PROCESS THROWS AN EXCEPTION AFTER NAVIGATING FROM PROJECTIONS SUMMARY SCREEN.
            //After deletion of material quote if the user navigated from summary screen and the refereshNavigator is set
			//then call the process handler _showWorkArea.  
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

// -------------------------------------------------------------------------
// Tracker#: 16344 changes ends
// -------------------------------------------------------------------------
// Tracker #: 16443 MATERIAL SOURCING- NAVIGATION BETWEEN MATERIAL LIBRARY AND MATERIAL QUOTE

function _gotoMaterialLib()
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
	   		messagingDiv(htmlErrors, "saveWorkArea()", "continueGotoMatLib()");
	   		return;
      	}
        continueGotoMatLib();
    }
}

function continueGotoMatLib()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    if(objHTMLData!=null)
    {
    	//To remove the second time check for modified fields in loadWorkArea function.
 		objHTMLData.resetChangeFields();
 	}
    var url ="materialquotenav&_nColLibRow=" + _nColLibRow ;
    url += "&keyinfo= " +getComponentKeyInfo();
    // alert("url " + url + "\n_nColLibRow:"+ _nColLibRow);
    loadWorkArea("materialoverview.do", url);
}

//Tracker #: 18038 HYPERLINK AND NAVIGATION TO MATERIAL QUOTE FROM PROJECTION SUMMARY
function _gotoProjSummary()
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
		// isDataModified checks if the data is alone modified or not
    	// Does not consider the Checked Boxes selection as changed fields
    	if(objHTMLData!=null && objHTMLData.isDataModified())
    	{
    		var htmlErrors = objAjax.error();
        	htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
        	// If user confirms to save then call saveWorkArea()
        	// else continue with the _showProjSummary()
        	messagingDiv(htmlErrors, "saveWorkArea()", "_showProjSummary()");
        	return;
      	}
      	_showProjSummary();
   	}
}

//Tracker #: 18038 HYPERLINK AND NAVIGATION TO MATERIAL QUOTE FROM PROJECTION SUMMARY
function _showProjSummary()
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
	var url = "gotoProjSummary";
    loadWorkArea("materialquoteoverview.do", url, null, _showProjectionSummary);
}

//Tracker #: 18038 HYPERLINK AND NAVIGATION TO MATERIAL QUOTE FROM PROJECTION SUMMARY
function _showProjectionSummary(objAjax)
{
    var htmlError = objAjax.error();
     // If An error has occured do not close the message popup.
     if(!htmlError.hasErrorOccured())
     {
        closeMsg();
     }
     _displayProcessMessage(objAjax);

     // Expand the Design Center as the Navigation Section
     // needs to display Material quote navigation link
     // rather than the material library link.
     // Only if there are no errors call restoreArea(1) which reloads all the
     // links related on MM Design Center otherwise do not change the
     // Navigation Menu on the Navigator and remain on the same.
     if(htmlError.getWarningMsg() == null || htmlError.getWarningMsg().length == 0
        && (htmlError.getErrorMsg() == null || htmlError.getErrorMsg().length == 0))
     {
         restoreArea(1);
     }

    _execAjaxScript(objAjax);
}

//Tracker# 19466 - Comments in Material Quote Overview screen.
function materialQuoteComment()
{
	if(!isValidRecord(true))
	{
		return;
	}
	objAjax = new htmlAjax();
    objAjax.setActionURL("threadedcomments.do");
    objAjax.setActionMethod("viewcomments");
    objAjax.setProcessHandler("materialQuoteCommentResponse");
    objAjax.parameter().add("parentViewId", 155);
    objAjax.sendRequest();
}

function materialQuoteCommentResponse()
{
	if(objAjax)
	{
		if(objAjax.isProcessComplete())
		{
			var comments = new TRADESTONE.Comments("Material Quote Comments", objAjax.getResult());
			comments.show();
		}
		objAjax = null;
	}
}
//END Tracker# 19466 - Comments in Material Quote Overview screen.

//Tracker#: 20613 ADD LINK TO MATERIAL OFFER RESPONSE SCREEN
//Function to navigate to Material Quote Offer Response screen from Material Quote screen.
function _gotoMQOfferResponce()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();

    if(objAjax)
   	{
		// Data has been changed but not saved?
		if(objHTMLData!=null && objHTMLData.isDataModified())
      	{
	   		var htmlErrors = objAjax.error();
	   		htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
	   		messagingDiv(htmlErrors, "saveWorkArea()", "continueGotoMQOffer()");
	   		return;
      	}
		continueGotoMQOffer();
    }
}

function continueGotoMQOffer()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    if(objHTMLData!=null)
    {
    	//To remove the second time check for modified fields in loadWorkArea function.
 		objHTMLData.resetChangeFields();
 	}
    var url ="navfromMQ&navFromMQ=Y&_nColLibRow=" + _nColLibRow ;
    url += "&keyinfo= " +getComponentKeyInfo();
    // alert("url " + url + "\n_nColLibRow:"+ _nColLibRow);
    loadWorkArea("materialquoteofferresponse.do", url);
}

//Tracker#:26533 ADD NEW PROCESS TO COPY MATERIAL QUOTE RECORD
function copyMaterialQuote()
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	var url ="copyMaterialQuote";
	if(!isValidRecord(true))
    {
        return;
    }
	
    if(objAjax && objHTMLData)
    {	
    	//objHTMLData.resetChangeFields();
    	bShowMsg=true;
    	objAjax.setActionMethod(url);
        loadWorkArea("materialquoteoverview.do", url);
    	if(objAjax.isProcessComplete())
		{
			objHTMLData.resetChangeFields();
		}
    }
}

//Tracker#:26534 ADD NEWPROCESS TO COPY MATERIAL OFFER/OFFERS RECORDS
function copyMaterialOffers()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
   	var objHTMLData = htmlAreaObj.getHTMLDataObj();
   	var method ="copyMaterialOffers";
   	if(objHTMLData!=null && !objHTMLData.hasUserModifiedData())
    {
        var htmlErrors = objAjax.error();
   		htmlErrors.addError("warningInfo", "Please select one or more Offer row to copy",  false);
   		messagingDiv(htmlErrors);
        return;
   	}
   	
  	var chgFlds = objHTMLData.getChangeFields();
	if((chgFlds.length!="undefined") && chgFlds.length>0)
	{
	    var cnt = chgFlds.length;
	    for (num = 0; num < cnt; num++)
	    {
	       var obj = getElemnt(chgFlds[num]);
	        if($(obj).attr('keyinfo')==null)
	        	{
	        	var htmlErrors = objAjax.error();
	       		htmlErrors.addError("warningInfo", szMsg_Invalid_Dtl_Rec,  false);
	       		messagingDiv(htmlErrors);
	            return false;
	        	}
	    }
	 } 
   	
   	closeMsgBox();
    if(objAjax && objHTMLData)
    {
        bShowMsg = true;
        if(objHTMLData.checkForChanges())
        {
        	
        	objAjax.attribute().setAttribute("chgFlds", chgFlds);
        	objHTMLData._mHasUserModifiedData=true;
        	objAjax.setActionMethod(method);
        	objAjax.setActionURL("materialquoteoverview.do");
        	objAjax._setChangeFlagsOnLoad(true);
            objAjax.setProcessHandler(mqShowWorkarea);
            objHTMLData.performSaveChanges(mqShowWorkarea, objAjax);
       	}
    }
    
function mqShowWorkarea(objAjax)
    {
    	_showWorkArea(objAjax);
    	
    	var chgFlds = objAjax.attribute().getAttribute("chgFlds");
    	var htmlAreaObj = _getWorkAreaDefaultObj();
       	var objHTMLData = htmlAreaObj.getHTMLDataObj();
    	
    	if((chgFlds.length!="undefined") && chgFlds.length>0)
    	{
    	    var cnt = chgFlds.length;
    	    for (num = 0; num < cnt; num++)
    	    {
    	       var obj = getElemnt(chgFlds[num]);
    	       while(obj && obj.tagName != "TR"){
    	    	   obj = obj.parentElement;    	    	  
    	       };
    	       
    	       if(obj)
    	       {   
    	    	  obj = obj.getElementsByTagName('INPUT');    	    	  
    	    	  if(obj && obj.length){
    	    		  for(i=0; i<obj.length; i++){    	    			  
    	    			  it = obj.item(i);    	    			
    	    			  if(it && it.type && it.type=='text' && it.onchange){    	    				  
    	    				  it.onchange();
    	    				  break;
    	    			  }
    	    		  }
    	    			  
    	    	  }
    	       }
    	    }
    	}
    }
}