/*************************************/
/*  Copyright  (C)  2002 - 2014      */
/*           by                      */
/*  TradeStone Software, Inc.        */
/*  Gloucester, MA. 01930            */
/*  All Rights Reserved              */
/*  Printed in U.S.A.                */
/*  Confidential, Unpublished        */
/*  Property of                      */
/*  TradeStone Software, Inc.        */
/*************************************/

//window.onresize = function () { setHW(); freeze('T', 'D', 'TITLE_DIV', 'DATA_DIV' , 'TITLE_TABLE', 'DATA_TABLE'); }
var IE = document.all?true:false
var IEVer = (navigator.appName=='Microsoft Internet Explorer')?parseFloat((new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})")).exec(navigator.userAgent)[1]):-1;

if (!IE) document.captureEvents(Event.MOUSEMOVE)
document.onmousemove = mouseMove;
//document.onmousemove = setxy;

var szScale = "";
var szLen = "";
var szMaxlen = "";
var szReqFlds = "";
//szAttachParam is used to pass in additional parameters that needs to be appended to the URL
var szAttachParam = "";
// Valid Date Format
var szCurFmt = "MM/dd/yyyy";
var appendAfterRow = "";

var szMsg_Invalid_Rec       = 'Not a valid record to execute current process.';
var szMsg_Invalid_Dtl_Rec   = 'Please select valid detail record(s) only. You might have selected blank detail record(s), Please unselect and try again.';
var szMsg_Blank_Dtl_Rec     = 'Please select valid detail record(s) only. You might have selected blank detail record(s). Please refresh the screen and try again.';
var szMsg_Invalid_Date      = 'Invalid Date format. Current Format is #szCurFmt#';
var szMsg_NaN               = 'Please enter a numeric value';
var szMsg_Scale_Limit       = 'Decimals cannot exceed #szScale#.';
var szMsg_Invalid_Integer   = 'Enter an integer value only.';
var szMsg_Double_Quote      = 'Double quotes are not allowed in the field.';
var szMsg_Length_limit      = 'Entered text is greater than max length of #szLen#. Reduce the text before proceeding.';
var szMsg_No_change         = 'No changes have been made.';
var szMsg_Changes           = 'There are changes on the screen. Do you want to save changes before current action?';
var szMsg_Sel_Row           = 'Please select a detail row.';
var szMsg_Sel_M_Row         = 'Please select one or more detail rows.'
var szMsg_Sel_A_Row         = 'Please select only one detail row.'
var szMsg_Req_Fld           = 'Must enter values for: #szReqFlds#';
var szMsg_Maxlen_Limit      = 'Text cannot be more than #szMaxlen# in length.';   //szMaxlen will be replaces before alert
var szMsg_Delete_Rec        = 'Are you sure you want to delete the entire record?';
var szMsg_Delete_Dtl        = 'Are you sure you want to delete the selected detail record(s)?';
var szMsg_Processing        = 'Processing...Please&nbsp;Wait';
var szMsg_Close             = 'Close';
var szMsg_Invalid_Number    = 'Invalid Number format. Current Format is ';
var szMsg_Filter_Columns    = 'Please enter a value for ';
var szMsg_Invalid_Assoc     = 'This is an invalid record. Do you want to revert the changes?';
var szInvalidRecordsReverting = 'There are invalid records.  These will be reverted when window closes';
var szMsg_Fill_Down         = 'Please select the field you want to fill down with.';
var szMsg_Fill_Up           = 'Please select the field you want to fill up with.';
//Tracker#:20812 added hdnvariable constant to be used to read the screen savehandler for the plm screens.
var szScreen_SaveHandler    = 'hdnScreenSaveHandler';
//Tracker#:20812 added hdnvariable, used to read whether performsave set true.
var szPerformSave    = 'performSave';
//Tracker#:16784 - message for Fill Down
var szMsg_Fill_Selected 	= 'Please select the field you want to fill with.'; 
//Tracker#:23965 -message for fillselected
var szMsgNoDataToFill = 'Please focus on the field and try again';
var szMsgFillData = 'Please select the field you want to fill data';

//Tracker#24787 - isAdminCall - to identify the request is coming from admin module
var isAdminCall = false;
var externalSubmitURL2 = submitUrl2;

var cur_z = 100;
var nScrlbar = parseInt(21);
var TOP4LOCK = 0;
// Initializing the Invalid association flag to false
var szInvalid = false;
// The doc view id corresponding to the screen. Used in the oLook functions
var szDocViewId = "";
// Contains the field object that the user had last clicked. Used in fillUp and filldown functions.
var selectedElement = "";

var nCurScrHeight = "";
var nCurScrWidth = "";
if (IEVer == 8) {
	nCurScrHeight = document.documentElement.clientHeight;
	nCurScrWidth = document.documentElement.clientWidth;
}
else {
	nCurScrHeight = window.innerHeight;
	nCurScrWidth = window.innerWidth;
}

var enable=true;
var nLockedcols=-1;

// non freeze cols data and titles object
var ddobj;
var dtobj;
var tdobj;
var ttobj;
// freeze cols data and titles object
var dd2obj;
var dd1obj;
var td2obj;
var td1obj;
var dt2obj;
var dt1obj;
var tt2obj;
var tt1obj;
var checkForBodyLevel = false;
var popupDivId = '';
function setHW() // this will be called from window.resize
{
	if (IEVer == 8) {
		nCurScrHeight = document.documentElement.clientHeight;
		nCurScrWidth = document.documentElement.clientWidth;
	}
	else {
		nCurScrHeight = window.innerHeight;
		nCurScrWidth = window.innerWidth;
	}
}

var szSAVE = 'save';
var szNEW = 'new';
var FRM = "forms[0]";
var szRELOADASSOC = 'reloadassoc';

var bRecordExists = true;  // will determine whether record is in the database or not.
var nLastValidDtl = -1;
// Row numbers of rows that are blank (brn = blank row numbers)
var brn = [];
var bMenuExists = false;
var bMsgExists = false;
var bIconsExists = false;
var bDisplayCopyRightAlways = true;
var nTotalLvl = 0;
var nCurRow = -1;
var szDependDivs = "";
var moved_x=0;
var moved_y=0;
var moved_dtl_x=0;
var moved_dtl_y=0;
var bDisableMenu = false;
var CommaDelimiter=',';
var Decimal = '.';
var Blank = '';
var Pattern = '';
var isLastPage=false;
var isDetail = false;
var szOperLegend = "<table width=250 cellspacing=\"1\" style=\"border-collapse: collapse\" bordercolor=\"#111111\"><tr><td>"
+  "= </td><td>equals</td></tr><tr><td>!= </td><td>not equals</td></tr><tr><td>=*</td>"
+  "  <td>like</td>"
+  "  </tr><tr><td> !* </td>"
+  "  <td> not like</td>"
+  "  </tr>"
+  "<tr>"
+  "  <td> &gt; </td>"
+  "  <td> greater than </td>"
+  "  </tr>"
+  "<tr>"
+  "  <td> &gt;= </td><td> greater than equals</td>"
+  "</tr>"
+  "<tr>"
+  "  <td> =N </td><td> is Null </td>"
+  "</tr>"
+  "<tr>"
+  "  <td> !N </td><td> is not Null </td>"
+  "</tr>"
+  "<tr><td> &lt; </td><td> less than</td></tr><tr><td> &lt;= </td><td> less than equals</td></tr><tr><td> a,z </td><td> range a,z</td></tr><tr><td> ...&nbsp; </td><td> any one of a,b,c</td></tr><tr><td> !...&nbsp; </td><td> none of a,b,c</td></tr><tr><td> a*&nbsp; </td><td> begins with a </td></tr><tr><td> *a&nbsp; </td><td> ends with a </td></tr></table>";

var ar = new Array();
var popupfldhtmlname = '';//Selected popup field html name


// Checks if obj is contained in the array arr.
// Performs strict checking (both type and value must match.
// No implicit conversions are done)
function contains(arr, obj)
{
    var len = arr.length;
    for (var i=0; i < len; i++)
    {
        if (arr[i] === obj)
        {
            return true;
        }
    }
    return false;
}

// hide all div whose id starts with startWith ie hideAll(D) will hide D0, D1 and so on
function hideAll(startWith)
{
	var i = 0;
	while(document.getElementById(startWith+i))
	{
		hide(startWith+i);
		i++;
	}
}

// return the obj based on its name szName
function getElemnt(szName)
{
    return document.getElementById(szName);
}


// hide an object (div) based on its id
function hide(ID)
{
    hideObj(getElemnt(ID));
}

// hide an object
function hideObj(obj)
{
    if (obj)
    {
        obj.style.visibility = 'hidden';
    }
}

// show an object (div) based on its id
function show(ID)
{
    showObj(getElemnt(ID));
}

// show an object
function showObj(obj)
{
    if (obj)
    {
        obj.style.visibility = 'visible';
    }
}


// setting the inherit property of an object
function showInherit(ID)
{
    showInheritObj(getElemnt(ID));
}

function showInheritObj(obj)
{
    if (obj)
    {
        obj.style.visibility = 'inherit';
    }
}

// moving a set of divs down based on an existing div
function movedown(id, based, from, to, chidtop, childleft)
{
	var nAdd = getElemnt(based).offsetHeight;
	for (i=from; i <=to; i++)
	{
		nCur = parseInt(getElemnt(id+i).style.top);
		getElemnt(id+i).style.top = nCur + nAdd + "px";
	}
	getElemnt(based).style.top = chidtop+"px";
	getElemnt(based).style.left = childleft+"px";
}

// moving a set of element up based on an id
function moveup(id, based, from, to)
{
	var nAdd = getElemnt(based).offsetHeight;
	for (i=from; i <=to; i++)
	{
		nCur = parseInt(getElemnt(id+i).style.top);
		getElemnt(id+i).style.top = nCur - nAdd + "px";
	}

}

// not being used yet
function resiz()
{
   /* var obj = document.getElementById('LOCK').style;
    alert(document.offsetWidth);
    alert(document.offsetLength);
    obj.width = parseInt(window.screen.availWidth-25);
    obj.length = parseInt(window.screen.availHeight-300);*/
}

// clear the status line text
function clr()
{
	self.defaultStatus='';
	hide('mask');
}

// set the status line text
function st(msg)
{
	self.defaultStatus=msg;
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
    if ( bMenuExists )
    {
        obj = getElemnt('TSSMENU');
        if (obj)
	        topx+=obj.offsetHeight;

        obj = getElemnt('TSSICON');
        if (obj)
            topx+=obj.offsetHeight;

    }

    if ( bDisplayCopyRightAlways )
	topx+=18;


	TOP4LOCK = topx - 18;
    document.write("<div id='LOCK' style='background-color:#"+clr+";left:0;position:absolute;top:"+parseInt(topx-18)+"px;width:"+parseInt(nCurScrWidth)+"px;height:"+parseInt(nCurScrHeight-topx)+"px;overflow:auto;' onscroll='moved_y=this.scrollTop;moved_x=this.scrollLeft;cal.hideCalendar();hide(\"mask\")'>");
    prePrintProcessing();

}

function prePrintProcessing()
{
	document.write('<DIV ID="preprint" style="position:absolute;visibility:visible;">');
	document.write("<img src='images/p.gif' border='0'>")
	document.write('</div>');
    getElemnt('preprint').style.top = parseInt(getElemnt('LOCK').offsetHeight/2) - parseInt(getElemnt('preprint').offsetHeight/2) + "px";
    getElemnt('preprint').style.left = parseInt(getElemnt('LOCK').offsetWidth/2) - parseInt(getElemnt('preprint').offsetWidth/2) + "px";
    getElemnt('preprint').style.padding= "1px 1px 1px 1px";
}

// create a div with 'name' as id with background color as 'bgcolor' to starting from 'height' pixels to the end of the screen.
function createDiv(name, bgcolor, width, height)
{
    if ( bDisplayCopyRightAlways )
         height+=18
    document.write("<div id='"+name+"' style='background-color:"+bgcolor+";position:absolute;width:100%;height:"+parseInt(nCurScrHeight-height)+"px;overflow:auto'>");
    prePrintProcessing();
//    document.write("<div id='"+name+"' style='background-color:"+bgcolor+";position:absolute;width:"+parseInt(window.screen.availWidth-25)+"px;height:"+parseInt(window.screen.availHeight-height)+"px;overflow:auto'>");
}

// end the main div 'LOCK' and sets up the onresize event for the window.
function endLock()
{
	document.write("</div>");
    hide('preprint');
    crDiv();
    //Tracker#: 14428 IE8 ISSUE:  SOME SCREENS HAVE UNNECESSARY SCROLL BARS
    //Sending a true value to the call of expandtl on resize only for the size assoc in the Line List
    window.onresize = function () {
    	alignTwoTableColumns.calledOnResize(function () {
    		setHW(); adjLOCK(); if (ddobj) { freeze('T', 'D', 'TITLE_DIV', 'DATA_DIV' , 'TITLE_TABLE', 'DATA_TABLE'); } else if (dd2obj) { handleColLock(nLockedcols); } expandtl(true);
    	});
    };
    
    /*
    // Tracker#: 19807 - LEFT NAVIGATION NEEDS TO BE MADE COLLAPSIBLE
    if (window['_showWorkArea'] && _showWorkArea.toggleNav)
    {
    	_showWorkArea.toggleNav.register('onresize', []);
    }
    */
}

//copy right div at the
function crDiv()
{
    document.write("<div id='TSSBOT' style='top:"+(nCurScrHeight-18)+"px;'>&nbsp;&nbsp;Copyright &#169; 2002-2014 TradeStone Software, Inc.</div>");
    attachScreenListener();
}

// temporarily print the top menu - eventually we will move to java
var szTitleGif = "images/logos.gif";
function printTop(szTitle, szAction)
{
    bMenuExists = true;
    document.write('<input type="hidden" name="chgflds" value="">');
    document.write('<div id="mask" onMouseOver = "dragObj=this; drag=true;" onMouseOut = "drag=false"><table bgcolor="#000000" cellpadding=10><tr><td>TradeStoneSoftware</td></tr></table></div>');
    document.write('<table width="100%" cellpadding="0" cellspacing="0" border="0" id="TSSMENU">');
    document.write('<tr >');
    document.write('<td ID="menubg" height="43" width="67" align="left" valign="top" style="padding:0;"><img src="');
    document.write(szTitleGif);
    document.write('" border="0" height="43" width="67"></td>');
	document.write('<td ID="menubg" width=96%" style="padding:0;">&nbsp;</td>');
	document.write('</tr>');
    document.write('<tr>');
    document.write('<td colspan="2" ID="topt" height="33" style="padding:0;vertical-align:middle">&nbsp;&nbsp;'+szTitle+'</td>');
//    document.write('<td colspan="2" style="color:#FFFFFF;height:33px;font-weight:bold;font-size:17px;background-color:#FFFFFF; background-image: url(\'images/toptitlebg.gif\'); background-repeat: repeat-x; background-attachment: scroll; background-position: left">&nbsp;&nbsp;'+szTitle+'</td>');

    document.write('</tr>');
    document.write('</table>');
    if (szAction == 'Y')
    {

	bIconsExists = true;
	document.write('<table width="100%" cellpadding="0" cellspacing="0" border="0" id="TSSICON">');
        document.write('<tr >');
        document.write('<td ID="ntopg"  width="10%" nowrap>&nbsp');
        if (FRM == 'fsteptracker')
            document.write('<a href="javascript:fsubmit(\'new\')" alt="NEW RECORD" title="NEW RECORD"><img height="24" src="images/add.gif" border="0"></a>');
        if (FRM == 'fsteptracker' || FRM == 'fcostmodel')
            document.write('&nbsp;<a href="javascript:fsubmit(\'save\')"><img height="24" src="images/save.gif" border="0"></a><!--&nbsp;<a href="javascript:fsubmit(\'copy\')"><img src="images/copy.gif" border="0"></a>&nbsp;<a href="javascript:fsubmit(\'delete\')"><img src="images/delete.gif" border="0"></a>-->');
        if (FRM == 'fbommodelsteps')
            document.write('&nbsp;<a href="javascript:localfsubmit(\'savesteps\')"><img height="24" src="images/save.gif" border="0"></a>');

        if (FRM == 'fnotesmodelsteps')
            document.write('&nbsp;<a href="javascript:localfsubmit(\'savesteps\')"><img height="24" src="images/save.gif" border="0"></a>');

        if (FRM == 'fchargeback' || FRM == 'fbom' || FRM == 'fnotes' || FRM == 'fcost')
        {
            document.write('<a href="javascript:fsubmit(\'new\')"           alt="NEW RECORD"    title="NEW RECORD"> <img height="24" src="images/add.gif"       border="0"></a>');
            document.write('&nbsp;<a href="javascript:fsubmit(\'save\')"    alt="SAVE"          title="SAVE">       <img height="24" src="images/save.gif"      border="0"></a>');
            document.write('&nbsp;<a href="javascript:fsubmit(\'refresh\')" alt="REFRESH"       title="REFRESH">    <img height="24" src="images/refresh.gif"   border="0"></a>');
            document.write('&nbsp;<a href="javascript:fsubmit(\'delete\')"  alt="DELETE"        title="DELETE">     <img height="24" src="images/delete.gif"    border="0"></a>');
            document.write('&nbsp;<a href="javascript:fsubmit(\'return\')"  alt="RETURN"        title="RETURN">     <img height="24" src="images/parent.gif"    border="0"></a>');
// currently only one associate of a particular type is attached to a detail row.
//            document.write('&nbsp;<a href="javascript:fsubmit(\'prev\')"    alt="PREVIOUS"      title="PREVIOUS">   <img src="images/prev.gif"      border="0"></a>');
//            document.write('&nbsp;<a href="javascript:fsubmit(\'next\')"    alt="NEXT"          title="NEXT">       <img src="images/next.gif"      border="0"></a>');
        }
        if (FRM == 'frmVariations')
        {
            document.write('&nbsp;<a href="javascript:returnfsubmit(\'return\')"  alt="RETURN"        title="RETURN">     <img height="24" src="images/parent.gif"    border="0"></a>');
        }

        if ((FRM == 'fApplicationConfig') || (FRM == 'fAppConfig'))
        {
            document.write('&nbsp;<a href="javascript:fsubmit(\'save\')"  alt="RETURN"        title="RETURN">     <img height="24" src="images/save.gif"    border="0"></a>');
        }

        document.write('</td>');
        document.write('<td ID="ntopg" align="center" valign="middle">&nbsp;<!--<a href="javascript:fsubmit(\'prev\')"><img src="images/prev.gif" border="0" align="top"></a>  1 of 12  <a href="javascript:fsubmit(\'next\')"><img src="images/next.gif" border="0" align="top"></a> --> </td>');
      //  document.write('<td ID="ntopg"  width="10%" nowrap align="right"><img alt="Screen Message" src="images/msg.gif" onmouseover="show(\'mask\');setZValue(getElemnt(\'mask\'),++cur_z);moveDiv(getElemnt(\'mask\'),100,100);">&nbsp;<img alt="There are messages for you!" src="images/mailnew.gif" onmouseover="this.src=\'images/mail.gif\'"></td>');
        document.write('</tr>');
        document.write('</table>');
    }
}

// flipping an image src
function flip(name, file)
{
    document.images[name].src = file;
}

//flipping an image style
function flipS(name, str)
{
	if(document.getElementById(name) != null) document.getElementById(name).style.backgroundPosition = str;
}

function flipimg(obj, file)
{
    obj.src = file;
}

// uppercase a field
function u(obj)
{
    obj.value = obj.value.toUpperCase();
}


//validate current object value to the dataformat
function vd(fldObj, dateFormat)
{
	if (fldObj.value == '')
		return true;


    var TempMsg = szMsg_Invalid_Date;
	TempMsg = replacevalstr(TempMsg, "#szCurFmt#", szCurFmt);

    this.msg = TempMsg;
    this.year = 0;
    // year is 4 or 2 digit
    if (szCurFmt.length == 10)
       this.yearfmt = 4;
    else
		this.yearfmt = 2;

    this.month = 0;
    this.day = 0;

	// lenght are not same
    if (fldObj.value.length != szCurFmt.length)
	    return dispMsg(this, fldObj);

	// going to check the pattern here
	if (!checkPattern(fldObj.value))
	    return dispMsg(this, fldObj);



    // this will set month, year, & day
    setValues(this, fldObj.value);

   /* alert(this.month);
    alert(this.year);
    alert(this.day);*/

    if (!isValidMD(this))
	    return dispMsg(this, fldObj);

    return true;
}

// displays the msg for the data
function dispMsg(dateObj, fldObj)
{
		alert(dateObj.msg);
		fldObj.value="";
		a = setTimeout("getElemnt('"+fldObj.name+"').focus()",1)
    	return false;
}

// check the month, day and year
function isValidMD(dateObj)
{
	var nMonth = parseInt(dateObj.month,10);
	var nDay = parseInt(dateObj.day,10);
	var nYear = parseInt(dateObj.year,10);

	if (nMonth > 12 || nMonth < 1 || nDay < 1 || nDay > 31)
		return false;

	if ((nMonth == 4 || nMonth == 6 || nMonth == 9 || nMonth == 11)	&& nDay == 31)
		return false;

	if (nMonth == 2 && nYear % 4 == 0 && nDay > 29)
		return false;

	if (nMonth == 2 && nYear % 4 != 0 && nDay > 28)
		return false;

	return true;

}
// internal function to date validation - sets the value of the date class
function setValues(dateObj, szVal)
{
    //Tracker#: 15018 - CHANGING THE LAYOUT DATE IS CAUSING ERRORS IN PLM SCREENS WHEN SAVING
    //get the szCurFmt from the dateObj instead of global variable
    var szTemp = dateObj.szCurFmt;
    //alert("setvalues: dateObj.szCurFmt= " + szTemp);
    nCurPos = 0;
    while (szTemp != '')
    {

        szObj = szTemp.substring(0,1);
        if (szObj == 'M')
        {
            dateObj.month = szVal.substring(nCurPos, 2+nCurPos);
            nCurPos+=3;
            szTemp = szTemp.substring(3, szTemp.length);
        }
        else if (szObj == 'd')
        {
            dateObj.day = szVal.substring(nCurPos, 2+nCurPos);
            nCurPos+=3;
            szTemp = szTemp.substring(3, szTemp.length);
        }
        else if(szObj == 'y')
        {
            dateObj.year = szVal.substring(nCurPos, dateObj.yearfmt+nCurPos);
            nCurPos+=parseInt(dateObj.yearfmt+1);
            szTemp = szTemp.substring(parseInt(dateObj.yearfmt+1), szTemp.length);
        }
        else
            szTemp = '';
    }
}

