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
Function called from color palette to save the color palette with dragged in elements
*/

function applyPanelColorPalette()
{
	var url = "cpapplydragdrop";
 	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	sectionName = objAjax.getDivSectionId();
	//alert("sectionName  " + sectionName);
	//alert("clrArray  " + clrArray);
	//alert("clrArray.length  " + clrArray.length);
	
	if(clrArray.length < 1 && artArray.length < 1)
	{
		return false;
	}
    if(objAjax && objHTMLData)
    {
        bShowMsg = true;
        var colors=getComps(clrArray);
        var artworks = getComps(artArray);
        //Tracker#:17096 REGRESSION - DRAG AND DROP WITH DATA WHICH HAS SPECIAL CHARACTER(E.G %) NOT LONGER WORKING.
        //Encoding the query string
        //colors=encodeURIComponent(colors);
        //artworks=encodeURIComponent(artworks);
        //Tracker#:16592 - passing delimiter to action class to use when constructing array (replacing hardcoded delim)
        //Tracker#18331 REGRESSION:UNABLE TO DRAG & DROP ARTWORKS THAT HAVE '&' IN ARTWORK COMBO NAME
		//Using Ajax call instead of loadWorkArea function and passing the parameter separately
        if(objAjax)
    	{
        	objAjax.setActionURL('colorpaletteoverview.do');
        	objAjax.setActionMethod(url);
        	objAjax.parameter().add("colors", colors);
        	objAjax.parameter().add("atnbtn", actionId);
        	objAjax.parameter().add("artworks", artworks);
        	objAjax.parameter().add("delimiter", _grdCompSep);
        	objAjax.setProcessHandler(_showWorkArea);
        	objAjax.sendRequest();
        }
    }
    cancelSetting();
}
// Tracker#:14435 ISSUE WITH SAVE PROMPT,SYSTEM DISPLAYS'PREVIOUS ACTION ENCOUNTERED ERROR' 
// moved these function from colorlib.js
function sortPaletteColumn(fieldName,sec,type, pageNo, alias)
{
    //alert("sortPaletteColumn called");
    sectionName = sec;
	//Tracker#: 16691 MATERIAL PROJECTIONS - ENTER DATA, CLICK SORT, ROWS SORTED DATA IS LOST
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax =  htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    if (objAjax) {
		//Tracker#: 16691 MATERIAL PROJECTIONS - ENTER DATA, CLICK SORT, ROWS SORTED DATA IS LOST
		// Changes have been done, prompt the User
		// to decide whether the User will Save or
		// continue with the sorting.
		var url = "SORT&sortColumn=" + fieldName + "&sort=" + type + "&pageNum=" + pageNo + "&alias=" + alias;
		if (objHTMLData != null && objHTMLData.isDataModified()) {
			var htmlErrors = objAjax.error();
			htmlErrors.addError("confirmInfo", szMsg_Changes, false);
			messagingDiv(htmlErrors, "saveWorkArea()", "laodPLMSortColumn('colorpalette.do','" + url + "',_showColorPalettePage);");
			return;
		}
		else {
			laodPLMSortColumn('colorpalette.do', url, _showColorPalettePage);
		}
	}
}

//Tracker#:22043 COLUMN SORTS DO NOT WORK FOR COLOR PALETTE DETAIL
//Handle sorting for the overview screen detail section.
function sortPaletteOverviewColumn(fieldName,sec,type, pageNo, alias, fltrowsetdefn)
{
	//alert(fltrowsetdefn);
	var url ="SORT&sortColumn="+fieldName+"&sort="+type+"&fltRowsetDefn="+fltrowsetdefn;
    loadWorkArea("colorpaletteoverview.do", url);  
}

//Function for approvePallete
function approvePalette()
{
	var url = "approvepalette";

	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	sectionName = objAjax.getDivSectionId();
	   //alert("sectionName  " + sectionName);
    if(objAjax && objHTMLData)
    {
    	//alert("inside calling");
    	bShowMsg = true;
    	docview = objAjax.getDocViewId();
    	if(docview==3502)
    	{
    			if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
    			{
			   		var htmlErrors = objAjax.error();
			   		objAjax.error().addError("warningInfo", szMsg_Sel_Palette, false);
			   		messagingDiv(htmlErrors);
			   		return;
			   	}
			   	else
			   	{
			   	 	objAjax.setActionURL("colorpalette.do");
			   	 	objAjax.setActionMethod(url);
			   	 	objAjax.setProcessHandler(_showColorLibPage);
			        objHTMLData.performSaveChanges(_showColorLibPage, objAjax);
			        if(objAjax.isProcessComplete())
			        {
			            objHTMLData.resetChangeFields();
			        }
		   	 	}
    	}
    	else if((docview == 3500)||(docview == 3506) || (docview == 3509) || (docview == 3510) || (docview == 3511) || (docview == 3512))
    	{
    		// Tracker#:12630 ISSUES ON COLOR PALETTE BLANK RECORD
	   		// Check for valid record to execute process.
    		if(!isValidRecord(true))
    		{
    			return;
    		}
	   		loadWorkArea("colorpaletteoverview.do", url);
	        if(objAjax.isProcessComplete())
	        {
	            objHTMLData.resetChangeFields();
	        }
    	}
    }
}

