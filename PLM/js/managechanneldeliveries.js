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

var MCD = {};

var chkcnt=0;
MCD.showManageChannel= function showManageChannel(linkObj,rowno)
{
	
	var htmlAreaObj =_getAreaObjByDocView(190);
	
	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    var keys = linkObj;
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    //Tracker#:27538 - Set the bShowMsg to true to display the warning messages which were added in the process of
    //auto attach of sell channels 
    bShowMsg=true;
	if(objAjax)
	{
		//CO.showPrompt("wManageChannels",keys);
	    objAjax.setActionURL("managechanneldeliveries.do");
	    objAjax.parameter().add("keyinfo", keys);
	    objAjax.parameter().add("rwno", rowno);
        objAjax.setActionMethod("gotoManageChannelDeliveries");
        
        objAjax.parameter().add("divId","headerdiv");
        objAjax.setProcessHandler(MCD.renderDiv);
        objAjax.sendRequest();
	}
    	
   	
}

MCD.renderDiv =function(objAjax)
{
	chkcnt=0;
	var divId = objAjax.parameter().getParameterByName("divId");
	//alert("DivId--->"+divId);

	if(objAjax)
	{
		if(objAjax.isProcessComplete())
		{
			var comments = new MCD.openManageChannelDiv("Manage Channels and Deliveries", objAjax.getResult());
		
			comments.show();
	
			// close the pop up, if no changes are done on the pop up
			CQ.closePopUp(false);	
			
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
		
		
		objAjax = null;
		
	}
	
}

 var manageChannelDialog;
 var mcCommentsDiv;
	
 MCD.openManageChannelDiv = function(_commentTitle, _commentHTML)
 {
 	var commentTitle = _commentTitle;
 	var commentHTML = _commentHTML;
	
 	this.show = function()
 	{
 		var commentsDiv = document.createElement('div');

    		$(commentsDiv).attr("id", "Comment");
    		
    		if($(manageChannelDialog).is(':data(dialog)')){
    			if(manageChannelDialog!= undefined && manageChannelDialog!=null && manageChannelDialog!="" ){
    		 			MCD.close(null);
    		 		
    				}
    		}
    		manageChannelDialog = $(commentsDiv).dialog({
    		title: commentTitle,
            height: 520,
 			width : 1100,
 			zIndex: 600,
 			modal : true,

    		});
    
    		var titleBar = $(".ui-dialog-titlebar a.ui-dialog-titlebar-close");
    		titleBar.removeClass("ui-corner-all");
    		titleBar.find(".ui-icon").html("<img src='images/x-close.gif' border='0'/>").removeClass();
    		$(commentsDiv).dialog().siblings('.ui-dialog-titlebar').removeClass('ui-widget-header'); 
    		$(commentsDiv).css('overflow', 'hide');
    		//alert("commentHTML"+commentHTML);
    		
    		var res = commentHTML.replace("class=\"title1Div\"", "class=\"mangDiv\"");
    		manageChannelDialog.html(res);
    	
    		
 	    $('#nav').collapsible({xoffset:'-12',yoffset:'10', imagehide: 'images/arrowdown.gif', imageshow: 'images/Rarrow.gif', defaulthide: false});

 	  
 		// Attache enter event.
 		$('#commentsSearch').keyup(function(e) {
 			if(e.keyCode == 13) {
 				CommentsJsModule.commentsSearch();
 			}
 		});
 		
 		document.onkeydown = function(e) {
			e = e || event;
			if (e.keyCode == 27) { // escape
					MCD.close(null);
					CHQ.refreshPage("resetattr");
			}
		};
		
 		$(".ui-dialog-titlebar").hide();
 		
		
 	};
 	
}
 
 MCD.ClosePopUp =function ClosePopUp(Keyinfo)
 {
	
	 var chngdFlds;
		//identify the proper area object based on doc view id
		var areaObj =_getAreaObjByDocView(11703);
		var objHtmlData = areaObj.getHTMLDataObj();    
	    var objAjax = areaObj.getHTMLAjax();
	    chngdFlds=objHtmlData.getChangeFields();
	    
		var areaObj11704 =_getAreaObjByDocView(11704);
		//alert("in save areaObj11704"+areaObj11704);
		var objHtmlData11704;
		var objAjax11704;
		if(areaObj11704!=null)
		{				
		 objHtmlData11704 = areaObj11704.getHTMLDataObj();     
		 objAjax11704 = areaObj11704.getHTMLAjax();	 
		}
		//alert("in save objHtmlData11704"+objHtmlData11704);
		
		if(objHtmlData11704!=null && objHtmlData11704.hasUserModifiedData()==true)
		{
			objHtmlData.addToChangedFields(objHtmlData11704.getChangeFields());
			//alert("in save objHtmlData11704"+objHtmlData11704.getChangeFields());
			//alert("in save chngdFlds"+chngdFlds);
			if(chngdFlds!=null)
			{
				chngdFlds=chngdFlds+","+objHtmlData11704.getChangeFields();
			//	alert("chngdFlds"+chngdFlds);
			}
			else
			{
				chngdFlds=objHtmlData11704.getChangeFields();
			}
			objHtmlData11704.appendChangeFieldsCtrlInfoToRequest(objAjax);		
		}
		
		
		
		var strChngFld=encodeURIComponent(chngdFlds);
		var decodeChngFld=decodeURIComponent(chngdFlds);
		var htmlAreaObj = _getWorkAreaDefaultObj();
		var objHtmlData = htmlAreaObj.getHTMLDataObj();
		var objAjax = htmlAreaObj.getHTMLAjax();
		
		
		if (strChngFld != null && strChngFld != "" && !MCD.CheckOneSelection(decodeChngFld)) {
				if(objHtmlData!=null && (objHtmlData.hasUserModifiedData()==true || (strChngFld!=null && strChngFld!="")))
				{
				var htmlErrors = objAjax.error();
				htmlErrors.addError("confirmInfo", szMsg_Changes, false);
				var saveFunc = "\"MCD.save('"+Keyinfo+"')\"";
				var cancelFunc = "\"MCD.close('"+areaObj+"')\"";
				messagingDiv(htmlErrors, saveFunc, cancelFunc);
				return;
				}
			} else {

				MCD.close(areaObj);
				CHQ.refreshPage("resetattr");
		 		
				
			}
 }
MCD.resetFlds =function resetFlds()
  {
	
	var areaObj =_getAreaObjByDocView(11703);
	var objHtmlData = areaObj.getHTMLDataObj();    
	objHtmlData.resetChangeFields();
	
	var areaObj11704 = _getAreaObjByDocView(11704);
	var objHtmlData11704;
	var objAjax11704;
	if (areaObj11704 != null) {
		
		objHtmlData11704 = areaObj11704.getHTMLDataObj();
		objAjax11704 = areaObj11704.getHTMLAjax();
		objHtmlData11704.resetChangeFields();
		objAjax11704 = null;
	}

}
MCD.close=function close(htmlAreaObj){

	closeMsgBox();
	if(manageChannelDialog) {
		var areaObj =_getAreaObjByDocView(11703);
		var areaObj11704 = _getAreaObjByDocView(11704);
		
		manageChannelDialog.html('');
		manageChannelDialog.dialog('destroy');
		manageChannelDialog.remove();
		if(areaObj!= null){
			var objdata = areaObj.getHTMLDataObj();
	 		objdata.resetChangeFields();
		}
		
		if(areaObj11704 != null){
			var objdata = areaObj11704.getHTMLDataObj();
	 		objdata.resetChangeFields();
		}
		
 		MCD.resetFlds();
 		CHQ.refreshPage("resetattr");
 		
 		
	}
}
MCD.save = function save(KeyInfo)
{
	//alert("in save"+KeyInfo);
	
	var chngdFlds;
	//identify the proper area object based on doc view id
	var areaObj =_getAreaObjByDocView(11703);
	var objHtmlData = areaObj.getHTMLDataObj();    
    var objAjax = areaObj.getHTMLAjax();
    chngdFlds=objHtmlData.getChangeFields();
    
	var areaObj11704 =_getAreaObjByDocView(11704);
	//alert("in save areaObj11704"+areaObj11704);
	var objHtmlData11704;
	var objAjax11704;
	if(areaObj11704!=null)
	{				
	 objHtmlData11704 = areaObj11704.getHTMLDataObj();     
	 objAjax11704 = areaObj11704.getHTMLAjax();	 
	}
	//alert("in save objHtmlData11704"+objHtmlData11704);
	
	if(objHtmlData11704!=null && objHtmlData11704.hasUserModifiedData()==true)
	{
		objHtmlData.addToChangedFields(objHtmlData11704.getChangeFields());
		//alert("in save objHtmlData11704"+objHtmlData11704.getChangeFields());
		//alert("in save chngdFlds"+chngdFlds);
		if(chngdFlds!=null)
		{
			chngdFlds=chngdFlds+","+objHtmlData11704.getChangeFields();
		//	alert("chngdFlds"+chngdFlds);
		}
		else
		{
			chngdFlds=objHtmlData11704.getChangeFields();
		}
		objHtmlData11704.appendChangeFieldsCtrlInfoToRequest(objAjax);		
	}
	
	
	
	var strChngFld=encodeURIComponent(chngdFlds);
	//objAjax.parameter().add(strChngFld);	
	var decodeChngFld=decodeURIComponent(strChngFld);
	
	if(chngdFlds!=null && chngdFlds!="" && !MCD.CheckOneSelection(decodeChngFld)){
		if(objHtmlData!=null && (objHtmlData.hasUserModifiedData()==true || (strChngFld!=null && strChngFld!="")))
		{	
			bShowMsg = true;			
			//alert("length"+strChngFld.length);		
		
			objAjax.setActionURL("managechanneldeliveries.do");
			objAjax.setActionMethod("post");
			objAjax.parameter().add("chgflds", chngdFlds);		
			objAjax.parameter().add("keyinfo", KeyInfo);
			objAjax.setActionMethod("save");
			objAjax.setProcessHandler(MCD.pResp);
			objHtmlData.performSaveChanges(MCD.pResp,objAjax);  
			objHtmlData.resetChangeFields();
			MCD.resetFlds();
			
		}
		}
	else
    {
    	
    	var objAjax = new htmlAjax();
    	objAjax.error().addError("warningInfo", szMsg_No_change, false);
    	_displayProcessMessage(objAjax);
      
    }
	var isSaved = objAjax.getResponseHeader("issave");
    
	if (isSaved != null && isSaved != "" && isSaved == "true") {
		CHQ.refreshPage("refresh");
	}
    AutoSuggestContainer.clearComponents();
}
/**
 * Function used to execute previous and next processes on the Manage Channel & deliveries
 * pop up Based on the method prev/next quote sell channels are displayed on the
 * pop up Check the changed fields before showing previous or next sell channels
 * of a quote Tracker#:26789 
 * LOAD PREVIOUS/NEXT RFQ SELL CHANNEL'S BY USING PREVIOUS AND NEXT BUTTONS FOR MANAGE CHANNELS AND DEL
 * 
 * @param act
 */
MCD.executePrevNext = function executePrevNext(act,KeyInfo) {

	var chngdFlds;
	//identify the proper area object based on doc view id
	var areaObj =_getAreaObjByDocView(11703);
	var objHtmlData = areaObj.getHTMLDataObj();    
    var objAjax = areaObj.getHTMLAjax();
    chngdFlds=objHtmlData.getChangeFields();
    
	var areaObj11704 =_getAreaObjByDocView(11704);
	//alert("in save areaObj11704"+areaObj11704);
	var objHtmlData11704;
	var objAjax11704;
	if(areaObj11704!=null)
	{				
	 objHtmlData11704 = areaObj11704.getHTMLDataObj();     
	 objAjax11704 = areaObj11704.getHTMLAjax();	 
	}
	//alert("in save objHtmlData11704"+objHtmlData11704);
	
	if(objHtmlData11704!=null && objHtmlData11704.hasUserModifiedData()==true)
	{
		objHtmlData.addToChangedFields(objHtmlData11704.getChangeFields());
		//alert("in save objHtmlData11704"+objHtmlData11704.getChangeFields());
		//alert("in save chngdFlds"+chngdFlds);
		if(chngdFlds!=null)
		{
			chngdFlds=chngdFlds+","+objHtmlData11704.getChangeFields();
		//	alert("chngdFlds"+chngdFlds);
		}
		else
		{
			chngdFlds=objHtmlData11704.getChangeFields();
		}
		objHtmlData11704.appendChangeFieldsCtrlInfoToRequest(objAjax);		
	}
	
	
	
	var strChngFld=encodeURIComponent(chngdFlds);
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objHtmlData = htmlAreaObj.getHTMLDataObj();
	var objAjax = htmlAreaObj.getHTMLAjax();

	
	if (strChngFld != null && strChngFld != "") {
		var htmlErrors = objAjax.error();
		htmlErrors.addError("confirmInfo", szMsg_Changes, false);
		var saveFunc = "\"MCD.save('"+KeyInfo+"')\"";
		var cancelFunc = "MCD.showPrevNextRFQ('" + act + "')";
		messagingDiv(htmlErrors, "MCD.save('"+KeyInfo+"')", cancelFunc);
		return;
	} else {

		MCD.showPrevNextRFQ(act);
	}
}

/**
 * Show previous next item sell channels
 * 
 * @param act
 */
MCD.showPrevNextRFQ = function showPrevNextRFQ(act) {
	 
	if (document.getElementById("msgDiv") != null) {
		closeMsgBox();
	}

	var htmlAreaObj =_getAreaObjByDocView(190);
	
	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();   
   
	objAjax.setActionURL("managechanneldeliveries.do");
	objAjax.setActionMethod(act);
	objAjax.parameter().add("divId","headerdiv");
    objAjax.setProcessHandler(MCD.reloadDiv);
    objAjax.sendRequest();

	
	
}

//Repaint the  div when next/prev buttons are clicked
MCD.reloadDiv = function reloadDiv(objAjax) {
	
	if (objAjax) {
		if (bShowMsg == true) {
			msgInfo = objAjax.getAllProcessMessages();
			if (msgInfo != "") {
				_displayProcessMessage(objAjax);
			}
		}
		if (objAjax.isProcessComplete()) {
			// replace the html content of the div
			MCD.resetFlds();
			var res = objAjax.getResult().replace("class=\"title1Div\"", "class=\"mangDiv\"");
			$("#Comment").html(res);
		}
		objAjax = null;
	}
}

MCD.deleteChannel=function deleteChannel(keyinfo,docviewid,act,row,associationrowno,noOfStore){
	
	var areaObj =_getAreaObjByDocView(docviewid);
	var objHtmlData = areaObj.getHTMLDataObj();    
	var objAjax = areaObj.getHTMLAjax();
	
	var htmlErrors = objAjax.error();
	var field=MCD.getFieldName(keyinfo,act);
	var confirmMsg=null;
	if(act=='delFlow' && noOfStore > 1){
		confirmMsg="You are about to delete the "+field+" delivery from all Store Types,Do you wish to proceed?";
	}
	else{
		confirmMsg="Are you sure you want to delete?";
	}
	
	htmlErrors.addError("confirmInfo", confirmMsg,  false);
	var saveFunc = "\"MCD.deleteMarketChannel('" + act + "','" + docviewid + "','" + row + "','"+keyinfo+"','"+associationrowno+"')\"";
	var canceFunc="closeMsgBox()";
	messagingDiv(htmlErrors,saveFunc, canceFunc);
	
}

MCD.getFieldName=function getFieldName(keyinfo,act){
	var arr=keyinfo.split("~@");
	if(act=="delFlow"){
		var fldArr=arr[1].split("@@");
		return fldArr[1]
	}
	
	return null;
}
MCD.enableDeleteButton=function enableDeleteButton(id,e){
	var chkbox = document.getElementById(id);
	
	if (chkbox) {
			var chkval = chkbox.value;
				
				var trashbutton = document.getElementById("trashbutton");
			if (trashbutton) {
				//alert("checked"+e.checked);
				if(e.checked){
					$("#trashbutton").removeClass();
					// set the style class, to display the buttons as disabled
					trashbutton.className = "clsbtnstatus";
					// reset the onclick event
					
					trashbutton.onclick = function() {
						MCD.deleteAllChannel();
					};
					chkcnt++;
					}
				else{
					chkcnt--;
					//alert("else chkcnt"+chkcnt);
					if(chkcnt==0){
						$("#trashbutton").removeClass();
						// set the style class, to display the buttons as disabled
						trashbutton.className = "clsbtnstatus clspassiv";
						// reset the onclick event
						trashbutton.onclick = '';
					}
				}
			}
	}

}
MCD.deleteAllChannel=function deleteAllChannel(){
	
	
	var chngdFlds;
	//identify the proper area object based on doc view id
	var areaObj =_getAreaObjByDocView(11703);
	var objHtmlData = areaObj.getHTMLDataObj();    
    var objAjax = areaObj.getHTMLAjax();
    chngdFlds=objHtmlData.getChangeFields();
    var htmlErrors = objAjax.error();
	var areaObj11704 =_getAreaObjByDocView(11704);
	
	var objHtmlData11704;
	var objAjax11704;
	if(areaObj11704!=null)
	{				
	 objHtmlData11704 = areaObj11704.getHTMLDataObj();     
	 objAjax11704 = areaObj11704.getHTMLAjax();	 
	}
	
	
	if(objHtmlData11704!=null && objHtmlData11704.hasUserModifiedData()==true)
	{
		objHtmlData.addToChangedFields(objHtmlData11704.getChangeFields());
		
		if(chngdFlds!=null)
		{
			chngdFlds=chngdFlds+","+objHtmlData11704.getChangeFields();
			
		}
		else
		{
			chngdFlds=objHtmlData11704.getChangeFields();
			
		}
		objHtmlData11704.appendChangeFieldsCtrlInfoToRequest(objAjax);		
	}
	var strChngFld=encodeURIComponent(chngdFlds);
	
	 var decodechgflds=decodeURIComponent(chngdFlds);
	 var qtychkForAll=MCD.getQtyCheckForSelection(decodechgflds);
	 //var qtychk = document.getElementById("qtyCheck");
	
	 if(qtychkForAll != null){
		// var qtychkval=qtychk.value;
		
		 if(qtychkForAll){
			 var confirmMsg="Quantities exist for at least one of the selected Channels or Deliveries.  Are you sure you want to delete it?";
			
			 htmlErrors.addError("confirmInfo", confirmMsg,  false);	
			 var saveFunc = "\"MCD.deleteAllMarketChannel('"+decodechgflds+"')\"";
			 var canceFunc="closeMsgBox()";
			 messagingDiv(htmlErrors,saveFunc, canceFunc);
		 }
		 else{
			 var confirmMsg="Are you sure you want to delete?";		
			
			 htmlErrors.addError("confirmInfo", confirmMsg,  false);	
			 var saveFunc = "\"MCD.deleteAllMarketChannel('"+decodechgflds+"')\"";
			 var canceFunc="closeMsgBox()";
			 messagingDiv(htmlErrors,saveFunc, canceFunc);
		 }
	 }
	 else{
		 var confirmMsg="Are you sure you want to delete?";		
		
		 htmlErrors.addError("confirmInfo", confirmMsg,  false);	
		 var saveFunc = "\"MCD.deleteAllMarketChannel('"+decodechgflds+"')\"";
		 var canceFunc="closeMsgBox()";
		 messagingDiv(htmlErrors,saveFunc, canceFunc);
	 }
	 
 
}



MCD.getQtyCheckForSelection=function getQtyCheckForSelection(chFields){
	
	var charr=chFields.split(",");
	for(var i = 0 ; i < charr.length ; i++){
	var idarr=charr[i].split("_@");
	var qtyid=idarr[7];
	
	var qtyfieldforchannel=document.getElementById("qtyCheck"+qtyid);
	var qtyfieldforflow=document.getElementById("qtyFlowCheck"+qtyid);
	//alert("qtyfield"+qtyfieldforchannel);
	if(qtyfieldforchannel != null && qtyfieldforchannel != 'undefined'){
		var qtyvalue=qtyfieldforchannel.value;
		
		if(qtyvalue > 0){
			return true;
		}
		
	}
	else if(qtyfieldforflow != null && qtyfieldforflow != 'undefined'){
		var qtyvalue=qtyfieldforflow.value;
		
		if(qtyvalue > 0){
			return true;
		}
	}
	}
	return false;
	
}
MCD.deleteAllMarketChannel=function deleteAllMarketChannel(chFields){
	
	closeMsgBox();
	var areaObj =_getAreaObjByDocView(11703);
	var objHtmlData = areaObj.getHTMLDataObj();    
    var objAjax = areaObj.getHTMLAjax();
	
    objAjax.setActionURL("managechanneldeliveries.do");
	objAjax.setActionMethod("delAll");
	objAjax.parameter().add("chgflds", chFields);
	
	objAjax.parameter().add("divId","headerdiv");
  
	objAjax.setProcessHandler(MCD.pResp);
	objAjax.sendRequest();
	objHtmlData.resetChangeFields();
	MCD.resetFlds();
	
	AutoSuggestContainer.clearComponents();
	
}
MCD.deleteMarketChannel=function deleteMarketChannel(act,docviewid,row,keyinfo,associationrowno){
	
	//identify the proper area object based on doc view id
	closeMsgBox();
	var areaObj =_getAreaObjByDocView(docviewid);
	var objHtmlData = areaObj.getHTMLDataObj();    
    var objAjax = areaObj.getHTMLAjax();
    
    chngdFlds=objHtmlData.getChangeFields();
    
    objAjax.setActionURL("managechanneldeliveries.do");
	objAjax.setActionMethod(act);
	objAjax.parameter().add("row", row);
	objAjax.parameter().add("assockeyinfo", keyinfo);
	objAjax.parameter().add("assocrowno", associationrowno);
	
	objAjax.parameter().add("divId","headerdiv");
  
	objAjax.setProcessHandler(MCD.pResp);
	objAjax.sendRequest();
	objHtmlData.resetChangeFields();
	MCD.resetFlds();
	
	AutoSuggestContainer.clearComponents();
	
}
MCD.pResp =function(objAjax)
  {	
	if (objAjax) {
		// alert(objAjax.isProcessComplete());
		if (objAjax.isProcessComplete()) {
			var res = objAjax.getResult().replace("class=\"title1Div\"", "class=\"mangDiv\"");
			$("#Comment").html(res);
		}

		if (bShowMsg == true) {
			msgInfo = objAjax.getAllProcessMessages();        
            if (msgInfo != "") {
				_displayProcessMessage(objAjax);
			}
		}
	}
	var respCall = objAjax.getResponseHeader("RESP");
	// alert(respCall);
	eval(respCall);
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objdata = htmlAreaObj.getHTMLDataObj();
	objdata.resetChangeFields();
	MCD.resetFlds();
	// refreshNavigationGrid(objAjax);

    // Tracker#: 25828
    // Reset the temporary list which holds the grid cells ids
    // that has been fired programatically in order
    // to retain the same state which user runs on any process.
	gridhandler.retainUserState();
	  
	
    objAjax = null;
}
MCD.cancelPopUp=function cancelPopUp(){
	
	if(manageChannelDialog) {

		manageChannelDialog.html('');
		manageChannelDialog.dialog('destroy');
		manageChannelDialog.remove();
		var objdata = htmlAreaObj.getHTMLDataObj();
 		objdata.resetChangeFields();
 		MCD.resetFlds();
 	
	}
}
MCD.CheckOneSelection=function CheckOneSelection(chkobj){
	
	var arr = chkobj.split(",");
	for(var i = 0 ; i < arr.length ; i++)
	{
		var fieldName = arr[i];
		//alert("fieldName"+fieldName);
		var keypatt=new RegExp("chkRowKeys");
		
		if(fieldName!=null && fieldName != "" && !keypatt.test(fieldName))
		{
			return false;
		}
		
		
	}
	return true;
}

//Tracker#:26776 ADD NAVIGATION FEATURE TO NAVIGATE FROM MANAGE CHANNELS AND DELIVERIES POP TO ENTER COLOR QTY POP UP
//when user clicks on the Enter Color Quantities link on Manage Channels & Deliveries-If any changes are done we check and save, else we navigate to Color Qty screen
MCD.showColorQtyFromDeliveries = function showColorQtyFromDeliveries(linkObj,rowInd)
{	
	var chngdFlds;
	//identify the proper area object based on doc view id
	var areaObj =_getAreaObjByDocView(11703);
	var objHtmlData = areaObj.getHTMLDataObj();    
    var objAjax = areaObj.getHTMLAjax();
    chngdFlds=objHtmlData.getChangeFields();
    
	var areaObj11704 =_getAreaObjByDocView(11704);
	
	var objHtmlData11704;
	var objAjax11704;
	if(areaObj11704!=null)
	{				
		objHtmlData11704 = areaObj11704.getHTMLDataObj();     
		objAjax11704 = areaObj11704.getHTMLAjax();	 
	}
		
	if(objHtmlData11704!=null && objHtmlData11704.hasUserModifiedData()==true)
	{
		objHtmlData.addToChangedFields(objHtmlData11704.getChangeFields());
		
		if(chngdFlds!=null)
		{
			chngdFlds=chngdFlds+","+objHtmlData11704.getChangeFields();
		
		}
		else
		{
			chngdFlds=objHtmlData11704.getChangeFields();
		}
		objHtmlData11704.appendChangeFieldsCtrlInfoToRequest(objAjax);		
	}
	
	
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	var decodeChngFld=decodeURIComponent(chngdFlds);
	var keys = linkObj;
	//added the check to allow user to navigate to color qty pop up if sell channels are just selected
	if (chngdFlds != null && chngdFlds != "" && !MCD.CheckOneSelection(decodeChngFld)) 
	{		
		var htmlErrors = objAjax.error();
		htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
		var canceFunc = "\"MCD.showColorQtyFromDeliveriesCont('" + keys +"','" +rowInd+ "')\"";
		var saveFunc= "\"MCD.save('" + keys +"')\"";
		messagingDiv(htmlErrors, saveFunc,canceFunc);		
	}

	else
	{		
		MCD.showColorQtyFromDeliveriesCont(keys,rowInd);
	}

}

//Tracker#:26776 ADD NAVIGATION FEATURE TO NAVIGATE FROM MANAGE CHANNELS AND DELIVERIES POP TO ENTER COLOR QTY POP UP
//Navigation to Color Qty screen
MCD.showColorQtyFromDeliveriesCont = function showColorQtyFromDeliveriesCont(keys,rowInd)
{	
	closeMsgBox();
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();

	if(objAjax)
	{		
	  objAjax.setActionURL("colorqty.do");
	  objAjax.parameter().add("keyinfo", keys);
	  objAjax.parameter().add("rwno", rowInd);
	  objAjax.setActionMethod("showclrpopup");
	  objAjax.setProcessHandler(MCD.colorQtyResponse);
	  objAjax.sendRequest();
	}	
}

//Tracker#:26776 ADD NAVIGATION FEATURE TO NAVIGATE FROM MANAGE CHANNELS AND DELIVERIES POP TO ENTER COLOR QTY POP UP
//set the width and height of Color Qty pop up screen
MCD.colorQtyResponse = function colorQtyResponse(objAjax) 
{
	if (objAjax) 
	{
		if (bShowMsg == true) 
		{
			msgInfo = objAjax.getAllProcessMessages();
			if (msgInfo != "") 
			{
				_displayProcessMessage(objAjax);
			}
		}
		if (objAjax.isProcessComplete()) 
		{
			var height = $(window.parent).height() - 40;
			var width = $(window.parent).width() - 40;
			var colorqtypopup = new ColorQtyPopUp("ColorQtyPopUp",
					"Enter Color Quantities", objAjax.getResult(), height,
					width);
			colorqtypopup.show();
			if(manageChannelDialog) 
			  {     
					
					manageChannelDialog.html('');
					manageChannelDialog.dialog('destroy');
					manageChannelDialog.remove();
					//var objdata = htmlAreaObj.getHTMLDataObj();
			 		//objdata.resetChangeFields();
			 		MCD.resetFlds();			 		
			  }
		}
		objAjax = null;
   }	
}

MCD.sizeClick = function sizeClick(row,keyinfo,planid,storetype){
	//alert("Size breakdown under implementation!!");
	openWin('sizeoffassoc.do?method=viewoc&rows='+row+'&parent_doc_id=11700&parent_level_id=0&displayNavigation=2&planid='+planid+'&storetype='+storetype+'&assockeyinfo='+keyinfo+'',800,400);
	
}
function goToPage(row){
	var planid=getval('planid');
	var storetype=getval('storetype');
	var keyinfo=getval('assockeyinfo');
	if (getval('chgflds') != "")
    {
        if (confirm('There are changes on the screen. Do you want to save changes before current action?'))
        {
            fsubmit(szSAVE);
            bDisp = false;
        }
   }
    
	row=row-1;
	openWin('sizeoffassoc.do?method=viewoc&rows='+row+'&parent_doc_id=11700&parent_level_id=0&displayNavigation=2&planid='+planid+'&storetype='+storetype+'&assockeyinfo='+keyinfo+'',800,400);
	  

}


//Tracker#:26790 ADD GO TO BUTTON TO LOAD THE SELL CHANNELS FROM THE SELECTED ITEM NO FOR MANAGE CHANNELS AND DELIVER
//Handles the Navigation to the item no searched on the manage channels & deliveries screen Go Text Box
MCD.ctbtngo = function ctbtngo(keys) 
{
	
	var chngdFlds;
	//identify the proper area object based on doc view id
	//logic to check for changed fields based on the view
	var areaObj =_getAreaObjByDocView(11703);
	var objHtmlData = areaObj.getHTMLDataObj();    
    var objAjax = areaObj.getHTMLAjax();
    chngdFlds=objHtmlData.getChangeFields();
    
	var areaObj11704 =_getAreaObjByDocView(11704);
	
	var objHtmlData11704;
	var objAjax11704;
	if(areaObj11704!=null)
	{				
		objHtmlData11704 = areaObj11704.getHTMLDataObj();     
		objAjax11704 = areaObj11704.getHTMLAjax();	 
	}
		
	if(objHtmlData11704!=null && objHtmlData11704.hasUserModifiedData()==true)
	{
		objHtmlData.addToChangedFields(objHtmlData11704.getChangeFields());
		
		if(chngdFlds!=null)
		{
			chngdFlds=chngdFlds+","+objHtmlData11704.getChangeFields();
		
		}
		else
		{
			chngdFlds=objHtmlData11704.getChangeFields();
		}
		objHtmlData11704.appendChangeFieldsCtrlInfoToRequest(objAjax);		
	}
	
	
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objHtmlData = htmlAreaObj.getHTMLDataObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	
	// get the item no entered in the item no text box
	var itemNo = document.getElementById("gototextbox");
	var itemval;
	if (itemNo) 
	{
		itemval = itemNo.value;
					
			if (chngdFlds != null && chngdFlds != "") 
			{					
				var htmlErrors = objAjax.error();
				htmlErrors.addError("confirmInfo", szMsg_Changes, false);
				var canceFunc = "\"MCD.ctbtngocont('" + itemval +"')\"";					
				var saveFunc="\"MCD.save('" + keys +"')\"";				
				messagingDiv(htmlErrors, saveFunc, canceFunc);
				return;
			} 
			
			else 
			{				
				MCD.ctbtngocont(itemval);
			}

		
	}

}
//Tracker#:26790 ADD GO TO BUTTON TO LOAD THE SELL CHANNELS FROM THE SELECTED ITEM NO FOR MANAGE CHANNELS AND DELIVER
//Navigation to the managechanneldeliveries action class if no save changes done 
MCD.ctbtngocont = function ctbtngocont(itemno) 
{
	//reset changefields
	chngdFlds = "";
	//if save changes div opened close it
	if (document.getElementById("msgDiv") != null) 
	{
		closeMsgBox();
	}
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objHtmlData = htmlAreaObj.getHTMLDataObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	bShowMsg = true;
	//add item no as parameter so that searched item no can be matched in the search rowset
	objAjax.parameter().add("itemno", itemno);
	objAjax.setActionURL("managechanneldeliveries.do");
	objAjax.setActionMethod("goto");
	objAjax.setProcessHandler(MCD.reloadDiv);
	objAjax.sendRequest();	
}
//Tracker#:26790 ADD GO TO BUTTON TO LOAD THE SELL CHANNELS FROM THE SELECTED ITEM NO FOR MANAGE CHANNELS AND DELIVER
//Enable/Disable goto button based on whether user enters data/does not enter data in goto input text box
MCD.gotobutton = function gotobutton() 
{	
	//check the input text box for any user data
	var itemNo = document.getElementById("gototextbox");
	var itemvalgoto = itemNo.value;
	//If user entered data enable goto button
	if (itemvalgoto != null || itemvalgoto != "") 
	{	
		$("#btngo-mng").removeClass();
		$("#btngo-mng").addClass("clsbtnbottom");
		$("#btngo-mng").removeAttr("disabled");	
	}
	
	//If user did not enter data disable goto button
	if (itemvalgoto == null || itemvalgoto == "") 
	{
		$("#btngo-mng").removeClass();
		$("#btngo-mng").addClass("clsbtnbottom clspassiv");
		$("#btngo-mng").attr('disabled', 'disabled');
	}
}
MCD.gotoColorQty=function gotoColorQty(channelTypes,keyinfo,rwno){
	if(manageChannelDialog!= undefined && manageChannelDialog!=null && manageChannelDialog!="" ){
 		var isOpen = manageChannelDialog.dialog( "isOpen" );
 		if(isOpen!=null && isOpen==true){	
 			MCD.close(null);
 		}
		}
    var objAjax = new htmlAjax();
    objAjax.setActionMethod("frmanagecpopupstore");
    objAjax.setActionURL("colorqty.do");
    objAjax.parameter().add("filteredsc",channelTypes);
    objAjax.parameter().add("keyinfo",keyinfo);
    objAjax.parameter().add("rwno",rwno);
    
    objAjax.setProcessHandler(CQ.colorQtyResponse);
    objAjax.sendRequest();
}
