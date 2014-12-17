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
	APIs for making Ajax call.
	@author Vijay Kumar A
*/

function htmlAjax() //constructor
{
    var _mActionURL = "";
    var _mActionMethod = "";
    var _mActionClassType;
    var _mMethodType;
    var _mCallType;
    var _mShowProcessingBar;
    var _mResult;
    var _xmlhttpreq;
    var _waitWindowHdlr;
    var _processHandler;
    var _reqData;
    var _htmlPart;
    var _scriptPart;
    var _parametersHandler;
    var _attributeHandler;
    var _errInfo;
    var _mDocViewId;
    var _mDivContainerName;
    var _mDivSectionId;
    var _mIsProcessComplete;
    var _mSetChangeFlagsOnLoad;

    this.parameter = _parameter;
    this.setActionURL = setActionURL;
    this.setActionType = setActionType;
	this.setActionMethod = setActionMethod;
	//Tracker #:13847 INCONSISTENCIES REGARDING LINKS ON PLM SCREENS WHICH BRING YOU TO OTHER SCREENS -ALL ARE DIFFERENT
	//This is added for the sub-tabs under bomc tab where we need to get the action method called in the javascript.
	this.getActionMethod = getActionMethod;
	this.setActionClassType = _setActionClassType;
	this.showProcessingBar = showProcessingBar;
	this.setCallType = setCallType;
	this.getResult = getResult;
	this.getHTMLResult = getHTMLResult;
	this.getScriptResult = getScriptResult;
	this.error = _htmlerror;
	this.sendRequest = sendRequest;
	this.setProcessHandler = setProcessHandler;
	this._createXMLHttpRequest = _createXMLHttpRequest;
	this._processRequest = _processRequest;
	this._getURL = _getURL;
	this._hideWaitWindow = _hideWaitWindow;
    this._showWaitWindow = _showWaitWindow;
    this._addAllParametersToRequest = _addAllParametersToRequest;
    this.getAllProcessMessages = _getAllProcessMessages;
    this.getDocViewId = _getDocViewId;
    this.getDivContainerName = _getDivContainerName;
    this.getDivSectionId = _getDivSectionId;
    this.setDocViewId = _setDocViewId;
    this.setDivContainerName = _setDivContainerName;
    this.setDivSectionId = _setDivSectionId;
    this.attribute = _attribute;
    this.isProcessComplete = _isProcessComplete;
    this._setChangeFlagsOnLoad = _setChangeFlagsOnLoad;
    this.getResponseHeader = _getResponseHeader;
    
    this._errInfo = new htmlErrors();
    this._parametersHandler = new htmlParameter();
    this._attributeHandler = new htmlAttribute();
	this._mMethodType = "POST";
	this._mCallType = "Synchronous";
	this._mShowProcessingBar = true;
	this._mResult = "";
	this._htmlPart = "";
	this._scriptPart = "";
    this._mDocViewId = "";
    this._mDivContainerName = "";
    this._mDivSectionId = null;
    this._mActionClassType="";
    this._mIsProcessComplete = true;
    this._mSetChangeFlagsOnLoad = false;
    
	this._reqData = "";
	this._waitWindowHdlr = null;

	return this;
}

function _setDocViewId(docViewId)
{
    this._mDocViewId = docViewId;
}

function _getDocViewId()
{
    return this._mDocViewId;
}

function _setDivContainerName(divContainerName)
{
    this._mDivContainerName = divContainerName;
}

function _getDivContainerName()
{
    return this._mDivContainerName;
}

function _setDivSectionId(divSectionId)
{
    this._mDivSectionId = divSectionId;
}

function _getDivSectionId()
{
    return this._mDivSectionId;
}

function setActionType(actionType)
{
    this.setActionTypePost = setActionTypePost;
    this.setActionTypeGet = setActionTypeGet;
}

function setActionTypePost()
{
    this._mMethodType = "POST";
}

function setActionTypeGet()
{
    this._mMethodType = "GET";
}

function setActionURL(action)
{
    this._mActionURL = action;
}

