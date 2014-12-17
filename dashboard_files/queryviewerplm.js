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

var isNewUI = 'N';
var currentMethod = "";
var queryId = "";
//Tracker#: 7082 SCREEN RENDERING ISSUES WHEN USING SAFARI OR FIREFOX.
//added a variable colFreezeEnabled which will be global throughout
var colFreezeEnabled = false;

var reqFltrParams = "";
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
        //alert(szMsgSelectQuery );
        var errorObj = new htmlErrors();
        errorObj.addWarning(szMsgSelectQuery);
        objMsgDiv = new messagingDiv(errorObj);

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
        //alert (szMsgFeatureNotSupported);
        var errorObj = new htmlErrors();
        errorObj.addWarning(szMsgFeatureNotSupported);
        objMsgDiv = new messagingDiv(errorObj);
        return;
    }

   var submitSearch = false;   
  
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
			//alert (szMsgNoFilter);
			var errorObj = new htmlErrors();
        	errorObj.addWarning(szMsgNoFilter);
        	objMsgDiv = new messagingDiv(errorObj);

            return false;
        }
       
        setval('method', act);
        waitWindow();

        if(!submitSearch)
        return true;
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
        //alert(szMsgFilterFields + reqdMsg.join('<i18n:message resid="501329" info=", "/>'));
        var errorObj = new htmlErrors();
        errorObj.addWarning(szMsgFilterFields + reqdMsg.join(","));
        objMsgDiv = new messagingDiv(errorObj);

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

 function newfsubmitForQueryViewer(act)
 {
	if(act == 'attachDoc')
 	{
 		if(!alertSelection())
 		{
	          var errorObj = new htmlErrors();
        	  errorObj.addWarning("Please select a row");
        	  objMsgDiv = new messagingDiv(errorObj);
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
			//alert(szMsgNoFilter);
			var errorObj = new htmlErrors();
        	errorObj.addWarning(szMsgNoFilter);
        	objMsgDiv = new messagingDiv(errorObj);
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
      fillSelected()
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

           if(!alertSelection())
	          return;
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
       /* var errorObj = new htmlErrors();
        errorObj.addWarning("Please select a row");
        objMsgDiv = new messagingDiv(errorObj); */
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
      //alert (szMsgFillDown);
       var errorObj = new htmlErrors();
       errorObj.addWarning(szMsgFillDown);
       objMsgDiv = new messagingDiv(errorObj);
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
      //alert (szMsgFillUp);
      var errorObj = new htmlErrors();
      errorObj.addWarning(szMsgFillUp);
      objMsgDiv = new messagingDiv(errorObj);
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
			            if(temp)
               			{

						 if(hiddenCodeFieldLocal != '')
						 {
						     var codeFieldName = hiddenCodeFieldLocal.substring(0,hiddenCodeFieldLocal.lastIndexOf('_') + 1);
							 var codeFieldObject = getobj(hiddenCodeFieldLocal);
		                     var tempCode = getobj(codeFieldName + k);

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
			             
			             checkCurrentRow(k);
			          }
			        }
			     }
		      }
	    }
	   else
	   {
	      	//alert(szMsgFillData);
	      	var errorObj = new htmlErrors();
      		errorObj.addWarning(szMsgFillData);
      		objMsgDiv = new messagingDiv(errorObj);
	   }
	  currentRow = -1;
  }

 function checkCurrentRow(row)
 {
    //Tracker#21063 - Replaced getobj('R') by JQuery as the element count starts from 1 in Non-IE browsers
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
        var dtl = getElemnt('LIST');
        var opn = getElemnt('FLTR_OPEN');
        dtl.style.top = parseInt(opn.offsetHeight)+"px";

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

 /*START commnet function handle(nCase)
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
        qvphide('FLTR_CLOSE');
        qvpshow('FLTR_OPEN');  // END comment*/

        // move which ever is open down
        /*var dtl = getElemnt('LIST');
        var opn = getElemnt('FLTR_OPEN');
        dtl.style.top = parseInt(opn.offsetHeight)+"px";

        if (data && diff != 0)
        {
             setHeight(data, parseInt(data.offsetHeight) - diff);

             if(colFreezeEnabled)
             {
	             var data1 = getElemnt('DATA_DIV2');
	             setHeight(data1, parseInt(data1.offsetHeight) - diff);
             }
        } */
  /*START commnet   }
    else if (nCase == 6)
    {
        qvpshow('FLTR_CLOSE');
        qvphide('FLTR_OPEN');
        // move which ever is open down
        var dtl = getElemnt('LIST');
        var opn = getElemnt('FLTR_CLOSE');
        dtl.style.top = parseInt(opn.offsetHeight)+"px";


        if ( data && parseInt(data.scrollHeight) - parseInt(data.offsetHeight) > 0)  // there is vertical scroll
        {
           /* setHeight(data, parseInt(data.offsetHeight) + diff);

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
	        } */
    /*START commnet     }
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
        qvphide('FLTR_CLOSE');
        qvphide('FLTR_OPEN');

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
 }  END commnet */

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

 /*function hasChanged(p)
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
 }*/

 /*function  hasFieldsBeenModified(modifiedFlds)
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
 } */

 function qvsr(row, secid, ele)
 {
    currentRow = row;
    nCurRow = row;

    if(nCurRow == -1)
       return;

    selectedElement = ele;

	hiddenCodeField = '';
    checkCurrentRow(nCurRow);
 }

 function qvsrh(row, secid, ele)
 {
    sr(row, secid, ele);
 }

 /*function mouseOver(element)
 {
    var sortup = element.src.lastIndexOf('/');
    var imgSource = element.src.substr(sortup);

    if (imgSource == '/sortasc.gif')
    {
      element.src ='images/sortasca.gif';
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

    if (imgSource == '/sortasca.gif')
    {
      element.src ='images/sortasc.gif';
    }
 }
 */


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

 //////////////////////////////////////////////////////////////////////
 ///////////////// for tracker # 11993 - NEW UI ///////////////////////
 //////////////////////////////////////////////////////////////////////
 /////////////// Need to remove unused methods from above /////////////
 /////////////// Code refinement is required //////////////////////////
 //////////////////////////////////////////////////////////////////////


// VIEW
function fetchQueryResults(url)
{
	var ajaxReq = new AJAXRequest(url, refreshWorkAreaForQuery, "&V2009UI=Y", true);
 	ajaxReq.send();
}

/** Tracker#: 19807 - LEFT NAVIGATION NEEDS TO BE MADE COLLAPSIBLE
 * Firefox - PLM Query Viewer - the title & data divs were being positioned
 * before the images (arrow icons, background images, etc.) in the workarea
 * div.  For non-IE browsers only, executing JS scripts in response, aligning
 * workarea container, etc. only after all images in workarea have loaded. 
 */
var refreshWorkAreaForQuery = (function () {
	
	var waitForImagesToLoad = (function () {
		var numLoaded = 0,
			numImages;
		
		return function ($target, finishLoadingFunc) {
			var $images = $target.find('img');
			numImages = $images.length;
			
			//Tracker#25777 - If the image is not there in the path it will go to error part
			$images.load(function () {
				numLoaded ++;
				if (numLoaded === numImages)
				{
					numLoaded = 0;
					numImages = 0;
					
					finishLoadingFunc();
				}
			})
			.error(function () {
				$(this).load();
			})
		};
	})();

	var adjustWorkAreaContents = function (objWorkAreaDiv, response)
	{
		// execute the scripts
		if(IE)
		{
			fireJS(response);
			//executeScriptsInResponse(objWorkAreaDiv);
		}
		else
		{
			//fireJS(response);
			executeScriptsInResponse(objWorkAreaDiv);
		}


	    // Scroll Changes -------------------------------
		alignWorkAreaContainer();
		//Tracker#: 16447 QUERY WORK FLOW TASK FOR MATERIAL QUOTE OFFER- NAVIGATION ISSUE
		//resetting the divs so as to alignung to the screen
	  	if(nCurScrWidth > MinimumScrWidth)
	    {
	  		resetAllMainDivs();
	    }
	    var divObj = document.getElementById("_divWorkArea");// document.getElementById("_divWorkArea");

	    if(divObj)
	    {
	    	/*
	    	 * Firefox: Setting width to 'auto' instead of '100%'
	    	 * in order to account for 6px padding on #_divWorkArea
	    	 * without creating horizontal scrollbar.
	    	 * 
	    	 * IE: leaving it as width:100% because when set to width:auto,
	    	 * still get horizontal scrollbar due to padding.
	    	 * 
	    	 */
	    	if (IE)
	    	{
	    		divObj.style.width = "100%";
	    	}
	    	else
	    	{
	    		divObj.style.width = "auto";
	    	}
	    	
	    	divObj.style.overflow="hidden";
	    }
	    // Scroll Changes -------------------------------

	    if(currentMethod != 'drilldown')
	    {
	        resetDataDivHeightsToMatchWorkArea();
	    }
	    else
	    {
	    	currentMethod = "";	
	    }

		closeWaitWindow();
	}
	
	
	return function (response) {
		var objWorkAreaDiv = document.getElementById("_divWorkArea");
	
		if(currentMethod == 'drilldown')
		{
			objWorkAreaDiv.innerHTML = response;
			//Tracker#21084 - This is used to change the navigation according to the drilldownId and print the search list icon
   			//Tracker#27250 - passing restoreId also to find the search icon 
			pna('cdiv', menuId + restoreId + suffixNav, restoreId, 'left');
   			var backToListImage = getElemnt("searchListImage"+ menuId + restoreId);
   			//Tracker#: 16447 QUERY WORK FLOW TASK FOR MATERIAL QUOTE OFFER- NAVIGATION ISSUE
   			//Added a check for the backToListImage exists or not
	   		if(backToListImage)
	   		{
		   		backToListImage.style.visibility = "visible";
                backToListImage.style.display = "inline-block";
		   		backToSearchList = backToListImage.onclick;
		   		backToListImage.onclick = function(){return backToQueryList(menuId,restoreId);}
		   		backToListImage.title = "Back to Query List";
		   	}
			//currentMethod = "";
		}
		else
		{
			// Tracker#: 17798 - REGRESSION ISSUE: NEW PLM QUERY VIEWER UI HAVE SOME REGRESSION ISSUES
			// When selecting a query from dashboard, if the page had been scrolled down before clicking
			// on query, the scrolled down position will remain, which will obscure the top part of
			// the response html going into the workAreaDiv.
			// Fix:  set workAreaContainer div scrolltop to zero.
			getElemnt('_divWorkAreaContainer').scrollTop = 0;
			objWorkAreaDiv.innerHTML = response;
		}
	
		if (!IE)
		{
			waitForImagesToLoad($('#_divWorkArea'), function () {
				adjustWorkAreaContents(objWorkAreaDiv, response);
			});
		}
		else
		{
			adjustWorkAreaContents(objWorkAreaDiv, response);
		}
	};

})();


//	Tracker#: 7082 SCREEN RENDERING ISSUES WHEN USING SAFARI OR FIREFOX.
//	This function aligns the header to the data columns

function alignColsToHeader(colfreeze, tableHeader1, tableData1, tableHeader2, tableData2)
{
	var tdArrayHeader;
	var tdArrayData;
	var counter = 0;
	var start = 0;
	/*if(colfreeze)
	{
		start=1
		headerWidth = document.getElementById('T').offsetWidth;
		dataWidth =document.getElementById('D0').offsetWidth;
		if(headerWidth > dataWidth)
		{
			getElemnt('D0').style.width =  getElemnt('T').offsetWidth -1+"px";
		}
		else if(headerWidth < dataWidth)
		{
			getElemnt('T').style.width =  getElemnt('D0').offsetWidth -1+"px";
		}
	}*/
	if(tableHeader1 && tableData1)
	{
		//Tracker#21063 - If 'Required Filter' property applied to any of the searchable field, tableHeader1(TITLE_DIV) will be null
		//So added condition to check null to avoid never ending processing bar issue
		if(getElemnt(tableHeader1) == null)
		{
			return;
		}
		tdArrayHeader = getElemnt(tableHeader1).getElementsByTagName('td');
		tdArrayData = getElemnt(tableData1).getElementsByTagName('td');
		for (var i=start;i<tdArrayHeader.length;i++) 
		{ 
			if (tdArrayHeader[i].id && tdArrayHeader[i].id.indexOf('T') > -1) 
			{
				//Refactoring the code and added a check if the object headerElmt and dataElmt exitsts
				headerElmt = getElemnt('T' + i);
				dataElmt = getElemnt('D' + i);
				if(headerElmt && dataElmt)
				{
					headerWidth = headerElmt.offsetWidth;
					dataWidth = dataElmt.offsetWidth; 
					if(headerWidth > dataWidth)
					{
						dataElmt.style.width =  headerElmt.offsetWidth - 1+"px";
					}
					else if(headerWidth < dataWidth)
					{
						headerElmt.style.width =  dataElmt.offsetWidth+"px";
					}
				}
			} 
			counter++;
		} 
	}
	
	/*if(tableHeader2 && tableData2)
	{
		tdArrayHeader = document.getElementById(tableHeader2).getElementsByTagName('td');
		tdArrayData = document.getElementById(tableData2).getElementsByTagName('td');
		alert("test:"+document.getElementById(tableHeader2).getElementsByTagName('td').length);
		for (var i=counter+1 ;i<= document.getElementById(tableHeader2).getElementsByTagName('td').length;i++) 
		{ 
			//alert(tdArrayHeader[i].id.indexOf('T'));
			if (tdArrayHeader[i].id && tdArrayHeader[i].id.indexOf('T') > -1) 
			{
				headerWidth = getElemnt('T' + i).offsetWidth;
				dataWidth = getElemnt('D' + i).offsetWidth; 
				alert("table 2 :"+'T' + i+" headerWidth:"+headerWidth+" dataWidth:"+dataWidth);
				if(headerWidth > dataWidth)
				{
					getElemnt('D' + i).style.width =  getElemnt('T' + i).offsetWidth -1+"px";
				}
				else if(headerWidth < dataWidth)
				{
					getElemnt('T' + i).style.width =  getElemnt('D' + i).offsetWidth -1+"px";
				}
			} 
		} 
	}*/
}

function executeScriptsInResponse(objWorkAreaDiv)
{
	var scripts = objWorkAreaDiv.getElementsByTagName('script');
	for(var i = 0; i < scripts.length; i++)
	{
		// then add to the header - may not be required
		//document.getElementsByTagName("head")[0].appendChild(scripts[i]);

		if(scripts[i])
		{	// to execute explicitly as at the time of assisigning the innerHTML
			if(scripts[i].innerHTML != null && scripts[i].innerHTML != "" && scripts[i].innerHTML != 'undefined')
			{
				try
				{
					/* Tracker#: 20747 - FIREFOX / SAFARI: EXPORT TO EXCEL AND EXPORT PDF FEATURES DO NOT WORK ON QUERIES FROM PLM DASHBOARD
					 * Issue - functions in queryviewerplm.jsp being declared in local function scope instead of global scope.
					 * Fix - Execute eval call in global scope.
					 */
					eval.call(window, scripts[i].innerHTML);
				}
				catch(e)
				{
					var errorObj = new htmlErrors();
      				errorObj.addWarning("Java Script Error : " + e);
      				objMsgDiv = new messagingDiv(errorObj);
				}
			}
		}
		
	}
	//Tracker#: 7082 SCREEN RENDERING ISSUES WHEN USING SAFARI OR FIREFOX.
	//If it is column freezed then it will re-align all the columns and rows
	if(colFreezeEnabled)
	{
		/*
		 * handlColLock function was being called again, causing 
		 * it to misalign the data div.
		 * Still need to call expandtl function to properly align the
		 * height of data div.
		 */
		//handleColLock(nLockedcols);
		expandtl();
		
		
		var dataDiv1 = getElemnt("DATA_DIV1");
		var dataDiv2 = getElemnt("DATA_DIV2");
		if(dataDiv1 && dataDiv2 && dataDiv1.offsetHeight < dataDiv2.offsetHeight)
		{
			dataDiv1.style.height =  dataDiv2.offsetHeight - nScrlbar+"px";
		}
		else if(dataDiv1 && dataDiv2 && dataDiv2.offsetHeight < dataDiv1.offsetHeight)
		{
			dataDiv2.style.height =  dataDiv1.offsetHeight+"px";
		}
		//alignColsToHeader(true,'TITLE_DIV1','DATA_DIV1','TITLE_DIV2','DATA_DIV2');
	}
	//Tracker#21063 - Removed else condition as it should not execute while doing drilldown to any documents.
	if(!colFreezeEnabled && currentMethod != 'drilldown')
	{
		//Aligns the columns in the header to the data when it is column freezed
		alignColsToHeader(false,'TITLE_DIV','DATA_DIV');
	}
}

// SAVE
function updateByAJAXCall(method)
{
	var saveChgflds = removeFieldsForThisAction(false);
    var searchChgflds = removeFieldsForThisAction(true);
    setval('chgflds', saveChgflds);
    setval('searchChgFlds',searchChgflds);

	var changedFields = getval('chgflds');

	if(changedFields == '')
	{
		//alert(szMsg_No_change);
		var errorObj = new htmlErrors();
        errorObj.addWarning(szMsg_No_change);
        objMsgDiv = new messagingDiv(errorObj);
		return;
	}

 	var params = "&V2009UI=Y&chgflds=" + getval('chgflds');
 	params = params + getSelectedRows();

 	params = params + getDataParams();
 	params = params + getOtherParams();


 	// AJAX call
 	var url = "queryviewer.do?method=save";
 	var ajaxReq = new AJAXRequest(url, refreshWorkAreaForQuery, params, true);
 	waitWindow();
 	ajaxReq.send();
}

// show all
function showAllByAJAXCall()
{
	if(hasreqdfilter())
    {
        if(chkreqd()==false)
        {
        	return;
        }
        else
        {
        	searchByAJAXCall();
        	return;
        }
    }
	// AJAX call
	var params = "&V2009UI=Y";
	params = params + getOtherParams();
 	var url = "queryviewer.do?method=showall";
 	var ajaxReq = new AJAXRequest(url, refreshWorkAreaForQuery, params, true);
    reqFltrParams = "" // resetting
 	waitWindow();
 	ajaxReq.send();
}

function getSelectedRows()
{
	var selectedRowNums = "";
	var selectedRows = document.forms[0]['R'];

	if(selectedRows == undefined)
	{
		return selectedRowNums;
	}

 	if(selectedRows.length == undefined)
 	{
 		if(selectedRows.checked == true)
 		{
 			selectedRowNums = "&R=" + selectedRows.value;
 		}
 	}
 	else
 	{
 		for(var i = 0; i < selectedRows.length; i++)
 		{
 			var chkRow = selectedRows[i];

 			if(chkRow.checked == true)
 			{
 				selectedRowNums = selectedRowNums + "&R=" + chkRow.value;
 			}
 		}
 	}

 	return selectedRowNums;
}

function getDataParams()
{
	var changedDataFlds = getval('chgflds');
 	var changedDataFldNames = changedDataFlds.split(",");
 	var dataParams = "";

 	for(var i = 0; i < changedDataFldNames.length; i++)
 	{
 		if(changedDataFldNames[i] != "")
 		{
 			//Tracker#22894 - Encoding the user typed value to fix the special character issue.
 			dataParams = dataParams + "&" + changedDataFldNames[i] + "=" + encodeURIComponent(getval(changedDataFldNames[i]));
 		}
 	}
 	//alert(dataParams);
 	return dataParams;
}

function getOtherParams()
{
	// all other params goes here
	var params = "";
	// method is not included here
	params = params + "&searched=" + getval('searched');
	params = params + "&rowno=" + getval('rowno');
	params = params + "&drill_docid=" + getval('drill_docid');
	params = params + "&searchExists=" + getval('searchExists');
	params = params + "&sort_colname=" + getval('sort_colname');
	params = params + "&sort_type=" + getval('sort_type');
	params = params + "&image_status=" + getval('image_status');
	params = params + "&searchChgFlds=" + getval('searchChgFlds');
	params = params + "&recordsPerPage=" + getval('recordsPerPage');
	params = params + "&pageno=" + getval('pageno');

	return params;
}

// localised the common functions
function qvphide(id)
{
	var tmpObj = getElemnt(id);

	if(tmpObj)
	{
		tmpObj.style.display = 'none';
	}
}

function qvpshow(id)
{
	var tmpObj = getElemnt(id);

	if(tmpObj)
	{
		tmpObj.style.display = 'block';
	}
}


// SEARCH - need refactoring
function searchByAJAXCall(act)
{
   var submitSearch = false;

   /*if(act == 'showall')
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
    }*/

    if((act == 'search'))
    {
       if(hasreqdfilter())
       {
           if(chkreqd()==false)
           {
              return false;
           }
       }

       //Tracker#23139 - display the filter alert if any of the search field is changed
       var searchChgflds = removeFieldsForThisAction(true);
       setval('chgflds', searchChgflds);
       
      	var val = getval('chgflds');

       if(val == '')
       {
			//alert (szMsgNoFilter);
			var errorObj = new htmlErrors();
        	errorObj.addWarning(szMsgNoFilter);
        	objMsgDiv = new messagingDiv(errorObj);
            return false;
       }
       //removeFieldsForThisAction(true);

        //setval('method', act);
        //waitWindow();

        //if(!submitSearch)
        //return true;
   }


    /*setval('method', act);
    waitWindow();
    eval('document.'+FRM+'.submit()');
    return true;*/

    var params = "&V2009UI=Y&chgflds=" + getval('chgflds');
 	//params = params + getSelectedRows();
 	params = params + getDataParams();
 	params = params + getOtherParams();

	params =  params + getOperatorParams();

 	// AJAX call
 	var url = "queryviewer.do?method=search";
 	var ajaxReq = new AJAXRequest(url, refreshWorkAreaForQuery, params, true);
 	waitWindow();
 	ajaxReq.send();
 }

 function getOperatorParams()
 {
 	var changedOperFlds = getval('chgflds');
 	var changedOperFldNames = changedOperFlds.split(",");
 	var operParams = "";

 	for(var i = 0; i < changedOperFldNames.length; i++)
 	{
 		if(changedOperFldNames[i] != "")
 		{
 			var operFldName = changedOperFldNames[i] + "_op";
 			operParams = operParams + "&" + operFldName + "=" + getval(operFldName);
 		}
 	}

 	return operParams;
 }

 // refresh
 function refreshByAJAXCall(method)
 {
 	if(method == 'refresh')
	{
	    
	   if (hasreqdfilter())
	   {  
	       if(chkreqd() == false)
	       { 
	          return;
	       }
	   }
	   //Tracker#23139 - Setting change field values to empty
	   setval('chgflds', '');
	}
 	
 	var params = "&V2009UI=Y&chgflds=" + getval('chgflds');
 	//params = params + getSelectedRows();
 	params = params + getDataParams();
 	params = params + getOtherParams();   	
	params =  params + getOperatorParams();
 	var url = "queryviewer.do?method=refresh";
 	var ajaxReq = new AJAXRequest(url, refreshWorkAreaForQuery, params, true);
 	
 	waitWindow();
 	ajaxReq.send();
 }

 // prev
 function prevByAJAXCall(method)
 {
 	resetParamsForNavigations();
 	var params = "&V2009UI=Y&chgflds=" + getval('chgflds');

 	params = params + getSelectedRows();
 	params = params + getDataParams();
 	params = params + getOtherParams();
	params =  params + getOperatorParams();

 	var url = "queryviewer.do?method=prev";
 	var ajaxReq = new AJAXRequest(url, refreshWorkAreaForQuery, params, true);
 	waitWindow();
 	ajaxReq.send();
 }

 // next
 function nextByAJAXCall(method)
 {
 	resetParamsForNavigations();
 	var params = "&V2009UI=Y&chgflds=" + getval('chgflds');

 	params = params + getSelectedRows();
 	params = params + getDataParams();
 	params = params + getOtherParams();
	params =  params + getOperatorParams();

 	var url = "queryviewer.do?method=next";
 	var ajaxReq = new AJAXRequest(url, refreshWorkAreaForQuery, params, true);
 	waitWindow();
 	ajaxReq.send();
 }

 // go to page
 function goToPageByAJAXCall(method, pageNum)
 {	
 	resetParamsForNavigations();
 	var params = "&V2009UI=Y&chgflds=" + getval('chgflds'); 	
 	var pageNumber = pageNum;
 	
 	if(arguments.length == 1) // from Go To text box
	{	
		pageNumber = getval('pageno'); 
	}
 	
 	if(pageNumber == "" || !isNum(pageNumber))
 	{
 		var errorObj = new htmlErrors();
        errorObj.addWarning("Please enter a valid page number.");
        objMsgDiv = new messagingDiv(errorObj);

 		return;
 	}

 	//params = params + "&pageno=" + getval('pageno'); // commented by rag for new pagination

	params = params + "&pageno=" +  pageNumber;
	
 	params = params + getSelectedRows();
 	params = params + getDataParams();
 	params = params + getOtherParams();
	params =  params + getOperatorParams();

 	var url = "queryviewer.do?method=goto_page";
 	var ajaxReq = new AJAXRequest(url, refreshWorkAreaForQuery, params, true);
 	waitWindow();
 	ajaxReq.send();
 }

 function resetParamsForNavigations()
 {
 	var saveChgflds = removeFieldsForThisAction(false);
    var searchChgflds = removeFieldsForThisAction(true);
    setval('chgflds', saveChgflds);
    setval('searchChgFlds',searchChgflds);
 }

 // sort
 function sortByAJAXCall(objColumn)
 {
	if(rowStart == -1 && rowStart == rowEnd)
    {
    	return;
    }

	var sortup = objColumn.src.lastIndexOf('/');
	var imgSource = objColumn.src.substr(sortup);

	if (imgSource == '/arrowdown.gif')
	{
        document.forms[0].sort_colname.value=objColumn.id;
        document.forms[0].sort_type.value='ASC';
        objColumn.src = 'images/arrowup.gif';
        document.forms[0].image_status.value = 'images/arrowup.gif';
	}
	else  if(imgSource == '/arrowup.gif')
	{
        document.forms[0].sort_colname.value=objColumn.id;
        document.forms[0].sort_type.value='DESC';
        objColumn.src = 'images/arrowdown.gif';
        document.forms[0].image_status.value = 'images/arrowdown.gif';
	}

	var params = "&V2009UI=Y" + getOtherParams() + "&chgflds=" + getval('chgflds');
	var url = "queryviewer.do?method=sortup";

	var ajaxReq = new AJAXRequest(url, refreshWorkAreaForQuery, params, true);
	waitWindow();
	ajaxReq.send();
 }

// drill down

var backToSearchList = ""

//Tracker#: 16104 MATERIAL PROJECTIONS LEFT NAVIGATION: THE "SHOW SEARCH LIST" ICON IS MISSING
//Changing the id of the links being called
function fgoto(p,prow,docId)
{
   document.forms[0].drill_docid.value=docId;
   document.forms[0].rowno.value=prow;
   //Tracker#21084 - Made restoreId as a global variable because this is needed in refreshWorkAreaForQuery() for navigation purpose   
   restoreId = 0;
   // added 'chgflds' also to query string
   //Tracker#21084 - added 'qnInPlm' to forward the request to queryviewerplm.jsp to stay back if the quote not  
   //matches with the filter condition(Request_Type = 'SPEC')
   var params = getOtherParams() + "&qvInPlm=" + "Y" + "&chgflds=" + getval('chgflds');
   reqFltrParams = params;
   var url = "queryviewer.do?method=goto";
   //Tracker#: 16447 QUERY WORK FLOW TASK FOR MATERIAL QUOTE OFFER- NAVIGATION ISSUE
   //Added the docid for the for the material quote offer
   //Tracker#: 17787 QUERY BUILDER DOES NOT WORK FOR MATERIAL QUOTE VIEW
   //added the docId 155 for material quote
   //Tracker#: 18635 F13 WFT FOR CAPACITY PROJECTIONS
   //added the docId 6800 for capacity projections
   //Tracker#: 18920 F8 WFT FOR CAPACITY
   //added the docId 7300 for capacity
   if(isNewUI == 'Y' || docId == 132 || docId == 160 || docId == 5800 || docId == 155 ||docId == 2406 || docId == 6800 || docId == 7300 || docId == 212 || docId == 321) // 132 is a special case (techspec or samples)
   {
   		createSearchObject(docId);
   		currentMethod = "drilldown";

   		var menuId = getMenuIdForDrillDown(docId);
   		if(menuId == "")
   		{
   			var errorObj = new htmlErrors();
        	errorObj.addWarning("Drill down not Supported");
        	objMsgDiv = new messagingDiv(errorObj);
   			return;
   		}
   		else
   		{
   			//Tracker#: 16447 QUERY WORK FLOW TASK FOR MATERIAL QUOTE OFFER- NAVIGATION ISSUE
   			//Opening up the corrosponding tabs on the drilldown
   			//Tracker#: 17787 QUERY BUILDER DOES NOT WORK FOR MATERIAL QUOTE VIEW
   			//added the docId 155 for material quote
   		    //Tracker#: 18635 F13 WFT FOR CAPACITY PROJECTIONS
   		    //added the docId 6800 for capacity projections
   		    //Tracker#: 18920 F8 WFT FOR CAPACITY
   		    //added the docId 7300 for capacity

   			if(docId == 160 ||docId == 5800 || docId == 155 || docId == 6800 || docId == 7300) // 160 : material quote offer, 5800 : material projections (MM)
   			{
   				expandActiveTab('mmgmt');
   				restoreId = 1;
   			}
   			//Tracker#23144 - For navigation to opening up the corrosponding tab
   			else if(docId == 212)
   			{
   				expandActiveTab('vendormgmt');
   				getrestoreId(212);
   			}
   			else if(docId == 321)
   			{
   				expandActiveTab('order');
   				getrestoreId(321);
   			}
   			else 
   			{
   				expandActiveTab('dcenter');
   			}
   			
   			//pna('cdiv', menuId+suffixNav, restoreId, 'left');
   		}

   		//Tracker#21084 - Moved the commented codes to refreshWorkAreaForQuery() as navigation changes should happen after getting the response
   		/*var backToListImage = getElemnt("searchListImage"+menuId);
   		//Tracker#: 16447 QUERY WORK FLOW TASK FOR MATERIAL QUOTE OFFER- NAVIGATION ISSUE
   		//Added a check for the backToListImage exists or not
   		if(backToListImage)
   		{
	   		backToListImage.style.visibility = "visible";
	   		backToSearchList = backToListImage.onclick;
	   		backToListImage.onclick = function(){return backToQueryList(menuId,restoreId);}
	   		backToListImage.title = "Back to Query List";
	   	}*/

   		var ajaxReq = new AJAXRequest(url, refreshWorkAreaForQuery, params + "&V2009UI=Y", true);
   		waitWindow();
   		ajaxReq.send();
   }
   else
   {
   		window.location.href = url + params;
   }
}

//Tracker#23144 - To get the reStoreId for new PLM screens
function getrestoreId(docId)
{
	var navObj = null;
	
	if(docId == 212)
	{
		navObj = getElemnt("nav290_navigatorCenterCol_tabcontainer");
	}
	if(docId == 321)
	{
		navObj = getElemnt("nav420_navigatorCenterCol_tabcontainer");
	}
	
	if(navObj != null)
	{
		//name looks like nav1_navigatorCenterCol_tabcontainer
		//Tracker#23201 - Accessing the object name by using getAttribute("name")
		var element = navObj.getAttribute("name");
		if(element != null)
		{
			//splits the value by underscore and get the last character from the first string. It returns 1
			restoreId = element.split('_')[0].slice(-1);
		}
	}
}
//Tracker#: 16104 MATERIAL PROJECTIONS LEFT NAVIGATION: THE "SHOW SEARCH LIST" ICON IS MISSING
//Changing the id of the searchlist image
//Tracker#: 16447 QUERY WORK FLOW TASK FOR MATERIAL QUOTE OFFER- NAVIGATION ISSUE
//Passing the parameter restoreId so as depending on the tab the restoreArea is called
function backToQueryList(menuId,restoreId)
{
	// added to fix the scrolling problem
	//alert("colFreezeEnabled"+colFreezeEnabled);
	getElemnt('_divWorkAreaContainer').style.overflow = "auto";
	waitWindow();
	fetchQueryResults('queryviewer.do?method=list&queryid=' + queryId + reqFltrParams);
	// re-setting the 'back to list' image properties
	var backToListImage = getElemnt("searchListImage"+menuId);
	//Tracker#: 16447 QUERY WORK FLOW TASK FOR MATERIAL QUOTE OFFER- NAVIGATION ISSUE
   	//Added a check for the backToListImage exists or not
	if(backToListImage)
   	{
	   	backToListImage.onclick = backToSearchList;
	   	backToListImage.style.visibility = "hidden";
        backToListImage.style.display = "none";
	   	backToListImage.title = "Show Search List";
	}
   	// repaint the left nav
   	restoreArea(restoreId);
}

// crude way - just to make 'back to query list' work
// this logic might change once we implement the design change for
// drill down feature

// In order to remove the hard codings may be we can make use of the logic like [(drillDownId / 100) * 100] to get the menu id
// if we are using menu ids consistently.
function getMenuIdForDrillDown(drillDownId)
{
	menuId = "";
	/*
	// new logic to remove hard codings - can be used once we restrict the drill down ids from column properties popup 
	if(drillDownId == 132 || drillDownId == 4000) // tech spec or samples
	{
		menuId = "132";
	}
	else
	{
		var tmpId = drillDownId / 100;	
		tmpId = Math.floor(tmpId);
		menuId = tmpId * 100;
	}*/
	
	if(drillDownId == 2904) // color overview
	{
		menuId = "2900";
	}
	else if(drillDownId == 3300) // material overview
	{
		menuId = "3300";
	}
	else if(drillDownId == 3503) // color palette overview
	{
		menuId = "3500";
	}
	else if(drillDownId == 132 || drillDownId == 4000) // tech spec or samples
	{
		menuId = "130";
	}
	else if(drillDownId == 4200) // art work library
	{
		menuId = "4200";
	}
	else if(drillDownId == 3400) // lab dip or submits
	{
		menuId = "3400";
	} 
	//Tracker#: 16447 QUERY WORK FLOW TASK FOR MATERIAL QUOTE OFFER- NAVIGATION ISSUE
	//adding the ids for the material quote and the material projection
	//Tracker#: 17787 QUERY BUILDER DOES NOT WORK FOR MATERIAL QUOTE VIEW
   	//added the docId 155 for material quote
	else if(drillDownId == 160 || drillDownId == 155) // material quote
	{
		menuId = "155";
	} 
	else if(drillDownId == 5800) // material projection
	{
		menuId = "5800";
	}
	else if (drillDownId == 2406)
	{
		menuId = "2400";
	} 
	 //Tracker#: 18635 F13 WFT FOR CAPACITY PROJECTIONS
	 //added the docId 6800 for capacity projections
	else if (drillDownId == 6800)
	{
		menuId = "6800";
	} 
	//Tracker#: 18920 F8 WFT FOR CAPACITY
   //added the docId 7300 for capacity
	else if (drillDownId == 7300)
	{
		menuId = "7300";
	} 
	//Tracker#22138 - added entry for Sample Evaluation screen
	else if (drillDownId == 4007)
	{
		menuId = "4000";
	}
	//Tracker#23144 - added entry for new Party screen
	else if (drillDownId == 212)
	{
		menuId = "212";
	}
	//Tracker#23144 - added entry for new Purchase Order screen
	else if (drillDownId == 321)
	{
		menuId = "300";
	}
	return menuId;
}

function hideShowSearchList()
{
	var searchList = getElemnt('LIST');
	hideShowQuerySection(searchList, 'LIST_SHOW_HIDE');
}

function hideShowSearchFields()
{
	var searchFieldsSection = getElemnt('QV_FLTR_OPEN');
	hideShowQuerySection(searchFieldsSection, 'FIELDS_SHOW_HIDE');
}

function hideShowQuerySection(objSection, imageId)
{
	if(objSection.style.display == 'none'){
		objSection.style.display = 'block';
		getElemnt(imageId).src = "images/down_arrow_black.gif";
	}
	else {
		objSection.style.display = 'none';
		getElemnt(imageId).src = "images/right_arrow_black.gif";
	}
}

function executeProcessByAJAXCall(act)
{
    var actTemp = act.substring(act.lastIndexOf('P'));

	if(actTemp == 'Process')
	{
	   	// for 10932
		if(arguments.length > 1)
		{
			// set the query process index (the 2nd param set from ToolBar.java)
			//document.forms[0].QueryViewerForm.processIndex.value = arguments[1];
			setval('processIndex', arguments[1]);
		}

        if(!alertSelection())
        {
       	  	var errorObj = new htmlErrors();
       	  	errorObj.addWarning("Please select a row");
       	  	objMsgDiv = new messagingDiv(errorObj);
          	return;
        }
        
        			
        //Tracker#23139 - display the message 'There are changes ...' when click on query process without saving the changes 
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
				var errorObj = new htmlErrors();
	       	  	errorObj.addConfirm('There are changes on the screen. Do you want to save changes before current action?');
	       	  	objMsgDiv = new messagingDiv(errorObj, "updateByAJAXCall('save')", "continueProcessByAJAXCall('"+act+"')");
	       	  	return;
			}
			else
			{
				continueProcessByAJAXCall(act);
			}
		}
		else
		{
			continueProcessByAJAXCall(act);
		}
	}
}

