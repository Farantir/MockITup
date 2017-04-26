var logick_transaktions = [];
var evoker = null;
var evoking_aktion = null;
var inlogickview = false;

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
    logick_elements.style.display = "none";
    inlogickview = true;
}

function settextchanged(e)
{
    GLOBAL_OVERRIDE = global_overrride_onclick;
    logick_elements.style.display = "none";
    evoker = this.parentElement.eventtarget;
    evoking_aktion = "textlink";
}

function setclickevent(e)
{
    GLOBAL_OVERRIDE = global_overrride_onclick;
    logick_elements.style.display = "none";
    evoker = this.parentElement.eventtarget;
    evoking_aktion = "click";
}


function setswipeleft(e)
{
    GLOBAL_OVERRIDE = global_overrride_onclick;
    logick_elements.style.display = "none";
    evoker = this.parentElement.eventtarget;
    evoking_aktion = "swipeleft";
}

function setswiperight(e)
{
    GLOBAL_OVERRIDE = global_overrride_onclick;
    logick_elements.style.display = "none";
    evoker = this.parentElement.eventtarget;
    evoking_aktion = "swiperight";
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

function reset_transaktion(sourche)
{
    evoking_aktion = null;
    evoker = null;
    sourche.parentElement.hide();
    logick_elements.make_Visible();
}

function logick_button_hide()
{
    logick_transaktions.push(new logick_transaktion(evoker,evoking_aktion,this.parentElement.parent,"hide"));
    reset_transaktion(this);
}

function logick_button_unhide()
{
    logick_transaktions.push(new logick_transaktion(evoker,evoking_aktion,this.parentElement.parent,"unhide"));
    reset_transaktion(this);
}

function logick_button_toggle_visibility()
{
    logick_transaktions.push(new logick_transaktion(evoker,evoking_aktion,this.parentElement.parent,"togglevisibility"));
    reset_transaktion(this);
}

function logick_button_changescreen()
{
    logick_transaktions.push(new logick_transaktion(evoker,evoking_aktion,this.parentElement.parent,"changescreen"));
    reset_transaktion(this);
}

function logick_button_textlink()
{
    logick_transaktions.push(new logick_transaktion(evoker,evoking_aktion,this.parentElement.parent,"textlink"));
    reset_transaktion(this);
}

function logik_bar_make_visible()
{
   if(!inlogickview) return false;
   logick_elements.style.display = "";
   document.body.addEventListener("mousedown",logik_bar_hide);
}

function logik_bar_hide()
{
   logick_elements.style.display = "none";
   document.body.removeEventListener("mousedown",logik_bar_hide);
}
