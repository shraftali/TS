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

// ------------------------------------------------------------------
// Tracker#: 17163  MATERIAL PROJECTIONS HAS A SEARCH /LEFT NAVIGATION ISSUE
// Separated the methods called from LS Navigation link and Advanced Search
// list link
// This function forwards the user to Projections Overview Screen.
// Called from LS navigation link.
function showProjectionsOverview(obj)
{
    navigateToProjections(obj, "");
}

// This function forwards the user to Projections Overview Screen.
// Called from LS Navigation link.
function showProjectionsFromNavigation(obj)
{
    // Just a indicator to say the navigation to overview screen is happening
    // via the link on the left side Navigation.
    var src = "&nav=1";
    navigateToProjections(obj, src);
}

// src - indicator to indicate from where the navigation is happening to
//       overview screen.
function navigateToProjections(obj, src)
{
	Process.showOverview(obj, "projectionsoverview.do", "view",src);
}
// ------------------------------------------------------------------

function sortProjectionsColumn(fieldName,sec,type, pageNo)
{
    sortColumnForSection(fieldName,sec,type, pageNo, "projections.do")
}

// Tracker#: 16386 JAVA SCRIPT ERROR ON TRYING TO SORT ON PROJECTION OVERVIEW SCREEN
// ------------------------------------------------------------------
// This is an candidate for Generic method.
// Move out after discussion with PLM team
// This could be the final generic function
// called by all PLM screens Sort js methods.
function sortColumnForSection(fieldName,sec,type, pageNo, url)
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    sectionName = sec;
    if(objAjax)
    {
        objAjax.setActionURL(url);
        objAjax.setActionMethod("SORT&sortColumn="+fieldName+"&sort="+type+"&pageNum="+pageNo);
        objAjax.setProcessHandler(refreshPageAfterSort);
        objAjax.sendRequest();
    }
}

function refreshPageAfterSort(objAjax)
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

        // Refresh only the div identified by the sectionName
        // This needs to be set by the caller.
        _reloadArea(objAjax, sectionName);
        bShowMsg= false;
    }
}
// ------------------------------------------------------------------

// Tracker#: 16386 JAVA SCRIPT ERROR ON TRYING TO SORT ON PROJECTION OVERVIEW SCREEN
function sortProjectionsOverviewColumn(fieldName,sec,type, pageNo)
{
    sec =   _getWorkAreaObj().getDivSaveContainerName();
    sortProjectionsOverView(fieldName,sec,type, pageNo, "projectionsoverview.do");
}

// reloading the WorkArea
function sortProjectionsOverView(fieldName,sec,type, pageNo, url)
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    if(objAjax && objHTMLData)
    {
        var method = "SORT&sortColumn="+fieldName+"&sort="+type+"&pageNum="+pageNo;
        bShowMsg = true;
        // Faced issues when streching the Detail to the max screen width
        // as this was not happening also the slider left table and right
        // table was not perfectly getting aligned.
        sectionName = objAjax.getDivSectionId();
		//Tracker#: 16691 MATERIAL PROJECTIONS - ENTER DATA, CLICK SORT, ROWS SORTED DATA IS LOST
    	// Changes have been done, prompt the User
		// to decide whether the User will Save or
		// continue with the sorting.
		if(objHTMLData!=null && objHTMLData.isDataModified())
        {
            var htmlErrors = objAjax.error();
            htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
	   		messagingDiv(htmlErrors, "saveWorkArea()", "laodPLMSortColumn('projectionsoverview.do','"+method+"',refreshPageAfterSort);");
	   		return;
        }
		else
		{
			laodPLMSortColumn('projectionsoverview.do',method,refreshPageAfterSort);
		}
    }
}

function createProjections()
{
    var url = "createprojections";
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	sectionName = objAjax.getDivSectionId();
    if(objAjax && objHTMLData)
    {
    	bShowMsg = true;
       	loadWorkArea("projectionsoverview.do", url);
       	if(objAjax.isProcessComplete())
        {
            objHTMLData.resetChangeFields();
        }
    }
}

