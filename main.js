function test()
{
   test = menubar();
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

function menubar()
{
    menu = document.createElement("ul");
    //menu.style.display = "none";
    menu.classList.add("menubar");
    document.body.appendChild(menu);
    
    menu.add = function(entry)
    {
        this.appendChild(entry);
    }

    menu.make_Visible = function()
    {
        for(m of document.getElementsByClassName("menubar"))
        {
            m.style.display = "none";
        }
        this.style.display = "";
    }

    return menu;
}
