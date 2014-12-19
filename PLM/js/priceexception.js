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

var PE={save:"N"}
/** * Function to select all check boxes */
PE.selAll = function(obj,id, divId){
	var checkboxes;
	if(divId){
		checkboxes = $('#'+divId+' input[name^="'+id+'"]');
	}else{
		checkboxes = $('input[name^="'+id+'"]');
	}
    if($(obj).is(':checked')) {
        checkboxes.attr('checked', 'checked');
    } else {
        checkboxes.removeAttr('checked');
    }	
}
/** * Function to unselect all check boxes */
PE.unSelAll = function(){
	    var cCbs = $('input[name^="PE_CLR"]');
	    var sCbs = $('input[name^="PE_SZ"]');
	    var cCbs2 = $('input[name^="PE_CMB_CLR"]');
	    var sCbs2 = $('input[name^="PE_CMB_SZ"]');
	    cCbs.removeAttr('checked');
	    sCbs.removeAttr('checked');
	    cCbs2.removeAttr('checked');
	    sCbs2.removeAttr('checked');
	    $("#PE_CLR_chk").removeAttr('checked');
	    $("#PE_SZ_chk").removeAttr('checked');
	    $("#PE_CMB_CLR_chk").removeAttr('checked');
	    $("#PE_CMB_SZ_chk").removeAttr('checked');
}
/** * Function to post the selected colors*/
PE.postClr = function(popup){
	var clrs='';
	$("#peClrs").find('input[name^="PE_CLR"]').each(function() {
		if($(this).attr('checked')){
			clrs+=$(this).val()+"@_";
		}
	});	
	
	
var objAjax = new htmlAjax();
objAjax.setActionURL("priceexception.do");
objAjax.setActionMethod("post_clr&colors="+clrs+"&popup="+popup);
objAjax.parameter().add("div","colors");
objAjax.parameter().add("maindiv","peClrs");
objAjax.setProcessHandler(PE.pResp);
objAjax.sendRequest();
}
/** * Function to post the selected sizes */
PE.postSzs = function(popup){
	var szs='';
	$("#peSzs").find('input[name^="PE_SZ"]').each(function() {
		if($(this).attr('checked')){
			szs+=$(this).val()+"@_";
		}
	});
var objAjax = new htmlAjax();
objAjax.setActionURL("priceexception.do");
objAjax.setActionMethod("post_sz&sizes="+szs+"&popup="+popup);
objAjax.parameter().add("div","sizes");
objAjax.parameter().add("maindiv","peSzs");
objAjax.setProcessHandler(PE.pResp);
objAjax.sendRequest();
}
/** * Function to post the selected colors and sizes */
PE.post = function(popup,clrChk,szChk){
	var clrs='';
	var szs='';
	$("#pe").find('input[name^="'+clrChk+'"]').each(function() {
		if($(this).attr('checked')){
			clrs+=$(this).val()+"@_";
		}
	});	
	$("#pe").find('input[name^="'+szChk+'"]').each(function() {
		if($(this).attr('checked')){
			szs+=$(this).val()+"@_";
		}
	});
	
var objAjax = new htmlAjax();
objAjax.setActionURL("priceexception.do");
objAjax.setActionMethod("show_pe&colors="+clrs+"&sizes="+szs+"&popup="+popup);
objAjax.parameter().add("div","clrs_szs");
objAjax.setProcessHandler(PE.pResp);
objAjax.sendRequest();
}

/** * Function to save the price exception */
PE.save = function(){
	PE.save = "Y";
	submitForm('set_pe');
}