function deleteProjections()
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
			
		if(objHTMLData!=null && objHTMLData.isDataModified()==true)
      	{
	   		var htmlErrors = objAjax.error();
	   		htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
	   		messagingDiv(htmlErrors, "saveWorkArea()", "continueDeleteProjections(1)");
	   		return;
      	}
      	else
      	{
   			continueDeleteProjections();
      	}
	}
}

function continueDeleteProjections(reset)
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
   	if(1==reset)
   	{
   		var objHTMLData = htmlAreaObj.getHTMLDataObj();
   		objHTMLData.resetChangeFields();
   	}
	var htmlErrors = objAjax.error();
	htmlErrors.addError("confirmInfo", szMsg_Mat_Proj_Delete_Confirm,  false);
	messagingDiv(htmlErrors,'completeDeleteProjection()', 'cancelDelete()');
}

function completeDeleteProjection()
{
	var docview;
	closeMsgBox();
	
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objAjax.getDivSectionId();
	if(objAjax && objHTMLData)
	{	
		//Tracker #: 18326 NOT ABLE TO UPDATE ON NAVIGATING FROM SUMMARY SCREEN TO PROJECTION OVERVIEW SCREEN
		//After deletion of projection if the user navigated from summary screen and the navigateIndicator is set
		//then call the process handler _showWorkArea.  
		var navigateIndicator = getElemnt("navigateIndicator");
        //alert("navigateIndicator:" + navigateIndicator);
		if(navigateIndicator && navigateIndicator.value == "summary")
		{
            objAjax.setProcessHandler(_showWorkArea);
		}
		else
		{
        	objAjax.setProcessHandler(refreshNavigationGridOnDelete);
        }
        objAjax.setActionURL("projectionsoverview.do?method=deleteprojections");
        if(objHTMLData.checkForChanges())
        {
        	objHTMLData.performSaveChanges(_showSubmitWorkArea, objAjax);
       	}
       	else
       	{
       		objAjax.sendRequest();
       	}
	}
}

function cancelDelete(){
	closeMsgBox();	
}

// Tracker#: 18045 INCONSISTENT HANDLING OF REFRESH ON MATERIAL PROJECTIONS SCREEN
//If the user has modified fields on Projections and chooses to Refresh user is prompted to either 
//Save or continue with Refresh. This is similar to all other PLM screens
function refreshProjections()
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
        objAjax.setActionURL("projectionsoverview.do");
        if(objHTMLData && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
        {	
        	//saves the changefields only if the user has choosen to save the changes
        	if (confirm(szMsg_Changes))
            {
                objAjax.setProcessHandler(_showSubmitWorkArea);
                objAjax.setActionMethod("save");
                objHTMLData.performSaveChanges(_showSubmitWorkArea, objAjax);
                return;
            }
        }
 	  }
 
	 objAjax.setActionMethod(url);
	 objAjax.setProcessHandler(_showColorLibPage);
	 objAjax.sendRequest();
}
    


function submitProjections()
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();

    if(!isValidRecord(true))
    {
        return;
    }

    if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
    {
        var htmlErrors = objAjax.error();
        objAjax.error().addError("warningInfo", "Please select projection(s).", false);
        messagingDiv(htmlErrors);
        return;
    }

    // isDataModified checks if the data is alone modified or not
    // Does not consider the Checked Boxes selection as changed fields
    if(objHTMLData!=null && objHTMLData.isDataModified())
    {
        var htmlErrors = objAjax.error();
        htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
        // If user confirms to save then call saveWorkArea()
        // else continue with submitting the Projection(s)
        messagingDiv(htmlErrors, "saveWorkArea()", "continueSubmit(1)");
        return;
    }
    else
    {
        continueSubmit();
    }
}

