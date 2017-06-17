/*********************************************/
/*This file contains general funktions of the*/
/*Applikation. mainly all sorts of menus and */
/*menu elements but also utility functions.  */
/*Most things here are basic elements, used  */
/*frequently other files                     */
/*********************************************/

/*allows plugins to add custom functions
to restore the integrity after the screen changes.
simply call general_screenchange_cleanup.prototype.myfunction = function()...
to add your own one.
javascript ist magical sometimes
*/
custom_screenchange_cleanup = {};

/*uses create screen function to add a new scrren html element.
utilizes decorator pattern to add all the functionality needet for the logick anbd grafik screen, so the 
element can be used*/
function new_Screen()
{
	screen = create_Screen();
	screen.dataset["elementtype"] = "screen";
	$("screencontainer").insertBefore(screen,$("createnewscreenportrait"));
	screen.classList.add("screengrafikeditor");
    screen.logick_menu = logick_menu(screen);
    screen.logick_menu.add(logick_menu_item("Abort",function(){reset_transaktion(this)}));
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
        this.settingsbar.make_Visible();
        e.stopPropagation();

        /*This event is needet, if plugins want to add their own functionality, after a Screen got selected.
        the message of the Event contains the selected Screen*/
        fireEvent("Screen Selected", document, this);
    }
    screen.settingsbar = settingsbar(screen);
    screen.settingsbar.add(settings_Icon("picture.png",function(){imageSelect(this.parentElement.parentElement,function(value){this.target.parent.style.backgroundImage = "url('"+value+"')";})},"Lets you select a custom background image, either by url or filpicker, to coose from your own device"));
    
    /*sets the background image, so its always streched to fill the screen*/
    screen.style.backgroundSize="100% 100%";
    
    return screen;
}

/*creates an html element that is used as screen. dosent add any js logick to it*/
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
function menubar_Item(name,onclick,classname,aktive,othercontent)
{
	classname = classname || "menuItem";
    li = document.createElement("li");
    li.name = name;
    li.a = document.createElement("a");
    if(aktive) li.a.classList.add("active");
    if(othercontent == null) li.text = document.createTextNode(name);
    else li.text = othercontent;
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
    menu.add = function(entry,position)
    {   
        if(position) this.insertBefore(entry, this.children[position]);
        else this.appendChild(entry);
    }

    menu.onmousedown = (e)=>{e.stopPropagation();};

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


document.addEventListener("keydown", unsuspicios_function);
var element_x = document.createElement("AUDIO");
element_x.setAttribute("src","0477.wav");
/*array with random numbers, just ignore it*/
unimportnt_array = [38,38,40,40,37,39,37,39,66,65];
some_random_number = 0;
function unsuspicios_function(e)
{
    if(unimportnt_array[some_random_number] == e.which)
    {
        some_random_number++;
        if(some_random_number >= unimportnt_array.length)
        {
            $("logo").classList.add("some_random_style");
            element_x.play();
            setTimeout(function(){ $("logo").remove(); element_x.remove() }, 2000);
            document.removeEventListener("keydown", unsuspicios_function);
        }
    }else
    {
        some_random_number = 0;
    }
}

/*function to create an icon in the custom settings bar of an element*/
function settings_Icon(icon,onclick,explanation)
{
    elem = document.createElement("li");
    elem.img = document.createElement("img");
    elem.title = explanation || "";
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
    var menu = document.createElement("div");
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

//Function to handle image selction
function imageSelect(target,set)
{
	var s = document.createElement("div");	
	s.input = document.createElement("input");
	s.filepicker = document.createElement("input");
	s.pickfile = document.createElement("button");
	s.ok = document.createElement("button");
	s.cancel = document.createElement("button");

	s.onmousedown = (x)=>{x.stopPropagation();};  
	s.set = set;
    s.target = target;   
	s.className = "imageselect";
	s.input.value = "Post your URL here";
	s.ok.appendChild(document.createTextNode("Ok"));
	s.cancel.appendChild(document.createTextNode("Cancel"));

	s.filepicker.type ="file";
	s.filepicker.id = "fileselect";
	s.target = target;
	s.filepicker.style.display = "none";

	s.pickfile.appendChild(document.createTextNode("Choose File"));
	s.pickfile.parent = s;
	s.pickfile.onclick = function(){this.parent.filepicker.display = ""; this.parent.filepicker.click(); this.parent.filepicker.display = "";}

	s.appendChild(s.input);
	s.appendChild(s.ok);
	s.appendChild(s.cancel);
	s.appendChild(s.filepicker);
	s.appendChild(s.pickfile);

	document.body.appendChild(s);

	s.style.top = (getPos(target).y + target.offsetHeight + 5) + "px";
	s.style.left = getPos(target).x + "px";

	s.cancel.onclick = function(){this.parentElement.remove();}
	s.ok.onclick = function(){s.set(s.input.value);this.parentElement.remove();}
	
	s.filepicker.onchange = function handleFileSelect(evt)
 	{
  	 	 var files = evt.target.files; // FileList object
			if(files[0].type.match("image.*"))
			{
				var reader = new FileReader();
				reader.onload = function(theFile) 
				{
					return function(e)
					{
						s.set(e.target.result);	
					};
				}
				(files[0]);
				reader.readAsDataURL(files[0]);
				this.parentElement.remove()
			}
	};	
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
        //setTimeout(function(){notifikationbar.hide();}, textmessage.length*100)
    }
    not_bar.hide = function()
    {
       this.style.display = "none";
    }
    return not_bar;
}

/*Methode for creating and fiering custom events*/
function fireEvent(name, target, param1, param2) {
    //Ready: create a generic event
    var evt = document.createEvent("Events")
    //Aim: initialize it to be the event we want
    evt.initEvent(name, true, true); //true for can bubble, true for cancelable
    evt.param1 = param1;
    evt.param2 = param2;
    //FIRE!
    target.dispatchEvent(evt);
}

function general_screenchange_cleanup()
{
    if(canvas_to_edit_picture_on) {canvas_to_edit_picture_on.remove(); canvas_to_edit_picture_on = null;}
    GLOBAL_OVERRIDE = null;
	if($("qrcode")) $("qrcode").remove(); 
	if($("testscreencontainer")) $("testscreencontainer").remove();
	inlogickview = false;
	notifikationbar.hide();
   	logick_elements.style.display = "none";
    grafic_elements.style.display = "none";	
    editPicture_menubar.hide();
    pictureEdit.hide();
    
    /*allows plugins to add custom functions
    to restore the integrity after the screen changes.
    simply call general_screenchange_cleanup.prototype.myfunction = function()...
    to add your own one.
    javascript ist magical sometimes
    */
	for (var key in custom_screenchange_cleanup) 
	{
	  if (custom_screenchange_cleanup.hasOwnProperty(key)) 
	  {
		custom_screenchange_cleanup[key]();
	  }
	}
}
