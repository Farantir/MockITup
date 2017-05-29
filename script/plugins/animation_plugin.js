/***************************************************************/
/*This file is mostly needet for the UI part of the animations.*/
/*it also handels the data structure of the animation objekt   */
/***************************************************************/

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
    this.id;
    
    this.addKeyframe = function(frame)
    {
        this.keyframes.push(frame);
    }
}

/*constructor for keyframes*/
function keyframe(time,x,y)
{
    this.dtime = time;
    this.dx = x;
    this.dy = y;
}

/*Saves the animation data to data tags, so they will get stored inside the savafile*/
custom_presave_logick.save_animations = function()
{
    for(anim in animations)
    {
        /*Looks complicatet, but its really just using json stringify on the animation objekt and 
        doing some stuff to prevent a cyclic objekt exeption*/
        var animationtarget = animations[anim].target
        animations[anim].target = null;
        animationtarget.dataset["animation-"+anim] = JSON.stringify(animations[anim]);
        animations[anim].target = animationtarget;
    }
}

/*Deletes the data tags of the animation after saving*/
custom_presave_logick.save_animations.cleanup = function()
{
    for(anim in animations)
    {
        delete animations[anim].target.dataset["animation-"+anim];
    }
}

/*using the same function to save logic to a savefile and for creating the code for the pharser*/
compile_save_data_to_html.save_animations = custom_presave_logick.save_animations;

/*deletes the current animation array to allow the Savedata to be addet*/
custom_logick_before_loading.clear_savedata = function()
{
    animations = [];
}

/*Loads animations from the savefile*/
custom_loading_datatag_info.load_animations = function(atrname,atrvalue,target)
{
    if(atrname[1] == "animation")
    {
        var torestore = JSON.parse(atrvalue)
        torestore.target = target;
        animations[torestore.id] = torestore;
        /*now the logick menu for the animation needs to be created*/
        add_animaton_specifik_logick_buttons(torestore);
    }else if(atrname[1] == "animation_logik")
    {
        /*need to store animation and logick id somewhere to fix relations later on*/
        unresolved_relations.push({"animation": atrvalue, "transaktion": atrname[2]});
    }
}

/*used to fix realtion problems after the loading has finished*/
document.addEventListener("doneloading",function()
{
    for(var rel of unresolved_relations)
    {
        logick_transaktions[rel.transaktion].animation = rel.animation;
    }
});

/*Saves the logick and the anmation id, so the logick funktion knows, whitch animation to start*/
compile_save_data_to_html.link_logick_to_animations = function()
{
        /*clears the unresolved relations array*/
        unresolved_relations = [];
        for(m in logick_transaktions)
        {
            logick_transaktions[m].target.dataset["animation_logik-" + m] = logick_transaktions[m].animation;
        }
}

/*Required cleanup function to clear html data tags*/
compile_save_data_to_html.link_logick_to_animations.cleanup = function()
{
        for(m in logick_transaktions)
        {
            delete logick_transaktions[m].target.dataset["animation_logik-" + m];
        }
}

/*Again, using the same function for loading and compiling data*/
custom_presave_logick.link_logick_to_animations = compile_save_data_to_html.link_logick_to_animations;

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
            /*Sets the target for the animation, using the visible menu bar*/
            animation_types.target = bar.parent;
        }
    }

    /*event used to signal other plugins, that the animation view got selectet*/
    fireEvent("in animation View", document);
}
/*Function to create a menu used to input numbers*/
function number_input_overlay(target,set,someobjekt)
{
    var menu = document.createElement("div");
    menu.classList.add("textinput");
    
    menu.onmousedown = (x)=>{x.stopPropagation();};    

    menu.accept = document.createElement("button");
    menu.accept.appendChild(document.createTextNode("Accept"));

    menu.accept.input = document.createElement("input");
    menu.accept.input.type = "number";
    menu.accept.input.step = "0.01";
    menu.accept.set = set;
    menu.accept.target = target;

    menu.appendChild(menu.accept.input);
    menu.appendChild(menu.accept);

    document.body.appendChild(menu);
    
    menu.style.top = (getPos(menu.accept.target).y + menu.accept.target.offsetHeight + 5) + "px";
    menu.style.left = getPos(menu.accept.target).x + "px";

    menu.accept.onclick = function(){this.set(this.input.value);this.parentElement.remove();}

    menu.accept.additionaldata = someobjekt
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
    general_pre_animation_stuff();
    notifikationbar.show("Drag the Element to its Target Position");
    animation_types.style.display = "none";
    /*Creates the menu needet to confirm the current animation*/
    animation_confirm_abort = elementbar();
    animation_confirm_abort.add(menubar_Item("Confirm",apply_liear_two_point_animation));
    animation_confirm_abort.add(menubar_Item("Abort",()=>{animation_types.style.display = "";reset_position_after_creating_animation();}));
    animation_confirm_abort.style.display = "";
}