// internal function to date validation - compare the value with the current date format.
function checkPattern(szVal, dateObj)
{
	var szTempFmt = szCurFmt;
    //Tracker#: 15018 - CHANGING THE LAYOUT DATE IS CAUSING ERRORS IN PLM SCREENS WHEN SAVING
    //get the szCurFmt from the dateObj instead of global variable
	if(dateObj)
	{
	   szTempFmt =  dateObj.szCurFmt;
	}

	var szTempVal = szVal;
	var bResult = true;

	while (szTempFmt.length > 0)
	{

		szObj = szTempFmt.substring(0,1);
		if (szObj == 'M' || szObj == 'd' || szObj == 'y')
		{
			if (isNaN(szTempVal.substring(0,1)))
			{
				bResult = false;
				break;
			}
		}
		else if (szObj != szTempVal.substring(0,1))
		{
				bResult = false;
				break;
		}
		szTempVal = szTempVal.substring(1, szTempVal.length);
		szTempFmt = szTempFmt.substring(1, szTempFmt.length);

	}
	return bResult;
}


// is value a number
function isNum(chr)
{
	if(isNaN(chr))
		return false;

	return true;
}

// new function to check for number value of the fields and give user the msg is it is not a number and clear the field value
function isn(obj)
{
    if (!isNumber(obj))
    {
         alert(szMsg_NaN);
         obj.value='';
    }
}

// check for fields value being number or not.
function isNumber(obj)
{
	//tracker 10880, disallow "," in decimal of user input
	var objvalue = obj.value;
    return (!isNaN(objvalue) && parseFloat(objvalue,10) == (objvalue*1));
}


// Valid Numeric format
function vn(obj)
{
    if (obj.value != "")
    {
        val = replaceval(obj, CommaDelimiter, "");
        if (parseFloat(val,10)!=(val*1))
        {
    		//var TempMsg = szMsg_Invalid_Date;
    		var TempMsg = szMsg_Invalid_Number + Pattern;
	    	TempMsg = replacevalstr(TempMsg, "#szCurFmt#", szCurFmt);
		    alert(TempMsg);
            obj.value='';
            return false;
        }
    }
    return true;
}

// this function check for the scale in a decimal value
function vn_dec(obj, scale)
{
    var bRtn = true;
    if (obj.value != "")
    {
        bRtn = vn(obj);
        if (bRtn)
        {
            var nDec = obj.value.indexOf(Decimal);
            var nLen = obj.value.length;

            if (scale > 0 && nDec >= 0)
            {
                if (parseInt(nLen - nDec) - 1 > scale)
                {
                    szScale = scale;
        	    	var TempMsg = szMsg_Scale_Limit;
	        	    TempMsg = replacevalstr(TempMsg, "#szScale#", szScale);
		            alert(TempMsg);
                    obj.value='';
                    bRtn = false;
                }
            }
            else if (scale <= 0 && nDec > 0)
            {
                alert(szMsg_Invalid_Integer);
                obj.value='';
                bRtn = false;
            }
            else
            {
                obj.value = FormatNumber(obj.value, scale);
            }
        }
    }
    return bRtn;
}

// format the number value based on scale and delimiter
function FormatNumber(num , scale)
{

    var sVal='';
    var minus='';

    num = replacevalstr(new String(num) , CommaDelimiter, "");
    try
    {
        if (num.lastIndexOf("-") == 0)
        {
            minus='-';
            num = num.substring(1, num.length);
        }

        // get the decimal part if any
        var szDecVal = "";

        var samount = new String(num);

        var nindex = samount.lastIndexOf(Decimal);
        if (nindex > 0)
        {
            szDecVal = samount.substring(nindex, samount.length);
        }

        num = parseInt(num);
        var samount = new String(num);
        for (var i = 0; i < Math.floor((samount.length-(1+i))/3); i++)
            {
            samount = samount.substring(0,samount.length-(4*i+3)) + CommaDelimiter + samount.substring(samount.length-(4*i+3));
        }

        samount = samount + szDecVal;

        nindex = samount.lastIndexOf(Decimal);

        if (nindex < 0 && scale > 0)
        {
            samount = samount + Decimal;
            for (i=0; i < scale; i++)
                samount = samount + '0';
        }
        else if (scale > 0)
        {
            for (i=0; i <= (scale - (samount.length - nindex)); i++ )
                samount = samount + '0';
        }


    }
    catch (exception)
    {
        AlertError("Format Number",e);
    }
    return minus + samount;
}

 function AlertError(MethodName,e)
 {
            if (e.description == null) { alert(MethodName + " Exception: " + e.message); }
            else {  alert(MethodName + " Exception: " + e.description); }
 }


function parseDec(val,places,sep) {

	// This function takes two arguments:
	//   (string || number)  val
	//            (integer)  places
	//             (string)  sep
	// val is the numeric string or number to parse
	// places represents the number of decimal
	// places to return at the end of the parse.
	// sep is an optional string to be used to separate
	// the whole units from the decimal units (default: '.')

	val = '' + val;
		// Implicitly cast val to (string)

	if (!sep) {
		sep = '.';
		// If separator isn't specified, then use a decimal point '.'
	}

	if (!places) { places = 0; }
	places = parseInt(places);
		// Make sure places is an integer

	if (!parseInt(val)) {
		// If val is null, zero, NaN, or not specified, then
		// assume val to be zero.  Add 'places' number of zeros after
		// the separator 'sep', and then return the value.  We're done here.
		val = '0';
		if (places > 0) {
			val += sep;
			while (val.substring((val.indexOf(sep))).length <= places) {
				val += '0';
			}
		}
		return val;
	}

	if ((val.indexOf('.') > -1) && (sep != '.')) {
		val = val.substring(0,val.indexOf('.')) + sep + val.substring(val.indexOf('.')+1);
			// If we're using a separator other than '.' then convert now.
	}

	if (val.indexOf(sep) > -1) {
		// If our val has a separator, then cut our value
		// into pre and post 'decimal' based upon the separator.
		pre = val.substring(0,val.indexOf(sep));
		post = val.substring(val.indexOf(sep)+1);
	} else {
		// Otherwise pre gets everything and post gets nothing.
		pre = val;
		post = '';
	}

	if (places > 0) {
		// If we're dealing with a decimal then...

		post = post.substring(0,(places+1));
			// We care most about the digit after 'places'

		if (post.length > places) {
			// If we have trailing decimal places then...

			//alert (parseInt(post.substring(post.length - 1)));

			if ( parseInt(post.substring(post.length - 1)) > 4 ) {
				post = '' + Math.round(parseInt(post) / 10);
				//post = '' + post.substring(0,post.length - 2) + (1/Math.pow(10,places));
				//post = ('' + post.substring(0,post.length - 2)) + (parseInt(post.substring(post.length - 1)) + 1);
			} else {
				post = '' + Math.round(parseInt(post));
			}
		}

		if (post.length > places) {
			post = '' + Math.round(parseInt(post.substring(0,places)));
		} else if (post.length < places) {
			while (post.length < places) {
				post += '0';
			}
		}

	} else {

		if (parseInt((post.substring(0,1))) > 4) {
			pre = '' + (parseInt(pre) + 1);
		} else {
			pre = '' + (parseInt(pre));
		}
		post = '';
	}

	sep = (post.length > 0) ? sep : '';
		// Should we use a separator?

	val = pre + sep + post;
		// Rebuild val

	return val;
}



// replace the all the occurance of a particular char with a new one in object
function replaceval(obj, remove, add)
{
	return replacevalstr(obj.value, remove, add);
}

// replace the all the occurance of a particular char with a new one in string
function replacevalstr(str, remove, add)
{
	var szTemp = str;
	var szRtn = "";

	while (szTemp.indexOf(remove) != -1)
	{
		var nPos= szTemp.indexOf(remove);
		szRtn = szRtn + szTemp.substring(0, nPos) + add;
		szTemp = szTemp.substring((nPos + remove.length), szTemp.length);
	}

	return szRtn + szTemp;
}


// select or unselect all checkbox based on current value
function handleAll(obj, objname)
{
	if (obj.checked == true)
		selectAll(objname)
	else
		unselectAll(objname);
}


function handle1(obj, row)
{
	if (obj.checked == true)
	{
		nCurRow = row;
		clrTableRow(row);
    }
	else if (!isSelected('R'))
	{
	    nCurRow = -1;
	    unclrTableRow(row);
    }
    else
    {
        unclrTableRow(row);
    }

}


function selectAll(objname)
{
    var obj = getobj(objname);
    if(obj)
    {
        var blnPerfomrAction = true;

        if(typeof(nLastValidDtl)!='undefined')
        {
            if(nLastValidDtl<0)blnPerfomrAction = false;
        }

        if( ((typeof obj.length) == 'undefined'))
        {
            obj.checked = true;
            return;
        }
        if(isDetail)
            {
                if(isLastPage==true && nLastValidDtl>10)
                {
                    var end=0;
                    end  = (nLastValidDtl)% 10;
                    for(i=0;i<=end;i++)
                    {
                        blnPerfomrAction = true;
                        if(typeof(nLastValidDtl)!='undefined')
                        {
                            if( (nLastValidDtl<0) || (i>nLastValidDtl) )blnPerfomrAction = false;
                        }

                        e=obj[i];
                        if( (e.type=='checkbox') && !(e.checked) && (e.name == objname) && (blnPerfomrAction))
                        {
                            clrTableRow(e.value);
                            e.checked=true;
                            nCurRow = 0;  // just to make sure it is not hdr which is -1
                        }
                    }
                }
                else
                {
                    for(i=0;i< obj.length;i++)
                    {
                        blnPerfomrAction = true;
                        if(typeof(nLastValidDtl)!='undefined')
                        {
                            if( (nLastValidDtl<0) || (i>nLastValidDtl) )blnPerfomrAction = false;
                        }

                        e=obj[i];
                        if( (e.type=='checkbox') && !(e.checked) && (e.name == objname) && (blnPerfomrAction))
                        {
                            clrTableRow(e.value);
                            e.checked=true;
                            nCurRow = 0;  // just to make sure it is not hdr which is -1
                        }
                    }
                }
            }
            else
            {
        for(i=0;i< obj.length;i++)
        {
            e=obj[i];
            if (e.type=='checkbox' && !(e.checked) && e.name == objname)
            {
                clrTableRow(e.value);
                e.checked=true;
                nCurRow = 0;  // just to make sure it is not hdr which is -1
            }
        }
    }
}
}


function unselectAll(objname)
{
    var obj = getobj(objname);
    if (obj)
    {
        if ((typeof obj.length) == 'undefined')  // only one checkbox
        {
            obj.checked = false;
            return;
        }

        for(i=0;i< obj.length;i++)
        {
            e=obj[i];
            if (e.type=='checkbox' && e.checked && e.name == objname)
            {
                unclrTableRow(e.value);
                e.checked=false;
                nCurRow = -1;  // no detail record is selected.
            }
        }
    }
}

//select of unselect a value with the provided range
function selectx(nam, from, to, bval)
{
    var e=getobj(nam);

	for(var i=from; i < to; i++)
	{
		if (e[i] && e[i].type == 'checkbox')
		{
			e[i].checked=bval;
        }
	}
}

//rpt==1 for repeating fields
function oLook(vid,f,rpt)
{
    if (rpt == 0)
    {
        var url = "lookup.do?id=" + vid + "&pbf=" + f ;
    }
    else
    {
        if (nCurRow == -1) nCurRow = 0;
        var occ = nCurRow;
        var url = "lookup.do?id=" + vid + "&pbf=" + f + "_" + occ ;
    }
    url+= "&docviewid=" + szDocViewId;
    openW(url);
}

//1.rpt==1 for repeating fields
//2.added one more parameter fltrcols to get the filter column no's.
//3.dynaCols will be in the form of col1_0_fieldlabel1~col2_1_fieldlabel2 (where 0, 1 being levels;fieldlabel1, fieldlabel2 being labels)
//4.reads the values for the fltrvols passed and appends to the url.
//5.Prompts the user to enter prefilter value, for example if the filter on dept
//  depends on commodity, and commodity is not filled, remind the user to enter
//  commodity prior to selecting dept
// cursec-> Pass the value "Y" to get read all the fields from the current section
//current section -> URL link field belongs to the section.

function oLook(vid,f,rpt,fltrcols,cursec)
{
    var cursecinfo = "";
    if(typeof(cursec)!="undefined")
    {
        if(cursec && cursec.length>0)
        {
          cursecinfo = "&lookforincurrentsection="+ cursec;
        }
    }

    if (nCurRow == -1) nCurRow = 0;
    var occ = nCurRow;//?

    var fltrvals = getfiltervals (occ, rpt, fltrcols);
    if (fltrvals == null)
    {
    	return;
    }
	fltrcols = encodeURIComponent(fltrcols);
    if (rpt == 0)
	{
	    popupfldhtmlname = f;

        var url = "lookup.do?id=" + vid + "&pbf=" + f + "&fltrcols=" + fltrcols + "&fltrvals=" + fltrvals + "&appendAfterRow=" + appendAfterRow;
    } else
    {
	    popupfldhtmlname = f + "_" + occ;

        var url = "lookup.do?id=" + vid + "&pbf=" + f + "_" + occ + "&fltrcols=" + fltrcols + "&fltrvals=" + fltrvals + "&appendAfterRow=" + appendAfterRow;
    }
    url+= "&docviewid=" + szDocViewId;
    openW(url+ cursecinfo);
}

function getfiltervals (occ, rpt, fltrcols)
{
    var fltrvals = "";

	if(typeof(fltrcols) != 'undefined' && fltrcols !='')
	{
	   var valArray = fltrcols.split('~');

	   for(var j = 0 ; j < valArray.length ; j++)
	   {
		  var colNameWithLevel = valArray[j];
		  var valArray1 = colNameWithLevel.split (',');
		  var colName = valArray1[0];
		  var filterRpt = valArray1[1];
		  var fieldLabel = valArray1[2];
		  var fltrval;
		  if(j==0)
		  {
		      /*filterRpt indicates if the filter field is repeating or not
		       *We should also know if the filter fields are repeating or not
		       *to fetch the right value on the screen;Note currently it cannot
		       *handle if the detail field depends on the body field;
		       */
		      if (filterRpt == 0)
		      {
			      fltrval = getval(colName);
		      }
		      else
		      {
			      fltrval = getval(colName + '_' + occ);
		      }

		      if (fltrval == '' && fieldLabel != '')
		      {
		      	alert (szMsg_Filter_Columns + fieldLabel);
		      	return;
		      }
		      fltrvals = fltrvals + fltrval;
		  }
		  else
		  {
		      if (filterRpt == 0)
		      {
			      fltrval = getval(colName);
		      }
		      else
		      {
			      fltrval = getval(colName + '_' + occ);
		      }

		      if (fltrval == '' && fieldLabel != '')
		      {
		      	alert (szMsg_Filter_Columns + fieldLabel);
		      	return;
		      }
		      fltrvals = fltrvals + '~' + fltrval;
		  }
	   }

    }

	//Note:encodeURIComponent() will not encode: !*()'
	fltrvals = encodeURIComponent(fltrvals);
	return fltrvals;
}

// open a new window with the url - sets the height and width to 500 and 600
function openW(url)
{
    oW('newW',url,500,600);
}

// open a window with provied url, width and height
function openWin(url, nWidth, nHeight)
{
    oW('newW',url,nWidth,nHeight);
}

// opens up a new window
function oW(wname,url,nWidth,nHeight)
{
    var nWindow = window.open(url, wname,'width=' + nWidth + ',height=' + nHeight + ',toolbar=no,menubar=no,scrollbars=no,resizable=yes')
}

// open the window with user defined menu controls
function oCW(wname,url,nWidth,nHeight,t,m,s,r)
{
    var mctl = 'width=' + nWidth + ',height=' + nHeight;
    if (t == 0)
    {
        mctl += ',toolbar=no';
    }
    else
    {
        mctl += ',toolbar=yes';
    }

    if (m == 0)
    {
        mctl+= ',menubar=no';
    }
    else
    {
        mctl+= ',menubar=yes';
    }

    if (s == 0)
    {
        mctl+= ',scrollbars=no';
    }
    else
    {
        mctl+= ',scrollbars=yes';
    }

    if (r == 0)
    {
        mctl+= ',resizable=no';
    }
    else
    {
        mctl+= ',resizable=yes';
    }

    
    var nWindow = window.open(url, wname,mctl);
}


// open a new window
function oAssocWin(url)
{
  oW('assocW',url,500,400);
}

/** Utility function that abstracts browser differences in getting mouse position.
 * @param ev - event object.
 * @returns Object with x,y properties with mouse x,y position respectively.
 */
function normMousePos(ev)
{
	if (ev)
	{
		return {
			x : ev.pageX,
			y : ev.pageY
		};
	}
	else
	{
		return {
			x : event.clientX,
			y : event.clientY
		};
	}
}

/* Tracker#: 18890 - SAFARI & FIREFOX: ISSUES IN PO - QUICK SEARCH
 * Added event object parameter to draggable functions.
 */
/// Draggable functions --- Starts
var drag = false;
var move = false;
var zvalue = 0;
var dragObj = '';
var offsetleft;
var offsettop;

function mouseDown(e)
{
	var mouse = normMousePos(e);

	offsetleft = mouse.x - parseInt(dragObj.style.left);
	offsettop = mouse.y - parseInt(dragObj.style.top);
	
	move=true;
	zvalue +=100;
	setZValue(dragObj, zvalue);
}



function mouseMove(e)
{
    setxy(e);
	if (move==true)
	{
	    if (IE)
	    {	
	    	document.selection.empty();
	    }
	    else
	    {
	    	window.getSelection().removeAllRanges();
	    }
        
	    var mouse = normMousePos(e);
	    moveDiv(dragObj, mouse.x - 10 - offsetleft, mouse.y - 10 - offsettop, mouse);
    }
}

function mouseStop() {
	return false;
}

function mouseUp() {
//	drag = false;
//	move=false;
	}


function moveDiv(obj, x, y, mouse)

{
    var objlock = getElemnt('LOCK');

    obj.style.left = mouse.x - 10 + objlock.scrollLeft + "px";
    obj.style.top = mouse.y - 10 + objlock.scrollTop - parseInt(objlock.style.top) + "px";
}


function moveDiv2(obj, x, y)
{
    obj.style.left = x+"px";
    obj.style.top = y+"px";
}

var mX = 0;
var mY = 0;
function setxy(event)
{
    var ev = event || window.event;
    if (typeof(ev) != 'undefined')
    {
	    if(ev.pageX || ev.pageY)
	    {
	        mX = ev.pageX;
	        mY = ev.pageY;
	    }
	    else
	    {
	        mX = ev.clientX + document.body.scrollLeft - document.body.clientLeft;
	        mY = ev.clientY + document.body.scrollTop  - document.body.clientTop;
	    }
	}
    return true;
}

//document.onmousedown=mouseDown;
document.onmousemove=mouseMove;
//document.onmousemove=setxy;
//document.ondragstart=mouseStop;
//document.onmouseup=mouseUp;
document.onresize=resiz;


/// Draggable functions --- ends

function setZValue(obj, zval)
{
    obj.style.zIndex = zval;
}


/* TEST DATA
function WriteFormProps(name,value)
{
	document.write('name="' + name + '" value="' + value + '"<br>');
}

WriteFormProps("userAgent", navigator.userAgent);
WriteFormProps("browser", navigator.appName);
WriteFormProps("browseVersion", navigator.appVersion);
WriteFormProps("platform", navigator.platform);
WriteFormProps("browserCodename", navigator.appCodeName);
WriteFormProps("cookieEnabled", navigator.cookieEnabled);
WriteFormProps("language", (navigator.language ? navigator.language : navigator.userLanguage));
WriteFormProps("javaEnabled", navigator.javaEnabled());
WriteFormProps("screenWidth", window.screen.width);
WriteFormProps("screenHeight", window.screen.height);
WriteFormProps("screenAvailWidth", window.screen.availWidth);
WriteFormProps("screenAvailHeight", window.screen.availHeight);
WriteFormProps("screenColorDepth", window.screen.colorDepth);
WriteFormProps("referrer", document.referrer);
WriteFormProps("title", document.title);
WriteFormProps("URL", document.URL);
WriteFormProps("lastModified", document.lastModified);

            */



// keeps track of changed fields
// cf - changed fields
var specialCase = false;  // this variable will skip the test if the field is set to allow ".
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

    cfbyname(obj.name);
    specialCase = false;
}

//add the name of the given field to the changed fields value
function cfbyname(fldname)
{
    var chgHolder = getval('chgflds');
    if (chgHolder.indexOf(fldname + ',') == -1) // if it doesn't exist
                chgHolder = chgHolder.concat(fldname,',');
    // changed the changed fields values
    setval('chgflds', chgHolder);
}

//Clears the given field name from the chgflds
function cfclearbyname(fldname)
{
    var chgHolder = getval('chgflds');
    var index = chgHolder.indexOf(fldname + ',');
    if (index != -1) // if it exists
    {
        chgHolder = chgHolder.substring (0, index) + chgHolder.substring ((index + 1) + fldname.length);
    }
    // changed the changed fields values
    setval('chgflds', chgHolder);
}

// onchange function for a date field
function cfd(obj, dateFormat)
{
    if (vd(obj, dateFormat)) cf(obj);
}

// onchange function for a number field
function cfn(obj, scal, groupingseperator, decimalseperator)
{
    /*CommaDelimiter = groupingseperator;
    if (decimalseperator) {
	    Decimal = decimalseperator;
	}
    if (vn_dec(obj, scal)) cf(obj);*/
    cf(obj);
}

// onchange function for a text field
function cft(obj)
{
    if (obj.type != 'select-one')
    	u(obj);
    cf(obj);
}


// return a js object of an html element
function getobj(fld)
{
    if (eval('document.'+FRM+'.'+fld))
        return eval('document.'+FRM+'.'+fld);
}

// return the value of an html element
function getval(fld)
{
    if (eval('document.'+FRM) && eval('document.'+FRM+'.'+fld))
        return eval('document.'+FRM+'.'+fld+'.value');
    else
        return "";
}

// return a js object of drop down html element
function getDropDownObj(fld)
{
    if (eval('document.'+FRM+'.'+fld))
        return eval('document.'+FRM+'.'+fld+'[document.'+FRM+'.'+fld+'.selectedIndex]');
}



