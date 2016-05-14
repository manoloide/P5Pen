

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
	this.value = this.param_input.checked();
}

BoolProperty.prototype.update = function() {
	this.value = this.param_input.checked();
}

var ColorProperty = function(name, value) {
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



