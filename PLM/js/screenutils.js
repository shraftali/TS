/*************************************/
/*  Copyright  (C)  2002 - 2012      */
/*           by                      */
/*  TradeStone Software, Inc.        */
/*  Gloucester, MA. 01930            */
/*  All Rights Reserved              */
/*  Printed in U.S.A.                */
/*  Confidential, Unpublished        */
/*  Property of                      */
/*  TradeStone Software, Inc.        */
/*************************************/

/*************************************/
/** 	 GENERIC JS FUNCTIONS	    **/
/*************************************/

/**
 * Call this function and provide corresponding action class url to forward
 * the user to the overview of the clicked record.
 *
 * e.g. showOverview("materialpaletteoverview.do")
 */


var jsutil = {	
	/**
	 * Tracker#:23136 SMART TAG ALIGNMENT ISSUE FOR COMPONENTS CLOSE TO SCREEN EDGE
	 * position the divObj, in screen when it goes off the screen either right or bottom
	 * 
	 * divObj & htmlObj are jquery object
	 */
	positionWithInScreen: function(divObj, htmlObj, x, y)
	{
		var fieldOffset = htmlObj.offset();
		var offScreenLeft = this.amountOffScreen('right', fieldOffset, htmlObj, divObj, x);
    	var offScreenBottom = this.amountOffScreen('bottom', fieldOffset, htmlObj, divObj, y);
    	
    	x = x - offScreenLeft;	
    	y = y - offScreenBottom; 
    	
    	divObj.offset({ top: y, left: x});    	
	},		
	
	amountOffScreen: function (side, fieldOffset, $queryField, noteDivObj, newPosition)
	 {
		 var overFlow,
		 	 windowDimension,
		 	 notesDimension,
		 	 $noteDiv = $(noteDivObj);
		 
		 switch (side)
		 {
		 	case 'right' :
		 		windowDimension = document.body.clientWidth;
		 		notesDimension = $noteDiv.width();
		 		break;
		 		
		 	case 'bottom' :
		 		windowDimension = document.body.clientHeight;
		 		notesDimension = $noteDiv.height();
		 		break;
		 }
		 
		overFlow = newPosition + notesDimension - windowDimension;
		overFlow = (overFlow > 0) ? overFlow : 0;
		 
		return overFlow;
	 }
};


function showOverview(url)
{
	var method = "TOOVERVIEW&_nColLibRow=" + _nColLibRow;
	method += "&keyinfo= " + getComponentKeyInfo();
	loadWorkArea(url, method);
}

/**
 * Function used as process handler with provided ajax object.
 * Displays any process messages and reloads the section and
 * navigation grid.
 */
function showDocumentPage(objAjax)
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
    	_reloadArea(objAjax, sectionName);
        bShowMsg= false;

        refreshNavigationGrid(objAjax);

        showChangeTrackingTabCount();
    }
}

/**
 * Call this function to show the different detail views.  Previous
 * versions hardcoded the action class url but were otherwise the
 * same, so there would be showArtworkView, showColorView, etc.
 */
function showDetailView(view, pageNo, sec, url)
{
    sectionName = sec;
    var method = "HANDLEVIEW&pageNum="+pageNo+"&view="+view;

	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();

    if(objAjax && objHTMLData)
    {
       	loadWorkArea(url, method);
    }
}

/**
 * Function for applying drag/drop panel items to details.  The function is
 * generaic so that you can pass url and method, but you do need to add
 * condition check for your url being passed, so you can validate that the
 * corresponding array of objects is not empty.  Also add condition for
 * loading the work area.
 *
 * e.g. applyDragDropPanel("materialpaletteoverview.do", "mpapplydragdrop")
 */
function applyDragDropPanel(url, method)
{
 	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	sectionName = objAjax.getDivSectionId();

	//Add condition for your action class url to check to see that all
	//arrays for items pertaining to your screen are not empty.
	if(url == "materialpaletteoverview.do")
	{
		if(mtrArray.length < 1)
		{
			return false;
		}
	}

    if(objAjax && objHTMLData)
    {
        bShowMsg = true;

        //Add condition for your action class url to add correct request params
        if(url == "materialpaletteoverview.do")
        {
        	var materials=getComps(mtrArray);
            //Tracker#18331 REGRESSION:UNABLE TO DRAG & DROP ARTWORKS THAT HAVE '&' IN ARTWORK COMBO NAME
		    //Using Ajax call instead of loadWorkArea function and passing the parameter separately
        	if(objAjax)
    		{
        		objAjax.setActionURL(url);
        		objAjax.setActionMethod(method);
        		objAjax.parameter().add("materials", materials);
        		objAjax.parameter().add("atnbtn", actionId);
        		objAjax.parameter().add("delimiter", _grdCompSep);
        		objAjax.setProcessHandler(_showWorkArea);
        		objAjax.sendRequest();
        	}
        }
    }
    cancelSetting();
}

/**
 * Checks to see if the user has modified any input fields.  This is
 * generally used on pages where checkboxes are used with menu processes.
 * Can be called in condition block, and if no changes are made this
 * method displays a generic warning message telling the user to select
 * a row, and returns false to the calling block.  If the user has modified
 * a field, true is returned and the condition block can execute.
 */
