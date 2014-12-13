/*************************************/
/*  Copyright  (C)  2002 - 2010      */
/*           by                      */
/*  TradeStone Software, Inc.        */
/*  Gloucester, MA. 01930            */
/*  All Rights Reserved              */
/*  Printed in U.S.A.                */
/*  Confidential, Unpublished        */
/*  Property of                      */
/*  TradeStone Software, Inc.        */
/*************************************/

// ----------------------------------
// ----------------------------------
// For Edit And Replace File/Image
// ----------------------------------
// ----------------------------------

var noEditReplace = "Sorry... edit is not supported"
var editReplaceSuccess = "Replaced file successfully"
var editReplaceFailure = "Error Editing/Replacing file"
var fileEditActiveXDiv;

function editFile(fileName, dirName, params,componentinfo)
{  	 
	var oldActiveXDiv = document.getElementById("FILE_EDITOR_ID");         
	var oldMultiPartDiv = document.getElementById("MULTI_PART_DIV");   
        
	if(oldActiveXDiv != null && oldMultiPartDiv != null) // if already opened for edit
	{
		displayFileEditErrorMessage("The file is already opened for edit !!!", false);
		return;
	}    


	if(typeof (fileEditReplacePLM) != 'undefined') // PLM screens
	{
		var refreshURL = getElemnt("fileEditRefreshURL"); // action path (techspec.do, fitevalplm.do etc.)

		if(!refreshURL) // if action path is not set, show error - this is the way to disable the file edit feature
		{	
			displayFileEditErrorMessage(noEditReplace, false);
			return;
		}
	}

	if (IE)
	{  
		fileEditActiveXDiv = loadFileEditActiveX();
	}
	else
	{
		if (!fileEditActiveXDiv)
		{
			fileEditActiveXDiv = loadFileEditApplet(fileName);
		}
	}	
	if (IE)
	{
		var tmpfilename;
		var req = getAJAXRequestObject();
		if (req)
		{
			if (fileName.lastIndexOf("?") != -1)
			{
				fileName=fileName.substring(0,fileName.lastIndexOf("?"));
			}
	    	var index = fileName.lastIndexOf('/');
	    	var before = fileName.substring(0,index);
	    	var after = fileName.substring(index + 1);
	        req.open("POST", "fileedit.do?act=new&method=retrievefile&fileName="+before+"/"+encodeURIComponent(encodeURIComponent(after)), true);

			req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			req.setRequestHeader("AjaxRequest", "true");       
			req.onreadystatechange = function()
			{
				if(req.readyState == 4)
				{
					if (fileEditor && (req.status == 200))
					{ 
              
						// Invoke SessionManagement.resetSessionTime() to reset session counter.
						SessionManagement.resetSessionTime();

						if(isSessionExpired(req))
						{
							var fileEditActiveXDiv = document.getElementById("FILE_EDITOR_ID");
							document.body.removeChild(fileEditActiveXDiv);
							return;
						}

						if(req.responseBody != null || req.responseBody != undefined)
						{                	
							fileName = fileName.substring(fileName.lastIndexOf("/") + 1);                  	
							var extension = fileName.substring(fileName.lastIndexOf("."));
							// save the file to client and open               	
							tmpfilename=getTempfilename(15) + extension;
							var result;	
							if (typeof (fileEditor.saveFileToClient) !=='undefined')
							{
							result = fileEditor.saveFileToClient(fileName, dirName, req.responseBody,tmpfilename);
							}
						
							req=null;
							if(!result) // if not able to save to local machine
							{	
								var fileEditActiveXDiv = document.getElementById("FILE_EDITOR_ID");
								document.body.removeChild(fileEditActiveXDiv);
								return;
							}
							// create the div to show 'Replace' and 'Cancel' buttons
							createDivForMultiPart(fileName, params,tmpfilename,componentinfo);               	
						}
						else
						{
							var errorMessage = req.getResponseHeader("errors.detail");

							if(errorMessage)
							{
								displayFileEditErrorMessage(errorMessage, true)
							}
							else
							{
								displayFileEditErrorMessage("Encountered problem while fetching the file/image from server.", true);
							}
							var fileEditActiveXDiv = document.getElementById("FILE_EDITOR_ID");
							document.body.removeChild(fileEditActiveXDiv);
						}
					}
				}
			}
			req.send(params);
		}
	}
	else
	{
		if (fileName.lastIndexOf("?") != -1)
		{
			fileName=fileName.substring(0,fileName.lastIndexOf("?"));
		}
		result = fileEditor.saveFileToClient(fileName);
		if (result)
		{
			createDivForMultiPart(result, params,'',componentinfo);
		}
	}
}


