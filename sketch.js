var canvas, drawing;
var globalAlpha;
var lines = [];
var beginDrawing, isDrawing;
var modifiers = [];


function setup() {
	var w = window.innerWidth-260;
	var h = window.innerHeight;
	p5 = createCanvas(w, h);
	p5.parent('container');
	canvas = createGraphics(w, h);
	drawing = createGraphics(w, h);

	
	//modifiers.push(new MirrorModifier(10, createVector(width*0.1, height*0.1), 0.25));
	var tile = new TileModifier(100, 100);
	var mirror = new MirrorModifier(4, createVector(width*0.25, height*0.25), 0.25);
	modifiers.push(tile);
	modifiers.push(mirror);
	modifiers.push(new MirrorModifier(10, createVector(width/2, height/2), 0.25, true));
	modifiers.push(new DrawLineModifier(drawing, 1, color(0, 80)));

	for(var i = 0; i < modifiers.length; i++) {
		modifiers[i].createGui();
	}
	
	mirror.setActive(false);
	tile.setActive(false);

	canvas.background(250);
}


function draw() {
	
	var lines = [];

	for(var i = 0; i < modifiers.length; i++) {
		modifiers[i].updateParams();
	}

	image(canvas, 0, 0);
	if(isDrawing) {
		if(beginDrawing) {
			lines.push(new Line(createVector(mouseX, mouseY), createVector(mouseX, mouseY)));
			beginDrawing = false;
			for(var i = 0; i < modifiers.length; i++) {
				if(modifiers[i].active.value) modifiers[i].begin();
			}
		}
		else {
			lines.push(new Line(createVector(pmouseX, pmouseY), createVector(mouseX, mouseY)));
		}

		for(var i = 0; i < modifiers.length; i++) {
			if(modifiers[i].active.value) modifiers[i].update(lines);
		}
		//console.log(globalAlpha);
		//tint(255, 0 , 0, globalAlpha);
		image(drawing, 0, 0);
		//noTint();
	}

}

function mousePressed() {
	if(mouseX <= width) {
		beginDrawing = true;
		isDrawing = true;
		drawing.clear();
	}
}

function mouseReleased() {
	if(isDrawing) {
		for(var i = 0; i < modifiers.length; i++) {
			if(modifiers[i].active.value) modifiers[i].end();
		}
		isDrawing = false;
		canvas.tint(255, globalAlpha);
		canvas.image(drawing.get(), 0, 0);
		canvas.noTint();
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

var TileModifier = function(w, h) {
	Modifier.call(this, "Tile Modifier");
	this.width = this.addParam(new IntProperty("Width", w, 20, 400));
	this.height = this.addParam(new IntProperty("Height", h, 20, 400));
	this.cw = 1;
	this.ch = 1;
}

TileModifier.prototype = Object.create(Modifier.prototype);
TileModifier.prototype.constructor = TileModifier;

TileModifier.prototype.begin = function() {
	this.cw = int(width*1./this.width.value)+1;
	this.ch = int(height*1./this.height.value)+1;
}	

TileModifier.prototype.update = function(lines) {
	var cc = lines.length;
	var aux = [];
	for(var l = 0; l < cc; l++) {
		for(var j = -1; j < this.ch+1; j++) {
			for(var i = -1; i < this.cw+1; i++) {
				var p1 = lines[l].p1.copy();
				var p2 = lines[l].p2.copy();
				var des = createVector(i*this.width.value, j*this.height.value);
				p2.x = (p2.x-p1.x);
				p2.y = (p2.y-p1.y);
				p1.x = (p1.x)%this.width.value;
				p1.y = (p1.y)%this.height.value;
				p2 = p2.add(p1);
				p1.add(des);
				p2.add(des);
				lines.push(new Line(p1, p2));
			}
		}
		lines = lines.splice(0, 1);
	}
}



var DrawLineModifier = function(canvas, strokeWeight, color) {
	Modifier.call(this, "Draw Line");

	this.canvas = canvas;
	this.strokeWeight = this.addParam(new FloatProperty("Stroke Weight", strokeWeight, 0.5, 20, 0.1));
	this.color = this.addParam(new ColorProperty("Color", color));
}

DrawLineModifier.prototype = Object.create(Modifier.prototype);
DrawLineModifier.prototype.constructor = DrawLineModifier;

DrawLineModifier.prototype.update = function(lines) {
	var col = this.color.value; 
	globalAlpha = alpha(col);
	this.canvas.stroke(red(col), green(col), blue(col));
	this.canvas.strokeWeight(this.strokeWeight.value);
	for(var i = 0; i < lines.length; i++) {
		var p1 = lines[i].p1;
		var p2 = lines[i].p2;
		this.canvas.line(p1.x, p1.y, p2.x, p2.y);
	}
}
