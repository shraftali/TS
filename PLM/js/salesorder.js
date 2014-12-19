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
 * The search function for sales order screen
 */
var SO={}
//Tracker#: 23299 INCORRECT MESSAGE IS DISPLAYED ON EXECUTING THE ACCEPT ORDER PROCESS
var srnMsg = "Sales Order Summary status should be WORK in order to execute this process.";

//Tracker#: 25609 FR11 ASSIGNMENT PROCESS ALSO SHOULD BE ENABLED IF THE STATUS OF THE SO HEADER IS IN ASSIGNED OR APPR
var snewrnMsg = "Order must be in WORK, ASSIGNED, APPROVED or REVISED status to add Assignments.";

SO.search= function (secId, docView)
{
	//alert("Search function here-->"+secId +" docView -->"+docView);
	if (SO.mt())
	{
		var objAjax = new htmlAjax();
		var htmlErrors = objAjax.error();
		objAjax.error().addError("warningInfo", "Please enter your search criteria.", false);
		messagingDiv(htmlErrors);
		return;
	}
	var areaObj =_getAreaObjByDocView(docView);
	var objdata = areaObj.getHTMLDataObj();
	var objAjax = areaObj.getHTMLAjax();
	objdata.setAppendContainerData(true);
	bShowMsg = true;
	objAjax.setActionURL("salesorder.do");
	objAjax.setActionMethod("SEARCH");
	objAjax.setProcessHandler(SO.pResp);
	objdata.performSaveChanges(SO.pResp,objAjax);
	if(objdata._mHasUserModifiedData){
		toggleCollapExpand(Collapimg_Id,collapSection_Search, imgDownArrow, imgRightArrow);
	}
	
}

/**
 * Clear function - Reset the values entered for search
 */
SO.clr = function (docView)
{
	$('#_SearchSection input').val('');
	var container = document.getElementById('_SearchSection');
    var children = container.getElementsByTagName('select');
    for (var i = 0; i < children.length; i++) {
        children[i].selectedIndex = 0;
    }
    var areaObj =_getAreaObjByDocView(docView);
	var objdata = areaObj.getHTMLDataObj();
	objdata._mHasUserModifiedData=false;
	objdata.resetChangeFields();
}

SO.showOvw = function ()
{
	 $(commentsDialog).dialog('destroy');
	showEntryOverview('salesorderentryoverview.do');
	
}

function showEntryOverview(url)
{
	var method = "TOOVERVIEW&_nColLibRow=" + _nColLibRow;
	method += "&keyinfo= " + getComponentKeyInfo();
	//Tracker#: 25594 FR02 - DELETE ASSIGNMENTS PROCESS AT SALES ORDER HEADER AND DETAIL LEVEL
	//Clear the hidden fields
	SO.removeHiddenflds();
	loadWorkArea(url, method);
}


//Ajax response for _createDelSplit handled here
SO.pResp =function(objAjax)
{
	if(objAjax)
	{
		//alert(objAjax.isProcessComplete());
		if(objAjax.isProcessComplete())
		{
			$("#MainSection_divCollapsable").html(objAjax.getResult());
		}
		//alert(bShowMsg);
		if(bShowMsg==true)
	   	{
	   		msgInfo = objAjax.getAllProcessMessages();
		    if(msgInfo!="")
		    {
		        _displayProcessMessage(objAjax);
		    }
	   	}
		
	}
	var respCall = objAjax.getResponseHeader("RESP");
	 //alert(respCall);
	 eval(respCall);
	 	var htmlAreaObj = _getWorkAreaDefaultObj();
		var objdata = htmlAreaObj.getHTMLDataObj();
		objdata.resetChangeFields();
		refreshNavigationGrid(objAjax);
	 objAjax = null;
	 //Tracker#: 24580 SALES ORDER PROCESS FROM MORE ACTION DROPDOWN FAILED TO WORK 
	 SO.removeHiddenflds();
}

SO.dDtl =function(objAjax)
{
	var divId = objAjax.parameter().getParameterByName("divId");
	//alert("DivId--->"+divId);
	if(objAjax)
	{
		if(objAjax.isProcessComplete())
		{
			$("#"+divId).html(objAjax.getResult());			
			
		}
		if(bShowMsg==true)
	   	{
	   		msgInfo = objAjax.getAllProcessMessages();
		    if(msgInfo!="")
		    {
		        _displayProcessMessage(objAjax);
		    }
	   	}
		var respCall = objAjax.getResponseHeader("RESP");
		//alert(respCall);
		eval(respCall);
		
		/*$('TR[name^="salesOrder_row"]').each(function() {
			
			$("<td></td>").html('test').appendTo(this);
		});*/

		objAjax = null;
	}
}
SO.shDtl = function (soId,imgId,indx,expImg,colImg, status)
{
	//alert(soId);
	var r1 = $("#soDetlRow_"+indx).show();
	$('#salesOrder_row_'+indx).after($(r1));
	var obj = getElemnt(imgId);
	//alert(obj.src +"<----->"+expImg);
	var d = getElemnt("_soDetlSection_"+indx);
	if (d != null)
	{	
		d.style.visibility="visible";
		d.style.display="block";
	}
	var method='';
	if(obj && obj.src.indexOf( expImg) > 0 ) 
	{
		$("#soDetlRow_"+indx).css("display","none");
		$("#soDetlRow_"+indx).css("display","none");
		var im= $('#_salesOrdImgCell'+indx).find('img');
		$(im).remove();
		$('#_salesOrdImgCell'+indx).prepend('<img id="'+imgId+'" src="'+colImg+'" />');
		method="REMOVE_EXP&mapId=expDtlId&soId="+soId;
	}
	else
	{
		method="DETAIL&soId="+soId+"&index="+indx+"&imgId="+imgId+"&status="+status;
     	var im= $('#_salesOrdImgCell'+indx).find('img');
		$(im).remove();
		$('#_salesOrdImgCell'+indx).prepend('<img id="'+imgId+'" src="'+expImg+'" />');
	}
	var objAjax = new htmlAjax();
	objAjax.setActionURL("salesorder.do");
    objAjax.setActionMethod(method);
    objAjax.parameter().add("divId","_soDetlSection_"+indx);
    objAjax.setProcessHandler(SO.dDtl);
    objAjax.sendRequest();
}
SO.shOA = function(soId,imgId,rowNo,indx,expImg,colImg)
{
	//alert(soId);
	var r1 = $("#soOARow_"+soId+"_"+indx).show();
	$('#salesOrder_row_'+soId+"_"+indx).after($(r1));
	var obj = getElemnt(imgId);
	//alert(obj.src +"<----->"+expImg);
	var d = getElemnt("_soOASection_"+soId+"_"+indx);
	if (d)
	{
		d.style.visibility="visible";
		d.style.display="block";
	}
	var method='';
	if(obj && obj.src.indexOf( expImg) > 0 ) 
	{
		$("#soOARow_"+soId+"_"+indx).css("display","none");
		var im= $('#_salesOrdImgCell_'+soId+"_"+indx).find('img');
		$(im).remove();
		$('#_salesOrdImgCell_'+soId+'_'+indx).prepend('<img id="'+imgId+'" src="'+colImg+'" />');
		method="REMOVE_EXP&mapId=expOAMapId&soId="+soId+"&indx="+indx;
	}
	else
	{
		method="OA&soId="+soId+"&index="+indx+"&rowNo="+rowNo+"&imgId="+imgId;
		var im= $('#_salesOrdImgCell_'+soId+'_'+indx).find('img');
		$(im).remove();
		$('#_salesOrdImgCell_'+soId+'_'+indx).prepend('<img id="'+imgId+'" src="'+expImg+'" />');
	}
	var objAjax = new htmlAjax();
	objAjax.setActionURL("salesorder.do");
    objAjax.setActionMethod(method);
    objAjax.parameter().add("divId","_soOASection_"+soId+"_"+indx);
    objAjax.setProcessHandler(SO.dDtl);
    objAjax.sendRequest();
}


SO.eKey = function (e,secId, docView,obj)
{
	//alert("SO.keyPressSearchFunc"); 
	var key;      
     if(window.event) {
		key = window.event.keyCode; //IE
	 } else {
		key = e.which;			//firefox      
	 }
     
     if (e && e.stopPropagation) //if stopPropagation method supported
			e.stopPropagation()
		else
			event.cancelBubble=true;
     
     if(key == '13')
	 {
    	 if (obj)
    	 {
    	 	obj.onchange();
    	 }
    	 SO.search(secId, docView);
	 }
}

