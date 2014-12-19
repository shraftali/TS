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
/**
 * Tracker#:26739 DISPLAY ENTER COLOR QTY POP UP The Enter Color Qty pop up
 * specific functions
 * Author#Preeti
 */

var CQ = {};
// variable holds the horizontal scroll bar on the sell channel div
var scrleft = 0;
var scrTop = 0;

/**
 * This function is used to scroll all qty divs and colorway div Only one
 * vertical scroll bar is used to scroll other div data
 * 
 * @param scCount
 */
CQ.scrolldiv = function scrolldiv(scCount) {
	var scrdiv = document.getElementById("scrlmaindiv");
	var clrdiv = document.getElementById("colorwaydiv");
	var intElemScrollTop = scrdiv.scrollTop;

	clrdiv.scrollTop = intElemScrollTop;
	for (var k = 0; k < scCount; k++) {
		var qtydiv = document.getElementById("qtydiv" + k);
		if (qtydiv) {
			qtydiv.scrollTop = intElemScrollTop;
		}
	}
}

/**
 * Adding function to handle key events which focuses on next text box The
 * single function handles all key events like tab, arrow keys(left,right,up and
 * down)
 * 
 * @param rowno
 * @param count
 * @param event
 */
CQ.qtyKeyEvents = function qtyKeyEvents(rowno, count, event) {

	var keyCode;
	if (window.event)
		keyCode = window.event.keyCode; // IE
	else
		keyCode = event.which; // Firefox

	// If key presses in arrow down
	if (keyCode == 40) {
		// increment row no
		rowno++;
		// get field of next row
		var fld = "qtytxt[" + rowno + "][" + count + "]";
		// focus on next row column
		CQ.setFocus(fld, event);
	}
	// If up arrow is pressed
	if (keyCode == 38) {
		// decrement the row no
		rowno--;
		// get field id
		var fld = "qtytxt[" + rowno + "][" + count + "]";
		// set focus on the up text box
		CQ.setFocus(fld, event);
	}
	if (keyCode == 37) {
		// event is left key is pressed decrement the row no
		count--;
		// get field id
		var fld = "qtytxt[" + rowno + "][" + count + "]";
		// alert("sub func");
		var qtyfld = document.getElementById(fld);
		if (qtyfld == null || qtyfld == '' || qtyfld == 'undefined') {
			count--;
			// get field id
			fld = "qtytxt[" + rowno + "][" + count + "]";
		}
		// set focus on the up text box
		CQ.setFocus(fld, event);
	}
	if (keyCode == 39) {
		// right key is pressed;decrement the row no
		count++;
		// get field id
		var fld = "qtytxt[" + rowno + "][" + count + "]";
		var qtyfld = document.getElementById(fld);
		if (qtyfld == null || qtyfld == '' || qtyfld == 'undefined') {
			count++;
			// get field id
			fld = "qtytxt[" + rowno + "][" + count + "]";
		}
		// set focus on the up text box
		CQ.setFocus(fld, event);
	}

	// If the event is tab focus on next row
	if (keyCode == 9) {
		// increment the column count to focus on next column
		count++;
		var fld = "qtytxt[" + rowno + "][" + count + "]";
		// alert(count);
		var qtyfld = document.getElementById(fld);
		if (qtyfld != null && qtyfld != '' && qtyfld != 'undefined') {
			// focus on text field
			qtyfld.focus();
			event.preventDefault();
		} else {
			// If last cell focus to next row
			if (totCellCount == count) {
				// If the column is last column of the row
				// focus on the next row first column
				// increment row no
				rowno++;
				// reset count to 0
				count = 0;
				// get the first column of next row
				fld = "qtytxt[" + rowno + "][" + count + "]";
				CQ.setFocus(fld, event);

			} else {
				// reset count to 0
				count++;
				// get the first column of next row
				fld = "qtytxt[" + rowno + "][" + count + "]";
				var qtyfld = document.getElementById(fld);
				if (qtyfld != null && qtyfld != '' && qtyfld != 'undefined') {
					// focus on text field
					qtyfld.focus();
					event.preventDefault();
				} else if (totCellCount == count) {
					// If the column is last column of the row
					// focus on the next row first column
					// increment row no
					rowno++;
					// reset count to 0
					count = 0;
					// get the first column of next row
					fld = "qtytxt[" + rowno + "][" + count + "]";
					CQ.setFocus(fld, event);

				}

			}
		}
	}
}

/**
 * set the focus on the text box
 */
CQ.setFocus = function setFocus(fld, event) {

	// alert("sub func");
	var qtyfld = document.getElementById(fld);
	if (qtyfld != null && qtyfld != '' && qtyfld != 'undefined') {
		// focus on the text field
		qtyfld.focus();
		event.preventDefault();
	}
}

var totCellCount = 0;
var totrwCount = 0;
CQ.setCellInx = function setCellInx(totColCount, rwCount) {

	totCellCount = totColCount;
	totrwCount = rwCount;
	CQ.setFlwClrStatus(totColCount, rwCount);
}

CQ.getCellInx = function getCellInx() {

	return totCellCount;
}

// select all the check boxes of color row
CQ.selectRw = function selectRw(count, e) {
	// alert("e "+e);

	var totCols = CQ.getCellInx();
	// alert("totCols " + totCols);
	// while (chkbox)
	for (var k = 0; k < totCols - 1; k++) {
		// var k = 0;
		var fld = "chk[" + count + "][" + k + "]";
		// alert("fld " + fld);
		var chkbox = document.getElementById(fld);

		var parentid = "clr" + k + count;
		// alert("parentcell " + parentid);
		var parentcell = document.getElementById(parentid);

		// alert("parentcell " + parentcell);
		if (parentcell == null || parentcell == '' || parentcell == 'undefined') {
			k++;
			parentid = "clr" + k + count;
			// alert("parentcell" + parentid);
			parentcell = document.getElementById(parentid);
		}

		if (chkbox) {
			var chkval = chkbox.getAttribute("value");
			// alert("chkval " + chkval);
			if (e.checked == true) {
				parentcell.style.background = "#87CEEB";
			} else {
				if (chkval == 0) {
					// chkbox.checked = false;
					// chkbox.disabled = true;
					parentcell.style.background = "#FFFFFF";
				} else {
					parentcell.style.background = "#E5E5E5";
				}
			}
		} else {
			if (e.checked == true) {
				// chkbox.checked = true;
				// chkbox.disabled = false;
				parentcell.style.background = "#87CEEB";
			} else {
				parentcell.style.background = "#FFFFFF";
			}
		}

	}
}

