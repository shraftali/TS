/** ********************************** */
/* Copyright (C) 2002 - 2009 */
/* by */
/* TradeStone Software, Inc. */
/* Gloucester, MA. 01930 */
/* All Rights Reserved */
/* Printed in U.S.A. */
/* Confidential, Unpublished */
/* Property of */
/* TradeStone Software, Inc. */
/** ********************************** */


var selectedTab='_tab0CenterCell';

// This function forwards the user to Fit Evaluation Overview Screen.
function showFitEvaluationOverview(obj)
{
	Process.showOverview(obj, "fitevaloverview.do", "view");
}

function fetchSampleDetails(row,sizeCode)
{
   var curBodyRow = getElemnt("curBodyRow");
   curBodyRow.value = "" + row;
   var slSampleSizeCode = getElemnt("slSampleSizeCode");
   slSampleSizeCode.value = sizeCode;
   var url = "fetchsampledtls&curBodyRow=" + row + "&slSampleSizeCode=" +  sizeCode;  
   loadWorkArea("fitevaloverview.do", url);
}

//Tracker#16853
//sample info link on the sample no fields.
function _fitEval_fetchRowSampleDtls()
{
   //alert("Sample Info");   
   var url = "fetchSltSampledtls&keyinfo="+getComponentKeyInfo();   
   loadWorkArea("fitevaloverview.do", url);
}

// ------------------------------------------------
// Align the Detail Header("Points of Measure | Sample Specification
// to the Grading and Detail sections
// ------------------------------------------------
function _fitEvalAlignDetailPOMHeader(tblMainid, tdPOMid,
                        tdSmplid, tblLftId, tblRtId)
{
    var divObj = document.getElementById("_divDataWorkArea");
    if(divObj)
    {
        divObj.style.overflowX="hidden";
    }

    // Cell with the "Points of Measure" title text.
    var objTdPOM = getElemnt(tdPOMid);
    // Cell with the "Sample specification" title text.
    var objTdSmpl = getElemnt(tdSmplid);

    // Left Side table in the Freezed section
    var objTblLft = getElemnt(tblLftId);
    // Right Side table in the Freezed section
    var objTblRt = getElemnt(tblRtId);

    // var objDataDiv = getElemnt(dtlDataDivid);
    // Main Section table
    var objTblMain = getElemnt(tblMainid);
    // if(objTdPOM && objTblLft && objTblMain && objDataDiv && objTdSmpl && objTblRt)
    if(objTdPOM && objTblLft && objTblMain && objTdSmpl && objTblRt)
    {
        // Align the "Points of Measure" cell to that of the Grading table
        setWidth(objTdPOM, parseFloat(objTblLft.offsetWidth));

        // Align the "Sample Specification" cell to that of the Detail table
        var tdSmplWidth = parseFloat(objTdSmpl.offsetWidth);
        setWidth(objTdSmpl, (parseFloat(objTblMain.offsetWidth)-parseFloat(objTblLft.offsetWidth)));
        // Align the data Right side table also to match that of the Sample Specification
        setWidth(objTblRt, (parseFloat(objTblMain.offsetWidth)-parseFloat(objTblLft.offsetWidth)));
    }
}

//--------------------------------------------
// Tracker#: 13071  FIT EVAL DELTA NO LONGER CALCULATING
// Need to handle the calculation if the Number Format is
// "fraction" the displayed values will be fraction ex: 3 1/14, 2/17 etc.,
// Cannot do a simple subtraction and fixing the scale for such numbers.
// Making a ajax call to use the Formatter to do the job.
// TODO need to implement
//--------------------------------------------
function cDifference(changedObj, secondFieldId, deltaFieldId, fieldIdentifier, osActualFieldId, osDeltaFieldId)
{
    var objName = changedObj.getAttribute("NAME");

    //alert("loadToolArea : general ");
    var objAjax = new htmlAjax();
    if(objAjax)
    {
        var url = "fitevaloverview.do";
        var actionMethod = "caldelta";
        var firstFieldName = changedObj.getAttribute("NAME");
        var docview = changedObj.getAttribute("docviewid");
        if(docview && docview == 2411)
        	{
        		url = "fitmultiwindow.do";
        	}
        // Identify either the other field used in the Delta
        // calculation by using the current object name and replacing that
        // field id by the other field it while retaining the other identifiers
        // Ex: section-id_doc-id_field-id_level-id_page-row-no_actual-row
        var secondFieldName = getOtherFieldName(firstFieldName, secondFieldId);
        var osActualFieldName = getOtherFieldName(firstFieldName, osActualFieldId);
        var osDeltaFieldName = getOtherFieldName(firstFieldName, osDeltaFieldId);
        
        var actualMeas;
        var specMeas;
        var osActualMeas;
        // Tracker#:18828 FIT EVAL MEASUREMENT FIELDS FOR OS OFFICE ON SAME SAMPLE RECORD
        // If os_actual_meas field is shown in screen, then pass the os_actual_meas value and os_diff_meas field name in 
        // action method so calculated os_diff_meas value would be placed in the field and onchange event would be attached,
        // similar to diff_meas field. 
        if(osActualFieldId != 'null')
        {
        	actualMeas = getElemnt(secondFieldName);
			specMeas = getElemnt(firstFieldName);
			osActualMeas = getElemnt(osActualFieldName);
	                            
			objAjax.parameter().add("specMeas", specMeas.value);
			
			if(actualMeas!=null && actualMeas!='undefined')
			{
				objAjax.parameter().add("actualMeas", actualMeas.value);
			}	                            
			
			objAjax.parameter().add("deltafieldname",  getOtherFieldName(firstFieldName, deltaFieldId));
			objAjax.parameter().add("osActualMeas", osActualMeas.value);
			objAjax.parameter().add("osDeltalFieldName", osDeltaFieldName);
			
        }
        else
        {
        	if(fieldIdentifier == "A")
	        {
	            actualMeas = getElemnt(firstFieldName);
	            specMeas = getElemnt(secondFieldName);
	        }
	        else
	        {
	            actualMeas = getElemnt(secondFieldName);
	            specMeas = getElemnt(firstFieldName);
	        }
	
	        objAjax.parameter().add("specMeas",   specMeas.value);
	        if(actualMeas!=null && actualMeas!='undefined')
			{
				objAjax.parameter().add("actualMeas",   actualMeas.value);
			}	                 
	        objAjax.parameter().add("deltafieldname",  getOtherFieldName(firstFieldName, deltaFieldId));
				                            
     	}
     	
        objAjax.setActionURL(url);
        objAjax.setActionMethod(actionMethod);
        objAjax.setProcessHandler(setCalculatedDelta);
        objAjax.sendRequest();
    }
}

// Ajax Call back function for the actual
// meas and Spec Meas onchange event handler
function setCalculatedDelta(objAjax)
{
    if(objAjax)
    {
    	if(bShowMsg==true)
    	{
    		msgInfo = objAjax.getAllProcessMessages();

		    if(msgInfo!="")
		    {
		       //_displayUserMessage(msgInfo);
		        _displayProcessMessage(objAjax);
		    }
    	}

    	var diffMeasField = objAjax.getResponseHeader("deltafieldname");
    	var osDiffMeasField = objAjax.getResponseHeader("osDeltalFieldName");

    	if(diffMeasField != "")
    	{
            var oc = document.getElementsByName(diffMeasField);
            if(oc) oc = oc[0];
            if(oc)
            {
            	oc.value = objAjax.getResponseHeader("newdeltavalue");
            	oc.onchange();
           	}
        }
        // Tracker#:18828 FIT EVAL MEASUREMENT FIELDS FOR OS OFFICE ON SAME SAMPLE RECORD
        // If os_diff_meas field is shown on the screen, place the calcualted os_diff_meas value from
        // response header.
        if(osDiffMeasField!= "")
        {
        	var osDiffMeas = document.getElementsByName(osDiffMeasField);
        	if(osDiffMeas) osDiffMeas = osDiffMeas[0];
        	if(osDiffMeas)
        	{
	        	osDiffMeas.value = objAjax.getResponseHeader("newosdeltavalue");
    	    	osDiffMeas.onchange();
        	}
        }

        bShowMsg= false;
    }
}

