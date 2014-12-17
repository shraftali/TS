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

// to be removed copied from comfunc.js for testing purpose
// return the obj based on its name szName
function getElemnt(szName)
{
    return document.getElementById(szName);
}

function getElemntByName(szName)
{
    return document.getElementsByName(szName);
}

function setWidth(obj, nwidth)
{
    obj.style.width = nwidth+"px";
}
//----------------------------------------------------------------------//
var _processing = '<table bordercolor="#0000FF" cellpadding=0 cellspacing=0 border="1"><tr><td style=\"background-color: #C3D3FD\"><br>Processing...<br><br></td></tr></table>';

var _AttributeNameShowWait = "hideForShowWaitMsg";
var _AttributeNamekeyInfo = "keyinfo";
var _AttributeNameDocViewid = "docviewid";
var _AttributeNameIsDescField = "isDescFld";
var _AttributekeyInfoValue = "";
var _AttributeParentId = "parentid";
var _AttributeChangeCase = "chgcs";
var _AtrrributeImageIsImg = "_isimg";
var _AtrrributeSpecialCase = "spcase";
var _AtrrributeIsNotesComp = "isn";
var _AtrrributeIsChangeFieldNotify = "cgn";
// Tracker#: 13512  MOVE FITEVAL INTO PLM FRAMEWORK
var _AttributeFrzDataRowStartIndex = "frzRw";
var _AttributeDateFormat = "_df";
var _AttributeDonotCloseSmartDiv = "donotclosesmartdiv";
var _FIELDS_SEPERATOR = "_@";
var _CHK_BOX_DEFAULT_ID = "chkRowKeys" + _FIELDS_SEPERATOR;
//Tracker#:16293 TSR-506 F5-COLORWAY FIELD NEED TO BE CONFIGURABLE FOR ARTWORK COMBOS
//In MainHelper class if the KEY_VALUE_FIELD_SEPERATOR variable value get changed, this value also should be changed.
var _KEY_VALUE_FIELDS_SEPERATOR = "@@";
var _DATA_TYPE_VARCHAR = 12;
var _DATA_TYPE_NUMERIC = 4;
var _DATA_TYPE_DATE = 91;
//Tracker#: 18869 -ADVANCED SEARCH SCREEN VALIDATION FIELDS NOT GETTING NOTIFIED WITH CHANGES
//Component identifier for adv search field
var _AttribSrchFld= "isAdvSrchFld";
//Each Link will have hidden variable with the link id pointing to that, link control will have the id prefix with lnk.
var _LINK_ID_SUFFIX = "lnk";
var _DELIMITER = "###";

function setComponentKeyInfo(obj)
{
    if(obj)
    {
       _AttributekeyInfoValue = getCustomAttribute(obj, _AttributeNamekeyInfo);
    }
}

function getComponentKeyInfo()
{
    return _AttributekeyInfoValue;
}

function getKeyInfo(obj)
{
    if(obj)
    {
        return getCustomAttribute(obj, _AttributeNamekeyInfo);
    }
    return null;
}

function _getCompDocViewId(obj)
{
	//alert("main: _getCompDocViewId");
    if(obj)
    {
    	//alert("_getCompDocViewId");
        return getCustomAttribute(obj,_AttributeNameDocViewid);
    }
    return null;
}

function _isDescField(obj)
{
    var isDesc = false;
    //alert("_isDescField : \n _AttributeNameIsDescField =  "+ _AttributeNameIsDescField);
    if(obj)
    {
        //alert("_isDescField : \n " +  getCustomAttribute(obj,_AttributeNameIsDescField));

        isDesc =  (getCustomAttribute(obj,_AttributeNameIsDescField)=="1")?true:false;
    }
    return isDesc;
}
//Tracker#: 18869 -ADVANCED SEARCH SCREEN VALIDATION FIELDS NOT GETTING NOTIFIED WITH CHANGES
//This function checks whether the component is an adv search component or not
function _isSearchField(obj)
{
    var isSrch = false;
    if(obj)
    {
         isSrch =  (getCustomAttribute(obj,_AttribSrchFld)=="1")?true:false;
    }
    return isSrch;
}

function _isSpecialCaseField(obj)
{
    var isSpCase = false;
    //alert("_isDescField : \n _AttributeNameIsDescField =  "+ _AttributeNameIsDescField);
    if(obj)
    {
        //alert("_isDescField : \n " +  getCustomAttribute(obj,_AttributeNameIsDescField));

        isSpCase =  (getCustomAttribute(obj,_AtrrributeSpecialCase)=="1")?true:false;
    }
    return isSpCase;
}

function _isNotesField(obj)
{
    var isSpCase = false;
    //alert("_isDescField : \n _AttributeNameIsDescField =  "+ _AttributeNameIsDescField);
    if(obj)
    {
        //alert("_isDescField : \n " +  getCustomAttribute(obj,_AttributeNameIsDescField));

        isSpCase =  (getCustomAttribute(obj,_AtrrributeIsNotesComp)=="1")?true:false;
    }
    return isSpCase;
}

function _isChangeFieldNotify(obj)
{
    var isCGNtfy = false;
    //alert("_isDescField : \n _AttributeNameIsDescField =  "+ _AttributeNameIsDescField);
    if(obj)
    {
        //alert("_isDescField : \n " +  getCustomAttribute(obj,_AttributeNameIsDescField));

        isCGNtfy =  (getCustomAttribute(obj,_AtrrributeIsChangeFieldNotify)=="0")?false:true;
    }
    return isCGNtfy;
}

function _getDescCodeField(objDesc)
{
    var isDesc = _isDescField(objDesc);

    if(isDesc==true)
    {
        var codeHTMLID = objDesc.id.toString().replace(_FIELDS_SEPERATOR + "desc","");
        //alert("codeHTMLID "  + codeHTMLID);
        var objCode = getElemnt(codeHTMLID);
        return objCode;
    }

    return null;
}

////Tracker#: 18111 MATERIAL PROJECTION - CANNOT CHANGE THE MATERIAL ONCE YOU SAVE THE PROJECTION
//following api can be used to get the anchor and the anchor hidden fields
//by passing one object can be get the refere pointer of other
function _getLinkField(objHdnLink)
{
	if(objHdnLink && objHdnLink.id)
	{
		return getElemnt(objHdnLink.id + _LINK_ID_SUFFIX);
	}
	
	return null;
}

function _getLinkHiddenField(objLink)
{
	if(objLink && objLink.id)
	{
		var lnkid = objLink.id.substring(0, objLink.id.length-_LINK_ID_SUFFIX.length);
		//alert("lnkid " + lnkid);
		return getElemnt(lnkid);
	}
	
	return null;
}

function toggleCollapExpand(objId, divId, imgSrcExp, imgSrcColps, mainDivid)
{
    var objCont = getElemnt(divId);
    var obj = getElemnt(objId);
    var mainDivObj = getElemnt(mainDivid);

    if(obj && objCont)
    {
    	/**
		Tracker#: 14332 SLIDER TO WORK ON SAFARI BROWSER
		Getting the slider object
		*/
        if(mainDivObj)
        {
            var objSlider = getElemnt(mainDivid + "_title2_DIVSlider");
        }

        if(objCont.style.visibility=="visible" ||  objCont.style.visibility.toString().length==0)
        {
            objCont.style.display = "none";
            objCont.style.visibility = "hidden";
            obj.src = imgSrcColps;
            /**
			Tracker#: 14332 SLIDER TO WORK ON SAFARI BROWSER
			For other browser than IE the toggleDisplayVisible function will hide and
			unhide the slider and _setContainerHeightForSlider will set the container height
			so that on the hide and unhide of the data div
			other data divs move up and down accordingly
			*/
            if(!IE)
            {
            	/* Tracker#: 19807 - LEFT NAVIGATION NEEDS TO BE MADE COLLAPSIBLE
            	 * Removed call to toggleDisplayVisible to hide slider as it is unnecessary,
            	 * since containing ancestor element, objCont, has display:none.
            	 */
            	 if(objSlider)_setContainerHeightForSlider(mainDivObj, 1);
            }
        }
        else
        {
            objCont.style.display = "block";
            objCont.style.visibility = "visible";
            obj.src = imgSrcExp;
           /**
			Tracker#: 14332 SLIDER TO WORK ON SAFARI BROWSER
			For other browser than IE the toggleDisplayVisible function will hide and
			unhide the slider and _setContainerHeightForSlider will set the container height
			so that on the hide and unhide of the data div
			other data divs move up and down accordingly
			*/
            if(!IE)
            {
                if(objSlider)_setContainerHeightForSlider(mainDivObj);
                /* Tracker#: 19807 - LEFT NAVIGATION NEEDS TO BE MADE COLLAPSIBLE
            	 * Removed call to toggleDisplayVisible to show slider as it is unnecessary
            	 * since the call to toggleDisplayVisible to hide slider has been removed.
            	 * Also, showing the slider here would sometimes undo the hiding of the
            	 * slider by toggling left nav.
            	 */
            }
        }
    }
}
/**
	Tracker#: 14332 SLIDER TO WORK ON SAFARI BROWSER
	This method will set the container height
	so that on the hide and unhide of the data div
	other data divs move up and down accordingly
*/
function _setContainerHeightForSlider(objCont, defHt)
{
    if(objCont)
    {
        var lstChldNodes = objCont.childNodes;
        try
        {
            var ht = 0;
            if(defHt && !isNaN(defHt))ht += parseFloat(defHt);
            if(lstChldNodes.length)
            {
                for(i=0;i<lstChldNodes.length;i++)
                {
                    var obj = lstChldNodes[i];
                    if(obj && obj.offsetHeight);
                    {
                        ht += parseFloat(obj.offsetHeight);
                    }
                }
                if(ht>0)
                {
                    objCont.style.height = ht+"px";
                }
            }
        }
        catch(e){}
    }
}


function toggleDisplayVisible(obj, isDisplayVisible)
{
    if(obj)
    {
        if(isDisplayVisible==true)
        {
            obj.style.display = "block";
            obj.style.visibility = "visible";
        }
        else
        {
            obj.style.display = "none";
            obj.style.visibility = "hidden";
        }
    }
}

//since 2009R4 aug 30 fixpack Tracker#:12564
/// generic function to make the dropdown control readonly
function _setSelReadOnly(selId, isReadOnly)
{
    //alert(" _setSelReadOnly called \n selId = " + selId);
    var obj = getElemnt(selId);
    //alert(" boj "+ obj + "\n isReadOnly "+ isReadOnly);
    if(obj)
    {
        if(isReadOnly==true)
        {
            obj.style.readOnly = true;
            obj.className = "clsSelectReadOnly";
            obj.disabled = true;

        }
        else
        {
            obj.style.readOnly = false;
            obj.className = "clsSelectNormal";
            obj.disabled = false;
        }
        alert(obj.outerHTML);
    }
}

//Tracker#:12867 - OUTSTANDING TECH SPEC>MASS REPLACE ISSUES
//generic function to make the textbox readonly
function _setInputTextReadOnly(txtId, isReadOnly)
{
    //alert(" _setSelReadOnly called \n selId = " + selId);
    var obj = getElemnt(txtId);
    //alert(" boj "+ obj + "\n isReadOnly "+ isReadOnly);
    if(obj)
    {
        if(isReadOnly==true)
        {
            obj.style.readOnly = true;
            obj.className = "clsTextReadOnly";
            obj.disabled = true;
        }
        else
        {
            obj.style.readOnly = false;
            obj.className = "clsTextNormal";
            obj.disabled = false;
        }
        //alert(obj.outerHTML);
    }
}

function hideActButtons(tabId, parentId, chkVrtlCont)
{
    //window.status = "hideActButtons : parentId"+ parentId +" tabId " + tabId + "chkVrtlCont = " +chkVrtlCont;
    //window.status = "tabId " + tabId + "\n chkVrtlCont " + chkVrtlCont;
    var vrtId = parentId +"virtual";
	//alert("hideActButtons ;" + parentId +"virtual");
	var objDiv = getElemnt(vrtId);
	//alert("hideActButtons: objDiv " + objDiv);
	if(objDiv)
	{
	    //if the cursor is on virtual div then don't hide
	    if(chkVrtlCont==true)
	    {
	        window.setTimeout("hideActButtons('"+tabId+"','"+ parentId+"',false)",150);
	    }
	    else
        {
            var closeDiv = true;
            var objSrcEl = srcElmnt;
	        //alert("tabId -> "+ tabId +"\n objSrcEl "+ objSrcEl.outerHTML);

	        while(objSrcEl)
	        {
	            //alert("objSrcEl id-> "+ getCustomAttribute(objSrcEl,"id"));
	            //alert("tabId -> "+ tabId +"\n "+ objSrcEl.outerHTML);
	            if( (objSrcEl.id) && (tabId==objSrcEl.id || vrtId==objSrcEl.id) )
	            {
	                closeDiv = false;
	                objSrcEl = null;
	            }
	            else
	            {
	                objSrcEl = objSrcEl.parentNode;
	            }
	        }

            //alert("close value " + closeDiv);
            if(closeDiv)
            {
                //alert("here closing");

                toggleDisplayVisible(objDiv, false);
                //alert("before removing child");
                document.body.removeChild(objDiv);
                //Tracker#: 14269 DOCUMENT NAME IN COMPOSITE BUILDER OVERLAPPED ON DROP DOWN LIST
                //if the menu is closed then the dropdown should be shown
                
            }
            else if(IE || ($.browser.mozilla) || $.browser.safari)
            {
            	//Tracker#:22502 - DROP DOWN MENUS SHOULD DISAPPEAR ON SELECTION OF A MENU
            	window.setTimeout("hideActButtons('"+tabId+"','"+ parentId+"',false)",750);
            }
        }
		//alert("removed");
	}

}

