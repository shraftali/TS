/** ********************************** */
/* Copyright (C) 2002 - 2010 */
/* by */
/* TradeStone Software, Inc. */
/* Gloucester, MA. 01930 */
/* All Rights Reserved */
/* Printed in U.S.A. */
/* Confidential, Unpublished */
/* Property of */
/* TradeStone Software, Inc. */
/** ********************************** */
//

var isCopyOrder=false;

//defined name space for the purachase order 
//The same object is used and updated all the functions accordingly
var OrderJsModule = {}; 

////Used by the process Send Email on the PO detail tab
OrderJsModule.sendEmail = function sendEmail()
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();

    if(objAjax)
   	{
   		// Check for valid record to execute process.
	   	if(!isValidRecord(true))
		{
			return;
		}
		isCopyOrder=false;
		// Data has been changed but not saved?
		if(objHTMLData!=null && objHTMLData.isDataModified())
      	{
	   		var htmlErrors = objAjax.error();
	   		htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
	   		messagingDiv(htmlErrors, "saveWorkArea()", "sendVendorEmail()");
	   		return;
      	}
        this.sendVendorEmail();
    }
}

OrderJsModule.sendVendorEmail = function sendVendorEmail()
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();

    if(objAjax && objHTMLData)
    {
        objHTMLData.resetChangeFields();
        openWin('sendorder.do?method=view', 645, 610);
    }
}

OrderJsModule.additems = function additems()
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();

    if(objAjax)
   	{
   		// Check for valid record to execute process.
	   	if(!isValidRecord(true))
		{
			return;
		}
		isCopyOrder=false;
		// Data has been changed but not saved
		if(objHTMLData!=null && objHTMLData.isDataModified())
      	{
	   		var htmlErrors = objAjax.error();
	   		htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
	   		messagingDiv(htmlErrors, "saveWorkArea()", "addPOItems()");
	   		return;
      	}
        this.addPOItems();
    }
}
//Used by the process Add Item(s) on the PO detail tab
OrderJsModule.addPOItems = function addPOItems()
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();

    if(objAjax && objHTMLData)
    {
        objHTMLData.resetChangeFields();
        openWin('additems.do?method=new&doc_view_id=105&builder_id=300', 1000, 770)
    }
}
//Used by the process Order split on the PO detail tab
OrderJsModule.ordersplit = function ordersplit()
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();

    if(!isValidRecord(true))
    {
        return;
    }
    isCopyOrder=false;
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
	//alert(objHTMLData);
	if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
     {
	     var htmlErrors = objAjax.error();
		 objAjax.error().addError("warningInfo", "Please select a row", false);
		 messagingDiv(htmlErrors);
		 return;
	 }
    else
    {
        var chngFlds= objHtmlData.getChangeFields();
        var chlen=chngFlds.length;
        if(chlen>1)
        {
        	 var htmlErrors = objAjax.error();
		     objAjax.error().addError("warningInfo", szMsg_Sel_A_Row, false);
		     messagingDiv(htmlErrors);
		     return;
        }
        else
        {
         executeDocumentProcess("purchaseorderdetail.do", "ordersplit", false, true);
        }

	}
}

OrderJsModule.showOrderSplit = function showOrderSplit(selectedRows)
{
	waitWindow();
	window.location.href='ordersplit.do?method=view&rows='+selectedRows;waitWindow();
}

//Tracker#:21478 Show the change request screen.
OrderJsModule.showReqChange = function showReqChange()
{
    waitWindow();
    window.location.href='changereq.do?method=view';
}

//Set the variable isCopyOrder to true; if the copy process is successfull
OrderJsModule.setCopyVar = function setCopyVar()
{
	//set true if the copy process is called.
    //If this variable is set the set changed value is nt checked and user can save
    //the chages without modifying anything on  the screen
    isCopyOrder = true;
}

//Added save function specific  to PO screen
OrderJsModule.savePOWorkArea = function savePOWorkArea()
{
	//todo identify the proper area object based on doc view id
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objHtmlData = htmlAreaObj.getHTMLDataObj();
    var docviewid = htmlAreaObj.getDocViewId();
	
	//alert("docviewid------------>"+docviewid);
    //Added this condition for order copy process. After copying the bo, user can save the copied bo without
    //modifying any data. Which is similar to process in sourcing
    //Added this condition instead of adding one more function to save
    if(isCopyOrder!='undefined' && isCopyOrder == true && objHtmlData.getDocViewId() == 321)
     {
      objHtmlData._mHasUserModifiedData = true;
     }


    if(objHtmlData!=null && objHtmlData.hasUserModifiedData()==true)
    {
        // Made Generic, so that in all PLM screens, on save, screen would keep the screen place after save from
        // the point save process is called.
        objHtmlData.performSaveChanges(po_defaultWorkAreaSave_scroll);
    }
    else
    {
    	var objAjax = new htmlAjax();
    	objAjax.error().addError("warningInfo", szMsg_No_change, false);
    	_displayProcessMessage(objAjax);
       // _displayUserMessage(szMsg_No_change);
    }

	//Tracker#:21478 Reset the variable
	isCopyOrder = false;
    AutoSuggestContainer.clearComponents();
}

function po_defaultWorkAreaSave_scroll(objAjax)
{
	_defaultWorkAreaSave_scroll(objAjax);
	if(!objAjax.error().hasErrorOccured())
    {
        showChangeTrackingTabCount();
    }
}