// This function forwards the user to ColorPalette Overview Screen.
function showPaletteOverview(obj)
{
	Process.showOverview(obj, "colorpalette.do", "TOOVERVIEW");
}

//Function for createPallete
function createPalette()
{
	Process.execute("createpalette", "colorpaletteoverview.do");
}


//Function copyPalette
function copyPalette()
{

	if(!isValidRecord(true))
	{
			return;
	}
	Process.execute("copypalette", "colorpaletteoverview.do");
}

// This function forwards the user to ColorOverview Screen.
function showColorOverviewFromPalette(obj)
{
	 Process.showOverview(obj, "colorpaletteoverview.do", "TOOVERVIEW");
}

function showPaletteView(view, pageNo, sec)
{
    sectionName = sec;
    var url = "HANDLEVIEW&pageNum="+pageNo+"&view="+view;

	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	//alert("showPaletteView");
    if(objAjax && objHTMLData)
    {
    	//alert("inside calling");
    	//bShowMsg = true;
       	loadWorkArea("colorpaletteoverview.do", url);
    }
}


//dropSelectedColors
function dropSelectedColors()
{
	var url = "dropcolor";
	var docview;
	closeMsgBox();

	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objAjax.getDivSectionId();
    //alert("sectionName  " + sectionName);

	    if(objAjax && objHTMLData)
	    {
	    	docview = objAjax.getDocViewId();
	    	//alert("docview: "+docview);
	    	//alert("inside calling");
	    	bShowMsg = true;
	    	 if((docview==3500) || (docview==3506) || (docview==3509) || (docview==3510) || (docview==3511) || (docview==3512))
	        {
	        	objAjax.setActionURL("colorpaletteoverview.do");
	        }
	        objAjax.setActionMethod(url);
	        objAjax.setProcessHandler(_showColorLibPage);
	        objHTMLData.performSaveChanges(_showColorLibPage, objAjax);

	        if(objAjax.isProcessComplete())
            {
                objHTMLData.resetChangeFields();
            }
	     }
}

//approveColors
function approveColors()
{
	var url = "approvecolor";
	var docview;
	closeMsgBox();

	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objAjax.getDivSectionId();
    //alert("sectionName  " + sectionName);

	    if(objAjax && objHTMLData)
	    {
	    	// Tracker#:12630 ISSUES ON COLOR PALETTE BLANK RECORD
	   		// Check for valid record to execute process.
	    	if(!isValidRecord(true))
    		{
    			return;
    		}
	    	docview = objAjax.getDocViewId();
	    	//alert("docview: "+docview);
	    	//alert("inside calling");
	    	bShowMsg = true;
	    	 if((docview==3500) || (docview==3506) || (docview==3509) || (docview==3510) || (docview==3511) || (docview==3512))
	        {

	        	if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
			   	{
			   		var htmlErrors = objAjax.error();
			   		objAjax.error().addError("warningInfo", szMsg_Sel_Color, false);
			   		messagingDiv(htmlErrors);
			   		return;
			   	}
	        	objAjax.setActionURL("colorpaletteoverview.do");
	        }
	        objAjax.setActionMethod(url);
	        objAjax.setProcessHandler(_showColorLibPage);
	        objHTMLData.performSaveChanges(_showColorLibPage, objAjax);
	        if(objAjax.isProcessComplete())
            {
                objHTMLData.resetChangeFields();
            }
	     }
}

//Function for addColor
function addColor()
{
	if(!isValidRecord(true))
	{
		return;
	}
	Process.execute("addcolor", "colorpaletteoverview.do");
}

//Function for addArtworks
function addArtworks()
{
	if(!isValidRecord(true))
	{
		return;
	}
	Process.execute("addartworks", "colorpaletteoverview.do");
}

//dropSelectedArtworks
function dropSelectedArtworks()
{
	closeMsgBox();
	Process.saveChanges("colorpaletteoverview.do", "dropartworks", _showColorLibPage);
}

function refreshMaster()
{
	Process.execute("refreshmaster", "colorpaletteoverview.do");
}

function addAccents()
{
	Process.execute("addaccents", "colorpaletteoverview.do");
}

function addNonLibraryColors()
{
	Process.execute("addnonlibrarycolors", "colorpaletteoverview.do");
}

// This function forwards the user to ArtworkOverview Screen from Palette Screen.
function showArtworkOverviewFromPalette(obj)
{
    //alert("showColorOverviewFromPalette");
    //alert("_AttributekeyInfo " + getComponentKeyInfo() + "\n _nColLibRow " +_nColLibRow);
    var url ="TOARTWORK_OVERVIEW&_nColLibRow=" + _nColLibRow ;
    url += "&keyinfo= " +getComponentKeyInfo();
   // url+="&keyinfo= " +"OWNER=TRADESTONE,COLOR_NO=2"
    //alert("url " + url);
    loadWorkArea("colorpaletteoverview.do", url);
}

