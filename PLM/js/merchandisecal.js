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

//Tracker 14641 - PLM TECH SPEC - AUTO SELL CHANNEL BUILDER CHANGES FOR PD SEASON

//TODO methos need to be changed
function showPDSeason()
{
 	
   _startAssignPDPopup(); 
   var reqData = formData2QueryString(document.forms[0]);  
   	var ajaxReq = new AJAXRequest("merchandisecalendar.do?" ,_showAssignPDSeasonPopup, "method=showpdseason&"+reqData, true);
   	ajaxReq.send();
}


var ajaxReq;
function assignPDSeason(rowsselected)
{
	 
   var divObj = getElemnt("_smartDiv");
   //alert("divObj-->"+divObj);
   var reqData = _divData2QueryString(divObj);
   
   	ajaxReq = new AJAXRequest("merchandisecalendar.do" ,postAssignPDSeason, "method=assignpdseason&"+reqData+"&rowsselected="+rowsselected, false);
   	//alert("ajaxReq---->"+ajaxReq);
 	ajaxReq.send();
}

function postAssignPDSeason(response)
{
	_closeSmartTag();
	setval('chgflds', '');
	if(response)
	{
		_showAssignPDSeasonPopup(response);
	}
}

function closePopupMsg()
{
	_closeSmartTag();
	fsubmit('refresh');
}


function formData2QueryString(docForm)
{
    var submitContent = '';
    var formElem;
    var lastElemName = '';
    //alert("docForm.elements--->"+docForm.elements);
    
    if(docForm.elements)
    {
    	docForm = docForm.elements;
    }
       
    
	for (i = 0; i < docForm.length; i++) {

        formElem = docForm[i];
        switch (formElem.type) 
        {
		    case 'text':
		    //case 'hidden':
		    //case 'password':
		    //case 'textarea':
		    //case 'select-one':
		    submitContent += formElem.name + '=' + escape(formElem.value) + '&'
		    break;
		    // Checkboxes
		    case 'checkbox':
		    if (formElem.checked) 
		    {
			    // Continuing multiple, same-name checkboxes
			    if (formElem.name == lastElemName) 
			    {
			    	// Strip of end ampersand if there is one
			    	if (submitContent.lastIndexOf('&') == submitContent.length-1) 
			    	{
			    		submitContent = submitContent.substr(0, submitContent.length - 1);
			    	}
			    	// Append value as comma-delimited string
			    	submitContent += ',' + escape(formElem.value);
			    }
			    else 
			    {
			    	submitContent += formElem.name + '=' + escape(formElem.value);
			    }
			    submitContent += '&';
			    lastElemName = formElem.name;
		    }
		    break;
    }
    }
    // Remove trailing separator
    submitContent = submitContent.substr(0, submitContent.length - 1);
    return submitContent;
}

function _divData2QueryString(divObj)
{
		var submitContent = "";
		
		if(divObj)
		{
			//alert(divObj.outerHTML)
			var arr = divObj.getElementsByTagName("INPUT");
	    	//alert("lenght-->"+arr.length);
	    	if(arr && arr.length>0)
	    	{
	    		submitContent += formData2QueryString(arr);
	    	}
	    	
	    	arr = divObj.getElementsByTagName("SELECT");
	    	
	    	if(arr && arr.length>0)
	    	{
	    		submitContent += formData2QueryString(arr);
	    	}
	    	
	    	arr = divObj.getElementsByTagName("TEXTAREA");
	    	
	    	if(arr && arr.length>0)
	    	{
	    		submitContent += formData2QueryString(arr);
	    	}
	    	
	    	///alert("submitContent "+ submitContent);
    	}
    	return submitContent;
}

function _startAssignPDPopup()
{
	//alert("_startAssignPDPopup");
	var divObj = getElemnt("_smartDiv");
	//alert("_startAssignPDPopup - divObj -->"+divObj);
	if(!divObj)
	{
		//alert("creating new");
		divObj = _createHTMLDiv("_smartDiv");
	}
    if(divObj)
    {
        
        setLeft(divObj, "300px");
        setTop(divObj, "300px");
    }
    return divObj;
}

function _showAssignPDSeasonPopup(response)
{
    //alert("_showAssignPDSeasonPopup");
    var divObj = _startAssignPDPopup();	//getElemnt("_smartDiv");
    //alert("divObj " +divObj);
    if(divObj)
    {
        var divSmt;
        var divPopup;
        //var htmlObj = getElemnt(htmlfldName);
		
		setLeft(divObj, "300px");
        setTop(divObj, "300px");
        
        //alert("Response---->"+response);
        divObj.innerHTML=response;
		divObj.style.background = "#E4EAEE";
        divObj.style.position ="";

        var str = divObj.outerHTML;
        
        //alert("str---->"+str);
        _removeHTMLDiv(divObj);
                
        //alert("dfad");
        
        var popupdivObj = getElemnt("_popupDIV");
        
        if(popupdivObj)
        {
        	_removeHTMLDiv(popupdivObj);
        	popupdivObj = getElemnt("_popupDIV");
       	}
        
        //alert("popupdivObj " + popupdivObj);
        
        if(!popupdivObj)
        {
        	//alert("craeting popudiv");
        	divPopup = new DOMWindow( str, "_popupDIV", "10pt", "#006699", "#FFFFFF");        	
        	eval('document.forms[0].appendChild(divPopup)');
        	//eval('document.body.appendChild(divPopup)');        	
        	divPopup.style.zIndex = 901;        	
        	divPopup.style.position ="absolute";        	
        	setLeft(divPopup, "300px");
        	setTop(divPopup, "300px");
        }
        
        
        if(divPopup)
        {
        	divPopup.style.visibility = "visible";
        	divPopup.focus();
            divSmt = divPopup;
        }
        
        
        if(divObj)
        {
           divSmt = divObj;
        }
        return divSmt;
    }
}


function searchSeason(act)
{
	//alert("inside searchSeason");
	setval(act)
	eval('document.'+FRM+'.submit()');
}
