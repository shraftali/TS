/** ********************************** */
/* Copyright (C) 2002 - 2009 */
/* by */
/* TradeStone Software, Inc. */
/* Gloucester, MA. 01930 */
/* All Rights Reserved */
/* Printed in U.S.A. */
/* Confidential, Unpublished */
/* Property of */
/* TradeStone Software, Inc. */
/** ********************************** */
var sectionName;
var cbNumber;
var rowNumber;
var deleteItem;
var _readWrite='1';
var _read='2';
var _public='PUBLIC';
var _shared='SHARED';
var _private='PRIVATE';

// Function to add a clipboartd
function addClipboard(sec,txtDivId)
{   
    var elem=getElemnt(txtDivId);
    var cbName=elem.value;
    var cbType=_private;
    var acl=getAcl();
    sectionName = sec;
    var objAjax = new htmlAjax();
    if(objAjax)
    {
        objAjax.setActionURL('clipboard.do');
        objAjax.setActionMethod('CLIPBOARD_ADD');    
        //Tracker#:18178-  clipboard sharing enhancements
        //Added query params as ajax parameters instead adding in a query string.
        // As the application throws malicious content message if the query string contains 
        // special charatcters like '&'
        objAjax.parameter().add("cbName", cbName);
        objAjax.parameter().add("cbtype", cbType);
        objAjax.parameter().add("acl", acl);
        
        objAjax.setProcessHandler(showClipBoardPage);
        objAjax.sendRequest();
    }
}
// Function to add item to a clipboartd
function addClipboardItem(sec,cbNo,docId,docViewId,keyValue)
{   
    sectionName = sec;
    var objAjax = new htmlAjax();
    if(objAjax)
    {
        objAjax.setActionURL('clipboard.do');
        objAjax.setActionMethod('CLIPBOARD_ITEM_ADD&cbNo='+cbNo+'&docId='+docId+'&docViewId='+docViewId+'&keyValue='+keyValue);
        objAjax.setProcessHandler(showClipBoardPage);
        objAjax.sendRequest();
        
    }
}
// Function to display the clipboards items
function showClipboardItems(sec,cbNo,type)
{   
    sectionName = sec;
    var objAjax = new htmlAjax();
    if(!type)type='';
    if(objAjax)
    {
        objAjax.setActionURL('clipboard.do');
        objAjax.setActionMethod('CLIPBOARD&cbNo='+cbNo+'&type='+type);
        objAjax.setProcessHandler(showClipBoardPage);
        objAjax.sendRequest();
    }
}
// Function to display the clipboard items
function showClipboardItemsView(sec,cbNo,view)
{
    sectionName = sec;
    var objAjax = new htmlAjax();
    if(objAjax)
    {
        objAjax.setActionURL('clipboard.do');
        objAjax.setActionMethod('CLIPBOARD&cbNo='+cbNo+'&view='+view);
        objAjax.setProcessHandler(showClipBoardPage);
        objAjax.sendRequest();
    }
}
// Function to display the clipboards
function showClipboards(sec)
{
    sectionName = sec;
    var objAjax = new htmlAjax();
    // alert("showClipboards");
    if(objAjax)
    {
       objAjax.setActionURL('clipboard.do');
       objAjax.setActionMethod('CLIPBOARD&cbNo=ALL');
       objAjax.setProcessHandler(showClipBoardPage);
       objAjax.sendRequest();
    }
}
// Function to display the public clipboards
function showPublicClipboards(sec)
{
    sectionName = sec;
    var objAjax = new htmlAjax();
    // alert("showClipboards");
    if(objAjax)
    {
       objAjax.setActionURL('clipboard.do');
       objAjax.setActionMethod('PUBLIC_CLIPBOARD');
       objAjax.setProcessHandler(showClipBoardPage);
       objAjax.sendRequest();
    }
}
// Function to display the shared clipboards
function showClipboardsbyType(sec,type)
{
	if(type.toUpperCase()==_public)
	{
		showPublicClipboards(sec);
	}else if(type.toUpperCase()==_shared)
	{
		showSharedClipboards(sec);
	}else
	{
		showClipboards(sec);
	}
}
// Function to display the shared clipboards
function showSharedClipboards(sec)
{
    sectionName = sec;
    var objAjax = new htmlAjax();
    // alert("showClipboards");
    if(objAjax)
    {
       objAjax.setActionURL('clipboard.do');
       objAjax.setActionMethod('SHARED_CLIPBOARD');
       objAjax.setProcessHandler(showClipBoardPage);
       objAjax.sendRequest();
    }
}
// Function to display the clipboard page
function showClipBoardPage(objAjax)
{
    // alert(" showClipBoardPage \n objAjax " + objAjax);
    if(objAjax)
    {
        // alert("here");
        objMsgDiv = new messagingDiv(objAjax.error());
        _showToolArea(objAjax);
    }
    var cbInfo = objAjax.getResponseHeader("cbInfo");
    if(cbInfo)
    {
    	var infDiv=getElemnt("_cbInfo");
    	infDiv.innerHTML=cbInfo;
    }    
     // Tracker#:18178- clipboard sharing enhancements
     // closing all the popups if its open
    closeCBPopups();
}
// Function to display the passed div and the text box
function showNameDiv(divId,txtDivId)
{
    // alert(txtDivId);
    // var elem=getElemnt(divId);
    // var txtElem=getElemnt(txtDivId);
    // txtElem.value=getDateTime();
    // elem.style.visibility="visible";
    // elem.style.display = "block";
    showNewClipBoard();
}
// Function to hide the passed div
function hideNameDiv(divId)
{
    var elem=getElemnt(divId);
    elem.style.visibility="hidden";
    elem.style.display = "none";    
    remCBTypeSelect();
}

