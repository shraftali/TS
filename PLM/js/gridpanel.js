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

var actionId;
var tbl;
var tblRow,cntRow;
//Tracker# 15225 - TSR-506 ARTWORK ON TECH SPEC - DRAG DROP ARTWORK ON TECHSPEC
//Added view id 4213 for Combo view
var fullVws=new Array("2905","2907","2908","2909","3305","3308","3309","3310","3507","4206","4210","4211","4212","4213");//Doc views from which the items can be dragged and dropped to panel.
var drgClrViews=new Array("2905","2907","2908","2909","3507");//Color Library Doc views from which the items can be dragged and dropped to panel.
var drgMtrViews=new Array("3305","3308","3309","3310");//Material Library Doc views from which the items can be dragged and dropped to panel.
//Tracker# 15585- TSR-509 DRAG COLOR AND ARTWORK TO BOM
//Added 3507- Artwork in colorpalette
var drgArtViews=new Array("4206","4210","4211","4212","4213","3507");//Artwork Library Doc views from which the items can be dragged and dropped to panel.

//Tracker# 15585- TSR-509 DRAG COLOR AND ARTWORK TO BOM
//Tracker#16096 - NEW MATERIAL PALETTE SCREEN
//Added droppale view 2908,4211,2905,4213,3507
//Tracker# 17044 -NOT ABLE TO DRAG AND DROP THE MATERIAL LIBRARY RECORDS FROM MY STUFF IN MATERIAL PALETTE SCREEN
//Added 3305 entry to 6000(List), 6009(Medium) and 6010(Large) doc view
var pnlViews=new Array("132:2905-2907-2908-2909-3507-4211-4213",
					   "14000:3305-3308-3309-3310-2908-4211-2905-4213-3507",
					   "3500:3507-2905-2907-2908-2909-4206",
					   "3506:3507-2905-2907-2908-2909-4206",
					   "3509:3507-2905-2907-2908-2909-4206",
					   "3510:3507-2905-2907-2908-2909-4206",
					   "3511:3507-2905-2907-2908-2909-4206",
					   "3512:3507-2905-2907-2908-2909-4206",
					   "6000:3300-3309-3010-3305",
					   "6009:3300-3309-3010-3305",
					   "6010:3300-3309-3010-3305"
					   );//Doc views where grid panel is present with the views from which the items can be dragged to it.
					     
var clrArray =new Array();
var mtrArray =new Array();
var artArray =new Array();
var actnsArray=new Array();
var docView='';
var tspec_msg='Please save the changes made to the Tech Spec before adding the color or artwork.';
var bom_msg='Please save the changes made on the screen before adding the item.';
//Tracker# 14637 - PLM - COLORS ADDED TO COLORWAY FROM MASTER PALETTE NEEDS TO PULL NRF, ALT1, AND ALT2
var keyInfos=new Array();
//Tracker#15738:BOM ASSOCN: SYSTEM ALLOWS YOU TO DRAG AND DROP ON BLANK COMPONENT ROWS
var _grdCompSep='~~';

/*This function called on click of action button
*/
//Tracker# 14930-COLOR PALETTE RO SECURITY DOESN'T PREVENT ADDING COLORS VIA DRAG AND DROP FUNCTIONS
//Added security enabled argument to the function
function displayInPanel(msg,id,obj,div,mainDiv,docViewId,enabled)
{
	
	//If security is enabled then only proceed 
	if(enabled)
	{
		
		//alert(docViewId);
		docView=docViewId;
		//Tracker# 12053 : MESSAGE PROMPT FOR SAVING REQUIRED BEFORE USING DRAG AND DROP
		// Checking whether user has modified some data. If yes then displaying message to save the changes.
		// This will happen on click of 'Add Colors' button
		var areaObj =_getAreaObjByDocView(docView);
		var objdata = areaObj.getHTMLDataObj();		
		if(objdata.isDataModified())
		{
			var mg=new htmlErrors();
			if(docView=='132')
			{
				mg.addWarning(tspec_msg);
				var objMsgDiv = new messagingDiv(mg);
				return false;
			}
			
			//Tracker#:20221 - ADD COLOR TO BOM VIA HOT PLATE BLANKS OUT OTHER NON SAVED COLORS
			//Checking whether user has modified some data. If yes then displaying message to save the changes.
			// This will happen on click of 'Add Color', 'Add Artwork' etc,.
			else  if(docView=='14000')
			{
				mg.addWarning(bom_msg);
				var objMsgDiv = new messagingDiv(mg);
				return false;
			}			
		}
		//alert('here1');
		cancelSetting();
		//alert('here2');
		var obj1=getElemnt('pnlMsgDispCell');
		//alert('here3');
		obj1.innerHTML='&nbsp;&nbsp;'+msg;
		//alert('here4');
		actionId=id;
		//alert(actionId);
		removeButtonStyle();
		showButtons(obj,div,mainDiv);
		actnsArray[actnsArray.length]=id;
	//alert(docView);
	}
}

