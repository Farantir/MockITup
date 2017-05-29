/*************************************************************/
/*This file handels most of the compilation of the animations*/
/*it also houses all of the actual animation logick, e.g. the*/
/*actual animation engine                                    */
/*************************************************************/

/*some array needet to fix relation problems later on*/
var unresolved_relations = [];

/*initioalizes the animaton engine*/
compile_read_data_from_html.initialize_animations = function()
{
    compiled_animations = [];
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
        /*Checks wether the logick transaktion already exists or not*/
        if(test_logik_transaktions[attribute_name[2]])
        {
            /*Tells the logick transaktion whitch animation to use*/
            test_logik_transaktions[attribute_name[2]].animation_id = attrigute_value;
        }else
        {
            /*if not, the animation id and the transaktion id need to get stored, so the alorithem can try to fix it later on*/
            unresolved_relations.push({"animation": attrigute_value, "transaktion": attribute_name[2]})
        }        
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
    for(animation of compiled_animations)
    {
        /*resizing each keyframe of each animation*/
        for(keyframe of animation.keyframes)
        {
            keyframe.oldx = keyframe.dx;
            keyframe.oldy = keyframe.dy;
        }
    }
    /*Creates a animation engine for each animation*/
    for(animation of compiled_animations)
    {
        animation.engine = new animation_engine(animation);
    }
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

    /*pauses the animation, whithout resetting it*/
    this.pause = function()
    {
       this.lastframetime = 0;
console.log(this);
    }

    /*runns the animation, gets called each timestepp*/
    this.runn = function(curtime)
    {
        /*determening the delta time (the time between two frames)*/
        if(this.lastframetime == 0) this.lastframetime = curtime;
        deltatime = this.lastframetime - curtime;
        this.lastframetime = curtime;

        var this_keyframe = this.animation.keyframes[this.current_frame];

        /*calculates the distance to be traveld in this frame*/
        var deltax = -(this_keyframe.dx/(this_keyframe.dtime*1000))*deltatime;
        var deltay = -(this_keyframe.dy/(this_keyframe.dtime*1000))*deltatime;

        /*calcualtion needs to be different, ich in reverse mode*/
        if(this.direction == "reverse")
        {
            deltax = -deltax;
            deltay = -deltay;
        }

        /*Ensures the distance travelt is allways maxing out at the max distance of the keyframe, looks komplicatet, but its really just size comparison*/
        /*comperison ist altert, depending on witch direction the animation runns*/
/*Tho folowing part is broken code. new metrik needs to be devised, that detects whether an objekt is moved further than ist next keyframe*/
/****************************************************************/
        if(this.direction == "reverse")
        {
            var nextminx = 0;
            var nextminy = 0;
            if(Math.abs(deltax + this.distance_in_current_frame.x) <= Math.abs(nextminx) || Math.abs(deltay + this.distance_in_current_frame.y) <= Math.abs(nextminy))
            {console.log("stuff happend, y:" + distance_in_current_frame.y + "dy: " + nextminy);
                this.distance_in_current_frame.x = nextminx;
                this.distance_in_current_frame.y = nextminY;
                this.current_frame--;
            }
        } else if(Math.abs(deltax + this.distance_in_current_frame.x) >= Math.abs(this_keyframe.dx) || Math.abs(deltay + this.distance_in_current_frame.y) >= Math.abs(this_keyframe.dy))
        {
            this.distance_in_current_frame.x = this_keyframe.dx;
            this.distance_in_current_frame.y = this_keyframe.dy;
            this.current_frame++;
        }
/***************************************************************/

        this.distance_in_current_frame.x += deltax;
        this.distance_in_current_frame.y += deltay;

        /*So, finaly we come to the actual animation code. using 2d translations to move the element*/
        this.animation.target.style.transform = "translate("+this.distance_in_current_frame.x+"px, "+this.distance_in_current_frame.y+"px)";


        /*stopping the animation if the end of the keyframes is reached*/
        if(this.direction == "reverse" && this.current_frame < 0){this.pause();this.current_frame = 0; console.log("stopped")}
        else if(this.current_frame >= this.animation.keyframes.length){this.pause();this.current_frame = (this.animation.keyframes.length -1)}
        else{window.requestAnimationFrame((deltatime)=>{runn_animation(this,deltatime);})
        }
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
    for(animation of compiled_animations)
    {
        /*resizing each keyframe of each animation*/
        for(keyframe of animation.keyframes)
        {
            keyframe.dx = calculate_ratio(keyframe.oldx,oldwidth,$("testscreencontainer").clientWidth);
            keyframe.dy = calculate_ratio(keyframe.oldy,oldheight,$("testscreencontainer").offsetHeight);
        }
    }
}
