/***************************************************************/
/*This file is mostly needet for the UI part of the animations.*/
/*it also handels the data structure of the animation objekt   */ 
/*to use animations, this file needs to be addet in the        */
/*index.thml together with the animation_plugin_test_ligick.js */
/***************************************************************/

/*This plugin enabels the use of animations, if addet inside the index.html*/
/*This objekt can be used by other plugins, that depend on the animation plugin
it enables plugins to execute code, before a specifik animation gets deleted.
any function addet to this objekt will be called before an animation gets deletet.
the id of the animation to delete will be passed as parameter*/
execute_before_animation_deletion = {};

/*Adding a function to this objekt will cause it to be excutet,
before the id of a specifik animaton gets changed.
the given parameters are: 
old_animation_id and new_animation_id*/
execut_before_animation_changes_id = {};

/*Adding a funktion to this objekt lets plugins
add cutom icons to the animation settings-bar.
the function will recive the target animation as 
parameter and should return the DOM objekt to add*/
add_custom_icon_to_animation_settings = {};

/*menu for the animation screen*/
var animation_types;

/*Specifies whether or not the application is in the animation tab*/
var in_animation_view = false;

/*Array containing all animations, the user created*/
var animations = [];

/*This event gets fired, after the initialisation in the onload.js has finisched*/
document.addEventListener("initialize",initializeAnimationPlugin);

/*div that displays animation previews*/
var aniamtion_preview_container = null;

/*constructor for animations*/
function animation(type,target,keyframes,name)
{
    this.target = target;
    this.type = type;
    this.keyframes = keyframes || [];
    this.id;
    this.name = name || "Animation"
    
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
        animations[anim].target = null;animation
        animationtarget.dataset["animation-"+anim] = JSON.stringify(animations[anim]);
        animations[anim].target = animationtarget;
    }
}

/*Deletes the data tags of the animation after saving*/
custom_presave_logick.save_animations.cleanup = function()
{
    for(var anim in animations)
    {
        delete animations[anim].target.dataset["animation-"+anim];
    }
}

/*using the same function to save logic to a savefile and for creating the code for the pharser,
however it needs to get expandet, so it is able to link the events of animation finished playing*/
compile_save_data_to_html.save_animations = function()
{
    /*filtering the animation id and linking the animation to the logick event*/
    for(var m in logick_transaktions)
    {
        var array = logick_transaktions[m].evoking_aktion.split("-");
        if(array[0]=="animation_finished")
        {
            save_animation_events_to_html(array[1],"animation_finished","event_on_finisched",m)
        }else if(array[0]=="animation_reversed")
        {
            save_animation_events_to_html(array[1],"animation_reversed","event_on_reversed",m)
        }
    }
    custom_presave_logick.save_animations(); 
}

/*function to save events to html, that a specifik animation owns*/
function save_animation_events_to_html(animation_id,event_name,event_array_name,logick_transaktion)
{
    if(!animations[animation_id][event_array_name]) animations[animation_id][event_array_name] = [];
    animations[animation_id][event_array_name].push(logick_transaktion);
    logick_transaktions[logick_transaktion].evoking_aktion = event_name;
}


compile_save_data_to_html.save_animations.cleanup = function()
{
    /*restoring previous state*/
    for(var anim in animations)
    {
        if(animations[anim].event_on_finisched)
        {
            precompile_restore_link_logick_to_animation(anim,"animation_finished","event_on_finisched");
        }
        if(animations[anim].event_on_reversed)
        {
            precompile_restore_link_logick_to_animation(anim,"animation_reversed","event_on_reversed");   
        }
    }   
    custom_presave_logick.save_animations.cleanup();
}

