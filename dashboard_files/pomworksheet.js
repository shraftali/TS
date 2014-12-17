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


// FRM='fpomworksheet';
var colFreezed = false;

function cellChg(p,row)
    {
       if (getval('chgflds') == '' ) setval('chgflds', ',');
       //not calling cfn(), since we dont want to track chgflds for cell fields
       return vn_dec(p, 0);
    }

    function srLocal(row, secid)
    {
       nCurRow = row;
    }

    function openPOMReport(id)
     {
        if(!isValidRecord("URL", "N")) return;
         var bDisp = true;
         var rDisp = true;
         if (getval('chgflds') != "")
         {
             if (confirm(szMsg_Changes))
             {
                 fsubmit(szSAVE);
                 bDisp = false;
             }
             else{rDisp = false;}
         }
         if(bDisp)
         {
            if(!rDisp)
            {
                openReport(id);
            }
            else
            {
                var method= hasChanged("customreport");
                if(method=='customreport')
                {
                    openReport(id);
                }
                else if(method==szRELOADASSOC)
                 {
                     submitFrm(szRELOADASSOC);
                     bDisp = false;
                 }
            }
         }
     }

    var blnUpdateChnFlds = true;
    function closeMsgPOM()
    {
    	setval('szRselect',"");
        if(typeof(blnUpdateChnFlds)!="undefined")blnUpdateChnFlds = true;
        var waitW = getElemnt("showMsg");
        if (waitW)
        {
            setval('chgflds', "");
            eval('document.'+FRM+'.removeChild(waitW)');
        }
    }
    // sets the value of an html element
    function setval(fld, val)
    {
        var updateFld = true;
        if(typeof(blnUpdateChnFlds)!="undefined") updateFld = blnUpdateChnFlds;

        if(updateFld)
        {
            if (eval('document.'+FRM+'.'+fld))
            {
                eval('document.'+FRM+'.'+fld+'.value = "'+val+'"');
            }
       }
    }

    function getRowSpan()
    {
        var retVal = 1;

        var obj = getElemnt('detRowSpan');

        if(obj)
        {
            retVal = parseFloat(obj.value);
        }
        //alert("getRowSpan \n retVal " + retVal);
        return retVal;
    }

    function getSecondRowSpan()
    {
        var retVal = 1;

        var obj = getElemnt('detSecondRowSpan');

        if(obj)
        {
            retVal = parseFloat(obj.value);
        }
        //alert("getRowSpan \n retVal " + retVal);
        return retVal;
    }

    function getStartRowIndex(row, rowSpan)
    {
        //alert("get start row index\n row =" + row + "\n rowSpan= "+ rowSpan );
        var retVal = row * rowSpan;
        //alert("getStartRowIndex \n retVal " + retVal);
        return retVal;
    }

