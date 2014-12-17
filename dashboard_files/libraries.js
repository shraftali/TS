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

/*The function to show libraries tools area on click of LIbrarie Button on tool bar
*/
function loadLibrariesArea(id)
{
	//alert(id);
	makeButtonsInactive(id);	
	loadToolArea('libraries.do','AJAXVIEW');
}
/*The function to show library section
*/
function showLibrary(sec,selId,txtval)
{   
    
    var txtSrch=getElemnt('_toolLibSrchTxt');
    if(!txtval)
    {
    	txtSrch.value="";
    }
    var nmLbl=getElemnt("_selname");
	var allLbl=getElemnt("_allLbl");
	//alert(nmLbl);
	if(nmLbl)
		nmLbl.innerHTML="&nbsp;&nbsp;";
	if(allLbl)
		allLbl.innerHTML="&nbsp;&nbsp;";
    var sel=getElemnt(selId);
    var docId=sel[sel.selectedIndex].value;
    //For saved searches link
    //createSearchObject(docId);
    if(docId!='-1')
    {
	    sectionName = sec;
	    var objAjax = new htmlAjax();
	    if(objAjax)
	    {
	        objAjax.setActionURL('libraries.do');
	        if(txtval)
	        	objAjax.setActionMethod('SHOWLIB&docId='+docId+'&srchstr='+txtval);
	        else	
	        	objAjax.setActionMethod('SHOWLIB&docId='+docId);
	        objAjax.setProcessHandler(showLibrariesSection);
	        objAjax.sendRequest();
	    }
    }
}
/*Post process of showLibrary function to display the library section
*/
function showLibrariesSection(objAjax)
{
    if(objAjax)
    {
        objMsgDiv = new messagingDiv(objAjax.error());
        var toolSection=getElemnt("_divToolArea");
        toolSection.innerHTML=objAjax.getHTMLResult();
        //prompt("",objAjax.getHTMLResult());
        eval(objAjax.getScriptResult());
        var allLbl=getElemnt("_allLbl");
		allLbl.innerHTML="ALL";
    }
}
/*The function to display different views.
*/
function showLibItemsView(sec,view,docId)
{
    sectionName = sec;
    var objAjax = new htmlAjax();
    if(objAjax)
    {
        objAjax.setActionURL('libraries.do');
        objAjax.setActionMethod('SHOWVIEW&docId='+docId+'&view='+view);
        objAjax.setProcessHandler(showLibrariesSection);
        objAjax.sendRequest();
    }
}
/*The function balnks the value for the passed object
*/
function setBlank(obj)
{
	obj.value='';
}
/*The function to change the text cntent to uppercase 
*/
function changeToUCase(obj)
{
	obj.value=obj.value.toUpperCase();
}
/*This function is called on click of the Search button
*/
function toolAreaSearch(sec,id,txtid)
{
	var txtobj=getElemnt(txtid);
	showLibrary(sec,id,txtobj.value);
	
}
/*This function used to display the colors inside the palette
*/
function showPaletteContents(docId,keys,sec,name,view)
{
	if(!view)
	{
		//Default medium view id
		view='2';
	}
	sectionName = sec;
    var objAjax = new htmlAjax();
    if(objAjax)
    {
        objAjax.setActionURL('libraries.do');
        objAjax.setActionMethod('SHOW_PALETTE_CONTENTS&docId='+docId+'&keys='+keys+'&view='+view+'&srhName='+name);
        objAjax.setProcessHandler(showLibrariesSection);
        objAjax.sendRequest();
    }
}