function setActionMethod(actionMethod)
{
    this._mActionMethod = actionMethod;
}
//Tracker #:13847 INCONSISTENCIES REGARDING LINKS ON PLM SCREENS WHICH BRING YOU TO OTHER SCREENS -ALL ARE DIFFERENT
//This is added for the sub-tabs under bomc tab where we need to get the action method called in the javascript.
function getActionMethod()
{
	return this._mActionMethod;
}

function _setActionClassType()
{
    var objType = document.getElementById("type");

    if(objType && objType.value)
    {
        this._mActionClassType = objType.value;
    }
}

function setCallType(callType)
{
    this._mCallType = callType;
}

function showProcessingBar(bDisplayProcessingBar)
{
    this._mShowProcessingBar =  bDisplayProcessingBar;
}

function setProcessHandler(processHandler)
{
    if(processHandler)
    {
        this._processHandler = processHandler;
    }
}

function _isProcessComplete()
{
	// Invoke SessionManagement.resetSessionTime() to reset session counter.
	SessionManagement.resetSessionTime();
	return this._mIsProcessComplete;
}

function _getResponseHeader(respname)
{
   return this._xmlhttpreq.getResponseHeader(respname);
}

function _htmlerror()
{
    return this._errInfo;
}

function _parameter()
{
    return  this._parametersHandler;
}

function _attribute()
{
    return this._attributeHandler;
}


function _addAllParametersToRequest()
{
   if (this._xmlhttpreq)
   {

       // alert("_addAllParametersToRequest :");
       var pcnt = this.parameter().count();
       //alert("_addAllParametersToRequest : \n pcnt " + pcnt);
       for(var i=0;i<pcnt;i++)
       {
            var parms = this.parameter().getParameter(i);

            if(parms)
            {
                var name = parms[0];
                var value = parms[1];
                value = (value==null)?"":_trim(value);
                //alert("i = " + i + " name -> = " + name + "  value  " + value + " typeof(value) "  + typeof(value) );
               //TODO: Note instead of passing through request header it is passed as body
               // this._xmlhttpreq.setRequestHeader(name, value);
               //construct the string to pass the name=value&name=value
               this._reqData +=  "&"+name+"="+ value;
               //alert("this._reqData \n "  + this._reqData);
            }
       }

       if(pcnt>0)
       {
           this._reqData = this._reqData.toString().slice(1,this._reqData.toString().length);
       }
       //alert("_addAllParametersToRequest : this._reqData \n " + this._reqData);
   }
}

function getResult()
{
    return this._mResult;
}

function getHTMLResult()
{
    return this._htmlPart;
}

function getScriptResult()
{
    return this._scriptPart;
}


function _createXMLHttpRequest()
{
    this._xmlhttpreq = null;

    try
    {
        if (window.XMLHttpRequest)
        {
            // alert(" window.XMLHttpRequest ");
            this._xmlhttpreq = new XMLHttpRequest();
        }
        else if (window.ActiveXObject)
        {
           this._xmlhttpreq = new ActiveXObject("Microsoft.XMLHTTP");
        }
    }catch(e){
        // alert(e.description);
    }
}

function sendRequest()
{
    this._mResult = "";
	this._htmlPart = "";
	this._scriptPart = "";
	this._errInfo = new htmlErrors();
	this._createXMLHttpRequest();
	this._processRequest();
}

function _getAllProcessMessages()
{
    var msgInfo = "";

    if(this.error().getErrorMsg()!=null)
    {
        msgInfo += "\n Error Message(s)\n " + this.error().getErrorMsg();
    }

    if(this.error().getWarningMsg()!=null)
    {
         msgInfo += "\n  Warning Message(s)\n " + this.error().getWarningMsg();
    }

    if(this.error().getSuccessMsg()!=null)
    {
        msgInfo += "\n Success Message(s)\n " + this.error().getSuccessMsg();
    }
    if(this.error().getConfirmMsg()!=null)
    {
        msgInfo += "\n Confirm Message\n " + this.error().getConfirmMsg();
    }
    return replacevalstr(msgInfo, '<br>', '\n');;
}