function showChildActionButtons(obj, tabId, chldActBtnsdivId,chldbtnsPosition)
{
	//alert("showChildActionButtons : " );
    var chldbtnsPos=0;
    if(chldbtnsPosition)
    {
    	chldbtnsPos=chldbtnsPosition;
    }
    _mmove();
    //alert("showChildActionButtons : " );
    if(chldActBtnsdivId)
    {
        var objCont = getElemnt(chldActBtnsdivId);
        //alert("ojbCont: "+objCont + "\n chldActBtnsdivId = " +chldActBtnsdivId);
        //alert("showChildActionButtons : chldActBtnsdivId " + chldActBtnsdivId);
        if(objCont)
        {
            var blnShow = true;

            if(objCont.style.visibility == "visible")
            {
                blnShow = false;
            }
            //toggleDisplayVisible(objCont, blnShow);
            var objDiv = getElemnt(getCustomAttribute(objCont,"id")+"virtual");
			//alert("objDiv "  + objDiv);
            if(objDiv)
            {
                //alert("here hide");

                toggleDisplayVisible(objDiv, blnShow);
                objDiv.innerHTML = "";
                document.body.removeChild(objDiv);
                //alert("objDiv.outerHTML \n " + objDiv.outerHTML);
            	//Tracker#: 14269 DOCUMENT NAME IN COMPOSITE BUILDER OVERLAPPED ON DROP DOWN LIST
            	//If we click on the MoreAction button first time the dropdown opens and the dropdown
            	// below the dropdown menu is hidden and on again clicking the MoreAction button the 
            	//dropdown menu is hidden and  the dropdown will be again shown.
            	
            }
            else
            {
                if(!objDiv) objDiv = _getUserWindow(getCustomAttribute(objCont,"id")+"virtual","");
                //alert("objDiv "  + objDiv);
                if(objDiv)
                {
                    //alert("showChildActionButtons: objDiv -> " + objDiv);
                    //alert("objDiv " + objDiv.outerHTML);
                    //alert("objDiv .id " + getCustomAttribute(objCont,"id")+"virtual");
                    if(blnShow)
                    {
                        var scrLft = 0;
                        var scrTop = 0;
                        var objWrkArea =  getElemnt("_divWorkArea");

                        if(objWrkArea)
                        {
                            //alert("objWrkArea.scrollLeft " + objWrkArea.scrollLeft);
                            scrLft = parseInt(objWrkArea.scrollLeft);
                            scrTop = parseInt(objWrkArea.scrollTop);
                        }

                        //toggleDisplayVisible(objCont, blnShow);
                        objDiv.innerHTML = objCont.innerHTML;
                        objDiv.style.top = parseInt(_findPosY(objCont)) + chldbtnsPos - scrTop + "px";
                        objDiv.style.left = parseInt(_findPosX(objCont)) - scrLft + "px";
                        //alert(" : objDiv.style.top " +objDiv.style.top + "\nobjDiv.style.left " +objDiv.style.left);
                        objDiv.style.zIndex = 999;
                        objDiv.onmouseout = function(evt){hideActButtons(tabId,chldActBtnsdivId, true);};
                        toggleDisplayVisible(objDiv, blnShow);

                    }
                }
            }
            //alert("objCont.parentNode.style.top " + _getComponentTop(objCont) + "\n objCont.parentNode.style.left " + _getComponentLeft(objCont));
            //alert("showChildActionButtons : objCont \n" + objCont.outerHTML);
        }
    }
    
}


function _findPosX(obj) {
    var curleft = 0;

    if(obj && obj.style.visibility=="hidden")
    {
        obj = obj.parentNode;
    }

    if (obj.offsetParent) {
        while (1) {
            curleft+=obj.offsetLeft;
            if (!obj.offsetParent) {
                break;
            }
            obj=obj.offsetParent;
        }
    } else if (obj.x) {
        curleft+=obj.x;
    }
    return curleft;
}

function _findPosY(obj) {
    var curtop = 0;

    if(obj && obj.style.visibility=="hidden")
    {
        obj = obj.parentNode;
    }

    if (obj.offsetParent) {
        while (1) {
            curtop+=obj.offsetTop;
            if (!obj.offsetParent) {
                break;
            }
            obj=obj.offsetParent;
        }
    } else if (obj.y) {
        curtop+=obj.y;
    }
    return curtop;
}


//pl use the  the function _findPosX instead of  _getComponentLeft
function _getComponentLeft(obj)
{
	if(obj)
	{
		return ($(obj).offset().left);
	}
}

//pl use the  the function _findPosY instead of  _getComponentLeft
//Tracker#: 17653 MATERIAL QUOTE SMART TAG OPENS OFF THE PAGE
//Added divObj as a parameter
function _getComponentTop(obj, divObj)
{
	if(obj)
	{
		return ($(obj).offset().top+parseInt($(obj).height()));
	}
}

function _getUserWindow(id, text)
{
	var winhdlr = new createElement("DIV", id);
	winhdlr.innerHTML = text;
	document.body.appendChild(winhdlr);
	return winhdlr;
}


function createElement(tagName, idn)
{
    //var str = "<"+tagName + " " + attrbts +"></"+ tagName+">";
    //alert("createElement: str \n " + str);
    var winBody = document.createElement(tagName);
    //alert("createElement: winBody "  +winBody);
    winBody.id = idn;
    winBody.style.position = "absolute"
    return winBody

}

var scrObj;
var scrollTimer = null;// hold the timer function
var scrollCounter = 0  // number of times the scrollNavDiv called itself
var scrollImgObj;  // img object on the scroller
var scrollObj;  // scroll object
/** Method for scrolling the division
 * 
 * @param e - event object
 * @param scrDirc - direction viewport should move towards
 * @param divId - div that contains the scrollable content
 * @param imgobj - image when clicked calls the scrollDiv function
 */
function scrollDiv(e, scrDirc, divId, imgobj)
{
	if(scrDirc)
	{
		var objDiv = getElemnt(divId);
		//Tracker#: 22589 LEFT NAVIGATION SCROLL DOWN ARROW ON THE SEARCH LIST DOES NOT WORK
		//As there are more element with the same divId so using the getElementsByName function
		//to resolve the Left navigation scroll issue.
		var navScroller = document.getElementsByName(divId);
		if(navScroller)
		{
			for(y=0; y < navScroller.length; y++)
	    	{
				//Visibility property is not avilable so using the below condition to chech 
				//if the offsetHeight is greater than 0 or not.
	    		if(navScroller[y].offsetHeight > 0)
	    		{
	    			objDiv = navScroller[y];
	    		}
	    	}
		}
		if(objDiv)
		{
		    scrollImgObj = imgobj
		    scrollObj = objDiv;
            var objDivHgtPix = objDiv.offsetHeight * .8;
			//alert("here \n " + objDiv.scrollTop);
			var nMilliSec = 100;  // one sec
			
            objDivHgtPix = parseInt(objDivHgtPix / 10) * 10;  // even
            
            objDivHgtPix = objDivHgtPix / 10;   // # of pixels to ne moved within a sec
            scrollCounter = 0;
            scrollTimer = setTimeout("scrollNavDiv('"+scrDirc+"', " + objDivHgtPix + ")",100);
		}
	}
	
	/* Tracker#: 20322 - SAFARI BROWSER: SCROLL ON LEFT NAVIGATION DOES NOT WORK
	 * Issue - onclick of the button image:  function toggleCollapExpandNavigator
	 * in navigation.js is being fired after scrollDiv function.
	 * toggleCollapExpandNavigator changes dimensions of left navigation (among other
	 * things), which can remove the scroll of the scrolling div, thus resetting
	 * the scrolltop.
	 * 
	 * Fix - stop click event propagation so toggleCollapExpandNavigator does not fire. 
	 */
	if (e.stopPropagation)
	{
		e.stopPropagation();
	}
	if (IEVer == 8)
	{
		e.cancelBubble = true;
	}
}

// function to move the data within a div. Works in conjunction with scrollDiv func.
function scrollNavDiv(srcDirc, movepx)
{
	
    if(srcDirc == "moveup")
    {
        // create scrolling effect
        scrollObj.scrollTop = 	scrollObj.scrollTop - movepx;  // move up 80% of the original height
        // top of the data div so switch the image to non-active
        if (scrollObj.scrollTop == 0)
        {
            scrollImgObj.src = 'images/scroll-up.jpg';
        }
        else //active image
        {
            scrollImgObj.src = 'images/scroll-up-act.jpg';
        }

    }
    else if(srcDirc == "movedown")
    {
        scrollObj.scrollTop = 	scrollObj.scrollTop + movepx;  //move down 80% of the original height

        // end of the data div soso switch the image to non-active
        if ((scrollObj.scrollTop + scrollObj.offsetHeight) < scrollObj.scrollHeight)
        {
            scrollImgObj.src = 'images/scroll-down-act.jpg';
        }
        else // active image
        {
            scrollImgObj.src = 'images/scroll-down.jpg';
        }
    }
    // function has to complet within a sec and it is being repeated every 100 milli secs
    if (scrollCounter != 10)
    {
         scrollCounter++;
         scrollTimer = window.setTimeout("scrollNavDiv('"+srcDirc+"', " + movepx + ")",100);
    }
}



function scrollDivLeftRight(objId, imgsrclftactive, imgsrclftinactive, imgsrcrtactive, imgsrcrtinactive, divId, scrlDirection)
{

	if(scrlDirection && divId)
	{
		var objDiv = getElemnt(divId);
	    if(objDiv)
	    {
	    	//alert("objDiv.scrollWidth > objDiv.offsetWidth " + objDiv.scrollWidth + "> " + objDiv.offsetWidth + "\n " +  (parseInt(objDiv.scrollWidth) > parseInt(objDiv.offsetWidth)));
	    	var nscrl=parseInt(objDiv.offsetWidth);
	    	nscrl=nscrl*.8;
	    	var obj = getElemnt(objId);
	    	if( obj && ((parseInt(objDiv.scrollWidth) > parseInt(objDiv.offsetWidth)) == true))	// there is scroll bar
	    	{
	    		var invokescroll = false;

			    if(scrlDirection == "moveleft")
			    {
			        objDiv.scrollLeft =  objDiv.scrollLeft+ nscrl;
			        obj.src =  imgsrclftactive;
			        invokescroll = true;
			    }
			    else if(scrlDirection == "moveright")
			    {
			       objDiv.scrollLeft =  objDiv.scrollLeft - nscrl;
			       obj.src =  imgsrcrtactive;
			       invokescroll = true;
			    }

			    var objscrLft = getElemnt(divId + "_left");
			    var objscrRt = getElemnt(divId + "_right");

			    if(objscrLft && objscrRt)
			    {
			    	if((objDiv.scrollLeft+objDiv.offsetWidth)<objDiv.scrollWidth)
				    {
				    	objscrRt.src = 	imgsrcrtactive;
				    }

				    if(objDiv.scrollLeft>0)
				    {
				    	objscrLft.src = imgsrclftactive;
				    }

				    if( (objDiv.scrollLeft+objDiv.offsetWidth)==objDiv.scrollWidth)
				    {
				    	objscrLft.src = imgsrclftactive;
				    	objscrRt.src = 	imgsrcrtinactive;
				    	invokescroll = false;
				    }
				    else if(objDiv.scrollLeft==0)
				    {
				    	objscrLft.src = imgsrclftinactive;
				    	objscrRt.src = 	imgsrcrtactive;
				    	invokescroll = false;				    }

			    }
			    /*
			    if(invokescroll)
			    {
		   	 		scrObj = window.setTimeout("scrollDivLeftRight('"+objId+"','"+imgsrclftactive+"','"+imgsrclftinactive+"','"+imgsrcrtactive+"','"+imgsrcrtinactive+"','"+ divId+"','"+ scrlDirection+"')",10);
		   	 	}
		   	 	*/
	   	 	}
		}
	}
	else if(scrObj)
	{
		window.clearTimeout(scrObj);
	}
}

function removeAttribute(obj, attName)
{
    if(obj && obj.getAttribute(attName))
    {
        obj.removeAttribute(attName);
    }
}

function setAttribute(obj, attName, attValue)
{
    removeAttribute(obj, attName);
    obj.setAttribute(attName, attValue);
    // Does not work on FireFox.
    try
    {
        eval("obj."+attName+"='"+attValue+"'");
    }
    catch(e)
    {
    }
}

function getCustomAttribute(obj, attName)
{
    //alert("getCustomAttribute \n attName" + attName);
    if(obj && obj.getAttribute(attName))
    {
    	//alert("getCustomAttribute: \n obj.getAttribute('"+attName+"') = " + obj.getAttribute(attName));
        return obj.getAttribute(attName);
    }
    return null;
}


