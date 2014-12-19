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

var openImg = '';
var closedImg = '';
var leafImg = '';

// Tree object that holds a collection of Branch objects.
function tree()
{
	this.branches = new Array();
	this.add = addBranch;
	this.write = writeTree;
}

// Branch object that holds a collection of Leaf objects.
function branch(id, text)
{
	this.id = id;
	this.text = text;
	this.write = writeBranch;
	this.add = addLeaf;
	this.leaves = new Array();
}

// Leaf object.
function leaf(id, text)
{
	this.id = id;
	this.text = text;
	this.write = writeLeaf;
}

function writeTree(oImg, cImg, lImg, divId)
{
	openImg = oImg;
	closedImg = cImg;
    leafImg = lImg;

	var treeString = '';
	var numBranches = this.branches.length;
	for(var i=0;i<numBranches;i++)
	{
		treeString += this.branches[i].write();
	}

	if(divId != null && divId != '')
	{
		var divObj = document.getElementById(divId)
		divObj.innerHTML = treeString;
	}
	else
	{
		document.write(treeString);
	}
}

// Add the branch element.
function addBranch(branch)
{
	this.branches[this.branches.length] = branch;
}

// Convert the branch to HTML.
function writeBranch()
{
	var branchString = '<span class="branch" >';
	branchString += '<img src="'+ openImg + '" id="I' + this.id + '" onClick="showBranch(\'' + this.id + '\')">';
	branchString += '<label id="' + this.id + '" title="' + this.text + '"';
	branchString += 'onmouseover="nodeMouseOver(this,\'OVER\')"';
	branchString += 'onmouseout="nodeMouseOut(this,\'OUT\')"';
	branchString += 'onclick="nodeClick(this)">';
	branchString += this.text;
	branchString += '</label>';
	branchString += '</span>';
	branchString += '<span class="leaf" id="B';
	branchString += this.id + '">';
	var numLeaves = this.leaves.length;
	for(var j=0;j<numLeaves;j++)
	{
		branchString += this.leaves[j].write();
    }
	branchString += '</span>';
	return branchString;
}

// Add the leaf element.
function addLeaf(leaf)
{
	this.leaves[this.leaves.length] = leaf;
}

// Convert the leaf to HTML.
function writeLeaf()
{
	var leafString = '<img src="'+ leafImg +'" border="0">';
	leafString += ' &nbsp;<label id="' + this.id + '" title="' + this.text + '"';
	leafString += 'onmouseover="nodeMouseOver(this,\'OVER\')"';
	leafString += 'onmouseout="nodeMouseOut(this,\'OUT\')"';
	leafString += 'onclick="nodeClick(this)">';
	leafString += this.text;
	leafString += '</label>';
	leafString += '<br>';

	return leafString;
}

// Collapse/Show branch.
function showBranch(branch)
{
	var objBranch = document.getElementById('B'+branch).style;
	if(objBranch.display=="block")
	{
		objBranch.display="none";
	}
	else
	{
		objBranch.display="block";
	}
	swapImage('I' + branch);
}

// Change the image,
function swapImage(img)
{
	objImg = document.getElementById(img);
	if(objImg.src.indexOf(closedImg)>-1)
	{
		objImg.src = openImg;
	}
	else
	{
		objImg.src = closedImg;
	}
}

/**
 * Event Handler functions by default does nothing.
 * User has to override this function based on their requirements.
 */
function nodeMouseOver(obj)
{
	// Do nothing.
}

function nodeClick(obj)
{
	// Do nothing.
}

function nodeMouseOut(obj)
{
	// Do nothing.
}

function isInteger(val)
{  
	if( val == null )    
	{
		return false;    
	}    
	
	var valLen = val.length;
	
	if ( valLen <=0 )
	{
		return false;    
	}    
	
	for (var i = 0; i < valLen; i++)     
	{        
		var ch = val.charAt(i);
		if (ch < "0" || ch > "9")        
		{
			return false        
		}    
	}    
	return true
}
