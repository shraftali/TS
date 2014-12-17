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


var menuDivId;
var menuId;
var divCounter;  // current main active tab's id in the navigation - Design center etc
var suffixNav = "nav";
var InternalActiveTab="left";  // to keep track of which tab in active with a nav tab (creative/tasks etc)
var designCenterTabId = '0';
var matMgmtTabId = '1';

var navigation = (function (window, undefined) {
	var activeTabId,
		idMap = {
			mmgmt : 'nav240_navigatorCenterCol',
			calendar : 'nav270_navigatorCenterCol',
			dcenter : 'nav30_navigatorCenterCol',
			search : 'nav0_navigatorCenterCol',
			vendormgmt : 'nav290_navigatorCenterCol',
			order : 'nav420_navigatorCenterCol',
			tradingcomgmt : 'nav430_navigatorCenterCol',
			sourcing : 'nav440_navigatorCenterCol',
			'null' : 'nav30_navigatorCenterCol' // on first login, if on plm dashboard, open up design center by default.
	};
	
	var setActiveTab = function (tabId) {
		activeTabId = tabId;
	};
	
	var init = function (settings) {
		activeTabId = settings.activeTabId;
		
		return this; // For chaining.
	};
	
	var alignHeight = function () {
		if (!activeTabId) // currently erroring out in sourcing dashboard
		{
			return;
		}
		
		var workAreaContainer = getElemnt('_divWorkAreaContainer') || getElemnt('LOCK');
		var $activeTab = $('#' + activeTabId);
		var obj = $activeTab[0];
	    var objCont = getElemnt($activeTab.attr('id') + '_tabcontainer');
	    
	    var windowHeight = $(window).height();
	    var $navArea = $('#_divNavArea');
	    var navOffset = $navArea.offset();

	    var navCnt=0;

	    if(arrNavViewer && arrNavViewer.length)
	    {
	        navCnt = arrNavViewer.length;
	    }

	    if(obj && objCont)
	    {
	        // Reset the Design Center height too.
	        // Consider Padding too
	    	var tabHeight = 25,
	    		tabPadding = 3;
	        $(objCont).height( windowHeight - navOffset.top - (tabHeight + tabPadding)*navCnt );
	        // If the height of the Navigator Bar is more than that of the Work Area then reset the work area div.
	        var navAreaHt = getElemnt("_divNavArea").offsetHeight;
	        if(parseInt(navAreaHt) > workAreaContainer.offsetHeight)
	        {
	            objCont.style.overflowY="auto";

	        }
	    }
	};
	
	var expandActiveTab = function (tabClicked) {
		// Need to hide old active tab first
		if (activeTabId)
		{
			$( '#' + activeTabId + '_tabcontainer' ).css('display', 'none');
			$('.clsNavigatorViewSelHeading').removeClass('clsNavigatorViewSelHeading').addClass('clsNavigatorViewNotSelHeading');
		}
		if (tabClicked)
		{
			activeTabId = idMap[tabClicked];
			if (!activeTabId)
			{
				activeTabId = tabClicked;
			}
			setAttribute(getElemnt(activeTabId), 'className', 'clsNavigatorViewSelHeading');
			$('#' + activeTabId + '_tabcontainer').css('display', 'block');
			$('#' + activeTabId + '_tabcontainer').css('visibility', 'visible');
		}
		
		alignHeight();
	};
	
	return {
		init : init,
		setActiveTab : setActiveTab,
		alignHeight : alignHeight,
		expandActiveTab : expandActiveTab
	};
})(window);


/*
Update the navigation tab when user clicks on a link (remove all other links and show only th clicked link (with tree - optional)

'cdiv',
'p" + nLinkCounter + "a',
'p" + nLinkCounter + "',
'" + treeSubMenu.getName() + "',
" + pMenuCount + ",
'" + position + "'
*/
function refreshMenu(divId, arrowId, parentDivId, section, navCounter, position)
{
    // put the nav data in input field and prepare the nav area for tree structure
  	pna(divId, parentDivId, navCounter, position)

  	var arrowComponent = getElemnt(arrowId);
	var presentImage = arrowComponent.src;
	var imagePath = presentImage.substring(0,presentImage.lastIndexOf("/")+1);
	menuDivId = divId;

	// switching the icon to point down or right based on the click
	if(presentImage && presentImage.substring(presentImage.lastIndexOf("/")+1, presentImage.length) == "right_arrow_black.gif")
	{
		arrowComponent.src =  imagePath + "down_arrow_black.gif";
		getElemnt(menuDivId).style.display="block";
	}
	else
	{
		arrowComponent.src = imagePath + "right_arrow_black.gif";
		getElemnt(menuDivId).style.display="none";
	}

    var ajaxReq = new AJAXRequest("menu.do", refreshMenuDiv, "method=AJAX_MENU&menu="+section);

    ajaxReq.send();
}

//  this is the call back method from refreshMenu
function refreshMenuDiv(response)
{
	getElemnt(menuDivId).innerHTML = response;
}


