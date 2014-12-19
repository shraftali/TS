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

//Tracker#:14087 -SPACES ON THE END OF COLORWAY NAMES ON PRODUCT OVERVIEW CAUSE DATA NOT TO BE SAVED ON COLOR COMBO

//function to load the bomcsection dynamically
function _displayBOMCSection(secId, bomcSecCode)
{

    //alert("_displayBOMCSection  \n bomcSecCode =" + bomcSecCode);

	var url = "displaybomcsection&bomcSecCode="+bomcSecCode;
	var docview;
	
   	var objAjax = new htmlAjax();

    if(objAjax)
    {
        //alert("inside");
        docview = _getWorkAreaDefaultObj().getHTMLAjax().getDocViewId();

        _notifySectionCode(bomcSecCode, true, objAjax);
        
        objAjax.setDivSectionId(secId);        
        bShowMsg = true;
        objAjax.setActionURL("bomc.do");
        objAjax.setActionMethod(url);
        objAjax.setProcessHandler(_showBOMCSection);
        objAjax.sendRequest();
        return;
     }
}

// function to load the html in the corresponding bomcsection
function _showBOMCSection(objAjax)
{
    try
    {
        //alert("_showBOMCSection ");
        if(objAjax)
        {
            _displayProcessMessage(objAjax)
            //alert("_showBOMCSection: \n _objAjax.getDivSectionId() " + objAjax.getDivSectionId());
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

//Tracker#:19855 MAINTAIN USER'S PLACE ON THE SCREEN AFTER ADDING, DELETING, SORTING COMPONENTS ON BOM SCREEN
function _notifySectionCode(bomcSecCode, bAddSecCode, objAjax)
{
	//alert("_notifySectionCode");
	var hdnSecCode = getElemnt("hdn_expand_sec_code");

	if (hdnSecCode) 
	{    		
		var arr = "";
		var seccodes = hdnSecCode.value;
		
		if(seccodes==null || seccodes.length==0)
		{
			arr = new Array();
			seccodes = "";
		}
		else
		{
			arr = hdnSecCode.value.toString().split(",");
		}
		
		//alert('seccodes' + seccodes +'\n'+  seccodes.indexOf(bomcSecCode) + "bAddSecCode =" + bAddSecCode);
		if(bAddSecCode==true && seccodes.indexOf(bomcSecCode)<0) //visible and section code not in the list
		{		
			//alert("adding " + bomcSecCode + "\n to " + arr + "\n seccodes = " + seccodes + "\n seccodes.indexOf(bomcSecCode) =" + seccodes.indexOf(bomcSecCode));
			arr[arr.length]=bomcSecCode;			
		} 
		else if (bAddSecCode==false && seccodes.indexOf(bomcSecCode)>=0)
		{		
			//alert("delete entry");
			for (var i = 0; i < arr.length; i++) 
			{
				 if (arr[i] == bomcSecCode)
				 {
					 //alert("here found [ "+bomcSecCode+" ]remove " + arr);
					 arr.splice(i,1);
					 //alert("after  ->" + arr  +" \n removed bomcSecCode " + bomcSecCode);
					 break;
				 }
			}			
		}	
		
		//alert("arr.toString() " + arr.toString());
		hdnSecCode.value = arr.toString();    
		//alert("hdnSecCode.value " + hdnSecCode.value);
		_appendBOMCScreenInfo(objAjax);
	} 
}

function _notifySectionIsExpanded(divCollapsableID, bomcSecCode) 
{
	//alert("_notifySectionIsExpanded \n bomcSecCode =" + bomcSecCode);

	var divCollapse = getElemnt(divCollapsableID);

	//alert("divCollapse " + divCollapse + '\n divCollapsableID ' + divCollapsableID);
	
	if (!divCollapse)
	{
		return false;
	}

	var bAdd = true;
	
	if (divCollapse.style.visibility == "hidden")
	{
		bAdd = false;
	}
	
	_notifySectionCode(bomcSecCode, bAdd, null);
}

function _appendBOMCScreenInfo(objAjax)
{
	
	if(objAjax==null || !objAjax)
	{
		//alert("_appendBOMCScreenInfo -> creating new ajax object");
		var htmlAreaObj = _getWorkAreaDefaultObj();
		objAjax = htmlAreaObj.getHTMLAjax();
	}
	
	var objItm = getElemnt("hdn_expand_sec_code");

	if (objItm) 
	{
		//alert("_appendBOMCScreenInfo ->" + objItm.value);
		objAjax.parameter().add(objItm.id, objItm.value);
	}
}
// end 
//Tracker#:19855 MAINTAIN USER'S PLACE ON THE SCREEN AFTER ADDING, DELETING, SORTING COMPONENTS ON BOM SCREEN

//Tracker# 10363: CREATE NEW ASSOCIATION BOM COLOR

function _showBOMCTabView(viewName, secId)
{
    //detail section id bomcdetail used
    //action bar id _tableActionBar + secId
    //alert("_showBOMCTabView " + viewName);
    var url = "showtabview&viewtype="+viewName;
 	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	sectionName =   _getWorkAreaObj().getDivSaveContainerName();    //objAjax.getDivSectionId();
	//alert("showBillOfMaterials \n sectionName  " + sectionName);
	//alert("docview id ="+objHTMLData.getDocViewId());

    if(objAjax && objHTMLData)
    {
        url = url + "&docviewid="+objHTMLData.getDocViewId();
    	//alert("inside calling");
    	bShowMsg = true;
    	//alert("before load workarea: \n _getWorkAreaObj().getDivSaveContainerName() " + _getWorkAreaObj().getDivSaveContainerName());
       	Main.loadWorkArea("bomc.do", url, sectionName, '_showBOMCPage');
       	//changeStyleOnclick(viewName);
    }
}

function _bomcEnableSelectedTabs(selViewName)
{
    var viewNames = new Array('1445','1446','1447','16520');
    var cnt = viewNames.length;
    var obj;

    for(var i=0;i<cnt;i++)
    {
        obj = getElemnt(viewNames[i]);
        if(obj)
        {
            obj.className  = 'clsTextLabelLink';
        }
    }

    //alert("selViewName " + selViewName);
    obj = getElemnt(selViewName);
    if(obj)
    {
        obj.className  = 'clsTextLabelNormal';
    }
}


function _showBOMCPage(objAjax)
{
	//alert("_showBOMCPage");
	var clickedTabId = null;
	var otherTabId = null;
    try
    {
        if(objAjax)
        {
            _displayProcessMessage(objAjax)
            var viewName = objAjax.getResponseHeader("viewName");
        	//Tracker#:13980 TSR#:324
        	//Method enable selected tab.
        	_bomcEnableSelectedTabs(viewName);

            //alert("_showBOMCPage: \n _getWorkAreaObj().getDivSaveContainerName() " + _getWorkAreaObj().getDivSaveContainerName());
            var div=getElemnt("_bomcdetail");
            var refreshPage = objAjax.getResponseHeader("refreshPage");

            //Tracker#:13980 TSR#:324
            //refreshing the work area
            if(refreshPage && "1"==refreshPage)
            {
               _showWorkArea(objAjax);
            }
            else if(div)
            {
               // alert("refresh");
               registerHTML(div,objAjax);              
            }
        }
    }
    catch(e)
    {
        //alert(e.description);
    }
}

function _deleteBOMCColorWay(htmlAreaObj, objAjax, objHTMLData)
{
	var htmlErrors = objAjax.error();	
	var obj = $('#hdnIsLinkedQuote');
	
	if(obj && obj.attr("value"))
	{	
		htmlErrors.addError("warningInfo", obj.attr("value"),  false);
		messagingDiv(htmlErrors);
		return;
	}
    
    //Tracker#19587 COLOR BOM DELETE COMPONENT DOES NOT ASK THE USER TO SAVE CHANGES TO BOM FOR THE PROCESS CONTINUES
    //User edits the screen and executing the 'Delete Colorway' process without saving the changes
	//Pop up the  message 'There are changes on the screen. Do you want to save changes before current action?'.
    if(objHTMLData!=null && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
    {
        htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
        messagingDiv(htmlErrors, "saveWorkArea()", "_continueBOMCColorwayRecords()");
        return;
    }
    else
    {
    	_continueBOMCColorwayRecords();
    }
}

//Tracker#19587 COLOR BOM DELETE COMPONENT DOES NOT ASK THE USER TO SAVE CHANGES TO BOM FOR THE PROCESS CONTINUES
//It will continue the process if the screen does not have any changes to save
function _continueBOMCColorwayRecords()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
	var htmlErrors = objAjax.error();
	
	if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
    {
        htmlErrors.addError("warningInfo", szMsg_Sel_Clrway_Row, false);
        messagingDiv(htmlErrors);
        return;
    }
    //Tracker#19587 COLOR BOM DELETE COMPONENT DOES NOT ASK THE USER TO SAVE CHANGES TO BOM FOR THE PROCESS CONTINUES
    //added cancelProcess() when click the cancel button on the confirm box
    htmlErrors.addError("confirmInfo","Deleting Colorways will delete from Techspec.<BR> Do you want to delete Colorway(s)?",  false);
    messagingDiv(htmlErrors,'_deleteBOMCColorwayRecords()','cancelProcess()');
}

//function to delete selected Colorways On product overview screen
function _deleteBOMCColorwayRecords()
{
	var url = "deletecolorways";
	var docview;
	closeMsgBox();

	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objAjax.getDivSectionId();
    //alert("sectionName  " + sectionName);
    if(objAjax && objHTMLData)
    {
    	_appendBOMCScreenInfo(objAjax);
        docview = objAjax.getDocViewId();
        //alert("docview: "+docview);
        //alert("inside calling");
        objAjax.setDivSectionId(htmlAreaObj.getDivSaveContainerName());
        bShowMsg = true;
        objAjax.setActionURL("bomc.do");
        objAjax.setActionMethod(url);
        objAjax.setProcessHandler(_showSubmitWorkArea);
        objHTMLData.performSaveChanges(_showSubmitWorkArea, objAjax);
        if(objAjax.isProcessComplete())
        {
            objHTMLData.resetChangeFields();
        }
        return;
     }
}


function _deleteBOMCComponents(htmlAreaObj, objAjax, objHTMLData)
{
    var htmlErrors = objAjax.error();
    //Tracker#19587 COLOR BOM DELETE COMPONENT DOES NOT ASK THE USER TO SAVE CHANGES TO BOM FOR THE PROCESS CONTINUES
    //User edits the screen and execute the 'Delete Component' process without saving the changes
	//Pop up the  message 'There are changes on the screen. Do you want to save changes before current action?'.
	if(objHTMLData!=null && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
    {
        htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
        messagingDiv(htmlErrors, "saveWorkArea()", "_continueBOMCComponentsRecords()");
        return;
    }
    else
    {
    	_continueBOMCComponentsRecords();
    }
}

//Tracker#19587 COLOR BOM DELETE COMPONENT DOES NOT ASK THE USER TO SAVE CHANGES TO BOM FOR THE PROCESS CONTINUES
//It will continue the process if the screen does not have any changes to save
function _continueBOMCComponentsRecords()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
	var htmlErrors = objAjax.error();
    if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
    {
        htmlErrors.addError("warningInfo", szMsg_Sel_Component_Row, false);
        messagingDiv(htmlErrors);
        return;
    }
    //Tracker#19587 COLOR BOM DELETE COMPONENT DOES NOT ASK THE USER TO SAVE CHANGES TO BOM FOR THE PROCESS CONTINUES
    //added cancelProcess() when click on the cancel button on the confirm box
    htmlErrors.addError("confirmInfo","Do you want to delete Component(s)?",  false);
	messagingDiv(htmlErrors,'_deleteBOMCComponentsRecords()','cancelProcess()');
}

//function to delete selected Colorways On product overview screen
function _deleteBOMCComponentsRecords()
{
    //alert("_deleteBOMCComponentsRecords");
	var url = "deletecomponents";
	var docview;
	closeMsgBox();

	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objAjax.getDivSectionId();
    //alert("sectionName  " + sectionName);
    if(objAjax && objHTMLData)
    {
    	_appendBOMCScreenInfo(objAjax);
        docview = objAjax.getDocViewId();
        //alert("docview: "+docview);
        //alert("inside calling");
        objAjax.setDivSectionId(htmlAreaObj.getDivSaveContainerName());
        bShowMsg = true;
        objAjax.setActionURL("bomc.do");
        objAjax.setActionMethod(url);
        objAjax.setProcessHandler(_showSubmitWorkArea);
        objHTMLData.performSaveChanges(_showSubmitWorkArea, objAjax);
        if(objAjax.isProcessComplete())
        {
            objHTMLData.resetChangeFields();
        }
        return;
     }
}

function _bomcPageNav(pageNavInfo)
{
    //alert("_bomcPageNav");
	var url = "pagenavigation&pageNavInfo="+pageNavInfo;
	var docview;
	closeMsgBox();

    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();

    //Tracker# 14980-READ ONLY ACCESS SHOULD NOT PROMPT USERS TO SAVE WHEN THEY EDIT FIELDS AND LEAVE THE SCREEN
    //Added the additional condition ignore the change fields if checkbox is clicked
    if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==true && objHTMLData.isDataModified()==true)
    {
        var htmlErrors = objAjax.error();
        htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
        messagingDiv(htmlErrors, "saveBomc()", "_submitBOMCPage('"+url+"')");
        return;
    }
    else
    {
        _submitBOMCPage(url);
    }
}

function _submitBOMCPage(actMethod)
{
   closeMsgBox();
   var htmlAreaObj = _getWorkAreaDefaultObj();
   var objAjax = htmlAreaObj.getHTMLAjax();
   if( objAjax)
   {
        objAjax.setActionURL("bomc.do");
        objAjax.setActionMethod(actMethod);
        objAjax.setProcessHandler(_showSubmitWorkArea);
        _appendBOMCScreenInfo(objAjax);
        objAjax.sendRequest();
   }
}

//Tracker# 14980-READ ONLY ACCESS SHOULD NOT PROMPT USERS TO SAVE WHEN THEY EDIT FIELDS AND LEAVE THE SCREEN
//Moved from sample.js to bomc.js
function saveBomc()
{
    //alert("saveBomcEval");
	_appendBOMCScreenInfo();
    closeMsgBox();
    saveWorkArea();
}

//Tracker#: 14664 PAGINATION ON BOM DOES NOT SHOW BOM NAME/DESCRIPTION DROP DOWN
//This method is called from buildPagination() in BOMCHelper class.
function bomcPageNavByDropDown()
{
    var current_page = getElemnt("current_page");
    var nextRecordKey = current_page.value;
    _bomcPageNav(nextRecordKey);
}

function _bomc_removeCommitment()
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var htmlErrors = objAjax.error();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    if (objHTMLData != null)
    {
        if (objHTMLData.hasUserModifiedData() == false)
        {
	        objAjax.error().addError("warningInfo", szMsg_Sel_Commit_No_Row, false);
	        messagingDiv(htmlErrors);
	        return;
	    }
	    else if (objHTMLData.isDataModified() == true)
	    {
            htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
            messagingDiv(htmlErrors, "saveBomc()", "_bomc_confirmRemoveCommitment()");
            return;
	    }
	    else
	    {
	       _bomc_confirmRemoveCommitment();
	    }
    }

    return;
}

function _bomc_confirmRemoveCommitment()
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var htmlErrors = objAjax.error();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    htmlErrors.addError("confirmInfo", "Do you want to remove Commit No(s)?",  false);
    objAjax.setActionURL("bomc.do");
    objAjax.setActionMethod("removeCommitment");
    objAjax.setProcessHandler(_showSubmitWorkArea);
    _appendBOMCScreenInfo(objAjax);
    objHTMLData.performSaveChanges(_showSubmitWorkArea, objAjax);   
    if(objAjax.isProcessComplete())
    {
        objHTMLData.resetChangeFields();
    }
    return;
}

