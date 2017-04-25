var logick_transaktions = [];
var evoker = null;
var evoking_aktion = null;


function logick_transaktion(evoker,evoking_aktion,target,name)
{
    this.evoker = evoker;
    this.evoking_aktion = evoking_aktion;
    this.target = target;
    this.name = name;
}

function goto_logick()
{
    $("screencontainer").style.display="";
	if($("testscreencontainer")) $("testscreencontainer").remove();
    grafic_elements.style.display = "none";
    logick_elements.style.display = "";
}

elements["Click"] = function element_button(e,x,y)
{
    GLOBAL_OVERRIDE = global_overrride_onclick;
    logick_elements.style.display = "none";
    evoker = e;
    evoking_aktion = "click";
}

function global_overrride_onclick(e)
{
    e.target.logick_menu.make_Visible();
    GLOBAL_OVERRIDE = null;
}

/*Creates a custom logick menu, used to store logik aktions o a specifik element*/
function logick_menu(parent)
{
   l_menu = elementbar();
   l_menu.classList.add("element-aktion-menu");
   l_menu.parent = parent;
   return l_menu;
}

/*Creates an entry for the cutom logick menu*/
function logick_menu_item(name,onclick)
{
    return menubar_Item(name,onclick,"element-aktions");
}

/*
Applys logik trasaktion hide
function apply_aktion_Hide(e)
{

}
*/
function logick_button_hide()
{
    logick_transaktions.push(new logick_transaktion(evoker,evoking_aktion,this.parentElement.parent,"hide"));
    evoking_aktion = null;
    evoker = null;
    this.parentElement.hide();
}
