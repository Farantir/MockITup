/*************************************************************/
/*This file handels most of the compilation of the animations*/
/*it also houses all of the actual animation logick, e.g. the*/
/*actual animation engine                                    */
/*************************************************************/

/*some array needet to fix relation problems later on*/
var unresolved_relations = [];
/*needet to combine the animations with the events (animation finished, animation reversed, etc)*/
var link_animations_to_events = [];
/*swiping animation that gets selectet, if one elment gets dragged*/
var swiping_animation_to_drag;

/*initioalizes the animaton engine*/
compile_read_data_from_html.initialize_animations = function()
{
    compiled_animations = [];
    unresolved_relations = [];
}

/*Loads the animations inside the compiled_animation array*/
compile_data_for_each_tag.get_Animations = function(attribute_name,attrigute_value,current_element)
{
    /*Loads the animation*/
    if(attribute_name[1] == "animation")
    {
        compiled_animations[attribute_name[2]] = JSON.parse(attrigute_value);
        compiled_animations[attribute_name[2]].target = current_element;
    }else if(attribute_name[1] == "animation_logik")
    {
            /*the animation id and the transaktion id need to get stored, so the alorithem can try to fix it later on*/
            unresolved_relations.push({"animation": attrigute_value, "transaktion": attribute_name[2]})       
    }
    
}
/*Fixing those relation problems mentiond earlier, also saves values for resizing on mobile devices*/
compile_execute_stuff_after_compiling.resolve_animation_and_logick_relations = function()
{
    for(var rel of unresolved_relations)
    {
        test_logik_transaktions[rel.transaktion].animation_id = rel.animation;
    }
    /*Also saving the old data of all keyframes. needet to resize them later.*/
    for(var animation of compiled_animations)
    {
        /*resizing each keyframe of each animation*/
        for(var keyframe of animation.keyframes)
        {
            keyframe.oldx = keyframe.dx;
            keyframe.oldy = keyframe.dy;
        }
    }
    /*Creates a animation engine for each animation*/
    for(var animation of compiled_animations)
    {
        animation.engine = new animation_engine(animation);
        /*now we need to add the events to the animations*/
        animation.tans_out = [];
        if(animation.event_on_finisched)
        {
            for(var event_id of animation.event_on_finisched)
            {
                for(var trans_id in animation.target.tans_out)
                {
                    if(animation.target.tans_out[trans_id].id == event_id)
                    {
                        /*giving the aimations the trans out events of its parent element*/
                        animation.tans_out.push(animation.target.tans_out[trans_id]);
                        animation.target.tans_out.splice(trans_id, 1);
                    }
                }
            }
        }
        if(animation.event_on_reversed)
        {
            for(var event_id of animation.event_on_reversed)
            {
                for(var trans_id in animation.target.tans_out)
                {
                    if(animation.target.tans_out[trans_id].id == event_id)
                    {
                        /*giving the aimations the trans out events of its parent element*/
                        animation.tans_out.push(animation.target.tans_out[trans_id]);
                        animation.target.tans_out.splice(trans_id, 1);
                    }
                }
            }
        }
        if(animation.swiping_animation)
        {
            animation.target.addEventListener("mousedown",initialize_dragging_on_swipe_animation);
            /*on element can only have one swiping animation*/
            animation.target.swipe_animtion = animation
        }
    }
}

function initialize_dragging_on_swipe_animation(e)
{
    document.addEventListener("mouseup",abort_dragging_on_swipe_animation);
    document.addEventListener("mousemove",swiping_animation_gets_dragged);
    swiping_animation_to_drag = e.target.swipe_animtion;
    /*this value is the offset needet to set the translate values later on.
    translate is relative to the objekts origin, so this calculation is different
    from other offset calculations.*/
    /*                 origin of the       current Mouse                     current translation of the objekt*/
    /*                 Element               Position                        or 0, if objekt hasent been moved jet*/
    e.target.offsetx = getPos(e.target).x + (e.pageX - getPos(e.target).x - (e.target.current_x_value || 0)); 
    //e.target.offsety = e.pageY; //- e.target.offsetTop;
        
    /*swiping should always move only the top most element*/
    e.stopPropagation();
}

