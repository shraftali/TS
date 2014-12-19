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

function saveSample()
{
	//Tracker#: 15683 IE6 SAMPLE TRACKING - BLEEDING THRU ISSUE WITH THE DROP DOWN BOXES
    //Now setting to close the notes when the user clicks on the 
   	closeNotes();
    saveWorkArea();
}

//Tracker#:20812 Modified the function add the save confirm message
function deleteSampleWorkArea()
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();

   	if(objAjax)
   	{
   		if(objHTMLData!=null && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
        {
        	var htmlErrors = objAjax.error();
            htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
            messagingDiv(htmlErrors, "saveWorkArea()", "continueDeleteSample()");
        }
        else
        {
            continueDeleteSample();
        }
	}
}

//Tracker#:20812 method to continue to the delete process after save confirm message
function continueDeleteSample()
{	
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
   	var docview = objAjax.getDocViewId();
	//alert("docview"+docview);
	    
    if(docview==4005)
	{
		var htmlErrors = objAjax.error();
        if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
        {            
            objAjax.error().addError("warningInfo", szMsg_Sel_M_Row, false);
            messagingDiv(htmlErrors);
            return;
        }

	    htmlErrors.addError("confirmInfo","Do you want to delete Sample(s)?",  false);
	    messagingDiv(htmlErrors,"continueSampleProcess(\'delete\')", 'cancelProcess()');
	}
}

function _showSampleTabView(viewName, secId, reqVwName)
{
    var url = "showtabview&"+reqVwName+"="+viewName;
 	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	sectionName = objAjax.getDivSectionId();
	//alert("_showSampleTabView \n sectionName  " + sectionName);
    if(objAjax && objHTMLData)
    {
    	//alert("inside calling");
    	bShowMsg = true;
    	//alert("before load workarea");
       	loadWorkArea("sample.do", url);
        objAjax.setActionMethod(url);
        objAjax.setProcessHandler(_showSamplePage);
        //objHTMLData.performSaveChanges(_showSamplePage, objAjax);
        if(objAjax.isProcessComplete())
        {
            objHTMLData.resetChangeFields();
        }
    }
}

function _showSamplePage(objAjax)
{
    _closeSmartTag();
    //alert(" _showSamplePage: \n sectionName "+sectionName);
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
    	//alert("reload");
        _reloadArea(objAjax, sectionName);
        bShowMsg= false;
    }
}

function _showsamplecolsz(obj)
{
    //alert("Show popup"+obj);
    if(obj)
    {
        var objId = obj.getAttribute("id")
        var htmlAreaObj = _getWorkAreaDefaultObj();
        var objAjax = htmlAreaObj.getHTMLAjax();
        var objHTMLData = htmlAreaObj.getHTMLDataObj();

        //Tracker#:20561 - S-UNWANTED WARNING MESSAGE FOR SELECTING A SAMPLE LINE ITEM AND CLICK ON COLOR, SIZE, QTY ICON
        //Added the additional condition to ignore the change fields if checkbox is clicked
        if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==true && objHTMLData.isDataModified()==true)
        {
            var htmlErrors = objAjax.error();
            htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
	   		messagingDiv(htmlErrors, "saveSampleEval()", "_dispsamplecolsz('"+objId+"')");
	   		return;
        }
        else
        {
            _dispsamplecolsz(objId);
        }
    }
}

function _dispsamplecolsz(objId)
{
   closeMsgBox();
   var htmlAreaObj = _getWorkAreaDefaultObj();      
   var objAjax = htmlAreaObj.getHTMLAjax();
   var obj = getElemnt(objId);
   if(obj && objAjax)
   {
        var keyInfo = getKeyInfo(obj);
        if(keyInfo==null)keyInfo = "";
        //alert("_dispsamplecolsz :  keyInfo = "+ keyInfo);
        if(keyInfo==null)keyInfo = "";
        var actMethod = "showSampleQty&keyinfo="+ keyInfo;

        var htmlfldName = objId;
        //Tracker#:12867 - OUTSTANDING TECH SPEC>MASS REPLACE ISSUES
        //set the popup as editable
        _startSmartTagPopup(htmlfldName, true, null, true);
        bShowMsg = true;
        //alert("before load workarea");
        //loadWorkArea("sample.do", url);
        objAjax.setActionURL("sample.do");
        objAjax.setActionMethod(actMethod);
        objAjax.attribute().setAttribute("htmlfldName", htmlfldName);
        objAjax.setProcessHandler(showSampleSizePopup);
        objAjax.sendRequest();
   }
}

