/*************************************/
/*  Copyright  (C)  2002 - 2008      */
/*           by                      */
/*  TradeStone Software, Inc.        */
/*  Gloucester, MA. 01930            */
/*  All Rights Reserved              */
/*  Printed in U.S.A.                */
/*  Confidential, Unpublished        */
/*  Property of                      */
/*  TradeStone Software, Inc.        */
/*************************************/

function verticalTab()
{
    curTable=""; // current active table
    arrowCol=0; // current active cell
    arrowRow=0;  // current active row
    arrowRowCount=0; // total # of cells in the table
    arrowColCount=0; // total # of rows in the table
}

function alertVars()
{
    alert('Table-'+verticalTabInfo.curTable + ' \nRowCount-' + verticalTabInfo.arrowRowCount  + ' \nRow-' + verticalTabInfo.arrowRow  + ' \nColCount-' + verticalTabInfo.arrowColCount  + ' \nCol-' + verticalTabInfo.arrowCol);
}

// initialize the info
verticalTabInfo = new verticalTab();

// is called when a key is pressed on the active table
//ckd - Cursor Key Down
function ckd(e, obj)
{

  if (verticalTabInfo.curTable == "")
  {
    return;
  }

  if (!e) e=window.event;

  var arrowDirection;

  switch(e.keyCode)
  {
  case 38:
    // Key up.
	arrowDirection = "U"; // up
    break;
  case 40:
    // Key down.
	arrowDirection = "D"; // down
    break;
  }

    // if up down arrow is selected and not on the last row then jump to next row
	if (arrowDirection == 'D' && verticalTabInfo.arrowRowCount != (verticalTabInfo.arrowRow+1))
	{

		tdobj = document.getElementById(verticalTabInfo.curTable).getElementsByTagName("tr").item(verticalTabInfo.arrowRow + 1).getElementsByTagName("td").item(verticalTabInfo.arrowCol);

		// Tracker#: 13512 : Check for the availability of the Input
		// control too....
		if (tdobj && tdobj.getElementsByTagName("INPUT")[0])
		    tdobj.getElementsByTagName("INPUT")[0].focus();
	}
	// if up arrow is presses and not on the first row then move up a row.
	else if (arrowDirection == 'U' && verticalTabInfo.arrowRow != 0)
	{
		tdobj = document.getElementById(verticalTabInfo.curTable).getElementsByTagName("tr").item(verticalTabInfo.arrowRow - 1).getElementsByTagName("td").item(verticalTabInfo.arrowCol);

		// Tracker#: 13512 : Check for the availability of the Input
		// control too....
		if (tdobj && tdobj.getElementsByTagName("INPUT")[0])
		    tdobj.getElementsByTagName("INPUT")[0].focus();
	}

}


// on focus of the field capture the cell properties within the active table
function a(obj)
{
    var objTable = getTableObj(obj);
    if (typeof(verticalTabInfo.curTable) == "undefined" || verticalTabInfo.curTable == "")
    {
        initVT(obj);  // initialize vertical tabbing
    }
    // -------------------------------------
    // Tracker#: 13512
    // If there is an Column Freeze or two tables
    // are used to used to display data
    // then if the second table is being accessed
    // then remember the previous Table Id and the
    // current Table id.
    // -------------------------------------
    else if(objTable && objTable.id != verticalTabInfo.curTable)
    {
        initVT(obj);  // initialize vertical tabbing
    }

    // get current table obj
	tblobj = document.getElementById(verticalTabInfo.curTable);
    // gets its rows count
    verticalTabInfo.arrowRowCount = tblobj.getElementsByTagName("tr").length

    // temp variable to handle row loop
    i=0;
    while(i < verticalTabInfo.arrowRowCount)
    {
        // get the row
	    trobj = tblobj.getElementsByTagName("tr").item(i);
        // get the column count within the row
	    verticalTabInfo.arrowColCount = trobj.getElementsByTagName("td").length;
	    // varialble to loop the cells
	    j=0;

	    while (j < verticalTabInfo.arrowColCount)
	    {
            // get the cell
		    tdobj = trobj.getElementsByTagName("td").item(j);
	        // compare with current selected fields parent
		    if (tdobj == obj.offsetParent)
		    {
       			verticalTabInfo.arrowCol=j;
	    		verticalTabInfo.arrowRow=i;
		        break;
		    }
		    j++  // to jump to next col
	    }
        i++;  // to jump to next row
    }
}


function initVT(obj)  // initialize vertical tabbing
{
    if (obj)  // if input box
    {
        objTd = obj.offsetParent;

        if (objTd) // if td
        {
            objTr = objTd.offsetParent;

            if (objTr)    // if tr
            {
                // Tracker#: 13512
                // For Unknown reason the offsetparent
                // for Td is Table instead of <tr>
                // Interested only in identifying the table object.
                if(objTr.tagName.toUpperCase() == 'TABLE')
                {
                    objTable = objTr;
                }
                else
                {
                    objTable = objTr.offsetParent;
                }
                if (objTable)  //if table
                {
                    verticalTabInfo.curTable=objTable.id;
                    verticalTabInfo.arrowCol=0;
	                verticalTabInfo.arrowRow=0;
	                verticalTabInfo.arrowRowCount=0;
	                verticalTabInfo.arrowColCount=0;
                }
            }
        }
    }
}

// ----------------------------------------
// Tracker#: 13512
// Identify the table object that contains the
// Input control object.
// ----------------------------------------
function getTableObj(obj)
{
    var objTable;
    if (obj)  // if input box
    {
        var objTd = obj.offsetParent;

        if (objTd) // if td
        {
            var objTr = objTd.offsetParent;

            if (objTr)    // if tr
            {
                if(objTr.tagName.toUpperCase() == 'TABLE')
                {
                    objTable = objTr;
                }
                else
                {
                    objTable = objTr.offsetParent;
                }
            }
        }
    }
    return objTable;
}
