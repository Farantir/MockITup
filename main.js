function menubar_Item(name,onclick)
{
    li = document.createElement("li");
    li.a = document.createElement("a");
    li.text = document.createTextNode(name);
    li.onclick = onclick;

    li.appendChild(a);
    a.appendChild(text);
    return li;
}

function menubar()
{
    menu = document.createElement("ul");
    menu.add = function(entry)
    {
        this.menu.appendChild(entry);
    }
    return menu;
}
