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
 * The Cost optimization screen specific functions
 * Tracker#:25709 FR-01.2 ADD PROCESS SUBMIT OFFER
 */

var CO = {};

//Added save function specific  to CO screen
//Tracker#:25712 FR-01.5 ADD SAVE PROCESS/MASS UPDATE ACROSS RFQ'S
CO.save = function save()
{
	//alert("in save");
	var chngdFlds;
	//identify the proper area object based on doc view id
	var areaObj =_getAreaObjByDocView(140);
	var objHtmlData = areaObj.getHTMLDataObj();    
    var objAjax = areaObj.getHTMLAjax();
    chngdFlds=objHtmlData.getChangeFields();
    
	var areaObj141 =_getAreaObjByDocView(141);
	var objHtmlData141;
	var objAjax141;
	if(areaObj141!=null)
	{				
	 objHtmlData141 = areaObj141.getHTMLDataObj();     
	 objAjax141 = areaObj141.getHTMLAjax();	 
	}
	
    var areaObj16501 =_getAreaObjByDocView(16501);
    var objHtmlData16501;
	var objAjax16501;
	if(areaObj16501!=null)
	{		
	 objHtmlData16501 = areaObj16501.getHTMLDataObj();     
	 objAjax16501 = areaObj16501.getHTMLAjax();	 
	}
       
	var areaObj16502 =_getAreaObjByDocView(16502);
	var objHtmlData16502;
	var objAjax16502;
	if(areaObj16502!=null)
	{
	 objHtmlData16502 = areaObj16502.getHTMLDataObj();     
	 objAjax16502 = areaObj16502.getHTMLAjax();
	}		
	
	var areaObj16401 =_getAreaObjByDocView(16401);
	var objHtmlData16401;
	var objAjax16401;
	if(areaObj16401!=null)
	{
	 objHtmlData16401 = areaObj16401.getHTMLDataObj();     
	 objAjax16401 = areaObj16401.getHTMLAjax();	 
	}	
	
	if(objHtmlData141!=null && objHtmlData141.hasUserModifiedData()==true)
	{
		objHtmlData.addToChangedFields(objHtmlData141.getChangeFields());
		if(chngdFlds!=null)
		{
			chngdFlds=chngdFlds+","+objHtmlData141.getChangeFields();
		}
		else
		{
			chngdFlds=objHtmlData141.getChangeFields();
		}
		objHtmlData141.appendChangeFieldsCtrlInfoToRequest(objAjax);		
	}
	if(objHtmlData16501!=null && objHtmlData16501.hasUserModifiedData()==true)
	{
		objHtmlData.addToChangedFields(objHtmlData16501.getChangeFields());		
		if(chngdFlds!=null)
		{
			chngdFlds=chngdFlds+","+objHtmlData16501.getChangeFields();
		}
		else
		{
			chngdFlds=objHtmlData16501.getChangeFields();
		}
		
		objHtmlData16501.appendChangeFieldsCtrlInfoToRequest(objAjax);
	}
	if(objHtmlData16502!=null && objHtmlData16502.hasUserModifiedData()==true)
	{
		objHtmlData.addToChangedFields(objHtmlData16502.getChangeFields());		
		if(chngdFlds!=null && chngdFlds!="")
		{			
			chngdFlds=chngdFlds+","+objHtmlData16502.getChangeFields();
		}
		else
		{			
			chngdFlds=objHtmlData16502.getChangeFields();
		}
		objHtmlData16502.appendChangeFieldsCtrlInfoToRequest(objAjax);
	}
	if(objHtmlData16401!=null && objHtmlData16401.hasUserModifiedData()==true)
	{		
		objHtmlData.addToChangedFields(objHtmlData16401.getChangeFields());
		if(chngdFlds!=null && chngdFlds!="")
		{
			chngdFlds=chngdFlds+","+objHtmlData16401.getChangeFields();
		}
		else
		{
			chngdFlds=objHtmlData16401.getChangeFields();
		}
		objHtmlData16401.appendChangeFieldsCtrlInfoToRequest(objAjax);
	}
	
	var strChngFld=encodeURIComponent(chngdFlds);
	//objAjax.parameter().add(strChngFld);	
	
	if(objHtmlData!=null && (objHtmlData.hasUserModifiedData()==true || (strChngFld!=null && strChngFld!="")))
    {				
		bShowMsg = true;			
		//alert("length"+strChngFld.length);		
		
		objAjax.setActionURL("costoptimization.do");
		objAjax.setActionMethod("post");
		objAjax.parameter().add("chgflds", chngdFlds);		
		objAjax.setActionMethod("save");
		//objAjax.setActionMethod("save&chgflds="+strChngFld);
		objAjax.setProcessHandler(CO.pResp);
		objHtmlData.performSaveChanges(CO.pResp,objAjax);  
		objHtmlData.resetChangeFields();
		CO.resetFlds();
    }
    else
    {
    	var objAjax = new htmlAjax();
    	objAjax.error().addError("warningInfo", szMsg_No_change, false);
    	_displayProcessMessage(objAjax);
       // _displayUserMessage(szMsg_No_change);
    }
    
    
    AutoSuggestContainer.clearComponents();
}

