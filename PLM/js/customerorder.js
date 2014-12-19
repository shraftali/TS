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

function toggleSearchField(bShow)
{
    if(bShow == false)
    {
        handleList(6,null,'FLTR_OPEN','sgndt');
    }
    else
    {
        handleList(2,'FLTR_OPEN',null,'sgndt');
        var obj = getElemnt('FLTR_OPEN');
    }
}


 // opens up a new window
    function oW(wname,url,nWidth,nHeight)
    {
        var nWindow = window.open(url, wname,'width=' + nWidth + ',height=' + nHeight + ',toolbar=no,menubar=no,scrollbars=no,resizable=yes')
        return nWindow;
    }

    function cStoresAvg()
    {

    }

	function setOldVal(obj)
    {
        nOldVal = obj.value;
    }

	//will be called from popup windows for reloading the page
    function submitPage()
    {
       if(FRM)
       {
            var objFrm;
            eval("objFrm = document."+FRM);
            if(objFrm)
            {
                waitWindow();
                fsubmit('refresh');
            }
       }
    }

	function viewSizeRange(row)
    {
        //alert("row " + row);
        var totalRow = 0;
        var tltRecords = getElemnt("totalNumberOfDetailRecords");
        if(tltRecords)
        {
            totalRow = tltRecords.value;
        }
        var actRow = -1;
        var objAct = getElemnt("ActRow_"+row);
        if(objAct)
        {
            actRow = objAct.value;
        }
        sizePage = oW('sizeRange','sizeoffassoc.do?method=customerorderview&actrowindex='+row+'&actrow='+actRow+'&totalRows='+ totalRow+'&rowindex='+row+'&parent_doc_id=11700&parent_level_id=0',700,400);
        //alert("df");
    }

    function setCurrentRowNumber(num)
    {
        var obj = getElemnt('hdnCurrentRecordNo');

        if(obj && num)
        {
            obj.value = num;
        }
    }

	function showAllDiv()
    {
        try
        {
            resetSizeInfo();
            setTitleWidth(true);
            setHW();
            adjLOCK();
            initDiv();
         }
         catch(e)
         {
            //alert("error in resize\n" + e.description);
         }
    }

    function setTitleWidth(blnFlag)
    {
        return true;

        /*var objtd1 = getElemnt('TITLE_DIV1');
        var percent = .4;

        if(objtd1)
        {
            var tlt1Width = parseInt(objtd1.offsetWidth);

            if(nCurScrWidth && ((blnFlag==true) ||(tlt1Width > (nCurScrWidth*percent))))
            {
               //alert("nCurScrWidth " +nCurScrWidth);
               setWidth(objtd1, parseInt(nCurScrWidth*percent));
            }
        } */
    }

	function initDiv()
	{
        //override the tr background color to white
        //after unselecting row in the detail table
        szUnClrdRow = '#FFFFFF';

        //hide all the detail section div
        toggleDiv(false);

        maxTitleDiv = 2;
        //alert("nActFlowNum:" + nActFlowNum);
        if(typeof(nActFlowNum)=="undefined")
        {
            nActFlowNum = -1;
        }

        if(typeof(totalNoOfFlows)=="undefined")
        {
            totalNoOfFlows =0;
        }

        if(typeof(nNoOfFlowDisplay)=="undefined")
        {
            nNoOfFlowDisplay =1;
            nNoOfDataDivs = 3;
        }

        setFlowNumber('DATA_DIV2','TITLE_DIV2',nActFlowNum);

        try
        {
            setTitleWidth();
            handleHeaderDiv(maxTitleDiv);
		    handleColLock(nLockedcols);
        }
        catch(e)
        {
            //alert("In Catch");
            //alert("No Valid data found " + e.description);
        }


        //sets the header div position
        showDisplay(arrSummaryStaticDivnames[1]);
        alignSummaryDivs();
        handleHeaderDiv(maxTitleDiv);
        alignDetailDiv();
        displaySummarySection();

         //show all the detail section div
        toggleDiv(true);
	}

	function alignSummaryDivs()
	{
		try
		{

           handleList(2,'LIST','divFlowSummaryHeading','sgnLst');

            for(var k=0;k<(arrSummaryDivnames.length);k++)
            {
               var objHidDiv = getElemnt(arrSummaryDivnames[k]);
               if(objHidDiv)
               {
                showDisplayObj(objHidDiv);
                invokeColFreeze(arrSummaryDivnames[k]);
                hideDisplayObj(objHidDiv);
               }
            }

            for(k=0;k<(arrSummaryStaticDivnames.length);k++)
            {
               invokeColFreeze(arrSummaryStaticDivnames[k]);
            }
		}
		catch (e)
		{
			//alert("error in align summary divs\n" + e.description);
		}

		handleList(2,'divFlowSummaryHeading','LIST','sgnLst');
	}

	function invokeColFreeze(objName)
	{
	    colfreeze('TITLE_DIV_' + objName, 'DATA_DIV_' + objName , 'TITLE_TABLE_' + objName, 'DATA_TABLE_' + objName, false);
	}

	function toggleDiv(blnShow)
	{

		var arrlength = arrDetailDivs.length;
		//alert(arrlength);
		var obj = null;
		var visibilityValue = 'visible';

		if(!blnShow)visibilityValue = 'hidden';

		for(var k=0;k<(arrlength);k++)
		{
			obj = getElemnt(arrDetailDivs[k]);
			if(obj)obj.style.visibility = visibilityValue;
		}
	}

	function closemsg()
    {
        var nmsgHgt = getElemnt('TSSMSG').offsetHeight;
        var obj = getElemnt('LOCK');
        obj.style.top = parseInt(obj.style.top) - nmsgHgt - 2+"px";
        setHeight(obj, parseInt(obj.offsetHeight + nmsgHgt + 2))
        bMsgExists = false;
        hide('TSSMSG');
        if (nTotalLvl > 0)
            expandtl();

        alignDetailDiv();
    }

  /*
    function window.onunload()
    {
        if(masterViewWindow)
        {
            masterViewWindow.close();
        }
    }

    // not currently used functions
	function document.onreadystatechange()
	{
		//flipDataPosition(totalNoOfFlows);
	}

  */

    function handleMasterItem(objPName)
    {
        hideDisplay(objPName);
    }

    function showMasterView()
    {
        var objFrm;
        eval("objFrm = document."+FRM);

        if(objFrm)
        {
        var url =objFrm.action + "?method=masteritem";
        oW('masterview',url,'900','600');
    }
    }

    //todo: when we provide link for item number, call this method and submit the page
    function showRequest(obj)
    {
        //alert("obj "+ obj);
    }

   function highLightSubTTLSummary(performDeselect)
   {
        var obj = getElemnt("hdnSCCSummaryRowId");

        if(obj && parseInt(obj.value) != -1 )
        {
            var objSumType = getElemnt('hdnSummaryDisplaySection');

           if(objSumType && objSumType.value)
            {
                var objBtnName = objSumType.value;

                if(objBtnName && objBtnName.toString().length>0)
                {
                    for(var k=0;k<(arrSummaryDivnames.length);k++)
                    {
                       if(arrSummaryDivnames[k]==objBtnName.toLowerCase())
                       {
                            var tableName = arrSummaryTablenames[k];
                            var rowId = getSelectedRowId(obj, tableName);

                            if(rowId!= -1)
                            {
                                if(typeof(performDeselect) != "undefined")
                                {
                                   clrTableColumns(rowId, tableName,szUnClrdRow);
                                }
                                else
                                {
                                    clrTableColumns(0, tableName,szUnClrdRow);
                                    clrTableColumns(rowId, tableName);
                                }
                            }
                            break;
                       }
                    }
                }
            }
        }
   }

   function hightSummaryLiteRow(performDeselect)
    {
      //highlite both summary by flow and summary be sell channel section
       for(var j=0;j<(arrSummaryStaticHdnNames.length);j++)
       {
            var objHdn = getElemnt(arrSummaryStaticHdnNames[j]);
            if(objHdn)
            {
               var rowId = getSelectedRowId(objHdn, arrSummaryStaticTableNames[j],j);

                if(typeof(performDeselect) != "undefined")
                {
                    unclrTableRow(rowId, arrSummaryStaticTableNames[j]);
                }
                else
                {
                 //if(rowId>0)
                    clrTableRow(rowId,arrSummaryStaticTableNames[j]);
                }
            }
       }
    }


    function clrTableColumns(row,tableName, bgColor)
    {
        row = parseInt(row);
        var tName = "TABLE1"; // table id for non detail scroll table
        var tobj = getElemnt(tName);
        var bgClr =szClrdRow;

        if(typeof(bgColor)!='undefined')
        {
           bgClr = bgColor;
        }

        if(typeof(tableName)!="undefinied")	// for custom tables
        {
            tobj = getElemnt(tableName);

            if(tobj)
            {
                var tr_len = tobj.getElementsByTagName("tr").length
                var trobj = tobj.getElementsByTagName("tr").item(row);

                if (trobj)
                {
                    var trCells =  trobj.getElementsByTagName("td");

                    for(var count = 0 ; count < trCells.length ; count++)
                    {
                        tdobj = trCells.item(count);
                        tdobj.style.background = bgClr;
                    }
                }
            }
        }
    }

    function getSelectedRowId(obj, tableName, arrIndex)
    {
        var rowId = parseInt(obj.value);
        //rowId++;

        //apply only for flow summary
        /*if( (rowId == 0) && (arrIndex==0))
        {
            var tb = getElemnt(tableName)

            if(tb)
            {
               var tr_len = tb.getElementsByTagName("tr").length;
               rowId = parseInt(tr_len) -1;
            }
        }

        //apply only for flow summary
        if(arrIndex==0)
        {
            rowId++;
        }*/

        if(arrIndex==0)
        {
            rowId++;
        }
        else if(rowId<0)
        {
            rowId = 0;
        }

        return rowId;
    }

    function scrollToSelectedRow(rowId)
    {
        if(!rowId || typeof(rowId) == "undefined" )
        {
            rowId = getSelectedRowId(getElemnt('hdnCurrentFlowid'));
        }

        var tobj = getElemnt(arrSummaryStaticTableNames[0]);
        var trobj = tobj.getElementsByTagName("tr").item(rowId);
        var divSummary = document.getElementById("divFlowList");
        if(divSummary && typeof(divSummary) != "undefined" && trobj && typeof(trobj) != "undefined")
        {
            divSummary.scrollTop = parseInt(trobj.offsetTop);
        }
    }

    function adjustDivHeight(div,tab)
    {
        var divObj = getElemnt(div);
        var tabObj = getElemnt(tab);

        if(divObj,tabObj)
        {
           setHeight(divObj,(parseInt(tabObj.offsetHeight)));
        }
    }

    function adjustDivWidth(div,tab)
	{
		var divObj = getElemnt(div);
		var tabObj = getElemnt(tab);

		if(divObj,tabObj)
		{
           setWidth(divObj,(parseInt(tabObj.offsetWidth)));
		}
	}

    function displaySummarySection()
    {
        var obj = getElemnt('hdnSummarySectionStatus');

        //earlier user has clicked on any summary buttons
        if(obj && obj.value=="1")
        {
            var objSumType = getElemnt('hdnSummaryDisplaySection');

            handleList(2,'LIST','divFlowSummaryHeading','sgnLst');

            if(objSumType && objSumType.value)
            {
                flipFlowSummaryDet(objSumType.value);
            }
        }

        hightSummaryLiteRow();
        highLightSubTTLSummary();
    }

    function filterBySellChannelClass(summaryName, filterId, rowId)
    {
        if(summaryName && summaryName.toString().length > 0 && filterId && filterId.toString().length>0)
        {
             //reset the detail pagination
            resetCurrentPageRecordNumber();
            hightSummaryLiteRow(true);
            highLightSubTTLSummary(true);

            if(isFloatingSummary(summaryName) == true)
            {
                //setting floor set, class and subclass values

                var objWhichSummary = getElemnt('hdnWhichSummary');
                var objFilterId = getElemnt('hdnFilterId1');

                objWhichSummary.value = summaryName;
                objFilterId.value = filterId;

                var objName = getElemnt("hdnCurrentFlowid");
                nActFlowNum = parseInt(objName.value);
                var objSCCSummaryRowId = getElemnt('hdnSCCSummaryRowId');
                objSCCSummaryRowId.value = parseInt(rowId);

                displayFlowData(nActFlowNum, "hdnCurrentFlowid");
             }
             else
             {
                //for setting selling channel values
                var objSellChannel = getElemnt('hdnCurrentSellChannel');
                var objSellChannelRowId = getElemnt('hdnCurrentSellChannelRowId');

                updateValue('hdnSummaryClicked',summaryName);

                objSellChannel.value = filterId;
                objSellChannelRowId.value = rowId;
                displayFlowData(nActFlowNum, "hdnCurrentFlowid");
             }
        }
        else
        {
            alert(contactAdmiin);
        }
    }

    function isFloatingSummaryByName(disDivName)
	{
		var retVal = false;

		for(var k=0;k<(arrSummaryDivnames.length);k++)
		{
		   if(arrSummaryDivnames[k] == disDivName)
		   {
				//alert("condition matched");
				retVal = true;
				break;
		   }
		}

		return retVal;
	}

    function isFloatingSummary(columnName)
    {
        var retVal = false;

        for(var i=0;i<(arrSummaryColNames.length);i++)
        {
            if(arrSummaryColNames[i]==columnName)
            {
                retVal = true;
                break;
            }
        }

        return retVal;
    }

    function resetObjValue(objName)
    {
      if(objName)
      {
        var obj = getElemnt(objName);

        if(obj && obj.length > 0)
        {
            var changedFields = obj.split(",");

            for(var count = 0 ; count < changedFields.length ; count++)
            {
                var fieldName = changedFields[count];
                var fieldObj = getElemnt("hdn" + fieldName);
                if(fieldObj)
                    fieldObj.value = "";
            }
        }

        if(obj)
        {
            obj.value = "";
        }
      }
    }

    function resetSCClassInfo()
    {
         resetObjValue("hdnWhichSummary");
         resetObjValue("hdnFilterId1");
    }

    function updateValue(objName,objValue)
    {
        if(objName && objValue)
        {

            var obj = getElemnt(objName);

            if(obj)
            {
                //alert("objValue "  + objValue);
                obj.value = objValue;
            }
        }
    }

    function flipDataPositionDet(divId,flowIndex,doSubmit)
    {
        var flwName =  displaySummary(divId);

        //alert("flwName "+ flwName);

        if(flwName && flwName.toString().length>0)
        {
            var objFlName = getElemnt('hdnCurrentFlowname');
            if(objFlName)objFlName.value = flwName;
        }

        //else
        {
            //alert("else");
            if(doSubmit!=0)
            {
                resetSCClassInfo();

                updateValue('hdnSummaryClicked','FLOWS');
                //alert("updated");
                var objName = "hdnCurrentFlowid";
                nActFlowNum = flowIndex;

                hightSummaryLiteRow(true);
                highLightSubTTLSummary(true);

                //resets the detail page record.
                resetCurrentPageRecordNumber();

                displayFlowData(flowIndex,objName);
            }
        }
    }

    function displaySummary(divId)
    {
          var obj = getElemnt('hdnSummaryDisplaySection');
          var dispDiv;

          if(obj)
          {
            var disDivName = obj.value;
            if((disDivName!=null) && (disDivName.toString().length>0))
			{
				dispDiv =getElemnt(disDivName);
			}
          }

          if(curFlowDiv)
          {
           // hideDisplayObj(curFlowDiv);
          }

          if(dispDiv)
          {
              var objFlLstDiv =  getElemnt('divFlowList');
              var objFlName = getFlowName(divId);

                if(objFlName && (objFlName.toString().length>0))
                {
                    var obhHdnFlName = getElemnt("hdnCurrentFlowname");
                    if(obhHdnFlName)obhHdnFlName.value=objFlName;
                    //alert("Display is :" + dvsnDiv.style.display);
                    //alert("setting flow name to hidden objFlName " + objFlName);
                    var divParName = dispDiv.id + objFlName;
                    //alert("divParName:" + divParName);
                    var obj = getElemnt(divParName);
                    //alert(obj);
                    if(obj && objFlLstDiv)
                    {
                        setTop(obj, parseInt(objFlLstDiv.offsetTop));
                        showDisplayObj(obj);
                        curFlowDiv = obj;

                        //div is shown
                        return objFlName;
                    }
                }
          }
    }

    function getFlowName(flIndex)
    {
        var objFl;
        objF1= getElemnt('aFlow'+ flIndex);

        if(objF1 && (objF1.value != null))
        {
         return  objF1.value;
        }
        return "";
    }

    function displayFlowData(flowIndex,objName)
    {
       var obj = getElemnt(objName)

       if(obj)
       {
           obj.value = (obj.value== 'null')?-1:obj.value;

           if(typeof(nNoOfFlowDisplay)=='undefinied')
           {
                nNoOfFlowDisplay =1;
           }

           flowIndex = (flowIndex<-1)?-1:flowIndex;
           flowIndex = (flowIndex>=totalNoOfFlows)?(totalNoOfFlows-1):flowIndex;
           obj.value = flowIndex;

           var objFlName = getFlowName(flowIndex);

           //alert("setting flow name "  +objFlName);
           var obhHdnFlName = getElemnt("hdnCurrentFlowname");

           if(obhHdnFlName)obhHdnFlName.value=objFlName;

           hightSummaryLiteRow();
           highLightSubTTLSummary();
       }

       if(FRM)
       {
            var objFrm;
            eval("objFrm = document."+FRM);
            if(objFrm)
            {
                resetObjValue("chgfldsLocal");
                 //resets the detail page record.
                resetCurrentPageRecordNumber();
                waitWindow();
                objFrm.submit();
            }
       }
    }

    function showFlowsDet(num,objName)
    {
       var obj = getElemnt(objName)

       if(obj)
       {

           obj.value = (obj.value== 'null')?-1:obj.value;
           if(typeof(nNoOfFlowDisplay)=='undefinied')
           {
                nNoOfFlowDisplay =1;
           }
           num = parseFloat(obj.value) + (num * nNoOfFlowDisplay);
           resetSCClassInfo();
           displayFlowData(num,objName);
       }
    }

    function flipFlowSummaryDet(disDivName,showSummarySection)
    {
        var objActDiv = getElemnt(disDivName);
        var objFlLstDiv =  getElemnt('divFlowList');

        if(objActDiv && objFlLstDiv)
        {
            setTop(objActDiv, parseInt(objFlLstDiv.offsetTop));

            if(isFloatingSummaryByName(disDivName) == true)
			{
                for(var k=0;k<(arrSummaryDivnames.length);k++)
                {
                   var objHidDiv = getElemnt(arrSummaryDivnames[k]);
                   if(objHidDiv)
                   {
                    hideDisplayObj(objHidDiv);
                   }
                }

                showDisplayObj(objActDiv);

                var obj = getElemnt('hdnSummaryDisplaySection');
                if(obj)obj.value=disDivName;

                nActFlowNum = (nActFlowNum<-1)?-1:nActFlowNum;
                nActFlowNum = (nActFlowNum>=totalNoOfFlows)?-1:nActFlowNum;

                var hdnFilterId = getElemnt("hdnFilterId1");
                var hdnWhichSummary = getElemnt("hdnWhichSummary");
                var k = 0;

                for( ; k<(arrSummaryDivnames.length); k++)
                {
                   if(disDivName == arrSummaryDivnames[k])
                   {
                        tableName = arrSummaryTablenames[k];
                        break;
                   }
                }

                if(hdnWhichSummary.value != arrSummaryColNames[k])
                {
                    if(tableName != "") clrTableRow(0, tableName);
                }

                flipDataPositionDet(nActFlowNum,nActFlowNum,0);
             }
        }
        alignDetailDiv();

        if(showSummarySection == true)
        {
            handleList(2,'LIST','divFlowSummaryHeading','sgnLst');
        }
    }

	// internal function to freeze - align the rows of title divs
	function align2TableRows(table1, table2)
	{
		var objtbl1 = getElemnt(table1);
		var objtbl2 = getElemnt(table2);

		if (objtbl1 && objtbl2)
		{

			var tabHt = (objtbl1.offsetHeight>objtbl2.offsetHeight)?objtbl1.offsetHeight:objtbl2.offsetHeight;

			setHeight(objtbl1,tabHt);
			setHeight(objtbl2,tabHt);

			var rCount = objtbl1.rows.length;
			var i=0;

			while(i < rCount)
			{
				var trobj1 = objtbl1.getElementsByTagName("tr").item(i).getElementsByTagName("td").item(0);
				var trobj2 = objtbl2.getElementsByTagName("tr").item(i).getElementsByTagName("td").item(0);
				alignHeight(trobj1, trobj2);
				i++;
			}
		}
	}



	function flipData(id,rem, titleId)
	{
		try
		{
			divId = parseInt(id) + 1;
			divId = (divId>nNoOfDataDivs)?nNoOfDataDivs:divId;

			//alert("divId " + divId);

            for(var i=2;i<=(nNoOfDataDivs);i++)
            {
                //alert(" hide DATA_DIV" +i);
                hide('DATA_DIV' +i);
            }

			for(i=2;i<=(maxTitleDiv);i++)
            {
                //alert(" hide TITLE_DIV" +i);
                hide('TITLE_DIV' +i);
            }

			//alert('titleId ' + titleId + ' \n divId ' + divId);

			colfreeze("TITLE_DIV" + titleId, "DATA_DIV"+divId, "TITLE_TABLE"+titleId, "DATA_TABLE"+divId, true);


			show('DATA_DIV'+divId);
			show('TITLE_DIV'+titleId);

			alignTablesHeight('DATA_TABLE1','DATA_TABLE'+divId);
			align2TableRows('TITLE_TABLE1','TITLE_TABLE'+ titleId);

			setFlowNumber('DATA_DIV'+divId,'TITLE_DIV'+titleId,rem);
			handleHeaderDiv(titleId);

            displayFlowDiv();
		}
		catch(e)
		{
			//alert(e.description);
		}
	}

	function toggleChildContainer(nCase,divName,objName)
	{
		var arrChd;
        var objSum;
        objSum = getElemnt('hdnSummarySectionStatus');
        //if(objSum)objSum.value="-1";

		switch(divName)
		{
			case 'LIST':
			{
				arrChd = new Array('divFlowList');
			}
            case 'FLTR_OPEN':
            {
                var objpd = getElemnt('pglvl1');
                var objHd = getElemnt('HEADER_DIV1');
                var obj =  getElemnt('FLTR_OPEN');

                if((objpd) && (objHd) && (obj))
                {
                    var nwTop = parseInt(objpd.offsetTop) + parseInt(objHd.offsetTop)-30;
                    var nwLeft = 5;
                    // - parseInt(obj.offsetHeight);
                    setTop(obj, nwTop);
                    setLeft(obj, nwLeft);
                }
            }
        }
		if((arrChd)&&(arrChd.length>0))
		{

			for(var i=0;i<(arrChd.length);i++)
            {
				if(nCase==2)
				{
					showDisplay(arrChd[i]);
                    if(objSum)objSum.value = "1";
				}
				else
				{
					hideDisplay(arrChd[i]);
				}
			}

            displayFlowDiv();
		}
            alignDetailDiv();
	}

	function alignDetailDiv()
	{
		var objhd1 = getElemnt('HEADER_DIV1');
		var objhd2 = getElemnt('HEADER_DIV2');

		var objht2 = getElemnt('HEADER_TABLE2');

		var objtd1 = getElemnt('TITLE_DIV1');
		var objtd2 = getElemnt('TITLE_DIV2');

		var objdd1 = getElemnt('DATA_DIV1');
		var objdd2 = getElemnt('DATA_DIV2');
		var objpd = getElemnt('pglvl1');

		if(objpd && objhd1 && objhd2 && objtd1 && objtd2 && objdd1 && objdd2 && objht2)
		{
			var parentTop = parseInt(objpd.offsetTop);
			var lft1 =parseInt(objhd1.offsetLeft);
			var lft2 = parseInt(4 + objhd1.offsetWidth)

			setLeft(objhd2,lft2);
			setTop(objhd2,parseInt(parentTop + objhd1.offsetTop));

			parentTop = 3+ parentTop + objhd1.offsetHeight;

			setLeft(objtd1,lft1);
			setTop(objtd1,parseInt(parentTop));

			setLeft(objtd2,lft2);
			setTop(objtd2,parseInt(parentTop));

			parentTop = parentTop + objtd1.offsetHeight;

			setLeft(objdd1,lft1);
			setTop(objdd1,parseInt(parentTop));

			setLeft(objdd2,lft2);
			setTop(objdd2,parseInt(parentTop));

			//to handle the data div verticle scroll bar alignment
			if(objdd2.scrollHeight>objdd2.offsetHeight)
			{
			    var nwWdth = parseInt(objdd2.offsetWidth-nScrlbar)+ nExtra/2;
                setWidth(objhd2, nwWdth);
                setWidth(objtd2, nwWdth);
                //-1 to see the blue border
                setWidth(objht2, nwWdth-1);
			}
		}

		var objLock = getElemnt('LOCK');
		var objTbot = getElemnt('TSSBOT');
		if(objLock && objTbot)
		{
		    try
            {
                adjustCopyRight(false);
            }
            catch(e){}

			var nHgt = parseInt(objTbot.offsetTop-105);
			if ( bMsgExists )
			{
			    var objMsg = getElemnt('TSSMSG');
			    if(objMsg)
			    {
			       nHgt= nHgt - parseInt(objMsg.offsetHeight);
			    }
			}
			if(nHgt>0)
			{
				setHeight(objLock,nHgt);
				setTop(objLock, parseInt(objTbot.offsetTop-nHgt));
			}
		}
	}

    function flipFlowSummary(disDivName,hideDivName)
    {
        //alert("flipFlowSummary");

        var objActDiv = getElemnt(disDivName);
        var objHidDiv = getElemnt(hideDivName);
        var objFlLstDiv =  getElemnt('divFlowList');

        if(objActDiv && objHidDiv && objFlLstDiv)
        {
            setTop(objActDiv, parseInt(objFlLstDiv.offsetTop));
            hideDisplayObj(objHidDiv);
            showDisplayObj(objActDiv);
            //alert(" Active " + objActDiv.id + ".style.display " + objActDiv.style.display);
            //alert("Hidden " + objHidDiv.id + ".style.display " + objHidDiv.style.display);
            displayFlowDiv();
        }
    }

    function displayFlowDiv()
    {
		  var obj = getElemnt('hdnSummaryDisplaySection');
          var dispDiv;

          var objFlLstDiv =  getElemnt('divFlowList');

          if(obj)
          {
            var disDivName = obj.value;
            if((disDivName!=null) && (disDivName.toString().length>0))
            {
				dispDiv =getElemnt(disDivName);
			}
          }

          if(curFlowDiv)
          {
            hideDisplayObj(curFlowDiv);
          }

          if(dispDiv)
          {
			  if( (nActFlowNum>=-1) && (dispDiv.style.display==''))
          {
            var objFl;
            objF1= getElemnt('aFlow'+ nActFlowNum);

            if(objF1 && (objF1.value != null))
            {
					var divParName = dispDiv.id + objF1.value;
                var obj = getElemnt(divParName);

                if(obj && objFlLstDiv)
                {
                    setTop(obj, parseInt(objFlLstDiv.offsetTop));
                    showDisplayObj(obj);
                    curFlowDiv = obj;
                }
            }
          }
      }
    }

	// internal function to freeze - adjust the tables and idvs after cols have been adjusted
    function adjustOuterDivs(topd, bottomd, toptable)
    {
        topd = getElemnt(topd);
        bottomd = getElemnt(bottomd);
        toptable = getElemnt(toptable);

        var scrTemp = nCurScrWidth;

        nCurScrWidth = nCurScrWidth - expLeft;



        if (topd && bottomd && toptable)
        {
            var nCurTableWidth = toptable.offsetWidth;

           // alert("nCurTableWidth " + nCurTableWidth + "  nCurScrWidth" + nCurScrWidth);
            if (nCurTableWidth < nCurScrWidth)  // table is smaller than the screen
            {
                if ((parseInt(bottomd.scrollHeight) + 1) > bottomd.offsetHeight)  // there is scroll bar
                {
                    if (parseInt(parseInt(nCurTableWidth)+nScrlbar) > nCurScrWidth)  // within the scrollrange
                    {
                        topd.style.width = nCurTableWidth - nScrlbar+"px";
                        bottomd.style.width = nCurTableWidth+"px";
                    }
                    else
                    {
                        topd.style.width = nCurTableWidth+"px";
                        bottomd.style.width = nCurTableWidth + nScrlbar+"px";
                    }
                }
                else if ((parseInt(bottomd.scrollHeight) + 1) < bottomd.offsetHeight)
                {
                    topd.style.width = nCurTableWidth+"px";
                    bottomd.style.width = nCurTableWidth+"px";
                }
                bAdjusttbl = false;
            }
            else           // table streches beyond the screen
            {
                if (bottomd.scrollHeight > bottomd.offsetHeight)         // there is a vertical scroll
                {
                    topd.style.width = nCurScrWidth - nScrlbar - nWithinaTable+"px";
                    bottomd.style.width = nCurScrWidth - nWithinaTable+"px";
                }
                else    // if they is no vertical scroll
                {
                    topd.style.width = nCurScrWidth - nWithinaTable+"px";
                    bottomd.style.width = nCurScrWidth  - nWithinaTable+"px";
                    bottomd.style.height = bottomd.offsetHeight + nScrlbar+"px";

                }
            }
        }
        nCurScrWidth = scrTemp;

    }


    function expandtl()
    {
        var dataObj = getElemnt(expData),
        	titleObj = getElemnt(expTitle),
        	$dataDiv = $(dataObj),
            $dataTable = $dataDiv.children('table');

        if (!dataObj)    // return if the data does not exist for expand
        {
            return;
        }
        var nCurHgt = dataObj.offsetHeight;
        var nCurWth = dataObj.offsetWidth;
        var nCurScrlHgt = dataObj.scrollHeight;
        var nCurScrlWth = dataObj.scrollWidth;

        var topx = 0;

        if (bMenuExists)
        {
            topx+=getElemnt('TSSMENU').offsetHeight;
        }
        if (bIconsExists)
        {
            topx+=getElemnt('TSSICON').offsetHeight;
        }

        var i = 0;
        while (i < nTotalLvl - 1)
        {
            if (getElemnt('pglvl'+i) && getElemnt('pglvl'+i).style.visibility!="hidden")
            {
                topx+=getElemnt('pglvl'+i).offsetHeight
            }
            if (getElemnt('pglvl'+i+'c') && getElemnt('pglvl'+i+'c').style.visibility!="hidden")
            {
                topx+=getElemnt('pglvl'+i+'c').offsetHeight
            }

            i++;
        }

        topx+=titleObj.offsetHeight;

        if (getElemnt('LOCK_TITLE'))    // title in col freeze is a seperate table
        {
            topx+=getElemnt('LOCK_TITLE').offsetHeight;
            setWidth(getElemnt('LOCK_TITLE'), parseInt(td1obj.offsetWidth) + parseInt(td2obj.offsetWidth));
        }

        topx+=18;

        if (bMsgExists)
        {
            topx+=getElemnt('TSSMSG').offsetHeight;
        }

        if (szDependDivs != "")
        {
            nPos = szDependDivs.indexOf(',');
            var tempObj = "";
            var tempszDependDivs = szDependDivs;   // use the temp variable to calc the height of the divs
            while (tempszDependDivs != "")
            {
                if (nPos == -1) // only one div
                {
                    tempObj = getElemnt(tempszDependDivs);
                    if (tempObj && tempObj.style.visibility != 'hidden')  // sometime the visibility is not set
                    {
                        topx+=tempObj.offsetHeight;
                    }
                    tempszDependDivs = "";
                }
                else
                {
                    tempObj = getElemnt(tempszDependDivs.substr(0, nPos));
                    tempszDependDivs = tempszDependDivs.substr(nPos+1, szDependDivs.length);
                    if (tempObj && tempObj.style.visibility != 'hidden')
                    {
                        topx+=tempObj.offsetHeight;
                    }
                }
                nPos = tempszDependDivs.indexOf(',');
            }
        }


        // check if the main div "LOCK" has a horizontal scroll
        var lockdiv= getElemnt("LOCK"),
        	$lockdiv = $(lockdiv);
        if (lockdiv.offsetWidth < lockdiv.scrollWidth)
        {
            topx+=nScrlbar;
        }

        var nLeft = nCurScrHeight - topx - nCurPad - 4;


        if (nLeft - 200 > 0)
        {
            if (nCurScrlWth > nCurWth)
            {
                nCurScrlHgt+=nScrlbar;
            }

            if (nLeft > nCurScrlHgt && (parseInt(nCurScrlHgt) + 1) != dataObj.offsetHeight)  // 1 px for border
            {
            	nLeft = nCurScrlHgt;
            }
            else if (nLeft > nCurScrlHgt)
            {
                nLeft = dataObj.offsetHeight;
            }
            
            /* Tracker#: 18734 - LL DETAILS FLOW SECTION RENDERING IS INCONSISTENT
             * Divs must be readjusted to take into account vertical scrollbar that was not
             * there before adjusting height.
             */
            // Check to see if there was a vertical scrollbar before
            var wasScrollbarPresent = hasScrollbar(dataObj,"vertical");
            
            setHeight(dataObj, nLeft);

            // If there was no vertical scrollbar, and now there is,
            // need to adjust div to accomodate the scrollbar.
            var isScrollbarPresent = hasScrollbar(dataObj,"vertical");
            if (!wasScrollbarPresent && isScrollbarPresent)
            {
	            // Check to see if adding scrollbar causes the table to go beyond the
            	// browser viewport.
	            if ( $dataDiv.offset().left + $dataDiv.outerWidth() >= $lockdiv.width() )
	            {
	            	var $titleDiv = $('#TITLE_DIV2');
	            	$titleDiv.width($titleDiv.width() - nScrlbar);
	            }
	            else // Can add scrollbar without going outside browser viewport.
	            {
	            	$dataDiv.width($dataTable.outerWidth() + nScrlbar);
	            }
            }
        }


        var nWidth = dataObj.offsetWidth;
        // check to see if there was a scroll and now there is none then adjust the width
        if (nCurScrlHgt > nCurHgt)
        {
            var newScrlHgt = dataObj.scrollHeight;
            var newHgt = dataObj.offsetHeight;
            // make it equal to the title div if there is no vertical scrolling
            //if (newScrlHgt <= nLeft)
            if (newScrlHgt == newHgt || (nCurScrlWth > nCurWth && (newScrlHgt + nScrlbar == newHgt)))
            {
                setWidth(dataObj, parseInt(nWidth - nScrlbar));
            }
        }

        /* Tracker#: 18734 - LL DETAILS FLOW SECTION RENDERING IS INCONSISTENT
         * The following code was unnecessarily reducing width of div even though
         * there was plenty of space to the right of the div.
         * Fix: Add check to see if the lock div's scrollbar is covering the data div.
         */
        if (lockdiv.offsetHeight < lockdiv.scrollHeight &&  // if lock has scrolling then reduce the width by scrollbar
        	$dataDiv.offset().left + $dataDiv.outerWidth() > $lockdiv.width() - nScrlbar ) // if lock div scrollbar is covering the div
        {
            setWidth(dataObj, parseInt(nWidth - nScrlbar))
            setWidth(titleObj, parseInt(titleObj.offsetWidth) - nScrlbar)
        }

        lockAdjust();
    }
    
    /* Tracker#: 18734 - LL DETAILS FLOW SECTION RENDERING IS INCONSISTENT
     * Overriding lockAdjust from comfunc to apply changes to fix this issue only
     * for Line List & Visual Customer Order to minimize the impact of this change.
     */
    function lockAdjust()
    {
        if (dd2obj)
        {
            // reduce the size of data div 1 if there is horizontal scrolling
            /*
        	 * Tracker#: 18734 - LL DETAILS FLOW SECTION RENDERING IS INCONSISTENT
        	 * Can still have scrollbar even though scrollWidth < offsetWidth.
        	 * Fix: new function  hasScrollbar that has an added second check to deal with false negatives:
        	 * Compare width property that excludes scrollbar (clientHeight) with one
        	 * that includes scrollbar ($().innerHeight).
        	 */
        	if (hasScrollbar(dd2obj,"horizontal"))
            {
                setHeight(dd1obj, parseInt(dd2obj.offsetHeight) - nScrlbar);
            }
            // Tracker#: 18734 - LL DETAILS FLOW SECTION RENDERING IS INCONSISTENT
    		// Still need to adjust height of data div1 if data div2 does not have horizontal scrollbar.
            // i.e. In Line list, data div1 height goes off screen while data div2 height has been adjusted to
            // fit screen.
            else
            {
            	setHeight(dd1obj, dd2obj.offsetHeight);
            }

            // check for titles height being off
            if (tt1obj.offsetHeight > tt2obj.offsetHeight)
            {
                setHeight(tt2obj, parseInt(tt1obj.offsetHeight));
                setTop(td2obj, parseInt(td1obj.offsetTop));
            }
            else if (td1obj.offsetHeight < td2obj.offsetHeight)
            {
                setHeight(tt1obj, parseInt(tt2obj.offsetHeight));
                setTop(td2obj, parseInt(td1obj.offsetTop));
                setTop(dd2obj, parseInt(dd1obj.offsetTop));
            }

            // sometime the top div changes height so realign
            setTop(td2obj, parseInt(td1obj.offsetTop));
            setTop(dd1obj, parseInt(td1obj.offsetTop) + parseInt(td1obj.offsetHeight));
            setTop(dd2obj, parseInt(td1obj.offsetTop) + parseInt(td1obj.offsetHeight));

            // reduce the size of data div 1 if there is horizontal scrolling
            if (dd2obj.scrollWidth > dd2obj.offsetWidth)
            {
                setHeight(dd1obj, parseInt(dd2obj.offsetHeight) - nScrlbar);
            }
        }
    }
    
	// onchange function for a text field
	function cftLocal(obj)
	{
		if (obj.type != 'select-one')
			u(obj);
		cfLocal(obj);
	}

	function cfLocal(obj)
	{
		if (obj.type == 'text' && !specialCase)
		{
			if (obj.value.indexOf('"') != -1)
			{
				alert(szMsg_Double_Quote);   // double quote not allowed
				obj.value = "";
				return;
			}
			//var hdnFieldObj = getElemnt("hdn" + obj.name);
			//hdnFieldObj.value = obj.value;
		}
		cfbynameLocal(obj.name);
		specialCase = false;
	}

	//add the name of the given field to the changed fields value
	function cfbynameLocal(fldname)
	{
		var chgHolder = getval('chgfldsLocal');
		if (chgHolder.indexOf(fldname + ',') == -1) // if it doesn’t exist
					chgHolder = chgHolder.concat(fldname,',');
		// changed the changed fields values
		//alert("fldname " +fldname);
		setval('chgfldsLocal', chgHolder);
	}



	// check the checkbox of current seleted row.
	function sr(row, secid, ele)
	{
		currentRow = row;
        selectedElement = ele;

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
						clrTableRow(row);
					}
				}
			}
			else
			{
				obj.checked = true;
				clrTableRow(0);

			}
		}
		nCurRow = row;
	}

	function checkCurrentRow(row)
	{
		var obj = getobj('R');

		if (obj)
		{
			if ((typeof obj.length) != 'undefined') // array
			{
				for (var k=0; k < obj.length; k++)
				{
					var curCheckBox = obj[k];

					if (curCheckBox.value == row)
					{
						curCheckBox.checked = true;
						clrTableRow(row);
						break;
					}

				}
			}
			else
			{
				obj.checked = true;
				clrTableRow(row);
			}
		 }
	}

	function lsr(row, b)
	{
		nCurRow = row;
		// do not highlight any row
	}

	function preSubmit(act)
	{
		if (act == 'addcolor' || act == 'addflow')
		{
			bCheck4Changes = false;
		}
		return true;
	}

	function setValueNull(objName, defaultValue)
	{
		var obj = getElemnt(objName)
		if(obj)
		{
			if(defaultValue)
			{
				obj.value = defaultValue;
			}
			else
			{
			   obj.value = '';
			}
		}
	}

	function prevNextSubmit(act)
    {
        //Reset all the hidden variables as we are moving to a new Ref_No details.
        resetContextValue();
        fsubmit(act);
    }

    function removeSellChannelFilter(summaryName)
    {
        resetCurrentPageRecordNumber();
        var objSummaryClicked = getElemnt("hdnSummaryClicked");
        objSummaryClicked.value = "";
        resetSCClassInfo();
        var objSellSCCSummaryRowId = getElemnt('hdnSCCSummaryRowId');
        objSellSCCSummaryRowId.value="0";

        if(FRM)
        {
            var objFrm;
            eval("objFrm = document."+FRM);
            if(objFrm)
            {
                resetObjValue("chgfldsLocal");
                waitWindow();
                objFrm.submit();
            }
        }
    }

    function ss(act)     // search button action on search screens
    {
        if (bDisableMenu)
        {
            return;
        }

        // check for changes
        if (bCheck4Changes)
        {
            act = hasChanged(act)
        }

        setval('method', act);
        waitWindow();
        disableLinks();
    }