function toggelDetailCheckboxSelect(obj, chkboxid, sIndex, prefix)
{
    if(typeof(prefix)=='undefined' || !prefix)prefix="";
    if(obj && chkboxid)
    {
        var chkSelected = false;
        var isSelected = obj.checked;
        var i=sIndex;
        var objchk = getElemnt(chkboxid + i + prefix);
        //alert(chkboxid + i + prefix  +"\n objchk " + objchk);
        while(objchk)
        {
            chkSelected = true;
            objchk.checked = isSelected;
            if(objchk.onclick)objchk.onclick();
            objchk = getElemnt(chkboxid + i++ + prefix) ;

            //fore testing purpose to chech the changefields
            //var docViewid = _getCompDocViewId(objchk);
            //var objHtmlData = _getAreaHTMLDataObjByDocView(docViewid);
            //if(objHtmlData) alert("changefields " + objHtmlData.getChangeFields());
        }

        //alert("chkSelected " + chkSelected);
        //for some cases its not possible to get the checkbox
        if(!chkSelected)
        {
            var objTable = obj;
            //find the table
            while(objTable.tagName.toUpperCase()!="TABLE")
            {
                objTable = objTable.parentNode;
                //alert("objTable.tagName.toUpperCase() " + objTable.tagName.toUpperCase());
            }

            if(objTable)
            {
                var tr;
                var trCol = objTable.getElementsByTagName("tr");
                
                var isPLMPOM = toggelDetailCheckboxSelect.checkifPLMPOM();
                //Tracker#:21754 - FR06 - SPLIT DELIVERIES FROM ONE TO MANY WITHIN A PURCHASE ORDER
                //Identifying the row index of htmltable row for making the check boxes selected
                var frzRw = (objTable.getAttribute("frzRw"))?parseFloat(objTable.getAttribute("frzRw")):1;
                
                if(trCol)
                {
                    var i;
                    var cnt;

                    cnt = trCol.length;
                    //alert("cnt "  +cnt);

                    //cnt = 6; //for testing
                    for(i=frzRw;i<cnt;i++)
                    {
                        var row = trCol.item(i);
                    	selectTDChkBox(row, isSelected);
                        if (isPLMPOM && row.firstChild) // non-first row of rowspans don't have tds
                        {
                        	multiRowDragDrop.notify({
            					eventType : (isSelected) ? 'row.checked' : 'row.unchecked',
            					rowIndex : row.rowIndex
            				});
                        }
                    }
                }
            }
        }
    }
}
/* Tracker#: 19598 - DRAG AND DROP MULTIPLE ROWS IN THE POM SCREEN
 * Notify multiRowDragDrop module that checkboxes are being checked/unchecked.
 */
toggelDetailCheckboxSelect.checkifPLMPOM = function () {
	var $dataWorkArea = $('#_divWorkArea');
	var isAddPomOpen = false; // is Add POM Popup open
	if ($dataWorkArea.length > 0)
	{
		var docviewid = $dataWorkArea.attr('docviewid'); 
		var $popup = $('#_usersPopUpDiv');
		if ($popup.length > 0)
		{
			isAddPomOpen = ($('#PomSizeGrade').length > 0) ? true : false;
		}
		return (docviewid === '12701' && !isAddPomOpen) ? true : false;
	}
	return null;
};

//focusDetailRowCheckBoxSelect(obj, repeatInd)
function fDRCSel(obj, repeatInd, tblName, ignoreSpecialCase)
{
    //alert("focusDetailRowCheckBoxSelect called");
     if(obj)
     {
        //alert("obj \n " + obj.outerHTML);
        //since title and data are in the same table, increment the repeat  count by 1
        //as the first row it represents the header lables.
        repeatInd++;
        var objTbl;
        var trCol;

        //alert("tblName " + tblName + "\n " + document.getElementById(tblName));

        if(tblName) objTbl = getElemnt(tblName);

        if(objTbl)
        {
            // Tracker#: 14349 SYNCH POM TO FIT EVALUATION LOCKED SAMPLE
            // Special Case as the Data rows start from 3rd Row and not the
            // usual 2nd Row.
            // Ex: Fit Evaluation Screen.
            var frzRw1 = (objTbl.getAttribute("frzRw"))?parseFloat(objTbl.getAttribute("frzRw")):0;
            repeatInd = repeatInd + frzRw1;

            //alert("ignoreSpecialCase " + ignoreSpecialCase);
            if(ignoreSpecialCase!=true)
            {
                //alert("entered special");
                var trIndx = getChkIndexVal(objTbl);

                if(trIndx>-1)
                {
                   var oldrepeatInd = repeatInd;
                   repeatInd = ((repeatInd-1)*trIndx)+repeatInd;
                   //alert("oldrepeatInd " + oldrepeatInd + "\n new repeatInd " + repeatInd);
                }
            }
            trCol = objTbl.getElementsByTagName("tr");

            //alert("trCol.length " + trCol.length);

            if(trCol && trCol.length>repeatInd && trCol.item(repeatInd))
            {
                //get the tr object
                //alert("got the tr");
                obj = trCol.item(repeatInd);
            }
        }
        else
        {
            //alert("entered while");
            while(obj.tagName.toUpperCase()!="TR")
            {
                   obj = obj.parentNode;
            }
        }

        if(obj)
        {
           selectTDChkBox(obj, true);
        }
     }
}

function trOver(tblName, rowSelIndx, rowClrIndx)
{
    trOut(tblName, rowClrIndx);
    //alert("tr over \n rowSelIndx = " +rowSelIndx);
    getElemnt(tblName).getElementsByTagName('tr').item(rowSelIndx).style.background='#F4EDAD';
}

function trOut(tblName, rowClrIndx)
{
   getElemnt(tblName).getElementsByTagName('tr').item(rowClrIndx).style.background='#FFFFFF';
}

function getChkIndexVal(objTbl)
{
    var retVal = -1;
    //alert("getChkIndexVal:");
    if(objTbl)
    {
        //alert("objTbl \n" + objTbl.toHTML);
        var keyInfo = getKeyInfo(objTbl);

        if(keyInfo!=null)
        {
            var key = "chkIncrRowNum=";
            var l = parseInt(keyInfo.toString().indexOf(key));
            //alert("l = " + l);
            if(l!=-1)
            {
                retVal = keyInfo.toString().substring(parseInt(key.length)+l,(keyInfo.toString().length));
                //alert("retVal = "+ retVal);
            }
        }
    }
    return retVal;
}

function selectTDChkBox(tr, isSelected)
{
    if(tr)
    {
       //alert("tr got \n " + tr.outerHTML);
        var td = tr.getElementsByTagName("td");
        if(td && td.item(0))
        {
            //get the first td
           td = td.item(0);

           //alert("firt td go \n " + td.outerHTML);
           var objchk = td.getElementsByTagName("INPUT");

           if(objchk && objchk.item(0) && objchk.item(0).type.toUpperCase()=="CHECKBOX")
           {
             objchk = objchk.item(0);
             //alert("chk got \n "+ objchk.outerHTML);
             objchk.checked = isSelected;
             //alert("objchk ");
             if(objchk.onclick)objchk.onclick();
             //alert("after click ");
             return true;
           }
        }
    }
    return false;
}

function freezeComp(title_id, data_id, title_div, data_div, title_table, data_table, secDivid)
{
    //alert("here");
    var objDiv = getElemnt(secDivid);

    if(objDiv)
    {
        var objDisplay = objDiv.style.display;

        if(objDisplay == "none")
        {
            objDiv.style.display = "block";
        }
        freeze(title_id, data_id, title_div, data_div, title_table, data_table);

        if(objDisplay == "none")
        {
            objDiv.style.display = "none";
        }
    }
}

//function to handle section splitter  functionality
function horizontalSplitterOver(obj, scrXId)
{
	if(obj)
	{
		obj.style.cursor="E-resize";
		srcX = getElemnt(scrXId);
		if(srcX)srcX.value = window.event.clientX;
	}
}

function horizontalSplitterOut(obj, scrXId)
{
	if(obj)
	{
		obj.style.cursor="default";
		srcX = getElemnt(scrXId);
		if(srcX)srcX.value = 0;
	}
}

function horizontalSplitterResize(obj, scrXId, td1Id, td2Id)
{
    var srcXObj = getElemnt(scrXId);
    var srcX = 0;

    if(srcXObj && srcXObj.value) srcX = parseInt(srcXObj.value);

    var tdlft = getElemnt(td1Id);
    var tdrt =  getElemnt(td2Id);
    //window.status = "srcX = " +srcX;
	if(obj  && srcX>0 && tdlft && tdrt)
	{
		obj.style.cursor="E-resize";

		var diff = srcX - window.event.clientX;
        //window.status += "window.event.clientX  " + window.event.clientX + "   diff = " +diff;
		//var tbl = obj.parentElement;

		//while(tbl.tagName!="TABLE")
		//{
		//	tbl = tbl.parentElement;
		//}

		//var trobj = tbl.rows(0);;
		//var tdlft = trobj.cells(0);
		//var tdrt = trobj.cells(2);

		//window.status = diff + "  lft  " + tdlft.offsetWidth + ' -  ' + parseInt(tdlft.offsetWidth-diff) + '    rt =  '+ tdrt.offsetWidth + ' -  ' + (parseInt(tdrt.offsetWidth)+diff );
		//window.status = tdrt.outerHTML;


		var lf = parseInt(tdlft.offsetWidth-diff);
		var rt = parseInt(tdrt.offsetWidth) + diff

		//window.status += '  --- diff  lft   ' + tdlft.offsetWidth + '      rt =  '+ tdrt.offsetWidth + ' -  total ' + parseInt(tdrt.offsetWidth+ tdlft.offsetWidth) ;

		//var divLft = tdlft.getElementsByTagName("DIV").item(0);

		//setWidth(divLft, lf);

		//var divRt = tdrt.getElementsByTagName("DIV").item(0);
		//setWidth(divRt, rt);

		setWidth(tdlft, lf);
		setWidth(tdrt, rt);

		srcXObj.value = window.event.clientX;

	}
}

//Used in naming clipboard
function getDateTime()
{
       var now = new Date();
       var hour        = now.getHours();
       var minute      = now.getMinutes();
       var second      = now.getSeconds();
       var monthnumber = now.getMonth();
       var monthday    = now.getDate();
       var year        = now.getFullYear();
       var ampm="AM";
       if((hour == 12) && minute > 0)
       {
         ampm="PM";
       }
       else if((hour == 12) && minute == 0 && second >0)
       {
         ampm="PM";
       }
       else if(hour > 12 )
       {
       	 hour=hour -12;
         ampm="PM";
       }else if(hour ==0 )
       {
       	 hour=12;
       }
       var datetime=(monthnumber+1)+"/"+monthday+"/"+year+" "+hour+":"+minute+" "+ampm;

       return datetime;
}

function imageChange(obj,image){
	obj.src=image;
}

function _setMousePointer(obj, pointerType)
{
	if(obj && pointerType)
	{
		obj.style.cursor = pointerType;
	}
}

function _setHandMousePointer(obj)
{
	_setMousePointer(obj, "Hand");
}

function _clearMousePointer(obj)
{
	_setMousePointer(obj, "pointer");
}

