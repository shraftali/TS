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

/*
*This file is to add javascript function, which are dealing
*with Comments popup in plm screens.
*
*/


function _colorlibMainPopUp(obj)
{
	if(!isValidRecord(true))
	{
		return;
	}

	objAjax = new htmlAjax();
    objAjax.setActionURL("threadedcomments.do");
    objAjax.setActionMethod("viewcomments");
    objAjax.setProcessHandler("colorLibCommentResponse");
    objAjax.parameter().add("parentViewId", 2900);
    objAjax.sendRequest();
}

function colorLibCommentResponse()
{
	if(objAjax)
	{
		if(objAjax.isProcessComplete())
		{
			var comments = new TRADESTONE.Comments("Color Library Comments", objAjax.getResult());
			comments.show();
		}
		objAjax = null;
	}
}

function _clrlibShowNewCmnts()
{
	var actMethod ="createcomment";
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();

    if(objAjax)
    {
    	var htmlfldName = htmlAreaObj.getDivSectionId();
    	//alert("showView : objAjax "  + objAjax.getDocViewId());
    	_startSmartTagPopup(htmlfldName, false, null, true);
        objAjax.setActionURL("coloroverview.do");
        objAjax.setActionMethod(actMethod);
        objAjax.attribute().setAttribute("htmlfldName", htmlfldName);
        objAjax.setProcessHandler(_showSmartTagInteractivePopup);

        //alert("sending");
        objAjax.sendRequest();

    }
}

function _clrlibReplyCmnts()
{

	var actMethod ="replycomment";
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();

    if(objAjax)
    {
    	var htmlfldName = htmlAreaObj.getDivSectionId();
    	actMethod += "&keyinfo= " +getComponentKeyInfo();
    	//alert("showView : objAjax "  + objAjax.getDocViewId());
    	_startSmartTagPopup(htmlfldName, false, null, true);
        objAjax.setActionURL("coloroverview.do");
        objAjax.setActionMethod(actMethod);
        objAjax.attribute().setAttribute("htmlfldName", htmlfldName);
        objAjax.setProcessHandler(_showSmartTagInteractivePopup);

        //alert("sending");
        objAjax.sendRequest();

    }
}

function _clrlibCmntSave(divid)
{
	var htmlAreaObj = _getAreaObjByDocView(divid);
	var htmlWrkAreaObj = _getWorkAreaDefaultObj();
	if(htmlAreaObj && htmlWrkAreaObj)
	{
		var actMethod = "savecomment";
		var objAjax = htmlAreaObj.getHTMLAjax();
		var objHTMLData = htmlAreaObj.getHTMLDataObj();
		sectionName = objAjax.getDivSectionId();
		//alert("_showSampleTabView \n sectionName  " + sectionName);
	    if(objAjax && objHTMLData)
	    {
	    	var htmlfldName = htmlWrkAreaObj.getDivSectionId();

	    	//alert("getChangeFields : "+ objHTMLData.getChangeFields());
	    	bShowMsg = true;
	        objAjax.setActionMethod(actMethod);
	        objAjax.setActionURL("coloroverview.do");
	        objAjax.setProcessHandler(_postClrCmntSave);
	        objHTMLData.appendAllCustomContainerDataToRequest(objAjax, divid);
	        objAjax.parameter().add(_screenChangeFileds, objHTMLData.getSaveChangeFields());
        	objHTMLData._appendAllContainerDataToRequest(objAjax);
        	_startSmartTagPopup(htmlfldName, false, null, true);
        	objAjax.sendRequest();
	    }
    }
}

function _postClrCmntSave(objAjax)
{
	if(objAjax)
    {
        //display the user message when drop downs are not loaded
        _displayProcessMessage(objAjax);

        if(objAjax.isProcessComplete())
        {
         	_showSmartTagPopup(objAjax);

            var htmlAreaObj = _getAreaObjByDocView("5001");
            if(htmlAreaObj)
			{
				var objHTMLData = htmlAreaObj.getHTMLDataObj();
            	objHTMLData.resetChangeFields();
            	_setCmntsIcon(objAjax);
           	}
        }
    }
}

