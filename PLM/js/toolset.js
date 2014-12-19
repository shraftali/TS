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

// for query tool- (UI changes adhering to Lextant guidelines) 
// This function is used to redirect to the respective screens
// via the new menu (i.e. drop down buttons).  
function redirectToNewAction(act)
{
	
	var url = "";
	var isRedirect = false;
	
    if(act == "querybuilder")
    {
    	url = "querybuilder.do?method=view";
    }
    else if(act == "enablequerycount")
    {
    	url = "querybuilder.do?method=enablequerycount";
    }
    else if(act == "backtoquerylist")
    {
    	url = "querylist.do?method=backtoquerylist"
    }
    else if(act == "assigngroup")
    {
    	url = "querybuilderassign.do?method=assigngroup";
    }
    else if(act == "assignquery")
    {
    	url = "querybuilderassign.do?method=assignquery";
    }
    else if(act == "querygroup")
    {
    	url = "querybuilder.do?method=querygroup";
    }
    
    if(url != "")
    {
    	isRedirect = true;
    	var htmlObj = 
    		$.ajax({
    			type: "POST",
    			url: url,
    			success: function(responseText)
    			{
    				var div = document.getElementById('LOCK');
    				$(div).html(htmlObj.responseText);
    			}
    		});
    }
    
    return isRedirect;
}
