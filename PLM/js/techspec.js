/*************************************/
/*  Copyright  (C)  2002 - 2009      */
/*           by                      */
/*  TradeStone Software, Inc.        */
/*  Gloucester, MA. 01930            */
/*  All Rights Reserved              */
/*  Printed in U.S.A.                */
/*  Confidential, Unpublished        */
/*  Property of                      */
/*  TradeStone Software, Inc.        */
/*************************************/
//since 2009R4 aug 30 fixpack Tracker#:12564

//Tracker#:14143 - adding delete processes.  Adding namespacing at same time
var TechSpec = {};
var szMsg_unlink_parentstyle  = 'You are about to unlink the parent style. If this link is broken, you will not be able to re-link the group.';
var szMsg_unlink_childstyle  = 'This action will unlink the Style from the Parent Style. If changes are made to this Style after unlinking, you will not be able to re-link this Style. Ok/Cancel';
//The Mass Sharing of the Tech Spec from the Tech Spec Advanced Search is on hold & will be part of future release. 
//User message to prompt the user that no tech spec has been selected.
var szMsg_Sel_Tech_Spec="Please select Tech Spec(s).";
///js function called when user clicks on the replace process button on the
///techspec list screen
function _viewTechSpecReplace()
{
    //alert("vw");
    closeMsgBox();
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    if(htmlAreaObj && objAjax)
    {
        var actMethod = "viewreplace";
        var htmlfldName = htmlAreaObj.getDivSectionId();
        //Tracker#:12867 - OUTSTANDING TECH SPEC>MASS REPLACE ISSUES
        //set the popup as editable
        _startSmartTagPopup(htmlfldName, false, null, true);
        bShowMsg = true;
        objAjax.setActionURL("techspec.do");
        objAjax.setActionMethod(actMethod);
        objAjax.attribute().setAttribute("htmlfldName", htmlfldName);
        objAjax.setProcessHandler(_showSmartTagInteractivePopup);
        objAjax.parameter().add(_screenChangeFileds, objHTMLData.getSaveChangeFields());
        objHTMLData._appendAllContainerDataToRequest(objAjax);
        objAjax.sendRequest();

    }
}

////called this js function when user clicks on the save button
// on the replace popup
function _techSpecReplaceSave()
{
    //alert("save clicked");
    //alert("vw");
    //closeMsgBox();
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    if(htmlAreaObj && objAjax)
    {
        var actMethod = "replacesave";
        bShowMsg = true;
        objAjax.setActionURL("techspec.do");
        objAjax.setActionMethod(actMethod);
        objAjax.setProcessHandler(_techSpecReplaceSavePostProcess);
        //alert("objHTMLData.getChangeFields() " + objHTMLData.getChangeFields());
        objAjax.parameter().add(_screenChangeFileds, objHTMLData.getSaveChangeFields());
        objHTMLData._appendAllContainerDataToRequest(objAjax);

        var objHdn = getElemnt("_hdnReplaceContName");

        if(objHdn)
        {
            //alert("objHdn.value " + objHdn.value);
            //append all the popup content values
           objHTMLData._appendAllContainerDataToRequest(objAjax, objHdn.value);
        }

        objAjax.sendRequest();
    }
}

/// js function to hanlde the post save replace process
// which will close the smart tag, closes the message div
/// refreshes the work area
function _techSpecReplaceSavePostProcess(objAjax)
{
    if(objAjax && objAjax.getResponseHeader("_closepopup")!="0")
    {
         closeMsgBox();
         _closeSmartTag();

        var htmlAreaObj = _getWorkAreaDefaultObj();

        if(htmlAreaObj)
        {
            htmlAreaObj.resetHTMLData();
        }
        _showWorkArea(objAjax);
    }
    else
    {
        //display only the user message
        // when save operation got aborted
        // for not selecting any data or for some reason.
        _displayProcessMessage(objAjax);
    }
}

//Function for view Sampel Request popup
function _requestSample()
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
	//alert("htmlAreaObj " + htmlAreaObj);
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();

    // Tracker#:12621 ISSUES ON BLANK RECORD OF TECH SPEC
    // Check for valid record to execute process.
    if(!isValidRecord(true))
    {
        return;
    }

    //Tracker#: 15802 TECH SPEC OVERVIEW SHOULD ALWAYS WARN USER WHEN THEY MAKE A CHANGE AND DO NOT SAVE
	//User edits the field data and without saving click on the 'Request Sample' button
	//Pop up the  message 'There are changes on the screen. Do you want to save changes before current action?'.
	if(objHTMLData!=null && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
    {
        var htmlErrors = objAjax.error();
        htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
        messagingDiv(htmlErrors, "saveTechSpec()", "continueRequestSample()");
    }
    else
    {
        continueRequestSample();
    }
}

function continueRequestSample()
{
    closeMsgBox();
    var htmlAreaObj = _getWorkAreaDefaultObj();
	//alert("htmlAreaObj " + htmlAreaObj);
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();

    if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
    {
        var htmlErrors = objAjax.error();
        objAjax.error().addError("warningInfo", szMsg_Sel_Supplier_Row, false);
        messagingDiv(htmlErrors);
        return;
    }
	var actMethod ="samplepopup";
    if(objAjax)
    {
    	var htmlfldName = htmlAreaObj.getDivSectionId();
    	//alert("showView : objAjax "  + objAjax.getDocViewId());
    	_startSmartTagPopup(htmlfldName, false, null, true);
        objAjax.setActionURL("techspecoverview.do");
        objAjax.setActionMethod(actMethod);
        //Tracker#:14804 SIMPLE SAMPLE  - ABILITY TO SELECT MATERIAL
        //Set parentchange field to read the selected material no the tech spec at server side.
        objAjax.parameter().add(_parentScreenChgFields, objHTMLData.getSaveChangeFields());
        objAjax.attribute().setAttribute("htmlfldName", htmlfldName);
        objAjax.setProcessHandler(_showSmartTagInteractivePopup);
        //alert("sending");
        objAjax.sendRequest();
    }
}

function techSpecRequestSample(divid)
{
	var htmlAreaObj = _getAreaObjByDocView(divid);
	var htmlWrkAreaObj = _getWorkAreaDefaultObj();
	if(htmlAreaObj && htmlWrkAreaObj)
	{
		var actMethod = "requestSample";
		var objAjax = htmlAreaObj.getHTMLAjax();
		var objHTMLData = htmlAreaObj.getHTMLDataObj();
		var parentobjHTMLData = htmlWrkAreaObj.getHTMLDataObj();

		sectionName = objAjax.getDivSectionId();
		//alert("_showSampleTabView \n sectionName  " + sectionName);
	    if(objAjax && objHTMLData)
	    {
	    	var htmlfldName = htmlWrkAreaObj.getDivSectionId();
	    	//alert("getChangeFields : "+ objHTMLData.getChangeFields());
	    	bShowMsg = true;
	        objAjax.setActionMethod(actMethod);
	        objAjax.setActionURL("techspecoverview.do");
	        objAjax.setProcessHandler(_techSpecRequestSamplePostBack);
	        objHTMLData.appendAllCustomContainerDataToRequest(objAjax, divid);
	        objAjax.parameter().add(_parentScreenChgFields, parentobjHTMLData.getSaveChangeFields());
	        objAjax.parameter().add(_screenChangeFileds, objHTMLData.getSaveChangeFields());
        	objHTMLData._appendAllContainerDataToRequest(objAjax);
        	//_startSmartTagPopup(htmlfldName, false, null, true);
        	objAjax.sendRequest();
	    }
    }
}

function _techSpecRequestSamplePostBack(objAjax)
{
    if(objAjax.isProcessComplete())
    {
        _closeSmartTag();
        _showWorkArea(objAjax);
    }
    else
    {
        //alert("show mesage");
        _displayProcessMessage(objAjax);
    }
}

//Tracker 14198 -VIEW SUBMITS REQUESTS OFF TECH PACK
//Tracker#:20812 Modified the function add the save confirm message
function _gotoSubmits()
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
   	var docview;

    // Tracker#:12621 ISSUES ON BLANK RECORD OF TECH SPEC
    // Check for valid record to execute process.
    if(!isValidRecord(true))
    {
        return;
    }
	
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	//alert(objHTMLData);
	if(objHTMLData && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
    {
        var htmlErrors = objAjax.error();
        htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
        var saveFunc ="\"Main.loadWorkAreaWithSave()\"";	 
        var canceFunc ="_showSubmit()";
        messagingDiv(htmlErrors, saveFunc, canceFunc);
    }
    else
    {
    	_showSubmit();
	}
}

//Tracker#:20812 _gotoSubmits continuation
function _showSubmit()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
   	
	if(objAjax)
	{	  	
    	var url = "gotosubmits";
    	//alert("here");
	    objAjax.setActionURL("techspecoverview.do");
        objAjax.setActionMethod(url);
        objAjax.setProcessHandler(_showSubmits);
        objAjax.sendRequest();
	}
}

