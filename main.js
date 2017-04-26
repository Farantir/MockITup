/*
function test()
{
   test = menubar();
   test.add(menubar_Item("Test1"));
   test.add(menubar_Item("Test2"));
   test.add(menubar_Item("Test3"));
   test.add(menubar_Item("Test4"));
   test.make_Visible();

    li = document.createElement("div");
    li.style.backgroundColor = "red";
    li.style.height = "50px";
    li.style.width = "20px";
    li.style.top = "200px";
    li.style.left = "300px";
    li = make_Container(li);
    document.body.appendChild(li);

   test = elementbar();
   test.add(menubar_Item("Test1"));
   test.add(menubar_Item("Test2"));
   test.add(menubar_Item("Test3"));
   test.add(menubar_Item("Test4"));
   test.make_Visible();
}
*/

function new_Screen()
{
	screen = create_Screen();
	$("screencontainer").insertBefore(screen,$("createnewscreenportrait"));
	screen.classList.add("screengrafikeditor");
    screen.logick_menu = logick_menu(screen);
    screen.logick_menu.add(logick_menu_item("Change to This Screen",logick_button_changescreen));
    screen.onmousedown = function(e)
    {
        if(GLOBAL_OVERRIDE)
        {
            GLOBAL_OVERRIDE(e);
            e.stopPropagation();
            return;
        }
        logick_elements.eventtarget = this;
        logik_bar_make_visible();
        e.stopPropagation();
    }
    return screen;
}

function create_Screen(){
	screen = document.createElement("div");
	screen.ondragover = allowDrop;
	screen.ondrop = drop;
	
	if(landscape_mode) screen.classList.add("screenlandscape");
	else screen.classList.add("screenportait");
	
	return screen;
}

/*Creates an Item for the left bar. Needs to be added to one of those bars later on*/
function elementbar_Item(name,onclick)
{
	el = menubar_Item(name,onclick,"elItem");
	el.draggable = true;
	el.ondragstart = drag;
	el.onclick = onclick;
	return el;
}

/*Creates an item for the top menu bar. Needs to be addet to one of those bars later on*/
function menubar_Item(name,onclick,classname,aktive)
{
	classname = classname || "menuItem";
    li = document.createElement("li");
    li.name = name;
    li.a = document.createElement("a");
    if(aktive) li.a.classList.add("active");
    li.text = document.createTextNode(name);
    li.onclickoverload = onclick;
    li.onclick = function(e)
    {
   		for(m of document.getElementsByClassName(classname))
        {
            m.a.classList = [];
        }
        this.a.classList.add("active");
    	if(this.onclickoverload) this.onclickoverload();
        e.stopPropagation();
    }
    li.classList.add(classname);

    li.appendChild(li.a);
    li.a.appendChild(li.text);
    return li;
}

/*Creats an empty side menu bar*/
function elementbar()
{
    var elm = menubar("elementbar");
    elm.onmousedown = (e)=>{e.stopPropagation();};
    return elm;
}

/*Creates an Empty menu bar of given type. by default a top menu bar is created*/
function menubar(classname)
{
    classname = classname || "menubar";

    menu = document.createElement("ul");
    menu.style.display = "none";
    menu.classList.add(classname);
    document.body.appendChild(menu);
    menu.flush = function(){for(m of document.getElementsByClassName("menuItem"))m.a.classList = [];};
    menu.add = function(entry)
    {
        this.appendChild(entry);
    }


    menu.make_Visible = function()
    {
        for(m of document.getElementsByClassName(classname))
        {
            m.style.display = "none";
        }
        this.style.display = "";
    }
    menu.hide = function()
    {
       this.style.display = "none"; 
    }

    return menu;
}

function hide_settingsbar()
{
    for(bar of document.getElementsByClassName("settingsbar")) bar.hide(); 
    document.body.removeEventListener("mousedown",hide_settingsbar);
}