/*This function called on click of Cancel button
*/
function cancelSetting()
{
	removeButtonStyle();
	var obj=getElemnt('pnlMsgDispCell');
	obj.innerHTML='';
	actionId='';
	//var pnlLbl=getElemnt('_panelLbl');
	//pnlLbl.innerText='';
	var elem=getElemnt('_pnlScrlDiv');
	if(elem)
	{
		var nodes=elem.childNodes;
		var len=elem.childNodes.length;
		while (elem.hasChildNodes())
		{
	  		elem.removeChild(elem.firstChild);
		}
	}
	tblRow=null;
	cntRow=null;
	tbl=null;
	clrArray=new Array();
	mtrArray=new Array();
	artArray=new Array();
	//Tracker# 14637 - PLM - COLORS ADDED TO COLORWAY FROM MASTER PALETTE NEEDS TO PULL NRF, ALT1, AND ALT2
	keyInfos=new Array();
}
//Tracker #:13847 INCONSISTENCIES REGARDING LINKS ON PLM SCREENS WHICH BRING YOU TO OTHER SCREENS -ALL ARE DIFFERENT
//Reverting back removing the class name clsTextLabelLink
function removeButtonStyle()
{
	for(var j=0;j<actnsArray.length;j++)
	{
		//alert(actnsArray[j]);
		var exstbtn=getElemnt(actnsArray[j]);
		var lftCell=exstbtn.getElementsByTagName("TD");
		for(var i=0;i<lftCell.length;i++)
		{
			if(i==0)
			lftCell[i].className='';
			if(i==1)
			{
				//var txt=lftCell[i].innerText;
				//lftCell[i].innerHTML='<u>'+txt+'</u>';
				lftCell[i].style.nowrap=true;
				lftCell[i].className='';
			}
			if(i==2)
			lftCell[i].className='';
		}
	}
}	



/*This function to show the action buttons
*/
function showButtons(obj,div,mainDiv)
{
	var lftCell=obj.getElementsByTagName("TD");
	for(var i=0;i<lftCell.length;i++)
	{
		//alert('here');
		if(i==0)
		lftCell[i].className='clsBarLeftButton';
		if(i==1)
		{
			//alert('here1');
			//var txt=lftCell[i].innerText;
			//alert(txt);
			//lftCell[i].innerHTML=txt;
			lftCell[i].style.nowrap=true;
			//alert('here2');
			lftCell[i].className='clsBarCenterButton';
		}
		if(i==2)
		lftCell[i].className='clsBarRightButton';
	}
}

