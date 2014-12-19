/*************************************/
/*  Copyright  (C)  2002 - 2009      */
/*           by                      */
/*  TradeStone Software, Inc.        */
/*  Gloucester, MA. 01930            */
/*  All Rights Reserved              */
/*  Printed in U.S.A.                */
/*  Confidential, Unpublished        */
/*  Property of                      */
/*  TradeStone Software, Inc.        */
/*************************************/
// Tracker#:14435 ISSUE WITH SAVE PROMPT,SYSTEM DISPLAYS'PREVIOUS ACTION ENCOUNTERED ERROR'
// This file is created submitted in Tracker#:14435, some of these methods are seperated from 
// colorlib.js, any javscript methods related to material lib document could go into this file.

function showMaterialView(view, pageNo, sec)
{
   Process.sendRequest(sec,"materiallib.do", "HANDLEVIEW&pageNum="+pageNo+"&view="+view, _showMaterialLibPage);
}

function showMaterialOverview(obj)
{
	Process.showOverview(obj, "materiallib.do", "TOOVERVIEW");
}

function sortMaterialColumn(fieldName,sec,type, pageNo)
{
    //alert("sortMaterialColumn called");
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
	   		messagingDiv(htmlErrors, "saveWorkArea()", "laodPLMSortColumn('materiallib.do','"+url+"',_showMaterialLibPage);");
	   		return;
        }
		else
		{
			laodPLMSortColumn('materiallib.do',url,_showMaterialLibPage);
		}
    }
}

//Function for createMaterial
function createMaterial()
{
   	Process.execute("creatematerial","materialoverview.do");	
}

//Function for createButton
function createButton()
{
 	Process.execute("createbutton","materialoverview.do"); 	
}

//Function for createPackaging
function createPackaging()
{
 	Process.execute("createpackaging","materialoverview.do");
}

//Function for createlabel
function createLabeling()
{
 	Process.execute("createlabel","materialoverview.do");
}
//Function for createHangTag
function createHangTag()
{
 	Process.execute("createhangtag","materialoverview.do");
}
//Function to create Knit Fabric
function createKnitFabric()
{
	Process.execute("createknitfabric","materialoverview.do");
}

//Function to create Material Trim
function createMaterialTrim()
{
	Process.execute("createtrim","materialoverview.do");
}
//Function to create Material Leather
function createLeather()
{
	Process.execute("createleather","materialoverview.do");
}

//Function to create Material Interlining
function createInterlining()
{
	Process.execute("createinterlining","materialoverview.do");
}

//Function to create Material Yarn
function createYarn()
{
	Process.execute("createyarn","materialoverview.do");
}

//Tracker 16284 NEW HARDLINES VIEW FOR MATERIAL LIBRARY
//Function to create Material Yarn
function createHardLines()
{
	Process.execute("createhardlines","materialoverview.do");
}

function createDenim()
{
	Process.execute("createdenim","materialoverview.do");
}

function showMaterialLib()
{
    url = "view";
    loadWorkArea("materialoverview.do", url);
}

function getMaterialLibHTMLAjax()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
	//alert("htmlAreaObj " + htmlAreaObj);
    var objAjax = htmlAreaObj.getHTMLAjax();

    if(!objAjax)objAjax = new htmlAjax();
    return objAjax;
}

function _showMaterialLibPage(objAjax)
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
    	//alert("reload");
        _reloadArea(objAjax, sectionName);
        bShowMsg= false;
    }
}

function showMaterialAttachments()
{
   	Process.execute("attachments","materialattachment.do");
}

function materiallistactiveInactive(status)
{
	var url ="activeinactive&status="+status;
	var docview;
	var htmlAreaObj = _getWorkAreaDefaultObj();
  	var objAjax = htmlAreaObj.getHTMLAjax();
   	var objHTMLData = htmlAreaObj.getHTMLDataObj();
   	sectionName = objAjax.getDivSectionId();
   	
	if(objAjax && objHTMLData)
	{
		bShowMsg = true;
		if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
   		{
	   		var htmlErrors = objAjax.error();
	   		objAjax.error().addError("warningInfo", szMsg_Sel_Material, false);
	   		messagingDiv(htmlErrors);
	   		return;
   		}
      		
      		objAjax.setActionURL("materiallib.do");       		
		objAjax.setActionMethod(url);
   		objAjax.setProcessHandler(_showColorLibPage);
		objHTMLData.performSaveChanges(_showColorLibPage, objAjax);
		
		if(objAjax.isProcessComplete())
        {
            objHTMLData.resetChangeFields();
        }
	}
}