// Function to display option to delete clipboard
function deleteClipboard(msg,sec,cbNo,cbName,cbtype)
{
    sectionName = sec;
    cbNumber=cbNo;
    var objAjax = new htmlAjax();
    var htmlErrors = new htmlAjax().error();
    htmlErrors.addError("confirmInfo", msg+", "+cbName,  false);
    messagingDiv(htmlErrors,"deleteCBoard('"+cbtype+"')",'cancelCBMsg()');
    
}
// Function to delete the clipboard
function deleteCBoard(cbtype){
	 var objAjax = new htmlAjax();
	 closeMsgBox();	
	 // alert(cbtype);
     objAjax.setActionURL('clipboard.do');
     objAjax.setActionMethod('CLIPBOARD_DELETE&cbNo='+cbNumber+'&cbtype='+cbtype);
     objAjax.setProcessHandler(showClipBoardPage);
     objAjax.sendRequest();
	 
}
// Function to delete the clipboard item
function deleteCBoardItem(cbType){
	 var objAjax = new htmlAjax();
	 closeMsgBox();	
	 objAjax.setActionURL('clipboard.do');
     objAjax.setActionMethod('CLIPBOARD_ITM_DEL&cbNo='+cbNumber+'&rowNo='+rowNumber+'&cbType='+cbType);
     objAjax.setProcessHandler(showClipBoardPage);
     objAjax.sendRequest();
	 
}
// Function to close the message box
function cancelCBMsg(){
	closeMsgBox();
}
// Function to display option to remove item from a clipboard
function removeItem(msg,sec,cbNo,rowNo,cbType)
{
    sectionName = sec;
    rowNumber=rowNo;
    cbNumber=cbNo;
    
    var htmlErrors = new htmlAjax().error();
    htmlErrors.addError("confirmInfo", msg,  false);
    messagingDiv(htmlErrors,"deleteCBoardItem('"+cbType+"')",'cancelCBMsg()');  
}
// Function to load clipboard area
function loadClipboardArea(id)
{
   // alert("inside loadClipboardArea");
   makeButtonsInactive(id);
   loadToolArea('clipboard.do','AJAXVIEW');
}
// Function to removed the selected Clipboard type
function remCBTypeSelect()
{
	var types=document.getElementsByName("cbtype");
	var len=0;
	if(types)len=types.length;
	for(i=0;i<len;i++)
	{
		types[i].checked=false;
	}
}
// Function to identify the Clipboard type
function getCBType()
{
	var typElem=getElemnt("cbtype");
	var type='PRIVATE';	
	if(typElem && typElem.checked==true)
	{
		type=typElem.value;
	}	
	return type;
}
// Function to get the read/read-write access
function getAcl()
{
	var acl=_readWrite;
    var chk=getElemnt("_chkCB");
    if(chk && chk.checked)
    {
    	acl=_read;
    }
    return acl;
}
// Function to display the New clipboard window
function showNewClipBoard(fldName)
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var actMethod ="SHOW_NEW_CLIPBOARD&divId=_cbNameDiv"+'&date='+getDateTime();

    if(objAjax)
    {
    	if(!fldName)
    	{
    		fldName = "_createCB"// htmlAreaObj.getDivSectionId();
    	}
    	_startSmartTagPopup(fldName, false, null, false,false,"_cbNameDiv");
    	objAjax.setActionURL("clipboard.do");
        objAjax.setActionMethod(actMethod);
        objAjax.attribute().setAttribute("htmlfldName", fldName);
        objAjax.setProcessHandler(_showNewCBDiv);
        // alert("sending");
        objAjax.sendRequest();
    }
}
// Post precess handle for showNewClipBoard
function _showNewCBDiv(objAjax)
{
    clipBrdNo=objAjax.getResponseHeader("_cbNo");
    if(objAjax)
    {
        // display the user message when drop downs are not loaded
        _displayProcessMessage(objAjax);
        if(!objAjax.isProcessComplete())
        {
            _closeSmartTag(false,"_cbNameDiv");
            
        }
        else
        {
           var popUpDiv = _showSmartTagPopup(objAjax,"_cbNameDiv");
           // positionPageCenter(popUpDiv);
        }
    }
}
// ---------------------------------------------------------------------------
// POP UP BLOCK - START
// ---------------------------------------------------------------------------
var clipBrdNo;
var clpBrdName='';
// Function called on click of Share link
function showUserPopup(fldName,cbNo,clpBrdName)
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	if(!cbNo || "undefined"==cbNo)
	{
		cbNo='-1';
	}
	//clpBrdName=escape(clpBrdName);
	var actMethod ="SHOW_USER_POPUP";
	
    if(objAjax)
    {
    	if(!fldName)
    	{
    		fldName = "SharedCenterCell"// htmlAreaObj.getDivSectionId();
    	}
    	_startSmartTagPopup("SharedCenterCell", false, null, false,false,"_cbUsersDiv");
    	objAjax.setActionURL("clipboard.do");
        objAjax.setActionMethod(actMethod);
        //Tracker#:18178-  clipboard sharing enhancements
        //Added query params as ajax parameters instead adding in a query string.
        // As the application throws malicious content message if the query string contains 
        // special charatcters like '&'
        objAjax.parameter().add("cbNo", cbNo);
        objAjax.parameter().add("cbName", clpBrdName);
        objAjax.parameter().add("divId", "_cbUsersDiv");
        
        
        objAjax.attribute().setAttribute("htmlfldName", fldName);
        objAjax.setProcessHandler(_showUserPopupDiv);
        // alert("sending");
        objAjax.sendRequest();
    }
}
// Post precess handle for showUserPopup
function _showUserPopupDiv(objAjax)
{
    clipBrdNo=objAjax.getResponseHeader("_cbNo");
    if(objAjax)
    {
        // display the user message when drop downs are not loaded
        _displayProcessMessage(objAjax);
        if(!objAjax.isProcessComplete())
        {
            _closeSmartTag(false,"_cbUsersDiv");
            
        }
        else
        {
           var popUpDiv = _showSmartTagPopup(objAjax,"_cbUsersDiv");
           // positionPageCenter(popUpDiv);
        }
        // Tracker 17153: OUTSTANDING ISSUES FROM MY STUFF CLIPBOARD.
    	// closing the clipboard name pop up
    	_closeSmartTag(false,"_cbNameDiv");                 
    }
}
// Function called on click of Search button
function doCBSearch(docView)
{
	// For browsers other than IE
	setCBFocus();
	var areaObj =_getAreaObjByDocView(docView);
	// alert(areaObj);
	var objAjax = areaObj.getHTMLAjax();
	var objHTMLData = areaObj.getHTMLDataObj();
	sectionName = "_cbUserResultDiv";
	bShowMsg = true;
	if(objAjax)
    {
        objAjax.setDocViewId(docView);
        objAjax.setActionURL("clipboard.do");
        objAjax.setActionMethod("GET_USER");
        objAjax.setProcessHandler(_handleCBSearch);	        
        objHTMLData.appendAllCustomContainerDataToRequest(objAjax, sectionName);
		objHTMLData.performSaveChanges(_handleCBSearch, objAjax);
		if(objAjax.isProcessComplete())
    	{
        	objHTMLData.resetChangeFields();
        }
	}		
	
}
// Post precess handle for doCBSearch
function _handleCBSearch(objAjax)
{
	if(objAjax)
    {
	    // If process complete then only reload the area
	    if(objAjax.isProcessComplete())
	    {
	        _reloadArea(objAjax, sectionName,true);	        
	    }
	    else
	    {
	    	// alert("show mesage");
	    	_displayProcessMessage(objAjax);
	    }
    }
}

