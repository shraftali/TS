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

function htmlErrors()
{
    var _arrErrors;
    var _arrErrorsKey;
    var _mIsError;
    var _mIsWarning;

    this._mIsError = false;
    this._mIsWarning = false;
    this._arrErrors = new Array();
    this._arrErrorsKey = new Array();

	this.count = _errorsCount;
	this.getError = _getErrorMsg;
    this.addError = _addError;
    this.addWarning = _addWarning;
    this.addSuccess = _addSuccess;
    this.addConfirm = _addConfirm;
    this.addConfirmOk = _addConfirmOk;
    this.hasErrorOccured = _hasErrorOccured;
    this.hasWarningOccured = _hasWarningOccured;
    this.getErrorMsg = _getErrorMsg;
    this.getWarningMsg = _getWarning;
    this.getSuccessMsg = _getSuccess;
    this.getConfirmMsg = _getConfirm;
    this._getError = _getError;
    this.getConfirmOkMsg = _getConfirmOk;


    function _getErrorMsg()
    {
        return this._getError("errorInfo");
    }

    function _getWarning()
    {
        return this._getError("warningInfo");
    }

    function _getSuccess()
    {
        return this._getError("successInfo");
    }

    function _getConfirm()
    {
        return this._getError("confirmInfo");
    }

	/**
	 * Prints only Ok button in the Confirmation Dialog.
	 * ST 19192 - Session Management.
	 */
    function _getConfirmOk()
    {
    	return this._getError("confirmOkInfo");
    }

	function _addError(key, value, isError)
	{
        // alert("add error : \n key "+ key +" \n value "+ value + "\n iserror " + isError);
	    // Tracker#: 17512 - SAFARI/FIREFOX: ERROR MESSAGE DSPLAY ON TRYING TO CREATE FIT EVAL THROUGH SAMPLES
		// Firefox & Safari return zero instead of empty string .  Adding check for zero.
		if(key!=null && value!=null && value.toString().length>0 && value!=0)
	    {
	        //alert("add error : added  \n key "+ key +" \n value "+ value + "\n iserror " + isError);
	        if(isError==true)this._mIsError = true;
	        this._arrErrorsKey[this._arrErrorsKey.length] = key;
	        this._arrErrors[this._arrErrorsKey.length-1] = value;
	    }
	}

    function _addWarning(value)
	{
        //alert("add error : \n key "+ key +" \n value "+ value + "\n iserror " + isError);
		// Firefox & Safari return zero instead of empty string.  Adding check for zero.
    	if(value!=null && value.toString().length>0 && value!=0)
	    {
	        this._arrErrorsKey[this._arrErrorsKey.length] = "warningInfo";
	        this._arrErrors[this._arrErrorsKey.length-1] = value;
	        this._mIsWarning = true;
	    }
	}

	function _addSuccess(value)
	{
		// Firefox & Safari return zero instead of empty string.  Adding check for zero.
		if(value!=null && value.toString().length>0 && value!=0)
	    {
	        this._arrErrorsKey[this._arrErrorsKey.length] = "successInfo";
	        this._arrErrors[this._arrErrorsKey.length-1] = value;
	    }
	}

	function _addConfirm(value)
	{
	    if(value!=null && value.toString().length>0)
	    {
	        this._arrErrorsKey[this._arrErrorsKey.length] = "confirmInfo";
	        this._arrErrors[this._arrErrorsKey.length-1] = value;
	    }
	}

	/**
	 * Prints only Ok button in the Confirmation Dialog.
	 * ST 19192 - Session Management.
	 */
	function _addConfirmOk(value)
	{
	    if(value!=null && value.toString().length>0)
	    {
	        this._arrErrorsKey[this._arrErrorsKey.length] = "confirmOkInfo";
	        this._arrErrors[this._arrErrorsKey.length-1] = value;
	    }
	}


    function _errorsCount()
    {
        return this._arrErrors.length;
    }

    function _getError(key)
    {
        //alert(" _getError : \n key = " + key + "\n this._arrErrors" + this._arrErrors);
        var ind = getErrorKeyInd(this._arrErrorsKey, key);
        //alert(" _getError : \n key = " + key + "\n ind = " + ind + "\n this._arrErrors["+ind+"]" + this._arrErrors[ind]) ;
        if(ind>-1)
        {
            return this._arrErrors[ind];
        }
        else
        {
            return null;
        }
    }

    function getErrorKeyInd(arrKey, key)
    {
        if(arrKey!=null && key!=null)
        {
            for(var i=0;i<arrKey.length;i++)
            {
                if(arrKey[i]==key)
                {
                    return i;
                }
            }
        }
        return -1;
    }

    function _hasErrorOccured()
    {
        return this._mIsError;
    }

    function _hasWarningOccured()
    {
        return this._mIsWarning;
    }

    return this;

}