function materialactiveInactive(status)
{
	var url ="activeinactive&status="+status;
	var docview;
	var htmlAreaObj = _getWorkAreaDefaultObj();
  	var objAjax = htmlAreaObj.getHTMLAjax();
   	var objHTMLData = htmlAreaObj.getHTMLDataObj();
   	sectionName = objAjax.getDivSectionId();
   	
	if(objAjax)
	{
		// Tracker#:12637 ISSUES ON BLANK RECORD OF MATERIAL LIBRARY	
		if(!isValidRecord(true))
		{
			return;
		}
		loadWorkArea("materialoverview.do", url);
	}
}


function deletemateriallist()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
   	var docview;
	var docviewid = htmlAreaObj.getDocViewId();
	
	if(objAjax)
   	{
   		if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
		{
			var htmlErrors = objAjax.error();
			objAjax.error().addError("warningInfo", szMsg_Sel_Material, false);
			messagingDiv(htmlErrors);
			return;
		}
		
		var htmlErrors = objAjax.error();
   		htmlErrors.addError("confirmInfo","Do you want to delete Material(s)?",  false);
   		messagingDiv(htmlErrors,'deleteMaterials()', 'materiallistcancel()');
   	}

}

function deleteMaterials()
{
	closeMsgBox();
	Process.saveChanges("materiallib.do", "deletematerial", _showDeleteSubmitWorkArea);
}

function deletematerial()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
   	var docview;
   	
   	if(objAjax)
   	{
   		// Check for valid record to execute process.
	   	if(!isValidRecord(true))
		{
			return;
		}
		
		var htmlErrors = objAjax.error();
		htmlErrors.addError("confirmInfo","Do you want to delete Material(s)?",  false);
		messagingDiv(htmlErrors,'deleteMaterialOverview()', 'materialoverviewcancel()');
   	}
}

function deleteMaterialOverview()
{
	var url = "deletematerial";
	var docview;
	closeMsgBox();
	
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objAjax.getDivSectionId();
	
	if(objAjax && objHTMLData)
	{
		//Tracker#: 14105 REFRESHING THE NAVIGATION GRID WHEN THE DATA IS DELETED
		//added the process handler method so that on deleting the material from the overview 
		//the navigation grid is refreshed
		loadWorkArea("materialoverview.do", url,"",refreshNavigationGridOnDelete);
	}
}

function refreshMateriallist()
{
	var url = "db_refresh";
	
	if(!isValidRecord(true))
	{
		return;
	}
	
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objAjax.getDivSectionId();
    
	if(objAjax && objHTMLData)
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

	objAjax.setActionMethod(url);
	objAjax.setProcessHandler(_showColorLibPage);
	objHTMLData.performSaveChanges(_showColorLibPage, objAjax);

	if(objAjax.isProcessComplete())
	{
		objHTMLData.resetChangeFields();
	}
}

function refreshMaterialOverview()
{
	var url = "db_refresh";
	
	if(!isValidRecord(true))
	{
		return;
	}
	
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objAjax.getDivSectionId();
    
    if(objAjax && objHTMLData)
	{
		 loadWorkArea("materialoverview.do", url);
	}
}

function materiallistcancel(){
	closeMsgBox();
	refreshMateriallist();
}

function materialoverviewcancel(){
	closeMsgBox();
	refreshMaterialOverview();
}

function showMaterialAttachment()
{
	if(!isValidMaterial(true))
	{
		return;
	}
	Process.execute("view", "materialattachment.do");
}
// Tracker#:14435 ISSUE WITH SAVE PROMPT,SYSTEM DISPLAYS'PREVIOUS ACTION ENCOUNTERED ERROR'
// For blank records on click of tabs, message should be given without going in to screen.
function isValidMaterial(displayMessage)
{
	return _checkIsValidRecord("_isValidMaterial", true, szMsg_Invalid_Material);
}

