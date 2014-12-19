/** ********************************** */
/* Copyright (C) 2002 - 2011 */
/* by */
/* TradeStone Software, Inc. */
/* Gloucester, MA. 01930 */
/* All Rights Reserved */
/* Printed in U.S.A. */
/* Confidential, Unpublished */
/* Property of */
/* TradeStone Software, Inc. */
/** ********************************** */
var expImg="images/arrowdown.gif";
var collapImg="images/Rarrow.gif";
//Tracker#:19511-REGRESSION - PROJECTIONS - DETAIL SECTION SLIDER IS MOVED TOO FAR TO THE RIGHT
var rhsDivWdth = 0; // Identifies the width of div on the right hand side of slider 
var sldrLft = -1; // Identifies the slider left property. initially set to -1;
var sldrHgt = -1; // Identifies the slider height property. initially set to -1;
var expRows = new Array(); // Array which holds the indices of expanded rows.

function showCapacityProjectionOverview(obj)
{
     navigateToCapacityProjections(obj, "");
}

// This function forwards the user to Projections Overview Screen.
// Called from LS Navigation link.
function showCapacityProjectionsFromNavigation(obj)
{
    // Just a indicator to say the navigation to overview screen is happening
    // via the link on the left side Navigation.
    var src = "&nav=1";
    navigateToCapacityProjections(obj, src);
}

// src - indicator to indicate from where the navigation is happening to
//       overview screen.
function navigateToCapacityProjections(obj, src)
{
    //Tracker#:19511-REGRESSION - PROJECTIONS - DETAIL SECTION SLIDER IS MOVED TOO FAR TO THE RIGHT
	//Resetting the width,left and height property 
    rhsDivWdth = 0;
    sldrLft = -1;
    sldrHgt = -1;
    expRows = new Array();
    Process.showOverview(obj, "capacityprojectionsoverview.do", "view");
}
// ------------------------------------------------------------------

function sortCapacityProjectionsColumn(fieldName,sec,type, pageNo)
{
    sortColumnForSection(fieldName,sec,type, pageNo, "capacityprojections.do")
}

function sortColumnForSection(fieldName,sec,type, pageNo, url)
{
    Process.sendRequest(sec, url, "SORT&sortColumn="+fieldName+"&sort="+type+"&pageNum="+pageNo, refreshPageAfterSort);
}