/* This function called from dragEnd function in colorlibdragdrop.js. Called when the 
   element is dropped to the grid panel.
*/
function displayOnPanelGrid(div,elem,keyInfo,color)
{
	
	var cElem=getElemnt('_pnlScrlDiv');
	var docviewid=getCustomAttribute(elem, "docviewid");
	//alert(docView);
	//alert(docviewid);
	//alert(panelView(docView,docviewid));
	//alert(droppableView(docviewid,fullVws));
	//alert(color);
	//Tracker# 14637 - PLM - COLORS ADDED TO COLORWAY FROM MASTER PALETTE NEEDS TO PULL NRF, ALT1, AND ALT2
	// Adding the keyinfo tp the array
	keyInfos[keyInfos.length]=keyInfo;
	if(panelView(docView,docviewid) && droppableView(docviewid,fullVws)&&actionId!='')
	{
		var len=elem.childNodes.length;
		//alert(droppableView(docviewid,drgArtViews));
		//alert(elem.outerHTML);
		if(droppableView(docviewid,drgClrViews)||droppableView(docviewid,drgMtrViews)||droppableView(docviewid,drgArtViews))
		{	
			for (var i=0;i<len;i++)
			{
		  		//Tracker # 14892- THE COLOR PALETTE SECTION ON THE COLOR LIBRARY SCREEN IS NOT REFRESHING PROPERLY.  THERE IS A DELAY.
            	//Check for actionid with uppercase added.
		  		if(elem.childNodes[i].id=='_hClrName'&& (actionId.toUpperCase()=='COLORS' || actionId.toUpperCase()=='ACCENTS' ))
		  		{
		  			//Tracker# 15585- TSR-509 DRAG COLOR AND ARTWORK TO BOM
		  			//If color already added  in BOMC panel display a warning message
		  			if(docView==14000 && clrArray.length == 1)
		  			{
		  				var htmlErrors = new htmlAjax().error();
	    				htmlErrors.addError("warningInfo", "Please apply selected color before dragging an additional color. ",  false);
	    				messagingDiv(htmlErrors);	
	    				return false;
		  			}
		  			var clr=elem.childNodes[i].value;
		  			if(!containsColor(clr))
		  			{
		  				clrArray[clrArray.length]=clr;		
		  			}else
		  			{
		  				return false;
		  			}
		  			var tbl=getTable(div,keyInfo,color,elem);		
					cElem.appendChild(tbl);
		  		}else if(elem.childNodes[i].id=='_hMtrName')
		  		{
		  			var mtr=elem.childNodes[i].value;
		  			if(!containsMaterial(mtr))
		  			{
		  				//Tracker#: 17044 NOT ABLE TO DRAG AND DROP THE MATERIAL LIBRARY RECORDS FROM MY STUFF IN MATERIAL PALETTE SCREEN
		  				//Encoding the string
		  				mtrArray[mtrArray.length]=escape(mtr);		
		  			}else
		  			{
		  				return false;
		  			}
		  			var tbl=getTable(div,keyInfo,color,elem);		
		  			//prompt("",tbl.outerHTML);
					cElem.appendChild(tbl);
					//Tracker # 14892- THE COLOR PALETTE SECTION ON THE COLOR LIBRARY SCREEN IS NOT REFRESHING PROPERLY.  THERE IS A DELAY.
            		//Check for actionid with uppercase added.
		  		}else if(elem.childNodes[i].id=='_hArtName' && actionId.toUpperCase()=='ARTWORKS')
		  		{
		  			//Tracker# 15585- TSR-509 DRAG COLOR AND ARTWORK TO BOM
		  			//If artwork artwork added in BOMC panel display a warning message
		  			if(docView==14000 && artArray.length == 1)
		  			{
		  				var htmlErrors = new htmlAjax().error();
	    				htmlErrors.addError("warningInfo", "Please apply selected artwork before dragging an additional artwork. ",  false);
	    				messagingDiv(htmlErrors);	
	    				return false;
		  			}
		  			var mtr=elem.childNodes[i].value;
		  			if(!containsArtwork(mtr))
		  			{
		  				artArray[artArray.length]=mtr;		
		  			}else
		  			{
		  				return false;
		  			}
		  			var tbl=getTable(div,keyInfo,color,elem);		
		  			//prompt("",tbl.outerHTML);
					cElem.appendChild(tbl);
		  		}
			}
		}		
	}
	//Tracker# 15225 - TSR-506 ARTWORK ON TECH SPEC - DRAG DROP ARTWORK ON TECHSPEC
	// Added warning message
	else if(! actionId || actionId=='')
	{
		var htmlErrors = new htmlAjax().error();
	    htmlErrors.addError("warningInfo", "Please click and highlight the Add links to enable drag and drop to this area.",  false);
	    messagingDiv(htmlErrors);		
		
	}
	////alert(cElem.outerHTML);
}
/*
This function to check whether the color info is present or not
*/
function containsColor(keyInfo)
{
	if(clrArray.length==0) return false;
	for(var i=0;i<clrArray.length;i++)
	{
		if(clrArray[i]==keyInfo)
		{
			return true;
		}
	}
	return false;
}
/*
This function to check whether the material info is present or not
*/
function containsMaterial(keyInfo)
{
	if(mtrArray.length==0) return false;
	for(var i=0;i<mtrArray.length;i++)
	{
		if(mtrArray[i]==keyInfo)
		{
			return true;
		}
	}
	return false;
}
/*
This function to check whether the artwork info is present or not
*/
function containsArtwork(keyInfo)
{
	if(artArray.length==0) return false;
	for(var i=0;i<artArray.length;i++)
	{
		if(artArray[i]==keyInfo)
		{
			return true;
		}
	}
	return false;
}
/*
This function is used to display the dragged in component inside a <TABLE> 
*/
function getTable(div,keyInfo,color,oElem)
{
	var nodes=oElem.childNodes;
	var len=oElem.childNodes.length;
	var clrSplit;
	var cName='';
	var keyInfo='';
	var anc;
	var fullname='';
	for (var i=0;i<len;i++)
	{
  		if(oElem.childNodes[i].id=='_hClrName'||oElem.childNodes[i].id=='_hMtrName'||oElem.childNodes[i].id=='_hArtName')
  		{
  			//Tracker#18331 REGRESSION:UNABLE TO DRAG & DROP ARTWORKS THAT HAVE '&' IN ARTWORK COMBO NAME
  			//Using _FIELDS_SEPERATOR to separate the values
  			clrSplit=oElem.childNodes[i].value.split(_FIELDS_SEPERATOR);
  			cName=clrSplit[0];
  			keyInfo=clrSplit[1];
  		}
	}
	fullname=cName;
	if(cName.length > 10)
	{
		cName=cName.substring(0,10)+'...';
	}
	if(!tbl)
	{
		tbl=document.createElement("table");
		tbl.cellPadding='3';
	}
	if(!tblRow)
	{
		tblRow=tbl.insertRow(-1);
		cntRow=tbl.insertRow(-1);
	}
	var cell=tblRow.insertCell(-1);
	cell.style.height='50px';
	cell.style.width='50px';
	var cntCell=cntRow.insertCell(-1);
	
	//Tracker# 15225 - TSR-506 ARTWORK ON TECH SPEC - DRAG DROP ARTWORK ON TECHSPEC
	//Moved common piece of code outside the conditions.
	var inrTbl=document.createElement("table");
	var inrTblRow=inrTbl.insertRow(-1);
	var inrCell=inrTblRow.insertCell(-1);
	inrCell.style.width='50px';					
	inrCell.style.height='50px';
	inrCell.id='_clrCell';
	inrCell.innerText='';
	cell.appendChild(inrTbl);
	//Tracker#:16293 TSR-506 F5-COLORWAY FIELD NEED TO BE CONFIGURABLE FOR ARTWORK COMBOS
	//Replace the field seperator values by hyphen(-) to display the name in Grid Panel.
	cName = cName.replace(_KEY_VALUE_FIELDS_SEPERATOR, "-");
	cntCell.innerHTML=cName;
	//Tracker# 15225 - TSR-506 ARTWORK ON TECH SPEC - DRAG DROP ARTWORK ON TECHSPEC
	//Title added
	//Tracker#:16293 TSR-506 F5-COLORWAY FIELD NEED TO BE CONFIGURABLE FOR ARTWORK COMBOS
	//Replace the field seperator values by hyphen(-) to display the title in Grid Panel.
	clrSplit[0] = clrSplit[0].replace(_KEY_VALUE_FIELDS_SEPERATOR, "-");
	cntCell.title=clrSplit[0];
	cntCell.style.fontSize='7pt';
	cntCell.style.color='blue';
	cntCell.noWrap=true;
	if(div=='colorDiv')
	{
		var img=getImageFromColorDiv(oElem);		
		if(img!='')
		{
			inrCell.style.backgroundImage="url('"+img+"')";
			inrCell.style.backgroundRepeat='no-repeat';
			inrCell.style.backgroundPosition='center';
			img='';
		}
		else
		{
			inrCell.style.background=color;	
		}
	}else if(div=='imageDiv')
	{
		inrCell.style.backgroundImage="url('"+image+"')";
		inrCell.style.backgroundRepeat='no-repeat';
		inrCell.style.backgroundPosition='center';
		inrCell.noWrap=true;
	}
	return tbl;
}

