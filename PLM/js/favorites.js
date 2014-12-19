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


//////Tracker#:17904 SECURITY ON RECENTLY VIEWED AND FAVORITES 

function _gotoPLMShortCut(docid, docviewid, keyinfo, rowCnt)
{
	//alert("_gotoPLMShortCut -> rowCnt " + rowCnt);
	 // Tracker#: 18355 - SAFARI/FIREFOX - CLICKING ON TECH SPEC IN RECENTLY VIEWED DOCUMENTS CAUSES ERROR MESAGE
	 // Using getAttribute instead of using dot notation to access attribute directly.
	 var rowid = 0;
	 
	 //Tracker#:18289 checking null for the srcElmnt
	 if(srcElmnt)
	 {
	 	rowid = srcElmnt.getAttribute("rowno",0);
	 }
	 // Encode keyinfo to be sure value is interpreted correctly.
	 var keyinfo = encodeURIComponent(keyinfo);
     var urlparams = '&linkrowid='+rowid+'&docid='+docid+'&docviewid='+docviewid+'&keyinfo='+keyinfo;
     var navurl ='verifylinkaccess&'+ urlparams;
     
     urlparams = '$linkrowid='+rowid+'$docid='+docid+'$docviewid='+docviewid+'$keyinfo='+keyinfo;
     var targetMethod = "viewfromquicklinks" + urlparams;
     
     //alert("urlparams " +urlparams);
         
     bShowMsg = true;
     var objAjax = new htmlAjax();
     objAjax.setActionMethod(navurl);
     objAjax.setActionURL("navigation.do");
     var attrObj = objAjax.attribute();
     
     attrObj.setAttribute("targetMethod", targetMethod);
     attrObj.setAttribute("docviewid", docviewid);
     attrObj.setAttribute("docid", docid);	
     attrObj.setAttribute("rowCnt", rowCnt);	
     
     objAjax.setProcessHandler(_gotoPLMShortCut_callback);	
     objAjax.sendRequest();
}
 
function _gotoPLMShortCut_callback(objAjax)
{  
     //alert("_gotoPLMShortCut_callback called");
     //alert(" _gotoPLMShortCut_callback: \n "+objAjax.isProcessComplete());
         
     closewaitWindow();
     objAjax._hideWaitWindow();
     
     if(objAjax.isProcessComplete())
     {
    	  var attrObj = objAjax.attribute();
    	  
          var targetMethod = attrObj.getAttribute("targetMethod");
          var docviewid = attrObj.getAttribute("docviewid");
          var docid = attrObj.getAttribute("docid");
          var rowCnt = attrObj.getAttribute("rowCnt");
          var targeturl = _getQuickLinksTagetURL(docid,docviewid,rowCnt);
          
          targetMethod = _getQuickLinksTagetMethod(docid, docviewid, rowCnt, targetMethod);
          
          //alert("_gotoPLMShortCut_callback :- targetMethod " + targetMethod + "\n targeturl = " + targeturl);
          
          _gotoPMLScreen(targeturl, targetMethod); 
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
     	objAjax._hideWaitWindow(); 	
         bShowMsg= false;
     }
}

function _getQuickLinksTagetMethod(docid, docviewid, rowCnt, targetMethod)
{
	var retVal = targetMethod;
 	if((docid==100) && (docviewid==132))
 	{
 		if(rowCnt>1){
 			retVal = "view"; 
 		}			
 	}
 	else if((docid==300) && (docviewid==321))
 	{
 		if(rowCnt>1){
 			retVal = "view"; 
 		}	
 	}
 	else if((docid==200) && (docviewid==212))
 	{
 		if(rowCnt>1){
 			retVal = "view"; 
 		}	
 	}
	return retVal;
}