function checkIsRecordSelected(objHTMLData, objAjax)
{
    // Tracker#: 21480
    //(Removed && objHTMLData.hasUserModifiedData()==false)
    // Was causing issue when the Check Boxes was getting marked because of field modifications
    // instead check for the Check boxes alone getting marked.
    if(objHTMLData !=null && !isDetailSelected(objHTMLData.getChangeFields()))
    {
   		var htmlErrors = objAjax.error();
   		objAjax.error().addError("warningInfo", szMsg_Sel_Detail_Record, false);
   		messagingDiv(htmlErrors);
   		return false;
   	}
	else
	{
		return true;
	}
}

/**
 * Function for executing various document processes.
 *
 * @param url - Provide the action class url
 * @param method - e.g. approvepalette, activeinactive, addmaterial
 * @param isAdvSearchScreen - boolean for whether this is being added in security for
 * 							  the Advanced Search screen
 * @param overviewScrAndDtlReq - indicates if the process is on an overview screen and
 * 								 requires detail records to be selected.
 *
 * //from advanced search screen
 * executeDocumentProcess("materialpalette.do", "approvepalette", true, false)
 *
 * //from overview screen, and to delete colors detail records must be selected
 * executeDocumentProcess("colorpaletteoverview.do", "deletecolor", false, true)
 */
function executeDocumentProcess(url, method, isAdvSearchScreen, overviewScrAndDtlReq)
{
    closeMsgBox();
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	sectionName = objAjax.getDivSectionId();

    if(objAjax && objHTMLData)
    {
    	bShowMsg = true;
    	if(isAdvSearchScreen)
    	{
            //Check if a record is selected --processes on AdvSearchScreen
    		//require records be selected to apply processes to them...
        	if(checkIsRecordSelected(objHTMLData, objAjax))
        	{
		   	 	objAjax.setActionURL(url);
		   	 	objAjax.setActionMethod(method);
		   	 	objAjax.setProcessHandler(showDocumentPage);
		        objHTMLData.performSaveChanges(showDocumentPage, objAjax);

		        if(objAjax.isProcessComplete())
		        {
		            objHTMLData.resetChangeFields();
		        }
        	}
    	}
    	else
    	{
    		if(!isValidRecord(true))
    		{
    			return;
    		}

            /**
    		 * if process is to be applied to overview detail records check if any are selected or not.
    		 *
    		 * if process is for detail and method is db_refresh, let ELSE handle exec as loadWorkArea
    		 * constructs the layout on refresh correctly.
    		 */
    		if(overviewScrAndDtlReq && method != "db_refresh")
    		{
                // Tracker#: 21480
                // Handle Save changes feature....
                if(objHTMLData!=null && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
                {
                    var htmlErrors = objAjax.error();
   		            htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
                    var cfmFunc = "saveWorkArea()";
                    var cancelFunc = "continueDocumentProcess('" + url + "','" + method + "')";
                    messagingDiv(htmlErrors, cfmFunc, cancelFunc);
                    return;
                }
                else
                {
                    continueDocumentProcess(url, method);
                    return;
                }
    		}
    		//process is for document as a whole and not detail records
    		else
    		{
	    		//if the method deletes a record, set processhandler to refresh the nav grid.
		   		if(method.startsWith("delete"))
		   		{
                    // Tracker#: 21851
                    // Display yellow confirm msg instead of the window.confirm prompt
                    Main.loadWorkArea(url, method, "", refreshNavigationGridOnDelete);
                    return;
                }
		   		//else for other methods (processes) no need to refresh nav grid.
		   		else
		   		{
                    // Tracker#: 21851
                    // Display yellow confirm msg instead of the window.confirm prompt
                    Main.loadWorkArea(url, method);
                    return;
                }
    		}
	        if(objAjax.isProcessComplete())
	        {
	            objHTMLData.resetChangeFields();
	        }
    	}
    }
}

/**
    Check whether a row has been selected or not and then proceed making the ajax call.
*/
function continueDocumentProcess(url, method)
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	sectionName = objAjax.getDivSectionId();
    bShowMsg = true;

    if(objHTMLData!=null && checkIsRecordSelected(objHTMLData, objAjax))
    {
        submitDocument(url, method);
    }

}

function submitDocument(url, method)
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();

    if(objHTMLData !=null && objAjax != null)
    {
        objAjax.setActionURL(url);
        objAjax.setActionMethod(method);
        objAjax.setDivSectionId(htmlAreaObj.getDivSaveContainerName());
        // Setting the Process handler as _showWorkArea instead of
        // showDocumentPage as the entire HTML was getting loaded
        // inside divworkarea instead of repainting divworkarea.
        // objAjax.setProcessHandler(_showWorkArea);
        objAjax.setProcessHandler(showWorkAreaRefreshNavigation);
        objHTMLData.performSaveChanges(showDocumentPage, objAjax);
    }

}

/**
 * There are processes which you want the user to confirm their intention
 * prior to execution e.g. deleting records.  Call this funtion with the
 * corresponding parameters to conditionally execute a process based on
 * the response from the user.
 *
 * This function calls the executeDocumentProcess depending on input from
 * the user.  This function uses the same parameters, but also includes
 * confirmMsg which is a string to present to the user in the confirm message
 * and cancelMethod which is the method to execute instead of the second param
 * in the case that the user decides to cancel executiong (e.g. refresh_db).

 * If Repeating Section exists then need to distinguish between
 * modifications on the Screen or just marking the checkbox(s) for
 * deletion. Modified to handle the Saving part.
 */
