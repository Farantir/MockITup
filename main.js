var elemToDrag = null;
 
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


function menubar_Item(name,onclick)
{
    li = document.createElement("li");
    li.a = document.createElement("a");
    li.text = document.createTextNode(name);
    li.onclick = onclick;

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