OrderJsModule.poTabbedQuery = function poTabbedQuery()
{
    submitUrl2('tabqueryviewer.do?method=exequery&tabquery_id=query.tab.pochanges&dvid=300','H','N');
}


//Called when user clicks on Cancel button of Delivery split pop up
OrderJsModule.deliPopupClose = function (popName)
{
	//dialog window
	if (commentsDialog)
	{
		commentsDialog.dialog("close");
	}
	$("#"+popName).html('');
	$("#"+popName).dialog('destroy');
	$("#"+popName).remove();
	OrderJsModule.delShown = false;	
}
//Called when user clicks on the Split delivery process button
var DeliSplit = new QSearchChangeFields();
OrderJsModule.delShown = false;
OrderJsModule.deliverySplitPopUp = function (obj)
{
	var dln = $("input[id ^= _detl_deli_chek]:checked").length;
	var rln = $("input[id ^= chkRowKeys]:checked").length;
	var msg = "Please select row(s) and a delivery for splitting.";
	if (rln == 0 && dln ==0)
	{
		var objAjax = new htmlAjax();
		var htmlErrors = objAjax.error();
		objAjax.error().addError("warningInfo", msg, false);
		messagingDiv(htmlErrors);
		return;
	}
	msg = "Please select only one delivery.";
	if (dln != 1)
	{
		var objAjax = new htmlAjax();
		var htmlErrors = objAjax.error();
		objAjax.error().addError("warningInfo", msg, false);
		messagingDiv(htmlErrors);
		return;
	}
	msg = "Please select a row";
	if (rln == 0)
	{
		var objAjax = new htmlAjax();
		var htmlErrors = objAjax.error();
		objAjax.error().addError("warningInfo", msg, false);
		messagingDiv(htmlErrors);
		return;
	}
	
	DeliSplit.resetChngFlds();
	var chk = $("input[id ^= _detl_deli_chek]:checked");
   	var selectedChk = chk.filter(":checked");
   	var v =  selectedChk.val() ? selectedChk.val(): "" ;
   	/*var dt = $("input[id ^= "+selectedChk.attr("id")+"_h"+"]").val();
   	alert(dt);*/
    var htmlAreaObj = _getWorkAreaDefaultObj();
	var objHtmlData = htmlAreaObj.getHTMLDataObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
   	objAjax.setActionURL("purchaseorderdelivery.do");
	objAjax.setActionMethod("showpopup&plan_id="+v);
	objAjax.setProcessHandler(OrderJsModule.deliverySplitResponse);
	objHtmlData.performSaveChanges(OrderJsModule.deliverySplitResponse,objAjax);
   	
	//OrderJsModule.callAction("showpopup&plan_id="+v,"OrderJsModule.deliverySplitResponse");	
}

//Tracker#22288 -NEW UI:  AFTER CLOSING ADD SKU(S) POPUP BOX, UNABLE TO RUN OTHER PROCESSES
//This function checks whether the records are checked or not
function detChecked()
{
	var dln = $("input[id ^= _detl_deli_chek]:checked").length;
	var rln = $("input[id ^= chkRowKeys]:checked").length;
	if ( dln > 0 || rln > 0)
	{
		return true;
	}
	return false;
}

//Ajavx response of _deliverySplitPopUp handled here
OrderJsModule.deliverySplitResponse = function (objAjax)
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
			var comments = new Popup("deliPopup","", objAjax.getResult(),300,250);
			comments.show();
		}
		objAjax = null;
	}
}


var fldDelim = "@,";

var DeliQSrch = new QSearchChangeFields();
//Called when user clicks on the Quick search icon
OrderJsModule.deliveryQuickSearchPopUp = function(obj)
{
	DeliQSrch.resetChngFlds();
	OrderJsModule.callAction("showquicksearch&qsrchName=DeliQSrch","OrderJsModule.deliveryQukSrchResponse");	
}
//Ajax response of _deliverySplitPopUp handled here
OrderJsModule.deliveryQukSrchResponse = function(objAjax)
{
	if(objAjax)
	{
		if(objAjax.isProcessComplete())
		{
			var comments = new Popup("Qsearch","Quick Search", objAjax.getResult(),150,1120);
            comments.show();

        }
		objAjax = null;
	}
}


