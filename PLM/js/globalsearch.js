/*************************************/
/*  Copyright  (C)  2002 - 2012      */
/*           by                      */
/*  TradeStone Software, Inc.        */
/*  Gloucester, MA. 01930            */
/*  All Rights Reserved              */
/*  Printed in U.S.A.                */
/*  Confidential, Unpublished        */
/*  Property of                      */
/*  TradeStone Software, Inc.        */
/*************************************/
/**
 * @since 2012R1
 */
/*The function to show Global Search on click of Search Button on tool bar
*/
function loadGlobalSearchArea(id)
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
	if (htmlAreaObj)
	{
		var objHTMLData = htmlAreaObj.getHTMLDataObj();
		//Resetting the changed fields
		objHTMLData.resetChangeFields();
	}
    
	var el = getElemnt(id);
	bShowMsg = true;
	//The call back function is required here. If the user clicks on Search button,
	// after navigating to overview, this function will handle the displaying of 
	// search criteria.
	loadWorkArea('globalsearch.do','view','',_processGSrch);
	//alert(id);
	//Need to check whether the below code is really required
	/*
	 * makeButtonsInactive(id);
	$(el).removeClass().addClass("clsToolBarMenuButtonActive");
	*/	
	
}
function showSpecificSearchView()
{
	bShowMsg = true;
	//Tracker#:21237 - SPECIFIC SEARCH: SOURCING DOCS-RETURN TO SEARCH SCREEN, INCORRECT WARNING 'THERE ARE CHANGES....'
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    //Resetting the changed fields
    objHTMLData.resetChangeFields();
	//The call back function is required here. If the user clicks on Search button,
	// after navigating to overview, this function will handle the displaying of 
	// search criteria.
	loadWorkArea('globalsearch.do','view&SP_VIEW=Y','',_processGSrch);
}

function showGeneralSearchView(action)
{
	bShowMsg = true;
	//Tracker#:21237 - SPECIFIC SEARCH: SOURCING DOCS-RETURN TO SEARCH SCREEN, INCORRECT WARNING 'THERE ARE CHANGES....'
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    //Resetting the changed fields
    objHTMLData.resetChangeFields();
	var ac= '';
	if(action)
	{
		ac = action;
	}
	var defAction = 'view&GN_VIEW=Y&action='+ac;
	//The call back function is required here. If the user clicks on Search button,
	// after navigating to overview, this function will handle the displaying of 
	// search criteria.
	loadWorkArea('globalsearch.do',defAction,'',_processGSrch);
}

function  _processGSrch(objAjax)
{
	var dispSrch = objAjax.getResponseHeader("dispSrch");
	//If the user has a default active tab. Then to display the left nav link for that doc tab.
	if ("Y" == dispSrch)
	{
		_showSpSrchScreen(objAjax);
	}
	else
	{
		//For displaying message on screen.
		var funcs = objAjax.getResponseHeader("funcs");
		var docView = objAjax.getResponseHeader("srchDocView");
		//if docView has value this represents that the user has clicked on the 'SEARCH' icon after navigating to the 
		// overview screen. If so show workarea, criteria etc.
		if (docView && docView.length > 0)
		{
			_showWorkArea(objAjax);
			//evaluate the functions set from server side.	
			//By calling this eval the searchedFlds,searchedCustomFlds & searchedColrFlds will have values set.
			// which can be used to print the searched criteria in the fields. 
			eval(funcs);
			//This will set values to the fields in the search section.
			setValuesToFields(docView);
			showCriteria(objAjax);
			var dId = objAjax.getResponseHeader("docId");
			//alert(dId);
			if (dId)
			{
				restoreArea(designCenterTabId);
				loadSpNavigationGrid(dId);
				pna('cdiv',dId + designCenterTabId + suffixNav, designCenterTabId,'left');
			}
		}else
		{
			_showSpSrchScreen(objAjax);
		}
		
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
		//var scrpt = objAjax.getScriptResult();
	    //alert("scrpt "+ scrpt);  
	    //_execAjaxScript(objAjax);		
	}
}
/**
 * The function to display the search fields on selection of document name from the drop down
 * @param obj
 */
function showDocFieldsForSearch(obj)
{
	if ( obj.selectedIndex == 0)
	{
		return;
	}
	var docId = obj[obj.selectedIndex].value;
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    var url = "SEARCHVIEW&docId="+docId;    	
    if(objAjax)
	{
		bShowMsg = true;		
		loadWorkArea("specificsearch.do", url,'',_showSpSrchScreen);
	}
}

