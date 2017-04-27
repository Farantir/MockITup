var tmpnewelement;

function gotoNewElement()
{
/*Initialises the view*/
	$("screencontainer").style.display="none";
    //grafic_elements.style.display = "none";
    newElement_menubar.make_Visible();
    default_Menu.hide();
    newElement_menubar.flush();

/*Creates a custom container for the new element*/
  newelscreen = document.createElement("div");
  newelscreen.classList.add("screencontainer");
  newelscreen.id="testscreencontainer";
  document.body.appendChild(newelscreen);

  screen = create_Screen();
  newelscreen.appendChild(screen);

/*Creates the new element*/
	b = document.createElement("div");
	b = make_Container(b);
	b.create(screen,50,50);
    b.style.border = "3px solid #000000";
    b.scale(100,100);
    b.setpos(50,50);
    b.settingsbar.recalculate_positons();

    tmpnewelement = b;
}

var newelementname;
function newelementsetname()
{
    text_input_overlay(tmpnewelement,(x)=>{newelementname=x;new_element_save();})
    notifikationbar.show("Enter a name for the element");
}

function new_element_save()
{
    name = newelementname;
    grafic_elements.add(elementbar_Item(name));

    elements[name] = function(e,x,y)
    {
        tocreate = this.item.cloneNode(true);
        tocreate.dataset.elementtype = "custom";
        for(m of tocreate.children) elements[m.dataset.elementtype].createfromsave(m);
        elements[tocreate.dataset.elementtype].createfromsave(tocreate);
        tocreate.create(e,x,y);
    }
    var tmpel = tmpnewelement.cloneNode(true);
    tmpel.style.border = "";
    elements.item = tmpel;
    grafik();
}
