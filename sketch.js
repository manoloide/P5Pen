var lines = [];
var beginDrawing, isDrawing;
var modifiers = [];


function setup() {
	var w = window.innerWidth-260;
	var h = window.innerHeight;
	canvas = createCanvas(w, h);
	canvas.parent('container');

	modifiers.push(new MirrorModifier(10, createVector(width/2, height/2), 0.25, true));
	modifiers.push(new MirrorModifier(10, createVector(width*0.1, height*0.1), 0.25));
	modifiers.push(new MirrorModifier(10, createVector(width*0.9, height*0.9), 0.25));
	modifiers.push(new DrawLineModifier(2, color(0, 80)));

	for(var i = 0; i < modifiers.length; i++) {
		modifiers[i].createGui();
	}
	

	background(250);
}


function draw() {
	
	var lines = [];

	for(var i = 0; i < modifiers.length; i++) {
		modifiers[i].updateParams();
	}

	if(isDrawing) {
		if(beginDrawing) {
			lines.push(new Line(createVector(mouseX, mouseY), createVector(mouseX, mouseY)));
			beginDrawing = false;
			for(var i = 0; i < modifiers.length; i++) {
				modifiers[i].begin();
			}
		}
		else {
			lines.push(new Line(createVector(pmouseX, pmouseY), createVector(mouseX, mouseY)));
		}

		for(var i = 0; i < modifiers.length; i++) {
			modifiers[i].update(lines);
		}
	}

}

function mousePressed() {
	if(mouseX <= width) {
		beginDrawing = true;
		isDrawing = true;
	}
}

function mouseReleased() {
	if(isDrawing) {
		for(var i = 0; i < modifiers.length; i++) {
			modifiers[i].end();
		}
		isDrawing = false;
	}
}

function Line(p1, p2){
	this.p1 = p1; 
	this.p2 = p2;
}


var Property = function(name, value) {
	this.name = name;
	this.value = value;
}

Property.prototype.getDiv = function() {

};

Property.prototype.update = function() {

};


var BoolProperty = function(name, value) {
	Property.call(this, name, value);
	this.param_input;
}

BoolProperty.prototype = Object.create(Property.prototype);
BoolProperty.prototype.constructor = BoolProperty;

BoolProperty.prototype.getDiv = function() {
	var content = createDiv('');

	var param_title = createDiv(this.name);
	param_title.parent(content);
	param_title.style("float", "left");

	var param_input = createCheckbox('', this.value);
	param_input.style("float", "right");
	param_input.parent(content);
	createDiv('').addClass('space').parent(content);

	this.setInput(param_input);

	return content;
}

BoolProperty.prototype.setInput = function(input) {
	this.param_input = input;
	//console.log(input);
	this.value = this.param_input.checked();
}

BoolProperty.prototype.update = function (){
	//this.param_input.checked((frameCount%60 > 30)? true : false);
	this.value = this.param_input.checked();
}

var ColorProperty = function(name, value){
	Property.call(this, name, value);

}

ColorProperty.prototype = Object.create(Property.prototype);
ColorProperty.prototype.constructor = ColorProperty;

ColorProperty.prototype.getDiv = function() {
	var content = createDiv('');

	var param_title = createDiv(this.name);
	param_title.parent(content);
	param_title.style("float", "left");
	var param_input = createInput('');
	param_input.attribute("type", "color");
	param_input.style("float", "right");
	param_input.parent(content);
	createDiv('').addClass('space').parent(content);

	return content;
}


ColorProperty.prototype.update = function() {
	//this.param_value.html(this.params_input.value());
}

var FloatProperty = function(name, value, min, max, step){
	Property.call(this, name, value);
	this.min = min;
	this.max = max;
	this.step = step;

	this.param_value;
	this.param_input;
}

FloatProperty.prototype = Object.create(Property.prototype);
FloatProperty.prototype.constructor = FloatProperty;

