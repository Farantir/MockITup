/***********************************************************/
/*This Plugin contains a function to create a number input.*/
/*Its used by the Animation Plugin and may be replaced, to */
/*Change the apperence of the Number Input.                */
/***********************************************************/

/*Function to create a menu used to input numbers*/
function number_input_overlay(target,set,someobjekt,step)
{
    var menu = document.createElement("div");
    menu.classList.add("textinput");
    
    menu.onmousedown = (x)=>{x.stopPropagation();};    

    menu.accept = document.createElement("button");
    menu.accept.appendChild(document.createTextNode("Accept"));

    menu.accept.input = document.createElement("input");
    menu.accept.input.type = "number";
    menu.accept.input.step = step || "0.01";
    menu.accept.set = set;
    menu.accept.target = target;

    menu.appendChild(menu.accept.input);
    menu.appendChild(menu.accept);

    document.body.appendChild(menu);
    
    menu.style.top = (getPos(menu.accept.target).y + menu.accept.target.offsetHeight + 5) + "px";
    menu.style.left = getPos(menu.accept.target).x + "px";
    
    
    menu.dragging_function = (e)=>{
        menu.style.top = (menu.offsetTop + e.param2)*1 + "px";
        menu.style.left = (menu.offsetLeft + e.param1)*1 + "px";
    }
    
    /*if drag screens plugin is enabled, emulate screen-dragging, when number input gets draged*/
    if(initialize_screen_dragging)
    {
       menu.addEventListener("mousedown",(e)=>{initialize_screen_dragging({"param2":e});}); 
    }
    /*Also, drag number Input along with the screen-container.*/
    document.addEventListener("Screencontainer Moved",menu.dragging_function);
    
    menu.accept.onclick = function(){this.set(this.input.value);this.parentElement.remove();document.removeEventListener("Screencontainer Moved",menu.dragging_function)}

    menu.accept.additionaldata = someobjekt
    
}

