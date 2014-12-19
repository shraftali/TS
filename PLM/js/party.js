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

var party = {};

// This function forwards the user to Projections Overview Screen.
// Called from LS Navigation link.
party.showPartyFromNavigation = function showPartyFromNavigation()
{
    // Just a indicator to say the navigation to overview screen is happening
    // via the link on the left side Navigation.
    var src = "&nav=1";
    // Failed on firefox and Safari, adding the global namespace before calling
    // the method.
    party.navigateToParty(src);
}

// src - indicator to indicate from where the navigation is happening to
//       overview screen.
party.navigateToParty = function navigateToParty(src)
{
    var url ="TOOVERVIEW&_nRow=" + _nColLibRow  + src;
    url += "&keyinfo= " +getComponentKeyInfo();
    // alert("url:" + url);
    loadWorkArea("plmparty.do", url);
}
// ------------------------------------------------------------------

party.sortPartyColumn = function sortPartyColumn(fieldName,sec,type, pageNo)
{
    party.sortColumnForSection(fieldName,sec,type, pageNo, "plmparty.do")
}

party.sortColumnForSection = function sortColumnForSection(fieldName,sec,type, pageNo, url)
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    sectionName = sec;
    if(objAjax)
    {
        objAjax.setActionURL(url);
        objAjax.setActionMethod("SORT&sortColumn="+fieldName+"&sort="+type+"&pageNum="+pageNo);
        objAjax.setProcessHandler(party.refreshPageAfterSort);
        objAjax.sendRequest();
    }
}

party.refreshPageAfterSort = function refreshPageAfterSort(objAjax)
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

party.partysubmit = function partysubmit(act)
{
    var formData = "";
    var chgFlds = getval("chgflds");

    var objAjax = new htmlAjax();
    objAjax.parameter().add("chgflds", chgFlds);
    var fldname = new Array();
    var fvalue = new Array();

    fetchSelectedDetailRows(objAjax);
    var chgFldsArray = chgFlds.split(',');

    for(var i = 0 ; i < chgFldsArray.length-1 ; i++)
    {
        fldname[i] = chgFldsArray[i];
        fvalue[i] = document.getElementById(fldname[i]).value;
        objAjax.parameter().add(fldname[i], encodeURI(fvalue[i]));
    }
    jax_ReLoadWorkArea(objAjax);
}

party.fetchSelectedDetailRows = function fetchSelectedDetailRows(objAjax)
{
    var obj = getobj('R');

    if(typeof(obj) == 'undefined')
    {
        return;
    }

    if((typeof obj.length) == 'undefined')
    {
        if (obj.checked == true)
        {
            objAjax.parameter().add(obj.name, encodeURI(obj.value));
        }
    }
    else
    {
        for (i=0; i < obj.length; i++)
        {
            if (obj[i].checked == true)
            {
                objAjax.parameter().add(obj[i].name,  encodeURI(obj[i].value));
            }
        }
    }
}

party.jax_ReLoadWorkArea = function jax_ReLoadWorkArea(objAjax)
{
    var url = "partyoverview.do";
    var actionMethod = "save";
    objAjax.setActionURL(url);
    objAjax.setActionMethod(actionMethod);
    objAjax.setProcessHandler(_defaultWorkAreaSave);
    objAjax.sendRequest();
}

party.tabbedQuery = function tabbedQuery()
{
    submitUrl2('tabqueryviewer.do?method=exequery&amp;tabquery_id=query.tab.partychanges&amp;dvid=200','H','N');
}

party.showCommentsPopUp  = function showCommentsPopUp()
{
  objAjax = new htmlAjax();
  objAjax.setActionURL("threadedcomments.do");
  objAjax.setActionMethod("viewcomments");
  //Renamed the method name
  objAjax.setProcessHandler("partyCommentResponse");
  objAjax.parameter().add("parentViewId", 212);
  objAjax.sendRequest();
}

function partyCommentResponse()
{
	if(objAjax)
	{
		if(objAjax.isProcessComplete())
		{
			var comments = new TRADESTONE.Comments("Party Comments", objAjax.getResult());
			comments.show();
		}
		objAjax = null;
	}
}

function setPartyType(partyType,qualifier)
{
	
	partyTypeForCompetencyNav=partyType;
	partyTypeQualifier=qualifier;
	
	
}
