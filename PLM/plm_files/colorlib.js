/*************************************/
/*  Copyright  (C)  2002 - 2008      */
/*           by                      */
/*  TradeStone Software, Inc.        */
/*  Gloucester, MA. 01930            */
/*  All Rights Reserved              */
/*  Printed in U.S.A.                */
/*  Confidential, Unpublished        */
/*  Property of                      */
/*  TradeStone Software, Inc.        */
/*************************************/
var sectionName;
var bShowMsg = false;
var activateNavigationScroll = false;

function getColorLibHTMLAjax()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
	//alert("htmlAreaObj " + htmlAreaObj);
    var objAjax = htmlAreaObj.getHTMLAjax();

    if(!objAjax)objAjax = new htmlAjax();
    return objAjax;
}

function showView(view, pageNo, sec)
{
     Process.sendRequest(sec,"colorlib.do", "HANDLEVIEW&pageNum="+pageNo+"&view="+view, _showColorLibPage);
}

function showPage(pageNo,sec)
{
    Process.sendRequest(sec,"colorlib.do", "PAGING&pageNum="+pageNo, _showColorLibPage);
}

function _showColorLibPage(objAjax)
{
    //alert(" _showColorLibPage: \n sectionName "+sectionName);
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

        if (_showWorkArea && _showWorkArea.toggleNav)
        {
        	/* Tracker#: 19807 - LEFT NAVIGATION NEEDS TO BE MADE COLLAPSIBLE
        	 * For PLM Search screens, need to remove reference in
        	 * _showWorkArea.toggleNav to old search results.
        	 */
        	_showWorkArea.toggleNav.unRegisterAll();
        }
    	
        _reloadArea(objAjax, sectionName);
        bShowMsg= false;
    }
}



function sortColorColumn(fieldName,sec,type, pageNo)
{
    //alert("sortColorColumn called");
    sectionName = sec;
  //Tracker#: 16691 MATERIAL PROJECTIONS - ENTER DATA, CLICK SORT, ROWS SORTED DATA IS LOST
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax =  htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    if(objAjax)
    {
    	//Tracker#: 16691 MATERIAL PROJECTIONS - ENTER DATA, CLICK SORT, ROWS SORTED DATA IS LOST
    	// Changes have been done, prompt the User
		// to decide whether the User will Save or
		// continue with the sorting.
		var url = "SORT&sortColumn="+fieldName+"&sort="+type+"&pageNum="+pageNo;
		if(objHTMLData!=null && objHTMLData.isDataModified())
        {
            var htmlErrors = objAjax.error();
            htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
	   		messagingDiv(htmlErrors, "saveWorkArea()", "laodPLMSortColumn('colorlib.do','"+url+"',_showColorLibPage);");
	   		return;
        }
		else
		{
			laodPLMSortColumn('colorlib.do',url,_showColorLibPage);
		}
    }
}

//Highlighting the row which is clicked in Navigation grid in list layout
function highlightRow(obj){
	if(obj	!= null) {
		var navigationTd = document.getElementById("navigationGridTable").getElementsByTagName("td");
		for(i=0;i<navigationTd.length;i++){
			if("listRow_"+i == obj.id){
				document.getElementById("listRow_"+i).style.background='#F1F5FF';
			} else {
				if(document.getElementById("listRow_"+i)){
					document.getElementById("listRow_"+i).style.background = "";
				}
			}
		}
	}

}
// This function forwards the user to ColorOverview Screen.
function showColorOverview(obj)
{
	if(obj	!= null) {
		if(obj.parentNode.id != ""){
			obj = obj.parentNode;
		}
		var navigationDiv = document.getElementById("navigationGridTable").getElementsByTagName("div");
		for(i=0;i<navigationDiv.length/2;i++){
			if("gridDiv_"+i == obj.id){
				document.getElementById("gridDiv_"+i).className = "colorWallCellSpaceNavigatorSelected";
			} else {
				document.getElementById("gridDiv_"+i).className = "colorWallCellSpaceNavigator";
			}
		}
	}
    //alert("_AttributekeyInfo " + getComponentKeyInfo() + "\n _nColLibRow " +_nColLibRow);
    var url ="TOOVERVIEW&_nColLibRow=" + _nColLibRow ;
    url += "&keyinfo= " +getComponentKeyInfo();
   // url+="&keyinfo= " +"OWNER=TRADESTONE,COLOR_NO=2"
    //alert("url " + url);
    loadWorkArea("colorlib.do", url);
}

// This function forwards the user to ColorOverview Screen.
function showConstnModel(obj)
{
	Process.showOverview(obj, "constnmodellst.do", "TOOVERVIEW");
}

//todo: make it generic
function sortColumn(fieldName,sec,type, pageNo)
{
	Process.sendRequest(sec,"colorlib.do", "SORT&sortColumn="+fieldName+"&sort="+type+"&pageNum="+pageNo, _showColorLibPage);
}

// This function forwards the user to InstructionOverView Screen.
function showInstructionModelOverview(obj)
{
	Process.showOverview(obj, "instructionmodellist.do", "TOOVERVIEW");
}

// This function forwards the user to InstructionOverView Screen.
function showInstruction(obj)
{
	Process.showOverview(obj, "instruction.do", "TOOVERVIEW");
}

//TODO
// This function forwards the user to MaterialOverview Screen.

function sortCostnModelColumn(fieldName,sec,type, pageNo)
{
 	Process.sendRequest(sec,"constnmodellst.do", "SORT&sortColumn="+fieldName+"&sort="+type+"&pageNum="+pageNo, _showMaterialLibPage);
}

function sortInstModelColumn(fieldName,sec,type, pageNo)
{
    Process.sendRequest(sec,"instructionmodellist.do", "SORT&sortColumn="+fieldName+"&sort="+type+"&pageNum="+pageNo, _showColorPalettePage);
}


/*this function is to handle the reports in PLM module
*
*/
function openBBFactoryReport(id, level, name)
    {
       if(!isValidRecord("URL", "N")) return;

        var bDisp = true;
        if (getval('chgflds') != "")
        {
            if (confirm(szMsg_Changes))
            {
                fsubmit(szSAVE);
                bDisp = false;
            }
        }
        if (bDisp)
        {
            var str = 'report?id=' + id + '&method=customreports' + '&level=' + level + '&reportname=' + name+ '&requestFrom=' + 'PLM';
            oW('report', str, 800, 650);
        }
    }


// opens up a new window
function oW(wname,url,nWidth,nHeight)
{
    var nWindow = window.open(url, wname,'width=' + nWidth + ',height=' + nHeight + ',toolbar=no,menubar=no,scrollbars=no,resizable=yes')
}


function getCustomAttribute(obj, attName)
{
    if(obj && obj.getAttribute(attName))
    {
        return obj.getAttribute(attName);
    }
    return null;
}

