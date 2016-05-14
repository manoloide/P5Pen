
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
	var checkbox = createCheckbox('', this.active.value);
	checkbox.style("float", "left");
	checkbox.parent(title);	
	this.active.setInput(checkbox);
	var name = createDiv(this.name);
	name.parent(title);


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