//Tracker#23139 - Continue to execute the query process
function continueProcessByAJAXCall(act)
{
	closeMsgBox();
	
	var searchChgflds = removeFieldsForThisAction(true);
	setval('chgflds', searchChgflds);
	
	var params = "&V2009UI=Y&chgflds=" + getval('chgflds');
	params = params + getSelectedRows();
	params = params + getDataParams();
	params = params + getOtherParams();
	params =  params + getOperatorParams();
	params = params + "&processIndex=" + getval('processIndex');

	var url = "queryviewer.do?method="+act;
	var ajaxReq = new AJAXRequest(url, refreshWorkAreaForQuery, params, true);
	waitWindow();
	ajaxReq.send();
}

// for column freeze
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

function resetFreezedSecondDivWidth()
{
	var topd= getElemnt("TITLE_DIV2");
	
    if(topd)
    {
    	adjustOuterDivs("TITLE_DIV2", "DATA_DIV2" , "TITLE_TABLE2");
	    
	    var isTopDiv2Obj = (topd.id == "TITLE_DIV2" ? true : false);
	
	    // Check to see if the combined width of the menu + data div 1 and data div 2 is more than the screen width
	    if(isTopDiv2Obj)
	    {
	        var firstBottomDiv1 = getElemnt("DATA_DIV1");
	        var bottomd = getElemnt("DATA_DIV2");
	        
	        if(bottomd && firstBottomDiv1)
	        {
		        var overallWidth = firstBottomDiv1.offsetWidth + bottomd.offsetWidth + nMenuWidth + nWithinaTable;
		
		        var scrollWidth = 0;
		        if (bottomd.scrollHeight > bottomd.offsetHeight)         // there is a vertical scroll consider the scroll bar too.
		        {
		            scrollWidth = nScrlbar;
		        }
		
		        if(overallWidth > nCurScrWidth)
		        {
		        	/* Issue - Firefox - Subtracting 4px from the following calculation because
		        	 * #_divWorkAreaContainer width is 4px too narrow (there is 4px white space visible right-side of it)
		        	 * otherwise a horizontal scrollbar appears in #_divWorkAreaContainer.
		        	 */
		        	var newWidth = nCurScrWidth - (nMenuWidth + nWithinaTable + firstBottomDiv1.offsetWidth + scrollWidth) -4;
		        	bottomd.style.width = newWidth+"px";
		            topd.style.width = newWidth+"px";
		        }
	        }
	    }
    }
}