/*function activeInactive(status)
{
	var url ="activeinactive&status="+status;
	loadWorkArea("coloroverview.do", url);
}*/
function colorlistactiveInactive(status)
{
	//alert("colorlistactiveInactive  ");
	var url ="activeinactive&status="+status;
	var docview;
    var htmlAreaObj = _getWorkAreaDefaultObj();
  	var objAjax = htmlAreaObj.getHTMLAjax();
   	var objHTMLData = htmlAreaObj.getHTMLDataObj();
   	sectionName = objAjax.getDivSectionId();
   	//alert("sectionName  " + sectionName);

   if(objAjax)
   {
	   docview = objAjax.getDocViewId();

	   if(docview==2904)
       {
			// Tracker#:11612 ERROR MESSAGE DISPLAY ON BLANK COLOR LIBRARY RECORD.
       		if(!isValidRecord(true))
    		{
    			return;
    		}

       		if(status == 'inactive')
	       	{
	       		var htmlErrors = objAjax.error();
	       		var method = "coloroverview.do";
	       		objAjax.setActionURL("coloroverview.do");
		       	htmlErrors.addError("confirmInfo", szMsg_CL_Inactive_Confirm,  false);
	   			messagingDiv(htmlErrors, "loadWorkArea('"+method+"','"+url+"')");
	       		return;
       		}
       		else
       		{
       			loadWorkArea("coloroverview.do", url);
	       		return;
       		}

       }
   }

   if(objAjax && objHTMLData)
   {
	   	docview = objAjax.getDocViewId();
	   	//alert("docview: "+docview);
	   	//alert("inside calling");
	   	bShowMsg = true;

	   	if((docview==2901) || (docview==2902) || (docview==2903) || (docview==2906))
	   	{
	   		//alert("colorlib");
	   		//alert("docviewid ="+docview);
	   		//Before calling process, select the record
	   		if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
		   	{
		   		var htmlErrors = objAjax.error();
		   		objAjax.error().addError("warningInfo", szMsg_Sel_Color, false);
		   		messagingDiv(htmlErrors);
		   		return;
		   	}
	       	objAjax.setActionURL("colorlib.do");
	       	if(status == 'inactive')
	       	{
		       	var htmlErrors = objAjax.error();
		       	htmlErrors.addError("confirmInfo", szMsg_CL_Inactive_Confirm, false);
	   			messagingDiv(htmlErrors, "activeinactiveprocess('"+url+"')");
	   			return;
   			}
       }

       	objAjax.setActionMethod(url);
    	objAjax.setProcessHandler(_showColorLibPage);
		objHTMLData.performSaveChanges(_showColorLibPage, objAjax);
		if(objAjax.isProcessComplete())
        {
            objHTMLData.resetChangeFields();
        }
   }

}

function process1()
{
	Process.execute("process1", "coloroverview.do");
}

//method to call activeinactive process in colorlibrary list view
//may be extended to other list views also
function activeinactiveprocess(url)
{

	var docview;
	closeMsgBox();
	Process.saveChanges("colorlib.do", url, _showColorLibPage);
}

function deleteWorkArea()
{

	
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
   	var docview;

   	// Check for POMWOrksheet Id, if yes handle the Delete in the old fashion.
   	// Why not override this method in respective js files? Once this gets registered if then all the PLM Tech Spec
    // will start calling this overridden method instead of the specific method. So check for doc view id and then
    // call respective methods.
   	var docviewid = htmlAreaObj.getDocViewId();
	
	
   	if(docviewid == 12700)
   	{
        submitPOMWorkArea("delete");
        return;
   	}

   	if(objAjax)
   	{
	   	// Tracker#:12630 ISSUES ON COLOR PALETTE BLANK RECORD
		// Check for valid record to execute process.
	   	if(!isValidRecord(true))
		{
			return;
		}
   		docview = objAjax.getDocViewId();
   		//alert("docview"+docview);
   		var htmlErrors = objAjax.error();
   		if((docview==2901) || (docview==2902) || (docview==2903))
	    	{
	    		//alert("colorlib");
	    		//alert("docviewid ="+docview);
	    		//Before calling process, select the record
		   		if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
			   	{
			   		var htmlErrors = objAjax.error();
			   		objAjax.error().addError("warningInfo", szMsg_Sel_Color, false);
			   		messagingDiv(htmlErrors);
			   		return;
			   	}

	        }

		if((docview==34401))
   		{
   		    if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
            {
                var htmlErrors = objAjax.error();
                objAjax.error().addError("warningInfo", szMsg_Sel_Model, false);
                messagingDiv(htmlErrors);
                return;
            }
		}

   		else if((docview==3400) || (docview==3401))
   		{
   		htmlErrors.addError("confirmInfo","Do you want to delete Submit(s)?",  false);
   		}
   		else if((docview==34400) || (docview==34401))
   		{
   		htmlErrors.addError("confirmInfo","Do you want to delete Model(s)?",  false);
   		}
		else if(docview==34300)
   		{
   		htmlErrors.addError("confirmInfo","Do you want to delete Instruction Model?",  false);
		}
		else if(docview==132)
   		{
			htmlErrors.addError("confirmInfo","Do you want to delete Tech Spec?",  false);
		}
		else if(docview==14000 || docview==14001)
   		{
   		htmlErrors.addError("confirmInfo","Do you want to delete Bill of Material?",  false);
		}
		else if(docview==130 || docview==133 ||docview==134)
   		{
			//Tracker#:19974 - Before calling process, select the record
			if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
		   	{
		   		var htmlErrors = objAjax.error();
		   		objAjax.error().addError("warningInfo", szMsg_Sel_Techspec , false);
		   		messagingDiv(htmlErrors);
		   		return;
		   	}
   			
			htmlErrors.addError("confirmInfo","Do you want to delete Tech Spec(s)?",  false);
		}
		else if(docview==10003)
   		{
   		      if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
            {
                var htmlErrors = objAjax.error();
                objAjax.error().addError("warningInfo", szMsg_Sel_M_Row, false);
                messagingDiv(htmlErrors);
                return;
            }

   		    htmlErrors.addError("confirmInfo","Do you want to delete Attachment(s)?",  false);
		}
		else if(docview==34302)
   		{
            if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
            {
                var htmlErrors = objAjax.error();
                objAjax.error().addError("warningInfo", szMsg_Sel_Model, false);
                messagingDiv(htmlErrors);
                return;
            }

   		htmlErrors.addError("confirmInfo","Do you want to delete Instruction Model(s)?",  false);
		}
		else if(docview==13600)
   		{
            if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
            {
                var htmlErrors = objAjax.error();
                objAjax.error().addError("warningInfo", szMsg_Sel_M_Row, false);
                messagingDiv(htmlErrors);
                return;
            }

   		    htmlErrors.addError("confirmInfo","Do you want to delete Instruction(s)?",  false);
		}
		else if(docview==13900)
   		{
            if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
            {
                var htmlErrors = objAjax.error();
                objAjax.error().addError("warningInfo", szMsg_Sel_M_Row, false);
                messagingDiv(htmlErrors);
                return;
            }

   		    htmlErrors.addError("confirmInfo","Do you want to delete Construction(s)?",  false);
		}
		else if(docview==14400)
   		{
           if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
            {
                var htmlErrors = objAjax.error();
                objAjax.error().addError("warningInfo", szMsg_Sel_M_Row, false);
                messagingDiv(htmlErrors);
                return;
            }

   		    htmlErrors.addError("confirmInfo","Do you want to delete Standard(s)?",  false);
		}
		else if(docview==4001 || docview==4003)
   		{
            if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
            {
                var htmlErrors = objAjax.error();
                objAjax.error().addError("warningInfo", szMsg_Sel_Sample_Row, false);
                messagingDiv(htmlErrors);
                return;
            }

   		    htmlErrors.addError("confirmInfo","Do you want to delete Sample(s)?",  false);

		}
		else if(docview==135)
   		{
   		    if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
            {
                var htmlErrors = objAjax.error();
                objAjax.error().addError("warningInfo", szMsg_Sel_Bids, false);
                messagingDiv(htmlErrors);
                return;
            }
   		    htmlErrors.addError("confirmInfo","Do you want to delete Bids?",  false);
		}
		else if(docview==10004)
   		{
   		      if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
            {
                var htmlErrors = objAjax.error();
                objAjax.error().addError("warningInfo", szMsg_Sel_M_Row, false);
                messagingDiv(htmlErrors);
                return;
            }

   		    htmlErrors.addError("confirmInfo","Do you want to delete Attachment(s)?",  false);
		}
        else if(docview==10005)
    		{
    		      if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
             {
                 var htmlErrors = objAjax.error();
                 objAjax.error().addError("warningInfo", szMsg_Sel_M_Row, false);
                 messagingDiv(htmlErrors);
                 return;
             }

    		    htmlErrors.addError("confirmInfo","Do you want to delete Attachment(s)?",  false);
 		}
 		else if(docview==10006 || docview==10007)   ////Tracker#: 13348  ADD ATTACHMENTS TAB TO COLOR LIBRARY
    		{
    		      if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
             {
                 var htmlErrors = objAjax.error();
                 objAjax.error().addError("warningInfo", szMsg_Sel_A_Row, false);
                 messagingDiv(htmlErrors);
                 return;
             }

    		    htmlErrors.addError("confirmInfo","Do you want to delete Attachment(s)?",  false);
 		}
 		else if(docview==10008)   // Tracker#: 14358  ADD MULTI-IMAGE CAPABILITY TO FIT EVAL IN PLM
    	{
    	    if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
            {
                var htmlErrors = objAjax.error();
                objAjax.error().addError("warningInfo", szMsg_Sel_A_Row, false);
                messagingDiv(htmlErrors);
                return;
            }
    		htmlErrors.addError("confirmInfo","Do you want to delete Attachment(s)?",  false);
 		}
   		else if(docview==14600)
   		{
           if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
            {
                var htmlErrors = objAjax.error();
                objAjax.error().addError("warningInfo", szMsg_Sel_std_int_Row, false);
                messagingDiv(htmlErrors);
                return;
            }

   		    htmlErrors.addError("confirmInfo","Do you want to delete Design Intent(s)?",  false);
		}//Tracker#:21362 
		else if(docview==321)
   		{
   		 //Tracker#:21362 MOVE ORDER SCREEN TO PLM FRAMEWORK UNDER NEW TAB ORDER MANAGEMENT
   		  htmlErrors.addError("confirmInfo","Do you want to delete Order?",  false);
		}
		else if(docview==325)
   		{
   		  if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
			   	{
			   		var htmlErrors = objAjax.error();
			   		objAjax.error().addError("warningInfo", szMsg_Selct_Detail, false);
			   		messagingDiv(htmlErrors);
			   		return;
			   	}
		    htmlErrors.addError("confirmInfo","Do you want to delete order details(s)?",  false);
		}

		else if(docview==9207)
   		{
   		 //Tracker#:21362 MOVE ORDER SCREEN TO PLM FRAMEWORK UNDER NEW TAB ORDER MANAGEMENT
   		  htmlErrors.addError("confirmInfo","Do you want to delete Sales Order?",  false);
		}
   		else if(docview==9210)
   		{
			if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
		   	{
		   		var htmlErrors = objAjax.error();
		   		objAjax.error().addError("warningInfo", szMsg_Selct_Detail, false);
		   		messagingDiv(htmlErrors);
		   		return;
		   	}
		//Tracker#: 23299 INCORRECT MESSAGE IS DISPLAYED ON EXECUTING THE ACCEPT ORDER PROCESS
	    htmlErrors.addError("confirmInfo","Do you want to delete Sales Order Detail(s)?",  false);
		}
		
		else
   		{
   		// Tracker#: 13595 MODIFY THE WARNING PROMPT ON COLOR PREDELETE
   		// Changing warning message "Please check for Submits, Palettes and Artwork usage before deleting color(s). Do you want to delete the color(s)?" to
   		//                          "Please check for Submits, Palettes, Artwork and Style usage before deleting color(s). Do you want to delete the color(s)?".
   		
		
		htmlErrors.addError("confirmInfo", szMsg_CL_Delete_Confirm, false);
   		}
   		messagingDiv(htmlErrors,'deleteColor()');
   		
   	}


}