//Called when user clicks on 'Create Delivery Splits' button
OrderJsModule.createDelSplit = function()
{
	var type ;
	var rds = $("input:radio[name=_splDel]");
	var selectedRadio = rds.filter(":checked");
	var val =  selectedRadio.val() ? selectedRadio.val(): "" ;
	var noSpl = $("#_noSplts").val();
	var msg = "Please enter number of delivery splits.";
	if ( val == "")
	{
		msg = "Please select the Split By option.";
	}
	//checking for integer values
	var intRegex = /^\d+$/;

	if(intRegex.test(noSpl) && val != "") {
		if (parseInt(noSpl) < 2)
		{
			msg = "Number of splits should be greater than 1.";
			var objAjax = new htmlAjax();
			var htmlErrors = objAjax.error();
			objAjax.error().addError("warningInfo", msg, false);
			messagingDiv(htmlErrors);
			return;
		}
		var chk = $("input[id ^= _detl_deli_chek]:checked");
	   	var selectedChk = chk.filter(":checked");
	   	var v =  selectedChk.val() ? selectedChk.val(): "" ;
	   	bShowMsg = true;
		OrderJsModule.callAction("createsplits&type="+val+"&noofsplits="+noSpl+"&plan_id="+v,"OrderJsModule.processDeliResponse");
	}else{
		var objAjax = new htmlAjax();
		var htmlErrors = objAjax.error();
		objAjax.error().addError("warningInfo", msg, false);
		messagingDiv(htmlErrors);
		return;
	}
}
//Ajax response for _createDelSplit handled here
OrderJsModule.processDeliResponse =function(objAjax)
{
	if(objAjax)
	{
		if(objAjax.isProcessComplete())
		{
			$("#_splitDelSection").html(objAjax.getResult());
			OrderJsModule.delShown = true;
			//Auto increasing the height based on the content.
			$("#deliPopup").css('height', 'auto');
		}
		if(bShowMsg==true)
	   	{
	   		msgInfo = objAjax.getAllProcessMessages();
		    if(msgInfo!="")
		    {
		        _displayProcessMessage(objAjax);
		    }
	   	}
		objAjax = null;
	}
}
//Called when user clicks on Split Delivery button
OrderJsModule.splitDelivery = function()
{
	if(!OrderJsModule.delShown)
	{
		return ;
	}

	var rds = $("input:radio[name=_splDel]");
	var selectedRadio = rds.filter(":checked");
	var type =  selectedRadio.val() ? selectedRadio.val(): "" ;
	var noSpl = $("#_noSplts").val();
	var add = 0;
	var intRegex = /^\d+$/;
	var msg = "Please enter values to Delivery Id and Qty.";
	var b = true;
	$('input[name^="_deli_splt_qty"]').each(function() {

		var qId = $(this).attr("id");
		var splt = qId.split("_@");
		var r = splt[1];
		var pln = $('input[name *="deli_splt_pln_@'+r+'"]').val();
		//alert("R:"+$('input[name *="deli_splt_pln_@"]').length);
		//alert(pln.length);

		if($(this).val().length == 0 ||  pln.length == 0 )// If both fields are empty
		{
			var objAjax = new htmlAjax();
			var htmlErrors = objAjax.error();
			objAjax.error().addError("warningInfo", msg, false);
			messagingDiv(htmlErrors);
			b=false;
		}else if($(this).val().length === 0 || ! intRegex.test($(this).val()) )// If not number display message
		{
			msg = "Please enter value to all Qty fields.";
			var objAjax = new htmlAjax();
			var htmlErrors = objAjax.error();
			objAjax.error().addError("warningInfo", msg, false);
			messagingDiv(htmlErrors);
			b=false;
		}
	     add += Number($(this).val());
	});
	if (!b)
	{
		return;
	}
	var msg = "Percentage of split is not equal to 100%.  Please adjust and try again.";
	 if( type == "pct" && add != 100)
	 {
	 	var objAjax = new htmlAjax();
			var htmlErrors = objAjax.error();
			objAjax.error().addError("warningInfo", msg, false);
			messagingDiv(htmlErrors);
			return;
	 }

 	var val = DeliSplit.qsChngFldsNVal;
	var chFlds = DeliSplit.qsChngFlds;
	var values = DeliSplit.values;

	 var htmlAreaObj = _getWorkAreaDefaultObj();
	 var objHtmlData = htmlAreaObj.getHTMLDataObj();
   	 var objAjax = htmlAreaObj.getHTMLAjax();


   	var chk = $("input[id ^= _detl_deli_chek]:checked");
   	var selectedChk = chk.filter(":checked");
   	var v =  selectedChk.val() ? selectedChk.val(): "" ;

   	var v1= $('input[name^="_deli_splt_qty_@0"]').val();
	//objAjax = new htmlAjax();
	objAjax.setActionURL("purchaseorderdelivery.do");
	objAjax.setActionMethod("splitdelivery&plan_id="+v+"&val1="+escape(v1)+"&type="+type+"&noSpl="+noSpl);
	objAjax.setProcessHandler(showDocPageAftrSplt);

	//Change fields string for fields
	var fls = "";
	for (i=0; i < chFlds.length; i++)
	{
		fls += chFlds[i]+fldDelim;
	}
	objAjax.parameter().add("dChFlds", fls);

	//Change fields string for valuess
	var chgValfls = "";

	for (i=0; i < values.length; i++)
	{
		var spl = values[i].split("|");
		chgValfls += spl[0]+fldDelim;
		objAjax.parameter().add(spl[0], spl[1]);
	}
	objAjax.parameter().add("dValChFlds", chgValfls);

	// Adding all changed fields to request
	for (i=0; i < val.length; i++)
	{
		var spl = val[i].split("|");
		objAjax.parameter().add(spl[0], spl[1]);
	}
	//OrderJsModule.deliPopupClose('deliPopup');
	sectionName = '_divWorkArea';
	bShowMsg = true;
	objHtmlData._mHasUserModifiedData = true;
	objHtmlData.performSaveChanges(showDocPageAftrSplt,objAjax);
	//objAjax.sendRequest();
}

//Tracker#:22182 - PREVENT SPLITTING INTO EXISTING  DELIVERIES
//If no warning message then closing the popup window otherwise not cloasing and displaying the message.
function showDocPageAftrSplt(objAjax)
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
  		OrderJsModule.deliPopupClose('deliPopup');
		_reloadArea(objAjax, sectionName);
        bShowMsg= false;
        refreshNavigationGrid(objAjax);
        showChangeTrackingTabCount();
	}
  }
}

