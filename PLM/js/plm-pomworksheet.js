/*************************************/
/*  Copyright  (C)  2002 - 2013      */
/*           by                      */
/*  TradeStone Software, Inc.        */
/*  Gloucester, MA. 01930            */
/*  All Rights Reserved              */
/*  Printed in U.S.A.                */
/*  Confidential, Unpublished        */
/*  Property of                      */
/*  TradeStone Software, Inc.        */
/*************************************/

function prePrintProcessing()
{
    _showWaitWindow();
}


function refreshFields(objAjax)
{
	var refreshflag;
	var funName = "postSaveWorkArea";
	var responseString;

	if (objAjax)
	{		
		responseString = objAjax.getHTMLResult();
		// remove the <div> tags
		responseString = responseString.replace(/<\/?div[^>]*>/g,"");
	}
	//if there is nothing in the div, nothing to update
	if (objAjax)
	{
		if (responseString=="refresh" || responseString=="refreshall")
		{
			var htmlAreaObj = _getWorkAreaDefaultObj();
			var objHtmlData = htmlAreaObj.getHTMLDataObj();
			if(objAjax.isProcessComplete())
			{
				objHtmlData.resetChangeFields();
			}
			if (responseString=="refreshall")
			{
				showPOM(objAjax)
			}
			else
			{
				_plmpom_refresh(objAjax)
			}
		}
		else
		{
			// get the individual field updates
			var fieldArray = responseString.split("<cf>");
			var kvPair; 
			for (i=0; i < fieldArray.length; i++)
			{
				// get the field id and value
				kvPair=fieldArray[i].split("~");
				if (kvPair)
				{
					var element = document.getElementById(kvPair[0])
					if (element)
					{
						element.value=kvPair[1];
						//Tracker#:22059 OUTSTANDING ISSUE IN POM ASSOCN
						//Setting element default value, used later to refresh field values after canceling the save.
						element.defaultValue=kvPair[1];
					}
				}
			}
			// uncheck any selected rows
			var elementArray = document.getElementsByName('sectionCheckBox')
			if (elementArray)
			{			
				var i
				for (i=0; i<elementArray.length; i++)
				{
					var checkElement
					checkElement = elementArray[i];
					if (checkElement.checked==true)
					{
						checkElement.click()
					}
					else
					{
						checkElement.click()
						checkElement.click()
					}
				}
			}
			if(!objAjax.error().hasErrorOccured())
			{
				//Tracker#:15783 ENTER A COLORWAY ON RANDOM LINE CAUSES AN ERROR
				//resetHTMLData(changefields data) only if the process is complete
				//alert("objAjax.isProcessComplete() " + objAjax.isProcessComplete());
				if(objAjax.isProcessComplete())
				{
					_getWorkAreaObj().resetHTMLData();
				}
				_displayProcessMessage(objAjax)
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
	}
}

// Tracker#: 14225  FIT EVAL ENHANCEMENT FOR SIZE SETS
// Get the HTML for displaying Size Codes and Sample quantities.
function listSizeCodes()
{
    if(!isValidRecord("URL", "N")) return;
    var bDisp = true;
    if (getval('chgflds') != "")
    {
        if (confirm(szMsg_Changes))
        {
            fsubmit(szSAVE);
            bDisp = false;
        }
    }

    if (bDisp)
    {
        show('preprint');
        getSizeCodes();
    }
}

var reqGetSizeCodes=null;

// Tracker#: 14225  FIT EVAL ENHANCEMENT FOR SIZE SETS
// Ajax call to read the POM Worksheet for
// active sizes and listing the same
function getSizeCodes()
{
    var objFrm = eval('document.'+ FRM);
    if(objFrm != null)
    {
        var url = 'pomworksheet.do?method=listsizecodes';
        reqGetSizeCodes = createXMLHttpRequest();

        if (reqGetSizeCodes)
        {
            reqGetSizeCodes.open("GET", url, true);
            reqGetSizeCodes.onreadystatechange = displaySizeCodes;
            reqGetSizeCodes.send(null);
        }
    }
}

// Display the html content from the ajax response.
function displaySizeCodes()
{
    if (reqGetSizeCodes.readyState == 4)
    {
        if (reqGetSizeCodes.status == 200)
        {
           // Invoke SessionManagement.resetSessionTime() to reset session counter.
           SessionManagement.resetSessionTime();
        	
           hide('preprint');
           var msg = reqGetSizeCodes.responseText;
           if (msg != '')
           {
                showMsg2(msg, true);
           }
           reqGetSizeCodes=null;
        }
     }
}

// Tracker#: 14225  FIT EVAL ENHANCEMENT FOR SIZE SETS
// Create Size Fit Eval process.
function createSizeFitEval()
{
	// Tracker#:17366 NO LONGER ABLE TO SELECTIVELY CHOOSE POM CODES USED WHEN CREATING SIZE SET EVALUATION
	// Changed the function to compatible PLM framework, before it was coded for sourcing framework.
    var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objAjax.getDivSectionId();
    var url ="createsizefit";

    if(objAjax)
   	{
   		if(!isValidRecord(true))
		{
			return;
		}
   	}

	if(objAjax && objHTMLData)
	{
		docview = objAjax.getDocViewId();		
    	// alert("docview: "+docview);
    	// alert("inside calling");
    	bShowMsg = true;
   	 	addSizeAndQuantiesToAjax(objAjax);
		objAjax.setActionURL("plmpomworksheet.do");
		objAjax.setActionMethod(url);
        objAjax.setProcessHandler(_plmpom_showSizeSetPage);
        if(objHTMLData.getChangeFields()!=null && !(objHTMLData.getChangeFields()==""))
        {
       		objHTMLData.performSaveChanges(_plmpom_showSizeSetPage, objAjax);
     	}
     	else
     	{
     		objAjax.sendRequest();
     	}		
	}
}

function _plmpom_showSizeSetPage(objAjax)
{
	// Tracker#:17366 NO LONGER ABLE TO SELECTIVELY CHOOSE POM CODES USED WHEN CREATING SIZE SET EVALUATION
	// have separate callback function to forward the request to FitEvalOverview screen.
	//
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
        _reloadArea(objAjax, sectionName);
        bShowMsg= false;
        _execAjaxScript(objAjax);
    }
}

function addSizeAndQuantiesToAjax(objAjax)
{
    var count = 0;
    var quantityFieldName =  "quantity_" + count;
    var sizeFieldName = "size_" + count;
    var quantityObj = getElemnt(quantityFieldName);
    var sizeObj = getElemnt(sizeFieldName);
    // Keep finding the Quantity Fields till there
    // is no more Quantity fields to be read.
    // -> Add the Size(s) and their sample count to Ajax request.
    while(quantityObj)
    {
        objAjax.parameter().add(quantityFieldName, quantityObj.value);
        objAjax.parameter().add(sizeFieldName, sizeObj.value);
        count++;
        quantityFieldName = "quantity_" + count;
        sizeFieldName = "size_" + count;
        quantityObj = getElemnt(quantityFieldName);
        sizeObj = getElemnt(sizeFieldName);
    }
}

// change the notes icon from red to blue and back depending upon empty value
function changeComment(field)
{
	var notesImg = document.getElementById('_img' + field.id)
	if (notesImg)
	{
		if (field.value)
		{
			notesImg.src="images/red_notes.gif";
		}
		else
		{
			notesImg.src="images/notes.gif";
		}
	}
}

// Tracker#:16274 MOVE POM TO PLM FRAMEWORK
// Tracker#:19231 to varify linked fields before save
function _plmpom_save()
{  	
    _verifylinkedfieldsModified("plmpomworksheet.do", continue_plmpom_save);
}

// Tracker#:19231 to set user confiramtiom message if the linked fileds are modified
function  continue_plmpom_save(objAjax)
{    
    if(objAjax != null)
	{
		var message = objAjax.getResponseHeader("ulinkConfirmMsg");
		var objHtmlData = objAjax.attribute().getAttribute("htmlData");
		//alert("message before"+message);
		if(message != null && message !="" && message.length>0)
		{			
			var htmlErrors = objAjax.error();		
			htmlErrors.addError("confirmInfo", message,  false);
			//alert("htmlErrors"+htmlErrors);
			messagingDiv(htmlErrors,"objHtmlData.performSaveChanges(refreshFields)", "cancelProcess()");
		}
		else
		{				
			objHtmlData.performSaveChanges(refreshFields);
		}
	}
}


function _plmpom_rwHlt(obj, frzTblId, trInd, multiplerows, curTblId, lstTrIndCnt)
{

	// The following parameters are never used: trInd, lstTrIndCnt
	
	// Because of new POM screen feature that allows user to change position of table
	// rows, we must dynamically determine which row in the other table needs to be highlighted.
	// Tracker#: 18001 - TSR 515 DRAG AND DROP ROWS IN PLM SCREENS--POM SCREEN
	// used jquery library from tracker 18001 changes.
	if (jQuery.tableDnD.dragging)
	{
		return;
	}
	
	var otherTable = getElemnt(frzTblId);
	var currentTable = getElemnt(curTblId);
	
	var freezeRowStartIndex = _getFreezeRowStartIndex(otherTable);
	
	// Convert to jQuery objects.
	var row = $(obj);
	var otherTable = $(otherTable);
	var currentTable = $(currentTable);
	
	// Get the rows in each table excluding frozen rows at top of tables.
	var otherRows = otherTable.children('tbody').children('tr').slice(freezeRowStartIndex+1);
	var currentRows = currentTable.children('tbody').children('tr').slice(freezeRowStartIndex+1);
	
	var currentRowIndexTable = currentRows.index(row);
	var currentRowIndexRowSpan = currentRowIndexTable % multiplerows;
	var firstRowOfRowSpanIndex = currentRowIndexTable - currentRowIndexRowSpan;
	
	// Highlight all rows of rowspan in both tables
	for (var i=0, currentIndex=firstRowOfRowSpanIndex; i<multiplerows; i++, currentIndex++)
	{
		currentRows.eq(currentIndex).css('background-color','#F4EDAD');
		otherRows.eq(currentIndex).css('background-color','#F4EDAD');
	}
}

// Mouse out event - Make the background as white color.
function _plmpom_rwUnHlt(obj, frzTblId, trInd,  multiplerows, curTblId, lstTrIndCnt)
{

	// The following parameters are never used: trInd, lstTrIndCnt
	
	// Because of new POM screen feature that allows user to change position of table
	// rows, we must dynamically determine which row in the other table needs to be UN-highlighted.
	// Tracker#: 18001 - TSR 515 DRAG AND DROP ROWS IN PLM SCREENS--POM SCREEN
	// used jquery library from tracker 18001 changes.
	if (jQuery.tableDnD.dragging)
	{
		return;
	}
	
	var otherTable = getElemnt(frzTblId);
	var currentTable = getElemnt(curTblId);
	
	var freezeRowStartIndex = _getFreezeRowStartIndex(otherTable);
	
	// Convert to jQuery objects
	var row = $(obj);
	var otherTable = $(otherTable);
	var currentTable = $(currentTable);
	
	// Get the rows in each table excluding frozen rows at top of tables.
	var otherRows = otherTable.children('tbody').children('tr').slice(freezeRowStartIndex+1);
	var currentRows = currentTable.children('tbody').children('tr').slice(freezeRowStartIndex+1);
	
	var currentRowIndexTable = currentRows.index(row);
	var currentRowIndexRowSpan = currentRowIndexTable % multiplerows;
	var firstRowOfRowSpanIndex = currentRowIndexTable - currentRowIndexRowSpan;
	
	// Un-Highlight all rows of rowspan in both tables
	for (var i=0, currentIndex=firstRowOfRowSpanIndex; i<multiplerows; i++, currentIndex++)
	{
		currentRows.eq(currentIndex).css('background-color','#FFFFFF');
		otherRows.eq(currentIndex).css('background-color','#FFFFFF');
	}
}


function _plmpom_viewFitEval()
{
    
    //loadWorkArea("plmpomworksheet.do", url);
    
    if(!isValidRecord(true))
	{
		return;
	}

    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();        
    
    if(objAjax)
    {
    	if(objHTMLData!=null && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
        {
        	var htmlErrors = objAjax.error();
            htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
                            
            messagingDiv(htmlErrors, "_plmpom_save()", "_plmpom_viewFitEval_continue()");
        }
        else
        {
        	_plmpom_viewFitEval_continue();
        }
    }
}

function _plmpom_viewFitEval_continue(url)
{
	closeMsgBox();
	Main.resetDefaultArea();

	var htmlAreaObj = _getWorkAreaDefaultObj();
	
    var objAjax = htmlAreaObj.getHTMLAjax();
    var url = "viewfitevals";
    if(objAjax)
    {    	
    	objAjax.setActionURL("plmpomworksheet.do");
        objAjax.setActionMethod(url);        
        objAjax.setProcessHandler(_plmpom_PostViewFitEval);
        //alert("sending");
        objAjax.sendRequest();
    }	
}


function _plmpom_PostViewFitEval(objAjax)
{	
	//alert("_plmpom_PostViewFitEval \n objAjax.isProcessComplete()" + objAjax.isProcessComplete());
	if(objAjax.isProcessComplete())
    {
        _execAjaxScript(objAjax);
    }
    else
    {
    	_displayProcessMessage(objAjax);
    }
}

/** Tracker#: 19807 - LEFT NAVIGATION NEEDS TO BE MADE COLLAPSIBLE
 * Function used on PLM POM screen only.
 * Aligns Points of Measure & Size/Active titles with their respective columns.
 * 
 * Now this function aligns the left title td to the width of left side detail table
 * (Points of Measure).
 */
function _plmpom_aligndtlTitleTd(tblMain, tdpomtitleid, tdpomid)
{
	var objtblMain = getElemnt(tblMain);

    var objtdpom = getElemnt(tdpomid);
    var objtdpomtitleid = getElemnt(tdpomtitleid);

    if(objtblMain && objtdpom && objtdpomtitleid)
    {
        setWidth(objtdpomtitleid, objtdpom.offsetWidth);
    }

    _showWorkArea.toggleNav.register('_plmpom_aligndtlTitleTd', arguments);

}

function showPOM(origObjAjax)
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    
    sectionName = objAjax.getDivSectionId();
    var url ="view";
        
	if(objAjax && objHTMLData)
	{

		docview = objAjax.getDocViewId();
    	// alert("docview: "+docview);
    	// alert("inside calling");
    	bShowMsg = true;

		objAjax.setActionMethod(url);
		// Tracker#:18081 MAINTAIN USER'S PLACE ON THE SCREEN AFTER ADDING, DELETING, SORTING AND COPYING POM CODES
   		// passed _showWorkArea_scroll to maintain the vertical scroll position on the screen.
		Main.loadWorkArea("plmpomworksheet.do", url,'', '_showWorkArea_scroll',origObjAjax);
	}
}

function _plmpom_createFiteval()
{
    // Using the PLM APIS to reload the work area
    var url = "newFEfromtechspec";
    var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objAjax.getDivSectionId();
    
    if(objAjax)
   	{
   		if(!isValidRecord(true))
		{
			return;
		}
   	}
    bShowMsg = true;
	objAjax.setActionMethod(url);
	Main.loadWorkArea("plmpomworksheet.do", url, '', '_showPLMFitEval');
}

function _showPLMFitEval(objAjax)
{	
    var htmlError = objAjax.error();

     // Tracker#: 14225  FIT EVAL ENHANCEMENT FOR SIZE SETS
     // If An error has occured do not close the Create Size Fit Eval popup.
     if(!htmlError.hasErrorOccured())
     {
        closeMsg();
     }
     _displayProcessMessage(objAjax);

     // Expand the Design Center as the Navigation Section
     // needs to display Fit Evaluation navigation link
     // rather than the techspec link.
     // Only if there are no errors call restoreArea(0) which reloads all the
     // links related on Design Center otherwise do not change the
     // Navigation Menu on the Navigator and remain on the same.
     if((htmlError.getWarningMsg() == null || htmlError.getWarningMsg().length == 0)
        && (htmlError.getErrorMsg() == null || htmlError.getErrorMsg().length == 0))
     {
         restoreArea(0);
     }
     
     Main.resetDefaultArea();
    // Tracker#: 14075
    // Reset the chgflds chances are there that the user has
    // decided to Save the details rather than navigating to
    // the fit Eval screen. So chgflds needs to be reset.
    setval('chgflds', '');
    // alert("Call to");
    _execAjaxScript(objAjax);
}

function _plmpom_copypomcodes()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
        
    if(objAjax)
   	{
   		if(!isValidRecord(true))
		{
			return;
		}
   	}
	//Tracker#19005 COPY POM AND DELETE POM DETAILS DOES NOT ASK FOR SAVE MESSAGE BEFORE DELETE / COPY
    //User edits the screen and executing the 'Copy POM Code(s)' process without saving the changes
	//Pop up the  message 'There are changes on the screen. Do you want to save changes before current action?'.
	if(objHTMLData!=null && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
    {
    	var htmlErrors = objAjax.error();
        htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
        messagingDiv(htmlErrors, "objHtmlData.performSaveChanges(refreshFields)", "_continuePlmpom_copypomcodes()");
        return;
    }
    else
    {
    	_continuePlmpom_copypomcodes();
    }		
}

//Tracker#19005 COPY POM AND DELETE POM DETAILS DOES NOT ASK FOR SAVE MESSAGE BEFORE DELETE / COPY
//It will continue the process if the screen does not have any changes to save
function _continuePlmpom_copypomcodes()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
	sectionName = objAjax.getDivSectionId();
    var url ="copypomcodes";
    
	if(objAjax && objHTMLData)
	{		
		if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
		{
	    	var htmlErrors = objAjax.error();
			htmlErrors.addError("warningInfo", szMsg_Selct_Pom_codes, false);
			messagingDiv(htmlErrors);
			return;
		}    
		docview = objAjax.getDocViewId();		
		// alert("docview: "+docview);
		// alert("inside calling");
		bShowMsg = true;
		objAjax.setActionURL("plmpomworksheet.do");
		objAjax.setActionMethod(url);
	    objAjax.setProcessHandler(_showColorLibPage);
	    objHTMLData.performSaveChanges(_showColorLibPage, objAjax);
		if(objAjax.isProcessComplete())
	   	{
	       objHTMLData.resetChangeFields();
	   	}
	}
}