function getOtherFieldName(firstFieldName, otherFieldId)
{
    if(firstFieldName == null || firstFieldName == "") return;

    var splitFieldName = firstFieldName.split(_FIELDS_SEPERATOR);
    // The Name will be of the format:
    // section-id_doc-id_field-id_level-id_page-row-no_actual-row
    // replace the field_id with the other field id.
    var secondFieldName = "";
    for(var i = 0 ; i < splitFieldName.length ; i++)
    {
        if (i != 0)
        {
            secondFieldName += _FIELDS_SEPERATOR;
        }
        // the 3rd element will be the Field_Id
        if(i == 2)
        {
            secondFieldName += otherFieldId;
        }
        else
        {
            secondFieldName += splitFieldName[i];
        }
    }
    return secondFieldName;
}

function sortFitDetails()
{
   var url = "sort";
   // Tracker#:18081 MAINTAIN USER'S PLACE ON THE SCREEN AFTER ADDING, DELETING, SORTING AND COPYING POM CODES
   // passed _showWorkArea_scroll to maintain the vertical scroll position on the screen.
   loadWorkArea("fitevaloverview.do", url, null, _showWorkArea_scroll);
}

function lockSamples()
{
    var url = "locksamples";
    loadWorkArea("fitevaloverview.do", url);
}

function updatePOMAssociation()
{
    var url = "updatepom";
    loadWorkArea("fitevaloverview.do", url);
}

function printReportsByLevel(id, level, name)
{
   if(!isValidRecord(true))
	{
		return;
	}
    var objHtmlData = _getWorkAreaDefaultObj().checkForNavigation();

    if(objHtmlData!=null && objHtmlData.hasUserModifiedData()==true)
    {
        //perform save operation
        objHtmlData.performSaveChanges(_defaultWorkAreaSave);
    }
    else
    {
    	//Tracker#:24993 - UPGRADE: RUNNING FITEVAL REPORT CAUSES ERROR
    	var str = 'report.do?id=' + id + '&reportname=' + name + '&level=' + level + '&reportname=' + name +'&rows='+$("#curBodyRow").attr("value");
    	
    	oW('report', str, 800, 650);
	}
    
	
}



function printReports(id, level, name)
{
    //Tracker# 13972 NO MSG IS SHOWN TO THE USER IF THERE ARE CHANGES ON THE SCREEN WHEN USER CLICKS ON THE REPORT LINK
	//Check for the field data modified or not.
	if(!isValidRecord(true))
	{
		return;
	}
    var objHtmlData = _getWorkAreaDefaultObj().checkForNavigation();

    if(objHtmlData!=null && objHtmlData.hasUserModifiedData()==true)
    {
        //perform save operation
        objHtmlData.performSaveChanges(_defaultWorkAreaSave);
    }
    else
    {
    	//Tracker#:24993 - UPGRADE: RUNNING FITEVAL REPORT CAUSES ERROR
    	var str = 'report?id=' + id + '&method=customreports' + '&level=' + level + '&reportname=' + name+'&curRowNumber='+$("#curBodyRow").attr("value");
    	oW('report', str, 800, 650);
	}
}

// Navigate from the tech spec screen from the fiteval screen
function _fitEval_ShowTechSpec()
{
    var targetMethod = null;
    var owner = getElemnt("owner");
    var requestNo = getElemnt("requestno");

    if((owner != null) &&  (requestNo != null))
    {
        targetMethod = 'viewFromFITEVAL$OWNER=' + owner.value + '$REQUEST_NO=' +  requestNo.value;
        var navInfo = "techspecoverview.do";
        _gotoPMLScreen(navInfo, targetMethod);
    }
    else
    {
        alert('There is no Tech Spec available.');
    }
}

// Navigate from Fit Eval screen to POM association screen
/*Tracker#:19415 IMPLEMENTATION OF SECURITY FILTER ON POINT OF MEASURE/POM 	
 Do the security check for POM record in Fit Evaluation action class , before move to corresponding
 POM   
 */
function showTechSpecPom()
{
	closeMsgBox();
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objAjax.getDivSectionId();
    var url ="pomsecuritycheck";
	bShowMsg = true;   	
	objAjax.setActionURL("fitevaloverview.do");
	objAjax.setActionMethod(url);
	objAjax.setProcessHandler(_showTechSpecPom0);
	objAjax.sendRequest();
}
/*
 Tracker#:19415 IMPLEMENTATION OF SECURITY FILTER ON POINT OF MEASURE/POM 	
 If security check is passed continue to show the POM record, otherwise reload the
 Fit Evaluation screen.
*/
function _showTechSpecPom0(objAjax)
{
	var securityCheck = ""
	if(objAjax)
    {
    	if(bShowMsg==true)
    	{
    		msgInfo = objAjax.getAllProcessMessages();

		    if(msgInfo!="")
		    {
		       //_displayUserMessage(msgInfo);
		        _displayProcessMessage(objAjax);
		    }
    	}
    
        securityCheck = objAjax.getResponseHeader("securityaccess");
    }

    if(securityCheck=='true')
    {
		var targetMethod = null;
	    var owner = getElemnt("owner");
	    var requestNo = getElemnt("requestno");
	
	    if((owner != null) &&  (requestNo != null))
	    {
		    targetMethod = 'viewFromFitevalToPOM$OWNER=' + owner.value + '$REQUEST_NO=' +  requestNo.value;
			var navInfo = "techspecoverview.do";
		    _gotoPMLScreen(navInfo, targetMethod);
	    }
	    else
	    {
		    alert('There is no Tech Spec available.');
	    }
	}
	else
	{	
		//alert("reload");
		_reloadArea(objAjax, sectionName);
        bShowMsg= false;
	}	    
}

function deleteFitEval()
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objAjax.getDivSectionId();
    var url ="delete";
    
    
    if(!isValidRecord(true))
	{
		return;
	}
	
	if(objAjax && objHTMLData)
	{
		docview = objAjax.getDocViewId();		
    	// alert("docview: "+docview);
    	// alert("inside calling");
		if(objHTMLData!=null && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
		{
			var htmlErrors = objAjax.error();
		    htmlErrors.addError("confirmInfo", szMsg_Changes,  false);	
		    var saveFunc = '_saveFitEval()';
		    var cancelFunc = 'doNothing()';
		    messagingDiv(htmlErrors, saveFunc, cancelFunc);
		    return;
		}
    	if(objHTMLData!=null)
    	{
    			var htmlErrors = objAjax.error();
    			htmlErrors.addError("confirmInfo", "Do you want to delete this Fit Evaluation?",  false);
   				messagingDiv(htmlErrors,'_deleteFitEvalOverview()', 'doNothing()');
    	}    	
    }	
}

function _saveFitEval()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	
	objHtmlData.performSaveChanges(refreshFields);
 	if(objAjax.isProcessComplete())
   	{
       objHTMLData.resetChangeFields();
   	}
}


