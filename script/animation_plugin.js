/*This plugin enabels the use of animations, if addet, inside the index.html*/

/*This event gets fired, after the initialisation in the onload.js has finisched*/
document.addEventListener("initialize",initializeAnimationPlugin)

/*Adds the needet funktionality for this plugin to the applycation*/
function initializeAnimationPlugin()
{
    /*adds the Button to switch to the animationview into the menu bar at position 2*/
    default_Menu.add(menubar_Item("Animations", changetoAnimationView),2);
}

function changetoAnimationView()
{
    
}