//Tracker#18257
//Checking for both doc_id 
function _getQuickLinksTagetURL(docid, docviewid, rowCnt)
{
    //alert("docviewid="+docviewid);
 	var retVal = "";
 	if((docid==100) && (docviewid==132))
 	{
 		retVal = "techspecoverview.do"; 
 		if(rowCnt>1){
 			retVal = "advsearch.do"; 
 		} 					
 	}
 	else if((docid==100) && (docviewid==155))
 	{
 		retVal = "materialquoteoverview.do"; 
 	}
 	else if((docviewid==2904) || (docid==2900))
 	{
 		retVal = "coloroverview.do"; 
 	}
 	else if((docid == 3500)||(docviewid == 3506) || (docviewid == 3509) || (docviewid == 3510)
 	 || (docviewid == 3511) || (docviewid == 3512))
 	{
 		retVal = "colorpaletteoverview.do";
 	}
 	else if(docid==4200)
 	{
 		retVal = "artworkoverview.do";
 	}
 	else if((docviewid==2406) ||(docviewid == 2408) ||(docviewid == 2409) ||(docid == 2400))
 	{
 		retVal = "fitevaloverview.do";
 	}
 	else if(docid==3400)
 	{
 		retVal = "labdipoverview.do";
 	}
 	else if((docid == 3300)||(docviewid == 3303) || (docviewid == 3322) || (docviewid == 3320) 
 	|| (docviewid == 3312) || (docviewid == 3319) || (docviewid == 3311) || (docviewid == 3313) || (docviewid == 3321))
 	{
 		retVal = "materialoverview.do";
 	}
 	//Tracker#: 18616 ABILITY TO ADD SAMPLES TO FAVORITES
 	else if((docid==4000) || (docviewid==4007))
 	{
 		retVal = "sampleeval.do";
 	}
 	//Tracker#18615
 	else if((docviewid == 6009)||(docid == 6000))
 	{
 		retVal = "materialpaletteoverview.do";
 	}
 		else if((docviewid == 5800))
 	{
 		retVal = "projectionsoverview.do";
 	}
 	//Tracker#: 19354 ADD  CAPACITY TO FAVORITES AND RECENTLY VIEWED
 	else if((docid==7300) && (docviewid==7300))
 	{
 		retVal = "capacityoverview.do"; 
 	}
 	//Tracker#: 19355 ADD  COMPETENCY TO FAVORITES AND RECENTLY VIEWED
 	else if((docid==7000) && (docviewid==7000))
 	{
 		retVal = "competencyoverview.do"; 
 	}
 	//Tracker#: 19352 ADD TOTAL CAPACITY PROJECTIONS TO RECENTLY VIEWED AND FAVORITES
 	else if((docid==6800) && (docviewid==6801 || docviewid==6800))
 	{
 		retVal = "capacityprojectionsoverview.do"; 
 	}//Tracker#:21362 
 	else if((docid==300) && (docviewid==321))
 	{
 		retVal = "purchaseorderoverview.do";  
 		
 		if(rowCnt>1){
 			retVal = "advsearch.do"; 
 		}
 	}
 	else if((docid==200) && (docviewid==212))
 	{
 		retVal = "partyoverview.do"; 
 		
 		if(rowCnt>1){
 			retVal = "advsearch.do"; 
 		}
 	}
 	return retVal;
}
 
 
//OLD LINKS FOR THE RVD AND FAVORITE STARTS***************************************
//Tracker#:17785 Moved all the RVD and Favorite link functions from navigation.js 
//These functions are depracated in new implemnetation and will removed permanently
//in @version : v2011 r4 onwards 
//*******************************************************************************

// Tracker#: 13518 ABILITY TO ADD TECHSEPC TO RECENTLY VIEWED DOCUMENTS
// Added for going to the tech spec overview screen from the recently viewed tech spec
// and favourites on the dashboard. Implimentation same as going to Tech spec from RFQ screen
// this function creates the url and send it to the _gotoPMLScreen which takes care of opening the 
// tech spec overview screen. 
function _gotoTechSpecFromShortCut(owner, reqNo)
{ 	
	var targetMethod = null;
    targetMethod = 'viewFromRFQ$OWNER='+owner+'$REQUEST_NO='+reqNo;   
    var url ='recentlyviewed&docviewId=132&OWNER='+owner+'&REQUEST_NO='+reqNo;
    
   	var objAjax = new htmlAjax();
   	objAjax.setActionMethod(url);   	
   	bShowMsg = true;   	
	objAjax.setActionURL("navigation.do");
	//alert("targetMethod " + targetMethod);
	objAjax.attribute().setAttribute("targetMethod", targetMethod);	
	objAjax.attribute().setAttribute("navInfo", "techspecoverview.do");	
	objAjax.setProcessHandler(_showDashPage);	
	objAjax.sendRequest();
}

//Tracker #: 17272
function _nav_toMaterialQuote(owner, reqNo)
{
	var targetMethod = null;
    targetMethod = 'navFromDashboard$OWNER='+owner+'$request_no='+reqNo;   
    var url ='recentlyviewed&docviewId=155&OWNER='+owner+'&REQUEST_NO='+reqNo;
    
   	var objAjax = new htmlAjax();
   	objAjax.setActionMethod(url);   	
   	bShowMsg = true;   	
	objAjax.setActionURL("navigation.do");
	//alert("targetMethod " + targetMethod);
	objAjax.attribute().setAttribute("targetMethod", targetMethod);	
	objAjax.attribute().setAttribute("navInfo", "materialquoteoverview.do");	
	objAjax.setProcessHandler(_showDashPage);	
	objAjax.sendRequest();
}

