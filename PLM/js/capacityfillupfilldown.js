/*************************************/
/*  Copyright  (C)  2002 - 2011      */
/*           by                      */
/*  TradeStone Software, Inc.        */
/*  Gloucester, MA. 01930            */
/*  All Rights Reserved              */
/*  Printed in U.S.A.                */
/*  Confidential, Unpublished        */
/*  Property of                      */
/*  TradeStone Software, Inc.        */
/*************************************/

// Tracker 19616-CAPACITY SCREEN - VALUES IN BLUE BAR ARE NOT POPULATING.
// Capacity screen spcific fill up ,fill down and fill selected link functionality.

//To store the objects affected by fill up ,fill down and fill selected.
var fillupfilldownObjs = [];
var fillCapacity = false;

//function _fill
//action-fillup/filldown
function _fillCapacity(divId, action, colpseDivId, idsuffix, rowNo)
{
	var divObjCol = getElemnt(colpseDivId);
	//alert(divObjCol);
	var divObj = getElemnt(divId);
	var prcesss = false;
	var obj = _getCurObj();
	//Tracker#: 19864 FILL DOWN ON CAPACITY DOES NOT WORK FOR RELEASE DATE AND OPEN
	//call "_fill()" method for non calculating fields else  "_fillProcessCapacity()" method will be called.
	if(!fillCapacity )
		{
			_fill(divId, action, colpseDivId);
			return;
		}
	//alert(obj.outerHTML);
	if(divObj)
	{
		prcesss = _isValidFillCtrl(divObj, obj);
	}   
	
	if(!prcesss)
	{
		//Display warning message.
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
	fillupfilldownObjs = [];
	if(action=='fillselected')
	{
		_fillProcessCapacity('fillup', obj, filVal, isFldDesc, filValCode, true);
		_fillProcessCapacity('filldown', obj, filVal, isFldDesc, filValCode, true);
	}	
	else
	{	
		_fillProcessCapacity(action, obj, filVal, isFldDesc, filValCode);
	}
	
	if(fillupfilldownObjs.length > 0) 
	{
		callObjOnchange();
	}
	
	if(divObjCol && divObjCol.onclick)
	{
		//alert(divObjCol.onclick);
		divObjCol.onclick();
	}
}

//function to call the onchange event of an element when fill up, fill down, and fill selected link clicked.
function callObjOnchange()
{
	var calingObj = fillupfilldownObjs.pop();
	if(calingObj.onchange)
	{
		calingObj.onchange();
	}
}

function _fillProcessCapacity(action, obj, filVal, isFldDesc, filValCode, chkSelected)
{
	var npSblTr;
	var setChgVal = true;
	
	while(obj)
	{
		continueFireEvents = true;
		//alert("obj :"+continueFireEvents);
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
					
					if(obj && (setChgVal==true))
					{
						_setObjValInkChgCapacity(obj, filVal);
						
						if(isFldDesc==true)
						{
							//get the code object
							var objcd = _getDescCodeField(obj);
							_setObjValInkChgCapacity(objcd, filValCode);										
						}
						
					}
					//alert(obj.outerHTML);				
				}
			}
		}
	}
}


function _setObjValInkChgCapacity(obj, newvalue)
{
	//Tracker#: 20023 CAPACITY - READ ONLY FIELDS EDITABLE BY FILL DOWN/UP OPTIONS
	//Added the condition to check the readonly field.
	if(obj && !obj.readOnly)
	{
		obj.value = newvalue;
		if(obj.onchange)
		{
			fillupfilldownObjs.push(obj);
		}
		if(obj.onfocus)
		{
			obj.onfocus();
		}
	}
}


