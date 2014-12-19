 /*************************************/
/*  Copyright  (C)  2002 - 2008      */
/*           by                      */
/*  TradeStone Software, Inc.        */
/*  Gloucester, MA. 01930            */
/*  All Rights Reserved              */
/*  Printed in U.S.A.                */
/*  Confidential, Unpublished        */
/*  Property of                      */
/*  TradeStone Software, Inc.        */
/*************************************/

 
 function isSelectedValueValid(obj)
 {
	if (obj.options[0].selected & obj.options[0].value == '')
    {
        return Boolean (false);
    }
	return Boolean (true);
 }

 function isQuerySelected(obj)
 {
    if(!isSelectedValueValid(obj))
    {
        alert(szMsgSelectQuery );
        return Boolean (false);
    }
	return Boolean (true);
 }
 
 function hideResult()
 {
    hide('second');
 }
 
 //Bypass the _desc field (for:v2009R1)
 function cfbyname(fldname)
 {  	    
	// no need to consider the description field
    if (fldname.indexOf('_desc') != -1) 
    {
    	return;
    } 
        
    var chgHolder = getval('chgflds');
    	    
    if (chgHolder.indexOf(fldname + ',') == -1) // if it does not exist
                chgHolder = chgHolder.concat(fldname,',');
    // changed the changed fields values
    setval('chgflds', chgHolder);
 }
	
 function fsubmitquery(act)
 {  
    if(act == 'new')
    {
        alert (szMsgFeatureNotSupported);
        return;
    }
    
   var submitSearch = false;
   
   if(act == 'refresh')
   {
    
      if (hasreqdfilter())
      {  
          if(chkreqd() == false)
          { 
             return;
          }
      }
      //Tracker#23139 - setting change field values to empty
      setval('chgflds','');
   }

   if(act == 'showall')
   {  
      if (hasreqdfilter())
      {  
          if(chkreqd() == false)
          { 
             return;
          }
          else
          { 
             act='search';
             submitSearch = true;             
          }
      }
    else
      {
       setval('chgflds','');
      }
    }
    
    if((act == 'search'))
    {     
       if(hasreqdfilter())
       {  
           if(chkreqd()==false)
           { 
              return false;
           }           
       }
       
       
       // added newly - To retain search fields after error message. 
       var searchChgflds = removeFieldsForThisAction(true);
       setval('chgflds', searchChgflds);
     
      var val = getval('chgflds');
         
       if(val == '')
        {
			alert (szMsgNoFilter);
            return false;
        }        

        setval('method', act);
        waitWindow();      
        		
        //if(!submitSearch)
       // return true;        
   }
    setval('method', act);
    waitWindow();
    eval('document.'+FRM+'.submit()');
    return true;
 }
 
 function hasreqdfilter()
 {
    if ( typeof(reqdFields) == 'undefined' || typeof(reqdMsg) == 'undefined') return false;
    if(reqdFields.length > 0)
      return true;
    return false;
 }
	
 function chkreqd()
 {
   //if((document.QueryViewerForm.searched.value == 'false') )
  // {
      return chkreqdfilter();
   //}
   //else
   //{
      return true;
   //}
 }
 
 //overridden comfunc method to give appropriate message in queryviewer.
 function chkreqdfilter()
 {
	 if ( typeof(reqdFields) == 'undefined' || typeof(reqdMsg) == 'undefined') return true;
	
	 var blank = false;
	 var i = 0;
	
	 for (i=0; i < reqdFields.length; i++)
	 {
	     var val = eval('document.' + FRM + '.' + reqdFields[i] + '.value');
	     if ( val == "" ) {
	         blank = true;
	         break;
	     }
	 }

     if (blank)
     {
        alert(szMsgFilterFields + reqdMsg.join(","));
        eval('document.' + FRM + '.' + reqdFields[i] + '.focus()');
        return false;
     }

     return true;
 }

 function removeFieldsForThisAction(search)
 {
    var obj = getobj('chgflds');

	if (obj)
	{
        var chgfld = obj.value.split(',');
        var newChgflds = new String();

        for(var i = 0 ; i < chgfld.length ; i++)
        {
             var temp = chgfld[i];
			 var fieldNo = temp.substring(temp.lastIndexOf('_') + 1,temp.length);

             if(fieldNo.indexOf('F') >= 0 && search)
             {
                  if(i != 0)
                  {
                      newChgflds += ',' + temp;
                  }
                  else
                  {
                      newChgflds += temp;
                  }
             }
             else if(fieldNo.indexOf('F') < 0 && (!search))
             {
                 newChgflds += ',' + temp;
             }
        }
    }

     return  newChgflds;
 }

 function fsubmit(act)
 { 	
	if(act == 'attachDoc')
 	{ 		
 		if(!alertSelection())
 		{
 		      alert("Please select a row.");
	          return;
	    }
	    else
	    {
	    	openW('upload.do?act=new');
	    	return;
	    } 	
 	}
	
    if((act == 'search'))
    {
        var val = getval('chgflds');

        if(val == '')
        {
			alert(szMsgNoFilter);
            return ;
        }

       val = removeFieldsForThisAction(true);
       setval('chgflds',val);
       return;
    }
    else if (act == 'export' || act == 'exportaspopup')
    {
        act = 'exporttoexcelaspopup';
        openExport2MSExcelWindow (act);
        return;
    }   
    else if (act == 'exporttoexcel(xlsxformat)' || act == 'exportaspopup')
    {       
    	act = 'exporttoexcel(xlsxformat)';
        openExport2MSExcelxlsxWindow (act);
        return;
    }      
    else if(act == 'filldown')
    {
        fillDown();
        return;
    }
    else if ( act == 'fillup')
    {
        fillUp();
        return;
    }
    else if(act == 'fillselected')
    {
      fillSelected();
      return;
    }
    else if(act=='save')
    {
       var saveChgflds = removeFieldsForThisAction(false);
       var searchChgflds = removeFieldsForThisAction(true);
       setval('chgflds', saveChgflds);
       setval('searchChgFlds',searchChgflds);

    }
	else if(act == 'exportpdf')
    {
       openExport2PDFWindow (act);
       return;
    }
	else if(act == 'showsellchannel')
    {
       openSellChannelWindow (act);
       return;
    }
    else if((act=='next') || (act=='prev') || (act=='goto_page'))
    {
       var saveChgflds = removeFieldsForThisAction(false);
       var searchChgflds = removeFieldsForThisAction(true);
       setval('chgflds', saveChgflds);
       setval('searchChgFlds',searchChgflds);

    }
	else if (act.indexOf('SellChannelMass') >= 0)  // sell channel mass query process
	{
	    if(!alertSelection())
 		{
 		      alert("Please select a row.");
	          return;
	    }
	}
	else
    {
	    var actTemp = act.substring(act.lastIndexOf('P'));

		if(actTemp == 'Process')
		{		
		   	// for 10932
			if(arguments.length > 1)
			{
				// set the query process index (the 2nd param set from ToolBar.java)
				document.QueryViewerForm.processIndex.value = arguments[1];
			}
			
			//Tracker#23139 - display the alert "There are changes on the screen..." when click on query process without saving the changes
			var searchChgflds = removeFieldsForThisAction(true);			
			var saveChgflds = removeFieldsForThisAction(false);
			var changed = false;
			if(saveChgflds != null)
			{
				var chgfld = saveChgflds.split(',');
				for(var i = 0 ; i < chgfld.length ; i++)
		        {
		             var temp = chgfld[i];
		             if(temp != null && temp != '')
		             {
		            	 changed = true;
		             }					 
				}
				if(changed)
				{
					 if(confirm(szMsg_Changes))
					 {
						 fsubmit('save');
						 return;
					 }
					 else
					 {
						 setval('chgflds', searchChgflds);
					 }
				}
			}			
		   
         // old logic
         /* if(!alertSelection())
          return;*/
          
         // Tracker:12243 to apply process on all rows
  	       if(!alertSelection())
		   {
		       //Tracker#: 13937 
		       //get the message from i18	       
		       var msg = szRecalcost;
		     
		       //Replace function is used to display Ok and Cancel within single quotes. Since the message was not showing single quotes 
		       //replace OK by 'OK'		      
		       msg=msg.replace('OK','\'OK\'')
		       //replace Cancel by 'Cancel'
		       msg=msg.replace('Cancel','\'Cancel\'')
		       		       
		   		if(confirm(msg))
		   		{
		   			document.QueryViewerForm.processOnAllRows.value = "Y";
		   		}
		   		else
		   		{
		   			return;
		   		}
		   }

		}
    }    
    
    if(act == 'savehedge')
 	{       
       var val = document.getElementById('R3');

       if(val.value == '')
       {
			alert ('Please enter Hedge No');
            return ;
       }
	}

    fsubmitquery(act);
 }

 function alertSelection()
 {
      var obj = getobj('R');
      var selectedRowCount = 0;

      if (obj)
      {
        // only one check box
        if ((typeof obj.length) == 'undefined')
        {
          if (obj.checked == true)
          {
              selectedRowCount = 1;
          }
        }
        else // multiple check boxes
        {
          for (i = 0; i < obj.length; i++)
          {
            if (obj[i].checked == true)
            {
               selectedRowCount++;
			   break;
            }
          }
        }
      }
      if(selectedRowCount <= 0)
      {       
        //alert("Please select a row");
		return false;
      }
	  return true;
  }
    
 function fillDown()
 {
   if (currentRow != -1 )
   {
      if(selectedElement)
      {
          var name = selectedElement.name;
          var fieldName = name.substring(0,name.lastIndexOf('_') + 1);
          
          if(fieldName == '')
           {                
               alert(szMsgNoDataToFill);
               return;
           }
           
          for(var i = currentRow ; i <= rowEnd ; i++)
          {             
               var temp = getobj(fieldName + i);
              
               if(temp)
               {

				 if(hiddenCodeFieldLocal != '')
				 {
				     var codeFieldName = hiddenCodeFieldLocal.substring(0,hiddenCodeFieldLocal.lastIndexOf('_') + 1);
					 var codeFieldObject = getobj(hiddenCodeFieldLocal);
                     var tempCode = getobj(codeFieldName + i);

					 if(codeFieldObject && codeFieldObject.value !='')
					 {
						 cfbyname(tempCode.name)
						 tempCode.value = codeFieldObject.value;
						 temp.value = selectedElement.value;
					 }
					 else
					 {
					    cfbyname(temp.name)
                        temp.value = selectedElement.value;
					 }
				 }
				 else
				 {
				     cfbyname(temp.name)
                     temp.value = selectedElement.value;
				 }

                 checkCurrentRow(i);
               }
          }
      }

   }
   else
   {
      
      alert (szMsgFillDown);
   }

   currentRow = -1;
 }
 
 function fillUp()
 {
   if (currentRow != -1)
   {

     if(selectedElement)
     {
	      var name = selectedElement.name;
          var fieldName = name.substring(0,name.lastIndexOf('_') + 1);
          
          if(fieldName == '')
          {                
             alert(szMsgNoDataToFill);
             return;
          }
        
          for(var i = currentRow ; i >= rowStart ; i--)
          {
               var temp = getobj(fieldName + i);
              
               if(temp)
               {

				 if(hiddenCodeFieldLocal != '')
				 {
				     var codeFieldName = hiddenCodeFieldLocal.substring(0,hiddenCodeFieldLocal.lastIndexOf('_') + 1);
					 var codeFieldObject = getobj(hiddenCodeFieldLocal);
                     var tempCode = getobj(codeFieldName + i);

					 if(codeFieldObject && codeFieldObject.value !='')
					 {
						 cfbyname(tempCode.name)
						 tempCode.value = codeFieldObject.value;
						 temp.value = selectedElement.value;
					 }
					 else
					 {
					    cfbyname(temp.name)
                        temp.value = selectedElement.value;
					 }
				 }
				 else
				 {
				     cfbyname(temp.name)
                     temp.value = selectedElement.value;
				 }

                 checkCurrentRow(i);
               }
          }
      }
   }
   else
   {      
      alert (szMsgFillUp);
   }

   currentRow = -1;
 } 
 
  function fillSelected()
  {     
	    if (currentRow != -1 )
	    {
		      if(selectedElement)
		      { 
			     var name = selectedElement.name;			     			     	      
			     var fieldName = name.substring(0,name.lastIndexOf('_')+ 1);  
			     
			     if(fieldName == '')
                 {                
                   alert(szMsgNoDataToFill);
                   return;
                 }       
			     //Tracker#21063 - Replaced getobj('R') by JQuery as the element count starts from 1 in Mozilla browser
                 //For Ex: in IE and Safari, the count is 0 to 23 but in Mozilla, it is 1 t0 24			     	    
			     var obj = $('input[name=R]');  			   			  
			     var i = 0; // check box count
			     			     
			     for(var k = rowStart; k <= rowEnd; k++)
			     {			     	
			          var curCheckBox = obj[i++];			         
			          var temp = getobj(fieldName + k);        
			          
			          if(curCheckBox != null && curCheckBox.checked)
			          {  
			            cfbyname(temp.name)
			            temp.value = selectedElement.value; 			                     
			          }             
			     }
		      }   
	    }
	   else
	   {
	      alert(szMsgFillData);
	   } 
	  currentRow = -1;
  }
 
 function checkCurrentRow(row)
 {
 	//Tracker#21063 - Replaced getobj('R') by JQuery as the element count starts from 1 in Mozilla browser
    var obj = $('input[name=R]');   

	if (obj)
	{
	    if ((typeof obj.length) != 'undefined') // array
	    { 
            for (var k=0; k < obj.length; k++)
	        {
	            var curCheckBox = obj[k];            
              
	            if (curCheckBox.value == row)
                {
    	            curCheckBox.checked = true;    	           
					clrTableRow(row);
                    break;
                }
	        }
    	}
    	else
    	{
    	    obj.checked = true;
			clrTableRow(row);
        }
     }
 }

 function setQVHiddenCodeField(hiddenField)
 {
    hiddenCodeFieldLocal = hiddenField;
 }

 function handle(nCase)
 { 
    var data; 
        
    if(colFreezeEnabled)
    {        
        data = getElemnt('DATA_DIV1');
    }
    else
    {
        data = getElemnt('DATA_DIV');
    }
    
	if (nCase == 2)
    {
        hide('FLTR_CLOSE');
        show('FLTR_OPEN');
        
        // move which ever is open down
      
        if (data && diff != 0)
        {
             setHeight(data, parseInt(data.offsetHeight) - diff);
            
             if(colFreezeEnabled)
             {
	             var data1 = getElemnt('DATA_DIV2');
	             setHeight(data1, parseInt(data1.offsetHeight) - diff);
             }
        }
    }
    else if (nCase == 6)
    {
        show('FLTR_CLOSE');
        hide('FLTR_OPEN');
        // move which ever is open down
        var dtl = getElemnt('LIST');
        var opn = getElemnt('FLTR_CLOSE');
        dtl.style.top = parseInt(opn.offsetHeight)+"px";
        

        if ( data && parseInt(data.scrollHeight) - parseInt(data.offsetHeight) > 0)  // there is vertical scroll
        {
            setHeight(data, parseInt(data.offsetHeight) + diff);
            
            if(colFreezeEnabled)
            {
	            var data1 = getElemnt('DATA_DIV2');
	            if ( data1 && parseInt(data1.scrollHeight) - parseInt(data1.offsetHeight) > 0)  // there is vertical scroll
		        {
		            setHeight(data1, parseInt(data1.offsetHeight) + diff ) ;
		        }
		        else
		        {
		           diff = 0;
		        }
	        }
        }
        else
        {
            diff = 0;
        }
    }
    else if (nCase == 8)
    {
        var opn = getElemnt('FLTR_CLOSE');
        var dtl = getElemnt('LIST');
        dtl.style.top= opn.style.top+"px";
        hide('FLTR_CLOSE');
        hide('FLTR_OPEN');
        
        if ( data && parseInt(data.scrollHeight) - parseInt(data.offsetHeight) > 0)  // there is vertical scroll
        {
            setHeight(data, parseInt(data.offsetHeight) + diff);
            
            if(colFreezeEnabled)
            {
	            var data1 = getElemnt('DATA_DIV2');
	            if ( data1 && parseInt(data1.scrollHeight) - parseInt(data1.offsetHeight) > 0)  // there is vertical scroll
		        {
		            setHeight(data1, parseInt(data1.offsetHeight) + diff );
			    }
		        else
		        {
		         diff = 0;
		        }
	        }
	    }
        else
        {
            diff = 0;
        }
    }  
 }
 
 function resetValues()
 {
    var defaultOps = getDefaultOperators();
    var docForm = document.forms[0];
    var formElem;
    for (i = 0; i < docForm.elements.length; i++)
    {
        formElem = docForm.elements[i];
        var formElemName = formElem.name;

        if(formElemName.indexOf('F') < 0)
        {
           continue;
        }

        if(formElemName)
        {
           var fieldType = formElemName.substring(formElemName.lastIndexOf('_') + 1,formElemName.length);

           switch (formElem.type)
           {
                 case 'text':

                    if(fieldType.indexOf('F') >= 0)
                    {
                        formElem.value = '';
                    }

                break;

                case 'select-one':

                      if(fieldType == 'op')
			          {
			             var foundField = new Boolean(false);

				          for(j = 0 ;j < defaultOps.length ; j++)
				          {
				             var fieldOperator = defaultOps[j].split(',');

				             if(formElemName == fieldOperator[0])
				             {
				                 formElem.value = fieldOperator[1];
				                 foundField = new Boolean(true);
				                 break;
				             }

				          }

				          //default operator
				          if(foundField == false)
				          {
				            formElem.value = '2';
				          }
			          }
			          else if(fieldType.indexOf('F') >= 0)
			          {
			             formElem.options[0].selected = true;
			          }

                break;

                case 'textarea':

                    if(fieldType.indexOf('F') >= 0)
                    {
                        formElem.value = '';
                    }
                   break;
                }

        }
    }
    setval('chgflds', '');

 }
 
 function hasChanged(p)
 {
    var act;
    var modifiedFlds = getval('chgflds');
    
    if( modifiedFlds != "")
    {
        var isChanged = hasFieldsBeenModified(modifiedFlds);
        
        if (isChanged && confirm(szMsg_Changes))
        {
            act = szSAVE;
        }
        else
        {
            act = '';
            setval('JS_CONFIRM_DIALOG','CANCEL');
        }
    }
    return act;
 }

 function  hasFieldsBeenModified(modifiedFlds)
 {
    if(modifiedFlds != "")
    {
        var chgfld = modifiedFlds.split(',');

        for(var i = 0 ; i < chgfld.length ; i++)
        {
             var temp = chgfld[i];
             var fieldNo = temp.substring(temp.lastIndexOf('_') + 1,temp.length);
             if(fieldNo && fieldNo != "" &&  fieldNo.indexOf('F') < 0)
             {
                 return true;
             }
        }
    }
    return false;
 }
 
 function sr(row, secid, ele)
 {
    currentRow = row;
    nCurRow = row;
    
    if(nCurRow == -1)
       return;
    
    selectedElement = ele;
    
	hiddenCodeField = '';
    checkCurrentRow(nCurRow);
 }

 function srh(row, secid, ele)
 {
     sr(row, secid, ele);
 }
  
 function mouseOver(element)
 {
    var sortup = element.src.lastIndexOf('/');
    var imgSource = element.src.substr(sortup);

    if (imgSource == '/arrowup.gif')
    {
      element.src ='images/arrowup.gif';
      sortDescflag=true;
    }
    else
    {
       sortDescflag=false;
    }
 }
 
 function mouseOut(element)
 {
    var sortup = element.src.lastIndexOf('/');
    var imgSource = element.src.substr(sortup);
    
    if (imgSource == '/arrowup.gif')
    {
      element.src ='images/arrowup.gif';
    }
 }
 
 //--Begin 2009R1 changes
 function buildNewValidationAjaxParams()
 {
	var chgflds = getval('chgflds'); 
	if (chgflds != null)
	{
		var requestParams = "";
		var chgfldsArray = chgflds.split(",");
		var count = chgfldsArray.length;
	    for(var i=0;i<count;i++)
	    {
			 var name = chgfldsArray[i];
			 if (name == '') continue;
			 //Tracker#21063 - Replaced getElementById() with JQuery as the lookup is not opening when click on the field second time 
			 var value = $('input[name="' +name+ '"]').value;		
             if (i > 0)requestParams += "&";
             requestParams += name + "=" + value;
	    }
		window.status = requestParams; 
		return 'chgflds=' + chgflds + '&' + requestParams;
	}
	return 'chgflds=' + chgflds;
 }

 function displayValidationSearchPopUpForQV(queryField, isMultiPost, multiPostInputCallBack, queryUrl)
 {
    //If suggestion dropdown opened close it
    var searchControl = new VALIDATION.SearchControl(queryField, isMultiPost, multiPostInputCallBack, queryUrl);
    searchControl.addRequestParameters(buildNewValidationAjaxParams());
    searchControl.showPopup();
 }

 function updateChangedFlds(obj)
 {
	obj.setRequestParameters(buildNewValidationAjaxParams());
 }
