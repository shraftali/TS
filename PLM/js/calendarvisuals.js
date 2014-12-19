/*************************************/
/*  Copyright  (C)  2002 - 2010      */
/*           by                      */
/*  TradeStone Software, Inc.        */
/*  Gloucester, MA. 01930            */
/*  All Rights Reserved              */
/*  Printed in U.S.A.                */
/*  Confidential, Unpublished        */
/*  Property of                      */
/*  TradeStone Software, Inc.        */
/*************************************/
if (!TRADESTONE) {
    var TRADESTONE = new Object();
}

/*******************************/
/* Calendar component class */
/* @since 2010R4   */
/*******************************/

TRADESTONE.Calendar = function (_id, _docViewId) {
    var id = "#" + _id;
    var docViewId = _docViewId;

    var fullCalendar;
    var datePicker;
    var eventDtlsDialog;
    var JSONEventObject = null;
    var events = [];
    var eventSummary = [];
    var mapDateToNoOfOccurences = {};
    var filter;
    var today = formatDateForId(new Date());

    var deselectedDocuments = new Object();
    //Holds events callback method/currentEvent as a global (todo see if do it in a better way)
    var eventsCallback = null;
    var currentEvent;
    var initialized = false;
    var eventSourceStatic = null;
    var eventSourceFunc = null;
    var currentView = null;

    /*******************************/
    /* CONSTANTS                   */
    /*******************************/

    var _CORPORATE_CAL_VIEW_ID = "5504";
    var _BUYPROGRAM_CAL_VIEW_ID = "2004";
    var _ICON_CAL = "images/icon_calendar.png";
    var _ICON_PREV = "images/page_prev_active.gif";
    var _ICON_NEXT = "images/page_next_active.gif";
    var _ICON_RISK_START = "images/icon_riskind_";
    var _ICON_ARR_RIGHT = "images/icon_arrow_right.png";
    var _ICON_ARR_LEFT = "images/icon_arrow_left.png";
    var _ICON_CLOSE = "images/close_top.gif";

    /*******************************/
    /* PUBLIC METHODS              */
    /*******************************/

    this.show = function() {
    	
    
        setupCalendar();

        //--Code to customize fullcalendar--
        //Add refresh button
        $('.fc-today-button').after('<button type="button" class="fc-button fc-corner-left fc-corner-right fc-state-default" onclick="cal_refreshViewAndEvents();"  > Refresh </button>');

        
        /*
        //Set TSS buttons for month, week, day
        $("div.fc-button-month").find("span").html(buildButton("Month", true));
        $("div.fc-button-basicWeek").find("span").html(buildButton("Week", false));
        $("div.fc-button-basicDay").find("span").html(buildButton("Day", false));
        $("div.fc-button-today").find("span").html(buildButton("Today", true));
        $("div.fc-button-prev").find("span").html(buildButton("pre", false, _ICON_PREV));
        $("div.fc-button-next").find("span").html(buildButton("next", false, _ICON_NEXT));
	*/
        //Add datepicker to title
        var datePickerHTML = '<td style="padding-left:10px">' +
                             '<div class="fc-datepicker">' +
                             '<span>' +
                             '<input type="hidden" id="datePicker" value="" />' +
                             '<img src="' + _ICON_CAL + '" id="datePickerImg" />' +
                             '</span>' +
                             '</div>' +
                             '</td>';
        $('.fc-center h2').after(datePickerHTML);
        datePicker = $("#datePicker").datepicker({
            dateFormat: 'dd-mm-yy',
            changeMonth: true,
            changeYear: true,
            onSelect: function(dateText, inst) {
                var d = datePicker.datepicker("getDate");
                fullCalendar.fullCalendar('changeView', 'basicDay');
                fullCalendar.fullCalendar('gotoDate', moment(d));
            }
        });

        $('#datePickerImg').click(function() {
            datePicker.datepicker('show');
        });

        initialized = true;
    }

    this.moveToDay = function(_date) {
        fullCalendar.fullCalendar('changeView', 'basicDay');
        fullCalendar.fullCalendar('gotoDate', moment(_date));
    }

    this.destroy = function() {
        JSONEventObject = null;
        eventsCallback = null;
        events = null;
        eventSummary = null;
        mapDateToNoOfOccurences = {};
        try {
            if (isNotNull(fullCalendar)) {
                fullCalendar.fullCalendar('removeEvents');
                fullCalendar.destroy();
                fullCalendar.html("");
            }
        } catch(e) {
        }
        fullCalendar = null;
        try {
            if (isNotNull(datePicker)) {
                datePicker.datepicker('destroy');
                datePicker.html("");
            }
        } catch(e) {
        }
        datePicker = null;
        try {
            if (isNotNull(eventDtlsDialog)) {
                eventDtlsDialog.dialog('destroy');
                eventDtlsDialog.html("");
            }
        } catch(e) {
        }
        eventDtlsDialog = null;

        var objDiv = $("#caleventeditdialog");
        if (isNotNull(objDiv[0])) {
            document.body.removeChild(objDiv[0]);
            objDiv.empty();
            objDiv.html('');
            objDiv = null;
        }
    }

    this.setEventsFilter = function(_filter) {
        filter = _filter;
    }

    this.refetchEvents = function() {
        fullCalendar.fullCalendar('removeEvents');
        fullCalendar.fullCalendar('refetchEvents');
    }

    //Filter deselected events when checkbox is clicked
    this.filterDeselectedEvents = function () {
        if (isNull(events) || events.length == 0) return;
        fullCalendar.fullCalendar('removeEvents');
        if (isNotNull(eventSourceStatic)) {
            fullCalendar.fullCalendar('removeEventSource', eventSourceStatic);
        }
        //fullCalendar.fullCalendar('removeEventSource', eventSourceFunc);

        var tempEvents = [];
        for (var i = 0; i < events.length; ++i) {
            var objEvent = events[i];
            if (!containsInDeselectedList(objEvent.documentKeys)) {
                tempEvents[tempEvents.length] = objEvent;
            }
        }

        if (tempEvents.length > 0) {
            eventSourceStatic = tempEvents;
            fullCalendar.fullCalendar('addEventSource', eventSourceStatic);
            //currentView.renderEvents(tempEvents);
        }
    }

    this.addToDeselectedList = function (obj) {
        deselectedDocuments[obj.id] = obj.id;
    }

    this.removeFromDeselectedList = function (obj) {
        deselectedDocuments[obj.id] = null;
    }

    this.clearDeselectedList = function (obj) {
        deselectedDocuments = null;
        deselectedDocuments = new Object();
    }

    this.getEventCount = function() {
        return events.length;
    }

    this.closeDatePicker = function () {
        datePicker.datepicker("hide");
    }
    
    this.refreshViewAndEvents=function(){
    	 fullCalendar.fullCalendar('gotoDate', moment());
    	fullCalendar.fullCalendar('changeView','month');
    	this.refetchEvents();
    }

    /*******************************/
    /* PRIVATE METHODS              */
    /*******************************/

    function setupCalendar() {
        fullCalendar = $(id).fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,basicWeek,basicDay'
            },
            editable: false,
            draggable: false,
            eventLimit:{'month':(isBuyProgramView()) ? 3 : 4 ,
            		
            },
            
            eventClick: function (event, jsEvent, view) {
                sendEventDetailsQuery(event);
            },
            
            eventSources:[
                 eventSourceFunc = function (start, end, timezone, callback) {
                        if (isNotNull(eventSourceStatic)) {
                            fullCalendar.fullCalendar('removeEventSource', eventSourceStatic);
                        }
                        eventsCallback = callback;
                       
                        sendEventQuery(formatDate(start), formatDate(end));
                    }
                  ],
            	

            eventRender: function (event, element, view) {
                customEventRender(event, element, view);
            },
        });
    }

    function customEventRender(event, element, view) {
        var objElement = cal_getElmn(element);
        var objEvent = cal_getElmn(event);
        if (objEvent && objElement) {
            if (isBuyProgramView()) {
                if (view.name == 'basicDay') {
                    setBuyPlanRiskIndicator(objEvent, objElement, true);
                } else {
                    setBuyPlanRiskIndicator(objEvent, objElement, false);
                }
            }

            var eventStyle = {};
            if (isNotNull(objEvent.color) && objEvent.color.length > 0 && objEvent.color != 'TODO') {
                eventStyle['background-color'] = "#"+objEvent.color;
                eventStyle['border-color'] = "#"+objEvent.color;
                $('span.fc-event-time, a', objElement).add(objElement).css(eventStyle);
            }
          
            //fullcalendar.js (lazily) registers onclick event on mouseover. Since the more popup events are hidden
            //jquery do not fire mouseover (hence onclick). Explicitly register onclick for popup cal events
            //todo see how to fix it
            var ismore = $(objElement).hasClass('more');
            if (!ismore && $(objElement).attr('class').indexOf('seg_') != -1) {
                $(objElement).click(function(ev) {
                    sendEventDetailsQuery(objEvent);
                });
            }

            if (!ismore) {
                //$(objElement).live('mouseover', function() {
                if (!$(objElement).data('qtip')) {
                    $(objElement).qtip({
                        content : { text:getTipContent(objEvent)},
                      /*  position: {target: 'mouse',
                            corner: {
                                target: 'topRight',
                                tooltip: 'bottomLeft'
                            },
                            adjust: { x: 0, y: -6 }
                        },
                        */
                       	 position: {
                        		target: 'mouse',
                        		adjust: {
                        			x: 5,
                        			y: 25
                        		},
                        		my: 'top center'
                        },
                        hide: {
                        		fixed: true,
                        		delay: 300
                        	},
                     
                        style: {
                            name: 'cream',
                            padding: '7px 13px',
                            width: {
                                max: 200
                            },
                            tip: {
                                corner: true
                            },
                            border: {
                                x:20,
                                y:8,
                                radius: 5
                            }

                        }
                        
                    });
                }
                //$(objElement).trigger('mouseover');
                //});
            }
        }
    }

    function getTipContent(objEvent) {
        if (isBuyProgramView()) {
            return objEvent.BUY_PROGRAM_NO;
        }
        else if (isCorporateView()) {
            return formatTipDate(objEvent.start) + (objEvent.end ? " - " + formatTipDate(objEvent.end) : "");
        }
    }

    function setBuyPlanRiskIndicator(objEvent, objElement, isDayView) {
        var completedEvents = parseInt(objEvent.COMPLETED_EVENTS);
        var totalEvents = parseInt(objEvent.TOTAL_EVENTS);
        var content = '';
        var completionTask = objEvent.completionRisk;
        if (isNull(completionTask)) completionTask = "green";
        if (isDayView) {
            content = (isNaN(completedEvents) ? 0 : completedEvents) + ' styles of ' + (isNaN(totalEvents) ? 0 : totalEvents) + ' complete <img class="fc-risk-image-lg" style="height:18px" src="' + _ICON_RISK_START + completionTask + '_lg.png"/>';
        } else {
            content = (isNaN(completedEvents) ? 0 : completedEvents) + '/' + (isNaN(totalEvents) ? 0 : totalEvents) + ' <img class="fc-risk-image" style="height:14px" src="' + _ICON_RISK_START + completionTask + '_sm.png"/>';
        }
        $(objElement).find('span.fc-title').after('<span class="fc-buyplan-indic">' + content + '</span>');
    }

    function showEventDetails(content) {
        //Destroy if dialog already open
        if (eventDtlsDialog) {
            eventDtlsDialog.html('');
            eventDtlsDialog.dialog('destroy');
        }
        var objDialog = $('#caleventeditdialog');
        if (isCorporateView()) {
            content = '<div class="clstitleText">Calendar Name: <span class="clsTextLabelNormal">' + currentEvent.DESCRIPTION + '</span></div>' + content;
        }
        objDialog.html(content);
        eventDtlsDialog = objDialog.dialog({
            title: currentEvent.title,
            modal: true,
            width:(isBuyProgramView() ? "40%" : "80%"),
            close: function(event, ui) {
                objDialog.dialog('destroy');
            }
        });
        if (isBuyProgramView()) {
            $(objDialog).css("height", "250px");
        }
        //See if we can do better
        var titleBar = $("a.ui-dialog-titlebar-close");
        titleBar.removeClass("ui-corner-all");
        titleBar.find(".ui-icon").html("<img src='" + _ICON_CLOSE + "' border='0'/>").removeClass();

        //Hack code. Set cell background to light grey/remove readonly/remove border (todo See we can customize framework to support this)
        $("div.clssubsectiontblcontent").removeClass();
        $("td.clsBrdBtmRt").removeClass("clsBrdBtmRt").addClass("fc-dialog-td").parent().addClass("fc-dialog-tr");
        $('input.clsTextReadOnly').each(function () {
            var objInput = $(this);
            var value = objInput.val();
            var objTD = objInput.parent();
            objTD.empty();
            objTD.html(value);
        });

    }

    function getEventKeyColumns(event) {
        var keyColumns = '';
        if (isCorporateView()) {
            keyColumns += 'OWNER=' + event.OWNER + "&CALENDAR_ID=" + event.CALENDAR_ID + "&ASSOC_ID=" + event.ASSOC_ID + "&ROW_NO=" + event.ROW_NO + "&DESCRIPTION=" + event.DESCRIPTION;
        } else if (isBuyProgramView()) {
            keyColumns += 'OWNER=' + event.OWNER + "&BUY_PROGRAM_NO=" + event.BUY_PROGRAM_NO + "&EVENT_CODE=" + event.EVENT_CODE;
        }
        return keyColumns;
    }

    function toggleTodayButton(view) {
        var today = new Date();
        var objTable = $("div.fc-button-today").find("table")
        if (today >= view.start && today < view.end) {
            objTable.removeClass().addClass('fc-tss-button-faded');
        } else {
            objTable.removeClass().addClass('fc-tss-button');
        }
    }

    /*******************************/
    /* AJAX METHODS              */
    /*******************************/

    function sendEventQuery(startDate, endDate) {
        var objAjax = new htmlAjax();
        objAjax.setActionMethod("getevents");
        objAjax.setActionURL(isBuyProgramView() ? "bpcalvisual.do" : "scalvisual.do");
        objAjax.setActionClassType();
        objAjax.showProcessingBar(true);
        //Encoding is taken care by the framework
        if (isNotNull(filter) && filter.length > 0)objAjax.parameter().addAllParameters(filter);
        if (isNotNull(startDate))objAjax.parameter().addAllParameters("startDate=" + startDate);
        if (isNotNull(endDate))objAjax.parameter().addAllParameters("endDate=" + endDate);
        objAjax.setProcessHandler(handleEventResults);
        objAjax.sendRequest();
    }

    function handleEventResults(objAjax) {
        if (objAjax) {
            var errors = objAjax.error();
            if (errors.hasErrorOccured()) {
                new messagingDiv(errors, "", "", "calendardiv");
            }
            else {
                //alert(objAjax.getHTMLResult());
                var result = objAjax.getHTMLResult();
                if (isNotNull(result) && result.length > 0) {
                    JSONEventObject = eval('(' + objAjax.getHTMLResult() + ')');
                    events = JSONEventObject.events;
                    toggleSearchDiv(events.length);
                    if (events.length == 0) {
                        var warning = new htmlAjax().error();
                        warning.addWarning("No events found");
                        new messagingDiv(warning, "", "", "_viewcalendarsearch");
                        sendLeftNavigationQuery();
                        return;
                    }
                    if (eventsCallback && isNotNull(events))eventsCallback(events);

                    var moreRecords = JSONEventObject.moreRecords;
                    if(moreRecords == 'true') {
                        var warning = new htmlAjax().error();
                        warning.addWarning("There are more records. Please apply more filters");
                        new messagingDiv(warning, "", "", "_viewcalendarsearch");
                    }
                }
            }

            sendLeftNavigationQuery();

            //Print left nav
            pna('cdiv', docViewId +divCounter+ 'nav', divCounter, 'left');
        }
    }

    function sendEventDetailsQuery(event) {
        var objEvent = (event.length) ? event[0] : event;
        currentEvent = objEvent;
        var keyColumns = getEventKeyColumns(objEvent);
        var objAjax = new htmlAjax();
        objAjax.setActionMethod(isBuyProgramView() ? "getbpeventdtls" : "getcpeventdtls");
        objAjax.setActionURL(isBuyProgramView() ? "bpcalvisual.do" : "scalvisual.do");
        objAjax.setActionClassType();
        objAjax.showProcessingBar(true);
        //Encoding is taken care by the framework
        if (isNotNull(keyColumns) && keyColumns.length > 0)objAjax.parameter().addAllParameters(keyColumns);
        objAjax.setProcessHandler(handleEventDetailResults);
        objAjax.sendRequest();
    }

    function handleEventDetailResults(objAjax) {
        if (objAjax) {
            var errors = objAjax.error();
            if (errors.hasErrorOccured()) {
                new messagingDiv(errors, "", "", "calendardiv");
            }
            else {
                //alert(objAjax.getHTMLResult());
                showEventDetails(objAjax.getHTMLResult());
            }
        }
    }

    function sendLeftNavigationQuery() {
        var objAjaxNav = new htmlAjax();
        objAjaxNav.setActionMethod("NAVIGATION");
        objAjaxNav.setActionURL(isBuyProgramView() ? "bpcalvisual.do" : "scalvisual.do");
        objAjaxNav.setProcessHandler(_showNavigationComponent);
        objAjaxNav.sendRequest();
    }

    function containsInDeselectedList(key) {
        return isNotNull(deselectedDocuments[key]);
    }

    /*******************************/
    /* UTIL METHODS              */
    /*******************************/

    function formatDate(date) {
    	return moment(date).format("YYYY-MM-DD");
    }

    function formatTipDate(date) {
        return moment(date).format("ddd MMM dd yyyy");
    }

    //Date string in yyyy-MM-d format
    function getDateFromStr(dateStr) {
        var dateTokens = dateStr.split("-")
        var month = parseInt(dateTokens[1]);
        return new Date(dateTokens[0], month == 0 ? month : (month - 1), dateTokens[2]);
    }

    function formatDateForId(d) {
        return '' + d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    }

    function buildButton(label, disabled, imageSrc) {
        return '<table cellspacing="0" cellpadding="0" ' + (disabled ? 'class="fc-tss-button-faded"' : '') + ' id="' + label + '"' + ' border="0" onmouseover="cal_toggleButtonStyle(this)" style="cursor:pointer;cursor:hand" onmouseout="cal_toggleButtonStyle(this)">' +
               '<tbody>' +
               '<tr valign="middle" align="center">' +
               '<td id="clsLeftcornerButton" class="clsLeftcornerButton" nowrap="nowrap">&nbsp;</td>' +
               '<td id="clsCenterButton" class="clsCenterButton" valign="middle" nowrap="nowrap" align="center" style="vertical-align: middle">' +
               ((imageSrc) ? '<img src="' + imageSrc + '" border="0" style="display:block;" />' : label) +
               '</td>' +
               '<td id="clsRightButton" class="clsRightButton" nowrap="nowrap">&nbsp;</td>' +
               '<td class="clsToolBarButtonRightPadding">&nbsp;</td>' +
               '</tr>' +
               '</tbody>' +
               '</table>';
    }

    function isBuyProgramView() {
        return docViewId == _BUYPROGRAM_CAL_VIEW_ID;
    }

    function isCorporateView() {
        return docViewId == _CORPORATE_CAL_VIEW_ID;
    }
      
}