SO.mt = function mt()
{
	var $all = $("#_SearchSection input:text");
    //var $emptyTxt = $all.filter('[value=""]');
	//Jyothi:Start
    var $emptyTxt = $all.filter(function(index, el){ 
        return el.value == '';
    });
    //Jyothi :End
    var $allSel = $("#_SearchSection select");
    var selLen = $allSel.length;
    for (i=0; i < selLen; i++)
    {
    	if ($allSel[i].selectedIndex > 0)
    	{
    		return false;
    	}
    }
    if ($emptyTxt.length == 0) {
    	return true;            
    } else if ($all.length == $emptyTxt.length) {            
    	return true;
    } else {
    	return false;
    }

}

SO.sort = function(fieldName,sec,type, pageNo, url)
{
	//alert("fieldName:"+fieldName+"<->sec:"+sec+ "<->type:"+type+"<->pageNo:"+pageNo+"<->url:"+url);
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
	var objAjax = new htmlAjax();
	objAjax.setActionURL("salesorder.do");
    objAjax.setActionMethod("SORT&sortColumn="+fieldName+"&sort="+type+"&pageNum="+pageNo);
    objAjax.setProcessHandler(SO.pResp);
    objAjax.sendRequest();    
}

SO.rnAsn = function (cId, hdnId)
{
	cId = $("#hSoId").val();
	hdnId = $("#hId").val();
	bShowMsg = true;
	var exec = true;
	if (cId)
	{
		// if the status is 'WORK' then only allow this process to be executed
		if($("#"+hdnId).val().toUpperCase() != 'WORK')
		{
			var objAjax = new htmlAjax();
			var htmlErrors = objAjax.error();
			objAjax.error().addError("warningInfo", srnMsg, false);
			messagingDiv(htmlErrors);
			return;
		}else
		{
			var objAjax = new htmlAjax();
			objAjax.setActionURL("salesorder.do");
		    objAjax.setActionMethod("RUN_ASSIGNMENT&soId="+cId);
		    objAjax.setProcessHandler(SO.pResp);
		    objAjax.sendRequest();
		}
	}
	else
	{
		var cs='';
		$('input[name^="hR_"]').each(function() {
			
			if($(this).attr('checked'))
			{
				// if the status is 'WORK' then only allow this process to be executed
				if($("#"+$(this).attr('id')+"_h").val().toUpperCase() != 'WORK')
				{
					exec = false;
				}				
				cs+=$(this).val()+",";
			}
		});
		if (!exec)
		{
			var objAjax = new htmlAjax();
			var htmlErrors = objAjax.error();
			objAjax.error().addError("warningInfo", srnMsg, false);
			messagingDiv(htmlErrors);
			return;
		}else if (cs.length < 1)
		{
			var objAjax = new htmlAjax();
			var htmlErrors = objAjax.error();
			//Tracker#: 23299 INCORRECT MESSAGE IS DISPLAYED ON EXECUTING THE ACCEPT ORDER PROCESS
			objAjax.error().addError("warningInfo", "Please select a Sales Order Summary row to execute this process.", false);
			messagingDiv(htmlErrors);
			return;
		}
		cs = cs.substring(0, cs.length - 1);
		var objAjax = new htmlAjax();
		objAjax.setActionURL("salesorder.do");
	    objAjax.setActionMethod("RUN_ASSIGNMENT&soId="+cs);
	    objAjax.setProcessHandler(SO.pResp);
	    objAjax.sendRequest();
	}
	  
}
/**
 * For showing header processes
 */
SO.shPrcs = function (soId, hdnId,obj, keyInfo)
{
	//Tracker#: 24580 SALES ORDER PROCESS FROM MORE ACTION DROPDOWN FAILED TO WORK 
	SO.removeHiddenflds();
	var e = $("#_processmenupopup");
	var comments = new Popup("deliPopup","", e.html(),200,150,"#FFF","#FFF",obj);
	comments.show();
	var $hiddenInput1 = $('<input/>',{type:'hidden',id:'hSoId',value:soId});
	var $hiddenInput2 = $('<input/>',{type:'hidden',id:'hId',value:hdnId});
	var $hiddenInput3 = $('<input/>',{type:'hidden',id:'keyinfo',value:keyInfo});
	var $hiddenInput4 = $('<input/>',{type:'hidden',id:'imId',value:obj.id});
	$hiddenInput1.appendTo("#deliPopup");
	$hiddenInput2.appendTo("#deliPopup");
	$hiddenInput3.appendTo("#deliPopup");
	$hiddenInput4.appendTo("#deliPopup");	
}

//Tracker#: 24580 SALES ORDER PROCESS FROM MORE ACTION DROPDOWN FAILED TO WORK 
SO.removeHiddenflds=function()
{
	$("#hSoId").remove();
	$("#hId").remove();
	$("#keyinfo").remove();
	$("#imId").remove();
	$("#hAsId").remove();
	//Tracker#: 25593 FR01 - APPROVE ASSIGNMENTS AT SALES ORDER HEADER AND DETAIL LEVEL
	$("#hSoIdrwNo").remove();
	$(commentsDialog).dialog('destroy');
}

//Tracker#: 25593 FR01 - APPROVE ASSIGNMENTS AT SALES ORDER HEADER AND DETAIL LEVEL
/**
 * For showing so detail  processes
 */
SO.shDtlPrcs = function (soidRowNo,obj)
{
	SO.removeHiddenflds();
	var e = $("#_sodtlprocessmenu");
	if (e)
	{
		var comments = new Popup("deliPopup","", e.html(),100,150,"#FFF","#FFF",obj,true);
		comments.show();
		var $hiddenInput1 = $('<input/>',{type:'hidden',id:'hSoIdrwNo',value:soidRowNo});
		$hiddenInput1.appendTo("#deliPopup");
	}
}

/**
 * For showing detail  processes
 */
SO.shPrcsDtl = function (assgnId,obj)
{
	//Tracker#: 24580 SALES ORDER PROCESS FROM MORE ACTION DROPDOWN FAILED TO WORK 
	SO.removeHiddenflds();
	var e = $("#_dtlprocessmenu");
	if (e)
	{
		var comments = new Popup("deliPopup","", e.html(),90,170,"#FFF","#FFF",obj,true);
		comments.show();
		var $hiddenInput1 = $('<input/>',{type:'hidden',id:'hAsId',value:assgnId});
		$hiddenInput1.appendTo("#deliPopup");
	}
}

SO.save = function ()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objdata = htmlAreaObj.getHTMLDataObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	
	if(objdata!=null && objdata.hasUserModifiedData()==true)
    {
		//objdata.setAppendContainerData(true);
		bShowMsg = true;
		objAjax.setActionURL("salesorder.do");
		objAjax.setActionMethod("save");
		objAjax.setProcessHandler(SO.pResp);
		objdata.performSaveChanges(SO.pResp,objAjax);  
		objdata.resetChangeFields();
    }
    else
    {
    	var objAjax = new htmlAjax();
    	objAjax.error().addError("warningInfo", szMsg_No_change, false);
    	_displayProcessMessage(objAjax);
       // _displayUserMessage(szMsg_No_change);
    }	
	
}

SO.saveoVERVIEW = function ()
{
	
	
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objdata = htmlAreaObj.getHTMLDataObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	
	if(objdata!=null && objdata.hasUserModifiedData()==true)
    {
		//objdata.setAppendContainerData(true);
		bShowMsg = true;
		objAjax.setActionURL("salesorderentryoverview.do");
		objAjax.setActionMethod("save");
		objAjax.setProcessHandler(_defaultWorkAreaSave_scroll);
		objdata.performSaveChanges(_defaultWorkAreaSave_scroll);  
		// objHtmlData.performSaveChanges(_defaultWorkAreaSave_scroll);
		objdata.resetChangeFields();
    }
    else
    {
    	var objAjax = new htmlAjax();
    	objAjax.error().addError("warningInfo", szMsg_No_change, false);
    	_displayProcessMessage(objAjax);
       // _displayUserMessage(szMsg_No_change);
    }	
	
}

SO.savedETAIL= function ()
{
	
	
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objdata = htmlAreaObj.getHTMLDataObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	
	if(objdata!=null && objdata.hasUserModifiedData()==true)
    {
		//objdata.setAppendContainerData(true);
		bShowMsg = true;
		objAjax.setActionURL("salesorderentrydetailview.do");
		objAjax.setActionMethod("save");
		objAjax.setProcessHandler(_defaultWorkAreaSave_scroll);
		objdata.performSaveChanges(_defaultWorkAreaSave_scroll);  
		// objHtmlData.performSaveChanges(_defaultWorkAreaSave_scroll);
		//objdata.resetChangeFields();
    }
    else
    {
    	var objAjax = new htmlAjax();
    	objAjax.error().addError("warningInfo", szMsg_No_change, false);
    	_displayProcessMessage(objAjax);
       // _displayUserMessage(szMsg_No_change);
    }	
	
}