function _plmpom_copy()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
       
    if(!isValidRecord(true))
	{
		return;
	}
	//Tracker#19005 COPY POM AND DELETE POM DETAILS DOES NOT ASK FOR SAVE MESSAGE BEFORE DELETE / COPY
    //User edits the screen and executing the 'Copy' process without saving the changes
	//Pop up the  message 'There are changes on the screen. Do you want to save changes before current action?'.
	if(objHTMLData!=null && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
    {
    	var htmlErrors = objAjax.error();
        htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
        messagingDiv(htmlErrors, "objHtmlData.performSaveChanges(refreshFields)", "_continuePlmpom_copy()");
        return;
    }
    else
    {
    	_continuePlmpom_copy();
    }	
}

//Tracker#19005 COPY POM AND DELETE POM DETAILS DOES NOT ASK FOR SAVE MESSAGE BEFORE DELETE / COPY
//It will continue the process if the screen does not have any changes to save
function _continuePlmpom_copy()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
	sectionName = objAjax.getDivSectionId();
	//Tracker#:21632 FDD550-ADD COPY PASTE PROCESS ON POM WORKSHEET SCREEN
    var url ="copyworksheet";// renamed Copy process to Copy Worksheet
    
	if(objAjax && objHTMLData)
	{
		docview = objAjax.getDocViewId();
    	// alert("docview: "+docview);
    	// alert("inside calling");
    	bShowMsg = true;
		objAjax.setActionMethod(url);
		//Tracker#19005 COPY POM AND DELETE POM DETAILS DOES NOT ASK FOR SAVE MESSAGE BEFORE DELETE / COPY
		//once cancel the save changes, the changefields should be resetted		
		loadWorkArea("plmpomworksheet.do", url);
		if(objAjax.isProcessComplete())
		{
			objHTMLData.resetChangeFields();
		}
	}
}

//Tracker#:20812 Modified the function add the save confirm message
function _plmpom_refresh(origObjAjax)
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objAjax.getDivSectionId();
    var url ="refresh";
    
    //alert("isValidRecord="+isValidRecord(true));
    if(!isValidRecord(true))
	{
		return;
	}
	
    bShowMsg = true;
	objAjax.setActionMethod(url);
	Main.loadWorkArea("plmpomworksheet.do", url,'','_showWorkArea_scroll',origObjAjax);
}

function _plmpom_delete()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objAjax.getDivSectionId();
    var url ="delete";
    
    if(!isValidRecord(true))
	{
		return;
	}
	//Tracker#19005 COPY POM AND DELETE POM DETAILS DOES NOT ASK FOR SAVE MESSAGE BEFORE DELETE / COPY
    //User edits the screen and executing the 'Copy POM Code(s)' process without saving the changes
	//Pop up the  message 'There are changes on the screen. Do you want to save changes before current action?'.
	if(objHTMLData!=null && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
    {
    	var htmlErrors = objAjax.error();
        htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
        messagingDiv(htmlErrors, "objHtmlData.performSaveChanges(refreshFields)", "_continuePlmpom_delete()");
        return;
    }
    else
    {
    	_continuePlmpom_delete();
    }
}

//Tracker#19005 COPY POM AND DELETE POM DETAILS DOES NOT ASK FOR SAVE MESSAGE BEFORE DELETE / COPY
//It will continue the process if the screen does not have any changes to save
function _continuePlmpom_delete()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objAjax.getDivSectionId();
    var url ="delete";
    
	if(objAjax && objHTMLData)
	{
		docview = objAjax.getDocViewId();		
    	// alert("docview: "+docview);
    	// alert("inside calling");
    	if(objHTMLData!=null)
    	{
    			var htmlErrors = objAjax.error();
    			htmlErrors.addError("confirmInfo", szMsg_Delete_Rec,  false);
   				messagingDiv(htmlErrors,'_plmpom_deletePOM()', 'cancelProcess()');
    	}
	}
}

function _plmpomcancel(){
	closeMsgBox();
	_plmpom_refresh();
}

function _plmpom_deletePOMCodes(paramUrl)
{
	closeMsgBox();
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objAjax.getDivSectionId();
    var url ="delete";
    if(paramUrl)
    {
    	url = paramUrl;
	}
	bShowMsg = true;   	
	objAjax.setActionURL("plmpomworksheet.do");
	objAjax.setActionMethod(url);
	objAjax.setProcessHandler(_showColorLibPage);
	objHTMLData.performSaveChanges(_showColorLibPage, objAjax);
	if(objAjax.isProcessComplete())
  	{
      objHTMLData.resetChangeFields();
  	} 
}

function _plmpom_deletePOM()
{
	closeMsgBox();
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objAjax.getDivSectionId();
    var url ="delete";
    
    if(!isValidRecord(true))
	{
		return;
	}
    
    if(objAjax && objHTMLData)
	{
		bShowMsg = true;
		objAjax.setActionMethod(url);
		loadWorkArea("plmpomworksheet.do", url);
	}
}

//Tracker#:20812 Modified the function add the save confirm message
function _plmpom_calculateSepc()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objAjax.getDivSectionId();
    var url ="calculateSpec";
	
	if(!isValidRecord(true))
	{
		return;
	}
	if(objAjax && objHTMLData)
	{
		docview = objAjax.getDocViewId();		
    	// alert("docview: "+docview);
    	// alert("inside calling");
    	bShowMsg = true;   	
		objAjax.setActionMethod(url);
		Main.loadWorkArea("plmpomworksheet.do", url);
	}
}

//Tracker#:20812 Modified the function add the save confirm message
function searchSRPOMModels()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    
	if(objAjax && objHTMLData)
    {    	
    	if(objHTMLData!=null && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
        {
            var htmlErrors = objAjax.error();
            htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
            messagingDiv(htmlErrors, "_plmpom_save()", "continueSearchSRPOMModels()");
        }
        else
        {
            continueSearchSRPOMModels();
        }
    }		
}


//Tracker#:20812 function searchSRPOMModels continuation 
function continueSearchSRPOMModels()
{	
	cancelProcess();
	var objAjax = new htmlAjax();

    if(objAjax)
    {  
    	 // Tracker#:18510 PROVIDE THE ABILITY TO CONFIGURE THE POM ASSOCIATION - CHANGE SIZE RANGE POPUP
    	 // reading the validation id from field var101, instead of passing hard coded value, so set
    	 // the validatin id at server side, and read it from response in callback function _plm_pom_showSizeRange. 
    	var url = "getvalidationInfo&fieldid=VAR101&defaultrefid=1175";
        bShowMsg = true;        	
        objAjax.setActionURL("plmpomworksheet.do");
        objAjax.setActionMethod(url);
        objAjax.setProcessHandler(_plm_pom_showSizeRange);
        objAjax.sendRequest();
     }
}

function _plm_pom_showSizeRange(objAjax)
{
	
	if(objAjax)
	{
		var valid = objAjax.getResponseHeader("validationid");
		var searchControl = new VALIDATION.SearchControl(null, false, null,
	                    'validationsearch.do?valId='+valid+'&codeFldName=null&showDesc=N&sectionId=0&rowNo=0&actRowNo=0');
	    searchControl.setOnBeforeSinglePost(_plmpom_replaceSizeRange);
	    searchControl.showPopup();
    }
}


// ------------------------------------------------
// Tracker#: 13126  CHANGE TOLERANCE MODEL ON POM ASSOCIATION
// Called by the Process "Change Tolerance
// ------------------------------------------------
function searchTolPOMModels()
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
            messagingDiv(htmlErrors, "_plmpom_save()", "continueSearchTolPOMModels()");
        }
        else
        {
            continueSearchTolPOMModels();
        }
    }
 
}


//Tracker#:20812 function searchTolPOMModels continuition
function continueSearchTolPOMModels()
{	
	cancelProcess();
	var objAjax = new htmlAjax();

    if(objAjax)
    {   
    	 // Tracker#:18510 PROVIDE THE ABILITY TO CONFIGURE THE POM ASSOCIATION - CHANGE SIZE RANGE POPUP
    	 // reading the validation id from field var102, instead of passing hard coded value, so set
    	 // the validatin id at server side, and read it from response in callback function _plm_pom_showSizeRange.
    	var url = "getvalidationInfo&fieldid=VAR102&defaultrefid=1205";
        bShowMsg = true;
        objAjax.setActionURL("plmpomworksheet.do");
        objAjax.setActionMethod(url);
        objAjax.setProcessHandler(_plm_pom_showTolPOMModel);
        objAjax.sendRequest();
     }
}

function _plm_pom_showTolPOMModel(objAjax)
{
	
	if(objAjax)
	{
		var valid = objAjax.getResponseHeader("validationid");
		var searchControl = new VALIDATION.SearchControl(null, false, null,
                    'validationsearch.do?valId='+valid+'&codeFldName=null&showDesc=N&sectionId=0&rowNo=0&actRowNo=0');
    searchControl.setOnBeforeSinglePost(_plmpom_replaceTolModel);
    searchControl.showPopup();
    }
}

//Tracker#:16274 - MOVE POM TO PLM FRAMEWORK
//Tracker#:20812 Modified the function add the save confirm message
function _plmpom_showAddSamples()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();	
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    
    if(objAjax)
   	{
   		if(!isValidRecord(true))
		{
			return;
		}
   	}
	
	if(objAjax && objHTMLData)
    {    	
    	if(objHTMLData!=null && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
        {
            var htmlErrors = objAjax.error();
            htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
            messagingDiv(htmlErrors, "_plmpom_save()", "continueShowAddSamples()");
        }
        else
        {
            continueShowAddSamples();
        }
    }	
}	

//Tracker#:20812 function _plmpom_showAddSamples continuitation.
function continueShowAddSamples() 
{
	/**
	 * Tracker#:21669 REGRESSION-CANNOT SELECT LIMITED LIST OF CODES FOR CREATE SIZE SET
	 * avoided calling cancelProcess that would remove the changefields on the screen and close the 
	 * Message box, now calling only closeMsgBox to close message box after clicking cancel on Confirm message. 
	 */
	closeMsgBox();
	var actMethod ='showAddSamples';
	var objAjax = new htmlAjax(); 
	
    if(objAjax)
    {    	
    	fldName = "_divDataWorkArea"// htmlAreaObj.getDivSectionId();
    	_startSmartTagPopup(fldName, false, null, true);
    	objAjax.setActionURL("plmpomworksheet.do");
        objAjax.setActionMethod(actMethod);
        objAjax.attribute().setAttribute("htmlfldName", fldName);
        objAjax.setProcessHandler(_plmpom_showSamplesPopupDiv);
        //alert("sending");
        objAjax.sendRequest();
    }
}
//Post precess handle for showUserPopup
function _plmpom_showSamplesPopupDiv(objAjax)
{
	if(!isValidRecord(true))
	{
		return;
	}
	
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
           var popUpDiv = _showSmartTagPopup(objAjax);
           _setElementToCenter(popUpDiv);
        }
    }
}

