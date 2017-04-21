var elemToDrag = null;
var elements = new function(){};
 
 
elements["Button"] = function element_button(e,x,y)
{
	b = document.createElement("button");
	b = make_Container(b);
	b.appendChild(document.createTextNode("Button"));
	b.create(e,x,y)
}
 
elements["Text Input"] = function element_text(e,x,y)
{
	b = document.createElement("input");
    b.type = "text"
	b = make_Container(b);
	//b.appendChild(document.createTextNode(""));
	b.create(e,x,y)
}

elements["Checkbox"] = function element_checkbox(e,x,y)
{
	b = document.createElement("input");
    b.type = "checkbox"
	b = make_Container(b);
	//b.appendChild(document.createTextNode(""));
	b.create(e,x,y)
}

elements["Label"] = function element_Label(e,x,y)
{
	b = document.createElement("div");
	b = make_Container(b);
	b.appendChild(document.createTextNode("Label"));
	b.create(e,x,y)
}

function moveelem(e) 
{
  x = e.clientX;
  y = e.clientY + document.documentElement.scrollTop;

  posy = (y - elemToDrag.offsety);

    if(posy<0)
    { 
        posy = 0;
    }
    else if(posy > elemToDrag.fencey - elemToDrag.offsetHeight) 
    {
        posy = elemToDrag.fencey - elemToDrag.offsetHeight;
    } 

  posx = (x - elemToDrag.offsetx);

    if(posx<0) posx = 0;
    else if(posx > elemToDrag.fencex - elemToDrag.offsetWidth) posx = elemToDrag.fencex - elemToDrag.offsetWidth;

    elemToDrag.setpos(posx,posy);

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

    elem.setpos = function(x,y)
    {
        this.style.top = y + "px";
        this.style.left = x + "px";
        this.settingsbar.setpos(x,y);
    }

    elem.create = function(target,x,y)
    {
    	this.style.left = (x - getPos(target).x || this.offsetLeft) + "px"; 
    	this.style.top = (y - getPos(target).y || this.offsetTop) + document.documentElement.scrollTop + "px";

        this.settingsbar = settingsbar(target,this);
        this.settingsbar.add(settings_Icon("textedit.svg",null));

        target.appendChild(this);   
    }

    elem.onmousedown = function(e)
    {
        elemToDrag = this;
        this.offsetx = e.pageX - this.offsetLeft; 
        this.offsety = e.pageY - this.offsetTop;
        this.fencey = this.offsetParent.clientHeight;
        this.fencex = this.offsetParent.clientWidth;
        document.body.addEventListener('mousemove', moveelem);
        elem.settingsbar.make_Visible();
    }

    document.onmouseup = function()
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
