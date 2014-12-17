/*************************************/
/*  Copyright  (C)  2002 - 2009      */
/*           by                      */
/*  TradeStone Software, Inc.        */
/*  Gloucester, MA. 01930            */
/*  All Rights Reserved              */
/*  Printed in U.S.A.                */
/*  Confidential, Unpublished        */
/*  Property of                      */
/*  TradeStone Software, Inc.        */
/*************************************/


var adv_isNull='13';//isNull, isNotNull comfunc.js methods
var adv_isNotNull='14';
var numericType='2';
var integerType='4';
var varcharType='12';
var decimalType='3';
var dateType='91';
var timeStampType='93';
var szMsg_Invalid_Number    = 'Invalid Number format.';
var MsgOperValue="Please select an Operation option in order to complete your search.";
var MsgValue="Please enter Value in order to complete your search.";
var MsgForList="Please enter numeric values separated by a comma in the value field.";
var MsgBetween="Please enter two values separated by a comma in the value field.";
var Collapimg_Id="_SearchSection_collapImg";
var collapSection_Search="_SearchSection_divCollapsable";
var imgDownArrow="images/arrowdown.gif";
var imgRightArrow="images/Rarrow.gif";
var noSearch='NO_SEARCH';
var duplicateName='DUPLICATE_NAME';
var saved='SAVED';
var error='ERROR';
var nothing='NOTHING';
var dummyFrameSrchName='dummyIFrameSrchName';
var dummyFrameSrch='dummyIFrameSvdSrch';
var srchflds='adv_srch_flds_';
var srchVal='adv_srch_val_';
var srchOpr='adv_srch_opr_';
var colorsqr='_color_div_';
var nullId=13;
var notNullId=14;
var between=8;
var inlist=9;
var notinlist=10;
var rowno;
var savedSearchContentDiv;
var savedSearchMainDiv;
var colorSecConds=new Array();
var srchDocView;
var searchedFlds;
var searchedCustomFlds;
var searchedColrFlds; 
var criteriaChngFlds;
var oprs;
var values;
var oper;
var numoperators;
var charoperators;
var dateoperators;
var srchStr;
var insideCrteria;
var srchPopHgt;
var srchPopWdth;	
var srchNameDiv;
var eDiv;
var MAT_SRCH_VIEW_ID='3302';
var imgSrcPath;
var actionClass='';
var actionMethod='';
//Tracker# 12873- OPERATIONAL SEARCH CRITERIA DOES NOT DISPLAY IN A SAVED SEARCH
var _adsrch_ns='',_adsrch_cs='',_adsrch_ds='';
//Tracker 17354:-MATERIAL LIBRARY SEARCH FILTERS BASED ON MATERIAL TYPE
//New array added
var changeFields;
//Tracker#19202
var searchOnClickCallback;