function selectTableRow(row,rwSpan)
    {
        //alert("colFreezed " + colFreezed);

        if(typeof(colFreezed)!='undefined' && (colFreezed==true))
        {
            //alert("colFreezed");

            clrTableRow(row, 'DATA_TABLE1');

            var rw2Span = getSecondRowSpan();
            if(rw2Span>1)
            {
                var sRow = getStartRowIndex(row, rw2Span);
                //alert("sRow " + sRow +"\n row " + row);
                for(var i=0;i<rw2Span;i++)
                {
                   clrTableRow(sRow + i, 'DATA_TABLE2');
                }
            }
            else
            {
                clrTableRow(row, 'DATA_TABLE2');
            }
        }
        else
        {
            //alert("not freeze \n rwSpan->"+rwSpan +"\nrow = " + row);
            //for not column freeze
            if(rwSpan>1)
            {

                var sRow = getStartRowIndex(row, rwSpan);
                //alert("sRow " + sRow);
                for(var i=0;i<rwSpan;i++)
                {
                   //alert("highlight row " + sRow + i);
                   clrTableRow(sRow + i);
                }
            }
            else
            {
                //alert("highlight row ->" + row);
                clrTableRow(row);
            }
        }
    }

    function unselectTableRow(row,rwSpan)
    {

        if(typeof(colFreezed)!='undefined' && (colFreezed==true))
        {
            unclrTableRow(row, 'DATA_TABLE1');

            var rw2Span = getSecondRowSpan();
            if(rw2Span>1)
            {
                var sRow = getStartRowIndex(row, rw2Span);
                //alert("sRow " + sRow);
                for(var i=0;i<rw2Span;i++)
                {
                   unclrTableRow(sRow + i,'DATA_TABLE2');
                }
            }
            else
            {
                unclrTableRow(row, 'DATA_TABLE2');
            }

        }
        else
        {
            if(rwSpan>1)
            {
                var sRow = getStartRowIndex(row, rwSpan);
                //alert("sRow " + sRow);
                for(var i=0;i<rwSpan;i++)
                {
                   unclrTableRow(sRow + i);
                }
            }
            else
            {
                unclrTableRow(row);
            }
        }

    }

     // check the checkbox of current seleted row.
    function sr(row, secid)
    {
        var rwSpan = getRowSpan();

        if (HLRObj != '') // unselect currently highlighted row
        {
            HLRObj.style.background = szUnClrdRow
        }
        if (getElemnt('TBL'+secid))  // from pagelayout. this object should be null if freeze or col freeze
        {
            // highlight row and return
            HLRow(row, getElemnt('TBL'+secid))
            return;
        }

        if (row == nCurRow || parseInt(row) < 0)   // return if on the same row
            return;
        var obj = getobj('R');
        if (obj)
        {
            if (getobj('RT'))
                getobj('RT').checked = false;
            if ((typeof obj.length) != 'undefined') // array
            {
                unselectAll('R');
                // loop through all the select the one which has the value as row
                for (var k=0; k < obj.length; k++)
                {
                    var curCheckBox = obj[k];
                    if (curCheckBox.value == row)
                    {
                        curCheckBox.checked = true;
                        selectTableRow(row,rwSpan);
                    }
                }
            }
            else
            {
                obj.checked = true;
                selectTableRow(0,rwSpan);
            }
        }
        nCurRow = row;
    }

     function handle1(obj, row)
    {
        var rwSpan = getRowSpan();

        if (obj.checked == true)
        {
            nCurRow = row;

            selectTableRow(row,rwSpan);
        }
        else if (!isSelected('R'))
        {
            nCurRow = -1;

            unselectTableRow(row,rwSpan);
        }
        else
        {
            unselectTableRow(row,rwSpan);
        }
    }

    function unselectAll(objname)
    {
        var rwSpan = getRowSpan();
        var obj = getobj(objname);
        if (obj)
        {
            if ((typeof obj.length) == 'undefined')  // only one checkbox
            {
                obj.checked = false;
                unselectTableRow(obj.value,rwSpan);
                return;
            }

            for(i=0;i< obj.length;i++)
            {
                e=obj[i];
                if (e.type=='checkbox' && e.checked && e.name == objname)
                {
                    unselectTableRow(e.value,rwSpan);
                    e.checked=false;
                    window.status = window.status +":unselectAll " + nCurRow ;
                    nCurRow = -1;  // no detail record is selected.

                }
            }
        }
    }

    function handleLocal(obj, occ)
    {
    //currently occ is not used, might be feature if required can be used.
       cf(obj);
    }

    function handleSize(obj,occ)
    {
        sr(occ,'');
        cf(obj);
    }

    function Copy()
    {
    	// Tracker#:16400 PDM APPLICATION ISSUE: <POM SCREEN: UNABLE TO SELECT COPY>
    	// removed the alert message and condition which was preventing submit the request.
    	// in PLM pom worksheet copy process.
      	if(!isValidRecord("URL", "N")) return;
      	
      	if (getval('chgflds') != "")
        {
            if (confirm(szMsg_Changes))
            {
                fsubmit(szSAVE);
                return;
           }
        }
		submitFrm('copy');
    }

    function calculateSepcification()
    {
       if(!isValidRecord("URL", "N")) return;
       submitFrm('calculateGradingSpecification');
    }

    function showFitEvaluation()
    {
       // Using the PLM APIS to reload the work area
       var url = "newFEfromtechspec";

       // Tracker#: 14075 ADD MESSAGE ONLY ONE SAMPLE SIZE MAY BE USED WHEN CREATING A FIT EVAL
       // Need to check for any modified fields on the screen.
       // check for changes
       if (bCheck4Changes)
       {
           url = hasChanged(url)
       }

       if (url == '')
       {
        return;
       }

       if(!isValidRecord("URL", "N")) return;

       // Need to handle separately as the Form elements
       // needs to be made available in the ajax request.
       if(url == 'save')
       {
        submitFrm('save');
        return;
       }
       loadWorkArea("pomworksheet.do", url, null, _showFitEval);
    }

    function viewFitEvaluations()
    {
       // Using the PLM APIS to reload the work area
       var url = "viewFEfromtechspec";

       // Tracker#: 14075 ADD MESSAGE ONLY ONE SAMPLE SIZE MAY BE USED WHEN CREATING A FIT EVAL
       // Need to check for any modified fields on the screen.
       // check for changes
       if (bCheck4Changes)
       {
           url = hasChanged(url)
       }

       if (url == '')
        return;

       if(!isValidRecord("URL", "N")) return;

       // Need to handle separately as the Form elements
       // needs to be made available in the ajax request.
       if(url == 'save')
       {
        submitFrm('save');
        return;
       }
       loadWorkArea("pomworksheet.do", url, null, _showFitEval);
    }

    function _showFitEval(objAjax)
    {
        var htmlError = objAjax.error();

         // Tracker#: 14225  FIT EVAL ENHANCEMENT FOR SIZE SETS
         // If An error has occured do not close the Create Size Fit Eval popup.
         if(!htmlError.hasErrorOccured())
         {
            closeMsg();
         }
         _displayProcessMessage(objAjax);

         // Expand the Design Center as the Navigation Section
         // needs to display Fit Evaluation navigation link
         // rather than the techspec link.
         // Only if there are no errors call restoreArea(0) which reloads all the
         // links related on Design Center otherwise do not change the
         // Navigation Menu on the Navigator and remain on the same.
         if(htmlError.getWarningMsg() == null || htmlError.getWarningMsg().length == 0
            && (htmlError.getErrorMsg() == null || htmlError.getErrorMsg().length == 0))
         {
             restoreArea(0);
         }

        // Tracker#: 14075
        // Reset the chgflds chances are there that the user has
        // decided to Save the details rather than navigating to
        // the fit Eval screen. So chgflds needs to be reset.
        setval('chgflds', '');
        _execAjaxScript(objAjax);
    }

    function addPOM()
    {
        if(!isValidRecord("URL", "N")) return;
        var bDisp = true;

        if (getval('chgflds') != "")
        {
            if (confirm(szMsg_Changes))
            {
                fsubmit(szSAVE);
                bDisp = false;
            }
        }
        if (bDisp)
        {
            show('preprint');
            getPOMCodes('plmpomworksheet.do?method=listmodelpomcodes');
        }
        setval('szRselect',"false");
    }

    function getForm()
    {
        return eval('document.'+ FRM);
    }
    function createXMLHttpRequest()
    {
       try { return new ActiveXObject("Microsoft.XMLHTTP"); } catch (e) {}
       try { return new XMLHttpRequest(); } catch(e) {}
       return null;
    }

    var ireq=null;