/*Function called on click of Apply button in the panel. Doc view id corresponding to which doc view the panel is in.
*/
function apply(docviewid)
{
	//alert(docviewid);
	//alert(artArray);
	//alert(actionId);
	if(docviewid==132)
	{
		var areaObj =_getAreaObjByDocView(docView);
		//Tracker# 14930-COLOR PALETTE RO SECURITY DOESN'T PREVENT ADDING COLORS VIA DRAG AND DROP FUNCTIONS
		//Check added areaObj 
		if(areaObj)
		{
			var objdata = areaObj.getHTMLDataObj();
			//Tracker# 12053 : MESSAGE PROMPT FOR SAVING REQUIRED BEFORE USING DRAG AND DROP
			// Checking whether user has modified some data. If yes then displaying message to save the changes.
			// This will happen on click of 'Apply' button 
			if(objdata.isDataModified())
			{
				var msg=new htmlErrors();
				msg.addWarning(tspec_msg);
				var objMsgDiv = new messagingDiv(msg);
				cancelSetting();
				return false;
			}
			//Tracker 12621-ISSUES ON BLANK RECORD OF TECH SPEC
			//Check added for valid tech spec
			//alert(actionId);
			if(isValidTecSpec(true))
			{
				if(actionId=='COLORS')
				{
					applyPanelTechSpec();
				}else if(actionId=='ARTWORKS')
				{
					//Tracker# 15225 - TSR-506 ARTWORK ON TECH SPEC - DRAG DROP ARTWORK ON TECHSPEC
					//Calling the Apply function for Artworks
					applyPanelTechSpecArtworks();					
				}
			}
		}
	}
	
	//Tracker#:20221 - ADD COLOR TO BOM VIA HOT PLATE BLANKS OUT OTHER NON SAVED COLORS
	if(docviewid==14000)
	{
		var areaObj =_getAreaObjByDocView(docView);

		if(areaObj)
		{
			var objdata = areaObj.getHTMLDataObj();
			
			//Tracker#:20221 - Checking whether user has modified some data. If yes then displaying message to save the changes.
			// This will happen on click of 'Apply' button 
			if(objdata.isDataModified())
			{
				var msg=new htmlErrors();
				msg.addWarning(bom_msg);
				var objMsgDiv = new messagingDiv(msg);
				cancelSetting();
				return false;
			}
			
			//Tracker# 15585- TSR-509 DRAG COLOR AND ARTWORK TO BOM
			//If apply clicked on BOMC and action is not COLOR or ARTWORK
			if(actionId!='COLORS' && actionId!='ARTWORKS')
			{
				applyPanelBOMC();
			}
			//Tracker# 15585- TSR-509 DRAG COLOR AND ARTWORK TO BOM
			//If apply clicked on BOMC and action is COLOR
			else if (actionId=='COLORS')
			{
				//Tracker# 15585- TSR-509 DRAG COLOR AND ARTWORK TO BOM
				applyBOMCColor();
			}
			//Tracker# 15585- TSR-509 DRAG COLOR AND ARTWORK TO BOM
			//If apply clicked on BOMC and action is ARTWORK
			else if (actionId=='ARTWORKS')
			{
				//Tracker# 15585- TSR-509 DRAG COLOR AND ARTWORK TO BOM
				applyBOMCArtwork();
			}
		}
	}
	
	if(docviewid==3500
   		|| docviewid==3506
   		|| docviewid==3509
   		|| docviewid==3510
   		|| docviewid==3511
   		|| docviewid==3512 	
		)
		{
			// Tracker#:14435 ISSUE WITH SAVE PROMPT,SYSTEM DISPLAYS'PREVIOUS ACTION ENCOUNTERED ERROR'
			// For blank scren applyPanelColorPalette() should not be called, but give the message.
			if(!isValidColorPalette(true))
		    {
		    	return;
		    }
			applyPanelColorPalette();
		}
	//Tracker#:16096 - NEW MATERIAL PALETTE SCREEN
	else if (docviewid == 6000 || docviewid == 6009 || docviewid == 6010)
	{
		//params:  id of element, display msg yes/no, msg to be displayed
		if(!_checkIsValidRecord("_isValidMaterialPalette", true, szMsg_Invalid_Material_Palette))
		{
			return;
		}
		applyDragDropPanel("materialpaletteoverview.do", "mpapplydragdrop");
	}
}
/*Function called from techspec to save the tech spec with dragged in elements
*/
function applyPanelTechSpec()
{
    var url = "applytechspec";
 	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	sectionName = objAjax.getDivSectionId();
	//alert("sectionName  " + sectionName);
	//alert("clrArray  " + clrArray);
	//alert("clrArray.length  " + clrArray.length);
	
	if(clrArray.length < 1 && mtrArray.length < 1)
	{
		return false;
	}
    if(objAjax && objHTMLData)
    {
        bShowMsg = true;
        var colors=getComps(clrArray);
        //colors=encodeURIComponent(colors);
        var matrls=getComps(mtrArray);
        //matrls=encodeURIComponent(matrls);
        //Tracker# 14637 - PLM - COLORS ADDED TO COLORWAY FROM MASTER PALETTE NEEDS TO PULL NRF, ALT1, AND ALT2
        // Passing the keyinfo as query string
        var keys=getComps(keyInfos);    
        //Tracker#:16328 - 'ARRAY INDEX OUT OF RANGE: 1' ERROR DURING DRAG & DROP ARTWORKS TO TECHSPEC
        //Encoding the query string
        //keys=encodeURIComponent(keys);
        //Tracker#18331 REGRESSION:UNABLE TO DRAG & DROP ARTWORKS THAT HAVE '&' IN ARTWORK COMBO NAME
        //Using Ajax call instead of loadWorkArea function
        if(objAjax)
    	{
        	objAjax.setActionURL('techspecoverview.do');
        	objAjax.setActionMethod(url);
        	objAjax.parameter().add("colors", colors);
        	objAjax.parameter().add("materials", matrls);
        	objAjax.parameter().add("keyInfos", keys);
        	objAjax.parameter().add("sep", _grdCompSep);
        	objAjax.setProcessHandler(_showWorkArea);
        	objAjax.sendRequest();
        }
    }
    cancelSetting();
}