function loadFileEditActiveX()
{	
	var ie64bit = false;
	if (navigator.userAgent.indexOf("x64") !=-1)
	{
		ie64bit=true;
	}
	 // for loading the AcxtiveX only when we select 'Click to Edit and Replace'
	 var fileEditActiveXDiv = document.createElement("div");
	 fileEditActiveXDiv.setAttribute("id", "FILE_EDITOR_ID");
	 //fileEditActiveXDiv.style.display = 'block'; 
	 fileEditActiveXDiv.style.display = 'none';	 	  
	 if (ie64bit==true)
	 {
		 fileEditActiveXDiv.innerHTML = "<OBJECT ID='fileEditor' CLASSID='CLSID:859B2961-47C1-4C8E-B424-0FCB1C2C5353' CODEBASE='ImageEditor64.CAB'></OBJECT>"
	 }
	 else
	 {
		 fileEditActiveXDiv.innerHTML = "<OBJECT ID='fileEditor' CLASSID='CLSID:7f775de4-9758-4b69-b6a8-309c01e2ae06' CODEBASE='ImageEditor32.CAB'></OBJECT>"	 
	 }
     document.body.appendChild(fileEditActiveXDiv);
	 return fileEditActiveXDiv;
} 

function loadFileEditApplet(fileName)
{	
	 var fileEditAppletDiv = document.createElement("div");
	 fileEditAppletDiv.setAttribute("id", "FILE_EDITOR_ID");
	 //fileEditAppletDiv.style.display = 'none';	 
	 //fileEditAppletDiv.innerHTML = "<applet id='fileEditor' code='com.tradestonesoftware.imageeditor.ImageEditor.class' archive='commons-logging-1.0.4.jar,ImageEditor.jar,commons-codec-1.4.jar,httpclient-4.2.2.jar,httpcore-4.2.2.jar,httpmime-4.2.2.jar' width='0' height='0'><PARAM name='filename' value=\'" + fileName + "\'></PARAM></applet>";
	 fileEditAppletDiv.innerHTML = "<OBJECT id='fileEditor' type='application/x-java-applet;version=1.6.0' classid='java:com.tradestonesoftware.imageeditor.ImageEditor.class' code='com.tradestonesoftware.imageeditor.ImageEditor.class' archive='lib/commons-logging-1.0.4.jar,ImageEditor.jar,lib/httpclient-4.2.2.jar,lib/httpcore-4.2.2.jar,lib/httpmime-4.2.2.jar,lib/log4j-1.2.16.jar' width='0' height='0'><PARAM name='filename' value=\'" + fileName + "\'></PARAM><PARAM name='codebase' value='applet'></PARAM></OBJECT>";
	 document.body.appendChild(fileEditAppletDiv);
	 return fileEditAppletDiv;
} 

function getAJAXRequestObject()
{
    var req = "";
    
    if (window.XMLHttpRequest)
    {
        req = new window.XMLHttpRequest();
    }
    else if (window.ActiveXObject)
    {
        req = new ActiveXObject("Microsoft.XMLHTTP");
    }
    
    return req;
}


function createDivForMultiPart(fileName, params,tmpfilename,componentinfo)
{	
	var multiPartDiv = document.createElement("div");
	var divId = "MULTI_PART_DIV";
	multiPartDiv.setAttribute('id', divId);
	
	var tmpHTML = "<br>";
		
	for(var j = 0; j < 4; j++)
	{
		tmpHTML = tmpHTML + "<img src='images/wait26.gif'><img src='images/wait26.gif'>"
	}
	
	tmpHTML = tmpHTML + "<br><br>&nbsp;&nbsp;<input type=\"button\" style=\"width:80px\" value=\"Replace File\"  onclick=\"invokeFileReplaceProcess('" + fileName + "','','"+tmpfilename+"','"+componentinfo+"')\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type=\"button\" style=\"width:80px\" value=\"Cancel\"  onclick=\"invokeCancelFileReplaceProcess('" + tmpfilename + "')\">"
			
	multiPartDiv.innerHTML = tmpHTML
	document.body.appendChild(multiPartDiv);
	adjustFileEditDivPosition(divId);
		
}

