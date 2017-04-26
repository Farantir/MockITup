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
	
	evoker.settingsbar.addActionIcon(addActionToSettings("Action.png", this));
	target.settingsbar.addActionIcon(addActionToSettings("Action.png", this));
}

function addActionToSettings(png, transaction) {	
	var icon = settings_Icon(png, delete_transaction);
	
	icon.transaction = transaction;
	icon.evoker = transaction.evoker;
	icon.target = transaction.target;
	
	icon.onmouseover = function(){
		this.borderevoker = this.evoker.style.border;
		this.bordertarget = this.target.style.border;
		
		this.evoker.style.border = "2px solid #ea5a00";
		this.target.style.border = "2px solid #b43092";				
	}
	
	icon.onmouseout = function(e){
		this.evoker.style.border = this.borderevoker;
	    this.target.style.border = this.bordertarget;	
	}
	
	return icon;
	
}

function goto_logick()
{
    $("screencontainer").style.display="";
	if($("testscreencontainer")) $("testscreencontainer").remove();
    grafic_elements.style.display = "none";
    logick_elements.style.display = "none";
    inlogickview = true;
    notifikationbar.show("Klick on the Element that should cause an Event");
}

function general_event_stuff()
{
    notifikationbar.show("Klick on the Element that should be the Target of this Event");
    GLOBAL_OVERRIDE = global_overrride_onclick;
    logick_elements.style.display = "none";
}

function settextchanged(e)
{
    general_event_stuff();
    evoker = this.parentElement.eventtarget;
    evoking_aktion = "textlink";
}

function setclickevent(e)
{
    general_event_stuff();
    evoker = this.parentElement.eventtarget;
    evoking_aktion = "click";
}


function setswipeleft(e)
{
    general_event_stuff();
    evoker = this.parentElement.eventtarget;
    evoking_aktion = "swipeleft";
}

function setswiperight(e)
{
    general_event_stuff();
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
    notifikationbar.hide();
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


function delete_transaction(e) {
	console.log(e.target.parentElement);
	
	var elements = e.target.parentElement.evoker.settingsbar.ul2;
	for (elem of elements.children) {
		if (elem.children[0].transaction == e.target.transaction)
		{
			elem.remove();
		}
	}
	
	var elements = e.target.parentElement.target.settingsbar.ul2;
	for (elem of elements.children) {
		if (elem.children[0].transaction == e.target.transaction)
		{
			elem.remove();
		}
	}
	
   logick_transaktions.splice(logick_transaktions.indexOf(e.target.parentElement.transaction), 1);
   
   e.target.parentElement.evoker.style.border = e.target.parentElement.borderevoker;
   e.target.parentElement.target.style.border = e.target.parentElement.bordertarget;


}
	