//Tracker 14198 -VIEW SUBMITS REQUESTS OFF TECH PACK
function showTechSpecFromSubmitsMsg(msg)
{
	var htmlErrors = new htmlAjax().error();
    htmlErrors.addError("warningInfo", msg,  false);
    messagingDiv(htmlErrors);

}
//Tracker 14198 -VIEW SUBMITS REQUESTS OFF TECH PACK
function _showSubmits(objAjax)
{
	//Tracker#: 15620 VIEW SUBMIT REQUEST - NAVIGATING BACK TO TECH SPEC WHEN NO SUBMIT REQUEST FOUND
	//If process complete, it will refresh navigation grid otherwise display user message
    //_showWorkArea(objAjax);
    //alert("_showSubmits: objAjax.isProcessComplete() " + objAjax.isProcessComplete());
    if(objAjax.isProcessComplete())
    {
    	//alert("loading nav grid for submits");
    	loadNavigationGrid(objAjax);
    }
    else
    {
    	//alert("show mesage");
    	_displayProcessMessage(objAjax);
    	Main.resetDefaultArea();
    }
}

// Tracker#:14488 ADD CREATE POM PROCESS FOR TECH SPEC

function _attachAssociations(assocId)
{
	var url = "attachassocs"+"&assoc_id="+assocId;
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
        var docview = objAjax.getDocViewId();
		Main.loadWorkArea("techspecoverview.do", url);
    }
}

//Tracker 12621 -ISSUES ON BLANK RECORD OF TECH SPEC
//Moved this method from Colorlib.js to techspec.js
function adoptTechSpec()
{
    var url = "adoptTechSpec";
 	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	sectionName = objAjax.getDivSectionId();

    // Tracker#:12621 ISSUES ON BLANK RECORD OF TECH SPEC
    // Check for valid record to execute process.
    if(!isValidRecord(true))
    {
        return;
    }

    //alert("sectionName2  " + sectionName);
    if(objAjax && objHTMLData)
    {
        bShowMsg = true;
        var docview = objAjax.getDocViewId();
        if(docview==132)
        {
           	Main.loadWorkArea("techspecoverview.do", url);
        }
        else
        {
        	objAjax.setActionURL("techspec.do");
        	objAjax.setActionMethod(url);
        	objAjax.setProcessHandler(_showListPage);
        	objHTMLData.performSaveChanges(_showListPage, objAjax);
       	}       
    }
}

//Tracker 12621 -ISSUES ON BLANK RECORD OF TECH SPEC
//Moved this method from Colorlib.js to techspec.js
function reinstateTechSpec()
{
    var url = "reinstateTechSpec";
 	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	sectionName = objAjax.getDivSectionId();

	// Tracker#:12621 ISSUES ON BLANK RECORD OF TECH SPEC
    // Check for valid record to execute process.
    if(!isValidRecord(true))
    {
        return;
    }

	//alert("sectionName  " + sectionName);
    if(objAjax && objHTMLData)
    {
        bShowMsg = true;
        var docview = objAjax.getDocViewId();
        if(docview==132)
        {
           	Main.loadWorkArea("techspecoverview.do", url);
        }
        else
        {
        	objAjax.setActionURL("techspec.do");
        	objAjax.setActionMethod(url);
        	objAjax.setProcessHandler(_showListPage);
        	objHTMLData.performSaveChanges(_showListPage, objAjax);
       	}
    }
}

//Tracker 12621 -ISSUES ON BLANK RECORD OF TECH SPEC
//Moved this method from Colorlib.js to techspec.js
function copyTechSpec()
{
    var url = "copyTechSpec";
 	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	sectionName = objAjax.getDivSectionId();

	// Tracker#:12621 ISSUES ON BLANK RECORD OF TECH SPEC
    // Check for valid record to execute process.
    if(!isValidRecord(true))
    {
        return;
    }

	//alert("sectionName  " + sectionName);
    if(objAjax && objHTMLData)
    {
        bShowMsg = true;
        var docview = objAjax.getDocViewId();
        if(docview==132)
        {        	
           	Main.loadWorkArea("techspecoverview.do", url);
        }
        else
        {
        	objAjax.setActionURL("techspec.do");
        	objAjax.setActionMethod(url);
	        objAjax.setProcessHandler(_techSpecShowPage);
	        objHTMLData.performSaveChanges(_techSpecShowPage, objAjax);
	        if(objAjax.isProcessComplete())
	        {
	            objHTMLData.resetChangeFields();
	        }
       	}       
    }
}

//Tracker 12621 -ISSUES ON BLANK RECORD OF TECH SPEC
//Moved this method from Colorlib.js to techspec.js
function dropTechSpec()
{
    var url = "dropTechSpec";
 	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	sectionName = objAjax.getDivSectionId();

	// Tracker#:12621 ISSUES ON BLANK RECORD OF TECH SPEC
    // Check for valid record to execute process.
    if(!isValidRecord(true))
    {
        return;
    }

	//alert("sectionName  " + sectionName);
    if(objAjax && objHTMLData)
    {
        bShowMsg = true;
        var docview = objAjax.getDocViewId();
        if(docview==132)
        {
           	Main.loadWorkArea("techspecoverview.do", url);
        }
        else
        {
        	objAjax.setActionURL("techspec.do");
        	objAjax.setActionMethod(url);
       		objAjax.setProcessHandler(_showListPage);
        	objHTMLData.performSaveChanges(_showListPage, objAjax);
       	}
    }
}

//Tracker 12621 -ISSUES ON BLANK RECORD OF TECH SPEC
//Moved this method from Colorlib.js to techspec.js
//Function for createTechSpec
//Tracker#:20812 Modified the function show new UI save confirm message
function createTechSpec()
{
   	var url = "createtechspec";
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	
	//alert("sectionName  " + sectionName);
    if(objAjax && objHTMLData)
    {
    	//alert("inside calling");
    	bShowMsg = true;
       	Main.loadWorkArea("techspecoverview.do", url);      
    }
}

//Tracker 12621 -ISSUES ON BLANK RECORD OF TECH SPEC
//Moved this method from Colorlib.js to techspec.js
function dropColorways()
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();

    // Tracker#:12621 ISSUES ON BLANK RECORD OF TECH SPEC
    // Check for valid record to execute process.
    if(!isValidRecord(true))
    {
        return;
    }

    //Tracker#: 15802 TECH SPEC OVERVIEW SHOULD ALWAYS WARN USER WHEN THEY MAKE A CHANGE AND DO NOT SAVE
	//User edits the field data and without saving click on the 'Drop Colorways' button
	//Pop up the  message 'There are changes on the screen. Do you want to save changes before current action?'.
	if(objHTMLData!=null && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
    {
        var htmlErrors = objAjax.error();
        htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
        messagingDiv(htmlErrors, "saveTechSpec()", "continueDropClrWay()");
    }
    else
    {
        continueDropClrWay();
    }
}

function continueDropClrWay()
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
   	var docview;

   	if(objAjax)
   	{
   		docview = objAjax.getDocViewId();
   		//alert("docview"+docview);
   		var htmlErrors = objAjax.error();

   		if(docview==132)
   		{
            if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
            {
                var htmlErrors = objAjax.error();
                objAjax.error().addError("warningInfo", szMsg_Sel_DropClrway_Row, false);
                messagingDiv(htmlErrors);
                return;
            }
   		    htmlErrors.addError("confirmInfo","Do you want to drop the Colorway(s)?",  false);
   		}
   		messagingDiv(htmlErrors,'dropColorwayRecords()', 'cancelProcess()');
    }
}

//Tracker 12621 -ISSUES ON BLANK RECORD OF TECH SPEC
//Moved this method from Colorlib.js to techspec.js
//function to drop the selected Colorways On product overview screen
function dropColorwayRecords()
{
	var url = "dropcolorways";
	var docview;
	closeMsgBox();

	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objAjax.getDivSectionId();
    //alert("sectionName  " + sectionName);
    if(objAjax && objHTMLData)
    {
        docview = objAjax.getDocViewId();
        //alert("docview: "+docview);
        //alert("inside calling");
        bShowMsg = true;
        if(docview==132)
        {
            objAjax.setActionURL("techspecoverview.do");
            objAjax.setActionMethod(url);
            objAjax.setProcessHandler(_techspec_postprocess);
            objHTMLData.performSaveChanges(_techspec_postprocess, objAjax);
            return;
        }
     }
}

function _techspec_postprocess(objAjax)
{
    _defaultWorkAreaSave(objAjax);
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    if(objAjax.isProcessComplete())
    {
        objHTMLData.resetForm();
        objHTMLData.resetChangeFields();
    }
}

//Tracker 12621 -ISSUES ON BLANK RECORD OF TECH SPEC
//Moved this method from Colorlib.js to techspec.js
function restoreColorways()
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();

    // Tracker#:12621 ISSUES ON BLANK RECORD OF TECH SPEC
    // Check for valid record to execute process.
    if(!isValidRecord(true))
    {
        return;
    }

    //Tracker#: 15802 TECH SPEC OVERVIEW SHOULD ALWAYS WARN USER WHEN THEY MAKE A CHANGE AND DO NOT SAVE
	//User edits the field data and without saving click on the 'Restore Colorways' button
	//Pop up the  message 'There are changes on the screen. Do you want to save changes before current action?'.
	if(objHTMLData!=null && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
    {
        var htmlErrors = objAjax.error();
        htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
        messagingDiv(htmlErrors, "saveTechSpec()", "continueRestoreClrWay()");
    }
    else
    {
        continueRestoreClrWay();
    }
}