/**Calender style grid component @2011R1 */
TRADESTONE.CalendarStyleGrid = function(_id) {
    var id = "#" + _id;
    var results;
    var colNames;
    var colModel;
    var data;
    var filter;

    this.show = function() {
        sendEventQuery();
    }

    this.destroy = function() {
        results = null;
        colNames = null;
        colModel = null;
        data = null;
        $(id).jqGrid('GridUnload');
    }

    this.setEventsFilter = function(_filter) {
        filter = _filter;
    }

    this.refetchEvents = function() {
        //todo Hack code. Find better alternative
        //$(id).trigger("reloadGrid");
        this.destroy();
        sendEventQuery();
    }

    function sendEventQuery() {
        var objAjax = new htmlAjax();
        objAjax.setActionMethod("getevents");
        objAjax.setActionURL("stylecalvisual.do");
        objAjax.setActionClassType();
        objAjax.showProcessingBar(true);
        //Encoding is taken care by the framework
        if (isNotNull(filter) && filter.length > 0)objAjax.parameter().addAllParameters(filter);
        objAjax.setProcessHandler(handleEventResults);
        objAjax.sendRequest();
    }

    function handleEventResults(objAjax) {
        if (objAjax) {
            var errors = objAjax.error();
            if (errors.hasErrorOccured()) {
                new messagingDiv(errors, "", "", "calendardiv");
            }
            else {
                //alert(objAjax.getHTMLResult());
                var result = objAjax.getHTMLResult();
                if (isNotNull(result) && result.length > 0) {
                    results = eval('(' + objAjax.getHTMLResult() + ')');
                    colNames = results.colNames;
                    colModel = results.colModel;
                    data = results.data;

                    $(id).jqGrid({
                        cellEdit: true,
                        /*url:"stylecalvisual.do",*/
                        width:910,
                        height:320,
                        colNames:colNames,
                        colModel:colModel,
                        shrinkToFit:false,
                        datatype:"jsonstring",
                        datastr:data,
                        imageDir:"jquery/plugin/images",
                        loadComplete: function () {
	                        $(id).jqGrid("freezingSetup");
	                    },
                        frozenColumnHorizontalBorderColor: "#e8e8e8",
	                    frozenColumnVerticalBorderColor: "#565656",
                        caption:'Edit Style Events'
                        /*,
                        altClass: 'altRow',
                        altRows:true,*/

                        /*onSelectRow: function(id){
                            if(id && id!==lastsel2){
                                jQuery('#rowed5').jqGrid('restoreRow',lastsel2);
                                jQuery('#rowed5').jqGrid('editRow',id,true);
                                lastsel2=id;
                            }
                        },*/
                    });

                    if (data.rows) toggleSearchDiv(data.rows.length);
                }
            }

            //sendLeftNavigationQuery();

            //Print left nav
            //pna('cdiv', docViewId +divCounter+ 'nav', divCounter, 'left');
        }
    }
}

