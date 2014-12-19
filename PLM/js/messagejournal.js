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

/** Group all functions related to CommentsJsModule */
var MessageJournalJsModule = function () {
	// Private variables
	var $messageDetails,
		$messageDetailsDiv,
		dataDiv,
		titleDiv,
		$selectedRow,
		scrollbarWidth = 0,
		messageCache = {},
		currentMessageId,
		numberStoredMessages = 0,
		maxNumberStoredMessages = 50, // Somewhat arbitrary max cache size
		viewedMessage = false;
	
	// Private methods
    
    // Adjusts title table's rightmost cell's width depending on
    // if data div has vertical scrollbar.
    var handleScrollbar = function () {
    	if (hasScrollbar(dataDiv, 'vertical'))
    	{
    		var $rightMostCell = $('#T2');
    		$rightMostCell.width($rightMostCell.width() + calcScrollbarWidth());
    	}
    };
    
	// Copied & pasted from hasScrollbar function, since it was private.
    // TODO refactor so there is only one copy of this function.
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
	
	
	// Code to be run immediately, as soon as DOM is loaded.
	$(function () {
		$messageDetails = $("#messageDetails");
		$messageDetailsDiv = $('#messageDetailsDiv');
		dataDiv = getElemnt('DATA_DIV');
		titleDiv = getElemnt('TITLE_DIV');
		// check if dataDiv present. If no dataDiv, there are no messages to display; no need to do anything.
		if (dataDiv !== null)
		{
			handleDataAndMessageDivHeight(); // runs for IE only.
			handleScrollbar();
		}
		
		$('#DATA_TABLE').mouseover(function (e) {
			var $target = $(e.target);
			if (e.target.tagName === 'DIV' && $target.hasClass('detailsLink'))
			{
				if ($selectedRow !== undefined)
				{
					$selectedRow.css('backgroundColor','#ffffff');
				}
				
				$selectedRow = $target.closest('tr');
				$selectedRow.css('backgroundColor','#F4EDAD');
			}
		});
	});

	// Public methods
	
	// IE only - Adjust the height of data div and message details div.
	var handleDataAndMessageDivHeight = function (TSSMSG) {
		if (IE)
		{
			var $lockDiv = $('#LOCK'),
				lockDivHeight = $lockDiv.height(),
				titleDivHeight = 24,
				marginTop = 24,
				TSSMSGHeight = 0;
			
			if (TSSMSG && TSSMSG.style.visibility !== 'hidden')
			{
				TSSMSGHeight = $(TSSMSG).height();
			}
			
			$(dataDiv).height(lockDivHeight - marginTop - TSSMSGHeight);
			$messageDetailsDiv.height(lockDivHeight - marginTop - TSSMSGHeight);
		}
	};
	
	return {
    	showAlertMessageDetails : function (messageId) {
        	// Change styling when message is viewed
    		if (viewedMessage === false)
    		{
    			viewedMessage = true;
    			$messageDetailsDiv[0].style.border = '1px solid black';
    			$messageDetails[0].style.padding = '5px';
    		}
    		
    		var cachedMessage = messageCache[messageId]; 
    		if (cachedMessage !== undefined) // in cache, show message.
        	{
        		$messageDetails.html(cachedMessage);
        	}
        	else // not in cache, make Ajax request.
        	{
        		currentMessageId = messageId;
        		
        		var objAjax = new htmlAjax();
	        	objAjax.setActionURL("messagejournal.do");
	        	objAjax.setActionMethod("showdetails");
	        	objAjax.setProcessHandler("MessageJournalJsModule.handleShowMessageResonse");
	        	objAjax.parameter().add("message_id", messageId);
	        	objAjax.sendRequest();
        	}
        },
        
    	handleShowMessageResonse : function (objAjax) {
    		if(objAjax)
    		{
    			if(objAjax.isProcessComplete())
    			{
    				//var messageId = objAjax.parameter().getParameterByName("message_id");
    				var message = objAjax.getResult();
    				$messageDetails.html(message);
    				$messageDetails.show();
    				if (numberStoredMessages < maxNumberStoredMessages)
    				{
    					messageCache[currentMessageId] = message;
    					numberStoredMessages ++;
    				}
    			}
    			objAjax = null;
    		}
        },
        
        handleDataAndMessageDivHeight : handleDataAndMessageDivHeight
	}
}();

// Overwriting from comfunc.
// close the msg - and move the main div 'LOCK' up
function closemsg()
{
	var TSSMSG = getElemnt('TSSMSG');
	var nmsgHgt = TSSMSG.offsetHeight;
	var obj = getElemnt('LOCK');
	obj.style.top = parseInt(obj.style.top) - nmsgHgt - 2+"px";
	setHeight(obj, parseInt(obj.offsetHeight + nmsgHgt + 2))
	bMsgExists = false;
	hide('TSSMSG');
	resetChgFldsOnMsgClose = true;
	if (nTotalLvl > 0)
	{
		expandtl();
	}
	
	MessageJournalJsModule.handleDataAndMessageDivHeight(TSSMSG);
}
