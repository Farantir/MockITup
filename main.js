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