/**
 * Check for the selection of flow level or color level selection of checkboxes
 * If any check box is selected enable the buttons on the screen to execute the
 * process Finalize color and reset color status
 */
CQ.checkSelectedFlwClr = function checkSelectedFlwClr() {

	var rwCount = totrwCount;
	// Check whether flows are selelected
	var count = 0;
	var colCount = CQ.getCellInx();
	for (var k = 0; k < colCount; k++) {
		var fld = "flowchk" + k;
		// alert(fld);
		var chkfld = document.getElementById(fld);
		if (chkfld) {
			if (chkfld.checked == true) {
				count++;
				break;
			}
		}

	}

	var rcount = 0;
	if (count > 0) {
		// alert("buttons can be enabled");
		CQ.enableButtons(rwCount);
	} else {
		// Check whether colors are selected
		for (var i = 0; i < rwCount; i++) {
			var fld = "chk" + i;
			// alert(fld);
			var chkfld = document.getElementById(fld);
			// alert(chkfld);
			if (chkfld) {
				if (chkfld.checked == true) {
					rcount++;
					break;
				}
			}
		}
	}
	// alert(rcount);
	if (rcount > 0) {
		// alert("buttons can be enabled1");
		CQ.enableButtons(rwCount);
	}
	// if no flow or color row is selected display the buttons as disabled
	if (rcount == 0 && count == 0) {
		CQ.disableButtons();

	}
}

// disable finalize color and reset color status button on the pop up
CQ.disableButtons = function disableButtons() {

	var finalbutton = document.getElementById("finalizeclrbtn");
	if (finalbutton) {
		$("#finalizeclrbtn").removeClass();
		// set the style class, to display the buttons as disabled
		finalbutton.className = "clsbtnstatus clspassiv";
		// reset the onclick event
		finalbutton.onclick = '';
	}

	var resetbutton = document.getElementById("resetclrbtn");
	if (resetbutton) {
		$("#resetclrbtn").removeClass();
		// set the style class, to display the buttons as disabled
		resetbutton.className = "clsbtnstatus clspassiv";
		// reset the onclick event
		resetbutton.onclick = '';
	}

}

/**
 * Execute the processses finalize color and reset color status
 * 
 * @param act
 * @param rwCount
 */
CQ.executeClrProcess = function executeClrProcess(act, rwCount) {
	// alert("finalized color " + act);
	// alert("rwCount " + rwCount);
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objHtmlData = htmlAreaObj.getHTMLDataObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var chgfls = document.getElementById("chgflds");
	var chgHolder = "";
	if (chgfls) {
		chgHolder = chgfls.value;
	}
	if (chgHolder != null && chgHolder != "") {
		/*
		 * var htmlErrors = objAjax.error(); htmlErrors.addError("confirmInfo",
		 * szMsg_Changes, false); var cancelFunc = "CQ.executeClrLvlProc('" +
		 * act + "', '" + rwCount + "')"; messagingDiv(htmlErrors,
		 * "CQ.saveClrQty()", cancelFunc); return;
		 */

		var htmlErrors = objAjax.error();
		htmlErrors
				.addError(
						"warningInfo",
						"There are changes on the screen. Save the changes before executing the process(s)",
						false);
		_displayProcessMessage(objAjax);

	} else {
		CQ.executeClrLvlProc(act, rwCount);
	}

}

/**
 * Get the selected checkbox and execute the process
 * 
 * @param act
 * @param rwCount
 */
CQ.executeClrLvlProc = function executeClrLvlProc(act, rwCount) {
	// alert("execute process at color level " + act);
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objHtmlData = htmlAreaObj.getHTMLDataObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var selectedchk = "";
	var totCols = CQ.getCellInx();
	// alert("rwCount " + rwCount);
	// alert("totCols " + totCols);

	// check for the selection of flows
	for (var k = 0; k < totCols; k++) {
		var fld = "flowchk" + k;
		var flwchkbox = document.getElementById(fld);
		// If the checkbox is selected, exexute the process
		if (flwchkbox && flwchkbox.checked == true) {
			for (var count = 0; count < rwCount; count++) {
				var chkfld = "chk[" + count + "][" + k + "]";
				var chkbox = document.getElementById(chkfld);
				// If checkbox exists
				if (chkbox) {
					var txtfld = "qtytxt[" + count + "][" + k + "]";
					var changedObj = document.getElementById(txtfld);
					var keyInfo = changedObj.getAttribute("keyinfo");
					// objAjax.parameter().add(keycol, keyInfo);
					if (selectedchk == null || selectedchk == "") {
						selectedchk = keyInfo;
					} else {
						selectedchk = selectedchk + "," + keyInfo;
					}
				}
			}
		}
	}

	// check for selected colors
	for (var count = 0; count < rwCount; count++) {
		var rwfld = "chk" + count;
		var rwchkbox = document.getElementById(rwfld);
		// If the color row checkbox is selected, execute the process
		if (rwchkbox && rwchkbox.checked == true) {
			for (var k = 0; k < totCols; k++) {
				var chkfld = "chk[" + count + "][" + k + "]";
				var chkbox = document.getElementById(chkfld);
				// If checkbox exists
				if (chkbox) {
					var txtfld = "qtytxt[" + count + "][" + k + "]";
					var changedObj = document.getElementById(txtfld);
					var keyInfo = changedObj.getAttribute("keyinfo");
					// objAjax.parameter().add(keycol, keyInfo);
					if (selectedchk == null || selectedchk == "") {
						selectedchk = keyInfo;
					} else {
						selectedchk = selectedchk + "," + keyInfo;
					}
				}

			}
		}
	}

	// alert("selectedchk " + selectedchk);
	if (selectedchk == null || selectedchk == "") {
		// alert("select valid colors to execute the process");
		// If screen is not modified show the warning message
		var objAjax = new htmlAjax();
		objAjax.error().addError("warningInfo",
				"Select valid colors to execute the process", false);
		_displayProcessMessage(objAjax);

	} else {
		// alert("else part");
		CQ.restoreScrllBar();
		bShowMsg = true;
		objAjax.parameter().add("selchkbox", selectedchk);
		objAjax.setActionURL("colorqty.do");
		objAjax.setActionMethod(act);
		objAjax.setProcessHandler(CQ.reloadDiv);
		objAjax.sendRequest();

	}

}