//Tracker #:16026 MATERIAL SOURCING PROCESS
function createMaterialQuote()
{
	
	if(!isValidRecord(true))
	{
		return;
	}
	
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objAjax.getDivSectionId();
    
	if(objAjax && objHTMLData)
	{
		// isDataModified checks if the data is alone modified or not
    	// Does not consider the Checked Boxes selection as changed fields
    	if(objHTMLData!=null && objHTMLData.isDataModified())
    	{
    		var htmlErrors = objAjax.error();
        	htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
        	// If user confirms to save then call saveWorkArea()
        	// else continue with submitting the Projection(s)
        	messagingDiv(htmlErrors, "saveWorkArea()", "continueCreateMatQuote()");
        	return;
      	}
      	else
      	{
      		continueCreateMatQuote();
      	}
	}

}

function continueCreateMatQuote()
{
	closeMsgBox();
	bShowMsg = true;
	var url = "creatematerialquote";
    loadWorkArea("materialoverview.do", url);
}

//Tracker #: 16443 MATERIAL SOURCING- NAVIGATION BETWEEN MATERIAL LIBRARY AND MATERIAL QUOTE
function _gotoMQuote()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    
    if(!isValidRecord(true))
	{
		return;
	}
	if(objAjax && objHTMLData)
	{
		// isDataModified checks if the data is alone modified or not
    	// Does not consider the Checked Boxes selection as changed fields
    	if(objHTMLData!=null && objHTMLData.isDataModified())
    	{
    		var htmlErrors = objAjax.error();
        	htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
        	// If user confirms to save then call saveWorkArea()
        	// else continue with the _showMatQuote()
        	messagingDiv(htmlErrors, "saveWorkArea()", "_showMatQuote()");
        	return;
      	}
      	_showMatQuote();
   	}
}

function _showMatQuote()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    if(objHTMLData!=null)
    {
 		objHTMLData.resetChangeFields();
 	}
	closeMsgBox();
	bShowMsg = true;
	var url = "gotoMQuote";
    loadWorkArea("materialoverview.do", url, null, _showMaterialQuote);
}
//Tracker #: 16443 MATERIAL SOURCING- NAVIGATION BETWEEN MATERIAL LIBRARY AND MATERIAL QUOTE
function _showMaterialQuote(objAjax)
{
    var htmlError = objAjax.error();
     // If An error has occured do not close the message popup.
     if(!htmlError.hasErrorOccured())
     {
        closeMsg();
     }
     _displayProcessMessage(objAjax);

     // Expand the Design Center as the Navigation Section
     // needs to display Material quote navigation link
     // rather than the material library link.
     // Only if there are no errors call restoreArea(1) which reloads all the
     // links related on MM Design Center otherwise do not change the
     // Navigation Menu on the Navigator and remain on the same.
     if(htmlError.getWarningMsg() == null || htmlError.getWarningMsg().length == 0
        && (htmlError.getErrorMsg() == null || htmlError.getErrorMsg().length == 0))
     {
         restoreArea(1);
     }

    _execAjaxScript(objAjax);
}

//Tracker #: 16102 323-F8 -MATERIAL PROJECTIONS: AFTER NAVIGATING TO MATERIAL LIBRARY YOU SHOULD BE ABLE TO NAV BACK
function _gotoProjection()
{

	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    
    if(!isValidRecord(true))
	{
		return;
	}
	if(objAjax && objHTMLData)
	{
		// isDataModified checks if the data is alone modified or not
    	// Does not consider the Checked Boxes selection as changed fields
    	if(objHTMLData!=null && objHTMLData.isDataModified())
    	{
    		var htmlErrors = objAjax.error();
        	htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
        	// If user confirms to save then call saveWorkArea()
        	// else continue with the _showMatQuote()
        	messagingDiv(htmlErrors, "saveWorkArea()", "_showProjections()");
        	return;
      	}
      	_showProjections();
   	}
   	
}