OrderJsModule.refreshScreen = function (objAjax)
{
	_execAjaxScript(objAjax);
    OrderJsModule.deliPopupClose('deliPopup');
    OrderJsModule.deliPopupClose('Qsearch');
    executeDocumentProcess('purchaseorderdelivery.do','view&refresh=Y', false, false);
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
//The method which makes an ajax call
OrderJsModule.callAction = function(actionMethod,processHndlr)
{
	objAjax = new htmlAjax();
	objAjax.setActionURL("purchaseorderdelivery.do");
	objAjax.setActionMethod(actionMethod);
	objAjax.setProcessHandler(processHndlr);
	objAjax.sendRequest();
}

//This will get called when the user clicks on the Search button.
OrderJsModule.deliquickSearch = function()
{
	var val = DeliQSrch.qsChngFldsNVal;
	var oprs = DeliQSrch.qsChngFldsOpr;
	var chFlds = DeliQSrch.qsChngFlds;

	var msg = "Please select search operator(s)."

	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objHtmlData = htmlAreaObj.getHTMLDataObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
	objAjax.setActionURL("purchaseorderdelivery.do");
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
		return;
	}
	OrderJsModule.deliPopupClose('Qsearch');
	sectionName = '_divWorkArea';
	bShowMsg = true;
	objHtmlData._mHasUserModifiedData =true;
	objHtmlData.performSaveChanges(showDocumentPage,objAjax);
}

OrderJsModule.deliShowAll = function()
{
	objAjax = new htmlAjax();
	objAjax.setActionURL("purchaseorderdelivery.do");
	objAjax.setActionMethod("showAll");
	objAjax.setProcessHandler("OrderJsModule.refreshScreen");
	objAjax.sendRequest();
}

OrderJsModule.deleteDetail = function(type)
{
	//type == 1, for delivery and 2 for SKU
	//alert(type);
	var delChk = $('input[id ^= _detl_deli_chek]:checked').length;
	//alert(_CHK_BOX_DEFAULT_ID);
	var objAjax = new htmlAjax();
	var htmlErrors = objAjax.error();
	var rowChk = $('input[id ^= '+_CHK_BOX_DEFAULT_ID+']:checked').length;
	//alert("type:"+type+"- rowChk:"+rowChk+"- delChk:"+delChk);
	//var msg = "System cannot proceed with delete. Please select either SKU/Item data OR Delivery for deletion.";
	if ( rowChk > 0 && delChk > 0)
	{
		if ( type == 2)
		{
			msg = "System cannot proceed with delete. Please select only a SKU/Item(s) for deletion.";
		} else if ( type == 1)
		{
			msg = "System cannot proceed with delete. Please select only a Delivery(s) for deletion.";
		}

		objAjax.error().addError("warningInfo", msg, false);
		messagingDiv(htmlErrors);
		return;
	}else
	{
		if ( rowChk > 0)
		{
			if (type==1)
			{
				msg = "System cannot proceed with delete. Please select only a Delivery(s) for deletion.";
				htmlErrors.addError("warningInfo", msg,  false);
				messagingDiv(htmlErrors);
				return;
			}
			msg = "Are you sure you want to delete the selected detail record(s)?";
			htmlErrors.addError("confirmInfo", msg,  false);
			messagingDiv(htmlErrors, "OrderJsModule.deleteSku()","OrderJsModule.cancel()");
			 return;
		}
		if (delChk > 0)
		{
			if (type==2)
			{
				msg = "System cannot proceed with delete. Please select only SKU/Item(s) for deletion.";
				htmlErrors.addError("warningInfo", msg,  false);
				messagingDiv(htmlErrors);
				return;
			}
			msg = "Are you sure you want to delete the selected detail record(s)?";
			htmlErrors.addError("confirmInfo", msg,  false);
			messagingDiv(htmlErrors, "OrderJsModule.delDelivery()","OrderJsModule.cancel()");
			return;
		}
	}

	//msg = "Please select either SKU/Item Data OR Delivery for deletion.";
	if ( delChk == 0 || rowChk == 0)
	{
		if ( type == 2)
		{
			msg = "System cannot proceed with delete. Please select SKU/Item(s) for deletion.";
		} else if ( type == 1)
		{
			msg = "System cannot proceed with delete. Please select a Delivery(s) for deletion.";
		}
		objAjax.error().addError("warningInfo", msg, false);
		messagingDiv(htmlErrors);
		return;
	}
}

OrderJsModule.cancel = function (){
	closeMsgBox();
}
OrderJsModule.delDelivery = function()
{
	var i = 0;
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objHtmlData = htmlAreaObj.getHTMLDataObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();

	var pId = 'pId';

	$("input[id ^= _detl_deli_chek]").each(function()
	{
		if ($(this).attr("checked"))
		{
			objAjax.parameter().add(pId+(i++), $(this).val());
		}
	});
	objAjax.setActionURL("purchaseorderdelivery.do");
	objAjax.setActionMethod("deleteDelivery&cntr="+i);
	objAjax.setProcessHandler(showDocumentPage);
	sectionName = '_divWorkArea';
	bShowMsg = true;
	objHtmlData._mHasUserModifiedData =true;
	objHtmlData.performSaveChanges(showDocumentPage,objAjax);
}

//Tracker#:21631
//show order split screen when the split field has 'Y' value
OrderJsModule.osplit  = function osplit()
{
   return;
}
//Tracker#:21631
OrderJsModule.sizeMassUpdt = function sizeMassUpdt()
{
	waitWindow();
	window.location.href='sizequeryviewer.do?method=sizemassupdate&sizequery_id=query.sizemassupdate';
}

