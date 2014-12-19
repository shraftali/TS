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

// Tracker 13085-SUBMITS CREATION - FILL DOWN, FILL UP, FILL SELECTED.
// 

//function _fill
//action-fillup/filldown
function _fill(divId, action, colpseDivId)
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
	
	if(!prcesss)
	{
		//Tracker#16120 TSR 516 F5 ADD SMART TAG TO ITEM NO, F7 & F10  IMPLEMENT FILLUP FILLDOWN
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
	
	if(action=='fillselected')
	{
		_fillProcess('fillup', obj, filVal, isFldDesc, filValCode, true, true, null);
		_fillProcess('filldown', obj, filVal, isFldDesc, filValCode, true, true, null);
	}	
	else
	{	
		_fillProcess(action, obj, filVal, isFldDesc, filValCode, false, true, null);
	} 
	
	if(divObjCol && divObjCol.onclick)
	{
		divObjCol.onclick();
	}
}

/**
 * Tracker#:22877 FDD 562 BOMC FILLUP FILLDOWN FILLACROSS
 * passed customObj, to handle custom specific functionality on 
 * FillUp FillDown functionality, ex: BOMC screen precedence fields 
 * 
 * 
 * @param action
 * @param obj
 * @param filVal
 * @param isFldDesc
 * @param filValCode
 * @param chkSelected
 * @param chkReadonly
 * @param customObj
 * @returns
 */
function _fillProcess(action, obj, filVal, isFldDesc, filValCode, 
		chkSelected, chkReadonly, customObj)
{
	var npSblTr;
	var setChgVal = true;
	var parentObj = obj;
	var objindex;
	//Tracker#: 24529 FILL DOWN ON ORDER DETAIL TAB SHOULD ONLY FILL TO EXISTING ROWS
	var isObjValid = _checkIsObjValid(obj);
	
	while(obj && isObjValid)
	{
		setChgVal = true;
		var td = _findParentObjByTagName(obj, 'td');
		var tr = _findParentObjByTagName(obj, 'tr');
		//alert("td " + td + "\n tr = "+ tr);
		if(tr && td)
		{	
			var chldInd = _findChldIndex(obj, td);
			objindex = chldInd;
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
					isObjValid = _checkIsObjValid(obj);
					if(!isObjValid)
					{
						return;
					}
					if(obj && (setChgVal==true))
					{							
					
						/**
						 * Tracker#:22877 fdd 562 bomc fillup filldown fillacross
						 * check if it is custom fillup filldown.
						 */
						if(customObj && typeof(customObj.setCustomData)=="function")
						{
							var rowNo = _getRowNoFromCompName(obj.id);
							//alert(rowNo);
							// check the field is in blank row or not, don't fill blank rows.
							if(_isNotNull(rowNo) && rowNo!="-1")
							{
								if(isFldDesc==true)
								{
									//get the code object
									var objcd = _getDescCodeField(obj);
									_setObjValInkChg(objcd, filValCode, chkReadonly);										
								}	
								//Tracker#20217
								//Set for code field onchange first then description field.
								_setObjValInkChg(obj, filVal, chkReadonly);
								
								customObj.setCustomData(obj, setChgVal, isFldDesc, filVal, filValCode, parentObj);
							}	
						}
						else
						{
							if(isFldDesc==true)
							{
								//get the code object
								var objcd = _getDescCodeField(obj);
								_setObjValInkChg(objcd, filValCode, chkReadonly);										
							}	
							//Tracker#20217
							//Set for code field onchange first then description field.
							_setObjValInkChg(obj, filVal, chkReadonly);		
						}
					}
					//alert(obj.outerHTML);				
				}
			}
		}	
	}
	
	return objindex;
}

function _checkChkBoxSelected(tr)
{
	var ischkboxSel = false;
	var objChk = _getTRCheckBox(tr);
	
	if(!objChk)
	{
		///alert("not found, has slider");
		var obj = tr;
		var tbl;
		//if not found if slider is defined
		while(obj)
		{
			//alert(obj.tagName);
			if(obj.tagName.toUpperCase()!="TABLE")
			{
				obj = obj.parentNode;
			}
			else
			{
				tbl = obj;
				obj = null;			
			}
		}
		
		if(tbl && tbl.id && tbl.id.indexOf("_right_table")!=-1)
		{
			//alert(tbl.id.replace("_right_table", "_left_table"));
			var tblLft = getElemnt(tbl.id.replace("_right_table", "_left_table"));
			if(tblLft)
			{
				//alert("lft table found");
				tr = tblLft.getElementsByTagName("TR")[tr.rowIndex];
				//alert(" left tr found " + tr);
				objChk = _getTRCheckBox(tr);
			}
		}
	}
	
	//alert(" objChk "+ objChk);
	
	if(objChk)
	{
		//alert("objChk.checked " + objChk.outerHTML);
		ischkboxSel = objChk.checked;
	}
	
	return ischkboxSel;	
}