function confirmExecuteDocumentProcess(url, method, isAdvSearchScreen, overviewScrAndDtlReq, confirmMsg, cancelMethod)
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();

	if(objAjax)
   	{
		if(isAdvSearchScreen)
		{
			if(!checkIsRecordSelected(objHTMLData, objAjax))
			{
				return;
			}
			// Tracker#: 22732
			// If the delete is happening on the Search List Screen, run the same code as before.
            var htmlErrors = objAjax.error();
            htmlErrors.addError("confirmInfo", confirmMsg,  false);
            
            var cfmFunc = "\"executeDocumentProcess(\'"+url+"\', \'"+method+"\', "+isAdvSearchScreen+", "+overviewScrAndDtlReq+")\"";
            var cancelFunc = "\"executeDocumentProcess(\'"+url+"\', \'"+cancelMethod+"\', "+isAdvSearchScreen+", "+overviewScrAndDtlReq+")\"";
            messagingDiv(htmlErrors, cfmFunc, cancelFunc);
		}
        else
        {
            //Check for valid record to execute process if not AdvSearchScreen
	   		if(!isValidRecord(true))
	   		{
	   			return;
	   		}

            // Tracker#: 21480
            // Save changes handled only for Repeating Section on overview screen and not
            // on Search List....
            // Check if the user has done changes also instead of just marking the
            // Rows for which the process needs to be run.
            if(objHTMLData!=null && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
            {
                var htmlErrors = objAjax.error();
                htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
                var cfmFunc = "saveWorkArea()";
                // If the user chooses to continue skiping the Save, then continue
                // running the existing process.
                //var cancelFunc = "continueConfirmDocumentProcess('" + url + "','" + method + "')";
                 var cancelFunc = "\"continueConfirmDocumentProcess(\'" + url + "\',\'" + method
                                            + "\'," +  isAdvSearchScreen
                                            + "," + false
                                            + ",\'" + confirmMsg
                                            + "\',\'" + cancelMethod +"\')\"";
                messagingDiv(htmlErrors, cfmFunc, cancelFunc);
                return;
            }

            // If Detail selection required then check if the any Detailed row
            // has been selected or not.....
            if(overviewScrAndDtlReq)
            {
                continueConfirmDocumentProcess(url, method, isAdvSearchScreen, overviewScrAndDtlReq, confirmMsg,
                                        cancelMethod);
            }
            else
            {
                var htmlErrors = objAjax.error();
                htmlErrors.addError("confirmInfo", confirmMsg,  false);
                var cfmFunc = "\"executeDocumentProcess(\'"+url+"\', \'"+method+"\', "+isAdvSearchScreen+", "+overviewScrAndDtlReq+")\"";
                var cancelFunc = "cancelProcess()";
                if(cancelMethod != null && cancelMethod != '')
                {
                    cancelFunc = "\"executeDocumentProcess(\'"+url+"\', \'"+cancelMethod+"\', "+isAdvSearchScreen+", "+overviewScrAndDtlReq+")\"";
                }
                messagingDiv(htmlErrors, cfmFunc, cancelFunc);
            }

        }
   	}
}

