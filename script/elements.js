/*******************************************************/
/*This File contains all the logik around Elements.    */
/*It contains the function make_container whitch       */
/*is used to create elements out of a dom structure.   */
/*it also contais the elements array, where all current*/ 
/*elements get registert. All core elements are also   */
/*inside this file.                                    */
/*******************************************************/

/*Allows plugins to execute their own code, after an element has been
moved. the new psoition of the element will not be given, nor 
will the element itself be given. To aquire these informations
an eventlistener has to be bound to the element selected event.
the selected element will allways be the moved one*/
var execute_after_element_dragging = {};
/*Allows plugins to execute their own code, when an element gets deletet.
all functions addes to this object will get calles on element deletion 
with the element to delete as a parameter*/
var execute_before_element_deletion = {};

/*defines if an element is able to move aut of its parents 
bounderys*/
var can_move_out_of_bounderys = false;

var elemToDrag = null;
var elements = new function(){};
var GLOBAL_OVERRIDE = null;
var copied_Element = null;

function notifikation_to_drag_and_drop()
{
    notifikationbar.show("Drag the Element onto the target screen");
    window.setTimeout(function(){notifikationbar.hide();}, 5000);
}

/*Changes view to the Grafik screen*/
function grafik()
{
	general_screenchange_cleanup();
	$("screencontainer").style.display="";
	default_Menu.make_Visible();	
	grafic_elements.style.display = "";

    /*event used to signal plugins, that the grafik view got selectet*/
    fireEvent("in grafik View", document);
}

/*functions to create and recreate (after save) all elements.
the functions are addet to the elements objekt
to "create" or "recreate" an element the decorator pattern is used.
for creation the dom objekts needdet for the element are createt first. they then get decorated with all the funktions and variables needet by every element using the  make_Container(<Target element>,<name of the element>); funktion.
the element then gets further decorated with custom properties. at the end the create function of the newly cerated element is called, to place ist onto the target parent and initialise it.

to recreate an element from save it needs to get decorated only with the js variables and logik, as changes in css or html got already strored.*/
elements["screen"] = {}; 
elements["screen"].createfromsave = function make_Screen(screen)
{
	screen.logick_menu = logick_menu(screen);
    screen.logick_menu.add(logick_menu_item("Abort",function(){reset_transaktion(this)}));
    screen.logick_menu.add(logick_menu_item("Change to This Screen",logick_button_changescreen));
    screen.onmousedown = function(e)
    {
        if(GLOBAL_OVERRIDE)
        {
            GLOBAL_OVERRIDE(e);
            e.stopPropagation();
            return;
        }
        logick_elements.eventtarget = this;
        logik_bar_make_visible();
        this.settingsbar.make_Visible();
        e.stopPropagation();
        /*This event is needet, if plugins want to add their own functionality, after a Screen got selected.
        the message of the Event contains the selected Screen*/
        fireEvent("Screen Selected", document, this, e);
    }
    screen.settingsbar = settingsbar(screen);
    screen.settingsbar.add(settings_Icon("picture.png",function(){imageSelect(this.parentElement.parentElement,function(value){this.target.parent.style.backgroundImage = "url('"+value+"')";})},"Lets you select a custom background image, either by url or filpicker, to coose from your own device"));
    screen.settingsbar.add(settings_Icon("edit_icon.svg", function(){sketchScreen = true; gotoeditPicture(this.target.parent);}));
    /*sets the background image, so its always streched to fill the screen*/
    screen.style.backgroundSize="100% 100%";
    
    screen.ondragover = allowDrop;
	screen.ondrop = drop;
    return screen;
}
 