function invokeColFreeze(objName)
{
	colfreeze('TITLE_DIV' + objName, 'DATA_DIV' + objName , 'TITLE_TABLE' + objName, 'DATA_TABLE' + objName, false);
}

//-------------------------------
// Tracker: 12404 HORIZONTAL SCROLL DOES NOT REACH END OF ROW WHEN COLUMN FREEZE IN PLACE ON POM TAB
// Adjust the widths of the Data Divs based on the screen width.
// This is done to fit the Data Divs well with in the screen width.
// Takes care of the Navigation Bar ....
//-------------------------------
function resetFreezedPOMSecondDivWidth()
{
	var topd= getElemnt("TITLE_DIV2");

    if(topd)
    {
	    adjustOuterDivs("TITLE_DIV2", "DATA_DIV2" , "TITLE_TABLE2");

	    var isTopDiv2Obj = (topd.id == "TITLE_DIV2" ? true : false);

	    // Check to see if the combined width of the menu + data div 1 and data div 2 is more than the screen width
	    if(isTopDiv2Obj)
	    {
	        var firstBottomDiv1 = getElemnt("DATA_DIV1");
	        var bottomd = getElemnt("DATA_DIV2");

	        if(bottomd && firstBottomDiv1)
	        {
		        var overallWidth = firstBottomDiv1.offsetWidth + bottomd.offsetWidth + nMenuWidth + nWithinaTable;

		        var scrollWidth = 0;
		        if (bottomd.scrollHeight > bottomd.offsetHeight)         // there is a vertical scroll consider the scroll bar too.
		        {
		            scrollWidth = (nScrlbar + 2);
		        }

		        if(overallWidth > nCurScrWidth)
		        {
		            bottomd.style.width = nCurScrWidth - (nMenuWidth + nWithinaTable + firstBottomDiv1.offsetWidth + scrollWidth)+"px";
		            topd.style.width = nCurScrWidth - (nMenuWidth + nWithinaTable + firstBottomDiv1.offsetWidth + scrollWidth)+"px";
		        }
	        }
	    }
    }
}