//Tracker#: 21439 PRIORITY 22: SAMPLE REQUEST POP-UP SHOWING UP FOR INVALID RECORD
function showSampleSizePopup(objAjax)
{
	//alert("process incomplete");
	var htmlAreaObj = _getWorkAreaDefaultObj();        
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
	   
    if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==true && objHTMLData.isDataModified()==true)
    {
	   objHTMLData.resetForm();
	   objHTMLData.resetChangeFields();
    }	   
    
	//alert("showSampleSizePopup");
	if(!objAjax.isProcessComplete())
	{
		_displayProcessMessage(objAjax);		 
	}	
	else
	{
		_showSmartTagPopup(objAjax);
	}	
	
	//Tracker :24136 - FR01: FLIP AXIS OF COLOR, SIZE & QTY POPUP ON SAMPLE REQUEST
	//setting the css style attributes to align the colorway label in IE,Safari and Chrome Browser
	//Tracker :24450 - IE9 ISSUE WITH ARTWORK COMBOS ON COLOR, SIZE & QTY POPUP ON SAMPLE REQUEST
	//set the width and padding depending on the browser type i.e,IE,Safari or Chrome Browser
	
	var wdth = "95px";
	var topPad = "1px";
	
	if(!$.browser.msie)
	{
		topPad = "7px";
	}
	
	var tdcol =$('td #tdClrWay'); 
	tdcol.css("padding-top", topPad);
	tdcol.css("width", wdth);
	
	tdcol =$('td #tdClrWay label');
	tdcol.css("width", wdth);
	
}


function _sampleApllyAllClick(qtyidall, tableId)
{
    var objQtyAll = getElemnt(qtyidall);

    if(objQtyAll)
    {
        //alert("here \n objQtyAll.value"+ objQtyAll.value +"\n isNaN(objQtyAll.value) "+ isNaN(objQtyAll.value));
        if(isNaN(objQtyAll.value))
        {
            //alert("returnf alse");
           return false;
        }
        var objTbl = getElemnt(tableId);
        //alert("hrer");
        if(objTbl)
        {
            //alert("table");
            var qtyCol = objTbl.getElementsByTagName("INPUT");

            if(qtyCol && qtyCol.length>0)
            {
                var cnt = qtyCol.length;
                for(var i=0; i<cnt; i++)
                {
                    var objQty = qtyCol[i];
                    if(objQty && objQty.type.toUpperCase()=="TEXT" && objQty.style.visibility!="hidden")
                    {
                         objQty.value = objQtyAll.value;
                         if(objQty.onchange)
                         {
                            objQty.onchange();
                         }
                    }
                }
            }
        }
    }
}

function _sampleQtySave(divid)
{
    var url = "saveQty";
 	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	sectionName = objAjax.getDivSectionId();
	//alert("_showSampleTabView \n sectionName  " + sectionName);
    if(objAjax && objHTMLData)
    {
    	//alert("inside calling");
    	bShowMsg = true;
    	//alert("before load workarea");
       	//loadWorkArea("sample.do", url);
        objAjax.setActionMethod(url);
        objAjax.setActionURL("sample.do");
        objAjax.setProcessHandler(_showWorkArea);

        //Tracker#: 23892 REGRESSSION: ISSUE WITH SAVING VALUES ENTERED IN COLOR, SIZE, QTY POPUP IN SAMPLE REQUEST
        // When user enters Qty field and click on save button without tabbing out, last edited changes were not considered
        // since it was not notified as part of changed fields.
        if(srcElmnt && srcElmnt.onchange)
    	{        	
        	srcElmnt.onchange();    	
    	}
        //Tracker#:25105 - UPGRADE: SAMPLE REQUEST_SAMPLE CREATION_NOT SAVING
        if(_focusedObj && _focusedObj.onchange)
    	{
        	_focusedObj.onchange();
    	}
        //alert("objHTMLData.getChangeFields() "+ objHTMLData.getChangeFields());
        objHTMLData.appendAllCustomContainerDataToRequest(objAjax, divid);
        
        //alert("objHTMLData.getChangeFields() "+ objHTMLData.getChangeFields() + "\n view id->" + _getAreaHTMLDataObjByDocView(4005).getChangeFields());
        
        objHTMLData.performSaveChanges(_showWorkArea, objAjax);
        _closeSmartTag();
        if(objAjax.isProcessComplete())
        {
            objHTMLData.resetChangeFields();
        }
    }
}

// Onlick of the left side navigation bar from design center, sample tracking screen process functions