// Reset the changefields only if the user has choosen to ignore
// the changes
function continueSubmit(reset)
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
   	var objHTMLData = htmlAreaObj.getHTMLDataObj();
    closeMsgBox();
    if(objAjax && objHTMLData)
    {
        // If the user has confirmed to ignore the changed
        // fields then reset the same.
        if(1==reset)
        {
            objHTMLData.resetChangeFields();
        }

        objAjax.setProcessHandler(_showSubmitWorkArea);
        objAjax.setActionURL("projectionsoverview.do?method=submit");

        // If the user has selected the checkboxes then these
        // should be available as Parameters in the request.
        if(objHTMLData.checkForChanges())
        {
            objHTMLData.performSaveChanges(_showSubmitWorkArea, objAjax);
        }
        else
        {
            // Will be submitting all the Projection(s) in that group.
            objAjax.sendRequest();
        }
    }
}

function approveProjections()
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();

    if(!isValidRecord(true))
    {
        return;
    }

    if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
    {
        var htmlErrors = objAjax.error();
        objAjax.error().addError("warningInfo", "Please select projection(s).", false);
        messagingDiv(htmlErrors);
        return;
    }

    // isDataModified checks if the data is alone modified or not
    // Does not consider the Checked Boxes selection as changed fields
    if(objHTMLData != null && objHTMLData.isDataModified())
    {
        var htmlErrors = objAjax.error();
        htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
        // If user confirms to save then call saveWorkArea()
        // else conitnue with approve the Projection(s)
        messagingDiv(htmlErrors, "saveWorkArea()", "continueApprove(1)");
        return;
    }
    else
    {
        continueApprove();
    }
 }

function continueApprove(reset)
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
   	var objHTMLData = htmlAreaObj.getHTMLDataObj();

    closeMsgBox();
    if(objAjax && objHTMLData)
    {
        // If the user has confirmed to ignore the changed
        // fields then reset the same.
        if(1==reset)
        {
            objHTMLData.resetChangeFields();
        }

        objAjax.setProcessHandler(_showSubmitWorkArea);
        objAjax.setActionURL("projectionsoverview.do?method=approve");

        // If the user has selected the checkboxes then these
        // should be available as Parameters in the request.
        if(objHTMLData.checkForChanges())
        {
            objHTMLData.performSaveChanges(_showSubmitWorkArea, objAjax);
        }
        else
        {
            objAjax.sendRequest();
        }
    }
}

/* Tracker#: 18039  NEW PROCESS TO ADD MQ LINK FROM PROJECTIONS 

This method will check projections are selected or not if it selected it will
call continuelinkProjectionToMQ()
 */
function linkProjectionToMQ()
{
	
    var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();

    if(!isValidRecord(true))
    {
        return;
    }

    if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
    {
        var htmlErrors = objAjax.error();
        objAjax.error().addError("warningInfo", "Please select projection(s).", false);
        messagingDiv(htmlErrors);
        return;
    }

       
    if(objHTMLData != null && objHTMLData.isDataModified())
    {
        var htmlErrors = objAjax.error();
        htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
        // If user confirms to save then call saveWorkArea()
        // else conitnue with approve the Projection(s)
        messagingDiv(htmlErrors, "saveWorkArea()", "continuelinkProjectionToMQ(1)");
        return;
    }
    else
    {
        continuelinkProjectionToMQ();
    }
 }
