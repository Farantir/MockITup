var picture_to_edit;
var canvas_to_edit_picture_on;
var canvas_canbescaled = true;
var editImage_DrawingColor = "black";
var editImage_strokesize = "5";

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

    /*Changes the size of the image instead of streching it, like css does it to all of the other elements*/
    /*Also removing fencing, since the picture can be as large as desierd. it will be scale in grafik view later on*/
    b.scale = function(x,y)
    {
        if(canvas_canbescaled)
        {
            canvas_canbescaled = false;
            /*Scaving the old canvas contend*/
            var oldcontent = canvas_to_edit_picture_on.toDataURL();
            /*if(this.offsetTop > this.fencey - y) y = this.fencey - this.offsetTop;
            if(this.offsetLeft > this.fencex - x) x = this.fencex - this.offsetLeft;*/
        }
        this.height = y;
        this.width = x;

        /*restoring old contend*/
        var img = new Image;
        img.onload = function(){
            canvas_to_edit_picture_on.getContext("2d").drawImage(img,0,0);
            canvas_canbescaled = true;
        };
        img.src = oldcontent;
    }

    return b;
}

function draw_on_canvas()
{
    GLOBAL_OVERRIDE = edit_image_initialise_draw;
}

function erase_from_canvas()
{
    GLOBAL_OVERRIDE = edit_image_initialise_erase;
}

function edit_image_initialise_draw(e)
{
       canvas_to_edit_picture_on.addEventListener('mousemove',draw_on_canvas_drawing);
       document.addEventListener('mouseup',draw_on_canvas_end_draw);
        var offset = getPos(canvas_to_edit_picture_on);;
       canvas_to_edit_picture_on.offsetx = offset.x;
       canvas_to_edit_picture_on.offsety = offset.y;
       draw_on_canvas_draw_dot(e.pageX - canvas_to_edit_picture_on.offsetx,e.pageY - canvas_to_edit_picture_on.offsety)
}

function edit_image_initialise_erase(e)
{
       canvas_to_edit_picture_on.addEventListener('mousemove',draw_on_canvas_erasing);
       document.addEventListener('mouseup',draw_on_canvas_end_draw);
        var offset = getPos(canvas_to_edit_picture_on);;
       canvas_to_edit_picture_on.offsetx = offset.x;
       canvas_to_edit_picture_on.offsety = offset.y;
       draw_on_canvas_erase_rect(e.pageX - canvas_to_edit_picture_on.offsetx,e.pageY - canvas_to_edit_picture_on.offsety)
}

function draw_on_canvas_drawing(e)
{
  x = e.clientX;
  y = e.clientY + document.documentElement.scrollTop;

  posy = (y - canvas_to_edit_picture_on.offsety);
  posx = (x - canvas_to_edit_picture_on.offsetx);

  draw_on_canvas_draw_dot(posx,posy);
}

function draw_on_canvas_erasing(e)
{
  x = e.clientX;
  y = e.clientY + document.documentElement.scrollTop;

  posy = (y - canvas_to_edit_picture_on.offsety);
  posx = (x - canvas_to_edit_picture_on.offsetx);

  draw_on_canvas_erase_rect(posx,posy);
}

function draw_on_canvas_draw_dot(x,y)
{
  var context = canvas_to_edit_picture_on.getContext("2d");
  context.beginPath();
  context.arc(x, y, editImage_strokesize, 0, 2 * Math.PI, false);
  context.fillStyle = editImage_DrawingColor;
  context.fill();
}

function draw_on_canvas_erase_rect(x,y)
{
  var context = canvas_to_edit_picture_on.getContext("2d");
  context.clearRect(x-editImage_strokesize,y-editImage_strokesize,editImage_strokesize*2,editImage_strokesize*2);
}

function draw_on_canvas_end_draw()
{
    canvas_to_edit_picture_on.removeEventListener('mousemove',draw_on_canvas_drawing);
    document.removeEventListener('mouseup',draw_on_canvas_end_draw);
    canvas_to_edit_picture_on.removeEventListener('mousemove',draw_on_canvas_erasing);
}

function edit_image_back_to_mouse()
{
    GLOBAL_OVERRIDE = null;
}

function savePicture()
{
    GLOBAL_OVERRIDE = null;
    picture_to_edit.src = canvas_to_edit_picture_on.toDataURL();
    grafik();
}

function canvas_erase_picture()
{
    GLOBAL_OVERRIDE = null;
    canvas_to_edit_picture_on.getContext("2d").clearRect(0,0,canvas_to_edit_picture_on.width,canvas_to_edit_picture_on.height);
}