function _notifyChangeFields(obj, dataType,donotset)
{
	//alert(notset);
    if(donotset)
    {
    	return true;
    }
    //alert('here');
    if(obj)
    {
        if ((obj.type != 'select-one') && (dataType==_DATA_TYPE_VARCHAR) && !(getCustomAttribute(obj, _AttributeChangeCase)) )
        {
            u(obj);
        }

        //alert("obj.tagName.toUpperCase() " + obj.tagName.toUpperCase());
       //alert("_isNotesField(obj)" + _isNotesField(obj));
        ////////Tracker#: 13091  SPECIAL CHARACTERS NOT DISPLAYED ON BOM SCREEN
        if ((obj.tagName.toUpperCase()=="TEXTAREA" || obj.type == 'text' || _isNotesField(obj)) && !_isSpecialCaseField(obj))
        {
            //alert("inside ");
            if (obj.value.indexOf('"') != -1)
            {
                //alert(szMsg_Double_Quote);   // double quote not allowed
                var errObj = new htmlErrors();
                errObj.addWarning(szMsg_Double_Quote);
                objMsgDiv = new messagingDiv(errObj);
                obj.value = "";
                return;
            }
            
            /*if (obj.value.indexOf('_') != -1)
            {
                //alert(szMsg_Double_Quote);   // underscore not allowed
                var errObj = new htmlErrors();
                errObj.addWarning("Underscores are not allowed.");
                objMsgDiv = new messagingDiv(errObj);
                obj.value = "";
                return;
            }

            if (obj.value.indexOf(',') != -1)
            {
                //alert(szMsg_Double_Quote);   // Comma not allowed
                var errObj = new htmlErrors();
                errObj.addWarning("Comma  are not allowed in the field. ");
                objMsgDiv = new messagingDiv(errObj);
                obj.value = "";
                return;
            }*/
        }
        //Tracker#: 15018 - TO ADDRESS MEMOTY LEAK ISSUES IN NEW VALIDATION AND MESSAGING FRAMEWORK
        // validate the date modified
        if (dataType==_DATA_TYPE_DATE)
        {
            if(!_vdPLM(obj))
            {
                return;
            }
        }

        var docViewid = _getCompDocViewId(obj);
        if(docViewid!=null)
        {
            //alert("docViewid  "+docViewid);
            objHtmlData = _getAreaHTMLDataObjByDocView(docViewid);

            if(objHtmlData)
            {
                //alert("objHtmlData  "+objHtmlData);
                var isDescFld = _isDescField(obj);

                //alert("isDescFld  "+isDescFld);
                if(isDescFld==true)
                {
                    if(obj.tagName.toUpperCase()=="SELECT")
                    {
                        var value = obj.selectedIndex != -1 ? obj.options[obj.selectedIndex].value : null;
                        //alert("setting code field");
                        obj = _getDescCodeField(obj);
                        if(obj)obj.value = value;
                        //alert("appending code changefields \n"+obj.outerHTML);
                    }
                    else
                    {
                        obj = _getDescCodeField(obj);
                    }
                }
				//Tracker#: 18869 -ADVANCED SEARCH SCREEN VALIDATION FIELDS NOT GETTING NOTIFIED WITH CHANGES
                //checking whether the obj is a adv search field or not  
               	 var isSrchFld=_isSearchField(obj);                
			
				//ST#:16711 BOMC CREATES COMPONENT LINE AFTER DISPLAYING AN ERROR MESSAGE
	            // Onchange is triggered only when:
	            // -user types in a value on a aempty field
	            // -user removes a already existing value and makes it blank
	            // -changes a existing value to another value 
	            // Onchange should no fire for: 
	            // - when user types in invalid value on a empty field 
                //Tracker#: 18869 -ADVANCED SEARCH SCREEN VALIDATION FIELDS NOT GETTING NOTIFIED WITH CHANGES
                //Added condition check for search field also so that the obj is added to the list of changed fields when it si from adv search.
				//Tracker#:19511 - REGRESSION - PROJECTIONS - DETAIL SECTION SLIDER IS MOVED TOO FAR TO THE RIGHT
               	 // While doing a fill up/fill down the data change isnot getting notified. Added check for obj.defaultValue.length > 0
               	 //Tracker#;19674: REGRESSION : BLANK NEW LINE IS CREATED ON BOMC ASSOCIATION.
               	 // Removed the condition, obj.defaultValue.length > 0. 
               	/**
               	 * Tracker#:24409 ARTWORK LIB - COMBO- MATERIAL VANISHES ON SAVE AFTER SELECTING FROM VALIDATION POP UP
               	 *  Removed  the code obj.defaultValue as this used to return blank value.
               	 */
               	
               	 //Tracker#:22601 REGRESSION ON SAFARI/FIREFOX BROWSERS: CANNOT REMOVE DATA FROM VALIDATED FIELDS AND SAVE
               	//Custom attribute cannot be accessed directly in safari browser, should go through attribute only. 
               	var defValue = getCustomAttribute(obj, "defaultValue");
               	
                if(defValue!=null && defValue != 'undefined')
                {
                	if (isSrchFld || !isDescFld || (isDescFld && defValue.length>0) ||(isDescFld && defValue.length==0 && obj.value.length>0) )
                    	objHtmlData.addToChangedFields(obj);
                }
                else
                {
                	// ST#19106: BOMC CREATES COMPONENT LINE AFTER DISPLAYING AN ERROR MESSAGE
                	// For fields with validations, there will be no defaultValue. 
                	// Tracking onchange notify field in the else block. 
                	objHtmlData.addToChangedFields(obj);
                }               
                      //alert("changefields " + objHtmlData.getChangeFields());
            }
        }
    }
}

function _notifyCheckBoxChangeFields(obj, notifyDataModfd)
{
    // alert(" _notifyCheckBoxChangeFields " +_notifyCheckBoxChangeFields);
    if(obj)
    {
    	//alert("obj \n " + obj.outerHTML);
       var docViewid = _getCompDocViewId(obj);
       //alert("docViewid " + docViewid);
       if(docViewid!=null)
       {
            //alert("_notifyCheckBoxChangeFields: docViewid  "+docViewid);
            objHtmlData = _getAreaHTMLDataObjByDocView(docViewid);
            //alert("objHtmlData " + objHtmlData);
            if(objHtmlData)
            {
				if(obj.checked==true)
                {
                    //alert("appending changefields \n"+obj.outerHTML);
                    objHtmlData.addToChangedFields(obj);
                    //alert("changefields " + objHtmlData.getChangeFields());
                } 
                else
                {
                    //alert("removing changefields \n"+obj.outerHTML);
                    //alert("changefields " + objHtmlData.getChangeFields());
                    objHtmlData.removeFromChangedFields(obj);
                    //alert("changefields " + objHtmlData.getChangeFields());
                }   
                // Tracker#:15883 USING QA CHECKBOX ON FIT EVAL THROWS UNFRIENDLY DATABASE ERROR MESSAGE
				// If checkbox clicked is not a row select checkbox then it is a part of screen and 
				// add this change to changefields list, if checkbox is unchecked set the value to 
				// blank.
            	if(true==notifyDataModfd)
            	{
            		if(obj.checked==false)
            		{
            			obj.value = "";
            			//alert("appending changefields \n"+obj.outerHTML);
                    	objHtmlData.addToChangedFields(obj);
                    	//alert("changefields " + objHtmlData.getChangeFields());
            		}
            		else
            		{
    					//specifically for PLM, where value is coming in as "N" even when checked
    					if (obj.value==null || obj.value=='N' || obj.value=='')
    					{
    						obj.value='on'
    					}
            		}
            	}
            }
       }
    }
}


// Removes leading whitespaces
function _lTrim( value ) {

	var re = /\s*((\S+\s*)*)/;
	return value.replace(re, "$1");

}

// Removes ending whitespaces
function _rTrim( value ) {

	var re = /((\s*\S+)*)\s*/;
	return value.replace(re, "$1");

}

// Removes leading and ending whitespaces
function _trim( value ) {

	return _lTrim(_rTrim(value));

}

function getSrcElement(e)
{
    if (window.event || !e) e = window.event;
    //if(e)alert("e.srcElement "+ e.srcElement);
    var srcE = e.srcElement? e.srcElement : e.target;
    //alert("e " + e + "\n scrE " +scrE);
    return srcE;
}

//Tracker#: 15018 - TO ADDRESS MEMOTY LEAK ISSUES IN NEW VALIDATION AND MESSAGING FRAMEWORK
// added the last parameter szDtFrmt which will have the date format
function showCal(lnkId, txtId, repeatCnt, szDtFrmt)
{
    //alert("showCal called");
    if(cal)
    {
        var objtxt = getElemnt(txtId);

        if(objtxt)
        {
            var dtFmt = szCurFmt;
            if(typeof(szDtFrmt)!='undefined')
            {
                dtFmt =  szDtFrmt;
            }

            //alert("objtxt " + objtxt.outerHTML);
            //szCurFmt = current date format defined in the comfun.js MM/DD/YYYY
            cal.select(objtxt, lnkId, dtFmt, repeatCnt);
            //Tracker#: 17023 OPENING CALENDARS ON SAMPLE REQUEST CREATES PHANTOM SAMPLE REQUEST NUMBERS
            //removed this and moved to calendar.js
            //if(objtxt.onchange)objtxt.onchange();
        }
    }
    return false;
}

//Tracker#: 15018 - TO ADDRESS MEMOTY LEAK ISSUES IN NEW VALIDATION AND MESSAGING FRAMEWORK
//validate current object value to the dataformat
function _vdPLM(fldObj)
{
	if (fldObj.value == '')
		return true;

	//alert("fldObj \n " + fldObj.outerHTML);
    var dateFormat = getCustomAttribute(fldObj, _AttributeDateFormat);
    if(dateFormat==null || typeof(dateFormat)=='undefined')
    {
       dateFormat = szCurFmt;
    }   
    //alert("dateFormat " + dateFormat);
    var objDtFmt = new _htmlDateFormat(fldObj, dateFormat);
	// lenght are not same
    if (fldObj.value.length != dateFormat.length)
	    return _dispDtMsgPLM(objDtFmt, fldObj);
	    
	// going to check the pattern here
	if (!checkPattern(fldObj.value, objDtFmt))
	    return _dispDtMsgPLM(objDtFmt, fldObj);

    // this will set month, year, & day
    setValues(objDtFmt, fldObj.value);

    if (!isValidMD(objDtFmt))
	    return _dispDtMsgPLM(objDtFmt, fldObj);

    return true;
}
//Tracker#: 15018 - TO ADDRESS MEMOTY LEAK ISSUES IN NEW VALIDATION AND MESSAGING FRAMEWORK
// display the user message while validating the date modified data
function _dispDtMsgPLM(objDtFmt, fldObj)
{
    var errObj = new htmlErrors();
    errObj.addWarning(objDtFmt.msg);
    objMsgDiv = new messagingDiv(errObj);
    fldObj.value = "";
}

//Tracker#: 15018 - TO ADDRESS MEMOTY LEAK ISSUES IN NEW VALIDATION AND MESSAGING FRAMEWORK
// date object while will be used while validating the date value
function _htmlDateFormat(fldObj, szCurFrmt)
{
    var obj = null;
    var msg = "";
    var year = "";
    var yearfmt = "";
    var month = "";
    var day = "";
    var szCurFmt = "";
    var tmpmsg = szMsg_Invalid_Date;

    this.obj = fldObj;
    this.szCurFmt = szCurFrmt;
    this.msg = replacevalstr(tmpmsg, "#szCurFmt#", this.szCurFmt);;

    //alert("this.szCurFmt " + this.szCurFmt + "\n msg = "+ this.msg);

    this.year = 0;
    this.month = 0;
    this.day = 0

    //alert("_htmlDateFormat: this.szCurFmt = "+ this.szCurFmt + "\n this.szCurFmt.length " + this.szCurFmt.length);
    // year is 4 or 2 digit
    if (this.szCurFmt.length == 10)
       this.yearfmt = 4;
    else
		this.yearfmt = 2;
	//alert("_htmlDateFormat:  this.yearfmt "+ this.yearfmt);
}

var srcElmnt;
function _mmove()
{
    if (document.all?true:false) // if IE
    {
    document.onmousemove = function(evt){_msmove(evt);};
    document.onclick = function(evt){_msclck(evt);};
}
}

function _msmove(evt)
{
    //alert("_mmove \n evt = \n " + evt);
    //var evt =function(evt){return evt};
    srcElmnt = getSrcElement(evt);
    //alert("srcElmnt " + srcElmnt);
    if(srcElmnt)
    {
        //window.status = "onmousemove " + ((srcElmnt.outerHTML)?(srcElmnt.outerHTML):(scrElmnt.innerHTML));
       // window.status = "onmousemove " + srcElmnt.innerHTML;
    }
 
}

function _msclck(evt)
{
    srcElmnt = getSrcElement(evt);

    if(srcElmnt)
    {
        _hideSmartTagView(srcElmnt);
    }
}

_mmove();
// Tracker#: 17972 - SAFARI/FIREFOX - PLM BOM SMART TAG DOES NOT OPEN AND GIVES ERROR
// Adding anonymous function as event listener was not replacing itself.
// Moving this code next to global function call to _mmove() so event listeners are
// only added once.
if (!(document.all?true:false)) // if NOT IE.  Firefox, Safari
{
	document.addEventListener( 'mousemove', function(evt){_msmove(evt);}, false );
	document.addEventListener( 'click', function(evt){_msclck(evt);}, false );
}

function _hideSmartTagView(sElmnt)
{
   var divSmart = getElemnt("_smartDiv");
   var divEditSmart = getElemnt("_popupDIV");
   if(sElmnt && divSmart)
   {
        var closeDiv = true;
        var objSrcEl = sElmnt;

        if(divSmart.getAttribute("smartDiv")=="1")
        {
        	//alert("divSmart.getAttribute('closeSmartDiv') " +divSmart.getAttribute("closeSmartDiv"));
        	if(divSmart.getAttribute("closeSmartDiv")!="0")
        	{
        		//alert("removed");
            	divSmart.removeAttribute("smartDiv");
            }
            return true;
        }

        while(objSrcEl)
        {
            //alert("objSrcEl id-> "+ objSrcEl.id +"\n divSmart.id "+ divSmart.id);
            if( objSrcEl.id && (divSmart.id==objSrcEl.id || objSrcEl.id=="_popupDIV") )
            {
                closeDiv = false;
                objSrcEl = null;
            }
            else
            {
                objSrcEl = objSrcEl.parentNode;
            }
        }

        //alert("close value " + closeDiv);
        if(closeDiv)
        {
            _closeSmartTag();
        }
   }
}

function _closeSmartTag(chkConfig,smrtDivId)
{
    //alert("close smart tag");
    var divSmart;
    //Tracker#:16082 -ABILITY TO SHARE THE CLIPBOARD WITH OTHER USERS
    //If smrtDivId is passed, identifying the passed value as div id of the smart tag otherwise taking the default value.
    if(smrtDivId)
    {
    	divSmart = getElemnt(smrtDivId);
    }
    else
    {
    	divSmart = getElemnt("_smartDiv");
    }

    if(divSmart)
    {
    	// Tracker#:15784 NEED THE ABILITY TO VIEW MATERIAL LIBRARY INFORMATION FOR A COMPONENT ON THE DESIGN BOM
    	// This check is neccessary, otherwise on printing Material Library screen on SmartTag, PopUp used to
    	// close by _reloadArea method. If the _AttributeDonotCloseSmartDiv is ==1 then return without closing PopUp.
    	if(true==chkConfig)
   		{
			if(divSmart.getCustomAttribute(_AttributeDonotCloseSmartDiv)=="1")
			{
				return;
			}
    	}

        ////////Tracker#:12867 - OUTSTANDING TECH SPEC>MASS REPLACE ISSUES
        /// reset teh changefields information for the smart div container
        /// before closing the container
        var wrkareaObj = _getWorkAreaDefaultObj();

        if(wrkareaObj)
        {
            var objHTMLData = wrkareaObj.getHTMLDataObj();

            if(objHTMLData)
            {
               objHTMLData.removeAllCustomContainerChangeFields("_smartDiv");
            }
        }

        _removeHTMLDiv(divSmart);
        var  divPopup =  getElemnt("_popupDIV");
        if(divPopup)
        {
           _removeHTMLDiv(divPopup);
        }
    }

}
	//##Tracker # 12192 - STYLE SEARCH ON LABDIPS(SUBMITS)
	// New parameters custom and keyInfo added.