//Tracker#:20812 Modified the function add the save confirm message
function _plmpom_addPOM()
{	   
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	if(objAjax)
   	{
   		if(!isValidRecord(true))
		{
			return;
		}
   	}   	
   	
	if(objAjax && objHTMLData)
    {    	
    	if(objHTMLData!=null && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
        {
            var htmlErrors = objAjax.error();
            htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
            messagingDiv(htmlErrors, "_plmpom_save()", "continueAddPOM()");
        }
        else
        {
            continueAddPOM();
        }
    }
}

//Tracker#:20812 function _plmpom_addPOM continuition 
function continueAddPOM()
{
	cancelProcess();
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	var actMethod ="addPLMPOM";
	var fldName="";
		
	if(objAjax)
    {
    	fldName = "_divDataWorkArea"// htmlAreaObj.getDivSectionId();
    	_startSmartTagPopup(fldName, false, null, false);
    	objAjax.setActionURL("plmpomworksheet.do");
        objAjax.setActionMethod(actMethod);
        objAjax.attribute().setAttribute("htmlfldName", fldName);
        objAjax.setProcessHandler(_plmpom_showPOMCodesDiv);
        //alert("sending");
        objAjax.sendRequest();
    }
}

//Post precess handle for showNewClipBoard
function _plmpom_showPOMCodesDiv(objAjax)
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
           var popUpDiv = _showSmartTagPopup(objAjax);    
           _setElementToCenter(popUpDiv);        
        }
    }
}
//Tracker#17067:ADD POM POPUP NOT WORKING IN NEW POM SCREENS
//HTML data object fetchwed based on doc view id
function _plmpom_addSelectedPOM()
{
	var objHTMLData = _getAreaHTMLDataObjByDocView(30008);
	if(objHTMLData)
	{
		if(objHTMLData)
		{
			bShowMsg = true;
			objHTMLData.setSaveURL("plmpomworksheet.do");
			objHTMLData.setActionMethod("addselectedpomcodes");
			var objAjax = objHTMLData.performSaveChanges(_plmpom_handleAddPoms);
			if(objAjax.isProcessComplete())
			{
				objHTMLData.resetChangeFields();
			}
		}
	}
}

//Post precess handle for shareClipboard
function _plmpom_handleAddPoms(objAjax)
{
	//alert("_plmpom_handleAddPoms  called objAjax "+objAjax);
	if(objAjax)
    {
    	showPOM(objAjax);
	    // defer display of process message until after the refresh
//	    _displayProcessMessage(objAjax);    
    }
}



function _plmpom_replaceSizeRange(rowValues)
{
   	var modelName = "";
    var modelOwner = "";
	if(rowValues != null && rowValues.length > 0)
    {
        modelName = rowValues[0];
        modelOwner = rowValues[5];
    }
    if(modelName == null || modelName.length == 0 )
    {
		var htmlErrors = new htmlAjax().error();
	    htmlErrors.addError("warningInfo", "Please select a valid POM model.",  true);
	    messagingDiv(htmlErrors);
        return;
    }
	var htmlAreaObj = _getWorkAreaDefaultObj();	
	var objAjax = htmlAreaObj.getHTMLAjax();
			
	var url ='changesizerange';
	objAjax.setActionMethod(url);	
	objAjax.setActionURL("plmpomworksheet.do");
	objAjax.setProcessHandler(_showWorkArea);
	// Tracker#:18736 CHANGE SIZE RANGE ON POM ASSOCIATION DOES NOT WORK FOR MODELS WITH AN AMPERSAND CHARACTER
	// Passing the name value in request by adding through objAjax object function parameter, it would call the encodeURIComponent method to encode values
	// to check special characters like & etc.
	objAjax.parameter().add('gradingmodelname', modelName);
	objAjax.parameter().add('gradingmodelowner', modelOwner);
	
	objAjax.sendRequest();
	
}


function _plmpom_replaceTolModel(rowValues)
{
   	var modelName = "";
    var modelOwner = "";

    if(rowValues != null && rowValues.length > 0)
    {
        modelName = rowValues[0];
        modelOwner = rowValues[8];
    }
    
    if(modelName == null || modelName.length == 0 )
    {
		var htmlErrors = new htmlAjax().error();
	    htmlErrors.addError("warningInfo", "Please select a valid POM model.",  true);
	    messagingDiv(htmlErrors);
        return;
    }

	var htmlAreaObj = _getWorkAreaDefaultObj();	
	var objAjax = htmlAreaObj.getHTMLAjax();
			
	var url ='changetolmodel';
	objAjax.setActionMethod(url);	
	objAjax.setActionURL("plmpomworksheet.do");
	objAjax.setProcessHandler(_showWorkArea);
	// Tracker#:18736 CHANGE SIZE RANGE ON POM ASSOCIATION DOES NOT WORK FOR MODELS WITH AN AMPERSAND CHARACTER
	// Passing the name value in request by adding through objAjax object function parameter, it would call the encodeURIComponent method to encode values
	// to check special characters like & etc.
	objAjax.parameter().add('tolmodelname', modelName);
	objAjax.parameter().add('tolmodelowner', modelOwner);
	
	objAjax.sendRequest();
}

function _setElementToCenter(elem)
{
  	var top=(screen.height/2)-(175);
   	var left=(screen.width/2)-(200);
   	elem.style.top=top+"px";
   	elem.style.left=left+"px";
   	elem.style.visibility="visible";
   	elem.style.position="absolute";
    elem.style.display = "block";
}


function _plmpom_pageNavByDropDown()
{
	var current_page = getElemnt("current_page");  
    var nextRecordKey = current_page.value;
    _plmpom_pageNav(nextRecordKey);
}

function _plmpom_pageNav(nextRecordKey)
{
    
    var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objAjax.getDivSectionId();
    var url ="pagnav&nxtpgkey="+nextRecordKey;
	
	if(objAjax && objHTMLData)
	{
	
		docview = objAjax.getDocViewId();		
    	// alert("docview: "+docview);
    	// alert("inside calling");
	   	bShowMsg = true;   	
		objAjax.setActionMethod(url);
		Main.loadWorkArea("plmpomworksheet.do", url);
	}
}

function _plmpom_SelOneChkbox(obj, trId)
{
    // UnCheck all other check boxes except for the current one that has been either checked or unchecked.
   if(trId)
    {
		var objTr = getElemnt(trId);
		if(objTr)
         {
			var chkCol = objTr.getElementsByTagName("INPUT");
			if(chkCol && chkCol.length && chkCol.length>0)
			{
				for(i=0;i<chkCol.length;i++)
				{
					var objChk = chkCol.item(i);
					
					if(objChk && objChk.type && objChk.type.toUpperCase()== "CHECKBOX" 
					&& objChk.checked && obj.id!=objChk.id)
					{
						objChk.checked=false;
						_notifyCheckBoxChangeFields(objChk, true);
					}
				}
         }
         }
    }
}


// To handle the size/active section check boxes value.

function _plmpom_setChkboxValue(obj)
    {
	if(obj)
        {
    	//alert("obj="+obj.id+"\n"+obj.checked);
    	if(obj.checked==true)
       		{
         	obj.value = "Y";
         }
         else
	            {
         	obj.value = "";
       		}
        }
}

//Tracker#:15276 NO MSG IS SHOWN TO THE USER IF THERE ARE CHANGES ON THE SCREEN WHEN USER CLICKS ON THE REPORT LINK 
// Provided a separate method to open the PDF report, instead of using common method 'generateReport'
// becuase saving in pom is different(refreshFields method is called in place of _defaultWorkAreaSave)
function _plmpom_generateReport(id, name)
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
            messagingDiv(htmlErrors, "_plmpom_save()", "continueReport(\'"+id+"\',\'"+name+"\')");
        }
        else
        {
            continueReport(id,name);
        }
    }	
}

//Tracker#:20812 Modified the function add the save confirm message
function continueReport(id, name)
{
	closeMsgBox();
	var str = 'report.do?id=' + id + '&reportname=' + name;
    oW('report', str, 800, 650);
}

/* Tracker#: 18001 - TSR 515 DRAG AND DROP ROWS IN PLM SCREENS--POM SCREEN
function to send request to perform drag and drop functionality on server side and refresh the screen.
pass from and to values to server side, refer jquery.tablednd_0_5.js
*/ 
function _plmpom_dropFunction(from,to,rows1,rows2)
{
	/* Tracker#: 20211 - POM-DRAG AND DROP DOESN'T REORDER ROWS IF ROW IS MOVED BEFORE BEING SAVED
	 * Design Change - Now prompting to save changes on attempting to drag & drop instead of ondrop.
	 */
	//var objHtmlData = _getWorkAreaDefaultObj().checkForNavigation();

    /*
	if(objHtmlData!=null && objHtmlData.hasUserModifiedData()==true)
    {
        //alert("loadWorkArea: save changes \n creating ");
        //perform save operation
        objHtmlData.performSaveChanges(refreshFields);
        return;
    }
    */
    
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objAjax.getDivSectionId();
	bShowMsg = true;   	
	objAjax.setActionURL("plmpomworksheet.do?method=dragdroppoms&from="+from+"&to="+to+"");
	/* Tracker#: 19261 - PLM POM DRAG AND DROP SLOW PERFORMANCE
	 * Not refreshing the screen after dropping(thus saving) row.
	 * Displaying saved successfully message.
	 */
	//objAjax.setProcessHandler(_showColorLibPage);
	objAjax.setProcessHandler(function () {
		_displayProcessMessage(objAjax);
	});
	objAjax.sendRequest();
	if(objAjax.isProcessComplete())
  	{
      objHTMLData.resetChangeFields();
  	} 
}