/**
 * To enable the buttons set the style class and set the event
 * 
 * @param rwCount
 */
CQ.enableButtons = function enableButtons(rwCount) {

	var finalbutton = document.getElementById("finalizeclrbtn");
	if (finalbutton) {
		$("#finalizeclrbtn").removeClass();
		finalbutton.className = "clsbtnstatus";
		// set the click event to execute the process
		finalbutton.onclick = function() {
			CQ.executeClrProcess("finalizecolor", rwCount);
		};
	}

	var resetbutton = document.getElementById("resetclrbtn");
	if (resetbutton) {
		$("#resetclrbtn").removeClass();
		resetbutton.className = "clsbtnstatus";
		// set the onclick event to execute the process reset color for the
		// selected colors
		resetbutton.onclick = function() {
			CQ.executeClrProcess("resetcolor", rwCount);
		};
	}
}
// vertically select the colors by flow
CQ.selectFlowClrs = function selectFlowClrs(count, e) {

	var tot = totrwCount;

	for (var k = 0; k < tot; k++) {
		var fld = "chk[" + k + "][" + count + "]";
		var cellid = "cell[" + k + "][" + count + "]";
		var parentid = "clr" + count + k;
		// alert("parentcell" + parentid);
		var chkbox = document.getElementById(fld);
		var parentcell = document.getElementById(parentid);
		// var cell=document.getElementById(cellid);

		if (chkbox) {
			var chkval = chkbox.getAttribute("value");
			// alert(chkval);
			// alert("value"+chkbox.value);
			if (chkbox != null && chkbox != '' && chkbox != 'undefined') {
				if (e.checked == true) {
					// chkbox.checked = true;
					// /chkbox.disabled = false;
					parentcell.style.background = "#87CEEB";
				} else {

					if (chkval == 0) {
						// chkbox.checked = false;
						// chkbox.disabled = true;
						parentcell.style.background = "#FFFFFF";
					} else {
						parentcell.style.background = "#E5E5E5";
					}

				}
				// alert("checked");
			}
		} else {
			if (e.checked == true) {
				// chkbox.checked = true;
				// chkbox.disabled = false;
				parentcell.style.background = "#87CEEB";
			} else {
				parentcell.style.background = "#FFFFFF";
			}
		}
	}
}

// Select all colors of the colorway association
CQ.selectAllClrs = function selectAllClrs(count, e) {
	// alert("count " + count);
	for (var i = 0; i < count; i++) {
		// alert("k" + i);
		var fld = "chk" + i;
		var chkbox = document.getElementById(fld);
		// alert("chkbox " + chkbox);
		if (chkbox != null && chkbox != '' && chkbox != 'undefined'
				&& chkbox.disabled == false) {
			if (e.checked == true) {
				chkbox.checked = true;
				CQ.selectRw(i, chkbox);
			} else {
				chkbox.checked = false;
				CQ.selectRw(i, chkbox);
			}
		}
	}
}

// set the width of main div
CQ.setDivWidth = function setDivWidth(count) {
	var obj1 = getElemnt("mainscdiv");
	var obj2 = getElemnt("containerEnterColor");
	var obj3 = getElemnt("mainContdiv");
	// get color table
	var obj5 = getElemnt("colorwaytbl");
	// get scrollbar div
	var obj6 = getElemnt("scrlmaindiv");

	// sell channels width
	var w1 = obj1.offsetWidth;
	// sell channel label width
	var w2 = obj2.offsetWidth;
	// scrollbar width
	var w3 = obj6.offsetWidth;
	var winWdt = obj3.offsetWidth
	var totWdt = w1 + w2 + w3;

	if (totWdt > winWdt) {

		w2 = w2 + w3;
		var remWdt = winWdt - w2;
		obj1.style.width = remWdt + "px";
	}

	var colordiv = getElemnt("colorwaydiv");
	var reqht;// = h1 - h2 - h3;
	// height of color table
	var h4 = obj5.offsetHeight;
	var obj7 = getElemnt("emptycell");
	var h1 = $("#colorwaydiv").position().top;
	var h2 = $("#footerdiv").position().top;
	var ah = h2 - h1 - 50;
	// alert("h4-ah " + (h4 - ah));
	var diffh = h4 - ah;
	reqht = ah;
	if (diffh > 0 && diffh < 4) {
		reqht = h4;
	}

	if (h4 > reqht) {
		colordiv.style.height = reqht + "px";
		obj6.style.height = reqht + "px";
		for (var k = 0; k < count; k++) {
			var elm = "qtydiv" + k;
			var qtydiv = getElemnt(elm);
			if (qtydiv) {
				qtydiv.style.height = reqht + "px";
			}
		}

		$("#scrlmaindiv").css({
			position : "absolute",
			top : h1
		});

	} else {
		colordiv.style.height = h4 + "px";
		obj6.style.height = h4 + "px";
		for (var k = 0; k < count; k++) {
			var elm = "qtydiv" + k;
			var qtydiv = getElemnt(elm);
			if (qtydiv) {
				qtydiv.style.height = h4 + "px";
			}
		}
	}
	// alert("h2 " + h2);

	if (h4 > reqht) {
		// Setting the height of the scroll bar same as color div
		// Otherwisae all colorw were not shown by the scroll bar
		obj7.style.height = h4 + "px";
		obj6.style.overflowY = "scroll";
	}
}

