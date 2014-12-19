
$(document).ready(function() {
	

	
	$('#B2').live('click', function() {
		$('.ui-dialog').dialog('destroy');
		$('.ui-dialog').remove();
		$('.popUpDiv').remove();
	});
	
	$('#B1').live('click', function() {
		$('.ui-dialog').dialog('destroy');
		$('.ui-dialog').remove();
		$('.popUpDiv').remove();
		
		
	    var objAjax = new htmlAjax();
	    objAjax.setActionURL("LoginSubmit.do");
	    objAjax.showProcessingBar(false);
	    objAjax.parameter().add("method", "DUP_SESSIONS_KILL");
	    objAjax.parameter().add("user_id",$('#user_id').val());
	    objAjax.parameter().add("pswd",$('#pswd').val());
	    if ($('#supplierkey').length > 0)
	    {
	    	objAjax.parameter().add("supplierkey",$('#supplierkey').val());
		}	   
	    objAjax.setProcessHandler(loginRetry);
	    objAjax.sendRequest();

	    function loginRetry(objAjax) {

	    	var resHTML = objAjax.getHTMLResult();
	        if(objAjax && objAjax.isProcessComplete(false))
	  		{
				waitWindow();
				$("#LoginForm").submit();
			}
		}
	});

	$('#formsubmit').live('click', function() {

		if (oneSessionPerUser == 'false')
		{
			waitWindow();
			$("#LoginForm").submit();
			return false;
		}
		else 
		{
		$('.ui-dialog').dialog('destroy');
		$('.ui-dialog').remove();
		$('.popUpDiv').remove();


	    function showPopup(objAjax) {

	    	var resHTML = objAjax.getHTMLResult();
	        var newCommentsDiv;
	    	if(objAjax && objAjax.isProcessComplete(false))
	  		{
	    		if (resHTML)
	    		{
	    			var activeSessionsPopup = new Popup("activeSessionsPopup","Active Session Warning", resHTML,300,250,'#FFFFFF','#F5E7CC','','','false');
	    			activeSessionsPopup.show();
	  			}	
			}
			if (resHTML)
			{
				return false;
				
			}
			waitWindow();
			$("#LoginForm").submit();
			
		}

	    var objAjax = new htmlAjax();
	    objAjax.setActionURL("LoginSubmit.do");
	    objAjax.showProcessingBar(false);
	    objAjax.parameter().add("method", "DUP_LOGIN_POPUP");
	    objAjax.parameter().add("user_id",$('#user_id').val());
	    objAjax.parameter().add("pswd",$('#pswd').val());
	    if ($('#supplierkey').length > 0)
	    {
	    	objAjax.parameter().add("supplierkey",$('#supplierkey').val());
		}
	    objAjax.setProcessHandler(showPopup);
	    objAjax.sendRequest();

		return false;
	  }
	});
});