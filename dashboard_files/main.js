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
/*
	**
	Common APIs managing Main screen.
	@author Vijay Kumar A
*/

var workAreaDivsList = new Array();

// copied from comfun.js
var szMsg_Sel_A_Row         = 'Please select one or more attachment rows.'
var szMsg_Sel_Sample_Row    = 'Please select one or more Sample rows.'
var szMsg_Sel_Sample_A_Row  = 'Please select only one Sample row.'
var szMsg_Sel_A_Row         = 'Please select only one detail row.'
var szMsg_Sel_Color         = 'Please select color(s).';
var szMsg_Sel_Submit        = 'Please select Submit(s).';
var szMsg_Sel_Color1        = 'Please select one color.';
var szMsg_Sel_Palette       = 'Please select palette(s).';
var szMsg_Sel_Material      = 'Please select material(s).';
var szMsg_Sel_Model         = 'Please select model(s).';
// Tracker#: 12465 THE MESSAGEING UPON INVOKING: ACTION>INACTIVE IN THE COLOR LIBRARY NEEDS TO BE UPDATED.
// modified the message so that (s) should not go next line from associated word.
// Tracker#:17505-remove the usage check msg
var szMsg_CL_Inactive_Confirm = 'Do you want to make color(s) Inactive?';
// Tracker#: 13595 MODIFY THE WARNING PROMPT ON COLOR PREDELETE
var szMsg_CL_Delete_Confirm = 'Do you want to delete the color(s)?';
var szMsg_Sel_Clrway_Row    = 'Please select the Colorway(s) to delete';
var szMsg_Sel_SizeInfo_Row  = 'Please select the Size Range(s) to delete';
var szMsg_Sel_Treatment_Row = 'Please select the Treatment(s) to delete';
var szMsg_Sel_Material_Row  = 'Please select the Material(s) to delete';
var szMsg_Sel_Component_Row = 'Please select the Component(s) to delete';
var szMsg_Sel_Bids          = 'Please select one or more Bids.';
var szMsg_Sel_BidToCopy     = 'Please select a Bid to copy.';
var szMsg_Sel_Artwork       = 'Please select artwork(s).';
var szMsg_Sel_Commit_No_Row = 'Please select the Component(s) to remove Commit No';

//Tracker#:16096 - creating generic select a detail record message for use with generic functions in screenutils.js
var szMsg_Sel_Detail_Record = 'Please select one or more rows.';

//Tracker#: 16295 REINSTATE DROPPED COLORS ON COLOR PALETTE
var szMsg_sel_Dropped_Color = 'Please select dropped color(s)';
var szMsg_sel_Dropped_Artwork = 'Please select dropped artwork(s)';
var szMsg_sel_only_Dropped_Color = 'Please select only dropped color(s)';
var szMsg_sel_only_Dropped_Artwork = 'Please select only dropped artwork(s)';
// Tracker#:17505-remove the usage check msg
var szMsg_ArtworkL_Inactive_Confirm = 'Do you want to make Artwork(s) Inactive?';
// Tracker#: 12465 THE MESSAGEING UPON INVOKING: ACTION>INACTIVE IN THE COLOR LIBRARY NEEDS TO BE UPDATED.
// moved the message from artworklig.js to here and modified the message so that (s) should not go next line from associated word.
var szMsg_ArtworkL_Delete_Confirm = 'Do you want to delete the Artwork(s)?'
var szMsg_Sel_std_int_Row = 'Please select the Design Intents(s) to delete';
var szMsg_Sel_DropClrway_Row    = 'Please select the Colorway(s) to drop';
var szMsg_Sel_RestoreClrway_Row    = 'Please select the Colorway(s) to restore';
// Tracker#: 13840 RESTORE MISSPELLED ON MESSAGE POP-UP
// Creating confirm message with correct spelling of 'restore'.
var szMsg_Clrway_Restore_Confirm= 'Do you want to restore the Colorway(s)?';
var szMsg_Sel_Supplier_Row  = 'Please select the supplier(s) to process';
// Tracker#:12621 ISSUES ON BLANK RECORD OF TECH SPEC
// Display "not valid record" alert message while navigating to different tabs on Tech Spec scrren.
var szMsg_Invalid_TechSepc = "Not a valid Tech Spec record";
// Tracker#:14435 ISSUE WITH SAVE PROMPT,SYSTEM DISPLAYS'PREVIOUS ACTION ENCOUNTERED ERROR'
// For blank records on click of tabs, message should be given without going in to screen.
var szMsg_Invalid_ColorLib = "Not a valid Color Library record";

var szMsg_Invalid_Palette = "Not a valid Color Palette record";

var szMsg_Invalid_Artwork = "Not a valid Artwork Library record";

var szMsg_Invalid_Material = "Not a valid Material Library record";

//Tracker#:16096 - used in gridpanel.js for applying dragdrop materials
var szMsg_Invalid_Material_Palette = "Not a valid Material Palette record";

//Tracker#: 14898 IMPLEMENT SEASONAL CALENDAR FUNCTIONALITY
var szMsg_SeasonalCal_Delete_Confirm = 'Do you want to delete Seasonal Calender ?';
var szMsg_SeasonalCal_Events_Delete_Confirm = 'Do you want to delete Event detail(s)?'

//Tracker#: 16344 MATERIAL QUOTE: ADD 2 NEW PROCESSES: REFRESH AND DELETE
var szMsg_MaterialQuote_Delete_Confirm = 'Do you want to delete entire record ?';
var szMsg_MaterialQuote_Offer_Delete_Confirm = 'Do you want to delete selected detail(s)?';

//Tracker#: 15855 CREATE A NEW MATERIAL PROJECTIONS DOCUMENT
var szMsg_Mat_Proj_Delete_Confirm = 'Do you want to delete the Projection group (or the selected projections in the group)?';
//Tracker#12635 ISSUES ON BLANK RECORD OF SUBMITS
var szMsg_Invalid_Submit = "Not a valid Submit record";

//Tracker#: 16207 INFORMATION IN EVENTS DETAIL LINES ARE SET BLANK WHEN USER NAVIGATE FROM SAMPLE TAB TO EVENT SCREEN
var szMsg_Events_Delete_Confirm = 'Do you want to delete Event?';
var szMsg_EventDetails_Delete_Confirm = 'Do you want to delete Event detail(s)?';
//Tracker#:16274
var szMsg_Selct_Pom_codes = 'Please select POM Code(s).';
var szMsg_Select_Pom_codestoDelete = 'Please select the POM Code(s) to delete.';
var _screenChangeFileds     = 'chgflds';       ////Tracker#: 16147 REQUEST SAMPLE POP-UP SCREEN DOES NOT CLOSE AFTER CREATING SAMPLE(S)
var _parentScreenChgFields  = 'parentchgflds';
//end comfun.js
//Tracker#: 18625 f8 - ability to create a capacity projections record
var szMsg_Cap_Proj_Delete_Confirm = 'Do you want to delete the Capacity Projections record?';
var szMsg_Cap_Proj_sel_Delete_Confirm = 'Do you want to delete the selected projection(s)?';

//Tracker#: 18915 F4 - ADD NEW VENDOR/FACTORY CAPACITY DOCUMENT
var szMsg_Capacity_Delete_Confirm = 'Do you want to delete the Capacity record ?';

// Tracker#: 21328 MOVE PARTY SCREEN TO NEW FRAMEWORK UNDER NEW TAB VENDOR MANAGEMENT
// User confirmation for Party delete.
var szMsg_Party_Delete_Confirm = 'Do you want to delete the Party record?';


//Tracker#:19974
var szMsg_Sel_Techspec         = 'Please select Tech Spec(s).';
//Tracker#:21362 
var szMsg_Selct_Detail = 'Please select one or more detail rows.';

// Tracker#: 21468
var szMsg_Charge_Back_sel_Delete_Confirm = 'Do you want to delete the selected Chargeback(s)?';

// Tracker#: 21409
var szMsg_Note_sel_Delete_Confirm = 'Do you want to delete Note?';

// Tracker#: 21480
var szMsg_Attachment_sel_Delete_Confirm = 'Do you want to delete the selected Attachment(s)?';

// setting to 1130 as monitor resolution is 1152.
MinimumScrWidth=1130;

//constants
var _const_divDataWorkArea = "_divDataWorkArea";

var szMsg_Cost_Delete_Confirm = 'Do you want to delete Costing?';
var szMsg_CostDetails_Delete_Confirm = 'Do you want to delete Costing detail(s)?';

// Tracker#: 21874 ADD REFLIST TAB TO THE PLM PURCHASE ORDER
// Confirmation Messages for Single RefList Overview delete and for multi RefList Overview delete.
var szMsg_RefList_Delete_Confirm = "Do you want to delete Reflist?";
var szMsg_RefList_Multi_Delete_Confirm = "Do you want to delete Reflist(s)?";
//Tracker#: 23962 FR07 EXTEND MANUAL ASSIGNMENT CAPABILITY TO INCLUDE THE ABILITY TO MASS ASSIGN MULTIPLE SALES ORDER
var szMsg_Sel_A_Order_Row = "Cannot assign multiple purchase orders to multiple sales order in the same step.  Please select one item for assignment.";
//Tracker#: 23299 INCORRECT MESSAGE IS DISPLAYED ON EXECUTING THE ACCEPT ORDER PROCESS
var szMsg_Sel_A_So_Order_dtl_Row ="Please select a Sales Order Detail row to execute this process.";
var szMsg_Sel_More_So_Order_Row = "Only one Sales Order item can be selected when running this process.";

var _nColLibRow;
//This function set the current row no value to a variable
function setRowInd(index)
{
    _nColLibRow = index;
}

function _displayUserMessage(msg)
{
    if(msg)
    {
        msg = msg.toString().replace(/<br>/g,"\n");
        msg = msg.toString().replace(/<br\/>/g,"\n");
    }
    //todo
    alert(msg);
}

//Tracker#: 15424 THE DROPDOWN ARE BLEEDING THROUGH THE WARNING/ERROR AND SUCCESS MSG WINDOW
//Moving all the process called before loadWorkArea to a function and calling a
//function closeValidationPopup to close the validation pop-up screen if navigated to any other screen
function _executePreProcess(){
	closeMsgBox();
    _closeSmartTag();     //since 2009R4 aug 30 fixpack Tracker#:12564
    if (typeof(_closeNotesDataDiv) =='function')
    {	
    	_closeNotesDataDiv(); //Tracker#:13535 close notes popup if opened while loading the workarea.
    }
	closeValidationPopup();
	if (typeof(closeCBPopups) =='function')
    {
		closeCBPopups();//Tracker#:18178-  clipboard sharing enhancements
    }
}

//Tracker#:20812 FDD 536 - IMPLEMENTING THE GENERIC CHANGES REQUIRED FOR THE FR1 AND TECH SPEC
//Added to aditional parameter checkModData, which recieved as false skips the navigation check
function loadWorkArea(url, actionMethod, divSaveContainerName, processHandler,origObjAjax, checkModData)
{
	//alert("processHandler " + processHandler);
    _executePreProcess();
    var objHtmlData = null;
    
    if(checkModData!=false)
    {
    	objHtmlData = _getWorkAreaDefaultObj().checkForNavigation();
    }
    else
    {
    	objHtmlData = _getWorkAreaDefaultObj().getHTMLDataObj();
    }    
    
    if(checkModData!=false && objHtmlData!=null && objHtmlData.hasUserModifiedData()==true)
    {
        //perform save operation

	  var docviewid = _getWorkAreaDefaultObj().getHTMLAjax().getDocViewId();
	  if (docviewid == 12701)
	  {
		objHtmlData.performSaveChanges(refreshFields);
        }
        else
	  {
        	objHtmlData.performSaveChanges(_defaultWorkAreaSave);
        }
    }
    else
    {
        var defaultProcessHandler = _showWorkArea;
        if( processHandler && (typeof(processHandler)=='function'))
        {
            defaultProcessHandler = processHandler;
        }
        //alert("loadWorkArea : general ");
        _getWorkAreaObj().setDivDefaultSaveContainerName(divSaveContainerName);
        var objAjax = new htmlAjax();
        if(objAjax)
        {
            objAjax.setActionURL(url);
            // Tracker#: 13512
            // Note since this is a new instance of htmlAjax object the doc view id
            // will not be set and if any processHandler has been passed then that
            // method will not have access to the docviewid. Set the same.
            objAjax.setDocViewId(_getWorkAreaDefaultObj().getHTMLAjax().getDocViewId());
            objAjax.setActionMethod(actionMethod);
            //alert("defaultProcessHandler " + defaultProcessHandler);
            objAjax.setProcessHandler(defaultProcessHandler);
            if ((url == 'techspecoverview.do') && (actionMethod.indexOf('smartcopy') != -1))
            {
            	objAjax._setChangeFlagsOnLoad(true);
            }
            if ((url == 'seasonalcaloverview.do') && (actionMethod.indexOf('smartcopy') != -1))
            {
            	objAjax._setChangeFlagsOnLoad(true);
            }
            //tracker#: 16026 MATERIAL SOURCING PROCESS
            if ((url == 'materialoverview.do') && (actionMethod.indexOf('creatematerialquote') != -1))
            {
            	objAjax._setChangeFlagsOnLoad(true);
            }
            //Tracker#:26533 ADD NEW PROCESS TO COPY MATERIAL QUOTE RECORD
            if ((url == 'materialquoteoverview.do') && (actionMethod.indexOf('copyMaterialQuote') != -1))
			{
            	objAjax._setChangeFlagsOnLoad(true);
            }
            if ((url == 'materialoverview.do') && (actionMethod.indexOf('copymaterial') != -1))
            {
            	objAjax._setChangeFlagsOnLoad(true);
            }
            if ((url == 'materialquoteofferresponse.do') && (actionMethod.indexOf('copyMatOfferResponse') != -1))
            {
            	objAjax._setChangeFlagsOnLoad(true);
            }
        	if (origObjAjax)
            {
                // set the old htmlAjax object as an attribute so the message can display
                // at the correct time (see colorlib _showColorLibPage)
        		objAjax.attribute().setAttribute('origObjAjax', origObjAjax)
            }
			
            _getWorkAreaDefaultObj().getHTMLDataObj().addAllChangedFieldsData(objAjax);
            objAjax.sendRequest();
        }
    }

    //@2010R4
    AutoSuggestContainer.clearComponents();
}