function abort_dragging_on_swipe_animation(e)
{
    document.removeEventListener("mouseup",abort_dragging_on_swipe_animation);
    document.removeEventListener("mousemove",swiping_animation_gets_dragged);
    swiping_animation_to_drag = null;
    /*mouseup should only affekt the moved element*/
    e.stopPropagation();
}

//todo
function swiping_animation_gets_dragged(e)
{
  var x = e.clientX;
  //var y = e.clientY + document.documentElement.scrollTop;

  //var posy = (y - swiping_animation_to_drag.target.offsety);
  var posx = (x - swiping_animation_to_drag.target.offsetx);

/*segment not working, should determen the y value of the animation*/
/*************************************************************************************************/
/*  var keyframes = swiping_animation_to_drag.keyframes;
  var posy = null;
  for(var i in keyframes)
  {console.log(keyframes[i].dx + " " + posx + " " + i)
    if(keyframes[i].dx>posx)
    {
        if(i == 0)
        {      
            posx = keyframes[0].dx;
            swiping_animation_to_drag.target.current_x_value = posx;
            posy = keyframes[0].dy;     
        }else
        {*/
            /*Calculation the slope between the two frames*/
     /*       posy = ((keyframes[i].dy - keyframes[i-1].dy)/(keyframes[i].dx - keyframes[i-1].dx))*posx;
        }
    }
  }
  if(posy == null)
  {
    posx = keyframes[keyframes.length-1].dx;
    swiping_animation_to_drag.target.current_x_value = posx;
    posy = keyframes[keyframes.length-1].dy;
  }*/
/*******************************************************************************************************************/
  //swiping_animation_to_drag.target.style.top = posy + "px";
  //swiping_animation_to_drag.target.style.left = posx + "px";
 /* swiping_animation_to_drag.target.style.transform = "translate("+posx+"px, "+ "0px"); 
  swiping_animation_to_drag.target.current_x_value = posx;*/
}

/*only there because the event system needs it. 
we use another function to ensure targets get linked to 
the evoking animations*/
test_logick_events["animation_finished"] = function(target,execute)
{
}
test_logick_events["animation_reversed"] = function(target,execute)
{
}

/*Creates the logick needet to animate objekts*/
test_logick_effekts["start_animation"] = function(target,unused,id)
{
    /*reciving the id of the target animation*/
    var animation = test_logik_transaktions[id].animation_id;
    /*Starts the animation engine of the given animaton*/
    compiled_animations[animation].engine.start();
}

/*Creates the logick needet to pause the animation of objekts*/
test_logick_effekts["pause_animation"] = function(target,unused,id)
{
    /*reciving the id of the target animation*/
    var animation = test_logik_transaktions[id].animation_id;
    /*pauses the animation engine of the given animaton*/
    compiled_animations[animation].engine.halt_animation();
}

/*Creates the logick needet to reverse the animation of objekts*/
test_logick_effekts["reverse_animation"] = function(target,unused,id)
{
    /*reciving the id of the target animation*/
    var animation = test_logik_transaktions[id].animation_id;
    /*Starts the animation engine of the given animaton in reverse mode*/
    compiled_animations[animation].engine.startreverse();
}

/*Creates the logick needet to jump one animation step*/
test_logick_effekts["play_one_step"] = function(target,unused,id)
{
    /*reciving the id of the target animation*/
    var animation = test_logik_transaktions[id].animation_id;
    /*Starts the animation engine of the given animaton*/
    compiled_animations[animation].engine.play_step();
}

/*Creates the logick needet to jump one animation step*/
test_logick_effekts["reverse_one_step"] = function(target,unused,id)
{
    /*reciving the id of the target animation*/
    var animation = test_logik_transaktions[id].animation_id;
    /*Starts the animation engine of the given animaton*/
    compiled_animations[animation].engine.reverse_step();
}