//hanlde all offer level processes
CO.executeProc = function executeProc(act)
{	

	var htmlAreaObj =_getAreaObjByDocView(141);
	if(htmlAreaObj!=null )
	{
		//alert("click here");
		var objAjax = htmlAreaObj.getHTMLAjax();
		var objHTMLData = htmlAreaObj.getHTMLDataObj();
		//alert("modified"+objHTMLData.hasUserModifiedData());
		if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
		{
			var htmlErrors = objAjax.error();
			objAjax.error().addError("warningInfo", "Please select one or more rows.", false);
			messagingDiv(htmlErrors);
			return;
		}
		else
		{
			// Tracker 25756, objHtmlData (DOC_VIEW_ID=10) should be objHTMLData (DOC_VIEW_ID+141), case sensitive
			// Bug: OFFER_NO was missing in server side
			var chngFlds= objHTMLData.getChangeFields();
			//alert("chngFlds"+chngFlds);
			bShowMsg = true;

			if(act == "emailoffer"){
        	 var selectedRows = CO.checkForDetailSelection(objHTMLData.getChangeFields());
				if(selectedRows != null  && selectedRows != "")
				{
					objAjax.parameter().add("keyinforows", selectedRows);
				}
			}
			objAjax.setActionURL("costoptimization.do");
			objAjax.setActionMethod(act);
			objAjax.setProcessHandler(CO.pResp);
			objHTMLData.performSaveChanges(CO.pResp,objAjax);
			objHTMLData.resetChangeFields();
			CO.resetFlds();
         //executeDocumentProcess("costoptimization.do", act, false, true);
		}
	}
	else
	{
		//alert("else block");
		var objAjax = new htmlAjax();
		var htmlErrors = objAjax.error();
		objAjax.error().addError("warningInfo", "Please select one or more rows.", false);
		messagingDiv(htmlErrors);
		return;
	}
}


