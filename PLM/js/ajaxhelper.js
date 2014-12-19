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

// Ajax Call methods : Start
var sectionId="";
function AJAXRequest(url, refCallBackFunction, queryString, processError)
{
           var request = init();

			function init()
			{
				if(window.XMLHttpRequest)
				{
					return new XMLHttpRequest();
				}
				 else if(window.ActiveXObject)
				{
					return new ActiveXObject("Microsoft.XMLHTTP");

				}
            }
            this.send = function()
	         {
					request.onreadystatechange = getResponse;
					request.open("POST", url, true);
                    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');                                            
                    request.send(queryString);
              }

			function getResponse()
            {
				if(request.readyState == 4)
                {
					// Invoke SessionManagement.resetSessionTime() to reset session counter.
		        	SessionManagement.resetSessionTime();
		        	
					var response = request.responseText;
					// process the request
					// add the request as an argument, so can get attribute set in request
                    refCallBackFunction(response,request);
                     
                     if(processError) // only for new UI
                     {                   
                    	var errorObj = new htmlErrors();
                    
                     	errorObj.addError("errorInfo", request.getResponseHeader("errorInfo"), true);
                     	errorObj.addWarning(request.getResponseHeader("warningInfo"));
                     	errorObj.addSuccess(request.getResponseHeader("successInfo"));
					 	errorObj.addConfirm(request.getResponseHeader("confirmInfo"));
                    
                    	var msgs = request.getResponseHeader("errorInfo") + 
                    			request.getResponseHeader("warningInfo") +
                    			request.getResponseHeader("successInfo") +
                    			request.getResponseHeader("errorInfo");
                    
	                    if(msgs != "")
	                    {	
	                    	objMsgDiv = new messagingDiv(errorObj);
	                    }                    
                 	}
            	}
          }           

}

function manipulateResponse(response)
{           
 var div=document.getElementById(sectionId);
 div.outerHTML=response;                
}

// for closing the wait window after the AJAX call
function closeWaitWindow()
{
    var waitW = getElemnt("proc");
    if (waitW)
   {
	var parentNode = waitW.parentNode;
	parentNode.removeChild(waitW);
    //eval('document.'+FRM+'.removeChild(waitW)');
   }
}

// wait window with SPINNING icon (wait30trans.gif)
/*function waitWindow()
{
	var winW = document.body.clientWidth;
	var winH = document.body.clientHeight;
	var waitW = new DOMWindow("&nbsp;&nbsp;&nbsp; " + szMsg_Processing + " &nbsp;&nbsp;&nbsp;<br><br><img src='images/wait30trans.gif' border='1'>","proc", "15pt", "#006699", "#FFFFFF")
	document.body.appendChild(waitW);
	setZValue(waitW,++cur_z);
    var y = waitW.style.top = parseInt(winH/2) - (waitW.offsetHeight/2)+"px";
    var x = waitW.style.left = parseInt(winW/2) - (waitW.offsetWidth/2)+"px";
    var h = waitW.offsetHeight;
    var w = waitW.offsetWidth

    if(bw.dom&&!bw.op)
    {
        var selx,sely,selw,selh,i
        var sel=document.getElementsByTagName("SELECT")

        for(i=0;i<sel.length;i++)
        {
            selx=0; sely=0; var selp;
            if(sel[i].offsetParent)
            {
                selp=sel[i];
                while(selp.offsetParent)
                {
                    selp=selp.offsetParent;
                    selx+=selp.offsetLeft;
                    sely+=selp.offsetTop;
                }
            }
            selx+=sel[i].offsetLeft-moved_x;
            sely+=sel[i].offsetTop-moved_y
            selw=sel[i].offsetWidth;
            selh=sel[i].offsetHeight
            if(selx+selw>x && selx<x+w && sely+selh>y && sely<y+h)
            {
                if(sel[i].style.visibility!="hidden")
                {
                    sel[i].style.visibility="hidden";
                }
            }
        }
    }

} */

// Ajax Call methods : end
