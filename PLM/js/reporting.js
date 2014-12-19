
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
	**
	APIs managing the Report screen n.
	@author Vittal Kambagi 
*/

// To open up the PLM report window.
function generateReportForSelectedSize(id, name, dropDownID)
{ 	
	var assocList = '';
	var formElem;
	var noOfAssocs = '';
	
	//Tracker#:22591 IMPLEMENT NEW TECH PACK REPORT
	//To carry the selected 'assocs'/'image per page' to server side implementation
	if(id==1321)
	{
		var collection = document.getElementById("RPRSELPOPUP").getElementsByTagName('INPUT');
    	var curchkbox;
		for (var x=0; x<collection.length; x++) 
   		{
   			curchkbox = collection[x];
	        if (curchkbox.type.toUpperCase()=='CHECKBOX')
	        {	        	
	        	if (curchkbox.checked)
				{						
	        		 assocList += curchkbox.name + '=' + escape(curchkbox.value);
		             assocList += '&';	  
				}
	        }
    	}
    	
    	var collection = document.getElementById("RPRSELPOPUP").getElementsByTagName('SELECT');
    	var selectbox;
    	
		for (var x=0; x<collection.length; x++) 
   		{
   			selectbox = collection[x];
	    	if (selectbox.type == 'select-one')
	      	{
	      		var selectedIndex = selectbox[selectbox.selectedIndex].value;
	      	  	noOfAssocs += escape(selectbox.id) + '=' + selectedIndex;
	      	  	noOfAssocs += ',';	
	      	}
   		}
	}
	
	var selObj = getElemnt(dropDownID); 
	var selectedIndex = selObj[selObj.selectedIndex].value;
	var str = 'report.do?id=' + id + '&reportname=' + name + '&pageSize=' + selectedIndex+"&"+assocList +"&noOfAssocs="+noOfAssocs;	
    oW('report', str, 800, 650);
}

//Tracker#:22591 IMPLEMENT NEW TECH PACK REPORT
//Called on click of new process 'TECH PACK REPORT' 
function openTechPackReportPopup(id , name)
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	
	var actMethod ="techpackreportpopup";
    if(objAjax)
    {        
        var htmlfldName = htmlAreaObj.getDivSectionId();
    	_startSmartTagPopup(htmlfldName, false, null, true);        
        objAjax.setActionURL('report.do?id=' + id +'&reportname='+ name +'&method='+actMethod);
        objAjax.attribute().setAttribute("htmlfldName", htmlfldName);
        objAjax.setProcessHandler(_showSmartTagInteractivePopup);
        objAjax.sendRequest();
    }	
}