// align the tables used for displaying the qty and for displaying qty label
CQ.alignTables = function alignTables(a, b, startIndex, endIndex, rowno) {
	for (c = startIndex; c < endIndex; c++) {

		var tab1 = a + c;
		var tab2 = b + c + rowno;

		var obj1 = getElemnt(tab1);
		var obj2 = getElemnt(tab2);

		if (obj1 && obj2) {
			var d1w = obj1.offsetWidth;
			var d2w = obj2.offsetWidth;
			var d;

			var pad1 = obj1.style.paddingRight + obj1.style.paddingLeft
					+ obj1.style.marginLeft + obj1.style.marginRight
					+ obj1.style.borderLeft + obj1.style.borderRight;

			var pad2 = obj2.style.paddingRight + obj2.style.paddingLeft
					+ obj2.style.marginLeft + obj2.style.marginRight
					+ obj2.style.borderLeft + obj2.style.borderRight;

			if (d1w > d2w) {
				d = d1w;
			} else {
				d = d2w;
			}

			if (a == 'totallbl') {
				if (d < 60) {
					d = 60;
				}
			}
			// set the width to obj1 and obj2
			setWidth(obj1, (d - pad1));
			setWidth(obj2, (d - pad2));

		}
	}
}
// show the color qty pop up when the 'Enter Color Qty' pop up is clicked from
// the search screen or the manage deliveries pop up.
CQ.showColorQty = function showColorQty(keyinfo, rwno) {

	var htmlAreaObj = _getAreaObjByDocView(190);
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	// set the url
	objAjax.setActionURL("colorqty.do");
	// set the view method
	objAjax.setActionMethod("showclrpopup");
	// set the quote key info
	objAjax.parameter().add("keyinfo", keyinfo);
	// set the current row no of the rowset
	objAjax.parameter().add("rwno", rwno);
	objAjax.setProcessHandler(CQ.colorQtyResponse);
	objAjax.sendRequest();
}

// set the width and height
CQ.colorQtyResponse = function colorQtyResponse(objAjax) {
	if (objAjax) {
		if (bShowMsg == true) {
			msgInfo = objAjax.getAllProcessMessages();
			if (msgInfo != "") {
				_displayProcessMessage(objAjax);
			}
		}
		if (objAjax.isProcessComplete()) {
			var height = $(window.parent).height() - 40;
			var width = $(window.parent).width() - 40;
			var colorqtypopup = new ColorQtyPopUp("ColorQtyPopUp",
					"Enter Color Quantity", objAjax.getResult(), height, width);
			colorqtypopup.show();
			CQ.alignVertScrlBar();
			// MCD.close();
		}
		objAjax = null;
	}
}

//Tracker#:27343 able to scroll all colors vertically
CQ.alignVertScrlBar = function alignVertScrlBar() {
	// sell channel details
	var obj1 = getElemnt("mainscdiv");
	// label div
	var obj2 = getElemnt("containerEnterColor");
	// scroll bar div
	var obj3 = $("#lastcell");

	// sell channels width
	var w1 = obj1.offsetWidth;
	// sell channel label width
	var w2 = obj2.offsetWidth;
	if (obj3) {
		// alert("w3 " + w3);
		var totwid = w1 + w2 + 8;
		$("#lastcell").css({
			position : "absolute",
			left : totwid
		});
	}
}

// Show the enter color qty div
ColorQtyPopUp = function(id, _commentTitle, _commentHTML, height, width, olay,
		bg, obj, applyHgt) {

	olay = (olay == null) ? "#939393" : olay;// Gray color

	var commentTitle = _commentTitle;
	var commentHTML = _commentHTML;
	var baseBackground, baseOpacity;
	this.show = function() {
		var commentsDiv = document.createElement('div');
		$(commentsDiv).attr("id", id);
		// bg = (bg) ? bg : "#E5E8ED";
		bg = (bg) ? bg : "#ffffff";
		$(commentsDiv).css({
			"background-color" : bg
		});
		$(commentsDiv).css('height', 'auto');

		commentsDialog = $(commentsDiv).dialog(
				{
					title : commentTitle,
					height : height,
					width : width,
					zIndex : 600,
					modal : true,
					draggable : false,
					resizable : false,
					position : [ 'center', 40 ],
					dialogClass : 'dlgfixed',

					close : function(event, ui) {

						if (newCommentsDiv) {
							newCommentsDiv.dialog("close");
						}
						$(this).html('');
						$(this).dialog('destroy');
						$(this).remove();
						$(".ui-widget-overlay").css("background", bg).css(
								"opacity", baseOpacity);
					}

				});

		commentsDialog.html(commentHTML);

		// To set the background of the parent window.
		var overlay = $(".ui-widget-overlay");
		baseBackground = overlay.css("background-color");
		baseOpacity = overlay.css("opacity");
		overlay.css("background", olay).css("opacity", "0.2");

		function complete() {
			commentsDialog.dialog('close');
		}

		document.onkeydown = function(e) {
			e = e || event;
			if (e.keyCode == 27) { // escape
				complete(id);
				// refresh the parent page Tracker#:26744
				CHQ.refreshPage("resetattr");
			}
		};

		$(".ui-dialog-titlebar").hide();
		commentsDialog.show();
		return commentsDialog;
	}
}