FloatProperty.prototype.getDiv = function() {
	var content = createDiv('');

	var param_title = createDiv(this.name);
	param_title.parent(content);
	param_title.style("float", "left");
	var param_value = createDiv(this.value);
	param_value.parent(content);
	createDiv('').addClass('space').parent(content);
	param_value.style("float", "right");
	var param_input = createInput('');
	param_input.attribute("type", "range");
	param_input.attribute("value", this.value);
	param_input.attribute("min", this.min);
	param_input.attribute("max", this.max);	
	param_input.attribute("step", this.step);	
	param_input.parent(content);
	createDiv('').addClass('space').parent(content);

	this.param_value = param_value;
	this.param_input = param_input;

	return content;
}

FloatProperty.prototype.update = function() {
	this.value = this.param_input.value();
	this.param_value.html(this.value);
}

var IntProperty = function(name, value, min, max){
	Property.call(this, name, value);
	this.min = min;
	this.max = max;

	this.param_value;
	this.param_input;
}

IntProperty.prototype = Object.create(Property.prototype);
IntProperty.prototype.constructor = IntProperty;

IntProperty.prototype.getDiv = function() {
	var content = createDiv('');

	var param_title = createDiv(this.name);
	param_title.parent(content);
	param_title.style("float", "left");
	var param_value = createDiv(this.value);
	param_value.parent(content);
	param_value.style("float", "right");
	var param_input = createInput('');
	param_input.attribute("type", "range");
	param_input.attribute("value", this.value);
	param_input.attribute("min", this.min);
	param_input.attribute("max", this.max);	
	param_input.parent(content);
	createDiv('').addClass('space').parent(content);

	this.param_value = param_value;
	this.param_input = param_input;
	return content;
}

IntProperty.prototype.update = function() {
	this.value = this.param_input.value();
	this.param_value.html(this.value);
}

var VectorProperty = function(name, value, amount, min, max){
	Property.call(this, name, value);
	this.amount = amount;
	this.min = min;
	this.max = max;

	this.params_value = [];
	this.params_input = [];
}

VectorProperty.prototype = Object.create(Property.prototype);
VectorProperty.prototype.constructor = VectorProperty; 

VectorProperty.prototype.getDiv = function() {
	var content = createDiv('');
	var values = this.value.array();
	var names = [" x", " y", " z"];

	for(var i = 0; i < this.amount; i++) {
		var param_title = createDiv(this.name+names[i]);
		param_title.parent(content);
		param_title.style("float", "left");
		var param_value = createDiv(values[i]);
		param_value.parent(content);
		param_value.style("float", "right");
		var param_input = createInput('');
		param_input.attribute("type", "range");
		param_input.attribute("value", values[i]);
		param_input.attribute("min", this.min);
		param_input.attribute("max", this.max);	
		param_input.parent(content);
		createDiv('').addClass('space').parent(content);

		this.params_value.push(param_value);
		this.params_input.push(param_input);
	}

	return content;
}

VectorProperty.prototype.update = function() {
	var values = this.value.array();
	for(var i = 0; i < this.amount; i++) {
		values[i] = this.params_input[i].value();
		this.params_value[i].html(values[i]);
	}
	this.value.set(values);
}



var Modifier = function(name) {
	this.name = name;
	this.active = new BoolProperty("Active", true);
	this.params = [];
}


Modifier.prototype.begin = function() {

}

Modifier.prototype.update = function() {

}

Modifier.prototype.end = function() {

}

Modifier.prototype.gui = function() {

}

Modifier.prototype.editor = function() {
	
}

Modifier.prototype.addParam = function(param) {
	this.params.push(param)
	return param;
}