function continueRestoreClrWay()
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
	var docview;

   	if(objAjax)
   	{
   		docview = objAjax.getDocViewId();
   		//alert("docview"+docview);
   		var htmlErrors = objAjax.error();

   		if(docview==132)
   		{
            if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
            {
                var htmlErrors = objAjax.error();
                objAjax.error().addError("warningInfo", szMsg_Sel_RestoreClrway_Row, false);
                messagingDiv(htmlErrors);
                return;
            }
            // Tracker#: 13840 RESTORE MISSPELLED ON MESSAGE POP-UP
            // Calling confirm message by variable 'szMsg_Clrway_Restore_Confirm' to display.
   		    htmlErrors.addError("confirmInfo", szMsg_Clrway_Restore_Confirm,  false);
   		}
   		messagingDiv(htmlErrors,'restoreColorwayRecords()','cancelProcess()');
    }
}


//Tracker 12621 -ISSUES ON BLANK RECORD OF TECH SPEC
//Moved this method from Colorlib.js to techspec.js
//function to drop the selected Colorways On product overview screen
function restoreColorwayRecords()
{
	var url = "restorecolorways";
	var docview;
	closeMsgBox();

	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objAjax.getDivSectionId();

    //alert("sectionName  " + sectionName);
    if(objAjax && objHTMLData)
    {
        docview = objAjax.getDocViewId();
        //alert("docview: "+docview);
        //alert("inside calling");
        bShowMsg = true;
        if(docview==132)
        {
            objAjax.setActionURL("techspecoverview.do");
            objAjax.setActionMethod(url);
            objAjax.setProcessHandler(_techspec_postprocess);
            objHTMLData.performSaveChanges(_techspec_postprocess, objAjax);
            return;
        }
     }
}

//Tracker 12621 -ISSUES ON BLANK RECORD OF TECH SPEC
//Moved this method from Colorlib.js to techspec.js
function deleteSizeRanges()
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();

    // Tracker#:12621 ISSUES ON BLANK RECORD OF TECH SPEC
    // Check for valid record to execute process.
    if(!isValidRecord(true))
    {
        return;
    }

    //Tracker#: 15802 TECH SPEC OVERVIEW SHOULD ALWAYS WARN USER WHEN THEY MAKE A CHANGE AND DO NOT SAVE
	//User edits the field data and without saving click on the 'Delete Size Range' button
	//Pop up the  message 'There are changes on the screen. Do you want to save changes before current action?'.
	if(objHTMLData!=null && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
    {
        var htmlErrors = objAjax.error();
        htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
        messagingDiv(htmlErrors, "saveTechSpec()", "continueDeleteSizeRanges()");
    }
    else
    {
        continueDeleteSizeRanges();
    }
}

function continueDeleteSizeRanges()
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    var docview;

   	if(objAjax)
   	{
   		docview = objAjax.getDocViewId();
   		//alert("docview"+docview);
   		var htmlErrors = objAjax.error();
   		if(docview==132)
   		{
            if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
            {
                var htmlErrors = objAjax.error();
                objAjax.error().addError("warningInfo", szMsg_Sel_SizeInfo_Row, false);
                messagingDiv(htmlErrors);
                return;
            }
   		    htmlErrors.addError("confirmInfo","Do you want to delete Size Range(s)?",  false);
   		}
   		messagingDiv(htmlErrors,'deleteSizeRecords()','cancelProcess()');
    }
}

//Tracker 12621 -ISSUES ON BLANK RECORD OF TECH SPEC
//Moved this method from Colorlib.js to techspec.js
//function to delete selected size info On product overview screen
function deleteSizeRecords()
{
	var url = "deletesizes";
	var docview;
	closeMsgBox();

	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objAjax.getDivSectionId();
    //alert("sectionName  " + sectionName);
    if(objAjax && objHTMLData)
    {
        docview = objAjax.getDocViewId();
        //alert("docview: "+docview);
        //alert("inside calling");
        bShowMsg = true;
        if(docview==132)
        {
            objAjax.setActionURL("techspecoverview.do");
            objAjax.setActionMethod(url);
            objAjax.setProcessHandler(_techspec_postprocess);
            objHTMLData.performSaveChanges(_techspec_postprocess, objAjax);
            return;
        }
     }
}

//Tracker 12621 -ISSUES ON BLANK RECORD OF TECH SPEC
//Moved this method from Colorlib.js to techspec.js
function deleteTreatments()
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();

    // Tracker#:12621 ISSUES ON BLANK RECORD OF TECH SPEC
    // Check for valid record to execute process.
    if(!isValidRecord(true))
    {
        return;
    }

    //Tracker#: 15802 TECH SPEC OVERVIEW SHOULD ALWAYS WARN USER WHEN THEY MAKE A CHANGE AND DO NOT SAVE
	//User edits the field data and without saving click on the 'Delete Treatment' button
	//Pop up the  message 'There are changes on the screen. Do you want to save changes before current action?'.
	if(objHTMLData!=null && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
    {
        var htmlErrors = objAjax.error();
        htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
        messagingDiv(htmlErrors, "saveTechSpec()", "continueDeleteTreatments()");
    }
    else
    {
        continueDeleteTreatments();
    }
}

function continueDeleteTreatments()
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    var docview;

   	if(objAjax)
   	{
   		docview = objAjax.getDocViewId();
   		//alert("docview"+docview);
   		var htmlErrors = objAjax.error();
   		if(docview==132)
   		{
            if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
            {
                var htmlErrors = objAjax.error();
                objAjax.error().addError("warningInfo", szMsg_Sel_Treatment_Row, false);
                messagingDiv(htmlErrors);
                return;
            }
   		    htmlErrors.addError("confirmInfo","Do you want to delete Treatment(s)?",  false);
   		}
   		messagingDiv(htmlErrors,'deleteTreatmentRecords()','cancelProcess()');
     }
}


//Tracker 12621 -ISSUES ON BLANK RECORD OF TECH SPEC
//Moved this method from Colorlib.js to techspec.js
//function to delete selected size info On product overview screen
function deleteTreatmentRecords()
{
	var url = "deletetreatments";
	var docview;
	closeMsgBox();

	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objAjax.getDivSectionId();
    //alert("sectionName  " + sectionName);
    if(objAjax && objHTMLData)
    {
        docview = objAjax.getDocViewId();
        //alert("docview: "+docview);
        //alert("inside calling");
        bShowMsg = true;
        if(docview==132)
        {
            objAjax.setActionURL("techspecoverview.do");
            objAjax.setActionMethod(url);
            objAjax.setProcessHandler(_techspec_postprocess);
            objHTMLData.performSaveChanges(_techspec_postprocess, objAjax);
            return;
        }
    }
}

//Tracker 12621 -ISSUES ON BLANK RECORD OF TECH SPEC
//Moved this method from Colorlib.js to techspec.js
function deleteItemMaterials()
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();

    // Tracker#:12621 ISSUES ON BLANK RECORD OF TECH SPEC
    // Check for valid record to execute process.
    if(!isValidRecord(true))
    {
        return;
    }

   	//Tracker#: 15802 TECH SPEC OVERVIEW SHOULD ALWAYS WARN USER WHEN THEY MAKE A CHANGE AND DO NOT SAVE
	//User edits the field data and without saving click on the 'Delete Materials' button
	//Pop up the  message 'There are changes on the screen. Do you want to save changes before current action?'.
	if(objHTMLData!=null && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
    {
        var htmlErrors = objAjax.error();
        htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
        messagingDiv(htmlErrors, "saveTechSpec()", "continueDeleteItemMaterials()");
    }
    else
    {
        continueDeleteItemMaterials();
    }
}


function continueDeleteItemMaterials()
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    var docview;

    if(objAjax)
   	{
   		docview = objAjax.getDocViewId();
   		//alert("docview"+docview);
   		var htmlErrors = objAjax.error();
   		if(docview==132)
   		{
            if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
            {
                var htmlErrors = objAjax.error();
                objAjax.error().addError("warningInfo", szMsg_Sel_Material_Row, false);
                messagingDiv(htmlErrors);
                return;
            }
   		    htmlErrors.addError("confirmInfo","Do you want to delete Material(s)?",  false);
   		}
   		messagingDiv(htmlErrors,'deleteMaterialRecords()','cancelProcess()');
    }
}

//Tracker 12621 -ISSUES ON BLANK RECORD OF TECH SPEC
//Moved this method from Colorlib.js to techspec.js
//function to delete selected size info On product overview screen
function deleteMaterialRecords()
{
	var url = "deletematerials";
	var docview;
	closeMsgBox();

	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objAjax.getDivSectionId();
    //alert("sectionName  " + sectionName);
    if(objAjax && objHTMLData)
    {
        docview = objAjax.getDocViewId();
        //alert("docview: "+docview);
        //alert("inside calling");
        bShowMsg = true;
        if(docview==132)
        {
            objAjax.setActionURL("techspecoverview.do");
            objAjax.setActionMethod(url);
            objAjax.setProcessHandler(_techspec_postprocess);
            objHTMLData.performSaveChanges(_techspec_postprocess, objAjax);
            return;
        }
     }
}