/**
 * Function used to execute previous and next processes on the Enter Color Qty
 * pop up Based on the method prev/next quote sell channels are displayed on the
 * pop up Check the changed fields before showing previous or next sell channels
 * of a quote Tracker#:26745 LOAD PREVIOUS/NEXT RFQ SELL CHANNEL'S BY USING
 * PREVIOUS AND NEXT BUTTONS TO COLOR QTY POP UP
 * 
 * @param act
 */
CQ.executePrevNext = function executePrevNext(act) {

	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objHtmlData = htmlAreaObj.getHTMLDataObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var chgfls = document.getElementById("chgflds");
	var chgHolder = "";
	if (chgfls) {
		chgHolder = chgfls.value;
	}

	if (chgHolder != null && chgHolder != "") {
		var htmlErrors = objAjax.error();
		htmlErrors.addError("confirmInfo", szMsg_Changes, false);
		// var saveFunc = "CQ.saveClrQty()";
		var saveFunc = "\"CQ.saveClrQty()\"";
		var cancelFunc = "CQ.showPrevNextRFQ('" + act + "')";
		messagingDiv(htmlErrors, "CQ.saveClrQty()", cancelFunc);
		return;
	} else {

		CQ.showPrevNextRFQ(act);
	}
}

// holds the position of vertical and horizontal scroll bar
// before saving or executing the processes finalize color/reset color
CQ.restoreScrllBar = function restoreScrllBar() {
	var obj1 = getElemnt("mainscdiv");

	if (obj1) {
		scrleft = obj1.scrollLeft;
	}
	var obj2 = getElemnt("scrlmaindiv");
	if (obj2) {
		scrTop = obj2.scrollTop;
	}

}

/**
 * Call the save process to update the quantities
 */
CQ.saveClrQty = function() {
	if (document.getElementById("msgDiv") != null) {
		closeMsgBox();
	}

	CQ.restoreScrllBar();
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objHtmlData = htmlAreaObj.getHTMLDataObj();
	var objAjax = htmlAreaObj.getHTMLAjax();

	// alert("save it");
	// get the changed fields
	var chgfls = document.getElementById("chgflds");
	var chgHolder = "";
	if (chgfls) {
		chgHolder = chgfls.value;
	}

	if (chgHolder != null && chgHolder != "") {
		bShowMsg = true;

		var str = chgHolder.split(",");
		for (var i = 0; i < str.length; i++) {
			// alert("changedfields "+str[i]);
			var changedObj = document.getElementById(str[i]);
			var val = changedObj.value;
			var keycol = str[i] + "key";
			var keyInfo = changedObj.getAttribute("keyinfo");
			objAjax.parameter().add(str[i], val);
			// alert("no encode "+keyInfo);
			objAjax.parameter().add(keycol, keyInfo);
		}

		objAjax.setActionURL("colorqty.do");
		objAjax.setActionMethod("save");
		objAjax.parameter().add("chgflds", chgHolder);
		objAjax.setProcessHandler(CQ.reloadDiv);
		objAjax.sendRequest();
		// recalculate the total value after save
		CQ.calcTotForSC(0, totCellCount, totrwCount);
		document.getElementById("chgflds").value = "";

	} else {
		// If screen is not modified show the warning message
		var objAjax = new htmlAjax();
		objAjax.error().addError("warningInfo", szMsg_No_change, false);
		_displayProcessMessage(objAjax);
	}

}

/**
 * Show previous next item sell channels
 * 
 * @param act
 */
CQ.showPrevNextRFQ = function showPrevNextRFQ(act) {
	// alert("called here " + act);
	document.getElementById("chgflds").value = "";
	if (document.getElementById("msgDiv") != null) {
		closeMsgBox();
	}

	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objHtmlData = htmlAreaObj.getHTMLDataObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	objAjax.setActionURL("colorqty.do");
	objAjax.setActionMethod(act);
	objAjax.setProcessHandler(CQ.reloadDiv);
	// objAjax.parameter().add("chgflds", objHtmlData.getChangeFields());
	objAjax.sendRequest();

}

// Repaint the color qty div when next/prev buttons are clicked
CQ.reloadDiv = function reloadDiv(objAjax) {
	var isSaved = objAjax.getResponseHeader("issave");

	if (objAjax) {
		if (bShowMsg == true) {
			msgInfo = objAjax.getAllProcessMessages();
			if (msgInfo != "") {
				_displayProcessMessage(objAjax);
			}
		}
		if (objAjax.isProcessComplete()) {
			// replace the html content of the div
			$("#ColorQtyPopUp").html(objAjax.getResult());

			if (isSaved != null && isSaved != "") {
				var obj1 = getElemnt("mainscdiv");
				if (obj1) {
					obj1.scrollLeft = scrleft;
				}
				var obj2 = getElemnt("scrlmaindiv");
				if (obj2) {
					// alert(scrTop);
					obj2.scrollTop = scrTop;
					// alert("element.scrollLeft " + obj1.scrollLeft);
				}
			}
			CQ.alignVertScrlBar();
		}
		// Refresh the parent page if the qty updated successfully on the qty
		// screen
		if (isSaved != null && isSaved != "" && isSaved == "true") {
			CHQ.refreshPage("refresh");
		}

		objAjax = null;
	}

}

/**
 * Select individual check boxes
 * 
 * @param id
 */