function alignDetailDiv()
{
    var dataDivObj = getElemnt("DATA_DIV");

    // -------------------------------------------
    // Tracker: 12404 HORIZONTAL SCROLL DOES NOT REACH END OF ROW WHEN COLUMN FREEZE IN PLACE ON POM TAB
    // Deciding whether there is a col freeze or not
    // by checking Data_DIV object
    // This is available if there is no freeze.
    // This is done as the colFreezed client variable
    // gets registered onl after this function has
    // been called.
    // -------------------------------------------
    if(dataDivObj && typeof(dataDivObj) != 'undefined')
    {
        alignUnFreezedDetailDivs('TITLE_DIV', 'DATA_DIV' , 'TITLE_TABLE');
        return;
    }

    colFreezed = true;

	try
	{
		handleColLock(nLockedcols);
	}
	catch(e){}

    resetFreezedPOMSecondDivWidth();
	var objhd1 = getElemnt('HEADER_DIV1');
	var objhd2 = getElemnt('HEADER_DIV2');

	var objht1 = getElemnt('HEADER_TABLE1');
	var objht2 = getElemnt('HEADER_TABLE2');

	var objtd1 = getElemnt('TITLE_DIV1');
	var objtd2 = getElemnt('TITLE_DIV2');

	var objtt1 = getElemnt('TITLE_TABLE1');
	var objtt2 = getElemnt('TITLE_TABLE2');

    var objdd1 = getElemnt('DATA_DIV1');
	var objdd2 = getElemnt('DATA_DIV2');

	var objdt1 = getElemnt('DATA_TABLE1');
	var objdt2 = getElemnt('DATA_TABLE2');

	var objpd = getElemnt('pglvl1');

	if(objpd && objhd1 && objhd2 && objht1 && objht2 && objtd1 && objtd2 && objtt1 && objtt2 && objdd1 && objdd2 && objdt1 && objdt2)
	{
        //alert("here");
		var parentTop = parseInt(objpd.offsetTop);
		var lft1 = parseInt(objpd.offsetLeft);
		var lft2=0;
		var top2=0;
        var ht=0;

		//setting header divs
		setLeft(objhd1, lft1);
		setTop(objhd1, parseInt(parentTop));
		setTop(objhd2, parseInt(parentTop));

		//setting pom table width to the pom header
		setWidth(objht1, parseInt(objtt1.offsetWidth));
		setWidth(objht2, parseInt(objtt2.offsetWidth));
		setWidth(objhd2, parseInt(objtd2.offsetWidth));

		lft2 = parseInt(1+objht1.offsetWidth);
		setLeft(objhd2, lft2 );

		//setting title divs
		setLeft(objtd1,parseInt(objhd1.offsetLeft));
		top2 = parseInt(parentTop + objhd1.offsetHeight);
		setTop(objtd1, top2);

        ht = (parseInt(objtt2.offsetHeight)>parseInt(objtt1.offsetHeight))?parseInt(objtt2.offsetHeight):parseInt(objtt1.offsetHeight);
		setHeight(objtt1, ht);
        setHeight(objtt2, ht);

        ht = (parseInt(objht2.offsetHeight)>parseInt(objht1.offsetHeight))?parseInt(objht2.offsetHeight):parseInt(objht1.offsetHeight);
		setHeight(objht1, ht);
        setHeight(objht2, ht);

        ht = (parseInt(objhd2.offsetHeight)>parseInt(objhd1.offsetHeight))?parseInt(objhd2.offsetHeight):parseInt(objhd1.offsetHeight);
		setHeight(objhd1, ht);
        setHeight(objhd2, ht);

		setLeft(objtd1,lft1);

		setLeft(objtd2, lft2);
		setTop(objtd2, top2);

		//setting data divs
		top2 = top2 + parseInt(objtd1.offsetHeight);
		setLeft(objdd1, lft1);
		setLeft(objdd2, lft2);

		setTop(objdd1,top2);
		setTop(objdd2,top2);

        setHeight(objdt1, parseInt(objdt2.offsetHeight));
        //align td height in case of rowspan
		setDataDivLeftRowHeight(objdt1,objdt2);

		// Align the Data divs within the screen height or else the scrolls will not be visible.
		// After subtracting even now if the detail div is not visible on the screen, then need to decrease the height again.
        var divStyle = document.getElementById("_divDataWorkArea");
        if(!divStyle)
        {
            divStyle = document.getElementById("_divWorkAreaContainer");
        }
        var workAreaHeight = divStyle.offsetHeight;
        var firstBottomDiv1 = getElemnt("DATA_DIV1");

        if(typeof(firstBottomDiv1) != 'undefined' && firstBottomDiv1)
        {
            var secondBottomd = getElemnt("DATA_DIV2");

            if(firstBottomDiv1 && secondBottomd)
            {
                var dataDivTop = secondBottomd.offsetTop;
                var dataDivHeight = secondBottomd.offsetHeight;

                // If less then the work area div, then stretch the
                // height till the screen height
                if((dataDivTop + dataDivHeight) < workAreaHeight)
                {
                    secondBottomd.style.height = secondBottomd.offsetHeight + (workAreaHeight - dataDivTop - dataDivHeight)+"px";
                    firstBottomDiv1.style.height = firstBottomDiv1.offsetHeight + (workAreaHeight - dataDivTop - dataDivHeight) +"px";
                }
                else
                {
                    // Consider the scroll bar's width too as the divs should be clearly visible.
                    secondBottomd.style.height = workAreaHeight - dataDivTop - nScrlbar  +"px";
                    firstBottomDiv1.style.height = workAreaHeight - dataDivTop -  nScrlbar  +"px";
                }
            }
        }

	}
}


