var test_logik_transaktions = {};
var test_logick_effekts = {};
var test_logick_events = {};

function test_do_execute(event,target)
{
    for(m of target.tans_out)
    {
        if(m.name == event)
        {
            test_logik_transaktions[m.id].effekt(test_logik_transaktions[m.id].target);
        }       
    }
}

test_logick_events["click"] = function(target,execute)
{
    target.onclick = function(){execute("click",this);};
}

test_logick_effekts["hide"] = function(target)
{
    target.style.display = "none";
}