//Tracker# 15225 - TSR-506 ARTWORK ON TECH SPEC - DRAG DROP ARTWORK ON TECHSPEC		
/*Function called from techspec to save the tech spec with dragged in elements
*/
function applyPanelTechSpecArtworks()
{
    var url = "applytechspecartwork";
 	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	sectionName = objAjax.getDivSectionId();
	//alert("sectionName  " + sectionName);
	//alert("clrArray  " + clrArray);
	//alert("artArray.length  " + artArray.length);
	
	if(artArray.length < 1 && artArray.length < 1)
	{
		return false;
	}
    if(objAjax && objHTMLData)
    {
        bShowMsg = true;
        var artworks=getComps(artArray);
        //Tracker#:16328 - 'ARRAY INDEX OUT OF RANGE: 1' ERROR DURING DRAG & DROP ARTWORKS TO TECHSPEC
        //Encoding the query string  
        //artworks=encodeURIComponent(artworks);
		//alert(artwoks);
        //Tracker# 16294 - DRAGGING ARTWORK FROM PALETTE ONTO TECH PACK DOES NOT PULL ADDITIONAL FIELDS
        //Passing the keyinfo as query string
        var keys=getComps(keyInfos);    
        //Encoding the query string
        //keys=encodeURIComponent(keys);
        //Passing keyInfos value to action class
        //Tracker#18331 REGRESSION:UNABLE TO DRAG & DROP ARTWORKS THAT HAVE '&' IN ARTWORK COMBO NAME
        //Using Ajax call instead of loadWorkArea function
        if(objAjax)
    	{
        	objAjax.setActionURL('techspecoverview.do');
        	objAjax.setActionMethod(url);
        	objAjax.parameter().add("artworks", artworks);
        	objAjax.parameter().add("keyInfos", keys);
        	objAjax.parameter().add("sep", _grdCompSep);
        	objAjax.setProcessHandler(_showWorkArea);
        	objAjax.sendRequest();
        }
    }
    cancelSetting();
}