function advancedSearch(docViewId)
{
    init(docViewId);
    this.numoperators=numoperators;
	this.charoperators=charoperators;
	this.dateoperators=dateoperators;
	this.changeFields=changeFields;
	this.getOperators=_getOperators;
	this.addOperators=_addOperators;
	this.addValues=_addValues;
	this.getSearchResults=_getSearchResults;
	this.getCriteriaSearchString=_getCriteriaSearchString;
	this.saveSearch=_saveSearch;
	this.cancelSearch=_cancelSearch;
	this.clearFields=_clearFields;
	this.clearSearchString=_clearSearchString;
	this.showSavedSrch=_showSavedSrch;
	this.showSrchSave=_showSrchSave;
	this.deleteSearch=_deleteSearch;
	this.getSearch=_getSearch;
	this.sort=_sort;
	this.setSearchedFields=_setSearchedFields;
	this.setNumOperators=_setNumOperators;
	this.setCharOperators=_setCharOperators;
	this.setDateOperators=_setDateOperators;
	this.isColorAdded=_isColorAdded;
	this.getColors=_getColors;
	this._setSearchDocViewId=_setSearchDocViewId;
	this.setElementsToColorSquareSection=_setElementsToColorSquareSection;
	this.setElementsToCustomSection=_setElementsToCustomSection;
	this.setElementsToSearchScreen=_setElementsToSearchScreen;
	this.setElementToCenter=_setElementToCenter;
	this.showSrchNameDiv=_showSrchNameDiv;
	this.hideSrchNameDiv=_hideSrchNameDiv;
	this.showSavedSrches=_showSavedSrches;
	this.setImageStorePath=_setImageStorePath;
	this.getSrch=null;
	//Tracker#19202
	//For search on color palette screen
	this.setSearchOnClickCallback=_setSearchOnClickCallback;
	this._handleColorLibSearch = _handleColorLibSearch;
	this.searchOnClickCallback = null;
	
	function init(docViewId)
	{
	 srchDocView=docViewId;
	 searchedFlds="";
	 searchedCustomFlds="";
	 searchedColrFlds=""; 
	 oprs=new Array();
	 values=new Array();
	 oper=new Array();
	 colorSecConds=new Array();
	 numoperators=new Array();
	 charoperators=new Array();
	 dateoperators=new Array();
	 criteriaChngFlds=new Array();
	 srchStr="";
	 insideCrteria=false;
	 savedSearchContentDiv='';
	 savedSearchMainDiv='';
	 //Tracker# 12873- OPERATIONAL SEARCH CRITERIA DOES NOT DISPLAY IN A SAVED SEARCH
	 //thumbnail path
	 imgSrcPath='imagestore/thumbnails/';
	 this.getSrch=null;	 
	 //Tracker#12873 -OPERATIONAL SEARCH CRITERIA DOES NOT DISPLAY IN A SAVED SEARCH
	 // Removing the seaved searches display div or Saved Searches save div on navigation to different screen if displayed.	 
	 _hideSrchNameDiv("_SRCH_NAME_DIV");	
	 _hideSrchNameDiv('savedSrchMainDiv');
	 changeFields=new Array();;
	}
	
	
	/**
	This function is used to get the operators for the selected field from the fields drop down.
	On change of drop down, value for the corresponding value text is set to nothing and the
	operators drop down set to first item. adv_srch_val_<rownum>, is the id for value text box and 
	adv_srch_opr_<rownum> is the id for operators drop down for the row, rownum.
	Here a global boolean variable,insideCrteria, is set to true to identify that the user has selected a search 
	criteria from criteria section. 
	*/
	function _getOperators(obj,rownum)
	{	
	    // Clearing the value field
	    if(values[rownum])
	    {
	    	values[rownum]="";
	    }
	    insideCrteria=true;
	    rowno= rownum;
	    var val=obj[obj.selectedIndex].value;
	    var valObj=document.getElementById(srchVal+rownum);
	    valObj.value="";
	    if(val=='-1')
	    {
	    	var oprObj=document.getElementById(srchOpr+rownum);
	    	oper=new Array();
	    	oprObj.selectedIndex=0;
	    	removeAllOptions(oprObj);
	    	values[rownum]="";
	    	criteriaChngFlds[rownum]="";
	    	insideCrteria=false;
	    	return false;
	    }
	    criteriaChngFlds[rownum]=val;
	    //if(oper[rowno]==val.substring(val.lastIndexOf(':')+1))
	    	//return false;
		var objAjax = new htmlAjax();
		if(objAjax)
	   	{
	       objAjax.setActionURL("advsearch.do");
	       objAjax.setActionMethod("AJAX_OPER&value="+val+"&rownum="+rowno);
	       objAjax.setProcessHandler(_handleSelRequest);
	       objAjax.sendRequest();
	    }
	    oper[rowno]=val.substring(val.lastIndexOf(':')+1);
	}
	/*
	The post process for getOperators function.
	This function populates the opeartors drop down with the values from the response 
	obtained after executing the ajax request for operators. 
	*/
	function _handleSelRequest(objAjax)
	{	
		var oprSel=document.getElementById("adv_srch_opr_div"+rowno);
		if(objAjax)
		{
			oprSel.innerHTML=objAjax.getHTMLResult();
		}
	}
	
	/*
	This function is used to set the selected value of the operators drop down to a global 
	array variable,oprs, with index as row number. If the operator is not null or not null is selected,
	then the value field is made disabled
	*/
	function _addOperators(obj,rownum)
	{	
	    var val=obj[obj.selectedIndex].value;
	    var valObj=document.getElementById(srchVal+rownum);
	    valObj.value="";
	    values[rownum]="";
	    if(val==nullId || val==notNullId)
	    {
	    	valObj.disabled=true;    	
	    }
	    else
	    {
	    	valObj.disabled=false;
	    }
	    oprs[rownum]=val;
	}
	/*
	This function is used to set the value of the value text box to a global 
	array variable,values, with index as row number
	*/
	function _addValues(obj,rownum)
	{	
	    obj.value=obj.value.toUpperCase();
	    var val=obj.value;
	    values[rownum]=val;
	}
	/**
	This function is used to get the search string from the criteria section.
	The search string will be a tilde,~, separated string for search criteria entered for each row.
	For eg, 2900:2:19:0:4,0,1~ can be the search string returned.
	2900 represents docid,2 is layout section id,19 is the field id,4 is data type id.
	In the above sample string 0 is the operator id and 1 the value. 
	*/
	function _getCriteriaSearchString()
	{
		var origDateVal="";		
		for(i=0;i<criteriaChngFlds.length;i++)
		{
			var betInVal="";		
			if(criteriaChngFlds[i])
			{
				if(oprs[i])
				{
					var oprobj=document.getElementById(srchOpr+i);
					if(oprobj.selectedIndex==0)
					{
						//alert(MsgOperValue+(i+1));
						var htmlErrors = new htmlAjax().error();
	            		htmlErrors.addError("errorInfo", MsgOperValue,  true);
	            		messagingDiv(htmlErrors);
						return false;
					}
					
					if(values[i])
					{
						var type=getDataType(criteriaChngFlds[i]);
						var obj=document.getElementById(srchVal+i);
						origDateVal=values[i];
						if(oprobj.value==inlist || oprobj.value==notinlist)
						{
							var val=values[i];
							var valsplit=val.split(',');
							if(type==numericType || type==dateType || type==decimalType||type==timeStampType||type==integerType)
							{
								if(valsplit.length ==0)
								{
									//alert(MsgForList);
									var htmlErrors = new htmlAjax().error();
	           						htmlErrors.addError("errorInfo", MsgForList,  true);
	           						messagingDiv(htmlErrors);
									var valobj=getElemnt(srchVal+i);
									valobj.value="";
									valobj.focus();
									return false;
								}
							}
							for(var j=0;j<valsplit.length;j++)
							{
								betInVal+=valsplit[j]+'@';								
							}
							
						}
						else if(type==numericType && oprobj.value==between 
						|| type==dateType && oprobj.value==between
						|| type==decimalType && oprobj.value==between
						|| type==timeStampType && oprobj.value==between
						|| type==integerType && oprobj.value==between)
						{
							
							var val=values[i];
							origDateVal=val;
							var valsplit=val.split(',');
							if(valsplit.length != 2)
							{
								//alert(MsgBetween);
								var htmlErrors = new htmlAjax().error();
	           					htmlErrors.addError("errorInfo", MsgBetween,  true);
	           					messagingDiv(htmlErrors);
								//return false;
								var valobj=getElemnt(srchVal+i);
								valobj.value="";
								valobj.focus();
								return false;
							}else
							{
								for(var j=0;j<valsplit.length;j++)
								{
									betInVal+=valsplit[j]+'@';								
								}
							}						
						}
						
						if(oprobj.value==between || oprobj.value==inlist || oprobj.value==notinlist)
						{
							//Tracker#:20174 - WHEN SEARHING ON A FIELD USING & IN THE VALUE RECEIVE AN ERROR
							//Encoded the search string 
							srchStr+=criteriaChngFlds[i]+","+oprs[i]+","+encodeURIComponent(betInVal)+"~";
						}else 
						{
							//Tracker#:20174 - WHEN SEARHING ON A FIELD USING & IN THE VALUE RECEIVE AN ERROR
							//Encoded the search string
							srchStr+=criteriaChngFlds[i]+","+oprs[i]+","+encodeURIComponent(values[i])+"~";
						}
						if(type==dateType || type==timeStampType)
						{
							obj.value=origDateVal;
						}
					}else
					{
					    if((oprs[i]==adv_isNull || oprs[i]==adv_isNotNull))
					    {
					    	srchStr+=criteriaChngFlds[i]+","+oprs[i]+"~";					    	
					    	//return srchStr;
					    }else
					    {
							//alert(MsgValue+(i+1));
							var htmlErrors = new htmlAjax().error();
	           				htmlErrors.addError("errorInfo", MsgValue,  true);
	           				messagingDiv(htmlErrors);
							return false;
						}	
					}
				}else
				{
					//alert(MsgOperValue+(i+1));
					var htmlErrors = new htmlAjax().error();
	           		htmlErrors.addError("errorInfo", MsgOperValue,  true);
	           		messagingDiv(htmlErrors);
					return false;
				}
			}	
		}
		return srchStr;
	}
		
	/**
	This function is used to fetch the search results based on the search criteria.
	The function,_getAreaObjByDocView, is used to get the <DIV> for the search section.
	The advanced search section <DIV> is identified by the doc view id. So srchDocView, which is
	the doc view id fro advanced search section, is passed to fetch the search section element. 
	*/
	function _getSearchResults(sec,docViewId)
	{
		//alert(docViewId);
		this._setSearchDocViewId(docViewId);
		sectionName = sec;
		srchStr="";
		var areaObj =_getAreaObjByDocView(docViewId);
		//alert(colorSecConds);
		var crtSrchStr=this.getCriteriaSearchString();
		
		if(crtSrchStr==false && insideCrteria && (colorSecConds==null || colorSecConds.length<1))
		{
			return false;
		}
		
		if(areaObj)
		{
			var objdata = areaObj.getHTMLDataObj();
			//Tracker#:11326 - SEARCHING AFTER USING CLEAR FIELDS SHOULD RETURN ALL RECORDS
			//If no changes done to the fields, display the message.
			if(!objdata._mHasUserModifiedData && !insideCrteria && (colorSecConds==null || colorSecConds.length<1))
			{
				var objAjax = new htmlAjax();
				var htmlErrors = objAjax.error();
        		objAjax.error().addError("warningInfo", "Please enter your search criteria.", false);
        		messagingDiv(htmlErrors);
        		return;
			}
			//Tracker#:21227 - SPECIFIC SEARCH: ISSUES WITH REMOVING THE SEARCH FILTERS
			//If there are no values in the text boxes,select dropdowns or the color squares then display message
			if (allEmpty() && (colorSecConds==null || colorSecConds.length<1))
			{
				var objAjax = new htmlAjax();
				var htmlErrors = objAjax.error();
        		objAjax.error().addError("warningInfo", "Please enter your search criteria.", false);
        		messagingDiv(htmlErrors);
        		return;
			}
			//Tracker 17354:-MATERIAL LIBRARY SEARCH FILTERS BASED ON MATERIAL TYPE
			//If there's element in the change fields array then assigning it to search object's changeFields.
			// So that this can be used later even if the page is reloaded and the change fields reset.   
			
			setDataToChangeFields(this,objdata);
			
			if(crtSrchStr.length>0 || colorSecConds.length>0)
				objdata._mHasUserModifiedData=true;
			var objAjax = new htmlAjax();
			var dragdropConds=_getColors(colorSecConds);
			//Tracker# 15791 - REL2010 (DB2) - ISSUES WITH TECH SPEC SEARCH AND RECENTLY VIEWED LINK  
			var criterias=encodeURIComponent(crtSrchStr);			
			//alert(objdata._mHasUserModifiedData);
			
			if(objAjax)
		    {
		        objAjax.setDocViewId(docViewId);
		        objAjax.setActionURL("advsearch.do");
		        //Tracker# 15791 - REL2010 (DB2) - ISSUES WITH TECH SPEC SEARCH AND RECENTLY VIEWED LINK
		        objAjax.setActionMethod("view&docViewId="+docViewId+"&criteria="+criterias+"&dragndrop="+dragdropConds);
		        objAjax.setProcessHandler(this._handleColorLibSearch);
		        //Tracker#19202
		        //set searchonclick attribute to objAjax.
		        objAjax.attribute().setAttribute("searchonclick", this.searchOnClickCallback);
		    }
		    if(objdata)
			{
			    //alert("chg fields \n "+ objdata.getChangeFields());
			    //Tracker#:14459 REGRESSION ISSUE WITH ADVANCED SEARCH - RESULTS ARE NOT RETURNED FOR SOME OF THE FIELDS WHEN THEY SH
		    	//Tracker#:21697 - COLOR PALLETE SEARCH FOR ACTIVE YES/NO GETS STUCK ON SELECTION
		    	// This will set the conatiner name('_SearchSection') to data object and only those controls inside this conatiner will be added 
		    	// to post request. If this is not given it was trying to add all controls inside '_divWorkArea' to the request. 
		    	// In the case of color palette if we search with Active_ind field first time it was giving proper result. 
		    	// The result list displayed in the list screen has the active ind field[hidden field related to validation] with same id 
		    	// as that of active_ind field in search section. As a result while adding the control id to request it was not accepting the 
		    	// newly changed value.  By Setting the container name explicitly, only the controls inside it will used to add as changed fields to the request
				// and this issue is handled.
		    	objdata._mDivContainerName ='_SearchSection';
		    	objdata.setAppendContainerData(true);
		    	objdata.performSaveChanges(this._handleColorLibSearch, objAjax);
			}
		}
	}
	//Tracker#:21227 - SPECIFIC SEARCH: ISSUES WITH REMOVING THE SEARCH FILTERS
	// Checking for all the text boxes and select boxes for values
	function allEmpty()
	{
		var $all = $("#_SearchSection input:text");
        var $emptyTxt = $all.filter('[value=""]');
        
        var $allSel = $("#_SearchSection select");
        var selLen = $allSel.length;
        for (i=0; i < selLen; i++)
        {
        	if ($allSel[i].selectedIndex > 0)
        	{
        		return false;
        	}
        }
        if ($emptyTxt.length == 0) {
        	return true;            
        } else if ($all.length == $emptyTxt.length) {            
        	return true;
        } else {
        	return false;
        }

	}
	
	/**
	The post process for getSearchResults function.
	This function passes the response from the search result in the 
	ajax object, objAjax, to the  _showColorLibPage function, where it 
	picks up the reposnse and display the result to the colorlib search result section.
	After displaying the search result, the advanced search section is collapsed.
	*/
	//Tracker#: 15424 THE DROPDOWN ARE BLEEDING THROUGH THE WARNING/ERROR AND SUCCESS MSG WINDOW
	//Changing the order of execution of displaying the message so that the message comes after 
	//the data table is printed. 
	function _handleColorLibSearch(objAjax)
	{
		//Tracker#19202
		//to execute search handler for search on Color palette screen.
		var svdSrchCall = objAjax.getResponseHeader("_svdSrchCall")
		if(svdSrchCall!=null && svdSrchCall.length>0)
		{
			sectionName = '_divWorkArea';
			_showColorLibPage(objAjax);
			//Tracker#2033
			//To set searchdflds and searchedcustomflds
			eval(svdSrchCall);
			//To set values to respective fields on advanced search screen
			//based on searchdflds and searchedcustomflds
			if(searchedFlds){
				//alert("_handleGetSearch: inside if");
				_setElementsToSearchScreen(searchedFlds);
			}
			if(searchedCustomFlds && searchedCustomFlds!=nothing){
				_setElementsToCustomSection(searchedCustomFlds);
				//Tracker#19951
				//Getting error when performing search on clearing value
				//field in operational search.
				insideCrteria=true;
			}
			if(searchedColrFlds && searchedColrFlds!=nothing){
				_setElementsToColorSquareSection(searchedColrFlds);
			}
			//Advanced search screen should collapse after search
			toggleCollapExpand(Collapimg_Id,collapSection_Search, imgDownArrow, imgRightArrow);
		}
		else
		{
			_showColorLibPage(objAjax);
		}
		//Tracker#:- 20634  specific search: display search criteria after collapsing the search section & display search result
		//If this function is called from specific search screen then display the criteria on the screen by calling the showCriteria
		var sp = objAjax.getResponseHeader("sp_srch_req");
		if ("Y" == sp)
		{
			//Specific Search screen specific function added in globalgearch.js.
			showCriteria(objAjax);
		}
		
		//This method in colorlib.js
		var reslt=objAjax.getScriptResult();	
			
		srchStr="";
		var err=objAjax.error().getErrorMsg();
		if(err==null)
		{
			toggleCollapExpand(Collapimg_Id,collapSection_Search, imgDownArrow, imgRightArrow);
		}
		//The calling is messaging div is delayed so that the message is displayed after the 
		//data table is displayed.
		objMsgDiv = new messagingDiv(objAjax.error());
		refreshNavigationGrid(objAjax);
	}
	
	//Tracker#19202
	//For Search on Color palette screen
	function _setSearchOnClickCallback(callbackHandler)
	{
		//alert('callbackHandler--'+callbackHandler);
		this.searchOnClickCallback = callbackHandler;
	}
	

	/*
	This function is used to save the search with the name entered. 
	*/
	function _saveSearch(docViewId,txtName,div)
	{
		    var searchName=getElemnt(txtName);
		    var val=searchName.value;
		    if(trim(val).length==0)
		    	return false;
		    var objAjax = new htmlAjax();
			if(objAjax)
		    {
		        objAjax.setActionURL("advsearch.do");
		        objAjax.setActionMethod("SAVE_SEARCH&docViewId="+docViewId+"&searchName="+val);
		        objAjax.setProcessHandler(_handleSaveSearch);
		        objAjax.sendRequest();
		    }
	}
	/*
	The post process for saveSearch function.
	This function displays an alert whether the search save is successful or not.
	*/
	function _handleSaveSearch(objAjax)
	{
		var reslt=objAjax.getScriptResult();
		objMsgDiv = new messagingDiv(objAjax.error());
		if(reslt!=duplicateName)
		{
			_hideSrchNameDiv("_SRCH_NAME_DIV");	
		}
	}
	
	/*
	This is a generic function to trim the string
	*/
	function trim(stringToTrim) 
	{
		return stringToTrim.replace(/^\s+|\s+$/g,"");
	}
	/*
	This function is used to clear the search values and collapse the advanced search section
	*/
	function _cancelSearch(docViewId)
	{
		toggleCollapExpand(Collapimg_Id,collapSection_Search, imgDownArrow, imgRightArrow);
		this.clearFields(docViewId);
	}
	/*
	This function is used to clear all the components involved in search.
	_mHasUserModifiedData property of the objdata is set to false so that search is disabled
	*/
	function _clearFields(docViewId)
	{
		var objArea = _getAreaObjByDocView(docViewId);
		//var objdata = objArea.getHTMLDataObj();
		//objdata._mHasUserModifiedData=false;
		this.clearSearchString();	
		crtSrchStr=false;
		if(objArea)
	    {
	        sectionName = objArea.getDivSectionId();
	        var containedDiv = document.getElementById(sectionName);		
			var elms=containedDiv.getElementsByTagName("*");
	        var objHTMLData = objArea.getHTMLDataObj();
	     	    
			for(var i = 0;  i < elms.length; i++) 
			{
		        var elm = elms[i];
		        switch(elm.type) 
		        {
		          case "text":
		          {
		          	elm.value="";
		          	break;
		          }
		          case "select-one":
		          {
		        	  	elm.selectedIndex=0;		        	  	
		         		if(elm.name.substring(0,13)==srchOpr)
		         		{
		         			removeAllOptions(elm);
		         			oper='';
		         		}
		         		break;
		          }
		          case "textarea":
		          {
		          	elm.value="";
		          	break;
		          }
		        }
		    }
		    //Tracker#17354 : -MATERIAL LIBRARY SEARCH FILTERS BASED ON MATERIAL TYPE
		    //Changed fields reset done at the end  so as to avoid change fields getting set while clearing the fields 
		    //especially the select drop down.
		    if(objHTMLData)
	     	{
	     		objHTMLData.resetChangeFields();
	     		objHTMLData._mHasUserModifiedData=false;
	     	}	
		    var colrSec=getElemnt('color_section_div');
		    if(colrSec)
		    {
		    	var elms=colrSec.getElementsByTagName("DIV");
		    	for(var i = 0;  i < elms.length; i++) 
				{
					elms[i].style.background='';
				}
		    }
	    }
	    colorSecConds=new Array();
	    this.changeFields=new Array();
	
	}
	/*
	This function is used to clear the search string entered.
	All the varibales used for the search made to initial status
	*/
	function _clearSearchString(){
		criteriaChngFlds=new Array();
	 	oprs=new Array();
	 	values=new Array(); 	  
		srchStr="";
		insideCrteria=false;
		oper=new Array();
		colorSecConds=new Array();
	}
	
	/*
	This function is used to display the Save search name entry popup <DIV>
	*/
	function _showSrchNameDiv(divId,txt)
	{
	    srchRsltStr="";
	    srchNameDiv=divId;
	    var elem=getElemnt(divId);
	    var searchName=getElemnt(txt);
	    if(searchName)
	    {
	    	searchName.value="";
	    }
	    if(getElemnt(savedSearchMainDiv))
	    {
	    	_hideSrchNameDiv(savedSearchMainDiv);
	    }
	    _setElementToCenter(elem);
	    var frm = getElemnt(dummyFrameSrchName);
		_setElementToCenter(frm);
		var srchsdiv=getElemnt('srchnameDiv');
		if(srchsdiv)
		{
			document.body.removeChild(srchsdiv);
		}
		eDiv=document.createElement("DIV");
		document.body.appendChild(eDiv);
		eDiv.id='srchnameDiv';
		eDiv.appendChild(elem);
		eDiv.appendChild(frm);
		//this.setElementToCenter(eDiv);
		eDiv.style.top="100px";
	   	eDiv.style.left="200px";
	   	eDiv.style.visibility="visible";
	   	eDiv.style.position="absolute";
	    eDiv.style.display = "block";
		RegisterDragOnly(eDiv);
		
		
	}
	/**
	This function is used to display the saved searches popup.
	A blank dummy iframe is also displayed as a solution for displaying
	<DIV> over <select> drop down.
	*/
	function _showSavedSrches(mainDiv)
	{
		//alert(mainDiv);
		if(getElemnt(srchNameDiv)){
	    	_hideSrchNameDiv(srchNameDiv);
	    }
		var elem=getElemnt(mainDiv);
		//alert(elem);
		savedSrchCenter(elem);
		var frm = getElemnt(dummyFrameSrch);
		//alert(frm);
		savedSrchCenter(frm);
		
		var srchsdiv=getElemnt('srchesDiv');
		if(srchsdiv)
		{
			document.body.removeChild(srchsdiv);
		}
		eDiv=document.createElement("DIV");
		document.body.appendChild(eDiv);
		eDiv.id='srchesDiv';
		eDiv.appendChild(elem);
		eDiv.appendChild(frm);
		//this.setElementToCenter(eDiv);
		eDiv.style.top="0px";
	   	eDiv.style.left="0px";
	   	eDiv.style.visibility="visible";
	   	eDiv.style.position="absolute";
	    eDiv.style.display = "block";
		RegisterDragOnly(eDiv);
	}
	
	function savedSrchCenter(elem)
	{
		
	   	var top=(screen.height/2)-(105);
	   	var left=(screen.width/2)-(100);
	   	
	   	elem.style.top=top+"px";
	   	elem.style.left=left+"px";
	   	elem.style.visibility="visible";
	   	elem.style.position="absolute";
	    elem.style.display = "block";
	}
	/*
	This function is used to display the element,<DIV>, at the center of the screen.
	srchPopHgt and srchPopWdth are declared as global variables. offsetHeight and offsetWidth 
	values of the elements are becoming 0 when the element is displayed second time , 
	so first time itself assgning it to global variables.   
	*/
	function _setElementToCenter(elem)
	{
	   	if(!srchPopHgt)
	   	{
	   		srchPopHgt=elem.offsetHeight;
	   	}
	   	if(!srchPopWdth)
	   	{
	   		srchPopWdth=elem.offsetWidth;
	   	}
	   	   	
	   	var top=(screen.height/2)-(175);
	   	var left=(screen.width/2)-(200);
	   	
	   	elem.style.top=top+"px";
	   	elem.style.left=left+"px";
	   	elem.style.visibility="visible";
	   	elem.style.position="absolute";
	    elem.style.display = "block";
	}
	/**
	This function used to hide the search name entry <DIV>.
	This acts as a common function to hide the popped up <DIV>s. 
	Here,hideIFrame function is used to hide the dummy iframe along 
	with hiding the <DIV> 
	*/    
	function _hideSrchNameDiv(divId,txtName)
	{
	    
	    var elem=getElemnt(divId);
	    var searchName=getElemnt(txtName);
	    if(searchName)
	    {
	    	searchName.value="";
	    }
	    var rsltDiv=getElemnt("RESLT_DIV");
	    if(rsltDiv)
	    {
	    	rsltDiv.innerHTML="";
	    }
	    
	    hideIFrame(dummyFrameSrch);
	    hideIFrame(dummyFrameSrchName);
	    if(eDiv)
	    {
	    	eDiv.style.visibility="hidden";
	    	eDiv.style.display = "none";
	    	//Tracker#12873 -OPERATIONAL SEARCH CRITERIA DOES NOT DISPLAY IN A SAVED SEARCH
	    	//Avoiding the removal of the div hide. When the div is removed from the document on close then it was displaying error
	    	// when clicked for display again.   
	    	//document.body.removeChild(eDiv);
	    }
	    //elem.style.visibility="hidden";
	    //elem.style.display = "none";   
	}
	/*
	This function used to get the saved searches list.
	*/
	function _showSavedSrch(mainDiv,contentDiv,docViewId)
	{
		savedSearchContentDiv=contentDiv;
		savedSearchMainDiv=mainDiv;
		var mDiv=getElemnt(savedSearchMainDiv);
		//Tracker # 11612:ERROR MESSAGE DISPLAY ON BLANK COLOR LIBRARY RECORD.
		//Checking whether the div is already available, if available that means the save search not clicked for the first time. 
		var objAjax = new htmlAjax();
		if(mDiv)
		{
			this.showSavedSrches(mainDiv);			
			if(objAjax)
		    {
		        objAjax.setActionURL("advsearch.do");
		        objAjax.setActionMethod("SHOW_SEARCH&docViewId="+docViewId);
		        objAjax.setProcessHandler(_handleShowSearch);
		        objAjax.sendRequest();
		    }
		}
		else // Reaches here if the div is not created. When user clicks the Saved searches button from New Overview screens.
		{
			if(objAjax)
		    {
		        objAjax.setActionURL("advsearch.do");
		        objAjax.setActionMethod("SHOW_SEARCH&docViewId="+docViewId+"&firstTime=Y");
		        objAjax.setProcessHandler(_handleShowSearchForFirst);
		        objAjax.sendRequest();
		    }
		}
	}
	
	//Tracker # 11612:ERROR MESSAGE DISPLAY ON BLANK COLOR LIBRARY RECORD.
	//This function will be invoked as a post process function if the user clicks the Saved searches button from New Overview screens.
	function _handleShowSearchForFirst(objAjax)
	{
		//alert('here');
		var div=document.createElement("div");
		document.body.appendChild(div);
		//Calling the function to register the content
		registerHTML(div,objAjax);
		//This function will display the required Divs which has the Saved searches information.
		//Hard coded as this is never going to change.
		_showSavedSrches('savedSrchMainDiv');
		if(objAjax.error().hasErrorOccured() || objAjax.error().hasWarningOccured() ) 
		{
			objMsgDiv = new messagingDiv(objAjax.error());
		}		
	}	
	
	
	/*
	This function used to get the saved searches list.
	*/
	function _showSrchSave(docViewId)
	{
		var objAjax = new htmlAjax();
		if(objAjax)
	    {
	        objAjax.setActionURL("advsearch.do");
	        objAjax.setActionMethod("SHOW_SEARCH_SAVE&docViewId="+docViewId);
	        objAjax.setProcessHandler(_handleSrchSave);
	        objAjax.sendRequest();
	    }
	}
	
	function _handleSrchSave(objAjax)
	{
		var contObj=getElemnt("SVD_SRCHS");
		contObj.innerHTML=objAjax.getHTMLResult();
		_showSrchNameDiv('_SRCH_NAME_DIV','_SRCH_TEXT');
		objMsgDiv = new messagingDiv(objAjax.error());
		eval(objAjax.getScriptResult());
	}
	
	/**
	The post process for showSavedSrch function.
	This function displays the saved searches available. 
	savedSearchContentDiv, is the id for the <DIV> which holds the 
	search list
	*/
	function _handleShowSearch(objAjax)
	{
		var contObj=getElemnt(savedSearchContentDiv);
		contObj.innerHTML=objAjax.getHTMLResult();		
		objMsgDiv = new messagingDiv(objAjax.error());
		eval(objAjax.getScriptResult());
	}
	/*
	This function is used to hide the dummy iframe on the screen.
	Iframe is used as a solution for displaying <DIV> on top of <select> drop down 
	*/
	function hideIFrame(frmid)
	{
		var frm = getElemnt(frmid);
		if(frm)
		{
			frm.style.display = "none";
		}	
	}
	/**
	This function is used to delete the selected saved searches.
	*/
	function _deleteSearch(divId,docViewId)
	{
		savedSearchContentDiv=divId;
		var searchIds="";
		var obj= getElemnt(divId);
		var elems=obj.getElementsByTagName("input");
		var entry=false;
		for(i=0;i<elems.length;i++)
		{
			if(elems[i].type=='checkbox')
			{
				if(elems[i].checked)
				{
					searchIds=searchIds+elems[i].value+",";
					entry=true;
				}
			}
		}
		if(entry==false)
			return false;
		var objAjax = new htmlAjax();
		if(objAjax)
	    {
	        objAjax.setActionURL("advsearch.do");
	        objAjax.setActionMethod("DEL_SEARCH&searchIds="+searchIds+"&docViewId="+docViewId);
	        objAjax.setProcessHandler(_handleShowSearch);
	        objAjax.sendRequest();
	    }
	}
	/*
	This function used to get the search result when the user clicks on the 
	saved search name link on the popup
	*/
	function _getSearch(sec,searchId,docId,docViewId)
	{
		//alert(docId);
		//alert(docViewId);
		//alert(sec);
		var objArea = _getAreaObjByDocView(docViewId);
		//Tracker#20033
		//Added new parameter searchOnClickCallback
		getSrch=new ObjGetSrch(docViewId,docId,searchId,sec,this.searchOnClickCallback);
		//alert(objArea);
		if(!objArea)
		{
			//var action=getAction(docId);
			//var actionMethod=getActionMethod(docId);
			//alert(actionClass+"_"+actionMethod);
			waitWindow();
			this._setSearchDocViewId(docViewId);
			loadWorkArea(actionClass,actionMethod+'&oviewsvdsrch=YES','',processMe);
			closeWaitWindow();
		}else
		{
			this._setSearchDocViewId(docViewId);
			sectionName = sec;
			var objAjax = new htmlAjax();
			if(objAjax)
		    {
		        objAjax.setActionURL("advsearch.do");
		        //alert("GET_SEARCH&searchId="+searchId+"&docId="+docId+"&docViewId="+docViewId);
		        objAjax.setActionMethod("GET_SEARCH&searchId="+searchId+"&docId="+docId+"&docViewId="+docViewId);
		        objAjax.setProcessHandler(_handleGetSearch);
		        objAjax.sendRequest();
		    }
	    }
	}
	
	//This object is used for get saved searches. 
	//Tracker#20033 added callback variable
	function ObjGetSrch(vId,dId,sId,sec,callback)
	{
		var docViewId,docId,searchId,callback;
		this.docViewId=vId;
		this.docId=dId;
		this.searchId=sId;
		this.sec=sec;
		this.callback=callback;
	}
	
	
	function processMe(obj)
	{
		if(getSrch)
		{
			searchId=getSrch.searchId;
			docId=getSrch.docId;
			docViewId=getSrch.docViewId;
			sec=getSrch.sec;
			//Tracker#20033 get get call back handler function name.
			callback = getSrch.callback;
		}
		_showWorkArea(obj);
		sectionName = sec;
		if(obj)
	    {
	    	obj.setActionURL("advsearch.do");
	        obj.setActionMethod("GET_SEARCH&searchId="+searchId+"&docId="+docId+"&docViewId="+docViewId);
	        obj.setProcessHandler(_handleGetSearch);
	        obj.sendRequest();
	    }
	} 
	/*
	The post process for getSearch function.
	objAjax will have the search result which is passed to function,_showColorLibPage, to display 
	in the searchlist section. setElementsToSearchScreen function is called to set element values
	on the search screen. toggleCollapExpand, to collapse the adv. search section.  
	hideSrchNameDiv, to hide the Saved searches popup.  
	*/
	function _handleGetSearch(objAjax) 
	{
		var reslt=objAjax.getScriptResult();
		if(reslt==error){
			//alert(objAjax.getHTMLResult());
			_hideSrchNameDiv(savedSearchMainDiv);
			return false;
		}
		//Tracker #12530:MESSAGE FOR SAVED SEARCHES WITH NO RECORDS
		
		if(objAjax.error().getWarningMsg()!=null)
		{
			//Tracker# 15333 PLM ADVANCED SEARCH BRINGS BACK TOO MANY RECORDS AND FAILS
			// Added proper warning message			
			var objMsgDiv = new messagingDiv(objAjax.error());
		}
		//Tracker#20033
		//Get function to set search fields values on Advanced search screen
		var svdSrchCall = objAjax.getResponseHeader("_svdSrchCall")
		if(svdSrchCall!=null && svdSrchCall.length>0)
		{
			sectionName = '_divWorkArea';
			_showColorLibPage(objAjax);
			eval(svdSrchCall);
		}
		else
		{
			_showColorLibPage(objAjax);
		}
		srchStr="";
		var objCollap = getElemnt(Collapimg_Id);
		var objCont = getElemnt(collapSection_Search);
		//alert('objCont:'+objCont);
		clearFields(srchDocView+"");
		//alert("_handleGetSearch:"+srchDocView);
		//alert("_handleGetSearch-searchedFlds:"+searchedFlds);
		
		if(searchedFlds){
			//alert("_handleGetSearch: inside if");
			_setElementsToSearchScreen(searchedFlds);
		}
		if(searchedCustomFlds && searchedCustomFlds!=nothing){
			_setElementsToCustomSection(searchedCustomFlds);
		}
		if(searchedColrFlds && searchedColrFlds!=nothing){
			_setElementsToColorSquareSection(searchedColrFlds);
		}
		
		if(objCont && objCont.style.visibility.length==0 || objCont &&  objCont.style.visibility=="visible")
			toggleCollapExpand(Collapimg_Id,collapSection_Search, imgDownArrow, imgRightArrow);
		hideSrchNameDiv(savedSearchMainDiv);
		objAjax.setDocViewId(srchDocView);
		refreshNavigationGrid(objAjax);		
		//Tracker#:20884 - specific search :allow the user to configure additional tabs for advanced search screens
		//To remove the existing criteria displayed.
		emptySpCrt();
	}
	/*
	This function used to sort the saved searches which is displayed as a popup  
	*/
	function _sort(sortby,docViewId,ascDesc)
	{
		var objAjax = new htmlAjax();
		if(objAjax)
	    {
	        objAjax.setActionURL("advsearch.do");
	        objAjax.setActionMethod("SORT&sortBy="+sortby+"&docViewId="+docViewId+"&ascDesc="+ascDesc);
	        objAjax.setProcessHandler(_handleSortSearch);
	        objAjax.sendRequest();       
	    }
	}
	/*
	The post process for sort function 
	*/
	function _handleSortSearch(objAjax)
	{
		var contObj=getElemnt(savedSearchContentDiv);
		contObj.innerHTML=objAjax.getHTMLResult();
		
	}
	/*
	 This function assigns concatenated field-value string to the global variables,searchedFlds
	 and searchedCustomFlds. 
	 Parameter values to this function set from ColorLibAction
	*/ 
	function _setSearchedFields(flds,cFlds,colrFlds)
	{
		//alert("_setSearchedFields:"+flds);
		searchedFlds=flds;
		searchedCustomFlds=cFlds;
		searchedColrFlds=colrFlds;
	}
	/*
	The fucntion used to set the doc view id for the search 
	*/
	function _setSearchDocViewId(docView)
	{
		srchDocView=docView;
	}
	/*
	This function parse the search fields obatined from the response for the saved search retrieval request.
	The search fields will a comma separated string like, for eg. 3=192,4=100,. Here 3 represents the field
	id and 192, the value for that field. The parsed value will be assigned to the corresponding field on the screen. 
	*/
	function _setElementsToSearchScreen(searchedFlds)
	{
		//alert("_setElementsToSearchScreen");
		//alert("_setElementsToSearchScreen:"+searchedFlds);
		//alert("_setElementsToSearchScreen:srchDocView:"+srchDocView);		
		var areaObj =_getAreaObjByDocView(srchDocView);
		sectionName = areaObj.getDivSectionId();
		var containedDiv = document.getElementById(sectionName);
		//alert(searchedFlds);
		//Tracker# 21210 SPECIFIC SEARCH: USE OF COMMA
		//Delimiter changed from comma
	    var split1=searchedFlds.split('~@');
	    //alert(split1);
		var str;
		var split2;
		var fldval;
		var fld;
		var val;
		var docid;
		var lvlid;
		//alert(searchedFlds);		
		for(i=0;i<(split1.length-1);i++)
		{
			str=split1[i];
			//alert(str);
			split2=str.split('=');
			//alert(split2);
			fld=split2[0];
			var fldvalsplit=fld.split(':');
			docid=fldvalsplit[0];
			fldval=fldvalsplit[1];
			//Tracker# 21224 SPECIFIC SEARCH: SOURCING DOCS-LAST SEARCH FILTERS ARE LOST WHEN GOING BACK TO SEARCH SCREEN
        	//Added level Id 
			lvlid=fldvalsplit[2];
			//alert(lvlid);
			val=split2[1];
			var elms=containedDiv.getElementsByTagName("*");
	        var fldid;
		    var splt;
		    var flddocid;
		    var fldlvlid;
		    for(var j = 0;  j < elms.length; j++) 
			{
		        var elm = elms[j];
		        splt=elm.id.split(_FIELDS_SEPERATOR);
		        flddocid=splt[1];
			    fldid=splt[2];
			    fldlvlid=splt[3];
		        switch(elm.type) 
		        {
			        case "text":
			        {
			        	//Tracker# 21224 SPECIFIC SEARCH: SOURCING DOCS-LAST SEARCH FILTERS ARE LOST WHEN GOING BACK TO SEARCH SCREEN
                    	//Added level Id 
			        	if(fldval==fldid && flddocid==docid&&lvlid==fldlvlid)
			        	{
			          		elm.value=val;
			          		if(elm.onchange)
			          		{
			          			elm.onchange();
			          		}			          		
			          	}
			          	break;
			        }
			        case "select-one":
			        {
			        	//Tracker# 21224 SPECIFIC SEARCH: SOURCING DOCS-LAST SEARCH FILTERS ARE LOST WHEN GOING BACK TO SEARCH SCREEN
                    	//Added level Id 
			        	if(fldval==fldid && flddocid==docid&&lvlid==fldlvlid)
			          	{
			          		for(k=0;k<elm.options.length;k++)
			          		{
			          			//Tracker# 12873- OPERATIONAL SEARCH CRITERIA DOES NOT DISPLAY IN A SAVED SEARCH
			          			//Identifying the selected option
			          			if(elm[k].text==val)
			          			{
			          				elm[k].selected=true;
			          			}
			          		}
			          		if(elm.onchange)
			          		{
			          			//--Tracker 17354- MATERIAL LIBRARY SEARCH FILTERS BASED ON MATERIAL TYPE
			          			// For setting the searched fields on retrieving the saved searches. Can make use of the searched fields 
			          			//in order to set them to the respective fields in the custom section, for eg :In material library -custom material type section
			          			//elm.setAttribute("docId",docid);
			          			//elm.setAttribute("searchFlds",searchedFlds);
			          			setAttribute(elm,"docId",docid);
			          			setAttribute(elm,"searchFlds",searchedFlds);
			          			elm.onchange();			          			
			          		}
			          	}
			          	break;
			        }
		        }
		        elm=null;
		    }
		}
	}
	
	/**
	This function is used to populate the custom section, operational search, with the search criteria 
	selected while saving the search. The searchedFlds, parameter will be a tilde, ~, separated string 
	for eg. 19:4:1:0:4~20:4:1:1:4~. <fldid>:<oprid>:<value>:<row>:<datatype>.
	Here the field drop down is iterated through and if the obtained fldid from parameter is found in the drop down 
	then that item selected. Global Variable,criteriaChngFlds[row] is set with the selected fld id, 
	This is done so that the search can be carried out again with the selected values. Operators drop down is attached 
	with function addOperators(), this is again done to identify the search operator for seacrh in the respective row. 
	As the global arrays, numoperators, charoperators and dateoperators are already populated with values as  
	array of operatorid=operatorname values. These arrays are looped through and the operator drop down populated and 
	the searched operator selected from the dropdown. Global Variable,oprs[row], is assigned with 
	selected operator id. This variable is used for constructing the search string for the search. 
	Likewise value field for row is identified and the searched value populated. Onchange event is called which will 
	assign search value criteria in the search string.
	*/
	function _setElementsToCustomSection(searchedFlds)
	{
		//alert(searchedFlds);
		var searchCriteria = '~chgTrkWithin=';
		
		var index = searchedFlds.indexOf(searchCriteria);
		if (index >= 0)
		{
		    var chgTrackSinceValue = searchedFlds.substring(index + searchCriteria.length, searchedFlds.length);
            var chgTrackSince = getElemnt(searchCriteria.substring(1, searchCriteria.length - 1));

		    //Remove the change track field so that the search criteria is set to the rest of the
		    //fields on the screens
		    searchedFlds = searchedFlds.substring(0, searchedFlds.lastIndexOf('~') + 1);
            if (chgTrackSince)
            {
                for (var i = 0 ; i < chgTrackSince.length ; ++i)
                {
                    if (chgTrackSince[i].value == chgTrackSinceValue)
                    {
                        chgTrackSince[i].selected = true;
                        break;
                    }
                }
            }

            if (searchedFlds == '~')
            {
                return;
            }
		}
		var rowsplit=searchedFlds.split('~');
		//alert(rowsplit);
		var secSplit;
		var fldId,typeid,val,row;
		var i=0;
		var j=0;
		var fld;
		var opers=new Array();
		//Tracker# 12873- OPERATIONAL SEARCH CRITERIA DOES NOT DISPLAY IN A SAVED SEARCH
		//Checking for operators, and if not there then calling functions to set it. The passed argument string will hold the operators
		if(this.numoperators.length==0)
			_setNumOperators(_adsrch_ns);
		if(this.charoperators.length==0)	
			_setCharOperators(_adsrch_cs);
		if(this.dateoperators.length==0)	
			_setDateOperators(_adsrch_ds);		
		
		for(i=0;i<(rowsplit.length-1);i++)
		{
			secSplit=rowsplit[i].split(':');
			fldId=secSplit[0];
			typeid=secSplit[1];
			val=secSplit[2];
			row=secSplit[3];
			dataType=secSplit[4];
			
			fld=getElemnt(srchflds+row);
			for(j=0;j<fld.options.length;j++)
			{
				//Tracker-26847 OMNI MARKET SAVED SEARCH 
				//Level was not consider in intial development .Now added level also part field id
				if(getCustomFieldId(fld.options[j].value)==fldId)
				{
					fld.options[j].selected=true;
					criteriaChngFlds[row]=fld.value;
					
					break;
				}
			}
			var opr=getElemnt(srchOpr+row);
			
			if(opr.options.length==0)
			{
				AddSelectOption(opr,'','-1', false);
			}else if(opr.options.length>1)
			{
				removeAllOptions(opr);
				AddSelectOption(opr,'','-1', false);
			}
			opr.name=row;
			opr.onchange=function(){return addOperators(this,this.name);}
			if(dataType==numericType||dataType==decimalType || dataType==integerType)
			{
				opers=this.numoperators;
			}else if(dataType==varcharType)
			{
				opers=this.charoperators;
			}else if(dataType==dateType || dataType==timeStampType)
			{
				opers=this.dateoperators;
			}
			
			for(var k=0;k<opers.length;k++){
				var spl=opers[k];				
				var spls=spl.split('=');
				var opid=spls[0];
				var opval=spls[1];
				AddSelectOption(opr, opval, opid, false);
				if(typeid==spls[0]){
					opr[k+1].selected=true;
					oprs[row]=spls[0];
				}
			}
			var valu=getElemnt(srchVal+row);
			if(val!='null')
			    valu.value=val;
			
			if(valu.onchange){
				valu.onchange();
			}
		}
	}
	/*
	This function is used to set the colors on the squares in colors section
	*/
	function _setElementsToColorSquareSection(colorFlds)
	{
		//alert(srchDocView);
		//alert("_setElementsToColorSquareSection:"+colorFlds);
		var colors=colorFlds.split(',');
		//alert(colors);
		//alert("_setElementsToColorSquareSection:1");
		colorSecConds=new Array();
		var areaObj =_getAreaObjByDocView(srchDocView);
		//alert("_setElementsToColorSquareSection:2");
		sectionName = areaObj.getDivSectionId();
		//alert("_setElementsToColorSquareSection:3");
		var containedDiv = document.getElementById(sectionName);
		//alert("_setElementsToColorSquareSection:4");
		var elms=containedDiv.getElementsByTagName("div");
		//alert("_setElementsToColorSquareSection:5");
		var colSplt='';
		var img='';
		for(var i=0;i<colors.length;i++)
		{
			colSplt=colors[i].split('=');
			//alert("_setElementsToColorSquareSection:colSplt:"+colSplt);
			for(var j=0;j<elms.length;j++)
			{
				//alert('elms[j].id:'+elms[j].id);
				//alert('colorsqr+colSplt[0]:'+colorsqr+colSplt[0]);
				//alert('colSplt[1]:'+colSplt[1]);
				if(elms[j].id==colorsqr+colSplt[0])
				{
					var keySplit=colSplt[1].split(':');
					var val=keySplit[0];
					var key=keySplit[1];
					//alert(keySplit);
					//alert(val);
					//alert(key);
					if(srchDocView==MAT_SRCH_VIEW_ID)
					{
						img=val.substring(0,val.length);
						//alert(imgSrcPath);
						colorSecConds[colorSecConds.length]=key.replace('~','=');
						elms[j].style.backgroundImage ="url("+imgSrcPath+'/thumbnails/'+img+")"; 
						elms[j].style.backgroundRepeat='no-repeat';
						elms[j].style.backgroundPosition='center';
					}
					else
					{
						if(val.substring(1,val.length)!=null)
						{
							//alert('inside');
							//alert('colSplt[1]:'+colSplt[1]);
							//alert(imgSrcPath);
							//alert("url("+imgSrcPath+"/"+colSplt[1]+")");
							var isImg=isImage(val);
							if(isImg==true)
							{
								elms[j].style.backgroundImage ="url("+imgSrcPath+'/thumbnails/'+val+")";
								elms[j].style.backgroundRepeat='no-repeat';
								elms[j].style.backgroundPosition='center'; 
							}
							else if(isImg==false)
							{
								//alert('here:colSplt[1]:'+colSplt[1]);
								elms[j].style.background=val;
							}
							
						}
						//Tracker# 12873- OPERATIONAL SEARCH CRITERIA DOES NOT DISPLAY IN A SAVED SEARCH						
						//alert(key);
						key=key.replace(/~/g,'@@');
						//alert(key);
						key=key.replace(/#/g,',');
						//alert(key);
						colorSecConds[colorSecConds.length]=key;
					}
					break;
				}
			}
		}
	}
	/* This functions checks whether the passed value is image or not
	*/
	function isImage(val)
	{
		val=val.toUpperCase();
		if(val.indexOf('JPG') > 0 || val.indexOf('GIF') > 0 || val.indexOf('PNG') > 0)
		  return true;
		else
		  return false;
	}
	
	/**
	This function populates the global array variable,numoperators with numeric operators.
	For eg. the entry will be as <oprid-1>=<opr-string-1>,<oprid-2>=<opr-string-2>.
	Parameter values to this function set from AdvancedSearchAction.
	*/
	function _setNumOperators(opers)
	{
		//Tracker# 12873- OPERATIONAL SEARCH CRITERIA DOES NOT DISPLAY IN A SAVED SEARCH
		//Assigning the operators to a global string
		_adsrch_ns=opers;
		var opsplit=opers.split(',');
		for(var i=0;i<opsplit.length;i++)
		{
			numoperators[i]=opsplit[i];
		}
	}
	/*
	This function populates the global array variable,charoperators with character operators.
	For eg. the entry will be as <oprid-1>=<opr-string-1>,<oprid-2>=<opr-string-2>.
	Parameter values to this function set from AdvancedSearchAction.
	*/
	function _setCharOperators(opers)
	{
		//Tracker# 12873- OPERATIONAL SEARCH CRITERIA DOES NOT DISPLAY IN A SAVED SEARCH
		//Assigning the operators to a global string
		_adsrch_cs=opers;
		var opsplit=opers.split(',');
		for(var i=0;i<opsplit.length;i++)
		{
			charoperators[i]=opsplit[i];
		}
	}
	/*
	This function populates the global array variable,dateoperators with date operators.
	For eg. the entry will be as <oprid-1>=<opr-string-1>,<oprid-2>=<opr-string-2>.
	Parameter values to this function set from AdvancedSearchAction.
	*/
	function _setDateOperators(opers)
	{
		//Tracker# 12873- OPERATIONAL SEARCH CRITERIA DOES NOT DISPLAY IN A SAVED SEARCH
		//Assigning the operators to a global string
		_adsrch_ds=opers;
		var opsplit=opers.split(',');
		for(var i=0;i<opsplit.length;i++)
		{
			dateoperators[i]=opsplit[i];
		}
	}
	/*
	This function is used to ceck whether the color is already droped to the color section or not.
	If its added returned false else true.
	*/
	function _isColorAdded(color)
	{
		for(var i=0;i<colorSecConds.length;i++)
		{
			if(colorSecConds[i]==color)
				return true;
		}
		return false;
	}
	
	/*
	This function returns a comma separated string of hexadeciaml values
	*/
	function _getColors(cols){
	var colors='';
	for(var i=0;i<cols.length;i++)
	{
		if(cols[i]!=null)
		{
			//Tracker#: 15436 ENHANCEMENT NEEDED TO SUPPORT SPECIAL CHARACTERS COMMA AND UNDERSCORE			
			colors+=cols[i]+'~~';
		}
	}
	//alert("colors:"+colors);
	//replacing '#' from the request.From firefox the request with '#' character not getting forwarded 
	//var cls=colors.replace(/#/g,'');
	return colors;
	}
	
	function _setImageStorePath(path)
	{
		imgSrcPath=path;
	}
}

	

	/*
	Thus function is used to remove all options available inside a select drop down.
	*/
	function removeAllOptions(selectbox)
	{
		var i;
		for(i=selectbox.options.length-1;i>=0;i--)
		{
		selectbox.remove(i);
		}
	}
	/*
	This functopn is used to add option element to a select object
	*/
	function AddSelectOption(selectObj, text, value, isSelected) 
	{
	    if (selectObj != null && selectObj.options != null)
	    {
	        selectObj.options[selectObj.options.length] =new Option(text, value, false, isSelected);
	         var areaObj =_getAreaObjByDocView(srchDocView);
	         //Tracker#:18078 -MATERIAL QUOTE SAVED SEARCH - USING 'STARTS WITH' DOES NOT WORK
	        //setting the modified data flag to true so that the search happens 
	        //when user clicks on search button after retrieving the saved search. 
	        if(areaObj)
	        {
	        	var objdata = areaObj.getHTMLDataObj();
	        	objdata._mHasUserModifiedData=true;
	        }
	    }
	}
	
	/*
	This function is used to validate the number field
	*/
	function valdtenum(obj)
	{
	    if (obj.value != "")
	    {
	        //val = replaceval(obj, CommaDelimiter, "");
	        val=obj.value;
	        if (parseFloat(val,10)!=(val*1))
	        {
	    		//alert(szMsg_Invalid_Number);
	    		var htmlErrors = new htmlAjax().error();
	       		htmlErrors.addError("errorInfo", szMsg_Invalid_Number,  true);
	       		messagingDiv(htmlErrors);
	            obj.value='';
	            obj.focus();
	            return false;
	        }
	    }
	    return true;
	}
	
	/*
	This function is to validate the decimal number 
	*/
	function vn_decimal(obj, scale)
	{
    var bRtn = true;
    if (obj.value != "")
    {
        bRtn = valdtenum(obj);
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
		            var htmlErrors = new htmlAjax().error();
	       			htmlErrors.addError("errorInfo", TempMsg,  true);
	       			messagingDiv(htmlErrors);
	           	 	obj.value='';
	            	obj.focus();
	            	return false;
                }
            }
            else if (scale <= 0 && nDec > 0)
            {
                var htmlErrors = new htmlAjax().error();
       			htmlErrors.addError("errorInfo", szMsg_Invalid_Integer,  true);
       			messagingDiv(htmlErrors);
           	 	obj.value='';
            	obj.focus();
            	return false;
            }
            else
            {
                obj.value = FormatNumber(obj.value, scale);
            }
        }
    }
    return bRtn;
}
	
	/*
	This function is used to validate the value passed to be number or not 
	*/
	function valdtenumval(val)
	{
	    if (parseFloat(val,10)!=(val*1))
	    {
			//alert(szMsg_Invalid_Number);
			var htmlErrors = new htmlAjax().error();
	  		htmlErrors.addError("errorInfo", szMsg_Invalid_Number,  true);
	  		messagingDiv(htmlErrors);
	        return false;
	    }
	    return true;
	}
	
	/**

This function is used to validate the date fields. This is an overridden function of vd() in comfunc.js.
Overrode to display error messages.  
*/
function vdate(fldObj, dateFormat)
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
    {
    	var htmlErrors = new htmlAjax().error();
        htmlErrors.addError("errorInfo", this.msg,  true);
        messagingDiv(htmlErrors);
        return false;
    }
	   // return dispMsg(this, fldObj);

	// going to check the pattern here
	if (!checkPattern(fldObj.value))
	{
		var htmlErrors = new htmlAjax().error();
        htmlErrors.addError("errorInfo", this.msg,  true);
        messagingDiv(htmlErrors);        
    	return false;
	}
	    //return dispMsg(this, fldObj);
    // this will set month, year, & day
    setValues(this, fldObj.value);

   /* alert(this.month);
    alert(this.year);
    alert(this.day);*/

    if (!isValidMD(this))
    {
    	var htmlErrors = new htmlAjax().error();
        htmlErrors.addError("errorInfo", this.msg,  true);
        messagingDiv(htmlErrors);       
    	return false;
    }
	//    return dispMsg(this, fldObj);

    return true;
}
	
	/*
	This function is used to get the data type from the criteria search string
	*/
	function getDataType(str)
	{
		var params= str.split(":");
		return params[4];
	}
	/*
	This function is used to get the fld id from the criteria search string
	*/
	function getFieldId(str)
	{
		var params= str.split(":");
		//Tracker# 12873- OPERATIONAL SEARCH CRITERIA DOES NOT DISPLAY IN A SAVED SEARCH
		//docId.levelid.fieldId 
		return params[0]+"."+params[2];
	}
	//Tracker-26847 OMNI MARKET SAVED SEARCH 
	//Level was not considered in intial development .Now added level also part field id
	function getCustomFieldId(str)
	{
		var params= str.split(":");
		//Tracker# 12873- OPERATIONAL SEARCH CRITERIA DOES NOT DISPLAY IN A SAVED SEARCH
		//docId.levelid.fieldId .LevlId
		return params[0]+"."+params[2]+"."+params[3];
	}
	/*
	This function is used to get the opr id from the criteria search string
	*/
	function getOprId(str)
	{
		var params= str.split(":");
		return params[2];
	}
	/*
	The function used to set the cursor style 
	*/
	function setCursorStyle(obj,stl)
	{
		obj.style.cursor=stl;
	}
	function setActionAndMethod(docId,action,method)
	{
		actionClass=action;
		actionMethod=method;
	}
	//--Tracker 17354- MATERIAL LIBRARY SEARCH FILTERS BASED ON MATERIAL TYPE
	/*This function will set the searched fields on the custom section of the search screen 
	*/ 
	function setSearchedToCustomFields(section,searchedFlds)
	{
		var containedDiv = getElemnt(section);
		var split1=searchedFlds.split(',');
	    //alert(split1);
		var str;
		var split2;
		var fldval;
		var fld;
		var val;
		var docid;
		//alert(searchedFlds);
		var fArray=new Array();
		for(i=0;i<(split1.length-1);i++)
		{
			str=split1[i];
			//alert(str);
			split2=str.split('=');
			//alert(split2);
			fld=split2[0];
			var fldvalsplit=fld.split(':');
			docid=fldvalsplit[0];
			fldval=fldvalsplit[1];
			val=split2[1];
			var elms=containedDiv.getElementsByTagName("*");
	        var fldid;
		    var splt;
		    var flddocid;
		    for(var j = 0;  j < elms.length; j++) 
			{
		        var elm = elms[j];
		        splt=elm.id.split(_FIELDS_SEPERATOR);
		        flddocid=splt[1];
			    fldid=splt[2];
		        switch(elm.type) 
		        {
			        case "text":
			        {
			    		if(fldval==fldid && flddocid==docid)
			        	{
			          		elm.value=val;
			          		if(elm.onchange)
			          		{
			          			elm.onchange();
			          		}			          		
			          	}
			          	break;
			        }
			        case "select-one":
			        {
			        	if(fldval==fldid && flddocid==docid)
			          	{
			          		for(k=0;k<elm.options.length;k++)
			          		{
			          			if(elm[k].text==val)
			          			{
			          				elm[k].selected=true;
			          			}
			          		}
			          		if(elm.onchange)
			          		{
			          			elm.onchange();			          			
			          		}
			          	}
			          	break;
			        }
		        }
		        elm=null;
		    }
		}
	}