/*saves the animation*/
function apply_liear_two_point_animation()
{
    /*Creates a new keyframe arry*/
    var keyframes = [];
    /*creates a new keyframe using the endpoint of the animation*/
    var endpoint = new keyframe(1,animation_types.target.offsetLeft - animation_types.oldx,animation_types.target.offsetTop - animation_types.oldy);
    /*Adds the keyframe to the array*/
    keyframes.push(endpoint);

    /*creates a new animation using the keyfame array*/
    var linearanimation = new animation("linear",animation_types.target,keyframes);

    /*Repositions the objekt at its origin*/
    reset_position_after_creating_animation();

    /*opens a popup menu, so the user can imput the desired animation time*/
    notifikationbar.show("Enter the Animation Time in Sekonds"); 
    number_input_overlay(animation_types.target,function(value){this.additionaldata.dtime = value;notifikationbar.hide();},endpoint);

    /*Pushes the animation into the animation Array*/
    /*setting the array position as animation id. will be needet later on*/
    linearanimation.id = (animations.push(linearanimation)-1);
    
    /*adds a logick button to the element, if it dosen't has one already*/
    add_animaton_specifik_logick_buttons(linearanimation);
}

/*Creates the buttons needet for the logick menu, to start the animation*/
function add_animaton_specifik_logick_buttons(animation)
{
    if(!animation.target.hasAnimationMenu)
    { 
        /*Creates the entys for the logick menu*/
        animation.target.logick_menu.add(logick_menu_item("Play Animation",function(){select_specifik_animation(this.offsetParent.parent,logick_animation_start);}));
        animation.target.logick_menu.add(logick_menu_item("Reverse Animation",function(){select_specifik_animation(this.offsetParent.parent,logick_animation_reverse);}));

        /*Creates the entrys for the animation menu, used to select one of the elements animations specifikally*/
        animation.target.animation_selection_menu = elementbar();
        animation.target.animation_selection_menu.parent = animation.target;        

        /*Sets the has animation menu property to true, so onl one menu is created per element*/
        animation.target.hasAnimationMenu = true;
    }

    /*finally, we are adding the new animation to the animation menu
    todoo: add animation name*/
    var itemtoadd = elementbar_Item("Animation",animation_selection_menu_button_click);
    /*giving the new item its target animation*/
    itemtoadd.animationtselect = animation;
    animation.target.animation_selection_menu.add(itemtoadd);
}

/*Does all the things that need to be done before registering an animation, like saving the original position of the element*/
function general_pre_animation_stuff()
{
    /*saves the current position of the animated objekt, so it can be reset later.*/
    animation_types.oldx = animation_types.target.offsetLeft; 
    animation_types.oldy = animation_types.target.offsetTop;
}

/*restetting position after the creation of an animation, or after someone hit the abort button*/
function reset_position_after_creating_animation()
{
    /*Restores the previous position of an element, after the animation got created*/
    animation_types.target.setpos(animation_types.oldx,animation_types.oldy);

    /*Removes the menu, for its not needet anymore*/
    animation_confirm_abort.remove();
    delete animation_confirm_abort;

    /*removes the orange message bar*/
    notifikationbar.hide();
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

/*Creates a funktion to regisrter the logick effekts to sart an animation*/
function logick_animation_start(animation)
{
    var transaktion = new logick_transaktion(evoker,evoking_aktion,animation.target,"start_animation");
    transaktion.animation = animation.id;
    logick_transaktions.push(transaktion);
    reset_transaktion_elementindependent();
}
logick_dictionary["start_animation"] = "Starts an animation for";

/*Creates a funktion to regisrter the logick effekts to reverse an animation*/
function logick_animation_reverse(animation)
{
    var transaktion = new logick_transaktion(evoker,evoking_aktion,animation.target,"reverse_animation");
    transaktion.animation = animation.id;
    logick_transaktions.push(transaktion);
    reset_transaktion_elementindependent();
}
logick_dictionary["start_animation"] = "Reverses an animation for";

/*displays a custom menu, to select an animation a ne specifik element. If the animation gets selected
an overload function ist executetd*/
function select_specifik_animation(target,overload)
{
    /*Passes the overload to the menu and makes it visible, so the animations can be clicked*/
    target.animation_selection_menu.overload = overload;
    target.animation_selection_menu.style.display = "";
}
/*this function gets executet, when a specifik animation of the animation selcection menu, whitch each
element has, gets clicked*/
function animation_selection_menu_button_click()
{
    /*Hides the menu again, as it is no longer needet*/
    this.offsetParent.style.display = ""; 
    /*executes the overload funktion given by select_specifik_animation(target,overload)
    passes the selected animation as parameter*/
   this.offsetParent.overload(this.animationtselect);
}