function refreshPageAfterSort(objAjax)
{
    //Tracker#:19511-REGRESSION - PROJECTIONS - DETAIL SECTION SLIDER IS MOVED TOO FAR TO THE RIGHT
	//Resetting the width,left and height property
	rhsDivWdth = 0;
    sldrLft = -1;
    sldrHgt = -1;
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

function createCapProjectionsTotal()
{
	//Tracker#:19511-REGRESSION - PROJECTIONS - DETAIL SECTION SLIDER IS MOVED TOO FAR TO THE RIGHT
	//Resetting the width,left and height property
	rhsDivWdth = 0;
    sldrLft = -1;
    sldrHgt = -1;
	expRows = new Array();
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    sectionName ="_divWorkArea";
    var url = "capacityprojectionsoverview.do";
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    if(objAjax && objHTMLData)
	{
		objAjax.setActionURL("capacityprojectionsoverview.do");
		//If any screen changes then display warning mesage to save or not 
		if(objHTMLData && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
		{	
			//saves the changefields only if the user has choosen to save the changes
			if (confirm(szMsg_Changes))
			{
				objAjax.setProcessHandler(_showSubmitWorkArea);
				objAjax.setActionMethod("save");
				objHTMLData.performSaveChanges(_showSubmitWorkArea, objAjax);
				return;
			}
		}
	}
    if(objAjax)
    {
        objAjax.setActionURL(url);
        objAjax.setActionMethod("createcapprojections&type=totals");
        objAjax.setProcessHandler(_showCapacityScreen);
        objAjax.sendRequest();
    }
}

function createCapProjectionsAlloc()
{
	//Tracker#:19511-REGRESSION - PROJECTIONS - DETAIL SECTION SLIDER IS MOVED TOO FAR TO THE RIGHT
	//Resetting the width,left and height property
	rhsDivWdth = 0;
    sldrLft = -1;
    sldrHgt = -1;
	expRows = new Array();
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    sectionName ="_divWorkArea";
    var url = "capacityprojectionsoverview.do";
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    if(objAjax && objHTMLData)
	{
		objAjax.setActionURL("capacityprojectionsoverview.do");
		//If any screen changes then display warning mesage to save or not
		if(objHTMLData && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
		{	
			//saves the changefields only if the user has choosen to save the changes
			if (confirm(szMsg_Changes))
			{
				objAjax.setProcessHandler(_showSubmitWorkArea);
				objAjax.setActionMethod("save");
				objHTMLData.performSaveChanges(_showSubmitWorkArea, objAjax);
				return;
			}
		}
	}
    if(objAjax)
    {
        objAjax.setActionURL(url);
        objAjax.setActionMethod("createcapprojections&type=alloc");
        objAjax.setProcessHandler(_showCapacityScreen);
        objAjax.sendRequest();
    }
}
var scrTp=0;
/**
 * This function shows the detail section.
 * @param {} rowNo
 * @param {} imgId
 * @param {} rowind
 * @param {} expImg
 * @param {} collImg
 * @param {} sliderDivId
 * @param {} fromSave :- value for this will be set from getAppendScript of CapacityProjectionsOverviewAction
 */
function showCapProjDetails(rowNo,imgId,rowind,expImg,collImg,sliderDivId,fromSave)
{
	//Tracker#:22687 - REGRESSION:- MINOR UI ISSUES ON SAFARI ON FIREFOX BROWSERS
    //showing the in-between rows and adding it to the clicked row
	var r1 = $("#_newLRow"+rowind).show();
	var r2 = $("#_newRRow"+rowind).show();		
	$('#capProjDetailLftRow_'+rowind).after($(r1));
	$('#capProjDetailRgtRow'+rowind).after($(r2));
	
	//alert(rowNo+"-"+imgId+"-"+rowind+"-"+expImg+"-"+collImg+"-"+sliderDivId);
	scrTp=0;
	var obj = getElemnt(imgId);
	//Getting the div in which the data is populated
	var wa = getElemnt("_divDataWorkArea");
	var idPfx = "contDiv"; //This will be the div id prefix
	
	//Getting the id of the slider and setting the initial left property to a global variable,sldrLft.
	var sliderId = getSliderId(sliderDivId);
	var sldr = getElemnt(sliderId);
	if (sldr)
	{
		if (sldrLft == -1 )
		{
			sldrLft = sldr.offsetLeft;
			sldrHgt = sldr.offsetHeight;
		}
	}
	
	//Setting proper collapse/expand image and resetting the newly created divs 
	//If image src is not expImg, then set collapse image and remove the div with suffix as rowind and reposition other divs
	if(obj && obj.src.indexOf( expImg) > 0 && fromSave != 'save') 
	{
		//Tracker#:22687 - REGRESSION:- MINOR UI ISSUES ON SAFARI ON FIREFOX BROWSERS
		//When collapse image clicked removing the row
		$("#_newLRow"+rowind).css("display","none");
		$("#_newRRow"+rowind).css("display","none");
		//Calling this function to remove the expanded row index in cache from server side
		removeExpandedRow(rowNo,rowind);
		var div = getElemnt(idPfx+rowind);
		var hgt = div.offsetHeight;
		if (sldr)
		{
			sldr.style.height = sldr.offsetHeight-hgt+"px";  //setting the slider height
			//Tracker#:19511-REGRESSION - PROJECTIONS - DETAIL SECTION SLIDER IS MOVED TOO FAR TO THE RIGHT
			//If all the rows are collapsed then setting the slider left property to its initial value.
			if( allRowsCollapsed())
			{
				var sldDiv = sliderId.substring(0,sliderId.indexOf("Slider"));
				var sldDivObj = getElemnt(sldDiv);
				sldDivObj.style.width = rhsDivWdth+"px";
				if (sldrLft && IE)
				{
					sldr.style.left = sldrLft+"px";
				}	
				sldr.style.height = sldrHgt+"px";
			}
		}	
		
		var fillDiv = getElemnt("contFillDiv"+rowind);
		var cl1 = getElemnt("_newLRowCell"+rowind+"_2");
		var cl2 = getElemnt("_newRRowCell"+rowind+"_R");
		
		//Tracker 19515 - CAP PROJECTIONS - ALLOCATION - % TO TOTAL TY DATA LOSES ON CLOSE MONTH SECTION AND SAVE
		//Instead of removing from DOM, setting attributes to make the DIVs invisible. If removeChild used 
		// the changed fields values will not be available at the server side on section collapse.
		div.style.visibility="hidden";
		fillDiv.style.visibility="hidden";
		fillDiv.style.display="none";
		div.style.display="none";
		//Tracker#:19511-REGRESSION - PROJECTIONS - DETAIL SECTION SLIDER IS MOVED TOO FAR TO THE RIGHT
		//Removing the image from the cell and adding a new image in that place with collpase image the src.
		//When obj.src= collImg is added, the display rows were getting set with additional height and the ordering was 
		// getting distorted in Firefox and Safari.
		var imcell = getElemnt("_capImgCell"+rowind);
		imcell.removeChild(obj);
		var im = new Image();
		im.src = collImg;
		im.id = imgId;
		imcell.appendChild(im);
		return;
	}
	
	
	//rowNo can have value 'null' so setting it to blank if so.
	if ( rowNo=='null' || rowNo==null)
	{
		rowNo="";
	}
	//Tracker#:19288 - EXPAND MONTH ALLOCATION SECTION ON SAVE
	//Getting the newly added LHS cell and appending the div to it if its not present
	//This div will be there with the cell on the first time. Which is set from server side
	var cl1 = getElemnt("_newLRowCell"+rowind+"_2");
	var d = getElemnt("contDiv"+rowind);
	if (!d)
	{
		d = document.createElement("DIV");
		d.id = "contDiv"+rowind;
		$(d).appendTo($(cl1));
	}
	//Tracker#:19288 - EXPAND MONTH ALLOCATION SECTION ON SAVE
	//Getting the newly added RHS cell and appending the div to it if its not present
	//This div will be there with the cell on the first time. Which is set from server side		
	var cl2 = getElemnt("_newRRowCell"+rowind+"_R");
	var d1 = getElemnt("contFillDiv"+rowind);
	
	if (!d1)
	{
		d1 = document.createElement("DIV");
		d1.id = "contFillDiv"+rowind;
		$(d1).appendTo($(cl2));
	}
	//Tracker 19515 - CAP PROJECTIONS - ALLOCATION - % TO TOTAL TY DATA LOSES ON CLOSE MONTH SECTION AND SAVE
	//Setting the visibility property of the divs.
	d.style.visibility="visible";
	d.style.display="block";
	d1.style.visibility="visible";
	d1.style.display="block";
	
	//var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = new htmlAjax();    
    var url = "capacityprojectionsoverview.do";
    bShowMsg=true;    
    if(objAjax)
    {
        objAjax.setActionURL(url);
        objAjax.setActionMethod("getdetails&rowNo="+rowNo+"&divIdPfx="+idPfx+"&rowInd="+rowind+"&imgId="+imgId+"&sldrDivId="+sliderDivId);
        objAjax.setProcessHandler(_showDetailsSection);
        objAjax.sendRequest();
    }	
}


function _showDetailsSection(objAjax)
{
    var divIdPfx = objAjax.getResponseHeader("_capDetailDivIdPfx");
    var rowNo = objAjax.getResponseHeader("_capDetailRwNo");
    var rowInd = objAjax.getResponseHeader("_capDetailRwInd");
    var total = objAjax.getResponseHeader("_perTotal");
    var processed = objAjax.getResponseHeader("_processed");
    var div = getElemnt(divIdPfx+rowInd);
    var imgId = objAjax.getResponseHeader("_imgId");
    var expImg = objAjax.getResponseHeader("_expImg");
    var sldrDivId = objAjax.getResponseHeader("_sldrDivId");
    var _txtRowInd = objAjax.getResponseHeader("_txtRowInd");
    
    //Getting the container div
    var d = getElemnt("contDiv"+rowInd);   
    
    if(objAjax)
    {
    	if(bShowMsg==true)
    	{
    		msgInfo = objAjax.getAllProcessMessages();

		    if(msgInfo!="")
		    {
		        _displayProcessMessage(objAjax);
		    }
		    if(d)
		    {
		    	//div.innerHTML=objAjax.getHTMLResult();
		    	d.innerHTML=objAjax.getHTMLResult();		    	
		    }   
        }
    }
    
    if(processed == "1")
    {  
	    	var hgt = d.offsetHeight;
	    	//setCapDetDivHeight(hgt,rowInd);
	    	//If IE set the slider with new height
	    	var sliderId = getSliderId(sldrDivId);
	    	//if (IE)
	    	{
		    	// Tracker#: 20602
                // Removed aligning the Slider's Left property with that of the 2nd Data div. As the Slider
                // is being added to the controlled div and is child of the Controlled Div.

                var sldr = getElemnt(sliderId);
		    	//setting the slider left property as if not set the new div will reside below the slider and slider wont function
				if (sldr)
				{
					//Tracker#: 22977 BROWSER: CAPACITY PROJECTION ISSUES
					//Added the 10 pixle to correct the height of slider.
					sldr.style.height = sldr.offsetHeight+hgt+10+"px";
				}
	    	}
    		//Tracker#:19511-REGRESSION - PROJECTIONS - DETAIL SECTION SLIDER IS MOVED TOO FAR TO THE RIGHT
	    	//Getting the id of the slider residing div from the slider id.
    		var sldDiv = sliderId.substring(0,sliderId.indexOf("Slider"));
			var sldDivObj = getElemnt(sldDiv);
			if (sldDivObj)
			{
				var w = sldDivObj.offsetWidth;
				//setting the width of the slider residing div 
				if ( rhsDivWdth == 0)
				{
					rhsDivWdth = w;
				}
				//Tracker#:19511-REGRESSION - PROJECTIONS - DETAIL SECTION SLIDER IS MOVED TOO FAR TO THE RIGHT
				//Adjusting the with of the slider residing div so that all the fields of the div is visible when slided.
				//Tracker#: 22977 BROWSER: CAPACITY PROJECTION ISSUES
				//Tracker#: 23603 BROWSERS: CAPACITY PROJECTION FILL OPTION ISSUES
				//Set the width so the slider should not get disapper when slided to the end of screen.
				if (IE)
		    	{
					sldDivObj.style.width = (rhsDivWdth - 327 )+"px";
		    	}
				else
				{
					sldDivObj.style.width = (rhsDivWdth - 345 )+"px";
				}
			}
	    	
	    	//setting value to the total field
			var totlObj = getElemnt("_totTxt"+rowInd);
			if (totlObj)
			{
				var frmtNum = FormatNumber(total,2);	
				totlObj.value = frmtNum;
			}
			//setting proper image
			//Tracker#:22687 - REGRESSION:- MINOR UI ISSUES ON SAFARI ON FIREFOX BROWSERS
			//var img = getElemnt(imgId);
			//img.src = expImg;
			var im= $('#_capImgCell'+rowInd).find('img');
			$(im).remove();
			$('#_capImgCell'+rowInd).prepend('<img id="'+imgId+'" src="'+expImg+'" />');
			var fillDiv = getElemnt("contFillDiv"+rowInd);
			fillDiv.style.height = hgt+"px";
			expRows[expRows.length]=parseInt(rowInd);
	}
}
//Tracker#:19288 - EXPAND MONTH ALLOCATION SECTION ON SAVE
function removeExpandedRow (rowNo,rowind)
{
	//setting collpased row index value in the array to -1.  
	//Tracker#:19511-REGRESSION - PROJECTIONS - DETAIL SECTION SLIDER IS MOVED TOO FAR TO THE RIGHT
	for (var i=0; i<expRows.length; i++)
	{
		var v =  expRows[i];
		if ( v == rowind)
		{
			expRows[i] =-1;
		}
	}
	
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    var url = "capacityprojectionsoverview.do";
    if(objAjax)
    {
        objAjax.setActionURL(url);
        objAjax.setActionMethod("removeExpandRow&rowNo="+rowNo+"&rowInd="+rowind);    
        objAjax.setProcessHandler(_postExpRemove);
        objAjax.sendRequest();
    }	
}
/**
 * This function will return true if all the rows are collapsed.
 * @return {}
 * Tracker#:19511-REGRESSION - PROJECTIONS - DETAIL SECTION SLIDER IS MOVED TOO FAR TO THE RIGHT
 */
function allRowsCollapsed ()
{
	var c = true;
	for (var i=0; i<expRows.length; i++)
	{
		var v =  expRows[i];
		if ( v != -1)
		{
			c = false;
		}
	}
	return c;
}
/**
 * This function will get the no of expanded rows.
 * @return {}
 * Tracker#:19511-REGRESSION - PROJECTIONS - DETAIL SECTION SLIDER IS MOVED TOO FAR TO THE RIGHT
 */
function getNoOfExpRows ()
{
	var c = 0;
	for (var i=0; i<expRows.length; i++)
	{
		var v =  expRows[i];
		if ( v != -1)
		{
			c ++;
		}
	}
	return c;
}
//Tracker#:19288 - EXPAND MONTH ALLOCATION SECTION ON SAVE
function _postExpRemove(objAjax)
{
		return;
}

/*Functin to set the cell height
 * */
function setCellHeight(row,height)
{
		var cells=row.getElementsByTagName('td');
		for(var i=0;i<cells.length;i++)
		{
			var cell=cells[i];
			cell.style.height=height+"px";			
		}
}
//This function reset the position of the divs when a row is collapsed or expanded.
function resetDivTop(pfx,rowInd,hgt,fwdBwd)
{
	var wa=getElemnt("_divDataWorkArea");
	var scrTop=parseInt(wa.scrollTop);
	
	var top=0;
	var div=getElemnt(pfx+(parseInt(rowInd)+1));
	var rwLft=getElemnt("capProjDetailLftRow_"+(rowInd));
	
	if(rwLft)
	{
		var div=getElemnt(pfx+(parseInt(rowInd)+1));
		if(div)
		{
			var tp=div.style.top;
			dTp=parseInt(tp.substring(0,tp.indexOf("px")));
			if("fwd"==fwdBwd)
			{
				top=parseInt(dTp)-parseInt(hgt-6);
			}else if("bwd"==fwdBwd)
			{
				top=parseInt(dTp)+parseInt(hgt-6);
			}
			div.style.top=top+"px";
		}
		resetDivTop(pfx,(parseInt(rowInd)+1),hgt,fwdBwd);
	}
}
/**
 * This function will set the top property for the div
 * @param {} scrlTop
 */
function resetDivOnScroll(scrlTop)
{
	var elements = $('div[id^=detail_div_]');
	var top=scrlTop-scrTp;
	var tempId="";
	for ( var i=0; i<elements.length; i++)
	{
		var element = elements[i];
		if ( tempId != element.id)
		{
			var divTop=element.offsetTop;
			element.style.top = divTop-top+"px";
			tempId == element.id;
		}				
	}	
	scrTp = scrlTop;	
}


function _showCapacityScreen(objAjax)
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
        
        var obj = objAjax.getResponseHeader('isCopyTo');
        var htmlAreaObj = _getWorkAreaDefaultObj();    	    
	    var objHTMLData = htmlAreaObj.getHTMLDataObj();
	    if(obj== "isCopyTo")
    	{
        	objHTMLData.addToChangedFields(obj);
        	
    	}
        bShowMsg= false;
    }
    //Tracker#: 19531 CHANGE TRACKING ON CAPACITY PROJECTION DOCUMENT
    showChangeTrackingTabCount();
}
//This function closes all the opened detail divs, reset the height of all the html table rows and also changes all the 
// expand images to collapse images.
function clsCapDtlDivs()
{
	var wa=getElemnt("_divDataWorkArea");
	var elms=wa.getElementsByTagName("*");		
	for(var j = 0;  j < elms.length; j++) 
	{
        var elm = elms[j];
        if(elm.id)
        {
        	if(elm.id.indexOf("detail_div_")!= -1)
        	{
        		elm.style.visibility="hidden";
				elm.style.display = "none";
        	}else if(elm.id.indexOf("capProjDetailLftRow_")!= -1 || elm.id.indexOf("capProjDetailRgtRow_")!= -1)
        	{
        		elm.style.height="30px";
        	}else if(elm.id.indexOf("_capDtlcollapImg")!=-1)
        	{
        		elm.src=collapImg;
        	}
        }
        
    }
}

function deleteCapProjections()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
   	var objHTMLData = htmlAreaObj.getHTMLDataObj();
   	var msg=szMsg_Cap_Proj_Delete_Confirm;
   	//Tracker 19400 - PROJECTIONS - MORE ACTIONS > DELETE FOR NEW RECORD GIVES ERROR MESSAGE
   	//Check for validity
   	if(!isValidRecord(true))
    {
        return;
    }
   	if(objHTMLData.checkForChanges())
   	{
   		msg=szMsg_Cap_Proj_sel_Delete_Confirm;
   	}
   	
   	
	var htmlErrors = objAjax.error();
	htmlErrors.addError("confirmInfo", msg,  false);
	messagingDiv(htmlErrors,'deleteCapacityProjections()', 'cancelDelete()');
}
function cancelDelete(){
	closeMsgBox();	
}
//The function to delete the capacity projections
function deleteCapacityProjections()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName ="_divWorkArea";
    var url = "capacityprojectionsoverview.do";
    bShowMsg=true;
    if(objAjax)
    {
        objAjax.setActionURL(url);
        objAjax.setActionMethod("deletecapprojections");
        objAjax.setProcessHandler(_showCapacityScreen);
        if(objHTMLData.checkForChanges())
        {
        	objHTMLData.performSaveChanges(_showSubmitWorkArea, objAjax);
       	}
       	else
       	{
       		objAjax.sendRequest();
       	}
        if(objAjax.isProcessComplete())
    	{
        	objHTMLData.resetChangeFields();
        }
    }
}
//Function to refresh the screen
function refreshCapProjections()
{
	var url = "db_refresh";
	if(!isValidRecord(true))
	{
		return;
	}
	
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objHTMLData.getDivContainerName();
	if(objAjax && objHTMLData)
	{
		objAjax.setActionURL("capacityprojectionsoverview.do");
		if(objHTMLData && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
		{	
			//saves the changefields only if the user has choosen to save the changes
			if (confirm(szMsg_Changes))
			{
				objAjax.setProcessHandler(_showCapacityScreen);
				objAjax.setActionMethod("save");
				objHTMLData.performSaveChanges(_showSubmitWorkArea, objAjax);
				return;
			}
		}
	}
	objAjax.setActionMethod(url);
	objAjax.setProcessHandler(_showCapacityScreen);
	objAjax.sendRequest();
}

//The function to delete the capacity projections
function submitCapProjections()
{
	if(!isValidRecord(true))
	{
		return;
	}
	
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
    {
        var htmlErrors = objAjax.error();
        objAjax.error().addError("warningInfo", "Please select Capacity Projection(s).", false);
        messagingDiv(htmlErrors);
        return;
    }
    sectionName ="_divWorkArea";
    var url = "capacityprojectionsoverview.do";
    bShowMsg=true;
    if(objAjax)
    {
        objAjax.setActionURL(url);
        objAjax.setActionMethod("submit");
        objAjax.setProcessHandler(_showCapacityScreen);
        if(objHTMLData.checkForChanges())
        {
        	objHTMLData.performSaveChanges(_showSubmitWorkArea, objAjax);
       	}
       	else
       	{
       		objAjax.sendRequest();
       	}
        if(objAjax.isProcessComplete())
    	{
        	objHTMLData.resetChangeFields();
        }
    }
}

//The function to delete the capacity projections
function approveCapProjections()
{
	if(!isValidRecord(true))
	{
		return;
	}
	
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
    {
        var htmlErrors = objAjax.error();
        objAjax.error().addError("warningInfo", "Please select Capacity Projection(s).", false);
        messagingDiv(htmlErrors);
        return;
    }
    sectionName ="_divWorkArea";
    var url = "capacityprojectionsoverview.do";
    bShowMsg=true;
    if(objAjax)
    {
        objAjax.setActionURL(url);
        objAjax.setActionMethod("approve");
        objAjax.setProcessHandler(_showCapacityScreen);
        if(objHTMLData.checkForChanges())
        {
        	objHTMLData.performSaveChanges(_showSubmitWorkArea, objAjax);
       	}
       	else
       	{
       		objAjax.sendRequest();
       	}
        if(objAjax.isProcessComplete())
    	{
        	objHTMLData.resetChangeFields();
        }
    }
}

//The function to delete the capacity projections
function releaseCapProjections()
{
	if(!isValidRecord(true))
	{
		return;
	}
	
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
    {
        var htmlErrors = objAjax.error();
        objAjax.error().addError("warningInfo", "Please select Capacity Projection(s).", false);
        messagingDiv(htmlErrors);
        return;
    }
    sectionName ="_divWorkArea";
    var url = "capacityprojectionsoverview.do";
    bShowMsg=true;
    if(objAjax)
    {
        objAjax.setActionURL(url);
        objAjax.setActionMethod("release");
        objAjax.setProcessHandler(_showCapacityScreen);
        if(objHTMLData.checkForChanges())
        {
        	objHTMLData.performSaveChanges(_showSubmitWorkArea, objAjax);
       	}
       	else
       	{
       		objAjax.sendRequest();
       	}
        if(objAjax.isProcessComplete())
    	{
        	objHTMLData.resetChangeFields();
        }
    }
}

//The function to delete the capacity projections
function cancelCapProjections()
{
	if(!isValidRecord(true))
	{
		return;
	}
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
    {
        var htmlErrors = objAjax.error();
        objAjax.error().addError("warningInfo", "Please select Capacity Projection(s).", false);
        messagingDiv(htmlErrors);
        return;
    }
    sectionName ="_divWorkArea";
    var url = "capacityprojectionsoverview.do";
    bShowMsg=true;
    if(objAjax)
    {
        objAjax.setActionURL(url);
        objAjax.setActionMethod("cancel");
        objAjax.setProcessHandler(_showCapacityScreen);
        if(objHTMLData.checkForChanges())
        {
        	objHTMLData.performSaveChanges(_showSubmitWorkArea, objAjax);
       	}
       	else
       	{
       		objAjax.sendRequest();
       	}
        if(objAjax.isProcessComplete())
    	{
        	objHTMLData.resetChangeFields();
        }
    }
}

//Function to calculate the percentage total this year
function cPerTotLY(obj)
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName ="_divWorkArea";
    var url = "capacityprojectionsoverview.do";
    bShowMsg=true;
    var id=obj.id;
    if(objAjax)
    {
        objAjax.setActionURL(url);
        objAjax.setActionMethod("calcTotLY&fieldId="+id);
        objAjax.setProcessHandler(_setChangedFieldsToDetail);
       	if(objHTMLData.checkForChanges())
        {
        	objHtmlData.addToChangedFields(obj);
        	objHTMLData.performSaveChanges(_setChangedFieldsToDetail, objAjax);
       	}
       	else
       	{
       		objAjax.sendRequest();
       	}
    }
}
//Function to calculate the percentage total this year
function cPerTotTY(obj)
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName ="_divWorkArea";
    var url = "capacityprojectionsoverview.do";
    bShowMsg=true;
    var id=obj.id;
    if(objAjax)
    {
        objAjax.setActionURL(url);
        objAjax.setActionMethod("calcTotTY&fieldId="+id);
        objAjax.setProcessHandler(_setChangedFieldsToDetail);
       	if(objHTMLData.checkForChanges())
        {
        	objHtmlData.addToChangedFields(obj);
        	objHTMLData.performSaveChanges(_setChangedFieldsToDetail, objAjax);
       	}
       	else
       	{
       		objAjax.sendRequest();
       	}
    }
}
//Tracker #: 20129 VENDOR PROJECTION - RECALCULATE TY MO PROJ WHEN TY TOTAL PROJ IS CHANGED
//Function to calculate the Unit Diff.
function calcUnitdiff(obj)
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName ="_divWorkArea";
    var url = "capacityprojectionsoverview.do";
    bShowMsg=true;
    var id=obj.id;
    //alert(id);
    if(objAjax)
    {
        objAjax.setActionURL(url);
        objAjax.setActionMethod("calcUnitDiff&fieldId="+id);
        objAjax.setProcessHandler(_setChangedFieldsToDetail);
       	if(objHTMLData.checkForChanges())
        {
        	objHtmlData.addToChangedFields(obj);
        	objHTMLData.performSaveChanges(_setChangedFieldsToDetail, objAjax);
       	}
       	else
       	{
       		objAjax.sendRequest();
       	}
    }
}