// disable an element on the form , pos is the position in an array if it is an array object.  -1 for non array
function disableE(elemnt, pos)
{
	var obj;
    	obj = getobj(elemnt);

	if (pos != -1 && obj)
	        obj = obj[pos];

 	if (obj)
 	{
        obj.disabled = true;
        obj.className="disabled";

}
}
// enable an element on the form , pos is the position in an array if it is an array object. -1 for non array
function enableE(elemnt, pos)
{
	var obj;
    	obj = getobj(elemnt);

	if (pos != -1 && obj)
	        obj = obj[pos];

    if (obj)
    {
        obj.disabled = false;
        obj.className="input";
    }
}


// sets the value of an html element
function setval(fld, val)
{
    if (eval('document.'+FRM+'.'+fld))
    eval('document.'+FRM+'.'+fld+'.value = "'+val+'"');
}

// check for lengh of an object - not used earlier used it for textarea
function checkLen(elm,len)
{
  if ( elm.value.length > len )
  {
    szLen = len+'';

    var TempMsg = szMsg_Length_limit;
	TempMsg = replacevalstr(TempMsg, "#szLen#", szLen);
    alert(TempMsg);

    elm.focus();
    return -1;
  }
  return 0;
}

// checks if anything is changed on the screen and gives the user a msg.
function hasChanged(act)
{
	if (act == 'refresh')
    {
      return act;
    }
    else if ((act == 'save' || act == 'massupdate' || act == 'savesteps') && getval('chgflds') == "")
    {
        alert(szMsg_No_change);
        act = '';
    }
    else if (act != 'save' && act != 'massupdate' && act != 'savesteps' && getval('chgflds') != "")
    {
       
    	
    	if (confirm(szMsg_Changes))
        {
            act = szSAVE;
        }
        else
        {
            setval('JS_CONFIRM_DIALOG','CANCEL');
        }
    }

    else if (szInvalid == true && act != 'save' && act != 'massupdate' && act != 'savesteps' && getval('chgflds') == "")
    {
        if (confirm(szMsg_Invalid_Assoc))
        {
            act = szRELOADASSOC;
        }
        else
        {
            act = '';
        }
    }

    if ( act == 'save' || act == 'massupdate' || act == 'savesteps' )
    {
        if (!chkreqd())
        {
            act = '';
        }
    }
    return act;
}


// this function check if the record on the screen is valid (saved in the database) before user can invoke process/association or other action on the screen.
// this also check for detail lines.
function isValidRecord(act, checkDtl)
{
    if (act =='copy'  || act == 'delete' || act == 'URL' || act == 'refresh' || act == 'db_refresh')    // currently for delete, processes and associations
    {
        if (!bRecordExists)
        {
            alert(szMsg_Invalid_Rec);    // not a valid records
            return false;
        }

        if (act == 'delete' && nCurRow != -1 ) // if it a for detail delete check
        {
             var obj = getobj('R');
            // only one check box
            if ((typeof obj.length) == 'undefined')
            {
                if (obj.checked == true && nLastValidDtl == -1)
                {
                    alert(szMsg_Invalid_Dtl_Rec);
                    return false;
                }
            }
            else     // multiple check boxes
            {
                for (i=0; i < obj.length; i++)
                {
                    if (obj[i].checked == true)
                    {
                        if (i > nLastValidDtl)
                        {
                            alert(szMsg_Invalid_Dtl_Rec);
                            return false;
                        }
                        if (contains(brn, i))
                        {
                            alert(szMsg_Blank_Dtl_Rec);
                            return false;
                        }
                    }
                }
            }
        }
    }
    return true;
}


// confirms a delete
function confirmDel(act)
{
    if (act == 'deleterows' || act == 'delete')
    {
        var szMsg = szMsg_Delete_Rec;
        if (nCurRow != -1) // dtl - changed the msg to indicate detail record.
            szMsg = szMsg_Delete_Dtl;
        if (!confirm(szMsg))
        {
            return true;
        }
    }
    return false;
}

// checks if provided checkbox name is selected on the screen on or.
function isSelected(fld)
{
    var obj = getobj(fld);
    if (obj)
    {
        // only one check box
        if ((typeof obj.length) == 'undefined')
        {
            if (obj.checked == true)
            {
                return true;
            }
        }
        else     // multiple check boxes
        {
            for (i=0; i < obj.length; i++)
            {
                if (obj[i].checked == true)
                {
                    return true;
                }
            }
        }
    }
    return false;
}


var bCheck4Changes=true;  // variable to determine wheter sfumit will check for any changes on screen or not.
function preSubmit(act)
{
    return true;
}


// to submit the form after checking for changes and checks for delete.
function fsubmit(act)
{
   
	
	if (bDisableMenu)
    {
        return;
    }
	
	//Tracker-25382 ABLE TO ADD AND REPLACE AN ATTACHMENT ON INVOICE DESPITE READ ONLY SECURITY
	//cHECKING SAVE BUTTON ENABLE FOR THIS VIEW OR NOT.If save button disabled no need to check change field
	
	
	if( document.forms[0].skipchangefieldchk)
	  {
		
		bCheck4Changes=false;
	  }
	
	if (!preSubmit(act))
        return;
    // check for changes
    if (bCheck4Changes)
    {
        act = hasChanged(act)
    }

    if (act == '')
        return;

    if (!isValidRecord(act, 'N'))
    {
        return;
    }

    if (confirmDel(act))
        return;

	// Tracker-23709 : AFTER USING SUPPLIER RCMD FEATURE, ERRORS WHEN YOU CLICK ON NEXT/PREVIOUS RFQ ARROWS	
    submitForm(act)
}

// submit the form without the change and delete checks
function  submitForm(act)
{
	//Tracker#24787 - To save the admin screen changes with ajax call
	if(isAdminCall)
	{
		var formData = '';
		if(document.forms[0])
		{
			var formId = (document.forms[0].id)? document.forms[0].id : document.forms[0].name;
			formData = $("#"+formId).serialize();
		}
	
		waitWindow();
		var htmlObj = 
		$.ajax({
			type: "POST",
			url: eval('document.'+FRM+'.action') +"?method=" + act,
			data: formData,
			cache: false,
			success: function(responseText)
			{	
				var div = document.getElementById('LOCK');
				$(div).html(htmlObj.responseText);				
				closewaitWindow();
			}
		});		
		return;
	}
    setval('method', act);
    waitWindow();
    disableLinks();
    eval('document.'+FRM+'.submit()');
}

//submit the form without the change and delete checks
function  submitFrm(act)
{
	submitForm(act);
}

//javascript:lookup('F40|F11','DRESSES|0425')
function lookup(fld, val)
{
	var nCount = 0;
    var obj_pos = eval('document.'+FRM+'.arr_pos');
    if ( fld.indexOf('|') == -1 )
    {
        var obj = eval('opener.document.'+opener.FRM+'.'+fld);
        // Tracker#: 17559 - SAFARI/FIREFOX - UNABLE TO POST MULTIPLE POM CODES TO DETAIL OF POM MODEL, POM ASSOC OFF RFQ
        // Must use getAttribute to get custom attribute.
        if (obj && obj.getAttribute('ro'))
    	{
    		obj.readOnly=false;
    	}
        if (obj && !obj.readOnly)
        {
			if (obj_pos && obj_pos.value != "")
			{
				//Tracker#:16314 AUTO-SUGGEST ISSUES WHEN USING DOUBLE QUOTES
				// Modifying this line as value containing double quotes willnot work - eval('opener.document.'+opener.FRM+'.'+fld+'[' + parseInt(parseInt(obj_pos.value) - 1) + '].value = "'+val+'"');
			    eval('opener.document.'+opener.FRM+'.'+fld+'[' + parseInt(parseInt(obj_pos.value) - 1) + ']').value= val;
			}
			else
			{
			  //Tracker#:16314 AUTO-SUGGEST ISSUES WHEN USING DOUBLE QUOTES
			  // Modifying this line as value containing double quotes willnot work -  eval('opener.document.'+opener.FRM+'.'+fld+'.value = "'+val+'"');
				var obj_fld =   eval('opener.document.'+opener.FRM+'.'+fld);
				obj_fld.value= val;
				opener.cf(obj_fld);
			}
    	}
    }
    else
    {
        var codefield;
        fld = fld + '|';
        val = val + '|';
        var isCodeField = false;
        while (fld.indexOf('|') > -1)
        {
            var f = fld.substring(0,fld.indexOf('|'));
            fld = fld.substring((fld.indexOf('|')) + 1);
            var v = val.substring(0,val.indexOf('|'));
            val = val.substring((val.indexOf('|')) + 1);
            //this logic used only for the hidden code fields for the description fields only
            if(f.indexOf("CODE~") > -1)
            {
               f = replacevalstr(f,"CODE~","");
               isCodeField = true;
            }
            else
            {
               isCodeField = false;
            }

            /* Tracker#: 20723 - SAFARI & FIREFOX: CANNOT POST BACK DATA TO FIRST ROW IN SUPPORT TABLES
             * Issue - First row cells' contents are dynamically wrapped in divs, causing the existing
             * method to find the form inputs unable to find the inputs in first row.
             * Fix - Search entire document for inputs with the specified name instead.
             */
            var inputs = $(opener.document).find('input[name="'+f+'"]').get(),
            	obj = undefined;
        	if (inputs.length > 0)
        	{
        		obj = inputs[0];
        	}

            // Tracker#: 17559 - SAFARI/FIREFOX - UNABLE TO POST MULTIPLE POM CODES TO DETAIL OF POM MODEL, POM ASSOC OFF RFQ
            // Must use getAttribute to get custom attribute.
            // ro is used as an indicator that the field should be read only until focus
            // these fields need to be set readonly false before pushing the value to them
        	if (obj && obj.getAttribute('ro'))
        	{
        		obj.readOnly=false;
        	}
            if (obj && (!obj.readOnly || nCount!= 0))
            {
                if (obj_pos && obj_pos.value != "")
                {
                	obj[ parseInt(obj_pos.value) - 1 ].value = v;
                }
                else
                {
                    obj.value = v;
                }
                opener.cf(obj);
                if (obj.type == 'hidden' && isCodeField)
                {
                	//This should be a code field.
                	codefield = obj;
                }
            }
            nCount++;
        }

        //If code field is hidden do not set description field as changed
        if (codefield)
        {
			if (opener.getval('chgflds') != Blank)
			{
			    opener.cfclearbyname (opener.popupfldhtmlname);
			}
        }

    }

    jax_filter_onChange (opener.popupfldhtmlname);

    self.close();
    //Tracker#21063 - To focus the parent window after closing the child window for Safari browser
    window.opener.focus();
}

/// title freeze function
var nCurPad=3;
var nCurSpac=0;   // should be zero
var nCurBdr=0;    // should be zero
var nExtra = parseInt(nCurPad)+parseInt(nCurSpac)+parseInt(nCurBdr);
var bAdjusttbl = true;
var nWithinaTable = nExtra + 4;  // 4 is the div padding

// internal function to freeze - align two divs and tables
//Tracker#: 15592 - 2010 UI REGRESSION IN SOME OF THE BUILDER SCREENS: COLUMN ALIGNMENT
//Normalized calculations using jQuery.
//Took into account everything dynamically: padding, border
function alignDiv(d1, d2, table1, table2)
{
	// convert to jQuery objects
	var titleCell = $(d1);
	var dataCell = $(d2);
	
	// widths including border and padding
	var titleOuterWidth = titleCell.outerWidth();
	var dataOuterWidth = dataCell.outerWidth();
	
	// get padding, border dynamically since it now varies from screen to screen
	var titleExtra = titleOuterWidth - titleCell.width();
	var dataExtra = dataOuterWidth - dataCell.width();
	
	if (titleOuterWidth > dataOuterWidth)
	{
		dataCell.width( titleOuterWidth - dataExtra );
		titleCell.width( titleCell.width() );
		return titleOuterWidth;
	}
	else if (dataOuterWidth > titleOuterWidth)
	{
		titleCell.width( dataOuterWidth - titleExtra );
		dataCell.width( dataCell.width() );
		return dataOuterWidth;
	}
	else // they are equal; can return either one
	{
		return dataOuterWidth;
	}
}

// set width of an element
function setWidth(obj, nwidth)
{
	if (nwidth > 0)
	{
		obj.style.width = nwidth+"px";
	}
	else
	{
		obj.style.width = "0px";
	}
	
}

// set height of an element
function setHeight(obj, nheight)
{
	if (nheight > 0)
	{
		obj.style.height = nheight+"px";
	}
	else
	{
		obj.style.height = "0px";
	}
}

// sets top position of an element
function setTop(obj, ntop)
{
	//Tracker#: 7082 SCREEN RENDERING ISSUES WHEN USING SAFARI OR FIREFOX.
	//added a check if the obj exists or not
	if(obj)
	{
		obj.style.top = ntop+"px";
	}
}

// sets the left postion of an element
function setLeft(obj, nleft)
{
	//Tracker#: 7082 SCREEN RENDERING ISSUES WHEN USING SAFARI OR FIREFOX.
	//added a check if the obj exists or not
	if(obj)
	{
		obj.style.left = nleft+"px";
	}
}

//internal function to freeze - align the columns and tables
//Tracker#: 15592 - 2010 UI REGRESSION IN SOME OF THE BUILDER SCREENS: COLUMN ALIGNMENT
//Normalized calculations using jQuery.
//Using new internal alignment function:  alignTwoTableColumns
function alignColumns(col1, col2, table1, table2)
{
 var i=0;

 var obj1 = getElemnt(col1+i);
 var obj2 = getElemnt(col2+i);
 var obj3 = getElemnt(table1);
 var obj4 = getElemnt(table2);
 
 // create jQuery objects of tables
 var tbl1 = $(obj3);
 var tbl2 = $(obj4);
 
 // set table widths to auto - having them set to fixed width changes width of cells
 // which throws off calculations
 tbl1.css('width','auto');
 tbl2.css('width','auto');
 
 
 if (obj1 && obj2) // objects exist in search screens, detail sections when no column freeze
 {
	    while(obj1 && obj2)
	    {	
	        i++;
		
		        alignTwoTableColumns(obj1, obj2);
		
	        obj1 = getElemnt(col1+i);
	        obj2 = getElemnt(col2+i);
	    }
 }
 else // column freeze - table cells have no ids
 {
 	// dynamically get the table cells since they don't have ids.
 	// Screens like fiteval have 2 title rows, so
 	// need to take into account col spans.
 	var rows1 = tbl1.children('tbody').children('tr');
 	
 	var rows1Length = rows1.length;
 	// if one row...
 	if (rows1Length == 1)
 	{
  	       	var cells1 = rows1.children('td');
	        var cells2 = tbl2.children('tbody').children('tr:first').children('td');
	         	
	        var numberCells = cells1.length;
	         	
	        for (; i<numberCells; i++) // i already declared
	        {
	             alignTwoTableColumns(cells1.get(i),cells2.get(i));
     	    }
 	}
 	else if (rows1Length == 2) // if two rows - col span possible...
 	{
	    var titleCells1 = rows1.eq(0).children('td');
	    var titleCells2 = rows1.eq(1).children('td');
	    var dataCells = tbl2.children('tbody').children('tr:first').children('td');
	    
	    var numberCells = dataCells.length;
	    // keep track of number of cells aligned in 2nd title row
	    var colSpanCells = 0;
	    
	    for (; i<numberCells; i++) // i already declared
	    {
	    		var topCell = titleCells1.eq(i);
	    		// check for colspan
	    	// if no colspan, use align based on first row cells
	    		var colspan = topCell.attr('colspan')
	    	if (colspan == 1)
	    	{
	    		alignTwoTableColumns(titleCells1.eq(i), dataCells.eq(i));
	    	}
	    	else // there is colspan
	    	{
	    		// loop through all cells in 2nd title row under col span
	    		for (var j=0; j<colspan; j++)
	    		{
	    			alignTwoTableColumns(titleCells2.eq(j+colSpanCells),dataCells.eq(i));
	    			i++;
	    		}
	    		colSpanCells += colspan;
	    	}
	    }
 	}
 	var cells1 = tbl1.children().children('tr:last').children('td');
 	var cells2 = tbl2.children().children('tr:last').children('td');
 	
 	var numberCells = cells1.length;
 	
 	for (; i<numberCells; i++) // i already declared
 	{
 		alignTwoTableColumns(cells1.get(i),cells2.get(i));
 	}
 }
}

//Internal function to alignColumns - align two columns by wrapping contents
//in divs and adjusting width of divs.
function alignTwoTableColumns (d1, d2)
{  
     // convert to jQuery objects
     var titleCell =  $(d1);
     var dataCell =   $(d2);
	
     // widths including border and padding
     var titleOuterWidth = titleCell.outerWidth();   
     var dataOuterWidth =  dataCell.outerWidth();   	
	
     // get padding, border dynamically since it now varies from screen to screen
     var titleExtra = titleOuterWidth - titleCell.width();  
     var dataExtra = dataOuterWidth - dataCell.width();  
     
     if (!alignTwoTableColumns.isCalledOnResize) // wrap cell contents with div
    {
		var divTitle = $('<div></div>');
		var divData = $('<div></div>');
	         
		/* In newer (newest?) version of IE8, the calendar icon and lookup icon are
		*  dropping below the textbox in the same cell.  The width calculated by
		*  jQuery is 1 pixel too small, thus causing the drop.
		*  Fix:  Adding 1px to final width.
		*/
		       if (titleOuterWidth > dataOuterWidth)
			{
				divTitle.width( titleCell.width() + 1 );
				divData.width( titleOuterWidth - dataExtra + 1 );
			}
			else if (dataOuterWidth > titleOuterWidth)
			{
				divTitle.width( dataOuterWidth - titleExtra + 1 );
				divData.width( dataCell.width() + 1 );
			}
			else // widths are the same.  Need to explicitly set the widths so they aren't changed by divs.
			{	 // Example Screen where this happens: Docs & Cond. Model
				divTitle.width(titleOuterWidth - titleExtra + 1);
			divData.width(dataOuterWidth - dataExtra + 1);
			}
	        
		// Wrap divs around contents of both cells
			titleCell.wrapInner(divTitle);
	        	dataCell.wrapInner(divData);
    }
     
}
alignTwoTableColumns.isCalledOnResize = false; // used internally
alignTwoTableColumns.calledOnResize = function (resizeFunc) {
	alignTwoTableColumns.isCalledOnResize = true;
	resizeFunc();
	alignTwoTableColumns.isCalledOnResize = false; // prevent potential side-effects in future calls
};

/* Tracker#: 19105 - REGRESSION SAFARI & FIREFOX: SOURCING SCREEN LOOKUPS HAVE UNNECESSARY SCROLL BARS
*  Unnecessary scrollbars (horizontal & vertical) appearing in search screens as well.
*  Before new alignment code, data table columns were were off by 1 pixel and the
*  data table's width was 1px smaller than it should have been.
*  Now with new alignment code, the columns line up perfectly, meaning the data table's
*  width is 1px wider than before.
*  Need to take into account data table 1px right border when adjusting divs.
**/
// internal function to freeze - adjust the divs after cols have been adjusted
function adjustOuterDivs(topd, bottomd, toptable)
{
    topd = getElemnt(topd);
    bottomd = getElemnt(bottomd);
    toptable = getElemnt(toptable);

    // Create local copy of nCurScrWidth
    var nCurScrWidth = window.nCurScrWidth;

    // expLeft is the width of the left side div
	nCurScrWidth = nCurScrWidth - expLeft;

	//#24789 - Not able to see the full data
	var navAreaWidth = 0;
	if(getElemnt('_divNavArea'))
	{
		navAreaWidth = getElemnt('_divNavArea').offsetWidth;
	}
    if (topd && bottomd && toptable)
    {
        var nCurTableWidth = toptable.offsetWidth;

        /* Tracker#: 21169 - FIREFOX:  COST SUMMARY ROLLUP SCREEN COLLAPSING SECTIONS JS ERRORS & ALTERNATE SECTIONS DISTORTED
         * adjustOuterDivs.ignoreScreenWidth flag indicates whether to fit div width within browser viewport.
         * Don't need to fit div within browser viewport if alternative sections on CSR go off right-side of browser viewport.
         */
        if (adjustOuterDivs.ignoreScreenWidth)
        {
    		/* Tracker#: 20868 - FIREFOX: BILL OF LADING SEARCH SCREEN HAS EXTRA WHITE SPACE
    		 * Issue - scrollHeight cannot be used reliably cross-browser to get height of
    		 * container's contents.
    		 * Fix - Use hasScrollbar function.
    		 */
        	if (hasScrollbar(bottomd,'vertical'))  // there is scroll bar
            {
                if (parseInt(parseInt(nCurTableWidth)+nScrlbar) > nCurScrWidth)  // within the scrollrange
                {
                    topd.style.width = nCurTableWidth - nScrlbar + "px";
                    // Tracker#: 19105 - REGRESSION SAFARI & FIREFOX: SOURCING SCREEN LOOKUPS HAVE UNNECESSARY SCROLL BARS
                    // Need to take into account data table 1px right border.
                    bottomd.style.width = nCurTableWidth + 1 + "px";
                }
                else
                {
                    topd.style.width = nCurTableWidth+"px";
                    // Tracker#: 19105 - REGRESSION SAFARI & FIREFOX: SOURCING SCREEN LOOKUPS HAVE UNNECESSARY SCROLL BARS
                    // Need to take into account data table 1px right border.
                    bottomd.style.width = nCurTableWidth + nScrlbar + 1 + "px";
                }
            }
            else
            {
                topd.style.width = nCurTableWidth+"px";
                bottomd.style.width = nCurTableWidth + 1 + "px"; // added 1 pixel to prevent scrollbar due to border on add container screen
            }
            bAdjusttbl = false;
        }
        else
        {
            if (nCurTableWidth < nCurScrWidth)  // table is smaller than the screen
            {
                /* Tracker#: 20868 - FIREFOX: BILL OF LADING SEARCH SCREEN HAS EXTRA WHITE SPACE
                 * Issue - scrollHeight cannot be used reliably cross-browser to get height of
                 * container's contents.
                 * Fix - Use hasScrollbar function.
                */
                if (hasScrollbar(bottomd,'vertical'))  // there is scroll bar
                {
                    if (parseInt(parseInt(nCurTableWidth)+nScrlbar) > nCurScrWidth)  // within the scrollrange
                    {
                        topd.style.width = nCurTableWidth - nScrlbar + "px";
                        // Tracker#: 19105 - REGRESSION SAFARI & FIREFOX: SOURCING SCREEN LOOKUPS HAVE UNNECESSARY SCROLL BARS
                        // Need to take into account data table 1px right border.
                        bottomd.style.width = nCurTableWidth + 1 + "px";
                    }
                    else
                    {
                        topd.style.width = nCurTableWidth + "px";
                        // Tracker#: 19105 - REGRESSION SAFARI & FIREFOX: SOURCING SCREEN LOOKUPS HAVE UNNECESSARY SCROLL BARS
                        // Need to take into account data table 1px right border.
                        bottomd.style.width = nCurTableWidth + nScrlbar + 1 + "px";
                    }
                }
                else
                {
					//Tracker#24769 - Reducing navAreaWidth if the tablewidth exceeding the screen width
					if(getElemnt('_divNavArea') && nCurTableWidth > (nCurScrWidth - navAreaWidth))
					{
						topd.style.width = nCurTableWidth - navAreaWidth + "px";
						bottomd.style.width = nCurTableWidth - navAreaWidth + 1 + "px";
					}
					else
					{
						topd.style.width = nCurTableWidth + "px";
						bottomd.style.width = nCurTableWidth + 1 + "px"; // added 1 pixel to prevent scrollbar due to border on add container screen
					}
                }
                bAdjusttbl = false;
            }
            else
            {
				/* Tracker#: 20868 - FIREFOX: BILL OF LADING SEARCH SCREEN HAS EXTRA WHITE SPACE
                 * Issue - scrollHeight cannot be used reliably cross-browser to get height of
                 * container's contents.
                 * Fix - Use hasScrollbar function.
                 */
                if (hasScrollbar(bottomd,'vertical'))         // there is a vertical scroll
                {
                    if((nCurScrWidth - nScrlbar - nWithinaTable)>=0)
                    {
                    	//Tracker#: 26400 - PACKING LIST WITH ONE DETAIL ROW DISPLAYS LAST COLUMN PARTIALLY
                    	var scw = getScrollBarWidth();
                    	
                        // reduce the title div width by scrollbar + the padding etc on table
                        topd.style.width = nCurScrWidth - scw - nWithinaTable - navAreaWidth + "px";
                    }
					if((nCurScrWidth - nWithinaTable)>=0 && getElemnt('_divNavArea'))
					{
						bottomd.style.width = nCurScrWidth - nScrlbar - nWithinaTable - navAreaWidth + "px";
					}
                    else if((nCurScrWidth - nWithinaTable)>=0)
                    {
                        // reduce the data div width by scrollbar + the padding etc on table
                        bottomd.style.width = nCurScrWidth - nWithinaTable - navAreaWidth + "px";
                    }
                }
                else    // if there is no vertical scroll
                {
					//#24789 - Not able to see the full data in validationfilterreport screen
					if((nCurScrWidth - nWithinaTable)>=0 && getElemnt('_divNavArea'))
                    {
                        topd.style.width = nCurScrWidth - nWithinaTable - navAreaWidth - nScrlbar + "px";
                        bottomd.style.width = nCurScrWidth  - nWithinaTable - navAreaWidth - nScrlbar + "px";
                    }
                    else if((nCurScrWidth - nWithinaTable)>=0)
                    {
                        topd.style.width = nCurScrWidth - nWithinaTable + "px";
                        bottomd.style.width = nCurScrWidth  - nWithinaTable + "px";
                    }
                    bottomd.style.height = bottomd.offsetHeight + nScrlbar + "px";
                }
                bottomd.style.height = bottomd.offsetHeight + nScrlbar + "px";

            }
        }
    }

}