var multiRowDragDrop = (function (window, undefined) {
	var $leftTable,
		$rightTable,
		$leftRows,
		$rightRows,
		numTitleRows,
		rowSpan,
		pomCodeColIndex,
		otherColIndexes,
		rowNumbers = {},
		rowIndexes = {},
		selectedLeftRows = {}, // map of jQuery wrapped rows
		selectedRightRows = {}, // map of jQuery wrapped rows
		atLeastOneRowSelected = false,
		oldPageY,
		oldPageX,
		oldTop,
		oldLeft,
		$prevHoveredRow = null,
		clickedRowIndex,
		adjacentRowNumbers = [],
		highlightClass = 'multiRowDragDropIndicator',
		$rowIndicator,
		$indicatorContainer,
		doNothing = false,
		invertNotifyEventType = false,
		docViewId;

	
	var init = function (inputNumTitleRows, inputRowSpan, inputPomCodeColIndex, inputOtherColIndexes) {
		numTitleRows = inputNumTitleRows;
		rowSpan = inputRowSpan;
		pomCodeColIndex = inputPomCodeColIndex;
		otherColIndexes = inputOtherColIndexes;
		
		docViewId = getDocViewId();
		$leftTable = $('#_dtlSection_' +docViewId+ '_left_table');
		$rightTable = $('#_dtlSection_' +docViewId+ '_right_table');
		updateRowRefs();
		
		$rowIndicator = $('<div class="multiRowDragDropIndicator"/>');
		$indicatorContainer = $('<div style="position:relative; display:none;"/>').append($rowIndicator);
		$indicatorContainer.css('top', getAllTitleRowHeight());
		
		var $commonAncestor = getCommonAncestor();
		$commonAncestor.prepend($indicatorContainer);
		
		$leftTable.bind('click', pomCheckBoxClicked)
			.delegate('input[type="text"]', 'focus', pomTextFocused);
		
		/* when using processes that refresh the work area on PLM POM screen
		 * such as copy POMs, delete POMs,
		 * need to clear out old references.
		 */
		rowNumbers = {};
		rowIndexes = {};
		selectedLeftRows = {};
		selectedRightRows = {};
	};
	
	var getDocViewId = function () {
		var docViewId,
			$multiWindowDiv = $('#_multiPOMTabCntr');
		if ($multiWindowDiv.length > 0)
		{
			docViewId = '12702';
		}
		else
		{
			var $divWorkArea = $('#_divWorkArea'),
				docViewIdAttr = $divWorkArea.attr('docviewid');
			
			if (docViewIdAttr)
			{
				docViewId = docViewIdAttr;
			}
		}
		
		return docViewId;
	};
	
	var updateRowRefs = function () {
		$leftRows = $leftTable.children().children();
		$rightRows = $rightTable.children().children();
	};
	
	var getAllTitleRowHeight = function () {
		var allRowsHeight = 0,
			$rows = $leftTable.children().children();
		for (var i=0; i<numTitleRows; i++)
		{
			var $titleRow = $rows.eq(i);
			allRowsHeight += $titleRow.height();
		}
		return allRowsHeight;
	};
	
	var getCommonAncestor = function () {
		var $leftElem = $leftTable,
			$rightElem = $rightTable,
			leftElem = $leftElem[0],
			rightElem = $rightElem[0];

		while (leftElem !== rightElem
				|| leftElem.tagName === 'TR' || leftElem.tagName === 'TBODY' || leftElem.tagName === 'TABLE')
		{
			$leftElem = $leftElem.parent();
			$rightElem = $rightElem.parent();
			leftElem = $leftElem[0];
			rightElem = $rightElem[0];
		}
		
		return $leftElem;
	};
	
	var pomCheckBoxClicked = function (e) {
		var target = e.target;
		if (target.tagName === 'INPUT' && target.type === 'checkbox')
		{
			var rowIndex = $(target).closest('tr')[0].rowIndex;
			if (rowIndex !== 0) // not the select/deselect all rows checkbox.
			{
				// Notify that POM row has been checked/unchecked
				notify({
					eventType : target.checked ? 'row.checked' : 'row.unchecked',
					rowIndex : rowIndex
				});
			}
			
		}
		
	};
	
	var pomTextFocused = function (e) {
		var target = e.target,
			$tr = $(target).closest('tr'),
			rowIndex = $tr[0].rowIndex,
			$checkbox = $tr.children().eq(0).find('input[type="checkbox"]');

		// Notify that POM row has been checked.
		if (!$checkbox[0].checked) // if was not checked before clicking.
		{
			notify({
				eventType : 'row.checked',
				rowIndex : rowIndex
			});
		}
		
		
	};
	
	var notify = function (eventObj) {
		
		var eventType = eventObj.eventType,
			rowIndex = eventObj.rowIndex,
			rowNumber = (rowIndex - numTitleRows) / rowSpan; // zero-based row number

		switch (eventType)
		{
			case 'row.checked' :
				if (invertNotifyEventType)
				{
					onRowUnChecked(rowIndex, rowNumber);
					invertNotifyEventType = false;
				}
				else
				{
					onRowChecked(rowIndex, rowNumber);
				}
				break;
				
			case 'row.unchecked' :
				if (invertNotifyEventType)
				{
					onRowChecked(rowIndex, rowNumber);
					invertNotifyEventType = false;
				}
				else
				{
					onRowUnChecked(rowIndex, rowNumber);
				}
				break;
				
			default :
				if (console && console.error)
				{
					console.error('invalid eventType passed to multiRowDragDrop.notify.');
				}
		}
	};
	
	var onRowChecked = function (rowIndex, rowNumber) {
		rowNumbers[rowNumber] = rowNumber;
		rowIndexes[rowNumber] = rowIndex;
		
		for (var i=0,span=rowSpan; i<span; i++)
		{
			var rowSpannedIndex = rowIndex + i,
				$leftRow = $leftRows.eq(rowSpannedIndex),
				$rightRow = $rightRows.eq(rowSpannedIndex),
				leftRow = $leftRow[0],
				rightRow = $rightRow[0];
			
			if (i === 0)
			{
				$.data(leftRow, 'isFirstOfSpan', true);
				$.data(rightRow, 'isFirstOfSpan', true);
			}
			
			// Store original row index
			$.data(leftRow, 'originalIndex', rowIndex);
			$.data(rightRow, 'originalIndex', rowIndex);
			
			selectedLeftRows[rowSpannedIndex] = $leftRow;
			selectedRightRows[rowSpannedIndex] = $rightRow;
		}
	};
	
	var onRowUnChecked = function (rowIndex, rowNumber) {
		var $firstLeftRow = selectedLeftRows[rowIndex],
			$firstRightRow = selectedRightRows[rowIndex];

		removeCustomData($firstLeftRow);
		removeCustomData($firstRightRow);
		
		delete rowNumbers[rowNumber];
		delete rowIndexes[rowNumber];
		
		for (var i=0; i<rowSpan; i++)
		{
			delete selectedLeftRows[rowIndex + i];
			delete selectedRightRows[rowIndex + i];
		}
	};
	
	var removeCustomData = function ($row) {
		if ($row && $row.length > 0)
		{
			$row.removeData('isFirstOfSpan')
				.removeData('originalIndex');
		}
	};
	
	var onDrop = function (from, to, $rows1, $rows2, doNotSave) {
		resetVisualElements();
		
		if (doNotSave !== true && from !== to && !doNothing && isValidMove(to))
		{
			moveRows(to);
			save(to);
		}
		else if (!atLeastOneRowSelected)
		{
			for (var index in selectedLeftRows)
			{
				removeCustomData(selectedLeftRows[index]);
				removeCustomData(selectedRightRows[index]);
				
				delete selectedLeftRows[index];
				delete selectedRightRows[index];
			}
			for (var index in rowNumbers)
			{
				delete rowNumbers[index];
			}
			for (var index in rowIndexes)
			{
				delete rowIndexes[index];
			}
			
		}
		
		doNothing = false;
		
	};
	
	var resetVisualElements = function () {
		var dragContainerId = (atLeastOneRowSelected) ? 'multiRowDragDropContainer' : 'singleRowDragDropContainer',
			mouseMoveNameSpace = (atLeastOneRowSelected) ? 'multiDragCodes' : 'multiDragSingleRow';
			
		showRows();
		removeDragContainer(dragContainerId, mouseMoveNameSpace);
		clearDropRowIndicator();
		$indicatorContainer.css('display', 'none');
		
		adjacentRowNumbers.length = 0; // Empty row numbers added onDragStart.
	};
	
	var showRows = function () {
		$.each(selectedLeftRows, function (i, $selectedRow) {
			$selectedRow.css('visibility', 'visible');
		});
		$.each(selectedRightRows, function (i, $selectedRow) {
			$selectedRow.css('visibility', 'visible');
		});
	};
	
	var removeDragContainer = function (dragContainerId, mouseMoveNameSpace) {
		var dragContainer = getElemnt(dragContainerId);
		
		if (!dragContainer)
		{
			return;
		}
		
		if (IE && dragContainer.releaseCapture)
		{
			dragContainer.releaseCapture();
		}
		
		$(dragContainer).remove();
		$(document).unbind('mousemove.' + mouseMoveNameSpace);
	};
	
	var clearDropRowIndicator = function () {
		if (!$prevHoveredRow)
		{
			return;
		}
		$prevHoveredRow.removeClass('multiRowDragDropIndicator');
		$prevHoveredRow = null;
	};
	
	var save = function (to) {
		/* Tracker#: 20211 - POM-DRAG AND DROP DOESN'T REORDER ROWS IF ROW IS MOVED BEFORE BEING SAVED
		 * Design Change - Now prompting to save changes on attempting to drag & drop instead of ondrop.
		 */
	    
		var htmlAreaObj = _getWorkAreaDefaultObj();
	   	var objAjax = htmlAreaObj.getHTMLAjax();
	    var objHTMLData = htmlAreaObj.getHTMLDataObj();
	    sectionName = objAjax.getDivSectionId();
		bShowMsg = true;
		objAjax.setActionURL( getActionURL(to) );
		/* Tracker#: 19261 - PLM POM DRAG AND DROP SLOW PERFORMANCE
		 * Not refreshing the screen after dropping(thus saving) row.
		 * Displaying saved successfully message.
		 */
		objAjax.setProcessHandler(function () {
			_displayProcessMessage(objAjax);
			unCheckRows();
			updateRowRefs();
			atLeastOneRowSelected = false;
		});
		objAjax.sendRequest();
		if(objAjax.isProcessComplete())
	  	{
	      objHTMLData.resetChangeFields();
	  	}
	};
	
	var getActionURL = function (to) {
		var action = getAction();
		
		var url = action + ".do?method=dragdroppoms";
		$.each(rowNumbers, function (i, rowNum) {
			url += '&from=' + rowNum; 
		});
		url += "&to=" + to;
		return url;
	};
	
	var getAction = function () {
		switch (docViewId)
		{
			case '12701' : return 'plmpomworksheet';
			case '12702' : return 'multipom';
		}
	};
	
	var unCheckRows = function () {
		/* length and keys of rowNumbers, rowIndex are equal.
		 * length and keys of selectedLeftRows, selectedRightRows are equal.
		 */
		$.each(rowNumbers, function (key) {
			delete rowNumbers[key];
			delete rowIndexes[key];
		});
		
		var checkBoxes = [];
		$.each(selectedLeftRows, function (key, $leftRow) {
			var $rightRow = selectedRightRows[key],
				checkBox = $leftRow.children().eq(0).find('input')[0];
			
			checkBoxes.push(checkBox);
			
			removeCustomData($leftRow);
			removeCustomData($rightRow);
			
			delete selectedLeftRows[key];
			delete selectedRightRows[key];
		});
		
		if (atLeastOneRowSelected)
		{
			$.each(checkBoxes, function (i, checkBox) {
				if (checkBox)
				{
					checkBox.click();
				}
			});
		}
		
	};
	
	var moveRows = function (toRowPosition) {
		// Sort rows first in ascending order
		var sortedLeftRows = sortRows(selectedLeftRows),
			sortedRightRows = sortRows(selectedRightRows),
			$sortedLeftRows = $([]),
			$sortedRightRows = $([]),
			toRowIndex = (toRowPosition * rowSpan) + numTitleRows;
		
		$.each(sortedLeftRows, function (i, $row) {
			$sortedLeftRows = $sortedLeftRows.add($row);
		});
		$.each(sortedRightRows, function (i, $row) {
			$sortedRightRows = $sortedRightRows.add($row);
		});
		
		var $leftInsertionRow = $leftRows.eq( toRowIndex );
		$leftInsertionRow.before($sortedLeftRows);
		var $rightInsertionRow = $rightRows.eq( toRowIndex );
		$rightInsertionRow.before($sortedRightRows);

	};
	
	var sortRows = function (rows) {
		var sortedRows = [],
			indexes = [];
		
		$.each(rows, function (key, $row) {
			sortedRows.push($row);
			indexes.push(key);
		});
		
		for (var i=0; i<indexes.length-1; i++)
		{
			var currentIndex = indexes[i];
			var currentRow = sortedRows[i];
			for (var j=i+1; j<indexes.length; j++)
			{
				var otherIndex = indexes[j];
				var otherRow = sortedRows[j];
				if (currentIndex > otherIndex)
				{
					var temp = currentIndex;
					currentIndex = otherIndex;
					otherIndex = temp;
					
					temp = currentRow;
					currentRow = otherRow;
					otherRow = temp;
				}
			}
		}
		
		return sortedRows;
	};
	
	// Checks to see if not trying to move dragged rows on top of themselves
	var isValidMove = function (toRowNum) {
		for (var rowNumKey in rowNumbers)
		{
			var rowNum = rowNumbers[rowNumKey];
			if (rowNum === toRowNum)
			{
				return false;
			}
		}
		
		return true;
	};
	
	// clickedRowIndex - rowIndex of clicked row minus title rows.
	var onDragStart = function ($rows1, $rows2, e, inputClickedRowIndex, clickedRowNum, allRowsHeight) {
		clickedRowIndex = inputClickedRowIndex;
		atLeastOneRowSelected = areRowsSelected(); 
		
		updateRowRefs();
		
		if (!atLeastOneRowSelected)
		{
			updateIndicatorDragStart(clickedRowNum, allRowsHeight);
			singleRowDragStart($rows1, $rows2, e);
		}
		else // multi-row drag & drop
		{
//			if (!clickedOnSelectedRow(clickedRowNum))
//			{
//				updateIndicatorDragStart(clickedRowNum, allRowsHeight);
//				singleRowDragStart($rows1, $rows2, e);
//			}
//			else
//			{
//				multiRowDragStart(clickedRowIndex, clickedRowNum, allRowsHeight, e);
//			}
			if (!clickedOnSelectedRow(clickedRowNum))
			{
				doNothing = true;
			}
			else
			{
				multiRowDragStart(clickedRowIndex, clickedRowNum, allRowsHeight, e);
			}
			
		}
		
	};
	
	var updateIndicatorDragStart = function (clickedRowNum, allRowsHeight) {
		$indicatorContainer.css('display', 'block');
		$rowIndicator.css('top',clickedRowNum * allRowsHeight);
	};
	
	var clickedOnSelectedRow = function (clickedRowNumber) {
		return (rowNumbers[clickedRowNumber] !== undefined);
	};
	
	var getAdjacentRowNumbers = function (clickedRowNumber) {
		addAdjacentRows(adjacentRowNumbers, clickedRowNumber, 'above');
		addAdjacentRows(adjacentRowNumbers, clickedRowNumber, 'below');
		adjacentRowNumbers.push(clickedRowNumber);
	};
	
	var hideAdjacentRows = function () {
		for (var i=0,length=adjacentRowNumbers.length; i<length; i++)
		{
			var clickedRowNum = adjacentRowNumbers[i],
				clickedRowIndex = clickedRowNum * rowSpan + numTitleRows;
			
			for (var j=0, len=rowSpan; j<len; j++)
			{
				var rowSpanIndex = clickedRowIndex + j,
					$leftRow = selectedLeftRows[rowSpanIndex],
					$rightRow = selectedRightRows[rowSpanIndex];
				
				$leftRow.add($rightRow).css('visibility', 'hidden');
			}
		}
	};
	
	var areRowsSelected = function () {
		for (var index in selectedLeftRows)
		{
			return true;
		}
		return false;
	};
	
	var singleRowDragStart = function (rows1, rows2, e) {
    	var clones = createClones(rows1, rows2),
    		clone1 = clones.clone1,
    		clone2 = clones.clone2;
	    
	    rows1.add(rows2).css('visibility', 'hidden');
            
	    var combinedClone = combineClones(clone1, clone2, rows2);
	    var offset = rows1.offset();
        var finalClone = createFinalClone(combinedClone, offset, e);
        
        $('body').append(finalClone);
        
        initDragStartEvent(e.pageY, e.pageX, offset,
	    		finalClone, 'singleRowDragDropContainer', 0, 'multiDragSingleRow');
        
        var currentRowIndex = rows1[0].rowIndex;
        
        notify({
        	eventType : 'row.checked',
        	rowIndex : currentRowIndex
        });
        
	};
	
	var multiRowDragStart = function (clickedRowIndex, clickedRowNum, allRowsHeight, e) {
		updateIndicatorDragStart(clickedRowNum, allRowsHeight);
		var clickedRowNumber = clickedRowIndex / rowSpan;
		getAdjacentRowNumbers(clickedRowNumber);
		hideAdjacentRows();
		
		var displayValues = getSortedDisplayValues(); 
		var pomCodes = displayValues.pomCodes;
		var otherDisplayValues = displayValues.otherDisplayValues;
		
		// create drag container
		var $draggingContainer = $('<div id="multiRowDragDropContainer"/>');
		var $table = $('<table/>');
		
		// add pom codes and other display values to container
		$.each(pomCodes, function (i, pomCode) {
			var $tr = $('<tr/>'),
				$td;
			
			addCell($tr, pomCode);
			
			for (var j=0, len=otherDisplayValues.length; j<len; j++)
			{
				var displayValue = otherDisplayValues[j][i];
				addCell($tr, displayValue);
			}
			
			$table.append($tr);
		});
		
		var currentPageY = e.pageY,
			currentPageX = e.pageX;
		
		$draggingContainer.css({
			top : currentPageY,
			left : currentPageX
		});
		
		$draggingContainer.append($table);
		$('body').append($draggingContainer);
		
		
		initDragStartEvent(currentPageY, currentPageX, false,
				$draggingContainer, 'multiRowDragDropContainer', 'multiDragCodes');
	};
	
	var createClones = function (rows1, rows2) {
		var clone1 = rows1.clone(false).removeAttr('id')
	        .removeAttr('onmouseover')
	        .removeAttr('onmouseout');
        
		var clone2 = rows2.clone(false).removeAttr('id')
			.removeAttr('onmouseover')
			.removeAttr('onmouseout');
        
		return {
			clone1 : clone1,
			clone2 : clone2
		};
	};
	
	var combineClones = function (clone1, clone2, rows2) {
		clone2.each(function (i) {
    		clone1.eq(i).append($(this).html());
    	});
	    
	    clone1.eq(0).height(rows2.eq(0).height());
	    
	    return clone1; // clone1 is now combination of clone1 & clone2
	};
	
	var createFinalClone = function (combinedClone, offset, e) {
		var finalClone = $('<table id="singleRowDragDropContainer"><tbody></tbody></table>');
        
        combinedClone.each(function (i) {
        	finalClone.append(combinedClone.eq(i));
        });


        // Other styles applied via stylesheet.
        finalClone.css({
            top : offset.top,
            left: offset.left
        });
        
        return finalClone;
	};
	
	var initDragStartEvent = function (currentPageY, currentPageX, addOffset,
			$draggingContainer, dragContainerId, mouseMoveNameSpace) {
		
		oldPageY = currentPageY;
		oldPageX = currentPageX;
		
		if (addOffset)
		{
			oldTop = addOffset.top;
			oldLeft = addOffset.left;
		}
		else
		{
			oldTop = currentPageY;
			oldLeft = currentPageX;
		}
		
		attachDragDropEvent('mousemove.' + mouseMoveNameSpace, function (e) {
			mouseMoveHandler(e, dragContainerId);
		});
		
		var draggingContainer = $draggingContainer[0];
		if(IE && draggingContainer.setCapture)
		{
			draggingContainer.setCapture();
		}
	};
	
	var mouseMoveHandler = function (e, dragContainerId) {
		var $dragContainer = $('#' + dragContainerId),
			currentPageY = e.pageY,
			currentPageX = e.pageX,
			newTop = oldTop + (currentPageY - oldPageY),
			newLeft = oldLeft + (currentPageX - oldPageX);
	
		$dragContainer.css({
			top :  newTop,
			left : newLeft
		});
		
		oldTop = newTop;
		oldLeft = newLeft;
		
		oldPageY = currentPageY;
		oldPageX = currentPageX;
	};
	
	var attachDragDropEvent = function (event, handlerFunc) {
		$(document)
			.unbind(event)
			.bind(event, handlerFunc);
	};
	
	var isRowSelected = function (rowIndex) {
		for (var index in rowIndexes)
		{
			if (rowIndex === rowIndexes[index])
			{
				return true;
			}
		}
		return false;
	};
	
	var getSortedDisplayValues = function () {
		var pomCodes = [],
			otherDisplayValues = [], // will be array of arrays
			sortedRows = [];
		
		/* create an array for each field whose value is to be displayed
		 * other than POM_CODE field.
		 */
		for (var i=0, len=otherColIndexes.length; i<len; i++)
		{
			otherDisplayValues.push([]);
		}
		
		for (var i=0,length=adjacentRowNumbers.length; i<length; i++)
		{
			var rowIndex = adjacentRowNumbers[i] * rowSpan + numTitleRows,
				$selectedRow = selectedLeftRows[rowIndex];
			
			if (sortedRows.length === 0)
			{
				sortedRows[0] = $selectedRow;
			}
			else
			{
				sortedInsert(sortedRows, $selectedRow);
			}
		}
		
		$.each(sortedRows, function (i, $row) {
			var $cells = $row.children();
			pomCodes.push( $cells.eq(pomCodeColIndex).find('input').val() );
			// Get the value of the other display fields for the current row in loop
			for (var j=0, len=otherColIndexes.length; j<len; j++)
			{
				var otherColIndex = otherColIndexes[j];
				otherDisplayValues[j].push( $cells.eq(otherColIndex).find('input').val() );
			}
		});
		
		return {
			pomCodes : pomCodes,
			otherDisplayValues : otherDisplayValues
		};
	};
	
	var sortedInsert = function (sortedRows, $selectedRow) {
		for (var i=0; i<sortedRows.length; i++)
		{
			var $currentRow = sortedRows[i];
			if ( $selectedRow.data('originalIndex') < $currentRow.data('originalIndex') )
			{
				sortedRows.splice(i, 0, $selectedRow);
				return;
			}
		}
		
		sortedRows.push($selectedRow);
	};
	
	var addCell = function ($tr, value) {
		var $td = $('<td class="clsBrdBtmRt"/>');
		$td.html(value);
		$tr.append($td);
	};
	
	
	var afterDragStart = function (newRowIndex, allRowsHeight) {
		if (doNothing)
		{
			return;
		}
		updateDropRowIndicator(newRowIndex, allRowsHeight);
		
		if (!isRowNumbersEmpty()) // if there are rows selected
		{
			uncheckNonAdjacent(adjacentRowNumbers);
		}
	};
	
	var updateDropRowIndicator = function (newRowIndex, allRowsHeight) {
		if ($.tableDnD.isScrolling)
		{
			return;
		}
		
		$rowIndicator.css('top', newRowIndex * allRowsHeight);
	};
	
	var isRowNumbersEmpty = function () {
		for (var index in rowNumbers)
		{
			return false;
		}
		return true;
	};
	
	var addAdjacentRows = function (adjacentGroup, clickedRowNumber, direction)
	{
		var increment;
		switch (direction)
		{
			case 'above' :
				increment = -1;
				break;
				
			case 'below' :
				increment = 1;
				break;
		}
		
		var currentRowNum = clickedRowNumber;
		while (checkIfRowAdjacent(currentRowNum, direction))
		{
			adjacentGroup.push(rowNumbers[currentRowNum + increment]);
			currentRowNum += increment;
		}
	}
	
	var uncheckNonAdjacent = function (adjacentGroup) {
		
		var checkBoxes = [];
		/* length and keys of rowNumbers, rowIndex are equal.
		 * length and keys of selectedLeftRows, selectedRightRows are equal.
		 */
		$.each(rowNumbers, function (key, rowNumber) {
			for (var i=0,length=adjacentGroup.length; i<length; i++)
			{
				if ( rowNumber === rowNumbers[adjacentGroup[i]] )
				{
					return;
				}
				
			}
			
			var rowIndex = rowIndexes[key],
				$leftRow = selectedLeftRows[rowIndex],
				checkBox = $leftRow.children().eq(0).find('input')[0];
			
			checkBoxes.push(checkBox);

		});
		
		if (atLeastOneRowSelected)
		{
			$.each(checkBoxes, function (i, checkBox) {
				if (checkBox)
				{
					invertNotifyEventType = true;
					$(checkBox).click();
				}
			});
		}
		
	};
	
	var sortRowNumbers = function () {
		var sortedRowNumbers = [];
		
		for (var index in rowNumbers)
		{
			sortedRowNumbers.push(rowNumbers[index]);
		}
		
		// sort in ascending order
		sortedRowNumbers.sort(function (a,b) {
			return a - b;
		});
		
		return sortedRowNumbers;
	};
	
	var checkIfRowAdjacent = function (currentRowNum, side) {
		switch (side)
		{
			case 'above' :
				return (rowNumbers[currentRowNum - 1] !== undefined);
				break;
				
			case 'below' :
				return (rowNumbers[currentRowNum + 1] !== undefined);
				break;
		}
	};
	
	
	var dropRowIndicator = function (e) {
		return;
		
		var target = e.target,
			$target;
		if (target.tagName === 'TD')
		{
			$target = $(target);
			var $hoveredRow = $target.closest('tr');
			if ($prevHoveredRow && $prevHoveredRow[0] !== $hoveredRow[0])
			{
				$prevHoveredRow.removeClass(highlightClass);
				$hoveredRow.addClass(highlightClass);
			}
			
			$prevHoveredRow = $hoveredRow;
		}
	};
	
	var forceCursor = function (cursor) {
		if (cursor === false)
		{
			$('#multiDragDropForceCursor').remove();
			return;
		}
		var $div = $('<div id="multiDragDropForceCursor"/>');
		$div.css({
		    width: 3000,
		    height: 3000,
		    backgroundColor: 'white',
		    opacity: 0,
		    zIndex: 20000,
		    cursor: cursor
		});
		$('body').append($div);
	};
	
	return {
		init : init,
		notify : notify,
		onDrop : onDrop,
		onDragStart : onDragStart,
		afterDragStart : afterDragStart,
		pomCheckBoxClicked : pomCheckBoxClicked
	};
})(window);



