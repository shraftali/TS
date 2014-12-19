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

/*************************************/
/** Generic Grid action handler    **/
/*************************************/

var gridhandler = (function(){
    /*
        Grid Handler constants/immutable, can be accessed only in gridhandler object.
    */
    var CONSTANTS = {
        COLLAPSEARROW : "images/Rarrow.gif",
        EXPANDARROW : "images/arrowdown.gif",
        NEXTLEVELROWOBJ : "nextLevelRowObj",
        NEXTLEVELCONTAINER : "nextLevelContainer",
        CURRCELLOBJID: "currCellObjId",
        PARENTCELLID: "parentCellObjId",
        KEYINFO: "keyinfo",
        LEVEL: "level",
        INDEX: "index",
        MAINSECTIONDIV: "#MainSection_divCollapsable"
    };
    if(Object) Object.freeze(CONSTANTS); //Force this not to be changed  - Compatabile with IE9 + , Chrome, Safari

    // ******************************************************* //
    // private methods
    // ******************************************************* //
    function expand(currCellObj, args) {
    	//Tracker#:26898 - AUTO-INSERT ITEM CHANNELS FOR COST OPTIMIZATION 
    	//set bShowMsg to true as it will be false while navigating from RFQ to CostOptimization screen.
    	bShowMsg=true;
        // Show the hidden row, this row belongs to the table that has the row which holds the current image clicked
        var nextLvlRowObjId = args[CONSTANTS.NEXTLEVELROWOBJ];
        var $nextLvlRowObj;
        if(nextLvlRowObjId != null && nextLvlRowObjId != ""){
            $nextLvlRowObj = $('#'+ nextLvlRowObjId);
        }
        if($nextLvlRowObj !=null){
            $nextLvlRowObj.show();
        }
        // Rows is shown now show the container which will hold the subgrid containers at the next level.
        var nextLvlContainerId = args[CONSTANTS.NEXTLEVELCONTAINER];

        var nextLvlContainer;
        if(nextLvlContainerId != null && nextLvlContainerId != ""){
            nextLvlContainer = $('#'+ nextLvlContainerId);
        }
        if(nextLvlContainer != null){
            //nextLvlContainer.show();
            nextLvlContainer.css("visibility", "visible");
            nextLvlContainer.css("display", "block");
        }

        var currImgObj = currCellObj.find('img');
        currImgObj.attr('src' , CONSTANTS.EXPANDARROW);
        var currCellObjId = $(currCellObj).attr("id");
        var objAjax = new htmlAjax();
       // objAjax.setActionURL("costoptimization.do");
        if(currCellObjId.indexOf("Market_Channel") != -1){
        	objAjax.setActionURL("managechanneldeliveries.do");
        }
        else{
        	objAjax.setActionURL("costoptimization.do");
        }
        
       
        objAjax.setActionMethod("showsubgrid");
        objAjax.parameter().add(CONSTANTS.NEXTLEVELCONTAINER, nextLvlContainerId);
        objAjax.parameter().add(CONSTANTS.CURRCELLOBJID, currCellObjId);
        objAjax.parameter().add(CONSTANTS.PARENTCELLID, args[CONSTANTS.PARENTCELLID]);
        objAjax.parameter().add(CONSTANTS.KEYINFO, $(currCellObj).attr("keyinfo"));
        objAjax.parameter().add(CONSTANTS.INDEX, args[CONSTANTS.INDEX]);
        objAjax.parameter().add(CONSTANTS.LEVEL, args[CONSTANTS.LEVEL]);
        objAjax.setProcessHandler(expandHandler);
        objAjax.sendRequest();
    }

    function expandHandler(objAjax){
        var nextLvlContainerId = objAjax.parameter().getParameterByName(CONSTANTS.NEXTLEVELCONTAINER);


        //window.prompt("nextLvlContainerId:" + nextLvlContainerId , objAjax.getResult());

        if(objAjax){
            if(objAjax.isProcessComplete()){

            	var beforeExpand=document.getElementById(nextLvlContainerId).offsetWidth;

            	var prevCellDivId=$('#'+nextLvlContainerId).parents('table').find("tr:first").find('td:last').find('div:first').attr("id");

            	var isAllignRequired=0;
            	 if(document.getElementById(prevCellDivId) != null){
            		 //Set offset width only if it is coming first time
            		  isAllignRequired=document.getElementById(prevCellDivId).offsetWidth;

            	 }
                $("#"+nextLvlContainerId).html(objAjax.getResult());
                var afterExpand=document.getElementById(nextLvlContainerId).offsetWidth;
                //_execAjaxScript(objAjax);
                var adjoffsetwidth=afterExpand-beforeExpand;
                //To prevent content spreading on grid adjust appended cells offsetwidth

                if(prevCellDivId != null){
                	if(adjoffsetwidth>0 && isAllignRequired <= 3){
                		//document.getElementById(prevcellObjId).style.width=adjoffsetwidth+"px";
                		document.getElementById(prevCellDivId).style.width=adjoffsetwidth+"px";
                	}
                }

            }
            if(bShowMsg){
                msgInfo = objAjax.getAllProcessMessages();
                if(msgInfo!=""){
                    _displayProcessMessage(objAjax);
                }
            }

            var  currCellObjId =  objAjax.parameter().getParameterByName(
                                        CONSTANTS.CURRCELLOBJID);
            var currCellObj;

            if(currCellObjId != ""){
                // Not wrapping around JQuery as the Subject is just a DOM object
                currCellObj = getElemnt(currCellObjId);

                try{
                    gridhandler.registerSubjects(currCellObjId);
                    var currLevel = (parseInt(objAjax.parameter().getParameterByName(
                                            CONSTANTS.LEVEL)) - 1);
                    // notify the observer that this subject has expanded.
                    currCellObj.notify(currCellObj, objAjax.parameter().getParameterByName(
                                            CONSTANTS.PARENTCELLID),
                                            currLevel, true);
                }
                catch(e){}

            }

            objAjax = null;

            // If the click is not user initiated but fired programatically
            // only then fire the next Grid onclick event which is at the same level
            if(currCellObj)
            {
                var isManual = $(currCellObj).attr("manual");
                // This will be false for user initiated click event.
                if(isManual && isManual == "true")
                {
                    expandNextGrid(currCellObjId);
                }
                // The job is done remove the attribute from the expanded cell.
                $(currCellObj).removeAttr("manual");
            }
        }
    }

    function expandNextGrid(currCellObjId)
    {
        var subjsCount = gridhandler.observer.count();
        var firedGridExpand = false;
        var currLevel = parseInt(gridhandler.observer.getCurrLoopLevel());
        // The grid has been expanded remember that this has been done
        // as we keep looking for next one to be expanded
        // in the same level, starting from 0 index
        gridhandler.observer.addToTemp(currCellObjId);

        for(var i = 0 ; i < subjsCount ; i++){
            var subjectData = gridhandler.observer.get(i);

            var index = gridhandler.observer.indexOfTemp(subjectData.subjId, 0);

            // Available in temp, so this has been added expanded
            // Now look for the next one.
            if(index != -1)
            {
                continue;
            }

            // First expand all those Grids that are the same level
            // Then look into the next level
            if(subjectData.currLevel == currLevel)
            {
                var childGridId = subjectData.subjId;
                var childObj = $("#" + childGridId);
                if(childObj){
                    // Inform the Grid click Handler that this is fired
                    // programatically and not user initiated.
                    childObj.attr("manual", "true");
                    childObj.click();
                    firedGridExpand = true;
                    break;
                }
            }
        }

        // We are done with the curr level now look for
        // next level list of grids that needs to be expanded.
        if(!firedGridExpand && currLevel != 3) // Handled till level 0, 1, 2,3
        {
            currLevel++;
            gridhandler.observer.setCurrLoopLevel(currLevel);
            // Start firing the expand grids for the next level
            fireGridsExpanding(currLevel);
        }
    }

    function collapse(obj, args){
        // Show the hidden row, this row belongs to the table that has the row which holds the current image clicked
        var nextLvlRowObjId = args[CONSTANTS.NEXTLEVELROWOBJ];
        var $nextLvlRowObj;
        if(nextLvlRowObjId != null && nextLvlRowObjId != ""){
            $nextLvlRowObj = $('#'+ nextLvlRowObjId);
        }
        if($nextLvlRowObj !=null){
            $nextLvlRowObj.hide();
        }

        var currImgObj = obj.find('img');
        currImgObj.attr('src' , CONSTANTS.COLLAPSEARROW);
        try{
            var domObj = getElemnt(obj.attr("id"));
            // notify the observer that this subject has collapsed.
            domObj.notify(obj, null, false);
        }
        catch(e){}
    }

    function initSubject(subObj) {
        extend( new Subject(), subObj);
    }

    function fireGridsExpanding(currLevel) {
        var subjsCount = gridhandler.observer.count();

        for(var i = 0 ; i < subjsCount ; i++)
        {
            var subjectData = gridhandler.observer.get(i);

            // Fire the one - we will be firing only one at a time
            if(subjectData.currLevel == currLevel)
            {
                var subjId = subjectData.subjId;
                var subjIdObj = $("#" + subjId);

                if(subjIdObj){
                    subjIdObj.attr("manual", "true");
                    subjIdObj.click();
                    break;
                }
            }
        }
    }

    // ******************************************************* //
    // Encapsulate mainGridSearch feature inside gridHandler
    // ******************************************************* //
    var searchhandler = {
        searchDocViewId:"",
        criteriaEmpty: function(){
            var searchContainer = $("#_SearchSection");
            var continueToText = true;
            searchContainer.find("option:selected").each(function(){
                // We ignore the first selected one as it is --select-- entry and not an valid entry.
                if($(this).index() > 0){
                    continueToText = false; // Already selected from dropdown no need to look for input boxes
                    // break each loop.
                    return false; // Exit each loop. Note in order to exit a JQuery each loop we can do it only by return false;
                                  // return true would mean continue to next loop.
                }
            });

            if(!continueToText) return false;

            var $all = searchContainer.find("input:text");
            //var $emptyTxt = $all.filter('[value=""]');
          //Jyothi:Start
            var $emptyTxt = $all.filter(function(index, el){ 
                return el.value == '';
            });
            //Jyothi :End
            if ($emptyTxt.length == 0 || ($all.length == $emptyTxt.length)) {
    	        return true;
            }
            return false;
        },
        clearChangedFields: function(){
            var htmlAreaObj = _getWorkAreaObj();
            var registeredDocViews = htmlAreaObj.getAllDocViewIds();
            if(registeredDocViews != ""){
	            var docViews = (registeredDocViews+ "" ).split(",");
                for(var i = 0 ; i < docViews.length ; i++){
	                var docViewId = docViews[i];
                    if(docViewId != "" && docViewId != searchDocViewId)
                    {
                        var areaObj =_getAreaObjByDocView(docViewId);
	                    var objHtmlData = areaObj.getHTMLDataObj();
                        objHtmlData.resetChangeFields();
                    }
                }
            }
        },
        searchResp: function(searchAjax){
            if(searchAjax){
                if(searchAjax.isProcessComplete()){
                    $(gridhandler.CONSTANTS.MAINSECTIONDIV).html(searchAjax.getResult());
                    searchhandler.clearChangedFields();
                }
                if(bShowMsg==true){
                    msgInfo = searchAjax.getAllProcessMessages();
                    if(msgInfo!=""){
                        _displayProcessMessage(searchAjax);
                    }
                }
                searchAjax = null;
            }
        },
        resetHTMLSearchData: function (docView){
            var areaObj =_getAreaObjByDocView(docView);
            var objdata = areaObj.getHTMLDataObj();
            objdata.resetChangeFields();
        },
        // ************** Public methods **************** //
        mainGridSearch:function(secId, docView, url){
            try{
                if(searchhandler.criteriaEmpty()){
                    var errorInfo= new htmlErrors();
                    errorInfo.addError("warningInfo", "Please enter your search criteria.", false);
                    messagingDiv(errorInfo);
                    return;
                }
            }catch(e){}
            searchDocViewId = docView;
            var areaObj =_getAreaObjByDocView(docView);
            var objdata = areaObj.getHTMLDataObj();
            var objAjax = areaObj.getHTMLAjax();
            objdata.setAppendContainerData(true);

            try{
                // If this is not done the search apis will keep appending the
                // operator criteria section...
                srchStr = "";
                var crtSrchStr=search.getCriteriaSearchString();
            }catch(e){}

            bShowMsg = true;
            objAjax.setActionURL(url);

            // Search Operator or the value not entered
            if(crtSrchStr == false && insideCrteria){
                return false;
            }

            if(crtSrchStr.length > 0) objdata._mHasUserModifiedData=true;

            // No Operational Search
            if(crtSrchStr == false) {
                objAjax.setActionMethod("SEARCH");
            }else{
                var criterias=encodeURIComponent(crtSrchStr);
                objAjax.setActionMethod("SEARCH&criteria="+criterias);
             }

            objAjax.setProcessHandler(searchhandler.searchResp);
            objdata.performSaveChanges(searchhandler.searchResp,objAjax);
            gridhandler.init(docView, true);
            // If the user has indeed modified then collapse the Search section.
            if(objdata._mHasUserModifiedData){
                toggleCollapExpand(Collapimg_Id,collapSection_Search, imgDownArrow, imgRightArrow);
             }
        },
           keyPressed: function(e, obj){
            var key = (e.keyCode ? e.keyCode : e.which);

            if(key == 13){

            	if (obj)
           	 	{
            		obj.onchange();
           	 	}

                // Fire the default submit action on press on enter key.
                var searchButton = $('#_searchBtnbtnCtr');
                // searchButton is an JQuery object, call the click api which is nothing but obj.onclick()
                searchButton.click();
            }

            if (e && e.stopPropagation){ //if stopPropagation method supported
			    e.stopPropagation();
		    }else{
			    this.event.cancelBubble=true;
            }
        },
        clearCriteria: function(docView){
            var searchContainer = $('#_SearchSection');
            searchContainer.find("input").val('');
            searchContainer.find("select").find("option:first").attr('selected', 'selected');
            searchhandler.resetHTMLSearchData(docView);
            search.changeFields=new Array();
            search.clearSearchString();
            // Testing expand.....
            // gridhandler.expandSubGrids("_ImgCell_REQUEST_NO_D100_OWNER_TRADESTONE_0_items_section");
        }
    }

    // ******************************************************* //
            
    // ******************************************************* //
    // Public methods
    // ******************************************************* //
    /**
     * args - Key value pair
     * nextLevelRowObj - Identifies the hidden row from the current Grid where the subgrid data will be populated.
     * nextLevelContainer - The actual container (div) which will hold the next level subgrid data.
     * currCellObjId - Cell that holds the collapse/expand icon - Required to toggle the icons
     * level - The level where the Grid is being either expanded or collapsed.
     * index - Identify the row on the Grid RowSet.
     * parentCellObjId - Required to identify the immediate parent Grid to the current Grid.
     *
    **/
    function gridClick(args){
        var currCellObjId = args[CONSTANTS.CURRCELLOBJID];
        var currCellObj = $('#' + currCellObjId); //Convert to JQuery object
        var currImgObj = currCellObj.find('img');

        if(currImgObj[0].src.indexOf(CONSTANTS.COLLAPSEARROW) != -1){ // > Arrow
            expand(currCellObj, args);
        } else{
            collapse(currCellObj, args);
        }
    }

    function init(docViewId, skipCreateSearch){
        // This needs to be called everytime the main screen comes up. Basically resetting the cache.
        gridhandler.observer.init();
        // Instantiate the advancedSearch object as we require some of the methods on this.
        // instantiates global search object.....
        if(skipCreateSearch == "undefined" || !skipCreateSearch)
        {
            createSearchObject(docViewId);
        }
    }

    function registerSubjects(subjectsStr){
        var subjects = subjectsStr.split(",");

        for(var i = 0 ; i < subjects.length ; i++){
            var subject = getElemnt(subjects[i]);

            if(subject){
                initSubject(subject);
            }
        }
    }

    function retainUserState()
    {
        gridhandler.observer.reInitTemp();
        gridhandler.observer.setCurrLoopLevel(0);
        fireGridsExpanding(0);        
    }

    return {
        // Caches the expanded list of grids(Grid collapse Image Ids)...
        observer: new Observer(),
        gridClick: gridClick,
        init: init,
        //initSubject: initSubject,
        registerSubjects: registerSubjects,
        mainGridSearch: searchhandler.mainGridSearch,
        keyPressed: searchhandler.keyPressed,
        clearCriteria: searchhandler.clearCriteria,
        //fireGridsExpanding: fireGridsExpanding,
        retainUserState: retainUserState,
        CONSTANTS: CONSTANTS
    };
    // ******************************************************* //

})();