//Tracker 12621 -ISSUES ON BLANK RECORD OF TECH SPEC
//Moved this method from Colorlib.js to techspec.js
//Tracker#:20812 Modified the function add the save confirm message
function _gotoRGQ()
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
   	
    // Tracker#:12621 ISSUES ON BLANK RECORD OF TECH SPEC
    // Check for valid record to execute process.
    if(!isValidRecord(true))
    {
        return;
    }

   	var docview;
	//Tracker#: 15860 SYSTEM DOES NOT ALWAYS WARN THE USER TO SAVE BEFORE THE USER LEAVES A SCREEN
	//User edits the field data and without saving click on the 'View Quote'link 
	//Pop up message 'There are changes on the screen. Do you want to save changes before current action?' will display.
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
	//alert(objHTMLData);
	if(objHTMLData && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
    {
        var htmlErrors = objAjax.error();
        htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
        var saveFunc ="\"Main.loadWorkAreaWithSave()\"";	 
        var canceFunc ="_showRFQ()";
        messagingDiv(htmlErrors, saveFunc, canceFunc);
    }
    else
    {
   		_showRFQ();
   	}
}

//Tracker#:20812 _gotoRGQ continuation
function _showRFQ()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
   	
	if(objAjax)
	{		
    	var url = "gotorfq";
    	//alert("here");
	    objAjax.setActionURL("techspecoverview.do");
        objAjax.setActionMethod(url);
        objAjax.setProcessHandler(_displayRFQ);
        objAjax.sendRequest();
	}
}

function _displayRFQ(objAjax)
{
	//For displaying message on screen.
    if(bShowMsg==true)
   	{    	 
   		msgInfo = objAjax.getAllProcessMessages();
		//alert(" msgInfo: \n "+msgInfo);	
	    if(msgInfo!="")
	    {
	    	//alert("display called");
	        _displayProcessMessage(objAjax);
	        Main.resetDefaultArea();
	    }
   	} 
   	//var scrpt = objAjax.getScriptResult();
    //alert("scrpt "+ scrpt);  
    _execAjaxScript(objAjax);
}

//Tracker#18257
//To navigate from TechSpec to LineList.
//since 2011 r2
//Tracker#:20812 Modified the function add the save confirm message
function _gotoLineList()
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    // Tracker#:12621 ISSUES ON BLANK RECORD OF TECH SPEC
    // Check for valid record to execute process.
    if(!isValidRecord(true))
    {
        return;
    }
    
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
	//alert(objHTMLData);
	if(objHTMLData && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
    {
        var htmlErrors = objAjax.error();
        htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
        var saveFunc ="\"Main.loadWorkAreaWithSave()\"";	 
        var canceFunc ="showLList()";
        messagingDiv(htmlErrors, saveFunc, canceFunc);
    }
    else
    {
    	showLList();
	}
}

//Tracker#:20812 _gotoLineList continuation
function showLList()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    
	if(objAjax)
	{	  
		bShowMsg = true;
    	var url = "gotolinelist";
	    objAjax.setActionURL("techspecoverview.do");
        objAjax.setActionMethod(url);
        objAjax.setProcessHandler(_displayRFQ);
        objAjax.sendRequest();
	}
}

//Tracker#18257
//To navigate from TechSpec to LineList.
//since 2011r2
function _showLineList()
{
	waitWindow();window.location.href='linelist.do?method=rfq';waitWindow();
}

TechSpec.show = function (url, action)
{
 	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	// Check for valid record to execute process.
    if(!isValidTecSpec(true))
    {
        return;
    }

    if(objAjax && objHTMLData)
    {
    	//alert("inside calling");
    	bShowMsg = true;
       	Main.loadWorkArea(action, url);
    }
}
//Tracker 12621 -ISSUES ON BLANK RECORD OF TECH SPEC
//Moved this method from Colorlib.js to techspec.js
function showInstructions()
{
    TechSpec.show("showInstruction","instruction.do");
}

//Tracker 12621 -ISSUES ON BLANK RECORD OF TECH SPEC
//Moved this method from Colorlib.js to techspec.js
function showConstructions()
{
    TechSpec.show("showConstruction","construction.do");
}

//Tracker 12621 -ISSUES ON BLANK RECORD OF TECH SPEC
//Added the new function to be called onclick of Design Intent tab.
function showDesignIntent()
{
    TechSpec.show("view","designintent.do");
}


//Tracker 12621 -ISSUES ON BLANK RECORD OF TECH SPEC
//Moved this method from Colorlib.js to techspec.js
function showBillOfMaterials()
{
   TechSpec.show("AJAXVIEW","bomc.do");
}

//Tracker 12621 -ISSUES ON BLANK RECORD OF TECH SPEC
//Moved this method from Colorlib.js to techspec.js
function _showListPage(objAjax)
{
    //alert(" _techSpecShowPage: \n sectionName "+sectionName);
        
    var htmlAreaObj = _getWorkAreaDefaultObj();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	var chngedRows=objHTMLData.getChangeFields();
	
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
    	//alert("sectionName " + sectionName);
    	_reloadArea(objAjax, sectionName);    
    	
    	if(objAjax.isProcessComplete())
    	{
        	objHTMLData.resetChangeFields();
    	}
    	else
    	{	  	
    		retainSelectedRows(chngedRows);
    	}		
        bShowMsg= false;
    }
}

//Tracker 12621 -ISSUES ON BLANK RECORD OF TECH SPEC
//Moved this method from Colorlib.js to techspec.js
function showSample()
{
	TechSpec.show("showsample","sample.do");
}

//Tracker 12621 -ISSUES ON BLANK RECORD OF TECH SPEC
//Moved this method from Colorlib.js to techspec.js
function showBids()
{
	TechSpec.show("showbids","bids.do");
}


//Tracker 12621 -ISSUES ON BLANK RECORD OF TECH SPEC
//Moved this method from Colorlib.js to techspec.js
function showStandards()
{
    TechSpec.show("showStandards","standards.do");
}

//Tracker 12621 -ISSUES ON BLANK RECORD OF TECH SPEC
//Moved this method from Colorlib.js to techspec.js
function showTechSpecAttachments()
{
    TechSpec.show("attachments","techspecattachment.do");
}

// Tracker#:14435 ISSUE WITH SAVE PROMPT,SYSTEM DISPLAYS'PREVIOUS ACTION ENCOUNTERED ERROR'
// moved these function from colorlib.js
function showTechSpecView(view, pageNo, sec)
{
    Process.sendRequest(sec,"techspec.do", "HANDLEVIEW&pageNum="+pageNo+"&view="+view, _showTechspecLibPage);
}

function showProductOverview(obj)
{
	Process.showOverview(obj, "techspec.do", "TOOVERVIEW");
}

function sortTechSpecColumn(fieldName,sec,type, pageNo)
{
     Process.sendRequest(sec,"techspec.do", "SORT&sortColumn="+fieldName+"&sort="+type+"&pageNum="+pageNo, _techSpecShowPage);
}
function showProduct()
{
 	Process.execute("showProduct", "techspecoverview.do");
}

function _showTechspecLibPage(objAjax)
{
    //alert(" _showTechspecLibPage: \n sectionName "+sectionName);
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

    	/* Tracker#: 19807 - LEFT NAVIGATION NEEDS TO BE MADE COLLAPSIBLE
    	 * Issue - On Advanced Search, when changing search results view, the slider functions
    	 * were not being cleared out.
    	 * Fix - clear all registered toggle functions in toggleNav module. 
    	 */
    	if (_showWorkArea && _showWorkArea.toggleNav)
    	{
    		_showWorkArea.toggleNav.unRegisterAll();
    	}
        _reloadArea(objAjax, sectionName);
        bShowMsg= false;
    }
}

function deleteColorways()
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
   	var docview;
   	if(objAjax)
   	{
   		docview = objAjax.getDocViewId();
   		//alert("docview"+docview);
   		var htmlErrors = objAjax.error();

   		if(docview==14000)
   		{
   		    //implemented in the bomc.js method
   		    _deleteBOMCColorWay(htmlAreaObj, objAjax, objHTMLData);
   		    return;
   		}
   		if(docview==132)
   		{
   		     //Tracker#: 15802 TECH SPEC OVERVIEW SHOULD ALWAYS WARN USER WHEN THEY MAKE A CHANGE AND DO NOT SAVE
            //User edits the field data and without saving click on the 'Drop Colorways' button
            //Pop up the  message 'There are changes on the screen. Do you want to save changes before current action?'.
            if(objHTMLData!=null && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
            {
                var htmlErrors = objAjax.error();
                htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
                messagingDiv(htmlErrors, "saveTechSpec()", "continueDeleteClrWay()");
            }
            else
            {
                continueDeleteClrWay();
            }
         }
    }
}