/*******************************/
/* GLOBAL              */
/*******************************/

var TSSCalendar;

function cal_displayEvents(_calDocViewId) {
    if (_calDocViewId != 163) {
        cal_displayAsCalendar(_calDocViewId);
    } else {
        cal_displayAsGrid();
    }
}

function cal_displayAsCalendar(_calDocViewId) {

	if (TSSCalendar) {
        TSSCalendar.destroy();
        TSSCalendar = null;

        var calEventsDiv = getElemnt("fc_viewcalendarevents");
        if (isNotNull(calEventsDiv)) {
            //innerHTML faster than html("")
            calEventsDiv.innerHTML = "";
        }
    }
	
    //Incase of refresh
    cal_reset();
    createEventDtlsDiv();
    TSSCalendar = new TRADESTONE.Calendar('fc_viewcalendarevents', _calDocViewId);
    TSSCalendar.show();
}

function cal_refreshViewAndEvents(){
	if (TSSCalendar) {
		TSSCalendar.refreshViewAndEvents();
	}
}

function cal_displayAsGrid() {
    TSSCalendar = new TRADESTONE.CalendarStyleGrid('maingrid');
    TSSCalendar.show();
}

function toggleSearchDiv(resultCount) {
    var objTD = $("#_viewcalendarsearch").find("td[onclick]:first");
    var src = objTD.find("img").attr("src");
    if ((resultCount == 0 && src == "images/Rarrow.gif") || (resultCount > 0 && src != "images/Rarrow.gif")) {
        objTD.click();
    }
}