function _isValidFillCtrl(divObj, obj)
{
	while(obj)
    {
       // alert("obj id-> "+ getCustomAttribute(obj,"id"));
       // alert("divObj.id -> "+ divObj.id +"\n "+ obj.outerHTML);
        if(obj.id==divObj.id) 
        {
           return true;
        }
        else
        {
            obj = obj.parentNode;
        }
    }
    return false;
}

function _findParentObjByTagName(element, tagName)
{
    var node = element;

    while (node.parentNode)
    {
        node = node.parentNode;

        if (node.nodeName.toLowerCase() == tagName)
        {
            return node;
        }
    }
    return null;
}
//Checks for not null and undefined
function _isNotNull(obj)
{
    return (typeof obj != 'undefined' && obj != 'null' && obj != null);
}

function _findNextSiblingObj(element, tagName, tdElement)
{
    var nextSiblingElement;
    var nextSibling;

    while (nextSibling = element.nextSibling)
    {
    	//alert(" nextSibling.nodeType " + nextSibling.nodeType +"\n nextSibling " + nextSibling.toHTML);
        if (nextSibling.nodeType == 1 && nextSibling.tagName.toLowerCase() == tagName)
        {
        	//alert("found next sibling");
            nextSiblingElement = nextSibling;            
            //Jump if rows skipped while display
            if (_isNotNull(nextSiblingElement.cells[tdElement.cellIndex] ))
            {
                 break;
            }
        }
        element = nextSibling;
    }
    return nextSiblingElement;
}


function _findPreviousSiblingObj(element, tagName, tdElement)
{
    var previousSiblingElement;
    var previousSibling;

    while (previousSibling = element.previousSibling)
    {
    	//alert(" previousSibling.nodeType " + previousSibling.nodeType +"\n previousSibling " + previousSibling.toHTML);
        if (previousSibling.nodeType == 1 && previousSibling.tagName.toLowerCase() == tagName)
        {
        	//alert("found previous sibling");
            previousSiblingElement = previousSibling;            
            //Jump if rows skipped while display
            if (_isNotNull(previousSiblingElement.cells[tdElement.cellIndex] ))
            {
                 break;
            }
        }
        element = previousSibling;
    }
    return previousSiblingElement;
}

function _findChldIndex(obj, objParent)
{
	var ind=-1;
	
	if(obj && objParent)
	{
		var len = objParent.childNodes.length;
		
		for (var i = 0; i < len; i++)
        {
            if (objParent.childNodes[i].id && (objParent.childNodes[i].id == obj.id))
            {
                ind=i;
                break;
            }
        }		
	}	
	return ind;
}

function _findChldObjByInd(objParent, ind)
{	
	var obj;	
	if(objParent)
	{
		var len = objParent.childNodes.length;
		
		if(len && len>ind)
		{
			obj = objParent.childNodes[ind];
		}		
	}	
	return obj;
}


function _setObjValInkChg(obj, newvalue, chkReadonly)
{
	//Tracker#: 20023 CAPACITY - READ ONLY FIELDS EDITABLE BY FILL DOWN/UP OPTIONS
	//Added the condition to check the readonly field.
		
	if(obj)
	{
		if(!chkReadonly || (chkReadonly && !obj.readOnly))
		{
			obj.value = newvalue;
			if(obj.onchange)
			{
				obj.onchange();
			}
			if(obj.onfocus)
			{
				obj.onfocus();
			}
		}
	}
}


function _checkIsObjValid(obj)
{
	//Tracker#: 24529 FILL DOWN ON ORDER DETAIL TAB SHOULD ONLY FILL TO EXISTING ROWS
	
	var doc_id = _getDocIdFromCompName(obj.name);
	//Purchase Order: 300, Sales Order: 9200
	if(doc_id=="300" || doc_id=="9200" || doc_id=="6300")
	{
		if ($(obj).attr('keyinfo')) {
		    return true;
		}
	}
	else
	{
		return true;
	}
	return false;
}