//Function to calculate the proj alloc
function cProjAlloc(obj)
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName ="_divWorkArea";
    var url = "capacityprojectionsoverview.do";
    bShowMsg=true;
    var id=obj.id;
    if(objAjax)
    {
        objAjax.setActionURL(url);
        objAjax.setActionMethod("calcProjAlloc&fieldId="+id);
        objAjax.setProcessHandler(_showFieldValue);
        if(objHTMLData.checkForChanges())
        {
        	objHtmlData.addToChangedFields(obj);
        	objHTMLData.performSaveChanges(_showSubmitWorkArea, objAjax);
       	}
       	else
       	{
       		objAjax.sendRequest();
       	}
        
    }
}
function _setChangedFieldsToDetail(objAjax)
{
	var fldNvals=objAjax.getResponseHeader("_fldNvals");
	var fldLst=fldNvals.split(",");
	for(var i=0;i<fldLst.length-1;i++)
	{
		var f=fldLst[i];
		var fSplt=f.split("=");
		//alert(fSplt);
		var fld=fSplt[0];
		//alert(fld);
		var vl=fSplt[1];
		//alert(vl);
		var obj=getElemnt(fld);				
		objHtmlData.addToChangedFields(obj);
		//If obj present then only assign value
		//Tracker#19377
		if (obj)
		{
			obj.value=vl;			
		}		
	}
	var totIndx = objAjax.getResponseHeader("_totIndx");
    var totPercent = objAjax.getResponseHeader("_totPercent");
    if ( totPercent != null )
    {
    	var obj = getElemnt("_totTxt"+totIndx);
    	if ( obj)
    	{
    		obj.value = totPercent;
    	}
    }
}