//Tracker#: 17270 
//To navigate from favorites(on dashboard) to Colorlib overview screen.
function _nav_gotoColorLib(colorNo)
{
	var targetMethod = null;
	//Changed the method name to navFromQuickLinks
    targetMethod = 'navFromQuickLinks$COLOR_NO='+colorNo;
    var url ='recentlyviewed&docviewId=2904&COLOR_NO='+colorNo;;
   	var objAjax = new htmlAjax();
   	objAjax.setActionMethod(url);   	
   	bShowMsg = true;   	
	objAjax.setActionURL("navigation.do");
	//alert("targetMethod " + targetMethod);
	objAjax.attribute().setAttribute("targetMethod", targetMethod);	
	objAjax.attribute().setAttribute("navInfo", "coloroverview.do");	
	objAjax.setProcessHandler(_showDashPage);	
	objAjax.sendRequest();
}

//Tracker#: 15556 
//To navigate from favorites(on dashboard) to Submit overview screen.
function _nav_gotoSubmit(ldrNo)
{
	var targetMethod = null;
	//Changed the method name to navFromQuickLinks
    targetMethod = 'navFromQuickLinks$LDR_NO='+ldrNo;
    var url ='recentlyviewed&docviewId=3400&LDR_NO='+ldrNo;
   	var objAjax = new htmlAjax();
   	objAjax.setActionMethod(url);   	
   	bShowMsg = true;   	
	objAjax.setActionURL("navigation.do");
	//alert("targetMethod " + targetMethod);
	objAjax.attribute().setAttribute("targetMethod", targetMethod);	
	objAjax.attribute().setAttribute("navInfo", "labdipoverview.do");	
	objAjax.setProcessHandler(_showDashPage);	
	objAjax.sendRequest();
}

//Tracker#: 17271 ABILITY TO ADD ARTWORK LIBRARY RECORDS TO FAVORITES 
//To navigate from favorites to Artworklib overview screen.
//Changed the method name
function _nav_gotoArtworkLib(artworkNo)
{
	var targetMethod = null;
	//Changed the method name to navFromQuickLinks
    targetMethod = 'navFromQuickLinks$ARTWORK_NO='+artworkNo;
    var url ='recentlyviewed&docviewId=4200&ARTWORK_NO='+artworkNo;
   	var objAjax = new htmlAjax();
   	objAjax.setActionMethod(url);   	
   	bShowMsg = true;   	
	objAjax.setActionURL("navigation.do");
	//alert("targetMethod " + targetMethod);
	objAjax.attribute().setAttribute("targetMethod", targetMethod);	
	objAjax.attribute().setAttribute("navInfo", "artworkoverview.do");	
	objAjax.setProcessHandler(_showDashPage);	
	objAjax.sendRequest();	
}

//Tracker#: 17273 ABILITY TO ADD COLOR PALETTES TO FAVORITES
//To navigate from favorites to ColorPalette overview screen.
//Changed the method name to navFromQuickLinks
function _nav_gotoColorPalette(colorpalNo)
{
	var targetMethod = null;
	//Changed the method name to navFromQuickLinks
    targetMethod = 'navFromQuickLinks$PALETTE_NO='+colorpalNo;
    var url ='recentlyviewed&docviewId=3500&PALETTE_NO='+colorpalNo;
   	var objAjax = new htmlAjax();
   	objAjax.setActionMethod(url);   	
   	bShowMsg = true;   	
	objAjax.setActionURL("navigation.do");
	//alert("targetMethod " + targetMethod);
	objAjax.attribute().setAttribute("targetMethod", targetMethod);	
	objAjax.attribute().setAttribute("navInfo", "colorpaletteoverview.do");	
	objAjax.setProcessHandler(_showDashPage);	
	objAjax.sendRequest();	
}

//Tracker#: 14989 REQUEST FOR FIT EVAL AS RECENTLY VIEWED/FAVORITE DOC
//To navigate from favorites to FitEval overview screen.
//Changed the method name to navFromQuickLinks
function _nav_gotoFitEval(fitevalid)
{
	var targetMethod = null;
	//Changed the method name to navFromQuickLinks
    targetMethod = 'navFromQuickLinks$keyinfo='+"FIT_EVAL_ID"+_KEY_VALUE_FIELDS_SEPERATOR+fitevalid;
    var url ='recentlyviewed&docviewId=2400&FIT_EVAL_ID='+fitevalid;
   	var objAjax = new htmlAjax();
   	objAjax.setActionMethod(url);   	
   	bShowMsg = true;   	
	objAjax.setActionURL("navigation.do");
	//alert("targetMethod " + targetMethod);
	objAjax.attribute().setAttribute("targetMethod", targetMethod);	
	objAjax.attribute().setAttribute("navInfo", "fitevaloverview.do");	
	objAjax.setProcessHandler(_showDashPage);	
	objAjax.sendRequest();	
}

