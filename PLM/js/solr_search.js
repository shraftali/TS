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

	$(document).ready(function() 
    {    	
    	try
		{
    		SolrSearch.init();    
		}
		catch(e)
		{
			//alert(e.description);
		} 
    });
    
    var SolrSearch = 
    {
    	init: function()
    	{    	
	        $('.accordion .head').click(
	                function() {
	                	//alert("accordion called");
	                    $(this).next().toggle('slow');
	                    $(this).find("span").toggleClass("ui-icon-triangle-1-s").toggleClass("ui-icon-triangle-1-e");
	
	                    return false;
	                })/*.next().hide()*/;

	        //without animation for slider fields
	        $('.accordionNoAnimate .head').click(
	                function() {
	                	//alert("accordionNoAnimate  called");
	                    $(this).next().toggle();
	                    $(this).find("span").toggleClass("ui-icon-triangle-1-s").toggleClass("ui-icon-triangle-1-e");
	                    return false;
	                });		
		
	        $('#q1').keyup(function(e)
	        {
				if(e.keyCode == 13)
				{
					SearchEngJs.searchDocuments();
				}
			});
			
		}
    };

    
    
var SEP = ":";
var LIKE = "*";
	
var searchResultsId = '_genSearchResult';		

var SearchEngJs = {
		
	delim :	"~@",
	delimFldVal :	":",
		
	setFQValue:function (field, value) {		
        var val = field + ':\"' + value + '\"';
        var f = getElemnt('frq');
                
        if (!f)
       	{        	        	
	        $('#divAjaxReq').append(
	        		$('<input>').attr({
	                    type: 'hidden',
	                    name: 'frq',
	                    id:'frq',
	                    value: val
	                }));	        
    	}
		else
		{			
			var tval= $('#frq').attr("value");
			
			if(typeof(tval)=="undefined")
			{					
		        $('#frq').attr("value", val);		        
		        return;
			}
						
			var splt = tval.split(this.delim)
	    	var len = 0;
	        var cval = '';
	        if(splt)
	        	len = splt.length;
	        
	        for ( i=0;i<len;i++)
	        {	        	
	        	if(splt[i] == val)
	        	{
	        		return;
	        	}
	        }
	        var cval = tval + this.delim + val;
	        
	        //not to add both document type Techspec & PO
	        if(field=="DOCUMENT_TYPE")
    		{	        	
	        	for ( i=0;i<len;i++)
		        {	        	
		        	var fldVal = splt[i].split(this.delimFldVal);
		        	if(fldVal && fldVal.length>1 && fldVal[0]=="DOCUMENT_TYPE")
	        		{
		        		fldVal[1]=value;
		        		splt[i] = fldVal.join(this.delimFldVal);
		        		cval = splt.join(this.delim);		        		
		        		break;
	        		}
		        }
    		}    
	        //alert("final cval ->" + cval);
	        $('#frq').attr("value",cval);	        
		}
	},
		
	setFQQuery:function (query) {	
		var fq = getElemnt('facetQuery');       
                
        if (!fq)
       	{        	        	
	        $('#divAjaxReq').append(
                    $('<input>').attr({
                        type: 'hidden',
                        name: 'facetQuery',
                        id	: 'facetQuery',	
                        value: query
                    }));	        
    	}
		else
		{			
			var tval= $('#facetQuery').attr("value");
			
			if(typeof(tval)=="undefined")
			{					
		        $('#facetQuery').attr("value", query);		        
		        return;
			}
						
			var splt = tval.split(this.delim)
	    	var len = 0;
	        var cval = '';
	        if(splt)
	        	len = splt.length;
	        
	        for ( i=0;i<len;i++)
	        {	        	
	        	if(splt[i] == query)
	        	{
	        		return;
	        	}
	        }
	        var cval = tval + this.delim + query;
	        $('#facetQuery').attr("value",cval);	        
		}
	},
	
    addFQ: function (field, value) {
    	
    	this.setFQValue(field, value);
        $('#currentPage').attr("value", 1);
        this.resetMoreFacets();
        this.callSearch(searchResultsId);
    },
    
    addDefaultDOC: function (field, value) {     	
	   //alert("addDefaultDOC called " + value);
		var val = value;
		var f = getElemnt('defaultDoc');    	
		if(!f)
		{
			//alert("create new default doc");
			$('#_genSearchSection').append(
	        		$('<input>').attr({
	                    type: 'hidden',
	                    name: 'defaultDoc',
	                    id:'defaultDoc',
	                    value: val
	                }));		
		}
		else
		{
			//alert("replace existing one"  + $('#defaultDoc').attr("value"));
			$('#defaultDoc').attr("value",value);
		}
    },
    
 		addDefFQ: function (field, value) { 
 		
 		//alert("addDefFQ  field -> " + field + " value -> " +value);
 		this.setFQValue(field, value);
 		
 		//commented to resolve the document getting displayed two times during
 		// second filter, where first time advanced search is used.
 		/*var val = field + ':\"' + value + '\"';
    	var f = getElemnt('frq');
        if (!f)
       	{
	        $('#divAjaxReq').append(
	        		$('<input>').attr({
	                    type: 'hidden',
	                    name: 'frq',
	                    id:'frq',
	                    value: val
	                }));
    	}
		else
		{
			var tval= $('#frq').val();
			var splt = tval.split(this.delim)
	    	var len = 0;
	        var cval = '';
	        if(splt)
	        	len = splt.length;
	        for ( i=0;i<len;i++)
	        {
	        	if(splt[i] == val)
	        	{
	        		return;
	        	}
	        }
	        var cval = tval + this.delim + val;
	        $('#frq').attr("value",cval);	        
		} */       
    },

    addFacetQuery: function (query) {
        var found = false;
        $("input[name='facetQuery']").each(function() {        	
            if ($(this).attr("value") == query) {
                found = true;
            }
        });
                
        if (found) {
            return;
        }
                
        $('#currentPage').attr("value", 1);
        this.resetMoreFacets();
        
        if($('#isAjaxReq') && $('#isAjaxReq').attr("value")==1)    	
    	{
        	//alert("advance search")        	
        	this.setFQQuery(query);
        	
        	this.callSearch(searchResultsId);
    	}        
        else
    	{
        	$('#searchForm').append(
                    $('<input>').attr({
                        type: 'hidden',
                        name: 'facetQuery',
                        id	: 'facetQuery',	
                        value: query
                    }));
        	document.forms[0].submit();
    	}          
    },

    removeFacetQuery: function (value) {
        var tval= $('#facetQuery').val();		
    	var splt = tval.split(this.delim)
    	var len = 0;
        var cval = '';
        if(splt)
        	len = splt.length;
        for ( i=0;i<len;i++)
        {
        	if(splt[i] != value)
        	{
        		cval = cval+splt[i]+this.delim
        	}
        }
        var lind = cval.lastIndexOf(this.delim) == -1 ? cval.length: cval.lastIndexOf(this.delim);
        cval = cval.substring(0,lind);
        $('#facetQuery').attr("value",cval);
        
        $('#currentPage').attr("value", 1);
        
        if($('#isAjaxReq') && $('#isAjaxReq').attr("value")==1)    	
    	{
        	this.callSearch(searchResultsId);
    	}
        else
    	{
        	document.forms[0].submit();
    	}        
    },

    // TODO - To take list and add accordingly.
    addFacetGroup: function (field, value)
    {
        var val = field + ':' + value;

        var found = false;
        $("input[name='fq']").each(function()
        {
            if ($(this).attr("value") == val)
            {
                found = true;
            }
        });

        if (found)
        {
            return;
        }

        $('#currentPage').attr("value", 1);  
        
        if($('#isAjaxReq') && $('#isAjaxReq').attr("value")==1)    	
    	{        		
        	$('#divAjaxReq').append(
        			$('<input>').attr({
                        type: 'hidden',
                        name: 'fq',
                        id: 'fq',
                        value: val
                    }));
        	
        	this.callSearch(searchResultsId);
    	}        
        else
    	{
        	 $('#searchForm').append(
                     $('<input>').attr({
                         type: 'hidden',
                         name: 'fq',
                         id: 'fq',
                         value: val
                     }));
        	document.forms[0].submit();
    	}          
    },

    showMoreFacets: function (field, value) {
        $("input[name='facetNavigate" + field +"']").each(function() {
            $(this).attr("value", value);
        });
        this.callSearch(searchResultsId);
    },
    resetMoreFacets: function () {
        $('#resetFacetNavigate').attr("value", "true");
    },
    toggleIncludePublic: function (){
        $("input[name='includePublic']").each(function() {
            if( $(this).attr("value") == 'true') {
                $(this).attr("value", 'false');
            }
            else {
                $(this).attr("value", 'true');
            }
        });
        document.forms[0].submit();
    },

    toggleViewType: function (viewType){
    	$("#viewType").attr("value", viewType);
        this.callSearch(searchResultsId);
        //document.forms[0].submit();
    },

    changeTabType: function (){
        var selectedTabType = $("#chTabType").attr("value");
        $("#tabType").attr("value", selectedTabType);
        document.forms[0].submit();
    },

    addRangeFQ: function (field, fromValue, toValue)
    {
        var val = field + ':[' + fromValue +  ' TO ' + toValue + ']';

        var found = false;

        $("input[name='fq']").each(function()
        {
            if ($(this).attr("value") == val)
            {
                found = true;
            }
        });

        if (found)
        {
            return;
        }

        $('#searchForm').append(
                $('<input>').attr({
                    type: 'hidden',
                    name: 'fq',
                    value: val
                }));

        $('#currentPage').attr("value", 1);
        document.forms[0].submit();
    },

    addStatsFQ: function (field, minValue, maxValue)
    {
        var val = field + ':[' + minValue +  ' TO ' + maxValue + ']';

        $("input[name='fq']").each(function()
        {
            if ($(this).attr("value").indexOf(field) == 0)
            {
            	$(this).remove();
            }
        });

        $('#searchForm').append(
                $('<input>').attr({
                    type: 'hidden',
                    name: 'fq',
                    value: val
                }));

        $('#currentPage').attr("value", 1);
        document.forms[0].submit();
    },

    addDateRangeFQ: function (field, fromValue, toValue)
    {
    	var val = field + ':[' + fromValue +  ' TO ' + toValue + ']';

        $("input[name='fq']").each(function()
        {
            if ($(this).attr("value").indexOf(field) == 0)
            {
            	$(this).remove();
            }
        });

        $('#searchForm').append(
        $('<input>').attr({
            type: 'hidden',
            name: 'fq',
            value: val
        }));

        $('#currentPage').attr("value", 1);
        document.forms[0].submit();
    },

    removeFQ: function (value) {
    	var tval= $('#frq').val();		
    	var splt = tval.split(this.delim)
    	var len = 0;
        var cval = '';
        if(splt)
        	len = splt.length;
        for ( i=0;i<len;i++)
        {
        	if(splt[i] != value)
        	{
        		cval = cval+splt[i]+this.delim
        	}
        }
        var lind = cval.lastIndexOf(this.delim) == -1 ? cval.length: cval.lastIndexOf(this.delim);
        cval = cval.substring(0,lind);
        $('#frq').attr("value",cval);	
        this.resetMoreFacets();
        this.callSearch(searchResultsId);
    },
    removeAFQ: function (value) {
    	var tval= $('#advfq').val();	
    	var splt = tval.split(this.delim)
    	var len = 0;
        var cval = '';
        if(splt)
        	len = splt.length;
        for ( i=0;i<len;i++)
        {
        	if(splt[i] != value)
        	{
        		cval = cval+splt[i]+this.delim        		
        	}
        }
        var lind = cval.lastIndexOf(this.delim) == -1 ? cval.length: cval.lastIndexOf(this.delim);
        cval = cval.substring(0,lind);
        $('#advfq').attr("value",cval);
        this.removeAdvSrch(value);
        this.resetMoreFacets();
        this.callSearch(searchResultsId);
    },
    
    removeAdvSrch: function (value) 
    {
    	var splt = value.split("@@");
    	value = splt[0];
    	
		if(splt.length > 3)
    	{
    		var oprName = value + '_OPR'; 
    		$('#advancedSearchDiv select[name*="' + oprName + '"]').attr("value", splt[2]);
    	}
    	    	
    	$('#advancedSearchDiv input[name*="'+value+'"]').attr("value", "");    	
    },
    
    removeFQField: function (fieldName) {
        $("input[name='fq']").each(function() {
            if ($(this).attr("value").indexOf(fieldName + ':') == 0) {
                $(this).remove();
            }
        });
    },

    clearParam: function (fieldName) {
        $("#" + fieldName).attr("value", "");
        this.resetMoreFacets();
        this.callSearch(searchResultsId);
    },
    
    showAdvanceSearch: function(field)
	{	    	
    	SearchEngJs.setFQValue('DOCUMENT_TYPE', field.value.toUpperCase());    	
    	var objAjax = new htmlAjax();
    	
        var areaObj =_getAreaObjByDocView(0);
        var objHTMLData = areaObj.getHTMLDataObj();
        if(objAjax)
        {
        	var advSrch = SearchEngJs.getAdvSearchSelection();
        	var url = "displayadvancesearch";        	
        	objAjax.setDivSectionId("advancedSearchDivMain");
            bShowMsg = true;
            objAjax.setActionURL("generalsearch.do");
            objAjax.setActionMethod(url);            		
            objAjax.parameter().add("search",this.getSelectedDocument());
            objAjax.setProcessHandler(SearchEngJs._displaySolrSearchResults);
            objAjax.sendRequest();
            return;
         }        
	},
	
	 searchDocuments: function (secId) {
	    	
	    	//alert("search doc $('#frq').val() -> " + $('#frq').val());
	    	
	    	//alert("this.getSelectedDocument() " + this.getSelectedDocument() + "\n  defa = " + $("#defaultDoc").attr("value"));
	    	
	    	if(this.getSelectedDocument() != $("#defaultDoc").attr("value") )
	        {
	    		var frqVal = $('#frq').val();
	    		if(frqVal && frqVal.indexOf('DOCUMENT_TYPE:') >= 0)
	    		{
	        		// TODO - To remove hard coded and add from default filter list.
	    			//alert("adsfa  - > " + this.getSelectedDocument());
	    			$('#frq').attr("value", 'DOCUMENT_TYPE:\"'+this.getSelectedDocument().toUpperCase()+'\"');	
	    		}
	    		else
	    		{
	    			//alert("reset");
	    			$('#frq').attr("value", '');	
	    		}    		
	        }
	    	
	        $('#currentPage').attr("value", 1);
	        //If user changes the search text then only remove the adv search and filter queries. 
	        var q1tmp = getElemnt('q1tmp');
	        var q1 = getElemnt('q1');        
	        if (q1tmp)
	        {
	        	if ($('#q1tmp').attr("value").toUpperCase() != $('#q1').attr("value").toUpperCase())
	        	{
	        		var frqVal = $('#frq').val();
	        		if(frqVal && frqVal.indexOf('DOCUMENT_TYPE:') >= 0)
	        		{
		        		// TODO - To remove hard coded and add from default filter list.
	        			//alert("adsfa  - > " + this.getSelectedDocument());
	        			$('#frq').attr("value", 'DOCUMENT_TYPE:\"'+this.getSelectedDocument().toUpperCase()+'\"');	
	        		}
	        		else
	        		{
	        			//alert("reset");
	        			$('#frq').attr("value", '');	
	        		}
	                $('#advfq').attr("value", '');
	                //alert("before clearing");
	                this.clearAdvSearchFQ();
	        	}
	        }        
	        //alert("at the end $('#frq') = " + $('#frq').attr("value"));
	        this.resetMoreFacets();
	        this.callSearch(secId);        
	    },
    
    setPreviousText: function(value)
    {
    	//Tracker#:22938 GLOBAL SEARCH - PO : PREVIOUS SEARCH CRITERIA IS NOT GETTING CLEARED DURING DRILL DOWN
    	// sets the previous settings details
    	var q1tmp = getElemnt('q1tmp');    	
        if (!q1tmp)
        {
 	        $('#divAjaxReq').append(
 	        		$('<input>').attr({
 	                    type: 'hidden',
 	                    name: 'q1tmp',
 	                    id:'q1tmp',
 	                    value: $('#q1').attr("value")
 	                }));
     	}
        else
        {
        	 $('#q1tmp').attr("value", value);
        }
    	
    },
    
    callSearch: function (secId)
    {
    	//alert("call search $('#frq') = " + $('#frq').attr("value"));
    	
    	$('#q1').val($('#q1').val().toUpperCase());
    	this.setPreviousText($('#q1').attr("value"));
    	
    	var fqVal = $('#frq').val();
    	var advVal = $('#advfq').val();
    	var spl, advSpl ;
    	var len = 0;
    	var adlen = 0;
    	
    	//alert("fqVal "  + fqVal);
    	if (fqVal && fqVal.length > 0)
    	{
    		spl = fqVal.split(this.delim);
    		len = spl.length;
    	}
    	
    	if (advVal && advVal.length > 0)
    	{
    		advSpl = advVal.split(this.delim);
    		adlen = advSpl.length;
    	}
       
    	var objAjax = new htmlAjax();    	    	
        //var areaObj =_getAreaObjByDocView(0);
        //var objHTMLData = areaObj.getHTMLDataObj();
        
        if(objAjax)
        {
        	var advSrch = SearchEngJs.getAdvSearchSelection();
        	var url = "displaysearchresult&currentPage="+$('#currentPage').attr("value")
        	+"&view="+$('#viewType').attr("value")
        	+"&advSrch="+advSrch;
        	//alert("url ->" + url);
        	objAjax.setDivSectionId(secId);
            bShowMsg = true;
            objAjax.setActionURL("generalsearch.do");
            objAjax.setActionMethod(url);
            
            //alert("def value " + $("#defaultDoc").attr("value") + " \n this.getSelectedDocument() " + this.getSelectedDocument());
           
            objAjax.parameter().add("q1",$('#q1').attr("value"));
            objAjax.parameter().add("search",this.getSelectedDocument());
            objAjax.parameter().add("selDocumentType", this.getSelectedDocument());
            objAjax.parameter().add("numberOfRecords", $("#numberOfRecords").attr("value"));	            
            objAjax.parameter().add("sortOrder", $("#sortOrder").attr("value")); 
            
            //alert("$(#defaultDoc).attr(value) -> " + $("#defaultDoc").attr("value") + "\n this.getSelectedDocument() " + this.getSelectedDocument());
            
            if( (this.getSelectedDocument() == $("#defaultDoc").attr("value")) || ($("#defaultDoc").attr("value")=="null") )
            {       
            	//alert("inside adding more filters ");
            	
	            for (i=0; i < len; i++)
	            {
	            	//alert("spl["+i+"]->"+ spl[i]);
	            	objAjax.parameter().add("fq",spl[i]);	
	            }
	            for (i=0; i < adlen; i++)
	            {
	            	objAjax.parameter().add("advfq",advSpl[i]);	
	            }
				
	            $('input[name^="facetNavigate"]').each(function(idx){            	
	            	objAjax.parameter().add($(this).attr("name"), $(this).attr("value"));	
	            });
	            $('input[name^="facetOffset"]').each(function(idx){            	
	            	objAjax.parameter().add($(this).attr("name"), $(this).attr("value"));	
	            });  
	            
            	objAjax.parameter().add("q1",$('#q1').attr("value"));
            	objAjax.parameter().add("search",this.getSelectedDocument());
	            objAjax.parameter().add("resetFacetNavigate", $("#resetFacetNavigate").attr("value"));
           	 	objAjax.parameter().add("selDocumentType", this.getSelectedDocument());
           	 	
	            if($("#facetQuery") && $("#facetQuery").attr("value"))
	        	{
	        		var fqQuery = $('#facetQuery').val();
    				var splQuery;
    				var len = 0;
    	
			    	//alert("fqVal "  + fqVal);
			    	if (fqQuery && fqQuery.length > 0)
			    	{
			    		splQuery = fqQuery.split(this.delim);
			    		len = splQuery.length;
			    	}
	        		
	        		for (i=0; i < len; i++)
		            {
		            	//alert("spl["+i+"]->"+ spl[i]);
		            	objAjax.parameter().add("facetQuery",splQuery[i]);	
		            }
	        		
	            	//objAjax.parameter().add("facetQuery", $("#facetQuery").attr("value"));
	        	}            
            }
            else
        	{      
            	//alert("reset");
            	for (i=0; i < len; i++)
	            {
            		if(spl[i] && spl[i].indexOf('DOCUMENT_TYPE:') >= 0)
            		{
            			objAjax.parameter().add("fq",spl[i]);
            			break;
            		}
	            }	 
            	
            	for (i=0; i < adlen; i++)
	            {
            		//alert("advSpl["+i+"]"  + advSpl[i]);
	            	objAjax.parameter().add("advfq",advSpl[i]);	
	            }          	
        	}
            
            //alert("call search at the end $('#frq') = " + $('#frq').attr("value"));
            
            //objHTMLData._mHasUserModifiedData = true;
            //objAjax.setProcessHandler(SearchEngJs._displaySolrSearchResults)
            //objHTMLData.performSaveChanges(SearchEngJs._displaySolrSearchResults, objAjax);
            objAjax.setProcessHandler(SearchEngJs._displaySolrSearchResults);
            objAjax.sendRequest();
            return;
         }
    },
    
    getSelectedDocument: function()
    {
    	//alert("here "+ $('input[name=selDocumentType]:checked'));
    	//alert("getSelectedDocument -> "+ $('input[name=selDocumentType]:checked').attr("value"));    	
    	return $('input[name=selDocumentType]:checked').attr("value");
    },
    
    setSelectedDocument: function(value)
    {
    	//alert("setSelectedDocument "+ value);
    	
    	if(value && value!='' && ($("#" + value)))
		{
    		$("#" + value).attr("checked", "checked");	
		}    	 
    	
    	//alert("setSelectedDocument -> "+ $('input[name=selDocumentType]:checked').attr("value"));
    },
    
    setFiltersOnReturn: function(val)
    {
    	var f = getElemnt('frq');
        if (!f)
       	{
	        $('#divAjaxReq').append(
	        		$('<input>').attr({
	                    type: 'hidden',
	                    name: 'frq',
	                    id:'frq',
	                    value: val
	                }));
    	}
		else
		{	$('#frq').attr("value",val);			
		}
    },
    
    setAdvFiltersOnReturn: function(val)
    {
    	var f = getElemnt('advfq');
        if (!f)
       	{
	        $('#divAjaxReq').append(
	        		$('<input>').attr({
	                    type: 'hidden',
	                    name: 'advfq',
	                    id:'advfq',
	                    value: val
	                }));
    	}
		else
		{	
			$('#advfq').attr("value",val);			
		}
        
        this.setValuesToSearchText(val);
    },
    
    setFQueriesOnReturn: function(val)
    {
    	var f = getElemnt('facetQuery');
        if (!f)
       	{
	        $('#divAjaxReq').append(
	        		$('<input>').attr({
	                    type: 'hidden',
	                    name: 'facetQuery',
	                    id:'facetQuery',
	                    value: val
	                }));
    	}
		else
		{	$('#facetQuery').attr("value",val);			
		}
    },
    
    setValuesToSearchText: function(val)
    {
    	var splt = val.split(this.delim);
    	if (splt)
    	{
	    	for (i = 0; i < splt.length; i++)
	    	{
    			var s = splt[i];
    			var slt = s.split("@@");
    			id = slt[0];
    	    	val = slt[3];
    	    	if (id)
    	    	{
	    	    	// Set the search value for this advanced search criterion field.
    	    		$("#" + id).attr("value", val);
    	    		
    	    		// Set the search operator for this advanced search criterion operator field.
    	    		$("#" + id + '_OPR').attr("value", slt[2]);
    	    	}
	    	}
    	}
    }
    ,
    
    _displaySolrSearchResults: function(objAjax)
    {
    	try
        {
            if(objAjax)
            {
                _displayProcessMessage(objAjax)
                var div=getElemnt(objAjax.getDivSectionId());
                if(div)
                {                	
                	registerHTML(div,objAjax);
                }
                alignWorkAreaContainer();
                if(nCurScrWidth > MinimumScrWidth)
                {
                   resetAllMainDivs();
                }
            }
        }
        catch(e)
        {
            alert(e.description);
        }
    },
    getAdvSearchSelection:function (e)
    {
    	var len = $('#advancedSearchDiv input[name^="crt-"]').length;
    	var ids='';
    	for (i=0; i<len; i++)
    	{
    		var ob = $('#advancedSearchDiv input[name^="crt-"]')[i];
    		if(ob.checked)
    		{
    			ids += ob.id +this.delim;
    		}
    	}
    	return ids;
    },
    prevPage: function () {
        var currentPage = $('#currentPage').attr("value") - 1;
        if (currentPage < 1) {
            currentPage = 1
        }
        $('#currentPage').attr("value", currentPage)
        this.callSearch(searchResultsId);        
    },

    nextPage: function () {
    	//alert($('#currentPage').attr("value"));
        var currentPage = $('#currentPage').attr("value") - 1 + 2;
        $('#currentPage').attr("value", currentPage);
        this.callSearch(searchResultsId);
    },

    showPage: function (pageNo) {
        $('#currentPage').attr("value", pageNo);
        this.callSearch(searchResultsId);
    },

    changePageSize: function () {
        $('#currentPage').attr("value", 1);
        this.callSearch(searchResultsId);
    },
    
    sortRecords: function () {
        $('#currentPage').attr("value", 1);
        this.callSearch(searchResultsId);
    },
    
    showAdvSearch: function () {
        $('#advancedSearchDiv').show();
    },

    hideAdvSearch: function () {
        $('#advancedSearchDiv').hide();
    },

    addAdvSearchFQ: function ()
    {    	
    	this.buildAdvSearchFilters();

    	$('#advancedSearchDiv').hide();
    	$('#currentPage').attr("value", 1);
    	this.resetMoreFacets();
        this.callSearch(searchResultsId);
    },
    
    buildAdvSearchFilters: function ()
    {
    	//alert("here");
        var filters;
        var fldNames = $('#advsrcIds');	
                
        if(fldNames && $('#advsrcIds').attr("value"))
    	{
        	fldNames = $('#advsrcIds').attr("value");
        	
        	fldNames = fldNames.split(",");
        	
        	if(fldNames && fldNames.length>1)
    		{
        		var cnt = fldNames.length;
        		
        		for(var i=1; i<cnt; i++)
    			{
        			var fldDtl = fldNames[i].split("--");
        			var filter = SearchEngJsExt.buildFldFilter(fldDtl[0], fldDtl[1], fldDtl[2] );
        			
        			this.addToAdvanceSearchValue(fldDtl[0], filter);
        			
                    if(isNotNull(filter) && filter.length > 0)
                    {                    	
                        if(isNotNull(filters) && filters.length > 0)
                        {
                            filters = filters + ' AND ' + filter;
                        }
                        else
                        {
                            filters = ' ( ' + filter;
                        }
                   }
    			}      
    		}
    	}
        
        //alert("done");        
        if(isNotNull(filters) && filters.length > 0)
        {
            filters = filters + ' ) ';
        }
        
        //alert("advance search filter " + $('#advfq').attr("value"));
        
        return filters;
    },
        
    
    addToAdvanceSearchValue:function (fieldName, filter) {		
                
        var f = getElemnt('advfq');
        if (!f)
       	{
	        $('#advancedSearchDiv').append(
	        		$('<input>').attr({
	                    type: 'hidden',
	                    name: 'advfq',
	                    id:'advfq',
	                    value: filter
	                }));	       
    	}
		else
		{	
			f = $('#advfq');
			var tval= f.val();
			var splt = tval.split(SearchEngJs.delim)
			var len = 0;
		    var cval = '';
		    var removed = false;
		    if(splt)
	    	{
		    	len = splt.length;
	    	}
		    	
		    for ( i=0;i<len;i++)
		    {
		    	//alert("splt["+i+"]" + splt[i] + " === " + fieldName);
		    	if(splt[i].toUpperCase().indexOf(fieldName.toUpperCase()) == -1)
		    	{
		    		if (i < len -1)
		    		{
		    			cval = cval+splt[i]+SearchEngJs.delim;
		    			//alert(cval);
		    		}else
		    		{
		    			cval = cval+splt[i];
		    		}
		    	}
		    }
		    
		    if(filter)
	    	{
		    	//alert("setting new filter" + filter);
		    	
		    	if(cval.length>0)
	    		{
		    		cval = cval + SearchEngJs.delim + filter;		
	    		}
		    	else
	    		{
		    		cval = filter;		
	    		}
		    	    	
	    	}	
		    //alert("setting adva value -> "  + cval);
		    f.attr("value",cval);	
		}
	},
    
    clearAdvSearchFQ: function(e)
    {
    	$("input[name='frq']").each(function()
        {
            if ($(this).attr("value").indexOf('ADV_SEARCH') == 0)
            {
            	$(this).remove();
            }
        });
    	$('#advancedSearchDiv input[type="text"]').val('');
    	$('#advancedSearchDiv .clsSelectNormal').val('16');	//blank value is 16
    }
    ,
    
    buildSearchFilter: function (name, opr, val, type, dataType)
    {
    	if( isNull(opr) || isNull(val) || (val.length <= 0) )
    	{
    		return;
    	}
    	if(isNull(opr))
    	{
    		opr = "LIKE";
    	}
    	if(isNull(type))
    	{
    		type = "12";
    	}
		return name + "@@" + dataType + "@@" + opr + "@@" + val;
    },

    buildIsNotNullQueryString: function (name)
    {
        return name + SEP + "[* TO *]";
    },

    buildIsNullQueryString: function (name)
    {
        return "*:* -" + SearchEngJs.buildIsNotNullQueryString(name);
    },

    buildEqualToQueryString: function (name, value)
    {
        return "(" +  name + ':\"' + value + '\"' + ")";
    },

    buildNotEqualToQueryString: function (name, value)
    {
        return "(-" +  name + ':\"' + value + '\"' + ")";
    },

    buildLikeQueryString: function (name, value)
    {
        return "(" +  name + ':\"' + value + '\"' + ")";
    },

    buildNotLikeQueryString: function (name, value)
    {
        return "(-" +  name + ':\"' + value + '\"' + ")";
    },

    buildGreaterOrEqualToQueryString: function (name, value)
    {
        return name + SEP + "[" + value + " TO *]";
    },

    buildLessOrEqualToQueryString: function (name, value)
    {
        return name + SEP + "[* TO " + value + "]";
    },
    
    search: function(e)
    {
    	 var key;      
         if(window.event) {
    		key = window.event.keyCode; //IE
    	 } else {
    		key = e.which;			//firefox      
    	 }
    	
    	if(key == 13)
    	{
    		SearchEngJs.searchDocuments(searchResultsId);
    	}
    },
    
    
    invokeAdvSearch: function(obj, e)
    {
    	 var key;      
         if(window.event) {
    		key = window.event.keyCode; //IE
    	 } else {
    		key = e.which;			//firefox      
    	 }
    	
    	if(key == 13)
    	{ 
    		uppercase(obj);
    		SearchEngJs.addAdvSearchFQ();
    	}
    }    
};