function continueDeleteClrWay()
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();

    if(objAjax)
   	{
   		docview = objAjax.getDocViewId();
   		//alert("docview"+docview);
   		var htmlErrors = objAjax.error();

   		if(docview==132)
   		{
            if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
            {
                var htmlErrors = objAjax.error();
                objAjax.error().addError("warningInfo", szMsg_Sel_Clrway_Row, false);
                messagingDiv(htmlErrors);
                return;
            }
            // Tracker#: 13840 RESTORE MISSPELLED ON MESSAGE POP-UP
            // Calling confirm message by variable 'szMsg_Clrway_Restore_Confirm' to display.
   		    htmlErrors.addError("confirmInfo", "Do you want to delete Colorway(s)?",  false);
   		}
   		messagingDiv(htmlErrors,'deleteColorwayRecords()', 'cancelProcess()');
    }
}

//function to delete selected Colorways On product overview screen
function deleteColorwayRecords()
{
	var url = "deletecolorways";
	var docview;
	closeMsgBox();

	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objAjax.getDivSectionId();
    //alert("sectionName  " + sectionName);

    if(objAjax && objHTMLData)
    {
        docview = objAjax.getDocViewId();
        bShowMsg = true;
        if(docview==132)
        {
            objAjax.setActionURL("techspecoverview.do");
            objAjax.setActionMethod(url);
            objAjax.setProcessHandler(_defaultWorkAreaSave);
            objHTMLData.performSaveChanges(_defaultWorkAreaSave, objAjax);
            return;
        }
    }

}



// Tracker#:14435 changes closed here


//Tracker#:15549 PROCESS TO UPDATE COLORS ON SELL CHANNELS AFTER A TECH PACK IS ADOPTED
function applyColorsTOSC()
{
	TechSpec.show("applycolorstosc","techspecoverview.do");
}

function _techSpecShowPage(objAjax)
{
    //alert(" _techSpecShowPage: \n sectionName "+sectionName);
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

//Tracker#: 16207 INFORMATION IN EVENTS DETAIL LINES ARE SET BLANK WHEN USER NAVIGATE FROM SAMPLE TAB TO EVENT SCREEN
//It will be called when clicking 'Events' tab on Techspec screen.
function showTechspecEvents()
{
    TechSpec.show("view","techspecevents.do");
}

//Tracker#:14143/@since 2011R1 /Dec. 15th, 2010 - adding supplier and prim. matrl 
//delete processes.  Adding generic delete method where you can provide the method for
//the techspecoverview action class to execute, and the specific confirm message you
//want the user prompted with before going through with delete.  Other 8 delete processes
//could probably be removed as they all have the same code not including that provided in
//the parameters.
//Usage:  TechSpec.deleteAssocOrDtl("deletesuppliers", "Do you want to delete Material(s)?")
TechSpec.deleteAssocOrDtl = function (method, confirmMsg)
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();

    // Tracker#:12621 ISSUES ON BLANK RECORD OF TECH SPEC
    // Check for valid record to execute process.
    if(!isValidRecord(true))
    {
        return;
    }

   	//Tracker#: 15802 TECH SPEC OVERVIEW SHOULD ALWAYS WARN USER WHEN THEY MAKE A CHANGE AND DO NOT SAVE
	//User edits the field data and without saving click on the 'Delete Materials' button
	//Pop up the  message 'There are changes on the screen. Do you want to save changes before current action?'.
	if(objHTMLData!=null && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
    {
        var htmlErrors = objAjax.error();
        htmlErrors.addError("confirmInfo", szMsg_Changes,  false);

        /* Tracker#: 20263 - SAFARI & FIREFOX BROWSER: DELETE PRIMARY MATERIALS DOES NOT WORK
         * calling method of TechSpec namespace instead of global function by same name.
         */
        noSaveFunc = "\"TechSpec.continueDeleteAssocOrDtl(\'"+method+"\', \'"+confirmMsg+"\')\"";        
        messagingDiv(htmlErrors, "saveWorkArea()", noSaveFunc);
    }
    else
    {
    	/* Tracker#: 20263 - SAFARI & FIREFOX BROWSER: DELETE PRIMARY MATERIALS DOES NOT WORK
    	 * calling method of TechSpec namespace instead of global function by same name.
    	 */
    	TechSpec.continueDeleteAssocOrDtl(method, confirmMsg);
    }
}


//Tracker#:14143/@since 2011R1 /Dec. 15th, 2010
//Called from TechSpec.deleteAssocOrDtl if no non-chkbox changes to screen.
TechSpec.continueDeleteAssocOrDtl = function (method, confirmMsg)
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    var docview;

    if(objAjax)
   	{
   		docview = objAjax.getDocViewId();
   		//alert("docview"+docview);
   		var htmlErrors = objAjax.error();
   		if(docview==132)
   		{
            if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
            {
                var htmlErrors = objAjax.error();
                objAjax.error().addError("warningInfo", szMsg_Sel_Detail_Record, false);
                messagingDiv(htmlErrors);
                return;
            }
   		    htmlErrors.addError("confirmInfo", confirmMsg,  false);
   		}
   		
   		/* Tracker#: 20263 - SAFARI & FIREFOX BROWSER: DELETE PRIMARY MATERIALS DOES NOT WORK
   		 * calling method of TechSpec namespace instead of global function by same name.
   		 */
   		deleteFunc = "\"TechSpec.deleteAssocOrDtlRecords(\'"+method+"\')\"";
   		messagingDiv(htmlErrors, deleteFunc, 'cancelProcess()');
    }
}

//Tracker 12621 -ISSUES ON BLANK RECORD OF TECH SPEC
//Moved this method from Colorlib.js to techspec.js
//function to delete selected size info On product overview screen
//Tracker#:14143/@since 2011R1 /Dec. 15th, 2010
//Called from TechSpec.continueDeleteAssocOrDtl if chkbox is checked and user confirms.
TechSpec.deleteAssocOrDtlRecords = function (method)
{
	var docview;
	closeMsgBox();

	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objAjax.getDivSectionId();
    //alert("sectionName  " + sectionName);
    if(objAjax && objHTMLData)
    {
        docview = objAjax.getDocViewId();
        //alert("docview: "+docview);
        //alert("inside calling");
        bShowMsg = true;
        if(docview==132)
        {
            objAjax.setActionURL("techspecoverview.do");
            objAjax.setActionMethod(method);
            objAjax.setProcessHandler(_techspec_postprocess);
            objHTMLData.performSaveChanges(_techspec_postprocess, objAjax);
            return;
        }
     }
}

//Tracker#:18321 ADD NEW PROCESS ADOPTWITHCOLOROFFERS ON TECHSPECOVERVIEW
function _applyCOlors()
{
    var url = "applycolors";
 	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	sectionName = objAjax.getDivSectionId();
    
    if(!isValidRecord(true))
    {
        return;
    }

    //alert("sectionName2  " + sectionName);
    if(objAjax && objHTMLData)
    {
        bShowMsg = true;
        var docview = objAjax.getDocViewId();
       	loadWorkArea("techspecoverview.do", url);
       	objAjax.setActionMethod(url);
        objAjax.setProcessHandler(_showListPage);
        objHTMLData.performSaveChanges(_showListPage, objAjax);       
    }
}

//Tracker#19066 SMART COPY (PCR 61) - ABILITY TO EDIT THE COPY FROM SCREEN
//Moved chooseSCMode, showSCToNew, showSCFromExisting and showSCSearch functions from main.js
function chooseSCMode(obj, valId)
{
	//alert("in choosescmode. obj.length="+obj.length);
	var mode;
    for (i=0; i < obj.length; i++)
    {
        if (obj[i].checked == true)
        {
            mode = obj[i].value;
        }
    }
    //alert("mode is: "+mode);
    if (mode == "1")
    	{
    	    showSCToNew();
    	}
    else if (mode == "2")
    	{
    	    showSCSearch(valId);
    	}
}

function showSCToNew()
{
    req = createXMLHttpRequest();
    if (req)
    {
    	req.open("GET", "techspecoverview.do?method=showsctonew", true);
        req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
 	    req.onreadystatechange=function() {
        if(req.readyState == 4)
        	{
            	if (req.status == 200)
            	{
            		// Invoke SessionManagement.resetSessionTime() to reset session counter.
                	SessionManagement.resetSessionTime();
                	
            		showMsg2(req.responseText, false);
                    draggable = $( "#showMsg" ).draggable();

            	}
            }
         }
         req.send(null);
    }
}


function showSCFromExisting(rowValues)
{
	var reqNo = '';
    if(rowValues != null && rowValues.length > 0)
    {
        reqNo = rowValues[0];
    }
    req = createXMLHttpRequest();
    if (req)
    {
    	req.open("GET", "techspecoverview.do?method=showscfromexisting&request_no="+reqNo, true);
        req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
 	    req.onreadystatechange=function() {
        if(req.readyState == 4)
        	{
            	if (req.status == 200)
            	{
            		// Invoke SessionManagement.resetSessionTime() to reset session counter.
                	SessionManagement.resetSessionTime();
                	
            		showMsg2(req.responseText, false);
                    draggable = $( "#showMsg" ).draggable();
            	}
            }
         }
         req.send(null);
    }
}

