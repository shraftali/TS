/** ********************************** */
/* Copyright (C) 2002 - 2012 */
/* by */
/* TradeStone Software, Inc. */
/* Gloucester, MA. 01930 */
/* All Rights Reserved */
/* Printed in U.S.A. */
/* Confidential, Unpublished */
/* Property of */
/* TradeStone Software, Inc. */
/** ********************************** */

//Tracker#: 21350 ADD PARTY RELATION TIERED TAB TO PARTY SCREEN UNDER VENDOR MANAGEMENT.

var szMsg_PCH_Delete_Confirm = 'Do you want to delete Product Category Hierarchy?';
var szMsg_PCHDetails_Delete_Confirm = 'Do you want to delete Product Category Hierarchy detail(s)?';



function showPCH()
{
	var url = "view";
 	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	sectionName = objAjax.getDivSectionId();
    if(objAjax && objHTMLData)
    {
    	bShowMsg = true;
        // Tracker#: 21851
        // Avoid calling just loadWorkArea instead call loadWorkArea available in Main(main.js) object.
        // This shows the confirm message in Yellow instead of the regular window.confirm method.
        Main.loadWorkArea("pchoverview.do", url);
        if(objAjax.isProcessComplete())
        {
            objHTMLData.resetChangeFields();
        }
    }
}

function deletePCH()
{
		
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	var checkModifiedData = _getWorkAreaDefaultObj().checkForNavigation();
	
	if(objAjax && objHTMLData)
	{
	    if(!isValidRecord(true))
		{
			return;
		}
	    var htmlErrors = objAjax.error();	    
	    if(objHTMLData!=null && objHTMLData._mHasUserModifiedData == true && objHTMLData.isDataModified() == true)
	    {
	        //show message 'There are changes on the screen. Do you...' when user edit the data.
		    if(checkModifiedData!=null && checkModifiedData.hasUserModifiedData() == true)
			{
			   //perform save operation if user clicks 'OK'
	        	checkModifiedData.performSaveChanges(_defaultWorkAreaSave);       	     	
			}
			else
			{
			    //It will reset the changed fields and close the message box.
			    cancelProcess();
	   		}
	   	}
	   	else
	   	{	   	
		    //delete Testing Instruction
		    if(objHTMLData._mHasUserModifiedData != true)
			{
			    htmlErrors.addError("confirmInfo", szMsg_PCH_Delete_Confirm,  false);
	   			messagingDiv(htmlErrors, 'dltPCH()', 'closeMsgBox();');
			}
			//delete Event detail
			else
			{
			    htmlErrors.addError("confirmInfo", szMsg_PCHDetails_Delete_Confirm,  false);
	   			messagingDiv(htmlErrors, 'dltPCHDetail()', 'closeMsgBox()');
	   		}
	   	}
 	}
}	

function dltPCH()
{
	var url = "delete";
	
	///closeMsgBox();
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
	    closeMsgBox();
	    objAjax.setActionURL("pchoverview.do");
	    objAjax.setActionMethod(url);
	    objAjax.setProcessHandler(_showWorkArea);
	    objAjax.sendRequest();
	    if(objAjax.isProcessComplete())
        {
            objHTMLData.resetChangeFields();
        }
	}
}
	
//for deleting Testing Instructions detail row.
function dltPCHDetail()
{
	var url = "delete";
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();

	sectionName = objAjax.getDivSectionId();
	
	if(objAjax && objHTMLData)
	{
	    bShowMsg = true;
	    closeMsgBox();
	    objAjax.setActionURL("pchoverview.do");
	    objAjax.setActionMethod(url);
	    objAjax.setProcessHandler(_showWorkArea);
	    	
	    objHTMLData.performSaveChanges(_showSaveContainerWorkArea, objAjax);
        if(objAjax.isProcessComplete())
        {
             objHTMLData.resetChangeFields();
        }
	}
}
