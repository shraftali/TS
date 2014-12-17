/*************************************/
/*  Copyright  (C)  2002 - 2012      */
/*           by                      */
/*  TradeStone Software, Inc.        */
/*  Gloucester, MA. 01930            */
/*  All Rights Reserved              */
/*  Printed in U.S.A.                */
/*  Confidential, Unpublished        */
/*  Property of                      */
/*  TradeStone Software, Inc.        */
/*************************************/

//Loads the Buying week Search screen
function _loadBuyingWeekWorkArea(url, actionMethod, divSaveContainerName, processHandler)
{
	loadWorkArea(url,actionMethod,"",loadNavigationGrid);
}

//Execution of Buying week report
function _callBuyingWeekReport()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
    var changeFields = objHTMLData.getChangeFields();
    var objAjax = htmlAreaObj.getHTMLAjax();
    bShowMsg = true;
    //when user doesn't enter anything and clicks on the report button for the
    //first time this check is done
    if(objHTMLData.hasUserModifiedData()==false)
    {
        var htmlErrors = objAjax.error();
        objAjax.error().addError("errorInfo", 'Must enter values for: Season', true);
        messagingDiv(htmlErrors);
        return;
    }
	var url = 'buyingweekreport';// report action method name
	
	objAjax.setActionMethod(url);
	objAjax.setActionURL('buyingweek.do');
	objAjax.setProcessHandler(_loadBuyingWeekReport);
	objHTMLData.performSaveChanges(_loadBuyingWeekReport, objAjax);
}

function _loadBuyingWeekReport(objAjax)
{
	if(objAjax.isProcessComplete())
	{
		var htmlAreaObj = _getWorkAreaDefaultObj();
		var objHTMLData = htmlAreaObj.getHTMLDataObj();
        
        var id='180';
    	var name='buyingweekreport';
    	var str = 'report?id=' + id + '&reportname=' + name +'&method='+name+'&requestFrom=PLM';
    	oW('report', str, 800, 650);
		
	}
	else if(!objAjax.isProcessComplete())
	{
		_displayProcessMessage(objAjax);
	}
}


//Excel 'Export' from the Buying Week Screen.
var mFileDownloadIFrame;

function _callBuyingWeekExport()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
    var changeFields = objHTMLData.getChangeFields();
    var objAjax = htmlAreaObj.getHTMLAjax();
    bShowMsg = true;
    //when user doesn't enter anything and clicks on the report button for the
    //first time this check is done

    if(objHTMLData.hasUserModifiedData()==false)
    {
        var htmlErrors = objAjax.error();
        objAjax.error().addError("errorInfo", 'Must enter values for: Season', true);
        messagingDiv(htmlErrors);
        return;
    }

	//get all the components by their id and the values entered by the user
	//to send it to server side
	waitWindow();
    var names = new Array();
    var values = new Array();
    $("#_divWorkArea input[type=text],#_divWorkArea input[type=hidden],#_divWorkArea select").each(function(index) {
        names[index] = this.name;
        values[index] = $(this).val();
    });
    
	var formPostParams = "";
	for(var i=0;i < names.length;++i) {
		formPostParams += (names[i] + "=" + encodeURIComponent(values[i]) + "&"); 
	}

	if (mFileDownloadIFrame) mFileDownloadIFrame.parentNode.removeChild(mFileDownloadIFrame);
	mFileDownloadIFrame = document.createElement("iframe");
	mFileDownloadIFrame.id="xslxFrame";
	mFileDownloadIFrame.src = "buyingweek.do?method=buyingweekexport&chgflds=" + encodeURIComponent(changeFields) + "&" + formPostParams;
	mFileDownloadIFrame.style.display = "none";
	document.body.appendChild(mFileDownloadIFrame);
	
	//this is for non IE browsers to close the wait window
	// and display the error thrown from the server side
	mFileDownloadIFrame.onload=function(){
		closewaitWindow();
		handleErrors();
	}
	
	//closing wait window on IE browser and displaying error passed on from server side
	if (mFileDownloadIFrame.addEventListener) { 
                mFileDownloadIFrame.addEventListener('onreadystatechange', handleStateChange,
								false); 
            }else if (mFileDownloadIFrame.attachEvent) { 
                mFileDownloadIFrame.attachEvent ('onreadystatechange',handleStateChange);

            }
            
	if(!objAjax.isProcessComplete())
	{
		_displayProcessMessage(objAjax);
	}            
     
}

function handleStateChange()
{ 
            //alert("Changed"); 
            switch(document.getElementById('xslxFrame').readyState)
            { 
                case "complete": 
                   closewaitWindow();
                   handleErrors;
                    break; 
            }
}

function handleErrors()
{
                //On error or failure the error message is displayed.
         		if($(mFileDownloadIFrame).contents().text().length>0)
         		{
         			TempMsg=$(mFileDownloadIFrame).contents().text();

	           		var errObj = new htmlErrors();
					if(errObj)
					{
						errObj.addError('errorInfo',TempMsg,true);
						new messagingDiv(errObj);
		    		}

         		}
}

//reset the input entered by the user on buying week serarch screen
function _clearBuyingScreen(docViewId)
{
	var search = new advancedSearch(docViewId);
	if(search)
	{
		search.clearFields(docViewId);
	}
}