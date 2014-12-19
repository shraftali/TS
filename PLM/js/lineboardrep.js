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

function _callLineBoardReport()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
    var changeFields = objHTMLData.getChangeFields();
    var objAjax = htmlAreaObj.getHTMLAjax();
    bShowMsg = true;
    //when user doesn't enter anything and clicks on the report button for the
    //first time this check is done
    if(objHTMLData.hasUserModifiedData()==false)
    {
        var htmlErrors = objAjax.error();
        objAjax.error().addError("errorInfo", 'Must enter values for: Season', true);
        messagingDiv(htmlErrors);
        return;
    }
	var url = 'lineboardreport';// report action method name
	
	objAjax.setActionMethod(url);
	objAjax.setActionURL('lineboardreport.do');
	objAjax.setProcessHandler(_loadLineBoardReport);
	objHTMLData.performSaveChanges(_loadLineBoardReport, objAjax);
}

function _loadLineBoardReport(objAjax)
{
	if(objAjax.isProcessComplete())
	{
		var htmlAreaObj = _getWorkAreaDefaultObj();
		var objHTMLData = htmlAreaObj.getHTMLDataObj();
        
        var id='174';
    	var name='lineboardreport';
    	var str = 'report?id=' + id + '&reportname=' + name +'&method='+name+'&requestFrom=PLM';
    	oW('report', str, 800, 650);
		
	}
	else if(!objAjax.isProcessComplete())
	{
		_displayProcessMessage(objAjax);
	}
}

function _clearLineBoardReport(docViewId)
{
	var search = new advancedSearch(docViewId);
	if(search)
	{
		search.clearFields(docViewId);
	}
}

function _loadLineboardRepWorkArea(url, actionMethod, divSaveContainerName, processHandler)
{
	loadWorkArea(url,actionMethod,"",loadNavigationGrid);
}

//Tracker#:23049 SAVE MESSAGE AFTER CLOSING LINE BOARD REPORT 
//client script called on page load to set htmlAreaObj.setDataModifiedForNavigation to flase
//so as to skip checking the change fields for the line board report screen.
function _setDataModifiedFlagForNavigation()
{	
	var htmlAreaObj = _getWorkAreaDefaultObj();
	//alert("htmlAreaObj="+htmlAreaObj);
	if(htmlAreaObj)
	{
		htmlAreaObj.setDataModifiedForNavigation(false);
	}
}

function _displayToDateFld(obj, compId)
{
	//alert("obj.id" + compId);
	var t = document.getElementById(compId+'to_date');
	var divObj = document.getElementById('div'+compId+'to_date');
	//alert("t" + t);
	if(obj.value==8)
	{	
		//$(t).removeAttr("readonly");
		//$(t).attr('class', 'clsTextNormal');
		toggleDisplayVisible(divObj, true);
	}
	else
	{
		//$(t).attr('readonly','true');
		//$(t).attr('class', 'clsTextReadOnly');
		$(t).val('');
		toggleDisplayVisible(divObj, false);
	}
}