function _processRequest()
{
    try
    {
        if (this._xmlhttpreq)
        {
            if(this._mShowProcessingBar == true)
            {
                this._showWaitWindow();
            }
            // alert("this._getURL() " + this._getURL());
            // alert("this._mMethodType " +this._mMethodType);
            this._xmlhttpreq.open(this._mMethodType, this._getURL(), true);
            // alert("Opened");
            this._xmlhttpreq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            this._addAllParametersToRequest();
            this._xmlhttpreq.setRequestHeader("AjaxRequest", "true");

            var xmlhttpObj = this;

            this._xmlhttpreq.onreadystatechange = function()
            {
                // alert("inside this " + this);
                // only if req shows "loaded"
                if (xmlhttpObj._xmlhttpreq.readyState == 4)
                {
                    // alert("xmlhttpObj._xmlhttpreq.readyState");
                    xmlhttpObj._hideWaitWindow();

                    // alert("status - > " +xmlhttpObj._xmlhttpreq.status);
                    // only if "OK"
                    if (xmlhttpObj._xmlhttpreq.status == 200)
                    {
                        // alert("sessionexpired \n "+ xmlhttpObj._xmlhttpreq.getResponseHeader("issessionexpired"));
                        if(_sessionExpired(xmlhttpObj)==true)
                        {
                           return;
                        }
                        // alert("xmlhttpObj._xmlhttpreq.status");
                        xmlhttpObj._mIsError = false;
                        // alert("xmlhttpObj._xmlhttpreq.ResponseText \n " + xmlhttpObj._xmlhttpreq.responseText);

                        xmlhttpObj._htmlPart = xmlhttpObj._xmlhttpreq.responseText;
	                    xmlhttpObj._scriptPart = xmlhttpObj._xmlhttpreq.getResponseHeader("scriptpart");
	                    //alert("xmlhttpObj._scriptPart " + xmlhttpObj._scriptPart);
                        xmlhttpObj._mResult = xmlhttpObj._htmlPart + "<script>" + xmlhttpObj._scriptPart + "</script>";

                        //alert(" xmlhttpObj._xmlhttpreq.getResponseHeader('successInfo') ' "  +  xmlhttpObj._xmlhttpreq.getAllResponseHeader('Content-type'));
                        //todo error management
                        var errDtls = xmlhttpObj._xmlhttpreq.getResponseHeader("errorInfo");

                        if(xmlhttpObj._xmlhttpreq.getResponseHeader("isProcessComplete")=="false")
						{
							//alert('processfailed' + xmlhttpObj._xmlhttpreq.getResponseHeader("processfailed"));
							//Tracker#20236
							//Null was getting printed in message for Safari and Firefox browser.
							//check null befor appending to errDtls.
						    if(xmlhttpObj._xmlhttpreq.getResponseHeader("processfailed"))
						    {
						    	errDtls += xmlhttpObj._xmlhttpreq.getResponseHeader("processfailed");
						    }
						    xmlhttpObj._mIsProcessComplete = false;
						}

                        xmlhttpObj.error().addError("errorInfo", errDtls, true);
                        xmlhttpObj.error().addWarning(xmlhttpObj._xmlhttpreq.getResponseHeader("warningInfo"));
                        xmlhttpObj.error().addSuccess(xmlhttpObj._xmlhttpreq.getResponseHeader("successInfo"));
						xmlhttpObj.error().addConfirm (xmlhttpObj._xmlhttpreq.getResponseHeader("confirmInfo"));

                        //alert("xmlhttpObj._htmlPart  " +xmlhttpObj._htmlPart  + "\n xmlhttpObj._scriptPart " + xmlhttpObj._scriptPart);
                        //TODO: handle server side errors xmlhttpObj._xmlhttpreq.getResponseHeader("showErrors")
                        // alert("type of xmlhttpObj._processHandler " + typeof(xmlhttpObj._processHandler));
                        if(typeof(xmlhttpObj._processHandler)!="function")
                        {
                            //alert(xmlhttpObj._processHandler + "(xmlhttpObj)");
                            //alert("invoking process handler");
                            eval(xmlhttpObj._processHandler + "(xmlhttpObj)");
                        }
                        else
                        {
                            // alert("here dynamical call ");
                            xmlhttpObj._processHandler(xmlhttpObj);
                        }
                    }
                    else
                    {
                        //todo to show the user message if any error occured
                        // alert("html part \n " + xmlhttpObj._xmlhttpreq.getAllResponseHeaders() + "\n xmlhttpObj._xmlhttpreq.ResponseText = "+ xmlhttpObj._xmlhttpreq.ResponseText);

                        //alert("Error occured due to -> " +  getResponse(xmlhttpObj._xmlhttpreq.status));
                        //alert("sessionexpired \n "+ xmlhttpObj._xmlhttpreq.getResponseHeader("issessionexpired"));
                        if(_sessionExpired(xmlhttpObj)==true)
                        {
                           return;
                        }
                        else if(getResponse(xmlhttpObj._xmlhttpreq.status))
                        {
                            xmlhttpObj.error().addError("errorInfo", "Error occured due to -> " + getResponse(xmlhttpObj._xmlhttpreq.status), true);
                        }
                    }
                }
             }
             // alert("this._reqData -> " + this._reqData.toString().length + " \n "  + this._reqData);
             xmlhttpObj._xmlhttpreq.send(this._reqData);
             //alert("sending");
             //eval("this._xmlhttpreq.send(this._reqData);");
             //alert("after request sending here");
        }
	}
	catch(e)
	{
	    //alert("error \n " + e.description);
		this._hideWaitWindow();
	}
}