function _showProjections()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    if(objHTMLData!=null)
    {
 		objHTMLData.resetChangeFields();
 	}
	closeMsgBox();
	bShowMsg = true;
	var url = "gotoProjection";
    loadWorkArea("materialoverview.do", url, null, _showMaterialQuote);
}
/*--Tracker 17354- MATERIAL LIBRARY SEARCH FILTERS BASED ON MATERIAL TYPE*/
function _mat_lib_displayConstrFields(typeObj)
{
	var mattype=typeObj.value;
	//This attribute will be set from the _setElementsToSearchScreen function of advancedsearch.js.
	var srchFlds=typeObj.getAttribute("searchFlds")
	//After getting the value for searched fields then resetting to blank	
	if(srchFlds)
	{
		typeObj.setAttribute("searchFlds","");
	}
	if(!srchFlds)
	{
		srchFlds="";
	}	
    var objAjax = getMaterialLibHTMLAjax();
	
	var objHTMLData=_getAreaHTMLDataObjByDocView(3302);
	//Tracker 19916, only reset/remove changed fields in Dynamic Section when user change Material Type field
	var objDyn = document.getElementById("dynamic_section0");
	var ids = [];
	$(objDyn).find('input').each(function (i) {
		ids[i] = $(this)[0];
	});
	
	for (var i=0; i<ids.length; i++)
	{
	   objHTMLData.removeFromChangedFields(ids[i]);
	}  
	
    if(objAjax)
    {
    	//alert("showView : objAjax "  + objAjax.getDocViewId());
        objAjax.setActionURL("materiallib.do");
        objAjax.setActionMethod("SHOW_CONSTR_FIELDS&mattype="+mattype+"&srchFlds="+srchFlds);
        objAjax.setProcessHandler(_mat_lib_handleTypes);
        //alert("sending");
        objAjax.sendRequest();
    }	
}

//Post precess handle for shareClipboard
function _mat_lib_handleTypes(objAjax)
{
	if(objAjax)
    {
	   var secName=objAjax.getResponseHeader("dynSecName");
	   //alert(secName);
	   //var elem=getElemnt(dynaSec);
	   var elem=getElemnt(secName);
	   elem.innerHTML=objAjax.getHTMLResult();
	   _execAjaxScript(objAjax);
	   //var secName="construct_section";
	   //_reloadArea(objAjax, "construct_section");	   
	   _displayProcessMessage(objAjax);  
    }
}

//Tracker#17557 -BASE MATERIAL VS FINISHED MATERIAL: NEW PROCESS
//For process 'Create Finished Material'
//Since - 2011r1
function _createFinishedMtl()
{
	var url = "createFinishedMtl";
	if(!isValidRecord(true))
	{
		return;
	} 
	
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    var docview = htmlAreaObj.getDocViewId();
	
	if(objAjax && objHTMLData)
	{
		if(docview == "3301")
		{
			if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
           	{
               	var htmlErrors = objAjax.error();
               	objAjax.error().addError("warningInfo", szMsg_Sel_Material, false);
               	messagingDiv(htmlErrors);
               	return;
            }
            var chgFlds = objHTMLData.getChangeFields();
    		if(chgFlds && chgFlds.length>0)
      		{
      	  		count = 0;
          		for (num = 0; num < chgFlds.length; num++)
          		{
             		var obj = chgFlds[num];
             		if(obj!=null && obj.startsWith(_CHK_BOX_DEFAULT_ID))
			    	{
			     		count++;
			    	}
          		}
				if(count > 1)
          		{
          	 		var htmlErrors = objAjax.error();
           	 		objAjax.error().addError("warningInfo", "Please select only one Material row.", false);
          	 		messagingDiv(htmlErrors);
          	 		unCheck(objHTMLData);
          	 		objHTMLData.resetChangeFields();
            		return;
          		}
   	  		}
            url += "&keyinfo= " + getComponentKeyInfo();
		}
		loadWorkArea("materialoverview.do", url);
	}
}
//Tracker#1764
//To navigate to base material record for Base Material link MAterial overview screen.
function showBaseMaterial()
{
	if(!isValidRecord(true))
	{
		return;
	} 
   	var url = "showBaseMaterial";
	url += "&keyinfo= " + getComponentKeyInfo();
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	if(objAjax && objHTMLData)
    {
    	bShowMsg = true;
    	loadWorkArea("materialoverview.do", url);
    }
}

