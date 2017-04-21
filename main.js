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
	$("screencontainer").insertBefore(screen,newscreenbutton);
	screen.classList.add("screengrafikeditor");
}

function create_Screen(){
	screen = document.createElement("div");
	screen.ondragover = allowDrop;
	screen.ondrop = drop;
	
	if(landscape_mode) screen.classList.add("screenlandscape");
	else screen.classList.add("screenportait");
	
	return screen;
}

function elementbar_Item(name,onclick)
{
	el = menubar_Item(name,onclick,"elItem");
	el.draggable = true;
	el.ondragstart = drag;
	el.onclick = onclick;
	return el;
}

function menubar_Item(name,onclick,classname,aktive)
{
	classname = classname || "menuItem";
    li = document.createElement("li");
    li.name = name;
    li.a = document.createElement("a");
    if(aktive) li.a.classList.add("active");
    li.text = document.createTextNode(name);
    li.onclickoverload = onclick;
    li.onclick = function()
    {
   		for(m of document.getElementsByClassName(classname))
        {
            m.a.classList = [];
        }
        this.a.classList.add("active");
    	if(this.onclickoverload) this.onclickoverload();
    }
    li.classList.add(classname);

    li.appendChild(li.a);
    li.a.appendChild(li.text);
    return li;
}

function elementbar()
{
    return menubar("elementbar");
}

function menubar(classname)
{
    classname = classname || "menubar";

    menu = document.createElement("ul");
    menu.style.display = "none";
    menu.classList.add(classname);
    document.body.appendChild(menu);
    
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

    return menu;
}

function settingsbar(parentsparent,parent)
{
    menu = document.createElement("div");
    menu.ul = document.createElement("ul");
    menu.appendChild(menu.ul);   
    menu.classList.add("settingsbar");
    menu.style.display = "none";
    menu.parent = parent;

    menu.setpos = function(x,y)
    {
        this.style.top = (y + this.parent.offsetHeight + 20) + "px";
        this.style.left = x + "px";
    }

    menu.setpos(parent.offsetLeft,parent.offsetTop);

    parentsparent.appendChild(menu);

    menu.add = function(x)
    {
        this.ul.appendChild(x);
    }

    menu.make_Visible = function()
    {
        this.style.display = "";
    }

    menu.hide = function()
    {
        this.style.display = "none";
    }

    return menu;
}

function settings_Icon(icon,onclick)
{
    elem = document.createElement("li");
    elem.img = document.createElement("img");
    elem.appendChild(elem.img);
    elem.img.src = icon;
    elem.img.height = 25;
    elem.img.width = 25;
    return elem;
}

function text_input_overlay()
{
    
}