function saveWorkArea()
{
	//todo identify the proper area object based on doc view id
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objHtmlData = htmlAreaObj.getHTMLDataObj();
    var docviewid = htmlAreaObj.getDocViewId();

    // Tracker#:21478 Check for POMWOrksheet Id, if yes handle the Delete in the old fashion.
    // Why not override this method in respective js files? Once this gets registered if then all the PLM Tech Spec
    // will start calling this overridden method instead of the specific method. So check for doc view id and then
    // call respective methods.
    if(docviewid == 12700)
    {
        submitPOMWorkArea("save");
        return;
    }  
        
    //alert("objHtmlData " + objHtmlData.getDocViewId());
    if(objHtmlData!=null && objHtmlData.hasUserModifiedData()==true)
    {
        //alert("loadWorkArea: save changes \n creating ");
        //perform save operation
        // Tracker#:18081 MAINTAIN USER'S PLACE ON THE SCREEN AFTER ADDING, DELETING, SORTING AND COPYING POM CODES
        // Made Generic, so that in all PLM screens, on save, screen would keep the screen place after save from
        // the point save process is called.
        objHtmlData.performSaveChanges(_defaultWorkAreaSave_scroll);
    }
    else
    {
    	var objAjax = new htmlAjax();
    	objAjax.error().addError("warningInfo", szMsg_No_change, false);
    	_displayProcessMessage(objAjax);
       // _displayUserMessage(szMsg_No_change);
    }	
	
    //@2010R4
    AutoSuggestContainer.clearComponents();

}

