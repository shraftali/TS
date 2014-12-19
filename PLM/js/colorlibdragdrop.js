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
    
    var srcElement;
	var clone;
	var docId;
	var docViewId;
	var entry=false;
	var evnt;
	var color;
	var image;
	var colorDiv;
	var onColorSpot=false;
	var onImageSpot=false;
	var colsqrno;
	var startX;
	var startY;
	var clntX;
	var clntY;
	var osL = 0;
	var osT = 0;
	var dragable=false;
	var attached=false;
	var cbColors='CBCOLORS'; 
	var keyInfo;
	var assgnDiv;
	//view ids for drag and drop	
	//Tracker# 15225 - TSR-506 ARTWORK ON TECH SPEC - DRAG DROP ARTWORK ON TECHSPEC
	//Added view id 4213 for Combo view
	var ddViews=new Array("2905","2907","3305","3403","131","4206","2907","2908","2909","3308",
	"3309","3310","3507","4210","4211","4212","4213");
	var drg=false;
	function cancelevent()
    {
        window.event.returnValue = false;
    }
    // This method used to register the element for drag and drop
    function RegisterDrag(tag,dId,dViewId)
    {
    	if(attached==false)
    	{
	    	evnt='';
	    	entry=false;
	    	srcElement = tag;
	    	docId=dId;
	    	docViewId=dViewId;
	    	var tag = DragHandler.attach(srcElement,'_drag_drop');
	    	
    	}
    }
    
    // This method used to register the element only for dragging
    function RegisterDragOnly(tag)
    {
    	evnt='';
    	entry=false;
    	srcElement = tag;
    	var tag = DragHandler.attach(srcElement,'_drag_only');
    }
    
  	// Object to handle the dragging and dropping process
	var DragHandler = {
		// private property.
		_oElem : null,
		// public method. Attach drag handler to an element.
		attach : function(oElem,evt) 
		{
			oElem.onmousedown = DragHandler._dragBegin;
			evnt=evt;
			return oElem;
		},

		// private method. Begin drag process.
		_dragBegin : function(e) {
			
			//alert('here');
			e = e ? e : window.event;
			var clickType=e.button;
			if(clickType==2)
			   return false;
			attached=true;
			entry=false;
			var oElem = DragHandler._oElem = this;
			
			var mouseX = e.pageX;
			var mouseY = e.pageY;
			
			// Tracker#: 17049 - FIREFOX/SAFARI BROWSER - UNABLE TO SAVE SEARCH ON SEARCH SCREEN
			// _dragBegin function is preventing text from being entered into textbox.
			if (!IE) // Run code for browsers other than IE.
			{
				var popUpHeader = $(oElem).find(".clsPopupHeader");
				// if oElem has popup header, only perform dragging on popup header
				if (popUpHeader.length > 0) // if a matching element is found
				{
					// get the position of four edges of popup header
					var popUpHeaderOffset = $(popUpHeader).offset();
					var popUpHeaderTopPosition = popUpHeaderOffset.top;
					var popUpHeaderLeftPosition = popUpHeaderOffset.left;
					var popUpHeaderBottomPosition = popUpHeaderTopPosition + popUpHeader.height();
					var popUpHeaderRightPosition = popUpHeaderLeftPosition + popUpHeader.width();
					
					// If NOT mouse position inside popup header, don't perform drag & drag
					if (!(mouseX > popUpHeaderLeftPosition && mouseX < popUpHeaderRightPosition
						&& mouseY > popUpHeaderTopPosition && mouseY < popUpHeaderBottomPosition))
					{
						return;
					}
				}
			}
			
			if("_drag_drop"==evnt)
			{
		        //alert("inside");
		        clone=oElem.cloneNode(true);
		        var src=getImageFromColorDiv(clone);
		        if(src)
		        {
		        	if(src!=null && src.length>0)
		        	{
		        		createDragableImage(clone);
		        	}
		        } 
				
				startX = parseInt(_getComponentLeft(oElem)); 
			    startY = parseInt(_getComponentTop(oElem));
			    if(oElem.style.height)
			    { 
			    	var ht=oElem.style.height;
			    	ht=ht.substring(0,ht.indexOf("px"));
			    	if(parseInt(ht)>50)
			    	{
			    		clone.style.height="50px";
			    	}
			    	else{
			    		clone.style.height=oElem.style.height;
			    	}
			    }
			    else
			    {
			    	clone.style.height="50px";
			    }	
				clone.style.width=clone.style.height; //"50px";
			    clone.style.border="1px dashed white";
			    clone.style.cursor="move";
			    clone.style.Top=e.clientY+'px';
			    clone.style.Left=e.clientX+'px';
			    clone.style.zIndex=910;
			    document.body.appendChild(clone); 
				DragHandler._oElem=clone;
				//alert(oElem.outerHTML);
			}else if("_drag_only"==evnt)
			{
				e = e ? e : window.event;
		    	startX = parseInt(oElem.style.left); 
		    	startY = parseInt(oElem.style.top); 
		    	clntX=e.clientX;
		    	clntY=e.clientY;
				oElem.style.position = 'absolute';
				
			}
			document.onmousemove = DragHandler._drag;
		 	document.onmouseup = DragHandler._dragEnd;
			return false;
		},

		// private method. Drag (move) element.
		_drag : function(e) {
			drg=true;
		    e = e ? e : window.event;
			if (e.clientY > (document.body.offsetHeight - 15)) 
			{
				window.scrollBy(0,5);
			}
			else if (e.clientY < (15)) 
			{
				window.scrollBy(0,-5);
			}
			
			var oElem = DragHandler._oElem;
			oElem.style.position = 'absolute';
			if(IE){
				document.selection.clear();
			}
			if("_drag_only"==evnt)
			{
				if(dragable)
				{
					oElem.style.left = startX + e.clientX - clntX + "px";
  					oElem.style.top  = startY + e.clientY - clntY + "px";
  				}
  			}else
			{
		        var curX=(IE)?e.clientX+document.body.scrollLeft:e.pageX;
				var curY=(IE)?e.clientY+document.body.scrollTop:e.pageY;
		      	oElem.style.top =(curY+1) + 'px';
				oElem.style.left = (curX+1) + 'px';
			}
		    return false;
		},

		// private method. Stop drag process.
		_dragEnd : function(e) 
		{
			attached=false;
			drg=false;
			var oElem =DragHandler._oElem;
			
			if(IE)
			{
			    e = e ? e : window.event;
			    //alert('b4');
			    setEntryIfDroppable(e.srcElement,oElem);
			    //alert('after');
			}
			var x = parseInt(oElem.style.left);
			var y = parseInt(oElem.style.top);
			if("_drag_drop"==evnt){
			document.body.removeChild(clone);
			}
	        document.onmousemove = _mmove;
			document.onmouseup = _mmove;
			DragHandler._oElem = null;
			var elem="";
			//alert(oElem.outerHTML);
			keyInfo=getCustomAttribute(oElem, _AttributeNamekeyInfo);
			//alert(docViewId);
			//alert(containsInDDView(docViewId));
			//alert(keyInfo);
			if(containsInDDView(docViewId))
			{
				//alert('here');
				var el=e.srcElement?e.srcElement:e.target;	
				//alert(el.id);
				if(el.id)
				{
					if(el.id=='_pnlScrlDiv'||el.id=='_gridTableCell'||el.id.indexOf('_clrCell')>-1)
					{
						//alert(DragHandler._color);
						displayOnPanelGrid(assgnDiv,oElem,keyInfo,color);
						return false;
					}
				}
				//alert(assgnDiv);
				if(assgnDiv=='colorDiv')	
				{
					var img=getImageFromColorDiv(oElem);
					colorSecConds[colsqrno]=keyInfo;
					if(img!='')
					{
						if(colorDiv)
						{
						    ////since 2009R4 aug 30 fixpack Tracker#:12564
						    /// to fix the issue when user dragged color then image
						    /// color does not get refreshed
						    colorDiv.style.background="#ffffff";
							colorDiv.style.backgroundImage ="url("+img+")"; 
							colorDiv.style.backgroundRepeat='no-repeat';
							colorDiv.style.backgroundPosition='center';
							img='';
							////since 2009R4 aug 30 fixpack Tracker#:12564
                            _updateTargetContVal(colorDiv, keyInfo);
						}
					}
					else
					{
						if(colorDiv)
						{
							colorDiv.style.background=color;
							////since 2009R4 aug 30 fixpack Tracker#:12564
							_updateTargetContVal(colorDiv, keyInfo);
						}						
					}
					
				}else if(assgnDiv=='imageDiv')
				{
					colorSecConds[colsqrno]=keyInfo;
					//alert(image);
					if(colorDiv)
					{
						colorDiv.style.background='';
						colorDiv.style.backgroundImage ="url("+image+")"; 
						colorDiv.style.backgroundRepeat='no-repeat';
						colorDiv.style.backgroundPosition='center';
						////since 2009R4 aug 30 fixpack Tracker#:12564
						_updateTargetContVal(colorDiv, keyInfo);
						//Tracker #12730 -ADVANCED SEARCH: AFTER USING DRAG AND DROP, HITTING 'ENTER' KEY DOES NOT EXECUTE SEARCH
						//Invoking the mouseover for the div after drag and drop so that the focus is set on the search text box for further search.
						colorDiv.onmouseover();
					}
				}
				//Tracker#:- 20634  specific search: display search criteria after collapsing the search section & display search result 
				//Setting the focus on the drag and drop div so that the focus is set for enter key press event firing.
				if(colorDiv)
				{
					colorDiv.focus();
				}
			}
			else
			{
				if(entry==true)
				{
					elem=document.getElementById("divScr")||document.getElementById("_CtntDiv");
					entry=false;
					executeEvent();			
				}
			}
			
		}
};

