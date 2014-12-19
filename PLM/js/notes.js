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
/* -------------------------- Notes Box Component Class -------------------------------
 * This class provides API for notes display 
 * 
 * @since 2009R2 
 */
 function NotesBox(_queryField, _notesAreaHiddenFieldName)
 {
 	 //Tracker#:20816 Notes icon image constants.
 	 this.IMG_PATH_DATA = "images/red_notes.gif";
 	 this.IMG_PATH_NODATA = "images/notes.gif"; 	 
 	 this.IMG_ID_PREFIX = "_img"; 
 	 
     var queryField = _queryField;
     var notesAreaHiddenFieldName = null;
     var objDraggable = null;
     
     
	 this.closeNotes = closeNotes;
	 this.updateNoteData = updateNoteData;
	 this.buildNotesDiv = buildNotesDiv;
	 
	 
	 
	 this.notesAreaHiddenFieldName = _notesAreaHiddenFieldName;	 
	 this.buildNotesDiv();

 	 function resetDataDiv()
	 {
	    var divObj = document.getElementById('notesDataDiv');
	 	if (divObj)
	 	{
	 		divObj.innerHTML = "";
	 		divObj.parentNode.removeChild(divObj);
	 	}
	 }

	 function buildNotesDiv()
	 {
	    resetDataDiv();//Remove previous instances
		var noteDivObj = document.createElement('div');
		noteDivObj.id = 'notesDataDiv';
	    
	    noteDivObj.style.overflow = "hidden";
		noteDivObj.style.position = "absolute";
        noteDivObj.style.visibility = "visible";
	    document.body.appendChild(noteDivObj);
		var objNotesAreaHiddenField = document.getElementById(this.notesAreaHiddenFieldName);  
		var isReadOnly = objNotesAreaHiddenField.getAttribute("readOnly");
		
		var notesHTML =NOTESTEMPLATE.replace('$SERVER_MESSAGE$', objNotesAreaHiddenField.value);
		//Tracker#20816 : To display the save and Ok button on notes icon popup for the FitEval and POM screens.
		var docviewId = Notes.getScreenDocviewID();
		//alert("docviewId " + docviewId + "\n isReadOnly = " + isReadOnly);
		//Tracker#: 22581 HTM NOTES ASSOCIATION SHOULD BE GREY (READ ONLY) FOR INACTIVE FIT SAMPLES
		// for non editable don't show the save button template.
		//Tracker#:24279 - Added docviewId 14003 in if condition.
		if(!isReadOnly && docviewId != null && (docviewId ==12701 || docviewId ==2406 || docviewId ==2408 || docviewId ==2409 || docviewId ==14000 || docviewId ==14001 || docviewId ==14003 || docviewId ==171 || docviewId ==186 || docviewId ==196))
		{
			notesHTML =NOTESTEMPLATEPOMFIT.replace('$SERVER_MESSAGE$', objNotesAreaHiddenField.value);
		}
		
		// Tracker#: 14992 FIT EVAL ENHANCEMENT FOR SIZE SETS CONTINUED FROM 14225
        // Now the height/rows and width/cols for the text Area will be set
        // based on the MaxLength and Displaylength/size.
        var maxLength = objNotesAreaHiddenField.getAttribute("maxlength");
        var size = objNotesAreaHiddenField.getAttribute("size");
        // Minimum of cols is set to 20 as earlier(LayoutHTML.java) for the text area.
        size = ((size == null || size == "") ? 20 : size);
        if(size < 20) size = 20;
        // Minimum of rows is set to 6.
        var rows = ((maxLength == null || maxLength == "" ) ?
                                    "6" :
                                        parseInt(maxLength) / parseInt(size));

        if(rows > 0) rows = rows + 1;
        // Limit the rows to be max of 10 not more.
        if(rows > 10) rows = 10;
        // Replace the template COlS text with the values set in Composite Builder.
        notesHTML =notesHTML.replace('$COLS$', size);
        notesHTML =notesHTML.replace('$ROWS$', rows);
    	noteDivObj.innerHTML=notesHTML;
    	//Tracker#20816 : Changed the id name 'notesArea' to 'notesTb' 
    	//so as to consider the new "Save" button added at the bottom of the popup screen
    	var objNotesArea = document.getElementById("notesTb");
		objNotesArea.value = objNotesAreaHiddenField.value;	
		
		var actualNotesArea = document.getElementById("notesArea");
		
		/////Tracker#: 13116 PROBLEM WITH VALIDATION FILTER CONDITION SETTING
		////////if the control is readonly make the textarea readonly
		///background color to brown to make it readonly
		if(isReadOnly)
		{
		    objNotesArea.style.readOnly="readonly";
		    setAttribute(objNotesArea, "readOnly", "readonly");
		    setAttribute(objNotesArea, "className", "clsNotesTextReadOnly");
		    //Tracker#: 22581 HTM NOTES ASSOCIATION SHOULD BE GREY (READ ONLY) FOR INACTIVE FIT SAMPLES
		    //set the notes text area to grey out if in case of displaying as non editable i.e readonly
		    actualNotesArea.style.readOnly="readonly";
		    setAttribute(actualNotesArea, "readOnly", "readonly");
		    setAttribute(actualNotesArea, "className", "clsNotesTextReadOnly");
		    
		}
		//Tracker#: 15882 COMMENTS FIELD ON FIT EVAL ALLOWS OVER 250 AND THROWS UNFRIENDLY DATABASE ERROR MESSAGE
		//Added an attribute to get the hidden field id
		setAttribute(objNotesArea, "hiddenFld", objNotesAreaHiddenField.id);
		// Take care of the scroll bar.
		//Tracker#20816 : set notesDiv with to actual text area width since the objNotesArea is changed.
		
        noteDivObj.style.width = actualNotesArea.offsetWidth + nScrlbar+"px";
	    // noteDivObj.style.width = "223px";
		// noteDivObj.style.height = "200px";//note: overriden by text area rows

		positionNotes(noteDivObj);



        $(noteDivObj).draggable();
		$("#notesArea").resizable ({
			resize: function(event, ui) { document.getElementById("notesDataDiv").style.width = document.getElementById("notesArea").offsetWidth + notesTextareaDiff + "px"; }}); 
			
		// to hold the width difference between out div and notes area which is used to keep both in sync during expansion
        var notesTextareaDiff = document.getElementById("notesDataDiv").offsetWidth-document.getElementById("notesArea").offsetWidth;

		// Tracker#: 18575 - IE 6 - BLEED THRU ISSUE WITH NOTES ASSOCIATION ON MATERIAL QUOTE
		// When notes div is focused, the document is scrolled to show the entire notes div if it
		// is outside of the browser's viewable area.  This causes the calculated position of
		// the select inputs to be higher up then it normally would be (relative to notes div).
		// Focusing notes div after handling drop downs.
		if (objNotesArea) objNotesArea.focus();
	 }
	 
	 /** Tracker#: 21149 - POM & FIT EVAL- TITLE FREEZE DOES NOT WORK WHEN WE OPEN NOTES POP-UP FOR THE BOTTOM ROWS
	  * Issue - The case when notes box is positioned beyond bottom of browser viewport is not taken into account.
	  * Fix - Move notes box up if outside bottom and move it left if outside right.
	  */
	 function positionNotes (noteDivObj)
	 {
        //Set left, top. If it crosses the out of focus then position it properly
		 
	 	 var $queryField = $(queryField),
	 	 	fieldOffset = $queryField.offset(),
	 	 	newTop = fieldOffset.top + queryField.offsetHeight + 1,
	 	 	newLeft = fieldOffset.left,
	 	 	offScreenLeft = amountOffScreen('right', fieldOffset, $queryField, noteDivObj, newLeft),
	 	 	offScreenBottom = amountOffScreen('bottom', fieldOffset, $queryField, noteDivObj, newTop);

        noteDivObj.style.top = newTop - offScreenBottom + "px";
        noteDivObj.style.left = newLeft - offScreenLeft + "px";
	 }
	 
	 /** Tracker#: 21149 - POM & FIT EVAL- TITLE FREEZE DOES NOT WORK WHEN WE OPEN NOTES POP-UP FOR THE BOTTOM ROWS
	  * @returns - returns amount of the notes div is outside of either bottom or right of screen.
	  * If the div is not outside the side of the screen being checked (e.g. side="bottom", or side="right"),
	  * returns zero.
	  */
	 function amountOffScreen (side, fieldOffset, $queryField, noteDivObj, newPosition)
	 {
        /* Tracker#: 20540 - SAFARI & FIREFOX: FIT EVAL SCREEN- NOTES POP-UP OPENS UP 1 SCREEN DOWN
         * Issue - divs with scrollTop & scrollLeft > 0 were not being including in calculation.
         * Fix - Use jQuery method to calculate offset of field.
         */
		 var overFlow,
		 	 windowDimension,
		 	 notesDimension,
		 	 $noteDiv = $(noteDivObj);
		 
		 switch (side)
		 {
		 	case 'right' :
		 		windowDimension = document.body.clientWidth;
		 		notesDimension = $noteDiv.width();
		 		break;
		 		
		 	case 'bottom' :
		 		windowDimension = document.body.clientHeight;
		 		notesDimension = $noteDiv.height();
		 		break;
		 }
		 
 		overFlow = newPosition + notesDimension - windowDimension;
 		overFlow = (overFlow > 0) ? overFlow : 0;
		 
		return overFlow;
	 }

    function handleUpdatedNotes(objAjax)
    {
		this.buildNotesDiv(objAjax.getHTMLResult());
    }

	function closeNotes()
	{
		this.updateNoteData();
		_closeNotesDataDiv();
	 	if (objDraggable) objDraggable.draggable("destroy");
	}
	
	//Tracker#20816 
	//Updates the change field data for the notes icon, called on click of ok, save andc close of the notes up.
	function updateNoteData()
	{
		var objNotesArea = document.getElementById("notesArea");
		var objNotesAreaHiddenField = document.getElementById(this.notesAreaHiddenFieldName);

		var htmlAreaObj = _getWorkAreaDefaultObj();	   	
		var objHTMLData = htmlAreaObj.getHTMLDataObj();		
		
		//Tracker #: 19491 CAPACITY - GETTING MSG TO SAVE CHANGES WHERE NO CHANGES MADE FOR NOTES
		//if notesArea and hidden Notes field values are different then only call the onchange of hidden notes field.
		//if (objNotesArea && objNotesAreaHiddenField && objNotesArea.value != objNotesAreaHiddenField.value)
		if ( (objNotesArea && objNotesAreaHiddenField && objNotesArea.value != objNotesAreaHiddenField.value) 
				|| (objNotesAreaHiddenField && objHTMLData.isFieldModified(objNotesAreaHiddenField.id)))	
		{
			objNotesAreaHiddenField.value = objNotesArea.value;
			if (objNotesAreaHiddenField && objNotesAreaHiddenField.onchange)
			{
			    objNotesAreaHiddenField.onchange();
			    return true;
			}
		}
		
		return false;
	}
	
}