elements["Button"] = function element_button(e,x,y)
{
	b = document.createElement("button");
	b = make_Container(b,"Button");
    
    b.jsoncreate = function(target)
    {
    	this.settingsbar.add(settings_Icon("minus.svg",()=>{make_text_smaler(this);},"Makes the font size smaller"));
        this.settingsbar.add(settings_Icon("plus.svg",()=>{make_text_larger(this);},"Makes the font size larger"));
        this.settingsbar.add(settings_Icon("textedit.svg",function(){text_input_overlay(this.parentElement.parentElement,function(value){this.target.parent.innerHTML = value;})},"Changes the Text of the Button"));
        this.settingsbar.add(settings_Icon("change_text_color.png",()=>{change_text_color(this);},"Changes the Color of the Buttons text"));
    }
	b.appendChild(document.createTextNode("Button"));
    b.logick_menu.add(logick_menu_item("Text Link",logick_button_textlink));
    b.logick_menu.add(logick_menu_item("Change Text",logick_button_change_text));
	b.create(e,x,y)
}
elements["Button"].createfromsave = function recreatelogick(b)
{
	b = make_Container(b,"Button");
	b.jsoncreate = function(target)
    {
        this.settingsbar.add(settings_Icon("minus.svg",()=>{make_text_smaler(this);},"Makes the font size smaller"));
        this.settingsbar.add(settings_Icon("plus.svg",()=>{make_text_larger(this);},"Makes the font size larger"));
        this.settingsbar.add(settings_Icon("textedit.svg",function(){text_input_overlay(this.parentElement.parentElement,function(value){this.target.parent.innerHTML = value;})},"Changes the Text of the Button"));
        this.settingsbar.add(settings_Icon("change_text_color.png",()=>{change_text_color(this);},"Changes the Color of the Buttons text"));
    }
	b.afterceration();
	b.logick_menu.add(logick_menu_item("Text Link",logick_button_textlink));
	b.logick_menu.add(logick_menu_item("Change Text",logick_button_change_text));
}
 
elements["Text Input"] = function element_text(e,x,y)
{
	b = document.createElement("input");
    b.type = "text";
	b = make_Container(b,"Text Input");
	b.jsoncreate = function(target)
    {
        this.settingsbar.add(settings_Icon("minus.svg",()=>{make_text_smaler(this);},"Makes the font size smaller"));
        this.settingsbar.add(settings_Icon("plus.svg",()=>{make_text_larger(this);},"Makes the font size larger"));
        this.settingsbar.add(settings_Icon("change_text_color.png",()=>{change_text_color(this);},"Changes the color of the text"));
    }
	//b.appendChild(document.createTextNode(""));
	b.create(e,x,y);
	
	b.settingsbar.scaleBottom.remove();
    b.settingsbar.scaleBottomLeft.remove();
    b.settingsbar.scaleRight.remove();
    b.settingsbar.scaleTop.remove();
    b.settingsbar.scaleTopLeft.remove();
    b.settingsbar.scaleTopRight.remove();
    b.settingsbar.scaleLeft.remove();
}
elements["Text Input"].createfromsave = function recreatelogick(b)
{
	b = make_Container(b,"Text Input");
	b.jsoncreate = function(target)
    {
        this.settingsbar.add(settings_Icon("minus.svg",()=>{make_text_smaler(this);},"Makes the font size smaller"));
        this.settingsbar.add(settings_Icon("plus.svg",()=>{make_text_larger(this);},"Makes the font size larger"));
        this.settingsbar.add(settings_Icon("change_text_color.png",()=>{change_text_color(this);},"Changes the color of the text"));
    }
	b.afterceration();
	
    b.settingsbar.scaleBottom.remove();
    b.settingsbar.scaleBottomLeft.remove();
    b.settingsbar.scaleRight.remove();
    b.settingsbar.scaleTop.remove();
    b.settingsbar.scaleTopLeft.remove();
    b.settingsbar.scaleTopRight.remove();
    b.settingsbar.scaleLeft.remove();
}

elements["Textarea"] = function element_text(e,x,y)
{
	b = document.createElement("textarea");
	b = make_Container(b,"Textarea");
	b.jsoncreate = function(target)
    {
        this.settingsbar.add(settings_Icon("minus.svg",()=>{make_text_smaler(this);},"Makes the font size smaller"));
        this.settingsbar.add(settings_Icon("plus.svg",()=>{make_text_larger(this);},"Makes the font size larger"));
        this.settingsbar.add(settings_Icon("change_text_color.png",()=>{change_text_color(this);},"Changes the color of the text"));
    }
	b.style.resize = "none";
	//b.appendChild(document.createTextNode(""));
	b.create(e,x,y);
	
	b.settingsbar.scaleBottom.remove();
    b.settingsbar.scaleBottomLeft.remove();
    b.settingsbar.scaleRight.remove();
    b.settingsbar.scaleTop.remove();
    b.settingsbar.scaleTopLeft.remove();
    b.settingsbar.scaleTopRight.remove();
    b.settingsbar.scaleLeft.remove();
}
elements["Textarea"].createfromsave = function recreatelogick(b)
{
	b = make_Container(b,"Textarea");
	b.jsoncreate = function(target)
    {
        this.settingsbar.add(settings_Icon("minus.svg",()=>{make_text_smaler(this);},"Makes the font size smaller"));
        this.settingsbar.add(settings_Icon("plus.svg",()=>{make_text_larger(this);},"Makes the font size larger"));
        this.settingsbar.add(settings_Icon("change_text_color.png",()=>{change_text_color(this);},"Changes the color of the text"));
    }
	b.afterceration();
	
    b.settingsbar.scaleBottom.remove();
    b.settingsbar.scaleBottomLeft.remove();
    b.settingsbar.scaleRight.remove();
    b.settingsbar.scaleTop.remove();
    b.settingsbar.scaleTopLeft.remove();
    b.settingsbar.scaleTopRight.remove();
    b.settingsbar.scaleLeft.remove();
}