/*Tracker#: 18039  NEW PROCESS TO ADD MQ LINK FROM PROJECTIONS
This method will check  selected projections are  having all matching criteria specified in app config property  or not
*/ 
function continuelinkProjectionToMQ(reset)
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
   	var objHTMLData = htmlAreaObj.getHTMLDataObj();

    closeMsgBox();
    if(objAjax && objHTMLData)
    {
        // If the user has confirmed to ignore the changed
        // fields then reset the same.
        if(1==reset)
        {
            objHTMLData.resetChangeFields();
        }

        objAjax.setProcessHandler(_showProjectionToMQWorkArea);
        objAjax.setActionURL("projectionsoverview.do?method=linkProjToMQ");

        // If the user has selected the checkboxes then these
        // should be available as Parameters in the request.
        if(objHTMLData.checkForChanges())
        {
            objHTMLData.performSaveChanges(_showProjectionToMQWorkArea, objAjax);
        }
        else
        {
            objAjax.sendRequest();
        }
    }
}
/*Tracker#: 18039  NEW PROCESS TO ADD MQ LINK FROM PROJECTIONS 
this method will open a  pop up window to display MQ Details 
*/
function _showProjectionToMQWorkArea(objAjax)
{
    try
    {
    	var htmlAreaObj = _getWorkAreaDefaultObj();
  		var objHTMLData = htmlAreaObj.getHTMLDataObj();
        if(objAjax)
        {
           if(objAjax.error().getErrorMsg()!=null)
           {
          	 _displayProcessMessage(objAjax)
           }
           if(objAjax.error().getErrorMsg()==null)
           { 
						
			var changeFieldRowno=_getRepeateCountFromCompName(objHTMLData._mChangedFields[0]);
			var searchControl = new VALIDATION.SearchControl(null, false, null,
                  'validationsearch.do?valId='+document.getElementById("validationId").value+'&codeFldName=null&showDesc=Y&sectionId=0&rowNo=' + changeFieldRowno + '&actRowNo=' +changeFieldRowno +'&resolveFromRowSet=Y');
    			searchControl.setOnBeforeSinglePost(_proj_copyRequestNoToMqRequestNo);
   				 searchControl.showPopup();
   		   }
           
        }
    }
    catch(e)
    {
        //alert(e.description);
    }
}
/*Tracker#: 18039  NEW PROCESS TO ADD MQ LINK FROM PROJECTIONS 
This method will assign the selected MQ REQUEST_NO  to corresponding projection MQ_REQUEST_NO
*/
function _proj_copyRequestNoToMqRequestNo(rowValues)
{
   	var RequestNo = "";
    
    var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
   	var objHTMLData = htmlAreaObj.getHTMLDataObj();
    if(rowValues != null && rowValues.length > 0)
    {
        RequestNo = rowValues[0];
             
    }
    
    if(RequestNo == null || RequestNo.length == 0 )
    {
		var htmlErrors = new htmlAjax().error();
	    htmlErrors.addError("warningInfo", "Please select a valid Request No.",  true);
	    messagingDiv(htmlErrors);
        return;
    }
	var changeField="";
	var  firstParent="";
	var  secondParent="";
	var children="";
	var txtid="";
	var lowerlevelchildren1 ="";
  /*To find  a text box object ID 
  Here we are looping through the html elements to identify another field id of a text box  and with it find the actual Request No field.
  
    */
	   var requestnoId=""
	  
	   	{
			   	for (var k=0;k< objHTMLData._mChangedFields.length;k++)
			   	{
				    		      
					      changeField =objHTMLData._mChangedFields[k]
					      firstParent=document.getElementById(changeField).parentNode;
					      secondParent=firstParent.parentNode
					      children = secondParent.childNodes;
					  txtid=findTexID(objHTMLData._mChangedFields[k]);
		requestnoId=_getNewCompNameByFieldId(txtid,document.getElementById("mRequestNo").value);
	 	document.getElementById(requestnoId).value= RequestNo
		/* To enable notifyChangeFields for saving the populate data */
		_notifyChangeFields(document.getElementById(requestnoId),-1);
	
 
			     }
		}
		
		
	
 
	//var url ='changetolmodel&toRquestNo='+RequestNo;
	//loadWorkArea("plmpomworksheet.do", url);
}

/*Tracker#: 18039  NEW PROCESS TO ADD MQ LINK FROM PROJECTIONS 
This method will Find ID of a text box 
Here we are looping through the html elements to identify another field id of a text box  and with it find the actual Request No field.
*/