SO.AO = function (cId)
{
	cId = $("#hSoId").val();
	bShowMsg = true;
	if (cId)
	{
		var objAjax = new htmlAjax();
		objAjax.setActionURL("salesorder.do");
	    objAjax.setActionMethod("ACCEPT_SALES_ORDER&soId="+cId);
	    objAjax.setProcessHandler(SO.pResp);
	    objAjax.sendRequest();
	}
	else
	{
		var cs='';
		$('input[name^="hR_"]').each(function() {
			
			if($(this).attr('checked'))
			{
				cs+=$(this).val()+",";
			}
		});
		cs = cs.substring(0, cs.length - 1);
		if(cs.length < 1)
		{
			var objAjax = new htmlAjax();
			var htmlErrors = objAjax.error();
			//Tracker#: 23299 INCORRECT MESSAGE IS DISPLAYED ON EXECUTING THE ACCEPT ORDER PROCESS
			objAjax.error().addError("warningInfo", "Please select a Sales Order Summary row to execute this process.", false);
			messagingDiv(htmlErrors);
			return;
		}
		var objAjax = new htmlAjax();
		objAjax.setActionURL("salesorder.do");
	    objAjax.setActionMethod("ACCEPT_SALES_ORDER&soId="+cs);
	    objAjax.setProcessHandler(SO.pResp);
	    objAjax.sendRequest();
	}
	  
}

SO.ACCEPT = function ()
{
	
		
	
	  
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objdata = htmlAreaObj.getHTMLDataObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	 
	if(objdata!=null )
    {
		
		bShowMsg = true;
		objAjax.setActionURL("salesorderentryoverview.do");
	    objAjax.setActionMethod("SALES_ORDER_ACCEPT");
		objAjax.setProcessHandler(_defaultWorkAreaSave_scroll);
		objAjax.sendRequest();
		//objdata.performSaveChanges(_defaultWorkAreaSave_scroll);  
		// objHtmlData.performSaveChanges(_defaultWorkAreaSave_scroll);
		objdata.resetChangeFields();

	}


}



SO.RO = function (cId)
{
	cId = $("#hSoId").val();
	bShowMsg = true;
	if (cId)
	{
		var objAjax = new htmlAjax();
		objAjax.setActionURL("salesorder.do");
	    objAjax.setActionMethod("REJECT_SALES_ORDER&soId="+cId);
	    objAjax.setProcessHandler(SO.pResp);
	    objAjax.sendRequest();
	}
	else
	{
		var cs='';
		$('input[name^="hR_"]').each(function() {
			
			if($(this).attr('checked'))
			{
				cs+=$(this).val()+",";
			}
		});
		cs = cs.substring(0, cs.length - 1);
		if(cs.length < 1)
		{
			var objAjax = new htmlAjax();
			var htmlErrors = objAjax.error();
			//Tracker#: 23299 INCORRECT MESSAGE IS DISPLAYED ON EXECUTING THE ACCEPT ORDER PROCESS
			objAjax.error().addError("warningInfo", "Please select a Sales Order Summary row to execute this process.", false);
			messagingDiv(htmlErrors);
			return;
		}
		var objAjax = new htmlAjax();
		objAjax.setActionURL("salesorder.do");
	    objAjax.setActionMethod("REJECT_SALES_ORDER&soId="+cs);
	    objAjax.setProcessHandler(SO.pResp);
	    objAjax.sendRequest();
	} 
}
//Tracker#: 25594 FR02 - DELETE ASSIGNMENTS PROCESS AT SALES ORDER HEADER AND DETAIL LEVEL
//Modified the function to execute the process at header,detail and assignment level.
SO.OADel = function (cId)
{
	if($("#hAsId").val())
	{
		cId = $("#hAsId").val();
	}
	else if($("#hSoId").val())
	{
		cId = $("#hSoId").val();
	}
	else if($("#hSoIdrwNo").val())
	{
		cId = $("#hSoIdrwNo").val();
	}
	bShowMsg = true;
	var objAjax = new htmlAjax();
	var htmlErrors = objAjax.error();
	//Tracker#: 23299 INCORRECT MESSAGE IS DISPLAYED ON EXECUTING THE ACCEPT ORDER PROCESS
	var msg = "Are you sure you would like to remove the selected Assignment(s)?  This operation cannot be undone.";
	htmlErrors.addError("confirmInfo", msg,  false);
	if(cId)
	{
		messagingDiv(htmlErrors, "SO.OADelete('"+cId+"')","SO.cancel()");
	}else
	{
		var objAjax = new htmlAjax();
		var allLevelChecked = false;
		var cs= SO.getSelectedRecords('oaR_');
		
		var cshdr=SO.getSelectedRecords('hR_');
		if(cs.length > 0 && cshdr.length > 0)
			allLevelChecked=true;
		
		var csdtl=SO.getSelectedRecords('dR_');
		if((csdtl.length > 0) && (cs.length > 0 || cshdr.length > 0))
			allLevelChecked=true;
		
		if(cs.length < 1 && cshdr.length < 1 && csdtl.length < 1)
		{
			var htmlErrors = objAjax.error();
			//Tracker#: 23299 INCORRECT MESSAGE IS DISPLAYED ON EXECUTING THE ACCEPT ORDER PROCESS
			objAjax.error().addError("warningInfo", "Please select either Sales Order Summary, Sales Order Detail or Vendor Order Assignment row to execute this process.", false);
			messagingDiv(htmlErrors);
			return;
		}
		
		if(allLevelChecked)
		{
			var htmlErrors = objAjax.error();
			objAjax.error().addError("warningInfo", "Process not complete.  Please select data at either Sales Order Summary, Sales Order Detail or Vendor Order Assignment level and run process again.", false);
			messagingDiv(htmlErrors);
			return;
		}
		
		messagingDiv(htmlErrors, "SO.OADelete()","SO.cancel()");
	}
	return;
}
//Tracker#: 25594 FR02 - DELETE ASSIGNMENTS PROCESS AT SALES ORDER HEADER AND DETAIL LEVEL
SO.OADelete = function (cId)
{
	var actionMethod = "DELETE_ORDER_ASSIGNMENT";
	bShowMsg = true;
	if($("#hAsId").val())
	{
		cId = $("#hAsId").val();
		actionMethod=actionMethod+"&assnId="+cId;
	}
	else if($("#hSoId").val())
	{
		cId = $("#hSoId").val();
		actionMethod=actionMethod+"&soId="+cId;
	}
	else if($("#hSoIdrwNo").val())
	{
		cId = $("#hSoIdrwNo").val();
		actionMethod=actionMethod+"&soIdrowno="+cId;
	}
	
	if (cId)
	{
		var objAjax = new htmlAjax();
		objAjax.setActionURL("salesorder.do");
	    objAjax.setActionMethod(actionMethod);
	    objAjax.setProcessHandler(SO.pResp);
	    objAjax.sendRequest();
	}
	else
	{
		var cs= SO.getSelectedRecords('oaR_');
		cs = cs.substring(0, cs.length - 1);
		
		var cshdr=SO.getSelectedRecords('hR_');
		cshdr = cshdr.substring(0, cshdr.length - 1);
		
		var csdtl=SO.getSelectedRecords('dR_');
		csdtl = csdtl.substring(0, csdtl.length - 1);
		
		if(cs.length > 0)
		{
			actionMethod=actionMethod+"&assnId="+cs;	
		}
		if(cshdr.length > 0)
		{
			actionMethod=actionMethod+"&soId="+cshdr;	
		}
		if(csdtl.length > 0)
		{
			actionMethod=actionMethod+"&soIdrowno="+csdtl;
		}
		
		var objAjax = new htmlAjax();
		objAjax.setActionURL("salesorder.do");
	    objAjax.setActionMethod(actionMethod);
	    objAjax.setProcessHandler(SO.pResp);
	    objAjax.sendRequest();
	}	  
}

SO.cancel = function (){
	closeMsgBox();
}

