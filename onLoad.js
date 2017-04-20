var landscape_mode = false;

function portraitPosition() {
	
var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

var mx = w / 2;
var my = h / 2;

$("landscape").style.top= "" + (my - 135) + "px";
$("portrait").style.top= "" + (my - 240) + "px";
$("screencontainer").style.top= "" + (my - 240) + "px";


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
	landscape_mode = selection;

	$("landscape").style.display = "none";
	$("portrait").style.display = "none";
	
	default_Menu = menubar();
 	default_Menu.add(menubar_Item("Grafik",null,null,true));
    default_Menu.add(menubar_Item("Logick"));
    default_Menu.add(menubar_Item("Test"));
    default_Menu.make_Visible();
    
   grafic_elements = elementbar();
   grafic_elements.add(menubar_Item("+"));
   grafic_elements.add(menubar_Item("Button"));
   grafic_elements.add(menubar_Item("Label"));
   grafic_elements.add(menubar_Item("Text Input"));
   grafic_elements.make_Visible();
   
   new_Screen();
}