//Tracker 17354:-MATERIAL LIBRARY SEARCH FILTERS BASED ON MATERIAL TYPE
//This function will set the change fields to the objData and also call the _notifyChangeFields functions for the 
//changed component of the document.	 
function setDataToChangeFields(obj,objData)
{
	var chngArray=new Array();
	var elem;
	var chngFlds=objData.getChangeFields();
	//If document changed fields not present in the search object then adding it
	if(chngFlds.length >0)
	{
		for(var i=0;i<chngFlds.length;i++)
		{
			if(!inList(chngFlds[i], obj.changeFields ))
			{
				obj.changeFields[obj.changeFields.length]=chngFlds[i];
			}
		}
	}
	//notifying the changed fields 
	if(obj.changeFields.length >0)
	{
		for(var i=0;i<obj.changeFields.length;i++)
		{
			elem=getElemnt(obj.changeFields[i]);
			if(elem)
			{
				chngArray[chngArray.length]=obj.changeFields[i];
				///alert('here :'+elem.value);
				_notifyChangeFields(elem);
				objData._mHasUserModifiedData=true;
			}
		}		
		//Setting the changed fields to the objData
		if(chngArray.length > 0)
		{
			objData._mChangedFields=chngArray;
		}
	}	
}	 
/*Function to check whether the passed string is present in the arr object  
*/
function inList(str,arr)
{
	var a=false;
	if(arr)
	{
		for(var i=0;i<arr.length;i++)
		{
			if(arr[i]==str)
			{
				a=true;
				break;
			}
		}
	}
	return a;
}

