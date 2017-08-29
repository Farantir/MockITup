document.addEventListener("initialize",initializeSketching);

var dataurls = {};
var picturestates = {};
var sketchElement_menubar;
var sketch = false;
var sketchScreen = false;

function initializeSketching()
{
 /*adds the Button to switch to the sketching view into the menu bar at position 2*/
    default_Menu.add(menubar_Item("Sketch Elements", changeToSketchingView), 2);

   /**    //Creates the menu bar for the screen
	sketchElement_menubar = menubar();
 	sketchElement_menubar.add(menubar_Item("Save",newesketchelement));
    sketchElement_menubar.add(menubar_Item("Back",grafik)); */

   // general_screenchange_cleanup.prototype.sketchingCleanup = function () {sketchElement_menubar.hide();}
}

function changeToSketchingView()
{
    sketch = true;
    var bla = document.createElement("IMG");
    bla.width = 200;
    bla.height = 200;
    //bla.src = "picture.png"
    gotoeditPicture(bla);
}