Modifier.prototype.createGui = function() {
	var menu = document.getElementById('menu');
	var modifier = createDiv('');
	modifier.addClass("modifier");
	modifier.parent(menu);

	var title = createDiv('');
	title.addClass('modifier_title')
	title.parent(modifier);
	var arrow = createDiv('');
	arrow.addClass('arrow rotate');
	arrow.attribute("onclick", "closeAndOpen(this)");	
	arrow.parent(title);
	/*
	var checkbox = createCheckbox('', this.active.value);
	checkbox.checked(true);//this.active.value);
	checkbox.style("float", "left");
	checkbox.parent(title);	
	this.active.setInput(checkbox);
	*/
	var param_input = createCheckbox('', true);
	param_input.style("float", "left");
	param_input.parent(title);
	this.active.setInput(param_input);

	title.html(title.html()+this.name);

	var content = createDiv('');
	content.addClass('modifier_content')
	content.parent(modifier);

	for(var i = 0; i < this.params.length; i++) {
		var param = this.params[i].getDiv();
		param.parent(content);
	}
}

Modifier.prototype.updateParams = function() {
	this.active.update();
	for(var i = 0; i < this.params.length; i++) {
		this.params[i].update();
	}
}

function closeAndOpen(d){
	var content = d.parentElement.parentElement.getElementsByClassName("modifier_content")[0];
	if(d.className === "arrow"){
		d.setAttribute("class", "arrow rotate");
		content.setAttribute("class", "modifier_content");
	} else {
		d.setAttribute("class", "arrow");
		content.setAttribute("class", "modifier_content hidden");
	}
}



var MirrorModifier = function (segments, center, rotate, symetric) {
	Modifier.call(this, "Mirror Modifier");

	this.segments = this.addParam(new IntProperty("Segments", segments, 2, 60));
	this.center = this.addParam(new VectorProperty("Center", center, 2, 0, max(width, height)));
	this.rotate = this.addParam(new FloatProperty("Rotate", rotate, 0.0, 1.0, 0.01));
	this.symetric = this.addParam(new BoolProperty("Symetric", symetric));
}

MirrorModifier.prototype = Object.create(Modifier.prototype);
MirrorModifier.prototype.constructor = MirrorModifier;

MirrorModifier.prototype.begin = function() {
	this.da = TWO_PI/this.segments.value;
	this.rotate.value = (this.rotate.value*TWO_PI)%this.da;
}

MirrorModifier.prototype.update = function(lines) {
	if(!this.active.value) return;
	var cc = lines.length;
	var center = this.center.value; 
	var segments = this.segments.value;
	var angle, x1, y1, x2, y2, p1, p2;
	for(var i = 0; i < cc; i++){
		for(var j = 1; j < segments; j++){
			angle = this.da*j;
			x1 = cos(angle) * (lines[i].p1.x-center.x) - sin(angle) * (lines[i].p1.y-center.y) + center.x;
			y1 = sin(angle) * (lines[i].p1.x-center.x) + cos(angle) * (lines[i].p1.y-center.y) + center.y;
			x2 = cos(angle) * (lines[i].p2.x-center.x) - sin(angle) * (lines[i].p2.y-center.y) + center.x;
			y2 = sin(angle) * (lines[i].p2.x-center.x) + cos(angle) * (lines[i].p2.y-center.y) + center.y;
			p1 = createVector(x1, y1);
			p2 = createVector(x2, y2);
			lines.push(new Line(p1, p2));
		}
	}
}


var DrawLineModifier = function(strokeWeight, color) {
	Modifier.call(this, "Draw Line");

	this.strokeWeight = this.addParam(new FloatProperty("Stroke Weight", strokeWeight, 0.5, 40, 0.1));
	this.color = this.addParam(new ColorProperty("Color", color));
}

DrawLineModifier.prototype = Object.create(Modifier.prototype);
DrawLineModifier.prototype.constructor = DrawLineModifier;

DrawLineModifier.prototype.update = function(lines) {
	stroke(this.color.value);
	//strokeWeight(2);//this.strokeWeight);
	for(var i = 0; i < lines.length; i++) {
		var p1 = lines[i].p1;
		var p2 = lines[i].p2;
		line(p1.x, p1.y, p2.x, p2.y);
	}
}
