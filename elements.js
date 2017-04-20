var elemToDrag = null;
var elements = new function(){};
 
 
elements["Button"] = function element_button(e,x,y)
{
	b = document.createElement("button");
	b = make_Container(b);
	b.appendChild(document.createTextNode("Button"));
	b.create(e,x,y)
}
 
 
function new_Screen()
{
	screen = document.createElement("div");
	screen.ondragover = allowDrop;
	screen.ondrop = drop;
	if(landscape_mode) screen.classList.add("screenlandscape");
	else screen.classList.add("screenportait");
	
	$("screencontainer").appendChild(screen);
}

function moveelem(e) {
  x = e.clientX;
  y = e.clientY;
  elemToDrag.style.top = (y - elemToDrag.offsety) + "px";
  elemToDrag.style.left = (x - elemToDrag.offsetx) + "px";
}

function getPos(el) {
    // yay readability
    for (var lx=0, ly=0;
         el != null;
         lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
    return {x: lx,y: ly};
}

function make_Container(elem)
{
    elem.style.position = "absolute";

    elem.create = function(target,x,y)
    {
    	this.style.left = (x - getPos(target).x || this.offsetLeft) + "px"; 
    	this.style.top = (y - getPos(target).y || this.offsetTop) + "px";
        target.appendChild(this);   
    }

    elem.onmousedown = function(e)
    {
        elemToDrag = this;
        this.offsetx = e.pageX - this.offsetLeft; 
        this.offsety = e.pageY - this.offsetTop;
        document.body.addEventListener('mousemove', moveelem);
    }

    elem.onmouseup = function()
    {
        document.body.removeEventListener('mousemove', moveelem);
        elemToDrag = null;
    }
    return elem;
}

function allowDrop(ev) {
    ev.preventDefault();
    ev.target.offx = ev.clientX;
    ev.target.offy = ev.clientY;
}

function drag(ev) {
    ev.dataTransfer.setData("ElementName", ev.target.name);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("ElementName");
    elements[data](ev.target,ev.target.offx,ev.target.offy);
}