/**
 * Handles the 3 cases of delete
   1) Only main document(whole record) getting deleted
   2) Main document and Detail delete
   3) Only repeating rows delete.

   methodparams: Collection/Hashmp with key value pairs
   Handles: url - URL ex: plmparty.do
            method - Action Method - delete
            screenType - 1 - Represents Only Main Document(whole record) delete
                         2 - Represents whole and detail delete.
                         3 - Represents only repeating records delete. Ex: ChargeBack associations
            isAdvSearchScreen - true - Process on Advanced Search Screen
                                false - Overview screen
            confirmWholeDeleteMsg - User Confirmation Message for deleting the whole document, goes
                                    with screenType - 1 & 2
            confirmDetailDeleteMsg - User Confirmation Message for deleting the detail document goes
                                    with screenType - 2
            confirmRepeatingAssocDeleteMsg - User Confirmation Message for deleting the repeating document(s) goes
                                    with screenType - 3

    Typical insert script for SMU_RES_SHOW_ATTR table would be
            screenType : 1
                confirmDeleteDocumentProcess({url:"plmevents.do", method:"delete", screenType:1,
                    confirmWholeDeleteMsg: szMsg_Events_Delete_Confirm})
            screenType : 2
                confirmDeleteDocumentProcess({url:"plmevents.do", method:"delete", screenType:2,
                    confirmWholeDeleteMsg: szMsg_Events_Delete_Confirm,
                    confirmDetailDeleteMsg: szMsg_EventDetails_Delete_Confirm})
            screenType : 3
                confirmDeleteDocumentProcess({url:"plmattachments.do", method:"delete", screenType:3,
                                    confirmRepeatingAssocDeleteMsg: szMsg_Attachment_sel_Delete_Confirm})
*/
function confirmDeleteDocumentProcess(methodParams)
{
    var url = methodParams["url"];
    var method = methodParams["method"];
    var screenType = methodParams["screenType"];

    // Check whether required parameters have been provided in the security property entry for MN_URL .....
    if(url == '' || (typeof(url) == 'undefined') || method == '' || (typeof(method) == 'undefined')
            || methodParams["screenType"] == '' || (typeof(screenType) == 'undefined') )
    {
        return;
    }

    var isAdvSearchScreen = (typeof(methodParams["isAdvSearchScreen"]) == 'undefined' ? false : methodParams["isAdvSearchScreen"]);
    var confirmWholeDeleteMsg = (typeof(methodParams["confirmWholeDeleteMsg"]) == 'undefined' ? "Do you want to delete entire record?"
                    : methodParams["confirmWholeDeleteMsg"]);
    var confirmDetailDeleteMsg = (typeof(methodParams["confirmDetailDeleteMsg"]) == 'undefined' ? "Do you want to delete selected detail(s)?"
                    : methodParams["confirmDetailDeleteMsg"]);
    var confirmRepeatAssocMsg = (typeof(methodParams["confirmRepeatingAssocDeleteMsg"]) == 'undefined' ? "Do you want to delete selected document(s)?"
                    : methodParams["confirmRepeatingAssocDeleteMsg"]);
    var cancelMethod = (typeof(methodParams["cancelMethod"]) == 'undefined' ? "" : methodParams["cancelMethod"]);

    // Handle only Whole document delete, the screen does not have a feature where the user can
    // delete both whole document and details belonging to the document
    if(screenType == 1)
    {
        confirmExecuteDocumentProcess(url, method, isAdvSearchScreen, false, confirmWholeDeleteMsg, cancelMethod);
        return;
    }

    // Continue for deleting either whole document or the selected detail(s).
    // The code is repeated but for better readability and specific function to do specific functions
    // retained the same.
    var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();

	if(objAjax)
   	{
		if(isAdvSearchScreen)
		{
            checkForSelectionAndContinue(objHTMLData, objAjax, confirmDetailDeleteMsg, url, method, isAdvSearchScreen, cancelMethod);
        }
        else
        {
            //Check for valid record to execute process if not AdvSearchScreen
	   		if(!isValidRecord(true))
	   		{
	   			return;
	   		}

            // Save changes handled only for Repeating Section on overview screen and not
            // on Seacrh List....
            // Check if the user has done changes also instead of just marking the
            // Rows for which the process needs to be run.
            var hasUserMarked = isDetailSelected(objHTMLData.getChangeFields());

            // If User has done some changes then another process flow with Do you want to Save Changes? Confirmation
            if(objHTMLData!=null && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
            {
                var htmlErrors = objAjax.error();
                htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
                var cfmFunc = "saveWorkArea()";
                // If the user chooses to continue skiping the Save, then continue
                // running the existing process.
                var deleteMsg = confirmWholeDeleteMsg;

                if(screenType == 2)
                {
                    if(hasUserMarked)
                    {
                        deleteMsg = confirmDetailDeleteMsg;
                    }
                }
                else
                {
                    deleteMsg = confirmRepeatAssocMsg;
                }

                var cancelFunc = "\"continueConfirmDocumentProcess(\'" + url + "\',\'" + method
                                            + "\'," +  isAdvSearchScreen
                                            + "," + false
                                            + ",\'"
                                            + deleteMsg
                                            + "\',\'" + cancelMethod +"\')\"";
                messagingDiv(htmlErrors, cfmFunc, cancelFunc);
                return;
            }

            // The User has not done any changes but marked the checkbox(s) only for
            // the purpose of Deletion.
            var cancelFunc = "cancelProcess()";
            if(screenType == 2)
            {
                var cfmFunc;

                if(hasUserMarked)
                {
                    deleteMsg = confirmDetailDeleteMsg;
                    cfmFunc = "\"submitDocument(\'"+url+"\', \'"+method+"\')\""
                    if(cancelMethod != null && cancelMethod != '')
                    {
                            // cancelFunc = "\"executeDocumentProcess(\'"+url+"\', \'"+cancelMethod+"\', "+isAdvSearchScreen+", "+ true +")\"";
                        cancelFunc = "\"submitDocument(\'"+url+"\', \'"+cancelMethod+"\')\"";
                    }
                }
                else
                {
                    deleteMsg = confirmWholeDeleteMsg;
                    cfmFunc = "\"loadWorkArea(\'"+url+"\', \'"+method+"\')\""
                    if(cancelMethod != null && cancelMethod != '')
                    {
                            // cancelFunc = "\"executeDocumentProcess(\'"+url+"\', \'"+cancelMethod+"\', "+isAdvSearchScreen+", "+ true +")\"";
                        cancelFunc = "\"loadWorkArea(\'"+url+"\', \'"+cancelMethod+"\')\"";
                    }
                }


                // The user has marked rows so continue with the process based on the confirmation.
                var htmlErrors = objAjax.error();
                htmlErrors.addError("confirmInfo", deleteMsg,  false);
                messagingDiv(htmlErrors, cfmFunc, cancelFunc);
                return;
            }
            else
            {
                checkForSelectionAndContinue(objHTMLData, objAjax, confirmRepeatAssocMsg, url, method, isAdvSearchScreen, cancelMethod);
            }
        }
   	}
}

//Tracker#: 20362 ENHANCE THE MM SUMMARY SCREEN - SUMMARIZE BY SECTION
//Function to set the width and cellpadding to the parent tables.
function setSummarizeByWidth(sectionId,p_sectionId,p_paddingRight)
{
	childObj = document.getElementById(p_sectionId);
	childObj.parentNode.style.paddingRight=p_paddingRight;
	var obj = getElemnt(sectionId+'_tabDetail');
	if(obj)
		{
			obj.style.width = "100%";
		}
	obj = getElemnt(sectionId+'_tabDetail_td1_table1');
	if(obj)
		{
			obj.style.width = "100%";
		}
	obj = getElemnt(sectionId+'_one_table_one_table');
	if(obj)
		{
			obj.style.width = "100%";
		}
    // Tracker#: 22687
	// The right padding is not required, as the Summary Section have 
	// borders, avoiding unwanted space.
    var tableObj = $('#' + sectionId+'_one_table_one_table');
	if(tableObj && typeof(tableObj) != "undefined")
	{
        tableObj.removeClass("clsrptsectionspacing");
    }
}

// Called during Tab Click for Association document(s)....
function showPLMAssoc(parentDocViewID, levelId, url)
{
    var method = "view";
    method = method + "&parentDocViewID="+parentDocViewID+"&levelId="+levelId;
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();

    // Check for valid record to show the screen(tab).
    if(!_checkIsValidRecord("_isValidParent" , true, szMsg_Invalid_Rec))
    {
        return;
    }

    if(objAjax && objHTMLData)
    {
        bShowMsg = true;
        Main.loadWorkArea(url, method);
        /*if(objAjax.isProcessComplete())
        {
            objHTMLData.resetChangeFields();
        } */
    }
    if($("#assocPopUpDiv"))
    {
        $("#assocPopUpDiv").dialog('close');
    }        
}
//Tracker#: 21576
//Function to display the detail level Association(s) like Attachment, Events(PO), Docs and Conditions(PO) etc.,
function showPLMAssocAtALLLevel(parentDocViewID, levelId, assocId, url, obj)
{
    var changeFieldRowno = -1;
    if(typeof(obj) == "undefined" || obj.id == null)
    {
        var nActualCurRowNo = getElemnt("nActualCurRowNo");
        //Tracker#: 21882 NEW UI : JAVA SCRIPT ERROR WHEN CLICKED ON ATTACHMENT ASSOC OFF DOCS/COND OF PARTY.
        if(nActualCurRowNo != null && typeof(nActualCurRowNo) != "undefined")
        {
            changeFieldRowno = nActualCurRowNo.value;
        }
        else
    	{
        	return;
    	}
    }
    else
    {
        changeFieldRowno = _getActualRowIndexFromObjectId(obj.id);
    }
    if(changeFieldRowno == -1)
    {
        var htmlAreaObj = _getWorkAreaDefaultObj();
        var objAjax = htmlAreaObj.getHTMLAjax();
        var htmlErrors = objAjax.error();
        objAjax.error().addError("warningInfo", szMsg_Invalid_Dtl_Rec, false);
        messagingDiv(htmlErrors);
        $("#assocPopUpDiv").dialog('close');
        return;
    }
    levelId = levelId+"&rowno="+changeFieldRowno+"&assocId="+assocId;
	showPLMAssoc(parentDocViewID, levelId, url);
}

//Function to get the row no.
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

function continueConfirmDocumentProcess(url, method, isAdvSearchScreen, overviewScrAndDtlReq, confirmMsg, cancelMethod)
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	sectionName = objAjax.getDivSectionId();
    bShowMsg = true;

    if(objHTMLData!=null)
    {
        if(overviewScrAndDtlReq)
        {
            if(!checkIsRecordSelected(objHTMLData, objAjax))
            {
                return;
            }
        }
        // The user has marked rows so continue with the process based on the confirmation.
        var htmlErrors = objAjax.error();
        htmlErrors.addError("confirmInfo", confirmMsg,  false);
        // var cfmFunc = "\"executeDocumentProcess(\'"+url+"\', \'"+method+"\', "+isAdvSearchScreen+", "+overviewScrAndDtlReq+")\"";
        var cfmFunc = "\"submitDocument(\'"+url+"\', \'"+method+"\')\"";
        var cancelFunc = "cancelProcess()";
        if(cancelMethod != null && cancelMethod != '')
        {
			// Tracker#: 22732
			// Clicking on Cancel was calling the Delete method and the confirm msg box would be open
			// Call the regular api to refresh the screen and close the Msg box
            cancelFunc = "\"executeDocumentProcess(\'"+url+"\', \'"+cancelMethod+"\', "+isAdvSearchScreen+", "+overviewScrAndDtlReq+")\"";
            // cancelFunc = "\"submitDocument(\'"+url+"\', \'"+method+"\')\""
        }
        messagingDiv(htmlErrors, cfmFunc, cancelFunc);
    }
}