//Tracker#:13535 close notes popup if opened while navigating to different screen.
//created separate fuction so as to call from loadWorkArea() and _reloadArea() to close the notesDataDiv.
function _closeNotesDataDiv()
{
    var notesDivObj = document.getElementById("notesDataDiv");
    if(notesDivObj)
    {
        notesDivObj.style.visibility="hidden";
        notesDivObj.style.display = "none";
        notesDivObj.innerHTML = "";
        notesDivObj.parentNode.removeChild(notesDivObj);
    }
}

//Global variables, methods
var notesBox;  
function showNotes(queryFieldName, notesAreaHiddenFieldName)
{
	notesBox = new NotesBox(document.getElementById(queryFieldName), notesAreaHiddenFieldName);
}

function closeNotes()
{
	if (notesBox) notesBox.closeNotes();
}

//Tracker#:20816 FDD 536 - IMPLEMENTING THE GENERIC CHANGES REQUIRED FOR THE FR4.
//Defining the notes functions within the namespace "Notes"
var Notes = {
	//Tracker#:20816
	//Called from save button on notes popup.
	saveNotes: function ()
	{	
		if (!notesBox) 
		{
			return false;
		}
		
		if(notesBox.updateNoteData())
		{
			var docviewId = Notes.getScreenDocviewID();
			//alert(docviewId);
			if(docviewId != null && docviewId ==12701)
			{
				_verifylinkedfieldsModified("plmpomworksheet.do", Notes.continue_NotesSave);
			}
			else
			{
				Notes.continue_NotesSave();
			}
		}
		else
		{
			alert(szMsg_No_change);
		}
	},

	//Tracker#:20816 
	//function for notes save ajax call
	continue_NotesSave : function (objAjax)
	{	
		var htmlAreaObj = _getWorkAreaDefaultObj();
		var docviewId = Notes.getScreenDocviewID();
		/**
		 * Tracker#:22340 NOTES ASSOCIATION ON MW POM & FIT NOT SAME AS BASE POM & FIT IN 2012
		 * Save button for Notes popup was not there in Multi Windows of POM and Fit Evaluation screens,
		 * added docviewId check and provided Save button and Save functionality.  
		 * 
		 */
		if(docviewId==186)
		{
			htmlAreaObj = _getAreaObjByDocView('2411');
		}
		else if(docviewId==171)
		{
			htmlAreaObj = _getAreaObjByDocView('12702');
		}
	   	var objAjax = htmlAreaObj.getHTMLAjax();
		var objHTMLData = htmlAreaObj.getHTMLDataObj();
		var objNotesAreaHiddenField = document.getElementById(notesBox.notesAreaHiddenFieldName);	
		bShowMsg=true;	
	 	objAjax.parameter().add(_screenChangeFileds, objNotesAreaHiddenField.id);
	 	objHTMLData.appendChangeFieldsCtrlInfoToRequest(objAjax, objNotesAreaHiddenField.id);
	 	//alert("send rquest" + objAjax._getURL());
	 	objAjax.setProcessHandler(Notes.completeNotesSave);
	    objAjax.sendRequest(); 
	    
	    if(objAjax.isProcessComplete())
	    {
	    	//alert("remove");
	        objHTMLData.removeFromChangedFields(objNotesAreaHiddenField);
	        
	        var objNotesArea = document.getElementById("notesArea");
	        
	        if(objNotesArea && objNotesAreaHiddenField)
	        {
	        	objNotesArea.value = objNotesAreaHiddenField.value; 
	        }
	        //Resets the notes icon(image) based on the current data.
	        Notes.notifyNotesImage(objNotesAreaHiddenField);
	    }
	},
	
	//Tracker#:20816 
	//Call back function for notes save ajax call
	completeNotesSave : function (objAjax)
	{
		//alert("show mesage"+bShowMsg);
	    if(objAjax)
	    {
	    	if(bShowMsg==true)
	    	{
	    		msgInfo = objAjax.getAllProcessMessages();
	
	    		//alert("msgInfo"+msgInfo);
			    if(msgInfo!="")
			    {		       
			        _displayProcessMessage(objAjax);
			    }
	    	}
	    	
	        bShowMsg= false;
	    }
	},	
	
	//Tracker#:20816 Get Screen doc view id.
	getScreenDocviewID : function ()
	{
		var htmlAreaObj = _getWorkAreaDefaultObj();
		if(htmlAreaObj) return htmlAreaObj.getDocViewId();
		return null;	
	},
	
	//Tracker#: 15882 COMMENTS FIELD ON FIT EVAL ALLOWS OVER 250 AND THROWS UNFRIENDLY DATABASE ERROR MESSAGE
	//Function to check if the max size of the given notes field is reached
	checkNotesDataLength : function (notesBox)
	{
		//alert("notesBox"+$('#notesTb').attr('hiddenFld'));
		var hiddenFld = notesBox.getAttribute("hiddenFld");
		//Tracker#:24339 - Warning message not displaying when maximum length of the field exceeds.
		if(!hiddenFld)
		{
			//alert("inside");
			hiddenFld = $('#notesTb').attr('hiddenFld');
		}
		
		var objNotesAreaHiddenField = document.getElementById(hiddenFld);
		
		if(objNotesAreaHiddenField)
		{
			var maxLength = objNotesAreaHiddenField.getAttribute("maxlength");
			notestextareaCtrl(notesBox, maxLength, hiddenFld);
		}
	},
	
	//Taacker#:20816 Resets the notes icon(pink/blue images) based on the 
	//notes data availabilty to indicate notes data exist or not. 
	notifyNotesImage : function (objNotesAreaHiddenField)
	{
		//alert("notifyNotesImage called " + objNotesAreaHiddenField);
		if(objNotesAreaHiddenField)
		{
			//alert("IMG_ID_PREFIX + objNotesAreaHiddenField.id " + notesBox.IMG_ID_PREFIX + objNotesAreaHiddenField.id);
			var objImg = document.getElementById(notesBox.IMG_ID_PREFIX + objNotesAreaHiddenField.id);
			
			//alert("objImg " + objImg)
			if(objImg && objNotesAreaHiddenField.value.length>0)
			{
				//alert("here data");
				objImg.setAttribute("defaultValue",notesBox.IMG_PATH_DATA);
				objImg.setAttribute("src",objImg.src.replace(notesBox.IMG_PATH_NODATA, notesBox.IMG_PATH_DATA));
			}
			else if(objImg)
			{
				//alert("here without data");
				objImg.setAttribute("defaultValue",notesBox.IMG_PATH_NODATA);				
				objImg.setAttribute("src",objImg.src.replace(notesBox.IMG_PATH_DATA, notesBox.IMG_PATH_NODATA));
			}
		}
	}
};


