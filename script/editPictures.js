var picture_to_edit;
var canvas_to_edit_picture_on;
var canvas_canbescaled = true;
var editImage_FillColor = document.createElement("input");
var editImage_StrokeColor = document.createElement("input");
var editImage_strokesize = document.createElement("input");
var currenttool = "hand";
var s;
var tools = new function(){};

editImage_FillColor.type = "color";
editImage_StrokeColor.type = "color";
editImage_strokesize.style.width = "50px";
editImage_strokesize.value = "5";
editImage_strokesize.type = "number";

Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};

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

/*Creates the canvas to edit the pcture on*/
    canvas_to_edit_picture_on = createCanvasToDrawOn(newelscreen,50,50,picture);
    b.settingsbar.recalculate_positons();

    s = new CanvasState(b);
    s.addShape(new Shape("img", 0, 0, picture_to_edit.width, picture_to_edit.height, null, null, null, null, null, picture_to_edit));
    //tmpnewelement = b;
    s.valid = false;
}

function createCanvasToDrawOn(e,x,y,img)
{
	b = document.createElement("canvas");
    b.height = img.height;
    b.width = img.width;
    b.style.border = "1px dashed";    
    var ctx = b.getContext("2d");
    ctx.drawImage(img,0,0);
    b.draggable="false";
    b.ondragstart = function() { return false; };
	b = make_Container(b);
    b.jsoncreate = function(target)
    {
        this.settingsbar.ul.remove();
    }
	b.create(e,x,y);
	
	b.settingsbar.scaleBottom.remove();
    b.settingsbar.scaleBottomLeft.remove();
    b.settingsbar.scaleRight.remove();
    b.settingsbar.scaleTop.remove();
    b.settingsbar.scaleTopLeft.remove();
    b.settingsbar.scaleTopRight.remove();
    b.settingsbar.scaleLeft.remove();

    /*Changes the size of the image instead of streching it, like css does it to all of the other elements*/
    /*Also removing fencing, since the picture can be as large as desierd. it will be scale in grafik view later on*/
    b.scale = function(x,y)
    {
        this.height = y;
        this.width = x;
        s.height = y;
        s.width = x;

        s.valid = false;
    }
    return b;
}

/*Sets the canvas into drawing mode*/
function draw_on_canvas()
{
    GLOBAL_OVERRIDE = edit_image_draw;
}

/*Intialises onmosedown and mousemove functions to make a dot on the screen*/
function edit_image_draw(e)
{
     /*  canvas_to_edit_picture_on.addEventListener('mousemove',draw_on_canvas_drawing);
       document.addEventListener('mouseup',draw_on_canvas_end_draw);
        var offset = getPos(canvas_to_edit_picture_on);;
       canvas_to_edit_picture_on.offsetx = offset.x;
       canvas_to_edit_picture_on.offsety = offset.y;
       draw_on_canvas_draw_dot(e.pageX - canvas_to_edit_picture_on.offsetx,e.pageY - canvas_to_edit_picture_on.offsety) */
    if(currenttool == "hand")
    {
    var mouse = s.getMouse(e);
    var mx = mouse.x;
    var my = mouse.y;
    var shapes = s.shapes;

    
    var l = shapes.length;
    for (var i = l-1; i >= 0; i--) 
    {
      if (shapes[i].contains(mx, my))
       {
        var mySel = shapes[i];
        // Keep track of where in the object we clicked
        // so we can move it smoothly (see mousemove)
        s.dragoffx = mx - mySel.x;
        s.dragoffy = my - mySel.y;
        s.dragging = true;
        s.selection = mySel;
        s.valid = false;
        return;
      }
    }
  
    // havent returned means we have failed to select anything.
    // If there was an object selected, we deselect it
    if (s.selection) {
      s.selection = null;
      s.valid = false; // Need to clear the old selection border
    }
  }

  if(currenttool != "hand")
  {
  
  var mouse = s.getMouse(e);
  dx = mouse.x;
  dy = mouse.y;
  if(currenttool == "rectangle")
  {
  shape = new Shape("rectangle", mouse.x, mouse.y, 0, 0, null, null, editImage_FillColor.value, editImage_StrokeColor.value, editImage_strokesize.value);
  s.addShape(shape);
  }

  if(currenttool == "line")
  {
  shape = new Shape("line", mouse.x, mouse.y, 0, 0, null, null, editImage_FillColor.value, editImage_StrokeColor.value, editImage_strokesize.value);
  s.addShape(shape);
  }

  if(currenttool == "pencil")
  {
  shape = new Shape("pencil", mouse.x, mouse.y, 0, 0, null, null, editImage_FillColor.value, editImage_StrokeColor.value, editImage_strokesize.value);
  s.addShape(shape);
  }

  if(currenttool == "circle")
  {
  
  shape = new Shape("circle", mouse.x, mouse.y, 0, 0, null, null, editImage_FillColor.value, editImage_StrokeColor.value, editImage_strokesize.value);
  s.addShape(shape);
  }

  s.drawing = true;
  }

}

