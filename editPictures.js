var picture_to_edit;
var canvas_to_edit_picture_on;

function gotoeditPicture(picture)
{
/*Initialises the view*/
	$("screencontainer").style.display="none";
    grafic_elements.style.display = "none";
    editPicture_menubar.make_Visible();
    default_Menu.hide();
    editPicture_menubar.flush();
    pictureEdit.make_Visible();

/*Sets the target Picture*/
    picture_to_edit = picture;

/*Creates a custom container for the new element*/
  newelscreen = document.createElement("div");
  newelscreen.classList.add("screencontainer");
  newelscreen.id="testscreencontainer";
  document.body.appendChild(newelscreen);

  screen = create_Screen();
  newelscreen.appendChild(screen);

/*Creates the cavas to edit the pcture on*/
    canvas_to_edit_picture_on = createCanvasToDrawOn(newelscreen,50,50,picture);
    b.settingsbar.recalculate_positons();

    tmpnewelement = b;
}

function createCanvasToDrawOn(e,x,y,img)
{
	b = document.createElement("canvas");
    b.height = img.height;
    b.width = img.width;
    var ctx = b.getContext("2d");
    ctx.drawImage(img,0,0);
    b.draggable="false";
    b.ondragstart = function() { return false; };
	b = make_Container(b);
    b.jsoncreate = function(target)
    {
        this.settingsbar.ul.remove();
    }
	b.create(e,x,y)
    return b;
}

function savePicture()
{
    picture_to_edit.src = canvas_to_edit_picture_on.toDataURL();
    grafik();
}
