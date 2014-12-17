
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


 //Added functions specific to change tracking
function submitFrmCT(act)
{
    var parentDocViewId = getval('parentDocViewId');
    var formData = "";

    if (parentDocViewId == null || parentDocViewId == 'undefined' || parentDocViewId == '')
    {
	    var htmlAreaObj = _getWorkAreaDefaultObj();
	    var objAjax = htmlAreaObj.getHTMLAjax();
	    var objHTMLData = htmlAreaObj.getHTMLDataObj();

	    var radioval=get_radio_value();

	    formData += "ViewBy=" + radioval + "&";

	    if(radioval=='ByField')
	    {
	        var doc_level= document.getElementById("doc_level");
	        if(doc_level!=null)
	        {
	            var selecteddoc_level=doc_level.options[doc_level.selectedIndex].value;
	            formData += "doc_level=" + selecteddoc_level + "&";
	        }

	        var doc_field= document.getElementById("doc_field");
	        if(doc_field!=null)
	        {
	            //tracker# 13470 BY FIELD DOES NOT WORK IN CHANGE TRACKING
	            //Checking if there are any fields at this level.
	            if(doc_field.options.length > 0)
	            {
	                var selecteddoc_field=doc_field.options[doc_field.selectedIndex].value;
	                formData += "doc_field=" + selecteddoc_field + "&";
	            }
	        }
	    }

	    formData = formData.substr(0,(formData.length - 1));
	    var url = "changetrackviewerplm.do?method="+act+"&ajaxcall=y";
	    testurl(url,formData);
	    if(act=='doc_level')
	    {
	        var url = "changetrackviewerplm.do?method=view&ajaxcall=y";
	        testurl(url,formData);
	    }
	}
     //Tracker#: 19238 F2J. CHANGE TRACKING ON COMPETENCIES DOCUMENT
     //Tracker#: 18917 F4L - CHANGE TRACKING ON CAPACITY DOCUMENT
	else if (parentDocViewId == '132' || parentDocViewId == '5800' || parentDocViewId == '155'
	       || parentDocViewId == '3303' || parentDocViewId == '4200' || parentDocViewId == '2900'
		       || parentDocViewId == '3500' || parentDocViewId == '6000' || parentDocViewId == '3400'
		       || parentDocViewId == '2406' || parentDocViewId == '6800' || parentDocViewId == '6801' || parentDocViewId == '7000' 
    	     || parentDocViewId == '7300' || parentDocViewId == 212 || parentDocViewId == '321')
	      	{
		formData += "search=" + document.getElementById("search").value + "&";
		formData += "timeSelector=" + getSelDropDownValue("timeSelector") + "&";
		formData += "sectionSelector=" + getSelDropDownValue("sectionSelector") + "&";
		formData += "orderBy=" + getSelDropDownValue("orderBy") + "&";
		formData += "parentDocViewId=" + document.getElementById("parentDocViewId").value;

		var url = "changetrackviewerplm.do?method="+act+"&ajaxcall=y";
		testurl(url,formData);
	}
}

function getSelDropDownValue(id)
{
    var field = document.getElementById(id);
    var selVal = null;
    if(field != null)
    {
        selVal = field.options[field.selectedIndex].value;
    }

    return selVal;
}

function get_radio_value()
{
    var rad_val;
    var  frmPbj = eval("document." + FRM);

    for (var i=0; i < frmPbj.ViewBy.length; i++)
     {
       if (frmPbj.ViewBy[i].checked)
        {
          rad_val = frmPbj.ViewBy[i].value;
         }
     }
    return rad_val;
}


function testurl(url, str)
{
    if (window.XMLHttpRequest)
    {
        req = new XMLHttpRequest();
    }
    else if (window.ActiveXObject)
    {
        req = new ActiveXObject("Microsoft.XMLHTTP");
    }
    if (req)
    {
        req.open("POST", url, true);
        req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        req.onreadystatechange = ReloadWorkArea;
        try
        {
            req.send(str);

        }
        catch(e)
        {
            alert(e.description);
        }
    }
}


function ReloadWorkArea()
{
    if (req.readyState == 4)
    {
        if (req.status == 200)
        {
        	// Invoke SessionManagement.resetSessionTime() to reset session counter.
        	SessionManagement.resetSessionTime();

            var newmsg = req.responseText;
            _hideWaitWindow();
            refitChangeTrackC(newmsg);
        }
    }
}