elements["Checkbox"] = function element_checkbox(e,x,y)
{
	b = document.createElement("input");
    b.type = "checkbox"
	b = make_Container(b,"Checkbox");
	//b.appendChild(document.createTextNode(""));
	b.create(e,x,y);

	b.settingsbar.scaleBottomRight.remove();
    b.settingsbar.scaleBottom.remove();
    b.settingsbar.scaleBottomLeft.remove();
    b.settingsbar.scaleRight.remove();
    b.settingsbar.scaleTop.remove();
    b.settingsbar.scaleTopLeft.remove();
    b.settingsbar.scaleTopRight.remove();
    b.settingsbar.scaleLeft.remove();
}
elements["Checkbox"].createfromsave = function recreatelogick(b)
{
	b = make_Container(b,"Checkbox");
	b.afterceration();
	
	b.settingsbar.scaleBottomRight.remove();
    b.settingsbar.scaleBottom.remove();
    b.settingsbar.scaleBottomLeft.remove();
    b.settingsbar.scaleRight.remove();
    b.settingsbar.scaleTop.remove();
    b.settingsbar.scaleTopLeft.remove();
    b.settingsbar.scaleTopRight.remove();
    b.settingsbar.scaleLeft.remove();
}
/* //needet only for new element screen. new element now inexistent, because we cut it. got replaced by container element
elements["custom"] = {};
elements["custom"].createfromsave = function recreatelogick(b)
{
	b = make_Container(b,"custom");
	b.afterceration();
}
*/

elements["Label"] = function element_Label(e,x,y)
{
	b = document.createElement("div");
	b = make_Container(b,"Label");
    b.jsoncreate = function(target)
    {
        this.settingsbar.add(settings_Icon("textedit.svg",function(){text_input_overlay(this.parentElement.parentElement,function(value){this.target.parent.innerHTML = value;})},"Canges the Text of the Label"));
        this.settingsbar.add(settings_Icon("change_text_color.png",()=>{change_text_color(this);},"Changes the color of the text"));
        this.settingsbar.add(settings_Icon("minus.svg",()=>{make_text_smaler(this);},"Makes the font size smaller"));
        this.settingsbar.add(settings_Icon("plus.svg",()=>{make_text_larger(this);},"Makes the font size larger"));
        /*by far not the best solution. the function itself is totaly fine however, it shouldn't be nameless for 
        Its needet at multiple locations.  Ill leave it like this for now, but if someone needs to change it its better to refactor the code, so its a seperate function and all elements using it simply get it assined and not redefined every time
        */
        this.settingsbar.add(settings_Icon("center.png",function()
        {
        	var targettochange = this.parentElement.parentElement.parent;
        	switch(targettochange.style.textAlign)
        	{
        		case "center": targettochange.style.textAlign = "left"; break;
        		case "left"  : targettochange.style.textAlign = "right"; break;
        		case "right" : targettochange.style.textAlign = "center"; break;
        		default: targettochange.style.textAlign = "right"; break;
        	}
        },"Selects the textaling for the Labels Text. you can choose between center, left and right"));
    }
	b.appendChild(document.createTextNode("Label"));
    b.logick_menu.add(logick_menu_item("Text Link",logick_button_textlink));
    b.logick_menu.add(logick_menu_item("Change Text",logick_button_change_text));
	b.create(e,x,y);
}
elements["Label"].createfromsave = function recreatelogick(b)
{
	b = make_Container(b,"Label");
	b.jsoncreate = function(target)
    {
        this.settingsbar.add(settings_Icon("textedit.svg",function(){text_input_overlay(this.parentElement.parentElement,function(value){this.target.parent.innerHTML = value;})},"Canges the Text of the Label"));
        this.settingsbar.add(settings_Icon("change_text_color.png",()=>{change_text_color(this);},"Changes the color of the text"));
        this.settingsbar.add(settings_Icon("minus.svg",()=>{make_text_smaler(this);},"Makes the font size smaller"));
        this.settingsbar.add(settings_Icon("plus.svg",()=>{make_text_larger(this);},"Makes the font size larger"));
        this.settingsbar.add(settings_Icon("center.png",function()
        {
        	var targettochange = this.parentElement.parentElement.parent;
        	switch(targettochange.style.textAlign)
        	{
        		case "center": targettochange.style.textAlign = "left"; break;
        		case "left"  : targettochange.style.textAlign = "right"; break;
        		case "right" : targettochange.style.textAlign = "center"; break;
        		default: targettochange.style.textAlign = "right"; break;
        	}
        },"Selects the textaling for the Labels Text. you can choose between center, left and right"));
    }
    b.logick_menu.add(logick_menu_item("Text Link",logick_button_textlink));
    b.logick_menu.add(logick_menu_item("Change Text",logick_button_change_text));
	b.afterceration();
}

