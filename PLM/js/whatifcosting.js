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
/**
 * The search function for whatIf costing screen
 */

var whatIfCosting = {};

whatIfCosting.sortwhatIfCostingColumn = function sortwhatIfCostingColumn(fieldName, sec, type, pageNo)
{
	whatIfCosting.sortColumnForSection(fieldName, sec, type, pageNo, "whatifcosting.do")
}

whatIfCosting.sortColumnForSection = function sortColumnForSection(fieldName, sec, type, pageNo, url)
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    sectionName = sec;
    if(objAjax)
    {
        objAjax.setActionURL(url);
        objAjax.setActionMethod("SORT&sortColumn="+fieldName+"&sort="+type+"&pageNum="+pageNo);
        objAjax.setProcessHandler(whatIfCosting.refreshPageAfterSort);
        objAjax.sendRequest();
    }
}

whatIfCosting.refreshPageAfterSort = function refreshPageAfterSort(objAjax)
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
        // Refresh only the div identified by the sectionName
        // This needs to be set by the caller.
        _reloadArea(objAjax, sectionName);
        bShowMsg= false;
    }
}

whatIfCosting.goToPage = function goToPage()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	
	var pageNo = parseInt($("#pageno").val());
	var msg = "Page No " + pageNo + " does not exist.";
	var noOfPage = parseInt($("#wc_total_pages").val());
	if(pageNo <= 0 || pageNo > noOfPage) {
    	objAjax.error().addError("warningInfo", msg, false);
    	_displayProcessMessage(objAjax);
    	return;
	}
	showNextPage(pageNo,'MainSection','whatifcosting.do');
}

whatIfCosting.save = function save() {
	saveWorkArea();
}

whatIfCosting.calculate = function calculate(actionMethod)
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
  
    
    if(objAjax)
    {
        if(objHTMLData != null && objHTMLData.isDataModified())
        {
            var url = "whatifcosting.do";
            objAjax.parameter().add("chgflds", objHTMLData.getSaveChangeFields());
            objAjax.setActionURL(url);
            objAjax.setActionMethod(actionMethod);
            objAjax.setProcessHandler(_showWorkArea);
            // Add only those fields to the request which have been modified and identified by chgflds.
            objHTMLData.appendChangeFieldsCtrlInfoToRequest(objAjax);
            objAjax.sendRequest();
        }
        else
        {
            var objAjax = new htmlAjax();
    	    objAjax.error().addError("warningInfo", szMsg_No_change, false);
    	    _displayProcessMessage(objAjax);
        }

    }
}

whatIfCosting.calcEstResellPrc = function calcEstResellPrc()
{
    whatIfCosting.calculate("calcEstResellPrc");
}

whatIfCosting.calcEstMarginPct = function calcEstMarginPct()
{
    whatIfCosting.calculate("calcEstMarginPct");
}

whatIfCosting.calcEstOfferPrc = function calcEstOfferPrc()
{
    whatIfCosting.calculate("calcEstOfferPrc");
}

whatIfCosting.viewTechSpecScreen = function viewTechSpecScreen() {

	var method = "fromwhatifcosting&_nColLibRow=" + _nColLibRow;
	method += "&keyinfo= " + getComponentKeyInfo();
	Main.loadWorkArea("techspec.do", method, "", "");


}

whatIfCosting.viewRFQScreen = function viewRFQScreen(linkObj)
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    var keys = linkObj.getComponentKeyInfo();
    if(objHTMLData && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
    {
        var htmlErrors = objAjax.error();
        htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
        var saveFunc = "\"whatIfCosting.save()\"";
        var canceFunc = "\"whatIfCosting.showRFQ('" + keys + "')\"";
        messagingDiv(htmlErrors, saveFunc, canceFunc);
    }
    else
    {
    	whatIfCosting.showRFQ(keys);
   	}
}

whatIfCosting.showRFQ = function showRFQ(keys)
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();

	if(objAjax)
	{
	    objAjax.setActionURL("whatifcosting.do");
	    objAjax.parameter().add("keyinfo", keys);
        objAjax.setActionMethod("gotoRFQ");
        objAjax.setProcessHandler(whatIfCosting.displayRFQ);
        objAjax.sendRequest();
	}
}