// function Sort sample tracking list
function sortSampleTrackingColumn(fieldName,sec,type, pageNo)
{
    //alert("sortTechSpecColumn called");
    var htmlAreaObj = _getWorkAreaDefaultObj();
	sectionName = sec;
    var objAjax = htmlAreaObj.getHTMLAjax();
	//Tracker#: 16691 MATERIAL PROJECTIONS - ENTER DATA, CLICK SORT, ROWS SORTED DATA IS LOST
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    if(objAjax)
    {
		//Tracker#: 16691 MATERIAL PROJECTIONS - ENTER DATA, CLICK SORT, ROWS SORTED DATA IS LOST
    	// Changes have been done, prompt the User
		// to decide whether the User will Save or
		// continue with the sorting.
		var url = "SORT&sortColumn="+fieldName+"&sort="+type+"&pageNum="+pageNo;
		if(objHTMLData!=null && objHTMLData.isDataModified())
        {
            var htmlErrors = objAjax.error();
            htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
	   		messagingDiv(htmlErrors, "saveSample()", "laodPLMSortColumn('sampletracking.do','"+url+"',_showListPage);");
	   		return;
        }
		else
		{
			laodPLMSortColumn('sampletracking.do',url,_showListPage);
		}
    }
}

// function Cancel sample list
function cancelSampleList()
{
	//alert("here cancel sample list");
    var url = "cancelsample";
	var docview;

	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	sectionName = objAjax.getDivSectionId();
	   //alert("sectionName  " + sectionName);
    if(objAjax && objHTMLData)
    {
    	docview = objAjax.getDocViewId();
    	bShowMsg = true;

        if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
        {
            var htmlErrors = objAjax.error();
            objAjax.error().addError("warningInfo", szMsg_Sel_Sample_Row, false);
            messagingDiv(htmlErrors);
            return;
        }

        objAjax.setActionURL("sampletracking.do");
        objAjax.setActionMethod(url);
        objAjax.setProcessHandler(_showListPage);
        objHTMLData.performSaveChanges(_showListPage, objAjax);
	    objHTMLData.resetChangeFields();
    }
}

//function sendsample list
function sendSampleList()
{
    var url = "sentsample";
 	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	sectionName = objAjax.getDivSectionId();
	//alert("sectionName  " + sectionName);
    if(objAjax && objHTMLData)
    {
    	docview = objAjax.getDocViewId();
    	//alert("inside calling");
    	bShowMsg = true;

        if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
        {
            var htmlErrors = objAjax.error();
            objAjax.error().addError("warningInfo", szMsg_Sel_Sample_Row , false);
            messagingDiv(htmlErrors);
            return;
        }

        objAjax.setActionURL("sampletracking.do");
        objAjax.setActionMethod(url);
        objAjax.setProcessHandler(_showListPage);
        objHTMLData.performSaveChanges(_showListPage, objAjax);
        objHTMLData.resetChangeFields();
    }
}

function receiveSampleList()
{
    var url = "receivesample";
 	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	sectionName = objAjax.getDivSectionId();
	//alert("sectionName  " + sectionName);
    if(objAjax && objHTMLData)
    {
    	docview = objAjax.getDocViewId();
    	//alert("inside calling");
    	bShowMsg = true;

        if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
        {
            var htmlErrors = objAjax.error();
            objAjax.error().addError("warningInfo", szMsg_Sel_Sample_Row , false);
            messagingDiv(htmlErrors);
            return;
        }

        objAjax.setActionURL("sampletracking.do");
        objAjax.setActionMethod(url);
        objAjax.setProcessHandler(_showListPage);
        objHTMLData.performSaveChanges(_showListPage, objAjax);
        objHTMLData.resetChangeFields();
    }
}


//requestSample
function requestSampleList()
{
	var url = "requestsample";
	var docview;

	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	sectionName = objAjax.getDivSectionId();
	   //alert("sectionName  " + sectionName);
    if(objAjax && objHTMLData)
    {
    	docview = objAjax.getDocViewId();
    	bShowMsg = true;
    	if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
	   	{
	   		var htmlErrors = objAjax.error();
	   		objAjax.error().addError("warningInfo", szMsg_Sel_Sample_Row, false);
	   		messagingDiv(htmlErrors);
	   		return;
	   	}
		if(docview==4003)
		{
			objAjax.setActionURL("sampletracking.do");
			objAjax.setActionMethod(url);
	        objAjax.setProcessHandler(_showListPage);
	        objHTMLData.performSaveChanges(_showListPage, objAjax);
		}
		else
		{
			objAjax.setActionURL("sample.do");
			objAjax.setActionMethod(url);
	        objAjax.setProcessHandler(_showSubmitWorkArea);
	        objHTMLData.performSaveChanges(_showSubmitWorkArea, objAjax);
	        objHTMLData.resetChangeFields();
        }
    }
}