function resetDataDivHeightsToMatchWorkArea()
{
    var divStyle = document.getElementById("_divDataWorkArea");
    if(!divStyle)
    {
        divStyle = document.getElementById("_divWorkAreaContainer");
    }
    var workAreaHeight = divStyle.offsetHeight;
    // ---------------------------------------------------------------------
    // Tracker#: 14074 ALIGNMENT ISSUES WHEN VIEWING QUERIES
    // Need to consider the height from the Search Section and not just the
    // data div as the offsetheight will be the relative height and not
    // absolute height
    // ---------------------------------------------------------------------
    var fltrOpen = getElemnt("QV_FLTR_OPEN");
    var fltrClose = getElemnt("FLTR_CLOSE");

    if(colFreezeEnabled)
    {
        var firstBottomDiv1 = getElemnt("DATA_DIV1");
        var secondBottomd = getElemnt("DATA_DIV2");

        if(firstBottomDiv1 && secondBottomd)
        {
	        var dataDivTop = secondBottomd.offsetTop;
	        var dataDivHeight = secondBottomd.offsetHeight;
            // 14 pixels to take care of the <BR> given
            var actualHeight = fltrOpen.offsetTop + fltrOpen.offsetHeight + 14 + (dataDivTop + dataDivHeight) + nScrlbar;

	        if((dataDivTop + dataDivHeight) < workAreaHeight) // changed for tracker # 14074
	        //if(actualHeight < workAreaHeight)
	        {	
	             secondBottomd.style.height = secondBottomd.offsetHeight + (workAreaHeight - dataDivTop - dataDivHeight) -  (fltrOpen.offsetHeight - 25) +"px";
	             firstBottomDiv1.style.height = firstBottomDiv1.offsetHeight + (workAreaHeight - dataDivTop - dataDivHeight) - (fltrOpen.offsetHeight) +"px";
                //secondBottomd.style.height = secondBottomd.offsetHeight + (workAreaHeight - actualHeight) - 25+"px";
                //firstBottomDiv1.style.height = firstBottomDiv1.offsetHeight + (workAreaHeight - actualHeight) +"px";
	        }
        }
        //Tracker#: 14130 QUERY SCROLLING ISSUES WHEN ACCESSING QUERIES FROM THE PLM DASHBOARD
        //calling the alignment of the query result to the size of the screen
        adjustDivsToScreenHeight();
    }
    else
    {
        var bottomDiv = getElemnt("DATA_DIV");

        if(bottomDiv)
        {
	        var dataDivTop = bottomDiv.offsetTop;
	        var dataDivHeight = bottomDiv.offsetHeight;
            // 14 pixels to take care of the <BR> given
            var actualHeight = fltrOpen.offsetTop + fltrOpen.offsetHeight + 14 + (dataDivTop + dataDivHeight) + nScrlbar;

            adjustDivsToScreenHeight();

	    }
        
    }
}