//End of 2009R1 changes--
 
//Tracker#: 17798 - REGRESSION ISSUE: NEW PLM QUERY VIEWER UI HAVE SOME REGRESSION ISSUES
//Removed align2TableCols function override and using re-written confunc.js version of this function.
 
szClrdRow = '#F4EDAD';
function handle1(obj, row)
{
    var rwSpan = getRowSpan();

    if (obj.checked == true)
    {
        nCurRow = row;

        selectTableRow(row,rwSpan);
    }
    else if (!isSelected('R'))
    {
        nCurRow = -1;

        unselectTableRow(row,rwSpan);
    }
    else
    {
        unselectTableRow(row,rwSpan);
    }
}

function selectTableRow(row,rwSpan)
{
    if(typeof(colFreezed)!='undefined' && (colFreezed==true))
    {
        clrTableRow(row, 'DATA_TABLE1');

        var rw2Span = getSecondRowSpan();
        if(rw2Span>1)
        {
            var sRow = getStartRowIndex(row, rw2Span);
            for(var i=0;i<rw2Span;i++)
            {
               clrTableRow(sRow + i, 'DATA_TABLE2');
            }
        }
        else
        {
            clrTableRow(row, 'DATA_TABLE2');
        }
    }
    else
    {
        //for not column freeze
        if(rwSpan>1)
        {

            var sRow = getStartRowIndex(row, rwSpan);
            for(var i=0;i<rwSpan;i++)
            {
               clrTableRow(sRow + i);
            }
        }
        else
        {
            clrTableRow(row);
        }
    }
}