// align two tables
function alignTables(a, b)
{
    var obj1 = getElemnt(a);
    var obj2 = getElemnt(b);
    if (obj1 && obj2)
    {
        d1w = obj1.offsetWidth;
        d2w = obj2.offsetWidth;
    //    alert("d1w " + d1w + " d2w " + d2w + " nExtra" + nExtra )

        if (d1w > d2w)
        {
            setWidth(obj1, d1w);
            setWidth(obj2, d1w);
        }
        else if(d2w > d1w)
        {

            setWidth(obj1, d2w);
            setWidth(obj2, d2w);
        }
    }
}


// align two tables
function alignHeight(obj1, obj2)
{
    if (obj1 && obj2)
    {
        d1w = obj1.offsetHeight;
        d2w = obj2.offsetHeight;

        if (d1w > d2w)
        {
	   setHeight(obj1, d1w);
            setHeight(obj2, d1w);
        }
        else if(d2w > d1w)
        {
            setHeight(obj1, d2w);
            setHeight(obj2, d2w);
        }
    }
}

// align two tables
function alignWidth(obj1, obj2)
{
    if (obj1 && obj2)
    {
        d1w = obj1.offsetWidth;
        d2w = obj2.offsetWidth;

        if (d1w > d2w)
        {
            setWidth(obj1, d1w);
            setWidth(obj2, d1w);
        }
        else if(d2w > d1w)
        {

            setWidth(obj1, d2w);
            setWidth(obj2, d2w);
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
    
    // Tracker#: 15592 - 2010 UI REGRESSION IN SOME OF THE BUILDER SCREENS: COLUMN ALIGNMENT
    // Unique case where div width is initially smaller than table width, and div
    // width refuses to expand to be same width as table.  This causes
    // div to artificially force the table to have the same (smaller) width as the div.
    // Occurs in search users screen.
    // Not sure why this happens, but accounting for it.
    //var initialDataDivWidth = ddobj.style.width; // Initial width value to restore after adjusting tables
    if (ddobj)
    {
    	ddobj.style.width = dtobj.offsetWidth * 2 + "px"; // Make the div much wider than table. How much is arbitrary.
    }

    // align columns and tables
    alignColumns(title_id, data_id, title_table, data_table);
    
    // Restore data div width
    //ddobj.style.width = initialDataDivWidth+"px";
    
    // Set the amount space left of the table that is taken up by padding,border,margins
    if (dtobj)
    {
    	expLeft = $(dtobj).position().left;
    }

        // align divs which holds the tables
        adjustOuterDivs(title_div, data_div , title_table);
}

// expand the details grid based on blank space left adter printing the whole page
var expData = 'DATA_DIV';
//Tracker#: 14428 IE8 ISSUE:  SOME SCREENS HAVE UNNECESSARY SCROLL BARS
//Added a constant for the data table.
var expTableData = 'DATA_TABLE';
var expTitle = 'TITLE_DIV';
var expLeft = 0;
var bOnce = false;

function expandtl(isSourcingQueryViewer)
{
	//expData could be DATA_DIV or DATA_DIV2
	var dataobj = getElemnt(expData);

	if (!dataobj)    // return if the data does not exist for expand
	{
	    return;
	}
	
	var $dataobj = $(dataobj),
		titleobj = getElemnt(expTitle),
		nCurHgt = dataobj.offsetHeight,
		nCurWth = dataobj.offsetWidth,
		/* 
		 * scrollHeight != height of container's contents in non-IE
		 * browsers; scrollHeight == height of container when there is no vertical scrollbar.
		 */
		curChildHeight = $dataobj.children().eq(0).height(),
		nCurScrlWth = dataobj.scrollWidth;

	var topx = 0;

	if (bMenuExists)
		topx+=getElemnt('TSSMENU').offsetHeight
	if (bIconsExists)
		topx+=getElemnt('TSSICON').offsetHeight

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

	topx+=getElemnt(expTitle).offsetHeight

	// set the with of the title div (title for both sections left and right)
	if (getElemnt('LOCK_TITLE'))    // title in col freeze is a seperate table
	{
        topx+=getElemnt('LOCK_TITLE').offsetHeight
        setWidth(getElemnt('LOCK_TITLE'), parseInt(td1obj.offsetWidth) + parseInt(td2obj.offsetWidth))
	}

	topx+=18


	if (bMsgExists)
		topx+=getElemnt('TSSMSG').offsetHeight


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
    var lockdiv= getElemnt("LOCK");
	if (lockdiv.offsetWidth < lockdiv.scrollWidth)
        topx+=nScrlbar;

	var nLeft = nCurScrHeight - topx - nCurPad - 4;

	//#24760 - for screen title print
	if(getElemnt('SCREEN_TITLE'))
	{
		nLeft -= getElemnt('SCREEN_TITLE').offsetHeight;
	}

	if (isSourcingQueryViewer)
    {
    	var listActionLinks = getElemnt('LIST_ACTION_LINKS');
    	if (listActionLinks)
    	{
    		nLeft -= $(listActionLinks).height(); 
    	}
    	//Tracker#21063 - Deducting the copyright height from total div so the scrollbar will not go under copyright bar.
    	if(lockdiv && getElemnt("TSSBOT"))
    	{
    		lockdiv.style.height = lockdiv.offsetHeight - (getElemnt("TSSBOT").offsetHeight) + "px";
    	}
    }

	// nLeft is the area left below the hdr information
	if (nLeft - 200 > 0)
	{
        if (nCurScrlWth > nCurWth)
        {
            curChildHeight+=nScrlbar;
        }

		if (nLeft > curChildHeight)
		{
			nLeft = curChildHeight;
		}

		setHeight(getElemnt(expData), nLeft);

		//Tracker#: 14428 IE8 ISSUE:  SOME SCREENS HAVE UNNECESSARY SCROLL BARS
		//Check for IE8. If it is IE8 and the height of the data div and the data table are same then
		//hide the scroll bar else show it.
		//removing the less than equal to check and putting equal to check.
		//If the window is resized then the scroll should appear according to the size of the main window. Added a check
		//for that. Added a check for the width also so that on resize the scroll comes back
		if(IEVer == 8 && getElemnt(expTableData) && dataobj)
		{
			tableDataObj = getElemnt(expTableData);
			if(tableDataObj.offsetHeight ==  dataobj.offsetHeight)
			{
				dataobj.style.overflow="hidden";
			}
			else if((tableDataObj.offsetHeight >  dataobj.offsetHeight) || (tableDataObj.offsetWidth > dataobj.offsetWidth))
			{
				dataobj.style.overflow="auto";
			}
		}

	}

	//#24095 - getting offsetWidth of left Nav
	var navAreaWidth = 0;
	if(getElemnt('_divNavArea'))
	{
		navAreaWidth = getElemnt('_divNavArea').offsetWidth;
	}

    var nWidth = dataobj.offsetWidth;
	// check to see if there was a scroll and now there is none then adjust the width
	//alert(curChildHeight +' > ' +  nCurHgt);
	if (curChildHeight > nCurHgt)
	{
		var newScrlHgt = dataobj.scrollHeight;
		var newHgt = dataobj.offsetHeight;
		/* Tracker#: 20868 - FIREFOX: BILL OF LADING SEARCH SCREEN HAS EXTRA WHITE SPACE
		 * Issue - scrollHeight cannot be used reliably cross-browser to get height of
		 * container's contents.
		 * Fix - Use hasScrollbar function.
		 */
		// make it equal to the title div if there is no vertical scrolling
		if (!bOnce && (newScrlHgt == newHgt || !hasScrollbar(dataobj, 'vertical') ))
		{
			setWidth(dataobj, parseInt(nWidth - nScrlbar))
			bOnce = true;
		}

	}


    if (lockdiv.offsetHeight < lockdiv.scrollHeight)  // if lock has scrolling then reduce the width by scrollbar
    {
		//alert("nWidth " + nWidth + "\n nCurScrWidth-nScrlbar "  + parseInt(nCurScrWidth-nScrlbar) );
        //if the detail section is well with in the screen then
        // don't set the div width to accomodate the scroll bar.
        if(nWidth>=(nCurScrWidth-expLeft-nScrlbar))
		{
			setWidth(dataobj, parseInt(nWidth - nScrlbar - navAreaWidth));
            setWidth(getElemnt(expTitle), parseInt(getElemnt(expTitle).offsetWidth) - nScrlbar - navAreaWidth);
            if (getElemnt('LOCK_TITLE'))    // title in col freeze is a seperate table
            {
                setWidth(getElemnt('LOCK_TITLE'), parseInt(td1obj.offsetWidth) + parseInt(td2obj.offsetWidth))
            }

        }
    }

    lockAdjust();
}

// close the msg - and move the main div 'LOCK' up
function closemsg()
{
	var nmsgHgt = getElemnt('TSSMSG').offsetHeight;
	var obj = getElemnt('LOCK');
	obj.style.top = parseInt(obj.style.top) - nmsgHgt - 2 + "px";
	setHeight(obj, parseInt(obj.offsetHeight + nmsgHgt + 2))
	bMsgExists = false;
	hide('TSSMSG');
	resetChgFldsOnMsgClose = true;
    if (nTotalLvl > 0)
	    expandtl();
}


// create a new div with provided properties
function DOMWindow(text, idn, fs, bdrclr, bgclr)
{
    var aln = "left"
	if(text.indexOf("images/p.gif") !== -1) aln = "center"
	var rtn = CreateLocalDiv("<center><table><tr><td nowrap style='font-size:"+fs+";padding:10px;background:"+bgclr+";text-align:"+aln+"'>"+text+"</td></tr></table></center>", idn)
	rtn.style.backgroundColor = bdrclr
	rtn.style.visibility = "visible"
	rtn.style.padding= "1px 1px 1px 1px"
    return rtn;

}

// create a new div with provided properties
function processingWindow()
{
    var rtn = CreateLocalDiv("<img src='images/p.gif' border='0'>", "proc")
	rtn.style.visibility = "visible"
    return rtn;
}


function CreateLocalDiv(text, idn)
{
    var winBody = document.createElement("DIV");

    winBody.id = idn;
    winBody.style.position = "absolute"
    winBody.innerHTML = text;

    return winBody

}

//Tracker#:17904 SECURITY ON RECENTLY VIEWED AND FAVORITES 
//to close processing bar onclick of the favorites 
//or recently viewed for the plm documents.
function closewaitWindow()
{
	var waitW= getElemnt("proc");
	if(waitW)
	{
		waitW.parentNode.removeChild(waitW);
	}
}

// wait window once user submit the page
function waitWindow()
{
	var winW = (window.innerWidth ? window.innerWidth : document.documentElement.clientWidth);
	var winH = (window.innerHeight ? window.innerHeight : document.documentElement.clientHeight);
	/*
	 * Tracker#:20060 process bar is needed while opening multi pom windows. 
	 * Adding scrollTop to processing bar top calculation so that if user scrolls down window,
	 * so that processing bar would be visible.
	 */
	var winScrlTop = document.body.scrollTop;
	var waitW = new processingWindow();
	document.body.appendChild(waitW);
	setZValue(waitW,10000);
    var y = waitW.style.top = parseInt(winH/2)+winScrlTop - (waitW.offsetHeight/2) + "px";
    var x = waitW.style.left = parseInt(winW/2) - (waitW.offsetWidth/2) + "px";
    var h = waitW.offsetHeight;
    var w = waitW.offsetWidth;


}

// show msg on the screen after processing user request.
function showMsg(msg)
{
	showMsg2(msg, true);
}

//show msg on the screen after processing user request.
function showMsg2(msg, bClose)
{
	showMsg3(msg, bClose, 'closeMsg()');
}

// show msg on the screen after processing user request.
// bClose whether user wants the close link at the bottom of the msg or not.
// fnClose the method used to close the message div
function showMsg3(msg, bClose, fnClose)
{
    showMsg4(msg, bClose, fnClose, false);
}


function showMsg4(msg, bClose, fnClose, bProcessingWithMsg)
{
	var winW = document.body.clientWidth;
	var winH = document.body.clientHeight;
	
    // Tracker#: 24131
    // The clientHeight reading is incorrect if we have showmsg is being shown from a popup.
    // This was a regression when we included the <!DOCTYPE html> tag in jsps
    // Ex: sizeoffassoc.jsp @see addshippack
    // Add this only if JQuery js has been loaded if not go with regular one.
    if(window.jQuery)
    {
        winH = $(window).height();
    }

	var waitW = getElemnt('showMsg');
	if (waitW)
	{
	    eval('document.'+FRM+'.removeChild(waitW)');
	}

	if (bClose)
	{
	    msg+='<table width=100%><tr><td><center><a href="#" onClick="'+fnClose+'">' + szMsg_Close + '</a></center></td></tr></table>';
	}

	if (bProcessingWithMsg)
    {
        waitW = CreateLocalDiv(msg, "showMsg");
    }
    else
    {
        waitW = new DOMWindow(msg , "showMsg", "10pt", "#006699", "#FFFFFF")
    }

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

    waitW.style.top = parseInt(winH/2) - (waitW.offsetHeight/2) + "px";
    waitW.style.left = parseInt(winW/2) - (waitW.offsetWidth/2) + "px";


    setZValue(waitW,++cur_z);

}

function closeMsg()
{
    enable=true;
    var waitW = getElemnt("showMsg");
    if (waitW)
	{
	    eval('document.'+FRM+'.removeChild(waitW)');
	}
}

// same as getobj - will be removed later on
function getjsobj(fld)
{
   return eval('document.'+FRM+'.'+fld)
}

// remove a child elemt from its parent
function removechld(parnt, chld)
{
    getElemnt(parnt).removeChild(getElemnt(chld));
}


// check the checkbox of current seleted row.
function sr(row, secid, ele)
{
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

    if (row == nCurRow || parseInt(row) < 0)
    {  // return if on the same row
    	selectedElement = ele;
        return;
    }
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

	selectedElement = ele;
}

// to focus on the detail line upon return from association etc
function srf(row)
{
    var obj = getobj('R');
    if (obj && (typeof obj.length) != 'undefined') // array
    {
        for (var k=0; k < obj.length; k++)
        {
            var curCheckBox = obj[k];
            if (curCheckBox.value == row)
            {
                curCheckBox.focus();
            }
        }
    }
    else if (obj)
    {
        obj.focus();
    }
}

// hold the current selected row object in the repeating table.
var HLRObj = '';

function HLRow(row, tobj)  // highlight row
{
    if (tobj == null || tobj == 'undefined')
    {
        return;
    }

    tr_len = tobj.getElementsByTagName("tr").length
    for (i = 0; i < tr_len; i++)
    {
        var trobj = tobj.getElementsByTagName("tr").item(i);
        if (i == row)
        {
            trobj.style.background = szClrdRow;
            HLRObj = trobj;
            break;
        }
    }
    nCurRow = row;  // need tp set this else lookups wont work
}

//Tracker#:19122 IMPLEMENT NEW CHANGE TRACKING UI FOR SOURCING SCREENS
//Added a new method to be invoked from RFQ > Item Materials > ChangeTracking button
function submitUrlWithDVId(url, szLevel, parentDocViewId)
{
    if (parentDocViewId != null && parentDocViewId != '' && typeof(parentDocViewId) != 'undefined'
            && parentDocViewId != 'undefined')
    {
        url += "&parentDocViewId=" + parentDocViewId;
    }

    submitUrl2(url, szLevel, "Y");
}

// direct call to a url  - location.href
function submitUrl(url, szLevel)
{
    submitUrl2(url, szLevel, "Y");
}

//szAdd2Url will determine whether we will add the 'attachparam to the url or not.
function submitUrl2(url, szLevel, szAdd2Url)
{
	if (bDisableMenu)
    {
        return;
    }
    var act = 'dummy'; // temp holder to see if there are any changes

    if (bCheck4Changes)
    {
        act = hasChanged(act)
    }

    if (act == 'save' || act == 'massupdate' || act == szSAVE)
    {
		fsubmit(act);
        return;
    }

    if ( szAdd2Url == 'Y' && !isValidRecord("URL", "N") )
    {
        return;
    }

    if (szAdd2Url == 'Y')
    {
        url = url + '&JS_CONFIRM_DIALOG=' + getval('JS_CONFIRM_DIALOG') + szAttachParam;
    }

    var attachparam = '&rows=';

    if (szLevel == 'H' || ( szLevel.indexOf('H') != -1 && nCurRow == -1 ) )
    {
		if (szAdd2Url == "Y")
        {
            url = url + attachparam + '-1'; //indicates header
        }
        //Tracker#24787 - To submit the admin screen with ajax call
		if(isAdminCall)
		{
			submitFormWithAjaxCall(url);
			return;
		}
		waitWindow();
        disableLinks();        

        location.href = url

        return;
    }

    var obj = getobj('R');
    var nChecked = 0;
    if( (typeof(levelId) == 'undefined') || levelId == null || levelId.length ==0 ) levelId = "-1";

    if(levelId == 1 && checkForBodyLevel == true)
    {
		attachparam += nCurRow;
		if(isAdminCall)
		{
			url = url + attachparam + '&lvl=' + szLevel + '&levelId=' + levelId;
			submitFormWithAjaxCall(url);
			return;
		}
        waitWindow();
        disableLinks();
        location.href = url + attachparam + '&lvl=' + szLevel + '&levelId=' + levelId;
    }
    else
    {
    if (obj)
    {
        // only one check box
        if ((typeof obj.length) == 'undefined')
        {
            if (obj.checked == true)
            {
                if (isGoingToAssoc(url))
                {
                    attachparam+=ar[obj.value];
                }
                else
                {
                    attachparam+=obj.value;
                }
                nChecked = 1;
            }
        }
        else     // multiple check boxes
        {
            for (i=0; i < obj.length; i++)
            {
                if (obj[i].checked == true)
                {
                    if (i > nLastValidDtl)
                    {
                        alert(szMsg_Invalid_Dtl_Rec);
                        return;
                    }
                    if (contains(brn, i))
                    {
                        alert(szMsg_Blank_Dtl_Rec);
                        return;
                    }

                    if ( nChecked >= 1 ) attachparam += ',';

                    if (isGoingToAssoc(url))
                    {
                        attachparam+=ar[obj[i].value];
                    }
                    else
                    {
                        attachparam+=obj[i].value;
                    }
                    nChecked++;
                }
            }
        }

        if (nChecked == 0)
        {
            if (szLevel == 'DS' || szLevel == 'BS' || szLevel == 'SS')
            {
                alert(szMsg_Sel_Row);         // nothing is selected for one row

            }
            else if (szLevel == 'DM' || szLevel == 'BM' || szLevel == 'SM')
            {
                alert(szMsg_Sel_M_Row);     // nothing is selected for multiple rows
            }
            else if(szLevel == 'HDS' && levelId == -1)
            {
				//Added this code as a part of tracker 9459
                //click on any look up and close the look up window without selecting any data. select the association which has level as 'HDS', then system was not responding
                //now the following code fixes the issue
                attachparam += '-1';
				if(isAdminCall)
				{
					url = url + attachparam + '&lvl=' + szLevel + '&levelId=' + levelId;
					submitFormWithAjaxCall(url);
					return;
				}
                waitWindow();
                disableLinks();
                location.href = url + attachparam + '&lvl=' + szLevel + '&levelId=' + levelId;
            }
        }
        else if (nChecked > 1 && (szLevel == 'DS' ||
                                  szLevel == 'BS' ||
                                  szLevel == 'SS' ||
                                  szLevel == 'HBS' ||
                                  szLevel == 'HDS' ||
                                  szLevel == 'HSS' ||
                                  szLevel == 'BSDS' ||
                                  szLevel == 'BSSS' ||
                                  szLevel == 'DSSS' ||
                                  szLevel == 'HBSDS' ||
                                  szLevel == 'HBSSS' ||
                                  szLevel == 'BSDSSS' ||
                                  szLevel == 'HBSDSSS'
                                  )
                )  // more than one row selected
        {
            alert(szMsg_Sel_A_Row);
        }
        else if (attachparam != '&rows=')
        {
			if(isAdminCall)
			{
				url = url + attachparam + '&lvl=' + szLevel + '&levelId=' + levelId;
				submitFormWithAjaxCall(url);
				return;
			}
            waitWindow();
            disableLinks();
           location.href = url + attachparam + '&lvl=' + szLevel + '&levelId=' + levelId;
    }
        }
    }
}

//Tracker#24787 - To submit the admin screen with ajax call
function submitFormWithAjaxCall(actionUrl)
{
	//For dashboard link
	if(actionUrl == "dash.do?tabClicked=admin")
	{
		location.href = actionUrl;
		return;
	}
	waitWindow();
	var htmlObj = 
		$.ajax({
			type: "POST",
			url: actionUrl,
			cache: false,
			success: function(responseText)
			{	
				var div = document.getElementById('LOCK');
				$(div).html(htmlObj.responseText);
				$(div).css('padding-left','0px');				
				closewaitWindow();
				if(document.forms[0])
				{
					if(document.forms[0].chgflds)
					{
						setval('chgflds', '');
					}
					if(document.forms[0].chgfldsL)
					{
						setval('chgfldsL', '');
					}
				}
			}
		});
}

// this methods check the url if it is being directed to an association from base document.
function isGoingToAssoc(url)
{
    if (ar.length > 0 && url.indexOf('method=view') &&
        (url.indexOf('notes.do?') >=0
        || url.indexOf('attach.do?') >=0
        || url.indexOf('event.do?') >=0
        || url.indexOf('cost.do?') >=0
        || url.indexOf('ordersplit.do?') >=0
        || url.indexOf('size.do?') >=0
        || url.indexOf('sendto.do?') >=0
        || url.indexOf('dc.do?') >=0
        || url.indexOf('allocation.do?') >=0
        || url.indexOf('adjustment.do?') >=0))
    {
        return true;
    }
    return false
}


// method mainly used on search screen
function sa(act)     // search all button action on search screens
{
    var url = act + '&doc_view_id=' + getval('doc_view_id');
    submitFrmAction(url);
}

function ss(act)     // search button action on search screens
{
    setval('method', act);
    waitWindow();
}

/**
    Tracker#: 13528 CHANGE THE NAVIGATION(MENU) ALL SEARCH SCREENS TO BE SIMILAR TO DESIGN CENTER MODULE
    @since v2009: r4
*/
function ssNew(act)
{
    ss(act);
    // Since all the Serach html submit type buttons have been
    // replaced with tables matching look-n-feel of
    // a button, need to force the form to be submitted.
    eval('document.'+FRM+'.submit()');
}


// this method will use the current form action to create and call the url
// ie if action is 'order.do' then the url will be 'order.do?method=szMethod'
function submitFrmAction(szMethod)
{
    var form = eval('document.'+FRM); 
    //Tracker#:14918  ABILITY TO TURN OFF TYPEAHEAD IN PLM 
    //Passing parameter 'pbf' RETURN_FIELD value while submitting.
    var url ='';
	var pbfVar = form.pbf; 
	if(pbfVar!=null && pbfVar != 'undefined')
	{
		 url=eval('document.'+FRM+'.action') + '?method=' + szMethod +'&pbf='+ pbfVar.value;
	}
	else
	{	
   	 	 url=eval('document.'+FRM+'.action') + '?method=' + szMethod ;
   	}
    waitWindow();
    disableLinks();
    location.href = url
}


// custom process url to open in existing window.
function cp_w(url, parentDocViewId)
{

    if (bDisableMenu)
    {
        return;
    }

    //Tracker#:19122 IMPLEMENT NEW CHANGE TRACKING UI FOR SOURCING SCREENS
    //Display error message if the Change Tracking button is clicked in case of Create New flow
    if (!bRecordExists)
    {
        alert(szMsg_Invalid_Rec);    // not a valid records
        return false;
    }

    var act = 'dummy'; // temp holder to see if there are any changes
    act = hasChanged(act)
    if (act == 'save' || act == 'massupdate')
    {
        fsubmit(act);
        return;
    }

    //Append the parentDocViewId to the url in case present
    if (parentDocViewId != null && parentDocViewId != '' && typeof(parentDocViewId) != 'undefined'
            && parentDocViewId != 'undefined')
    {
        url += "?parentDocViewId=" + parentDocViewId;
    }

    location.href = url;   // call the url on the current window.
}

// custom process to be open in the new window
function cp_nw(url)
{
    cp_nw(url, false);
}

// custom process to be open in the new window
function cp_nw(url, fullscr)
{
    if (bDisableMenu)
    {
        return;
    }
    var act = 'dummy'; // temp holder to see if there are any changes
    act = hasChanged(act)
    if (act == 'save' || act == 'massupdate')
    {
        fsubmit(act);
        return;
    }

    var nWindow;

    // opens up a new window
    if (fullscr)
    {
    	window.open(url, 'newW','toolbar=yes,menubar=yes,scrollbars=yes,resizable=yes,location=no,screenX=0,screenY=0,left=0,top=0,width='+screen.availWidth+',height='+screen.availHeight)
    }
    else
    {
        window.open(url, 'newW','toolbar=yes,menubar=yes,scrollbars=yes,resizable=yes,width=500,height=400')
    }
}

// function to forward to registertoken, to allow link from field to create token from information in current row (or header)
function token(url,app)
{
  var plm;
  // check if coming from a plm page, as we need to know this to get the BO from the correct session object.
  if (typeof(FRM) != 'undefined' && FRM=='frmPLM')
  {
	  plm=true;
  }
  else 
  {
	  plm=false;
  }
  var url;
  if (typeof (app) == 'undefined')
  {
	  url = 'registertoken.do?method=registerfromui&url='+url+'&row='+nCurRow+'&plm='+plm;
  }
  else
  {
	  url = 'registertoken.do?method=registerfromui&url='+url+'&row='+nCurRow+'&cs='+app+'&plm='+plm;
  }
  openWin(url,600,500);
}
 

// quick view of a screen - ie offer screen link on request
function qview(id)
{
  var url = 'quickview.do?id='+id+'&rows='+nCurRow;
  openWin(url,600,500);
}
//aid=associ id, id=pageview id, lvl=parent level at which assoc is belongs
function qviewa(aid,id,lvl)
{
    qviewa2(aid,id,lvl,-1)
}

// ability to pass the parent row if the link is not the dtl line of a screen
function qviewa2(aid,id,lvl,parent_row)
{
  var url = 'quickview.do?assoc_id='+aid+'&id='+id+'&rows='+nCurRow+'&level='+lvl+"&parent_row="+parent_row;
  openWin(url,700,600);
}

//called in header div's onclick
function r()
{
    nCurRow = -1;
    unselectAll('R');
    if (getobj('RT'))
        getobj('RT').checked = false;

}

// multiply two element values and put the result in third element
function multiply(a, b, c)
{
    var oa = getobj(a);
    var ob = getobj(b);
    var oc = getobj(c);

    if (oa && ob && oc)
    {
        oaVal = replaceval(oa, CommaDelimiter, "");
        obVal = replaceval(ob, CommaDelimiter, "");
        if(Decimal != ".") {
    		oaVal = replacevalstr(oaVal, Decimal, ".");
    		obVal = replacevalstr(obVal, Decimal, ".");
    	}
        if (oaVal != '' && obVal != '' && !isNaN(oaVal) && !isNaN(obVal))
        {
            oc.value = oaVal * obVal;
            cf(oc);
        }
    }
}

// divide two element values and put the result in third element
function divide(a, b, c)
{
    var oa = getobj(a);
    var ob = getobj(b);
    var oc = getobj(c);

    if (oa && ob && oc)
    {
        oaVal = replaceval(oa, CommaDelimiter, "");
        ocVal = replaceval(oc, CommaDelimiter, "");
		if(Decimal != ".") {
    		oaVal = replacevalstr(oaVal, Decimal, ".");
    		ocVal = replacevalstr(ocVal, Decimal, ".");
    	}
        if (oaVal != '' && ocVal != '' && ocVal != 0 && !isNaN(oaVal) && !isNaN(ocVal))
        {
            ob.value = ocVal/oaVal;
            cf(ob);
        }
    }
}

//adjust the main 'LOCK' on onresize
function adjLOCK()
{
    var topx = 0;
    var obj = "";

    if ( bMenuExists )
    {
        obj = getElemnt('TSSMENU');
        if (obj)
	        topx+=obj.offsetHeight;

        obj = getElemnt('TSSICON');
        if (obj)
	        topx+=obj.offsetHeight;

    }

    if ( bMsgExists )
    {
        obj = getElemnt('TSSMSG');
        if (obj)
	        topx+=obj.offsetHeight;

    }
    if ( bDisplayCopyRightAlways )
	    topx+=18;


    obj = getElemnt('LOCK');
	if (obj)
	{
        setHeight(obj, parseInt(nCurScrHeight-topx));
        setWidth(obj, nCurScrWidth);
        //Tracker#24788 - To reduce the left navigation width for admin tab while resizing the screen
		if(getElemnt('_divNavArea'))
        {
        	setWidth(obj, nCurScrWidth - getElemnt('_divNavArea').offsetWidth);
        }
    }

    if ( bDisplayCopyRightAlways )
    {
	    obj = getElemnt('TSSBOT');
	    if (obj)
	        setTop(obj, parseInt(nCurScrHeight-18));
	}
}


// function to manupulate the select element
function selectUnselectMatchingOptions(obj,regex,which,only){if(window.RegExp){if(which == "select"){var selected1=true;var selected2=false;}else if(which == "unselect"){var selected1=false;var selected2=true;}else{return;}var re = new RegExp(regex);for(var i=0;i<obj.options.length;i++){if(re.test(obj.options[i].text)){obj.options[i].selected = selected1;}else{if(only == true){obj.options[i].selected = selected2;}}}}}
function selectMatchingOptions(obj,regex){selectUnselectMatchingOptions(obj,regex,"select",false);}
function selectOnlyMatchingOptions(obj,regex){selectUnselectMatchingOptions(obj,regex,"select",true);}
function unSelectMatchingOptions(obj,regex){selectUnselectMatchingOptions(obj,regex,"unselect",false);}
function sortSelect(obj){var o = new Array();if(obj.options==null){return;}for(var i=0;i<obj.options.length;i++){o[o.length] = new Option( obj.options[i].text, obj.options[i].value, obj.options[i].defaultSelected, obj.options[i].selected) ;}if(o.length==0){return;}o = o.sort(
function(a,b){if((a.text+"") <(b.text+"")){return -1;}if((a.text+"") >(b.text+"")){return 1;}return 0;});for(var i=0;i<o.length;i++){obj.options[i] = new Option(o[i].text, o[i].value, o[i].defaultSelected, o[i].selected);}}
function selectAllOptions(obj){for(var i=0;i<obj.options.length;i++){obj.options[i].selected = true;}}
function moveSelectedOptions(from,to){	if(arguments.length>3)	{var regex = arguments[3];if(regex != ""){unSelectMatchingOptions(from,regex);}}for(var i=0;i<from.options.length;i++){var o = from.options[i];if(o.selected){to.options[to.options.length] = new Option( o.text, o.value, false, false);}}for(var i=(from.options.length-1);i>=0;i--){var o = from.options[i];if(o.selected){from.options[i] = null;}}if((arguments.length<3) ||(arguments[2]==true)){	sortSelect(from);sortSelect(to);}from.selectedIndex = -1;to.selectedIndex = -1;}
function copySelectedOptions(from,to){var options = new Object();for(var i=0;i<to.options.length;i++){options[to.options[i].value] = to.options[i].text;}for(var i=0;i<from.options.length;i++){var o = from.options[i];if(o.selected){if(options[o.value] == null || options[o.value] == "undefined" || options[o.value]!=o.text){to.options[to.options.length] = new Option( o.text, o.value, false, false);}}}if((arguments.length<3) ||(arguments[2]==true)){sortSelect(to);}from.selectedIndex = -1;to.selectedIndex = -1;}
function moveAllOptions(from,to){selectAllOptions(from);if(arguments.length==2){moveSelectedOptions(from,to);}else if(arguments.length==3){moveSelectedOptions(from,to,arguments[2]);}else if(arguments.length==4){moveSelectedOptions(from,to,arguments[2],arguments[3]);}}
function copyAllOptions(from,to){selectAllOptions(from);if(arguments.length==2){copySelectedOptions(from,to);}else if(arguments.length==3){copySelectedOptions(from,to,arguments[2]);}}
function swapOptions(obj,i,j){var o = obj.options;var i_selected = o[i].selected;var j_selected = o[j].selected;var temp = new Option(o[i].text, o[i].value, o[i].defaultSelected, o[i].selected);var temp2= new Option(o[j].text, o[j].value, o[j].defaultSelected, o[j].selected);o[i] = temp2;o[j] = temp;o[i].selected = j_selected;o[j].selected = i_selected;}
function moveOptionUp(obj){for(i=0;i<obj.options.length;i++){if(obj.options[i].selected){if(i != 0 && !obj.options[i-1].selected){swapOptions(obj,i,i-1);obj.options[i-1].selected = true;}}}}
function moveOptionDown(obj){for(i=obj.options.length-1;i>=0;i--){if(obj.options[i].selected){if(i !=(obj.options.length-1) && ! obj.options[i+1].selected){swapOptions(obj,i,i+1);obj.options[i+1].selected = true;}}}}
function removeSelectedOptions(from){for(var i=(from.options.length-1);i>=0;i--){var o=from.options[i];if(o.selected){from.options[i] = null;}}from.selectedIndex = -1;}
function removeAllOptions(from){for(var i=(from.options.length-1);i>=0;i--){from.options[i] = null;}from.selectedIndex = -1;}
function addOption(obj,text,value,selected){if(obj!=null && obj.options!=null){obj.options[obj.options.length] = new Option(text, value, false, selected);}}

//check required fields on the screen
function chkreqd()
{
 if ( typeof(reqdFields) == 'undefined' || typeof(reqdMsg) == 'undefined') return true;

 var blank = false;
 var i = 0;
 // tracker 9896, focus position for required field of empty 
 var focusPos = -1;
 // tracker 9896, make copy of required field name and HTML id so that keep original data untouched
 var updtReqdMsg = reqdMsg.slice(0,reqdMsg.length);
 var updtReqdFields = reqdFields.slice(0,reqdFields.length);
 for (i=0; i < updtReqdFields.length; i++)
 {
    if (eval('document.' + FRM + '.' + updtReqdFields[i]))
    {
        var val = eval('document.' + FRM + '.' + updtReqdFields[i] + '.value');
        if ( val == "" )
        {
            blank = true;
            if ( focusPos == -1)
              focusPos = i;
        }
        else
        {    // tracker 9896, remove field name and HTML id from warning if filled value 
            updtReqdMsg.splice(i, 1);
            updtReqdFields.splice(i, 1);
            i--;
        }
    }
 }
     if (blank)
     {
        szReqFlds = updtReqdMsg.join(", ");

		var TempMsg = szMsg_Req_Fld;
		TempMsg = replacevalstr(TempMsg, "#szReqFlds#", szReqFlds);
		alert(TempMsg);

        eval('document.' + FRM + '.' + updtReqdFields[focusPos] + '.focus()');
        return false;
     }

     return true;
}



function QuoteValue(v)
{
	var returnVal = v;
	if (!isNum(v) && (v.indexOf('"')!=0) && (v.indexOf("'")!=0))
	{
		returnVal = '"' + v + '"';
	}
	return returnVal;
}


// disable links on the page - qview etc
function disableLinks()
{
    for (i=0; i<document.links.length; i++)
    {
        document.links[i].onmouseover='';
        document.links[i].onmouseout='';
        document.links[i].onclick='';
        document.links[i].onchange='';
        document.links[i].href='#';
    }
    bDisableMenu = true;
}

// check for textarea value while the data is being entered and alert the user once they reach the limit
function textareaCtrl(field, maxlimit)
{
	if (field.value.length > maxlimit) // if too long...trim it!
	{
        cf(field);
		field.value = field.value.substring(0, maxlimit);
		szMaxlen = maxlimit+'';   // set the var to be used in the alert.
		var TempMsg = szMsg_Maxlen_Limit;
		TempMsg = replacevalstr(TempMsg, "#szMaxlen#", szMaxlen);
		alert(TempMsg);   // max length exceed msg
		cf(field);  // call the onchange event as this check is causing the onchange event to be false.
	}

}


//edit mask functions
var EM_Array 		= "";
var alphaStr 		= "A";
var numStr   		= "#";
var alphaNumStr 	= "X";
var anyStr 		= "*";
//Tracker#: 15424 THE DROPDOWN ARE BLEEDING THROUGH THE WARNING/ERROR AND SUCCESS MSG WINDOW
//This variable is added for the select ids in the validation pop-up 
var showValSelect = '';

// Shows the mask for a particular field - onfocus
function showMask(obj, occ, format)
{
	if (format == '')
    {
		format = szCurFmt;
    }
	
    var abc = obj;
    var abcp = "";
    var selx=0;
    var sely=0;
    var selw =0;
    var selh =0;
    if(abc.offsetParent)
    {
        abcp=abc;
        while(abcp.offsetParent)
        {
            abcp=abcp.offsetParent;
            selx+=abcp.offsetLeft;
            sely+=abcp.offsetTop;
        }
    }
    if (occ == -1)
    {
        selx+=abc.offsetLeft-moved_x;
        sely+=abc.offsetTop-moved_y
    }
    else
    {
        //alert(moved_dtl_x + ' - ' + moved_dtl_y + ' - ' + moved_x + ' - ' + moved_y)
        selx+=abc.offsetLeft-moved_x-moved_dtl_x;
        sely+=abc.offsetTop-moved_y-moved_dtl_y
    }

    //Tracker#21625 - Deducted container left(navigation width) value from selx and top(banner) value from sely
    //Tracker#24095 - To display the mask in proper place for PLM dashboard queries and Admin screens which has left navigation 
	var navArea = getElemnt("_divNavArea");
	if(navArea)
	{
		selx -= navArea.offsetWidth;
		sely -= navArea.offsetTop;
	}
	
    selw=abc.offsetWidth;
    selh=abc.offsetHeight
    abc = getElemnt('mask')
    setTop(abc, sely+selh);
    setLeft(abc, selx);
    abc.innerHTML = format;
    showObj(abc);
    setZValue(abc,++cur_z);
    EM_Array = format.split("")

}

// checks the value of an objecdt with the current mask
function checkMask(obj)
{
    if (event.keyCode == 0)
        return;
    var val = obj.value;
	// Tracker#: 18878 - CANNOT ENTER BETWEEN OPERATOR FOR SEARCH BETWEEN DATES
    // Moving tracker 17812 fix from showMask function to checkMask function
    // since that is where the original code for limiting number of characters was initially
    // before the fix.
    
    // Tracker#: 17812 - LOWER CASE LETTERS APPEAR IN THE ALT 2 DESC
	// Alternate logic to limit number characters to length of mask:
	// Set the maxlength property of the field.
	obj.maxLength = EM_Array.length;

    var curcode = event.keyCode;

    if (curcode == 8) //backspace
        return;

    //check for right masking
    if ( (EM_Array[val.length] == alphaStr && !isAlpha(curcode)) ||
          (EM_Array[val.length] == numStr && !isDigit(curcode))  ||
          (EM_Array[val.length] == alphaNumStr && !isAlphaNum(curcode))  )
    {
         EMsg(String.fromCharCode(curcode));
         event.returnValue = false;
         obj.focus()
    }
    else
    {
        timer = setTimeout("staticChars(getElemnt('"+obj.name+"'))", 1);
    }
}

// internal to checkmask - adds the special chars to the value upon data entry
function staticChars(obj)
{
    while (obj.value.length < EM_Array.length)
    {
        var nextChar = EM_Array[obj.value.length]

        // issue the stmt to add the special chars
        if (nextChar != alphaStr && nextChar != numStr && nextChar != alphaNumStr && nextChar != anyStr)
            obj.value = obj.value + nextChar;
        else
            break;
    }
}

// check the value of an object with current mask and gives the msg - onchange
function editMask(obj)
{
	var val = obj.value;

	if (EM_Array.length === 0)
	{
		EMsg("");

		return;
	}
	else if (val.length > EM_Array.length)
	{
		EMsg("");
		obj.value= "";
		obj.focus()
		return;
	}

	for (var i = 0; i < EM_Array.length && i < val.length; i++)
	{
		curcode = val.charCodeAt(i);

		if ( (EM_Array[i] == alphaStr && !isAlpha(curcode)) ||
		     (EM_Array[i] == numStr && !isDigit(curcode))  ||
  		     (EM_Array[i] == alphaNumStr && !isAlphaNum(curcode)) ||
  		     (EM_Array[i] != alphaStr &&
  		      	EM_Array[i] != numStr &&
  		      	EM_Array[i] != alphaNumStr &&
  		      	EM_Array[i] != anyStr &&
  		      	EM_Array[i] != String.fromCharCode(curcode))  )
		{
			EMsg("");
			obj.value = "";
			obj.focus()
			break;
		}
	}

}

// is current value a digit char
function isDigit(curcode)
{
	return (curcode >= 48 && curcode <= 57);
}
// is current value an alpha char
function isAlpha(curcode)
{
	return ((curcode > 64 && curcode < 91) || (curcode > 96 && curcode < 123) || (curcode > 191 && curcode < 256))
}

// is current val digit or alpha
function isAlphaNum(curcode)
{
	return (isAlpha(curcode) || isDigit(curcode));
}

// internal to masking - individual invalid char or whole masking msg
function EMsg(ch)
{
	try {
		if (ch != '') {
			alert('Invalid format.\nInvalid Character \''+ch+'\' at the current position.\n\''+alphaStr+'\': Alphabets, \''+alphaNumStr+'\': Alphanumeric, \''+numStr+'\': Digits, \''+anyStr+'\': Any Character.');
		} else {
			alert('Invalid format.\nCurrent Format is \'' + replacevalstr(EM_Array.join(), ",", "") + '\'\n\''+alphaStr+'\': Alphabets, \''+alphaNumStr+'\': Alphanumeric, \''+numStr+'\': Digits, \''+anyStr+'\': Any Character.');
		}
	} catch(error) {
		//ignore
	}
}

function callhref(url)
{
    var win = document;
	win.writeln("<html>");
	win.writeln("<body bgcolor='#EEEEEE'>");
    win.writeln("<script type='text/javascript' src='js/comfunc.js'></script>");
	win.writeln("<script language='javascript'>");
	win.writeln("waitWindow();");
	win.writeln("location.href='"+url+"';");
	win.writeln("</script>");
	win.writeln("</body>");
	win.writeln("</html>");
}

/*Opens pdf report;id used in defining attributes in client specific properties.*/
function openReport(id)
{
    //To workaround IE-PDF problem, modify the base URL and last parameter(report.pdf, &r=.pdf) ends with .pdf.
    //Note servlet mapping for ReportingServlet in web.xml is /report/* (URI pattern).
    if (!bRecordExists)
     {
        alert(szMsg_Invalid_Rec);    // not a valid records
        return;
     }
    else
     {
        var str = 'report/report.pdf?id='+id+'&rows='+nCurRow + '&r=.pdf';
       	oW('report', str, 800, 650);
	 }
}

// open report based on level, used by customer specific reports.
function openReportByLevel(id, level, name)
{
    var checked = 0;
    if(nCurRow == -1 && level == 2)
    {
        alert(szMsg_Sel_Row);
    }
    else
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
            var str = 'report?id=' + id + '&method=customreports' + '&level=' + level + '&reportname=' + name + '&curRowNumber=' + nCurRow;
            oW('report', str, 800, 650);
        }
    }
}