function alignMainContainer()
{
    var divObj  = document.getElementById("_changetrackcdetail");

    if(divObj)
    {
        divObj.style.width = "100%";
        // Hide the unnecessary horizontal scroll.
        divObj.style.overflowX="hidden";
    }

    alignWorkAreaContainer();
    hide('preprint');
    _hideWaitWindow();
}

//Tracker#: 16832 SAFARI-CHANGE TRACKING TAB DOESNOT WORK IN PLM
//Setting the position to relative if the browser is not IE.
function setHeaderPositonForDiv()
{
    var ctHeader;
    if(!IE)
    {
        ctHeader = getElemnt("changeTrackingHeader");
        if(ctHeader)
        {
            ctHeader.style.position = "relative";
        }
    }
}

function submitPage(act, parentDocViewId)
{
    setval('parentDocViewId', getobj(parentDocViewId).value);

    if (FRM == 'frmPLM')  // new ui
        submitFrmCT(act);
    else
        fsubmit(act);
}

function setAttrb(obj, attName, attValue)
{
    setAttribute(obj, attName, attValue);
}

function resetChgTrackVals()
{
    document.getElementById('search').value = '';
    document.getElementById('timeSelector').value = '';
    document.getElementById('sectionSelector').value = '';
    document.getElementById('orderBy').value = '';
    document.getElementById('orderBy').value = 'ts';
}

function submitPageOnEnter(parentDocViewId, event)
{
	if (event.keyCode == 13)
	{
		var searchObj = document.getElementById('search');
		var searchValue = searchObj.value;
		if (searchValue != '')
		{
    		searchValue = searchValue.toUpperCase();
    		searchObj.value = searchValue;
		}

		submitPage('search', parentDocViewId);
	}
}

if (!TRADESTONE)
{
	var TRADESTONE = new Object();
}

var alertPrefsDialog;
var newalertPrefsDiv;

TRADESTONE.AlertsPreferences = function(_alertPrefTitle, _alertPrefHTML)
{
	var alertPrefTitle = _alertPrefTitle;
	var alertPrefHTML = _alertPrefHTML;
	this.show = function()
	{
		var alertPrefsDiv = document.createElement('div');

		$(alertPrefsDiv).attr("id", "AlertsPref");

		alertPrefsDialog = $(alertPrefsDiv).dialog({
			title: alertPrefTitle,
			height: 630,
			width : 500,
			zIndex: 900,
			modal : true,
			close : function(event, ui) {

				if(newalertPrefsDiv) {
					newalertPrefsDiv.dialog("close");
				}

				$(this).html('');
				$(this).dialog('destroy');
				$(this).remove();
			}
		});

		var titleBar = $(".ui-dialog-titlebar a.ui-dialog-titlebar-close");
		titleBar.removeClass("ui-corner-all");
		titleBar.find(".ui-icon").html("<img src='images/close_top.gif' border='0'/>").removeClass();

		alertPrefsDialog.html(alertPrefHTML);

	}
};