function _showFieldValue(objAjax)
{
    var compId=objAjax.getResponseHeader("_compId");
    var value=objAjax.getResponseHeader("_value");
    var totIndx = objAjax.getResponseHeader("_totIndx");
    var totPercent = objAjax.getResponseHeader("_totPercent");
    if ( totPercent != null )
    {
    	var obj = getElemnt("_totTxt"+totIndx);
    	if (obj)
    	{
    		obj.value = totPercent;
    	}
    }
    var obj=getElemnt(compId);
    if ("" != value)
    {
	    obj.value=value;
	    var htmlAreaObj = _getWorkAreaDefaultObj();
	    var objHTMLData = htmlAreaObj.getHTMLDataObj();
	    objHtmlData.addToChangedFields(obj);
    }
}
/*
 * Below function _capDetailFillis similar to 
 * function _fill of fillupfilldown.js.
 *       
 * */
function _capDetailFill(divId, action, colpseDivId)
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
	if(!prcesss || !obj )
	{
		//Tracker#:16784 - PLM SCREENS: INCONSISTENCIES REGARDING FILL UP / FILL DOWN / FILL SELECTED MESSAGE
		//Giving warning message as per the user action.
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
	if(isFldDesc==true)
	{
		//get the code object
		var objcd = _getDescCodeField(obj);
		if(objcd)
		{
			filValCode = objcd.value;
			
		}
	}	
	
	if(action=='fillselected')
	{
		
		_capDetailFillProcess('fillup', obj, filVal, isFldDesc, filValCode, true);
		_capDetailFillProcess('filldown', obj, filVal, isFldDesc, filValCode, true);
	}	
	else
	{	
		_capDetailFillProcess(action, obj, filVal, isFldDesc, filValCode);
		_callFillUpDown(obj,action);
	} 
	
	if(divObjCol && divObjCol.onclick)
	{
		divObjCol.onclick();
	}
}
/**
 * 
 * @param {} obj
 * @param {} action
 * Tracker#: 19558  projections - sometimes system stuck while doing calculations for fill down 
 */