function applyPanelBOMC()
{
    //alert(actionId);
    var url = "applybomc";
 	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	sectionName = objAjax.getDivSectionId();
	//alert("sectionName  " + sectionName);
	if(clrArray.length < 1 && mtrArray.length < 1)
	{
		return false;
	}
    if(objAjax && objHTMLData)
    {
        bShowMsg = true;
        var matrls=getComps(mtrArray);
        //alert(matrls);
        //Tracker#15738:BOM ASSOCN: SYSTEM ALLOWS YOU TO DRAG AND DROP ON BLANK COMPONENT ROWS
        //Encoding query string added
        //matrls=encodeURIComponent(matrls);
        //Tracker#18331 REGRESSION:UNABLE TO DRAG & DROP ARTWORKS THAT HAVE '&' IN ARTWORK COMBO NAME
        //Using Ajax call instead of loadWorkArea function
        if(objAjax)
    	{
        	objAjax.setActionURL('bomc.do');
        	objAjax.setActionMethod(url);
        	objAjax.parameter().add("materials", matrls);
        	objAjax.parameter().add("actionId", actionId);
        	objAjax.parameter().add("sep", _grdCompSep);
        	objAjax.setProcessHandler(_showWorkArea);
        	objAjax.sendRequest();
        }
    }
    cancelSetting();
}