// to freeze the titles in a table - used on pretty much all the screens for detail grid
function freeze(title_id, data_id, title_div, data_div, title_table, data_table)
{
    ddobj = getElemnt(data_div);
    dtobj = getElemnt(data_table);
    tdobj = getElemnt(title_div);
    ttobj = getElemnt(title_table);

    // -------------------------------------------------------------------
    // Tracker#: 13909 ALIGNMENT ISSUE ON SOURCING SCREENS DETAIL SECTION AS WELL AS ON SEARCH SCREEN
    // JSPUtils.js_css sets the nExtra value as 3 but pages that do not
    // call this method will pick the nExtra from comfunc.js which is set
    // to 10. Changing the value here.
    // -------------------------------------------------------------------
    var nExtraTemp = nExtra;

    if(typeof(fromNewQueryViewer) != 'undefined') // for tracker # 14074
    {
    	nExtra = 1;
    }
    else
    {
    	nExtra = 3;
    }
    var nCurTableWidth = ttobj.offsetWidth;
    // Tracker#: 11431 FIX SCROLLING ISSUES ON POM SCREEN IN PLM
    if (nCurTableWidth < nCurScrWidth)  // table is smaller than the screen
    {
        // Really don't know why the number 300? After alignTables the table width was getting streched beyond the screen width hence the
        // subtracting the number 300
        ttobj.style.width = nCurScrWidth - nMenuWidth  - nWithinaTable - 300+"px";
        dtobj.style.width = nCurScrWidth - nMenuWidth  - nWithinaTable - 300+"px";
    }
    // align columns
    alignColumns(title_id, data_id, title_table, data_table);
    //align tables
    alignTables(title_table, data_table);
    // align divs which holds the tables
    adjustOuterDivs(title_div, data_div , title_table);
    // Resetting the same so that other pages are not affected.
    nExtra = nExtraTemp;

}