elements["Container"] = function element_container(e,x,y)
{
	b = document.createElement("div");
	b.style.border = "1px dashed";
	b.style.height = "30px";
	b.style.width = "30px";
	b = make_Container(b,"Container");
	
	b.jsoncreate = function(target)
    {
        this.settingsbar.add(settings_Icon("picture.png",function(){imageSelect(this.parentElement.parentElement,function(value){this.target.parent.style.backgroundImage = "url('"+value+"')";})},"Lets you select a custom background image, either by url or filpicker, to coose from your own device"));
    }
	
	b.create(e,x,y);
	
	b.settingsbar.scaleBottom.remove();
    b.settingsbar.scaleBottomLeft.remove();
    b.settingsbar.scaleRight.remove();
    b.settingsbar.scaleTop.remove();
    b.settingsbar.scaleTopLeft.remove();
    b.settingsbar.scaleTopRight.remove();
    b.settingsbar.scaleLeft.remove();
    
}
elements["Container"].createfromsave = function recreatelogick(b)
{
	b = make_Container(b,"Container");

	b.jsoncreate = function(target)
    {
        this.settingsbar.add(settings_Icon("picture.png",function(){imageSelect(this.parentElement.parentElement,function(value){this.target.parent.style.backgroundImage = "url('"+value+"')";})},"Lets you select a custom background image, either by url or filpicker, to coose from your own device"));
    }

	b.afterceration();
	
	b.settingsbar.scaleBottom.remove();
    b.settingsbar.scaleBottomLeft.remove();
    b.settingsbar.scaleRight.remove();
    b.settingsbar.scaleTop.remove();
    b.settingsbar.scaleTopLeft.remove();
    b.settingsbar.scaleTopRight.remove();
    b.settingsbar.scaleLeft.remove();
}

elements["Picture"] = function element_Label(e,x,y)
{
	b = document.createElement("img");
    b.src = "picture.png";
    b.draggable="false";
    b.ondragstart = function() { return false; };
	b = make_Container(b,"Picture");
    b.jsoncreate = function(target)
    {
        this.settingsbar.add(settings_Icon("picture.png",function(){imageSelect(this.parentElement.parentElement,function(value){this.target.parent.src = value;})},"Lets you select a custom image, either by url or filpicker, to coose from your own device"));
        this.settingsbar.add(settings_Icon("edit_icon.svg",function(){gotoeditPicture(this.parentElement.parentElement.parent)},"Opens a seperate Screen, on whitch you can paint your own picture for this Container"));
    }
	b.create(e,x,y);
    b.logick_menu.add(logick_menu_item("Change Image",logick_button_change_image));
	b.style.width = "100px";
	b.style.height = "100px";
}
elements["Picture"].createfromsave = function recreatelogick(b)
{
	b = make_Container(b,"Picture");
	b.draggable="false";
    b.ondragstart = function() { return false; };
	b = make_Container(b,"Picture");
    b.jsoncreate = function(target)
    {
        this.settingsbar.add(settings_Icon("picture.png",function(){imageSelect(this.parentElement.parentElement,function(value){this.target.parent.src = value;})},"Lets you select a custom image, either by url or filpicker, to coose from your own device"));
        this.settingsbar.add(settings_Icon("edit_icon.svg",function(){gotoeditPicture(this.parentElement.parentElement.parent)},"Opens a seperate Screen, on whitch you can paint your own picture for this Container"));
    }
    b.logick_menu.add(logick_menu_item("Change Image",logick_button_change_image));
	b.afterceration();
}