function _showColorPalettePage(objAjax)
{
    //alert(" _showColorLibPage: \n sectionName "+sectionName);
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

//Function for Drop Artworks
function dropArtworks()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	sectionName = objAjax.getDivSectionId();
	var objHData;
	//alert("sectionName  " + sectionName);
    if(objAjax && objHTMLData)
    {
    	// Tracker#:12630 ISSUES ON COLOR PALETTE BLANK RECORD
		// Check for valid record to execute process.
    	if(!isValidRecord(true))
   		{
   			return;
   		}
    	//alert("inside calling");
    	bShowMsg = true;

    	objHTMLData = _getAreaHTMLDataObjByDocView(objAjax.getDocViewId());

    	//alert("objHTMLData "+ objHTMLData + "\n docview  =  "+ objAjax.getDocViewId());


		if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
		{
	   		var htmlErrors = objAjax.error();
	   		objAjax.error().addError("warningInfo", szMsg_Sel_Artwork, false);
	   		messagingDiv(htmlErrors);
	   		return;
		}
		else
		{
			var chkboxobj = isArtworkSlt(objHTMLData);
			if(chkboxobj==null)
			{
				var htmlErrors = objAjax.error();
	   			objAjax.error().addError("warningInfo", szMsg_Sel_Artwork, false);
	   			messagingDiv(htmlErrors);
	   			return;
			}

			if(chkboxobj!=null)
			{
		       	var htmlErrors = objAjax.error();
   				htmlErrors.addError("confirmInfo","Do you want to drop Artwork(s)?",  false);
   				messagingDiv(htmlErrors,'dropSelectedArtworks()', 'paletteoverviewcancel()');
	        }
        }
    }
}

//Function to check If the user is selected the
//Non Library section colors.
function isNonLibColorsSlt(objHTMLData)
{
	var chgFlds = objHTMLData.getChangeFields();

	//alert("chgFlds " + chgFlds + "\n chgFlds "+ chgFlds.length) ;

	if(chgFlds && chgFlds.length>0)
      {
          for (num = 0; num < chgFlds.length; num++)
          {
             var obj = chgFlds[num];
             //alert(" obj["+num+"] = "+ obj);
             var idSuffix = _getIDSuffixFromCompName(obj.toString());
             //alert(" obj["+num+"] = "+ obj + "\n idSuffix="+idSuffix);
             if(idSuffix!=null && (idSuffix =="nonlibClrs"))
             {
				return obj;
             }
          }
          return null;
      }
}

//Function to check if the user is selected the
//Dropped colors.
function isDroppedColorsSlt(objHTMLData)
{
	var chgFlds = objHTMLData.getChangeFields();

	if(chgFlds && chgFlds.length>0)
      {
          for (num = 0; num < chgFlds.length; num++)
          {
             var obj = chgFlds[num];
             //alert(obj);
             var idSuffix = _getIDSuffixFromCompName(obj.toString());
             //alert("idSuffix="+idSuffix);
             if(idSuffix!=null && (idSuffix =="clrDrp"))
             {
				return obj;
             }
          }
          return null;
      }
}

//Function to check if the user is selected the
//Dropped Artworks.
function isDroppedArtworksSlt(objHTMLData)
{
	var chgFlds = objHTMLData.getChangeFields();

	if(chgFlds && chgFlds.length>0)
      {
          for (num = 0; num < chgFlds.length; num++)
          {
             var obj = chgFlds[num];
             //alert(obj);
             var idSuffix = _getIDSuffixFromCompName(obj.toString());
             //alert("idSuffix="+idSuffix);
             if(idSuffix!=null && (idSuffix =="artworksDrp"))
             {
				return obj;
             }
          }
          return null;
      }
}

//Function to check if the user is selected the
//Artworks.
function isArtworkSlt(objHTMLData)
{
	var chgFlds = objHTMLData.getChangeFields();

	if(chgFlds && chgFlds.length>0)
      {
          for (num = 0; num < chgFlds.length; num++)
          {
             var obj = chgFlds[num];
             //alert(obj);
             var idSuffix = _getIDSuffixFromCompName(obj.toString());
             //alert("idSuffix="+idSuffix);
             if(idSuffix!=null && (idSuffix =="artworks"))
             {
				return obj;
             }
             else
             {
             	var chkbox = getElemnt(obj);

				if(chkbox!=null && chkbox!="undefined")
				{
					chkbox.checked = false;
					//Tracker#:25257 COLOR PALETTE: AFTER DROP COLOR/ARTWORK WARNING MSG INCORRECT COLORS/ARTWORKS ARE DROPPED
					objHTMLData.resetChangeFields();
				}
             }
          }
          return null;
      }
}

//Function unCheck checkbox
function unCheck(objHTMLData)
{
    var chgFlds = objHTMLData.getChangeFields();

	if(chgFlds&& chgFlds.length>0)
      {
          for (num = 0; num < chgFlds.length; num++)
          {
             var obj = chgFlds[num];
             //alert(obj);
             var chkbox = getElemnt(obj);
			 if(chkbox!=null && chkbox!="undefined")
			 {
				chkbox.checked = false;
			 }
          }
          return null;
      }
}