/*removes data addet to the animations for transfer to the logick view*/
function precompile_restore_link_logick_to_animation(animation_id,evoking_name,proparty_name)
{
    /*resetting the evoking aktion*/
    for(var id of animations[animation_id][proparty_name])
    {
        logick_transaktions[id].evoking_aktion = evoking_name+ "-" + animation_id;
    }
    delete animations[animation_id][proparty_name];
}

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
    animation_types.add(menubar_Item("Siple Animation",create_sipmle_animation));
    animation_types.add(menubar_Item("Stepped swiping Animation",create_swipe_animation));
    animation_types.add(menubar_Item("Fly in Animation",select_flyin_orientation));

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

    notifikationbar.show("Klick on the Element you want to Animate"); animation
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

/*before an element gets deletet, all of its animations need to be deletet to*/
execute_before_element_deletion.delete_all_animtions_of_the_element = function(element)
{
    for(var anim_id = 0; anim_id<animations.length; anim_id++)
    {
        if(animations[anim_id].target == element)
        {
            delete_animation(anim_id);
            anim_id--;
            continue;
        }
    }
}

/*deletes an anmation with its given animation id.
deletes all logick transaktions containing this animation 
afterwards*/
function delete_animation(anim_id)
{
    /*allows plugins to perform aktions before an animation gets deletet*/
    for (var key in execute_before_animation_deletion) 
    {
      if (execute_before_animation_deletion.hasOwnProperty(key)) 
      {
        execute_before_animation_deletion[key](anim_id);
      }
    }

    /*remves the corresponding animation icon from the screen*/
    var screen_animation_menu = find_parent_screen(animations[anim_id].target).animation_menu.children;
    for (var anim_menu of screen_animation_menu)
    {
        if(anim_menu.target.id == anim_id)
        {
            //screen_animation_menu.splice(screen_animation_menu.indexOf(anim_menu),1);
            anim_menu.remove();
            break;
        }
    }
    /*Removes the corresponding entry in the menu of the animation target*/
    for(child of animations[anim_id].target.animation_selection_menu.children)
    {
        if(child.animationtselect == animations[anim_id]) child.remove();
    }
    /*loops trough array*/
    for(var trans_id = 0; trans_id < logick_transaktions.length; trans_id++)
    {
        if(logick_transaktions[trans_id].animation == anim_id)
        {
            remove_element_actionbar(logick_transaktions[trans_id]);
            /*If element got deletet, index needs to be reduced and loop continues*/
            trans_id--;
            continue;
        }else if(logick_transaktions[trans_id].evoking_aktion.split("_")[0] == "animation" && logick_transaktions[trans_id].evoking_aktion.split("-")[1] == anim_id)
        {
            remove_element_actionbar(logick_transaktions[trans_id]);
            trans_id--;
            continue;
        }
    }
    /*removing the animation from the array*/
    animations.splice(anim_id, 1);
    /*fixing the ids of all following animatons*/
    for(anim_id; anim_id<animations.length; anim_id++)
    {
        /*allows plugins to perform aktions before an animation changes its id*/
        for (var key in execut_before_animation_changes_id) 
        {
          if (execut_before_animation_changes_id.hasOwnProperty(key)) 
          {
            execut_before_animation_changes_id[key](animations[anim_id].id,anim_id);
          }
        }
        
    /*Fixes id of logick transaktions*/
        for(var trans_id = 0; trans_id < logick_transaktions.length; trans_id++)
        {
            if(logick_transaktions[trans_id].animation == animations[anim_id].id)
            {
                logick_transaktions[trans_id].animation = anim_id;
            }else if(logick_transaktions[trans_id].evoking_aktion.split("_")[0] == "animation" && logick_transaktions[trans_id].evoking_aktion.split("-")[1] == animations[anim_id].id)
            {
                logick_transaktions[trans_id].evoking_aktion = logick_transaktions[trans_id].evoking_aktion.split("-")[0] + "-" + anim_id;
            }
        }
        /*finaly, fixing the id of the animation itself*/
        animations[anim_id].id = anim_id;
    }
}