//Tracker#: 25593 FR01 - APPROVE ASSIGNMENTS AT SALES ORDER HEADER AND DETAIL LEVEL
//Modified the function to execute Approve process at Sales Order header and detail level.
SO.OAAprv = function (cId)
{
	var actionMethod = "APPROVE_ORDER_ASSIGNMENT";
	bShowMsg = true;
	
	if($("#hAsId").val())
	{
		cId = $("#hAsId").val();
		actionMethod=actionMethod+"&assnId="+cId;
	}
	else if($("#hSoId").val())
	{
		cId = $("#hSoId").val();
		actionMethod=actionMethod+"&soId="+cId;
	}
	else if($("#hSoIdrwNo").val())
	{
		cId = $("#hSoIdrwNo").val();
		actionMethod=actionMethod+"&soIdrowno="+cId;
	}
	
	if (cId)
	{
		var objAjax = new htmlAjax();
		objAjax.setActionURL("salesorder.do");
	    objAjax.setActionMethod(actionMethod);
	    objAjax.setProcessHandler(SO.pResp);
	    objAjax.sendRequest();
	}
	else
	{
		var allLevelChecked = false;
		var cs= SO.getSelectedRecords('oaR_');
		cs = cs.substring(0, cs.length - 1);
		
		var cshdr=SO.getSelectedRecords('hR_');
		cshdr = cshdr.substring(0, cshdr.length - 1);
		if(cs.length > 0 && cshdr.length > 0)
			allLevelChecked=true;
		
		var csdtl=SO.getSelectedRecords('dR_');
		csdtl = csdtl.substring(0, csdtl.length - 1);
		if((csdtl.length > 0) && (cs.length > 0 || cshdr.length > 0))
			allLevelChecked=true;
		
		var objAjax = new htmlAjax();
		if(cs.length < 1 && cshdr.length < 1 && csdtl.length < 1)
		{
			
			var htmlErrors = objAjax.error();
			//Tracker#: 23299 INCORRECT MESSAGE IS DISPLAYED ON EXECUTING THE ACCEPT ORDER PROCESS
			objAjax.error().addError("warningInfo", "Please select either Sales Order Summary, Sales Order Detail or Vendor Order Assignment row to execute this process.", false);
			messagingDiv(htmlErrors);
			return;
		}
		
		
		if(allLevelChecked)
		{
			var htmlErrors = objAjax.error();
			objAjax.error().addError("warningInfo", "Process not complete.  Please select data at either Sales Order Summary, Sales Order Detail or Vendor Order Assignment level and run process again.", false);
			messagingDiv(htmlErrors);
			return;
		}
		
		if(cs.length > 0)
		{
			actionMethod=actionMethod+"&assnId="+cs;	
		}
		if(cshdr.length > 0)
		{
			actionMethod=actionMethod+"&soId="+cshdr;	
		}
		if(csdtl.length > 0)
		{
			actionMethod=actionMethod+"&soIdrowno="+csdtl;
		}
		
		objAjax.setActionURL("salesorder.do");
	    objAjax.setActionMethod(actionMethod);
	    objAjax.setProcessHandler(SO.pResp);
	    objAjax.sendRequest();
	}
	  
}

SO.getSelectedRecords = function(fldname)
{
	var cs='';
	$('input[name^='+fldname+']').each(function() {
		
		if($(this).attr('checked'))
		{
			cs+=$(this).val()+",";
		}
	});
	
	return cs;
}

//Tracker#: 25599 FR03 - ADD CANCEL ORDER PROCESS
SO.CCLOrder = function (cId)
{
	if($("#hSoId").val())
	{
		cId = $("#hSoId").val();
	}
	else if($("#hSoIdrwNo").val())
	{
		cId = $("#hSoIdrwNo").val();
	}
	bShowMsg = true;
	var objAjax = new htmlAjax();
	var htmlErrors = objAjax.error();
	var msg = "Are you sure you would like to CANCEL the Order (rows)?  The process removes the quantity and assignments.  This operation cannot be undone.";
	htmlErrors.addError("confirmInfo", msg,  false);
	if(cId)
	{
		messagingDiv(htmlErrors, "SO.ORDCancel('"+cId+"')","SO.cancel()");
	}
	else
	{
		var objAjax = new htmlAjax();
		var allLevelChecked = false;
		
		var cshdr=SO.getSelectedRecords('hR_');
		
		var csdtl=SO.getSelectedRecords('dR_');
		if(csdtl.length > 0 &&  cshdr.length > 0)
			allLevelChecked=true;
		
		if(cshdr.length < 1 && csdtl.length < 1)
		{
			var htmlErrors = objAjax.error();
			objAjax.error().addError("warningInfo", "Please select either Sales Order Summary or Sales Order Detail row to execute this process.", false);
			messagingDiv(htmlErrors);
			return;
		}
		
		if(allLevelChecked)
		{
			var htmlErrors = objAjax.error();
			objAjax.error().addError("warningInfo", "Process not complete.  Please select data at either Sales Order Summary or Sales Order Detail level and run process again.", false);
			messagingDiv(htmlErrors);
			return;
		}
		
		messagingDiv(htmlErrors, "SO.ORDCancel()","SO.cancel()");
	}
	return;
}
//Tracker#: 25599 FR03 - ADD CANCEL ORDER PROCESS
SO.ORDCancel = function (cId)
{
	var actionMethod = "CANCEL_SALES_ORDER";
	bShowMsg = true;
	if($("#hSoId").val())
	{
		cId = $("#hSoId").val();
		actionMethod=actionMethod+"&soId="+cId;
	}
	else if($("#hSoIdrwNo").val())
	{
		cId = $("#hSoIdrwNo").val();
		actionMethod=actionMethod+"&soIdrowno="+cId;
	}
	
	if (cId)
	{
		var objAjax = new htmlAjax();
		objAjax.setActionURL("salesorder.do");
	    objAjax.setActionMethod(actionMethod);
	    objAjax.setProcessHandler(SO.pResp);
	    objAjax.sendRequest();
	}
	else
	{
				
		var cshdr=SO.getSelectedRecords('hR_');
		cshdr = cshdr.substring(0, cshdr.length - 1);
		
		var csdtl=SO.getSelectedRecords('dR_');
		csdtl = csdtl.substring(0, csdtl.length - 1);
		
		if(cshdr.length > 0)
		{
			actionMethod=actionMethod+"&soId="+cshdr;	
		}
		if(csdtl.length > 0)
		{
			actionMethod=actionMethod+"&soIdrowno="+csdtl;
		}
		
		var objAjax = new htmlAjax();
		objAjax.setActionURL("salesorder.do");
	    objAjax.setActionMethod(actionMethod);
	    objAjax.setProcessHandler(SO.pResp);
	    objAjax.sendRequest();
	}	  
}

//Tracker#: 23030 DELIVERY DATES POPUP UNDER SALES ORDER HEADER LEVEL
SO.showDeliveryDate = function(htmlfldName, keyvaluepair)
{
	if(keyvaluepair)
	{
	    var actMethod = "showDeliveryDate&keyValue="+keyvaluepair;
	    var htmlAreaObj = _getWorkAreaDefaultObj();
	    var objAjax = htmlAreaObj.getHTMLAjax();
	    if(objAjax)
	    {
	    	//passing the value for parameter invokeCompOnFocus.
	        _startSmartTagPopup(htmlfldName, false, null, false, false);
	        bShowMsg = true;
	        objAjax.setActionURL("salesorder.do");
	        objAjax.setActionMethod(actMethod);
	        objAjax.attribute().setAttribute("htmlfldName", htmlfldName);
	        objAjax.setProcessHandler(showDeliveryDatePopup);
	        objAjax.showProcessingBar(false);
	        objAjax.sendRequest();
	    }
	}
}
//Tracker#: 23961 FR06 EXTEND EXISTING SALES ORDER ASSIGNMENT SCREEN WITH FIELDS AND ASSOCIATION SMART TAGS
SO.showDtlDeliveryDate = function(htmlfldName, keyvaluepair, level)
{
	if(keyvaluepair)
	{
	    var actMethod = "showDeliveryDate&keyValue="+keyvaluepair+"&level="+level;
	    var htmlAreaObj = _getWorkAreaDefaultObj();
	    var objAjax = htmlAreaObj.getHTMLAjax();
	    if(objAjax)
	    {
	    	//passing the value for parameter invokeCompOnFocus.
	        _startSmartTagPopup(htmlfldName, false, null, false, false);
	        bShowMsg = true;
	        objAjax.setActionURL("salesorder.do");
	        objAjax.setActionMethod(actMethod);
	        objAjax.attribute().setAttribute("htmlfldName", htmlfldName);
	        objAjax.setProcessHandler(showDeliveryDatePopup);
	        objAjax.showProcessingBar(false);
	        objAjax.sendRequest();
	    }
	}
}

