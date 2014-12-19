/*************************************/
/*  Copyright  (C)  2002 - 2015      */
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
/** Show Hide action handler    **/
/*************************************/
var showhidechannels = (function(){
    var showHideDialog;
    var jsonChannelData;
    var sellChannels = [];
    var selectedChannels = [];
    var isModified = false;
    var justClose = false;
    var isSelected = false;

    var initDiv = function (){
        var channelsDialog = document.createElement("DIV");
        channelsDialog.id = "channelsdialog";
        document.body.appendChild(channelsDialog);
        isModified = false;
    }

    var getChannels = function(objAjax){

        if (objAjax)
        {
            var errors = objAjax.error();
            if (errors.hasErrorOccured())
            {
                new messagingDiv(errors);
            }
            else
            {
                initDiv();
                jsonChannelData = objAjax.getHTMLResult();
                var selectedChannelsStr = objAjax.getResponseHeader("selectedChannels");
                selectedChannels =  (((selectedChannelsStr == null) || (selectedChannelsStr == "")) ?
                                                [] : selectedChannelsStr.split(","));
                isSelected = (selectedChannels && selectedChannels.length == 0 ? false : true);
                
                if (jsonChannelData != null && jsonChannelData.length > 0)
                {
                    jsonChannelData = eval('(' + jsonChannelData + ')');
                    sellChannels = jsonChannelData.sellchannels;

                    if (sellChannels.length == 0)
                    {
                        var warning = new htmlAjax().error();
                        warning.addWarning("No Channels found");
                        new messagingDiv(warning);
                        return;
                    }
                    displayChannels();
                }
            }
        }
    }

    var displayChannels = function()
    {
        var channelsDialog = $('#channelsdialog');
        var dialogTitle = $('<table></table>').attr({id: "titleTable", "cellspacing":"0", "cellpadding":"0"}).css("width","100%");
        var titleTr = $('<tr></tr>');

        dialogTitle.append(titleTr);
        titleTr.append($("<td></td>").attr({align: "left"})
               .append($("<div></div>").attr({class: "clsclrentertitle"}).text("Select Channel(s) to Display")));
        titleTr.append($("<td></td>").attr({align: "right"})
                .append("<img id='x-close' src='images/x-close.gif' border='0'/>")
                );
        channelsDialog.append(dialogTitle);

        var channelTypeTable = $('<table></table>').attr({id: "channelTypeTable"}).css({'background-color':'#DAE1E8', 'width':'100%'});
        var sellChannelCount = 0;
        var channelTypes = [];
         $(sellChannels).each(function (index, value) {
                if ($.inArray(value.CHANNEL_TYPE, channelTypes)==-1) {
                    channelTypes.push(value.CHANNEL_TYPE);
                }
         });

        var tr = $('<tr></tr>').css('background-color', '#DAE1E8');

        channelTypeTable.append(tr);
        tr.append($('<td></td>').attr({nowrap:'nowrap'}).append($('<label>').attr(
        {
            class: 'clsTextLabelNormal'
        }).text("Show:")));

        tr.append($('<td></td>').attr({nowrap:'nowrap'}).append($('<input>').attr(
                    {
                        type: 'checkbox',
                        name: 'chkChannelType'+ sellChannelCount,
                        value: "All",
                        id:    "All"
                    })
                    ).append($('<label>').attr(
                    {
                        class: 'clsTextLabelNormal',
                        'for': 'chkChannelType' + sellChannelCount++
                    }).text("All")));
        var channelTypesCnt = 0;
        var newTr = tr;
        $(channelTypes).each(function (index, channelType){
                if(channelTypesCnt > 1)
                {

                    newTr = $('<tr></tr>').css('background-color', '#DAE1E8');
                    newTr.append($('<td></td>').attr({nowrap:'nowrap'}).html("&nbsp;"));
                    newTr.append($('<td></td>').attr({nowrap:'nowrap'}).html("&nbsp;"));
                    channelTypeTable.append(newTr);
                    channelTypesCnt = 0;
                }
                channelTypesCnt++;
                newTr.append($('<td></td>').attr({nowrap:'nowrap'}).append($('<input>').attr(
                    {
                        type: 'checkbox',
                        name: 'chkChannelType'+ sellChannelCount,
                        value: channelType,
                        class: 'btntypeclass',
                        id:    channelType
                    })
                    ).append($('<label>').attr(
                    {
                        class: 'clsTextLabelNormal',
                        'for': 'chkChannelType' + sellChannelCount++
                    }).text(channelType)));


            }
        );
        channelsDialog.append(channelTypeTable);
        var channelsTable = $('<table></table>').attr({id: "channelsTable"}).css('width','100%');
        sellChannelCount = 0;
        $(sellChannels).each(function () {

                channelsTable.append($('<tr></tr>').append($('<td></td>').attr({nowrap: 'nowrap'}).append($('<input>').attr(
                    {
                        type: 'checkbox',
                        name: 'chkSellChannel'+ sellChannelCount,
                        value: this.SELLING_CHANNEL,
                        id:    'chkSellChannel' + sellChannelCount,
                        class: 'btnclass',
                        'data-channeltype': this.CHANNEL_TYPE
                    })
                        .data('channeltype',this.CHANNEL_TYPE)
                    ).append($('<label>').attr(
                    {
                        class: 'clsTextLabelNormal',
                        'for': 'chkSellChannel' + sellChannelCount++
                    }).text(this.SELLING_CHANNEL))));
            });

        channelsDialog.append(channelsTable);

        // Add the footer div....
        var footer = document.createElement("DIV");
        footer.id = "footerDiv";
        footer = $(footer);

        footer.attr({
              'class':'clssection'
        }).css({
                'margin-top': '5px',
                'height': '15%',
                'width':'95%'
            }
        )

        var footerTable = $("<table></table>").attr(
            {
                    'id' : 'footerTable',
                    'cellspacing':0,
                    'cellpadding':0
            }
        )
        var footerTR = $('<tr></tr>');
        footerTable.append(footerTR);
        footerTR.append($("<td></td>").css({
                width:'50%'
        }));
        footerTR.append($("<td></td>").attr({
                'align':'center',
                text: '&nbsp;&nbsp;&nbsp;'
        }).append($('<input>').attr({
                type: 'button',
                class:'clsbtnbottom',
                id: 'btnsave',
                value: 'Update'
        })));
        footerTR.append($("<td></td>").css({
                width:'10%'
        }));
        footerTR.append($("<td></td>").css({
                'font-family':'Verdana'
        }).append($('<a>').attr({
                href: '#',
                id: 'cancel'
                //text: 'Cancel'
        }).text("Cancel")));

        footer.append(footerTable);
        channelsDialog.append(footer);

        splitRowsToColumns();

        // Adding the events after the Table with the checkboxes have been added
        // to the DOM.
        $("#channelsdialog .btnclass").bind("click", function(e){
            var $channelType = $(this).data('channeltype');
            var $channelTypeCheckBox = $('#' + $channelType);
            var $channelAllCheckBox = $('#All');

            if(!($(this).attr("checked")))
            {
                $channelTypeCheckBox.removeAttr("checked");
                $channelAllCheckBox.removeAttr("checked");
            }
            else
            {
                var $selectedChannelTypes = $("input[type=checkbox ][data-channeltype='" + $channelType + "']");
                var $chkSelectedChannelTypes = $("input[type=checkbox ][data-channeltype=" + $channelType + "]:checked");
                if(!isNull($selectedChannelTypes) && !isNull($chkSelectedChannelTypes)
                                        && ($selectedChannelTypes.length == $chkSelectedChannelTypes.length))
                {
                    $channelTypeCheckBox.attr("checked", 'checked');
                }
                toggleChannelTypes(channelTypes);
            }
            isModified = true;
        });

        $('#channelsdialog .btntypeclass').bind('click', function(e){
            var $channelType = $(this).val();
            var toggleChecked = $(this).attr("checked")

            if(toggleChecked)
            {
                $("input[type=checkbox ][data-channeltype='" + $channelType + "']").attr('checked', 'checked');
            }
            else
            {
                $("input[type=checkbox ][data-channeltype='" + $channelType + "']").removeAttr('checked');
            }
            var allChecked = true;
            $(channelTypes).each(function (index, arrChannelType){
                var isChecked = $("input[type=checkbox][value='" + arrChannelType + "']").attr('checked');
                if(!isChecked)
                {
                    allChecked = false;
                    return;
                }
            });
            var $all = $("#All");
            if(allChecked)
            {
                $all.attr('checked', 'checked');
            }
            else
            {

                $all.removeAttr('checked');
            }

            isModified = true;
        });

        showHideDialog = channelsDialog.dialog({
            title: "Select Channel(s) to Display",
            modal: true,
            width:"20%",
            close: function(event, ui) {
                if (document.getElementById("msgDiv") != null) {
			        closeMsgBox();
		        }
                if(!justClose && isModified){
                    var objAjax = new htmlAjax();
                    objAjax.setActionMethod("filtersellchannels");
                    objAjax.setActionURL("colorqty.do");
                    objAjax.parameter().add("filteredsc", getFilteredChannels(channelTypes));
                    //objAjax.setProcessHandler(CQ.colorQtyResponse);
                    objAjax.setProcessHandler(CQ.reloadDiv);
                    objAjax.sendRequest();

                }
                $(".clsbtnbottom").unbind("click");
                channelsDialog.html("");
                channelsDialog.dialog('destroy');
                channelsDialog.remove();
                if (isDefined(showHideDialog))
                {
                    showHideDialog.html("");
                    showHideDialog.dialog('destroy');
                    showHideDialog.remove();
                }
            }
        });

        $("#x-close").bind("click", function(){
            if(isModified)
            {
                var htmlError = new htmlAjax().error();
                htmlError.addConfirm(szMsg_Changes);
                new messagingDiv(htmlError, "showhidechannels.closeShowHide(false)", "showhidechannels.closeShowHide(true)");
            }
            else
            {
                closeShowHide(true);
            }
        })

        $(".clsbtnbottom").bind("click", function(){
            justClose = false;
            $(showHideDialog).dialog('close');
        })

        $("#cancel").bind("click", function(){
            justClose = true;
            $(showHideDialog).dialog('close');
        })

        $("#All").bind("click", function(e){
            var toggleChecked = $(this).attr("checked");
            if(toggleChecked)
            {
                 $('#channelsdialog input:checkbox').attr('checked',toggleChecked);
            }
            else
            {
                $('#channelsdialog input:checkbox').removeAttr('checked');
            }
            isModified = true;
        });

        if(isSelected)
        {
            $(selectedChannels).each(function (index, value) {
                $("input[value='" + value + "']").attr("checked", 'checked');
            });
        }
        else
        {
            $('#channelsdialog input:checkbox').attr('checked','checked');
        }
        toggleChannelTypes(channelTypes);

        /*var titleBar = $(".ui-dialog-titlebar a.ui-dialog-titlebar-close");
        titleBar.removeClass("ui-corner-all");*/

        //titleBar.removeClass("ui-dialog-titlebar-close");
        //titleBar.find(".ui-icon").html("<img src='images/x-close.gif' border='0' class='clsXClose'/>").removeClass();
        //titleBar.find(".ui-icon").html("<img src='images/x-close.gif' border='0'/>").addClass("");
        $(channelsDialog).dialog().siblings('.ui-dialog-titlebar').removeClass('ui-widget-header');
        // We do the Jquery dialog close instead using a image to show the X symbol.
        $(".ui-dialog-titlebar").hide();
        $(channelsDialog).css('overflow', 'hide');
    }

    var closeShowHide = function(cancelSelection){
        justClose = cancelSelection;
        $(showHideDialog).dialog('close');
    }

    var getFilteredChannels = function(channelTypes)
    {
        var allChecked = true;
        var currChannelChecked;
        var filterOnSCs = [];

        $(channelTypes).each(function (index, arrChannelType){
            currChannelChecked = $("input[type=checkbox][value='" + arrChannelType + "']").attr('checked');

            if(!currChannelChecked)
            {
                allChecked = false;
            }
            var $chkSelectedChannelTypes = $("input[type=checkbox ][data-channeltype="
                                + arrChannelType + "]:checked");
            ($chkSelectedChannelTypes).each(function (){
                filterOnSCs.push($(this).val());
            });
        });
        if(allChecked)
        {
            return null;
        }

        return filterOnSCs;
    }

    var toggleChannelTypes = function(channelTypes)
    {
        var allChecked = true;
        var currChannelChecked;
        $(channelTypes).each(function (index, arrChannelType){
            var $selectedChannelTypes = $("input[type=checkbox ][data-channeltype='" + arrChannelType + "']");
            var $chkSelectedChannelTypes = $("input[type=checkbox ][data-channeltype="
                                + arrChannelType + "]:checked");
            currChannelChecked = (!isNull($selectedChannelTypes) && !isNull($chkSelectedChannelTypes)
                                && ($selectedChannelTypes.length == $chkSelectedChannelTypes.length) ? true : false);
            if(currChannelChecked)
            {
                $("input[type=checkbox][value='" + arrChannelType + "']").attr('checked', 'checked');
            }
            else
            {
                allChecked = false;
            }
        });

        if(allChecked)
        {
            var $channelAllCheckBox = $('#All');
            $channelAllCheckBox.attr("checked", "checked");
        }
    }


    var splitRowsToColumns = function()
    {
        //var $channelsCells = $('#channelsTable tr:not(:first-child)');
        var $channelsCells = $('#channelsTable tr td');//tr:not(:second-child) td');

        var maxRows = 10;
        for (i=0, j= maxRows ; j < $channelsCells.length; i++, j++)
	    {
            $($channelsCells[i]).parent().append(($channelsCells).eq(j));
            // It should start again from 0, i++ will reset it to back to 0;
            if( i >= (maxRows - 1))
		    {
			    i = -1;
		    }
        }
    }

    var isDefined = function (obj)
    {
        return (typeof obj != 'undefined' && obj != 'null' && obj != null);
    }

    // ******************************************************* //
    // Public methods
    // ******************************************************* //
    var _showPopUp = function(){
        var objAjax = new htmlAjax();
        objAjax.setActionMethod("SHOWALL");
        objAjax.setActionURL("showhidechannels.do");
        objAjax.setActionClassType();
        objAjax.showProcessingBar(true);
        objAjax.setProcessHandler(getChannels);
        objAjax.sendRequest();
    }

    return {
        showPopUp: _showPopUp,
        closeShowHide: closeShowHide
    };
    // ******************************************************* //
}
)();