// forward to a screen - ie offer screen link on request
function qfwd(id)

{
  var url = 'quickview.do?fwd=Y&id='+id+'&rows='+nCurRow;
  location.href=url
}


function adjMsgLock()
{
    var nmsgHgt = getElemnt('TSSMSG').offsetHeight;
    if (nmsgHgt>150)
    {
        setHeight(getElemnt('TSSMSG'), 150);
        nmsgHgt=150;
    }

    var objlock = getElemnt('LOCK');
    setHeight(objlock, parseInt(objlock.offsetHeight - nmsgHgt));
    objlock.style.top = parseInt(objlock.style.top) + nmsgHgt + "px";
}
// Remove the extra blank space between the div and the scroll bar.
// This is used when div size is initially set to something but there is not enough data to fill the div
function adjustBlank(divname)
{
	var obj = getElemnt(divname);
	adjustBlankObj(obj)
}

function adjustBlankObj(obj)
{
	if (obj)
	{
		/* Tracker#: 20868 - FIREFOX: BILL OF LADING SEARCH SCREEN HAS EXTRA WHITE SPACE
		 * Issue - scrollHeight cannot be used reliably cross-browser to get height of
		 * container's contents.
		 * Fix - Use hasScrollbar function.
		 */
		if (!hasScrollbar(obj,'vertical'))
		{
			obj.style.height = 'auto';
			/* IE - Need to manually take into account scrollbar 
			 * height if present so it does not overlap content.
			 */
			if (IE && hasScrollbar(obj,'horizontal'))
			{
				var $obj = $(obj);
				$obj.height( $obj.height() + nScrlbar );
			}
		}
	}
}

