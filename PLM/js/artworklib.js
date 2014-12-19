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
// colorlib.js, any javscript methods related to artwork document could go into this file.
function sortArtworkColumn(fieldName,sec,type, pageNo)
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
	   		messagingDiv(htmlErrors, "saveWorkArea()", "laodPLMSortColumn('artworklib.do','"+url+"',_showColorLibPage);");
	   		return;
        }
		else
		{
			laodPLMSortColumn('artworklib.do',url,_showColorLibPage);
		}
    }
}


function showArtworkView(view, pageNo, sec)
{
   Process.sendRequest(sec,"artworklib.do", "HANDLEVIEW&pageNum="+pageNo+"&view="+view, _showArtworkLibPage);
}

function showArtworkOverview(obj)
{
	Process.showOverview(obj, "artworklib.do", "TOOVERVIEW");
}

function artworklistactiveInactive(status)
{
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
	   bShowMsg = true;

   		if(docview==4201 || docview==4204 || docview==4203)
   		{
			if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
			{
				var htmlErrors = objAjax.error();
				objAjax.error().addError("warningInfo", szMsg_Sel_Artwork, false);
				messagingDiv(htmlErrors);
				return;
			}

			if(status == 'inactive')
		    {
		       	var htmlErrors = objAjax.error();
		       	htmlErrors.addError("confirmInfo", szMsg_ArtworkL_Inactive_Confirm, false);
	   			messagingDiv(htmlErrors, "artworkactiveinactive('"+url+"')", 'artworklistcancel()');
	   			return;
	   		}
			objAjax.setActionMethod(url);
			objAjax.setActionURL("artworklib.do");
			objAjax.setProcessHandler(_showColorLibPage);
			objHTMLData.performSaveChanges(_showColorLibPage, objAjax);
			if(objAjax.isProcessComplete())
	        {
	            objHTMLData.resetChangeFields();
	        }
	        return;
        }

        if(docview=4200)
        {
			if(!isValidRecord(true))
			{
				return;
			}
        	if(status == 'inactive')
		    {
		       	var htmlErrors = objAjax.error();
		       	htmlErrors.addError("confirmInfo", szMsg_ArtworkL_Inactive_Confirm, false);
	   			messagingDiv(htmlErrors, "artworkactiveinactive('"+url+"')", 'artworkoverviewcancel()');
	   			return;
	   		}
	   		loadWorkArea("artworkoverview.do", url);
	   		return;
        }
	}
}


function artworkactiveinactive(url)
{

	var docview;
	closeMsgBox();
	//alert(url);

	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objAjax.getDivSectionId();

	if(objAjax && objHTMLData)
	{

		docview = objAjax.getDocViewId();
    	//alert("docview: "+docview);
    	//alert("inside calling");
    	bShowMsg = true;

		objAjax.setActionMethod(url);
		if(docview==4201 || docview==4204 || docview==4203)
		{
			objAjax.setActionURL("artworklib.do");
		}
		else if(docview=4200)
		{
			loadWorkArea("artworkoverview.do", url);
	   		return;
		}
		objAjax.setProcessHandler(_showColorLibPage);
		objHTMLData.performSaveChanges(_showColorLibPage, objAjax);
		if(objAjax.isProcessComplete())
        {
            objHTMLData.resetChangeFields();
        }
	}
}

function approveArtwork()
{
	var docview;
	var url = "approveartwork";

	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objAjax.getDivSectionId();

		if(objAjax && objHTMLData)
	    {
	    	docview = objAjax.getDocViewId();

	    	if(docview==4200)
	    	{
	    		if(!isValidRecord(true))
				{
					return;
				}
	    		loadWorkArea("artworkoverview.do", url);
	   			return;

	    	}
	    	if(docview==4201 || docview==4203 || docview==4204)
	    	{
	    		if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
            	{
	                var htmlErrors = objAjax.error();
	                objAjax.error().addError("warningInfo", szMsg_Sel_Artwork, false);
	                messagingDiv(htmlErrors);
	                return;
            	}
	    		objAjax.setActionURL("artworklib.do");
	    	}

	    	bShowMsg = true;
	    	objAjax.setActionMethod(url);
	        objAjax.setProcessHandler(_showColorLibPage);
	        objHTMLData.performSaveChanges(_showColorLibPage, objAjax);

	        if(objAjax.isProcessComplete())
            {
                objHTMLData.resetChangeFields();
            }

	    }
}

