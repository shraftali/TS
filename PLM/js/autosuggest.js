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

//Summary: New validation autosuggest(/autocomplete) component. This script has dependency on common.js
//Create the VALIDATION namespace object if it does not exist
if (!VALIDATION)
{
    var VALIDATION = new Object();
    // Tracker#: 17639 - SAFARI/FIREFOX: COLORWAY NAME DISPLAY IS MISSING AFTER SAVE
    // variable to prevent _preChgPrecedenceFld from clearing data when onchange event fires
    if (!IE)
    {
    	VALIDATION.suggested = false;
    }
}

/**
 *  Autosuggest container
 *  @2010R4
 */
VALIDATION.SuggestContainer = function() {

    /**
     * Associative array of auto-suggest components(VALIDATION.Suggest) on the current screen
     */
    this.components = new Array();

    /**
     * Associative array of messages
     */
    this.messages = new Array();

    this.clearComponents = function() {
        for (var i in this.components) {
            try {
                //console.log("Destroy suggest instance of :" + this.components[i].getQueryField().id);
                this.components[i].destroy();
            } catch(e) {
            }
            this.components[i] = null;
        }
    }

    this.clearMessages = function() {
        for (var i in this.messages) {
            this.messages[i] = null;
        }
    }

    this.clearAll = function() {
        this.clearComponents();
        this.clearMessages();
    }
}