//Tracker#: 18832 - SLOW DASHBOARD LOAD TIME IN KOHLS PRODUCTION
//Optimizing adjustBlankObj function for dashboard only.
var dashboard = {};
dashboard.adjustBlankObj = function (obj)
{
	if (obj)
	{
		// if child table height < div height, reduce div height to equal child table height
		if (obj.children[0].offsetHeight < obj.offsetHeight)
		{
			obj.style.height = 'auto';
		}
	}
}

function removeScroll(divname)
{
	obj = getElemnt(divname);
	removeScrollObj(obj);

}

function removeScrollObj(obj)
{
	if (obj)
	{
		var hgt = obj.offsetHeight;
		var scrl_hgt = obj.scrollHeight;
		var wid = obj.offsetWidth;
		var scrl_wid = obj.scrollWidth;
        bAdjusted = false;
		if (scrl_hgt > hgt)
		{
			setHeight(obj, parseInt(scrl_hgt) );
		    bAdjusted = true;
		}
		// if there horizontal scroll then add scroll pixels
		if (wid != scrl_wid && bAdjusted)
		{
			setHeight(obj, parseInt(hgt) + nScrlbar);
        }
	}
}


// Removes any extra pa
function adjustDivsByName(nam)
{
    var divs = document.getElementsByTagName("div");
    var divslen = divs.length;
    for(var i=0; i < divslen; i++)
    {
        var singleDiv = divs[i];
        // check for index and call the appropriate function to adjust white space.
        if (singleDiv.id.indexOf(nam) == 0)
        {
            dashboard.adjustBlankObj(singleDiv);
        }
    }
}

//Request object to filter select boxes dynamically.Instead new
//request connection should call wait!
var filterrequest;

function jax_filter(fld, rpt, fltrstr)
{
	if (rpt > 0)
	{
		if (nCurRow == -1) nCurRow = 0;
	}
	else
	{
		nCurRow	= -1;
	}

	var url = 'ajaxhelper.do?method=filter&fld=' + fld + '&cur_row_no=' + nCurRow;

    var valArray = fltrstr.split(';');
    for(var j = 0 ; j < valArray.length ; j++)
    {
	    var valArray1 = valArray[j].split('^');
		var repeating = valArray1[0];
	    var fltrcols = valArray1[1];
	    var fltrvals = getfiltervals (nCurRow, repeating, fltrcols);
	    url += '&fltrcols=' + encodeURIComponent(fltrcols) + '&fltrvals=' + fltrvals;
    }

    filterrequest = createXMLHttpRequest();

    if (filterrequest)
    {
        filterrequest.open("GET", url, true);
        filterrequest.onreadystatechange = jax_filter_back;
        filterrequest.send(null);
    }
}

// Explicitly declaring the variable to hold an XMLHttpRequest object as global
// It need not be declared (and can be used as a global variable in the following method)
// but has caused confusion in the past.
var req;
function jax_validate(fld, onj, rpt, fltrcols, docId, levelId, fieldName)
{
    if (nCurRow == -1) nCurRow = 0;
    var fltrvals = getfiltervals (nCurRow, rpt, fltrcols);
    /*if (fltrvals == null)//TODO: Analyze
    {
        return;
    }*/

    var url = 'ajaxhelper.do?method=dv&fld='+fld+'&val='+onj.value + '&fltrcols=' + encodeURIComponent(fltrcols) + '&fltrvals=' + fltrvals;
	
	if(typeof(docId) != 'undefined' && typeof(levelId) != 'undefined' &&  typeof(fieldName) != 'undefined')
	{
     	url = url + '&docId=' + docId + '&levelId=' + levelId +  '&fieldName=' + fieldName;
    }

    req = createXMLHttpRequest()

    if (req)
    {
        req.open("GET", url, true);
        req.onreadystatechange = jax_back;
        req.send(null);
    }
}

function jax_back()
{
    //alert (req.readyState + ":" + req.status);
    if (req.readyState == 4)
    {
        if (req.status == 200)
        {
           // Invoke SessionManagement.resetSessionTime() to reset session counter.
           SessionManagement.resetSessionTime();
		   
		   var msg = req.responseText;
           if (msg != '')
                jax_msg(msg);
            //showMsg2(msg, true);
           //alert("msg 1" + msg);
        }
    }
}

function jax_msg(msg)
{
    var oMsg = 	top.getElemnt('TSSMSG');
    var oLock = top.getElemnt('LOCK');

    var curLockTop = parseInt(oLock.style.top);

    oMsg.innerHTML = msg;

    showObj(oMsg); // when hide this when user click close msg

    var nmsgHgt = parseInt(oMsg.offsetHeight);

    oLock.style.top = parseInt(top.TOP4LOCK) + nmsgHgt + "px";
    setHeight(oLock, parseInt(oLock.offsetHeight + parseInt(curLockTop - top.TOP4LOCK) - nmsgHgt))
}

function jax_filter_back()
{
    if (filterrequest.readyState == 4)
    {
        if (filterrequest.status == 200)
        {
			// Invoke SessionManagement.resetSessionTime() to reset session counter.
        	SessionManagement.resetSessionTime();
			
			//The XML Structure looks like
			//<?xml version='1.0'?>
			//<dropdown>
			//<field id='F15_2'>
			//<option value='0'>--</option>
			//<option value='1'>100</option>
			//</field>
			//<field id='F16'>
			//<option value='0'>--</option>
			//<option value='1'>100</option>
			//</field>
			//</dropdown>

			//alert (filterrequest.responseText);
			var fields = filterrequest.responseXML.getElementsByTagName('field');
			for (var i=0;i<fields.length;i++)
			{
				var field = fields.item(i);
				var fieldId = field.attributes.getNamedItem('id').nodeValue;
				var index = fieldId.indexOf ('_');
				if (index != -1)
				{
					//Update specific row-column field.
					jax_filter_setOptions (fieldId, field);
				}
				else
				{
					//Update non repeating section field
					jax_filter_setOptions (fieldId, field)

					//Update repeating section fields.
					//Repeating rows can never be 1000;Breaks on empty.
					for (var k=0;k<1000;k++)
					{
						var repetingFieldId = fieldId + '_' + k;
						if (!jax_filter_setOptions (repetingFieldId, field))
						{
							break;
						}
					 }
				  }
			}
		 }
    }
}

function jax_filter_setOptions (fieldId, field)
{
	var obj = getobj (fieldId);
	if (obj == '' || typeof(obj) == 'undefined')
	{
		return Boolean (false);
	}

	if (obj.length > 0)
	{
		removeAllOptions (obj);
	}

	var option = field.getElementsByTagName ('option');
	for (var j=0;j<option.length;j++)
	{
		var value = option.item(j).attributes.getNamedItem('value').nodeValue;
		var text = option.item(j).childNodes.item(0).nodeValue;
		addOption(obj,text,value,'');
	}
    cfbyname (obj.name);//Make it as changed field.
	return Boolean (true);
}

//On selection of element through a popup won't trigger onChange event.
//Explicitly call 'jax_filter'.
function jax_filter_onChange(fieldId)
{
    if (opener.getElemnt(fieldId) &&  opener.getElemnt(fieldId).attributes.getNamedItem('onChange'))
    {
    var jaxFilterOnChange = opener.getElemnt(fieldId).attributes.getNamedItem('onChange').nodeValue;
        if (jaxFilterOnChange == null || jaxFilterOnChange == 'undefined')
        {
            return;
        }

    var index = jaxFilterOnChange.indexOf ('jax_filter');
    if (index != -1)
    {
	    jaxFilterOnChange = jaxFilterOnChange.substring (index);
	    jaxFilterOnChange = jaxFilterOnChange.substring (0, 1 + jaxFilterOnChange.indexOf (')'));
	    eval ('opener.' + jaxFilterOnChange);
	}
	}
}

function ivalid(fid, onj)
{
    if (frames['tss_frame'])
    {
        frames['tss_frame'].location.href='iframeaction.do?fid='+fid+'&val='+onj.value;
    }
}

var tipX = 0;
var tipY = 0;

//fname - name the field on which the smart tag is displayed
function itip(val, tagdoc, tagdocview, level, fname)
{
    if (frames['tss_frame'])
    {
        //val = getobj(onj).value;

        //ST#11059- to show smart tag info from support tables
        //Range of doc ids for Reference Tables
        if(tagdoc >= 20000 && tagdoc < 50000)
        {
            frames['tss_frame'].location.href='iframeaction.do?tagdoc='+tagdoc+'&tagdocview='+tagdocview+'&code='+val+'&row_no='+nCurRow+'&level='+level+'&fname='+fname;
        }
        else
        {
            frames['tss_frame'].location.href='iframeaction.do?tagdoc='+tagdoc+'&tagdocview='+tagdocview+'&party_id='+val+'&row_no='+nCurRow+'&level='+level+'&fname='+fname;
        }

        tipX = mX;
        tipY = mY;
        startTip();
    }
}

function tipELC()
{
    if (frames['tss_frame'])
    {
        frames['tss_frame'].location.href='iframeaction.do?tag_id=2&row_no='+nCurRow;
        tipX = mX;
        tipY = mY;
        startTip();
    }
}


function startTip()
{
    showTip('<table bordercolor="#0000FF" cellpadding=0 cellspacing=0 border="1"><tr><td style=\"background-color: #C3D3FD\"><br>Processing...<br><br></td></tr></table>');
}


// Shows the mask for a particular field - onfocus
function showTip(tip)
{

    var abc = getElemnt('mask')
    setTop(abc, tipY);
    setLeft(abc, tipX);
    abc.innerHTML = tip;
    var abchgt = abc.offsetHeight;
    var abcwidth = abc.offsetWidth;
    // check if tip is going to overlap copy right div
    var cp = getElemnt('TSSBOT');
    var cptop = cp.offsetTop;

    // fix the top
    if ((parseInt(tipY) + parseInt(abchgt)) > parseInt(cptop))
    {
	    setTop(abc, (parseInt(tipY) - ((parseInt(tipY) + parseInt(abchgt)) - parseInt(cptop))));
    }

    // fix the left
    if (nCurScrWidth < (parseInt(abcwidth) + parseInt(tipX)))
    {
        setLeft(abc, (parseInt(tipX) - ((parseInt(tipX) + parseInt(abcwidth)) - parseInt(nCurScrWidth))));
    }


    showObj(abc);
    setZValue(abc,++cur_z);

}

function handleColLock(lockedfield)
{
    lockedfield = parseInt(lockedfield);
    dd2obj = getElemnt('DATA_DIV2');
    dd1obj = getElemnt('DATA_DIV1');
    td2obj = getElemnt('TITLE_DIV2');
    td1obj = getElemnt('TITLE_DIV1');
    dt2obj = getElemnt('DATA_TABLE2');
    dt1obj = getElemnt('DATA_TABLE1');
    tt2obj = getElemnt('TITLE_TABLE2');
    tt1obj = getElemnt('TITLE_TABLE1');
    
    colfreeze('TITLE_DIV1', 'DATA_DIV1' , 'TITLE_TABLE1', 'DATA_TABLE1', false);
    // set the left side width
    
    // Tracker#: 15592 - 2010 UI REGRESSION IN SOME OF THE BUILDER SCREENS: COLUMN ALIGNMENT
    var $td1obj = $(td1obj);


	expLeft = parseInt(td1obj.offsetWidth) + $td1obj.position().left;

    // position the four divs
    setTop(td2obj, parseInt(td1obj.offsetTop));
    setTop(dd1obj, parseInt(td1obj.offsetTop) + parseInt(td1obj.offsetHeight));
    setTop(dd2obj, parseInt(td1obj.offsetTop) + parseInt(td1obj.offsetHeight));
    // set the left for right title and data
    //setLeft(td2obj, expLeft + 6);
    //setLeft(dd2obj, expLeft + 6);
    setLeft(td2obj, expLeft);
    setLeft(dd2obj, expLeft);
    colfreeze('TITLE_DIV2', 'DATA_DIV2' , 'TITLE_TABLE2', 'DATA_TABLE2', true);

 //   setTop(dd2obj, parseInt(dd1obj.offsetTop));

    // align the height of the data tables
    var nRowCount = dt1obj.getElementsByTagName("tr").length;
    i=0;
    while(i < nRowCount)
    {
	trobj1 = dt1obj.getElementsByTagName("tr").item(i).getElementsByTagName("td").item(0);
	trobj2 = dt2obj.getElementsByTagName("tr").item(i).getElementsByTagName("td").item(0);
        alignHeight(trobj1, trobj2);
        i++;
    }


    // set variables needed for expandtl
    expData = 'DATA_DIV2';
    expTitle = 'TITLE_DIV2';
    expandtl();

}

