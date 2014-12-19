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


var MaintenanceJsModule = {

	callSubmitStyleJob: function (method) {
        var objAjax = new htmlAjax();
        objAjax.setActionMethod(method);
        objAjax.setActionURL("maintenance.do");
        objAjax.showProcessingBar(false);
        objAjax.setProcessHandler(MaintenanceJsModule.setJobStatusText);
        objAjax.sendRequest();
	},

	setJobStatusText: function (objAjax)
	{
        if (objAjax) {
            var errors = objAjax.error();
            if (errors.length > 0 && errors.hasErrorOccured()) {
            	$("#submitStyleRelationTask").html(errors);
            }
            else {
                //alert(objAjax.getHTMLResult());
                var result = objAjax.getHTMLResult();
                if (isNotNull(result) && result.length > 0) {
					var jobStatus = eval('(' + objAjax.getHTMLResult() + ')');
					if(jobStatus.isRunning == 'true')
					{
						if(jobStatus.since.length > 0) {
							$("#submitStyleRelationTask").html("Job is running since " + jobStatus.since);
						}
						else {
							$("#submitStyleRelationTask").html("Job has been submitted");
						}
						$("#submitStyleRelationTaskBtn").attr("disabled", true);
					}
					else
					{
						$("#submitStyleRelationTaskBtn").removeAttr("disabled");
						if(jobStatus.since.length > 0) {
							$("#submitStyleRelationTask").html("Job was last run on " + jobStatus.since);
						}
						else {
							$("#submitStyleRelationTask").html("Job history not found.");
						}
					}
               }
            }
		}
	}
};

$(document).ready(function() {

	$("#submitStyleRelationTaskBtn").attr("disabled", true);
	MaintenanceJsModule.callSubmitStyleJob("submitStyleStatus");

	$("#submitStyleRelationTaskBtn").click( function() {
    	$(this).attr("disabled", true);
    	if(confirm("Submit Style relation mainteance job will be submitted.")){
    		MaintenanceJsModule.callSubmitStyleJob("submitStyleExecute");
		}
    	else {
			$("#submitStyleRelationTaskBtn").removeAttr("disabled");
    	}
	});


	$("#submitStyleRelationTaskRefreshBtn").click( function() {
    	$("#submitStyleRelationTaskBtn").attr("disabled", true);
    	MaintenanceJsModule.callSubmitStyleJob("submitStyleStatus");
	});

});