/*Function to create the animaton menu bar next to the screen*/
function create_animation_menu(parent)
{
    menu = document.createElement("div");
    //menu.entrys = [];

    menu.classList.add("animation_menu");
    menu.style.display = "";
    menu.parent = parent;
    
    document.body.appendChild(menu);
    var parent_position = getPos(parent);
    menu.style.top = parent_position.y + "px";
    menu.style.left = (parent_position.x + parent.offsetWidth)*1 +  "px";
    
    menu.add = function(target)
    {
        this.appendChild(target);
        //this.entrys.push(target);
    }
    menu.hide = function(){};
    
    return menu;
}

/*creates a new entry for the animaton menu*/
function animation_menu_entry(animation)
{
    var animation_menu = document.createElement("div");
    animation_menu.target = animation;
    animation_menu.classList.add("animation_menu_entry");
    animation_menu.animation_icon = animation_settings_Icon("animation.svg",null,"");
    animation_menu.appendChild(animation_menu.animation_icon);
    animation_menu.menuEntrys = [];
    var icon_delete = animation_settings_Icon("delete.svg",function(){delete_animation(this.parent.target.id);remove_animation_prewiev();},"Deletes the Animation");
    var icon_remane = animation_settings_Icon("textedit.svg",function(){text_input_overlay(this.parent,function(value){rename_animation(this.target.target,value);})},"Renames the Animation");
    icon_remane.parent = animation_menu;
    icon_delete.parent = animation_menu;
    animation_menu.menuEntrys.push(icon_delete);
    animation_menu.menuEntrys.push(icon_remane);
    
    /*allows plugins to add custom icons to the animaton settings bar*/
    for (var key in add_custom_icon_to_animation_settings) 
    {
      if (add_custom_icon_to_animation_settings.hasOwnProperty(key)) 
      {
        var new_icon = add_custom_icon_to_animation_settings[key](animation);
        animation_menu.parent = animation_menu;
        animation_menu.menuEntrys.push(new_icon);
      }
    }
    
    animation_menu.onmouseover = function()
    {
        show_animation_prewiew(this.target);
        for(var entry of this.menuEntrys)
        {
            this.appendChild(entry);
        }
    }
    animation_menu.onmouseleave = function()
    {
        remove_animation_prewiev();
        this.innerHTML = "";
        this.appendChild(this.animation_icon);
    }
    return animation_menu;
}