function deleteColor()
{
	
	
	var url = "deletecolor";
	var docview;
	closeMsgBox();

	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objAjax.getDivSectionId();
    //alert("sectionName  " + sectionName);

	    if(objAjax && objHTMLData)
	    {
	    	docview = objAjax.getDocViewId();
	    	//alert("docview: "+docview);
	    	//alert("inside calling");
	    	bShowMsg = true;
	    	if((docview==2901) || (docview==2902) || (docview==2903))
	    	{
	    		//alert("colorlib");
	    		//alert("docviewid ="+docview);
	    		//Before calling process, select the record

	        	objAjax.setActionURL("colorlib.do");
	        }
	        if(docview==2904)
	        {
	        	// Tracker#:11612 ERROR MESSAGE DISPLAY ON BLANK COLOR LIBRARY RECORD.
	        	if(!isValidRecord(true))
	    		{
	    			return;
	    		}
	        	//Tracker#: 14105 REFRESHING THE NAVIGATION GRID WHEN THE DATA IS DELETED
				//Added the process handler method so that on deleting the color library from the overview
				//the navigation grid is refreshed
	        	loadWorkArea("coloroverview.do", url,"",refreshNavigationGridOnDelete);
	        	return;
	        }

	        if((docview==34401))
	        {
	        	url = "delete";
	        	objAjax.setActionURL("constnmodellst.do");
	        }
	        if(docview==3401)
	        {
	        	url = "deletesubmit";
	        	objAjax.setActionURL("labdip.do");
	        }
	        if(docview==3400)
	        {
	            url = "deletesubmit";
	        	//Tracker#: 14105 REFRESHING THE NAVIGATION GRID WHEN THE DATA IS DELETED
				//Added the process handler method so that on deleting the submits from the overview
				//the navigation grid is refreshed
	        	loadWorkArea("labdipoverview.do", url,"",refreshNavigationGridOnDelete);
	        	return;
	        }
	        if(docview==34400)
	        {
	            url = "delete";
	        	loadWorkArea("constructionmodel.do", url);
	        	return;
	        }
			if(docview==34300)
	        {
	            url = "delete";
	        	loadWorkArea("instructionmodel.do", url);
				return;
	        }
	        if(docview==34302)
	        {
	            url = "delete";
	        	objAjax.setActionURL("instructionmodellist.do");
	        }
	        if(docview==13600)
	        {
	        	Process.saveChanges("instruction.do", "delete", _showSubmitWorkArea);
                return;
	        }
	        if(docview==13900)
	        {
	        	Process.saveChanges("construction.do", "delete", _showSubmitWorkArea);
                return;
	        }
	        if(docview==132)
	        {
	            url = "delete";
	        	//Tracker#: 14105 REFRESHING THE NAVIGATION GRID WHEN THE DATA IS DELETED
				//Added the process handler method so that on deleting the tech spec from the overview
				//the navigation grid is refreshed
	            //Tracker#:20182 called loadWorkArea to exclude the save confirm message.
	    		Main.loadWorkArea("techspecoverview.do", url,'','refreshNavigationGridOnDelete');
	        	return;
	        }
	        if(docview==14000 || docview==14001)
	        {
	            url = "delete";
	        	loadWorkArea("bomc.do", url);
	        	return;
	        }
	        if(docview==14400)
	        {
	           Process.saveChanges("standards.do", "delete", _showSubmitWorkArea);
               return;
	        }
	        if(docview==130||docview==133||docview==134)
	        {
	            url = "delete";
	        	objAjax.setActionURL("techspec.do");
	        	objAjax.setActionMethod(url);
	        }
	        if(docview==4001)
	        {
	            url = "delete";
	        	objAjax.setActionURL("sample.do");
	        	objAjax.setDivSectionId(htmlAreaObj.getDivSaveContainerName());
	        	objAjax.setActionMethod(url);

            }
            if(docview==4003)
	        {
	            url = "delete";
	        	objAjax.setActionURL("sampletracking.do");
	        	objAjax.setActionMethod(url);

            }
            if(docview==135)
            {
             	Process.saveChanges("bids.do", "delete", _showSubmitWorkArea);
               return;
            }
            if(docview==4201 || docview==4204 || docview==4203)
            {
            	var url = "deleteartwork";
            	objAjax.setActionURL("artworklib.do");
            }
            if(docview==10003)
	        {
	           Process.saveChanges("artattachments.do", "delete", _showSubmitWorkArea);
               return;
	        }
	        if(docview==10004)
	        {
	           Process.saveChanges("materialattachment.do", "delete", _showSubmitWorkArea);
               return;
	        }
	       	if(docview==14600)
	        {
	       		Process.saveChanges("designintent.do", "delete", _showSubmitWorkArea);
                return;
	        }
	        if(docview==10005)
 	        {
 	        	Process.saveChanges("techspecattachment.do", "delete", _showSubmitWorkArea);
                return;
 	        }
 	        if(docview==10006)
 	        {
 	        	Process.saveChanges("submitattachment.do", "delete", _showSubmitWorkArea);
                return;
 	        }
 	        if(docview==10007)
 	        {
 	            ///Tracker#: 13348  ADD ATTACHMENTS TAB TO COLOR LIBRARY
 	            /// for coloroverview attachment tab
 	        	Process.saveChanges("coloroverviewattachment.do", "delete", _showSubmitWorkArea);
                return;
 	        }
 	        if(docview==10008)
 	        {
 	            // Tracker#: 14358  ADD MULTI-IMAGE CAPABILITY TO FIT EVAL IN PLM
 	            // Handle delete for Fit Eval Overview Attachment screen
 	        	Process.saveChanges("fitevaloverviewattachment.do", "delete", _showSubmitWorkArea);
                return;
 	        }//Tracker#:21362 
 	        if(docview==321)
	        {
	            url = "delete";	        	
	        	Main.loadWorkArea("purchaseorderoverview.do", url,'','refreshNavigationGridOnDelete');
	        	return;
 	        }
	        if(docview==325)
	        {
	            url = "delete";
	        	objAjax.setActionURL("purchaseorderdetail.do");
	        objAjax.setActionMethod(url);
                objAjax.setProcessHandler(_showSubmitWorkArea);
                objHTMLData.performSaveChanges(_showSubmitWorkArea, objAjax);
                if(objAjax.isProcessComplete())
                {
                    objHTMLData.resetChangeFields();
                }
                return;
	        }

			  if(docview==9207)
	        {
	            url = "delete";	        	
	        	Main.loadWorkArea("salesorderentryoverview.do", url,'','refreshNavigationGridOnDelete');
	        	return;
 	        }
	       if(docview==9210)
		        {
		            url = "delete";
		        	objAjax.setActionURL("salesorderentrydetailview.do");
		        objAjax.setActionMethod(url);
	                objAjax.setProcessHandler(_showSubmitWorkArea);
	                objHTMLData.performSaveChanges(_showSubmitWorkArea, objAjax);
	                if(objAjax.isProcessComplete())
	                {
	                    objHTMLData.resetChangeFields();
	                }
	                return;
		        }
			objAjax.setActionMethod(url);
	        objAjax.setProcessHandler(_showDeleteSubmitWorkArea);
	        objHTMLData.performSaveChanges(_showDeleteSubmitWorkArea, objAjax);
	        if(objAjax.isProcessComplete())
            {
                objHTMLData.resetChangeFields();
            }
	    }
}