/******************************************************************/
/** Observer Pattern Implementation for remembering and retaining
    the states of Grids.
    Here we will have one Observer for multiple Subjects and not the
    regular way where there will be multiple Observers for one Subject
    Available at Global Namespace and not encapsulated inside gridhandler**/
/******************************************************************/

function Observer(){
    this.subjectList = [];
    this.expandedTempList = [];
    this.currLoopLevel = -1;

    // Public Inner class
    this.SubjectData = function(subjId, parentSubjId, currLevel){
        this.subjId = subjId;
        this.parentSubjId = parentSubjId; // Required to identify the parent and immediate child relationship
        this.currLevel = currLevel; // Required to identify the root level grids...
    }
};
Observer.prototype.init = function (){
    // reset the arraylist and make it empty;
    this.subjectList = null;
    this.subjectList = [];
    this.expandedTempList = null;
    // Remember the Grid that has been expanded Progamatically
    // temporary one and will be reset to empty once all the
    // grids that where in expanded state are expanded.
    this.expandedTempList = []; // Holds the ids of the expanded grid cell..
};

Observer.prototype.add = function(obj, parentId, currLevel){
    var subjectData = new this.SubjectData($(obj).attr("id"), parentId, currLevel);
    var currSubjIndex = this.indexOf(subjectData, 0);

    if(currSubjIndex > -1){
        return this.subjectList.get(currSubjIndex);
    }
    return this.subjectList.push(subjectData);
};