//=====search.js=======


var search;

function createSearchObject(docViewId)
{
	search=new advancedSearch(docViewId);
}

/**
This function is used to get the operators for the selected field from the fields drop down.
*/
function getOperators(obj,rownum)
{	
    if(search)
	{
		search.getOperators(obj,rownum);
	}
}

/*
This function is used to set the selected value of the operators drop down to a global 
array variable,oprs, with index as row number. If the operator is not null or not null is selected,
then the value field is made disabled
*/
function addOperators(obj,rownum)
{	
    if(search)
	{
		search.addOperators(obj,rownum);
	}
}
/*
This function is used to set the value of the value text box to a global 
array variable,values, with index as row number
*/
function addValues(obj,rownum)
{	
    if(search)
	{
		search.addValues(obj,rownum);
	}
}


/**
This function is used to fetch the search results based on the search criteria.
*/
//Tracker#19202 
//added new parameter 'searchBtnOnClickCallbackHandler' to function.
function getSearchResults(sec,docViewId, searchBtnOnClickCallbackHandler)
{
	if(search)
	{
		if(searchBtnOnClickCallbackHandler!='')
		{
			search.setSearchOnClickCallback(searchBtnOnClickCallbackHandler);
		}
		search.getSearchResults(sec,docViewId);
	}
}