function deleteComponents()
{

    var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
   	var docview;
   	if(objAjax)
   	{
   		docview = objAjax.getDocViewId();
   		//alert("docview"+docview);
   		var htmlErrors = objAjax.error();

   		if(docview==14000 || docview==14001)
   		{
   		    //implemented in the bomc.js method
   		    _deleteBOMCComponents(htmlAreaObj, objAjax, objHTMLData);
   		    return;
   		}
    }
}

function cancel(){
	closeMsgBox();
	refreshWorkArea();
}

function refreshWorkArea()
{
	//alert("db_refresh");
	var url = "db_refresh";

	// Tracker#: 13709 ADD ROW_NO FIELD TO CONSTRUCTION_D AND CONST_MODEL_D
	// Check for valid record before executing the processs.
   	if(!isValidRecord(true))
	{
		return;
	}

    var docview;

    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objAjax.getDivSectionId();
    //alert("sectionName  " + sectionName);

    // Check for POMWOrksheet Id, if yes handle the Refresh in the old fashion.
    // Why not override this method in respective js files? Once this gets registered if then all the PLM Tech Spec
    // will start calling this overridden method instead of the specific method. So check for doc view id and then
    // call respective methods.
    var docviewid = htmlAreaObj.getDocViewId();
    if(docviewid == 12700)
    {
        submitPOMWorkArea("db_refresh");
        return;
    }

    if(objAjax && objHTMLData)
    {
        docview = objAjax.getDocViewId();
        //alert("docview: "+docview);
        //alert("inside calling");
        bShowMsg = true;
        if((docview==2901) || (docview==2902) || (docview==2903))
        {
            //alert("colorlib");
            //alert("docviewid ="+docview);
            //Before calling process, select the record
            if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
            {
                var htmlErrors = objAjax.error();
                objAjax.error().addError("warningInfo", szMsg_Sel_Color, false);
                messagingDiv(htmlErrors);
                return;
            }
            objAjax.setActionURL("colorlib.do");
        }
        //Tracker#17732
    	//Adding new docviewids created for different material type(list)
        if(docview==3301 || (docview==3306) || (docview==3307) || (docview==3323) || (docview==3324) || (docview==3325)
        || (docview==3326) || (docview==3327) || (docview==3328) || (docview==3329) || (docview==3330) || (docview==3331)
         || (docview==3332) || (docview==3333))
        {
            if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
            {
                var htmlErrors = objAjax.error();
                objAjax.error().addError("warningInfo", szMsg_Sel_Material, false);
                messagingDiv(htmlErrors);
                return;
            }
            objAjax.setActionURL("materiallib.do");
        }
        if((docview==34401))
        {
            if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
            {
                var htmlErrors = objAjax.error();
                objAjax.error().addError("warningInfo", szMsg_Sel_Model, false);
                messagingDiv(htmlErrors);
                return;
            }
            objAjax.setActionURL("constnmodellst.do");

        }
        if(docview==2904)
        {
       		// Tracker#:11612 ERROR MESSAGE DISPLAY ON BLANK COLOR LIBRARY RECORD.
        	if(!isValidRecord(true))
    		{
    			return;
    		}
            loadWorkArea("coloroverview.do", url);
            return;
        }

        if((docview==3300) || (docview==3303) || (docview==3311) || (docview==3312) || (docview==3313) || (docview==3319) || (docview==3320) || (docview==3321))
        {
        	// Tracker#:12637 ISSUES ON BLANK RECORD OF MATERIAL LIBRARY
	   		if(!isValidRecord(true))
    		{
    			return;
    		}
            loadWorkArea("materialoverview.do", url);
            return;
        }
        if(docview==34300)
        {
            loadWorkArea("instructionmodel.do", url);
            return;
        }
        if(docview==34302)
        {
            objAjax.setActionURL("instructionmodellist.do");
            return;
        }

        if(docview==34400)
        {
            loadWorkArea("constructionmodel.do", url);
            return;
        }
        if(docview==132)
        {
            Main.loadWorkArea("techspecoverview.do", url);
            return;
        }
        if(docview==13600)
        {
            Main.loadWorkArea("instruction.do", url);
            return;
        }
        if(docview==13900)
        {
            Main.loadWorkArea("construction.do", url);
            return;
        }
        if(docview==130||docview==133||docview==134)
        {
            return;
        }
        if(docview==14000 || docview==14001)
        {
            Main.loadWorkArea("bomc.do", url);
            return;
        }
         if(docview==14400)
        {
            Main.loadWorkArea("standards.do", url);
            return;
        }
        if(docview==4003)
        {
            return;
        }
        if(docview==4001)
        {
            Main.loadWorkArea("sample.do", url);
            return;
        }
        if(docview==135)
        {
            loadWorkArea("bids.do", url);
            return;
        }
        if(docview==10003)
        {
            loadWorkArea("artattachments.do", url);
            return;
        }
        if(docview==10004)
        {
            loadWorkArea("materialattachment.do", url);
            return;
        }
        if(docview==10006)
        {
            loadWorkArea("submitattachment.do", url);
            return;
        }
        if(docview==10007)
        {
        /// Tracker#: 13348  ADD ATTACHMENTS TAB TO COLOR LIBRARY
        ///coloroverview screen
            loadWorkArea("coloroverviewattachment.do", url);
            return;
        }
        if(docview==10008)
        {
            // Tracker#: 14358  ADD MULTI-IMAGE CAPABILITY TO FIT EVAL IN PLM
            // Refresh the Fit Eval overview attachment screen
            loadWorkArea("fitevaloverviewattachment.do", url);
            return;
        }
        if(docview==14600)
        {
            Main.loadWorkArea("designintent.do", url);
            return;
        }
        if(docview==10005)
        {
            Main.loadWorkArea("techspecattachment.do", url);
            return;
        }
        if(docview==321)
        {
            // Tracker#: 21851
            // Display yellow confirm msg instead of the window.confirm prompt
            Main.loadWorkArea("purchaseorderoverview.do", url);
            return;
        }

		 if(docview==9207)
        {
            // Tracker#: 21851
            // Display yellow confirm msg instead of the window.confirm prompt
            Main.loadWorkArea("salesorderentryoverview.do", url);
            return;
        }
        if(docview==325)
        {
            // Tracker#: 21851
            // Display yellow confirm msg instead of the window.confirm prompt
            Main.loadWorkArea("purchaseorderdetail.do", url);
            return;
        }
       if(docview==9210)
        {
            Main.loadWorkArea("salesorderentrydetailview.do", url);
            return;
        }
		
		objAjax.setActionMethod(url);
        objAjax.setProcessHandler(_showColorLibPage);
        objHTMLData.performSaveChanges(_showColorLibPage, objAjax);
        if(objAjax.isProcessComplete())
        {
            objHTMLData.resetChangeFields();
        }
    }
}

