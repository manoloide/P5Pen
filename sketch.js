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