/*
This function is used to save the search with the name entered. 
*/
function saveSearch(docViewId,txtName,div)
{
	var val = getElemnt(txtName).value;
	if(val != val.toUpperCase())
	{
		u(getElemnt(txtName));
	}
	if(search)
	{
		search.saveSearch(docViewId,txtName,div);
	}
}

/*
This function is used to clear the search values and collapse the advanced search section
*/
function cancelSearch(docViewId)
{
	if(search)
	{
		search.cancelSearch(docViewId);
	}
}
/*
This function is used to clear all the components involved in search.
*/
function clearFields(docViewId)
{
	if(search)
	{
		search.clearFields(docViewId);
	}
}
/*
This function is used to clear the search string entered.
*/
function clearSearchString()
{
	if(search)
	{
		search.clearSearchString();
	}
}

//Tracker#:20812 FDD 536 - IMPLEMENTING THE GENERIC CHANGES REQUIRED FOR THE FR1 AND TECH SPEC
//Modified the function to add the save comfirm message onclick of the moreactions button 
function showSavedSrch(mainDiv,contentDiv,docViewId)
{
	//alert("here");
	var objCont = getElemnt("hndSavedSearchPreClickHandler");
	
	//alert("objCont.value" + typeof(objCont.value));
	
	if(objCont && objCont.value)
	{			
		var str = objCont.value+"('"+mainDiv+"','"+contentDiv+"','"+docViewId+"');";
		//alert(str);
		eval(str);
	}
	else
    {   
        displaySavedSrch(mainDiv,contentDiv,docViewId);
    }	
}

