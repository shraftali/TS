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

function _notifyCopiedOffer(tblId, rownum)
{
    //alert("_notifyCopidOffer called \n tblId="+tblId);
    var obj = getElemnt(tblId);

    if(obj)
    {
        //alert("calling fDRCSel \n rownum= "+ rownum  + " \n tblId="+tblId);
        fDRCSel(obj, rownum, tblId);
    }
}