function toggel_dark_mode()
{
    if($("testscreencontainer").children[0].bg == "dark")
    { 
        $("testscreencontainer").children[0].bg = "light";
        $("testscreencontainer").children[0].style.backgroundColor = "white";
    }
    else
    {
        $("testscreencontainer").children[0].bg = "dark";
        $("testscreencontainer").children[0].style.backgroundColor = "#272727";
    }
}


function edit_image_back_to_mouse()
{
    GLOBAL_OVERRIDE = null;
    s.selection = null;
    s.valid = false;
}

function savePicture()
{
    GLOBAL_OVERRIDE = null;
    s = null;
    picture_to_edit.src = canvas_to_edit_picture_on.toDataURL();
    grafik();
}

function canvas_erase_picture()
{
    GLOBAL_OVERRIDE = null;
    s.clear();
    s.shapes = [];
}

function set_tool_rectangle() {
    currenttool = "rectangle";
    GLOBAL_OVERRIDE = edit_image_draw;
    s.selection = null;
    s.valid = false;
}

function set_tool_circle() {
    currenttool = "circle";
    GLOBAL_OVERRIDE = edit_image_draw;
    s.selection = null;
    s.valid = false;
}

function set_tool_line() {
    currenttool = "line";
    GLOBAL_OVERRIDE = edit_image_draw;
    s.selection = null;
    s.valid = false;
}

function set_tool_pencil() {
    currenttool = "pencil";
    GLOBAL_OVERRIDE = edit_image_draw;
    s.selection = null;
    s.valid = false;
}

function set_tool_hand() {
    currenttool = "hand";
    GLOBAL_OVERRIDE = edit_image_draw;
}

// Constructor for Shape objects to hold data for all drawn objects.
// For now they will just be defined as rectangles.
function Shape(type, x, y, w, h, coordsx, coordsy, fill, strokeStyle, lineWidth, url)
{
  // This is a very simple and unsafe constructor. All we're doing is checking if the values exist.
  // "x || 0" just means "if there is a value for x, use that. Otherwise use 0."
  // But we aren't checking anything else! We could put "Lalala" for the value of x 
  this.type = type;
  this.x = x || 0;
  this.y = y || 0;
  this.w = w || 1;
  this.h = h || 1;
  this.coordsx = coordsx || [];
  this.coordsy = coordsy || [];
  this.fill = fill || '#AAAAAA';
  this.strokeStyle = strokeStyle || '#AAAAAA';
  this.lineWidth = lineWidth || 5; 
  this.url = url || null;
}

// Draws this shape to a given context
Shape.prototype.draw = function(ctx)
{
  ctx.fillStyle = this.fill;
  ctx.strokeStyle = this.strokeStyle;
  ctx.lineWidth = this.lineWidth;

  tools[this.type](this, ctx);
}

tools["rectangle"] = function(shape, ctx) 
{
  ctx.strokeRect(shape.x, shape.y, shape.w, shape.h);
  ctx.fillRect(shape.x, shape.y, shape.w, shape.h);
}

tools["circle"] = function(shape, ctx) 
{
  var r = Math.sqrt(Math.pow(shape.w, 2) + Math.pow(shape.h, 2));
  
  ctx.beginPath();
  ctx.arc(shape.x, shape.y, r, 0, 2 * Math.PI, false);
  
  ctx.fill();
  ctx.stroke();
}


tools["line"] = function(shape, ctx)
{
  ctx.beginPath();
  ctx.moveTo(shape.x, shape.y);
  ctx.lineTo(shape.x + shape.w, shape.y + shape.h);
 
  ctx.stroke();
}

tools["pencil"] = function(shape, ctx)
{
  var l = shape.coordsx.length;

  ctx.beginPath();
  ctx.moveTo(shape.x, shape.y);
   for (var i = 0; i <= l; i++)
   {
      ctx.lineTo(shape.x + shape.coordsx[i], shape.y + shape.coordsy[i]);
   }

  ctx.lineJoin = 'round';

  ctx.stroke();
}