//Tracker#: 23033 DATES POPUP AT THE VENDOR ORDER ASSIGNMENT LEVEL
SO.showOrderDate = function(htmlfldName, keyvaluepair)
{
	if(keyvaluepair)
	{
	    var actMethod = "showOrderDate&keyValue="+keyvaluepair;
	    var htmlAreaObj = _getWorkAreaDefaultObj();
	    var objAjax = htmlAreaObj.getHTMLAjax();
	    if(objAjax)
	    {
	    	//passing the value for parameter invokeCompOnFocus.
	        _startSmartTagPopup(htmlfldName, false, null, false, false);
	        bShowMsg = true;
	        objAjax.setActionURL("salesorder.do");
	        objAjax.setActionMethod(actMethod);
	        objAjax.attribute().setAttribute("htmlfldName", htmlfldName);
	        objAjax.setProcessHandler(showDeliveryDatePopup);
	        objAjax.showProcessingBar(false);
	        objAjax.sendRequest();
	    }
	}
}

function showDeliveryDatePopup(objAjax)
{
	if(objAjax)
	{
	    _displayProcessMessage(objAjax);
	    if(!objAjax.isProcessComplete())
	    {
	        _closeSmartTag();
	    }
	    else
	    {
    	  	objAjax.attribute().setAttribute("htmlfldOnFocus", "0");
	        var popUpDiv = _showSmartTagPopup(objAjax);
	        //Tracker#: 23034
	        //To dispaly the popup in center of the page and make it draggable if the html element is not loaded.
	        if(!document.getElementById(objAjax.attribute().getAttribute("htmlfldName")))
        	{
        		positionPageCenter(popUpDiv);
        		draggable = $(popUpDiv).draggable();
        	}
	        //Tracker#: 22893 
	        //Set the Pupup height if it is greater than 450px. and provided the vertical scrool bar.
	        var childDiv = $(popUpDiv).children("div").get(0);
	        if($(childDiv) && $(childDiv).height() > 450)
        	{
	        	//Tracker#: 23675 OPEN FIELD IN ATP SMART TAG IS NOT DISPLAYED COMPLETELY
	        	//set the width to display the open field completely when horzontal scroll bar displays.
	        	var width = $(childDiv).width()+15;
	        	var subDiv = $(childDiv).find("DIV").get(0);
	        	var divStyle = $(subDiv).attr('style')+';height: 450px;overflow-y:auto;width: '+width+'px;';
	        	$(subDiv).attr('style',divStyle);
        	}
		        
	    }
	}
}

//Tracker#: 23032 DC ALLOC POPUP AT THE SALES ORDER DETAIL LEVEL
SO.showDCAlloc = function(htmlfldName, keyvaluepair)
{
	if(keyvaluepair)
	{
	    var actMethod = "showDCAlloc&keyValue="+keyvaluepair;
	    var htmlAreaObj = _getWorkAreaDefaultObj();
	    var objAjax = htmlAreaObj.getHTMLAjax();
	    if(objAjax)
	    {
	    	//passing the value for parameter invokeCompOnFocus.
	        _startSmartTagPopup(htmlfldName, false, null, false, false);
	        bShowMsg = true;
	        objAjax.setActionURL("salesorder.do");
	        objAjax.setActionMethod(actMethod);
	        objAjax.attribute().setAttribute("htmlfldName", htmlfldName);
	        objAjax.setProcessHandler(showDeliveryDatePopup);
	        objAjax.showProcessingBar(false);
	        objAjax.sendRequest();
	    }
	}
}

//Tracker#: 23034 ATP POPUP AT THE VENDOR ORDER ASSIGNMENT LEVEL
SO.showATP = function(htmlfldName, keyvalue)
{
	if(keyvalue)
	{
		//alert(htmlfldName);
	    var actMethod = "showATP&keyValue="+keyvalue+"&fldName="+htmlfldName;
	    var htmlAreaObj = _getWorkAreaDefaultObj();
	    var objAjax = htmlAreaObj.getHTMLAjax();
	    var objHTMLData = htmlAreaObj.getHTMLDataObj();
	    if(objAjax)
	    {
	    	//passing the value for parameter invokeCompOnFocus.
	        _startSmartTagPopup(htmlfldName, false, null, false, false);
	        bShowMsg = true;
	        objAjax.setActionURL("salesorder.do");
	        objAjax.setActionMethod(actMethod);
	        objAjax.attribute().setAttribute("htmlfldName", htmlfldName);
	        //Tracker#: 24423 NOT ABLE TO PERFORM ANY ACTION ONCE VERTICAL SCROLL BAR IS USED IN ATP SMART TAG
	        objAjax.setProcessHandler(SO.showAtpPopup);
	        objAjax.showProcessingBar(false);
	        objAjax.sendRequest();
	        if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==true)
		    {
		    	objHTMLData.resetChangeFields();
		    }
	    }
	}
}

//Tracker#: 24423 NOT ABLE TO PERFORM ANY ACTION ONCE VERTICAL SCROLL BAR IS USED IN ATP SMART TAG
SO.showAtpPopup = function(objAjax)
{
	if(objAjax)
	{
	    _displayProcessMessage(objAjax);
	    if(!objAjax.isProcessComplete())
	    {
	        _closeSmartTag();
	    }
	    else
	    {
    	  	objAjax.attribute().setAttribute("htmlfldOnFocus", "0");
	        var popUpDiv = _showSmartTagPopup(objAjax);
	        if(!document.getElementById(objAjax.attribute().getAttribute("htmlfldName")))
        	{
        		positionPageCenter(popUpDiv);
        		draggable = $(popUpDiv).draggable();
        	}
	        
	    }
	}
}


SO.enableATPPopDrag = function(div)
{
	//Tracker#:24557 REGRESSION:  SALES ORDER - ATP SMART TAG IS NO OPENING WHEN THERE ARE MANY SALES ORDER DETAIL LINES
	//Set the Pupup height if it is greater than 450px. and provided the vertical scrool bar.
	var childDiv = $("#_smartDiv").children("div").get(0);
    if($(childDiv) && $(childDiv).height() > 450)
	{
    	//Tracker#: 23675 OPEN FIELD IN ATP SMART TAG IS NOT DISPLAYED COMPLETELY
    	//set the width to display the open field completely when horzontal scroll bar displays.
    	var width = $(childDiv).width()+15;
    	var subDiv = $(childDiv).find("DIV").get(0);
    	var astyle = $(subDiv).attr('style');
    	var divStyle= '';
    	if(astyle!=null && astyle !='')
		{
			divStyle = divStyle+';height: 450px;overflow-y:auto;width: '+width+'px;';
		}
    	else
		{
			divStyle = divStyle+'height: 450px;overflow-y:auto;width: '+width+'px;';
		}
    	$(subDiv).attr('style',divStyle);
	}
    
	var divObj = getElemnt(div);
	if(divObj)
	{
		draggable.draggable( "destroy" );
		$(divObj).hover(function(){
			var divId = "#_smartDiv";
		    draggable = $(divId).draggable();},
		    function(){
		    	draggable.draggable( "destroy" );
		    });
		
	}
}


//Tracker#: 23034 ATP POPUP AT THE VENDOR ORDER ASSIGNMENT LEVEL
SO.closeATP = function()
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
    
    if(htmlAreaObj)
    {
    	var objHTMLData =  _getAreaHTMLDataObjByDocView("9205");;
    	
    	if(objHTMLData)
    	{
        	objHTMLData.resetChangeFields();	
    	} 
    }
    _closeSmartTag();
}
//Tracker#: 23034 ATP POPUP AT THE VENDOR ORDER ASSIGNMENT LEVEL
SO.saveATP = function()
{
	
 	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = _getAreaHTMLDataObjByDocView("9205");
    var actMethod = "saveATP";
    if(objAjax)
   	{
    	//alert(objAjax.attribute().getAttribute("htmlfldName"));
    	 if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==true)
    	    {
    		 	bShowMsg = true;
    	        //perform save operation
    		 	objAjax.setActionURL("salesorder.do");
    		 	objAjax.setActionMethod(actMethod);
    		 	objAjax.setProcessHandler(SO.atpResp);
    		 	objHTMLData.performSaveChanges(SO.atpResp,objAjax);
    		 	
    		 	objHTMLData.resetChangeFields();
    	    }
    	    else
    	    {
    	    	objAjax.error().addError("warningInfo", szMsg_No_change, false);
    	    	_displayProcessMessage(objAjax);
    	    }
    }

}