/*
Tracker#:18557 HIDE OPTION SHOULD NOT SAVE WHEN THE USER LEAVES THE POM SCREEN
Send Ajax request to refresh POM Screen on changing the HideGrading options.
*/
function _plmpom_hideGrading(objHideGrading)
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();

    sectionName = objAjax.getDivSectionId();
    var url ="hidegrading";
    
 	if(objHTMLData.getSaveChangeFields().length> 0)
 	{
 		objHtmlData = htmlAreaObj.checkForNavigation();
		if(objHtmlData!=null && objHtmlData.hasUserModifiedData()==true)
	    {
	        objHtmlData.performSaveChanges(refreshFields);
	        return;
	    }
 	}
 	
	if(objAjax && objHideGrading!= 'undefined')
	{
		docview = objAjax.getDocViewId();
    	// alert("docview: "+docview);
    	// alert("inside calling");
		bShowMsg = true;    	
		objAjax.setActionURL("plmpomworksheet.do");
		objAjax.setActionMethod(url);
		objAjax.setProcessHandler(_plmpom_refreshGrading);
		objAjax.parameter().add('grading', objHideGrading.value);
		objAjax.sendRequest();
	}
}
/*
Tracker#:18557 HIDE OPTION SHOULD NOT SAVE WHEN THE USER LEAVES THE POM SCREEN
Reload the POM Detail lines, based on the hide grading options. If hide grading value is set 
hide grading lines and show on spec lines, if hide spec value is set hide spec lines show grading
lines. if option is not selected or selected A then show both Grading and Spec lines  
*/
function _plmpom_refreshGrading(objAjax)
{
    //alert(" _showColorLibPage: \n sectionName "+sectionName);
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
        var htmlAreaObj = _getWorkAreaDefaultObj();
        var objHTMLData = htmlAreaObj.getHTMLDataObj();
        // Reseting the changefields because Hide Grading changes should not save.  
        objHTMLData.resetChangeFields();
    }
}

/*
 * Tracker#:19802 TSR 532 F1  PROCESS FOR OPENING MULTIPLE POM WORKSHEETS IN THE MULTI POM POPUP WINDOW (BR01)
 * function to open a new window, to show Multi Window screen.
 * 
 */
function _plmpom_openmultipom()
{
	var nwWindow = window.open('multipom.do?method=view', '', 'width=1146, height=600,resizable=yes, toolbar=no, scrollbars=yes, left=165, top=100');
	nwWindow.focus();
}

/**
 * Tracker#:19803 TSR 532 F2.1 SEARCH CAPABILITIES WITHIN THE MULTI POM POPUP
 * function to request SORT function on Multi POM List screen.
 * @param fieldName on which SORT been called
 * @param sec main section in which List screen is built
 * @param type Descending or Ascending sort
 * @param pageNo current page number
 */
function _multipomSortColumn(fieldName,sec,type, pageNo)
{
	sectionName = sec;
	var objAjax = getMaterialLibHTMLAjax();
	if(objAjax)
	{
	    objAjax.setActionURL("multipom.do");
	    objAjax.setActionMethod("SORT&sortColumn="+fieldName+"&sort="+type+"&pageNum="+pageNo);
	    objAjax.setProcessHandler(_showMaterialListPage);
	    objAjax.sendRequest();
	}
}
/**
 * Tracker#:19803 TSR 532 F2.1 SEARCH CAPABILITIES WITHIN THE MULTI POM POPUP
 * resetAllMainDivs function is called usually this function is called in showWorkArea function
 * but while printing MultiPOM window, _showWorkArea is not called.
 * 
 */
function _multipomResetMainDivs()
{
	if(nCurScrWidth > MinimumScrWidth)
	{
	    resetAllMainDivs();
	}
}

/**
 *Tracker#:19804 TSR 532 F3 POM WORKSHEETS IN THE MULTI POM POPUP WILL BE EDITABLE
 *Function to show Multiple POMs on tabs, those are selected in the multi pom list screen.  
 */
function _multipomOpenPOMs()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
	//alert("htmlAreaObj " + htmlAreaObj);
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    
    if(!objAjax)objAjax = new htmlAjax();
    var url = "open";
    
    if(objAjax)
	{
    	if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
		{
    		var htmlErrors = objAjax.error();
		    objAjax.error().addWarning("Select Style(s) to Open");
		    messagingDiv(htmlErrors);
		    return;
		}
    	bShowMsg = true;
    	loadWorkArea("multipom.do", url,null, _showmultiPOMWorkArea,objAjax);
		if(objAjax.isProcessComplete())
    	{
        	objHTMLData.resetChangeFields();
        }        
	}
}
/**
 * Tracker#:19804 TSR 532 F3 POM WORKSHEETS IN THE MULTI POM POPUP WILL BE EDITABLE
 * Function to show current tab content on clicking the tab.
 * 
 * @param sltdtab
 */
function _multipomSwtichTabs(sltdtab)
{
 		var htmlAreaObj = _getAreaObjByDocView('12702');
	 	var url = "navtabs&keyinfo="+getKeyInfo(sltdtab);
		var objAjax = htmlAreaObj.getHTMLAjax();
		
	    if(!isValidTecSpec(true))
	    {
	        return;
	    }

	    if(htmlAreaObj)
		{
	    	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	    	
			if(!htmlAreaObj.checkForNavigation())
			{
			    // Check for valid record to execute process.

				sectionName = objAjax.getDivSectionId();
				//alert("sectionName  " + sectionName);
			    if(objAjax && objHTMLData)
			    {
			    	//alert("inside calling");
			    	bShowMsg = true;
			    	loadWorkArea("multipom.do", url,null, _showmultiPOMWorkArea,objAjax);
			        if(objAjax.isProcessComplete())
			        {
			            objHTMLData.resetChangeFields();
			        }
			    }
			}
			else
			{
				var docviewid = objAjax.getDocViewId();
				if (docviewid == 12702 && objHtmlData!=null && objHtmlData.hasUserModifiedData()==true)
				{
					objHtmlData.performSaveChanges(_multipomRefreshFields);
					
					if(objAjax.isProcessComplete())
					{
						objHtmlData.resetChangeFields();	
					}
					return;
				}
			}
		}
}

/**
 * close tab requet to server, passing selected tab and pass keyinfo to server.
 * 
 * @param sltdtab
 */
function _multipomCloseTab(sltdtab)
{
	var htmlAreaObj = _getAreaObjByDocView('12702');
 	var url = "closetab&keyinfo="+getKeyInfo(sltdtab);
	var objAjax = htmlAreaObj.getHTMLAjax();
	
    if(!isValidTecSpec(true))
    {
        return;
    }

    if(htmlAreaObj)
	{
    	var objHTMLData = htmlAreaObj.getHTMLDataObj();
    	
		if(!htmlAreaObj.checkForNavigation())
		{
		    // Check for valid record to execute process.

			sectionName = objAjax.getDivSectionId();
			//alert("sectionName  " + sectionName);
		    if(objAjax && objHTMLData)
		    {
		    	//alert("inside calling");
		    	bShowMsg = true;
		    	loadWorkArea("multipom.do", url,null, _showmultiPOMWorkArea,objAjax);
		        if(objAjax.isProcessComplete())
		        {
		            objHTMLData.resetChangeFields();
		        }
		    }
		}
		else
		{
			var docviewid = objAjax.getDocViewId();
			if (docviewid == 12702 && objHtmlData!=null && objHtmlData.hasUserModifiedData()==true)
			{
				objHtmlData.performSaveChanges(_multipomRefreshFields);
				
				if(objAjax.isProcessComplete())
				{
					objHtmlData.resetChangeFields();	
				}
				return;
			}
		}
	}
}

