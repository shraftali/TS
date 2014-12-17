$(document).ready( function() {
    // Grid Initialization
    var grid = $("#grid");
    grid.kendoGrid({
        reorderable: true,
        resizable: true,
        columnMenu: true,
        navigatable: true,
        height: 230,
        filterable: {
            extra: false,
            operators: {
                number: {
                    eq: "Equal to"
                },
                date: {
                    eq: "Equal"
                }
            }
        },
        columns: [ 
            {
                field: "CheckAll", width: 60, locked: true, menu: false, filterable: false, sortable: false, lockable: false
            }, {
                field: "ColorNo", width: 90, locked: true, filterable: true, sortable: true, lockable: false,
            }, {
                field: "ColorName", width: 120, locked: true, sortable: true, lockable: true, filterable:true 
            }, {
                field: "Number1", width: 120, locked:false, sortable: true, filterable: true
            }, {
                field: "Date1", width: 120, locked:false, filterable: true, sortable: true, format: "{0:MM/dd/yyyy}", /*type:"date",*/ filterable: {
                    ui: "datepicker"
                }
            }, {
                field: "Trending", width: 220, locked:false, filterable: true, sortable: true
            }, {
                field: "Season", width: 140, locked:false, filterable: true, sortable: true
            }, {
                field: "Memo1", width: 120, locked:false, filterable: true, sortable: true
            }, {
                field: "H", width: 60, locked:false, filterable: true, sortable: true
            }, {
                field: "L", width: 60, locked:false, filterable: true, sortable: true
            }, {
                field: "C", width: 60, locked:false, filterable: true, sortable: true
            }, {
                field: "AddedBy", width: 90, locked:false, filterable: true, sortable: true
            }, {
                field: "R", width: 60, locked:false, filterable: true, sortable: true
            }, {
                field: "G", width: 60, locked:false, filterable: true, sortable: true
            }, {
                field: "B", width: 60, locked:false, filterable: true, sortable: true
            }, {
                field: "ModifyUser", width: 90, locked:false, filterable: true, sortable: true
            }, {
                field: "Company", width: 90, locked:false, filterable: true, sortable: true
            }
        ]
    });
    
    //Overiding Grid Default functinality on Some Clumns
    var gridData = grid.data("kendoGrid");

    // prevent column resizing
    gridData.resizable.bind("start", function (e) {
        if ($(e.currentTarget).data("th").hasClass("disabledColumn")) {
            e.preventDefault();
            setTimeout(function () { $(document.body).add(".k-grid th, .k-grid th > a").css("cursor", ""); });
        }
    });

    // prevent column reordering
    gridData.wrapper.data("kendoReorderable").draggable.bind("dragstart", function (e) {
        if ($(e.currentTarget).hasClass("disabledColumn")) {
            e.preventDefault();
        }
    });

    //Additional KeyMap For Keyboard Navgiation to Grid (OPTIONAL)ALT+W
    $(document.body).keydown(function(e) {
        if (e.altKey && e.keyCode == 87) {
            gridData.table.focus();
        }
    });


    // Dialog for Kendo Save MyView Table State Starts Here
    var dialog_Save_Layout = $("#dialogSaveLayout");
        dialog_Save_Layout.kendoWindow();
    var dialog = dialog_Save_Layout.data("kendoWindow");
        dialog.setOptions({
        visible: false,
        modal: true,
        title: "Save Table Layout",
        width: 600
      });
      dialog.center();

    $("#saveState").click(function(event) {
        dialog.open();
    });      

    // Validation for SaveMyView Dialog Form
    var validateSaveMyView = $("#myViewForm").kendoValidator().data("kendoValidator");
    var myViewForm = $("#myViewForm")
        myViewForm.submit(function(event) {
            event.preventDefault();
            if (validateSaveMyView.validate()) {
            //Make call here to the function that will save the layout to the Backend
            /*var state = {
            columns: grid.columns,
            page: dataSource.page(),
            pageSize: dataSource.pageSize(),
            sort: dataSource.sort(),
            filter: dataSource.filter(),
            group: dataSource.group()
            };

            $.ajax({
            url: "/Home/Save",
            data: {
            data: JSON.stringify(state)
            }
            });*/

            //Temp options saving it in local data
            localStorage["kendo-grid-options"] = kendo.stringify(gridData.getOptions());
            alert("Your My View has been Saved");
            dialog.close();
        }
    });            

    $(".cancel", myViewForm).click(function(event) {
        validateSaveMyView.hideMessages();
        dialog.close();
    });

    //Delete View
    var deleteMyView = $("#deleteMyView");
    deleteMyView .kendoWindow();
    var dialogDeleteView = deleteMyView.data("kendoWindow");
    dialogDeleteView.setOptions({
        visible: false,
        modal: true,
        title: "Delete Views",
        width: 600
    });
    var chooseLayout = $('#chooseLayout');
        chooseLayout.change(function (e) {
            var selectView = $(this).val();
        //console.log(selectView);
        if (selectView == "delete") {
            dialogDeleteView.center().open();
        }
        else{
        //Loading my View When user choose his view form dropdown menu
        //Server Side
        /*$.ajax({
        url: "/Home/Load",
        success: function(state) {
        state = JSON.parse(state);

        var options = grid.options;

        options.columns = state.columns;

        options.dataSource.page = state.page;
        options.dataSource.pageSize = state.pageSize;
        options.dataSource.sort = state.sort;
        options.dataSource.filter = state.filter;
        options.dataSource.group = state.group;

        grid.destroy();

        $("#grid")
        .empty()
        .kendoGrid(options);
        }
        });*/
        //Local temp Solution
        var options = localStorage["kendo-grid-options"];
            if (options) {
                gridData.setOptions(JSON.parse(options));
            }
        }
        return false;   
        });

    //Handle show hide Error
        statusMsg = $(".err-wrap");
    function delete_err (argument) {
        if(argument == false){
            $(statusMsg, deleteMyView).html('Check atleast one checkbox to delete your save View').css('display', 'block');    
        }
        if (argument == true) {
            $(statusMsg, deleteMyView).html('').css('display', 'none');
        };
        
    }
    // Validation for DeleteMyView Dialog Form
    deleteMyView.submit(function(e){
        if(deleteMyView.find(':checked').length<1){
            delete_err(false);
            return false;
          }
        if(!confirm('Deleting this view will also make it unavailable from the Dashboard OK/Cancel')){
            delete_err(true);
            return false;
        };
    })
    //Handel Cancel Event
    $(".cancel", deletemyViewForm).click(function(event) {
        dialogDeleteView.close();
        delete_err(true);
        chooseLayout.val(0);
    });

});