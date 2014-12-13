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
}

/**
 *  Autosuggest container
 *  @2010R4
 */
VALIDATION.SourcingSuggestContainer = function() {

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

VALIDATION.SuggestSourcing = function(/*String*/_objectName,/*Array*/validationFields,/*Object*/ _queryField,/*String*/ _autoCompleteDivName,/*int*/ _dataType,/*String*/ _queryUrl, /*Function*/_onBeforeSendQuery)
{
    var objectName = _objectName;
    var queryField = _queryField;
    var queryUrl = _queryUrl;
    var autosuggestDivId = _autoCompleteDivName;
    var dataType = _dataType;
	var multiPost;
    /*The 'that' variable allows access the Suggest object from the elements event handlers*/
    var that = this;

    var autosuggestDiv;

    var req;
    /*Index of the suggestion entry last selected*/
    var selected = -1;
    var isTypedValue = false;
    var preRowNo = -1;
    var preRowClassName = "";

    /*Server result attributes*/
    var resultsObj;
    /*Number of suggesion results returned from the server*/
    var displayResultsCount = 0;
    var mappingAttributes;
    var searchOp = '';
    /*(Maximum) Number of entries suggest will show at a time*/
    var suggResultsCount = '';

    /*Highlighted column values within results e.g. PARTY_NAME (used for user input validtion)*/
    var suggestionColumnValues = [];
   // var columnHeaders;
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
    
	var suggestionAttributesArray = [];
	var getDynaFilterValueArray = [];
   	var szMsg_Filter_Columns    = 'Please enter a value for ';

    /*Compares the specified user input search term for equality at server-side @2011R4*/
    var validatedResult = false;

    init();

    /**
     * INIT METHOD
     */
    function init()
    {
        queryField.setAttribute("autocomplete", "off");

        preKeyDownEvnt = queryField.onkeydown;
		// This removes all handlers and just adds only qfOnkeydown event handler
		// for onkeydown event
		queryField.onkeydown =  qfOnkeydown;
        bindOtherKeyDownHandlers();

		queryField.onkeypress = qfOnkeypress;
        queryField.onkeyup = qfOnkeyup;
        queryField.onpaste = qfOnpaste;
        if (!disableAutoSuggest)
        {
            queryField.onblur = qfOnblur;
            queryField.onfocus = qfOnfocus;
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
     * To get the dynamic field value labels.
     */
	function getDynaFilterValues()
    {
     var valueArray = [];	//alert(validationFields.length)
     for (var i = 0; i < validationFields.length ; i++)
          {
        	var fldArray = validationFields[i].split(",");
        	var fldID = fldArray[0];
        	var fldLabel =fldArray[1];
	   			 var obj = document.getElementById(fldID); 
	   			 if(obj!=null)
	   			 {
		   			var value = obj.value ; 
		   			if(value!=null && value!="")
		   			{
		   				valueArray[i]=value;
		   			}
		   			else
		   			{
		   				alert(szMsg_Filter_Columns + fldLabel);
		   			}
		   			 
	   			 }
	     }
            
      return valueArray;
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
        var queryTerm = query();
        var queryTermStr = queryTerm.substring(0, 1);
        if ((dataType == 12 || dataType == 1) && previousQueryTerm && queryTermStr==previousQueryTerm )
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
            var url = queryUrl + encodeURIComponent(query())+"&getDynaFilterValues="+getDynaFilterValues() ; 
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

    /**
     * Handles response from server
     *
     * @param queryTerm User input search query term
     * @param mapAttributes
     * @param suggestions
     * @param suggestionAttributes
     * @param validatedServerResult  Result of the comparision of the specified user input search term for equality at server-side (for search term A e.g. CODE/DESCRIPTION='A')
     */
    function handleSearchSuggest(queryTerm, multiPostValues, mapAttributes, suggestions ,suggestionAttributes, validationSeverResult, isMoreRecords)
    {
        //console.log("handleSearchSuggest begin");
        hideDiv();

        //if queryTerm does not match just ignore
        if (queryTerm != query())
        {
            //console.log("handleSearchSuggest queryTerm != query()" + queryTerm + ":" +  query());
            return;
        }
        validatedResult = validationSeverResult;
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
        suggestionAttributesArray = suggestionAttributes; 
        //columnHeaders = columnHdrs;
        selected = -1;

        var queryFieldIndex = getQueryFieldIndex();

        if (!disableAutoSuggest)
        {
            var table = document.createElement("table");
            autosuggestDiv.appendChild(table);
            //Tracker#:16700 AUTO-SUGGEST - SUGGESTED VALUES ARE NOT HIGHLIGHTED WHEN USING DOWN ARROW KEY
            // Tables to be of unique names , to clear the index problem while highlighting the data. 
            table.id = queryField.id + "_table_autosugg";
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
                       // if (columnHeaders[j].H == 'Y') continue;
                        var cell = document.createElement("td");
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
                         else if(result!="")
	                    {
	                        cell.innerHTML = htmlEscape(result);
	                    }
	                    else
	                    {
	                    	cell.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
	                    }

                        //Set title for first row
                         if (i == 0)  cell.title = suggestionAttributesArray[j];
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
        return true;
    }

    function highlight(number)
    {	
        selected = number;
        setSelected(selected);
    }

	//Tracker#:16700 AUTO-SUGGEST - SUGGESTED VALUES ARE NOT HIGHLIGHTED WHEN USING DOWN ARROW KEY
    // Row to be of unique names , to clear the index problem while highlighting the data. 
    function setSelected(selected)
    {
        var row = document.getElementById(queryField.id + "_table_autosugg_row_" + preRowNo);
		
        if (row)
        {
            row.className = preRowClassName;
            preRowNo = -1;
            preRowClassName = "";
        }

        row = document.getElementById(queryField.id + "_table_autosugg_row_" + selected);

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
        	isTypedValue = true;
        	return true;
        }

        if (key == KEYUP)
        {
            if (!resultsObj) return true;
            
            isTypedValue = false;

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
            
            isTypedValue = false;

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
    	var divObj = autosuggestDiv;
        /* Tracker#: 20720 - SAFARI & FIREFOX: DETAIL SECTION OF SOURCING SCREENS - AUTO-SUGGEST POP-UP DISPLACED AFTER SCROLL
         * Fix - Use jQuery method for cross-browser consistency.
         */
        var offset = $(queryField).offset();
        
        // Tracker#: 18677 - SAFARI/FIREFOX - AUTO SUGGEST BOX POSITION MOVES ON SCROLL
        // getPositionY was not taking into account scrollTop correctly.  Using jQuery instead.
    	var left = offset.left,
    		newLeft = left,
			top = offset.top,
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
                    	var codefield;
                    	//alert("mappingAttributes["+i+"] "+ mappingAttributes[i]);
                        var fieldName = mappingAttributes[i][0];
                        var autoSuggColumnIndex = mappingAttributes[i][1];
                        var isCodeField = false;
                        //Tracker#21293 - if hidden code field name present for description _D field
                        if(fieldName.indexOf("CODE~") > -1)
                        {
                        	fieldName = replacevalstr(fieldName,"CODE~","");
                            isCodeField = true;
                        }
                        /* Tracker#: 20659 - SAFARI & FIREFOX:  'ADD COLOR' POPUP DOES NOT RECOGNIZE DATA WHEN SELECTED VIA TYPE AHEAD
                         * Issue - IE getElementById works on name attribute, other browser do not.
                         * Fix - Added jQuery alternative if getElementById does not find element.
                         */
                        var formField = document.getElementById(fieldName) || $('input[name="' +fieldName+ '"]')[0];
                        //alert("fieldName "+ fieldName);
                        if (formField)
                        {
                        	//Tracker#21293 - Adding code field html name to changed fields if code field is hidden
                        	if(formField && formField.type == 'hidden' && isCodeField)
                            {
                        		cf(formField);
                        		codefield = formField;
                            }
                        	//Removing desc html name from the changed fields to avoid the duplicate description issue
                        	if(codefield && getval('chgflds') != Blank)
                            {
                        		cfclearbyname(queryField.id);
                            }
                        	//alert(fieldName + "=" + formField.value);
                            formField.value = resultsObj[selected][autoSuggColumnIndex];
                            if (formField.onchange)
                            {
                                formField.onchange();
                            }

                        }
                    }
                }
                isTypedValue = false;
            }
        }
    }

    //@2010R4
    function setCodeFieldValue(value)
    {
        //console.log("In setCodeFieldValue:" + value);
        var formField = queryField;
        if (formField.id.indexOf(_FIELDS_SEPERATOR + "desc") != -1)
        {
            formField = getElemnt(formField.id.toString().replace(_FIELDS_SEPERATOR + "desc", ""));
            formField.value = value;
            if (formField.onchange)
            {
                formField.onchange();
            }
        }
    }

    function clearCodeFieldValue(value)
    {
        //console.log("In clearCodeFieldValue");
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
                 // when tabbed out of each field, the selected values is reset to -1 as sendQuery() gets fired.
            	/* Tracker#: 19675 - TABBING ISSUE W VENDOR FIELD ON MASTER ITEM HEADER
            	 * Replaced logic that held previous value and skipped setting values for multi-post.
            	 * Now checking if the value is typed or not instead.
            	 */
            	if (isTypedValue)
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
        return validatedResult;
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

     /**
      *
      * @since 2012/R2 Tracker#: 22651
      * onkeydown event gets replace see @VALIDATION.SuggestSourcing init method
      * This causes all the additional keydown event handlers to be removed.
      * This method loops thro' the all the keydown handlers(preKeyDownEvnt - remembers before replacing)
      * and binds it again to the AutoSuggest field.
      *
      */
    function bindOtherKeyDownHandlers()
    {
        var preKeyDownEvntHandlers = preKeyDownEvnt.toString();

        // Expects all handlers to be separated by ;
        // Ex: sug('.......);tabo('234_0'); etc.,
        var splitMethods = preKeyDownEvntHandlers.split(';');
        var jQueryField = $(queryField);
        // Looping thro'all the handlers for keydown event
        // and binding it to the field.
        // The last one is coming with "}" so skipping it.
        for(var i = 0 ; i < splitMethods.length -1 ; i++)
        {
            try
            {
                // Skip this method as this is autosuggest method and not required
                // as qfOnkeydown takes care of the Auto Suggest now.
                if(splitMethods[i].indexOf("sug(") == -1)
                {
                    var s = splitMethods[i].toString(); // Ex: tabo('F201_0')
                    jQueryField.bind("keydown", function(e)
                    {
                        eval(s); // Should not use eval but could not find a way out.
                    });
                }
            }
            catch (e)
            {
                //Eating exception...
            }
        }
    }
}

//----------------------------------------------------
//Global methods
//----------------------------------------------------
var AutoSuggestContainerSourcing = new VALIDATION.SourcingSuggestContainer();

function fetchOldAutoSuggestions(fieldLabel,objQueryField,globalDisableAutoSuggest,fieldAutoSuggest,validationFields, queryDivName, dataType, isValidate, queryUrl, onBeforeSendQuery ,rownum)
{	//alert(validationFields);
	//alert(objQueryField+","+fieldLabel+","+globalDisableAutoSuggest+","+fieldAutoSuggest+","+validationFields+","+queryDivName+","+dataType+","+isValidate+","+queryUrl+","+onBeforeSendQuery+","+rownum);
    // Destroy the auto-suggest object if present and create a new one.  
    var AutoSuggestSourcing = AutoSuggestContainerSourcing.components[objQueryField.id];  
    if (AutoSuggestSourcing)AutoSuggestSourcing.destroy();
    AutoSuggestSourcing = new VALIDATION.SuggestSourcing('autoSuggest',validationFields, objQueryField, queryDivName, dataType, queryUrl, onBeforeSendQuery);  
    AutoSuggestContainerSourcing.components[objQueryField.id] = AutoSuggestSourcing;
    AutoSuggestSourcing.setDisplayDivMessage(true);
    AutoSuggestSourcing.setValidate(isValidate);
    AutoSuggestSourcing.disableAutosuggestDiv(globalDisableAutoSuggest ? true : !fieldAutoSuggest);
    AutoSuggestSourcing.setFieldLabel(fieldLabel);
    //console.log("In fetchAutoSuggestions - new instance created");

    //If there is already a value on the text field, initalise the suggestionArray with the value.
    //Thus it prevents from throwing error through validating e.g. tabbing
  	 var fieldvalue = objQueryField.val
    if (fieldvalue != null && fieldvalue != '')
    {
        AutoSuggestSourcing.addSuggestion(fieldvalue);
    }
}

function convertToBoolean(value)
{
	var val = true;
	if(value == 0)
	{
	 val = false ;
	}
	return val;
}


//Tracker#: 17441 TYPE AHEAD FEATURE IS NOT AVAILABLE FOR THE NOTES SCREEN.
// Including sug() function by passing the docviewids of the associations to the queryUrl.
/**
 * This method is called from layoutHTML
 */
function sug(fieldLabel,htmlFieldName,disableAutoSuggestGlobal,enableFldAutoSuggest,validationFields  ,dataType , isValidate , valId  , showDesc , docViewId)
{	
	var assoc_docviewid = szDocViewId;
	queryUrl = 'validationsourcingsuggest.do?valId='+valId+'&codeFldName='+htmlFieldName.id+'&showDesc='+convertToBoolean(showDesc)+'&docViewId='+docViewId+'&doc_ViewId='+assoc_docviewid+'&search=' ;
	
	fetchOldAutoSuggestions(fieldLabel,document.getElementById(htmlFieldName.id),convertToBoolean(disableAutoSuggestGlobal),convertToBoolean(enableFldAutoSuggest),validationFields, 'div_'+htmlFieldName.id , dataType, convertToBoolean(isValidate), queryUrl)
}




