/*************************************************************************/
/*This Plugin changes the Opacity off All Screens exept the selected one,*/ 
/*so Elements on the selected Scrreen are Easyer to identify             */
/*************************************************************************/

/*higlightes the clicked screen*/
document.addEventListener("Screen Selected",(e)=>{higlight_screen(e.param1);});
/*higlightes the screen the Element sits on*/
document.addEventListener("Element Selected",(e)=>{higlight_screen(find_parent_screen(e.param1));});

/*ensures the screencontainer is always below its children*/
document.addEventListener("initialize",()=>{$("screencontainer").style.zIndex = "-2"});

/*this function is used to obtain the parent screen, of an emlement recursively.
Its also defined inside the Animation plugin, so we will redifine it only, if animation plugin is not present*/
find_parent_screen = find_parent_screen || function find_parent_screen(element)
{
    if(element.dataset["elementtype"] == "screen") return element;
    else return find_parent_screen(element.offsetParent);
}

/*changes z index so that screen and elements on it will be above all other screens*/
function higlight_screen(e)
{
    for(var screen of $("screencontainer").children)
    {
        screen.style.zIndex = "-1";
        screen.style.opacity = "0.5";
    }
    e.style.zIndex = "0";
    e.style.opacity = "1";
}

/*resets everything on screenschange. espacially important for testing*/
custom_screenchange_cleanup.reset_screen_highliting = reset_opacity_of_screens;

/*resets the opacity of the screens whenever necassary*/
function reset_opacity_of_screens()
{
    for(var screen of $("screencontainer").children)
    {
        screen.style.zIndex = "0";
        screen.style.opacity = "1";
    }
}