function createColor()
{
	Process.execute("createcolor", "coloroverview.do");
}

//Function for createModel
function createModel()
{
	var url = "createmodel";

	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	sectionName = objAjax.getDivSectionId();
	  // alert("sectionName  " + sectionName);
    if(objAjax && objHTMLData)
    {
    	//alert("inside calling");
    	docview = objAjax.getDocViewId();
	    bShowMsg = true;
	    if(docview==34300 || docview==34302)
	    {
    	   loadWorkArea("instructionmodel.do", url);
    	}
    	else if((docview==34400) || (docview==34401))
	    {
    	   loadWorkArea("constructionmodel.do", url);
    	}
        //objAjax.setActionMethod(url);
        //objAjax.setProcessHandler(_showColorLibPage);
        //objHTMLData.performSaveChanges(_showColorLibPage, objAjax);
        if(objAjax.isProcessComplete())
        {
            objHTMLData.resetChangeFields();
        }
    }
}

function showAttachments()
{
   Process.execute("attachments", "artattachments.do");
}


//function to validation the RGB value which should be between 0 and 255
//validateRGB(this);
function validateRGB(obj)
{
    //alert("validateRGB " + validateRGB);
    if(obj && obj.value)
    {
    	obj.value = _trim(obj.value);

        var val = obj.value;

        if( (val && val!=null && isNaN(val)) || ( !isNaN(val) && !(val>=0 && val<=255)) )
        {
            //TODO get this message from the server side.
            var sz_msg = "Please enter the value between 0 and 255. ";

            //_displayUserMessage(sz_msg);
            var objAjax = new htmlAjax();
    		objAjax.error().addError("errorInfo", sz_msg, true);
    		_displayProcessMessage(objAjax);
           // obj.select;

            if(window.event)
                window.event.returnValue = false;
            else
                e.preventDefault();

            obj.focus();
            obj.select();
        }
    }
}


//function to validation the H value which should be between 0 and 360
//validateH(this);
function validateH(obj)
{
    //alert("validateRGB " + validateRGB);
    if(obj && obj.value)
    {
    	obj.value = _trim(obj.value);

        var val = obj.value;

        if( (val && val!=null && isNaN(val)) || ( !isNaN(val) && !(val>=0 && val<=360)) )
        {
            //TODO get this message from the server side.
            var sz_msg = "Please enter the value between 0 and 360. ";

            //_displayUserMessage(sz_msg);
            var objAjax = new htmlAjax();
    		objAjax.error().addError("errorInfo", sz_msg, true);
    		_displayProcessMessage(objAjax);
           // obj.select;

            if(window.event)
                window.event.returnValue = false;
            else
                e.preventDefault();

            obj.focus();
            obj.select();
        }
    }
}

//function to validation the L and C value which should be between 0 and 99
//validateLC(this);
function validateLC(obj)
{
    //alert("validateRGB " + validateRGB);
    if(obj && obj.value)
    {
    	obj.value = _trim(obj.value);

        var val = obj.value;

        if( (val && val!=null && isNaN(val)) || ( !isNaN(val) && !(val>=0 && val<=99)) )
        {
            //TODO get this message from the server side.
            var sz_msg = "Please enter the value between 0 and 99.";

            //_displayUserMessage(sz_msg);
            var objAjax = new htmlAjax();
    		objAjax.error().addError("errorInfo", sz_msg, true);
    		_displayProcessMessage(objAjax);
           // obj.select;

            if(window.event)
                window.event.returnValue = false;
            else
                e.preventDefault();

            obj.focus();
            obj.select();
        }
    }
}