function unselectTableRow(row,rwSpan)
{

    if(typeof(colFreezed)!='undefined' && (colFreezed==true))
    {
        unclrTableRow(row, 'DATA_TABLE1');

        var rw2Span = getSecondRowSpan();
        if(rw2Span>1)
        {
            var sRow = getStartRowIndex(row, rw2Span);
            for(var i=0;i<rw2Span;i++)
            {
               unclrTableRow(sRow + i,'DATA_TABLE2');
            }
        }
        else
        {
            unclrTableRow(row, 'DATA_TABLE2');
        }

    }
    else
    {
        if(rwSpan>1)
        {
            var sRow = getStartRowIndex(row, rwSpan);
            for(var i=0;i<rwSpan;i++)
            {
               unclrTableRow(sRow + i);
            }
        }
        else
        {
            unclrTableRow(row);
        }
    }

}

function getRowSpan()
{
    var retVal = 1;

    var obj = getElemnt('detRowSpan');

    if(obj)
    {
        retVal = parseFloat(obj.value);
    }
    return retVal;
}

function highLightDataRow(tableId1, tableId2, highLight, rowIndex, first, last)
{
	var dataDiv1 = getElemnt(tableId1);
	var div1Rows = dataDiv1.getElementsByTagName("TR");

	var dataDiv2 = getElemnt(tableId2);
	var div2Rows = dataDiv2.getElementsByTagName("TR");

	for(var i = first; i <= last; i++)
	{
		if(i == rowIndex)
		{
			var row1 = div1Rows[i - first];
			var row2 = div2Rows[i - first];

			if(highLight)
			{
				row1.style.background = "#F4EDAD";
				row2.style.background = "#F4EDAD";
			}
			else
			{
				row1.style.background = "";
				row2.style.background = "";
			}
		}
	}
}