function createArtwork()
{
	Process.execute("createartwork", "artworkoverview.do");
}


function showArtwork()
{
	url = "view";
    loadWorkArea("artworkoverview.do", url);
}

function _showArtworkLibPage(objAjax)
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

    	// Tracker#: 19807 - LEFT NAVIGATION NEEDS TO BE MADE COLLAPSIBLE
    	_showWorkArea.toggleNav.unRegisterAll();
    	
        _reloadArea(objAjax, sectionName);
        bShowMsg= false;
    }
}

function gotoCombos()
{
	if(!isValidArtwork(true))
	{
		return;
	}
	Process.execute("gotocombos", "artworkcombo.do");
}

function addCombo()
{
	if(!isValidArtwork(true))
	{
		return;
	}
	Process.execute("createcombos", "artworkcombo.do");
}

function deleteCombo()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
   	var docview;

   		var docviewid = htmlAreaObj.getDocViewId();
   	   	var htmlErrors = objAjax.error();
   	   	
   	   	if(objAjax)
   	   	{
   	   		if(!isValidRecord(true))
			{
				return;
			}
   	   	}
		if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
		{

		    //TODO: add the select combo message
		    objAjax.error().addError("warningInfo", "Select Combo(s)", false);
		    messagingDiv(htmlErrors);
		    return;
		}
		if(objHTMLData!=null)
		{
			var chgFlds = objHTMLData.getChangeFields();

			if(chgFlds && chgFlds.length>0)
		      {
		      	  var isColor = false;
		          for (num = 0; num < chgFlds.length; num++)
		          {
		             var obj = chgFlds[num];
		             //alert(obj);
		             var secId = _getSectionIdFromCompName(obj.toString());
		             if(secId==1)
		             {
		             	htmlErrors.addError("warningInfo", "Select the Combo Section CheckBox", false);
		             	messagingDiv(htmlErrors);
		             	var chkbox = getElemnt(obj);

						if(chkbox!=null && chkbox!="undefined")
						{
							chkbox.checked = false;
							isColor = true;
						}

		             }
		          }
				if(isColor == true)
				{
					objHTMLData.resetChangeFields();
					objHTMLData._mHasUserModifiedData = false;

		          	return;
	          	}
		      }
			htmlErrors.addError("confirmInfo","Do you want to delete Combo(s)?",  false);
		    messagingDiv(htmlErrors,'deleteArtworkCombo()', 'artworkcombocancel()');

	    }
}

function deleteArtworkCombo()
{
	closeMsgBox();
	Process.saveChanges("artworkcombo.do", "deletecombo", _showColorLibPage);
}

function deleteComboColors()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
   	var docview;

   	var docviewid = htmlAreaObj.getDocViewId();
   	
   	if(objAjax)
   	{
   		if(!isValidRecord(true))
		{
			return;
		}
   	}
   	

   	   	var htmlErrors = objAjax.error();
		if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
		{

		    //TODO: add the select combo message
		    objAjax.error().addError("warningInfo", "Select Color(s)", false);
		    messagingDiv(htmlErrors);
		    return;
		}

		if(objHTMLData!=null)
		{
			var isCombo = false;
			var chgFlds = objHTMLData.getChangeFields();
			if(chgFlds && chgFlds.length>0)
		      {
		          for (num = 0; num < chgFlds.length; num++)
		          {
		             var obj = chgFlds[num];
		             //alert(obj);
		             var secId = _getSectionIdFromCompName(obj.toString());
		             if(secId==0)
		             {
		             	htmlErrors.addError("warningInfo", "Select the Color Section CheckBox", false);
		             	messagingDiv(htmlErrors);
		             	var chkbox = getElemnt(obj);

						if(chkbox!=null && chkbox!="undefined")
						{
							chkbox.checked = false;
							isCombo = true;
						}

		             }
		          }

		          if(isCombo == true)
		          {
		          	objHTMLData.resetChangeFields();
					objHTMLData._mHasUserModifiedData = false;

					return;
		          }
		      }
			htmlErrors.addError("confirmInfo","Do you want to delete Color(s)?",  false);
		    messagingDiv(htmlErrors,'deleteArtworkColor()', 'artworkcombocancel()');
	    }
}


