/*************************************************************/
/*This file handels most of the compilation of the animations*/
/*it also houses all of the actual animation logick, e.g. the*/
/*actual animation engine                                    */
/*************************************************************/

/*some array needet to fix relation problems later on*/
var unresolved_relations = [];
/*needet to combine the animations with the events (animation finished, animation reversed, etc)*/
var link_animations_to_events = [];

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
    }
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

/*Creates the logick needet to reverse the animation of objekts*/
test_logick_effekts["reverse_animation"] = function(target,unused,id)
{
    /*reciving the id of the target animation*/
    var animation = test_logik_transaktions[id].animation_id;
    /*Starts the animation engine of the given animaton in reverse mode*/
    compiled_animations[animation].engine.startreverse();
}

function animation_engine(animation)
{
    this.animation = animation;
    this.current_frame = 0;
    /*time at witch the last frame was*/
    this.lastframetime = 0;
    //this.time_in_current_frame = 0;
    this.distance_in_current_frame = {"x":0, "y":0};
    /*gets the overflow, so repainting is only done, when movement is over 1px
       currently diaabbled, works without*/
    //this.overflow = {"x":0, "y":0};

    /*initializes the egine*/
    this.start = function()
    {
        /*setting direction to forward*/
        this.direction = "forward";
        /*Doing some lambda magick to pass this reference*/
        window.requestAnimationFrame((deltatime)=>{runn_animation(this,deltatime);});
    }

    this.startreverse = function()
    {
        /*setting animation direction to reverse*/
        this.direction = "reverse";
        /*Doing some lambda magick to pass this reference*/
        window.requestAnimationFrame((deltatime)=>{runn_animation(this,deltatime);});
        
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
        deltatime = this.lastframetime - curtime;
        this.lastframetime = curtime;

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
        var deltax = -((this_keyframe.dx-prev_keyframe_x)/(this_keyframe.dtime*1000))*deltatime;
        var deltay = -((this_keyframe.dy-prev_keyframe_y)/(this_keyframe.dtime*1000))*deltatime;

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
        	if(detekt_overstepping_of_animation_keyframe(this.distance_in_current_frame.x,deltax,prev_keyframe_x) || detekt_overstepping_of_animation_keyframe(this.distance_in_current_frame.y,deltay,prev_keyframe_y))
        	{
                this.distance_in_current_frame.x = prev_keyframe_x;
                this.distance_in_current_frame.y = prev_keyframe_y;
                this.current_frame--;
        	}
        /*normal direction*/
        /*if frame ist oversteppt by one value, max values are used*/
        }else if(detekt_overstepping_of_animation_keyframe(this.distance_in_current_frame.x,deltax,this_keyframe.dx) || detekt_overstepping_of_animation_keyframe(this.distance_in_current_frame.y,deltay,this_keyframe.dy))
        {
        	this.distance_in_current_frame.x = this_keyframe.dx;
            this.distance_in_current_frame.y = this_keyframe.dy;
            this.current_frame++;
        }

        /*So, finaly we come to the actual animation code. using 2d translations to move the element*/
        this.animation.target.style.transform = "translate("+this.distance_in_current_frame.x+"px, "+this.distance_in_current_frame.y+"px)";


        /*stopping the animation if the end of the keyframes is reached*/
        if(this.direction == "reverse" && this.current_frame < 0){this.finisched();this.current_frame = 0;}
        else if(this.current_frame >= this.animation.keyframes.length){this.finisched();this.current_frame = (this.animation.keyframes.length -1)}
        else{window.requestAnimationFrame((deltatime)=>{runn_animation(this,deltatime);})
        }
    }
}

/*function to determen overstepping of keyframes using the current value, the keyframe value and the current step*/
function detekt_overstepping_of_animation_keyframe(value,delta,keyframe_max)
{
	/*Trivial, overstepping is impossible*/
	if(delta==0)
	{
		return 	false;
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