function isSessionExpired(ajaxReqObj)
{	
	if(ajaxReqObj.getResponseHeader("issessionexpired") == "1")
    {
    	displayFileEditErrorMessage(ajaxReqObj.getResponseHeader("issessionexpiredmsg"), false)     
        window.location.href="logout.do";
        return true;    
    }
    
	return false;
}

function invokeCancelFileReplaceProcess(tmpfilename)
{
	if(IE)
	{
		fileEditor.deleteTempfile(tmpfilename);
		var fileEditActiveXDiv = document.getElementById("FILE_EDITOR_ID");
		document.body.removeChild(fileEditActiveXDiv);
	}
	document.body.removeChild(document.getElementById("MULTI_PART_DIV"));
}

function invokeFileReplaceProcess(fileName, params,tmpfilename,componentinfo)
{	
	if(arguments.length > 0)
	{
		//fileEditor.uploadEditedFile("http://localhost:8087/v2010base/upload.do?act=upload&editreplace=Y", fileName, "file1");
		var windowurl;
		var uploaded = true;
		var targetwindow;
		if (IE)
		{
			windowurl = 'images/pixel.gif?id=imageditor';
			targetwindow = window.open(windowurl,'_new', 'height=1,width=1,location=no,left=0,menubar=no,resizable=no,scrollbars=no,status=no,titlebar=no,toolbar=no,top=0');
			if (targetwindow)
			{
				targetwindow.resizeTo(1,1);
			}
		}
		if (IE)
			{
		try
		{			
				uploaded = fileEditor.uploadEditedFile(buildUploadURL(componentinfo), fileName, "file1",targetwindow.location,tmpfilename);
		}
		catch(e)
		{
			alert(e.message);
		}
			}
		else
		{
			uploaded = fileEditor.uploadEditedFile(buildUploadURL(componentinfo), fileName, "file1",windowurl);
		}
		if (targetwindow)
		{
			targetwindow.close();
		}

		if (IE)
		{
			// destroy the activeX object
			var fileEditActiveXDiv = document.getElementById("FILE_EDITOR_ID");
			document.body.removeChild(fileEditActiveXDiv);
		}
		document.body.removeChild(document.getElementById("MULTI_PART_DIV"));
        if (typeof(refreshWorkArea) != 'undefined')
        {
        	refreshWorkArea();
			var errorObj = new htmlErrors();
			if (uploaded)
			{
			errorObj.addSuccess(editReplaceSuccess);
			}
			else
			{
				displayFileEditErrorMessage(editReplaceFailure,true);
			}
			objMsgDiv = new messagingDiv(errorObj);
        }
		else if(typeof (fileEditReplacePLM) == 'undefined') // older flow
		{
			fsubmit('refresh');
		}
		else // for PLM
		{	
			var refershURL = getElemnt("fileEditRefreshURL");
			if(refershURL)
			{	
			    loadWorkArea(refershURL.value, "view");
				if (uploaded && fileName)
				{
					fileName = fileName.replace(/\\/g,"/");
					var fname = fileName.substring(fileName.lastIndexOf("/") +1);
					fname=decodeURIComponent(fname);
					fname=encodeURIComponent(fname);
					// if the file is an AI file, then need to replace extension with jpg
					fname=fname.replace(/\.ai/i,".jpg");
					fname=fname.toLowerCase();
					var i;
					for (i=0; i<document.images.length;i++)
					{
						var imgsrc=document.images[i].src;
						if (imgsrc.indexOf("?") != -1)	
						{
							imgsrc=imgsrc.substring(0,imgsrc.indexOf('?'));
						}
						if ((encodeURIComponent(decodeURIComponent(imgsrc))).toLowerCase().endsWith(fname))
						{
							var now = new Date().getTime();
							var nowstr = now.toString();
							nowstr=nowstr.substring(nowstr.length - 6);
							imgsrc=imgsrc+"?ts=" + nowstr;
							document.images[i].src=imgsrc;
						}
					}
					
				}
				var errorObj = new htmlErrors();
				if (uploaded)
				{
				errorObj.addSuccess(editReplaceSuccess);
				}
				else
				{
					displayFileEditErrorMessage(editReplaceFailure,true);
				}
				objMsgDiv = new messagingDiv(errorObj);
			}
			else
			{
					var errorObj = new htmlErrors();
					errorObj.addWarning(noEditReplace);
					objMsgDiv = new messagingDiv(errorObj);
				}
			}
	}
	else
	{
		if(IE)
		{
			var fileEditActiveXDiv = document.getElementById("FILE_EDITOR_ID");
			document.body.removeChild(fileEditActiveXDiv);
		}
		document.body.removeChild(document.getElementById("MULTI_PART_DIV"));
	}
}