function findTexID(objHTMLData1)
{

var changeField="";
	var  firstParent="";
	var  secondParent="";
	var children="";
	var txtid="";
	var lowerlevelchildren1 ="";
  /*To find  a text box object ID   */
   
   	{
      changeField =objHTMLData1;
      firstParent=document.getElementById(changeField).parentNode;
      secondParent=firstParent.parentNode
      children = secondParent.childNodes;
      txtid="";
		if( txtid=="")
		{
			for (var i=0; i < children.length; i++) 
			{
				if( txtid=="")
				{
					 lowerlevelchildren1 = children[i].childNodes;	
					 for (var j=0; j < lowerlevelchildren1.length; j++)
					 {
						if( txtid=="")
						{
							if(lowerlevelchildren1[j].type=="text")
							{
								/* Finding  Text box  with code as a value   */
								if(lowerlevelchildren1[j].getAttribute("ID").toString().indexOf("@desc")==-1)
								{
								/* Assigning object id of a text box to a variable    */	
									txtid=lowerlevelchildren1[j].getAttribute("ID");
									
								}
						}	}
					}
				}
			}
		}
}
return txtid;
}


/* Tracker#18020: CREATE MATERIAL PROJECTION OVERVIEW MORE ACTIONS PROCESS > REMOVE MQ LINK
  This will remove the previously posted MQ_REQUEST_NO from the MATERIAL_PROJ_H.PROJ_NO records
 that are first selected (via checkbox) by the user.  
 */
function removeMQlink()
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();

    if(!isValidRecord(true))
    {
        return;
    }

    if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
    {
        var htmlErrors = objAjax.error();
        objAjax.error().addError("warningInfo", "Please select projection(s).", false);
        messagingDiv(htmlErrors);
        return;
    }

    // isDataModified checks if the data is alone modified or not
    // Does not consider the Checked Boxes selection as changed fields
    if(objHTMLData != null && objHTMLData.isDataModified())
    {
        var htmlErrors = objAjax.error();
        htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
        // If user confirms to save then call saveWorkArea()
        // else conitnue with approve the Projection(s)
        messagingDiv(htmlErrors, "saveWorkArea()", "continueremoveMQlink(1)");
        return;
    }
    else
    {
        continueremoveMQlink();
    }
 }
/* Tracker#18020: CREATE MATERIAL PROJECTION OVERVIEW MORE ACTIONS PROCESS > REMOVE MQ LINK */
function continueremoveMQlink(reset)
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
   	var objHTMLData = htmlAreaObj.getHTMLDataObj();

    closeMsgBox();
    if(objAjax && objHTMLData)
    {
        // If the user has confirmed to ignore the changed
        // fields then reset the same.
        if(1==reset)
        {
            objHTMLData.resetChangeFields();
        }

        objAjax.setProcessHandler(_showSubmitWorkArea);
        objAjax.setActionURL("projectionsoverview.do?method=removeMQ");

        // If the user has selected the checkboxes then these
        // should be available as Parameters in the request.
        if(objHTMLData.checkForChanges())
        {
            objHTMLData.performSaveChanges(_showSubmitWorkArea, objAjax);
        }
        else
        {
            objAjax.sendRequest();
        }
    }
}




/* function recalculateGoodsFields(changedFld)
{
    var fieldName = changedFld.getAttribute("NAME");

    //alert("loadToolArea : general ");
    var objAjax = new htmlAjax();
    if(objAjax)
    {
        var url = "projectionsoverview.do";
        var actionMethod = "calgoodsfields&changedfield=" + fieldName + "&changedfieldvalue=" + changedFld.value;
        objAjax.setActionURL(url);
        objAjax.setActionMethod(actionMethod);
        objAjax.setProcessHandler(resetGoodsFields);
        objAjax.sendRequest();
    }
}

function resetGoodsFields(objAjax)
{
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

    	alert("U r thro");
    	bShowMsg= false;
    }
}*/