function checkForSelectionAndContinue(objHTMLData, objAjax, confirmDetailDeleteMsg, url, method, isAdvSearchScreen, cancelMethod)
{
    if(!checkIsRecordSelected(objHTMLData, objAjax))
    {
        return;
    }

    // The user has marked rows so continue with the process based on the confirmation.
    var htmlErrors = objAjax.error();
    htmlErrors.addError("confirmInfo", confirmDetailDeleteMsg,  false);
    var cfmFunc = "\"submitDocument(\'"+url+"\', \'"+method+"\')\"";
    var cancelFunc = "cancelProcess()";
    if(cancelMethod != null && cancelMethod != '')
    {
        cancelFunc = "\"submitDocument(\'"+url+"\', \'"+method+"\')\"";
    }
    messagingDiv(htmlErrors, cfmFunc, cancelFunc);
}

// Send just the row numbers delimited by ","  as expected by
// SendRequest action.
function isDetailSelected(chgFields)
{
    if(chgFields != null && chgFields.length > 0)
    {
        for(var i = 0 ; i < chgFields.length ; i++)
        {
            var fieldName = chgFields[i];
            if(fieldName.startsWith(_CHK_BOX_DEFAULT_ID))
            {
                return true;
            }
        }
    }
    return false;
}

function showWorkAreaRefreshNavigation(objAjax)
{
    if(objAjax)
    {
    	_showWorkArea(objAjax);
        refreshNavigationGrid(objAjax);
    }
}

