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

function _loadComplianceSrchRepWorkArea(url, actionMethod, divSaveContainerName, processHandler)
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	objHTMLData.resetChangeFields();
	objHTMLData._mHasUserModifiedData = false;	
	loadWorkArea(url,actionMethod,"",loadNavigationGrid);
}


function _loadreportview(docviewid)
{
	_loadComplianceSrchRepWorkArea("compliancereport.do","view&docviewid="+docviewid,"",loadNavigationGrid);
}

function _clearComplianceReport(docViewId)
{  
	var search = new advancedSearch(docViewId);
	if(search)
	{
		search.clearFields(docViewId);
	}
	document.getElementById("selectedError").value = '=====Select=====';
}

function genComplianceReport(docviewid, method) 
{
	
	action = "compliancereport.do";
	method="report&docviewid="+docviewid;
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
    var objHTMLAjax = htmlAreaObj.getHTMLAjax();
    
    objHTMLAjax.setActionURL(action);
    objHTMLAjax.setActionMethod(method); 
    var obj = document.getElementById("selectedError");
    if(obj != null)
    {
    	 objHTMLAjax.parameter().add("dropVal", obj.value);
    }   
    objHTMLAjax.parameter().add(_screenChangeFileds,  objHTMLData.getSaveChangeFields());
    objHTMLAjax.setProcessHandler(_getExcelReport);
    objHTMLData._appendAllContainerDataToRequest(objHTMLAjax);
    objHTMLAjax.sendRequest();
}

function _getExcelReport(objHTMLAjax)
{
	if(objHTMLAjax.isProcessComplete())
    {
		var hasError = objHTMLAjax.error().hasErrorOccured();
		
	    if (hasError) 
	    {
	        _displayProcessMessage(objHTMLAjax);
	        //To be safe
	        closewaitWindow();
	        return;
	    }
	    if (mFileDownloadIFrame) mFileDownloadIFrame.parentNode.removeChild(mFileDownloadIFrame);
	    mFileDownloadIFrame = document.createElement("iframe");
	    mFileDownloadIFrame.id = "iframe";
	    mFileDownloadIFrame.src = action + "?method=serveFile";
	    mFileDownloadIFrame.style.display = "none";
	    document.body.appendChild(mFileDownloadIFrame);
	    mFileDownloadIFrame.onload = function() {
	        //To be safe
	        closewaitWindow();
	    }
    }
    else
    {
        //alert("show mesage");
        _displayProcessMessage(objHTMLAjax);
    }

}

function genAllComplianceReport(docviewid, method) 
{
	
	action = "compliancereport.do";
	method="report&docviewid="+docviewid;
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
    var objHTMLAjax = htmlAreaObj.getHTMLAjax();    
    objHTMLAjax.setActionURL(action);
    objHTMLAjax.setActionMethod(method);        
    objHTMLAjax.parameter().add(_screenChangeFileds,  objHTMLData.getSaveChangeFields());
    objHTMLAjax.setProcessHandler(_getExcelReport);
    objHTMLData._appendAllContainerDataToRequest(objHTMLAjax);
    objHTMLAjax.sendRequest();
}

