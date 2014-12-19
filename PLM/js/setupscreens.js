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

/* Tracker#: 12269 - FIREFOX: OUTSTANDING ISSUES IN FIREFOX BROWSER  FOR SETUP SCREENS
 * Issue - Using getElementById to get elements by name.
 * Fix - Get elements by name using jQuery instead.
 */
var selector = {
	byName : function (name) {
		  return $('select[name="' +name+ '"]')[0];
	},
	
	// querygroupcount.jsp
	selGroup : function () {
		return selector.byName('selectedGroupQuery');
	},
	  
	selGroupCount : function () {
		return selector.byName('selectedQueryGroupCount');
	},
	  
	groupId : function () {
		return selector.byName('groupId');
	},
	  
	availGroupCount : function () {
		return selector.byName('availableQueryGroupCount');
	},
	
	// querygroup.jsp
	availQuery : function () {
		return this.byName('availableQuery');
	},
	
	// definesearchandlistpos.jsp
	selSearchOrList : function () {
		return this.byName('selectedSearchOrList');
	},
	
	availSearchOrList : function () {
		return this.byName('availableSearchOrList');
	},
	
	// assignquery.jsp
	selSecAssigned : function () {
		return this.byName('selectedSecAssignedQuery');
	},
	
	// assigngroup.jsp
	selSecAssignedGroup : function () {
		return this.byName('selectedSecAssignedGroup');
	},
	
	selUserOrRole : function () {
		return this.byName('selectedUserOrRole');
	},
	
	roleId : function () {
		return this.byName('roleId');
	}
};