//Tracker#:20812 FDD 536 - IMPLEMENTING THE GENERIC CHANGES REQUIRED FOR THE FR1 AND TECH SPEC
//Modified the function to add the save comfirm message onclick of the saved search button 
function _plmSavedSearchPreClickHandler(mainDiv,contentDiv,docViewId)
{	
	var htmlAreaObj = _getWorkAreaDefaultObj();
    var objHTMLData = htmlAreaObj.getHTMLDataObj();
   	var objAjax = htmlAreaObj.getHTMLAjax();
    var docviewid = htmlAreaObj.getDocViewId();
   
    var saveFunc = _getSaveFunc();
    
    //alert("saveFunc"+saveFunc);
	if(saveFunc != "0" && objHTMLData!=null && objHTMLData.hasUserModifiedData() && objHTMLData.isDataModified())
    {
        var htmlErrors = objAjax.error();
        htmlErrors.addError("confirmInfo", szMsg_Changes,  false);
        
       	var saveHdlr = _getScreenSaveHandler();
        messagingDiv(htmlErrors, saveHdlr , "displaySavedSrch('"+mainDiv+"','"+contentDiv+"','"+docViewId+"')");
    }
    else
    {    	
        displaySavedSrch(mainDiv,contentDiv,docViewId);
    }   
}