//Tracker#:22640 - NEED A WAY TO DELETE TREATMENTS FROM THE MATERIAL LIBRARY
var matLibJs = {
		deleteMatLibTreatments : function()
		{
			var htmlAreaObj = _getWorkAreaDefaultObj();
		   	var objAjax = htmlAreaObj.getHTMLAjax();
		    var objHTMLData = htmlAreaObj.getHTMLDataObj();
		    
		    // Check for valid record to execute process.
		    if(!isValidRecord(true))
		    {
		        return;
		    }
		    docview = objAjax.getDocViewId();
		    if(docview==3303 || docview==3311 || docview==3313 || docview==3320 || docview==3322)
	    	{
		    	var htmlErrors = objAjax.error();
		    	objAjax.error().addError("warningInfo", szMsg_Invalid_Rec, false);
      	 		messagingDiv(htmlErrors);
      	 		return;
	    	}
			//User edits the field data and without saving click on the 'Delete Treatment' button
			//Pop up the  message 'There are changes on the screen. Do you want to save changes before current action?'.
			if(objHTMLData!=null && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
		    {
		        var htmlErrors = objAjax.error();
		        htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
		        messagingDiv(htmlErrors, "saveWorkArea()", "matLibJs.continueDeleteTreatments()");
		    }
		    else
		    {
		    	matLibJs.continueDeleteTreatments();
		    }
		},

		continueDeleteTreatments: function()
		{
			var htmlAreaObj = _getWorkAreaDefaultObj();
		   	var objAjax = htmlAreaObj.getHTMLAjax();
		    var objHTMLData = htmlAreaObj.getHTMLDataObj();
			if(objAjax)
		   	{
		   		var htmlErrors = objAjax.error();
		   		if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
		        {
		            var htmlErrors = objAjax.error();
		            objAjax.error().addError("warningInfo", szMsg_Sel_Treatment_Row, false);
		            messagingDiv(htmlErrors);
		            return;
		        }
			    htmlErrors.addError("confirmInfo","Do you want to delete Treatment(s)?",  false);

		   		messagingDiv(htmlErrors,'matLibJs.deleteTreatmentRecords()','cancelProcess()');
		     }
		},
		deleteTreatmentRecords: function()
		{
			var url = "deletetreatments";
			var docview;
			closeMsgBox();

			var htmlAreaObj = _getWorkAreaDefaultObj();
		   	var objAjax = htmlAreaObj.getHTMLAjax();
		    var objHTMLData = htmlAreaObj.getHTMLDataObj();
		    sectionName = objAjax.getDivSectionId();
		    //alert("sectionName  " + sectionName);
		    if(objAjax && objHTMLData)
		    {
		        bShowMsg = true;
		        objAjax.setActionURL("materialoverview.do");
		        objAjax.setActionMethod(url);
		        objAjax.setProcessHandler(_showSubmitWorkArea);
		        objHTMLData.performSaveChanges(_showSubmitWorkArea, objAjax);
		        return;
		    }
		},
		
        //Tracker#:26472 FDD587: FR01 ADD A COPY MATERIAL PROCESS TO MORE ACTIONS IN MATERIAL LIBRARY OVERVIEW
		_copymaterial: function()
		{			
			var htmlAreaObj = _getWorkAreaDefaultObj();
		   	var objAjax = htmlAreaObj.getHTMLAjax();
		    var objHTMLData = htmlAreaObj.getHTMLDataObj();
		    
		    if(objAjax)
		   	{
		    	
		   		if(!isValidRecord(true))
				{
					return;
				}
		   	}
			
			if(objHTMLData!=null && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
		    {				
		    	var htmlErrors = objAjax.error();
		        htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
		        messagingDiv(htmlErrors, "objHtmlData.performSaveChanges(refreshFields)", "matLibJs._copymaterialprocess()");
		        return;
		    }
		    else
		    {		    	
		    	matLibJs._copymaterialprocess();
		    }	
		},
		//Tracker#:26472 FDD587: FR01 ADD A COPY MATERIAL PROCESS TO MORE ACTIONS IN MATERIAL LIBRARY OVERVIEW
		_copymaterialprocess: function()
		{            
			var url ="copymaterial";
			var htmlAreaObj = _getWorkAreaDefaultObj();
		  	var objAjax = htmlAreaObj.getHTMLAjax();
		   	var objHTMLData = htmlAreaObj.getHTMLDataObj();		   	
		   	
			if(objAjax && objHTMLData)
			{	
				objHTMLData.resetChangeFields();
				bShowMsg = true;	
				objAjax.setActionMethod(url);
				loadWorkArea("materialoverview.do", url);
				if(objAjax.isProcessComplete())
				{
					objHTMLData.resetChangeFields();
				}
			}
		}
}