function domOfficeReceiptList()
{
    var url = "domofficereceipt";
 	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	sectionName = objAjax.getDivSectionId();
	//alert("sectionName  " + sectionName);
    if(objAjax && objHTMLData)
    {
    	docview = objAjax.getDocViewId();
    	//alert("inside calling");
    	bShowMsg = true;

        if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
        {
            var htmlErrors = objAjax.error();
            objAjax.error().addError("warningInfo", szMsg_Sel_Sample_Row , false);
            messagingDiv(htmlErrors);
            return;
        }

        objAjax.setActionURL("sampletracking.do");
        objAjax.setActionMethod(url);
        objAjax.setProcessHandler(_showListPage);
        objHTMLData.performSaveChanges(_showListPage, objAjax);
        objHTMLData.resetChangeFields();
    }
}

function showWeb(obj)
{
    var pObj = null;
    if(srcElmnt && srcElmnt.name)
    {
        pObj = getElemnt(srcElmnt.name);
    }

    if(pObj)
    {
        var keyInfo = "&keyinfo="+getKeyInfo(pObj);
        var url = "getweburl"+keyInfo;
        var htmlAreaObj = _getWorkAreaDefaultObj();
        var objAjax = htmlAreaObj.getHTMLAjax();
        sectionName = objAjax.getDivSectionId();
        //alert("sectionName  " + sectionName);
        if(objAjax)
        {
            docview = objAjax.getDocViewId();
            //alert("inside calling");
            bShowMsg = true;

            objAjax.setActionURL("sampletracking.do");
            objAjax.setActionMethod(url);
            objAjax.setProcessHandler(_openSupplierWebPage);
            objAjax.sendRequest();
        }
    }
}

function _openSupplierWebPage(objAjax)
{
   if(objAjax)
   {
        var wsurl = objAjax.getResponseHeader("websiteurl");

        //alert("wsurl "+ wsurl);

        if(wsurl && wsurl.toString().length>0)
        {
            window.open(wsurl);
        }
   }
}

// This function forwards the user to ColorOverview Screen.
function showSampleEvalList()
{
    //alert("_AttributekeyInfo " + getComponentKeyInfo() + "\n _nColLibRow " +_nColLibRow);
    var url ="showsampleeval&_nColLibRow=" + _nColLibRow ;
    url += "&keyinfo= " +getComponentKeyInfo();
    //alert("url " + url);
    loadWorkArea("sampleeval.do", url);
}

function showTechSpec(obj)
{
    //alert("showProductOverview called");
    //alert("_AttributekeyInfo " + getComponentKeyInfo() + "\n _nColLibRow " +_nColLibRow);
    var url ="TOTECHSPEC&_nColLibRow=" + _nColLibRow ;
    url += "&keyinfo= " + getComponentKeyInfo();
    //alert("url " + url);
    loadWorkArea("sampletracking.do", url);
}