// Function called to set the focus to the first text field
// Used as a workaround :For browsers other than IE on click of Search button,
// focus was not shifting from text box
function setCBFocus()
{
	var containedDiv = document.getElementById("_cbSrchSecction");		
   	var elms=containedDiv.getElementsByTagName("*");
    for(var i = 0;  i < elms.length; i++) 
	{
       var elm = elms[i];
       switch(elm.type) 
       {
         case "text":
         {
         	elm.focus();
         	break;
         }
       }
	}		
}

// Function called on click od Clear button
function clearCBFields(docViewId)
{
	var objArea = _getAreaObjByDocView(docViewId);
	if(objArea)
    {
        sectionName = objArea.getDivSectionId();
        var containedDiv = getElemnt(sectionName);		
		var objHTMLData = objArea.getHTMLDataObj();
		// alert(objHTMLData.getChangeFields());
     	if(objHTMLData)
     	{
     		objHTMLData.resetChangeFields();
     		objHTMLData._mHasUserModifiedData=false;
     	}	    
		var containedDiv = getElemnt("_cbUserResultDiv");		
    	var elms=containedDiv.getElementsByTagName("TR");    	
	    for(var i = 0;  i < elms.length; i++) 
		{
		    var elm = elms[i];
		    var txts=elm.getElementsByTagName("*");		       
			for(var j=0;j<txts.length;j++)
			{
				elm = txts[j];
				if(elm.readOnly==true)
				{
					break;
				}
				switch(elm.type) 
				{
				 case "text":
				 {
				 	elm.value="";
				  	break;
				 }
				 case "checkbox":
				 {
				 	elm.checked=false;
				  	break;
				 }
				}
			}
		}
	}	
}
// Function called on click od Share Clipboard button
function shareClipboard(docViewId,origAcl,acType)
{
	var cbNo=clipBrdNo;
	clipBrdNo=0;
	if(!cbNo||"undefined"==cbNo)
	{
		var cbNoObj=getElemnt("_cbNo");
		if(!cbNoObj)
		{
			cbNo='-1';
		}else
		{
			cbNo=cbNoObj.value;
		}
	}
	var acl=getAcl();	
	var areaObj =_getAreaObjByDocView(docViewId);
	var objAjax = areaObj.getHTMLAjax();
	var objHTMLData = areaObj.getHTMLDataObj();
	var cbType=getCBType();
	//alert(cbType);
	if(cbType != _public)
	{
		cbType=acType;
	}
	// alert(cbName);
	sectionName = "_cbUserResultDiv";
	bShowMsg = true;
	if(objAjax)
    {
        objAjax.setDocViewId(docView);
        objAjax.setActionURL("clipboard.do");
        objAjax.setActionMethod("SHARE_CLIPBOARD_TO_USER&cbName="+clpBrdName+"&cbNo="+cbNo+'&acl='+acl+'&cbType='+cbType);
        objAjax.setProcessHandler(showClipBoardPage);	        
        objHTMLData.appendAllCustomContainerDataToRequest(objAjax, sectionName);
        //(origAcl != acl) true implies user has changed the status 
        if((getCBType()==_public  && acType!= _public)|| (origAcl != acl && acType!=_private && !objHTMLData.hasUserModifiedData()))
        {
        	objAjax.sendRequest();
        }
        else //if(acType != _public)
        {
			objHTMLData.performSaveChanges(showClipBoardPage, objAjax);
		}
		if(objAjax.isProcessComplete())
    	{
        	objHTMLData.resetChangeFields();
        }
	}		
}
// Post precess handle for shareClipboard
function _handleShareClipBoard(objAjax)
{
	clipBrdNo=0;
	// If process complete then only reload the area
	if(objAjax.isProcessComplete())
    {
        _reloadArea(objAjax, sectionName,true);	        
    }   
	_displayProcessMessage(objAjax);	    
}
// ---------------------------------------------------------------------------
// POP UP BLOCK - END
// ---------------------------------------------------------------------------
// Tracker#:18178- clipboard sharing enhancements
/* Function used to search clipboards */
function _searchClipboards(str,txtId,cbType,id)
{
	sectionName=id;
	var elem=getElemnt(txtId);
	var cbName=elem.value;
	if(cbName != str )
	{
	    var objAjax = new htmlAjax();
	    //cbName=escape(cbName);
	    //alert(cbName);
	    if(objAjax)
	    {
	        objAjax.setActionURL('clipboard.do');
	        objAjax.setActionMethod('CLIPBOARD_SEARCH&cbName='+cbName+'&cbtype='+cbType);
	        objAjax.setProcessHandler(showClipBoardPage);
	        objAjax.sendRequest();
	    }
	}
}
// Tracker#:18178- clipboard sharing enhancements
/* Function called on click of rename button */
function renamePopup(no,name,cbType)
{
    var objAjax = new htmlAjax();
    var actMethod ="SHOW_RENAME_CB";
    if(objAjax)
    {
    	_startSmartTagPopup("_renameCB", false, null, false,false,"_cbRenameDiv");
    	objAjax.setActionURL("clipboard.do");
        objAjax.setActionMethod(actMethod);      
        //Tracker#:18178-  clipboard sharing enhancements
        //Added query params as ajax parameters instead adding in a query string.
        // As the application throws malicious content message if the query string contains 
        // special charatcters like '&'
        objAjax.parameter().add("cbNo", no);
        objAjax.parameter().add("cbName", name);
        objAjax.parameter().add("cbType", cbType);
        objAjax.parameter().add("divId", "_cbRenameDiv");
        
        objAjax.setProcessHandler(_showRenamePopupDiv);
        // alert("sending");
        objAjax.sendRequest();
    }
}
// Post precess handle for renamePopup
function _showRenamePopupDiv(objAjax)
{
    if(objAjax)
    {
        // display the user message when drop downs are not loaded
        _displayProcessMessage(objAjax);
        var popUpDiv = _showSmartTagPopup(objAjax,"_cbRenameDiv");
                     
    }
}
/* Function to close rename popup */
function closeRenamePopup()
{
	_closeSmartTag(false,"_cbRenameDiv");              
}
// Tracker#:18178- clipboard sharing enhancements
/*
 * This function called on blur of search text box. Displays 'Enter clipboard
 * search here...' as text value
 */
