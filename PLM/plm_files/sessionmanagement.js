/*************************************/
/*  Copyright  (C)  2002 - 2011      */
/*           by                      */
/*  TradeStone Software, Inc.        */
/*  Gloucester, MA. 01930            */
/*  All Rights Reserved              */
/*  Printed in U.S.A.                */
/*  Confidential, Unpublished        */
/*  Property of                      */
/*  TradeStone Software, Inc.        */
/*************************************/

/**
 * This JS is used to track the user session.
 * The two key methods that are used are:
 * setTimeout() - executes a code some time in the future
 * clearTimeout() - cancels the setTimeout()
 */

var sessionTimeOut;     // Holds user session timer.
var userAlertTimeOut;   // Holds user alert timer.
var alertTimerInterval; // Holds user alert interval time.

var sessionMgmtJson;  // JSON object holds user session logout time, alert time & alert message.

var sessionMgmtIreq;  // AJAX request object.

var SessionManagement = {

	/**
	 * This method is used to reset the time out values whenever user performs some action.
	 * Note: htmlAjax object has not been used to make ajax call because we are tracking
	 * ajax user actions in htmlAjax.isProcessComplete() method.
	 * If htmlAjax is used then it will end up in infinite loop.
	 */
	resetSessionTime : function() {
		clearTimeout(sessionTimeOut);
		clearTimeout(userAlertTimeOut);
		clearInterval(alertTimerInterval);

		if (sessionMgmtJson == null || sessionMgmtJson == 'undefined') {
			SessionManagement.refreshSession();

		} else {
			SessionManagement.resetTimeOut();
		}
	},

	refreshSession : function() {
		sessionMgmtIreq = createXMLHttpRequest();
		sessionMgmtIreq.open('POST', 'sessionmanagement.do?method=refreshSession', true);
		sessionMgmtIreq.onreadystatechange = SessionManagement.refreshSessionResponse;
		sessionMgmtIreq.send(null);
	},

	refreshSessionResponse : function() {
		if (sessionMgmtIreq.readyState == 4) {
        	if (sessionMgmtIreq.status == 200) {
				sessionMgmtJson = eval('(' + sessionMgmtIreq.responseText + ')');
				SessionManagement.resetTimeOut();

				sessionMgmtIreq=null;
			}
		}
	},

  	handleSessionTimeout : function() {
        window.location.href = "sessionmanagement.do?method=logout";
	},

	handleUserAlertTimeout : function() {
		var objAjax = new htmlAjax();
    	var htmlErrors = objAjax.error();
		htmlErrors.addConfirmOk(sessionMgmtJson.userAlertMsg);
	   	messagingDiv(htmlErrors, '', '', 'SessionManagementMsgId');

	   	var userAlertMinutes = parseInt(document.getElementById('sessionMinuteId').innerText);

		alertTimerInterval = setInterval(function() {
			var sessionMinuteId = document.getElementById('sessionMinuteId');
			if (sessionMinuteId) {
				sessionMinuteId.innerText = (--userAlertMinutes);
				if (userAlertMinutes == 0) {
					clearInterval(alertTimerInterval);
				}
			}
		}, 60000);

		window.focus();
	},

	activateSession : function() {
		closeMsgBox();

		clearTimeout(sessionTimeOut);
		clearTimeout(userAlertTimeOut);
		clearInterval(alertTimerInterval);

		SessionManagement.refreshSession();
	},

	resetTimeOut : function() {
		sessionTimeOut = setTimeout(SessionManagement.handleSessionTimeout, parseInt(sessionMgmtJson.sessionTime));
		userAlertTimeOut = setTimeout(SessionManagement.handleUserAlertTimeout, parseInt(sessionMgmtJson.userAlertTime));

		// Reset session time on parent window.
		try {
			if(window.opener && window.opener.SessionManagement) {
				window.opener.closeMsgBox();
				window.opener.SessionManagement.resetSessionTime();
			}
		}catch(err) {
			//Nothing to do as we do not have access to window.opener properties. 
		}
	}
};