/*Creates a settignsbar to be displayed, when one of the elemtens in the Grafik edit screen is clicked or dragged*/
function settingsbar(parent)
{
    menu = document.createElement("div");
    menu.ul = document.createElement("ul");
	menu.ul2 = document.createElement("ul");
	//List of settings images
    menu.appendChild(menu.ul);   	
	//List of Actions Images 
	menu.appendChild(menu.ul2);
	
    menu.classList.add("settingsbar");
    menu.style.display = "none";
    menu.parent = parent;

    menu.onmousedown = (e)=>{e.stopPropagation();};

    menu.setpos = function()
    {
        this.style.top = (getPos(this.parent).y + this.parent.offsetHeight + 20) + "px";
        this.style.left = getPos(this.parent).x + "px";
    }

    menu.setpos(parent.offsetLeft,parent.offsetTop);

    document.body.appendChild(menu);

    menu.add = function(x)
    {
        this.ul.appendChild(x);
    }
	
	  menu.addActionIcon = function(x)
    {
        this.ul2.appendChild(x);
    }
	
	menu.removeActionIvon = function(x)
	{
		this.ul2.removeChild(x);	
	}

    menu.make_Visible = function()
    {
        for(bar of document.getElementsByClassName("settingsbar")) bar.hide();
        this.style.display = "";
        document.body.addEventListener("mousedown",hide_settingsbar);
    }

    menu.hide = function()
    {
        this.style.display = "none";
    }
   
    /*Recalculates Arrow positions after resize*/
    menu.recalculate_positons = function()
    {
        menu = this;
        menu.setpos();

        /*calculation used to determen the position of the 8 scale arrows*/
        posparent = getPos(menu.parent);
        posmenu = getPos(menu);

        scaletop = posparent.y - posmenu.y;
        scalebottom = scaletop + menu.parent.offsetHeight;
        scaleleft = posparent.x - posmenu.x;
        scaleright = scaleleft + menu.parent.offsetWidth;

        /*Moving the 8 scaling arrows at there corresponding position*/
        menu.scaleBottomRight.setpose(scaleright,scalebottom);
        menu.scaleTopRight.setpose(scaleright,scaletop-18);
        menu.scaleBottomLeft.setpose(scaleleft-18,scalebottom);
        menu.scaleTopLeft.setpose(scaleleft-18,scaletop-18);

        menu.scaleTop.setpose(scaleleft+(scaleright-scaleleft)/2 - 9,scaletop-18);
        menu.scaleBottom.setpose(scaleleft+(scaleright-scaleleft)/2 - 9,scalebottom);
        menu.scaleRight.setpose(scaleright,scaletop + (scalebottom - scaletop)/2-9);
        menu.scaleLeft.setpose(scaleleft-18,scaletop + (scalebottom - scaletop)/2-9);

    }

    /*Gets called after parent and menu are displayed*/ 
    menu.initialise = function()
    {
        menu = this;
      
        /*calculation used to determen the position of the 8 scale arrows*/
        posparent = getPos(menu.parent);
        posmenu = getPos(menu);

        scaletop = posparent.y - posmenu.y;
        scalebottom = scaletop + menu.parent.offsetHeight;
        scaleleft = posparent.x - posmenu.x;
        scaleright = scaleleft + menu.parent.offsetWidth;

        /*creating the 8 scaling arrows at there corresponding position*/
        menu.scaleBottomRight = scale_icon(menu,"arrow_left.png",scaleright,scalebottom);
        menu.scaleTopRight = scale_icon(menu,"arrow_right.png",scaleright,scaletop-18);
        menu.scaleBottomLeft = scale_icon(menu,"arrow_right.png",scaleleft-18,scalebottom);
        menu.scaleTopLeft = scale_icon(menu,"arrow_left.png",scaleleft-18,scaletop-18);

        menu.scaleTop = scale_icon(menu,"arrow_vertical.png",scaleleft+(scaleright-scaleleft)/2 - 9,scaletop-18);
        menu.scaleBottom = scale_icon(menu,"arrow_vertical.png",scaleleft+(scaleright-scaleleft)/2 - 9,scalebottom);
        menu.scaleRight = scale_icon(menu,"arrow_horizontal.png",scaleright,scaletop + (scalebottom - scaletop)/2-9);
        menu.scaleLeft = scale_icon(menu,"arrow_horizontal.png",scaleleft-18,scaletop + (scalebottom - scaletop)/2-9);


        /*Initializing "Drag" of resize arrow*/
        menu.init_scaling = function(e)
        {
            e.stopPropagation();
            e.preventDefault();
            elemToDrag = e.target;
            elemToDrag.offsetx = e.pageX - getPos(elemToDrag).x; 
            elemToDrag.offsety = e.pageY - getPos(elemToDrag).y;

            document.body.addEventListener('mousemove', moveelem);  
        };

        /*giving each arrow its resizing effekt*/
        menu.scaleBottomRight.onmousedown = menu.init_scaling;
        menu.scaleRight.onmousedown = menu.init_scaling;
        menu.scaleBottom.onmousedown = menu.init_scaling;
        menu.scaleBottomLeft.onmousedown = menu.init_scaling;
        menu.scaleTopRight.onmousedown = menu.init_scaling;
        menu.scaleTopLeft.onmousedown = menu.init_scaling;
        menu.scaleTop.onmousedown = menu.init_scaling;
        menu.scaleLeft.onmousedown = menu.init_scaling;



        menu.scaleBottomRight.setpos = function(x,y)
        {
            origin = getPos(this.parentElement.parent);
            this.parentElement.parent.scale((x - origin.x),(y - origin.y));            
            this.parentElement.recalculate_positons();      
        }
        menu.scaleBottom.setpos = function(x,y)
        {
            origin = getPos(this.parentElement.parent);
            this.parentElement.parent.scale(this.parentElement.parent.offsetWidth,(y - origin.y));            
            this.parentElement.recalculate_positons();
            
        }
        menu.scaleRight.setpos = function(x,y)
        {
            origin = getPos(this.parentElement.parent);
            this.parentElement.parent.scale((x - origin.x),this.parentElement.parent.offsetHeight);            
            this.parentElement.recalculate_positons();
            
        }
        menu.scaleTopLeft.setpos = function(x,y)
        {
            origin = getPos(this.parentElement.parent);
            oldpos = {x: this.parentElement.parent.offsetLeft, y: this.parentElement.parent.offsetTop};
            oldscale = {w: this.parentElement.parent.offsetWidth, h: this.parentElement.parent.offsetHeight};
            
            elempos = getPos(this);

            scalex =(origin.x - x + (elempos.x - origin.x));
            scaley =(origin.y - y + (elempos.y - origin.y));

            this.parentElement.parent.setpos(oldpos.x - scalex, oldpos.y - scaley);
            this.parentElement.parent.scale(oldscale.w + scalex, oldscale.h + scaley);
            this.parentElement.recalculate_positons();      
        }
        menu.scaleTop.setpos = function(x,y)
        {
            origin = getPos(this.parentElement.parent);
            oldpos = {x: this.parentElement.parent.offsetLeft, y: this.parentElement.parent.offsetTop};
            oldscale = {w: this.parentElement.parent.offsetWidth, h: this.parentElement.parent.offsetHeight};
            
            elempos = getPos(this);

            scalex =(origin.x - x + (elempos.x - origin.x));
            scaley =(origin.y - y + (elempos.y - origin.y));

            this.parentElement.parent.setpos(oldpos.x, oldpos.y - scaley);
            this.parentElement.parent.scale(oldscale.w , oldscale.h + scaley);
            this.parentElement.recalculate_positons();      
        }
        menu.scaleLeft.setpos = function(x,y)
        {
            origin = getPos(this.parentElement.parent);
            oldpos = {x: this.parentElement.parent.offsetLeft, y: this.parentElement.parent.offsetTop};
            oldscale = {w: this.parentElement.parent.offsetWidth, h: this.parentElement.parent.offsetHeight};
            
            elempos = getPos(this);

            scalex =(origin.x - x + (elempos.x - origin.x));
            scaley =(origin.y - y + (elempos.y - origin.y));

            this.parentElement.parent.setpos(oldpos.x - scalex, oldpos.y);
            this.parentElement.parent.scale(oldscale.w + scalex, oldscale.h);
            this.parentElement.recalculate_positons();      
        }
        menu.scaleBottomLeft.setpos = function(x,y)
        {
            origin = getPos(this.parentElement.parent);
            oldpos = {x: this.parentElement.parent.offsetLeft, y: this.parentElement.parent.offsetTop};
            oldscale = {w: this.parentElement.parent.offsetWidth, h: this.parentElement.parent.offsetHeight};
            
            elempos = getPos(this);

            scalex =(origin.x - x + (elempos.x - origin.x));
            scaley =(origin.y - y + (elempos.y - origin.y));

            this.parentElement.parent.setpos(oldpos.x - scalex, oldpos.y);
            this.parentElement.parent.scale(oldscale.w + scalex, (y - origin.y));
            this.parentElement.recalculate_positons();      
        }
        menu.scaleTopRight.setpos = function(x,y)
        {
            origin = getPos(this.parentElement.parent);
            oldpos = {x: this.parentElement.parent.offsetLeft, y: this.parentElement.parent.offsetTop};
            oldscale = {w: this.parentElement.parent.offsetWidth, h: this.parentElement.parent.offsetHeight};
            
            elempos = getPos(this);

            scalex =(origin.x - x + (elempos.x - origin.x));
            scaley =(origin.y - y + (elempos.y - origin.y));

            this.parentElement.parent.setpos(oldpos.x, oldpos.y - scaley);
            this.parentElement.parent.scale((x - origin.x) , oldscale.h + scaley);
            this.parentElement.recalculate_positons();      
        }

    }
    
    return menu;
}

