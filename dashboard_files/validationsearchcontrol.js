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
// Summary: New validation search inline popup div
//Create the VALIDATION namespace object if it does not exist
if (!VALIDATION)
{
    var VALIDATION = new Object();
}

/* -------------------------- Component Class ------------------------------- */
/**
    @since v2011R4 - VPFC
    Tracker#: 19319 COMPENTENCY OVERVIEW - UNABLE TO POST MORE THAN 3 CATEGORIES

    Added the settings parameter - This is a Key Value pair and can send as many
        parameters without a method signature change.

    The First Key value is : isRepeatHorizontally - true or false
                                        true - Section is Horizontal Repeating
                                        false - Section is Vertical Repeating
**/
VALIDATION.SearchControl = function ( /*Object*/ _queryField, /*boolean*/ _isMultiPost, /*Function*/ _multiPostInputCallBack, /*String*/ _queryUrl, /*Key Value pair*/ _settings)
{
    var queryField = _queryField;
    var isMultiPost = _isMultiPost;
    var multiPostInputCallBack = _multiPostInputCallBack;
    var queryUrl = _queryUrl;
    var settings = _settings;
    var mapAttributes = [];
    var searchAttributes = [];
    var searchListAttributes = [];
    var results = [];
    var options = new Object();
    var searchControlDiv = createSearchControlDiv();
    var title = "";
    var currentPageNo = 0;
    var searchInputSize;
    var searchListInputSize;
    var sortLastColumnIndex = -1;
    var sortLastColumnDir = -1;
    var searchLastInputValues = [];
    var searchLastOpValues = [];
    var totalPages = 0;
    var method = "";
    var actionUrl = "";
    var divAligned = false;
    var draggable;
    var selectedRow;
    var selections = []; //List of VALIDATION.Selection instances
    var isLastSearchBarDivOpen = true;
    var requestParams = "";
    //Calls just before single value post @since 2009R3
    var onBeforeSinglePost;
    this.setOnBeforeSinglePost = _onBeforeSinglePost;

    function _onBeforeSinglePost(functionName)
    {
        // callBackFunction = functionName;
        onBeforeSinglePost = functionName;
    }

    //Calls just before setting the data to the field @since 2009R3
    var onBeforeDataPostHandler;
    this.setOnBeforeDataPostHandler = _onBeforeDataPostHandler;

    function _onBeforeDataPostHandler(functionName)
    {
        // callBackFunction = functionName;
        this.onBeforeDataPostHandler = functionName;
    }

    //  Called from outside to clean up SearchControl instances
    //  Returns: void
    this.destroy = destroy0;

    /**
     * Optional parameters to append just before when ajax request
     * is made to the server. Parameters will be in the form
     * name=value&name1=value1&..
     */
    this.addRequestParameters = addRequestParameters0;

    var MAP_OP_ID_NAME = new Array([
    2, "Contains"], [
    11, "Starts with"], [
    12, "Ends with"], [
    0, "Equal to"], [
    1, "Not equal to"], [
    4, "Greater than"], [
    5, "Greater than or equal to"], [
    6, "Less than"], [
    7, "Less than or equal to"], [
    13, "Equal to null"], [
    14, "Is not null"]);

    var PREV_INACTIVE = "images/left_arrow_grey.gif";
    var PREV_ACTIVE = "images/Larrow.gif";
    var NEXT_INACTIVE = "images/right_arrow_grey.gif";
    var NEXT_ACTIVE = "images/Rarrow.gif";
    var CLOSE = "images/close_top.gif";
    var MINIMIZE = "images/min.gif";
    var MAXIMIZE = "images/max.gif";
    var MAXIMIZE_INACTIVE = "images/max_inactive.gif";
    var ARROW_DOWN = "images/arrowdown.gif";
    var NBSP_2_SPAN = "<span>&nbsp;&nbsp;</span>";
    var MAX_PARENT_SCREEN_ROWS = 1000; //Max (Multi post) parent screen rows
    var MAX_PARENT_SCREEN_COLS = 50;
    //--Actual call back method

    function handleSearchResults(_mapAttributes, _searchAttributes, _searchListAttributes, _results, _options)
    {
        mapAttributes = _mapAttributes;
        searchAttributes = _searchAttributes;
        searchListAttributes = _searchListAttributes;
        results = _results;
        if (isNull(results)) results = [];
        options = _options;
        initOptions();
        preProcessRender();
        render();
        postProcessRender()
    }

    function initOptions()
    {
        if (isNotNull(options) && isNotNull(options.title)) title = options.title;

        if (isNotNull(options) && isNotNull(options.tpages)) totalPages = options.tpages;

        if (isNotNull(options) && isNotNull(options.s_size)) searchInputSize = options.s_size;

        if (isNotNull(options) && isNotNull(options.sl_size)) searchListInputSize = options.sl_size;
    }

    function preProcessRender()
    {
        //If new search reset current page number
        if (method == "showall" || method == "search" || method == "sort")
        {
            currentPageNo = 0;
        }
        clearSelections();
    }

    function postProcessRender()
    {
        actionUrl = "";

        //Populate predefined search once popup rendered
        if ((method.length == 0 || method == "view"))
        {
            var count = searchAttributes.length;

            for (var index = 0; index < count; ++index)
            {
                if (searchAttributes[index].QF != null && isNotNull(queryField))
                {
                    document.getElementById(searchAttributes[index].N + "_" + index).value = queryField.value;
                    searchLastInputValues[index] = queryField.value;
                    break;
                }
            }
        }

        if (method == "showall" || method == "search")
        {
            //No results found
            if (results.length == 0)
            {
                var warning = new htmlErrors();
                warning.addError("warningInfo", "Your search resulted in no matching records", false);
                //Tracker#: 15424 THE DROPDOWN ARE BLEEDING THROUGH THE WARNING/ERROR AND SUCCESS MSG WINDOW
				//Passing the divId to the function messagingDiv
                var msgDiv = new messagingDiv(warning, "","","validationsearchcontroldiv");
            }

        }
        method = "";

        if (!isLastSearchBarDivOpen)
        {
            var searchBarDiv = document.getElementById("searchBarDiv");
            var searchBarArrowImg = document.getElementById("searchBarArrow");
            searchBarArrowImg.src = searchBarArrowImg.src.replace("arrowdown", "Rarrow");
            searchBarArrowImg.title = "Expand/Collapse Search";

            if (document.layers) searchBarDiv.display = "none";
            else searchBarDiv.style.display = "none";
        }
    }

    //--Render methods--

    function render()
    {
        searchControlDiv.innerHTML = "";
        searchControlDiv.innerHTML = '<table border="0" cellspacing="0" cellpadding="0" class="searchBlackBorderTable">' + '<tr><td>' + buildToolBar() + '</td></tr>' + '<tr><td><div id="topScrollDiv"><table border="0" cellspacing="0" cellpadding="0" width="100%">' + '<tr><td>' + buildTopScroll(0) + '</td></tr>' + '<tr><td  class="searchBottomBorder"><div id="searchBarDiv">' + buildSearch() + '</div></td></tr>' + '<tr><td>' + buildSearchList() + '</td></tr>' + '<tr><td>' + buildEndScroll(1) + '</td></tr></table></div></td></tr>' + '</table>';

        bindEventHandlers();
        // alert(searchControlDiv.outerHTML);
        alignSearchControlDivContainer();
    }

    //Note: innerHTML do not parse and register events

    function bindEventHandlers()
    {
        //Bind searchinput onchange event handlers
        var count = searchAttributes.length;

        for (var index = 0; index < count; ++index)
        {
            var id = searchAttributes[index].N;
            var dataType = searchAttributes[index].T;
            document.getElementById(id + '_' + index).onchange = function (evt)
            {
                handleSearchFieldsOnChange(this, dataType);
                return true;
            };

            document.getElementById(id + '_' + index).onkeypress = function (evt)
            {
                handleSearchInputKeyDownAction(evt);
                return true;
            }
        }

        //Bind searchbutton onchange event handlers
        document.getElementById("Search_Btn").onclick = function (evt)
        {
            handleSearchButtonAction("Search");
            return true;
        }

        document.getElementById("Show All_Btn").onclick = function (evt)
        {
            handleSearchButtonAction("Show All");
            return true;
        }
        document.getElementById("Reset_Btn").onclick = function (evt)
        {
            handleSearchButtonAction("Reset");
            return true;
        }

        if (isMultiPost)
        {
            document.getElementById("Post_Btn").onclick = function (evt)
            {
                handleSearchButtonAction("Post");
                return true;
            }
        }

        //Bind main checkbox onclick event handlers
        var obj = document.getElementById("chk_-1");

        if (isNotNull(obj))
        {
            obj.onclick = function (evt)
            {
                handleAll();
                return true;
            }
        }

        //Bind searchlist sort button onclick event handlers
        count = searchListAttributes.length;

        for (var index = 0; index < count; ++index)
        {
            if (searchListAttributes[index].H && searchListAttributes[index].H == "Y") continue;
            document.getElementById('sortColumn_' + index).onclick = (function (index)
            {
                return function ()
                {
                    handleSort(index)
                }
            })(index);
        }

        count = results.length;

        for (var index = 0; index < count; ++index)
        {
            var searchListRowObj = document.getElementById('searchListRow_' + index);
            searchListRowObj.ondblclick = (function (index)
            {
                return function ()
                {
                    handleDblClick(index);
                }
            })(index);

            if (isMultiPost)
            {
                var chkObj = document.getElementById("chk_" + index);
                chkObj.onclick = (function (index)
                {
                    return function ()
                    {
                        if (this.checked)
                        {
                            var rowId = 'searchListRow_' + index;
                            handleHighlight(document.getElementById(rowId), index);
                            selections.push(new VALIDATION.Selection(currentPageNo, rowId, index, results[index]));
                            if (selections.length > 0 && selections.length == results.length)
                            {
                                selectTop();
                            }
                        }
                        else
                        {
                            var rowId = 'searchListRow_' + index;
                            handleUnHighlight(document.getElementById(rowId));
                            removeSelectionById(rowId);
                            if (selections.length > 0 && selections.length != results.length)
                            {
                                unselectTop();
                            }
                        }
                    }
                })(index);
            }
        }

        //Bind top toolbar onclick event handlers
        document.getElementById('searchToolBarClose').onclick = function (evt)
        {
            closeSearchControlDiv();
        }
        document.getElementById('searchToolBarMin').onclick = function (evt)
        {
            minimizeSearchControlDiv();
        }

/*document.getElementById('searchToolBarMax').onclick = function(evt) {
             maximizeSearchControlDiv();
        }*/

        document.getElementById('searchBarArrow').onclick = function (evt)
        {
            resizeSearchDisplay();
        }

        //Bind page anchor onclick event handlers
        for (var index = 0; index < 2; ++index)
        {
            obj = document.getElementById('leftNav_' + index);

            if (obj)
            {
                obj.onclick = (function (index)
                {
                    return function ()
                    {
                        handlePageAction(currentPageNo - 1)
                    }
                })(index);
            }
        }

        for (var index = 0; index < 2; ++index)
        {
            obj = document.getElementById('rightNav_' + index);

            if (obj)
            {
                obj.onclick = (function (index)
                {
                    return function ()
                    {
                        handlePageAction(currentPageNo + 1)
                    }
                })(index);
            }
        }

        var elms = getElementsByClass("searchPaginationAnchor", searchControlDiv, "a");

        for (var index = 0; index < elms.length; index++)
        {
            var elm = elms[index];

            if (elm)
            {
                var pageId = parseInt(elm.id.substring(elm.id.lastIndexOf("_") + 1)) - 1;
                elm.onclick = (function (pageId)
                {
                    return function ()
                    {
                        handlePageAction(pageId)
                    }
                })(pageId);
            }
        }

        count = results.length;

        for (var index = 0; index < count; index++)
        {
            elms = getElementsByClass("searchListRow", searchControlDiv, 'tr');
            var elm = elms[index];

            if (elm)
            {
                elm.onmouseover = (function (index)
                {
                    return function ()
                    {
                        handleHighlight(this, index)
                    }
                })(index);
                elm.onmouseout = (function (index)
                {
                    return function ()
                    {
                        var chkObj = document.getElementById("chk_" + index);
                        if (!chkObj || (isMultiPost && !chkObj.checked)) handleUnHighlight(this)
                    }
                })(index);
            }
        }
    }

    function buildToolBar()
    {
        return '<table width="100%" class="searchToolBar"><tr><td>' + title + '</td><td align="right"><img src="' + MINIMIZE + '" title="Minimize" id="searchToolBarMin"/><img src="' + MAXIMIZE_INACTIVE + '" title="Disabled" id="searchToolBarMax"/><img src="' + CLOSE + '" title="Close" id="searchToolBarClose"/></td></tr></table>';
    }

    function buildTopScroll(id)
    {
        return '<table width="100%" class="searchBar"><tr><td class="searchBarTitle">' + NBSP_2_SPAN + '<img title="Expand/Collapse Search" src="' + ARROW_DOWN + '" id="searchBarArrow"/>&nbsp;Search</td><td align="right">' + buildPagination(id) + '</td></tr></table>';
    }

    function buildEndScroll(id)
    {
        return '<table width="100%"><tr><td align="right">' + buildPagination(id) + '</td></tr></table>';
    }

    function buildSearch()
    {
        var count = searchAttributes.length;

        if (count == 0) return "";

        var search = '<table cellspacing="0px" cellpadding="0px" border="0px"><tr>';

        //NOTE: Width must be specified to wrap label text
        for (var i = 0; i < count; ++i)
        {
            //TODO May be some globals style sheets overriding padding style. Force by using inline padding!!
            search += '<td width="116px" class="searchLabels" style="padding-left:5px;">' + searchAttributes[i].L + '</td>';
        }
        search += '</tr><tr>';

        for (var i = 0; i < count; ++i)
        {
            //TODO May be some globals style sheets overriding padding style. Force by using inline padding
            if (i < count - 1)
            //search += '<td class="searchFields';
            search += '<td style="padding-left:5px;padding-bottom:2px;';
            else
            //search += '<td class="searchFieldsLast';
            search += '<td style="padding-left:5px;padding-bottom:2px;padding-right:5px;';

            search += '" >' + buildSearchOpSelect(i) + '</td>';
        }
        search += '</tr><tr>';

        for (var i = 0; i < count; ++i)
        {
            //TODO May be some globals style sheets overriding padding style. Force by using inline padding
            if (i < count - 1)
            //search += '<td class="searchFields';
            search += '<td style="padding-left:5px;padding-bottom:2px;';
            else
            //search += '<td class="searchFieldsLast';
            search += '<td style="padding-left:5px;padding-bottom:2px;padding-right:5px;';

            search += '" >' + buildSearchInput(i) + '</td>';
        }
        search += '</tr><tr><td nowrap colspan=' + count + '"><table><tr><td><table><tr>';
        search += '<td>' + buildSearchButton('Search') + '</td><td>' + buildSearchButton('Show All') + '</td><td>' + buildSearchButton('Reset') + '</td>';
        if (isMultiPost) search += '<td>' + buildSearchButton('Post') + '</td>';
        search += '</tr></table></td></tr></table></td></tr>';
        search += '</table>';
        return search;
    }

    function buildSearchList()
    {
        var columnCount = searchListAttributes.length;

        if (columnCount == 0) return "";

        var searchList = '<table class="searchListTable" width="100%"><tr>';
        if (isMultiPost) searchList += '<th class="searchListLabels" title="Select All Items">' + buildCheckBox(-1) + '</th>';

        for (var i = 0; i < columnCount; ++i)
        {
            if (searchListAttributes[i].H && searchListAttributes[i].H == "Y") continue;
            //NOTE: Width must be specified to wrap label text
            searchList += '<th width="135px" class="searchListLabels">' + searchListAttributes[i].L + '<img title="' + ((sortLastColumnDir != i) ? 'Sort Ascending(A -> Z)' : 'Sort Descending(Z -> A)') + '" src="images/' + ((sortLastColumnDir != i) ? 'arrowdown' : 'arrowup') + ((sortLastColumnIndex == i) ? 'clr' : '') + '.gif" id="' + 'sortColumn_' + i + '" /></th>';
        }

        if (results.length == 0) return searchList;
        searchList += '</tr>';

        var rowCount = results.length;

        if (rowCount > 0)
        {
            for (var i = 0; i < rowCount; ++i)
            {
                searchList += '<tr class="searchListRow" id="searchListRow_' + i + '">';
                if (isMultiPost) searchList += '<td style="padding-left:3px;padding-right:3px;padding-top:1px;padding-bottom:1px;">' + buildCheckBox(i) + '</td>';

                for (var j = 0; j < columnCount; ++j)
                {
                    if (searchListAttributes[j].H && searchListAttributes[j].H == "Y") continue;

                    //TODO:Find better way. Hard coded to override generic stylesheet defined for tr, td elements in screen.css (for example on queryviwer screen)
                    searchList += '<td style="padding-left:3px;padding-right:3px;padding-top:1px;padding-bottom:1px;">' + buildSearchListInput(i, j, results[i][j]) + '</td>'
                }
                searchList += '</tr>';
            }
        }
        searchList += '</table>';
        return searchList;
    }

    function buildSearchInput(index)
    {
        //NOTE:redundant column name appended to avoid javascript name conflicts
        return '<input type="text" ' + 'class="searchInput"' + 'id="' + searchAttributes[index].N + '_' + index + '" ' + 'name="' + searchAttributes[index].N + '_' + index + '" ' + 'size="' + searchInputSize + '" ' + 'value="' + (searchLastInputValues[index] != null ? searchLastInputValues[index] : '') + '" ' + '/> ';
    }

	//Tracker#:16314 AUTO-SUGGEST ISSUES WHEN USING DOUBLE QUOTES
    //Identifies the double quotes in the value and replaces it with escape-character &quot to print on html;
	function textToHtml(text)
	{
	   var html = text.replace( /"/g,"&quot;");
	   //  html = text.replace( /&/g,"&amp;");
	   //  html = html.replace( /</g,"&lt;");
	   return html;
	}

    function buildSearchListInput(row, column, value)
    {
        return '<input type="text" ' + 'id="' + row + '_' + column + '" ' + 'class="searchListData" ' + 'size="' + searchListInputSize + '" ' + 'value="' + textToHtml(value) + '" ' + 'readonly="true"' + '/> ';
    }

    function buildSearchButton(buttonText)
    {
        return '<span class="searchButtonLabels" id="' + buttonText + '_Btn" title="' + buttonText + '"><table cellspacing="0" cellpadding="0" border="0" onMouseOver="_setButtonStyle(this, \'mouseOver\')" onMouseOut="_setButtonStyle(this, \'mouseOut\')"><tr><td class="clsLeftcornerButton"></td><td nowrap class="clsCenterButton">' + buttonText + '</td><td class="clsRightButton"></td></tr></table></span>';
    }

    function buildSearchOpSelect(index)
    {
        var optionsStr = "";

        for (var i = 0; i < MAP_OP_ID_NAME.length; ++i)
        {
            var optionId = MAP_OP_ID_NAME[i][0];
            var optionName = MAP_OP_ID_NAME[i][1];

            if (searchAttributes[index].T != 12)
            {
                if (optionId == 2 || optionId == 11 || optionId == 12) continue;
            }
            optionsStr += '<option value="' + optionId + '" ' + ((searchLastOpValues[index] == optionId) ? 'selected ' : ' ') + '>' + optionName + '</option>';
        }

        return '<select class="searchOpDropDown"' + 'id="' + searchAttributes[index].N + '_' + index + '_op' + '" ' + 'name="' + searchAttributes[index].N + '_' + index + '_op' + '" ' + '> ' + optionsStr + ' </select>';
    }

    function buildPagination(pageId)
    {
        if (totalPages == 0) return "";
        var dots = [".", "..", "..."];

        var pages = [1]; //First value defaults to 1
        var x = currentPageNo - 2;
        var y = currentPageNo + 2;

        //Show dots after 1 page record
        if (totalPages > 4 && x > 1)
        {
            var dotPos = x - 2;

            if (dotPos > 2) dotPos = 2;
            pages.push(dots[dotPos]);
        }

        //Generate numbers in the range for current number (-2 -1 0 +1 +2) and take care of overflows
        for (var i = x; i <= y; i++)
        {
            if (i < 1 || i > totalPages - 2) continue;
            pages.push(i + 1);
        }

        //Show dots before last page
        if (totalPages > 4 && y < totalPages - 2)
        {
            var dotPos = totalPages - y - 3;

            if (dotPos > 2) dotPos = 2;

            if (dotPos != -1) pages.push(dots[dotPos]);
        }

        if (totalPages > 1) pages.push(totalPages);

        var prevImg = (currentPageNo == 0) ? PREV_INACTIVE : PREV_ACTIVE;
        var nextImg = (currentPageNo == totalPages - 1) ? NEXT_INACTIVE : NEXT_ACTIVE;
        var anchor = (currentPageNo == 0 || totalPages == 1) ? '' : '<a id="leftNav_' + pageId + '" href="#leftNav_">';
        var pageNav = anchor + '<img border="0" title="Previous Page" src="' + prevImg + '"/></a>' + NBSP_2_SPAN;

        for (var i = 0; i < pages.length; i++)
        {
            pageNav += (pages[i] == currentPageNo + 1 || pages[i].toString().indexOf(".") != -1) ? '<span class="searchPaginationLabels">' + pages[i] + '</span>' : '<a id="centerNav_' + pageId + '_' + (pages[i]) + '" class="searchPaginationAnchor" href="#centerNav_"/>' + pages[i] + '</a>';

            if (i < pages.length - 1)
            {
                pageNav += '&nbsp;';
            }
        }
        anchor = ((currentPageNo == totalPages - 1) || totalPages == 1) ? NBSP_2_SPAN : NBSP_2_SPAN + '<a id="rightNav_' + pageId + '" href="#rightNav_">';
        pageNav += anchor + '<img border="0" title="Next Page" src="' + nextImg + '"/></a>' + NBSP_2_SPAN;
        return pageNav;
    }

    function buildCheckBox(row)
    {
        return '<input type="checkbox" ' + 'id="chk_' + row + '"/> ';
    }

    //--Select methods--

    function clearSelections()
    {
        selections = [];
    }

    function setValues()
    {
        //alert("setvalues called");
        if (results.length == 0 || selections.length == 0) return;

        if (!mapAttributes || mapAttributes.length == 0) return;

        for (var i = 0; i < mapAttributes.length; ++i)
        {
            if (mapAttributes[i])
            {
                var fieldName = mapAttributes[i][0];
                //alert("fieldName " + fieldName);
                var searchListColumnIndex = mapAttributes[i][1];
                //Tracker#21063 - changed to getobj() as Non-IE browsers not getting the change fields
                //Tracker#21625 - Reverting getobj() to getElementById() as PLM screen displays javascript error while 
                //populating the value from popup.(refer tracker#21695)
                var formField = document.getElementById(fieldName);
                //alert("formField " + formField);
                if (formField)
                {
                    //alert("fieldName " + fieldName);
                    if (selections.length > 1) //Multi select
                    {
                        // Tracker#: 19319 COMPENTENCY OVERVIEW - UNABLE TO POST MORE THAN 3 CATEGORIES
                        // Added handling the Horizontal Repeating section
                        // Assumption is that there will be only one field which will be
                        // repeated horizontally.
                        if(typeof(settings) != 'undefined' && settings.isRepeatHorizontally)
                        {
                            var cellObj = findParentByTagName(formField, 'td');
                            var rowObj = findParentByTagName(formField, 'tr');

                            //Loop: Post checked values and break if row not found
                            if (isNotNull(cellObj) && isNotNull(rowObj))
                            {
                                var frmFldCellObj = cellObj;
                                var postComplete = false;

                                // This will be Horizontal Flow, once all posted
                                for (var j = 0, index = 0; j < MAX_PARENT_SCREEN_ROWS; j++, index++)
                                {

                                    // Look for the cells in that row for the matching field.
                                    // Do not worry about the 50 cols as max, as we break once we do not
                                    // find any cell for that row.
                                    for (var k = 0; k < MAX_PARENT_SCREEN_COLS ; k++, index++)
                                    {
                                        var input = isNotNull(multiPostInputCallBack) ? multiPostInputCallBack(fieldName, rowObj, cellObj) :
                                                    getHoriMultiPostInputField(fieldName, cellObj, frmFldCellObj);

                                        //No more rows available on parent screen
                                        if (isNull(input)) break;

                                        //No more rows available on popup
                                        var selection = selections[index];
                                        if (isNull(selection) || isNull(selection.getRow()))
                                        {
                                            // Identifier, so that we stop continuing looking
                                            // for further rows as the Selected values have been
                                            // posted.
                                            postComplete = true;
                                            break;
                                        }

                                        // alert("Before SelValues0");
                                        setValues0(input, selection.getRow(), searchListColumnIndex);
                                        cellObj = findNextCellSiblingElement(cellObj, 'td');
                                        if(isNull(cellObj))
                                        {
                                            break;
                                        }
                                        //alert("After SelValues0");
                                    }
                                    // If still there are some values that needs to be posted then
                                    // continue
                                    if(!postComplete)
                                    {
                                        //Move cursor to the next row
                                        rowObj = findNextCellSiblingElement(rowObj, 'tr');

                                        if(isNotNull(rowObj))
                                        {
                                            // Get the first cell for the next row.
                                            cellObj = rowObj.cells[0];
                                        }
                                        else
                                        {
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                        else
                        {
                            var cellObj = findParentByTagName(formField, 'td');
                            var rowObj = findParentByTagName(formField, 'tr');

                            //Loop: Post checked values and break if row not found
                            if (isNotNull(cellObj) && isNotNull(rowObj))
                            {
                                var frmFldRowObj = rowObj;
                                for (var j = 0, index = 0; j < MAX_PARENT_SCREEN_ROWS; j++, index++)
                                {
                                    var input = isNotNull(multiPostInputCallBack) ? multiPostInputCallBack(fieldName, rowObj, cellObj) : getMultiPostInputField(fieldName, rowObj, cellObj, frmFldRowObj);

                                    //No more rows available on parent screen
                                    if (isNull(input)) break;

                                    //No more rows available on popup
                                    var selection = selections[index];
                                    if (isNull(selection) || isNull(selection.getRow())) break;

                                    setValues0(input, selection.getRow(), searchListColumnIndex);

                                    //Move cursor to the next row
                                    rowObj = findNextSiblingElement(rowObj, 'tr', cellObj);
                                }
                            }
                        }
                    }
                    else
                    {
                        setValues0(formField, selections[0].getRow(), searchListColumnIndex);
                    }
                }
            }
        }
    }

    // Minor change from @see getMultiPostInputField, as the assumption is that there is always only one
    // repeating field on a horizontal section
    function getHoriMultiPostInputField(fieldName /*String*/, cellObj/*Object:TD*/, frmFldCellObj /*Object: TD first cell*/)
    {
        var ctrl = 'input';
        //TODO Ideally we should get the control type. Now assume only input & textarea
        var inputObj = findChildNodesByTagName(cellObj, ctrl);

        if (isNull(inputObj) || inputObj.length == 0)
        {
            ctrl = 'textarea';
            //May be a text area
            inputObj = findChildNodesByTagName(cellObj, ctrl);
            if (isNull(inputObj) || inputObj.length == 0) return null;
        }

        // Identify the Cell Index for the look up field, this will be same
        // for all the rows/cells as the printing the repeated fields
        // will be same.
        var inputObjCol = findChildNodesByTagName(frmFldCellObj, ctrl);
        var obj;
        var indx=-1;
        for(var i=0; i<inputObjCol.length;i++)
        {
             // Identify the correct input field index by matching
             // the current Field(Look Up is clicked) index.
             if(inputObj[i] && inputObjCol[i].id==fieldName)
             {
                 obj = inputObj[i];
                 indx = i;
                 break;
             }
        }

        return obj;
    }


    function getMultiPostInputField(fieldName /*String*/ , rowObj /*Object:TR*/ , cellObj /*Object:TD*/, frmFldRowObj /*Object: TR current row*/ )
    {
        var cellIndex = cellObj.cellIndex;
        //No more rows available on parent screen
        if (isNull(rowObj)) return null;

        cellObj = rowObj.cells[cellIndex];
        if (isNull(cellObj)) //?
        return null;

        var ctrl = 'input';
        //TODO Ideally we should get the control type. Now assume only input & textarea
        var inputObj = findChildNodesByTagName(cellObj, ctrl);
        if (isNull(inputObj) || inputObj.length == 0)
        {
            ctrl = 'textarea';
            //May be a text area
            inputObj = findChildNodesByTagName(cellObj, ctrl);
            if (isNull(inputObj) || inputObj.length == 0) return null;
        }

        var cellFrmObj = frmFldRowObj.cells[cellIndex];
        var inputFrmObj = findChildNodesByTagName(cellFrmObj, ctrl)

        var inputObjCol = inputObj;
        if(rowObj.rowIndex != frmFldRowObj.rowIndex)
        {
            inputObjCol = inputFrmObj;
        }

        //@since 2010R3
        //Tracker#: 15224 TSR-506 ARTWORK ON TECH SPEC
        // fixed the multipost
        var obj;
        var indx=-1;
        for(var i=0; i<inputObjCol.length;i++)
        {
             if(inputObj[i] && inputObjCol[i].id==fieldName)
             {
                 obj = inputObj[i];
                 indx = i;
                 break;
             }
        }
        //if not the first row, then pick the object from the
        // current row, use the control index
        if(rowObj.rowIndex != frmFldRowObj.rowIndex)
        {
            obj = null;

            if(inputObj.length>indx)
            {
                obj = inputObj[indx];
            }
        }
        return obj;
    }

    function setValues0(formField, selectedRowObj, searchListColumnIndex)
    {
        formField.value = selectedRowObj[searchListColumnIndex];
        if (formField.onchange)
        {
            formField.onchange();
        }
        if (formField.onfocus && (!$(formField).is(':hidden')))//Tracker#:22877 avoided to set focus on hidden fields.
        {
        	 $(formField).focus();
        }
	//@since 2010R4 Tracker#16024 : VALIDATION ERROR ON POP-UP SELECTION AND  TABBED ON THE FIELD POPULATED
	//While setting values to the field on selection, update the Autosuggest suggestionvalues array.(refer autosuggest.js)
        var AutoSuggest = AutoSuggestContainer.components[formField.id];
        if(AutoSuggest && AutoSuggest.getQueryField())
        {
            var queryField = AutoSuggest.getQueryField();

            if(queryField && queryField.id==formField.id)
            {
                var fieldvalue = queryField.value;
                if (fieldvalue != null && fieldvalue != '')
                {
                    AutoSuggest.addSuggestion(fieldvalue);
                }
            }
        }
        //alert(formField.outerHTML);
    }

    //--Handler methods--

    function handleSearchFieldsOnChange(fldObj, dataType)
    {
        if (dataType == _DATA_TYPE_VARCHAR)
        {
            u(fldObj);
        }
    }

    function handleSort(sortColumnIndex)
    {
        var fieldObj = document.getElementById('sortColumn_' + sortColumnIndex);
        method = 'sort';
        setActionUrl('sortColumn=' + sortColumnIndex);
        sortLastColumnIndex = sortColumnIndex;

        if (fieldObj.src.indexOf('arrowdown') != -1)
        {
            fieldObj.src = fieldObj.src.replace('arrowdown', 'arrowup');
            setActionUrl('sortDir=asc');
            sortLastColumnDir = sortColumnIndex;
        }
        else
        {
            sortLastColumnDir = -1;
            setActionUrl('sortDir=desc');
            fieldObj.src = fieldObj.src.replace('arrowup', 'arrowdown');
        }
        sendQuery();
    }

    function reset()
    {
        //var elms = searchControlDiv.getElementsByTagName("*");
        var elms = getElementsByClass("searchInput", searchControlDiv, "input");

        for (var i = 0; i < elms.length; i++)
        {
            var elm = elms[i];

            switch (elm.type)
            {
            case "text":
                elm.value = "";
                break;

            case "select":
                elm.selectedIndex = 0;
                break;
            }
        }
        elms = searchControlDiv.getElementsByTagName("select");

        for (var i = 0; i < elms.length; i++)
        {
            var elm = elms[i];
            elm.selectedIndex = 0;
        }

        searchLastInputValues = [];
        searchLastOpValues = [];
    }

    function handlePageAction(pageNo)
    {
        currentPageNo = pageNo;
        method = 'page';
        setActionUrl("pageNo=" + pageNo);
        sendQuery();
    }

    function handleSearchButtonAction(buttonText)
    {
        if (buttonText == 'Reset')
        {
            reset();
            return;
        }

        if (buttonText == 'Post')
        {
            if (selections.length == 0) return;
            setValues();
            clearSelections();
            closeSearchControlDiv();
            return;
        }

        if (buttonText == 'Search')
        {
            searchLastInputValues = [];
            searchLastOpValues = [];

            var count = searchAttributes.length;

            //Explicitly call onchange on text fields.Because the button is a span button and on click of a button in IE6 onclick fires before onchange
            for (var index = 0; index < count; ++index)
            {
                var id = searchAttributes[index].N + '_' + index;
                var dataType = searchAttributes[index].T;
                handleSearchFieldsOnChange(document.getElementById(id), dataType);
            }
            method = 'search';
            composeValChgFlds();
        }
        else if (buttonText == 'Show All')
        {
            method = 'showall';
            sortLastColumnIndex = -1;
            reset(); //Else problem while sorting
        }

        sendQuery();
    }

    function composeValChgFlds()
    {
        var valChgFlds = "";
        var count = searchAttributes.length;

        for (var index = 0; index < count; ++index)
        {
            var fldObj = document.getElementById(searchAttributes[index].N + '_' + index);
            var fldObjValue;

            if (fldObj.tagName.toUpperCase() == "SELECT")
            {
                fldObjValue = fldObj.options[obj.selectedIndex].value;
            }
            else
            {
                fldObjValue = fldObj.value;
            }

            var fldOpObj = document.getElementById(searchAttributes[index].N + '_' + index + '_op');
            var fldOpObjValue = fldOpObj.options[fldOpObj.selectedIndex].value;

            if (fldOpObjValue == '13' || fldOpObjValue == '14') //Equals to null && Is not null
            {
                valChgFlds += fldObj.id + ",";
                setActionUrl(fldOpObj.id + '=' + fldOpObjValue);
                searchLastOpValues[index] = fldOpObjValue;
            }
            else
            {
                //Set name=value pairs
                if (fldObjValue != null && fldObjValue != '' && fldObjValue.length > 0)
                {
                    valChgFlds += fldObj.id + ",";
                    //Tracker#22056 - Encoding and decoding the input value to avoid special character issue while searching
                    setActionUrl(fldObj.id + '=' + encodeURIComponent(fldObj.value));
                    setActionUrl(fldOpObj.id + '=' + fldOpObjValue);
                    //Take backup
                    searchLastInputValues[index] = fldObjValue;
                    searchLastOpValues[index] = fldOpObjValue;
                }
            }
        }
        setActionUrl("valChgFlds=" + valChgFlds);
    }

    function handleDblClick(index)
    {
        clearSelections();
        selections.push(new VALIDATION.Selection(currentPageNo, 'searchListRow_' + index, index, results[index]));
        // Supported only for Single selection post and not multi post.
        // If the call back function is defined for this instance then call the function passing the selecte row
        // values Ex: 200,1,2 and that will handle the click event.
        // Ex: Used in Search POM process on POM Worksheet screen.
        // if(callBackFunction && callBackFunction!=null)
        if (onBeforeSinglePost && onBeforeSinglePost != null)
        {
            onBeforeSinglePost(selections[0].getRow());
        }
        else
        {
            setValues();
        }
        closeSearchControlDiv();
    }

    function handleHighlight(rowObj, rowIndex)
    {
        selectedRow = rowIndex;
        rowObj.style.backgroundColor = "#F4EDAD";
    }

    //On Search input if enter key pressed submit search

    function handleSearchInputKeyDownAction(evt)
    {
        var code;
        // make sure we have a valid event variable
        if (!evt && window.event)
        {
            evt = window.event;
        }
        code = evt.keyCode;

        if (code == 13)
        {
            //Submit search
            handleSearchButtonAction("Search");
        }
    }

    function handleUnHighlight(rowObj)
    {
        rowObj.style.backgroundColor = "";
    }

    //--Ajax methods
    /**
     * Perform an asynchronous callback to the server to get the search values
     */

    function sendQuery()
    {
        objAjax = new htmlAjax();

        if (objAjax)
        {
            //queryUrl
            var url = queryUrl + (actionUrl != null && actionUrl.length > 0 ? '&' : '') + actionUrl;
            var index = url.indexOf("?");
            var path = url.substring(0, index);
            var parameters = url.substring(index + 1) + (requestParams != null && requestParams.length > 0 ? '&' : '') + requestParams;
            //alert(parameters);
            objAjax.setActionMethod(method);
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
            //--
            objAjax.setProcessHandler(handleSearchResults0);
            objAjax.sendRequest();
        }
    }

    function handleSearchResults0(objAjax)
    {
        if (objAjax)
        {
            //alert(objAjax.getHTMLResult());
            var errors = objAjax.error();

            if (errors.hasErrorOccured())
            {
            	//Tracker#: 15424 THE DROPDOWN ARE BLEEDING THROUGH THE WARNING/ERROR AND SUCCESS MSG WINDOW
				//Passing the divId to the function messagingDiv
                var msgDiv = new messagingDiv(errors,"","","validationsearchcontroldiv");

                results = [];
                actionUrl = ""; //Reset URL
            }
            else
            {
                eval(objAjax.getHTMLResult());
            }
        }
    }

    //--Util methods--

    function setActionUrl(url)
    {
        actionUrl += (actionUrl != null && actionUrl.length > 0 ? '&' : '') + url;
    }

    function createSearchControlDiv()
    {
        destroy0(); //See if any instance exists
        divObj = document.createElement("div");
        //document.getElementById(_getWorkAreaObj().getDivContainerName()).appendChild(divObj);
        document.body.appendChild(divObj);
        divObj.id = 'validationsearchcontroldiv';
        divObj.style.position = "absolute";
        divObj.style.visibility = "visible";
        //divObj.style.overflow = "auto";
        divObj.style.zIndex = 999;
        //divObj.style.border="1px solid red";
        divObj.style.background = "#ffffff";

        $(divObj).draggable();

        return divObj;
    }

    function closeSearchControlDiv()
    {
        destroy0();
    }

    function destroy0()
    {
        var searchControlDiv = document.getElementById('validationsearchcontroldiv');

        if (searchControlDiv)
        {
            //Remove any previous div object if any
            searchControlDiv.innerHTML = "";
            searchControlDiv.parentNode.removeChild(searchControlDiv);
        }

        if (draggable != null) draggable.draggable("destroy");
        draggable = null;

        closeMsgBox(); //If any message box open close it for example 'Your search resulted in ...'
    }

    function addRequestParameters0(_requestParams)
    {
        requestParams += _requestParams;
    }

    //Checks for not null and undefined

    function isNotNull(obj)
    {
        return (typeof obj != 'undefined' && obj != 'null' && obj != null);
    }

    function isNull(obj)
    {
        return (obj == null || typeof(obj) == 'undefined');
    }

    function alignSearchControlDivContainer()
    {
        if (!divAligned) //Do not reposition div
        {
            showDivCenter(searchControlDiv.offsetWidth, searchControlDiv.offsetHeight, "validationsearchcontroldiv");
            divAligned = true;
        }
    }

    function minimizeSearchControlDiv()
    {
        var topToolBarDiv = document.getElementById("topScrollDiv");

        if (document.layers) topToolBarDiv.display = "none";
        else topToolBarDiv.style.display = "none";
        var searchToolBarMax = document.getElementById("searchToolBarMax");
        //Reset onclick event
        document.getElementById('searchToolBarMax').onclick = function (evt)
        {
            maximizeSearchControlDiv();
        }
        searchToolBarMax.src = searchToolBarMax.src.replace("max_inactive", "max");
        searchToolBarMax.title = "Maximize";

        showDivCenter(searchControlDiv.offsetWidth, searchControlDiv.offsetHeight, "validationsearchcontroldiv");
    }

    function maximizeSearchControlDiv()
    {
        var topToolBarDiv = document.getElementById("topScrollDiv");

        if (document.layers) topToolBarDiv.display = "block";
        else topToolBarDiv.style.display = "block";
        var searchToolBarMax = document.getElementById("searchToolBarMax");
        document.getElementById('searchToolBarMax').onclick = "";
        searchToolBarMax.src = searchToolBarMax.src.replace("max", "max_inactive");
        searchToolBarMax.title = "Disabled";
        showDivCenter(searchControlDiv.offsetWidth, searchControlDiv.offsetHeight, "validationsearchcontroldiv");
    }

    function resizeSearchDisplay()
    {
        var searchBarDiv = document.getElementById("searchBarDiv");
        var searchBarArrowImg = document.getElementById("searchBarArrow");

        if (searchBarDiv.style.display == 'none')
        {
            searchBarArrowImg.src = searchBarArrowImg.src.replace('Rarrow', 'arrowdown');
            searchBarArrowImg.title = "Expand/Collapse Search";

            if (document.layers) searchBarDiv.display = "block";
            else searchBarDiv.style.display = "block";
            isLastSearchBarDivOpen = true;
        }
        else
        {
            searchBarArrowImg.src = searchBarArrowImg.src.replace('arrowdown', 'Rarrow');
            searchBarArrowImg.title = "Expand/Collapse Search";

            if (document.layers) searchBarDiv.display = "none";
            else searchBarDiv.style.display = "none";
            isLastSearchBarDivOpen = false;
        }
    }

    function getElementsByClass(searchClass, node, tag)
    {
        var classElements = new Array();

        if (node == null)
        {
            node = document;
        }

        if (tag == null)
        {
            tag = '*';
        }
        var els = node.getElementsByTagName(tag);
        var elsLen = els.length;
        var pattern = new RegExp("(^|\\s)" + searchClass + "(\\s|$)");
        var j = 0;

        for (i = 0; i < elsLen; i++)
        {
            if (pattern.test(els[i].className))
            {
                classElements[j] = els[i];
                j++;
            }
        }
        return classElements;
    }

    function findNextSiblingElement(element, tagName, tdElement)
    {
        var nextSiblingElement;
        var nextSibling;

        while ((nextSibling = element.nextSibling))
        {
            if (nextSibling.nodeType == 1 && nextSibling.tagName.toLowerCase() == tagName)
            {
                nextSiblingElement = nextSibling;
                //Jump if rows skipped while display
                if (isNotNull(nextSiblingElement.cells[tdElement.cellIndex]))
                {
                    break;
                }
            }
            element = nextSibling;
        }
        return nextSiblingElement;
    }

    // Tracker#: 19319 COMPENTENCY OVERVIEW - UNABLE TO POST MORE THAN 3 CATEGORIES
    // Just return the next element matching the TagName.
    function findNextCellSiblingElement(element, tagName)
    {
        var nextSiblingElement;
        var nextSibling;

        while ((nextSibling = element.nextSibling))
        {
            // alert("nextSibling.nodeType:" + nextSibling.nodeType);
            if (nextSibling.nodeType == 1 && nextSibling.tagName.toLowerCase() == tagName)
            {
                nextSiblingElement = nextSibling;
                break;
            }
            element = nextSibling;
        }
        return nextSiblingElement;
    }

    function findParentByTagName(element, tagName)
    {
        var node = element;

        while (node.parentNode)
        {
            node = node.parentNode;

            if (node.nodeName.toLowerCase() == tagName)
            {
                return node;
            }
        }
        return null;
    }
  function findChildNodesByTagName(el, tagName)
    {
        var foundNodes = new Array();
        var length = el.childNodes.length;
        var index = 0;

        for (var i = 0; i < length; i++)
        {
          /*Tracker 19022 # CANNOT CHANGE OR ADD MULTIPLE MATERIALS TO A MATERIAL PROJECTION AT THE SAME TIME
        	Checking controll is "Anchor" tag or not if it is anchor tag checking whether inside anchor tag any 
        	input controll is there or not 
        	If it is there assign that controll to "foundNodes[]"
        	*
        	*/
        	if(el.childNodes[i].nodeName.toLowerCase()=="a")
            {
            
             if(el.childNodes[i].childNodes[1].nodeName.toLowerCase()==tagName)
	            {
	            foundNodes[index++] = el.childNodes[i].childNodes[1];	
	            }
            }
            else if (el.childNodes[i].nodeName.toLowerCase() == tagName)
            {
                foundNodes[index++] = el.childNodes[i];
            }
        }
        return foundNodes;
    }
    
    //--check box group methods--

    function selectAll()
    {
        clearSelections();
        var count = results.length;
        for (var i = 0; i < count; i++)
        {
            var el = document.getElementById("chk_" + i);
            el.checked = true;
            var rowId = 'searchListRow_' + i;
            handleHighlight(document.getElementById(rowId), i);
            selections.push(new VALIDATION.Selection(currentPageNo, rowId, i, results[i]));
        }
    }

    //Remove ONE unselected selection

    function removeSelectionById(id)
    {
        var count = selections.length;
        for (var index = 0; index < count; ++index)
        {
            var selection = selections[index];
            var rowId = selection.getRowId();
            if (rowId == id)
            {
                //@2011R1 (some reasons Array.prototype.remove conflicts with Jquery)
                selections = jQuery.grep(selections, function(value) {
                    return value != selections[index];
                });
                break;
            }
        }
    }

    function selectTop()
    {
        var el = document.getElementById("chk_-1");
        if (isNotNull(el))
        {
            el.checked = true;
        }
    }

    function unselectTop()
    {
        var el = document.getElementById("chk_-1");
        if (isNotNull(el))
        {
            el.checked = false;
        }
    }

    function handleAll()
    {
        var el = document.getElementById("chk_-1")
        if (el.checked == true)
        {
            selectAll();
        }
        else
        {
            unselectAll();
        }
    }

    function unselectAll()
    {
        var count = results.length;
        for (var i = count - 1; i >= 0; i--)
        {
            var el = document.getElementById("chk_" + i);
            if (el.type == 'checkbox' && el.checked)
            {
                el.checked = false;
                handleUnHighlight(document.getElementById('searchListRow_' + i));
            }
        }
        clearSelections();
    }

    //--Public methods--
    /**
     * Display popup with default search filter
     */
    this.showPopup = function ()
    {
    	//Tracker#22056 - Encoding the data to avoid special character issue
        if (isNotNull(queryField)) setActionUrl("search=" + encodeURIComponent(queryField.value.toUpperCase()));
        method = "view";
        sendQuery();
    }

}

//Utils script class.Following method taken from net forum

function showDivCenter(Xwidth, Yheight, divid)
{
    // First, determine how much the visitor has scrolled
    var scrolledX, scrolledY;

    if (self.pageYOffset)
    {
        scrolledX = self.pageXOffset;
        scrolledY = self.pageYOffset;
    }
    else if (document.documentElement && document.documentElement.scrollTop)
    {
        scrolledX = document.documentElement.scrollLeft;
        scrolledY = document.documentElement.scrollTop;
    }
    else if (document.body)
    {
        scrolledX = document.body.scrollLeft;
        scrolledY = document.body.scrollTop;
    }

    // Next, determine the coordinates of the center of browser's window
    var centerX, centerY;

    if (self.innerHeight)
    {
        centerX = self.innerWidth;
        centerY = self.innerHeight;
    }
    else if (document.documentElement && document.documentElement.clientHeight)
    {
        centerX = document.documentElement.clientWidth;
        centerY = document.documentElement.clientHeight;
    }
    else if (document.body)
    {
        centerX = document.body.clientWidth;
        centerY = document.body.clientHeight;
    }

    // Xwidth is the width of the div, Yheight is the height of the
    // div passed as arguments to the function:
    var leftOffset = scrolledX + (centerX - Xwidth) / 2;

    if (leftOffset < 0) leftOffset = 10; //Edited
    var topOffset = scrolledY + (centerY - Yheight) / 2;

    if (topOffset < 0) topOffset = 10; //Edited
    // The initial width and height of the div can be set in the
    // style sheet with display:none; divid is passed as an argument to // the function
    var o = document.getElementById(divid);
    var r = o.style;
    r.position = 'absolute';
    r.top = topOffset + 'px';
    r.left = leftOffset + 'px';
    r.display = "block";
}

/**
 * Constructs a row selection instance.Each Selection represents the selected row
 *
 * @since 2009R3
 */
VALIDATION.Selection = function (_pageNo /*Integer*/ , _rowId /*String*/ , _rowIndex /*Integer*/ , _row /*Array*/ )
{
    //NOTE:NOW pageNo IS NOT USED
    this.pageNo = _pageNo;
    this.rowId = _rowId;
    this.rowIndex = _rowIndex;
    this.row = _row;

    /**
     * Returns the selected row page no
     */
    this.getPageNo = function ()
    {
        return this.pageNo;
    }

    /**
     * Returns row id
     */
    this.getRowId = function ()
    {
        return this.rowId;
    }

    /**
     * Returns the selected index on the specific page (no)
     */
    this.getRowIndex = function ()
    {
        return this.rowIndex;
    }

    /**
     * Returns the selected row array of values
     */
    this.getRow = function ()
    {
        return this.row;
    }
}

//--The following code specific to new UI needs to be moved out
/**
 *  Accessed from Layout class.
 */
function displayValidationSearchPopUp(queryField, isMultiPost, multiPostInputCallBack, queryUrl, onbeforeDataPostHandler, settings/* Key Value pairs.*/)
{
    ////Tracker#:12867 - OUTSTANDING TECH SPEC>MASS REPLACE ISSUES
    // don't show the popup if the control is readonly or diabled
    if (queryField)
    {
        try
        {
            if (true == queryField.style.readOnly || true == queryField.disabled)
            {
                return; //don't show the popup if the control is readonly or disabled
            }
        }
        catch (e)
        {
        }

    }
    //If suggestion dropdown opened close it
    var searchControl = new VALIDATION.SearchControl(queryField, isMultiPost, multiPostInputCallBack, queryUrl, settings);
    searchControl.showPopup();
    if (typeof(onbeforeDataPostHandler) != 'undefined')
    {
        searchControl.setOnBeforeDataPostHandler(onbeforeDataPostHandler);
    }
}

// Tracker#: 19319 COMPENTENCY OVERVIEW - UNABLE TO POST MORE THAN 3 CATEGORIES
// Called from HTMLComponent class
// Added the 7th parameter which is a Key value pair
// The first key is isRepeatHorizontally - true  - Section is Horizontal repeating
//                                         false - Section is Vertical repeating
function _dVSP(obj, showDesc, isMultiPost, multiPostInputCallBack, queryUrl, onbeforeDataPostHandler, settings)
{
    var  objQueryField = getElemnt(obj.id.toString().replace("valsearch_",""));
    var objCodeFld = objQueryField;
	
	//@since 2010R4 Tracker#16024 : VALIDATION ERROR ON POP-UP SELECTION AND  TABBED ON THE FIELD POPULATED
	//Invoking the onkeydown event of autosuggest while we select values from the pop-up. (refer autosuggest.js)
    var AutoSuggest = AutoSuggestContainer.components[objCodeFld.id];
    if(objQueryField && objQueryField.onkeydown && !AutoSuggest)
    {
        objQueryField.onkeydown();
    }

    if(showDesc)
    {
        objCodeFld = _getDescCodeField(objQueryField);
    }

    if(queryUrl)
    {
        queryUrl = _buildQueryUrl(queryUrl,showDesc,objCodeFld.id,objQueryField.id);
    }
    displayValidationSearchPopUp(objQueryField, isMultiPost, multiPostInputCallBack, queryUrl, onbeforeDataPostHandler, settings);
}
//Tracker#: 15424 THE DROPDOWN ARE BLEEDING THROUGH THE WARNING/ERROR AND SUCCESS MSG WINDOW
//This function is called from the loadworkarea so that if any validation pop-up is open on the screen
//then it should hide it when navigating from the screen. 
function closeValidationPopup()
{
	var searchControlDiv = document.getElementById('validationsearchcontroldiv');
	if(searchControlDiv)
	{	
		searchControlDiv.style.display = "none";
		searchControlDiv.style.visibility="hidden";
		searchControlDiv.innerHTML = "";
        searchControlDiv.parentNode.removeChild(searchControlDiv);
	}
}