function changeTabStyleToOnfocus(obj)
{
  var obj1 = (obj.document.getElementById(obj.id));
  var childNodeArray  = obj1.parentNode.childNodes;
  for(i=0; i<childNodeArray.length ; i++)
  {
	  // these could be HTMLTssButtons as children of an HTMLTabButtonWithChildren, which would not contain these id attributes
	  if (childNodeArray[i].document.getElementById(childNodeArray[i].id+"LeftCell") != null &&
		  childNodeArray[i].document.getElementById(childNodeArray[i].id+"LeftCell") != null  &&
		  childNodeArray[i].document.getElementById(childNodeArray[i].id+"LeftCell") != null )
	  {
		  childNodeArray[i].document.getElementById(childNodeArray[i].id+"LeftCell").setAttribute("className","clsLeftcornerTabOfffocus");
		  childNodeArray[i].document.getElementById(childNodeArray[i].id+"CenterCell").setAttribute("className","clsCenterTabOfffocus");
		  childNodeArray[i].document.getElementById(childNodeArray[i].id+"RightCell").setAttribute("className","clsRightTabOfffocus");
	  }
  }
  // same reason as above, might not be present
  if (obj.document.getElementById(obj.id+"LeftCell") != null &&
		  obj.document.getElementById(obj.id+"LeftCell") != null  &&
		  obj.document.getElementById(obj.id+"LeftCell") != null )
  {
	  obj.document.getElementById(obj.id+"LeftCell").setAttribute("className","clsLeftcornerTabOnfocus");
	  obj.document.getElementById(obj.id+"CenterCell").setAttribute("className","clsCenterTabOnfocus");
	  obj.document.getElementById(obj.id+"RightCell").setAttribute("className","clsRightTabOnfocus");
  }
  //alert("obj.id "  +obj.id);

  if(obj.id == "Rounds")
  {
    showRounds();
  }
  else  if(obj.id == 'Instructions')
  {
   showInstructions();
  }
  else if(obj.id == 'Product Overview')
  {
    showProduct();
  }
  else if(obj.id == 'Constructions')
  {
    showConstructions();
  }
  else if(obj.id == 'BOM')
  {
    showBillOfMaterials();
  }
  else if (obj.id == 'POM')
  {
    showPOM();
  }
  else if (obj.id == 'Change Tracking')
  {
    showChangeTracking();
  }
  else if(obj.id == 'Samples')
  {
    showSample();
  }
  else if(obj.id == 'Bids')
  {
    showBids();
  }
  else if(obj.id == 'Standards')
  {
    showStandards();
  }
  else if(obj.id == 'Overview')
  {
  	showMaterialLib();
  }
   else if(obj.id == 'Material Overview')
  {
      showMaterialLib();
  }
  else if(obj.id == 'Combos')
  {
  	gotoCombos();
  }
  else if(obj.id == 'Material Attachments')
  {
      showMaterialAttachments();
  }
  else if(obj.id == 'TechSpec Attachments')
  {
       showTechSpecAttachments();
  }
  else if(obj.id == 'Attachments')
  {
     showMaterialAttachments();
  }
  else if(obj.id == 'Events')
  {
      showEvents();
  }
  else if(obj.id == 'Style Usage')
  {
     showStyleUsage();
  }
  else if(obj.id == 'Testing Instructions')
  {
     showTestingInstructions();
  }
  //Tracker#: 16597 MATERIAL QUOTE OVERVIEW - ATTACHMENT ASSOCIATION
  else if(obj.id == 'Attachments Association')
  {
     showPLMAttachments();
  }
  else if(obj.id == 'Details')
  {
     showDetails();
  }
  else
  {
    showLabdipOverview();
  }

}


// Tracker#: 12565 CHANGE TRACKING - MORE FIELDS, ON MORE SCREENS
// Passing the Parent Doc View Id.
//Tracker#:20812 Modified the function to display the save confirm message in new UI.
function showChangeTracking(parentDocViewId)
{
	closeMsgBox();   
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	//alert(objHTMLData);
	if(objHTMLData && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
    {
        var htmlErrors = objAjax.error();
        htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
        var saveFunc ="\"Main.loadWorkAreaWithSave()\"";	 
        var canceFunc ="_showChangeTracking('"+parentDocViewId+"')";
        messagingDiv(htmlErrors, saveFunc, canceFunc);
    }  
    else
    {
    	_showChangeTracking(parentDocViewId);
    }
}

function _showChangeTracking(parentDocViewId)
{
	closeMsgBox();
    // Tracker#:12621 ISSUES ON BLANK RECORD OF TECH SPEC
    // Check for valid record to execute process.
    if(!isValidTecSpec(true))
    {
        return;
    }
	if(parentDocViewId == '3400')
	{
		// Check for valid record to show the screen(tab).
    	if(!isValidSubmit(true))
		{
			return;
		}
	}
	//Tracker#:18707 IMPLEMENT MATERIAL PROJECTIONS CHANGE TRACKING UI
	//Added to handle the scenario wherein Change Tracking tab is clicked in Create Material
	//Projection flow
    //Tracker#:18908 IMPLEMENT NEW CHANGE TRACKING UI ON MATERIAL PALETTES
    //Added condition for Material Palettes screen
	//Tracker#: 18626 F8 - J. CHANGE TRACKING ON CAPACITY PROJECTION DOCUMENT
	else if (parentDocViewId == '5800' || parentDocViewId == '6000'|| 
		parentDocViewId == '6800' || parentDocViewId == '6801')
	{
        if (!isValidRecord(true))
        {
            return;
        }
	}
    //Tracker#:18906 IMPLEMENT NEW CHANGE TRACKING UI ON COLOR LIBRARY
    //Added condition for Color Library screens
	else if (parentDocViewId == '2900')
	{
	        if (!isValidColorlib(true))
			{
				return;
			}
	}
	//Tracker#: 19238 F2J. CHANGE TRACKING ON COMPETENCIES DOCUMENT
    else if (parentDocViewId == '7000' )
	{
        if (!isValidRecord(true))
        {
            return;
        }
	}
    //Tracker#:18904 IMPLEMENT NEW CHANGE TRACKING UI ON ARTWORK LIBRARY
    //Added condition for Artwork Library screen
	else if (parentDocViewId == '4200')
	{
        if(!isValidArtwork(true))
        {
            return;
        }
	}
	//Tracker#: 18917 F4L - CHANGE TRACKING ON CAPACITY DOCUMENT
    else if (parentDocViewId == '7300' )
	{
		if (!isValidRecord(true))
       
        {
            return;
        }
	}
    //Tracker#:18811 IMPLEMENT NEW CHANGE TRACKING UI ON MATERIAL LIBRARY SCREEN
    //Added condition for Material Library screens
    else if (parentDocViewId == '3303')
    {
        if(!isValidMaterial(true))
        {
            return;
        }
    }
    else if (parentDocViewId == '155')
    {
        if(!isValidMaterialQuote(true))
        {
            return;
        }
    }
    //Tracker#: 21328 MOVE PARTY SCREEN TO NEW FRAMEWORK UNDER NEW TAB VENDOR MANAGEMENT
    // Handle Party screen too in similar manner.
    else if (parentDocViewId == '212' )
	{
        // Tracker#: 21480
        // Check if the parent document that is Party is valid or not else do not process.
        if(!_checkIsValidRecord("_isValidParent", true, szMsg_Invalid_Rec))

        {
            return;
        }
	}
	else if (parentDocViewId == '321' )
	{
        // Tracker#: 21480
        // Check if the parent document that is Party is valid or not else do not process.
        if(!_checkIsValidRecord("_isValidParent", true, szMsg_Invalid_Rec))

        {
            return;
        }
	}
	_showWaitWindow();
    var url = 'changetrackviewerplm.do?method=view&ajaxcall=y&parentDocViewId=' + parentDocViewId;
	var ajaxObj = new htmlAjax();
	ajaxObj.parameter().add("parentDocViewId", parentDocViewId);
	ajaxObj.setActionURL("changetrackviewerplm.do");
	ajaxObj.setActionMethod("view&ajaxcall=y");
	ajaxObj.setProcessHandler(reloadChangeTrack);
	ajaxObj.sendRequest();
}

function reloadChangeTrack(ajaxObj)
{
    if (ajaxObj)
    {
        if (ajaxObj.isProcessComplete())
        {
           var msg = ajaxObj.getResult();
           _hideWaitWindow();
           refitChangeTrackC(msg);
        }
    }
}

function refitChangeTrackC(msg)
{
   	var htmlAreaObj = _getWorkAreaDefaultObj();
 	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	sectionName = objAjax.getDivSectionId();

	var div = getElemnt(htmlAreaObj.getDivSaveContainerName());
	var docviewid = htmlAreaObj.getDocViewId();

    var parentDocViewId = getval('parentDocViewId');
    if (parentDocViewId == null || parentDocViewId == 'undefined' || parentDocViewId == '')
    {
        var newObj = document.createElement("input");
        setAttribute(newObj, "type", "hidden") ;
        setAttribute(newObj, "name", "changetrackhtml") ;
        setAttribute(newObj, "id", "changetrackhtml") ;

        newObj.value = msg; // "14";
        setAttribute(newObj, _AttributeNameDocViewid, docviewid);
        //document.appendChild(newObj);
        //Tracker#: 16832 SAFARI-CHANGE TRACKING TAB DOESNOT WORK IN PLM
        //Appending the child to the document form
        document.forms[0].appendChild(newObj);
    }

     if(objAjax && objHTMLData)
    {
    	bShowMsg = true;
    	objAjax.parameter().add("changetrackhtml", msg);
    	var url ="AJAXVIEW";
       	objAjax.setActionURL("changetrackviewer.do");
        objAjax.setActionMethod(url);
        objAjax.setProcessHandler(_showChangeTrack);
        objAjax.sendRequest();
        if(objAjax.isProcessComplete())
        {
            objHTMLData.resetChangeFields();
        }
    }
}

function _showChangeTrack(objAjax)
{
     _showWorkArea(objAjax);

    var parentDocViewId = getval('parentDocViewId');
    if (parentDocViewId == null || parentDocViewId == 'undefined' || parentDocViewId == '')
    {
        fireJS(objAjax.getHTMLResult());
    }
}

function submitFrm(act)
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var docviewid = htmlAreaObj.getDocViewId();
    if (docviewid == 1600)
    {
        submitFrmCT(act);
    }
    else if (docviewid == 12700)
    {
        if(act == "viewfitevaluations"  || act == "fitevalworksheet")
        {
            submitFrmFitEval(act);
        }
        else
        {
            submitFrmPOM(act);
        }
    }
}

