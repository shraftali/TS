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
//Tracker#16141
//Added additional parameter, readonly, used while printing ArtworkEval popup.
function _showArtWrkEvalDtls(htmlfldName,rowno,readonly)
{
	if(rowno)
    {
    	//alert("Readonly---->"+readonly);
    	//Tracker#16141
    	//Set readonly to action method.
        var actMethod = "showArtEvalDtls&rowno="+ rowno+"&readonly="+readonly;
        var htmlAreaObj = _getWorkAreaDefaultObj();
        var objAjax = htmlAreaObj.getHTMLAjax();
		//alert("actMethod-->"+actMethod);
        if(objAjax)
        {    
        //alert("inside if");
            ///Tracker#:12867 - OUTSTANDING TECH SPEC>MASS REPLACE ISSUES
            //set the popup as editable
            _startSmartTagPopup(htmlfldName, false, null, true);
            //alert("inside calling");
            bShowMsg = true;
            objAjax.setActionURL("submitrounds.do");
            objAjax.setActionMethod(actMethod);
            objAjax.attribute().setAttribute("htmlfldName", htmlfldName);
            objAjax.setProcessHandler(_showSmartTagInteractivePopup);
            //Tracker#12417 - disable application process bar.
            objAjax.showProcessingBar(false);
            objAjax.sendRequest();
        }
    }
}

function _roundsArtWrkEvalSave(divid)
{
	var objDiv  = getElemnt(divid);
	
	if(!objDiv)return false;
	
	var divDocVwId = _getCompDocViewId(objDiv);
		
	var url = "saveArtWrkEval";
 	var htmlAreaObj = _getAreaObjByDocView(divDocVwId);	//_getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	sectionName = objAjax.getDivSectionId();
	//alert("_showSampleTabView \n sectionName  " + sectionName);
    if(objAjax && objHTMLData)
    {
    	//alert("inside calling");
    	bShowMsg = true;
    	//alert("before load workarea");
       	//loadWorkArea("sample.do", url);
        objAjax.setActionMethod(url);
        objAjax.setActionURL("submitrounds.do");
        objAjax.setProcessHandler(_artWrkEvalSaveCallBack);

       // alert("objHTMLData.getChangeFields() "+ objHTMLData.getChangeFields());
        //alert("objHTMLData.getChangeFields() "+ objHTMLData.getChangeFields());
        objHTMLData.performSaveChanges(_artWrkEvalSaveCallBack, objAjax);
        
        if(objAjax.isProcessComplete())
        {
            objHTMLData.resetChangeFields();
        }
    }
}

function _artWrkEvalSaveCallBack(objAjax)
{
	//alert("_artWrkEvalSaveCallBack " + _artWrkEvalSaveCallBack);
	_showSubmitWorkArea(objAjax);
	_closeSmartTag();
}

function showQTXMsg(msg)
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
  	var objAjax = htmlAreaObj.getHTMLAjax();
  	var htmlErrors = objAjax.error();
	objAjax.error().addError("errorInfo",msg, true);
	messagingDiv(htmlErrors);
	return;
}

// Tracker#:14435 ISSUE WITH SAVE PROMPT,SYSTEM DISPLAYS'PREVIOUS ACTION ENCOUNTERED ERROR' 
// moved these function from colorlib.js
//showLabdipOverview
function showLabdipOverview(obj)
{
	Process.showOverview(obj, "labdip.do", "TOOVERVIEW");
}

function sortLabDipColumn(fieldName,sec,type, pageNo)
{
    //alert("sortPaletteColumn called");
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
    	var docview = objAjax.getDocViewId();
		var url = "SORT&sortColumn="+fieldName+"&sort="+type+"&pageNum="+pageNo;
		var action,cncl,processHandler;
		if(docview == 3401)
    	{	
			action = 'labdip.do';
			processHandler = _showLabDipPage;
			cncl = "laodPLMSortColumn('labdip.do','"+url+"',_showLabDipPage);";
    	}
        //Tracker#14294
		//Sorting Multisubmits screen.
        if(docview == 3405)
        {
        	action = 'multisubmits.do';
			processHandler = _showSubmitWorkArea;
			cncl = "laodPLMSortColumn('multisubmits.do','"+url+"',_showSubmitWorkArea);";
        }
		if(objHTMLData!=null && objHTMLData.isDataModified())
        {
            var htmlErrors = objAjax.error();
            htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
            messagingDiv(htmlErrors, "saveWorkArea()", cncl);
	   		return;
        }
		else
		{
			laodPLMSortColumn(action,url,processHandler);
		}
    }
    
}

