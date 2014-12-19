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
//Submi Events related java script functions.

	//Fuction deleteEvent.
	function deleteEvent()
	{
		var htmlAreaObj = _getWorkAreaDefaultObj();
		var objAjax = htmlAreaObj.getHTMLAjax();
		var objHTMLData = htmlAreaObj.getHTMLDataObj();
		//alert("sectionName  " + sectionName);
	    if(objAjax && objHTMLData)
	    {
	    	if(!isValidRecord(true))
			{
				return;
			}
	    	var htmlErrors = objAjax.error();
	    	//delete Event
	    	if(!objHTMLData._mHasUserModifiedData)
		    {
		    	htmlErrors.addError("confirmInfo","Do you want to delete Event?",  false);
   				messagingDiv(htmlErrors,'dltEvent()','closeMsgBox();');
		    }
		    //delete Event detail
		    else
		    {
		    	htmlErrors.addError("confirmInfo","Do you want to delete Event detail(s)?",  false);
   				messagingDiv(htmlErrors,'dltEventDetail()','closeMsgBox()');
   			}
   		}
	}	
	
	//Function dltEventDetail
    function dltEventDetail()
    {
	    var url = "delete";
	 	var htmlAreaObj = _getWorkAreaDefaultObj();
		var objAjax = htmlAreaObj.getHTMLAjax();
		var objHTMLData = htmlAreaObj.getHTMLDataObj();
		
		//alert('changed fields-->'+objHtmlData.getChangeFields());
		//setval("chgflds", objHtmlData.getChangeFields());
	    // Check for valid record to show the screen(tab).
	    
		sectionName = objAjax.getDivSectionId();
		//alert("sectionName  " + sectionName);
	    if(objAjax && objHTMLData)
	    {
	    	bShowMsg = true;
	    	objAjax.setActionURL("submitevents.do");
	    	objAjax.setActionMethod(url);
	    	objAjax.setProcessHandler(_showWorkArea);
	    	
	    	objHTMLData.performSaveChanges(_showSubmitWorkArea, objAjax);
        	if(objAjax.isProcessComplete())
            {
                objHTMLData.resetChangeFields();
            }
	    }
	}
	
	//Function dltEvent
	function dltEvent()
	{
		var url = "delete";
	 	var htmlAreaObj = _getWorkAreaDefaultObj();
		var objAjax = htmlAreaObj.getHTMLAjax();
		var objHTMLData = htmlAreaObj.getHTMLDataObj();
		sectionName = objAjax.getDivSectionId();
		//alert("sectionName  " + sectionName);
	    if(objAjax && objHTMLData)
	    {
	    	bShowMsg = true;
	    	objAjax.setActionURL("submitevents.do");
	    	objAjax.setActionMethod(url);
	    	objAjax.setProcessHandler(_showWorkArea);
	    	objAjax.sendRequest();
	    	if(objAjax.isProcessComplete())
            {
                objHTMLData.resetChangeFields();
            }
	    }
	}
	
	//Function schedPlan
	function schedPlan()
	{
	    var url = "scheduled";
	 	var htmlAreaObj = _getWorkAreaDefaultObj();
		var objAjax = htmlAreaObj.getHTMLAjax();
		var objHTMLData = htmlAreaObj.getHTMLDataObj();
	
	    sectionName = objAjax.getDivSectionId();
		//alert("sectionName  " + sectionName);
	    if(objAjax && objHTMLData)
	    {
		    if(!isValidRecord(true))
			{
				return;
			}
		    bShowMsg = true;
	       	loadWorkArea("submitevents.do", url);
	        if(objAjax.isProcessComplete())
	        {
	            objHTMLData.resetChangeFields();
	        }
	    }
	}
	
	//Function revisePlan
	function revPlan()
	{
	    var url = "revised";
	 	var htmlAreaObj = _getWorkAreaDefaultObj();
		var objAjax = htmlAreaObj.getHTMLAjax();
		var objHTMLData = htmlAreaObj.getHTMLDataObj();
	
	    sectionName = objAjax.getDivSectionId();
		//alert("sectionName  " + sectionName);
	    if(objAjax && objHTMLData)
	    {
	    	if(!isValidRecord(true))
			{
				return;
			}
	    	bShowMsg = true;
	       	loadWorkArea("submitevents.do", url);
	        if(objAjax.isProcessComplete())
	        {
	            objHTMLData.resetChangeFields();
	        }
	    }
	}
	
	//Function actualPlan
	function actPlan()
	{
	    var url = "actual";
	 	var htmlAreaObj = _getWorkAreaDefaultObj();
		var objAjax = htmlAreaObj.getHTMLAjax();
		var objHTMLData = htmlAreaObj.getHTMLDataObj();
	
	   sectionName = objAjax.getDivSectionId();
		//alert("sectionName  " + sectionName);
	    if(objAjax && objHTMLData)
	    {
	    	if(!isValidRecord(true))
			{
				return;
			}
			bShowMsg = true;
	       	loadWorkArea("submitevents.do", url);
	        if(objAjax.isProcessComplete())
	        {
	            objHTMLData.resetChangeFields();
	        }
	    }
	}

	//TODO need to refactor
	//pageNaviByDropDown
	function pageNaviByDropDown()
	{
    	var current_page = getElemnt("current_page");
    	var nextRecordKey = current_page.value;
    	pageNavi(nextRecordKey);
	}
	//pageNavi
	function pageNavi(assocID)
	{
		var url = "pagnav";
		url += "&associd=" + assocID;
	 	var htmlAreaObj = _getWorkAreaDefaultObj();
		var objAjax = htmlAreaObj.getHTMLAjax();
		var objHTMLData = htmlAreaObj.getHTMLDataObj();
	
	    // Check for valid record to show the screen(tab).
	    if(!isValidSubmit(true))
		{
			return;
		}
	
		sectionName = objAjax.getDivSectionId();
		//alert("sectionName  " + sectionName);
	    if(objAjax && objHTMLData)
	    {
	    	//alert("inside calling");
	    	bShowMsg = true;
	       	loadWorkArea("submitevents.do", url);
	        if(objAjax.isProcessComplete())
	        {
	            objHTMLData.resetChangeFields();
	        }
	    }
	}
	
	//function newEvent()
	function newEvent()
	{
		var url = "new";
	 	var htmlAreaObj = _getWorkAreaDefaultObj();
		var objAjax = htmlAreaObj.getHTMLAjax();
		var objHTMLData = htmlAreaObj.getHTMLDataObj();
	
	   sectionName = objAjax.getDivSectionId();
		//alert("sectionName  " + sectionName);
	    if(objAjax && objHTMLData)
	    {
	    	if(!isValidRecord(true))
			{
				return;
			}
			bShowMsg = true;
	       	loadWorkArea("submitevents.do", url);
	        if(objAjax.isProcessComplete())
	        {
	            objHTMLData.resetChangeFields();
	        }
	    }
	}
