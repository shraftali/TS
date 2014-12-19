/*************************************/
/*  Copyright  (C)  2002 - 2014      */
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
 * The search function for Customer Invoice screen
 */

var customerinvoice = {};

customerinvoice.sortCustomerInvoiceColumn = function (fieldName, sec, type, pageNo)
{
	customerinvoice.sortColumnForSection(fieldName, sec, type, pageNo, "customerinvoice.do")
}

customerinvoice.sortCustomerInvoiceDtlColumn = function (fieldName, sec, type, pageNo)
{
	customerinvoice.sortColumnForSection(fieldName, sec, type, pageNo, "customerinvoicedetail.do")
}

customerinvoice.sortColumnForSection = function (fieldName, sec, type, pageNo, url)
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    sectionName = sec;
    if(objAjax)
    {
        objAjax.setActionURL(url);
        objAjax.setActionMethod("SORT&sortColumn="+fieldName+"&sort="+type+"&pageNum="+pageNo);
        objAjax.setProcessHandler(customerinvoice.refreshPageAfterSort);
        objAjax.sendRequest();
    }
}

customerinvoice.refreshPageAfterSort = function (objAjax)
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

customerinvoice.goToPage = function ()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var pgNo = $("#pageno").val();
	var pageNo = parseInt(pgNo);
	if(isNaN(pageNo))
	{
		objAjax.error().addError("warningInfo", "Please enter page number", false);
    	_displayProcessMessage(objAjax);
    	return;
	}
	var msg = "Page No " + pageNo + " does not exist.";
	var noOfPage = parseInt($("#wc_total_pages").val());
	if(pageNo <= 0 || pageNo > noOfPage) {
    	objAjax.error().addError("warningInfo", msg, false);
    	_displayProcessMessage(objAjax);
    	return;
	}
	showNextPage(pageNo,'MainSection','customerinvoice.do');
}

customerinvoice.showCommentsPopUp = function ()
{
  objAjax = new htmlAjax();
  objAjax.setActionURL("threadedcomments.do");
  objAjax.setActionMethod("viewcomments");
  //Renamed the method name
  objAjax.setProcessHandler("customerinvoice.customerInvoiceCommentResponse");
  objAjax.parameter().add("parentViewId", 6304);
  objAjax.sendRequest();
}

customerinvoice.customerInvoiceCommentResponse = function()
{
	if(objAjax)
	{
		if(objAjax.isProcessComplete())
		{
			var comments = new TRADESTONE.Comments("Customer Invoice Comments", objAjax.getResult());
			comments.show();
		}
		objAjax = null;
	}
}

customerinvoice.save = function save() {
	saveWorkArea();
}

customerinvoice.callDetailAction = function(actionMethod,processHndlr)
{
	//alert("detail");
	objAjax = new htmlAjax();
	objAjax.setActionURL("customerinvoicedetail.do");
	objAjax.setActionMethod(actionMethod);
	objAjax.setProcessHandler(processHndlr);
	objAjax.sendRequest();
}

var QSrchCustInv = new QSearchChangeFields();
customerinvoice.QuickSearchPopUp = function(obj)
{
	QSrchCustInv.resetChngFlds();
	customerinvoice.callDetailAction("showquicksearch&qsrchName=QSrchCustInv","customerinvoice.QSrchResponse");
}

customerinvoice.QSrchResponse = function(objAjax)
{
    if(objAjax)
	{
		if(objAjax.isProcessComplete())
		{
            var comments = new Popup("Qsearch","Quick Search", objAjax.getResult(),150,900);
			comments.show();

            // Add the keyup event to submit the page when enter key is pressed.
            $("#Qsearch").keyup(function(e) {

                if(e.keyCode == 13) {
                	customerinvoice.quickSearch();
		        }
	        });
        }
		objAjax = null;
	}
}

customerinvoice.quickSearch = function()
{
	var val = QSrchCustInv.qsChngFldsNVal;
	var oprs = QSrchCustInv.qsChngFldsOpr;
	var chFlds = QSrchCustInv.qsChngFlds;

	var msg = "Please select search operator(s)."
	var noSearchMsg = "Please select search criteria.";
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objHtmlData = htmlAreaObj.getHTMLDataObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
	objAjax.setActionURL("customerinvoicedetail.do");
	objAjax.setActionMethod("quickSearch");
	objAjax.setProcessHandler(showDocumentPage);

	// Adding the changed fields to the request.
	var fls = "";
	for (i=0; i < chFlds.length; i++)
	{
		fls += chFlds[i]+fldDelim;
	}
	objAjax.parameter().add("dChFlds", fls);

	for (i=0; i < val.length; i++)
	{
		var spl = val[i].split("|");
		objAjax.parameter().add(spl[0], spl[1]);
		var op = getElemnt(spl[0]+"_opr");
		//If the user has not selected the operator for the field show message.
		// otherwise add operator field id and value to request
		if (op.value == "-1")
		{
			var objAjax = new htmlAjax();
			var htmlErrors = objAjax.error();
			objAjax.error().addError("warningInfo", msg, false);
			messagingDiv(htmlErrors);
			return;
		}else
		{
			objAjax.parameter().add(spl[0]+"_opr", op.value);
		}
	}
	var hasNullOpr = false;
	for (i=0; i < oprs.length; i++)
	{
		s = oprs[i];
		var spl = s.split("|");
		if (  spl[1] == "13" || spl[1] == "14")
		{
			hasNullOpr = true;
			var op = getElemnt(spl[0]);
			objAjax.parameter().add(spl[0], op.value);
		}
	}
	if (!hasNullOpr && val.length < 1)
	{
		var objAjax = new htmlAjax();
		var htmlErrors = objAjax.error();
		objAjax.error().addError("warningInfo", noSearchMsg, false);
		messagingDiv(htmlErrors);
		return;
	}
	customerinvoice.deliPopupClose('Qsearch');
	sectionName = '_divWorkArea';
	bShowMsg = true;
	objHtmlData._mHasUserModifiedData =true;
	objHtmlData.performSaveChanges(showDocumentPage,objAjax);
}

customerinvoice.qsShowAll = function()
{
	objAjax = new htmlAjax();
	objAjax.setActionURL("customerinvoicedetail.do");
	objAjax.setActionMethod("showAll");
	objAjax.setProcessHandler("customerinvoice.refreshScreen");
	objAjax.sendRequest();
}

customerinvoice.refreshScreen = function (objAjax)
{
	_execAjaxScript(objAjax);
	customerinvoice.deliPopupClose('deliPopup');
	customerinvoice.deliPopupClose('Qsearch');
    executeDocumentProcess('customerinvoicedetail.do','view&refresh=Y', false, false);
  //For displaying message on screen.
	if(bShowMsg==true)
   	{
   		msgInfo = objAjax.getAllProcessMessages();
	    if(msgInfo!="")
	    {
	        _displayProcessMessage(objAjax);
	    }
   	}
}

customerinvoice.deliPopupClose = function (popName)
{
	//dialog window
	if (commentsDialog)
	{
		commentsDialog.dialog("close");
	}
	$("#"+popName).html('');
	$("#"+popName).dialog('destroy');
	$("#"+popName).remove();
	customerinvoice.delShown = false;	
}
