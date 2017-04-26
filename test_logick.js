/*This objekt stores the target and the effekt of all interktions (e.g. a buttonclick). 
the targets get registert in the testrenderer.js file.*/
var test_logik_transaktions = {};
/*this objekt stores all possible effekts to an element together with its identfier*/
var test_logick_effekts = {};
/*this objekt stores all events, that can hatten to an objekt, together with its identifier*/
var test_logick_events = {};

/*Executes all aktions, whitch ar linked to the event identifier (e.g. click)*/
function test_do_execute(event,target,passedvalue)
{
    for(m of target.tans_out)
    {
        if(m.name == event)
        {
            test_logik_transaktions[m.id].effekt(test_logik_transaktions[m.id].target,passedvalue);
        }       
    }
}


function swipechecker(e)
{
    if(swipex > 60) test_do_execute("swiperight", swipetarget);
    else if(swipex < -60) test_do_execute("swipeleft", swipetarget);
    document.removeEventListener('mousemove', swipeaccumulator);
    document.removeEventListener('mouseup',swipechecker);
    swipetarget.removeEventListener('mouseup',swipechecker);
    swipetarget = null;
}


var swipex;
var beginswipex;
var swipetarget;
function swipeaccumulator(e)
{
  swipex = e.clientX - beginswipex;
}

function swipeinit(target)
{
    target.onmousedown = function(e)
    {
        swipetarget = this;
        beginswipex = e.pageX;
        document.addEventListener('mousemove', swipeaccumulator);
        document.addEventListener('mouseup',swipechecker);
        this.addEventListener('mouseup',swipechecker);
    }
}

test_logick_events["swiperight"] = swipeinit;
test_logick_events["swipeleft"] = swipeinit;

test_logick_events["textlink"] = function(target,execute)
{
    target.onkeyup = function(){execute("textlink",this,this.value);};
}

test_logick_events["click"] = function(target,execute)
{
    target.onclick = function(){execute("click",this);};
}

test_logick_effekts["hide"] = function(target)
{
    target.style.display = "none";
}

test_logick_effekts["unhide"] = function(target)
{
    target.style.display = "";
}

test_logick_effekts["togglevisibility"] = function(target)
{
    if(target.style.display == "none") target.style.display = ""; else target.style.display = "none";
}

test_logick_effekts["changescreen"] = function(target)
{
    for(m of $("testscreencontainer").getElementsByClassName("screenportait")) m.style.display = "none";
    target.style.display = "";
}

test_logick_effekts["textlink"] = function(target,message)
{
    target.innerHTML = message;
}