function _fitevalDetailDelete()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    
    if(!isValidRecord(true))
	{
		return;
	}
    
    if(objHTMLData!=null && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
	{
		var htmlErrors = objAjax.error();
	    htmlErrors.addError("confirmInfo", szMsg_Changes,  false);	
	    var saveFunc = '_saveFitEval()';
	    var cancelFunc = 'doNothing()';
	    messagingDiv(htmlErrors, saveFunc, cancelFunc);
	    return;
	}
    
    if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
	{
    	var msg_select_pom_codes_hdn =  document.getElementById("msg_504577");
    	var msg_select_pom_codes = (msg_select_pom_codes_hdn.value)?msg_select_pom_codes_hdn.value: "Please select the POM Code(s) to delete.";
    	var htmlErrors = objAjax.error();
		htmlErrors.addError("warningInfo", msg_select_pom_codes, false);
		messagingDiv(htmlErrors);
		return;
	}
    else
	{
    	// Tracker#:17108 ERROR WHEN DELETING MORE THAN ONE FIT EVAL DETAIL LINE
		// delete detail records.
		var chgFlds = objHTMLData.getChangeFields();
		var isDtlChck = false;
		if(chgFlds && chgFlds.length>0)
		{
			 for (num = 0; num < chgFlds.length; num++)
	          {
					var obj = chgFlds[num];
					if(obj!=null && obj.startsWith(_CHK_BOX_DEFAULT_ID))
					{
						isDtlChck = true;
					}
             }
             
            if(isDtlChck)
            {
            	var msg_confrm_pom_codes_delete_hdn =  document.getElementById("msg_504578");
            	var msg_confrm_pom_codes_delete = (msg_confrm_pom_codes_delete_hdn.value)?msg_confrm_pom_codes_delete_hdn.value: "Do you want to delete the selected POM Code(s)?";
            	var htmlErrors = objAjax.error();
				htmlErrors.addError("confirmInfo", msg_confrm_pom_codes_delete,  false);
				messagingDiv(htmlErrors,'_fitevalPomCodeDelete()', 'cancelProcess()');
            } 
		}
	}
}

function _fitevalPomCodeDelete()
{	
	// Tracker#:17108 ERROR WHEN DELETING MORE THAN ONE FIT EVAL DETAIL LINE
	closeMsgBox();
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objAjax.getDivSectionId();
    var url ="deletedetail";
	bShowMsg = true;   	
	objAjax.setActionURL("fitevaloverview.do");
	objAjax.setActionMethod(url);
	objAjax.setProcessHandler(_showColorLibPage);
	objHTMLData.performSaveChanges(_showColorLibPage, objAjax);
	if(objAjax.isProcessComplete())
  	{
      objHTMLData.resetChangeFields();
  	} 
}

function _deleteFitEvalOverview()
{
	// Tracker#:17108 ERROR WHEN DELETING MORE THAN ONE FIT EVAL DETAIL LINE
	var url = "delete";
    deleteRecord = true;
    Main.loadWorkArea("fitevaloverview.do", url, "", _showWorkAreaReloadNavigation);
}

function doNothing()
{
    closeMsgBox();
}

var deleteRecord = false;

// --------------------------------

function initiateSample()
{
    var htmlAreaObj = _getWorkAreaDefaultObj();
	//alert("htmlAreaObj " + htmlAreaObj);
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();

	var actMethod ="listsizecodes";
    if(objAjax)
    {
    	var htmlfldName = htmlAreaObj.getDivSectionId();
    	//alert("showView : objAjax "  + objAjax.getDocViewId());
    	_startSmartTagPopup(htmlfldName, false, null, true);
        objAjax.setActionURL("fitevaloverview.do");
        objAjax.setActionMethod(actMethod);
        objAjax.attribute().setAttribute("htmlfldName", htmlfldName);
        objAjax.setProcessHandler(_showSmartTagInteractivePopup);
        //alert("sending");
        objAjax.sendRequest();
    }
}

function addSizeCode()
{
    var actionMethod = "addnewsample";
    // loadWorkArea("", url);
    addNewSample("fitevaloverview.do", actionMethod);
}

function addNewSample(url, actionMethod)
{
    var objHtmlData = _getWorkAreaDefaultObj().checkForNavigation();
    var divSaveContainerName1 =  _getWorkAreaDefaultObj().getDivSaveContainerName();
    if(objHtmlData!=null && objHtmlData.hasUserModifiedData()==true)
    {
        // Remove the MsgBox and the Pop Up from the document
        // object only after knowing the required objects value
        closeMsgBox();
        _closeSmartTag();
        //perform save operation
        objHtmlData.performSaveChanges(_defaultWorkAreaSave);
    }
    else
    {
        // Not using the loadWorkArea as we read the hidden component
        // for the field name and then send the same in the
        // ajax request
        _getWorkAreaObj().setDivDefaultSaveContainerName(divSaveContainerName1);
        var objAjax = _getWorkAreaDefaultObj().getHTMLAjax();
        if(objAjax)
        {
            // read the Sample Type field name displayed on the POP UP
            var grdSampleTypeHdn = eval("document.all.grdSampleType");
            var grdSampleTypeFieldName = grdSampleTypeHdn.value;
            // Get the actual field.
            var grdSampleType = getElemnt(grdSampleTypeFieldName);
            //Tracker#: 22772 - PROVIDE SOFT MSG IF THE SAMPLE TYPE IS BLANK ON INITIAL SAMPLE ON FITEVAL
            //check for SampleType and if it is null then display the confirm message to proceed further
            if(!grdSampleType.value)
            {
            	var confMsgHdn = document.getElementById("confMsg");
            	//check for the message 
            	if(confMsgHdn.value)
            	{
            		var htmlErrors = objAjax.error();
            		htmlErrors.addError("confirmInfo", confMsgHdn.value,  false);
					messagingDiv(htmlErrors, 'doNothing()', "proceedToAddNewSample('"+url+"','"+actionMethod+"','"+grdSampleType.value+"')");
				}
			}
			else
			{
            	proceedToAddNewSample(url, actionMethod, grdSampleType.value);
            }
        }
    }
}
function proceedToAddNewSample(url, actionMethod, grdSampleTypeValue)
{
	var objAjax = _getWorkAreaDefaultObj().getHTMLAjax();
	var defaultProcessHandler = _showWorkArea;
    // radioButton.value will always sends the first radio button
    // value and not the selected one. So identify the
    // selected one and then send the same.
    var grdSampleSize = getSelectedValue("rdGrdSample");
    objAjax.parameter().add("rdGrdSample", grdSampleSize);
    objAjax.parameter().add("grdSampleType", grdSampleTypeValue);
    objAjax.setActionURL(url);
    objAjax.setActionMethod(actionMethod);
    objAjax.setProcessHandler(defaultProcessHandler);
    // Remove the MsgBox and the Pop Up from the document
    // object only after knowing the required objects value
    closeMsgBox();
    _closeSmartTag();
    objAjax.sendRequest();
}

function getSelectedValue(radioObjName)
{
    var radioOptions = document.getElementsByName(radioObjName);

    if(radioOptions)
    {
        for(var i = 0; i < radioOptions.length ; i++)
        {
            if(radioOptions[i].checked)
            {
                return radioOptions[i].value;
            }
        }
    }
    return radioObjName.value;
}

function checkForDetailSelection(chgFields)
{
    //var splitChgFields = chgFields.split(",");
    var rowNos = "";
    var returnVar = new Array(2);

    if(chgFields != null && chgFields.length > 0)
    {
        for(var i = 0 ; i < chgFields.length ; i++)
        {
            var fieldName = chgFields[i];
            if(fieldName.startsWith(_CHK_BOX_DEFAULT_ID))
            {
                var rowNo = _getRepeateCountFromCompName(fieldName);
                rowNos+= rowNo + ",";
            }
            else
            {
                returnVar[0] = "true";
            }
        }

        if(rowNos.length > 0 )
        {
            returnVar[1] = rowNos.substr(0, rowNos.length - 1);
        }
        else
        {
            returnVar[1] = "";
        }
    }
    return returnVar;
}