////since 2009R4 aug 30 fixpack Tracker#:12564
//function to update the hidden variable with the
//dragged component keyinfo which will be used in teh
//techspec replace process
///its generic with teh hidden variable id starts with
///_hdn
function _updateTargetContVal(srcElmt, keyInfo)
{
    if(srcElmt && srcElmt.id)
    {
        var obj = getElemnt("_hdn"+srcElmt.id);
        //alert("hdn "+ obj);
        if(obj)
        {
            obj.value = keyInfo;
            //alert(obj.outerHTML);
            if(obj.onchange)
            {
               obj.onchange();
            }
        }
    }
}

/* This function checks whether the passed docview can be dropped to the area after dragging.
*/
function containsInDDView(view)
{
	for(var i=0;i<ddViews.length;i++)
	{
		if(ddViews[i]==view)
		{
			return true;
		}
	}
	return false;
}

	/*This function returns the image src from the passed element div
	*/
	function getImageFromColorDiv(elem)
	{
		var imgSrc='';
		var imge=elem.getElementsByTagName("IMG");
		var src='';
		for(var i=0;i<imge.length;i++)
		{
			src=imge[i].src;
		}
		if(src)
		{
			if(src.indexOf('imagestore'))
			{
				imgSrc=src.substring(src.indexOf('imagestore'),src.length);
			}
		}
		return imgSrc;
	}
	
	/*This function replaces the draggable image with thumbnail image.
	If extra anchors are there it will be removed 
	*/
	function createDragableImage(obj)
	{
		var imge=obj.getElementsByTagName("IMG");
		for(var i=0;i<imge.length;i++)
		{
			var src=imge[i].src;
			var sc=src.substring(src.lastIndexOf('/'),src.length);
			imge[i].src="imagestore/thumbnails"+sc;
		}
		var anchor=obj.getElementsByTagName("A");
		if(anchor)
		{
			for(var j=0;j<anchor.length;j++)
			{
				anchor[j].innerHTML='';
			}
		}
	}
	
	
	// Method to add item to the clipboard
    function executeEvent(cbNo,sec)
    {
		//alert("inside executeEvent:");
		var containedDivElements = srcElement.getElementsByTagName("input");		
		var keyValue="";
		//Tracker#:-17913  drag color to libraries gives js error as object required.
		//Null check added. 		
		var cbno=getElemnt("cbno")==null?null:getElemnt("cbno").value;
		if(!cbno) return;
		var sec=document.getElementById("sec").value;	
		
		var colHidden=getElemnt(cbColors);
		//alert(colHidden);
		if(colHidden){
			var colors=colHidden.value;
			var colorsSplit=colors.split(',');
			var len=colorsSplit.length;
			for(j=0;j<len;j++)
			{
				if(color==colorsSplit[j])
				{
					var htmlErrors = new htmlAjax().error();
					htmlErrors.addError("errorInfo", "This item already exists in the clipboard.",  true);
					messagingDiv(htmlErrors);
					return false;
				}
			}
		}
		addClipboardItem(sec,cbno,docId,docViewId,keyInfo);
	}
	
	// Setting boolean variable to true. 
	function setEntry(){
		//alert('inside set entry');
	    entry=true;
	}
	
	/*
	Function used to set the onColorSpot boolean variable to true.
	This will be called on mouse over of color square on the search section.
	Here the color square number, colsqrno is also set which is obtained from id.
	*/
	function ondragndropdiv(elem){
		//alert("inside oncolor");
		onDragnDropSpot=true;
		colorDiv=elem;
		colsqrno=colorDiv.id.substring(11,colorDiv.id.length);
	}
	/*
	Function used to set the onColorSpot boolean variable to false.
	This will be called on mouse out of color square on the search section  
	*/
	function offdragndropdiv(elem){
		onDragnDropSpot=false;
		colorDiv=null;
		colsqrno=-1;
	}
	
	
	
	
	/*
	Function used to assign the color hex value.
	This function is called on mouseover of colors inside the clipboard  
	*/
	function assignColor(col,asgnDiv){
		//alert(col);
		if(!drg)
		{
			color=col;
			assgnDiv=asgnDiv;
		}
		
	}
	
	function removeColor(){
		color='';
	}
	/*
	Function used to assign the image path.
	This function is called on mouseover of images inside the clipboard  
	*/
	function assignImage(img,asgnDiv){
		if(!drg)
		{
			image=img;
			assgnDiv=asgnDiv;
		}
	}
	
	function removeImage(img){
		image='';
	}
	
	
	function onheaderbar()
	{
		document.onmousemove = null;
		dragable=true;
		evnt='_drag_only';
	}
	function offheaderbar()
	{
		dragable=false;
	}
	

	function setEntryIfDroppable(srcElem,elem)
	{
		if(srcElem)
		{
			//alert(srcElem);
			//alert(srcElem.id);
			if(srcElem.id=='divScr')
			{
				setEntry();
			}else
			{
				//alert('inside else');
				//alert('elem.id'+elem.id);
				if(srcElem.id.indexOf('_color_div_')>-1 && (assgnDiv=='imageDiv'||assgnDiv=='colorDiv'))
				{
					onDragnDropSpot=false;
					ondragndropdiv(srcElem);
				}	
				if(srcElem.parentElement)
					setEntryIfDroppable(srcElem.parentElement,elem)
			}
		}
	}