function adjustHeightOfDiv()
{
	if (colFreezeEnabled)
	{
		var data1 = getElemnt('DATA_DIV1');
		var data2 = getElemnt('DATA_DIV2');
		
		if (data1 && data2)
		{
			var scrollBarHeight = 0;
		
			if (data2.offsetWidth <= data2.scrollWidth)
			{
				scrollBarHeight = 14;
			}
		
			setHeight(data1, parseInt(data2.offsetHeight) - scrollBarHeight);
		}
	}
}

/* Tracker#: 12269 - FIREFOX: OUTSTANDING ISSUES IN FIREFOX BROWSER  FOR SETUP SCREENS
 * Non-IE browsers - need to pass the event object as parameter for inline JS function call.
 */
function qvSearchOnEnterKeyPress(objFld, e)
{	 
	 var key = "";
     
     if(window.event) 
     {
		key = event.keyCode; //IE
	 }
	 else 
	 {
		key = e.which; //firefox
	 }
	 if(key == '13')
	 {
	 	objFld.onchange();
	 	fsubmitquery('search');
	 }
}

/* over-ride expandtl in comfunc.js
 * 
 */
(function (window) {
	var oldExpandtl = expandtl;
	window.expandtl = function () {
		oldExpandtl(true);
	};
})(window);