function _showSmartTagView(htmlfldName, objImg, tagDocId,tagDocVwId,custom,keyInfo,actCompId)
	{
	    //Tracker#: 16410 SMART TAG ON BOMC DOES NOT WORK SINCE THE LAST FIX PACK
	    // changed the flvalue parameter to obj, to avoid js error incase of single quote data
	    var fldValue = getKeyInfo(objImg);
	    //alert("fldValue " + fldValue);
	    //Tracker#:15557 ADD MATERIAL SMART TAG TO MATERIAL NAME FIELD ON ALL SUBMIT SCREENS.
	    //Encode the fieldvalue.
		//fldValue = encodeURIComponent(fldValue);
		//Tracker# 15585- TSR-509 DRAG COLOR AND ARTWORK TO BOM
	    //Passing args to check on focus setting - Changed by Vijay
	    _startSmartTagPopup(htmlfldName,null,null,null,false);
	
	    //alert("htmlfldName " + htmlfldName +"\n fldValue " + fldValue);
	
	    if(actCompId=="")
	    {
	        actCompId = htmlfldName;
	    }
	
	    if (actCompId.toString().indexOf(_FIELDS_SEPERATOR + "desc") != -1)
	    {
	        actCompId = actCompId.toString().replace(_FIELDS_SEPERATOR  + "desc", "");
	        var obj = getElemnt(actCompId);
	
	        //alert("hidden fld htmlfldName " +htmlfldName + "\n obj + "+ obj);
	
	        if(obj)
	        {
	            //alert("obj.value = "+ obj.value);
	            fldValue = obj.value;
	            //Tracker#:15557 ADD MATERIAL SMART TAG TO MATERIAL NAME FIELD ON ALL SUBMIT SCREENS.
	            //Encode the fieldvalue.
	            //fldValue = encodeURIComponent(fldValue);
	        }
	    }
	
	    //alert("htmlfldName " + htmlfldName +"\n fldValue " + fldValue+"\m custom:"+custom);
	
	    // Tracker#: 17972 - SAFARI/FIREFOX - PLM BOM SMART TAG DOES NOT OPEN AND GIVES ERROR
	    // characters such as # were causing problems in URI. Encoding part of the URI causing the problem.
	    //var actCompId = encodeURIComponent(actCompId);
	    //var keyInfo = encodeURIComponent(keyInfo);
	    var url = "smarttag.do?";
	    var objAjax = new htmlAjax();
	    //##Tracker # 12192 - STYLE SEARCH ON LABDIPS(SUBMITS)
	    // New parameters custom and keyInfo passed along with action method.
	    var actionMethod = "AJAXVIEW";
	    if(objAjax)
	    {
	        //alert("actionMethod \n "+ actionMethod);
	        objAjax.attribute().setAttribute("htmlfldName", htmlfldName);
	        //Tracker# 15585- TSR-509 DRAG COLOR AND ARTWORK TO BOM
	        //Setting onFocus identifier -Changed by Vijay
	        objAjax.attribute().setAttribute("htmlfldOnFocus", "0");
	        objAjax.setActionURL(url);
	
	        //Tracker#21579 - Passing all the parameters through ajax object to avoid special character issue
	        objAjax.parameter().add("htmlfldName", actCompId);
	        objAjax.parameter().add("fldValue", fldValue);
	        objAjax.parameter().add("tagDocId", tagDocId);
	        objAjax.parameter().add("tagDocVwId", tagDocVwId);
	        objAjax.parameter().add("custom", custom);
	        objAjax.parameter().add("keyInfo", keyInfo);
	        
	        //Tracker#:18844 ACCESS TO CHANGE TRACKING DATA ON ADVANCE SEARCH SCREEN
	        //If the tagDocId is Change Tracking, then need to append the value of _nRow into the URL.
	        //This is required for the Material Projections screen to identify the row that is selected
	        //by the user.
	        if (tagDocId == '1600')
	        {
	            var selRow = htmlfldName.substring(htmlfldName.lastIndexOf('_@') + 2);
	            selRow = selRow.substring(0, selRow.indexOf('lnk'));
	            //Tracker#21579 - passing _nRow as ajax param to avoid special character issue
	            if (selRow != '-1') objAjax.parameter().add("_nRow", selRow);
	            objAjax.attribute().setAttribute("tagDocId", tagDocId);
	        } 
	
	        objAjax.setActionMethod(actionMethod);
	        //alert("defaultProcessHandler " + defaultProcessHandler);
	        objAjax.setProcessHandler(_showSmartTagPopup);
	        //alert("sending request loadworkarea");
	        objAjax.sendRequest();
	    }
	}
	
var draggable;
	//Tracker#:12867 - OUTSTANDING TECH SPEC>MASS REPLACE ISSUES
	//added new parameter isEditablePopup: if it is true i.e popup is editable, then the ui will be different
function _startSmartTagPopup(htmlfldName, clsPopupDefault, isDraggable, isEditablePopup, invokeCompOnFocus,smrtDivId)
	{
		//alert("_startSmartTagPopup htmlfldName " + htmlfldName);
		//alert("_startSmartTagPopup smrtDivId " + smrtDivId);
	    var divObj;
	    //Tracker#:16082 -ABILITY TO SHARE THE CLIPBOARD WITH OTHER USERS
	    //If smrtDivId is passed, identifying the passed value as div id of the smart tag passing that to _createHTMLDiv function.
	    if(smrtDivId)
	    {
	    	_closeSmartTag(false,smrtDivId);
	    	divObj= _createHTMLDiv(smrtDivId);
	    }
	    else
	    {
	    	_closeSmartTag();
	    	divObj= _createHTMLDiv("_smartDiv");
	    }
	    //alert("divObj " + divObj.id);
	    var htmlObj = getElemnt(htmlfldName);
	
	    if(!htmlObj)return false;
		//Tracker# 15585- TSR-509 DRAG COLOR AND ARTWORK TO BOM
	    //Always keeping invokeCompOnFocus as true - Changed by Vijay
		if(false!=invokeCompOnFocus)
		{
			invokeCompOnFocus = true;
		}
	
	    if(divObj)
	    {
	        if(false!=isDraggable)
	        {
	            eval("divObj.setAttribute('isDraggable','1');");
	            draggable = $(divObj).draggable();
	        }
	        eval("divObj.setAttribute('smartDiv','1');");
	        if(false==clsPopupDefault)
	        {
	        	eval("divObj.setAttribute('closeSmartDiv','0');");
	        }
	
	        //alert("here");
	        ////Tracking#: 15106  - CANNOT OPEN ANY ROUNDS HIGHER THAN 1 ON SAMPLE EVALUATION
	        // comments the processing bar which is duplicate
	        //divObj.innerHTML = _processing;
	
	        if(htmlObj)
	        {
	            //alert(htmlObj.outerHTML);
	            //Tracker# 15585- TSR-509 DRAG COLOR AND ARTWORK TO BOM
	    		//if invokeCompOnFocus true set focus- Changed by Vijay
	            if(invokeCompOnFocus)
	            {
	            	eval("htmlObj.focus();");
	           	}
	            //alert("done");
	        }
	
        setLeft(divObj, _getComponentLeft(htmlObj));
        //Tracker#: 17653 MATERIAL QUOTE SMART TAG OPENS OFF THE PAGE
        //Added divObj as a parameter
        setTop(divObj, _getComponentTop(htmlObj, divObj));
        //setLeft(divObj, "300px");
        //setTop(divObj, "300px");
        
	        if(true==isEditablePopup)
	        {
	           eval("divObj.setAttribute('editablePopup','1');");
	        }
	
	        eval("divObj.setAttribute('fldName','"+htmlfldName+"');");
	        //alert("after setting \n "+ divObj.outerHTML);
	    }
	    return true;
	}
	
function _showSmartTagInteractivePopup(objAjax)
{
    if(objAjax)
    {
        //display the user message when drop downs are not loaded
        _displayProcessMessage(objAjax);
        ////Tracker#:12867 - OUTSTANDING TECH SPEC>MASS REPLACE ISSUES
        // not to show the smart tag if error occures
        if(!objAjax.isProcessComplete())
        {
            _closeSmartTag();
        }
        else
        {
            _showSmartTagPopup(objAjax);
        }
    }
}

var _bHideSmartTag = true;
function _showSmartTagPopup(objAjax,smartDivId)
	{
	    //alert("_showSmartTagPopup");
	    //Tracker # 12192 - STYLE SEARCH ON LABDIPS(SUBMITS)
	    //To display the error message.
	    var objMsgDiv = new messagingDiv(objAjax.error());
	    var divObj;
	    //Tracker#:16082 -ABILITY TO SHARE THE CLIPBOARD WITH OTHER USERS
	    //If smrtDivId is passed, identifying the passed value as div id of the smart tag otherwise taking the default value.
	    if(smartDivId)
	    {
	    	divObj= getElemnt(smartDivId);
	    }
	    else
	    {
	    	divObj= getElemnt("_smartDiv");
	    }
	    //alert("divObj " +divObj);
	    if(divObj && objAjax)
	    {
	        //Tracker#:12867 - OUTSTANDING TECH SPEC>MASS REPLACE ISSUES
	        //for editable popup show teh ui differently
	        var isEditablePopup = divObj.getAttribute('editablePopup');
	        var isDraggable = divObj.getAttribute('isDraggable');
	        var htmlfldName = divObj.getAttribute('fldName');
	        var divSmt; // Variable for the smart tag object
	        var divPopup;
	        var htmlObj = getElemnt(htmlfldName);
			
			var invokeCompOnFocus = true;
			//Tracker# 15585- TSR-509 DRAG COLOR AND ARTWORK TO BOM -Changed by Vijay                
	    	if("0"==objAjax.attribute().getAttribute("htmlfldOnFocus"))
			{
				invokeCompOnFocus = false;
			}
			
	        if(!htmlObj)
	        {
	            htmlObj = getElemnt(objAjax.attribute().getAttribute("htmlfldName"));
	            //alert("adfa" + htmlObj.outerHTML);
	        }
	
	        if(htmlObj && ("1"!=isEditablePopup))
	        {
	            //Tracker# 15585- TSR-509 DRAG COLOR AND ARTWORK TO BOM -Changed by Vijay             
	            if(invokeCompOnFocus)
	            {
	            	eval("htmlObj.focus();");
	           	}
	        }
	
	        divObj.innerHTML=objAjax.getHTMLResult();
	
	        //Tracker#:18844 ACCESS TO CHANGE TRACKING DATA ON ADVANCE SEARCH SCREEN
	        //Display the collapsible arrows in the change track smart tag pop up
	        //Create a new smart tag popup of resizable type and set the contents into the same
	        var tagDocId = objAjax.attribute().getAttribute("tagDocId");
	        if (tagDocId)
	        {
	        	var chgTrackDiv = document.createElement('div');
	        	var chgTrackDialog = $(chgTrackDiv).dialog({
	                width : 600,
	                height: 400,
	                modal: true,
                position: [_getComponentLeft(htmlObj), _getComponentTop(htmlObj, this)],
	                close : function(event, ui) {
	                            $(this).html('');
	                            $(this).dialog('destroy');
	                            $(this).remove();
	                        }
	            });
	        
	            var titleBar = $(".ui-dialog-titlebar a.ui-dialog-titlebar-close");
	            titleBar.removeClass("ui-corner-all");
	            titleBar.find(".ui-icon").html("<img src='images/close_top.gif' border='0'/>").removeClass();
	        
	            //Set the contents of the change tracking into the smart tag pop
	            chgTrackDialog.html($('#chgtrack_area').html());
	
	            //Nullify the contents of the original div so that the same will not be displayed
	            $('#_customtag').html(null);
	
	            //This will close the dialog box if the user clicks outside the dialog box
	            $(".ui-widget-overlay").live("click", function() {
	                chgTrackDialog.dialog("close");
	            });
	
	            //This will display the arrows next to each of the list item
	            $(document).ready(function()
	            {
	                $('#navchangetracking').collapsible({xoffset:'-15',yoffset:'5', imagehide: 'images/arrowdown.gif', imageshow: 'images/Rarrow.gif', defaulthide: false});
	            });
	            objAjax.attribute().setAttribute("tagDocId", null);
	            return;
	        }
	
	        //Tracker#:12867 - OUTSTANDING TECH SPEC>MASS REPLACE ISSUES
	        //for editable popup show teh ui differently
	        if("1"==isEditablePopup)
	        {
	            divObj.style.background = "#E4EAEE";
	            divObj.style.position ="";
	
	            // Tracker#: 17524 - FIREFOX: ERROR MESSAGE DISPLAY ON TRYING TO OPEN 'COLOR & SIZE' POP-UP FROM SAMPLE REQUEST SCREEN
	            // Firefox does not support the outerHTML property.
	            // implementing outerHTML equivalent using jquery.
	            var str =  $(divObj).wrap("<div>").parent().html();
	            _removeHTMLDiv(divObj);
	
	            divPopup = new DOMWindow( str, "_popupDIV", "10pt", "#006699", "#FFFFFF");
	            eval('document.body.appendChild(divPopup)');
	            divPopup.style.zIndex = 901;
	            divPopup.style.visibility = "visible";
	            divPopup.style.position ="absolute";

				 //Tracker#:21391 Skip setting popup to ceneter if it is the hideshow popup, 
	            // as the positioning for this popup is handled separatly.  
	            var hideshowpopup = objAjax.attribute().getAttribute("HIDESHOWPOPUP");
	
	            if(htmlObj)
	            {    
	                // Tracker#: 17523 - SAFARI: NOT ABLE TO CLOSE 'COLOR & SIZE' POP-UP ON SAMPLE REQUEST SCREEN
	                // Centering popup instead of positioning it over clicked element.
	            	if(!(hideshowpopup!=null && "YES"!=hideshowpopup))
            		{
	            	_setElementToCenter(divPopup);
	            }
	            }
	
	            //Tracker#:12867 - OUTSTANDING TECH SPEC>MASS REPLACE ISSUES
	            //if popup is draggable, set the drag properties
	            if("1"==isDraggable)
	            {
		            draggable = $(divPopup).draggable();
		            /*
		             * Tracker#:26926 SUBMIT/ROUNDS NOT SAVING HOME OFFICE DETAILS COMMENTS
		             * Temprory fix, somehow jquery draggable not firing onchange event.
		             * once jquery library is upgraded to 2.1.1 this should remove, draggable issue would not be
		             * there in jquery 2.1.1, notifyChangeFields function is calling on keyup and data type
		             * parameter is hard coded to 12. 
		             */
		            if(IE || (navigator.userAgent.search("Firefox") > -1))
	            	{
		            	$(divPopup).find('textarea,:text').keyup(function(){$(this).change();});
		            }
	            }
	
	            if(!objAjax.isProcessComplete())
	            {
	                _closeSmartTag();
	            }
	
	            // Tracker#:14595 ENABLE SMART TAG TO MATERIAL LIST VIEW FOR SUPPLIER
	            // Cursor is focused on SmartTag div instead of input text to which smart tag icon is attached.
	            if(divPopup)
	            {
	                divPopup.focus();
	                divSmt = divPopup;
	            }
	        }
        else if(divObj)
        {
            // Tracker#:14595 ENABLE SMART TAG TO MATERIAL LIST VIEW FOR SUPPLIER
            // Cursor is focused on SmartTag div instead of input text to which smart tag icon is attached.
            divObj.focus();
            divSmt = divObj;
        }
	        //alert("objAjax.getScriptResult();" + objAjax.getScriptResult());
	        /* Tracker#: 19807 - LEFT NAVIGATION NEEDS TO BE MADE COLLAPSIBLE
	         * Setting flag so POM popup alignment functions are not registered
	         * with toggle left nav module.
	         */
	        _showWorkArea.toggleNav.setIsPOMPopup(true);
	        _execAjaxScript(objAjax);
	        _showWorkArea.toggleNav.setIsPOMPopup(false); // set it back to false when done aligning.
	
	        //Tracker#:18011 IE6 BLEED THRU ISSUES ON MQ OFFER RESPONSE SCREEN
	        //Moved the setting of the left and top co-ordinates for the divObj after the complete
	        //div has been built
	        if(htmlObj && ("1"!=isEditablePopup))
	        {
	        	/* Tracker#:23136 SMART TAG ALIGNMENT ISSUE FOR COMPONENTS CLOSE TO SCREEN EDGE
	        	 * used JQuery offset().left and offset().top to position the smart tag div and
	        	 * positioned it with in the screen if it is going out of screen eighter right or
	        	 * bottom.
	        	 */
	        	var x = _getComponentLeft(htmlObj) + $(htmlObj).width();
	        	var y = _getComponentTop(htmlObj, divObj);
	        	jsutil.positionWithInScreen($(divObj), $(htmlObj), x, y);
	        }
	
	        // Tracker#:14902 XRITE INTEGRATION (CXF FILES) WITH COLOR LIBRARY UI CHANGES
			// return the popup div, requirement was to position the div in the center of the page.
	        return divSmt;
	
	    }
	}