SO.atpResp =function(objAjax)
{
	if(objAjax)
	{
		if(objAjax.isProcessComplete())
		{
			$("#MainSection_divCollapsable").html(objAjax.getResult());
		}
		if(bShowMsg==true)
	   	{
	   		msgInfo = objAjax.getAllProcessMessages();
		    if(msgInfo!="")
		    {
		        _displayProcessMessage(objAjax);
		    }
	   	}
		
	}
	
	 var respCall = objAjax.getResponseHeader("RESP");
	 //alert(respCall);
	 eval(respCall);
	 var htmlAreaObj = _getWorkAreaDefaultObj();	
	 var objdata = htmlAreaObj.getHTMLDataObj();
	 //objdata.resetChangeFields();
	 SO.closeATP();
	 respCall = objAjax.getResponseHeader("ATPRESP");
	 eval(respCall);
	
	 objAjax = null;
}

//Tracker#: 22941 PROVIDE USER INTERFACE TO MANUALLY ASSIGN SALES ORDERED ITEMS TO VENDOR ORDER ITEMS AND ASSIGN
var fldDelim = "@,";
var salesOrderNew = new QSearchChangeFields();
//Called when user clicks on the Quick search icon
SO.newSearch = function(compId, soIdrowNo, statIndx)
{
	var id = 'hR_'+statIndx+'_h';
	//Tracker#: 23962 FR07 EXTEND MANUAL ASSIGNMENT CAPABILITY TO INCLUDE THE ABILITY TO MASS ASSIGN MULTIPLE SALES ORDER
	var count=0;
	$('input[name^="dR_"]').each(function() {
		
		if($(this).attr('checked'))
		{
			count++;
		}
	});
	if(count > 1)
	{
		var objAjax = new htmlAjax();
		var htmlErrors = objAjax.error();
		objAjax.error().addError("warningInfo", szMsg_Sel_More_So_Order_Row , false);
		messagingDiv(htmlErrors);
		return;
	}
	
	// if the header status is 'WORK' then only allow this process to be executed
	//if($("#"+id).val().toUpperCase() != 'WORK')
	//Tracker#: 25609 FR11 ASSIGNMENT PROCESS ALSO SHOULD BE ENABLED IF THE STATUS OF THE SO HEADER IS IN ASSIGNED OR APPR
	//Allow the process to execute if the header status is also in 'WORK,APPROVED,REVISED or ASSIGN'
	var hdrStatsVal = '';
	hdrStatsVal=$("#"+id).val().toUpperCase();
	if(hdrStatsVal != 'WORK' && hdrStatsVal != 'APPROVED' && hdrStatsVal != 'REVISED' && hdrStatsVal != 'ASSIGN')
	{
		var objAjax = new htmlAjax();
		var htmlErrors = objAjax.error();
		objAjax.error().addError("warningInfo", snewrnMsg, false);
		messagingDiv(htmlErrors);
		return;
	}
	
	salesOrderNew.resetChngFlds();
	if(compId)
	{
	    var htmlAreaObj = _getWorkAreaDefaultObj();
	    var objAjax = htmlAreaObj.getHTMLAjax();
	    if(objAjax)
	    {
	    	//passing the value for parameter invokeCompOnFocus.
	        _startSmartTagPopup(compId, false, true, false, false);
	        objAjax.attribute().setAttribute("htmlfldName", compId);
	        SO.callAction("shownewsearch&nsrchName=salesOrderNew&soIdrowNo="+soIdrowNo+"","SO.newSrchResponse");	
	    }
	}
	
}

SO.newSrchResponse = function(objAjax)
{
	if(objAjax)
	{
	    _displayProcessMessage(objAjax);
	    if(!objAjax.isProcessComplete())
	    {
	        _closeSmartTag();
	    }
	    else
	    {
	        objAjax.attribute().setAttribute("htmlfldOnFocus", "0");
	        var popUpDiv = _showSmartTagPopup(objAjax);
	    }
	}
}

//Tracker#: 24818 SALES ORDER - MANUAL SEARCH FOR VENDORS DOES NOT SEARCH UNLESS YOU TAB OUT OF FIELD
SO.enableOSPopDrag = function(div)
{
	var divObj = getElemnt(div);
	if(divObj)
	{
		draggable.draggable( "destroy" );
		$(divObj).hover(function(){
			var divId = "#_smartDiv";
			//Tracker#: 25888
			//added the option handle.
		    draggable = $(divId).draggable({handle: divObj});},
		    function(){
		    	//Commented as this throws an exception when mouse event is called.
		    	//draggable.draggable( "destroy" );
		    });

	}
}

//Tracker#: 23962 FR07 EXTEND MANUAL ASSIGNMENT CAPABILITY TO INCLUDE THE ABILITY TO MASS ASSIGN MULTIPLE SALES ORDER
SO.newAssign = function ()
{
	var statusId = new Array();
	bShowMsg = true;
	//Tracker#: 25609 FR11 ASSIGNMENT PROCESS ALSO SHOULD BE ENABLED IF THE STATUS OF THE SO HEADER IS IN ASSIGNED OR APPR
	var hdrStatsVal = '';
	var cs='';
	$('input[name^="dR_"]').each(function() {
		
		var id = $(this).attr('id');
		var hdrstatusindx = id.substring(id.indexOf('$')+1);
		if($(this).attr('checked'))
		{
			cs+=$(this).val()+",";
			//Tracker#: 25609 FR11 ASSIGNMENT PROCESS ALSO SHOULD BE ENABLED IF THE STATUS OF THE SO HEADER IS IN ASSIGNED OR APPR
			//check header status is in 'WORK','APPROVED','REVISED' or 'ASSIGN' status
			hdrStatsVal=$("#"+hdrstatusindx).val().toUpperCase();
			if(hdrStatsVal != 'WORK' && hdrStatsVal != 'APPROVED' && hdrStatsVal != 'REVISED' && hdrStatsVal != 'ASSIGN')
			{
				statusId[statusId.length]=hdrstatusindx;
			}
		}
	});
	cs = cs.substring(0, cs.length - 1);
	if(cs.length < 1)
	{
		var objAjax = new htmlAjax();
		var htmlErrors = objAjax.error();
		objAjax.error().addError("warningInfo",szMsg_Sel_A_So_Order_dtl_Row , false);
		messagingDiv(htmlErrors);
		return;
	}
	
	if(statusId.length>0)
	{
		var objAjax = new htmlAjax();
		var htmlErrors = objAjax.error();
		//Tracker#: 25609 FR11 ASSIGNMENT PROCESS ALSO SHOULD BE ENABLED IF THE STATUS OF THE SO HEADER IS IN ASSIGNED OR APPR
		objAjax.error().addError("warningInfo", snewrnMsg, false);
		messagingDiv(htmlErrors);
		return;
	}
	salesOrderNew.resetChngFlds();
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    if(objAjax)
    {
    	var htmlfldName = htmlAreaObj.getDivSectionId();
    	//passing the value for parameter invokeCompOnFocus.
        _startSmartTagPopup(htmlfldName, false, true, false, false);
        //objAjax.attribute().setAttribute("htmlfldName", compId);
        SO.callAction("shownewsearch&&nsrchName=salesOrderNew&soIdrowNo="+cs+"&multiassign="+1+"","SO.newSrchResponse");	
    }
	  
}

//The method which makes an ajax call
SO.callAction = function(actionMethod,processHndlr)
{
	objAjax = new htmlAjax();
	objAjax.setActionURL("salesorder.do");
	objAjax.setActionMethod(actionMethod);
	objAjax.setProcessHandler(processHndlr);
	objAjax.sendRequest();
}

SO.Search = function(section)
{
	var val = salesOrderNew.qsChngFldsNVal;
	var oprs = salesOrderNew.qsChngFldsOpr;
	var chFlds = salesOrderNew.qsChngFlds;
	var msg = "Please select search operator(s).";
	var noSearchMsg = "Please select search criteria.";

	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objHtmlData = _getAreaHTMLDataObjByDocView("334");
   	var objAjax = htmlAreaObj.getHTMLAjax();
	objAjax.setActionURL("salesorder.do");
	objAjax.setActionMethod("orderSearch");
	objAjax.setProcessHandler(SO.reloadSearchList);

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
	bShowMsg = true;
	objHtmlData._mHasUserModifiedData =true;
	objHtmlData.performSaveChanges(SO.reloadSearchList,objAjax);
}