function showDocWithTabs(docId)
{
	var chk = 'N';
	/*var c = getElemnt("_spDefTabChk")
	if (c.checked)
	{
		chk = 'Y';
	}*/
	
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    var url = "MAKE_TAB&docId="+docId+"&spDoc=Y&checked="+chk;    
    if(objAjax)
	{
		bShowMsg = true;		
		loadWorkArea("specificsearch.do", url,'',_showSpSrchScreen);
	}
}

function removeTab(docId)
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    var url = "REMOVE_TAB&docId="+docId;    	
    if(objAjax)
	{
		bShowMsg = true;		
		loadWorkArea("specificsearch.do", url,'',_showSpSrchScreen);
	}
}

function removeActiveTab(docId)
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    var url = "REMOVE_ACTIVE_TAB&docId="+docId;    	
    if(objAjax)
	{
		bShowMsg = true;		
		loadWorkArea("specificsearch.do", url,'',_showSpSrchScreen);
	}
}
function makeActiveTab(docId)
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    var url = "MAKE_ACTIVE_TAB&docId="+docId;    	
    if(objAjax)
	{
		bShowMsg = true;		
		loadWorkArea("specificsearch.do", url,'',_showSpSrchScreen);
	}
}
function showDocSearchFields(docId)
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    //Tracker#:21237 - SPECIFIC SEARCH: SOURCING DOCS-RETURN TO SEARCH SCREEN, INCORRECT WARNING 'THERE ARE CHANGES....'
    //Resetting the changed fields
    objHTMLData.resetChangeFields();
    var url = "SEARCHVIEW&docId="+docId+"&spDoc=Y";    	
    if(objAjax)
	{
		bShowMsg = true;		
		loadWorkArea("specificsearch.do", url,'',_showSpSrchScreen);
	}
}
/**
 * Post handler function for displaying the work area
 * @param objAjax
 */
function  _showSpSrchScreen(objAjax)
{
	//For displaying message on screen.
		
	var docId = objAjax.getResponseHeader("docId");	
	
	//To restore the all the links.
	//If Material quote or Material Projections then restore Material Management Tab on LHS 
	// else Design Center tab
	if ( docId == '155' || docId == '5800')
	{
		toggleCollapExpandNavigator('nav240_navigatorCenterCol','_tabcontainer',arrNavViewer,'clsNavigatorViewSelHeading','clsNavigatorViewNotSelHeading', 'LOCK');
		restoreArea(matMgmtTabId);
		//This will reload the navigation area with the links. 
		loadNavigationGrid(objAjax);
		//to display only the selected link
		pna('cdiv',docId + matMgmtTabId + suffixNav, matMgmtTabId,'left');
	}else
	{
		toggleCollapExpandNavigator('nav30_navigatorCenterCol','_tabcontainer',arrNavViewer,'clsNavigatorViewSelHeading','clsNavigatorViewNotSelHeading', 'LOCK');
		restoreArea(designCenterTabId);
		//This will reload the navigation area with the links. 
		loadNavigationGrid(objAjax);
		//#27383 - Do not call pna function if docId is not present. For Ex: While click on Search at the top of the screen.
		if (docId && docId !="")
		{
			//to display only the selected link
			pna('cdiv',docId + designCenterTabId + suffixNav, designCenterTabId,'left');
		}
	}
	
	
	
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
   	//var scrpt = objAjax.getScriptResult();
    //alert("scrpt "+ scrpt);  
    _execAjaxScript(objAjax);
}

function  _displayScreen(objAjax)
{
	//For displaying message on screen.	
    if(bShowMsg==true)
   	{    	 
   		msgInfo = objAjax.getAllProcessMessages();
	    if(msgInfo!="")
	    {
	        _displayProcessMessage(objAjax);
	    }
   	} 
    _execAjaxScript(objAjax);
}

function sortSrcngRecs(fieldName,sec,type, pageNo)
{
    //alert("sortPaletteColumn called");
    sectionName = sec;
    var htmlAreaObj = _getWorkAreaDefaultObj();
	//alert("htmlAreaObj " + htmlAreaObj);
    var objAjax = htmlAreaObj.getHTMLAjax();
    if(objAjax)
    {
        var docview = objAjax.getDocViewId();
    	objAjax.setActionURL("specificsearch.do");
        objAjax.setProcessHandler(_showSpSrchPage);
        objAjax.setActionMethod("SORT&sortColumn="+fieldName+"&sort="+type+"&pageNum="+pageNo);
        objAjax.sendRequest();
    }
}

function _showSpSrchPage(objAjax)
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

/* This function is used to print the Search criteria to the section provided for that.
 * Processed only if the request is from specific search.
 *  */
