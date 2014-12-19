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

function openRFQ(curitmno)
{
    if(curitmno)
    {
        var actionMethod = "qsearch";
        var objH = document.createElement("input");
        var objH1 = document.createElement("input");
        if(objH)
        {
            objH.setAttribute('type','hidden');
            objH.setAttribute('name','itmno');
            objH.setAttribute('id','itmno');
            objH.setAttribute('value',curitmno);
        }
        if(objH1)
        {
            //Tracker#:15364 MAX\\ IN-00002407284: PROBLEM LINELIST SHIP PACK
            //set the current row no, so that based on row no get the request no
            objH1.setAttribute('type','hidden');
            objH1.setAttribute('name','curRow');
            objH1.setAttribute('id','curRow');
            objH1.setAttribute('value',nCurRow);
        }
        if(FRM)
        {
            var objFrm;
            eval("objFrm = document."+FRM);

            if(objFrm)
            {
                objFrm.appendChild(objH);
                objFrm.appendChild(objH1);
            }
            submitFrm(actionMethod);
        }
    }
}

//Tracker#18257
//To Navigate from LineList screen to TechSpec screen.
//since 2011r2
function _openTechSpecFromLineList()
{
     var url = "opentechspec";
     //appends request_no and item_no to url.
     url+= _getRequestItemNo(); 
     // alert(url);    
     var objAjax = new htmlAjax();
     if(objAjax)
		{
        	objAjax.setActionURL("linelist.do");
            objAjax.setActionMethod(url);
            objAjax.setProcessHandler(_gotoPLM, objAjax);
            objAjax.sendRequest();
         }       
}



//Tracker#18257
//To Navigate fron LineList screen to TechSpec screen.
//since 2011r2
function _gotoPLM(objAjax)
{
	var owner = objAjax.getResponseHeader("_owner");
	var request_no = objAjax.getResponseHeader("_request_no");
	_gotoTechSpecFromShortCut(owner,request_no);
	return;
}