CQ.selCheckBOx = function selCheckBOx(count, rowno) {
	var fld = "chk[" + rowno + "][" + count + "]";
	var chkbox = document.getElementById(fld);
	var parentid = "clr" + count + rowno;
	var parentcell = document.getElementById(parentid);
	var chkval = chkbox.getAttribute("value");

	if (chkval == 0) {
		// chkbox.checked = true;
		// chkbox.disabled = true;
		parentcell.style.background = "#FFFFFF";
	} else {
		parentcell.style.background = "#E5E5E5";
	}

	// alert(chkbox.disabled);
	var txtfld = "qtytxt[" + rowno + "][" + count + "]";
	var changedObj = document.getElementById(txtfld);
	var keyInfo = changedObj.getAttribute("keyinfo");
	var selectedchk = keyInfo;
	// alert("chkbox.checked " + chkbox.checked);
	var act = "resetcolor";
	// after selecting/deselecting execute the process
	// If checkbox is disabled execute the reset color process
	if (chkval == 0) {
		act = "finalizecolor";
	}
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objHtmlData = htmlAreaObj.getHTMLDataObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var chgHolder = document.getElementById("chgflds").value;
	if (chgHolder != null && chgHolder != "") {
		var htmlErrors = objAjax.error();
		htmlErrors
				.addError(
						"warningInfo",
						"There are changes on the screen. Save the changes before executing the process(s)",
						false);
		_displayProcessMessage(objAjax);
	} else {

		CQ.executeSelColoProc(act, selectedchk);
	}
}

/**
 * Get the selected checkbox and execute the process
 * 
 * @param act
 * @param rwCount
 */
CQ.executeSelColoProc = function executeSelColoProc(act, selectedchk) {
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objHtmlData = htmlAreaObj.getHTMLDataObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	if (selectedchk == null || selectedchk == "") {
		// alert("select valid colors to execute the process");
		// If screen is not modified show the warning message
		var objAjax = new htmlAjax();
		objAjax.error().addError("warningInfo",
				"Select valid colors to execute the process", false);
		_displayProcessMessage(objAjax);

	} else {
		// alert("else part");
		bShowMsg = true;
		CQ.restoreScrllBar();
		objAjax.parameter().add("selchkbox", selectedchk);
		objAjax.setActionURL("colorqty.do");
		objAjax.setActionMethod(act);
		objAjax.setProcessHandler(CQ.reloadDiv);
		objAjax.sendRequest();
		selectedchk = "";
	}

}

// set/get current object
var _focusedObj;
var rwno;
var colno;
// set the current object
CQ.setCurQtyObj = function(rowno, count) {
	// alert("setss "+rowno);
	var id = "qtytxt[" + rowno + "][" + count + "]";
	_focusedObj = document.getElementById(id);
	// alert(rowno);
	var chkid = "chk" + rowno;
	var chkobj = document.getElementById(chkid);
	if (chkobj) {
		// chkobj.checked = true;
	}
	rwno = rowno;
	colno = count;
}

// get current object
CQ.getCurQtyObj = function getCurQtyObj() {
	return _focusedObj;
}

/**
 * 
 * @param action
 * @param totrw
 *            Tracker#:26749 ADD FILL UP/FILL DOWN AND FILL SELECTED
 *            FUNCTIONALITY TO FILL THE QTY ON COLOR QTY POP UP
 */
// handle fill up/fill down and fill selected
CQ.qtyfill = function qtyfill(action, totrw) {

	var id;
	// get current object
	var obj = CQ.getCurQtyObj();
	var index = (obj.id).indexOf("qtytxt");
	// if no object selected display the warining message
	if (obj == null || obj == '' || obj == 'undefined' || index == -1) {

		if (action == 'fillup') {
			_displayWarningMessage(szMsg_Fill_Up);
		} else if (action == 'filldown') {
			_displayWarningMessage(szMsg_Fill_Down);
		} else {
			_displayWarningMessage(szMsg_Fill_Selected);
		}
	}

	// get current value
	var qtyval = obj.value;

	if (action == 'fillselected') {
		var counter = 0;
		// Let's print out the elements of the array.
		for (counter = 0; counter < totrw; counter++) {
			var fld = "chk" + counter;
			var chkbox = document.getElementById(fld);
			// set value to all selected rows
			if (chkbox != null && chkbox != '' && chkbox != 'undefined') {
				if (chkbox.checked == true) {
					// get text field id
					id = "qtytxt[" + counter + "][" + colno + "]";
					obj = document.getElementById(id);
					if (obj) {
						// set value
						obj.value = qtyval;
						// set changed fields
						CQ.setChngdFlds(obj, counter, colno);
					}
				}
			}
		}
	}
	if (action == 'filldown') {
		// alert(obj);

		while (obj) {
			// increment the row no
			rwno++;
			// get next row text box
			id = "qtytxt[" + rwno + "][" + colno + "]";
			obj = document.getElementById(id);
			if (obj) {
				// set velue
				obj.value = qtyval;
				// set changed fields
				CQ.setChngdFlds(obj, rwno, colno);
				var fld = "chk" + rwno;
				var chkbox = document.getElementById(fld);
				// chkbox.checked = true;
			}
		}
	}
	if (action == 'fillup') {
		while (obj) {
			// decrement row no
			rwno--;
			// get text field id
			id = "qtytxt[" + rwno + "][" + colno + "]";
			obj = document.getElementById(id);
			if (obj) {
				// set value
				obj.value = qtyval;
				// set changed fields
				CQ.setChngdFlds(obj, rwno, colno);
				var fld = "chk" + rwno;
				var chkbox = document.getElementById(fld);
				// chkbox.checked = true;
			}
		}
	}
}

/**
 * Set the qty changed fields
 * 
 * @param obj
 * @param rwno
 * @param colcount
 */