function showCriteria(objAjax)
{
	var sp = objAjax.getResponseHeader("sp_srch_req");
	var docView = objAjax.getResponseHeader("srchDocView");
	var s ="";
	this.dispOPR = dispOPR;
	this.dispDND = dispDND;
	this.dispREG = dispREG;
	this.dispDEF = dispDEF;
	this.eLnkShwn = false;
	
	if ("Y" == sp)
	{
		this.obj = $("#_spSrchCriteriaSec");
		$(this.obj).empty();
		var edit = $('<A>[Edit]</A>').attr("href","#").click
		(function()
		 {
				toggleCollapExpand(Collapimg_Id,collapSection_Search, imgDownArrow, imgRightArrow)}
		);
		if (this.obj)
		{
			this.opr = objAjax.getResponseHeader("opr");
			if (this.opr && this.opr.length > 0)
			{
				this.dispOPR();
			}
			this.dnd = objAjax.getResponseHeader("dnd");
			if (this.dnd && this.dnd.length > 0)
			{
				this.dispDND(obj,dnd);
			}
			this.reg = objAjax.getResponseHeader("reg");
			if (this.reg && this.reg.length > 0)
			{
				this.dispREG(obj,reg);
			}
			this.def = objAjax.getResponseHeader("def");
			if (this.def && this.def.length > 0)
			{
				this.dispDEF(obj,reg);
			}
		}
	}
	
	function dispOPR()
	{
		var s = this.opr.split("~@");		
		showLinks(s,"opr")
	}
	function dispDND()
	{
		//alert(this.dnd);
		var s = this.dnd.split("|");
		showLinks(s,"dnd");		 
	}
	function dispREG()
	{
		var s = this.reg.split("~@");
		showLinks(s,"reg");
	}
	function dispDEF()
	{
		var s = this.def.split("~@");
		showLinks(s,"def");
	}
	//This will display the criteria links with remove and edit  
	function showLinks(s,type)
	{
		var s1 = '';
		var s1splt = '';
		var id = '';
		var disp = '';
		for ( i=0;i<s.length-1;i++)
		{
			if (type == 'dnd')
			{
				s1 = s[i];
				s1splt = s1.split("$");
				id = s1splt[0];
				disp = s1splt[1];
			}
			else
			{
				s1 = s[i];
				s1splt = s1.split("@@");
				disp = s1splt[0];
				id = s1splt[1];	
			}
			//alert(id);
			var div = $("<DIV id='sp_op"+i+"' position='relative' left='10px'></DIV>").appendTo(this.obj);//.css("background-color","yellow");
			var img = $("<img id='"+id+"' title='Remove'></img>").attr("src","images/close_med.gif")
			.appendTo(div).click(function(){removeCriteria(this.id,type,docView)});
			var typ = "";
			//typ = (type == 'opr' || type == 'dnd') ? "["+type+"]" : "";
			if(type == 'dnd')
			{
				$(div).append(" ");
				if (isImage(disp))
				{
					var dImg = $("<img id='d_"+id+"' src ='imagestore/thumbnails/"+disp+"' height='20px' width='30px'></img>")
					.appendTo(div);					
				}else
				{
					var ddiv = $("<span id='d_"+id+"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>")
					.css({"background-color":""+disp+"","height":"10px","width":"50px","position":"relative","top":"0px"})
					.appendTo(div).append("<div></div>");					
				}
			}
			else
			{
				$(div).append(" " + disp+"  " +typ);
			}			
			
			//To display Edit link only once
			if (!this.eLnkShwn)
			{
				edit.appendTo($(div).append("&nbsp;&nbsp;&nbsp;"));
				this.eLnkShwn = true;
			}
		}
	}
	//Function to remove the criteria.
	function removeCriteria(id,type,docView)
	{
		var htmlAreaObj = _getWorkAreaDefaultObj();
		//alert("htmlAreaObj " + htmlAreaObj);
		sectionName = 'MainSection';
	    var objAjax = htmlAreaObj.getHTMLAjax();
		bShowMsg=true;
	    if(objAjax)
	    {
	        var docview = objAjax.getDocViewId();
	    	objAjax.setActionURL("advsearch.do");
	        objAjax.setProcessHandler(_refreshPage);
	        objAjax.setActionMethod("REM_CRITERIA&id="+id+"&type="+type+"&docId="+docId+"&docView="+docView);
	        objAjax.sendRequest();
	    }	
	}
	//Checking is image or not
	function isImage(val)
	{
		val=val.toUpperCase();
		if(val.indexOf('JPG') > 0 || val.indexOf('JPEG') > 0|| val.indexOf('GIF') > 0 || val.indexOf('PNG') > 0 || val.indexOf('BMP') > 0)
		  return true;
		else
		  return false;
	}
	//Function to refresh page
	function _refreshPage(objAjax)
	{
		var funcs = objAjax.getResponseHeader("funcs");
		var condCnt = objAjax.getResponseHeader("cond_cntr");
		var cnt =(condCnt) ? parseInt(condCnt): -1;
		showCriteria(objAjax);
		//Tracker#21227 - SPECIFIC SEARCH: ISSUES WITH REMOVING THE SEARCH FILTERS
		if (cnt != -1 && cnt ==0)
		{
			$("#MainSection_divCollapsable").remove();//remove the contents from result area
			$("#_tableHeaderBarMainSection :eq(0) tr:eq(1)").remove(); // remove pagination
			$("#_tableHeaderBarMainSection :eq(0) tr:eq(1)").remove(); //remove buttons
			refreshNavigationGrid(objAjax);
			var objAjax = new htmlAjax();
			var htmlErrors = objAjax.error();
    		objAjax.error().addError("warningInfo", "Please enter your search criteria.", false);
    		messagingDiv(htmlErrors);
		}else
		{
			_showColorLibPage(objAjax);
		}
		refreshNavigationGrid(objAjax);
		//evaluate the functions set from server side.
		//By calling this eval the searchedFlds,searchedCustomFlds & searchedColrFlds will have values set.
		// which can be used to print the searched criteria in the fields.
		eval(funcs);
		sectionName =  "_SearchSection";
		//First Remove all the criteria 
		search.clearFields(docView);
		setValuesToFields(docView);
	}	
}
/**
 * To set the searched values to all the search fields.
 */