//Tracker#:21631 show assign upc pop up
OrderJsModule.assignUPC = function assignUPC()
{
   openWin('orderitemxref.do?method=assignupc', 1000, 770);
}


//Tracker#:21631 show assign hedge numbers pop up
OrderJsModule.assignHedgeNumber = function assignHedgeNumber()
{
   openWin('hedgereq.do?method=assignhedgeno', 1000, 650);
}

//Tracker#:21666  set the qty of header and detail row sto zero.
OrderJsModule.cancelQuantity = function cancelQuantity()
{
    // Tracker#: 21851
    // Display yellow confirm msg instead of the window.confirm prompt
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var htmlErrors = objAjax.error();
    var szMsg_Qty = 'Entire quantities of details are about to set zero. Do you want to continue?';
    htmlErrors.addError("confirmInfo", szMsg_Qty,  false);

    var saveFunc = "executeDocumentProcess('purchaseorderoverview.do','cancelqty',false,false)";
    var cancelFunc ="cancelProcess()";
    messagingDiv(htmlErrors, saveFunc, cancelFunc);
}
OrderJsModule.returnFalse = function ()
        {
            return false;
        }
//This will highlight the selected column
OrderJsModule.hlCol = function(id,obj,skpInd)
{
	//alert(skpInd);
	var s = "86CBE6";
	if (!obj.checked){
		s = "";
	}
	var ind = obj.parentNode.cellIndex *2;
	var $tr = $('#'+id+' tr');
	var a = $(obj.parentNode); // TD which holds the check box
	a.css({"background-color":s});
	var i=0;
	$tr.each(function(el){ // iterate through all 'tr' to find relative 'td' .eq()
		if(i > 1) //Skip 2 rows ie with index 0 and 1 to highlight. The data row starts with index 2
		{
	 	  $(this).find('td').eq(ind-skpInd).css({"background-color":s});
		  $(this).find('td').eq(ind-(skpInd-1)).css({"background-color":s});
		}
		i++;
	});
}
//This will highlight the selected row
OrderJsModule.hlRow = function(obj,rIdL,rIdR)
{
	var l = $("#"+rIdL);
	var r = $("#"+rIdR);
	var s = "86CBE6";
	if (!obj.checked){
		s = "";
	}
	$(l).css({"background-color":s});
	$(r).css({"background-color":s});
}

//Called when user clicks on Split Delivery button
OrderJsModule.deleteSku = function()
{
	executeDocumentProcess("purchaseorderdelivery.do","deleteSku",false,false);
}

//sort search screen
OrderJsModule.sortSearchColumn=function sortSearchColumn(fieldName,sec,type, pageNo)
{
    //alert("sortTechSpecColumn called");
    var htmlAreaObj = _getWorkAreaDefaultObj();
	sectionName = sec;
    var objAjax = htmlAreaObj.getHTMLAjax();
    if(objAjax)
    {
        objAjax.setActionURL("purchaseorder.do");
        objAjax.setActionMethod("SORT&sortColumn="+fieldName+"&sort="+type+"&pageNum="+pageNo);
        objAjax.setProcessHandler(_orderShowPage);
        objAjax.sendRequest();
    }
}
//sort detail rows
OrderJsModule.sortDetailColumn=function sortDetailColumn(fieldName,sec,type, pageNo)
{
    //alert("sortTechSpecColumn called");
    var htmlAreaObj = _getWorkAreaDefaultObj();
	sectionName = sec;
    var objAjax = htmlAreaObj.getHTMLAjax();
    if(objAjax)
    {
        objAjax.setActionURL("purchaseorderdetail.do");
        objAjax.setActionMethod("SORT&sortColumn="+fieldName+"&sort="+type+"&pageNum="+pageNo);
        objAjax.setProcessHandler(_orderShowPage);
        objAjax.sendRequest();
    }
}

//reload page
function _orderShowPage(objAjax)
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


OrderJsModule.showCommentsPopUp  =function showCommentsPopUp()
{
  objAjax = new htmlAjax();
  objAjax.setActionURL("threadedcomments.do");
  objAjax.setActionMethod("viewcomments");
  //Renamed the method name
  objAjax.setProcessHandler("orderCommentResponse");
  objAjax.parameter().add("parentViewId", 321);
  objAjax.sendRequest();
}