Observer.prototype.addToTemp = function (subjId){
    var currSubjIndex = this.indexOfTemp(subjId, 0);

    if(currSubjIndex > -1){
        return this.expandedTempList.get(currSubjIndex);
    }
    return this.expandedTempList.push(subjId);
};

Observer.prototype.count = function(){
  return this.subjectList.length;
};

Observer.prototype.tempCount = function(){
  return this.expandedTempList.length;
};

Observer.prototype.get = function( index ){
  if( index > -1 && index < this.subjectList.length ){
    return this.subjectList[ index ];
  }
};

Observer.prototype.getTemp = function( index ){
  if( index > -1 && index < this.expandedTempList.length ){
    return this.expandedTempList[ index ];
  }
};

Observer.prototype.indexOf = function( obj, startIndex ){
  var i = startIndex;
  while( i < this.subjectList.length ){
    if( this.subjectList[i].subjId == obj.subjId){
      return i;
    }
    i++;
  }
  return -1;
};

Observer.prototype.indexOfTemp = function( subjId, startIndex ){
  var i = startIndex;
  while( i < this.expandedTempList.length ){
    if( this.expandedTempList[i] == subjId){
      return i;
    }
    i++;
  }
  return -1;
};

Observer.prototype.removeAt = function( index ){
  this.subjectList.splice( index, 1 );
};