function showSCSearch(valId)
{
	closeMsg();
    var searchControl = new VALIDATION.SearchControl(null, false, null, 'validationsearch.do?valId='+valId+'&codeFldName=null&showDesc=N&sectionId=0&rowNo=0&actRowNo=0');
    searchControl.setOnBeforeSinglePost(showSCFromExisting);
    searchControl.showPopup();
}

//Tracker#:19140
//Called when 'create `le(s)' process on tech spec is executed 
function createLinkedStyles()
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
	//alert("htmlAreaObj " + htmlAreaObj);
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();

    //Check if the record is valid, before executing the process.
    if(!isValidRecord(true))
    {
        return;
    }
   
	//User edits the field data and without saving click on the 'Create Linked Styles' button
	//Pop up the  message 'There are changes on the screen. Do you want to save changes before current action?'.
	if(objHTMLData!=null && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
    {
        var htmlErrors = objAjax.error();
        htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
        messagingDiv(htmlErrors, "saveTechSpec()", "continueCreateLinkedStyles()");
    }
    else
    {
        continueCreateLinkedStyles();
    }
}

//Tracker#:19140
function continueCreateLinkedStyles()
{
    closeMsgBox();
    var htmlAreaObj = _getWorkAreaDefaultObj();
	//alert("htmlAreaObj " + htmlAreaObj);
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	var actMethod ="linkedstylepopup";
	
    if(objAjax)
    {
    	var htmlfldName = htmlAreaObj.getDivSectionId();
    	//alert("showView : objAjax "  + objAjax.getDocViewId());
    	//alert("htmlfldName"  + htmlfldName);
    	_startSmartTagPopup(htmlfldName, false, null, true);
        objAjax.setActionURL("techspecoverview.do");
        objAjax.setActionMethod(actMethod);
        objAjax.attribute().setAttribute("htmlfldName", htmlfldName);
        objAjax.setProcessHandler(_showLinkedStyleSmartTagInteractivePopup);
        //alert("sending");
        objAjax.sendRequest();
    }
}

function _showLinkedStyleSmartTagInteractivePopup(objAjax)
{
    if(objAjax)
    {
        //display the user message when drop downs are not loaded
        _displayProcessMessage(objAjax);
        ////Tracker#:12867 - OUTSTANDING TECH SPEC>MASS REPLACE ISSUES
        // not to show the smart tag if error occures
        if(!objAjax.isProcessComplete())
        {    
            _closeSmartTag();
            Main.resetDefaultArea();
        }
        else
        {
            _showSmartTagPopup(objAjax);
        }
    }
}

//Tracker#:19140
//Called when 'create' button on  linked style(s) popup is clicked 
function techSpecLinkedStyles(divid)
{	
	var htmlAreaObj = _getAreaObjByDocView(divid);	
	hide("_createPopUpDiv");
	hide("_popupDIV");
	if(htmlAreaObj)
	{
		var actMethod = "createlinkedstyles";
		var objAjax = htmlAreaObj.getHTMLAjax();
		var objHTMLData = htmlAreaObj.getHTMLDataObj();
		
		sectionName = objAjax.getDivSectionId();
		//alert("_showSampleTabView \n sectionName  " + sectionName);
	    if(objAjax && objHTMLData)
	    {	    	
	    	//alert("getChangeFields : "+ objHTMLData.getChangeFields());
	    	bShowMsg = true;
	        objAjax.setActionMethod(actMethod);
	        objAjax.setActionURL("techspecoverview.do");
	        objAjax.setProcessHandler(_techSpecLStylePostBack);
	        objHTMLData.appendAllCustomContainerDataToRequest(objAjax, divid);
	        objAjax.parameter().add(_screenChangeFileds, objHTMLData.getSaveChangeFields());
        	objHTMLData._appendAllContainerDataToRequest(objAjax);        	
        	objAjax.sendRequest();        	
	    }
    }
}

//Tracker#:19140
function _techSpecLStylePostBack(objAjax)
{
    if(objAjax.isProcessComplete())
    {   
        _closeSmartTag();
        _showWorkArea(objAjax);
    }
    else
    {
        //alert("show mesage");
    	//unhide the hidden popup divs
    	document.getElementById("_popupDIV").style.visibility="visible";
    	document.getElementById("_createPopUpDiv").style.visibility="visible";
        _displayProcessMessage(objAjax);
    }
}

//Tracker#:19231
//Called onClick of the link icon on tech spec over view screen.
function _displayLikedStyles()
{	
	var htmlAreaObj = _getWorkAreaDefaultObj();
	//alert("htmlAreaObj " + htmlAreaObj);
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	var actMethod ="searchlinkedstyles";
	
    if(objAjax)
    {
    	var htmlfldName = htmlAreaObj.getDivSectionId();
    	//alert("showView : objAjax "  + objAjax.getDocViewId());
    	//alert("htmlfldName"  + htmlfldName);
    	_startSmartTagPopup(htmlfldName, false, null, true);
        objAjax.setActionURL("techspecoverview.do");
        objAjax.setActionMethod(actMethod);
        objAjax.attribute().setAttribute("htmlfldName", htmlfldName);
        objAjax.setProcessHandler(_showSmartTagInteractivePopup);
        //alert("sending");
        objAjax.sendRequest();
    }
} 

//Tracker#:19231
//Called onClick of the link/unlink icon on the linked list popup screen.
function _linkUnlinkStyles(reqno, linkstatus, styleType, reqUrl)
{	
	//alert("StyleType="+styleType);
	//alert("linkstatus="+linkstatus);
	if(styleType == "P")
	{
		var objUserMessge = getElemnt("hdnParentUserMessage");
		var msg = szMsg_unlink_parentstyle;
		if(objUserMessge)
		{
			msg = objUserMessge.value;
		}		
		//alert("msg="+msg);
		var htmlErrors = new htmlAjax().error();
    	htmlErrors.addError("confirmInfo", msg,  false);
    	messagingDiv(htmlErrors,"continuelinkUnlinkStyles('"+reqno+"','"+linkstatus+"','"+styleType+"','"+reqUrl+ "')", "cancelProcess()");
	}
	else if(linkstatus == "true")
	{	
		var objUserMessge = getElemnt("hdnChildUserMessage");
		var msg = szMsg_unlink_childstyle;
		if(objUserMessge)
		{
			msg = objUserMessge.value;
		}		
		//alert("msg="+msg);
		var htmlErrors = new htmlAjax().error();
    	htmlErrors.addError("confirmInfo", msg,  false);
    	messagingDiv(htmlErrors,"continuelinkUnlinkStyles('"+reqno+"','"+linkstatus+"','"+styleType+"','"+reqUrl+ "')", "cancelProcess()");		
	}
	else
	{		
		continuelinkUnlinkStyles(reqno, linkstatus, styleType, reqUrl);
	}
}
//Tracker#:19231
function continuelinkUnlinkStyles(reqno, linkstatus, styleType, reqUrl)
{
	hide("_createPopUpDiv");
	hide("_popupDIV");
	var htmlAreaObj = _getWorkAreaDefaultObj();
	//alert("htmlAreaObj " + htmlAreaObj);
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	var actMethod ="linkunlinkstyles&reqno="+reqno+"&linkStatus="+linkstatus+"&styleType="+styleType;
	
	if(objAjax)
    {    	
    	var htmlfldName = htmlAreaObj.getDivSectionId();
        objAjax.setActionURL("techspecoverview.do");
        objAjax.setActionMethod(actMethod);         
        objAjax.attribute().setAttribute("htmlfldName", htmlfldName);         
        objAjax.attribute().setAttribute("linkstatus", linkstatus);             
        objAjax.attribute().setAttribute("styleType", styleType);           
        objAjax.attribute().setAttribute("reqUrl", reqUrl);           
        objAjax.attribute().setAttribute("reqno", reqno); 
       	objAjax.setProcessHandler(_showSmartTagLnkStyleInteractivePopup);
		//alert("sending");
        objAjax.sendRequest();
    } 
}

//Tracker#:19231
function _showSmartTagLnkStyleInteractivePopup(objAjax)
{
    if(objAjax)
    {       
        if(objAjax.isProcessComplete())
        {         	
        	closeMsgBox();
            var htmlfldName = objAjax.attribute().getAttribute("htmlfldName"); 
            var reqUrl = objAjax.attribute().getAttribute("reqUrl");
            var linkstatus = objAjax.attribute().getAttribute("linkstatus");
            var styleType = objAjax.attribute().getAttribute("styleType");
            var reqno = objAjax.attribute().getAttribute("reqno");
            _startSmartTagPopup(htmlfldName, false, null, true);
            _showSmartTagPopup(objAjax);
            var titleImg = document.getElementById("titleIcon");
            
            if(reqno == titleImg.keyinfo)
            {
            	if(styleType == "P")
				{
					titleImg.src=reqUrl+"/images/unlink.gif";
				}
				else if(styleType == "C")
				{
				  if(linkstatus == "true")
				  {
				  	titleImg.src=reqUrl+"/images/unlink.gif";
				  }
				  else
				  {
				  	titleImg.src=reqUrl+"/images/link.gif";
				  }				  
				}
            }
        }
        else
        {
        	//unhide the hidden popup divs
        	document.getElementById("_popupDIV").style.visibility="visible";
        	document.getElementById("_createPopUpDiv").style.visibility="visible";
        	//display the user message
        	_displayProcessMessage(objAjax);
        }
    }
}