function uppercase(obj) {
    $(obj).val($(obj).val().toUpperCase());
}

function _selectAll(obj)
{
	$('#advancedSearchDiv input[type="checkbox"]').attr('checked',  obj.checked);	
} 

$(function() {
	$('.navigators h3').bind('click', function (e) {
		var $this = $(this);
		$this.next().toggleClass('hide');
		$this.find("span").toggleClass("ui-icon-triangle-1-s").toggleClass("ui-icon-triangle-1-e");
	});

	var  $lastHighlightRow,
		 $highlightTable = $('.rowHighlightTable'),
		 highlightTableTbody = $highlightTable.children()[0];
	
	$highlightTable.mouseover(function (e) {
		var target = e.target,
			$target = $(target),
			tagName = target.tagName;

		if (target !== this && target !== highlightTableTbody)
		{
			var $currentHighlightRow = $target.closest('tr.highlightRow');
			if ($currentHighlightRow.hasClass('noHighlight'))
			{
				return;
			}
			if ($lastHighlightRow)
			{
				if ($lastHighlightRow[0] !== $currentHighlightRow[0])
				{
					$lastHighlightRow.toggleClass('highlight');
					$currentHighlightRow.toggleClass('highlight');
				}
			}
			else
			{
				$currentHighlightRow.toggleClass('highlight');
			}
			
			$lastHighlightRow = $currentHighlightRow;
		}
	})
	.mouseleave(function (e) {
		if ($lastHighlightRow)
		{
			$lastHighlightRow.toggleClass('highlight');
			$lastHighlightRow = null;
		}
		
	});
});
//When the user clicks on the POM link
function _gsnavigate(keyInfo,process,id, corename)
{
	var objAjax = new htmlAjax();
	id = (id == null)?"":id;	
	corename = (corename==null)?"TECHSPEC":corename;	
	if(objAjax)
	{
		var url = "navigate&keyInfo="+keyInfo+"&docName="+corename+"&compId="+id
		objAjax.setActionURL("generalsearch.do");
	    objAjax.setActionMethod(url);
	    objAjax.setProcessHandler(process);
	    objAjax.sendRequest();
	    return;
	 }
}

function _showGSTechOverview(objAjax)
{
	showProductOverview();	
}

function _showGSPO(objAjax)
{	
	showOverview("purchaseorder.do");
}

function _showGSParty(objAjax)
{
	showOverview("plmparty.do");
}

function _showGSPartyDOCS(objAjax)
{
	showPLMAssoc(212,0,"plmdocsnconds.do");	
}

function _showGDPartyNotes(objAjax)
{
	showPLMAssoc(212,0,'plmnotes.do');	
}

function _showGDPartyCompetencies(objAjax)
{
	alert('WIP');
}

function _showGDPartyCapabilites(objAjax)
{
	alert('WIP');
}

function _showGDPartyChargebacks(objAjax)
{
	showPLMAssoc(212,0,'plmchargeback.do');	
}

function _showGSPOM(objAjax)
{
	showPOM();
}

function _showGSBOM(objAjax)
{
	showBillOfMaterials();
}

function _showComments(objAjax)
{
	_techSpecMainPopUp();
}

function _showChanges(objAjax)
{
	var keyInfo = objAjax.getResponseHeader("keyInfo");
	var compId = objAjax.getResponseHeader("compId");	
	_showSmartTagView(compId,null,1600,1600,true,keyInfo,"");	
}