function palettelistactiveInactive(status)
{
	var url ="activeinactive&status="+status;
	var docview;
	var htmlAreaObj = _getWorkAreaDefaultObj();
  	var objAjax = htmlAreaObj.getHTMLAjax();
   	var objHTMLData = htmlAreaObj.getHTMLDataObj();
   	sectionName = objAjax.getDivSectionId();
   	
	if(objAjax && objHTMLData)
	{
		bShowMsg = true;
		if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
   		{
	   		var htmlErrors = objAjax.error();
	   		objAjax.error().addError("warningInfo", szMsg_Sel_Palette, false);
	   		messagingDiv(htmlErrors);
	   		return;
   		}
      		
      		objAjax.setActionURL("colorpalette.do");       		
		objAjax.setActionMethod(url);
   		objAjax.setProcessHandler(_showColorLibPage);
		objHTMLData.performSaveChanges(_showColorLibPage, objAjax);
		
		if(objAjax.isProcessComplete())
        {
            objHTMLData.resetChangeFields();
        }
	}
}

function paletteactiveInactive(status)
{
	var url ="activeinactive&status="+status;
	var docview;
	var htmlAreaObj = _getWorkAreaDefaultObj();
  	var objAjax = htmlAreaObj.getHTMLAjax();
   	var objHTMLData = htmlAreaObj.getHTMLDataObj();
   	sectionName = objAjax.getDivSectionId();
   	
	if(objAjax)
	{
		// Tracker#:12637 ISSUES ON BLANK RECORD OF MATERIAL LIBRARY	
		if(!isValidRecord(true))
		{
			return;
		}
		loadWorkArea("colorpaletteoverview.do", url);
	}
}

//deleteclr function
function deleteClr()
{

	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
   	var objHTMLData = htmlAreaObj.getHTMLDataObj();
   	var docview;

   if(objAjax)
   	{
   		// Tracker#:12630 ISSUES ON COLOR PALETTE BLANK RECORD
   		// Check for valid record to execute process.
   		if(!isValidRecord(true))
   		{
   			return;
   		}
   docview = objAjax.getDocViewId();
   if((docview==3500) || (docview==3506) || (docview==3509) || (docview==3510) || (docview==3511) || (docview==3512))
	{
   		if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
			   	{
			   		var htmlErrors = objAjax.error();
			   		objAjax.error().addError("warningInfo", szMsg_Sel_Color, false);
			   		messagingDiv(htmlErrors);
			   		return;
			   	}
	}


   		docview = objAjax.getDocViewId();
   		var htmlErrors = objAjax.error();

   		htmlErrors.addError("confirmInfo","Do you want to delete Color(s)?",  false);
   		messagingDiv(htmlErrors,'deleteSelectedColors()', 'paletteoverviewcancel()');
   	}
}

//deleteSelectedColors function
function deleteSelectedColors()
{
	var url = "deletecolor";
	var docview;
	closeMsgBox();

	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objAjax.getDivSectionId();
    //alert("sectionName  " + sectionName);

	    if(objAjax && objHTMLData)
	    {
	    	docview = objAjax.getDocViewId();
	    	//alert("docview: "+docview);
	    	//alert("inside calling");
	    	bShowMsg = true;
	    	 if((docview==3500)||(docview==3506) || (docview==3509) || (docview==3510) || (docview==3511) || (docview==3512))
	        {
	        	objAjax.setActionURL("colorpaletteoverview.do");
	        }
	        objAjax.setActionMethod(url);
	        objAjax.setDivSectionId(htmlAreaObj.getDivSaveContainerName());
	        objAjax.setProcessHandler(_showColorLibPage);
	        objHTMLData.performSaveChanges(_showColorLibPage, objAjax);
	        if(objAjax.isProcessComplete())
            {
                objHTMLData.resetChangeFields();
            }
	     }
}

//dropColor Function

function dropColor()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
   	var docview;
   	var objHTMLData = htmlAreaObj.getHTMLDataObj();

    if(objAjax)
  	{
	  	// Tracker#:12630 ISSUES ON COLOR PALETTE BLANK RECORD
		// Check for valid record to execute process.
		if(!isValidRecord(true))
		{
			return;
		}
   		docview = objAjax.getDocViewId();
   		var htmlErrors = objAjax.error();
   		
   		if((docview==3500) || (docview==3506) || (docview==3509) || (docview==3510) || (docview==3511) || (docview==3512))
	 	{
			if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
		   	{
		   		objAjax.error().addError("warningInfo", szMsg_Sel_Color, false);
		   		messagingDiv(htmlErrors);
		   		return;
		   	}
		   	//To check the Non Library Colors are selected for Create Submit process
			//If so give warning message.
	   		var chkboxobj = isNonLibColorsSlt(objHTMLData);
	   		
			if(chkboxobj!=null)
			{
				objAjax.error().addError("errorInfo", "Non Library Colors cannot be dropped.", true);
				messagingDiv(htmlErrors);
				objHTMLData.resetChangeFields();
				var chkbox = getElemnt(chkboxobj);
				if(chkbox!=null && chkbox!="undefined")
				{
					chkbox.checked = false;
				}
				return;
			}
			
			//Tracker#:20648 - if user selectes artwork to drop color, show the warning message.
			var chkboxobj = isColorSlt(objHTMLData);				
			
			if(chkboxobj==null)
			{
		   		objAjax.error().addError("warningInfo", szMsg_Sel_Color, false);
		   		messagingDiv(htmlErrors);
		   		return;
			}	
	 	}
		htmlErrors.addError("confirmInfo","Do you want to drop Color(s)?",  false);
		messagingDiv(htmlErrors,'dropSelectedColors()', 'paletteoverviewcancel()');
	}
}