tools["img"] = function(shape, ctx) 
{
  ctx.drawImage(shape.url, shape.x, shape.y, shape.w, shape.h);
}

// Determine if a point is inside the shape's bounds
Shape.prototype.contains = function(mx, my)
{
  return tools[this.type].contains(mx, my, this);
}

tools["rectangle"].contains = function(mx, my, shape)
{
    if (shape.w > 0 && shape.h > 0)
    {
       return  (shape.x <= mx) && (shape.x + shape.w >= mx) &&
               (shape.y <= my) && (shape.y + shape.h >= my);
    }
    else if  (shape.w < 0 && shape.h > 0)
    {
       return  (shape.x >= mx) && (shape.x + shape.w <= mx) &&
                  (shape.y <= my) && (shape.y + shape.h >= my);
    }
    else if (shape.w > 0 && shape.h < 0)
    {
      return  (shape.x <= mx) && (shape.x + shape.w >= mx) &&
              (shape.y >= my) && (shape.y + shape.h <= my);
    }
    else
    {
      return  (shape.x >= mx) && (shape.x + shape.w <= mx) &&
              (shape.y >= my) && (shape.y + shape.h <= my);
    } 
}

tools["line"].contains = function(mx, my, shape, x, y, w, h)
{ //SIEHE SKIZZE
    var vecx = w || shape.h * -1;
    var vecy = h || shape.w;

    var shapew = w || shape.w;
    var shapeh = h || shape.h;

    var shapex = x || shape.x;
    var shapey = y || shape.y; 

    var abs = Math.sqrt((vecx * vecx) + (vecy * vecy));

    vecx = vecx / abs;
    vecy = vecy / abs;

    var p1x, p1y, p2x, p2y, p3x, p3y, p4x, p4y;

    p1x = vecx * shape.lineWidth * 1.5 * 0.5 + shapex;
    p1y = vecy * shape.lineWidth * 1.5 * 0.5 + shapey;

    p2x = vecx * shape.lineWidth * 1.5 * -0.5 + shapex;
    p2y = vecy * shape.lineWidth * 1.5 * -0.5 + shapey;

    p3x = vecx * shape.lineWidth * 1.5 * 0.5 + shapex + shapew;
    p3y = vecy * shape.lineWidth * 1.5 * 0.5 + shapey + shapeh;

    var e1x = p3x - p1x;
    var e1y = p3y - p1y;

    var e2x = p2x - p1x;
    var e2y = p2y - p1y;

    var mvecx = mx - p1x;
    var mvecy = my - p1y;

    var abse1 = Math.sqrt((e1x * e1x) + (e1y * e1y));
    
    e1x = e1x / abse1;
    e1y = e1y / abse1;

    var abse2 = Math.sqrt((e2x * e2x) + (e2y * e2y));

    e2x = e2x / abse2;
    e2y = e2y / abse2;
    
    var absmvec = Math.sqrt((mvecx * mvecx) + (mvecy * mvecy));

    mvecx = mvecx / abs;
    mvecy = mvecy / abs;   
    
    var earlyquit1 = mvecx * e1x + mvecy * e1y;
    var earlyquit2 = mvecx * e2x + mvecy * e2y;

    if (earlyquit1 < 0 || earlyquit2 < 0)
      {return false;}

    var absp1 = absmvec * ((mvecx * e1x) + (mvecy * e1y)); 
    var absp2 = absmvec * ((mvecx * e2x) + (mvecy * e2y));

    if (absp1 <= abse1 && absp2 <= abse2)
      {
        return true;
      }

      return false;

}

tools["img"].contains = function(mx, my, shape)
{
    return tools["rectangle"].contains(mx,my, shape);
}

tools["pencil"].contains = function(mx, my, shape)
{
  var l = shape.coordsx.length;
  var t = false;
  var r = shape.lineWidth * 2;

  var r2 = Math.sqrt(Math.pow(mx - shape.x, 2) + Math.pow(my - shape.y, 2));

  t = (r2 <= r);

  if (t) return t;

  for (i = 0; i < l-1; i++)
    {
      r2 = Math.sqrt(Math.pow(mx - (shape.x + shape.coordsx[i]), 2) + Math.pow(my - (shape.y + shape.coordsy[i]), 2));

      t = (r2 <= r);
      if (t) return t;
    }
  
  return t;
}