// Tracker#: 14992 FIT EVAL ENHANCEMENT FOR SIZE SETS CONTINUED FROM 14225
// Modified the template to take care of Cols and Rows being set dynamically
//Tracker#: 15882 COMMENTS FIELD ON FIT EVAL ALLOWS OVER 250 AND THROWS UNFRIENDLY DATABASE ERROR MESSAGE
//Added a call to the function checkNotesDataLength for the text area
//Tracker#:20816 FDD 536 - IMPLEMENTING THE GENERIC CHANGES REQUIRED FOR THE FR4.
//Changed the table Id to 'notesTb', as the previous id conflicts message div.
 var NOTESTEMPLATE = '\
<TABLE class=clsmsgTable id="notesTb">\
<TBODY>\
<TR>\
<TD class=clsNameDivHeaderYellowMiddle>\
<TABLE class=clsmsgTable id=_headerRow>\
<TBODY>\
<TR>\
<TD class=clsMsgText><P>Notes</P></TD>\
<TD><IMG id=_closeMsg height=11 src="images/exit_mouseover.gif" onmouseover="this.style.cursor=\'pointer\'" onclick="closeNotes()" width=11 align=right></TD></TR></TBODY></TABLE></TD>\
</TR>\
<TR>\
<TD class=clsNameDivBodyYellowMiddle><TABLE width="100%"><TR><TD><textarea rows=$ROWS$ cols=$COLS$ ID="notesArea" onKeyup="Notes.checkNotesDataLength(this);" onKeydown="Notes.checkNotesDataLength(this);">$SERVER_MESSAGE$</textarea></TD></TR></TABLE></TD>\
<TD></TD></TR>\
</TBODY></TABLE>';