function deletepalettelist()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
   	var docview;
	var docviewid = htmlAreaObj.getDocViewId();
	
	if(objAjax)
   	{
   		if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
		{
			var htmlErrors = objAjax.error();
			objAjax.error().addError("warningInfo", szMsg_Sel_Palette, false);
			messagingDiv(htmlErrors);
			return;
		}
		
		var htmlErrors = objAjax.error();
   		htmlErrors.addError("confirmInfo","Do you want to delete Palette(s)?",  false);
   		messagingDiv(htmlErrors,'deletePalettes()', 'palettelistcancel()');
   	}

}

function deletePalettes()
{
	closeMsgBox();
	Process.saveChanges("colorpalette.do", "deletepalette", _showDeleteSubmitWorkArea);
}

function deletepalette()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
   	var docview;
   	
   	if(objAjax)
   	{
   		// Check for valid record to execute process.
	   	if(!isValidRecord(true))
		{
			return;
		}
		
		var htmlErrors = objAjax.error();
		htmlErrors.addError("confirmInfo","Do you want to delete Palette(s)?",  false);
		messagingDiv(htmlErrors,'deletePaletteOverview()', 'paletteoverviewcancel()');
   	}
}

function deletePaletteOverview()
{
	var url = "deletepalette";
	var docview;
	closeMsgBox();
	
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objAjax.getDivSectionId();
	
	if(objAjax && objHTMLData)
	{
		//Tracker#: 14105 REFRESHING THE NAVIGATION GRID WHEN THE DATA IS DELETED
		//added the process handler method so that on deleting the color palette from the overview 
		//the navigation grid is refreshed
		loadWorkArea("colorpaletteoverview.do", url,"",refreshNavigationGridOnDelete);
	}
}


function refreshPalettelist()
{
	var url = "db_refresh";
	
	if(!isValidRecord(true))
	{
		return;
	}
	
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objAjax.getDivSectionId();
    
	if(objAjax && objHTMLData)
	{
		
		 	if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
            {
                var htmlErrors = objAjax.error();
                objAjax.error().addError("warningInfo", szMsg_Sel_Palette, false);
                messagingDiv(htmlErrors);
                return;
            }
            objAjax.setActionURL("colorpalette.do");
	}

	objAjax.setActionMethod(url);
	objAjax.setProcessHandler(_showColorLibPage);
	objHTMLData.performSaveChanges(_showColorLibPage, objAjax);

	if(objAjax.isProcessComplete())
	{
		objHTMLData.resetChangeFields();
	}
}

function refreshPaletteOverview()
{
	var url = "db_refresh";
	
	if(!isValidRecord(true))
	{
		return;
	}
	
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objAjax.getDivSectionId();
    
    if(objAjax && objHTMLData)
	{
		 loadWorkArea("colorpaletteoverview.do", url);
	}
}

function palettelistcancel(){
	closeMsgBox();
	refreshPalettelist();
}

function paletteoverviewcancel(){
	closeMsgBox();
	refreshPaletteOverview();
}
 
function showPaletteChangeTracking()
{
	closeMsgBox();
    var objHtmlData = _getWorkAreaDefaultObj().checkForNavigation();
    var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	
	if(objAjax)
	{
		if(!isValidColorPalette(true))
	    {
	    	return;
	    }
	}
    
    if(objHtmlData!=null && objHtmlData.hasUserModifiedData()==true)
    {
        //perform save operation
        objHtmlData.performSaveChanges(_defaultWorkAreaSave);
    }
    else
    {
    	_showChangeTracking(3500);
    }
}

//Tracker#19204 CREATE A NEW SCREEN - SHARING TAB OFF OF PALETTE
function showPaletteSharing()
{
	closeMsgBox();
    
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
	var url = "shaowpalettesharing";
	
	if(objAjax)
	{
		if(!isValidColorPalette(true))
	    {
	    	return;
	    }
	}
    
    if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==true)
    {
        //perform save operation
        objHtmlData.performSaveChanges(_defaultWorkAreaSave);
    }
    else
    {
    	/*alert('inside else');
    	objAjax.setActionURL("paletteshare.do");       		
		objAjax.setActionMethod(url);
   		objAjax.setProcessHandler(_showColorLibPage);
		objHTMLData.performSaveChanges(_showColorLibPage, objAjax);
		
		if(objAjax.isProcessComplete())
    	{
        	objHTMLData.resetChangeFields();
    	}*/
    	loadWorkArea("paletteshare.do", url);
    }
}

