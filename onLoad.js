var landscape_mode = false;
var newscreenbutton;
var grafic_elements;
var logick_elements;
var newElement_menubar;
var notifikationbar;
var pictureEdit;
var preloadetimages = [];

/*Preloading Images*/
preloadetimages.push(preload('picture.png'));
preloadetimages.push(preload('plus.png'));
preloadetimages.push(preload('toggle_vis.png'));
preloadetimages.push(preload('copy.png'));
preloadetimages.push(preload('arrow_vertical.png'));
preloadetimages.push(preload('arrow_right.png'));
preloadetimages.push(preload('arrow_left.png'));
preloadetimages.push(preload('arrow_horizontal.png'));
preloadetimages.push(preload('Action.png'));
preloadetimages.push(preload('delete.svg'));
preloadetimages.push(preload('edit_icon.svg'));
preloadetimages.push(preload('textedit.svg'));

function preload(imgsrc)
{
    var my_image = new Image();
    my_image.src = imgsrc;
    return my_image;
}

function portraitPosition() {
	
var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

var mx = w / 2;
var my = h / 2;

$("savebutton").style.top= (h - 80) + "px";
$("loadbutton").style.top= (h - 80) + "px";
$("logo").style.top= (h - 100) + "px";
$("landscape").style.top= "" + (my - 135) + "px";
$("portrait").style.top= "" + (my - 240) + "px";

$("savebutton").style.left= (w - 210) + "px";
$("loadbutton").style.left= (w - 330) + "px";
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
   /*grafic_elements.add(menubar_Item("+",gotoNewElement,"newelement"));*/
   grafic_elements.add(elementbar_Item("Button",notifikation_to_drag_and_drop));
   grafic_elements.add(elementbar_Item("Label",notifikation_to_drag_and_drop));
   grafic_elements.add(elementbar_Item("Text Input",notifikation_to_drag_and_drop));
   grafic_elements.add(elementbar_Item("Textarea",notifikation_to_drag_and_drop));
   grafic_elements.add(elementbar_Item("Checkbox",notifikation_to_drag_and_drop));
   grafic_elements.add(elementbar_Item("Picture",notifikation_to_drag_and_drop));
   grafic_elements.add(elementbar_Item("Liste",notifikation_to_drag_and_drop));
   grafic_elements.add(elementbar_Item("Container",notifikation_to_drag_and_drop));
   grafic_elements.make_Visible();

   //creates the menu bar containing the elements for Logick desing
   logick_elements = elementbar();
   logick_elements.add(menubar_Item("Click",setclickevent));
   logick_elements.add(menubar_Item("Swipe Left",setswipeleft));
   logick_elements.add(menubar_Item("Swipe Right",setswiperight));
   logick_elements.add(menubar_Item("Text Changed",settextchanged));

    //Creates the menu bar for the Edit picture screen
	editPicture_menubar = menubar();
 	editPicture_menubar.add(menubar_Item("Save",savePicture));
    editPicture_menubar.add(menubar_Item("Back",grafik));

   //creates the menu bar containing the elements for Editing a picture
   pictureEdit = elementbar();
   pictureEdit.add(menubar_Item("Mouse",edit_image_back_to_mouse));
   pictureEdit.add(menubar_Item("Draw",draw_on_canvas));
   pictureEdit.add(menubar_Item("Erase",erase_from_canvas));
   pictureEdit.add(menubar_Item("Color",null,null,null,editImage_DrawingColor));
   pictureEdit.add(menubar_Item("Size",null,null,null,editImage_strokesize));
   pictureEdit.add(menubar_Item("Clear Canvas",canvas_erase_picture));

   //creates the "new screen" button
   if(landscape_mode) newscreenbutton = $("createnewscreenlandscape");
   else newscreenbutton = $("createnewscreenportrait");

    newscreenbutton.style.display = "inline";
    newscreenbutton.onclick = new_Screen;
   
   
   //Creates the first screen of the app
   new_Screen();
/*
    //Creates the menu bar for the new element screen
	newElement_menubar = menubar();
 	newElement_menubar.add(menubar_Item("Save",newelementsetname));
    newElement_menubar.add(menubar_Item("Back",grafik));*/
}