SO.reloadSearchList = function(objAjax)
{
	if(objAjax)
	{
		//alert(objAjax.getResult());
		if(objAjax.isProcessComplete())
		{
			$("#ORDER_SEARCH_LIST").html(objAjax.getResult());
		}
		if(bShowMsg==true)
	   	{
	   		msgInfo = objAjax.getAllProcessMessages();
		    if(msgInfo!="")
		    {
		        _displayProcessMessage(objAjax);
		    }
	   	}
		
	}
	
 	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objdata =_getAreaHTMLDataObjByDocView("334");
	objdata.resetChangeFields();
	objAjax = null;
}

SO.Assign = function(section)
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objHTMLData = _getAreaHTMLDataObjByDocView("334");
   	var objAjax = htmlAreaObj.getHTMLAjax();
   	var assignType = document.getElementById('assignType');
   	if(objAjax)
   	{
   		//Tracker#: 23962 FR07 EXTEND MANUAL ASSIGNMENT CAPABILITY TO INCLUDE THE ABILITY TO MASS ASSIGN MULTIPLE SALES ORDER
   		if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==true)
	    {
	   		var chgFlds = objHTMLData.getChangeFields();
	   		if(chgFlds && chgFlds.length>0 && assignType.value==1)
	        {
	        	  count = 0;
	            for (num = 0; num < chgFlds.length; num++)
	            {
	               	var obj = chgFlds[num];
	               	valobj = document.getElementById(obj);
	               	if(valobj!=null && valobj.type && valobj.type=='checkbox')
	  			    {
	  			     	count++;
	  			    }
	            }
	            if(count > 1)
	            {
	            	 var htmlErrors = objAjax.error();
	             	 objAjax.error().addError("warningInfo", szMsg_Sel_A_Order_Row, false);
	            	 messagingDiv(htmlErrors);
	            	 unCheck(objHTMLData);
	            	 objHTMLData.resetChangeFields();
	            	 return;
	            }
	        }
		
		 	bShowMsg = true;
	        //perform save operation
		 	objAjax.setActionURL("salesorder.do");
		 	objAjax.setActionMethod("assignOrderNew");
		 	objAjax.setProcessHandler(SO.assignOrderProcess);
		 	objAjax.parameter().add("chgflds", objHTMLData.getChangeFields());
		 	objHTMLData.performSaveChanges(SO.assignOrderProcess,objAjax);
		 	
		 	objHTMLData.resetChangeFields();
	    }
	    else
	    {
	    	objAjax.error().addError("warningInfo", szMsg_No_change, false);
	    	_displayProcessMessage(objAjax);
	    }
    }
}

SO.assignOrderProcess = function(objAjax)
{
    
    _closeSmartTag();
    
	if(objAjax)
	{
		if(objAjax.isProcessComplete())
		{
			$("#MainSection_divCollapsable").html(objAjax.getResult());
		}
		if(bShowMsg==true)
	   	{
	   		msgInfo = objAjax.getAllProcessMessages();
		    if(msgInfo!="")
		    {
		        _displayProcessMessage(objAjax);
		    }
	   	}
		
	}
	var respCall = objAjax.getResponseHeader("RESP");
	eval(respCall);
 	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objdata = htmlAreaObj.getHTMLDataObj();
	objdata.resetChangeFields();
	objAjax = null;
}

SO.resetSearchPopUp = function(divId,qSrch)
{
	//alert($('#'+divId +' input[type="text"]'))
	qSrch.resetChngFlds();
	$('#'+divId +' input[type="text"]').val('');
	//Tracker#: 24818
	//$('select option:first-child').attr("selected", "selected");
}

SO.soShowNextPage = function(pageNo,sec,url)
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
                            
            messagingDiv(htmlErrors, "SO._continueShowNextPageSave()", "SO._continueShowNextPage('"+pageNo+"','"+url+"')");
        }
        else
        {
        	SO._continueShowNextPage(pageNo,url);
        }
    }
}

SO._continueShowNextPageSave = function()
{    	
	//alert("_continueShowNextPageSave  ") ;
	closeMsgBox();
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	
	if(objAjax)
	{	
    	objHtmlData.performSaveChanges(_defaultWorkAreaSave);
	}
}

SO._continueShowNextPage=function(pageNo,url)
{
	//alert("_continueShowNextPage pageNo " +pageNo + "\n url ->" + url) ;
	closeMsgBox();
	
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	    	
	if(objAjax)
	{		
		//alert("here inside");
    	objAjax.setActionURL(url);
    	objAjax.setActionMethod("NEWPAGING&pageNum="+pageNo);
    	objAjax.setProcessHandler(SO.reloadSearchList,objAjax);
    	objAjax.sendRequest();
	}
}

SO.noPMsg = function()
{
	var objAjax = new htmlAjax();
	var htmlErrors = objAjax.error();
	objAjax.error().addError("warningInfo", "No privilege to execute this process.", false);
	messagingDiv(htmlErrors);
	return;
}

SO.showCmnts = function (soId)
{
	soId = $("#hSoId").val();
	objAjax = new htmlAjax();
    objAjax.setActionURL("salesorder.do");
    objAjax.setActionMethod("viewcomments");
    objAjax.setProcessHandler("cmntsResp");
    objAjax.parameter().add("parentViewId", 9200);
    objAjax.parameter().add("soId", soId);
    objAjax.sendRequest();
    $(commentsDialog).dialog('destroy');
}

SO.chngTrck = function ()
{
	var keyinfo = $("#keyinfo").val();
	var imId = $("#imId").val();
	_showSmartTagView(imId,getElemnt(imId),1600,1600,true,keyinfo,imId);	
    $(commentsDialog).dialog('destroy');
}

//F
function packMeascalc(obj)
{
	
	
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName ="_divWorkArea";
    var url = "salesorderentrydetailview.do";
    bShowMsg=true;
   
	
	var id=obj.id;
	
    if(objAjax)
    {
        objAjax.setActionURL(url);
        objAjax.setActionMethod("calcPackmes&fieldId="+id);
        objAjax.setProcessHandler(_setChangedFieldsToDetail);
        if(objHTMLData.checkForChanges())
        {
        	objHtmlData.addToChangedFields(obj);
        	objHTMLData.performSaveChanges(_showSubmitWorkArea, objAjax);
       	}
       	else
       	{
       		objAjax.sendRequest();
       	}
        
    }
}
function _setChangedFieldsToDetail(objAjax)
{
	var fldNvals=objAjax.getResponseHeader("_fldNvals");
	var fldLst=fldNvals.split("~");
	for(var i=0;i<fldLst.length-1;i++)
	{
		var f=fldLst[i];
		var fSplt=f.split("=");
		//alert(fSplt);
		var fld=fSplt[0];
		//alert(fld);
		var vl=fSplt[1];
		//alert(vl);
		var obj=getElemnt(fld);				
		objHtmlData.addToChangedFields(obj);
		//If obj present then only assign value
		//Tracker#19377
		if (obj)
		{
			obj.value=vl;			
		}		
	}
	
}

//F
function extPriceCal(obj)
{
	
	
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName ="_divWorkArea";
    var url = "salesorderentrydetailview.do";
    bShowMsg=true;
   
	
	var id=obj.id;
	
    if(objAjax)
    {
        objAjax.setActionURL(url);
        objAjax.setActionMethod("calcExtPrice&fieldId="+id);
        objAjax.setProcessHandler(_setChangedFieldsToDetail);
        if(objHTMLData.checkForChanges())
        {
        	objHtmlData.addToChangedFields(obj);
        	objHTMLData.performSaveChanges(_showSubmitWorkArea, objAjax);
       	}
       	else
       	{
       		objAjax.sendRequest();
       	}
        
    }
}



//sort detail rows
SO.sortDetailColumn=function sortDetailColumn(fieldName,sec,type, pageNo)
{
    
    var htmlAreaObj = _getWorkAreaDefaultObj();
	sectionName = sec;
    var objAjax = htmlAreaObj.getHTMLAjax();
    if(objAjax)
    {
        objAjax.setActionURL("salesorderentrydetailview.do");
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

    	
        _reloadArea(objAjax, sectionName);
        bShowMsg= false;
    }
}
function cmntsResp()
{
	if(objAjax)
	{
		if(objAjax.isProcessComplete())
		{
			var comments = new TRADESTONE.Comments("Sales Order Comments", objAjax.getResult());
			comments.show();
		}
		objAjax = null;
	}
}
var QSrch = new QSearchChangeFields();
SO.QuickSearchPopUp = function(obj)
{
	QSrch.resetChngFlds();
    SO.callDetailAction("showquicksearch&qsrchName=QSrch","SO.QukSrchResponse");
}
//Ajax response of _deliverySplitPopUp handled here
SO.QukSrchResponse = function(objAjax)
{
    if(objAjax)
	{
		if(objAjax.isProcessComplete())
		{
            var comments = new Popup("Qsearch","Quick Search", objAjax.getResult(),150,1000);
			comments.show();

            // Tracker#: 23467
            // Add the keyup event to submit the page when enter key is pressed.
            $("#Qsearch").keyup(function(e) {

                if(e.keyCode == 13) {
                    SO.poquickSearch();
		        }
	        });
        }
		objAjax = null;
	}
}