CO.pResp =function(objAjax)
  {	
	if (objAjax) {
		// alert(objAjax.isProcessComplete());
		if (objAjax.isProcessComplete()) {
			$("#MainSection_divCollapsable").html(objAjax.getResult());
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
	CO.resetFlds();
	// refreshNavigationGrid(objAjax);

    // Tracker#: 25828
    // Reset the temporary list which holds the grid cells ids
    // that has been fired programatically in order
    // to retain the same state which user runs on any process.
    gridhandler.retainUserState();
    objAjax = null;
}

CO.resetFlds =function()
  {
	// alert("called clear");
	var areaObj = _getAreaObjByDocView(140);
	var objHtmlData = areaObj.getHTMLDataObj();
	objHtmlData.resetChangeFields();

	var areaObj141 = _getAreaObjByDocView(141);
	var objHtmlData141;
	var objAjax141;
	if (areaObj141 != null) {
		objHtmlData141 = areaObj141.getHTMLDataObj();
		objAjax141 = areaObj141.getHTMLAjax();
		objHtmlData141.resetChangeFields();
		objAjax141 = null;
	}

	var areaObj16501 = _getAreaObjByDocView(16501);
	var objHtmlData16501;
	var objAjax16501;
	if (areaObj16501 != null) {
		objHtmlData16501 = areaObj16501.getHTMLDataObj();
		objAjax16501 = areaObj16501.getHTMLAjax();
		objHtmlData16501.resetChangeFields();
		objAjax16501 = null;
	}

	var areaObj16502 = _getAreaObjByDocView(16502);
	var objHtmlData16502;
	var objAjax16502;
	if (areaObj16502 != null) {
		objHtmlData16502 = areaObj16502.getHTMLDataObj();
		objAjax16502 = areaObj16502.getHTMLAjax();
		objHtmlData16502.resetChangeFields();
		objAjax16502 = null;
	}

	var areaObj16401 = _getAreaObjByDocView(16401);
	var objHtmlData16401;
	var objAjax16401;
	if (areaObj16401 != null) {
		objHtmlData16401 = areaObj16401.getHTMLDataObj();
		objAjax16401 = areaObj16401.getHTMLAjax();
		objHtmlData16401.resetChangeFields();
		objHtmlData16401 = null;
	}
}
CO.checkForDetailSelection=function(chgFields)
{
		var keyMap = {};
		if(chgFields != null && chgFields.length > 0)
		{
			for(var i = 0 ; i < chgFields.length ; i++)
			{
				var fieldName = chgFields[i];
				var arr = fieldName.split("__");
				keyMap[arr[2]]="";
			}
		}

		var keyinfoandrowNos = "";
		if(chgFields != null && chgFields.length > 0)
		{
			for(var i = 0 ; i < chgFields.length ; i++)
			{
				var fieldName = chgFields[i];
				for(var keys in keyMap)
				{

					var keypatt=new RegExp(keys);
					if(keypatt.test(fieldName))
					{

						var rowNo = _getRepeateCountFromCompName(fieldName);
                        keyMap[keys]+=rowNo + ",";
					}
				}
			}
			for(var keys in keyMap)
			{
				keyinfoandrowNos+= keys+":"+keyMap[keys] + "_";
			}

		}
		return keyinfoandrowNos;
}




CO.showRFQ = function showRFQ(linkObj)
{
	var htmlAreaObj =_getAreaObjByDocView(140);
	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    var keys = linkObj.getComponentKeyInfo();


     if(objHTMLData && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
    {
        var htmlErrors = objAjax.error();
        htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
        var saveFunc = "\"CO.save()\"";
        var canceFunc = "\"CO.showCostOptRFQ('" + keys + "')\"";
        messagingDiv(htmlErrors, saveFunc, canceFunc);
    }
    else
    {
    	CO.showCostOptRFQ(keys);
   	}
}

CO.showCostOptRFQ = function showCostOptRFQ(keys)
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();

	if(objAjax)
	{
	    objAjax.setActionURL("costoptimization.do");
	    objAjax.parameter().add("keyinfo", keys);
        objAjax.setActionMethod("gotoRFQ");
        objAjax.setProcessHandler(CO.displayRFQ);
        objAjax.sendRequest();
	}
 }

CO.displayRFQ = function displayRFQ(objAjax)
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
    var keyMap = CO.getKeyMap(keys);

   	waitWindow();
    var hrefVal = 'search.do?method=qsearch&doc_view_id=100&owner=' + keyMap['OWNER']
    				+ '&operator=9&fld_name=REQUEST_NO&qs_val=' + keyMap['REQUEST_NO'];
    window.location.href=hrefVal;
    waitWindow();
}
CO.showOffer = function showOffer(linkObj) {


	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    var keys = linkObj.getComponentKeyInfo();

    if(objHTMLData && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
    {
        var htmlErrors = objAjax.error();
        htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
        var saveFunc = "\"CO.save()\"";
        var canceFunc = "\"CO.showCostOptOffer('" + keys + "')\"";
        messagingDiv(htmlErrors, saveFunc, canceFunc);
    }
    else
    {

    	CO.showCostOptOffer(keys);
   	}
}

CO.showCostOptOffer = function showCostOptOffer(keys)
{

	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    if(bShowMsg==true)
   	{
   		msgInfo = objAjax.getAllProcessMessages();
		//alert(" msgInfo: \n "+msgInfo);
	    if(msgInfo!="")
	    {
	    	//alert("display called");
	        _displayProcessMessage(objAjax);
	        Main.resetDefaultArea();
	    }
   	}
	if(objAjax)
	{

		var keyMap = CO.getOfferKeyMap(keys);
		waitWindow();
		var hrefVal = "fwd2.do?method=whatifoffer&owner="+ keyMap['OWNER'] + "&request_no=" + keyMap['REQUEST_NO']+ "&offer_no=" + keyMap['OFFER_NO'];
		window.location.href=hrefVal;
		waitWindow();



	}
}



CO.getKeyMap  = function getKeyMap(keyArr)
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
    	else if(keyType == "OFFER_NO")
    	{
    		keyMap['OFFER_NO'] = key[1];
    	}
    }
    return keyMap;
}
CO.getOfferKeyMap  = function getOfferKeyMap(keyArr)
{
	var keyMap = {};
	var arr = keyArr.split("~@");
    for(var keys in arr)
    {
    	var key = arr[keys].split("@@");
    	var keyType = key[0];

    	if(keyType == "OWNER")
    	{
    		keyMap['OWNER'] = key[1];
    	}
    	else if(keyType == "REQUEST_NO")
    	{
    		keyMap['REQUEST_NO'] = key[1];
    	}
    	else if(keyType == "OFFER_NO")
    	{
    		keyMap['OFFER_NO'] = key[1];
    	}
    }
    return keyMap;
}