elements["Liste"] = function element_List(e,x,y)
{
	var b = document.createElement("div");
	b = make_Container(b,"Liste");
    b.jsoncreate = function(target)
    {
        this.settingsbar.add(settings_Icon("plus.png",function(){element_Listelem(this.parentElement.parentElement.parent);},"Creates a new List Entry"));
        this.settingsbar.add(settings_Icon("change_text_color.png",()=>{change_text_color(this);},"Specifies the text color for all Entries of this List, if the color is not set in the list element itself"));
        this.settingsbar.add(settings_Icon("minus.svg",()=>{make_text_smaler(this);},"Makes the font size smaller"));
        this.settingsbar.add(settings_Icon("plus.svg",()=>{make_text_larger(this);},"Makes the font size larger"));
        this.settingsbar.add(settings_Icon("picture.png",function(){imageSelect(this.parentElement.parentElement,function(value){this.target.parent.style.backgroundImage = "url('"+value+"')";})},"Lets you select a custom background image, either by url or filpicker, to coose from your own device"));
    }
	b.logick_menu.add(logick_menu_item("Add List Entry",logick_button_add_list_element));
	b.style.height = "200px";
	b.style.width = "200px";
	b.style.overflow = "scroll";
	b.create(e,x,y);
	
	/*Overrides the positioning of elements appendet to the List to relative*/
	var observer = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
		  for (var i = 0; i < mutation.addedNodes.length; i++) {
		    mutation.addedNodes[i].style.position = "relative";
		    mutation.addedNodes[i].style.top = "0px";
		    mutation.addedNodes[i].style.left = "0px";
		    mutation.addedNodes[i].setpos = ()=>{};
		  }
		});
	  });
	  observer.observe(b, { childList: true });
}
elements["Liste"].createfromsave = function recreatelogick(b)
{
	var b = make_Container(b,"Liste");
	b.jsoncreate = function(target)
    {
        this.settingsbar.add(settings_Icon("plus.png",function(){element_Listelem(this.parentElement.parentElement.parent);},"Creates a new List Entry"));
        this.settingsbar.add(settings_Icon("change_text_color.png",()=>{change_text_color(this);},"Specifies the text color for all Entries of this List, if the color is not set in the list element itself"));
        this.settingsbar.add(settings_Icon("minus.svg",()=>{make_text_smaler(this);},"Makes the font size smaller"));
        this.settingsbar.add(settings_Icon("plus.svg",()=>{make_text_larger(this);},"Makes the font size larger"));
        this.settingsbar.add(settings_Icon("picture.png",function(){imageSelect(this.parentElement.parentElement,function(value){this.target.parent.style.backgroundImage = "url('"+value+"')";})},"Lets you select a custom background image, either by url or filpicker, to coose from your own device"));
    }
	b.logick_menu.add(logick_menu_item("Add List Entry",logick_button_add_list_element));
	b.afterceration();
	
	/*Overrides the positioning of elements appendet to the List to relative*/
	var observer = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
		  for (var i = 0; i < mutation.addedNodes.length; i++) {
		    mutation.addedNodes[i].style.position = "relative";
		    mutation.addedNodes[i].style.top = "0px";
		    mutation.addedNodes[i].style.left = "0px";
		    mutation.addedNodes[i].setpos = ()=>{};
		  }
		});
	  });
	  observer.observe(b, { childList: true });
}

