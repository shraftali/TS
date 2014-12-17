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

//Static Message Templates
// Added background color the the Tr to avoid getting 1 pixel transparent area between 1st and 2nd cells
var template = new Array();
//Tracker#: 14542 MULTIPLE PLM ERROR MESSAGES RESULT IN SCROLL BARS AND CANNOT CLOSE
//Here the scroll bar will come for the message part only. If the error message has a text that exceeds
//the size of the  message box then automatically the horizondal scroll appears else it wont appear
//setting the cellpadding and cellspaceing to 0 so that there is not spacing between the header tabel and the
//message table(Done only for the error messages)
//Tracker# 20524  css optimization -- style class clsMsgText to messages 
template['errorHTML']='\
<TABLE class=clsmsgTable id=_msgTb>\
<TBODY>\
<TR style="background-color:#DF3410;">\
<TD class=clsNameDivHeaderRedLeft></TD>\
<TD class=clsNameDivHeaderRedMiddle>\
<TABLE class=clsmsgTable id=_headerRow style="width:210px;>\
<TBODY>\
<TR style="background-color:#DF3410;">\
<TD class=clsMsgText><P style="line-height:0;" class=clsMsgText>Error Message(s)</P></TD>\
<TD align="right"><IMG id=_closeMsg height=11 src="images/exit_mouseover.gif" onmouseover="this.style.cursor=\'pointer\'" onclick="closeMsgBox()" width=11 align=right></TD></TR></TBODY></TABLE></TD>\
<TD class=clsNameDivHeaderRedRight></TD></TR>\
<TR style="background-color:#EBD9D5;">\
<TD class=clsNameDivBodyRedLeft></TD>\
<TD class=clsNameDivBodyRedMiddle style="display:block;overflow-x:auto;overflow-y:hidden;"><P style="width:210px;">$SERVER_MESSAGE$</P><BR><BR><BR></TD>\
<TD class=clsNameDivBodyRedRight></TD>\
</TR>\
<TR style="HEIGHT: 5px;background-color:#EBD9D5;">\
<TD class=clsNameDivFooterLeftRed></TD>\
<TD class=clsNameDivFooterMiddleRed></TD>\
<TD class=clsNameDivFooterRightRed></TD></TR></TBODY></TABLE>';

template['successHTML']='\
<TABLE class=clsmsgTable id=_msgTb>\
<TBODY>\
<TR style="background-color:#06A50F;">\
<TD class=clsNameDivHeaderGreenLeft></TD>\
<TD class=clsNameDivHeaderGreenMiddle>\
<TABLE class=clsmsgTable id=_headerRow>\
<TBODY>\
<TR style="background-color:#06A50F;">\
<TD class=clsMsgText><P style="line-height:0;" class=clsMsgText>Success Message(s)</P> </TD>\
<TD><IMG id=_closeMsg height=11 src="images/exit_mouseover.gif" onclick="closeMsgBox()" onmouseover="this.style.cursor=\'pointer\'" width=11 align=right></TD></TR></TBODY></TABLE></TD>\
<TD class=clsNameDivHeaderGreenRight></TD></TR>\
<TR style="background-color:#D9E8D9;">\
<TD class=clsNameDivBodyGreenLeft></TD>\
<TD class=clsNameDivBodyGreenMiddle><P>$SERVER_MESSAGE$</P><BR><BR><BR></TD>\
<TD class=clsNameDivBodyGreenRight></TD></TR>\
<TR style="HEIGHT: 5px; background-color:#D9E8D9;">\
<TD class=clsNameDivFooterLeftGreen></TD>\
<TD class=clsNameDivFooterMiddleGreen></TD>\
<TD class=clsNameDivFooterRightGreen></TD></TR></TBODY></TABLE>';

template['warningHTML']='\
<TABLE class=clsmsgTable id=_msgTb>\
<TBODY>\
<TR style="background-color:#FDC349">\
<TD class=clsNameDivHeaderYellowLeft></TD>\
<TD class=clsNameDivHeaderYellowMiddle>\
<TABLE class=clsmsgTable id=_headerRow>\
<TBODY>\
<TR style="background-color:#FDC349">\
<TD class=clsMsgText><P style="line-height:0;" class=clsMsgText>Warning Message(s)</P></TD>\
<TD><IMG id=_closeMsg height=11 src="images/exit_mouseover.gif" onclick="closeMsgBox()" onmouseover="this.style.cursor=\'pointer\'" width=11 align=right></TD></TR></TBODY></TABLE></TD>\
<TD class=clsNameDivHeaderYellowRight></TD></TR>\
<TR style="background-color:#F5E7CC">\
<TD class=clsNameDivBodyYellowLeft></TD>\
<TD class=clsNameDivBodyYellowMiddle><P>$SERVER_MESSAGE$</P><BR><BR><BR></TD>\
<TD class=clsNameDivBodyYellowRight></TD></TR>\
<TR style="HEIGHT: 5px;background-color:#F5E7CC">\
<TD class=clsNameDivFooterLeftYellow></TD>\
<TD class=clsNameDivFooterMiddleYellow></TD>\
<TD class=clsNameDivFooterRightYellow></TD></TR></TBODY></TABLE>';