// Use this for modal pop up window with a close button on the header bar.
//_commentHTML, should be the content to be printed inside the window.
//Tracker#: 21416 CREATE DELIVERIES TAB UNDER PO
Popup = function(id, _commentTitle, _commentHTML,height,width,olay,bg,obj,applyHgt,resizable)
{
	var wa=getElemnt("_divDataWorkArea");
	var scrTop=(wa) ? parseInt(wa.scrollTop) : 0;
	var tp = parseInt(scrTop);
	var posX = (obj) ? _findPosX(obj) : null;
    var posY = (obj) ? _findPosY(obj) - (tp-15) : null;
	olay = (olay==null) ? "#FFF": olay;//Gray color
	var commentTitle = _commentTitle;
	var commentHTML = _commentHTML;
	var baseBackground, baseOpacity;
	this.show = function()
	{
		var commentsDiv = document.createElement('div');
   		$(commentsDiv).attr("id", id);
   		bg = (bg) ? bg :  "#E5E8ED";
   		$(commentsDiv).css({"background-color":bg});
   		$(commentsDiv).css('height', 'auto'); 

	    commentsDialog = $(commentsDiv).dialog({
   			title: commentTitle,
            height: applyHgt ? height : 'auto',
			width : width,
			zIndex: 900,
			position:[posX, posY],
			modal : true,
			resizable: resizable ? resizable : 'true',
			close : function(event, ui) {

   						if(newCommentsDiv) {
   							newCommentsDiv.dialog("close");
   						}
            			$(this).html('');
            			$(this).dialog('destroy');
            			$(this).remove();
            			$(".ui-widget-overlay").css("background", baseBackground).css("opacity", baseOpacity);
            		}
   		});
   		
   		var titleBar = $(".ui-dialog-titlebar a.ui-dialog-titlebar-close");   		
    	titleBar.removeClass("ui-corner-all");
   		titleBar.find(".ui-icon").html("<img src='images/close_top.gif' border='0'/>").removeClass();
   		commentsDialog.html(commentHTML);
   		if ($('#nav').length != 0)
   		{
   			$('#nav').collapsible({xoffset:'-12',yoffset:'10', imagehide: 'images/arrowdown.gif', imageshow: 'images/Rarrow.gif', defaulthide: false});
		}
   		//To set the background of the parent window.
	    var overlay = $(".ui-widget-overlay");
	    baseBackground = overlay.css("background-color");
	    baseOpacity = overlay.css("opacity");
	    overlay.css("background", olay).css("opacity", "0.2");
	    
	    return commentsDialog;
   	}
}
//Tracker#: 21416 CREATE DELIVERIES TAB UNDER PO
//The instance of this class can be used to hold the change fields, changed operators, and  added values
// Used in case of Quick search
QSearchChangeFields = function()
{
	this.qsChngFldsNVal = new Array();
	this.qsChngFlds = new Array();
	this.qsChngFldsOpr = new Array();
	this.values = new Array();
	this.addChngFlds = function(event,obj)
	{
		ChngFldsOpr = obj.id+"|"+obj.value;
		addFields(ChngFldsOpr, this.qsChngFldsNVal, obj.id );
		addFields(obj.id, this.qsChngFlds, obj.id );
	};
	this.addChngFldsOpr = function(event,obj)
	{
		ChngFldsOpr = obj.id+"|"+obj.value;
		addFields(ChngFldsOpr, this.qsChngFldsOpr, obj.id );
		if (obj.value == "13" || obj.value == "14")//If IsNull or IsNotNull setting the changed fields
		{
			//the changed field Id added to the change fields array. remove the substring _opr to get the changed field id
			addFields(obj.id.substring(0,obj.id.indexOf("_opr")), this.qsChngFlds, obj.id );
		}
	};
	this.addValues = function(event,obj)
	{
		ChngFldsOpr = obj.id+"|"+obj.value;
		addFields(ChngFldsOpr, this.values, obj.id );
	};

	addFields = function(ChngFldsOpr,ChngFlds, objId)
	{
		var contain = false;
		if ( ChngFlds.length > 0)
		{
			for ( i = 0; i < ChngFlds.length; i++)
			{
				if ( ChngFlds[i].indexOf( objId) > -1)
				{
					contain = true;
					ChngFlds[i] = ChngFldsOpr;
					break;
				}
			}
			if (!contain)
			{
				ChngFlds[ChngFlds.length] = ChngFldsOpr;
			}
		}
		else
		{
			ChngFlds[0] = ChngFldsOpr;
		}
	}
	this.resetChngFlds = function(event)
	{
		this.qsChngFldsNVal = new Array();
		this.qsChngFlds = new Array();
		this.qsChngFldsOpr = new Array();
		this.values = new Array();
	};
};