function _sessionExpired(xmlhttpObj)
{
    if(xmlhttpObj._xmlhttpreq.getResponseHeader("issessionexpired")=="1")
    {
        var msg = xmlhttpObj._xmlhttpreq.getResponseHeader("issessionexpiredmsg");
        xmlhttpObj.error().addError("errorInfo", msg, true);
        msg = xmlhttpObj.getAllProcessMessages();

        if(msg!="")
        {
           //_displayUserMessage(msg);
          _displayProcessMessage(xmlhttpObj);
        }

        window.location.href="logout.do";
        return true;
    }
}

function _getURL()
{
    var retVal = this._mActionURL;
    if(this._mActionMethod)
    {
        // Tracker#: 17972 - SAFARI/FIREFOX - PLM BOM SMART TAG DOES NOT OPEN AND GIVES ERROR
    	// Extra ? was being added to URL. Fix by checking if it exists before adding.
    	if (retVal.indexOf("?") == -1)
    		retVal = retVal + "?";
        if(this._mActionClassType && this._mActionClassType != "")
        {
            retVal = retVal + "type="+this._mActionClassType+"&";
        }
        //alert("retVal " + retVal);
        retVal = retVal+ "method="+this._mActionMethod;
    }
    return retVal;
}

function _hideWaitWindow()
{
	try
	{
		if (typeof document.removeEventListener !== 'undefined')
		{
			document.removeEventListener("click",stopClicks,true);
		}
		else
		{
			document.detachEvent("onclick", stopClicks);
		}
		

	    if(this._waitWindowHdlr)
	    {
	       document.body.removeChild(this._waitWindowHdlr);
	    }
	}
	catch (e){}
}

function stopClicks(e)
{
	if (typeof e.stopImmediatePropagation !== 'undefined')
	{
	e.stopImmediatePropagation();
	e.preventDefault();
	}
	else
	{
		e.cancelBubble=true;
		e.returnValue=false;		
	}
	return false;
}

// wait window once user submit the page
function _showWaitWindow()
{
	if (typeof document.addEventListener !== 'undefined')
	{
		document.addEventListener("click",stopClicks,true);
	}
	else
	{
		document.attachEvent("onclick", stopClicks);
	}

    this._waitWindowHdlr = new processingWindow();

	with (document.body)
	{
		var winW = clientWidth;
		var winH = clientHeight;
		var winScrlTop = scrollTop;
		appendChild(this._waitWindowHdlr);
	}
	
	with (this._waitWindowHdlr)
	{
		style.top = (winH/2+winScrlTop) - (offsetHeight/2)+"px";
	    style.left = winW/2 - (offsetWidth/2)+"px";
	}
	setZValue(this._waitWindowHdlr, 20000);

    return this._waitWindowHdlr;
}