//Tracker#:22184 PLM SCREENS - CANNOT USE LEFT NAV MAIN TAB TILL THE MSG BOX IS CLOSED - MANUALLY/AUTO
//function to display save confirm message before restoreArea, if there exist changed fields.
function preRestoreArea(navCounter)
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
	
	//Tracker#:23049 SAVE MESSAGE AFTER CLOSING LINE BOARD REPORT 
	//show save confirm message only if the htmlAreaObj.getDataModifiedForNavigation() is true.
	if(htmlAreaObj && htmlAreaObj.getDataModifiedForNavigation())
	{
		var objHTMLData = htmlAreaObj.getHTMLDataObj();
   		var objAjax = htmlAreaObj.getHTMLAjax();
   		var saveHdlr = _getScreenSaveHandler();
   		
		if(objHTMLData!=null && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
	    {	
	    	var htmlErrors = objAjax.error();
	        htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
	        messagingDiv(htmlErrors, saveHdlr, "restoreArea('"+navCounter+"')");
	    }
	    else
	    {	    	
	        restoreArea(navCounter);
	    }
	}
	else
    {
        restoreArea(navCounter);
    }	
}

// function to restore the nav data area to its original form
//Tracker#: 16104 MATERIAL PROJECTIONS LEFT NAVIGATION: THE "SHOW SEARCH LIST" ICON IS MISSING
//Added the navcounter to identify which of the tab needs to be refreshed
//Using the getElemnt intead of the getObj for the hidden field
function restoreArea(navCounter)
{	
	cancelProcess();
	var hiddenObj = getElemnt('navhidden'+navCounter);
    if (hiddenObj!= null && hiddenObj.value != "")
    {
        getElemnt('nav'+navCounter+'data'+InternalActiveTab).innerHTML = hiddenObj.value;
        hiddenObj.value = "";
        // clear the inner html (else scrolling will appear) the hide the navigation section
        getElemnt('nav'+navCounter+'views').innerHTML = "";
        hide('nav'+navCounter+'views');
    }
    //Tracker#:21129 - GLOBAL SEARCH -  SEARCH BUTTON ON NON PLM SCREEN
    // When user clicks on any of the navigation area this function call will 
    // reset the values set in the session for Global search.
    remGblSrchFromSession();
}