//For reseting quick search values
resetQuickSearch = function(divId,qSrch)
{
	qSrch.resetChngFlds();
	$('#'+divId +' input[type="text"]').val('');
	$('select option:first-child').attr("selected", "selected");
}

// Tracker#: 22029
// Show More Details - popup, this shows list of associations as Buttons similar to the new UI Process button(s)
// Reads the html content from _assocmenupopup div and copies the content to dynamic div which gets created
// and destroyed on click of More Details and close button. _assocmenupopup div content remains intact.
// Calculates the widht and height based on the Button fixed width and height.
function showMoreDetails(assocMenuTitle, thisObjId, nPageCurRowNo, nActualCurRowNo)
{
    var nTssButtonsCnt = getElemnt("nTssButtonsCnt").value;
    // 18 is the size of the Image to represent the curved button, adding 60 to take care of the extra space
    // occupied by the Dialog
    var height = (nTssButtonsCnt == 0 ? 80 : ((parseInt(nTssButtonsCnt) * 18) + 60) );
    var width = (nTssButtonsCnt == 0 ? 150 : 175);
    var thisObj = getElemnt(thisObjId);
    var posX = _findPosX(thisObj);
    var posY = _findPosY(thisObj);
    var assoc  = $("#_assocmenupopup");    
    // Destroy only this Div retain the assocmenypopup html as this will be needed to show again for
    // another row.
    var assocPopUpDiv = document.createElement("div");
    assocPopUpDiv.id = "assocPopUpDiv";
    var assocPopUpHTML = assoc.html();

    assocPopUpDialog = $(assocPopUpDiv).dialog({
   			title: assocMenuTitle,
            height: height,
			width : width,
			zIndex: 900,
            position:[posX, posY],
            modal : true,
			close : function(event, ui) {

   						if(newCommentsDiv) {
   							newCommentsDiv.dialog("close");
   						}

                        $("#nActualCurRowNoObj").val('');
                        $("#nPageCurRowNo").val('');
                        $(this).html('');
            			$(this).dialog('destroy');
            			$(this).remove();
        			}
   		});
    // --------------------------------------------------------------
    // Make the background white instead of greying.
    var overlay = $(".ui-widget-overlay");
    baseBackground = overlay.css("background");
    baseOpacity = overlay.css("opacity");
    overlay.css("background", "#FFF").css("opacity", "0");
    // --------------------------------------------------------------

    // --------------------------------------------------------------
    // Close Button functionality
    var titleBar = $(".ui-dialog-titlebar a.ui-dialog-titlebar-close");
    titleBar.removeClass("ui-corner-all");
    titleBar.find(".ui-icon").html("<IMG id=closeImg src='images/close_top.gif' border=0>").removeClass();

    assocPopUpDialog.html(assocPopUpHTML);
    $('#nav').collapsible({xoffset:'-12',yoffset:'10', imagehide: 'images/arrowdown.gif',
        imageshow: 'images/Rarrow.gif', defaulthide: false});

    var divObject = $("div.ui-helper-clearfix");
    divObject.removeClass("ui-widget-header");
    divObject.addClass("clsPopUpTitleBar");
    divObject.removeClass("ui-dialog-titlebar");

    var spanObject = $("span.ui-dialog-title");
    spanObject.html("<label style='white-space: nowrap;font-weight: bold '>" + assocMenuTitle+"</label>" );    

    // Set the nActualCurRowNo and  nPageCurRowNo to hidden html objects so that these will be available
    // when user clicks any of the association.
    var nPageCurRowNoObj = getElemnt("nPageCurRowNo");
    nPageCurRowNoObj.value = nPageCurRowNo;

    var nActualCurRowNoObj = getElemnt("nActualCurRowNo");
    nActualCurRowNoObj.value = nActualCurRowNo;
}
/**
 * This is a generic object with commonly used methods.
 */
