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

function declineOfferResponse()
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
		if(objHTMLData!=null && objHTMLData.isDataModified()==true)
      	{
	   		var htmlErrors = objAjax.error();
	   		htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
	   		messagingDiv(htmlErrors, "saveWorkArea()", "continueDeclineOfferResponse()");
	   		return;
      	}
        continueDeclineOfferResponse();
    }
}

function continueDeclineOfferResponse()
{
	var url = "declineOffer";
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();


    if(objAjax && objHTMLData)
    {
        bShowMsg = true;
       	loadWorkArea("materialquoteofferresponse.do", url);
    }
}
//Tracker#16248
//ADD NEW PROCESS SUBMIT RESPONSE TO MATERIAL OFFER RESPONSE SCREEN
function submitOfferResponse()
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
		if(objHTMLData!=null && objHTMLData.isDataModified()==true)
      	{
	   		var htmlErrors = objAjax.error();
	   		htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
	   		messagingDiv(htmlErrors, "saveWorkArea()", "continueSubmitOfferResponse()");
	   		return;
      	}
        continueSubmitOfferResponse();
    }
}

function continueSubmitOfferResponse()
{
	var url = "submit_offer";
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();


    if(objAjax && objHTMLData)
    {
        bShowMsg = true;
       	loadWorkArea("materialquoteofferresponse.do", url);
    }
}

// Tracker#: 16345 MATERIAL OFFER RESPONSE: ADD 2 NEW PROCESSES: REFRESH AND DELETE
function refreshOffer()
{
    if(!isValidRecord(true))
    {
        return;
    }

	var url = "db_refresh";
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objAjax.getDivSectionId();

	if(objAjax && objHTMLData)
	{
		loadWorkArea("materialquoteofferresponse.do", url);
	}
}

//Tracker #: 17263 STATUS FIELD ISSUE ON MATERIAL OFFER RESPONSE SCREEN
function showOfferCommitmentInfo(htmlfldName, rowno)
{
 	if(rowno)
    {
        var actMethod = "showOfferCommitment&rowno="+ rowno;
        var htmlAreaObj = _getWorkAreaDefaultObj();
        var objAjax = htmlAreaObj.getHTMLAjax();
        if(objAjax)
        {
        	//Tracker# 18555 REGRESSION ISSUE: JAVA SCRIPT ERROR DISPLAY ON TRYING TO VIEW COMMIT VALUES ON MQ OVERVIEW SCREEN.
        	//passing the value for parameter invokeCompOnFocus.
            _startSmartTagPopup(htmlfldName, false, null, false, false);
            bShowMsg = true;
            objAjax.setActionURL("materialquoteofferresponse.do");
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
//Tracker#: 20613 ADD LINK TO MATERIAL OFFER RESPONSE SCREEN
//Function to navigate back to Material Quote Overview.
function _navtoMQuote()
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
	   		messagingDiv(htmlErrors, "saveWorkArea()", "continueGotoMQuote()");
	   		return;
      	}
		continueGotoMQuote();
    }
}

function continueGotoMQuote()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    if(objHTMLData!=null)
    {
    	//To remove the second time check for modified fields in loadWorkArea function.
 		objHTMLData.resetChangeFields();
 	}
    var url ="navfromMQOffer" ;
    
    loadWorkArea("materialquoteoverview.do", url);
}

//Tracker#:26535 ADD NEWPROCESS TO COPY MATERIAL OFFER RESPONSE RECORD
function copyMaterialOfferResponse()
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	var url ="copyMatOfferResponse";
	if(!isValidRecord(true))
    {
        return;
    }
	
    if(objAjax && objHTMLData)
    {	
    	bShowMsg=true;
    	objAjax.setActionMethod(url);
        loadWorkArea("materialquoteofferresponse.do", url);
    }
}