/*function to create an icon in the custom settings bar of an element*/
function settings_Icon(icon,onclick)
{
    elem = document.createElement("li");
    elem.img = document.createElement("img");
    elem.appendChild(elem.img);
    elem.img.src = icon;
    elem.img.height = 25;
    elem.img.width = 25;
    
    elem.onclick = onclick;

    return elem;
}

/*function to create one of the scale arrows*/
function scale_icon(parent,img,x,y)
{
    icon = document.createElement("img");
    icon.classList.add("arrow");
    icon.src = img;
    icon.style.top = y + "px";
    icon.style.left = x + "px";
    parent.appendChild(icon);

    icon.setpose = function(x,y)
    {
        this.style.top = y + "px";
        this.style.left = x + "px";
    }    

    return icon;
}

/*Function to create a menu used for changing the text of a given resource*/
function text_input_overlay(target,set)
{
    menu = document.createElement("div");
    menu.classList.add("textinput");
    
    menu.onmousedown = (x)=>{x.stopPropagation();};    

    menu.accept = document.createElement("button");
    menu.accept.appendChild(document.createTextNode("Accept"));

    menu.cancel = document.createElement("button");
    menu.cancel.appendChild(document.createTextNode("Cancel"));

    menu.accept.input = document.createElement("input");
    menu.accept.set = set;
    menu.accept.target = target;

    menu.appendChild(menu.accept.input);
    menu.appendChild(menu.cancel);
    menu.appendChild(menu.accept);

    document.body.appendChild(menu);
    
    menu.style.top = (getPos(menu.accept.target).y + menu.accept.target.offsetHeight + 5) + "px";
    menu.style.left = getPos(menu.accept.target).x + "px";

    menu.cancel.onclick = function(){this.parentElement.remove();}
    menu.accept.onclick = function(){this.set(this.input.value);this.parentElement.remove();}
}

/*Notifikation bar at the top of the screen*/
function create_notifikationbar(notifikationtext)
{
    var not_bar = document.createElement("div");
    not_bar.classList.add("textbar");
    document.body.appendChild(not_bar);
    not_bar.style.display = "none";
    not_bar.show = function(textmessage)
    {
        this.innerHTML = textmessage;
        this.style.display = "";
        setTimeout(function(){notifikationbar.hide();}, textmessage.length*100)
    }
    not_bar.hide = function()
    {
       this.style.display = "none";
    }
    return not_bar;
}