/** Group all functions related to AlertsJsModule */
var AlertsJsModule = {

		techSpecAlertsPopUp: function (obj)
		{
			if(!isValidRecord(true))
			{
				return;
			}

			objAjax = new htmlAjax();
			objAjax.setActionURL("subscribealerts.do");
			objAjax.setActionMethod("showPreference");
			objAjax.setProcessHandler("AlertsJsModule.alertPrefResponse");
			objAjax.parameter().add("docId", 100);
			objAjax.parameter().add("docViewId", 132);
			objAjax.sendRequest();
		},
		alertPrefResponse: function ()
		{
			if(objAjax)
			{
				if(objAjax.isProcessComplete())
				{
					var alertsPref = new TRADESTONE.AlertsPreferences("Change Alert Subscription", objAjax.getResult());
					alertsPref.show();
					$('#allSections').change( function(){
						if($(this).attr('checked') == true){
							$("input[name='logicalSectionId']").each(function(i){
						    	$(this).attr('checked',true);
						    	$(this).attr("disabled","disabled");
						    });
						}
						else
						{
							$("input[name='logicalSectionId']").each(function(i){
						    	$(this).removeAttr("disabled");
						    });
						}
					});

				}
				objAjax = null;
			}
		},
		saveAlertPreferences: function() {
			var objAjax = new htmlAjax();

			var msg = '';

			//Read form values
			var docId = $('#docId').attr('value');
			var docViewId = $('#docViewId').attr('value');

			var allSections = $('#allSections').attr('checked');
			var logicalSectionIds = [];
			var sectionList = '';
		    $("input[name='logicalSectionId']:checked").each(function(i){
		    	logicalSectionIds[i] = $(this).val();
		    	sectionList +=  $(this).val() + ',';
		    });

		    var notifyWhereActor = $('#notifyWhereActor').attr('checked');
			var thisDocInstance = $('#thisDocInstance').attr('checked');
			var subscriberEmail = $('#subscriberEmail').attr('value');
			var frequency = 'DAILY';
		    $("input[name='frequency']:checked").each(function(i){
		    	frequency =  $(this).attr('value');
		    });

			var sendEmails = 'false';
		    $("input[name='sendEmails']:checked").each(function(i){
		    	sendEmails =  $(this).attr('checked');
		    });


			//alert(docId + ' - ' + docViewId + ' - ' + allSections + ' - ' + sectionList + ' - ' + notifyWhereActor + ' - ' + subscriberEmail + ' - ' + frequency + ' - ' + sendEmails);

			if(msg != '')
			{
				msg = msg.substring(0, msg.length - 1)
				var htmlErrors = objAjax.error();
				htmlErrors.addError("errorInfo", 'Please provide values for the following field(s) ' + msg, true);
			   	messagingDiv(htmlErrors);
			   	return;
			}

			//Post form values
			objAjax.setActionURL("subscribealerts.do");
			objAjax.setActionMethod("savePreferences");
			objAjax.setProcessHandler("AlertsJsModule.handleSaveResponse");


			objAjax.parameter().add("docId", docId);
			objAjax.parameter().add("docViewId", docViewId);

			objAjax.parameter().add("notifyWhereActor", notifyWhereActor);
			objAjax.parameter().add("thisDocInstance", thisDocInstance);

			objAjax.parameter().add("allSections", allSections);
			objAjax.parameter().add("logicalSectionIds", sectionList);

			objAjax.parameter().add("subscriberEmail", subscriberEmail);
			objAjax.parameter().add("sendEmails", sendEmails);
			objAjax.parameter().add("frequency", frequency);

			AlertsJsModule.cWaitWindow();

			objAjax.sendRequest();

		},

		handleSaveResponse: function(objAjax)
		{
			if(objAjax)
			{
				if(objAjax.isProcessComplete())
				{
					msgInfo = objAjax.getAllProcessMessages();
			    	if(msgInfo!="")
			    	{
			        	_displayProcessMessage(objAjax);
			    	}
			    	else
			    	{
						$('#AlertsPref').html(objAjax.getResult());
						var htmlErrors = objAjax.error();
						htmlErrors.addError("successInfo", "Saved Successfully", false);
				   		messagingDiv(htmlErrors);
			    	}
				}
				AlertsJsModule.closeCWaitWindow();
				objAjax = null;
			}
		},

		cWaitWindow: function()
		{
			var winW = document.body.clientWidth;
			var winH = document.body.clientHeight;
			/*
			 * Tracker#:20060 process bar is needed while opening multi pom windows. 
			 * Adding scrollTop to processing bar top calculation so that if user scrolls down window,
			 * so that processing bar would be visible.
			 */
			var winScrlTop = document.body.scrollTop;
			var waitW = new processingWindow();

			document.body.appendChild(waitW);
			$('#proc').css("zIndex", 1000);
		    waitW.style.top = parseInt(winH/2)+winScrlTop - (waitW.offsetHeight/2)+"px";
		    waitW.style.left = parseInt(winW/2) - (waitW.offsetWidth/2)+"px";
		},

		// Closes the wait window.
		closeCWaitWindow: function()
		{
		    var waitW = getElemnt("proc");
		    if (waitW)
			{
				var parentNode = waitW.parentNode;
				parentNode.removeChild(waitW);
			}
		}
};


