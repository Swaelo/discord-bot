//various functions used for various simple tasks

//takes an array of strings and concatenates each one onto the next
//returns a single string which is all the array objects combined
module.exports.combineArgs = function(args)
{
    var combinedArgs = '';
    if(!args || args.length <= 0)
        return combinedArgs;
    for(var i = 0; i < args.length; i++)
        combinedArgs += args[i];
    return combinedArgs;
}