function getColorPaletteHTMLAjax()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
	//alert("htmlAreaObj " + htmlAreaObj);
    var objAjax = htmlAreaObj.getHTMLAjax();

    if(!objAjax)objAjax = new htmlAjax();
    return objAjax;
}

function isValidColorPalette(displayMessage)
{
	return _checkIsValidRecord("_isValidColorPalette", true, szMsg_Invalid_Palette);
}

// Tracker#:14435 changes closed here

//Tracker#: 16295 REINSTATE DROPPED COLORS ON COLOR PALETTE
//This function is called when the user click on Reinstate Color(s) process on color palette overview
function reinstatecolor()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
  	var objAjax = htmlAreaObj.getHTMLAjax();
   	var objHTMLData = htmlAreaObj.getHTMLDataObj();
   	sectionName = objAjax.getDivSectionId();
   	
   	if(objAjax && objHTMLData)
	{
		bShowMsg = true;
		if(!isValidRecord(true))
   		{
   			return;
   		}
   		//check if the user is selected any checkbox
		if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
		{
			var htmlErrors = objAjax.error();
			objAjax.error().addError("warningInfo", szMsg_sel_Dropped_Color, false);
			messagingDiv(htmlErrors);
			return;
		}
		//check if the user is selected the Dropped Colors
		var chkboxobj = isAllDroppedColors(objHTMLData);
		if(chkboxobj)
		{
			var htmlErrors = objAjax.error();
	   		objAjax.error().addError("warningInfo", szMsg_sel_only_Dropped_Color, false);
	   		messagingDiv(htmlErrors);
	   		//To remove the checkbox check after showing the warning message
	   		unCheck(objHTMLData);
	   		objHTMLData.resetChangeFields();			
	   		return;
		}
		else
		{
		    var htmlErrors = objAjax.error();
   			htmlErrors.addError("confirmInfo","Do you want to Reinstate Color(s)?",  false);
   			messagingDiv(htmlErrors,'reinstateSelectedColors()', 'paletteoverviewcancel()');
	    }
	}
}
function reinstateSelectedColors()
{
	closeMsgBox();
	Process.saveChanges("colorpaletteoverview.do", "reinstatecolor", _showColorLibPage);
}
//Tracker#: 16295 REINSTATE DROPPED COLORS ON COLOR PALETTE
//This function is called when the user click on Reinstate Artwork(s) process on color palette overview
function reinstateartwork()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
  	var objAjax = htmlAreaObj.getHTMLAjax();
   	var objHTMLData = htmlAreaObj.getHTMLDataObj();
   	sectionName = objAjax.getDivSectionId();
   	
   	if(objAjax && objHTMLData)
	{
		bShowMsg = true;
		if(!isValidRecord(true))
   		{
   			return;
   		}
		//check if the user not selected any checkbox
		if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
		{
			var htmlErrors = objAjax.error();
			objAjax.error().addError("warningInfo", szMsg_sel_Dropped_Artwork, false);
			messagingDiv(htmlErrors);
			return;
		}
		//check if the user is selected the Dropped Artworks
		var chkboxobj = isAllDroppedArtworks(objHTMLData);
		if(chkboxobj)
		{
			var htmlErrors = objAjax.error();
	   		objAjax.error().addError("warningInfo", szMsg_sel_only_Dropped_Artwork, false);
	   		messagingDiv(htmlErrors);
	   		//To remove the checkbox check after showing the warning message
	   		unCheck(objHTMLData);
	   		objHTMLData.resetChangeFields();	   			
			return;
		}
		else
		{
		    var htmlErrors = objAjax.error();
   			htmlErrors.addError("confirmInfo","Do you want to Reinstate Artwork(s)?",  false);
   			messagingDiv(htmlErrors,'reinstateSelectedArtworks()', 'paletteoverviewcancel()');
	    }		
	}
}

function reinstateSelectedArtworks()
{
	closeMsgBox();
	Process.saveChanges("colorpaletteoverview.do", "reinstateartwork", _showColorLibPage);
}

function isAllDroppedColors(objHTMLData)
{
	var chgFlds = objHTMLData.getChangeFields();

	if(chgFlds && chgFlds.length>0)
    {
        for (num = 0; num < chgFlds.length; num++)
        {
           var obj = chgFlds[num];
           //alert(obj);
           var idSuffix = _getIDSuffixFromCompName(obj.toString());
           //alert("idSuffix="+idSuffix);
           if(idSuffix!=null && (idSuffix != "clrDrp"))
           {
			 	return true;
           }
        }
        return false;
    }
}