function buildUploadURL(componentinfo)
{
 	var protocol = window.location.protocol;
 	var host = window.location.host;
 	var pathName = window.location.pathname;
	pathName = pathName.replace("/", "");
	pathName = pathName.substring(0, pathName.indexOf("/") + 1);  // context path
	if (IE)
	{
		return protocol + "//" + host + "/" + pathName + "upload.do?act=upload&editreplace=Y&componentinfo=" + componentinfo;
	}
	else
	{
		return protocol + "//" + host + "/" + pathName + "upload.do?act=multi&editreplace=Y&componentinfo=" + componentinfo;
	}
}

function adjustFileEditDivPosition(id)
{
   var winW = document.body.clientWidth;
   var winH = document.body.clientHeight;
   var divWindow = document.getElementById(id);
   divWindow.style.position = "absolute";
   //divWindow.style.backgroundColor = "#006699";
   //divWindow.style.backgroundColor = "#00FFFF";
   divWindow.style.backgroundColor ="#BED8F8";
   setZValue(divWindow, ++cur_z);
   divWindow.style.visibility = "visible";
   divWindow.style.display = "block";
   divWindow.style.padding= "1px 1px 1px 1px";
   divWindow.style.border= "3px red solid";
   
   /*divWindow.style.top = parseInt(winH/2) - (divWindow.offsetHeight/2)+"px";
   divWindow.style.left = parseInt(winW/2) - (divWindow.offsetWidth/2)+"px";
   */
      
    if(typeof (fileEditReplacePLM) != 'undefined') // PLM
    {
   		$("#" + id).draggable();
   		divWindow.style.top = parseInt(winH/4) - (divWindow.offsetHeight/2)+"px";  		
   	}
   	else
   	{
   		divWindow.style.top = parseInt(winH/2) - (divWindow.offsetHeight/2)+"px";	
   	}
   
   	divWindow.style.left = parseInt(winW/2) - (divWindow.offsetWidth/2)+"px";
}


function displayFileEditErrorMessage(errorMessage, error)
{	
 	if(typeof (fileEditReplacePLM) != 'undefined') // for PLM
 	{ 	
 		var errorObj = new htmlErrors();
		
		if(error)
		{
			errorObj.addError("errorInfo", errorMessage, true);
		}
		else // consider as warnings
		{
			errorObj.addWarning(errorMessage);
		}
		objMsgDiv = new messagingDiv(errorObj);
	}
	else // for old screens
	{
		alert(errorMessage);
	}
}

function getSessionId()
{
    var req = getAJAXRequestObject();        
    if (req)
    {
 	   req.open("POST", "fileedit.do?act=new&method=getSessionId", false);
       req.setRequestHeader("AjaxRequest", "true");               
       req.send();
       return req.responseText;
    }
}

function appletException(exceptionString)
{
	displayFileEditErrorMessage(decodeURIComponent(exceptionString), true);
}

function getTempfilename(randomfilelength)
{
	var filenamechars="abcdefghijklmnopqrstuvwxyz0123456789";
	var cnt;
	var tempfilename="";
	for(cnt=0; cnt < randomfilelength; cnt++)
	{
		var rnddigit=Math.floor(Math.random()*filenamechars.length);
		tempfilename+=filenamechars.charAt(rnddigit);
	}
	return tempfilename;
}