//function cancelSub
function cancelSub()
{
	var url = "cancelsubmit";
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
    	 if(docview==3400)
    	 {
       		loadWorkArea("labdipoverview.do", url);
       		return;
       	 }
       	 if(docview==3401)
       	 {
       	 objAjax.setActionURL("labdip.do");
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

 
 //Function for reopenSubmit
function reopenSubmit()
{
	var url = "reopen";
	var docview;

	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	sectionName = objAjax.getDivSectionId();
	   //alert("sectionName  " + sectionName);

	if(objAjax && objHTMLData)
    {
    	//Tracker #12635 - ISSUES ON BLANK RECORD OF SUBMITS
		// Check for valid record to execute process.
   		if(!isValidRecord(true))
		{
			return;
		}
    	docview = objAjax.getDocViewId();
    	//alert("inside calling");
    	bShowMsg = true;
    	 if(docview==3400)
    	 {
       		loadWorkArea("labdipoverview.do", url);
       		return;
       	 }
       	 if(docview==3401)
       	 {
       	  if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
			   	{
			   		var htmlErrors = objAjax.error();
			   		objAjax.error().addError("warningInfo", szMsg_Sel_Submit, false);
			   		messagingDiv(htmlErrors);
			   		return;
			   	}
       	 objAjax.setActionURL("labdip.do");
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

//linkSubmits()
function linkSubmits()
{
	var url = "linksubmits";
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
			   		objAjax.error().addError("warningInfo", szMsg_Sel_Submit, false);
			   		messagingDiv(htmlErrors);
			   		return;
			   	}
       	objAjax.setActionURL("labdip.do");
       	objAjax.setActionMethod(url);
        objAjax.setProcessHandler(_showColorLibPage);
        objHTMLData.performSaveChanges(_showColorLibPage, objAjax);
        if(objAjax.isProcessComplete())
        {
            objHTMLData.resetChangeFields();
        }
    }

}

//Function unLinkSubmits
function unLinkSubmits()
{
	var url = "unlinksubmits";
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
			   		objAjax.error().addError("warningInfo", szMsg_Sel_Submit, false);
			   		messagingDiv(htmlErrors);
			   		return;
			   	}
       	objAjax.setActionURL("labdip.do");
       	objAjax.setActionMethod(url);
        objAjax.setProcessHandler(_showColorLibPage);
        objHTMLData.performSaveChanges(_showColorLibPage, objAjax);
        if(objAjax.isProcessComplete())
        {
            objHTMLData.resetChangeFields();
        }
    }

}


//Function sendSubmit
function sendSubmit()
{
	var url = "send";
	var docview;

	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	sectionName = objAjax.getDivSectionId();
	//  alert("sectionName  " + sectionName);
	if(objAjax && objHTMLData)
    {
    	//Tracker #12635 - ISSUES ON BLANK RECORD OF SUBMITS
		// Check for valid record to execute process.
   		if(!isValidRecord(true))
		{
			return;
		}
    	docview = objAjax.getDocViewId();
    	//alert("inside calling");
    	bShowMsg = true;
    	 if(docview==3400)
    	 {
       		loadWorkArea("labdipoverview.do", url);
       		return;
       	 }
       	 if(docview==3401)
       	 {
       	  if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
			   	{
			   		var htmlErrors = objAjax.error();
			   		objAjax.error().addError("warningInfo", szMsg_Sel_Submit, false);
			   		messagingDiv(htmlErrors);
			   		return;
			   	}
       	 objAjax.setActionURL("labdip.do");
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


//Function submit
function submit()
{
	var url = "submit";
	var docview;

	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	sectionName = objAjax.getDivSectionId();
	   //alert("sectionName  " + sectionName);
    if(objAjax && objHTMLData)
    {
    	//Tracker #12635 - ISSUES ON BLANK RECORD OF SUBMITS
		// Check for valid record to execute process.
   		if(!isValidRecord(true))
		{
			return;
		}
    	docview = objAjax.getDocViewId();
    	//alert("inside calling");
    	bShowMsg = true;
    	 if(docview==3400)
    	 {
       		loadWorkArea("labdipoverview.do", url);
       		return;
       	 }
       	 if(docview==3401)
       	 {
       	  if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
			   	{
			   		var htmlErrors = objAjax.error();
			   		objAjax.error().addError("warningInfo", szMsg_Sel_Submit, false);
			   		messagingDiv(htmlErrors);
			   		return;
			   	}
       	 objAjax.setActionURL("labdip.do");
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

//Function for createLabdip
function createLabdip()
{
	var url = "createlabdip";
   	var docview;
   	//_getWorkAreaObj().setDivDefaultSaveContainerName(divSaveContainerName);

	var htmlAreaObj = _getWorkAreaDefaultObj();

	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();

	sectionName = objAjax.getDivSectionId();
	   //alert("sectionName  " + sectionName);
    if(objAjax)
    {
    	//Tracker#17758
    	//Check for valid record before chaning navigation links.
    	if(!isValidRecord(true))
		{
			return;
		}
    	docview = objAjax.getDocViewId();
    	//alert("docview  " + docview);
    	//Tracker#17758
    	//Left Navigation changes moved down.
    	bShowMsg = true;
    	if((docview == 3500) || (docview == 3506) || (docview==3509) || (docview==3510) || (docview==3511) || (docview==3512))
    	{
    		if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
    			{
			   		var htmlErrors = objAjax.error();
			   		objAjax.error().addError("warningInfo", szMsg_Sel_Color1, false);
			   		messagingDiv(htmlErrors);
			   		return;
			   	}
			//To check the Non Library Colors are selected for Create Submit process
			//If so give warning message.
			if(objHTMLData!=null)
			{
				var chkboxobj = isNonLibColorsSlt(objHTMLData);

				if(chkboxobj!=null)
				{
					var htmlErrors = objAjax.error();
					objAjax.error().addError("warningInfo", "Non Library Colors can not be called Create Submit.", false);
					messagingDiv(htmlErrors);
					//objHTMLData.resetChangeFields();
					var chkbox = getElemnt(chkboxobj);

					if(chkbox!=null && typeof(chkbox)!='undefined')
					{
						chkbox.checked = false;
					}
					chkboxobj = isDroppedColorsSlt(objHTMLData);
					if(chkboxobj==null)
					{
						return;
					}
				}



				if(chkboxobj!=null)
				{
					var htmlErrors = objAjax.error();
					objAjax.error().addError("errorInfo", "Cannot create a submit for Dropped Color(s).", true);
					messagingDiv(htmlErrors);
					objHTMLData.resetChangeFields();
					var chkbox = getElemnt(chkboxobj);

					if(chkbox!=null && typeof(chkbox)!='undefined')
					{
						chkbox.checked = false;
					}
					return;
				}

			}
    		url = "createpalettelabdip";
    		url += "&keyinfo= " +getComponentKeyInfo();
    		objAjax.setActionURL("labdipoverview.do");
    		objAjax.setActionMethod(url);
            objAjax.setProcessHandler(_showWorkArea);
            objHTMLData.performSaveChanges(_showWorkArea, objAjax);
            if(objAjax.isProcessComplete())
            {
                objHTMLData.resetChangeFields();
            }
    	}
    	else if((docview == 2904))
    	{
    		//Tracker#17758
    		//Check for valid record is done at the start, valid record check
    		//is removed from here.
    		url = "createcolorlabdip";
	    	loadWorkArea("labdipoverview.do", url);
    	}
    	else if((docview == 2901) || (docview == 2903) || (docview == 2902))
    	{
    		if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
    			{
			   		var htmlErrors = objAjax.error();
			   		objAjax.error().addError("warningInfo", szMsg_Sel_Color1, false);
			   		messagingDiv(htmlErrors);
			   		return;
			   	}
		  var url ="createcolorlabdip&_nColLibRow=" + _nColLibRow ;
          url += "&keyinfo=" +getComponentKeyInfo();

          //alert("submit.js url 539 " + url  );
          loadWorkArea("labdipoverview.do", url);
    	}
    	else if((docview == 3300)  || (docview == 3303) ||(docview == 3311) || (docview==3312) || (docview==3313) || (docview==3319) || (docview==3320)|| (docview==3321) || (docview == 3322) || (docview == 3336))
    	{
    		//Tracker#17758
    		//Check for valid record is done at the start, valid record check
    		//is removed from here.
	    	url = "creatematlabdip";
	    	loadWorkArea("labdipoverview.do", url);
    	}   
    	//Tracker#17732
    	//Adding new docviewids created for different material type(list) 	
    	else if((docview == 3301) || (docview==3323) || (docview==3324) || (docview==3325) 
        || (docview==3326) || (docview==3327) || (docview==3328) || (docview==3329) || (docview==3330) || (docview==3331)
         || (docview==3332) || (docview==3333) || (docview==3337))
    	{
    		if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
    			{
			   		var htmlErrors = objAjax.error();
			   		objAjax.error().addError("warningInfo", szMsg_Sel_Color1, false);
			   		messagingDiv(htmlErrors);
			   		return;
			   	}
		  var url ="creatematlabdip&_nMatLibRow=" + _nColLibRow ;
          url += "&keyinfo=" +getComponentKeyInfo();
          loadWorkArea("labdipoverview.do", url);
    	}
    	else
    	{
    	loadWorkArea("labdipoverview.do", url);
    	}
    	//Tracker#15941 - GETTING ERROR PREVIOUS ACTION ENCOUNTERED ERROR WHILE DELETING THE SUBMIT RECORD
    	//Tracker#: 16104 MATERIAL PROJECTIONS LEFT NAVIGATION: THE "SHOW SEARCH LIST" ICON IS MISSING
		//Changing the id of the div
    	if((docview != 3400) && (docview != 3401))
    	{
    		restoreArea(designCenterTabId);
    		pna('cdiv','3400'+ designCenterTabId + suffixNav, designCenterTabId,'left');
    	}


        //objHTMLData.performSaveChanges(_showWorkArea, objAjax);
        //if(objAjax.isProcessComplete())
        //{
        //    objHTMLData.resetChangeFields();
        //}

    }
}


//Function createBulk()
function createBulk()
{
	//alert("Inside createBulk function");
	var url = "bulksubmit";
	var docview;

	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	sectionName = objAjax.getDivSectionId();
	//alert("sectionName  " + sectionName);

    if(objAjax && objHTMLData)
    {
    	//Tracker #12635 - ISSUES ON BLANK RECORD OF SUBMITS
		// Check for valid record to execute process.
   		if(!isValidRecord(true))
		{
			return;
		}
    	docview = objAjax.getDocViewId();
    	//alert("inside calling");
    	bShowMsg = true;
    	 if(docview==3400)
    	 {
       		loadWorkArea("labdipoverview.do", url);
       		return;
       	 }
       	 if(docview==3401)
       	 {
       	  if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
			   	{
			   		var htmlErrors = objAjax.error();
			   		objAjax.error().addError("warningInfo", szMsg_Sel_Submit, false);
			   		messagingDiv(htmlErrors);
			   		return;
			   	}
       	  url +="&_nColLibRow=" + _nColLibRow ;
    	 url += "&keyinfo= " + getComponentKeyInfo();
   		 //alert("url " + url);
    	loadWorkArea("labdipoverview.do", url);
       	 }
    }

}

//Function showRefSubmit()
function showRefSubmit()
{
   	//alert("Inside showRefSubmit function");
	var url = "showrefsubmit";
	url += "&keyinfo= " + getComponentKeyInfo();
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	sectionName = objAjax.getDivSectionId();
	   //alert("sectionName  " + sectionName);
    if(objAjax && objHTMLData)
    {
    	bShowMsg = true;
    	loadWorkArea("labdipoverview.do", url);
       	return;

    }

}

//Function for copySubmit
function copySubmit()
{
	var url = "copysubmit";
	var docview;

	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	sectionName = objAjax.getDivSectionId();
	   //alert("sectionName  " + sectionName);

    if(objAjax && objHTMLData)
    {
    	//Tracker #12635 - ISSUES ON BLANK RECORD OF SUBMITS
		// Check for valid record to execute process.
   		if(!isValidRecord(true))
		{
			return;
		}
    	docview = objAjax.getDocViewId();
    	//alert("inside calling");
    	bShowMsg = true;
    	 if(docview==3400)
    	 {
       		loadWorkArea("labdipoverview.do", url);
       		return;
       	 }
       	 if(docview==3401)
       	 {
       	  if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
			   	{
			   		var htmlErrors = objAjax.error();
			   		objAjax.error().addError("warningInfo", szMsg_Sel_Submit, false);
			   		messagingDiv(htmlErrors);
			   		return;
			   	}
       	  url +="&_nColLibRow=" + _nColLibRow ;
    	 url += "&keyinfo= " + getComponentKeyInfo();
   		 //alert("url " + url);
    	loadWorkArea("labdipoverview.do", url);
       	 }
    }
}

//Function createSendSubmit
function createSendSubmit()
{
	 Process.execute("createsendsubmit", "labdipoverview.do");
}

function _showLabDipPage(objAjax)
{
    //alert(" _showLabDipPage: \n sectionName "+sectionName);
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


//Function createSubmits
function createSubmits()
{
	var url = "createsubmits";
   	var docview;
   	//_getWorkAreaObj().setDivDefaultSaveContainerName(divSaveContainerName);

	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();

	sectionName = objAjax.getDivSectionId();
	   //alert("sectionName  " + sectionName);
    if(objAjax)
    {
    	// Tracker#:12630 ISSUES ON COLOR PALETTE BLANK RECORD
	   	// Check for valid record to execute process.
    	if(!isValidRecord(true))
   		{
   			return;
   		}
	
   		docview = objAjax.getDocViewId();
    	
    	//alert("docview  " + docview);
    	//Tracker#15941 - GETTING ERROR PREVIOUS ACTION ENCOUNTERED ERROR WHILE DELETING THE SUBMIT RECORD
    	if((docview == 3500) || (docview == 3506) || (docview==3509) || (docview==3510) || (docview==3511) || (docview==3512))
    	{
    		if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
    			{
			   		var htmlErrors = objAjax.error();
			   		objAjax.error().addError("warningInfo", szMsg_Sel_Color1, false);
			   		messagingDiv(htmlErrors);
			   		return;
			   	}
			//To check the Non Library Colors, dropped colors and dropped artworks are selected for Create Submit process
			//If so give warning message.
			if(objHTMLData!=null)
			{
				var nlchkboxobj = isNonLibColorsSlt(objHTMLData);
				var dcchkboxobj = isDroppedColorsSlt(objHTMLData);
				var dachkboxobj = isDroppedArtworksSlt(objHTMLData);
				if(nlchkboxobj!=null)
				{
					var htmlErrors = objAjax.error();
					objAjax.error().addError("warningInfo", "This feature is not supported right now.", false);
					messagingDiv(htmlErrors);
				}
				if(dcchkboxobj!=null)
				{
					var htmlErrors = objAjax.error();
					objAjax.error().addError("errorInfo", "Cannot create a submit for Dropped Color(s) and Dropped Artwork(s).", true);
					messagingDiv(htmlErrors);
				}
				if(dachkboxobj!=null)
				{
					var htmlErrors = objAjax.error();
					objAjax.error().addError("errorInfo", "Cannot create a submit for Dropped Color(s) and Dropped Artwork(s).", true);
					messagingDiv(htmlErrors);
				}
				if(nlchkboxobj!=null || dcchkboxobj!=null || dachkboxobj!=null)
				{
					unCheck(objHTMLData);
					objHTMLData.resetChangeFields();
					return;
				}
			}
    		url = "createpalettesubmits";
    		url += "&keyinfo= " +getComponentKeyInfo();
    		objAjax.setActionURL("multisubmits.do");
    		objAjax.setActionMethod(url);
        	objAjax.setProcessHandler(_showWorkArea);
        	objHTMLData.performSaveChanges(_showWorkArea, objAjax);
        	if(objAjax.isProcessComplete())
            {
                objHTMLData.resetChangeFields();
            }
       }

       else if((docview == 2901) || (docview == 2903) || (docview == 2902))
    	{
    		if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
    			{
			   		var htmlErrors = objAjax.error();
			   		objAjax.error().addError("warningInfo", szMsg_Sel_Color1, false);
			   		messagingDiv(htmlErrors);
			   		return;
			   	}
		  var url ="createcolorsubmits&_nColLibRow=" + _nColLibRow ;
          url += "&keyinfo=" +getComponentKeyInfo();

          //loadWorkArea("multisubmits.do", url);

          objAjax.setActionURL("multisubmits.do");
    	  objAjax.setActionMethod(url);
          objAjax.setProcessHandler(_showSubmitWorkArea);
          objHTMLData.performSaveChanges(_showSubmitWorkArea, objAjax);
          if(objAjax.isProcessComplete())
          {
              objHTMLData.resetChangeFields();
          }
    	}
    	//Tracker#17732
    	//Adding new docviewids created for different material type(list)
    	else if((docview == 3301) || (docview==3323) || (docview==3324) || (docview==3325) 
        || (docview==3326) || (docview==3327) || (docview==3328) || (docview==3329) || (docview==3330) || (docview==3331)
         || (docview==3332) || (docview==3333) || (docview==3337))
    	{
    		if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
    			{
			   		var htmlErrors = objAjax.error();
			   		objAjax.error().addError("warningInfo", szMsg_Sel_Color1, false);
			   		messagingDiv(htmlErrors);
			   		return;
			   	}
		  var url ="creatematsubmits&_nMatLibRow=" + _nColLibRow ;
          url += "&" +getComponentKeyInfo();
          //loadWorkArea("multisubmits.do", url);
          objAjax.setActionURL("multisubmits.do");
    	  objAjax.setActionMethod(url);
          objAjax.setProcessHandler(_showSubmitWorkArea);
          objHTMLData.performSaveChanges(_showSubmitWorkArea, objAjax);
          if(objAjax.isProcessComplete())
          {
              objHTMLData.resetChangeFields();
          }
    	}

    	else if((docview == 14000))
    	{
    		var obj = $('#hdnSubmitMsg');
    		
    		if(obj && obj.attr("value"))
    		{	
    			var htmlErrors = objAjax.error();
    			htmlErrors.addError("warningInfo", obj.attr("value"),  false);
    			messagingDiv(htmlErrors);
    			return;
    		}
    		
    		if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
			{
		   		var htmlErrors = objAjax.error();
		   		objAjax.error().addError("warningInfo", szMsg_Sel_Color1, false);
		   		messagingDiv(htmlErrors);
		   		return;
		   	}
			//Tracker#19587 COLOR BOM DELETE COMPONENT DOES NOT ASK THE USER TO SAVE CHANGES TO BOM FOR THE PROCESS CONTINUES
	        //User edits the screen and execute the 'Create Submit(s)' process without saving the changes
		    //Pop up the  message 'There are changes on the screen. Do you want to save changes before current action?'.
	   		if(objHTMLData!=null && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
	    	{
	        	var htmlErrors = objAjax.error();
	        	htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
	        	messagingDiv(htmlErrors, 'saveWorkArea()', '_continueBOMCCreateSubmit()');
	        	return;
	    	}
	    	_continueBOMCCreateSubmit();
    	}
    	else if((docview == 4205))
    	{
    		if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
    			{
			   		var htmlErrors = objAjax.error();
			   		objAjax.error().addError("warningInfo", szMsg_Sel_Color1, false);
			   		messagingDiv(htmlErrors);
			   		return;
			   	}
		  var url ="forwardcombosubmits" ;
          //loadWorkArea("multisubmits.do", url);
          objAjax.setActionURL("multisubmits.do");
    	  objAjax.setActionMethod(url);
          objAjax.setProcessHandler(_showSubmitWorkArea);
          objHTMLData.performSaveChanges(_showSubmitWorkArea, objAjax);
          if(objAjax.isProcessComplete())
          {
              objHTMLData.resetChangeFields();
          }
    	}

    }
}

//Tracker#19587 COLOR BOM DELETE COMPONENT DOES NOT ASK THE USER TO SAVE CHANGES TO BOM FOR THE PROCESS CONTINUES
function _continueBOMCCreateSubmit()
{
	closeMsgBox();
	Process.saveChanges("bomc.do", "forwardbomsubmits&_nMatLibRow=" + _nColLibRow + "&" +getComponentKeyInfo(), _showSubmitWorkArea);
}

function _showDeleteSubmitWorkArea(objAjax)
{
    try
    {
        //alert("_showWorkArea ");
        if(objAjax)
        {
            _displayProcessMessage(objAjax)
            //alert("_showWorkArea: \n _getWorkAreaObj().getDivSaveContainerName() " + _getWorkAreaObj().getDivSaveContainerName());

            var div=getElemnt(objAjax.getDivSectionId());//_getWorkAreaDefaultObj().getDivSaveContainerName());
            if(div)
            {
               registerHTML(div,objAjax);
            }
            //reset autosuggest instances
            /*if(typeof(_autoSuggestReset)=="function")
            {
                _autoSuggestReset();
            }*/
             if(nCurScrWidth > MinimumScrWidth)
            {
               resetAllMainDivs();
            }
            //Tracker#: 14105 REFRESHING THE NAVIGATION GRID WHEN THE DATA IS DELETED
            //Calling the navigation grid refresh method once the delete process is completed
            refreshNavigationGrid(objAjax);
        }
    }
    catch(e)
    {
        //alert(e.description);
    }
}

function _showSubmitWorkArea(objAjax)
{
    try
    {
        //alert("_showSubmitWorkArea ");
        if(objAjax)
        {
            //alert("1");
            _displayProcessMessage(objAjax)
            //alert("2");
            //alert("_showWorkArea: \n _getWorkAreaDefaultObj().getDivSaveContainerName() " + _getWorkAreaDefaultObj().getDivSaveContainerName());

            var div=getElemnt(_getWorkAreaDefaultObj().getDivSaveContainerName());
            //alert("3");
            if(div)
            {
                //alert("register called");
               registerHTML(div,objAjax);
            }
            //reset autosuggest instances
            /*if(typeof(_autoSuggestReset)=="function")
            {
                _autoSuggestReset();
            }*/

            //Calling this function for the attchment screen where the vertical scroll bar was missing after
            //deleting the attachment images associated with the tech spec,material library and Artwork library
            //screen.
            alignWorkAreaContainer();
            if(nCurScrWidth > MinimumScrWidth)
            {
               resetAllMainDivs();
            }
        }

        showChangeTrackingTabCount();
    }
    catch(e)
    {
        //alert(e.description);
    }
}


//Function addSubmits
function addSubmits()
{
   Process.execute("addsubmits", "multisubmits.do");
}

//copySubmits
function copySubmits()
{
	var url = "copysubmits";
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
		   		objAjax.error().addError("warningInfo", szMsg_Sel_Submit, false);
		   		messagingDiv(htmlErrors);
		   		return;
		   	}
		   	if(docview == 3405)
			{
			objAjax.setActionURL("multisubmits.do");
       		objAjax.setActionMethod(url);
        	objAjax.setProcessHandler(_showColorLibPage);
        	objHTMLData.performSaveChanges(_showColorLibPage, objAjax);
        	if(objAjax.isProcessComplete())
        	{
            	objHTMLData.resetChangeFields();
        	}
			}
			if(docview == 3401)
			{
				url = "copylistsubmits";
				objAjax.setActionURL("multisubmits.do");
       			objAjax.setActionMethod(url);
        		objAjax.setProcessHandler(_showSubmitWorkArea);
        		objHTMLData.performSaveChanges(_showSubmitWorkArea, objAjax);
        		if(objAjax.isProcessComplete())
        		{
            		objHTMLData.resetChangeFields();
        		}
			}
	}
}

//Function for cancelSubmit
function cancelSubmit()
{

	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();

	if(objAjax && objHTMLData)
    {
    	//Tracker #12635 - ISSUES ON BLANK RECORD OF SUBMITS
		// Check for valid record to execute process.
   		if(!isValidRecord(true))
		{
			return;
		}
    	docview = objAjax.getDocViewId();
	 if(docview==3401)
       	 {
       	 if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
			   	{
			   		var htmlErrors = objAjax.error();
			   		objAjax.error().addError("warningInfo", szMsg_Sel_Submit, false);
			   		messagingDiv(htmlErrors);
			   		return;
			   	}
       	 }
	var htmlErrors = objAjax.error();
	htmlErrors.addError("confirmInfo","Do you want to Cancel Submit(s)",  false);
	messagingDiv(htmlErrors,'cancelSub()');
	}
}
// Tracker#:14435 changes closed here

//Tracker#:12635 ISSUES ON BLANK RECORD OF SUBMITS
//Moved following functions here from colorlib.js.
//Function showRounds
function showRounds()
{
  	// Check for valid record to show the screen(tab).
	if(!isValidSubmit(true))
	{
		return;
	}
	Process.execute("showrounds", "submitrounds.do");
}
//Tracker#:23681 - EVENT ASSOCIATION ISSUES 
//Fixed the issue of repeating "There are changes on the screen" message
//even after clicking on Cancel button.
function showStyleUsage()
{
    // Check for valid record to show the screen(tab).
    if(!isValidSubmit(true))
	{
		return;
	}
    Process.execute("view", "styleusage.do");
}

function showSubmitAttachment()
{
  	// Check for valid record to show the screen(tab).
    if(!isValidSubmit(true))
	{
		return;
	}
    Process.execute("view", "submitattachment.do");
}

//Tracker#157597 - REGRESSION: BLANK SUBMIT OVERVIEW SCREEN IS DISPLAYED IF WE DELETE THE IMAGES IN ATTACHMENT TAB 
//Function called on click of submit tab.
function _showSubmitOverview()
{
  	Process.execute("view", "labdipoverview.do");
   }
//Tracker#12635 ISSUES ON BLANK RECORD OF SUBMITS
function isValidSubmit(displayMessage)
{
	return _checkIsValidRecord("_isValidSubmit", true, szMsg_Invalid_Submit);
}

//Tracker#14900 ADD EVENTS TAB ON SUBMIT SCREEN
function showSubmitsEvents()
{
   	// Check for valid record to show the screen(tab).
    if(!isValidSubmit(true))
	{
		return;
	}
	Process.execute("view", "submitevents.do");
   }

    //Tracker#:15729 GETTING ERROR ON SAVING MORE THAN ONE SUBMIT ON SUBMIT LIST SCREEN.
   //Display particular round sections/data on clicking on the collapseable bar.
   function _displayRound(roundNO,secId)
   {
   		var url = "displayround&roundNO="+roundNO;
	   	//alert("Round No-->"+roundNO);
	   	var htmlAreaObj = _getWorkAreaDefaultObj();
	    var objAjax = new htmlAjax();
	    objAjax.setDivSectionId(secId);
	    bShowMsg = true;
	    objAjax.setActionURL("submitrounds.do");
	    objAjax.setActionMethod(url);
	    objAjax.setProcessHandler(_showRound);
	    objAjax.sendRequest();
	    return;
   }
   
   
//Tracker#:15729 GETTING ERROR ON SAVING MORE THAN ONE SUBMIT ON SUBMIT LIST SCREEN.
// function to load the html in the corresponding  sample section
function _showRound(objAjax)
{
    try
    {
        //alert("_showRound ");
        if(objAjax)
        {
            _displayProcessMessage(objAjax)
            //alert("_showRound: \n _objAjax.getDivSectionId() " + objAjax.getDivSectionId());
            var div=getElemnt(objAjax.getDivSectionId());
            if(div)
            {
               registerHTML(div,objAjax);
            }

            //Calling this function for the attchment screen where the vertical scroll bar
            alignWorkAreaContainer();
            if(nCurScrWidth > MinimumScrWidth)
            {
               resetAllMainDivs();
            }
        }
    }
    catch(e)
    {
        //alert(e.description);
    }
}

//Tracker#14356,15951 ABILITY FOR COLORIST TO DOWNLOAD QTX FILE FOR SUBMITS EVALUATION (DATA COLOR INTEGRATION)
function downloadSRQTX()
{
    window.open("labdipoverview.do?method=downloadsrqtx");
}


//Tracker#14356,15951 ABILITY FOR COLORIST TO DOWNLOAD QTX FILE FOR SUBMITS EVALUATION (DATA COLOR INTEGRATION)
function downloadESQTX(rowNO)
{
   window.open("submitrounds.do?method=downloadesqtx&rowno="+rowNO);
}
	
	

//Tracker:22350 REFRESH - PROCESS MISSING ON SUBMIT OVERVIEW SCREEN
//Adding Refresh process to the MoreActions menu
function refreshSubmits()
{
	var url = "db_refresh";
	if(!isValidRecord(true))
	{
		return;
	}
    var docview;
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objAjax.getDivSectionId();
    if(objAjax && objHTMLData)
    {
        docview = objAjax.getDocViewId();
        bShowMsg = true;
        loadWorkArea("labdipoverview.do", url);
        
        if(objAjax.isProcessComplete())
        {
            objHTMLData.resetChangeFields();
        }
    }
}
/**
 * Tracker#:23876 FDD575: IMPLEMENT OPEN A PREVIOUS ROUND PROCESS ON SUBMIT ROUND SCREEN
 * will open popup, which shows list of rounds on Rounds screen, will be called on click of
 * Open Previous Round process on Rounds screen.
 */
function _roundsOpen()
{
	var actMethod = "reopenrounds";
	if(!isValidRecord(true))
	{
		return;
	}
    var docview;
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objAjax.getDivSectionId();    
    if(objAjax && objHTMLData)
    {
    	var htmlfldName = htmlAreaObj.getDivSectionId();
    	_startSmartTagPopup(htmlfldName, true, null, true);
        //alert("inside calling");
        bShowMsg = true;
        objAjax.setActionURL("submitrounds.do");
        objAjax.setActionMethod(actMethod);
        objAjax.attribute().setAttribute("htmlfldName", htmlfldName);
        objAjax.setProcessHandler(_showSmartTagInteractivePopup);
        objAjax.sendRequest();
    }
}
/**
 * will be called on Clicking "Open" button of Open Previous Round Popup, on Rounds screen.
 */
function _editPreviousRound()
{
	var url = "editprevround";
	if(!isValidRecord(true))
	{
		return;
	}
    var docview;
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objAjax.getDivSectionId();
    var roundSlt = getElemntByName("_reopenRounds");
    var selectedRound = -1;
    for(var i=0; i<roundSlt.length; i++)
    	{
    		var round = roundSlt[i];
    		if(round.checked)
    			{
    				selectedRound = round.value;
    			}
    	}
    
    if(objAjax && objHTMLData)
    {
    	_executePreProcess();
        docview = objAjax.getDocViewId();
        bShowMsg = true;
        objAjax.setActionURL("submitrounds.do");
        objAjax.setActionMethod(url);
        objAjax.parameter().add("roundSlt", selectedRound);
        objAjax.setProcessHandler(_showWorkArea);
        objAjax.sendRequest();
        
        if(objAjax.isProcessComplete())
        {
            objHTMLData.resetChangeFields();
        }
    }
}