function _callFillUpDown(obj,action)
{
	if ( !obj)
	{
		//Tracker#:16784 - PLM SCREENS: INCONSISTENCIES REGARDING FILL UP / FILL DOWN / FILL SELECTED MESSAGE
		//Giving warning message as per the user action.
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
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName ="_divWorkArea";
    var url = "capacityprojectionsoverview.do";
    bShowMsg=true;
    var id=obj.id;
    if(objAjax)
    {
        objAjax.setActionURL(url);
        objAjax.setActionMethod("fillAll&fieldId="+id+"&action="+action);
        objAjax.setProcessHandler(_setChangedFieldsToDetail);
       	if(objHTMLData.checkForChanges())
        {
        	objHtmlData.addToChangedFields(obj);
        	objHTMLData.performSaveChanges(_setChangedFieldsToDetail, objAjax);
       	}
       	else
       	{
       		objAjax.sendRequest();
       	}
    }
}
/*
 * Below function _capDetailFillProcessis similar to 
 * functions _fillProcess  of fillupfilldown.js.
 *    
 * */

function _capDetailFillProcess(action, obj, filVal, isFldDesc, filValCode, chkSelected)
{
	var npSblTr;
	var setChgVal = true;
	
	while(obj)
	{
		setChgVal = true;
		var td = _findParentObjByTagName(obj, 'td');
		var tr = _findParentObjByTagName(obj, 'tr');
		//alert("td " + td + "\n tr = "+ tr);
		if(tr && td)
		{	
			var chldInd = _findChldIndex(obj, td);
			//alert("action-->"+action);
			if(action == 'fillup')
			{
				npSblTr = _findPreviousSiblingObj(tr, 'tr', td);
			}
			if(action == 'filldown')
			{
				npSblTr = _findNextSiblingObj(tr, 'tr', td);
			}
			obj = null;
			//alert("td.cellIndex " + td.cellIndex);
			//alert("nxtCtrl " + nxtCtrl.cells[td.cellIndex]);
		 	if(npSblTr )
			{		
				if(true==chkSelected)
				{
					//alert(npSblTr.outerHTML);
					setChgVal = _checkChkBoxSelected(npSblTr);
				}
						
				npSblTr = npSblTr.cells[td.cellIndex];
				
				if(chldInd>-1)
				{
					obj = _findChldObjByInd(npSblTr, chldInd);
					
					//alert("chkbox selected = " +setChgVal);
					
					if(obj && (setChgVal==true))
					{							
						_capDtlSetObjValInChg(obj, filVal,chkSelected);
						
						if(isFldDesc==true)
						{
							//get the code object
							var objcd = _getDescCodeField(obj);
							_capDtlSetObjValInChg(objcd, filValCode,chkSelected);										
						}						
					}
					//alert(obj.outerHTML);				
				}
			}
		}	
	}
}
/*
 * Below function _capDtlSetObjValInChg is similar to 
 * function  _setObjValInChg  of fillupfilldown.js.
 * 
 * */

function _capDtlSetObjValInChg(obj, newvalue,chkSelected)
{
	if(obj)
	{
		obj.value = newvalue;		
		if(obj.onchange && chkSelected)
		{
			obj.onchange();
		}
		if(obj.onfocus)
		{
			obj.onfocus();
		}
		if(obj.onblur)
		{
			obj.onblur();
		}
		
	}
}

/**
 * Functions sets the mouse over and mouse out evenst for the row
 * @param {} obj
 * @param {} rowId
 * @return {}
 * Tracker#:19511-REGRESSION - PROJECTIONS - DETAIL SECTION SLIDER IS MOVED TOO FAR TO THE RIGHT
 */
function _setCapMEvents(obj, rowId)
{
	obj.onmouseover = function()
	{
		_rwCapHlt(obj, rowId);
	}
	obj.onmouseout = function()
	{
		_rwCapUnHlt(obj, rowId);
	}
    return -1;
}
/**
 * Function to  highlight the row. 
 * @param {} obj
 * @param {} rowId
 * @return {}
 * Tracker#:19511-REGRESSION - PROJECTIONS - DETAIL SECTION SLIDER IS MOVED TOO FAR TO THE RIGHT
 */
// Mouse over event handler attached to a row.
function _rwCapHlt(obj, rowId)
{
    // For the Search List section only
    // just higlight the row identified by obj
    if(obj)
    {
        obj.style.background='#F4EDAD';
    }
    var rw = getElemnt(rowId);
    if(rw)
    {
        rw.style.background='#F4EDAD';
    }
    return -1;
}

/**
 * Function to  remove the highlight from the row. Mouse out event - Make the background as white color. 
 * @param {} obj
 * @param {} rowId
 * @return {}
 * Tracker#:19511-REGRESSION - PROJECTIONS - DETAIL SECTION SLIDER IS MOVED TOO FAR TO THE RIGHT
 */
function _rwCapUnHlt(obj, rowId)
{
    if(obj)
    {
        obj.style.background='#FFFFFF';
    }
    var rw = getElemnt(rowId);
    if(rw)
    {
        rw.style.background='#FFFFFF';
    }
    return -1;
}
/**
 * This function will check the check box on focus of the component
 * @param {} obj
 * @param {} rwId
 * Tracker#:19511-REGRESSION - PROJECTIONS - DETAIL SECTION SLIDER IS MOVED TOO FAR TO THE RIGHT
 */
function fDRCSelCap(obj,rwId)
{
    var tr = getElemnt(rwId);
    if(obj)
    {
       //in htmlcomponent.js
       selectTDChkBox(tr, true);
    }
}
//Tracker#:- 19815  capacity projections detail lines do not sort
function sortProjOvViewColumn(fieldName,sec,type, pageNo)
{
	if(!isValidRecord(true))
	{
		return;
	}
    sectionName ="_divWorkArea";;
    //Tracker#: 16691 MATERIAL PROJECTIONS - ENTER DATA, CLICK SORT, ROWS SORTED DATA IS LOST
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax =  htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    if(objAjax)
    {
    	//Tracker#: 16691 MATERIAL PROJECTIONS - ENTER DATA, CLICK SORT, ROWS SORTED DATA IS LOST
    	// Changes have been done, prompt the User
		// to decide whether the User will Save or
		// continue with the sorting.
		var url = "SORT&sortColumn="+fieldName+"&sort="+type+"&pageNum="+pageNo;
		if(objHTMLData!=null && objHTMLData.isDataModified())
        {
            var htmlErrors = objAjax.error();
            htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
	   		messagingDiv(htmlErrors, "saveWorkArea()", "laodPLMSortColumn('capacityprojectionsoverview.do','"+url+"',_showCapacityScreen);");
	   		return;
        }
		else
		{
			laodPLMSortColumn('capacityprojectionsoverview.do',url,_showCapacityScreen);
		}        
    }
    
    
}

var fldDelim = "@,";
var capProjPopUp = new QSearchChangeFields();
function copyFrmCapProjections()
{
	capProjPopUp.resetChngFlds();
    var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	var actMethod ="copyfromcapproj&nsrchName=capProjPopUp";
	var htmlfldName = htmlAreaObj.getDivSectionId();
	if(!isValidRecord(true))
    {
        return;
    }
    if(objAjax)
    {
    	_startSmartTagPopup(htmlfldName, false, true, false, false);
        objAjax.setActionURL("capacityprojectionsoverview.do");
        objAjax.setActionMethod(actMethod);
        objAjax.setProcessHandler(copyResponse);
        objAjax.sendRequest();
    }
	
}

function copyResponse(objAjax)
{
	if(objAjax)
	{
	    _displayProcessMessage(objAjax);
	    if(!objAjax.isProcessComplete())
	    {
	        _closeSmartTag();
	    }
	    else
	    {
	        var popUpDiv = _showSmartTagPopup(objAjax);
	        positionPageCenter(popUpDiv);
	    }
	}
}
function positionPageCenter(divObj)
{
	if(divObj!=null)
	{
		var top=115;
		var left=320;
		divObj.style.top = top+"px";
		divObj.style.left = left+"px";
	}
}
function showAll()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	objAjax.setActionURL("capacityprojectionsoverview.do");
	objAjax.setActionMethod("capProjShowAll");
	objAjax.setProcessHandler(reloadSearchList);
	objAjax.sendRequest();
}