//Tracker#:22934 FDD 561 HIDE/SHOW COLORWAYS ON BOMC COLOR SCREEN
var bomcjs ={		

	bomcColorHideShow:	function()
	{
		var htmlAreaObj = _getWorkAreaDefaultObj();	   	
	    var objHTMLData = htmlAreaObj.getHTMLDataObj();
	    var objAjax = htmlAreaObj.getHTMLAjax();
	    var htmlErrors = objAjax.error();
	    
		if (objHTMLData.isDataModified() == true)
	    {
            htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
            messagingDiv(htmlErrors, "saveBomc()", "bomcjs.displaybomcColorHideShow();");
            return;
	    }
		else
		{
			bomcjs.displaybomcColorHideShow();
		}	
	},
	
	displaybomcColorHideShow:	function ()
	{
	    //alert("bomcColorHideShow");
		var url = "hideshowpopup";
		var docview;
		closeMsgBox();
		var htmlAreaObj = _getWorkAreaDefaultObj();
	   	var objAjax = htmlAreaObj.getHTMLAjax();
	    var objHTMLData = htmlAreaObj.getHTMLDataObj();
	    
	    if(objAjax && objHTMLData)
	    {
		    var htmlfldName = htmlAreaObj.getDivSectionId();
		    //alert("showView : objAjax "  + objAjax.getDocViewId());
		    _startSmartTagPopup(htmlfldName, false, null, true);
		    objAjax.setActionURL("bomc.do");
		    objAjax.setActionMethod(url);	   
		    objAjax.attribute().setAttribute("htmlfldName", htmlfldName);
	        objAjax.setProcessHandler(bomcjs.displayPopUpHandler);
	        objAjax.sendRequest();
	        return;
	     }
	},
	
	displayPopUpHandler:	function (objAjax)
	{
		objAjax.attribute().setAttribute("HIDESHOWPOPUP", "YES");		
		_showSmartTagInteractivePopup(objAjax);		
		divPopup = getElemnt("_popupDIV");
		//alert(divPopup);
		if(divPopup)
		{
			bomcjs.setHideShowPopupToCenter(divPopup);	
		}				
	},

	setHideShowPopupToCenter:	function (elem)
	{
		var elem_width = elem.offsetWidth;
		var elem_height = elem.offsetHeight;
		var scr_width = document.body.clientWidth;
		var scr_height = document.body.clientHeight;		
		var top=(scr_height-elem_height)/2+"px";
		var left=(scr_width-elem_width)/2+"px";
	   	elem.style.top=top;
	   	elem.style.left=left;
	   	elem.style.visibility="visible";
	   	elem.style.position="absolute";
	    elem.style.display = "block";
	},


	selectDeselectAllFields:	function (obj, tblId) 
	{
		var collection = document.getElementById(tblId).getElementsByTagName('INPUT');
		var curchkbox;
		
		for (var x=0; x<collection.length; x++) 
		{
			curchkbox = collection[x];
	        if (curchkbox.type.toUpperCase()=='CHECKBOX')
	        {	        	
	        	if (obj.checked)
				{					
	        		curchkbox.checked = true;
	        		_notifyCheckBoxChangeFields(curchkbox, true);
				}
				else 
				{
					curchkbox.checked = false;
					_notifyCheckBoxChangeFields(curchkbox, true);
				}
	        }
		}
	},

	printHideShowColor:	function (screen, type)
	{
	    var url = "bomc.do";
	    var htmlAreaObj = _getWorkAreaDefaultObj();    
	    var actionMethod ="hideshowview";   
	    var objAjax = htmlAreaObj.getHTMLAjax();
	    var objHTMLData = htmlAreaObj.getHTMLDataObj();
	    
	    if(objAjax)
	    {
	    	bShowMsg = true;
	        objAjax.setActionURL(url);
	        objAjax.setDocViewId(objAjax.getDocViewId());
	        objAjax.setActionMethod(actionMethod);
	        objAjax.attribute().setAttribute("callBackFun", _showSubmitWorkArea);
	        objAjax.setProcessHandler(bomcjs.hideShowCallBack);
	        objHTMLData.addAllChangedFieldsData(objAjax);
	        objAjax.sendRequest();
	    } 
	},

	hideShowCallBack:	function (objAjax)
	{
		var callbackFun = objAjax.attribute().getAttribute("callBackFun");
		//alert("BOMCCalback="+callbackFun);
		if(objAjax.isProcessComplete())
	    {
	    	_closeSmartTag();	    	
	    	eval(callbackFun(objAjax));	    	 
	    }
	    else
	    {		    
	        //alert('bShowMsg ' + bShowMsg);
	     	if(bShowMsg==true)
	     	{    	 
	     		msgInfo = objAjax.getAllProcessMessages();
	 			//alert(" msgInfo: \n "+msgInfo);	
	 		    if(msgInfo!="")
	 		    {
	 		    	//alert("display called");
	 		        _displayProcessMessage(objAjax);
	 		    }
	     	}    	
	        bShowMsg= false;
	     }
	},
		/**
	 * Tracker#:22877 FDD 562 BOMC FILLUP FILLDOWN FILLACROSS
	 */
	_fill : function(divId, action, colpseDivId)
	{
		var divObjCol = getElemnt(colpseDivId);
		var divObj = getElemnt(divId);
		var prcesss = false;
		var obj = _getCurObj();
		//alert(obj.outerHTML);
		if(divObj)
		{
			prcesss = _isValidFillCtrl(divObj, obj);
		}   
		
		if(!prcesss)
		{
			if(action=='fillup')
			{
				_displayWarningMessage(szMsg_Fill_Up);
			}
			else if(action=='filldown')
			{
				_displayWarningMessage(szMsg_Fill_Down);
			}
			else
			{
				_displayWarningMessage(szMsg_Fill_Selected);
			}
			return;
		}
		
		var filVal = obj.value;
		var isFldDesc = _isDescField(obj);
		var filValCode;
		var precedenceobj = bomc._hasPrecedenceField(obj.id);
		var levelId = _getLevelIdFromCompName(obj.id);
		
		if(isFldDesc==true)
		{
			//get the code object
			var objcd = _getDescCodeField(obj);
			if(objcd)			
			{
				if(!objcd.value)
				{
					if(precedenceobj)
						{
							var preceField = bomc._getPrecedenceValueField(obj.id);
							if(preceField)
								{
									objcd = preceField;
								}
						}
				}
				filValCode = objcd.value;
				
			}
		}	
		
		if(action=='fillselected')
		{
			bomcjs._fillProcess('fillup', obj, filVal, isFldDesc, filValCode, true);
			bomcjs._fillProcess('filldown', obj, filVal, isFldDesc, filValCode, true);
		}	
		
		if(precedenceobj || levelId==2)
		{
			if (action=='fillacross')
			{
				bomcjs._fillAcrossProcess(obj, filVal, isFldDesc, filValCode);
			}
			else
			{	
				bomcjs._fillProcess(action, obj, filVal, isFldDesc, filValCode);
			}
		}
		
		if(divObjCol && divObjCol.onclick)
		{
			divObjCol.onclick();
		}
	},
	
	_fillProcess : function (action, obj, filVal, isFldDesc, filValCode, chkSelected)		
	{
		var npSblTr;
		var setChgVal = true;
		var parentObj = obj;
		/**
		 * object is in right table or left table
		 */
		var rightrlefttable;
		/**
		 * index of object's td
		 */
		var tdindex;
		/**
		 * index of object in td children.
		 */
		var objindex;
		var curCollapsibleDiv = bomcjs._getCurrentCollapsibleDiv(parentObj);
		var $collapsibleSubSections = bomcjs._getFilteredSubSectionCollpasibleDivs(curCollapsibleDiv[0], action)
		
		$collapsibleSubSections.each(function (i){
			
			if(obj)
			{
				var td = _findParentObjByTagName(obj, 'td');
				var tr = _findParentObjByTagName(obj, 'tr');
				rightrlefttable = bomcjs._findParentDataTablePostFixByElmnt(tr);
				tdindex = td.cellIndex;
			}
			
			objindex = _fillProcess(action, obj, filVal, isFldDesc, filValCode, chkSelected, false, bomcjs);
			
			if(curCollapsibleDiv[0] && curCollapsibleDiv[0].id!=this.id && $(this).css('display')!='none')
			{
				obj = bomcjs._getNextSectionObj(this, rightrlefttable, tdindex, objindex, action);
				//alert($(this).css('display')+"i=="+i+"id=="+this.id);
				// fill the value to obj, which is first row element in next section.
				
				if(true==chkSelected)
				{
					//alert(npSblTr.outerHTML);
					setChgVal = _checkChkBoxSelected(npSblTr);
				}
				
				bomcjs._setObjValue(obj, setChgVal, isFldDesc, filVal, filValCode, parentObj);
			}
			
			if(i==($collapsibleSubSections.length-1)) // Filling the Last section.
			{
				_fillProcess(action, obj, filVal, isFldDesc, filValCode, chkSelected, false, bomcjs);
			}
		});
	},

	_fillAcrossProcess : function (obj, filVal, isFldDesc, filValCode)
	{
		var npSblTr;
		var setChgVal = true;
		var rightrlefttable;
		var parentObjIndex;
		var parentObj = obj;
		var trIndex;
		
		var tr = _findParentObjByTagName(obj, 'tr');
		rightrlefttable = bomcjs._findParentDataTableByElmnt(tr);
		trIndex = tr.rowIndex;
		
		while(obj)
		{
			var td = _findParentObjByTagName(obj, 'td');	
			
			//alert("td " + td + "\n tr = "+ tr);
			
			if(tr && td)
			{	
				var chldInd = _findChldIndex(obj, td);
				if(($(obj).attr("tagName"))!="DIV")
				{
					parentObjIndex = chldInd;
				}

				if($(obj).attr("tagName")=="DIV")
				{
					chldInd = parentObjIndex;
				}
				//alert("action-->"+action);			
				obj = null;
				//alert("td.cellIndex " + td.cellIndex);
				//alert("nxtCtrl " + nxtCtrl.cells[td.cellIndex]);		 	
				npSblTr = tr.cells[td.cellIndex+1];

				if(npSblTr && chldInd>-1)
				{
					obj = _findChldObjByInd(npSblTr, chldInd);
					
					if($(obj).attr("tagName")=="DIV" || $(obj).attr("isn")==1)
						{
							continue;
						}
					//alert("chkbox selected = " +setChgVal);
					bomcjs._setObjValue(obj, setChgVal, isFldDesc, filVal, filValCode, parentObj);
					//alert(obj.outerHTML);				
				}
			}
		}
		
		if(rightrlefttable && rightrlefttable.id.indexOf("_left_table")!=-1)
		{
			var rightTable = getElemnt(rightrlefttable.id.replace("_left_table", "_right_table"));
			if(rightTable)
			{
				var tr = rightTable.getElementsByTagName("TR")[trIndex];
				if(tr)
					{
						var obj = $(tr).find("td input[type='text']")[0];
						if(obj)
						{
							bomcjs._setObjValue(obj, setChgVal, isFldDesc, filVal, filValCode, parentObj);
						}
						bomcjs._fillAcrossProcess(obj, filVal, isFldDesc, filValCode);
					}
			}
		}
	},
	
	_getNextSectionObj : function (sbsecdiv, leftrighttable, tdindex, objindex, action)
	{
		var rightLeftTable = $("#"+sbsecdiv.id).find("table[id$='"+leftrighttable+"']");
		var objtext = null;
		if(rightLeftTable)
			{
				var conttable = rightLeftTable[0];			
				var tabletr = conttable.getElementsByTagName("TR")[1];
				if(action=='fillup')
				{
					var trs = conttable.getElementsByTagName("TR");
					tabletr = conttable.getElementsByTagName("TR")[trs.length-1];
					var tdobj = tabletr.getElementsByTagName("TD")[tdindex];
					/**
					 * logic to find the row that is not a blank row, so that 
					 * while filling up, do get blank rows starts from end.
					 */
					if(tdobj)
						{
							objtext = tdobj.getElementsByTagName("INPUT")[0];
							var rowNo = _getRowNoFromCompName(objtext.id);
							var prerow = parseInt(trs.length-2);
							while(tabletr && !(_isNotNull(rowNo) && rowNo!="-1") && prerow>=0)
								{
									tabletr = conttable.getElementsByTagName("TR")[prerow];
									tdobj = tabletr.getElementsByTagName("TD")[tdindex];
									if(tdobj)
									{
										objtext = tdobj.getElementsByTagName("INPUT")[0];
									}
									rowNo = _getRowNoFromCompName(objtext.id);
									prerow = prerow-1;
								}
						}
				}
				var tdobj = tabletr.getElementsByTagName("TD")[tdindex];
				if(tdobj)
					{
						objtext = tdobj.getElementsByTagName("INPUT")[0];
					}
				
			}
		return objtext;
	},
			
	_getSubSectionCollapsibleDivs : function ()
	{
		var $collapseDivs = $("div[id$='_bomcdetail']").find("div[id$='_divCollapsable']");
		return $collapseDivs;
	},
	
	_getExpandedCollapsibleDivs : function ()
	{
		var $collapseDivs =bomcjs._getSubSectionCollapsibleDivs();			
		$collapseDivs.each(function (i) {				
			if($(this).css('display')=='none')
				{
					$collapseDivs.splice(i, 1);
				}
		});
		
		return $collapseDivs;
	},
	
		
	setCustomData : function (obj, setChgVal, isFldDesc, filVal, filValCode, parentObj)
	{
		var precedenceobj = bomc._hasPrecedenceField(obj.id);
		
		if(precedenceobj)
		{
			bomc._setPrecedenceFieldValue(parentObj, obj, filValCode);
		}
	},			
	
	_setObjValue : function (obj, setChgVal, isFldDesc, filVal, filValCode, parentObj)
	{
		if(obj && (setChgVal==true))
		{							
			// avoid blank row to fill in.
			var rowNo = _getRowNoFromCompName(obj.id);
			var precedenceobj = bomc._hasPrecedenceField(obj.id);
			var levelId = _getLevelIdFromCompName(obj.id);
			if((precedenceobj || levelId==2) && _isNotNull(rowNo) && rowNo!="-1")
			{
			
				if(isFldDesc==true)
				{
					//get the code object
					var objcd = _getDescCodeField(obj);
					_setObjValInkChg(objcd, filValCode, false);										
				}	
				//Tracker#20217
				//Set for code field onchange first then description field.
				_setObjValInkChg(obj, filVal, false);
				
				/**
				 * fill up the precedence values if precedence fields have value, then reset free text value to
				 * blank, it was filled in _preChgFldsResetAll method.
				 */
				bomc._setPrecedenceFieldValue(parentObj, obj, filValCode);
			}
			
		}
	},
	
	_getReverseSubSectionCollapsibleDivs : function ()
	{
		var collapseDivs = bomcjs._getSubSectionCollapsibleDivs();
		var reverseDivs = [collapseDivs.length];
		var j = 0;
		for(i = (collapseDivs.length-1); i>=0; i--)
			{
				reverseDivs[j++] = collapseDivs[i]; 
			}
		return $(reverseDivs);
	},
	
	_getCurrentCollapsibleDiv : function (curObj)
	{
		var parentObj = $(curObj).parents("div[id$='_divCollapsable']");			
		return parentObj;
	},
	
	_getFilteredSubSectionCollpasibleDivs : function (curObj, action)
	{
		var collapseDivs = bomcjs._getSubSectionCollapsibleDivs();
		if(action=="fillup")
		{
			collapseDivs = bomcjs._getReverseSubSectionCollapsibleDivs();
		}

		var filteredDivs = [];			
		var k = 0;
		var j = collapseDivs.length;
			for(i=0; i<collapseDivs.length; i++)
			{
				if(curObj && curObj.id== collapseDivs[i].id)
					{
						j = i;
					}
				if(i >= j)
					{
						filteredDivs[k++] = collapseDivs[i];
					}
			}
	
		return $(filteredDivs); 
	},
	
	_findParentDataTablePostFixByElmnt : function (tr)
	{
		var obj = tr;		 
		
		while(obj!=null && obj.tagName.toUpperCase()!="TABLE")
			{
				obj = obj.parentNode;			
			}
		if(obj && obj.id && obj.id.indexOf("_right_table")!=-1)
			{
				return "_right_table";
			}
		else if(obj && obj.id && obj.id.indexOf("_left_table")!=-1)
			{
				return "_left_table";
			}
		else
			{
				return null;
			}
	},
	
	_findParentDataTableByElmnt : function (tr)
	{
		var obj = tr;		 
		
		while(obj!=null && obj.tagName.toUpperCase()!="TABLE")
			{
				obj = obj.parentNode;			
			}
		if(obj && obj.id && obj.id.indexOf("_right_table")!=-1 || obj && obj.id && obj.id.indexOf("_left_table")!=-1)  
			{
				return obj;
			}
		else
			{
				return null;
			}
	},
	
	approveAllColor : function(flag)
	{
		//alert("approveAllColor flag -> " + flag);
		var htmlAreaObj = _getWorkAreaDefaultObj();	   	
	    var objHTMLData = htmlAreaObj.getHTMLDataObj();
	    var objAjax = htmlAreaObj.getHTMLAjax();
	    var htmlErrors = objAjax.error();
	    sectionName = htmlAreaObj.getDivContainerName();
		if (true!=flag && objHTMLData.isDataModified() == true)
	    {
            htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
            messagingDiv(htmlErrors, "saveBomc()", "bomcjs.approveAllColor(true);");
            return;
	    }
		
		if(objAjax && objHTMLData)
	    {
	        var url = "approveAllColors&docviewid="+objHTMLData.getDocViewId();
	    	//alert("inside calling");
	    	bShowMsg = true;
	    	Main.loadWorkArea("bomc.do", url, sectionName, '_showSubmitWorkArea',null,false);
	    }
		
	},
	
	approveAllQuality : function(flag)
	{
		
		var htmlAreaObj = _getWorkAreaDefaultObj();	   	
	    var objHTMLData = htmlAreaObj.getHTMLDataObj();
	    var objAjax = htmlAreaObj.getHTMLAjax();
	    var htmlErrors = objAjax.error();
	    
	    //alert("approveAllQuality  flag ->" + flag);
	    sectionName = htmlAreaObj.getDivContainerName();
		if (true!=flag && objHTMLData.isDataModified() == true)
	    {
            htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
            messagingDiv(htmlErrors, "saveBomc()", "bomcjs.approveAllQuality(true);");
            return;
	    }
		
		if(objAjax && objHTMLData)
	    {
	        var url = "approveAllComponents&docviewid="+objHTMLData.getDocViewId();
	    	//alert("approveAllQuality inside calling");
	    	bShowMsg = true;
	    	Main.loadWorkArea("bomc.do", url, sectionName, '_showSubmitWorkArea',null,false);
	    }
		
	},
	//Tracker#:24048 - FR01 DEVELOP A NEW SCREEN - BOM APPROVAL
	sortBomcApprovalColumn : function (fieldName, sec, type, pageNo)
	{
		bomcjs.sortColumnForSection(fieldName, sec, type, pageNo, "bomcapproval.do")
	},

	sortColumnForSection : function (fieldName, sec, type, pageNo, url)
	{
	    var htmlAreaObj = _getWorkAreaDefaultObj();
	    var objAjax = htmlAreaObj.getHTMLAjax();
	    sectionName = sec;
	    if(objAjax)
	    {
	        objAjax.setActionURL(url);
	        //alert("bomcjs.sort");
	        objAjax.setActionMethod("SORT&sortColumn="+fieldName+"&sort="+type+"&pageNum="+pageNo);
	        objAjax.setProcessHandler(bomcjs.refreshPageAfterSort);
	        objAjax.sendRequest();
	    }
	},
	
	refreshPageAfterSort : function(objAjax)
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
	},
	
	exportToExcel : function()
	{
		act = 'exporttoexcel(xlsxformat)';
		openWin('bomcapproval.do?method='+ act, 800, 600);
	},
	
	showBomcOverview : function()
	{
		var htmlAreaObj = _getWorkAreaDefaultObj();	   	
	    var objHTMLData = htmlAreaObj.getHTMLDataObj();	    
		var url = "TOOVERVIEW&keyinfo= " + getComponentKeyInfo();
		Main.loadWorkArea("bomcapproval.do", url, sectionName, 'showBillOfMaterials();',null,false);		
	},
	
	viewBOMApproval : function()
	{		
		var url = "viewBOMApproval";
		var htmlAreaObj = _getWorkAreaDefaultObj();
	    var objAjax = htmlAreaObj.getHTMLAjax();

		if(objAjax)
		{
			Main.loadWorkArea("bomc.do", url);
		}
	},
	/**
	 * Tracker#:24163 FR06 PROVIDE NAVIGATION TO BOMC SCREEN
	 * override the action url to send request for BOMCApprovalAction, to repaint the 
	 * Left Navigation grid.
	 */
	loadNavigationGrid: function (htmlNavAjax)
	{
		_showWorkArea(htmlNavAjax);
		//alert("actionUrl " +actionUrl);
		htmlNavAjax.setActionURL("bomcapproval.do");
		htmlNavAjax.setActionMethod("NAVIGATION");
	    htmlNavAjax.setProcessHandler(_showNavigationComponent);
	    htmlNavAjax.sendRequest();
	   

	},
	//Tracker#:25300 - For Refresh method on BOM Approval Screen
	refreshBOMApproval: function()
	{		
		var url = "db_refresh";
		if(!isValidRecord(true))
		{
			return;
		}
	    var htmlAreaObj = _getWorkAreaDefaultObj();
	    var objAjax = htmlAreaObj.getHTMLAjax();
	    var objHTMLData = htmlAreaObj.getHTMLDataObj();
	    if(objAjax && objHTMLData)
	    {
	    	var srcLstCnt = 0;
	    	var srcMsg = "There are no records to refresh. ";
	    		
	    	var objSrchList = getElemnt("hdnSearchResultCount");
	    	var objSrchMsg = getElemnt("hdnSearchRefreshMsg");
	    	
	    	if(objSrchList)srcLstCnt = objSrchList.value;
	    	if(objSrchMsg)srcMsg = 	objSrchMsg.value;    	
	    		    	
	    	if(srcLstCnt<=0)
            {
                var htmlErrors = objAjax.error();
                objAjax.error().addError("warningInfo", srcMsg, false);
                messagingDiv(htmlErrors);
                return;
            }
            
	    	//alert("refreshBOMApproval");
	    	objAjax.setActionURL("bomcapproval.do");
	    	objAjax.setActionMethod(url);
	    	objAjax.setProcessHandler(loadNavigationGrid);
	    	objAjax.sendRequest();
	    	if(objAjax.isProcessComplete())
	        {
	    		objHTMLData.resetChangeFields();
	        }
	    }
	},
	
	showDesignBillOfMaterials: function()
	{
		TechSpec.show("desingBOMView","bomc.do");
	}
}

/* Tracker#: 20714 - VIEW DESIGN BOM BUTTON WORKING INCONSISTENTLY
 * execute all function calls pending for bomc.js in dynamic.js.
 */
dynamic.js.executeFileJS('bomc.js');