// Why another method similar to _showWorkArea?
// Need to call the refreshNavigationGrid method, because if there are any delete then
// the Navigation Grid also needs to be refreshed.
// As clicking on a invalid record usually takes to a New record in other places
// but in FitEval a new record is always created via a process in POM
function _showWorkAreaReloadNavigation(objAjax)
{
    try
    {
        if(objAjax)
        {
            _displayProcessMessage(objAjax)
            // alert("_showWorkArea: \n _getWorkAreaObj().getDivSaveContainerName() " + _getWorkAreaObj().getDivSaveContainerName());
            var div=getElemnt(_getWorkAreaObj().getDivSaveContainerName());
            workAreaDivsList = new Array();

            if(div)
            {
                registerHTML(div,objAjax);
            }

            // If the process is failure and the Process is
            // deleting Fit Eval record then empty the area
            // and allow the user to Search again.
            if(!objAjax.isProcessComplete() && deleteRecord)
            {
                div.innerHTML = "";
            }
            deleteRecord = false;

            refreshNavigationGrid(objAjax);

            alignWorkAreaContainer();

            if(nCurScrWidth > MinimumScrWidth)
            {
                resetAllMainDivs();
            }
            //reset autosuggest instances
            /*if(typeof(_autoSuggestReset)=="function")
            {
                _autoSuggestReset();
            }*/
        	if (objAjax._mSetChangeFlagsOnLoad == true)
        	{
                var workArea  = _getWorkAreaDefaultObj();
                var docData = workArea.getHTMLDataObj();
                docData._mHasUserModifiedData=true;
        	}
        }
    }
    catch(e)
    {
        //alert(e.description);
    }
}
// Tracker#: 14225  FIT EVAL ENHANCEMENT FOR SIZE SETS
function addSample()
{
    // If the "Lock Size Set" process has been run
    // the entire Size Set is locked cannot
    // modify to add more Samples.
    var sampleLocked = getElemnt("sampleLocked");
    if(sampleLocked && typeof(sampleLocked) != 'undefined')
    {
        var isSampleLocked = sampleLocked.value;
        if(isSampleLocked == "true")
        {
            var sz_msg = "Cannot proceed with Add Samples as Size Set is in Locked Status.";

            //_displayUserMessage(sz_msg);
            var objAjax = new htmlAjax();
    		// objAjax.error().addError("errorInfo", sz_msg, true);
    		objAjax.error().addError("warningInfo", sz_msg, false);
    		_displayProcessMessage(objAjax);
    		return;
        }
    }

	 var htmlAreaObj = _getWorkAreaDefaultObj();
	//alert("htmlAreaObj " + htmlAreaObj);
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();

	var actMethod ="listsamples";
    if(objAjax)
    {
    	objAjax.setActionURL("fitevaloverview.do");
        objAjax.setActionMethod(actMethod);
        objAjax.setProcessHandler(_showSamplesPopup);
        objAjax.sendRequest();
    }
}
// Tracker#: 14225  FIT EVAL ENHANCEMENT FOR SIZE SETS
function _showSamplesPopup(objAjax)
{
	showMsg2(objAjax.getHTMLResult(), true);
}

// Tracker#: 14225  FIT EVAL ENHANCEMENT FOR SIZE SETS
function addSizeSetSamples(sz)
{
    var splt=sz.split(",");
    var szEl='',QtyEl='';
    var str='';
    for(var i=0;i<splt.length;i++)
    {
    	szEl=getElemnt("size_"+i);

    	QtyEl=getElemnt("quantity_"+i);

    	if(szEl && QtyEl){
    		str+=szEl.value+"~"+QtyEl.value+",";
    	}
    }

    var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	var url ="addsizesetsamples&sizes="+str;
    if(objAjax)
    {
    	loadWorkArea("fitevaloverview.do", url);
    }
    closeMsg();
}
// Tracker#: 14225  FIT EVAL ENHANCEMENT FOR SIZE SETS
function deleteSizeSetAttachment()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    var docview;
   	if(objAjax)
   	{
	    if(!isValidRecord(true))
		{
			return;
		}
   		docview = objAjax.getDocViewId();
   		var htmlErrors = objAjax.error();
	   	if(docview==10009)
	  	{
			if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
			{
				var htmlErrors = objAjax.error();
				objAjax.error().addError("warningInfo", szMsg_Sel_M_Row, false);
				messagingDiv(htmlErrors);
				return;
			}
		    htmlErrors.addError("confirmInfo","Do you want to delete Attachment(s)?",  false);
		}
		messagingDiv(htmlErrors,'ssAttchDelete()','ssAttchCancel()');
	}
}
// Tracker#: 14225  FIT EVAL ENHANCEMENT FOR SIZE SETS
function ssAttchCancel()
{
	var url = "db_refresh";
	closeMsgBox();
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    var docview = objAjax.getDocViewId();
  	if(docview==10009)
     {
         loadWorkArea("sizesetoverviewattachment.do", url);
         return;
     }
}
// Tracker#: 14225  FIT EVAL ENHANCEMENT FOR SIZE SETS
function ssAttchDelete()
{
	var url = "delete";
	var docview;
	//closeMsgBox();
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
   	var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objAjax.getDivSectionId();
    objAjax.setActionURL("sizesetoverviewattachment.do");
	objAjax.setActionMethod(url);
	objAjax.setProcessHandler(_showSubmitWorkArea);
	objHTMLData.performSaveChanges(_showSubmitWorkArea, objAjax);
    if(objAjax.isProcessComplete())
    {
        objHTMLData.resetChangeFields();
    }
    return;
}
// Tracker#: 14225  FIT EVAL ENHANCEMENT FOR SIZE SETS
function refreshSizeSetAttachment()
{
	var url = "db_refresh";
	var docview;
	//closeMsgBox();
	var htmlAreaObj = _getWorkAreaDefaultObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    sectionName = objAjax.getDivSectionId();

	if(objAjax && objHTMLData)
	{
		loadWorkArea("sizesetoverviewattachment.do", url);
	}
}
function donothing()
{
    return;
}

// Tracker#: 14225  FIT EVAL ENHANCEMENT FOR SIZE SETS
function lockSizeSet()
{
    // If the "Lock Size Set" process has been run
    // the entire Size Set is locked cannot
    // modify to add more Samples.
    var sampleLocked = getElemnt("sampleLocked");
    if(sampleLocked && typeof(sampleLocked) != 'undefined')
    {
        var isSampleLocked = sampleLocked.value;
        if(isSampleLocked == "true")
        {
            var sz_msg = "Size Set is Currently in Locked Status.";

            //_displayUserMessage(sz_msg);
            var objAjax = new htmlAjax();
    		objAjax.error().addError("warningInfo", sz_msg, false);
    		_displayProcessMessage(objAjax);
    		return;
        }
    }

    var url = "locksizeset";
    loadWorkArea("fitevaloverview.do", url);
}

//Tracker#16853
//Navigate from fiteval to sample screen.
function _fitEval_showSample()
{
	//alert("Sample");
	var url ="VIEWFITEVALSAMPLE&keyinfo="+getComponentKeyInfo();
    loadWorkArea("fitevaloverview.do", url, null, _fitEval_ShowSampleRecords);
    return;
}