function createEventDtlsDiv() {
    var objEventEditDialog = document.createElement("div");
    document.body.appendChild(objEventEditDialog);
    objEventEditDialog.id = "caleventeditdialog";
}

function cal_moveToDay(date) {
    TSSCalendar.moveToDay(date);
}

//Top filter reset
function cal_reset() {
    $("#_viewcalendarsearch").find("input.clsTextNormal").each(function () {
        var element = cal_getElmn($(this));
        switch (element.type) {
            case "text":
                element.value = "";
            /*if (element.name.indexOf(_FIELDS_SEPERATOR + "desc") != -1) {
                getElemnt(element.id.replace(_FIELDS_SEPERATOR + "desc", "")).value = "";
            }*/
                break;
        }
    });
}

//Top filter server search
function cal_view() {
    var filter = "";
    var filterChgFields = "";
    $("#_viewcalendarsearch").find("input.clsTextNormal").each(function () {
        var element = cal_getElmn($(this));
        switch (element.type) {
            case "text":
                var value = element.value;
            //If it is a description field send only hidden code field value
            /*if (element.name.indexOf(_FIELDS_SEPERATOR + "desc") != -1) {
                element = getElemnt(element.id.replace(_FIELDS_SEPERATOR + "desc", ""));
                value = element.value;
            }*/

                if (value.length > 0) {
                    filterChgFields += element.id + ",";
                    //Encoding is taken care by the framework
                    filter += element.id + "=" + element.value + "&";
                }
                break;
        }
    });
    if (filter.length > 0) {
        //Ignore last comma
        filter += "calFilterFlds=" + filterChgFields;
    }
    //Place it outside to take care if user clears filter
    TSSCalendar.setEventsFilter(filter);
    TSSCalendar.refetchEvents();
}