/*function to create an icon in the custom settings bar of an element*/
function animation_settings_Icon(icon,onclick,explanation)
{
    elem = document.createElement("div");
    elem.img = document.createElement("img");
    elem.title = explanation || "";
    elem.appendChild(elem.img);
    elem.img.src = icon;
    elem.img.height = 25;
    elem.img.width = 25;
    
    elem.onclick = onclick;

    return elem;
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

/*used to create an animation that ist executet on swiping.
can be used to drag large elements between keypoints
(like a tab view)*/
function create_swipe_animation()
{
    general_pre_animation_stuff();
    notifikationbar.show("Drag the Element to its Target Position");
    animation_types.style.display = "none";
    /*Creates the menu needet to confirm the current animation*/
    animation_confirm_abort = elementbar();
    animation_confirm_abort.add(menubar_Item("Confirm",()=>{apply_liear_two_point_animation();refacktor_to_swipe_animation()}));
    animation_confirm_abort.add(menubar_Item("Abort",()=>{animation_types.style.display = "";reset_position_after_creating_animation();}));
    animation_confirm_abort.add(menubar_Item("Add another Swipe Position",add_another_keyframe));
    animation_confirm_abort.style.display = "";
    /*creating a keyframe aray*/
    animation_types.keyframes = [];
}

/*Funktion to refactor the last animtion into a swipe animation,
swipe animations are basikly draggin an element between keypoints and autosnapping to the keypoints
by the element*/
function refacktor_to_swipe_animation()
{
    /*optains the animtion needet to refactor*/
    var torefactor = animations[animations.length-1];
    /*some simple sort algorithem. overhead vor more performant 
    versions would be to high, considering the expectet maximum array size 
    is 5-6 and the expectet size is 2-3*/
    var hasswapped = true;
    while(hasswapped)
    {
        /*havent swapped anything this runn*/
        hasswapped = false;
        for(var i in torefactor.keyframes)
        {
            /*Swapping elements, if current dx larger than next*/
            if(i < (torefactor.keyframes.length -1) && torefactor.keyframes[i].dx > torefactor.keyframes[i*1+1].dx)
            {
                var swap = torefactor.keyframes[i];
                torefactor.keyframes[i] = torefactor.keyframes[i*1+1];
                torefactor.keyframes[i*1+1] = swap;
                hasswapped = true;
            }        
        }
    } 
    /*Applys the logick needet, to create the swiping effekt*/
    torefactor.swiping_animation = true;
}

/*Simple way to create an animation. the user only needs to dra the element around*/
function create_sipmle_animation()
{
    general_pre_animation_stuff();
    notifikationbar.show("Drag the Element around to form the animation path");
    animation_types.style.display = "none";
    /*creating an empty keyframe aray*/
    animation_types.keyframes = [];
    /*Adding a funktion to the ondrag plugin handler to obtain keyframes.*/
    execute_after_element_dragging.simple_animation_keyframe_generator = obtain_keyframes_from_element_movement;
    /*Creates the menu needet to confirm the current animation*/
    animation_confirm_abort = elementbar();
    animation_confirm_abort.add(menubar_Item("Confirm",apply_simple_animation));
    animation_confirm_abort.add(menubar_Item("Abort",()=>{animation_types.style.display = "";reset_position_after_creating_animation();delete execute_after_element_dragging.simple_animation_keyframe_generator;}));
    animation_confirm_abort.style.display = "";
}

/*obtains keyframes from element movement*/
function obtain_keyframes_from_element_movement()
{
    /*saving relative values for position and absolute values for time. time will be fixed later on*/
    var newkeyframe = new keyframe(window.performance.now(),animation_types.target.offsetLeft - animation_types.oldx,animation_types.target.offsetTop - animation_types.oldy)
    animation_types.keyframes.push(newkeyframe);
}

/*adds the animaton to the element and does some post-processing*/
function apply_simple_animation()
{
    delete execute_after_element_dragging.simple_animation_keyframe_generator;
    
    if(animation_types.keyframes.length > 1)
    {
        /*use time for firt keyframe as zero time. not 100% akurate, but simple and the user wont notice.
        this way time mesurement starts only, when the user drags the element*/
        var lasttime = animation_types.keyframes[0].dtime;
        /*Removes the first element, because time for keyframe can not be obtained*/
        animation_types.keyframes.shift();
        /*setting the times for the keyframes relative to its previous frametime*/
        for(var kframe of animation_types.keyframes)
        {
            var temp = kframe.dtime;
            kframe.dtime = (kframe.dtime - lasttime)/1000;
            lasttime = temp;
        }

        /*Simple compression code, used to remove doubles
        needet, becouse (for some reason) some touchpads 
        fire movement events, eaven when the mouse pointer hasent moved.
        yields (depending on the movementspeed)
        0-50% of compression*/
        var newframes = [];
        var curframe = animation_types.keyframes[0];
        for(var kframe of animation_types.keyframes)
        {
            if(kframe.dx == curframe.dx && kframe.dy == curframe.dy)
            {
                curframe = new keyframe(curframe.dtime+kframe.dtime,kframe.dx,kframe.dy)
            }else 
            {
                newframes.push(curframe);
                curframe = kframe;
            }
            
        }

        animation_types.keyframes = newframes;
        
/*Compression code faulty and currently disabeld. needs to be reworked in the future*
/********************************************************************************************/
        /*removing all keyframes that share the same vector direction
        /*        var newframes = [];
        var curframe = animation_types.keyframes[0];
        for(var kframe of animation_types.keyframes)
        {
            if((curframe.dx / curframe.dy) - (kframe.dx / kframe.dy) < 0.03)
            {
                curframe = new keyframe(curframe.dtime+kframe.dtime,kframe.dx,kframe.dy)
            }else 
            {
                newframes.push(curframe);
                curframe = kframe;
            }
            
        }
        newframes.push(curframe);
        animation_types.keyframes = newframes;
*/
/**********************************************************************************************/
        /*creating the new animaton*/
        var simpleanimation = new animation("linear",animation_types.target,animation_types.keyframes);
        /*Pushes the animation into the animation Array*/
        /*setting the array position as animation id. will be needet later on*/
        simpleanimation.id = (animations.push(simpleanimation)-1);
    
        /*adds a logick button to the element, if it dosen't has one already*/
        add_animaton_specifik_logick_buttons(simpleanimation);
    }

    /*Repositions the objekt at its origin*/
    reset_position_after_creating_animation();

    /*Resetting the keyframe array*/
    animation_types.keyframes = [];
    
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
    animation_confirm_abort.add(menubar_Item("Add another Keyframe",add_another_keyframe));
    animation_confirm_abort.style.display = "";
    /*creating a keyframe aray*/
    animation_types.keyframes = [];
}

/*Provides the user with a menu, so he can choose from whitch sied the animated objekt shall fly in*/
function select_flyin_orientation()
{
    animation_confirm_abort = elementbar();
    animation_confirm_abort.add(menubar_Item("Abort",()=>{animation_types.style.display = "";}));
    animation_confirm_abort.add(menubar_Item("From the Right",()=>{create_flyin_animation("right");}));
    animation_confirm_abort.add(menubar_Item("From the Left",()=>{create_flyin_animation("left");}));
    animation_confirm_abort.add(menubar_Item("From the Top",()=>{create_flyin_animation("top");}));
    animation_confirm_abort.add(menubar_Item("From the Bottom",()=>{create_flyin_animation("bottom");}));
    animation_confirm_abort.style.display = "";
}
/*auto - creates a linear 2 point animation for an element, so that ist flies into the screen*/
function create_flyin_animation(orientation)
{
    /*Lies about the old origin of the animation target, so it will be placed outside of the screen container afterwards*/
    switch(orientation) 
    {
        case "left":
            animation_types.oldx = -animation_types.target.offsetWidth - 20; 
            animation_types.oldy = animation_types.target.offsetTop;
            break;
        case "right":
            animation_types.oldx = animation_types.target.offsetParent.offsetWidth + 20; 
            animation_types.oldy = animation_types.target.offsetTop;  
            break;
        case "top":
            animation_types.oldx = animation_types.target.offsetLeft; 
            animation_types.oldy = -animation_types.target.offsetHeight -20;  
            break;
        case "bottom":
            animation_types.oldx = animation_types.target.offsetLeft; 
            animation_types.oldy = animation_types.target.offsetParent.offsetHeight +20;  
            break;
            
    }
    /*creating a keyframe aray*/
    animation_types.keyframes = [];
    apply_liear_two_point_animation();
}

/*used to create more than one keyframe in an animation*/
function add_another_keyframe()
{
	
	var endpoint = new keyframe(1,animation_types.target.offsetLeft - animation_types.oldx,animation_types.target.offsetTop - animation_types.oldy);
	notifikationbar.show("Enter the Time for this Keyframe in Sekonds"); 
    number_input_overlay(animation_types.target,function(value){this.additionaldata.dtime = value;notifikationbar.hide();},endpoint);
    /*adds the new keyframe to the keyframe array*/
    animation_types.keyframes.push(endpoint);
}

/*saves the animation*/
function apply_liear_two_point_animation()
{
    /*creates a new keyframe using the endpoint of the animation*/
    var endpoint = new keyframe(1,animation_types.target.offsetLeft - animation_types.oldx,animation_types.target.offsetTop - animation_types.oldy);
    /*Adds the keyframe to the array*/
    animation_types.keyframes.push(endpoint);

    /*creates a new animation using the keyfame array*/
    var linearanimation = new animation("linear",animation_types.target,animation_types.keyframes);

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
    /*Resetting the keyframe array*/
    animation_types.keyframes = [];
}

/*Creates the buttons needet for the logick menu, to start the animation*/
function add_animaton_specifik_logick_buttons(animation)
{
    if(!animation.target.hasAnimationMenu)
    { 
        /*Creates the entys for the logick menu*/
        animation.target.logick_menu.add(logick_menu_item("Play Animation",function(){select_specifik_animation(this.offsetParent.parent,logick_animation_start);}));
        animation.target.logick_menu.add(logick_menu_item("Reverse Animation",function(){select_specifik_animation(this.offsetParent.parent,logick_animation_reverse);}));
        animation.target.logick_menu.add(logick_menu_item("Play one frame",function(){select_specifik_animation(this.offsetParent.parent,logick_animation_play_one_step);}));
        animation.target.logick_menu.add(logick_menu_item("reverse one frame",function(){select_specifik_animation(this.offsetParent.parent,logick_animation_reverse_one_step);}));
        animation.target.logick_menu.add(logick_menu_item("Pause Animation",function(){select_specifik_animation(this.offsetParent.parent,logick_animation_pause_animation);}));
        animation.target.logick_menu.add(logick_menu_item("Reset Animation",function(){select_specifik_animation(this.offsetParent.parent,logick_animation_reset_animation);}));

        /*Creates the entrys for the animation menu, used to select one of the elements animations specifikally*/
        animation.target.animation_selection_menu = elementbar();
        animation.target.animation_selection_menu.parent = animation.target;
        
        /*Creates the buttons for the animaton finished event*/
        add_event_menu_to_element(animation.target,menubar_Item("Animation played",set_animation_finished_playing_event),"animation finisched");
        add_event_menu_to_element(animation.target,menubar_Item("Animation reversed",set_animation_finished_reversing_event),"animation reversed");       

        /*Sets the has animation menu property to true, so onl one menu is created per element*/
        animation.target.hasAnimationMenu = true;
    }
    /*obtian the screen, on whitch the animation was created*/
    var screen = find_parent_screen(animation.target);
    
    /*if there is no animaton menu on this screen, add one*/
    if(!screen.animation_menu)
    {
        screen.animation_menu = create_animation_menu(screen);
    }
    /*now, add a new enty tho the animation menu, containing the current animation*/
    screen.animation_menu.add(animation_menu_entry(animation));
    
    /*finally, we are adding the new animation to the animation menu*/
    var itemtoadd = elementbar_Item(animation.name,animation_selection_menu_button_click);
    /*giving the new item its target animation*/
    itemtoadd.animationtselect = animation;
    animation.target.animation_selection_menu.add(itemtoadd);
    
    /*applays the preview function on mouse over, so the user knows whitch animation is
    whitch eaven without naming them*/
    itemtoadd.onmouseover = function()
    {
        show_animation_prewiew(this.animationtselect);
    }
    itemtoadd.onmouseleave = remove_animation_prewiev;
    
}

/*Function used to rename animatons
changest the name of the animation and then the name of the 
menu entry accordingly*/
function rename_animation(animation,name)
{
    /*fixes the name in the animation menu entry*/
    for(child of animation.target.animation_selection_menu.children)
    {
        if(child.animationtselect == animation) child.innerHTML = "<a>" + name + "</a>";
    }
    /*Setting new name of the animation*/
    animation.name = name;
}

/*draws a preview of an animation onto the screen*/
function show_animation_prewiew(animation)
{
    remove_animation_prewiev();
    aniamtion_preview_container = document.createElement("div");
    var proto = animation.target.cloneNode(true);
    proto.style.opacity = "0.3";
    proto.style.top = 0;
    proto.style.left = 0;
    var delta = 1;
    /*if keyframe array is to large, only a fraction of the frames is rendert, to ensure performance doesen drop 
    redically*/
    if(animation.keyframes.length>30) delta = 2;
    if(animation.keyframes.length>60) delta = 4;
    if(animation.keyframes.length>100) delta = 10;
    if(animation.keyframes.length>200) delta = 20;
    if(animation.keyframes.length>500) delta = 30
    if(animation.keyframes.length>700) delta = 50;
    if(animation.keyframes.length>1500) delta = 100;
    for(var i = 0; i < animation.keyframes.length; i=i+delta)
    {
        k = animation.keyframes[i];
        var new_proto = proto.cloneNode(true);
        new_proto.style.transform = "translate("+k.dx+"px, "+k.dy+"px)";
        aniamtion_preview_container.appendChild(new_proto);
    }   
    animation.target.appendChild(aniamtion_preview_container);
}
/*removes previews of animations*/
function remove_animation_prewiev()
{
    if(aniamtion_preview_container != null) 
    {
        aniamtion_preview_container.remove();
        aniamtion_preview_container = null;
    }
}

/*this function is used to obtain the parent screen, of an emlement recursively*/
function find_parent_screen(element)
{
    if(element.dataset["elementtype"] == "screen") return element;
    else return find_parent_screen(element.offsetParent);
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
    /*disables the positioning restriction of DOM elements*/
    var oldmoveout = can_move_out_of_bounderys;
    can_move_out_of_bounderys = true;
    
    /*Restores the previous position of an element, after the animation got created*/
    animation_types.target.setpos(animation_types.oldx,animation_types.oldy);

    /*Removes the menu, for its not needet anymore*/
    animation_confirm_abort.remove();
    delete animation_confirm_abort;

    /*removes the orange message bar*/
    notifikationbar.hide();
    
    /*restores the previous setting of moving restriction*/
    can_move_out_of_bounderys = oldmoveout;
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

/*sets the event for animation finished playing*/
function set_animation_finished_playing_event(e)
{
    evoker = this.parentElement.eventtarget;
    select_specifik_animation(evoker,function(x){evoking_aktion = "animation_finished-" + x.id;general_event_stuff();this.style.display = "none"});

}
logick_dictionary["animation_finished"] = "finisching an animaton";

function set_animation_finished_reversing_event(e)
{
    evoker = this.parentElement.eventtarget;
    select_specifik_animation(evoker,function(x){evoking_aktion = "animation_reversed-" + x.id;general_event_stuff();this.style.display = "none"});
}
logick_dictionary["animation_reversed"] = "finisched reversing an animaton";

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
logick_dictionary["reverse_animation"] = "Reverses an animation for";

/*registers the logick effekt to jump one animation step*/
function logick_animation_play_one_step(animation)
{
    var transaktion = new logick_transaktion(evoker,evoking_aktion,animation.target,"play_one_step");
    transaktion.animation = animation.id;
    logick_transaktions.push(transaktion);
    reset_transaktion_elementindependent();
}
logick_dictionary["play_one_step"] = "plays an animation step of ";

/*registers the logick effekt to jump one animation step*/
function logick_animation_reverse_one_step(animation)
{
    var transaktion = new logick_transaktion(evoker,evoking_aktion,animation.target,"reverse_one_step");
    transaktion.animation = animation.id;
    logick_transaktions.push(transaktion);
    reset_transaktion_elementindependent();
}
logick_dictionary["reverse_one_step"] = "reverses an animation step of ";

/*registers the logick effekt to pause the animation*/
function logick_animation_pause_animation(animation)
{
    var transaktion = new logick_transaktion(evoker,evoking_aktion,animation.target,"pause_animation");
    transaktion.animation = animation.id;
    logick_transaktions.push(transaktion);
    reset_transaktion_elementindependent();
}
logick_dictionary["pause_animation"] = "pauses an animation of ";

/*registers the logick effekt to pause the animation*/
function logick_animation_reset_animation(animation)
{
    var transaktion = new logick_transaktion(evoker,evoking_aktion,animation.target,"reset_animation");
    transaktion.animation = animation.id;
    logick_transaktions.push(transaktion);
    reset_transaktion_elementindependent();
}
logick_dictionary["reset_animation"] = "resets an animation of ";

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