//Tracker#:19231
function _reloadTechSpec(objAjax)
{
	if(objAjax)
    {       
        if(objAjax.isProcessComplete())
        { 
	 		 
	         _closeSmartTag();
	        _showWorkArea(objAjax);
	    }
        else
        {
        	//display the user message
        	_displayProcessMessage(objAjax);
        }
    }        
}

function saveBOMC()
{
	_verifylinkedfieldsModified("bomc.do", _continueSave);
}

function saveTechSpecAttachments()
{
	_verifylinkedfieldsModified("techspecattachment.do", _continueSave);
}

function saveInstruction()
{
	_verifylinkedfieldsModified("instruction.do", _continueSave);
}

function saveStandards()
{
	_verifylinkedfieldsModified("standards.do", _continueSave);
}


function saveDesignIntent()
{
	_verifylinkedfieldsModified("designintent.do", _continueSave);
}


function saveConstruction()
{
	_verifylinkedfieldsModified("construction.do", _continueSave);
}

function saveTechSpec()
{
	//Traclker#:26296 TECH SPEC SHARING: ISSUES WITH POST SAVE RULE HOOK
	 closeMsgBox();
	_verifylinkedfieldsModified("techspecoverview.do", _continueSave);
}


function _verifylinkedfieldsModified(actionURL, saveHandler)
{
	//todo identify the proper area object based on doc view id
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objHtmlData = htmlAreaObj.getHTMLDataObj();
    var docviewid = htmlAreaObj.getDocViewId();
    var url = "verifylinkedfields"; 
    
    if(objHtmlData!=null && objHtmlData.hasUserModifiedData()==true)
    {
        var objAjax = new htmlAjax();
		//alert("techspec.js _verifylinkedfieldsModified inside");
		bShowMsg = true;
		objAjax.setActionURL(actionURL);
		objAjax.setActionMethod(url);
		objAjax.parameter().add(_screenChangeFileds, objHtmlData.getSaveChangeFields());
		objAjax.attribute().setAttribute("htmlData", objHtmlData);
		objAjax.setProcessHandler(saveHandler);		
		try
		{
			if(actionURL=="bomc.do")
			{
				_appendBOMCScreenInfo(objAjax);	
			}						
		}
		catch(e){}
		
		objAjax.sendRequest();
		return;
    }
    else
    {
    	var objAjax = new htmlAjax();
    	objAjax.error().addError("warningInfo", szMsg_No_change, false);
    	_displayProcessMessage(objAjax);
    }    
}


function _continueSave(objAjax)
{
	if(objAjax != null)
	{
		var message = objAjax.getResponseHeader("ulinkConfirmMsg");
		var objHtmlData = objAjax.attribute().getAttribute("htmlData");
		//alert("message before"+objAjax.parameter().getParameterByName('hdn_expand_sec_code'));
		if(message != null && message !="" && message.length>0)
		{			
			var htmlErrors = objAjax.error();		
			htmlErrors.addError("confirmInfo", message,  false);
			//alert("htmlErrors"+htmlErrors);
			messagingDiv(htmlErrors,"objHtmlData.performSaveChanges(_defaultWorkAreaSave_scroll)", "cancelProcess()");
		}
		else
		{	
			objHtmlData.setAppendContainerData(true);
			objHtmlData.performSaveChanges(_defaultWorkAreaSave_scroll);
			AutoSuggestContainer.clearComponents();
		}
	}
}

//Tracker 12621 -ISSUES ON BLANK RECORD OF TECH SPEC
//Moved this method from Colorlib.js to techspec.js
function addcolorwayimages()
{

	var htmlAreaObj = _getWorkAreaDefaultObj();	
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();

    //Check if the record is valid, before executing the process.
    if(!isValidRecord(true))
    {
        return;
    }
    
      	
	//Pop up the  message 'There are changes on the screen. Do you want to save changes before current action?'.
	if(objHTMLData!=null && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
    {
        var htmlErrors = objAjax.error();
        htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
        messagingDiv(htmlErrors, "saveWorkArea()", "continueAddcolorwayimages()");
    }
    else
    {
    	continueAddcolorwayimages();
    }
}

function continueAddcolorwayimages()
{
	var url = "addcolorwayimages";
	loadWorkArea("techspecattachment.do", url);	
	
}

/**
 *  FDD551- MULTI-WINDOW VIEW ON TECH SPEC WITHOUT POM
 *  
 *  Call to open Multi Window screen in Tech Spec overview screen.
 */
function _techspec_openmultipom()
{
	_plmpom_openmultipom();
}

/**
 * Tracker#:25701 582 - Add Shared Advanced Tech Spec Search.
 * This method displays the Tech spec Search List View screen once the user seaches for Tech Specs
 * 
 * */

function _showTechSpecListScreen(objAjax)
{
	
	 var url="HANDLEVIEW";
	 if(objAjax)
	{
		 bShowMsg=true;
		 loadWorkArea("techspec.do",url);		 
	}	 
}

/**
 * Tracker#:25699 582 - Add Sharing Tab To The Tech Pack Overview.
 * This method displays the Tech spec Sharing screen once the user clicks on Sharing tab of Tech Spec Overview screen
 * 
 * */
function showTechSpecShare()
{
    closeMsgBox();
    var htmlAreaObj=_getWorkAreaDefaultObj();
    var objAjax=htmlAreaObj.getHTMLAjax();
    var objHTMLData=htmlAreaObj.getHTMLDataObj();
    var url="shaowpalettesharing";
    
    if(objAjax)
    {
    	if(!isValidSharingRecord(true))
    	{
    	  return;
    	}
    if(objHTMLData!=null && objHTMLData.isDataModified())
    {
    	var htmlErrors = objAjax.error();
        htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
        noSaveFunc = "\"Main.loadWorkArea(\'"+"paletteshare.do"+"\', \'"+url+"\')\"";     
        messagingDiv(htmlErrors, "saveTechSpec()", noSaveFunc); 
    }
    else
    {
        loadWorkArea("paletteshare.do",url);	
    }
 }
}
/**
 * Tracker#:25701 582 - Add Shared Advanced Tech Spec Search.
 * This method displays the Tech Spec List and its corresponding layout information
 */
function _showTechSpecList()
{
	
	Process.execute("HANDLEVIEW&viewtype=TECHSPECLIST", "techspec.do");
}
/**
 * Tracker#:25701 582 - Add Shared Advanced Tech Spec Search.
 * This method displays the Tech Spec Sharing List and its corresponding layout information
 */
function _showSharedTechSpecList()
{
	
	 Process.execute("HANDLEVIEW&viewtype=SHARINGLIST", "techspec.do");
}

/**
 * The Mass Sharing of the Tech Spec from the Tech Spec Advanced Search is on hold & will be part of future release
 * This method displays an warning message if no Tech Spec is selected. Calls the method to display the Add Suppliers pop up 
 */
function _addSuppliersForTS()
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
 	 
   if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
    {
        var htmlErrors = objAjax.error();
        objAjax.error().addError("warningInfo", szMsg_Sel_Tech_Spec, false);
        messagingDiv(htmlErrors);
        return;
    }
   
    _addSuppliersForTSPopup("addsuppliers");
}
/**
 * The Mass Sharing of the Tech Spec from the Tech Spec Advanced Search is on hold & will be part of future release
 * This method displays the Add Suppliers Pop up screen when the user clicks on Add Suppliers button on Tech Spec Advanced Search
 */
function _addSuppliersForTSPopup(actMethod)
{
    closeMsgBox();
    var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();

 	//var actMethod ="addsuppliers";
    if(objAjax)
    {
    	var htmlfldName = htmlAreaObj.getDivSectionId();
    	_startSmartTagPopup(htmlfldName, false, null, true);
        objAjax.setActionURL("techspec.do");
        objAjax.setActionMethod(actMethod);
        //Tracker#:14804 SIMPLE SAMPLE  - ABILITY TO SELECT MATERIAL
        //Set parentchange field to read the selected material no the tech spec at server side.
        objAjax.parameter().add(_parentScreenChgFields, objHTMLData.getSaveChangeFields());
        objAjax.attribute().setAttribute("htmlfldName", htmlfldName);
        objAjax.setProcessHandler(_showSmartTagInteractivePopup);       
        objAjax.sendRequest();
    }
}

/**
 * The Mass Sharing of the Tech Spec from the Tech Spec Advanced Search is on hold & will be part of future release
 * This method  handles the process when a user clicks on Add Suppliers pop up Save button on Tech Spec Advanced Search
 */