//Tracker#:21435  TECH SPEC MESSAGE NEEDED WHEN NAVIGATING TO DASHBOARD
//prints the save confirm message for the left side navigation menus before navigating
function pnaAfterSaveConfirm(divId, parentDivId, navCounter, position,szUrl)
{
	var htmlAreaObj = _getWorkAreaDefaultObj();	
	//alert(szUrl);
	if(htmlAreaObj)
	{
		var objHTMLData = htmlAreaObj.getHTMLDataObj();
   		var objAjax = htmlAreaObj.getHTMLAjax();
   		var saveHdlr = _getScreenSaveHandler();

        // Tracker#: 24590
        // Avoid showing the save Msg, as we do not have any save process on the Summary screen.....
        // In order to avoid any regression checking for docviewid, no need to check for docviewid as the modifiedForNavigation is being set to false
        // only by Capacity Summary, Capacity Projections Summary and LineBoard Report.
        var docviewid = objAjax.getDocViewId();
        var showSavePrompt = true;
        //To prevent save confirm dialog as we used overview layout to print search
        if(docviewid == 7305 || docviewid == 6805)
        {
            showSavePrompt = htmlAreaObj.getDataModifiedForNavigation();
        }

        if(showSavePrompt && objHTMLData!=null && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
	    {	    	
			szUrl = szUrl.replace(/\'/g,"\\'");
			//alert(szUrl);
	        var htmlErrors = objAjax.error();
	        htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
	        messagingDiv(htmlErrors, saveHdlr, "continuePna('"+divId+"','"+parentDivId+"','"+navCounter+"','"+position+"','"+szUrl+"')");
	    }
	    else
	    {	    	
	        continuePna(divId, parentDivId, navCounter, position,szUrl);
	    }
	}
	else
    {
        continuePna(divId, parentDivId, navCounter, position,szUrl);
    }	
}

function continuePna(divId, parentDivId, navCounter, position,szUrl)
{
	cancelProcess();
	pna(divId, parentDivId, navCounter, position);
	
	//alert("szUrl="+szUrl);
	if(szUrl!='null')
	{
		window.location=szUrl;
	}
}

/** pna - Prepare Navigation Area
    url - url being called
    type - ie AJJAXVIEW
*/
//Tracker#: 16104 MATERIAL PROJECTIONS LEFT NAVIGATION: THE "SHOW SEARCH LIST" ICON IS MISSING
//Added the navcounter to identify which link is to be shown and hidden
//Using the getElemnt intead of the getObj for the hidden field
function pna(divId, parentDivId, navCounter, position)
{
	divCounter = navCounter;
	var baseUrl = document.location.href.substring(0,document.location.href.lastIndexOf("/")+1);
	var hiddenObj = getElemnt('navhidden'+navCounter);
	var navDataObj = getElemnt('nav'+navCounter+'data'+position);
	var parentDivObj = getElemnt(parentDivId);
    // put the nav data in input field and prepare the nav area for tree structure
    
    if (hiddenObj!= null && hiddenObj.value == "")
    {
        hiddenObj.value = navDataObj.innerHTML;
        //added the check so that if the link is not there then the left side will be shown as blank
        if(parentDivObj)
        {
        	navDataObj.innerHTML = parentDivObj.innerHTML + "<div id='"+divId+"'></div>";
		} 
		else
		{
			navDataObj.innerHTML = "";
		}
    }
    else // get rid of any tree if clicked on the main link which is loadWorkArea.
    {
        // temporarily storing divid element in a variable
    	var divIdElement = getElemnt(divId);
    	if (divIdElement)
    	{
    		divIdElement.innerHTML = "";
    	}
    }

}

//method to load the children for the parent
function getChildren(componentId, index, section, collapse)
{
	var activeDiv = componentId.substring(componentId.lastIndexOf("-")+1, componentId.length);
	var divId = componentId.substring(0,componentId.lastIndexOf("-")+1);
	var arrowComponent = getElemnt(componentId+"-arrow");
	var presentImage = arrowComponent.src;
	var imagePath = presentImage.substring(0,presentImage.lastIndexOf("/")+1);
	var i=0;
	if(presentImage && presentImage.substring(presentImage.lastIndexOf("/")+1, presentImage.length) == "down_arrow_black.gif")
	{
		while(getElemnt(divId+i) != null){
			if(activeDiv != i){
				if (collapse)
				{
					getElemnt(divId+i).style.display = "none";
				}
				var arrowComponent = getElemnt(divId+i+"-arrow");
				arrowComponent.src = imagePath + "right_arrow_black.gif";
			}
			i++;
		}
	}
	var component = getElemnt(componentId);
	if(component.style.display == "block"){
		if (collapse)
		{
			component.style.display = "none";
		}
	}else {
		component.style.display =  "block";
	}
	menuId = componentId;
	if (collapse)
	{
		return;
	}
	var ajaxReq = new AJAXRequest("menu.do", getChildrenId, "method=AJAX_MENU&menu=" + section + "&index=" + index);
	ajaxReq.send();
}


//this is the call back method
function getChildrenId(response)
{
	if ( response.indexOf("<div id=\"endnode\"")==0)
	{
		var indexString = null;
		var docViewId = null;
		indexString = response.substring(response.indexOf("is=")+3,response.indexOf(" ",response.indexOf("is=")));
		docViewId = response.substring(response.indexOf("dv=")+3,response.indexOf(" ",response.indexOf("dv=")));
//		loadWorkArea('menu.do','NAV-MENU&docViewId='+docViewId+'&searchBy='+indexString);
//      Tracker#: 14883
//      left side nav was not getting refreshed when final node reached
		loadWorkArea('menu.do','NAV-MENU&docViewId='+docViewId+'&searchBy='+indexString,'',loadNavigationGrid);
	}
	else
	{
		getElemnt(menuId).innerHTML = response;
	}
}
//This function will either load the children or will load the data for the clicked menu/sub-menu
function loadNavigationDetails(divId, indexString, operation, section, docViewId){
	var divComponent = divId.substring(0,divId.lastIndexOf("-")+1);
	var activeDiv = divId.substring(divId.lastIndexOf("-")+1,divId.length);
	getElemnt(divComponent + activeDiv + "-cell").className="clsNavChildren";
	var i = 0;
	var collapse = false;
	var arrowComponent = getElemnt(divId+"-arrow");
	var presentImage = arrowComponent.src;
	if(operation == 'getChildren'){
		var imagePath = presentImage.substring(0,presentImage.lastIndexOf("/")+1);
		if(presentImage && presentImage.substring(presentImage.lastIndexOf("/")+1, presentImage.length) == "right_arrow_black.gif"){
			arrowComponent.src =  imagePath + "down_arrow_black.gif";
			collapse = false;
		} else {
			arrowComponent.src = imagePath + "right_arrow_black.gif";
			collapse = true;
			getElemnt(divComponent + activeDiv + "-cell").className = "clsNavChildren";
		}
		while(getElemnt(divComponent + i + "-anchor") != null){
			if(i != activeDiv)
			{
				getElemnt(divComponent + i + "-row").style.display = "none";
				getElemnt(divComponent + i + "-anchor").style.display = "none";
				getElemnt(divComponent + i + "-anchor1").style.display = "none";
			}
			i++;
		}
		getChildren(divId ,indexString, section, collapse);
	}
	else{
		var imagePath = presentImage.substring(0,presentImage.lastIndexOf("/")+1);
		if(presentImage.substring(presentImage.lastIndexOf("/")+1, presentImage.length) == "down_arrow_black.gif"){
			arrowComponent.src =  imagePath + "right_arrow_black.gif";
		}
		getElemnt(divComponent + activeDiv + "-cell").className = "selectedNodes";
		while(getElemnt(divComponent + i + "-anchor") != null){
			if(i != activeDiv)
			{
				getElemnt(divComponent + i + "-row").style.display = "none";
				getElemnt(divComponent + i + "-anchor").style.display = "none";
				getElemnt(divComponent + i + "-anchor1").style.display = "none";
				var arrowComponent = getElemnt(divComponent+i+"-arrow");
				arrowComponent.src = imagePath + "right_arrow_black.gif";
			}
			i++;
		}
		var component = getElemnt(divId);
		component.style.display = "none";
		loadWorkArea('menu.do','NAV-MENU&docViewId='+docViewId+'&searchBy='+indexString+'&menu=' + section,'',loadNavigationGrid);
	}
}


/*
Function is used on the two tabs within a navigation tab
objClicked - id of the tab clicked
objUnchecked - id of the tab which needs to he unchecked
navId - Navigation tab id
*/
function changeNavStyle(objClicked, objUnchecked, navId)
{
    restoreArea(navId);  // restore the nav area
	var clickedLeft = getElemnt(objClicked);
	var clickedCenter = getElemnt(objClicked+"_center");
	var unclickedLeft = getElemnt(objUnchecked);
	var unclickedCenter = getElemnt(objUnchecked+"_center");
	// if left side is clicked
	if(unclickedLeft != null && clickedLeft != null){
		clickedCenter.className = "clsCenterNavButtonOnFocus";
		unclickedCenter.className = "clsCenterNavButtonOffFocus";

		if(objClicked.indexOf("left") >= 0)
		{
			unclickedLeft.className = "clsRightNavButtonOffFocus";
			clickedLeft.className = "clsLeftNavButtonOnFocus";
			getElemnt("nav"+navId+"data"+"left").style.display = "block";
			getElemnt("nav"+navId+"data"+"right").style.display = "none";
			InternalActiveTab = "left";
		}
		else
		{
			unclickedLeft.className = "clsLeftNavButtonOffFocus";
			clickedLeft.className = "clsRightNavButtonOnFocus";
			getElemnt("nav"+navId+"data"+"left").style.display = "none";
			getElemnt("nav"+navId+"data"+"right").style.display = "block";
			InternalActiveTab = "right";
		}
	}
}



//function to manage navigation viewer expandable/collapsable
// 'nav" + navID + "_navigatorCenterCol',
// '_tabcontainer',
// arrNavViewer,
// 'clsNavigatorViewSelHeading',
// 'clsNavigatorViewNotSelHeading'
// heightDiv - div whose height is used to set the height of the nav
function toggleCollapExpandNavigator(objName, divIdSuffix, arrNav, selClassName, unselClassName, heightDiv)
{
    var obj;
    var objCont;
    var navCnt=0;

    if(arrNav && arrNav.length)
    {
        navCnt = arrNav.length;
        for(i=0;i<navCnt;i++)
        {
            obj =   getElemnt(arrNav[i])
            objCont = getElemnt(arrNav[i]+divIdSuffix);

            if(obj)
            {
                setAttribute(obj,"className",unselClassName);
            }
            if(objCont)
            {
                objCont.style.display = "none";
                objCont.style.visibility = "hidden";
            }
        }
    }

    obj =   getElemnt(objName)
    objCont = getElemnt(objName+divIdSuffix);

    if(obj && objCont)
    {
        if(objCont.style.visibility=="visible" ||  objCont.style.visibility.toString().length==0)
        {
            objCont.style.display = "none";
            objCont.style.visibility = "hidden";
            setAttribute(obj,"className",unselClassName);
        }
        else
        {
            var ht = -1;

            objCnt = getElemnt("_divNavArea"); // getElemnt("_divCenter");
            if(objCnt && navCnt>0)
            {
                //total height minus number of centers height minus cellpadding
                var divStyle = getElemnt(heightDiv);
                // Why the switch?
                // The first time the PLM page is loaded toggleCollapExpandNavigator is called before the
                // _divWorkAreaContainer is rendered so take the whole of Nav Area container to set the height of the
                // displayed Navigation area.

                if(divStyle)
                {
                  ht = parseFloat(divStyle.offsetHeight) - (parseFloat(obj.offsetHeight)*navCnt) - (3*(navCnt-1)) -10;
                }
                else
                {
                  ht = parseFloat(objCnt.offsetHeight) - (parseFloat(obj.offsetHeight)*navCnt) - (3*(navCnt-1)) -10;
                }

                if(ht>0)
                {
                    objCont.style.height=ht+"px";
                }
            }
            objCont.style.display = "block";
            objCont.style.visibility = "visible";
            setAttribute(obj,"className",selClassName);
        }
    }
    //var divHeight = getElemnt("_divNavArea").offsetHeight;
   	//Tracker#: 14322 UNWANTED DASHBOARD SECTIONS
   	//The footer moves up when the some main tab is disabled
   	//changes made to fix the issue by taking the height of the screen
   	//and fixing the footer always at the bottom of the screen.
   	screenHeight = document.body.clientHeight;
   	//Tracker#24794 - Changed the value 23 to 18 as the height of the TSSBOT is 18
	screenHeight = screenHeight - 18;
    //divHeight = divHeight + 45;
    if(getElemnt("TSSBOT")){
    	getElemnt("TSSBOT").style.top = screenHeight+"px";
    }
}
/**
	Gets the default html ajax object
*/
function getHTMLAjaxObject()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();

    if(!objAjax)objAjax = new htmlAjax();
    return objAjax;
}
/**
	Gets the different views for the navigation based on the 
	click of the view buttons 
*/
function showGridViews(view, pageNo, sec, actionforward){
	var htmlNavAjax = getHTMLAjaxObject();
	htmlNavAjax.setActionURL(actionforward);
	
    htmlNavAjax.setActionMethod("NAVIGATION&view="+view);
    htmlNavAjax.setProcessHandler(_showNavigationComponent);
    htmlNavAjax.sendRequest();
}

/**
Handle the scrolling on navigation small, medium and large view
divid - id of the div which holds the content
pixl - number of pixels to move on each click
*/

function navscrl(divid, pixl)
{
	var divObj = getElemnt(divid);
	if(divObj != null)
	{
		divObj.scrollTop=divObj.scrollTop+pixl
		// switch the image for the top
		if (divObj.scrollTop == 0)
		{
			document.images[divid+'top'].src = 'images/scroll-up.jpg';
		}
		else
		{
			document.images[divid+'top'].src = 'images/scroll-up-act.jpg';
		}
	
	
		// switch the image for the bottom
		if ((divObj.scrollTop + divObj.offsetHeight) < divObj.scrollHeight)
		{
			document.images[divid+'bot'].src = 'images/scroll-down-act.jpg';
		}
		else
		{
			document.images[divid+'bot'].src = 'images/scroll-down.jpg';
		}
	}
}

//Tracker#: 16791 SAFARI - GOTO TECHSPEC FROM RECENTLY VIEWED DOCUMENTS AND FAVORITES DOES NOT WORK
//Calling the _plmNav from this method
function _dispPLMScreen(navinfo)
{
	_plmNav(navinfo);
}
//Tracker#:21129 - GLOBAL SEARCH -  SEARCH BUTTON ON NON PLM SCREEN
//function with callback
function _dispPLMScreenWithCallBack(navinfo,actionMethod,callback)
{
	if(navinfo!=null && callback!=null)
	{
		loadWorkArea(navinfo,actionMethod,"",callback);
	}
}

//Tracker#: 16791 SAFARI - GOTO TECHSPEC FROM RECENTLY VIEWED DOCUMENTS AND FAVORITES DOES NOT WORK
//Changing the function parameters passing the arguement navInfo
function _plmNav(navInfo)
{	
	if(navInfo!=null)
	{
		loadWorkArea(navInfo,"","",loadNavigationGrid);
	}	
}

//document.onreadystatechange=_plmNav;


// Tracker#:13341 -nav hide/unhide divs sourcing dash -if visible hide it or vice versa.
function navHUH(id)
{
	var splitId;
	if(id != null){
		splitId = id.split("_")
	}	
    obj = getElemnt(id);
    imgobj = getElemnt('img'+id);
    if (obj && obj.style.visibility == 'visible')
    {
        obj.style.display = "none";
        obj.style.visibility = "hidden";
        if (imgobj)
        {
            imgobj.src = 'images/right_arrow_black.gif';
        }

    }
    else if (obj)
    {
        obj.style.display = "inline";
        obj.style.visibility = "visible";
        if (imgobj)
        {
            imgobj.src = 'images/down_arrow_black.gif';
        }
        
        for(i=1;i<25;i++){
        	otherDiv = getElemnt(splitId[0]+"_"+splitId[1]+"_"+i);
        	otherDivImage = getElemnt("img"+splitId[0]+"_"+splitId[1]+"_"+i);
        	if(id != splitId[0]+"_"+splitId[1]+"_"+i && otherDiv){
        		otherDiv.style.display = "none";
       			otherDiv.style.visibility = "hidden";
       			otherDivImage.src = 'images/right_arrow_black.gif';
        	}
        }
    }
	//Tracker#24794 - Setting the top value for copyright from the screen height instead of _divNavArea height
	screenHeight = nCurScrHeight - 18;
    getElemnt("TSSBOT").style.top = screenHeight+"px";
   	
    
}


//********************//
//Tracker#:17785 Moved all the RVD and Favorite link functions to favorites.js
//********************// 

// --------------------------------------------------
// Tracker#: 13512 MOVE FITEVAL INTO PLM FRAMEWORK
// --------------------------------------------------

/**
 *
 * Called from POM WorkSheet - View Fit Evaluations link
 * Navigate to Fit Evaluation screen from POM worksheet.
 *
 */
function _showPLMScreen(navinfo, actionmethod)
{
	// alert("_showPLMScreen  = " + navinfo + "\nactionMethod:" + actionmethod);
	navInfo = navinfo;
	if(!actionmethod || actionmethod == "")
	{
	    // Navigating directly to Fit eval overview screen
	    _plmNavDefaultReload();
	}
	else
	{
	    // Navigating to the Search screen
	    _plmNavWithMethod(actionmethod);
    }
}

// Why another method?
// The first action AJAXNAVVIEW was getting appended with the second ajax
// call Ex: method=AJAXVIEW?method=NAVIGATION if _plmNav was called
// Passing the actionMethod instead of the adding the same to navInfo.
function _plmNavWithMethod(actionmethod)
{
    // alert("_plmNavWithMethod:");
	if(navInfo!=null)
	{
		loadWorkArea(navInfo,actionmethod,"",loadNavigationGrid);
		navInfo = null;
	}
}

// Not required to call loadNavigationGrid as there is no
// need to reload the entire area.
function _plmNavDefaultReload()
{
    // alert("_plmNavWithMethod:");
	if(navInfo!=null)
	{
		loadWorkArea(navInfo,"","", "");
		navInfo = null;
	}
}
// --------------------------------------------------

//Once the load work area is complete the control comes to this method
//and prints the main screen as well as the grid
//Tracker#: 16104 MATERIAL PROJECTIONS LEFT NAVIGATION: "THE SHOW SEARCH LIST" ICON IS MISSING
//Reverting back
function loadNavigationGrid(htmlNavAjax)
{
	//alert("loadnavigation grid called");
	_showWorkArea(htmlNavAjax);
	var actionUrl = htmlNavAjax.getResponseHeader("actionUrl");
	
	var reloadnavid = htmlNavAjax.getResponseHeader("reloadnavid");
	
	if(reloadnavid)
	{
		//alert("reloadnavid done " + reloadnavid);
		eval(reloadnavid);
	}
	
	
	if(actionUrl != null && actionUrl != "")
	{
		htmlNavAjax.setActionURL(actionUrl);
	}
	htmlNavAjax.setActionMethod("NAVIGATION");
    htmlNavAjax.setProcessHandler(_showNavigationComponent);
    htmlNavAjax.sendRequest();

}

function _openCenterMenu(navCenterId, navMenuid)
{	
	var hdnCenter = $('#navCenter' + navCenterId);
	var pMenuCount = null;
	
	if(hdnCenter){		
		pMenuCount = hdnCenter.attr("value");
		//alert(pMenuCount);
	}
	
	var tdcenterid = "nav"+navCenterId+"_navigatorCenterCol";
	var tdCenter = $('#'+tdcenterid);
	if(tdCenter){
		tdCenter.trigger("click");
	}	
	
	if(navMenuid){
		//alert("nav called");
		pna('cdiv',navMenuid+'nav', pMenuCount,'left');
	}	
}

//Tracker#: 14105 REFRESHING THE NAVIGATION GRID WHEN THE DATA IS DELETED
//Added the processhandler method which will be called once data is deleted from the
//overview pages and the navigation grid is refreshed.
function refreshNavigationGridOnDelete(htmlNavAjax)
{
	_showWorkArea(htmlNavAjax);
	refreshNavigationGrid(htmlNavAjax);
}

/**
	This method is for returning the action urls for the docview ids provided.
*/
//Tracker#: 14105 REFRESHING THE NAVIGATION GRID WHEN THE DATA IS DELETED
//Added the docview ids of different screens for the deletion purpose and
//the navigation grid is refreshed
function getActionUrl(docViewId){
	if(docViewId == "2906" || docViewId == "2901" || docViewId == "2904") {
		return "colorlib.do";
	} else if(docViewId == "3501" || docViewId == "3502" || docViewId == "3511" || docViewId == "3509") {
		return "colorpalette.do";
	} else if(docViewId == "6000" || docViewId == "6001" || docViewId == "6002" || docViewId == "6009" || docViewId == "6010") {
		return "materialpalette.do";
	}
	//Tracker#17732
    //Adding new docviewids created for different material type(list) 
	else if(docViewId == "3302" || docViewId == "3301"
	|| docViewId == "3313" || docViewId == "3300" || docViewId == "3303"
	|| docViewId == "3320" || docViewId == "3311" || docViewId == "3319"
	|| docViewId == "3321" || docViewId == "3312" || docViewId == "3323"
	|| docViewId == "3324" || docViewId == "3324" || docViewId == "3326"
	|| docViewId == "3327" || docViewId == "3328" || docViewId == "3329"
	|| docViewId == "3330" || docViewId == "3331" || docViewId == "3332"
	|| docViewId == "3333") {
		return "materiallib.do";
	} else if(docViewId == "3402" || docViewId == "3401" || docViewId == "3400") {
		return "labdip.do";
	} else if(docViewId == "129" || docViewId == "130" || docViewId == "132") {
		return "techspec.do";
	} else if(docViewId == "4002") {
		return "sampletracking.do";
	}else if(docViewId == "4202" || docViewId == "4201" || docViewId == "4200") {
		return "artworklib.do";
    // Tracker#: 13512 also added the Designer View too...
	}else if(docViewId == "2404" || docViewId == "2406" ||  docViewId == "2409") { //Tracker#: 13932 ADD LIST VIEW ON NAVIGATION TAB FOR FIT EVALUATION (Updated for fit evaluation navigation)
		return "fitevalplm.do";
	// Tracker#: 14898 IMPLEMENT SEASONAL CALENDAR FUNCTIONALITY
	}else if(docViewId == "5501" || docViewId == "5500") { //TRacker#: 14898
		return "seasonalcal.do";
    // Tracker#: 15855 CREATE A NEW MATERIAL PROJECTIONS DOCUMENT
	}else if(docViewId == "5801" || docViewId == "5800") {
		return "projections.do";
	}
	// Tracker#:16026 MATERIAL SOURCING PROCESS
	else if(docViewId == "156" || docViewId == "155") {
		return "materialquote.do";
	}
    // Tracker#:18624 - Identify the Capacity Projection views 
	else if(docViewId == "6802" || docViewId == "6800") {
		return "capacityprojections.do";
	}
    // Tracker#:18911 - Identify the Competency views
	else if(docViewId == "7001" || docViewId == "7000") {
		return "competency.do";
	}
	// Tracker#:18914 - Identify the Capacity views 
	else if(docViewId == "7301" || docViewId == "7300") {
		return "capacity.do";
	}
    // Tracker#: 21328 MOVE PARTY SCREEN TO NEW FRAMEWORK UNDER NEW TAB VENDOR MANAGEMENT
    // Identify the fwd for Party Search view or Party Overview.
    else if(docViewId == "209" || docViewId == "212") {
        return "plmparty.do";
	}
	//Tracker#:21362 IDS FOR PLM ORDER SCREEN
	else if(docViewId == "322" || docViewId == "300" || docViewId == "323" || docViewId == "324" || docViewId == "321")
	{ 
		return "purchaseorder.do";    
	}
	else if(docViewId == "325")
	{ 
		return "purchaseorderdetail.do";    
	}
	else if(docViewId == 195 || docViewId == 196 || docViewId==197)
	{
		return "bomcapproval.do";
	}
	else if (docViewId == "192")
	{
		return "whatifcosting.do";
	}
	else if (docViewId == "9201"|| docViewId == "9202" || docViewId == "9207" || docViewId == "9210")
	{
		return "salesorder.do";
	}
	//<!-- Tracker#:25708 -->
	else if (docViewId == "199" || docViewId == "140")
	{
		return "costoptimization.do";
	}
}
/**
	This method is for refreshing the left side navigation grid after the search.
*/
function refreshNavigationGrid(htmlNavAjax)
{
	var actionUrl = getActionUrl(htmlNavAjax.getDocViewId());
	htmlNavAjax.setActionURL(actionUrl);
    htmlNavAjax.setActionMethod("NAVIGATION");
    htmlNavAjax.setProcessHandler(_showNavigationComponent);
    htmlNavAjax.sendRequest();
}

function _showNavigationComponent(objAjax)
{
	//alert("called _showNavigationComponent divCounter " + divCounter);
	
	activateNavigationScroll = true;
    sectionName='nav'+divCounter+'views';
    var nav=getElemnt(sectionName);
    if (nav) // if nav div exists then set its innerhtml to blank.
    {
        nav.innerHTML="";
    }
    else // else return as thre is nothing to show to the user.
    {
        return;
    }
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
    	if (objAjax.getHTMLResult() != '') // do not show the div if no data is set.
    	{
    	    //nav.innerHTML="<table width=152 " + objAjax.getHTMLResult().substring(7, objAjax.getHTMLResult().length);
    	    nav.innerHTML=objAjax.getHTMLResult();

			_execAjaxScript(objAjax);
        }
        bShowMsg= false;
    }
}
//Tracker#: 16104 MATERIAL PROJECTIONS LEFT NAVIGATION: THE "SHOW SEARCH LIST" ICON IS MISSING
//passing the docid so that the show searchlist image will shown according to the link clicked
function activateScroll(docId)
{	
	show('nav'+divCounter+'views');  // divCounter is set in navigation when user clicks on a link
    //shows the search list image only if the data is there in the search list
	//Tracker#: 27250 ISSUES WITH COMPETENCY LINK UNDER VENDOR MANAGEMENT ON LEFT NAV
	//Competency menu is used in product & vendor management centers, menu id is same which is causing issue.
	//Resolved by appending center id to menu id to make it unique.
    var searchListImage = getElemnt("searchListImage" + docId + divCounter);
    
    // Tracker#: 15855 CREATE A NEW MATERIAL PROJECTIONS DOCUMENT
    // Make it visible only if the object is available.
    if(searchListImage)
    {
        searchListImage.style.visibility = "visible";
        searchListImage.style.display = "inline-block";
    }
    // expand or contract the data div based on available space
    var navCTab = getElemnt("nav30_navigatorCenterCol_tabcontainer");
    var navGridTable = getElemnt("navigationGridTable");
    var navScroller = getElemnt("navigationScroller");
    var navScrollId = getElemnt("navigationScrollerId");
    var navScrollHeight = 0;
   // var navigationGridTableHeight = 0

    var mainDivHeight = 0;
    var subDivHeight = 0;
    var tableHeight = 0;

    // check for div before getting its height
    if (navCTab)
    {
        mainDivHeight = navCTab.offsetHeight;
    }


    if (navScroller)  // check obj before getting its height
    {
        subDivHeight = navScroller.offsetHeight;
    }


    if (navGridTable) // check obj before getting its height
    {
        tableHeight = navGridTable.offsetHeight;
    }

    if(tableHeight > subDivHeight)
    {
        var height = mainDivHeight - (subDivHeight);
       	if(height > 180)
        {
            navScroller.style.height = height - 10 + "px";
        }
        else
        {
            navScroller.style.height = "180px";
        }
    }
	if (navScrollId) // check obj before getting its height
    {
		navScrollHeight = navScrollId.offsetHeight;
	}
	if(tableHeight > navScrollHeight){
		getElemnt("scrollDownImage").src = 'images/scroll-down-act.jpg';
	}
}

