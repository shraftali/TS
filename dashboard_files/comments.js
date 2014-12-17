/*************************************/
/*  Copyright  (C)  2002 - 2011      */
/*           by                      */
/*  TradeStone Software, Inc.        */
/*  Gloucester, MA. 01930            */
/*  All Rights Reserved              */
/*  Printed in U.S.A.                */
/*  Confidential, Unpublished        */
/*  Property of                      */
/*  TradeStone Software, Inc.        */
/*************************************/
if (!TRADESTONE)
{
    var TRADESTONE = new Object();
}

var commentsDialog;
var newCommentsDiv;

TRADESTONE.Comments = function(_commentTitle, _commentHTML)
{
	var commentTitle = _commentTitle;
	var commentHTML = _commentHTML;
	this.show = function()
	{
		var commentsDiv = document.createElement('div');

   		$(commentsDiv).attr("id", "Comment");

   		commentsDialog = $(commentsDiv).dialog({
   			title: commentTitle,
            height: 600,
			width : 1060,
			zIndex: 900,
			modal : true,
			close : function(event, ui) {						
   						if(newCommentsDiv) {
   							newCommentsDiv.dialog("close");
   						}

            			$(this).html('');
            			$(this).dialog('destroy');
            			$(this).remove();
        			}
   		});

   		var titleBar = $(".ui-dialog-titlebar a.ui-dialog-titlebar-close");
    	titleBar.removeClass("ui-corner-all");
   		titleBar.find(".ui-icon").html("<img src='images/close_top.gif' border='0'/>").removeClass();

   		commentsDialog.html(commentHTML);

	    $('#nav').collapsible({xoffset:'-12',yoffset:'10', imagehide: 'images/arrowdown.gif', imageshow: 'images/Rarrow.gif', defaulthide: false});

	    CommentsJsModule.styleActiveRecent();
		CommentsJsModule.styleThreadedFlat();

		// Attache enter event.
		$('#commentsSearch').keyup(function(e) {
			if(e.keyCode == 13) {
				CommentsJsModule.commentsSearch();
			}
		});
	};
	//Tracker#:23067  FDD 374 FR2,3 AND 6 -> GLOBAL SEARCH - PARTY : ADD PARTY AS PART OF GLOBAL SEARCH
	// exposed close function to invoke from rfq supplier recommendation popup after post process executes.
	this.close = function() {
		if(newCommentsDiv) {
				newCommentsDiv.dialog("close");
			}
		
		if(commentsDialog) {
			commentsDialog.html('');
			commentsDialog.dialog('destroy');
			commentsDialog.remove();
		}
	}
}

