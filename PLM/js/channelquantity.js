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
 * This JS File was created to handle the events and processes on Quantities by Delivery screen.
 * The Prefix for the methods in this JS file is CHQ 
 * Date: Sep 02,2014
 */

var CHQ = {};

//Tracker#:26979 IMPLEMENT THE COLOR INFO POP UP WHEN USER HOVERS HIS MOUSE ON COLOR CHIP
CHQ.showSmartTagView = function showSmartTagView(htmlfldName, objImg, tagDocId,tagDocVwId,custom,keyInfo,actCompId)
{	
   _showSmartTagView(htmlfldName, objImg, tagDocId,tagDocVwId,custom,keyInfo,actCompId,false);	
}

//Tracker#:26979 IMPLEMENT THE COLOR INFO POP UP WHEN USER HOVERS HIS MOUSE ON COLOR CHIP
CHQ.hideLine = function hideLine()
{
	//Remove Unnecessary Blank HTML sections on the pop up
	$("table#_tableMain13701_0 table#_tableHeaderBarid_0").removeClass("clsoverviewsectionheader");	
	//Remove unnecessary line breaks
	$('td #colorInfoTD br:first').remove();	
}

//Tracker#:26980 IMPLEMENT THE COLOR QTY POP UP WHEN USER HOVERS HIS MOUSE ON COLOR QUANTITY SMART TAG
CHQ.hideLineFromPopUp = function hideLine()
{
	//Remove Unnecessary Blank HTML sections on the pop up
	$("table#_tableMain13702_0 table#_tableHeaderBar13702_0").removeClass("clssectionheader");
}

//Tracker#:26980 IMPLEMENT THE COLOR QTY POP UP WHEN USER HOVERS HIS MOUSE ON COLOR QUANTITY SMART TAG
CHQ.adjustLabelHeaderOfPopUp = function adjustLabelHeaderOfPopUp()
{
	//To align the QTY, % Qty fields to center while displaying the pop up
	$("#13702_0_one_table_one_table tr:first td:gt(0)").css('text-align','right');
}

CHQ.placeMouseCursorPosition = function placeMouseCursorPosition(objId)
{
	var pointX = $("#"+objId).offset().left - 15;
	var pointY = $("#"+objId).offset().top - 10;
	var pointZ = parseInt($("#"+"_smartDiv").css("z-index")) + 100;
	
	$("#13702").offset({top: pointY,left: pointX});
	$("#13702").css("z-index",pointZ);
	
	
}

//Tracker#:26979 IMPLEMENT THE COLOR INFO POP UP WHEN USER HOVERS HIS MOUSE ON COLOR CHIP
CHQ.removeExtraLineBreaks = function removeExtraLineBreaks(id)
{	
	$.browser.chrome = /chrom(e|ium)/.test(navigator.userAgent.toLowerCase()); 
	//For Chrome Browser, no alignment of the pop up display required 
	if($.browser.chrome)
	{
		return;
	}
	//For IE,Mozilla and Safari Browsers,done alignment of the pop up display 
	if($.browser.msie || $.browser.safari || $.browser.mozilla)
	{
		$('td #'+id+' br').remove();
	}	
}

//Tracker#:26983 - IMPLEMENT THE NAVIGATION FROM SEARCH LIST SCREEN TO RFQ SCREEN
//when user clicks on the REQUEST_NO link-If any changes are done we check and save, else we navigate to RFQ screen
CHQ.showRFQ = function showRFQ(linkObj)
{	
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    var keys = linkObj;
    
    if(objHTMLData && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
    {
        var htmlErrors = objAjax.error();
        htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
        var canceFunc = "\"CHQ.showQtyRFQ('" + keys + "')\"";
        messagingDiv(htmlErrors, "saveWorkArea()", canceFunc);
    }
    
    else
    {
    	CHQ.showQtyRFQ(keys);
   	}
}

//Tracker#:26983 - IMPLEMENT THE NAVIGATION FROM SEARCH LIST SCREEN TO RFQ SCREEN
//Navigation to RFQ screen
CHQ.showQtyRFQ = function showQtyRFQ(keys)
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();

	if(objAjax)
	{
	    objAjax.setActionURL("quantitiesbydelivery.do");
	    objAjax.parameter().add("keyinfo", keys);
        objAjax.setActionMethod("gotoRFQ");
        objAjax.setProcessHandler(CHQ.displayRFQ);
        objAjax.sendRequest();
	}
}

//Tracker#:26983 - IMPLEMENT THE NAVIGATION FROM SEARCH LIST SCREEN TO RFQ SCREEN
//Handles the navigation to RFQ screen once the quotekey is set in context attribute
CHQ.displayRFQ = function displayRFQ(objAjax)
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
    var keyMap = CHQ.getKeyMap(keys);

   	waitWindow();
    var hrefVal = 'search.do?method=qsearch&doc_view_id=100&owner=' + keyMap['OWNER']
    				+ '&operator=9&fld_name=REQUEST_NO&qs_val=' + keyMap['REQUEST_NO'];
    window.location.href=hrefVal;
    waitWindow();
}

//Tracker#:26983 - IMPLEMENT THE NAVIGATION FROM SEARCH LIST SCREEN TO RFQ SCREEN
//Get the REQUEST_NO,OWNER for the quote to which RFQ is to be displayed
CHQ.getKeyMap  = function getKeyMap(keyArr)
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
    }
    return keyMap;
}

//Tracker#:26980 - IMPLEMENT THE COLOR QUANTITIES POPUP FOR TOTAL QTY FIELD.
CHQ.showColorQtyPop = function showColorQtyPop(htmlfldName, objImg, tagDocId,tagDocVwId,custom,keyInfo,actCompId)
{
	_showSmartTagView(htmlfldName, objImg, tagDocId,tagDocVwId,custom,keyInfo,actCompId,false);
}