function setDispString(obj,str)
{
	val=_trim(obj.value);
	if(val.length==0)
	{
		obj.value=str;
	}
}
// Tracker#:18178- clipboard sharing enhancements
/* Function called on click of Ok button from rename popup */
function renameCB(cbNo,cbType)
{
    var nmElem=getElemnt('_newCbName');
    var name=nmElem.value;    
    var objAjax = new htmlAjax();
	var actMethod ="RENAME_CB";
	if(objAjax)
    {
    	objAjax.setActionURL("clipboard.do");
        objAjax.setActionMethod(actMethod);   
        //Tracker#:18178-  clipboard sharing enhancements
        //Added query params as ajax parameters instead adding in a query string.
        // As the application throws malicious content message if the query string contains 
        // special charatcters like '&'
        objAjax.parameter().add("cbName", name);
        objAjax.parameter().add("cbNo", cbNo);
        objAjax.parameter().add("type", cbType);
        objAjax.setProcessHandler(showClipBoardPage);
        objAjax.sendRequest();
    }    
}
// Tracker#:18178- clipboard sharing enhancements
/* Function to remove clipboard sharing */
function removeShare(docViewId,cbNo)
{
	var areaObj =_getAreaObjByDocView(docViewId);
	var objAjax = areaObj.getHTMLAjax();
	var objHTMLData = areaObj.getHTMLDataObj();
	sectionName = "_cbUserResultDiv";	
	bShowMsg = true;
	if(objAjax)
    {
        objAjax.setDocViewId(docView);
        objAjax.setActionURL("clipboard.do");
        objAjax.setActionMethod("REMOVE_SHARE&cbNo="+cbNo);
        objAjax.setProcessHandler(showClipBoardPage);	        
        objHTMLData.appendAllCustomContainerDataToRequest(objAjax, sectionName);        
		objHTMLData.performSaveChanges(showClipBoardPage, objAjax);		
		if(objAjax.isProcessComplete())
    	{
        	objHTMLData.resetChangeFields();
        }        
	}		
}
// Tracker#:18178- clipboard sharing enhancements
/* Function to close all the clipboard popups */
function closeCBPopups()
{
	_closeSmartTag(false,"_cbNameDiv");
    _closeSmartTag(false,"_cbRenameDiv");        
    _closeSmartTag(false,"_cbUsersDiv");
    //Tracker#:21305 - CLIPBOARDUIHELPER MULTITHREADED CORRECTNESS
    // removed restting call
    //_resetContext();
}
// Tracker#:18178- clipboard sharing enhancements
/*Function called when the public check box is checked.
 * */