CO.bomCompare = function bomCompare()

{

var objHtmlData  = _getAreaHTMLDataObjByDocView(141);
var objAjax;

	//alert("changefields " + objHtmlData.getChangeFields());
	if(objHtmlData!=null && (objHtmlData.hasUserModifiedData()==true || (objHtmlData.getChangeFields()!=null && objHtmlData.getChangeFields()!="")))
	{

		objAjax = new htmlAjax();
		objAjax.setActionURL("bomcomparison.do");
		objAjax.setActionMethod("bomcompare");
		objAjax.setProcessHandler(CO.bomComapreResponse);
		// objAjax.parameter().add("parentViewId", 321);
		objAjax.parameter().add("chgflds", objHtmlData.getChangeFields());
		objAjax.sendRequest();



	}

	else
	 {
	    	objAjax = new htmlAjax();
	    	objAjax.error().addError("warningInfo", "Please select one or more offer rows to compare.", false);


	    	_displayProcessMessage(objAjax);
	    	objAjax=null;
	    }
}
function  sameQuotebomCompare()

{
  var objHTMLData  = _getAreaHTMLDataObjByDocView(141);
  objAjax = new htmlAjax();
  objAjax.setActionURL("bomcomparison.do");
  objAjax.setActionMethod("SameRFQbomcompare");
  objAjax.setProcessHandler("bomComapreResponse");
   objAjax.parameter().add("chgflds", objHtmlData.getChangeFields());
  objAjax.sendRequest();
}
function  bomDelete(keyIndex)

{

		var objHTMLData  = _getAreaHTMLDataObjByDocView(141);

 objAjax = new htmlAjax();
  objAjax.setActionURL("bomcomparison.do");
  objAjax.setActionMethod("bomDelete");
  objAjax.setProcessHandler("bomComapreDeleteResponse");
 // objAjax.parameter().add("parentViewId", 321);
  objAjax.parameter().add("chgflds", objHtmlData.getChangeFields());
  objAjax.sendRequest();
}