function animation_engine(animation)
{
    this.animation = animation;
    this.current_frame = 0;
    /*time at witch the last frame was*/
    this.lastframetime = 0;
    /*playtime of the current frame*/
    this.time_in_current_frame = 0;
    //this.time_in_current_frame = 0;
    this.distance_in_current_frame = {"x":0, "y":0};
    /*gets the overflow, so repainting is only done, when movement is over 1px
       currently diaabbled, works without*/
    //this.overflow = {"x":0, "y":0};
    /*setting default play mode*/
    this.mode = "continuus";

    /*initializes the egine*/
    this.start = function()
    {
        /*setting direction to forward*/
        this.direction = "forward";
        /*unpausig the animation*/
        this.pause_animation = false;
        /*Doing some lambda magick to pass this reference*/
        window.requestAnimationFrame((deltatime)=>{runn_animation(this,deltatime);});
    }

    this.startreverse = function()
    {
        /*setting animation direction to reverse*/
        this.direction = "reverse";
        /*unpausig the animation*/
        this.pause_animation = false;
        /*Doing some lambda magick to pass this reference*/
        window.requestAnimationFrame((deltatime)=>{runn_animation(this,deltatime);});
        
    }
    
    /*pauses the current animation*/
    this.halt_animation = function()
    {
        this.pause_animation = true;
    }
    
    /*resets the animation*/
    this.stop = function()
    {
        this.distance_in_current_frame.x = 0;
        this.distance_in_current_frame.y = 0;
        this.lastframetime == 0;
    }

    this.finisched = function()
    {
        this.lastframetime = 0;
        if(this.direction == "reverse")
        {
            test_do_execute("animation_reversed",this.animation);
        }else
        {
            test_do_execute("animation_finished",this.animation);
        }
    }

    this.play_step = function()
    {
        /*setting direction to forward*/
        this.direction = "forward";
        /*Setting mode to one step only*/
        this.mode = "one step";
        this.firstframe = true; 
        this.endcurrent = false;
        /*unpausig the animation*/
        this.pause_animation = false;
        /*Doing some lambda magick to pass this reference*/
        window.requestAnimationFrame((deltatime)=>{runn_animation(this,deltatime);});
    }

    this.reverse_step = function()
    {
        /*setting animation direction to reverse*/
        this.direction = "reverse";
        /*Setting mode to one step only*/
        this.mode = "one step";
        this.firstframe = true; 
        this.endcurrent = false;
        /*unpausig the animation*/
        this.pause_animation = false;
        /*Doing some lambda magick to pass this reference*/
        window.requestAnimationFrame((deltatime)=>{runn_animation(this,deltatime);});
        
    }

    /*pauses the animation, whithout resetting it*/
    this.pause = function()
    {
       this.lastframetime = 0;
    }


    /*runns the animation, gets called each timestepp*/
    this.runn = function(curtime)
    {
        /*determening the delta time (the time between two frames)*/
        if(this.lastframetime == 0) this.lastframetime = curtime;
        deltatime = curtime - this.lastframetime;
        
        /*accumulates the time in the current frame*/
        this.time_in_current_frame += deltatime;

        var this_keyframe = this.animation.keyframes[this.current_frame];
        /*sets positions of previous keyframe to zero*/
        var prev_keyframe_x = 0;
		var prev_keyframe_y = 0;
		/*if there actually was a previous keyframe, set positions to its values*/
        if(this.current_frame != 0)
        {
			prev_keyframe_x = this.animation.keyframes[this.current_frame-1].dx;
			prev_keyframe_y = this.animation.keyframes[this.current_frame-1].dy;
		}

        /*calculates the distance to be traveld in this frame*/
        var deltax = ((this_keyframe.dx-prev_keyframe_x)/(this_keyframe.dtime*1000))*deltatime;
        var deltay = ((this_keyframe.dy-prev_keyframe_y)/(this_keyframe.dtime*1000))*deltatime;

        /*calcualtion needs to be different, ich in reverse mode*/
        if(this.direction == "reverse")
        {
            deltax = -deltax;
            deltay = -deltay;
        }
        
        /*applying the delta values*/
        this.distance_in_current_frame.x += deltax;
        this.distance_in_current_frame.y += deltay;

        /*Ensures the distance travelt is allways maxing out at the max distance of the keyframe, looks komplicatet, but its really just size comparison*/
        if(this.direction == "reverse")
        {
        /*currently assuming only on keyframe animations. more complex logick needs to follow*/
        	if(this.overstepp(this.distance_in_current_frame.x,deltax,prev_keyframe_x) || this.overstepp(this.distance_in_current_frame.y,deltay,prev_keyframe_y))
        	{
                this.distance_in_current_frame.x = prev_keyframe_x;
                this.distance_in_current_frame.y = prev_keyframe_y;
                this.current_frame--;
                this.time_in_current_frame = 0;
                if(this.mode == "one step" && !this.firstframe)
                {
                    this.endcurrent = true;            
                }
        	}
        /*normal direction*/
        /*if frame ist oversteppt by one value, max values are used*/
        }else if(this.overstepp(this.distance_in_current_frame.x,deltax,this_keyframe.dx) || this.overstepp(this.distance_in_current_frame.y,deltay,this_keyframe.dy))
        {
        	this.distance_in_current_frame.x = this_keyframe.dx;
            this.distance_in_current_frame.y = this_keyframe.dy;
            this.current_frame++;
            this.time_in_current_frame = 0;
            if(this.mode == "one step" && !this.firstframe)
            {
                this.endcurrent = true;            
            }
        }
        /*needet for single step mode.
        bug occurs, when delta already at the end or beginning
        of the frame, so next frame needs to be used*/
        if(this.lastframetime != curtime) this.firstframe = false;    

        /*So, finaly we come to the actual animation code. using 2d translations to move the element*/
        this.animation.target.style.transform = "translate("+this.distance_in_current_frame.x+"px, "+this.distance_in_current_frame.y+"px)";

        /*Setting old frame time to this frame*/
        this.lastframetime = curtime;

        /*stopping the animation if the end of the keyframes is reached*/
        if(this.pause_animation) {this.pause_animation=false;}
        else if(this.direction == "reverse" && this.current_frame < 0){this.finisched();this.current_frame = 0;}
        else if(this.current_frame >= this.animation.keyframes.length){this.finisched();this.current_frame = (this.animation.keyframes.length -1)}
        else if(this.endcurrent && this.mode == "one step"){this.lastframetime = 0;this.endcurrent = false;this.mode = "continuus";}
        else{window.requestAnimationFrame((deltatime)=>{runn_animation(this,deltatime);})}
    }
    
    this.overstepp = detekt_overstepping_of_animation_keyframe;
}