//Tracker#:20816 FDD 536 - IMPLEMENTING THE GENERIC CHANGES REQUIRED FOR THE FR4.
//Added Save botton on the notes popup. And changed the table Id to 'notesTb',
//as the previous id conflicts message div.
 var NOTESTEMPLATEPOMFIT = '\
<TABLE class=clsmsgTable id="notesTb" >\
<TBODY>\
<TR>\
<TD class=clsNameDivHeaderYellowMiddle>\
<TABLE class=clsmsgTable id=_headerRow>\
<TBODY>\
<TR>\
<TD width="80%" class=clsMsgText><P>Notes</P></TD>\
<TD><IMG id=_closeMsg height=11 src="images/exit_mouseover.gif" onmouseover="this.style.cursor=\'pointer\'" onclick="closeNotes()" width=11 align=right></TD></TR></TBODY></TABLE></TD>\
</TR>\
<TR>\
<TD class=clsNameDivBodyYellowMiddle><TABLE width="100%"><TR><TD><textarea rows=$ROWS$ cols=$COLS$ ID="notesArea" onKeyup="Notes.checkNotesDataLength(this);">$SERVER_MESSAGE$</textarea></TD></TR>\
<TR><td align="center"><table border="0" cellspacing="0" cellpadding="0"><tr ><td class="clsLeftcornerButton" id="NotesbtnLft" noWrap="nowrap" name="NotesbtnLft">\
</td><td align="center" class="clsCenterButton" id="NotesbtnCtr" noWrap="nowrap" vAlign="top" onmouseover="_setButtonStyle(this,\'mouseOver\',\'Notes\');" onmouseout="_setButtonStyle(this,\'mouseOut\',\'Notes\');" onclick="Notes.saveNotes()" name="NotesbtnCtr">\
<label title="Save" class="clsTextLabelNormalVTop" style="cursor: pointer;" onmouseover="_setHandMousePointer(this);" onmouseout="_clearMousePointer(this);">   Save\
</td><td class="clsRightButton" id="NotesbtnRt" noWrap="nowrap" name="NotesbtnRt"></td></table></td></TR>\</TABLE></TD>\
<TD></TD></TR>\
</TBODY></TABLE>';