// Tracker#:14240 COMMENTS TAB / THREADED MESSAGING ON COLOR LIB SCREEN ICON
function _setCmntsIcon(objAjax)
{
	//alert("_setCmntsIcon");

	var htmlAreaObj = _getWorkAreaDefaultObj();

    if(objAjax && htmlAreaObj)
    {
        var obj = htmlAreaObj.attribute().getAttribute("_cmtsobj");
        var iconSrc = objAjax.getResponseHeader("iconSrc");

        //alert("obj " + obj);
        //alert("iconSrc " + iconSrc);
        if(obj && iconSrc)
        {
        	setAttribute(obj, "src", iconSrc);
        }
    }
}


function sortClrlibComment(fieldName,sec,type, pageNo)
{
    //alert("sortColorColumn called");
    sectionName = sec;
    var htmlAreaObj = _getWorkAreaDefaultObj();
	//alert("htmlAreaObj " + htmlAreaObj);
    var objAjax = htmlAreaObj.getHTMLAjax();

    if(objAjax)
    {
    	var htmlfldName = htmlAreaObj.getDivSectionId();
    	_startSmartTagPopup(htmlfldName, false, null, true);
        objAjax.setActionURL("coloroverview.do");
        objAjax.setActionMethod("sortcomment&sortColumn="+fieldName+"&sort="+type+"&pageNum="+pageNo);
        objAjax.attribute().setAttribute("htmlfldName", htmlfldName);
        objAjax.setProcessHandler(_showSmartTagInteractivePopup);
        objAjax.sendRequest();
    }
}

function _techSpecMainPopUp(obj)
{
    if(!isValidRecord(true))
	{
		return;
	}

	objAjax = new htmlAjax();
    objAjax.setActionURL("threadedcomments.do");
    objAjax.setActionMethod("viewcomments");
    objAjax.setProcessHandler("commentResponse");
    objAjax.parameter().add("parentViewId", 132);
    objAjax.sendRequest();
}

function commentResponse()
{
	if(objAjax)
	{
		if(objAjax.isProcessComplete())
		{
			var comments = new TRADESTONE.Comments("Tech Spec Comments", objAjax.getResult());
			comments.show();
		}
		objAjax = null;
	}
}


function _techspecShowNewCmnts()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
	//alert("htmlAreaObj " + htmlAreaObj);
    var objAjax = htmlAreaObj.getHTMLAjax();
	var actMethod ="createcomment";

    if(objAjax)
    {
    	var htmlfldName = htmlAreaObj.getDivSectionId();
    	//alert("showView : objAjax "  + objAjax.getDocViewId());
    	_startSmartTagPopup(htmlfldName, false, null, true);
        objAjax.setActionURL("techspecoverview.do");
        objAjax.setActionMethod(actMethod);
        objAjax.attribute().setAttribute("htmlfldName", htmlfldName);
        objAjax.setProcessHandler(_showSmartTagInteractivePopup);

        //alert("sending");
        objAjax.sendRequest();

    }
}

function _techSpecCmntSave(divid)
{
	var htmlAreaObj = _getAreaObjByDocView(divid);
	var htmlWrkAreaObj = _getWorkAreaDefaultObj();

	if(htmlAreaObj && htmlWrkAreaObj)
	{
		var actMethod = "savecomment";
		var objAjax = htmlAreaObj.getHTMLAjax();
		var objHTMLData = htmlAreaObj.getHTMLDataObj();
		sectionName = objAjax.getDivSectionId();
		//alert("_showSampleTabView \n sectionName  " + sectionName);
	    if(objAjax && objHTMLData)
	    {
	    	var htmlfldName = htmlWrkAreaObj.getDivSectionId();

	    	//alert("getSaveChangeFields : "+ objHTMLData.getSaveChangeFields());
	    	bShowMsg = true;
	        objAjax.setActionMethod(actMethod);
	        objAjax.setActionURL("techspecoverview.do");
	        objAjax.setProcessHandler(_postTechSpecCmntSave);
	        objHTMLData.appendAllCustomContainerDataToRequest(objAjax, divid);
	        objAjax.parameter().add(_screenChangeFileds, objHTMLData.getSaveChangeFields());
        	objHTMLData._appendAllContainerDataToRequest(objAjax);
        	_startSmartTagPopup(htmlfldName, false, null, true);
        	objAjax.sendRequest();
	    }
    }
}