function Search(srchFn)
{
	var val = capProjPopUp.qsChngFldsNVal;
	var oprs = capProjPopUp.qsChngFldsOpr;
	var chFlds = capProjPopUp.qsChngFlds;
	
	var msg = "Please select search operator(s).";
	var noSearchMsg = "Please select search criteria.";

	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objHtmlData = _getAreaHTMLDataObjByDocView("6808");
   	var objAjax = htmlAreaObj.getHTMLAjax();
	objAjax.setActionURL("capacityprojectionsoverview.do");
	objAjax.setActionMethod("capProjSearch&search="+srchFn);
	//objAjax.setProcessHandler(reloadSearchList);

	// Adding the changed fields to the request.
	if(srchFn=='search')
		{
	var fls = "";
	for (i=0; i < chFlds.length; i++)
	{
		fls += chFlds[i]+fldDelim;
	}
	objAjax.parameter().add("dChFlds", fls);

	for (i=0; i < val.length; i++)
	{
		var spl = val[i].split("|");
		objAjax.parameter().add(spl[0], spl[1]);
		var op = getElemnt(spl[0]+"_opr");
		//If the user has not selected the operator for the field show message.
		// otherwise add operator field id and value to request
		if (op.value == "-1" )
		{
			var objAjax = new htmlAjax();
			var htmlErrors = objAjax.error();
			objAjax.error().addError("warningInfo", msg, false);
			messagingDiv(htmlErrors);
			return;
		}else
		{
			objAjax.parameter().add(spl[0]+"_opr", op.value);
		}
	}
	var hasNullOpr = false;
	for (i=0; i < oprs.length; i++)
	{
		s = oprs[i];
		var spl = s.split("|");
		if (  spl[1] == "13" || spl[1] == "14")
		{
			hasNullOpr = true;
			var op = getElemnt(spl[0]);
			objAjax.parameter().add(spl[0], op.value);
		}
	}
	if (!hasNullOpr && val.length < 1)
	{
		var objAjax = new htmlAjax();
		var htmlErrors = objAjax.error();
		objAjax.error().addError("warningInfo", noSearchMsg, false);
		messagingDiv(htmlErrors);
		return;
	}
	}
	bShowMsg = true;
	objAjax.setProcessHandler(reloadSearchList);
	objAjax.sendRequest();
}