function expandActiveTab(tabClicked)
{
	if(tabClicked == "mmgmt")
	{
		toggleCollapExpandNavigator('nav240_navigatorCenterCol','_tabcontainer',arrNavViewer,'clsNavigatorViewSelHeading','clsNavigatorViewNotSelHeading', '_divWorkAreaContainer');
	}
	else if(tabClicked == "calendar")
	{
	    	toggleCollapExpandNavigator('nav270_navigatorCenterCol','_tabcontainer',arrNavViewer,'clsNavigatorViewSelHeading','clsNavigatorViewNotSelHeading', '_divWorkAreaContainer');
	}
	else if(tabClicked == "dcenter")
	{
    		toggleCollapExpandNavigator('nav30_navigatorCenterCol','_tabcontainer',arrNavViewer,'clsNavigatorViewSelHeading','clsNavigatorViewNotSelHeading', '_divWorkAreaContainer');
	}
    // Tracker#: 21328
    // Handle new Vendor Management Tab
    else if(tabClicked == "vendormgmt")
    {
        toggleCollapExpandNavigator('nav290_navigatorCenterCol','_tabcontainer',arrNavViewer,'clsNavigatorViewSelHeading','clsNavigatorViewNotSelHeading', '_divWorkAreaContainer');
    }
	else if(tabClicked == "order")
    {
    	//Tracker#:21478 For order management tab
        toggleCollapExpandNavigator('nav420_navigatorCenterCol','_tabcontainer',arrNavViewer,'clsNavigatorViewSelHeading','clsNavigatorViewNotSelHeading', '_divWorkAreaContainer');
    }
	else if(tabClicked == "tradingcomgmt")
    {
    	//Tracker#: 23959 FR08: NEW SCREEN FOR WORKING WITH THE COSTING FIELDS.
        toggleCollapExpandNavigator('nav430_navigatorCenterCol','_tabcontainer',arrNavViewer,'clsNavigatorViewSelHeading','clsNavigatorViewNotSelHeading', '_divWorkAreaContainer');
    }
	else if(tabClicked == "sourcing")
    {
    	//Tracker#:25708 FR-01.1 CREATE MARKET-CHANNEL COST OPTIMIZATION SEARCH/SEARCH LIST SCREEN
        toggleCollapExpandNavigator('nav440_navigatorCenterCol','_tabcontainer',arrNavViewer,'clsNavigatorViewSelHeading','clsNavigatorViewNotSelHeading', '_divWorkAreaContainer');
    }
}

