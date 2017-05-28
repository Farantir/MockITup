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
/*Fixing those relation problems mentiond earlier*/
compile_execute_stuff_after_compiling.resolve_animation_and_logick_relations = function()
{
    for(var rel of unresolved_relations)
    {
        test_logik_transaktions[rel.transaktion].animation_id = rel.animation;
    }
}

/*Saves the logick and the anmation id, so the logick funktion knows, whitch animation to start*/
compile_save_data_to_html.link_logick_to_animations = function()
{
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

/*Creates the logick needet to animate objekts*/
test_logick_effekts["start_animation"] = function(target,unused,id)
{
    /*reciving the id of the target animation*/
    var animation = test_logik_transaktions[id].animation_id;
    console.log(animation);
}
