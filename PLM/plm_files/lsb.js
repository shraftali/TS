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


var nTotalHidden = 0;

var szLastOpenedDiv = '';
var szLastClickedDiv = '';
nMenuWidth = 166;
var nDashMenuHeight = 25;
var szLastDivInMenu = "";
var nStart = 0;

function omover(id)
{
    var div=getElemnt(id);
    div.className=div.className + 'Over';	

}

function omout(id)
{
    var div=getElemnt(id);
    var clsName = div.className;
    div.className=clsName.substring(0, clsName.length-4);	
}




function createAppendDiv(id, txt, cls, vis, tp, url)
{
    var div=document.createElement("DIV");
    div.className=cls;
    div.id=id;

    div.onmouseover=function(){omover(id)};
    div.onmouseout=function(){omout(id)};


    div.style.visibility=vis;
    div.style.top=tp+"px";
    div.style.left=0+"px";
    div.style.width=nMenuWidth+"px";
    div.style.fontFamily='tahoma, arial, helvetica';
    div.style.fontWeight='bold';
    div.style.color='#0B4D9B';
    div.style.paddingTop="5px";
    div.style.paddingLeft="2px";


    if (url != '' && url==id)
    {
        div.onclick=function(){dash(url)};
	    //txt;
        div.className=cls + 'Plus';
    }
    else if (url.indexOf("javascript:") == 0)
    {
        div.onclick=function(){eval(url.substring(11))};
    }
    else
    {
        div.onclick=function(){waitWindow();location.href=url};
    }
    div.innerHTML=txt;
    getElemnt('lsb').appendChild(div);
    szLastDivInMenu = id;

}



function dash(id)
{
    var LSB = getElemnt('lsb');
    var nCurLSBWidth = LSB.offsetWidth;
	//szLastOpenedDiv = id;
    szLastClickedDiv = id;
    nTotalHidden = 0;

    var sParent = getElemnt(szLastClickedDiv);
    var clsName = sParent.className;

	if (clsName.indexOf('Clck') < 0)
	{
		sParent.className = clsName.substring(0, clsName.length-4) + 'ClckOver';	
	}
	else 
	{
		sParent.className = clsName.substring(0, clsName.length-8) + 'Over';			
	}


	var oChildDiv = "";
	var szChildDivID = "";
	var i=1;
	var nPixel = 0;

	var nTop = parseInt(sParent.style.top) + parseInt(sParent.offsetHeight);

	szChildDivID = szLastClickedDiv + "_" + i;
	var bAdd = true;

	oChildDiv = getElemnt(szChildDivID);
    while (oChildDiv)
	{
	    if (oChildDiv.style.visibility == 'inherit')
	    {
            var clsName = oChildDiv.className;
            var idx = clsName.indexOf('Clck');
            if (idx >= 0)
	        {
                oChildDiv.className = clsName.substring(0, idx) + clsName.substring(idx+4, clsName.length);
            }
	        hideObj(oChildDiv);
	        setTop(oChildDiv , 0);  // so they are not creating any empty space at the bottom
	        nTotalHidden = nTotalHidden + parseInt(oChildDiv.offsetHeight);
	        // take care of children
            hideChildren(szChildDivID);
            bAdd = false;
	    }
	    else
	    {
    	    oChildDiv.style.top = nTop+"px";
	        //showObj(oChildDiv);
            oChildDiv.style.visibility = 'inherit'
	        setZValue(oChildDiv, cur_z++);
	        nPixel = nPixel + parseInt(oChildDiv.offsetHeight);
	        nTop = nTop + parseInt(oChildDiv.offsetHeight);
	    }
	    i++;
	    szChildDivID = szLastClickedDiv + "_" + i;
	    oChildDiv = getElemnt(szChildDivID);
	}

	//adjust others - main as well as siblings
	adjustOthers(szLastClickedDiv, nPixel, bAdd);

	var oLOCK = getElemnt("LOCK");
	//alert(getElemnt(szLastDivInMenu).offsetTop + ' - ' + LSB.scrollHeight + ' > ' + LSB.offsetHeight + ' && ' +  LSB.offsetWidth + ' == '+ nMenuWidth);
	if (LSB.scrollHeight > LSB.offsetHeight && LSB.offsetWidth == nMenuWidth)  // there is scroll bar
    {
        setWidth(LSB, LSB.offsetWidth + nScrlbar);
        setLeft(oLOCK, oLOCK.offsetLeft + nScrlbar);
        setWidth(oLOCK, oLOCK.offsetWidth - nScrlbar);
    }
    else if (LSB.offsetHeight >= LSB.scrollHeight && LSB.offsetWidth > nMenuWidth)  // there is no scroll bar)
    {
        setWidth(LSB, nMenuWidth);
        setLeft(oLOCK, oLOCK.offsetLeft - nScrlbar);
        setWidth(oLOCK, oLOCK.offsetWidth + nScrlbar);
    }
}

