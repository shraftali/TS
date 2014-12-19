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

/**
 exclusively for assoc pagination client side event handler
*/

function _assocpageNav(pageKeyField, displayRecordKey, submitUrl, processHandler)
{
	closeMsgBox();

    var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
	var actMethod = "assocpagenavigation&pagenavkey="+pageKeyField +"&pagenavmatchfield="+displayRecordKey;

    if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==true)
    {
        var htmlErrors = objAjax.error();
        htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
        messagingDiv(htmlErrors, "saveWorkArea()", "_submitAssocPagination('"+actMethod+"','"+submitUrl+"',"+processHandler+")");
        return;
    }
    else
    {
        _submitAssocPagination(actMethod, submitUrl, processHandler);
    }
}

function _submitAssocPagination(actMethod, submitUrl, processHandler)
{
   closeMsgBox();
   var htmlAreaObj = _getWorkAreaDefaultObj();
   var objAjax = htmlAreaObj.getHTMLAjax();

   if( objAjax)
   {
        objAjax.setActionURL(submitUrl);
        objAjax.setActionMethod(actMethod);
        objAjax.setProcessHandler(processHandler);
        objAjax.sendRequest();
   }
}


function _assocPgnSelChg(pageKeyField, dropDownObj, submitUrl, processHandler)
{
    var nextRecordKey = dropDownObj.value;
    _assocpageNav(pageKeyField, nextRecordKey, submitUrl, processHandler);
}