// internal function to freeze - adjust the tables and idvs after cols have been adjusted
function adjustOuterDivs(topd, bottomd, toptable)
{
    topd = getElemnt(topd);
    bottomd = getElemnt(bottomd);
    toptable = getElemnt(toptable);
    var scrTemp = nCurScrWidth;

    if (topd && bottomd && toptable)
    {
        var nCurTableWidth = toptable.offsetWidth;

        if (nCurTableWidth < nCurScrWidth)  // table is smaller than the screen
        {
            if (bottomd.scrollHeight > bottomd.offsetHeight)  // there is scroll bar
            {
                bottomd.style.overflowY = "auto";
                topd.style.width = nCurScrWidth - nMenuWidth - nScrlbar - nWithinaTable - 6+"px";
                // Tracker 14538  POM-VERTICAL SCROLL AT FAR RIGHT OF SCREEN DISAPPEARS
                bottomd.style.width = nCurScrWidth - nMenuWidth - nScrlbar - nWithinaTable+"px";// Consider the Scroll Bar width too...

                if(typeof(fromNewQueryViewer) != 'undefined') // for tracker # 14074
    			{
                	if((nCurTableWidth < getElemnt('_divWorkArea').offsetWidth) && (colFreezeEnabled == false))
                	{
                		bottomd.style.overflowX = "hidden";
                	}
                }
            }
            else
            {
                bottomd.style.overflowY = "hidden";
                topd.style.width = nCurScrWidth - nMenuWidth  - nWithinaTable - 6+"px";
                bottomd.style.width = nCurScrWidth - nMenuWidth  - nWithinaTable - 6+"px";
                bottomd.style.height = bottomd.offsetHeight + nScrlbar+"px";
            }

            bAdjusttbl = false;
        }
        else           // table streches beyond the screen
        {
            if (bottomd && (bottomd.scrollHeight > bottomd.offsetHeight))         // there is a vertical scroll
            {
                 if((nCurScrWidth - nScrlbar - nWithinaTable)>=0)
                 {
		             topd.style.width = nCurScrWidth - nMenuWidth  - nScrlbar - nWithinaTable+"px";
		         }

		         if((nCurScrWidth - nWithinaTable)>=0)
                 {
                     // Tracker 14538  POM-VERTICAL SCROLL AT FAR RIGHT OF SCREEN DISAPPEARS
		             bottomd.style.width = nCurScrWidth - nMenuWidth - nWithinaTable - nScrlbar+"px";// Consider the scroll bar too.
                 }
                 bottomd.style.height = bottomd.offsetHeight - 8+"px";
            }
            else    // if they is no vertical scroll
            {

                if(bottomd)
                {
	                if((nCurScrWidth - nWithinaTable)>=0)
	                {
	                	topd.style.width = nCurScrWidth - nMenuWidth - nWithinaTable+"px";
	                	bottomd.style.width = nCurScrWidth - nMenuWidth - nWithinaTable+"px";
	                }

	                bottomd.style.height = bottomd.offsetHeight + nScrlbar+"px";
                }
            }
        }
   }

    // Make sure the horizontal Scroll bars are visible only if there is a vertical scroll bar.
    if (bottomd && (bottomd.scrollHeight > bottomd.offsetHeight))
    {
        bottomd.style.height = bottomd.offsetHeight - 30+"px";
    }

	nCurScrWidth = scrTemp;
}

function setDataDivLeftRowHeight(objdt1,objdt2)
{
	var tr1coll = objdt1.getElementsByTagName("tr");
    var tr2col1 = objdt2.getElementsByTagName("tr");

	var rcnt1 = 0;
	var i=0;

    if(tr1coll && tr1coll.length)rcnt1 = tr1coll.length;

	var td2coll = objdt2.getElementsByTagName("td");

	if(td2coll && td2coll.length>0)
	{
		for(i=0;i<rcnt1;i++)
		{
			var tr1 = tr1coll.item(i);

			if(tr1 && tr2col1.item(i))
			{
                var tr2 = tr2col1.item(i);
                td2coll = tr2.getElementsByTagName("td");
                //alert("tr["+i+"]\n"+tr1.outerHTML);
				var td1coll = tr1.getElementsByTagName("td");

				if(td1coll && td1coll.length>0)
				{
					var td1 = td1coll.item(0);

					if(td1 && td1.getAttribute("rwspan"))
					{
                        //alert("td1 \n "+ td1.outerHTML);
						var rwSpan = parseInt(td1.getAttribute("rwspan"));

						if(rwSpan>0)
						{
							var stRw2Ind = parseInt(rwSpan * i);
							var ht = 0;
							var c =0;

							for(c=0;c<rwSpan;c++)
							{
								//var td2 = td2coll.item(stRw2Ind + c);

                                var td2 = td2coll.item(c);
								if(td2)
								{
									//alert("ht " + ht + "\n td2.offsetHeight" + td2.offsetHeight);
									ht = parseInt(ht+td2.offsetHeight);

                                    //alert("td2 ["+i+"] = \n" + td2.outerHTML);
                                    //if right side td has rowspan then, move the pointer to the next row
                                    if(td2.getAttribute("rowspan"))
                                    {
                                        var rwspanRight = parseInt(td2.getAttribute("rowspan"));
                                        if(rwspanRight>1)
                                        {
                                            c = c+  (rwspanRight-1);
                                        }
                                    }
								}
							}
							if(ht>0)
							{
								//alert("["+i+"] final ht " + ht);
								setHeight(td1,ht);
							}
						}
					}
				}
			}
		}
	}
}

// select or unselect all checkbox based on current value
function handleAllCustom(obj, objname)
{
	if (obj.checked == true)
		selectAllCustom(objname)
	else
		unselectAllCustom(objname);
}

function selectAllCustom(objname)
{
    var rwSpan = getRowSpan();
    var obj = getobj(objname);
    if(obj)
    {
        if ((typeof obj.length) == 'undefined')
        {
            obj.checked = true;
            selectTableRow(obj.value, rwSpan);
            return;
        }

        for(i=0;i< obj.length;i++)
        {
            e=obj[i];
            if (e.type=='checkbox' && !(e.checked) && e.name == objname)
            {
                selectTableRow(e.value, rwSpan);
                e.checked=true;
                nCurRow = 0;  // just to make sure it is not hdr which is -1
            }
        }
    }
}