function getResponse(statuscode)
{
    var response = "";
    switch(statuscode)
    {
    //'translates HTTP response codes into error messages
        case 100: response = "Continue";break;
        case 101: response = "Switching protocols";break;
        case 200: response = "OK";break;
        case 201: response = "Created";break;
        case 202: response = "Accepted";break;
        case 203: response = "Non-Authoritative Information";break;
        case 204: response = "No Content";break;
        case 205: response = "Reset Content";break;
        case 206: response = "Partial Content";break;
        case 300: response = "Multiple Choices";break;
        case 301: response = "Moved Permanently";break;
        case 302: response = "Found";break;
        case 303: response = "See Other";break;
        case 304: response = "Not Modified";break;
        case 305: response = "Use Proxy";break;
        case 307: response = "Temporary Redirect";break;
        case 400: response = "Bad Request";break;
        case 401: response = "Unauthorized";break;
        case 402: response = "Payment Required";break;
        case 403: response = "Forbidden";break;
        case 404: response = "Not Found";break;
        case 405: response = "Method Not Allowed";break;
        case 406: response = "Not Acceptable";break;
        case 407: response = "Proxy Authentication Required";break;
        case 408: response = "Request Timeout";break;
        case 409: response = "Conflict";break;
        case 410: response = "Gone";break;
        case 411: response = "Length Required";break;
        case 412: response = "Precondition Failed";break;
        case 413: response = "Request Entity Too Large";break;
        case 414: response = "Request-URI Too Long";break;
        case 415: response = "Unsupported Media Type";break;
        case 416: response = "Requested Range Not Suitable";break;
        case 417: response = "Expectation Failed";break;
        case 500: response = "Internal Server Error";break;
        case 501: response = "Not Implemented";break;
        case 502: response = "Bad Gateway";break;
        case 503: response = "Service Unavailable";break;
        case 504: response = "Gateway Timeout";break;
        case 505: response = "HTTP Version Not Supported";break;
        case 12001: response = "Out Of Handles";break;
        case 12002: response = "Timeout";break;
        case 12003: response = "Extended Error";break;
        case 12004: response = "Internal Error";break;
        case 12005: response = "Invalid Url";break;
        case 12006: response = "Unrecognized Scheme";break;
        case 12007: response = "Name Not Resolved";break;
        case 12008: response = "Protocol Not Found";break;
        case 12009: response = "Invalid Option";break;
        case 12010: response = "Bad Option Length";break;
        case 12011: response = "Option Not Settable";break;
        case 12012: response = "Shutdown";break;
        case 12013: response = "Incorrect User Name";break;
        case 12014: response = "Incorrect Password";break;
        case 12015: response = "Login Failure";break;
        case 12016: response = "Invalid Operation";break;
        case 12017: response = "Operation Cancelled";break;
        case 12018: response = "Incorrect Handle Type";break;
        case 12019: response = "Incorrect Handle State";break;
        case 12020: response = "Not Proxy Request";break;
        case 12021: response = "Registry Value Not Found";break;
        case 12022: response = "Bad Registry Parameter";break;
        case 12023: response = "No Direct Access";break;
        case 12024: response = "No Context";break;
        case 12025: response = "No Callback";break;
        case 12026: response = "Request Pending";break;
        case 12027: response = "Incorrect Format";break;
        case 12028: response = "Item Not Found";break;
        case 12029: response = "Cannot Connect";break;
        case 12030: response = "Connection Aborted";break;
        case 12031: response = "Connection Reset";break;
        case 12032: response = "Force Retry";break;
        case 12033: response = "Invalid Proxy Request";break;
        case 12036: response = "Handle Exists";break;
        case 12037: response = "Sec Cert Date Invalid";break;
        case 12038: response = "Sec Cert Cn Invalid";break;
        case 12039: response = "Http To Https On Redir";break;
        case 12040: response = "Https To Http On Redir";break;
        case 12041: response = "Mixed Security";break;
        case 12042: response = "Chg Post Is Non Secure";break;
        case 12043: response = "Post Is Non Secure";break;
        case 12110: response = "Transfer In Progress";break;
        case 12111: response = "Dropped";break;
        case 12130: response = "Protocol Error";break;
        case 12131: response = "Not File";break;
        case 12132: response = "Data Error";break;
        case 12133: response = "End Of Data";break;
        case 12134: response = "Invalid Locator";break;
        case 12135: response = "Incorrect Locator Type";break;
        case 12136: response = "Not Gopher Plus";break;
        case 12137: response = "Attribute Not Found";break;
        case 12138: response = "Unknown Locator";break;
        case 12150: response = "Header Not Found";break;
        case 12151: response = "Downlevel Server";break;
        case 12152: response = "Invalid Server Response";break;
        case 12153: response = "Invalid Header";break;
        case 12154: response = "Invalid Query Request";break;
        case 12155: response = "Header Already Exists";break;
        case 12156: response = "Redirect Failed";break;
        default: 	response = "Unknown Error";break;
    }
    return response;
}

