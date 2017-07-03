/*****************************************************************************/
/*Plugin That lets the User move the screen-container by dragging the screens*/
/*****************************************************************************/

/*no initialisation code needet. Plugin solely depends on Events*/

/*To move your own elements along with the screen container, refer to the Screencontainer Moved event*/

/*needet to enable dragging on screens, when they get klicked*/
document.addEventListener("Screen Selected",initialize_screen_dragging);

/*function executet when clicked on a screen. initializes dragging on mouse move*/
function initialize_screen_dragging(e)
{
    screencontainer = $("screencontainer");
    screencontainer.offsety = e.param2.pageY - getPos(screencontainer).y;
    screencontainer.offsetx = e.param2.pageX - getPos(screencontainer).x;
    document.body.addEventListener('mouseup', end_drgging_of_screens);
    document.body.addEventListener('mousemove', move_screens_on_mousemove);
}

/*moving the screen-container*/
function move_screens_on_mousemove(e)
{
  x = e.clientX + document.documentElement.scrollLeft;
  y = e.clientY + document.documentElement.scrollTop;
  posy = (y - screencontainer.offsety);
  posx = (x - screencontainer.offsetx);

  /*uses event to let other plugins move menus along with the screens acordingly*/
  fireEvent("Screencontainer Moved", document, (posx-screencontainer.offsetLeft)/*pixels moved in x direction*/ , (posy-screencontainer.offsetTop)/*pixels moved in y direction*/);

  screencontainer.style.left = posx + "px";
  screencontainer.style.top = posy + "px";
}

/*unbinds the mousemove event and the mouseup event on mouseup. this way the Screencontainer wont be moved anymore*/
function end_drgging_of_screens()
{
   document.body.removeEventListener('mousemove', move_screens_on_mousemove);
   document.body.removeEventListener('onmouseup', end_drgging_of_screens);
}