function unselectAllCustom(objname)
{
    var rwSpan = getRowSpan();
    var obj = getobj(objname);
    if (obj)
    {
        if ((typeof obj.length) == 'undefined')  // only one checkbox
        {
            obj.checked = false;
            unselectTableRow(obj.value,rwSpan);
            return;
        }

        for(i=0;i< obj.length;i++)
        {
            e=obj[i];
            if (e.type=='checkbox' && e.checked && e.name == objname)
            {
                unselectTableRow(e.value,rwSpan);
                e.checked=false;
                //window.status = window.status +":unselectAll " + nCurRow ;
                nCurRow = -1;  // no detail record is selected.

            }
        }
    }
}

// function is called after the menu to put the data in the div so the user does not loose menu upon scrolling
function lockMenu()
{
    lockMenuclr('FFFFFF');
}

// main div of each page
function lockMenuclr(clr)
{
    var topx = 0;
    var obj = "";
    if (bMenuExists)
    {
        obj = getElemnt('TSSMENU');
        if (obj)
        {
	        topx+=obj.offsetHeight;
        }
        obj = getElemnt('TSSICON');
        if (obj)
            topx+=obj.offsetHeight;
    }

    if ( bDisplayCopyRightAlways )
	topx+=18;

	TOP4LOCK = topx - 18;
    var lockObj = getElemnt("LOCK");
    lockObj.style.top = parseInt(topx-18)+"px";
    // alert("Got Work Area obj");
    var lockDefaultWidth = parseInt(nCurScrWidth);
    var lockDefaultHeight = parseInt(nCurScrHeight-topx);
    var divObj  = document.getElementById("_pomworksheercdetail");
    if(divObj)
    {
        divObj.style.width = "100%";
        divObj.style.height= parseInt(lockDefaultHeight)+5+"px";
        divObj.style.overflow="hidden";
    }
    lockObj.style.width = lockDefaultWidth+"px";
    lockObj.style.height = lockDefaultHeight+"px";
    lockObj.style.overflowX = "hidden";
    /* divObj = document.getElementById("_divWorkArea");// document.getElementById("_divWorkArea");
    divObj.style.width = "100%";
    divObj.style.overflow="hidden"; */
    alignWorkAreaContainer();
    prePrintProcessing();
}

function alignUnFreezedDetailDivs(topd, bottomd, toptable)
{
    try
    {
        topd = getElemnt(topd);
        bottomd = getElemnt(bottomd);
        toptable = getElemnt(toptable);
        var isVerticalScroll = false;
        if (topd && bottomd && toptable)
        {
            var nCurTableWidth = toptable.offsetWidth;

            // alert("nCurTableWidth " + nCurTableWidth + "  nCurScrWidth" + nCurScrWidth);
            if (nCurTableWidth < nCurScrWidth)  // table is smaller than the screen
            {
                if (bottomd.scrollHeight > bottomd.offsetHeight)  // there is scroll bar
                {
                    isVerticalScroll = true;
                }
            }
            else
            {
                if (bottomd.scrollHeight > bottomd.offsetHeight)         // there is a vertical scroll
                {
                     isVerticalScroll = true;
                }
            }
       }

        // After subtracting even now if the detail div is not visible on the screen, then need to decrease the height again.
        var objLock = getElemnt("LOCK");
        var isDataDivDefined = (typeof(bottomd) == 'undefined' ? false : (bottomd == null ? false : true));
        var offsetTop = (isDataDivDefined ? bottomd.offsetTop : 0);
        var offsetHeight = (isDataDivDefined ? bottomd.offsetHeight : 0);
        var myStuffDiv = getElemnt("_divToolArea");
        var myStuffDivHt = 0;

        if(myStuffDiv && myStuffDiv.style.visibility!="hidden")
        {
            myStuffDivHt = myStuffDiv.offsetHeight - 10;
        }
        var lockDefaultHeight = getElemnt("_divWorkAreaContainer").offsetHeight;
        lockDefaultHeight = lockDefaultHeight + parseInt(myStuffDivHt);
        var heightFromTop = parseInt(objLock.offsetTop) + parseInt(offsetTop) + parseInt(offsetHeight);

        if(heightFromTop > lockDefaultHeight)
        {
            var difference = (heightFromTop - parseInt(lockDefaultHeight));
            bottomd.style.height =  parseInt(offsetHeight) - (parseInt(difference))+"px";
            if(isVerticalScroll)
            {
                bottomd.style.height = parseInt(offsetHeight) - parseInt(nScrlbar)+"px";
            }
        }
    }
    catch(e)
    {
        // alert(e.description)
    }
}

