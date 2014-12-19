/*************************************/
/*  Copyright  (C)  2002 - 2010      */
/*           by                      */
/*  TradeStone Software, Inc.        */
/*  Gloucester, MA. 01930            */
/*  All Rights Reserved              */
/*  Printed in U.S.A.                */
/*  Confidential, Unpublished        */
/*  Property of                      */
/*  TradeStone Software, Inc.        */
/*************************************/

 /*
  *Javascript functions are related to Test Instructions.
	*/

//Tracker#: 16781
var szMsg_TestInstrns_Delete_Confirm = 'Do you want to delete Test Instructions?';
var szMsg_TestInstrnsDetails_Delete_Confirm = 'Do you want to delete Test Instructions detail(s)?';

//function newTestInstructions()
//It will be called when clicking 'New' process in Testing Instruction tab screen.
function newTestInstruction()
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
	    loadWorkArea("testinginstructionsplm.do", url);
	    if(objAjax.isProcessComplete())
	    {
	        objHTMLData.resetChangeFields();
	    }
	}
}

//Function pageNavignByDropDown
//This method for pagination purpose.
/*function pageNavignByDropDown()
{
    var current_page = getElemnt("current_page");
    var nextRecordKey = current_page.value;
    pageNavign(nextRecordKey);
} 

//Function pageNavign
function pageNavign(assocID)
{
	var url = "pagnav";
	url += "&associd=" + assocID;
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	
	// Check for valid record to show the screen(tab).
	//if(!isValidTecSpec(true))
    //{
       // return;
    //}

	sectionName = objAjax.getDivSectionId();
	//alert("sectionName  " + sectionName);
	if(objAjax && objHTMLData)
	{
	    bShowMsg = true;
	    loadWorkArea("testinginstructionsplm.do", url);
	    if(objAjax.isProcessComplete())
	    {
	        objHTMLData.resetChangeFields();
	    }
	}
}
*/

//function deleteTestInstruction()

//It will be called when click 'delete' process in Event tab on techspec screen
function deleteTestInstruction()
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
			    htmlErrors.addError("confirmInfo", szMsg_TestInstrns_Delete_Confirm,  false);
	   			messagingDiv(htmlErrors, 'dltTestInstruction()', 'closeMsgBox();');
			}
			//delete Event detail
			else
			{
			    htmlErrors.addError("confirmInfo", szMsg_TestInstrnsDetails_Delete_Confirm,  false);
	   			messagingDiv(htmlErrors, 'dltTestInstructionDetail()', 'closeMsgBox()');
	   		}
	   	}
   	}
}	

//for deleting Testing Instructions record
function dltTestInstruction()
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
	    objAjax.setActionURL("testinginstructionsplm.do");
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
function dltTestInstructionDetail()
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
	    objAjax.setActionURL("testinginstructionsplm.do");
	    objAjax.setActionMethod(url);
	    objAjax.setProcessHandler(_showWorkArea);
	    	
	    objHTMLData.performSaveChanges(_showSaveContainerWorkArea, objAjax);
        if(objAjax.isProcessComplete())
        {
             objHTMLData.resetChangeFields();
        }
	}
}

function copyTestInstruction()
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
        	messagingDiv(htmlErrors, "saveWorkArea()", "continueCopyTestInstructions()");
        	return;
      	}
      	else
      	{
      		continueCopyTestInstructions();
      	}
	}
}

function continueCopyTestInstructions()
{
	closeMsgBox();
	bShowMsg = true;
	var url = "copy";
    loadWorkArea("testinginstructionsplm.do", url);
}

function generateRetest()
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
        	messagingDiv(htmlErrors, "saveWorkArea()", "continueGenerateRetest()");
        	return;
      	}
      	else
      	{
      		continueGenerateRetest();
      	}
	}
}

function continueGenerateRetest()
{
	closeMsgBox();
	bShowMsg = true;
	var url = "generateretest";
    loadWorkArea("testinginstructionsplm.do", url);
}