//##Tracker # 12192 - STYLE SEARCH ON LABDIPS(SUBMITS)
//This function will destroy the current draggble object and enbale the same with a handle.
// Handle here is the div on which the drag is enabled. This is done [for IE only] to avoid the
// cursor getting stuck with the div on scrolling the draggable div.
function enableSmartPopDrag(div)
{
	var obj=getElemnt(div);
	draggable.draggable( "destroy" );
	var divId = "#_smartDiv";
    draggable = $(divId).draggable();
}
// Tracker#:15784 NEED THE ABILITY TO VIEW MATERIAL LIBRARY INFORMATION FOR A COMPONENT ON THE DESIGN BOM
// Dont close the SmartTag PopUp by the _reloadArea method, this is the case when printing material screen on 
// smartTag PopUp, popup used to close on loading Material Grid Panel.
// set the Div a attribute, so that on loading screen smartTag should not be closed.
function _setDontCloseSmartTag()
{
	var divObj = getElemnt("_smartDiv");
	
	if(divObj!=null && typeof(divObj)!='undefined')
	{	
		eval("divObj.setAttribute(_AttributeDonotCloseSmartDiv,'1');");
	}
}

function _createHTMLDiv(divId)
{
    var divObj = getElemnt(divId);

    if(divObj)
    {
        _removeHTMLDiv(divObj);
    }
    divObj = document.createElement("div");
    document.body.appendChild(divObj);
    divObj.id = divId;
    divObj.style.visibility = "visible";
    divObj.style.zIndex = 900;
    divObj.style.background = "#ffffff";
    divObj.style.position ="absolute";
    return divObj;
}

function _removeHTMLDiv(divObj)
{
    if(divObj)
    {
       divObj.innerHTML = "";
       try
       {
       		//Tracker#14641 - PLM TECH SPEC - AUTO SELL CHANNEL BUILDER CHANGES FOR PD SEASON
       		if(divObj.parentNode)
       		{
       			divObj.parentNode.removeChild(divObj);
       		}
       		else
       		{
        		document.body.removeChild(divObj);
        	}
       }
       catch(e){}
    }
}

// Cleanup if user clicks left navigation bar without closing inline popup div
function _onPreLoadContainer(div, objAjax)
{
    //Destroy autosuggests
    for (var i in AutoSuggestComponents)
    {
        if (AutoSuggestComponents[i])
        {
            AutoSuggestComponents[i].destroy();
            AutoSuggestComponents[i] = null;
        }
    }
    AutoSuggestComponents = new Object();

    //Destroy messagediv
    if (document.getElementById("msgDiv") != null) closeMsgBox();

    //Destroy search popup
    if (searchControl != null) searchControl.destroy();
}

//Populates target dropdown OPTIONS dynamically. Abridge name is used due to size restrictions of prop_name in DB
function getNextSel(sourceFld, url)
{
	//Explicitly call _notifyChangeFields because asynchronous nature of event handlers
	_notifyChangeFields(sourceFld, -1);//For now use -1
    var objAjax = new htmlAjax();
    if (objAjax)
    {
        var index = url.indexOf("?");
        var path = url.substring(0, index);
        var parameters = url.substring(index + 1);
        objAjax.setActionMethod("view");
        objAjax.setActionURL(path);
        objAjax.showProcessingBar(false);
        objAjax.parameter().addAllParameters(parameters);

        var objWorkArea = _getWorkAreaDefaultObj();
        if (objWorkArea)
        {
            var objHtmlData = objWorkArea.getHTMLDataObj();
            if (objHtmlData)
            {
                objHtmlData.addAllChangedFieldsData(objAjax);
            }
        }
        objAjax.setProcessHandler(handleSelOptions0);
        objAjax.sendRequest();
     }
}

//Callback handler methods for dynamic dropdown validations.
//see getNextSel
function handleSelOptions0(objAjax)
{
    if (objAjax)
    {
        //alert(objAjax.getHTMLResult());
        eval(objAjax.getHTMLResult());
    }
}

function handleSelOptions(targetFldId, options)
{
	if (targetFldId == null || targetFldId.length == 0 || typeof(targetFldId) == 'undefined')
	{
		return;
	}
	var objTargetFld = document.getElementById(targetFldId);
	if (objTargetFld == null || typeof(objTargetFld) == 'undefined' || objTargetFld.nodeName.toLowerCase() != 'select')
	{
		return;
	}

	if (objTargetFld.options.length > 0)
	{
		removeAllOptions (objTargetFld);
	}
	for (var i=0;i<options.length;i++)
	{
		addOption(objTargetFld,options[i][1],options[i][0],'');
	}
	_notifyChangeFields(objTargetFld, -1);//For now use -1
	if (objTargetFld.onchange) objTargetFld.onchange();
}

//Executes widget command (actions). Generally handled through GenericWidgetAction.
//WidgetId must be the top level container id (for example div id)
//
//since 2009R2
function executeWidgetCommand(url,id)
{
    //Tracker#14892:THE COLOR PALETTE SECTION ON THE COLOR LIBRARY SCREEN IS NOT REFRESHING PROPERLY.  THERE IS A DELAY.
    //Adding a rotating icon before the area is loaded with ajax response
    var elem=getElemnt(id);
    var h=elem.offsetHeight;
    var w=elem.offsetWidth;
    w=(w/2)-10;
    h=(h/2)-10;    
    //Tracker#19403 2011R3 REGRESSION - MATERIAL LIBRARY SMART TAG GETS A CLOCKING ISSUE
    //Added id for img tag to identify the element
    elem.innerHTML="<img id='iconImg' src='images/wait26.gif' style='position:relative;left:"+w+"px;top:"+h+"px;'></img>";
    
    try
    {
        var objAjax = new htmlAjax();
        if (objAjax)
        {
            var index = url.indexOf("?");
            var path = url.substring(0, index);
            var parameters = url.substring(index + 1);
            objAjax.setActionMethod(null);
            objAjax.setActionURL(path);
            objAjax.showProcessingBar(false);
            objAjax.parameter().addAllParameters(parameters);
            var widgetId = objAjax.parameter().getParameterByName("widgetId");
            //alert(path + ":" + parameters);

            var objWorkArea = _getWorkAreaDefaultObj();
            if (objWorkArea)
            {
                var objHtmlData = objWorkArea.getHTMLDataObj();
                if (objHtmlData)
                {
                    objHtmlData.addAllChangedFieldsData(objAjax);
                }
            }
            //alert("widgetId " + widgetId);
            objAjax.attribute().setAttribute("widgetId", widgetId);
            objAjax.setProcessHandler(handleUpdateWidget);
            objAjax.sendRequest();
         }
     }
     catch(e)
     {}
}

//since 2009R2
function handleUpdateWidget(objAjax)
{
   var widgetId = objAjax.attribute().getAttribute("widgetId");
   _reloadArea(objAjax, widgetId);
   //Tracker#19403 2011R3 REGRESSION - MATERIAL LIBRARY SMART TAG GETS A CLOCKING ISSUE
   //this code is to fix the display of never ends rotating icon on material component smart tag on BOMC
   //the smart tag is not getting refreshed because the flag skipTag is true. So removing the
   //<img> element from the grid panel section after reloading the area 
   var elem=getElemnt(widgetId);
   var img=getElemnt("iconImg");
   if(img)
   {
   		elem.removeChild(img);
   }
}

//since 2009R2
function _setPopupStyleOnMouseOver(obj, operation, btnId)
{
    /////Tracker#: 13050 REMOVE THE TABLES IN THE TABS AND THE BUTTONS
    //// changed the logic to access the table cell in case of
    /// not printing the html table
    var objLft;
	var objCtr;
	var objRt;

    if(btnId && btnId!='undefined')
	{
		objLft = getElemntByName(btnId +"btnLft");
		objCtr = getElemntByName(btnId +"btnCtr");
		objRt = getElemntByName(btnId +"btnRt");

		objLft = objLft[objLft.length-1];
		objCtr = objCtr[objCtr.length-1];
		objRt = objRt[objRt.length-1];
	}
	else
	{
		var cells = obj.getElementsByTagName("td");
		objLft = cells[0];
		objCtr = cells[1];
		objRt = cells[2];
	}

	if(objLft && objCtr && objRt)
	{
	    //alert("operation " + operation);
		if(operation == "mouseOver")
		{
			setAttribute(objLft, "className", "clsLeftPopupButtonMover");
			setAttribute(objCtr, "className", "clsCenterPopupButtonMover");
			setAttribute(objRt, "className", "clsRightPopupButtonMover");
		}
		else if(operation == "mouseOut")
		{
		    setAttribute(objLft, "className", "clsLeftPopupButton");
			setAttribute(objCtr, "className", "clsCenterPopupButton");
			setAttribute(objRt, "className", "clsRightPopupButton");
		}
	}
}