//Tracker#:24253 Renamed the method name from comment response to orderCommentResponse 
//Because pop up was showing tech spec title. 
function orderCommentResponse()
{
	if(objAjax)
	{
		if(objAjax.isProcessComplete())
		{
			var comments = new TRADESTONE.Comments("Order Comments", objAjax.getResult());
			comments.show();
		}
		objAjax = null;
	}
}
//Tracker#:21977 - FR13 - MODIFY / INPUT QUANTITIES ACROSS DELIVERIES WHILE MAINTAINING QUANTITY ORDERED
//on change of QTY fields
OrderJsModule.changeQty = function(obj)
{
	//Tracker#:22269 - NEW UI: ENTER DATA IN ORDER QTY ON DELIVERY, GET INVALID DATA MESSAGE
	var intRegex = /^\d+$/;
	if (obj.value.length > 0 && !intRegex.test(obj.value))//If not number field
	{
		var msg = "Invalid entry in quantity field.";
		var objAjax = new htmlAjax();
		var htmlErrors = objAjax.error();
		htmlErrors.addError("warningInfo", msg,  false);
		messagingDiv(htmlErrors);
		obj.focus();
		return;
	}
	
	var id = obj.id;
	var spt = id.split("_@");
	var totId = "";
	var diffId = "";
	//Identify the toatal qty field id and the difference field id based on the changed field
	for (i = 0; i < spt.length; i++)
	{
		if (i == 2)
		{
			totId += "4_@"; // Total qty field index
			diffId += "6_@"; // difference field index
		}
		else
		{
			if ( i < spt.length -1)
			{
				totId += spt[i]+"_@";
				diffId += spt[i]+"_@";
			}
			else
			{
				totId += spt[i];
				diffId += spt[i];
			}
		}
	}

	var lft = id.substring(0,6); // left side string of the field index
	var rgt = id.substring(7,id.length); // right side string of the field index
	//truncating the preceding number string if any.
	//eg. Id : 1_@1_@7_@0_@0_@0_@_del_detail@0
	// lft will be '1_@1_@' and rgt '_@0_@0_@0_@_del_detail@0'
	rgt = rgt.substring(rgt.indexOf("_@"),id.length);

	var numId = 7; // starting with index 7.
	var totVal = 0;
	for ( i = 0; i < 12 ; i ++)
	{
		//forming the ids
		var id = lft + numId + rgt;
		var obj = getElemnt(id);
		if (obj)
		{
			if(obj.value.length > 0 )
			{
				totVal += parseInt(obj.value.replace(",",""));//replace the format string
			}
		}
		numId += 2;
	}
	
	// calcualte the difference
	var dif = 	totVal - parseInt(getElemnt(totId).value.length == 0 ? 0 : getElemnt(totId).value.replace(",","")); //replace the format string
	var dObj = getElemnt(diffId);
	dObj.value = dif;
	if ( dif == 0)
	{
		$(dObj).css({"color":"BLACK"}); // Paint red if neative value
	}
	else
	{
		$(dObj).css({"color":"RED"});
		if (dif > 0)
		{
			dObj.value = "+"+dif;
		}
	}
}


//quick search for purchase order detail

var QSrch = new QSearchChangeFields();
OrderJsModule.QuickSearchPopUp = function(obj)
{
	QSrch.resetChngFlds();
    OrderJsModule.callDetailAction("showquicksearch&qsrchName=QSrch","OrderJsModule.QukSrchResponse");
}
//Ajax response of _deliverySplitPopUp handled here
OrderJsModule.QukSrchResponse = function(objAjax)
{
    if(objAjax)
	{
		if(objAjax.isProcessComplete())
		{
            var comments = new Popup("Qsearch","Quick Search", objAjax.getResult(),150,1110);
			comments.show();

            // Tracker#: 23467
            // Add the keyup event to submit the page when enter key is pressed.
            $("#Qsearch").keyup(function(e) {

                if(e.keyCode == 13) {
                    OrderJsModule.poquickSearch();
		        }
	        });
        }
		objAjax = null;
	}
}

OrderJsModule.callDetailAction = function(actionMethod,processHndlr)
{
	//alert("detail");
	objAjax = new htmlAjax();
	objAjax.setActionURL("purchaseorderdetail.do");
	objAjax.setActionMethod(actionMethod);
	objAjax.setProcessHandler(processHndlr);
	objAjax.sendRequest();
}

OrderJsModule.poquickSearch = function()
{
	//alert("called");
	var val = QSrch.qsChngFldsNVal;
	var oprs = QSrch.qsChngFldsOpr;
	var chFlds = QSrch.qsChngFlds;

	var msg = "Please select search operator(s)."

	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objHtmlData = htmlAreaObj.getHTMLDataObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
	objAjax.setActionURL("purchaseorderdetail.do");
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
		return;
	}
	OrderJsModule.deliPopupClose('Qsearch');
	sectionName = '_divWorkArea';
	bShowMsg = true;
	objHtmlData._mHasUserModifiedData =true;
	objHtmlData.performSaveChanges(showDocumentPage,objAjax);
}

OrderJsModule.poShowAll = function()
{
	objAjax = new htmlAjax();
	objAjax.setActionURL("purchaseorderdetail.do");
	objAjax.setActionMethod("showAll");
	objAjax.setProcessHandler("OrderJsModule.refreshPOScreen");
	objAjax.sendRequest();
}


OrderJsModule.refreshPOScreen = function (objAjax)
{
	_execAjaxScript(objAjax);
    OrderJsModule.deliPopupClose('deliPopup');
    OrderJsModule.deliPopupClose('Qsearch');
    executeDocumentProcess('purchaseorderdetail.do','view&refresh=Y', false, false);
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

//Used by the process Add Item(s) on the PO detail tab
OrderJsModule.addskus = function addskus()
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    //Tracker#22288 -NEW UI:  AFTER CLOSING ADD SKU(S) POPUP BOX, UNABLE TO RUN OTHER PROCESSES
    // If any rows in details checked then display the warning
	if (detChecked())
    {
    	var htmlErrors = objAjax.error();
   		htmlErrors.addError("warningInfo", "There are detail records selected. Please remove the selection and proceed.",  false);
   		messagingDiv(htmlErrors);
   		return;
    }
    if(objAjax && objHTMLData)
    {
        objHTMLData.resetChangeFields();        
        openWin('addsku.do?method=new&doc_view_id=1006&builder_id=300', 1000, 770);
    }
}