function setValuesToFields(docView)
{
	srchDocView = docView;
	//Set the values, If criteria from regular search
	if(searchedFlds){
		search.setElementsToSearchScreen(searchedFlds);
	}
	//Set the values, If criteria from operational search
	if(searchedCustomFlds && searchedCustomFlds!=nothing){
		search.setElementsToCustomSection(searchedCustomFlds);			
		insideCrteria=true;
	}
	//Set the values, If criteria from drag and drop search
	if(searchedColrFlds && searchedColrFlds!=nothing){
		search.setElementsToColorSquareSection(searchedColrFlds);
	}	
}

function emptySpCrt()
{
	crt = $("#_spSrchCriteriaSec");
	$(crt).empty();	
}
/**
 * To clear the fields with in the
 * @param obj 
 * @param id
 */
function clearAreaFields(obj,id)
{
    $(obj).bind('click', function() { 
	    $('#'+id+' input').val(''); 
	});
}

function mGridImageHover(cellObj, evtStr) {
    if (evtStr == 'over') {
        cellObj.style.backgroundColor = "#F2F2F2";
    } else {
        cellObj.style.backgroundColor = "#ffffff";
    }
}

/**
 * Tracker#:20767 - SPECIFIC SEARCH: DYNAMICALLY DISPLAY THE SEARCH FIELDS OF THE SELECTED SOURCING DOCS-PURCHASE ORDER
 */
function showOverviewFromSpecificSearch(docId)
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    if(objAjax)
    {
        objAjax.setActionURL("specificsearch.do");
        objAjax.setActionMethod("NAVIGATE&docViewId="+docId + "&keyinfo="+getComponentKeyInfo());
        objAjax.setProcessHandler(_displayScreen);
        objAjax.sendRequest();
    }
}

function _gblSrchPlmNavigate()
{
	waitWindow();
	window.location.href= 'plm.do?method=plmnavigate&navinfo=globalsearch.do&targetMethod=FROM_SRC_VIEW&callback=_processGSrch';
	waitWindow();
}
function remGblSrchFromSession()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
	if (htmlAreaObj)
	{
	    var objAjax = htmlAreaObj.getHTMLAjax();
	    if(objAjax)
	    {
	        objAjax.setActionURL("generalsearch.do");
	        objAjax.setActionMethod("reset_session");
	        objAjax.setProcessHandler(_displayScreen);
	        objAjax.sendRequest();
	    }
	}
}

function loadSpNavigationGrid(docId)
{
	var objAjax = new htmlAjax();
	var actionUrl = getActionUrl(docId);
		if(actionUrl != null && actionUrl != "")
	{
			objAjax.setActionURL(actionUrl);
	}
	objAjax.setActionMethod("NAVIGATION");
	objAjax.setProcessHandler(_showNavigationComponent);
	objAjax.sendRequest();
}