tools["circle"].contains = function(mx, my, shape)
{
  var r = Math.sqrt(Math.pow(shape.w, 2) + Math.pow(shape.h, 2));

  var r2 = Math.sqrt(Math.pow(mx - shape.x, 2) + Math.pow(my - shape.y, 2));

  return (r2 <= r);
}


function CanvasState(canvas) {
  // **** First some setup! ****
  
  this.canvas = canvas; 
  
  this.width = canvas.width;
  this.height = canvas.height;
  this.ctx = canvas.getContext('2d');
  // This complicates things a little but but fixes mouse co-ordinate problems
  // when there's a border or padding. See getMouse for more detail
  var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
  if (document.defaultView && document.defaultView.getComputedStyle) {
    this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
    this.stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
    this.styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
    this.styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;
  }
  // Some pages have fixed-position bars (like the stumbleupon bar) at the top or left of the page
  // They will mess up mouse coordinates and this fixes that
  var html = document.body.parentNode;
  this.htmlTop = html.offsetTop;
  this.htmlLeft = html.offsetLeft;

  // **** Keep track of state! ****
  
  this.valid = false; // when set to false, the canvas will redraw everything
  this.shapes = [];  // the collection of things to be drawn
  this.dragging = false; // Keep track of when we are dragging
  this.drawing = false; // Keep track of when we are drawing
  this.selection = null; // the current selected object. In the future we could turn this into an array for multiple selection
  this.dragoffx = 0; // See mousedown and mousemove events for explanation
  this.dragoffy = 0;
  
  // **** Then events! ****
  
  // This is an example of a closure!
  // Right here "this" means the CanvasState. But we are making events on the Canvas itself,
  // and when the events are fired on the canvas the variable "this" is going to mean the canvas!
  // Since we still want to use this particular CanvasState in the events we have to save a reference to it.
  // This is our reference!
  var myState = this;
  
  //fixes a problem where double clicking causes text to get selected on the canvas
  canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);
  // Up, down, and move are for dragging

  canvas.addEventListener('mousemove', function(e) {
    if (myState.dragging){

      var mouse = myState.getMouse(e);

      if (myState.selection.type == "rectangle" || myState.selection.type == "line" || myState.selection.type == "circle" || myState.selection.type == "img" )
      {
      // We don't want to drag the object by its top-left corner, we want to drag it
      // from where we clicked. Thats why we saved the offset and use it here
      myState.selection.x = mouse.x - myState.dragoffx;
      myState.selection.y = mouse.y - myState.dragoffy; 
      }
      else if (myState.selection.type == "pencil")
      {
        myState.selection.x = mouse.x - myState.dragoffx;
        myState.selection.y = mouse.y - myState.dragoffy; 

        for (i = 0; i < myState.selection.coordsx.length; i++)
        {
          myState.selection.coordsx[i] - myState.dragoffx;
          myState.selection.coordsy[i] - myState.dragoffy;
        }      
      }

      myState.valid = false; // Something's dragging so we must redraw
    }

    if (myState.drawing)
    {
        var mouse = myState.getMouse(e);

        if(currenttool == "rectangle" || currenttool == "line" || currenttool == "circle")
        {            
          shape.w = mouse.x - dx;
          shape.h = mouse.y - dy;
        }
        else if (currenttool == "pencil")
        {
          shape.coordsx.push(mouse.x - dx);
          shape.coordsy.push(mouse.y - dy);
        }

        myState.valid = false;
    }

  }, true);

  canvas.addEventListener('mouseup', function(e) {
    if (currenttool == "path")
    {
      return;
    }
 
    myState.dragging = false;
    myState.drawing = false;
  }, true);

  document.addEventListener('keydown', function(e){
    
   if(e.keyCode == 46){
     if (myState.selection)
     {
       var index = myState.shapes.indexOf(myState.selection);
       if (index > -1) 
       {
          myState.shapes.splice(index, 1);
       }

       myState.valid = false;
       myState.selection = null;
     }
  }
  }, true);
  
  // **** Options! ****
  this.selectionColor = '#CC0000';
  this.selectionWidth = 2;  
  this.interval = 30;
  setInterval(function() { myState.draw(); }, myState.interval);
}


CanvasState.prototype.addShape = function(shape) {
  this.shapes.push(shape);
  this.valid = false;
}

CanvasState.prototype.clear = function() {
  this.ctx.clearRect(0, 0, this.width, this.height);
}