function reloadSearchList(objAjax)
{
	if(objAjax)
	{
		if(objAjax.isProcessComplete())
		{
			$("#CAP_PROJ_LIST").html(objAjax.getResult());
		}
		if(bShowMsg==true)
	   	{
	   		msgInfo = objAjax.getAllProcessMessages();
		    if(msgInfo!="")
		    {
		        _displayProcessMessage(objAjax);
		    }
	   	}
		
	}
	
 	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objdata =_getAreaHTMLDataObjByDocView("6808");
	objdata.resetChangeFields();
	objAjax = null;
}

function resetSearchPopUp(divId,qSrch)
{
	qSrch.resetChngFlds();
	$('#'+divId +' input[type="text"]').val('');
	$('select option:first-child').attr("selected", "selected");
}

function Post()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objHTMLData = _getAreaHTMLDataObjByDocView("6808");
   	var objAjax = htmlAreaObj.getHTMLAjax();
   	sectionName ="_divWorkArea";
   	if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
    {
        var htmlErrors = objAjax.error();
        objAjax.error().addError("warningInfo", "Please select a row.", false);
        messagingDiv(htmlErrors);
        return;
    }
    else
    {
        var chngFlds= objHtmlData.getChangeFields();
        var chlen=chngFlds.length;
        if(chlen>1)
        {
        	 var htmlErrors = objAjax.error();
		     objAjax.error().addError("warningInfo", szMsg_Sel_A_Row, false);
		     messagingDiv(htmlErrors);
		     return;
        }
        else
        {
        	bShowMsg=true;
        	objAjax.setActionURL("capacityprojectionsoverview.do");
		 	objAjax.setActionMethod("post");
		 	objAjax.setProcessHandler(_showCapacityScreen);
		 	objAjax.parameter().add("chgflds", objHTMLData.getChangeFields());
		 	objAjax.sendRequest();
		 	_closeSmartTag();
        }

	}
   	
}
function cpShowNextPage(pageNo,sec,url)
{
	
    sectionName = sec;

    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    if(objAjax)
    {
    	
        	_cpcontinueShowNextPage(pageNo,url);
    }
}