//Tracker#:26977 - PROVIDE THE SAVED SEARCHES, ADD CHANNEL AND SAVE BUTTONS ON QUANTITIES BY DELIVERY SCREEN
CHQ.addSellChannelsProcess = function addSellChannelsProcess()
{	
	
	var htmlAreaObj =_getAreaObjByDocView(190);
	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    //Add hash value to split the chgflds based on delimiter ,
    var chgflds=objHTMLData.getChangeFields()+"#";
    bShowMsg = true;
    var arr = chgflds.split(",");
    var i=0;	
    
    //for each row checked,get the primary key value of that row and append it to the change fields	
    //this can also be done in the java file using the rowset from which we can get the quote primary key info
    //As a standard practice we are passing the checked rowid appended with primary key of that selected quote from the js file
    $("input[type=checkbox]:checked").each ( function() {
    	var a=$(this).val();
    	if(i!=arr.length-1)
    	{
    	   arr[i]=arr[i]+"#";
    	   arr[i]=arr[i]+a;
    	}
    	else
    	{
    	   arr[i]=arr[i]+a;
    	}    	
    	i++;
        });
   
    if(objHTMLData!=null && (objHTMLData.getChangeFields()!=null && objHTMLData.getChangeFields()!=""))
    {      
        
    	if(objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
    	{
    		var htmlErrors = objAjax.error();
    		htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
    		var canceFunc = "\"CHQ.addSellChannelsProcessCont('" + arr + "')\"";
    		messagingDiv(htmlErrors, "saveWorkArea()", canceFunc);
       }   
    
       else
       {
    	   objHTMLData.resetChangeFields();
    	   //Continue the flow to add sell channels
    	   CHQ.addSellChannelsProcessCont(arr);
    	   
   	   }
  }
    
    else
	{
    	//No rows selected
		objAjax = new htmlAjax();
		objAjax.error().addError("warningInfo", szMsg_Sel_Detail_Record, false);
		_displayProcessMessage(objAjax);
		objAjax=null;  
	}
}

//Tracker#:26983 - IMPLEMENT THE NAVIGATION FROM SEARCH LIST SCREEN TO RFQ SCREEN
//Navigation to RFQ screen
CHQ.addSellChannelsProcessCont = function addSellChannelsProcessCont(arr)
{
	  bShowMsg=true;
	  objAjax = new htmlAjax();
	  objAjax.setActionURL("quantitiesbydelivery.do");
	  objAjax.setActionMethod("addsellchannels");
	  objAjax.parameter().add("chgflds", arr);	
	  objAjax.setProcessHandler(_showWorkArea);	     
	  objAjax.sendRequest();
	  CHQ.resetFlds(); 
}

CHQ.resetFlds =function()
{
	
	var areaObj = _getAreaObjByDocView(140);
	var objHtmlData = areaObj.getHTMLDataObj();
	objHtmlData.resetChangeFields();

	var areaObj190 = _getAreaObjByDocView(190);
	var objHtmlData190;
	var objAjax190;
	
	if (areaObj190!= null) {
		objHtmlData190 = areaObj190.getHTMLDataObj();
		objAjax190 = areaObj190.getHTMLAjax();
		objHtmlData190.resetChangeFields();
		objHtmlData190 = null;
	}
}



//Tracker#:26981 - IMPLEMENT THE PAGINATION AND SORT FUNCTIONALITY ON QUANTITIES BY DELIVERY SEARCH LIST SCREEN.
CHQ.sortColumn = function sortColumn(fieldName,sec,type, pageNo)
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = sec;
    var url = "SORT&sortColumn="+fieldName+"&sort="+type+"&pageNum="+pageNo;
    if(objHTMLData && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
	{
		var htmlErrors = objAjax.error();
		htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
        messagingDiv(htmlErrors, "saveWorkArea()", "laodPLMSortColumn('quantitiesbydelivery.do','"+url+"','CHQ.refreshPageAfterSort')");
        return;
	}
    else
	{
    	laodPLMSortColumn("quantitiesbydelivery.do", url, 'CHQ.refreshPageAfterSort');
	}
	
}

CHQ.refreshPageAfterSort = function refreshPageAfterSort(objAjax)
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
        _reloadArea(objAjax, sectionName);
        bShowMsg= false;
    }
}

//Tracker 26980 - IMPLEMENT THE COLOR QUANTITIES POPUP FOR TOTAL QTY FIELD
CHQ.onMouseOut = function onMouseOut(objId)
{
	$("#"+objId).hide();

}

//Tracker 26980 - IMPLEMENT THE COLOR QUANTITIES POPUP FOR TOTAL QTY FIELD
//To stop the bubbling, where, the event will be serched till the exact match will be avoided in our case
function _stopBubbleMouseOut(e)
{
	//alert("Inside "+e);
	try
	{
		if (window.event || !e)
		{
			e = window.event;
		}

		if(e.stopPropagation)
		{
			e.stopPropagation();
		}
		else
		{
			e.cancelBubble = true;
		}
	}
	catch(er)
	{
		alert(er.description);
	}
}

/**
 * Tracker#:26744
 * Reload the search list screen when the enter color qty pop up or the manage
 * deliveries pop up is closed
 */
CHQ.refreshPage = function refreshPage(act) {
	var htmlAreaObj = _getAreaObjByDocView(190);
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	if (objAjax) {
		objAjax.setActionURL("quantitiesbydelivery.do");
		// pass refresh method
		objAjax.setActionMethod(act);
		objAjax.setProcessHandler(_showWorkArea);
		
		objAjax.sendRequest();
	}
}
