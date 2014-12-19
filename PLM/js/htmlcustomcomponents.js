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


function displayNavigator(navigator, selNaviViewIndex)
{
	if (navigator && selNaviViewIndex >= 0)
	{
		var naviViewIndex = 0;
		var navigatorId = navigator.id;
        var naviHeaderView = document.getElementById(navigatorId + naviViewIndex +  '_H');
        var naviBodyView = document.getElementById(navigatorId + naviViewIndex +  '_B');
        while(naviHeaderView && naviBodyView)
        {
        	if(naviViewIndex == selNaviViewIndex)
            {
            	naviBodyView.style.display = "block";
                naviBodyView.style.visibility = "visible";
            }
            else
            {
            	naviBodyView.style.display = "none";
                naviBodyView.style.visibility = "hidden";
            }
        	naviViewIndex = naviViewIndex + 1;
        	naviHeaderView = document.getElementById(navigatorId + naviViewIndex +  '_H');
        	naviBodyView = document.getElementById(navigatorId + naviViewIndex +  '_B');
        }
	}
}