CQ.setChngdFlds = function setChngdFlds(obj, rwno, colcount) {

	var fldname = obj.name;
	// alert("modified name " + obj.name);
	u(obj);
	// cf(obj);
	var chgHolder = document.getElementById("chgflds").value;// getval('chgflds');
	// alert("chgHolder " + chgHolder);
	// var chgHolder = getval('chgflds');
	var index = chgHolder.indexOf(fldname + ',');
	if (index == -1) // if it exists
	{
		if (chgHolder.length == 0) {
			chgHolder = fldname;
		} else {
			chgHolder = chgHolder + "," + fldname;
		}
	}
	// changed the changed fields values
	document.getElementById("chgflds").value = chgHolder;
	// calculate the total qty values after entering the data
	CQ.calcTotForSC(0, totCellCount, totrwCount);

	// align the columns after modifying the values
	// If bigger data is entered the total column length increasing and hence
	// losing the alignment
	// so after modification align all coumns
	// for ( var r = 0; r < totrwCount; r++) {
	// CQ.alignTables('tabclr', 'clrinsidetbl', 0, totCellCount, r);
	// CQ.alignTables('totallbl', 'rwtotal', 0, totCellCount, r);
	// }
}

// Make color level or flow level check box read only, if no detail exists for
// the whole row or column
CQ.setFlwClrStatus = function setFlwClrStatus(colCount, rwCount) {

	// alert("called");
	// var colCount = CQ.getCellInx();
	for (var k = 0; k < colCount; k++) {
		// alert("ff " + k);
		var fld = "flowchk" + k;
		// alert(fld);
		var chkfld = document.getElementById(fld);
		// alert(chkfld);
		if (chkfld) {
			var count = 0;
			for (var i = 0; i < rwCount; i++) {
				var flwfld = "chk[" + i + "][" + k + "]";
				var chkflwfld = document.getElementById(flwfld);
				if (chkflwfld) {
					break;
				} else {
					count++;
				}
			}
			// If no column exists
			if (count == rwCount) {
				// set the flow column check box as read only
				chkfld.disabled = true;
			}

		}
	}

	var clrCount = 0;
	for (var i = 0; i < rwCount; i++) {
		var fld = "chk" + i;
		// alert(fld);
		var chkfld = document.getElementById(fld);
		// alert(chkfld);
		if (chkfld) {
			var count = 0;
			for (var k = 0; k < colCount; k++) {
				var flwfld = "chk[" + i + "][" + k + "]";
				var chkflwfld = document.getElementById(flwfld);
				if (chkflwfld) {
					break;
				} else {
					count++;
				}
				if (count == colCount) {
					// set the color level check box as read only
					chkfld.disabled = true;
					clrCount++;
				}

			}
		}

	}

	// If all rows are disabled then disable the check box which is dispalyed
	// beside Color label
	if (clrCount == rwCount) {

		var chk = document.getElementById("sectionCheckBoxColor");
		if (chk) {
			chk.disabled = true;
		}

	}

}

/**
 * Close the poop up if cancel ot X image is clicked on the pop up
 * 
 * @param isCheckReq
 *            --if true check for the changed fields
 */
CQ.closePopUp = function closePopUp(isCheckReq) {

	if (isCheckReq == 'true') {
		var htmlAreaObj = _getWorkAreaDefaultObj();
		var objHtmlData = htmlAreaObj.getHTMLDataObj();
		var objAjax = htmlAreaObj.getHTMLAjax();
		var chgHolder = document.getElementById("chgflds").value;
		if (chgHolder != null && chgHolder != "") {

			var htmlErrors = objAjax.error();
			htmlErrors.addError("confirmInfo", szMsg_Changes, false);
			// var cancelFunc = $("#ColorQtyPopUp").dialog('close');
			messagingDiv(htmlErrors, "CQ.saveClrQty()", "CQ.closePopUp(false)");
			return;

		} else {
			// close the pop up, if no changes are done on the pop up
			CQ.closePopUp(false);
		}

	} else {
		// close the msg div
		var chgfls = document.getElementById("chgflds");
		if (chgfls) {
			chgfls.value = "";
		}

		if (document.getElementById("msgDiv") != null) {
			closeMsgBox();
		}
		$("#ColorQtyPopUp").dialog('close');
		$("#ColorQtyPopUp").remove();
		// refresh the parent page Tracker#:26744
		CHQ.refreshPage("resetattr");

	}

}

// Show Manage Color Qty pop up
// close the current Enter Color Qty pop up and display the manage deliveries
// pop up
// Check for the changed fields, if t he enter color qty has any changes to be
// saved
CQ.showManageDelPopUp = function showManageDelPopUp(keyInfo, rowInd) {

	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objHtmlData = htmlAreaObj.getHTMLDataObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var chgHolder = document.getElementById("chgflds").value;
	if (chgHolder != null && chgHolder != "") {

		var htmlErrors = objAjax.error();
		htmlErrors.addError("confirmInfo", szMsg_Changes, false);
		var cancelFunc = "\"CQ.shwMngDelPopUp(\'" + keyInfo + "\', \'" + rowInd
				+ "\')\"";
		messagingDiv(htmlErrors, "CQ.saveClrQty()", cancelFunc);
		return;

	} else {
		CQ.shwMngDelPopUp(keyInfo, rowInd);
	}

}

/**
 * Show the Mangae delivery pop up
 * 
 * @param keyInfo
 * @param rowInd
 */
CQ.shwMngDelPopUp = function shwMngDelPopUp(keyInfo, rowInd) {
	// show the manage deliveries pop up
	MCD.showManageChannel(keyInfo, rowInd);

}

/**
 * Tracker#:26746 ADD GO TO BUTTON TO LOAD THE SELL CHANNELS FROM THE SELECTED
 * ITEM NO ON COLOR QTY POP UP Go to the item no and load the sell channels
 * associated with that item no
 */