function _showPblicComment(obj,msg,accessType)
{
	var elem=getElemnt("_pblicCmnt");
	if(accessType !=_public)
	{
		if(obj.checked==true)
		{
			elem.innerHTML=msg;
		}else
		{
			elem.innerHTML="";
		}
	}
}
/*This function will be called onkeypress on search text box in clipboard
 * */
function enterKeySearch(txtObj,defStr,txtId,cbType,id)
{
	var val=txtObj.value;
	if(val != defStr )
	{
		var key;      
		if(window.event) 
		{
			key = window.event.keyCode; //IE
		}
		else
		{
			key = e.which;			//firefox      
		}
		if(key == '13')
		{
			_searchClipboards(defStr,txtId,cbType,id)
		}	
	}
}

function _resetContext()
{
	var objAjax = new htmlAjax();
	var actMethod ="RESET_CONTEXT";
    if(objAjax)
    {
    	objAjax.setActionURL("clipboard.do");
        objAjax.setActionMethod(actMethod);        
        objAjax.setProcessHandler(_reset);
        objAjax.sendRequest();
    }    
}

// Post precess handle for _resetContext
function _reset(objAjax)
{
    if(objAjax)
    {
        // display the user message when drop downs are not loaded
        _displayProcessMessage(objAjax);
    }
}
