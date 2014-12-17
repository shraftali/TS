
/*************************************/
/*  Copyright  (C)  2002 - 2008      */
/*           by                      */
/*  TradeStone Software, Inc.        */
/*  Gloucester, MA. 01930            */
/*  All Rights Reserved              */
/*  Printed in U.S.A.                */
/*  Confidential, Unpublished        */
/*  Property of                      */
/*  TradeStone Software, Inc.        */
/*************************************/

function htmlData(docViewId, divContainerName, saveURL, isUserModified) //constructor
{
    var _mDocViewId = "";
    var _mDivContainerName = "";
    var _mNotifySaveModifiedData = "";    //if set to false, user wont get the message for saving the modified data
    var _mHasUserModifiedData = "";
    var _mSaveURL = "";
    var _mChangedFields = "";
    var _mActionMethod = "";
    var _CHANGED_FIELDS_SEPERATOR = "";

    // com.tradestonesoftware.plm.utils.PLMUIHelper to be udpated if changed here
    this._CHANGED_FIELDS_SEPERATOR = "@,";

    this._mDocViewId = docViewId;
    this._mDivContainerName = divContainerName;
    this._mSaveURL = saveURL;

    this._mNotifySaveModifiedData = true;
    this._mHasUserModifiedData = false;
    this._mChangedFields = new Array();
    //Tracker#:14459 REGRESSION ISSUE WITH ADVANCED SEARCH - RESULTS ARE NOT RETURNED FOR SOME OF THE FIELDS WHEN THEY SH
    this._mAppendContainerData = false;

    this.getDocViewId = _getDocViewId;
    this.getDivContainerName = _getDivContainerName;
    this.getSaveURL = _getSaveURL;
    this.setSaveURL = _setSaveURL;
    this.hasUserModifiedData = _hasUserModifiedData;
    this.isDataModified = _isDataModified;
    this.setNotifySaveModifiedData = _setNotifySaveModifiedData;
    this.getChangeFields = _getChangeFields;
    this.getSaveChangeFields = _getSaveChangeFields;
    this.resetChangeFields = _resetChangeFields;
    this.addToChangedFields = _addToChangedFields;
    this.removeFromChangedFields = _removeFromChangedFields;
    this.checkForChanges = _checkForChanges;
    this.performSaveChanges = _performSaveChanges;
    //Tracker#:14459 REGRESSION ISSUE WITH ADVANCED SEARCH - RESULTS ARE NOT RETURNED FOR SOME OF THE FIELDS WHEN THEY SH
    this.getAppendContainerData = _getAppendContainerData;
    this.setAppendContainerData = _setAppendContainerData;

    this._appendAllContainerDataToRequest = _appendAllContainerDataToRequest;
    this.appendChangeFieldsCtrlInfoToRequest = _appendChangeFieldsCtrlInfoToRequest;

    this.setActionMethod = _setActionMethod;
    this.clone = _clone;
    this.addAllChangedFieldsData = _addAllChangedFieldsData;
    this.appendAllCustomContainerDataToRequest = _appendAllCustomContainerDataToRequest;
    this.removeAllCustomContainerChangeFields = _removeAllCustomContainerChangeFields;
    this._removeControlInfoFromChangeFields = _removeControlInfoFromChangeFields;
    this.resetForm = _resetForm;
    this.isFieldModified = _isFieldModified;

    if(typeof(isUserModified)!='undefined')
    {
       this._mHasUserModifiedData = isUserModified;
    }

    function _clone()
    {
        return new htmlData(this._mDocViewId, this._mDivContainerName, this._mSaveURL);
    }

    function _getDocViewId()
    {
        return this._mDocViewId;
    }

    function _getDivContainerName()
    {
        return this._mDivContainerName;
    }

    function _getSaveURL()
    {
        return this._mSaveURL;
    }

    function _setSaveURL(saveURL)
    {
        this._mSaveURL = saveURL;
    }

    function _hasUserModifiedData()
    {
        return this._mHasUserModifiedData;
    }

    //Tracker#:14095 ISSUE WITH SAVE PROMPT:'THERE ARE CHANGES ON THE SCREEN.  DO YOU WANT TO SAVE..'
    //defined the function to identify the field data modified or not.
    function _isDataModified()
    {
        var dataMod = false;

        //alert("htmldata.js -> _isDataModified \n chgFlds:  " + this._mChangedFields);
        for (var index = 0; index < this._mChangedFields.length; ++index)
        {
            var item = this._mChangedFields[index];
            var obj = getElemnt(item);

            // alert(obj.outerHTML + " \n " + _isChangeFieldNotify(obj));

            if(obj && _isChangeFieldNotify(obj))
            {

                dataMod = true;
                break;
            }
        }
        //alert("isDataModified " +  dataMod);
        return dataMod;
    }

    ////Tracking#: 15106  - CANNOT OPEN ANY ROUNDS HIGHER THAN 1 ON SAMPLE EVALUATION
    /// method which reset the changefields to its original form
    function _resetForm()
    {
        //alert("htmldata.js -> _resetForm \n chgFlds:  " + this._mChangedFields);

        for (var index = 0; index < this._mChangedFields.length; ++index)
        {
            var item = this._mChangedFields[index];
            var obj = getElemnt(item);

            if(obj)
            {
                //alert(obj.outerHTML + " \n obj.defaultValue = " + obj.defaultValue + "---");

                //reset image association field if any
                var objImg = getElemnt("img_icon_"+ obj.id );

                if(objImg)
                {
                    //alert("objImg.defaultValue " + objImg.defaultValue);
                    objImg.src = objImg.defaultValue;
                }

                if(obj)
                {
                     //alert("obj.type = " + obj.type);
                     //Tracker#: 15802 TECH SPEC OVERVIEW SHOULD ALWAYS WARN USER WHEN THEY MAKE A CHANGE AND DO NOT SAVE
                     //ucheck the checked checkboxes once the form data is reset.
                     if(obj.type && obj.type.toUpperCase()=="CHECKBOX")
                     {
                        //alert('obj.defaultValue ' + obj.defaultValue);
                        if(obj.defaultValue && _isChangeFieldNotify(obj))
                        {
                            //alert("checked");
                            obj.checked=true;
                        }
                        else
                        {
                            //alert("-----unchecked-----");
                            obj.checked=false;
                        }
                     }
                     //alert("setting value " + obj.defaultValue);
                     obj.value = obj.defaultValue;
                }

                //reset validation fields
                if(_isDescField(obj))
                {
                    obj = getElemnt(obj.id + _FIELDS_SEPERATOR + "desc");

                    if(obj)
                    {
                       obj.value = obj.defaultValue;
                    }
                }
            }
        }
    }

    function _setNotifySaveModifiedData(bShowSaveModifiedData)
    {
        this._mNotifySaveModifiedData = bShowSaveModifiedData;
    }

    //function to add the changed fields id to the
    function _addToChangedFields(obj)
    {
        if(obj && !(this.isFieldModified(obj.id)))
        {
            this._mChangedFields[this._mChangedFields.length] = obj.id;
            this._mHasUserModifiedData = true;
        }
    }

    function _removeFromChangedFields(obj)
    {
        if(obj)
        {
            for (var index = 0; index < this._mChangedFields.length; ++index)
            {
                var item = this._mChangedFields[index];
                if(item==obj.id)
                {
                    //alert("_removeFromChangedFields : before deleting \n " + this._mChangedFields);
                    this._mChangedFields.splice(index,1);
                    //alert("_removeFromChangedFields : after deleting \n " + this._mChangedFields);
                }
            }

            if(this._mChangedFields.length==0)this._mHasUserModifiedData = false;
        }
    }

    //Tracker#:20816 exposed the method to individual object 
    //to indentify the changed field for the particular object 
    function _isFieldModified(objName)
    {    	
    	if(objName==null)
    	{
    		return false;
    	}
    	
	   	for (var index = 0; index < this._mChangedFields.length; ++index)
	   	{
	    	var item = this._mChangedFields[index];
	        if(item==objName)
	        {
	            return true;
	        }
	   	}
	   	return false;
    }

    function _getChangeFields()
    {
       //Tracker#: 16147 REQUEST SAMPLE POP-UP SCREEN DOES NOT CLOSE AFTER CREATING SAMPLE(S) 
       return this.getSaveChangeFields().split (this._CHANGED_FIELDS_SEPERATOR);
    }

    function _getSaveChangeFields()
    {
       //Tracker#:16391 THREADED MESSAGING NOT WORKING ON TECH SPEC
       //To append field separator at common place
       //Tracker#: 16147 REQUEST SAMPLE POP-UP SCREEN DOES NOT CLOSE AFTER CREATING SAMPLE(S)
       return this._mChangedFields.join(this._CHANGED_FIELDS_SEPERATOR);
    }

    function _resetChangeFields()
    {
    	this._mChangedFields = new Array();
    	this._mHasUserModifiedData = false;
    }

    function _checkForChanges()
    {
        //todo to add more logic in the future
        //can take method as param and check the action.
        return this._mHasUserModifiedData;
    }
    //Tracker#:14459 REGRESSION ISSUE WITH ADVANCED SEARCH - RESULTS ARE NOT RETURNED FOR SOME OF THE FIELDS WHEN THEY SH
    function _getAppendContainerData()
    {
        return this.mAppendContainerData;
    }
	//Tracker#:14459 REGRESSION ISSUE WITH ADVANCED SEARCH - RESULTS ARE NOT RETURNED FOR SOME OF THE FIELDS WHEN THEY SH
    function _setAppendContainerData(blnAppendOnlyChgFldData)
    {
        this.mAppendContainerData = blnAppendOnlyChgFldData;
    }

    function _performSaveChanges(callBackHandler, objHTMLAjaxparam)
    {
        //alert("htmldata.js->_performSaveChanges : \n objHTMLAjaxparam "+objHTMLAjaxparam);
        //if user has not modified then there is not point in saving
        //alert(this._mHasUserModifiedData);
        if(!this._mHasUserModifiedData)
        {
            //alert("user not changed");
           return false;
        }
        //todo check for required field values
        if(!objHTMLAjaxparam)
        {
            //alert("creating object \n this._mSaveURL " + this._mSaveURL + "\nthis._mActionMethod "+ this._mActionMethod);
            objHTMLAjax = new htmlAjax();
            objHTMLAjax.setActionURL(this._mSaveURL);
            objHTMLAjax.setActionMethod(this._mActionMethod);
            objHTMLAjax.setProcessHandler(callBackHandler);
        }
        else
        {
           objHTMLAjax =  objHTMLAjaxparam;
        }

        //add all the changefields to
        if(this.getChangeFields()!=null)
        {
            //alert("objHTMLAjax.parameter() " + objHTMLAjax.parameter());
            //alert("objHTMLAjax.parameter().count " + objHTMLAjax.parameter().count());
            //objHTMLAjax.parameter().add("name","value");
            //alert("_performSaveChanges: user modified \n" + this.getChangeFields().join(this._CHANGED_FIELDS_SEPERATOR));
            objHTMLAjax.parameter().add(_screenChangeFileds, this.getSaveChangeFields());
        }
        //Tracker#:14459 REGRESSION ISSUE WITH ADVANCED SEARCH - RESULTS ARE NOT RETURNED FOR SOME OF THE FIELDS WHEN THEY SH
        if(this.mAppendContainerData==true)
        {
           //alert("here");
            this._appendAllContainerDataToRequest(objHTMLAjax);
        }
        else
        {
            //Tracker#:14293 BOM PERFORMANCE BASED ON ATTACHED DOCUMENT
            //send only the changefield data within that container to the server side
            this.appendChangeFieldsCtrlInfoToRequest(objHTMLAjax, this.getChangeFields());
        }

        //alert("sending");
        objHTMLAjax.sendRequest();
        
        return objHTMLAjax;

    }

    ///Tracker#:12867 - OUTSTANDING TECH SPEC>MASS REPLACE ISSUES
    /// defined the functions to remove the changelist information
    /// from the given div container
    function _removeAllCustomContainerChangeFields(divContainerID)
    {
         var objCnt = getElemnt(divContainerID);

         if(objCnt)
         {
            //alert("_appendAllCustomContainerDataToRequest: inside container");
            //todo
            this._removeControlInfoFromChangeFields(objCnt, "INPUT");
            this._removeControlInfoFromChangeFields(objCnt, "SELECT");
            this._removeControlInfoFromChangeFields(objCnt, "TEXTAREA");
         }
    }

    function _removeControlInfoFromChangeFields(objCnt, tagName)
    {
        var objColl = objCnt.getElementsByTagName(tagName);

        if(objColl && objColl.length>0)
        {
            var cnt = objColl.length;

            for(var i=0;i<cnt;i++)
            {
                var objItm = objColl.item(i);

                if(objItm)
                {
                     this.removeFromChangedFields(objItm);
                }
            }
        }
    }

    function _appendAllCustomContainerDataToRequest(objHTMLAjax, divContainerID)
    {
         //alert("_appendAllCustomContainerDataToRequest \n divContainerID"+divContainerID);
         var objCnt = getElemnt(divContainerID);

         if(objCnt)
         {
            //alert("_appendAllCustomContainerDataToRequest: inside container");
            //todo
            _appendControlInfoToRequest(objHTMLAjax, objCnt, "INPUT");
            _appendControlInfoToRequest(objHTMLAjax, objCnt, "SELECT");
            _appendControlInfoToRequest(objHTMLAjax, objCnt, "TEXTAREA");
         }
    }
    //since 2009R4 aug 30 fixpack Tracker#:12564
    //added the parameter divName, which is the custom container div name
    // which will send all the data within that container to the server side
    function _appendAllContainerDataToRequest(objHTMLAjax, divName)
    {
         var objCnt = getElemnt(this._mDivContainerName);

         if(typeof(divName)!='undefined')
         {
            objCnt = getElemnt(divName);
         }

         if(objCnt)
         {
            //todo
            _appendControlInfoToRequest(objHTMLAjax, objCnt, "INPUT");
            _appendControlInfoToRequest(objHTMLAjax, objCnt, "SELECT");
            _appendControlInfoToRequest(objHTMLAjax, objCnt, "TEXTAREA");
         }
    }

    function _appendControlInfoToRequest(objHTMLAjax, objCnt, tagName)
    {
        var objColl = objCnt.getElementsByTagName(tagName);

        if(objColl && objColl.length>0)
        {
            var cnt = objColl.length;

            for(var i=0;i<cnt;i++)
            {
                var objItm = objColl.item(i);

                if(objItm)
                {
                    //if(showmsg==true)alert(objItm.id +" = " +objItm.value);
                    objHTMLAjax.parameter().add(objItm.id, objItm.value);
                }
            }
        }
    }

    //Tracker#:14293 BOM PERFORMANCE BASED ON ATTACHED DOCUMENT
    //defined the function to send only the changefield data
    //within that container to the server side
    function _appendChangeFieldsCtrlInfoToRequest(objHTMLAjax)
    {
        //alert("_appendChangeFieldsCtrlInfoToRequest \n chgFlds:  " + this._mChangedFields);
        for (var index = 0; index < this._mChangedFields.length; ++index)
        {
            var item = this._mChangedFields[index];
            var obj = getElemnt(item);
            if(obj)
            {
                //alert( " adding to params " + item + " = " + obj.value);
                objHTMLAjax.parameter().add(item, obj.value);
            }
        }
    }

    function _setActionMethod(act)
    {
        this._mActionMethod =act;
    }

    function _addAllChangedFieldsData(objHTMLAjax)
    {
        //try{
            if(this.hasUserModifiedData()==true)
            {
                 //alert("_addAllChangedFieldsData : user modified \n" + this.getChangeFields().join(this._CHANGED_FIELDS_SEPERATOR));

                objHTMLAjax.parameter().add(_screenChangeFileds, this.getSaveChangeFields());
                var chgFlds = this.getChangeFields();

                if((chgFlds.length!="undefined") && chgFlds.length>0)
                {
                    var cnt = chgFlds.length;

                    for (num = 0; num < cnt; num++)
                    {
                       var obj = getElemnt(chgFlds[num]);
                        if(obj)objHTMLAjax.parameter().add(obj.id, obj.value);
                    }
                }
                /*else if(chgFlds)
                {
                    var obj = getElemnt(chgFlds);
                    if(obj)objHTMLAjax.parameter().add(obj.id, obj.value);
                } */
            }
         //}catch(e){alert("_addAllChangedFieldsData : \n" + e.description);}
    }
}