// Onlick of the Sample tab on the Product Overview Screen, sample tracking/Sample request screen process functions
//Tracker#:20812 Modified the function add the save confirm message
function receiveSample()
{
    var url = "receivesample";
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

//Tracker#:20812 Modified the function add the save confirm message
function cancelSample()
{
    var url = "cancelsample";
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

//function sentsample
//Tracker#:20812 Modified the function add the save confirm message
function sendSample()
{
    var url = "sentsample";
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

//Tracker#:20812 Modified the function add the save confirm message
function domOfficeReceipt()
{
    var url = "domofficereceipt";
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

//Tracker#:20812 Modified the function add the save confirm message
function _samplereqFC()
{
    var url = "samplerequestfc";
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

//Tracker#:20812 Modified the function add the save confirm message
function _samplereqBOM()
{
    var url = "samplerequestbom";
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
    
//Tracker#:20812 Function completes the sample processes for the actionmethod sent.
function continueSampleProcess(actionMethod)
{
	closeMsgBox();
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	
	if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
    {
        var htmlErrors = objAjax.error();
        objAjax.error().addError("warningInfo", szMsg_Sel_Sample_Row , false);
        messagingDiv(htmlErrors);
        return;
    }

    if(objAjax && objHTMLData)
    {
    	objAjax.setActionURL("sample.do");
	    objAjax.setActionMethod(actionMethod);
	    objAjax.setProcessHandler(_showSubmitWorkArea);
	    objHTMLData.performSaveChanges(_showSubmitWorkArea, objAjax);
	    objHTMLData.resetChangeFields();
	}    
}

/////////////// sample evaluation screen function

/////Tracking#: 15106  - CANNOT OPEN ANY ROUNDS HIGHER THAN 1 ON SAMPLE EVALUATION
/// added the new js function to improve the sample eval screen performance
// by making the each sample section independ loading basically lazy loading
// on click on the header section bar or on rounds pagination
//function to load the sample section dynamically
function _displaySampleSection(secId, bdyIndx, parentDivid, urlAppend)
{
    //alert("_displaySampleSection  \n secId =" + secId);
	var url = "displaysamplesection&bdyIndx="+bdyIndx+"&parentDivid="+parentDivid;
    var chkfrDataMod = false;
	if(urlAppend)
	{
	    url = url + "&" + urlAppend;
	    chkfrDataMod = true;
	}

   	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objHTMLData = htmlAreaObj.getHTMLDataObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();

   	//alert("data modified = " +objHtmlData.isDataModified());

   	if(chkfrDataMod && objHTMLData!=null && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
    {
        //alert("modified data");
        //alert(" objHtmlData.hasUserModifiedData() " + objHtmlData.isDataModified());
        var htmlErrors = objAjax.error();
        htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
        messagingDiv(htmlErrors, "saveSampleEval('1')", "_displaySampleEvalSec('" + secId + "','" +url+"','1')");
    }
    else
    {
        //alert("user not modified data");
        _displaySampleEvalSec(secId, url);
    }
}

function _displaySampleEvalSec(secId, url, doReset)
{
    //alert("called _displaySampleEvalSec");
    closeMsgBox();

    var htmlAreaObj = _getWorkAreaDefaultObj();

    if(doReset=="1")
    {
        //alert("_resetSmplEval called");
        _resetSmplEval(false);
    }

    var objAjax = new htmlAjax();
    //alert("inside");
    docview = htmlAreaObj.getHTMLAjax().getDocViewId();
    objAjax.setDivSectionId(secId);
    bShowMsg = true;
    objAjax.setActionURL("sampleeval.do");
    objAjax.setActionMethod(url);
    objAjax.setProcessHandler(_showSampleSection);
    objAjax.sendRequest();
    return;
}

// function to load the html in the corresponding  sample section
function _showSampleSection(objAjax)
{
    try
    {
        //alert("_showSampleSection ");
        if(objAjax)
        {
            _displayProcessMessage(objAjax)
            //alert("_showSampleSection: \n _objAjax.getDivSectionId() " + objAjax.getDivSectionId());
            var div=getElemnt(objAjax.getDivSectionId());
            if(div)
            {
               registerHTML(div,objAjax);
            }

            //Calling this function for the attchment screen where the vertical scroll bar
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

function _resetSmplEval(isWrkAreaSaved)
{
    //alert("_resetSmplEval");

    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();

    if(objHTMLData)
    {
        if(!isWrkAreaSaved)
        {
            objHTMLData.resetForm();
        }
        objHTMLData.resetChangeFields();
    }
}

function saveSampleEval(resetchgflds)
{
    //alert("savesmpleval");
    if("1"==resetchgflds)
    {
        closeMsgBox();
    }

    saveWorkArea();

    if("1"==resetchgflds)
    {
        _resetSmplEval(true);
   	}
}

function _sampleEvalRoundsClick(secId, bdyIndx, parentDivid, smplno, rownum)
{
    //alert("_sampleEvalRoundsClick ");
    var urlAppend = "sample_no="+smplno+"&rownum="+rownum;
    _displaySampleSection(secId, bdyIndx, parentDivid, urlAppend);
}

function _showProductOverview(obj)
{
    var url ="TOTECHSPEC";
    loadWorkArea("sampleeval.do", url);
    return;
}

function approveSampleEval()
{
    var url = "approvesample";
	var docview;

	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	sectionName = objAjax.getDivSectionId();
	   //alert("sectionName  " + sectionName);
    if(objAjax && objHTMLData)
    {
        loadWorkArea("sampleeval.do", url);
	    return;
    }
}

//Tracker#:20812 Modified the function add the save confirm message
function createFitEvalFromSample()
{
	//alert("createFitEvalFromSample:");
    var url = "createfitevalfromsample";
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	
	if(objAjax && objHTMLData)
    {    	
    	if(objHTMLData!=null && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
        {
            var htmlErrors = objAjax.error();
            htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
            messagingDiv(htmlErrors, "saveWorkArea()", "continueCreateFitEval()");
        }
        else
        {
            continueCreateFitEval();
        }
    }	
}   

//Tracker#:20812 Added new method to contiue create fiteval after save confirm message
function continueCreateFitEval()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	var url = "createfitevalfromsample";
	
   	if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
	{
           var htmlErrors = objAjax.error();
           objAjax.error().addError("warningInfo", szMsg_Sel_Sample_A_Row, false);
           messagingDiv(htmlErrors);
           return;
   }
   else
   {
   	var chgFlds = objHTMLData.getChangeFields();

	if(chgFlds && chgFlds.length>0)
      {
      	  count = 0;
          for (num = 0; num < chgFlds.length; num++)
          {
             	var obj = chgFlds[num];
             	if(obj!=null && obj.startsWith(_CHK_BOX_DEFAULT_ID))
			    {
			     	count++;
			    }
          }

          if(count > 1)
          {
          	 var htmlErrors = objAjax.error();
           	 objAjax.error().addError("warningInfo", szMsg_Sel_Sample_A_Row, false);
          	 messagingDiv(htmlErrors);
          	 unCheck(objHTMLData);
          	 objHTMLData.resetChangeFields();
             return;
          }
   	  }
  	}

    if(objAjax && objHTMLData)
    {
    	docview = objAjax.getDocViewId();
    	bShowMsg = true;
    	keys = getComponentKeyInfo();

    	if(typeof(keys)=='undefined' || keys == null)
    	{
			var htmlErrors = objAjax.error();
			objAjax.error().addError("warningInfo", szMsg_Invalid_Rec, false);
			messagingDiv(htmlErrors);
			unCheck(objHTMLData);
			objHTMLData.resetChangeFields();
    		return;
    	}

    	url+= "&keyinfo= " +keys;
    	objAjax.setActionURL("sampletracking.do");
        objAjax.setActionMethod(url);
        objAjax.setProcessHandler(_createFitEvalPostProcess);
        objHTMLData.performSaveChanges(_createFitEvalPostProcess, objAjax);   
    }
}

function _createFitEvalPostProcess(objAjax)
{
	//alert("_createFitEvalPostProcess");

	// alert("_createFitEvalPostProcess: \n  objAjax.error().hasWarningOccured() " + objAjax.error().hasWarningOccured());
	var htmlAreaObj = _getWorkAreaDefaultObj();
  	var objHTMLData = htmlAreaObj.getHTMLDataObj();

	if(objAjax.error().hasErrorOccured() ||  objAjax.error().hasWarningOccured() )
    {

    	 _displayProcessMessage(objAjax);//alert("_createFitEvalPostProcess: before script part");
    	 // Uncheck the Check box If the process fails with some Error/Warning messages.
    	 // Call the resetChangeFields after unchecking the check box.    	
    	 Main.resetDefaultArea();
    }
    else
    {
       objHTMLData.resetChangeFields();
       _execAjaxScript(objAjax);
    }
}

//Tracker#:20812 Modified the function add the save confirm message
function createFitEvalOfTPSample()
{
	//alert("createFitEvalOfTPSample:");
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();

	if(objAjax && objHTMLData)
    {    	
    	if(objHTMLData!=null && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
        {
            var htmlErrors = objAjax.error();
            htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
            messagingDiv(htmlErrors, "saveWorkArea()", "continueFitEvalOfTPSample()");
        }
        else
        {
            continueFitEvalOfTPSample();
        }
    }	
}

//Tracker#:20812 Added new method to contiue create fiteval after save confirm message
function continueFitEvalOfTPSample()
{
	var url = "createfitevalfromsample";
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	
	if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
	{
           var htmlErrors = objAjax.error();
           objAjax.error().addError("warningInfo", szMsg_Sel_Sample_A_Row, false);
           messagingDiv(htmlErrors);
           return;
   	}
   	else
   	{
   		var chgFlds = objHTMLData.getChangeFields();

		if(chgFlds && chgFlds.length>0)
      	{
      	  count = 0;
          for (num = 0; num < chgFlds.length; num++)
          {
             	var obj = chgFlds[num];
             	if(obj!=null && obj.startsWith(_CHK_BOX_DEFAULT_ID))
			    {
			     	count++;
			    }
          }

          if(count > 1)
          {
          	 var htmlErrors = objAjax.error();
           	 objAjax.error().addError("warningInfo", szMsg_Sel_Sample_A_Row, false);
          	 messagingDiv(htmlErrors);
          	 //unCheck(objHTMLData);
          	 //objHTMLData.resetChangeFields();
          	 Main.resetDefaultArea();
             return;
          }
   	  }
  	}

    if(objAjax && objHTMLData)
    {
    	docview = objAjax.getDocViewId();
    	bShowMsg = true;

    	keys = getComponentKeyInfo();

    	if(typeof(keys)=='undefined' || keys == null)
    	{
			var htmlErrors = objAjax.error();
			objAjax.error().addError("warningInfo", szMsg_Invalid_Rec, false);
			messagingDiv(htmlErrors);
			//unCheck(objHTMLData);
			//objHTMLData.resetChangeFields();
			Main.resetDefaultArea();
    		return;
    	}

    	url+= "&keyinfo= " +keys;
        objAjax.setActionURL("sample.do");
        objAjax.setActionMethod(url);
        objAjax.setProcessHandler(_createFitEvalPostProcess);
        objHTMLData.performSaveChanges(_createFitEvalPostProcess, objAjax);
        //objHTMLData.resetChangeFields();
    }
}

// Tracker#:14435 ISSUE WITH SAVE PROMPT,SYSTEM DISPLAYS'PREVIOUS ACTION ENCOUNTERED ERROR'
// moved these function from colorlib.js
//Sample sort
function sortSampleColumn(fieldName,sec,type, pageNo)
{
    //alert("sortPaletteColumn called");
    sectionName = sec;
    var objAjax = getMaterialLibHTMLAjax();
    if(objAjax)
    {
        objAjax.setActionURL("sample.do");
        objAjax.setActionMethod("SORT&sortColumn="+fieldName+"&sort="+type+"&pageNum="+pageNo);
        objAjax.setProcessHandler(_showLabDipPage);
        objAjax.sendRequest();
    }
}

function showSampleProductOverview(obj)
{
	Process.showOverview(obj, "sampletracking.do", "TOOVERVIEW");
}
// Tracker#:14435 changes closed here

//Tracker#16118 TSR 516 F2 PROVIDE FIT EVAL INDICATOR LINK TO NAVIGATE TO FIT EVAL FROM SAMPLE & TSR 517 F4
function _showSampleFitEval()
{
    //alert("showProductOverview called");
    //alert("_AttributekeyInfo " + getComponentKeyInfo() + "\n _nColLibRow " +_nColLibRow);
    var url ="showsamplefiteval&_nColLibRow=" + _nColLibRow ;
    url += "&keyinfo= " + getComponentKeyInfo();
    //alert("url " + url);
    loadWorkArea("fitevaloverview.do", url);
}

//Tracker#:24092 FDD572 - FR01 ADD A LINK TO THE SAMPLE EVALUATION DOCUMENT THAT WILL TAKE THE USER DIRECTLY TO THE SAMPLE TAB
//added this function _goToSample() to enable the user to navigate from Sample Evaluation screen to Samples Tab
//when the user clicks on View Sample Tracking link
function _goToSample()
{
	  TechSpec.show("gotosample","sample.do"); 
}


var samplejs = {
		
		_showPOMLists: function ()
		{
			var actMethod = "showpomslistpopup";
			if(!isValidRecord(true))
			{
				return;
			}
		    var docview;
		    var htmlAreaObj = _getWorkAreaDefaultObj();
		    var objAjax = htmlAreaObj.getHTMLAjax();
		    var objHTMLData = htmlAreaObj.getHTMLDataObj();
		    sectionName = objAjax.getDivSectionId();    
		    if(objAjax && objHTMLData)
		    {
		    	var htmlfldName = htmlAreaObj.getDivSectionId();
		    	_startSmartTagPopup(htmlfldName, false, null, true);
		        //alert("inside calling");
		        bShowMsg = true;
		        objAjax.setActionURL("sampletracking.do");
		        objAjax.setActionMethod(actMethod);
		        objAjax.attribute().setAttribute("htmlfldName", htmlfldName);
		        objAjax.setProcessHandler(_showSmartTagInteractivePopup);
		        objAjax.sendRequest();
		    }
		},

		_showPOMListsOnSampleTab: function ()
		{
			var actMethod = "showpomslistpopup";
			if(!isValidRecord(true))
			{
				return;
			}
		    var docview;
		    var htmlAreaObj = _getWorkAreaDefaultObj();
		    var objAjax = htmlAreaObj.getHTMLAjax();
		    var objHTMLData = htmlAreaObj.getHTMLDataObj();
		    sectionName = objAjax.getDivSectionId();    
		    if(objAjax && objHTMLData)
		    {
		    	var htmlfldName = htmlAreaObj.getDivSectionId();
		    	_startSmartTagPopup(htmlfldName, false, null, true);
		        //alert("inside calling");
		        bShowMsg = true;
		        objAjax.setActionURL("sample.do");
		        objAjax.setActionMethod(actMethod);
		        objAjax.attribute().setAttribute("htmlfldName", htmlfldName);
		        objAjax.setProcessHandler(_showSmartTagInteractivePopup);
		        objAjax.sendRequest();
		    }
		},

		
		_selectPOMWorksheet: function ()
		{
			var actMethod = "selectpomworksheet";
			var htmlAreaObj = _getAreaObjByDocView('12703');
			var objAjax = htmlAreaObj.getHTMLAjax();
			var objHTMLData = htmlAreaObj.getHTMLDataObj();
			
			
			if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
				{
					   var msgFld = getElemnt("_pompopup_msgFld");
					   var sltMsg = "";
					   if(msgFld)
						   {
						   		sltMsg = msgFld.value;
						   }
			           var htmlErrors = objAjax.error();
			           objAjax.error().addError("warningInfo", sltMsg, false);
			           messagingDiv(htmlErrors);
			           return;
			   	}
			
			if(objAjax && objHTMLData)
				{
					bShowMsg = true;
					var radiofld = objHTMLData.getSaveChangeFields();
					radiofld = radiofld.split("@,");
					radiofld = radiofld[0];
					var lytFld = getElemntByName(radiofld);
					var sltIndex = ($(lytFld).index($(lytFld).filter(':checked')));
					var sltFld = lytFld[sltIndex];
					var keyInfo = getKeyInfo(sltFld);
					objAjax._parametersHandler.add("keyinfo", keyInfo);
					objAjax.setActionURL("sampletracking.do");
					objAjax.setActionMethod(actMethod);
					objAjax.setProcessHandler(samplejs._selectcreateFitEvalPostProcess);
				    objHTMLData.performSaveChanges(samplejs._selectcreateFitEvalPostProcess, objAjax);
				}
		},

		_selectPOMWorksheetOnSampleTab: function ()
		{
			var actMethod = "selectpomworksheet";
			var htmlAreaObj = _getAreaObjByDocView('12703');
			var objAjax = htmlAreaObj.getHTMLAjax();
			var objHTMLData = htmlAreaObj.getHTMLDataObj();
			
			
			if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
				{
					  var msgFld = getElemnt("_pompopup_msgFld");
					  var sltMsg = "";
					  if(msgFld)
					   {
					   		sltMsg = msgFld.value;
					   }	
			           var htmlErrors = objAjax.error();
			           objAjax.error().addError("warningInfo", sltMsg, false);
			           messagingDiv(htmlErrors);
			           return;
			   	}
			
			if(objAjax && objHTMLData)
				{
					bShowMsg = true;
					var radiofld = objHTMLData.getSaveChangeFields();
					radiofld = radiofld.split("@,");
					radiofld = radiofld[0];
					var lytFld = getElemntByName(radiofld);
					var sltIndex = ($(lytFld).index($(lytFld).filter(':checked')));
					var sltFld = lytFld[sltIndex];
					var keyInfo = getKeyInfo(sltFld);
					objAjax._parametersHandler.add("keyinfo", keyInfo);
					objAjax.setActionURL("sample.do");
					objAjax.setActionMethod(actMethod);
					objAjax.setProcessHandler(samplejs._selectcreateFitEvalPostProcess);
				    objHTMLData.performSaveChanges(samplejs._selectcreateFitEvalPostProcess, objAjax);
				}
		},

		_selectcreateFitEvalPostProcess: function (objAjax)
		{
			//alert("_createFitEvalPostProcess");

			// alert("_createFitEvalPostProcess: \n  objAjax.error().hasWarningOccured() " + objAjax.error().hasWarningOccured());
			var htmlAreaObj = _getWorkAreaDefaultObj();
		  	var objHTMLData = htmlAreaObj.getHTMLDataObj();

		  	var chkboxes = $(document).find("input:checkbox");
		  	if(chkboxes)
		  		{
			  		for(i=0; i<chkboxes.length; i++)
			  		{
			  			var chk = chkboxes[i];
			  			
			  			if(chk && chk.checked)
			  				{
			  					chk.checked = false;
			  					_notifyCheckBoxChangeFields(chk, false);
			  				}
			  		}
		  		}
		  	
		  	if(objAjax.error().hasErrorOccured() ||  objAjax.error().hasWarningOccured() )
		    {

		    	 _displayProcessMessage(objAjax);//alert("_createFitEvalPostProcess: before script part");
		    	 // Uncheck the Check box If the process fails with some Error/Warning messages.
		    	 // Call the resetChangeFields after unchecking the check box.    	
		    	 Main.resetDefaultArea();
		    }
		    else
		    {
		       objHTMLData.resetChangeFields();
		       _execAjaxScript(objAjax);
		    }
		},
		
		_pomSelect_closeSmartTag: function ()
		{
			var htmlAreaObj = _getAreaObjByDocView('12703');
			var objAjax = htmlAreaObj.getHTMLAjax();
			_closeSmartTag();
			
			if(objAjax)
			{
				samplejs._selectcreateFitEvalPostProcess(objAjax);
			}
		}

}

