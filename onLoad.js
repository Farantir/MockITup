var landscape_mode = false;
var newscreenbutton;
var grafic_elements;
var logick_elements;
var newElement_menubar;
var notifikationbar;

function portraitPosition() {
	
var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

var mx = w / 2;
var my = h / 2;

$("logo").style.top= (h - 100) + "px";
$("landscape").style.top= "" + (my - 135) + "px";
$("portrait").style.top= "" + (my - 240) + "px";

$("logo").style.left= (w - 100) + "px";
$("landscape").style.left= "" + ((mx - 240) * 0.25) + "px";
$("portrait").style.left= "" + ((mx - 135) * 1.75) + "px";

$("landscape").onclick = function(){initialize(true);}
$("portrait").onclick = function(){initialize(false);}
}

function $(x){
return document.getElementById(x);
}

function initialize(selection)
{
    /*Creates a notifikationbar*/
    notifikationbar = create_notifikationbar();

    //applys selection of landscape or portrait mode
	landscape_mode = selection;

    //hides divs for selection, they are no longer nedet
	$("landscape").style.display = "none";
	$("portrait").style.display = "none";
	
    //creates the menu bar needet for selection of editing mode
	default_Menu = menubar();
 	default_Menu.add(menubar_Item("Grafik",grafik,null,true));
    default_Menu.add(menubar_Item("Logik",goto_logick));
    default_Menu.add(menubar_Item("Test", test));
    default_Menu.add(menubar_Item("Test on Device", testondevice));
    default_Menu.make_Visible();
    
   //creates the menu bar containing the elements for grafik desing
   grafic_elements = elementbar();
   grafic_elements.add(menubar_Item("+",gotoNewElement,"newelement"));
   grafic_elements.add(elementbar_Item("Button"));
   grafic_elements.add(elementbar_Item("Label"));
   grafic_elements.add(elementbar_Item("Text Input"));
   grafic_elements.add(elementbar_Item("Checkbox"));
   grafic_elements.add(elementbar_Item("Picture"));
   grafic_elements.add(elementbar_Item("Liste"));
   grafic_elements.make_Visible();

   //creates the menu bar containing the elements for Logick desing
   logick_elements = elementbar();
   logick_elements.add(menubar_Item("Click",setclickevent));
   logick_elements.add(menubar_Item("Swipe Left",setswipeleft));
   logick_elements.add(menubar_Item("Swipe Right",setswiperight));
   logick_elements.add(menubar_Item("Text Changed",settextchanged));

   //creates the "new screen" button
   if(landscape_mode) newscreenbutton = $("createnewscreenlandscape");
   else newscreenbutton = $("createnewscreenportrait");

    newscreenbutton.style.display = "inline";
    newscreenbutton.onclick = new_Screen;
   
   
   //Creates the first screen of the app
   new_Screen();

    //Creates the menu bar for the new element screen
	newElement_menubar = menubar();
 	newElement_menubar.add(menubar_Item("Save",newelementsetname));
    newElement_menubar.add(menubar_Item("Back",grafik));
}