function calculateProj_qty(changedField)
{
    var fieldName = changedField.getAttribute("NAME");

    //alert("loadToolArea : general ");
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    if(objAjax)
    {
        var url = "projectionsoverview.do";
        var actionMethod = "CALPROJQTY&changedfield=" + fieldName + "&changedfieldvalue=" + changedField.value;
        objAjax.setActionURL(url);
        objAjax.setActionMethod(actionMethod);
        objAjax.setProcessHandler(resetProj_qty);
        objAjax.parameter().add("chgflds", objHTMLData.getChangeFields());
        objHTMLData._appendAllContainerDataToRequest(objAjax);
        objAjax.sendRequest();
    }
}

function resetProj_qty(objAjax)
{
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
		//Tracker #: 18842 ADD TRIGGER ON FIELD MATERIAL_PROJ_H.INITIAL_QTY TO RECALC MATERIAL_PROJ_H.OPEN_QTY
		//Added the condition to check whether the Hard Stop Message is enabled when open_qty becomes negative.
		//Update the fields if Hard Stop Message is not enabled.
		if(!checkHardStopMsg(objAjax))
		{
	        var projQty = objAjax.getResponseHeader("proqtyfield");
	
	    	if(projQty != "")
	    	{
	            var oc = document.getElementsByName(projQty);
	            if(oc) oc = oc[0];
	            oc.value = objAjax.getResponseHeader("proqty");
	
	            //oc.onchange();
	            oc.value = replaceval(oc, CommaDelimiter, Blank);
	            _notifyChangeFields(oc,3);
	        }
	        // Tracker#: 18036  F9 - ADD INITIAL QUANTITY RELATED FIELDS TO MATERIAL_PROJ_H
	        // If the projected qty changes then the Initial Qty also will be impacted
	        // so recalculate the Initial Qty
	        updateInitialQty(objAjax);
        }
    	bShowMsg= false;
    }
}

function recalculateTYTotUnit(changedField)
{
    var fieldName = changedField.getAttribute("NAME");
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    if(objAjax)
    {
        var url = "projectionsoverview.do";
        var actionMethod = "CALTYTOTUNIT&changedfield=" + fieldName + "&changedfieldvalue=" + changedField.value;
        objAjax.setActionURL(url);
        objAjax.setActionMethod(actionMethod);
        objAjax.setProcessHandler(resetTyTot_unit);
        objAjax.parameter().add("chgflds", objHTMLData.getChangeFields());
        objHTMLData._appendAllContainerDataToRequest(objAjax);
        objAjax.sendRequest();
    }
}

function resetTyTot_unit(objAjax)
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
    	
		//Tracker #: 18842 ADD TRIGGER ON FIELD MATERIAL_PROJ_H.INITIAL_QTY TO RECALC MATERIAL_PROJ_H.OPEN_QTY
		//Added the condition to check whether the Hard Stop Message is enabled when open_qty becomes negative.
		//Update the fields if Hard Stop Message is not enabled.
		if(!checkHardStopMsg(objAjax))
		{
	    	var tyTotUnit = objAjax.getResponseHeader("tytotunitfield");
	        if(tyTotUnit != "")
	    	{
	            var oc = document.getElementsByName(tyTotUnit);
	            if(oc) oc = oc[0];
	            oc.value = objAjax.getResponseHeader("tytotunitqty");
	            oc.value = replaceval(oc, CommaDelimiter, Blank);
	            _notifyChangeFields(oc,3);
	        }
	
	        var projQty = objAjax.getResponseHeader("proqtyfield");
	
	    	if(projQty != "")
	    	{
	            var oc = document.getElementsByName(projQty);
	            if(oc) oc = oc[0];
	            oc.value = objAjax.getResponseHeader("proqty");
	
	            //oc.onchange();
	            oc.value = replaceval(oc, CommaDelimiter, Blank);
	            _notifyChangeFields(oc,3);
	        }
	        // Tracker#: 18036  F9 - ADD INITIAL QUANTITY RELATED FIELDS TO MATERIAL_PROJ_H
	        // If the projected qty changes then the Initial Qty also will be impacted
	        // so recalculate the Initial Qty
	        updateInitialQty(objAjax);
		}
    	bShowMsg= false;
    }
}

