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


function displayNavigator(navigator, selNaviCenterIndex)
{
	if (navigator && selNaviCenterIndex >= 0)
	{
		var navigatorId = navigator.id;
		var naviCenterCount = navigator.navigatorCenterCount;
		if(naviCenterCount > 0)
		{
			for( var c = 0; c < naviCenterCount; c++ )
			{
				var naviHeaderCenter = document.getElementById(navigatorId + c +  '_H');
				var naviBodyCenter = document.getElementById(navigatorId + c +  '_B');
				if (naviHeaderCenter && naviBodyCenter)
				{
					if(c == selNaviCenterIndex)
					{
						naviHeaderCenter.style.color = navigator.headerSelectedFgColor;
						naviHeaderCenter.style.background = navigator.headerSelectedBgColor;
						naviBodyCenter.style.background = navigator.bodySelectedBgColor;
						naviBodyCenter.style.display = "block";
						naviBodyCenter.style.visibility = "visible";
					}
					else
					{
						naviHeaderCenter.style.color = navigator.headerDeSelectedFgColor;
						naviHeaderCenter.style.background = navigator.headerDeSelectedBgColor;
						naviBodyCenter.style.display = "none";
						naviBodyCenter.style.visibility = "hidden";
					}
				}
			}
		}
	}
}