CQ.gotoItem = function gotoItem() {

	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objHtmlData = htmlAreaObj.getHTMLDataObj();
	var objAjax = htmlAreaObj.getHTMLAjax();

	// get the item no entered in the item no text box
	var itemNo = document.getElementById("gototextbox");
	var itemval;
	if (itemNo) {
		itemval = itemNo.value;
		if (itemval == null || itemval == "") {
			var htmlErrors = objAjax.error();
			htmlErrors.addError("warningInfo",
					"Add the item no and then click Go to button", false);
			_displayProcessMessage(objAjax);
		} else {
			var chgHolder = document.getElementById("chgflds").value;
			if (chgHolder != null && chgHolder != "") {

				var htmlErrors = objAjax.error();
				htmlErrors.addError("confirmInfo", szMsg_Changes, false);
				// _displayProcessMessage(objAjax);
				var cancelFunc = "\"CQ.gotoItemNo(\'" + itemval + "\')\"";
				messagingDiv(htmlErrors, "CQ.saveClrQty()", cancelFunc);
				return;

			} else {
				CQ.gotoItemNo(itemval);
			}

		}
	}

}

/**
 * Tracker#:26746 ADD GO TO BUTTON TO LOAD THE SELL CHANNELS FROM THE SELECTED
 * ITEM NO ON COLOR QTY POP UP Load the first item
 * 
 * @param itemno
 */
CQ.gotoItemNo = function gotoItemNo(itemno) {
	document.getElementById("chgflds").value = "";
	if (document.getElementById("msgDiv") != null) {
		closeMsgBox();
	}
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objHtmlData = htmlAreaObj.getHTMLDataObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	bShowMsg = true;
	objAjax.parameter().add("itemno", itemno);
	objAjax.setActionURL("colorqty.do");
	objAjax.setActionMethod("goto");
	objAjax.setProcessHandler(CQ.reloadDiv);
	objAjax.sendRequest();
}

/**
 * calculate the qty total at color level and at the flow level
 * 
 * @param startindex
 * @param endIndex
 * @param rwcnt
 */
CQ.calcTotForSC = function calcTotForSC(startindex, endIndex, rwcnt) {

	// calculate color level total
	for (var i = 0; i < rwcnt; i++) {
		// calculate kth flow total
		var flwtotal = 0;
		for (var k = startindex; k < endIndex; k++) {
			var fld = "qtytxt[" + i + "][" + k + "]";
			var txtFld = document.getElementById(fld);
			if (txtFld) {
				var qty = txtFld.value;
				if (qty != null && qty != "") {
					// alert("qty");
					// var number = qty.match(/\d+$/);
					qty = qty.replace(/,/g, "");
					// alert("rep qty " + qty);
					qty = parseFloat(qty);

					// alert("number qty " + qty);
					flwtotal = flwtotal + qty;
					// alert("flwtotal " + flwtotal);
				}

			} else {
				// alert("test for tot column");
				var fld = "qtytotal" + i + k;
				// alert(fld);
				var txtFld = document.getElementById(fld);
				if (txtFld) {
					txtFld.innerHTML = flwtotal;
					flwtotal = 0;
				}

			}

		}

	}

	// calculate for vertical level or flow level
	for (var k = startindex; k < endIndex; k++) {
		var flwtotal = 0;
		for (var i = 0; i < rwcnt; i++) {
			var fld = "qtytxt[" + i + "][" + k + "]";
			var txtFld = document.getElementById(fld);
			if (txtFld) {
				var qty = txtFld.value;
				if (qty != null && qty != "") {
					// alert("qty");
					// var number = qty.match(/\d+$/);
					// qty = qty.replace(",", "");
					qty = qty.replace(/,/g, "");
					// alert("rep qty " + qty);
					qty = parseFloat(qty);

					// alert("number qty " + qty);
					flwtotal = flwtotal + qty;
					// alert("flwtotal " + flwtotal);
				}
			} else {
				var fld = "qtytotal" + i + k;
				var txtFld = document.getElementById(fld);
				if (txtFld) {
					var qty = txtFld.innerHTML;
					// alert("qty " + qty);
					if (qty != null && qty != "") {
						// alert("qty");
						// var number = qty.match(/\d+$/);
						// qty = qty.replace(",", "");
						qty = qty.replace(/,/g, "");
						// alert("rep qty " + qty);
						qty = parseFloat(qty);
						// alert("number qty " + qty);
						flwtotal = flwtotal + qty;
					}
				}

			}
		}

		// set total value
		var fld = "total" + k;
		// alert(fld);
		var txtFld = document.getElementById(fld);
		if (txtFld) {
			txtFld.innerHTML = flwtotal;
			flwtotal = 0;
		}

	}
}

// Enable/Disable goto button based on whether user enters data/does not enter
// data in goto input text box
CQ.gotobutton = function gotobutton() {
	// check the input text box for any user data
	var itemNo = document.getElementById("gototextbox");
	var itemvalgoto = itemNo.value;
	// If user entered data enable goto button
	if (itemvalgoto != null || itemvalgoto != "") {
		$("#btngo-mng").removeClass();
		$("#btngo-mng").addClass("clsbtnbottom");
		$("#btngo-mng").removeAttr("disabled");
	}

	// If user did not enter data disable goto button
	if (itemvalgoto == null || itemvalgoto == "") {
		$("#btngo-mng").removeClass();
		$("#btngo-mng").addClass("clsbtnbottom clspassiv");
		$("#btngo-mng").attr('disabled', 'disabled');
	}
}

/**
 * Reset the filtered sell channels
 * 
 * Tracker#:26752 SHOW ALL SELL CHANNELS WHENSHOW ALL LINK IS CLIKCED FROM THE
 * ENTER COLOR QTY POP UP
 * 
 * Enable show all link when sell channels are filtered. Whne the show all link
 * is clicked load all sell channels associated with the current item.
 */
CQ.showAll = function showAll() {
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	// set the url
	objAjax.setActionURL("colorqty.do");
	// set the view method
	objAjax.setActionMethod("showall");
	// set the quote key info
	objAjax.setProcessHandler(CQ.colorQtyResponse);
	objAjax.setProcessHandler(CQ.reloadDiv);
	objAjax.sendRequest();
}
