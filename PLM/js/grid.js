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
/**
 * The search function for Grid screen
 */


var GRD={}

GRD.shGrid=function(row,div,currrow,imgId,expImg,colImg,keyinfo,cellid,level,indx){
	
	//alert("row"+row+"div"+div+"in"+indx);
	//alert("jssscript"+"SO.shGrid('"+row+"','"+div+"','"+sectionname+"','"+imgId+"','"+expImg+"','"+colImg+"','"+keyinfo+"','"+cellid+"','"+level+"','"+indx+"')");
	var r1 = $("#"+row).show();
	$("#"+currrow).after($(r1));
	var obj = getElemnt(imgId);
	//alert(obj.src +"<----->"+expImg);
	
	var d = getElemnt(div);
	if (d != null)
	{//	alert("visible");
		d.style.visibility="visible";
		d.style.display="block";
	}
	var method='';
	if(obj && obj.src.indexOf( expImg) > 0 ) 
	{
		$("#"+row).css("display","none");
		$("#"+row).css("display","none");
		var im= $('#'+cellid).find('img');
		$(im).remove();
		$('#'+cellid).prepend('<img id="'+imgId+'" src="'+colImg+'" />');
		method="REMOVE_EXP&mapId=expDtlId&soId="+soId;
		
	}
	else
	{
		
		method="showsubgrid&keyinfo="+keyinfo+"&index="+indx+"&imgId="+imgId+"&level="+level;
     	var im= $('#'+cellid).find('img');
		$(im).remove();
		$('#'+cellid).prepend('<img id="'+imgId+'" src="'+expImg+'" />');
	
	}
	
	var objAjax = new htmlAjax();
	objAjax.setActionURL("costoptimization.do");
    objAjax.setActionMethod(method);
    objAjax.parameter().add("divId",div);
    objAjax.setProcessHandler(GRD.dDtl);
    objAjax.sendRequest();
}
GRD.dDtl =function(objAjax)
{
	var divId = objAjax.parameter().getParameterByName("divId");

	if(objAjax)
	{
	
		if(objAjax.isProcessComplete())
		{
			
			$("#"+divId).html(objAjax.getResult());			
			
		}
		if(bShowMsg==true)
	   	{
	   		msgInfo = objAjax.getAllProcessMessages();
		    if(msgInfo!="")
		    {
		        _displayProcessMessage(objAjax);
		    }
	   	}
		var respCall = objAjax.getResponseHeader("RESP");
		
		eval(respCall);
	

		objAjax = null;
	}
}


var search;

GRD.createSearchObject=function (docViewId)
{
	search=new advancedSearch(docViewId);
}


GRD.search= function (secId, docView, url)
{
	//alert("Search fMCunction here-->"+secId +" docView -->"+docView);
	//alert("clicked url is:"+url);
	if (GRD.mt())
	{
		var objAjax = new htmlAjax();
		var htmlErrors = objAjax.error();
		objAjax.error().addError("warningInfo", "Please enter your search criteria.", false);
		messagingDiv(htmlErrors);
		return;
	}
	var areaObj =_getAreaObjByDocView(docView);
	//alert(docView);
	var objdata = areaObj.getHTMLDataObj();
	var objAjax = areaObj.getHTMLAjax();
	objdata.setAppendContainerData(true);
	//alert("new data"+search.getCriteriaSearchString());
	var crtSrchStr=search.getCriteriaSearchString();
	//alert("search.crtSrchStr"+crtSrchStr);
	if(crtSrchStr.length>0 || colorSecConds.length>0)
		objdata._mHasUserModifiedData=true;
	bShowMsg = true;
	//GRD.setDataToChangeFields(search,objdata);
	var criterias=encodeURIComponent(crtSrchStr);		
	//alert(url+"objAjax"+objAjax);
	objAjax.setActionURL(url);
	if(crtSrchStr==false)
	{
		//alert("inside if");
		objAjax.setActionMethod("SEARCH");
	}
	else
	{
		//alert("inside else");
		objAjax.setActionMethod("SEARCH&criteria="+criterias);
	}
	//alert("before search");
	objAjax.setProcessHandler(GRD.pResp);
	//alert("_getCriteriaSearchString"+search._getCriteriaSearchString);
	//alert("afert pResp")
	objdata.performSaveChanges(GRD.pResp,objAjax);
	//alert("done:crrr::"+search.getCriteriaSearchString());
	//alert(objdata._mHasUserModifiedData);
	if(objdata._mHasUserModifiedData){
		toggleCollapExpand(Collapimg_Id,collapSection_Search, imgDownArrow, imgRightArrow);
	}
	
}

GRD.pResp =function(objAjax)
{
	if(objAjax)
	{
		//alert(objAjax.isProcessComplete());
		if(objAjax.isProcessComplete())
		{
			$("#MainSection_divCollapsable").html(objAjax.getResult());
		}
		//alert(bShowMsg);
		if(bShowMsg==true)
	   	{
	   		msgInfo = objAjax.getAllProcessMessages();
		    if(msgInfo!="")
		    {
		        _displayProcessMessage(objAjax);
		    }
	   	}
		
	}
	
}


/**
 * Clear function - Reset the values entered for search
 */
GRD.clr = function (docView)
{
	$('#_SearchSection input').val('');
	var container = document.getElementById('_SearchSection');
    var children = container.getElementsByTagName('select');
    for (var i = 0; i < children.length; i++) {
        children[i].selectedIndex = 0;
    }
    var areaObj =_getAreaObjByDocView(docView);
	var objdata = areaObj.getHTMLDataObj();
	objdata._mHasUserModifiedData=false;
	objdata.resetChangeFields();
	//search._cancelSearch(docView);
	search.clearSearchString();	
}

GRD.eKey = function (e,secId, docView,obj,url)
{
	//alert("SO.keyPressSearchFunc"+url); 
	var key;      
     if(window.event) {
		key = window.event.keyCode; //IE
	 } else {
		key = e.which;			//firefox      
	 }
     
     if (e && e.stopPropagation) //if stopPropagation method supported
			e.stopPropagation()
		else
			event.cancelBubble=true;
     
     if(key == '13')
	 {
    	 if (obj)
    	 {
    	 	obj.onchange();
    	 }
    	 GRD.search(secId, docView,url);
	 }
}

GRD.mt = function mt()
{
	var $all = $("#_SearchSection input:text");
   // var $emptyTxt = $all.filter('[value=""]');
  //Jyothi:Start
    var $emptyTxt = $all.filter(function(index, el){ 
        return el.value == '';
    });
    //Jyothi :End
    var $allSel = $("#_SearchSection select");
    var selLen = $allSel.length;
    for (i=0; i < selLen; i++)
    {
    	if ($allSel[i].selectedIndex > 0)
    	{
    		return false;
    	}
    }
    if ($emptyTxt.length == 0) {
    	return true;            
    } else if ($all.length == $emptyTxt.length) {            
    	return true;
    } else {
    	return false;
    }

}


