/*************************************/
/*  Copyright  (C)  2002 - 2005      */
/*           by                      */
/*  TradeStone Software, Inc.        */
/*  Gloucester, MA. 01930            */
/*  All Rights Reserved              */
/*  Printed in U.S.A.                */
/*  Confidential, Unpublished        */
/*  Property of                      */
/*  TradeStone Software, Inc.        */
/*************************************/

var curFlowName;
var maxTitleDiv = 2;

// hide an object (div) based on its id
function hideDisplay(ID)
{
    hideDisplayObj(getElemnt(ID));
}

// hide an object
function hideDisplayObj(obj)
{
    if (obj)
    {
        obj.style.visibility = 'hidden';
		obj.style.display = 'none';
    }
}

// show an object (div) based on its id
function showDisplay(ID)
{
    showDisplayObj(getElemnt(ID));
}

// show an object
function showDisplayObj(obj)
{
    if (obj)
    {
        obj.style.visibility = 'visible';
		obj.style.display = '';
    }
}

function handleList(nCase,showDivName,hideDivName,objName)
{
	try
	{
		if(typeof(objName!='undefined') && objName)
		{
			var obj = getElemnt(objName);

			if(obj)
			{
			    nCase = (obj.value=="+")?2:6;
			}
		}
		//alert("showDivName" + showDivName + "\n hideDivName " + hideDivName);

		if(showDivName)showDisplay(showDivName);
		if(hideDivName)hideDisplay(hideDivName);

		if(obj)
        {
			// Tracker#: 17587 - SAFARI = SUMMARY BY FLOWS IS MISSING FROM SUMMARY ON LINE LIST
			// Safari does not support innerText property. Setting value property directly instead.
			obj.value = (nCase==2)?"-":"+";
        }

		if(typeof(showCurrentFlows) == "function")
		{
			showCurrentFlows();
		}

		if(typeof(toggleChildContainer) == "function")
		{
			toggleChildContainer(2,showDivName,objName);
		}

		// Harish : Scroll to display the selected Row.
		scrollToSelectedRow();

	}
	catch(e)
	{
		//alert(e.description);
	}
}

function handle(nCase)
	{
		try
		{
			var obj = getElemnt('sgn');

			nCase = (obj.innerText=="+")?2:6;

			if (nCase == 2)
			{
				//hide('FLTR_CLOSE');
				show('FLTR_OPEN');

				// move which ever is open down
				//var dtl = getElemnt('LIST');
				var opn = getElemnt('FLTR_OPEN');
				//var cl = getElemnt('FLTR_CLOSE');
				opn.style.display="";

				var data = getElemnt('DATA_DIV');
				if (data && diff != 0)
				{
					setHeight(data, parseInt(data.offsetHeight) - diff);
				}

				obj.innerText = "-";
			}
			else if (nCase == 6)
			{
				show('FLTR_CLOSE');
				var cl = getElemnt('FLTR_OPEN');
				cl.style.display="none";
				var data = getElemnt('DATA_DIV');
				if ( data && parseInt(data.scrollHeight) - parseInt(data.offsetHeight) > 0)  // there is vertical scroll
				{
					setHeight(data, parseInt(data.offsetHeight) + diff);
				}
				else
				{
					diff = 0;
				}

				obj.innerText="+";
			}

			if(typeof(showCurrentFlows)=="function")
			{
				//showCurrentFlows();
			}
		}
		catch(e)
		{
			//alert(e.description);
			//repositionDiv();
		}
	}

function resetSizeInfo()
{
    if (IE)
        nCurScrHeight = document.body.clientHeight;
    else
        nCurScrHeight = window.innerHeight;

    nCurScrWidth = document.body.clientWidth;
}