///////Tracker#: 13050 REMOVE THE TABLES IN THE TABS AND THE BUTTONS
/////// modified the function to resolve the script error
/// after removing the table
function _setButtonStyle(obj, operation, btnId)
{
    /////Tracker#: 13050 REMOVE THE TABLES IN THE TABS AND THE BUTTONS
    //// changed the logic to access the table cell in case of
    /// not printing the html table
	var objLft;
	var objCtr;
	var objRt;
    if(btnId && btnId!='undefined')
	{
		objLft = getElemntByName(btnId +"btnLft");
		objCtr = getElemntByName(btnId +"btnCtr");
		objRt = getElemntByName(btnId +"btnRt");

		objLft = objLft[objLft.length-1];
		objCtr = objCtr[objCtr.length-1];
		objRt = objRt[objRt.length-1];
	}
	else
	{
		var cells = obj.getElementsByTagName("td");
		objLft = cells[0];
		objCtr = cells[1];
		objRt = cells[2];
	}

	if(objLft && objCtr && objRt)
	{
	    //alert("operation " + operation);
		if(operation == "mouseOver")
		{
			setAttribute(objLft, "className", "clsLeftcornerButtonmover");
			setAttribute(objCtr, "className", "clsCenterButtonmover");
			setAttribute(objRt, "className", "clsRightButtonmover");
		}
		else if(operation == "mouseOut")
		{
		    setAttribute(objLft, "className", "clsLeftcornerButton");
			setAttribute(objCtr, "className", "clsCenterButton");
			setAttribute(objRt, "className", "clsRightButton");
		}
	}
}

function setTabStyle(obj, operation, btnId)  {
    /////Tracker#: 13050 REMOVE THE TABLES IN THE TABS AND THE BUTTONS
    //// changed the logic to access the table cell in case of
    /// not printing the html table
    var objLft;
	var objCtr;
	var objRt;

    if(btnId && btnId!='undefined')
	{
		objLft = getElemntByName(btnId +"LeftCell");
		objCtr = getElemntByName(btnId +"CenterCell");
		objRt = getElemntByName(btnId +"RightCell");

		objLft = objLft[objLft.length-1];
		objCtr = objCtr[objCtr.length-1];
		objRt = objRt[objRt.length-1];
	}
	else
	{
		var cells = obj.getElementsByTagName("td");
		objLft = cells[0];
		objCtr = cells[1];
		objRt = cells[2];
	}

	if(objLft && objCtr && objRt)
	{
	    //alert("operation " + operation);
		if(operation == "mouseOver")
		{
			setAttribute(objLft, "className", "clsLeftcornerTabOnfocus");
			setAttribute(objCtr, "className", "clsCenterTabOnfocus");
			setAttribute(objRt, "className", "clsRightTabOnfocus");
		}
		else if(operation == "mouseOut")
		{
		    setAttribute(objLft, "className", "clsLeftcornerTabOfffocus");
			setAttribute(objCtr, "className", "clsCenterTabOfffocus");
			setAttribute(objRt, "className", "clsRightTabOfffocus");
		}
	}
}

function emptySearchBox(objectId){
	document.getElementById(objectId).value = "";
}

//-------------------
// Tracker#: 11700 ROLLOVER TEXT REQUESTED
// This just sets the "title" attribute same as the value.
//-------------------
function _setValueAsTitle(obj)
{
    try
    {
        setAttribute(obj, "title", obj.value);
    }
    catch(e)
    {
        // eating the exception.
        // If the Title attribute is not supported by the html object.
    }
}

//Tracker 13085
function _getTRCheckBox(tr)
{
	var objChk = null;
	if(tr)
	{
		var chkCols = tr.getElementsByTagName("INPUT");

		var cnt = chkCols.length;

		for(i=0;i<cnt;i++)
        {
        	var obj = chkCols[i];
        	//alert("obj.type " + obj.type);
        	if(obj && obj.type && obj.type=="checkbox")
        	{
        		objChk = obj;
        		break;
        	}
        }
	}
	return objChk;
}

// ---------------------------------------------------------------
// Tracker#: 13512  MOVE FITEVAL INTO PLM FRAMEWORK
// ---------------------------------------------------------------

// Mouse over event handler attached to an row.
function _rwHlt(obj, frzTblId, trInd)
{
    // For the Search List section only
    // just higlight the row identified by obj
    if(obj)
    {
        obj.style.background='#F4EDAD';
    }

    // If the table has been freezed(LHS Table and RHS table are available)
    if(frzTblId)
    {
        var objTbl = getElemnt(frzTblId);

        if(objTbl)
        {
            var objTrs = objTbl.getElementsByTagName("TR");

            // The first row(s) may be freezed so get the row index by considering the
            // freezed row(s)
            trInd =  parseFloat(trInd) + _getFreezeRowStartIndex(objTbl);

            if(objTrs && objTrs.item(trInd))
            {
                objTrs.item(trInd).style.background='#F4EDAD';
                // Tracker:16274 MOVE POM TO PLM FRAMEWORK
                return trInd;
            }
        }
    }
     // Tracker:16274 MOVE POM TO PLM FRAMEWORK
    return -1;
}

// Mouse out event - Make the background as white color.
function _rwUnHlt(obj, frzTblId, trInd)
{
    if(obj)
    {
        obj.style.background='#FFFFFF';
    }

    if(frzTblId)
    {
        var objTbl = getElemnt(frzTblId);

        if(objTbl)
        {
            var objTrs = objTbl.getElementsByTagName("TR");

            trInd = parseFloat(trInd) + _getFreezeRowStartIndex(objTbl);

            if(objTrs && objTrs.item(trInd))
            {
               objTrs.item(trInd).style.background='#FFFFFF';
                // Tracker:16274 MOVE POM TO PLM FRAMEWORK
               return trInd;
            }
        }
    }
     // Tracker:16274 MOVE POM TO PLM FRAMEWORK
    return -1;
}

// read the custom attribute for the table
function _getFreezeRowStartIndex(objTbl)
{
    if(objTbl)
    {
        var ind = getCustomAttribute(objTbl,_AttributeFrzDataRowStartIndex);

        if(ind && !isNaN(ind))
        {
            return parseFloat(ind);
        }
    }

    return 0;
}

//Tracker 14861: IMPROVE PLM SCREEN PERFORMANCE
// added the js function to remove the readonly attribute
function _icRd(obj)
{
   if(obj && getCustomAttribute(obj,"remRd")=="1")
   {
      removeAttribute(obj, "readOnly");
      removeAttribute(obj, "remRd");
      obj.select();
   }
}

//Tracker#:14689 -USE ARROW KEYS TO TAB DOWN A COLUMN IN PLM
// if user uses the downarrow or uparrow move the cursor either
// to the next sibling or the previous sibling
function _arwKy(obj, kp, e)
{
	/* Tracker#: 20641 - SAFARI & FIREFOX: UP/DOWN ARROW KEYS NEED TO WORK IN REPEATED SECTIONS OF POM, BOM, FIT EVAL SCREENS
	 * Pass in event object as variable e.
	 */
	//alert("keydown");
	//up arrow 38
	// down arrow 40
	// prevent javascript error by checking for valid event first.
	var evt = e || window.event;
	if (!evt)
	{
		return;
	}
	var code = evt.keyCode;
	// check if the key pressed was passed in as arg
	// if it was, then that is the action to use one more time to skip over 
	// readonly
	if (kp)
	{
		code=kp;
	}
	//alert(obj.outerHTML + "\n " + "_arwKy " + code);
	if (code == 38 || code==40)  //up arrow 38 or down arrow
	{
		var tdObj = _getParentByTagName(obj, "TD");
		
		if(tdObj)
		{
			var trObj = _getParentByTagName(tdObj, "TR");
			var objSlbTd;
			var nextObjSlbTd;

			if(code == 38)  //up arrow
			{
				objSlbTd= _findPrevSiblingElement(trObj, "tr", tdObj);
			}
			else if (code == 40) // down arrow 40
			{
				objSlbTd = _findNextSiblingElement(trObj, "tr", tdObj);
			}
			if(objSlbTd)
				
			{
				var objSlb = _getSiblingObjectIndex(obj, tdObj, objSlbTd);
				if(objSlb)
				{
					// check if field has onkeydown function, and if it doesn't, perform same action one more time.  Per Rajeev, don't skip more than one row 
					if (objSlb)
					{       
						objSlb.focus();
						objSlb.select();	
						// only if did not come in with kp arg, prevents
						// skipping over more than one row
						if (!objSlb.onkeydown)
						{
							if (!kp)
							{
								_arwKy(objSlb,code,e)
							} 
						}
					}
				}
			}
			else
			{
				return false;
			}
		}
		else
		{
			return false;
		}
	}
}

function _getSiblingObjectIndex(obj, tdObj, objSlbTd)
{
    var retObj = null;
    var objCol = tdObj.getElementsByTagName(obj.tagName);
    if(objCol)
    {
        for(var i=0; i<objCol.length; i++)
        {
            if(objCol.item(i).id == obj.id)
            {
                //alert("here found");
                retObj = objSlbTd.getElementsByTagName(obj.tagName).item(i);
                //alert(retObj.outerHTML);
                i = objCol.length;
                break;
            }
        }
    }
    return retObj;
}

function _getParentByTagName(obj, tagName)
{
   if(obj && obj.parentNode)
   {
        while(obj.tagName.toUpperCase()!=tagName)
        {
            obj = obj.parentNode;
        }
   }
   return obj;
}

function _findNextSiblingElement (obj, tagName, tdElement)
{
    var nextSiblingElement;
    var nextSibling;

    if(obj.nextSibling)
    {
        var blnRowSpan = false;
        //get reference to the element
        nextSibling = obj.nextSibling;
        //Tracker#:14689 USE ARROW KEYS TO TAB DOWN A COLUMN IN PLM
        //based on rowspan get next sibling
        for(var i=1; i<tdElement.rowSpan;i++)
        {
            if(nextSibling.nextSibling)
            {
                nextSibling = nextSibling.nextSibling;               
            }
            //If rowspan is more than 1 set blnRowSpan to true
            blnRowSpan = true;
        }
        /* Tracker#: 20641 - SAFARI & FIREFOX: UP/DOWN ARROW KEYS NEED TO WORK IN REPEATED SECTIONS OF POM, BOM, FIT EVAL SCREENS
         * Issue - On PLM POM, already found the correct row;
         * no need to skip.
         * This is probably because 
         * in IE, the closing tag for input elements were recognized as a separate element.
         * Fix - Removed code to skip row.
         */
        if (nextSibling.nodeType == 1 && nextSibling.tagName.toLowerCase() == tagName)
        {
            nextSiblingElement = nextSibling;
            //get the number of cells in the current row
            var curTdCnt = parseFloat(obj.cells.length);
             //get the count from the current cell
            var nwTdCnt =  parseFloat(nextSiblingElement.cells.length);
            //Jump if rows skipped while display
            if (_isNotNull(nextSiblingElement.cells[tdElement.cellIndex] ))
            {
                var nextSblElm = nextSiblingElement.cells[tdElement.cellIndex];
                //Tracker#:14689 USE ARROW KEYS TO TAB DOWN A COLUMN IN PLM
                //If the rowspan is more  than 1 calculate the cell index and get the td
                //else return the reference element
                if(nextSblElm.rowSpan>1)
                {
                   nextSiblingElement = _getParentByTagName(nextSblElm, "TR");
                   //calculate actual cell index
                   var cellIndx = parseFloat(nextSiblingElement.cells.length) - curTdCnt + parseFloat(tdElement.cellIndex);
                   //alert("cellIndx " +cellIndx +  "\n tdElement.cellIndex " + tdElement.cellIndex);
                   //get the td, based on the cell index, which is calculated
                   nextSiblingElement = nextSiblingElement.cells[cellIndx];
                }
                else
                {
                   nextSiblingElement = nextSblElm;
                }
            }
            else if(!blnRowSpan)
            {
                //If rowspan is 1, calculate the index
                var cellIndx = tdElement.cellIndex - curTdCnt + nwTdCnt;
                //alert("else part cellIndx " +cellIndx +  "\n tdElement.cellIndex " + tdElement.cellIndex );
                //get the td
                nextSiblingElement = nextSiblingElement.cells[cellIndx];
               //Tracker#:14689 USE ARROW KEYS TO TAB DOWN A COLUMN IN PLM
               //since pom detail has 2 sections and 1st section row span is 2
                if(nextSiblingElement.rowSpan>1)
                {
                   nextSiblingElement = _getParentByTagName(nextSiblingElement, "TR");
                    //calculate the cell index
                   var cellIndx = parseFloat(nextSiblingElement.cells.length) - curTdCnt + parseFloat(tdElement.cellIndex);
                   //get the td, based on the cell index, which is calculated
                   nextSiblingElement = nextSiblingElement.cells[cellIndx];
                }
            }
        }
    }
    return nextSiblingElement;
}