VALIDATION.Suggest = function (/*String*/ _objectName, /*Object*/ _queryField, /*String*/ _autosuggestDivId, /*int*/ _dataType, /*String*/ _queryUrl, /*Function*/ _onBeforeSendQuery)
{
    var objectName = _objectName;
    var queryField = _queryField;
    var queryUrl = _queryUrl;
    var autosuggestDivId = _autosuggestDivId;
    var dataType = _dataType;
	var prevFormFieldValue = getElemnt(queryField.id.toString().replace(_FIELDS_SEPERATOR + "desc", "")).value;
    /*The 'that' variable allows access the Suggest object from the elements event handlers*/
    var that = this;

    var autosuggestDiv;

    var req;
    /*Index of the suggestion entry last selected*/
    var selected = -1;
	var prevSelected = -1;
    var preRowNo = -1;
    var preRowClassName = "";

    /*Server result attributes*/
    var resultsObj;
    /*Number of suggesion results returned from the server*/
    var displayResultsCount = 0;
    var mappingAttributes;
    var multiPost;
    var searchOp = '';
    /*(Maximum) Number of entries suggest will show at a time*/
    var suggResultsCount = '';

    /*Highlighted column values within results e.g. PARTY_NAME (used for user input validtion)*/
    var suggestionColumnValues = [];
    var columnHeaders;
    var validate = true;
    /*Show messages using class "messaging"*/
    var divMessage = false;
    var requestParams = "";
    var disableAutoSuggest = false;
    /*Last search query term (e.g. 'a', 'ab')*/
    var previousQueryTerm;

    /*Delay in milli seconds*/
    var delay = 300;
    var timerId;
    var preKeyDownEvnt;

    var focussed = true;

    /*The field label to be used in the associated message @2010R4*/
    var fieldLabel;

    init();

    /**
     * INIT METHOD
     */
    function init()
    {
    	queryField.setAttribute("autocomplete", "off");

        preKeyDownEvnt = queryField.onkeydown;
		
        queryField.onkeydown = qfOnkeydown;
        queryField.onkeypress = qfOnkeypress;
        queryField.onkeyup = qfOnkeyup;
        queryField.onpaste = qfOnpaste;
        if (!disableAutoSuggest)
        {
            queryField.onblur = qfOnblur;
            /*
             * Tracker#: 18069 - CANNOT USE FILL UP  OR FILL DOWN ON FIELDS THAT USE A VALIDATION WITH  SHOW DESCRIPTION TURNED ON
             * Fillup/filldown onfocus event handler was being overwritten by autosuggest onfocus event handler.
             * Attaching autosuggest's onfocus handler as an additional handler; not overwriting previous handlers.
             */
            $(queryField).bind('focus', qfOnfocus);
        }

        autosuggestDiv = createDiv();
    }

    /**
     * OBJECT METHODS
     */

    function dummy()
    {
    }

    this.destroy = function (removeDiv) {
        hideDiv();

        removeEvent(queryField, "keydown", qfOnkeydown);
        removeEvent(queryField, "keypress", qfOnkeypress);
        removeEvent(queryField, "onpaste", qfOnpaste);
        removeEvent(queryField, "keyup", qfOnkeyup);
        if (!disableAutoSuggest)
        {
            removeEvent(queryField, "blur", qfOnblur);
            removeEvent(queryField, "focus", qfOnfocus);
        }

        //@since 2010R4 Tracker#16024 : VALIDATION ERROR ON POP-UP SELECTION AND  TABBED ON THE FIELD POPULATED
        //Registering the keydown event to hold previous event.OnBlur event is not set to dummy as it has to validate the typed text further.
        if (preKeyDownEvnt)
        {
            queryField.onkeydown = preKeyDownEvnt;
        }
        else
        {
            queryField.onkeydown = dummy;
        }
        queryField.onkeyup = dummy;
        
        if (!disableAutoSuggest && removeDiv) {
            document.body.removeChild(autosuggestDiv);
        }
        if (timerId) clearTimeout(timerId);

        //Null objects
        for (var key in this) {
            this[key] = null;
        }
    }

    /**
     * Optional JavaScript function to execute just before when ajax request
     * is made to the server
     */
    this.onBeforeSendQuery = _onBeforeSendQuery;

    /**
     * Optional parameters to append. Parameters will be in the form
     * name=value&name1=value1&..
     */
    this.addRequestParameters = function addRequestParameters0(_requestParams)
    {
        requestParams += _requestParams;
    }
    this.setRequestParameters = function setRequestParameters0(_requestParams)
    {
        requestParams = _requestParams;
    }

    this.addSuggestion = function (_value)
    {
        suggestionColumnValues[suggestionColumnValues.length] = _value;
    }

    /**
     * Enable/Disable validation based on configuration parameters
     */
    this.setValidate = function (_validate)
    {
        validate = _validate;
    }
    this.getValidate = function ()
    {
        return validate;
    }

    // @since 2009R4
    this.validInputSelection = isValidInputSelection;

    this.setDisplayDivMessage = function (_divMessage)
    {
        divMessage = _divMessage;
    }

    this.disableAutosuggestDiv = function (_disableAutoSuggest)
    {
        disableAutoSuggest = _disableAutoSuggest;
    }

    this.getQueryField = function ()
    {
        return queryField;
    }

    this.hideDiv = hideDiv;


    this.setFieldLabel = function (_fieldLabel)
    {
        fieldLabel = _fieldLabel;
    }

    /**
     * QUERY METHODS
     */

    function query()
    {
        return queryField.value.toUpperCase();
    }

    /**
     * Perform an asynchronous callback to the server to get the relevant set of choices
     */

    function sendQuery()
    {
        if (queryField.value == '')
        {
            selected == -1;
            clearCodeFieldValue();
            hideDiv();
            return;
        }
        //console.log("After queryField.value " + queryField.value);
        //If no data found for character 'a', no need to submit for 'ab' or 'abc' ...
        //Here the assumption is that numeric/date fields on popup always mapped to numeric/date fields on destination screen
        //todo check operator
        if ((dataType == 12 || dataType == 1) && previousQueryTerm && query().startsWith(previousQueryTerm))
        {
            //console.log("After queryField.value - previousQueryTerm" + previousQueryTerm + ":" + query.value + ":" + query().startsWith(previousQueryTerm));
            hideDiv();
            if (!focussed && validate) {
                clearCodeFieldValue();
                displayMessage();
                queryField.value = '';
            }
            return;
        }

        var objAjax = new htmlAjax();

        if (objAjax)
        {
            if (that.onBeforeSendQuery) that.onBeforeSendQuery(that);

            //queryUrl ends with ..&search=, url encoding to support special char such as "&"
            var url = queryUrl + encodeURIComponent(query()) + "&searchop=" + searchOp + "&suggResultsCount=" + suggResultsCount;
            var index = url.indexOf("?");
            var path = url.substring(0, index);
            var parameters = url.substring(index + 1) + (requestParams != null && requestParams.length > 0 ? '&' : '') + requestParams;
            //alert(parameters);
            objAjax.setActionMethod("suggest");
            objAjax.setActionURL(path);
            objAjax.setActionClassType();
            objAjax.showProcessingBar(false);
            objAjax.parameter().addAllParameters(parameters);

            //--The following code specific to new UI needs to be moved out
            var objWorkArea = _getWorkAreaDefaultObj();
            if (objWorkArea)
            {
                var objHtmlData = objWorkArea.getHTMLDataObj();

                if (objHtmlData)
                {
                    objHtmlData.addAllChangedFieldsData(objAjax);
                }
            }
            objAjax.setProcessHandler(handleResponse);
            objAjax.sendRequest();
        }
    }

    function handleResponse(objAjax)
    {
        if (objAjax)
        {
            //Calls handleSearchSuggest
            eval(objAjax.getHTMLResult());
        }
    }

    //Handles response from server
    function handleSearchSuggest(queryTerm, multiPostValues, mapAttributes, columnHdrs, suggestions, isMoreRecords)
    {
    	//console.log("handleSearchSuggest begin");
        hideDiv();

        //if queryTerm does not match just ignore
        if (queryTerm != query())
        {
            //console.log("handleSearchSuggest queryTerm != query()" + queryTerm + ":" +  query());
            return;
        }

        suggestionColumnValues = [];

        if (suggestions.length == 0)
        {
            //console.log("handleSearchSuggest suggestions.length == 0");
            if (!focussed && validate) {
                clearCodeFieldValue();
                displayMessage();
                queryField.value = '';
            }
            previousQueryTerm = queryTerm;
            return;
        }

        //Initialize parameters
        resultsObj = suggestions;
        displayResultsCount = resultsObj.length;
        mappingAttributes = mapAttributes;
        multiPost = multiPostValues; 
        columnHeaders = columnHdrs;
        selected = -1;

        var queryFieldIndex = getQueryFieldIndex();

        if (!disableAutoSuggest)
        {
        	var table = document.createElement("table");
        	autosuggestDiv.appendChild(table);
            table.id = "table_autosugg";
            table.className = "s_table";
            table.cellSpacing = "1";
            table.cellPadding = "3";
            var tBody = document.createElement("tBody");
            table.appendChild(tBody);
            tBody.id = table.id + "_body";

            for (var i = 0; i < displayResultsCount; i++)
            {
                if (resultsObj[i])
                {
                    var row = document.createElement("tr");
                    tBody.appendChild(row);
                    row.id = table.id + "_row_" + i;
                    row.onmouseover = (function (i)
                    {
                        return function ()
                        {
                            highlight(i)
                        }
                    })(i);

                    if (i % 2 == 0)
                    {
                        row.className = "s_row";
                    }
                    else
                    {
                        row.className = "s_row1";
                    }

                    row.onmousedown = function (evt)
                    {
                        setValuesOnMouseDown();
                    }

                    suggestionColumnValues[i] = resultsObj[i][queryFieldIndex];

                    for (var j = 0; j < resultsObj[i].length; j++)
                    {
                        if (columnHeaders[j].H == 'Y') continue;
                        var cell = document.createElement("td");
                        //Tracker#17087 S-DASHBOARD MESSAGE BOX SCROLLS INCONSISTENTLY
                        //Added style class to define the style for <td> cell
                        cell.className="s_cell";
                        row.appendChild(cell);
                        cell.id = table.id + "_cell_" + i + "_" + j;
                        cell.noWrap = "true";
                        var result = resultsObj[i][j];
                        //Incase of mixed case data- rare
                        var upperCaseResult = result.toUpperCase();
                        var index = upperCaseResult.indexOf(query());

                        if (j == queryFieldIndex)
                        {
                        	//Tracker#22056 - To fix the type ahead search issue on field for the value which contains special character like H&M, displays only H and leaves out the &M in suggest options
                            cell.innerHTML = htmlEscape(result.substring(0, index)) + "<span style='text-decoration:underline;font-weight:bold;color:green'>" + htmlEscape(result.substring(index, index + queryField.value.length)) + "</span>" + htmlEscape(result.substring(index + queryField.value.length));
                        }
                        else
                        {
                            cell.innerHTML = htmlEscape(result);
                        }

                        //Set title for first row
                        if (i == 0) cell.title = columnHeaders[j].N;
                    }
                }
            }
            
            if (isMoreRecords && displayResultsCount > 0) {
            	
                var row = document.createElement("tr");
                tBody.appendChild(row);
                var cell = document.createElement("td");
                cell.colSpan = suggestionColumnValues.length;
                cell.style.background = "#FAF8CC";
                row.appendChild(cell);
                cell.innerHTML = "There are more records, please narrow your search"
            }

            if (focussed)
            {
                //console.log("In handleSearchSuggest - disable autosuggest false - focussed true");
                positionDiv();
                showDiv();
            }
            else
            {
                //console.log("In handleSearchSuggest - disable autosuggest false - focussed false");
                if (validate && !isValidInputSelection())
                {
                    //console.log("In handleSearchSuggest - disable autosuggest false - isValidInputSelection false");
                    clearCodeFieldValue();
                    displayMessage();
                    queryField.value = '';
                }
            }
        }
        else
        {
            //console.log("In handleSearchSuggest - disable autosuggest true");
            for (var i = 0; i < displayResultsCount; i++)
            {
                if (resultsObj[i])
                {
                    suggestionColumnValues[i] = resultsObj[i][queryFieldIndex];
                }
            }

            if (!focussed && validate && !isValidInputSelection())
            {
                //console.log("In handleSearchSuggest - isValidInputSelection false");
                clearCodeFieldValue();
                displayMessage();
                queryField.value = '';
            }
        }

        previousQueryTerm = null;

    }

    //Tracker#22056 - Converting special characters to html names
    //Tracker#19618 - To avoid the description field value to look as paragraph(like wrapped data) in autosuggest so removed the codeline replace(/\n/g, '<br />') 
    function htmlEscape(s) {
    	return s.replace(/&/g, '&amp;')
    		.replace(/</g, '&lt;')
    		.replace(/>/g, '&gt;')
    		.replace(/'/g, '&#039;')
    		.replace(/"/g, '&quot;');
    }
    
    function getQueryFieldIndex()
    {
        if (mappingAttributes && mappingAttributes[0] && mappingAttributes.length > 0)
        {
            for (var i = 0; i < mappingAttributes.length; i++)
            {
                for (var j = 0; j < mappingAttributes[i].length; j++)
                {
                    if (mappingAttributes[i][0] == queryField.id)
                    {
                        return mappingAttributes[i][1];
                    }
                }
            }
        }
        return 0;
    }

    function setValuesOnMouseDown()
    {
        setValues();
        hideDiv();
        // Tracker#: 17639 - SAFARI/FIREFOX: COLORWAY NAME DISPLAY IS MISSING AFTER SAVE
        // prevent _preChgPrecedenceFld function from deleting auto suggest data on onchange event
        // until after onblur of textbox.
        if (!IE)
        {
        	VALIDATION.suggested = true;
        }
        return true;
    }

    function highlight(number)
    {
        selected = number;
        setSelected(selected);
    }

    function setSelected(selected)
    {
        var row = document.getElementById("table_autosugg_row_" + preRowNo);

        if (row)
        {
            row.className = preRowClassName;
            preRowNo = -1;
            preRowClassName = "";
        }

        row = document.getElementById("table_autosugg_row_" + selected);

        if (row)
        {
            preRowNo = selected;
            preRowClassName = row.className;
            row.className = "s_highlight";
        }
    }

    /**
     * EVENT HANDLERS
     */
	
	/**
     * Captures the paste event
     */
	function qfOnpaste(evt)
	{
        if (!evt && window.event)
        {
            evt = window.event;
        }
	 queryField.setAttribute("pasteAttr",true);
	}
	
	/**
     * Captures the Onkeypress event(when values are typed)
     */
	function qfOnkeypress(evt)
	{
        if (!evt && window.event)
        {
            evt = window.event;
        }
	 	queryField.setAttribute("chgFld",true);
	}
	
	
    function qfOnkeydown(evt)
    {
        // don't do anything if the div is hidden
        //if (autosuggestDiv.style.display == "none")
        //{
            //return true;
        //}

        // make sure we have a valid event variable
        if (!evt && window.event)
        {
            evt = window.event;
        }
        var key = evt.keyCode;
        var KEYUP = 38;
        var KEYDOWN = 40;
        var KEYENTER = 13;
        var KEYTAB = 9;
        var KEYESC = 27;
		
        if ((key != KEYUP) && (key != KEYDOWN) && (key != KEYENTER) && (key != KEYTAB) && (key != KEYESC))
        {
            return true;
        }
        
        // Tracker#: 17639 - SAFARI/FIREFOX: COLORWAY NAME DISPLAY IS MISSING AFTER SAVE
        // prevent _preChgPrecedenceFld function from deleting auto suggest data on onchange event
        // until after onblur of textbox.
        if (!IE)
        {
        	VALIDATION.suggested = true;
        }

        if (key == KEYUP)
        {
            if (!resultsObj) return true;

            if (selected <= 0)
            {
                //Top most row, move to the bottom
                selected = displayResultsCount - 1;
            }
            else if (selected >= 1)
            {
                selected = selected - 1;
            }
            setSelected(selected);
            setValues();
        }

        if (key == KEYDOWN)
        {
            if (!resultsObj) return true;

            if (selected == displayResultsCount - 1)
            {
                //Bottom most row, move to the top
                selected = 0;
            }
            else if (selected < displayResultsCount - 1)
            {
                selected = selected + 1;
            }

            setSelected(selected);
            setValues();
        }

        if (key == KEYENTER)
        {
            setValues();
            hideDiv();
            //@2010R3:14646  ADVANCED SEARCH- CLICKING ON THE <ENTER> KEY ON KEYBOARD DOES NOT WORK FOR SOME FIELDS
            //On click on enter returns true, will search directly on search screen , else does nothing.
            return true;
        }

        if (key == KEYTAB)
        {
            //console.log("Key down - tab =" + key);
            //@2010R4 (blur gets fired before onkeyup)
            suggestionColumnValues = [];

            hideDiv();
        }

        if (key == KEYESC)
        {
            hideDiv();
        }

        return true;
    }

    function qfOnkeyup(evt)
    {
        // make sure we have a valid event variable
        if (!evt && window.event)
        {
            evt = window.event;
        }
        var key = evt.keyCode;

        // Backspace key(8), Delete key (46)
        if (key == 8 || key == 46 || !(key < 32 || (key >= 33 && key < 46) || (key >= 112 && key <= 123)))
        {
            //console.log("Key Up=" + key);

            if (timerId)
                clearTimeout(timerId);

            timerId = setTimeout(function() {
                sendQuery()
            }, delay);
        }
    }

    function qfOnblur(evt)
    {
        //console.log("Onblur=" + evt);
        focussed = false;
        if (!IE)
        {
        	// Tracker#: 17639 - SAFARI/FIREFOX: COLORWAY NAME DISPLAY IS MISSING AFTER SAVE
        	// allow _preChgPrecedenceFld function to clear data.
        	VALIDATION.suggested = false;
        }

        if (!evt && window.event)
        {
            evt = window.event;
        }
        hideDiv();

        //@since 2009R3
        isValidInput();
        return true;
    }

    function qfOnfocus(evt)
    {
        if (!evt && window.event)
        {
            evt = window.event;
        }

        //console.log("Onfocus=" + evt);
        focussed = true;
    }

    /**
     * SUGGESTION DIV METHODS
     */

    function createDiv()
    {
        if (disableAutoSuggest) return;

        var divObj = document.getElementById(autosuggestDivId);
        if (!divObj)
        {
            divObj = document.createElement("div");
            document.body.appendChild(divObj);
            divObj.id = autosuggestDivId;
            divObj.style.position = "absolute";
            divObj.style.overflow = "auto";
            divObj.style.zIndex = 999;
            divObj.style.background = "#ffffff";
        }
        return divObj;
    }

    function hideDiv()
    {
        if (disableAutoSuggest) return;

        autosuggestDiv.style.display = "none";
        //Remove previous content (DOM elements)
        var suggestTable = autosuggestDiv.childNodes[0];
        if (suggestTable) removeSuggestTable(suggestTable); //Remove table recursively
        autosuggestDiv.innerHTML = "";
    }

    //Removes suggest table (try removing all elements individually to avoid leak in IE6=+)
    function removeSuggestTable(elm)
    {
        while (elm.childNodes.length > 0)
        {
            removeSuggestTable(elm.childNodes[elm.childNodes.length - 1]);
        }
        if (elm.clearAttributes) elm.clearAttributes();
        if (elm.onmousedown)removeEvent(elm, "mousedown", setValuesOnMouseDown);
        if (elm.onmouseover)removeEvent(elm, "mouseover", highlight);

        elm.parentNode.removeChild(elm);
        //discardElement(elm);
        if (IE && elm.outerHTML) elm.outerHTML = "";
        else if (elm.innerHTML) elm.innerHTML = ""

        elm = null;
    }

    function showDiv()
    {
    	if (!disableAutoSuggest && focussed)
        {
    		autosuggestDiv.style.display = "block";
        }
        else
        {
            autosuggestDiv.style.display = "none";
        }
    }

    function positionDiv()
    {
    	/* Tracker#: 21380 - REGRESSION: SAFARI & FIREFOX- ON BOM ASSOCN AUTO-SUGGEST FEATURE ON THE COLOR FIELD DOES NOT WORK
    	 * Issue - getPositionX was not getting position reliable.
    	 * Fix - use reliable cross-browser jQuery method instead.
    	 */
    	var divObj = autosuggestDiv,
    		$queryField = $(queryField),
    		offset = $queryField.offset();
        // Tracker#: 18677 - SAFARI/FIREFOX - AUTO SUGGEST BOX POSITION MOVES ON SCROLL
        // getPositionY was not taking into account scrollTop correctly.  Using jQuery instead.
    	//Tracker#19618 - Fixing the integration mistake.Replacing getPositionX() by offset.left as getPositionX() is removed in CL#55406
    	var left = offset.left,
    		newLeft = left,
			top = $(queryField).offset().top,
			newTop = top + queryField.offsetHeight + 1;
    	
        /* Tracker#: 19618 - UNABLE TO VIEW ALL RECORDS IN THE AUTO SUGGESTION LIST 
         * Issue - autosuggest is partially offscreen for lookup fields near edge of browser viewport.
         * Fix - (1) if beyond bottom of viewport, show autosuggest box above query field.
         * (2) if beyond right of viewport, move autosuggest box to the left just enough to show entirely.
         */
    	var amountOffScreenY = amountOffScreen('bottom', newTop),
    		amountOffScreenX = amountOffScreen('right', left);
	    if (amountOffScreenY > 0)
	    {
	    	newTop = top - $(divObj).height();
	    }
	    if (amountOffScreenX > 0)
	    {
	    	newLeft = left - amountOffScreenX;
	    }
	    //Tracker#19618 - Making autosuggest left position to zero when it exceeds the screen
	    if(newLeft < 0)
	    {
	    	newLeft = 0;
	    }
    	
    	divObj.style.left = newLeft + "px";
        divObj.style.top = newTop + "px";
        
    }
    
    /* Tracker#: 19618 - UNABLE TO VIEW ALL RECORDS IN THE AUTO SUGGESTION LIST
     * returns the amount the autosuggest list box is outside the screen in pixels.
     * side - Which side of the screen to check: 'bottom' or 'right' side.
     * positionValue - current offset relevent to side that is being checked
     * (i.e. for 'bottom' side, pass in offset top. For 'right' side, pass in offset left).
     * returns zero if entirely within screen.
     */
    function amountOffScreen (side, positionValue)
    {
    	var $suggestionsDiv = $(autosuggestDiv),
			$window = $(window),
			amount;
		switch (side)
		{
			case 'bottom' :
				amount = positionValue + $suggestionsDiv.height() - $window.height(); 
				break;
				
			case 'right' :
				amount = positionValue + $suggestionsDiv.width() - $window.width(); 
				break;
		}
		
		return (amount < 0) ? 0 : amount;
    }

    function setValues()
    {
        if (resultsObj && resultsObj[selected])
        {
            if (mappingAttributes && mappingAttributes.length > 0)
            {
                for (var i = 0; i < mappingAttributes.length; ++i)
                {
                    if (mappingAttributes[i])
                    {
                        //alert("mappingAttributes["+i+"] "+ mappingAttributes[i]);
                        var fieldName = mappingAttributes[i][0];
                        var autoSuggColumnIndex = mappingAttributes[i][1];
                        var formField = document.getElementById(fieldName);
                        //alert("fieldName "+ fieldName);
                        if (formField)
                        {
                            //alert(fieldName + "=" + formField.value);
                            formField.value = resultsObj[selected][autoSuggColumnIndex];

                            //alert("formField \n " + formField.outerHTML);
                            if (formField.onchange)
                            {
                                formField.onchange();         
                            }
                            
                            // Tracker 17228# REGRESSION ISSUES WHEN ENTERING DATA MANUALLY ON LOOK-UP FIELDS
                            // onfocus of each field, the selected values is reset to -1
                            // Holding the previous selected value in case of multipost fields
                            if (multiPost != 0)
                            {
                           		 prevSelected = selected;
                            }
                        }
                    }
                }
            }
        }
    }

    //@2010R4
    function setCodeFieldValue(value)
    {
        var formField = queryField;
        if (formField.id.indexOf(_FIELDS_SEPERATOR + "desc") != -1)
        {
            formField = getElemnt(formField.id.toString().replace(_FIELDS_SEPERATOR + "desc", ""));
			//ST#:16711 BOMC CREATES COMPONENT LINE AFTER DISPLAYING AN ERROR MESSAGE
            // Onchange is triggered only when:
            // -user types in a value on a aempty field
            // -user removes a already existing value and makes it blank
            // -changes a existing value to another value 
            // Onchange should no fire for: 
            // - when user types in invalid value on a empty field 
            if(prevFormFieldValue.length !=0) formField.value = value;
            if (formField.onchange && prevFormFieldValue.length !=0)
            {
                formField.onchange();
            }
        }
    }

    function clearCodeFieldValue(value)
    {  	
    	 //Tracker#:26790 ADD GO TO BUTTON TO LOAD THE SELL CHANNELS FROM THE SELECTED ITEM NO FOR MANAGE CHANNELS AND DELIVER
    	 //If the Auto Suggestion Validation for Goto Button on Manage Channels & Deliveries fails then disable the Goto Button as the text is cleared 
    	 //We are checking whether only if the Goto button exists(by checking its length) and then disabling that button, hence no other application functionality will be affected.
    	 if($("#gototextbox").length!=0)
         {
         	$("#btngo-mng").removeClass();
         	$("#btngo-mng").addClass("clsbtnbottom clspassiv");
         	$("#btngo-mng").attr('disabled', 'disabled');  
         }    	 
    	 setCodeFieldValue('');
    }

    /**
     * VALIDATION METHODS
     */
    function isValidInput()
    {
        if (!validate || queryField.value == '') return true;
        if (!isValidInputSelection())
        {	
            clearCodeFieldValue();
            displayMessage();
            queryField.value = '';
            return false;
        }
        return true;
    }

    //if  invokeSetValues == true calls setValues()
    function isValidInputSelection()
    {
        if (suggestionColumnValues.length == 0) {
            //We are sending query may be twice, due to
            //1. onblur fires before onkeyup (but after onkeydown) and we send request on onkeyup...
            //2. if we type quickly a + tab IE receives tab keydown event
            //console.log("In isValidInputSelection - suggestionValues.length == 0");
            sendQuery();
            return true;
        }

        //search for matching value
        for (var i = 0; i < suggestionColumnValues.length; i++)
        {
            //@2009R2
            if (suggestionColumnValues[i] == null && queryField.value == null) return true;
            if (suggestionColumnValues[i] == null || queryField.value == null) return false;
            if (suggestionColumnValues[i].toUpperCase() == query())
            {
                
                 // Tracker 17228# REGRESSION ISSUES WHEN ENTERING DATA MANUALLY ON LOOK-UP FIELDS
                 // when tabbed out of each field, the selected values is reset to -1 as sendQuery() gets fired.
                 // Holding the previous selected value in case of multipost fields and re-assigning it.
                 // Hence on KEYTAB skips setValues() for multipost.
                if(selected == -1  && multiPost != 0)
                {
                   selected = prevSelected ;
                }

                if (selected == -1)
                {
                	 selected = i;
                	
                	 // setValues only if the data has been typed (and tabbed out) in or pasted directly on the field . 
                	// Tracker#: 17639 - SAFARI/FIREFOX: COLORWAY NAME DISPLAY IS MISSING AFTER SAVE
                	// getAttribute() method returns a string in Firefox, but boolean in IE.
                	if(queryField.getAttribute('chgFld') == 'true' || queryField.getAttribute('pasteAttr') == 'true' ||
                		queryField.getAttribute('chgFld') == true || queryField.getAttribute('pasteAttr') == true)
                	{
                  		setValues();
                  	}
                }
                return true;
            }
        }
        return false;
    }

    function displayMessage()
    {
        if (divMessage)
        {
            var htmlErrors = new htmlAjax().error();
            htmlErrors.addError("errorInfo", 'Invalid value \"' + query() + '"' + (fieldLabel ? (' in field ' + fieldLabel) : ''), true);
            new messagingDiv(htmlErrors);
        }
        else
        {
            alert('Invalid value \"' + query() + '"');
        }

    }

    /**
     * UTIL METHODS
     */
    Object.size = function (obj)
    {
        var size = 0,
                key;
        for (key in obj)
        {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };

    function removeElement(elm)
    {
        while (elm.childNodes.length > 0)
        {
            removeElement(elm.childNodes[elm.childNodes.length - 1]);
        }
        if (elm.clearAttributes) elm.clearAttributes();

        elm.parentNode.removeChild(elm);
        discardElement(elm);
    }

    function discardElement(elm)
    {
        var bin = document.getElementById("IELeakGarbageBin");
        if (!bin)
        {
            bin = document.createElement("DIV");
            bin.id = "IELeakGarbageBin";
            document.body.appendChild(bin);
        }
        bin.appendChild(elm);
        bin.innerHTML = "";
        elm = null;
    }

    function removeEvent(obj, eventName, funcName) {
        if (obj.detachEvent) {
            obj.detachEvent("on" + eventName, funcName);
        } else if (obj.removeEventListener) {
            obj.removeEventListener(eventName, funcName, true);
        } else {
            obj["on" + eventName] = null;
        }
    }

    function addEvent(obj, eventName, funcName)
    {
        if (obj.attachEvent)
        {
            obj.attachEvent("on" + eventName, funcName);
        }
        else if (obj.addEventListener)
        {
            obj.addEventListener(eventName, funcName, true);
        }
        else
        {
            obj["on" + eventName] = funcName;
        }
    }
}

//----------------------------------------------------
//Global methods
//----------------------------------------------------
var AutoSuggestContainer = new VALIDATION.SuggestContainer();

function fetchAutoSuggestions(queryField, globalDisableAutoSuggest, fieldAutoSuggest, fieldLabel, queryDivName, dataType, isValidate, queryUrl, onBeforeSendQuery)
{
	var AutoSuggest = new VALIDATION.Suggest("AutoSuggest", queryField, "_autoSuggest", dataType, queryUrl, onBeforeSendQuery);
    AutoSuggestContainer.components[queryField.id] = AutoSuggest;
    AutoSuggest.setDisplayDivMessage(true);
    AutoSuggest.setValidate(isValidate);
    AutoSuggest.disableAutosuggestDiv(globalDisableAutoSuggest ? true : !fieldAutoSuggest);
    AutoSuggest.setFieldLabel(fieldLabel);
    //console.log("In fetchAutoSuggestions - new instance created");

    //If there is already a value on the text field, initalise the suggestionArray with the value.
    //Thus it prevents from throwing error through validating e.g. tabbing
    var fieldvalue = queryField.value;
    if (fieldvalue != null && fieldvalue != '')
    {
        AutoSuggest.addSuggestion(fieldvalue);
    }
}

//This method is called from layout
function _fAS(objQueryField, showDesc, globalDisableAutoSuggest, fieldAutoSuggest, fieldLabel, dataType, isValidate, queryUrl, onBeforeSendQuery)
{
	var objCodeFld = objQueryField;
    if (showDesc)
    {
        objCodeFld = _getDescCodeField(objQueryField);
    }

    var queryDivName = "div_" + objCodeFld.id;    
    if (queryUrl)
    {
        queryUrl = _buildQueryUrl(queryUrl, showDesc, objCodeFld.id, objQueryField.id);
        queryUrl = queryUrl + "&search=";
    }

    fetchAutoSuggestions(objQueryField, globalDisableAutoSuggest, fieldAutoSuggest, fieldLabel,
            queryDivName, dataType, isValidate, queryUrl, onBeforeSendQuery);
}

/**
 * Creates the url.Used by ValidationsearchControl.js (_dVSP)
 */
function _buildQueryUrl(queryUrl, showDesc, sCodeFldId, sQueryFieldId)
{
	//Tracker#21579 - encoding the data to resolve the special character issue like &
    queryUrl = queryUrl + "&codeFldName=" + encodeURIComponent(sCodeFldId);

    if (showDesc)
    {
        queryUrl = queryUrl + "&showDesc=Y&descFldName=" + encodeURIComponent(sQueryFieldId);
    }
    else
    {
        queryUrl = queryUrl + "&showDesc=N";
    }
    if (sCodeFldId)
    {
        var idSufx = _getIDSuffixFromCompName(sCodeFldId);
        if (idSufx != null)
        {
            queryUrl = queryUrl + "&idSuffix=" + encodeURIComponent(idSufx);
        }
    }

    return queryUrl;
}