//Tracker#:21461 Added invalid record check 
//& Save confirm message if there are changes on the screen
// To open up the pop up for report size input from the user report window.
function OpenPopUpForReportSize(id , name)
{ 	
	var htmlAreaObj = _getWorkAreaDefaultObj();
	
	if(htmlAreaObj)
	{
		if(!isValidRecord(true))
		{
			return;
		}	
		
	    var objHTMLData = htmlAreaObj.getHTMLDataObj();
	   	var objAjax = htmlAreaObj.getHTMLAjax();
	    var docviewid = htmlAreaObj.getDocViewId();	   
	    var saveFunc = _getSaveFunc();
	    
	    //alert("saveFunc"+saveFunc);
		if(saveFunc != "0" && objHTMLData!=null 
			&& objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
	    {
	        var htmlErrors = objAjax.error();
	        htmlErrors.addError("confirmInfo", szMsg_Changes,  false);	        
	       	var saveHdlr = _getScreenSaveHandler();
	        messagingDiv(htmlErrors, saveHdlr , "continueOpenPopUpForReportSize("+id+",'"+name+"')");
	    }
	    else
	    {    	
	        continueOpenPopUpForReportSize(id, name);
	    }
	}
	else
    {    	
        continueOpenPopUpForReportSize(id, name);
    }
}

//Tracker#:21461 Added invalid record check 
//Split the OpenPopUpForReportSize() and added this new function to
//continue OpenPopUpForReportSize after canceling save confirm message.
function continueOpenPopUpForReportSize(id, name)
{
	cancelProcess();
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	
	var actMethod ="reportpopup";
    if(objAjax)
    {        
        var htmlfldName = htmlAreaObj.getDivSectionId();
    	_startSmartTagPopup(htmlfldName, false, null, true);        
        objAjax.setActionURL('report.do?id=' + id +'&reportname='+ name +'&method='+actMethod);
        objAjax.attribute().setAttribute("htmlfldName", htmlfldName);
        objAjax.setProcessHandler(_showSmartTagInteractivePopup);
        objAjax.sendRequest();
    }
}   
	
// To open up the PLM report window.
function generateReport(id, name)
{ 	
	//Tracker#:20812 Added invalid record check 
	//& Save confirm message if the changes on the screen are changed
	var htmlAreaObj = _getWorkAreaDefaultObj();
	//alert("htmlAreaObj -"+htmlAreaObj);
	if(htmlAreaObj)
	{		
		if(!isValidRecord(true))
		{
			return;
		}	
		
		var objHTMLData = htmlAreaObj.getHTMLDataObj();
	   	var objAjax = htmlAreaObj.getHTMLAjax();
	    var docviewid = htmlAreaObj.getDocViewId();	   
	    var saveFunc = _getSaveFunc();
	    
	    //alert("saveFunc"+saveFunc);
		if(saveFunc != "0" && objHTMLData!=null && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
	    {
	        var htmlErrors = objAjax.error();
	        htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
	        
	       	var saveHdlr = _getScreenSaveHandler();
	        messagingDiv(htmlErrors, saveHdlr , "continueReportPrint("+id+",'"+name+"')");
	    }
	    else
	    {    	
	        continueReportPrint(id, name);
	    }
	}
	else
	{
		continueReportPrint(id, name);
	}
    
}

//Tracker#:20812 Spliting the generate report method to add save confirm message if change fields exist.
function continueReportPrint(id, name)
{
	cancelProcess();
	var str = 'report.do?id=' + id + '&reportname=' + name;
    oW('report', str, 800, 650);
}

//TO open report for the selected Body and Detail rows
//Tracker#19941: TALBOTS COST SHEET REPORT.
function generateReportForLevel(id, name, szLevel)
{ 	
	if (!bRecordExists)
	{
  	alert(szMsg_Invalid_Rec);    // not a valid records
  	return;
	}
	var nChecked = 0;
	var checked = 0;
	var level = 0;
	var selectedRowCount = 0;
	var selectedRowsIndexes = '&rows=';
  var obj = getobj('R');
 
  if(szLevel.indexOf('B') != -1)
  {
  	level = 1;
  }
  else if(szLevel.indexOf('D') != -1)
  {
  	level = 2;
  }
  
  if (obj)
  {
  	 // only one check box
      if ((typeof obj.length) == 'undefined')
      {
         	if (obj.checked == true)
          {
         		if(nLastValidDtl == -1)
         		{
         			alert(szMsg_Invalid_Dtl_Rec);
         			return;
         		}
         		nChecked = 1;
           }
      }
      else
      {
      	for (i=0; i < obj.length; i++)
          {
               if (obj[i].checked == true)
               {
                   if (i > nLastValidDtl)
                   {
                       alert(szMsg_Invalid_Dtl_Rec);
                       return;
                   }
                   if (contains(brn, i))
                   {
                       alert(szMsg_Blank_Dtl_Rec);
                       return;
                   }

                   nChecked++;
               }
           } 
      }
  }
 	if (nChecked == 0)
   {
       if (szLevel == 'DS' || szLevel == 'BS' || szLevel == 'SS')
       {
           alert(szMsg_Sel_Row);         // nothing is selected for one row
       }
       else if (szLevel == 'DM' || szLevel == 'BM' || szLevel == 'SM')
       {
           alert(szMsg_Sel_M_Row);     // nothing is selected for multiple rows
       }
   }
   else if (nChecked > 1 && (szLevel == 'DS' ||
                             szLevel == 'BS' ||
                             szLevel == 'SS' ||
                             szLevel == 'HBS' ||
                             szLevel == 'HDS' ||
                             szLevel == 'HSS' ||
                             szLevel == 'BSDS' ||
                             szLevel == 'BSSS' ||
                             szLevel == 'DSSS' ||
                             szLevel == 'HBSDS' ||
                             szLevel == 'HBSSS' ||
                             szLevel == 'BSDSSS' ||
                             szLevel == 'HBSDSSS'
                             )
           )  // more than one row selected
   {
       alert(szMsg_Sel_A_Row);
   }	
   else
   {
      	if(!isValidRecord("URL", "N")) return;
      	var bDisp = true;
      	if (getval('chgflds') != "")
      	{
      		if (confirm(szMsg_Changes))
      		{
      			fsubmit(szSAVE);
      			bDisp = false;
      		}
      	}
      	if (obj) 
      	{
  			// only one check box
  			if ((typeof obj.length) == 'undefined') 
  			{
  				if (obj.checked == true) {
  					selectedRowsIndexes += obj.value;
  					selectedRowCount = 1;
  				}
  			}
  			else // multiple check boxes
  			{
  				for (i = 0; i < obj.length; i++)
  				{
  					if (obj[i].checked == true)
  					{
  						if (selectedRowCount >= 1)
  							selectedRowsIndexes += ',';
  						selectedRowsIndexes += obj[i].value;
  						selectedRowCount++;
  					}
  				}
  			}
  		}
      	if (bDisp)
      	{
      		var str = 'report.do?id=' + id + '&reportname=' + name + '&level=' + level + '&reportname=' + name + selectedRowsIndexes;
      		oW('report', str, 800, 650);
      	}
	}

}