/*
This function used to get the saved searches list.
*/
function displaySavedSrch(mainDiv,contentDiv,docViewId)
{
	cancelProcess();
	if(search)
	{
		search.showSavedSrch(mainDiv,contentDiv,docViewId);
	}
}

/**
This function is used to delete the selected saved searches.
*/
function deleteSearch(divId,docViewId)
{
	if(search)
	{
		search.deleteSearch(divId,docViewId);
	}
}
/*
This function used to get the search result when the user clicks on the 
saved search name link on the popup
*/
function getSearch(sec,searchId,docId,docViewId)
{
	if(search)
	{
		search.getSearch(sec,searchId,docId,docViewId);
	}
}

/*
This function used to sort the saved searches which is displayed as a popup  
*/
function sort(sortby,docViewId,ascDesc)
{
	if(search)
	{
		search.sort(sortby,docViewId,ascDesc);
	}
}

/*
 This function assigns concatenated field-value string to the global variables,searchedFlds
 and searchedCustomFlds. 
 Parameter values to this function set from ColorLibAction
*/ 
function setSearchedFields(flds,cFlds,colrFlds)
{
	if(search)
	{
		search.setSearchedFields(flds,cFlds,colrFlds);
	}
}

/**
This function populates the global array variable,numoperators with numeric operators.
*/
function setNumOperators(opers)
{
	if(search)
	{
		search.setNumOperators(opers);
	}
}
/*
This function populates the global array variable,charoperators with character operators.
*/
function setCharOperators(opers)
{
	if(search)
	{
		search.setCharOperators(opers);
	}
}
/*
This function populates the global array variable,dateoperators with date operators.
*/
function setDateOperators(opers)
{
	if(search)
	{
		search.setDateOperators(opers);
	}
}
/*
This function is used to check whether the color is already droped to the color section or not.
If its added returned false else true.
*/
function isColorAdded(color)
{
	if(search)
	{
		search.isColorAdded(color);
	}
}