function htmlParameter()
{
    var _arrParameters;

    this._arrParameters = new Array();

    //alert("parameters : \n this._arrParameters" + this._arrParameters.length);
	this.add = addParameter;
	this.count = parameterCount;
	this.getParameter = getParameter;
	this.addAllParameters = _addAllParameters;
	this.getParameterByName = _getParameterByName;


	function _addAllParameters(paramString)
	{
	    if(paramString && paramString.toString().length>0)
	    {
	        var param = paramString.toString().split("&");

	        if((param.length!="undefined") && param.length>0)
	        {
                for (num = 0; num < param.length; num++)
                {
                   var equalsIndex = param[num].toString().indexOf("=");//Note value can have '=' operator.First index is used
                   if (equalsIndex == -1) continue;
                   var paramName = param[num].toString().substring(0, equalsIndex);
                   var paramValue = param[num].toString().substring(equalsIndex + 1);
                   this.add(paramName, paramValue);
                }
            }
            else
            {
                //for only one param where no & is mentioned
                var nameVal = param.toString().split("=");
                if(nameVal && nameVal.length>0)
                {
                    this.add(nameVal[0],nameVal[1]);
                }
            }
	    }
	}

	function addParameter(name, value)
    {
        //alert("parameters :addParameter -> name= "+name + " value = " + value);
        var arrLength = this._arrParameters.length;
        this._arrParameters[arrLength] = new Array();
        // Tracker#:14516 NOT ABLE TO SET AS ACTIVE/INACTIVE FOR LABEL&TAG MATERIAL TYPE
        // Encoded the param name because param may have special characters like '&' etc. 
        this._arrParameters[arrLength][0]= encodeURIComponent(name);
        this._arrParameters[arrLength][1]= encodeURIComponent(value);
        //alert("added");
    }

    function parameterCount()
    {
        return this._arrParameters.length;
    }

    function getParameter(index)
    {
        return this._arrParameters[index];
    }

    function _getParameterByName(name)
    {
        var len = this._arrParameters.length;
        //alert("getParameterByName \n len =" + len);
        for(var i=0;i<len;i++)
        {
           // alert(" name = " + name + "\n this._arrParameters["+i+"][0] = " + this._arrParameters[i][0]);
           if(name==this._arrParameters[i][0])
           {
                //alert("found value \n this._arrParameters["+i+"][1] = "+ this._arrParameters[i][1]);
                return this._arrParameters[i][1];
           }
        }
        return null;
    }


	return this;
}

function htmlAttribute()
{
    var _arrAttribute;

    this._arrAttribute = new Array();

    //alert("parameters : \n this._arrParameters" + this._arrParameters.length);
	this.setAttribute = _setAttribute;
	this.count = _attributeCount;
	this.getAttribute = _getAttribute;

    function _setAttribute(name, value)
    {
        //alert("parameters :addParameter -> name= "+name + " value = " + value);
        this._arrAttribute[name]= value;
        //alert("added");
    }

    function _attributeCount()
    {
        return this._arrAttribute.length;
    }

    function _getAttribute(name)
    {
        return this._arrAttribute[name];
    }

    return this;
}

function _setChangeFlagsOnLoad (flag)
{
	this._mSetChangeFlagsOnLoad = flag;
}