//align two tables
function alignTables(a, b,c)
{
  var obj1 = getElemnt(a);
   if(obj1)
	   {
	   	d1w = obj1.offsetWidth;
	    for(var i = 0 ; i < b ; i++)

		 {
		   for(var j = 0 ; j < c ; j++)
		   {

				if(getElemnt(j+"-"+i))
				{
				  setWidth(getElemnt(j+"-"+i), d1w);

				}

		   }

		}

   }

}
function alignTablesHeight(b,c)
{
var nRowCount;
var	i=0;
 for(var j = 0 ; j < c ; j++)
   {
      
   
	
	t1o = getElemnt(j+"-"+0);
       t2o = getElemnt(j+"-"+1);
	t3o = getElemnt(j+"-"+2);
	t4o = getElemnt(j+"-"+3);



	    if(t1o )
	    {
		
		 nRowCount = t1o.getElementsByTagName("tr").length;
		

	     }
		i=0;
		
		while(i < nRowCount)
		{
		    try
		    {
			
		    	
		    	
		    if(t2o && t3o && t4o)
			{
				//alert("t2o"+t2o);
			tro1 = t1o.getElementsByTagName("tr").item(i).getElementsByTagName("td").item(0);
			//alert("tro1"+tro1);
			tro2 = t2o.getElementsByTagName("tr").item(i).getElementsByTagName("td").item(0);
			//alert("tro2"+tro2);
			tro3 = t3o.getElementsByTagName("tr").item(i).getElementsByTagName("td").item(0);
			//alert("tro3"+tro3);
			tro4 = t4o.getElementsByTagName("tr").item(i).getElementsByTagName("td").item(0);
			//alert("tro4"+tro4);
			
			
			
			d1w = tro1.offsetHeight;
			// alert("d1w"+d1w);
			
			 d2w = tro2.offsetHeight;
			// alert("d2w"+d2w);
			 d3w = tro3.offsetHeight;
			// alert("d3w"+d3w);
			 d4w = tro4.offsetHeight;
			// alert("d4w"+d4w);

			if( d1w<d2w)
			{
			d1w=d2w;
			}
			if( d1w<d3w)
			{
			d1w=d3w;
			}
			if( d1w<d4w)
			{
			d1w=d4w;
			}
			// alert("d1w"+d1w);
			setHeight(tro1, d1w);
			setHeight(tro2, d1w);
			setHeight(tro3, d1w);
			setHeight(tro4, d1w);
			

			}

			else if(t2o && t3o )
			{
			  tro1 = t1o.getElementsByTagName("tr").item(i).getElementsByTagName("td").item(0);
			  tro2 = t2o.getElementsByTagName("tr").item(i).getElementsByTagName("td").item(0);
			  tro3 = t3o.getElementsByTagName("tr").item(i).getElementsByTagName("td").item(0);
			  d1w = tro1.offsetHeight;
			  d2w = tro2.offsetHeight;
			  d3w = tro3.offsetHeight;
			if( d1w<d2w)
			{
			d1w=d2w;
			}
			if( d1w<d3w)
			{
			d1w=d3w;
			}
			
			
			setHeight(tro1, d1w);
			setHeight(tro2, d1w);
			setHeight(tro3, d1w);
			
			

			}

			else if(t2o && t1o )
			{
			  tro1 = t1o.getElementsByTagName("tr").item(i).getElementsByTagName("td").item(0);
			  tro2 = t2o.getElementsByTagName("tr").item(i).getElementsByTagName("td").item(0);
			  d1w = tro1.offsetHeight;
			  d2w = tro2.offsetHeight;
			 
			if( d1w<d2w)
			{
			d1w=d2w;
			}
			
			setHeight(tro1, d1w);
			setHeight(tro2, d1w);
			}

		    }
		    catch (e)
		    {
			alert("error align table at " + i + "\n" + e.decription);
		    }

		    i++;
		}
	    


}

}
//Removing extra padding space from Div
function chageDivPadding(a )
{
	document.getElementById(a).style["paddingBottom"]  = "0px";

}
CO.bomComapreResponse  =function(objAjax)
 {
 	if(objAjax)
 	{
 		msgInfo = objAjax.getAllProcessMessages();

	    if(msgInfo!="")
	    {
	       //_displayUserMessage(msgInfo);
	        _displayProcessMessage(objAjax);
	        objAjax = null;

	    }


 		else
 		{

	 			if(objAjax.isProcessComplete())
	 		   {
	 			var comments = new CO.openbomCompare("BOM Comparison", objAjax.getResult());
	 			comments.show();
	 		   }

 		}




 	}
 }

function  bomDelete(keyIndex)