elements["listelement"] = element_Listelem;
elements["listelement"].createfromsave = function recreatelogick(b)
{
	var b = make_Container(b,"listelement");
	b.setpos = ()=>{};
	b.scale = ()=>{};
	b.jsoncreate = function(target)
    {
        this.settingsbar.add(settings_Icon("textedit.svg",function(){text_input_overlay(this.parentElement.parentElement,function(value){this.target.parent.innerHTML = value;})},"Lets you change the text of this list entry"));
        this.settingsbar.add(settings_Icon("change_text_color.png",()=>{change_text_color(this);},"changes the color of this list entry. Overrides the color set by the list itself"));
        this.settingsbar.add(settings_Icon("minus.svg",()=>{make_text_smaler(this);},"Makes the font size smaller"));
        this.settingsbar.add(settings_Icon("plus.svg",()=>{make_text_larger(this);},"Makes the font size larger"));
        this.settingsbar.add(settings_Icon("center.png",function()
        {
        	var targettochange = this.parentElement.parentElement.parent;
        	switch(targettochange.style.textAlign)
        	{
        		case "center": targettochange.style.textAlign = "left"; break;
        		case "left"  : targettochange.style.textAlign = "right"; break;
        		case "right" : targettochange.style.textAlign = "center"; break;
        		default: targettochange.style.textAlign = "right"; break;
        	}
        },"Allows you to change th textalingment of this list entry"));
    }
    b.logick_menu.add(logick_menu_item("Text Link",logick_button_textlink));
   	b.afterceration();
    b.settingsbar.scaleBottomRight.remove();
    b.settingsbar.scaleBottom.remove();
    b.settingsbar.scaleBottomLeft.remove();
    b.settingsbar.scaleRight.remove();
    b.settingsbar.scaleTop.remove();
    b.settingsbar.scaleTopLeft.remove();
    b.settingsbar.scaleTopRight.remove();
    b.settingsbar.scaleLeft.remove();

    b.style.position = "relative";
    b.logick_menu.add(logick_menu_item("Change Text",logick_button_change_text));

}
function element_Listelem(e,x,y)
{
	var b = document.createElement("div");
	make_Container(b,"listelement");
	b.appendChild(document.createTextNode("Label"));
	e.appendChild(b)
	b.setpos = ()=>{};
	b.scale = ()=>{};
	b.jsoncreate = function(target)
    {
        this.settingsbar.add(settings_Icon("textedit.svg",function(){text_input_overlay(this.parentElement.parentElement,function(value){this.target.parent.innerHTML = value;})},"Lets you change the text of this list entry"));
        this.settingsbar.add(settings_Icon("change_text_color.png",()=>{change_text_color(this);},"changes the color of this list entry. Overrides the color set by the list itself"));
        this.settingsbar.add(settings_Icon("minus.svg",()=>{make_text_smaler(this);},"Makes the font size smaller"));
        this.settingsbar.add(settings_Icon("plus.svg",()=>{make_text_larger(this);},"Makes the font size larger"));
        this.settingsbar.add(settings_Icon("center.png",function()
        {
        	var targettochange = this.parentElement.parentElement.parent;
        	switch(targettochange.style.textAlign)
        	{
        		case "center": targettochange.style.textAlign = "left"; break;
        		case "left"  : targettochange.style.textAlign = "right"; break;
        		case "right" : targettochange.style.textAlign = "center"; break;
        		default: targettochange.style.textAlign = "right"; break;
        	}
        },"Allows you to change th textalingment of this list entry"));
    }
    b.logick_menu.add(logick_menu_item("Text Link",logick_button_textlink));
    b.logick_menu.add(logick_menu_item("Change Text",logick_button_change_text));
    b.create(e,b.offsetLeft,b.offsetTop);
    
    b.settingsbar.scaleBottomRight.remove();
    b.settingsbar.scaleBottom.remove();
    b.settingsbar.scaleBottomLeft.remove();
    b.settingsbar.scaleRight.remove();
    b.settingsbar.scaleTop.remove();
    b.settingsbar.scaleTopLeft.remove();
    b.settingsbar.scaleTopRight.remove();
    b.settingsbar.scaleLeft.remove();
    
    b.style.position = "relative";
    b.style.margin = "20px"; 
    b.classList.add("listenelement");
    b.settingsbar.hide();
    b.parentElement.settingsbar.make_Visible();
}

/*function used to reposition an element onto a target container (eg. another screen or an list element)*/
function moveelem(e) 
{
  x = e.clientX + document.documentElement.scrollLeft;
  y = e.clientY + document.documentElement.scrollTop;

  posy = (y - elemToDrag.offsety);
  posx = (x - elemToDrag.offsetx);

  elemToDrag.setpos(posx,posy);

  /*allows plugins to execute additional code, ater an element has been moved*/
    for (var key in execute_after_element_dragging) 
    {
      if (execute_after_element_dragging.hasOwnProperty(key)) 
      {
        execute_after_element_dragging[key]();
      }
    }
}


