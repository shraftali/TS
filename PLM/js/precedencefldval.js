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
	@author AVijaykumar
*/
    var _PRE_ID_SEPERATOR = "-*-";

    function _predFreeSelClose(objDiv)
    {
        if(objDiv)
        {
            //htmomcponent.js function
            toggleDisplayVisible(objDiv, false);
        }
    }

    //this function is called from the drop down free text controls changed
    function __predFreeTxtSelChg(objSel, compId, hdnValFldId, hdnFreTxtId, hdnFreTxtDefaultId, divId)
    {
        //alert("changed called");
        var objCmp = getElemnt(compId);

        if(objCmp && objSel)
        {
            var id = objCmp.id;

            var objHdnDefFreTxtId = getElemnt(id + hdnFreTxtDefaultId);

            if(objHdnDefFreTxtId)
            {
                //alert("objHdnDefFreTxtId.value " +objHdnDefFreTxtId.value);
                objHdnDefFreTxtId.value = objSel.options[objSel.selectedIndex].value;

                var objDiv = getElemnt(id+divId);

                _predFreeSelClose(objDiv);      //hide the free text selection drop down
                _preChgFldsResetAll(objCmp, id + hdnValFldId, id + hdnFreTxtId, id + hdnFreTxtDefaultId);
            }
        }
    }

    // default component i.e text box on change
    function _preChgPrecedenceFld(obj, hdnValFldId, hdnFreTxtId, hdnFreTxtDefaultId)
    {
    	// Tracker#: 17639 - SAFARI/FIREFOX: COLORWAY NAME DISPLAY IS MISSING AFTER SAVE
    	// prevent clearing of auto suggest data from onchange function until onblur event of textbox.
    	if (VALIDATION && VALIDATION.suggested)
        {
        	return;
        }
    	//alert("_preChgPrecedenceFld called \n " + obj.outerHTML);
        //Tracker#: 15224 TSR-506 ARTWORK ON TECH SPEC
        //removed the autosuggest validation, multipost screnario was not working
        var id = obj.id;
        _preChgFldsResetAll(obj, id + hdnValFldId, id + hdnFreTxtId, id + hdnFreTxtDefaultId);
    }
    function _preChgFldsResetAll(objComp, hdnValFldId, hdnFreTxtId, hdnFreTxtDefaultId)
    {
        //alert("reset hdnValFldId " + hdnValFldId);
         //reset all the validation fields data to null
         //reset all the free text fields data to null
         // set the value to the  default free text component

         var objHdnValFld = getElemnt(hdnValFldId);
         //alert(hdnValFldId + "\n objHdnValFld " + objHdnValFld);
         if(objHdnValFld)
         {
             //alert("objHdnValFld " + objHdnValFld.value);
             _preChgFldsDataReset(objHdnValFld);
         }

         var objHdnFreTxt = getElemnt(hdnFreTxtId);
         //alert(hdnFreTxtId + "\n objHdnFreTxt " + objHdnFreTxt);

         if(objHdnFreTxt)
         {
             //alert("objHdnFreTxt " + objHdnFreTxt.value);
             _preChgFldsDataReset(objHdnFreTxt);
         }

         var objHdnDefFreTxtId = getElemnt(hdnFreTxtDefaultId);
         //alert(hdnFreTxtDefaultId + "\n objHdnDefFreTxtId " + objHdnDefFreTxtId);
         if(objHdnDefFreTxtId && objHdnDefFreTxtId.value)
         {
             var objDefFreTxt = getElemnt(objHdnDefFreTxtId.value);

             if(objDefFreTxt)
             {
                 objDefFreTxt.value = objComp.value;
                 if(objDefFreTxt.onchange)
                 {
                     //alert("free text onchange called");
                     objDefFreTxt.onchange();
                 }
             }
         }
         /**
          * 22877 fdd 562 bomc fillup filldown fillacross
          * Focus used to be hidden precedence field, that should be on 
          * origin object that is objComp, setting focus on that.
          */
         if(objComp.focus)
		 {
		 	objComp.focus();
		 }

  }
    function _preChgFldsDataReset(objHdn)
    {
        var sFldsCol = objHdn.value;
        //alert("_preChgFldsDataReset: sFldsCol " + sFldsCol);
        //cama seperated
        var obj;
        if(sFldsCol && sFldsCol.length>0)
        {
            var lstFldsCol = sFldsCol.toString().split(_PRE_ID_SEPERATOR);

            if(lstFldsCol.length)
            {
               var cnt = lstFldsCol.length;
               for(var i=0; i<cnt; i++)
               {
                  //alert(" lstFldsCol["+i+"] = "+ lstFldsCol[i]);
                  if(lstFldsCol[i] && getElemnt(lstFldsCol[i]))
                  {
                     //alert("inside lstFldsCol["+i+"] " + lstFldsCol[i]);
                    _preChgFldResetData(getElemnt(lstFldsCol[i]));
                  }
               }
            }
            else
            {
                _preChgFldResetData(getElemnt(lstFldsCol));
            }
        }


    function _preChgFldResetData(obj)
    {
        if(obj)
        {
            obj.value="";
            if(obj.onchange)
            {
                obj.onchange();
            }
        }
    }
    }

    function _precDispFreeTextSel(compId, divId, selId)
    {
        var divObj = getElemnt(compId+divId);
        //htmomcponent.js function
        toggleDisplayVisible(divObj, true);

        var selObj = getElemnt(compId+selId);

        if(selObj)
        {
            selObj.select;
            try
            {
                selObj.focus();
            }
            catch(e){}
        }
    }


    /**
     * Tracker#:22877 FDD 562 BOMC FILLUP FILLDOWN FILLACROSS
     * Precedence Fields related APIs.
     * 
     */
    var bomc={
    		_hasPrecedenceField : function (szFieldId)
    		{
    			var precedenceObj = getElemnt(szFieldId+"_preValflds");
    			
    			if(precedenceObj!=null && typeof precedenceObj!='undefined')
    				{
    					return precedenceObj;
    				}
    				
    			else
    				{
    					return null;
    				}
    		},
    		
    		_hasPrecedenceFreeTextDefField : function (szFieldId)
    		{
    			var precedenceDefFreeTextObj = getElemnt(szFieldId+"_preFreDefflds");
    			
    			if(precedenceDefFreeTextObj!=null && typeof precedenceDefFreeTextObj!='undefined')
    				{
    					var precedenceFreeTextObj = getElemnt(precedenceDefFreeTextObj.value);
    					if(precedenceFreeTextObj!=null && typeof precedenceFreeTextObj!='undefined')
    						{
    							return precedenceFreeTextObj;
    						}
    					
    				}
    			else
    				{
    					return null;
    				}
    		},
    		
    		_getPrecedenceFields : function (szFieldId)
    		{
    			var precedenceObj = bomc._hasPrecedenceField(szFieldId);
    			
    			if(bomc._hasPrecedenceField(szFieldId))
    				{
    					var fields =  precedenceObj.value;

    					var precedenceFields = fields.split(_PRE_ID_SEPERATOR);
    				}
    			
    			return precedenceFields;
    		},
    		
    		_getPrecedenceValueField : function (szFieldId)
    		{
    			var precedenceFields = bomc._getPrecedenceFields(szFieldId);
    			
    			for(var i =0; i<precedenceFields.length; i++)
    				{
    					var preceId = precedenceFields[i];
    					if(preceId && preceId.length >0)
    						{
    							var preceField = getElemnt(precedenceFields[i]);					
    							if(preceField && preceField.value)
    							{
    								return preceField;
    							}
    						}
    						
    				}
    			
    			return null;
    		},
    		
    		_getCurPrecedenceValueField : function (szParentFieldId, szCurFieldId)
    		{
    			var precedenceFields = bomc._getPrecedenceFields(szParentFieldId);
    			
    			if(precedenceFields)
    				{
    					for(var i =0; i<precedenceFields.length; i++)
    					{
    						var preceId = precedenceFields[i];
    						if(preceId && preceId.length >0)
    							{
    								var preceField = getElemnt(precedenceFields[i]);					
    								if(preceField && preceField.value)
    								{
    									var curprecedenceFields = bomc._getPrecedenceFields(szCurFieldId);
    									preceField = getElemnt(curprecedenceFields[i]);
    									return preceField;
    								}
    							}
    							
    					}
    				}
    						
    			return null;
    		},
    		_setPrecedenceFieldValue : function (parentObj, obj, filValCode)
    		{
    			var curpreceField = bomc._getCurPrecedenceValueField(parentObj.id, obj.id);
    			var preceField = bomc._getPrecedenceFields(obj.id);
    			if(curpreceField)
    				{
    				
    					//bomc._setPrecedenceObjValInkChg(preceField, filValCode);
    					bomc._setPrecedenceObjValInkChg(obj.id, parentObj.id);
    					var preceFreeTextField = bomc._hasPrecedenceFreeTextDefField(obj.id);
    					
    					if(preceFreeTextField!=null && preceFreeTextField.value)
    						{
    							if(preceFreeTextField.value.length > 0)
    								{
    									preceFreeTextField.value = "";
    								}
    						}
    				}
    		},
    		
    		 _setPrecedenceObjValInkChg : function (obj, parentObj)
    		 {
			 	/**
			 	 * Tracker#:23769 ARTWORK INFORMATION IS MISSED IN SMART TAG ON PERFORMING FILL UP/DOWN/ACROSS IN BOMC SCREEN
			 	 * loop through all the precedence fields and set the values
			 	 */
			 	var precedenceFields = bomc._getPrecedenceFields(parentObj);
    			if(precedenceFields)
    				{
    					for(var i =0; i<precedenceFields.length; i++)
    						{
        						var preceId = precedenceFields[i];
        						if(preceId && preceId.length >0)
        							{
	        							var preceField = getElemnt(precedenceFields[i]);
	        							
	    								if(preceField && preceField.value)
	    								{
	    									var curprecedenceFields = bomc._getPrecedenceFields(obj);
	    									var curpreceObjFld = getElemnt(curprecedenceFields[i]);		    									
	    									if(curpreceObjFld)
	    				    				{
	    										curpreceObjFld.value = preceField.value;
	    				    					if(curpreceObjFld.onchange)
	    				    					{
	    				    						curpreceObjFld.onchange();
	    				    					}
	    				    				}
	    								}
        							}
    						}
    				}
    		 }
    }