function recalculateTyPCTChange(changedField)
{
    var fieldName = changedField.getAttribute("NAME");
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    if(objAjax)
    {
        var url = "projectionsoverview.do";
        var actionMethod = "TYPCTCHANGE&changedfield=" + fieldName + "&changedfieldvalue=" + changedField.value;
        objAjax.setActionURL(url);
        objAjax.setActionMethod(actionMethod);
        objAjax.setProcessHandler(resetTy_Pct_Change);
        objAjax.parameter().add("chgflds", objHTMLData.getChangeFields());
        objHTMLData._appendAllContainerDataToRequest(objAjax);
        objAjax.sendRequest();
    }
}

function resetTy_Pct_Change(objAjax)
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
		
		//Tracker #: 18842 ADD TRIGGER ON FIELD MATERIAL_PROJ_H.INITIAL_QTY TO RECALC MATERIAL_PROJ_H.OPEN_QTY
		//Added the condition to check whether the Hard Stop Message is enabled when open_qty becomes negative.
		//Update the fields if Hard Stop Message is not enabled.
		if(!checkHardStopMsg(objAjax))
		{
	    	var tyPctChange = objAjax.getResponseHeader("typctchangefield");
	        if(tyPctChange != "")
	    	{
	            var oc = document.getElementsByName(tyPctChange);
	            if(oc) oc = oc[0];
	            oc.value = objAjax.getResponseHeader("typctchange");
	            //oc.onchange();
	            oc.value = replaceval(oc, CommaDelimiter, Blank);
	            _notifyChangeFields(oc,3);
	        }
	
	        var projQty = objAjax.getResponseHeader("proqtyfield");
	
	    	if(projQty != "")
	    	{
	            var oc = document.getElementsByName(projQty);
	            if(oc) oc = oc[0];
	            oc.value = objAjax.getResponseHeader("proqty");
	            //oc.onchange();
	            oc.value = replaceval(oc, CommaDelimiter, Blank);
	            _notifyChangeFields(oc,3);
	        }
	        // Tracker#: 18036  F9 - ADD INITIAL QUANTITY RELATED FIELDS TO MATERIAL_PROJ_H
	        // If the projected qty changes then the Initial Qty also will be impacted
	        // so recalculate the Initial Qty
	        updateInitialQty(objAjax);
	    }

    	bShowMsg= false;
    }
}

function _gotoMaterialOverview()
{
    var url ="projectionsnav&_nColLibRow=" + _nColLibRow ;
    url += "&keyinfo= " +getComponentKeyInfo();
    // alert("url " + url + "\n_nColLibRow:"+ _nColLibRow);
    loadWorkArea("materialoverview.do", url);
}

function calculateInitial_qty(changedField)
{
    var fieldName = changedField.getAttribute("NAME");
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    if(objAjax)
    {
        var url = "projectionsoverview.do";
        var actionMethod = "CALINITQTY&changedfield=" + fieldName + "&changedfieldvalue=" + changedField.value;
        objAjax.setActionURL(url);
        objAjax.setActionMethod(actionMethod);
        objAjax.setProcessHandler(resetInitial_qty);
        objAjax.parameter().add("chgflds", objHTMLData.getChangeFields());
        objHTMLData._appendAllContainerDataToRequest(objAjax);
        objAjax.sendRequest();
    }
}

function resetInitial_qty(objAjax)
{
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

		//Tracker #: 18842 ADD TRIGGER ON FIELD MATERIAL_PROJ_H.INITIAL_QTY TO RECALC MATERIAL_PROJ_H.OPEN_QTY
		//Added the condition to check whether the Hard Stop Message is enabled when open_qty becomes negative.
		//Update the fields if Hard Stop Message is not enabled.
        if(!checkHardStopMsg(objAjax))
		{
			// Tracker#: 18036  F9 - ADD INITIAL QUANTITY RELATED FIELDS TO MATERIAL_PROJ_H
        	// If the projected qty changes then the Initial Qty also will be impacted
        	// so recalculate the Initial Qty
        	updateInitialQty(objAjax);
        }
    	bShowMsg= false;
    }
}