function _postTechSpecCmntSave(objAjax)
{
    //alert("_postTechSpecCmntSave");
    if(objAjax)
    {
        //display the user message when drop downs are not loaded
        _displayProcessMessage(objAjax);
        //alert("_postTechSpecCmntSave: display msg \n objAjax.isProcessComplete() "+ objAjax.isProcessComplete());
        if(objAjax.isProcessComplete())
        {
            _showSmartTagPopup(objAjax);
            //alert("getDocViewId " + objAjax.getDocViewId());
            var htmlAreaObj = _getAreaObjByDocView("2702");

            if(htmlAreaObj)
			{
				var objHTMLData = htmlAreaObj.getHTMLDataObj();
            	objHTMLData.resetChangeFields();
            	_setCmntsIcon(objAjax);
           	}
        }
    }
}

function _techSpecReplyCmnts()
{
	var actMethod ="replycomment";
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();

    if(objAjax)
    {
    	var htmlfldName = htmlAreaObj.getDivSectionId();
    	actMethod += "&keyinfo= " +getComponentKeyInfo();
    	//alert("showView : objAjax "  + objAjax.getDocViewId());
    	_startSmartTagPopup(htmlfldName, false, null, true);
        objAjax.setActionURL("techspecoverview.do");
        objAjax.setActionMethod(actMethod);
        objAjax.attribute().setAttribute("htmlfldName", htmlfldName);
        objAjax.setProcessHandler(_showSmartTagInteractivePopup);

        //alert("sending");
        objAjax.sendRequest();

    }
}

function sortTechSpecComment(fieldName,sec,type, pageNo)
{
	sectionName = sec;
    var htmlAreaObj = _getWorkAreaDefaultObj();
	//alert("htmlAreaObj " + htmlAreaObj);
    var objAjax = htmlAreaObj.getHTMLAjax();

    if(objAjax)
    {
    	var htmlfldName = htmlAreaObj.getDivSectionId();
    	_startSmartTagPopup(htmlfldName, false, null, true);
        objAjax.setActionURL("techspecoverview.do");
        objAjax.setActionMethod("sortcomment&sortColumn="+fieldName+"&sort="+type+"&pageNum="+pageNo);
        objAjax.attribute().setAttribute("htmlfldName", htmlfldName);
        objAjax.setProcessHandler(_showSmartTagInteractivePopup);
        objAjax.sendRequest();
    }
}

function _materialPaletteCommentsPopUp()
{
	if(!isValidRecord(true))
	{
		return;
	}

	objAjax = new htmlAjax();
    objAjax.setActionURL("threadedcomments.do");
    objAjax.setActionMethod("viewcomments");
    objAjax.setProcessHandler("materialPaletteCommentResponse");
    objAjax.parameter().add("parentViewId", 6000);
    objAjax.sendRequest();
}

function materialPaletteCommentResponse()
{
	if(objAjax)
	{
		if(objAjax.isProcessComplete())
		{
			var comments = new TRADESTONE.Comments("Material Palette Comments", objAjax.getResult());
			comments.show();
		}
		objAjax = null;
	}
}

function _colorPaletteCommentsPopUp()
{
	if(!isValidRecord(true))
	{
		return;
	}

	objAjax = new htmlAjax();
    objAjax.setActionURL("threadedcomments.do");
    objAjax.setActionMethod("viewcomments");
    objAjax.setProcessHandler("colorPaletteCommentResponse");
    objAjax.parameter().add("parentViewId", 3500);
    objAjax.sendRequest();
}

function colorPaletteCommentResponse()
{
	if(objAjax)
	{
		if(objAjax.isProcessComplete())
		{
			var comments = new TRADESTONE.Comments("Color Palette Comments", objAjax.getResult());
			comments.show();
		}
		objAjax = null;
	}
}

function _materialLibCommentsPopUp()
{
	if(!isValidRecord(true))
	{
		return;
	}

	objAjax = new htmlAjax();
    objAjax.setActionURL("threadedcomments.do");
    objAjax.setActionMethod("viewcomments");
    objAjax.setProcessHandler("materialLibCommentResponse");
    objAjax.parameter().add("parentViewId", 3300);
    objAjax.sendRequest();
}

function materialLibCommentResponse()
{
	if(objAjax)
	{
		if(objAjax.isProcessComplete())
		{
			var comments = new TRADESTONE.Comments("Material Library Comments", objAjax.getResult());
			comments.show();
		}
		objAjax = null;
	}
}