/**
 * Tracker#:19804 TSR 532 F3 POM WORKSHEETS IN THE MULTI POM POPUP WILL BE EDITABLE
 * Custom callback function to register all sections in Multipom tab.
 * @param objAjax
 */
function _showmultiPOMWorkArea(objAjax)
{
    try
    {
        //alert("_showWorkArea ");
        if(objAjax)
        {
        	_executePreProcess();
            //alert("_showWorkArea: \n _getWorkAreaObj().getDivSaveContainerName() " + _getWorkAreaObj().getDivSaveContainerName());
            var div=getElemnt(_getWorkAreaObj().getDivSaveContainerName());
            workAreaDivsList = new Array();

            if(div)
            {
                registerHTML(div,objAjax);
            }
             // alignWorkAreaContainer would cause error for multi window pom, so that commented.
             // alignWorkAreaContainer();

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
    		_displayProcessMessage(objAjax);
    		/**
    		 * Tracker#:21552 MULTI WINDOW POM OPENS SCROLLED DOWN SO THE TOP OF THE SCREEN DOES NOT SHOW
    		 * setting mainScrollArea's scrollTop to 0.
    		 */
    		var divDataWrkArea = document.getElementById("mainScrollArea");
    		if(divDataWrkArea)
    			{
    				divDataWrkArea.scrollTop = 0;
    			}
        }
    }
    catch(e)
    {
        //alert(e.description);
    }
}
/**
 * 
 * Function to send save request to server side and refreshing screen accordingly. 
 * 
 */
function _multipomSave()
{
  	var htmlAreaObj = _getAreaObjByDocView('12702');
    var objHtmlData = htmlAreaObj.getHTMLDataObj();
    var docviewid = htmlAreaObj.getDocViewId();    
    if(objHtmlData!=null && objHtmlData.hasUserModifiedData()==true)
    {
        //alert("loadWorkArea: save changes \n creating ");
        //perform save operation
        objHtmlData.performSaveChanges(_multipomRefreshFields);
        var objAjax = htmlAreaObj.getHTMLAjax();
        
        if(objAjax.isProcessComplete())
		{
			objHtmlData.resetChangeFields();	
		}
    }
    else
    {
    	var objAjax = new htmlAjax();
    	objAjax.error().addError("warningInfo", szMsg_No_change, false);
    	_displayProcessMessage(objAjax);
       // _displayUserMessage(szMsg_No_change);
    }
}

/**
 * This function is similar to refreshFields, but cutsomised to refresh and show MultiWindow POM screen.
 * 
 * @param objAjax
 */