function resetUnFreezedDataDiv()
{

}
 
// added for dynamic validation filters - tracker # 12910 
function getNextSelForQueryViewer(sourceFld, url)
{       
   var parameters = "&chgflds="  + sourceFld.name;
   parameters = parameters + getDataParams();        
   var ajaxReq = new AJAXRequest(url, refreshDynamicFilterVals, parameters, false);
   ajaxReq.send();	
}

function refreshDynamicFilterVals(response)
{
	// AJAX response comes as follows (an example):
	//handleSelOptions("D3300_LM1_F8_3",new Array(["", "--select--"],["003","BUTTON"],["002","KNIT"],["001","WOVEN"]));
	
	// change the name of the function to localise
	response = response.replace("handleSelOptions", "handleSelOptionsForQueryViewer");
	eval(response);
}

function handleSelOptionsForQueryViewer(targetFldId, newOptions)
{
	if (targetFldId == null || targetFldId.length == 0 || typeof(targetFldId) == 'undefined')
	{
		return;
	}
	var objTargetFld = document.getElementById(targetFldId);
	
	if (objTargetFld == null || typeof(objTargetFld) == 'undefined' || 
		objTargetFld.nodeName.toLowerCase() != 'select' || objTargetFld.disabled == true)
	{
		return;
	}

	objTargetFld.options.length = 0; // remove all options
		
	for (var i = 0; i < newOptions.length; i++)
	{	
		addOption(objTargetFld,newOptions[i][1],newOptions[i][0],'');
	}
	
	// fire the onchange event to update the next sub(associated)level
	try
	{
		objTargetFld.fireEvent('onchange');
	}
	catch(e){}
}

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
	 	searchByAJAXCall('search');
	 }
}