//Tracker#: 17847 ABILITY TO ADD MATERIAL LIBRARY TO FAVORITES
//To navigate from favorites to material library overview screen.
function _nav_gotoMaterialLibrary(materialno)
{
	var targetMethod = null;
	//Changed the method name to navFromQuickLinks
    targetMethod = 'navFromQuickLinks$MATERIAL_NO='+materialno;
    var url ='recentlyviewed&docviewId=3300&MATERIAL_NO='+materialno;
   	var objAjax = new htmlAjax();
   	objAjax.setActionMethod(url);   	
   	bShowMsg = true;   	
	objAjax.setActionURL("navigation.do");
	//alert("targetMethod " + targetMethod);
	objAjax.attribute().setAttribute("targetMethod", targetMethod);	
	objAjax.attribute().setAttribute("navInfo", "materialoverview.do");	
	objAjax.setProcessHandler(_showDashPage);	
	objAjax.sendRequest();	
}

function _nav_gotoOrder(profomapo)
{
	var targetMethod = null;	
    targetMethod = 'navFromQuickLinks$keyinfo='+"PROFOMA_PO"+_KEY_VALUE_FIELDS_SEPERATOR+fitevalid;
    var url ='recentlyviewed&docviewId=300&PROFOMA_PO='+profomapo;
   	var objAjax = new htmlAjax();
   	objAjax.setActionMethod(url);   	
   	bShowMsg = true;   	
	objAjax.setActionURL("navigation.do");
	//alert("targetMethod " + targetMethod);
	objAjax.attribute().setAttribute("targetMethod", targetMethod);	
	objAjax.attribute().setAttribute("navInfo", "purchaseorderoverview.do");	
	objAjax.setProcessHandler(_showDashPage);	
	objAjax.sendRequest();	
}
function _showDashPage(objAjax)
{  
	//alert("_showDashPage called");
    //alert(" _showDashPage: \n "+objAjax.isProcessComplete());
      
    closewaitWindow();
    objAjax._hideWaitWindow();
    
    if(objAjax.isProcessComplete())
    {
    	var targetMethod = objAjax.attribute().getAttribute("targetMethod");
    	var navInfo = objAjax.attribute().getAttribute("navInfo");
    	//alert("targetMethod " + targetMethod);
        _gotoPMLScreen(navInfo, targetMethod); 
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
    	objAjax._hideWaitWindow(); 	
        bShowMsg= false;
    }
}
//Tracker#:21398
//Go  to PLM Order detail tab
//Using the same function to show overview tab
function _gotoPLMPO(owner, profomapo, docviewId, workarea, method)
{ 	
	var targetMethod = null;
    targetMethod = method+'$OWNER='+owner+'$PROFOMA_PO='+profomapo;   
    var url ='recentlyviewed&docviewId='+docviewId+'&OWNER='+owner+'&PROFOMA_PO='+profomapo;
    
   	var objAjax = new htmlAjax();
   	objAjax.setActionMethod(url);   	
   	bShowMsg = true;   	
	objAjax.setActionURL("navigation.do");
	//alert("targetMethod " + targetMethod);
	objAjax.attribute().setAttribute("targetMethod", targetMethod);	
	objAjax.attribute().setAttribute("navInfo", workarea);	
	objAjax.setProcessHandler(_showDashPage);	
	objAjax.sendRequest();
}

//Tracker#:24522  
//Go  to PLM Party tab
//Using the same function to show overview tab
function _gotoPLMParty(owner, partyId, docviewId, workarea, method)
{ 	
	var targetMethod = null;
  targetMethod = method+'$OWNER='+owner+'$PARTY_ID='+partyId;   
  var url ='recentlyviewed&docviewId='+docviewId+'&OWNER='+owner+'&PARTY_ID='+partyId;
  
 	var objAjax = new htmlAjax();
 	objAjax.setActionMethod(url);   	
 	bShowMsg = true;   	
	objAjax.setActionURL("navigation.do");
	//alert("targetMethod " + targetMethod);
	objAjax.attribute().setAttribute("targetMethod", targetMethod);	
	objAjax.attribute().setAttribute("navInfo", workarea);	
	objAjax.setProcessHandler(_showDashPage);	
	objAjax.sendRequest();
}
//OLD LINKS FOR THE RVD AND FAVORITE ENDSS***************************************
//These functions are depracated in new implemnetation and will 
//removed permently in @version : v2011 r4 onwards 
//*******************************************************************************