function _saveSupplierForTS(divid)
{
	var htmlAreaObj = _getAreaObjByDocView(divid);
	var htmlWrkAreaObj = _getWorkAreaDefaultObj();
	if(htmlAreaObj && htmlWrkAreaObj)
	{
		var actMethod = "saveSupplier";
		var objAjax = htmlAreaObj.getHTMLAjax();
		var objHTMLData = htmlAreaObj.getHTMLDataObj();
		var parentobjHTMLData = htmlWrkAreaObj.getHTMLDataObj();

		sectionName = objAjax.getDivSectionId();
		
	    if(objAjax && objHTMLData)
	    {
	    	if(objHTMLData!=null && objHTMLData.isDataModified()==false)
    		{
				var htmlErrors = objAjax.error();
				objAjax.error().addError("warningInfo", szMsg_No_change, false);
				messagingDiv(htmlErrors);
				return;
			}
	    	var htmlfldName = htmlWrkAreaObj.getDivSectionId();
	    	
	    	bShowMsg = true;
	        objAjax.setActionMethod(actMethod);
	        objAjax.setActionURL("techspec.do");
	        objAjax.setProcessHandler(_postSaveSupplierForTS);
	        objHTMLData.appendAllCustomContainerDataToRequest(objAjax, divid);
	        objAjax.parameter().add(_parentScreenChgFields, parentobjHTMLData.getSaveChangeFields());
	        objAjax.parameter().add(_screenChangeFileds, objHTMLData.getSaveChangeFields());
        	objHTMLData._appendAllContainerDataToRequest(objAjax);
        	//_startSmartTagPopup(htmlfldName, false, null, true);
        	objAjax.sendRequest();
        	
        	if(objAjax.isProcessComplete())
        	{
            	objHTMLData.resetChangeFields();
        	}
	    }
    }
}

/**
 * The Mass Sharing of the Tech Spec from the Tech Spec Advanced Search is on hold & will be part of future release
 * This method  handles the process when a user clicks on Add Suppliers pop up Share button on Tech Spec Advanced Search
 */

function _shareTechSpecsForTS(divid)
{
	var htmlAreaObj = _getAreaObjByDocView(divid);
	var htmlWrkAreaObj = _getWorkAreaDefaultObj();
	if(htmlAreaObj && htmlWrkAreaObj)
	{
		var actMethod = "addsuppliersshare";
		var objAjax = htmlAreaObj.getHTMLAjax();
		var objHTMLData = htmlAreaObj.getHTMLDataObj();
		var parentobjHTMLData = htmlWrkAreaObj.getHTMLDataObj();

		sectionName = objAjax.getDivSectionId();
		
	    if(objAjax && objHTMLData)
	    {
	    	if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
    		{
				var htmlErrors = objAjax.error();
				objAjax.error().addError("warningInfo", szMsg_Sel_Detail_Record, false);
				messagingDiv(htmlErrors);
				return;
			}
	    	var htmlfldName = htmlWrkAreaObj.getDivSectionId();
	    	
	    	bShowMsg = true;
	        objAjax.setActionMethod(actMethod);
	        objAjax.setActionURL("techspec.do");
	        objAjax.setProcessHandler(_postShareTechSpecsForTS);
	        objHTMLData.appendAllCustomContainerDataToRequest(objAjax, divid);
	        objAjax.parameter().add(_parentScreenChgFields, parentobjHTMLData.getSaveChangeFields());
	        objAjax.parameter().add(_screenChangeFileds, objHTMLData.getSaveChangeFields());
        	objHTMLData._appendAllContainerDataToRequest(objAjax);
        	//_startSmartTagPopup(htmlfldName, false, null, true);
        	objAjax.sendRequest();
        	if(objAjax.isProcessComplete())
        	{
        		objHTMLData.resetChangeFields();
        	}
	    }
    }
}

/**
 * The Mass Sharing of the Tech Spec from the Tech Spec Advanced Search is on hold & will be part of future release
 * This method  handles the process when Supplier is saved and the page gets refreshed on Tech Spec Advanced Search
 */

function _postSaveSupplierForTS(objAjax)
{
   if(objAjax.isProcessComplete())
    {
        _closeSmartTag();
        _addSuppliersForTSPopup("addsuppopup_refresh");
        _showWorkArea(objAjax);
    }
    else
    {        
        _displayProcessMessage(objAjax);
    }
}
/**
 * The Mass Sharing of the Tech Spec from the Tech Spec Advanced Search is on hold & will be part of future release
 * This method  handles the message display when Supplier is shared on Tech Spec Advanced Search
 */
function _postShareTechSpecsForTS(objAjax)
{
   if(objAjax.isProcessComplete())
    {
        _closeSmartTag();
        _showWorkArea(objAjax);
    }
    else
    {
        _displayProcessMessage(objAjax);
    }
}

/**
 * Tracker#:25619 588 - CREATE REQUEST SAMPLE PROCESS ON SAMPLE REQUEST SCREEN 
 * This method is called when user clicks on Request Sample process of Sample Request screen
 */
function reqsample()
{
    var url = "reqsample";
 	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
   
	if(objAjax && objHTMLData)
    {    	
    	if(objHTMLData!=null && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
        {
            var htmlErrors = objAjax.error();
            htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
            messagingDiv(htmlErrors, "saveWorkArea()", "continueSampleProcess(\'"+url+"\')");
        }
        else
        {
            continueSampleProcess(url);
        }
    }	
} 

	 
/**
 * Tracker#:25699 582 - Add Sharing Tab To The Tech Pack Overview.
 * This method handles the Tech spec Sharing process once the user clicks on Delete button from More Actions of Tech Spec Sharing screen
 * 
 * */
function sharingDeleteProcess(url, method, isAdvSearchScreen, overviewScrAndDtlReq, confirmMsg, cancelMethod)
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
				
				if(objHTMLData!=null && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
		        {
					var htmlErrors = objAjax.error();
					htmlErrors.addError("confirmInfo", szMsg_Changes,  false);			    
					var cfmFunc = "saveWorkArea()";
					var cancelFunc = "\"sharingDelete(\'"+url+"\', \'"+cancelMethod+"\', \'"+method+"\', "+isAdvSearchScreen+", \'"+confirmMsg+"\', "+overviewScrAndDtlReq+")\"";            
					
					messagingDiv(htmlErrors, cfmFunc, cancelFunc);
		        }
				else
				{
					sharingDelete(url,cancelMethod,method,isAdvSearchScreen,confirmMsg,overviewScrAndDtlReq); 
				}
		}
	}
}
/**
 * Tracker#:25699 582 - Add Sharing Tab To The Tech Pack Overview.
 * This method handles the Tech spec Sharing process once the user clicks on UnShare button from More Actions of Tech Spec Sharing screen
 * 
 * */
function sharingProcess(url, method, isAdvSearchScreen, overviewScrAndDtlReq)
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
    		if(!checkIsRecordSelected(objHTMLData, objAjax))
			{
				return;
			}
        	
    		if(objHTMLData!=null && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
		    {
			    var htmlErrors = objAjax.error();
			    htmlErrors.addError("confirmInfo", szMsg_Changes,  false);			  
			    var cfmFunc = "saveWorkArea()";		   	   
	            var cancelFunc = "\"shareTechSpecProcess(\'"+url+"\', \'"+method+"\')\"";	     
	           
	            messagingDiv(htmlErrors, cfmFunc, cancelFunc);
	            
		    }
        		
        	else
			{
        		shareTechSpecProcess(url,method);
			}
    	}
    }   
}   
/**
 * Tracker#:25699 582 - Add Sharing Tab To The Tech Pack Overview.
 * This method handles the Tech spec Sharing process once the user clicks on Delete button from More Actions of Tech Spec Sharing screen
 * 
 * */
function sharingDelete(url,cancelMethod,method,isAdvSearchScreen,confirmMsg,overviewScrAndDtlReq)
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var htmlErrors = objAjax.error();
    htmlErrors.addError("confirmInfo", confirmMsg,  false);     
    var cfmFunc = "\"executeDocumentProcess(\'"+url+"\', \'"+method+"\', "+isAdvSearchScreen+", "+overviewScrAndDtlReq+")\"";
    var cancelFunc = "\"executeDocumentProcess(\'"+url+"\', \'"+cancelMethod+"\', "+isAdvSearchScreen+", "+overviewScrAndDtlReq+")\"";
    messagingDiv(htmlErrors, cfmFunc, cancelFunc);
}
/**
 * Tracker#:25699 582 - Add Sharing Tab To The Tech Pack Overview.
 * This method handles the Tech spec Sharing & Unsharing process once the user clicks on Share or Unshare button from More Actions of Tech Spec Sharing screen
 * 
 * */
function shareTechSpecProcess(url,method)
{	
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	
	objAjax.setActionURL(url);
	objAjax.setActionMethod(method);
	objAjax.setProcessHandler(showDocumentPage);
	objHTMLData.performSaveChanges(showDocumentPage, objAjax);

	if(objAjax.isProcessComplete())
	{
    	objHTMLData.resetChangeFields();
	}
}

/**
 * Tracker#:25699 582 - Add Sharing Tab To The Tech Pack Overview.
 * This method handles navigation flow from tech spec tabs to tech spec sharing tab
 * 
 * */
function isValidSharingRecord(displayMessage)
{
    return _checkIsValidRecord("_isValidTechSpec", true, szMsg_Invalid_TechSepc);
}
