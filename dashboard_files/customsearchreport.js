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

function _loadCustSrchRepWorkArea(url, actionMethod, divSaveContainerName, processHandler)
{
	loadWorkArea(url,actionMethod,"",loadNavigationGrid);
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

function _clearCustomSearchReport(docViewId)
{
	var search = new advancedSearch(docViewId);
	if(search)
	{
		search.clearFields(docViewId);
	}
}


function _callCustomSearchReport(docViewId)
{
    //window.open("customsearchreport.do?method=report");
	mExportToExcel("", "");
}

var mFileDownloadIFrame;
function mExportToExcel(action, method) {
	action = "customsearchreport.do";
	method="report";
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
    var changeFields = objHTMLData.getChangeFields();
    var objHTMLAjax = htmlAreaObj.getHTMLAjax();
    bShowMsg = true;
    if(objHTMLData.hasUserModifiedData()==false)
    {
        var htmlErrors = objHTMLAjax.error();
        objHTMLAjax.error().addError("errorInfo", 'Must enter values for: Dept', true);
        messagingDiv(htmlErrors);
        return;
    }
    objHTMLAjax.setActionURL(action);
    objHTMLAjax.setActionMethod(method);
    objHTMLAjax.setProcessHandler(function (objHTMLAjax1){
    	var hasError = objHTMLAjax1.error().hasErrorOccured();
        if (hasError) {
            _displayProcessMessage(objHTMLAjax1);
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
    });
    objHTMLData.performSaveChanges(null, objHTMLAjax);
}