//Tracker#:22175 PHASE 2: MORE ACTIONS -> RECALC COSTS
OrderJsModule.calcDelReCost = function calcDelReCost()
{
	var rowChk = $('input[id ^= '+_CHK_BOX_DEFAULT_ID+']:checked').length;
	if (rowChk == 0)
	{
		var objAjax = new htmlAjax();
		var htmlErrors = objAjax.error();
		objAjax.error().addError("warningInfo", "Please select row(s)", false);
		messagingDiv(htmlErrors);
		return;
	}
	
	executeDocumentProcess('purchaseorderdelivery.do','calcrecost',false,false);	
}

//Tracker#: 23215 CREATE VIEW ITEM PACKAGING INSTRUCTIONS ON PO'S USING PLM FRAMEWORK.
OrderJsModule.showItemPkgInstn = function showItemPkgInstn()
{
	waitWindow();
    window.location.href='order.do?method=viewitempkg&rows=-1';
}

//Tracker#: 23213 CREATE VIEW REQUEST CHANGES ON PO'S USING PLM FRAMEWORK
OrderJsModule.viewRequestChanges = function()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	if(objAjax && objHTMLData)
    {
    
		if(objHTMLData!=null && objHTMLData.isDataModified())
      	{
	   		var htmlErrors = objAjax.error();
	   		htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
	   		messagingDiv(htmlErrors, "saveWorkArea()", "OrderJsModule.contViewRC()");
	   		return;
      	}
		OrderJsModule.contViewRC();
    }
}

OrderJsModule.contViewRC = function()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	objAjax.setActionURL("purchaseorderoverview.do");
	objAjax.setActionMethod("viewRC");
	objAjax.setProcessHandler("OrderJsModule.goToRequestChanges");
	objAjax.sendRequest();
}

OrderJsModule.goToRequestChanges = function()
{
   waitWindow();
   window.location.href='collaborate.do?method=view';
}
//Tracker#: 23215
OrderJsModule.viewItemPkgForOrderDtl = function()
{
	var changeFieldRowno = -1;
    if(typeof(obj) == "undefined" || obj.id == null)
    {
    	
        var nActualCurRowNo = getElemnt("nActualCurRowNo");
        if(nActualCurRowNo != null && typeof(nActualCurRowNo) != "undefined")
        {
            changeFieldRowno = nActualCurRowNo.value;
        }
        else
    	{
        	return;
    	}
    }
    else
    {
    	 changeFieldRowno = _getActualRowIndexFromObjectId(obj.id);
    }
    
    executeDocumentProcess("purchaseorderdetail.do", "viewitmpkginstn&rows="+changeFieldRowno, false, false);
       
}
//Tracker#: 23215 
OrderJsModule.showItemPkgView = function showItemPkgView(selectedRows)
{
	waitWindow();
    window.location.href='order.do?method=viewitempkg&rows='+selectedRows;
}

//Tracker#: 23214
OrderJsModule.viewItemTestInstnForOrderDtl = function()
{
	var changeFieldRowno = -1;
    if(typeof(obj) == "undefined" || obj.id == null)
    {
    	
        var nActualCurRowNo = getElemnt("nActualCurRowNo");
        if(nActualCurRowNo != null && typeof(nActualCurRowNo) != "undefined")
        {
            changeFieldRowno = nActualCurRowNo.value;
        }
        else
    	{
        	return;
    	}
    }
    else
    {
    	 changeFieldRowno = _getActualRowIndexFromObjectId(obj.id);
    }
    
    executeDocumentProcess("purchaseorderdetail.do", "viewitmtestinstn&rows="+changeFieldRowno, false, false);
       
}
//Tracker#: 23214
OrderJsModule.showItemTestInstnView = function showItemTestInstnView(selectedRows)
{
	waitWindow();
    window.location.href='order.do?method=viewitemtest&rows='+selectedRows;
}
OrderJsModule.applySummaryFilters = function(sectionTagName, sectionType, rowIndex)
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    if( objAjax && objHTMLData)
    {
        objHTMLData.resetChangeFields();
    }
    var url = "summarizeby&sectionTagName=" + sectionTagName+ "&sectionType=" +  sectionType + "&rowIndex=" + rowIndex;
    loadWorkArea("viewordersummary.do", url);
}

//Tracker#:23285 CREATE ORDER SPLIT PROCESS ON NEW PO PLM FRAMEWORK
function checkSplitNumber(element)
{
	var isNumeric = vn(element);
   if (isNumeric)
   {
   	    if (parseInt(element.value) <= 1)
   	    {
   		    alert("Enter value greater than 1.")
            element.value = '';
   		    return false;
   	    }
   }
}
function splitLines()
{
	var splitlns=document.getElementById("splitlines").value;
	
	var url="plmordersplit.do";
	var method="splitlines&spltlns="+splitlns;
	loadWorkArea(url, method);
    return;
}


OrderJsModule.post = function()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();

    if(objAjax && objHTMLData)
      { 
    	objAjax.setActionURL("plmordersplit.do");
        objAjax.setProcessHandler(OrderJsModule.navigatetoPODetail);
        objAjax.setActionMethod("post");
        if(objHTMLData!=null && objHTMLData.isDataModified())
        {
    	  objHTMLData.performSaveChanges(OrderJsModule.navigatetoPODetail, objAjax);
        }
        else 
 		{
		 objAjax.sendRequest();
 		}
      }
}