/** Group all functions related to CommentsJsModule */
var CommentsJsModule = {

  printComment: function (divName){
				w=window.open();
				w.document.write($('#' + divName).html());
				$(w.document).ready(function() {
					$('tr', w.document).each(function(){
						$(this).css("background-color", "rgb(255, 255, 255)");
						$(this).removeAttr("onmouseover");
						$(this).removeAttr("onmouseout");
					});

					$('a', w.document).each(function(){
							$(this).removeAttr("onclick");
							$(this).removeAttr("href");

							if($(this).attr('class') == 'jcollapsible')
							{
								$(this).remove();
							}
					});
    				});

				w.print();
			},

  newComment: function(){
		objAjax = new htmlAjax();
		objAjax.setActionURL("threadedcomments.do");
		objAjax.setActionMethod("newtopic");
		objAjax.setProcessHandler("CommentsJsModule.newCommentResponse");
		objAjax.parameter().add("commentViewId", $('#commentViewId').attr('value'));

		CommentsJsModule.cWaitWindow();

		objAjax.sendRequest();
	},

  newCommentResponse: function()
	{
	   if(objAjax)
		{
		   //Tracker#:23272 - THREADED MESSAGING AND CHANGE TRACKING ON SALES ORDER SCREEN
		   //checking for identifier for small window set in response header or not
		   var smlWndw = objAjax.getResponseHeader("sml_wndow");
		   if(objAjax.isProcessComplete())
			{
				msgInfo = objAjax.getAllProcessMessages();

		    	if(msgInfo!="")
		    	{
		       		//_displayUserMessage(msgInfo);
		        	_displayProcessMessage(objAjax);
		    	}
		    	else
		    	{

					var newDiv = document.createElement('div');

					newCommentsDiv = $(newDiv).dialog({
						id : "newcomment",
						title : "Create New Comment",
						height: ("Y" == smlWndw)? 300 : 540,
						width:  400,
						zIndex: 901,
						close: function(event, ui) {
		   					$(this).html('');
		            		$(this).dialog('destroy');
		            		$(this).remove();
		  				}
					});

					newCommentsDiv.addClass('divclssection');

					var titleBar = $(".ui-dialog-titlebar a.ui-dialog-titlebar-close");
		    		titleBar.removeClass("ui-corner-all");
		   			titleBar.find(".ui-icon").html("<img src='images/close_top.gif' border='0'/>").removeClass();

					newCommentsDiv.html(objAjax.getResult());

					if($("#moreActors1").length > 0) {
						for(var i=1; i<=3;++i)
						{
							var autoSugg = new VALIDATION.Suggest("AutoSuggest", document.getElementById("moreActors" + i), "_autoSuggest", "12",
											   'validationsuggest.do?valId=1339&codeFldName=moreActors' + i + '&showDesc=N&search=', null);

							autoSugg.setDisplayDivMessage(true);
						}
					}
				}
			}

			CommentsJsModule.closeCWaitWindow();
			objAjax = null;
		}
	},

	replyComment: function (divId)
	{
		var replyDiv = $('#'+ divId);

		if(replyDiv.html() == '')
		{
			replyDiv.css('display', 'block');
			//replyDiv.css('background-color', 'rgb(237, 239, 244)');
			replyDiv.append("<table> <tr> <td> <textarea rows=\"3\" cols=\"100\" id=\"T" + divId + "\" onkeyup=\"textareaCtrl(this, '4000');\"></textarea> </td> <td valign=\"top\"> <img src=\"images/clearsearch.gif\" border=\"0\" onclick=\"CommentsJsModule.closeReplyComment('" + divId + "');\" onmouseout=\"CommentsJsModule.toggleImage(this);\" onmouseover=\"CommentsJsModule.toggleImage(this);\"></td> </tr>" +
							"<tr> <td align=\"right\"><font color=\"#999999\"><font color=\"#999999\"><span id=\"T" + divId + "TxtCnt\"></span></font></td></tr>" +
							"<tr> <td align=\"right\"> " +
	                        "<table id=\"Comment\" name=\"Comment\" style=\" width:30;\" title=\"Comment\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" align=\"null\" onclick=\"CommentsJsModule.postReplyComment('" + divId + "');\">" +
	                        "<tbody><tr align=\"center\" valign=\"middle\" onmouseout=\"_setButtonStyle(this,\'mouseOut\',\'Comment\');\" onmouseover=\"_setButtonStyle(this,\'mouseOver\',\'Comment\');\">" +
	                        "<td id=\"CommentbtnLft\" name=\"CommentbtnLft\" class=\"clsLeftcornerButton\" nowrap=\"nowrap\" classname=\"clsLeftcornerButton\">&nbsp;&nbsp;</td>" +
	                        "<td id=\"CommentbtnCtr\" name=\"CommentbtnCtr\" class=\"clsCenterButton\" align=\"center\" valign=\"top\" nowrap=\"nowrap\" classname=\"clsCenterButton\">" +
	                        "<label class=\"clsTextLabelNormalVTop\" style=\"cursor: pointer; \" title=\"Comment\" onmouseout=\"_clearMousePointer(this);\" onmouseover=\"_setHandMousePointer(this);\">" +
	                        "&nbsp;&nbsp;Post&nbsp;&nbsp;</label></td><td id=\"CommentbtnRt\" name=\"CommentbtnRt\" class=\"clsRightButton\" nowrap=\"nowrap\" classname=\"clsRightButton\">&nbsp;&nbsp;</td>" +
	                        "<td class=\"clsToolBarButtonRightPadding\"></td></tr></tbody></table>" +
	                        "</td> <td> </td> </tr> </table>");
	       $("#" + "T" + divId).focus();
		}
	},


	closeReplyComment: function(replyDivId)
	{
		var replyDiv = $('#'+ replyDivId);
		replyDiv.css('display', 'none');
		replyDiv.html('');

		var parentComment = replyDivId.split('_');
		$('#TR'+ parentComment[0]).css("background-color", "rgb(255, 255, 255)");
	},

	postNewComment: function()
	{
		objAjax = new htmlAjax();

		var msg = '';
		var categoryVal = $('#newCategorySelector').attr('value');
		if(categoryVal == 'selectReset')
		{
			msg = 'Category,';
		}

		var subject = $('#subject').attr('value');
		if(subject == '')
		{
			msg = msg + 'Subject,';
		}

		var commentTxt = $('#commentText').attr('value');
		if(commentTxt == '')
		{
			msg = msg + 'Comment,';
		}

		if(msg != '')
		{
			msg = msg.substring(0, msg.length - 1)
			var htmlErrors = objAjax.error();
			htmlErrors.addError("errorInfo", 'Please provide values for the following field(s) ' + msg, true);
		   	messagingDiv(htmlErrors);
		   	return;
		}

		var actorsVal = [];
	    $("input[name='actors']:checked").each(function(i){
	      actorsVal[i] = $(this).val();
	    });

	    var moreActors = '';
	    var moreActorCount = parseInt($("#moreActorCount").attr("value"));

	    for(var i=1; i<=moreActorCount; i++)
	    {
	    	var moreActor = $('#moreActors' + i);
	    	if(moreActor && moreActor.val() != null && moreActor.val() != 'undefined' && moreActor.val() != '')
	    	{
	    		moreActors += moreActor.val().toUpperCase() + ',';
	    	}
	    }

		objAjax.setActionURL("threadedcomments.do");
		objAjax.setActionMethod("savetopic");
		objAjax.setProcessHandler("CommentsJsModule.postNewCommentResponse");
		objAjax.parameter().add("commentViewId", $('#commentViewId').attr('value'));
		objAjax.parameter().add("category", categoryVal);
		objAjax.parameter().add("subject", htmlEscape(subject));
		objAjax.parameter().add("commentText", htmlEscape(commentTxt));
		objAjax.parameter().add("actors", actorsVal);
		objAjax.parameter().add("moreActors", moreActors);

		CommentsJsModule.cWaitWindow();

		objAjax.sendRequest();
	},

	postNewCommentResponse: function()
	{
		if(objAjax)
		{
			if(objAjax.isProcessComplete())
			{
				msgInfo = objAjax.getAllProcessMessages();

		    	if(msgInfo!="")
		    	{
		       		//_displayUserMessage(msgInfo);
		        	_displayProcessMessage(objAjax);
		    	}
		    	else
		    	{
					$('#discuss_section').html(objAjax.getResult());

					$('#nav').collapsible({xoffset:'-12',yoffset:'10', imagehide: 'images/arrowdown.gif', imageshow: 'images/Rarrow.gif', defaulthide: false});

					newCommentsDiv.dialog("close");

					// Reset category and search fields.
					$('#categorySelector').val('');
					$('#commentsSearch').val('');

					$('#mostActive').val(false);
					CommentsJsModule.styleActiveRecent();

					$('#threaded').val(true);
					CommentsJsModule.styleThreadedFlat();

					var htmlErrors = objAjax.error();
					htmlErrors.addError("successInfo", "Saved Successfully", false);
			   		messagingDiv(htmlErrors);
		    	}
			}
			CommentsJsModule.closeCWaitWindow();
			objAjax = null;
		}
	},

	postReplyComment: function(divId)
	{
		objAjax = new htmlAjax();

		var commentTxt = $('#T'+divId).attr('value');
		if(commentTxt == '')
		{
			var htmlErrors = objAjax.error();
			htmlErrors.addError("errorInfo", 'Please provide value for the Reply comment.', true);
		   	messagingDiv(htmlErrors);
		   	return;
		}

		var parentComment = divId.split('_');
		var categoryName = $('#categorySelector').attr('value');

		objAjax.setActionURL("threadedcomments.do");
		objAjax.setActionMethod("saveReplytopic");
		objAjax.setProcessHandler("CommentsJsModule.postReplyCommentResponse");
		objAjax.parameter().add("commentViewId", $('#commentViewId').attr('value'));
		objAjax.parameter().add("commentText", htmlEscape(commentTxt));
		if(categoryName != 'selectReset')
		{
			objAjax.parameter().add("categoryName", categoryName);
		}
		objAjax.parameter().add("refCommentId", parentComment[0]);
		objAjax.parameter().add("baseCommentId", parentComment[1]);

		CommentsJsModule.cWaitWindow();

		objAjax.sendRequest();
	},

	postReplyCommentResponse: function()
	{
		if(objAjax)
		{
			if(objAjax.isProcessComplete())
			{
				msgInfo = objAjax.getAllProcessMessages();

		    	if(msgInfo!="")
		    	{
		       		//_displayUserMessage(msgInfo);
		        	_displayProcessMessage(objAjax);
		    	}
		    	else
		    	{
					$('#discuss_section').html(objAjax.getResult());
					$('#nav').collapsible({xoffset:'-12',yoffset:'10', imagehide: 'images/arrowdown.gif', imageshow: 'images/Rarrow.gif', defaulthide: false});

					$('#mostActive').val(false);
					CommentsJsModule.styleActiveRecent();

					$('#threaded').val(true);
					CommentsJsModule.styleThreadedFlat();

					var htmlErrors = objAjax.error();
					htmlErrors.addError("successInfo", "Saved Successfully", false);
			   		messagingDiv(htmlErrors);
		    	}
			}
			CommentsJsModule.closeCWaitWindow();
			objAjax = null;
		}
	},


	reset: function()
	{
		$('#categorySelector').val('');
		$('#commentsSearch').val('');

		CommentsJsModule.commentsSearch();
	},

	mostActive: function()
	{
		var mostActive = $('#mostActive').val();
		if(mostActive == 'true') {
			return;
		}
		CommentsJsModule.toggleActiveRecent()
	},

	mostRecent: function()
	{
		var mostActive = $('#mostActive').val();
		if(mostActive == 'false') {
			return;
		}
		CommentsJsModule.toggleActiveRecent()
	},


	toggleActiveRecent: function()
	{

		var mostActive = $('#mostActive').val();
		if(mostActive == 'true') {
			mostActive = 'false';
		}
		else {
			mostActive = 'true';
		}

		$('#mostActive').val(mostActive)

		CommentsJsModule.commentsSearch();
	},

	styleActiveRecent: function()
	{
		var mostActive = $('#mostActive').val();
		if(mostActive == 'true') {
			$('#mostActiveBtn').removeClass().addClass('fc-tss-button-faded');
			$('#mostRecentBtn').removeClass().addClass('fc-tss-button');
		}
		else {
			$('#mostActiveBtn').removeClass().addClass('fc-tss-button');
			$('#mostRecentBtn').removeClass().addClass('fc-tss-button-faded');
		}
	},

	viewFlat: function () {
		var threaded = $('#threaded').val();
		if(threaded == 'false') {
			return;
		}
		CommentsJsModule.toggleFlatThreaded()
	},

	viewThreaded: function() {

		var threaded = $('#threaded').val();
		if(threaded == 'true') {
			return;
		}
		CommentsJsModule.toggleFlatThreaded()
	},

	toggleFlatThreaded: function ()
	{
		var threaded = $('#threaded').val();
		if(threaded == 'true') {
			threaded = 'false';
		}
		else {
			threaded = 'true';
		}

		$('#threaded').val(threaded)

		CommentsJsModule.commentsSearch();
	},

	styleThreadedFlat: function ()
	{
		var threaded = $('#threaded').val();
		if(threaded == 'true') {
			$('#threadedBtn').removeClass().addClass('fc-tss-button-faded');
			$('#flatBtn').removeClass().addClass('fc-tss-button');
		}
		else {
			$('#threadedBtn').removeClass().addClass('fc-tss-button');
			$('#flatBtn').removeClass().addClass('fc-tss-button-faded');
		}
	},

	commentsSearch: function ()
	{
		objAjax = new htmlAjax();

		objAjax.parameter().add("mostActive", $('#mostActive').val());
		objAjax.parameter().add("threaded", $('#threaded').val());
		objAjax.parameter().add("categoryName", $('#categorySelector').val());
		objAjax.parameter().add("searchString", $('#commentsSearch').val());

		CommentsJsModule.viewComment(objAjax);
	},

	showRecipients: function (docViewId, commentId)
	{

		objAjax = new htmlAjax();
		objAjax.parameter().add("commentViewId", docViewId);
		objAjax.parameter().add("commentId", commentId);
		objAjax.setActionURL("threadedcomments.do");
		objAjax.setActionMethod("showRecipients");
		objAjax.setProcessHandler("CommentsJsModule.viewRecipientsResponse");
		objAjax.parameter().add("commentViewId", $('#commentViewId').attr('value'));
		objAjax.sendRequest();
	},

	viewRecipientsResponse: function (objAjax)
	{
		if(objAjax.isProcessComplete())
		{
			msgInfo = objAjax.getAllProcessMessages();

	    	if(msgInfo!="")
	    	{
	       		//_displayUserMessage(msgInfo);
	        	_displayProcessMessage(objAjax);
	    	}
	    	else
	    	{
				var commentId = objAjax.parameter().getParameterByName("commentId");
				var recipientDiv = $('#recipients'+ commentId);
				if(recipientDiv.html() == '')
				{
					recipientDiv.css('display', 'block');
					//replyDiv.css('background-color', 'rgb(237, 239, 244)');
					recipientDiv.append("<table> <tr> <td> </td> <td valign=\"top\"><small> Recipients: " + objAjax.getResult() +
							" <img src=\"images/clearsearch.gif\" border=\"0\" " +
							" onclick=\"CommentsJsModule.closeReplyComment('recipients" + commentId + "');\" onmouseout=\"CommentsJsModule.toggleImage(this);\" onmouseover=\"CommentsJsModule.toggleImage(this);\">" +
							" </small></td> </tr> </table>");
				}
	    	}
		}
	},


	viewComment: function (objAjax)
	{
		objAjax.setActionURL("threadedcomments.do");
		objAjax.setActionMethod("refreshComments");
		objAjax.setProcessHandler("CommentsJsModule.viewCommentsResponse");
		objAjax.parameter().add("commentViewId", $('#commentViewId').attr('value'));

		CommentsJsModule.cWaitWindow();

		objAjax.sendRequest();
	},

	viewCommentsResponse: function()
	{
		if(objAjax)
		{
			if(objAjax.isProcessComplete())
			{
				msgInfo = objAjax.getAllProcessMessages();

		    	if(msgInfo!="")
		    	{
		       		//_displayUserMessage(msgInfo);
		        	_displayProcessMessage(objAjax);
		    	}
		    	else
		    	{
					$('#discuss_section').html('');
					$('#discuss_section').html(objAjax.getResult());

					$('#nav').collapsible({xoffset:'-12',yoffset:'10', imagehide: 'images/arrowdown.gif', imageshow: 'images/Rarrow.gif', defaulthide: false});
		    	}
			}
			CommentsJsModule.closeCWaitWindow();
			CommentsJsModule.styleActiveRecent();
			CommentsJsModule.styleThreadedFlat();
			objAjax = null;
		}
	},

	toggleImage: function(image)
	{
		if(image)
		{
			var imgIndex = image.src.lastIndexOf('/');
	  		var imgSource = image.src.substr(imgIndex);
	  		if (imgSource == '/clearsearch.gif')
	  		{
	    		image.src = 'images/close.gif';
	  		}
	  		else if (imgSource == '/close.gif')
	  		{
	    		image.src = 'images/clearsearch.gif';
	  		}
		}
	},

	populateUser: function(objId)
	{
	    var searchControl = new VALIDATION.SearchControl(null, true, null,
	                        'validationsearch.do?valId=1339&codeFldName='+ objId +'&showDesc=Y&sectionId=-1&rowNo=-1&actRowNo=-1');

	    searchControl.showPopup();
	},

	// wait window once user submit the page
	cWaitWindow: function()
	{
		var winW = document.body.clientWidth;
		var winH = document.body.clientHeight;
		/*
		 * Tracker#:20060 process bar is needed while opening multi pom windows.
		 * Adding scrollTop to processing bar top calculation so that if user scrolls down window,
		 * so that processing bar would be visible.
		 */
		var winScrlTop = document.body.scrollTop;
		var waitW = new processingWindow();
		document.body.appendChild(waitW);
		$('#proc').css("zIndex", 1000);
	    waitW.style.top = parseInt(winH/2)+winScrlTop - (waitW.offsetHeight/2)+"px";
	    waitW.style.left = parseInt(winW/2) - (waitW.offsetWidth/2)+"px";
	},

	// Closes the wait window.
	closeCWaitWindow: function()
	{
	    var waitW = getElemnt("proc");
	    if (waitW)
		{
			var parentNode = waitW.parentNode;
			parentNode.removeChild(waitW);
		    //eval('document.'+FRM+'.removeChild(waitW)');
		}
	},

	rwUnClr: function(obj)
	{
    	if(obj)
    	{
    		$(obj).css("background-color", "rgb(252, 253, 253)");
    	}
	},

	rwClr: function(obj)
	{
		if(obj)
	    {
			$(obj).css("background-color", "#F4EDAD");
	    }
	},

	addMoreEmails: function()
	{
		var moreActorCount = parseInt($('#moreActorCount').val()) + 1;
		$("#moreActorTable").append("<tr><td colspan=\"2\"><input type=\"text\" id=\"moreActors"+  moreActorCount +"\" name=\"moreActors"+ moreActorCount +"\" size=\"30\" value=\"\" tabindex=\""+ (moreActorCount+3) +"\" />" +
					"<a href=\"#\" onclick=\"CommentsJsModule.populateUser('moreActors"+ moreActorCount +"');\">" +
					"<img src=\"images/valsearch.gif\" border=\"0\" /></a></td> </tr>");
		$('#moreActorCount').attr("value",moreActorCount );
		var autoSugg = new VALIDATION.Suggest("AutoSuggest", document.getElementById("moreActors" + moreActorCount), "_autoSuggest", "12",
				   'validationsuggest.do?valId=1339&codeFldName=moreActors' + moreActorCount + '&showDesc=N&search=', null);

		autoSugg.setDisplayDivMessage(true);

	}
};
