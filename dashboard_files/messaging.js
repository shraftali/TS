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

//Messaging javascript.This script has dependency on common.js
/* -------------------------- Messaging Component Class -------------------------------
 * This provides the APIs for messaging DIV
 *
 * @since 2009R1
 */
//Tracker#: 15424 THE DROPDOWN ARE BLEEDING THROUGH THE WARNING/ERROR AND SUCCESS MSG WINDOW
//Changes in the method to pass a elementId
 function messagingDiv(htmlErrors,func,cancelFunc,elementId)
 {
    if(htmlErrors == null) return;

    var isError = htmlErrors.hasErrorOccured();
    var isSuccess = htmlErrors.getSuccessMsg() != null;
    var isWarning = htmlErrors.getWarningMsg() != null;
    var isConfirm = htmlErrors.getConfirmMsg() != null;
    var isConfirmOk = htmlErrors.getConfirmOkMsg() != null;

    var fnctn = func;
    var cancelFn=cancelFunc;

    if (!(isSuccess || isWarning || isError || isConfirm || isConfirmOk))
    {
        return;
    }

   //Tracker#10872 - Handling messaging differently for User Messages and Warnings
   // var displayMessage = isError ? htmlErrors.getErrorMsg() : (isSuccess ? htmlErrors.getSuccessMsg():(isConfirm ? htmlErrors.getConfirmMsg() : (isWarning ? htmlErrors.getWarningMsg() : null))) ;

    var warningMessage = null;
    if(isError)
	{
		displayMessage = htmlErrors.getErrorMsg();
	}
	else if(isSuccess)
	{
		displayMessage = htmlErrors.getSuccessMsg();
		if(isWarning)
		{
			displayMessage = displayMessage + htmlErrors.getWarningMsg();
		}
	}
	else if(isWarning)
	{
		displayMessage = htmlErrors.getWarningMsg();
	}
	else if(isConfirm)
	{
		displayMessage = htmlErrors.getConfirmMsg()
	}
	else if(isConfirmOk)
	{
		/**
		 * Prints only Ok button in the Confirmation Dialog.
		 * ST 19192 - Session Management.
		 */
		displayMessage = htmlErrors.getConfirmOkMsg()
	}


    if (displayMessage != null)
    {
        buildMsgDiv(elementId)
    }
//Tracker#: 15424 THE DROPDOWN ARE BLEEDING THROUGH THE WARNING/ERROR AND SUCCESS MSG WINDOW
//Changes in the method to pass a elementId
 function buildMsgDiv(elementId)
 {
	msgDivObj = document.getElementById("msgDiv");
	if (!msgDivObj || msgDivObj == null)
	{
        msgDivObj = document.createElement('div');
        msgDivObj.id = 'msgDiv';
        if(elementId == 'SessionManagementMsgId')
        {
        	msgDivObj.style.width = 350+"px";
        }
        else
        {
        	msgDivObj.style.width = 222+"px";
        }
        //Tracker#: 14542 MULTIPLE PLM ERROR MESSAGES RESULT IN SCROLL BARS AND CANNOT CLOSE
        //This is done so that the main message div doesnot have any scroll bar
        msgDivObj.style.overflow = "hidden";
        msgDivObj.style.position = "absolute";
        //msgDivObj.style.cursor='move';
        msgDivObj.style.zIndex=999999; //iFrame will be just below the theDiv
        document.body.appendChild(msgDivObj);
    }
    else
    {
        //Tracker#: 17189 REGRESSION ISSUE: PLM WARNING AND SUCCESS MESSAGES FADES AWAY ON MOUSE HOVER
        $(msgDivObj).stop();
        $(msgDivObj).fadeTo('fast', 1);
        $(msgDivObj).unbind();
    }

  	msgDivObj.style.display = "block";


	//Tracker#10872 - Handling messaging differently for User Messages and Warnings
	//var _html = isError ? template['errorHTML'].replace('$SERVER_MESSAGE$', displayMessage) : (isSuccess ? template['successHTML'].replace('$SERVER_MESSAGE$', displayMessage):(isConfirm ? template['confirmHTML'].replace('$SERVER_MESSAGE$', displayMessage) : (isWarning ? template['warningHTML'].replace('$SERVER_MESSAGE$', displayMessage) : null)));

	if(isError)
	{
		_html = template['errorHTML'].replace('$SERVER_MESSAGE$', displayMessage);
	}
	else if(isSuccess)
	{
		if(isWarning)
		{
			_html = template['warningHTML'].replace('$SERVER_MESSAGE$', displayMessage);
		}
		else
		{
			_html = template['successHTML'].replace('$SERVER_MESSAGE$', displayMessage);
		}
	}
	else if(isWarning)
	{
		_html = template['warningHTML'].replace('$SERVER_MESSAGE$', displayMessage);
	}
	else if(isConfirm)
	{
		_html = template['confirmHTML'].replace('$SERVER_MESSAGE$', displayMessage)
	}
	else if(isConfirmOk)
	{
		/**
		 * Prints only Ok button in the Confirmation Dialog.
		 * ST 19192 - Session Management.
		 */
		_html = template['confirmOkHTML'].replace('$SERVER_MESSAGE$', displayMessage)
	}
	var _html_1 =_html.replace('$FNCTION$',fnctn);//For confirm message
	if(cancelFunc)
	{
		_html_1 =_html_1.replace('$CANCEL$',cancelFunc);//For confirm message
	}else
	{
		_html_1 =_html_1.replace('$CANCEL$','cancel()');//For confirm message
	}
    msgDivObj.innerHTML=_html_1;
    var winScrlTop = document.body.scrollTop;
    var lft = (nCurScrWidth - msgDivObj.offsetWidth) / 2;
    var tp =  (nCurScrHeight - msgDivObj.offsetHeight) / 2;
    /*
	 * Tracker#:20060 process bar is needed while opening multi pom windows. 
	 * Adding scrollTop to messaging div top calculation so that if user scrolls down window,
	 * so that processing bar would be visible.
	 */
    tp+= winScrlTop;
	msgDivObj.style.left = lft+"px";
	msgDivObj.style.top = tp+"px";

    if (isSuccess)
    {
        var a = $(msgDivObj).fadeTo(4000, 0.5, function() {
            closeMsgBox();
        });

        // On mouseover cancel the fade effect
        $(msgDivObj).hover(function(){
                a.stop();
                a = $(msgDivObj).fadeTo('fast', 1);
            },function(){
            a = $(msgDivObj).fadeTo(4000, 0.5, function() {
                closeMsgBox();
            });
        });

    }

 }
}

//@since2010R3
//Global instances removed to avoid memory leaks
function closeMsgBox()
{
 	var msgDivObj = document.getElementById("msgDiv");
 	if(msgDivObj)
 	{
    	msgDivObj.style.display = "none";
 		msgDivObj.innerHTML = "";
    	//Tracker#: 17189 REGRESSION ISSUE: PLM WARNING AND SUCCESS MESSAGES FADES AWAY ON MOUSE HOVER
    	//Removing the div object from the document.body and making it null
    	//msgDivObj.parentNode.removeChild(msgDivObj);
    	document.body.removeChild(msgDivObj);
    	msgDivObj = null;
 	}
 	
 	if(SectionMenu)
	{ 		
 		SectionMenu.close();
	}

}

//Tracker#16120 TSR 516 F5 ADD SMART TAG TO ITEM NO, F7 & F10  IMPLEMENT FILLUP FILLDOWN
//function to diplay warning message.
function _displayWarningMessage(msg)
{
	var htmErrors = new htmlErrors();
	htmErrors.addWarning(msg);
    messagingDiv(htmErrors);
}