{
	var objHTMLData  = _getAreaHTMLDataObjByDocView(141);
	objAjax = new htmlAjax();
	objAjax.setActionURL("bomcomparison.do");
	objAjax.setActionMethod("bomDelete");
	objAjax.setProcessHandler("bomComapreDeleteResponse");
 // objAjax.parameter().add("parentViewId", 321);
  objAjax.parameter().add("keyindex", keyIndex);
  objAjax.sendRequest();
}
function bomComapreDeleteResponse()
{
	if(objAjax)
	{
		if(objAjax.isProcessComplete())
		{
			bomCompareDialog.html(objAjax.getResult());
		}
		objAjax = null;
	}
}
 /*if (!TRADESTONE)
 {
     var TRADESTONE = new Object();
 }*/


 var bomCompareDialog;
 var newCommentsDiv;

 CO.openbomCompare = function(_commentTitle, _commentHTML)
 {
 	var commentTitle = _commentTitle;
 	var commentHTML = _commentHTML;
 	this.show = function()
 	{
 		var commentsDiv = document.createElement('div');

    		$(commentsDiv).attr("id", "Comment");

    		bomCompareDialog = $(commentsDiv).dialog({
    		title: commentTitle,
            height: 650,
 			width : 1100,
 			zIndex: 600,
 			modal : true,
 			close : function(event, ui) {
    						if(newCommentsDiv) {
    							newCommentsDiv.dialog("close");


    						}

             			$(this).html('');
             			$(this).dialog('destroy');
             			$(this).remove();
         			}
    		});
    		$(commentsDiv).css('overflow','auto');
    		var titleBar = $(".ui-dialog-titlebar a.ui-dialog-titlebar-close");
     	titleBar.removeClass("ui-corner-all");
    		titleBar.find(".ui-icon").html("<img src='images/close_top.gif' border='0'/>").removeClass();

    		bomCompareDialog.html(commentHTML);

 	    $('#nav').collapsible({xoffset:'-12',yoffset:'10', imagehide: 'images/arrowdown.gif', imageshow: 'images/Rarrow.gif', defaulthide: false});

 	    //CommentsJsModule.styleActiveRecent();
 		//CommentsJsModule.styleThreadedFlat();

 		// Attache enter event.
 		$('#commentsSearch').keyup(function(e) {
 			if(e.keyCode == 13) {
 				CommentsJsModule.commentsSearch();
 			}
 		});
 	};
 	//Tracker#:23067  FDD 374 FR2,3 AND 6 -> GLOBAL SEARCH - PARTY : ADD PARTY AS PART OF GLOBAL SEARCH
 	// exposed close function to invoke from rfq supplier recommendation popup after post process executes.
 	this.close = function() {
 		if(newCommentsDiv) {
 				newCommentsDiv.dialog("close");
 			}

 		if(bomCompareDialog) {

 			bomCompareDialog.html('');
 			bomCompareDialog.dialog('destroy');
 			bomCompareDialog.remove();
 			var objdata = htmlAreaObj.getHTMLDataObj();
 	 		objdata.resetChangeFields();
 	 		CO.resetFlds();
 	 		// refreshNavigationGrid(objAjax);



 		}



 	}
}
  
 //calculate and set the value
 CO.calculate= function calculate(docViewId, unit,pack, qty, scale)
  {
	var htmlAreaObj = _getAreaObjByDocView(docViewId);
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();

	var unitval = parseFloat(document.getElementById(unit).value);
	// alert(unitval);
	var packval = parseFloat(document.getElementById(pack).value);
	// alert(packval);
	var qtyPerInnerVal = (unitval * packval).toFixed(scale);
	if (!isNaN(qtyPerInnerVal)) {
		var oc = document.getElementsByName(qty);
		if (oc)
			oc = oc[0];
		oc.value = qtyPerInnerVal
		oc.value = replaceval(oc, CommaDelimiter, Blank);
		_notifyChangeFields(oc, 3);
	}

}
 
 //calculate qty_per_inner 
 CO.calcQtyPerInner = function calcQtyPerInner(docViewId, unit,pack, qty, scale)
  {
	 CO.calculate(docViewId, unit,pack, qty, scale);	
 }

 //calculate qty_per_pack
 CO.calcCaseUnits = function calcCaseUnits(docViewId, qtyperinner,noinner, qtyperpack, scale)
 {
	 CO.calculate(docViewId, qtyperinner,noinner, qtyperpack, scale);   
 }

 
//hanlde all quote/offer level custom processes
 CO.executeCustomRule = function executeCustomRule(docViewId, ruleName, level, flag)
 {	
 	var htmlAreaObj =_getAreaObjByDocView(docViewId);
 	if(htmlAreaObj!=null )
 	{
 		//alert("click here");
 		var objAjax = htmlAreaObj.getHTMLAjax();
 		var objHTMLData = htmlAreaObj.getHTMLDataObj();
 		//alert("modified"+objHTMLData.hasUserModifiedData());
 		if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
 		{
 			var htmlErrors = objAjax.error();
 			objAjax.error().addError("warningInfo", "Please select a valid row", false);
 			messagingDiv(htmlErrors);
 			return;
 		}
 		else
 		{
 			var chngFlds= objHTMLData.getChangeFields(); 			
 			bShowMsg = true;
 			objAjax.setActionURL("costoptimization.do");
 			objAjax.setActionMethod("customrule"); 			
 			objAjax.parameter().add("chgflds", chngFlds);
 			objAjax.parameter().add("id", ruleName); 			
 			objAjax.parameter().add("docviewid", docViewId);
 			objAjax.parameter().add("level", level);
 			objAjax.parameter().add("saveRuleCheckReq", flag);
 			objAjax.setProcessHandler(CO.pResp);
 			objHTMLData.performSaveChanges(CO.pResp,objAjax);
 			objHTMLData.resetChangeFields();
 			CO.resetFlds();          
 		}
 	}
 	else
 	{
 		//alert("else block");
 		var objAjax = new htmlAjax();
 		var htmlErrors = objAjax.error();
 		objAjax.error().addError("warningInfo", "Please select a valid row", false);
 		messagingDiv(htmlErrors);
 		return;
 	}
 }

