/** ********************************** */
/* Copyright (C) 2002 - 2013 */
/* by */
/* TradeStone Software, Inc. */
/* Gloucester, MA. 01930 */
/* All Rights Reserved */
/* Printed in U.S.A. */
/* Confidential, Unpublished */
/* Property of */
/* TradeStone Software, Inc. */
/** ********************************** */

var SizeJsModule = {};

SizeJsModule.checkTotal = function (obj,pctScale)
{
	var objval = replaceval(obj, CommaDelimiter, Blank)
	var nTotal = 0;
	val = 0;
	var szStartWith = obj.name.substr(0, obj.name.indexOf('_') + 1);    // "CL0_"
	var $divWorkArea = $("#_divDataWorkArea");
	var elements = $divWorkArea.find('INPUT');

	for(i = 0 ; i < elements.length ; i++)
	{
		e=elements[i];
		val = e.value;
		if (e.name.indexOf(szStartWith) == 0 && val != '')  // start with same name
		{
			nTotal+=parseFloat(replacevalstr(val, CommaDelimiter, Blank));
		}
	}

	// need to do this else we get tons of decimals places even when we don't expect them - javascript issue
	nTotal = Math.round(nTotal*pctScale)/pctScale;
	if (nTotal > 100)
	{
		obj.value = objval - Math.round((nTotal - 100)*parseInt(pctScale))/parseInt(pctScale);
		var htmlAreaObj = _getWorkAreaDefaultObj();
		var objAjax = htmlAreaObj.getHTMLAjax();
		var htmlErrors = objAjax.error();
		htmlErrors.addError("warningInfo", "Sum of percent exceeded 100, resetting the current value to max percent allowed in the field.",  false);
		messagingDiv(htmlErrors);
	}

}

SizeJsModule.checkTotPct = function (o, pctScale)
{
	var sum = 0;
	var objval = replaceval(o, CommaDelimiter, Blank);
	var $divWorkArea = $("#_divDataWorkArea");
	var elements = $divWorkArea.find('INPUT');

	for(i=0 ; i< elements.length ; i++)
	{
		e=elements[i];
		val = e.value;
		if (e.name.indexOf("TP") == 0 && val != '' && !e.readOnly)
		{
			sum+=parseFloat(replacevalstr(val, CommaDelimiter, Blank));
		}
	}
	// need to do this else we get tons of decimals places even when we don't expect them - javascript issue
	nTotal = Math.round(sum*pctScale)/pctScale;
	if (sum > 100)
	{
		o.value = objval - Math.round((sum - 100)*parseInt(pctScale))/parseInt(pctScale);
		var htmlAreaObj = _getWorkAreaDefaultObj();
		var objAjax = htmlAreaObj.getHTMLAjax();
		var htmlErrors = objAjax.error();
		htmlErrors.addError("warningInfo", "Sum of percent exceeded 100, resetting the current value to max percent allowed in the field.",  false);
		messagingDiv(htmlErrors);
	}
}

SizeJsModule.addShipPack = function ()
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
	var objHtmlData = htmlAreaObj.getHTMLDataObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
   	objAjax.setActionURL("plmsize.do");
	objAjax.setActionMethod("showaddshippack");
    objAjax.setProcessHandler(SizeJsModule.showAddShipPackResponse);
	objAjax.sendRequest();
}

SizeJsModule.showAddShipPackResponse = function (objAjax)
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
		if(objAjax.isProcessComplete())
		{
            // Setting the height does not have any affect as the height is set to auto..
            var popUp = new Popup("addShipPackPopup","Add Ship Pack", objAjax.getResult(),300,400);
            popUp.show();
		}
        sectionName = '_divWorkArea';
        objAjax = null;
	}
}

SizeJsModule.saveShipPack = function()
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objHtmlData = htmlAreaObj.getHTMLDataObj();
    var objAjax = htmlAreaObj.getHTMLAjax();

    var chkShipPackObj = getElemnt("ship_pack#@#0");
	var isShipPackSelected = false;
	var i = 1;
    while(chkShipPackObj)
    {
        if(chkShipPackObj.checked)
        {
			isShipPackSelected = true;
			break;
        }
		chkShipPackObj = getElemnt("ship_pack#@#" + (i++));
    }

	if(!isShipPackSelected)
	{
		var htmlErrors = objAjax.error();
		var msg = "Please select at least one Ship Pack.";
		objAjax.error().addError("warningInfo", msg, false);
		messagingDiv(htmlErrors);
		return;
	}
    
    objAjax.setActionURL("plmsize.do");
    objAjax.setActionMethod("addshippack");
    objAjax.setProcessHandler("SizeJsModule.saveShipPackResponse");
    objHtmlData.performSaveChanges(SizeJsModule.addShipPackResponse, objAjax);
}

SizeJsModule.saveShipPackResponse = function(objAjax)
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
        if (objAjax.isProcessComplete())
        {
            SizeJsModule.addShipPackPopupClose('addShipPackPopup');
            _reloadArea(objAjax, sectionName);
            bShowMsg= false;
            refreshNavigationGrid(objAjax);
        }
    }
}

//Called when user clicks on Cancel button of Add Ship Pack pop up
SizeJsModule.addShipPackPopupClose = function (popName)
{
	//dialog window
	if (commentsDialog)
	{
		commentsDialog.dialog("close");
	}
	$("#"+popName).html('');
	$("#"+popName).dialog('destroy');
	$("#"+popName).remove();
}