//Tracker# 15585-TSR-509 DRAG COLOR AND ARTWORK TO BOM
// Function called when Action selected as Color and Apply button clicked on BOMC screen 

function applyBOMCColor()
{
    //alert(actionId+"---");
    var url = "";
    var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	sectionName = objAjax.getDivSectionId();
	//alert(clrArray);
 	if(actionId=='COLORS')
	{
		//alert('Here');
		
		if(clrArray.length <1 )
		{
			return false;
		}
		if(!objHTMLData.hasUserModifiedData())
		{
			var htmlErrors = new htmlAjax().error();
	    	htmlErrors.addError("warningInfo", "Please select Component(s)/Colorway(s) for Applying the color. ",  false);
	    	messagingDiv(htmlErrors);
	    	return false;				
		}
		url="applyBOMCColorArtwork";
		//Tracker#15738:BOM ASSOCN: SYSTEM ALLOWS YOU TO DRAG AND DROP ON BLANK COMPONENT ROWS
        //Encoding query string added
		var colors=getComps(clrArray);
		//colors=encodeURIComponent(colors);
		//Tracker#18331 REGRESSION:UNABLE TO DRAG & DROP ARTWORKS THAT HAVE '&' IN ARTWORK COMBO NAME
		//Passing the parameter seperately
		objAjax.setActionMethod(url);
        objAjax.parameter().add("colors", colors);
        objAjax.parameter().add("actionId", actionId);
        objAjax.parameter().add("sep", _grdCompSep);	
	}
	objAjax.setActionURL("bomc.do");
  	objAjax.setProcessHandler(_showBOMC);
	objHTMLData.performSaveChanges(_showBOMC, objAjax);
	if(objAjax.isProcessComplete())
    {
        objHTMLData.resetChangeFields();
        cancelSetting();
    }
    
}
//Tracker# 15585-TSR-509 DRAG COLOR AND ARTWORK TO BOM
// Function called when Action selected as Artwork and Apply button clicked on BOMC screen 
function applyBOMCArtwork()
{
    //alert(actionId);
    var url = "";
    var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	sectionName = objAjax.getDivSectionId();
	//alert(artArray);
 	if(actionId=='ARTWORKS')
	{
		
		if(artArray.length <1 )
		{	
			return false;
		}
		if(!objHTMLData.hasUserModifiedData())
		{
			var htmlErrors = new htmlAjax().error();
	    	htmlErrors.addError("warningInfo", "Please select Component(s)/Colorway(s) for Applying the artwork. ",  false);
	    	messagingDiv(htmlErrors);
	    	return false;				
		}
		url="applyBOMCColorArtwork";
		var artworks=getComps(artArray);
		//Tracker#15738:BOM ASSOCN: SYSTEM ALLOWS YOU TO DRAG AND DROP ON BLANK COMPONENT ROWS
        //Encoding query string added
		//artworks=encodeURIComponent(artworks);
		//alert(artworks);
		//Tracker#18331 REGRESSION:UNABLE TO DRAG & DROP ARTWORKS THAT HAVE '&' IN ARTWORK COMBO NAME
		//Passing the parameter seperately
		objAjax.setActionMethod(url);
        objAjax.parameter().add("artworks", artworks);
        objAjax.parameter().add("actionId", actionId);
        objAjax.parameter().add("sep", _grdCompSep);		
	}
	objAjax.setActionURL("bomc.do");
  	objAjax.setProcessHandler(_showBOMC);
	objHTMLData.performSaveChanges(_showBOMC, objAjax);
	if(objAjax.isProcessComplete())
    {
        objHTMLData.resetChangeFields();
        cancelSetting();
    }
}