function updateInitialQty(objAjax)
{
	
    // Tracker#: 18036  F9 - ADD INITIAL QUANTITY RELATED FIELDS TO MATERIAL_PROJ_H
    // Identify the initial qty field name and set the modified qty for the same
    var initialQtyfield = objAjax.getResponseHeader("initialqtyfield");

    if(initialQtyfield != "")
    {
        var oc = document.getElementsByName(initialQtyfield);
        if(oc) oc = oc[0];
        oc.value = objAjax.getResponseHeader("initialqty");

        //oc.onchange();
        oc.value = replaceval(oc, CommaDelimiter, Blank);
        _notifyChangeFields(oc,3);
        
        updateOpenQty(objAjax);
    }
}

function _gotoProjSummary()
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
        	messagingDiv(htmlErrors, "saveWorkArea()", "_showProjSummary()");
        	return;
      	}
      	_showProjSummary();
   	}
}

function _showProjSummary()
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
	var url = "navigatetoprojsummary";
    loadWorkArea("projectionsoverview.do", url, null, _showProjectionSummary);
}


function _showProjectionSummary(objAjax)
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

//Tracker #: 18842 ADD TRIGGER ON FIELD MATERIAL_PROJ_H.INITIAL_QTY TO RECALC MATERIAL_PROJ_H.OPEN_QTY
//This function calculates the open_qty when the initial_qty changed.
function calculateOpen_qty(changedField)
{
    var fieldName = changedField.getAttribute("NAME");
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    if(objAjax)
    {
        var url = "projectionsoverview.do";
        var actionMethod = "CALOPENQTY&changedfield=" + fieldName + "&changedfieldvalue=" + changedField.value;
        objAjax.setActionURL(url);
        objAjax.setActionMethod(actionMethod);
        objAjax.setProcessHandler(resetOpenQty_unit);
        objAjax.parameter().add("chgflds", objHTMLData.getChangeFields());
        objHTMLData._appendAllContainerDataToRequest(objAjax);
        objAjax.sendRequest();
    }
}

function resetOpenQty_unit(objAjax)
{
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
		//Tracker #: 18842 ADD TRIGGER ON FIELD MATERIAL_PROJ_H.INITIAL_QTY TO RECALC MATERIAL_PROJ_H.OPEN_QTY
		//Added the condition to check whether the Hard Stop Message is enabled when open_qty becomes negative.
		//Update the fields if Hard Stop Message is not enabled.
		if(!checkHardStopMsg(objAjax))
		{
       		updateOpenQty(objAjax);
       	}	
    	bShowMsg= false;
    }
}

function updateOpenQty(objAjax)
{
	var openQty = objAjax.getResponseHeader("openqtyfield");

    	if(openQty != "")
    	{
            var oc = document.getElementsByName(openQty);
            if(oc) oc = oc[0];
            oc.value = objAjax.getResponseHeader("openqty");

            //oc.onchange();
            oc.value = replaceval(oc, CommaDelimiter, Blank);
            _notifyChangeFields(oc,3);
        }
}

//This function checks whether the Hard Stop Message present or not.
function checkHardStopMsg(objAjax)
{
	var hrdstopmsg = objAjax.getResponseHeader("hardstopmsg");
	var changeFld = objAjax.getResponseHeader("changedfield");
	//Tracker#: 23729
	//add the null check condition to the hrdstopmsg.
	if(hrdstopmsg != "" && hrdstopmsg != null)
	{
		document.getElementById(changeFld).focus();
		var htmlErrors = objAjax.error();
        objAjax.error().addError("errorInfo", hrdstopmsg, true);
        messagingDiv(htmlErrors);
		document.getElementById(changeFld).select();
        return true;
	}
	return false;
}