function _multipomRefreshFields(objAjax)
{
	var refreshflag;
	var funName = "postSaveWorkArea";
	var responseString;

	if (objAjax)
	{		
		responseString = objAjax.getHTMLResult();
		// remove the <div> tags
		responseString = responseString.replace(/<\/?div[^>]*>/g,"");
	}
	//if there is nothing in the div, nothing to update
	if (objAjax)
	{
		if (responseString=="refresh" || responseString=="refreshall")
		{
			var htmlAreaObj = _getAreaObjByDocView('12702');
			var objHtmlData = htmlAreaObj.getHTMLDataObj();
			if(objAjax.isProcessComplete())
			{
				objHtmlData.resetChangeFields();
			}
			_multipomRefresh(objAjax);
		}
		else
		{
			// get the individual field updates
			var fieldArray = responseString.split("<cf>");
			var kvPair; 
			for (i=0; i < fieldArray.length; i++)
			{
				// get the field id and value
				kvPair=fieldArray[i].split("~");
				if (kvPair)
				{
					var element = document.getElementById(kvPair[0])
					if (element)
					{
						element.value=kvPair[1];
					}
				}
			}
			// uncheck any selected rows
			var elementArray = document.getElementsByName('sectionCheckBox')
			if (elementArray)
			{			
				var i
				for (i=0; i<elementArray.length; i++)
				{
					var checkElement
					checkElement = elementArray[i];
					if (checkElement.checked==true)
					{
						checkElement.click()
					}
					else
					{
						checkElement.click()
						checkElement.click()
					}
				}
			}
			if(!objAjax.error().hasErrorOccured())
			{
				//Tracker#:15783 ENTER A COLORWAY ON RANDOM LINE CAUSES AN ERROR
				//resetHTMLData(changefields data) only if the process is complete
				//alert("objAjax.isProcessComplete() " + objAjax.isProcessComplete());
				if(objAjax.isProcessComplete())
				{
					_getWorkAreaObj().resetHTMLData();					
				}
				_displayProcessMessage(objAjax)
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
	}
}
/**
 * Function to send request to refresh the MultiWindow Screen.
 * 
 * @param origObjAjax
 */
function _multipomRefresh(origObjAjax)
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();    
    
    if(_getAreaObjByDocView('12702').checkForNavigation())
	{
    	_getAreaObjByDocView('12702').getHTMLDataObj().performSaveChanges(_multipomRefreshFields);
	}
    else
	{
    	sectionName = objAjax.getDivSectionId();
        var url ="refreshmultipom";
            
    	if(objAjax && objHTMLData)
    	{

    		docview = objAjax.getDocViewId();
        	// alert("docview: "+docview);
        	// alert("inside calling");
        	bShowMsg = true;

    		objAjax.setActionMethod(url);		
    		// Tracker#:18081 MAINTAIN USER'S PLACE ON THE SCREEN AFTER ADDING, DELETING, SORTING AND COPYING POM CODES
       		// passed _showWorkArea_scroll to maintain the vertical scroll position on the screen.
    		loadWorkArea("multipom.do", url,null, _multipomWorkArea_scroll,origObjAjax);
    	}
	}
}
/**
 * copied  _showWorkArea_scroll from main.js, instead of _showWorkArea,  _showmultiPOMWorkArea 
 * is called because alignWorkAreaContainer used give error, and it is removed in _showmultiPOMWorkArea.
 */
function _multipomWorkArea_scroll(objAjax)
{	
    try
    {
    	var scrlTop = 0;
    	var divDataWrkArea = document.getElementById(_const_divDataWorkArea);
        //alert("_showWorkArea_scroll ");
        if(objAjax && divDataWrkArea)
        {
            //alert("_showWorkArea: \n _getWorkAreaObj().getDivSaveContainerName() " + _getWorkAreaObj().getDivSaveContainerName());                        
            
            scrlTop = divDataWrkArea.scrollTop;
            //alert("scrollTop= --- "+scrlTop);
        }
        _showmultiPOMWorkArea(objAjax);
        
        //alert("here");
        
        divDataWrkArea = document.getElementById(_const_divDataWorkArea);
        //alert("divDataWrkArea.offsetHeight"+ divDataWrkArea.offsetHeight  +"\n divDataWrkArea.height = "+ divDataWrkArea.height);
        
        if(divDataWrkArea)	// && divObj.offsetHeight>div.height)
        {
        	//alert("setting scroll " + scrlTop);
        	divDataWrkArea.scrollTop = scrlTop;
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
/**
 * Tracker#:20695 COLUMN HEADERS AND SIZE RANGE WILL ALWAYS BE VISIBLE ON THE POM ASSOCIATION SCREEN AS THE USER SCROLL DOWN THE SCREEN
 * function to set checkbox values of floating header rows to original document check boxes, so that user could edit floating header
 * checkboxes and save the changes.
 */
function _plm_pom_fixedHeaderRow(floatCell, floatRow)
{
	if (floatCell.length > 0 && floatRow.length > 0)
	{
		var chkbox = floatCell.find('input:checkbox');
		var chkboxid = chkbox.attr('id');
		
		if(chkboxid)
		{
			chkbox.attr({
				onclick : '',
				onchange : ''
			})
			.change(function(){
				
				var floatRowId = floatRow.attr('id'),
					isMultiPOM = ($('#_multiPOMTabCntr').length > 0) ? true : false,
					isSelectAll = chkboxid == 'sectionCheckBox';
				
				if(floatRowId =='_dtlSection_12701_right_table_trFitInd' || floatRowId =='_dtlSection_12702_right_table_trFitInd')
					{
						var chkboxes = floatRow.find('input:checkbox');
						chkboxes.each(function(){
							
							var curCheckBox = $(this);
							var curCheckBoxId = curCheckBox.attr('id');
							if(curCheckBox && curCheckBox.attr('checked') && chkboxid!=curCheckBoxId)
								{
									curCheckBox.attr('checked', false);
								}
							
						});
					}
					
				var orichkbox;
				if (isMultiPOM && isSelectAll) // select all checkbox on multi window
				{
					// there is more than one element with id=sectionCheckBox
					orichkbox = $('#_multiPOMTabCntr').find('#sectionCheckBox')[0];
				}
				else
				{
					orichkbox = getElemnt(chkboxid);
				}
				if(chkbox.attr('checked'))
					{
						$(orichkbox).attr('checked', true);
						if(orichkbox.onclick)orichkbox.onclick();
					}
				else
					{
						$(orichkbox).attr('checked', false);
						if(orichkbox.onclick)orichkbox.onclick();
					}
			});
		}
	}
}
/**
 * Tracker#:20695 COLUMN HEADERS AND SIZE RANGE WILL ALWAYS BE VISIBLE ON THE POM ASSOCIATION SCREEN AS THE USER SCROLL DOWN THE SCREEN
 * functioin to register left and right tables of detail part in POM to float the header rows on scrolling through the detail rows.
 */
function _plm_pom_fixedHeader(tblLhsId, tblRhsId)
{
	//alert('tblLhsId ' + tblLhsId);
	//alert('tblRhsId ' + tblRhsId);
	try
	{
		var $dataWorkArea = $('#_divDataWorkArea');
		
		/* unbind old scroll event handler - unsure why the old event handler is retained
		 * and actually fires along with the new scroll event handler.
		 */
		$dataWorkArea.unbind('scroll.floatHeader');
		//if (IE)
		{
			$('.floatHeader').detach();
		}
		
		$('#'+tblLhsId).floatHeader({
			enableFade: false,
			hideProperty: 'visibility',
			scrollElement: $dataWorkArea,
			containerDivId: tblLhsId + 'containerDiv',
			attachEventToInitFloatTable:_plm_pom_fixedHeaderRow
		}); 
		//alert("second");
		var rightContainerDivId = tblRhsId + 'containerDiv';
		$('#'+tblRhsId).floatHeader({
			enableFade: false,
			hideProperty: 'visibility',
			scrollElement: $dataWorkArea,
			containerDivId: rightContainerDivId,
			attachEventToInitFloatTable:_plm_pom_fixedHeaderRow
		});
		
		notifySliders({
			eventType : 'fixedHeader.init',
			rightContainerDivId : rightContainerDivId
		});
		
		window.calcRightFloaterWidth = function (rightTableId, leftTableId) {
			var $rightTable = $('#' + rightTableId);
			if ($rightTable.length > 0)
			{
				var $rightContainerDiv = $('#' + rightTableId + 'containerDiv'),
					$rightParentDiv = $rightTable.parent(),
					tableParentDivWidth = $rightParentDiv.outerWidth();

				$rightContainerDiv.width(tableParentDivWidth)
					.scrollLeft($rightParentDiv.scrollLeft()); // sync floating div's scrollLeft with original div's scrollLeft.

			}
		};
		
		if (_showWorkArea && _showWorkArea.toggleNav)
		{
			_showWorkArea.toggleNav.registerAfterAlignment('calcRightFloaterWidth', [tblRhsId, tblLhsId]);
		}
		
	}
	catch(e)
	{
		//alert(e.description);
	}
	
	
	//alert("done");
} 

/**
 * Tracker#:20698 COLUMN HEADERS WILL ALWAYS BE VISIBLE ON THE MULTI WINDOW AS THE USER SCROLLS THROUGH THE POM CODES
 * functioin to register left and right tables of detail part in MultiWindow screen to float the header rows on scrolling through the detail rows.
 */
function _plm_multipom_fixedHeader(tblLhsId, tblRhsId)
{
	try
	{
		var $dataWorkArea = $('#mainScrollArea');
		
		/* unbind old scroll event handler - unsure why the old event handler is retained
		 * and actually fires along with the new scroll event handler.
		 */
		$dataWorkArea.unbind('scroll.multiWindow');
		//if (IE)
		{
			$('.floatHeader').detach();
		}
		
		$('#'+tblLhsId).floatHeader({
			enableFade: false,
			hideProperty: 'visibility',
			scrollElement: $dataWorkArea,
			containerDivId: tblLhsId + 'containerDiv',
			attachEventToInitFloatTable:_plm_pom_fixedHeaderRow,
			scrollNameSpace:'multiWindow',
			leftNav: false,
			appendToElement: $('body'),
			IE6Fix_DetectScrollOnBody:false
		}); 
		//alert("second");
		var rightContainerDivId = tblRhsId + 'containerDiv';
		$('#'+tblRhsId).floatHeader({
			enableFade: false,
			hideProperty: 'visibility',
			scrollElement: $dataWorkArea,
			containerDivId: rightContainerDivId,
			attachEventToInitFloatTable:_plm_pom_fixedHeaderRow,
			scrollNameSpace:'multiWindow',
			leftNav: false,
			appendToElement: $('body'),
			IE6Fix_DetectScrollOnBody:false
		});
		
		notifySliders({
			eventType : 'fixedHeader.init',
			rightContainerDivId : rightContainerDivId
		});
		
		window.calcRightFloaterWidth = function (rightTableId, leftTableId) {
			var $rightTable = $('#' + rightTableId);
			if ($rightTable.length > 0)
			{
				var $rightContainerDiv = $('#' + rightTableId + 'containerDiv'),
					$rightParentDiv = $rightTable.parent(),
					tableParentDivWidth = $rightParentDiv.outerWidth();

				$rightContainerDiv.width(tableParentDivWidth)
					.scrollLeft($rightParentDiv.scrollLeft()); // sync floating div's scrollLeft with original div's scrollLeft.

			}
		};
		
	}
	catch(e)
	{
		//alert(e.description);
	}
}

/**
 * Tracker#:21186 FDD 548 MULTI WINDOW ADD POM CODES PROCESS
 * Request to create Add POM codes Popup window.
 */
function _multipom_addPOM()
{
	
    var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var actMethod ="addPLMPOM";
	var fldName="";
	
	if(objAjax)
   	{
   		if(!isValidRecord(true))
		{
			return;
		}
   	}
		
	if(objAjax)
    {
    	fldName = "_divDataWorkArea"// htmlAreaObj.getDivSectionId();
    	_startSmartTagPopup(fldName, false, null, false);
    	objAjax.setActionURL("multipom.do");
        objAjax.setActionMethod(actMethod);
        objAjax.attribute().setAttribute("htmlfldName", fldName);
        objAjax.setProcessHandler(_multipom_showPOMCodesDiv);
        //alert("sending");
        objAjax.sendRequest();
    }
}

//Post precess handle for showNewClipBoard
function _multipom_showPOMCodesDiv(objAjax)
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
           var popUpDiv = _showSmartTagPopup(objAjax);    
           _setElementToCenter(popUpDiv);        
        }
    }
}

/**
 * Tracker#:21186 FDD 548 MULTI WINDOW ADD POM CODES PROCESS
 * Add selected POM codes from Popup and save the changes.
 */
function _multipom_addSelectedPOM()
{
	var objHTMLData = _getAreaHTMLDataObjByDocView(30008);
	if(objHTMLData)
	{
		if(objHTMLData)
		{
			bShowMsg = true;
			objHTMLData.setSaveURL("multipom.do");
			objHTMLData.setActionMethod("addselectedpomcodes");
			var objAjax = objHTMLData.performSaveChanges(_showmultiPOMWorkArea);
			if(objAjax.isProcessComplete())
			{
				objHTMLData.resetChangeFields();
			}
		}
	}
}

/**
 * Tracker#:21187 MULTI WINDOW COPY POM CODES PROCESS
 * 
 * Request to Copy POM Codes process and re-paint the screen after coping POM codes.
 * 
 */
function _multipom_copypomcodes()
{
	var htmlAreaObj = _getAreaObjByDocView('12702');
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objAjax.getDivSectionId();
    var url ="copypomcodes";
    
    if(objAjax)
   	{
   		if(!isValidRecord(true))
		{
			return;
		}
   	}

	if(objAjax && objHTMLData)
	{

		if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
    	{
        	var htmlErrors = objAjax.error();
			objAjax.error().addError("warningInfo", szMsg_Selct_Pom_codes, false);
			messagingDiv(htmlErrors);
			return;
    	}    
		docview = objAjax.getDocViewId();		
    	// alert("docview: "+docview);
    	// alert("inside calling");
    	bShowMsg = true;
		objAjax.setActionURL("multipom.do");
		objAjax.setActionMethod(url);
		objAjax.setProcessHandler(_showmultiPOMWorkArea);
		objHTMLData.performSaveChanges(_multipomRefreshFields, objAjax);		
		if(objAjax.isProcessComplete())
	   	{
	       objHTMLData.resetChangeFields();
	   	}
	}
}

/**
 * Tracker#:21188 MULTI WINDOW DELETE POM CODES PROCESS
 * Send Request to Delete POM Codes on Multi Window screen.
 */

function _multipom_delete()
{
	var htmlAreaObj = _getAreaObjByDocView('12702');
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objAjax.getDivSectionId();
    var url ="delete";
    
    if(!isValidRecord(true))
	{
		return;
	}
	//Tracker#19005 COPY POM AND DELETE POM DETAILS DOES NOT ASK FOR SAVE MESSAGE BEFORE DELETE / COPY
    //User edits the screen and executing the 'Copy POM Code(s)' process without saving the changes
	//Pop up the  message 'There are changes on the screen. Do you want to save changes before current action?'.
	if(objHTMLData!=null && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
    {
    	var htmlErrors = objAjax.error();
        htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
        messagingDiv(htmlErrors, "objHtmlData.performSaveChanges(_multipomRefreshFields)", "_continuemultipom_delete()");
        return;
    }
    else
    {
    	_continuemultipom_delete();
    }
}

function _continuemultipom_delete()
{
	var htmlAreaObj = _getAreaObjByDocView('12702');
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objAjax.getDivSectionId();
    var url ="delete";
    
	if(objAjax && objHTMLData)
	{
		docview = objAjax.getDocViewId();		
    	// alert("docview: "+docview);
    	// alert("inside calling");
    	if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
    	{
    		bShowMsg = true;   	
    		objAjax.setActionURL("multipom.do");
    		objAjax.setActionMethod(url);
    		objAjax.setProcessHandler(_showmultiPOMWorkArea);
    		objHTMLData.performSaveChanges(_multipomRefreshFields, objAjax);
    		objAjax.sendRequest();
    		if(objAjax.isProcessComplete())
    	  	{
    	      objHTMLData.resetChangeFields();
    	  	}
    	}
    	else
    	{
    		var chgFlds = objHTMLData.getChangeFields();
    		var isDtlChck = false;
    		if(chgFlds && chgFlds.length>0)
    		{
    			 for (num = 0; num < chgFlds.length; num++)
		          {
						var obj = chgFlds[num];
						if(obj!=null && obj.startsWith(_CHK_BOX_DEFAULT_ID))
						{
							isDtlChck = true;
						}
	             }
	             
	            if(isDtlChck)
	            {
	            	var htmlErrors = objAjax.error();
    				htmlErrors.addError("confirmInfo", szMsg_Delete_Dtl,  false);
   					messagingDiv(htmlErrors,'_multipom_deletePOMCodes()', 'multiWindowcancelProcess()');
	            } 
	            else
	            {
	            	if (confirm(szMsg_Changes))
			        {
			         	objHtmlData.performSaveChanges(_multipomRefreshFields);
			         	if(objAjax.isProcessComplete())
					   	{
					       objHTMLData.resetChangeFields();
					   	}
    				}
    			}
			}
		}
	}
}

function _multipom_deletePOMCodes()
{
	closeMsgBox();
	var htmlAreaObj = _getAreaObjByDocView('12702');
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objAjax.getDivSectionId();
    var url ="delete";
	bShowMsg = true;   	
	objAjax.setActionURL("multipom.do");
	objAjax.setActionMethod(url);
	objAjax.setProcessHandler(_showmultiPOMWorkArea);
	objHTMLData.performSaveChanges(_multipomRefreshFields, objAjax);
	if(objAjax.isProcessComplete())
  	{
      objHTMLData.resetChangeFields();
  	} 
}

function multiWindowcancelProcess()
{
    var htmlAreaObj = _getAreaObjByDocView('12702');
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    if(objHTMLData)
    {
        objHTMLData.resetForm();
        objHTMLData.resetChangeFields();
    }
    closeMsgBox();
}

var PlmPomWorksheet = {
	//Tracker#:21391 Called on click of Hide/Show link on POMWorksheet
	pomSizesHideShow: function (screen, type)
	{	
		PlmPomWorksheet.hideShowPOMWSColumns(screen, type);
	},
	
	pomHideShow: function (screen, type)
	{	
		PlmPomWorksheet.hideShowPOMWSColumns(screen, type);
	},
	
	hideShowPOMWSColumns: function(screen, type)
	{
		//alert("Yet to implement");
		var htmlAreaObj = _getWorkAreaDefaultObj();
		var saveFunc = "_plmpom_save()";
		if(screen=="MULTIWINDOW")
     	{
			htmlAreaObj = _getAreaObjByDocView("12702");
			saveFunc = "_multipomSave()";
     	}
		//alert("htmlAreaObj " + htmlAreaObj);
		var objAjax = htmlAreaObj.getHTMLAjax();
		var objHTMLData = htmlAreaObj.getHTMLDataObj();
		
		PlmPomWorksheet._multipom_clearSmartTagCFs(screen);		
		
		if(objHTMLData!=null && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
	    {
	        var htmlErrors = objAjax.error();
	        htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
	        messagingDiv(htmlErrors, saveFunc, "PlmPomWorksheet.continuehideShowPOMColumns('"+screen+"','"+type+"')");
	    }
	    else
	    {
	        PlmPomWorksheet.continuehideShowPOMColumns(screen, type);
	    }
		
	},
	
	//Tracker#:21391 pints the Hide/Show popup div 
	continuehideShowPOMColumns: function (screen, type)
	{
		//alert(type);
	    cancelProcess();
	    var htmlAreaObj = _getWorkAreaDefaultObj();
	    if(screen=="MULTIWINDOW")
     	{
			htmlAreaObj = _getAreaObjByDocView("12702");
     	}
		//alert("htmlAreaObj " + htmlAreaObj);
		var objAjax = htmlAreaObj.getHTMLAjax();		
		urlparams = '&type='+type;
     	var actMethod = "hideshowpopup" + urlparams;
     	url = "plmpomworksheet.do";
     	if(screen=="MULTIWINDOW")
     	{
     		url = "multipom.do";
     	}
	    if(objAjax)
	    {
	    	var htmlfldName = htmlAreaObj.getDivSectionId();
	    	//alert("showView : objAjax "  + objAjax.getDocViewId());
	    	_startSmartTagPopup(htmlfldName, false, null, true);
	        objAjax.setActionURL(url);
	        objAjax.setActionMethod(actMethod);	   
	        objAjax.attribute().setAttribute("htmlfldName", htmlfldName);
	        objAjax.setProcessHandler(PlmPomWorksheet.displayPopUpHandler);
	        //alert("sending");
	        objAjax.sendRequest();
	    }
	},
	
	displayPopUpHandler: function(objAjax)
	{
		objAjax.attribute().setAttribute("HIDESHOWPOPUP", "YES");
		_showSmartTagInteractivePopup(objAjax);		
		divPopup = getElemnt("_popupDIV");
		//alert(divPopup);
		if(divPopup)
		{
			PlmPomWorksheet._setHideShowPopupToCenter(divPopup);	
		}				
	},
	//Tracker#:21391 shows POM by hiding the hidden cloumns for hide/show feature
	printHideShowPOM: function(screen, type)
	{
	    var url = "plmpomworksheet.do";
	    var callBackFun =_showWorkArea_scroll;
	    var htmlAreaObj = _getWorkAreaDefaultObj();
	    urlparams = '&type='+type;
	    var actionMethod ="hideshowview"+urlparams;
	    
	   	if(screen == "MULTIWINDOW")
	    {
	    	url = "multipom.do";
	    	callBackFun =_multipomWorkArea_scroll;	    
	    	htmlAreaObj = _getAreaObjByDocView("12702");
	    }
	    
	    var objAjax = htmlAreaObj.getHTMLAjax();
	    var objHTMLData = htmlAreaObj.getHTMLDataObj();
	    
        if(objAjax)
        {
        	bShowMsg = true;
            objAjax.setActionURL(url);
            objAjax.setDocViewId(objAjax.getDocViewId());
            objAjax.setActionMethod(actionMethod);
            objAjax.attribute().setAttribute("callBackFun", callBackFun);
            objAjax.setProcessHandler(PlmPomWorksheet.hideShowCallBack);
            objHTMLData.addAllChangedFieldsData(objAjax);
            objAjax.sendRequest();
        } 
	},
	
	closeHideShowPopup: function()
	{
		_closeSmartTag();
	},
	
	/**
	 * Clearing changes fields those are done on Popups in Mult Window screen
	 * needs to get work area by passing doc view id.
	 */
	_multipom_clearSmartTagCFs: function(screen)
	{
		var divSmart = getElemnt("_smartDiv");
		if(divSmart)
		{
			if(screen =="MULTIWINDOW")
			{
				var wrkareaObj =_getAreaObjByDocView("12702");

		        if(wrkareaObj)
		        {
		            var objHTMLData = wrkareaObj.getHTMLDataObj();

		            if(objHTMLData)
		            {
		               objHTMLData.removeAllCustomContainerChangeFields("_smartDiv");
		            }
		        }
			}
			else
			{
				_closeSmartTag(divSmart);
			}
		}
	},
	
	hideShowCallBack: function(objAjax)
	{
		var callbackFun = objAjax.attribute().getAttribute("callBackFun");
		//alert("PlmPomWorksheet="+callbackFun);
		if(objAjax.isProcessComplete())
	    {
	    	_closeSmartTag();	    	
	    	eval(callbackFun(objAjax));	    	 
	    }
	    else
	    {		    
	        //alert('bShowMsg ' + bShowMsg);
	     	if(bShowMsg==true)
	     	{    	 
	     		msgInfo = objAjax.getAllProcessMessages();
	 			//alert(" msgInfo: \n "+msgInfo);	
	 		    if(msgInfo!="")
	 		    {
	 		    	//alert("display called");
	 		        _displayProcessMessage(objAjax);
	 		    }
	     	}    	
	        bShowMsg= false;
	     }
	},
	
	selectDeselectAllFields: function(obj, tblId) 
	{
		var collection = document.getElementById(tblId).getElementsByTagName('INPUT');
    	var curchkbox;
    	
		for (var x=0; x<collection.length; x++) 
   		{
   			curchkbox = collection[x];
	        if (curchkbox.type.toUpperCase()=='CHECKBOX')
	        {	        	
	        	if (obj.checked)
				{					
	        		curchkbox.checked = true;
	        		_notifyCheckBoxChangeFields(curchkbox, true);
				}
				else 
				{
					curchkbox.checked = false;
					_notifyCheckBoxChangeFields(curchkbox, true);
				}
	        }
    	}
	},

	_setHideShowPopupToCenter: function(elem)
	{
		var elem_width = elem.offsetWidth;
		var elem_height = elem.offsetHeight;
		var scr_width = document.body.clientWidth;
		var scr_height = document.body.clientHeight;
		var top=(scr_height-elem_height)/2+"px";
		var left=(scr_width-elem_width)/2+"px";
	   	elem.style.top=top;
	   	elem.style.left=left;
	   	elem.style.visibility="visible";
	   	elem.style.position="absolute";
	    elem.style.display = "block";
	},
	
	deletePOMCodes: function()
	{
		var htmlAreaObj = _getWorkAreaDefaultObj();
	   	var objAjax = htmlAreaObj.getHTMLAjax();
	    var objHTMLData = htmlAreaObj.getHTMLDataObj();
	    
	    if(!isValidRecord(true))
		{
			return;
		}
	    
	    if(objHTMLData!=null && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
	    {
	    	var htmlErrors = objAjax.error();
	        htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
	        messagingDiv(htmlErrors, "objHtmlData.performSaveChanges(refreshFields)", "PlmPomWorksheet._continueDeletePOMCodes()");
	        return;
	    }
	    else
	    {
	    	PlmPomWorksheet._continueDeletePOMCodes();
	    }
	},
	
	_continueDeletePOMCodes: function()
	{
		var htmlAreaObj = _getWorkAreaDefaultObj();
	   	var objAjax = htmlAreaObj.getHTMLAjax();
	    var objHTMLData = htmlAreaObj.getHTMLDataObj();
	    
	    if(objAjax && objHTMLData)
		{
	    	if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==true)
	    	{
	    		var chgFlds = objHTMLData.getChangeFields();
	    		var isDtlChck = false;
	    		if(chgFlds && chgFlds.length>0)
	    		{
	    			 for (num = 0; num < chgFlds.length; num++)
			          {
							var obj = chgFlds[num];
							if(obj!=null && obj.startsWith(_CHK_BOX_DEFAULT_ID))
							{
								isDtlChck = true;
							}
		             }
		             
		            if(isDtlChck)
		            {
		            	var htmlErrors = objAjax.error();
	    				htmlErrors.addError("confirmInfo", szMsg_Delete_Dtl,  false);
	   					messagingDiv(htmlErrors,'_plmpom_deletePOMCodes("deletepomcode")', 'cancelProcess()');
		            } 
		            else
		            {
		            	if (confirm(szMsg_Changes))
				        {
				         	objHtmlData.performSaveChanges(refreshFields);
				         	if(objAjax.isProcessComplete())
						   	{
						       objHTMLData.resetChangeFields();
						   	}
	    				}
	    			}
				}	
	    	}
	    	else
    		{
	    		var htmlErrors = objAjax.error();
				htmlErrors.addError("warningInfo", szMsg_Select_Pom_codestoDelete, false);
				messagingDiv(htmlErrors);
    		}
		}
	}
}

/**
 *Tracker#:21632 FDD550-ADD COPY PASTE PROCESS ON POM WORKSHEET SCREEN
 *
 */
function _plmpom_copypomtocb()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	
	if(!isValidRecord(true))
	{
		return;
	}
	
	if(objHTMLData!=null && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
	{
		var htmlErrors = objAjax.error();
		htmlErrors.addError("confirmInfo", szMsg_Changes, false);
		messagingDiv(htmlErrors, "objHtmlData.performSaveChanges(refreshFields)", "_continue_plmpom_copypomtocb()");
		return;
	}
	else
	{
		_continue_plmpom_copypomtocb();
	}
}
/**
 *Tracker#:21632 FDD550-ADD COPY PASTE PROCESS ON POM WORKSHEET SCREEN
 *
 */
function _continue_plmpom_copypomtocb()
{
	closeMsgBox();
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	sectionName = objAjax.getDivSectionId();
	var url = "copy";
	
	if(objAjax && objHTMLData)
	{
		docview = objAjax.getDocViewId();
		
		if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
			{
				bShowMsg = true;
				objAjax.setActionURL("plmpomworksheet.do");
				objAjax.setActionMethod(url);
				objAjax.setProcessHandler(_showColorLibPage);
				objAjax.sendRequest();
			}
		if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==true)
			{
				var chgFlds = objHTMLData.getChangeFields();
				var isDtlChk = false;
				if(chgFlds && chgFlds.length>0)
					{
						for(num =0; num <chgFlds.length; num++)
							{
								var obj = chgFlds[num];
								if(obj!=null && obj.startsWith(_CHK_BOX_DEFAULT_ID))
									{
										isDtlChk =  true;
										break;
									}
							}
						if(isDtlChk)
							{
								bShowMsg = true;
								objAjax.setActionURL("plmpomworksheet.do");
								objAjax.setActionMethod(url);
								objAjax.setProcessHandler(_showColorLibPage);
								objHTMLData.performSaveChanges(_showColorLibPage, objAjax);
								if(objAjax.isProcessComplete())
							  	{
							      objHTMLData.resetChangeFields();
							  	} 
							}
						else
						{
							if(confirm(szMsg_Changes))
								{
									objHTMLData.performSaveChanges(refreshFields);
									if(objAjax.isProcessComplete())
										{
											objHTMLData.resetChangeFields();
										}
								}
						}
					}
			}
	}
}
/**
 * Tracker#:21632 FDD550-ADD COPY PASTE PROCESS ON POM WORKSHEET SCREEN
 */
function _plmpom_paste()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	
	if(!isValidRecord(true))
		{
			return;
		}

	if(objHTMLData!=null && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
		{
			var htmlErrors = objAjax.error();
			htmlErrors.addError("confirmInfo", szMsg_Changes, false);			
			messagingDiv(htmlErrors, "objHtmlData.performSaveChanges(refreshFields)", "_continue_plmpomPaste()");
			return;
		}
		else if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
		{
			_continue_plmpomPaste('sendRequest');
		}
	else
		{
			_continue_plmpomPaste();
		}
}
/**
 * Tracker#:21632 FDD550-ADD COPY PASTE PROCESS ON POM WORKSHEET SCREEN
 */
function _continue_plmpomPaste(sendRequest)
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	bShowMsg = true;
	var url = "paste";
	if(objAjax && objHTMLData)
		{
			objAjax.setActionURL("plmpomworksheet.do");
			objAjax.setActionMethod(url);
			
			objAjax.setProcessHandler(showPOM);
			if(sendRequest!=null)
				{
					objAjax.sendRequest();
				}
			else
				{
					objHTMLData.performSaveChanges(refreshFields, objAjax);
				}
			if(objAjax.isProcessComplete())
			{
				objHTMLData.resetChangeFields();
			}
		}
}

/**
 * Tracker#:21633 FDD550-ADD COPY PASTE PROCESS ON MULTIPOM WINDOW SCREEN
 */

function _multipom_copy()
{
	var htmlAreaObj = _getAreaObjByDocView('12702');
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	
	if(!isValidRecord(true))
	{
		return;
	}
	
	if(objHTMLData!=null && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
	{
		var htmlErrors = objAjax.error();
		htmlErrors.addError("confirmInfo", szMsg_Changes, false);
		messagingDiv(htmlErrors, "objHtmlData.performSaveChanges(_multipomRefreshFields)", "_continue_multipom_copy()");
		return;
	}
	else
	{
		_continue_multipom_copy();
	}
}

/**
 * Tracker#:21633 FDD550-ADD COPY PASTE PROCESS ON MULTIPOM WINDOW SCREEN
 */
function _continue_multipom_copy()
{
	closeMsgBox();
	var htmlAreaObj = _getAreaObjByDocView('12702');
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	sectionName = objAjax.getDivSectionId();
	var url = "copy";
	
	if(objAjax && objHTMLData)
	{
		docview = objAjax.getDocViewId();
		
		if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
			{
				bShowMsg = true;
				objAjax.setActionURL("multipom.do");
				objAjax.setActionMethod(url);
				objAjax.setProcessHandler(_showmultiPOMWorkArea);
				objAjax.sendRequest();
			}
			if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==true)
			{
				var chgFlds = objHTMLData.getChangeFields();
				var isDtlChk = false;
				if(chgFlds && chgFlds.length>0)
					{
						for(num =0; num <chgFlds.length; num++)
							{
								var obj = chgFlds[num];
								if(obj!=null && obj.startsWith(_CHK_BOX_DEFAULT_ID))
									{
										isDtlChk =  true;
										break;
									}
							}
						if(isDtlChk)
							{
								bShowMsg = true;
								objAjax.setActionURL("multipom.do");
								objAjax.setActionMethod(url);
								objAjax.setProcessHandler(_showmultiPOMWorkArea);
								objHTMLData.performSaveChanges(_multipomRefreshFields, objAjax);
								if(objAjax.isProcessComplete())
							  	{
							      objHTMLData.resetChangeFields();
							  	} 
							}
						else
						{
							if(confirm(szMsg_Changes))
								{
									objHTMLData.performSaveChanges(_multipomRefreshFields);
									if(objAjax.isProcessComplete())
										{
											objHTMLData.resetChangeFields();
										}
								}
						}
					}
			}
	}
}

/**
 *
 *Tracker#:21633 FDD550-ADD COPY PASTE PROCESS ON MULTIPOM WINDOW SCREEN
 * 
 */

function _multipom_paste()
{
	var htmlAreaObj = _getAreaObjByDocView('12702');
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	
	if(!isValidRecord(true))
		{
			return;
		}

	if(objHTMLData!=null && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
		{
			var htmlErrors = objAjax.error();
			htmlErrors.addError("confirmInfo", szMsg_Changes, false);			
			messagingDiv(htmlErrors, "objHtmlData.performSaveChanges(_multipomRefreshFields)", "_continue_multipomPaste()");
			return;
		}
	else if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
		{	
			_continue_multipomPaste('sendRequest');
		}
	else
		{
			_continue_multipomPaste();
		}
}

/**
 * Tracker#:21634 FDD550-ADD SMART COPY PROCESS ON MULTI WINDOW SCREEN
 */
function _multipom_smartcopy()
{
	var htmlAreaObj = _getAreaObjByDocView('12702');
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	
	if(!isValidRecord(true))
	{
		return;
	}
	
	if(objHTMLData!=null && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
	{
		var htmlErrors = objAjax.error();
		htmlErrors.addError("confirmInfo", szMsg_Changes, false);
		messagingDiv(htmlErrors, "objHtmlData.performSaveChanges(_multipomRefreshFields)", "_continue_multipom_smartcopy()");
		return;
	}
	else
	{
		_continue_multipom_smartcopy();
	}
}
/**
 * Tracker#:21634 FDD550-ADD SMART COPY PROCESS ON MULTI WINDOW SCREEN
 */
function _continue_multipom_smartcopy()
{
	var htmlAreaObj = _getAreaObjByDocView('12702');
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	bShowMsg = true;
	var url = "smartcopy";
	if(objAjax && objHTMLData)
		{
			objAjax.setActionURL("multipom.do");
			objAjax.setActionMethod(url);
			objAjax.setProcessHandler(_showmultiPOMWorkArea);
			objHTMLData.performSaveChanges(_multipomRefreshFields, objAjax);
			objAjax.sendRequest();
			
			objAjax.setProcessHandler(showPOM);
			if(sendRequest!=null)
				{
					objAjax.sendRequest();
				}
			else
				{
					objHTMLData.performSaveChanges(refreshFields, objAjax);
				}
			
			if(objAjax.isProcessComplete())
			{
				objHTMLData.resetChangeFields();
			}
		}
}

/**
 * Tracker#:21633 FDD550-ADD COPY PASTE PROCESS ON MULTIPOM WINDOW SCREEN
 */

function _multipom_copy()
{
	var htmlAreaObj = _getAreaObjByDocView('12702');
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	
	if(!isValidRecord(true))
	{
		return;
	}
	
	if(objHTMLData!=null && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
	{
		var htmlErrors = objAjax.error();
		htmlErrors.addError("confirmInfo", szMsg_Changes, false);
		messagingDiv(htmlErrors, "objHtmlData.performSaveChanges(_multipomRefreshFields)", "_continue_multipom_copy()");
		return;
	}
	else
	{
		_continue_multipom_copy();
	}
}

/**
 * Tracker#:21633 FDD550-ADD COPY PASTE PROCESS ON MULTIPOM WINDOW SCREEN
 */
function _continue_multipom_copy()
{
	closeMsgBox();
	var htmlAreaObj = _getAreaObjByDocView('12702');
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	sectionName = objAjax.getDivSectionId();
	var url = "copy";
	
	if(objAjax && objHTMLData)
	{
		docview = objAjax.getDocViewId();
		
		if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
			{
				bShowMsg = true;
				objAjax.setActionURL("multipom.do");
				objAjax.setActionMethod(url);
				objAjax.setProcessHandler(_showmultiPOMWorkArea);
				objAjax.sendRequest();
			}
		else if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==true)
			{
				var chgFlds = objHTMLData.getChangeFields();
				var isDtlChk = false;
				if(chgFlds && chgFlds.length>0)
					{
						for(num =0; num <chgFlds.length; num++)
							{
								var obj = chgFlds[num];
								if(obj!=null && obj.startsWith(_CHK_BOX_DEFAULT_ID))
									{
										isDtlChk =  true;
										break;
									}
							}
						if(isDtlChk)
							{
								bShowMsg = true;
								objAjax.setActionURL("multipom.do");
								objAjax.setActionMethod(url);
								objAjax.setProcessHandler(_showmultiPOMWorkArea);
								objHTMLData.performSaveChanges(_multipomRefreshFields, objAjax);
								if(objAjax.isProcessComplete())
							  	{
							      objHTMLData.resetChangeFields();
							  	} 
							}
						else
						{
							if(confirm(szMsg_Changes))
								{
									objHTMLData.performSaveChanges(_multipomRefreshFields);
									if(objAjax.isProcessComplete())
										{
											objHTMLData.resetChangeFields();
										}
								}
						}
					}
			}
	}
}

/**
 *
 *Tracker#:21633 FDD550-ADD COPY PASTE PROCESS ON MULTIPOM WINDOW SCREEN
 * 
 */

function _multipom_paste()
{
	var htmlAreaObj = _getAreaObjByDocView('12702');
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	
	if(!isValidRecord(true))
		{
			return;
		}

	if(objHTMLData!=null && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
		{
			var htmlErrors = objAjax.error();
			htmlErrors.addError("confirmInfo", szMsg_Changes, false);			
			messagingDiv(htmlErrors, "objHtmlData.performSaveChanges(_multipomRefreshFields)", "_continue_multipomPaste()");
			return;
		}
	else if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
		{
			_continue_multipomPaste('sendRequest');
		}
	else
		{
			_continue_multipomPaste();
		}
}
/**
 * Tracker#:21633 FDD550-ADD COPY PASTE PROCESS ON MULTIPOM WINDOW SCREEN 
 * 
 */
function _continue_multipomPaste(sendRequest)
{
	var htmlAreaObj = _getAreaObjByDocView('12702');
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	bShowMsg = true;
	var url = "paste";
	if(objAjax && objHTMLData)
		{
			objAjax.setActionURL("multipom.do");
			objAjax.setActionMethod(url);
			objAjax.setProcessHandler(_showmultiPOMWorkArea);
			if(sendRequest!=null)
				{
					objAjax.sendRequest();
				}
			else
				{
					objHTMLData.performSaveChanges(_multipomRefreshFields, objAjax);
				}
			if(objAjax.isProcessComplete())
			{
				objHTMLData.resetChangeFields();
			}
		}
}
/**
 * Tracker#:21634 FDD550-ADD SMART COPY PROCESS ON MULTI WINDOW SCREEN
 */
function _multipom_smartcopy()
{
	var htmlAreaObj = _getAreaObjByDocView('12702');
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	
	if(!isValidRecord(true))
	{
		return;
	}
	
	if(objHTMLData!=null && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
	{
		var htmlErrors = objAjax.error();
		htmlErrors.addError("confirmInfo", szMsg_Changes, false);
		messagingDiv(htmlErrors, "objHtmlData.performSaveChanges(_multipomRefreshFields)", "_continue_multipom_smartcopy()");
		return;
	}
	else
	{
		_continue_multipom_smartcopy();
	}
}
/**
 * Tracker#:21634 FDD550-ADD SMART COPY PROCESS ON MULTI WINDOW SCREEN
 */
function _continue_multipom_smartcopy()
{
	var htmlAreaObj = _getAreaObjByDocView('12702');
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	bShowMsg = true;
	var url = "smartcopy";
	if(objAjax && objHTMLData)
		{
			objAjax.setActionURL("multipom.do");
			objAjax.setActionMethod(url);
			objAjax.setProcessHandler(_showmultiPOMWorkArea);
			objAjax.sendRequest();			
			if(objAjax.isProcessComplete())
			{
				objHTMLData.resetChangeFields();
			}
		}
}
