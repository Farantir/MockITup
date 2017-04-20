var elemToDrag = null;
 
function new_Screen()
{
	screen = document.createElement("div");
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


function make_Container(elem)
{
    elem.style.position = "absolute";

    elem.create = function(target)
    {
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
}

function drag(ev) {
    ev.dataTransfer.setData("ElementName", ev.target.name);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("ElementName");
    //ev.target.appendChild(document.getElementById(data));
}