function _cpcontinueShowNextPageSave()
{    	
	closeMsgBox();
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	
	if(objAjax)
	{	
    	objHtmlData.performSaveChanges(_defaultWorkAreaSave);
	}
}

function _cpcontinueShowNextPage(pageNo,url)
{
	closeMsgBox();
	
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	    	
	if(objAjax)
	{		
    	objAjax.setActionURL(url);
    	objAjax.setActionMethod("NEWPAGING&pageNum="+pageNo);
    	objAjax.setProcessHandler(reloadSearchList,objAjax);
    	objAjax.sendRequest();
	}
}

function sortCapProjPopColumn(fieldName,sec,type, pageNo)
{
    sectionName ="_divWorkArea";;
    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax =  htmlAreaObj.getHTMLAjax();
    if(objAjax)
    {
		var url = "POPUPSORT&sortColumn="+fieldName+"&sort="+type+"&pageNum="+pageNo;
		laodPLMSortColumn('capacityprojectionsoverview.do',url, reloadSearchList);
    }
}

function copyToCapProjections()
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	var actMethod ="copyTo";
	sectionName ="_divWorkArea";
	if(!isValidRecord(true))
    {
        return;
    }
    if(objAjax)
    {	
    	bShowMsg=true;
        objAjax.setActionURL("capacityprojectionsoverview.do");
        objAjax.setProcessHandler(_showCapacityScreen);
        objAjax.setActionMethod(actMethod);
        objAjax.sendRequest();
    }
}

var CP = {};

// Add Keydown event for all the controls on the Search Popup. So that
// enter key is handled to call Search action
CP.handleInputKeyDownAction = function handleInputKeyDownAction(evt, obj)
{
    var code;
    // make sure we have a valid event variable
    if (!evt && window.event)
    {
        evt = window.event;
    }
    code = evt.keyCode;

    if (code == 13)
    {
        obj.onchange();
        //Submit search
        Search("search");
    }

    return true;
}