function toggleSearchField(bShow)
{
    if(bShow == false)
    {
        handleList(6,null,'FLTR_OPEN','sgndt');
    }
    else
    {
        handleList(2,'FLTR_OPEN',null,'sgndt');
    }
}

    // opens up a new window
    function oW(wname,url,nWidth,nHeight)
    {
        var nWindow = window.open(url, wname,'width=' + nWidth + ',height=' + nHeight + ',toolbar=no,menubar=no,scrollbars=no,resizable=yes')
        //return nWindow;
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

        var objtd1 = getElemnt('TITLE_DIV1');
        var percent = .7;

        if(objtd1)
        {
            var tlt1Width = parseInt(objtd1.offsetWidth);

            if(nCurScrWidth && ( (blnFlag==true) ||(tlt1Width > (nCurScrWidth*percent))) )
            {
               //alert("nCurScrWidth " +nCurScrWidth*percent);
               setWidth(objtd1, parseInt(nCurScrWidth*percent));
            }
        }
     }

	function initDiv()
	{
	    //alert("initDiv");
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

    function alignSummaryDivs(performStaticDivAlign)
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
            
            //Tracker#:22355
            //do not change the width of default summary sections when one of the alternate section is enabled
            if(performStaticDivAlign!=false)
        	{
            	for(k=0;k<(arrSummaryStaticDivnames.length);k++)
            	{
            		invokeColFreeze(arrSummaryStaticDivnames[k]);
            	}
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


	function approve()
    {

        var isConfirmed = window.confirm(pmConfirm);

        if(isConfirmed == true)
        {

            var process = false;
            eval("var objChk = " + FRM + ".R");

            if(objChk)
            {
                //some records are there to process
                process=true;
            }

            if(process == true)
            {
                fsubmit('approvepmrequest');
            }
            else
            {
                alert (pmNoData);
            }
       }
    }

    /*function window.onunload()
    {
        if(masterViewWindow)
        {
            masterViewWindow.close();
        }
    }

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
        var url =objFrm.action + "?method=masteritem";
        masterViewWindow = oW('masterview',url,'900','600');
    }

    //New window is displayed for the 'EDIT RFQ Fields' functionality
    //Added this function as part of tracker 12155
     function showEditWin()
    {
        var objFrm;
        eval("objFrm = document."+FRM);
        //add url to view Edit RFQ window, where RFQ header fields are edited from the linelist screen
        var url =objFrm.action + "?method=massRFQ";
        editRFQWindow = oW('massrfq',url,'900','600');
    }

	//todo: when we provide link for item number, call this method and submit the page
    function showRequest(obj)
    {
        //alert("obj "+ obj);
    }

	function highLightSubTTLSummary(performDeselect)
    {
        var obj = getElemnt("hdnSCCSummaryRowId");
        if(obj.value == "" || parseInt(obj.value) == -1 )
        {
            obj.value = 0;
        }

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
               var tableName = arrSummaryStaticTableNames[j];
               //alert("objHdn \ n "  + objHdn.outerHTML);
               var rowId = getSelectedRowId(objHdn, tableName, j);

               //alert("rowId " + rowId + "\n objHdn "  +objHdn.outerHTML);
               // Display the All row as default
               //if(rowId < 1) rowId = 1;
               //if(rowId>0)clrTableRow(rowId,tableName);
              if(typeof(performDeselect) != "undefined")
              {
                unclrTableRow(rowId, tableName);
              }
              else
              {
                clrTableRow(rowId,tableName);
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

        if(typeof(tableName)!="undefined")	// for custom tables
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
        //alert("arrIndex " + arrIndex);
        //apply only for flow summary
        if(arrIndex==0)
        {
            //alert(" condition rowId " + rowId);
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
            alert (contactAdmiin);
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
        //alert("here " + doSubmit);
        var flwName =  displaySummary(divId);

        //alert("flwName " + flwName);

        if(flwName && flwName.toString().length>0)
        {
            //alert("inside");
            var objFlName = getElemnt('hdnCurrentFlowname');
            if(objFlName)objFlName.value = flwName;
        }
        else
        {
            //resets the detail page record.
            //resetCurrentPageRecordNumber();

            if(doSubmit!=0)
            {
                resetCurrentPageRecordNumber();
                resetSCClassInfo();
                updateValue('hdnSummaryClicked','FLOWS');
                //alert("updated");
                var objName = "hdnCurrentFlowid";
                nActFlowNum = flowIndex;

                hightSummaryLiteRow(true);
                highLightSubTTLSummary(true);

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

           if(typeof(nNoOfFlowDisplay)=='undefined')
           {
                nNoOfFlowDisplay =1;
           }
           //alert("before flowIndex \n"+ flowIndex);
           flowIndex = (flowIndex<-1)?-1:flowIndex;
           flowIndex = (flowIndex>=totalNoOfFlows)?(totalNoOfFlows-1):flowIndex;

           //alert("after flowIndex \n"+ flowIndex);

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
            eval("objFrm= document."+FRM);
            if(objFrm)
            {
                resetObjValue("chgfldsLocal");
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
           if(typeof(nNoOfFlowDisplay)=='undefined')
           {
                nNoOfFlowDisplay =1;
           }
           num = parseFloat(obj.value) + (num * nNoOfFlowDisplay);
           resetSCClassInfo();
           resetCurrentPageRecordNumber();
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
                    var nwLeft = 100;
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
				else    // if there is no vertical scroll
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
        	$dataDivOffset = $dataDiv.offset(),
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
	            if ( $dataDivOffset.left + $dataDiv.outerWidth() >= $lockdiv.width() )
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
        	$dataDivOffset.left + $dataDiv.outerWidth() > $lockdiv.width() - nScrlbar ) // if lock div scrollbar is covering the div
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

    function cf(obj)
    {
        if (obj.type == 'text' && !specialCase)
        {
            if (obj.value.indexOf('"') != -1)
            {
                alert(szMsg_Double_Quote);   // double quote not allowed
                obj.value = "";
                return;
            }
        }

        // If Called from the Add Flow -> Add button then don't update the chgflds as this is not required.
        if( (typeof(addFlowsCalled)!='undefined') && (addFlowsCalled==true) )
        {
            cfforaddflow(obj.name);
        }
        // If Called from the Copy In DC -> Copy button then don't update the chgflds as this is not required.
        else if( (typeof(copyFlowsCalled)!='undefined') && (copyFlowsCalled==true) )
        {
            cfforcopyflow(obj.name);
        }
        //If the copy to field is updated with the sell channels and close the pop up without clicking add. then do not update the changed fields.
        //Tracker 14077
        else if( (typeof(copysellchannel)!='undefined') && (copysellchannel==true) )
        {
            cfforcopyflow(obj.name);
        }
        // If Called from the Replace Size Association -> Replace button then don't update the chgflds as this is not required.
        else if ((typeof(replaceSizeCalled)!='undefined') && (replaceSizeCalled==true) )
        {
            cfforreplacesize(obj.name);
        }
        else
        {
            cfbyname(obj.name);
        }
        specialCase = false;
    }

    function closeMsg()
    {
        addFlowsCalled = false;
        copyFlowsCalled = false;
        copysellchannel=false;
        revertChngFlds();
        var waitW = getElemnt("showMsg");
        if (waitW)
        {
            eval('document.'+FRM+'.removeChild(waitW)');
        }
    }

    function lsr(row, b)
    {
        nCurRow = row;
        // do not highlight any row
    }

    function preSubmit(act)
    {
        if (act == 'addcolor' || act == 'addflow' || act == 'addshippack')
        {
            bCheck4Changes = false;
        }
        return true;
    }

	function cfforaddflow(fldname)
    {
        var chgHolder = getval('chgfldsFlow');
        if (chgHolder.indexOf(fldname + ',') == -1) // if it doesn’t exist
                    chgHolder = chgHolder.concat(fldname,',');
        // changed the changed fields values
        setval('chgfldsFlow', chgHolder);
    }

    function addsubmit(action)
    {
        addFlowsCalled = false;
        submitFrm(action);
    }

	// We have two sets of check boxes as of now one displayed on the Line List Detail and on the Del Flow so calling
    // handleDelFlow to Check and UnCheck the Del Flow's set of check boxes.
    function handleDelFlow(obj, row)
    {
        if (obj.checked == true)
        {
            nCurRow = row;
            clrTableRowFlow(row);
        }
        else if (!isSelected('R'))
        {
            nCurRow = -1;
            unclrTableRowFlow(row);
        }
        else
        {
            unclrTableRowFlow(row);
        }
    }

	function clrTableRowFlow(row,tableName)
	{
		row = parseInt(row);
		var tName = "delFlowDiv"; // table id for non detail scroll table
		var tobj = getElemnt(tName);

		if (tobj)      // non title freeze
		{
			tr_len = tobj.getElementsByTagName("tr").length
			row = getCalcRow (row, tr_len);
			var trobj = tobj.getElementsByTagName("tr").item(row);

			if (trobj)
			{
				trobj.style.background = szClrdRow;
			}
		}
	}

	function unclrTableRowFlow(row,tableName)
	{
		row = parseInt(row);
		var tName = "delFlowDiv"; // table id for non detail scroll table
		var tobj = getElemnt(tName);

		if(tobj)
		{
			tr_len = tobj.getElementsByTagName("tr").length
			row = getCalcRow (row, tr_len);
			obj = tobj.getElementsByTagName("tr").item(row);
			obj.style.background = szUnClrdRow;
		}

	}

var msgOpen = false;
function getShippackMsg()
{
    var url = 'linelist.do?method=getshippackmsg';

    req = createXMLHttpRequest()

    if (req)
    {
        req.open("GET", url, true);
        req.onreadystatechange = jax_back;
        req.send(null);
    }
    closeMsg();
    show('preprint');
}

function jax_back()
{
    if (req.readyState == 4)
    {
        if (req.status == 200)
        {
           // Invoke SessionManagement.resetSessionTime() to reset session counter.
           SessionManagement.resetSessionTime();
        	
           hide('preprint');
           var msg = req.getResponseHeader("msg");

           if (msg != '')
           {
                showMsg2(msg, true);
           }
        }
    }
}

var ireg=null;
function getShipPackInfo()
{
    var url = 'linelist.do?method=shippackinfo'

    /*if (window.XMLHttpRequest)
    {
        alert("1");
        ireq = new XMLHttpRequest();
    }
    else if (window.ActiveXObject)
    {
        alert("2");
        ireq = new ActiveXObject("Microsoft.XMLHTTP");
    } */

    ireq = createXMLHttpRequest();

    if (ireq)
    {
        ireq.open("GET", url, true);
        ireq.onreadystatechange = showShipPackinfo;
        ireq.send(null);
    }
}

function showShipPackinfo()
{
    if (ireq.readyState == 4)
    {
        if (ireq.status == 200)
        {
           // Invoke SessionManagement.resetSessionTime() to reset session counter.
           SessionManagement.resetSessionTime();
        	
           hide('preprint');
           var msg = ireq.responseText;
           if (msg != '')
           {
                showMsg2(msg, true);
            }
            ireq=null;
        }
    }
}


function removeSellChannelFilter(summaryName)
{
    resetCurrentPageRecordNumber();
    resetSCClassInfo();
    var objSellSCCSummaryRowId = getElemnt('hdnSCCSummaryRowId');
    var objSummaryClicked = getElemnt("hdnSummaryClicked");
    objSellSCCSummaryRowId.value="0";
    objSummaryClicked.value = "";

    if(!isFloatingSummary(summaryName))
    {
        var objSellChannel = getElemnt('hdnCurrentSellChannel');
        var objSellChannelRowId = getElemnt('hdnCurrentSellChannelRowId');
        objSellChannel.value = "";
        objSellChannelRowId.value = "0";
    }

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

var delShipPacksReq = null;

function delShipPacks(act, checkBoxControl)
{
    if(!isSelected(checkBoxControl))
    {
        if(selectShipPack == "") selectShipPack = "Please select atleast one Ship pack.";
        alert(selectShipPack);
        return false;
    }

    var msg = "Are you sure you want to delete the selected Ship Pack(s)?"

    if(confirmDelete(msg))
    {
        // We trigger repetative ajax calls to hit the server every minute so that the session
        // does not get timed out if many quotes are getting updated.
        // setTimeout('triggerAjaxSubmit()', 15000);
        var url = 'linelist.do?method=sizequantitycheck'

        delShipPacksReq = createXMLHttpRequest();

        if (delShipPacksReq)
        {
            delShipPacksReq.open("POST", url, true);
            delShipPacksReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            delShipPacksReq.setRequestHeader('url', url);
            delShipPacksReq.onreadystatechange = jax_returnDelShipPacks;
            // Need to send all the Form information to the Server side.So get all the form objects and their values as data.
            // This can be read from the request.getParameter.
            var reqData = formData2QueryString(document.forms[0]);
            // closeMsg();
            // show('preprint');
            waitWindow();
            delShipPacksReq.send(reqData);
        }
    }
}

     function jax_returnDelShipPacks()
     {
         if (delShipPacksReq.readyState == 4)
         {
             if (delShipPacksReq.status == 200)
             {
                 // hide('preprint');

            	// Invoke SessionManagement.resetSessionTime() to reset session counter.
             	SessionManagement.resetSessionTime();
             	
                var waitW = getElemnt('proc');
                if (waitW)
                {
                    try
                    {
                        eval('document.body.removeChild(waitW)');
                    }
                    catch(e)
                    {
                    }
                }

                 var msg = delShipPacksReq.responseText;
                 var deleteShipPacks = true;

                 if (msg != '' && msg != 'continuedeleting')
                 {
                     deleteShipPacks = window.confirm(msg);
                 }

                 if(deleteShipPacks)
                 {
                     delShipPacksAfterQuantityCheck();
                 }

                 delShipPacksReq=null;
            }
        }
    }

 var delShipPacksAQCReq;

 function delShipPacksAfterQuantityCheck()
 {
     // We trigger repetative ajax calls to hit the server every minute so that the session
     // does not get timed out if many quotes are getting updated.
     triggerAjaxSubmit();
     // submitActionMethod = "createsizecomplete";
     // This is the action that needs to be called during the page submit once the Create Process is completed.
     submitActionMethod = "deleteshippackscomplete"
     setval('method', 'delshippack');
     delShipPacksAQCReq = createXMLHttpRequest();
     var url = 'linelist.do?method=' + 'delshippack';
     //show('preprint');
     waitWindow();
     delShipPacksAQCReq.open("POST", url, true);
     delShipPacksAQCReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
     delShipPacksAQCReq.setRequestHeader('url', url);

     // Need to send all the Form information to the Server side.So get all the form objects and their values as data.
     // This can be read from the request.getParameter.
     var reqData = formData2QueryString(document.forms[0]);
     delShipPacksAQCReq.onreadystatechange = jax_returnDelShipPacksAQC;
     delShipPacksAQCReq.send(reqData);
 }


function jax_returnDelShipPacksAQC()
{
    if (delShipPacksAQCReq.readyState == 4)
    {
        if (delShipPacksAQCReq.status == 200)
        {
           // Invoke SessionManagement.resetSessionTime() to reset session counter.
           SessionManagement.resetSessionTime();
           
           //hide('preprint');
           var waitW = getElemnt('proc');
           if (waitW)
           {
                try
                {
                    eval('document.body.removeChild(waitW)');
                }
                catch(e)
                {
                }
           }
           fsubmit('deleteshippackscomplete');
        }
    }
}

var delFlowsGetSizeQuantityReq = null;

function jax_delFlows(act)
{
    if(!isSelected('DR'))
    {
        if(selectFlow == "") selectFlow = "Please select atleast one Delivery Flow.";
        alert(selectFlow);
        return false;
    }

    var msg = "Are you sure you want to delete the selected Flow(s)?"

    if(confirmDelete(msg))
    {
         // fsubmit(act);
         var url = 'linelist.do?method=delflowssizequantitycheck'

         delFlowsGetSizeQuantityReq = createXMLHttpRequest();

         if (delFlowsGetSizeQuantityReq)
         {
             delFlowsGetSizeQuantityReq.open("POST", url, true);
             delFlowsGetSizeQuantityReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
             delFlowsGetSizeQuantityReq.setRequestHeader('url', url);
             delFlowsGetSizeQuantityReq.onreadystatechange = jax_returnDelFlowsSizeQuantityCheck;
             // Need to send all the Form information to the Server side.So get all the form objects and their values as data.
             // This can be read from the request.getParameter.
             var reqData = formData2QueryString(document.forms[0]);
             // closeMsg();
             // show('preprint');
             waitWindow();
             delFlowsGetSizeQuantityReq.send(reqData);
         }
    }
}

function jax_returnDelFlowsSizeQuantityCheck()
{
    if (delFlowsGetSizeQuantityReq.readyState == 4)
    {
        if (delFlowsGetSizeQuantityReq.status == 200)
        {
        	// Invoke SessionManagement.resetSessionTime() to reset session counter.
        	SessionManagement.resetSessionTime();
        	
        	// hide('preprint');

            var waitW = getElemnt('proc');
            if (waitW)
            {
                try
                {
                    eval('document.body.removeChild(waitW)');
                }
                catch(e)
                {
                }
            }

            var msg = delFlowsGetSizeQuantityReq.responseText;
            var deleteFlows = true;

            if (msg != '' && msg != 'continuedeleting')
            {
                deleteFlows = window.confirm(msg);
            }

            if(deleteFlows)
            {
                fsubmit('delflow');
            }

            delFlowsGetSizeQuantityReq=null;
        }
       }
   }


var delColorsGetSizeQuantityReq = null;

function jax_delColors(act)
{
    if(!isSelected('delcodes') && !isSelected('delaltdescs1') && !isSelected('delaltdescs2'))
    {
        if(selectColor == "") selectColor = "Please select atleast one Color.";
        alert(selectColor);
        return false;
    }

    var msg = "Are you sure you want to delete the selected Color(s)?"

    if(confirmDelete(msg))
    {
         // fsubmit(act);
         var url = 'linelist.do?method=delcolorssizequantitycheck'

         delColorsGetSizeQuantityReq = createXMLHttpRequest();

         if (delColorsGetSizeQuantityReq)
         {
             delColorsGetSizeQuantityReq.open("POST", url, true);
             delColorsGetSizeQuantityReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
             delColorsGetSizeQuantityReq.setRequestHeader('url', url);
             delColorsGetSizeQuantityReq.onreadystatechange = jax_returnDelColorsSizeQuantityCheck;
             // Need to send all the Form information to the Server side.So get all the form objects and their values as data.
             // This can be read from the request.getParameter.
             var reqData = formData2QueryString(document.forms[0]);
             // closeMsg();
             // show('preprint');
             waitWindow();
             delColorsGetSizeQuantityReq.send(reqData);
         }
     }
 }

 function jax_returnDelColorsSizeQuantityCheck()
 {
     if (delColorsGetSizeQuantityReq.readyState == 4)
     {
         if (delColorsGetSizeQuantityReq.status == 200)
         {
        	 // Invoke SessionManagement.resetSessionTime() to reset session counter.
         	 SessionManagement.resetSessionTime();
         	
        	 // hide('preprint');

             var waitW = getElemnt('proc');
             if (waitW)
             {
                 try
                 {
                     eval('document.body.removeChild(waitW)');
                 }
                 catch(e)
                 {
                 }
             }

             var msg = delColorsGetSizeQuantityReq.responseText;
             var deleteColors = true;

             if (msg != '' && msg != 'continuedeleting')
             {
                 deleteColors = window.confirm(msg);
             }

             if(deleteColors)
             {
                 fsubmit('delcolor');
             }

             delColorsGetSizeQuantityReq=null;
         }
       }
   }

// confirms a delete
function confirmDelete(szMsg)
{
    if (confirm(szMsg))
    {
        return true;
    }
    return false;
}

function approvePMRequest()
{
  approve();
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
    sizePage = oW('sizeRange','sizeoffassoc.do?method=linelistview&actrowindex='+row+'&actrow='+actRow+'&totalRows='+ totalRow+'&rowindex='+row+'&parent_doc_id=11700&parent_level_id=0',700,400);
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

function setOldVal(obj)
{
    nOldVal = obj.value;
}
// select or unselect all checkbox based on current value
function handleAllCopyQty(obj, objname)
{
	if (obj.checked == true)
		selectAllCopyQty(objname)
	else
		unselectAllCopyQty(objname);
}

function selectAllCopyQty(objname)
{
    var obj = getobj(objname);
    if(obj)
    {
        if ((typeof obj.length) == 'undefined')
        {
            obj.checked = true;
            return;
        }

        for(i=0;i< obj.length;i++)
        {
            e=obj[i];
            if (e.type=='checkbox' && !(e.checked) && e.name == objname)
            {
                e.checked=true;
            }
        }
    }
}

function unselectAllCopyQty(objname)
{
    var obj = getobj(objname);
    if(obj)
    {
        if ((typeof obj.length) == 'undefined')
        {
            obj.checked = false;
            return;
        }

        for(i=0;i< obj.length;i++)
        {
            e=obj[i];
            if (e.type=='checkbox' && e.checked && e.name == objname)
            {
                e.checked=false;
            }
        }
    }
}

function cfforcopyflow(fldname)
{
    var chgHolder = getval('chgfldsCopyFlow');
    if (chgHolder.indexOf(fldname + ',') == -1) // if it doesn’t exist
                chgHolder = chgHolder.concat(fldname,',');
    // changed the changed fields values
    setval('chgfldsCopyFlow', chgHolder);
}

function copysubmit(action)
{
    copyFlowsCalled = false;
    copysellchannel=false;
    submitFrm(action);
}

function cfforreplacesize(fldname)
{
    var chgHolder = getval('chgfldsReplaceSize');
    if (chgHolder.indexOf(fldname + ',') == -1) // if it doesn’t exist
                chgHolder = chgHolder.concat(fldname,',');
    // changed the changed fields values
    setval('chgfldsReplaceSize', chgHolder);
}

function replacesizesubmit(action)
{
    replaceSizeCalled = false;
    submitFrm(action);
}

function applyModels()
{
     fsubmit("applymodels");
}
var sizeModelPage;

function viewEditModels()
{
    fsubmit("vieweditmodels");
    // sizeModelPage = oW('sizeModelPage', 'sizemodel.do?method=viewllmodels', 700, 400);
}

var reqGetAlternateSummary;

function jax_getFlowSummary(action)
{
    reqGetAlternateSummary = createXMLHttpRequest();

    if (reqGetAlternateSummary)
    {
        //setval('method', action);
        var url = 'linelist.do?method=' + action;
        reqGetAlternateSummary.open('GET', url, true);
        reqGetAlternateSummary.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        reqGetAlternateSummary.setRequestHeader('url', url);
        // Call back function once the request is completed and the control comes back to the client.
        reqGetAlternateSummary.onreadystatechange = jax_returnGetSummary;
        reqGetAlternateSummary.send();
    }
}

function jax_returnGetSummary()
{
    if (reqGetAlternateSummary.readyState == 4)
    {
        if (reqGetAlternateSummary.status == 200)
        {
           // Invoke SessionManagement.resetSessionTime() to reset session counter.
           SessionManagement.resetSessionTime();
        	
           var msg = reqGetAlternateSummary.responseText;
           var alternateDivName = reqGetAlternateSummary.getResponseHeader("alternateDiv");
           if (msg != '')
           {
                var alternateDivObj = getElemnt (alternateDivName);
                if(alternateDivObj)
                {
                    alternateDivObj.innerHTML = msg;
                }
           }
           alignSummaryDivs(false);
           flipFlowSummaryDet(alternateDivName, true);
           reqGetAlternateSummary=null;
        }
    }
}

function formData2QueryString(docForm)
{
    var submitContent = '';
    var formElem;
    var lastElemName = '';

    for (i = 0; i < docForm.elements.length; i++) {

        formElem = docForm.elements[i];
        switch (formElem.type) {
                // Text fields, hidden form elements
            case 'text':
            case 'hidden':
            case 'password':
            case 'textarea':
            case 'select-one':
                submitContent += formElem.name + '=' + escape(formElem.value) + '&'
                break;

            // Radio buttons
            case 'radio':
                if (formElem.checked) {
                    submitContent += formElem.name + '=' + escape(formElem.value) + '&'
                }
                break;
            // Checkboxes
            case 'checkbox':
            if (formElem.checked) {
                // Continuing multiple, same-name checkboxes
                if (formElem.name == lastElemName) {
                    // Strip of end ampersand if there is one
                    if (submitContent.lastIndexOf('&') == submitContent.length-1) {
                        submitContent = submitContent.substr(0, submitContent.length - 1);
                    }
                    // Append value as comma-delimited string
                    submitContent += ',' + escape(formElem.value);
                }
                else {
                    submitContent += formElem.name + '=' + escape(formElem.value);
                }
                submitContent += '&';
                lastElemName = formElem.name;
            }
            break;
        }
    }
    // Remove trailing separator
    submitContent = submitContent.substr(0, submitContent.length - 1);
    return submitContent;
}

//Tracker#:14078 ABILITY TO ADD COLORS FROM A COLOR PALETTE ON A LINE LIST
//This function is used to display the 'color palette' pop up with the drop down.
function showColorPalette(msg, bClose, fnClose)
{
	var winW = document.body.clientWidth;
	var winH = document.body.clientHeight;
	var waitW = getElemnt('showMsg');
	if (waitW)
	{
	    eval('document.'+FRM+'.removeChild(waitW)');
	}

	if (bClose)
	{
	    msg+='<table width=100%><tr><td><center><a href="#" onClick="'+fnClose+'">' + szMsg_Close + '</a></center></td></tr></table>';
	}

	waitW = new DOMWindow(msg , "showMsg", "10pt", "#006699", "#FFFFFF")

//	document.body.appendChild(waitW);
	eval('document.'+FRM+'.appendChild(waitW)');

    //  get the main data div
    var lockdiv= getElemnt("LOCK");

    // get the div which may be part of the msg being displayed
    var msgInt = getElemnt("showmsginternal");

    // if msg div exists than check its width and height to make sure it won't go beyond the lock dic width and height
    if (msgInt)
    {

        msgInt.style.overflow='auto';

        if (msgInt.offsetWidth + 150 > lockdiv.offsetWidth)
        {
            setWidth(msgInt, (parseInt(lockdiv.offsetWidth) - 150));  // leave 75 pixels on each size of the msg window
        }

        if (msgInt.offsetHeight + 150 > lockdiv.offsetHeight)
        {
            setHeight(msgInt, (parseInt(lockdiv.offsetHeight) - 150)); // leave 75 pixels on each size of the msg window
        }
    }

    waitW.style.top = parseInt(winH/2) - (waitW.offsetHeight/2)+"px";
    waitW.style.left = parseInt(winW/2) - (waitW.offsetWidth/2)+"px";
    setZValue(waitW,++cur_z);

}