whatIfCosting.displayRFQ = function displayRFQ(objAjax)
{
	//For displaying message on screen.
    if(bShowMsg==true)
   	{
   		msgInfo = objAjax.getAllProcessMessages();
		//alert(" msgInfo: \n "+msgInfo);
	    if(msgInfo!="")
	    {
	    
	        _displayProcessMessage(objAjax);
	        Main.resetDefaultArea();
	    }
   	}
    var keys = objAjax.parameter().getParameterByName("keyinfo");
    var keyMap = whatIfCosting.getKeyMap(keys);

   	waitWindow();
    var hrefVal = 'search.do?method=qsearch&doc_view_id=100&owner=' + keyMap['OWNER']
    				+ '&operator=9&fld_name=REQUEST_NO&qs_val=' + keyMap['REQUEST_NO'];
    window.location.href=hrefVal;
    waitWindow();
}


whatIfCosting.viewOfferResponseScreen = function viewOfferResponseScreen(linkObj) {

	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    var keys = linkObj.getComponentKeyInfo();
    if(objHTMLData && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
    {
        var htmlErrors = objAjax.error();
        htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
        var saveFunc = "\"whatIfCosting.save()\"";
        var canceFunc = "\"whatIfCosting.showOffer('" + keys + "')\"";
        messagingDiv(htmlErrors, saveFunc, canceFunc);
    }
    else
    {
    	
    	whatIfCosting.showOffer(keys);
   	}
}

whatIfCosting.showOffer = function showOffer(keys)
{

	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();

	if(objAjax)
	{
	    objAjax.setActionURL("whatifcosting.do");
	    objAjax.parameter().add("keyinfo", keys);
        objAjax.setActionMethod("gotoOFFER");
        objAjax.setProcessHandler(whatIfCosting.displayOFFER);
        objAjax.sendRequest();
       
	}
}

whatIfCosting.displayOFFER = function displayOFFER(objAjax)
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

    var keys = objAjax.parameter().getParameterByName("keyinfo");
    var keyMap = whatIfCosting.getKeyMap(keys);

    waitWindow();
    var hrefVal = "fwd2.do?method=whatifoffer&owner="
    					+ keyMap['OWNER'] + "&request_no=" + keyMap['REQUEST_NO']
    					+ "&offer_no=" + keyMap['OFFER_NO'];
   
    window.location.href=hrefVal;
	waitWindow();
}

whatIfCosting.getKeyMap  = function getKeyMap(keyArr)
{
	var keyMap = {};
	var arr = keyArr.split("~%40");
    for(var keys in arr)
    {
    	var key = arr[keys].split("%40%40");
    	var keyType = key[0];
    	if(keyType == "OWNER")
    	{
    		keyMap['OWNER'] = key[1];
    	}
    	else if(keyType == "REQUEST_NO")
    	{
    		keyMap['REQUEST_NO'] = key[1];
    	}
    	else if(keyType == "OFFER_NO")
    	{
    		keyMap['OFFER_NO'] = key[1];
    	}
    }
    return keyMap;
}

whatIfCosting.gotoWhatIfCostingFromTechSpec = function gotoWhatIfCostingFromTechSpec()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();

	if(objAjax)
	{
		var url = "gotoWhatIfCosting";
		Main.loadWorkArea("techspecoverview.do", url);
	}
}

whatIfCosting.copyOffer = function copyOffer(obj) {

	 var htmlAreaObj = _getWorkAreaDefaultObj();
     var objAjax = htmlAreaObj.getHTMLAjax();
     var objHTMLData = htmlAreaObj.getHTMLDataObj();
     var chkobj=objHTMLData.getSaveChangeFields();
    if(CheckOneSelection(chkobj))
    {
	    if(objAjax)
	     {
		
	       objAjax.setActionURL("whatifcosting.do");
	       objAjax.parameter().add("chgflds", objHTMLData.getSaveChangeFields());
	       objAjax.setActionMethod("copyOffer");
		   objAjax.setProcessHandler(_defaultWorkAreaSave_scroll);//whatIfCosting.setFwdCopyOFFER(objAjax, obj));
	       objAjax.sendRequest();
	    }
    }
    else
    {
          var objAjax = new htmlAjax();
          objAjax.error().addError("warningInfo", "Please select only one detail row.", false);
    	 _displayProcessMessage(objAjax);
    	
    }
   
    
}
function CheckOneSelection(chkobj){
	
	var arr = chkobj.split("chkRowKeys_@");
	if(arr.length == 2 ){
		return true;
	}
	else{
		return false;
	}
}