function cal_getElmn(element) {
    return (element.length) ? element[0] : element;
}

function test(message) {
    if ($.browser.mozilla) {
        console.log(message);
    }
    else {
        alert(message);
    }
}

//Toggle buttons (todo see if we can use framework toggle method _setButtonStyle())
function cal_toggleButtonStyle(obj) {
    $(obj).find("#clsLeftcornerButton").toggleClass("clsLeftcornerButton").toggleClass("clsLeftcornerButtonmover");
    $(obj).find("#clsCenterButton").toggleClass("clsCenterButton").toggleClass("clsCenterButtonmover");
    $(obj).find("#clsRightButton").toggleClass("clsRightButton").toggleClass("clsRightButtonmover");
}

//Left-navigation callback to filter events on client-side
function cal_toggleCalendarSelection(obj) {
    if (!TSSCalendar) return;
    //Add/remove from deselected list
    if (obj.checked == 1) {
        TSSCalendar.removeFromDeselectedList(obj);
    }
    else {
        TSSCalendar.addToDeselectedList(obj);
    }
    TSSCalendar.filterDeselectedEvents();
}

//Navigates to techspec overview on click of style-no on style popup
function cal_showProductOverview(obj) {
    //To prevent save confirm dialog as we used overview layout to print search
    _getWorkAreaDefaultObj().resetHTMLData();

    var url = "TOOVERVIEW&_nColLibRow=" + _nColLibRow + "&keyinfo= " + getComponentKeyInfo();
    loadWorkArea("techspec.do", url);
    TSSCalendar.destroy();
}

function cal_closeDatePicker() {
    TSSCalendar.closeDatePicker();
}

function cal_loadWorkArea(url, actionMethod, divSaveContainerName, processHandler, origObjAjax) {
    //To prevent save confirm dialog as we used overview layout to print search
    _getWorkAreaDefaultObj().resetHTMLData();
    if(url == 'excel.do')
    {
		actionMethod = actionMethod + "&isAjaxCall=true";
    }
    loadWorkArea(url, actionMethod, divSaveContainerName, processHandler, origObjAjax);
}


customDateCells = function(value, cellObj, rowObject)
{
	return "<span style=\"background-color:pink\">" + value + "</span>";
}


//Navigates to techspec overview on click of style-no on style grid
function grid_showProductOverview(owner, requestNo) {
	//To prevent save confirm dialog as we used overview layout to print search
    _getWorkAreaDefaultObj().resetHTMLData();
    loadWorkArea("techspec.do", "TOOVERVIEW&keyinfo=REQUEST_NO@@" +	requestNo + "~@OWNER@@" + owner);
    TSSCalendar.destroy();
}


