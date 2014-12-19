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

//tracker#:19008- SCHEDULER MONITOR
$(document).ready(function() {

	$('td.clsTextLabelLink').live('click', function() {

		$('.ui-dialog').dialog('destroy');
		$('.ui-dialog').remove();
		$('#updateTaskDiv').dialog('destroy');
		$('.popUpDiv').remove();

		var $dialog = $('<div id="updateTaskDiv" class="popUpDiv"></div>');
		$dialog.dialog({
			autoOpen: false,
			title: 'Edit Job Schedule',resizable: false,
			minHeight: 280, minWidth: 725,position: 'top',
			close: function(event, ui)
			{
				$('.ui-dialog').dialog('destroy');
				$('.ui-dialog').remove();
				$('#updateTaskDiv').dialog('destroy');
				$('.popUpDiv').remove();
			}
		});

		var tId = $(this).attr('id');

	    var objAjax = new htmlAjax();
	    objAjax.setActionURL("schedulermonitor.do");
	    objAjax.showProcessingBar(false);
	    objAjax.parameter().add("method", "SHOW_POPUP");
	    objAjax.parameter().add("tId", tId);

	    objAjax.setProcessHandler(showPopup);
	    objAjax.sendRequest();

	    function showPopup(objAjax) {

	    	var resHTML = objAjax.getHTMLResult();
	        if(objAjax && objAjax.isProcessComplete())
	  		{
	        	$dialog.html(resHTML);
			}
		}


		$dialog.dialog('open');

		$('#updateTaskDiv').bind('dialogclose', function(event)
			{
				$('.ui-dialog').dialog('destroy');
				$('.ui-dialog').remove();
				$('#updateTaskDiv').dialog('destroy');
				$('.popUpDiv').remove();
			});

		// prevent the default action, e.g., following a link
		return false;

	});


$('font.helpText').live('click', function() {

	$("#HELP_DIV").animate({"height": "toggle"}, { duration: 800 });
	// prevent the default action, e.g., following a link
	return false;
});


$('[id^="RB"]').live('click', function() {

	var tId = $(this).attr('id');

    var objAjax = new htmlAjax();
    objAjax.setActionURL("schedulermonitor.do");
    objAjax.showProcessingBar(false);
    objAjax.parameter().add("method", "RESET_CRON_ENTRY");
    objAjax.parameter().add("tId", tId);

    objAjax.setProcessHandler(resetEntry);
    objAjax.sendRequest();

    function resetEntry(objAjax) {

    	var resHTML = objAjax.getHTMLResult();
        if(objAjax && objAjax.isProcessComplete())
  		{
        	waitWindow();
        	var htmlObj =
				$.ajax({
					type: "POST",
					url: "schedulermonitor.do?showall=true",
					success: function(responseText)
					{
						var div = document.getElementById('LOCK');
						$(div).html(htmlObj.responseText);
						closewaitWindow();
						var msgInfo = objAjax.getAllProcessMessages();
				    	if(msgInfo != "");
				    	{
				    		_displayProcessMessage(objAjax);
				    	}
					}
				});
		}
	}

    
	// prevent the default action, e.g., following a link
	return false;

});


$('#B1').live('click', function() {

	var cronSyntaxOld =  $('input#OLD_CRON').val();
	var tSwitchOld = $('input#OLD_SWITCH').val();

	var cronSyntaxNew =  $('input#C0').val() +' '+ $('input#C1').val()+' '+ $('input#C2').val()+' '+ $('input#C3').val()+' '+ $('input#C4').val();
	var tSwitchNew = $('input[name=TASK_SWITCH]:checked').val();
	var tId = $('input#TID').val();

	var ctSyntaxVal;
	var tSwitchVal;

	//vijay's code - start
	if(cronSyntaxNew != cronSyntaxOld & tSwitchNew == tSwitchOld){
        ctSyntaxVal= cronSyntaxNew;
		tSwitchVal='NoChange';
   	}
  	else if(cronSyntaxNew == cronSyntaxOld & tSwitchNew != tSwitchOld)
  	{
		ctSyntaxVal='NoChange';
		tSwitchVal=tSwitchNew;
  	}
	else if(cronSyntaxNew != cronSyntaxOld & tSwitchNew != tSwitchOld)
  	{
        ctSyntaxVal= cronSyntaxNew;
		tSwitchVal=tSwitchNew;
	}
	else
	{
		alert('No Value Changed.');
		return false;
	}

    var objAjax = new htmlAjax();
    objAjax.setActionURL("schedulermonitor.do");
    objAjax.showProcessingBar(false);
    objAjax.parameter().add("method", "UPDATE_JOB");
    objAjax.parameter().add("cSyntax", ctSyntaxVal);
    objAjax.parameter().add("tSwitch", tSwitchVal);
    objAjax.parameter().add("tId", tId);

    objAjax.setProcessHandler(updateScheduleJob);
    objAjax.sendRequest();

    
    
    
    
    function updateScheduleJob(objAjax) {

    	var result = objAjax.getHTMLResult();
        if(objAjax && objAjax.isProcessComplete())
  		{
			if (result == "INVALID") {
					alert('CRON syntax is not correct.')
  			}
			else {
				
				//Closing the popup
				$('.ui-dialog').dialog('destroy');
				$('.ui-dialog').remove();
				$('#updateTaskDiv').dialog('destroy');
				$('.popUpDiv').remove();
				
				//Refreshing schedule tasks and history
				refreshTaskHistory('schtasks_history');
				refreshSchtasks('schtasks');
			}
		}
	}

});


});