// end the main div 'LOCK' and sets up the onresize event for the window.
function endLock()
{
    // document.write("</div>");
    var obj = getElemnt("TSSBOT");
    if(obj) obj.style.top = (nCurScrHeight-18)+"px";
    hide('preprint');
    _hideWaitWindow();
    crDiv();
    window.onresize = function () {
    	alignTwoTableColumns.calledOnResize(function () {
    		setHW(); adjLOCK(); if (ddobj) { freeze('T', 'D', 'TITLE_DIV', 'DATA_DIV' , 'TITLE_TABLE', 'DATA_TABLE'); } else if (dd2obj) { handleColLock(nLockedcols); } expandtl();
    	});
    };
}

function crDiv()
{
    attachScreenListener();
}

function getPOMCodes(url)
{
    var popW = 800, popH = 400;
	var wLeft = (screen.width - popW) / 2;
	var wTop = (screen.height - popH) / 2 - 50;
	var windowName = 'addpomcode';
    var nWindow = window.open(url, windowName,'width=' + popW + ',height=' + popH + ',left=' + wLeft + ',top=' + wTop + ',toolbar=no,menubar=no,scrollbars=no,resizable=yes')
}

function displayPOMCodes()
{
    if(objAjax)
    {
       var errors = objAjax.error();

        if (errors.hasErrorOccured())
        {
            var msgDiv = new messagingDiv(errors);

            results = [];
            actionUrl = ""; //Reset URL
        }
        else
        {
            // var addPomDiv = createAddPomDiv();
            // eval(objAjax.getHTMLResult());

            var popW = 800, popH = 650;
	        var wLeft = (screen.width - popW) / 2;
	        var wTop = (screen.height - popH) / 2 - 50;
            //alert("url:" + url);
            var nWindow = window.open(url, windowName,'width=' + popW + ',height=' + popH + ',left=' + wLeft + ',top=' + wTop + ',toolbar=no,menubar=no,scrollbars=no,resizable=yes')
        }
    }
}


function searchPOMModels()
{
    var searchControl = new VALIDATION.SearchControl(null, false, null,
                    'validationsearch.do?valId=1154&codeFldName=null&showDesc=N&sectionId=0&rowNo=0&actRowNo=0');
    searchControl.setOnBeforeSinglePost(gotPomModelName);
    searchControl.showPopup();
}


function gotPomModelName(rowValues)
{
    var modelName = "";
    if(rowValues != null && rowValues.length > 0)
    {
        modelName = rowValues[0];
    }
    if(modelName == null || modelName.length == 0 )
    {
        alert("Please select a valid POM model.");
        return;
    }

    getPOMCodes('plmpomworksheet.do?method=listanymodelpomcodes&modelname=' + modelName);
}


function addModelInformationToDOM(modelAttributeName, ownerAttributeName, modelName, modelOwner)
{
    // var modelNameObj = getElemnt("gradingmodelname");
    var modelNameObj = getElemnt(modelAttributeName);

    if(modelNameObj == null || typeof(modelNameObj) == 'undefined')
    {
        createObject(modelAttributeName, modelName);
        createObject(ownerAttributeName, modelOwner);
    }
    // If the object has already been added to the DOM, then just change the owner and model name for the new selection.
    else
    {
        modelNameObj.value = modelName;
        var modelOwnerObj = getElemnt(ownerAttributeName);
        modelOwnerObj.value = modelOwner;
    }
}

function createObject(objNameId, objValue)
{
    var newObj = document.createElement("input");
    setAttribute(newObj, "type", "hidden") ;
    setAttribute(newObj, "name", objNameId) ;
    setAttribute(newObj, "id", objNameId) ;
    newObj.value = objValue;
    document.appendChild(newObj);
}

function pageNav(nextRecordKey)
{
    var pageNavKeyObj = getElemnt("pagenavkey");
    if(pageNavKeyObj == null || typeof(pageNavKeyObj) == 'undefined')
    {
        createObject("pagenavkey", nextRecordKey);
    }
    else
    {
        pageNavKeyObj.value = nextRecordKey;
    }
    fsubmit("pagenav");
}

function pageNavByDropDown()
{
    var current_page = getElemnt("current_page");
    var nextRecordKey = current_page.value;
    pageNav(nextRecordKey);
}