// Tracker#: 17798 - REGRESSION ISSUE: NEW PLM QUERY VIEWER UI HAVE SOME REGRESSION ISSUES
// Removed align2TableCols function override and using re-written confunc.js version of this function.


//Tracker#: 14130 QUERY SCROLLING ISSUES WHEN ACCESSING QUERIES FROM THE PLM DASHBOARD
//this function aligns the result to the size of the screen
function adjustDivsToScreenHeight()
{
	var viewportwidth;
 	var viewportheight;
 
 	// the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
 
 	if (typeof window.innerWidth != 'undefined')
 	{
      viewportwidth = window.innerWidth,
      viewportheight = window.innerHeight
 	}
 
	// IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
 	else if (typeof document.documentElement != 'undefined'
     && typeof document.documentElement.clientWidth !=
     'undefined' && document.documentElement.clientWidth != 0)
	 {
       viewportwidth = document.documentElement.clientWidth,
       viewportheight = document.documentElement.clientHeight
 	}
  	// older versions of IE
  	else
 	{
       viewportwidth = document.getElementsByTagName('body')[0].clientWidth,
       viewportheight = document.getElementsByTagName('body')[0].clientHeight
	}

	var tssHeader = getElemnt('TSSHEADER').offsetHeight;
	var tssMenu = getElemnt('TSSMENU').offsetHeight;
	var ftlrOpen = getElemnt('FLTR_CLOSE').offsetHeight;
	var qvFltrOpen = getElemnt('QV_FLTR_OPEN').offsetHeight;
	var listHeader = getElemnt('LIST_HEADER').offsetHeight;

	
	var $dataDiv = $('#DATA_DIV'),
		$titleDiv = $('#TITLE_DIV');
	
	/*
	 * Taking into account when there are no freeze columns as well.
	 */
	// if no freeze columns
	if ($dataDiv.length > 0 && $titleDiv.length > 0)
	{
		$titleDiv.width($dataDiv.width() - nScrlbar);
		
		var remainingHeight = viewportheight - (tssHeader + tssMenu + ftlrOpen + qvFltrOpen + listHeader + $titleDiv.outerHeight() + nScrlbar);
		$dataDiv.height(remainingHeight);
	}
	else // freeze columns
	{
		var titleDiv1 = getElemnt('TITLE_DIV1').offsetHeight;
		var data1 = getElemnt('DATA_DIV1');
		var data2 = getElemnt('DATA_DIV2');
		var title2 = getElemnt('TITLE_DIV2');
		
		
		var remainingHeight = viewportheight - (tssHeader + tssMenu + ftlrOpen + qvFltrOpen + listHeader + titleDiv1 + nScrlbar);
		//Added a null check for the data2
		if(title2 && data2)
			title2.style.width = data2.offsetWidth - nScrlbar + "px";
	 	if (data2 && (data2.clientWidth < data2.scrollWidth))
	 	{
			data1.style.height = remainingHeight +"px";
			data2.style.height = remainingHeight + 15 + "px";
	 	}
	 	else
	 	{ 
	   		data1.style.height = remainingHeight + "px";
			if(data2)
				data2.style.height = remainingHeight + "px"; 
	 	} 
	 	 	
		
		var div1 = getElemnt('_divWorkAreaContainer');
		div1.style.overflowY = "hidden";
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
				scrollBarHeight = 21;
			}
		
			setHeight(data1, parseInt(data2.offsetHeight) - scrollBarHeight);
		}
	}
}
