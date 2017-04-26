var elemToDrag = null;
var elements = new function(){};
var GLOBAL_OVERRIDE = null;
 
 
elements["Button"] = function element_button(e,x,y)
{
	b = document.createElement("button");
	b = make_Container(b);
    
    b.jsoncreate = function(target)
    {
        this.settingsbar.add(settings_Icon("textedit.svg",function(){text_input_overlay(this.parentElement.parentElement,function(value){this.target.parent.innerHTML = value;})}));
    }
	b.appendChild(document.createTextNode("Button"));
    b.logick_menu.add(logick_menu_item("Text Link",logick_button_textlink));
	b.create(e,x,y)
}
 
elements["Text Input"] = function element_text(e,x,y)
{
	b = document.createElement("input");
    b.type = "text";
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
    b.jsoncreate = function(target)
    {
        this.settingsbar.add(settings_Icon("textedit.svg",function(){text_input_overlay(this.parentElement.parentElement,function(value){this.target.parent.innerHTML = value;})}));
    }
	b.appendChild(document.createTextNode("Label"));
    b.logick_menu.add(logick_menu_item("Text Link",logick_button_textlink));
	b.create(e,x,y)
}
elements["Picture"] = function element_Label(e,x,y)
{
	b = document.createElement("img");
    b.src = "picture.png";
    b.draggable="false";
    b.ondragstart = function() { return false; };
	b = make_Container(b);
    b.jsoncreate = function(target)
    {
        this.settingsbar.add(settings_Icon("picture.png",function(){}));
    }
	b.create(e,x,y)
}

elements["Liste"] = function element_List(e,x,y)
{
	b = document.createElement("div");
	b = make_Container(b);
    b.jsoncreate = function(target)
    {
        this.settingsbar.add(settings_Icon("plus.png",function(){element_Listelem(this.parentElement.parentElement.parent);}));
    }
	b.logick_menu.add(logick_menu_item("Add List Entry",logick_button_add_list_element));
	b.style.height = "200px";
	b.style.width = "200px";
	b.style.overflow = "scroll";
	b.create(e,x,y);
}

function element_Listelem(e,x,y)
{
	b = document.createElement("div");
	make_Container(b)
	b.appendChild(document.createTextNode("Label"));
	e.appendChild(b)
	b.setpos = ()=>{};
	b.scale = ()=>{};
	b.jsoncreate = function(target)
    {
        this.settingsbar.add(settings_Icon("textedit.svg",function(){text_input_overlay(this.parentElement.parentElement,function(value){this.target.parent.innerHTML = value;})}));
    }
    b.logick_menu.add(logick_menu_item("Text Link",logick_button_textlink));
    b.create(e,b.offsetLeft,b.offsetTop);
    
    b.settingsbar.scaleBottomRight.remove();
    b.settingsbar.scaleBottom.remove();
    b.settingsbar.scaleBottomLeft.remove();
    b.settingsbar.scaleRight.remove();
    b.settingsbar.scaleTop.remove();
    b.settingsbar.scaleTopLeft.remove();
    b.settingsbar.scaleTopRight.remove();
    b.settingsbar.scaleLeft.remove();
    
    b.style.position = "relative";
    b.style.margin = "20px"; 
    b.classList.add("listenelement");
}

function moveelem(e) 
{
  x = e.clientX;
  y = e.clientY + document.documentElement.scrollTop;

  posy = (y - elemToDrag.offsety);
  posx = (x - elemToDrag.offsetx);

  elemToDrag.setpos(posx,posy);
}


/*Calculates position of an element relative to the document origin*/
function getPos(el) {
    // yay readability
    for (var lx=0, ly=0;
         el != null;
         lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
    return {x: lx,y: ly};
}

/*Adds all functions and properties needed for an element in the Grafik edit view*/
function make_Container(elem)
{
    elem.style.position = "absolute";
    elem.settingsbar = settingsbar(elem);
    elem.jsoncreate = function(){};

    /*Defines if the element ist visible in the test renderer*/
    elem.isVisible = true;
    elem.dataset.isVisible = elem.isVisible;
    
    /*Menu containing the logic funktions of the element*/
    elem.logick_menu = logick_menu(elem);
    elem.logick_menu.add(logick_menu_item("Hide",logick_button_hide));
    elem.logick_menu.add(logick_menu_item("Make Visible",logick_button_unhide));
    elem.logick_menu.add(logick_menu_item("Toggle Visibility",logick_button_toggle_visibility));
	
	

    elem.togglevisible = function()
    {
        if(this.isVisible) this.style.opacity = "0.3"; 
        else this.style.opacity = "1";
        this.isVisible = !this.isVisible;
        this.dataset.isVisible = this.isVisible;
    }

    elem.scale = function(x,y)
    {

        if(this.offsetTop > this.fencey - y) y = this.fencey - this.offsetTop;
        if(this.offsetLeft > this.fencex - x) x = this.fencex - this.offsetLeft;
        this.style.height = y + "px";
        this.style.width = x + "px";
    }

    elem.setpos = function(x,y)
    {

        if(y<0)
        { 
            y = 0;
        }
        else if(y > this.fencey - this.offsetHeight) 
        {
            y = this.fencey - this.offsetHeight;
        } 

        if(x<0) x = 0;
        else if(x > this.fencex - this.offsetWidth) x = this.fencex - this.offsetWidth;

        this.style.top = y + "px";
        this.style.left = x + "px";
        this.settingsbar.setpos();
    }

    elem.create = function(target,x,y)
    {
        target.appendChild(this);

        /*setting button toproper position*/   
    	posx = (x - getPos(target).x || this.offsetLeft); 
    	posy = (y - getPos(target).y || this.offsetTop) + document.documentElement.scrollTop;

        this.fencey = this.offsetParent.clientHeight;
        this.fencex = this.offsetParent.clientWidth;

            if(posy<0)
            { 
                posy = 0;
            }
            else if(posy > this.fencey - this.offsetHeight) 
            {
                posy = this.fencey - this.offsetHeight;
            } 

            if(posx<0) posx = 0;
            else if(posx > this.fencex - this.offsetWidth) posx = this.fencex - this.offsetWidth;

            this.setpos(posx,posy);

        this.jsoncreate(target,x,y);

        this.offsetx = this.offsetLeft; 
        this.offsety = this.offsetTop;

        this.settingsbar.add(settings_Icon("toggle_vis.png",()=>{this.togglevisible();}));
        this.settingsbar.add(settings_Icon("delete.svg",()=>
		{		
			for (trans of logick_transaktions)
			 {
				if (this == trans.evoker)
				{
					remove_element_actionbar(trans);	
				}
				else if (this == trans.target)
				{
					remove_element_actionbar(trans);	
				}
			 }
			this.settingsbar.remove();
			this.remove();
		}
			));
		
        elem.settingsbar.make_Visible();
        elem.settingsbar.initialise();
    }

    elem.onmousedown = function(e)
    {
        if(GLOBAL_OVERRIDE){GLOBAL_OVERRIDE(e);e.stopPropagation();return;}
        logick_elements.eventtarget = this;
        logik_bar_make_visible();
        elemToDrag = this;
        this.offsetx = e.pageX - this.offsetLeft; 
        this.offsety = e.pageY - this.offsetTop;
        this.fencey = this.offsetParent.clientHeight;
        this.fencex = this.offsetParent.clientWidth;
        document.body.addEventListener('mousemove', moveelem);
        elem.settingsbar.setpos();
        elem.settingsbar.make_Visible();

        e.stopPropagation();
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
