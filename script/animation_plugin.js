/*This plugin enabels the use of animations, if addet inside the index.html*/
/*menu for the animation screen*/
var animation_types;
/*Specifies whether or not the application is in the animation tab*/
var in_animation_view = false;

/*Array containing all animations, the user created*/
var animations = [];

/*This event gets fired, after the initialisation in the onload.js has finisched*/
document.addEventListener("initialize",initializeAnimationPlugin);

/*constructor for animations*/
function animation(type,target,keyframes)
{
    this.target = target;
    this.type = type;
    this.keyframes = keyframes || [];
    
    this.addKeyframe = function(frame)
    {
        this.keyframes.push(frame);
    }
}

/*constructor for keyframes*/
function keyframe(time,x,y)
{
    this.time = dtime;
    this.dx = dx;
    this.dy = dy
}

/*Adds the needet funktionality for this plugin to the applycation*/
function initializeAnimationPlugin()
{
    /*adds the Button to switch to the animationview into the menu bar at position 2*/
    default_Menu.add(menubar_Item("Animations", changetoAnimationView),2);
    
    /*Creates the menu bar containing all the animation types*/
    animation_types = elementbar();
    animation_types.add(menubar_Item("Linear two point",create_linear_two_point_animation));

    /*
    Allows other plugins to depent on the this plugin. 
    If another plugin binds the initialisation of functions that require this plugin onto the 
    "animation_plugin_initialized" event,
    they will only get loadest when this plugin ist enabeld and fully loadet.
    */
    fireEvent("animation_plugin_initialized", document);
}

function changetoAnimationView()
{
    general_screenchange_cleanup();
    in_animation_view = true;

    /*registers an event listener for the selction of an element. this ist needet
    to recive the current selected element*/
    document.addEventListener("Element Selected",element_selected);

    /*Screens don't bubble events, but we nedd them to, so we simulate a bubbeling*/
    document.addEventListener("Screen Selected",simulate_bubbelingfor_screen_select);

    /*registers the cleaning funtion, so it gets executed everytime the screen is changed*/
    custom_screenchange_cleanup.clean_animation_screen = clean_animation_screen;

    notifikationbar.show("Klick on the Element you want to Animate"); 
    $("screencontainer").style.display="";

    /*Checks whether an element had been pree-selected in another screen.
    if so, it will be used as selected element. if not, notifikation baar ist shown*/
    for(bar of document.getElementsByClassName("settingsbar"))
    {
        /*element will not be selected, if it is a screen, because most people wont want so preselect a screen*/
        if(bar.style.display == "" && bar.parent.dataset["elementtype"] != "screen")
        {
            notifikationbar.hide();
            animation_bar_make_visible();
        }
    }

    /*event used to signal other plugins, that the animation view got selectet*/
    fireEvent("in animation View", document);
}

function animation_bar_make_visible()
{
    if(in_animation_view)
    {
        animation_types.style.display = "";
    }
   /*hides the animation bar, if current element gets unselected*/
   document.body.addEventListener("mousedown",animation_bar_hide);
}

function animation_bar_hide()
{
   animation_types.style.display = "none";
   document.body.removeEventListener("mousedown",animation_bar_hide);
}
function element_selected(e)
{
    /*registers the selected element onto the animation bar*/
    animation_types.target = e.param1;
    /*makes the animation bar visible to the user, if he ist currently inside the animationview*/
    animation_bar_make_visible();
}

function create_linear_two_point_animation()
{

}

function simulate_bubbelingfor_screen_select()
{
    fireEvent("mousedown", document.body);
}

/*custom clean function to restore the ui*/
function clean_animation_screen()
{
    animation_types.style.display = "none";
    in_animation_view = false;

    /*removes all event listeners propriotory to this screen, so the rest of the application won't be slowed down*/
    document.removeEventListener("Element Selected",element_selected);
    document.removeEventListener("Screen Selected",simulate_bubbelingfor_screen_select);

    /*removes the cleaning funtion, so it won't get executet everytime the screen changes*/
    delete custom_screenchange_cleanup.clean_animation_screen;
}
