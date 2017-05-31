/*************************************************************************/
/* This file allows to add custom entrys for the logick-event menu, that */ 
/* are element dependent. (adding custom events for custom elements)     */
/*************************************************************************/

document.addEventListener("Element Selected",on_event_select_add_entry_to_logick_menu);
document.addEventListener("Screen Selected",on_event_select_add_entry_to_logick_menu);
document.addEventListener("in logick View",enable_custom_events_after_change_to_logick_menu);

function add_event_menu_to_element(element,menu,menu_name)
{
    /*Creates a logick menu cotainer for the elements, if needet*/
    if(!element.custom_logick_menu) element.custom_logick_menu = {};

    element.custom_logick_menu[menu_name] = menu;
} 

/*initializes the menu, when the screen istselected*/
function enable_custom_events_after_change_to_logick_menu(e)
{
    /*sets the new custom elements*/
    logick_elements.custom_logick_elements = logick_elements.eventtarget.custom_logick_elements;

    /*if the element had custom logick menu entrys, they must be added now*/
    if(logick_elements.custom_logick_elements)
    {
        for (var key in logick_elements.custom_logick_elements) 
        {
          if (logick_elements.custom_logick_elements.hasOwnProperty(key)) 
          {
            logick_elements.add(logick_elements.custom_logick_elements[key]);
          }
        }
    }
}

/*Listens for the element selected event and adds the cutom menues of the element to the logick-menu*/
function on_event_select_add_entry_to_logick_menu(e)
{
    /*removes all logick custom logick elements, addet by the previous element*/
    if(logick_elements.custom_logick_elements)
    {
        for (var key in logick_elements.custom_logick_elements) 
        {
          if (logick_elements.custom_logick_elements.hasOwnProperty(key)) 
          {
            logick_elements.custom_logick_elements[key].remove();
          }
        }
    }
    /*sets the new custom elements*/
    logick_elements.custom_logick_elements = e.param1.custom_logick_menu;

    /*if the element had custom logick menu entrys, they must be added now*/
    if(logick_elements.custom_logick_elements)
    {
        for (var key in logick_elements.custom_logick_elements) 
        {
          if (logick_elements.custom_logick_elements.hasOwnProperty(key)) 
          {
            logick_elements.add(logick_elements.custom_logick_elements[key]);
          }
        }
    }
    
}