// While draw is called as often as the INTERVAL variable demands,
// It only ever does something if the canvas gets invalidated by our code
CanvasState.prototype.draw = function() {
  // if our state is invalid, redraw and validate!
  if (!this.valid) {
    var ctx = this.ctx;
    var shapes = this.shapes;
    this.clear();
    
    // ** Add stuff you want drawn in the background all the time here **
    
    // draw all shapes
    var l = shapes.length;
    for (var i = 0; i < l; i++) {
      var shape = shapes[i];
      // We can skip the drawing of elements that have moved off the screen:
      if (shape.x > this.width || shape.y > this.height ||
          shape.x + shape.w < 0 || shape.y + shape.h < 0) continue;
      shapes[i].draw(ctx);
    }
    
    // draw selection
    // right now this is just a stroke along the edge of the selected Shape
    if (this.selection != null) {
      ctx.strokeStyle = this.selectionColor;
      ctx.lineWidth = this.selectionWidth;
      ctx.setLineDash([5, 3]);
      var mySel = this.selection;

        if (mySel.type == "rectangle" || mySel.type == "img" )
        {
          ctx.strokeRect(mySel.x - 10, mySel.y - 10, mySel.w + 20, mySel.h + 20);
        }
        else if (mySel.type == "circle")
        {
          var r = Math.sqrt(Math.pow(mySel.w, 2) + Math.pow(mySel.h, 2));
  
          ctx.beginPath();
          ctx.arc(mySel.x, mySel.y, r + 10, 0, 2 * Math.PI, false);
          ctx.stroke();
        }
        else if (mySel.type == "line")
        {
          var vecx = mySel.h * -1;
          var vecy = mySel.w;

          var abs = Math.sqrt((vecx * vecx) + (vecy * vecy));

          vecx = vecx / abs;
          vecy = vecy / abs;

          var p1x, p1y, p2x, p2y, p3x, p3y, p4x, p4y;

          p1x = vecx * mySel.lineWidth * 1.5 * 0.5 + mySel.x;
          p1y = vecy * mySel.lineWidth * 1.5 * 0.5 + mySel.y;

          p2x = vecx * mySel.lineWidth * 1.5 * -0.5 + mySel.x;
          p2y = vecy * mySel.lineWidth * 1.5 * -0.5 + mySel.y;

          p3x = vecx * mySel.lineWidth * 1.5 * 0.5 + mySel.x + mySel.w;
          p3y = vecy * mySel.lineWidth * 1.5 * 0.5 + mySel.y + mySel.h;

          p4x = vecx * mySel.lineWidth * 1.5 * -0.5 + mySel.x + mySel.w;
          p4y = vecy * mySel.lineWidth * 1.5 * -0.5 + mySel.y + mySel.h;

          ctx.beginPath();
          ctx.moveTo(p1x, p1y);
          ctx.lineTo(p3x, p3y);
          ctx.lineTo(p4x, p4y);
          ctx.lineTo(p2x, p2y);
          ctx.lineTo(p1x, p1y);
          ctx.stroke(); 

          var e1x = p3x - p1x;
          var e1y = p3y - p1y;

          var e2x = p2x - p1x;
          var e2y = p2y - p1y;
            
        }
        else if (mySel.type == "pencil")
        {    
          var maxX = mySel.coordsx.max() + mySel.x;
          var maxY = mySel.coordsy.max() + mySel.y;
          var minX = mySel.coordsx.min() + mySel.x;
          var minY = mySel.coordsy.min() + mySel.y;

          ctx.beginPath();
          ctx.moveTo(minX, minY);
          ctx.lineTo(minX, maxY);
          ctx.lineTo(maxX, maxY);
          ctx.lineTo(maxX, minY);
          ctx.lineTo(minX, minY);
          ctx.stroke();
        }
      ctx.setLineDash([]);
    }
    
    // ** Add stuff you want drawn on top all the time here **
    
    this.valid = true;
  }
}

// Creates an object with x and y defined, set to the mouse position relative to the state's canvas
// If you wanna be super-correct this can be tricky, we have to worry about padding and borders
CanvasState.prototype.getMouse = function(e) {
  var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;
  
  // Compute the total offset
  if (element.offsetParent !== undefined) {
    do {
      offsetX += element.offsetLeft;
      offsetY += element.offsetTop;
    } while ((element = element.offsetParent));
  }

  // Add padding and border style widths to offset
  // Also add the <html> offsets in case there's a position:fixed bar
  offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
  offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;

  mx = e.pageX - offsetX;
  my = e.pageY - offsetY;
  
  // We return a simple javascript object (a hash) with x and y defined
  return {x: mx, y: my};
}