SO.callDetailAction = function(actionMethod,processHndlr)
{
	//alert("detail");
	objAjax = new htmlAjax();
	objAjax.setActionURL("salesorderentrydetailview.do");
	objAjax.setActionMethod(actionMethod);
	objAjax.setProcessHandler(processHndlr);
	objAjax.sendRequest();
}

SO.poquickSearch = function()
{
	var val = QSrch.qsChngFldsNVal;
	var oprs = QSrch.qsChngFldsOpr;
	var chFlds = QSrch.qsChngFlds;

	var msg = "Please select search operator(s)."
	var noSearchMsg = "Please select search criteria.";
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objHtmlData = htmlAreaObj.getHTMLDataObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
	objAjax.setActionURL("salesorderentrydetailview.do");
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
	SO.deliPopupClose('Qsearch');
	sectionName = '_divWorkArea';
	bShowMsg = true;
	objHtmlData._mHasUserModifiedData =true;
	objHtmlData.performSaveChanges(showDocumentPage,objAjax);
}

SO.poShowAll = function()
{
	objAjax = new htmlAjax();
	objAjax.setActionURL("salesorderentrydetailview.do");
	objAjax.setActionMethod("showAll");
	objAjax.setProcessHandler("SO.refreshPOScreen");
	objAjax.sendRequest();
}
SO.refreshPOScreen = function (objAjax)
{
	_execAjaxScript(objAjax);
    SO.deliPopupClose('deliPopup');
    SO.deliPopupClose('Qsearch');
    executeDocumentProcess('salesorderentrydetailview.do','view&refresh=Y', false, false);
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

SO.deliPopupClose = function (popName)
{
	//dialog window
	if (commentsDialog)
	{
		commentsDialog.dialog("close");
	}
	$("#"+popName).html('');
	$("#"+popName).dialog('destroy');
	$("#"+popName).remove();
	SO.delShown = false;	
}

//Tracker#:24184 IMPLIMENT SALES ORDER COMMENTS IN OVERVIEW
SO.showCommentsPopUp = function showCommentsPopUp()
{
  objAjax = new htmlAjax();
  objAjax.setActionURL("threadedcomments.do");
  objAjax.setActionMethod("viewcomments");
  objAjax.setProcessHandler("SOcommentResp");
  objAjax.parameter().add("parentViewId", 9207);
  objAjax.sendRequest();
}


SO.additems = function additems()
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
		// Data has been changed but not saved
		if(objHTMLData!=null && objHTMLData.isDataModified())
      	{
	   		var htmlErrors = objAjax.error();
	   		htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
	   		messagingDiv(htmlErrors, "saveWorkArea()", "addSalesOrderItems()");
	   		return;
      	}
        this.addSalesOrderItems();
    }
}
//Used by the process Add Item(s) on the Sales PO detail tab
SO.addSalesOrderItems = function addSalesOrderItems()
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();

    if(objAjax && objHTMLData)
    {
        objHTMLData.resetChangeFields();
        openWin('additems.do?method=new&doc_view_id=105&builder_id=9210', 1000, 770)
    }
}

function SOcommentResp()
{
	if(objAjax)
	{
		if(objAjax.isProcessComplete())
		{
			var comments = new TRADESTONE.Comments("Sales Order Comments", objAjax.getResult());
			comments.show();
		}
		objAjax = null;
	}
}
//Tracker#: 25120 ABILITY TO CREATE NOTES FOR PACKING/ITEM INSTRUCTIONS WHICH ARE USED ON SO SCREEN
SO.createviewpkginstr = function createviewpkginstr()
{
	
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    var selectedRows = [];
    if(objHTMLData!=null && objHTMLData.hasUserModifiedData())
    {
    	var chgFields = objHTMLData.getChangeFields();
    	selectedRows =  checkForSelection(chgFields);
        if(selectedRows.length > 1 )
        {
        	var htmlErrors = objAjax.error();
            objAjax.error().addError("warningInfo", "Please select only one detail line.", false);
            messagingDiv(htmlErrors);
            return;
        }
    }
    else
    {
    	var htmlErrors = objAjax.error();
        objAjax.error().addError("warningInfo", "Please select atleast one detail line.", false);
        messagingDiv(htmlErrors);
        return;
    }
    closeMsgBox();
    
    if(objAjax && objHTMLData)
    {
        objAjax.setActionURL("salesorderentrydetailview.do");
        objAjax.setActionMethod("showPkgInst&selectedRow="+selectedRows[0]);
        objAjax.setProcessHandler("SO.showNotesTab");
        objAjax.sendRequest();
    }
}

SO.createviewiteminstr = function createviewiteminstr()
{
	
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    var selectedRows = [];
    if(objHTMLData!=null && objHTMLData.hasUserModifiedData())
    {
    	var chgFields = objHTMLData.getChangeFields();
    	selectedRows =  checkForSelection(chgFields);
        if(selectedRows.length > 1 )
        {
        	var htmlErrors = objAjax.error();
            objAjax.error().addError("warningInfo", "Please select only one detail line.", false);
            messagingDiv(htmlErrors);
            return;
        }
    }
    else
    {
    	var htmlErrors = objAjax.error();
        objAjax.error().addError("warningInfo", "Please select atleast one detail line.", false);
        messagingDiv(htmlErrors);
        return;
    }
    closeMsgBox();
    
    if(objAjax && objHTMLData)
    {
        objAjax.setActionURL("salesorderentrydetailview.do");
        objAjax.setActionMethod("showItemInst&selectedRow="+selectedRows[0]);
        objAjax.setProcessHandler("SO.showNotesTab");
        objAjax.sendRequest();
    }
}

function checkForSelection(chgFields)
{
	var slectedChkfld = [];

	var j=0;
	if(chgFields != null && chgFields.length > 0)
    {
        for(var i = 0 ; i < chgFields.length ; i++)
        {
            if(chgFields[i].startsWith(_CHK_BOX_DEFAULT_ID))
            {
            	slectedChkfld[j] = chgFields[i];
                j++;
            }
        }
    }
    return slectedChkfld;
}

SO.showNotesTab = function(objAjax)
{
	if(objAjax)
	{
		var respCall = objAjax.getResponseHeader("RESP");
		if(respCall)
		{
			eval(respCall);
		}
		else
		{
			_displayProcessMessage(objAjax)
		}
		
	}
	objAjax = null;
}
//Tracker#:26519  FR08	CREATE PROCESS TO GENERATE PURCHASE ORDER THAT CAN BE CALLED FROM THE SALES ORDER ASSIGNMENT SC
SO.generatePOFromSO = function ()
{
	cId = $("#hSoId").val();
	bShowMsg = true;
	if (cId)
	{
		var objAjax = new htmlAjax();
		objAjax.setActionURL("salesorder.do");
		objAjax.setActionMethod("GENERATE_PURCHASE_ORDER&soId="+cId);
		objAjax.setProcessHandler(SO.pResp);
		objAjax.sendRequest();
	}
	else
	{
		var cs='';
		$('input[name^="hR_"]').each(function() {

			if($(this).attr('checked'))
			{
				cs+=$(this).val()+",";
			}
		});
		cs = cs.substring(0, cs.length - 1);
		if(cs.length < 1)
		{
			var objAjax = new htmlAjax();
			var htmlErrors = objAjax.error();
			objAjax.error().addError("warningInfo", "Please select a Sales Order Summary row to execute this process.", false);
			messagingDiv(htmlErrors);
			return;
		}
		var objAjax = new htmlAjax();
		objAjax.setActionURL("salesorder.do");
		objAjax.setActionMethod("GENERATE_PURCHASE_ORDER&soId="+cs);
		objAjax.setProcessHandler(SO.pResp);
		objAjax.sendRequest();
	}

}
// Add Keydown event for all the controls on the Search Popup. So that
// enter key is handled to call Search action.
SO.handleInputKeyDownAction= function handleInputKeyDownAction(evt, obj)
{
    var code;
    // make sure we have a valid event variable
    if (!evt && window.event)
    {
        evt = window.event;
    }
    code = evt.keyCode;

    if (code == 13)
    {
        obj.onchange();
        //Submit search
        SO.Search('search_section');
    }
    return true;
}

