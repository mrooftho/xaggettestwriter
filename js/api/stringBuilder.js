function stringBuilder(){
    return {
        pathToJsonLocator,
        statePathToJsonLocators,
        actionPathToJsonLocators,
        stateNameFromPath
    };
   function pathToJsonLocator(path) {
       //> channelbar.open.onlastchannel
       //< ['channelbar']['open']['onlastchannel']
       let struct = path.split('.');
       var rStr = '';
       struct.forEach(function (item){
           rStr = rStr + "['" + item + "']";
        });
        return rStr;
    }
    function stateNameFromPath(path){
        return path.split('.')[0];
    }

    function statePathToJsonLocators(path) {
        //> channelbar.open.onlastchannel
        //< ['channelbar']['open']
        //< ['channelbar']['onlastchannel']
        let struct = path.split('.');
        let header = '';
        var arr = [];
        let first = true;
        struct.forEach(function (item){
            if (first){
                first = false;
                header = "states['" + item + "']";
            } else {
                arr.push(header +  "['states']['" + item + "']");
            }
        });
        return arr;
    }
    function actionPathToJsonLocators(path){
        //> remote.arrowUpInApp
        //< remote.arrowUpInApp
        let struct = path.split('.');
        let header = '';
        var arr = [];
        let first = true;
        struct.forEach(function (item){
            if (first){
                first = false;
                header = "actions['" + item + "']";
            } else {
                arr.push(header +  "['" + item + "']");
            }
        });
        return arr;    
    }
}
module.exports = stringBuilder;