function _findPrevSiblingElement (obj, tagName, tdElement)
{
    var prevSiblingElement;
    var prevSibling;

    if(obj.previousSibling)
    {
        var blnRowSpan = false;
        //Tracker#:14689 USE ARROW KEYS TO TAB DOWN A COLUMN IN PLM
        //get reference to the element
        prevSibling = obj.previousSibling;
        for(var i=1; i<tdElement.rowSpan;i++)
        {
            if(prevSibling.previousSibling)
            {
                prevSibling = prevSibling.previousSibling;
            }
            //If rowspan is more than 1 set blnRowSpan to true
            blnRowSpan = true;
        }
        /* Tracker#: 20641 - SAFARI & FIREFOX: UP/DOWN ARROW KEYS NEED TO WORK IN REPEATED SECTIONS OF POM, BOM, FIT EVAL SCREENS
         * Issue - On PLM POM, already found the correct row;
         * no need to skip.
         * This is probably because 
         * in IE, the closing tag for input elements were recognized as a separate element.
         * Fix - Removed code to skip row.
         */
        //alert('tdElement.cellIndex = ' + tdElement.cellIndex + '\n' + nextSibling.outerHTML);
        if (prevSibling.nodeType == 1 && prevSibling.tagName.toLowerCase() == tagName)
        {
            prevSiblingElement = prevSibling;
            //get the number of cells in the current row
            var curTdCnt = parseFloat(obj.cells.length);
            //get the count from the current cell
            var nwTdCnt =  parseFloat(prevSiblingElement.cells.length);

            //Jump if rows skipped while display
            if (_isNotNull(prevSiblingElement.cells[tdElement.cellIndex] ))
            {
                var prevSblElm = prevSiblingElement.cells[tdElement.cellIndex];
                //If the rowspan is more  than 1, calculate the cell index
                //Tracker#:14689 USE ARROW KEYS TO TAB DOWN A COLUMN IN PLM
                if(prevSblElm.rowSpan>1)
                {
                   prevSiblingElement = _getParentByTagName(prevSblElm, "TR");
                   //calculate actual cell index
                   //because the 2nd section of POM has rowspan 1, whereas 2nd section has rowspan as 1.
                   var cellIndx = parseFloat(prevSiblingElement.cells.length) - curTdCnt + parseFloat(tdElement.cellIndex);
                   //get the td, based on the cell index, which is calculated
                   prevSiblingElement = prevSiblingElement.cells[cellIndx];
                }
                else
                {
                    prevSiblingElement = prevSblElm;
                }
            }
            else if(!blnRowSpan)
            {
                var cellIndx = tdElement.cellIndex - curTdCnt + nwTdCnt;
                 //get the td
                prevSiblingElement = prevSiblingElement.cells[cellIndx];
                //Tracker#:14689 USE ARROW KEYS TO TAB DOWN A COLUMN IN PLM
                //pom screen detail first section has rowspan as 2
                if(prevSiblingElement  && prevSiblingElement.rowSpan>1)
                {
                   prevSiblingElement = _getParentByTagName(prevSiblingElement, "TR");
                    //calculate the cell index
                   var cellIndx = parseFloat(prevSiblingElement.cells.length) - curTdCnt + parseFloat(tdElement.cellIndex);
                  //get the next td, based on the cell index which is calculated
                   prevSiblingElement = prevSiblingElement.cells[cellIndx];
                }
            }
        }
    }
    return prevSiblingElement;
}
/**
--Tracker#: 18039  NEW PROCESS TO ADD MQ LINK FROM PROJECTIONS 
* Gets the new component Id from the existing fild id by passing the new fieldId
*/
function _getNewCompNameByFieldId(strFldName, newFldId)
{
    var retVal = null;

    if(strFldName)
    {
        if(strFldName!=null && strFldName.startsWith(_CHK_BOX_DEFAULT_ID))
        {
           strFldName = strFldName.replace(_CHK_BOX_DEFAULT_ID,"");
        }
        var str = strFldName.split(_FIELDS_SEPERATOR);

        if(str && str.length>2)
        {
           str[2] = newFldId;
        }
        retVal = str.join(_FIELDS_SEPERATOR);
    }

    return retVal;
}

/**
* Gets the Id from the fieldId
*/
function _getSectionIdFromCompName(strFldName)
{
    var retVal = null;

    if(strFldName)
    {
        if(strFldName!=null && strFldName.startsWith(_CHK_BOX_DEFAULT_ID))
        {
           strFldName = strFldName.replace(_CHK_BOX_DEFAULT_ID,"");
        }
        var str = strFldName.split(_FIELDS_SEPERATOR);

        if(str && str.length>0)
        {
           retVal = str[0];
        }
    }

    return retVal;
}
/**
* Gets the Id from the fieldId
*/
function _getDocIdFromCompName(strFldName)
{
    var retVal = null;

    if(strFldName)
    {
        if(strFldName!=null && strFldName.startsWith(_CHK_BOX_DEFAULT_ID))
        {
           strFldName = strFldName.replace(_CHK_BOX_DEFAULT_ID,"");
        }
        var str = strFldName.split(_FIELDS_SEPERATOR);

        if(str && str.length>1)
        {
           retVal = str[1];
        }
    }

    return retVal;
}
/**
* Gets the Id from the fieldId
*/
function _getFieldIdFromCompName(strFldName)
{
    var retVal = null;

    if(strFldName)
    {
        if(strFldName!=null && strFldName.startsWith(_CHK_BOX_DEFAULT_ID))
        {
           strFldName = strFldName.replace(_CHK_BOX_DEFAULT_ID,"");
        }
        var str = strFldName.split(_FIELDS_SEPERATOR);

        if(str && str.length>2)
        {
           retVal = str[2];
        }
    }

    return retVal;
}
/**
* Gets the Id from the fieldId
*/
function _getLevelIdFromCompName(strFldName)
{
    var retVal = null;

    if(strFldName)
    {
        if(strFldName!=null && strFldName.startsWith(_CHK_BOX_DEFAULT_ID))
        {
           strFldName = strFldName.replace(_CHK_BOX_DEFAULT_ID,"");
        }
        var str = strFldName.split(_FIELDS_SEPERATOR);

        if(str && str.length>3)
        {
           retVal = str[3];
        }
    }

    return retVal;
}

/**
* Gets the Id from the fieldId
*/
function _getRepeateCountFromCompName(strFldName)
{
    var retVal = null;

    if(strFldName)
    {
        if(strFldName!=null && strFldName.startsWith(_CHK_BOX_DEFAULT_ID))
        {
           strFldName = strFldName.replace(_CHK_BOX_DEFAULT_ID,"");
        }
        var str = strFldName.split(_FIELDS_SEPERATOR);

        if(str && str.length>4)
        {
           retVal = str[4];
        }
    }

    return retVal;
}

/**
* Gets the Id from the fieldId
*/
function _getActualRowIndexFromCompName(strFldName)
{
    var retVal = null;

    if(strFldName)
    {
        if(strFldName!=null && strFldName.startsWith(_CHK_BOX_DEFAULT_ID))
        {
           strFldName = strFldName.replace(_CHK_BOX_DEFAULT_ID,"");
        }
        var str = strFldName.split(_FIELDS_SEPERATOR);

        if(str && str.length>5)
        {
           retVal = str[5];
        }
    }

    return retVal;
}
/**
 * gets db row no of the field value belongs, passing fieldId, customised for 
 * BOMC colorway fields
 * strFldName is the field id, and it woulbe in 5_@1_@55_@0_@0_@-1_@100###0###SLN-LIGHT BLUE_@desc this
 * format, and spliting the id by ### delimiter, return token with index of 1, that is row no.
 * this is used to identify the blank row or not in bomc fill up fill down function.
 *  
 */
function _getRowNoFromCompName(strFldName)
{
	var retVal = null;
	
	if(strFldName)
	{
		if(strFldName!=null && strFldName.startsWith(_CHK_BOX_DEFAULT_ID))
		{
			strFldName = strFldName.replace(_CHK_BOX_DEFAULT_ID,"");
		}
		var str = strFldName.split(_DELIMITER);
		
		if(str && str.length> 1)
		{
			retVal = str[1];
		}
	}
	
	return retVal;
}

/**
* Gets the Id from the fieldId
*/
function _getIDSuffixFromCompName(strFldName)
{
    var retVal = null;

    if(strFldName)
    {
        if(strFldName!=null && strFldName.startsWith(_CHK_BOX_DEFAULT_ID))
        {
           strFldName = strFldName.replace(_CHK_BOX_DEFAULT_ID,"");
        }

        var str = strFldName.split(_FIELDS_SEPERATOR);

        if(str && str.length>6)
        {
           retVal = str[6];
        }
    }

    return retVal;
}

function _openWPLM(url1, url2, url3, url4,  nWidth, nHeight)
{
    var url = url1 + encodeURIComponent(url2) + url3 + encodeURIComponent(url4);
    openWin(url, nWidth, nHeight)
}

//Checks for not null and undefined
function _isNotNull(obj)
{
    return (typeof obj != 'undefined' && obj != 'null' && obj != null);
}

function _isNull(obj)
{
    return (obj == null || typeof(obj) == 'undefined');
}

var _sectionMenuDialog;

var SectionMenu = {
	
	deselectCheckBox : function(checkBoxStyle)
	{		
		var selector = '.'+checkBoxStyle+'[id="sectionCheckBox"]';
		
		var obj = $(selector);
		
		obj.get(0).click();
		
		if(obj.attr('checked'))
		{	
			obj.get(0).click();
		}
	},
	
	selectHeaderCheckBox : function(checkBoxStyle)
	{	
		var selector = '.'+checkBoxStyle+'[id="sectionCheckBox"]';
				
		var obj = $(selector);
		
		var pObj = obj;
		
		while(pObj && pObj.attr("tagName")!="TABLE")
		{
			pObj = pObj.parent();
		}
		
		var blnDataCheckBoxSelected = false;
		
		if(pObj)
		{
			var chks = pObj.find('.data' + checkBoxStyle + '[checked=true]');
			if(chks.length>0)
			{
				blnDataCheckBoxSelected = true;
			}
			
		}
		
		//alert(obj.attr('checked'));
		
		if(!blnDataCheckBoxSelected)
		{
			if(!obj.attr('checked'))
			{				
				obj.get(0).click();
			}
			else
			{
				obj.get(0).click();
				obj.get(0).click();
			}
		}		
	},
		
	show: function(sectionId, obj){
		
		var menuDiv = $("#menu"+sectionId);
		if(menuDiv){	
			var dlg = new Popup("secPopup","", menuDiv.html(),100,120,"#FFF","#FFF",obj,true);
			_sectionMenuDialog = dlg.show();
			var tbar = $(".ui-dialog-titlebar");
			if(tbar)
			{	
				//tbar.removeClass("ui-widget-header");
			}
			
			var titleBar = $(".ui-dialog-titlebar"); 
			if(titleBar)
			{		
				titleBar.css("padding", "1px");
				titleBar.find("span").removeClass();
				var lnk = titleBar.find("a.ui-dialog-titlebar-close");
				lnk.css("height", "13px");
				lnk.css("width", "13px");
				lnk.find("img").css("height", "12px");
			}
			
			var divPopop = $('#secPopup');
			divPopop.css("padding", "1px");
			divPopop.css("width", "120px");
			$(".ui-dialog").css("width", "120px");
		}		
	},
	
	close: function(){		
		try{
			if(_sectionMenuDialog) {
				_sectionMenuDialog.html('');
				_sectionMenuDialog.dialog('destroy');
				_sectionMenuDialog.remove();
			}			
		}catch(e){
			//alert("close error " + e.description);
		}
		
	},

		
	deselectGroupCheckBox : function(checkBoxStyle, currentSectionStyle)
	{				
		var selector = '.'+checkBoxStyle;		
		var obj = $(selector);		
		obj.each(function(i){ 
			if(currentSectionStyle && $(this).hasClass(currentSectionStyle))
			{
				return;
			}
			
			this.click();
			if($(this).is(':checked')){				
				this.click();
			} 
		});
	},	
	
	deselectCheckBox : function(checkBoxStyle)
	{		
		var selector = '.'+checkBoxStyle;	//+'[id="sectionCheckBox"]';
		
		var obj = $(selector);
				
		obj.get(0).click();
		
		if(obj.attr('checked'))
		{	
			obj.get(0).click();
		}
	},
	
	selectHeaderCheckBox : function(checkBoxStyle)
	{	
		var selector = '.'+checkBoxStyle;	//+'[id="sectionCheckBox"]';
		
		//alert(selector);
		
		var obj = $(selector);
		
		var pObj = obj;
		
		while(pObj && pObj.attr("tagName")!="TABLE")
		{
			pObj = pObj.parent();
		}
		
		var blnDataCheckBoxSelected = false;
		
		if(pObj)
		{
			var chks = pObj.find('.data' + checkBoxStyle + '[checked=true]');
			if(chks.length>0)
			{
				blnDataCheckBoxSelected = true;
			}
			
		}
		
		//alert(obj.attr('checked'));
		
		if(!blnDataCheckBoxSelected)
		{
			if(!obj.attr('checked'))
			{				
				obj.get(0).click();
			}
			else
			{
				obj.get(0).click();
				obj.get(0).click();
			}
		}		
	},
		
	show: function(sectionId, obj){
		
		var menuDiv = $("#menu"+sectionId);
			
		//menuDiv.css("display" , "none");
		if(menuDiv){	
			var dlg = new Popup("secPopup","", menuDiv.html(),100,120,"#FFF","#FFF",obj,true);
			_sectionMenuDialog = dlg.show();
			var tbar = $(".ui-dialog-titlebar");
			if(tbar)
			{	
				//tbar.removeClass("ui-widget-header");
			}
			
			var titleBar = $(".ui-dialog-titlebar"); 
			if(titleBar)
			{		
				titleBar.css("padding", "1px");
				titleBar.find("span").removeClass();
				var lnk = titleBar.find("a.ui-dialog-titlebar-close");
				lnk.css("height", "13px");
				lnk.css("width", "13px");
				lnk.find("img").css("height", "12px");
			}
			
			var divPopop = $('#secPopup');
			divPopop.css("padding", "1px");
			divPopop.css("width", "120px");
			$(".ui-dialog").css("width", "120px");
		}		
	},
	
	close: function(){		
		try{
			if(_sectionMenuDialog) {
				_sectionMenuDialog.html('');
				_sectionMenuDialog.dialog('destroy');
				_sectionMenuDialog.remove();
			}			
		}catch(e){
			//alert("close error " + e.description);
		}
		
	}
}


//Tracker#:14689 -USE ARROW KEYS TO TAB DOWN A COLUMN IN PLM
// end changing the 14689 tracker changes

// ---------------------------------------------------------------