function adjustOthers(id, nMoveTopBy, bAdd)
{

   // alert(id, nMoveTopBy, bAdd);
    var nFrom = "";  // ie 2 when we have L_1_2
    var szId = "";   // ie L_1 when L_1_2

    var idx = id.lastIndexOf('_');

    if (idx > 1)
    {
        nFrom = id.substring(idx+1);
        szId = id.substring(0, idx);
      //  alert(szId + "A " + nMoveTopBy + " A" + nFrom);
        moveDivs(nFrom, szId, nMoveTopBy, bAdd);
        adjustOthers(szId, nMoveTopBy, bAdd);
    }
    else  // top level
    {
        nFrom = id.substring(2);
        szId = id.substring(0, 1);
        moveDivs(nFrom, szId, nMoveTopBy, bAdd);
    }


}

function moveDivs(nFrom, szId, nMoveTopBy, bAdd)
{
    nFrom++;
    //alert(szId + "_" + nFrom);
    while(getElemnt(szId + "_" + nFrom))
    {
        //alert('md');
        if (bAdd)
        {
            getElemnt(szId + "_" + nFrom).style.top = parseInt(getElemnt(szId + "_" + nFrom).style.top) + parseInt(nMoveTopBy) + "px";
        }
        else
        {
            getElemnt(szId + "_" + nFrom).style.top = parseInt(getElemnt(szId + "_" + nFrom).style.top) - parseInt(nTotalHidden) + "px";
        }

        if (getElemnt(szId + "_" + nFrom + "_1"))
        {
            if (getElemnt(szId + "_" + nFrom + "_1").style.visibility == 'inherit')
            {
                moveDivs(0, szId + "_" + nFrom, nMoveTopBy, bAdd)
            }
        }

        nFrom++;
    }
}


function hideChildren(id)
{

    var nCount = 1;
    var toCloseID = id + "_" + nCount;
    var oCloseDiv = getElemnt(toCloseID);
    while (oCloseDiv)
    {
     //   alert('hc');
        if (oCloseDiv.style.visibility == 'inherit')
        {
            // while hidding children switch the clicked to non clicked - to +
            var clsName = oCloseDiv.className;
            var idx = clsName.indexOf('Clck');
            if (idx >= 0)
	        {

                oCloseDiv.className = clsName.substring(0, idx) + clsName.substring(idx+4, clsName.length);
            }
            setTop(oCloseDiv , 0);
            hide(toCloseID);
            nTotalHidden = nTotalHidden + parseInt(oCloseDiv.offsetHeight);
            hideChildren(toCloseID);
        }
        nCount++;
        toCloseID = id + "_" + nCount;
        oCloseDiv = getElemnt(toCloseID);
    }
}

function toggle()
{
    var oLSB = getElemnt('lsb');
    var oLOCK = getElemnt('LOCK');
    var oMSG = getElemnt('TSSMSG');

    oVisible = oLSB.style.visibility;
    if (!oVisible || oVisible == '' || oVisible == 'visible')
    {
        if (bMsgExists)
        {
            setWidth(oMSG, oMSG.offsetWidth + oLSB.offsetWidth);
            setLeft(oMSG, 0);
        }
        setWidth(oLOCK, oLOCK.offsetWidth + oLSB.offsetWidth);
        setLeft(oLOCK, 0);
        hideObj(oLSB);
    }
    else
    {
        showObj(oLSB);
        if (bMsgExists)
        {
            setWidth(oMSG, oMSG.offsetWidth - oLSB.offsetWidth);
            setLeft(oMSG, oLSB.offsetWidth);
        }
        setWidth(oLOCK, oLOCK.offsetWidth - oLSB.offsetWidth);
        setLeft(oLOCK, oLSB.offsetWidth);
    }
}