Observer.prototype.reInitTemp = function(){
    this.expandedTempList = null;
    this.expandedTempList = [];
    this.currLoopLevel = -1;
};

Observer.prototype.setCurrLoopLevel = function(level){
    this.currLoopLevel = level;
}

Observer.prototype.getCurrLoopLevel = function(){
    return this.currLoopLevel;
}

function Subject(){
  // Empty constructor...
}

Subject.prototype.addToObserver = function( subject, parentId, currLevel ){
  gridhandler.observer.add(subject, parentId, currLevel);
};

Subject.prototype.removeFromObserver = function( subject ){
    var subjsCount = gridhandler.observer.count();
    var currCellObjId = subject.attr("id");
    for(i = 0 ; i < subjsCount ; i++){
        var subjectData = gridhandler.observer.get(i);
        if(subjectData.parentSubjId == currCellObjId){
            var childGridId = subjectData.parentSubjId;
            var childObj = $("#" + childGridId);
            if(childObj){
               gridhandler.observer.removeAt( gridhandler.observer.indexOf(childObj, 0 ) );
            }
        }
    }

    gridhandler.observer.removeAt( gridhandler.observer.indexOf( subject, 0 ) );
};

Subject.prototype.notify = function( context, parentId, currLevel, addSubject ){
    if(addSubject){
        this.addToObserver(context, parentId, currLevel);
    } else{
        this.removeFromObserver(context);
    }
};

Subject.prototype.count = function(){
	return gridHandler.observer.count();
};

// Extend an object with an extension
function extend( extension, obj ){
  for ( var key in extension ){
    obj[key] = extension[key];
  }
};

/******************************************************************/