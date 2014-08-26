triangle = null;

function Triangle() {
	canvasDiv = document.getElementById("canvas");
	this.canvas = Raphael(canvasDiv, 200, 200);
}

Triangle.prototype.setSides = function(s1, s2, s3) {
	this.s1 = parseInt(Number(escape(s1)));
	this.s2 = parseInt(Number(escape(s2)));
	this.s3 = parseInt(Number(escape(s3)));
	this.sorted_sides = [this.s1, this.s2, this.s3];
	this.sorted_sides = this.sorted_sides.sort(sortNumber);
	this.scale = 190/this.sorted_sides[2];
	this.scaledSide1 = parseInt(this.scale * this.s1);
	this.scaledSide2 = parseInt(this.scale * this.s2);
	this.scaledSide3 = parseInt(this.scale * this.s3);
	this.x1 = 5;
	this.y1 = 190;
	this.x3 = this.x1 + this.scaledSide1;
	this.y3 = this.y1;
	return this.scale;
}

Triangle.prototype.getX = function(x) {
	return x;
}

Triangle.prototype.getY = function(y) {
	return y;
}

Triangle.prototype.getApex = function() {
	//via http://mathforum.org/library/drmath/view/51836.html
	var b2 = Math.pow(this.scaledSide2, 2);
	var deltaX = parseInt((Math.pow(this.scaledSide1, 2) + Math.pow(this.scaledSide2, 2) - Math.pow(this.scaledSide3, 2))/(2*this.scaledSide1));
	var apexX = this.x1 + deltaX;
	var apexY = this.y3 - Math.sqrt(Math.abs(b2 - Math.pow(deltaX, 2)));
	return [apexX,apexY];
}

Triangle.prototype.getTriangleType = function() {
	if (this.sorted_sides[2] > this.sorted_sides[0] + this.sorted_sides[1]) {
		return "Invalid";
	}
	if (this.sorted_sides[2] == this.sorted_sides[0] + this.sorted_sides[1]) {
		return "Degenerate";
	}
	if ((this.sorted_sides[0] == this.sorted_sides[1]) && (this.sorted_sides[1] == this.sorted_sides[2])) {
		return "Equilateral";
	}
	if (Math.pow(this.sorted_sides[2], 2) == (Math.pow(this.sorted_sides[0], 2) + (Math.pow(this.sorted_sides[1], 2)))) {
		return "Right";
	}
	if ((this.sorted_sides[2] != this.sorted_sides[1]) && (this.sorted_sides[1] != this.sorted_sides[0])) {
		return "Scalene";
	} else {
		return "Isosceles";
	}
}

Triangle.prototype.draw = function() {
	this.canvas.clear();
	if (this.getTriangleType() != "Invalid") {
		this.apexPoint = this.getApex();
	    this.x2 = parseInt(this.apexPoint[0]);
	    this.y2 = parseInt(this.apexPoint[1]);
		this.center();
		this.triangleGraphic = this.canvas.path({stroke: "#036"}).moveTo(this.x1, this.y1).lineTo(this.x3, this.y3).lineTo(this.x2, this.y2).moveTo(this.x2, this.y2).lineTo(this.x1, this.y1).andClose();
		this.triangleGraphic.attr("fill", "#6699bb");
		document.getElementById('triangle_coordinates').value = "(" + this.x1 + "," + this.y1 + ") (" + this.x2 + "," + this.y2 + ") (" + this.x3 + "," + this.y3 + ")";
	} else {
		document.getElementById('triangle_coordinates').value = "";
	}
	document.getElementById('triangle_type').innerHTML = this.getTriangleType();
	document.getElementById('triangle_category').value = this.getTriangleType();
}

Triangle.prototype.center = function() {
	//get the total width of the triangle
	var xVals = [this.x1, this.x2, this.x3];
	xVals.sort(sortNumber);
	var width = xVals[2] - xVals[0];
	var shiftBy = parseInt(100 - (0.5 * width));
	this.x1 = this.x1 + shiftBy;
	this.x2 = this.x2 + shiftBy;
	this.x3 = this.x3 + shiftBy;
}

function sortNumber(a,b) {
	return a - b;
}

function drawTriangle() {
	var side1val = document.getElementById('triangle_side1').value;
	var side2val = document.getElementById('triangle_side2').value;
	var side3val = document.getElementById('triangle_side3').value;
	triangle.setSides(side1val, side2val, side3val);
	triangle.draw();
	new Ajax.Updater('triangles_list', '/triangles', {asynchronous:true, evalScripts:true, parameters:Form.serialize(document.getElementById('triangle_side1').form)});
}

function initializeTriangle() {
	triangle = new Triangle();
}

window.onload=function(){ initializeTriangle(); }

function inspect(thing) {
	var serialized_thing = "";
	for (bit in thing) {
		serialized_thing += bit + ": " + thing[bit] + "\n";
	}
	return (serialized_thing);
}