//Adjust the height of left and right side divs.
function lockAdjust()
{
    if (dd2obj)
    {
        // reduce the size of data div 1 if there is horizontal scrolling
        if (dd2obj.scrollWidth > dd2obj.offsetWidth)
        {
            setHeight(dd1obj, parseInt(dd2obj.offsetHeight) - nScrlbar);
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
        else if (dd2obj.offsetHeight != dd1obj.offsetHeight)  // 21835 if they are not same make them same and as dd2obj has moved thus set dd1obj height
        {
            setHeight(dd1obj, parseInt(dd2obj.offsetHeight));
        }

    }

}

// Tracker#: 18734 - LL DETAILS FLOW SECTION RENDERING IS INCONSISTENT
/**
 * Purpose:  Detect if scrollbar exists on element (reliably, crossbrowser)
 * Return Value:  (boolean) true = scrollbar detected, false = NO scrollbar detected
 * Parameters: (DOM object), (string)
 */
var hasScrollbar = function () {
	// Private variables
	var scrollbarWidth = 0;
	
	// Private methods
	var calcScrollbarWidth = function () {
		if (scrollbarWidth === 0) // Calculate scrollbar width only once.
		{
			var outerDiv = $('<div/>'),
				innerDiv = $('<div/>'),
				noScrollbarWidth,
				scrollbarPresentWidth;
			// Setup test for scrollbar width outside browser viewable area.
			outerDiv.css({
				position : 'absolute',
				top : 0,
				left : -200,
				height : 100,
				width : 100,
				overflow : 'hidden'
			});
			innerDiv.css({
				height : 200,
				width : 50
			});
			
			outerDiv.append(innerDiv);
			$('body').append(outerDiv);
			
			var outerDivDOM = outerDiv[0];
			// Get the width when scrollbar is NOT present first.
			noScrollbarWidth = outerDivDOM.clientWidth;
			
			outerDiv.css('overflow-y', 'scroll');
			
			// Get the width when scrollbar IS present.
			scrollbarPresentWidth = outerDivDOM.clientWidth;
			
			// Calculate scrollbar width and store the value.
			scrollbarWidth = noScrollbarWidth - scrollbarPresentWidth;
			
			// Clean up - Remove the divs used for calculation.
			outerDiv.remove();
		}
		return scrollbarWidth;
	};

	// Main code
	return function (element, orientation) {
		// clientHeight, clientWidth does not include scrollbar.
		// $.innerHeight(), $.innerWidth() does.
		// Compare clientHeight/Width + scrollbar width to
		// $.innerHeight(), $.innerWidth() to check for scrollbar.
		// Comparing scroll property to offset property yields false negatives
		// when amount hidden is small.
		if (orientation === "horizontal")
		{
			return (
				( element.scrollWidth > element.offsetWidth ) ||
				( element.clientHeight + calcScrollbarWidth() === $(element).innerHeight() )
			);
		}
		else if (orientation === "vertical")
		{
			return (
				( element.scrollHeight > element.offsetHeight ) ||
				( element.clientWidth + calcScrollbarWidth() === $(element).innerWidth() )
			);
		}
	}
}();

//Tracker#: 26400 - PACKING LIST WITH ONE DETAIL ROW DISPLAYS LAST COLUMN PARTIALLY
function getScrollBarWidth()
{
	var outerDiv = $('<div/>'),
	innerDiv = $('<div/>'),
	noScrollbarWidth,
	scrollbarPresentWidth;
	// Setup test for scrollbar width outside browser viewable area.
	outerDiv.css({
		position : 'absolute',
		top : 0,
		left : -200,
		height : 100,
		width : 100,
		overflow : 'hidden'
	});
	innerDiv.css({
		height : 200,
		width : 50
	});
	
	outerDiv.append(innerDiv);
	$('body').append(outerDiv);
	
	var outerDivDOM = outerDiv[0];
	noScrollbarWidth = outerDivDOM.clientWidth;
	if(IE && IEVer >= 8)
	{
		var objRect = outerDivDOM.getBoundingClientRect();
		noScrollbarWidth = objRect.right - objRect.left;
	}
	
	outerDiv.css('overflow-y', 'scroll');
	
	// Get the width when scrollbar IS present.
	scrollbarPresentWidth = outerDivDOM.clientWidth;
	if(IE && IEVer >= 8)
	{
		var objRect = outerDivDOM.getBoundingClientRect();
		scrollbarPresentWidth = objRect.right - objRect.left;
	}
	
	// Calculate scrollbar width and store the value.
	scrollbarWidth = noScrollbarWidth - scrollbarPresentWidth;
	
	// Clean up - Remove the divs used for calculation.
	outerDiv.remove();
	return scrollbarWidth;
}

// internal function to freeze - align the columns
function align2TableCols(table1, table2)
{
    var i=0;

    var obj1 = getElemnt(table1);
    var obj2 = getElemnt(table2);
    
    if (obj1 && obj2)
    {
        // set table widths to auto - having them set to fixed width changes width of cells
        // which throws off calculations
        obj1.style.width = 'auto';
        obj2.style.width = 'auto';

        //this is, incase of other than default row i.e 0 is used for heading
        //set the table attribute 'frzRw' value to 1 or more
		var frzRw1 = (obj1.getAttribute("frzRw"))?parseFloat(obj1.getAttribute("frzRw")):0;
		var frzRw2 = (obj2.getAttribute("frzRw"))?parseFloat(obj2.getAttribute("frzRw")):0;

    	// create jQuery objects of tables
	    var tbl1 = $(obj1);
	    var tbl2 = $(obj2);

		// Get title cells based on freeze row number
		var titleCells = tbl1.children('tbody').children('tr').eq(frzRw1).children('td');

		// Get data cells based on freeze row number
		var dataCells = tbl2.children('tbody').children('tr').eq(frzRw2).children('td');
		
		// Get length of rows
		var numberCells = titleCells.length;
	    
	    for (var i=0; i<numberCells; i++)
        {
	    	alignTwoTableColumns(titleCells.eq(i), dataCells.eq(i));
        }
		    
		// Fix table width so when div width is adjusted, table width will not change
		tbl1.width(tbl1.width());
		tbl2.width(tbl2.width());
	}
}

function alignTablesCellsWithFreezeRow(d1, d2, table1, table2)
{
	// convert to jQuery objects
	var titleCell = $(d1);
	var dataCell = $(d2);
	
	// widths including border and padding
	var titleOuterWidth = titleCell.outerWidth();
	var dataOuterWidth = dataCell.outerWidth();
	
	// get padding, border dynamically since it now varies from screen to screen
	var titleExtra = titleOuterWidth - titleCell.width();
	var dataExtra = dataOuterWidth - dataCell.width();
	
	if (titleOuterWidth > dataOuterWidth)
	{
		dataCell.width( titleOuterWidth - dataExtra );
		titleCell.width( titleCell.width() );
		return titleOuterWidth;
	}
	else if (dataOuterWidth > titleOuterWidth)
	{
		titleCell.width( dataOuterWidth - titleExtra );
		dataCell.width( dataCell.width() );
		return dataOuterWidth;
	}
	else // they are equal; can return either one
	{
		return dataOuterWidth;
	}
}



// to freeze the titles in a table - used on pretty much all the screens for detail grid
function colfreeze(title_div, data_div, title_table, data_table, bSecond)
{
    // This is just for testing purposes
	//if (getElemnt(title_div))
	//{
	//	getElemnt(title_div).style.visibility = 'visible';
	//  getElemnt(data_div).style.visibility = 'visible';
	//}
	
		// align columns
	    align2TableCols(title_table, data_table);
	
	    //align tables
	    //alignTables(title_table, data_table);
	
	    // align divs which holds the tables
	    if (bSecond)
	    {
	    	adjustOuterDivs(title_div, data_div, data_table);
	    }
}

var szClrdRow = '#87CEEB';
var szUnClrdRow = '#FFFFFF'; // need to dynamically set this value if we ever allow user ability to change the row color
var nPAGE_SIZE = 0;

function clrTableRow(row,tableName)
{
    row = parseInt(row);
    var tName = "TABLE1"; // table id for non detail scroll table
    var tobj = getElemnt(tName);

	if(typeof(tableName)!="undefined")	// for custom tables
	{

		tobj = getElemnt(tableName);

		if(tobj)
		{
			var tr_len = tobj.getElementsByTagName("tr").length
			var trobj = tobj.getElementsByTagName("tr").item(row);

			if (trobj)
			{
				trobj.style.background = szClrdRow;
			}
		}
	}
    else if (dt2obj && dt1obj)    // column freeze
    {

        var tr_len = dt2obj.getElementsByTagName("tr").length;
        row = getCalcRow (row, tr_len);
        obj1 = dt1obj.getElementsByTagName("tr").item(row);
        obj2 = dt2obj.getElementsByTagName("tr").item(row);

       // szUnClrdRow = obj1.style.background;
        if (obj1 && obj2)
        {
            obj1.style.background = szClrdRow;
            obj2.style.background = szClrdRow;
        }
    }
    else if (dtobj)    // title freeze
    {

        tr_len = dtobj.getElementsByTagName("tr").length
        row = getCalcRow (row, tr_len);
        obj = dtobj.getElementsByTagName("tr").item(row);
       // szUnClrdRow = obj.style.background;
        if (obj)
        {
            obj.style.background = szClrdRow;
        }
    }
    else if (tobj)      // non title freeze
    {

        tr_len = tobj.getElementsByTagName("tr").length
        row = getCalcRow (row, tr_len);
        var trobj = tobj.getElementsByTagName("tr").item(row);
       // szUnClrdRow = trobj.style.background;
        if (trobj)
        {
            trobj.style.background = szClrdRow;
        }
    }
}

function unclrTableRow(row,tableName)
{
    row = parseInt(row);
    var tName = "TABLE1"; // table id for non detail scroll table
    var tobj = getElemnt(tName);

	if(typeof(tableName)!="undefined")	// for custom tables
	{
		tobj = getElemnt(tableName);

		if(tobj)
		{
			var tr_len = tobj.getElementsByTagName("tr").length
			var trobj = tobj.getElementsByTagName("tr").item(row);

			if (trobj)
			{
				trobj.style.background = szUnClrdRow;
			}
		}
	}
    else if (dt2obj && dt1obj)
    {
        var tr_len = dt2obj.getElementsByTagName("tr").length;
        row = getCalcRow (row, tr_len);
        obj1 = dt1obj.getElementsByTagName("tr").item(row);
        obj2 = dt2obj.getElementsByTagName("tr").item(row);
        obj1.style.background = szUnClrdRow;
        obj2.style.background = szUnClrdRow;
    }
    else if (dtobj)
    {
        tr_len = dtobj.getElementsByTagName("tr").length
        row = getCalcRow (row, tr_len);
        obj = dtobj.getElementsByTagName("tr").item(row);
        obj.style.background = szUnClrdRow;
    }
    else if (tobj)
        {
        tr_len = tobj.getElementsByTagName("tr").length
        row = getCalcRow (row, tr_len);
        obj = tobj.getElementsByTagName("tr").item(row);
        obj.style.background = szUnClrdRow;
    }

}

// function to get the correct row number in the table based on the row number passed (mainly in paging situation on the second page onwards)
function getCalcRow(rowno, rows_count)
{
    if (rowno == 0 || nPAGE_SIZE <=0)    // no paging or first row
	    return rowno

    if (rowno > rows_count)    // not on first page
    {
        if (nPAGE_SIZE >= 0)   // page size is defined
        {
            if (rowno >= (nPAGE_SIZE * 2) && rows_count > nPAGE_SIZE)   //  extra empty rows are added after the original 10 rows
            {
                rowno = (rowno % nPAGE_SIZE) + nPAGE_SIZE;
            }
            else
            {
                rowno = rowno % nPAGE_SIZE;    // regular 10 rows on the screen so get the correct row
            }
        }
        else
        {
            rowno = rowno % rows_count;   // if page is not defined than use current rows total
        }
    }
    else if (rowno >= nPAGE_SIZE)
    {
        rowno = rowno % nPAGE_SIZE;
    }
    return rowno;
}

// this method is overwritten in query viewer
function srh(occ)
{
    nCurRow = occ;
    if (HLRObj != '')
	{
		HLRObj.style.background = szUnClrdRow
	}

}

function handleLvl(div)
{
    if (div.indexOf('c'))
    {
        hide(div);
        show(div.substr(0, div.length-1));
    }
    else
    {
        hide(div);
        setTop(getElemnt(div+'c'), parseInt(getElemnt(div).offsetTop))
        setLeft(getElemnt(div+'c'), parseInt(getElemnt(div).offsetLeft))
        show(div + 'c');
    }
    // loop trough therest of pglvl and reset their top.
    setTop(getElemnt('pglvl1'), 50);
    expandtl();

}

// submit the quick search form after checking the value for quick search being not null
function qs()
{
    // if (document.qsfrm.qs_val.value == '')
    if (document.forms[0].qs_val.value == '')
    {
        alert(szMsg_Filter_Columns + 'Search');
        document.forms[0].qs_val.focus();
        return false;
    }
    document.forms[0].action = "search.do";
    //tracker#15927 - removed the blur event on the input fields as it gives focus to the form thus submits the form on enter key (making it double submit).
    u(document.forms[0].qs_val);  // uppercase the value which was happening in the blur function
    document.forms[0].submit();
    waitWindow();
}

// set the value for doc_view_id and fld_name for quick search.
function set_qsval(obj)
{
    var val = obj.value;
    idx = val.indexOf("_");
    var docviewid = val.substring(0, idx);
    var fldname  = val.substring(idx+1, val.length);
    /* document.qsfrm.doc_view_id.value=docviewid;
    document.qsfrm.fld_name.value=fldname; */
    document.forms[0].doc_view_id.value=docviewid;
    document.forms[0].fld_name.value=fldname;
}

function o(fld)
{
    if (getobj(fld))
    {
        getobj(fld).focus();
    }
}
//Tracker#: 7720 COST MODEL VALIDATION TABLE POPULATES THE WRONG DETAIL LINE
//This function is called when 'tab' key is pressed. This function is supported by all browsers.
function tabo(fld)
{
  var e = window.event;
  if (getobj(fld))
  {
       if(e.keyCode == 9)
       {
         getobj(fld).focus();
       }
   }
}

// create a 'close' link in 'clr' color on top right corner of the page. This method should be used on child windows only.
function printClose(clr)
{
    document.write("<div id='clswin' style='text-align:right;position:absolute;'></div>")
    getElemnt('clswin').innerHTML="<a href='javascript:self.close();' style='color:"+clr+";'>" + szMsg_Close + "</a>";
    setTop(getElemnt('clswin'), 3);
    setLeft(getElemnt('clswin'), parseInt(nCurScrWidth - 50));
    zvalue +=100;
    setZValue(getElemnt('clswin'), zvalue);
}

function openAbout(url)
{
  var nWidth = 406;
  var nHeight = 404;
  var wname = "aboutWindow";

  var nWindow = window.open(url, wname,'width=' + nWidth + ',height=' + nHeight + ',toolbar=no,menubar=no,scrollbars=no,resizable=no')
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

function handleList(nCase,showDivName,hideDivName,objName)
{
	try
	{
		/* Tracker#: 18890 - SAFARI & FIREFOX: ISSUES IN PO - QUICK SEARCH
		 * innerText property supported by IE only - accessing value property instead.
		 */
		if(typeof(objName!='undefined') && objName)
		{
			var obj = getElemnt(objName);

			if(obj)
			{
			    nCase = (obj.value=="+")?2:6;
			}
		}

		if(showDivName)showDisplay(showDivName);
		if(hideDivName)hideDisplay(hideDivName);

		if(obj)
        {
            obj.value= (nCase==2)?"-":"+";
        }

		if(typeof(toggleChildContainer)=="function")
		{
			toggleChildContainer(2,showDivName,objName);
		}
	}
	catch(e)
	{
		//alert(e.description);
	}
}

function toggleChildContainer(nCase,divName,objName)
{

    switch(divName)
    {
       case 'FLTR_OPEN':
        {
            var objpd = getElemnt('pglvl1');
            var obj =  getElemnt('FLTR_OPEN');

            if((objpd) && (obj))
            {
                var nwTop = parseInt(objpd.offsetTop) - 30;
                var nwLeft = 100;
                // - parseInt(obj.offsetHeight);
                setTop(obj, nwTop);
                setLeft(obj, nwLeft);
            }
        }
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

// Tracker: 7191 INVOKE SEARCH BUTTON ON EDITTABLE QUERIES AND RECIEVE MESSAGE NO FORWARD DEFINED
// function ss is already available in comfunc.js so renaming it to qss
function qss(act)     // search button action on search screens
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


// onchange function for a text field
function cftDetailSearch(obj)
{
    if (obj.type != 'select-one')
        u(obj);
    cftDetail(obj);
}

function cftDetail(obj)
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
    cfbynameDetail(obj.name);
    specialCase = false;
}

//add the name of the given field to the changed fields value
function cfbynameDetail(fldname)
{
    var chgHolder = getval('chgDtlSearchFlds');
    if (chgHolder.indexOf(fldname + ',') == -1) // if it doesn't exist
                chgHolder = chgHolder.concat(fldname,',');
    setval('chgDtlSearchFlds', chgHolder);
}


var DragId = "";

function endDrag()
{
	if(drag && dragObj && dragObj == getElemnt("FLTR_OPEN"))
	{
		DragId = "";
		drag = false;
		dragObj = null;
		move = false;
	}
}

function fillDownQS()
{
    if(selectedElement)
    {
        var name = selectedElement.name;
        var fieldName = name.substring(0,name.lastIndexOf('_') + 1);
        var currentRow = name.substring(name.lastIndexOf('_') + 1);

        for(var i = currentRow ; i <= rowEnd ; i++)
        {

            if(i > nLastValidDtl) return;
            var temp = getobj(fieldName + i);

            if(temp)
            {
                cfbyname(temp.name)
                temp.value = selectedElement.value;
            }
            checkCurrentRow(i);
        }
    }
    else
    {
        alert (szMsg_Fill_Down);
    }
    selectedElement = "";
}

function fillUpQS()
{
    if(selectedElement)
    {
        var name = selectedElement.name;
        var fieldName = name.substring(0,name.lastIndexOf('_') + 1);
        var currentRow = name.substring(name.lastIndexOf('_') + 1);

        for(var i = currentRow ; i >= rowStart ; i--)
        {
            var temp = getobj(fieldName + i);

            if(temp)
            {
                cfbyname(temp.name)
                temp.value = selectedElement.value;
            }

            checkCurrentRow(i);
        }
    }
    else
    {
        alert (szMsg_Fill_Up);
    }
    selectedElement = "";
}

//Tracker#23965
//Added fillselected() function to fill the selected rows with a selected column value
function fillSelected()
{	
	if(selectedElement)
	  { 
		 var name = selectedElement.name;			     			     	      
		 var fieldName = name.substring(0,name.lastIndexOf('_')+ 1);  
			     
		 if(fieldName == '')
          {                
              alert(szMsgNoDataToFill);
              return;
          }       
			    
		 var obj = $('input[name=R]');  			   			  
		 var i = 0; // check box count
			     			     
		 for(var k = rowStart; k <= rowEnd; k++)
		   {			     	
		      var curCheckBox = obj[i++];			         
		      var temp = getobj(fieldName + k);        
			   //whether check box is selected      
		      if(curCheckBox != null && curCheckBox.checked)
		       {  
		            cfbyname(temp.name)
		            //set the selected value
		            temp.value = selectedElement.value; 			                     
		        }             
			}
	 }
	else
    {
        alert (szMsgFillData);
    }
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

function handleMoveQS(obj,e)
{
	var dragDiv = getElemnt("FLTR_OPEN");

    if (!drag)
    {
    	dragObj=dragDiv;
        DragId = "FLTR_OPEN";
        drag=true;
        // Avoid the bubbling of the Events till the onclick event of the FLTR_OPEN div, this is where we try to end drag.
		if (e.stopPropagation)
		{
			e.stopPropagation();
		}
		else
		{
			e.cancelBubble = true;
		}

        mouseDown(e);
    }
	window.status="";
}


var levelId = "-1";

// Called by the onfocus method by the editable Fields.Sets the Level Id of the field which has current focus.
function setFieldLevel(id)
{
    levelId = id + "";
}

//Tracker#: 13518 ABILITY TO ADD TECHSEPC TO RECENTLY VIEWED DOCUMENTS
//Added a parameter fromTechspec to check the call is from tech spec or any
//quote screen. If the fromTechspec is not null then the call happens from the
//tech spec the url is changed correspondingly and call back method changes
function createShortCut(fromTechspec)
{
    if (!isValidRecord('URL', 'N'))
    {
        return;
    }
    var url = 'ajaxhelper.do?method=sc';
	if(fromTechspec != null) {
		url = url + '&fromTechSpec='+fromTechspec;
	}
    req = createXMLHttpRequest();

    if (req)
    {
        req.open("GET", url, true);
        if(fromTechspec != null) {
       		 req.onreadystatechange = plmTechSpec_back;
        } else {
        	req.onreadystatechange = jax_back;
        }
        req.send(null);
    }
}
//Tracker#: 13518 ABILITY TO ADD TECHSEPC TO RECENTLY VIEWED DOCUMENTS
//Function was added as call back function for the createShortCut function
//for the case of tech spec in plm screen we have to show the success or error message in
// the corrosponding boxes.So this function gets the message and shows it is the success or the
//error box
function plmTechSpec_back()
{
    if (req.readyState == 4)
    {
    	var htmlAreaObj = _getWorkAreaDefaultObj();
		var objAjax = htmlAreaObj.getHTMLAjax();
		var htmlErrors = objAjax.error();
        if (req.status == 200)
        {
           // Invoke SessionManagement.resetSessionTime() to reset session counter.
           SessionManagement.resetSessionTime();
			
		   var msg = req.responseText;
          if (msg != '' && msg == 'Added to favorites on Dashboard'){
           		objAjax.error().addError("successInfo", msg, false);
           } else if(msg != '' && msg == 'Error Adding Short Cut to the Dashboard') {
           		objAjax.error().addError("errorInfo", msg, false);
           }
           messagingDiv(htmlErrors);
        }
    }
}

function delql(row_no) // quick links
{
    if (!confirm("Are you sure you want to delete this link?"))
    {
        return;
    }

    //Added as a part of tracker 8652: DELETING FROM FAVORITES DOES NOT AUTOMATICALLY REMOVE FROM DASHBOARD.
   var ajaxReq = new AJAXRequest("ajaxhelper.do", refreshFavoriteSection, "method=delql&row_no=" + row_no);
   ajaxReq.send();

}

//Added as a part of tracker 8652: DELETING FROM FAVORITES DOES NOT AUTOMATICALLY REMOVE FROM DASHBOARD.
//after refreshing the favorite section contents are displayed within th <DIV> 'favdiv'
function refreshFavoriteSection(response)
{
    document.getElementById("favdiv").innerHTML = response;
	closeWaitWindow();
}

function adjustCopyRight()
{
     if ( bDisplayCopyRightAlways )
    {
	    obj = getElemnt('TSSBOT');
	    if (obj)
	    {
	        //setTop(obj, parseInt(window.body.scrollHeight));
	        ht = parseInt(document.body.scrollHeight) - parseInt(document.body.scrollTop);
	        //window.status = "document.body.scrollHeight " + document.body.scrollHeight + "document.body.scrollTop " + document.body.scrollTop + " ht = " + ht + " document.body.clientHeight "  +document.body.clientHeight;
	        setTop(obj, parseInt(nCurScrHeight-18 + document.body.scrollTop));
	    }
	}
	mouseMove();
}

function attachScreenListener()
{
     //alert("trying to attach listener");
	if (document.layers) {
		document.captureEvents(Event.MOUSEDOWN);
		document.captureEvents(Event.SCROLL);
		}
	//alert("trying to attach listener 1");
	window.popupWindowOldEventListenerMoveDown = document.onMouseDown;
	window.popupWindowOldEventListenerMoveUp = document.onMouseUp;
	window.popupWindowOldEventListenerMoveMove = document.onMouseMove;
	window.popupWindowOldEventListenerScroll = document.onscroll;

	//Added this code as a part of tracker 9135
	attachEvntLstn(document.onMouseDown,new Function("window.popupWindowOldEventListenerMoveDown(); adjustCopyRight();"),adjustCopyRight)
	attachEvntLstn(document.onMouseUp,new Function("window.popupWindowOldEventListenerMoveUp(); adjustCopyRight();"),adjustCopyRight)
	attachEvntLstn(document.onMouseMove,new Function("window.popupWindowOldEventListenerMoveMove(); adjustCopyRight();"),adjustCopyRight)
	attachEvntLstn(document.onscroll,new Function("window.popupWindowOldEventListenerScroll(); adjustCopyRight();"),adjustCopyRight)

}

//Added this function as a part of tracker 9135
//The mouse events are handled and the issue with the calender, where the the popup window was not closing
//until unless user selects the date is fixed.
function attachEvntLstn(evnt, evntHndlr, evntHndlrName)
{
    window.curEvntHdlr = evnt;
    if(window.curEvntHdlr !=null)
    {
    //alert('attach listener 2')
      evnt = new Function(evntHndlr);
    }
    else
    {
    //alert('attach listener 3')
      evnt = evntHndlrName;
    }
}

//This function is added as a part of tracker 8413. It takes div id as a parameter and displays only those drop downs which are on that div,
// remaining drop downs are disabled to avoid rendering issue
function displayDD(id)
{
    var msgInt =getElemnt(id);
    var sel=msgInt.getElementsByTagName("SELECT")

    for(i=0;i<sel.length;i++)
     {
        sel[i].style.visibility="visible";
     }
}

// Triggered every minuted to just hit the server and come back to make sure that the session does not get timed out.
function triggerAjaxSubmit()
{
    jax_hitServer();
}

var reqMessageStatus;
// Note this needs to be set  what action has to be used, By default it will be "view".
var submitActionMethod = "view";

function jax_hitServer()
{
    reqMessageStatus = createXMLHttpRequest();

    if (reqMessageStatus)
    {
        var url = 'ajaxhelper.do?method=keepsessionactive';
        reqMessageStatus.open("GET", url, true);
        reqMessageStatus.onreadystatechange = jax_returnServer;
        reqMessageStatus.send(null);
    }
}

function jax_returnServer()
{
    if (reqMessageStatus.readyState == 4)
    {
        if (reqMessageStatus.status == 200)
        {
            // Invoke SessionManagement.resetSessionTime() to reset session counter.
        	SessionManagement.resetSessionTime();
			
			var calleProcessComplete = reqMessageStatus.getResponseHeader("processcomplete");

            if(calleProcessComplete != null && calleProcessComplete == "true")
            {
                fsubmit(submitActionMethod);
            }
            else
            {
                // make the next call in 1 minute
                setTimeout('triggerAjaxSubmit()', 60000);
            }
        }
    }
}


function createXMLHttpRequest()
{
   try { return new XMLHttpRequest(); } catch(e) {}
   try { return new ActiveXObject("Msxml2.XMLHTTP"); } catch (e) {}
   try { return new ActiveXObject("Microsoft.XMLHTTP"); } catch (e) {}
   alert("XMLHttpRequest not supported");
   return null;
 }

// fuunction to handle the scroll on tables which have either title or title+cols frozen.
function scrl(obj, moveleft, movetop)
{
	if(typeof cal != 'undefined')
	{
		cal.hideCalendar();
	}
    hide("mask");
    if (moveleft && moveleft.length > 0 && getElemnt(moveleft))
        getElemnt(moveleft).scrollLeft=obj.scrollLeft;
    if (movetop && movetop.length > 0 && getElemnt(movetop))
        getElemnt(movetop).scrollTop=obj.scrollTop;

	// set data only when data table moves as title table will set y value to 0 and cause issue in firefox
    if (obj.id.indexOf("DATA_") >=0 )
    {
        moved_dtl_x=obj.scrollLeft;
        moved_dtl_y=obj.scrollTop;
    }

}

var iOpacity=50;
function fade(objname)
{
	var obj = getElemnt(objname)
	if (iOpacity==0)
	{
        obj.parentNode.removeChild(obj);
		iOpacity=50;
	}
	else
	{

    	obj.style.opacity = ((iOpacity*2) / 100);
        obj.style.MozOpacity = ((iOpacity*2) / 100);
        obj.style.KhtmlOpacity = ((iOpacity*2) / 100);
		obj.style.filter = 'alpha(opacity='+(iOpacity*2)+')';

		iOpacity = iOpacity-1;

		abc = setTimeout("fade('"+objname+"')", 100);
	}
}

function fireJS(html)
{
    var startTag = "<SCRIPT LANGUAGE=JAVASCRIPT>";
    var endTag = "</"+"SCRIPT>";
    // alert("In FireJS");
    var temp = html;

    if(html != null && html.length > 0)
    {
      var oScr = document.createElement("script");
      //       if (id) oScr.id = id;
      document.getElementsByTagName("head")[0].appendChild(oScr);

      var jsScript = "";

        while(true)
        {
            var sindex = temp.toUpperCase().indexOf(startTag);
            if(sindex < 0) break;
            var eindex = temp.toUpperCase().indexOf(endTag,sindex);
            var js = temp.substring(sindex+startTag.length,eindex);
            // talert(js);
            // eval(js);
            jsScript+= js;
            temp = temp.substring(eindex+9);
        }

        temp = html;
        startTag = "<SCRIPT LANGUAGE=\"JAVASCRIPT\">";
        while(true)
        {
            var sindex = temp.toUpperCase().indexOf(startTag);
            if(sindex < 0) break;
            var eindex = temp.toUpperCase().indexOf(endTag,sindex);
            var js = temp.substring(sindex+startTag.length,eindex);
            // talert(js);
            // eval(js);
            jsScript+= js;
            temp = temp.substring(eindex+9);
        }

        temp = html;
        startTag = "<SCRIPT LANGUAGE='JAVASCRIPT'>";
        while(true)
        {
            var sindex = temp.toUpperCase().indexOf(startTag);
            if(sindex < 0) break;
            var eindex = temp.toUpperCase().indexOf(endTag,sindex);
            var js = temp.substring(sindex+startTag.length,eindex);
            // talert(js);
            // eval(js);
            jsScript+= js;
            temp = temp.substring(eindex+9);
        }

        temp = html;
        startTag = "<SCRIPT TYPE=\"TEXT/JAVASCRIPT\">";
        while(true)
        {
            var sindex = temp.toUpperCase().indexOf(startTag);
            if(sindex < 0) break;
            var eindex = temp.toUpperCase().indexOf(endTag,sindex);
            var js = temp.substring(sindex+startTag.length,eindex);
            // talert(js);
            // eval(js);
            jsScript+= js;
            temp = temp.substring(eindex+9);
        }

        temp = html;
        startTag = "<SCRIPT LANGUAGE=\\\"JAVASCRIPT\\\">";
        while(true)
        {
            var sindex = temp.toUpperCase().indexOf(startTag);
            if(sindex < 0) break;
            var eindex = temp.toUpperCase().indexOf(endTag,sindex);
            var js = temp.substring(sindex+startTag.length,eindex);
            // talert(js);
            // eval(js);
            jsScript+= js;
            temp = temp.substring(eindex+9);
        }

        if(jsScript.length > 0)
        {
        // alert("jsScript:\n" + jsScript);
            oScr.text=jsScript;
        }
    }
}

/*
navinfo contain url ->page.do
This function opens the PLM screen with the given information
.do will convey which screen to open
*/

function _gotoPMLScreen(navInfo, targetMethod)
{
	//alert("targetMethod "+ targetMethod);
	//Tracker#: 16791 SAFARI - GOTO TECHSPEC FROM RECENTLY VIEWED DOCUMENTS AND FAVORITES DOES NOT WORK
	//changing the call for the showing of the tech spec overvierw screen
	window.location.href = "plm.do?method=plmnavigate&navinfo="+navInfo + "&targetMethod="+targetMethod;
}

////////////////////////Added the below functions as a part of tracker 11406/////////////////
var cnt=0;
function addData(val, tagdoc, tagdocview, level)
{
    tipX = mX;
    tipY = mY;

    var d = new Date();
    //Tracker#: 15830 RFQ SCREEN DOESN'T SAVE ON CERTAIN PATTERN OF DATA ENTRY
    //The popup window (it is the tooltip icon in the material section) should not open up new window when RFQ is new 
    if (!isValidRecord('URL', 'N'))
    {
        return;
    }    
    //Tracker#: 15970 RFQ SCREEN DOESN'T SAVE IMAGE ON TRYING TO SAVE 'FIBER CONTENT PERCENTAGE'
    //Any fields edited before clicking smart tag, show message 'There are changes on screen.Do you want to save changes before current action'.
    //If click 'OK', it will save otherwise refresh the page.
    var tagDisp = true;
    if (getval('chgflds') != "")
    {
        if (confirm(szMsg_Changes))
        {            
            fsubmit(szSAVE);
            tagDisp = false;
        }
        else
        {
        	fsubmit('refresh');
        	tagDisp = false;        	       
    	}
    }
    if (tagDisp)
    {
	    if (frames['tss_frame'])
	    {
	   		//chcek the changed fields, whether the code field is changed.
	   		var url = 'itemmaterials.do?method=addData&row_no='+nCurRow+"&cnt="+d.getTime()+'&chgflds='+getval('chgflds')
			if (window.XMLHttpRequest)
	    	{
	        	req = new createXMLHttpRequest();
	    	}
	   		else if (window.ActiveXObject)
	    	{
	        	req = new ActiveXObject("Microsoft.XMLHTTP");
	    	}
	   		if (req)
	    	{
		        req.open("GET", url, true);
		        req.onreadystatechange = showItemMaterialInfo;
		        req.send();
	    	}
	    }
	}
}

function showItemMaterialInfo()
{
    if (req.readyState == 4)
    {
        if (req.status == 200)
        {
		   // Invoke SessionManagement.resetSessionTime() to reset session counter.
           SessionManagement.resetSessionTime();
		   	
           hide('preprint');
           var msg = req.responseText;
           if (msg != '')
           {
            //alert user if the code field of item material is blank.
            if(msg=='Code is required')
            {
              msg=getMessage();
              alert(msg);
            }
            else
            {
             top.showTip(msg);
            }
           }

        }
    }
}

function saveMaterialData()
{
  var d = new Date();
  if (getval('chgflds') == '')
  {
   alert(szMsg_No_change)
  }
  else
  {
  var chdArray=getval('chgflds').split(',');

  var values="";
  for(var i = 0 ; i < chdArray.length-1; i++)
  {
    var val=getval(chdArray[i]);
    if(val=='')
    {
     val="0000";
    }
    values+=val+","
  }

   var url = 'itemmaterials.do?method=savedata&row_no='+nCurRow+'&chgflds='+getval('chgflds')+'&values='+values+"&cnt="+d.getTime()
   if (window.XMLHttpRequest)
    {
        req = new createXMLHttpRequest();
    }
   else if (window.ActiveXObject)
    {
        req = new ActiveXObject("Microsoft.XMLHTTP");
    }
   if (req)
    {
        req.open("GET", url, true);
        req.onreadystatechange = saveItemMaterialInfo;
        req.send();
    }
    }
}

function saveItemMaterialInfo()
{
    if (req.readyState == 4)
    {
        if (req.status == 200)
        {
		   // Invoke SessionManagement.resetSessionTime() to reset session counter.
           SessionManagement.resetSessionTime();
		   
           hide('preprint');
           var msg = req.responseText;
           if (msg != '')
           {
            //validation is handled
             var index=msg.indexOf('_');
             if(msg=='failed')
             {
              //alert('Invalid Record');
               submitFrm('refresh');
             }
             else
              {
              hide('mask');
              setFieldValue(msg);
              setval('chgflds', '');
              submitFrm('db_refresh');
              }
           }

        }
    }
}

////////////////////////////end of function which are specifically added through the tracker 11406////////////////////////////////////

//function to write the contents of div TSSMSG into a new window and print it
function printmsg()
{
    var printhtml = '<HTML>\n<HEAD>\n';
    printhtml += '\n</HEAD>\n<BODY>\n';
    printhtml += document.getElementById("TSSMSG").innerHTML;
    printhtml += '\n</BODY>\n</HTML>';

    var printWin = window.open(document.forms[0].action,"printmsg");
    printWin.document.open();
    printWin.focus();
    printWin.document.write(printhtml);
    printWin.document.getElementById("msgLinks").style.display="none";
    printWin.document.close();
    printWin.print();
}

    // Tracker#:  11583  ADD DETAILED DESC TO POM CODES TABLE
    // closeMsg js method is overridden by some of the other screens,
    // this will decide whether the reset the Changed fields hidden variable
    // or not.
    var resetChgFldsOnMsgClose = true;

    // -----------------------------------------------------
    // Tracker#:  11583  ADD DETAILED DESC TO POM CODES TABLE
    // Moved the js methods from fiteval.jsp, as these needs to be
    // used by accessed by more than one screen(Ex: fiteval, pom model, pom worksheet etc.,
	function showNotesMsg(hiddenObjName, readOnly)
	{
		var bClose = true;
		var winW = document.body.clientWidth;
		var winH = document.body.clientHeight;
		var waitW = getElemnt('showMsg');
		if (waitW)
		{
			eval('document.'+FRM+'.removeChild(waitW)');
		}
		var szMsg_Close             = 'Close';
		var msg = "";
		if (bClose)
		{
			msg+='<table width=100%><tr><td><center><a href="#" onClick="closeMsg()">' + szMsg_Close + '</a></center></td></tr></table>';
		}

		waitW = new DOMWindowWithTextArea(msg , "showMsg", "10pt", "#006699", "#FFFFFF", hiddenObjName, readOnly)
		eval('document.'+FRM+'.appendChild(waitW)');
        resetChgFldsOnMsgClose = false;
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

		waitW.style.top = parseInt(winH/2) - (waitW.offsetHeight/2) + "px";
		waitW.style.left = parseInt(winW/2) - (waitW.offsetWidth/2) + "px";


		setZValue(waitW,++cur_z);

	}

	// create a new div with provided properties
    // create a new div with provided properties
    function DOMWindowWithTextArea(text, idn, fs, bdrclr, bgclr, hiddenObjName, isReadOnly)
    {
        var oa = document.getElementsByName(hiddenObjName);
        var hiddenObjValue = "";
        if(oa)
        {
            var oa = oa[0];
            hiddenObjValue = oa.value;
        }
        var READONLY = "";
        if(isReadOnly)
        {
            READONLY = "READONLY";
        }
        var textArea = "<textarea rows=\"10\" cols=\"20\" name=\"notesArea\" onChange=\"cfnotestextarea(this, '" + hiddenObjName +"')\" onKeyDown='notestextareaCtrl(this,250,\"" + hiddenObjName + "\");'  onKeyUp='notestextareaCtrl(this,250, \"" + hiddenObjName + "\");' onFocus=\"setFieldLevel(2);\" " + READONLY + " >" + hiddenObjValue + "</textarea>";
        var rtn = CreateLocalDiv("<center><table><tr><td nowrap style='font-size:"+fs+";padding:10px;background:"+bgclr+";text-align:center'>"+textArea + text + "</td></tr></table></center>", idn)
        rtn.style.backgroundColor = bdrclr
        rtn.style.visibility = "visible"
        rtn.style.padding= "1px 1px 1px 1px"
        return rtn;

    }

    // check for textarea value while the data is being entered and alert the user once they reach the limit
    function notestextareaCtrl(field, maxlimit, hiddenObjName)
    {
    	//alert("notestextareaCtrl");
        if (field.value.length > maxlimit) // if too long...trim it!
        {
        	if(hiddenObjName==null)
        	{
        		//alert("replaced hidden");
        		hiddenObjName = field.getAttribute("name");
        	}	
        		
            if(!cfnotestextarea(field, hiddenObjName))
            {
            	return false;
            }
            
            field.value = field.value.substring(0, maxlimit);
            szMaxlen = maxlimit+'';   // set the var to be used in the alert.
            var TempMsg = szMsg_Maxlen_Limit;
            TempMsg = replacevalstr(TempMsg, "#szMaxlen#", szMaxlen);
            //Tracker#:20031 NO MESSAGE IS DISPLAYED WHEN ATTACHMENT DESC HAS TOO MANY CHARACTERS
            //get length of the text area include newline charter.
            var len = actualLength(field.value);
            
            //trim field value by len equal to aditional length of new line charter.
            if(len>maxlimit)
            {            	
            	len  = len - maxlimit;
            	maxlimit = maxlimit - len;
            	field.value = field.value.substring(0, maxlimit);
            }
            //alert(TempMsg);   // max length exceed msg
            //Tracker#: 15882 COMMENTS FIELD ON FIT EVAL ALLOWS OVER 250 AND THROWS UNFRIENDLY DATABASE ERROR MESSAGE
            //Warning message should be displayed in the PLM style so adding the error object
            var errObj = new htmlErrors();
			if(errObj)
			{
				errObj.addWarning(TempMsg);
				objMsgDiv = new messagingDiv(errObj);
		    }			
			
            cfnotestextarea(field, hiddenObjName);  // call the onchange event as this check is causing the onchange event to be false.
        }
    }

    //Tracker#:20031 NO MESSAGE IS DISPLAYED WHEN ATTACHMENT DESC HAS TOO MANY CHARACTERS
    //Calculates length of the String including the new line charcter.
    function actualLength(str) 
    {
		 if (!str)
		 {
		    return 0;
		 }
		 var lns = str.match(/[^\r]\n/g);
		 
		 if (lns)
		 {	
		  	return str.length + lns.length;
		 } 
		 else
		 {				
		  	return str.length;
		 }
	}

    function cfnotestextarea(obj, hiddenObjName)
    {
        if (obj.type == 'text' && !specialCase)
        {
            if (obj.value.indexOf('"') != -1)
            {
                //alert(szMsg_Double_Quote);   // double quote not allowed
            	
            	var errObj = new htmlErrors();
    			if(errObj)
    			{
    				errObj.addWarning(szMsg_Double_Quote);
    				objMsgDiv = new messagingDiv(errObj);
    		    }
    			
                obj.value = "";
                return false;
            }
        }
        cfbyname(hiddenObjName);
        var oa = document.getElementsByName(hiddenObjName);
        if(oa)
        {
            oa = oa[0];
            oa.value = obj.value;
        }

        specialCase = false;
        // execute the onChange if it exists
        if (oa.onchange)
        {
        	oa.onchange();
        }
        
        return true;
    }

// -----------------------------------------------------------------------------------
// Tracker#: 13528 CHANGE THE NAVIGATION(MENU) ALL SEARCH SCREENS TO BE SIMILAR TO DESIGN CENTER MODULE
// Handle the OnKeypress events for all the Input text boxes.
// This is to mimic the Submit type Button action
// Tracker#: 13821 - javascript error on Order, payment and packinglist builder screen.
// -----------------------------------------------------------------------------------
function searchOnEnterKeyPress(objFld)
{
	 var key = "";

     if(window.event)
     {
		key = event.keyCode; //IE
	 }
	 else
	 {
		key = e.which; //firefox
	 }
     // If the presses key is "Enter" then update the chgflds hidden
     // variable and submit the search form.
	 if(key == '13')
	 {
	 	objFld.onchange();
	 	ssNew('search');
	 }
}
// -----------------------------------------------------
// Tracker# 14075: ADD MESSAGE ONLY ONE SAMPLE SIZE MAY BE USED WHEN CREATING A FIT EVAL
// -------------------------------------------------------------------
// This will be called from 3 places POM Model, POM Worksheet association(Sourcing) and
// POM worksheet association(PLM)
// This can be used by any other screen for a similar requirement.
//
// params :
//
// obj: The current Check bos that is being checked or unchecked
// occ: Row no - Repetative check boxes with the same name
// checkBoxName
// bSkip - boolean to skip the uncheck of other checkboxes.

function SelOneChkbox(obj, occ, checkBoxName, bSkip)
{
    // UnCheck all other check boxes except for the current one that has been either checked or unchecked.
    var cnt = 0,
    	fullName = checkBoxName + "_" + cnt,
    	chkObj = getElemnt(fullName) || $('input[name="' +fullName+ '"]')[0];
	//Tracker#:20468If multiple selection allowed
	//do not reset the checkboxes
    while(chkObj && !bSkip)
    {
        if (cnt != occ  && chkObj.checked)
        {
            chkObj.checked = false;
            chkObj.value = "N";
            // Changing the checked status so register this
            // field as changed field to the changedfields list.
            cf(chkObj);
        }
        cnt++;
        fullName = checkBoxName + "_" + cnt;
        chkObj = getElemnt(fullName) || $('input[name="' +fullName+ '"]')[0];
    }

    if(obj.checked)
    {
        // setChangedFields method in Action expects the value to be "Y" and not
        // just any value.
        obj.value = "Y";
    }
    else
    {
        obj.value = "N";
    }
    cf(obj);
}

//Tracker#14192 2009 UI: OUTSTANDING SOURCING SCREENS IN RELEASE 2009 - PART 2 OF 3
//Common function for search screens.
//Function called on click of 'Reset' button.
function resetValues()
{
    var defaultOps = getDefaultOperators();
    var docForm = document.forms[0];
    var formElem;

    for (i = 0; i < docForm.elements.length; i++)
    {
        formElem = docForm.elements[i];
        var name = formElem.name;

        if(name.indexOf('F') < 0)
        {
           continue;
        }

        if (formElem.type == 'text' || formElem.type == 'textarea')
        {
            formElem.value = '';
        }
        else if(formElem.type == 'select-one')
        {

          var fieldType = name.substring(eval(name.lastIndexOf('_')) + 1,name.length);

          if(fieldType == 'op')
          {
             var foundField = new Boolean(false);

	          for(j = 0 ;j < defaultOps.length ; j++)
	          {
	             var fieldOperator = defaultOps[j].split(',');

	             if(name == fieldOperator[0])
	             {
	                 formElem.value = fieldOperator[1];
	                 foundField = new Boolean(true);
	                 break;
	             }
	          }

	          //default operator
	          if(foundField == false)
	          {
	             formElem.value = '2';
	          }
          }
          else
          {
             formElem.options[0].selected = true;
          }
        }
    }
    setval('chgflds','');
}

// -----------------------------------------------------------------------------------
// Tracker#: 15218 QUICK SEARCH NOT WORKING CORRECTLY IN VERSION 2010
// Handle the onkeypress for the quick search text control.
// This is to mimic the Submit type Button action when user clicks on Enter
// and expects the Search results.
// -----------------------------------------------------------------------------------
function qsOnEnterKeyPress(objFld)
{
	 var key = "";

     if(window.event)
     {
		key = event.keyCode; //IE
	 }
	 else
	 {
		key = e.which; //firefox
	 }
     // If the presses key is "Enter" then update the chgflds hidden
     // variable and submit the search form.
	 if(key == '13')
	 {
	 	objFld.onchange();
	 	// Fire the same event handler as on the "Go" button click.
        qs();
	 }
}

// -----------------------------------------------------
//Tracker#: 15904 SAMPLE REQUEST COLOR, SIZE, QTY POP-UP GETS STUCK IF THERE IS A SCROLL BAR IN THE POP UP
//Function that will cancel the parent events only on the click of the scrollbar
//Function changed so drag and drop is only restricted to the header of the smarttag 
function _cancelParentEvents(event)
{
    event.cancelBubble=true;
}

function isNotNull(obj)
{
    return (typeof obj != 'undefined' && obj != 'null' && obj != null);
}

function isNull(obj)
{
    return (obj == null || typeof(obj) == 'undefined');
}


// print the screen - plm and sourcing
var htmlprintscr = {};

//sourcing print
htmlprintscr.sourcing = function()
{
    htmlprintscr.tssprint('S');
}

//plm print
htmlprintscr.plm = function()
{
    htmlprintscr.tssprint('P');
}

// main print
htmlprintscr.tssprint = function (app)
{
    var nWindow = window.open("", 'print','toolbar=yes,menubar=yes,scrollbars=yes,resizable=yes,width=800,height=600');
	nWindow.document.open();
    nWindow.focus();
    nWindow.document.write("<html><body><form>");
    if (app && app == 'S')
    {
    	// include certain css for formatiing
	    nWindow.document.write('<link rel="stylesheet" type="text/css" media="screen" href="css/htmlcomponents.css" />');
    	nWindow.document.write('<link rel="stylesheet" type="text/css" media="screen" href="css/sourcing.css" />');

    	var i = 0;
	    while (i < nTotalLvl)
	    {
	        if (getElemnt('pglvl'+i))
	        {
		        nWindow.document.write(getElemnt('pglvl'+i).innerHTML + "<BR>");
		    }
		    i++;
	    }

    }
    else // plm
    {
    	// include css for formatiing
		nWindow.document.write('<link rel="stylesheet" type="text/css" media="screen" href="css/htmlcomponents.css" />');
        // print workarea html
        nWindow.document.write(getElemnt('_divDataWorkArea').innerHTML);
        nWindow.document.getElementById('_gridTable').style.visibility='hidden';
    }

    nWindow.document.write("</form>");
    nWindow.document.write("<script language='javascript'>");
    // disable most of the objects on the screen
    nWindow.document.write("var imags = document.images;");
    nWindow.document.write("for (i=0; i < imags.length; i++){if (imags[i].src.indexOf('valsearch.gif') > 0 || imags[i].src.indexOf('calen.gif') > 0 || imags[i].src.indexOf('tip.gif') > 0 || imags[i].src.indexOf('arrow') > 0)            imags[i].style.visibility='hidden';    }");
    nWindow.document.write("var divs = document.getElementsByTagName('div');var divslen = divs.length;for(var i=0; i < divslen; i++){var singleDiv = divs[i];if(singleDiv.id && singleDiv.id.length > 0 && singleDiv.style.visibility!='hidden'){singleDiv.style.width=singleDiv.scrollWidth+'px';}}");
    nWindow.document.write("");
    nWindow.document.write("");
    nWindow.document.write("");
    nWindow.document.write("</script>");
    nWindow.document.write("</form></body></html>");

	nWindow.document.close();
    nWindow.print();
}

//Tracker#:20812 read the screen save handler defined/default.
function _getScreenSaveHandler()
{
	var saveHdlr = "saveWorkArea()";
    var objCont = getElemnt(szScreen_SaveHandler);
    
    if(objCont && objCont.value)
    {
    	saveHdlr = objCont.value;
    }
    
    return saveHdlr;
}

//Tracker#:20812 read the screen save handler defined/default.
function _getSaveFunc()
{
	var saveFunc = "1";
    var objCont = getElemnt(szPerformSave);
    
    if(objCont && objCont.value)
    {
    	saveFunc = objCont.value;
    }
    
    return saveFunc;
}

// adding intl number format check in parseFloat
var origParseFloat = parseFloat;
parseFloat = function(str) {
	if(Decimal != ".") {
		str = replacevalstr(str, Decimal, ".");
	}
	return origParseFloat(str);
}

// set/get current object
var _focusedObj;
function _setCurObj(obj)
{
	_focusedObj = obj;
}

function _getCurObj()
{
	return _focusedObj;
}

//Tracker#:25822 PO REPORT NOT WORKING IN NEW TABBED PO SCREEN
function printReport(id, level, name)
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

        var str = 'report?id=' + id + '&method=customreports' + '&level=' + level + '&reportname=' + name;
        oW('report', str, 800, 650);
    }
}

function htmlEscape(value) {
	return value.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/'/g, '&#039;')
		.replace(/"/g, '&quot;');
}
