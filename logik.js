function goto_logick()
{
    $("screencontainer").style.display="";
	if($("testscreencontainer")) $("testscreencontainer").remove();
    grafic_elements.style.display = "none";
    logick_elements.style.display = "";
}

elements["Click"] = function element_button(e,x,y)
{
}

function logick_menu()
{
   logick_menu = elementbar();
   return logick_menu;
}

function logick_menu_item(name,onclick)
{
    return menubar_Item(name,onclick,"element-aktions");
}