OrderJsModule.navigatetoPODetail = function(objAjax)
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
	var url = "purchaseorderdetail.do";
	var method="postview";
	if(!objAjax.error().hasErrorOccured())
	{
		objHTMLData.resetChangeFields();
        bShowMsg = true;
		loadWorkArea(url, method);
	}
	else
	{
		objMsgDiv = new messagingDiv(objAjax.error());
	}
}

function chgUnits(changedField)
{

	var fieldName = changedField.getAttribute("NAME");
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	if(objAjax)
		{
			var url = "plmordersplit.do";
			var actionMethod = "CHGUNITS&changedfield=" + fieldName + "&changedfieldvalue=" + changedField.value;
			objAjax.setActionURL(url);
			objAjax.setActionMethod(actionMethod);
			objAjax.setProcessHandler(resetordersplitfield);
			objHtmlData.addToChangedFields(changedField);
			objAjax.parameter().add("chgflds", objHTMLData.getSaveChangeFields()); 
			objHTMLData._appendAllContainerDataToRequest(objAjax);
			objAjax.sendRequest();
		}
}
function resetordersplitfield(objAjax)
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
	var allocPct = objAjax.getResponseHeader("allocPackFld");
	if(allocPct != "")
	{
		var oc = document.getElementsByName(allocPct);
		if(oc) oc = oc[0];
		oc.value = objAjax.getResponseHeader("allocPackVal");
		// oc.onchange();
		oc.value = replaceval(oc, CommaDelimiter, Blank);
		_notifyChangeFields(oc,3);
	}
	var noInner = objAjax.getResponseHeader("noInnerFld");
	if(noInner != "")
	{
		var oc = document.getElementsByName(noInner);
		if(oc) oc = oc[0];
		oc.value = objAjax.getResponseHeader("noInnerVal");
		// oc.onchange();
		oc.value = replaceval(oc, CommaDelimiter, Blank);
		_notifyChangeFields(oc,3);
	}
	var allocPct = objAjax.getResponseHeader("allocQtyFld");
	if(allocPct != "")
	{
		var oc = document.getElementsByName(allocPct);
		if(oc) oc = oc[0];
		oc.value = objAjax.getResponseHeader("allocQtyVal");
		// oc.onchange();
		oc.value = replaceval(oc, CommaDelimiter, Blank);
		_notifyChangeFields(oc,3);
	}
	var noInner = objAjax.getResponseHeader("allocPckFld");
	if(noInner != "")
	{
		var oc = document.getElementsByName(noInner);
		if(oc) oc = oc[0];
		oc.value = objAjax.getResponseHeader("allocPckVal");
		// oc.onchange();
		oc.value = replaceval(oc, CommaDelimiter, Blank);
		_notifyChangeFields(oc,3);
		}
	bShowMsg= false;
	}
}
function chgCases(changedField)
{
	var fieldName = changedField.getAttribute("NAME");
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	if(objAjax)
	{
		var url = "plmordersplit.do";
		var actionMethod = "CHGCASE&changedfield=" + fieldName + "&changedfieldvalue=" + changedField.value;
		objAjax.setActionURL(url);
		objAjax.setActionMethod(actionMethod);
		objAjax.setProcessHandler(resetordersplitfield);
		objHtmlData.addToChangedFields(changedField);
		objAjax.parameter().add("chgflds", objHTMLData.getSaveChangeFields()); 
		objHTMLData._appendAllContainerDataToRequest(objAjax);
		objAjax.sendRequest();
	}
}
function chgInners(changedField)
{
	var fieldName = changedField.getAttribute("NAME");
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	if(objAjax)
	{
		var url = "plmordersplit.do";
		var actionMethod = "CHGINNER&changedfield=" + fieldName + "&changedfieldvalue=" + changedField.value;
		objAjax.setActionURL(url);
		objAjax.setActionMethod(actionMethod);
		objAjax.setProcessHandler(resetordersplitfield);
		objHtmlData.addToChangedFields(changedField);
		objAjax.parameter().add("chgflds", objHTMLData.getSaveChangeFields()); 
		objHTMLData._appendAllContainerDataToRequest(objAjax);
		objAjax.sendRequest();
	}
}

function showDetailInfo(id,obj)
{
	
  var url = 'quickview.do?id='+id+'&rows='+_getRowID(obj.id); 
  //alert("url"+url);
  openWin(url,600,500);
}

function _getRowID(objId)
{
    var retVal = null;   
    if(objId)
    {
        
        var str = objId.split(_FIELDS_SEPERATOR);

        if(str && str.length>2)
        {
           retVal=str[5] 
        }
       
    }

    return retVal;
}
//Tracker#: 23216
OrderJsModule.viewOredrItemTestForOrderDtl = function()
{
	var changeFieldRowno = -1;
    if(typeof(obj) == "undefined" || obj.id == null)
    {
    	
        var nActualCurRowNo = getElemnt("nActualCurRowNo");
        if(nActualCurRowNo != null && typeof(nActualCurRowNo) != "undefined")
        {
            changeFieldRowno = nActualCurRowNo.value;
        }
        else
    	{
        	return;
    	}
    }
    else
    {
    	 changeFieldRowno = _getActualRowIndexFromObjectId(obj.id);
    }
    
    executeDocumentProcess("purchaseorderdetail.do", "vieworderitmtestinstn&rows="+changeFieldRowno, false, false);
       
}

//Tracker#: 23216
OrderJsModule.showOrderItemTestView = function showOrderItemTestView(selectedRows)
{

	waitWindow();
    window.location.href='order.do?method=vieworderitemtesting&rows='+selectedRows;
}
//End
//End