//Tracker#:20812 Modified the function add the save confirm message
function showSCMain()
{
    // Tracker#:12621 ISSUES ON BLANK RECORD OF TECH SPEC
    // Check for valid record to execute process.
    if(!isValidRecord(true))
    {
        return;
    }
    
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();    	
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
	//alert(objHTMLData);
	if(objHTMLData && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
    {
        var htmlErrors = objAjax.error();
        htmlErrors.addError("confirmInfo", szMsg_Changes,  false);	
        messagingDiv(htmlErrors, "saveTechSpec()", "continueShowSCMain()");
    }
    else
    {	    	
    	continueShowSCMain();
    }    
}

//Tracker#:20812 showSCMain continuitation
function continueShowSCMain()
{
	cancelProcess();
    req = createXMLHttpRequest();
    if (req)
    {
    	req.open("GET", "techspecoverview.do?method=showscmain", true);
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

function smartCopyStart()
{
    var url = 'techspecoverview.do';
    var reqData = smartCopyData2QueryString(document.getElementsByName('frmSmartCopy')[0]);
    //alert (reqData);
    if ((reqData.indexOf('ASSOC=') == -1) && (reqData.indexOf('SEC=') == -1))
    {
    	alert("Please select something to copy");
    	return;
    }
    //Tracker:#18243 - confirm to REPLACE the existing information, if user selects 'Replace' option.
    else if(reqData.indexOf('REPLACE') != -1)
    {
    	var answer = confirm ("Do you want to replace the existing information?")
		if (answer)
		{
			closeMsg();
			loadWorkArea(url, 'smartcopy&'+reqData);
		}
		else
		{
			return;
		}
    }
    else
    {
    	closeMsg();
		loadWorkArea(url, 'smartcopy&'+reqData);
    }
}


function smartCopyData2QueryString(docForm) {

    var submitContent = '';
    var formElem;
    var lastElemName = '';

    //alert(docForm.elements.length);
    for (i = 0; i < docForm.elements.length; i++) {

      formElem = docForm.elements[i];
      if (formElem.type == 'checkbox')
      {
          if (formElem.checked)
          {
              submitContent += formElem.name + '=' + escape(formElem.value);
              submitContent += '&';
          }
      }
      else if (formElem.type != 'radio')
      {
          if (formElem.name == lastElemName) {
              // Strip off end ampersand if there is one
              if (submitContent.lastIndexOf('&') == submitContent.length-1) {
                submitContent = submitContent.substr(0, submitContent.length - 1);
              }
              // Append value as comma-delimited string
              submitContent += ',' + escape(formElem.value);
            }
            else {
              submitContent += formElem.name + '=' + escape(formElem.value);
            }
            submitContent += '&';
            lastElemName = formElem.name;
      }
    }
    // Remove trailing separator
    submitContent = submitContent.substr(0, submitContent.length - 1);
    return submitContent;
  }

function scSelectAssoc(obj)
{
	var atype = obj.value.substr(obj.value.indexOf("_")+1);
	var radioGrp = document.getElementsByName("RAD_"+atype);

   	// parse the name of the checkbox to get the assoc type
   	for(var i=0; (radioGrp != null) && (i < radioGrp.length); i++)
   	{
   	    radioGrp[i].disabled = !(obj.checked);
   	}
}

function scToggleAddReplace(rad)
{
	// parse the name of the checkbox to get the assoc type
	var atype = rad.name.substr(rad.name.indexOf("_")+1);
	var cbs = document.getElementsByName("ASSOC");
    for (i = 0; i < cbs.length; i++)
    {
    	var cb = cbs[i];
    	if (cb.type == 'checkbox' && cb.disabled == false)
    	{
    	    if ((cb.value != null) && (cb.value.indexOf(atype) != -1))
    	    {
    	    	cb.value = rad.value+"_"+atype;
    	    	break;
    	    }
    	}
    }
}

function scToggleSelectAll(obj, type)
{
	//var docForm = document.getElementsByName('frmSmartCopy')[0];
	var typeArr = document.getElementsByName(type);
    for (i = 0; i < typeArr.length; i++)
    {
    	var formElem = typeArr[i];
        if (formElem.type == 'checkbox' && formElem.disabled == false)
        {
        	if (obj.checked)
        	{
       	        formElem.checked=true;
        	}
        	else
        	{
        		formElem.checked=false;
        	}
        	scSelectAssoc(formElem);
        }
    }
}
/*
Function to handle the tab selection action.

@param obj - Selected tab header's component object.
@param url - The URL format on selection of the 'Product Overview' tab is - 'techspecoverview.do'
@param actMethod - Request method value.
*/
function tabSelectionAction(obj, url, actMethod, docViewSecRelId, docRelId)
{
  		var workArea = _getWorkAreaDefaultObj();
  		var workAreaAjax = workArea.getHTMLAjax();
  		var docData = workArea.getHTMLDataObj();
    	if(workAreaAjax && docData)
    	{
    		bShowMsg = true;
		if (obj  && typeof(obj.parentNode) != 'undefined')
		{
    		actMethod += '&activeTabId='+obj.parentNode.id;
		}
    		actMethod += '&dvsrId='+docViewSecRelId;
    		actMethod += '&drId='+docRelId;
    		Main.loadWorkArea(url, actMethod);
     	}
}

/*
Function to handle the save action. The action is mapped to the document screen's toolbar save
button action.

@param saveURL - The URL format of Sample screen save action is - 'sample.do?method=save'
*/
function saveAction(saveURL)
{
    var workArea  = _getWorkAreaDefaultObj();
    var docData = workArea.getHTMLDataObj();
    if(docData != null && docData.hasUserModifiedData() == true)
    {
    	docData.setSaveURL(saveURL);
        docData.performSaveChanges(_defaultWorkAreaSave);
    }
    else
    {
    	var objAjax = new htmlAjax();
    	objAjax.error().addError("warningInfo", szMsg_No_change, false);
    	_displayProcessMessage(objAjax);
    }
}

function _defaultWorkAreaSave_scroll(objAjax)
{
	_defaultWorkAreaSave(objAjax, _showWorkArea_scroll);
}

function _defaultWorkAreaSave(objAjax, processHndlr)
{
    //alert("_defaultWorkAreaSave: ");
    var funName = "postSaveWorkArea";

    if(!objAjax.error().hasErrorOccured())
    {
        //Tracker#:15783 ENTER A COLORWAY ON RANDOM LINE CAUSES AN ERROR
        //resetHTMLData(changefields data) only if the process is complete
        //alert("objAjax.isProcessComplete() " + objAjax.isProcessComplete());
        if(objAjax.isProcessComplete())
        {
            _getWorkAreaObj().resetHTMLData();
        }
         //alert("typeof(processHndlr) " + typeof(processHndlr));
        if(typeof(processHndlr)!="undefined")
	    {
	    	// Tracker#:18081 MAINTAIN USER'S PLACE ON THE SCREEN AFTER ADDING, DELETING, SORTING AND COPYING POM CODES
	        // Made Generic, so that in all PLM screens, on save, screen would keep the screen place after save from
    	    // the point save process is called.
	    	  if(typeof(processHndlr)!="function")
              {
                  eval(processHndlr + "(objAjax)");
              }
              else
              {
                  // alert("here dynamical call ");
                  processHndlr(objAjax);
              }
		}
        else
        {
       _showWorkArea(objAjax);
    }
    }
    else
    {
        _displayProcessMessage(objAjax)
    }

    if(typeof(funName)=="function")
    {
        eval(funName+"("+objAjax+")");
    }
}

function _displayProcessMessage(objAjax)
{
    /*if(objAjax)
    {

        msgInfo = objAjax.getAllProcessMessages();

        if(msgInfo!="")
        {

          // _displayUserMessage(msgInfo);
          var errorType = "";
          var errorMsgs = "";
          var divStyle = "";

           if(objAjax.error().getErrorMsg()!=null)
		    {
		  		errorType = "\n Error Message(s)\n";
		  		errorMsgs =  objAjax.error().getErrorMsg();
		        //msgInfo += "\n Error Message(s)\n " + objAjax.error().getErrorMsg();
		    }

		    if(objAjax.error().getWarningMsg()!=null)
		    {
		    	errorType = "\n  Warning Message(s)\n ";
		  		errorMsgs =  objAjax.error().getWarningMsg();
		         //msgInfo += "\n  Warning Message(s)\n " + objAjax.error().getWarningMsg();
		    }

		    if(objAjax.error().getSuccessMsg()!=null)
		    {
		        //msgInfo += "\n Success Message(s)\n " + objAjax.error().getSuccessMsg();
		        errorType = "\n Success Message(s)\n";
		  		errorMsgs =  objAjax.error().getSuccessMsg();
		    }
		    replacevalstr(errorMsgs, '<br>', '\n');
	  		printmsgDiv(errorType, errorMsgs, divStyle);
		    //replacevalstr(msgInfo, '<br>', '\n');

		}
	}*/
    //alert("objAjax.error() " + objAjax.error());
    try
    {
	    var objMsgDiv = new messagingDiv(objAjax.error());
	}
	catch(e){
	    //alert(e.description);
	}
	//alert("finished");

}

function _showWorkArea(objAjax)
{
    try
    {
        //alert("_showWorkArea ");
        if(objAjax)
        {

            //alert("_showWorkArea: \n _getWorkAreaObj().getDivSaveContainerName() " + _getWorkAreaObj().getDivSaveContainerName());
            var div=getElemnt(_getWorkAreaObj().getDivSaveContainerName());
            workAreaDivsList = new Array();

            /* Tracker#: 19807 - LEFT NAVIGATION NEEDS TO BE MADE COLLAPSIBLE
             * To prepare for new screen:
             * Clear the registered functions to run on left nav toggle.
             */
            _showWorkArea.toggleNav.unRegisterAll();
            _showWorkArea.toggleNav.clearCollapsableIds();
            
            if(div)
            {
                registerHTML(div,objAjax);
            }

            alignWorkAreaContainer();

            if(nCurScrWidth > MinimumScrWidth)
            {
                resetAllMainDivs();
            }
        	if (objAjax._mSetChangeFlagsOnLoad == true)
        	{
                var workArea  = _getWorkAreaDefaultObj();
                var docData = workArea.getHTMLDataObj();
                docData._mHasUserModifiedData=true;
        	}
        	var origObjAjax
	    	// see if the old htmlAjax was set as an attribute, and display the messages
	    	// from it
	    	origObjAjax = objAjax.attribute().getAttribute('origObjAjax')
	    	if (origObjAjax)
	    	{
	    		_displayProcessMessage(origObjAjax);
	    	}
	    	else
	    	{
	    		//Tracker#: 15424 THE DROPDOWN ARE BLEEDING THROUGH THE WARNING/ERROR AND SUCCESS MSG WINDOW
	    		//Changing the order of execution
	    		_displayProcessMessage(objAjax)
	    	}
        }

        //Tracker# 18246 CHANGE TRACKING UI ENHANCEMENTS
        showChangeTrackingTabCount();
        

    }
    catch(e)
    {
        //alert(e.description);
    }
}

/** Tracker#: 19807 - LEFT NAVIGATION NEEDS TO BE MADE COLLAPSIBLE
 * This module returns a function that toggles the left navigation.
 * The returned function accepts a string with either 'hide' or 'show'.
 * 
 * All functions that are required to align sections, the workarea, etc.
 * must contain a call to _showWorkArea.toggleNav.register(functionName, arguments)
 * where functionName is the alignment function's name, and arguments is the
 * array containing the function call's arguments (usually can just pass
 * arguments array).
 * 
 * Example:
 * function alignmentFunction (arg1, arg2) {
 * 
 * 	// code
 * 
 * 	_showWorkArea.toggleNav.register('alignmentFunction', arguments);
 * }
 * 
 * 
 * If the alignment function is called more than once on same screen,
 * it must make sure it does not register itself more than once while on same screen.
 */
_showWorkArea.toggleNav = function () {
	var islocalStorageSupported = (window['localStorage']) ? true : false,
		toggleState,
		buttonWidth = 16 + 3, // 3 So there some space between show button & work area.
		parentPadding = 5,
		leftNavWidth = 164,
		leftNavBorder = 1,
		workAreaContainerOriginalLeft = 166,
		$leftNav,
		$showDiv,
		$workAreaContainer,
		isSourcingScreen = false,
		toggleFunctions = [],
		toggleAfterFunctions = [],
		alreadyRegistered = false,
		collapsableIds = {},
		isInit = false,
		isQueryViewerPLM = false,
		isPOMPopup = false;

	toggleState = (function () {
		if (islocalStorageSupported)
		{
			var storageToggleState = localStorage.getItem('toggleNav.toggleState');
			if (storageToggleState)
			{
				return storageToggleState;
			}
			else
			{
				return 'visible'; // Default value
			}
		}
		else
		{
			return 'visible'; // Default value
		}
	})();
	
	
	var setIsQueryViewerPLM = function (value) {
		isQueryViewerPLM = value;
	};
	
	var setIsPOMPopup = function (value) {
		isPOMPopup = value;
	};
	
	/* Only works for functions in global scope.
	 * Currently, the 'this' keyword is hardcoded to the window object.
	 * Registers functions to be called on toggling left navigation.
	 */
	var register = function (functionName, args) {
		if (!alreadyRegistered && !isPOMPopup)
		{
			if (functionName === 'sliderAdjustControlledDivWidth' ||
					functionName === 'actuallyCreateSlider')
			{
				var argsFromToggle = [];
				$.each(args, function (i) {
					argsFromToggle[i] = args[i];
				});
				argsFromToggle.push(true);
			}
			else
			{
				var argsFromToggle = args;
			}
			
			toggleFunctions.push( function () {
				window[functionName].apply(window,argsFromToggle);
			});
		}
	};
	
	/* Same as register function, but this function is called only after
	 * all other alignment functions have executed.  Thus, it has it's
	 * own array to store functions. 
	 */
	var registerAfterAlignment = function (functionName, args) {
		if (!alreadyRegistered && !isPOMPopup)
		{
			if (functionName === 'sliderAdjustControlledDivWidth' ||
					functionName === 'actuallyCreateSlider')
			{
				var argsFromToggle = [];
				$.each(args, function (i) {
					argsFromToggle[i] = args[i];
				});
				argsFromToggle.push(true);
			}
			else
			{
				var argsFromToggle = args;
			}
			
			toggleAfterFunctions.push( function () {
				window[functionName].apply(window,argsFromToggle);
			});
		}
	};
	
	/* In preparation for new screen returned from ajax, this method does:
	 * 1. Empty toggleFunctions array.
	 * 2. set alreadyRegistered flag to false.
	 */
	var unRegisterAll = function () {
		toggleFunctions.length = 0;
		toggleAfterFunctions.length = 0;
		alreadyRegistered = false;
		isQueryViewerPLM = false;
	};
	
	
	var show = function () {
		nMenuWidth = 166; // 166 = The original value in lsb.js
		
		$showDiv.css('display','none');
		$leftNav.css('display', 'block');

		if (!isSourcingScreen)
		{
			$workAreaContainer.css('left', workAreaContainerOriginalLeft);
		}
		else
		{
			$workAreaContainer.css('left','166px');
			$workAreaContainer.css('width',$workAreaContainer.width() - (166-buttonWidth)); // 166 = original nMenuWidth
		}

	};
	
	var hide = function () {
		if (!isSourcingScreen)
		{
			nMenuWidth = 4 + buttonWidth; // 4 = visible nMenuWidth - workAreaContainer offsetleft
		}
		else
		{
			nMenuWidth = buttonWidth;
		}
		$showDiv.css('display','block');
		$leftNav.css('display', 'none');
		
		if (!isSourcingScreen)
		{
			$workAreaContainer.css('left', 0 + buttonWidth);			
		}
		else
		{
			$workAreaContainer.css('left', 0 + buttonWidth);
			$workAreaContainer.css('width',$workAreaContainer.width() + (166-buttonWidth)); // 166 = original nMenuWidth
		}

	};
	
	var updateToggleState = function (action) {
		switch (action)
		{
			case 'hide' :
				toggleState = 'hidden';
				if (islocalStorageSupported)
				{
					localStorage.setItem('toggleNav.toggleState', 'hidden');
				}
				break;
			case 'show' :
				toggleState = 'visible';
				if (islocalStorageSupported)
				{
					localStorage.setItem('toggleNav.toggleState', 'visible');
				}
				break;
		}
	};
	
	var restoreCollapsedSections = function () {
		for (var id in collapsableIds)
		{
			if (collapsableIds[id])
			{
				$(getElemnt(id)).css('display', collapsableIds[id]);
			}
		}
	};
	
	var showCollapsedSections = function () {
		for (var id in collapsableIds)
		{
			var $collapsableSection = $(getElemnt(id)),
				sectionDisplay = $collapsableSection.css('display');
			
			collapsableIds[id] = sectionDisplay; 
			
			if (sectionDisplay === 'none')
			{
				$collapsableSection.css('display','block');
			}
			
			$collapsableSection = null;
		}
	};
	
	var addCollapsableId = function (collapsableId) {
		if (!isPOMPopup)
		{
			collapsableIds[collapsableId] = null; // add key with no value to collapsableIds.
		}
	};
	
	var clearCollapsableIds = function () {
		collapsableIds = {};
	};
	
	var adjustRightSideDivs = function (action) {
		var getElemBasedOnColFreeze = function (div1Name, div2Name) {
			var $testElem = $('#' + div2Name);
			return ($testElem.length > 0) ? $testElem : $('#' + div1Name);
		};
		
		var $titleDiv = getElemBasedOnColFreeze('TITLE_DIV', 'TITLE_DIV2'),
			$dataDiv = getElemBasedOnColFreeze('DATA_DIV', 'DATA_DIV2');
		
		switch (action)
		{
			case 'show' :
				$titleDiv.width( $titleDiv.width() - (workAreaContainerOriginalLeft - buttonWidth) );
				$dataDiv.width( $dataDiv.width() - (workAreaContainerOriginalLeft - buttonWidth) );
				break;
				
			case 'hide' :
				$titleDiv.width( $titleDiv.width() + (workAreaContainerOriginalLeft - buttonWidth) );
				$dataDiv.width( $dataDiv.width() + (workAreaContainerOriginalLeft - buttonWidth) );
				break;
		}
	};
	
	var init = function () {
		if (!isInit)
		{
			isInit = true;
			
			$leftNav = $('#_divNavArea');
			$showDiv = $('#navShow');
			$workAreaContainer = $('#_divWorkAreaContainer');
			if ($workAreaContainer.length === 0)
			{
				isSourcingScreen = true;
				$workAreaContainer = $('#LOCK');
			}
			var $hideDivs = $leftNav.find('div.navHide');
			
			var toggleHandler = function (action, e) {
				_showWorkArea.toggleNav(action);
				updateToggleState(action);
				
				if (!isSourcingScreen)
				{
					/* Need to temporarily display collapsed sections before adjusting sliders'
					 * controlled divs or controlled divs' scrollWidth = 0.
					 */ 
					showCollapsedSections();
					
					/* Need to prevent re-registering toggle functions;
					 * Setting alreadyRegistered flag before calling toggle functions
					 * to prevent re-registering.
					 */
					alreadyRegistered = true;
					$.each(toggleFunctions, function () {
						this();
					});
					
					// Make sections that were collapsed hidden again
					restoreCollapsedSections();
					
					alignWorkAreaContainer();
					
					if(nCurScrWidth > MinimumScrWidth)
					{
						resetAllMainDivs();
					}
					
					$.each(toggleAfterFunctions, function () {
						this();
					});
					
					if (isQueryViewerPLM)
					{
						adjustRightSideDivs(action);
						/* alignWorkAreaContainer function sets #_divWorkArea
						 * width to auto, which in IE, causes issues because
						 * #_divWorkArea has descendent elements with very
						 * wide width, causing horizontal scrollbar to appear.
						 */
						if (IE)
						{
							$('#_divWorkArea').css('width', '100%');
						}
						/*
						 * Issue - In Firefox & Safari, alignWorkAreaContainer()
						 * sets #_divWorkAreaContainer from overflow:hidden to overflow:auto,
						 * which allows the vertical scrollbar to show.
						 * 
						 * Fix - Setting #_divWorkAreaContainer to overflow:hidden here.
						 */
						$('#_divWorkAreaContainer').css('overflow','hidden');
					}
	
				}
				
				e.stopPropagation();
			};
			//Tracker#24763 - Added $.isReady to unbind hide function if it is dynamically loaded
			// Toggle the left nav based on its state when first entering the screen.
			if (toggleState === 'hidden' && !($.isReady))
			{
				_showWorkArea.toggleNav('hide');
				updateToggleState('hide');
			}
			else if (toggleState === 'visible')
			{
				// do nothing - already visible by default
			}
			
			$hideDivs.bind('click', function (e) {
				toggleHandler('hide', e);
			});
			
			$showDiv.bind('click', function (e) {
				toggleHandler('show', e);
			});
		}
	};
	
	
	var retFunc = function (action) {
		switch (action)
		{
			case 'show' :
				show();
				break;
			case 'hide' :
				hide();
				break;
			default :
				show();
		}
	};

	retFunc.register = register;
	retFunc.registerAfterAlignment = registerAfterAlignment;
	retFunc.unRegisterAll = unRegisterAll;
	retFunc.setAlreadyRegistered = function (value) {
		alreadyRegistered = value;
	};
	retFunc.addCollapsableId = addCollapsableId;
	retFunc.clearCollapsableIds = clearCollapsableIds;
	
	retFunc.init = init;
	
	retFunc.setIsQueryViewerPLM = setIsQueryViewerPLM; 
	retFunc.setIsPOMPopup = setIsPOMPopup;
	
	return retFunc;
}();


//Tracker# 18246 CHANGE TRACKING UI ENHANCEMENTS
function showChangeTrackingTabCount()
{
    $(document).ready(function()
    {
    	//Change tracking tab button id
    	//Tracker#: 19238 F2J. CHANGE TRACKING ON COMPETENCIES DOCUMENT
    	//Tracker#: 18917 F4L - CHANGE TRACKING ON CAPACITY DOCUMENT
    	if ($("#1237CenterCell").length > 0 || $("#16377CenterCell").length > 0
    	       || $("#16352CenterCell").length > 0 || $("#16388CenterCell").length > 0
    	       || $("#16389CenterCell").length > 0 || $("#16390CenterCell").length > 0
    	       || $("#1441CenterCell").length > 0 || $("#16391CenterCell").length > 0
    	       || $("#1304CenterCell").length > 0 || $("#1497CenterCell").length > 0
			   || $("#16394CenterCell").length > 0 || $("#16395CenterCell").length > 0
    	       || $("#16401CenterCell").length > 0  || $("#16404CenterCell").length > 0
                || $("#16454CenterCell").length > 0 || $("#2110CenterCell").length > 0)
    	{
    		var changeAjax = new htmlAjax();
    		changeAjax.setActionURL("changetrackviewerplm.do");
    		changeAjax.setActionMethod("numberOfChanges");
    		changeAjax.setProcessHandler("showNumCTChanges");
    		changeAjax.showProcessingBar(false);	//Tracker#: 20234 CHANGE TRACKING COUNT PERFORMANCE ON OVERVIEW SCREENS

    		var parentDocViewId = null;
    		if ($("#1237CenterCell").length > 0)
    		{
    		    //TechSpec
                parentDocViewId = "132";
    		}
    		else if ($("#16377CenterCell").length > 0)
    		{
    		    //Material Projections
    			parentDocViewId = "5800";
    		}
            else if ($("#16352CenterCell").length > 0)
            {
                //Material Quote Overview
                parentDocViewId = "155";
            }
            else if ($("#16388CenterCell").length > 0)
            {
                //Material Library Overview
                parentDocViewId = "3303";
            }
            else if ($("#16389CenterCell").length > 0)
            {
                //Artwork Library Overview
                parentDocViewId = "4200";
            }
            else if ($("#16390CenterCell").length > 0)
            {
                //Color Library Overview
                parentDocViewId = "2900";
            }
            else if ($("#1441CenterCell").length > 0)
            {
                //Color Palette Overview
                parentDocViewId = "3500";
            }
            else if ($("#16391CenterCell").length > 0)
            {
                //Material Palette Overview
                parentDocViewId = "6000";
            }
            else if ($("#1304CenterCell").length > 0)
            {
                //Submits
                parentDocViewId = "3400";
            }
            else if ($("#1497CenterCell").length > 0)
            {
                //Fit Evaluation
                parentDocViewId = "2406";
            }
    		else if ($("#16394CenterCell").length > 0)
    		{
               parentDocViewId = "6800";
    		}

    		else if ($("#16395CenterCell").length > 0)
    		{
               parentDocViewId = "6801";
    		}
    		//Tracker#: 19238 F2J. CHANGE TRACKING ON COMPETENCIES DOCUMENT
    		else if ($("#16401CenterCell").length > 0)
    		{
               parentDocViewId = "7000";
    		}
    		//Tracker#: 18917 F4L - CHANGE TRACKING ON CAPACITY DOCUMENT
    		else if ($("#16404CenterCell").length > 0)
    		{
               parentDocViewId = "7300";
    		}
            else if ($("#16454CenterCell").length > 0)
            {
                parentDocViewId = "212";
            }
            else if ($("#2110CenterCell").length > 0)
            {
                parentDocViewId = "321";
            }
            changeAjax.parameter().add("parentDocViewId", parentDocViewId);
    		changeAjax.sendRequest();
    	}
    });
}

//Tracker# 18246 CHANGE TRACKING UI ENHANCEMENTS
function showNumCTChanges(objAjax)
{
	if(objAjax)
	{
		if(objAjax.isProcessComplete())
		{
			var numberOfChanges = objAjax.getResult();
			var index = numberOfChanges.indexOf('<');
			numberOfChanges = numberOfChanges.substr(0, index);
			if (parseInt(numberOfChanges) > 0)
			{
				//Tracker#: 18626 F8 - J. CHANGE TRACKING ON CAPACITY PROJECTION DOCUMENT
				var divObj = null;
				if ($("#1237CenterCell").length > 0)
                {
                    //TechSpec
                	divObj = $("#1237CenterCell");
                }
                else if ($("#16377CenterCell").length > 0)
                {
                    //Material Projections
                    divObj = $("#16377CenterCell");
				}
				else if ($("#16394CenterCell").length > 0)
                {
					divObj = $("#16394CenterCell");
                }
                else if ($("#16395CenterCell").length > 0)
				{
                    divObj = $("#16395CenterCell");
				}
                else if ($("#16352CenterCell").length > 0)
				{
                    //Material Quote Overview
                    divObj = $("#16352CenterCell");
                }
                else if ($("#16388CenterCell").length > 0)
                {
                    //Material Library Overview
                    divObj = $("#16388CenterCell");
                }
                else if ($("#16389CenterCell").length > 0)
                {
                    //Artwork Library Overview
                    divObj = $("#16389CenterCell");
                }
                else if ($("#16390CenterCell").length > 0)
                {
                    //Color Library Overview
                    divObj = $("#16390CenterCell");
                }
                else if ($("#1441CenterCell").length > 0)
                {
                    //Color Palette Overview
                    divObj = $("#1441CenterCell");
                }
                else if ($("#16391CenterCell").length > 0)
                {
                    //Material Palette Overview
                    divObj = $("#16391CenterCell");
                }
                else if ($("#1304CenterCell").length > 0)
                {
                    //Submits
                    divObj = $("#1304CenterCell");
                }
                else if ($("#1497CenterCell").length > 0)
                {
                    //Submits
                    divObj = $("#1497CenterCell");
                }
				//Tracker#: 19238 F2J. CHANGE TRACKING ON COMPETENCIES DOCUMENT
                else if ($("#16401CenterCell").length > 0)
                {
					divObj = $("#16401CenterCell");
                }
                //Tracker#: 18917 F4L - CHANGE TRACKING ON CAPACITY DOCUMENT
                else if ($("#16404CenterCell").length > 0)
                {
                    divObj = $("#16404CenterCell");
                }
                else if ($("#16454CenterCell").length > 0)
                {
                    divObj =  $("#16454CenterCell");
                }
                else if ($("#2110CenterCell").length > 0)
                {
                    divObj =  $("#2110CenterCell");
                }
                if (divObj != null)
                {
                    //This is required as in some of the pages, on click of New,
                    //the count was getting appended again and again
                    if ($("#chgTrkCnt") != null && $("#chgTrkCnt").html() != null)
                    {
                        $("#chgTrkCnt").remove();
                    }

                	divObj.append("<span id='chgTrkCnt'>&nbsp;<span style='background-color:rgb(238, 63, 41);color:white;height:15px;'>&nbsp;" + numberOfChanges + "&nbsp;</span></span>");
                }
			}
		}
	}
}
/*
Tracker#:18081 MAINTAIN USER'S PLACE ON THE SCREEN AFTER ADDING, DELETING, SORTING AND COPYING POM CODES
This function could be used to persist the scroll height, after any process is executed. Usually if loadWorkarea function
is called after process execution, screen would be repainted and shown at top of the scren, so to maintain the scroll top, pass this
function as callback function.
ex: This function is being used in fitoverview.js, in sortFitDetails function.
*/
function _showWorkArea_scroll(objAjax)
{
    try
    {
    	var scrlTop = 0;

    	/* Tracker#: 20026 - FIT EVAL SCROLL POSITION NOT MAINTAINED AFTER SAVE WHEN SECTION IS COLLAPSED
    	 * Taking into account that sections above the detail section can be collapsed, which causes
    	 * the work area scrolltop to be different then after saving, which repaints screen with sections
    	 * un-collapsed.
    	 * Fix: Store the collapsed state of each section and restore them by collapsing only the
    	 * sections that were collapsed before the save.
    	 */
    	var states = [],
    		collapsableIds = [$('#2406_0_divCollapsable'),
    	                      $('#2406_1_divCollapsable'),
    	                      $('#2406_2_divCollapsable'),
    	                      $('#2409_0_divCollapsable'),
    	                      $('#2409_1_divCollapsable'),
    	                      $('#2409_2_divCollapsable')
    						];
    	$.each(collapsableIds, function (i, value) {
    		if (collapsableIds[i].length > 0)
    		{
    			states[i] = collapsableIds[i].css('display');
    		}

    	});



    	var divDataWrkArea = document.getElementById(_const_divDataWorkArea);
        //alert("_showWorkArea_scroll ");
        if(objAjax && divDataWrkArea)
        {
            //alert("_showWorkArea: \n _getWorkAreaObj().getDivSaveContainerName() " + _getWorkAreaObj().getDivSaveContainerName());

            scrlTop = divDataWrkArea.scrollTop;
            //alert("scrollTop= --- "+scrlTop);
        }
        _showWorkArea(objAjax);

        //alert("here");

        divDataWrkArea = document.getElementById(_const_divDataWorkArea);
        //alert("divDataWrkArea.offsetHeight"+ divDataWrkArea.offsetHeight  +"\n divDataWrkArea.height = "+ divDataWrkArea.height);

        if(divDataWrkArea)	// && divObj.offsetHeight>div.height)
        {
        	var sectionToggle = ['#_tableHeaderBar2406_0',
        	                     '#_tableHeaderBar2406_1',
        	                     '#_tableHeaderBar2406_2',
        	                     '#_tableHeaderBar2409_0',
        	                     '#_tableHeaderBar2409_1',
        	                     '#_tableHeaderBar2409_2'
        	                     ];

        	/* Tracker#: 20026 - FIT EVAL SCROLL POSITION NOT MAINTAINED AFTER SAVE WHEN SECTION IS COLLAPSED
        	 * For each section that has display='none' (that was collapsed before save),
        	 * collapse the section by calling click event handler that toggles that section's
        	 * collapse state.
        	 */
        	$(states).map(function (i, element) {
        		if (states[i] === 'none')
        		{
        			$(sectionToggle[i]).children().children(':first').children(':first').click();
        		}
        	});

        	//alert("setting scroll " + scrlTop);
        	divDataWrkArea.scrollTop = scrlTop;
        	/**
        	 * Tracker#:21723 EDITING FIT EVAL AND SAVE, A 2ND DETAILS SECTION HEADING POPS UP BRIEFLY.
        	 * divDataWorkArea setting scrollTop, so that it drags up and down to reset Floating Header div
        	 * , that pops up when scrollTop value is set.
        	 * 
        	 */
        	if($("#"+_const_divDataWorkArea).data("FIT_EVAL"))
        		{
        			divDataWrkArea.scrollTop = scrlTop+1;
        			divDataWrkArea.scrollTop = scrlTop-1;
        		}
        	//alert("final divObj.scrollTop "+ divDataWrkArea.scrollTop);
        	// Tracker#:22349 Tracker#:22349 POINTS OF MEASURE HIDE/SHOW DISAPPEARS ON POM SCREEN
        	// setting width to Hide/Show link, if its width is shorten when all columns except any
        	// one column are hidden. 
        	var pomobj = getElemnt("_pom");
        	var lableobj = getElemnt("_pomlbl");
        	if(pomobj && lableobj)
        		{
	        		var tdwidh = pomobj.offsetWidth;        	
		        	var lablewidth = lableobj.scrollWidth;
		        	if(tdwidh<lablewidth)
	        		{
		        		var obj = $("#_pom");
	        			obj.width(200);
	        		}
        		}
        }
    }
    catch(e)
    {
        //alert(e.description);
    }
}


//Tracker#: 16207 INFORMATION IN EVENTS DETAIL LINES ARE SET BLANK WHEN USER NAVIGATE FROM SAMPLE TAB TO EVENT SCREEN
//This method for saving workarea
function _showSaveContainerWorkArea(objAjax)
{
    try
    {
        //alert("_showSaveContainerWorkArea ");
        if(objAjax)
        {

            _displayProcessMessage(objAjax)
            var div=getElemnt(_getWorkAreaDefaultObj().getDivSaveContainerName());

            if(div)
            {
                //alert("register called");
               registerHTML(div,objAjax);
            }
            alignWorkAreaContainer();
            if(nCurScrWidth > MinimumScrWidth)
            {
               resetAllMainDivs();
            }
        }
    }
    catch(e)
    {
        //alert(e.description);
    }
}

function _reloadArea(objAjax, divId,skipTag)
{
    try
    {
       // alert("_reloadArea :\n sectionName ->   "+sectionName);
        if(objAjax)
        {
        	// Tracker#:15784 NEED THE ABILITY TO VIEW MATERIAL LIBRARY INFORMATION FOR A COMPONENT ON THE DESIGN BOM
        	// pass the flag, if flag and Attribute '_AttributeDonotCloseSmartDiv' is set to 1 for a Div then
        	// don't close the SmartTag PopUp.
        	//Tracker#:16082 -ABILITY TO SHARE THE CLIPBOARD WITH OTHER USERS
        	// skipTag is set to true then skipping the smart Tag pop up close
        	if(skipTag!=true)
        	{
				_closeSmartTag(true);
			}
             //since 2009R4 aug 30 fixpack Tracker#:12564
        	if (typeof(_closeNotesDataDiv) =='function')
    	    {
        		_closeNotesDataDiv(); //Tracker#:13535 close notes popup if opened while loading the workarea.
    	    }
            //_closeNotesDataDiv(); //Tracker#:13535 close notes popup if opened while reloading the workarea
            //Tracker# 15585-TSR-509 DRAG COLOR AND ARTWORK TO BOM
            var div=getElemnt(divId);

            if(div)
            {
                registerHTML(div,objAjax);
            }

            alignWorkAreaContainer();

            if(nCurScrWidth > MinimumScrWidth)
            {
                resetAllMainDivs();
            }
        }
    }
    catch(e)
    {
        //alert(e.description);
    }
}

function loadToolArea(url, actionMethod)
{
    //alert("loadToolArea: start");

    var objHtmlData = _getToolBarAreaObj().checkForNavigation();
    //alert("objHtmlData " + objHtmlData);
    if(objHtmlData!=null && objHtmlData.hasUserModifiedData()==true)
    {
        //alert("loadToolArea: save changes \n creating ");
        //perform save operation
        objHtmlData.performSaveChanges(_defaultToolAreaSave);
    }
    else
    {
        //alert("loadToolArea : general ");
        var objAjax = new htmlAjax();
        if(objAjax)
        {
            objAjax.setActionURL(url);
            objAjax.setActionMethod(actionMethod);
            objAjax.setProcessHandler(_showToolArea);
            objAjax.sendRequest();
        }
    }
}

function _defaultToolAreaSave(objAjax)
{
    //alert("save success");
    var funName = "postSaveToolArea";
    var msgInfo = "";

    if(!objAjax.error().hasErrorOccured())
    {
       _getToolBarAreaObj().resetHTMLData();
       _showToolArea(objAjax);
    }

    msgInfo = objAjax.getAllProcessMessages();

    if(msgInfo!="")
    {
       //_displayUserMessage(msgInfo);
       var objMsgDiv = new messagingDiv(objAjax.error());
    }

    if(typeof(funName)=="function")
    {
        eval(funName+"("+objAjax+")");
    }
}

function _showToolArea(objAjax)
{
    try
    {
        //alert("_showToolArea ");
        if(objAjax)
        {
            //alert("_getToolBarAreaObj().getDivContainerName() " + _getToolBarAreaObj().getDivContainerName());
            var div=getElemnt(_getToolBarAreaObj().getDivContainerName());
            if(div)
            {
                //alert("build tool area");
                registerHTML(div,objAjax);
            }
            alignWorkAreaContainer();
        }
    }
    catch(e)
    {
        //alert(e.description);
    }
}

function _navigatePage(url)
{
	window.location.href = url;
}


//added new js functions to explicitly remove all the elements
// while refreshing the area
///Tracker#: 15201 - TO ADDRESS MEMOTY LEAK ISSUES IN NEW VALIDATION AND MESSAGING FRAMEWORK
function _remElement(elm)
{
    while (elm.childNodes.length > 0)
    {
        _remEle(elm.childNodes[elm.childNodes.length - 1]);
    }
}

function _remEle(elm)
{
     while (elm.childNodes.length > 0)
     {
         _remEle(elm.childNodes[elm.childNodes.length - 1]);
     }
     if(elm.clearAttributes) elm.clearAttributes();
     elm.parentNode.removeChild(elm);

     if (IE && elm.outerHTML) elm.outerHTML = "";
     else if (elm.innerHTML) elm.innerHTML = ""

     elm = null;
}

function registerHTML(div, objAjax)
{
    if(div && objAjax)
    {
        //if fatal error occurs don't process it.
        if(!objAjax.isProcessComplete())
        {
            return;
        }
        
        /* Tracker#: 19807 - LEFT NAVIGATION NEEDS TO BE MADE COLLAPSIBLE
         * Setting alreadyRegistered to false to allow lazy loaded sections
         * to register with _showWorkArea.toggleNav .  This is because the alreadyRegistered
         * flag is set to true when user clicks on toggle button.
         */
        if (_showWorkArea.toggleNav)
        {
        	_showWorkArea.toggleNav.setAlreadyRegistered(false);
        }

        // remove all the elements while refreshing the area.
     	_remElement(div);
        div.innerHTML = "";
        //div.outerHTML=objAjax.getHTMLResult();
        $(div).replaceWith(objAjax.getHTMLResult());

        //alert(div.id + "\n " +  div.childNode.id);
        //alert("done div "  +div.innerHTML);
        _execAjaxScript(objAjax);
        toggleDisplayVisible(div, true);

        if(document.body && document.body.scrollTop)
        {
        	document.body.scrollTop=0;
        }
    }
}

function _execAjaxScript(objAjax)
{
    var scrpt = objAjax.getScriptResult();
    if(scrpt && scrpt.toString().length>0)
    {
        //alert("scrpt \n " + scrpt);
        eval(scrpt);
    }
}

//Tracker#:21688 - JAVASCRIPT CONSOLIDATION PHASE 1
function addScriptBlock(pth,srcs)
{
	srcs = srcs.substring(1,srcs.length-1);
	var splt =srcs.split(",");
	//alert(splt);
	for ( i = 0 ; i < splt.length; i++)
	{
		var src = splt[i];
		var objfl = getElemnt('_jsFile'+src);
		if(!objfl)
		{
		      //alert("registereing \n id " +id + "\n src " + src);
		      var oScr = document.createElement("script");
		      oScr.id ='_jsFile'+ src;		     
		      document.getElementsByTagName("head")[0].appendChild(oScr);
		      oScr.src = pth+src;
		      //alert(oScr.outerHTML);
		}
	}
}

/*function addScriptBlock(src,id)
{

  //alert("addScriptBlock \n id " +id + "\n src " + src);
  var objfl = getElemnt(id);
  //alert("id " +id + "\n src " + src);
  if(!objfl)
  {
      //alert("registereing \n id " +id + "\n src " + src);
      var oScr = document.createElement("script");
      if (id) oScr.id = id;
      document.getElementsByTagName("head")[0].appendChild(oScr);
      oScr.src = src;
  }
}*/

var _objHTMLMain = new htmlMain();

//function called from container
function _registerviewerarea(containerName, doc_view_id, defaultSaveURL, defaultSaveDivName, isUserModified)
{
    //alert("_registerviewerarea \n containerName = " + containerName +"\n defaultSaveDivName "+ defaultSaveDivName);
	//Tracker#:23067  FDD 374 FR2,3 AND 6 -> GLOBAL SEARCH - PARTY : ADD PARTY AS PART OF GLOBAL SEARCH
	// added try catch to avoid js error when printing the supplier recommendation popup
	try
	{
		_objHTMLMain.registerAreaObj(containerName, doc_view_id, defaultSaveURL, defaultSaveDivName, isUserModified);
	}
	catch(e)
	{}
}

//called from the section
function _registersectionarea(containerName, doc_view_id, defaultSaveURL, divSectionId, isDefaultView, defaultSaveDivName, isUserModified)
{
    //alert("_registersectionarea \n containerName = " + containerName +"\n defaultSaveDivName "+ defaultSaveDivName);
    _objHTMLMain.registerChildAreaObj(containerName, doc_view_id, defaultSaveURL, divSectionId, isDefaultView, defaultSaveDivName, isUserModified);
}

function _getWorkAreaDefaultObj()
{
    var htmlAreaObj = _objHTMLMain.getWorkAreaObj();

    //alert("_getWorkAreaObj : htmlAreaObj.getDefaultChildAreaObj()  " + htmlAreaObj.getDefaultChildAreaObj());

    if(htmlAreaObj && htmlAreaObj.getDefaultChildAreaObj())
    {
        //alert("default area");
         htmlAreaObj = htmlAreaObj.getDefaultChildAreaObj();
    }
    return htmlAreaObj;
}

function _getToolBarAreaDefaultObj()
{
    var htmlAreaObj = _objHTMLMain.getToolBarAreaObj();
    if(htmlAreaObj && htmlAreaObj.getDefaultChildAreaObj())
    {
         htmlAreaObj = htmlAreaObj.getDefaultChildAreaObj();
    }
    return htmlAreaObj;

}

function _getNavigationAreaDefaultObj()
{
    var htmlAreaObj = _objHTMLMain.getNavigationAreaObj();
    if(htmlAreaObj && htmlAreaObj.getDefaultChildAreaObj())
    {
         htmlAreaObj = htmlAreaObj.getDefaultChildAreaObj();
    }
    return htmlAreaObj;
}

function _getAreaObj(areaName)
{
    return _objHTMLMain.getAreaObj(areaName);
}

function _getWorkAreaObj()
{
    var htmlAreaObj = _objHTMLMain.getWorkAreaObj();
    return htmlAreaObj;
}

function _getToolBarAreaObj()
{
    var htmlAreaObj = _objHTMLMain.getToolBarAreaObj();
    return htmlAreaObj;

}

function _getNavigationAreaObj()
{
    var htmlAreaObj = _objHTMLMain.getNavigationAreaObj();
    return htmlAreaObj;
}

function _getAreaObjByDocView(docviewid)
{
    var objDocVwid;
    //todo how to identify the docviewid belongs to which area
    objDocVwid = _getChldAreaObjByDocView(_getWorkAreaObj(),docviewid);
    if(objDocVwid)return objDocVwid;

    objDocVwid = _getChldAreaObjByDocView(_getToolBarAreaObj(),docviewid);
    if(objDocVwid)return objDocVwid;

    objDocVwid = _getChldAreaObjByDocView(_getNavigationAreaObj(),docviewid);    
    if(objDocVwid)return objDocVwid;

    return null;
}

function _getAreaHTMLDataObjByDocView(docviewid)
{
    var objHTMLData;
    //todo how to identify the docviewid belongs to which area
    var objHTMLArea = _getAreaObjByDocView(docviewid);

    if(objHTMLArea && objHTMLArea.getHTMLDataObj())
    {
        objHTMLData = objHTMLArea.getHTMLDataObj();
    }

    return objHTMLData;
}

function _getChldAreaObjByDocView(areaobj, docviewid)
{
    var objDocVwid;

    if(areaobj)objDocVwid = areaobj.getChildAreaObj(docviewid);
    if(objDocVwid)return  objDocVwid;
    return null;
}

function _removeChildAreaObj(objAjax)
{
	//alert("_removeChildAreaObj");
    if(objAjax)
    {
        if(objAjax.getDivContainerName() && objAjax.getDocViewId())
        {
            _objHTMLMain.removeChildAreaObj(objAjax.getDivContainerName(), objAjax.getDocViewId());
        }
    }
}

function htmlMain()
{
    var _pageAreaId;
    var _arrhtmlAreaObj;

    this._pageAreaId =  new Array("_divWorkArea","_divToolArea","_divNavigationArea");
    this._arrhtmlAreaObj = new Array(); //collection of htmlAreaObj objects

	this.registerAreaObj = _registerAreaObj;
	this.registerChildAreaObj = _registerChildAreaObj;
	this.getAreaObj = _getAreaObj;
	this.getChildAreaObj = _getChildAreaObj;
	this.resetAreaDataObj = _resetAreaDataObj;
	this.removeChildAreaObj = _removeChildAreaObj;
    this.getWorkAreaObj = _getWorkAreaObj;
    this.getNavigationAreaObj = _getNavigationAreaObj;
    this.getToolBarAreaObj = _getToolBarAreaObj;

	function _getWorkAreaObj()
    {
        //alert("_getWorkAreaObj :   this._pageAreaId[0] " + this._pageAreaId[0]);
        //alert("_getWorkAreaObj : " + this.getAreaObj(this._pageAreaId[0]));
        return this.getAreaObj(this._pageAreaId[0]);
    }

    function _getToolBarAreaObj()
    {
        return this.getAreaObj(this._pageAreaId[1]);
    }

    function _getNavigationAreaObj()
    {
        return this.getAreaObj(this._pageAreaId[2]);
    }

	function _registerAreaObj(containerName, doc_view_id, defaultSaveURL, defaultSaveDivName, isUserModified)
    {
       //alert("_setAreaObj: \n containerName = " + containerName + " htmlDataObj " + htmlDataObj);

        var cnt = this._pageAreaId.length;
        var confound = false;

        for(var i=0;i<cnt;i++)
        {
            //alert("_registerAreaObj :  this._pageAreaId[" + i + "] = " + this._pageAreaId[i] + "\n containerName " + containerName);
            if(this._pageAreaId[i]==containerName)
            {
                 var _htmlAreaDataObj = new _htmlAreaObj(doc_view_id, containerName, defaultSaveURL, defaultSaveDivName, isUserModified);
                 //alert("_registerAreaObj : setting -> this._pageAreaId[" + i + "] = " +this._pageAreaId[i] + "\n containerName " + containerName);
                this._arrhtmlAreaObj[i] = _htmlAreaDataObj;
                confound = true;
            }
        }
    }

    function _registerChildAreaObj(divContainerName, docViewId, saveURL, divSectionId, isDefaultView, defaultSaveDivName, isUserModified)
    {
        var objHTMLAreaObj = this.getAreaObj(divContainerName);
        if(objHTMLAreaObj)
        {
            if(defaultSaveDivName==null)
            {
                defaultSaveDivName =  objHTMLAreaObj.getDivSaveContainerName();
            }
            objHTMLAreaObj.addChildArea(docViewId, divContainerName, saveURL, divSectionId, isDefaultView, defaultSaveDivName, isUserModified);
        }
    }

    function _getAreaObj(divContainerName)
    {
        var cnt = this._pageAreaId.length;

        for(var i=0;i<cnt;i++)
        {
            //alert("_getAreaObj: getting -> this._arrhtmlAreaObj[" + i + "] = " +this._arrhtmlAreaObj[i] + "\n divContainerName " + divContainerName);
            if( this._arrhtmlAreaObj[i] &&  this._arrhtmlAreaObj[i].getDivContainerName()==divContainerName)
            {
                return   this._arrhtmlAreaObj[i];
            }
        }
        return null;
    }

    function _getChildAreaObj(divContainerName, docViewId)
    {
        var objHTMLAreaObj = this.getAreaObj(divContainerName);
        if(objHTMLAreaObj)
        {
            return objHTMLAreaObj.getChildAreaObj(docViewId);
        }
        return null;
    }

    function _resetAreaDataObj(divContainerName)
    {
        var objHTMLAreaObj = this.getAreaObj(divContainerName);
        if(objHTMLAreaObj)
        {
            objHTMLAreaObj.resetHTMLData();
        }
    }

    function _removeChildAreaObj(divContainerName, docViewId)
    {
        var objHTMLAreaObj = this.getAreaObj(divContainerName);
        if(objHTMLAreaObj)
        {
            objHTMLAreaObj.removeChildAreaObj(docViewId);
        }
    }
	return this;
}

function _htmlAreaObj(docViewId, divContainerName, saveURL, defaultSaveDivName, isUserModified) //constructor
{
    var _mDocViewId = "";
    var _mDivContainerName = "";
    var _mDivDefaultSaveContainerName = null;  // which will specify the save container name
    //for search list screen, specify the section div id where the search results are specified
    //so that when user does modifies and saves the changes, it refreshes only that part.
    var _mSaveURL = "";
    var _mHTMLData = null;
    var _mDivSectionId = null;
    // Tracker#:14240 COMMENTS TAB / THREADED MESSAGING ON COLOR LIB SCREEN ICON
    // to set and get attributes using htmlAreaObj
    var _attributeHandler;
    var _dataModifiedForNavigation;

    var _areaId;
    var _areaHTMLData;
    var _arrChildren;
    var _defaultViewId;

    this._arrChildren= new Array();  //contains htmlAreaObj collection

    this.addChildArea = _addChildArea;
    this.hasChildren =    _hasChildren;
    this.removeAllChildren = _removeAllChildren;
    this.getChildAreaObj =  _getChildAreaObj;
    this.removeChildAreaObj =  _removeChildAreaObj;
    this.getDocViewId = _getDocViewId;
    this.getDivContainerName = _getDivContainerName;
    this.getDivSaveContainerName = _getDivSaveContainerName;
    this.getDivDefaultSaveContainerName = _getDivDefaultSaveContainerName;
    this.setDivDefaultSaveContainerName = _setDivDefaultSaveContainerName;
    this.getSaveURL = _getSaveURL;
    this.getHTMLDataObj = _getHTMLDataObj;
    this.resetHTMLData =  _resetHTMLData;
    this.checkForNavigation = _checkForNavigation;
    this.setDivSectionId = _setDivSectionId;
    this.getDivSectionId = _getDivSectionId;
    this.getHTMLAjax = _getHTMLAjax;
    // Tracker#:14240 COMMENTS TAB / THREADED MESSAGING ON COLOR LIB SCREEN ICON
    this.attribute = _attribute;

    //constructor values initialising
    this._mDocViewId = docViewId;
    this._mDivContainerName = divContainerName;
    this._mDivSectionId = null;
    this._mSaveURL = saveURL;
    this._mDivDefaultSaveContainerName = defaultSaveDivName;
    this._mHTMLData = new htmlData(docViewId, divContainerName, saveURL, isUserModified);
	this._defaultViewId = null;
	// Tracker#:14240 COMMENTS TAB / THREADED MESSAGING ON COLOR LIB SCREEN ICON
	this._attributeHandler = new htmlAttribute();
	//Tracker#:23049 SAVE MESSAGE AFTER CLOSING LINE BOARD REPORT 
	// declared the private variable for the html area object to define true/false at screen
	// level to decide the screen changed fileds to checked while navigating.
	this._dataModifiedForNavigation = true;
	this.getDataModifiedForNavigation = _getDataModifiedForNavigation;
	this.setDataModifiedForNavigation = _setDataModifiedForNavigation;
 
    this.getDefaultChildAreaObj = _getDefaultChildAreaObj;

    this.getAllDocViewIds = _getAllDocViewIds;
    /********************************************************/
    /**
      *
      * Exposing all the registered Doc Views for this area object...
      * Required to clear all the changed fields during search on the
      * Cost Optimization screen....
      *
      * tracker#: 25828
      *
      * @since 2014/R1
      *
    **/
    function _getAllDocViewIds()
    {
        var docViewid = this.getDocViewId();
        var cnt = this._arrChildren.length;

        for(var i=0;i<cnt;i++)
        {
            if(this._arrChildren[i])
            {
                if(docViewid && docViewid.length>0){
                    docViewid += ",";
                }
                docViewid += this._arrChildren[i].getAllDocViewIds();
            }
        }
        return docViewid;
    }
    /********************************************************/

    function _setDataModifiedForNavigation(dataModifiedForNav)
	{
		//alert(dataModifiedForNav);
		this._dataModifiedForNavigation = dataModifiedForNav;
	}

	function _getDataModifiedForNavigation()
	{
		//alert(this._dataModifiedForNavigation);
		return this._dataModifiedForNavigation;
	}

    function _getHTMLAjax()
    {
        var objAjax = new htmlAjax();
        if(objAjax)
        {
        	//alert("_getHTMLAjax: " + this._mDocViewId);
            objAjax.setDocViewId(this._mDocViewId);
            //alert("after setting doc view");
            objAjax.setDivContainerName(this.getDivSaveContainerName());
            objAjax.setDivSectionId(this._mDivSectionId);
            objAjax.setActionURL(this._mSaveURL);
            //alert("objreturned");
            return objAjax;
        }
        return null;
    }

	function _setDivSectionId(divSectionId)
	{
		this._mDivSectionId = divSectionId;
	}

	function _getDivSectionId()
	{
		return this._mDivSectionId;
	}

    function _getDefaultChildAreaObj()
    {

    	var objChldObj = null;

    	//alert("this._defaultViewId " + this._defaultViewId);

    	if(this._defaultViewId)
    	{

    		objChldObj = this.getChildAreaObj(this._defaultViewId);
    	}

    	if(!objChldObj)
    	{
	        var cnt =  this._arrChildren.length;
	        //alert("_getDefaultChildAreaObj : cnt "  +cnt);
	        if(cnt>=1)
	        {
	            //alert("_getDefaultChildAreaObj : return  first one " );
	            objChldObj = this._arrChildren[0];
	        }
        }
        return objChldObj;
    }

    function _resetHTMLData()
    {
        if(this._mHTMLData)
        {
            this._mHTMLData = this._mHTMLData.clone();
        }

        var cnt = this._arrChildren.length;

        for(var i=0;i<cnt;i++)
        {
            if(this._arrChildren[i])
            {
                this._arrChildren[i].resetHTMLData();
            }
        }
    }

    function _getDocViewId()
    {
        return this._mDocViewId;
    }

    function _getDivContainerName()
    {
        return this._mDivContainerName;
    }

    function _getDivSaveContainerName()
    {
        //alert("_getDivSaveContainerName ");
        if(this._mDivDefaultSaveContainerName!=null && this._mDivDefaultSaveContainerName!='')
        {
            //alert("this._mDivDefaultSaveContainerName \n " + this._mDivDefaultSaveContainerName);
            return this._mDivDefaultSaveContainerName;
        }
        else
        {
            //alert("this._mDivContainerName \n " + this._mDivContainerName);
            return this._mDivContainerName;
        }
    }

    function _getDivDefaultSaveContainerName()
    {
        return this._mDivDefaultSaveContainerName;
    }

    function _setDivDefaultSaveContainerName(contName)
    {
        if(contName=="undefined" || contName==null)
        {
            contName = "";
        }
        this._mDivDefaultSaveContainerName = contName;
    }

    function _getSaveURL()
    {
        return this._mSaveURL;
    }

    function _getHTMLDataObj()
    {
        return this._mHTMLData;
    }

    function _addChildArea(docViewId, divContainerName, saveURL, divSectionId, isDefaultView, _mDivDefaultSaveContainerName, isUserModified)
    {
    	//alert("isDefaultView "  + isDefaultView);

    	if(isDefaultView==true)
    	{
    		//alert("docViewId  "  +docViewId);
    		this._defaultViewId = docViewId;
    	}

    	if(this._mHTMLData.hasUserModifiedData()==true)
    	{
    	    isUserModified = this._mHTMLData.hasUserModifiedData();
    	}

        var objHTMLAreaObj = new _htmlAreaObj(docViewId, divContainerName, saveURL, _mDivDefaultSaveContainerName, isUserModified);
        if(objHTMLAreaObj)
        {
        	objHTMLAreaObj.setDivSectionId(divSectionId);
            var arrLength = this._arrChildren.length;
            this._arrChildren[arrLength] = objHTMLAreaObj;
        }
    }

    function _hasChildren()
    {
        var hasChildrenVal = false;

        if(this._arrChildren.length>0)
        {
           hasChildrenVal = true;
        }

        return hasChildrenVal;
    }

    function _removeAllChildren()
    {
        this._arrChildren = new Array();
    }

    function _getChildAreaObj(docViewId)
    {
        var cnt = this._arrChildren.length;

        for(var i=0;i<cnt;i++)
        {
            if(this._arrChildren[i] && this._arrChildren[i].getDocViewId()==docViewId)
            {
                return this._arrChildren[i];
            }
        }
        return null;
    }

    function _removeChildAreaObj(docViewId)
    {
        var cnt = this._arrChildren.length;
		var arrTemp = new Array();
		var j=0;
		//alert("_removeChildAreaObj : before remove cnt " + cnt);
        for(var i=0;i<cnt;i++)
        {
        	//alert("this._arrChildren["+i+"].getDocViewId() " + this._arrChildren[i].getDocViewId() +"\n docViewId = "+docViewId);
            if(this._arrChildren[i] && this._arrChildren[i].getDocViewId()!=docViewId)
            {
                //i=cnt;
                //alert("_removeChildAreaObj : remove index "  + i + "\n cnt " + cnt);
                //this._arrChildren[i].reduce();
                //alert("removed \n cnt = " + this._arrChildren.length);
                //break;
                //alert("setting");
                if(this._defaultViewId==docViewId)this._defaultViewId = null;
                arrTemp[j++] = this._arrChildren[i];
            }
            else
            {
            	//alert("not setting");
            }
        }
        this._arrChildren = arrTemp;
        //alert("_removeChildAreaObj : remove after cnt  " + cnt);
    }

    function _checkForNavigation()
    {
    
    	var htmlAreaObj = _getWorkAreaDefaultObj();
		//Tracker#:23049 SAVE MESSAGE AFTER CLOSING LINE BOARD REPORT 
		//show save confirm message only if the htmlAreaObj.getDataModifiedForNavigation() is true.
		if(htmlAreaObj && htmlAreaObj.getDataModifiedForNavigation()==false)
		{
			return null;
		}
        // Tracker#:14095 ISSUE WITH SAVE PROMPT:'THERE ARE CHANGES ON THE SCREEN.  DO YOU WANT TO SAVE..'
        // Added the additional condition (this._mHTMLData.isDataModified()) to identify
        // the field data modified or not.
        if(this._mHTMLData && this._mHTMLData.hasUserModifiedData() && this._mHTMLData.isDataModified())
        {
            if (confirm(szMsg_Changes))
            {
                return this._mHTMLData;
            }
        }
        return null;
    }
	// Tracker#:14240 COMMENTS TAB / THREADED MESSAGING ON COLOR LIB SCREEN ICON
	function _attribute()
	{
	    return this._attributeHandler;
	}

    return this;
}

//To close tool bar
    function closeToolBar(divId,button)
    {
		var elem=getElemnt(divId);
	    var mystf=getElemnt(button);
	    if(mystf)
	    {
	    	mystf.className="clsToolBarMenuButton";
	    }
	    elem.style.visibility="hidden";
	    elem.style.display = "none";
	    alignWorkAreaContainer();
	}
	//Called when buttons on toolbar clicked
	function makeButtonsInactive(ActiveButtonId)
	{
		//alert('inside makeButtonsInactive');
		//alert('ActiveButtonId:'+ActiveButtonId);
		var obj=getElemnt("toolBarRow");
		var elms=obj.getElementsByTagName("td");
		for(var i=0;i<elms.length;i++)
		{
			if(elms[i])
			{
				//alert('elms[i].id:'+elms[i].id);
				if(elms[i].id)
				{
					if(elms[i].id!=ActiveButtonId)
					{
						var btn=getElemnt(elms[i].id);
					    if(btn)
					    {
					    	btn.className="clsToolBarMenuButton";
					    }
					}
				}
			}
		}
	}

	function _showMaterialListPage(objAjax)
    {
       // alert(" _showColorLibPage: \n sectionName "+sectionName);
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
            //Tracker#:16082 -ABILITY TO SHARE THE CLIPBOARD WITH OTHER USERS
            //Checking for response attribute skipSmrtTag. If set to '1' then passing the skipTag property true
            var skipSmrtTag = objAjax.getResponseHeader("skipSmrtTag");
            var skipTag=false;
            if(skipSmrtTag && skipSmrtTag=='1');
            {
            	skipTag=true;
            }
           
            _reloadArea(objAjax, sectionName,skipTag);
            bShowMsg= false;
        }
    }

	//called when pagination next number is clicked
    function showNextPage(pageNo,sec,url)
    {
        //alert(" main.js \n showPage: \n sec "+sec+" url="+url);
        sectionName = sec;

        var htmlAreaObj = _getWorkAreaDefaultObj();
        var objAjax = htmlAreaObj.getHTMLAjax();
        var objHTMLData = htmlAreaObj.getHTMLDataObj();        
        
        if(objAjax)
        {
        	// Tracker#: 19807 - LEFT NAVIGATION NEEDS TO BE MADE COLLAPSIBLE
        	_showWorkArea.toggleNav.unRegisterAll();
        	_showWorkArea.toggleNav.clearCollapsableIds();
        	
        	if(objHTMLData!=null && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
            {
            	var htmlErrors = objAjax.error();
                htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
                                
                messagingDiv(htmlErrors, "_continueShowNextPageSave()", "_continueShowNextPage('"+pageNo+"','"+url+"')");
            }
            else
            {
            	_continueShowNextPage(pageNo,url);
            }
        }
    }
    
    function _continueShowNextPageSave()
    {    	
    	//alert("_continueShowNextPageSave  ") ;
    	closeMsgBox();
    	var htmlAreaObj = _getWorkAreaDefaultObj();
    	var objAjax = htmlAreaObj.getHTMLAjax();
    	
    	if(objAjax)
    	{	
	    	var docviewid = objAjax.getDocViewId();
	    	//alert("docviewid" + docviewid);
	    	
			if (docviewid == 12701)
			{
				//alert("saving 12701");
				objHtmlData.performSaveChanges(refreshFields);
			}
			else
			{
				objHtmlData.performSaveChanges(_defaultWorkAreaSave);
			}
    	}
    }
    
    function _continueShowNextPage(pageNo,url)
    {
    //	alert("_continueShowNextPage pageNo " +pageNo + "\n url ->" + url) ;
  
    	closeMsgBox();
    	
    	var htmlAreaObj = _getWorkAreaDefaultObj();
    	var objAjax = htmlAreaObj.getHTMLAjax();
    	
    
    	    	
    	if(objAjax)
		{		
    		
    		
        	objAjax.setActionURL(url);
        	objAjax.setActionMethod("PAGING&pageNum="+pageNo+"&sec="+sectionName);
           	objAjax.setProcessHandler(_continueShowNextPageCallBack);
        	objAjax.sendRequest();
		}
    }
    
    function _continueShowNextPageCallBack(objAjax)
    {   
    	if(objAjax.isProcessComplete())
        {
        	var htmlAreaObj = _getWorkAreaDefaultObj();
        	var objHTMLData = htmlAreaObj.getHTMLDataObj();
        	//alert("_continueShowNextPageCallBack here1"+sectionName);
            objHTMLData.resetChangeFields();
           // alert("_continueShowNextPageCallBack resetChangeFields"+sectionName);
        }    	
    	_showMaterialListPage(objAjax);	       	
    }
    

    function getHTMLAjax()
    {
        var htmlAreaObj = _getWorkAreaDefaultObj();
        //alert("htmlAreaObj " + htmlAreaObj);
        var objAjax = htmlAreaObj.getHTMLAjax();

        if(!objAjax)objAjax = new htmlAjax();
        return objAjax;
    }

//This can be used to retain the rows as checked, after executing process from a list.
// chngedRows, is an array of changed fields.
// Can be obtained like chngedRows=objHTMLData.getChangeFields()
function retainSelectedRows(chngedRows)
{
	if(chngedRows)
	{
		for(i=0;i<chngedRows.length;i++)
		{
			var valobj=getElemnt(chngedRows[i]);
			if(valobj!= null && valobj.type && valobj.type=='checkbox')
			{
				valobj.checked=true;
				if(valobj.onclick)
				{
				    valobj.onclick();
				}
			}
		}
	}
}

// This aligns the Work Area Container to match to that of the Screen Width and Height
var alignWorkAreaContainer = (function (window, $window, undefined) {
 	var takePaddingHeight = 0;
	var heightToScreenBottom = function (obj) {
		var $obj = $(obj);
		if ($obj.length > 0)
		{
			var offset = $obj.offset();
			$obj.height ( $window.height() - offset.top );
		}
	};
	
	return function () {
		//--Tracker#: 23067 FR2,3 AND 6 -> GLOBAL SEARCH - PARTY : ADD PARTY AS PART OF GLOBAL SEARCH
		// popop not required for aligning workarea
		if( typeof(nMenuWidth)=="undefined" || !nMenuWidth )
		{		
			return;
		}
	    var workAreaContainer = document.getElementById("_divWorkAreaContainer"),
	    	$workAreaContainer = $(workAreaContainer);
	    /*
	    if (nCurScrWidth <= MinimumScrWidth)
	    {
	        // If screen width space less than MinimumScrWidth (1152) then consider MinimumScrWidth as the max space available.
	        divStyle.style.width = MinimumScrWidth - nMenuWidth+"px";
	        // adjust the outer div to else the scrolls will appear
	        if (workAreaContainer)
	        {
	            workAreaContainer.style.width = MinimumScrWidth - nMenuWidth+"px";
	        }
	    }
	    */
        
	    /*
	    var workAreaOffset = $workAreaContainer.offset(),
	    	workAreaContainerHeight = $workAreaContainer.height();
	    */
	    /*
	    var $mainContentContainer = $('#mainContentContainer'),
	    	contentContainerOffset = $mainContentContainer.offset();
	    $mainContentContainer.height( $(window).height() - contentContainerOffset.top );
	    */
	    
	    heightToScreenBottom($('#mainContentContainer'));
	    //heightToScreenBottom($('#_divDataWorkArea'));    	
        
	    var isDataWorkAreaObj = false;
	    var divStyle = document.getElementById(_const_divDataWorkArea);
	    if(!divStyle)
	    {
	        divStyle = document.getElementById("_divWorkAreaContainer");
	        if(divStyle)
    		{
        		divStyle.style.overflow="auto";
    		}
    		takeLeftPadding = 0;	
	    }
	    else
	    {
	        if(workAreaContainer && workAreaContainer.style)
			{
        		workAreaContainer.style.overflow="hidden";
			}
	        isDataWorkAreaObj = true;

    		var myStuffDiv = getElemnt("_divToolArea");
    		var myStuffDivHt = 0;

    		if(myStuffDiv  && myStuffDiv.style && myStuffDiv.style.visibility!="hidden")
    		{
        		myStuffDivHt = myStuffDiv.offsetHeight;

    		}

    		var tableHt = 0;
    		if(isDataWorkAreaObj)
    		{
        		var toolBarContainer = getElemnt("_tableContentViewerMain_divWorkArea");
        		tableHt = parseInt(toolBarContainer.offsetHeight);
    		}

    		// Subtracting 2px as an adjustment value to remove the scrolling on Safari browser.
    		divStyle.style.height = parseInt(nCurScrHeight-(getElemnt('TSSHEADER').offsetHeight)) - myStuffDivHt - takePaddingHeight - tableHt - 2 + "px";
    		
    		alignNavigatorBar(divStyle, tableHt);    
		}
	    navigation.alignHeight(workAreaContainer);
	};
	
})(window, $(window));

function alignNavigatorBar(divStyle, tableHt)
{
    var obj;
    var objCont;

    if(typeof(arrNavViewer)!='undefined' && arrNavViewer && arrNavViewer.length)
    {
        navCnt = arrNavViewer.length;
        for(i=0;i<navCnt;i++)
        {
            obj =   getElemnt(arrNavViewer[i])
            objCont = getElemnt(arrNavViewer[i]+ "_tabcontainer");
            if(obj && objCont)
            {
                if(objCont.style.visibility=="visible" ||  objCont.style.visibility.toString().length==0)
                {
                    break;
                }
            }
        }
    }

    var navCnt=0;

    if( (typeof(arrNavViewer)!='undefined') &&  arrNavViewer && arrNavViewer.length)
    {
        navCnt = arrNavViewer.length;
    }

    if(obj && objCont)
    {
        // Reset the Design Center height too.
        // Consider Padding too
        objCont.style.height = divStyle.offsetHeight - (parseFloat(obj.offsetHeight)*navCnt) - (3*(navCnt-1)) + tableHt - 7 + "px"; // + 20;
        // If the height of the Navigator Bar is more than that of the Work Area then reset the work area div.
        var navAreaHt = getElemnt("_divNavArea").offsetHeight;
        if(parseInt(navAreaHt) > divStyle.offsetHeight)
        {
            objCont.style.overflowY="auto";
        }
    }
}

function _refitSection(divId)
{
    if(nCurScrWidth > MinimumScrWidth)
    {
        workAreaDivsList[workAreaDivsList.length]=divId;
    }
}

function resetAllMainDivs()
{
     for(var i = 0 ; i < workAreaDivsList.length ; i++)
    {
        var divID = workAreaDivsList[i];
        if(divID != null && typeof(divID) != 'undefined')
        {
            var divsList = document.getElementsByName(divID);

            if(typeof(divsList.length) != 'undefined')
            {
                for(var y = 0 ; y < divsList.length ; y++)
                {
                    var divObj = divsList[y];
                    if(divObj && typeof(divObj) != 'undefined' && divObj.className != "clsoverviewsection")
                    {
                        divObj.style.width = "100%";
                    }
                }
            }
        }
    }

    divObj = document.getElementById(_const_divDataWorkArea);// document.getElementById("_divWorkArea");
    // Tracker#: 16210
    // When Sourcing screens call this method (call included in main.jsp) then WorkArea divs will not
    // be available.
    if(divObj && typeof(divObj) != 'undefined')
    {
        divObj.style.width = "100%";
    }
    divObj = document.getElementById("_divWorkArea");// document.getElementById("_divWorkArea");
    if(divObj && typeof(divObj) != 'undefined')
    {
        // Tracker#: 17350 - Firefox: To get rid of work area horizontal scrollbar
    	// in Design screens, _divWorkArea width changed to auto instead of 100%
    	// since 100%+6px left-padding is wider than parent width.
    	divObj.style.width = "auto";
        divObj.style.overflow="hidden";
    }

}

// function _refitBOMCSection(divId, section)
function _refitCustomSection(divId, setWidthToByValue)
{
	if(nCurScrWidth > MinimumScrWidth)
    {
        // var divObj = document.getElementById(divId);
        var divsList = document.getElementsByName(divId);

        if(divsList && typeof(divsList.length) != 'undefined' )
        {
            for(var i = 0 ; i < divsList.length ; i++)
            {
                var divObj = divsList[i];
                if(divObj && typeof(divObj) != 'undefined')
                {
                    if(setWidthToByValue)
                    {
                    	if($("#"+divObj.id).attr('docviewid')+""=='2411')
                		{
                			divObj.style.width = parseInt(nCurScrWidth)- 52 + "px";
                		}
                    	else
                		{
                			divObj.style.width = parseInt(nCurScrWidth-nMenuWidth)- 42 + "px";
                		}
                    }
                    else
                    {
                        divObj.style.width = "100%";
                    }
                }
            }
        }
    }
    
    _showWorkArea.toggleNav.register('_refitCustomSection', arguments);
}

// To open up the PLM report window.
function generateReport(id, name)
{
	//Tracker#13895.Removing the invalid Record check and the changed fields check(Previous logic).

    // Tracker#: 13709 ADD ROW_NO FIELD TO CONSTRUCTION_D AND CONST_MODEL_D
	// Check for valid record to execute process(New logic).
   	if(!isValidRecord(true))
	{
		return;
	}

	//Tracker# 13972 NO MSG IS SHOWN TO THE USER IF THERE ARE CHANGES ON THE SCREEN WHEN USER CLICKS ON THE REPORT LINK
	//Check for the field data modified or not.
	var objHtmlData = _getWorkAreaDefaultObj().checkForNavigation();

	if(objHtmlData!=null && objHtmlData.hasUserModifiedData()==true)
    {
        //perform save operation
        objHtmlData.performSaveChanges(_defaultWorkAreaSave);
    }
    else
    {
		var str = 'report.do?id=' + id + '&reportname=' + name;
    	oW('report', str, 800, 650);
    }

}

// ---------------------------------------------------------------
// Tracker#: 13512  MOVE FITEVAL INTO PLM FRAMEWORK
// ---------------------------------------------------------------
// Generic functions to show or hide the Search List Icon div that appears
// next to the Any link on the Navigator
function showNavigationListIcon()
{

    try
    {
        var searchListImage = document.getElementById("searchListImage");
        if(searchListImage)
        {
            searchListImage.style.visibility = "visible";
            searchListImage.style.display = "inline-block";
        }
    }
    catch(e)
    {
        //Eat the exception
    }
}

function hideNavigationListIcon(docId)
{
    try
    {
    	//alert("main.js  docid " + docId + "\n navCounter" + divCounter);
        var searchListImage = document.getElementById("searchListImage"+docId+ divCounter);
        if(searchListImage)
        {
            searchListImage.style.visibility = "hidden";
            searchListImage.style.display = "none";
        }
    }
    catch(e)
    {
        //Eat the exception
    }
}
// Tracker#:12630 ISSUES ON COLOR PALETTE BLANK RECORD
// check the hidden component(_isValidScreen) which is built with value is
// '0' if the BO has valid header record otherwise value is '1'. If the
// component value is '0' give the message when process is called on blank
// screens. If 'displayMessage' is false and component value is '0' function
// returns false without showing error message.
function isValidRecord(displayMessage)
{
    return _checkIsValidRecord("_isValidScreen", displayMessage, szMsg_Invalid_Rec);
}

// Tracker#:12621 ISSUES ON BLANK RECORD OF TECH SPEC
// check the hidden component(_isValidTechSpec) which is built with value is
// '0' if the TechSpecBO has valid header record otherwise value is '1'. If the
// component value is '0' give the message when process is called on blank
// screens. If 'displayMessage' is false and component value is '0' function
// returns false without showing error message.
function isValidTecSpec(displayMessage)
{
    return _checkIsValidRecord("_isValidTechSpec", true, szMsg_Invalid_TechSepc);
}

function isValidMaterialQuote(displayMessage)
{
    return _checkIsValidRecord("_isValidMaterialQuote", true, szMsg_Invalid_Rec);
}
function isValidMaterialOffResp(displayMessage)
{
    return _checkIsValidRecord("_isValidMateOffRespScreen", true, szMsg_Invalid_Rec);
}

// Tracker#:12621 ISSUES ON BLANK RECORD OF TECH SPEC
// check the hidden component which is built with value is
// '0' if the BO has valid header record otherwise value is '1'. If the
// component value is '0' give the message when process is called on blank
// screens. If 'displayMessage' is false and component value is '0' function
// returns false without showing error message.
function _checkIsValidRecord(id, displayMessage, msg)
{
	var obj = getElemnt(id);
	if(obj!=null  && obj.value != 'undefined')
	{
		var val = obj.value;
		 // alert("value="+val);
		 // alert("dispalyMessage"+dispalyMessage);
		if(displayMessage && val == '0')
		{
			// alert("isValidScreen");
			if(displayMessage)
			{
				var htmlAreaObj = _getWorkAreaDefaultObj();
				var objAjax = htmlAreaObj.getHTMLAjax();
				var htmlErrors = objAjax.error();
				objAjax.error().addError("warningInfo", msg, false);
				messagingDiv(htmlErrors);
			}
			return false;
		}
	}

	return true;
}

// Tracker#:17452
// execute custom rules
function executePLMRules(actionURL, ruleName, queryArgs, callback)
{
	closeMsgBox();
	var url = "rule&id=" + ruleName + "&" + queryArgs;
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
	/**
    * Tracker#:23839 SAMPLE TRACKING TOOLBAR DISAPPEARS UPON SAVE
    * sectionName used to come MainSection, as we repainting work area
    * sectionName is set to _divWorkArea.
    */
    sectionName = "_divWorkArea";
    bShowMsg = true;

    if(objAjax && objHTMLData)
    {
    	if(!isValidRecord(true))
   		{
   			return;
   		}

   		loadWorkArea(actionURL, url, null, callback);
    }
}

//Tracker#:18596 MATERIAL PROJECTION SUMMARY REPORT
// To invoke the query xml report from the PLM
// method refers to the method in reporting servlet.
//sample input -openBBReport(5806, 0, 'mpsreport' , 'mpsreport');
function openBBReport(id, level, name , method)
{
   var str = 'report?id=' + id + '&method='+ method + '&level=' + level + '&reportname=' + name ;
   oW('report', str, 800, 650);
}

function oW(wname,url,nWidth,nHeight)
{
    var nWindow = window.open(url, wname,'width=' + nWidth + ',height=' + nHeight + ',toolbar=no,menubar=no,scrollbars=no,resizable=yes')
}

function cancelProcess()
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
    
    if(htmlAreaObj)
    {
    	var objHTMLData = htmlAreaObj.getHTMLDataObj();
    	
    	if(objHTMLData)
    	{
    		objHTMLData.resetForm();
        	objHTMLData.resetChangeFields();	
    	} 
    }
          
   	closeMsgBox();
}

//Tracker#:20812 Adding functions within the namespacing 
var Main = {		
	
	//loadWorkArea with new UI save confirm message.
	loadWorkArea: function (url, actionMethod, divSaveContainerName, processHandler, origObjAjax, checkModData)
	{
		//alert("processHandler " + processHandler);
	    _executePreProcess();
	    //alert("checkModData " + checkModData);
	    if(checkModData != false)
	    {
	    	var htmlAreaObj = _getWorkAreaDefaultObj();
	    	var objAjax = htmlAreaObj.getHTMLAjax();    	
	        var objHTMLData = htmlAreaObj.getHTMLDataObj();
	    	//alert(objHTMLData);
	    	if(objHTMLData && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
		    {
		        var htmlErrors = objAjax.error();
		        htmlErrors.addError("confirmInfo", szMsg_Changes,  false);	       
		        var cancelFunc = "\"Main.loadWorkAreaWithProcess(\'"+url+"\',\'"+actionMethod+"\',\'"+divSaveContainerName+"\','"
		        +processHandler+"',"+origObjAjax+")\"";
		        		        
		        var saveFunc ="\"Main.loadWorkAreaWithSave()\"";	        
		        messagingDiv(htmlErrors, saveFunc, cancelFunc);
		    }
		    else
		    {	    	
		    	Main.loadWorkAreaWithProcess(url, actionMethod, divSaveContainerName, processHandler,origObjAjax);
		    }
	    }
	    else
	    {       	
	    	Main.loadWorkAreaWithProcess(url, actionMethod, divSaveContainerName, processHandler,origObjAjax);
	    }
	},
	
	loadWorkAreaWithSave: function()
	{	
		closeMsgBox();
		var htmlAreaObj = _getWorkAreaDefaultObj();
	    var objAjax = htmlAreaObj.getHTMLAjax();    	
	    var objHTMLData = htmlAreaObj.getHTMLDataObj();
		if(objHtmlData!=null && objHtmlData.hasUserModifiedData()==true)
	    {
		  var docviewid = _getWorkAreaDefaultObj().getHTMLAjax().getDocViewId();
		  var saveFunc = _getSaveFunc();
		  //alert(docviewid);
		  if(saveFunc != "0")
		  {
		  	var saveHdlr = _getScreenSaveHandler();
			eval(saveHdlr);
		  }
		  else if (docviewid == 12701)
		  {		  	
			objHtmlData.performSaveChanges(refreshFields);
	      }
	      else
		  {
	       	objHtmlData.performSaveChanges(_defaultWorkAreaSave);
	      }
	    }
		//@2010R4
    	AutoSuggestContainer.clearComponents();		
	},
	
	loadWorkAreaWithProcess: function (url, actionMethod, divSaveContainerName, processHandler,origObjAjax)
	{
		closeMsgBox();
	    var defaultProcessHandler = _showWorkArea;
	    if(processHandler && processHandler!='undefined')
	    {
	        defaultProcessHandler = processHandler;
	    }
	    //alert("loadWorkArea : general  \n url + " + url);
	    _getWorkAreaObj().setDivDefaultSaveContainerName(divSaveContainerName);
	    var objAjax = new htmlAjax();
	    if(objAjax)
	    {
	        objAjax.setActionURL(url);
	        // Tracker#: 13512
	        // Note since this is a new instance of htmlAjax object the doc view id
	        // will not be set and if any processHandler has been passed then that
	        // method will not have access to the docviewid. Set the same.
	        objAjax.setDocViewId(_getWorkAreaDefaultObj().getHTMLAjax().getDocViewId());
	        objAjax.setActionMethod(actionMethod);
	        //alert("defaultProcessHandler " + defaultProcessHandler);
	        objAjax.setProcessHandler(defaultProcessHandler);
	        if ((url == 'techspecoverview.do') && (actionMethod.indexOf('smartcopy') != -1))
	        {
	        	objAjax._setChangeFlagsOnLoad(true);
	        }
	        if ((url == 'seasonalcaloverview.do') && (actionMethod.indexOf('smartcopy') != -1))
	        {
	        	objAjax._setChangeFlagsOnLoad(true);
	        }
	        //tracker#: 16026 MATERIAL SOURCING PROCESS
	        if ((url == 'materialoverview.do') && (actionMethod.indexOf('creatematerialquote') != -1))
	        {
	        	objAjax._setChangeFlagsOnLoad(true);
	        }
	
	    	if (origObjAjax)
	        {
	            // set the old htmlAjax object as an attribute so the message can display
	            // at the correct time (see colorlib _showColorLibPage)
	    		objAjax.attribute().setAttribute('origObjAjax', origObjAjax)
	        }
	
	        _getWorkAreaDefaultObj().getHTMLDataObj().addAllChangedFieldsData(objAjax);
	        objAjax.sendRequest();
	    } 
		AutoSuggestContainer.clearComponents();
	},
	
	resetDefaultArea: function ()
	{
		var htmlAreaObj = _getWorkAreaDefaultObj();
    	var objHTMLData = htmlAreaObj.getHTMLDataObj();
    	objHTMLData.resetForm();   
    	objHTMLData.resetChangeFields();		
	}
};



//Tracker#: 16691 MATERIAL PROJECTIONS - ENTER DATA, CLICK SORT, ROWS SORTED DATA IS LOST
//To sort the records on the selected column in the PLM list and overview screen.
function laodPLMSortColumn(action, url, processHandler)
{
	//alert('calling the new sort function');
	closeMsgBox();
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
	if(objAjax)
    {
        objAjax.setActionURL(action);
        objAjax.setActionMethod(url);
        objAjax.setProcessHandler(processHandler);
        objAjax.sendRequest();
        
        if(objAjax.isProcessComplete())
    	{
        	objHTMLData.resetChangeFields();
    	}
    }
	
}

// ---------------------------------------------------------------

/** Tracker#: 20714 - VIEW DESIGN BOM BUTTON WORKING INCONSISTENTLY
 * Issue: after bomc.js script tag include is added dynamically, it is not guaranteed
 * to be consistently parsed before the call to JS functions dependent on bomc.js.
 * Fix: store the function call and execute it only when bomc.js has loaded.
 * 
 * The following methods in namespace dynamic.js are for storing function calls
 * and executing the stored function calls when a JS file has finished loading.
 * 
 * readyFunctions - do not modify this directly.  This is used internally to store
 * function calls.
 * 
 * executeWhenReady - store a particular function call when JS file with name 'fileName'
 * has finished loading.
 * ex: dynamic.js.executeWhenReady('bomc.js','_displayBOMCSection','bomcdetail_100','100');
 * 
 * executeFileJS - execute all function calls for JS file with name 'fileName'.
 * This is typically executed at the end of a JS file.
 * ex: dynamic.js.executeFileJS('bomc.js');
 * 
 */
var dynamic = {
	js : {
		readyFunctions : {},
		
		executeWhenReady : function (fileName, functionName, args) {
			if (window[functionName]) // if function already exists, execute it. Don't lazy execute when file loads.
			{
				window[functionName].apply(window,args);
				return;
			}
			
			if (!dynamic.js.readyFunctions[fileName]) // first time, no array, so create it.
			{
				dynamic.js.readyFunctions[fileName] = [];
			}
			dynamic.js.readyFunctions[fileName].push(function () {
				window[functionName].apply(window,args);
			});
		},
		
		executeFileJS : function (fileName) {
			var funcArray = dynamic.js.readyFunctions[fileName];
			// in IE, dynamically included JS files are parsed immediately (before executeWhenReady is called.
			if (funcArray)
			{
				for (var i=0; i<funcArray.length; i++)
				{
					funcArray[i]();
				}
			}
		}
	}
};

//Tracker#:23149 CREATE VIEW ASSIGNED HEDGING NUMBERS OF PO USING PLM 
function  _noAssignedHedgeNum(msg)
{
   if(msg)
   {
	   var htmlErrors = new htmlAjax ().error();    
	   htmlErrors.addError("warningInfo", msg,  false);
	   messagingDiv(htmlErrors);
       return;
   }
   
}
//Tracker#: 23208 CREATE VIEW ELC AND ALC ON PO'S USING PLM FRAMEWORK.
function showELCALCRowDetails()
{
    var url ="view&_nRow=" + _nColLibRow;
    loadWorkArea("viewelcandalc.do", url);
}

function showElcAlcMoreDetails()
{
	var url="viewelcandalc.do";
	var method="view&expensecode=details&_nRow=";
	loadWorkArea(url, method);
}

//Tracker#24763 - Fixing the javascript error while click on navshow and navhide in the admin screens
$(document).ready(function()
{
	_showWorkArea.toggleNav.init();
	$('#_divNavArea').find('div.navHide').unbind('click');
	$('#navShow').unbind('click');
});

$.isReady = true;