//Tracker#:21435 TECH SPEC MESSAGE NEEDED WHEN NAVIGATING TO DASHBOARD
//prints the save confirm message for the left side navigation 'Tabs' before navigating
function navigateAfterSaveConfirm(naviCenterMenuId, szUrl, pMenuCount)
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
	//Tracker#:23049 SAVE MESSAGE AFTER CLOSING LINE BOARD REPORT 
	//show save confirm message only if the htmlAreaObj.getDataModifiedForNavigation() is true.
	if(htmlAreaObj && htmlAreaObj.getDataModifiedForNavigation())
	{
		var objHTMLData = htmlAreaObj.getHTMLDataObj();
   		var objAjax = htmlAreaObj.getHTMLAjax();
   		var saveHdlr = _getScreenSaveHandler();
   		
		if(objHTMLData!=null && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
	    {
	        var htmlErrors = objAjax.error();
	        htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
	        messagingDiv(htmlErrors, saveHdlr, "continueNavigation('"+naviCenterMenuId+"','"+szUrl+"','"+pMenuCount+"')");
	    }
	    else
	    {	    	
	        continueNavigation(naviCenterMenuId, szUrl, pMenuCount);
	    }
	}
	else
    {
        continueNavigation(naviCenterMenuId, szUrl, pMenuCount);
    }
}

function continueNavigation(naviCenterMenuId, szUrl, pMenuCount)
{	
	cancelProcess();
	toggleCollapExpandNavigator(naviCenterMenuId,'_tabcontainer',arrNavViewer,'clsNavigatorViewSelHeading','clsNavigatorViewNotSelHeading', '_divWorkAreaContainer');
	if(szUrl!=null && szUrl!='undefined')
	{
		window.location=szUrl;
	}
	
	if(pMenuCount!=null && pMenuCount!='undefined');
	{
		restoreArea(pMenuCount);
	}
}