template['confirmHTML']='\
<TABLE class=clsmsgTable id=_msgTb>\
<TBODY>\
<TR style="background-color:#FDC349">\
<TD class=clsNameDivHeaderYellowLeft></TD>\
<TD class=clsNameDivHeaderYellowMiddle>\
<TABLE class=clsmsgTable id=_headerRow>\
<TBODY>\
<TR style="background-color:#FDC349">\
<TD class=clsMsgText><P style="line-height:0;" class=clsMsgText>Confirm</P></TD>\
<TD><IMG id=_closeMsg height=11 src="images/exit_mouseover.gif" onclick="closeMsgBox()" onmouseover="this.style.cursor=\'pointer\'" width=11 align=right></TD></TR></TBODY></TABLE></TD>\
<TD class=clsNameDivHeaderYellowRight></TD></TR>\
<TR style="background-color:#F5E7CC">\
<TD class=clsNameDivBodyYellowLeft></TD>\
<TD class=clsNameDivBodyYellowMiddle align="center"><P>$SERVER_MESSAGE$</P><BR></TD>\
<TD class=clsNameDivBodyYellowRight></TD>\
</TR>\
<TR style="background-color:#F5E7CC">\
<TD class=clsNameDivBodyYellowLeft></TD>\
<TD class=clsNameDivBodyYellowMiddle align="center"><SPAN class="clsokcancel" style="text-align:center;" onclick=$FNCTION$>Ok</SPAN>&nbsp;&nbsp;<SPAN class="clsokcancel" style="text-align:center;" onclick=$CANCEL$>Cancel</SPAN></TD>\
<TD class=clsNameDivBodyYellowRight></TD>\
</TR>\
<TR style="HEIGHT: 5px;background-color:#F5E7CC">\
<TD class=clsNameDivFooterLeftYellow></TD>\
<TD class=clsNameDivFooterMiddleYellow></TD>\
<TD class=clsNameDivFooterRightYellow></TD></TR></TBODY></TABLE>';

/**
 * Prints only Ok button in the Confirmation Dialog.
 * ST 19192 - Session Management.
 */
template['confirmOkHTML']='\
<TABLE class=clsmsgTable id=_msgTb>\
<TBODY>\
<TR style="background-color:#FDC349">\
<TD class=clsNameDivHeaderYellowLeft></TD>\
<TD class=clsNameDivHeaderYellowMiddle style="width:338px;">\
<TABLE class=clsmsgTable id=_headerRow>\
<TBODY>\
<TR style="background-color:#FDC349">\
<TD width="8%" align=center><IMG id=_warningMsg src="images/warning.gif" height="15px" width="15px" align=left/></TD>\
<TD class=clsOkMsgText align="left" colspan=2 style="line-height:0;"><P>Logout Warning</P></TD>\
</TR></TBODY></TABLE></TD>\
<TD class=clsNameDivHeaderYellowRight></TD></TR>\
<TR style="background-color:#FFFFFF">\
<TD class=clsNameDivBodyYellowLeft></TD>\
<TD class=clsNameDivBodyWhite align="center"><P>$SERVER_MESSAGE$</P></TD>\
<TD class=clsNameDivBodyYellowRight></TD>\
</TR>\
<TR style="background-color:#FFFFFF">\
<TD class=clsNameDivBodyYellowLeft></TD>\
<TD>&nbsp;</TD>\
<TD class=clsNameDivBodyYellowRight></TD>\
</TR>\
<TR style="background-color:#FFFFFF">\
<TD class=clsNameDivBodyYellowLeft></TD>\
<TD align="center">\
<TABLE id="SessionOk" name="SessionOk" style=" width:30;" title="Ok" border="0" cellspacing="0" cellpadding="0" align="null" onclick="SessionManagement.activateSession();">\
<TBODY><TR align="center" valign="middle" onmouseout="_setButtonStyle(this,\'mouseOut\',\'SessionOk\');" onmouseover="_setButtonStyle(this,\'mouseOver\',\'SessionOk\');">\
<TD id="SessionOkbtnLft" name="SessionOkbtnLft" class="clsLeftcornerButton" nowrap="nowrap" classname="clsLeftcornerButton">&nbsp;&nbsp;</td>\
<TD id="SessionOkbtnCtr" name="SessionOkbtnCtr" class="clsCenterButton" align="center" valign="top" nowrap="nowrap" classname="clsCenterButton">\
<LABEL class="clsTextLabelNormalVTop" style="cursor: pointer; " title="Ok" onmouseout="_clearMousePointer(this);" onmouseover="_setHandMousePointer(this);">\
&nbsp;&nbsp;Ok&nbsp;&nbsp;</label></td><td id="SessionOkbtnRt" name="SessionOkbtnRt" class="clsRightButton" nowrap="nowrap" classname="clsRightButton">&nbsp;&nbsp;</td>\
</TR></TBODY></TABLE>\
</TD>\
<TD class=clsNameDivBodyYellowRight></TD>\
</TR>\
<TR style="HEIGHT: 5px;background-color:#F5E7CC">\
<TD class=clsNameDivFooterLeftYellow></TD>\
<TD class=clsNameDivFooterMiddleYellow></TD>\
<TD class=clsNameDivFooterRightYellow></TD></TR></TBODY></TABLE>';