/*Function used to get the elements in array with ~ separated string
*/
function getComps(comps){
	var compns='';
	for(var i=0;i<comps.length;i++)
	{
		//Tracker#15738:BOM ASSOCN: SYSTEM ALLOWS YOU TO DRAG AND DROP ON BLANK COMPONENT ROWS
		//Removed hard coding        
		if(comps[i]!=null)
			compns+=comps[i]+_grdCompSep;
	}
	////alert("colors:"+colors);
	//replacing '#' from the request.From firefox the request with '#' character not getting forwarded 
	//var cls=compns.replace(/#/g,'');
	//cls=escape(cls);
	return compns;
}


function setCursorHand(obj)
{
	obj.style.cursor='pointer';
}

function resetGridPanel()
{
	 clrArray =new Array();
	 mtrArray =new Array();
	 artArray==new Array();
	 actnsArray=new Array();
}

/* This function checks whether the passed docview(view) has a grid panel.
   And the dview passed as second parameter is associated with the docview.  
*/
function panelView(view,dview)
{
	for(var i=0;i<pnlViews.length;i++)
	{
		var v=pnlViews[i];
		var splt=v.split(":");
		var pvw=splt[0];
		var vs=splt[1];
		var vws=vs.split("-");
		if(pvw==view)		
		{
			for(var j=0;j<vws.length;j++)
			{
				if(vws[j]==dview)
				{
					return true;
				}
			}
		}
	}
	return false;
}

/* This function checks whether the passed viewid is there in the array of view ids.
*/
function droppableView(view,vwAry)
{
	for(var i=0;i<vwAry.length;i++)
	{
		if(vwAry[i]==view)
		{
			return true;
		}
	}
	return false;
}

/*Post process function for applyBOMCArtwork and applyBOMCColor
*/
function _showBOMC(objAjax)
{
    //alert(" _showColorLibPage: \n sectionName "+sectionName);
    if(objAjax)
    {
	    //Tracker# 15585-TSR-509 DRAG COLOR AND ARTWORK TO BOM
	    //If process complete then only reload the area
	    if(objAjax.isProcessComplete())
	    {
	    	_reloadArea(objAjax, sectionName);
	        bShowMsg= false;
	    }
	    else
	    {
	    	//alert("show mesage");
	    	_displayProcessMessage(objAjax);
	    }
    }
}