function isAllDroppedArtworks(objHTMLData)
{
	var chgFlds = objHTMLData.getChangeFields();

	if(chgFlds && chgFlds.length>0)
    {
        for (num = 0; num < chgFlds.length; num++)
        {
           var obj = chgFlds[num];
           //alert(obj);
           var idSuffix = _getIDSuffixFromCompName(obj.toString());
           //alert("idSuffix="+idSuffix);
           if(idSuffix!=null && (idSuffix != "artworksDrp"))
           {
			 	return true;
           }
        }
        return false;
    }
}  

//Tracker#19208
function _showPaletteList()
{
	Process.execute("HANDLELISTVIEW&viewtype=PALETTELIST", "colorpalette.do");
}

function _showSharingList()
{
	 Process.execute("HANDLELISTVIEW&viewtype=SHARINGLIST", "colorpalette.do");
}
//Tracker#19202
//For Search on Color Palette screen.
function _showPaletteListScreen(objAjax)
{
	
	var url = "HANDLELISTVIEW";
	if(objAjax)
	{
		bShowMsg = true;
		loadWorkArea("colorpalette.do", url);
	}
}

//Tracker#19203
//Add Suppliers popup on Sharing list screen.
function _addSuppliers()
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
 	 
   if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
    {
        var htmlErrors = objAjax.error();
        objAjax.error().addError("warningInfo", szMsg_Sel_Palette, false);
        messagingDiv(htmlErrors);
        return;
    }
   
    _addSuppliersPopup("addsuppliers");
}

function _addSuppliersPopup(actMethod)
{
    closeMsgBox();
    var htmlAreaObj = _getWorkAreaDefaultObj();
	//alert("htmlAreaObj " + htmlAreaObj);
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();

 	//var actMethod ="addsuppliers";
    if(objAjax)
    {
    	var htmlfldName = htmlAreaObj.getDivSectionId();
    	//alert("showView : objAjax "  + objAjax.getDocViewId());
    	_startSmartTagPopup(htmlfldName, false, null, true);
        objAjax.setActionURL("colorpalette.do");
        objAjax.setActionMethod(actMethod);
        //Tracker#:14804 SIMPLE SAMPLE  - ABILITY TO SELECT MATERIAL
        //Set parentchange field to read the selected material no the tech spec at server side.
        objAjax.parameter().add(_parentScreenChgFields, objHTMLData.getSaveChangeFields());
        objAjax.attribute().setAttribute("htmlfldName", htmlfldName);
        objAjax.setProcessHandler(_showSmartTagInteractivePopup);
        //alert("sending");
        objAjax.sendRequest();
    }
}

//Tracker#19203 For save suppliers process on Add Suppliers popup
function _saveSupplier(divid)
{
	var htmlAreaObj = _getAreaObjByDocView(divid);
	var htmlWrkAreaObj = _getWorkAreaDefaultObj();
	if(htmlAreaObj && htmlWrkAreaObj)
	{
		var actMethod = "saveSupplier";
		var objAjax = htmlAreaObj.getHTMLAjax();
		var objHTMLData = htmlAreaObj.getHTMLDataObj();
		var parentobjHTMLData = htmlWrkAreaObj.getHTMLDataObj();

		sectionName = objAjax.getDivSectionId();
		//alert("_showSampleTabView \n sectionName  " + sectionName);
	    if(objAjax && objHTMLData)
	    {
	    	if(objHTMLData!=null && objHTMLData.isDataModified()==false)
    		{
				var htmlErrors = objAjax.error();
				objAjax.error().addError("warningInfo", szMsg_No_change, false);
				messagingDiv(htmlErrors);
				return;
			}
	    	var htmlfldName = htmlWrkAreaObj.getDivSectionId();
	    	//alert("getChangeFields : "+ objHTMLData.getChangeFields());
	    	bShowMsg = true;
	        objAjax.setActionMethod(actMethod);
	        objAjax.setActionURL("colorpalette.do");
	        objAjax.setProcessHandler(_postSaveSupplier);
	        objHTMLData.appendAllCustomContainerDataToRequest(objAjax, divid);
	        objAjax.parameter().add(_parentScreenChgFields, parentobjHTMLData.getSaveChangeFields());
	        objAjax.parameter().add(_screenChangeFileds, objHTMLData.getSaveChangeFields());
        	objHTMLData._appendAllContainerDataToRequest(objAjax);
        	//_startSmartTagPopup(htmlfldName, false, null, true);
        	objAjax.sendRequest();
        	
        	if(objAjax.isProcessComplete())
        	{
            	objHTMLData.resetChangeFields();
        	}
	    }
    }
}

