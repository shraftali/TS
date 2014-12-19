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

//Tracker #: 18035 F7 -  DETAIL SECTION QUICK SEARCH FILTER ON MATERIAL PROJECTION SUMMARY
//In order to make quick search generic this function is not called nowhere else except in screens 
//where the quick search is implemented.

function chkOper(elm, inp)
{
    var val = elm.options[elm.selectedIndex].value;
    var elminp = document.getElementById(inp);
    $("#qSearch input[type=text]").each(function(){
		if(this.id == inp)
			{
				elminp = this;
			}
	})
	
    if (val == '13' || val == '14')
    {
        elminp.value = '';
        /* elminp.style.backgroundColor = 'beige'; */
        elminp.disabled = true;
        cf(elminp);
    }
    else if (elminp.disabled)
    {
        elminp.disabled = false;
    /* elminp.style.backgroundColor = '#FFFFFF'; */
    }

    if (val == '8' || val == '9' || val == '10')
    {
        alert('Please enter the values separated by a comma.');
    }
}