function refitPOMWorskeetC(msg)
{
        _hideWaitWindow();
 	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	sectionName = objAjax.getDivSectionId();
    //alert("sectionName " + sectionName + "\n htmlAreaObj.getDivSaveContainerName() " + htmlAreaObj.getDivSaveContainerName());
	var div = getElemnt(htmlAreaObj.getDivSaveContainerName());
	var docviewid = htmlAreaObj.getDocViewId();

    var newObj = document.createElement("input");
    setAttribute(newObj, "type", "hidden") ;
    setAttribute(newObj, "name", "pomhtml") ;
    setAttribute(newObj, "id", "pomhtml") ;

    newObj.value = msg; // "14";
    setAttribute(newObj, _AttributeNameDocViewid, docviewid);

    document.appendChild(newObj);

    if(objAjax && objHTMLData)
    {
    	bShowMsg = true;
    	objAjax.parameter().add("pomhtml", msg);
    	var url ="AJAXVIEW&ajaxcall=y";
       	objAjax.setActionURL("plmpomworksheet.do");
        objAjax.setActionMethod(url);
        objAjax.setProcessHandler(_showPOMWorkSheet);
        objAjax.sendRequest();
        if(objAjax.isProcessComplete())
        {
            objHTMLData.resetChangeFields();
        }
    }
}

function _showPOMWorkSheet(objAjax)
{
    _showWorkArea(objAjax);
    closeMsgPOM();
    // window.prompt("", objAjax.getHTMLResult());
    fireJS(objAjax.getHTMLResult());
}

function showEvents()
{
    // Tracker#:12621 ISSUES ON BLANK RECORD OF TECH SPEC
    // Check for valid record to execute process.
    if(!isValidTecSpec(true))
    {
        return;
    }
    // Tracker#:14435 ISSUE WITH SAVE PROMPT,SYSTEM DISPLAYS'PREVIOUS ACTION ENCOUNTERED ERROR'
    // If changes are done in other tab like Tech Spec overview or Sample Traching then user try to move to
    // Events tab then Events tab was displaying without asking for save on techspec overview chagnes.
    var objHtmlData = _getWorkAreaDefaultObj().checkForNavigation();
    if(objHtmlData!=null && objHtmlData.hasUserModifiedData()==true)
    {
        //perform save operation
        objHtmlData.performSaveChanges(_defaultWorkAreaSave);

        return;
    }

    _showWaitWindow();
    var url = 'eventtab.do?method=showEventTab&ajaxcall=y';

    if (window.XMLHttpRequest)
    {
        req = new XMLHttpRequest();
    }
    else if (window.ActiveXObject)
    {
        req = new ActiveXObject("Microsoft.XMLHTTP");
    }
    if (req)
    {
        req.open("GET", url, true);
        req.onreadystatechange = function ()
        {
            if (req.readyState == 4)
            {
                if (req.status == 200)
                {
                   // Invoke SessionManagement.resetSessionTime() to reset session counter.
                   SessionManagement.resetSessionTime();
                   
                   var msg = req.responseText;
                   //alert(msg);
                   _hideWaitWindow();
                   refitEventTab(msg);
                }
            }
        }

        req.send();
    }
}

function refitEventTab(msg)
{
 	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	sectionName = objAjax.getDivSectionId();
    //alert("sectionName " + sectionName + "\n htmlAreaObj.getDivSaveContainerName() " + htmlAreaObj.getDivSaveContainerName());
	var div = getElemnt(htmlAreaObj.getDivSaveContainerName());
	var docviewid = htmlAreaObj.getDocViewId();

    var newObj = document.createElement("input");
    setAttribute(newObj, "type", "hidden") ;
    setAttribute(newObj, "name", "eventhtml") ;
    setAttribute(newObj, "id", "eventhtml") ;

    newObj.value = msg; // "14";
    setAttribute(newObj, _AttributeNameDocViewid, docviewid);

    document.appendChild(newObj);

    if(objAjax && objHTMLData)
    {
    	bShowMsg = true;
    	objAjax.parameter().add("eventhtml", msg);
    	var url ="AJAXVIEW&ajaxcall=y";
       	objAjax.setActionURL("eventtab.do");
        objAjax.setActionMethod(url);
        objAjax.setProcessHandler(_showEventTab);
        objAjax.sendRequest();
        if(objAjax.isProcessComplete())
        {
        	//alert(objAjax.getHTMLResult());
            objHTMLData.resetChangeFields();
        }
    }
}

function _showEventTab(objAjax)
{
    _showWorkArea(objAjax);
    closeMsg();
    fireJS(objAjax.getHTMLResult());
}


function showSearchOrders()
{
    _showWaitWindow();
    var url = 'plmordersearch.do';

    if (window.XMLHttpRequest)
    {
        req = new XMLHttpRequest();
    }
    else if (window.ActiveXObject)
    {
        req = new ActiveXObject("Microsoft.XMLHTTP");
    }
    if (req)
    {
        req.open("GET", url, true);
        req.onreadystatechange = function ()
        {
            if (req.readyState == 4)
            {
                if (req.status == 200)
                {
                   // Invoke SessionManagement.resetSessionTime() to reset session counter.
                   SessionManagement.resetSessionTime();
                	
                   var msg = req.responseText;
                   _hideWaitWindow();
                   refitSearchScreen(msg);
                }
            }
        }

        req.send("method=view&ajaxcall=y");
    }

}