function deleteArtworkColor()
{
	closeMsgBox();
	Process.saveChanges("artworkcombo.do", "deletecombocolor", _showColorLibPage);
}

function saveArtworkCombo()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objHtmlData = htmlAreaObj.getHTMLDataObj();
    var docviewid = htmlAreaObj.getDocViewId();
	if(objHtmlData!=null && objHtmlData.hasUserModifiedData()==true)
    {
        //alert("loadWorkArea: save changes \n creating ");
        //perform save operation
        objHtmlData.performSaveChanges(_defaultWorkAreaSave);
    }
    else
    {
    	var objAjax = new htmlAjax();
    	objAjax.error().addError("warningInfo", szMsg_No_change, false);
    	_displayProcessMessage(objAjax);
       // _displayUserMessage(szMsg_No_change);
    }
}


function deleteartworklist()
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
			objAjax.error().addError("warningInfo", szMsg_Sel_Artwork, false);
			messagingDiv(htmlErrors);
			return;
		}
		
		var htmlErrors = objAjax.error();
   		htmlErrors.addError("confirmInfo", szMsg_ArtworkL_Delete_Confirm,  false);
   		messagingDiv(htmlErrors,'deleteArtworks()', 'artworklistcancel()');
   	}

}

function deleteArtworks()
{
	closeMsgBox();
	Process.saveChanges("artworklib.do", "deleteartwork", _showDeleteSubmitWorkArea);
}

function deleteartwork()
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
		htmlErrors.addError("confirmInfo", szMsg_ArtworkL_Delete_Confirm,  false);
		messagingDiv(htmlErrors,'deleteArtworkOverview()', 'artworkoverviewcancel()');
   	}
}

function deleteArtworkOverview()
{
	var url = "deleteartwork";
	var docview;
	closeMsgBox();
	
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objAjax.getDivSectionId();
	if(objAjax && objHTMLData)
	{
		//Tracker#: 14105 REFRESHING THE NAVIGATION GRID WHEN THE DATA IS DELETED
		//Added the process handler method so that on deleting the artwork library from the overview 
		//the navigation grid is refreshed
		loadWorkArea("artworkoverview.do", url,"",refreshNavigationGridOnDelete);
	}
}

function refreshArtworklist()
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
                objAjax.error().addError("warningInfo", szMsg_Sel_Artwork, false);
                messagingDiv(htmlErrors);
                return;
            }
            objAjax.setActionURL("artworklib.do");
	}

	objAjax.setActionMethod(url);
	objAjax.setProcessHandler(_showColorLibPage);
	objHTMLData.performSaveChanges(_showColorLibPage, objAjax);
	if(objAjax.isProcessComplete())
	{
		objHTMLData.resetChangeFields();
	}
}

function refreshArtworkOverview()
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
		  loadWorkArea("artworkoverview.do", url);
	}
}

function refreshArtworkCombo()
{
	if(!isValidRecord(true))
	{
		return;
	}
	Process.saveChanges("artworkcombo.do", "db_refresh", _showColorLibPage);
}

function artworklistcancel(){
	closeMsgBox();
	refreshArtworklist();
}

function artworkoverviewcancel(){
	closeMsgBox();
	refreshArtworkOverview();
}

function artworkcombocancel(){
	closeMsgBox();
	refreshArtworkCombo();
}

function showArtworkAttachment()
{
	if(!isValidArtwork(true))
	{
		return;
	}
	Process.execute("view", "artattachments.do");
}


function showArtworkCombo()
{
	if(!isValidArtwork(true))
	{
		return;
	}
	Process.execute("view", "artworkcombo.do");
}
// Tracker#:14435 ISSUE WITH SAVE PROMPT,SYSTEM DISPLAYS'PREVIOUS ACTION ENCOUNTERED ERROR'
// For blank records on click of tabs, message should be given without going in to screen.
function isValidArtwork(displayMessage)
{
	return _checkIsValidRecord("_isValidArtwork", true, szMsg_Invalid_Artwork);
}