/*Calculates position of an element relative to the document origin*/
function getPos(el) {
    // yay readability
    for (var lx=0, ly=0;
         el != null;
         lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
    return {x: lx,y: ly};
}

/*opens a menu to change the text color of an element*/
function change_text_color(target)
{
	colpicker = document.createElement("input");
	colpicker.type = "color";
	colpicker.target = target;
	colpicker.value = rgb2hex(target.style.color);
	colpicker.onchange = function(){this.target.style.color = this.value;}
	colpicker.click();
}

/*needet because of the stunningly dump imlementation of the html color picker.
it needs a hex color value to get initialized, but it returns an rgb value.
so to initialise it with the current color of an objekt, tranformation is needet
however, js dosent have a funktion for that.
This one is copied from the internet somewhere and uses a bit of regex magic*/
function rgb2hex(rgb){
 rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
 return (rgb && rgb.length === 4) ? "#" +
  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}

/*used to create a copy of an element aktual copying done by append_copied_element function*/
function copy_element(target)
{
	notifikationbar.show("Click on the place, where the copy should be created");
    copied_Element = target.cloneNode(true);
    GLOBAL_OVERRIDE = append_copied_element;    
}
/*used to move an element. aktual moving done by move_element_to_target function*/
function move_element(target)
{
	notifikationbar.show("Click on the place, the element should be moved to");
    copied_Element = target
    GLOBAL_OVERRIDE = move_element_to_target;  
}

function make_text_smaler(target)
{
	changetextsize(target,-1);
}

function make_text_larger(target)
{
	changetextsize(target,1);
}

function changetextsize(el,value)
{
	var style = window.getComputedStyle(el, null).getPropertyValue('font-size');
	var fontSize = parseFloat(style); 
	/* now you have a proper float for the font size (yes, it can be a float, not just an integer)
	however, mostly increments/decrements by 1 are used*/
	el.style.fontSize = (fontSize + value) + 'px';
}

/*adds the copied elements to the target parent and recreates its js proparties afterwards.*/
function append_copied_element(e)
{
   notifikationbar.hide();
   elements[copied_Element.dataset.elementtype].createfromsave(copied_Element); 
   copied_Element.create(e.target,e.clientX,e.clientY)
   recreate_jsfunktions_after_copy(copied_Element);
   GLOBAL_OVERRIDE = null;
}

function move_element_to_target(e)
{
   notifikationbar.hide(); 
   e.target.appendChild(copied_Element);
   
	posx = (e.clientX - getPos(e.target).x || copied_Element.offsetLeft); 
	posy = (e.clientY - getPos(e.target).y || copied_Element.offsetTop) + document.documentElement.scrollTop;
    	
   copied_Element.setpos(posx,posy);
   GLOBAL_OVERRIDE = null;
}

/*recreates the js functions and variables of an aélement, after it got copyed*/
function recreate_jsfunktions_after_copy(elemelement)
{
   elements[elemelement.dataset.elementtype].createfromsave(elemelement); 
   for(m of elemelement.children) recreate_jsfunktions_after_copy(m);
}

/*Adds all functions and properties needed for an element in the Grafik edit view
gets calloed by nearly every elemten funktion.
uses the decorator pattern to fit the dom elements with js functionality*/
function make_Container(elem,elemtype)
{
	/*Saves the type of element in the data tags*/
	elem.dataset["elementtype"] = elemtype;

    elem.style.position = "absolute";
    elem.settingsbar = settingsbar(elem);
    elem.jsoncreate = function(){};

    /*Defines if the element ist visible in the test renderer*/
    elem.isVisible = true;
    elem.dataset.isVisible = elem.dataset.isVisible || elem.isVisible;
    elem.style.cursor = "pointer";
    elem.style.cursor = "hand";
    
    /*sets the background image, so its always streched to fill lthe element*/
    elem.style.backgroundSize="100% 100%";
    
    /*Menu containing the logic funktions of the element*/
    elem.logick_menu = logick_menu(elem);
    elem.logick_menu.add(logick_menu_item("Abort",function(){reset_transaktion(this)}));
    elem.logick_menu.add(logick_menu_item("Hide",logick_button_hide));
    elem.logick_menu.add(logick_menu_item("Make Visible",logick_button_unhide));
    elem.logick_menu.add(logick_menu_item("Toggle Visibility",logick_button_toggle_visibility));
    elem.logick_menu.add(logick_menu_item("Copy",logick_button_copy));
	
	

    elem.togglevisible = function()
    {
        if(this.isVisible) this.style.opacity = "0.3"; 
        else this.style.opacity = "1";
        this.isVisible = !this.isVisible;
        this.dataset.isVisible = this.isVisible;
    }

    elem.scale = function(x,y)
    {
        if(!can_move_out_of_bounderys)
        {
            if(this.offsetTop > this.fencey - y) y = this.fencey - this.offsetTop;
            if(this.offsetLeft > this.fencex - x) x = this.fencex - this.offsetLeft;
        }
        this.style.height = y + "px";
        this.style.width = x + "px";
    }

    elem.setpos = function(x,y)
    {
        if(!can_move_out_of_bounderys)
        {
            if(y<0)
            { 
                y = 0;
            }
            else if(y > this.fencey - this.offsetHeight) 
            {
                y = this.fencey - this.offsetHeight;
            } 

            if(x<0) x = 0;
            else if(x > this.fencex - this.offsetWidth) x = this.fencex - this.offsetWidth;
        }
        this.style.top = y + "px";
        this.style.left = x + "px";
        this.settingsbar.setpos();
    }

	elem.afterceration = function(x,y)
	{
		this.jsoncreate(this.parentElement,x,y);

        this.offsetx = this.offsetLeft; 
        this.offsety = this.offsetTop;
        
        this.settingsbar.add(settings_Icon("copy.png",()=>{copy_element(this);},"Creates a copy of this element and all elements inside it at a target location"));
        this.settingsbar.add(settings_Icon("toggle_vis.png",()=>{this.togglevisible();},"Button to toggle whether the element is visible in the test screen"));
        this.settingsbar.add(settings_Icon("move.svg",()=>{move_element(this)},"Allows you to redifine the parent container of this element (move it to anoter screen or another container element)"));
        this.settingsbar.add(settings_Icon("delete.svg",()=>
		{		
			this.removeme = function()
			{
				for(m of this.children)
				{
					m.removeme = this.removeme;
					m.removeme();
				}
			    /*allows plugins to perform aktions before an element gets deletet*/
		        for (var key in execute_before_element_deletion) 
		        {
		          if (execute_before_element_deletion.hasOwnProperty(key)) 
		          {
			        execute_before_element_deletion[key](this);
		          }
		        }
				for (var trans = 0; trans<logick_transaktions.length;trans++)
				{
					if (this == logick_transaktions[trans].evoker)
					{
						remove_element_actionbar(logick_transaktions[trans]);	
						trans--;
					}
					else if (this == logick_transaktions[trans].target)
					{
						remove_element_actionbar(logick_transaktions[trans]);	
						trans--;
					}
			 	}
				this.settingsbar.remove();
				this.remove();
			}
			this.removeme();
		},"Deletes this element and all its children"));
        this.settingsbar.make_Visible();
        this.settingsbar.initialise();
        logick_elements.eventtarget = this;
	}

    elem.create = function(target,x,y)
    {
        target.appendChild(this);

        /*setting button toproper position*/   
    	posx = (x - getPos(target).x || this.offsetLeft); 
    	posy = (y - getPos(target).y || this.offsetTop) + document.documentElement.scrollTop;

        this.fencey = this.offsetParent.clientHeight;
        this.fencex = this.offsetParent.clientWidth;

            if(posy<0)
            { 
                posy = 0;
            }
            else if(posy > this.fencey - this.offsetHeight) 
            {
                posy = this.fencey - this.offsetHeight;
            } 

            if(posx<0) posx = 0;
            else if(posx > this.fencex - this.offsetWidth) posx = this.fencex - this.offsetWidth;

            this.setpos(posx,posy);

			this.afterceration(this,x,y);
    }

    elem.onmousedown = function(e)
    {
        if(GLOBAL_OVERRIDE){GLOBAL_OVERRIDE(e);e.stopPropagation();return;}
        logick_elements.eventtarget = this;
        logik_bar_make_visible();
        elemToDrag = this;
        this.offsetx = e.pageX - this.offsetLeft; 
        this.offsety = e.pageY - this.offsetTop;
        this.fencey = this.offsetParent.clientHeight;
        this.fencex = this.offsetParent.clientWidth;
        document.body.addEventListener('mousemove', moveelem);
        elem.settingsbar.setpos();
        elem.settingsbar.make_Visible();

        e.stopPropagation();

        /*This event is needet, if plugins want to add their own functionality, after an element got selected.
        the message of the Event contains the selected element*/
        fireEvent("Element Selected", document, this);
    }

    document.onmouseup = function()
    {
        document.body.removeEventListener('mousemove', moveelem);
        elemToDrag = null;
    }

    return elem;
}

function allowDrop(ev) {
    ev.preventDefault();
    ev.target.offx = ev.clientX;
    ev.target.offy = ev.clientY;
}

function drag(ev) {
    ev.dataTransfer.setData("ElementName", ev.target.name);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("ElementName");
    elements[data](ev.target,ev.target.offx,ev.target.offy);
}