/*function to determen overstepping of keyframes using the current value, the keyframe value and the current step*/
function detekt_overstepping_of_animation_keyframe(value,delta,keyframe_max)
{
	/*Trivial, overstepping is impossible - at least i thougt so.
	turns out, overstepping can occour, if two frames share the exakt same point.*/
	if(delta==0)
	{
	    if(this.time_in_current_frame >= this.animation.keyframes[this.current_frame].dtime) return true;
	    else return false;
	/*steps decrease the value, so it needs to be smaler*/
	}else if(delta<0)
	{
		/*if its not smaller, overstepping has occured*/
		if(value <= keyframe_max) return true;
		else return false;
	/*steps increase the value, so it needs to be larger*/
	}else if(delta>0)
	{
		/*if its not greater, overstepping has occured*/
		if(value >= keyframe_max) return true;
		else return false;
	}else
	{
		//something is really, really wrong
        alert("its broken");
	}
}

/*Function that gets called by the callback. it sumply calls the runn function of the coresponding animation engine*/
function runn_animation(target_animation_engine,deltatime)
{
    target_animation_engine.runn(deltatime);
}

/*This code esures that the animations will be scaled acording to the mobile device screen*/
compile_execute_stuff_after_resize.scale_animations_on_resize_event = function()
{
    for(var animation of compiled_animations)
    {
        /*resizing each keyframe of each animation*/
        for(var keyframe of animation.keyframes)
        {
            keyframe.dx = calculate_ratio(keyframe.oldx,oldwidth,$("testscreencontainer").clientWidth);
            keyframe.dy = calculate_ratio(keyframe.oldy,oldheight,$("testscreencontainer").offsetHeight);
        }
    }
}