//Tracker#19203 For Approve suppliers process on Add Suppliers popup
function _apprSuppliers(divid)
{
	var htmlAreaObj = _getAreaObjByDocView(divid);
	var htmlWrkAreaObj = _getWorkAreaDefaultObj();
	if(htmlAreaObj && htmlWrkAreaObj)
	{
		var actMethod = "apprsuppliers";
		var objAjax = htmlAreaObj.getHTMLAjax();
		var objHTMLData = htmlAreaObj.getHTMLDataObj();
		var parentobjHTMLData = htmlWrkAreaObj.getHTMLDataObj();

		sectionName = objAjax.getDivSectionId();
		//alert("_showSampleTabView \n sectionName  " + sectionName);
	    if(objAjax && objHTMLData)
	    {
	    	if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
    		{
				var htmlErrors = objAjax.error();
				objAjax.error().addError("warningInfo", szMsg_Sel_Detail_Record, false);
				messagingDiv(htmlErrors);
				return;
			}
	    	var htmlfldName = htmlWrkAreaObj.getDivSectionId();
	    	//alert("getChangeFields : "+ objHTMLData.getChangeFields());
	    	bShowMsg = true;
	        objAjax.setActionMethod(actMethod);
	        objAjax.setActionURL("colorpalette.do");
	        objAjax.setProcessHandler(_postSaveSupplier);
	        objHTMLData.appendAllCustomContainerDataToRequest(objAjax, divid);
	        objAjax.parameter().add(_parentScreenChgFields, parentobjHTMLData.getSaveChangeFields());
	        objAjax.parameter().add(_screenChangeFileds, objHTMLData.getSaveChangeFields());
        	objHTMLData._appendAllContainerDataToRequest(objAjax);
        	//_startSmartTagPopup(htmlfldName, false, null, true);
        	objAjax.sendRequest();
        	if(objAjax.isProcessComplete())
        	{
            	objHTMLData.resetChangeFields();
        	}
	    }
    }
}

//Tracker#19203 For Share palettes process on Add Suppliers popup
function _sharePalettes(divid)
{
	var htmlAreaObj = _getAreaObjByDocView(divid);
	var htmlWrkAreaObj = _getWorkAreaDefaultObj();
	if(htmlAreaObj && htmlWrkAreaObj)
	{
		var actMethod = "addsuppliersshare";
		var objAjax = htmlAreaObj.getHTMLAjax();
		var objHTMLData = htmlAreaObj.getHTMLDataObj();
		var parentobjHTMLData = htmlWrkAreaObj.getHTMLDataObj();

		sectionName = objAjax.getDivSectionId();
		//alert("_showSampleTabView \n sectionName  " + sectionName);
	    if(objAjax && objHTMLData)
	    {
	    	if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
    		{
				var htmlErrors = objAjax.error();
				objAjax.error().addError("warningInfo", szMsg_Sel_Detail_Record, false);
				messagingDiv(htmlErrors);
				return;
			}
	    	var htmlfldName = htmlWrkAreaObj.getDivSectionId();
	    	//alert("getChangeFields : "+ objHTMLData.getChangeFields());
	    	bShowMsg = true;
	        objAjax.setActionMethod(actMethod);
	        objAjax.setActionURL("colorpalette.do");
	        objAjax.setProcessHandler(_postSharePalettes);
	        objHTMLData.appendAllCustomContainerDataToRequest(objAjax, divid);
	        objAjax.parameter().add(_parentScreenChgFields, parentobjHTMLData.getSaveChangeFields());
	        objAjax.parameter().add(_screenChangeFileds, objHTMLData.getSaveChangeFields());
        	objHTMLData._appendAllContainerDataToRequest(objAjax);
        	//_startSmartTagPopup(htmlfldName, false, null, true);
        	objAjax.sendRequest();
        	if(objAjax.isProcessComplete())
        	{
            objHTMLData.resetChangeFields();
        	}
	    }
    }
}

//Tracker#19203
function _postSaveSupplier(objAjax)
{
   if(objAjax.isProcessComplete())
    {
        _closeSmartTag();
        _addSuppliersPopup("addsuppopup_refresh");
        _showWorkArea(objAjax);
    }
    else
    {
        //alert("show mesage");
        _displayProcessMessage(objAjax);
    }
}

//Tracker#19203
function _postSharePalettes(objAjax)
{
   if(objAjax.isProcessComplete())
    {
        _closeSmartTag();
        _showWorkArea(objAjax);
    }
    else
    {
        //alert("show mesage");
        _displayProcessMessage(objAjax);
    }
}

//Tracker#:20648 - ABLE TO DROP ARTWORK/S BY EXECUTING MORE ACTIONS > DROP COLORS PROCESS IN COLOR PALETTES OVERVIEW 
//Function to check If the user is selected the colors or accents to dropcolor process.
function isColorSlt(objHTMLData)
{
	var chgFlds = objHTMLData.getChangeFields();

	if(chgFlds && chgFlds.length>0)
    {
        for (num = 0; num < chgFlds.length; num++)
        {
           var obj = chgFlds[num];
           var idSuffix = _getIDSuffixFromCompName(obj.toString());
           
           if(idSuffix!=null && (idSuffix=="clrNDrp"||idSuffix=="accents"))
           {
				return obj;
           }
           else
           {
           	var chkbox = getElemnt(obj);

				if(chkbox!=null && chkbox!="undefined")
				{
					chkbox.checked = false;
					//Tracker#:25257 COLOR PALETTE: AFTER DROP COLOR/ARTWORK WARNING MSG INCORRECT COLORS/ARTWORKS ARE DROPPED
					objHTMLData.resetChangeFields();
				}
           }
        }
        return null;
    }
}