PE.reLoadPrnt = function()
{
	var frm = getobj("docFrm");
	window.opener.location.href=frm.value+"?method=refresh";
}
/** * Function to delete the price exception records */
PE.del = function(rowNo){
	PE.save = "Y";
	var docView = getElemnt("docView");
	var val = '';
	if (docView)
	{
		val = docView.value;
	}
	//submitForm('del_pe');
	var szMsg_Delete_Dtl        = 'Are you sure you want to delete the selected record?';
	if (confirm(szMsg_Delete_Dtl))
	{
		submitUrl("priceexception.do?method=del_pe&rowNo="+rowNo+"&docView="+val,"H");
	}
}
/** * Function to delete the price exception records from offer steps */
PE.delStep = function(rowNo,docView,sec){
	var dSec='';
	if('colors_sec'==sec)
	{
		dSec = 'colors';
	}else if ('sizes_sec'==sec)
	{
		dSec = 'sizes';
	}else if ('price_exp_sec'==sec)
	{
		dSec = 'clrs_szs';
	}
	var szMsg_Delete_Dtl        = 'Are you sure you want to delete the selected record?';
	if (confirm(szMsg_Delete_Dtl))
	{
		var objAjax = new htmlAjax();
		objAjax.setActionURL("priceexception.do");
		objAjax.setActionMethod("del_step_pe&rowNo="+rowNo+"&sec="+sec);
		objAjax.parameter().add("div",dSec);
		objAjax.setProcessHandler(PE.pResp);
		objAjax.sendRequest();
	}
}
/** * call back for post function */
PE.pResp =function(objAjax){
	if(objAjax)	{
		//alert(objAjax.isProcessComplete());
		var div = objAjax.parameter().getParameterByName("div");
		//alert(div);
		$("#"+div).empty();
		if(objAjax.isProcessComplete())	{
			var w = objAjax.getResponseHeader("msg");
			$("#"+div).html(objAjax.getResult());
			
			var mHdn = getElemnt("hMsg");
			if(mHdn)
			{
				$("#pMsgDiv").html("<font color='#ff0000'>"+mHdn.value+"</font>");
			}
		}		
	}
	PE.unSelAll();
}

/** * Function to show pop up */
PE.shwPrcPopup = function(obj,docId,docViewId,offerNo){
	var chgHolder = getval('chgflds');
	if (chgHolder && chgHolder.length > 0){
		if (confirm(szMsg_Changes)){
			fsubmit('save');
        }else{
        	PE.pop(obj, docId, docViewId,offerNo);
        }
	}else{
		PE.pop(obj, docId, docViewId,offerNo);
    }
}
/** * Function to show pop up */
var peWindow;
PE.pop = function (obj,docId,docViewId,offerNo){
	var url = "priceexception.do?method=show_smart_tag&offerNo="+offerNo+"&docView="+docId;
	if (peWindow){
		peWindow.close();
	}
	peWindow = window.open(url,"PriceExceptions","width=800px,height=600px,toolbar=no,menubar=no,scrollbars=no,resizable=yes");	
	
}
/**Function called on close of a window*/
PE.close = function (frm,save){
	if (PE.save == "Y"){
		window.opener.location.href=frm+"?method=refresh";		
	}else{
		window.close();
	}
	PE.save = "N";
}

/** * Function to center the div */
PE.center = function (divObj) {
	divObj.css("position","absolute");
	divObj.css("top", Math.max(0, (($(window).height() - $(divObj).outerHeight()) / 2) + 
                                                $(window).scrollTop()) + "px");
	divObj.css("left", Math.max(0, (($(window).width() - $(divObj).outerWidth()) / 2) + 
                                                $(window).scrollLeft()) + "px");
	divObj.css("z-index",999);
    
}

/** Function to show the price exception popup as process*/
PE.showPE = function (){
	var chgHolder = getval('chgflds');
	if (chgHolder && chgHolder.length > 0){
		if (confirm(szMsg_Changes)){
			fsubmit('save');
        }else{
        	PE.peProc();
        }
	}else{
		PE.peProc();
	}
}
/**Function opens a new window for price exception*/
PE.peProc = function (){
	var checkboxes = $('input[name="R"]');
	var count = $('input[name="R"]:checked').size();
	if (count == 0)	{
		alert(szMsg_Sel_Row);
		return;
	}else if (count > 1){
		alert(szMsg_Sel_A_Row);
		return;
	}
	var indx;
	$(checkboxes).each(function() {
		if($(this).attr('checked')){
			indx=$(this).val();
		}
	});

	if (indx > nLastValidDtl){
		alert(szMsg_Invalid_Dtl_Rec);
		return;
	}
	var url = "priceexception.do?method=show_pe_proc&row="+indx;
	if (peWindow){
		peWindow.close();
	}
	peWindow = window.open(url, 'PriceExceptions','width=800px,height=600px,toolbar=no,menubar=no,scrollbars=no,resizable=yes');	
}
/**This function removes the seleted colorway record*/
PE.delClr = function (iocc){
	var szMsg_Delete_Dtl        = 'Are you sure you want to delete the selected record?';
	if (confirm(szMsg_Delete_Dtl)){
		submitUrl("request.do?method=deleteColorways&row="+iocc, 'H');
	}
}
