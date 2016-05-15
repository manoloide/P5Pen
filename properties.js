

var Property = function(name, value) {
	this.name = name;
	this.value = value;
}

Property.prototype.getDiv = function() {

};

Property.prototype.update = function() {

};

Property.prototype.setValue = function(nv) {
	console.log("No define setValue for this property")
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

BoolProperty.prototype.setValue = function(nv) {
	this.value = nv;
	this.param_input.checked(this.value);
}	

BoolProperty.prototype.setInput = function(input) {
	this.param_input = input;
	this.value = this.param_input.checked();
}

BoolProperty.prototype.update = function() {
	this.value = this.param_input.checked();
}

var ColorProperty = function(name, value) {
	Property.call(this, name, value);

	this.antValue = this.value;
	this.r = new IntProperty("Red", this.value.levels[0], 0, 255);
	this.g = new IntProperty("Green", this.value.levels[1], 0, 255);
	this.b = new IntProperty("Blue", this.value.levels[2], 0, 255);
	this.a = new IntProperty("Alpha", this.value.levels[3], 0, 255);
	this.colorSelector;
}

ColorProperty.prototype = Object.create(Property.prototype);
ColorProperty.prototype.constructor = ColorProperty;

ColorProperty.prototype.getDiv = function() {
	var content = createDiv('');

	var param_title = createDiv(this.name);
	param_title.parent(content);
	param_title.style("float", "left");
	this.colorSelector = createInput('');
	this.colorSelector.attribute("type", "color");
	this.colorSelector.style("float", "right");
	this.colorSelector.parent(content);
	createDiv('').addClass('space').parent(content);
	createDiv('').addClass('space').parent(content);

	this.r.getDiv().parent(content);
	this.g.getDiv().parent(content);
	this.b.getDiv().parent(content);
	this.a.getDiv().parent(content);

	this.setValue(this.value);

	return content;
}

ColorProperty.prototype.setValue = function(nv) {
	this.value = nv;
	this.r.setValue(this.value.levels[0]);
	this.g.setValue(this.value.levels[1]);
	this.b.setValue(this.value.levels[2]);
	this.a.setValue(this.value.levels[3]);
	this.colorSelector.value("#" + ((1 << 24) + (this.r.value << 16) + (this.g.value << 8) + this.b.value).toString(16).slice(1));
}	

ColorProperty.prototype.update = function() {

	ac = hexToRgb(this.colorSelector.value());
	this.value = color(ac.r, ac.g, ac.b, this.value._getAlpha());

	if(this.antValue.toString() !== this.value.toString()){
		this.r.setValue(this.value.levels[0]);
		this.g.setValue(this.value.levels[1]);
		this.b.setValue(this.value.levels[2]);
	}


	this.r.update();
	this.r.setGrandientBack(color(0, this.g.value, this.b.value), color(255, this.g.value, this.b.value));
	this.g.update();
	this.g.setGrandientBack(color(this.r.value, 0, this.b.value), color(this.r.value, 255, this.b.value));
	this.b.update();
	this.b.setGrandientBack(color(this.r.value, this.g.value, 0), color(this.r.value, this.g.value, 255));
	this.a.update();
	this.a.setGrandientBack(color(10), this.value);

	this.value = color(this.r.value, this.g.value, this.b.value, this.a.value);
	this.antValue = this.value;
	this.colorSelector.value("#" + ((1 << 24) + (this.r.value << 16) + (this.g.value << 8) + this.b.value).toString(16).slice(1));
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

FloatProperty.prototype.setValue = function(nv) {
	this.value = nv;
	this.param_input.value(this.value);
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

IntProperty.prototype.setValue = function(nv) {
	this.value = nv;
	this.param_input.value(this.value);
}

IntProperty.prototype.update = function() {
	this.value = this.param_input.value();
	this.param_value.html(this.value);
}

IntProperty.prototype.setGrandientBack = function(c1, c2) {
	this.param_input.style("background", "linear-gradient(to right, "+c1.toString()+", "+c2.toString()+")");
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



function hexToRgb(hex) {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}