//Tracker#16853
//Navigate from fiteval to sample screen.
function _fitEval_ShowSampleRecords()
{
    //alert("Sample");
	var url ="MAIN_LINK_NAVIGATION&action=4000";
    /*
     * Tracker#:18327 SQL ERROR RECEIVED AFTER EXECUTING A PROCESS ON SAMPLE TRACKING IF NAVIGATED IN FROM FIT EVAL
     * Temporary fix, on navigating from Fit Evaluation to Sample Tracking, removed the Fit Evaluation search records
     * on left navigation, to avoid error on click of Fit Evaluation records.   
     * TODO: need to show the Sample Tracking link, instead of Fit Evalation link on left naviagtion.  		
	 */ 
    loadWorkArea("advsearch.do", url, null, loadSampleNavigationGrid);
    return;
}
// Tracker#:18762 ERROR RECEIVED WHEN USING LEFT HAND NAVIGATION FOR FIT EVAL
// reloading the left navigation panel for Sample Tracking list view, when control come from Fit Evaluation to Sample Tracking
function loadSampleNavigationGrid(htmlNavAjax)
{	
	htmlNavAjax.setActionURL("sampletracking.do");
	loadNavigationGrid(htmlNavAjax);
	toggleCollapExpandNavigator('nav30_navigatorCenterCol','_tabcontainer',arrNavViewer,'clsNavigatorViewSelHeading','clsNavigatorViewNotSelHeading', '_divWorkAreaContainer');
	restoreArea(designCenterTabId);
	pna('cdiv','4000'+ designCenterTabId +'nav',designCenterTabId,'left');
}


// Tracker#:17724 SORT ARROW DOES NOT WORK ON FIT EVAL LIST VIEW
// method to sort the list records based on field name, by
// provide fieldname, sorty order and pageno to serverside.

function sortFitEvalColumn(fieldName,sec,type, pageNo)
{
    //alert("sortMaterialColumn called");
    sectionName = sec;
    var objAjax = getMaterialLibHTMLAjax();
    if(objAjax)
    {
        objAjax.setActionURL("fitevalplm.do");
        objAjax.setActionMethod("SORT&sortColumn="+fieldName+"&sort="+type+"&pageNum="+pageNo);
        objAjax.setProcessHandler(_showMaterialListPage);
        objAjax.sendRequest();
    }
}
/**
 * Tracker#:20696 COLUMN HEADERS WILL ALWAYS BE VISIBLE ON THE FIT EVAL AS THE USER SCROLLS DOWN THE SCREEN
 * function to synch checkbox changes in on floating header rows to original document check boxes, so that user would not see any difference 
 * while working on floating header.
 */

function _plm_fiteval_fixedHeaderRow(floatCell, floatRow)
{
	if (floatCell)
	{
		var chkbox = floatCell.find('input:checkbox');
		var chkboxid = chkbox.attr('id');
		
		if(chkboxid)
		{
			//chkbox.attr('disabled', true);
			chkbox.attr({
				onclick : '',
				onchange : ''
			}).change(function(){
				var orichkbox = getElemnt(chkboxid);
				if(chkbox.attr('checked'))
					{
						$(orichkbox).attr('checked', true);
						if(orichkbox.onclick)orichkbox.onclick();
					}
				else
					{
						$(orichkbox).attr('checked', false);
						if(orichkbox.onclick)orichkbox.onclick();
					}
			});
		}
	}
}
/**
 * Tracker#:20696 COLUMN HEADERS WILL ALWAYS BE VISIBLE ON THE FIT EVAL AS THE USER SCROLLS DOWN THE SCREEN
 * functioin to register left and right tables of detail part in FitEvaluation to float the header rows on scrolling through the detail rows.
 */
function _plm_fiteval_fixedHeader(tblLhsId, tblRhsId)
{
	//alert('tblLhsId ' + tblLhsId);
	//alert('tblRhsId ' + tblRhsId);
	try
	{
		var $dataWorkArea = $('#_divDataWorkArea');
		
		/* unbind old scroll event handler - unsure why the old event handler is retained
		 * and actually fires along with the new scroll event handler.
		 */
		$dataWorkArea.unbind('scroll.floatHeader');
		//if (IE)
		{
			$('.floatHeader').remove();
		}
		
		// setting the data so that it would used as check in _showWorkArea_scroll method
		$dataWorkArea.data("FIT_EVAL", true);
		$('#'+tblLhsId).floatHeader({
			enableFade: false,
			hideProperty: 'visibility',
			scrollElement: $dataWorkArea,
			containerDivId: tblLhsId + 'containerDiv',
			attachEventToInitFloatTable:_plm_fiteval_fixedHeaderRow
		}); 
		//alert("second");
		var rightContainerDivId = tblRhsId + 'containerDiv';
		$('#'+tblRhsId).floatHeader({
			enableFade: false,
			hideProperty: 'visibility',
			scrollElement: $dataWorkArea,
			containerDivId: rightContainerDivId
		});
		
		notifySliders({
			eventType : 'fixedHeader.init',
			rightContainerDivId : rightContainerDivId
		});
		
		window.calcRightFloaterWidth = function (rightTableId, leftTableId) {
			var $rightTable = $('#' + rightTableId);
			if ($rightTable.length > 0)
			{
				var $rightContainerDiv = $('#' + rightTableId + 'containerDiv'),
					$rightParentDiv = $rightTable.parent(),
					tableParentDivWidth = $rightParentDiv.outerWidth();

				$rightContainerDiv.width(tableParentDivWidth)
					.scrollLeft($rightParentDiv.scrollLeft()); // sync floating div's scrollLeft with original div's scrollLeft.

			}
		};
		
		_showWorkArea.toggleNav.registerAfterAlignment('calcRightFloaterWidth', [tblRhsId, tblLhsId]);
		
	}
	catch(e)
	{
		//alert(e.description);
	}
	
	
	//alert("done");
}
/**
 * Tracker#:21669 REGRESSION-CANNOT SELECT LIMITED LIST OF CODES FOR CREATE SIZE SET
 * @param navinfo
 * @param actionmethod
 */
function _showFitEvalscreen(navinfo, actionmethod)
{
	// alert("_showPLMScreen  = " + navinfo + "\nactionMethod:" + actionmethod);
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
    if(objHTMLData)
    {
    	// resetting the change fields those are from POM screen, these change fields would cause for throwing confirm message to
    	// save the changes done on the screen two times.
        objHTMLData.resetForm();
        objHTMLData.resetChangeFields();        
    }
	navInfo = navinfo;
	if(!actionmethod || actionmethod == "")
	{
	    // Navigating directly to Fit eval overview screen
	    _plmNavDefaultReload();
	}
	else
	{
	    // Navigating to the Search screen
	    _plmNavWithMethod(actionmethod);
    }
}

/**
 * Tracker#:21852 FDD555-FR01  ADD A NEW PROCESS MORE ACTIONS > MULTI WINDOW IN THE FIT EVALUATION OVERVIEW
 * 
 */