/*
This function returns a comma separated string of hexadeciaml values
*/
function getColors(cols)
{
	if(search)
	{
		search.getColors(cols);
	}
}

/*
	This function is used to display the Save search name entry popup <DIV>
	*/
	function showSrchNameDiv(divId,txt)
	{
	    if(search)
		{
			search.showSrchNameDiv(divId,txt);
		}
	}

/*
	This function is used to display the Save search name entry popup <DIV>
	*/
	function hideSrchNameDiv(divId,txtName)
	{
	    if(search)
		{
			search.hideSrchNameDiv(divId,txtName);
		}
	}
	
	function setImageStorePath(path)
	{
		if(search)
		{
			search.setImageStorePath(path);
		}
	}
	
	function showSrchSave(docViewId)
	{
		if(search)
		{
			search.showSrchSave(docViewId);
		}
	}

	// This function used to call the search on click of enter key
	//Tracker#19202 
	//added new parameter 'searchBtnOnClickCallbackHandler' to function.
	function fSubmit(e,obj,sec,docViewId,div,searchBtnOnClickCallbackHandler)
	{
		 
		 var key;      
	     if(window.event) {
			key = window.event.keyCode; //IE
		 } else {
			key = e.which;			//firefox      
		 }
		 if(key == '13')
		 {
		 	/*
		 	 * Tracker#: 18889 - REGRESSION SAFARI & FIREFOX: HITTING ENTER KEY DURING SEARCH DOES NOT WORK
		 	 * for textboxes, the onchange event that updates the changed fields is being fired after the ajax call, which
		 	 * causes the first search using enter key to not include the value of the currently focused field.
		 	 * Fix: explicitly call onchange event for currently focused field.
		 	 */
			 if (obj)
			 {
			 	obj.onchange();
			 }
			 //Tracker#:18545 -ENTER KEY IS NOT ACTIVE ON THE MATEIAL PROJECTION SUMMARY ADVANCED SEARCH
		 	//Identified search button and setting focus to it on enter key press so that the onblur of the 
		 	// text box get fired.
		 	var srchBtn=getElemnt('_searchBtnbtnCtr');
		 	srchBtn.focus();
		 	//Tracker 17354:-MATERIAL LIBRARY SEARCH FILTERS BASED ON MATERIAL TYPE
		 	//If there is no value prevent the onchange call. 
		 	/*if(_trim(obj.value).length>0)
		 	{
		 		obj.onchange();
		 	}*/	
		 	//Tracker#19202
		 	//added additonal parameter 'searchBtnOnClickCallbackHandler'.	 	
		 	getSearchResults(sec,docViewId,searchBtnOnClickCallbackHandler);
		 }
	}
	
	//Tracker #12730 -ADVANCED SEARCH: AFTER USING DRAG AND DROP, HITTING 'ENTER' KEY DOES NOT EXECUTE SEARCH
	/*This function will set the focus to the first text box of the search section. Called on click of the search section and while drag and drop
	*/
	function setSrchFocus(docVw,srchId)
	{		
		var elms;		
		if(srchId)
		{
			var divObj=getElemnt(srchId);			
			if(divObj && divObj.style.visibility!='hidden')
			{
				elms=divObj.getElementsByTagName("input");
				focusFirstText(elms);
			}
		}
		else
		{
			var areaObj =_getAreaObjByDocView(docVw);
			var sectionName = areaObj.getDivSectionId();
			var containedDiv = document.getElementById(sectionName);
			elms=containedDiv.getElementsByTagName("input");
			focusFirstText(elms);
		}
	}
	//Tracker #12730 -ADVANCED SEARCH: AFTER USING DRAG AND DROP, HITTING 'ENTER' KEY DOES NOT EXECUTE SEARCH
	function focusFirstText(elms)
	{
		for(var j = 0;  j < elms.length; j++) 
		{
	       var elm = elms[j];
	       if(elm.type=="text") 
	        {
		       elm.focus();
		       break;		       
		     }
		}
	}	
	//Tracker #12730 -ADVANCED SEARCH: AFTER USING DRAG AND DROP, HITTING 'ENTER' KEY DOES NOT EXECUTE SEARCH
	// Function to prevent the bubbling of events
	function stopBubbling(e)
	{
		if (e && e.stopPropagation) //if stopPropagation method supported
  			e.stopPropagation()
 		else
  			event.cancelBubble=true
	}
	
				
	