var Process = { 
		showOverview: function (obj,actionclass,method,src){
			//alert("showOverview");
			if(obj	!= null) {
				if(obj.parentNode.id != ""){
					obj = obj.parentNode;
				}
				var navigationDiv = document.getElementById("navigationGridTable").getElementsByTagName("div");
				if (navigationDiv){
				for(i=0;i<navigationDiv.length;i++){
					if("gridDiv_"+i == obj.id){
						document.getElementById("gridDiv_"+i).className = "colorWallCellSpaceNavigatorSelected";
					} else {
						document.getElementById("gridDiv_"+i).className = "colorWallCellSpaceNavigator";
					}
				}}
			}
		   if(src == null || src == 'undefined')src="";
		    var url =method+"&_nColLibRow=" + _nColLibRow +src;
		    url += "&keyinfo= " +getComponentKeyInfo();
		    loadWorkArea(actionclass, url);
		},
		execute: function (url, action)
		{
			//alert("execute");
			var htmlAreaObj = _getWorkAreaDefaultObj();
			var objAjax = htmlAreaObj.getHTMLAjax();
			var objHTMLData = htmlAreaObj.getHTMLDataObj();
			sectionName = objAjax.getDivSectionId();
		    if(objAjax && objHTMLData)
		    {
		    	bShowMsg = true;
		       	loadWorkArea(action, url);
		        if(objAjax.isProcessComplete())
		        {
		            objHTMLData.resetChangeFields();
		        }
		    }
		},
		sendRequest: function (secId, url, method,handler)
		{
			//alert("url:"+url +" Method:"+method +" Handler:"+handler);
			var htmlAreaObj = _getWorkAreaDefaultObj();
		    var objAjax = htmlAreaObj.getHTMLAjax();
		    if(!objAjax)objAjax = new htmlAjax();
		    sectionName = secId;
		    if(objAjax)
		    {
		    	objAjax.setActionURL(url);
		        objAjax.setActionMethod(method);
		        objAjax.setProcessHandler(handler);
		        objAjax.sendRequest();
		    }
		},
		saveChanges: function(url, method,handler)
		{
			//alert("save changes");
			var htmlAreaObj = _getWorkAreaDefaultObj();
		   	var objAjax = htmlAreaObj.getHTMLAjax();
		    var objHTMLData = htmlAreaObj.getHTMLDataObj();
		    bShowMsg = true;
		    sectionName = objAjax.getDivSectionId();
		    objAjax.setActionURL(url);
	        objAjax.setActionMethod(method);
            objAjax.setProcessHandler(handler);
            objHTMLData.performSaveChanges(handler, objAjax);
            if(objAjax.isProcessComplete())
            {
                objHTMLData.resetChangeFields();
            }
		}
	};

	//Tracker#:24193 GLOBAL SEACH: ENABLE PARTY DOCUMENT
	//Moved divTitlePopup from rfq.jsp to screenutils.js for common usage
	//Tracker#:23067  FDD 374 FR2,3 AND 6 -> GLOBAL SEARCH - PARTY : ADD PARTY AS PART OF GLOBAL SEARCH
	
	var divTitlePopup = {
				
		showSRTitle : function(obj)
		{	
			if(!obj)
			{
				return false;
			}
			
			if(obj.getAttribute("titleInfo").length==0)
			{				
				return true;
			}
			
			divTitlePopup.showTitle(obj, document);
		},
		
		showTitle : function(obj, objParent)
		{			
			var fadeTime = 3000;
			
			if( (typeof(objParent)=="undefined") || !objParent)
			{
				objParent = document;
			}
					
			titleDivObj = objParent.getElementById("titleDivDisp");
						
						
			if ( !titleDivObj || titleDivObj == null)
			{
		        titleDivObj = objParent.createElement('div');
		        titleDivObj.id = 'titleDivDisp';		        
		        titleDivObj.className = "titleContent";
		        titleDivObj.style.overflow = "hidden";
		        titleDivObj.style.position = "absolute";
		        titleDivObj.style.zIndex=999999; //iFrame will be just below the theDiv
		        objParent.body.appendChild(titleDivObj);
		    }
		    /*
		    else
		    {			    	
		        $(titleDivObj).stop();
		        $(titleDivObj).fadeTo('fast', 1);		        
		        $(titleDivObj).unbind();
		    }*/
		
		  	titleDivObj.style.display = "block";
			
			//alert("show title" + obj.getAttribute("titleInfo"));
			
			titleDivObj.innerHTML=obj.getAttribute("titleInfo");
			titleDivObj.style.left = _getComponentLeft(obj) + "px";
			titleDivObj.style.top = _getComponentTop(obj) + "px";
			
			
			//alert(titleDivObj.style.left + "\n " + _getComponentLeft(obj));
			/*
			var divTitleFd = $(titleDivObj).fadeTo(fadeTime, 0.5, function() {
            	divTitlePopup.closeTitleDiv(titleDivObj);
       		});
       		
       		
       		$(titleDivObj).hover(function(){
                divTitleFd.stop();
                divTitleFd = $(titleDivObj).fadeTo('fast', 1);
            },function(){
            	divTitleFd = $(titleDivObj).fadeTo(fadeTime, 0.5, function() {
                divTitlePopup.closeTitleDiv(titleDivObj);
            });});
            */
        
		},
		
		closeSRTitle : function(obj)
		{
			var titleDivObj = document.getElementById("titleDivDisp");
			divTitlePopup.closeTitleDiv(titleDivObj);			
		},
		
		
		closeTitleDiv	: function(titleDivObj)
		{
			//alert("closeTitleDiv called " + titleDivObj);
			try
			{
				if(!titleDivObj)
				{
					titleDivObj = document.getElementById("titleDivDisp");
				}
		 	if(titleDivObj)
		 	{
		 		//alert("inside");
		    	titleDivObj.style.display = "none";
		 		titleDivObj.innerHTML = "";
		    	titleDivObj.parentNode.removeChild(titleDivObj);
		    	titleDivObj = null;
		 	}
		 	}catch(ex){}		 	
					
		}		
	}	