function handleHeaderDiv(flTltId)
	{
	    //flTltId = 2;

		//alert("title div id " + flTltId);
		var objhd1 = getElemnt('HEADER_DIV1');
		var objhd2 = getElemnt('HEADER_DIV2');

		var objht1 = getElemnt('HEADER_TABLE1');
		var objht2 = getElemnt('HEADER_TABLE2');

		var objtd1 = getElemnt('TITLE_DIV1');
		var objtd2 = getElemnt('TITLE_DIV' + flTltId);

		var objdd1 = getElemnt('DATA_DIV1');
		var objdd2 = getElemnt('DATA_DIV' + flTltId);

		var objtt1 = getElemnt('TITLE_TABLE1');
		
		var dataTable1 = getElemnt('DATA_TABLE1');

		if(objhd1 && objhd2 && objtd1 && objtd2 && objdd2 && objtt1 && objdd1 && dataTable1)
		{
		    setTitleWidth();
			setWidth(objht1,objtd1.offsetWidth-1);
			setWidth(objhd1,objtd1.offsetWidth);

			if(parseInt(objtt1.offsetWidth)+3 !=objtd1.offsetWidth)
			{
				setWidth(objtt1,objtd1.offsetWidth);
			    // Tracker#: 15592 - 2010 UI REGRESSION IN SOME OF THE BUILDER SCREENS: COLUMN ALIGNMENT
			    // Need to change the width of the data table as well so the columns match up
				// with title table.
				setWidth(dataTable1,objtd1.offsetWidth);
		    }

		    if(parseInt(objdd1.offsetWidth) !=objtd1.offsetWidth)
			{
			    setWidth(objdd1,objtd1.offsetWidth);
		    }

			setWidth(objtd2,objdd2.offsetWidth);
			setWidth(objht2,objtd2.offsetWidth-1);
			setWidth(objhd2,objtd2.offsetWidth);

			setHeight(objht2,objht1.offsetHeight);
			setHeight(objhd2,objhd1.offsetHeight);

			setTop(objhd2,(objtd2.offsetTop-objhd2.offsetHeight));
			setLeft(objhd2,objtd2.offsetLeft);
		}

		alignTablesHeight('DATA_TABLE1','DATA_TABLE' + flTltId);
		align2TableRows('TITLE_TABLE1','TITLE_TABLE' + flTltId);
	}

	function setFlowNumber(divName,tltDivName,flwNo)
	{
		var objFlwTd;
        var objDiv = getElemnt(divName);

		if((objDiv)&&(objDiv.getAttribute("flowName")))
		{
		    var flwNames  = objDiv.getAttribute("flowName");

		    if(typeof(nActFlowNum) != 'undefined')
		    {

                var objFlw = getElemnt('aFlow'+nActFlowNum);

                if(objFlw)
                {
                    flwNames = objFlw.value;
                }
            }
			flwNames = flwNames.split("@#");

		}

		//alert("tltDivName " + tltDivName);
		for(var i=1;i<=nNoOfFlowDisplay;i++)
		{
			var obj = getElemnt("lblFl" + tltDivName +  i);

            if(obj && flwNames)
            {
				//alert(" obj " + obj);
                var flnm = "";
                if((flwNames.length) && (flwNames.length>0))
                {
                    flnm = (i<=flwNames.length)?flwNames[i-1]:'';
                }
                else
                {
                    flnm = flwNames;
                }
                setFlowText(obj,flnm);
            }
		}

		if(objFlwTd)
		{
			objD = getElemnt(divName);
			objT = getElemnt(tltDivName);

			if(objD)
			{
				//alert("setting");
				objT.scrollLeft = objFlwTd.parentElement.offsetLeft;
				objD.scrollLeft = objFlwTd.parentElement.offsetLeft;

			}
		}
	}

	function setFlowText(obj,txt)
	{
		obj.innerText = txt;
	}


	function showFlows(num)
	{

		var newFlnum = nCurFlowNum + (num * nNoOfFlowDisplay);
		newFlnum = (newFlnum<=0)?1:newFlnum;

		//alert("nCurFlowNum " + nCurFlowNum + "\n newFlnum " + newFlnum + "\ntotalNoOfFlows " + totalNoOfFlows);

		if(newFlnum>0 && newFlnum<totalNoOfFlows)
		{
			nCurFlowNum=newFlnum;
			//setFlowNumber();
			//flipData(parseInt(nCurFlowNum/nNoOfFlowDisplay) + 1);
			//alert(parseInt(nCurFlowNum/nNoOfFlowDisplay) + 1);
			//alert("nCurFlowNum " + nCurFlowNum);
			flipDataPosition(nCurFlowNum);
		}
	}

	function showCurrentFlows()
	{
		flipDataPosition(nActFlowNum);
	}

	function flipDataPosition(id)
	{
		try
		{
		    //showFlowsDet(id,"hdnCurrentFlowid");
		    return true;
			//alert("id "+ id);
			var rem = id%nNoOfFlowDisplay;

			if(nNoOfFlowDisplay>1)
			{
				nCurFlowNum = (id%(nNoOfFlowDisplay+1)==0)?id:(id-(id%(nNoOfFlowDisplay+1)));
			}
			else
			{
				nCurFlowNum = id;
			}

			if(id == totalNoOfFlows)
			{
				nCurFlowNum = id;
				//rem=0;
			}

			//alert(" nCurFlowNum " + nCurFlowNum);
			nActFlowNum = id;

			rem = (rem<=0)?nNoOfFlowDisplay:rem;
			nCurFlowNum = (nCurFlowNum<=0)?1:nCurFlowNum;

			//alert(" nCurFlowNum " + nCurFlowNum);

			var dispDivId = parseInt(id/nNoOfFlowDisplay) + parseInt((id%nNoOfFlowDisplay==0)?0:1);

			flipData(((id == (totalNoOfFlows))?nNoOfDataDivs:dispDivId), rem, ((id == (totalNoOfFlows))?maxTitleDiv:2));

			handleHeaderDiv(((id == (totalNoOfFlows))?maxTitleDiv:2));

		}
		catch(e)
		{
			//alert("flip data error");
		}
	}


	var movedy = 0;
	var movedx=0;

	function adjust2DivOnScroll(tltDiv,dtDiv,curDiv)
	{
		//window.status = "setting top " + movedy + " curDiv.scrollTop = " +curDiv.scrollTop + "  getElemnt(dtDiv).scrollTop " + getElemnt(dtDiv).scrollTop ;
		getElemnt(tltDiv).scrollLeft=curDiv.scrollLeft;

		//if(movedy != curDiv.scrollTop)
		{
			//window.status = "set top " + curDiv.scrollTop + " from " + movedy;
			getElemnt(dtDiv).scrollTop=curDiv.scrollTop;
			moved_dtl_y=curDiv.scrollTop;
			movedy=curDiv.scrollTop;
		}

		moved_dtl_x=curDiv.scrollLeft;
	}

	function alignTablesHeight(t1, t2)
    {

        t1o = getElemnt(t1);
        t2o = getElemnt(t2);

        if(t1o && t2o)
        {
            // align the height of the data tables
            var nRowCount = t1o.getElementsByTagName("tr").length
            i=0;
            while(i < nRowCount)
            {
                try
                {
                    tro1 = t1o.getElementsByTagName("tr").item(i).getElementsByTagName("td").item(0);
                    tro2 = t2o.getElementsByTagName("tr").item(i).getElementsByTagName("td").item(0);

                    //alert("tro1 " + tro1 + "\n tro2 " +tro2);
                    if(tro1 && tro2)
                        alignHeight(tro1, tro2);

                }
                catch (e)
                {
                    //alert("error align table at " + i + "\n" + e.decription);
                }

                i++;
            }
        }
    }
