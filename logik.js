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
