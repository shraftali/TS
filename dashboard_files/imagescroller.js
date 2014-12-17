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

var scrollTbl;
var chgFlds;
var prevId='';
var ids='';
var counter=0;
var firstvalue='';
var sizeForId=0;
var docViewId;
var largeImg='';

/*
The function to show the bigger image on click of small image
*/
function showBigImage(obj,imgCellId,imgSrc,imgId,imgRowId,lrgimg, isImg)
{
	//alert(obj.outerHTML);
	var img=getElemnt(imgId);
	var imgCell=getElemnt(imgCellId);
	var imgRow=getElemnt(imgRowId);
	var lcell=getElemnt('_leftArrowCell');
	changeStyle(imgRow);
	largeImg=lrgimg;
	imgCell.className='clsImgScroller';
	if(img)
	{
		if("0"== isImg)
		{
			img.src=obj.src;
		}
		else
		{
			if (obj.src.indexOf("?") != -1)
			{
				var basesrc = imgSrc;
				if (imgSrc.indexOf("?") != -1)
				{
					basesrc = imgSrc.substring(0,imgSrc.indexOf("?"));
				}
				var now = new Date().getTime();
				var nowstr = now.toString();
				nowstr=nowstr.substring(nowstr.length - 6);
				basesrc = basesrc + "?ts=" + nowstr;
				imgSrc = basesrc;
				
			}				
			img.src=imgSrc;			
		}
	}
	//alert(img.src);
	var link=getElemnt('_lrgImgLink');
	var link1=getElemnt('_markupImgLink');

	var isImage = true;
	if (link)
	{
		link.href=largeImg;
	}
	if (link1)
	{
		link1.onclick = function(evt){
			//oCW('lm','markup.do?act=download&filename='+ largeImg,900,600,0,0,1,1)				
			editFile(largeImg,'C:/FileEdit','',imgCellId); // for tracker # 14466
		}
	}	
}
/*
The function used to change the style of the image containing table cells
*/
function changeStyle(obj)
{
	var cells=obj.getElementsByTagName("TD");
	for(var i=0;i<cells.length;i++)
	{
		cells[i].className=' ';
	}
}

/*
The function to reset the global variables used.
*/
function resetAll(size,docView)
{
	docViewId=docView;
	counter=0;
	firstvalue='';
	prevId=null;
	sizeForId=parseInt(size);
}
/*
The function used to delete the selected image
*/
function removeImageScrollerImage()
{
	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	if(counter > 0)
	{
		var htmlErrors = objAjax.error();
	   	htmlErrors.addError("warningInfo", "  Please save the added Image", false);
	 	messagingDiv(htmlErrors);
	   	return;
	}
	else
	{
		var htmlErrors = objAjax.error();
   		htmlErrors.addError("confirmInfo","Do you want to delete the Image?",  false);
   		messagingDiv(htmlErrors,'deleteImage()','imgDelCancel()');

	}
}

function imgDelCancel()
{
	closeMsgBox();
}

function deleteImage()
{
	var imgRow=getElemnt('_imgsRow');
	var cells=imgRow.getElementsByTagName("TD");
	var rownum=0;
	var url = "deletescrollerimage";
 	var htmlAreaObj = _getWorkAreaDefaultObj();
	var objAjax = htmlAreaObj.getHTMLAjax();
	var objHTMLData = htmlAreaObj.getHTMLDataObj();
	sectionName = objAjax.getDivSectionId();

	for(var i=0;i<cells.length;i++)
	{
		if(cells[i].className=='clsImgScroller')
		{
			//alert(cells[i].outerHTML);
			rownum=getAttachmentRowNum(cells[i]);
		}
	}
	if(objAjax && objHTMLData)
    {
        bShowMsg = true;
        //alert(docViewId);
        if(docViewId=='132')
        	loadWorkArea("techspecoverview.do", url+"&rownum="+rownum);
    }
}

function getAttachmentRowNum(obj)
{
	var id=obj.id;
	//Tracker#: 15436 ENHANCEMENT NEEDED TO SUPPORT SPECIAL CHARACTERS COMMA AND UNDERSCORE	
	var splt=id.split(_FIELDS_SEPERATOR);
	return splt[4];
}

function getNewId(obj)
{
	var imgRow=getElemnt('_imgsRow');
	var cells=imgRow.getElementsByTagName("TD");
	var id=obj.id;
	for(var i=0;i<cells.length;i++)
	{
		var hdns=cells[i].getElementsByTagName("input");

		for(var j=0;j<hdns.length;j++)
		{
			if(hdns[j].type='hidden')
			{
				id=hdns[j].id;
			}
		}
	}
	return id;
}

function showLargeImg(lrgImg)
{
	largeImg=lrgImg;
}