function refitSearchScreen(msg)
{
 	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	sectionName = objAjax.getDivSectionId();
    //alert("sectionName " + sectionName + "\n htmlAreaObj.getDivSaveContainerName() " + htmlAreaObj.getDivSaveContainerName());
	var div = getElemnt(htmlAreaObj.getDivSaveContainerName());
	var docviewid = htmlAreaObj.getDocViewId();

    var newObj = document.createElement("input");
    setAttribute(newObj, "type", "hidden") ;
    setAttribute(newObj, "name", "searchhtml") ;
    setAttribute(newObj, "id", "searchhtml") ;

    newObj.value = msg; // "14";
    setAttribute(newObj, _AttributeNameDocViewid, docviewid);

    document.forms[0].appendChild(newObj);

    if(objAjax && objHTMLData)
    {
    	bShowMsg = true;
    	objAjax.parameter().add("searchhtml", msg);
    	var url ="AJAXVIEW&ajaxcall=y";
       	objAjax.setActionURL("search.do");
        objAjax.setActionMethod(url);
        objAjax.setProcessHandler(_showSearchOrder);
        objAjax.sendRequest();
        if(objAjax.isProcessComplete())
        {
            objHTMLData.resetChangeFields();
        }
    }
}

function _showSearchOrder(objAjax)
{
    _showWorkArea(objAjax);
    closeMsgPOM();
    // window.prompt("", objAjax.getHTMLResult());
    fireJS(objAjax.getHTMLResult());

    //window.prompt("", document.body.outerHTML)
}

function copyBid()
{
var url = "copybid";
var docview;

var htmlAreaObj = _getWorkAreaDefaultObj();
var objAjax = htmlAreaObj.getHTMLAjax();
var objHTMLData = htmlAreaObj.getHTMLDataObj();
sectionName = objAjax.getDivSectionId();
//alert("sectionName  " + sectionName);
if(objAjax && objHTMLData)
{
    docview = objAjax.getDocViewId();
    //alert("inside calling");
    bShowMsg = true;
    if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
    {
        var htmlErrors = objAjax.error();
        objAjax.error().addError("warningInfo", szMsg_Sel_BidToCopy, false);
        messagingDiv(htmlErrors);
        return;
    }

    objAjax.setActionURL("bids.do");
    objAjax.setActionMethod(url);
    objAjax.setProcessHandler(_showSubmitWorkArea);
    objHTMLData.performSaveChanges(_showSubmitWorkArea, objAjax);
    if(objAjax.isProcessComplete())
    {
        objHTMLData.resetChangeFields();
    }
}
}

// this can be called after multiple file upload
// currently action is specific to techspec overview, can add docview ids for other actions
// multfileupload.jsp calls this
function uploadDone()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var docview = objAjax.getDocViewId();
	if (docview==132)
	{
		showProductOverview(null);
	}
	else if (docview==2406 || docview==2409)
	{
		tabSelectionAction(null, 'fitevaloverview.do', 'view', '100', '100')
	}
	else if (docview==4007)
	{
		tabSelectionAction(null, 'sampleeval.do', 'view', '4000', '4000');
	}

}

//Calls the Refresh method in Color Library
//Sent To screen.
function refreshSendToWorkArea()
{
	var url = "db_refresh";
	var docview;

 	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    sectionName = objAjax.getDivSectionId();
    loadWorkArea("coloroverviewsendto.do", url);
    return;
}


function showColorlibAttachment()
{
   if(!isValidColorlib(true))
	{
		return;
	}
	Process.execute("view", "coloroverviewattachment.do");
}


function showColorlibSendTo()
{
  	if(!isValidColorlib(true))
	{
		return;
	}
	Process.execute("view", "coloroverviewsendto.do");
}

// Tracker#:14435 ISSUE WITH SAVE PROMPT,SYSTEM DISPLAYS'PREVIOUS ACTION ENCOUNTERED ERROR'
// For blank records on click of tabs, message should be given without going in to screen.
function isValidColorlib(displayMessage)
{
    return _checkIsValidRecord("_isValidColorLib", true, szMsg_Invalid_ColorLib);
}

// Tracker#:14902 XRITE INTEGRATION (CXF FILES) WITH COLOR LIBRARY UI CHANGES
function showImportCXF()
{
	 var htmlAreaObj = _getWorkAreaDefaultObj();
	//alert("htmlAreaObj " + htmlAreaObj);
    var objAjax = htmlAreaObj.getHTMLAjax();
	var actMethod ="showImportCXFDiv";

    if(objAjax)
    {
    	var htmlfldName = "_SearchSection"// htmlAreaObj.getDivSectionId();
    	//alert("showView : objAjax "  + objAjax.getDocViewId());
    	_startSmartTagPopup(htmlfldName, false, null, true);
        objAjax.setActionURL("colorlib.do");
        objAjax.setActionMethod(actMethod);
        objAjax.attribute().setAttribute("htmlfldName", htmlfldName);
        objAjax.setProcessHandler(_showPopupDiv);

        //alert("sending");
        objAjax.sendRequest();
    }
}

function closeCXFDiv()
{
 	var msgDivObj = parent.document.getElementById("_popupDIV");
 	// alert("msgDivObj="+msgDivObj);
 	if(msgDivObj)
 	{
 		msgDivObj.style.visibility="hidden";
    	msgDivObj.style.display = "none";
 		// msgDivObj.innerHTML = "";
 		msgDivObj.parentNode.removeChild(msgDivObj);
 	}

	_closeSmartTag();
 	if (typeof(objDraggable)!='undefined') objDraggable.destroy();
}

function submitCXFForm(divId)
{

    FRM='CXFFORM';

    var fileName = document.forms[0]._cxfFile.value;

	if (fileName == '')
	{
        alert("Please select a file to upload");
        return false;
    }
    else if(!isCXFFile(fileName))
    {
    	alert("Please select only CXF/XML file to upload");
    }
    else
    {
    	fsubmit();
    	return true;
    }
}

function isCXFFile(fileName)
{
	var ext = fileName.substring(fileName.indexOf('.'));
	ext = ext.toUpperCase();

	var cxfExt = ".CXF";
	var xmlExt = ".XML";

	if(ext == cxfExt || ext == xmlExt)
	{
		return true;
	}
	else
	{
		return false;
	}
}
// Tracker#:14902 XRITE INTEGRATION (CXF FILES) WITH COLOR LIBRARY UI CHANGES
// Show the popup in the center of the page. get the popup object from _showSmartTagPopup and
// position it in the center the page
function _showPopupDiv(objAjax)
{
    if(objAjax)
    {
        //display the user message when drop downs are not loaded
        _displayProcessMessage(objAjax);
        if(!objAjax.isProcessComplete())
        {
            _closeSmartTag();
        }
        else
        {
           var popUpDiv = _showSmartTagPopup(objAjax);
           positionPageCenter(popUpDiv);
        }
    }
}
// Tracker#:14902 XRITE INTEGRATION (CXF FILES) WITH COLOR LIBRARY UI CHANGES
// Position the divObj in center of the page.
function positionPageCenter(divObj)
{
	if(divObj!=null)
	{
		var top=(screen.height/2)-(divObj.offsetHeight/2);
		var left=(screen.width/2)-(divObj.offsetWidth/2);
		divObj.style.top = top+"px";
		divObj.style.left = left+"px";
	}
}

//Tracker#: 16781 - Testing Instructions associations for plm screens
//Diplaying the Test Instruction tab
function showTestingInstructions(parentDocViewId)
{
	var url = "view";
    url += "&parentDocViewId="+parentDocViewId;
 	    // Check for valid record to show the screen(tab).
    if(!isValidMaterialQuote(true))
	{
		return;
	}
	Process.execute(url, "testinginstructionsplm.do");
}
