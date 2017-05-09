var logick_transaktions = [];
var evoker = null;
var evoking_aktion = null;
var inlogickview = false;
var complex_transaktion;
/*objekt that contains the explanation for all logick events and aktions. is needet for the info bar*/
var logick_dictionary = {};
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
	icon.title = "Clicking this Icon will Delete the logick transaktion \n The Evoker of the transaktion ist marked in Orange, the Target ist marked in Purpil";
	
	icon.onmouseover = function(){
		this.borderevoker = this.evoker.style.border;
		this.bordertarget = this.target.style.border;
		
		this.evoker.style.border = "solid #ea5a00";
		this.target.style.border = "solid #b43092";		
		
		notifikationbar.show("[Click To Delete] <br>" + logick_dictionary[this.transaction.evoking_aktion] + " the Orange Element " + logick_dictionary[this.transaction.name] + " the Purpil Element");		
	}
	
	icon.onmouseout = function(e){
		this.evoker.style.border = this.borderevoker;
	    this.target.style.border = this.bordertarget;
	    
	    notifikationbar.hide();	
	}
	
	return icon;
	
}

function goto_logick()
{
	general_screenchange_cleanup();
    $("screencontainer").style.display="";
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
    evoking_aktion = "textchanged";
}
logick_dictionary["textchanged"] = "changing the text of";

function setclickevent(e)
{
    general_event_stuff();
    evoker = this.parentElement.eventtarget;
    evoking_aktion = "click";
}
logick_dictionary["click"] = "a click on";

function setswipeleft(e)
{
    general_event_stuff();
    evoker = this.parentElement.eventtarget;
    evoking_aktion = "swipeleft";
}
logick_dictionary["swipeleft"] = "Swiping left over";

function setswiperight(e)
{
    general_event_stuff();
    evoker = this.parentElement.eventtarget;
    evoking_aktion = "swiperight";
}
logick_dictionary["swiperight"] = "Swiping right over";

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
	    sourche.parentElement.hide();
	    reset_transaktion_elementindependent();
}

function reset_transaktion_elementindependent()
{
    evoking_aktion = null;
    evoker = null;
    logick_elements.make_Visible();
    notifikationbar.hide();
}

/*element do get text from*/
function logick_button_get_data_for_add_list(e)
{
	/*Create an empty objekt*/
	complex_transaktion.complex = {};
	complex_transaktion.complex.textsource = e.target;
    logick_transaktions.push(complex_transaktion);
    reset_transaktion_elementindependent();
    complex_transaktion = null;
    GLOBAL_OVERRIDE = null;
}

/*Creating a complex transaktion, because 3 elements are needet*/
function logick_button_add_list_element()
{
	complex_transaktion = new logick_transaktion(evoker,evoking_aktion,this.parentElement.parent,"addtolist");
	this.parentElement.hide();
	GLOBAL_OVERRIDE = logick_button_get_data_for_add_list;
	notifikationbar.show("Choose text source for List element");
}
logick_dictionary["addtolist"] = "adds a New List element to";

/*Creating a complex transaktion, because 3 elements are needet*/
function logick_button_change_text()
{
	complex_transaktion = new logick_transaktion(evoker,evoking_aktion,this.parentElement.parent,"changtext");
	this.parentElement.hide();
	GLOBAL_OVERRIDE = logick_button_get_data_for_add_list;
	notifikationbar.show("Choose text source for selected element");
}
logick_dictionary["changtext"] = "Changes the text of";

function logick_button_hide()
{
    logick_transaktions.push(new logick_transaktion(evoker,evoking_aktion,this.parentElement.parent,"hide"));
    reset_transaktion(this);
}
logick_dictionary["hide"] = "Hides";

function logick_button_unhide()
{
    logick_transaktions.push(new logick_transaktion(evoker,evoking_aktion,this.parentElement.parent,"unhide"));
    reset_transaktion(this);
}
logick_dictionary["unhide"] = "unhides";

function logick_button_toggle_visibility()
{
    logick_transaktions.push(new logick_transaktion(evoker,evoking_aktion,this.parentElement.parent,"togglevisibility"));
    reset_transaktion(this);
}
logick_dictionary["togglevisibility"] = "toggles the visibilty of";

function logick_button_changescreen()
{
    logick_transaktions.push(new logick_transaktion(evoker,evoking_aktion,this.parentElement.parent,"changescreen"));
    reset_transaktion(this);
}
logick_dictionary["changescreen"] = "Changes the current screen to";

function logick_button_textlink()
{
    logick_transaktions.push(new logick_transaktion(evoker,evoking_aktion,this.parentElement.parent,"textlink"));
    reset_transaktion(this);
}
logick_dictionary["textlink"] = "sets the text of";

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
	remove_element_actionbar(e.target.parentElement.transaction);
	notifikationbar.hide();
}

function remove_element_actionbar(transaction) {
	
	
	
	var elements = transaction.evoker.settingsbar.ul2;
	for (elem of elements.children) {;
		if (elem.transaction == transaction)
		{   
		    transaction.target.style.border = elem.bordertarget;
			transaction.evoker.style.border = elem.borderevoker;
			elem.remove();
		}
	}
	
	var elements = transaction.target.settingsbar.ul2;
	for (elem of elements.children) {
		if (elem.transaction == transaction)
		{
			transaction.target.style.border = elem.bordertarget;
			transaction.evoker.style.border = elem.borderevoker;
			elem.remove();
		}
	}
	
	
   logick_transaktions.splice(logick_transaktions.indexOf(transaction), 1);
}
	