var plmFitEval={
		
	openFitMultiWindow:	function()
		{
			var nwWindow = window.open('fitmultiwindow.do?method=view', '', 'width=1146, height=600,resizable=yes, toolbar=no, scrollbars=yes, left=165, top=100');
			nwWindow.focus();
		},
		
     _fitmultiwindowSortColumn: function (fieldName,sec,type, pageNo)
		{
			sectionName = sec;
			var objAjax = getMaterialLibHTMLAjax();
			if(objAjax)
			{
			    objAjax.setActionURL("fitmultiwindow.do");
			    objAjax.setActionMethod("SORT&sortColumn="+fieldName+"&sort="+type+"&pageNum="+pageNo);
			    objAjax.setProcessHandler(_showMaterialListPage);
			    objAjax.sendRequest();
			}
		},
		_fitmultiWindowOpen: function ()
		{
			var htmlAreaObj = _getWorkAreaDefaultObj();
			//alert("htmlAreaObj " + htmlAreaObj);
		    var objAjax = htmlAreaObj.getHTMLAjax();
		    var objHTMLData = htmlAreaObj.getHTMLDataObj();
		    
		    if(!objAjax)objAjax = new htmlAjax();
		    var url = "open";
		    
		    if(objAjax)
			{
		    	if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
				{
		    		var htmlErrors = objAjax.error();
				    objAjax.error().addWarning("Select Style(s) to Open");
				    messagingDiv(htmlErrors);
				    return;
				}
		    	bShowMsg = true;
		    	loadWorkArea("fitmultiwindow.do", url,null, _showmultiPOMWorkArea,objAjax);
				if(objAjax.isProcessComplete())
		    	{
		        	objHTMLData.resetChangeFields();
		        }        
			}
		},
		
		_fitmultiWindowCloseTab:function(sltdtab)
		{
			var htmlAreaObj = _getAreaObjByDocView('2411');
		 	var url = "closetab&keyinfo="+getKeyInfo(sltdtab);
			var objAjax = htmlAreaObj.getHTMLAjax();
			
		    if(!isValidTecSpec(true))
		    {
		        return;
		    }

		    if(htmlAreaObj)
			{
		    	var objHTMLData = htmlAreaObj.getHTMLDataObj();
		    	
				if(!htmlAreaObj.checkForNavigation())
				{
				    // Check for valid record to execute process.

					sectionName = objAjax.getDivSectionId();
					//alert("sectionName  " + sectionName);
				    if(objAjax && objHTMLData)
				    {
				    	//alert("inside calling");
				    	bShowMsg = true;
				    	loadWorkArea("fitmultiwindow.do", url,null, plmFitEval._showmultiFitevalWorkArea,objAjax);
				        if(objAjax.isProcessComplete())
				        {
				            objHTMLData.resetChangeFields();
				        }
				    }
				}
				else
				{
					var docviewid = objAjax.getDocViewId();
					if (docviewid == 2411 && objHtmlData!=null && objHtmlData.hasUserModifiedData()==true)
					{
						objHtmlData.performSaveChanges(plmFitEval._showmultiFitevalWorkArea);
						
						if(objAjax.isProcessComplete())
						{
							objHtmlData.resetChangeFields();	
						}
						return;
					}
				}
			}
			
		},
		
		_fitmultiwindowSwtichTabs:function(sltdtab)
		{
			var htmlAreaObj = _getAreaObjByDocView('2411');
		 	var url = "navtabs&keyinfo="+getKeyInfo(sltdtab);
			var objAjax = htmlAreaObj.getHTMLAjax();
			
		    if(!isValidTecSpec(true))
		    {
		        return;
		    }

		    if(htmlAreaObj)
			{
		    	var objHTMLData = htmlAreaObj.getHTMLDataObj();
		    	
				if(!htmlAreaObj.checkForNavigation())
				{
				    // Check for valid record to execute process.

					sectionName = objAjax.getDivSectionId();
					//alert("sectionName  " + sectionName);
				    if(objAjax && objHTMLData)
				    {
				    	//alert("inside calling");
				    	bShowMsg = true;
				    	loadWorkArea("fitmultiwindow.do", url,null, plmFitEval._showmultiFitevalWorkArea,objAjax);
				        if(objAjax.isProcessComplete())
				        {
				            objHTMLData.resetChangeFields();
				        }
				    }
				}
				else
				{
					var docviewid = objAjax.getDocViewId();
					if (docviewid == 2411 && objHtmlData!=null && objHtmlData.hasUserModifiedData()==true)
					{
						objHtmlData.performSaveChanges(plmFitEval._showmultiFitevalWorkArea);
						
						if(objAjax.isProcessComplete())
						{
							objHtmlData.resetChangeFields();	
						}
						return;
					}
				}
			}
		},
		
		_fitEvalMW_fetchRowSampleDtls:function()
		{
		   //alert("Sample Info");
		   var htmlAreaObj = _getAreaObjByDocView('2411');
		   var objAjax = htmlAreaObj.getHTMLAjax();
		   var url = "fetchSltSampledtls&keyinfo="+getComponentKeyInfo();   
		   loadWorkArea("fitmultiwindow.do",url,null, plmFitEval._showmultiFitevalWorkArea,objAjax);
		},
		
		fetchMWSampleDetails:function(row, sizeCode)
		{
			var htmlAreaObj = _getAreaObjByDocView('2411');
			var objAjax = htmlAreaObj.getHTMLAjax();
			var curBodyRow = getElemnt("curBodyRow");
			curBodyRow.value = "" + row;
			var slSampleSizeCode = getElemnt("slSampleSizeCode");
			slSampleSizeCode.value = sizeCode;
			var url = "fetchsampledtls&curBodyRow=" + row + "&slSampleSizeCode=" +  sizeCode;  
			loadWorkArea("fitmultiwindow.do", url,null, plmFitEval._showmultiFitevalWorkArea,objAjax);
		},
		
		_fitEvalshowNextPage:function(pageNo,sec,url)
		{
			 //alert(" main.js \n showPage: \n sec "+sec+" url="+url);
	        sectionName = sec;

	        var objAjax = getHTMLAjax();
	        if(objAjax)
	        {

	        	var objHtmlData = _getWorkAreaDefaultObj().checkForNavigation();

			    if(objHtmlData!=null && objHtmlData.hasUserModifiedData()==true)
			    {
			        //alert("loadWorkArea: save changes \n creating ");
			        //perform save operation
					var docviewid = objAjax.getDocViewId();
					if (docviewid == 12701)
					{
						objHtmlData.performSaveChanges(refreshFields);
					}
					else
					{
						objHtmlData.performSaveChanges(plmFitEval._showmultiFitevalWorkArea);
					}
			    }
			    else
			    {
			    	objAjax.setActionURL(url);
	            	objAjax.setActionMethod("DTL_PAGING&custompageNum="+pageNo);
	            	objAjax.setProcessHandler(plmFitEval._showmultiFitevalWorkArea);
	            	objAjax.sendRequest();

	            	if(objAjax.isProcessComplete())
			        {
			        	var htmlAreaObj = _getWorkAreaDefaultObj();
			        	var objHTMLData = htmlAreaObj.getHTMLDataObj();
			            objHTMLData.resetChangeFields();
			        }
			    }
	        }
		},		
		
		_fitmultiwindowSave: function()
		{
			//todo identify the proper area object based on doc view id
		    var htmlAreaObj = _getAreaObjByDocView('2411');
		    var objHtmlData = htmlAreaObj.getHTMLDataObj();
		    var docviewid = htmlAreaObj.getDocViewId();
		    var objAjax = htmlAreaObj.getHTMLAjax();

	
		    //alert("objHtmlData " + objHtmlData.getDocViewId());
		    if(objHtmlData!=null && objHtmlData.hasUserModifiedData()==true)
		    {
		        //alert("loadWorkArea: save changes \n creating ");
		        //perform save operation
		        // Tracker#:18081 MAINTAIN USER'S PLACE ON THE SCREEN AFTER ADDING, DELETING, SORTING AND COPYING POM CODES
		        // Made Generic, so that in all PLM screens, on save, screen would keep the screen place after save from
		        // the point save process is called.
		        objHtmlData.performSaveChanges(plmFitEval._fitmultiWindowWorkArea_scroll);
		        if(objAjax.isProcessComplete())
		        	{
		        		objHtmlData.resetChangeFields();
		        	}
		    }
		    else
		    {
		    	var objAjax = new htmlAjax();
		    	objAjax.error().addError("warningInfo", szMsg_No_change, false);
		    	_displayProcessMessage(objAjax);
		       // _displayUserMessage(szMsg_No_change);
		    }
		},
		
		_showmultiFitevalWorkArea: function(objAjax)
		{
		    try
		    {
		        //alert("_showWorkArea ");
		        if(objAjax)
		        {
		        	_executePreProcess();
		            var div=getElemnt("_multiFitTabCntr");
		            workAreaDivsList = new Array();

		            if(div)
		            {
		                registerHTML(div,objAjax);
		            }
		             // alignWorkAreaContainer would cause error for multi window pom, so that commented.
		             // alignWorkAreaContainer();

		            if(nCurScrWidth > MinimumScrWidth)
		            {
		                resetAllMainDivs();
		            }
		        	if (objAjax._mSetChangeFlagsOnLoad == true)
		        	{
		                var workArea  = _getWorkAreaDefaultObj();
		                var docData = workArea.getHTMLDataObj();
		                docData._mHasUserModifiedData=true;
		        	}
		    		_displayProcessMessage(objAjax);
		    		/**
		    		 * Tracker#:21552 MULTI WINDOW POM OPENS SCROLLED DOWN SO THE TOP OF THE SCREEN DOES NOT SHOW
		    		 * setting mainScrollArea's scrollTop to 0.
		    		 */
		    		var divDataWrkArea = document.getElementById("mainScrollArea");
		    		if(divDataWrkArea)
		    			{
		    				divDataWrkArea.scrollTop = 0;
		    			}
		        }
		    }
		    catch(e)
		    {
		        //alert(e.description);
		    }
		},
		
		_fitmultiWindowUpdatePOM : function()
		{
			var url = "updatepom";
			var htmlAreaObj = _getAreaObjByDocView('2411');
		 	var objAjax = htmlAreaObj.getHTMLAjax();
			loadWorkArea("fitmultiwindow.do", url,null, plmFitEval._showmultiFitevalWorkArea,objAjax);
		},
		
		_fitmultiWindowInitSample:	function()
		{
		    var htmlAreaObj =_getAreaObjByDocView('2411');
			//alert("htmlAreaObj " + htmlAreaObj);
			var objAjax = htmlAreaObj.getHTMLAjax();
			var objHTMLData = htmlAreaObj.getHTMLDataObj();

			var actMethod ="listsizecodes";
		    if(objAjax)
		    {
		    	var htmlfldName = htmlAreaObj.getDivSectionId();
		    	//alert("showView : objAjax "  + objAjax.getDocViewId());
		    	_startSmartTagPopup(htmlfldName, false, null, true);
		        objAjax.setActionURL("fitmultiwindow.do");
		        objAjax.setActionMethod(actMethod);
		        objAjax.attribute().setAttribute("htmlfldName", htmlfldName);
		        objAjax.setProcessHandler(_showSmartTagInteractivePopup);
		        //alert("sending");
		        objAjax.sendRequest();
		    }
		},
		
		_fitmultiWindowaddSizeCode : function()
		{
		    var url = "fitmultiwindow.do";
		    var actionMethod = "addnewsample";
		    var objHtmlData = _getAreaObjByDocView('2411').checkForNavigation();
		    var divSaveContainerName1 =  _getAreaObjByDocView('2411').getDivSaveContainerName();
		    if(objHtmlData!=null && objHtmlData.hasUserModifiedData()==true)
		    {
		        // Remove the MsgBox and the Pop Up from the document
		        // object only after knowing the required objects value
		        closeMsgBox();
		        _closeSmartTag();
		        //perform save operation
		        objHtmlData.performSaveChanges(plmFitEval._showmultiFitevalWorkArea);
		    }
		    else
		    {
		        // Not using the loadWorkArea as we read the hidden component
		        // for the field name and then send the same in the
		        // ajax request
		        var defaultProcessHandler = plmFitEval._showmultiFitevalWorkArea;
		        _getWorkAreaObj().setDivDefaultSaveContainerName(divSaveContainerName1);
		        var objAjax = _getAreaObjByDocView('2411').getHTMLAjax();
		        if(objAjax)
		        {
		            // read the Sample Type field name displayed on the POP UP
		            var grdSampleTypeHdn = eval("document.all.grdSampleType");
		            var grdSampleTypeFieldName = grdSampleTypeHdn.value;
		            // Get the actual field.
		            var grdSampleType = getElemnt(grdSampleTypeFieldName);
		            
		            if(!grdSampleType.value)
		            {
		            	var confMsgHdn = document.getElementById("confMsg");
		            	//check for the message 
		            	if(confMsgHdn.value)
		            	{
		            		var htmlErrors = objAjax.error();
		            		htmlErrors.addError("confirmInfo", confMsgHdn.value,  false);
							messagingDiv(htmlErrors, 'doNothing()', "plmFitEval._fitmultiWindowProceedToAddNewSample('"+url+"','"+actionMethod+"','"+grdSampleType.value+"')");
						}
					}
					else
					{
						plmFitEval._fitmultiWindowProceedToAddNewSample(url, actionMethod, grdSampleType.value);
		            }
		        }
		    }
		},
		
		_fitmultiWindowProceedToAddNewSample: function(url, actionMethod, grdSampleTypeValue)
		{
			
		    var objAjax = _getAreaObjByDocView('2411').getHTMLAjax();
			var defaultProcessHandler = plmFitEval._showmultiFitevalWorkArea;;
		    // radioButton.value will always sends the first radio button
		    // value and not the selected one. So identify the
		    // selected one and then send the same.
		    var grdSampleSize = getSelectedValue("rdGrdSample");
		    objAjax.parameter().add("rdGrdSample", grdSampleSize);
		    objAjax.parameter().add("grdSampleType", grdSampleTypeValue);
		    objAjax.setActionURL(url);
		    objAjax.setActionMethod(actionMethod);
		    objAjax.setProcessHandler(defaultProcessHandler);
		    // Remove the MsgBox and the Pop Up from the document
		    // object only after knowing the required objects value
		    closeMsgBox();
		    _closeSmartTag();
		    objAjax.sendRequest();
		},
		
		_fitmultiWindowLockSample : function()
		{
			var url = "locksamples";
			var htmlAreaObj = _getAreaObjByDocView('2411');
		 	var objAjax = htmlAreaObj.getHTMLAjax();
			loadWorkArea("fitmultiwindow.do", url,null, plmFitEval._showmultiFitevalWorkArea,objAjax);
		},
		// Tracker#:22519 FDD 557 DELETE LAST FIT EVAL SAMPLE
		deleteActiveSample: function ()
		{
			if(!isValidRecord(true))
			{
				return;
			}
		    var objHtmlData = _getWorkAreaDefaultObj().checkForNavigation();
			var htmlAreaObj = _getWorkAreaDefaultObj();
		   	var objAjax = htmlAreaObj.getHTMLAjax();
		    
		    if(objHtmlData!=null && objHtmlData.hasUserModifiedData()==true)
		    {
		        //perform save operation
		        objHtmlData.performSaveChanges(_defaultWorkAreaSave);
		        if(objAjax.isProcessComplete())
	        	{
	        		objHtmlData.resetChangeFields();
	        	}
		        return;
		    }
		    /**
		     * If confirm save changes is been canceled, then reset change fields and continue;
		     */
		    if(objHtmlData==null)
		    {
		    	objHtmlData = _getWorkAreaDefaultObj().getHTMLDataObj();
		    	objHtmlData.resetChangeFields();
		    }
		    
		    var url = "fitevaloverview.do";
		    var actionMethod = "checkactivesample";		    
		    var objHTMLData = htmlAreaObj.getHTMLDataObj();

			if(objAjax && objHtmlData)
			{
				 objAjax.setActionURL(url);
		         objAjax.setActionMethod(actionMethod);
		         objAjax.setProcessHandler(plmFitEval._deleteActiveSampleCB);
		         objAjax.sendRequest();
			}
		},
		
		_deleteActiveSampleCB: function (objAjax)
		{
			msgInfo = objAjax.getAllProcessMessages();
			
			var htmlAreaObj = _getWorkAreaDefaultObj();
		    var objHTMLData = htmlAreaObj.getHTMLDataObj();
		    
			 if(msgInfo!="")
			 {
				 var objMsgDiv = new messagingDiv(objAjax.error());
			 }
			 else
			 {
				
		         if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
		     	{
		        	    var msg = objAjax.getResponseHeader("confirmMsg");
		     			var htmlErrors = objAjax.error();
		     			htmlErrors.addError("confirmInfo", msg,  false);
		    			messagingDiv(htmlErrors,'plmFitEval._continueDeleteSample()', 'doNothing()');
		     	}  
		         
			 }
		},
		
		_continueDeleteSample : function()
		{
			closeMsgBox();
	        _closeSmartTag();
			var htmlAreaObj = _getWorkAreaDefaultObj();
		   	var objAjax = htmlAreaObj.getHTMLAjax();
		    
			var url = "deleteSample";		    
		    loadWorkArea("fitevaloverview.do", url);
		},
		
		_fitmultiWindowDeleteSample : function()
		{
			if(!isValidRecord(true))
			{
				return;
			}
		    var objHtmlData = _getAreaObjByDocView('2411').checkForNavigation();
			var htmlAreaObj = _getAreaObjByDocView('2411');
		   	var objAjax = htmlAreaObj.getHTMLAjax();

		   	if(objHtmlData!=null && objHtmlData.hasUserModifiedData()==true)
		    {
		        //perform save operation
		        objHtmlData.performSaveChanges(plmFitEval._showmultiFitevalWorkArea);
		        if(objAjax.isProcessComplete())
	        	{
	        		objHtmlData.resetChangeFields();
	        	}
		        return;
		    }
		    /**
		     * If confirm save changes is been canceled, then reset change fields and continue;
		     */
		    if(objHtmlData==null)
		    {
		    	objHtmlData = _getAreaObjByDocView('2411').getHTMLDataObj();
		    	objHtmlData.resetChangeFields();
		    }
		    var url = "fitmultiwindow.do";
		    var actionMethod = "checkactivesample";
		    
			if(objAjax)
			{
				 objAjax.setActionURL(url);
		         objAjax.setActionMethod(actionMethod);
		         objAjax.setProcessHandler(plmFitEval._fitmultiWindowDeleteActiveSampleCB);
		         objAjax.sendRequest();
			}
		},
		
		_fitmultiWindowDeleteActiveSampleCB: function (objAjax)
		{
			msgInfo = objAjax.getAllProcessMessages();
			
			var htmlAreaObj = _getAreaObjByDocView('2411');
		    var objHTMLData = htmlAreaObj.getHTMLDataObj();
		    
			 if(msgInfo!="")
			 {
				 var objMsgDiv = new messagingDiv(objAjax.error());
			 }
			 else
			 {
		         if(objHTMLData!=null && objHTMLData.hasUserModifiedData()==false)
		     	{
		        	    var msg = objAjax.getResponseHeader("confirmMsg");
		     			var htmlErrors = objAjax.error();
		     			htmlErrors.addError("confirmInfo", msg,  false);
		    			messagingDiv(htmlErrors,'plmFitEval._fitmultiWindowContinueDeleteSample()', 'doNothing()');
		     	}  
			 }
		},

		_fitmultiWindowContinueDeleteSample : function()
		{
			closeMsgBox();
	        _closeSmartTag();
			var htmlAreaObj = _getAreaObjByDocView('2411');
		   	var objAjax = htmlAreaObj.getHTMLAjax();
		    
			var url = "deleteSample";		    
		    loadWorkArea("fitmultiwindow.do", url,null, plmFitEval._showmultiFitevalWorkArea,objAjax);
		},
		/**
		 * Tracker#:22760 FIT EVAL IN MULTI WINDOW - HEADER AUTO EXPANDING UPON SAVE
		 * 
		 */
		_fitmultiWindowWorkArea_scroll : function (objAjax)
		{
		    try
		    {
		        //alert("_showWorkArea ");
		        if(objAjax)
		        {
		        	_executePreProcess();
		            var div=getElemnt("_multiFitTabCntr");
		            workAreaDivsList = new Array();

		            if(div)	            	
		            {
		            	/**
		            	 * Tracker#:22760 FIT EVAL IN MULTI WINDOW - HEADER AUTO EXPANDING UPON SAVE
		            	 * Identify collapsable divs and store those display property in array, after 
		            	 * repainting the screen, those states would be restored.
		            	 * 
		            	 */
		            	var states = [],
		        		collapsableIds = [$('#2411_0_divCollapsable'),
		        	                      $('#2411_1_divCollapsable')
		        						];
		            	$.each(collapsableIds, function (i, value) {
		        		if (collapsableIds[i].length > 0)
		        		{
		        			states[i] = collapsableIds[i].css('display');
		        		}
		        		});
		            	
		            	registerHTML(div,objAjax);
		            }
		             // alignWorkAreaContainer would cause error for multi window pom, so that commented.
		             // alignWorkAreaContainer();

		            if(nCurScrWidth > MinimumScrWidth)
		            {
		                resetAllMainDivs();
		            }
		        	if (objAjax._mSetChangeFlagsOnLoad == true)
		        	{
		                var workArea  = _getWorkAreaDefaultObj();
		                var docData = workArea.getHTMLDataObj();
		                docData._mHasUserModifiedData=true;
		        	}
		    		_displayProcessMessage(objAjax);
		    		/**
		    		 * Tracker#:21552 MULTI WINDOW POM OPENS SCROLLED DOWN SO THE TOP OF THE SCREEN DOES NOT SHOW
		    		 * setting mainScrollArea's scrollTop to 0.
		    		 */
		    		var divDataWrkArea = document.getElementById("mainScrollArea");
		    		if(divDataWrkArea)
		    			{
		    				divDataWrkArea.scrollTop = 0;
		    				var sectionToggle = ['#_tableHeaderBar2411_0',
		    	        	                     '#_tableHeaderBar2411_1'
		    				                     ];
		    	        	/* For each section that has display='none' (that was collapsed before save),
		    	        	 * collapse the section by calling click event handler that toggles that section's
		    	        	 * collapse state.
		    	        	 */
		    	        	$(states).map(function (i, element) {
		    	        		if (states[i] === 'none')
		    	        		{
		    	        			$(sectionToggle[i]).children().children(':first').children(':first').click();
		    	        		}
		    	        	});
		    			}
		        }
		    }
		    catch(e)
		    {
		        //alert(e.description);
		    }
		},
		//Tracker#:23803 - Create Delete Size Set Process On Size Sets Screen
		_deleteSizeSet : function()
		{
			var htmlAreaObj = _getWorkAreaDefaultObj();
		   	var objAjax = htmlAreaObj.getHTMLAjax();
		    var objHTMLData = htmlAreaObj.getHTMLDataObj();
		    
		    if(!isValidRecord(true))
			{
				return;
			}
			
			if(objAjax && objHTMLData)
			{
				docview = objAjax.getDocViewId();		
		    	// alert("docview: "+docview);
		    	// alert("inside calling");
				var objDeleteMsg = document.getElementById("hdnDeleteSizeSetMsg");
				if(objDeleteMsg)
				{
					deleteMsg = objDeleteMsg.value;
				}
				if(objHTMLData!=null && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
				{
					var htmlErrors = objAjax.error();
				    htmlErrors.addError("confirmInfo", szMsg_Changes,  false);	
				    var saveFunc = '_saveFitEval()';
				    var cancelFunc = 'doNothing()';
				    messagingDiv(htmlErrors, saveFunc, cancelFunc);
				    return;
				}
				if(objHTMLData!=null)
		    	{
					var htmlErrors = objAjax.error();
					htmlErrors.addError("confirmInfo", deleteMsg,  false);
					messagingDiv(htmlErrors,'plmFitEval._deleteSizeSetOverview()', 'doNothing()');
		    	}
		    }	
		},
		_deleteSizeSetOverview: function()
		{
			var url = "deleteSizeSet";
			deleteRecord = true;
		    loadWorkArea("fitevaloverview.do", url, "", _showWorkAreaReloadNavigation);
		}
	}
	
function setSelectedTab(sltdtab)
{
	selectedTab=sltdtab.id;
}
	

// --------------------------------
